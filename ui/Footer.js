/**
 * Universal Card - Footer Component
 * 
 * Optional footer with slots, cards, and actions.
 * Similar structure to Header but with footer-specific features.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module ui/Footer
 */

import { fireEvent } from '../utils/helpers.js';
import { createCardElements, executeAction } from '../utils/ha-helpers.js';
import { ACTION_TYPES } from '../core/constants.js';

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

/**
 * Footer component for Universal Card
 * 
 * @class Footer
 */
export class Footer {
  
  /**
   * Create Footer instance
   * 
   * @param {Object} config - Footer configuration
   * @param {Object} options - Additional options
   */
  constructor(config, options = {}) {
    /** @type {Object} Configuration */
    this._config = config;
    
    /** @type {Object} Options */
    this._options = options;
    
    /** @type {HTMLElement|null} Root element */
    this._element = null;
    
    /** @type {HTMLElement[]} Left slot cards */
    this._leftCards = [];
    
    /** @type {HTMLElement[]} Right slot cards */
    this._rightCards = [];
    
    /** @type {HTMLElement[]} Content cards */
    this._contentCards = [];
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;
    
    /** @type {number|null} Hold timer */
    this._holdTimer = null;
    
    /** @type {boolean} Is holding */
    this._isHolding = false;
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
    this._updateCards(hass);
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the footer
   * 
   * @returns {HTMLElement} Footer element
   */
  render() {
    const config = this._config;
    
    // Create footer element
    this._element = document.createElement('div');
    this._element.className = this._getFooterClasses();
    
    // Build inner HTML
    this._element.innerHTML = `
      <div class="footer-left">
        <div class="footer-left-slot"></div>
      </div>
      <div class="footer-content">
        ${this._renderText()}
        <div class="footer-cards-slot"></div>
      </div>
      <div class="footer-right">
        <div class="footer-right-slot"></div>
        ${this._renderActions()}
      </div>
    `;
    
    // Bind events
    this._bindEvents();
    
    return this._element;
  }
  
  /**
   * Render footer text
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderText() {
    const { text, icon } = this._config;
    
    if (!text) return '';
    
    const iconHtml = icon ? `<ha-icon icon="${icon}"></ha-icon>` : '';
    
    return `
      <div class="footer-text">
        ${iconHtml}
        <span>${text}</span>
      </div>
    `;
  }
  
  /**
   * Render action buttons
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderActions() {
    const { actions } = this._config;
    
    if (!actions || !Array.isArray(actions)) return '';
    
    return actions.map((action, index) => `
      <button class="footer-action-btn" data-action-index="${index}">
        ${action.icon ? `<ha-icon icon="${action.icon}"></ha-icon>` : ''}
        ${action.label || ''}
      </button>
    `).join('');
  }
  
  /**
   * Get footer CSS classes
   * 
   * @private
   * @returns {string} Class string
   */
  _getFooterClasses() {
    const classes = ['footer'];
    
    if (this._config.sticky) {
      classes.push('sticky');
    }
    
    if (this._config.border_top !== false) {
      classes.push('with-border');
    }
    
    return classes.join(' ');
  }
  
  // ===========================================================================
  // CARDS
  // ===========================================================================
  
  /**
   * Load slot cards asynchronously
   * 
   * @returns {Promise<void>}
   */
  async loadCards() {
    const { footer_left, footer_right, cards } = this._config;
    
    const promises = [];
    
    // Load left slot cards
    if (footer_left?.cards) {
      promises.push(
        this._loadSlotCards(footer_left.cards, '.footer-left-slot', '_leftCards')
      );
    }
    
    // Load right slot cards
    if (footer_right?.cards) {
      promises.push(
        this._loadSlotCards(footer_right.cards, '.footer-right-slot', '_rightCards')
      );
    }
    
    // Load content cards
    if (cards) {
      promises.push(
        this._loadSlotCards(cards, '.footer-cards-slot', '_contentCards')
      );
    }
    
    await Promise.all(promises);
  }
  
  /**
   * Load cards into a slot
   * 
   * @private
   * @param {Object[]} configs - Card configurations
   * @param {string} selector - Slot selector
   * @param {string} storageKey - Instance property to store cards
   * @returns {Promise<void>}
   */
  async _loadSlotCards(configs, selector, storageKey) {
    if (!Array.isArray(configs) || configs.length === 0) return;
    
    const slot = this._element?.querySelector(selector);
    if (!slot) return;
    
    try {
      const cards = await createCardElements(configs);
      this[storageKey] = cards;
      
      const fragment = document.createDocumentFragment();
      
      cards.forEach(card => {
        if (this._hass) {
          card.hass = this._hass;
        }
        fragment.appendChild(card);
      });
      
      slot.appendChild(fragment);
      
    } catch (error) {
      console.error(`[UniversalCard] Failed to load footer cards:`, error);
    }
  }
  
  /**
   * Update hass on all cards
   * 
   * @private
   * @param {Object} hass - Home Assistant instance
   */
  _updateCards(hass) {
    const allCards = [
      ...this._leftCards,
      ...this._rightCards,
      ...this._contentCards
    ];
    
    allCards.forEach(card => {
      if (card && 'hass' in card) {
        try {
          card.hass = hass;
        } catch {
          // Ignore errors
        }
      }
    });
  }
  
  // ===========================================================================
  // EVENTS
  // ===========================================================================
  
  /**
   * Bind event handlers
   * 
   * @private
   */
  _bindEvents() {
    if (!this._element) return;
    
    // Action buttons
    this._element.querySelectorAll('.footer-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this._handleActionClick(e));
    });
    
    // Footer tap/hold if configured
    if (this._config.tap_action || this._config.hold_action) {
      this._element.addEventListener('click', (e) => this._handleClick(e));
      this._element.addEventListener('mousedown', (e) => this._handleMouseDown(e));
      this._element.addEventListener('mouseup', () => this._handleMouseUp());
      this._element.addEventListener('mouseleave', () => this._cancelHold());
    }
  }
  
  /**
   * Handle action button click
   * 
   * @private
   * @param {Event} event - Click event
   */
  _handleActionClick(event) {
    const btn = event.currentTarget;
    const index = parseInt(btn.dataset.actionIndex, 10);
    const action = this._config.actions?.[index];
    
    if (action) {
      executeAction(this._hass, this._element, action);
    }
  }
  
  /**
   * Handle click
   * 
   * @private
   * @param {Event} event - Click event
   */
  _handleClick(event) {
    if (this._isInteractiveElement(event.target)) return;
    if (this._isHolding) {
      this._isHolding = false;
      return;
    }
    
    this._executeAction('tap_action');
  }
  
  /**
   * Handle mouse down for hold
   * 
   * @private
   * @param {MouseEvent} event - Mouse event
   */
  _handleMouseDown(event) {
    if (event.button !== 0) return;
    if (this._isInteractiveElement(event.target)) return;
    
    this._holdTimer = setTimeout(() => {
      this._isHolding = true;
      this._executeAction('hold_action');
    }, 500);
  }
  
  /**
   * Handle mouse up
   * 
   * @private
   */
  _handleMouseUp() {
    if (this._holdTimer) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
  }
  
  /**
   * Cancel hold
   * 
   * @private
   */
  _cancelHold() {
    this._handleMouseUp();
    this._isHolding = false;
  }
  
  /**
   * Check if element is interactive
   * 
   * @private
   * @param {HTMLElement} target - Target element
   * @returns {boolean} True if interactive
   */
  _isInteractiveElement(target) {
    return target.closest('button, a, input, .footer-action-btn') !== null;
  }
  
  /**
   * Execute action
   * 
   * @private
   * @param {string} actionKey - Action config key
   */
  _executeAction(actionKey) {
    const actionConfig = this._config[actionKey];
    
    if (!actionConfig || actionConfig.action === ACTION_TYPES.NONE) {
      return;
    }
    
    executeAction(this._hass, this._element, actionConfig);
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the footer component
   */
  destroy() {
    this._cancelHold();
    this._leftCards = [];
    this._rightCards = [];
    this._contentCards = [];
    this._element = null;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Footer;
