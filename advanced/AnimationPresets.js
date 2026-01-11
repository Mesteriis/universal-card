/**
 * Animation Presets - библиотека пресетов анимаций
 * 
 * Предоставляет готовые анимации для различных элементов карточки.
 * Все анимации оптимизированы для GPU-ускорения.
 * 
 * @module advanced/AnimationPresets
 */

/**
 * Категории анимаций
 */
export const ANIMATION_CATEGORIES = {
  ENTRANCE: 'entrance',     // Появление
  EXIT: 'exit',             // Исчезновение
  ATTENTION: 'attention',   // Привлечение внимания
  STATE: 'state',           // Изменение состояния
  LOADING: 'loading',       // Загрузка
  CONTINUOUS: 'continuous'  // Непрерывные
};

/**
 * Пресеты анимаций
 */
export const PRESETS = {
  // =====================
  // ENTRANCE - Появление
  // =====================
  
  fadeIn: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    animation: 'uc-fadeIn 0.3s ease-out forwards',
    description: 'Плавное появление'
  },

  fadeInUp: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    animation: 'uc-fadeInUp 0.4s ease-out forwards',
    description: 'Появление снизу'
  },

  fadeInDown: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    animation: 'uc-fadeInDown 0.4s ease-out forwards',
    description: 'Появление сверху'
  },

  fadeInLeft: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
    animation: 'uc-fadeInLeft 0.4s ease-out forwards',
    description: 'Появление слева'
  },

  fadeInRight: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-fadeInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
    animation: 'uc-fadeInRight 0.4s ease-out forwards',
    description: 'Появление справа'
  },

  scaleIn: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
    animation: 'uc-scaleIn 0.3s ease-out forwards',
    description: 'Масштабирование при появлении'
  },

  slideInUp: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-slideInUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
    `,
    animation: 'uc-slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    description: 'Выезд снизу'
  },

  bounceIn: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-bounceIn {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
    animation: 'uc-bounceIn 0.6s ease-out forwards',
    description: 'Пружинящее появление'
  },

  flipInX: {
    category: ANIMATION_CATEGORIES.ENTRANCE,
    keyframes: `
      @keyframes uc-flipInX {
        from {
          opacity: 0;
          transform: perspective(400px) rotateX(90deg);
        }
        to {
          opacity: 1;
          transform: perspective(400px) rotateX(0);
        }
      }
    `,
    animation: 'uc-flipInX 0.5s ease-out forwards',
    description: '3D переворот по X'
  },

  // =====================
  // EXIT - Исчезновение
  // =====================

  fadeOut: {
    category: ANIMATION_CATEGORIES.EXIT,
    keyframes: `
      @keyframes uc-fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
    animation: 'uc-fadeOut 0.3s ease-out forwards',
    description: 'Плавное исчезновение'
  },

  fadeOutDown: {
    category: ANIMATION_CATEGORIES.EXIT,
    keyframes: `
      @keyframes uc-fadeOutDown {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }
    `,
    animation: 'uc-fadeOutDown 0.3s ease-out forwards',
    description: 'Исчезновение вниз'
  },

  scaleOut: {
    category: ANIMATION_CATEGORIES.EXIT,
    keyframes: `
      @keyframes uc-scaleOut {
        from {
          opacity: 1;
          transform: scale(1);
        }
        to {
          opacity: 0;
          transform: scale(0.8);
        }
      }
    `,
    animation: 'uc-scaleOut 0.3s ease-out forwards',
    description: 'Уменьшение при исчезновении'
  },

  // =====================
  // ATTENTION - Привлечение внимания
  // =====================

  pulse: {
    category: ANIMATION_CATEGORIES.ATTENTION,
    keyframes: `
      @keyframes uc-pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
    `,
    animation: 'uc-pulse 1s ease-in-out infinite',
    description: 'Пульсация'
  },

  shake: {
    category: ANIMATION_CATEGORIES.ATTENTION,
    keyframes: `
      @keyframes uc-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `,
    animation: 'uc-shake 0.5s ease-in-out',
    description: 'Тряска'
  },

  wobble: {
    category: ANIMATION_CATEGORIES.ATTENTION,
    keyframes: `
      @keyframes uc-wobble {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(-5deg); }
        30% { transform: rotate(3deg); }
        45% { transform: rotate(-3deg); }
        60% { transform: rotate(2deg); }
        75% { transform: rotate(-1deg); }
      }
    `,
    animation: 'uc-wobble 0.8s ease-in-out',
    description: 'Покачивание'
  },

  jello: {
    category: ANIMATION_CATEGORIES.ATTENTION,
    keyframes: `
      @keyframes uc-jello {
        0%, 100% { transform: skewX(0deg) skewY(0deg); }
        11.1% { transform: skewX(-6.25deg) skewY(-6.25deg); }
        22.2% { transform: skewX(3.125deg) skewY(3.125deg); }
        33.3% { transform: skewX(-1.5625deg) skewY(-1.5625deg); }
        44.4% { transform: skewX(0.78125deg) skewY(0.78125deg); }
        55.5% { transform: skewX(-0.390625deg) skewY(-0.390625deg); }
      }
    `,
    animation: 'uc-jello 0.9s both',
    description: 'Желе'
  },

  heartbeat: {
    category: ANIMATION_CATEGORIES.ATTENTION,
    keyframes: `
      @keyframes uc-heartbeat {
        0%, 40%, 80%, 100% { transform: scale(1); }
        20%, 60% { transform: scale(1.15); }
      }
    `,
    animation: 'uc-heartbeat 1.3s ease-in-out infinite',
    description: 'Сердцебиение'
  },

  flash: {
    category: ANIMATION_CATEGORIES.ATTENTION,
    keyframes: `
      @keyframes uc-flash {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0; }
      }
    `,
    animation: 'uc-flash 1s ease infinite',
    description: 'Мигание'
  },

  rubberBand: {
    category: ANIMATION_CATEGORIES.ATTENTION,
    keyframes: `
      @keyframes uc-rubberBand {
        0%, 100% { transform: scaleX(1); }
        30% { transform: scaleX(1.25) scaleY(0.75); }
        40% { transform: scaleX(0.75) scaleY(1.25); }
        50% { transform: scaleX(1.15) scaleY(0.85); }
        65% { transform: scaleX(0.95) scaleY(1.05); }
        75% { transform: scaleX(1.05) scaleY(0.95); }
      }
    `,
    animation: 'uc-rubberBand 1s ease',
    description: 'Резинка'
  },

  // =====================
  // STATE - Изменение состояния
  // =====================

  stateChange: {
    category: ANIMATION_CATEGORIES.STATE,
    keyframes: `
      @keyframes uc-stateChange {
        0% { transform: scale(1); }
        30% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `,
    animation: 'uc-stateChange 0.3s ease-out',
    description: 'Изменение состояния'
  },

  colorPulse: {
    category: ANIMATION_CATEGORIES.STATE,
    keyframes: `
      @keyframes uc-colorPulse {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3); }
      }
    `,
    animation: 'uc-colorPulse 0.5s ease',
    description: 'Пульсация цвета'
  },

  ripple: {
    category: ANIMATION_CATEGORIES.STATE,
    keyframes: `
      @keyframes uc-ripple {
        0% {
          transform: scale(0);
          opacity: 0.5;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `,
    animation: 'uc-ripple 0.6s linear',
    description: 'Волна (ripple effect)'
  },

  // =====================
  // LOADING - Загрузка
  // =====================

  spin: {
    category: ANIMATION_CATEGORIES.LOADING,
    keyframes: `
      @keyframes uc-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
    animation: 'uc-spin 1s linear infinite',
    description: 'Вращение'
  },

  bounce: {
    category: ANIMATION_CATEGORIES.LOADING,
    keyframes: `
      @keyframes uc-bounce {
        0%, 100% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
    `,
    animation: 'uc-bounce 1s infinite',
    description: 'Прыжки'
  },

  shimmer: {
    category: ANIMATION_CATEGORIES.LOADING,
    keyframes: `
      @keyframes uc-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `,
    animation: 'uc-shimmer 1.5s ease-in-out infinite',
    description: 'Мерцание (для skeleton)'
  },

  dots: {
    category: ANIMATION_CATEGORIES.LOADING,
    keyframes: `
      @keyframes uc-dots {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `,
    animation: 'uc-dots 1.4s ease-in-out infinite both',
    description: 'Точки загрузки'
  },

  // =====================
  // CONTINUOUS - Непрерывные
  // =====================

  float: {
    category: ANIMATION_CATEGORIES.CONTINUOUS,
    keyframes: `
      @keyframes uc-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `,
    animation: 'uc-float 3s ease-in-out infinite',
    description: 'Плавание'
  },

  glow: {
    category: ANIMATION_CATEGORIES.CONTINUOUS,
    keyframes: `
      @keyframes uc-glow {
        0%, 100% { box-shadow: 0 0 5px currentColor; }
        50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
      }
    `,
    animation: 'uc-glow 2s ease-in-out infinite',
    description: 'Свечение'
  },

  wave: {
    category: ANIMATION_CATEGORIES.CONTINUOUS,
    keyframes: `
      @keyframes uc-wave {
        0%, 100% { transform: rotate(0deg); }
        20%, 60% { transform: rotate(-25deg); }
        40%, 80% { transform: rotate(10deg); }
      }
    `,
    animation: 'uc-wave 2.5s infinite',
    description: 'Машущая рука'
  }
};

/**
 * Класс для управления анимациями
 */
export class AnimationPresets {
  constructor() {
    this._injectedStyles = new Set();
  }

  /**
   * Получает пресет по имени
   * @param {string} name 
   * @returns {Object|null}
   */
  getPreset(name) {
    return PRESETS[name] || null;
  }

  /**
   * Получает все пресеты категории
   * @param {string} category 
   * @returns {Object}
   */
  getByCategory(category) {
    const result = {};
    for (const [name, preset] of Object.entries(PRESETS)) {
      if (preset.category === category) {
        result[name] = preset;
      }
    }
    return result;
  }

  /**
   * Применяет анимацию к элементу
   * @param {HTMLElement} element 
   * @param {string} presetName 
   * @param {Object} options 
   */
  apply(element, presetName, options = {}) {
    const preset = PRESETS[presetName];
    if (!preset) {
      console.warn(`[AnimationPresets] Unknown preset: ${presetName}`);
      return;
    }

    // Инжектим keyframes если ещё не добавлены
    this._injectKeyframes(presetName, preset.keyframes);

    // Модифицируем анимацию опциями
    let animation = preset.animation;
    
    if (options.duration) {
      animation = animation.replace(/\d+\.?\d*s/, `${options.duration}s`);
    }
    
    if (options.delay) {
      animation += ` ${options.delay}s`;
    }
    
    if (options.iterations) {
      animation = animation.replace(/infinite|1/, String(options.iterations));
    }

    // Применяем
    element.style.animation = animation;

    // Обработка завершения
    if (options.onComplete) {
      element.addEventListener('animationend', options.onComplete, { once: true });
    }

    // Автоудаление анимации после завершения
    if (options.removeOnComplete !== false) {
      element.addEventListener('animationend', () => {
        element.style.animation = '';
      }, { once: true });
    }
  }

  /**
   * Создаёт staggered анимацию для списка элементов
   * @param {NodeList|Array} elements 
   * @param {string} presetName 
   * @param {Object} options 
   */
  stagger(elements, presetName, options = {}) {
    const delay = options.staggerDelay || 0.05;
    const startDelay = options.startDelay || 0;

    Array.from(elements).forEach((element, index) => {
      this.apply(element, presetName, {
        ...options,
        delay: startDelay + (index * delay)
      });
    });
  }

  /**
   * Инжектит keyframes в документ
   * @param {string} name 
   * @param {string} keyframes 
   */
  _injectKeyframes(name, keyframes) {
    if (this._injectedStyles.has(name)) return;

    const style = document.createElement('style');
    style.textContent = keyframes;
    style.setAttribute('data-uc-animation', name);
    document.head.appendChild(style);
    
    this._injectedStyles.add(name);
  }

  /**
   * Возвращает CSS со всеми анимациями
   * @returns {string}
   */
  static getAllStyles() {
    const styles = [];
    
    for (const [name, preset] of Object.entries(PRESETS)) {
      styles.push(preset.keyframes);
      styles.push(`
        .uc-animate-${name} {
          animation: ${preset.animation};
        }
      `);
    }

    // Утилитарные классы
    styles.push(`
      /* Утилитарные классы для анимаций */
      .uc-animate-delay-100 { animation-delay: 0.1s; }
      .uc-animate-delay-200 { animation-delay: 0.2s; }
      .uc-animate-delay-300 { animation-delay: 0.3s; }
      .uc-animate-delay-400 { animation-delay: 0.4s; }
      .uc-animate-delay-500 { animation-delay: 0.5s; }

      .uc-animate-duration-fast { animation-duration: 0.2s; }
      .uc-animate-duration-normal { animation-duration: 0.4s; }
      .uc-animate-duration-slow { animation-duration: 0.8s; }

      .uc-animate-ease-linear { animation-timing-function: linear; }
      .uc-animate-ease-in { animation-timing-function: ease-in; }
      .uc-animate-ease-out { animation-timing-function: ease-out; }
      .uc-animate-ease-in-out { animation-timing-function: ease-in-out; }
      .uc-animate-ease-spring { animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }

      .uc-animate-infinite { animation-iteration-count: infinite; }
      .uc-animate-once { animation-iteration-count: 1; }
      .uc-animate-twice { animation-iteration-count: 2; }

      .uc-animate-paused { animation-play-state: paused; }
      .uc-animate-running { animation-play-state: running; }

      /* Респект prefers-reduced-motion */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `);

    return styles.join('\n');
  }

  /**
   * Получает список всех пресетов
   * @returns {string[]}
   */
  static getPresetNames() {
    return Object.keys(PRESETS);
  }

  /**
   * Получает описание пресета
   * @param {string} name 
   * @returns {string}
   */
  static getDescription(name) {
    return PRESETS[name]?.description || '';
  }
}

export default AnimationPresets;
