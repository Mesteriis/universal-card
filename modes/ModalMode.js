/**
 * Universal Card - Modal Mode
 * 
 * Opens content in a modal/popup dialog with backdrop.
 * Supports configurable width, backdrop blur, and animations.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module modes/ModalMode
 */

import { BaseMode } from './BaseMode.js';
import { fireEvent } from '../utils/helpers.js';

// =============================================================================
// MODAL MODE CLASS
// =============================================================================

/**
 * Modal mode - content in popup dialog
 * 
 * @class ModalMode
 * @extends BaseMode
 */
export class ModalMode extends BaseMode {
  
  /**
   * Create ModalMode instance
   * 
   * @param {Object} config - Mode configuration
   * @param {Object} options - Additional options
   */
  constructor(config, options = {}) {
    super(config, options);
    
    /** @type {HTMLElement|null} Modal overlay */
    this._overlay = null;
    
    /** @type {HTMLElement|null} Modal dialog */
    this._dialog = null;
    
    /** @type {HTMLElement|null} Parent element for portal */
    this._portalTarget = document.body;
    
    /** @type {Function} Bound escape handler */
    this._escapeHandler = this._handleEscape.bind(this);
    
    // Modal configuration
    const modal = config.modal || {};
    
    /** @type {string} Modal width */
    this._width = modal.width || '90%';
    
    /** @type {string} Modal max width */
    this._maxWidth = modal.max_width || '600px';
    
    /** @type {boolean} Enable backdrop blur */
    this._backdropBlur = modal.backdrop_blur !== false;
    
    /** @type {string} Backdrop color */
    this._backdropColor = modal.backdrop_color || 'rgba(0, 0, 0, 0.6)';
    
    /** @type {boolean} Close on backdrop click */
    this._closeOnBackdrop = modal.close_on_backdrop !== false;
    
    /** @type {boolean} Close on escape key */
    this._closeOnEscape = modal.close_on_escape !== false;
    
    /** @type {boolean} Show close button */
    this._showClose = modal.show_close !== false;
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the modal mode container (placeholder)
   * The actual modal is rendered as a portal
   * 
   * @returns {HTMLElement} Placeholder element
   */
  render() {
    // Placeholder in the card's DOM
    this._container = document.createElement('div');
    this._container.className = 'modal-mode-placeholder';
    this._container.style.display = 'none';
    
    return this._container;
  }
  
  /**
   * Render the modal portal
   * 
   * @private
   * @returns {HTMLElement} Modal overlay element
   */
  _renderModal() {
    // Overlay
    this._overlay = document.createElement('div');
    this._overlay.className = 'uc-modal-overlay';
    this._overlay.style.setProperty('--modal-backdrop-color', this._backdropColor);
    
    if (this._backdropBlur) {
      this._overlay.classList.add('with-blur');
    }
    
    // Dialog
    this._dialog = document.createElement('div');
    this._dialog.className = 'uc-modal-dialog';
    this._dialog.style.setProperty('--modal-width', this._width);
    this._dialog.style.setProperty('--modal-max-width', this._maxWidth);
    this._dialog.setAttribute('role', 'dialog');
    this._dialog.setAttribute('aria-modal', 'true');
    
    // Header
    const header = this._renderHeader();
    
    // Content
    const content = document.createElement('div');
    content.className = 'uc-modal-content';
    
    // Grid container
    const grid = document.createElement('div');
    grid.className = 'uc-modal-grid';
    
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
    
    // Assemble dialog
    this._dialog.appendChild(header);
    this._dialog.appendChild(content);
    this._overlay.appendChild(this._dialog);
    
    return this._overlay;
  }
  
  /**
   * Render modal header
   * 
   * @private
   * @returns {HTMLElement} Header element
   */
  _renderHeader() {
    const header = document.createElement('div');
    header.className = 'uc-modal-header';
    
    // Title
    const title = document.createElement('div');
    title.className = 'uc-modal-title';
    title.textContent = this._config.title || '';
    
    header.appendChild(title);
    
    // Close button
    if (this._showClose) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'uc-modal-close';
      closeBtn.innerHTML = '<ha-icon icon="mdi:close"></ha-icon>';
      closeBtn.addEventListener('click', () => this.close());
      header.appendChild(closeBtn);
    }
    
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
   * Open the modal
   * 
   * @returns {Promise<void>}
   */
  async open() {
    if (this._active) return;
    
    this._active = true;
    
    // Render modal to body
    const modal = this._renderModal();
    this._portalTarget.appendChild(modal);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    if (this._closeOnBackdrop) {
      this._overlay.addEventListener('click', (e) => {
        if (e.target === this._overlay) {
          this.close();
        }
      });
    }
    
    if (this._closeOnEscape) {
      document.addEventListener('keydown', this._escapeHandler);
    }
    
    // Trigger animation
    requestAnimationFrame(() => {
      this._overlay?.classList.add('open');
      this._dialog?.classList.add('open');
    });
    
    // Load cards if not loaded
    if (!this._loaded) {
      await this.loadCards(this._config.body?.cards || []);
      this._populateCards();
    }
    
    // Wait for animation
    await new Promise(r => setTimeout(r, 300));
    
    // Focus trap
    this._dialog?.focus();
  }
  
  /**
   * Close the modal
   * 
   * @returns {Promise<void>}
   */
  async close() {
    if (!this._active) return;
    
    this._active = false;
    
    // Trigger close animation
    this._overlay?.classList.remove('open');
    this._dialog?.classList.remove('open');
    
    // Wait for animation
    await new Promise(r => setTimeout(r, 250));
    
    // Remove event listeners
    document.removeEventListener('keydown', this._escapeHandler);
    
    // Remove from DOM
    this._overlay?.remove();
    this._overlay = null;
    this._dialog = null;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Fire event
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
    if (!this._dialog) return;
    
    const grid = this._dialog.querySelector('.uc-modal-grid');
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
   * Get CSS styles for modal mode
   * 
   * @returns {string} CSS string
   */
  static getStyles() {
    return `
      /* ============================= */
      /* MODAL OVERLAY */
      /* ============================= */
      
      .uc-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: var(--modal-backdrop-color, rgba(0, 0, 0, 0.6));
        opacity: 0;
        transition: opacity 0.25s ease;
      }
      
      .uc-modal-overlay.with-blur {
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      
      .uc-modal-overlay.open {
        opacity: 1;
      }
      
      /* ============================= */
      /* MODAL DIALOG */
      /* ============================= */
      
      .uc-modal-dialog {
        width: var(--modal-width, 90%);
        max-width: var(--modal-max-width, 600px);
        max-height: 90vh;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transform: scale(0.95) translateY(20px);
        opacity: 0;
        transition: 
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.3s ease;
      }
      
      .uc-modal-dialog.open {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      
      /* ============================= */
      /* MODAL HEADER */
      /* ============================= */
      
      .uc-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      
      .uc-modal-title {
        font-size: 18px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      
      .uc-modal-close {
        background: none;
        border: none;
        padding: 8px;
        margin: -8px;
        cursor: pointer;
        color: var(--secondary-text-color);
        border-radius: 50%;
        transition: background 0.2s ease;
      }
      
      .uc-modal-close:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      
      .uc-modal-close ha-icon {
        --mdc-icon-size: 24px;
      }
      
      /* ============================= */
      /* MODAL CONTENT */
      /* ============================= */
      
      .uc-modal-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }
      
      .uc-modal-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .uc-modal-grid .card-wrapper {
        min-width: 0;
        animation: modal-card-appear 0.3s ease forwards;
        opacity: 0;
      }
      
      .uc-modal-grid .card-wrapper:nth-child(1) { animation-delay: 50ms; }
      .uc-modal-grid .card-wrapper:nth-child(2) { animation-delay: 100ms; }
      .uc-modal-grid .card-wrapper:nth-child(3) { animation-delay: 150ms; }
      .uc-modal-grid .card-wrapper:nth-child(4) { animation-delay: 200ms; }
      
      @keyframes modal-card-appear {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Skeleton */
      .uc-modal-content .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .uc-modal-content .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .uc-modal-content .skeleton-card {
        padding: 16px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .uc-modal-content .skeleton-line {
        height: 12px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .uc-modal-content .skeleton-line.title {
        width: 60%;
        height: 16px;
      }
      
      .uc-modal-content .skeleton-line.text {
        width: 100%;
      }
      
      .uc-modal-content .skeleton-line.short {
        width: 40%;
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
    // Remove modal if open
    if (this._active) {
      document.body.style.overflow = '';
      this._overlay?.remove();
    }
    
    document.removeEventListener('keydown', this._escapeHandler);
    
    this._overlay = null;
    this._dialog = null;
    
    super.destroy();
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ModalMode;
