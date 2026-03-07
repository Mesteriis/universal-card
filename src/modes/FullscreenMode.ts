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

import { BaseMode, type GridConfig, type ModeConfig, type ModeOptions } from './BaseMode.js';
import { acquireBodyScrollLock, releaseBodyScrollLock } from '../utils/overlay.js';

interface FullscreenSettings {
  background?: string;
  show_close?: boolean;
  close_on_escape?: boolean;
  max_width?: string;
}

interface FullscreenModeConfig extends ModeConfig {
  fullscreen?: FullscreenSettings;
  grid?: GridConfig;
}

export class FullscreenMode extends BaseMode {
  declare _config: FullscreenModeConfig;

  _overlay: HTMLElement | null;
  _escapeHandler: (event: KeyboardEvent) => void;
  _background: string;
  _showClose: boolean;
  _closeOnEscape: boolean;
  _maxWidth: string;

  constructor(config: FullscreenModeConfig, options: ModeOptions = {}) {
    super(config, options);

    this._overlay = null;
    this._escapeHandler = this._handleEscape.bind(this);

    const fullscreen = config.fullscreen || {};
    this._background = fullscreen.background || 'var(--primary-background-color, #fafafa)';
    this._showClose = fullscreen.show_close !== false;
    this._closeOnEscape = fullscreen.close_on_escape !== false;
    this._maxWidth = fullscreen.max_width || '1200px';
  }

  override render(): HTMLElement {
    this._container = document.createElement('div');
    this._container.className = 'fullscreen-mode-placeholder';
    this._container.style.display = 'none';
    return this._container;
  }

  _renderFullscreen(): HTMLElement {
    this._overlay = document.createElement('div');
    this._overlay.className = 'uc-fullscreen-overlay';
    this._overlay.style.setProperty('--fullscreen-bg', this._background);

    const inner = document.createElement('div');
    inner.className = 'uc-fullscreen-inner';
    inner.style.setProperty('--fullscreen-max-width', this._maxWidth);

    const header = this._renderHeader();
    const content = document.createElement('div');
    content.className = 'uc-fullscreen-content';

    const grid = document.createElement('div');
    grid.className = 'uc-fullscreen-grid';

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
    inner.appendChild(header);
    inner.appendChild(content);

    const style = document.createElement('style');
    style.textContent = FullscreenMode.getStyles();
    this._overlay.appendChild(style);
    this._overlay.appendChild(inner);

    this._applyThemeVariables(this._overlay);
    this._applyThemeVariables(inner);

    return this._overlay;
  }

  _renderHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'uc-fullscreen-header';

    if (this._showClose) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'uc-fullscreen-back';
      closeBtn.innerHTML = '<ha-icon icon="mdi:arrow-left"></ha-icon>';
      closeBtn.addEventListener('click', () => {
        void this.close();
      });
      header.appendChild(closeBtn);
    }

    const title = document.createElement('div');
    title.className = 'uc-fullscreen-title';
    title.textContent = this._config.title || '';
    header.appendChild(title);

    const spacer = document.createElement('div');
    spacer.className = 'uc-fullscreen-spacer';
    header.appendChild(spacer);

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

    const fullscreen = this._renderFullscreen();
    document.body.appendChild(fullscreen);
    acquireBodyScrollLock();

    if (this._closeOnEscape) {
      document.addEventListener('keydown', this._escapeHandler);
    }

    requestAnimationFrame(() => {
      this._overlay?.classList.add('open');
    });

    if (!this._loaded) {
      await this.loadCards(this._config.body?.cards || []);
    }
    this._populateCards();

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  override async close(): Promise<void> {
    if (!this._active) return;

    this._active = false;

    this._overlay?.classList.remove('open');
    this._overlay?.classList.add('closing');

    await new Promise((resolve) => setTimeout(resolve, 250));

    document.removeEventListener('keydown', this._escapeHandler);
    this._overlay?.remove();
    this._overlay = null;

    releaseBodyScrollLock();
    this._options.onClose?.();
  }

  _handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      void this.close();
    }
  }

  _populateCards(): void {
    if (!this._overlay) return;

    const grid = this._overlay.querySelector('.uc-fullscreen-grid') as HTMLElement | null;
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

      .uc-fullscreen-content .skeleton-line.text {
        width: 100%;
      }

      .uc-fullscreen-content .skeleton-line.short {
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

    super.destroy();
  }
}

export default FullscreenMode;
