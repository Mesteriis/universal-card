/**
 * Universal Card - Base Mode Class
 * 
 * Abstract base class for all body modes.
 * Provides common functionality and interface.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module modes/BaseMode
 */

// =============================================================================
// BASE MODE CLASS
// =============================================================================

/**
 * Abstract base class for body modes
 * 
 * @class BaseMode
 * @abstract
 */
export class BaseMode {
  
  /**
   * Create a BaseMode instance
   * 
   * @param {Object} config - Mode configuration
   * @param {Object} options - Additional options
   */
  constructor(config, options = {}) {
    if (new.target === BaseMode) {
      throw new Error('BaseMode is an abstract class and cannot be instantiated directly');
    }
    
    /** @type {Object} Configuration */
    this._config = config;
    
    /** @type {Object} Options */
    this._options = options;
    
    /** @type {HTMLElement|null} Container element */
    this._container = null;
    
    /** @type {HTMLElement[]} Card elements */
    this._cards = [];
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;
    
    /** @type {boolean} Whether cards are loaded */
    this._loaded = false;
    
    /** @type {boolean} Whether mode is active/open */
    this._active = false;
  }
  
  // ===========================================================================
  // ABSTRACT METHODS (must be implemented by subclasses)
  // ===========================================================================
  
  /**
   * Render the mode container
   * 
   * @abstract
   * @returns {HTMLElement} Mode container element
   */
  render() {
    throw new Error('render() must be implemented by subclass');
  }
  
  /**
   * Open/activate the mode
   * 
   * @abstract
   * @returns {Promise<void>}
   */
  async open() {
    throw new Error('open() must be implemented by subclass');
  }
  
  /**
   * Close/deactivate the mode
   * 
   * @abstract
   * @returns {Promise<void>}
   */
  async close() {
    throw new Error('close() must be implemented by subclass');
  }
  
  /**
   * Get CSS styles for the mode
   * 
   * @abstract
   * @returns {string} CSS string
   */
  static getStyles() {
    throw new Error('getStyles() must be implemented by subclass');
  }
  
  // ===========================================================================
  // COMMON METHODS
  // ===========================================================================
  
  /**
   * Set Home Assistant instance
   * 
   * @param {Object} hass - Home Assistant instance
   */
  set hass(hass) {
    this._hass = hass;
    this._updateCardsHass(hass);
  }
  
  /**
   * Get Home Assistant instance
   * 
   * @returns {Object|null} Home Assistant instance
   */
  get hass() {
    return this._hass;
  }
  
  /**
   * Check if mode is active
   * 
   * @returns {boolean} True if active
   */
  get active() {
    return this._active;
  }
  
  /**
   * Check if cards are loaded
   * 
   * @returns {boolean} True if loaded
   */
  get loaded() {
    return this._loaded;
  }
  
  /**
   * Load cards asynchronously
   * 
   * @param {Object[]} configs - Card configurations
   * @returns {Promise<void>}
   */
  async loadCards(configs) {
    if (this._loaded || !Array.isArray(configs) || configs.length === 0) {
      this._loaded = true;
      return;
    }
    
    try {
      const helpers = await this._getCardHelpers();
      
      this._cards = await Promise.all(
        configs.map(config => this._createCard(config, helpers))
      );
      
      this._loaded = true;
      
    } catch (error) {
      console.error('[UniversalCard] Failed to load cards:', error);
      this._loaded = true;
    }
  }
  
  /**
   * Create a single card
   * 
   * @protected
   * @param {Object} config - Card configuration
   * @param {Object} helpers - Card helpers
   * @returns {Promise<HTMLElement>} Card element
   */
  async _createCard(config, helpers) {
    try {
      const card = await helpers.createCardElement(config);
      
      if (this._hass) {
        card.hass = this._hass;
      }
      
      return card;
      
    } catch (error) {
      console.error('[UniversalCard] Card creation error:', error);
      return this._createErrorCard(error, config);
    }
  }
  
  /**
   * Create error card placeholder
   * 
   * @protected
   * @param {Error} error - Error that occurred
   * @param {Object} config - Original card config
   * @returns {HTMLElement} Error card element
   */
  _createErrorCard(error, config) {
    const card = document.createElement('div');
    card.className = 'uc-error-card';
    card.innerHTML = `
      <div class="error-icon">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </div>
      <div class="error-message">${error.message || 'Error loading card'}</div>
      <button class="error-details-btn" title="View details">?</button>
    `;
    
    // Store error data for popup
    card._errorData = { error, config, stack: error.stack };
    
    // Bind details button
    const btn = card.querySelector('.error-details-btn');
    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this._showErrorDetails(card._errorData);
    });
    
    return card;
  }
  
  /**
   * Show error details popup
   * 
   * @protected
   * @param {Object} errorData - Error data
   */
  _showErrorDetails(errorData) {
    const popup = document.createElement('div');
    popup.className = 'uc-error-popup-overlay';
    popup.innerHTML = `
      <div class="uc-error-popup">
        <div class="popup-header">
          <span>Error Details</span>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-content">
          <div class="error-section">
            <strong>Message:</strong>
            <pre>${errorData.error?.message || 'Unknown error'}</pre>
          </div>
          <div class="error-section">
            <strong>Card Config:</strong>
            <pre>${JSON.stringify(errorData.config, null, 2)}</pre>
          </div>
          <div class="error-section">
            <strong>Stack Trace:</strong>
            <pre>${errorData.stack || 'No stack trace available'}</pre>
          </div>
        </div>
      </div>
    `;
    
    // Close handlers
    const close = () => popup.remove();
    popup.querySelector('.popup-close')?.addEventListener('click', close);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) close();
    });
    
    document.body.appendChild(popup);
  }
  
  /**
   * Get card helpers from Home Assistant
   * 
   * @protected
   * @returns {Promise<Object>} Card helpers
   */
  async _getCardHelpers() {
    if (window.loadCardHelpers) {
      return await window.loadCardHelpers();
    }
    
    // Wait for helpers to be available
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (window.loadCardHelpers) {
          clearInterval(check);
          window.loadCardHelpers().then(resolve);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(check);
        resolve(null);
      }, 10000);
    });
  }
  
  /**
   * Update hass on all cards
   * 
   * @protected
   * @param {Object} hass - Home Assistant instance
   */
  _updateCardsHass(hass) {
    this._cards.forEach(card => {
      if (card && 'hass' in card) {
        try {
          card.hass = hass;
        } catch {
          // Ignore errors
        }
      }
    });
  }
  
  /**
   * Append cards to container
   * 
   * @protected
   * @param {HTMLElement} container - Container element
   * @param {Object[]} [configs] - Card configs for grid properties
   */
  _appendCards(container, configs = []) {
    const fragment = document.createDocumentFragment();
    
    this._cards.forEach((card, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';
      
      // Apply grid span from config
      const config = configs[index];
      if (config?.colspan) {
        wrapper.style.gridColumn = `span ${config.colspan}`;
      }
      if (config?.rowspan) {
        wrapper.style.gridRow = `span ${config.rowspan}`;
      }
      
      wrapper.appendChild(card);
      fragment.appendChild(wrapper);
    });
    
    container.appendChild(fragment);
  }
  
  /**
   * Animate element
   * 
   * @protected
   * @param {HTMLElement} element - Element to animate
   * @param {string} animation - Animation class name
   * @param {number} [duration=300] - Animation duration in ms
   * @returns {Promise<void>}
   */
  _animate(element, animation, duration = 300) {
    return new Promise(resolve => {
      element.classList.add(animation);
      
      setTimeout(() => {
        element.classList.remove(animation);
        resolve();
      }, duration);
    });
  }
  
  /**
   * Wait for transition end
   * 
   * @protected
   * @param {HTMLElement} element - Element to wait for
   * @param {number} [timeout=500] - Timeout in ms
   * @returns {Promise<void>}
   */
  _waitForTransition(element, timeout = 500) {
    return new Promise(resolve => {
      const handler = () => {
        element.removeEventListener('transitionend', handler);
        resolve();
      };
      
      element.addEventListener('transitionend', handler);
      
      // Fallback timeout
      setTimeout(resolve, timeout);
    });
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the mode
   */
  destroy() {
    this._cards = [];
    this._container = null;
    this._loaded = false;
    this._active = false;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default BaseMode;
