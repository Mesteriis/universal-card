// @ts-check
/**
 * Universal Card - Configuration Manager
 * 
 * Handles configuration validation, normalization, and defaults.
 * Following Single Responsibility Principle (SRP).
 * 
 * @module core/config
 */

import { 
  DEFAULTS, 
  BODY_MODES, 
  VALID_BODY_MODES,
  VALID_EXPAND_TRIGGERS,
  VALID_POOL_SCOPES,
  VALID_EXPAND_ANIMATIONS,
  VALID_COLLAPSE_ANIMATIONS,
  VALID_CARD_ANIMATIONS,
  VALID_CARD_DIRECTIONS,
  THEMES,
  ACTION_TYPES,
  CONDITION_TYPES,
  VALID_CONDITION_TYPES,
  VALID_WEEKDAYS,
  BADGE_TYPES,
  VALID_BADGE_TYPES,
  BADGE_OPERATORS,
  VALID_BADGE_OPERATORS,
  BADGE_FORMATS,
  VALID_BADGE_FORMATS,
  SWIPE_DIRECTIONS,
  VALID_SWIPE_DIRECTIONS,
  VALID_SWIPE_ACTIONS,
  LIMITS
} from './constants.js';

import { 
  isObject, 
  isNonEmptyString, 
  isNumber, 
  deepMerge, 
  generateId,
  isValidEntityId 
} from '../utils/helpers.js';
import {
  CURRENT_CONFIG_VERSION,
  LEGACY_CONFIG_VERSION,
  detectConfigVersion,
  migrateConfig,
  type ConfigMigrationResult
} from './config-migrations.js';

export { CURRENT_CONFIG_VERSION, LEGACY_CONFIG_VERSION } from './config-migrations.js';

// =============================================================================
// VALIDATION ERRORS
// =============================================================================

/**
 * Custom error for configuration validation
 */
export class ConfigValidationError extends Error {
  path?: string;

  /**
   * @param {string} message - Error message
   * @param {string} [path] - Config path where error occurred
   */
  constructor(message: string, path?: string) {
    super(path ? `${path}: ${message}` : message);
    this.name = 'ConfigValidationError';
    this.path = path;
  }
}

// =============================================================================
// CONFIG MANAGER
// =============================================================================

/**
 * Configuration Manager
 * Static class for handling all configuration operations
 * 
 * @class ConfigManager
 */
export class ConfigManager {
  static getCurrentConfigVersion() {
    return CURRENT_CONFIG_VERSION;
  }

  /**
   * Migrate a config to the current contract version.
   *
   * @param {*} config
   * @returns {ConfigMigrationResult}
   */
  static migrate(config): ConfigMigrationResult {
    if (!isObject(config)) {
      throw new ConfigValidationError('Configuration must be an object');
    }

    if (config.config_version !== undefined) {
      if (!Number.isInteger(config.config_version) || config.config_version < 1) {
        throw new ConfigValidationError(
          'config_version must be a positive integer',
          'config_version'
        );
      }

      if (config.config_version > CURRENT_CONFIG_VERSION) {
        throw new ConfigValidationError(
          `config_version ${config.config_version} is newer than this runtime. Current supported version is ${CURRENT_CONFIG_VERSION}.`,
          'config_version'
        );
      }
    }

    return migrateConfig(config);
  }
  
  // ===========================================================================
  // VALIDATION
  // ===========================================================================
  
  /**
   * Validate raw configuration
   * 
   * @param {*} config - Raw configuration
   * @throws {ConfigValidationError} If configuration is invalid
   * @static
   */
  static validate(config) {
    this._validateCurrentConfig(config);
  }

  /**
   * Validate current-version configuration only.
   *
   * @param {*} config
   * @throws {ConfigValidationError}
   * @private
   */
  static _validateCurrentConfig(config) {
    // Must be an object
    if (!isObject(config)) {
      throw new ConfigValidationError('Configuration must be an object');
    }

    if (config.config_version !== undefined) {
      if (!Number.isInteger(config.config_version) || config.config_version < 1) {
        throw new ConfigValidationError(
          'config_version must be a positive integer',
          'config_version'
        );
      }

      if (config.config_version < CURRENT_CONFIG_VERSION) {
        throw new ConfigValidationError(
          `config_version ${config.config_version} is outdated. Migrate to version ${CURRENT_CONFIG_VERSION} before strict validation.`,
          'config_version'
        );
      }

      if (config.config_version > CURRENT_CONFIG_VERSION) {
        throw new ConfigValidationError(
          `config_version ${config.config_version} is newer than this runtime. Current supported version is ${CURRENT_CONFIG_VERSION}.`,
          'config_version'
        );
      }
    }
    
    // Validate body_mode
    if (config.body_mode && !VALID_BODY_MODES.includes(config.body_mode)) {
      throw new ConfigValidationError(
        `Invalid body_mode: "${config.body_mode}". ` +
        `Valid modes: ${VALID_BODY_MODES.join(', ')}`,
        'body_mode'
      );
    }
    
    // Validate theme
    const validThemes = Object.values(THEMES);
    if (config.theme && !validThemes.includes(config.theme)) {
      throw new ConfigValidationError(
        `Invalid theme: "${config.theme}". Valid themes: ${validThemes.join(', ')}`,
        'theme'
      );
    }
    
    // Validate entity if provided
    if (config.entity && !isValidEntityId(config.entity)) {
      throw new ConfigValidationError(
        `Invalid entity format: "${config.entity}"`,
        'entity'
      );
    }

    if (config.attribute !== undefined && !isNonEmptyString(config.attribute)) {
      throw new ConfigValidationError(
        'attribute must be a non-empty string',
        'attribute'
      );
    }

    if (config.cards !== undefined) {
      throw new ConfigValidationError(
        'Root-level cards were removed. Use body.cards instead.',
        'cards'
      );
    }

    if (config.remember_state !== undefined) {
      throw new ConfigValidationError(
        'remember_state was removed. Use remember_expanded_state instead.',
        'remember_state'
      );
    }

    if (config.debug !== undefined) {
      throw new ConfigValidationError(
        'debug was removed from the config contract. Use devtools instead.',
        'debug'
      );
    }

    if (config.state_styles_entity !== undefined) {
      throw new ConfigValidationError(
        'state_styles_entity was removed. Use root entity and optional attribute instead.',
        'state_styles_entity'
      );
    }

    if (isObject(config.header) && (config.header.left !== undefined || config.header.right !== undefined)) {
      throw new ConfigValidationError(
        'Legacy header.left/header.right were removed. Use root header_left/header_right sections.',
        'header'
      );
    }

    if (config.carousel !== undefined) {
      throw new ConfigValidationError(
        'Legacy carousel object was removed. Use root carousel_autoplay and carousel_interval fields.',
        'carousel'
      );
    }

    if (config.expand_trigger !== undefined) {
      if (typeof config.expand_trigger !== 'string' || !VALID_EXPAND_TRIGGERS.includes(config.expand_trigger)) {
        throw new ConfigValidationError(
          `expand_trigger must be one of: ${VALID_EXPAND_TRIGGERS.join(', ')}`,
          'expand_trigger'
        );
      }
    }
    
    // Validate grid columns (number or string like "1fr 2fr 1fr")
    if (config.grid && config.grid.columns !== undefined) {
      const cols = config.grid.columns;
      // Accept strings (CSS grid template) or numbers within limits
      if (typeof cols === 'number') {
        if (cols < LIMITS.MIN_GRID_COLUMNS || cols > LIMITS.MAX_GRID_COLUMNS) {
          throw new ConfigValidationError(
            'Grid columns must be between ' + LIMITS.MIN_GRID_COLUMNS + ' and ' + LIMITS.MAX_GRID_COLUMNS,
            'grid.columns'
          );
        }
      } else if (typeof cols !== 'string') {
        throw new ConfigValidationError(
          'Grid columns must be a number or CSS template string',
          'grid.columns'
        );
      }
    }

    if (config.modal !== undefined) {
      this._validateModal(config.modal, 'modal');
    }

    // Validate lazy-load chunk tuning
    if (config.lazy_initial_batch !== undefined) {
      if (!isNumber(config.lazy_initial_batch)) {
        throw new ConfigValidationError(
          'lazy_initial_batch must be a number',
          'lazy_initial_batch'
        );
      }
      if (config.lazy_initial_batch < LIMITS.LAZY_MIN_BATCH || config.lazy_initial_batch > LIMITS.LAZY_MAX_BATCH) {
        throw new ConfigValidationError(
          `lazy_initial_batch must be between ${LIMITS.LAZY_MIN_BATCH} and ${LIMITS.LAZY_MAX_BATCH}`,
          'lazy_initial_batch'
        );
      }
    }

    if (config.lazy_batch_size !== undefined) {
      if (!isNumber(config.lazy_batch_size)) {
        throw new ConfigValidationError(
          'lazy_batch_size must be a number',
          'lazy_batch_size'
        );
      }
      if (config.lazy_batch_size < LIMITS.LAZY_MIN_BATCH || config.lazy_batch_size > LIMITS.LAZY_MAX_BATCH) {
        throw new ConfigValidationError(
          `lazy_batch_size must be between ${LIMITS.LAZY_MIN_BATCH} and ${LIMITS.LAZY_MAX_BATCH}`,
          'lazy_batch_size'
        );
      }
    }

    if (config.lazy_idle_timeout !== undefined) {
      if (!isNumber(config.lazy_idle_timeout)) {
        throw new ConfigValidationError(
          'lazy_idle_timeout must be a number',
          'lazy_idle_timeout'
        );
      }
      if (config.lazy_idle_timeout < LIMITS.LAZY_MIN_TIMEOUT_MS || config.lazy_idle_timeout > LIMITS.LAZY_MAX_TIMEOUT_MS) {
        throw new ConfigValidationError(
          `lazy_idle_timeout must be between ${LIMITS.LAZY_MIN_TIMEOUT_MS} and ${LIMITS.LAZY_MAX_TIMEOUT_MS}`,
          'lazy_idle_timeout'
        );
      }
    }

    if (config.auto_collapse_after !== undefined) {
      if (!isNumber(config.auto_collapse_after)) {
        throw new ConfigValidationError(
          'auto_collapse_after must be a number',
          'auto_collapse_after'
        );
      }
      if (config.auto_collapse_after < 0 || config.auto_collapse_after > LIMITS.AUTO_COLLAPSE_MAX_SECONDS) {
        throw new ConfigValidationError(
          `auto_collapse_after must be between 0 and ${LIMITS.AUTO_COLLAPSE_MAX_SECONDS}`,
          'auto_collapse_after'
        );
      }
    }

    if (config.remember_expanded_state !== undefined && typeof config.remember_expanded_state !== 'boolean') {
      throw new ConfigValidationError(
        'remember_expanded_state must be a boolean',
        'remember_expanded_state'
      );
    }

    if (config.remember_mode_state !== undefined && typeof config.remember_mode_state !== 'boolean') {
      throw new ConfigValidationError(
        'remember_mode_state must be a boolean',
        'remember_mode_state'
      );
    }

    if (config.stability_mode !== undefined && typeof config.stability_mode !== 'boolean') {
      throw new ConfigValidationError(
        'stability_mode must be a boolean',
        'stability_mode'
      );
    }

    if (config.carousel_autoplay !== undefined && typeof config.carousel_autoplay !== 'boolean') {
      throw new ConfigValidationError(
        'carousel_autoplay must be a boolean',
        'carousel_autoplay'
      );
    }

    if (config.carousel_interval !== undefined) {
      if (!isNumber(config.carousel_interval)) {
        throw new ConfigValidationError(
          'carousel_interval must be a number',
          'carousel_interval'
        );
      }
      if (
        config.carousel_interval < LIMITS.CAROUSEL_MIN_INTERVAL_MS ||
        config.carousel_interval > LIMITS.CAROUSEL_MAX_INTERVAL_MS
      ) {
        throw new ConfigValidationError(
          `carousel_interval must be between ${LIMITS.CAROUSEL_MIN_INTERVAL_MS} and ${LIMITS.CAROUSEL_MAX_INTERVAL_MS}`,
          'carousel_interval'
        );
      }
    }

    if (config.animation_duration !== undefined) {
      if (!isNumber(config.animation_duration)) {
        throw new ConfigValidationError(
          'animation_duration must be a number',
          'animation_duration'
        );
      }
      if (config.animation_duration < 0 || config.animation_duration > LIMITS.ANIMATION_DURATION_MAX_MS) {
        throw new ConfigValidationError(
          `animation_duration must be between 0 and ${LIMITS.ANIMATION_DURATION_MAX_MS}`,
          'animation_duration'
        );
      }
    }

    if (config.expand_animation !== undefined) {
      if (typeof config.expand_animation !== 'string' || !VALID_EXPAND_ANIMATIONS.includes(config.expand_animation)) {
        throw new ConfigValidationError(
          `expand_animation must be one of: ${VALID_EXPAND_ANIMATIONS.join(', ')}`,
          'expand_animation'
        );
      }
    }

    if (config.collapse_animation !== undefined) {
      if (typeof config.collapse_animation !== 'string' || !VALID_COLLAPSE_ANIMATIONS.includes(config.collapse_animation)) {
        throw new ConfigValidationError(
          `collapse_animation must be one of: ${VALID_COLLAPSE_ANIMATIONS.join(', ')}`,
          'collapse_animation'
        );
      }
    }

    if (config.cards_animation !== undefined) {
      if (typeof config.cards_animation !== 'string' || !VALID_CARD_ANIMATIONS.includes(config.cards_animation)) {
        throw new ConfigValidationError(
          `cards_animation must be one of: ${VALID_CARD_ANIMATIONS.join(', ')}`,
          'cards_animation'
        );
      }
    }

    if (config.cards_stagger !== undefined) {
      if (!isNumber(config.cards_stagger)) {
        throw new ConfigValidationError(
          'cards_stagger must be a number',
          'cards_stagger'
        );
      }
      if (config.cards_stagger < 0 || config.cards_stagger > LIMITS.CARDS_STAGGER_MAX_MS) {
        throw new ConfigValidationError(
          `cards_stagger must be between 0 and ${LIMITS.CARDS_STAGGER_MAX_MS}`,
          'cards_stagger'
        );
      }
    }

    if (config.cards_direction !== undefined) {
      if (typeof config.cards_direction !== 'string' || !VALID_CARD_DIRECTIONS.includes(config.cards_direction)) {
        throw new ConfigValidationError(
          `cards_direction must be one of: ${VALID_CARD_DIRECTIONS.join(', ')}`,
          'cards_direction'
        );
      }
    }

    if (config.enable_card_pool !== undefined && typeof config.enable_card_pool !== 'boolean') {
      throw new ConfigValidationError(
        'enable_card_pool must be a boolean',
        'enable_card_pool'
      );
    }

    if (config.pool_scope !== undefined) {
      if (typeof config.pool_scope !== 'string' || !VALID_POOL_SCOPES.includes(config.pool_scope)) {
        throw new ConfigValidationError(
          `pool_scope must be one of: ${VALID_POOL_SCOPES.join(', ')}`,
          'pool_scope'
        );
      }
    }

    if (config.pool_ttl_ms !== undefined) {
      if (!isNumber(config.pool_ttl_ms)) {
        throw new ConfigValidationError(
          'pool_ttl_ms must be a number',
          'pool_ttl_ms'
        );
      }
      if (config.pool_ttl_ms < LIMITS.POOL_MIN_TTL_MS || config.pool_ttl_ms > LIMITS.POOL_MAX_TTL_MS) {
        throw new ConfigValidationError(
          `pool_ttl_ms must be between ${LIMITS.POOL_MIN_TTL_MS} and ${LIMITS.POOL_MAX_TTL_MS}`,
          'pool_ttl_ms'
        );
      }
    }

    if (config.pool_max_entries !== undefined) {
      if (!isNumber(config.pool_max_entries)) {
        throw new ConfigValidationError(
          'pool_max_entries must be a number',
          'pool_max_entries'
        );
      }
      if (config.pool_max_entries < LIMITS.POOL_MIN_MAX_ENTRIES || config.pool_max_entries > LIMITS.POOL_MAX_MAX_ENTRIES) {
        throw new ConfigValidationError(
          `pool_max_entries must be between ${LIMITS.POOL_MIN_MAX_ENTRIES} and ${LIMITS.POOL_MAX_MAX_ENTRIES}`,
          'pool_max_entries'
        );
      }
    }
    
    this._validateCardCollection(config.body?.cards, 'body.cards', {
      maxCards: LIMITS.MAX_CARDS_PER_BODY
    });
    this._validateCardCollection(config.header?.cards, 'header.cards');
    this._validateCardCollection(config.footer?.cards, 'footer.cards');
    this._validateCardCollection(config.header_left?.cards, 'header_left.cards');
    this._validateCardCollection(config.header_right?.cards, 'header_right.cards');
    
    // Validate tabs
    if (config.tabs) {
      this._validateTabs(config.tabs);
    }
    
    // Validate visibility conditions
    if (config.visibility) {
      this._validateConditions(config.visibility, 'visibility');
    }

    // Validate section visibility conditions
    if (config.section_visibility !== undefined) {
      if (!isObject(config.section_visibility)) {
        throw new ConfigValidationError(
          'section_visibility must be an object with header/body/footer arrays',
          'section_visibility'
        );
      }

      ['header', 'body', 'footer'].forEach((section) => {
        const conditions = config.section_visibility[section];
        if (conditions !== undefined) {
          this._validateConditions(conditions, `section_visibility.${section}`);
        }
      });
    }

    if (config.state_styles !== undefined) {
      if (!config.entity) {
        throw new ConfigValidationError(
          'state_styles requires root entity. Separate state_styles_entity is no longer supported.',
          'state_styles'
        );
      }

      this._validateStateStyles(config.state_styles, 'state_styles');
    }

    if (config.swipe !== undefined) {
      this._validateSwipeConfig(config.swipe, 'swipe');
    }

    if (config.badges !== undefined) {
      this._validateBadges(config.badges, 'badges');
    }

    // Validate theme token overrides
    if (config.theme_tokens !== undefined) {
      if (!isObject(config.theme_tokens)) {
        throw new ConfigValidationError(
          'theme_tokens must be an object',
          'theme_tokens'
        );
      }

      const tokenNameRegex = /^--[a-z0-9_-]+$/i;
      Object.entries(config.theme_tokens).forEach(([name, value]) => {
        if (!tokenNameRegex.test(name)) {
          throw new ConfigValidationError(
            `Invalid CSS variable name "${name}"`,
            `theme_tokens.${name}`
          );
        }
        if (typeof value !== 'string') {
          throw new ConfigValidationError(
            'Theme token value must be a string',
            `theme_tokens.${name}`
          );
        }
      });
    }

    if (config.custom_css !== undefined) {
      this._validateCustomCSS(config.custom_css, 'custom_css');
    }
    
    // Validate actions
    ['tap_action', 'hold_action', 'double_tap_action'].forEach(actionKey => {
      if (config[actionKey]) {
        this._validateAction(config[actionKey], actionKey);
      }
    });
    
    return true;
  }
  
  /**
   * Validate a single card configuration
   * 
   * @param {*} card - Card config
   * @param {string} path - Config path
   * @throws {ConfigValidationError}
   * @private
   * @static
   */
  static _validateCardConfig(card, path) {
    if (!isObject(card)) {
      throw new ConfigValidationError('Card config must be an object', path);
    }
    
    if (!card.type) {
      throw new ConfigValidationError('Card must have a type', path);
    }
  }

  /**
   * Validate a collection of nested cards.
   *
   * @param {*} cards
   * @param {string} path
   * @param {{maxCards?: number}} [options]
   * @private
   * @static
   */
  static _validateCardCollection(
    cards: any,
    path: string,
    options: { maxCards?: number } = {}
  ) {
    if (cards === undefined) {
      return;
    }

    if (!Array.isArray(cards)) {
      throw new ConfigValidationError(`${path} must be an array`, path);
    }

    if (options.maxCards && cards.length > options.maxCards) {
      throw new ConfigValidationError(
        `Maximum ${options.maxCards} cards allowed in ${path}`,
        path
      );
    }

    cards.forEach((card, index) => {
      this._validateCardConfig(card, `${path}[${index}]`);
    });
  }
  
  /**
   * Validate tabs configuration
   * 
   * @param {*} tabs - Tabs config
   * @throws {ConfigValidationError}
   * @private
   * @static
   */
  static _validateTabs(tabs) {
    if (!Array.isArray(tabs)) {
      throw new ConfigValidationError('tabs must be an array', 'tabs');
    }
    
    if (tabs.length > LIMITS.MAX_TABS) {
      throw new ConfigValidationError(
        `Maximum ${LIMITS.MAX_TABS} tabs allowed`,
        'tabs'
      );
    }
    
    tabs.forEach((tab, index) => {
      if (!isObject(tab)) {
        throw new ConfigValidationError(
          'Tab config must be an object',
          `tabs[${index}]`
        );
      }
      
      if (tab.cards && !Array.isArray(tab.cards)) {
        throw new ConfigValidationError(
          'Tab cards must be an array',
          `tabs[${index}].cards`
        );
      }
    });
  }
  
  /**
   * Validate visibility conditions
   * 
   * @param {*} conditions - Conditions config
   * @param {string} path - Config path
   * @throws {ConfigValidationError}
   * @private
   * @static
   */
  static _validateConditions(conditions, path) {
    if (!Array.isArray(conditions)) {
      throw new ConfigValidationError('Visibility must be an array', path);
    }

    conditions.forEach((condition, index) => {
      const conditionPath = `${path}[${index}]`;

      if (!isObject(condition)) {
        throw new ConfigValidationError(
          'Condition must be an object',
          conditionPath
        );
      }

      const type = condition.condition;
      if (!type) {
        throw new ConfigValidationError(
          'Condition must have a "condition" type',
          conditionPath
        );
      }

      if (!VALID_CONDITION_TYPES.includes(type)) {
        throw new ConfigValidationError(
          `Invalid condition type: "${type}"`,
          conditionPath
        );
      }

      switch (type) {
        case CONDITION_TYPES.STATE:
          this._validateStateCondition(condition, conditionPath);
          break;
        case CONDITION_TYPES.NUMERIC_STATE:
          this._validateNumericStateCondition(condition, conditionPath);
          break;
        case CONDITION_TYPES.USER:
          this._validateUserCondition(condition, conditionPath);
          break;
        case CONDITION_TYPES.TIME:
          this._validateTimeCondition(condition, conditionPath);
          break;
        case CONDITION_TYPES.SCREEN:
          this._validateScreenCondition(condition, conditionPath);
          break;
        case CONDITION_TYPES.AND:
        case CONDITION_TYPES.OR:
        case CONDITION_TYPES.NOT:
          this._validateConditionGroup(condition, conditionPath);
          break;
      }
    });
  }

  /**
   * Validate condition entity reference and optional attribute.
   *
   * @private
   * @param {Record<string, any>} condition
   * @param {string} path
   */
  static _validateConditionEntity(condition, path) {
    if (!isNonEmptyString(condition.entity)) {
      throw new ConfigValidationError(
        'Condition entity must be a non-empty string',
        `${path}.entity`
      );
    }

    if (!isValidEntityId(condition.entity)) {
      throw new ConfigValidationError(
        `Invalid entity format: "${condition.entity}"`,
        `${path}.entity`
      );
    }

    if (condition.attribute !== undefined && !isNonEmptyString(condition.attribute)) {
      throw new ConfigValidationError(
        'Condition attribute must be a non-empty string',
        `${path}.attribute`
      );
    }
  }

  /**
   * Validate state condition.
   *
   * @private
   * @param {Record<string, any>} condition
   * @param {string} path
   */
  static _validateStateCondition(condition, path) {
    this._validateConditionEntity(condition, path);

    if (condition.state === undefined && condition.state_not === undefined) {
      throw new ConfigValidationError(
        'state condition requires "state" or "state_not"',
        path
      );
    }

    if (condition.state !== undefined && condition.state_not !== undefined) {
      throw new ConfigValidationError(
        'state condition cannot define both "state" and "state_not"',
        path
      );
    }

    if (condition.state !== undefined) {
      this._validateStringOrStringArray(condition.state, `${path}.state`, 'state');
    }

    if (condition.state_not !== undefined) {
      this._validateStringOrStringArray(condition.state_not, `${path}.state_not`, 'state_not');
    }
  }

  /**
   * Validate numeric state condition.
   *
   * @private
   * @param {Record<string, any>} condition
   * @param {string} path
   */
  static _validateNumericStateCondition(condition, path) {
    this._validateConditionEntity(condition, path);

    if (condition.above === undefined && condition.below === undefined) {
      throw new ConfigValidationError(
        'numeric_state condition requires "above" or "below"',
        path
      );
    }

    if (condition.above !== undefined && !isNumber(condition.above)) {
      throw new ConfigValidationError(
        'numeric_state.above must be a number',
        `${path}.above`
      );
    }

    if (condition.below !== undefined && !isNumber(condition.below)) {
      throw new ConfigValidationError(
        'numeric_state.below must be a number',
        `${path}.below`
      );
    }

    if (
      isNumber(condition.above) &&
      isNumber(condition.below) &&
      condition.above >= condition.below
    ) {
      throw new ConfigValidationError(
        'numeric_state.above must be lower than numeric_state.below',
        path
      );
    }
  }

  /**
   * Validate user condition.
   *
   * @private
   * @param {Record<string, any>} condition
   * @param {string} path
   */
  static _validateUserCondition(condition, path) {
    if (
      condition.users === undefined &&
      condition.is_admin === undefined &&
      condition.is_owner === undefined
    ) {
      throw new ConfigValidationError(
        'user condition requires users, is_admin, or is_owner',
        path
      );
    }

    if (condition.users !== undefined) {
      this._validateStringArray(condition.users, `${path}.users`, 'users');
    }

    if (condition.is_admin !== undefined && typeof condition.is_admin !== 'boolean') {
      throw new ConfigValidationError(
        'user.is_admin must be a boolean',
        `${path}.is_admin`
      );
    }

    if (condition.is_owner !== undefined && typeof condition.is_owner !== 'boolean') {
      throw new ConfigValidationError(
        'user.is_owner must be a boolean',
        `${path}.is_owner`
      );
    }
  }

  /**
   * Validate time condition.
   *
   * @private
   * @param {Record<string, any>} condition
   * @param {string} path
   */
  static _validateTimeCondition(condition, path) {
    if (
      condition.after === undefined &&
      condition.before === undefined &&
      condition.weekday === undefined
    ) {
      throw new ConfigValidationError(
        'time condition requires after, before, or weekday',
        path
      );
    }

    if (condition.after !== undefined && !this._isValidTimeString(condition.after)) {
      throw new ConfigValidationError(
        'time.after must be in HH:MM format',
        `${path}.after`
      );
    }

    if (condition.before !== undefined && !this._isValidTimeString(condition.before)) {
      throw new ConfigValidationError(
        'time.before must be in HH:MM format',
        `${path}.before`
      );
    }

    if (condition.weekday !== undefined) {
      if (!Array.isArray(condition.weekday)) {
        throw new ConfigValidationError(
          'time.weekday must be an array',
          `${path}.weekday`
        );
      }

      condition.weekday.forEach((day, index) => {
        if (
          typeof day !== 'string' ||
          !VALID_WEEKDAYS.includes(day as (typeof VALID_WEEKDAYS)[number])
        ) {
          throw new ConfigValidationError(
            `Invalid weekday: "${String(day)}"`,
            `${path}.weekday[${index}]`
          );
        }
      });
    }
  }

  /**
   * Validate screen condition.
   *
   * @private
   * @param {Record<string, any>} condition
   * @param {string} path
   */
  static _validateScreenCondition(condition, path) {
    if (
      condition.media_query === undefined &&
      condition.min_width === undefined &&
      condition.max_width === undefined
    ) {
      throw new ConfigValidationError(
        'screen condition requires media_query, min_width, or max_width',
        path
      );
    }

    if (condition.media_query !== undefined && !isNonEmptyString(condition.media_query)) {
      throw new ConfigValidationError(
        'screen.media_query must be a non-empty string',
        `${path}.media_query`
      );
    }

    if (condition.min_width !== undefined && !isNumber(condition.min_width)) {
      throw new ConfigValidationError(
        'screen.min_width must be a number',
        `${path}.min_width`
      );
    }

    if (condition.max_width !== undefined && !isNumber(condition.max_width)) {
      throw new ConfigValidationError(
        'screen.max_width must be a number',
        `${path}.max_width`
      );
    }

    if (
      isNumber(condition.min_width) &&
      isNumber(condition.max_width) &&
      condition.min_width > condition.max_width
    ) {
      throw new ConfigValidationError(
        'screen.min_width must be lower than or equal to screen.max_width',
        path
      );
    }
  }

  /**
   * Validate nested logical condition groups.
   *
   * @private
   * @param {Record<string, any>} condition
   * @param {string} path
   */
  static _validateConditionGroup(condition, path) {
    if (!Array.isArray(condition.conditions) || condition.conditions.length === 0) {
      throw new ConfigValidationError(
        'Logical conditions require a non-empty "conditions" array',
        `${path}.conditions`
      );
    }

    this._validateConditions(condition.conditions, `${path}.conditions`);
  }

  /**
   * Validate a string or string array payload.
   *
   * @private
   * @param {*} value
   * @param {string} path
   * @param {string} label
   */
  static _validateStringOrStringArray(value, path, label) {
    if (typeof value === 'string') {
      if (!value.trim()) {
        throw new ConfigValidationError(
          `${label} must not be empty`,
          path
        );
      }
      return;
    }

    if (!Array.isArray(value) || value.length === 0) {
      throw new ConfigValidationError(
        `${label} must be a string or non-empty array of strings`,
        path
      );
    }

    value.forEach((entry, index) => {
      if (typeof entry !== 'string' || !entry.trim()) {
        throw new ConfigValidationError(
          `${label} items must be non-empty strings`,
          `${path}[${index}]`
        );
      }
    });
  }

  /**
   * Validate a string array payload.
   *
   * @private
   * @param {*} value
   * @param {string} path
   * @param {string} label
   */
  static _validateStringArray(value, path, label) {
    if (!Array.isArray(value) || value.length === 0) {
      throw new ConfigValidationError(
        `${label} must be a non-empty array of strings`,
        path
      );
    }

    value.forEach((entry, index) => {
      if (typeof entry !== 'string' || !entry.trim()) {
        throw new ConfigValidationError(
          `${label} items must be non-empty strings`,
          `${path}[${index}]`
        );
      }
    });
  }

  /**
   * Validate state style rules.
   *
   * @private
   * @param {*} stateStyles
   * @param {string} path
   */
  static _validateStateStyles(stateStyles, path) {
    if (!isObject(stateStyles)) {
      throw new ConfigValidationError(
        'state_styles must be an object map',
        path
      );
    }

    Object.entries(stateStyles).forEach(([matcher, style], index) => {
      const matcherPath = `${path}.${matcher || index}`;

      if (!matcher || !matcher.trim()) {
        throw new ConfigValidationError(
          'state_styles keys must be non-empty strings',
          matcherPath
        );
      }

      if (!isObject(style)) {
        throw new ConfigValidationError(
          'state_styles entries must be objects',
          matcherPath
        );
      }

      Object.entries(style).forEach(([key, value]) => {
        if (key === 'class') {
          if (
            typeof value !== 'string' &&
            (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string' || !entry.trim()))
          ) {
            throw new ConfigValidationError(
              'state_styles.class must be a string or array of strings',
              `${matcherPath}.class`
            );
          }
          return;
        }

        if (typeof value !== 'string' && !isNumber(value)) {
          throw new ConfigValidationError(
            `state_styles.${key} must be a string or number`,
            `${matcherPath}.${key}`
          );
        }
      });
    });
  }

  /**
   * Validate swipe gesture config.
   *
   * @private
   * @param {*} swipe
   * @param {string} path
   */
  static _validateSwipeConfig(swipe, path) {
    if (!isObject(swipe)) {
      throw new ConfigValidationError(
        'swipe must be an object',
        path
      );
    }

    if (swipe.swipe_left !== undefined || swipe.swipe_right !== undefined || swipe.swipe_up !== undefined || swipe.swipe_down !== undefined) {
      throw new ConfigValidationError(
        'Legacy swipe.swipe_left/swipe_right/swipe_up/swipe_down keys were removed. Use swipe.left/right/up/down.',
        path
      );
    }

    if (swipe.enabled !== undefined && typeof swipe.enabled !== 'boolean') {
      throw new ConfigValidationError(
        'swipe.enabled must be a boolean',
        `${path}.enabled`
      );
    }

    if (swipe.direction !== undefined) {
      if (typeof swipe.direction !== 'string' || !VALID_SWIPE_DIRECTIONS.includes(swipe.direction)) {
        throw new ConfigValidationError(
          `swipe.direction must be one of: ${VALID_SWIPE_DIRECTIONS.join(', ')}`,
          `${path}.direction`
        );
      }
    }

    if (swipe.threshold !== undefined) {
      if (!isNumber(swipe.threshold)) {
        throw new ConfigValidationError(
          'swipe.threshold must be a number',
          `${path}.threshold`
        );
      }
      if (swipe.threshold < 0 || swipe.threshold > LIMITS.SWIPE_MAX_THRESHOLD_PX) {
        throw new ConfigValidationError(
          `swipe.threshold must be between 0 and ${LIMITS.SWIPE_MAX_THRESHOLD_PX}`,
          `${path}.threshold`
        );
      }
    }

    if (swipe.velocityThreshold !== undefined) {
      if (!isNumber(swipe.velocityThreshold)) {
        throw new ConfigValidationError(
          'swipe.velocityThreshold must be a number',
          `${path}.velocityThreshold`
        );
      }
      if (swipe.velocityThreshold < 0 || swipe.velocityThreshold > LIMITS.SWIPE_MAX_VELOCITY_THRESHOLD) {
        throw new ConfigValidationError(
          `swipe.velocityThreshold must be between 0 and ${LIMITS.SWIPE_MAX_VELOCITY_THRESHOLD}`,
          `${path}.velocityThreshold`
        );
      }
    }

    if (swipe.preventScroll !== undefined && typeof swipe.preventScroll !== 'boolean') {
      throw new ConfigValidationError(
        'swipe.preventScroll must be a boolean',
        `${path}.preventScroll`
      );
    }

    ['left', 'right', 'up', 'down'].forEach((direction) => {
      if (swipe[direction] !== undefined) {
        this._validateSwipeActionConfig(swipe[direction], `${path}.${direction}`);
      }
    });
  }

  /**
   * Validate swipe action config.
   *
   * @private
   * @param {*} action
   * @param {string} path
   */
  static _validateSwipeActionConfig(action, path) {
    if (!isObject(action)) {
      throw new ConfigValidationError(
        'Swipe action must be an object',
        path
      );
    }

    if (action.action === undefined) {
      throw new ConfigValidationError(
        'Swipe action requires an "action" field',
        `${path}.action`
      );
    }

    if (typeof action.action !== 'string' || !VALID_SWIPE_ACTIONS.includes(action.action)) {
      throw new ConfigValidationError(
        `Swipe action must be one of: ${VALID_SWIPE_ACTIONS.join(', ')}`,
        `${path}.action`
      );
    }
  }

  /**
   * Validate badges configuration.
   *
   * @private
   * @param {*} badges
   * @param {string} path
   */
  static _validateBadges(badges, path) {
    if (!Array.isArray(badges)) {
      throw new ConfigValidationError(
        'badges must be an array',
        path
      );
    }

    badges.forEach((badge, index) => {
      const badgePath = `${path}[${index}]`;

      if (!isObject(badge)) {
        throw new ConfigValidationError(
          'Badge must be an object',
          badgePath
        );
      }

      if (badge.text !== undefined) {
        throw new ConfigValidationError(
          'badges[].text was removed. Use badges[].value or badges[].label instead.',
          `${badgePath}.text`
        );
      }

      const type = badge.type || BADGE_TYPES.STATE;
      if (
        typeof type !== 'string' ||
        !VALID_BADGE_TYPES.includes(type as (typeof VALID_BADGE_TYPES)[number])
      ) {
        throw new ConfigValidationError(
          `Badge type must be one of: ${VALID_BADGE_TYPES.join(', ')}`,
          `${badgePath}.type`
        );
      }

      const badgeEntity = typeof badge.entity === 'string' ? badge.entity.trim() : badge.entity;
      if (badgeEntity !== undefined && !isValidEntityId(badgeEntity)) {
        throw new ConfigValidationError(
          `Invalid entity format: "${badge.entity}"`,
          `${badgePath}.entity`
        );
      }

      if (badge.attribute !== undefined && !isNonEmptyString(badge.attribute)) {
        throw new ConfigValidationError(
          'Badge attribute must be a non-empty string',
          `${badgePath}.attribute`
        );
      }

      ['icon', 'color', 'label', 'unit', 'domain'].forEach((field) => {
        if (badge[field] !== undefined && typeof badge[field] !== 'string') {
          throw new ConfigValidationError(
            `Badge ${field} must be a string`,
            `${badgePath}.${field}`
          );
        }
      });

      if (badge.value !== undefined && typeof badge.value !== 'string' && !isNumber(badge.value)) {
        throw new ConfigValidationError(
          'Badge value must be a string or number',
          `${badgePath}.value`
        );
      }

      ['min', 'max'].forEach((field) => {
        if (badge[field] !== undefined && !isNumber(badge[field])) {
          throw new ConfigValidationError(
            `Badge ${field} must be a number`,
            `${badgePath}.${field}`
          );
        }
      });

      if (isNumber(badge.min) && isNumber(badge.max) && badge.min >= badge.max) {
        throw new ConfigValidationError(
          'Badge min must be lower than max',
          badgePath
        );
      }

      ['show_name', 'show_progress'].forEach((field) => {
        if (badge[field] !== undefined && typeof badge[field] !== 'boolean') {
          throw new ConfigValidationError(
            `Badge ${field} must be a boolean`,
            `${badgePath}.${field}`
          );
        }
      });

      if (badge.icon_only !== undefined && typeof badge.icon_only !== 'boolean') {
        throw new ConfigValidationError(
          'Badge icon_only must be a boolean',
          `${badgePath}.icon_only`
        );
      }

      if (badge.precision !== undefined) {
        if (!Number.isInteger(badge.precision)) {
          throw new ConfigValidationError(
            'Badge precision must be an integer',
            `${badgePath}.precision`
          );
        }
        if (badge.precision < 0 || badge.precision > LIMITS.BADGE_MAX_PRECISION) {
          throw new ConfigValidationError(
            `Badge precision must be between 0 and ${LIMITS.BADGE_MAX_PRECISION}`,
            `${badgePath}.precision`
          );
        }
      }

      if (badge.format !== undefined) {
        if (typeof badge.format !== 'string' || !VALID_BADGE_FORMATS.includes(badge.format)) {
          throw new ConfigValidationError(
            `Badge format must be one of: ${VALID_BADGE_FORMATS.join(', ')}`,
            `${badgePath}.format`
          );
        }
      }

      if (badge.entities !== undefined) {
        if (!Array.isArray(badge.entities) || badge.entities.length === 0) {
          throw new ConfigValidationError(
            'Badge entities must be a non-empty array',
            `${badgePath}.entities`
          );
        }
        const normalizedEntities = badge.entities
          .map((entityId) => (typeof entityId === 'string' ? entityId.trim() : entityId))
          .filter((entityId) => entityId !== '');

        if (normalizedEntities.length === 0) {
          throw new ConfigValidationError(
            'Badge entities must contain at least one valid entity ID',
            `${badgePath}.entities`
          );
        }

        normalizedEntities.forEach((normalizedEntityId, entityIndex) => {
          if (!isValidEntityId(normalizedEntityId)) {
            throw new ConfigValidationError(
              `Invalid entity format: "${normalizedEntityId}"`,
              `${badgePath}.entities[${entityIndex}]`
            );
          }
        });
      }

      if (badge.state !== undefined && typeof badge.state !== 'string') {
        throw new ConfigValidationError(
          'Badge state must be a string',
          `${badgePath}.state`
        );
      }

      if (badge.count_state !== undefined && typeof badge.count_state !== 'string') {
        throw new ConfigValidationError(
          'Badge count_state must be a string',
          `${badgePath}.count_state`
        );
      }

      if (badge.thresholds !== undefined) {
        this._validateBadgeThresholds(badge.thresholds, `${badgePath}.thresholds`);
      }

      if (badge.visibility !== undefined) {
        this._validateBadgeRules(badge.visibility, `${badgePath}.visibility`);
      }

      if (badge.color_rules !== undefined) {
        this._validateBadgeColorRules(badge.color_rules, `${badgePath}.color_rules`);
      }

      if (badge.tap_action !== undefined) {
        this._validateAction(badge.tap_action, `${badgePath}.tap_action`);
      }

      if (badge.icon_tap_action !== undefined) {
        this._validateAction(badge.icon_tap_action, `${badgePath}.icon_tap_action`);
      }

      switch (type) {
        case BADGE_TYPES.STATE:
          if (!badge.entity && badge.value === undefined) {
            throw new ConfigValidationError(
              'State badges require entity or static value',
              badgePath
            );
          }
          break;
        case BADGE_TYPES.ATTRIBUTE:
          if (!badge.entity) {
            throw new ConfigValidationError(
              'Attribute badges require entity',
              `${badgePath}.entity`
            );
          }
          if (!badge.attribute) {
            throw new ConfigValidationError(
              'Attribute badges require attribute',
              `${badgePath}.attribute`
            );
          }
          break;
        case BADGE_TYPES.COUNTER:
          if (!badge.domain && !badge.entities) {
            throw new ConfigValidationError(
              'Counter badges require domain or entities',
              badgePath
            );
          }
          break;
        case BADGE_TYPES.CUSTOM:
          if (badge.value === undefined) {
            throw new ConfigValidationError(
              'Custom badges require value',
              `${badgePath}.value`
            );
          }
          break;
      }
    });
  }

  /**
   * Validate modal configuration.
   *
   * @private
   * @param {*} modal
   * @param {string} path
   */
  static _validateModal(modal, path) {
    if (!isObject(modal)) {
      throw new ConfigValidationError(
        'modal must be an object',
        path
      );
    }

    ['width', 'height', 'max_width', 'max_height', 'backdrop_color'].forEach((field) => {
      if (modal[field] !== undefined && !isNonEmptyString(modal[field])) {
        throw new ConfigValidationError(
          `modal.${field} must be a non-empty string`,
          `${path}.${field}`
        );
      }
    });

    ['backdrop_blur', 'close_on_backdrop', 'close_on_escape', 'show_close'].forEach((field) => {
      if (modal[field] !== undefined && typeof modal[field] !== 'boolean') {
        throw new ConfigValidationError(
          `modal.${field} must be a boolean`,
          `${path}.${field}`
        );
      }
    });
  }

  /**
   * Validate badge thresholds.
   *
   * @private
   * @param {*} thresholds
   * @param {string} path
   */
  static _validateBadgeThresholds(thresholds, path) {
    if (!Array.isArray(thresholds)) {
      throw new ConfigValidationError(
        'Badge thresholds must be an array',
        path
      );
    }

    thresholds.forEach((threshold, index) => {
      const thresholdPath = `${path}[${index}]`;

      if (!isObject(threshold)) {
        throw new ConfigValidationError(
          'Badge threshold must be an object',
          thresholdPath
        );
      }

      if (!isNumber(threshold.value)) {
        throw new ConfigValidationError(
          'Badge threshold value must be a number',
          `${thresholdPath}.value`
        );
      }

      if (!isNonEmptyString(threshold.color)) {
        throw new ConfigValidationError(
          'Badge threshold color must be a non-empty string',
          `${thresholdPath}.color`
        );
      }
    });
  }

  /**
   * Validate badge comparison rules.
   *
   * @private
   * @param {*} rules
   * @param {string} path
   */
  static _validateBadgeRules(rules, path) {
    if (!Array.isArray(rules)) {
      throw new ConfigValidationError(
        'Badge rules must be an array',
        path
      );
    }

    rules.forEach((rule, index) => {
      const rulePath = `${path}[${index}]`;

      if (!isObject(rule)) {
        throw new ConfigValidationError(
          'Badge rule must be an object',
          rulePath
        );
      }

      if (typeof rule.operator !== 'string' || !VALID_BADGE_OPERATORS.includes(rule.operator)) {
        throw new ConfigValidationError(
          `Badge rule operator must be one of: ${VALID_BADGE_OPERATORS.join(', ')}`,
          `${rulePath}.operator`
        );
      }

      const valueType = typeof rule.value;
      if (rule.value === undefined || !['string', 'number', 'boolean'].includes(valueType)) {
        throw new ConfigValidationError(
          'Badge rule value must be a string, number, or boolean',
          `${rulePath}.value`
        );
      }

      if (rule.entity !== undefined) {
        const entityId = typeof rule.entity === 'string' ? rule.entity.trim() : rule.entity;
        if (!isValidEntityId(entityId)) {
          throw new ConfigValidationError(
            `Invalid entity format: "${rule.entity}"`,
            `${rulePath}.entity`
          );
        }
      }

      if (rule.attribute !== undefined && !isNonEmptyString(rule.attribute)) {
        throw new ConfigValidationError(
          'Badge rule attribute must be a non-empty string',
          `${rulePath}.attribute`
        );
      }
    });
  }

  /**
   * Validate badge color rules.
   *
   * @private
   * @param {*} rules
   * @param {string} path
   */
  static _validateBadgeColorRules(rules, path) {
    this._validateBadgeRules(rules, path);

    rules.forEach((rule, index) => {
      if (!isNonEmptyString(rule.color)) {
        throw new ConfigValidationError(
          'Badge color rule color must be a non-empty string',
          `${path}[${index}].color`
        );
      }
    });
  }

  /**
   * Validate time string in HH:MM format.
   *
   * @private
   * @param {*} value
   * @returns {boolean}
   */
  static _isValidTimeString(value) {
    if (typeof value !== 'string') {
      return false;
    }

    const match = value.match(/^(\d{2}):(\d{2})$/);
    if (!match) {
      return false;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }
  
  /**
   * Validate action configuration
   * 
   * @param {*} action - Action config
   * @param {string} path - Config path
   * @throws {ConfigValidationError}
   * @private
   * @static
   */
  static _validateAction(action, path) {
    if (!isObject(action)) {
      throw new ConfigValidationError('Action must be an object', path);
    }
    
    const validActions = Object.values(ACTION_TYPES);
    
    if (action.action && !validActions.includes(action.action)) {
      throw new ConfigValidationError(
        `Invalid action: "${action.action}"`,
        path
      );
    }
    
    // Validate service call
    if (action.action === ACTION_TYPES.CALL_SERVICE && !action.service) {
      throw new ConfigValidationError(
        'call-service action requires a "service" property',
        path
      );
    }
    
    // Validate navigation
    if (action.action === ACTION_TYPES.NAVIGATE && !action.navigation_path) {
      throw new ConfigValidationError(
        'navigate action requires a "navigation_path" property',
        path
      );
    }
    
    // Validate URL
    if (action.action === ACTION_TYPES.URL && !action.url_path) {
      throw new ConfigValidationError(
        'url action requires a "url_path" property',
        path
      );
    }
  }
  
  // ===========================================================================
  // NORMALIZATION
  // ===========================================================================
  
  /**
   * Normalize and validate configuration
   * 
   * @param {Object} config - Raw configuration
   * @returns {Object} Normalized configuration
   * @throws {ConfigValidationError} If configuration is invalid
   * @static
   */
  static normalize(config) {
    config = this.migrate(config).config;

    // Validate migrated/current config
    this._validateCurrentConfig(config);
    
    // Start with defaults
    const normalized = {
      ...DEFAULTS,
      ...config
    };

    normalized.config_version = CURRENT_CONFIG_VERSION;
    
    // Ensure card_id exists
    if (!normalized.card_id) {
      normalized.card_id = generateId('uc');
    }
    
    // Normalize header
    normalized.header = this._normalizeSection(config.header, 'header');

    if (config.header_left) {
      normalized.header_left = this._normalizeSection(config.header_left, 'header_left');
    }

    if (config.header_right) {
      normalized.header_right = this._normalizeSection(config.header_right, 'header_right');
    }
    
    // Normalize body
    if (config.body) {
      normalized.body = this._normalizeSection(config.body, 'body');
    } else {
      normalized.body = { cards: [] };
    }
    
    // Normalize footer if present
    if (config.footer) {
      normalized.footer = this._normalizeSection(config.footer, 'footer');
    }
    
    // Normalize tabs if present
    if (config.tabs) {
      normalized.tabs = config.tabs.map((tab, index) => ({
        label: tab.label || `Tab ${index + 1}`,
        icon: tab.icon || null,
        cards: tab.cards || [],
        ...tab
      }));
    }
    
    // Normalize grid
    normalized.grid = this._normalizeGrid(config.grid);
    normalized.modal = this._normalizeModal(config.modal);
    
    // Для триггера раскрытия - не устанавливаем дефолт, пусть Header runtime обрабатывает
    // Для остальных триггеров - none
    normalized.tap_action = this._normalizeAction(config.tap_action, 'none');
    normalized.hold_action = this._normalizeAction(config.hold_action, 'none');
    normalized.double_tap_action = this._normalizeAction(config.double_tap_action, 'none');
    
    // Normalize visibility
    if (config.visibility) {
      normalized.visibility = config.visibility.map(c => this._normalizeCondition(c));
    }

    // Normalize section visibility
    normalized.section_visibility = this._normalizeSectionVisibility(config.section_visibility);

    if (config.attribute !== undefined) {
      const attribute = config.attribute.trim();
      if (attribute) {
        normalized.attribute = attribute;
      } else {
        delete normalized.attribute;
      }
    }

    normalized.state_styles = this._normalizeStateStyles(config.state_styles);
    normalized.swipe = this._normalizeSwipe(config.swipe);
    normalized.badges = this._normalizeBadges(config.badges);

    // Normalize theme token overrides
    normalized.theme_tokens = this._normalizeThemeTokens(config.theme_tokens);

    if (normalized.stability_mode) {
      normalized.animation = false;
      normalized.expand_animation = 'none';
      normalized.collapse_animation = 'none';
      normalized.cards_animation = 'none';
      normalized.cards_stagger = 0;
      normalized.animation_duration = 0;
      normalized.enable_card_pool = false;
      normalized.carousel_autoplay = false;
    }
    
    return normalized;
  }
  
  /**
   * Normalize a section (header/body/footer)
   * 
   * @param {Object} section - Section config
   * @param {string} type - Section type
   * @returns {Object} Normalized section
   * @private
   * @static
   */
  static _normalizeSection(section, type) {
    if (!section) {
      return { cards: [] };
    }
    
    return {
      cards: section.cards || [],
      ...section
    };
  }
  
  /**
   * Normalize grid configuration
   * 
   * @param {Object} grid - Grid config
   * @returns {Object} Normalized grid
   * @private
   * @static
   */
  static _normalizeGrid(grid) {
    if (!grid) {
      return {
        columns: DEFAULTS.grid_columns,
        gap: DEFAULTS.grid_gap
      };
    }
    
    return {
      columns: grid.columns || DEFAULTS.grid_columns,
      gap: grid.gap || DEFAULTS.grid_gap,
      responsive: grid.responsive || null
    };
  }

  /**
   * Normalize modal configuration.
   *
   * @param {*} modal
   * @returns {Object}
   * @private
   * @static
   */
  static _normalizeModal(modal) {
    const source = isObject(modal) ? modal : {};
    const normalizeString = (value, fallback) => {
      if (typeof value !== 'string') {
        return fallback;
      }

      const trimmed = value.trim();
      return trimmed || fallback;
    };

    return {
      width: normalizeString(source.width, DEFAULTS.modal_width),
      height: normalizeString(source.height, DEFAULTS.modal_height),
      max_width: normalizeString(source.max_width, DEFAULTS.modal_max_width),
      max_height: normalizeString(source.max_height, DEFAULTS.modal_max_height),
      backdrop_blur: source.backdrop_blur !== false,
      backdrop_color: normalizeString(source.backdrop_color, DEFAULTS.backdrop_color),
      close_on_backdrop: source.close_on_backdrop !== false,
      close_on_escape: source.close_on_escape !== false,
      show_close: source.show_close !== false
    };
  }
  
  /**
   * Normalize action configuration
   * 
   * @param {Object} action - Action config
   * @param {string} defaultAction - Default action type
   * @returns {Object} Normalized action
   * @private
   * @static
   */
  static _normalizeAction(action, defaultAction = 'none') {
    if (!action) {
      return { action: defaultAction };
    }
    
    return {
      action: action.action || defaultAction,
      ...action
    };
  }
  
  /**
   * Normalize visibility condition
   * 
   * @param {Object} condition - Condition config
   * @returns {Object} Normalized condition
   * @private
   * @static
   */
  static _normalizeCondition(condition) {
    const normalized = {
      condition: condition.condition,
      ...condition
    };

    if (typeof normalized.entity === 'string') {
      normalized.entity = normalized.entity.trim();
    }

    if (typeof normalized.attribute === 'string') {
      normalized.attribute = normalized.attribute.trim();
    }

    if (condition.condition === CONDITION_TYPES.STATE) {
      if (condition.state !== undefined) {
        normalized.state = this._normalizeStringListValue(condition.state);
      }

      if (condition.state_not !== undefined) {
        normalized.state_not = this._normalizeStringListValue(condition.state_not);
      }
    }

    if (condition.condition === CONDITION_TYPES.USER && Array.isArray(condition.users)) {
      normalized.users = condition.users
        .map((user) => typeof user === 'string' ? user.trim() : '')
        .filter(Boolean);
    }

    if (condition.condition === CONDITION_TYPES.TIME && Array.isArray(condition.weekday)) {
      normalized.weekday = condition.weekday
        .map((day) => typeof day === 'string' ? day.trim() : '')
        .filter((day) => VALID_WEEKDAYS.includes(day));
    }

    if (
      [CONDITION_TYPES.AND, CONDITION_TYPES.OR, CONDITION_TYPES.NOT].includes(condition.condition) &&
      Array.isArray(condition.conditions)
    ) {
      normalized.conditions = condition.conditions.map((nested) => this._normalizeCondition(nested));
    }

    return normalized;
  }

  /**
   * Normalize section visibility object
   *
   * @param {Object} sectionVisibility - Section visibility config
   * @returns {Object} Normalized section visibility
   * @private
   * @static
   */
  static _normalizeSectionVisibility(sectionVisibility) {
    const source = isObject(sectionVisibility) ? sectionVisibility : {};
    const normalizeList = (value) => (
      Array.isArray(value) ? value.map(c => this._normalizeCondition(c)) : []
    );

    return {
      header: normalizeList(source.header),
      body: normalizeList(source.body),
      footer: normalizeList(source.footer)
    };
  }

  /**
   * Normalize theme token overrides
   *
   * @param {Object} themeTokens - Theme tokens object
   * @returns {Object} Normalized token map
   * @private
   * @static
   */
  static _normalizeThemeTokens(themeTokens) {
    if (!isObject(themeTokens)) {
      return {};
    }

    const result = {};
    const tokenNameRegex = /^--[a-z0-9_-]+$/i;

    Object.entries(themeTokens).forEach(([name, value]) => {
      if (!tokenNameRegex.test(name)) return;
      if (typeof value !== 'string') return;
      const tokenValue = value.trim();
      if (!tokenValue) return;
      result[name] = tokenValue;
    });

    return result;
  }

  /**
   * Normalize state styles object.
   *
   * @private
   * @param {*} stateStyles
   * @returns {Record<string, Record<string, string | number | string[]>>}
   */
  static _normalizeStateStyles(stateStyles) {
    if (!isObject(stateStyles)) {
      return {};
    }

    const normalized = {};

    Object.entries(stateStyles).forEach(([matcher, style]) => {
      const matcherKey = typeof matcher === 'string' ? matcher.trim() : '';
      if (!matcherKey || !isObject(style)) {
        return;
      }

      const normalizedStyle: Record<string, string | number | string[]> = {};

      Object.entries(style).forEach(([key, value]) => {
        if (key === 'class') {
          if (Array.isArray(value)) {
            const classList = value
              .map((entry) => typeof entry === 'string' ? entry.trim() : '')
              .filter(Boolean);
            if (classList.length > 0) {
              normalizedStyle.class = classList;
            }
            return;
          }

          if (typeof value === 'string' && value.trim()) {
            normalizedStyle.class = value.trim();
          }
          return;
        }

        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (trimmed) {
            normalizedStyle[key] = trimmed;
          }
          return;
        }

        if (isNumber(value)) {
          normalizedStyle[key] = value;
        }
      });

      if (Object.keys(normalizedStyle).length > 0) {
        normalized[matcherKey] = normalizedStyle;
      }
    });

    return normalized;
  }

  /**
   * Normalize swipe gesture config.
   *
   * @private
   * @param {*} swipe
   * @returns {Record<string, any>}
   */
  static _normalizeSwipe(swipe) {
    if (!isObject(swipe)) {
      return {
        enabled: DEFAULTS.swipe_enabled,
        direction: DEFAULTS.swipe_direction,
        threshold: DEFAULTS.swipe_threshold,
        velocityThreshold: DEFAULTS.swipe_velocity_threshold,
        preventScroll: DEFAULTS.swipe_prevent_scroll
      };
    }

    const normalized = {
      enabled: swipe.enabled ?? DEFAULTS.swipe_enabled,
      direction: swipe.direction || DEFAULTS.swipe_direction,
      threshold: swipe.threshold ?? DEFAULTS.swipe_threshold,
      velocityThreshold: swipe.velocityThreshold ?? DEFAULTS.swipe_velocity_threshold,
      preventScroll: swipe.preventScroll ?? DEFAULTS.swipe_prevent_scroll
    };

    ['left', 'right', 'up', 'down'].forEach((direction) => {
      if (!isObject(swipe[direction]) || !swipe[direction].action || swipe[direction].action === 'none') {
        return;
      }

      normalized[direction] = {
        action: swipe[direction].action
      };
    });

    return normalized;
  }

  /**
   * Normalize badge configs.
   *
   * @private
   * @param {*} badges
   * @returns {Array<Record<string, any>>}
   */
  static _normalizeBadges(badges) {
    if (!Array.isArray(badges)) {
      return [];
    }

    return badges
      .filter((badge) => isObject(badge))
      .map((badge) => {
        const normalized = {
          ...badge,
          type: badge.type || BADGE_TYPES.STATE
        };

        ['entity', 'attribute', 'icon', 'color', 'label', 'unit', 'domain', 'state', 'count_state'].forEach((field) => {
          if (typeof normalized[field] === 'string') {
            const trimmed = normalized[field].trim();
            if (trimmed) {
              normalized[field] = trimmed;
            } else {
              delete normalized[field];
            }
          }
        });

        if (typeof normalized.value === 'string') {
          const trimmed = normalized.value.trim();
          if (trimmed) {
            normalized.value = trimmed;
          } else {
            delete normalized.value;
          }
        }

        if (Array.isArray(normalized.entities)) {
          normalized.entities = [...new Set(
            normalized.entities
              .map((entityId) => typeof entityId === 'string' ? entityId.trim() : '')
              .filter(Boolean)
          )];
          if (normalized.entities.length === 0) {
            delete normalized.entities;
          }
        }

        if (Array.isArray(normalized.thresholds)) {
          normalized.thresholds = normalized.thresholds
            .filter((threshold) => isObject(threshold) && isNumber(threshold.value) && typeof threshold.color === 'string' && threshold.color.trim())
            .map((threshold) => ({
              value: threshold.value,
              color: threshold.color.trim()
            }));
          if (normalized.thresholds.length === 0) {
            delete normalized.thresholds;
          }
        }

        if (Array.isArray(normalized.visibility)) {
          normalized.visibility = normalized.visibility
            .filter((rule) => isObject(rule) && VALID_BADGE_OPERATORS.includes(rule.operator))
            .map((rule) => this._normalizeBadgeRule(rule))
            .filter(Boolean);
          if (normalized.visibility.length === 0) {
            delete normalized.visibility;
          }
        }

        if (Array.isArray(normalized.color_rules)) {
          normalized.color_rules = normalized.color_rules
            .filter((rule) => isObject(rule) && VALID_BADGE_OPERATORS.includes(rule.operator))
            .map((rule) => this._normalizeBadgeColorRule(rule))
            .filter(Boolean);
          if (normalized.color_rules.length === 0) {
            delete normalized.color_rules;
          }
        }

        return normalized;
      });
  }

  /**
   * Normalize badge comparison rule.
   *
   * @private
   * @param {*} rule
   * @returns {Record<string, any> | null}
   */
  static _normalizeBadgeRule(rule) {
    if (!isObject(rule)) {
      return null;
    }

    const normalized: Record<string, any> = {
      operator: rule.operator || BADGE_OPERATORS.EQUALS,
      value: rule.value
    };

    if (typeof rule.entity === 'string') {
      const entity = rule.entity.trim();
      if (entity) {
        normalized.entity = entity;
      }
    }

    if (typeof rule.attribute === 'string') {
      const attribute = rule.attribute.trim();
      if (attribute) {
        normalized.attribute = attribute;
      }
    }

    if (typeof normalized.value === 'string') {
      const trimmed = normalized.value.trim();
      if (!trimmed) {
        return null;
      }
      normalized.value = trimmed;
    }

    return normalized;
  }

  /**
   * Normalize badge color rule.
   *
   * @private
   * @param {*} rule
   * @returns {Record<string, any> | null}
   */
  static _normalizeBadgeColorRule(rule) {
    const normalized = this._normalizeBadgeRule(rule);
    if (!normalized || typeof rule.color !== 'string' || !rule.color.trim()) {
      return null;
    }

    return {
      ...normalized,
      color: rule.color.trim()
    };
  }

  /**
   * Normalize a string or string-array value.
   *
   * @private
   * @param {*} value
   * @returns {string | string[] | undefined}
   */
  static _normalizeStringListValue(value) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed || undefined;
    }

    if (!Array.isArray(value)) {
      return undefined;
    }

    const entries = value
      .map((entry) => typeof entry === 'string' ? entry.trim() : '')
      .filter(Boolean);

    if (entries.length === 0) {
      return undefined;
    }

    return entries.length === 1 ? entries[0] : entries;
  }
  
  // ===========================================================================
  // UTILITIES
  // ===========================================================================
  
  /**
   * Get title from config, resolving entity names
   * 
   * @param {Object} config - Card config
   * @param {Object} hass - Home Assistant instance
   * @returns {string} Title string
   * @static
   */
  static getTitle(config, hass) {
    if (config.title) {
      return config.title;
    }
    
    if (config.entity && hass?.states?.[config.entity]) {
      return hass.states[config.entity].attributes.friendly_name || config.entity;
    }
    
    return '';
  }
  
  /**
   * Get subtitle from config
   * 
   * @param {Object} config - Card config
   * @param {Object} hass - Home Assistant instance
   * @returns {string} Subtitle string
   * @static
   */
  static getSubtitle(config, hass) {
    if (config.subtitle) {
      return config.subtitle;
    }
    
    if (config.entity && hass?.states?.[config.entity]) {
      return hass.states[config.entity].state;
    }
    
    return '';
  }
  
  /**
   * Check if configuration has changed
   * 
   * @param {Object} oldConfig - Previous config
   * @param {Object} newConfig - New config
   * @returns {boolean} True if changed
   * @static
   */
  static hasChanged(oldConfig, newConfig) {
    // Simple deep comparison
    return JSON.stringify(oldConfig) !== JSON.stringify(newConfig);
  }
  
  /**
   * Get configuration schema for editor
   * 
   * @returns {Object} JSON schema
   * @static
   */
  static getSchema() {
    const actionSchema = {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: Object.values(ACTION_TYPES),
          default: ACTION_TYPES.NONE
        },
        service: { type: 'string' },
        navigation_path: { type: 'string' },
        url_path: { type: 'string' }
      }
    };

    const swipeActionSchema = {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: VALID_SWIPE_ACTIONS,
          default: 'none'
        }
      }
    };

    const cardSchema = {
      type: 'object',
      properties: {
        type: { type: 'string' }
      }
    };

    const cardCollectionSchema = {
      type: 'array',
      items: cardSchema
    };

    const slotSchema = {
      type: 'object',
      properties: {
        cards: cardCollectionSchema
      }
    };

    const conditionSchema: { type: string; properties: Record<string, any> } = {
      type: 'object',
      properties: {
        condition: {
          type: 'string',
          enum: VALID_CONDITION_TYPES
        },
        entity: {
          type: 'string',
          description: 'Entity referenced by state-based visibility conditions.'
        },
        attribute: {
          type: 'string',
          description: 'Optional entity attribute used instead of the primary state.'
        },
        state: {
          type: ['string', 'array'],
          description: 'Allowed state or list of allowed states.',
          items: { type: 'string' }
        },
        state_not: {
          type: ['string', 'array'],
          description: 'Blocked state or list of blocked states.',
          items: { type: 'string' }
        },
        above: {
          type: 'number',
          description: 'Numeric lower bound (exclusive).'
        },
        below: {
          type: 'number',
          description: 'Numeric upper bound (exclusive).'
        },
        users: {
          type: 'array',
          description: 'Allowed user names or ids.',
          items: { type: 'string' }
        },
        is_admin: {
          type: 'boolean',
          description: 'Require current user to be an admin.'
        },
        is_owner: {
          type: 'boolean',
          description: 'Require current user to be the owner.'
        },
        after: {
          type: 'string',
          description: 'Show only after the given HH:MM time.'
        },
        before: {
          type: 'string',
          description: 'Show only before the given HH:MM time.'
        },
        weekday: {
          type: 'array',
          description: 'Allowed weekdays.',
          items: {
            type: 'string',
            enum: VALID_WEEKDAYS
          }
        },
        media_query: {
          type: 'string',
          description: 'CSS media query matched against the current viewport.'
        },
        min_width: {
          type: 'number',
          description: 'Minimum viewport width in pixels.'
        },
        max_width: {
          type: 'number',
          description: 'Maximum viewport width in pixels.'
        }
      }
    };

    conditionSchema.properties.conditions = {
      type: 'array',
      description: 'Nested logical conditions for and/or/not groups.',
      items: conditionSchema
    };

    const stateStyleSchema = {
      type: 'object',
      properties: {
        background: { type: ['string', 'number'] },
        color: { type: ['string', 'number'] },
        border: { type: ['string', 'number'] },
        class: {
          type: ['string', 'array'],
          items: { type: 'string' }
        }
      }
    };

    const badgeThresholdSchema = {
      type: 'object',
      properties: {
        value: { type: 'number' },
        color: { type: 'string' }
      }
    };

    const badgeSchema = {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: VALID_BADGE_TYPES,
          default: BADGE_TYPES.STATE
        },
        entity: { type: 'string' },
        attribute: { type: 'string' },
        icon: { type: 'string' },
        color: { type: 'string' },
        value: { type: ['string', 'number'] },
        label: { type: 'string' },
        unit: { type: 'string' },
        min: { type: 'number' },
        max: { type: 'number' },
        icon_only: { type: 'boolean', default: false },
        show_name: { type: 'boolean', default: false },
        show_progress: { type: 'boolean', default: false },
        precision: {
          type: 'number',
          minimum: 0,
          maximum: LIMITS.BADGE_MAX_PRECISION
        },
        format: {
          type: 'string',
          enum: VALID_BADGE_FORMATS,
          default: BADGE_FORMATS.NONE
        },
        entities: {
          type: 'array',
          items: { type: 'string' }
        },
        domain: { type: 'string' },
        state: { type: 'string' },
        count_state: { type: 'string' },
        thresholds: {
          type: 'array',
          items: badgeThresholdSchema
        },
        visibility: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              operator: {
                type: 'string',
                enum: VALID_BADGE_OPERATORS,
                default: BADGE_OPERATORS.EQUALS
              },
              value: { type: ['string', 'number', 'boolean'] },
              entity: { type: 'string' },
              attribute: { type: 'string' }
            }
          }
        },
        color_rules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              operator: {
                type: 'string',
                enum: VALID_BADGE_OPERATORS,
                default: BADGE_OPERATORS.EQUALS
              },
              value: { type: ['string', 'number', 'boolean'] },
              entity: { type: 'string' },
              attribute: { type: 'string' },
              color: { type: 'string' }
            }
          }
        },
        tap_action: actionSchema,
        icon_tap_action: actionSchema
      }
    };

    const swipeSchema = {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          default: DEFAULTS.swipe_enabled
        },
        direction: {
          type: 'string',
          enum: VALID_SWIPE_DIRECTIONS,
          default: DEFAULTS.swipe_direction
        },
        threshold: {
          type: 'number',
          minimum: 0,
          maximum: LIMITS.SWIPE_MAX_THRESHOLD_PX,
          default: DEFAULTS.swipe_threshold
        },
        velocityThreshold: {
          type: 'number',
          minimum: 0,
          maximum: LIMITS.SWIPE_MAX_VELOCITY_THRESHOLD,
          default: DEFAULTS.swipe_velocity_threshold
        },
        preventScroll: {
          type: 'boolean',
          default: DEFAULTS.swipe_prevent_scroll
        },
        left: swipeActionSchema,
        right: swipeActionSchema,
        up: swipeActionSchema,
        down: swipeActionSchema
      }
    };

    return {
      type: 'object',
      properties: {
        config_version: {
          type: 'number',
          minimum: LEGACY_CONFIG_VERSION,
          maximum: CURRENT_CONFIG_VERSION,
          default: CURRENT_CONFIG_VERSION,
          description: 'Config contract version. Legacy configs are migrated to the current version during normalize().'
        },
        card_id: {
          type: 'string',
          description: 'Stable identifier for cross-card control and persisted mode state.'
        },
        title: {
          type: 'string',
          description: 'Primary card title.'
        },
        subtitle: {
          type: 'string',
          description: 'Optional secondary title shown in the header.'
        },
        icon: {
          type: 'string',
          description: 'Header icon in mdi format.'
        },
        entity: {
          type: 'string',
          description: 'Primary Home Assistant entity bound to the card.'
        },
        attribute: {
          type: 'string',
          description: 'Optional root attribute used by state_styles and other state-aware features.'
        },
        body_mode: { 
          type: 'string', 
          enum: VALID_BODY_MODES,
          default: BODY_MODES.EXPAND,
          description: 'Presentation mode used for the body region.'
        },
        expand_trigger: {
          type: 'string',
          enum: VALID_EXPAND_TRIGGERS,
          default: DEFAULTS.expand_trigger,
          description: 'Header gesture that toggles body expansion by default.'
        },
        theme: { 
          type: 'string', 
          enum: Object.values(THEMES),
          default: DEFAULTS.theme,
          description: 'Theme preset applied to the card shell.'
        },
        padding: {
          type: 'string',
          default: DEFAULTS.padding,
          description: 'Internal card padding.'
        },
        border_radius: {
          type: 'string',
          default: DEFAULTS.border_radius,
          description: 'Border radius applied to the card shell.'
        },
        expanded: {
          type: 'boolean',
          default: false,
          description: 'Whether the card starts expanded.'
        },
        animation: {
          type: 'boolean',
          default: true,
          description: 'Master switch for card animations.'
        },
        animation_duration: {
          type: 'number',
          minimum: 0,
          maximum: LIMITS.ANIMATION_DURATION_MAX_MS,
          default: DEFAULTS.animation_duration,
          description: 'Base animation duration applied to body and nested cards.'
        },
        expand_animation: {
          type: 'string',
          enum: VALID_EXPAND_ANIMATIONS,
          default: DEFAULTS.expand_animation,
          description: 'Body expand animation variant.'
        },
        collapse_animation: {
          type: 'string',
          enum: VALID_COLLAPSE_ANIMATIONS,
          default: DEFAULTS.collapse_animation,
          description: 'Body collapse animation variant.'
        },
        cards_animation: {
          type: 'string',
          enum: VALID_CARD_ANIMATIONS,
          default: DEFAULTS.cards_animation,
          description: 'Nested card reveal animation variant.'
        },
        cards_stagger: {
          type: 'number',
          minimum: 0,
          maximum: LIMITS.CARDS_STAGGER_MAX_MS,
          default: DEFAULTS.cards_stagger,
          description: 'Delay between nested card reveal steps in milliseconds.'
        },
        cards_direction: {
          type: 'string',
          enum: VALID_CARD_DIRECTIONS,
          default: DEFAULTS.cards_direction,
          description: 'Ordering strategy for nested card reveal.'
        },
        stability_mode: {
          type: 'boolean',
          default: false,
          description: 'Disables high-risk effects for predictable rendering.'
        },
        lazy_load: {
          type: 'boolean',
          default: true,
          description: 'Enables progressive body card loading.'
        },
        lazy_initial_batch: {
          type: 'number',
          minimum: LIMITS.LAZY_MIN_BATCH,
          maximum: LIMITS.LAZY_MAX_BATCH,
          default: DEFAULTS.lazy_initial_batch,
          description: 'Initial number of cards to load before idle batching.'
        },
        lazy_batch_size: {
          type: 'number',
          minimum: LIMITS.LAZY_MIN_BATCH,
          maximum: LIMITS.LAZY_MAX_BATCH,
          default: DEFAULTS.lazy_batch_size,
          description: 'Number of cards added on each idle lazy-load pass.'
        },
        lazy_idle_timeout: {
          type: 'number',
          minimum: LIMITS.LAZY_MIN_TIMEOUT_MS,
          maximum: LIMITS.LAZY_MAX_TIMEOUT_MS,
          default: DEFAULTS.lazy_idle_timeout,
          description: 'Idle callback timeout used for deferred body work.'
        },
        auto_collapse_after: {
          type: 'number',
          minimum: 0,
          maximum: LIMITS.AUTO_COLLAPSE_MAX_SECONDS,
          default: DEFAULTS.auto_collapse_after,
          description: 'Automatically collapse the card after N seconds. Set 0 to disable.'
        },
        remember_expanded_state: {
          type: 'boolean',
          default: DEFAULTS.remember_expanded_state,
          description: 'Persist expanded/collapsed state across renders.'
        },
        remember_mode_state: {
          type: 'boolean',
          default: DEFAULTS.remember_mode_state,
          description: 'Persist active tab and slide indices across renders.'
        },
        enable_card_pool: {
          type: 'boolean',
          default: DEFAULTS.enable_card_pool,
          description: 'Reuse detached body card elements to reduce churn.'
        },
        pool_scope: {
          type: 'string',
          enum: VALID_POOL_SCOPES,
          default: DEFAULTS.pool_scope,
          description: 'Reuse scope for pooled body card elements.'
        },
        pool_ttl_ms: {
          type: 'number',
          minimum: LIMITS.POOL_MIN_TTL_MS,
          maximum: LIMITS.POOL_MAX_TTL_MS,
          default: DEFAULTS.pool_ttl_ms,
          description: 'Time-to-live for pooled body card instances.'
        },
        pool_max_entries: {
          type: 'number',
          minimum: LIMITS.POOL_MIN_MAX_ENTRIES,
          maximum: LIMITS.POOL_MAX_MAX_ENTRIES,
          default: DEFAULTS.pool_max_entries,
          description: 'Maximum pooled entries retained for a reuse scope.'
        },
        show_expand_icon: {
          type: 'boolean',
          default: DEFAULTS.show_expand_icon,
          description: 'Show the expand/collapse affordance in the header.'
        },
        expand_icon: {
          type: 'string',
          default: DEFAULTS.expand_icon,
          description: 'Icon used for the expand affordance.'
        },
        sticky_header: {
          type: 'boolean',
          default: false,
          description: 'Keep the header pinned while the body scrolls.'
        },
        grid: {
          type: 'object',
          properties: {
            columns: {
              type: ['number', 'string'],
              minimum: LIMITS.MIN_GRID_COLUMNS,
              maximum: LIMITS.MAX_GRID_COLUMNS,
              default: DEFAULTS.grid_columns,
              description: 'Column count or CSS grid-template-columns string.'
            },
            gap: {
              type: 'string',
              default: DEFAULTS.grid_gap,
              description: 'Gap between grid items.'
            }
          }
        },
        modal: {
          type: 'object',
          description: 'Modal body mode sizing and overlay behavior.',
          properties: {
            width: {
              type: 'string',
              default: DEFAULTS.modal_width,
              description: 'Modal width. Use CSS lengths or auto.'
            },
            height: {
              type: 'string',
              default: DEFAULTS.modal_height,
              description: 'Modal height. Use CSS lengths or auto.'
            },
            max_width: {
              type: 'string',
              default: DEFAULTS.modal_max_width,
              description: 'Maximum width cap applied to the modal dialog.'
            },
            max_height: {
              type: 'string',
              default: DEFAULTS.modal_max_height,
              description: 'Maximum height cap applied to the modal dialog.'
            },
            backdrop_blur: {
              type: 'boolean',
              default: true
            },
            backdrop_color: {
              type: 'string',
              default: DEFAULTS.backdrop_color
            },
            close_on_backdrop: {
              type: 'boolean',
              default: true
            },
            close_on_escape: {
              type: 'boolean',
              default: true
            },
            show_close: {
              type: 'boolean',
              default: true
            }
          }
        },
        header: {
          ...slotSchema,
          description: 'Header region configuration.'
        },
        header_left: {
          ...slotSchema,
          description: 'Cards rendered in the left header slot.'
        },
        header_right: {
          ...slotSchema,
          description: 'Cards rendered in the right header slot.'
        },
        body: {
          ...slotSchema,
          description: 'Body region configuration.'
        },
        footer: {
          ...slotSchema,
          description: 'Footer region configuration.'
        },
        tabs: {
          type: 'array',
          description: 'Tab definitions used by tabs body mode.',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              icon: { type: 'string' },
              cards: cardCollectionSchema
            }
          }
        },
        carousel_autoplay: {
          type: 'boolean',
          default: DEFAULTS.carousel_autoplay,
          description: 'Automatically advance slides in carousel mode.'
        },
        carousel_interval: {
          type: 'number',
          minimum: LIMITS.CAROUSEL_MIN_INTERVAL_MS,
          maximum: LIMITS.CAROUSEL_MAX_INTERVAL_MS,
          default: DEFAULTS.carousel_interval,
          description: 'Delay between autoplay slide changes in carousel mode.'
        },
        tap_action: {
          ...actionSchema,
          description: 'Action executed on tap.'
        },
        hold_action: {
          ...actionSchema,
          description: 'Action executed on hold.'
        },
        double_tap_action: {
          ...actionSchema,
          description: 'Action executed on double tap.'
        },
        visibility: {
          type: 'array',
          description: 'Top-level card visibility conditions.',
          items: conditionSchema
        },
        section_visibility: {
          type: 'object',
          description: 'Per-section visibility conditions for header/body/footer.',
          properties: {
            header: { type: 'array', items: conditionSchema },
            body: { type: 'array', items: conditionSchema },
            footer: { type: 'array', items: conditionSchema }
          }
        },
        swipe: {
          ...swipeSchema,
          description: 'Gesture handling for top-level card swipes.'
        },
        badges: {
          type: 'array',
          description: 'Header badge definitions.',
          items: badgeSchema
        },
        state_styles: {
          type: 'object',
          description: 'Map of states or numeric matchers to style overrides applied to the card shell.',
          additionalProperties: stateStyleSchema
        },
        theme_tokens: {
          type: 'object',
          description: 'CSS variable overrides applied after theme resolution.',
          additionalProperties: { type: 'string' }
        },
        custom_css: {
          type: ['string', 'object', 'array'],
          description: 'Scoped custom CSS definitions.'
        }
        // Additional schema properties...
      }
    };
  }

  /**
   * Validate custom CSS config structure.
   *
   * @private
   * @param {*} styles
   * @param {string} path
   */
  static _validateCustomCSS(styles, path) {
    if (typeof styles === 'string') {
      return;
    }

    if (Array.isArray(styles)) {
      styles.forEach((entry, index) => {
        this._validateCustomCSS(entry, `${path}[${index}]`);
      });
      return;
    }

    if (!isObject(styles)) {
      throw new ConfigValidationError(
        'custom_css must be a string, object, or array',
        path
      );
    }

    const styleKeys = ['css', 'scope', 'mode', 'priority', 'id'];
    const isStyleObject = styleKeys.some((key) => key in styles);
    if (isStyleObject) {
      if (styles.css !== undefined && typeof styles.css !== 'string') {
        throw new ConfigValidationError(
          'custom_css.css must be a string',
          `${path}.css`
        );
      }
      if (styles.scope !== undefined && typeof styles.scope !== 'string') {
        throw new ConfigValidationError(
          'custom_css.scope must be a string',
          `${path}.scope`
        );
      }
      return;
    }

    Object.entries(styles).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        throw new ConfigValidationError(
          'custom_css scoped values must be strings',
          `${path}.${key}`
        );
      }
    });
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ConfigManager;
