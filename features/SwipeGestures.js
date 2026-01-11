/**
 * Universal Card - Swipe Gestures
 * 
 * Handles swipe gestures for navigation and card control.
 * Supports horizontal and vertical swipes with configurable actions.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module features/SwipeGestures
 */

import { fireEvent } from '../utils/helpers.js';

// =============================================================================
// SWIPE GESTURES
// =============================================================================

/**
 * Swipe gesture handler
 * 
 * @class SwipeGestures
 */
export class SwipeGestures {
  
  /**
   * Create SwipeGestures instance
   * 
   * @param {HTMLElement} element - Element to attach gestures to
   * @param {Object} options - Gesture options
   */
  constructor(element, options = {}) {
    /** @type {HTMLElement} Target element */
    this._element = element;
    
    /** @type {Object} Options */
    this._options = {
      threshold: options.threshold || 50,
      velocityThreshold: options.velocityThreshold || 0.3,
      direction: options.direction || 'horizontal', // horizontal, vertical, both
      preventScroll: options.preventScroll || false,
      ...options
    };
    
    /** @type {Object} Touch start data */
    this._touchStart = { x: 0, y: 0, time: 0 };
    
    /** @type {Object} Touch current data */
    this._touchCurrent = { x: 0, y: 0 };
    
    /** @type {boolean} Is tracking touch */
    this._isTracking = false;
    
    /** @type {Function[]} Swipe listeners */
    this._listeners = {
      left: [],
      right: [],
      up: [],
      down: []
    };
    
    // Bind handlers
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);
    
    // Attach listeners
    this._attach();
  }
  
  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  
  /**
   * Attach event listeners
   * 
   * @private
   */
  _attach() {
    this._element.addEventListener('touchstart', this._handleTouchStart, { passive: true });
    this._element.addEventListener('touchmove', this._handleTouchMove, { passive: !this._options.preventScroll });
    this._element.addEventListener('touchend', this._handleTouchEnd);
    this._element.addEventListener('touchcancel', this._handleTouchEnd);
  }
  
  /**
   * Detach event listeners
   */
  destroy() {
    this._element.removeEventListener('touchstart', this._handleTouchStart);
    this._element.removeEventListener('touchmove', this._handleTouchMove);
    this._element.removeEventListener('touchend', this._handleTouchEnd);
    this._element.removeEventListener('touchcancel', this._handleTouchEnd);
    
    this._listeners = { left: [], right: [], up: [], down: [] };
  }
  
  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  
  /**
   * Handle touch start
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchStart(event) {
    const touch = event.touches[0];
    
    this._touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    this._touchCurrent = {
      x: touch.clientX,
      y: touch.clientY
    };
    
    this._isTracking = true;
  }
  
  /**
   * Handle touch move
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchMove(event) {
    if (!this._isTracking) return;
    
    const touch = event.touches[0];
    
    this._touchCurrent = {
      x: touch.clientX,
      y: touch.clientY
    };
    
    // Prevent scroll if configured and swiping in tracked direction
    if (this._options.preventScroll) {
      const deltaX = Math.abs(this._touchCurrent.x - this._touchStart.x);
      const deltaY = Math.abs(this._touchCurrent.y - this._touchStart.y);
      
      if (this._options.direction === 'horizontal' && deltaX > deltaY) {
        event.preventDefault();
      } else if (this._options.direction === 'vertical' && deltaY > deltaX) {
        event.preventDefault();
      }
    }
  }
  
  /**
   * Handle touch end
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchEnd(event) {
    if (!this._isTracking) return;
    
    this._isTracking = false;
    
    const deltaX = this._touchCurrent.x - this._touchStart.x;
    const deltaY = this._touchCurrent.y - this._touchStart.y;
    const deltaTime = Date.now() - this._touchStart.time;
    
    // Calculate velocity
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;
    
    // Determine swipe direction
    const direction = this._getSwipeDirection(deltaX, deltaY, velocityX, velocityY);
    
    if (direction) {
      this._triggerSwipe(direction, {
        deltaX,
        deltaY,
        velocityX,
        velocityY,
        duration: deltaTime
      });
    }
  }
  
  /**
   * Get swipe direction
   * 
   * @private
   * @param {number} deltaX - X delta
   * @param {number} deltaY - Y delta
   * @param {number} velocityX - X velocity
   * @param {number} velocityY - Y velocity
   * @returns {string|null} Direction or null
   */
  _getSwipeDirection(deltaX, deltaY, velocityX, velocityY) {
    const { threshold, velocityThreshold, direction } = this._options;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Check if swipe meets threshold (distance or velocity)
    const isHorizontalSwipe = absX > threshold || velocityX > velocityThreshold;
    const isVerticalSwipe = absY > threshold || velocityY > velocityThreshold;
    
    // Horizontal swipe
    if (direction !== 'vertical' && isHorizontalSwipe && absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    }
    
    // Vertical swipe
    if (direction !== 'horizontal' && isVerticalSwipe && absY > absX) {
      return deltaY > 0 ? 'down' : 'up';
    }
    
    return null;
  }
  
  /**
   * Trigger swipe event
   * 
   * @private
   * @param {string} direction - Swipe direction
   * @param {Object} data - Swipe data
   */
  _triggerSwipe(direction, data) {
    // Call registered listeners
    this._listeners[direction].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('[UniversalCard] Swipe callback error:', error);
      }
    });
    
    // Fire DOM event
    fireEvent(this._element, 'uc-swipe', {
      direction,
      ...data
    });
  }
  
  // ===========================================================================
  // PUBLIC API
  // ===========================================================================
  
  /**
   * Register swipe listener
   * 
   * @param {string} direction - Swipe direction (left, right, up, down)
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(direction, callback) {
    if (!this._listeners[direction]) {
      console.warn(`[UniversalCard] Invalid swipe direction: ${direction}`);
      return () => {};
    }
    
    this._listeners[direction].push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this._listeners[direction].indexOf(callback);
      if (index > -1) {
        this._listeners[direction].splice(index, 1);
      }
    };
  }
  
  /**
   * Register swipe left listener
   * 
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onSwipeLeft(callback) {
    return this.on('left', callback);
  }
  
  /**
   * Register swipe right listener
   * 
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onSwipeRight(callback) {
    return this.on('right', callback);
  }
  
  /**
   * Register swipe up listener
   * 
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onSwipeUp(callback) {
    return this.on('up', callback);
  }
  
  /**
   * Register swipe down listener
   * 
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onSwipeDown(callback) {
    return this.on('down', callback);
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default SwipeGestures;
