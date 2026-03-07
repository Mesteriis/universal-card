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
import { 
  runtimeEventHub,
  sharedStateStore,
  cardPool,
  performanceBudgetTracker
} from './runtime.js';
import { CustomCSS } from '../extensibility/CustomCSS.js';
import {
  getPluginSystem,
  PLUGIN_HOOKS,
  type PluginContext,
  type PluginPayload
} from '../extensibility/PluginSystem.js';
import { fireEvent, deepClone, debug } from '../utils/helpers.js';
import { debounce, throttle, whenIdle, cancelIdle } from '../utils/performance.js';
import { 
  type CardConfigLike,
  type CardHelpers,
  getCardHelpers, 
  createCardElement, 
  createErrorCard
} from '../utils/ha-helpers.js';
import type { HomeAssistantLike } from '../providers/ProviderContext.js';
import type {
  FooterConfig,
  GridConfig,
  HeaderConfig,
  LayoutCardConfig,
  SectionVisibilityConfig,
  SwipeGestureAction,
  UniversalCardConfig
} from './config-contracts.js';

// UI Components
import { Header } from '../ui/Header.js';
import { Footer } from '../ui/Footer.js';
import { Badges } from '../ui/Badges.js';

// Modes
import { createMode, getAllModeStyles, TabsMode, CarouselMode } from '../modes/index.js';

// Styles
import { HEADER_FOOTER_STYLES } from '../styles/header-footer.js';
import { THEME_STYLES } from '../styles/themes.js';
import { SwipeGestures } from '../features/SwipeGestures.js';
import { VisibilityConditions } from '../features/VisibilityConditions.js';

type RuntimeDebugState = {
  initTime: number;
  renderCount: number;
  lastRenderTime: number;
};
type ModeState = {
  activeTab: number;
  activeSlide: number;
};
type CancelableTask = ((...args: any[]) => void) & {
  cancel?: () => void;
};
type BodyCardElement = HTMLElement & {
  hass?: HomeAssistantLike;
  destroy?: () => void;
};
type ModeInstance = ReturnType<typeof createMode>;
type AttachableMode = NonNullable<ModeInstance> & {
  attach?: () => void;
  detach?: () => void;
};
type PluginSystemInstance = ReturnType<typeof getPluginSystem>;
type VisibilityEvaluatorMap = {
  header: VisibilityConditions | null;
  body: VisibilityConditions | null;
  footer: VisibilityConditions | null;
};
type EscapeKeyHandler = ((event: KeyboardEvent) => void) | null;
type FooterInstance = Footer & {
  attach?: () => void;
  detach?: () => void;
};

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
  _config: UniversalCardConfig;
  _hass: HomeAssistantLike | null;
  _expanded: boolean;
  _initialized: boolean;
  _pendingHass: HomeAssistantLike | null;
  _initToken: number;
  _expandRequestToken: number;
  _header: Header | null;
  _footer: FooterInstance | null;
  _badges: Badges | null;
  _swipeGestures: SwipeGestures | null;
  _customCSS: CustomCSS | null;
  _mode: AttachableMode | null;
  _tabsMode: TabsMode | null;
  _carouselMode: CarouselMode | null;
  _subviewMode: AttachableMode | null;
  _visibilityEvaluator: VisibilityConditions | null;
  _sectionVisibilityEvaluators: VisibilityEvaluatorMap;
  _headerCards: BodyCardElement[];
  _bodyCards: BodyCardElement[];
  _tabCards: Record<number, BodyCardElement[]>;
  _bodyCardsLoaded: boolean;
  _bodyPoolKey: string | null;
  _helpers: CardHelpers | null;
  _activeTab: number;
  _carouselIndex: number;
  _modeState: ModeState;
  _isLoading: boolean;
  _autoCollapseTimer: number | null;
  _carouselTimer: number | null;
  _resizeHandler: CancelableTask;
  _hassUpdateHandler: CancelableTask;
  _intersectionObserver: IntersectionObserver | null;
  _bodyLoadPromise: Promise<void> | null;
  _bodyLoadToken: number;
  _pendingLazyIdleId: number | null;
  _pendingLazyIdleResolve: (() => void) | null;
  _visibilityRefreshTimer: number | null;
  _modalOverlay: HTMLElement | null;
  _fullscreenOverlay: HTMLElement | null;
  _modalEscHandler: EscapeKeyHandler;
  _fsEscHandler: EscapeKeyHandler;
  _debug: RuntimeDebugState;
  _initStartedAt: number;
  _pluginSystem: PluginSystemInstance;
  
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
  static getStubConfig(): UniversalCardConfig {
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
    debug('[UC] constructor() called');
    
    // Attach shadow DOM
    this.attachShadow({ mode: 'open' });
    debug('[UC] shadowRoot attached');
    
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

    /** @type {number} Initialization token for stale async guard */
    this._initToken = 0;

    /** @type {number} Expansion request token for stale async guard */
    this._expandRequestToken = 0;
    
    // ===========================================
    // COMPONENTS
    // ===========================================
    
    /** @type {Header|null} Header component instance */
    this._header = null;
    
    /** @type {Footer|null} Footer component instance */
    this._footer = null;
    
    /** @type {Badges|null} Badges component instance */
    this._badges = null;

    /** @type {SwipeGestures|null} Top-level swipe gesture controller */
    this._swipeGestures = null;

    /** @type {CustomCSS|null} Custom CSS controller */
    this._customCSS = null;
    
    /** @type {BaseMode|null} Body mode instance */
    this._mode = null;
    
    /** @type {TabsMode|null} Tabs mode instance */
    this._tabsMode = null;
    
    /** @type {CarouselMode|null} Carousel mode instance */
    this._carouselMode = null;

    /** @type {SubviewMode|null} Subview mode instance */
    this._subviewMode = null;

    /** @type {VisibilityConditions|null} Global card visibility evaluator */
    this._visibilityEvaluator = null;

    /** @type {{header: VisibilityConditions|null, body: VisibilityConditions|null, footer: VisibilityConditions|null}} */
    this._sectionVisibilityEvaluators = {
      header: null,
      body: null,
      footer: null
    };
    
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

    /** @type {string|null} Cache key for pooled body cards */
    this._bodyPoolKey = null;
    
    /** @type {Object|null} Card helpers from HA */
    this._helpers = null;
    
    // ===========================================
    // UI STATE
    // ===========================================
    
    /** @type {number} Active tab index */
    this._activeTab = 0;
    
    /** @type {number} Active carousel slide index */
    this._carouselIndex = 0;

    /** @type {{activeTab:number, activeSlide:number}} Persisted mode state */
    this._modeState = {
      activeTab: 0,
      activeSlide: 0
    };
    
    /** @type {boolean} Whether card is loading */
    this._isLoading = false;
    
    // ===========================================
    // TIMERS & HANDLERS
    // ===========================================
    
    /** @type {number|null} Auto-collapse timer ID */
    this._autoCollapseTimer = null;
    
    /** @type {number|null} Carousel autoplay timer ID */
    this._carouselTimer = null;
    
    /** @type {Function} Debounced resize handler */
    this._resizeHandler = debounce(
      () => this._handleResize(), 
      LIMITS.RESIZE_DEBOUNCE_MS
    ) as CancelableTask;
    
    /** @type {Function} Throttled hass update handler */
    this._hassUpdateHandler = throttle(
      () => this._updateDynamicContent(),
      LIMITS.UPDATE_THROTTLE_MS
    ) as CancelableTask;
    
    // ===========================================
    // OBSERVERS
    // ===========================================
    
    /** @type {IntersectionObserver|null} Lazy load observer */
    this._intersectionObserver = null;

    /** @type {Promise<void>|null} Current body loading task */
    this._bodyLoadPromise = null;

    /** @type {number} Body load cancellation token */
    this._bodyLoadToken = 0;

    /** @type {number|null} Idle callback id for lazy batches */
    this._pendingLazyIdleId = null;

    /** @type {Function|null} Resolver for an in-flight lazy idle wait */
    this._pendingLazyIdleResolve = null;

    /** @type {number|null} Visibility refresh timer for time-based conditions */
    this._visibilityRefreshTimer = null;

    /** @type {HTMLElement|null} Modal overlay reference */
    this._modalOverlay = null;

    /** @type {HTMLElement|null} Fullscreen overlay reference */
    this._fullscreenOverlay = null;
    
    // ===========================================
    // DEBUG
    // ===========================================
    
    /** @type {Object} Debug information */
    this._debug = {
      initTime: 0,
      renderCount: 0,
      lastRenderTime: 0
    };

    /** @type {number} Last initialization start timestamp */
    this._initStartedAt = 0;

    /** @type {import('../extensibility/PluginSystem.js').PluginSystem} Shared plugin system */
    this._pluginSystem = getPluginSystem();
  }
  
  // ===========================================================================
  // LIFECYCLE CALLBACKS
  // ===========================================================================
  
  /**
   * Called when element is added to DOM
   */
  connectedCallback() {
    debug('[UC] connectedCallback()');

    // Register in shared runtime event hub
    runtimeEventHub.register(this);
    
    // Setup Intersection Observer for lazy loading
    this._setupIntersectionObserver();
    if (this._initialized && this._config.lazy_load && !this._bodyCardsLoaded) {
      this._observeForLazyLoad();
    }
    
    // Reattach component event listeners
    if (this._header) this._header.attach();
    if (this._footer && this._footer.attach) this._footer.attach();
    if (this._mode && this._mode.attach) this._mode.attach();
    
    debug('[UC] connectedCallback() done');
  }
  
  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback() {
    debug('[UC] disconnectedCallback()');

    this._executePluginHookSync(PLUGIN_HOOKS.BEFORE_DESTROY, {
      config: this._config
    }, {
      phase: 'disconnect'
    });

    // Cleanup shared runtime subscriptions
    runtimeEventHub.unregister(this);

    this._cancelPendingBodyLoad();
    
    // Detach component event listeners (but keep references)
    if (this._header) this._header.detach();
    if (this._footer && this._footer.detach) this._footer.detach();
    if (this._mode && this._mode.detach) this._mode.detach();
    
    // Cleanup timers
    this._clearAllTimers();
    
    // Cleanup observers
    this._destroyIntersectionObserver();
    this._destroySwipeGestures();

    // Close active portal mode overlay/listeners
    if (this._mode && (this._config.body_mode === 'modal' || this._config.body_mode === 'fullscreen' || this._config.body_mode === 'subview')) {
      try {
        void this._mode.close();
      } catch {
        // Ignore mode cleanup errors on detach
      }
    }

    // Backward-compat cleanup for legacy overlays/listeners
    this._hideModal();
    this._hideFullscreen();
    
    // Note: don't destroy child cards - they might be reused
    debug('[UC] disconnectedCallback() done');
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
  set hass(hass: HomeAssistantLike) {
    this._hass = hass;

    if (this._visibilityEvaluator) {
      this._visibilityEvaluator.hass = hass;
    }
    Object.values(this._sectionVisibilityEvaluators).forEach((evaluator) => {
      if (evaluator) evaluator.hass = hass;
    });
    
    // If not initialized yet, store for later
    if (!this._initialized) {
      this._pendingHass = hass;
      return;
    }
    
    // Update components
    if (this._header) this._header.hass = hass;
    if (this._footer) this._footer.hass = hass;
    if (this._badges) this._badges.hass = hass;
    
    // Update mode instances
    if (this._mode) this._mode.hass = hass;
    if (this._tabsMode) this._tabsMode.hass = hass;
    if (this._carouselMode) this._carouselMode.hass = hass;
    if (this._subviewMode) this._subviewMode.hass = hass;
    
    // Update child cards
    this._updateChildCardsHass(hass);

    this._executePluginHookSync(PLUGIN_HOOKS.HASS_UPDATE, {
      hass,
      config: this._config
    });
    
    // Update dynamic content (throttled)
    this._hassUpdateHandler();
  }
  
  /**
   * Get the Home Assistant instance
   * 
   * @returns {Object|null} Home Assistant instance
   */
  get hass(): HomeAssistantLike {
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
  setConfig(config: CardConfigLike) {
    debug('[UC] setConfig() called', config);
    const startTime = performance.now();
    const previousCardId = this._config?.card_id;
    this._initStartedAt = startTime;
    const transformedConfigResult = this._executePluginHookSync(PLUGIN_HOOKS.CONFIG_TRANSFORM, {
      config: deepClone(config)
    }, {
      phase: 'setConfig'
    });
    const nextConfig = transformedConfigResult?.config && typeof transformedConfigResult.config === 'object'
      ? transformedConfigResult.config
      : config;
    
    // Validate and normalize configuration
    try {
      this._config = ConfigManager.normalize(nextConfig) as UniversalCardConfig;
      const validationResult = this._executePluginHookSync(PLUGIN_HOOKS.CONFIG_VALIDATE, {
        config: this._config,
        valid: true
      }, {
        phase: 'setConfig'
      });
      if (validationResult?.valid === false) {
        const pluginValidationMessage =
          typeof validationResult.error === 'string'
            ? validationResult.error
            : typeof validationResult.message === 'string'
              ? validationResult.message
              : 'Plugin config validation failed';
        throw new Error(pluginValidationMessage);
      }
      debug('[UC] config normalized');
    } catch(e) {
      console.error('[UC] config normalize error:', e);
      throw e;
    }
    
    this._debug.initTime = performance.now() - startTime;
    this._recordPerfMetric('config_change', this._debug.initTime);

    runtimeEventHub.updateCardId(this, previousCardId, this._config.card_id);

    // Increment init token to invalidate any in-flight async init
    this._initToken += 1;

    this._setupVisibilityEvaluators();

    // Cleanup previous runtime state before re-initializing
    this._resetRuntimeState();
    
    // Initialize card
    this._initializeCard(this._initToken);
  }

  /**
   * Setup visibility evaluators for card and sections
   *
   * @private
   */
  _setupVisibilityEvaluators() {
    this._visibilityEvaluator = new VisibilityConditions(this._config.visibility || []);
    if (this._hass) {
      this._visibilityEvaluator.hass = this._hass;
    }

    const sectionVisibility: SectionVisibilityConfig = this._config.section_visibility || {};
    (['header', 'body', 'footer'] as const).forEach((section) => {
      const evaluator = new VisibilityConditions(sectionVisibility[section] || []);
      if (this._hass) {
        evaluator.hass = this._hass;
      }
      this._sectionVisibilityEvaluators[section] = evaluator;
    });
  }
  
  /**
   * Get current configuration
   * 
   * @returns {Object} Current configuration
   */
  getConfig(): UniversalCardConfig {
    return deepClone(this._config) as UniversalCardConfig;
  }

  /**
   * Build hook execution context for the shared plugin system.
   *
   * @private
   * @param {Object} [extra]
   * @returns {Object}
   */
  _getPluginHookContext(extra: PluginContext = {}): PluginContext {
    return {
      card: this,
      card_id: this._config?.card_id,
      body_mode: this._config?.body_mode,
      config: this._config,
      expanded: this._expanded,
      hass: this._hass,
      initialized: this._initialized,
      isConnected: this.isConnected,
      shadowRoot: this.shadowRoot,
      ...extra
    };
  }

  /**
   * Execute a plugin hook synchronously.
   *
   * @private
   * @param {string} hookName
   * @param {Object} [data]
   * @param {Object} [context]
   * @returns {Object}
   */
  _executePluginHookSync(hookName: string, data: PluginPayload = {}, context: PluginContext = {}) {
    return this._pluginSystem.executeHookSync(
      hookName,
      data,
      this._getPluginHookContext(context)
    );
  }

  /**
   * Execute a plugin hook asynchronously.
   *
   * @private
   * @param {string} hookName
   * @param {Object} [data]
   * @param {Object} [context]
   * @returns {Promise<Object>}
   */
  _executePluginHook(hookName: string, data: PluginPayload = {}, context: PluginContext = {}) {
    return this._pluginSystem.executeHook(
      hookName,
      data,
      this._getPluginHookContext(context)
    );
  }

  /**
   * Emit a plugin state change notification.
   *
   * @private
   * @param {string} stateKey
   * @param {*} previousValue
   * @param {*} nextValue
   * @param {string} source
   */
  _notifyStateChange(stateKey, previousValue, nextValue, source) {
    if (previousValue === nextValue) {
      return;
    }

    this._executePluginHookSync(PLUGIN_HOOKS.STATE_CHANGE, {
      stateKey,
      previousValue,
      nextValue,
      source
    }, {
      source
    });
  }
  
  /**
   * Reset runtime state before re-initialization
   *
   * @private
   */
  _resetRuntimeState() {
    this._initialized = false;
    this._pendingHass = this._hass;
    this._isLoading = false;
    this._cancelPendingBodyLoad();

    this._clearAllTimers();
    this._destroyIntersectionObserver();
    this._destroySwipeGestures();
    this._hideModal();
    this._hideFullscreen();
    this._destroyCustomCSS();

    this._destroyChildCards();
    this.shadowRoot.innerHTML = '';
  }
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  /**
   * Initialize the card
   * 
   * @private
   */
  async _initializeCard(initToken) {
    debug('[UC] _initializeCard() start');
    const initStart = performance.now();
    const isStale = () => initToken !== this._initToken;

    try {
      await this._executePluginHook(PLUGIN_HOOKS.BEFORE_INIT, {
        config: this._config
      }, {
        phase: 'init'
      });
      if (isStale()) return;

      // Load card helpers
      debug('[UC] getting card helpers...');
      const helpers = await getCardHelpers();
      if (isStale()) return;
      this._helpers = helpers;
      debug('[UC] card helpers loaded');
      
      // Restore state if configured
      this._restoreState();
      debug('[UC] state restored');
      
      // Create Header component
      this._createHeaderComponent();
      debug('[UC] header created');
      
      // Create Footer component if configured
      if (this._config.footer) {
        this._createFooterComponent();
        debug('[UC] footer created');
      }
      
      // Create body mode instance
      this._createModeInstance();
      debug('[UC] mode created:', this._config.body_mode);
      
      // Perform initial render
      debug('[UC] starting render...');
      await this._render();
      if (isStale()) return;
      debug('[UC] render done');
      
      // Load header cards asynchronously
      if (this._header) {
        debug('[UC] loading header cards...');
        await this._header.loadCards();
        if (isStale()) return;
        debug('[UC] header cards loaded');
      }
      
      // Load footer cards asynchronously
      if (this._footer) {
        debug('[UC] loading footer cards...');
        await this._footer.loadCards();
        if (isStale()) return;
        debug('[UC] footer cards loaded');
      }
      
      // Setup lazy loading or load body cards
      if (this._config.lazy_load) {
        this._setupIntersectionObserver();
        this._observeForLazyLoad();
        debug('[UC] lazy load setup');
      } else if (this._expanded) {
        debug('[UC] loading body cards...');
        await this._loadBodyCards();
        if (isStale()) return;
        debug('[UC] body cards loaded');
      }

      if (isStale()) return;
      
      // Bind events
      this._bindEvents();
      debug('[UC] events bound');

      this._syncVisibilityRefreshTimer();
      
      // Mark as initialized
      this._initialized = true;
      const ttiMs = performance.now() - initStart;
      this._recordPerfMetric('tti', ttiMs);
      await this._executePluginHook(PLUGIN_HOOKS.AFTER_INIT, {
        config: this._config,
        ttiMs
      }, {
        phase: 'init'
      });
      debug('[UC] initialization complete!');
      
      // Apply pending hass
      if (this._pendingHass) {
        this.hass = this._pendingHass;
        this._pendingHass = null;
      }
      
    } catch (error) {
      console.error('[UC] Initialization failed:', error);
      this._renderError(error);
    }
  }
  
  /**
   * Create Header component instance
   * 
   * @private
   */
  _createHeaderComponent() {
    const headerOverrides = this._config.header || {};
    const headerConfig: HeaderConfig = {
      cards: headerOverrides.cards,
      header_left: this._config.header_left,
      header_right: this._config.header_right,
      title: this._config.title,
      subtitle: this._config.subtitle,
      icon: this._config.icon,
      entity: this._config.entity,
      show_state: this._config.show_state,
      show_expand_icon: this._config.show_expand_icon,
      expand_icon: this._config.expand_icon,
      body_mode: this._config.body_mode,
      sticky_header: this._config.sticky_header,
      sticky: headerOverrides.sticky,
      clickable: headerOverrides.clickable,
      expand_trigger: this._config.expand_trigger,
      badges: this._config.badges,
      tap_action: this._config.tap_action,
      hold_action: this._config.hold_action,
      double_tap_action: this._config.double_tap_action,
      context_menu: this._config.context_menu
    };
    
    this._header = new Header(headerConfig, {
      executePluginHookSync: (hookName, data, context) => this._executePluginHookSync(hookName, data, context)
    });
    if (this._hass) this._header.hass = this._hass;
  }
  
  /**
   * Create Footer component instance
   * 
   * @private
   */
  _createFooterComponent() {
    const footerConfig = this._config.footer as FooterConfig;
    this._footer = new Footer(footerConfig, {
      executePluginHookSync: (hookName, data, context) => this._executePluginHookSync(hookName, data, context)
    });
    if (this._hass) this._footer.hass = this._hass;
  }
  
  /**
   * Create body mode instance based on config
   * 
   * @private
   */
  _createModeInstance() {
    const bodyMode = this._config.body_mode || BODY_MODES.EXPAND;
    
    // Skip modes that are rendered/handled by dedicated branches
    if (
      bodyMode === BODY_MODES.NONE ||
      bodyMode === BODY_MODES.EXPAND ||
      bodyMode === BODY_MODES.TABS ||
      bodyMode === BODY_MODES.CAROUSEL
    ) {
      this._mode = null;
      this._subviewMode = null;
      return;
    }
    
    // Create mode instance
    this._mode = createMode(bodyMode, {
      ...this._config,
      cards: this._config.body?.cards || [],
      tabs: this._config.tabs || []
    }, {
      hass: this._hass,
      helpers: this._helpers,
      shadowRoot: this.shadowRoot,
      card: this,
      onClose: () => this._handleModeClosed()
    });
    
    if (this._mode && this._hass) {
      this._mode.hass = this._hass;
    }

    this._subviewMode = bodyMode === BODY_MODES.SUBVIEW ? this._mode : null;
  }
  
  /**
   * Restore saved state from localStorage
   * 
   * @private
   */
  _restoreState() {
    if (this._config.remember_expanded_state && this._config.card_id) {
      const key = `uc-state-${this._config.card_id}`;
      const saved = sharedStateStore.get(key, this._config.expanded);

      if (typeof saved === 'boolean') {
        this._expanded = saved;
      } else {
        this._expanded = this._config.expanded;
      }
    } else {
      this._expanded = this._config.expanded;
    }

    this._restoreModeState();
  }
  
  /**
   * Save current state to localStorage
   * 
   * @private
   */
  _saveState() {
    if (this._config.remember_expanded_state && this._config.card_id) {
      const key = `uc-state-${this._config.card_id}`;
      sharedStateStore.set(key, this._expanded);
    }
  }

  /**
   * Restore persisted mode state (tabs/carousel)
   *
   * @private
   */
  _restoreModeState() {
    this._modeState = { activeTab: 0, activeSlide: 0 };

    if (!this._config.remember_mode_state || !this._config.card_id) {
      return;
    }

    const raw = sharedStateStore.get(this._getModeStateKey(), null);
    if (!raw || typeof raw !== 'object') {
      return;
    }

    const activeTab = Number.isFinite(raw.activeTab) ? raw.activeTab : 0;
    const activeSlide = Number.isFinite(raw.activeSlide) ? raw.activeSlide : 0;

    this._modeState = {
      activeTab: Math.max(0, activeTab),
      activeSlide: Math.max(0, activeSlide)
    };
  }

  /**
   * Persist mode state
   *
   * @private
   * @param {Partial<{activeTab:number, activeSlide:number}>} patch
   */
  _saveModeState(patch = {}) {
    if (!this._config.remember_mode_state || !this._config.card_id) {
      return;
    }

    this._modeState = {
      ...this._modeState,
      ...patch
    };

    sharedStateStore.set(this._getModeStateKey(), this._modeState);
  }

  /**
   * Build storage key for mode state
   *
   * @private
   * @returns {string}
   */
  _getModeStateKey() {
    return `uc-mode-${this._config.card_id}`;
  }

  /**
   * Sync parent state when a portal/body mode closes itself.
   *
   * @private
   */
  _handleModeClosed() {
    this._clearAutoCollapseTimer();

    if (!this._expanded) {
      this._updateExpandedUI();
      return;
    }

    const previousExpanded = this._expanded;
    this._expanded = false;
    this._saveState();
    this._updateExpandedUI();
    this._notifyStateChange('expanded', previousExpanded, this._expanded, 'mode');

    fireEvent(this, EVENTS.CARD_COLLAPSED, {
      card_id: this._config.card_id,
      source: 'mode'
    });
  }

  /**
   * Check global card visibility
   *
   * @private
   * @returns {boolean}
   */
  _isCardVisible() {
    if (!this._visibilityEvaluator) {
      return true;
    }

    return this._visibilityEvaluator.evaluate();
  }

  /**
   * Check section visibility
   *
   * @private
   * @param {'header'|'body'|'footer'} section - Section name
   * @returns {boolean}
   */
  _isSectionVisible(section) {
    const evaluator = this._sectionVisibilityEvaluators?.[section];
    if (!evaluator) {
      return true;
    }

    return evaluator.evaluate();
  }

  /**
   * Apply current visibility state to DOM
   *
   * @private
   */
  _applyVisibilityState() {
    const cardVisible = this._isCardVisible();
    this.style.display = cardVisible ? '' : 'none';

    if (!cardVisible) {
      if (this._expanded) {
        this._collapse();
      }
      return;
    }

    const header = this.shadowRoot.querySelector('.header') as HTMLElement | null;
    if (header) {
      header.style.display = this._isSectionVisible('header') ? '' : 'none';
    }

    const bodyVisible = this._isSectionVisible('body');
    const body = this.shadowRoot.querySelector('.body') as HTMLElement | null;
    if (body) {
      body.style.display = bodyVisible ? '' : 'none';
    }
    if (!bodyVisible && this._expanded) {
      this._collapse();
    }

    const footer = this.shadowRoot.querySelector('.footer') as HTMLElement | null;
    if (footer) {
      footer.style.display = this._isSectionVisible('footer') ? '' : 'none';
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
    this._executePluginHookSync(PLUGIN_HOOKS.BEFORE_RENDER, {
      config: this._config,
      expanded: this._expanded
    }, {
      phase: 'render'
    });

    const styles = this._generateStyles();
    const showHeader = this._isSectionVisible('header');
    const showBody = this._isSectionVisible('body');
    const showFooter = this._isSectionVisible('footer');

    if (!showBody && this._expanded) {
      this._expanded = false;
      this._saveState();
    }
    
    // Build card classes
    const cardClasses = ['universal-card'];
    // Add theme class (skip 'default' - it uses HA dashboard theme)
    if (this._config.theme && this._config.theme !== 'default') {
      cardClasses.push(`theme-${this._config.theme}`);
    }
    
    // Create card container
    const cardContainer = document.createElement('div');
    cardContainer.className = cardClasses.join(' ');
    cardContainer.dataset.cardId = this._config.card_id;
    
    // Render Header using component
    if (this._header && showHeader) {
      this._header.expanded = this._expanded;
      const headerElement = this._header.render();
      cardContainer.appendChild(headerElement);
    }
    
    // Render Body
    const bodyElement = showBody ? this._applyBodyRenderHook(this._renderBodyElement()) : null;
    if (bodyElement) {
      cardContainer.appendChild(bodyElement);
    }
    
    // Render Footer using component
    if (this._footer && showFooter) {
      const footerElement = this._footer.render();
      cardContainer.appendChild(footerElement);
    }
    
    // Clear and append to shadow DOM
    this.shadowRoot.innerHTML = `<style>${styles}</style>`;
    this.shadowRoot.appendChild(cardContainer);
    this._applyCustomCSS();
    this._applyVisibilityState();
    this._setupSwipeGestures(cardContainer);
    
    this._debug.renderCount++;
    this._debug.lastRenderTime = performance.now() - startTime;
    this._recordPerfMetric('render', this._debug.lastRenderTime);
    await this._executePluginHook(PLUGIN_HOOKS.AFTER_RENDER, {
      config: this._config,
      expanded: this._expanded,
      renderTimeMs: this._debug.lastRenderTime,
      renderCount: this._debug.renderCount,
      sections: {
        header: showHeader,
        body: showBody,
        footer: showFooter
      }
    }, {
      phase: 'render'
    });
  }

  /**
   * Configure top-level swipe gestures for the rendered card.
   *
   * @private
   * @param {HTMLElement} cardContainer
   */
  _setupSwipeGestures(cardContainer: HTMLElement) {
    this._destroySwipeGestures();

    const swipe = this._config.swipe;
    if (!swipe?.enabled || !cardContainer) {
      return;
    }

    this._swipeGestures = new SwipeGestures(cardContainer, {
      threshold: swipe.threshold,
      velocityThreshold: swipe.velocityThreshold,
      direction: swipe.direction,
      preventScroll: swipe.preventScroll
    });

    (['left', 'right', 'up', 'down'] as const).forEach((direction) => {
      const action = swipe[direction];
      if (!action?.action || action.action === 'none') {
        return;
      }

      this._swipeGestures.on(direction, () => {
        this._handleSwipeAction(action);
      });
    });
  }

  /**
   * Destroy swipe gesture controller.
   *
   * @private
   */
  _destroySwipeGestures() {
    if (!this._swipeGestures) {
      return;
    }

    this._swipeGestures.destroy();
    this._swipeGestures = null;
  }
  
  /**
   * Render body as DOM element
   * 
   * @private
   * @returns {HTMLElement|null} Body element or null
   */
  _renderBodyElement() {
    const config = this._config;
    const mode = config.body_mode || 'expand';

    if (!this._isSectionVisible('body')) {
      return null;
    }
    
    // No body for modes that render outside/away from the card body
    if (mode === 'none' || mode === 'modal' || mode === 'fullscreen' || mode === 'subview') {
      return null;
    }
    
    const body = document.createElement('div');
    body.className = 'body';
    body.dataset.state = this._expanded ? 'expanded' : 'collapsed';
    body.dataset.mode = mode;
    body.dataset.expandAnimation = config.expand_animation || 'slide';
    body.dataset.collapseAnimation = config.collapse_animation || 'slide';
    body.dataset.cardsAnimation = config.cards_animation || 'fadeUp';
    body.dataset.cardsDirection = config.cards_direction || 'sequential';
    
    // Set animation duration and stagger
    const duration = config.animation_duration || 300;
    const stagger = config.cards_stagger || 50;
    body.style.setProperty('--expand-duration', `${duration}ms`);
    body.style.setProperty('--cards-stagger', `${stagger}ms`);
    
    // For tabs and carousel, use specialized mode renderers
    if (mode === 'tabs') {
      this._tabsMode = new TabsMode(config as ConstructorParameters<typeof TabsMode>[0], {
        activeTab: this._modeState.activeTab,
        onTabChange: (index) => this._saveModeState({ activeTab: index })
      });
      if (this._hass) this._tabsMode.hass = this._hass;
      const tabsContainer = this._tabsMode.render();
      body.appendChild(tabsContainer);
      return body;
    }
    
    if (mode === 'carousel') {
      this._carouselMode = new CarouselMode(config as ConstructorParameters<typeof CarouselMode>[0], {
        startIndex: this._modeState.activeSlide,
        onSlideChange: (index) => this._saveModeState({ activeSlide: index })
      });
      if (this._hass) this._carouselMode.hass = this._hass;
      const carouselContainer = this._carouselMode.render();
      body.appendChild(carouselContainer);
      return body;
    }
    
    // Standard expand mode - use body-content container
    const content = document.createElement('div');
    content.className = 'body-content';
    
    // Apply grid styles
    const gridStyles = this._getGridStyles();
    if (gridStyles) {
      content.style.cssText = gridStyles;
    }
    
    // Add skeleton if loading
    if (!this._bodyCardsLoaded && this._expanded) {
      content.appendChild(this._renderSkeleton());
    }
    
    body.appendChild(content);
    return body;
  }

  /**
   * Allow plugins to mutate or replace the rendered body element.
   *
   * @private
   * @param {HTMLElement|null} bodyElement
   * @returns {HTMLElement|null}
   */
  _applyBodyRenderHook(bodyElement) {
    if (!bodyElement) {
      return null;
    }

    const hookResult = this._executePluginHookSync(PLUGIN_HOOKS.BODY_RENDER, {
      element: bodyElement,
      mode: this._config.body_mode || BODY_MODES.EXPAND,
      section: 'body'
    }, {
      phase: 'render',
      section: 'body'
    });

    if (hookResult?.element && typeof hookResult.element === 'object') {
      return hookResult.element;
    }

    return bodyElement;
  }
  
  
  /**
   * Render skeleton loader
   * 
   * @private
   * @returns {HTMLElement} Skeleton container
   */
  _renderSkeleton() {
    const count = this._config.skeleton_count || DEFAULTS.skeleton_count;
    const container = document.createElement('div');
    container.className = 'skeleton-container';

    for (let i = 0; i < count; i += 1) {
      const skeletonCard = document.createElement('div');
      skeletonCard.className = 'skeleton-card';

      const title = document.createElement('div');
      title.className = 'skeleton-line title';
      const text = document.createElement('div');
      text.className = 'skeleton-line text';
      const shortText = document.createElement('div');
      shortText.className = 'skeleton-line text short';

      skeletonCard.appendChild(title);
      skeletonCard.appendChild(text);
      skeletonCard.appendChild(shortText);
      container.appendChild(skeletonCard);
    }

    return container;
  }
  
  /**
   * Render error state
   * 
   * @private
   * @param {Error} error - Error to display
   */
  _renderError(error) {
    this._destroyCustomCSS();
    this.shadowRoot.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = `
      .error-card {
        padding: 16px;
        background: var(--error-color, #f44336);
        color: white;
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .error-message { font-weight: 500; display: flex; align-items: center; gap: 8px; }
      .error-details { margin-top: 8px; font-size: 12px; opacity: 0.9; }
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'error-card';

    const message = document.createElement('div');
    message.className = 'error-message';
    const icon = document.createElement('ha-icon');
    icon.setAttribute('icon', 'mdi:alert-circle');
    const text = document.createElement('span');
    text.textContent = 'Universal Card Error';
    message.appendChild(icon);
    message.appendChild(text);

    const details = document.createElement('div');
    details.className = 'error-details';
    details.textContent = error?.message || 'Unknown error';

    wrapper.appendChild(message);
    wrapper.appendChild(details);

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);
  }

  /**
   * Apply sanitized custom CSS from config.
   *
   * @private
   */
  _applyCustomCSS() {
    this._destroyCustomCSS();

    if (!this._config.custom_css) {
      return;
    }

    this._customCSS = new CustomCSS(this.shadowRoot, {
      allowAnimations: this._config.stability_mode !== true
    });
    this._customCSS.applyFromConfig(this._config.custom_css);
  }

  /**
   * Dispose custom CSS controller.
   *
   * @private
   */
  _destroyCustomCSS() {
    if (!this._customCSS) {
      return;
    }

    this._customCSS.destroy();
    this._customCSS = null;
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
    if (this._bodyCardsLoaded) return;
    if (this._bodyLoadPromise) return this._bodyLoadPromise;

    const mode = this._config.body_mode || BODY_MODES.EXPAND;
    const configs = this._config.body?.cards || [];
    const loadStart = performance.now();
    const loadToken = ++this._bodyLoadToken;
    const isStale = () => loadToken !== this._bodyLoadToken;

    this._isLoading = true;
    this._bodyLoadPromise = (async () => {
      // For tabs/carousel/subview, loading is handled by mode implementations
      if (mode === BODY_MODES.TABS || mode === BODY_MODES.CAROUSEL || mode === BODY_MODES.SUBVIEW) {
        this._bodyCardsLoaded = true;
        return;
      }

      if (configs.length === 0) {
        this._bodyCardsLoaded = true;
        return;
      }

      const poolKey = this._getBodyPoolKey(configs, mode);
      this._bodyPoolKey = poolKey;

      if (this._config.enable_card_pool && poolKey) {
        const pooled = cardPool.acquire(poolKey);
        if (pooled && pooled.length === configs.length) {
          this._bodyCards = pooled;
          this._applyHassToCards(this._bodyCards);

          if (mode === BODY_MODES.EXPAND) {
            const container = this.shadowRoot.querySelector('.body-content') as HTMLElement | null;
            if (container) {
              const direction = this._config.cards_direction || 'sequential';
              const gridCols = this._config.grid?.columns || 1;
              const animationIndices = this._calculateAnimationIndices(pooled.length, direction, gridCols);
              await this._removeBodySkeleton(container);
              if (isStale()) {
                this._recyclePooledCards(poolKey, pooled);
                this._bodyCards = [];
                return;
              }
              this._appendBodyCardsBatch(container, pooled, configs, 0, animationIndices);
            }
          }

          this._bodyCardsLoaded = true;
          return;
        }
      }

      this._bodyCards = [];

      // Overlay modes do not need incremental DOM insertion
      if (mode !== BODY_MODES.EXPAND) {
        const allCards = await this._createBodyCardChunk(configs);
        if (isStale()) {
          this._disposeCards(allCards);
          return;
        }
        this._bodyCards = allCards;
        this._applyHassToCards(this._bodyCards);
        this._bodyCardsLoaded = true;
        return;
      }

      const container = this.shadowRoot.querySelector('.body-content') as HTMLElement | null;
      const direction = this._config.cards_direction || 'sequential';
      const gridCols = this._config.grid?.columns || 1;
      const animationIndices = this._calculateAnimationIndices(configs.length, direction, gridCols);
      const { initialBatchSize, batchSize, idleTimeout } = this._resolveLazyBatchConfig(configs.length);

      let index = 0;
      let firstBatch = true;

      while (index < configs.length) {
        const currentBatchSize = firstBatch ? initialBatchSize : batchSize;
        const chunkConfigs = configs.slice(index, index + currentBatchSize);
        const chunkCards = await this._createBodyCardChunk(chunkConfigs);
        if (isStale()) {
          this._disposeCards(chunkCards);
          return;
        }

        this._applyHassToCards(chunkCards);

        if (container) {
          if (firstBatch) {
            await this._removeBodySkeleton(container);
            if (isStale()) {
              this._disposeCards(chunkCards);
              return;
            }
          }
          this._bodyCards.push(...chunkCards);
          this._appendBodyCardsBatch(
            container,
            chunkCards,
            configs,
            index,
            animationIndices
          );
        } else {
          this._bodyCards.push(...chunkCards);
        }

        firstBatch = false;
        index += chunkCards.length;

        if (index < configs.length) {
          await this._yieldForLazyBatch(loadToken, idleTimeout);
          if (isStale()) return;
        }
      }

      this._bodyCardsLoaded = true;
    })().finally(() => {
      if (loadToken === this._bodyLoadToken) {
        this._isLoading = false;
        this._bodyLoadPromise = null;
      }
      this._recordPerfMetric('body_load', performance.now() - loadStart, {
        cardCount: configs.length
      });
    });

    return this._bodyLoadPromise;
  }

  /**
   * Build lazy-load batch settings
   *
   * @private
   * @param {number} totalCards
   * @returns {{initialBatchSize:number, batchSize:number, idleTimeout:number}}
   */
  _resolveLazyBatchConfig(totalCards) {
    if (this._config.stability_mode) {
      return {
        initialBatchSize: totalCards,
        batchSize: totalCards,
        idleTimeout: LIMITS.LAZY_MIN_TIMEOUT_MS
      };
    }

    const normalize = (value, fallback, min, max) => {
      const num = Number(value);
      if (!Number.isFinite(num)) return fallback;
      return Math.min(max, Math.max(min, Math.floor(num)));
    };

    const initial = normalize(
      this._config.lazy_initial_batch,
      DEFAULTS.lazy_initial_batch,
      LIMITS.LAZY_MIN_BATCH,
      LIMITS.LAZY_MAX_BATCH
    );
    const batch = normalize(
      this._config.lazy_batch_size,
      DEFAULTS.lazy_batch_size,
      LIMITS.LAZY_MIN_BATCH,
      LIMITS.LAZY_MAX_BATCH
    );
    const idleTimeout = normalize(
      this._config.lazy_idle_timeout,
      DEFAULTS.lazy_idle_timeout,
      LIMITS.LAZY_MIN_TIMEOUT_MS,
      LIMITS.LAZY_MAX_TIMEOUT_MS
    );

    return {
      initialBatchSize: Math.min(totalCards, initial),
      batchSize: Math.min(totalCards, batch),
      idleTimeout
    };
  }

  /**
   * Create a chunk of body cards with resilient error handling
   *
   * @private
   * @param {Object[]} chunkConfigs
   * @returns {Promise<HTMLElement[]>}
   */
  async _createBodyCardChunk(chunkConfigs: LayoutCardConfig[]) {
    const results = await Promise.allSettled(
      chunkConfigs.map((config) => createCardElement(config))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }

      return createErrorCard(result.reason, chunkConfigs[index]);
    });
  }

  /**
   * Apply hass to a list of cards
   *
   * @private
   * @param {HTMLElement[]} cards
   */
  _applyHassToCards(cards: BodyCardElement[]) {
    if (!this._hass || !Array.isArray(cards)) return;

    cards.forEach((card) => {
      if (!card || !('hass' in card)) return;
      try {
        card.hass = this._hass;
      } catch {
        // Ignore card-level hass assignment failures.
      }
    });
  }

  /**
   * Append a batch of body cards to DOM
   *
   * @private
   * @param {HTMLElement} container
   * @param {HTMLElement[]} cards
   * @param {Object[]} allConfigs
   * @param {number} startIndex
   * @param {number[]} animationIndices
   */
  _appendBodyCardsBatch(
    container: HTMLElement,
    cards: BodyCardElement[],
    allConfigs: LayoutCardConfig[],
    startIndex: number,
    animationIndices: number[]
  ) {
    const fragment = document.createDocumentFragment();

    cards.forEach((card, localIndex) => {
      const absoluteIndex = startIndex + localIndex;
      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';

      const animIndex = animationIndices[absoluteIndex];
      wrapper.style.setProperty('--card-index', String(animIndex));

      const cardConfig = allConfigs[absoluteIndex];
      if (cardConfig) {
        const colspan = cardConfig.colspan || (cardConfig.card_options && cardConfig.card_options.colspan);
        const rowspan = cardConfig.rowspan || (cardConfig.card_options && cardConfig.card_options.rowspan);

        if (colspan) {
          wrapper.style.gridColumn = 'span ' + colspan;
        }
        if (rowspan) {
          wrapper.style.gridRow = 'span ' + rowspan;
        }
      }

      wrapper.appendChild(card);
      fragment.appendChild(wrapper);
    });

    container.appendChild(fragment);
  }

  /**
   * Fade-out and remove skeleton from body container
   *
   * @private
   * @param {HTMLElement} container
   * @returns {Promise<void>}
   */
  async _removeBodySkeleton(container) {
    const skeleton = container.querySelector('.skeleton-container');
    if (!skeleton) return;

    skeleton.classList.add('fade-out');
    await new Promise((resolve) => setTimeout(resolve, 200));
    skeleton.remove();
  }

  /**
   * Yield between lazy-load batches during idle time
   *
   * @private
   * @param {number} loadToken
   * @param {number} idleTimeout
   * @returns {Promise<void>}
   */
  async _yieldForLazyBatch(loadToken, idleTimeout) {
    if (loadToken !== this._bodyLoadToken) return;

    await new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;

        if (this._pendingLazyIdleResolve === finish) {
          this._pendingLazyIdleResolve = null;
        }
        this._pendingLazyIdleId = null;
        resolve();
      };

      this._pendingLazyIdleResolve = finish;
      this._pendingLazyIdleId = whenIdle(finish, { timeout: idleTimeout });
    });
  }

  /**
   * Resolve configured card pool scope
   *
   * @private
   * @returns {'card'|'dashboard'|'global'}
   */
  _resolvePoolScope() {
    const scope = this._config.pool_scope;
    if (scope === 'dashboard' || scope === 'global' || scope === 'card') {
      return scope;
    }
    return DEFAULTS.pool_scope || 'card';
  }

  /**
   * Build scope partition token for pool keys
   *
   * @private
   * @param {'card'|'dashboard'|'global'} scope
   * @returns {string|null}
   */
  _getPoolScopeToken(scope) {
    if (scope === 'global') {
      return 'global';
    }

    if (scope === 'dashboard') {
      const path = typeof window !== 'undefined' ? (window.location?.pathname || '') : '';
      const search = typeof window !== 'undefined' ? (window.location?.search || '') : '';
      const token = `${path}${search || ''}` || 'default';
      return `dashboard:${token}`;
    }

    if (!this._config.card_id) {
      return null;
    }
    return `card:${this._config.card_id}`;
  }

  /**
   * Normalize numeric pool policy values
   *
   * @private
   * @param {number} value
   * @param {number} fallback
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  _normalizePoolNumber(value, fallback, min, max) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, Math.floor(num)));
  }

  /**
   * Build card pool release options from configuration
   *
   * @private
   * @returns {{scope:'card'|'dashboard'|'global', maxAgeMs:number, maxEntries:number}}
   */
  _getPoolReleaseOptions() {
    return {
      scope: this._resolvePoolScope(),
      maxAgeMs: this._normalizePoolNumber(
        this._config.pool_ttl_ms,
        DEFAULTS.pool_ttl_ms,
        LIMITS.POOL_MIN_TTL_MS,
        LIMITS.POOL_MAX_TTL_MS
      ),
      maxEntries: this._normalizePoolNumber(
        this._config.pool_max_entries,
        DEFAULTS.pool_max_entries,
        LIMITS.POOL_MIN_MAX_ENTRIES,
        LIMITS.POOL_MAX_MAX_ENTRIES
      )
    };
  }

  /**
   * Build stable pool key for body cards
   *
   * @private
   * @param {Object[]} configs
   * @param {string} mode
   * @returns {string|null}
   */
  _getBodyPoolKey(configs, mode) {
    if (!Array.isArray(configs) || configs.length === 0) {
      return null;
    }

    const scope = this._resolvePoolScope();
    const scopeToken = this._getPoolScopeToken(scope);
    if (!scopeToken) {
      return null;
    }

    const rawKey = `${scopeToken}:${mode}:${JSON.stringify(configs)}`;
    return `uc-pool:${scope}:${this._hashString(rawKey)}`;
  }

  /**
   * Small stable hash for pool keys
   *
   * @private
   * @param {string} input
   * @returns {string}
   */
  _hashString(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0;
    }
    return String(Math.abs(hash));
  }

  /**
   * Cancel current/queued body loading jobs
   *
   * @private
   */
  _cancelPendingBodyLoad() {
    this._bodyLoadToken += 1;
    this._isLoading = false;
    this._bodyLoadPromise = null;

    if (this._pendingLazyIdleId !== null) {
      cancelIdle(this._pendingLazyIdleId);
      this._pendingLazyIdleId = null;
    }

    if (this._pendingLazyIdleResolve) {
      const resolveIdle = this._pendingLazyIdleResolve;
      this._pendingLazyIdleResolve = null;
      resolveIdle();
    }
  }

  /**
   * Release loaded body cards to shared pool
   *
   * @private
   */
  _releaseBodyCardsToPool() {
    if (this._config.enable_card_pool && this._bodyPoolKey && this._bodyCards.length > 0) {
      cardPool.release(this._bodyPoolKey, this._bodyCards, this._getPoolReleaseOptions());
    }
    this._bodyCards = [];
  }

  /**
   * Return acquired pooled cards back into the shared pool.
   *
   * @private
   * @param {string|null} poolKey
   * @param {HTMLElement[]} cards
   */
  _recyclePooledCards(poolKey, cards) {
    if (!this._config.enable_card_pool || !poolKey || !Array.isArray(cards) || cards.length === 0) {
      return;
    }

    cardPool.release(poolKey, cards, this._getPoolReleaseOptions());
  }

  /**
   * Dispose cards created for a stale async load and never mounted.
   *
   * @private
   * @param {HTMLElement[]} cards
   */
  _disposeCards(cards) {
    if (!Array.isArray(cards) || cards.length === 0) {
      return;
    }

    cards.forEach((card) => {
      if (!card) return;

      try {
        if (typeof card.destroy === 'function') {
          card.destroy();
        }
      } catch {
        // Ignore card-level cleanup errors.
      }

      if (typeof card.remove === 'function') {
        card.remove();
      }
    });
  }
  
  /**
   * Update hass on all child cards
   * 
   * @private
   * @param {Object} hass - Home Assistant instance
   */
  _updateChildCardsHass(hass: HomeAssistantLike) {
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
    this._cancelPendingBodyLoad();

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

    if (this._mode && typeof this._mode.destroy === 'function') {
      this._mode.destroy();
    }
    if (this._tabsMode && typeof this._tabsMode.destroy === 'function') {
      this._tabsMode.destroy();
    }
    if (this._carouselMode && typeof this._carouselMode.destroy === 'function') {
      this._carouselMode.destroy();
    }
    if (this._subviewMode && typeof this._subviewMode.destroy === 'function') {
      this._subviewMode.destroy();
    }

    this._mode = null;
    this._tabsMode = null;
    this._carouselMode = null;
    this._subviewMode = null;

    this._releaseBodyCardsToPool();
    
    this._headerCards = [];
    this._tabCards = {};
    this._bodyCardsLoaded = false;
    this._bodyPoolKey = null;
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================

  /**
   * Build CSS custom property declarations from theme_tokens
   *
   * @private
   * @returns {string}
   */
  _getThemeTokenDeclarations() {
    const tokenNameRegex = /^--[a-z0-9_-]+$/i;
    const tokens = this._config.theme_tokens || {};

    return Object.entries(tokens)
      .filter(([name, value]) => tokenNameRegex.test(name) && typeof value === 'string' && value.trim())
      .map(([name, value]) => `${name}: ${(value as string).trim()};`)
      .join('\n        ');
  }
  
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
        ${this._getThemeTokenDeclarations()}
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
      /* THEMES */
      /* ============================= */
      
      ${THEME_STYLES}
      
      /* ============================= */
      /* BODY */
      /* ============================= */
      
      .body {
        overflow: hidden;
        will-change: max-height, opacity, transform;
        --expand-duration: var(--uc-transition-duration, 300ms);
      }
      
      /* Base states */
      .body[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
      }
      
      .body[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
        overflow: visible;
        pointer-events: auto;
      }
      
      /* ============================= */
      /* EXPAND ANIMATIONS */
      /* ============================= */
      
      /* None - instant */
      .body[data-expand-animation="none"] {
        transition: none !important;
      }
      
      /* Slide (default) */
      .body[data-expand-animation="slide"],
      .body:not([data-expand-animation]) {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease;
      }
      
      /* Fade */
      .body[data-expand-animation="fade"] {
        transition: opacity var(--expand-duration) ease, max-height 0s;
      }
      
      /* Scale */
      .body[data-expand-animation="scale"] {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease,
          transform var(--expand-duration) ease;
        transform-origin: top center;
      }
      .body[data-expand-animation="scale"][data-state="collapsed"] {
        transform: scaleY(0);
      }
      .body[data-expand-animation="scale"][data-state="expanded"] {
        transform: scaleY(1);
      }
      
      /* FadeUp */
      .body[data-expand-animation="fadeUp"].expanding .body-content {
        animation: body-fadeUp var(--expand-duration) ease forwards;
      }
      
      /* FadeDown */
      .body[data-expand-animation="fadeDown"].expanding .body-content {
        animation: body-fadeDown var(--expand-duration) ease forwards;
      }
      
      /* Bounce */
      .body[data-expand-animation="bounce"].expanding .body-content {
        animation: body-bounce var(--expand-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      }
      
      /* Flip */
      .body[data-expand-animation="flip"] {
        perspective: 1000px;
      }
      .body[data-expand-animation="flip"].expanding .body-content {
        animation: body-flip var(--expand-duration) ease forwards;
      }
      
      /* ============================= */
      /* COLLAPSE ANIMATIONS */
      /* ============================= */
      
      .body[data-collapse-animation="none"][data-state="collapsed"] {
        transition: none !important;
      }
      
      .body[data-collapse-animation="fadeDown"].collapsing .body-content {
        animation: body-collapse-fadeDown var(--expand-duration) ease forwards;
      }
      
      .body[data-collapse-animation="fadeUp"].collapsing .body-content {
        animation: body-collapse-fadeUp var(--expand-duration) ease forwards;
      }
      
      .body[data-collapse-animation="scale"].collapsing {
        transform-origin: top center;
        animation: body-collapse-scale var(--expand-duration) ease forwards;
      }
      
      /* ============================= */
      /* BODY KEYFRAMES */
      /* ============================= */
      
      @keyframes body-fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes body-fadeDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes body-bounce {
        0% { opacity: 0; transform: scale(0.3); }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes body-flip {
        from { opacity: 0; transform: perspective(400px) rotateX(-90deg); }
        to { opacity: 1; transform: perspective(400px) rotateX(0); }
      }
      
      @keyframes body-collapse-fadeDown {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
      
      @keyframes body-collapse-fadeUp {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
      }
      
      @keyframes body-collapse-scale {
        from { opacity: 1; transform: scaleY(1); }
        to { opacity: 0; transform: scaleY(0); }
      }
      
      .body-content {
        padding: var(--uc-padding);
      }
      
      /* ============================= */
      /* CARD WRAPPER */
      /* ============================= */
      
      .card-wrapper {
        min-width: 0;
        --card-index: 0;
      }
      
      .card-wrapper > * {
        height: 100%;
      }
      
      /* ============================= */
      /* CARDS CASCADE ANIMATIONS */
      /* ============================= */
      
      /* Card indices for stagger */
      .body-content .card-wrapper:nth-child(1) { --card-index: 0; }
      .body-content .card-wrapper:nth-child(2) { --card-index: 1; }
      .body-content .card-wrapper:nth-child(3) { --card-index: 2; }
      .body-content .card-wrapper:nth-child(4) { --card-index: 3; }
      .body-content .card-wrapper:nth-child(5) { --card-index: 4; }
      .body-content .card-wrapper:nth-child(6) { --card-index: 5; }
      .body-content .card-wrapper:nth-child(7) { --card-index: 6; }
      .body-content .card-wrapper:nth-child(8) { --card-index: 7; }
      .body-content .card-wrapper:nth-child(9) { --card-index: 8; }
      .body-content .card-wrapper:nth-child(10) { --card-index: 9; }
      .body-content .card-wrapper:nth-child(n+11) { --card-index: 10; }
      
      /* Base card animation */
      .body[data-state="expanded"] .card-wrapper {
        opacity: 0;
        animation-fill-mode: forwards;
        animation-delay: calc(var(--card-index) * var(--cards-stagger, 50ms));
        animation-duration: var(--expand-duration, 300ms);
      }
      
      /* FadeUp (default) */
      .body[data-cards-animation="fadeUp"][data-state="expanded"] .card-wrapper {
        animation-name: card-fadeUp;
      }
      
      /* FadeDown */
      .body[data-cards-animation="fadeDown"][data-state="expanded"] .card-wrapper {
        animation-name: card-fadeDown;
      }
      
      /* FadeLeft */
      .body[data-cards-animation="fadeLeft"][data-state="expanded"] .card-wrapper {
        animation-name: card-fadeLeft;
      }
      
      /* FadeRight */
      .body[data-cards-animation="fadeRight"][data-state="expanded"] .card-wrapper {
        animation-name: card-fadeRight;
      }
      
      /* Scale */
      .body[data-cards-animation="scale"][data-state="expanded"] .card-wrapper {
        animation-name: card-scale;
      }
      
      /* Bounce */
      .body[data-cards-animation="bounce"][data-state="expanded"] .card-wrapper {
        animation-name: card-bounce;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      /* Flip */
      .body[data-cards-animation="flip"][data-state="expanded"] .card-wrapper {
        animation-name: card-flip;
        perspective: 1000px;
      }
      
      /* None - instant */
      .body[data-cards-animation="none"][data-state="expanded"] .card-wrapper {
        opacity: 1;
        animation: none;
      }
      
      /* Collapsed state - hide cards */
      .body[data-state="collapsed"] .card-wrapper {
        opacity: 0;
        animation: none;
      }
      
      /* Card Animation Keyframes */
      @keyframes card-fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes card-fadeDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes card-fadeLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes card-fadeRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes card-scale {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes card-bounce {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.95);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes card-flip {
        from {
          opacity: 0;
          transform: perspective(400px) rotateY(-90deg);
        }
        to {
          opacity: 1;
          transform: perspective(400px) rotateY(0);
        }
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
      
      /* ============================= */
      /* MODE STYLES */
      /* ============================= */
      
      ${getAllModeStyles()}
    `;
  }
  
  /**
   * Get grid layout styles
   * 
   * @private
   * @returns {string} Inline style string
   */
  _getGridStyles() {
    const grid: GridConfig = this._config.grid || {};
    const columns = grid.columns || DEFAULTS.grid_columns;
    const gap = grid.gap || DEFAULTS.grid_gap;
    
    if (typeof columns === 'number') {
      if (columns <= 1) {
        return '';
      }

      return `
        display: grid;
        grid-template-columns: repeat(${columns}, 1fr);
        gap: ${gap};
      `.replace(/\s+/g, ' ').trim();
    }

    if (typeof columns === 'string' && columns.trim()) {
      return `
        display: grid;
        grid-template-columns: ${columns};
        gap: ${gap};
      `.replace(/\s+/g, ' ').trim();
    }

    return '';
  }
  
  /**
   * Calculate animation indices based on direction
   * 
   * @private
   * @param {number} count - Total number of cards
   * @param {string} direction - Animation direction
   * @param {number} cols - Number of grid columns
   * @returns {number[]} Array of animation indices
   */
  _calculateAnimationIndices(count, direction, cols) {
    const indices = [];
    const numCols = typeof cols === 'number' ? cols : 1;
    const numRows = Math.ceil(count / numCols);
    
    switch (direction) {
      case 'reverse':
        // Reverse order: last card first
        for (let i = 0; i < count; i++) {
          indices.push(count - 1 - i);
        }
        break;
        
      case 'center-out':
        // From center to edges
        const center = Math.floor(count / 2);
        for (let i = 0; i < count; i++) {
          indices.push(Math.abs(i - center));
        }
        break;
        
      case 'edges-in':
        // From edges to center
        const mid = Math.floor(count / 2);
        for (let i = 0; i < count; i++) {
          const distFromCenter = Math.abs(i - mid);
          indices.push(mid - distFromCenter);
        }
        break;
        
      case 'diagonal':
        // Diagonal wave (top-left to bottom-right)
        for (let i = 0; i < count; i++) {
          const row = Math.floor(i / numCols);
          const col = i % numCols;
          indices.push(row + col);
        }
        break;
        
      case 'wave':
        // Horizontal wave with row offset
        for (let i = 0; i < count; i++) {
          const row = Math.floor(i / numCols);
          const col = i % numCols;
          // Alternating direction per row
          const waveCol = row % 2 === 0 ? col : (numCols - 1 - col);
          indices.push(row * 2 + waveCol);
        }
        break;
        
      case 'random':
        // Random order (consistent within session)
        const tempIndices = Array.from({ length: count }, (_, i) => i);
        // Fisher-Yates shuffle with seeded random based on card count
        const seed = count * 7 + (numCols * 13);
        let random = seed;
        for (let i = tempIndices.length - 1; i > 0; i--) {
          random = (random * 1103515245 + 12345) & 0x7fffffff;
          const j = random % (i + 1);
          [tempIndices[i], tempIndices[j]] = [tempIndices[j], tempIndices[i]];
        }
        for (let i = 0; i < count; i++) {
          indices.push(tempIndices.indexOf(i));
        }
        break;
        
      case 'sequential':
      default:
        // Sequential order (default)
        for (let i = 0; i < count; i++) {
          indices.push(i);
        }
        break;
    }
    
    return indices;
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
      debug('[UC] binding header events');
      // Listen for custom events from Header component
      header.addEventListener('uc-toggle', () => {
        debug('[UC] uc-toggle received!');
        this._toggle();
      });
      header.addEventListener('uc-expand', () => {
        debug('[UC] uc-expand received!');
        this._expand();
      });
      header.addEventListener('uc-collapse', () => {
        debug('[UC] uc-collapse received!');
        this._collapse();
      });
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
   * Execute a configured swipe action.
   *
   * @private
   * @param {{action?: string}} actionConfig
   */
  _handleSwipeAction(actionConfig?: SwipeGestureAction) {
    switch (actionConfig?.action) {
      case 'expand':
        this._expand();
        break;
      case 'collapse':
        this._collapse();
        break;
      case 'toggle':
        this._toggle();
        break;
      case 'next':
        this._navigateRelative(1);
        break;
      case 'prev':
        this._navigateRelative(-1);
        break;
    }
  }

  /**
   * Navigate tabs/carousel relative to current active item.
   *
   * @private
   * @param {number} delta
   */
  _navigateRelative(delta) {
    if (this._carouselMode) {
      if (delta > 0) {
        this._carouselMode.next();
      } else {
        this._carouselMode.prev();
      }
      return;
    }

    if (this._tabsMode) {
      const nextIndex = (this._modeState.activeTab || 0) + delta;
      void this._tabsMode._selectTab(nextIndex);
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
    if (!this._isCardVisible() || !this._isSectionVisible('body')) return;
    const mode = this._config.body_mode || 'expand';
    const expandToken = ++this._expandRequestToken;
    const previousExpanded = this._expanded;
    const inlineLoadPromise = !this._bodyCardsLoaded && mode === 'expand'
      ? this._loadBodyCards().catch((error) => {
        console.error('[UniversalCard] Failed to load body cards during expand:', error);
      })
      : null;

    this._expanded = true;
    this._saveState();
    this._notifyStateChange('expanded', previousExpanded, this._expanded, 'expand');

    // Handle different modes
    
    if (mode === 'modal' || mode === 'fullscreen' || mode === 'subview') {
      if (!this._mode) {
        throw new Error(`Mode "${mode}" is not initialized`);
      }

      try {
        await this._mode.open();
      } catch (error) {
        console.error('[UniversalCard] Failed to open mode:', error);
        this._handleModeClosed();
        return;
      }

      if (!this._mode.active) {
        this._handleModeClosed();
        return;
      }

      this._updateExpandedUI();
    } else if (mode === 'tabs' && this._tabsMode) {
      this._updateExpandedUI();
      await this._tabsMode.open();
    } else if (mode === 'carousel' && this._carouselMode) {
      this._updateExpandedUI();
      await this._carouselMode.open();
    } else {
      // Standard expand with animation class
      const body = this.shadowRoot.querySelector('.body');
      this._updateExpandedUI();
      if (body) {
        body.classList.remove('collapsing');
        body.classList.add('expanding');
      }
      
      // Remove expanding class after animation
      const duration = this._config.animation_duration || 300;
      setTimeout(() => {
        if (body) body.classList.remove('expanding');
      }, duration + 50);
    }

    if (inlineLoadPromise) {
      await inlineLoadPromise;
      if (expandToken !== this._expandRequestToken || !this._expanded) {
        return;
      }
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

    const previousExpanded = this._expanded;
    this._expandRequestToken += 1;
    this._expanded = false;
    this._saveState();
    this._clearAutoCollapseTimer();
    this._notifyStateChange('expanded', previousExpanded, this._expanded, 'collapse');
    
    // Handle different modes
    const mode = this._config.body_mode || 'expand';
    
    if (mode === 'modal' || mode === 'fullscreen' || mode === 'subview') {
      if (!this._mode) {
        throw new Error(`Mode "${mode}" is not initialized`);
      }

      void this._mode.close();
      this._updateExpandedUI();
    } else if (mode === 'tabs' && this._tabsMode) {
      this._updateExpandedUI();
      this._tabsMode.close();
    } else if (mode === 'carousel' && this._carouselMode) {
      this._updateExpandedUI();
      this._carouselMode.close();
    } else {
      // Standard collapse with animation class
      const body = this.shadowRoot.querySelector('.body');
      if (body) {
        body.classList.remove('expanding');
        body.classList.add('collapsing');
      }
      this._updateExpandedUI();
      
      // Remove collapsing class after animation
      const duration = this._config.animation_duration || 300;
      setTimeout(() => {
        if (body) body.classList.remove('collapsing');
      }, duration + 50);
    }
    
    // Fire event
    fireEvent(this, EVENTS.CARD_COLLAPSED, {
      card_id: this._config.card_id
    });
  }
  
  /**
   * Show modal overlay
   * @private
   */
  _showModal() {
    // Remove existing modal
    this._hideModal();
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'uc-modal-overlay';
    overlay.innerHTML = `
      <style>
        .uc-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          animation: uc-fade-in 0.2s ease;
        }
        .uc-modal-content {
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow: auto;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: uc-scale-in 0.2s ease;
        }
        .uc-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .uc-modal-title {
          font-size: 18px;
          font-weight: 500;
        }
        .uc-modal-close {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          color: white;
          font-size: 16px;
        }
        .uc-modal-close:hover {
          background: rgba(255,255,255,0.2);
        }
        .uc-modal-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @keyframes uc-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes uc-scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      </style>
      <div class="uc-modal-content">
        <div class="uc-modal-header">
          <div class="uc-modal-title"></div>
          <button class="uc-modal-close">✕</button>
        </div>
        <div class="uc-modal-cards"></div>
      </div>
    `;

    const modalTitle = overlay.querySelector('.uc-modal-title');
    if (modalTitle) {
      modalTitle.textContent = this._config.title || 'Modal';
    }
    
    // Move cards to modal (not clone - custom elements don't clone well)
    const cardsContainer = overlay.querySelector('.uc-modal-cards');
    this._bodyCards.forEach(card => {
      if (this._hass) card.hass = this._hass;
      cardsContainer.appendChild(card);
    });
    
    // Close handlers
    overlay.querySelector('.uc-modal-close').addEventListener('click', () => this._collapse());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this._collapse();
    });
    
    this._modalEscHandler = (e) => {
      if (e.key === 'Escape') this._collapse();
    };
    document.addEventListener('keydown', this._modalEscHandler);
    
    document.body.appendChild(overlay);
    this._modalOverlay = overlay;
  }
  
  /**
   * Hide modal overlay
   * @private
   */
  _hideModal() {
    if (this._modalOverlay) {
      this._modalOverlay.remove();
      this._modalOverlay = null;
    }
    if (this._modalEscHandler) {
      document.removeEventListener('keydown', this._modalEscHandler);
      this._modalEscHandler = null;
    }
  }
  
  /**
   * Show fullscreen overlay
   * @private
   */
  _showFullscreen() {
    this._hideFullscreen();
    
    const overlay = document.createElement('div');
    overlay.className = 'uc-fullscreen-overlay';
    overlay.innerHTML = `
      <style>
        .uc-fullscreen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
          z-index: 9999;
          overflow: auto;
          padding: 20px;
          animation: uc-slide-up 0.3s ease;
        }
        .uc-fullscreen-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .uc-fullscreen-title {
          font-size: 24px;
          font-weight: 500;
        }
        .uc-fullscreen-close {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          color: white;
          font-size: 14px;
        }
        .uc-fullscreen-close:hover {
          background: rgba(255,255,255,0.2);
        }
        .uc-fullscreen-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }
        @keyframes uc-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      </style>
      <div class="uc-fullscreen-header">
        <div class="uc-fullscreen-title"></div>
        <button class="uc-fullscreen-close">✕ Закрыть</button>
      </div>
      <div class="uc-fullscreen-content"></div>
    `;

    const fullscreenTitle = overlay.querySelector('.uc-fullscreen-title');
    if (fullscreenTitle) {
      fullscreenTitle.textContent = this._config.title || 'Fullscreen';
    }
    
    // Move cards to fullscreen (not clone)
    const content = overlay.querySelector('.uc-fullscreen-content');
    this._bodyCards.forEach(card => {
      if (this._hass) card.hass = this._hass;
      content.appendChild(card);
    });
    
    overlay.querySelector('.uc-fullscreen-close').addEventListener('click', () => {
      this._collapse();
    });
    
    this._fsEscHandler = (e) => {
      if (e.key === 'Escape') this._collapse();
    };
    document.addEventListener('keydown', this._fsEscHandler);
    
    document.body.appendChild(overlay);
    this._fullscreenOverlay = overlay;
  }
  
  /**
   * Hide fullscreen overlay
   * @private
   */
  _hideFullscreen() {
    if (this._fullscreenOverlay) {
      this._fullscreenOverlay.remove();
      this._fullscreenOverlay = null;
    }
    if (this._fsEscHandler) {
      document.removeEventListener('keydown', this._fsEscHandler);
      this._fsEscHandler = null;
    }
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

    if (!this._isSectionVisible('body')) {
      return;
    }
    
    // For modal/fullscreen/subview - body is not shown in place
    const mode = this._config.body_mode || 'expand';
    if (mode === 'modal' || mode === 'fullscreen' || mode === 'subview') {
      return; // Don't show body content - it's in overlay
    }
    
    // Update body state for expand mode
    const body = this.shadowRoot.querySelector('.body') as HTMLElement | null;
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

    if (this._visibilityRefreshTimer) {
      clearTimeout(this._visibilityRefreshTimer);
      this._visibilityRefreshTimer = null;
    }

    if (typeof this._resizeHandler.cancel === 'function') {
      this._resizeHandler.cancel();
    }

    if (typeof this._hassUpdateHandler.cancel === 'function') {
      this._hassUpdateHandler.cancel();
    }
  }

  /**
   * Refresh visibility on time boundaries when time conditions are configured.
   *
   * @private
   */
  _syncVisibilityRefreshTimer() {
    if (this._visibilityRefreshTimer) {
      clearTimeout(this._visibilityRefreshTimer);
      this._visibilityRefreshTimer = null;
    }

    const evaluators = [
      this._visibilityEvaluator,
      ...Object.values(this._sectionVisibilityEvaluators || {})
    ];

    const hasTimeDependencies = evaluators.some(
      (evaluator) => evaluator && typeof evaluator.hasTimeDependencies === 'function' && evaluator.hasTimeDependencies()
    );

    if (!hasTimeDependencies) {
      return;
    }

    const now = new Date();
    const delayMs = ((60 - now.getSeconds()) * 1000) - now.getMilliseconds() + 50;

    this._visibilityRefreshTimer = setTimeout(() => {
      this._visibilityRefreshTimer = null;
      this._updateDynamicContent();
      this._syncVisibilityRefreshTimer();
    }, Math.max(250, delayMs));
  }
  
  // ===========================================================================
  // DYNAMIC CONTENT
  // ===========================================================================

  /**
   * Record runtime performance metric
   *
   * @private
   * @param {string} type
   * @param {number} durationMs
   * @param {Object} [meta]
   */
  _recordPerfMetric(type, durationMs, meta = {}) {
    performanceBudgetTracker.record(type, durationMs, {
      card_id: this._config?.card_id,
      ...meta
    });
  }
  
  /**
   * Update dynamic content based on current state
   * 
   * @private
   */
  _updateDynamicContent() {
    const start = performance.now();
    this._executePluginHookSync(PLUGIN_HOOKS.BEFORE_UPDATE, {
      config: this._config,
      expanded: this._expanded
    }, {
      phase: 'update'
    });
    this._applyVisibilityState();
    const durationMs = performance.now() - start;
    this._recordPerfMetric('update', durationMs);
    this._executePluginHookSync(PLUGIN_HOOKS.AFTER_UPDATE, {
      config: this._config,
      expanded: this._expanded,
      durationMs
    }, {
      phase: 'update'
    });
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
