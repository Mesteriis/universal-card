/**
 * Config Validator - валидация конфигурации
 * 
 * Проверяет конфигурацию карточки и предоставляет
 * подсказки и автодополнение для редактора.
 * 
 * @module editor/ConfigValidator
 */

import { BODY_MODES } from '../core/constants.js';

/**
 * Типы полей конфигурации
 */
export const FIELD_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ENTITY: 'entity',
  ICON: 'icon',
  COLOR: 'color',
  SELECT: 'select',
  OBJECT: 'object',
  ARRAY: 'array',
  TEMPLATE: 'template',
  ACTION: 'action'
};

/**
 * Уровни валидации
 */
export const VALIDATION_LEVELS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Схема конфигурации Universal Card
 */
export const CONFIG_SCHEMA = {
  // Header
  title: {
    type: FIELD_TYPES.STRING,
    description: 'Заголовок карточки',
    required: false
  },
  subtitle: {
    type: FIELD_TYPES.STRING,
    description: 'Подзаголовок',
    required: false
  },
  icon: {
    type: FIELD_TYPES.ICON,
    description: 'Иконка в заголовке',
    required: false,
    default: 'mdi:card'
  },
  entity: {
    type: FIELD_TYPES.ENTITY,
    description: 'Основная entity для карточки',
    required: false
  },

  // Body
  body_mode: {
    type: FIELD_TYPES.SELECT,
    description: 'Режим отображения тела карточки',
    required: false,
    default: 'expand',
    options: Object.values(BODY_MODES)
  },
  cards: {
    type: FIELD_TYPES.ARRAY,
    description: 'Массив вложенных карточек',
    required: false,
    items: {
      type: FIELD_TYPES.OBJECT
    }
  },

  // Grid
  grid: {
    type: FIELD_TYPES.OBJECT,
    description: 'Настройки Grid layout',
    required: false,
    properties: {
      columns: {
        type: FIELD_TYPES.NUMBER,
        description: 'Количество колонок',
        min: 1,
        max: 12,
        default: 2
      },
      gap: {
        type: FIELD_TYPES.STRING,
        description: 'Отступ между элементами',
        default: '8px'
      }
    }
  },

  // Header slots
  header_left: {
    type: FIELD_TYPES.OBJECT,
    description: 'Содержимое слева в header'
  },
  header_right: {
    type: FIELD_TYPES.OBJECT,
    description: 'Содержимое справа в header'
  },

  // Actions
  tap_action: {
    type: FIELD_TYPES.ACTION,
    description: 'Действие при клике'
  },
  hold_action: {
    type: FIELD_TYPES.ACTION,
    description: 'Действие при долгом нажатии'
  },
  double_tap_action: {
    type: FIELD_TYPES.ACTION,
    description: 'Действие при двойном клике'
  },

  // Visibility
  visibility: {
    type: FIELD_TYPES.ARRAY,
    description: 'Условия видимости',
    items: {
      type: FIELD_TYPES.OBJECT
    }
  },

  // Styling
  theme: {
    type: FIELD_TYPES.SELECT,
    description: 'Тема оформления',
    options: ['default', 'glass', 'neumorphism', 'neon']
  },
  color_scheme: {
    type: FIELD_TYPES.SELECT,
    description: 'Цветовая схема'
  },
  
  // Features
  lazy_load: {
    type: FIELD_TYPES.BOOLEAN,
    description: 'Ленивая загрузка контента',
    default: true
  },
  collapsed: {
    type: FIELD_TYPES.BOOLEAN,
    description: 'Начальное состояние (свёрнуто)',
    default: false
  },
  
  // Linking
  link_group: {
    type: FIELD_TYPES.STRING,
    description: 'ID группы связанных карточек'
  },
  link_role: {
    type: FIELD_TYPES.SELECT,
    description: 'Роль в группе связывания',
    options: ['master', 'slave']
  }
};

/**
 * Класс валидатора конфигурации
 */
export class ConfigValidator {
  constructor() {
    this._schema = CONFIG_SCHEMA;
    this._customRules = [];
  }

  /**
   * Добавляет кастомное правило валидации
   * @param {Function} rule - Функция (config) => ValidationResult[]
   */
  addRule(rule) {
    this._customRules.push(rule);
  }

  /**
   * Валидирует конфигурацию
   * @param {Object} config - Конфигурация для проверки
   * @returns {Object} { valid: boolean, errors: [], warnings: [], suggestions: [] }
   */
  validate(config) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    if (!config || typeof config !== 'object') {
      result.valid = false;
      result.errors.push({
        path: '',
        message: 'Конфигурация должна быть объектом',
        level: VALIDATION_LEVELS.ERROR
      });
      return result;
    }

    // Проверяем схему
    this._validateSchema(config, this._schema, '', result);

    // Применяем кастомные правила
    for (const rule of this._customRules) {
      try {
        const ruleResults = rule(config);
        if (Array.isArray(ruleResults)) {
          for (const r of ruleResults) {
            if (r.level === VALIDATION_LEVELS.ERROR) {
              result.errors.push(r);
              result.valid = false;
            } else if (r.level === VALIDATION_LEVELS.WARNING) {
              result.warnings.push(r);
            } else {
              result.suggestions.push(r);
            }
          }
        }
      } catch (e) {
        console.warn('[ConfigValidator] Rule error:', e);
      }
    }

    // Добавляем умные подсказки
    this._addSuggestions(config, result);

    return result;
  }

  /**
   * Валидирует по схеме
   * @param {*} value 
   * @param {Object} schema 
   * @param {string} path 
   * @param {Object} result 
   */
  _validateSchema(value, schema, path, result) {
    for (const [key, fieldSchema] of Object.entries(schema)) {
      const fieldPath = path ? `${path}.${key}` : key;
      const fieldValue = value[key];

      // Проверка обязательных полей
      if (fieldSchema.required && fieldValue === undefined) {
        result.errors.push({
          path: fieldPath,
          message: `Обязательное поле "${key}" не указано`,
          level: VALIDATION_LEVELS.ERROR
        });
        result.valid = false;
        continue;
      }

      if (fieldValue === undefined) continue;

      // Проверка типа
      const typeValid = this._validateType(fieldValue, fieldSchema, fieldPath, result);
      if (!typeValid) continue;

      // Проверка вложенных объектов
      if (fieldSchema.type === FIELD_TYPES.OBJECT && fieldSchema.properties) {
        this._validateSchema(fieldValue, fieldSchema.properties, fieldPath, result);
      }

      // Проверка массивов
      if (fieldSchema.type === FIELD_TYPES.ARRAY && fieldSchema.items && Array.isArray(fieldValue)) {
        fieldValue.forEach((item, index) => {
          if (fieldSchema.items.type === FIELD_TYPES.OBJECT && fieldSchema.items.properties) {
            this._validateSchema(item, fieldSchema.items.properties, `${fieldPath}[${index}]`, result);
          }
        });
      }

      // Проверка диапазона для чисел
      if (fieldSchema.type === FIELD_TYPES.NUMBER) {
        if (fieldSchema.min !== undefined && fieldValue < fieldSchema.min) {
          result.warnings.push({
            path: fieldPath,
            message: `Значение ${fieldValue} меньше минимума ${fieldSchema.min}`,
            level: VALIDATION_LEVELS.WARNING
          });
        }
        if (fieldSchema.max !== undefined && fieldValue > fieldSchema.max) {
          result.warnings.push({
            path: fieldPath,
            message: `Значение ${fieldValue} больше максимума ${fieldSchema.max}`,
            level: VALIDATION_LEVELS.WARNING
          });
        }
      }

      // Проверка опций для select
      if (fieldSchema.type === FIELD_TYPES.SELECT && fieldSchema.options) {
        if (!fieldSchema.options.includes(fieldValue)) {
          result.errors.push({
            path: fieldPath,
            message: `Недопустимое значение "${fieldValue}". Допустимые: ${fieldSchema.options.join(', ')}`,
            level: VALIDATION_LEVELS.ERROR
          });
          result.valid = false;
        }
      }
    }

    // Проверяем неизвестные поля
    for (const key of Object.keys(value)) {
      if (!schema[key]) {
        result.warnings.push({
          path: path ? `${path}.${key}` : key,
          message: `Неизвестное поле "${key}"`,
          level: VALIDATION_LEVELS.WARNING
        });
      }
    }
  }

  /**
   * Валидирует тип значения
   * @param {*} value 
   * @param {Object} schema 
   * @param {string} path 
   * @param {Object} result 
   * @returns {boolean}
   */
  _validateType(value, schema, path, result) {
    const { type } = schema;

    switch (type) {
      case FIELD_TYPES.STRING:
        if (typeof value !== 'string') {
          result.errors.push({
            path,
            message: `Ожидается строка, получено ${typeof value}`,
            level: VALIDATION_LEVELS.ERROR
          });
          result.valid = false;
          return false;
        }
        break;

      case FIELD_TYPES.NUMBER:
        if (typeof value !== 'number' || isNaN(value)) {
          result.errors.push({
            path,
            message: `Ожидается число, получено ${typeof value}`,
            level: VALIDATION_LEVELS.ERROR
          });
          result.valid = false;
          return false;
        }
        break;

      case FIELD_TYPES.BOOLEAN:
        if (typeof value !== 'boolean') {
          result.errors.push({
            path,
            message: `Ожидается boolean, получено ${typeof value}`,
            level: VALIDATION_LEVELS.ERROR
          });
          result.valid = false;
          return false;
        }
        break;

      case FIELD_TYPES.OBJECT:
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          result.errors.push({
            path,
            message: `Ожидается объект`,
            level: VALIDATION_LEVELS.ERROR
          });
          result.valid = false;
          return false;
        }
        break;

      case FIELD_TYPES.ARRAY:
        if (!Array.isArray(value)) {
          result.errors.push({
            path,
            message: `Ожидается массив`,
            level: VALIDATION_LEVELS.ERROR
          });
          result.valid = false;
          return false;
        }
        break;

      case FIELD_TYPES.ENTITY:
        if (typeof value !== 'string' || !value.includes('.')) {
          result.warnings.push({
            path,
            message: `Entity ID должен быть в формате "domain.entity"`,
            level: VALIDATION_LEVELS.WARNING
          });
        }
        break;

      case FIELD_TYPES.ICON:
        if (typeof value !== 'string' || !value.includes(':')) {
          result.warnings.push({
            path,
            message: `Иконка должна быть в формате "mdi:icon-name"`,
            level: VALIDATION_LEVELS.WARNING
          });
        }
        break;
    }

    return true;
  }

  /**
   * Добавляет умные подсказки
   * @param {Object} config 
   * @param {Object} result 
   */
  _addSuggestions(config, result) {
    // Подсказка про lazy_load для большого количества карточек
    if (config.cards?.length > 5 && config.lazy_load !== true) {
      result.suggestions.push({
        path: 'lazy_load',
        message: 'Рекомендуется включить lazy_load для карточки с более чем 5 вложенными карточками',
        level: VALIDATION_LEVELS.INFO,
        fix: { lazy_load: true }
      });
    }

    // Подсказка про grid для нескольких карточек
    if (config.cards?.length > 1 && !config.grid) {
      result.suggestions.push({
        path: 'grid',
        message: 'Рекомендуется настроить grid layout для нескольких карточек',
        level: VALIDATION_LEVELS.INFO,
        fix: { grid: { columns: 2 } }
      });
    }

    // Подсказка про entity если есть entity-зависимые фичи
    if ((config.state_styles || config.alerts) && !config.entity) {
      result.warnings.push({
        path: 'entity',
        message: 'Для state_styles и alerts требуется указать entity',
        level: VALIDATION_LEVELS.WARNING
      });
    }

    // Подсказка про tabs
    if (config.body_mode === 'tabs' && (!config.tabs || config.tabs.length === 0)) {
      result.warnings.push({
        path: 'tabs',
        message: 'Для режима tabs необходимо указать массив вкладок',
        level: VALIDATION_LEVELS.WARNING
      });
    }
  }

  /**
   * Получает автодополнение для пути
   * @param {string} path - Путь в конфигурации
   * @returns {Object[]} Варианты автодополнения
   */
  getCompletions(path = '') {
    const completions = [];
    const parts = path.split('.').filter(Boolean);
    let current = this._schema;

    // Навигация по схеме
    for (const part of parts) {
      if (current[part]) {
        current = current[part];
        if (current.properties) {
          current = current.properties;
        }
      } else {
        return [];
      }
    }

    // Генерируем автодополнения
    for (const [key, schema] of Object.entries(current)) {
      completions.push({
        label: key,
        type: schema.type,
        description: schema.description,
        required: schema.required,
        default: schema.default,
        options: schema.options
      });
    }

    return completions;
  }

  /**
   * Получает документацию для поля
   * @param {string} path 
   * @returns {Object|null}
   */
  getFieldDocumentation(path) {
    const parts = path.split('.').filter(Boolean);
    let current = this._schema;

    for (const part of parts) {
      if (current[part]) {
        current = current[part];
        if (current.properties) {
          current = current.properties;
        }
      } else {
        return null;
      }
    }

    return {
      ...current,
      path
    };
  }

  /**
   * Возвращает CSS стили для отображения ошибок
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-validation-error {
        color: var(--error-color, #f44336);
        background: rgba(244, 67, 54, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        margin: 4px 0;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-validation-warning {
        color: var(--warning-color, #ff9800);
        background: rgba(255, 152, 0, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        margin: 4px 0;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-validation-suggestion {
        color: var(--info-color, #2196f3);
        background: rgba(33, 150, 243, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        margin: 4px 0;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-validation-path {
        font-family: monospace;
        font-size: 12px;
        opacity: 0.7;
      }

      .uc-validation-fix {
        margin-left: auto;
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        background: currentColor;
        color: white;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.8;
      }

      .uc-validation-fix:hover {
        opacity: 1;
      }
    `;
  }
}

export default ConfigValidator;
