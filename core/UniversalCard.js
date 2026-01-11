/**
 * Universal Card - Main Component
 * 
 * The main Lovelace card component implementing all features:
 * - 7 body modes (expand, modal, fullscreen, tabs, carousel, subview, none)
 * - CSS Grid layout with colspan/rowspan
 * - Lazy loading with skeleton placeholders
 * - Visibility conditions
 * - Context menu & Radial menu
 * - And much more...
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module core/UniversalCard
 */

import { 
  CARD_VERSION, 
  DEFAULTS, 
  BODY_MODES, 
  EVENTS,
  LIMITS 
} from './constants.js';

import { ConfigManager } from './config.js';
import { generateId, fireEvent, deepClone } from '../utils/helpers.js';
import { debounce, throttle, rafDouble } from '../utils/performance.js';
import { 
  getCardHelpers, 
  createCardElement, 
  createCardElements,
  createErrorCard,
  getStateValue,
  executeAction 
} from '../utils/ha-helpers.js';

// UI Components
import { Header } from '../ui/Header.js';
import { Footer } from '../ui/Footer.js';
import { Badges } from '../ui/Badges.js';

// Styles
import { HEADER_FOOTER_STYLES } from '../styles/header-footer.js';

// =============================================================================
// UNIVERSAL CARD CLASS
// =============================================================================

/**
 * UniversalCard custom element
 * 
 * @extends HTMLElement
 * @fires universal-card-expanded - When card is expanded
 * @fires universal-card-collapsed - When card is collapsed
 * 
 * @example
 * // In Lovelace YAML:
 * type: custom:universal-card
 * title: My Card
 * body_mode: expand
 * body:
 *   cards:
 *     - type: light
 *       entity: light.room
 */
export class UniversalCard extends HTMLElement {
  
  // ===========================================================================
  // STATIC METHODS (Home Assistant interface)
  // ===========================================================================
  
  /**
   * Get the editor element for this card
   * Required by Home Assistant for visual editor support
   * 
   * @returns {HTMLElement} Editor element
   * @static
   */
  static getConfigElement() {
    return document.createElement('universal-card-editor');
  }
  
  /**
   * Get stub/default configuration for new cards
   * Used when adding card via UI
   * 
   * @returns {Object} Default configuration
   * @static
   */
  static getStubConfig() {
    return {
      title: 'Universal Card',
      icon: 'mdi:card-outline',
      body_mode: BODY_MODES.EXPAND,
      body: {
        cards: [
          { 
            type: 'markdown', 
            content: 'Configure this card in the editor' 
          }
        ]
      }
    };
  }
  
  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  
  /**
   * Create a new UniversalCard instance
   */
  constructor() {
    super();
    
    // Attach shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // ===========================================
    // STATE
    // ===========================================
    
    /** @type {Object} Normalized configuration */
    this._config = {};
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;
    
    /** @type {boolean} Whether card is expanded */
    this._expanded = false;
    
    /** @type {boolean} Whether card is fully initialized */
    this._initialized = false;
    
    /** @type {Object|null} Pending hass object before init */
    this._pendingHass = null;
    
    // ===========================================
    // COMPONENTS
    // ===========================================
    
    /** @type {Header|null} Header component instance */
    this._header = null;
    
    /** @type {Footer|null} Footer component instance */
    this._footer = null;
    
    /** @type {Badges|null} Badges component instance */
    this._badges = null;
    
    // ===========================================
    // CARDS
    // ===========================================
    
    /** @type {HTMLElement[]} Header card elements */
    this._headerCards = [];
    
    /** @type {HTMLElement[]} Body card elements */
    this._bodyCards = [];
    
    /** @type {Object<number, HTMLElement[]>} Tab card elements by index */
    this._tabCards = {};
    
    /** @type {boolean} Whether body cards have been loaded */
    this._bodyCardsLoaded = false;
    
    /** @type {Object|null} Card helpers from HA */
    this._helpers = null;
    
    // ===========================================
    // UI STATE
    // ===========================================
    
    /** @type {number} Active tab index */
    this._activeTab = 0;
    
    /** @type {number} Active carousel slide index */
    this._carouselIndex = 0;
    
    /** @type {boolean} Whether card is loading */
    this._isLoading = false;
    
    // ===========================================
    // TIMERS & HANDLERS
    // ===========================================
    
    /** @type {number|null} Auto-collapse timer ID */
    this._autoCollapseTimer = null;
    
    /** @type {number|null} Carousel autoplay timer ID */
    this._carouselTimer = null;
    
    /** @type {Function} Bound external control handler */
    this._boundControlHandler = this._handleExternalControl.bind(this);
    
    /** @type {Function} Debounced resize handler */
    this._resizeHandler = debounce(
      () => this._handleResize(), 
      LIMITS.RESIZE_DEBOUNCE_MS
    );
    
    /** @type {Function} Throttled hass update handler */
    this._hassUpdateHandler = throttle(
      () => this._updateDynamicContent(),
      LIMITS.UPDATE_THROTTLE_MS
    );
    
    // ===========================================
    // OBSERVERS
    // ===========================================
    
    /** @type {IntersectionObserver|null} Lazy load observer */
    this._intersectionObserver = null;
    
    // ===========================================
    // DEBUG
    // ===========================================
    
    /** @type {Object} Debug information */
    this._debug = {
      initTime: 0,
      renderCount: 0,
      lastRenderTime: 0
    };
  }
  
  // ===========================================================================
  // LIFECYCLE CALLBACKS
  // ===========================================================================
  
  /**
   * Called when element is added to DOM
   */
  connectedCallback() {
    // Register event listeners
    window.addEventListener(EVENTS.CARD_CONTROL, this._boundControlHandler);
    window.addEventListener('resize', this._resizeHandler);
    
    // Setup Intersection Observer for lazy loading
    this._setupIntersectionObserver();
  }
  
  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback() {
    // Cleanup event listeners
    window.removeEventListener(EVENTS.CARD_CONTROL, this._boundControlHandler);
    window.removeEventListener('resize', this._resizeHandler);
    
    // Cleanup timers
    this._clearAllTimers();
    
    // Cleanup observers
    this._destroyIntersectionObserver();
    
    // Cleanup child cards
    this._destroyChildCards();
  }
  
  // ===========================================================================
  // HASS SETTER
  // ===========================================================================
  
  /**
   * Set the Home Assistant instance
   * Called by Lovelace whenever hass state changes
   * 
   * @param {Object} hass - Home Assistant instance
   */
  set hass(hass) {
    this._hass = hass;
    
    // If not initialized yet, store for later
    if (!this._initialized) {
      this._pendingHass = hass;
      return;
    }
    
    // Update components
    if (this._header) this._header.hass = hass;
    if (this._footer) this._footer.hass = hass;
    if (this._badges) this._badges.hass = hass;
    
    // Update child cards
    this._updateChildCardsHass(hass);
    
    // Update dynamic content (throttled)
    this._hassUpdateHandler();
  }
  
  /**
   * Get the Home Assistant instance
   * 
   * @returns {Object|null} Home Assistant instance
   */
  get hass() {
    return this._hass;
  }
  
  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================
  
  /**
   * Set card configuration
   * Called by Lovelace when config changes
   * 
   * @param {Object} config - Raw configuration object
   * @throws {Error} If configuration is invalid
   */
  setConfig(config) {
    const startTime = performance.now();
    
    // Validate and normalize configuration
    this._config = ConfigManager.normalize(config);
    
    this._debug.initTime = performance.now() - startTime;
    
    // Initialize card
    this._initializeCard();
  }
  
  /**
   * Get current configuration
   * 
   * @returns {Object} Current configuration
   */
  getConfig() {
    return deepClone(this._config);
  }
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  /**
   * Initialize the card
   * 
   * @private
   */
  async _initializeCard() {
    try {
      // Load card helpers
      this._helpers = await getCardHelpers();
      
      // Restore state if configured
      this._restoreState();
      
      // Create Header component
      this._createHeaderComponent();
      
      // Create Footer component if configured
      if (this._config.footer) {
        this._createFooterComponent();
      }
      
      // Perform initial render
      await this._render();
      
      // Load header cards asynchronously
      if (this._header) {
        await this._header.loadCards();
      }
      
      // Load footer cards asynchronously
      if (this._footer) {
        await this._footer.loadCards();
      }
      
      // Setup lazy loading or load body cards
      if (this._config.lazy_load) {
        this._observeForLazyLoad();
      } else if (this._expanded) {
        await this._loadBodyCards();
      }
      
      // Bind events
      this._bindEvents();
      
      // Mark as initialized
      this._initialized = true;
      
      // Apply pending hass
      if (this._pendingHass) {
        this.hass = this._pendingHass;
        this._pendingHass = null;
      }
      
    } catch (error) {
      console.error('[UniversalCard] Initialization failed:', error);
      this._renderError(error);
    }
  }
  
  /**
   * Create Header component instance
   * 
   * @private
   */
  _createHeaderComponent() {
    const headerConfig = {
      ...this._config,
      ...this._config.header,
      // Pass through relevant config
      title: this._config.title,
      subtitle: this._config.subtitle,
      icon: this._config.icon,
      entity: this._config.entity,
      show_state: this._config.show_state,
      show_expand_icon: this._config.show_expand_icon,
      expand_icon: this._config.expand_icon,
      body_mode: this._config.body_mode,
      sticky_header: this._config.sticky_header,
      badges: this._config.badges,
      tap_action: this._config.tap_action,
      hold_action: this._config.hold_action,
      double_tap_action: this._config.double_tap_action,
      context_menu: this._config.context_menu
    };
    
    this._header = new Header(headerConfig);
    if (this._hass) this._header.hass = this._hass;
  }
  
  /**
   * Create Footer component instance
   * 
   * @private
   */
  _createFooterComponent() {
    this._footer = new Footer(this._config.footer);
    if (this._hass) this._footer.hass = this._hass;
  }
  
  /**
   * Restore saved state from localStorage
   * 
   * @private
   */
  _restoreState() {
    if (this._config.remember_state && this._config.card_id) {
      try {
        const key = `uc-state-${this._config.card_id}`;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          this._expanded = JSON.parse(saved);
        } else {
          this._expanded = this._config.expanded;
        }
      } catch {
        this._expanded = this._config.expanded;
      }
    } else {
      this._expanded = this._config.expanded;
    }
  }
  
  /**
   * Save current state to localStorage
   * 
   * @private
   */
  _saveState() {
    if (this._config.remember_state && this._config.card_id) {
      try {
        const key = `uc-state-${this._config.card_id}`;
        localStorage.setItem(key, JSON.stringify(this._expanded));
      } catch {
        // Ignore storage errors
      }
    }
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the card
   * 
   * @private
   * @returns {Promise<void>}
   */
  async _render() {
    const startTime = performance.now();
    
    const styles = this._generateStyles();
    
    // Build card classes
    const cardClasses = ['universal-card'];
    if (this._config.theme) {
      cardClasses.push(`theme-${this._config.theme}`);
    }
    
    // Create card container
    const cardContainer = document.createElement('div');
    cardContainer.className = cardClasses.join(' ');
    cardContainer.dataset.cardId = this._config.card_id;
    
    // Render Header using component
    if (this._header) {
      this._header.expanded = this._expanded;
      const headerElement = this._header.render();
      cardContainer.appendChild(headerElement);
    }
    
    // Render Body
    const bodyElement = this._renderBodyElement();
    if (bodyElement) {
      cardContainer.appendChild(bodyElement);
    }
    
    // Render Footer using component
    if (this._footer) {
      const footerElement = this._footer.render();
      cardContainer.appendChild(footerElement);
    }
    
    // Clear and append to shadow DOM
    this.shadowRoot.innerHTML = `<style>${styles}</style>`;
    this.shadowRoot.appendChild(cardContainer);
    
    this._debug.renderCount++;
    this._debug.lastRenderTime = performance.now() - startTime;
  }
  
  /**
   * Render body as DOM element
   * 
   * @private
   * @returns {HTMLElement|null} Body element or null
   */
  _renderBodyElement() {
    const config = this._config;
    
    // No body for 'none' mode
    if (config.body_mode === BODY_MODES.NONE) {
      return null;
    }
    
    const body = document.createElement('div');
    body.className = 'body';
    body.dataset.state = this._expanded ? 'expanded' : 'collapsed';
    
    const content = document.createElement('div');
    content.className = 'body-content';
    
    // Apply grid styles
    const gridStyles = this._getGridStyles();
    if (gridStyles) {
      content.style.cssText = gridStyles;
    }
    
    // Add skeleton if loading
    if (!this._bodyCardsLoaded && this._expanded) {
      content.innerHTML = this._renderSkeleton();
    }
    
    body.appendChild(content);
    return body;
  }
  
  
  /**
   * Render skeleton loader
   * 
   * @private
   * @returns {string} Skeleton HTML
   */
  _renderSkeleton() {
    const count = this._config.skeleton_count || DEFAULTS.skeleton_count;
    const skeletons = Array(count).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line text"></div>
        <div class="skeleton-line text short"></div>
      </div>
    `).join('');
    
    return `<div class="skeleton-container">${skeletons}</div>`;
  }
  
  /**
   * Render error state
   * 
   * @private
   * @param {Error} error - Error to display
   */
  _renderError(error) {
    this.shadowRoot.innerHTML = `
      <style>
        .error-card {
          padding: 16px;
          background: var(--error-color, #f44336);
          color: white;
          border-radius: var(--ha-card-border-radius, 12px);
        }
        .error-message { font-weight: 500; }
        .error-details { margin-top: 8px; font-size: 12px; opacity: 0.9; }
      </style>
      <div class="error-card">
        <div class="error-message">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          Universal Card Error
        </div>
        <div class="error-details">${error.message}</div>
      </div>
    `;
  }
  
  // ===========================================================================
  // CARD CREATION
  // ===========================================================================
  
  /**
   * Load body cards (lazy loaded)
   * 
   * @private
   * @returns {Promise<void>}
   */
  async _loadBodyCards() {
    if (this._bodyCardsLoaded || this._isLoading) return;
    
    this._isLoading = true;
    
    try {
      const configs = this._config.body?.cards || [];
      if (configs.length === 0) {
        this._bodyCardsLoaded = true;
        return;
      }
      
      this._bodyCards = await createCardElements(configs);
      
      // Get container
      const container = this.shadowRoot.querySelector('.body-content');
      if (!container) return;
      
      // Remove skeleton
      const skeleton = container.querySelector('.skeleton-container');
      if (skeleton) {
        skeleton.classList.add('fade-out');
        await new Promise(r => setTimeout(r, 200));
        skeleton.remove();
      }
      
      // Use DocumentFragment for batch insert
      const fragment = document.createDocumentFragment();
      
      this._bodyCards.forEach((card, index) => {
        if (this._hass) card.hass = this._hass;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'card-wrapper';
        
        // Apply grid span from config
        const cardConfig = configs[index];
        if (cardConfig.colspan) {
          wrapper.style.gridColumn = `span ${cardConfig.colspan}`;
        }
        if (cardConfig.rowspan) {
          wrapper.style.gridRow = `span ${cardConfig.rowspan}`;
        }
        
        wrapper.appendChild(card);
        fragment.appendChild(wrapper);
      });
      
      container.appendChild(fragment);
      
      this._bodyCardsLoaded = true;
      
    } finally {
      this._isLoading = false;
    }
  }
  
  /**
   * Update hass on all child cards
   * 
   * @private
   * @param {Object} hass - Home Assistant instance
   */
  _updateChildCardsHass(hass) {
    const allCards = [
      ...this._headerCards,
      ...this._bodyCards,
      ...Object.values(this._tabCards).flat()
    ];
    
    allCards.forEach(card => {
      if (card && 'hass' in card) {
        try {
          card.hass = hass;
        } catch {
          // Ignore update errors
        }
      }
    });
  }
  
  /**
   * Destroy all child cards
   * 
   * @private
   */
  _destroyChildCards() {
    // Destroy components
    if (this._header) {
      this._header.destroy();
      this._header = null;
    }
    
    if (this._footer) {
      this._footer.destroy();
      this._footer = null;
    }
    
    if (this._badges) {
      this._badges.destroy();
      this._badges = null;
    }
    
    this._headerCards = [];
    this._bodyCards = [];
    this._tabCards = {};
    this._bodyCardsLoaded = false;
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================
  
  /**
   * Generate all CSS styles
   * 
   * @private
   * @returns {string} CSS string
   */
  _generateStyles() {
    return `
      /* ============================= */
      /* HOST */
      /* ============================= */
      
      :host {
        display: block;
        --uc-transition-duration: ${this._config.animation_duration}ms;
        --uc-border-radius: ${this._config.border_radius};
        --uc-padding: ${this._config.padding};
      }
      
      /* ============================= */
      /* CARD */
      /* ============================= */
      
      .universal-card {
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--uc-border-radius);
        box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,0.1));
        overflow: hidden;
      }
      
      /* ============================= */
      /* HEADER & FOOTER STYLES */
      /* ============================= */
      
      ${HEADER_FOOTER_STYLES}
      
      /* ============================= */
      /* BODY */
      /* ============================= */
      
      .body {
        overflow: hidden;
        transition: 
          max-height var(--uc-transition-duration) ease,
          opacity var(--uc-transition-duration) ease;
      }
      
      .body[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
      }
      
      .body[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
      }
      
      .body-content {
        padding: var(--uc-padding);
        padding-top: 0;
      }
      
      /* ============================= */
      /* CARD WRAPPER */
      /* ============================= */
      
      .card-wrapper {
        min-width: 0;
      }
      
      .card-wrapper > * {
        height: 100%;
      }
      
      /* ============================= */
      /* SKELETON */
      /* ============================= */
      
      .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .skeleton-card {
        padding: 16px;
        background: var(--secondary-background-color);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .skeleton-line {
        height: 12px;
        background: var(--divider-color);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .skeleton-line.title {
        width: 60%;
        height: 16px;
      }
      
      .skeleton-line.text {
        width: 100%;
      }
      
      .skeleton-line.short {
        width: 40%;
      }
      
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
    `;
  }
  
  /**
   * Get grid layout styles
   * 
   * @private
   * @returns {string} Inline style string
   */
  _getGridStyles() {
    const grid = this._config.grid || {};
    const columns = grid.columns || DEFAULTS.grid_columns;
    const gap = grid.gap || DEFAULTS.grid_gap;
    
    if (columns <= 1) {
      return '';
    }
    
    return `
      display: grid;
      grid-template-columns: repeat(${columns}, 1fr);
      gap: ${gap};
    `.replace(/\s+/g, ' ').trim();
  }
  
  // ===========================================================================
  // EVENTS
  // ===========================================================================
  
  /**
   * Bind all event handlers
   * 
   * @private
   */
  _bindEvents() {
    const header = this.shadowRoot.querySelector('.header');
    
    if (header) {
      // Listen for custom events from Header component
      header.addEventListener('uc-toggle', () => this._toggle());
      header.addEventListener('uc-expand', () => this._expand());
      header.addEventListener('uc-collapse', () => this._collapse());
      header.addEventListener('uc-context-menu', (e) => this._handleContextMenu(e));
    }
  }
  
  /**
   * Handle context menu event from header
   * 
   * @private
   * @param {CustomEvent} event - Context menu event
   */
  _handleContextMenu(event) {
    // Will be implemented in Phase 4: Context Menu feature
    console.debug('[UniversalCard] Context menu:', event.detail);
  }
  
  /**
   * Handle external control events
   * 
   * @private
   * @param {CustomEvent} event - Control event
   */
  _handleExternalControl(event) {
    const { card_id, action } = event.detail || {};
    
    // Ignore if not for this card
    if (card_id && card_id !== this._config.card_id) {
      return;
    }
    
    switch (action) {
      case 'expand':
        this._expand();
        break;
      case 'collapse':
        this._collapse();
        break;
      case 'toggle':
        this._toggle();
        break;
    }
  }
  
  /**
   * Handle window resize
   * 
   * @private
   */
  _handleResize() {
    // Responsive breakpoints handling would go here
    this._updateDynamicContent();
  }
  
  // ===========================================================================
  // EXPAND / COLLAPSE
  // ===========================================================================
  
  /**
   * Toggle expanded state
   * 
   * @public
   */
  _toggle() {
    if (this._expanded) {
      this._collapse();
    } else {
      this._expand();
    }
  }
  
  /**
   * Expand the card
   * 
   * @public
   * @returns {Promise<void>}
   */
  async _expand() {
    if (this._expanded) return;
    
    this._expanded = true;
    this._updateExpandedUI();
    this._saveState();
    
    // Load body cards if needed
    if (!this._bodyCardsLoaded) {
      await this._loadBodyCards();
    }
    
    // Fire event
    fireEvent(this, EVENTS.CARD_EXPANDED, {
      card_id: this._config.card_id
    });
    
    // Setup auto-collapse timer
    this._setupAutoCollapse();
  }
  
  /**
   * Collapse the card
   * 
   * @public
   */
  _collapse() {
    if (!this._expanded) return;
    
    this._expanded = false;
    this._updateExpandedUI();
    this._saveState();
    this._clearAutoCollapseTimer();
    
    // Fire event
    fireEvent(this, EVENTS.CARD_COLLAPSED, {
      card_id: this._config.card_id
    });
  }
  
  /**
   * Update UI to reflect expanded state
   * 
   * @private
   */
  _updateExpandedUI() {
    // Update Header component
    if (this._header) {
      this._header.expanded = this._expanded;
    }
    
    // Update body state
    const body = this.shadowRoot.querySelector('.body');
    if (body) {
      body.dataset.state = this._expanded ? 'expanded' : 'collapsed';
    }
  }
  
  // ===========================================================================
  // LAZY LOADING
  // ===========================================================================
  
  /**
   * Setup Intersection Observer for lazy loading
   * 
   * @private
   */
  _setupIntersectionObserver() {
    if (!this._config.lazy_load) return;
    
    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this._expanded && !this._bodyCardsLoaded) {
            this._loadBodyCards();
          }
        });
      },
      { rootMargin: LIMITS.INTERSECTION_MARGIN }
    );
  }
  
  /**
   * Observe this element for lazy loading
   * 
   * @private
   */
  _observeForLazyLoad() {
    if (this._intersectionObserver) {
      this._intersectionObserver.observe(this);
    }
  }
  
  /**
   * Destroy Intersection Observer
   * 
   * @private
   */
  _destroyIntersectionObserver() {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }
  }
  
  // ===========================================================================
  // TIMERS
  // ===========================================================================
  
  /**
   * Setup auto-collapse timer
   * 
   * @private
   */
  _setupAutoCollapse() {
    const timeout = this._config.auto_collapse_after;
    if (!timeout || timeout <= 0) return;
    
    this._clearAutoCollapseTimer();
    
    this._autoCollapseTimer = setTimeout(() => {
      this._collapse();
    }, timeout * 1000);
  }
  
  /**
   * Clear auto-collapse timer
   * 
   * @private
   */
  _clearAutoCollapseTimer() {
    if (this._autoCollapseTimer) {
      clearTimeout(this._autoCollapseTimer);
      this._autoCollapseTimer = null;
    }
  }
  
  /**
   * Clear all timers
   * 
   * @private
   */
  _clearAllTimers() {
    this._clearAutoCollapseTimer();
    
    if (this._carouselTimer) {
      clearInterval(this._carouselTimer);
      this._carouselTimer = null;
    }
  }
  
  // ===========================================================================
  // DYNAMIC CONTENT
  // ===========================================================================
  
  /**
   * Update dynamic content based on current state
   * 
   * @private
   */
  _updateDynamicContent() {
    // This method will be expanded to handle:
    // - Status indicators
    // - Badge values
    // - Visibility conditions
    // - State-based styling
  }
  
  // ===========================================================================
  // PUBLIC API
  // ===========================================================================
  
  /**
   * Get card size for Lovelace grid
   * 
   * @returns {number} Card height in units
   */
  getCardSize() {
    return this._expanded ? 3 : 1;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default UniversalCard;
