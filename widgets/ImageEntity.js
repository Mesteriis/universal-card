/**
 * Image Entity Widget - виджет для отображения изображений и камер
 * 
 * Поддерживает camera.*, image.*, а также статические URL.
 * 
 * @module widgets/ImageEntity
 */

/**
 * Режимы отображения
 */
export const IMAGE_FIT = {
  CONTAIN: 'contain',   // Вписать в контейнер
  COVER: 'cover',       // Заполнить контейнер
  FILL: 'fill',         // Растянуть
  NONE: 'none',         // Оригинальный размер
  SCALE_DOWN: 'scale-down' // Уменьшить если больше
};

/**
 * Типы источников
 */
export const SOURCE_TYPES = {
  CAMERA: 'camera',     // camera.* entity
  IMAGE: 'image',       // image.* entity
  URL: 'url',           // Статический URL
  PERSON: 'person',     // Аватар person.*
  LOCAL: 'local'        // Локальный путь /local/...
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  entity_id: '',
  url: '',
  fit: IMAGE_FIT.CONTAIN,
  aspect_ratio: '16:9',
  refresh_interval: 0,    // 0 = без автообновления (для камер)
  show_state: false,
  show_name: false,
  placeholder: 'mdi:image',
  error_placeholder: 'mdi:image-broken',
  lazy_load: true,
  click_action: 'more-info',
  border_radius: 8
};

/**
 * Класс виджета изображения
 */
export class ImageEntity {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._element = null;
    this._imgElement = null;
    this._refreshInterval = null;
    this._intersectionObserver = null;
    this._isVisible = false;
    this._errorCount = 0;
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
    this._updateImage();
  }

  /**
   * Устанавливает конфигурацию
   * @param {Object} config 
   */
  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Создаёт DOM элемент
   * @returns {HTMLElement}
   */
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-image-widget';
    
    // Применяем aspect ratio
    this._applyAspectRatio();

    this._element.innerHTML = `
      <div class="uc-image-container">
        <div class="uc-image-placeholder">
          <ha-icon icon="${this._config.placeholder}"></ha-icon>
        </div>
        <img class="uc-image" alt="" />
        ${this._config.show_name ? '<div class="uc-image-name"></div>' : ''}
        ${this._config.show_state ? '<div class="uc-image-state"></div>' : ''}
      </div>
    `;

    this._imgElement = this._element.querySelector('.uc-image');

    // Обработчики событий изображения
    this._imgElement.addEventListener('load', () => this._onImageLoad());
    this._imgElement.addEventListener('error', () => this._onImageError());

    // Клик
    if (this._config.click_action) {
      this._element.addEventListener('click', () => this._onClick());
      this._element.style.cursor = 'pointer';
    }

    // Lazy loading
    if (this._config.lazy_load) {
      this._setupLazyLoad();
    } else {
      this._loadImage();
    }

    // Автообновление
    if (this._config.refresh_interval > 0) {
      this._startAutoRefresh();
    }

    return this._element;
  }

  /**
   * Применяет aspect ratio
   */
  _applyAspectRatio() {
    const ratio = this._config.aspect_ratio;
    
    if (ratio === 'auto') {
      this._element.style.aspectRatio = 'auto';
    } else if (ratio.includes(':')) {
      const [w, h] = ratio.split(':').map(Number);
      this._element.style.aspectRatio = `${w}/${h}`;
    } else if (ratio.includes('/')) {
      this._element.style.aspectRatio = ratio;
    } else {
      this._element.style.aspectRatio = ratio;
    }
  }

  /**
   * Настраивает lazy loading
   */
  _setupLazyLoad() {
    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this._isVisible = true;
          this._loadImage();
          
          // Для камер продолжаем обновлять
          if (!this._getSourceType() === SOURCE_TYPES.CAMERA) {
            this._intersectionObserver.disconnect();
          }
        } else {
          this._isVisible = false;
        }
      },
      { threshold: 0.1 }
    );

    this._intersectionObserver.observe(this._element);
  }

  /**
   * Определяет тип источника
   * @returns {string}
   */
  _getSourceType() {
    const { entity_id, url } = this._config;
    
    if (url) {
      if (url.startsWith('/local/')) return SOURCE_TYPES.LOCAL;
      return SOURCE_TYPES.URL;
    }
    
    if (!entity_id) return null;
    
    const domain = entity_id.split('.')[0];
    
    switch (domain) {
      case 'camera':
        return SOURCE_TYPES.CAMERA;
      case 'image':
        return SOURCE_TYPES.IMAGE;
      case 'person':
        return SOURCE_TYPES.PERSON;
      default:
        return null;
    }
  }

  /**
   * Получает URL изображения
   * @returns {string|null}
   */
  _getImageUrl() {
    const sourceType = this._getSourceType();
    const { entity_id, url } = this._config;

    switch (sourceType) {
      case SOURCE_TYPES.URL:
        return url;
        
      case SOURCE_TYPES.LOCAL:
        return url;
        
      case SOURCE_TYPES.CAMERA:
        // Для камер используем proxy API
        const timestamp = Date.now();
        return `/api/camera_proxy/${entity_id}?token=${this._hass?.hassUrl ? '' : ''}&_=${timestamp}`;
        
      case SOURCE_TYPES.IMAGE:
        // Image entity содержит URL в атрибутах
        const imageState = this._hass?.states?.[entity_id];
        return imageState?.attributes?.entity_picture || imageState?.attributes?.url;
        
      case SOURCE_TYPES.PERSON:
        const personState = this._hass?.states?.[entity_id];
        return personState?.attributes?.entity_picture;
        
      default:
        return null;
    }
  }

  /**
   * Загружает изображение
   */
  _loadImage() {
    const url = this._getImageUrl();
    
    if (!url) {
      this._showPlaceholder();
      return;
    }

    // Добавляем timestamp для камер чтобы избежать кэширования
    let finalUrl = url;
    if (this._getSourceType() === SOURCE_TYPES.CAMERA) {
      const separator = url.includes('?') ? '&' : '?';
      finalUrl = `${url}${separator}_=${Date.now()}`;
    }

    this._imgElement.src = finalUrl;
    this._element.classList.add('loading');
  }

  /**
   * Обновляет изображение
   */
  _updateImage() {
    // Обновляем только если видим (для lazy load)
    if (this._config.lazy_load && !this._isVisible) return;

    // Обновляем URL
    this._loadImage();

    // Обновляем имя и состояние
    this._updateOverlays();
  }

  /**
   * Обновляет оверлеи (имя, состояние)
   */
  _updateOverlays() {
    const { entity_id, show_name, show_state } = this._config;
    
    if (!entity_id) return;
    
    const state = this._hass?.states?.[entity_id];
    if (!state) return;

    if (show_name) {
      const nameEl = this._element.querySelector('.uc-image-name');
      if (nameEl) {
        nameEl.textContent = state.attributes?.friendly_name || entity_id;
      }
    }

    if (show_state) {
      const stateEl = this._element.querySelector('.uc-image-state');
      if (stateEl) {
        stateEl.textContent = state.state;
      }
    }
  }

  /**
   * Обработчик загрузки изображения
   */
  _onImageLoad() {
    this._element.classList.remove('loading', 'error');
    this._element.classList.add('loaded');
    this._imgElement.style.display = 'block';
    this._errorCount = 0;

    // Скрываем placeholder
    const placeholder = this._element.querySelector('.uc-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  }

  /**
   * Обработчик ошибки загрузки
   */
  _onImageError() {
    this._element.classList.remove('loading', 'loaded');
    this._element.classList.add('error');
    this._imgElement.style.display = 'none';
    this._errorCount++;

    // Показываем error placeholder
    const placeholder = this._element.querySelector('.uc-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
      placeholder.querySelector('ha-icon')?.setAttribute('icon', this._config.error_placeholder);
    }

    // Для камер пробуем перезагрузить
    if (this._getSourceType() === SOURCE_TYPES.CAMERA && this._errorCount < 3) {
      setTimeout(() => this._loadImage(), 2000);
    }
  }

  /**
   * Показывает placeholder
   */
  _showPlaceholder() {
    this._imgElement.style.display = 'none';
    const placeholder = this._element.querySelector('.uc-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }

  /**
   * Обработчик клика
   */
  _onClick() {
    const { click_action, entity_id } = this._config;
    
    switch (click_action) {
      case 'more-info':
        if (entity_id) {
          const event = new CustomEvent('hass-more-info', {
            bubbles: true,
            composed: true,
            detail: { entityId: entity_id }
          });
          this._element.dispatchEvent(event);
        }
        break;
        
      case 'fullscreen':
        this._showFullscreen();
        break;
        
      case 'none':
        break;
    }
  }

  /**
   * Показывает изображение в полноэкранном режиме
   */
  _showFullscreen() {
    const url = this._getImageUrl();
    if (!url) return;

    const overlay = document.createElement('div');
    overlay.className = 'uc-image-fullscreen';
    overlay.innerHTML = `
      <img src="${url}" />
      <button class="uc-image-fullscreen-close">×</button>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('uc-image-fullscreen-close')) {
        overlay.remove();
      }
    });

    document.body.appendChild(overlay);
  }

  /**
   * Запускает автообновление
   */
  _startAutoRefresh() {
    this._stopAutoRefresh();
    
    this._refreshInterval = setInterval(() => {
      if (this._isVisible || !this._config.lazy_load) {
        this._loadImage();
      }
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
   * Уничтожает виджет
   */
  destroy() {
    this._stopAutoRefresh();
    
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
    }
    
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
      .uc-image-widget {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--secondary-background-color);
      }

      .uc-image-container {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .uc-image {
        width: 100%;
        height: 100%;
        object-fit: var(--uc-image-fit, contain);
        display: none;
        transition: opacity 0.3s ease;
      }

      .uc-image-widget.loaded .uc-image {
        opacity: 1;
      }

      .uc-image-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
      }

      .uc-image-placeholder ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.5;
      }

      .uc-image-widget.loading .uc-image-placeholder ha-icon {
        animation: uc-image-pulse 1s ease-in-out infinite;
      }

      @keyframes uc-image-pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
      }

      .uc-image-widget.error .uc-image-placeholder {
        color: var(--error-color);
      }

      .uc-image-name,
      .uc-image-state {
        position: absolute;
        left: 0;
        right: 0;
        padding: 8px 12px;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        color: white;
        font-size: 14px;
      }

      .uc-image-name {
        bottom: 0;
        font-weight: 500;
      }

      .uc-image-state {
        top: 0;
        background: linear-gradient(rgba(0,0,0,0.7), transparent);
        font-size: 12px;
        text-transform: capitalize;
      }

      /* Fullscreen */
      .uc-image-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: zoom-out;
      }

      .uc-image-fullscreen img {
        max-width: 95vw;
        max-height: 95vh;
        object-fit: contain;
      }

      .uc-image-fullscreen-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-image-fullscreen-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Object-fit варианты */
      .uc-image-contain .uc-image { object-fit: contain; }
      .uc-image-cover .uc-image { object-fit: cover; }
      .uc-image-fill .uc-image { object-fit: fill; }
      .uc-image-none .uc-image { object-fit: none; }
      .uc-image-scale-down .uc-image { object-fit: scale-down; }
    `;
  }
}

export default ImageEntity;
