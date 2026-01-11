/**
 * Universal Card - Responsive Breakpoints
 * 
 * Handles responsive grid and layout changes based on screen size.
 * Uses CSS media queries and ResizeObserver for efficient updates.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module features/ResponsiveBreakpoints
 */

import { debounce } from '../utils/performance.js';

// =============================================================================
// DEFAULT BREAKPOINTS
// =============================================================================

/**
 * Default breakpoint definitions
 */
export const DEFAULT_BREAKPOINTS = {
  xs: { max: 480 },
  sm: { min: 481, max: 768 },
  md: { min: 769, max: 1024 },
  lg: { min: 1025, max: 1280 },
  xl: { min: 1281 }
};

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================

/**
 * Responsive Breakpoints manager
 * 
 * @class ResponsiveBreakpoints
 */
export class ResponsiveBreakpoints {
  
  /**
   * Create ResponsiveBreakpoints instance
   * 
   * @param {Object} config - Breakpoint configuration
   * @param {Object} options - Additional options
   */
  constructor(config = {}, options = {}) {
    /** @type {Object} Breakpoint configuration */
    this._config = config;
    
    /** @type {Object} Options */
    this._options = options;
    
    /** @type {HTMLElement|null} Target element */
    this._element = null;
    
    /** @type {string} Current breakpoint name */
    this._currentBreakpoint = null;
    
    /** @type {ResizeObserver|null} Resize observer */
    this._resizeObserver = null;
    
    /** @type {Function[]} Change listeners */
    this._listeners = [];
    
    /** @type {Object} Media query lists */
    this._mediaQueries = {};
    
    /** @type {Function} Debounced update handler */
    this._debouncedUpdate = debounce(() => this._update(), 100);
  }
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  /**
   * Initialize with target element
   * 
   * @param {HTMLElement} element - Target element
   */
  init(element) {
    this._element = element;
    
    // Setup media queries
    this._setupMediaQueries();
    
    // Setup ResizeObserver for container queries
    if (this._config.useContainerQueries) {
      this._setupResizeObserver();
    }
    
    // Initial update
    this._update();
  }
  
  /**
   * Setup media query listeners
   * 
   * @private
   */
  _setupMediaQueries() {
    const breakpoints = this._config.breakpoints || DEFAULT_BREAKPOINTS;
    
    Object.entries(breakpoints).forEach(([name, config]) => {
      const query = this._buildMediaQuery(config);
      const mql = window.matchMedia(query);
      
      // Store reference
      this._mediaQueries[name] = mql;
      
      // Add listener
      const handler = () => this._debouncedUpdate();
      
      // Use modern API if available
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
      } else {
        mql.addListener(handler);
      }
    });
  }
  
  /**
   * Build media query string from config
   * 
   * @private
   * @param {Object} config - Breakpoint config
   * @returns {string} Media query string
   */
  _buildMediaQuery(config) {
    const conditions = [];
    
    if (config.min !== undefined) {
      conditions.push(`(min-width: ${config.min}px)`);
    }
    
    if (config.max !== undefined) {
      conditions.push(`(max-width: ${config.max}px)`);
    }
    
    return conditions.join(' and ') || 'all';
  }
  
  /**
   * Setup ResizeObserver for container queries
   * 
   * @private
   */
  _setupResizeObserver() {
    if (!this._element || !('ResizeObserver' in window)) {
      return;
    }
    
    this._resizeObserver = new ResizeObserver(entries => {
      this._debouncedUpdate();
    });
    
    this._resizeObserver.observe(this._element);
  }
  
  // ===========================================================================
  // UPDATE
  // ===========================================================================
  
  /**
   * Update current breakpoint
   * 
   * @private
   */
  _update() {
    const newBreakpoint = this._getCurrentBreakpoint();
    
    if (newBreakpoint !== this._currentBreakpoint) {
      const previousBreakpoint = this._currentBreakpoint;
      this._currentBreakpoint = newBreakpoint;
      
      // Apply styles
      this._applyBreakpointStyles(newBreakpoint);
      
      // Notify listeners
      this._notifyListeners(newBreakpoint, previousBreakpoint);
    }
  }
  
  /**
   * Get current breakpoint name
   * 
   * @private
   * @returns {string} Breakpoint name
   */
  _getCurrentBreakpoint() {
    // Check container width if using container queries
    if (this._config.useContainerQueries && this._element) {
      const width = this._element.offsetWidth;
      return this._getBreakpointForWidth(width);
    }
    
    // Check media queries
    for (const [name, mql] of Object.entries(this._mediaQueries)) {
      if (mql.matches) {
        return name;
      }
    }
    
    return 'default';
  }
  
  /**
   * Get breakpoint name for width
   * 
   * @private
   * @param {number} width - Width in pixels
   * @returns {string} Breakpoint name
   */
  _getBreakpointForWidth(width) {
    const breakpoints = this._config.breakpoints || DEFAULT_BREAKPOINTS;
    
    for (const [name, config] of Object.entries(breakpoints)) {
      const minOk = config.min === undefined || width >= config.min;
      const maxOk = config.max === undefined || width <= config.max;
      
      if (minOk && maxOk) {
        return name;
      }
    }
    
    return 'default';
  }
  
  /**
   * Apply breakpoint-specific styles
   * 
   * @private
   * @param {string} breakpoint - Breakpoint name
   */
  _applyBreakpointStyles(breakpoint) {
    if (!this._element) return;
    
    // Update data attribute
    this._element.dataset.breakpoint = breakpoint;
    
    // Get responsive config for this breakpoint
    const responsiveConfig = this._config.responsive?.[breakpoint];
    
    if (responsiveConfig) {
      // Apply grid columns
      if (responsiveConfig.columns !== undefined) {
        this._element.style.setProperty(
          '--uc-grid-columns', 
          responsiveConfig.columns
        );
      }
      
      // Apply gap
      if (responsiveConfig.gap !== undefined) {
        this._element.style.setProperty('--uc-gap', responsiveConfig.gap);
      }
      
      // Apply padding
      if (responsiveConfig.padding !== undefined) {
        this._element.style.setProperty('--uc-padding', responsiveConfig.padding);
      }
      
      // Apply custom styles
      if (responsiveConfig.styles) {
        Object.entries(responsiveConfig.styles).forEach(([prop, value]) => {
          if (prop.startsWith('--')) {
            this._element.style.setProperty(prop, value);
          } else {
            this._element.style[prop] = value;
          }
        });
      }
    }
  }
  
  /**
   * Notify change listeners
   * 
   * @private
   * @param {string} newBreakpoint - New breakpoint
   * @param {string} previousBreakpoint - Previous breakpoint
   */
  _notifyListeners(newBreakpoint, previousBreakpoint) {
    this._listeners.forEach(callback => {
      try {
        callback({
          breakpoint: newBreakpoint,
          previousBreakpoint,
          width: this._element?.offsetWidth || window.innerWidth
        });
      } catch (error) {
        console.error('[UniversalCard] Breakpoint listener error:', error);
      }
    });
  }
  
  // ===========================================================================
  // PUBLIC API
  // ===========================================================================
  
  /**
   * Get current breakpoint
   * 
   * @returns {string} Current breakpoint name
   */
  get current() {
    return this._currentBreakpoint;
  }
  
  /**
   * Check if current breakpoint matches
   * 
   * @param {string|string[]} breakpoints - Breakpoint(s) to check
   * @returns {boolean} True if matches
   */
  is(breakpoints) {
    const names = Array.isArray(breakpoints) ? breakpoints : [breakpoints];
    return names.includes(this._currentBreakpoint);
  }
  
  /**
   * Check if current width is at least given breakpoint
   * 
   * @param {string} breakpoint - Breakpoint name
   * @returns {boolean} True if at least
   */
  isAtLeast(breakpoint) {
    const order = Object.keys(this._config.breakpoints || DEFAULT_BREAKPOINTS);
    const currentIndex = order.indexOf(this._currentBreakpoint);
    const targetIndex = order.indexOf(breakpoint);
    
    return currentIndex >= targetIndex;
  }
  
  /**
   * Check if current width is at most given breakpoint
   * 
   * @param {string} breakpoint - Breakpoint name
   * @returns {boolean} True if at most
   */
  isAtMost(breakpoint) {
    const order = Object.keys(this._config.breakpoints || DEFAULT_BREAKPOINTS);
    const currentIndex = order.indexOf(this._currentBreakpoint);
    const targetIndex = order.indexOf(breakpoint);
    
    return currentIndex <= targetIndex;
  }
  
  /**
   * Register change listener
   * 
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onChange(callback) {
    this._listeners.push(callback);
    
    return () => {
      const index = this._listeners.indexOf(callback);
      if (index > -1) {
        this._listeners.splice(index, 1);
      }
    };
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the breakpoints manager
   */
  destroy() {
    // Remove resize observer
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    
    // Clear references
    this._mediaQueries = {};
    this._listeners = [];
    this._element = null;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ResponsiveBreakpoints;
