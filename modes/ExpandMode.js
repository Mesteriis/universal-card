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
    
    /** @type {string} Expand animation type */
    this._expandAnimation = config.expand_animation || 'slide';
    
    /** @type {string} Collapse animation type */
    this._collapseAnimation = config.collapse_animation || 'slide';
    
    /** @type {string} Cards animation type */
    this._cardsAnimation = config.cards_animation || 'fadeUp';
    
    /** @type {number} Stagger delay between cards in ms */
    this._cardsStagger = config.cards_stagger || 50;
    
    /** @type {string} Cards animation direction */
    this._cardsDirection = config.cards_direction || 'sequential';
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
    this._container.dataset.expandAnimation = this._expandAnimation;
    this._container.dataset.collapseAnimation = this._collapseAnimation;
    this._container.dataset.cardsAnimation = this._cardsAnimation;
    this._container.dataset.cardsDirection = this._cardsDirection;
    this._container.style.setProperty('--expand-duration', `${this._animationDuration}ms`);
    this._container.style.setProperty('--cards-stagger', `${this._cardsStagger}ms`);
    
    // Content wrapper for animation
    this._contentWrapper = document.createElement('div');
    this._contentWrapper.className = 'expand-content';
    
    // Grid container
    const grid = document.createElement('div');
    grid.className = 'expand-grid';
    
    // Apply grid styles
    if (this._config.grid) {
      const g = this._config.grid;
      const columns = g.columns || 1;
      const isStringColumns = typeof g.columns === 'string';
      const hasMultipleColumns = isStringColumns || (typeof columns === 'number' && columns > 1);
      
      if (hasMultipleColumns || g.display === 'grid') {
        grid.classList.add('has-grid');
        
        // Columns - support "1fr 2fr", "auto 1fr auto", number, or repeat
        if (isStringColumns) {
          grid.style.gridTemplateColumns = g.columns;
        } else if (columns > 1) {
          grid.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';
        }
        
        // Rows
        if (g.rows) {
          if (typeof g.rows === 'string') {
            grid.style.gridTemplateRows = g.rows;
          } else {
            grid.style.gridTemplateRows = 'repeat(' + g.rows + ', auto)';
          }
        }
        
        // Auto rows/columns
        if (g.auto_rows) grid.style.gridAutoRows = g.auto_rows;
        if (g.auto_columns) grid.style.gridAutoColumns = g.auto_columns;
        
        // Gap
        grid.style.gap = g.gap || '16px';
        if (g.row_gap) grid.style.rowGap = g.row_gap;
        if (g.column_gap) grid.style.columnGap = g.column_gap;
        
        // Alignment - items (individual cells)
        if (g.align_items) grid.style.alignItems = g.align_items;
        if (g.justify_items) grid.style.justifyItems = g.justify_items;
        if (g.place_items) grid.style.placeItems = g.place_items;
        
        // Alignment - content (whole grid)
        if (g.align_content) grid.style.alignContent = g.align_content;
        if (g.justify_content) grid.style.justifyContent = g.justify_content;
        if (g.place_content) grid.style.placeContent = g.place_content;
        
        // Direction (for flex fallback or grid-auto-flow)
        if (g.direction) {
          if (g.direction === 'row' || g.direction === 'row-reverse') {
            grid.style.gridAutoFlow = g.direction === 'row-reverse' ? 'row dense' : 'row';
          } else if (g.direction === 'column' || g.direction === 'column-reverse') {
            grid.style.gridAutoFlow = g.direction === 'column-reverse' ? 'column dense' : 'column';
          }
        }
        if (g.auto_flow) grid.style.gridAutoFlow = g.auto_flow;
        
        // Dense packing
        if (g.dense) grid.style.gridAutoFlow = (grid.style.gridAutoFlow || 'row') + ' dense';
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
      // Remove any collapse animation classes
      this._container.classList.remove('collapsing');
      
      // Add expanding class for animation
      this._container.classList.add('expanding');
      this._container.dataset.state = 'expanded';
      
      // Force reflow for animation
      void this._container.offsetHeight;
      
      await this._waitForTransition(this._container, this._animationDuration + 50);
      
      // Cleanup
      this._container.classList.remove('expanding');
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
      // Remove any expand animation classes
      this._container.classList.remove('expanding');
      
      // Add collapsing class for animation
      this._container.classList.add('collapsing');
      this._container.dataset.state = 'collapsed';
      
      await this._waitForTransition(this._container, this._animationDuration + 50);
      
      // Cleanup
      this._container.classList.remove('collapsing');
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
        will-change: max-height, opacity, transform;
        --expand-duration: 300ms;
      }
      
      /* Base collapsed state */
      .expand-mode[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
        pointer-events: none;
      }
      
      /* Base expanded state */
      .expand-mode[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
        pointer-events: auto;
      }
      
      /* ============================= */
      /* EXPAND ANIMATIONS */
      /* ============================= */
      
      /* None - instant */
      .expand-mode[data-expand-animation="none"][data-state="expanded"] {
        transition: none;
      }
      
      /* Slide (default) */
      .expand-mode[data-expand-animation="slide"] {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease;
      }
      
      /* Fade */
      .expand-mode[data-expand-animation="fade"] {
        transition: opacity var(--expand-duration) ease;
      }
      .expand-mode[data-expand-animation="fade"][data-state="collapsed"] {
        max-height: 0;
      }
      .expand-mode[data-expand-animation="fade"][data-state="expanded"] {
        max-height: 2000px;
      }
      
      /* FadeUp */
      .expand-mode[data-expand-animation="fadeUp"].expanding .expand-content {
        animation: expand-fadeUp var(--expand-duration) ease forwards;
      }
      
      /* FadeDown */
      .expand-mode[data-expand-animation="fadeDown"].expanding .expand-content {
        animation: expand-fadeDown var(--expand-duration) ease forwards;
      }
      
      /* Scale */
      .expand-mode[data-expand-animation="scale"] {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease,
          transform var(--expand-duration) ease;
        transform-origin: top center;
      }
      .expand-mode[data-expand-animation="scale"][data-state="collapsed"] {
        transform: scaleY(0);
      }
      .expand-mode[data-expand-animation="scale"][data-state="expanded"] {
        transform: scaleY(1);
      }
      
      /* Bounce */
      .expand-mode[data-expand-animation="bounce"].expanding .expand-content {
        animation: expand-bounce var(--expand-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      }
      
      /* Flip */
      .expand-mode[data-expand-animation="flip"] {
        perspective: 1000px;
      }
      .expand-mode[data-expand-animation="flip"].expanding .expand-content {
        animation: expand-flip var(--expand-duration) ease forwards;
      }
      
      /* ============================= */
      /* COLLAPSE ANIMATIONS */
      /* ============================= */
      
      /* None */
      .expand-mode[data-collapse-animation="none"][data-state="collapsed"] {
        transition: none;
      }
      
      /* Slide (default) */
      .expand-mode[data-collapse-animation="slide"] {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease;
      }
      
      /* Fade */
      .expand-mode[data-collapse-animation="fade"] {
        transition: opacity var(--expand-duration) ease;
      }
      
      /* FadeDown */
      .expand-mode[data-collapse-animation="fadeDown"].collapsing .expand-content {
        animation: collapse-fadeDown var(--expand-duration) ease forwards;
      }
      
      /* FadeUp */
      .expand-mode[data-collapse-animation="fadeUp"].collapsing .expand-content {
        animation: collapse-fadeUp var(--expand-duration) ease forwards;
      }
      
      /* Scale */
      .expand-mode[data-collapse-animation="scale"].collapsing {
        transform-origin: top center;
        animation: collapse-scale var(--expand-duration) ease forwards;
      }
      
      /* ============================= */
      /* KEYFRAMES */
      /* ============================= */
      
      @keyframes expand-fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes expand-fadeDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes expand-bounce {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes expand-flip {
        from {
          opacity: 0;
          transform: perspective(400px) rotateX(-90deg);
        }
        to {
          opacity: 1;
          transform: perspective(400px) rotateX(0);
        }
      }
      
      @keyframes collapse-fadeDown {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }
      
      @keyframes collapse-fadeUp {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
      
      @keyframes collapse-scale {
        from {
          opacity: 1;
          transform: scaleY(1);
        }
        to {
          opacity: 0;
          transform: scaleY(0);
        }
      }
      
      /* ============================= */
      /* CONTENT STYLES */
      /* ============================= */
      
      .expand-content {
        padding: var(--uc-padding, 16px);
        padding-top: 0;
      }
      
      .expand-grid {
        display: flex;
        flex-direction: column;
        gap: var(--uc-gap, 16px);
      }
      
      .expand-grid.has-grid {
        display: grid !important;
        flex-direction: unset;
      }
      
      /* Card wrapper */
      .expand-mode .card-wrapper {
        min-width: 0;
        --card-index: 0;
      }
      
      .expand-mode .card-wrapper > * {
        height: 100%;
      }
      
      /* Card indices for stagger animation */
      .expand-mode .card-wrapper:nth-child(1) { --card-index: 0; }
      .expand-mode .card-wrapper:nth-child(2) { --card-index: 1; }
      .expand-mode .card-wrapper:nth-child(3) { --card-index: 2; }
      .expand-mode .card-wrapper:nth-child(4) { --card-index: 3; }
      .expand-mode .card-wrapper:nth-child(5) { --card-index: 4; }
      .expand-mode .card-wrapper:nth-child(6) { --card-index: 5; }
      .expand-mode .card-wrapper:nth-child(7) { --card-index: 6; }
      .expand-mode .card-wrapper:nth-child(8) { --card-index: 7; }
      .expand-mode .card-wrapper:nth-child(9) { --card-index: 8; }
      .expand-mode .card-wrapper:nth-child(10) { --card-index: 9; }
      .expand-mode .card-wrapper:nth-child(n+11) { --card-index: 10; }
      
      /* Base card animation */
      .expand-mode[data-state="expanded"] .card-wrapper {
        opacity: 0;
        animation-fill-mode: forwards;
        animation-delay: calc(var(--card-index) * var(--cards-stagger, 50ms));
        animation-duration: var(--expand-duration, 300ms);
      }
      
      /* FadeUp (default) */
      .expand-mode[data-cards-animation="fadeUp"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-fadeUp;
      }
      
      /* FadeDown */
      .expand-mode[data-cards-animation="fadeDown"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-fadeDown;
      }
      
      /* FadeLeft */
      .expand-mode[data-cards-animation="fadeLeft"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-fadeLeft;
      }
      
      /* FadeRight */
      .expand-mode[data-cards-animation="fadeRight"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-fadeRight;
      }
      
      /* Scale */
      .expand-mode[data-cards-animation="scale"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-scale;
      }
      
      /* Bounce */
      .expand-mode[data-cards-animation="bounce"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-bounce;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      /* Flip */
      .expand-mode[data-cards-animation="flip"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-flip;
      }
      
      /* None - instant */
      .expand-mode[data-cards-animation="none"][data-state="expanded"] .card-wrapper {
        opacity: 1;
        animation: none;
      }
      
      /* Collapsed state */
      .expand-mode[data-state="collapsed"] .card-wrapper {
        opacity: 0;
        animation: none;
      }
      
      /* Card Animation Keyframes */
      @keyframes expand-card-fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes expand-card-fadeDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes expand-card-fadeLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes expand-card-fadeRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes expand-card-scale {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes expand-card-bounce {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 0.9; transform: scale(1.05); }
        70% { transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes expand-card-flip {
        from { opacity: 0; transform: perspective(400px) rotateY(-90deg); }
        to { opacity: 1; transform: perspective(400px) rotateY(0); }
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
