import { describe, expect, it } from 'vitest';

import {
  evaluateBadgeConditionRule,
  evaluateBadgeVisibility,
  resolveBadgeRuleColor
} from '../src/ui/badge-rules.js';

describe('badge rule helpers', () => {
  it('evaluates numeric and string comparisons', () => {
    expect(evaluateBadgeConditionRule({ operator: '>=', value: 20 }, '21')).toBe(true);
    expect(evaluateBadgeConditionRule({ operator: '<', value: 30 }, 18)).toBe(true);
    expect(evaluateBadgeConditionRule({ operator: '==', value: 'on' }, 'on')).toBe(true);
    expect(evaluateBadgeConditionRule({ operator: '!=', value: 'off' }, 'on')).toBe(true);
    expect(evaluateBadgeConditionRule({ operator: '>', value: 'kitchen' }, 'hall')).toBe(false);
  });

  it('supports entity-based overrides for rule values', () => {
    const reader = (entity: string, attribute?: string) => {
      if (entity === 'sensor.temp' && attribute === 'value') {
        return 24;
      }
      return 'off';
    };

    expect(evaluateBadgeConditionRule({ operator: '>=', value: 20, entity: 'sensor.temp', attribute: 'value' }, 0, reader)).toBe(true);
    expect(evaluateBadgeConditionRule({ operator: '==', value: 'off', entity: 'binary_sensor.window' }, 'on', reader)).toBe(true);
  });

  it('evaluates visibility groups and color rules', () => {
    expect(evaluateBadgeVisibility([
      { operator: '==', value: 'on' },
      { operator: '!=', value: 'unavailable' }
    ], 'on')).toBe(true);

    expect(resolveBadgeRuleColor([
      { operator: '==', value: 'on', color: 'yellow' },
      { operator: '==', value: 'off', color: 'gray' }
    ], 'off')).toBe('gray');
  });
});
