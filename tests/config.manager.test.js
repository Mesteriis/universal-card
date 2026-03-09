import { describe, expect, it } from 'vitest';

import { ConfigManager, ConfigValidationError, CURRENT_CONFIG_VERSION } from '../src/core/config.js';
import { DEFAULTS, LIMITS } from '../src/core/constants.js';

describe('ConfigManager', () => {
  it('normalizes card config with pool defaults', () => {
    const normalized = ConfigManager.normalize({
      title: 'Card',
      body: { cards: [{ type: 'markdown', content: 'hello' }] }
    });

    expect(normalized.card_id).toMatch(/^uc-/);
    expect(normalized.pool_scope).toBe(DEFAULTS.pool_scope);
    expect(normalized.pool_ttl_ms).toBe(DEFAULTS.pool_ttl_ms);
    expect(normalized.pool_max_entries).toBe(DEFAULTS.pool_max_entries);
    expect(normalized.body.cards).toHaveLength(1);
  });

  it('supports custom pool policy values in normalize()', () => {
    const normalized = ConfigManager.normalize({
      card_id: 'my-card',
      body: { cards: [] },
      expand_trigger: 'hold',
      pool_scope: 'dashboard',
      pool_ttl_ms: 120000,
      pool_max_entries: 64,
      auto_collapse_after: 60,
      animation_duration: 450,
      expand_animation: 'fade',
      collapse_animation: 'scale',
      cards_animation: 'flip',
      cards_stagger: 80,
      cards_direction: 'wave',
      carousel_autoplay: true,
      carousel_interval: 8000
    });

    expect(normalized.card_id).toBe('my-card');
    expect(normalized.expand_trigger).toBe('hold');
    expect(normalized.pool_scope).toBe('dashboard');
    expect(normalized.pool_ttl_ms).toBe(120000);
    expect(normalized.pool_max_entries).toBe(64);
    expect(normalized.auto_collapse_after).toBe(60);
    expect(normalized.animation_duration).toBe(450);
    expect(normalized.expand_animation).toBe('fade');
    expect(normalized.collapse_animation).toBe('scale');
    expect(normalized.cards_animation).toBe('flip');
    expect(normalized.cards_stagger).toBe(80);
    expect(normalized.cards_direction).toBe('wave');
    expect(normalized.carousel_autoplay).toBe(true);
    expect(normalized.carousel_interval).toBe(8000);
  });

  it('normalizes and validates modal sizing config', () => {
    const normalized = ConfigManager.normalize({
      body_mode: 'modal',
      body: { cards: [] },
      icon_color: ' var(--accent-color) ',
      modal: {
        width: ' auto ',
        height: ' 32rem ',
        max_width: ' 72rem ',
        max_height: ' 90vh ',
        loading_strategy: 'preload',
        backdrop_blur: false
      }
    });

    expect(normalized.modal.width).toBe('auto');
    expect(normalized.modal.height).toBe('32rem');
    expect(normalized.modal.max_width).toBe('72rem');
    expect(normalized.modal.max_height).toBe('90vh');
    expect(normalized.modal.loading_strategy).toBe('preload');
    expect(normalized.modal.backdrop_blur).toBe(false);
    expect(normalized.icon_color).toBe('var(--accent-color)');

    expect(() => {
      ConfigManager.validate({
        body_mode: 'modal',
        body: { cards: [] },
        modal: {
          height: 420
        }
      });
    }).toThrow(/modal\.height/);

    expect(() => {
      ConfigManager.validate({
        body_mode: 'modal',
        body: { cards: [] },
        modal: {
          loading_strategy: 'eager'
        }
      });
    }).toThrow(/modal\.loading_strategy/);

    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        icon_color: 42
      });
    }).toThrow(/icon_color/);
  });

  it('accepts grid template columns as string', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        grid: { columns: '1fr 2fr auto' }
      });
    }).not.toThrow();
  });

  it('rejects invalid pool_scope', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        pool_scope: 'room'
      });
    }).toThrow(ConfigValidationError);
  });

  it('rejects too small pool_ttl_ms', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        pool_ttl_ms: LIMITS.POOL_MIN_TTL_MS - 1
      });
    }).toThrow(/pool_ttl_ms/);
  });

  it('rejects too large pool_max_entries', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        pool_max_entries: LIMITS.POOL_MAX_MAX_ENTRIES + 1
      });
    }).toThrow(/pool_max_entries/);
  });

  it('rejects invalid runtime behavior enums and thresholds', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        expand_trigger: 'press'
      });
    }).toThrow(/expand_trigger/);

    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        carousel_interval: LIMITS.CAROUSEL_MIN_INTERVAL_MS - 1
      });
    }).toThrow(/carousel_interval/);

    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        cards_stagger: LIMITS.CARDS_STAGGER_MAX_MS + 1
      });
    }).toThrow(/cards_stagger/);
  });

  it('rejects legacy root-level cards alias', () => {
    expect(() => {
      ConfigManager.validate({
        cards: [{ type: 'entities', entities: [] }]
      });
    }).toThrow(/Use body\.cards instead/);
  });

  it('migrates legacy config shapes to the current contract version', () => {
    const migration = ConfigManager.migrate({
      cards: [{ type: 'markdown', content: 'legacy' }],
      remember_state: true,
      state_styles_entity: 'sensor.temperature',
      debug: true,
      header: {
        left: [{ type: 'state-icon', entity: 'light.kitchen' }],
        right: [{ type: 'state-badge', entity: 'sensor.temperature' }]
      },
      carousel: {
        autoplay: true,
        interval: 9000,
        show_arrows: false
      },
      swipe: {
        swipe_left: { action: 'next' }
      },
      badges: [
        { text: 'Online', color: 'green' }
      ]
    });

    expect(migration.fromVersion).toBe(1);
    expect(migration.toVersion).toBe(CURRENT_CONFIG_VERSION);
    expect(migration.changed).toBe(true);
    expect(migration.config.body.cards).toHaveLength(1);
    expect(migration.config.remember_expanded_state).toBe(true);
    expect(migration.config.entity).toBe('sensor.temperature');
    expect(migration.config.header_left.cards).toHaveLength(1);
    expect(migration.config.header_right.cards).toHaveLength(1);
    expect(migration.config.carousel_autoplay).toBe(true);
    expect(migration.config.carousel_interval).toBe(9000);
    expect(migration.config.carousel).toBeUndefined();
    expect(migration.config.swipe.left.action).toBe('next');
    expect(migration.config.badges[0].value).toBe('Online');
    expect(migration.config.debug).toBeUndefined();
    expect(migration.config.config_version).toBe(CURRENT_CONFIG_VERSION);
  });

  it('rejects legacy remember_state field', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        remember_state: true
      });
    }).toThrow(/remember_expanded_state/);
  });

  it('rejects explicit outdated config_version in strict validation', () => {
    expect(() => {
      ConfigManager.validate({
        config_version: 1,
        body: { cards: [] }
      });
    }).toThrow(/outdated/);
  });

  it('rejects removed state_styles_entity field', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        state_styles_entity: 'sensor.temp'
      });
    }).toThrow(/root entity and optional attribute/);
  });

  it('validates shared swipe and badge contracts', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        swipe: {
          enabled: true,
          direction: 'both',
          threshold: 36,
          velocityThreshold: 0.45,
          preventScroll: true,
          left: { action: 'next' },
          right: { action: 'prev' }
        },
        badges: [
          {
            type: 'attribute',
            entity: 'sensor.temperature',
            attribute: 'temperature',
            precision: 1,
            icon_only: true,
            show_progress: true,
            min: 0,
            max: 100,
            thresholds: [{ value: 30, color: '#f44336' }],
            visibility: [{ operator: '>=', value: 20 }],
            color_rules: [{ operator: '==', value: 20, color: '#ff9800' }],
            icon_tap_action: { action: 'more-info' }
          },
          {
            type: 'counter',
            domain: 'light',
            count_state: 'on'
          }
        ]
      });
    }).not.toThrow();
  });

  it('rejects removed swipe aliases and legacy badge text', () => {
    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        swipe: {
          swipe_left: { action: 'next' }
        }
      });
    }).toThrow(/swipe\.left/);

    expect(() => {
      ConfigManager.validate({
        body: { cards: [] },
        badges: [
          { text: 'Online' }
        ]
      });
    }).toThrow(/badges\[\]\.value or badges\[\]\.label/);
  });

  it('validates nested visibility conditions and state_styles against runtime contract', () => {
    expect(() => {
      ConfigManager.validate({
        entity: 'sensor.temperature',
        attribute: 'temperature',
        visibility: [
          {
            condition: 'and',
            conditions: [
              {
                condition: 'state',
                entity: 'binary_sensor.window',
                state_not: ['off', 'unknown']
              },
              {
                condition: 'numeric_state',
                entity: 'sensor.temperature',
                above: 18,
                below: 30
              }
            ]
          }
        ],
        state_styles: {
          '>25': { background: 'rgba(255,0,0,0.2)', class: ['is-hot'] },
          default: { color: '#4caf50' }
        }
      });
    }).not.toThrow();
  });

  it('rejects invalid nested visibility groups and state_styles without root entity', () => {
    expect(() => {
      ConfigManager.validate({
        visibility: [
          {
            condition: 'and',
            conditions: []
          }
        ]
      });
    }).toThrow(/conditions/);

    expect(() => {
      ConfigManager.validate({
        state_styles: {
          on: { color: '#fff' }
        }
      });
    }).toThrow(/state_styles requires root entity/);
  });

  it('exposes pool policy fields in editor schema', () => {
    const schema = ConfigManager.getSchema();
    const props = schema.properties;

    expect(props.expand_trigger.default).toBe(DEFAULTS.expand_trigger);
    expect(props.animation_duration.maximum).toBe(LIMITS.ANIMATION_DURATION_MAX_MS);
    expect(props.auto_collapse_after.maximum).toBe(LIMITS.AUTO_COLLAPSE_MAX_SECONDS);
    expect(props.pool_scope.default).toBe(DEFAULTS.pool_scope);
    expect(props.pool_ttl_ms.minimum).toBe(LIMITS.POOL_MIN_TTL_MS);
    expect(props.pool_ttl_ms.maximum).toBe(LIMITS.POOL_MAX_TTL_MS);
    expect(props.pool_max_entries.minimum).toBe(LIMITS.POOL_MIN_MAX_ENTRIES);
    expect(props.pool_max_entries.maximum).toBe(LIMITS.POOL_MAX_MAX_ENTRIES);
    expect(props.carousel_interval.maximum).toBe(LIMITS.CAROUSEL_MAX_INTERVAL_MS);
    expect(props.attribute.type).toBe('string');
    expect(props.icon_color.type).toBe('string');
    expect(props.modal.properties.height.default).toBe(DEFAULTS.modal_height);
    expect(props.modal.properties.max_height.default).toBe(DEFAULTS.modal_max_height);
    expect(props.modal.properties.loading_strategy.default).toBe(DEFAULTS.modal_loading_strategy);
    expect(props.visibility.items.properties.conditions.items).toBe(props.visibility.items);
    expect(props.state_styles.type).toBe('object');
    expect(props.swipe.properties.left.properties.action.enum).toContain('next');
    expect(props.badges.items.properties.type.enum).toContain('counter');
    expect(props.badges.items.properties.thresholds.items.properties.color.type).toBe('string');
    expect(props.badges.items.properties.visibility.items.properties.operator.enum).toContain('>=');
    expect(props.badges.items.properties.color_rules.items.properties.color.type).toBe('string');
  });

  it('normalizes nested conditions and state style classes', () => {
    const normalized = ConfigManager.normalize({
      entity: 'sensor.temperature',
      attribute: ' temperature ',
      visibility: [
        {
          condition: 'and',
          conditions: [
            {
              condition: 'state',
              entity: 'binary_sensor.window',
              state: ['on', ' open ']
            }
          ]
        }
      ],
      state_styles: {
        ' >25 ': {
          background: ' rgba(255,0,0,0.2) ',
          class: [' hot ', ' alert ']
        }
      }
    });

    expect(normalized.attribute).toBe('temperature');
    expect(normalized.visibility[0].conditions[0].state).toEqual(['on', 'open']);
    expect(normalized.state_styles['>25'].class).toEqual(['hot', 'alert']);
    expect(normalized.state_styles['>25'].background).toBe('rgba(255,0,0,0.2)');
  });

  it('normalize() auto-migrates legacy config and stamps current version', () => {
    const normalized = ConfigManager.normalize({
      cards: [{ type: 'markdown', content: 'legacy' }],
      remember_state: true,
      state_styles_entity: 'sensor.temperature',
      swipe: {
        swipe_left: { action: 'next' }
      },
      badges: [
        { text: 'Online' }
      ]
    });

    expect(normalized.config_version).toBe(CURRENT_CONFIG_VERSION);
    expect(normalized.body.cards).toHaveLength(1);
    expect(normalized.remember_expanded_state).toBe(true);
    expect(normalized.entity).toBe('sensor.temperature');
    expect(normalized.swipe.left.action).toBe('next');
    expect(normalized.badges[0].value).toBe('Online');
  });

  it('normalizes swipe defaults and badge entity lists', () => {
    const normalized = ConfigManager.normalize({
      body: { cards: [] },
      swipe: {
        enabled: true,
        left: { action: 'next' }
      },
      badges: [
        {
          type: 'counter',
          entities: [' light.kitchen ', 'switch.hall ', '', 'light.kitchen'],
          visibility: [
            { operator: '==', value: 'on', entity: ' light.kitchen ' }
          ],
          color_rules: [
            { operator: '!=', value: 'off', color: ' #ff0 ' }
          ]
        }
      ]
    });

    expect(normalized.swipe.direction).toBe(DEFAULTS.swipe_direction);
    expect(normalized.swipe.threshold).toBe(DEFAULTS.swipe_threshold);
    expect(normalized.badges[0].entities).toEqual(['light.kitchen', 'switch.hall']);
    expect(normalized.badges[0].visibility).toEqual([
      { operator: '==', value: 'on', entity: 'light.kitchen' }
    ]);
    expect(normalized.badges[0].color_rules).toEqual([
      { operator: '!=', value: 'off', color: '#ff0' }
    ]);
  });

  it('hasChanged reflects deep changes', () => {
    const a = { body: { cards: [{ type: 'markdown', content: 'a' }] } };
    const b = { body: { cards: [{ type: 'markdown', content: 'a' }] } };
    const c = { body: { cards: [{ type: 'markdown', content: 'b' }] } };

    expect(ConfigManager.hasChanged(a, b)).toBe(false);
    expect(ConfigManager.hasChanged(a, c)).toBe(true);
  });
});
