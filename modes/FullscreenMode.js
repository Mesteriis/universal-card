/**
 * Universal Card - Fullscreen Mode
 * 
 * Opens content in fullscreen overlay.
 * Covers the entire viewport with smooth animation.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module modes/FullscreenMode
 */

import { BaseMode } from './BaseMode.js';

// =============================================================================
// FULLSCREEN MODE CLASS
// =============================================================================

/**
 * Fullscreen mode - content in fullscreen overlay
 * 
 * @class FullscreenMode
 * @extends BaseMode
 */
export class FullscreenMode extends BaseMode {
  
  /**
   * Create FullscreenMode instance
   * 
   * @param {Object} config - Mode configuration
   * @param {Object} options - Additional options
   */
  constructor(config, options = {}) {
    super(config, options);
    
    /** @type {HTMLElement|null} Fullscreen overlay */
    this._overlay = null;
    
    /** @type {Function} Bound escape handler */
    this._escapeHandler = this._handleEscape.bind(this);
    
    // Fullscreen configuration
    const fullscreen = config.fullscreen || {};
    
    /** @type {string} Background color */
    this._background = fullscreen.background || 
      'var(--primary-background-color, #fafafa)';
    
    /** @type {boolean} Show close button */
    this._showClose = fullscreen.show_close !== false;
    
    /** @type {boolean} Close on escape */
    this._closeOnEscape = fullscreen.close_on_escape !== false;
    
    /** @type {string} Max content width */
    this._maxWidth = fullscreen.max_width || '1200px';
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the fullscreen mode container (placeholder)
   * 
   * @returns {HTMLElement} Placeholder element
   */
  render() {
    this._container = document.createElement('div');
    this._container.className = 'fullscreen-mode-placeholder';
    this._container.style.display = 'none';
    
    return this._container;
  }
  
  /**
   * Render the fullscreen portal
   * 
   * @private
   * @returns {HTMLElement} Fullscreen overlay element
   */
  _renderFullscreen() {
    // Overlay
    this._overlay = document.createElement('div');
    this._overlay.className = 'uc-fullscreen-overlay';
    this._overlay.style.setProperty('--fullscreen-bg', this._background);
    
    // Inner container
    const inner = document.createElement('div');
    inner.className = 'uc-fullscreen-inner';
    inner.style.setProperty('--fullscreen-max-width', this._maxWidth);
    
    // Header
    const header = this._renderHeader();
    
    // Content
    const content = document.createElement('div');
    content.className = 'uc-fullscreen-content';
    
    // Grid container
    const grid = document.createElement('div');
    grid.className = 'uc-fullscreen-grid';
    
    // Apply grid styles
    if (this._config.grid) {
      const { columns = 1, gap = '16px' } = this._config.grid;
      if (columns > 1) {
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        grid.style.gap = gap;
      }
    }
    
    // Show skeleton if not loaded
    if (!this._loaded) {
      grid.innerHTML = this._renderSkeleton();
    }
    
    content.appendChild(grid);
    inner.appendChild(header);
    inner.appendChild(content);
    this._overlay.appendChild(inner);
    
    return this._overlay;
  }
  
  /**
   * Render fullscreen header
   * 
   * @private
   * @returns {HTMLElement} Header element
   */
  _renderHeader() {
    const header = document.createElement('div');
    header.className = 'uc-fullscreen-header';
    
    // Back/Close button
    if (this._showClose) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'uc-fullscreen-back';
      closeBtn.innerHTML = '<ha-icon icon="mdi:arrow-left"></ha-icon>';
      closeBtn.addEventListener('click', () => this.close());
      header.appendChild(closeBtn);
    }
    
    // Title
    const title = document.createElement('div');
    title.className = 'uc-fullscreen-title';
    title.textContent = this._config.title || '';
    header.appendChild(title);
    
    // Spacer
    const spacer = document.createElement('div');
    spacer.className = 'uc-fullscreen-spacer';
    header.appendChild(spacer);
    
    return header;
  }
  
  /**
   * Render skeleton loader
   * 
   * @private
   * @returns {string} Skeleton HTML
   */
  _renderSkeleton() {
    const count = this._config.skeleton_count || 3;
    
    return `
      <div class="skeleton-container">
        ${Array(count).fill(0).map(() => `
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line text short"></div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // ===========================================================================
  // OPEN / CLOSE
  // ===========================================================================
  
  /**
   * Open fullscreen
   * 
   * @returns {Promise<void>}
   */
  async open() {
    if (this._active) return;
    
    this._active = true;
    
    // Render fullscreen to body
    const fullscreen = this._renderFullscreen();
    document.body.appendChild(fullscreen);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add escape handler
    if (this._closeOnEscape) {
      document.addEventListener('keydown', this._escapeHandler);
    }
    
    // Trigger animation
    requestAnimationFrame(() => {
      this._overlay?.classList.add('open');
    });
    
    // Load cards if not loaded
    if (!this._loaded) {
      await this.loadCards(this._config.body?.cards || []);
      this._populateCards();
    }
    
    // Wait for animation
    await new Promise(r => setTimeout(r, 300));
  }
  
  /**
   * Close fullscreen
   * 
   * @returns {Promise<void>}
   */
  async close() {
    if (!this._active) return;
    
    this._active = false;
    
    // Trigger close animation
    this._overlay?.classList.remove('open');
    this._overlay?.classList.add('closing');
    
    // Wait for animation
    await new Promise(r => setTimeout(r, 250));
    
    // Remove event listeners
    document.removeEventListener('keydown', this._escapeHandler);
    
    // Remove from DOM
    this._overlay?.remove();
    this._overlay = null;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Fire callback
    if (this._options.onClose) {
      this._options.onClose();
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
      this.close();
    }
  }
  
  // ===========================================================================
  // CARDS
  // ===========================================================================
  
  /**
   * Populate cards into the grid
   * 
   * @private
   */
  _populateCards() {
    if (!this._overlay) return;
    
    const grid = this._overlay.querySelector('.uc-fullscreen-grid');
    if (!grid) return;
    
    // Remove skeleton
    const skeleton = grid.querySelector('.skeleton-container');
    if (skeleton) {
      skeleton.classList.add('fade-out');
      setTimeout(() => skeleton.remove(), 200);
    }
    
    // Append cards
    this._appendCards(grid, this._config.body?.cards || []);
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================
  
  /**
   * Get CSS styles for fullscreen mode
   * 
   * @returns {string} CSS string
   */
  static getStyles() {
    return `
      /* ============================= */
      /* FULLSCREEN OVERLAY */
      /* ============================= */
      
      .uc-fullscreen-overlay {
        position: fixed;
        inset: 0;
        z-index: 1001;
        background: var(--fullscreen-bg, var(--primary-background-color, #fafafa));
        transform: translateY(100%);
        opacity: 0;
        transition: 
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.3s ease;
      }
      
      .uc-fullscreen-overlay.open {
        transform: translateY(0);
        opacity: 1;
      }
      
      .uc-fullscreen-overlay.closing {
        transform: translateY(100%);
        opacity: 0;
      }
      
      /* ============================= */
      /* FULLSCREEN INNER */
      /* ============================= */
      
      .uc-fullscreen-inner {
        width: 100%;
        height: 100%;
        max-width: var(--fullscreen-max-width, 1200px);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }
      
      /* ============================= */
      /* FULLSCREEN HEADER */
      /* ============================= */
      
      .uc-fullscreen-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .uc-fullscreen-back {
        background: none;
        border: none;
        padding: 8px;
        margin: -8px;
        margin-right: 4px;
        cursor: pointer;
        color: var(--primary-text-color);
        border-radius: 50%;
        transition: background 0.2s ease;
      }
      
      .uc-fullscreen-back:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      
      .uc-fullscreen-back ha-icon {
        --mdc-icon-size: 24px;
      }
      
      .uc-fullscreen-title {
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      
      .uc-fullscreen-spacer {
        flex: 1;
      }
      
      /* ============================= */
      /* FULLSCREEN CONTENT */
      /* ============================= */
      
      .uc-fullscreen-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }
      
      .uc-fullscreen-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .uc-fullscreen-grid .card-wrapper {
        min-width: 0;
        animation: fullscreen-card-appear 0.3s ease forwards;
        opacity: 0;
      }
      
      .uc-fullscreen-grid .card-wrapper:nth-child(1) { animation-delay: 100ms; }
      .uc-fullscreen-grid .card-wrapper:nth-child(2) { animation-delay: 150ms; }
      .uc-fullscreen-grid .card-wrapper:nth-child(3) { animation-delay: 200ms; }
      .uc-fullscreen-grid .card-wrapper:nth-child(4) { animation-delay: 250ms; }
      
      @keyframes fullscreen-card-appear {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Skeleton */
      .uc-fullscreen-content .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .uc-fullscreen-content .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .uc-fullscreen-content .skeleton-card {
        padding: 16px;
        background: var(--ha-card-background, white);
        border-radius: 8px;
        margin-bottom: 8px;
        box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,0.1));
      }
      
      .uc-fullscreen-content .skeleton-line {
        height: 12px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .uc-fullscreen-content .skeleton-line.title {
        width: 60%;
        height: 16px;
      }
    `;
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the mode
   */
  destroy() {
    if (this._active) {
      document.body.style.overflow = '';
      this._overlay?.remove();
    }
    
    document.removeEventListener('keydown', this._escapeHandler);
    
    this._overlay = null;
    
    super.destroy();
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default FullscreenMode;
