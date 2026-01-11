/**
 * Timer - таймер и обратный отсчёт
 * 
 * Отображает таймер, обратный отсчёт или время до события
 * в header карточки.
 * 
 * @module advanced/Timer
 */

import { fireEvent } from '../utils/helpers.js';

/**
 * Режимы работы таймера
 */
export const TIMER_MODES = {
  COUNTDOWN: 'countdown',     // Обратный отсчёт до указанного времени
  COUNTUP: 'countup',         // Отсчёт от указанного времени
  TIMER: 'timer',             // Таймер entity (timer.*)
  ENTITY: 'entity',           // Время из атрибута entity
  REMAINING: 'remaining'      // Оставшееся время (entity с end_time)
};

/**
 * Форматы отображения
 */
export const DISPLAY_FORMATS = {
  FULL: 'full',               // 1д 2ч 30м 45с
  COMPACT: 'compact',         // 1:02:30:45
  HUMAN: 'human',             // через 2 часа
  DIGITAL: 'digital'          // 02:30:45
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  mode: TIMER_MODES.COUNTDOWN,
  format: DISPLAY_FORMATS.DIGITAL,
  show_icon: true,
  show_label: false,
  warning_threshold: 60,      // Секунд до предупреждения
  danger_threshold: 10,       // Секунд до опасности
  end_action: null,           // Действие по завершению
  sound_on_end: false,
  hide_when_inactive: false
};

/**
 * Класс Timer для отображения таймера
 */
export class Timer {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация таймера
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._element = null;
    this._intervalId = null;
    this._targetTime = null;
    this._startTime = null;
    this._isRunning = false;
    this._isPaused = false;
    this._remainingOnPause = 0;
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
    this._updateFromEntity();
  }

  /**
   * Устанавливает конфигурацию
   * @param {Object} config 
   */
  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    
    // Инициализация по режиму
    switch (this._config.mode) {
      case TIMER_MODES.COUNTDOWN:
        if (this._config.target_time) {
          this.setTargetTime(new Date(this._config.target_time));
        } else if (this._config.duration) {
          this.setDuration(this._config.duration);
        }
        break;
        
      case TIMER_MODES.COUNTUP:
        if (this._config.start_time) {
          this._startTime = new Date(this._config.start_time);
        } else {
          this._startTime = new Date();
        }
        break;
    }
  }

  /**
   * Создаёт DOM элемент
   * @returns {HTMLElement}
   */
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-timer';
    
    this._element.innerHTML = `
      ${this._config.show_icon ? '<ha-icon class="uc-timer-icon" icon="mdi:timer"></ha-icon>' : ''}
      ${this._config.show_label && this._config.label ? `<span class="uc-timer-label">${this._config.label}</span>` : ''}
      <span class="uc-timer-value">--:--</span>
      ${this._config.show_controls ? this._renderControls() : ''}
    `;

    if (this._config.show_controls) {
      this._bindControlEvents();
    }

    this._updateDisplay();
    
    return this._element;
  }

  /**
   * Рендерит элементы управления
   * @returns {string}
   */
  _renderControls() {
    return `
      <div class="uc-timer-controls">
        <button class="uc-timer-btn uc-timer-start" title="Старт">
          <ha-icon icon="mdi:play"></ha-icon>
        </button>
        <button class="uc-timer-btn uc-timer-pause" title="Пауза">
          <ha-icon icon="mdi:pause"></ha-icon>
        </button>
        <button class="uc-timer-btn uc-timer-reset" title="Сброс">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </button>
      </div>
    `;
  }

  /**
   * Привязывает события к кнопкам управления
   */
  _bindControlEvents() {
    const startBtn = this._element.querySelector('.uc-timer-start');
    const pauseBtn = this._element.querySelector('.uc-timer-pause');
    const resetBtn = this._element.querySelector('.uc-timer-reset');

    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.start();
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pause();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.reset();
      });
    }
  }

  /**
   * Устанавливает целевое время для countdown
   * @param {Date} targetTime 
   */
  setTargetTime(targetTime) {
    this._targetTime = targetTime;
    this._updateDisplay();
  }

  /**
   * Устанавливает длительность в секундах
   * @param {number|string} duration - секунды или строка "HH:MM:SS"
   */
  setDuration(duration) {
    let seconds;
    
    if (typeof duration === 'string') {
      // Парсим HH:MM:SS или MM:SS
      const parts = duration.split(':').map(Number);
      if (parts.length === 3) {
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        seconds = parts[0] * 60 + parts[1];
      } else {
        seconds = parseInt(duration, 10);
      }
    } else {
      seconds = duration;
    }

    this._targetTime = new Date(Date.now() + seconds * 1000);
    this._config.initial_duration = seconds;
  }

  /**
   * Запускает таймер
   */
  start() {
    if (this._isRunning) return;

    // Восстановление после паузы
    if (this._isPaused && this._remainingOnPause > 0) {
      this._targetTime = new Date(Date.now() + this._remainingOnPause * 1000);
      this._isPaused = false;
      this._remainingOnPause = 0;
    }

    // Для timer entity вызываем сервис
    if (this._config.mode === TIMER_MODES.TIMER && this._config.entity_id) {
      this._hass.callService('timer', 'start', {
        entity_id: this._config.entity_id
      });
      return;
    }

    this._isRunning = true;
    this._startTicking();
    this._updateControlsState();
  }

  /**
   * Ставит таймер на паузу
   */
  pause() {
    if (!this._isRunning) return;

    // Для timer entity
    if (this._config.mode === TIMER_MODES.TIMER && this._config.entity_id) {
      this._hass.callService('timer', 'pause', {
        entity_id: this._config.entity_id
      });
      return;
    }

    this._isRunning = false;
    this._isPaused = true;
    this._remainingOnPause = this._getRemaining();
    this._stopTicking();
    this._updateControlsState();
  }

  /**
   * Сбрасывает таймер
   */
  reset() {
    // Для timer entity
    if (this._config.mode === TIMER_MODES.TIMER && this._config.entity_id) {
      this._hass.callService('timer', 'cancel', {
        entity_id: this._config.entity_id
      });
      return;
    }

    this._isRunning = false;
    this._isPaused = false;
    this._remainingOnPause = 0;
    
    if (this._config.initial_duration) {
      this.setDuration(this._config.initial_duration);
    }
    
    this._stopTicking();
    this._updateDisplay();
    this._updateControlsState();
  }

  /**
   * Запускает интервал обновления
   */
  _startTicking() {
    this._stopTicking();
    this._intervalId = setInterval(() => {
      this._tick();
    }, 1000);
  }

  /**
   * Останавливает интервал
   */
  _stopTicking() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /**
   * Обработка одного тика
   */
  _tick() {
    const remaining = this._getRemaining();
    
    this._updateDisplay();

    // Проверяем завершение
    if (this._config.mode === TIMER_MODES.COUNTDOWN && remaining <= 0) {
      this._onTimerEnd();
    }
  }

  /**
   * Обработка завершения таймера
   */
  _onTimerEnd() {
    this._isRunning = false;
    this._stopTicking();

    // Звук
    if (this._config.sound_on_end) {
      this._playEndSound();
    }

    // Действие
    if (this._config.end_action) {
      this._executeEndAction();
    }

    // Событие
    fireEvent(this._element, 'timer-end', { config: this._config });

    this._element.classList.add('uc-timer-ended');
    this._updateControlsState();
  }

  /**
   * Воспроизводит звук окончания
   */
  _playEndSound() {
    const soundUrl = this._config.end_sound || '/local/sounds/timer-end.mp3';
    const audio = new Audio(soundUrl);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }

  /**
   * Выполняет действие по завершению
   */
  _executeEndAction() {
    const action = this._config.end_action;
    
    if (action.service) {
      const [domain, service] = action.service.split('.');
      if (domain && service) {
        this._hass.callService(domain, service, action.service_data || {});
      }
    }
  }

  /**
   * Получает оставшееся время в секундах
   * @returns {number}
   */
  _getRemaining() {
    switch (this._config.mode) {
      case TIMER_MODES.COUNTDOWN:
        if (!this._targetTime) return 0;
        return Math.max(0, Math.floor((this._targetTime - Date.now()) / 1000));
        
      case TIMER_MODES.COUNTUP:
        if (!this._startTime) return 0;
        return Math.floor((Date.now() - this._startTime) / 1000);
        
      case TIMER_MODES.TIMER:
      case TIMER_MODES.ENTITY:
      case TIMER_MODES.REMAINING:
        return this._getRemainingFromEntity();
        
      default:
        return 0;
    }
  }

  /**
   * Получает оставшееся время из entity
   * @returns {number}
   */
  _getRemainingFromEntity() {
    const entityId = this._config.entity_id;
    if (!entityId || !this._hass?.states?.[entityId]) return 0;

    const state = this._hass.states[entityId];
    
    // Для timer.*
    if (entityId.startsWith('timer.')) {
      if (state.state !== 'active') return 0;
      
      const finishTime = new Date(state.attributes.finishes_at);
      return Math.max(0, Math.floor((finishTime - Date.now()) / 1000));
    }

    // Для entity с атрибутом remaining
    if (state.attributes?.remaining) {
      return this._parseTimeString(state.attributes.remaining);
    }

    // Для entity с end_time
    if (state.attributes?.end_time) {
      const endTime = new Date(state.attributes.end_time);
      return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    }

    // Для числового состояния
    const numValue = parseFloat(state.state);
    if (!isNaN(numValue)) {
      return Math.floor(numValue);
    }

    return 0;
  }

  /**
   * Парсит строку времени в секунды
   * @param {string} timeStr 
   * @returns {number}
   */
  _parseTimeString(timeStr) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parseInt(timeStr, 10) || 0;
  }

  /**
   * Обновляет отображение из entity
   */
  _updateFromEntity() {
    if (!this._config.entity_id) return;

    const entityId = this._config.entity_id;
    const state = this._hass?.states?.[entityId];
    
    if (!state) return;

    // Для timer.* обновляем состояние
    if (entityId.startsWith('timer.')) {
      const isActive = state.state === 'active';
      const isPaused = state.state === 'paused';
      
      if (isActive && !this._isRunning) {
        this._isRunning = true;
        this._startTicking();
      } else if (!isActive && this._isRunning) {
        this._isRunning = false;
        this._stopTicking();
      }
      
      this._isPaused = isPaused;
    }

    this._updateDisplay();
    this._updateControlsState();
  }

  /**
   * Обновляет отображение
   */
  _updateDisplay() {
    if (!this._element) return;

    const remaining = this._getRemaining();
    const valueEl = this._element.querySelector('.uc-timer-value');
    
    if (!valueEl) return;

    // Форматируем время
    valueEl.textContent = this._formatTime(remaining);

    // Обновляем классы состояния
    this._element.classList.remove('uc-timer-warning', 'uc-timer-danger');
    
    if (this._config.mode === TIMER_MODES.COUNTDOWN) {
      if (remaining <= this._config.danger_threshold && remaining > 0) {
        this._element.classList.add('uc-timer-danger');
      } else if (remaining <= this._config.warning_threshold) {
        this._element.classList.add('uc-timer-warning');
      }
    }

    // Скрытие при неактивности
    if (this._config.hide_when_inactive) {
      const isInactive = !this._isRunning && remaining === 0;
      this._element.classList.toggle('uc-timer-hidden', isInactive);
    }
  }

  /**
   * Форматирует время
   * @param {number} seconds 
   * @returns {string}
   */
  _formatTime(seconds) {
    const isNegative = seconds < 0;
    seconds = Math.abs(seconds);

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const prefix = isNegative ? '-' : '';

    switch (this._config.format) {
      case DISPLAY_FORMATS.FULL:
        const parts = [];
        if (days > 0) parts.push(`${days}д`);
        if (hours > 0) parts.push(`${hours}ч`);
        if (minutes > 0) parts.push(`${minutes}м`);
        parts.push(`${secs}с`);
        return prefix + parts.join(' ');
        
      case DISPLAY_FORMATS.COMPACT:
        if (days > 0) {
          return `${prefix}${days}:${this._pad(hours)}:${this._pad(minutes)}:${this._pad(secs)}`;
        } else if (hours > 0) {
          return `${prefix}${hours}:${this._pad(minutes)}:${this._pad(secs)}`;
        }
        return `${prefix}${minutes}:${this._pad(secs)}`;
        
      case DISPLAY_FORMATS.HUMAN:
        return prefix + this._humanize(days, hours, minutes, secs);
        
      case DISPLAY_FORMATS.DIGITAL:
      default:
        if (days > 0) {
          return `${prefix}${days}д ${this._pad(hours)}:${this._pad(minutes)}:${this._pad(secs)}`;
        } else if (hours > 0) {
          return `${prefix}${this._pad(hours)}:${this._pad(minutes)}:${this._pad(secs)}`;
        }
        return `${prefix}${this._pad(minutes)}:${this._pad(secs)}`;
    }
  }

  /**
   * Добавляет ведущий ноль
   * @param {number} num 
   * @returns {string}
   */
  _pad(num) {
    return String(num).padStart(2, '0');
  }

  /**
   * Человекочитаемое форматирование
   * @param {number} days 
   * @param {number} hours 
   * @param {number} minutes 
   * @param {number} secs 
   * @returns {string}
   */
  _humanize(days, hours, minutes, secs) {
    if (days > 0) {
      return `через ${days} ${this._pluralize(days, 'день', 'дня', 'дней')}`;
    }
    if (hours > 0) {
      return `через ${hours} ${this._pluralize(hours, 'час', 'часа', 'часов')}`;
    }
    if (minutes > 0) {
      return `через ${minutes} ${this._pluralize(minutes, 'минуту', 'минуты', 'минут')}`;
    }
    return `через ${secs} ${this._pluralize(secs, 'секунду', 'секунды', 'секунд')}`;
  }

  /**
   * Склонение слов
   * @param {number} n 
   * @param {string} one 
   * @param {string} few 
   * @param {string} many 
   * @returns {string}
   */
  _pluralize(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    
    if (mod100 >= 11 && mod100 <= 19) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
  }

  /**
   * Обновляет состояние кнопок управления
   */
  _updateControlsState() {
    if (!this._element || !this._config.show_controls) return;

    const startBtn = this._element.querySelector('.uc-timer-start');
    const pauseBtn = this._element.querySelector('.uc-timer-pause');

    if (startBtn) {
      startBtn.style.display = this._isRunning ? 'none' : '';
    }
    if (pauseBtn) {
      pauseBtn.style.display = this._isRunning ? '' : 'none';
    }
  }

  /**
   * Уничтожает компонент
   */
  destroy() {
    this._stopTicking();
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
      .uc-timer {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
      }

      .uc-timer.uc-timer-hidden {
        display: none;
      }

      .uc-timer-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }

      .uc-timer-label {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .uc-timer-value {
        font-size: 16px;
        font-weight: 600;
        color: var(--primary-text-color);
        letter-spacing: 0.5px;
        transition: color 0.3s ease;
      }

      /* Состояния */
      .uc-timer.uc-timer-warning .uc-timer-value {
        color: var(--warning-color, #ff9800);
      }

      .uc-timer.uc-timer-danger .uc-timer-value {
        color: var(--error-color, #f44336);
        animation: uc-timer-blink 0.5s infinite;
      }

      .uc-timer.uc-timer-ended .uc-timer-value {
        color: var(--error-color, #f44336);
      }

      @keyframes uc-timer-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      /* Элементы управления */
      .uc-timer-controls {
        display: flex;
        gap: 4px;
        margin-left: 8px;
      }

      .uc-timer-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 6px;
        background: var(--primary-background-color, rgba(0,0,0,0.05));
        color: var(--primary-text-color);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .uc-timer-btn:hover {
        background: var(--primary-color);
        color: white;
      }

      .uc-timer-btn ha-icon {
        --mdc-icon-size: 16px;
      }

      /* Компактный режим */
      .uc-timer.compact {
        gap: 4px;
      }

      .uc-timer.compact .uc-timer-value {
        font-size: 14px;
      }

      .uc-timer.compact .uc-timer-icon {
        --mdc-icon-size: 16px;
      }

      /* Большой режим */
      .uc-timer.large .uc-timer-value {
        font-size: 24px;
      }

      .uc-timer.large .uc-timer-icon {
        --mdc-icon-size: 28px;
      }
    `;
  }
}

export default Timer;
