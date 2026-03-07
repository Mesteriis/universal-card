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

import { BaseMode, type GridConfig, type ModeConfig, type ModeOptions } from './BaseMode.js';
import { acquireBodyScrollLock, releaseBodyScrollLock } from '../utils/overlay.js';

interface ModalSettings {
  width?: string;
  max_width?: string;
  backdrop_blur?: boolean;
  backdrop_color?: string;
  close_on_backdrop?: boolean;
  close_on_escape?: boolean;
  show_close?: boolean;
}

interface ModalModeConfig extends ModeConfig {
  modal?: ModalSettings;
  grid?: GridConfig;
}

export class ModalMode extends BaseMode {
  declare _config: ModalModeConfig;

  _overlay: HTMLElement | null;
  _dialog: HTMLElement | null;
  _portalTarget: HTMLElement;
  _escapeHandler: (event: KeyboardEvent) => void;
  _width: string;
  _maxWidth: string;
  _backdropBlur: boolean;
  _backdropColor: string;
  _closeOnBackdrop: boolean;
  _closeOnEscape: boolean;
  _showClose: boolean;

  constructor(config: ModalModeConfig, options: ModeOptions = {}) {
    super(config, options);

    this._overlay = null;
    this._dialog = null;
    this._portalTarget = document.body;
    this._escapeHandler = this._handleEscape.bind(this);

    const modal = config.modal || {};
    this._width = modal.width || '90%';
    this._maxWidth = modal.max_width || '600px';
    this._backdropBlur = modal.backdrop_blur !== false;
    this._backdropColor = modal.backdrop_color || 'rgba(0, 0, 0, 0.6)';
    this._closeOnBackdrop = modal.close_on_backdrop !== false;
    this._closeOnEscape = modal.close_on_escape !== false;
    this._showClose = modal.show_close !== false;
  }

  override render(): HTMLElement {
    this._container = document.createElement('div');
    this._container.className = 'modal-mode-placeholder';
    this._container.style.display = 'none';
    return this._container;
  }

  _renderModal(): HTMLElement {
    this._overlay = document.createElement('div');
    this._overlay.className = 'uc-modal-overlay';
    this._overlay.style.setProperty('--modal-backdrop-color', this._backdropColor);

    if (this._backdropBlur) {
      this._overlay.classList.add('with-blur');
    }

    this._dialog = document.createElement('div');
    this._dialog.className = 'uc-modal-dialog';
    this._dialog.style.setProperty('--modal-width', this._width);
    this._dialog.style.setProperty('--modal-max-width', this._maxWidth);
    this._dialog.setAttribute('role', 'dialog');
    this._dialog.setAttribute('aria-modal', 'true');
    this._dialog.tabIndex = -1;

    const header = this._renderHeader();
    const content = document.createElement('div');
    content.className = 'uc-modal-content';

    const grid = document.createElement('div');
    grid.className = 'uc-modal-grid';

    if (this._config.grid) {
      const { columns = 1, gap = '16px' } = this._config.grid;
      if (typeof columns === 'string' && columns.trim()) {
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = columns;
        grid.style.gap = gap;
      } else if (typeof columns === 'number' && columns > 1) {
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        grid.style.gap = gap;
      }
    }

    if (!this._loaded) {
      grid.innerHTML = this._renderSkeleton();
    }

    content.appendChild(grid);
    this._dialog.appendChild(header);
    this._dialog.appendChild(content);

    const style = document.createElement('style');
    style.textContent = ModalMode.getStyles();
    this._overlay.appendChild(style);
    this._overlay.appendChild(this._dialog);

    this._applyThemeVariables(this._overlay);
    this._applyThemeVariables(this._dialog);

    return this._overlay;
  }

  _renderHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'uc-modal-header';

    const title = document.createElement('div');
    title.className = 'uc-modal-title';
    title.textContent = this._config.title || '';
    header.appendChild(title);

    if (this._showClose) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'uc-modal-close';
      closeBtn.innerHTML = '<ha-icon icon="mdi:close"></ha-icon>';
      closeBtn.addEventListener('click', () => {
        void this.close();
      });
      header.appendChild(closeBtn);
    }

    return header;
  }

  _renderSkeleton(): string {
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

  override async open(): Promise<void> {
    if (this._active) return;

    this._active = true;

    const modal = this._renderModal();
    this._portalTarget.appendChild(modal);
    acquireBodyScrollLock();

    if (this._closeOnBackdrop && this._overlay) {
      this._overlay.addEventListener('click', (event) => {
        if (event.target === this._overlay) {
          void this.close();
        }
      });
    }

    if (this._closeOnEscape) {
      document.addEventListener('keydown', this._escapeHandler);
    }

    requestAnimationFrame(() => {
      this._overlay?.classList.add('open');
      this._dialog?.classList.add('open');
    });

    if (!this._loaded) {
      await this.loadCards(this._config.body?.cards || []);
    }
    this._populateCards();

    await new Promise((resolve) => setTimeout(resolve, 300));
    this._dialog?.focus();
  }

  override async close(): Promise<void> {
    if (!this._active) return;

    this._active = false;

    this._overlay?.classList.remove('open');
    this._dialog?.classList.remove('open');

    await new Promise((resolve) => setTimeout(resolve, 250));

    document.removeEventListener('keydown', this._escapeHandler);
    this._overlay?.remove();
    this._overlay = null;
    this._dialog = null;

    releaseBodyScrollLock();
    this._options.onClose?.();
  }

  _handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      void this.close();
    }
  }

  _populateCards(): void {
    if (!this._dialog) return;

    const grid = this._dialog.querySelector('.uc-modal-grid') as HTMLElement | null;
    if (!grid) return;

    const skeleton = grid.querySelector('.skeleton-container') as HTMLElement | null;
    if (skeleton) {
      skeleton.classList.add('fade-out');
      setTimeout(() => skeleton.remove(), 200);
    }

    this._appendCards(grid, this._config.body?.cards || []);
  }

  static override getStyles(): string {
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

      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
    `;
  }

  override destroy(): void {
    if (this._active) {
      releaseBodyScrollLock();
      this._overlay?.remove();
    }

    document.removeEventListener('keydown', this._escapeHandler);
    this._overlay = null;
    this._dialog = null;

    super.destroy();
  }
}

export default ModalMode;
