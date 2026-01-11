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
  THEMES,
  ACTION_TYPES,
  CONDITION_TYPES,
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

// =============================================================================
// VALIDATION ERRORS
// =============================================================================

/**
 * Custom error for configuration validation
 */
export class ConfigValidationError extends Error {
  /**
   * @param {string} message - Error message
   * @param {string} [path] - Config path where error occurred
   */
  constructor(message, path) {
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
    // Must be an object
    if (!isObject(config)) {
      throw new ConfigValidationError('Configuration must be an object');
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
    
    // Validate body cards
    if (config.body?.cards) {
      if (!Array.isArray(config.body.cards)) {
        throw new ConfigValidationError('body.cards must be an array', 'body.cards');
      }
      
      if (config.body.cards.length > LIMITS.MAX_CARDS_PER_BODY) {
        throw new ConfigValidationError(
          `Maximum ${LIMITS.MAX_CARDS_PER_BODY} cards allowed in body`,
          'body.cards'
        );
      }
      
      config.body.cards.forEach((card, index) => {
        this._validateCardConfig(card, `body.cards[${index}]`);
      });
    }
    
    // Validate header cards
    if (config.header?.cards) {
      if (!Array.isArray(config.header.cards)) {
        throw new ConfigValidationError('header.cards must be an array', 'header.cards');
      }
      
      config.header.cards.forEach((card, index) => {
        this._validateCardConfig(card, `header.cards[${index}]`);
      });
    }
    
    // Validate tabs
    if (config.tabs) {
      this._validateTabs(config.tabs);
    }
    
    // Validate visibility conditions
    if (config.visibility) {
      this._validateConditions(config.visibility, 'visibility');
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
    
    const validTypes = Object.values(CONDITION_TYPES);
    
    conditions.forEach((condition, index) => {
      const conditionPath = `${path}[${index}]`;
      
      if (!isObject(condition)) {
        throw new ConfigValidationError(
          'Condition must be an object',
          conditionPath
        );
      }
      
      if (!condition.condition) {
        throw new ConfigValidationError(
          'Condition must have a "condition" type',
          conditionPath
        );
      }
      
      if (!validTypes.includes(condition.condition)) {
        throw new ConfigValidationError(
          `Invalid condition type: "${condition.condition}"`,
          conditionPath
        );
      }
    });
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
    // Validate first
    this.validate(config);
    
    // Start with defaults
    const normalized = {
      ...DEFAULTS,
      ...config
    };
    
    // Ensure card_id exists
    if (!normalized.card_id) {
      normalized.card_id = generateId('uc');
    }
    
    // Normalize header
    normalized.header = this._normalizeSection(config.header, 'header');
    
    // Normalize body - support both config.body.cards and config.cards
    if (config.body) {
      normalized.body = this._normalizeSection(config.body, 'body');
    } else if (config.cards) {
      // If cards specified at root level, move to body.cards
      normalized.body = { cards: config.cards };
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
    
    // Normalize actions
    normalized.tap_action = this._normalizeAction(config.tap_action, 'toggle');
    normalized.hold_action = this._normalizeAction(config.hold_action, 'none');
    normalized.double_tap_action = this._normalizeAction(config.double_tap_action, 'none');
    
    // Normalize visibility
    if (config.visibility) {
      normalized.visibility = config.visibility.map(c => this._normalizeCondition(c));
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
    
    // Ensure state is array for state conditions
    if (condition.condition === CONDITION_TYPES.STATE && condition.state) {
      normalized.state = Array.isArray(condition.state) 
        ? condition.state 
        : [condition.state];
    }
    
    return normalized;
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
    return {
      type: 'object',
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        icon: { type: 'string' },
        entity: { type: 'string' },
        body_mode: { 
          type: 'string', 
          enum: VALID_BODY_MODES,
          default: BODY_MODES.EXPAND
        },
        theme: { 
          type: 'string', 
          enum: Object.values(THEMES),
          default: THEMES.SOLID
        },
        expanded: { type: 'boolean', default: false },
        animation: { type: 'boolean', default: true },
        lazy_load: { type: 'boolean', default: true },
        show_expand_icon: { type: 'boolean', default: true },
        grid: {
          type: 'object',
          properties: {
            columns: { type: 'number', minimum: 1, maximum: 12 },
            gap: { type: 'string' }
          }
        }
        // Additional schema properties...
      }
    };
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ConfigManager;
