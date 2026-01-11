/**
 * Border Animations - анимации границ
 * 
 * Создаёт анимированные границы для карточек:
 * градиентные, пульсирующие, светящиеся.
 * 
 * @module themes/BorderAnimations
 */

/**
 * Типы анимаций границ
 */
export const BORDER_TYPES = {
  GRADIENT: 'gradient',       // Градиентная граница
  GLOW: 'glow',               // Светящаяся граница
  PULSE: 'pulse',             // Пульсирующая граница
  RAINBOW: 'rainbow',         // Радужная граница
  DASH: 'dash',               // Бегущие штрихи
  WAVE: 'wave',               // Волновая граница
  NEON: 'neon',               // Неоновое свечение
  SHIMMER: 'shimmer'          // Мерцающая граница
};

/**
 * Пресеты градиентов
 */
export const GRADIENT_PRESETS = {
  PRIMARY: ['var(--primary-color)', 'var(--accent-color, #6366f1)'],
  RAINBOW: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff', '#ff0000'],
  SUNSET: ['#ff6b6b', '#feca57', '#ff9ff3'],
  OCEAN: ['#0077be', '#00a5cf', '#00d4aa'],
  FIRE: ['#ff4500', '#ff6b00', '#ffd700'],
  PURPLE: ['#667eea', '#764ba2'],
  CYAN: ['#00d2ff', '#3a7bd5'],
  EMERALD: ['#11998e', '#38ef7d']
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  type: BORDER_TYPES.GRADIENT,
  width: 2,
  radius: 12,
  duration: 3,
  colors: GRADIENT_PRESETS.PRIMARY,
  glowSize: 10,
  glowOpacity: 0.5
};

/**
 * Класс для создания анимированных границ
 */
export class BorderAnimations {
  /**
   * @param {Object} config - Конфигурация
   */
  constructor(config = {}) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._styleElement = null;
    this._animationId = `uc-border-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Устанавливает тип анимации
   * @param {string} type 
   */
  setType(type) {
    if (Object.values(BORDER_TYPES).includes(type)) {
      this._config.type = type;
    }
  }

  /**
   * Устанавливает цвета
   * @param {string[]} colors 
   */
  setColors(colors) {
    this._config.colors = colors;
  }

  /**
   * Устанавливает пресет градиента
   * @param {string} presetName 
   */
  setGradientPreset(presetName) {
    if (GRADIENT_PRESETS[presetName]) {
      this._config.colors = GRADIENT_PRESETS[presetName];
    }
  }

  /**
   * Генерирует стили для анимации
   * @returns {Object}
   */
  generateStyles() {
    const { type, width, radius, colors, glowSize, glowOpacity } = this._config;

    switch (type) {
      case BORDER_TYPES.GRADIENT:
        return this._generateGradientStyles();
      case BORDER_TYPES.GLOW:
        return this._generateGlowStyles();
      case BORDER_TYPES.PULSE:
        return this._generatePulseStyles();
      case BORDER_TYPES.RAINBOW:
        return this._generateRainbowStyles();
      case BORDER_TYPES.DASH:
        return this._generateDashStyles();
      case BORDER_TYPES.WAVE:
        return this._generateWaveStyles();
      case BORDER_TYPES.NEON:
        return this._generateNeonStyles();
      case BORDER_TYPES.SHIMMER:
        return this._generateShimmerStyles();
      default:
        return {};
    }
  }

  /**
   * Генерирует стили градиентной границы
   */
  _generateGradientStyles() {
    const { width, radius, colors, duration } = this._config;
    const gradient = `linear-gradient(90deg, ${colors.join(', ')})`;

    return {
      position: 'relative',
      borderRadius: `${radius}px`,
      padding: `${width}px`,
      background: gradient,
      backgroundSize: '200% 200%',
      animation: `${this._animationId}-gradient ${duration}s ease infinite`,
      keyframes: `
        @keyframes ${this._animationId}-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `
    };
  }

  /**
   * Генерирует стили светящейся границы
   */
  _generateGlowStyles() {
    const { width, radius, colors, glowSize, glowOpacity, duration } = this._config;
    const color = colors[0];

    return {
      position: 'relative',
      borderRadius: `${radius}px`,
      border: `${width}px solid ${color}`,
      boxShadow: `0 0 ${glowSize}px ${color}`,
      animation: `${this._animationId}-glow ${duration}s ease-in-out infinite`,
      keyframes: `
        @keyframes ${this._animationId}-glow {
          0%, 100% {
            box-shadow: 0 0 ${glowSize}px ${color}${Math.round(glowOpacity * 255).toString(16)};
          }
          50% {
            box-shadow: 0 0 ${glowSize * 2}px ${color}, 0 0 ${glowSize * 3}px ${color}${Math.round(glowOpacity * 0.5 * 255).toString(16)};
          }
        }
      `
    };
  }

  /**
   * Генерирует стили пульсирующей границы
   */
  _generatePulseStyles() {
    const { width, radius, colors, duration } = this._config;

    return {
      position: 'relative',
      borderRadius: `${radius}px`,
      border: `${width}px solid ${colors[0]}`,
      animation: `${this._animationId}-pulse ${duration}s ease-in-out infinite`,
      keyframes: `
        @keyframes ${this._animationId}-pulse {
          0%, 100% {
            border-color: ${colors[0]};
            border-width: ${width}px;
          }
          50% {
            border-color: ${colors[1] || colors[0]};
            border-width: ${width + 1}px;
          }
        }
      `
    };
  }

  /**
   * Генерирует стили радужной границы
   */
  _generateRainbowStyles() {
    const { width, radius, duration } = this._config;
    const colors = GRADIENT_PRESETS.RAINBOW;

    return {
      position: 'relative',
      borderRadius: `${radius}px`,
      padding: `${width}px`,
      background: `linear-gradient(90deg, ${colors.join(', ')})`,
      backgroundSize: '400% 400%',
      animation: `${this._animationId}-rainbow ${duration}s linear infinite`,
      keyframes: `
        @keyframes ${this._animationId}-rainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 400% 50%; }
        }
      `
    };
  }

  /**
   * Генерирует стили бегущих штрихов
   */
  _generateDashStyles() {
    const { width, radius, colors, duration } = this._config;

    return {
      position: 'relative',
      borderRadius: `${radius}px`,
      border: `${width}px dashed ${colors[0]}`,
      animation: `${this._animationId}-dash ${duration}s linear infinite`,
      keyframes: `
        @keyframes ${this._animationId}-dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `,
      // Для SVG границы
      svgAnimation: true
    };
  }

  /**
   * Генерирует стили волновой границы
   */
  _generateWaveStyles() {
    const { width, radius, colors, duration } = this._config;

    return {
      position: 'relative',
      borderRadius: `${radius}px`,
      border: `${width}px solid transparent`,
      backgroundImage: `linear-gradient(var(--ha-card-background), var(--ha-card-background)), linear-gradient(90deg, ${colors.join(', ')})`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      animation: `${this._animationId}-wave ${duration}s ease-in-out infinite`,
      keyframes: `
        @keyframes ${this._animationId}-wave {
          0%, 100% { border-width: ${width}px; }
          50% { border-width: ${width + 2}px; }
        }
      `
    };
  }

  /**
   * Генерирует стили неонового свечения
   */
  _generateNeonStyles() {
    const { width, radius, colors, glowSize, duration } = this._config;
    const color = colors[0];

    return {
      position: 'relative',
      borderRadius: `${radius}px`,
      border: `${width}px solid ${color}`,
      boxShadow: `
        0 0 ${glowSize/2}px ${color},
        0 0 ${glowSize}px ${color},
        0 0 ${glowSize*2}px ${color},
        inset 0 0 ${glowSize/2}px ${color}
      `,
      animation: `${this._animationId}-neon ${duration}s ease-in-out infinite alternate`,
      keyframes: `
        @keyframes ${this._animationId}-neon {
          from {
            box-shadow:
              0 0 ${glowSize/2}px ${color},
              0 0 ${glowSize}px ${color},
              0 0 ${glowSize*2}px ${color},
              inset 0 0 ${glowSize/2}px ${color};
          }
          to {
            box-shadow:
              0 0 ${glowSize}px ${color},
              0 0 ${glowSize*2}px ${color},
              0 0 ${glowSize*3}px ${color},
              0 0 ${glowSize*4}px ${color},
              inset 0 0 ${glowSize}px ${color};
          }
        }
      `
    };
  }

  /**
   * Генерирует стили мерцающей границы
   */
  _generateShimmerStyles() {
    const { width, radius, colors, duration } = this._config;

    return {
      position: 'relative',
      borderRadius: `${radius}px`,
      padding: `${width}px`,
      background: `linear-gradient(90deg, transparent 0%, ${colors[0]}40 50%, transparent 100%), ${colors[0]}`,
      backgroundSize: '200% 100%, 100% 100%',
      animation: `${this._animationId}-shimmer ${duration}s linear infinite`,
      keyframes: `
        @keyframes ${this._animationId}-shimmer {
          from { background-position: -200% 0, 0 0; }
          to { background-position: 200% 0, 0 0; }
        }
      `
    };
  }

  /**
   * Применяет анимацию к элементу
   * @param {HTMLElement} element 
   */
  apply(element) {
    const styles = this.generateStyles();

    // Добавляем keyframes
    if (styles.keyframes) {
      this._injectKeyframes(styles.keyframes);
    }

    // Применяем стили
    for (const [property, value] of Object.entries(styles)) {
      if (property !== 'keyframes' && property !== 'svgAnimation') {
        element.style[property] = value;
      }
    }

    // Для SVG границы (dash)
    if (styles.svgAnimation) {
      this._applySvgBorder(element);
    }

    element.classList.add('uc-border-animated');
    element.dataset.borderAnimation = this._config.type;
  }

  /**
   * Инжектит keyframes в документ
   * @param {string} keyframes 
   */
  _injectKeyframes(keyframes) {
    if (this._styleElement) {
      this._styleElement.textContent = keyframes;
      return;
    }

    this._styleElement = document.createElement('style');
    this._styleElement.textContent = keyframes;
    this._styleElement.setAttribute('data-uc-border', this._animationId);
    document.head.appendChild(this._styleElement);
  }

  /**
   * Применяет SVG границу
   * @param {HTMLElement} element 
   */
  _applySvgBorder(element) {
    const rect = element.getBoundingClientRect();
    const { width, radius, colors, duration } = this._config;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: visible;
    `;

    svg.innerHTML = `
      <rect 
        x="${width/2}" 
        y="${width/2}" 
        width="calc(100% - ${width}px)" 
        height="calc(100% - ${width}px)"
        rx="${radius}"
        fill="none"
        stroke="${colors[0]}"
        stroke-width="${width}"
        stroke-dasharray="10 5"
        stroke-linecap="round"
      >
        <animate 
          attributeName="stroke-dashoffset"
          from="0"
          to="-30"
          dur="${duration}s"
          repeatCount="indefinite"
        />
      </rect>
    `;

    element.style.position = 'relative';
    element.appendChild(svg);
  }

  /**
   * Удаляет анимацию с элемента
   * @param {HTMLElement} element 
   */
  remove(element) {
    const properties = [
      'position', 'borderRadius', 'padding', 'background',
      'backgroundSize', 'backgroundImage', 'backgroundOrigin',
      'backgroundClip', 'border', 'boxShadow', 'animation'
    ];

    for (const property of properties) {
      element.style[property] = '';
    }

    // Удаляем SVG если есть
    const svg = element.querySelector('svg');
    if (svg) svg.remove();

    // Удаляем style элемент
    if (this._styleElement) {
      this._styleElement.remove();
      this._styleElement = null;
    }

    element.classList.remove('uc-border-animated');
    delete element.dataset.borderAnimation;
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-border-animated {
        isolation: isolate;
      }

      .uc-border-animated::before {
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

      /* Утилитарные классы */
      .uc-border-gradient {
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color, #6366f1));
        background-size: 200% 200%;
        animation: uc-border-gradient-anim 3s ease infinite;
      }

      @keyframes uc-border-gradient-anim {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .uc-border-glow {
        box-shadow: 0 0 10px var(--primary-color);
        animation: uc-border-glow-anim 2s ease-in-out infinite;
      }

      @keyframes uc-border-glow-anim {
        0%, 100% { box-shadow: 0 0 10px var(--primary-color); }
        50% { box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-color); }
      }

      .uc-border-rainbow {
        background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000);
        background-size: 400% 400%;
        animation: uc-border-rainbow-anim 3s linear infinite;
      }

      @keyframes uc-border-rainbow-anim {
        0% { background-position: 0% 50%; }
        100% { background-position: 400% 50%; }
      }
    `;
  }
}

export default BorderAnimations;
