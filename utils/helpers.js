/**
 * Universal Card - Helper Utilities
 * 
 * General purpose utility functions following DRY principle.
 * Pure functions without side effects where possible.
 * 
 * @module utils/helpers
 */

// =============================================================================
// DEBUG LOGGING
// =============================================================================

/** @type {boolean} Debug mode flag */
let _debugEnabled = false;

/**
 * Enable or disable debug mode
 * @param {boolean} enabled - Enable debug logging
 */
export function setDebugMode(enabled) {
  _debugEnabled = enabled;
}

/**
 * Check if debug mode is enabled
 * @returns {boolean}
 */
export function isDebugMode() {
  return _debugEnabled;
}

/**
 * Debug log - only outputs when debug mode is enabled
 * @param {...any} args - Arguments to log
 */
export function debug(...args) {
  if (_debugEnabled) {
    console.log(...args);
  }
}

/**
 * Debug warn - only outputs when debug mode is enabled
 * @param {...any} args - Arguments to log
 */
export function debugWarn(...args) {
  if (_debugEnabled) {
    console.warn(...args);
  }
}

/**
 * Debug error - always outputs (errors are important)
 * @param {...any} args - Arguments to log
 */
export function debugError(...args) {
  console.error(...args);
}

// =============================================================================
// ID GENERATION
// =============================================================================

/**
 * Generate a unique ID with optional prefix
 * 
 * @param {string} [prefix='uc'] - ID prefix
 * @returns {string} Unique ID
 * 
 * @example
 * generateId('card'); // 'card-a1b2c3d4'
 */
export function generateId(prefix = 'uc') {
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${random}`;
}

// =============================================================================
// TYPE CHECKING
// =============================================================================

/**
 * Check if value is a plain object
 * 
 * @param {*} value - Value to check
 * @returns {boolean} True if plain object
 */
export function isObject(value) {
  return value !== null && 
         typeof value === 'object' && 
         !Array.isArray(value);
}

/**
 * Check if value is a non-empty string
 * 
 * @param {*} value - Value to check
 * @returns {boolean} True if non-empty string
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if value is a valid number
 * 
 * @param {*} value - Value to check
 * @returns {boolean} True if valid number
 */
export function isNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Check if value is a function
 * 
 * @param {*} value - Value to check
 * @returns {boolean} True if function
 */
export function isFunction(value) {
  return typeof value === 'function';
}

// =============================================================================
// OBJECT UTILITIES
// =============================================================================

/**
 * Deep merge two objects (immutable)
 * 
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object (new instance)
 * 
 * @example
 * deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } });
 * // { a: 1, b: { c: 2, d: 3 } }
 */
export function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

/**
 * Deep clone an object
 * 
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key]);
  });
  
  return cloned;
}

/**
 * Get nested property value safely
 * 
 * @param {Object} obj - Source object
 * @param {string} path - Dot-notation path
 * @param {*} [defaultValue] - Default if not found
 * @returns {*} Property value or default
 * 
 * @example
 * getNestedValue({ a: { b: { c: 1 } } }, 'a.b.c'); // 1
 * getNestedValue({ a: 1 }, 'a.b.c', 'default'); // 'default'
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
  if (!obj || !path) {
    return defaultValue;
  }
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Convert string to kebab-case
 * 
 * @param {string} str - Input string
 * @returns {string} Kebab-case string
 * 
 * @example
 * toKebabCase('myVariableName'); // 'my-variable-name'
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 * 
 * @param {string} str - Input string
 * @returns {string} camelCase string
 * 
 * @example
 * toCamelCase('my-variable-name'); // 'myVariableName'
 */
export function toCamelCase(str) {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toLowerCase());
}

/**
 * Capitalize first letter
 * 
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Ensure value is an array
 * 
 * @param {*} value - Input value
 * @returns {Array} Array
 */
export function ensureArray(value) {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

/**
 * Remove duplicates from array
 * 
 * @param {Array} arr - Input array
 * @param {Function} [keyFn] - Optional key function for objects
 * @returns {Array} Array without duplicates
 */
export function unique(arr, keyFn) {
  if (!keyFn) {
    return [...new Set(arr)];
  }
  
  const seen = new Set();
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// =============================================================================
// DOM UTILITIES
// =============================================================================

/**
 * Fire a custom DOM event
 * 
 * @param {HTMLElement} target - Event target
 * @param {string} type - Event type
 * @param {Object} [detail={}] - Event detail
 * @param {Object} [options={}] - Event options
 */
export function fireEvent(target, type, detail = {}, options = {}) {
  const event = new CustomEvent(type, {
    bubbles: options.bubbles !== false,
    cancelable: options.cancelable !== false,
    composed: options.composed !== false,
    detail
  });
  
  target.dispatchEvent(event);
  return event;
}

/**
 * Wait for next animation frame (double RAF for layout)
 * 
 * @returns {Promise<void>}
 */
export function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

/**
 * Wait for specified milliseconds
 * 
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format number with specified decimals
 * 
 * @param {number} value - Number to format
 * @param {number} [decimals=2] - Decimal places
 * @returns {string} Formatted number
 */
export function formatNumber(value, decimals = 2) {
  if (!isNumber(value)) return '';
  return value.toFixed(decimals);
}

/**
 * Format date/time
 * 
 * @param {Date|string|number} date - Date to format
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @param {string} [locale='ru-RU'] - Locale
 * @returns {string} Formatted date
 */
export function formatDateTime(date, options = {}, locale = 'ru-RU') {
  const d = date instanceof Date ? date : new Date(date);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(d);
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate entity ID format
 * 
 * @param {string} entityId - Entity ID to validate
 * @returns {boolean} True if valid
 */
export function isValidEntityId(entityId) {
  if (!isNonEmptyString(entityId)) return false;
  return /^[a-z_]+\.[a-z0-9_]+$/.test(entityId);
}

/**
 * Validate color format (hex, rgb, rgba, hsl, var)
 * 
 * @param {string} color - Color to validate
 * @returns {boolean} True if valid
 */
export function isValidColor(color) {
  if (!isNonEmptyString(color)) return false;
  
  // CSS variable
  if (color.startsWith('var(')) return true;
  
  // Hex color
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)) {
    return true;
  }
  
  // RGB/RGBA
  if (/^rgba?\([\d\s,%.]+\)$/.test(color)) return true;
  
  // HSL/HSLA
  if (/^hsla?\([\d\s,%.]+\)$/.test(color)) return true;
  
  // Named colors
  const namedColors = ['transparent', 'currentColor', 'inherit'];
  if (namedColors.includes(color)) return true;
  
  return false;
}
