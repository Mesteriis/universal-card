/**
 * Universal Card - Header Component
 * 
 * Flexible header with slots, nested cards, badges, and actions.
 * Supports sticky mode and state-based styling.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module ui/Header
 */

import { fireEvent, generateId, debug } from '../utils/helpers.js';
import { createCardElements, executeAction, getStateValue } from '../utils/ha-helpers.js';
import { ACTION_TYPES } from '../core/constants.js';

// =============================================================================
// HEADER COMPONENT
// =============================================================================

/**
 * Header component for Universal Card
 * 
 * @class Header
 */
export class Header {
  
  /**
   * Create Header instance
   * 
   * @param {Object} config - Header configuration
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
    
    /** @type {boolean} Expanded state */
    this._expanded = false;
    
    /** @type {number|null} Hold timer */
    this._holdTimer = null;
    
    /** @type {boolean} Is holding */
    this._isHolding = false;
    
    /** @type {number} Hold duration ms */
    this._holdDuration = 500;
    
    /** @type {number} Last tap time for double-tap detection */
    this._lastTapTime = 0;
    
    /** @type {number} Double tap threshold ms */
    this._doubleTapThreshold = 300;
    
    /** @type {boolean} Whether events are attached */
    this._attached = false;
    
    /** @type {Object|null} Bound event handlers for cleanup */
    this._boundHandlers = null;
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
    this._updateDynamicContent();
  }
  
  /**
   * Set expanded state
   * 
   * @param {boolean} expanded - Expanded state
   */
  set expanded(expanded) {
    this._expanded = expanded;
    this._updateExpandedState();
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the header
   * 
   * @returns {HTMLElement} Header element
   */
  render() {
    const config = this._config;
    
    // Create header element
    this._element = document.createElement('div');
    this._element.className = this._getHeaderClasses();
    this._element.setAttribute('role', 'button');
    this._element.setAttribute('tabindex', '0');
    this._element.setAttribute('aria-expanded', String(this._expanded));
    
    // Build inner HTML
    this._element.innerHTML = `
      <div class="header-left">
        ${this._renderIcon()}
        <div class="header-left-slot"></div>
      </div>
      <div class="header-content">
        ${this._renderTitle()}
        ${this._renderSubtitle()}
        <div class="header-cards-slot"></div>
      </div>
      <div class="header-right">
        ${this._renderBadges()}
        <div class="header-right-slot"></div>
        ${this._renderExpandIcon()}
      </div>
    `;
    
    // Bind events
    this._bindEvents();
    this._attached = true;
    
    return this._element;
  }
  
  /**
   * Render icon
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderIcon() {
    const { icon, entity } = this._config;
    
    if (!icon && !entity) {
      return '';
    }
    
    const iconName = icon || this._getEntityIcon(entity);
    if (!iconName) return '';
    
    return `
      <ha-icon class="header-icon" icon="${iconName}"></ha-icon>
    `;
  }
  
  /**
   * Render title
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderTitle() {
    const { title, entity } = this._config;
    
    const titleText = title || this._getEntityName(entity) || '';
    if (!titleText) return '';
    
    return `<div class="header-title">${titleText}</div>`;
  }
  
  /**
   * Render subtitle
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderSubtitle() {
    const { subtitle, entity, show_state } = this._config;
    
    let subtitleText = subtitle || '';
    
    // Show entity state as subtitle if configured
    if (show_state !== false && entity && this._hass) {
      const state = getStateValue(this._hass, entity);
      if (state && state !== 'unavailable') {
        subtitleText = subtitleText ? `${subtitleText} · ${state}` : state;
      }
    }
    
    if (!subtitleText) return '';
    
    return `<div class="header-subtitle">${subtitleText}</div>`;
  }
  
  /**
   * Render badges
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderBadges() {
    const { badges } = this._config;
    
    if (!badges || !Array.isArray(badges) || badges.length === 0) {
      return '';
    }
    
    const badgesHtml = badges.map(badge => this._renderBadge(badge)).join('');
    
    return `<div class="header-badges">${badgesHtml}</div>`;
  }
  
  /**
   * Render single badge
   * 
   * @private
   * @param {Object} badge - Badge configuration
   * @returns {string} HTML string
   */
  _renderBadge(badge) {
    const { entity, icon, color, value, label } = badge;
    
    let displayValue = value || '';
    let badgeColor = color || 'var(--primary-color)';
    
    // Get value from entity if specified
    if (entity && this._hass) {
      displayValue = getStateValue(this._hass, entity, '');
      
      // Apply state colors
      const state = this._hass.states[entity];
      if (state) {
        const stateColor = this._getStateColor(state.state);
        if (stateColor) badgeColor = stateColor;
      }
    }
    
    const iconHtml = icon ? `<ha-icon icon="${icon}"></ha-icon>` : '';
    const labelHtml = label ? `<span class="badge-label">${label}</span>` : '';
    const valueHtml = displayValue ? `<span class="badge-value">${displayValue}</span>` : '';
    
    return `
      <div class="badge" style="--badge-color: ${badgeColor}">
        ${iconHtml}${labelHtml}${valueHtml}
      </div>
    `;
  }
  
  /**
   * Render expand icon
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderExpandIcon() {
    const { show_expand_icon, expand_icon, body_mode } = this._config;
    
    // Don't show for 'none' body mode
    if (body_mode === 'none') return '';
    
    // Check if icon should be shown
    if (show_expand_icon === false) return '';
    
    const iconName = expand_icon || 'mdi:chevron-down';
    const expandedClass = this._expanded ? 'expanded' : '';
    
    return `
      <ha-icon class="expand-icon ${expandedClass}" icon="${iconName}"></ha-icon>
    `;
  }
  
  /**
   * Get header CSS classes
   * 
   * @private
   * @returns {string} Class string
   */
  _getHeaderClasses() {
    const classes = ['header'];
    
    if (this._expanded) {
      classes.push('expanded');
    }
    
    if (this._config.sticky_header || this._config.sticky) {
      classes.push('sticky');
    }
    
    if (this._config.clickable === false) {
      classes.push('non-clickable');
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
    const { header_left, header_right, cards } = this._config;
    
    const promises = [];
    
    // Load left slot cards
    if (header_left?.cards) {
      promises.push(
        this._loadSlotCards(header_left.cards, '.header-left-slot', '_leftCards')
      );
    }
    
    // Load right slot cards
    if (header_right?.cards) {
      promises.push(
        this._loadSlotCards(header_right.cards, '.header-right-slot', '_rightCards')
      );
    }
    
    // Load content cards
    if (cards) {
      promises.push(
        this._loadSlotCards(cards, '.header-cards-slot', '_contentCards')
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
      
      // Create fragment for batch DOM insert
      const fragment = document.createDocumentFragment();
      
      cards.forEach(card => {
        if (this._hass) {
          card.hass = this._hass;
        }
        fragment.appendChild(card);
      });
      
      slot.appendChild(fragment);
      
    } catch (error) {
      console.error(`[UniversalCard] Failed to load slot cards:`, error);
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
    
    // Store bound handlers for cleanup
    this._boundHandlers = {
      click: (e) => this._handleClick(e),
      touchstart: (e) => this._handleTouchStart(e),
      touchend: (e) => this._handleTouchEnd(e),
      touchcancel: () => this._cancelHold(),
      mousedown: (e) => this._handleMouseDown(e),
      mouseup: () => this._handleMouseUp(),
      mouseleave: () => this._cancelHold(),
      keydown: (e) => this._handleKeydown(e),
      contextmenu: (e) => this._handleContextMenu(e)
    };
    
    // Click / Tap
    this._element.addEventListener('click', this._boundHandlers.click);
    
    // Touch events for hold detection
    this._element.addEventListener('touchstart', this._boundHandlers.touchstart, { passive: true });
    this._element.addEventListener('touchend', this._boundHandlers.touchend);
    this._element.addEventListener('touchcancel', this._boundHandlers.touchcancel);
    
    // Mouse events for hold detection (desktop)
    this._element.addEventListener('mousedown', this._boundHandlers.mousedown);
    this._element.addEventListener('mouseup', this._boundHandlers.mouseup);
    this._element.addEventListener('mouseleave', this._boundHandlers.mouseleave);
    
    // Keyboard
    this._element.addEventListener('keydown', this._boundHandlers.keydown);
    
    // Context menu (right-click)
    this._element.addEventListener('contextmenu', this._boundHandlers.contextmenu);
  }
  
  /**
   * Handle click event
   * 
   * @private
   * @param {Event} event - Click event
   */
  _handleClick(event) {
    debug('[UC-Header] click!', event.target);
    
    // Ignore if clicking on interactive elements
    if (this._isInteractiveElement(event.target)) {
      debug('[UC-Header] ignored - interactive element');
      return;
    }
    
    // Ignore if was holding
    if (this._isHolding) {
      debug('[UC-Header] ignored - was holding');
      this._isHolding = false;
      return;
    }
    
    // Check for double-tap
    const now = Date.now();
    const timeSinceLastTap = now - this._lastTapTime;
    this._lastTapTime = now;
    
    if (timeSinceLastTap < this._doubleTapThreshold) {
      // Double-tap detected
      debug('[UC-Header] double-tap detected');
      event.preventDefault();
      this._executeAction('double_tap_action');
      return;
    }
    
    // Single tap - delay to check for double-tap
    setTimeout(() => {
      if (Date.now() - this._lastTapTime >= this._doubleTapThreshold) {
        this._executeAction('tap_action');
      }
    }, this._doubleTapThreshold);
  }
  
  /**
   * Handle touch start
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchStart(event) {
    if (this._isInteractiveElement(event.target)) return;
    this._startHold();
  }
  
  /**
   * Handle touch end
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchEnd(event) {
    this._endHold();
  }
  
  /**
   * Handle mouse down
   * 
   * @private
   * @param {MouseEvent} event - Mouse event
   */
  _handleMouseDown(event) {
    // Only left mouse button
    if (event.button !== 0) return;
    if (this._isInteractiveElement(event.target)) return;
    this._startHold();
  }
  
  /**
   * Handle mouse up
   * 
   * @private
   */
  _handleMouseUp() {
    this._endHold();
  }
  
  /**
   * Start hold timer
   * 
   * @private
   */
  _startHold() {
    this._cancelHold();
    
    this._holdTimer = setTimeout(() => {
      this._isHolding = true;
      this._executeAction('hold_action');
    }, this._holdDuration);
  }
  
  /**
   * End hold
   * 
   * @private
   */
  _endHold() {
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
    this._endHold();
    this._isHolding = false;
  }
  
  /**
   * Handle keyboard event
   * 
   * @private
   * @param {KeyboardEvent} event - Keyboard event
   */
  _handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._executeAction('tap_action');
    }
  }
  
  /**
   * Handle context menu (right-click)
   * 
   * @private
   * @param {Event} event - Context menu event
   */
  _handleContextMenu(event) {
    // Will be handled by context menu feature
    // For now, just fire an event
    if (this._config.context_menu) {
      event.preventDefault();
      fireEvent(this._element, 'uc-context-menu', {
        x: event.clientX,
        y: event.clientY,
        config: this._config.context_menu
      });
    }
  }
  
  /**
   * Check if element is interactive
   * 
   * @private
   * @param {HTMLElement} target - Target element
   * @returns {boolean} True if interactive
   */
  _isInteractiveElement(target) {
    // Guard: if element is destroyed, ignore
    if (!this._element || !target) {
      return true; // Block interaction if header is destroyed
    }
    
    // Пропускаем если клик на сам header или его контент
    if (target === this._element || this._element.contains(target)) {
      // Проверяем только реально интерактивные элементы внутри header
      const interactiveSelectors = [
        'ha-icon-button',
        'button',
        'a[href]',
        'input',
        'select',
        'textarea',
        '.badge.clickable',
        '.quick-action'
      ];
      
      // Проверяем сам target и его родителей до header (но не включая header)
      let el = target;
      while (el && el !== this._element) {
        if (el.matches && el.matches(interactiveSelectors.join(', '))) {
          debug('[UC-Header] blocked interactive:', el.tagName);
          return true;
        }
        el = el.parentElement;
      }
      return false;
    }
    return false;
  }
  
  /**
   * Execute action
   * 
   * @private
   * @param {string} actionKey - Action config key
   */
  _executeAction(actionKey) {
    debug('[UC-Header] _executeAction:', actionKey);
    const actionConfig = this._config[actionKey];
    debug('[UC-Header] actionConfig:', actionConfig);
    
    // Default tap action is toggle
    if (!actionConfig && actionKey === 'tap_action') {
      debug('[UC-Header] firing uc-toggle (default)');
      fireEvent(this._element, 'uc-toggle');
      return;
    }
    
    if (!actionConfig || actionConfig.action === ACTION_TYPES.NONE) {
      debug('[UC-Header] no action config or action=none');
      return;
    }
    
    // Handle expand/collapse actions
    if (actionConfig.action === ACTION_TYPES.EXPAND) {
      debug('[UC-Header] firing uc-expand');
      fireEvent(this._element, 'uc-expand');
      return;
    }
    
    if (actionConfig.action === ACTION_TYPES.COLLAPSE) {
      debug('[UC-Header] firing uc-collapse');
      fireEvent(this._element, 'uc-collapse');
      return;
    }
    
    if (actionConfig.action === 'toggle') {
      debug('[UC-Header] firing uc-toggle');
      fireEvent(this._element, 'uc-toggle');
      return;
    }
    
    // Execute HA action
    debug('[UC-Header] executing HA action');
    executeAction(this._hass, this._element, actionConfig);
  }
  
  // ===========================================================================
  // STATE UPDATES
  // ===========================================================================
  
  /**
   * Update expanded state UI
   * 
   * @private
   */
  _updateExpandedState() {
    if (!this._element) return;
    
    this._element.classList.toggle('expanded', this._expanded);
    this._element.setAttribute('aria-expanded', String(this._expanded));
    
    const expandIcon = this._element.querySelector('.expand-icon');
    if (expandIcon) {
      expandIcon.classList.toggle('expanded', this._expanded);
    }
  }
  
  /**
   * Update dynamic content (badges, subtitle state, etc.)
   * 
   * @private
   */
  _updateDynamicContent() {
    if (!this._element || !this._hass) return;
    
    // Update subtitle with state
    if (this._config.entity && this._config.show_state !== false) {
      const subtitleEl = this._element.querySelector('.header-subtitle');
      if (subtitleEl) {
        const state = getStateValue(this._hass, this._config.entity);
        const subtitle = this._config.subtitle;
        subtitleEl.textContent = subtitle ? `${subtitle} · ${state}` : state;
      }
    }
    
    // Update badges
    this._updateBadges();
  }
  
  /**
   * Update badge values
   * 
   * @private
   */
  _updateBadges() {
    const { badges } = this._config;
    if (!badges || !Array.isArray(badges)) return;
    
    const badgeElements = this._element.querySelectorAll('.badge');
    
    badges.forEach((badge, index) => {
      if (!badge.entity || !badgeElements[index]) return;
      
      const state = getStateValue(this._hass, badge.entity, '');
      const valueEl = badgeElements[index].querySelector('.badge-value');
      
      if (valueEl) {
        valueEl.textContent = state;
      }
    });
  }
  
  // ===========================================================================
  // HELPERS
  // ===========================================================================
  
  /**
   * Get entity icon
   * 
   * @private
   * @param {string} entityId - Entity ID
   * @returns {string|null} Icon name
   */
  _getEntityIcon(entityId) {
    if (!this._hass || !entityId) return null;
    
    const state = this._hass.states[entityId];
    if (!state) return null;
    
    // Check for custom icon
    if (state.attributes.icon) {
      return state.attributes.icon;
    }
    
    // Get domain icon
    const domain = entityId.split('.')[0];
    return this._getDomainIcon(domain);
  }
  
  /**
   * Get entity friendly name
   * 
   * @private
   * @param {string} entityId - Entity ID
   * @returns {string|null} Friendly name
   */
  _getEntityName(entityId) {
    if (!this._hass || !entityId) return null;
    
    const state = this._hass.states[entityId];
    return state?.attributes?.friendly_name || null;
  }
  
  /**
   * Get default icon for domain
   * 
   * @private
   * @param {string} domain - Entity domain
   * @returns {string} Icon name
   */
  _getDomainIcon(domain) {
    const domainIcons = {
      light: 'mdi:lightbulb',
      switch: 'mdi:toggle-switch',
      sensor: 'mdi:eye',
      binary_sensor: 'mdi:radiobox-blank',
      climate: 'mdi:thermostat',
      cover: 'mdi:window-shutter',
      fan: 'mdi:fan',
      media_player: 'mdi:cast',
      camera: 'mdi:video',
      lock: 'mdi:lock',
      alarm_control_panel: 'mdi:shield-home',
      automation: 'mdi:robot',
      script: 'mdi:script-text',
      scene: 'mdi:palette',
      input_boolean: 'mdi:toggle-switch-outline',
      input_number: 'mdi:ray-vertex',
      input_select: 'mdi:format-list-bulleted',
      input_text: 'mdi:form-textbox',
      person: 'mdi:account',
      device_tracker: 'mdi:account',
      weather: 'mdi:weather-partly-cloudy',
      vacuum: 'mdi:robot-vacuum'
    };
    
    return domainIcons[domain] || 'mdi:bookmark';
  }
  
  /**
   * Get color for state
   * 
   * @private
   * @param {string} state - Entity state
   * @returns {string|null} Color
   */
  _getStateColor(state) {
    const stateColors = {
      on: 'var(--state-active-color, #fdd835)',
      off: 'var(--state-inactive-color, #969696)',
      home: 'var(--state-home-color, #4caf50)',
      not_home: 'var(--state-not-home-color, #f44336)',
      armed_home: 'var(--state-warning-color, #ff9800)',
      armed_away: 'var(--state-error-color, #f44336)',
      disarmed: 'var(--state-success-color, #4caf50)',
      unavailable: 'var(--state-unavailable-color, #bdbdbd)'
    };
    
    return stateColors[state] || null;
  }
  
  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  
  /**
   * Detach event listeners (call from disconnectedCallback)
   * Keeps element reference for reattachment
   */
  detach() {
    this._cancelHold();
    this._removeEventListeners();
    this._attached = false;
  }
  
  /**
   * Reattach event listeners (call from connectedCallback)
   */
  attach() {
    if (this._attached) return;
    if (!this._element) return;
    
    // Rebind events
    this._bindEvents();
    this._attached = true;
  }
  
  /**
   * Remove all event listeners
   * @private
   */
  _removeEventListeners() {
    if (this._element && this._boundHandlers) {
      this._element.removeEventListener('click', this._boundHandlers.click);
      this._element.removeEventListener('touchstart', this._boundHandlers.touchstart);
      this._element.removeEventListener('touchend', this._boundHandlers.touchend);
      this._element.removeEventListener('touchcancel', this._boundHandlers.touchcancel);
      this._element.removeEventListener('mousedown', this._boundHandlers.mousedown);
      this._element.removeEventListener('mouseup', this._boundHandlers.mouseup);
      this._element.removeEventListener('mouseleave', this._boundHandlers.mouseleave);
      this._element.removeEventListener('keydown', this._boundHandlers.keydown);
      this._element.removeEventListener('contextmenu', this._boundHandlers.contextmenu);
    }
    this._boundHandlers = null;
  }
  
  /**
   * Destroy the header component completely
   */
  destroy() {
    this._cancelHold();
    this._removeEventListeners();
    
    this._leftCards = [];
    this._rightCards = [];
    this._contentCards = [];
    this._hass = null;
    this._element = null;
    this._attached = false;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Header;
