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
import { createCardElements, executeAction } from '../utils/ha-helpers.js';
import { ACTION_TYPES } from '../core/constants.js';
import {
  type ActionConfig,
  type ActionTriggerMeta as HookActionTriggerMeta,
  type HookExecutor,
  buildActionExecutionOptions,
  executeCardActionWithPluginBridge,
  isHeaderCardAction,
  runInteractionHook,
  shouldStopPluginResult
} from '../core/action-hooks.js';
import type {
  HeaderBadgeConfig,
  HeaderConfig,
  LayoutCardConfig
} from '../core/config-contracts.js';
import { PLUGIN_HOOKS, type PluginContext, type PluginPayload } from '../extensibility/PluginSystem.js';
import type { HomeAssistantLike, ProviderSource } from '../providers/ProviderContext.js';
import { normalizeDerivedProviderContext } from '../providers/DerivedProviderContext.js';

type HeaderOptions = {
  executePluginHookSync?: HookExecutor;
};
type HeaderProviders = ReturnType<typeof normalizeDerivedProviderContext>;
type HeaderCardElement = HTMLElement & {
  hass?: HomeAssistantLike;
  destroy?: () => void;
};
type HeaderCardStorageKey = '_leftCards' | '_rightCards' | '_contentCards';
type HeaderActionKey = 'tap_action' | 'hold_action' | 'double_tap_action';
type ActionTriggerMeta = HookActionTriggerMeta;
type HeaderBoundHandlers = {
  click: EventListener;
  touchstart: EventListener;
  touchend: EventListener;
  touchcancel: EventListener;
  mousedown: EventListener;
  mouseup: EventListener;
  mouseleave: EventListener;
  keydown: EventListener;
  contextmenu: EventListener;
};

// =============================================================================
// HEADER COMPONENT
// =============================================================================

/**
 * Header component for Universal Card
 * 
 * @class Header
 */
export class Header {
  _config: HeaderConfig;
  _options: HeaderOptions;
  _element: HTMLElement | null;
  _leftCards: HeaderCardElement[];
  _rightCards: HeaderCardElement[];
  _contentCards: HeaderCardElement[];
  _hass: HomeAssistantLike;
  _providers: HeaderProviders | null;
  _expanded: boolean;
  _holdTimer: number | null;
  _isHolding: boolean;
  _holdDuration: number;
  _lastTapTime: number;
  _doubleTapThreshold: number;
  _attached: boolean;
  _boundHandlers: HeaderBoundHandlers | null;
  
  /**
   * Create Header instance
   * 
   * @param {Object} config - Header configuration
   * @param {Object} options - Additional options
   */
  constructor(config: HeaderConfig, options: HeaderOptions = {}) {
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

    /** @type {Object|null} Provider context */
    this._providers = null;
    
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
  set hass(hass: ProviderSource) {
    this._providers = normalizeDerivedProviderContext(hass);
    this._hass = this._providers.getHass();
    this._updateCards(this._hass);
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

    const renderHookResult = this._executePluginHookSync(PLUGIN_HOOKS.HEADER_RENDER, {
      component: this,
      element: this._element,
      expanded: this._expanded
    }, {
      phase: 'render'
    });

    const renderedElement = renderHookResult?.element;
    if (renderedElement && typeof renderedElement === 'object') {
      this._element = renderedElement as HTMLElement;
    }
    
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
    const providers = this._getProviders();

    let subtitleText = subtitle || '';

    // Show entity state as subtitle if configured
    if (show_state !== false && entity && providers) {
      const stateValue = providers.derived.entities.getValue(entity, undefined, 'unavailable');
      const stateText = stateValue === undefined || stateValue === null ? '' : String(stateValue);
      if (stateText && stateText !== 'unavailable') {
        subtitleText = subtitleText ? `${subtitleText} · ${stateText}` : stateText;
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
    
    const badgesHtml = badges.map((badge, index) => this._renderBadge(badge, index)).join('');
    
    return `<div class="header-badges">${badgesHtml}</div>`;
  }
  
  /**
   * Render single badge
   * 
   * @private
   * @param {Object} badge - Badge configuration
   * @param {number} index - Badge index
   * @returns {string} HTML string
   */
  _renderBadge(badge: HeaderBadgeConfig, index: number) {
    const rawValue = this._getBadgeValue(badge);
    const displayValue = this._getBadgeDisplayValue(badge, rawValue);
    const badgeColor = badge.color || this._getBadgeAutoColor(badge);
    const iconHtml = badge.icon ? `<ha-icon icon="${badge.icon}"></ha-icon>` : '';
    const badgeLabel = this._getBadgeLabel(badge);
    const labelHtml = badgeLabel ? `<span class="badge-label">${badgeLabel}</span>` : '';
    const valueHtml = displayValue !== null && displayValue !== undefined && displayValue !== ''
      ? `<span class="badge-value">${displayValue}</span>${badge.unit ? `<span class="badge-unit">${badge.unit}</span>` : ''}`
      : '';
    const progressHtml = this._renderBadgeProgress(badge, rawValue);
    const clickable = badge.tap_action?.action && badge.tap_action.action !== 'none' ? ' clickable' : '';

    return `
      <div class="badge${clickable}" data-badge-index="${index}" style="--badge-color: ${badgeColor}">
        ${iconHtml}${labelHtml}${valueHtml}${progressHtml}
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
  async _loadSlotCards(configs: LayoutCardConfig[], selector: string, storageKey: HeaderCardStorageKey) {
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
  _updateCards(hass: HomeAssistantLike) {
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
      touchstart: (e) => this._handleTouchStart(e as TouchEvent),
      touchend: (e) => this._handleTouchEnd(e as TouchEvent),
      touchcancel: () => this._cancelHold(),
      mousedown: (e) => this._handleMouseDown(e as MouseEvent),
      mouseup: () => this._handleMouseUp(),
      mouseleave: () => this._cancelHold(),
      keydown: (e) => this._handleKeydown(e as KeyboardEvent),
      contextmenu: (e) => this._handleContextMenu(e as MouseEvent)
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
  _handleClick(event: Event) {
    debug('[UC-Header] click!', event.target);

    const badgeElement = this._findBadgeElement(event.target);
    if (badgeElement?.classList?.contains('clickable')) {
      debug('[UC-Header] badge tap');
      event.preventDefault();
      this._handleBadgeClick(badgeElement);
      return;
    }
    
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

    if (!this._requiresDoubleTapDelay()) {
      const clickResult = runInteractionHook({
        actionConfig: this._config.tap_action,
        actionKey: 'tap_action',
        element: this._element,
        event,
        executePluginHookSync: this._executePluginHookSync.bind(this),
        hookName: PLUGIN_HOOKS.CLICK,
        interaction: 'tap',
        source: 'header'
      });
      if (shouldStopPluginResult(clickResult)) {
        return;
      }
      this._executeAction('tap_action', { event, interaction: 'tap', source: 'header' });
      return;
    }
    
    if (timeSinceLastTap < this._doubleTapThreshold) {
      // Double-tap detected
      debug('[UC-Header] double-tap detected');
      event.preventDefault();
      const clickResult = runInteractionHook({
        actionConfig: this._config.double_tap_action,
        actionKey: 'double_tap_action',
        element: this._element,
        event,
        executePluginHookSync: this._executePluginHookSync.bind(this),
        hookName: PLUGIN_HOOKS.CLICK,
        interaction: 'double_tap',
        source: 'header'
      });
      if (shouldStopPluginResult(clickResult)) {
        return;
      }
      this._executeAction('double_tap_action', { event, interaction: 'double_tap', source: 'header' });
      return;
    }
    
    // Single tap - delay to check for double-tap
    setTimeout(() => {
      if (Date.now() - this._lastTapTime >= this._doubleTapThreshold) {
        const clickResult = runInteractionHook({
          actionConfig: this._config.tap_action,
          actionKey: 'tap_action',
          element: this._element,
          event,
          executePluginHookSync: this._executePluginHookSync.bind(this),
          hookName: PLUGIN_HOOKS.CLICK,
          interaction: 'tap',
          source: 'header'
        });
        if (shouldStopPluginResult(clickResult)) {
          return;
        }
        this._executeAction('tap_action', { event, interaction: 'tap', source: 'header' });
      }
    }, this._doubleTapThreshold);
  }

  /**
   * Check whether tap handling must wait for a potential double-tap.
   *
   * @private
   * @returns {boolean}
   */
  _requiresDoubleTapDelay() {
    if (this._config.expand_trigger === 'double_tap') {
      return true;
    }

    const doubleTapAction = this._config.double_tap_action;
    return Boolean(doubleTapAction?.action && doubleTapAction.action !== ACTION_TYPES.NONE);
  }
  
  /**
   * Handle touch start
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchStart(event: TouchEvent) {
    if (this._isInteractiveElement(event.target)) return;
    this._startHold();
  }
  
  /**
   * Handle touch end
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchEnd(_event: TouchEvent) {
    this._endHold();
  }
  
  /**
   * Handle mouse down
   * 
   * @private
   * @param {MouseEvent} event - Mouse event
   */
  _handleMouseDown(event: MouseEvent) {
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
      const holdResult = runInteractionHook({
        actionConfig: this._config.hold_action,
        actionKey: 'hold_action',
        element: this._element,
        executePluginHookSync: this._executePluginHookSync.bind(this),
        hookName: PLUGIN_HOOKS.HOLD,
        interaction: 'hold',
        source: 'header'
      });
      if (shouldStopPluginResult(holdResult)) {
        return;
      }
      this._executeAction('hold_action', { interaction: 'hold', source: 'header' });
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
  _handleKeydown(event: KeyboardEvent) {
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
  _handleContextMenu(event: MouseEvent) {
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
  _isInteractiveElement(target: EventTarget | null) {
    const element = target instanceof HTMLElement ? target : null;

    // Guard: if element is destroyed, ignore
    if (!this._element || !element) {
      return true; // Block interaction if header is destroyed
    }

    // Пропускаем если клик на сам header или его контент
    if (element === this._element || this._element.contains?.(element)) {
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
      let el: HTMLElement | null = element;
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
  _executeAction(actionKey: HeaderActionKey, triggerMeta: ActionTriggerMeta = {}) {
    debug('[UC-Header] _executeAction:', actionKey);
    
    // Определяем какой триггер используется для раскрытия
    const expandTrigger = this._config.expand_trigger || 'tap';
    const expandActionKey: HeaderActionKey | null = expandTrigger === 'double_tap'
      ? 'double_tap_action'
      : expandTrigger === 'hold'
        ? 'hold_action'
        : expandTrigger === 'tap'
          ? 'tap_action'
          : null;
    
    debug('[UC-Header] expand_trigger:', expandTrigger, 'expandActionKey:', expandActionKey);
    
    const actionConfig = this._config[actionKey] as ActionConfig | undefined;
    const hasExplicitAction = actionConfig && actionConfig.action && actionConfig.action !== 'none';
    
    debug('[UC-Header] actionConfig:', actionConfig, 'hasExplicitAction:', hasExplicitAction);
    
    // Если это триггер раскрытия и нет явного action - делаем toggle
    if (actionKey === expandActionKey && !hasExplicitAction && expandTrigger !== 'none') {
      debug('[UC-Header] firing uc-toggle (expand trigger default)');
      executeCardActionWithPluginBridge({
        actionConfig: {
          action: ACTION_TYPES.TOGGLE,
          target: 'card'
        },
        actionKey,
        dispatchCardAction: (actionType) => this._dispatchCardAction(actionType),
        element: this._element,
        executeAction: (nextAction, options) => executeAction(
          this._getProviders() || this._hass,
          this._element,
          nextAction,
          options
        ),
        executePluginHookSync: this._executePluginHookSync.bind(this),
        isCardAction: isHeaderCardAction,
        section: 'header',
        triggerMeta: {
          ...triggerMeta,
          source: triggerMeta.source || 'header',
          implicit: true
        }
      });
      return;
    }
    
    // Если нет явного action - ничего не делаем
    if (!hasExplicitAction) {
      debug('[UC-Header] no explicit action');
      return;
    }
    
    if (isHeaderCardAction(actionConfig)) {
      executeCardActionWithPluginBridge({
        actionConfig: {
          ...actionConfig,
          target: actionConfig.target || 'card'
        },
        actionKey,
        dispatchCardAction: (actionType) => this._dispatchCardAction(actionType),
        element: this._element,
        executeAction: (nextAction, options) => executeAction(
          this._getProviders() || this._hass,
          this._element,
          nextAction,
          options
        ),
        executePluginHookSync: this._executePluginHookSync.bind(this),
        isCardAction: isHeaderCardAction,
        section: 'header',
        triggerMeta: {
          ...triggerMeta,
          source: triggerMeta.source || 'header'
        }
      });
      return;
    }
    
    // Execute HA action
    debug('[UC-Header] executing HA action');
    executeAction(
      this._getProviders() || this._hass,
      this._element,
      actionConfig,
      buildActionExecutionOptions({
        actionKey,
        event: triggerMeta.event || null,
        executePluginHookSync: this._options.executePluginHookSync,
        interaction: triggerMeta.interaction || null,
        section: 'header',
        source: triggerMeta.source || 'header'
      })
    );
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
    const providers = this._getProviders();
    if (!this._element || !providers) return;

    // Update subtitle with state
    if (this._config.entity && this._config.show_state !== false) {
      const subtitleEl = this._element.querySelector('.header-subtitle');
      if (subtitleEl) {
        const stateValue = providers.derived.entities.getValue(this._config.entity, undefined, 'unavailable');
        const stateText = stateValue === undefined || stateValue === null ? '' : String(stateValue);
        const subtitle = this._config.subtitle;
        subtitleEl.textContent = subtitle ? `${subtitle} · ${stateText}` : stateText;
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
    
    const badgeElements = this._element.querySelectorAll<HTMLElement>('.badge');
    
    badges.forEach((badge, index) => {
      if (!badgeElements[index]) return;

      const rawValue = this._getBadgeValue(badge);
      const displayValue = this._getBadgeDisplayValue(badge, rawValue);
      const valueEl = badgeElements[index].querySelector('.badge-value');
      
      if (valueEl) {
        valueEl.textContent = displayValue ?? '';
      }

      const labelEl = badgeElements[index].querySelector('.badge-label');
      if (labelEl) {
        labelEl.textContent = this._getBadgeLabel(badge) || '';
      }

      const unitEl = badgeElements[index].querySelector('.badge-unit');
      if (unitEl) {
        unitEl.textContent = badge.unit || '';
      }

      const color = badge.color || this._getBadgeAutoColor(badge);
      badgeElements[index].style.setProperty('--badge-color', color);

      const progressBar = badgeElements[index].querySelector<HTMLElement>('.badge-progress-bar');
      if (progressBar) {
        const percentage = this._getBadgeProgressPercentage(badge, rawValue);
        progressBar.style.width = percentage !== null ? `${percentage}%` : '0%';
      }
    });
  }

  /**
   * Resolve formatted badge value.
   *
   * @private
   * @param {Object} badge
   * @param {*} [value]
   * @returns {string|null}
   */
  _getBadgeDisplayValue(badge: HeaderBadgeConfig, value = this._getBadgeValue(badge)) {
    if (value === null || value === undefined) {
      return null;
    }
    return this._formatBadgeValue(value, badge);
  }

  /**
   * Resolve badge label.
   *
   * @private
   * @param {Object} badge
   * @returns {string}
   */
  _getBadgeLabel(badge: HeaderBadgeConfig) {
    if (badge.label) {
      return badge.label;
    }

    if (badge.show_name && badge.entity) {
      return this._getEntityName(badge.entity) || '';
    }

    return '';
  }

  /**
   * Resolve raw badge value.
   *
   * @private
   * @param {Object} badge
   * @returns {*}
   */
  _getBadgeValue(badge: HeaderBadgeConfig) {
    const { type = 'state', entity, attribute, value } = badge;
    const providers = this._getProviders();

    if (value !== undefined) {
      return value;
    }

    if (!providers) {
      return null;
    }

    switch (type) {
      case 'attribute':
        return entity && attribute ? providers.derived.entities.getValue(entity, attribute) : null;
      case 'counter':
        return this._getBadgeCounterValue(badge);
      case 'state':
      default:
        return entity ? providers.derived.entities.getValue(entity, undefined, '') : null;
    }
  }

  /**
   * Compute counter badge value.
   *
   * @private
   * @param {Object} badge
   * @returns {number}
   */
  _getBadgeCounterValue(badge: HeaderBadgeConfig) {
    const providers = this._getProviders();
    if (!providers) {
      return 0;
    }

    const targetState = badge.count_state || badge.state || 'on';
    return providers.derived.entities.count({
      domain: badge.domain,
      entities: badge.entities,
      state: targetState
    });
  }

  /**
   * Format badge value for display.
   *
   * @private
   * @param {*} value
   * @param {Object} badge
   * @returns {string}
   */
  _formatBadgeValue(value: unknown, badge: HeaderBadgeConfig) {
    const normalizedStringValue = String(value);

    if (badge.precision !== undefined && !Number.isNaN(Number.parseFloat(normalizedStringValue))) {
      return Number.parseFloat(normalizedStringValue).toFixed(badge.precision);
    }

    if (badge.format === 'time' || badge.format === 'date') {
      try {
        const normalizedDateValue = typeof value === 'number' || typeof value === 'string'
          ? value
          : normalizedStringValue;
        const date = new Date(normalizedDateValue);
        return badge.format === 'time'
          ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('ru-RU');
      } catch {
        return String(value);
      }
    }

    if (badge.format === 'duration') {
      return this._formatBadgeDuration(value);
    }

    return String(value);
  }

  /**
   * Format badge duration.
   *
   * @private
   * @param {*} seconds
   * @returns {string}
   */
  _formatBadgeDuration(seconds: unknown) {
    const numeric = Number.parseInt(String(seconds), 10);
    if (Number.isNaN(numeric)) {
      return String(seconds);
    }

    const hours = Math.floor(numeric / 3600);
    const minutes = Math.floor((numeric % 3600) / 60);
    const remainingSeconds = numeric % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  /**
   * Resolve automatic badge color.
   *
   * @private
   * @param {Object} badge
   * @returns {string}
   */
  _getBadgeAutoColor(badge: HeaderBadgeConfig) {
    const rawValue = this._getBadgeValue(badge);
    const providers = this._getProviders();

    if (badge.entity && providers) {
      const state = providers.entities.getState(badge.entity);
      if (state) {
        const stateColor = this._getStateColor(state.state);
        if (stateColor) {
          return stateColor;
        }
      }
    }

    if (Array.isArray(badge.thresholds)) {
      const numeric = Number.parseFloat(String(rawValue));
      if (!Number.isNaN(numeric)) {
        const sorted = [...badge.thresholds].sort((left, right) => right.value - left.value);
        for (const threshold of sorted) {
          if (numeric >= threshold.value) {
            return threshold.color;
          }
        }
      }
    }

    return 'var(--primary-color)';
  }

  /**
   * Render badge progress bar.
   *
   * @private
   * @param {Object} badge
   * @param {*} rawValue
   * @returns {string}
   */
  _renderBadgeProgress(badge: HeaderBadgeConfig, rawValue: unknown) {
    const percentage = this._getBadgeProgressPercentage(badge, rawValue);
    if (percentage === null) {
      return '';
    }

    return `
      <div class="badge-progress">
        <div class="badge-progress-bar" style="width: ${percentage}%"></div>
      </div>
    `;
  }

  /**
   * Compute progress percentage for numeric badges.
   *
   * @private
   * @param {Object} badge
   * @param {*} rawValue
   * @returns {number|null}
   */
  _getBadgeProgressPercentage(badge: HeaderBadgeConfig, rawValue: unknown) {
    if (!badge.show_progress || badge.min === undefined || badge.max === undefined) {
      return null;
    }

    const numeric = Number.parseFloat(String(rawValue));
    if (Number.isNaN(numeric) || badge.max === badge.min) {
      return null;
    }

    return Math.min(100, Math.max(0, ((numeric - badge.min) / (badge.max - badge.min)) * 100));
  }

  /**
   * Find badge element from a target.
   *
   * @private
   * @param {HTMLElement|null} target
   * @returns {HTMLElement|null}
   */
  _findBadgeElement(target: EventTarget | null) {
    let element = target instanceof HTMLElement ? target : null;

    while (element && element !== this._element) {
      if (element.classList?.contains('badge')) {
        return element;
      }
      element = element.parentElement;
    }

    return null;
  }

  /**
   * Execute badge tap action.
   *
   * @private
   * @param {HTMLElement} badgeElement
   */
  _handleBadgeClick(badgeElement: HTMLElement) {
    const badgeIndex = parseInt(badgeElement.dataset.badgeIndex, 10);
    if (Number.isNaN(badgeIndex)) {
      return;
    }

    const badge = this._config.badges?.[badgeIndex];
    if (!badge?.tap_action || badge.tap_action.action === 'none') {
      return;
    }

    const actionConfig = badge.entity && !badge.tap_action.entity
      ? { ...badge.tap_action, entity: badge.entity }
      : badge.tap_action;

    const clickResult = runInteractionHook({
      actionConfig,
      actionKey: `badges[${badgeIndex}].tap_action`,
      element: badgeElement,
      executePluginHookSync: this._executePluginHookSync.bind(this),
      extra: { badge, badgeIndex },
      hookName: PLUGIN_HOOKS.CLICK,
      interaction: 'badge_tap',
      source: 'badge'
    });

    if (shouldStopPluginResult(clickResult)) {
      return;
    }

    Promise.resolve(executeAction(
      this._getProviders() || this._hass,
      badgeElement,
      actionConfig,
      buildActionExecutionOptions({
        actionKey: `badges[${badgeIndex}].tap_action`,
        executePluginHookSync: this._options.executePluginHookSync,
        interaction: 'badge_tap',
        meta: { badge, badgeIndex },
        section: 'header',
        source: 'badge'
      })
    )).catch((error) => {
      console.error('[UniversalCard] Badge action failed:', error);
    });
  }

  /**
   * Execute a plugin hook through the parent card bridge.
   *
   * @private
   * @param {string} hookName
   * @param {Object} [data]
   * @param {Object} [context]
   * @returns {Object}
   */
  _executePluginHookSync(hookName: string, data: PluginPayload = {}, context: PluginContext = {}) {
    if (typeof this._options.executePluginHookSync !== 'function') {
      return data;
    }

    return this._options.executePluginHookSync(hookName, {
      component: this,
      config: this._config,
      element: this._element,
      section: 'header',
      ...data
    }, {
      section: 'header',
      ...context
    }) || {};
  }

  /**
   * Dispatch a card-scoped action event.
   *
   * @private
   * @param {string} actionType
   */
  _dispatchCardAction(actionType) {
    if (actionType === ACTION_TYPES.EXPAND) {
      debug('[UC-Header] firing uc-expand');
      fireEvent(this._element, 'uc-expand');
      return;
    }

    if (actionType === ACTION_TYPES.COLLAPSE) {
      debug('[UC-Header] firing uc-collapse');
      fireEvent(this._element, 'uc-collapse');
      return;
    }

    debug('[UC-Header] firing uc-toggle');
    fireEvent(this._element, 'uc-toggle');
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
    const providers = this._getProviders();
    if (!providers || !entityId) return null;

    const domain = entityId.split('.')[0];
    return providers.derived.entities.getIcon(entityId, this._getDomainIcon(domain));
  }
  
  /**
   * Get entity friendly name
   * 
   * @private
   * @param {string} entityId - Entity ID
   * @returns {string|null} Friendly name
   */
  _getEntityName(entityId) {
    const providers = this._getProviders();
    if (!providers || !entityId) return null;

    return providers.derived.entities.getFriendlyName(entityId);
  }

  /**
   * Resolve normalized derived providers.
   *
   * @private
   * @returns {Object|null}
   */
  _getProviders() {
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
    this._providers = null;
    this._element = null;
    this._attached = false;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Header;
