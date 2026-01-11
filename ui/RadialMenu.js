/**
 * Universal Card - Radial Menu
 * 
 * Circular menu that appears on long press.
 * Items arranged in a circle around the touch point.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module ui/RadialMenu
 */

import { fireEvent } from '../utils/helpers.js';
import { executeAction } from '../utils/ha-helpers.js';

// =============================================================================
// RADIAL MENU
// =============================================================================

/**
 * Radial Menu component
 * 
 * @class RadialMenu
 */
export class RadialMenu {
  
  /**
   * Create RadialMenu instance
   * 
   * @param {Object} config - Menu configuration
   * @param {Object} options - Additional options
   */
  constructor(config = {}, options = {}) {
    /** @type {Object} Menu configuration */
    this._config = config;
    
    /** @type {Object} Options */
    this._options = {
      radius: options.radius || 80,
      itemSize: options.itemSize || 48,
      startAngle: options.startAngle || -90, // Start from top
      ...options
    };
    
    /** @type {HTMLElement|null} Menu element */
    this._menu = null;
    
    /** @type {HTMLElement|null} Center element */
    this._center = null;
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;
    
    /** @type {number|null} Selected item index */
    this._selectedIndex = null;
    
    /** @type {Object} Center position */
    this._centerPos = { x: 0, y: 0 };
    
    /** @type {Function} Bound handlers */
    this._moveHandler = this._handleMove.bind(this);
    this._endHandler = this._handleEnd.bind(this);
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
   * Show radial menu at position
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} [context] - Additional context data
   */
  show(x, y, context = {}) {
    // Close any existing menu
    this.hide();
    
    // Store center position
    this._centerPos = { x, y };
    
    // Create menu
    this._menu = this._createMenu(context);
    
    // Add to DOM
    document.body.appendChild(this._menu);
    
    // Add event listeners for selection
    document.addEventListener('touchmove', this._moveHandler, { passive: false });
    document.addEventListener('touchend', this._endHandler);
    document.addEventListener('mousemove', this._moveHandler);
    document.addEventListener('mouseup', this._endHandler);
    
    // Animate in
    requestAnimationFrame(() => {
      this._menu?.classList.add('open');
    });
  }
  
  /**
   * Hide radial menu
   * 
   * @param {boolean} [executeSelected=false] - Execute selected item
   */
  hide(executeSelected = false) {
    if (!this._menu) return;
    
    // Execute selected item if requested
    if (executeSelected && this._selectedIndex !== null) {
      const items = this._config.items || [];
      const item = items[this._selectedIndex];
      if (item) {
        this._executeItem(item);
      }
    }
    
    // Remove event listeners
    document.removeEventListener('touchmove', this._moveHandler);
    document.removeEventListener('touchend', this._endHandler);
    document.removeEventListener('mousemove', this._moveHandler);
    document.removeEventListener('mouseup', this._endHandler);
    
    // Animate out
    this._menu.classList.remove('open');
    
    // Remove after animation
    setTimeout(() => {
      this._menu?.remove();
      this._menu = null;
      this._center = null;
      this._selectedIndex = null;
    }, 200);
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
    menu.className = 'uc-radial-menu';
    
    // Add styles
    menu.innerHTML = `<style>${RadialMenu.getStyles()}</style>`;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'uc-radial-overlay';
    menu.appendChild(overlay);
    
    // Create center indicator
    this._center = document.createElement('div');
    this._center.className = 'uc-radial-center';
    this._center.style.left = `${this._centerPos.x}px`;
    this._center.style.top = `${this._centerPos.y}px`;
    menu.appendChild(this._center);
    
    // Create items
    const items = this._config.items || [];
    const angleStep = 360 / items.length;
    
    items.forEach((item, index) => {
      const itemEl = this._createItem(item, index, angleStep);
      menu.appendChild(itemEl);
    });
    
    return menu;
  }
  
  /**
   * Create menu item
   * 
   * @private
   * @param {Object} item - Item configuration
   * @param {number} index - Item index
   * @param {number} angleStep - Angle between items
   * @returns {HTMLElement} Menu item element
   */
  _createItem(item, index, angleStep) {
    const { radius, itemSize, startAngle } = this._options;
    
    // Calculate position
    const angle = startAngle + (index * angleStep);
    const radians = (angle * Math.PI) / 180;
    const x = this._centerPos.x + radius * Math.cos(radians);
    const y = this._centerPos.y + radius * Math.sin(radians);
    
    // Create element
    const itemEl = document.createElement('button');
    itemEl.className = 'uc-radial-item';
    itemEl.dataset.index = index;
    itemEl.style.left = `${x}px`;
    itemEl.style.top = `${y}px`;
    itemEl.style.width = `${itemSize}px`;
    itemEl.style.height = `${itemSize}px`;
    itemEl.style.setProperty('--delay', `${index * 30}ms`);
    
    // Color
    if (item.color) {
      itemEl.style.setProperty('--item-color', item.color);
    }
    
    // Icon
    if (item.icon) {
      itemEl.innerHTML = `<ha-icon icon="${item.icon}"></ha-icon>`;
    } else if (item.label) {
      itemEl.innerHTML = `<span>${item.label.charAt(0)}</span>`;
    }
    
    // Tooltip
    if (item.label) {
      itemEl.title = item.label;
    }
    
    return itemEl;
  }
  
  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  
  /**
   * Handle move event (touch or mouse)
   * 
   * @private
   * @param {TouchEvent|MouseEvent} event - Move event
   */
  _handleMove(event) {
    event.preventDefault();
    
    // Get current position
    let x, y;
    if (event.touches) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }
    
    // Calculate distance and angle from center
    const dx = x - this._centerPos.x;
    const dy = y - this._centerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update center indicator
    if (this._center) {
      const maxMove = 20;
      const moveX = Math.min(maxMove, Math.max(-maxMove, dx * 0.3));
      const moveY = Math.min(maxMove, Math.max(-maxMove, dy * 0.3));
      this._center.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
    }
    
    // Find closest item if outside center zone
    if (distance > 30) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const normalizedAngle = (angle - this._options.startAngle + 360) % 360;
      const items = this._config.items || [];
      const angleStep = 360 / items.length;
      const index = Math.round(normalizedAngle / angleStep) % items.length;
      
      this._selectItem(index);
    } else {
      this._selectItem(null);
    }
  }
  
  /**
   * Handle end event (touch or mouse)
   * 
   * @private
   * @param {TouchEvent|MouseEvent} event - End event
   */
  _handleEnd(event) {
    this.hide(true);
  }
  
  /**
   * Select item by index
   * 
   * @private
   * @param {number|null} index - Item index
   */
  _selectItem(index) {
    if (index === this._selectedIndex) return;
    
    // Deselect previous
    if (this._selectedIndex !== null) {
      const prevItem = this._menu?.querySelector(
        `.uc-radial-item[data-index="${this._selectedIndex}"]`
      );
      prevItem?.classList.remove('selected');
    }
    
    // Select new
    this._selectedIndex = index;
    
    if (index !== null) {
      const newItem = this._menu?.querySelector(
        `.uc-radial-item[data-index="${index}"]`
      );
      newItem?.classList.add('selected');
    }
  }
  
  /**
   * Execute item action
   * 
   * @private
   * @param {Object} item - Item configuration
   */
  _executeItem(item) {
    // Execute action
    if (item.action) {
      executeAction(this._hass, document.body, item.action);
    }
    
    // Call callback
    if (item.callback && typeof item.callback === 'function') {
      item.callback();
    }
    
    // Fire event
    if (item.event) {
      fireEvent(document.body, item.event, { item });
    }
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================
  
  /**
   * Get radial menu styles
   * 
   * @static
   * @returns {string} CSS string
   */
  static getStyles() {
    return `
      .uc-radial-menu {
        position: fixed;
        inset: 0;
        z-index: 10001;
        pointer-events: none;
      }
      
      .uc-radial-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0);
        transition: background 0.2s ease;
        pointer-events: auto;
      }
      
      .uc-radial-menu.open .uc-radial-overlay {
        background: rgba(0, 0, 0, 0.3);
      }
      
      .uc-radial-center {
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--ha-card-background, white);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
        pointer-events: none;
        opacity: 0;
      }
      
      .uc-radial-menu.open .uc-radial-center {
        opacity: 1;
      }
      
      .uc-radial-item {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--item-color, var(--primary-color));
        color: white;
        border: none;
        cursor: pointer;
        transform: translate(-50%, -50%) scale(0);
        transition: 
          transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow 0.2s ease;
        transition-delay: var(--delay, 0ms);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        pointer-events: auto;
      }
      
      .uc-radial-menu.open .uc-radial-item {
        transform: translate(-50%, -50%) scale(1);
      }
      
      .uc-radial-item.selected {
        transform: translate(-50%, -50%) scale(1.2);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      }
      
      .uc-radial-item ha-icon {
        --mdc-icon-size: 24px;
      }
      
      .uc-radial-item span {
        font-size: 18px;
        font-weight: 600;
      }
    `;
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the radial menu
   */
  destroy() {
    this.hide();
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default RadialMenu;
