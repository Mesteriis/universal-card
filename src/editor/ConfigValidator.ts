/**
 * Config Validator
 *
 * Editor-facing validation, completions, and documentation helpers.
 * The schema is derived from ConfigManager so runtime and editor share
 * the same contract surface.
 *
 * @module editor/ConfigValidator
 */

import { BODY_MODES } from '../core/constants.js';
import { ConfigManager, ConfigValidationError } from '../core/config.js';
import {
  CONFIG_SCHEMA,
  FIELD_TYPES,
  formatExpectedType,
  resolveCompletionScope,
  resolveSchemaField,
  type EditorSchema,
  type EditorSchemaField,
  type FieldType,
  type FieldTypeSpec
} from './SchemaContract.js';

export { CONFIG_SCHEMA, FIELD_TYPES };

export const VALIDATION_LEVELS = Object.freeze({
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const);

type ValidationLevel = (typeof VALIDATION_LEVELS)[keyof typeof VALIDATION_LEVELS];

type ValidationIssue = {
  path: string;
  message: string;
  level: ValidationLevel;
  fix?: Record<string, unknown>;
};

type ValidationResult = {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions: ValidationIssue[];
};

type CustomRule = (config: Record<string, any>) => ValidationIssue[] | void;

type CompletionItem = {
  label: string;
  type: FieldTypeSpec;
  description?: string;
  required?: boolean;
  default?: unknown;
  options?: unknown[];
};

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}


export class ConfigValidator {
  _schema: EditorSchema;
  _customRules: CustomRule[];

  constructor() {
    this._schema = CONFIG_SCHEMA;
    this._customRules = [];
  }

  addRule(rule: CustomRule) {
    this._customRules.push(rule);
  }

  validate(config: Record<string, any>): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    if (!isPlainObject(config)) {
      result.valid = false;
      result.errors.push({
        path: '',
        message: 'Конфигурация должна быть объектом',
        level: VALIDATION_LEVELS.ERROR
      });
      return result;
    }

    let validationTarget = config;

    try {
      const migration = ConfigManager.migrate(config);
      validationTarget = migration.config;
      this._addMigrationIssues(migration, result);
    } catch (error) {
      const issue = this._toRuntimeIssue(error);
      if (issue) {
        result.errors.push(issue);
        result.valid = false;
      }
      return this._dedupeIssues(result);
    }

    this._validateSchemaObject(validationTarget, this._schema, '', result);
    this._applyRuntimeValidation(validationTarget, result);
    this._applyCustomRules(validationTarget, result);
    this._addSuggestions(validationTarget, result);

    return this._dedupeIssues(result);
  }

  _validateSchemaObject(
    value: Record<string, any>,
    schema: EditorSchema,
    path: string,
    result: ValidationResult
  ) {
    for (const [key, fieldSchema] of Object.entries(schema)) {
      const fieldPath = path ? `${path}.${key}` : key;
      const fieldValue = value[key];

      if (fieldSchema.required && fieldValue === undefined) {
        result.errors.push({
          path: fieldPath,
          message: `Обязательное поле "${key}" не указано`,
          level: VALIDATION_LEVELS.ERROR
        });
        result.valid = false;
        continue;
      }

      if (fieldValue === undefined) {
        continue;
      }

      this._validateField(fieldValue, fieldSchema, fieldPath, result);
    }

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

  _validateField(
    value: unknown,
    schema: EditorSchemaField,
    path: string,
    result: ValidationResult
  ) {
    if (!this._validateType(value, schema, path, result)) {
      return;
    }

    const schemaTypes = Array.isArray(schema.type) ? schema.type : [schema.type];

    if (schema.options && schemaTypes.includes(FIELD_TYPES.SELECT) && !schema.options.includes(value)) {
      result.errors.push({
        path,
        message: `Недопустимое значение "${String(value)}". Допустимые: ${schema.options.join(', ')}`,
        level: VALIDATION_LEVELS.ERROR
      });
      result.valid = false;
    }

    if (schemaTypes.includes(FIELD_TYPES.NUMBER) && typeof value === 'number') {
      if (schema.min !== undefined && value < schema.min) {
        result.warnings.push({
          path,
          message: `Значение ${value} меньше минимума ${schema.min}`,
          level: VALIDATION_LEVELS.WARNING
        });
      }

      if (schema.max !== undefined && value > schema.max) {
        result.warnings.push({
          path,
          message: `Значение ${value} больше максимума ${schema.max}`,
          level: VALIDATION_LEVELS.WARNING
        });
      }
    }

    if (schema.properties && isPlainObject(value)) {
      this._validateSchemaObject(value, schema.properties, path, result);
    }

    if (schema.items && Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemPath = `${path}[${index}]`;
        this._validateField(item, schema.items as EditorSchemaField, itemPath, result);
      });
    }
  }

  _validateType(
    value: unknown,
    schema: EditorSchemaField,
    path: string,
    result: ValidationResult
  ): boolean {
    const schemaTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
    const isValid = schemaTypes.some((type) => this._matchesType(value, type));

    if (!isValid) {
      result.errors.push({
        path,
        message: `Ожидается ${formatExpectedType(schema.type)}, получено ${Array.isArray(value) ? 'array' : typeof value}`,
        level: VALIDATION_LEVELS.ERROR
      });
      result.valid = false;
      return false;
    }

    if (schemaTypes.includes(FIELD_TYPES.ENTITY) && typeof value === 'string' && !value.includes('.')) {
      result.warnings.push({
        path,
        message: 'Entity ID должен быть в формате "domain.entity"',
        level: VALIDATION_LEVELS.WARNING
      });
    }

    if (schemaTypes.includes(FIELD_TYPES.ICON) && typeof value === 'string' && !value.includes(':')) {
      result.warnings.push({
        path,
        message: 'Иконка должна быть в формате "mdi:icon-name"',
        level: VALIDATION_LEVELS.WARNING
      });
    }

    return true;
  }

  _matchesType(value: unknown, type: FieldType): boolean {
    switch (type) {
      case FIELD_TYPES.STRING:
      case FIELD_TYPES.ENTITY:
      case FIELD_TYPES.ICON:
      case FIELD_TYPES.COLOR:
      case FIELD_TYPES.TEMPLATE:
        return typeof value === 'string';
      case FIELD_TYPES.NUMBER:
        return typeof value === 'number' && !Number.isNaN(value);
      case FIELD_TYPES.BOOLEAN:
        return typeof value === 'boolean';
      case FIELD_TYPES.SELECT:
        return true;
      case FIELD_TYPES.OBJECT:
      case FIELD_TYPES.ACTION:
        return isPlainObject(value);
      case FIELD_TYPES.ARRAY:
        return Array.isArray(value);
      default:
        return false;
    }
  }

  _applyRuntimeValidation(config: Record<string, any>, result: ValidationResult) {
    try {
      ConfigManager.validate(config);
    } catch (error) {
      const issue = this._toRuntimeIssue(error);
      if (issue) {
        result.errors.push(issue);
        result.valid = false;
      }
    }
  }

  _addMigrationIssues(
    migration: {
      changed: boolean;
      fromVersion: number;
      toVersion: number;
      changes: Array<{ path: string; message: string }>;
    },
    result: ValidationResult
  ) {
    if (!migration.changed) {
      return;
    }

    result.warnings.push({
      path: 'config_version',
      message: `Конфигурация будет мигрирована с v${migration.fromVersion} до v${migration.toVersion} при normalize().`,
      level: VALIDATION_LEVELS.WARNING
    });

    migration.changes.forEach((change) => {
      result.suggestions.push({
        path: change.path,
        message: change.message,
        level: VALIDATION_LEVELS.INFO
      });
    });
  }

  _toRuntimeIssue(error: unknown): ValidationIssue | null {
    if (!(error instanceof Error)) {
      return null;
    }

    const path = error instanceof ConfigValidationError ? error.path || '' : '';
    const prefix = path ? `${path}: ` : '';
    const message = error.message.startsWith(prefix)
      ? error.message.slice(prefix.length)
      : error.message;

    return {
      path,
      message,
      level: VALIDATION_LEVELS.ERROR
    };
  }

  _applyCustomRules(config: Record<string, any>, result: ValidationResult) {
    for (const rule of this._customRules) {
      try {
        const ruleResults = rule(config);
        if (!Array.isArray(ruleResults)) {
          continue;
        }

        for (const issue of ruleResults) {
          if (issue.level === VALIDATION_LEVELS.ERROR) {
            result.errors.push(issue);
            result.valid = false;
            continue;
          }

          if (issue.level === VALIDATION_LEVELS.WARNING) {
            result.warnings.push(issue);
            continue;
          }

          result.suggestions.push(issue);
        }
      } catch (error) {
        console.warn('[ConfigValidator] Rule error:', error);
      }
    }
  }

  _addSuggestions(config: Record<string, any>, result: ValidationResult) {
    const cards = Array.isArray(config.body?.cards) ? config.body.cards : [];

    if (cards.length > 5 && config.lazy_load !== true) {
      result.suggestions.push({
        path: 'lazy_load',
        message: 'Рекомендуется включить lazy_load для карточки с более чем 5 вложенными карточками',
        level: VALIDATION_LEVELS.INFO,
        fix: { lazy_load: true }
      });
    }

    if (cards.length > 1 && !config.grid) {
      result.suggestions.push({
        path: 'grid',
        message: 'Рекомендуется настроить grid layout для нескольких карточек',
        level: VALIDATION_LEVELS.INFO,
        fix: { grid: { columns: 2 } }
      });
    }

    if ((config.state_styles || config.alerts) && !config.entity) {
      result.warnings.push({
        path: 'entity',
        message: 'Для state_styles и alerts требуется указать entity',
        level: VALIDATION_LEVELS.WARNING
      });
    }

    if (config.body_mode === BODY_MODES.TABS && (!Array.isArray(config.tabs) || config.tabs.length === 0)) {
      result.warnings.push({
        path: 'tabs',
        message: 'Для режима tabs необходимо указать массив вкладок',
        level: VALIDATION_LEVELS.WARNING
      });
    }
  }

  _dedupeIssues(result: ValidationResult): ValidationResult {
    const dedupe = (issues: ValidationIssue[]) => {
      const seen = new Set<string>();
      return issues.filter((issue) => {
        const key = `${issue.level}|${issue.path}|${issue.message}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    };

    const deduped = {
      ...result,
      errors: dedupe(result.errors),
      warnings: dedupe(result.warnings),
      suggestions: dedupe(result.suggestions)
    };

    deduped.valid = deduped.errors.length === 0;
    return deduped;
  }

  getCompletions(path = ''): CompletionItem[] {
    const scope = resolveCompletionScope(this._schema, path);
    if (!scope) {
      return [];
    }

    return Object.entries(scope).map(([label, fieldSchema]) => ({
      label,
      type: fieldSchema.type,
      description: fieldSchema.description,
      required: fieldSchema.required,
      default: fieldSchema.default,
      options: fieldSchema.options
    }));
  }

  getFieldDocumentation(path: string) {
    const field = resolveSchemaField(this._schema, path);
    if (!field) {
      return null;
    }

    return {
      ...field,
      path
    };
  }

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
