/**
 * Shared editor schema adapter.
 *
 * Converts the runtime JSON-schema-like contract from ConfigManager into
 * editor-oriented field metadata that can be reused by validation and UI.
 *
 * @module editor/SchemaContract
 */

import { ConfigManager } from '../core/config.js';

export const FIELD_TYPES = Object.freeze({
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
} as const);

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];
export type FieldTypeSpec = FieldType | FieldType[];

export type EditorSchemaField = {
  type: FieldTypeSpec;
  description?: string;
  required?: boolean;
  default?: unknown;
  options?: unknown[];
  properties?: EditorSchema;
  items?: EditorSchemaField;
  additionalProperties?: EditorSchemaField | boolean;
  min?: number;
  max?: number;
};

export type EditorSchema = Record<string, EditorSchemaField>;

type RuntimeSchemaField = {
  type?: string | string[];
  description?: string;
  default?: unknown;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  properties?: Record<string, RuntimeSchemaField>;
  items?: RuntimeSchemaField;
  additionalProperties?: RuntimeSchemaField | boolean;
  required?: string[];
};

function uniqueFieldTypes(types: FieldType[]): FieldTypeSpec {
  const unique = [...new Set(types)];
  return unique.length === 1 ? unique[0] : unique;
}

function mapPrimitiveFieldType(fieldName: string, type: string): FieldType {
  if (fieldName === 'entity') return FIELD_TYPES.ENTITY;
  if (fieldName === 'icon' || fieldName.endsWith('_icon')) return FIELD_TYPES.ICON;
  if (fieldName.includes('color')) return FIELD_TYPES.COLOR;

  switch (type) {
    case 'number':
    case 'integer':
      return FIELD_TYPES.NUMBER;
    case 'boolean':
      return FIELD_TYPES.BOOLEAN;
    case 'array':
      return FIELD_TYPES.ARRAY;
    case 'object':
      return fieldName.endsWith('_action') ? FIELD_TYPES.ACTION : FIELD_TYPES.OBJECT;
    case 'string':
    default:
      return FIELD_TYPES.STRING;
  }
}

export function convertRuntimeField(
  fieldName: string,
  schema: RuntimeSchemaField,
  seen: WeakMap<RuntimeSchemaField, EditorSchemaField> = new WeakMap()
): EditorSchemaField {
  const existing = seen.get(schema);
  if (existing) {
    return existing;
  }

  const rawTypes = Array.isArray(schema.type)
    ? schema.type
    : [schema.type || 'string'];

  const mappedType = schema.enum
    ? FIELD_TYPES.SELECT
    : uniqueFieldTypes(rawTypes.map((type) => mapPrimitiveFieldType(fieldName, type)));

  const field: EditorSchemaField = {
    type: mappedType,
    description: schema.description,
    default: schema.default
  };
  seen.set(schema, field);

  if (schema.enum) {
    field.options = [...schema.enum];
  }

  if (typeof schema.minimum === 'number') {
    field.min = schema.minimum;
  }

  if (typeof schema.maximum === 'number') {
    field.max = schema.maximum;
  }

  if (schema.properties) {
    const required = new Set(schema.required || []);
    field.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, childSchema]) => {
        const childField = convertRuntimeField(key, childSchema, seen);
        childField.required = required.has(key);
        return [key, childField];
      })
    );
  }

  if (schema.items) {
    field.items = convertRuntimeField(`${fieldName}_item`, schema.items, seen);
  }

  if (schema.additionalProperties) {
    field.additionalProperties = schema.additionalProperties === true
      ? true
      : convertRuntimeField(`${fieldName}_value`, schema.additionalProperties, seen);
  }

  return field;
}

export function createEditorSchema(): EditorSchema {
  const runtimeSchema = ConfigManager.getSchema() as RuntimeSchemaField;
  const runtimeProperties = runtimeSchema.properties || {};
  const required = new Set(runtimeSchema.required || []);

  return Object.fromEntries(
    Object.entries(runtimeProperties).map(([key, fieldSchema]) => {
      const field = convertRuntimeField(key, fieldSchema);
      field.required = required.has(key);
      return [key, field];
    })
  );
}

export function normalizePathSegments(path: string): string[] {
  return path
    .replace(/\[\d+\]/g, '')
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function resolveSchemaField(schema: EditorSchema, path: string): EditorSchemaField | null {
  const segments = normalizePathSegments(path);
  if (segments.length === 0) {
    return null;
  }

  let currentSchema: EditorSchema | null = schema;
  let currentField: EditorSchemaField | null = null;

  for (const segment of segments) {
    if (!currentSchema || !currentSchema[segment]) {
      return null;
    }

    currentField = currentSchema[segment];

    if (currentField.properties) {
      currentSchema = currentField.properties;
      continue;
    }

    if (currentField.items?.properties) {
      currentSchema = currentField.items.properties;
      continue;
    }

    currentSchema = null;
  }

  return currentField;
}

export function resolveCompletionScope(schema: EditorSchema, path: string): EditorSchema | null {
  if (!path.trim()) {
    return schema;
  }

  const field = resolveSchemaField(schema, path);
  if (!field) {
    return null;
  }

  if (field.properties) {
    return field.properties;
  }

  if (field.items?.properties) {
    return field.items.properties;
  }

  return null;
}

export function formatExpectedType(type: FieldTypeSpec): string {
  if (Array.isArray(type)) {
    return type.join(' | ');
  }

  return type;
}

export const CONFIG_SCHEMA = createEditorSchema();
