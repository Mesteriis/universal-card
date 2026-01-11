/**
 * Compact Mode - адаптивный компактный режим
 * 
 * Автоматически переключает карточку в компактный режим
 * на маленьких экранах или по запросу пользователя.
 * 
 * @module complex/CompactMode
 */

/**
 * Уровни компактности
 */
export const COMPACT_LEVELS = {
  NONE: 'none',           // Обычный режим
  REDUCED: 'reduced',     // Уменьшенные отступы
  COMPACT: 'compact',     // Компактный режим
  MINIMAL: 'minimal',     // Минимальный режим
  ICON_ONLY: 'icon_only'  // Только иконки
};

/**
 * Триггеры переключения
 */
export const COMPACT_TRIGGERS = {
  MANUAL: 'manual',           // Ручное переключение
  SCREEN_WIDTH: 'screen_width', // По ширине экрана
  CONTAINER_WIDTH: 'container_width', // По ширине контейнера
  CARD_COUNT: 'card_count',   // По количеству карточек
  AUTO: 'auto'                // Автоопределение
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  enabled: true,
  level: COMPACT_LEVELS.NONE,
  trigger: COMPACT_TRIGGERS.AUTO,
  
  // Пороги для AUTO/SCREEN_WIDTH
  breakpoints: {
    [COMPACT_LEVELS.REDUCED]: 768,
    [COMPACT_LEVELS.COMPACT]: 480,
    [COMPACT_LEVELS.MINIMAL]: 320,
    [COMPACT_LEVELS.ICON_ONLY]: 200
  },
  
  // Пороги для CONTAINER_WIDTH
  containerBreakpoints: {
    [COMPACT_LEVELS.REDUCED]: 400,
    [COMPACT_LEVELS.COMPACT]: 300,
    [COMPACT_LEVELS.MINIMAL]: 200,
    [COMPACT_LEVELS.ICON_ONLY]: 120
  },
  
  // Настройки для каждого уровня
  levelSettings: {
    [COMPACT_LEVELS.NONE]: {
      padding: '16px',
      gap: '12px',
      fontSize: '14px',
      iconSize: '24px',
      showTitle: true,
      showSubtitle: true,
      showBadges: true,
      showFooter: true,
      gridColumns: null  // Использовать из конфига
    },
    [COMPACT_LEVELS.REDUCED]: {
      padding: '12px',
      gap: '8px',
      fontSize: '13px',
      iconSize: '22px',
      showTitle: true,
      showSubtitle: true,
      showBadges: true,
      showFooter: true,
      gridColumns: null
    },
    [COMPACT_LEVELS.COMPACT]: {
      padding: '8px',
      gap: '6px',
      fontSize: '12px',
      iconSize: '20px',
      showTitle: true,
      showSubtitle: false,
      showBadges: true,
      showFooter: false,
      gridColumns: 1
    },
    [COMPACT_LEVELS.MINIMAL]: {
      padding: '6px',
      gap: '4px',
      fontSize: '11px',
      iconSize: '18px',
      showTitle: true,
      showSubtitle: false,
      showBadges: false,
      showFooter: false,
      gridColumns: 1
    },
    [COMPACT_LEVELS.ICON_ONLY]: {
      padding: '4px',
      gap: '2px',
      fontSize: '10px',
      iconSize: '16px',
      showTitle: false,
      showSubtitle: false,
      showBadges: false,
      showFooter: false,
      gridColumns: 1
    }
  }
};

/**
 * Класс для управления компактным режимом
 */
export class CompactMode {
  /**
   * @param {HTMLElement} element - Элемент карточки
   * @param {Object} config - Конфигурация
   */
  constructor(element, config = {}) {
    this._element = element;
    this._config = this._mergeConfig(DEFAULT_CONFIG, config);
    this._currentLevel = COMPACT_LEVELS.NONE;
    this._resizeObserver = null;
    this._mediaQueryListeners = [];
    this._callbacks = new Set();
    
    this._init();
  }

  /**
   * Глубокое слияние конфигураций
   * @param {Object} defaults 
   * @param {Object} overrides 
   * @returns {Object}
   */
  _mergeConfig(defaults, overrides) {
    const result = { ...defaults };
    
    for (const key of Object.keys(overrides)) {
      if (overrides[key] && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
        result[key] = this._mergeConfig(defaults[key] || {}, overrides[key]);
      } else {
        result[key] = overrides[key];
      }
    }
    
    return result;
  }

  /**
   * Инициализация
   */
  _init() {
    if (!this._config.enabled) return;

    switch (this._config.trigger) {
      case COMPACT_TRIGGERS.SCREEN_WIDTH:
      case COMPACT_TRIGGERS.AUTO:
        this._setupMediaQueries();
        break;
        
      case COMPACT_TRIGGERS.CONTAINER_WIDTH:
        this._setupResizeObserver();
        break;
        
      case COMPACT_TRIGGERS.MANUAL:
        // Ручной режим - уровень из конфига
        this.setLevel(this._config.level);
        break;
    }

    // Для AUTO также настраиваем наблюдение за контейнером
    if (this._config.trigger === COMPACT_TRIGGERS.AUTO) {
      this._setupResizeObserver();
    }
  }

  /**
   * Настраивает media queries для отслеживания ширины экрана
   */
  _setupMediaQueries() {
    const breakpoints = this._config.breakpoints;
    const sortedLevels = Object.entries(breakpoints)
      .sort(([, a], [, b]) => a - b); // Сортируем по ширине

    for (const [level, width] of sortedLevels) {
      const mql = window.matchMedia(`(max-width: ${width}px)`);
      
      const handler = (e) => {
        this._evaluateLevel();
      };

      mql.addEventListener('change', handler);
      this._mediaQueryListeners.push({ mql, handler });
    }

    // Начальная оценка
    this._evaluateLevel();
  }

  /**
   * Настраивает ResizeObserver для контейнера
   */
  _setupResizeObserver() {
    if (!window.ResizeObserver) return;

    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this._handleResize(entry.contentRect.width);
      }
    });

    this._resizeObserver.observe(this._element);
  }

  /**
   * Обрабатывает изменение размера контейнера
   * @param {number} width 
   */
  _handleResize(width) {
    if (this._config.trigger !== COMPACT_TRIGGERS.CONTAINER_WIDTH &&
        this._config.trigger !== COMPACT_TRIGGERS.AUTO) {
      return;
    }

    const breakpoints = this._config.containerBreakpoints;
    let newLevel = COMPACT_LEVELS.NONE;

    // Находим подходящий уровень
    for (const [level, threshold] of Object.entries(breakpoints)) {
      if (width <= threshold) {
        newLevel = level;
      }
    }

    this.setLevel(newLevel);
  }

  /**
   * Оценивает необходимый уровень компактности
   */
  _evaluateLevel() {
    const breakpoints = this._config.breakpoints;
    const screenWidth = window.innerWidth;
    let newLevel = COMPACT_LEVELS.NONE;

    // Находим подходящий уровень по ширине экрана
    for (const [level, threshold] of Object.entries(breakpoints)) {
      if (screenWidth <= threshold) {
        newLevel = level;
      }
    }

    this.setLevel(newLevel);
  }

  /**
   * Устанавливает уровень компактности
   * @param {string} level 
   */
  setLevel(level) {
    if (!Object.values(COMPACT_LEVELS).includes(level)) {
      console.warn(`[CompactMode] Unknown level: ${level}`);
      return;
    }

    if (level === this._currentLevel) return;

    const oldLevel = this._currentLevel;
    this._currentLevel = level;

    this._applyLevel(level);
    this._notifyCallbacks(level, oldLevel);
  }

  /**
   * Получает текущий уровень
   * @returns {string}
   */
  getLevel() {
    return this._currentLevel;
  }

  /**
   * Получает настройки текущего уровня
   * @returns {Object}
   */
  getCurrentSettings() {
    return this._config.levelSettings[this._currentLevel] || {};
  }

  /**
   * Применяет уровень к элементу
   * @param {string} level 
   */
  _applyLevel(level) {
    // Удаляем старые классы
    for (const lvl of Object.values(COMPACT_LEVELS)) {
      this._element.classList.remove(`uc-compact-${lvl}`);
    }

    // Добавляем новый класс
    this._element.classList.add(`uc-compact-${level}`);

    // Применяем CSS переменные
    const settings = this._config.levelSettings[level];
    if (settings) {
      this._element.style.setProperty('--uc-compact-padding', settings.padding);
      this._element.style.setProperty('--uc-compact-gap', settings.gap);
      this._element.style.setProperty('--uc-compact-font-size', settings.fontSize);
      this._element.style.setProperty('--uc-compact-icon-size', settings.iconSize);
    }

    // Обновляем data-атрибут для CSS селекторов
    this._element.dataset.compactLevel = level;
  }

  /**
   * Переключает на следующий уровень компактности
   */
  toggleNext() {
    const levels = Object.values(COMPACT_LEVELS);
    const currentIndex = levels.indexOf(this._currentLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    this.setLevel(levels[nextIndex]);
  }

  /**
   * Переключает на предыдущий уровень компактности
   */
  togglePrevious() {
    const levels = Object.values(COMPACT_LEVELS);
    const currentIndex = levels.indexOf(this._currentLevel);
    const prevIndex = (currentIndex - 1 + levels.length) % levels.length;
    this.setLevel(levels[prevIndex]);
  }

  /**
   * Сбрасывает на обычный режим
   */
  reset() {
    this.setLevel(COMPACT_LEVELS.NONE);
  }

  /**
   * Проверяет, является ли режим компактным
   * @returns {boolean}
   */
  isCompact() {
    return this._currentLevel !== COMPACT_LEVELS.NONE;
  }

  /**
   * Проверяет видимость элемента на текущем уровне
   * @param {string} elementType - title, subtitle, badges, footer
   * @returns {boolean}
   */
  shouldShow(elementType) {
    const settings = this.getCurrentSettings();
    const key = `show${elementType.charAt(0).toUpperCase() + elementType.slice(1)}`;
    return settings[key] !== false;
  }

  /**
   * Получает количество колонок для grid
   * @param {number} defaultColumns 
   * @returns {number}
   */
  getGridColumns(defaultColumns = 2) {
    const settings = this.getCurrentSettings();
    return settings.gridColumns != null ? settings.gridColumns : defaultColumns;
  }

  /**
   * Подписывается на изменения уровня
   * @param {Function} callback 
   * @returns {Function} Функция отписки
   */
  subscribe(callback) {
    this._callbacks.add(callback);
    return () => this._callbacks.delete(callback);
  }

  /**
   * Уведомляет подписчиков
   * @param {string} newLevel 
   * @param {string} oldLevel 
   */
  _notifyCallbacks(newLevel, oldLevel) {
    for (const callback of this._callbacks) {
      try {
        callback(newLevel, oldLevel);
      } catch (error) {
        console.error('[CompactMode] Callback error:', error);
      }
    }
  }

  /**
   * Уничтожает компонент
   */
  destroy() {
    // Удаляем media query listeners
    for (const { mql, handler } of this._mediaQueryListeners) {
      mql.removeEventListener('change', handler);
    }
    this._mediaQueryListeners = [];

    // Останавливаем ResizeObserver
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    // Очищаем callbacks
    this._callbacks.clear();

    // Удаляем классы и стили
    for (const lvl of Object.values(COMPACT_LEVELS)) {
      this._element.classList.remove(`uc-compact-${lvl}`);
    }
    
    this._element.style.removeProperty('--uc-compact-padding');
    this._element.style.removeProperty('--uc-compact-gap');
    this._element.style.removeProperty('--uc-compact-font-size');
    this._element.style.removeProperty('--uc-compact-icon-size');
    
    delete this._element.dataset.compactLevel;
  }

  /**
   * Возвращает CSS стили для компактных режимов
   * @returns {string}
   */
  static getStyles() {
    return `
      /* Базовые CSS переменные */
      :host {
        --uc-compact-padding: 16px;
        --uc-compact-gap: 12px;
        --uc-compact-font-size: 14px;
        --uc-compact-icon-size: 24px;
      }

      /* REDUCED - Уменьшенные отступы */
      :host(.uc-compact-reduced),
      .uc-compact-reduced {
        --uc-compact-padding: 12px;
        --uc-compact-gap: 8px;
        --uc-compact-font-size: 13px;
        --uc-compact-icon-size: 22px;
      }

      /* COMPACT - Компактный режим */
      :host(.uc-compact-compact),
      .uc-compact-compact {
        --uc-compact-padding: 8px;
        --uc-compact-gap: 6px;
        --uc-compact-font-size: 12px;
        --uc-compact-icon-size: 20px;
      }

      :host(.uc-compact-compact) .uc-subtitle,
      .uc-compact-compact .uc-subtitle {
        display: none;
      }

      :host(.uc-compact-compact) .uc-footer,
      .uc-compact-compact .uc-footer {
        display: none;
      }

      /* MINIMAL - Минимальный режим */
      :host(.uc-compact-minimal),
      .uc-compact-minimal {
        --uc-compact-padding: 6px;
        --uc-compact-gap: 4px;
        --uc-compact-font-size: 11px;
        --uc-compact-icon-size: 18px;
      }

      :host(.uc-compact-minimal) .uc-subtitle,
      :host(.uc-compact-minimal) .uc-badges,
      :host(.uc-compact-minimal) .uc-footer,
      .uc-compact-minimal .uc-subtitle,
      .uc-compact-minimal .uc-badges,
      .uc-compact-minimal .uc-footer {
        display: none;
      }

      /* ICON_ONLY - Только иконки */
      :host(.uc-compact-icon_only),
      .uc-compact-icon_only {
        --uc-compact-padding: 4px;
        --uc-compact-gap: 2px;
        --uc-compact-font-size: 10px;
        --uc-compact-icon-size: 16px;
      }

      :host(.uc-compact-icon_only) .uc-title,
      :host(.uc-compact-icon_only) .uc-subtitle,
      :host(.uc-compact-icon_only) .uc-badges,
      :host(.uc-compact-icon_only) .uc-footer,
      :host(.uc-compact-icon_only) .uc-action-name,
      .uc-compact-icon_only .uc-title,
      .uc-compact-icon_only .uc-subtitle,
      .uc-compact-icon_only .uc-badges,
      .uc-compact-icon_only .uc-footer,
      .uc-compact-icon_only .uc-action-name {
        display: none;
      }

      /* Применение переменных */
      .uc-header,
      .uc-body,
      .uc-footer {
        padding: var(--uc-compact-padding);
        gap: var(--uc-compact-gap);
      }

      .uc-title,
      .uc-subtitle,
      .uc-content {
        font-size: var(--uc-compact-font-size);
      }

      .uc-header ha-icon,
      .uc-body ha-icon {
        --mdc-icon-size: var(--uc-compact-icon-size);
      }

      /* Анимация переходов */
      :host,
      .uc-header,
      .uc-body,
      .uc-footer,
      .uc-title,
      .uc-subtitle {
        transition: 
          padding 0.2s ease,
          gap 0.2s ease,
          font-size 0.2s ease;
      }

      /* Grid адаптация */
      :host([data-compact-level="compact"]) .uc-body-grid,
      :host([data-compact-level="minimal"]) .uc-body-grid,
      :host([data-compact-level="icon_only"]) .uc-body-grid,
      [data-compact-level="compact"] .uc-body-grid,
      [data-compact-level="minimal"] .uc-body-grid,
      [data-compact-level="icon_only"] .uc-body-grid {
        grid-template-columns: 1fr !important;
      }

      /* Компактные кнопки */
      :host(.uc-compact-compact) .uc-quick-action,
      :host(.uc-compact-minimal) .uc-quick-action,
      :host(.uc-compact-icon_only) .uc-quick-action,
      .uc-compact-compact .uc-quick-action,
      .uc-compact-minimal .uc-quick-action,
      .uc-compact-icon_only .uc-quick-action {
        padding: 4px 8px;
        min-width: 28px;
        min-height: 28px;
      }

      /* Компактный header */
      :host(.uc-compact-minimal) .uc-header,
      :host(.uc-compact-icon_only) .uc-header,
      .uc-compact-minimal .uc-header,
      .uc-compact-icon_only .uc-header {
        min-height: auto;
      }

      /* Скрытие стрелки в минимальных режимах */
      :host(.uc-compact-icon_only) .uc-expand-icon,
      .uc-compact-icon_only .uc-expand-icon {
        display: none;
      }
    `;
  }
}

export default CompactMode;
