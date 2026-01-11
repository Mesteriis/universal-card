/**
 * Universal Card - Entry Point
 * 
 * Advanced Lovelace card for Home Assistant with multiple body modes,
 * CSS Grid layout, lazy loading, and extensive customization options.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @license MIT
 * @see https://github.com/Mesteriis/universal-card
 */

// =============================================================================
// IMPORTS
// =============================================================================

import { UniversalCard } from './core/UniversalCard.js';
import { UniversalCardEditor } from './core/UniversalCardEditor.js';
import { CARD_VERSION, CARD_NAME, CARD_DESCRIPTION } from './core/constants.js';

// =============================================================================
// REGISTRATION
// =============================================================================

/**
 * Register custom elements with the browser
 */
function registerElements() {
  // Проверяем, не зарегистрированы ли уже элементы
  if (!customElements.get('universal-card')) {
    customElements.define('universal-card', UniversalCard);
  }
  
  if (!customElements.get('universal-card-editor')) {
    customElements.define('universal-card-editor', UniversalCardEditor);
  }
}

/**
 * Register card with Home Assistant's card picker
 */
function registerCardPicker() {
  // Добавляем карточку в picker Home Assistant
  window.customCards = window.customCards || [];
  
  // Проверяем, не добавлена ли уже
  const isRegistered = window.customCards.some(
    card => card.type === 'universal-card'
  );
  
  if (!isRegistered) {
    window.customCards.push({
      type: 'universal-card',
      name: CARD_NAME,
      description: CARD_DESCRIPTION,
      preview: true,
      documentationURL: 'https://github.com/Mesteriis/universal-card'
    });
  }
}

/**
 * Log card info to console
 */
function logCardInfo() {
  console.info(
    `%c 🎴 UNIVERSAL-CARD %c v${CARD_VERSION} %c`,
    'color: white; background: #3498db; font-weight: bold; padding: 2px 8px; border-radius: 4px 0 0 4px;',
    'color: #3498db; background: #ecf0f1; font-weight: bold; padding: 2px 8px; border-radius: 0 4px 4px 0;',
    ''
  );
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the Universal Card
 */
function init() {
  registerElements();
  registerCardPicker();
  logCardInfo();
}

// Запускаем инициализацию
init();

// =============================================================================
// EXPORTS (для плагинов и расширений)
// =============================================================================

export { UniversalCard, UniversalCardEditor };
