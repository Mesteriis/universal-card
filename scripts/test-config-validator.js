#!/usr/bin/env node
/* eslint-disable no-console */

const assert = require('assert');
const path = require('path');
const vm = require('vm');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..');

async function loadConfigModule() {
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, 'src/core/config.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    target: ['node18']
  });

  const code = result.outputFiles[0].text;
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    __dirname: ROOT,
    __filename: path.join(ROOT, 'src/core/config.ts'),
    process,
    console,
    global,
    globalThis
  };

  vm.runInNewContext(code, sandbox, { filename: 'config.bundle.cjs' });
  return module.exports;
}

async function loadEditorValidatorModule() {
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, 'src/editor/ConfigValidator.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    target: ['node18']
  });

  const code = result.outputFiles[0].text;
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    __dirname: ROOT,
    __filename: path.join(ROOT, 'src/editor/ConfigValidator.ts'),
    process,
    console,
    global,
    globalThis
  };

  vm.runInNewContext(code, sandbox, { filename: 'config-validator.bundle.cjs' });
  return module.exports;
}

async function loadEditorContractModule() {
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, 'src/editor/EditorContract.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    target: ['node18']
  });

  const code = result.outputFiles[0].text;
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    __dirname: ROOT,
    __filename: path.join(ROOT, 'src/editor/EditorContract.ts'),
    process,
    console,
    global,
    globalThis
  };

  vm.runInNewContext(code, sandbox, { filename: 'editor-contract.bundle.cjs' });
  return module.exports;
}

function runTests(ConfigManager, ConfigValidationError, CURRENT_CONFIG_VERSION) {
  // Valid configuration should pass normalization with new optimization options.
  const normalized = ConfigManager.normalize({
    title: 'Perf',
    body_mode: 'expand',
    expand_trigger: 'hold',
    body: { cards: [{ type: 'markdown', content: 'ok' }] },
    lazy_initial_batch: 3,
    lazy_batch_size: 2,
    lazy_idle_timeout: 500,
    auto_collapse_after: 30,
    remember_expanded_state: true,
    remember_mode_state: true,
    enable_card_pool: true,
    pool_scope: 'dashboard',
    pool_ttl_ms: 120000,
    pool_max_entries: 48,
    animation_duration: 450,
    expand_animation: 'fade',
    collapse_animation: 'scale',
    cards_animation: 'flip',
    cards_stagger: 80,
    cards_direction: 'wave',
    carousel_autoplay: true,
    carousel_interval: 8000
  });

  assert.equal(normalized.expand_trigger, 'hold');
  assert.equal(normalized.lazy_initial_batch, 3);
  assert.equal(normalized.lazy_batch_size, 2);
  assert.equal(normalized.lazy_idle_timeout, 500);
  assert.equal(normalized.auto_collapse_after, 30);
  assert.equal(normalized.remember_expanded_state, true);
  assert.equal(normalized.remember_mode_state, true);
  assert.equal(normalized.enable_card_pool, true);
  assert.equal(normalized.pool_scope, 'dashboard');
  assert.equal(normalized.pool_ttl_ms, 120000);
  assert.equal(normalized.pool_max_entries, 48);
  assert.equal(normalized.animation_duration, 450);
  assert.equal(normalized.expand_animation, 'fade');
  assert.equal(normalized.collapse_animation, 'scale');
  assert.equal(normalized.cards_animation, 'flip');
  assert.equal(normalized.cards_stagger, 80);
  assert.equal(normalized.cards_direction, 'wave');
  assert.equal(normalized.carousel_autoplay, true);
  assert.equal(normalized.carousel_interval, 8000);

  const conditionalNormalized = ConfigManager.normalize({
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
        background: ' rgba(255, 0, 0, 0.2) ',
        class: [' hot ', ' alert ']
      }
    }
  });

  assert.equal(conditionalNormalized.attribute, 'temperature');
  assert.deepEqual(conditionalNormalized.visibility[0].conditions[0].state, ['on', 'open']);
  assert.equal(conditionalNormalized.state_styles['>25'].background, 'rgba(255, 0, 0, 0.2)');
  assert.deepEqual(conditionalNormalized.state_styles['>25'].class, ['hot', 'alert']);

  const stabilityNormalized = ConfigManager.normalize({
    title: 'Safe Mode',
    body: { cards: [{ type: 'markdown', content: 'safe' }] },
    stability_mode: true,
    enable_card_pool: true,
    carousel_autoplay: true,
    animation_duration: 300
  });

  assert.equal(stabilityNormalized.stability_mode, true);
  assert.equal(stabilityNormalized.enable_card_pool, false);
  assert.equal(stabilityNormalized.carousel_autoplay, false);
  assert.equal(stabilityNormalized.expand_animation, 'none');
  assert.equal(stabilityNormalized.collapse_animation, 'none');
  assert.equal(stabilityNormalized.cards_animation, 'none');
  assert.equal(stabilityNormalized.animation_duration, 0);

  const customCssNormalized = ConfigManager.normalize({
    title: 'Custom CSS',
    body: { cards: [{ type: 'markdown', content: 'css' }] },
    custom_css: {
      card: '.headline { color: red; }'
    }
  });

  assert.deepEqual(customCssNormalized.custom_css, {
    card: '.headline { color: red; }'
  });

  // Invalid lazy batch should fail validation.
  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, lazy_batch_size: 0 }),
    (error) => error instanceof ConfigValidationError && /lazy_batch_size/.test(error.message)
  );

  // remember_mode_state must be boolean.
  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, remember_mode_state: 'yes' }),
    (error) => error instanceof ConfigValidationError && /remember_mode_state/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, remember_state: true }),
    (error) => error instanceof ConfigValidationError && /remember_expanded_state/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ config_version: 1, body: { cards: [] } }),
    (error) => error instanceof ConfigValidationError && /outdated/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, state_styles_entity: 'sensor.temp' }),
    (error) => error instanceof ConfigValidationError && /root entity and optional attribute/.test(error.message)
  );

  assert.doesNotThrow(() => ConfigManager.validate({
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
        show_progress: true,
        min: 0,
        max: 100,
        thresholds: [{ value: 30, color: '#f44336' }]
      },
      {
        type: 'counter',
        domain: 'light',
        count_state: 'on'
      }
    ]
  }));

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, swipe: { swipe_left: { action: 'next' } } }),
    (error) => error instanceof ConfigValidationError && /swipe\.left/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, badges: [{ text: 'Online' }] }),
    (error) => error instanceof ConfigValidationError && /badges\[\]\.value or badges\[\]\.label/.test(error.message)
  );

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

  assert.equal(migration.fromVersion, 1);
  assert.equal(migration.toVersion, CURRENT_CONFIG_VERSION);
  assert.equal(migration.changed, true);
  assert.equal(Array.isArray(migration.config.body.cards), true);
  assert.equal(migration.config.remember_expanded_state, true);
  assert.equal(migration.config.entity, 'sensor.temperature');
  assert.equal(Array.isArray(migration.config.header_left.cards), true);
  assert.equal(Array.isArray(migration.config.header_right.cards), true);
  assert.equal(migration.config.carousel_autoplay, true);
  assert.equal(migration.config.carousel_interval, 9000);
  assert.equal(migration.config.carousel, undefined);
  assert.equal(migration.config.swipe.left.action, 'next');
  assert.equal(migration.config.badges[0].value, 'Online');
  assert.equal(migration.config.debug, undefined);
  assert.equal(migration.config.config_version, CURRENT_CONFIG_VERSION);

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, stability_mode: 'yes' }),
    (error) => error instanceof ConfigValidationError && /stability_mode/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, custom_css: 42 }),
    (error) => error instanceof ConfigValidationError && /custom_css/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, custom_css: { card: 42 } }),
    (error) => error instanceof ConfigValidationError && /custom_css/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, expand_trigger: 'press' }),
    (error) => error instanceof ConfigValidationError && /expand_trigger/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, carousel_interval: 500 }),
    (error) => error instanceof ConfigValidationError && /carousel_interval/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, cards_stagger: 500 }),
    (error) => error instanceof ConfigValidationError && /cards_stagger/.test(error.message)
  );

  // pool_scope must be valid enum.
  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, pool_scope: 'room' }),
    (error) => error instanceof ConfigValidationError && /pool_scope/.test(error.message)
  );

  // pool_ttl_ms must be within limits.
  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, pool_ttl_ms: 10 }),
    (error) => error instanceof ConfigValidationError && /pool_ttl_ms/.test(error.message)
  );

  // pool_max_entries must be within limits.
  assert.throws(
    () => ConfigManager.validate({ body: { cards: [] }, pool_max_entries: 0 }),
    (error) => error instanceof ConfigValidationError && /pool_max_entries/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({
      visibility: [{ condition: 'and', conditions: [] }]
    }),
    (error) => error instanceof ConfigValidationError && /conditions/.test(error.message)
  );

  assert.throws(
    () => ConfigManager.validate({
      state_styles: { on: { color: '#fff' } }
    }),
    (error) => error instanceof ConfigValidationError && /state_styles requires root entity/.test(error.message)
  );

  const contractNormalized = ConfigManager.normalize({
    body: { cards: [] },
    swipe: {
      enabled: true,
      left: { action: 'next' }
    },
    badges: [
      {
        type: 'counter',
        entities: [' light.kitchen ', 'switch.hall ', '', 'light.kitchen']
      }
    ]
  });

  assert.equal(contractNormalized.swipe.direction, 'horizontal');
  assert.equal(contractNormalized.swipe.threshold, 50);
  assert.deepEqual(contractNormalized.badges[0].entities, ['light.kitchen', 'switch.hall']);

  const legacyNormalized = ConfigManager.normalize({
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

  assert.equal(legacyNormalized.config_version, CURRENT_CONFIG_VERSION);
  assert.equal(Array.isArray(legacyNormalized.body.cards), true);
  assert.equal(legacyNormalized.remember_expanded_state, true);
  assert.equal(legacyNormalized.entity, 'sensor.temperature');
  assert.equal(legacyNormalized.swipe.left.action, 'next');
  assert.equal(legacyNormalized.badges[0].value, 'Online');
}

function runEditorValidatorTests(ConfigValidator, CONFIG_SCHEMA, FIELD_TYPES, CURRENT_CONFIG_VERSION) {
  assert.equal(CONFIG_SCHEMA.config_version.type, FIELD_TYPES.NUMBER);
  assert.equal(CONFIG_SCHEMA.config_version.default, CURRENT_CONFIG_VERSION);
  assert.equal(CONFIG_SCHEMA.pool_scope.type, FIELD_TYPES.SELECT);
  assert.equal(CONFIG_SCHEMA.pool_ttl_ms.min, 1000);
  assert.equal(CONFIG_SCHEMA.header_left.type, FIELD_TYPES.OBJECT);
  assert.equal(CONFIG_SCHEMA.header_left.properties.cards.type, FIELD_TYPES.ARRAY);
  assert.equal(CONFIG_SCHEMA.cards, undefined);
  assert.equal(CONFIG_SCHEMA.remember_expanded_state.type, FIELD_TYPES.BOOLEAN);
  assert.equal(CONFIG_SCHEMA.expand_trigger.type, FIELD_TYPES.SELECT);
  assert.equal(CONFIG_SCHEMA.animation_duration.type, FIELD_TYPES.NUMBER);
  assert.equal(CONFIG_SCHEMA.carousel_interval.max, 60000);
  assert.equal(CONFIG_SCHEMA.attribute.type, FIELD_TYPES.STRING);
  assert.equal(CONFIG_SCHEMA.state_styles.type, FIELD_TYPES.OBJECT);
  assert.equal(CONFIG_SCHEMA.swipe.type, FIELD_TYPES.OBJECT);
  assert.equal(CONFIG_SCHEMA.swipe.properties.left.properties.action.type, FIELD_TYPES.SELECT);
  assert.equal(CONFIG_SCHEMA.badges.type, FIELD_TYPES.ARRAY);
  assert.equal(CONFIG_SCHEMA.badges.items.properties.type.options.includes('counter'), true);
  assert.equal(CONFIG_SCHEMA.badges.items.properties.thresholds.type, FIELD_TYPES.ARRAY);
  assert.equal(CONFIG_SCHEMA.debug, undefined);
  assert.equal(CONFIG_SCHEMA.state_styles_entity, undefined);

  const validator = new ConfigValidator();

  const rootCards = validator.validate({
    cards: [{}]
  });
  assert.equal(rootCards.valid, false);
  assert.equal(
    rootCards.errors.some((issue) => issue.path === 'body.cards[0]' && /Card must have a type/.test(issue.message)),
    true
  );
  assert.equal(
    rootCards.warnings.some((issue) => issue.path === 'config_version' && /v1.*v2/.test(issue.message)),
    true
  );
  assert.equal(
    rootCards.suggestions.some((issue) => issue.path === 'cards' && /Moved legacy root cards/.test(issue.message)),
    true
  );

  const headerSlots = validator.validate({
    header_left: { cards: [{}] }
  });
  assert.equal(headerSlots.valid, false);
  assert.equal(
    headerSlots.errors.some((issue) => issue.path === 'header_left.cards[0]' && /Card must have a type/.test(issue.message)),
    true
  );

  const removedSwipeAlias = validator.validate({
    swipe: {
      swipe_left: { action: 'next' }
    }
  });
  assert.equal(removedSwipeAlias.valid, true);
  assert.equal(
    removedSwipeAlias.warnings.some((issue) => issue.path === 'config_version' && /v1.*v2/.test(issue.message)),
    true
  );
  assert.equal(
    removedSwipeAlias.suggestions.some((issue) => issue.path === 'swipe.swipe_left' && /Renamed/.test(issue.message)),
    true
  );

  const invalidBadge = validator.validate({
    body: { cards: [] },
    badges: [
      {
        type: 'attribute',
        entity: 'sensor.temperature'
      }
    ]
  });
  assert.equal(invalidBadge.valid, false);
  assert.equal(
    invalidBadge.errors.some((issue) => issue.path === 'badges[0].attribute' && /require attribute/.test(issue.message)),
    true
  );

  const rootCompletions = validator.getCompletions();
  const gridCompletions = validator.getCompletions('grid');
  const headerLeftDocs = validator.getFieldDocumentation('header_left');

  assert.equal(rootCompletions.some((item) => item.label === 'pool_max_entries'), true);
  assert.deepEqual(
    gridCompletions.map((item) => item.label).sort(),
    ['columns', 'gap']
  );
  assert.equal(headerLeftDocs.properties.cards.type, FIELD_TYPES.ARRAY);
}

function runEditorContractTests(
  getEditorFieldDescriptor,
  getEditorFieldOptions,
  getSwipeFieldDescriptors,
  getSwipeActionFieldDescriptors,
  getBadgeFieldDescriptors,
  getBadgeThresholdFieldDescriptors,
  getVisibilityConditionTypeOptions,
  getVisibilityConditionFieldDescriptors,
  getStateStyleFieldDescriptors,
  isLogicalConditionType,
  EDITOR_FIELD_GROUPS
) {
  const poolScopeField = getEditorFieldDescriptor('pool_scope');
  const gridColumnsField = getEditorFieldDescriptor('grid.columns');
  const cardIdField = getEditorFieldDescriptor('card_id');
  const expandTriggerOptions = getEditorFieldOptions('expand_trigger');
  const actionOptions = getEditorFieldOptions('tap_action.action');
  const swipeFields = getSwipeFieldDescriptors();
  const swipeActions = getSwipeActionFieldDescriptors();
  const counterBadgeFields = getBadgeFieldDescriptors('counter');
  const customBadgeFields = getBadgeFieldDescriptors('custom');
  const badgeThresholdFields = getBadgeThresholdFieldDescriptors();
  const conditionTypeOptions = getVisibilityConditionTypeOptions();
  const conditionFields = getVisibilityConditionFieldDescriptors('state');
  const stateStyleFields = getStateStyleFieldDescriptors();

  assert.equal(Array.isArray(EDITOR_FIELD_GROUPS.runtime), true);
  assert.equal(EDITOR_FIELD_GROUPS.runtime.includes('pool_scope'), true);
  assert.equal(poolScopeField.control, 'select');
  assert.equal(poolScopeField.options.some((option) => option.value === 'dashboard'), true);
  assert.equal(gridColumnsField.control, 'number');
  assert.equal(cardIdField.label, 'ID карточки');
  assert.equal(expandTriggerOptions.some((option) => option.value === 'tap' && option.icon === 'mdi:gesture-tap'), true);
  assert.equal(actionOptions.some((option) => option.value === 'call-service' && option.label === 'Вызвать сервис'), true);
  assert.equal(conditionTypeOptions.some((option) => option.value === 'and'), true);
  assert.equal(conditionFields.some((field) => field.key === 'attribute'), true);
  assert.deepEqual(
    swipeFields.map((field) => field.path),
    ['swipe.enabled', 'swipe.direction', 'swipe.threshold', 'swipe.velocityThreshold', 'swipe.preventScroll']
  );
  assert.equal(
    swipeActions.some((field) => field.path === 'swipe.left.action' && field.options.some((option) => option.value === 'next')),
    true
  );
  assert.equal(counterBadgeFields.some((field) => field.path === 'badges.domain'), true);
  assert.equal(counterBadgeFields.some((field) => field.path === 'badges.entities'), true);
  assert.equal(customBadgeFields.some((field) => field.path === 'badges.value'), true);
  assert.equal(customBadgeFields.some((field) => field.path === 'badges.entity'), false);
  assert.deepEqual(
    badgeThresholdFields.map((field) => field.path),
    ['badges.thresholds.value', 'badges.thresholds.color']
  );
  assert.deepEqual(
    stateStyleFields.map((field) => field.key),
    ['background', 'color', 'border', 'class']
  );
  assert.equal(isLogicalConditionType('or'), true);
  assert.equal(getEditorFieldDescriptor('debug'), null);
}

async function main() {
  const { ConfigManager, ConfigValidationError, CURRENT_CONFIG_VERSION } = await loadConfigModule();
  const { ConfigValidator, CONFIG_SCHEMA, FIELD_TYPES } = await loadEditorValidatorModule();
  const {
    getEditorFieldDescriptor,
    getEditorFieldOptions,
    getSwipeFieldDescriptors,
    getSwipeActionFieldDescriptors,
    getBadgeFieldDescriptors,
    getBadgeThresholdFieldDescriptors,
    getVisibilityConditionTypeOptions,
    getVisibilityConditionFieldDescriptors,
    getStateStyleFieldDescriptors,
    isLogicalConditionType,
    EDITOR_FIELD_GROUPS
  } = await loadEditorContractModule();
  runTests(ConfigManager, ConfigValidationError, CURRENT_CONFIG_VERSION);
  runEditorValidatorTests(ConfigValidator, CONFIG_SCHEMA, FIELD_TYPES, CURRENT_CONFIG_VERSION);
  runEditorContractTests(
    getEditorFieldDescriptor,
    getEditorFieldOptions,
    getSwipeFieldDescriptors,
    getSwipeActionFieldDescriptors,
    getBadgeFieldDescriptors,
    getBadgeThresholdFieldDescriptors,
    getVisibilityConditionTypeOptions,
    getVisibilityConditionFieldDescriptors,
    getStateStyleFieldDescriptors,
    isLogicalConditionType,
    EDITOR_FIELD_GROUPS
  );
  console.log('[test:config] OK');
}

main().catch((error) => {
  console.error('[test:config] FAILED');
  console.error(error);
  process.exit(1);
});
