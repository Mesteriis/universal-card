/**
 * Loading Variants - варианты индикаторов загрузки
 * 
 * Различные стили анимации загрузки для карточек.
 * 
 * @module themes/LoadingVariants
 */

/**
 * Типы индикаторов загрузки
 */
export const LOADING_TYPES = {
  SPINNER: 'spinner',       // Спиннер
  DOTS: 'dots',             // Точки
  BARS: 'bars',             // Полосы
  PULSE: 'pulse',           // Пульсация
  SKELETON: 'skeleton',     // Скелетон
  WAVE: 'wave',             // Волна
  RING: 'ring',             // Кольцо
  BOUNCE: 'bounce',         // Прыгающие шары
  PROGRESS: 'progress',     // Прогресс-бар
  SHIMMER: 'shimmer'        // Мерцание
};

/**
 * Размеры индикаторов
 */
export const LOADING_SIZES = {
  XS: 'xs',   // 16px
  SM: 'sm',   // 24px
  MD: 'md',   // 32px
  LG: 'lg',   // 48px
  XL: 'xl'    // 64px
};

/**
 * Конфигурация размеров
 */
const SIZE_CONFIG = {
  [LOADING_SIZES.XS]: { size: 16, stroke: 2, dotSize: 4 },
  [LOADING_SIZES.SM]: { size: 24, stroke: 2.5, dotSize: 6 },
  [LOADING_SIZES.MD]: { size: 32, stroke: 3, dotSize: 8 },
  [LOADING_SIZES.LG]: { size: 48, stroke: 4, dotSize: 10 },
  [LOADING_SIZES.XL]: { size: 64, stroke: 5, dotSize: 12 }
};

/**
 * Класс для создания индикаторов загрузки
 */
export class LoadingVariants {
  /**
   * @param {Object} config - Конфигурация
   */
  constructor(config = {}) {
    this._config = {
      type: LOADING_TYPES.SPINNER,
      size: LOADING_SIZES.MD,
      color: 'var(--primary-color, #6366f1)',
      secondaryColor: 'var(--primary-color-light, rgba(99, 102, 241, 0.2))',
      speed: 1,
      ...config
    };
  }

  /**
   * Устанавливает тип
   * @param {string} type 
   */
  setType(type) {
    if (Object.values(LOADING_TYPES).includes(type)) {
      this._config.type = type;
    }
  }

  /**
   * Устанавливает размер
   * @param {string} size 
   */
  setSize(size) {
    if (Object.values(LOADING_SIZES).includes(size)) {
      this._config.size = size;
    }
  }

  /**
   * Создаёт HTML элемент загрузки
   * @returns {HTMLElement}
   */
  create() {
    const { type } = this._config;
    
    switch (type) {
      case LOADING_TYPES.SPINNER:
        return this._createSpinner();
      case LOADING_TYPES.DOTS:
        return this._createDots();
      case LOADING_TYPES.BARS:
        return this._createBars();
      case LOADING_TYPES.PULSE:
        return this._createPulse();
      case LOADING_TYPES.SKELETON:
        return this._createSkeleton();
      case LOADING_TYPES.WAVE:
        return this._createWave();
      case LOADING_TYPES.RING:
        return this._createRing();
      case LOADING_TYPES.BOUNCE:
        return this._createBounce();
      case LOADING_TYPES.PROGRESS:
        return this._createProgress();
      case LOADING_TYPES.SHIMMER:
        return this._createShimmer();
      default:
        return this._createSpinner();
    }
  }

  /**
   * Создаёт спиннер
   */
  _createSpinner() {
    const sizeConfig = SIZE_CONFIG[this._config.size];
    const { size, stroke } = sizeConfig;
    const { color, secondaryColor, speed } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-spinner';
    container.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle
          cx="${size/2}"
          cy="${size/2}"
          r="${(size - stroke) / 2}"
          stroke="${secondaryColor}"
          stroke-width="${stroke}"
          fill="none"
        />
        <circle
          cx="${size/2}"
          cy="${size/2}"
          r="${(size - stroke) / 2}"
          stroke="${color}"
          stroke-width="${stroke}"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="${Math.PI * (size - stroke) * 0.75}"
          stroke-dashoffset="0"
          style="animation: uc-loading-spin ${1/speed}s linear infinite; transform-origin: center;"
        />
      </svg>
    `;
    
    return container;
  }

  /**
   * Создаёт точки
   */
  _createDots() {
    const sizeConfig = SIZE_CONFIG[this._config.size];
    const { dotSize } = sizeConfig;
    const { color, speed } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-dots';
    container.style.gap = `${dotSize/2}px`;
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.style.cssText = `
        width: ${dotSize}px;
        height: ${dotSize}px;
        background: ${color};
        border-radius: 50%;
        animation: uc-loading-dots-bounce ${0.6/speed}s ease-in-out infinite;
        animation-delay: ${i * 0.1}s;
      `;
      container.appendChild(dot);
    }
    
    return container;
  }

  /**
   * Создаёт полосы
   */
  _createBars() {
    const sizeConfig = SIZE_CONFIG[this._config.size];
    const { size } = sizeConfig;
    const { color, speed } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-bars';
    container.style.height = `${size}px`;
    container.style.gap = '3px';
    
    for (let i = 0; i < 5; i++) {
      const bar = document.createElement('span');
      bar.style.cssText = `
        width: ${size/8}px;
        height: 100%;
        background: ${color};
        border-radius: 2px;
        animation: uc-loading-bars-scale ${1/speed}s ease-in-out infinite;
        animation-delay: ${i * 0.1}s;
      `;
      container.appendChild(bar);
    }
    
    return container;
  }

  /**
   * Создаёт пульсацию
   */
  _createPulse() {
    const sizeConfig = SIZE_CONFIG[this._config.size];
    const { size } = sizeConfig;
    const { color, speed } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-pulse';
    container.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      animation: uc-loading-pulse ${1/speed}s ease-in-out infinite;
    `;
    
    return container;
  }

  /**
   * Создаёт скелетон
   */
  _createSkeleton() {
    const { color, secondaryColor } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-skeleton';
    container.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        ${secondaryColor} 25%,
        ${color}40 50%,
        ${secondaryColor} 75%
      );
      background-size: 200% 100%;
      animation: uc-loading-shimmer 1.5s infinite;
      border-radius: inherit;
    `;
    
    return container;
  }

  /**
   * Создаёт волну
   */
  _createWave() {
    const sizeConfig = SIZE_CONFIG[this._config.size];
    const { size } = sizeConfig;
    const { color, speed } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-wave';
    container.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      height: ${size}px;
    `;
    
    for (let i = 0; i < 5; i++) {
      const bar = document.createElement('span');
      bar.style.cssText = `
        width: 4px;
        height: 40%;
        background: ${color};
        border-radius: 2px;
        animation: uc-loading-wave ${1.2/speed}s ease-in-out infinite;
        animation-delay: ${i * 0.1}s;
      `;
      container.appendChild(bar);
    }
    
    return container;
  }

  /**
   * Создаёт кольцо
   */
  _createRing() {
    const sizeConfig = SIZE_CONFIG[this._config.size];
    const { size, stroke } = sizeConfig;
    const { color, speed } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-ring';
    container.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      border: ${stroke}px solid ${color}30;
      border-top-color: ${color};
      border-radius: 50%;
      animation: uc-loading-spin ${1/speed}s linear infinite;
    `;
    
    return container;
  }

  /**
   * Создаёт прыгающие шары
   */
  _createBounce() {
    const sizeConfig = SIZE_CONFIG[this._config.size];
    const { dotSize } = sizeConfig;
    const { color, speed } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-bounce';
    container.style.cssText = `
      display: flex;
      align-items: flex-end;
      gap: ${dotSize/2}px;
      height: ${dotSize * 2}px;
    `;
    
    for (let i = 0; i < 3; i++) {
      const ball = document.createElement('span');
      ball.style.cssText = `
        width: ${dotSize}px;
        height: ${dotSize}px;
        background: ${color};
        border-radius: 50%;
        animation: uc-loading-bounce ${0.5/speed}s ease-in-out infinite alternate;
        animation-delay: ${i * 0.1}s;
      `;
      container.appendChild(ball);
    }
    
    return container;
  }

  /**
   * Создаёт прогресс-бар
   */
  _createProgress() {
    const { color, secondaryColor, speed } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-progress';
    container.style.cssText = `
      width: 100%;
      height: 4px;
      background: ${secondaryColor};
      border-radius: 2px;
      overflow: hidden;
    `;
    
    const bar = document.createElement('div');
    bar.style.cssText = `
      width: 30%;
      height: 100%;
      background: ${color};
      border-radius: 2px;
      animation: uc-loading-progress ${1.5/speed}s ease-in-out infinite;
    `;
    
    container.appendChild(bar);
    return container;
  }

  /**
   * Создаёт мерцание
   */
  _createShimmer() {
    const { color, secondaryColor } = this._config;
    
    const container = document.createElement('div');
    container.className = 'uc-loading uc-loading-shimmer';
    container.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(
        110deg,
        ${secondaryColor} 8%,
        ${color}20 18%,
        ${secondaryColor} 33%
      );
      background-size: 200% 100%;
      animation: uc-loading-shimmer 1.5s linear infinite;
      border-radius: inherit;
    `;
    
    return container;
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      /* Базовые стили */
      .uc-loading {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .uc-loading-dots,
      .uc-loading-bars,
      .uc-loading-wave,
      .uc-loading-bounce {
        display: inline-flex;
      }

      /* Анимации */
      @keyframes uc-loading-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes uc-loading-dots-bounce {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes uc-loading-bars-scale {
        0%, 40%, 100% {
          transform: scaleY(0.4);
        }
        20% {
          transform: scaleY(1);
        }
      }

      @keyframes uc-loading-pulse {
        0%, 100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        50% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes uc-loading-wave {
        0%, 40%, 100% {
          transform: scaleY(0.4);
        }
        20% {
          transform: scaleY(1);
        }
      }

      @keyframes uc-loading-bounce {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(-100%);
        }
      }

      @keyframes uc-loading-progress {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(400%);
        }
      }

      @keyframes uc-loading-shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      /* Утилитарные классы размеров */
      .uc-loading-xs { transform: scale(0.5); }
      .uc-loading-sm { transform: scale(0.75); }
      .uc-loading-md { transform: scale(1); }
      .uc-loading-lg { transform: scale(1.5); }
      .uc-loading-xl { transform: scale(2); }

      /* Оверлей загрузки */
      .uc-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ha-card-background, rgba(255, 255, 255, 0.8));
        backdrop-filter: blur(4px);
        z-index: 10;
        border-radius: inherit;
      }
    `;
  }
}

export default LoadingVariants;
