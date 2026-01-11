/**
 * Micro Interactions - микро-взаимодействия
 * 
 * Небольшие анимации для отклика на действия пользователя.
 * 
 * @module themes/MicroInteractions
 */

/**
 * Категории микро-взаимодействий
 */
export const INTERACTION_CATEGORIES = {
  CLICK: 'click',           // Клик
  TOGGLE: 'toggle',         // Переключение
  SUCCESS: 'success',       // Успех
  ERROR: 'error',           // Ошибка
  NOTIFICATION: 'notification', // Уведомление
  PROGRESS: 'progress',     // Прогресс
  FEEDBACK: 'feedback'      // Обратная связь
};

/**
 * Библиотека микро-взаимодействий
 */
export const MICRO_INTERACTIONS = {
  // =====================
  // CLICK - Клик
  // =====================

  ripple: {
    category: INTERACTION_CATEGORIES.CLICK,
    name: 'Ripple',
    description: 'Material Design волна',
    trigger: 'click'
  },

  pop: {
    category: INTERACTION_CATEGORIES.CLICK,
    name: 'Pop',
    description: 'Быстрое увеличение',
    trigger: 'click',
    keyframes: `
      @keyframes uc-micro-pop {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
    `,
    duration: 200
  },

  press: {
    category: INTERACTION_CATEGORIES.CLICK,
    name: 'Press',
    description: 'Нажатие',
    trigger: 'click',
    keyframes: `
      @keyframes uc-micro-press {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.97); }
      }
    `,
    duration: 150
  },

  // =====================
  // TOGGLE - Переключение
  // =====================

  flip: {
    category: INTERACTION_CATEGORIES.TOGGLE,
    name: 'Flip',
    description: '3D переворот',
    trigger: 'toggle',
    keyframes: `
      @keyframes uc-micro-flip {
        0% { transform: perspective(400px) rotateY(0); }
        100% { transform: perspective(400px) rotateY(180deg); }
      }
    `,
    duration: 400
  },

  slide: {
    category: INTERACTION_CATEGORIES.TOGGLE,
    name: 'Slide',
    description: 'Скольжение',
    trigger: 'toggle',
    keyframes: `
      @keyframes uc-micro-slide-on {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      @keyframes uc-micro-slide-off {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `,
    duration: 200
  },

  morph: {
    category: INTERACTION_CATEGORIES.TOGGLE,
    name: 'Morph',
    description: 'Трансформация формы',
    trigger: 'toggle'
  },

  // =====================
  // SUCCESS - Успех
  // =====================

  checkmark: {
    category: INTERACTION_CATEGORIES.SUCCESS,
    name: 'Checkmark',
    description: 'Анимированная галочка',
    trigger: 'success',
    svg: `
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path 
          class="uc-checkmark-path"
          d="M4 12 L9 17 L20 6" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `,
    keyframes: `
      @keyframes uc-micro-checkmark {
        0% { stroke-dashoffset: 24; }
        100% { stroke-dashoffset: 0; }
      }
    `,
    duration: 300
  },

  confetti: {
    category: INTERACTION_CATEGORIES.SUCCESS,
    name: 'Confetti',
    description: 'Конфетти',
    trigger: 'success',
    duration: 1000
  },

  celebrate: {
    category: INTERACTION_CATEGORIES.SUCCESS,
    name: 'Celebrate',
    description: 'Празднование',
    trigger: 'success',
    keyframes: `
      @keyframes uc-micro-celebrate {
        0%, 100% { transform: scale(1) rotate(0); }
        25% { transform: scale(1.2) rotate(-5deg); }
        50% { transform: scale(1.2) rotate(5deg); }
        75% { transform: scale(1.1) rotate(-3deg); }
      }
    `,
    duration: 500
  },

  // =====================
  // ERROR - Ошибка
  // =====================

  shake: {
    category: INTERACTION_CATEGORIES.ERROR,
    name: 'Shake',
    description: 'Тряска',
    trigger: 'error',
    keyframes: `
      @keyframes uc-micro-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `,
    duration: 500
  },

  cross: {
    category: INTERACTION_CATEGORIES.ERROR,
    name: 'Cross',
    description: 'Анимированный крестик',
    trigger: 'error',
    svg: `
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path 
          class="uc-cross-path-1"
          d="M6 6 L18 18" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="3"
          stroke-linecap="round"
        />
        <path 
          class="uc-cross-path-2"
          d="M18 6 L6 18" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    `,
    duration: 300
  },

  // =====================
  // NOTIFICATION - Уведомление
  // =====================

  bell: {
    category: INTERACTION_CATEGORIES.NOTIFICATION,
    name: 'Bell',
    description: 'Звонок колокольчика',
    trigger: 'notification',
    keyframes: `
      @keyframes uc-micro-bell {
        0%, 100% { transform: rotate(0); }
        10%, 30% { transform: rotate(10deg); }
        20%, 40% { transform: rotate(-10deg); }
        50% { transform: rotate(5deg); }
        60% { transform: rotate(-5deg); }
        70% { transform: rotate(2deg); }
        80% { transform: rotate(-2deg); }
      }
    `,
    duration: 600
  },

  badge: {
    category: INTERACTION_CATEGORIES.NOTIFICATION,
    name: 'Badge',
    description: 'Появление бейджа',
    trigger: 'notification',
    keyframes: `
      @keyframes uc-micro-badge {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
    `,
    duration: 300
  },

  // =====================
  // FEEDBACK - Обратная связь
  // =====================

  heartbeat: {
    category: INTERACTION_CATEGORIES.FEEDBACK,
    name: 'Heartbeat',
    description: 'Сердцебиение',
    trigger: 'feedback',
    keyframes: `
      @keyframes uc-micro-heartbeat {
        0%, 100% { transform: scale(1); }
        14% { transform: scale(1.3); }
        28% { transform: scale(1); }
        42% { transform: scale(1.3); }
        70% { transform: scale(1); }
      }
    `,
    duration: 800
  },

  thumb: {
    category: INTERACTION_CATEGORIES.FEEDBACK,
    name: 'Thumb',
    description: 'Лайк',
    trigger: 'feedback',
    keyframes: `
      @keyframes uc-micro-thumb {
        0% { transform: scale(1); }
        30% { transform: scale(1.2) rotate(-15deg); }
        50% { transform: scale(1.3) rotate(0deg); }
        70% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
    `,
    duration: 500
  }
};

/**
 * Класс для управления микро-взаимодействиями
 */
export class MicroInteractions {
  constructor() {
    this._injectedStyles = new Set();
  }

  /**
   * Воспроизводит взаимодействие
   * @param {HTMLElement} element 
   * @param {string} interactionName 
   * @param {Object} options 
   */
  play(element, interactionName, options = {}) {
    const interaction = MICRO_INTERACTIONS[interactionName];
    if (!interaction) {
      console.warn(`[MicroInteractions] Unknown interaction: ${interactionName}`);
      return;
    }

    // Инжектим keyframes если нужно
    if (interaction.keyframes && !this._injectedStyles.has(interactionName)) {
      this._injectStyles(interactionName, interaction.keyframes);
    }

    // Специальные обработчики
    switch (interactionName) {
      case 'ripple':
        this._playRipple(element, options);
        break;
      case 'confetti':
        this._playConfetti(element, options);
        break;
      case 'checkmark':
      case 'cross':
        this._playSvgAnimation(element, interaction, options);
        break;
      default:
        this._playKeyframeAnimation(element, interaction, options);
    }
  }

  /**
   * Воспроизводит ripple эффект
   * @param {HTMLElement} element 
   * @param {Object} options 
   */
  _playRipple(element, options = {}) {
    const { x, y, color = 'var(--primary-color, rgba(99, 102, 241, 0.3))' } = options;
    
    const rect = element.getBoundingClientRect();
    const rippleX = x !== undefined ? x - rect.left : rect.width / 2;
    const rippleY = y !== undefined ? y - rect.top : rect.height / 2;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement('span');
    ripple.className = 'uc-ripple';
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${rippleX - size/2}px;
      top: ${rippleY - size/2}px;
      background: ${color};
      border-radius: 50%;
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
      animation: uc-micro-ripple 0.6s ease-out forwards;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Воспроизводит конфетти
   * @param {HTMLElement} element 
   * @param {Object} options 
   */
  _playConfetti(element, options = {}) {
    const { count = 30, colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0'] } = options;
    const rect = element.getBoundingClientRect();
    
    const container = document.createElement('div');
    container.className = 'uc-confetti-container';
    container.style.cssText = `
      position: fixed;
      top: ${rect.top + rect.height/2}px;
      left: ${rect.left + rect.width/2}px;
      pointer-events: none;
      z-index: 10000;
    `;

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('span');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = 50 + Math.random() * 100;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;
      const rotation = Math.random() * 360;

      confetti.style.cssText = `
        position: absolute;
        width: ${4 + Math.random() * 4}px;
        height: ${4 + Math.random() * 4}px;
        background: ${color};
        transform: rotate(${rotation}deg);
        animation: uc-confetti-fall 1s ease-out forwards;
        --x: ${x}px;
        --y: ${y}px;
      `;

      container.appendChild(confetti);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 1000);
  }

  /**
   * Воспроизводит SVG анимацию
   * @param {HTMLElement} element 
   * @param {Object} interaction 
   * @param {Object} options 
   */
  _playSvgAnimation(element, interaction, options = {}) {
    const container = document.createElement('div');
    container.innerHTML = interaction.svg;
    container.style.cssText = `
      display: inline-flex;
      color: ${options.color || 'currentColor'};
    `;

    const paths = container.querySelectorAll('path');
    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.animation = `uc-micro-draw ${interaction.duration}ms ease forwards`;
      path.style.animationDelay = `${index * 100}ms`;
    });

    if (options.target) {
      options.target.innerHTML = '';
      options.target.appendChild(container);
    } else {
      element.appendChild(container);
      setTimeout(() => container.remove(), interaction.duration + 200);
    }
  }

  /**
   * Воспроизводит keyframe анимацию
   * @param {HTMLElement} element 
   * @param {Object} interaction 
   * @param {Object} options 
   */
  _playKeyframeAnimation(element, interaction, options = {}) {
    const animationName = `uc-micro-${interaction.name.toLowerCase()}`;
    const duration = options.duration || interaction.duration;

    element.style.animation = `${animationName} ${duration}ms ease`;

    const handleEnd = () => {
      element.style.animation = '';
      element.removeEventListener('animationend', handleEnd);
      options.onComplete?.();
    };

    element.addEventListener('animationend', handleEnd);
  }

  /**
   * Инжектит стили в документ
   * @param {string} name 
   * @param {string} keyframes 
   */
  _injectStyles(name, keyframes) {
    const style = document.createElement('style');
    style.textContent = keyframes;
    style.setAttribute('data-uc-micro', name);
    document.head.appendChild(style);
    this._injectedStyles.add(name);
  }

  /**
   * Привязывает взаимодействие к событию
   * @param {HTMLElement} element 
   * @param {string} event - click, mouseenter, etc.
   * @param {string} interactionName 
   * @param {Object} options 
   * @returns {Function} Функция отписки
   */
  bind(element, event, interactionName, options = {}) {
    const handler = (e) => {
      const opts = { ...options };
      if (e.clientX !== undefined) {
        opts.x = e.clientX;
        opts.y = e.clientY;
      }
      this.play(element, interactionName, opts);
    };

    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    const styles = [];

    // Базовые анимации
    for (const [name, interaction] of Object.entries(MICRO_INTERACTIONS)) {
      if (interaction.keyframes) {
        styles.push(interaction.keyframes);
      }
    }

    // Дополнительные стили
    styles.push(`
      /* Ripple эффект */
      @keyframes uc-micro-ripple {
        to {
          transform: scale(1);
          opacity: 0;
        }
      }

      .uc-ripple {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      }

      /* Confetti */
      @keyframes uc-confetti-fall {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(var(--x), calc(var(--y) + 200px)) rotate(720deg);
          opacity: 0;
        }
      }

      /* SVG рисование */
      @keyframes uc-micro-draw {
        to {
          stroke-dashoffset: 0;
        }
      }

      /* Утилитарные классы */
      .uc-micro-disabled {
        pointer-events: none;
      }

      .uc-micro-active {
        animation-play-state: running;
      }

      .uc-micro-paused {
        animation-play-state: paused;
      }
    `);

    return styles.join('\n');
  }
}

export default MicroInteractions;
