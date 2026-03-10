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
import {
  type ActionConfig,
  type ActionTriggerMeta as HookActionTriggerMeta,
  type HookExecutor,
  buildActionExecutionOptions,
  executeCardActionWithPluginBridge,
  isFooterCardAction,
  runInteractionHook,
  shouldStopPluginResult
} from '../core/action-hooks.js';
import type {
  FooterConfig,
  LayoutCardConfig
} from '../core/config-contracts.js';
import { PLUGIN_HOOKS, type PluginContext, type PluginPayload } from '../extensibility/PluginSystem.js';
import {
  normalizeProviderContext,
  type HomeAssistantLike,
  type ProviderSource
} from '../providers/ProviderContext.js';

type FooterOptions = {
  executePluginHookSync?: HookExecutor;
};
type FooterProviders = ReturnType<typeof normalizeProviderContext>;
type FooterCardElement = HTMLElement & {
  hass?: HomeAssistantLike;
  destroy?: () => void;
};
type FooterCardStorageKey = '_leftCards' | '_rightCards' | '_contentCards';
type FooterActionKey = 'tap_action' | 'hold_action';
type ActionTriggerMeta = HookActionTriggerMeta;

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

/**
 * Footer component for Universal Card
 * 
 * @class Footer
 */
export class Footer {
  _config: FooterConfig;
  _options: FooterOptions;
  _element: HTMLElement | null;
  _leftCards: FooterCardElement[];
  _rightCards: FooterCardElement[];
  _contentCards: FooterCardElement[];
  _hass: HomeAssistantLike;
  _providers: FooterProviders | null;
  _holdTimer: number | null;
  _isHolding: boolean;
  _holdDuration: number;
  
  /**
   * Create Footer instance
   * 
   * @param {Object} config - Footer configuration
   * @param {Object} options - Additional options
   */
  constructor(config: FooterConfig, options: FooterOptions = {}) {
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
    
    /** @type {number|null} Hold timer */
    this._holdTimer = null;
    
    /** @type {boolean} Is holding */
    this._isHolding = false;

    /** @type {number} Hold duration ms */
    this._holdDuration = 500;
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
    this._providers = normalizeProviderContext(hass);
    this._hass = this._providers.getHass();
    this._updateCards(this._hass);
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
    this._element.dataset.ucRole = 'footer';
    
    // Build inner HTML
    this._element.innerHTML = `
      <div class="footer-left" data-uc-region="left">
        <div class="footer-left-slot" data-uc-slot="left"></div>
      </div>
      <div class="footer-content" data-uc-region="content">
        ${this._renderText()}
        <div class="footer-cards-slot" data-uc-slot="content"></div>
      </div>
      <div class="footer-right" data-uc-region="right">
        <div class="footer-right-slot" data-uc-slot="right"></div>
        ${this._renderActions()}
      </div>
    `;

    const renderHookResult = this._executePluginHookSync(PLUGIN_HOOKS.FOOTER_RENDER, {
      component: this,
      element: this._element
    }, {
      phase: 'render'
    });

    const renderedElement = renderHookResult?.element;
    if (renderedElement && typeof renderedElement === 'object') {
      this._element = renderedElement as HTMLElement;
    }
    
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
    
    return `
      <div class="footer-text" data-uc-role="text">
        ${icon ? `<ha-icon data-uc-role="text-icon" icon="${icon}"></ha-icon>` : ''}
        <span data-uc-role="text-label">${text}</span>
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
      <button class="footer-action-btn" data-action-index="${index}" data-uc-role="action" data-uc-action-index="${index}">
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
  async _loadSlotCards(configs: LayoutCardConfig[], selector: string, storageKey: FooterCardStorageKey) {
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
  _handleActionClick(event: Event) {
    const btn = event.currentTarget as HTMLElement | null;
    if (!btn) {
      return;
    }
    const index = parseInt(btn.dataset.actionIndex, 10);
    const action = this._config.actions?.[index];
    
    if (action) {
      const clickResult = runInteractionHook({
        actionConfig: action,
        actionKey: `actions[${index}]`,
        element: this._element,
        event,
        executePluginHookSync: this._executePluginHookSync.bind(this),
        extra: { actionIndex: index },
        hookName: PLUGIN_HOOKS.CLICK,
        interaction: 'button',
        source: 'footer_action'
      });

      if (shouldStopPluginResult(clickResult)) {
        return;
      }

      if (isFooterCardAction(action)) {
        executeCardActionWithPluginBridge({
          actionConfig: {
            ...action,
            target: action.target || 'card'
          },
          actionKey: `actions[${index}]`,
          dispatchCardAction: (actionType) => this._dispatchCardAction(actionType),
          element: this._element,
          executeAction: (nextAction, options) => executeAction(
            this._providers || this._hass,
            this._element,
            nextAction,
            options
          ),
          executePluginHookSync: this._executePluginHookSync.bind(this),
          isCardAction: isFooterCardAction,
          section: 'footer',
          triggerMeta: {
            event,
            interaction: 'button',
            meta: { actionIndex: index },
            source: 'footer_action'
          }
        });
        return;
      }

      executeAction(
        this._providers || this._hass,
        this._element,
        action,
        buildActionExecutionOptions({
          actionKey: `actions[${index}]`,
          event,
          executePluginHookSync: this._options.executePluginHookSync,
          interaction: 'button',
          meta: { actionIndex: index },
          section: 'footer',
          source: 'footer_action'
        })
      );
    }
  }
  
  /**
   * Handle click
   * 
   * @private
   * @param {Event} event - Click event
   */
  _handleClick(event: Event) {
    if (this._isInteractiveElement(event.target)) return;
    if (this._isHolding) {
      this._isHolding = false;
      return;
    }

    const clickResult = runInteractionHook({
      actionConfig: this._config.tap_action,
      actionKey: 'tap_action',
      element: this._element,
      event,
      executePluginHookSync: this._executePluginHookSync.bind(this),
      hookName: PLUGIN_HOOKS.CLICK,
      interaction: 'tap',
      source: 'footer'
    });

    if (shouldStopPluginResult(clickResult)) {
      return;
    }

    this._executeAction('tap_action', {
      event,
      interaction: 'tap',
      source: 'footer'
    });
  }
  
  /**
   * Handle mouse down for hold
   * 
   * @private
   * @param {MouseEvent} event - Mouse event
   */
  _handleMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;
    if (this._isInteractiveElement(event.target)) return;
    
    this._holdTimer = setTimeout(() => {
      this._isHolding = true;
      const holdResult = runInteractionHook({
        actionConfig: this._config.hold_action,
        actionKey: 'hold_action',
        element: this._element,
        event,
        executePluginHookSync: this._executePluginHookSync.bind(this),
        hookName: PLUGIN_HOOKS.HOLD,
        interaction: 'hold',
        source: 'footer'
      });

      if (shouldStopPluginResult(holdResult)) {
        return;
      }

      this._executeAction('hold_action', {
        event,
        interaction: 'hold',
        source: 'footer'
      });
    }, this._holdDuration);
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
  _isInteractiveElement(target: EventTarget | null) {
    const element = target instanceof HTMLElement ? target : null;
    if (!element || typeof element.closest !== 'function') {
      return false;
    }

    return element.closest('button, a, input, .footer-action-btn') !== null;
  }
  
  /**
   * Execute action
   * 
   * @private
   * @param {string} actionKey - Action config key
   */
  _executeAction(actionKey: FooterActionKey, triggerMeta: ActionTriggerMeta = {}) {
    const actionConfig = this._config[actionKey] as ActionConfig | undefined;
    
    if (!actionConfig || actionConfig.action === ACTION_TYPES.NONE) {
      return;
    }

    if (isFooterCardAction(actionConfig)) {
      executeCardActionWithPluginBridge({
        actionConfig: {
          ...actionConfig,
          target: actionConfig.target || 'card'
        },
        actionKey,
        dispatchCardAction: (actionType) => this._dispatchCardAction(actionType),
        element: this._element,
        executeAction: (nextAction, options) => executeAction(
          this._providers || this._hass,
          this._element,
          nextAction,
          options
        ),
        executePluginHookSync: this._executePluginHookSync.bind(this),
        isCardAction: isFooterCardAction,
        section: 'footer',
        triggerMeta: {
          ...triggerMeta,
          source: triggerMeta.source || 'footer'
        }
      });
      return;
    }

    executeAction(
      this._providers || this._hass,
      this._element,
      actionConfig,
      buildActionExecutionOptions({
        actionKey,
        event: triggerMeta.event || null,
        executePluginHookSync: this._options.executePluginHookSync,
        interaction: triggerMeta.interaction || null,
        section: 'footer',
        source: triggerMeta.source || 'footer'
      })
    );
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
      section: 'footer',
      ...data
    }, {
      section: 'footer',
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
      fireEvent(this._element, 'uc-expand');
      return;
    }

    if (actionType === ACTION_TYPES.COLLAPSE) {
      fireEvent(this._element, 'uc-collapse');
      return;
    }

    fireEvent(this._element, 'uc-toggle');
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
    this._providers = null;
    this._element = null;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Footer;
