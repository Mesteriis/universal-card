/**
 * Universal Card - Visibility Conditions
 * 
 * Evaluates visibility conditions based on entity states,
 * user, time, screen size, and logical operators.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module features/VisibilityConditions
 */

import { getStateValue, getAttributeValue, getCurrentUser } from '../utils/ha-helpers.js';
import { CONDITION_TYPES } from '../core/constants.js';

// =============================================================================
// VISIBILITY CONDITIONS
// =============================================================================

/**
 * Visibility Conditions evaluator
 * 
 * @class VisibilityConditions
 */
export class VisibilityConditions {
  
  /**
   * Create VisibilityConditions instance
   * 
   * @param {Object[]} conditions - Array of condition configs
   */
  constructor(conditions = []) {
    /** @type {Object[]} Condition configurations */
    this._conditions = conditions;
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;
    
    /** @type {boolean} Cached result */
    this._cachedResult = true;
    
    /** @type {string|null} Cache key for invalidation */
    this._cacheKey = null;
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
    // Invalidate cache when hass changes
    this._cacheKey = null;
  }
  
  /**
   * Set conditions
   * 
   * @param {Object[]} conditions - Condition configurations
   */
  set conditions(conditions) {
    this._conditions = conditions;
    this._cacheKey = null;
  }
  
  // ===========================================================================
  // EVALUATION
  // ===========================================================================
  
  /**
   * Evaluate all conditions
   * 
   * @returns {boolean} True if visible
   */
  evaluate() {
    // No conditions = always visible
    if (!this._conditions || this._conditions.length === 0) {
      return true;
    }
    
    // Check cache
    const newCacheKey = this._generateCacheKey();
    if (newCacheKey === this._cacheKey) {
      return this._cachedResult;
    }
    
    // Evaluate all conditions (AND logic by default)
    const result = this._conditions.every(condition => 
      this._evaluateCondition(condition)
    );
    
    // Update cache
    this._cacheKey = newCacheKey;
    this._cachedResult = result;
    
    return result;
  }
  
  /**
   * Evaluate a single condition
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Condition result
   */
  _evaluateCondition(condition) {
    const type = condition.condition;
    
    switch (type) {
      case CONDITION_TYPES.STATE:
        return this._evaluateStateCondition(condition);
        
      case CONDITION_TYPES.NUMERIC_STATE:
        return this._evaluateNumericStateCondition(condition);
        
      case CONDITION_TYPES.USER:
        return this._evaluateUserCondition(condition);
        
      case CONDITION_TYPES.TIME:
        return this._evaluateTimeCondition(condition);
        
      case CONDITION_TYPES.SCREEN:
        return this._evaluateScreenCondition(condition);
        
      case CONDITION_TYPES.AND:
        return this._evaluateAndCondition(condition);
        
      case CONDITION_TYPES.OR:
        return this._evaluateOrCondition(condition);
        
      case CONDITION_TYPES.NOT:
        return this._evaluateNotCondition(condition);
        
      default:
        console.warn(`[UniversalCard] Unknown condition type: ${type}`);
        return true;
    }
  }
  
  /**
   * Evaluate state condition
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Result
   * 
   * @example
   * { condition: 'state', entity: 'light.room', state: 'on' }
   * { condition: 'state', entity: 'light.room', state: ['on', 'unavailable'] }
   * { condition: 'state', entity: 'light.room', state_not: 'off' }
   */
  _evaluateStateCondition(condition) {
    const { entity, state, state_not, attribute } = condition;
    
    if (!entity || !this._hass) return true;
    
    // Get current value
    let currentValue;
    if (attribute) {
      currentValue = getAttributeValue(this._hass, entity, attribute);
    } else {
      currentValue = getStateValue(this._hass, entity);
    }
    
    // Check state_not (negation)
    if (state_not !== undefined) {
      const notStates = Array.isArray(state_not) ? state_not : [state_not];
      return !notStates.includes(currentValue);
    }
    
    // Check state (match)
    if (state !== undefined) {
      const states = Array.isArray(state) ? state : [state];
      return states.includes(currentValue);
    }
    
    return true;
  }
  
  /**
   * Evaluate numeric state condition
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Result
   * 
   * @example
   * { condition: 'numeric_state', entity: 'sensor.temp', above: 20 }
   * { condition: 'numeric_state', entity: 'sensor.temp', below: 30 }
   * { condition: 'numeric_state', entity: 'sensor.temp', above: 20, below: 30 }
   */
  _evaluateNumericStateCondition(condition) {
    const { entity, attribute, above, below } = condition;
    
    if (!entity || !this._hass) return true;
    
    // Get current value
    let currentValue;
    if (attribute) {
      currentValue = getAttributeValue(this._hass, entity, attribute);
    } else {
      currentValue = getStateValue(this._hass, entity);
    }
    
    const numValue = parseFloat(currentValue);
    if (isNaN(numValue)) return false;
    
    // Check above
    if (above !== undefined && numValue <= above) {
      return false;
    }
    
    // Check below
    if (below !== undefined && numValue >= below) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Evaluate user condition
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Result
   * 
   * @example
   * { condition: 'user', users: ['admin', 'guest'] }
   * { condition: 'user', is_admin: true }
   */
  _evaluateUserCondition(condition) {
    const { users, is_admin, is_owner } = condition;
    
    if (!this._hass) return true;
    
    const currentUser = getCurrentUser(this._hass);
    if (!currentUser) return true;
    
    // Check specific users
    if (users && Array.isArray(users)) {
      if (!users.includes(currentUser.name) && !users.includes(currentUser.id)) {
        return false;
      }
    }
    
    // Check admin status
    if (is_admin !== undefined) {
      if (currentUser.is_admin !== is_admin) {
        return false;
      }
    }
    
    // Check owner status
    if (is_owner !== undefined) {
      if (currentUser.is_owner !== is_owner) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Evaluate time condition
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Result
   * 
   * @example
   * { condition: 'time', after: '08:00', before: '22:00' }
   * { condition: 'time', weekday: ['mon', 'tue', 'wed', 'thu', 'fri'] }
   */
  _evaluateTimeCondition(condition) {
    const { after, before, weekday } = condition;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Check after time
    if (after) {
      const [hours, minutes] = after.split(':').map(Number);
      const afterTime = hours * 60 + minutes;
      if (currentTime < afterTime) {
        return false;
      }
    }
    
    // Check before time
    if (before) {
      const [hours, minutes] = before.split(':').map(Number);
      const beforeTime = hours * 60 + minutes;
      if (currentTime >= beforeTime) {
        return false;
      }
    }
    
    // Check weekday
    if (weekday && Array.isArray(weekday)) {
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const currentDay = days[now.getDay()];
      if (!weekday.includes(currentDay)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Evaluate screen condition
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Result
   * 
   * @example
   * { condition: 'screen', media_query: '(min-width: 768px)' }
   * { condition: 'screen', min_width: 768 }
   * { condition: 'screen', max_width: 1024 }
   */
  _evaluateScreenCondition(condition) {
    const { media_query, min_width, max_width } = condition;
    
    // Media query
    if (media_query) {
      return window.matchMedia(media_query).matches;
    }
    
    const width = window.innerWidth;
    
    // Min width
    if (min_width !== undefined && width < min_width) {
      return false;
    }
    
    // Max width
    if (max_width !== undefined && width > max_width) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Evaluate AND condition (all must be true)
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Result
   * 
   * @example
   * { condition: 'and', conditions: [...] }
   */
  _evaluateAndCondition(condition) {
    const { conditions } = condition;
    
    if (!conditions || !Array.isArray(conditions)) {
      return true;
    }
    
    return conditions.every(c => this._evaluateCondition(c));
  }
  
  /**
   * Evaluate OR condition (at least one must be true)
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Result
   * 
   * @example
   * { condition: 'or', conditions: [...] }
   */
  _evaluateOrCondition(condition) {
    const { conditions } = condition;
    
    if (!conditions || !Array.isArray(conditions)) {
      return true;
    }
    
    return conditions.some(c => this._evaluateCondition(c));
  }
  
  /**
   * Evaluate NOT condition (invert result)
   * 
   * @private
   * @param {Object} condition - Condition config
   * @returns {boolean} Result
   * 
   * @example
   * { condition: 'not', conditions: [...] }
   */
  _evaluateNotCondition(condition) {
    const { conditions } = condition;
    
    if (!conditions || !Array.isArray(conditions)) {
      return true;
    }
    
    // NOT inverts the AND of all conditions
    return !conditions.every(c => this._evaluateCondition(c));
  }
  
  // ===========================================================================
  // CACHING
  // ===========================================================================
  
  /**
   * Generate cache key from current state
   * 
   * @private
   * @returns {string} Cache key
   */
  _generateCacheKey() {
    if (!this._hass) return 'no-hass';
    
    // Build key from relevant entity states
    const relevantEntities = this._getRelevantEntities();
    
    const stateValues = relevantEntities.map(entityId => {
      const state = this._hass.states[entityId];
      return state ? `${entityId}:${state.state}` : `${entityId}:null`;
    });
    
    // Add screen width for screen conditions
    const hasScreenCondition = this._conditions.some(c => 
      c.condition === CONDITION_TYPES.SCREEN
    );
    
    if (hasScreenCondition) {
      stateValues.push(`screen:${window.innerWidth}`);
    }
    
    // Add time for time conditions (rounded to minute)
    const hasTimeCondition = this._conditions.some(c => 
      c.condition === CONDITION_TYPES.TIME
    );
    
    if (hasTimeCondition) {
      const now = new Date();
      stateValues.push(`time:${now.getHours()}:${now.getMinutes()}`);
    }
    
    return stateValues.join('|');
  }
  
  /**
   * Get all entity IDs referenced in conditions
   * 
   * @private
   * @returns {string[]} Entity IDs
   */
  _getRelevantEntities() {
    const entities = new Set();
    
    const extractEntities = (conditions) => {
      conditions.forEach(condition => {
        if (condition.entity) {
          entities.add(condition.entity);
        }
        
        // Recurse into nested conditions
        if (condition.conditions && Array.isArray(condition.conditions)) {
          extractEntities(condition.conditions);
        }
      });
    };
    
    extractEntities(this._conditions);
    
    return Array.from(entities);
  }
  
  // ===========================================================================
  // UTILITIES
  // ===========================================================================
  
  /**
   * Check if conditions have any entity dependencies
   * 
   * @returns {boolean} True if has entity conditions
   */
  hasEntityDependencies() {
    return this._getRelevantEntities().length > 0;
  }
  
  /**
   * Check if conditions have screen dependencies
   * 
   * @returns {boolean} True if has screen conditions
   */
  hasScreenDependencies() {
    return this._conditions.some(c => c.condition === CONDITION_TYPES.SCREEN);
  }
  
  /**
   * Check if conditions have time dependencies
   * 
   * @returns {boolean} True if has time conditions
   */
  hasTimeDependencies() {
    return this._conditions.some(c => c.condition === CONDITION_TYPES.TIME);
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default VisibilityConditions;
