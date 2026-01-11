/**
 * Entity Preview - мини-спарклайн при наведении на entity
 * 
 * Отображает историю состояния entity в виде компактного графика
 * при наведении курсора на элемент.
 * 
 * @module advanced/EntityPreview
 */

import { debounce } from '../utils/performance.js';

/**
 * Конфигурация по умолчанию для EntityPreview
 */
const DEFAULT_CONFIG = {
  width: 120,
  height: 40,
  hours: 24,
  strokeWidth: 2,
  strokeColor: 'var(--primary-color, #03a9f4)',
  fillColor: 'var(--primary-color, #03a9f4)',
  fillOpacity: 0.1,
  showValue: true,
  showMinMax: false,
  animationDuration: 200,
  position: 'top', // top, bottom, left, right
  offset: 8
};

/**
 * Класс для отображения превью entity с историей
 */
export class EntityPreview {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация превью
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._previewElement = null;
    this._currentEntityId = null;
    this._historyCache = new Map();
    this._hideTimeout = null;
    
    // Дебаунс для предотвращения множественных вызовов
    this._debouncedShow = debounce(this._showPreview.bind(this), 150);
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
  }

  /**
   * Создаёт элемент превью
   * @returns {HTMLElement}
   */
  _createPreviewElement() {
    const preview = document.createElement('div');
    preview.className = 'uc-entity-preview';
    preview.innerHTML = `
      <div class="uc-preview-header">
        <span class="uc-preview-name"></span>
        <span class="uc-preview-value"></span>
      </div>
      <div class="uc-preview-chart">
        <svg class="uc-preview-sparkline"></svg>
      </div>
      <div class="uc-preview-stats">
        <span class="uc-preview-min"></span>
        <span class="uc-preview-max"></span>
      </div>
    `;
    
    // Добавляем в body для корректного позиционирования
    document.body.appendChild(preview);
    
    return preview;
  }

  /**
   * Привязывает превью к элементу
   * @param {HTMLElement} element - Элемент для отслеживания
   * @param {string} entityId - ID entity
   */
  attach(element, entityId) {
    if (!element || !entityId) return;

    element.addEventListener('mouseenter', (e) => {
      this._currentEntityId = entityId;
      this._debouncedShow(element, entityId);
    });

    element.addEventListener('mouseleave', () => {
      this._hidePreview();
    });

    element.addEventListener('mousemove', (e) => {
      this._updatePosition(e);
    });
  }

  /**
   * Отвязывает превью от элемента
   * @param {HTMLElement} element 
   */
  detach(element) {
    if (!element) return;
    
    // Клонируем элемент для удаления слушателей
    const newElement = element.cloneNode(true);
    element.parentNode?.replaceChild(newElement, element);
    
    return newElement;
  }

  /**
   * Показывает превью
   * @param {HTMLElement} element 
   * @param {string} entityId 
   */
  async _showPreview(element, entityId) {
    if (this._currentEntityId !== entityId) return;
    
    if (!this._previewElement) {
      this._previewElement = this._createPreviewElement();
    }

    // Получаем данные entity
    const state = this._hass?.states?.[entityId];
    if (!state) return;

    // Обновляем заголовок
    const nameEl = this._previewElement.querySelector('.uc-preview-name');
    const valueEl = this._previewElement.querySelector('.uc-preview-value');
    
    nameEl.textContent = state.attributes.friendly_name || entityId;
    valueEl.textContent = `${state.state} ${state.attributes.unit_of_measurement || ''}`;

    // Загружаем историю
    const history = await this._fetchHistory(entityId);
    
    if (history && history.length > 0 && this._currentEntityId === entityId) {
      this._renderSparkline(history);
      
      if (this._config.showMinMax) {
        this._renderStats(history);
      }
    }

    // Позиционируем и показываем
    this._positionPreview(element);
    this._previewElement.classList.add('visible');
  }

  /**
   * Скрывает превью
   */
  _hidePreview() {
    this._currentEntityId = null;
    
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }

    this._hideTimeout = setTimeout(() => {
      if (this._previewElement) {
        this._previewElement.classList.remove('visible');
      }
    }, 100);
  }

  /**
   * Загружает историю entity
   * @param {string} entityId 
   * @returns {Promise<Array>}
   */
  async _fetchHistory(entityId) {
    // Проверяем кэш
    const cached = this._historyCache.get(entityId);
    if (cached && Date.now() - cached.timestamp < 60000) {
      return cached.data;
    }

    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - this._config.hours * 60 * 60 * 1000);

      const response = await this._hass.callApi(
        'GET',
        `history/period/${startTime.toISOString()}?` +
        `filter_entity_id=${entityId}&` +
        `end_time=${endTime.toISOString()}&` +
        `minimal_response&no_attributes`
      );

      if (response && response[0]) {
        const data = response[0]
          .map(item => ({
            time: new Date(item.last_changed),
            value: parseFloat(item.state)
          }))
          .filter(item => !isNaN(item.value));

        // Кэшируем
        this._historyCache.set(entityId, {
          data,
          timestamp: Date.now()
        });

        return data;
      }
    } catch (error) {
      console.warn(`[EntityPreview] Failed to fetch history for ${entityId}:`, error);
    }

    return [];
  }

  /**
   * Отрисовывает спарклайн
   * @param {Array} history 
   */
  _renderSparkline(history) {
    const svg = this._previewElement.querySelector('.uc-preview-sparkline');
    if (!svg || history.length < 2) return;

    const { width, height, strokeWidth, strokeColor, fillColor, fillOpacity } = this._config;

    // Находим min/max
    const values = history.map(h => h.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    // Строим путь
    const padding = strokeWidth;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = history.map((item, index) => {
      const x = padding + (index / (history.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((item.value - min) / range) * chartHeight;
      return { x, y };
    });

    const pathD = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');

    // Область заливки
    const fillD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.innerHTML = `
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${fillColor};stop-opacity:${fillOpacity}" />
          <stop offset="100%" style="stop-color:${fillColor};stop-opacity:0" />
        </linearGradient>
      </defs>
      <path d="${fillD}" fill="url(#sparkline-gradient)" />
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" 
            stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" 
              r="3" fill="${strokeColor}" />
    `;
  }

  /**
   * Отрисовывает статистику
   * @param {Array} history 
   */
  _renderStats(history) {
    const values = history.map(h => h.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const minEl = this._previewElement.querySelector('.uc-preview-min');
    const maxEl = this._previewElement.querySelector('.uc-preview-max');

    minEl.textContent = `Min: ${min.toFixed(1)}`;
    maxEl.textContent = `Max: ${max.toFixed(1)}`;
    
    this._previewElement.querySelector('.uc-preview-stats').style.display = 'flex';
  }

  /**
   * Позиционирует превью относительно элемента
   * @param {HTMLElement} element 
   */
  _positionPreview(element) {
    if (!this._previewElement || !element) return;

    const rect = element.getBoundingClientRect();
    const previewRect = this._previewElement.getBoundingClientRect();
    const { position, offset } = this._config;

    let top, left;

    switch (position) {
      case 'top':
        top = rect.top - previewRect.height - offset;
        left = rect.left + (rect.width - previewRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + (rect.width - previewRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - previewRect.height) / 2;
        left = rect.left - previewRect.width - offset;
        break;
      case 'right':
        top = rect.top + (rect.height - previewRect.height) / 2;
        left = rect.right + offset;
        break;
    }

    // Проверка границ viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 8) left = 8;
    if (left + previewRect.width > viewportWidth - 8) {
      left = viewportWidth - previewRect.width - 8;
    }
    if (top < 8) top = rect.bottom + offset;
    if (top + previewRect.height > viewportHeight - 8) {
      top = rect.top - previewRect.height - offset;
    }

    this._previewElement.style.top = `${top}px`;
    this._previewElement.style.left = `${left}px`;
  }

  /**
   * Обновляет позицию при движении мыши
   * @param {MouseEvent} e 
   */
  _updatePosition(e) {
    // Можно использовать для следования за курсором
    // Пока оставляем фиксированную позицию
  }

  /**
   * Очищает кэш истории
   */
  clearCache() {
    this._historyCache.clear();
  }

  /**
   * Уничтожает превью
   */
  destroy() {
    this._hidePreview();
    
    if (this._previewElement) {
      this._previewElement.remove();
      this._previewElement = null;
    }
    
    this._historyCache.clear();
  }

  /**
   * Возвращает CSS стили для превью
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-entity-preview {
        position: fixed;
        z-index: 10000;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: 12px;
        padding: 12px;
        box-shadow: 
          0 4px 20px rgba(0, 0, 0, 0.15),
          0 0 0 1px rgba(0, 0, 0, 0.05);
        opacity: 0;
        visibility: hidden;
        transform: translateY(4px) scale(0.95);
        transition: 
          opacity 0.2s ease,
          visibility 0.2s ease,
          transform 0.2s ease;
        pointer-events: none;
        min-width: 150px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .uc-entity-preview.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .uc-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        gap: 12px;
      }

      .uc-preview-name {
        font-size: 12px;
        color: var(--secondary-text-color, #666);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100px;
      }

      .uc-preview-value {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color, #333);
        white-space: nowrap;
      }

      .uc-preview-chart {
        display: flex;
        justify-content: center;
      }

      .uc-preview-sparkline {
        display: block;
      }

      .uc-preview-stats {
        display: none;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 10px;
        color: var(--secondary-text-color, #666);
      }

      .uc-preview-min,
      .uc-preview-max {
        opacity: 0.7;
      }

      /* Тёмная тема */
      @media (prefers-color-scheme: dark) {
        .uc-entity-preview {
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      }
    `;
  }
}

export default EntityPreview;
