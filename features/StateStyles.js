/**
 * Universal Card - State-based Styles
 * 
 * Applies dynamic styles based on entity states.
 * Supports colors, backgrounds, borders, and CSS variables.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module features/StateStyles
 */

import { getStateValue, getAttributeValue } from '../utils/ha-helpers.js';

// =============================================================================
// STATE STYLES
// =============================================================================

/**
 * State-based styles manager
 * 
 * @class StateStyles
 */
export class StateStyles {
  
  /**
   * Create StateStyles instance
   * 
   * @param {Object} config - State styles configuration
   */
  constructor(config = {}) {
    /** @type {Object} State styles configuration */
    this._config = config;
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;
    
    /** @type {HTMLElement|null} Target element */
    this._element = null;
    
    /** @type {Object} Currently applied styles */
    this._appliedStyles = {};
  }
  
  // ===========================================================================
  // SETTERS
  // ===========================================================================
  
  /**
   * Set Home Assistant instance
   * 
   * @param {Object} hass - Home Assistant instance
   */
  set hass(hass) {
    this._hass = hass;
    this._update();
  }
  
  /**
   * Set target element
   * 
   * @param {HTMLElement} element - Target element
   */
  set element(element) {
    this._element = element;
    this._update();
  }
  
  /**
   * Set configuration
   * 
   * @param {Object} config - State styles config
   */
  set config(config) {
    this._config = config;
    this._update();
  }
  
  // ===========================================================================
  // UPDATE
  // ===========================================================================
  
  /**
   * Update styles based on current state
   */
  _update() {
    if (!this._element || !this._hass || !this._config) {
      return;
    }
    
    const { entity, state_styles, attribute } = this._config;
    
    if (!entity || !state_styles) {
      return;
    }
    
    // Get current state/attribute value
    let currentValue;
    if (attribute) {
      currentValue = getAttributeValue(this._hass, entity, attribute);
    } else {
      currentValue = getStateValue(this._hass, entity);
    }
    
    // Find matching style
    const matchingStyle = this._findMatchingStyle(currentValue, state_styles);
    
    // Apply styles
    this._applyStyles(matchingStyle);
  }
  
  /**
   * Find matching style for current value
   * 
   * @private
   * @param {string} value - Current state value
   * @param {Object} stateStyles - State styles map
   * @returns {Object|null} Matching style or null
   */
  _findMatchingStyle(value, stateStyles) {
    // Direct match
    if (stateStyles[value]) {
      return stateStyles[value];
    }
    
    // Check for numeric ranges
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Check threshold-based styles
      for (const [key, style] of Object.entries(stateStyles)) {
        // Format: ">20", "<10", ">=5", "<=100", "10-20"
        if (this._matchesNumericCondition(numValue, key)) {
          return style;
        }
      }
    }
    
    // Check for wildcard/default
    if (stateStyles['*'] || stateStyles['default']) {
      return stateStyles['*'] || stateStyles['default'];
    }
    
    return null;
  }
  
  /**
   * Check if value matches numeric condition
   * 
   * @private
   * @param {number} value - Numeric value
   * @param {string} condition - Condition string
   * @returns {boolean} True if matches
   */
  _matchesNumericCondition(value, condition) {
    // Range: "10-20"
    if (condition.includes('-') && !condition.startsWith('-')) {
      const [min, max] = condition.split('-').map(Number);
      return value >= min && value <= max;
    }
    
    // Greater than or equal: ">=20"
    if (condition.startsWith('>=')) {
      return value >= parseFloat(condition.slice(2));
    }
    
    // Less than or equal: "<=20"
    if (condition.startsWith('<=')) {
      return value <= parseFloat(condition.slice(2));
    }
    
    // Greater than: ">20"
    if (condition.startsWith('>')) {
      return value > parseFloat(condition.slice(1));
    }
    
    // Less than: "<20"
    if (condition.startsWith('<')) {
      return value < parseFloat(condition.slice(1));
    }
    
    return false;
  }
  
  /**
   * Apply styles to element
   * 
   * @private
   * @param {Object|null} styles - Styles to apply
   */
  _applyStyles(styles) {
    if (!this._element) return;
    
    // Remove previously applied styles
    this._removeAppliedStyles();
    
    if (!styles) return;
    
    // Apply new styles
    const styleMap = this._normalizeStyles(styles);
    
    Object.entries(styleMap).forEach(([property, value]) => {
      if (property.startsWith('--')) {
        // CSS custom property
        this._element.style.setProperty(property, value);
      } else {
        // Regular CSS property
        this._element.style[property] = value;
      }
      
      this._appliedStyles[property] = value;
    });
    
    // Apply classes if specified
    if (styles.class) {
      const classes = Array.isArray(styles.class) ? styles.class : [styles.class];
      classes.forEach(cls => this._element.classList.add(cls));
      this._appliedStyles._classes = classes;
    }
  }
  
  /**
   * Remove previously applied styles
   * 
   * @private
   */
  _removeAppliedStyles() {
    if (!this._element) return;
    
    Object.keys(this._appliedStyles).forEach(property => {
      if (property === '_classes') {
        // Remove classes
        this._appliedStyles._classes.forEach(cls => {
          this._element.classList.remove(cls);
        });
      } else if (property.startsWith('--')) {
        // Remove CSS custom property
        this._element.style.removeProperty(property);
      } else {
        // Remove regular CSS property
        this._element.style[property] = '';
      }
    });
    
    this._appliedStyles = {};
  }
  
  /**
   * Normalize style object to CSS properties
   * 
   * @private
   * @param {Object} styles - Style config
   * @returns {Object} Normalized styles
   */
  _normalizeStyles(styles) {
    const normalized = {};
    
    // Map common shortcuts to CSS properties
    const propertyMap = {
      background: 'background',
      bg: 'background',
      color: 'color',
      text_color: 'color',
      border: 'border',
      border_color: 'borderColor',
      border_width: 'borderWidth',
      border_radius: 'borderRadius',
      shadow: 'boxShadow',
      box_shadow: 'boxShadow',
      opacity: 'opacity',
      transform: 'transform',
      filter: 'filter'
    };
    
    Object.entries(styles).forEach(([key, value]) => {
      // Skip non-style properties
      if (key === 'class') return;
      
      // Map to CSS property
      const cssProperty = propertyMap[key] || key;
      
      // Convert snake_case to camelCase
      const camelProperty = cssProperty.replace(/_([a-z])/g, (_, letter) => 
        letter.toUpperCase()
      );
      
      normalized[camelProperty] = value;
    });
    
    return normalized;
  }
  
  // ===========================================================================
  // STATIC HELPERS
  // ===========================================================================
  
  /**
   * Get predefined state color
   * 
   * @static
   * @param {string} state - Entity state
   * @returns {string|null} Color or null
   */
  static getStateColor(state) {
    const stateColors = {
      // Binary states
      on: 'var(--state-active-color, #fdd835)',
      off: 'var(--state-inactive-color, #969696)',
      
      // Presence
      home: 'var(--state-home-color, #4caf50)',
      not_home: 'var(--state-not-home-color, #f44336)',
      
      // Alarm
      armed_home: 'var(--warning-color, #ff9800)',
      armed_away: 'var(--error-color, #f44336)',
      armed_night: 'var(--warning-color, #ff9800)',
      disarmed: 'var(--success-color, #4caf50)',
      triggered: 'var(--error-color, #f44336)',
      pending: 'var(--warning-color, #ff9800)',
      
      // Lock
      locked: 'var(--success-color, #4caf50)',
      unlocked: 'var(--warning-color, #ff9800)',
      
      // Cover
      open: 'var(--state-active-color, #fdd835)',
      closed: 'var(--state-inactive-color, #969696)',
      opening: 'var(--warning-color, #ff9800)',
      closing: 'var(--warning-color, #ff9800)',
      
      // Climate
      heating: 'var(--error-color, #f44336)',
      cooling: 'var(--info-color, #03a9f4)',
      idle: 'var(--state-inactive-color, #969696)',
      
      // Availability
      unavailable: 'var(--disabled-text-color, #bdbdbd)',
      unknown: 'var(--disabled-text-color, #bdbdbd)'
    };
    
    return stateColors[state] || null;
  }
  
  /**
   * Generate CSS for state-based icon colors
   * 
   * @static
   * @returns {string} CSS string
   */
  static getIconColorStyles() {
    return `
      /* State-based icon colors */
      .state-on { --icon-color: var(--state-active-color, #fdd835); }
      .state-off { --icon-color: var(--state-inactive-color, #969696); }
      .state-home { --icon-color: var(--state-home-color, #4caf50); }
      .state-not_home { --icon-color: var(--state-not-home-color, #f44336); }
      .state-unavailable { --icon-color: var(--disabled-text-color, #bdbdbd); }
    `;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default StateStyles;
