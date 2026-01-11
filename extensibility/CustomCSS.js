/**
 * Custom CSS - система внедрения пользовательских стилей
 * 
 * Позволяет безопасно добавлять CSS стили к карточке
 * через конфигурацию или программно.
 * 
 * @module extensibility/CustomCSS
 */

/**
 * Режимы применения CSS
 */
export const CSS_MODES = {
  APPEND: 'append',     // Добавить к существующим
  PREPEND: 'prepend',   // Вставить перед существующими
  REPLACE: 'replace'    // Заменить
};

/**
 * Области применения
 */
export const CSS_SCOPES = {
  CARD: 'card',         // Вся карточка
  HEADER: 'header',     // Только header
  BODY: 'body',         // Только body
  FOOTER: 'footer',     // Только footer
  GLOBAL: 'global'      // Глобально (вне Shadow DOM)
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  enabled: true,
  sanitize: true,       // Очищать опасные свойства
  allowVariables: true, // Разрешить CSS переменные
  allowAnimations: true,
  maxLength: 50000,     // Максимальная длина CSS
  blockedProperties: [
    'behavior',
    'expression',
    '-moz-binding'
  ],
  blockedSelectors: [
    'body',
    'html',
    ':root',
    'head',
    'script'
  ]
};

/**
 * Класс для работы с пользовательскими CSS
 */
export class CustomCSS {
  /**
   * @param {HTMLElement} shadowRoot - Shadow root карточки
   * @param {Object} config - Конфигурация
   */
  constructor(shadowRoot, config = {}) {
    this._shadowRoot = shadowRoot;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._styles = new Map();
    this._styleElement = null;

    this._init();
  }

  /**
   * Инициализация
   */
  _init() {
    this._styleElement = document.createElement('style');
    this._styleElement.setAttribute('data-custom-css', 'true');
    this._shadowRoot.appendChild(this._styleElement);
  }

  /**
   * Добавляет CSS стили
   * @param {string} id - Уникальный ID стилей
   * @param {string} css - CSS код
   * @param {Object} options - Опции { scope, mode, priority }
   * @returns {boolean} Успех добавления
   */
  add(id, css, options = {}) {
    if (!this._config.enabled) return false;

    const {
      scope = CSS_SCOPES.CARD,
      mode = CSS_MODES.APPEND,
      priority = 0
    } = options;

    // Валидация
    if (!css || typeof css !== 'string') {
      console.warn('[CustomCSS] Invalid CSS');
      return false;
    }

    if (css.length > this._config.maxLength) {
      console.warn('[CustomCSS] CSS exceeds maximum length');
      return false;
    }

    // Санитизация
    let processedCSS = css;
    if (this._config.sanitize) {
      processedCSS = this._sanitize(css);
      if (!processedCSS) {
        console.warn('[CustomCSS] CSS failed sanitization');
        return false;
      }
    }

    // Добавляем scope prefix
    processedCSS = this._addScopePrefix(processedCSS, scope);

    // Сохраняем
    this._styles.set(id, {
      css: processedCSS,
      originalCSS: css,
      scope,
      mode,
      priority,
      enabled: true
    });

    // Обновляем стили
    this._updateStyles();

    return true;
  }

  /**
   * Удаляет CSS стили
   * @param {string} id 
   * @returns {boolean}
   */
  remove(id) {
    const removed = this._styles.delete(id);
    if (removed) {
      this._updateStyles();
    }
    return removed;
  }

  /**
   * Включает стили
   * @param {string} id 
   */
  enable(id) {
    const style = this._styles.get(id);
    if (style) {
      style.enabled = true;
      this._updateStyles();
    }
  }

  /**
   * Выключает стили
   * @param {string} id 
   */
  disable(id) {
    const style = this._styles.get(id);
    if (style) {
      style.enabled = false;
      this._updateStyles();
    }
  }

  /**
   * Обновляет CSS
   * @param {string} id 
   * @param {string} css 
   * @returns {boolean}
   */
  update(id, css) {
    const existing = this._styles.get(id);
    if (!existing) return false;

    return this.add(id, css, {
      scope: existing.scope,
      mode: existing.mode,
      priority: existing.priority
    });
  }

  /**
   * Санитизирует CSS
   * @param {string} css 
   * @returns {string|null}
   */
  _sanitize(css) {
    let sanitized = css;

    // Удаляем комментарии
    sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');

    // Проверяем на заблокированные свойства
    for (const prop of this._config.blockedProperties) {
      const regex = new RegExp(`${prop}\\s*:`, 'gi');
      if (regex.test(sanitized)) {
        console.warn(`[CustomCSS] Blocked property detected: ${prop}`);
        return null;
      }
    }

    // Проверяем на заблокированные селекторы
    for (const selector of this._config.blockedSelectors) {
      const regex = new RegExp(`(^|[{},\\s])${selector}[\\s{,]`, 'gi');
      if (regex.test(sanitized)) {
        console.warn(`[CustomCSS] Blocked selector detected: ${selector}`);
        return null;
      }
    }

    // Проверяем на url() с javascript:
    if (/url\s*\(\s*['"]?\s*javascript:/gi.test(sanitized)) {
      console.warn('[CustomCSS] JavaScript URL detected');
      return null;
    }

    // Проверяем на @import
    if (/@import/gi.test(sanitized)) {
      console.warn('[CustomCSS] @import is not allowed');
      sanitized = sanitized.replace(/@import[^;]*;/gi, '');
    }

    // Удаляем animation/transition если запрещено
    if (!this._config.allowAnimations) {
      sanitized = sanitized.replace(/animation[^;]*;/gi, '');
      sanitized = sanitized.replace(/transition[^;]*;/gi, '');
    }

    return sanitized;
  }

  /**
   * Добавляет scope prefix к селекторам
   * @param {string} css 
   * @param {string} scope 
   * @returns {string}
   */
  _addScopePrefix(css, scope) {
    if (scope === CSS_SCOPES.GLOBAL) return css;

    const scopeSelectors = {
      [CSS_SCOPES.CARD]: ':host',
      [CSS_SCOPES.HEADER]: '.uc-header',
      [CSS_SCOPES.BODY]: '.uc-body',
      [CSS_SCOPES.FOOTER]: '.uc-footer'
    };

    const prefix = scopeSelectors[scope] || '';
    if (!prefix) return css;

    // Простой парсинг CSS для добавления prefix
    return css.replace(/([^{}]+)(\{[^}]*\})/g, (match, selector, rules) => {
      // Разбиваем селекторы по запятой
      const prefixedSelectors = selector
        .split(',')
        .map(s => {
          s = s.trim();
          // Не добавляем prefix к :host и к уже имеющим prefix
          if (s.startsWith(':host') || s.startsWith(prefix)) {
            return s;
          }
          // Для :host добавляем как pseudo-class
          if (prefix === ':host') {
            return `:host ${s}`;
          }
          return `${prefix} ${s}`;
        })
        .join(', ');

      return `${prefixedSelectors} ${rules}`;
    });
  }

  /**
   * Обновляет style element
   */
  _updateStyles() {
    if (!this._styleElement) return;

    // Собираем все стили по приоритету
    const sortedStyles = Array.from(this._styles.values())
      .filter(s => s.enabled)
      .sort((a, b) => a.priority - b.priority);

    const css = sortedStyles.map(s => s.css).join('\n\n');
    this._styleElement.textContent = css;
  }

  /**
   * Применяет CSS из конфигурации карточки
   * @param {Object|string|Array} styles - Стили из конфига
   */
  applyFromConfig(styles) {
    // Очищаем предыдущие стили из конфига
    for (const id of this._styles.keys()) {
      if (id.startsWith('config-')) {
        this._styles.delete(id);
      }
    }

    if (!styles) {
      this._updateStyles();
      return;
    }

    // Строка
    if (typeof styles === 'string') {
      this.add('config-main', styles);
      return;
    }

    // Массив
    if (Array.isArray(styles)) {
      styles.forEach((css, index) => {
        if (typeof css === 'string') {
          this.add(`config-${index}`, css);
        } else if (typeof css === 'object') {
          this.add(`config-${css.id || index}`, css.css, css);
        }
      });
      return;
    }

    // Объект со scope
    if (typeof styles === 'object') {
      for (const [scope, css] of Object.entries(styles)) {
        if (CSS_SCOPES[scope.toUpperCase()]) {
          this.add(`config-${scope}`, css, { scope });
        } else {
          // Это объект стиля
          this.add(`config-${styles.id || 'main'}`, styles.css || styles, styles);
          break;
        }
      }
    }
  }

  /**
   * Устанавливает CSS переменную
   * @param {string} name - Имя переменной (без --)
   * @param {string} value - Значение
   */
  setVariable(name, value) {
    if (!this._config.allowVariables) return;

    const varName = name.startsWith('--') ? name : `--${name}`;
    
    // Добавляем переменную к :host
    const varCSS = `:host { ${varName}: ${value}; }`;
    this.add(`var-${name}`, varCSS, { priority: -1 });
  }

  /**
   * Устанавливает несколько CSS переменных
   * @param {Object} variables - { name: value }
   */
  setVariables(variables) {
    for (const [name, value] of Object.entries(variables)) {
      this.setVariable(name, value);
    }
  }

  /**
   * Получает все добавленные стили
   * @returns {Object[]}
   */
  getStyles() {
    return Array.from(this._styles.entries()).map(([id, style]) => ({
      id,
      ...style
    }));
  }

  /**
   * Очищает все пользовательские стили
   */
  clear() {
    this._styles.clear();
    if (this._styleElement) {
      this._styleElement.textContent = '';
    }
  }

  /**
   * Уничтожает экземпляр
   */
  destroy() {
    this.clear();
    if (this._styleElement) {
      this._styleElement.remove();
      this._styleElement = null;
    }
  }

  /**
   * Генерирует CSS из объекта стилей
   * @param {Object} styleObject - { selector: { property: value } }
   * @returns {string}
   */
  static fromObject(styleObject) {
    const rules = [];

    for (const [selector, properties] of Object.entries(styleObject)) {
      const props = Object.entries(properties)
        .map(([prop, value]) => {
          // Преобразуем camelCase в kebab-case
          const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `  ${kebabProp}: ${value};`;
        })
        .join('\n');

      rules.push(`${selector} {\n${props}\n}`);
    }

    return rules.join('\n\n');
  }

  /**
   * Возвращает хелперы для часто используемых стилей
   * @returns {Object}
   */
  static get helpers() {
    return {
      // Скрыть элемент
      hide: (selector) => `${selector} { display: none !important; }`,
      
      // Изменить цвет
      color: (selector, color) => `${selector} { color: ${color} !important; }`,
      
      // Изменить фон
      background: (selector, bg) => `${selector} { background: ${bg} !important; }`,
      
      // Добавить отступы
      padding: (selector, padding) => `${selector} { padding: ${padding} !important; }`,
      
      // Добавить границу
      border: (selector, border) => `${selector} { border: ${border} !important; }`,
      
      // Изменить размер шрифта
      fontSize: (selector, size) => `${selector} { font-size: ${size} !important; }`,
      
      // Скруглить углы
      borderRadius: (selector, radius) => `${selector} { border-radius: ${radius} !important; }`,
      
      // Добавить тень
      shadow: (selector, shadow) => `${selector} { box-shadow: ${shadow} !important; }`,
      
      // Анимация появления
      fadeIn: (selector, duration = '0.3s') => `
        ${selector} {
          animation: uc-custom-fade-in ${duration} ease;
        }
        @keyframes uc-custom-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
      
      // Градиентный фон
      gradient: (selector, from, to, direction = 'to bottom') => 
        `${selector} { background: linear-gradient(${direction}, ${from}, ${to}) !important; }`
    };
  }
}

export default CustomCSS;
