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

import { getCurrentUser } from '../utils/ha-helpers.js';
import { CONDITION_TYPES } from '../core/constants.js';
import { normalizeDerivedProviderContext } from '../providers/DerivedProviderContext.js';
import type { HomeAssistantLike } from '../providers/ProviderContext.js';
import type {
  LogicalVisibilityCondition,
  NumericStateVisibilityCondition,
  ScreenVisibilityCondition,
  StateVisibilityCondition,
  TimeVisibilityCondition,
  UserVisibilityCondition,
  VisibilityCondition,
  VisibilityWeekday
} from '../core/config-contracts.js';
type DerivedProviderContextLike = ReturnType<typeof normalizeDerivedProviderContext>;

function hasNestedConditions(condition: VisibilityCondition): condition is LogicalVisibilityCondition {
  return 'conditions' in condition && Array.isArray(condition.conditions);
}

// =============================================================================
// VISIBILITY CONDITIONS
// =============================================================================

/**
 * Visibility Conditions evaluator
 * 
 * @class VisibilityConditions
 */
export class VisibilityConditions {
  _conditions: VisibilityCondition[];
  _hass: HomeAssistantLike;
  _providers: DerivedProviderContextLike | null;
  _cachedResult: boolean;
  _cacheKey: string | null;
  
  /**
   * Create VisibilityConditions instance
   * 
   * @param {Object[]} conditions - Array of condition configs
   */
  constructor(conditions: VisibilityCondition[] = []) {
    /** @type {Object[]} Condition configurations */
    this._conditions = conditions;
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;

    /** @type {Object|null} Derived provider context */
    this._providers = null;
    
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
  set hass(hass: HomeAssistantLike) {
    this._providers = normalizeDerivedProviderContext(hass);
    this._hass = this._providers.getHass();
    // Invalidate cache when hass changes
    this._cacheKey = null;
  }
  
  /**
   * Set conditions
   * 
   * @param {Object[]} conditions - Condition configurations
   */
  set conditions(conditions: VisibilityCondition[]) {
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
  _evaluateCondition(condition: VisibilityCondition) {
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
  _evaluateStateCondition(condition: StateVisibilityCondition) {
    const { entity, state, state_not, attribute } = condition;

    const providers = this._getProviders();
    if (!entity || !providers) return true;

    const currentValue = providers.derived.entities.getValue(entity, attribute);
    const normalizedCurrentValue = currentValue === undefined || currentValue === null
      ? ''
      : String(currentValue);
    
    // Check state_not (negation)
    if (state_not !== undefined) {
      const notStates = Array.isArray(state_not) ? state_not : [state_not];
      return !notStates.includes(normalizedCurrentValue);
    }
    
    // Check state (match)
    if (state !== undefined) {
      const states = Array.isArray(state) ? state : [state];
      return states.includes(normalizedCurrentValue);
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
  _evaluateNumericStateCondition(condition: NumericStateVisibilityCondition) {
    const { entity, attribute, above, below } = condition;

    const providers = this._getProviders();
    if (!entity || !providers) return true;

    const numValue = providers.derived.entities.getNumericValue(entity, attribute);
    if (numValue === null) return false;
    
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
  _evaluateUserCondition(condition: UserVisibilityCondition) {
    const { users, is_admin, is_owner } = condition;

    const providers = this._getProviders();
    if (!providers) return true;

    const currentUser = getCurrentUser(providers);
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
  _evaluateTimeCondition(condition: TimeVisibilityCondition) {
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
      const days: VisibilityWeekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
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
  _evaluateScreenCondition(condition: ScreenVisibilityCondition) {
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
  _evaluateAndCondition(condition: LogicalVisibilityCondition) {
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
  _evaluateOrCondition(condition: LogicalVisibilityCondition) {
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
  _evaluateNotCondition(condition: LogicalVisibilityCondition) {
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
    const providers = this._getProviders();
    if (!providers) return 'no-hass';

    // Build key from relevant entity states
    const relevantEntities = this._getRelevantEntities();

    const stateValues = relevantEntities.map(entityId => {
      const state = providers.entities.getState(entityId);
      return state ? `${entityId}:${state.state}` : `${entityId}:null`;
    });
    
    // Add screen width for screen conditions
    const hasScreenCondition = this._hasConditionType(CONDITION_TYPES.SCREEN);
    
    if (hasScreenCondition) {
      stateValues.push(`screen:${window.innerWidth}`);
    }
    
    // Add time for time conditions (rounded to minute)
    const hasTimeCondition = this._hasConditionType(CONDITION_TYPES.TIME);
    
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
    const entities = new Set<string>();
    
    const extractEntities = (conditions: VisibilityCondition[]) => {
      conditions.forEach(condition => {
        if ('entity' in condition && typeof condition.entity === 'string') {
          entities.add(condition.entity);
        }
        
        // Recurse into nested conditions
        if (hasNestedConditions(condition)) {
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
    return this._hasConditionType(CONDITION_TYPES.SCREEN);
  }
  
  /**
   * Check if conditions have time dependencies
   * 
   * @returns {boolean} True if has time conditions
   */
  hasTimeDependencies() {
    return this._hasConditionType(CONDITION_TYPES.TIME);
  }

  /**
   * Recursively check whether any nested condition matches a type.
   *
   * @private
   * @param {string} type
   * @param {Object[]} [conditions=this._conditions]
   * @returns {boolean}
   */
  _hasConditionType(type: string, conditions: VisibilityCondition[] = this._conditions) {
    if (!Array.isArray(conditions) || conditions.length === 0) {
      return false;
    }

    return conditions.some((condition) => {
      if (!condition || typeof condition !== 'object') {
        return false;
      }

      if (condition.condition === type) {
        return true;
      }

      return hasNestedConditions(condition)
        ? this._hasConditionType(type, condition.conditions)
        : false;
    });
  }

  /**
   * Resolve normalized provider context.
   *
   * @private
   * @returns {Object|null}
   */
  _getProviders(): DerivedProviderContextLike | null {
    if (this._providers) {
      return this._providers;
    }

    if (!this._hass) {
      return null;
    }

    this._providers = normalizeDerivedProviderContext(this._hass);
    this._hass = this._providers.getHass();
    return this._providers;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default VisibilityConditions;
