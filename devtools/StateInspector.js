/**
 * State Inspector - инспектор состояния карточки
 * 
 * Позволяет просматривать и изменять внутреннее
 * состояние карточки в реальном времени.
 * 
 * @module devtools/StateInspector
 */

import { fireEvent } from '../utils/helpers.js';

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  enabled: false,
  watchHass: true,
  watchConfig: true,
  watchInternal: true,
  highlightChanges: true,
  changeHighlightDuration: 1000
};

/**
 * Класс инспектора состояния
 */
export class StateInspector {
  /**
   * @param {HTMLElement} cardElement - Элемент карточки
   * @param {Object} config - Конфигурация
   */
  constructor(cardElement, config = {}) {
    this._cardElement = cardElement;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._panel = null;
    this._isVisible = false;
    this._state = {
      hass: null,
      config: null,
      internal: {}
    };
    this._previousState = {};
    this._watchers = new Map();
    this._updateInterval = null;
  }

  /**
   * Включает инспектор
   */
  enable() {
    this._config.enabled = true;
    this._startWatching();
  }

  /**
   * Выключает инспектор
   */
  disable() {
    this._config.enabled = false;
    this._stopWatching();
  }

  /**
   * Устанавливает состояние hass
   * @param {Object} hass 
   */
  setHass(hass) {
    this._state.hass = hass;
    this._checkChanges('hass');
  }

  /**
   * Устанавливает конфиг
   * @param {Object} config 
   */
  setConfig(config) {
    this._state.config = config;
    this._checkChanges('config');
  }

  /**
   * Устанавливает внутреннее состояние
   * @param {string} key 
   * @param {*} value 
   */
  setInternal(key, value) {
    this._state.internal[key] = value;
    this._checkChanges(`internal.${key}`);
  }

  /**
   * Получает состояние
   * @param {string} path - Путь к значению (dot notation)
   * @returns {*}
   */
  get(path) {
    return this._getByPath(this._state, path);
  }

  /**
   * Добавляет watcher
   * @param {string} path - Путь для отслеживания
   * @param {Function} callback 
   */
  watch(path, callback) {
    if (!this._watchers.has(path)) {
      this._watchers.set(path, new Set());
    }
    this._watchers.get(path).add(callback);
  }

  /**
   * Удаляет watcher
   * @param {string} path 
   * @param {Function} callback 
   */
  unwatch(path, callback) {
    const watchers = this._watchers.get(path);
    if (watchers) {
      watchers.delete(callback);
    }
  }

  /**
   * Проверяет изменения и уведомляет watchers
   * @param {string} changedPath 
   */
  _checkChanges(changedPath) {
    if (!this._config.enabled) return;

    const currentValue = this.get(changedPath);
    const previousValue = this._getByPath(this._previousState, changedPath);

    if (JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
      // Уведомляем watchers
      for (const [path, callbacks] of this._watchers) {
        if (changedPath.startsWith(path) || path.startsWith(changedPath)) {
          for (const callback of callbacks) {
            try {
              callback(currentValue, previousValue, changedPath);
            } catch (e) {
              console.error('[StateInspector] Watcher error:', e);
            }
          }
        }
      }

      // Обновляем previous state
      this._setByPath(this._previousState, changedPath, JSON.parse(JSON.stringify(currentValue)));

      // Обновляем UI если открыта панель
      if (this._isVisible) {
        this._updatePanel(changedPath);
      }
    }
  }

  /**
   * Получает значение по пути
   * @param {Object} obj 
   * @param {string} path 
   * @returns {*}
   */
  _getByPath(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Устанавливает значение по пути
   * @param {Object} obj 
   * @param {string} path 
   * @param {*} value 
   */
  _setByPath(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Запускает отслеживание
   */
  _startWatching() {
    this._stopWatching();
    
    this._updateInterval = setInterval(() => {
      if (this._isVisible) {
        this._renderPanel();
      }
    }, 1000);
  }

  /**
   * Останавливает отслеживание
   */
  _stopWatching() {
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = null;
    }
  }

  /**
   * Показывает панель инспектора
   */
  showPanel() {
    if (this._panel) {
      this._panel.style.display = 'flex';
      this._isVisible = true;
      this._renderPanel();
      return;
    }

    this._panel = document.createElement('div');
    this._panel.className = 'uc-state-inspector-panel';
    this._panel.innerHTML = `
      <div class="uc-inspector-header">
        <span class="uc-inspector-title">State Inspector</span>
        <div class="uc-inspector-controls">
          <button class="uc-inspector-btn uc-inspector-refresh" title="Refresh">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </button>
          <button class="uc-inspector-btn uc-inspector-copy" title="Copy State">
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button class="uc-inspector-btn uc-inspector-close" title="Close">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      </div>
      <div class="uc-inspector-tabs">
        <button class="uc-inspector-tab active" data-tab="config">Config</button>
        <button class="uc-inspector-tab" data-tab="hass">Hass</button>
        <button class="uc-inspector-tab" data-tab="internal">Internal</button>
        <button class="uc-inspector-tab" data-tab="entities">Entities</button>
      </div>
      <div class="uc-inspector-content"></div>
      <div class="uc-inspector-footer">
        <input type="text" class="uc-inspector-search" placeholder="Search state..." />
      </div>
    `;

    document.body.appendChild(this._panel);
    this._isVisible = true;

    // События
    this._panel.querySelector('.uc-inspector-close').addEventListener('click', () => this.hidePanel());
    this._panel.querySelector('.uc-inspector-refresh').addEventListener('click', () => this._renderPanel());
    this._panel.querySelector('.uc-inspector-copy').addEventListener('click', () => this._copyState());

    this._panel.querySelectorAll('.uc-inspector-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this._panel.querySelectorAll('.uc-inspector-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this._renderPanel();
      });
    });

    this._panel.querySelector('.uc-inspector-search').addEventListener('input', (e) => {
      this._renderPanel(e.target.value);
    });

    this._renderPanel();
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
   * Переключает видимость
   */
  togglePanel() {
    if (this._isVisible) {
      this.hidePanel();
    } else {
      this.showPanel();
    }
  }

  /**
   * Рендерит содержимое панели
   * @param {string} searchQuery 
   */
  _renderPanel(searchQuery = '') {
    if (!this._panel) return;

    const activeTab = this._panel.querySelector('.uc-inspector-tab.active')?.dataset.tab || 'config';
    const content = this._panel.querySelector('.uc-inspector-content');

    let data;
    switch (activeTab) {
      case 'config':
        data = this._state.config;
        break;
      case 'hass':
        data = this._getHassInfo();
        break;
      case 'internal':
        data = this._state.internal;
        break;
      case 'entities':
        data = this._getEntitiesInfo();
        break;
    }

    content.innerHTML = this._renderObject(data, '', searchQuery);
    
    // Привязываем клики для раскрытия
    content.querySelectorAll('.uc-inspector-key').forEach(key => {
      key.addEventListener('click', () => {
        const children = key.nextElementSibling;
        if (children?.classList.contains('uc-inspector-children')) {
          children.classList.toggle('collapsed');
          key.classList.toggle('collapsed');
        }
      });
    });

    // Привязываем редактирование
    content.querySelectorAll('.uc-inspector-value[contenteditable]').forEach(el => {
      el.addEventListener('blur', () => {
        const path = el.dataset.path;
        const newValue = this._parseValue(el.textContent);
        this._setValue(path, newValue);
      });
    });
  }

  /**
   * Обновляет панель при изменении
   * @param {string} changedPath 
   */
  _updatePanel(changedPath) {
    if (!this._panel || !this._isVisible) return;

    // Находим элемент и подсвечиваем
    const element = this._panel.querySelector(`[data-path="${changedPath}"]`);
    if (element && this._config.highlightChanges) {
      element.classList.add('changed');
      setTimeout(() => {
        element.classList.remove('changed');
      }, this._config.changeHighlightDuration);
    }

    this._renderPanel();
  }

  /**
   * Рендерит объект в HTML
   * @param {*} obj 
   * @param {string} path 
   * @param {string} searchQuery 
   * @param {number} depth 
   * @returns {string}
   */
  _renderObject(obj, path = '', searchQuery = '', depth = 0) {
    if (obj === null) return '<span class="uc-inspector-null">null</span>';
    if (obj === undefined) return '<span class="uc-inspector-undefined">undefined</span>';

    if (typeof obj !== 'object') {
      return this._renderPrimitive(obj, path);
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '<span class="uc-inspector-array">[]</span>';
      
      const items = obj.map((item, index) => {
        const itemPath = path ? `${path}[${index}]` : `[${index}]`;
        return `
          <div class="uc-inspector-item">
            <span class="uc-inspector-index">${index}:</span>
            ${this._renderObject(item, itemPath, searchQuery, depth + 1)}
          </div>
        `;
      }).join('');

      return `
        <span class="uc-inspector-array-bracket">[</span>
        <div class="uc-inspector-children ${depth > 1 ? 'collapsed' : ''}">${items}</div>
        <span class="uc-inspector-array-bracket">]</span>
      `;
    }

    const keys = Object.keys(obj);
    if (keys.length === 0) return '<span class="uc-inspector-object">{}</span>';

    const items = keys
      .filter(key => {
        if (!searchQuery) return true;
        const itemPath = path ? `${path}.${key}` : key;
        return itemPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
               JSON.stringify(obj[key]).toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map(key => {
        const itemPath = path ? `${path}.${key}` : key;
        return `
          <div class="uc-inspector-item">
            <span class="uc-inspector-key ${depth > 1 ? 'collapsed' : ''}">${key}:</span>
            ${this._renderObject(obj[key], itemPath, searchQuery, depth + 1)}
          </div>
        `;
      }).join('');

    return `
      <span class="uc-inspector-object-bracket">{</span>
      <div class="uc-inspector-children ${depth > 1 ? 'collapsed' : ''}">${items}</div>
      <span class="uc-inspector-object-bracket">}</span>
    `;
  }

  /**
   * Рендерит примитивное значение
   * @param {*} value 
   * @param {string} path 
   * @returns {string}
   */
  _renderPrimitive(value, path) {
    const type = typeof value;
    const editable = path.startsWith('internal') || path.startsWith('config');
    
    if (type === 'string') {
      return `<span class="uc-inspector-value uc-inspector-string" 
                    data-path="${path}" 
                    ${editable ? 'contenteditable="true"' : ''}>"${value}"</span>`;
    }
    if (type === 'number') {
      return `<span class="uc-inspector-value uc-inspector-number" 
                    data-path="${path}"
                    ${editable ? 'contenteditable="true"' : ''}>${value}</span>`;
    }
    if (type === 'boolean') {
      return `<span class="uc-inspector-value uc-inspector-boolean" 
                    data-path="${path}"
                    ${editable ? 'contenteditable="true"' : ''}>${value}</span>`;
    }
    return `<span class="uc-inspector-value">${String(value)}</span>`;
  }

  /**
   * Получает информацию о hass
   * @returns {Object}
   */
  _getHassInfo() {
    if (!this._state.hass) return null;

    return {
      connected: this._state.hass.connected,
      language: this._state.hass.language,
      user: this._state.hass.user?.name,
      themes: Object.keys(this._state.hass.themes?.themes || {}),
      panelUrl: this._state.hass.panelUrl
    };
  }

  /**
   * Получает информацию об entities
   * @returns {Object}
   */
  _getEntitiesInfo() {
    const config = this._state.config;
    const hass = this._state.hass;
    
    if (!config || !hass) return {};

    const entities = {};
    
    // Основной entity
    if (config.entity) {
      entities[config.entity] = hass.states?.[config.entity];
    }

    // Entities из cards
    const extractEntities = (cards) => {
      if (!cards) return;
      for (const card of cards) {
        if (card.entity) {
          entities[card.entity] = hass.states?.[card.entity];
        }
        if (card.entities) {
          for (const e of card.entities) {
            const entityId = typeof e === 'string' ? e : e.entity;
            entities[entityId] = hass.states?.[entityId];
          }
        }
        if (card.cards) {
          extractEntities(card.cards);
        }
      }
    };

    extractEntities(config.cards);

    return entities;
  }

  /**
   * Парсит значение из строки
   * @param {string} str 
   * @returns {*}
   */
  _parseValue(str) {
    str = str.trim();
    
    // Boolean
    if (str === 'true') return true;
    if (str === 'false') return false;
    
    // Null
    if (str === 'null') return null;
    
    // Number
    const num = Number(str);
    if (!isNaN(num) && str !== '') return num;
    
    // String (remove quotes)
    if (str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1);
    }
    
    // Try JSON
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }

  /**
   * Устанавливает значение
   * @param {string} path 
   * @param {*} value 
   */
  _setValue(path, value) {
    if (path.startsWith('internal.')) {
      const key = path.replace('internal.', '');
      this.setInternal(key, value);
    } else if (path.startsWith('config.')) {
      // Для config отправляем событие
      fireEvent(this._cardElement, 'config-changed', {
        config: this._state.config
      });
    }
  }

  /**
   * Копирует состояние в буфер
   */
  _copyState() {
    const state = JSON.stringify(this._state, null, 2);
    navigator.clipboard.writeText(state).then(() => {
      // Показываем уведомление
      const btn = this._panel.querySelector('.uc-inspector-copy');
      btn.innerHTML = '<ha-icon icon="mdi:check"></ha-icon>';
      setTimeout(() => {
        btn.innerHTML = '<ha-icon icon="mdi:content-copy"></ha-icon>';
      }, 1000);
    });
  }

  /**
   * Уничтожает инспектор
   */
  destroy() {
    this._stopWatching();
    this._watchers.clear();
    
    if (this._panel) {
      this._panel.remove();
      this._panel = null;
    }
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-state-inspector-panel {
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 400px;
        max-width: calc(100vw - 40px);
        max-height: 80vh;
        background: var(--ha-card-background, #1c1c1c);
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        font-family: monospace;
        font-size: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      .uc-inspector-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px 12px 0 0;
      }

      .uc-inspector-title {
        font-weight: 600;
        font-size: 14px;
      }

      .uc-inspector-controls {
        display: flex;
        gap: 4px;
      }

      .uc-inspector-btn {
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

      .uc-inspector-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .uc-inspector-tabs {
        display: flex;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-inspector-tab {
        flex: 1;
        padding: 8px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s;
      }

      .uc-inspector-tab:hover {
        background: var(--secondary-background-color);
      }

      .uc-inspector-tab.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }

      .uc-inspector-content {
        flex: 1;
        overflow: auto;
        padding: 12px;
        min-height: 200px;
      }

      .uc-inspector-footer {
        padding: 8px;
        border-top: 1px solid var(--divider-color);
      }

      .uc-inspector-search {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        font-size: 12px;
      }

      .uc-inspector-item {
        margin-left: 12px;
      }

      .uc-inspector-key {
        color: var(--primary-color);
        cursor: pointer;
      }

      .uc-inspector-key::before {
        content: '▼';
        display: inline-block;
        width: 12px;
        font-size: 8px;
        transition: transform 0.2s;
      }

      .uc-inspector-key.collapsed::before {
        transform: rotate(-90deg);
      }

      .uc-inspector-children.collapsed {
        display: none;
      }

      .uc-inspector-index {
        color: var(--secondary-text-color);
      }

      .uc-inspector-string { color: #ce9178; }
      .uc-inspector-number { color: #b5cea8; }
      .uc-inspector-boolean { color: #569cd6; }
      .uc-inspector-null { color: #569cd6; }
      .uc-inspector-undefined { color: #808080; }

      .uc-inspector-value[contenteditable] {
        cursor: text;
        border-radius: 2px;
        padding: 0 2px;
      }

      .uc-inspector-value[contenteditable]:focus {
        outline: 1px solid var(--primary-color);
        background: var(--secondary-background-color);
      }

      .uc-inspector-value.changed {
        animation: uc-inspector-highlight 1s ease;
      }

      @keyframes uc-inspector-highlight {
        0% { background: var(--warning-color); }
        100% { background: transparent; }
      }
    `;
  }
}

export default StateInspector;
