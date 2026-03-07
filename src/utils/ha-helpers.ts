/**
 * Universal Card - Home Assistant Helpers
 * 
 * Utilities for working with Home Assistant: creating cards,
 * executing actions, accessing state, etc.
 * 
 * @module utils/ha-helpers
 */

import { isProviderContext, normalizeProviderContext } from '../providers/ProviderContext.js';
import type { HomeAssistantLike, ProviderSource } from '../providers/ProviderContext.js';
import {
  type ActionConfig,
  type ExecuteActionOptions,
  runActionPluginHook
} from '../core/action-hooks.js';

export type CardConfigLike = Record<string, unknown>;
export type CardElementWithConfig = HTMLElement & {
  hass?: HomeAssistantLike;
  setConfig?: (config: CardConfigLike) => void;
};
export type CardHelpers = {
  createCardElement(config: CardConfigLike): Promise<CardElementWithConfig>;
};

type ErrorCardElement = HTMLElement & {
  _errorData?: {
    error: unknown;
    config: CardConfigLike;
    stack?: string;
  };
  setConfig?: (config: CardConfigLike) => void;
};

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<CardHelpers>;
  }
}

function getErrorMessage(error: unknown, fallback = 'Unknown error'): string {
  return error instanceof Error && typeof error.message === 'string' && error.message
    ? error.message
    : fallback;
}

// =============================================================================
// CARD HELPERS CACHE
// =============================================================================

let cardHelpersPromise: Promise<CardHelpers | null> | null = null;

/**
 * Get Home Assistant card helpers (cached)
 * 
 * @returns {Promise<Object>} Card helpers object
 * 
 * @example
 * const helpers = await getCardHelpers();
 * const card = await helpers.createCardElement({ type: 'light', entity: '...' });
 */
export async function getCardHelpers(): Promise<CardHelpers | null> {
  if (cardHelpersPromise) {
    return cardHelpersPromise;
  }
  
  cardHelpersPromise = new Promise<CardHelpers | null>(async (resolve) => {
    // Ждём загрузки custom elements
    if (window.loadCardHelpers) {
      resolve(await window.loadCardHelpers());
      return;
    }
    
    // Fallback: ждём появления функции
    const checkInterval = setInterval(async () => {
      if (window.loadCardHelpers) {
        clearInterval(checkInterval);
        resolve(await window.loadCardHelpers());
      }
    }, 100);
    
    // Timeout после 10 секунд
    setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('[UniversalCard] Card helpers not available');
      resolve(null);
    }, 10000);
  });
  
  return cardHelpersPromise;
}

// =============================================================================
// CARD CREATION
// =============================================================================

/**
 * Create a Lovelace card element from config
 * 
 * @param {Object} config - Card configuration
 * @returns {Promise<HTMLElement>} Card element
 * @throws {Error} If card creation fails
 * 
 * @example
 * const card = await createCardElement({
 *   type: 'light',
 *   entity: 'light.living_room'
 * });
 */
export async function createCardElement(config: CardConfigLike): Promise<CardElementWithConfig> {
  if (!config || !config.type) {
    throw new Error('Card config must have a type');
  }
  
  const helpers = await getCardHelpers();
  
  if (helpers) {
    try {
      return await helpers.createCardElement(config);
    } catch (error) {
      throw new Error(`Failed to create card: ${getErrorMessage(error)}`);
    }
  }
  
  // Fallback: создаём элемент напрямую
  return createCardElementFallback(config);
}

/**
 * Fallback card creation without helpers
 * 
 * @param {Object} config - Card configuration
 * @returns {HTMLElement} Card element
 * @private
 */
function createCardElementFallback(config: CardConfigLike): CardElementWithConfig {
  const type = typeof config.type === 'string' ? config.type : String(config.type || '');
  let tag = type;
  
  // Преобразуем type в tag name
  if (type.startsWith('custom:')) {
    tag = type.slice(7);
  } else {
    tag = `hui-${type}-card`;
  }
  
  const element = document.createElement(String(tag)) as CardElementWithConfig;
  
  if (element.setConfig) {
    element.setConfig(config);
  }
  
  return element;
}

/**
 * Create multiple card elements in parallel
 * 
 * @param {Object[]} configs - Array of card configurations
 * @returns {Promise<HTMLElement[]>} Array of card elements
 */
export async function createCardElements(configs: CardConfigLike[]): Promise<CardElementWithConfig[]> {
  if (!Array.isArray(configs)) {
    return [];
  }
  
  const results = await Promise.allSettled(
    configs.map(config => createCardElement(config))
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    
    // Создаём error card для неудачных
    console.error(`[UniversalCard] Card creation failed:`, result.reason);
    return createErrorCard(result.reason, configs[index]);
  });
}

/**
 * Create an error card placeholder
 * 
 * @param {Error} error - Error that occurred
 * @param {Object} config - Original config
 * @returns {HTMLElement} Error card element
 */
export function createErrorCard(error: Error, config: CardConfigLike): ErrorCardElement {
  const card = document.createElement('ha-card') as ErrorCardElement;
  card.className = 'uc-error-card';
  card.innerHTML = `
    <div class="error-content">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      <span class="error-message">${error.message || 'Unknown error'}</span>
      <button class="error-details-btn">?</button>
    </div>
  `;
  
  // Сохраняем данные для popup
  card._errorData = {
    error,
    config,
    stack: error.stack
  };
  
  return card;
}

// =============================================================================
// STATE ACCESS
// =============================================================================

/**
 * Get entity state safely
 * 
 * @param {Object} hassOrProvider - Home Assistant object or provider context
 * @param {string} entityId - Entity ID
 * @returns {Object|null} Entity state object or null
 */
export function getEntityState(hassOrProvider: ProviderSource, entityId: string) {
  if (!hassOrProvider || !entityId) {
    return null;
  }

  if (isProviderContext(hassOrProvider)) {
    return hassOrProvider.entities.getState(entityId);
  }

  if (!hassOrProvider?.states) {
    return null;
  }

  return hassOrProvider.states[entityId] || null;
}

/**
 * Get entity state value
 * 
 * @param {Object} hassOrProvider - Home Assistant object or provider context
 * @param {string} entityId - Entity ID
 * @param {*} [defaultValue='unavailable'] - Default if not found
 * @returns {string} State value
 */
export function getStateValue(hassOrProvider: ProviderSource, entityId: string, defaultValue = 'unavailable') {
  const state = getEntityState(hassOrProvider, entityId);
  return (state && state.state !== undefined) ? state.state : defaultValue;
}

/**
 * Get entity attribute value
 * 
 * @param {Object} hassOrProvider - Home Assistant object or provider context
 * @param {string} entityId - Entity ID
 * @param {string} attribute - Attribute name
 * @param {*} [defaultValue] - Default if not found
 * @returns {*} Attribute value
 */
export function getAttributeValue(
  hassOrProvider: ProviderSource,
  entityId: string,
  attribute: string,
  defaultValue?: unknown
) {
  const state = getEntityState(hassOrProvider, entityId);
  var attr = state && state.attributes ? state.attributes[attribute] : undefined;
  return attr !== undefined ? attr : defaultValue;
}

/**
 * Check if entity state matches
 * 
 * @param {Object} hassOrProvider - Home Assistant object or provider context
 * @param {string} entityId - Entity ID
 * @param {string|string[]} states - State(s) to match
 * @returns {boolean} True if matches
 */
export function isState(hassOrProvider: ProviderSource, entityId: string, states: string | string[]) {
  const currentState = getStateValue(hassOrProvider, entityId);
  const stateArray = Array.isArray(states) ? states : [states];
  return stateArray.includes(currentState);
}

// =============================================================================
// ACTIONS
// =============================================================================

/**
 * Execute a Home Assistant action
 * 
 * @param {Object} hassOrProvider - Home Assistant object or provider context
 * @param {HTMLElement} element - Element for events
 * @param {Object} actionConfig - Action configuration
 * @param {Object} [options={}] - Additional options
 * @returns {Promise<void>}
 */
export async function executeAction(
  hassOrProvider: ProviderSource,
  element: HTMLElement,
  actionConfig: ActionConfig | null | undefined,
  options: ExecuteActionOptions = {}
) {
  if (!actionConfig || actionConfig.action === 'none') {
    return;
  }

  const hookResult = runActionPluginHook(element, actionConfig, options);
  if (hookResult.stopped) {
    return;
  }

  const resolvedActionConfig = hookResult.action;
  const { action } = resolvedActionConfig;
  
  switch (action) {
    case 'toggle':
      await handleToggleAction(hassOrProvider, resolvedActionConfig);
      break;
      
    case 'call-service':
      await handleServiceAction(hassOrProvider, resolvedActionConfig);
      break;
      
    case 'navigate':
      handleNavigateAction(resolvedActionConfig);
      break;
      
    case 'url':
      handleUrlAction(resolvedActionConfig);
      break;
      
    case 'more-info':
      handleMoreInfoAction(element, resolvedActionConfig);
      break;
      
    case 'fire-dom-event':
      handleFireEventAction(element, resolvedActionConfig);
      break;
      
    default:
      console.warn(`[UniversalCard] Unknown action: ${action}`);
  }
}

/**
 * Handle toggle action
 * @private
 */
async function handleToggleAction(hass: ProviderSource, config: ActionConfig) {
  const entityId = typeof config.entity === 'string' ? config.entity : null;
  if (!entityId || !hass) return;
  const providers = normalizeProviderContext(hass);
  const domain = entityId.split('.')[0];

  await providers.services.call(domain, 'toggle', {
    entity_id: entityId
  });
}

/**
 * Handle service call action
 * @private
 */
async function handleServiceAction(hass: ProviderSource, config: ActionConfig) {
  const service = typeof config.service === 'string' ? config.service : null;
  const service_data = config.service_data;
  const target = config.target && typeof config.target === 'object' && !Array.isArray(config.target)
    ? config.target as Record<string, unknown>
    : undefined;
  if (!service || !hass) return;
  const providers = normalizeProviderContext(hass);
  const [domain, serviceName] = service.split('.');

  await providers.services.call(domain, serviceName, service_data || {}, target);
}

/**
 * Handle navigation action
 * @private
 */
function handleNavigateAction(config: ActionConfig) {
  const path = typeof config.navigation_path === 'string' ? config.navigation_path : null;
  if (!path) return;
  
  history.pushState(null, '', path);
  
  // Dispatch event for HA router
  window.dispatchEvent(new CustomEvent('location-changed'));
}

/**
 * Handle URL action
 * @private
 */
function handleUrlAction(config: ActionConfig) {
  const url = typeof config.url_path === 'string' ? config.url_path : null;
  if (!url) return;
  
  const target = typeof config.url_target === 'string' ? config.url_target : '_blank';
  window.open(url, target);
}

/**
 * Handle more-info action
 * @private
 */
function handleMoreInfoAction(element: HTMLElement, config: ActionConfig) {
  const entityId = typeof config.entity === 'string' ? config.entity : null;
  if (!entityId) return;
  
  const event = new CustomEvent('hass-more-info', {
    bubbles: true,
    composed: true,
    detail: { entityId }
  });
  
  // Dispatch from a connected element - use document body as fallback
  let target = element;
  
  // Find the root of the card (universal-card element)
  while (target && target.tagName !== 'UNIVERSAL-CARD') {
    const rootNode = target.getRootNode();
    target = target.parentElement || (rootNode instanceof ShadowRoot ? (rootNode.host as HTMLElement) : null);
  }
  
  // If we found it and it's connected, use it
  if (target && target.isConnected) {
    target.dispatchEvent(event);
  } else {
    // Fallback: find any ha-panel-lovelace or use document
    const panel = document.querySelector('ha-panel-lovelace') || 
                  document.querySelector('home-assistant') ||
                  document.body;
    panel.dispatchEvent(event);
  }
}

/**
 * Handle fire DOM event action
 * @private
 */
function handleFireEventAction(element: HTMLElement, config: ActionConfig) {
  const event = new CustomEvent('ll-custom', {
    bubbles: true,
    composed: true,
    detail: config
  });
  
  element.dispatchEvent(event);
}

// =============================================================================
// HAPTIC FEEDBACK
// =============================================================================

/**
 * Trigger haptic feedback
 * 
 * @param {string} [type='light'] - Feedback type: light, medium, heavy, selection, success, warning, error
 */
export function hapticFeedback(type = 'light') {
  const event = new CustomEvent('haptic', {
    bubbles: true,
    composed: true,
    detail: type
  });
  
  window.dispatchEvent(event);
}

// =============================================================================
// THEME
// =============================================================================

/**
 * Get current Home Assistant theme variables
 * 
 * @param {HTMLElement} element - Element to get computed styles from
 * @returns {Object} Theme variables
 */
export function getThemeVariables(element) {
  const styles = getComputedStyle(element);
  
  return {
    primaryColor: styles.getPropertyValue('--primary-color').trim(),
    accentColor: styles.getPropertyValue('--accent-color').trim(),
    textColor: styles.getPropertyValue('--primary-text-color').trim(),
    secondaryTextColor: styles.getPropertyValue('--secondary-text-color').trim(),
    backgroundColor: styles.getPropertyValue('--primary-background-color').trim(),
    cardBackgroundColor: styles.getPropertyValue('--ha-card-background').trim() ||
                        styles.getPropertyValue('--card-background-color').trim(),
    dividerColor: styles.getPropertyValue('--divider-color').trim(),
    borderRadius: styles.getPropertyValue('--ha-card-border-radius').trim() || '12px'
  };
}

// =============================================================================
// USER INFO
// =============================================================================

/**
 * Get current user information
 * 
 * @param {Object} hassOrProvider - Home Assistant object or provider context
 * @returns {Object|null} User info
 */
export function getCurrentUser(hassOrProvider: ProviderSource) {
  const hass = isProviderContext(hassOrProvider)
    ? hassOrProvider.getHass()
    : hassOrProvider;
  return hass?.user || null;
}

/**
 * Check if current user is admin
 * 
 * @param {Object} hassOrProvider - Home Assistant object or provider context
 * @returns {boolean} True if admin
 */
export function isUserAdmin(hassOrProvider: ProviderSource) {
  const hass = isProviderContext(hassOrProvider)
    ? hassOrProvider.getHass()
    : hassOrProvider;
  return hass?.user?.is_admin === true;
}
