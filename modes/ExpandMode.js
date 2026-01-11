/**
 * Universal Card - Expand Mode
 * 
 * Standard expand/collapse mode with smooth CSS animations.
 * Content expands below the header with configurable animation.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module modes/ExpandMode
 */

import { BaseMode } from './BaseMode.js';

// =============================================================================
// EXPAND MODE CLASS
// =============================================================================

/**
 * Expand mode - standard collapsible content
 * 
 * @class ExpandMode
 * @extends BaseMode
 */
export class ExpandMode extends BaseMode {
  
  /**
   * Create ExpandMode instance
   * 
   * @param {Object} config - Mode configuration
   * @param {Object} options - Additional options
   */
  constructor(config, options = {}) {
    super(config, options);
    
    /** @type {HTMLElement|null} Content wrapper */
    this._contentWrapper = null;
    
    /** @type {number} Animation duration in ms */
    this._animationDuration = config.animation_duration || 300;
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the expand mode container
   * 
   * @returns {HTMLElement} Mode container element
   */
  render() {
    this._container = document.createElement('div');
    this._container.className = 'expand-mode';
    this._container.dataset.state = this._active ? 'expanded' : 'collapsed';
    
    // Content wrapper for animation
    this._contentWrapper = document.createElement('div');
    this._contentWrapper.className = 'expand-content';
    
    // Grid container
    const grid = document.createElement('div');
    grid.className = 'expand-grid';
    
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
    
    this._contentWrapper.appendChild(grid);
    this._container.appendChild(this._contentWrapper);
    
    return this._container;
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
   * Open (expand) the mode
   * 
   * @returns {Promise<void>}
   */
  async open() {
    if (this._active) return;
    
    this._active = true;
    
    // Load cards if not loaded
    if (!this._loaded) {
      await this.loadCards(this._config.body?.cards || []);
      this._populateCards();
    }
    
    // Animate expand
    if (this._container) {
      this._container.dataset.state = 'expanded';
      
      // Force reflow for animation
      void this._container.offsetHeight;
      
      await this._waitForTransition(this._container, this._animationDuration + 50);
    }
  }
  
  /**
   * Close (collapse) the mode
   * 
   * @returns {Promise<void>}
   */
  async close() {
    if (!this._active) return;
    
    this._active = false;
    
    // Animate collapse
    if (this._container) {
      this._container.dataset.state = 'collapsed';
      
      await this._waitForTransition(this._container, this._animationDuration + 50);
    }
  }
  
  /**
   * Toggle the mode
   * 
   * @returns {Promise<void>}
   */
  async toggle() {
    if (this._active) {
      await this.close();
    } else {
      await this.open();
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
    if (!this._contentWrapper) return;
    
    const grid = this._contentWrapper.querySelector('.expand-grid');
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
   * Get CSS styles for expand mode
   * 
   * @returns {string} CSS string
   */
  static getStyles() {
    return `
      /* ============================= */
      /* EXPAND MODE */
      /* ============================= */
      
      .expand-mode {
        overflow: hidden;
        transition: 
          max-height var(--uc-transition-duration, 300ms) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--uc-transition-duration, 300ms) ease;
        will-change: max-height, opacity;
      }
      
      .expand-mode[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
        pointer-events: none;
      }
      
      .expand-mode[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
        pointer-events: auto;
      }
      
      .expand-content {
        padding: var(--uc-padding, 16px);
        padding-top: 0;
      }
      
      .expand-grid {
        display: flex;
        flex-direction: column;
        gap: var(--uc-gap, 16px);
      }
      
      /* Card wrapper */
      .expand-mode .card-wrapper {
        min-width: 0;
        animation: card-appear 0.3s ease forwards;
        opacity: 0;
      }
      
      .expand-mode .card-wrapper:nth-child(1) { animation-delay: 0ms; }
      .expand-mode .card-wrapper:nth-child(2) { animation-delay: 50ms; }
      .expand-mode .card-wrapper:nth-child(3) { animation-delay: 100ms; }
      .expand-mode .card-wrapper:nth-child(4) { animation-delay: 150ms; }
      .expand-mode .card-wrapper:nth-child(5) { animation-delay: 200ms; }
      
      @keyframes card-appear {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .expand-mode .card-wrapper > * {
        height: 100%;
      }
      
      /* Skeleton */
      .expand-mode .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .expand-mode .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .expand-mode .skeleton-card {
        padding: 16px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .expand-mode .skeleton-line {
        height: 12px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .expand-mode .skeleton-line.title {
        width: 60%;
        height: 16px;
      }
      
      .expand-mode .skeleton-line.text {
        width: 100%;
      }
      
      .expand-mode .skeleton-line.short {
        width: 40%;
      }
      
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
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
    this._contentWrapper = null;
    super.destroy();
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ExpandMode;
