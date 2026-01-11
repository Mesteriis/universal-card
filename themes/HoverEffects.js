/**
 * Hover Effects - библиотека hover эффектов
 * 
 * Коллекция эффектов при наведении для карточек и элементов.
 * 
 * @module themes/HoverEffects
 */

/**
 * Категории эффектов
 */
export const EFFECT_CATEGORIES = {
  TRANSFORM: 'transform',   // Трансформации
  SHADOW: 'shadow',         // Тени
  GLOW: 'glow',             // Свечение
  OVERLAY: 'overlay',       // Наложения
  BORDER: 'border',         // Границы
  BACKGROUND: 'background'  // Фон
};

/**
 * Библиотека hover эффектов
 */
export const HOVER_EFFECTS = {
  // =====================
  // TRANSFORM - Трансформации
  // =====================

  lift: {
    category: EFFECT_CATEGORIES.TRANSFORM,
    name: 'Lift',
    description: 'Приподнимание',
    styles: {
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
      }
    }
  },

  scale: {
    category: EFFECT_CATEGORIES.TRANSFORM,
    name: 'Scale',
    description: 'Увеличение',
    styles: {
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'scale(1.02)'
      }
    }
  },

  tilt: {
    category: EFFECT_CATEGORIES.TRANSFORM,
    name: 'Tilt',
    description: 'Наклон',
    styles: {
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)'
      }
    },
    interactive: true // Требует JS для отслеживания позиции мыши
  },

  float: {
    category: EFFECT_CATEGORIES.TRANSFORM,
    name: 'Float',
    description: 'Плавание',
    styles: {
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      ':hover': {
        transform: 'translateY(-8px) scale(1.01)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
      }
    }
  },

  push: {
    category: EFFECT_CATEGORIES.TRANSFORM,
    name: 'Push',
    description: 'Вдавливание',
    styles: {
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      ':hover': {
        transform: 'scale(0.98)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    }
  },

  rotate: {
    category: EFFECT_CATEGORIES.TRANSFORM,
    name: 'Rotate',
    description: 'Лёгкий поворот',
    styles: {
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'rotate(1deg)'
      }
    }
  },

  // =====================
  // SHADOW - Тени
  // =====================

  shadowLift: {
    category: EFFECT_CATEGORIES.SHADOW,
    name: 'Shadow Lift',
    description: 'Тень с подъёмом',
    styles: {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      ':hover': {
        boxShadow: '0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)'
      }
    }
  },

  shadowGrow: {
    category: EFFECT_CATEGORIES.SHADOW,
    name: 'Shadow Grow',
    description: 'Растущая тень',
    styles: {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease',
      ':hover': {
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
      }
    }
  },

  shadowColor: {
    category: EFFECT_CATEGORIES.SHADOW,
    name: 'Shadow Color',
    description: 'Цветная тень',
    styles: {
      transition: 'box-shadow 0.3s ease',
      ':hover': {
        boxShadow: '0 10px 30px var(--primary-color, rgba(99, 102, 241, 0.3))'
      }
    }
  },

  shadowInset: {
    category: EFFECT_CATEGORIES.SHADOW,
    name: 'Shadow Inset',
    description: 'Внутренняя тень',
    styles: {
      transition: 'box-shadow 0.3s ease',
      ':hover': {
        boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    }
  },

  // =====================
  // GLOW - Свечение
  // =====================

  glow: {
    category: EFFECT_CATEGORIES.GLOW,
    name: 'Glow',
    description: 'Свечение',
    styles: {
      transition: 'box-shadow 0.3s ease',
      ':hover': {
        boxShadow: '0 0 20px var(--primary-color, rgba(99, 102, 241, 0.5))'
      }
    }
  },

  glowPulse: {
    category: EFFECT_CATEGORIES.GLOW,
    name: 'Glow Pulse',
    description: 'Пульсирующее свечение',
    styles: {
      transition: 'box-shadow 0.3s ease',
      ':hover': {
        animation: 'uc-hover-glow-pulse 1.5s ease-in-out infinite'
      }
    }
  },

  neon: {
    category: EFFECT_CATEGORIES.GLOW,
    name: 'Neon',
    description: 'Неоновое свечение',
    styles: {
      transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      ':hover': {
        borderColor: 'var(--primary-color)',
        boxShadow: `
          0 0 5px var(--primary-color),
          0 0 10px var(--primary-color),
          0 0 20px var(--primary-color),
          0 0 40px var(--primary-color)
        `
      }
    }
  },

  // =====================
  // OVERLAY - Наложения
  // =====================

  shine: {
    category: EFFECT_CATEGORIES.OVERLAY,
    name: 'Shine',
    description: 'Блеск',
    styles: {
      position: 'relative',
      overflow: 'hidden',
      ':hover::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
        transform: 'rotate(30deg)',
        animation: 'uc-hover-shine 0.75s ease-out'
      }
    },
    requiresPseudo: true
  },

  overlay: {
    category: EFFECT_CATEGORIES.OVERLAY,
    name: 'Overlay',
    description: 'Затемнение',
    styles: {
      position: 'relative',
      ':hover::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 'inherit',
        pointerEvents: 'none'
      }
    },
    requiresPseudo: true
  },

  gradient: {
    category: EFFECT_CATEGORIES.OVERLAY,
    name: 'Gradient',
    description: 'Градиентное наложение',
    styles: {
      position: 'relative',
      ':hover::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, var(--primary-color, rgba(99, 102, 241, 0.1)) 0%, transparent 100%)',
        borderRadius: 'inherit',
        pointerEvents: 'none'
      }
    },
    requiresPseudo: true
  },

  // =====================
  // BORDER - Границы
  // =====================

  borderHighlight: {
    category: EFFECT_CATEGORIES.BORDER,
    name: 'Border Highlight',
    description: 'Подсветка границы',
    styles: {
      border: '2px solid transparent',
      transition: 'border-color 0.3s ease',
      ':hover': {
        borderColor: 'var(--primary-color)'
      }
    }
  },

  borderGradient: {
    category: EFFECT_CATEGORIES.BORDER,
    name: 'Border Gradient',
    description: 'Градиентная граница',
    styles: {
      position: 'relative',
      ':hover::before': {
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color, #6366f1))',
        borderRadius: 'inherit',
        zIndex: -1
      }
    },
    requiresPseudo: true
  },

  // =====================
  // BACKGROUND - Фон
  // =====================

  bgBrighten: {
    category: EFFECT_CATEGORIES.BACKGROUND,
    name: 'Brighten',
    description: 'Осветление фона',
    styles: {
      transition: 'filter 0.3s ease',
      ':hover': {
        filter: 'brightness(1.05)'
      }
    }
  },

  bgDarken: {
    category: EFFECT_CATEGORIES.BACKGROUND,
    name: 'Darken',
    description: 'Затемнение фона',
    styles: {
      transition: 'filter 0.3s ease',
      ':hover': {
        filter: 'brightness(0.95)'
      }
    }
  },

  bgColor: {
    category: EFFECT_CATEGORIES.BACKGROUND,
    name: 'Color Shift',
    description: 'Смещение цвета',
    styles: {
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: 'var(--primary-color, rgba(99, 102, 241, 0.1))'
      }
    }
  }
};

/**
 * Класс для управления hover эффектами
 */
export class HoverEffects {
  /**
   * @param {HTMLElement} element - Элемент для применения эффекта
   * @param {Object} config - Конфигурация
   */
  constructor(element, config = {}) {
    this._element = element;
    this._config = {
      effect: 'lift',
      duration: 0.3,
      customStyles: {},
      ...config
    };
    this._styleElement = null;
    this._effectId = `uc-hover-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Устанавливает эффект
   * @param {string} effectName 
   */
  setEffect(effectName) {
    if (HOVER_EFFECTS[effectName]) {
      this._config.effect = effectName;
    }
  }

  /**
   * Получает эффект
   * @returns {Object}
   */
  getEffect() {
    return HOVER_EFFECTS[this._config.effect] || HOVER_EFFECTS.lift;
  }

  /**
   * Применяет эффект к элементу
   */
  apply() {
    const effect = this.getEffect();
    
    // Базовые стили
    for (const [property, value] of Object.entries(effect.styles)) {
      if (!property.startsWith(':')) {
        this._element.style[property] = value;
      }
    }

    // Hover стили через CSS класс
    this._injectStyles(effect);

    this._element.classList.add('uc-hover-effect', this._effectId);
  }

  /**
   * Инжектит стили в документ
   * @param {Object} effect 
   */
  _injectStyles(effect) {
    if (this._styleElement) {
      this._styleElement.remove();
    }

    const hoverStyles = effect.styles[':hover'] || {};
    const beforeStyles = effect.styles[':hover::before'] || {};
    const afterStyles = effect.styles[':hover::after'] || {};

    let css = '';

    // Hover стили
    if (Object.keys(hoverStyles).length > 0) {
      css += `.${this._effectId}:hover { ${this._objectToCSS(hoverStyles)} }\n`;
    }

    // ::before стили
    if (effect.styles['::before'] || Object.keys(beforeStyles).length > 0) {
      css += `.${this._effectId}::before { content: ''; ${this._objectToCSS(effect.styles['::before'] || {})} }\n`;
      css += `.${this._effectId}:hover::before { ${this._objectToCSS(beforeStyles)} }\n`;
    }

    // ::after стили
    if (Object.keys(afterStyles).length > 0) {
      css += `.${this._effectId}::after { content: ''; position: absolute; opacity: 0; transition: opacity 0.3s ease; }\n`;
      css += `.${this._effectId}:hover::after { opacity: 1; ${this._objectToCSS(afterStyles)} }\n`;
    }

    this._styleElement = document.createElement('style');
    this._styleElement.textContent = css;
    this._styleElement.setAttribute('data-uc-hover', this._effectId);
    document.head.appendChild(this._styleElement);
  }

  /**
   * Конвертирует объект в CSS строку
   * @param {Object} obj 
   * @returns {string}
   */
  _objectToCSS(obj) {
    return Object.entries(obj)
      .filter(([key]) => !key.startsWith(':'))
      .map(([key, value]) => {
        // Конвертируем camelCase в kebab-case
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  }

  /**
   * Удаляет эффект с элемента
   */
  remove() {
    this._element.classList.remove('uc-hover-effect', this._effectId);
    
    if (this._styleElement) {
      this._styleElement.remove();
      this._styleElement = null;
    }
  }

  /**
   * Применяет интерактивный tilt эффект
   * @param {HTMLElement} element 
   * @param {Object} options 
   */
  static applyTilt(element, options = {}) {
    const { max = 10, perspective = 1000, scale = 1.02 } = options;

    element.style.transition = 'transform 0.1s ease-out';
    element.style.transformStyle = 'preserve-3d';

    const handleMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -max;
      const rotateY = ((x - centerX) / centerX) * max;

      element.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    };

    const handleLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', handleLeave);

    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', handleLeave);
    };
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    const styles = [];

    // Генерируем классы для каждого эффекта
    for (const [name, effect] of Object.entries(HOVER_EFFECTS)) {
      const className = `uc-hover-${name}`;
      const baseStyles = { ...effect.styles };
      delete baseStyles[':hover'];
      delete baseStyles[':hover::before'];
      delete baseStyles[':hover::after'];

      styles.push(`
        .${className} {
          ${Object.entries(baseStyles)
            .filter(([key]) => !key.startsWith(':'))
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ')}
        }
      `);

      if (effect.styles[':hover']) {
        styles.push(`
          .${className}:hover {
            ${Object.entries(effect.styles[':hover'])
              .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
              .join('; ')}
          }
        `);
      }
    }

    // Анимации
    styles.push(`
      @keyframes uc-hover-shine {
        from { transform: translateX(-100%) rotate(30deg); }
        to { transform: translateX(100%) rotate(30deg); }
      }

      @keyframes uc-hover-glow-pulse {
        0%, 100% { box-shadow: 0 0 20px var(--primary-color, rgba(99, 102, 241, 0.5)); }
        50% { box-shadow: 0 0 40px var(--primary-color, rgba(99, 102, 241, 0.8)); }
      }

      /* Базовые утилитарные классы */
      .uc-hover-effect {
        cursor: pointer;
      }

      .uc-hover-disabled {
        pointer-events: none;
      }
    `);

    return styles.join('\n');
  }
}

export default HoverEffects;
