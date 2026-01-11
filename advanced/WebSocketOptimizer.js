/**
 * WebSocket Optimizer - оптимизация работы с WebSocket
 * 
 * Управляет подписками на обновления Home Assistant,
 * группирует обновления и применяет throttling для
 * предотвращения перегрузки при большом количестве карточек.
 * 
 * @module advanced/WebSocketOptimizer
 */

import { throttle, debounce } from '../utils/performance.js';

/**
 * Стратегии обновления
 */
export const UPDATE_STRATEGIES = {
  IMMEDIATE: 'immediate',       // Мгновенное обновление
  THROTTLED: 'throttled',       // Ограниченная частота
  BATCHED: 'batched',           // Группировка обновлений
  ON_DEMAND: 'on_demand',       // По запросу
  VISIBLE_ONLY: 'visible_only'  // Только видимые
};

/**
 * Приоритеты обновлений
 */
export const UPDATE_PRIORITY = {
  CRITICAL: 0,    // Немедленное обновление
  HIGH: 1,        // Высокий приоритет
  NORMAL: 2,      // Обычный приоритет
  LOW: 3,         // Низкий приоритет
  BACKGROUND: 4   // Фоновое обновление
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  strategy: UPDATE_STRATEGIES.THROTTLED,
  throttleMs: 100,        // Минимальный интервал между обновлениями
  batchDelayMs: 50,       // Задержка для группировки
  maxBatchSize: 50,       // Максимальный размер батча
  visibilityThreshold: 0.1,  // Порог видимости для VISIBLE_ONLY
  priorityThrottles: {    // Throttle по приоритетам
    [UPDATE_PRIORITY.CRITICAL]: 0,
    [UPDATE_PRIORITY.HIGH]: 50,
    [UPDATE_PRIORITY.NORMAL]: 100,
    [UPDATE_PRIORITY.LOW]: 250,
    [UPDATE_PRIORITY.BACKGROUND]: 500
  }
};

/**
 * Класс-синглтон для оптимизации WebSocket обновлений
 */
class WebSocketOptimizerClass {
  constructor() {
    this._config = { ...DEFAULT_CONFIG };
    this._subscribers = new Map();       // entityId -> Set<{callback, priority, element}>
    this._pendingUpdates = new Map();    // entityId -> newState
    this._batchTimeout = null;
    this._lastUpdateTime = new Map();    // entityId -> timestamp
    this._visibilityObserver = null;
    this._visibleElements = new WeakSet();
    this._metrics = {
      totalUpdates: 0,
      throttledUpdates: 0,
      batchedUpdates: 0,
      skippedUpdates: 0
    };
  }

  /**
   * Устанавливает конфигурацию
   * @param {Object} config 
   */
  configure(config) {
    this._config = { ...this._config, ...config };
  }

  /**
   * Подписывается на обновления entity
   * @param {string} entityId - ID entity
   * @param {Function} callback - Функция обратного вызова
   * @param {Object} options - Опции подписки
   * @returns {Function} Функция отписки
   */
  subscribe(entityId, callback, options = {}) {
    const subscription = {
      callback,
      priority: options.priority ?? UPDATE_PRIORITY.NORMAL,
      element: options.element,
      strategy: options.strategy ?? this._config.strategy
    };

    if (!this._subscribers.has(entityId)) {
      this._subscribers.set(entityId, new Set());
    }
    
    this._subscribers.get(entityId).add(subscription);

    // Наблюдение за видимостью элемента
    if (options.element && subscription.strategy === UPDATE_STRATEGIES.VISIBLE_ONLY) {
      this._observeVisibility(options.element);
    }

    // Возвращаем функцию отписки
    return () => {
      this._unsubscribe(entityId, subscription);
    };
  }

  /**
   * Отписывается от обновлений
   * @param {string} entityId 
   * @param {Object} subscription 
   */
  _unsubscribe(entityId, subscription) {
    const subs = this._subscribers.get(entityId);
    if (subs) {
      subs.delete(subscription);
      if (subs.size === 0) {
        this._subscribers.delete(entityId);
      }
    }

    if (subscription.element) {
      this._unobserveVisibility(subscription.element);
    }
  }

  /**
   * Получает обновление от Home Assistant
   * @param {Object} oldHass 
   * @param {Object} newHass 
   */
  processHassUpdate(oldHass, newHass) {
    if (!newHass?.states) return;

    const changedEntities = [];

    // Определяем изменившиеся entity
    for (const entityId of this._subscribers.keys()) {
      const oldState = oldHass?.states?.[entityId];
      const newState = newHass?.states?.[entityId];

      if (this._hasStateChanged(oldState, newState)) {
        changedEntities.push({ entityId, newState });
      }
    }

    if (changedEntities.length === 0) return;

    // Обрабатываем в зависимости от стратегии
    switch (this._config.strategy) {
      case UPDATE_STRATEGIES.IMMEDIATE:
        this._processImmediate(changedEntities);
        break;
        
      case UPDATE_STRATEGIES.THROTTLED:
        this._processThrottled(changedEntities);
        break;
        
      case UPDATE_STRATEGIES.BATCHED:
        this._processBatched(changedEntities);
        break;
        
      default:
        this._processThrottled(changedEntities);
    }
  }

  /**
   * Проверяет изменение состояния
   * @param {Object} oldState 
   * @param {Object} newState 
   * @returns {boolean}
   */
  _hasStateChanged(oldState, newState) {
    if (!oldState && newState) return true;
    if (oldState && !newState) return true;
    if (!oldState && !newState) return false;
    
    // Быстрая проверка
    if (oldState.state !== newState.state) return true;
    if (oldState.last_changed !== newState.last_changed) return true;
    
    // Глубокая проверка атрибутов (только если нужно)
    // return JSON.stringify(oldState.attributes) !== JSON.stringify(newState.attributes);
    
    return false;
  }

  /**
   * Немедленная обработка
   * @param {Array} changedEntities 
   */
  _processImmediate(changedEntities) {
    for (const { entityId, newState } of changedEntities) {
      this._notifySubscribers(entityId, newState);
    }
    this._metrics.totalUpdates += changedEntities.length;
  }

  /**
   * Throttled обработка
   * @param {Array} changedEntities 
   */
  _processThrottled(changedEntities) {
    const now = Date.now();

    for (const { entityId, newState } of changedEntities) {
      const subs = this._subscribers.get(entityId);
      if (!subs) continue;

      // Определяем минимальный приоритет среди подписчиков
      let minPriority = UPDATE_PRIORITY.BACKGROUND;
      for (const sub of subs) {
        if (sub.priority < minPriority) {
          minPriority = sub.priority;
        }
      }

      const throttleTime = this._config.priorityThrottles[minPriority] ?? this._config.throttleMs;
      const lastUpdate = this._lastUpdateTime.get(entityId) || 0;

      if (now - lastUpdate >= throttleTime) {
        this._notifySubscribers(entityId, newState);
        this._lastUpdateTime.set(entityId, now);
        this._metrics.totalUpdates++;
      } else {
        // Откладываем обновление
        this._pendingUpdates.set(entityId, newState);
        this._scheduleDeferredUpdate(entityId, throttleTime - (now - lastUpdate));
        this._metrics.throttledUpdates++;
      }
    }
  }

  /**
   * Батчевая обработка
   * @param {Array} changedEntities 
   */
  _processBatched(changedEntities) {
    for (const { entityId, newState } of changedEntities) {
      this._pendingUpdates.set(entityId, newState);
    }

    this._metrics.batchedUpdates += changedEntities.length;

    // Планируем обработку батча
    if (!this._batchTimeout) {
      this._batchTimeout = setTimeout(() => {
        this._processBatch();
      }, this._config.batchDelayMs);
    }
  }

  /**
   * Обрабатывает накопленный батч
   */
  _processBatch() {
    this._batchTimeout = null;

    // Ограничиваем размер батча
    const entries = Array.from(this._pendingUpdates.entries())
      .slice(0, this._config.maxBatchSize);

    // Используем requestAnimationFrame для синхронизации с рендерингом
    requestAnimationFrame(() => {
      for (const [entityId, newState] of entries) {
        this._notifySubscribers(entityId, newState);
        this._pendingUpdates.delete(entityId);
      }
      this._metrics.totalUpdates += entries.length;
    });

    // Если остались необработанные - планируем следующий батч
    if (this._pendingUpdates.size > 0) {
      this._batchTimeout = setTimeout(() => {
        this._processBatch();
      }, this._config.batchDelayMs);
    }
  }

  /**
   * Планирует отложенное обновление
   * @param {string} entityId 
   * @param {number} delay 
   */
  _scheduleDeferredUpdate(entityId, delay) {
    setTimeout(() => {
      const newState = this._pendingUpdates.get(entityId);
      if (newState) {
        this._notifySubscribers(entityId, newState);
        this._pendingUpdates.delete(entityId);
        this._lastUpdateTime.set(entityId, Date.now());
      }
    }, delay);
  }

  /**
   * Уведомляет подписчиков об обновлении
   * @param {string} entityId 
   * @param {Object} newState 
   */
  _notifySubscribers(entityId, newState) {
    const subs = this._subscribers.get(entityId);
    if (!subs) return;

    for (const sub of subs) {
      // Проверяем видимость для VISIBLE_ONLY
      if (sub.strategy === UPDATE_STRATEGIES.VISIBLE_ONLY && 
          sub.element && !this._visibleElements.has(sub.element)) {
        this._metrics.skippedUpdates++;
        continue;
      }

      try {
        sub.callback(newState);
      } catch (error) {
        console.error(`[WebSocketOptimizer] Callback error for ${entityId}:`, error);
      }
    }
  }

  /**
   * Настраивает наблюдение за видимостью
   * @param {HTMLElement} element 
   */
  _observeVisibility(element) {
    if (!this._visibilityObserver) {
      this._visibilityObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this._visibleElements.add(entry.target);
            } else {
              this._visibleElements.delete(entry.target);
            }
          }
        },
        { threshold: this._config.visibilityThreshold }
      );
    }

    this._visibilityObserver.observe(element);
  }

  /**
   * Прекращает наблюдение за видимостью
   * @param {HTMLElement} element 
   */
  _unobserveVisibility(element) {
    if (this._visibilityObserver) {
      this._visibilityObserver.unobserve(element);
    }
    this._visibleElements.delete(element);
  }

  /**
   * Принудительно обновляет все подписки entity
   * @param {string} entityId 
   * @param {Object} state 
   */
  forceUpdate(entityId, state) {
    this._notifySubscribers(entityId, state);
    this._lastUpdateTime.set(entityId, Date.now());
  }

  /**
   * Очищает все отложенные обновления
   */
  flush() {
    if (this._batchTimeout) {
      clearTimeout(this._batchTimeout);
      this._batchTimeout = null;
    }
    
    // Обрабатываем все pending обновления
    for (const [entityId, newState] of this._pendingUpdates) {
      this._notifySubscribers(entityId, newState);
    }
    
    this._pendingUpdates.clear();
  }

  /**
   * Получает метрики производительности
   * @returns {Object}
   */
  getMetrics() {
    return {
      ...this._metrics,
      activeSubscriptions: this._subscribers.size,
      pendingUpdates: this._pendingUpdates.size,
      efficiency: this._metrics.totalUpdates > 0 
        ? ((this._metrics.totalUpdates - this._metrics.throttledUpdates) / this._metrics.totalUpdates * 100).toFixed(1) + '%'
        : '100%'
    };
  }

  /**
   * Сбрасывает метрики
   */
  resetMetrics() {
    this._metrics = {
      totalUpdates: 0,
      throttledUpdates: 0,
      batchedUpdates: 0,
      skippedUpdates: 0
    };
  }

  /**
   * Уничтожает оптимизатор
   */
  destroy() {
    this.flush();
    this._subscribers.clear();
    this._lastUpdateTime.clear();
    
    if (this._visibilityObserver) {
      this._visibilityObserver.disconnect();
      this._visibilityObserver = null;
    }
  }
}

// Singleton instance
let instance = null;

/**
 * Получает экземпляр оптимизатора
 * @returns {WebSocketOptimizerClass}
 */
export function getWebSocketOptimizer() {
  if (!instance) {
    instance = new WebSocketOptimizerClass();
  }
  return instance;
}

/**
 * Создаёт новый экземпляр (для тестирования)
 * @returns {WebSocketOptimizerClass}
 */
export function createWebSocketOptimizer() {
  return new WebSocketOptimizerClass();
}

/**
 * Хелпер для создания throttled callback
 * @param {Function} callback 
 * @param {number} delay 
 * @returns {Function}
 */
export function createThrottledCallback(callback, delay = 100) {
  return throttle(callback, delay);
}

/**
 * Хелпер для создания debounced callback
 * @param {Function} callback 
 * @param {number} delay 
 * @returns {Function}
 */
export function createDebouncedCallback(callback, delay = 100) {
  return debounce(callback, delay);
}

export { WebSocketOptimizerClass };
export default getWebSocketOptimizer;
