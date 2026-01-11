/**
 * Glassmorphism Theme - эффект стекла
 * 
 * Создаёт эффект матового стекла с размытием фона,
 * полупрозрачностью и тонкими границами.
 * 
 * @module themes/Glassmorphism
 */

/**
 * Пресеты стеклянных эффектов
 */
export const GLASS_PRESETS = {
  // Стандартное стекло
  DEFAULT: {
    name: 'Default',
    blur: 10,
    opacity: 0.7,
    saturation: 180,
    borderOpacity: 0.2,
    borderWidth: 1,
    shadowOpacity: 0.1
  },
  
  // Прозрачное стекло
  CLEAR: {
    name: 'Clear',
    blur: 20,
    opacity: 0.9,
    saturation: 100,
    borderOpacity: 0.1,
    borderWidth: 1,
    shadowOpacity: 0.05
  },
  
  // Матовое стекло
  FROSTED: {
    name: 'Frosted',
    blur: 25,
    opacity: 0.6,
    saturation: 150,
    borderOpacity: 0.3,
    borderWidth: 1,
    shadowOpacity: 0.15
  },
  
  // Тонированное стекло
  TINTED: {
    name: 'Tinted',
    blur: 15,
    opacity: 0.5,
    saturation: 200,
    borderOpacity: 0.2,
    borderWidth: 1,
    shadowOpacity: 0.12,
    tint: 'var(--primary-color)'
  },
  
  // Плотное стекло
  DENSE: {
    name: 'Dense',
    blur: 8,
    opacity: 0.85,
    saturation: 120,
    borderOpacity: 0.4,
    borderWidth: 2,
    shadowOpacity: 0.2
  },
  
  // Неоновое стекло
  NEON: {
    name: 'Neon',
    blur: 12,
    opacity: 0.6,
    saturation: 250,
    borderOpacity: 0.5,
    borderWidth: 1,
    shadowOpacity: 0.15,
    glowColor: 'var(--primary-color)',
    glowIntensity: 10
  },
  
  // Минимальное стекло
  MINIMAL: {
    name: 'Minimal',
    blur: 5,
    opacity: 0.95,
    saturation: 100,
    borderOpacity: 0.05,
    borderWidth: 0,
    shadowOpacity: 0.05
  }
};

/**
 * Цветовые схемы для стекла
 */
export const GLASS_COLORS = {
  LIGHT: {
    background: 'rgba(255, 255, 255, {opacity})',
    border: 'rgba(255, 255, 255, {borderOpacity})',
    shadow: 'rgba(0, 0, 0, {shadowOpacity})'
  },
  DARK: {
    background: 'rgba(0, 0, 0, {opacity})',
    border: 'rgba(255, 255, 255, {borderOpacity})',
    shadow: 'rgba(0, 0, 0, {shadowOpacity})'
  },
  PRIMARY: {
    background: 'rgba(var(--rgb-primary-color), {opacity})',
    border: 'rgba(var(--rgb-primary-color), {borderOpacity})',
    shadow: 'rgba(var(--rgb-primary-color), {shadowOpacity})'
  },
  ACCENT: {
    background: 'rgba(var(--rgb-accent-color), {opacity})',
    border: 'rgba(var(--rgb-accent-color), {borderOpacity})',
    shadow: 'rgba(var(--rgb-accent-color), {shadowOpacity})'
  }
};

/**
 * Класс для создания glassmorphism эффектов
 */
export class Glassmorphism {
  /**
   * @param {Object} config - Конфигурация эффекта
   */
  constructor(config = {}) {
    this._config = {
      preset: 'DEFAULT',
      colorScheme: 'LIGHT',
      customSettings: {},
      ...config
    };
  }

  /**
   * Устанавливает пресет
   * @param {string} presetName 
   */
  setPreset(presetName) {
    if (GLASS_PRESETS[presetName]) {
      this._config.preset = presetName;
    }
  }

  /**
   * Устанавливает цветовую схему
   * @param {string} schemeName 
   */
  setColorScheme(schemeName) {
    if (GLASS_COLORS[schemeName]) {
      this._config.colorScheme = schemeName;
    }
  }

  /**
   * Получает текущие настройки
   * @returns {Object}
   */
  getSettings() {
    const preset = GLASS_PRESETS[this._config.preset] || GLASS_PRESETS.DEFAULT;
    return { ...preset, ...this._config.customSettings };
  }

  /**
   * Генерирует CSS стили для элемента
   * @param {Object} overrides - Переопределения настроек
   * @returns {Object} Объект со стилями
   */
  generateStyles(overrides = {}) {
    const settings = { ...this.getSettings(), ...overrides };
    const colors = GLASS_COLORS[this._config.colorScheme] || GLASS_COLORS.LIGHT;

    const background = colors.background
      .replace('{opacity}', settings.opacity);
    
    const border = colors.border
      .replace('{borderOpacity}', settings.borderOpacity);
    
    const shadow = colors.shadow
      .replace('{shadowOpacity}', settings.shadowOpacity);

    const styles = {
      background,
      backdropFilter: `blur(${settings.blur}px) saturate(${settings.saturation}%)`,
      WebkitBackdropFilter: `blur(${settings.blur}px) saturate(${settings.saturation}%)`,
      border: settings.borderWidth > 0 ? `${settings.borderWidth}px solid ${border}` : 'none',
      boxShadow: `0 8px 32px ${shadow}`
    };

    // Тонировка
    if (settings.tint) {
      styles.background = `linear-gradient(135deg, ${settings.tint}20, ${background})`;
    }

    // Свечение (для NEON)
    if (settings.glowColor && settings.glowIntensity) {
      styles.boxShadow = `
        0 8px 32px ${shadow},
        0 0 ${settings.glowIntensity}px ${settings.glowColor}40,
        inset 0 0 ${settings.glowIntensity / 2}px ${settings.glowColor}20
      `;
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

    element.classList.add('uc-glass');
  }

  /**
   * Удаляет стили с элемента
   * @param {HTMLElement} element 
   */
  remove(element) {
    const properties = [
      'background',
      'backdropFilter',
      'webkitBackdropFilter',
      'border',
      'boxShadow'
    ];

    for (const property of properties) {
      element.style[property] = '';
    }

    element.classList.remove('uc-glass');
  }

  /**
   * Генерирует CSS класс
   * @param {string} className 
   * @param {Object} overrides 
   * @returns {string}
   */
  generateCSS(className = 'glass', overrides = {}) {
    const styles = this.generateStyles(overrides);
    
    return `
      .${className} {
        background: ${styles.background};
        backdrop-filter: ${styles.backdropFilter};
        -webkit-backdrop-filter: ${styles.WebkitBackdropFilter};
        border: ${styles.border};
        box-shadow: ${styles.boxShadow};
        border-radius: var(--ha-card-border-radius, 12px);
      }
    `;
  }

  /**
   * Возвращает все CSS стили glassmorphism
   * @returns {string}
   */
  static getStyles() {
    const styles = [];

    // Базовый класс
    styles.push(`
      .uc-glass {
        position: relative;
        isolation: isolate;
      }

      .uc-glass::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: -1;
      }
    `);

    // Генерируем классы для всех пресетов
    for (const [name, preset] of Object.entries(GLASS_PRESETS)) {
      const className = `uc-glass-${name.toLowerCase()}`;
      const lightBg = `rgba(255, 255, 255, ${preset.opacity})`;
      const darkBg = `rgba(0, 0, 0, ${preset.opacity})`;
      const border = `rgba(255, 255, 255, ${preset.borderOpacity})`;
      const shadow = `rgba(0, 0, 0, ${preset.shadowOpacity})`;

      styles.push(`
        .${className} {
          background: ${lightBg};
          backdrop-filter: blur(${preset.blur}px) saturate(${preset.saturation}%);
          -webkit-backdrop-filter: blur(${preset.blur}px) saturate(${preset.saturation}%);
          border: ${preset.borderWidth}px solid ${border};
          box-shadow: 0 8px 32px ${shadow};
        }

        @media (prefers-color-scheme: dark) {
          .${className} {
            background: ${darkBg};
          }
        }
      `);

      // Неоновый эффект
      if (preset.glowColor) {
        styles.push(`
          .${className} {
            box-shadow: 
              0 8px 32px ${shadow},
              0 0 ${preset.glowIntensity}px ${preset.glowColor}40,
              inset 0 0 ${preset.glowIntensity / 2}px ${preset.glowColor}20;
          }
        `);
      }
    }

    // Утилитарные классы
    styles.push(`
      /* Утилитарные классы для размытия */
      .uc-blur-none { backdrop-filter: none; -webkit-backdrop-filter: none; }
      .uc-blur-sm { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
      .uc-blur-md { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      .uc-blur-lg { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      .uc-blur-xl { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
      .uc-blur-2xl { backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); }

      /* Насыщенность */
      .uc-saturate-0 { backdrop-filter: saturate(0%); -webkit-backdrop-filter: saturate(0%); }
      .uc-saturate-50 { backdrop-filter: saturate(50%); -webkit-backdrop-filter: saturate(50%); }
      .uc-saturate-100 { backdrop-filter: saturate(100%); -webkit-backdrop-filter: saturate(100%); }
      .uc-saturate-150 { backdrop-filter: saturate(150%); -webkit-backdrop-filter: saturate(150%); }
      .uc-saturate-200 { backdrop-filter: saturate(200%); -webkit-backdrop-filter: saturate(200%); }

      /* Fallback для браузеров без поддержки backdrop-filter */
      @supports not (backdrop-filter: blur(10px)) {
        .uc-glass,
        [class*="uc-glass-"] {
          background: var(--ha-card-background, rgba(255, 255, 255, 0.95)) !important;
        }
      }
    `);

    return styles.join('\n');
  }
}

export default Glassmorphism;
