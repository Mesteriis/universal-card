/**
 * Color Schemes - цветовые схемы
 * 
 * Предустановленные цветовые схемы для карточек.
 * 
 * @module themes/ColorSchemes
 */

/**
 * Предустановленные цветовые схемы
 */
export const COLOR_SCHEMES = {
  // =====================
  // Light Themes
  // =====================

  light: {
    name: 'Light',
    type: 'light',
    colors: {
      background: '#ffffff',
      surface: '#f5f5f5',
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },

  paper: {
    name: 'Paper',
    type: 'light',
    colors: {
      background: '#faf8f5',
      surface: '#f5f2ed',
      primary: '#8b7355',
      secondary: '#a67c52',
      accent: '#c49a6c',
      text: '#3d3d3d',
      textSecondary: '#6b6b6b',
      border: '#e0dcd5',
      success: '#5d8a66',
      warning: '#c9a227',
      error: '#b54040',
      info: '#5a7fa6'
    }
  },

  cream: {
    name: 'Cream',
    type: 'light',
    colors: {
      background: '#fffdf7',
      surface: '#fff9e6',
      primary: '#d4a574',
      secondary: '#c49570',
      accent: '#e6c88a',
      text: '#4a4540',
      textSecondary: '#7d7267',
      border: '#ece4d4',
      success: '#7db47d',
      warning: '#e0b050',
      error: '#d47070',
      info: '#70a0c0'
    }
  },

  // =====================
  // Dark Themes
  // =====================

  dark: {
    name: 'Dark',
    type: 'dark',
    colors: {
      background: '#1a1a2e',
      surface: '#16213e',
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },

  midnight: {
    name: 'Midnight',
    type: 'dark',
    colors: {
      background: '#0f0f1a',
      surface: '#1a1a2e',
      primary: '#818cf8',
      secondary: '#a78bfa',
      accent: '#22d3ee',
      text: '#e2e8f0',
      textSecondary: '#94a3b8',
      border: '#2d2d44',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  },

  amoled: {
    name: 'AMOLED',
    type: 'dark',
    colors: {
      background: '#000000',
      surface: '#0a0a0a',
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      text: '#ffffff',
      textSecondary: '#a1a1aa',
      border: '#27272a',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },

  // =====================
  // Colorful Themes
  // =====================

  ocean: {
    name: 'Ocean',
    type: 'dark',
    colors: {
      background: '#0c1929',
      surface: '#132f4c',
      primary: '#00a9ff',
      secondary: '#0091ea',
      accent: '#00e5ff',
      text: '#e3f2fd',
      textSecondary: '#90caf9',
      border: '#1e4976',
      success: '#4caf50',
      warning: '#ffc107',
      error: '#ff5252',
      info: '#29b6f6'
    }
  },

  forest: {
    name: 'Forest',
    type: 'dark',
    colors: {
      background: '#1a2f1a',
      surface: '#2d4a2d',
      primary: '#4caf50',
      secondary: '#66bb6a',
      accent: '#a5d6a7',
      text: '#e8f5e9',
      textSecondary: '#a5d6a7',
      border: '#3d6b3d',
      success: '#81c784',
      warning: '#ffd54f',
      error: '#ef5350',
      info: '#4fc3f7'
    }
  },

  sunset: {
    name: 'Sunset',
    type: 'dark',
    colors: {
      background: '#2d1f2f',
      surface: '#4a2d4a',
      primary: '#ff6b6b',
      secondary: '#feca57',
      accent: '#ff9ff3',
      text: '#fff5f5',
      textSecondary: '#ffb8b8',
      border: '#5c3a5c',
      success: '#7bed9f',
      warning: '#ffeaa7',
      error: '#ff6b6b',
      info: '#74b9ff'
    }
  },

  lavender: {
    name: 'Lavender',
    type: 'light',
    colors: {
      background: '#f5f0ff',
      surface: '#ede4ff',
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#c4b5fd',
      text: '#3b0764',
      textSecondary: '#6b21a8',
      border: '#d8b4fe',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#6366f1'
    }
  },

  rose: {
    name: 'Rose',
    type: 'light',
    colors: {
      background: '#fff5f7',
      surface: '#ffe4e6',
      primary: '#f43f5e',
      secondary: '#fb7185',
      accent: '#fda4af',
      text: '#4c0519',
      textSecondary: '#881337',
      border: '#fecdd3',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#e11d48',
      info: '#3b82f6'
    }
  },

  // =====================
  // Special Themes
  // =====================

  neon: {
    name: 'Neon',
    type: 'dark',
    colors: {
      background: '#0a0a0a',
      surface: '#141414',
      primary: '#00ff88',
      secondary: '#ff00ff',
      accent: '#00ffff',
      text: '#ffffff',
      textSecondary: '#888888',
      border: '#333333',
      success: '#00ff88',
      warning: '#ffff00',
      error: '#ff0055',
      info: '#00ffff'
    }
  },

  cyberpunk: {
    name: 'Cyberpunk',
    type: 'dark',
    colors: {
      background: '#0d0221',
      surface: '#1a0a3e',
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      text: '#ffffff',
      textSecondary: '#b794f6',
      border: '#3d1a78',
      success: '#00ff88',
      warning: '#ffff00',
      error: '#ff0055',
      info: '#00ffff'
    }
  },

  terminal: {
    name: 'Terminal',
    type: 'dark',
    colors: {
      background: '#0c0c0c',
      surface: '#1a1a1a',
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#88ff88',
      text: '#00ff00',
      textSecondary: '#00aa00',
      border: '#004400',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      info: '#00ffff'
    }
  },

  sepia: {
    name: 'Sepia',
    type: 'light',
    colors: {
      background: '#f4ecd8',
      surface: '#e8dcc8',
      primary: '#8b4513',
      secondary: '#a0522d',
      accent: '#cd853f',
      text: '#3e2723',
      textSecondary: '#5d4037',
      border: '#d7cbb9',
      success: '#558b2f',
      warning: '#f9a825',
      error: '#c62828',
      info: '#0277bd'
    }
  }
};

/**
 * Класс для управления цветовыми схемами
 */
export class ColorSchemes {
  /**
   * @param {Object} config - Конфигурация
   */
  constructor(config = {}) {
    this._config = {
      scheme: 'light',
      customColors: {},
      ...config
    };
  }

  /**
   * Устанавливает схему
   * @param {string} schemeName 
   */
  setScheme(schemeName) {
    if (COLOR_SCHEMES[schemeName]) {
      this._config.scheme = schemeName;
    }
  }

  /**
   * Получает текущую схему
   * @returns {Object}
   */
  getScheme() {
    const base = COLOR_SCHEMES[this._config.scheme] || COLOR_SCHEMES.light;
    return {
      ...base,
      colors: { ...base.colors, ...this._config.customColors }
    };
  }

  /**
   * Получает цвет по имени
   * @param {string} colorName 
   * @returns {string}
   */
  getColor(colorName) {
    const scheme = this.getScheme();
    return scheme.colors[colorName] || colorName;
  }

  /**
   * Устанавливает кастомный цвет
   * @param {string} name 
   * @param {string} value 
   */
  setCustomColor(name, value) {
    this._config.customColors[name] = value;
  }

  /**
   * Генерирует CSS переменные
   * @returns {Object}
   */
  generateCSSVariables() {
    const scheme = this.getScheme();
    const variables = {};

    for (const [name, value] of Object.entries(scheme.colors)) {
      variables[`--uc-${this._kebabCase(name)}`] = value;
      
      // Также генерируем RGB версию для opacity
      const rgb = this._hexToRgb(value);
      if (rgb) {
        variables[`--uc-${this._kebabCase(name)}-rgb`] = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
      }
    }

    return variables;
  }

  /**
   * Применяет схему к элементу
   * @param {HTMLElement} element 
   */
  apply(element) {
    const variables = this.generateCSSVariables();
    
    for (const [name, value] of Object.entries(variables)) {
      element.style.setProperty(name, value);
    }

    element.dataset.colorScheme = this._config.scheme;
    element.classList.add('uc-color-scheme');
  }

  /**
   * Удаляет схему с элемента
   * @param {HTMLElement} element 
   */
  remove(element) {
    const scheme = this.getScheme();
    
    for (const name of Object.keys(scheme.colors)) {
      element.style.removeProperty(`--uc-${this._kebabCase(name)}`);
      element.style.removeProperty(`--uc-${this._kebabCase(name)}-rgb`);
    }

    delete element.dataset.colorScheme;
    element.classList.remove('uc-color-scheme');
  }

  /**
   * Конвертирует camelCase в kebab-case
   * @param {string} str 
   * @returns {string}
   */
  _kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Конвертирует hex в RGB
   * @param {string} hex 
   * @returns {Object|null}
   */
  _hexToRgb(hex) {
    if (!hex.startsWith('#')) return null;
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Получает список всех схем
   * @returns {string[]}
   */
  static getSchemeNames() {
    return Object.keys(COLOR_SCHEMES);
  }

  /**
   * Получает схемы по типу (light/dark)
   * @param {string} type 
   * @returns {Object}
   */
  static getSchemesByType(type) {
    const result = {};
    for (const [name, scheme] of Object.entries(COLOR_SCHEMES)) {
      if (scheme.type === type) {
        result[name] = scheme;
      }
    }
    return result;
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    const styles = [];

    // Генерируем CSS классы для каждой схемы
    for (const [name, scheme] of Object.entries(COLOR_SCHEMES)) {
      const variables = Object.entries(scheme.colors)
        .map(([key, value]) => {
          const kebab = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          return `--uc-${kebab}: ${value}`;
        })
        .join(';\n    ');

      styles.push(`
        .uc-scheme-${name},
        [data-color-scheme="${name}"] {
          ${variables};
        }
      `);
    }

    // Утилитарные классы
    styles.push(`
      /* Цвета текста */
      .uc-text-primary { color: var(--uc-text); }
      .uc-text-secondary { color: var(--uc-text-secondary); }
      .uc-text-success { color: var(--uc-success); }
      .uc-text-warning { color: var(--uc-warning); }
      .uc-text-error { color: var(--uc-error); }
      .uc-text-info { color: var(--uc-info); }

      /* Цвета фона */
      .uc-bg-background { background-color: var(--uc-background); }
      .uc-bg-surface { background-color: var(--uc-surface); }
      .uc-bg-primary { background-color: var(--uc-primary); }
      .uc-bg-secondary { background-color: var(--uc-secondary); }
      .uc-bg-accent { background-color: var(--uc-accent); }

      /* Цвета границ */
      .uc-border-default { border-color: var(--uc-border); }
      .uc-border-primary { border-color: var(--uc-primary); }
      .uc-border-secondary { border-color: var(--uc-secondary); }

      /* Адаптивная схема */
      @media (prefers-color-scheme: dark) {
        .uc-scheme-auto {
          ${Object.entries(COLOR_SCHEMES.dark.colors)
            .map(([key, value]) => {
              const kebab = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
              return `--uc-${kebab}: ${value}`;
            })
            .join(';\n    ')};
        }
      }

      @media (prefers-color-scheme: light) {
        .uc-scheme-auto {
          ${Object.entries(COLOR_SCHEMES.light.colors)
            .map(([key, value]) => {
              const kebab = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
              return `--uc-${kebab}: ${value}`;
            })
            .join(';\n    ')};
        }
      }
    `);

    return styles.join('\n');
  }
}

export default ColorSchemes;
