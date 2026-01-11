/**
 * Universal Card - Home Assistant Helpers
 * 
 * Utilities for working with Home Assistant: creating cards,
 * executing actions, accessing state, etc.
 * 
 * @module utils/ha-helpers
 */

// =============================================================================
// CARD HELPERS CACHE
// =============================================================================

/** @type {Promise<Object>|null} */
let cardHelpersPromise = null;

/**
 * Get Home Assistant card helpers (cached)
 * 
 * @returns {Promise<Object>} Card helpers object
 * 
 * @example
 * const helpers = await getCardHelpers();
 * const card = await helpers.createCardElement({ type: 'light', entity: '...' });
 */
export async function getCardHelpers() {
  if (cardHelpersPromise) {
    return cardHelpersPromise;
  }
  
  cardHelpersPromise = new Promise(async (resolve) => {
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
export async function createCardElement(config) {
  if (!config || !config.type) {
    throw new Error('Card config must have a type');
  }
  
  const helpers = await getCardHelpers();
  
  if (helpers) {
    try {
      return await helpers.createCardElement(config);
    } catch (error) {
      throw new Error(`Failed to create card: ${error.message}`);
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
function createCardElementFallback(config) {
  const type = config.type;
  let tag = type;
  
  // Преобразуем type в tag name
  if (type.startsWith('custom:')) {
    tag = type.slice(7);
  } else {
    tag = `hui-${type}-card`;
  }
  
  const element = document.createElement(tag);
  
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
export async function createCardElements(configs) {
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
export function createErrorCard(error, config) {
  const card = document.createElement('ha-card');
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
 * @param {Object} hass - Home Assistant object
 * @param {string} entityId - Entity ID
 * @returns {Object|null} Entity state object or null
 */
export function getEntityState(hass, entityId) {
  if (!hass?.states || !entityId) {
    return null;
  }
  return hass.states[entityId] || null;
}

/**
 * Get entity state value
 * 
 * @param {Object} hass - Home Assistant object
 * @param {string} entityId - Entity ID
 * @param {*} [defaultValue='unavailable'] - Default if not found
 * @returns {string} State value
 */
export function getStateValue(hass, entityId, defaultValue = 'unavailable') {
  const state = getEntityState(hass, entityId);
  return (state && state.state !== undefined) ? state.state : defaultValue;
}

/**
 * Get entity attribute value
 * 
 * @param {Object} hass - Home Assistant object
 * @param {string} entityId - Entity ID
 * @param {string} attribute - Attribute name
 * @param {*} [defaultValue] - Default if not found
 * @returns {*} Attribute value
 */
export function getAttributeValue(hass, entityId, attribute, defaultValue) {
  const state = getEntityState(hass, entityId);
  var attr = state && state.attributes ? state.attributes[attribute] : undefined;
  return attr !== undefined ? attr : defaultValue;
}

/**
 * Check if entity state matches
 * 
 * @param {Object} hass - Home Assistant object
 * @param {string} entityId - Entity ID
 * @param {string|string[]} states - State(s) to match
 * @returns {boolean} True if matches
 */
export function isState(hass, entityId, states) {
  const currentState = getStateValue(hass, entityId);
  const stateArray = Array.isArray(states) ? states : [states];
  return stateArray.includes(currentState);
}

// =============================================================================
// ACTIONS
// =============================================================================

/**
 * Execute a Home Assistant action
 * 
 * @param {Object} hass - Home Assistant object
 * @param {HTMLElement} element - Element for events
 * @param {Object} actionConfig - Action configuration
 * @param {Object} [options={}] - Additional options
 * @returns {Promise<void>}
 */
export async function executeAction(hass, element, actionConfig, options = {}) {
  if (!actionConfig || actionConfig.action === 'none') {
    return;
  }
  
  const { action } = actionConfig;
  
  switch (action) {
    case 'toggle':
      await handleToggleAction(hass, actionConfig);
      break;
      
    case 'call-service':
      await handleServiceAction(hass, actionConfig);
      break;
      
    case 'navigate':
      handleNavigateAction(actionConfig);
      break;
      
    case 'url':
      handleUrlAction(actionConfig);
      break;
      
    case 'more-info':
      handleMoreInfoAction(element, actionConfig);
      break;
      
    case 'fire-dom-event':
      handleFireEventAction(element, actionConfig);
      break;
      
    default:
      console.warn(`[UniversalCard] Unknown action: ${action}`);
  }
}

/**
 * Handle toggle action
 * @private
 */
async function handleToggleAction(hass, config) {
  const entityId = config.entity;
  if (!entityId) return;
  
  const domain = entityId.split('.')[0];
  
  await hass.callService(domain, 'toggle', {
    entity_id: entityId
  });
}

/**
 * Handle service call action
 * @private
 */
async function handleServiceAction(hass, config) {
  const { service, service_data, target } = config;
  if (!service) return;
  
  const [domain, serviceName] = service.split('.');
  
  await hass.callService(domain, serviceName, service_data || {}, target);
}

/**
 * Handle navigation action
 * @private
 */
function handleNavigateAction(config) {
  const path = config.navigation_path;
  if (!path) return;
  
  history.pushState(null, '', path);
  
  // Dispatch event for HA router
  window.dispatchEvent(new CustomEvent('location-changed'));
}

/**
 * Handle URL action
 * @private
 */
function handleUrlAction(config) {
  const url = config.url_path;
  if (!url) return;
  
  const target = config.url_target || '_blank';
  window.open(url, target);
}

/**
 * Handle more-info action
 * @private
 */
function handleMoreInfoAction(element, config) {
  const entityId = config.entity;
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
    target = target.parentElement || target.getRootNode().host;
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
function handleFireEventAction(element, config) {
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
 * @param {Object} hass - Home Assistant object
 * @returns {Object|null} User info
 */
export function getCurrentUser(hass) {
  return hass?.user || null;
}

/**
 * Check if current user is admin
 * 
 * @param {Object} hass - Home Assistant object
 * @returns {boolean} True if admin
 */
export function isUserAdmin(hass) {
  return hass?.user?.is_admin === true;
}
