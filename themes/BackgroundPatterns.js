/**
 * Background Patterns - фоновые паттерны
 * 
 * Создаёт различные фоновые паттерны для карточек
 * с использованием CSS градиентов и SVG.
 * 
 * @module themes/BackgroundPatterns
 */

/**
 * Категории паттернов
 */
export const PATTERN_CATEGORIES = {
  GEOMETRIC: 'geometric',   // Геометрические
  DOTS: 'dots',             // Точки
  LINES: 'lines',           // Линии
  WAVES: 'waves',           // Волны
  NOISE: 'noise',           // Шум
  ORGANIC: 'organic'        // Органические
};

/**
 * Библиотека паттернов
 */
export const PATTERNS = {
  // =====================
  // GEOMETRIC - Геометрические
  // =====================

  grid: {
    category: PATTERN_CATEGORIES.GEOMETRIC,
    name: 'Grid',
    css: (color = 'rgba(0,0,0,0.05)', size = 20) => `
      linear-gradient(${color} 1px, transparent 1px),
      linear-gradient(90deg, ${color} 1px, transparent 1px)
    `,
    size: (size = 20) => `${size}px ${size}px`,
    description: 'Сетка'
  },

  checkerboard: {
    category: PATTERN_CATEGORIES.GEOMETRIC,
    name: 'Checkerboard',
    css: (color = 'rgba(0,0,0,0.05)', size = 20) => `
      linear-gradient(45deg, ${color} 25%, transparent 25%),
      linear-gradient(-45deg, ${color} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${color} 75%),
      linear-gradient(-45deg, transparent 75%, ${color} 75%)
    `,
    size: (size = 20) => `${size}px ${size}px`,
    position: (size = 20) => `0 0, 0 ${size/2}px, ${size/2}px -${size/2}px, -${size/2}px 0px`,
    description: 'Шахматная доска'
  },

  triangles: {
    category: PATTERN_CATEGORIES.GEOMETRIC,
    name: 'Triangles',
    css: (color = 'rgba(0,0,0,0.05)', size = 40) => `
      linear-gradient(135deg, ${color} 25%, transparent 25%) -${size/2}px 0,
      linear-gradient(225deg, ${color} 25%, transparent 25%) -${size/2}px 0,
      linear-gradient(315deg, ${color} 25%, transparent 25%),
      linear-gradient(45deg, ${color} 25%, transparent 25%)
    `,
    size: (size = 40) => `${size}px ${size}px`,
    description: 'Треугольники'
  },

  hexagons: {
    category: PATTERN_CATEGORIES.GEOMETRIC,
    name: 'Hexagons',
    svg: (color = '#00000010', size = 30) => `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size * 2}" height="${size * 1.73}">
        <polygon points="${size},0 ${size * 2},${size * 0.5} ${size * 2},${size * 1.23} ${size},${size * 1.73} 0,${size * 1.23} 0,${size * 0.5}"
                 fill="none" stroke="${color}" stroke-width="1"/>
      </svg>
    `,
    description: 'Шестиугольники'
  },

  diamonds: {
    category: PATTERN_CATEGORIES.GEOMETRIC,
    name: 'Diamonds',
    css: (color = 'rgba(0,0,0,0.05)', size = 20) => `
      linear-gradient(135deg, ${color} 25%, transparent 25%),
      linear-gradient(225deg, ${color} 25%, transparent 25%),
      linear-gradient(45deg, ${color} 25%, transparent 25%),
      linear-gradient(315deg, ${color} 25%, transparent 25%)
    `,
    size: (size = 20) => `${size}px ${size}px`,
    position: (size = 20) => `${size/2}px 0, ${size/2}px 0, 0 0, 0 0`,
    description: 'Ромбы'
  },

  // =====================
  // DOTS - Точки
  // =====================

  dots: {
    category: PATTERN_CATEGORIES.DOTS,
    name: 'Dots',
    css: (color = 'rgba(0,0,0,0.1)', size = 20) => `
      radial-gradient(${color} 2px, transparent 2px)
    `,
    size: (size = 20) => `${size}px ${size}px`,
    description: 'Точки'
  },

  dotsLarge: {
    category: PATTERN_CATEGORIES.DOTS,
    name: 'Dots Large',
    css: (color = 'rgba(0,0,0,0.08)', size = 30) => `
      radial-gradient(${color} 4px, transparent 4px)
    `,
    size: (size = 30) => `${size}px ${size}px`,
    description: 'Крупные точки'
  },

  dotsGradient: {
    category: PATTERN_CATEGORIES.DOTS,
    name: 'Dots Gradient',
    css: (color = 'rgba(0,0,0,0.1)', size = 20) => `
      radial-gradient(circle at center, ${color}, transparent 50%)
    `,
    size: (size = 20) => `${size}px ${size}px`,
    description: 'Точки с градиентом'
  },

  // =====================
  // LINES - Линии
  // =====================

  horizontalLines: {
    category: PATTERN_CATEGORIES.LINES,
    name: 'Horizontal Lines',
    css: (color = 'rgba(0,0,0,0.05)', size = 10) => `
      linear-gradient(${color} 1px, transparent 1px)
    `,
    size: (size = 10) => `100% ${size}px`,
    description: 'Горизонтальные линии'
  },

  verticalLines: {
    category: PATTERN_CATEGORIES.LINES,
    name: 'Vertical Lines',
    css: (color = 'rgba(0,0,0,0.05)', size = 10) => `
      linear-gradient(90deg, ${color} 1px, transparent 1px)
    `,
    size: (size = 10) => `${size}px 100%`,
    description: 'Вертикальные линии'
  },

  diagonalLines: {
    category: PATTERN_CATEGORIES.LINES,
    name: 'Diagonal Lines',
    css: (color = 'rgba(0,0,0,0.05)', size = 10) => `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent ${size}px,
        ${color} ${size}px,
        ${color} ${size + 1}px
      )
    `,
    size: () => 'auto',
    description: 'Диагональные линии'
  },

  crosshatch: {
    category: PATTERN_CATEGORIES.LINES,
    name: 'Crosshatch',
    css: (color = 'rgba(0,0,0,0.05)', size = 10) => `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent ${size}px,
        ${color} ${size}px,
        ${color} ${size + 1}px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent ${size}px,
        ${color} ${size}px,
        ${color} ${size + 1}px
      )
    `,
    size: () => 'auto',
    description: 'Перекрёстная штриховка'
  },

  // =====================
  // WAVES - Волны
  // =====================

  waves: {
    category: PATTERN_CATEGORIES.WAVES,
    name: 'Waves',
    svg: (color = '#00000010', size = 40) => `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size/2}">
        <path d="M0 ${size/4} Q ${size/4} 0 ${size/2} ${size/4} T ${size} ${size/4}" 
              fill="none" stroke="${color}" stroke-width="1"/>
      </svg>
    `,
    description: 'Волны'
  },

  zigzag: {
    category: PATTERN_CATEGORIES.WAVES,
    name: 'Zigzag',
    css: (color = 'rgba(0,0,0,0.05)', size = 20) => `
      linear-gradient(135deg, ${color} 25%, transparent 25%),
      linear-gradient(225deg, ${color} 25%, transparent 25%)
    `,
    size: (size = 20) => `${size}px ${size}px`,
    position: () => '0 0, 10px 0',
    description: 'Зигзаг'
  },

  // =====================
  // NOISE - Шум
  // =====================

  noise: {
    category: PATTERN_CATEGORIES.NOISE,
    name: 'Noise',
    svg: () => `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.05"/>
      </svg>
    `,
    description: 'Шум'
  },

  grain: {
    category: PATTERN_CATEGORIES.NOISE,
    name: 'Grain',
    svg: () => `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
        <filter id="grain">
          <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" result="noise"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.03"/>
      </svg>
    `,
    description: 'Зернистость'
  },

  // =====================
  // ORGANIC - Органические
  // =====================

  topography: {
    category: PATTERN_CATEGORIES.ORGANIC,
    name: 'Topography',
    svg: (color = '#00000008') => `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <circle cx="20" cy="20" r="15" fill="none" stroke="${color}" stroke-width="1"/>
        <circle cx="20" cy="20" r="25" fill="none" stroke="${color}" stroke-width="1"/>
        <circle cx="20" cy="20" r="35" fill="none" stroke="${color}" stroke-width="1"/>
        <circle cx="80" cy="80" r="10" fill="none" stroke="${color}" stroke-width="1"/>
        <circle cx="80" cy="80" r="20" fill="none" stroke="${color}" stroke-width="1"/>
        <circle cx="80" cy="80" r="30" fill="none" stroke="${color}" stroke-width="1"/>
      </svg>
    `,
    description: 'Топография'
  },

  circuit: {
    category: PATTERN_CATEGORIES.ORGANIC,
    name: 'Circuit',
    svg: (color = '#00000010') => `
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
        <path d="M0 25 H20 V10 H30 V25 H50 M25 0 V10 M25 50 V40" 
              fill="none" stroke="${color}" stroke-width="1"/>
        <circle cx="25" cy="10" r="2" fill="${color}"/>
        <circle cx="25" cy="40" r="2" fill="${color}"/>
      </svg>
    `,
    description: 'Схема'
  }
};

/**
 * Класс для управления фоновыми паттернами
 */
export class BackgroundPatterns {
  /**
   * @param {Object} config - Конфигурация
   */
  constructor(config = {}) {
    this._config = {
      pattern: 'grid',
      color: 'rgba(0, 0, 0, 0.05)',
      size: 20,
      opacity: 1,
      blend: 'normal',
      ...config
    };
  }

  /**
   * Устанавливает паттерн
   * @param {string} patternName 
   */
  setPattern(patternName) {
    if (PATTERNS[patternName]) {
      this._config.pattern = patternName;
    }
  }

  /**
   * Устанавливает цвет
   * @param {string} color 
   */
  setColor(color) {
    this._config.color = color;
  }

  /**
   * Устанавливает размер
   * @param {number} size 
   */
  setSize(size) {
    this._config.size = size;
  }

  /**
   * Получает паттерн
   * @returns {Object}
   */
  getPattern() {
    return PATTERNS[this._config.pattern] || PATTERNS.grid;
  }

  /**
   * Генерирует CSS для фона
   * @param {Object} overrides 
   * @returns {Object}
   */
  generateStyles(overrides = {}) {
    const config = { ...this._config, ...overrides };
    const pattern = PATTERNS[config.pattern];
    
    if (!pattern) {
      return {};
    }

    const styles = {
      backgroundBlendMode: config.blend
    };

    // CSS паттерн
    if (pattern.css) {
      styles.backgroundImage = pattern.css(config.color, config.size);
      
      if (pattern.size) {
        styles.backgroundSize = pattern.size(config.size);
      }
      
      if (pattern.position) {
        styles.backgroundPosition = pattern.position(config.size);
      }
    }

    // SVG паттерн
    if (pattern.svg) {
      const svg = pattern.svg(config.color, config.size);
      const encoded = encodeURIComponent(svg);
      styles.backgroundImage = `url("data:image/svg+xml,${encoded}")`;
    }

    if (config.opacity < 1) {
      styles.opacity = config.opacity;
    }

    return styles;
  }

  /**
   * Применяет паттерн к элементу
   * @param {HTMLElement} element 
   * @param {Object} overrides 
   */
  apply(element, overrides = {}) {
    const styles = this.generateStyles(overrides);
    
    for (const [property, value] of Object.entries(styles)) {
      element.style[property] = value;
    }

    element.classList.add('uc-pattern');
    element.dataset.pattern = this._config.pattern;
  }

  /**
   * Удаляет паттерн с элемента
   * @param {HTMLElement} element 
   */
  remove(element) {
    element.style.backgroundImage = '';
    element.style.backgroundSize = '';
    element.style.backgroundPosition = '';
    element.style.backgroundBlendMode = '';
    element.classList.remove('uc-pattern');
    delete element.dataset.pattern;
  }

  /**
   * Получает все паттерны категории
   * @param {string} category 
   * @returns {Object}
   */
  static getByCategory(category) {
    const result = {};
    for (const [name, pattern] of Object.entries(PATTERNS)) {
      if (pattern.category === category) {
        result[name] = pattern;
      }
    }
    return result;
  }

  /**
   * Получает список всех паттернов
   * @returns {string[]}
   */
  static getPatternNames() {
    return Object.keys(PATTERNS);
  }

  /**
   * Возвращает CSS стили для паттернов
   * @returns {string}
   */
  static getStyles() {
    const styles = [];

    // Генерируем CSS классы для каждого паттерна
    for (const [name, pattern] of Object.entries(PATTERNS)) {
      if (pattern.css) {
        const css = pattern.css('rgba(0,0,0,0.05)', 20);
        const size = pattern.size ? pattern.size(20) : 'auto';
        const position = pattern.position ? pattern.position(20) : '0 0';

        styles.push(`
          .uc-pattern-${name} {
            background-image: ${css};
            background-size: ${size};
            background-position: ${position};
          }
        `);
      } else if (pattern.svg) {
        const svg = pattern.svg('rgba(0,0,0,0.05)', 20);
        const encoded = encodeURIComponent(svg);
        
        styles.push(`
          .uc-pattern-${name} {
            background-image: url("data:image/svg+xml,${encoded}");
          }
        `);
      }
    }

    // Утилитарные классы
    styles.push(`
      /* Размеры паттернов */
      .uc-pattern-sm { background-size: 10px 10px; }
      .uc-pattern-md { background-size: 20px 20px; }
      .uc-pattern-lg { background-size: 40px 40px; }
      .uc-pattern-xl { background-size: 60px 60px; }

      /* Прозрачность */
      .uc-pattern-opacity-10 { opacity: 0.1; }
      .uc-pattern-opacity-25 { opacity: 0.25; }
      .uc-pattern-opacity-50 { opacity: 0.5; }
      .uc-pattern-opacity-75 { opacity: 0.75; }

      /* Режимы наложения */
      .uc-pattern-blend-multiply { background-blend-mode: multiply; }
      .uc-pattern-blend-screen { background-blend-mode: screen; }
      .uc-pattern-blend-overlay { background-blend-mode: overlay; }
      .uc-pattern-blend-darken { background-blend-mode: darken; }
      .uc-pattern-blend-lighten { background-blend-mode: lighten; }

      /* Анимированные паттерны */
      .uc-pattern-animated {
        animation: uc-pattern-move 20s linear infinite;
      }

      @keyframes uc-pattern-move {
        from { background-position: 0 0; }
        to { background-position: 100px 100px; }
      }
    `);

    return styles.join('\n');
  }
}

export default BackgroundPatterns;
