/**
 * Universal Card - Modal Mode
 *
 * Opens content in a modal/popup dialog with backdrop.
 * Supports configurable sizing, layout, and close behavior.
 *
 * @author Mesteriis
 * @version 1.0.0
 * @module modes/ModalMode
 */

import { DEFAULTS } from '../core/constants.js';
import type { ModalConfig } from '../core/config-contracts.js';
import { BaseMode, type GridConfig, type ModeConfig, type ModeOptions } from './BaseMode.js';
import { acquireBodyScrollLock, releaseBodyScrollLock } from '../utils/overlay.js';

interface ModalModeConfig extends ModeConfig {
  modal?: ModalConfig;
  grid?: GridConfig;
}

export class ModalMode extends BaseMode {
  declare _config: ModalModeConfig;

  _overlay: HTMLElement | null;
  _dialog: HTMLElement | null;
  _portalTarget: HTMLElement;
  _escapeHandler: (event: KeyboardEvent) => void;
  _width: string;
  _height: string;
  _maxWidth: string;
  _maxHeight: string;
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
    this._width = this._normalizeStringValue(modal.width, DEFAULTS.modal_width);
    this._height = this._normalizeStringValue(modal.height, DEFAULTS.modal_height);
    this._maxWidth = this._normalizeStringValue(modal.max_width, DEFAULTS.modal_max_width);
    this._maxHeight = this._normalizeStringValue(modal.max_height, DEFAULTS.modal_max_height);
    this._backdropBlur = modal.backdrop_blur !== false;
    this._backdropColor = this._normalizeStringValue(modal.backdrop_color, DEFAULTS.backdrop_color);
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
    this._dialog.style.setProperty('--modal-height', this._height);
    this._dialog.style.setProperty('--modal-max-width', this._maxWidth);
    this._dialog.style.setProperty('--modal-max-height', this._maxHeight);
    this._dialog.dataset.widthMode = this._width === 'auto' ? 'auto' : 'manual';
    this._dialog.dataset.heightMode = this._height === 'auto' ? 'auto' : 'manual';
    this._dialog.setAttribute('role', 'dialog');
    this._dialog.setAttribute('aria-modal', 'true');
    this._dialog.tabIndex = -1;

    const header = this._renderHeader();
    const content = document.createElement('div');
    content.className = 'uc-modal-content';

    const grid = document.createElement('div');
    grid.className = 'uc-modal-grid';
    this._applyGridConfig(grid, this._config.grid, { columns: 1, gap: '12px' });

    if (!this._loaded) {
      grid.innerHTML = this._renderSkeleton();
    }

    content.appendChild(grid);
    if (header) {
      this._dialog.appendChild(header);
    }
    this._dialog.appendChild(content);

    const style = document.createElement('style');
    style.textContent = ModalMode.getStyles();
    this._overlay.appendChild(style);
    this._overlay.appendChild(this._dialog);

    this._applyThemeVariables(this._overlay);
    this._applyThemeVariables(this._dialog);

    return this._overlay;
  }

  _renderHeader(): HTMLElement | null {
    const titleText = this._config.title || '';
    if (!titleText && !this._showClose) {
      return null;
    }

    const header = document.createElement('div');
    header.className = 'uc-modal-header';

    const title = document.createElement('div');
    title.className = 'uc-modal-title';
    title.textContent = titleText;
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

  _normalizeStringValue(value: string | undefined, fallback: string): string {
    if (typeof value !== 'string') {
      return fallback;
    }

    const trimmed = value.trim();
    return trimmed || fallback;
  }

  static override getStyles(): string {
    return `
      /* ============================= */
      /* MODAL OVERLAY */
      /* ============================= */

      .uc-modal-overlay {
        --modal-overlay-padding: clamp(12px, 3vw, 20px);
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--modal-overlay-padding);
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
        max-width: min(var(--modal-max-width, 600px), calc(100vw - (2 * var(--modal-overlay-padding))));
        max-height: min(var(--modal-max-height, 85vh), calc(100vh - (2 * var(--modal-overlay-padding))));
        min-width: min(280px, calc(100vw - (2 * var(--modal-overlay-padding))));
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        transform: scale(0.95) translateY(20px);
        opacity: 0;
        transition:
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.3s ease;
      }

      .uc-modal-dialog[data-width-mode="auto"] {
        width: min(calc(100vw - (2 * var(--modal-overlay-padding))), var(--modal-max-width, 600px));
      }

      .uc-modal-dialog[data-height-mode="manual"] {
        height: var(--modal-height, auto);
      }

      .uc-modal-dialog[data-height-mode="auto"] {
        height: auto;
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
        gap: 12px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }

      .uc-modal-title {
        min-width: 0;
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
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        padding: 12px 16px 16px;
      }

      .uc-modal-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
        align-items: start;
      }

      .uc-modal-grid .card-wrapper {
        min-width: 0;
        min-height: 0;
        animation: modal-card-appear 0.3s ease forwards;
        opacity: 0;
      }

      .uc-modal-grid .card-wrapper > * {
        min-width: 0;
        height: 100%;
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
        display: grid;
        grid-template-columns: inherit;
        gap: inherit;
        grid-column: 1 / -1;
        transition: opacity 0.2s ease;
      }

      .uc-modal-content .skeleton-container.fade-out {
        opacity: 0;
      }

      .uc-modal-content .skeleton-card {
        padding: 14px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
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

      @media (max-width: 767px) {
        .uc-modal-overlay {
          align-items: stretch;
        }

        .uc-modal-dialog {
          width: calc(100vw - (2 * var(--modal-overlay-padding))) !important;
          min-width: 0;
          max-height: calc(100vh - (2 * var(--modal-overlay-padding)));
        }

        .uc-modal-content {
          padding: 10px 12px 12px;
        }

        .uc-modal-grid {
          grid-template-columns: minmax(0, 1fr) !important;
          gap: 10px;
        }
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
