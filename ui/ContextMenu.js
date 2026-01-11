/**
 * Universal Card - Context Menu
 * 
 * Right-click context menu with customizable actions.
 * Supports icons, submenus, and separators.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module ui/ContextMenu
 */

import { fireEvent } from '../utils/helpers.js';
import { executeAction } from '../utils/ha-helpers.js';

// =============================================================================
// CONTEXT MENU
// =============================================================================

/**
 * Context Menu component
 * 
 * @class ContextMenu
 */
export class ContextMenu {
  
  /**
   * Create ContextMenu instance
   * 
   * @param {Object} config - Menu configuration
   * @param {Object} options - Additional options
   */
  constructor(config = {}, options = {}) {
    /** @type {Object} Menu configuration */
    this._config = config;
    
    /** @type {Object} Options */
    this._options = options;
    
    /** @type {HTMLElement|null} Menu element */
    this._menu = null;
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;
    
    /** @type {Function} Bound close handler */
    this._closeHandler = this._handleOutsideClick.bind(this);
    
    /** @type {Function} Bound escape handler */
    this._escapeHandler = this._handleEscape.bind(this);
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
  }
  
  // ===========================================================================
  // SHOW / HIDE
  // ===========================================================================
  
  /**
   * Show context menu at position
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} [context] - Additional context data
   */
  show(x, y, context = {}) {
    // Close any existing menu
    this.hide();
    
    // Create menu
    this._menu = this._createMenu(context);
    
    // Position menu
    this._positionMenu(x, y);
    
    // Add to DOM
    document.body.appendChild(this._menu);
    
    // Add event listeners
    document.addEventListener('click', this._closeHandler);
    document.addEventListener('contextmenu', this._closeHandler);
    document.addEventListener('keydown', this._escapeHandler);
    
    // Animate in
    requestAnimationFrame(() => {
      this._menu?.classList.add('open');
    });
  }
  
  /**
   * Hide context menu
   */
  hide() {
    if (!this._menu) return;
    
    // Remove event listeners
    document.removeEventListener('click', this._closeHandler);
    document.removeEventListener('contextmenu', this._closeHandler);
    document.removeEventListener('keydown', this._escapeHandler);
    
    // Animate out
    this._menu.classList.remove('open');
    
    // Remove after animation
    setTimeout(() => {
      this._menu?.remove();
      this._menu = null;
    }, 150);
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Create menu element
   * 
   * @private
   * @param {Object} context - Context data
   * @returns {HTMLElement} Menu element
   */
  _createMenu(context) {
    const menu = document.createElement('div');
    menu.className = 'uc-context-menu';
    
    // Add styles
    menu.innerHTML = `<style>${ContextMenu.getStyles()}</style>`;
    
    // Create menu items
    const items = this._config.items || [];
    
    items.forEach((item, index) => {
      if (item.type === 'separator') {
        menu.appendChild(this._createSeparator());
      } else {
        menu.appendChild(this._createMenuItem(item, index, context));
      }
    });
    
    return menu;
  }
  
  /**
   * Create menu item
   * 
   * @private
   * @param {Object} item - Item configuration
   * @param {number} index - Item index
   * @param {Object} context - Context data
   * @returns {HTMLElement} Menu item element
   */
  _createMenuItem(item, index, context) {
    const menuItem = document.createElement('button');
    menuItem.className = 'uc-context-menu-item';
    
    if (item.disabled) {
      menuItem.disabled = true;
      menuItem.classList.add('disabled');
    }
    
    // Icon
    const iconHtml = item.icon 
      ? `<ha-icon icon="${item.icon}"></ha-icon>` 
      : '<span class="icon-placeholder"></span>';
    
    // Label
    const label = item.label || item.name || '';
    
    // Shortcut
    const shortcutHtml = item.shortcut 
      ? `<span class="shortcut">${item.shortcut}</span>` 
      : '';
    
    // Submenu indicator
    const submenuHtml = item.submenu 
      ? '<ha-icon icon="mdi:chevron-right" class="submenu-icon"></ha-icon>' 
      : '';
    
    menuItem.innerHTML = `
      ${iconHtml}
      <span class="label">${label}</span>
      ${shortcutHtml}
      ${submenuHtml}
    `;
    
    // Click handler
    if (!item.submenu) {
      menuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        this._handleItemClick(item, context);
      });
    } else {
      // Submenu hover
      menuItem.addEventListener('mouseenter', () => {
        this._showSubmenu(menuItem, item.submenu, context);
      });
    }
    
    return menuItem;
  }
  
  /**
   * Create separator
   * 
   * @private
   * @returns {HTMLElement} Separator element
   */
  _createSeparator() {
    const separator = document.createElement('div');
    separator.className = 'uc-context-menu-separator';
    return separator;
  }
  
  /**
   * Position menu on screen
   * 
   * @private
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  _positionMenu(x, y) {
    if (!this._menu) return;
    
    const menuRect = this._menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust X if menu would overflow right
    if (x + menuRect.width > viewportWidth) {
      x = viewportWidth - menuRect.width - 8;
    }
    
    // Adjust Y if menu would overflow bottom
    if (y + menuRect.height > viewportHeight) {
      y = viewportHeight - menuRect.height - 8;
    }
    
    // Ensure minimum position
    x = Math.max(8, x);
    y = Math.max(8, y);
    
    this._menu.style.left = `${x}px`;
    this._menu.style.top = `${y}px`;
  }
  
  /**
   * Show submenu
   * 
   * @private
   * @param {HTMLElement} parentItem - Parent menu item
   * @param {Object[]} items - Submenu items
   * @param {Object} context - Context data
   */
  _showSubmenu(parentItem, items, context) {
    // TODO: Implement submenu rendering
    console.debug('[UniversalCard] Submenu:', items);
  }
  
  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  
  /**
   * Handle menu item click
   * 
   * @private
   * @param {Object} item - Item configuration
   * @param {Object} context - Context data
   */
  _handleItemClick(item, context) {
    // Hide menu
    this.hide();
    
    // Execute action
    if (item.action) {
      executeAction(this._hass, document.body, item.action);
    }
    
    // Call callback
    if (item.callback && typeof item.callback === 'function') {
      item.callback(context);
    }
    
    // Fire event
    if (item.event) {
      fireEvent(document.body, item.event, { item, context });
    }
  }
  
  /**
   * Handle outside click
   * 
   * @private
   * @param {Event} event - Click event
   */
  _handleOutsideClick(event) {
    if (this._menu && !this._menu.contains(event.target)) {
      this.hide();
    }
  }
  
  /**
   * Handle escape key
   * 
   * @private
   * @param {KeyboardEvent} event - Keyboard event
   */
  _handleEscape(event) {
    if (event.key === 'Escape') {
      this.hide();
    }
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================
  
  /**
   * Get context menu styles
   * 
   * @static
   * @returns {string} CSS string
   */
  static getStyles() {
    return `
      .uc-context-menu {
        position: fixed;
        z-index: 10000;
        min-width: 180px;
        max-width: 280px;
        background: var(--ha-card-background, white);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        padding: 4px 0;
        opacity: 0;
        transform: scale(0.95);
        transform-origin: top left;
        transition: opacity 0.15s ease, transform 0.15s ease;
      }
      
      .uc-context-menu.open {
        opacity: 1;
        transform: scale(1);
      }
      
      .uc-context-menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 16px;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        color: var(--primary-text-color);
        font-size: 14px;
        transition: background 0.1s ease;
      }
      
      .uc-context-menu-item:hover {
        background: rgba(0, 0, 0, 0.06);
      }
      
      .uc-context-menu-item.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .uc-context-menu-item.disabled:hover {
        background: none;
      }
      
      .uc-context-menu-item ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      
      .uc-context-menu-item .icon-placeholder {
        width: 20px;
      }
      
      .uc-context-menu-item .label {
        flex: 1;
      }
      
      .uc-context-menu-item .shortcut {
        font-size: 12px;
        color: var(--secondary-text-color);
        opacity: 0.7;
      }
      
      .uc-context-menu-item .submenu-icon {
        --mdc-icon-size: 16px;
        margin-right: -8px;
      }
      
      .uc-context-menu-separator {
        height: 1px;
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
        margin: 4px 0;
      }
    `;
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the context menu
   */
  destroy() {
    this.hide();
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ContextMenu;
