/**
 * Event Logger - логирование событий карточки
 * 
 * Записывает и отображает все события, происходящие
 * в карточке для отладки.
 * 
 * @module devtools/EventLogger
 */

/**
 * Уровни логирования
 */
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

/**
 * Категории событий
 */
export const EVENT_CATEGORIES = {
  LIFECYCLE: 'lifecycle',     // Жизненный цикл карточки
  STATE: 'state',             // Изменения состояния
  USER: 'user',               // Действия пользователя
  RENDER: 'render',           // Рендеринг
  NETWORK: 'network',         // Сетевые запросы
  ERROR: 'error',             // Ошибки
  PERFORMANCE: 'performance'  // Производительность
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  enabled: false,
  maxEntries: 500,
  persistToStorage: false,
  storageKey: 'uc_event_log',
  levels: Object.values(LOG_LEVELS),
  categories: Object.values(EVENT_CATEGORIES),
  showTimestamp: true,
  showCategory: true,
  groupSimilar: true,
  groupTimeout: 1000  // ms для группировки похожих событий
};

/**
 * Класс логгера событий
 */
export class EventLogger {
  constructor(config = {}) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._entries = [];
    this._listeners = new Set();
    this._groupedEvents = new Map();
    this._panel = null;
    this._isVisible = false;
  }

  /**
   * Включает логирование
   */
  enable() {
    this._config.enabled = true;
    this._loadFromStorage();
  }

  /**
   * Выключает логирование
   */
  disable() {
    this._config.enabled = false;
  }

  /**
   * Проверяет, включено ли логирование
   * @returns {boolean}
   */
  isEnabled() {
    return this._config.enabled;
  }

  /**
   * Логирует событие
   * @param {string} level - Уровень логирования
   * @param {string} category - Категория события
   * @param {string} message - Сообщение
   * @param {Object} data - Дополнительные данные
   */
  log(level, category, message, data = {}) {
    if (!this._config.enabled) return;
    if (!this._config.levels.includes(level)) return;
    if (!this._config.categories.includes(category)) return;

    const entry = {
      id: this._generateId(),
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
      stack: level === LOG_LEVELS.ERROR ? new Error().stack : null
    };

    // Группировка похожих событий
    if (this._config.groupSimilar) {
      const key = `${category}:${message}`;
      const existing = this._groupedEvents.get(key);
      
      if (existing && Date.now() - existing.lastTime < this._config.groupTimeout) {
        existing.count++;
        existing.lastTime = Date.now();
        existing.entry.count = existing.count;
        this._notifyListeners('update', existing.entry);
        return;
      }

      this._groupedEvents.set(key, {
        count: 1,
        lastTime: Date.now(),
        entry
      });

      // Очистка старых групп
      setTimeout(() => this._groupedEvents.delete(key), this._config.groupTimeout * 2);
    }

    entry.count = 1;
    this._entries.push(entry);

    // Ограничение количества записей
    if (this._entries.length > this._config.maxEntries) {
      this._entries.shift();
    }

    // Сохранение в storage
    if (this._config.persistToStorage) {
      this._saveToStorage();
    }

    // Уведомление слушателей
    this._notifyListeners('add', entry);

    // Вывод в консоль
    this._logToConsole(entry);
  }

  /**
   * Shortcut методы для разных уровней
   */
  debug(category, message, data) {
    this.log(LOG_LEVELS.DEBUG, category, message, data);
  }

  info(category, message, data) {
    this.log(LOG_LEVELS.INFO, category, message, data);
  }

  warn(category, message, data) {
    this.log(LOG_LEVELS.WARN, category, message, data);
  }

  error(category, message, data) {
    this.log(LOG_LEVELS.ERROR, category, message, data);
  }

  /**
   * Логирует событие жизненного цикла
   * @param {string} event 
   * @param {Object} data 
   */
  lifecycle(event, data = {}) {
    this.info(EVENT_CATEGORIES.LIFECYCLE, event, data);
  }

  /**
   * Логирует изменение состояния
   * @param {string} entityId 
   * @param {*} oldState 
   * @param {*} newState 
   */
  stateChange(entityId, oldState, newState) {
    this.debug(EVENT_CATEGORIES.STATE, `State changed: ${entityId}`, {
      entityId,
      oldState,
      newState,
      changed: oldState !== newState
    });
  }

  /**
   * Логирует действие пользователя
   * @param {string} action 
   * @param {Object} data 
   */
  userAction(action, data = {}) {
    this.info(EVENT_CATEGORIES.USER, action, data);
  }

  /**
   * Логирует рендеринг
   * @param {string} component 
   * @param {number} duration 
   */
  render(component, duration) {
    this.debug(EVENT_CATEGORIES.RENDER, `Rendered: ${component}`, {
      component,
      duration: `${duration.toFixed(2)}ms`
    });
  }

  /**
   * Генерирует уникальный ID
   * @returns {string}
   */
  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Выводит в консоль браузера
   * @param {Object} entry 
   */
  _logToConsole(entry) {
    const prefix = `[UC:${entry.category}]`;
    const style = this._getConsoleStyle(entry.level);

    switch (entry.level) {
      case LOG_LEVELS.DEBUG:
        console.debug(`%c${prefix}`, style, entry.message, entry.data);
        break;
      case LOG_LEVELS.INFO:
        console.info(`%c${prefix}`, style, entry.message, entry.data);
        break;
      case LOG_LEVELS.WARN:
        console.warn(`%c${prefix}`, style, entry.message, entry.data);
        break;
      case LOG_LEVELS.ERROR:
        console.error(`%c${prefix}`, style, entry.message, entry.data);
        if (entry.stack) console.error(entry.stack);
        break;
    }
  }

  /**
   * Получает стиль для консоли
   * @param {string} level 
   * @returns {string}
   */
  _getConsoleStyle(level) {
    const styles = {
      [LOG_LEVELS.DEBUG]: 'color: #888',
      [LOG_LEVELS.INFO]: 'color: #2196f3',
      [LOG_LEVELS.WARN]: 'color: #ff9800',
      [LOG_LEVELS.ERROR]: 'color: #f44336; font-weight: bold'
    };
    return styles[level] || '';
  }

  /**
   * Добавляет слушателя
   * @param {Function} callback 
   */
  addListener(callback) {
    this._listeners.add(callback);
  }

  /**
   * Удаляет слушателя
   * @param {Function} callback 
   */
  removeListener(callback) {
    this._listeners.delete(callback);
  }

  /**
   * Уведомляет слушателей
   * @param {string} type 
   * @param {Object} entry 
   */
  _notifyListeners(type, entry) {
    for (const callback of this._listeners) {
      try {
        callback(type, entry);
      } catch (e) {
        console.error('[EventLogger] Listener error:', e);
      }
    }
  }

  /**
   * Загружает из storage
   */
  _loadFromStorage() {
    if (!this._config.persistToStorage) return;
    
    try {
      const stored = localStorage.getItem(this._config.storageKey);
      if (stored) {
        this._entries = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[EventLogger] Failed to load from storage:', e);
    }
  }

  /**
   * Сохраняет в storage
   */
  _saveToStorage() {
    try {
      localStorage.setItem(this._config.storageKey, JSON.stringify(this._entries));
    } catch (e) {
      console.warn('[EventLogger] Failed to save to storage:', e);
    }
  }

  /**
   * Получает все записи
   * @param {Object} filter - Фильтр { level, category, search }
   * @returns {Object[]}
   */
  getEntries(filter = {}) {
    let result = [...this._entries];

    if (filter.level) {
      result = result.filter(e => e.level === filter.level);
    }

    if (filter.category) {
      result = result.filter(e => e.category === filter.category);
    }

    if (filter.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(e => 
        e.message.toLowerCase().includes(search) ||
        JSON.stringify(e.data).toLowerCase().includes(search)
      );
    }

    return result;
  }

  /**
   * Очищает лог
   */
  clear() {
    this._entries = [];
    this._groupedEvents.clear();
    
    if (this._config.persistToStorage) {
      localStorage.removeItem(this._config.storageKey);
    }

    this._notifyListeners('clear', null);
  }

  /**
   * Экспортирует лог
   * @returns {string}
   */
  export() {
    return JSON.stringify(this._entries, null, 2);
  }

  /**
   * Показывает панель логов
   */
  showPanel() {
    if (this._panel) {
      this._panel.style.display = 'block';
      this._isVisible = true;
      return;
    }

    this._panel = document.createElement('div');
    this._panel.className = 'uc-event-logger-panel';
    this._panel.innerHTML = `
      <div class="uc-logger-header">
        <span class="uc-logger-title">Event Logger</span>
        <div class="uc-logger-controls">
          <select class="uc-logger-filter-level">
            <option value="">All Levels</option>
            ${Object.values(LOG_LEVELS).map(l => `<option value="${l}">${l}</option>`).join('')}
          </select>
          <select class="uc-logger-filter-category">
            <option value="">All Categories</option>
            ${Object.values(EVENT_CATEGORIES).map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
          <button class="uc-logger-btn uc-logger-clear" title="Clear">
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
          <button class="uc-logger-btn uc-logger-export" title="Export">
            <ha-icon icon="mdi:download"></ha-icon>
          </button>
          <button class="uc-logger-btn uc-logger-close" title="Close">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      </div>
      <div class="uc-logger-entries"></div>
    `;

    document.body.appendChild(this._panel);
    this._isVisible = true;

    // Рендерим записи
    this._renderEntries();

    // События
    this._panel.querySelector('.uc-logger-close').addEventListener('click', () => this.hidePanel());
    this._panel.querySelector('.uc-logger-clear').addEventListener('click', () => {
      this.clear();
      this._renderEntries();
    });
    this._panel.querySelector('.uc-logger-export').addEventListener('click', () => this._exportToFile());
    
    this._panel.querySelectorAll('select').forEach(select => {
      select.addEventListener('change', () => this._renderEntries());
    });

    // Подписка на обновления
    this.addListener(() => this._renderEntries());
  }

  /**
   * Скрывает панель
   */
  hidePanel() {
    if (this._panel) {
      this._panel.style.display = 'none';
      this._isVisible = false;
    }
  }

  /**
   * Переключает видимость панели
   */
  togglePanel() {
    if (this._isVisible) {
      this.hidePanel();
    } else {
      this.showPanel();
    }
  }

  /**
   * Рендерит записи в панель
   */
  _renderEntries() {
    if (!this._panel) return;

    const container = this._panel.querySelector('.uc-logger-entries');
    const levelFilter = this._panel.querySelector('.uc-logger-filter-level').value;
    const categoryFilter = this._panel.querySelector('.uc-logger-filter-category').value;

    const entries = this.getEntries({
      level: levelFilter || undefined,
      category: categoryFilter || undefined
    });

    container.innerHTML = entries.reverse().map(entry => `
      <div class="uc-logger-entry uc-logger-${entry.level}">
        <span class="uc-logger-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
        <span class="uc-logger-level">${entry.level}</span>
        <span class="uc-logger-category">${entry.category}</span>
        <span class="uc-logger-message">${entry.message}</span>
        ${entry.count > 1 ? `<span class="uc-logger-count">×${entry.count}</span>` : ''}
        ${Object.keys(entry.data).length > 0 ? `
          <details class="uc-logger-data">
            <summary>Data</summary>
            <pre>${JSON.stringify(entry.data, null, 2)}</pre>
          </details>
        ` : ''}
      </div>
    `).join('');

    // Скролл вниз
    container.scrollTop = 0;
  }

  /**
   * Экспортирует в файл
   */
  _exportToFile() {
    const data = this.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uc-events-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-event-logger-panel {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 500px;
        max-width: 100vw;
        height: 400px;
        background: var(--ha-card-background, #1c1c1c);
        border: 1px solid var(--divider-color);
        border-radius: 12px 0 0 0;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        font-family: monospace;
        font-size: 12px;
        box-shadow: -4px -4px 16px rgba(0, 0, 0, 0.3);
      }

      .uc-logger-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px 0 0 0;
      }

      .uc-logger-title {
        font-weight: 600;
        font-size: 14px;
      }

      .uc-logger-controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .uc-logger-controls select {
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        font-size: 11px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }

      .uc-logger-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-logger-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .uc-logger-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      .uc-logger-entries {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      .uc-logger-entry {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 4px;
        margin-bottom: 4px;
        background: var(--secondary-background-color);
        align-items: baseline;
      }

      .uc-logger-debug { opacity: 0.7; }
      .uc-logger-info .uc-logger-level { color: #2196f3; }
      .uc-logger-warn { background: rgba(255, 152, 0, 0.1); }
      .uc-logger-warn .uc-logger-level { color: #ff9800; }
      .uc-logger-error { background: rgba(244, 67, 54, 0.1); }
      .uc-logger-error .uc-logger-level { color: #f44336; }

      .uc-logger-time {
        color: var(--secondary-text-color);
        font-size: 10px;
      }

      .uc-logger-level {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 10px;
      }

      .uc-logger-category {
        background: var(--primary-color);
        color: white;
        padding: 1px 6px;
        border-radius: 3px;
        font-size: 10px;
      }

      .uc-logger-message {
        flex: 1;
        min-width: 150px;
      }

      .uc-logger-count {
        background: var(--warning-color);
        color: white;
        padding: 1px 6px;
        border-radius: 10px;
        font-size: 10px;
      }

      .uc-logger-data {
        width: 100%;
        margin-top: 4px;
      }

      .uc-logger-data summary {
        cursor: pointer;
        color: var(--secondary-text-color);
        font-size: 11px;
      }

      .uc-logger-data pre {
        margin: 4px 0 0;
        padding: 8px;
        background: var(--code-editor-background-color, #0d0d0d);
        border-radius: 4px;
        overflow-x: auto;
        font-size: 11px;
      }
    `;
  }
}

// Глобальный экземпляр
let instance = null;

/**
 * Получает экземпляр логгера
 * @returns {EventLogger}
 */
export function getLogger() {
  if (!instance) {
    instance = new EventLogger();
  }
  return instance;
}

export default EventLogger;
