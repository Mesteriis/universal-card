/**
 * Neumorphism Theme - эффект мягкого выдавливания
 * 
 * Создаёт эффект мягких теней, имитирующих
 * выпуклые или вдавленные элементы интерфейса.
 * 
 * @module themes/Neumorphism
 */

/**
 * Типы neumorphism эффектов
 */
export const NEUMORPHISM_TYPES = {
  FLAT: 'flat',         // Плоский (без эффекта)
  RAISED: 'raised',     // Выпуклый
  PRESSED: 'pressed',   // Вдавленный
  INSET: 'inset',       // Внутренний
  CONVEX: 'convex',     // Выпуклая поверхность
  CONCAVE: 'concave'    // Вогнутая поверхность
};

/**
 * Интенсивность эффекта
 */
export const INTENSITY_LEVELS = {
  SUBTLE: 'subtle',     // Едва заметный
  LIGHT: 'light',       // Лёгкий
  MEDIUM: 'medium',     // Средний
  STRONG: 'strong',     // Сильный
  EXTREME: 'extreme'    // Экстремальный
};

/**
 * Конфигурация интенсивности
 */
const INTENSITY_CONFIG = {
  [INTENSITY_LEVELS.SUBTLE]: {
    distance: 3,
    blur: 6,
    lightOpacity: 0.5,
    shadowOpacity: 0.1
  },
  [INTENSITY_LEVELS.LIGHT]: {
    distance: 5,
    blur: 10,
    lightOpacity: 0.7,
    shadowOpacity: 0.15
  },
  [INTENSITY_LEVELS.MEDIUM]: {
    distance: 8,
    blur: 16,
    lightOpacity: 1,
    shadowOpacity: 0.2
  },
  [INTENSITY_LEVELS.STRONG]: {
    distance: 12,
    blur: 24,
    lightOpacity: 1,
    shadowOpacity: 0.3
  },
  [INTENSITY_LEVELS.EXTREME]: {
    distance: 20,
    blur: 40,
    lightOpacity: 1,
    shadowOpacity: 0.4
  }
};

/**
 * Цветовые палитры для neumorphism
 */
export const NEUMORPHISM_PALETTES = {
  // Светлая тема
  LIGHT: {
    background: '#e0e5ec',
    lightShadow: '#ffffff',
    darkShadow: '#a3b1c6',
    text: '#333333',
    accent: '#6d5dfc'
  },
  
  // Тёмная тема
  DARK: {
    background: '#2d2d2d',
    lightShadow: '#3d3d3d',
    darkShadow: '#1d1d1d',
    text: '#e0e0e0',
    accent: '#6d5dfc'
  },
  
  // Синяя тема
  BLUE: {
    background: '#d6e4f0',
    lightShadow: '#ffffff',
    darkShadow: '#a3b8cc',
    text: '#2c3e50',
    accent: '#3498db'
  },
  
  // Зелёная тема
  GREEN: {
    background: '#d4e6d4',
    lightShadow: '#ffffff',
    darkShadow: '#a3c4a3',
    text: '#2d4a2d',
    accent: '#27ae60'
  },
  
  // Розовая тема
  PINK: {
    background: '#f0d6e4',
    lightShadow: '#ffffff',
    darkShadow: '#c4a3b4',
    text: '#4a2d3d',
    accent: '#e91e63'
  },
  
  // Кастомная (использует CSS переменные)
  CUSTOM: {
    background: 'var(--neu-background, #e0e5ec)',
    lightShadow: 'var(--neu-light-shadow, #ffffff)',
    darkShadow: 'var(--neu-dark-shadow, #a3b1c6)',
    text: 'var(--neu-text, #333333)',
    accent: 'var(--neu-accent, #6d5dfc)'
  }
};

/**
 * Класс для создания neumorphism эффектов
 */
export class Neumorphism {
  /**
   * @param {Object} config - Конфигурация
   */
  constructor(config = {}) {
    this._config = {
      type: NEUMORPHISM_TYPES.RAISED,
      intensity: INTENSITY_LEVELS.MEDIUM,
      palette: 'LIGHT',
      lightAngle: 145, // Угол источника света (в градусах)
      borderRadius: 12,
      ...config
    };
  }

  /**
   * Устанавливает тип эффекта
   * @param {string} type 
   */
  setType(type) {
    if (Object.values(NEUMORPHISM_TYPES).includes(type)) {
      this._config.type = type;
    }
  }

  /**
   * Устанавливает интенсивность
   * @param {string} intensity 
   */
  setIntensity(intensity) {
    if (Object.values(INTENSITY_LEVELS).includes(intensity)) {
      this._config.intensity = intensity;
    }
  }

  /**
   * Устанавливает палитру
   * @param {string} paletteName 
   */
  setPalette(paletteName) {
    if (NEUMORPHISM_PALETTES[paletteName]) {
      this._config.palette = paletteName;
    }
  }

  /**
   * Устанавливает угол источника света
   * @param {number} angle - Угол в градусах (0-360)
   */
  setLightAngle(angle) {
    this._config.lightAngle = angle % 360;
  }

  /**
   * Получает палитру
   * @returns {Object}
   */
  getPalette() {
    return NEUMORPHISM_PALETTES[this._config.palette] || NEUMORPHISM_PALETTES.LIGHT;
  }

  /**
   * Вычисляет смещение теней на основе угла света
   * @returns {Object} { lightX, lightY, darkX, darkY }
   */
  _calculateShadowOffset() {
    const angle = this._config.lightAngle;
    const radians = (angle * Math.PI) / 180;
    const intensity = INTENSITY_CONFIG[this._config.intensity];
    const distance = intensity.distance;

    // Светлая тень в направлении света
    const lightX = Math.round(-Math.cos(radians) * distance);
    const lightY = Math.round(-Math.sin(radians) * distance);

    // Тёмная тень в противоположном направлении
    const darkX = Math.round(Math.cos(radians) * distance);
    const darkY = Math.round(Math.sin(radians) * distance);

    return { lightX, lightY, darkX, darkY, blur: intensity.blur };
  }

  /**
   * Генерирует box-shadow для типа эффекта
   * @param {Object} overrides 
   * @returns {string}
   */
  generateShadow(overrides = {}) {
    const config = { ...this._config, ...overrides };
    const palette = this.getPalette();
    const intensity = INTENSITY_CONFIG[config.intensity];
    const offset = this._calculateShadowOffset();

    const lightShadow = palette.lightShadow;
    const darkShadow = palette.darkShadow;

    switch (config.type) {
      case NEUMORPHISM_TYPES.FLAT:
        return 'none';

      case NEUMORPHISM_TYPES.RAISED:
        return `
          ${offset.lightX}px ${offset.lightY}px ${offset.blur}px ${lightShadow},
          ${offset.darkX}px ${offset.darkY}px ${offset.blur}px ${darkShadow}
        `.trim();

      case NEUMORPHISM_TYPES.PRESSED:
        return `
          inset ${offset.darkX}px ${offset.darkY}px ${offset.blur}px ${darkShadow},
          inset ${offset.lightX}px ${offset.lightY}px ${offset.blur}px ${lightShadow}
        `.trim();

      case NEUMORPHISM_TYPES.INSET:
        return `
          inset ${offset.lightX}px ${offset.lightY}px ${offset.blur / 2}px ${lightShadow},
          inset ${offset.darkX}px ${offset.darkY}px ${offset.blur / 2}px ${darkShadow}
        `.trim();

      case NEUMORPHISM_TYPES.CONVEX:
        return `
          ${offset.lightX}px ${offset.lightY}px ${offset.blur}px ${lightShadow},
          ${offset.darkX}px ${offset.darkY}px ${offset.blur}px ${darkShadow},
          inset ${offset.lightX / 2}px ${offset.lightY / 2}px ${offset.blur / 4}px ${lightShadow},
          inset ${offset.darkX / 2}px ${offset.darkY / 2}px ${offset.blur / 4}px ${darkShadow}
        `.trim();

      case NEUMORPHISM_TYPES.CONCAVE:
        return `
          ${offset.lightX}px ${offset.lightY}px ${offset.blur}px ${lightShadow},
          ${offset.darkX}px ${offset.darkY}px ${offset.blur}px ${darkShadow},
          inset ${offset.darkX / 2}px ${offset.darkY / 2}px ${offset.blur / 4}px ${darkShadow},
          inset ${offset.lightX / 2}px ${offset.lightY / 2}px ${offset.blur / 4}px ${lightShadow}
        `.trim();

      default:
        return 'none';
    }
  }

  /**
   * Генерирует background-gradient для выпуклых/вогнутых поверхностей
   * @returns {string|null}
   */
  generateGradient() {
    const palette = this.getPalette();
    const angle = this._config.lightAngle;

    switch (this._config.type) {
      case NEUMORPHISM_TYPES.CONVEX:
        return `linear-gradient(${angle}deg, 
          ${this._lighten(palette.background, 5)}, 
          ${this._darken(palette.background, 5)})`;

      case NEUMORPHISM_TYPES.CONCAVE:
        return `linear-gradient(${angle}deg, 
          ${this._darken(palette.background, 5)}, 
          ${this._lighten(palette.background, 5)})`;

      default:
        return null;
    }
  }

  /**
   * Осветляет цвет
   * @param {string} color 
   * @param {number} percent 
   * @returns {string}
   */
  _lighten(color, percent) {
    if (color.startsWith('var(')) return color;
    // Простое осветление для hex цветов
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  /**
   * Затемняет цвет
   * @param {string} color 
   * @param {number} percent 
   * @returns {string}
   */
  _darken(color, percent) {
    if (color.startsWith('var(')) return color;
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  /**
   * Генерирует полные стили
   * @param {Object} overrides 
   * @returns {Object}
   */
  generateStyles(overrides = {}) {
    const palette = this.getPalette();
    const shadow = this.generateShadow(overrides);
    const gradient = this.generateGradient();

    const styles = {
      backgroundColor: palette.background,
      boxShadow: shadow,
      borderRadius: `${this._config.borderRadius}px`,
      color: palette.text,
      border: 'none'
    };

    if (gradient) {
      styles.background = gradient;
    }

    return styles;
  }

  /**
   * Применяет стили к элементу
   * @param {HTMLElement} element 
   * @param {Object} overrides 
   */
  apply(element, overrides = {}) {
    const styles = this.generateStyles(overrides);
    
    for (const [property, value] of Object.entries(styles)) {
      element.style[property] = value;
    }

    element.classList.add('uc-neu');
    element.dataset.neuType = this._config.type;
  }

  /**
   * Удаляет стили с элемента
   * @param {HTMLElement} element 
   */
  remove(element) {
    const properties = ['backgroundColor', 'background', 'boxShadow', 'borderRadius', 'color', 'border'];
    
    for (const property of properties) {
      element.style[property] = '';
    }

    element.classList.remove('uc-neu');
    delete element.dataset.neuType;
  }

  /**
   * Возвращает все CSS стили neumorphism
   * @returns {string}
   */
  static getStyles() {
    const styles = [];

    // Генерируем классы для каждой палитры и типа
    for (const [paletteName, palette] of Object.entries(NEUMORPHISM_PALETTES)) {
      const pClass = paletteName.toLowerCase();

      // Базовый класс палитры
      styles.push(`
        .uc-neu-${pClass} {
          --neu-background: ${palette.background};
          --neu-light-shadow: ${palette.lightShadow};
          --neu-dark-shadow: ${palette.darkShadow};
          --neu-text: ${palette.text};
          --neu-accent: ${palette.accent};
          background: var(--neu-background);
          color: var(--neu-text);
        }
      `);

      // Генерируем типы для палитры
      for (const [typeName, type] of Object.entries(NEUMORPHISM_TYPES)) {
        const tClass = typeName.toLowerCase();
        const intensity = INTENSITY_CONFIG[INTENSITY_LEVELS.MEDIUM];

        let shadow;
        switch (type) {
          case NEUMORPHISM_TYPES.FLAT:
            shadow = 'none';
            break;
          case NEUMORPHISM_TYPES.RAISED:
            shadow = `-${intensity.distance}px -${intensity.distance}px ${intensity.blur}px var(--neu-light-shadow), ${intensity.distance}px ${intensity.distance}px ${intensity.blur}px var(--neu-dark-shadow)`;
            break;
          case NEUMORPHISM_TYPES.PRESSED:
            shadow = `inset ${intensity.distance}px ${intensity.distance}px ${intensity.blur}px var(--neu-dark-shadow), inset -${intensity.distance}px -${intensity.distance}px ${intensity.blur}px var(--neu-light-shadow)`;
            break;
          case NEUMORPHISM_TYPES.INSET:
            shadow = `inset -${intensity.distance / 2}px -${intensity.distance / 2}px ${intensity.blur / 2}px var(--neu-light-shadow), inset ${intensity.distance / 2}px ${intensity.distance / 2}px ${intensity.blur / 2}px var(--neu-dark-shadow)`;
            break;
          default:
            shadow = 'none';
        }

        styles.push(`
          .uc-neu-${pClass}.uc-neu-${tClass} {
            box-shadow: ${shadow};
          }
        `);
      }
    }

    // Интерактивные состояния
    styles.push(`
      /* Hover эффект - переход к pressed */
      .uc-neu-interactive:hover {
        box-shadow: inset 4px 4px 8px var(--neu-dark-shadow),
                    inset -4px -4px 8px var(--neu-light-shadow);
      }

      /* Active эффект - глубже pressed */
      .uc-neu-interactive:active {
        box-shadow: inset 6px 6px 12px var(--neu-dark-shadow),
                    inset -6px -6px 12px var(--neu-light-shadow);
      }

      /* Transition для плавности */
      .uc-neu {
        transition: box-shadow 0.2s ease, background 0.2s ease;
      }

      /* Утилитарные классы интенсивности */
      .uc-neu-subtle { --neu-intensity: 0.5; }
      .uc-neu-light { --neu-intensity: 0.7; }
      .uc-neu-medium { --neu-intensity: 1; }
      .uc-neu-strong { --neu-intensity: 1.3; }
      .uc-neu-extreme { --neu-intensity: 1.6; }

      /* Кнопка в стиле neumorphism */
      .uc-neu-button {
        padding: 12px 24px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        background: var(--neu-background);
        color: var(--neu-text);
        box-shadow: -5px -5px 10px var(--neu-light-shadow),
                    5px 5px 10px var(--neu-dark-shadow);
        transition: all 0.2s ease;
      }

      .uc-neu-button:hover {
        box-shadow: -2px -2px 5px var(--neu-light-shadow),
                    2px 2px 5px var(--neu-dark-shadow);
      }

      .uc-neu-button:active {
        box-shadow: inset 3px 3px 6px var(--neu-dark-shadow),
                    inset -3px -3px 6px var(--neu-light-shadow);
      }

      /* Инпут в стиле neumorphism */
      .uc-neu-input {
        padding: 12px 16px;
        border-radius: 8px;
        border: none;
        background: var(--neu-background);
        color: var(--neu-text);
        box-shadow: inset 3px 3px 6px var(--neu-dark-shadow),
                    inset -3px -3px 6px var(--neu-light-shadow);
        outline: none;
      }

      .uc-neu-input:focus {
        box-shadow: inset 4px 4px 8px var(--neu-dark-shadow),
                    inset -4px -4px 8px var(--neu-light-shadow),
                    0 0 0 2px var(--neu-accent);
      }
    `);

    return styles.join('\n');
  }
}

export default Neumorphism;
