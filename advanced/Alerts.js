/**
 * Alerts - система оповещений и порогов
 * 
 * Позволяет настраивать визуальные и звуковые оповещения
 * при достижении определённых значений entity.
 * 
 * @module advanced/Alerts
 */

import { fireEvent } from '../utils/helpers.js';

/**
 * Типы оповещений
 */
export const ALERT_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
  CRITICAL: 'critical'
};

/**
 * Условия срабатывания
 */
export const ALERT_CONDITIONS = {
  ABOVE: 'above',
  BELOW: 'below',
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  BETWEEN: 'between',
  OUTSIDE: 'outside',
  CHANGED: 'changed',
  UNAVAILABLE: 'unavailable'
};

/**
 * Действия при срабатывании
 */
export const ALERT_ACTIONS = {
  BADGE: 'badge',           // Показать бейдж
  BORDER: 'border',         // Подсветить границу
  PULSE: 'pulse',           // Пульсация
  SHAKE: 'shake',           // Тряска
  NOTIFICATION: 'notification', // Всплывающее уведомление
  SOUND: 'sound',           // Звук
  SERVICE: 'service'        // Вызов сервиса HA
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  debounce_time: 1000,      // Минимальный интервал между алертами (мс)
  history_size: 10,         // Сколько алертов хранить в истории
  auto_dismiss: 5000,       // Авто-скрытие уведомления (мс), 0 - не скрывать
  sounds: {
    info: '/local/sounds/info.mp3',
    warning: '/local/sounds/warning.mp3',
    error: '/local/sounds/error.mp3',
    critical: '/local/sounds/critical.mp3'
  }
};

/**
 * Класс для управления оповещениями
 */
export class Alerts {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация алертов
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._alerts = new Map();           // Активные оповещения
    this._history = [];                 // История оповещений
    this._lastTriggerTime = new Map();  // Время последнего срабатывания
    this._entityStates = new Map();     // Предыдущие состояния для отслеживания изменений
    this._container = null;
    this._callbacks = new Set();
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    
    // Проверяем изменения состояний
    this._checkAlerts(oldHass);
  }

  /**
   * Регистрирует оповещение
   * @param {string} id - Уникальный ID оповещения
   * @param {Object} alertConfig - Конфигурация оповещения
   * @returns {string} ID оповещения
   */
  register(id, alertConfig) {
    const alert = {
      id,
      entity_id: alertConfig.entity_id,
      condition: alertConfig.condition || ALERT_CONDITIONS.ABOVE,
      value: alertConfig.value,
      value_min: alertConfig.value_min,
      value_max: alertConfig.value_max,
      type: alertConfig.type || ALERT_TYPES.WARNING,
      message: alertConfig.message,
      actions: alertConfig.actions || [ALERT_ACTIONS.BADGE],
      service: alertConfig.service,
      service_data: alertConfig.service_data,
      enabled: alertConfig.enabled !== false,
      triggered: false
    };

    this._alerts.set(id, alert);
    
    // Инициализируем состояние
    if (this._hass?.states?.[alert.entity_id]) {
      this._entityStates.set(alert.entity_id, this._hass.states[alert.entity_id].state);
    }

    return id;
  }

  /**
   * Удаляет оповещение
   * @param {string} id 
   */
  unregister(id) {
    this._alerts.delete(id);
    this._lastTriggerTime.delete(id);
  }

  /**
   * Включает/выключает оповещение
   * @param {string} id 
   * @param {boolean} enabled 
   */
  setEnabled(id, enabled) {
    const alert = this._alerts.get(id);
    if (alert) {
      alert.enabled = enabled;
      if (!enabled) {
        alert.triggered = false;
      }
    }
  }

  /**
   * Проверяет все оповещения
   * @param {Object} oldHass 
   */
  _checkAlerts(oldHass) {
    if (!this._hass) return;

    for (const [id, alert] of this._alerts) {
      if (!alert.enabled) continue;

      const entityId = alert.entity_id;
      const currentState = this._hass.states?.[entityId];
      const oldState = oldHass?.states?.[entityId];

      if (!currentState) continue;

      // Проверяем условие
      const shouldTrigger = this._evaluateCondition(alert, currentState, oldState);
      
      if (shouldTrigger && !alert.triggered) {
        this._triggerAlert(alert, currentState);
      } else if (!shouldTrigger && alert.triggered) {
        this._clearAlert(alert);
      }
    }
  }

  /**
   * Оценивает условие оповещения
   * @param {Object} alert 
   * @param {Object} currentState 
   * @param {Object} oldState 
   * @returns {boolean}
   */
  _evaluateCondition(alert, currentState, oldState) {
    const state = currentState.state;
    const numValue = parseFloat(state);
    const { condition, value, value_min, value_max } = alert;

    switch (condition) {
      case ALERT_CONDITIONS.ABOVE:
        return !isNaN(numValue) && numValue > value;
        
      case ALERT_CONDITIONS.BELOW:
        return !isNaN(numValue) && numValue < value;
        
      case ALERT_CONDITIONS.EQUALS:
        return state === String(value) || numValue === value;
        
      case ALERT_CONDITIONS.NOT_EQUALS:
        return state !== String(value) && numValue !== value;
        
      case ALERT_CONDITIONS.BETWEEN:
        return !isNaN(numValue) && numValue >= value_min && numValue <= value_max;
        
      case ALERT_CONDITIONS.OUTSIDE:
        return !isNaN(numValue) && (numValue < value_min || numValue > value_max);
        
      case ALERT_CONDITIONS.CHANGED:
        return oldState && oldState.state !== state;
        
      case ALERT_CONDITIONS.UNAVAILABLE:
        return state === 'unavailable' || state === 'unknown';
        
      default:
        return false;
    }
  }

  /**
   * Срабатывает оповещение
   * @param {Object} alert 
   * @param {Object} state 
   */
  _triggerAlert(alert, state) {
    // Проверяем дебаунс
    const lastTrigger = this._lastTriggerTime.get(alert.id);
    const now = Date.now();
    
    if (lastTrigger && now - lastTrigger < this._config.debounce_time) {
      return;
    }

    alert.triggered = true;
    this._lastTriggerTime.set(alert.id, now);

    // Добавляем в историю
    this._addToHistory(alert, state);

    // Выполняем действия
    for (const action of alert.actions) {
      this._executeAction(action, alert, state);
    }

    // Уведомляем подписчиков
    this._notifyCallbacks('triggered', alert, state);
  }

  /**
   * Очищает оповещение
   * @param {Object} alert 
   */
  _clearAlert(alert) {
    alert.triggered = false;
    this._notifyCallbacks('cleared', alert);
  }

  /**
   * Выполняет действие оповещения
   * @param {string} action 
   * @param {Object} alert 
   * @param {Object} state 
   */
  _executeAction(action, alert, state) {
    switch (action) {
      case ALERT_ACTIONS.NOTIFICATION:
        this._showNotification(alert, state);
        break;
        
      case ALERT_ACTIONS.SOUND:
        this._playSound(alert.type);
        break;
        
      case ALERT_ACTIONS.SERVICE:
        this._callService(alert);
        break;
        
      // BADGE, BORDER, PULSE, SHAKE - обрабатываются через CSS классы
      default:
        break;
    }
  }

  /**
   * Показывает уведомление
   * @param {Object} alert 
   * @param {Object} state 
   */
  _showNotification(alert, state) {
    const message = this._formatMessage(alert.message, state);
    
    // Создаём контейнер если нет
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.className = 'uc-alerts-container';
      document.body.appendChild(this._container);
    }

    const notification = document.createElement('div');
    notification.className = `uc-alert-notification uc-alert-${alert.type}`;
    notification.innerHTML = `
      <div class="uc-alert-icon">${this._getIcon(alert.type)}</div>
      <div class="uc-alert-content">
        <div class="uc-alert-title">${state.attributes?.friendly_name || alert.entity_id}</div>
        <div class="uc-alert-message">${message}</div>
      </div>
      <button class="uc-alert-close">×</button>
    `;

    notification.querySelector('.uc-alert-close').addEventListener('click', () => {
      notification.classList.add('uc-alert-hiding');
      setTimeout(() => notification.remove(), 300);
    });

    this._container.appendChild(notification);

    // Автоскрытие
    if (this._config.auto_dismiss > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.classList.add('uc-alert-hiding');
          setTimeout(() => notification.remove(), 300);
        }
      }, this._config.auto_dismiss);
    }
  }

  /**
   * Воспроизводит звук
   * @param {string} type 
   */
  _playSound(type) {
    const soundUrl = this._config.sounds?.[type];
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Игнорируем ошибки автовоспроизведения
      });
    }
  }

  /**
   * Вызывает сервис HA
   * @param {Object} alert 
   */
  _callService(alert) {
    if (!alert.service || !this._hass) return;

    const [domain, service] = alert.service.split('.');
    if (domain && service) {
      this._hass.callService(domain, service, alert.service_data || {});
    }
  }

  /**
   * Форматирует сообщение с подстановкой переменных
   * @param {string} template 
   * @param {Object} state 
   * @returns {string}
   */
  _formatMessage(template, state) {
    if (!template) {
      return `Значение: ${state.state}`;
    }

    return template
      .replace(/\{state\}/g, state.state)
      .replace(/\{entity_id\}/g, state.entity_id)
      .replace(/\{friendly_name\}/g, state.attributes?.friendly_name || state.entity_id)
      .replace(/\{unit\}/g, state.attributes?.unit_of_measurement || '')
      .replace(/\{(\w+)\}/g, (match, attr) => state.attributes?.[attr] || match);
  }

  /**
   * Возвращает иконку для типа оповещения
   * @param {string} type 
   * @returns {string}
   */
  _getIcon(type) {
    const icons = {
      [ALERT_TYPES.INFO]: '💡',
      [ALERT_TYPES.WARNING]: '⚠️',
      [ALERT_TYPES.ERROR]: '❌',
      [ALERT_TYPES.SUCCESS]: '✅',
      [ALERT_TYPES.CRITICAL]: '🚨'
    };
    return icons[type] || '📢';
  }

  /**
   * Добавляет запись в историю
   * @param {Object} alert 
   * @param {Object} state 
   */
  _addToHistory(alert, state) {
    this._history.unshift({
      id: alert.id,
      type: alert.type,
      entity_id: alert.entity_id,
      state: state.state,
      message: this._formatMessage(alert.message, state),
      timestamp: new Date()
    });

    // Ограничиваем размер истории
    if (this._history.length > this._config.history_size) {
      this._history.pop();
    }
  }

  /**
   * Возвращает историю оповещений
   * @returns {Array}
   */
  getHistory() {
    return [...this._history];
  }

  /**
   * Возвращает активные оповещения
   * @returns {Array}
   */
  getActiveAlerts() {
    return Array.from(this._alerts.values()).filter(a => a.triggered);
  }

  /**
   * Подписывается на события оповещений
   * @param {Function} callback 
   * @returns {Function} Функция отписки
   */
  subscribe(callback) {
    this._callbacks.add(callback);
    return () => this._callbacks.delete(callback);
  }

  /**
   * Уведомляет подписчиков
   * @param {string} event 
   * @param {Object} alert 
   * @param {Object} state 
   */
  _notifyCallbacks(event, alert, state = null) {
    for (const callback of this._callbacks) {
      try {
        callback(event, alert, state);
      } catch (error) {
        console.error('[Alerts] Callback error:', error);
      }
    }
  }

  /**
   * Возвращает CSS классы для элемента на основе оповещений
   * @param {string} entityId 
   * @returns {string[]}
   */
  getClassesForEntity(entityId) {
    const classes = [];
    
    for (const alert of this._alerts.values()) {
      if (alert.entity_id === entityId && alert.triggered) {
        classes.push(`uc-alert-active`);
        classes.push(`uc-alert-type-${alert.type}`);
        
        for (const action of alert.actions) {
          if ([ALERT_ACTIONS.BORDER, ALERT_ACTIONS.PULSE, ALERT_ACTIONS.SHAKE].includes(action)) {
            classes.push(`uc-alert-${action}`);
          }
        }
      }
    }

    return classes;
  }

  /**
   * Очищает все оповещения
   */
  clearAll() {
    for (const alert of this._alerts.values()) {
      alert.triggered = false;
    }
    this._history = [];
  }

  /**
   * Уничтожает систему оповещений
   */
  destroy() {
    this._alerts.clear();
    this._history = [];
    this._lastTriggerTime.clear();
    this._entityStates.clear();
    this._callbacks.clear();
    
    if (this._container) {
      this._container.remove();
      this._container = null;
    }
  }

  /**
   * Возвращает CSS стили для оповещений
   * @returns {string}
   */
  static getStyles() {
    return `
      /* Контейнер уведомлений */
      .uc-alerts-container {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 400px;
        pointer-events: none;
      }

      /* Уведомление */
      .uc-alert-notification {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 12px;
        background: var(--ha-card-background, white);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        animation: uc-alert-slide-in 0.3s ease-out;
        pointer-events: auto;
        border-left: 4px solid;
      }

      .uc-alert-notification.uc-alert-hiding {
        animation: uc-alert-slide-out 0.3s ease-out forwards;
      }

      @keyframes uc-alert-slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes uc-alert-slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      /* Типы оповещений */
      .uc-alert-info {
        border-color: var(--info-color, #2196f3);
      }

      .uc-alert-warning {
        border-color: var(--warning-color, #ff9800);
      }

      .uc-alert-error {
        border-color: var(--error-color, #f44336);
      }

      .uc-alert-success {
        border-color: var(--success-color, #4caf50);
      }

      .uc-alert-critical {
        border-color: #d32f2f;
        background: linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, transparent 100%);
      }

      .uc-alert-icon {
        font-size: 20px;
        line-height: 1;
        flex-shrink: 0;
      }

      .uc-alert-content {
        flex: 1;
        min-width: 0;
      }

      .uc-alert-title {
        font-weight: 600;
        font-size: 14px;
        color: var(--primary-text-color);
        margin-bottom: 2px;
      }

      .uc-alert-message {
        font-size: 13px;
        color: var(--secondary-text-color);
        word-wrap: break-word;
      }

      .uc-alert-close {
        background: none;
        border: none;
        font-size: 20px;
        line-height: 1;
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 0;
        opacity: 0.5;
        transition: opacity 0.2s;
      }

      .uc-alert-close:hover {
        opacity: 1;
      }

      /* Классы для элементов с оповещениями */
      .uc-alert-active {
        position: relative;
      }

      .uc-alert-border {
        box-shadow: 0 0 0 2px var(--error-color, #f44336) !important;
      }

      .uc-alert-type-warning.uc-alert-border {
        box-shadow: 0 0 0 2px var(--warning-color, #ff9800) !important;
      }

      .uc-alert-type-critical.uc-alert-border {
        box-shadow: 0 0 0 3px #d32f2f !important;
      }

      .uc-alert-pulse {
        animation: uc-pulse 2s infinite;
      }

      @keyframes uc-pulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
        }
      }

      .uc-alert-shake {
        animation: uc-shake 0.5s ease-in-out;
      }

      @keyframes uc-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `;
  }
}

export default Alerts;
