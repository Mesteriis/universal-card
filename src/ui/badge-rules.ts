import type {
  BadgeColorRule,
  BadgeComparisonOperator,
  BadgeConditionRule,
  BadgeRuleValue
} from '../core/config-contracts.js';

export type BadgeRuleValueReader = (entity: string, attribute?: string) => unknown;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function toBooleanIfPossible(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  return null;
}

function toNumberIfPossible(value: unknown): number | null {
  if (isFiniteNumber(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return null;
}

function normalizeComparablePair(actual: unknown, expected: BadgeRuleValue): [string | number | boolean, string | number | boolean] {
  const actualBoolean = toBooleanIfPossible(actual);
  const expectedBoolean = toBooleanIfPossible(expected);
  if (actualBoolean !== null && expectedBoolean !== null) {
    return [actualBoolean, expectedBoolean];
  }

  const actualNumber = toNumberIfPossible(actual);
  const expectedNumber = toNumberIfPossible(expected);
  if (actualNumber !== null && expectedNumber !== null) {
    return [actualNumber, expectedNumber];
  }

  return [String(actual ?? ''), String(expected ?? '')];
}

function compareValues(
  actual: string | number | boolean,
  expected: string | number | boolean,
  operator: BadgeComparisonOperator
): boolean {
  switch (operator) {
    case '==':
      return actual === expected;
    case '!=':
      return actual !== expected;
    case '>':
      return actual > expected;
    case '<':
      return actual < expected;
    case '>=':
      return actual >= expected;
    case '<=':
      return actual <= expected;
    default:
      return false;
  }
}

function resolveRuleActualValue(
  rule: BadgeConditionRule,
  fallbackValue: unknown,
  readValue?: BadgeRuleValueReader
): unknown {
  if (rule.entity) {
    if (typeof readValue === 'function') {
      return readValue(rule.entity, rule.attribute);
    }
    return undefined;
  }

  return fallbackValue;
}

export function evaluateBadgeConditionRule(
  rule: BadgeConditionRule,
  fallbackValue: unknown,
  readValue?: BadgeRuleValueReader
): boolean {
  const actualValue = resolveRuleActualValue(rule, fallbackValue, readValue);
  const [actual, expected] = normalizeComparablePair(actualValue, rule.value);
  return compareValues(actual, expected, rule.operator);
}

export function evaluateBadgeVisibility(
  rules: BadgeConditionRule[] | undefined,
  fallbackValue: unknown,
  readValue?: BadgeRuleValueReader
): boolean {
  if (!Array.isArray(rules) || rules.length === 0) {
    return true;
  }

  return rules.every((rule) => evaluateBadgeConditionRule(rule, fallbackValue, readValue));
}

export function resolveBadgeRuleColor(
  rules: BadgeColorRule[] | undefined,
  fallbackValue: unknown,
  readValue?: BadgeRuleValueReader
): string | null {
  if (!Array.isArray(rules) || rules.length === 0) {
    return null;
  }

  const matchedRule = rules.find((rule) => evaluateBadgeConditionRule(rule, fallbackValue, readValue));
  return matchedRule?.color || null;
}
