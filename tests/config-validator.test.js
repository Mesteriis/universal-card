import { describe, expect, it } from 'vitest';

import { ConfigValidator, CONFIG_SCHEMA, FIELD_TYPES } from '../src/editor/ConfigValidator.js';
import { DEFAULTS, LIMITS } from '../src/core/constants.js';
import { CURRENT_CONFIG_VERSION } from '../src/core/config.js';

describe('ConfigValidator', () => {
  it('derives editor schema from the shared config contract', () => {
    expect(CONFIG_SCHEMA.config_version.type).toBe(FIELD_TYPES.NUMBER);
    expect(CONFIG_SCHEMA.config_version.default).toBe(CURRENT_CONFIG_VERSION);
    expect(CONFIG_SCHEMA.expand_trigger.type).toBe(FIELD_TYPES.SELECT);
    expect(CONFIG_SCHEMA.animation_duration.type).toBe(FIELD_TYPES.NUMBER);
    expect(CONFIG_SCHEMA.carousel_interval.type).toBe(FIELD_TYPES.NUMBER);
    expect(CONFIG_SCHEMA.pool_scope.type).toBe(FIELD_TYPES.SELECT);
    expect(CONFIG_SCHEMA.attribute.type).toBe(FIELD_TYPES.STRING);
    expect(CONFIG_SCHEMA.state_styles.type).toBe(FIELD_TYPES.OBJECT);
    expect(CONFIG_SCHEMA.swipe.type).toBe(FIELD_TYPES.OBJECT);
    expect(CONFIG_SCHEMA.swipe.properties.left.properties.action.type).toBe(FIELD_TYPES.SELECT);
    expect(CONFIG_SCHEMA.badges.type).toBe(FIELD_TYPES.ARRAY);
    expect(CONFIG_SCHEMA.badges.items.properties.type.options).toContain('counter');
    expect(CONFIG_SCHEMA.badges.items.properties.thresholds.type).toBe(FIELD_TYPES.ARRAY);
    expect(CONFIG_SCHEMA.pool_scope.options).toContain(DEFAULTS.pool_scope);
    expect(CONFIG_SCHEMA.pool_ttl_ms.min).toBe(LIMITS.POOL_MIN_TTL_MS);
    expect(CONFIG_SCHEMA.pool_ttl_ms.max).toBe(LIMITS.POOL_MAX_TTL_MS);
    expect(CONFIG_SCHEMA.header_left.type).toBe(FIELD_TYPES.OBJECT);
    expect(CONFIG_SCHEMA.header_left.properties.cards.type).toBe(FIELD_TYPES.ARRAY);
    expect(CONFIG_SCHEMA.cards).toBeUndefined();
    expect(CONFIG_SCHEMA.debug).toBeUndefined();
    expect(CONFIG_SCHEMA.state_styles_entity).toBeUndefined();
    expect(CONFIG_SCHEMA.remember_expanded_state.type).toBe(FIELD_TYPES.BOOLEAN);
  });

  it('migrates legacy root cards alias before editor validation', () => {
    const validator = new ConfigValidator();
    const result = validator.validate({
      cards: [{}]
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((issue) => issue.path === 'body.cards[0]' && /Card must have a type/.test(issue.message))).toBe(true);
    expect(result.warnings.some((issue) => issue.path === 'config_version' && /v1.*v2/.test(issue.message))).toBe(true);
    expect(result.suggestions.some((issue) => issue.path === 'cards' && /Moved legacy root cards/.test(issue.message))).toBe(true);
  });

  it('validates header slot cards from the shared contract', () => {
    const validator = new ConfigValidator();
    const result = validator.validate({
      header_left: { cards: [{}] }
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((issue) => issue.path === 'header_left.cards[0]' && /Card must have a type/.test(issue.message))).toBe(true);
  });

  it('migrates legacy swipe aliases before editor validation and still validates migrated badge contract', () => {
    const validator = new ConfigValidator();

    const removedSwipeAlias = validator.validate({
      swipe: {
        swipe_left: { action: 'next' }
      }
    });

    expect(removedSwipeAlias.valid).toBe(true);
    expect(removedSwipeAlias.warnings.some((issue) => issue.path === 'config_version' && /v1.*v2/.test(issue.message))).toBe(true);
    expect(removedSwipeAlias.suggestions.some((issue) => issue.path === 'swipe.swipe_left' && /Renamed/.test(issue.message))).toBe(true);

    const invalidBadge = validator.validate({
      body: { cards: [] },
      badges: [
        {
          type: 'attribute',
          entity: 'sensor.temperature'
        }
      ]
    });

    expect(invalidBadge.valid).toBe(false);
    expect(invalidBadge.errors.some((issue) => issue.path === 'badges[0].attribute' && /require attribute/.test(issue.message))).toBe(true);
  });

  it('provides completions and docs for shared schema fields', () => {
    const validator = new ConfigValidator();
    const rootCompletions = validator.getCompletions();
    const gridCompletions = validator.getCompletions('grid');
    const docs = validator.getFieldDocumentation('header_left');

    expect(rootCompletions.some((item) => item.label === 'pool_max_entries')).toBe(true);
    expect(rootCompletions.some((item) => item.label === 'expand_trigger')).toBe(true);
    expect(gridCompletions.map((item) => item.label)).toEqual(expect.arrayContaining(['columns', 'gap']));
    expect(docs?.properties?.cards?.type).toBe(FIELD_TYPES.ARRAY);
  });
});
