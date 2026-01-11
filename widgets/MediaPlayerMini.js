/**
 * Media Player Mini Widget - компактный медиаплеер
 * 
 * Минималистичный контрол для media_player entity.
 * 
 * @module widgets/MediaPlayerMini
 */

/**
 * Стили отображения
 */
export const DISPLAY_STYLES = {
  COMPACT: 'compact',     // Только кнопки
  NORMAL: 'normal',       // Кнопки + прогресс
  FULL: 'full'            // Полная информация
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  entity_id: '',
  style: DISPLAY_STYLES.NORMAL,
  show_artwork: true,
  show_volume: true,
  show_progress: true,
  show_source: false,
  artwork_border_radius: 8,
  volume_step: 5
};

/**
 * Класс мини медиаплеера
 */
export class MediaPlayerMini {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._element = null;
    this._progressInterval = null;
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  /**
   * Устанавливает конфигурацию
   * @param {Object} config 
   */
  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Получает состояние entity
   * @returns {Object|null}
   */
  _getState() {
    return this._hass?.states?.[this._config.entity_id];
  }

  /**
   * Создаёт DOM элемент
   * @returns {HTMLElement}
   */
  render() {
    this._element = document.createElement('div');
    this._element.className = `uc-media-mini uc-media-${this._config.style}`;

    this._renderContent();
    this._bindEvents();
    this._startProgressUpdate();

    return this._element;
  }

  /**
   * Рендерит содержимое
   */
  _renderContent() {
    const state = this._getState();
    if (!state) {
      this._element.innerHTML = `
        <div class="uc-media-unavailable">
          <ha-icon icon="mdi:speaker-off"></ha-icon>
          <span>Недоступно</span>
        </div>
      `;
      return;
    }

    const isPlaying = state.state === 'playing';
    const isPaused = state.state === 'paused';
    const isIdle = state.state === 'idle' || state.state === 'off';
    const attrs = state.attributes;

    // Artwork
    const artworkHtml = this._config.show_artwork && attrs.entity_picture ? `
      <div class="uc-media-artwork" style="background-image: url('${attrs.entity_picture}')">
        ${isPlaying ? '<div class="uc-media-playing-indicator"><span></span><span></span><span></span></div>' : ''}
      </div>
    ` : '';

    // Info
    const mediaTitle = attrs.media_title || attrs.friendly_name || this._config.entity_id;
    const mediaArtist = attrs.media_artist || attrs.media_album_name || attrs.app_name || '';

    // Controls
    const controlsHtml = `
      <div class="uc-media-controls">
        <button class="uc-media-btn" data-action="prev" title="Предыдущий">
          <ha-icon icon="mdi:skip-previous"></ha-icon>
        </button>
        <button class="uc-media-btn uc-media-btn-main" data-action="play_pause" title="${isPlaying ? 'Пауза' : 'Воспроизвести'}">
          <ha-icon icon="mdi:${isPlaying ? 'pause' : 'play'}"></ha-icon>
        </button>
        <button class="uc-media-btn" data-action="next" title="Следующий">
          <ha-icon icon="mdi:skip-next"></ha-icon>
        </button>
      </div>
    `;

    // Progress
    const progressHtml = this._config.show_progress && attrs.media_duration ? `
      <div class="uc-media-progress">
        <span class="uc-media-time uc-media-time-current">${this._formatTime(attrs.media_position || 0)}</span>
        <div class="uc-media-progress-bar">
          <div class="uc-media-progress-fill" style="width: ${this._getProgressPercent(attrs)}%"></div>
        </div>
        <span class="uc-media-time uc-media-time-duration">${this._formatTime(attrs.media_duration)}</span>
      </div>
    ` : '';

    // Volume
    const volumeLevel = Math.round((attrs.volume_level || 0) * 100);
    const volumeHtml = this._config.show_volume ? `
      <div class="uc-media-volume">
        <button class="uc-media-btn uc-media-btn-sm" data-action="volume_mute" title="${attrs.is_volume_muted ? 'Включить звук' : 'Выключить звук'}">
          <ha-icon icon="mdi:${attrs.is_volume_muted ? 'volume-off' : (volumeLevel > 50 ? 'volume-high' : 'volume-medium')}"></ha-icon>
        </button>
        <input type="range" class="uc-media-volume-slider" 
               min="0" max="100" value="${volumeLevel}"
               data-action="volume_set" />
        <span class="uc-media-volume-value">${volumeLevel}%</span>
      </div>
    ` : '';

    // Source
    const sourceHtml = this._config.show_source && attrs.source_list?.length ? `
      <div class="uc-media-source">
        <select class="uc-media-source-select" data-action="source_select">
          ${attrs.source_list.map(s => `
            <option value="${s}" ${s === attrs.source ? 'selected' : ''}>${s}</option>
          `).join('')}
        </select>
      </div>
    ` : '';

    this._element.innerHTML = `
      ${artworkHtml}
      <div class="uc-media-content">
        <div class="uc-media-info">
          <div class="uc-media-title">${mediaTitle}</div>
          ${mediaArtist ? `<div class="uc-media-artist">${mediaArtist}</div>` : ''}
        </div>
        ${controlsHtml}
        ${progressHtml}
        ${volumeHtml}
        ${sourceHtml}
      </div>
    `;

    // Добавляем классы состояния
    this._element.classList.toggle('is-playing', isPlaying);
    this._element.classList.toggle('is-paused', isPaused);
    this._element.classList.toggle('is-idle', isIdle);
  }

  /**
   * Привязывает события
   */
  _bindEvents() {
    this._element.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) {
        this._handleAction(btn.dataset.action, e);
      }
    });

    // Volume slider
    const volumeSlider = this._element.querySelector('.uc-media-volume-slider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this._setVolume(parseInt(e.target.value) / 100);
      });
    }

    // Source select
    const sourceSelect = this._element.querySelector('.uc-media-source-select');
    if (sourceSelect) {
      sourceSelect.addEventListener('change', (e) => {
        this._selectSource(e.target.value);
      });
    }

    // Progress bar click
    const progressBar = this._element.querySelector('.uc-media-progress-bar');
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this._seek(percent);
      });
    }
  }

  /**
   * Обрабатывает действие
   * @param {string} action 
   * @param {Event} event 
   */
  _handleAction(action, event) {
    const entity_id = this._config.entity_id;

    switch (action) {
      case 'play_pause':
        this._hass.callService('media_player', 'media_play_pause', { entity_id });
        break;
      case 'prev':
        this._hass.callService('media_player', 'media_previous_track', { entity_id });
        break;
      case 'next':
        this._hass.callService('media_player', 'media_next_track', { entity_id });
        break;
      case 'volume_mute':
        this._hass.callService('media_player', 'volume_mute', { 
          entity_id,
          is_volume_muted: !this._getState()?.attributes?.is_volume_muted
        });
        break;
    }
  }

  /**
   * Устанавливает громкость
   * @param {number} level - 0-1
   */
  _setVolume(level) {
    this._hass.callService('media_player', 'volume_set', {
      entity_id: this._config.entity_id,
      volume_level: Math.max(0, Math.min(1, level))
    });
  }

  /**
   * Выбирает источник
   * @param {string} source 
   */
  _selectSource(source) {
    this._hass.callService('media_player', 'select_source', {
      entity_id: this._config.entity_id,
      source
    });
  }

  /**
   * Перематывает на позицию
   * @param {number} percent - 0-1
   */
  _seek(percent) {
    const state = this._getState();
    const duration = state?.attributes?.media_duration;
    
    if (duration) {
      this._hass.callService('media_player', 'media_seek', {
        entity_id: this._config.entity_id,
        seek_position: duration * percent
      });
    }
  }

  /**
   * Получает процент прогресса
   * @param {Object} attrs 
   * @returns {number}
   */
  _getProgressPercent(attrs) {
    if (!attrs.media_duration || !attrs.media_position) return 0;
    return Math.min(100, (attrs.media_position / attrs.media_duration) * 100);
  }

  /**
   * Форматирует время
   * @param {number} seconds 
   * @returns {string}
   */
  _formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Запускает обновление прогресса
   */
  _startProgressUpdate() {
    this._stopProgressUpdate();
    
    this._progressInterval = setInterval(() => {
      const state = this._getState();
      if (state?.state === 'playing') {
        this._updateProgress();
      }
    }, 1000);
  }

  /**
   * Останавливает обновление прогресса
   */
  _stopProgressUpdate() {
    if (this._progressInterval) {
      clearInterval(this._progressInterval);
      this._progressInterval = null;
    }
  }

  /**
   * Обновляет прогресс без полного ререндера
   */
  _updateProgress() {
    const state = this._getState();
    if (!state) return;

    const attrs = state.attributes;
    
    // Обновляем progress bar
    const progressFill = this._element.querySelector('.uc-media-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${this._getProgressPercent(attrs)}%`;
    }

    // Обновляем текущее время
    const timeEl = this._element.querySelector('.uc-media-time-current');
    if (timeEl && attrs.media_position !== undefined) {
      // Приблизительно увеличиваем позицию
      const position = attrs.media_position + 1;
      timeEl.textContent = this._formatTime(Math.min(position, attrs.media_duration || position));
    }
  }

  /**
   * Обновляет виджет
   */
  _update() {
    if (!this._element) return;
    this._renderContent();
    this._bindEvents();
  }

  /**
   * Уничтожает виджет
   */
  destroy() {
    this._stopProgressUpdate();
    
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
      .uc-media-mini {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: var(--ha-card-background, white);
        border-radius: 12px;
      }

      .uc-media-unavailable {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 16px;
        color: var(--secondary-text-color);
      }

      .uc-media-artwork {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 8px;
        background-size: cover;
        background-position: center;
        background-color: var(--secondary-background-color);
        flex-shrink: 0;
      }

      .uc-media-playing-indicator {
        position: absolute;
        bottom: 4px;
        right: 4px;
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 12px;
        padding: 2px 4px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
      }

      .uc-media-playing-indicator span {
        width: 3px;
        background: white;
        border-radius: 1px;
        animation: uc-media-equalizer 0.5s ease infinite alternate;
      }

      .uc-media-playing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .uc-media-playing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes uc-media-equalizer {
        from { height: 30%; }
        to { height: 100%; }
      }

      .uc-media-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .uc-media-info {
        min-width: 0;
      }

      .uc-media-title {
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .uc-media-artist {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .uc-media-controls {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .uc-media-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
      }

      .uc-media-btn:hover {
        background: var(--secondary-background-color);
      }

      .uc-media-btn:active {
        transform: scale(0.95);
      }

      .uc-media-btn-main {
        width: 44px;
        height: 44px;
        background: var(--primary-color);
        color: white;
      }

      .uc-media-btn-main:hover {
        background: var(--primary-color);
        filter: brightness(1.1);
      }

      .uc-media-btn-sm {
        width: 28px;
        height: 28px;
      }

      .uc-media-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .uc-media-btn-main ha-icon {
        --mdc-icon-size: 24px;
      }

      .uc-media-progress {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-media-time {
        font-size: 11px;
        color: var(--secondary-text-color);
        min-width: 35px;
      }

      .uc-media-time-duration {
        text-align: right;
      }

      .uc-media-progress-bar {
        flex: 1;
        height: 4px;
        background: var(--divider-color);
        border-radius: 2px;
        cursor: pointer;
        overflow: hidden;
      }

      .uc-media-progress-fill {
        height: 100%;
        background: var(--primary-color);
        border-radius: 2px;
        transition: width 0.1s linear;
      }

      .uc-media-volume {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-media-volume-slider {
        flex: 1;
        height: 4px;
        -webkit-appearance: none;
        background: var(--divider-color);
        border-radius: 2px;
        outline: none;
      }

      .uc-media-volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: var(--primary-color);
        border-radius: 50%;
        cursor: pointer;
      }

      .uc-media-volume-value {
        font-size: 11px;
        color: var(--secondary-text-color);
        min-width: 30px;
        text-align: right;
      }

      .uc-media-source-select {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--ha-card-background);
        color: var(--primary-text-color);
        font-size: 12px;
        outline: none;
      }

      /* Compact style */
      .uc-media-compact .uc-media-artwork {
        width: 48px;
        height: 48px;
      }

      .uc-media-compact .uc-media-progress,
      .uc-media-compact .uc-media-volume,
      .uc-media-compact .uc-media-source {
        display: none;
      }

      /* Full style */
      .uc-media-full {
        flex-direction: column;
      }

      .uc-media-full .uc-media-artwork {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        border-radius: 12px;
      }
    `;
  }
}

export default MediaPlayerMini;
