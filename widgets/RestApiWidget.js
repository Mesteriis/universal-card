/**
 * REST API Widget - виджет для отображения данных из REST API
 * 
 * Позволяет загружать и отображать данные из внешних API
 * с поддержкой трансформации, кэширования и автообновления.
 * 
 * @module widgets/RestApiWidget
 */

import { debounce } from '../utils/performance.js';

/**
 * Методы HTTP запросов
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

/**
 * Форматы отображения
 */
export const DISPLAY_FORMATS = {
  RAW: 'raw',           // Сырой JSON
  VALUE: 'value',       // Одно значение
  TABLE: 'table',       // Таблица
  LIST: 'list',         // Список
  TEMPLATE: 'template', // Шаблон
  CHART: 'chart'        // График (простой)
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  url: '',
  method: HTTP_METHODS.GET,
  headers: {},
  body: null,
  refresh_interval: 0,      // 0 = без автообновления
  timeout: 10000,           // 10 секунд
  cache_ttl: 60000,         // 1 минута
  display_format: DISPLAY_FORMATS.VALUE,
  value_path: '',           // JSONPath к значению
  template: '',             // Шаблон отображения
  transform: null,          // Функция трансформации
  error_message: 'Ошибка загрузки данных',
  loading_message: 'Загрузка...',
  show_timestamp: false,
  authentication: null      // { type: 'bearer', token: '...' }
};

/**
 * Класс REST API виджета
 */
export class RestApiWidget {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация виджета
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._element = null;
    this._data = null;
    this._error = null;
    this._loading = false;
    this._lastFetch = 0;
    this._refreshInterval = null;
    this._cache = new Map();
    this._abortController = null;
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
  }

  /**
   * Устанавливает конфигурацию
   * @param {Object} config 
   */
  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    
    // Перезапускаем автообновление
    this._stopAutoRefresh();
    if (this._config.refresh_interval > 0) {
      this._startAutoRefresh();
    }
  }

  /**
   * Создаёт DOM элемент
   * @returns {HTMLElement}
   */
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-rest-widget';

    this._updateDisplay();
    this._fetchData();

    return this._element;
  }

  /**
   * Загружает данные из API
   */
  async _fetchData() {
    const { url, method, headers, body, timeout, cache_ttl } = this._config;

    if (!url) {
      this._error = 'URL не указан';
      this._updateDisplay();
      return;
    }

    // Проверяем кэш
    const cacheKey = this._getCacheKey();
    const cached = this._cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cache_ttl) {
      this._data = cached.data;
      this._updateDisplay();
      return;
    }

    // Отменяем предыдущий запрос
    if (this._abortController) {
      this._abortController.abort();
    }
    this._abortController = new AbortController();

    this._loading = true;
    this._error = null;
    this._updateDisplay();

    try {
      // Подготавливаем URL (поддержка переменных HA)
      const processedUrl = this._processTemplate(url);
      
      // Подготавливаем headers
      const requestHeaders = { ...headers };
      
      // Аутентификация
      if (this._config.authentication) {
        const auth = this._config.authentication;
        if (auth.type === 'bearer') {
          requestHeaders['Authorization'] = `Bearer ${auth.token}`;
        } else if (auth.type === 'basic') {
          const encoded = btoa(`${auth.username}:${auth.password}`);
          requestHeaders['Authorization'] = `Basic ${encoded}`;
        } else if (auth.type === 'api_key') {
          requestHeaders[auth.header || 'X-API-Key'] = auth.key;
        }
      }

      // Выполняем запрос
      const response = await fetch(processedUrl, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(this._processTemplate(body)) : null,
        signal: this._abortController.signal,
        timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Применяем трансформацию
      if (this._config.transform) {
        data = this._applyTransform(data);
      }

      // Кэшируем
      this._cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      this._data = data;
      this._lastFetch = Date.now();
      this._loading = false;
      this._error = null;

    } catch (error) {
      if (error.name === 'AbortError') {
        return; // Запрос был отменён
      }
      
      this._loading = false;
      this._error = error.message || this._config.error_message;
      console.error('[RestApiWidget] Fetch error:', error);
    }

    this._updateDisplay();
  }

  /**
   * Получает ключ кэша
   * @returns {string}
   */
  _getCacheKey() {
    const { url, method, body } = this._config;
    return `${method}:${url}:${JSON.stringify(body || {})}`;
  }

  /**
   * Обрабатывает шаблон с переменными
   * @param {string|Object} input 
   * @returns {string|Object}
   */
  _processTemplate(input) {
    if (typeof input === 'string') {
      // Заменяем {{ entity_id }} на состояние
      return input.replace(/\{\{\s*(\w+\.\w+)\s*\}\}/g, (match, entityId) => {
        return this._hass?.states?.[entityId]?.state || match;
      });
    }
    
    if (typeof input === 'object' && input !== null) {
      const result = Array.isArray(input) ? [] : {};
      for (const [key, value] of Object.entries(input)) {
        result[key] = this._processTemplate(value);
      }
      return result;
    }
    
    return input;
  }

  /**
   * Применяет трансформацию к данным
   * @param {*} data 
   * @returns {*}
   */
  _applyTransform(data) {
    const transform = this._config.transform;
    
    if (typeof transform === 'function') {
      return transform(data);
    }
    
    if (typeof transform === 'string') {
      // Простой JavaScript expression
      try {
        const fn = new Function('data', `return ${transform}`);
        return fn(data);
      } catch (error) {
        console.error('[RestApiWidget] Transform error:', error);
        return data;
      }
    }
    
    return data;
  }

  /**
   * Извлекает значение по пути
   * @param {*} data 
   * @param {string} path 
   * @returns {*}
   */
  _getValueByPath(data, path) {
    if (!path) return data;
    
    const parts = path.split('.');
    let current = data;
    
    for (const part of parts) {
      // Поддержка массивов: items[0]
      const match = part.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        current = current?.[match[1]]?.[parseInt(match[2])];
      } else {
        current = current?.[part];
      }
      
      if (current === undefined) return undefined;
    }
    
    return current;
  }

  /**
   * Обновляет отображение
   */
  _updateDisplay() {
    if (!this._element) return;

    // Показываем загрузку
    if (this._loading) {
      this._element.innerHTML = `
        <div class="uc-rest-loading">
          <div class="uc-rest-spinner"></div>
          <span>${this._config.loading_message}</span>
        </div>
      `;
      return;
    }

    // Показываем ошибку
    if (this._error) {
      this._element.innerHTML = `
        <div class="uc-rest-error">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <span>${this._error}</span>
          <button class="uc-rest-retry">Повторить</button>
        </div>
      `;
      this._element.querySelector('.uc-rest-retry')?.addEventListener('click', () => {
        this._fetchData();
      });
      return;
    }

    // Отображаем данные
    const { display_format, value_path, template, show_timestamp } = this._config;
    const value = this._getValueByPath(this._data, value_path);

    let content = '';

    switch (display_format) {
      case DISPLAY_FORMATS.RAW:
        content = `<pre class="uc-rest-raw">${JSON.stringify(value, null, 2)}</pre>`;
        break;
        
      case DISPLAY_FORMATS.VALUE:
        content = `<div class="uc-rest-value">${this._formatValue(value)}</div>`;
        break;
        
      case DISPLAY_FORMATS.TABLE:
        content = this._renderTable(value);
        break;
        
      case DISPLAY_FORMATS.LIST:
        content = this._renderList(value);
        break;
        
      case DISPLAY_FORMATS.TEMPLATE:
        content = this._renderTemplate(template, value);
        break;
        
      case DISPLAY_FORMATS.CHART:
        content = this._renderChart(value);
        break;
        
      default:
        content = `<div class="uc-rest-value">${this._formatValue(value)}</div>`;
    }

    // Добавляем timestamp если нужно
    if (show_timestamp && this._lastFetch) {
      const time = new Date(this._lastFetch).toLocaleTimeString();
      content += `<div class="uc-rest-timestamp">Обновлено: ${time}</div>`;
    }

    this._element.innerHTML = content;
  }

  /**
   * Форматирует значение для отображения
   * @param {*} value 
   * @returns {string}
   */
  _formatValue(value) {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  /**
   * Рендерит таблицу
   * @param {Array|Object} data 
   * @returns {string}
   */
  _renderTable(data) {
    if (!data) return '<div class="uc-rest-empty">Нет данных</div>';
    
    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) return '<div class="uc-rest-empty">Нет данных</div>';

    const headers = Object.keys(items[0] || {});
    
    return `
      <table class="uc-rest-table">
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              ${headers.map(h => `<td>${this._formatValue(item[h])}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Рендерит список
   * @param {Array|Object} data 
   * @returns {string}
   */
  _renderList(data) {
    if (!data) return '<div class="uc-rest-empty">Нет данных</div>';
    
    const items = Array.isArray(data) ? data : Object.entries(data).map(([k, v]) => ({ key: k, value: v }));
    
    return `
      <ul class="uc-rest-list">
        ${items.map(item => {
          if (typeof item === 'object') {
            if (item.key !== undefined) {
              return `<li><strong>${item.key}:</strong> ${this._formatValue(item.value)}</li>`;
            }
            return `<li>${this._formatValue(item)}</li>`;
          }
          return `<li>${this._formatValue(item)}</li>`;
        }).join('')}
      </ul>
    `;
  }

  /**
   * Рендерит по шаблону
   * @param {string} template 
   * @param {*} data 
   * @returns {string}
   */
  _renderTemplate(template, data) {
    if (!template) return this._formatValue(data);
    
    // Заменяем {{ path }} на значения
    return template.replace(/\{\{\s*([\w.[\]]+)\s*\}\}/g, (match, path) => {
      const value = this._getValueByPath(data, path);
      return this._formatValue(value);
    });
  }

  /**
   * Рендерит простой график
   * @param {Array} data 
   * @returns {string}
   */
  _renderChart(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return '<div class="uc-rest-empty">Нет данных для графика</div>';
    }

    const values = data.map(d => typeof d === 'number' ? d : d.value || 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return `
      <svg class="uc-rest-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points="${points}"
          fill="none"
          stroke="var(--primary-color)"
          stroke-width="2"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    `;
  }

  /**
   * Запускает автообновление
   */
  _startAutoRefresh() {
    if (this._config.refresh_interval <= 0) return;
    
    this._refreshInterval = setInterval(() => {
      this._fetchData();
    }, this._config.refresh_interval * 1000);
  }

  /**
   * Останавливает автообновление
   */
  _stopAutoRefresh() {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }
  }

  /**
   * Принудительное обновление
   */
  refresh() {
    this._cache.clear();
    this._fetchData();
  }

  /**
   * Уничтожает виджет
   */
  destroy() {
    this._stopAutoRefresh();
    
    if (this._abortController) {
      this._abortController.abort();
    }
    
    this._cache.clear();
    
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-rest-widget {
        width: 100%;
      }

      .uc-rest-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px;
        color: var(--secondary-text-color);
      }

      .uc-rest-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--divider-color);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: uc-rest-spin 1s linear infinite;
      }

      @keyframes uc-rest-spin {
        to { transform: rotate(360deg); }
      }

      .uc-rest-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        color: var(--error-color);
        text-align: center;
      }

      .uc-rest-error ha-icon {
        --mdc-icon-size: 32px;
      }

      .uc-rest-retry {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        font-size: 14px;
      }

      .uc-rest-retry:hover {
        filter: brightness(1.1);
      }

      .uc-rest-value {
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        padding: 16px;
      }

      .uc-rest-raw {
        font-family: monospace;
        font-size: 12px;
        background: var(--code-editor-background-color, #f5f5f5);
        padding: 12px;
        border-radius: 8px;
        overflow: auto;
        max-height: 200px;
        margin: 0;
      }

      .uc-rest-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      .uc-rest-table th,
      .uc-rest-table td {
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-rest-table th {
        font-weight: 600;
        background: var(--secondary-background-color);
      }

      .uc-rest-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .uc-rest-list li {
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-rest-list li:last-child {
        border-bottom: none;
      }

      .uc-rest-chart {
        width: 100%;
        height: 60px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .uc-rest-empty {
        padding: 16px;
        text-align: center;
        color: var(--secondary-text-color);
      }

      .uc-rest-timestamp {
        font-size: 11px;
        color: var(--secondary-text-color);
        text-align: right;
        padding-top: 8px;
      }
    `;
  }
}

export default RestApiWidget;
