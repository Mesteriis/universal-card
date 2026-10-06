/** Edge drawer using the modal portal, HA context, card pool and close lifecycle. */
import { DEFAULTS, VALID_DRAWER_SIDES } from '../core/constants.js';
import type { DrawerConfig } from '../core/config-contracts.js';
import { drawerSizePercent } from '../utils/drawer.js';
import type { ModeConfig, ModeOptions } from './BaseMode.js';
import { ModalMode } from './ModalMode.js';
import { releaseBodyScrollLock } from '../utils/overlay.js';

interface DrawerModeConfig extends ModeConfig {
  drawer?: DrawerConfig;
}

export class DrawerMode extends ModalMode {
  private _side: string;
  private _size: number;
  private _opening: Promise<void> | null = null;
  private _closing: Promise<void> | null = null;
  private _returnFocus: HTMLElement | null = null;
  private _tabHandler = (event: KeyboardEvent) => this._trapTab(event);

  constructor(config: DrawerModeConfig, options: ModeOptions = {}) {
    super({ ...config, modal: config.drawer || {} }, options);
    const side = config.drawer?.side;
    this._side = side && VALID_DRAWER_SIDES.includes(side) ? side : DEFAULTS.drawer_side;
    this._size = drawerSizePercent(config.drawer?.size) ?? drawerSizePercent(DEFAULTS.drawer_size)!;
  }

  override render(): HTMLElement {
    const placeholder = super.render();
    placeholder.className = 'drawer-mode-placeholder';
    placeholder.dataset.ucMode = 'drawer';
    return placeholder;
  }

  override _renderModal(): HTMLElement {
    const overlay = super._renderModal();
    overlay.classList.add('uc-drawer-overlay');
    overlay.dataset.ucMode = 'drawer';
    overlay.dataset.side = this._side;
    const dialog = this._dialog!;
    dialog.classList.add('uc-drawer-dialog');
    dialog.dataset.ucMode = 'drawer';
    dialog.dataset.side = this._side;
    dialog.style.setProperty('--drawer-size', `${this._size}%`);
    dialog.setAttribute('aria-label', this._config.title || 'Drawer');
    dialog.querySelector('[data-uc-role="close"]')?.setAttribute('aria-label', 'Close');
    const style = overlay.querySelector('style')!;
    style.textContent = ModalMode.getStyles() + DrawerMode.getStyles()
      + (this._config.modal?.custom_css || '');
    return overlay;
  }

  override async open(): Promise<void> {
    // Never mount a replacement portal while an older close timer can remove it.
    if (this._closing) await this._closing;
    if (this._opening) await this._opening;
    if (this._closing) await this._closing;
    if (this._active) return;
    this._returnFocus = this._deepActiveElement();
    document.addEventListener('keydown', this._tabHandler);
    const opening = super.open();
    this._opening = opening;
    try { await opening; } finally { if (this._opening === opening) this._opening = null; }
  }

  override async close(): Promise<void> {
    if (this._closing) return this._closing;
    if (!this._active) return;
    document.removeEventListener('keydown', this._tabHandler);
    const restore = this._returnFocus;
    this._active = false;
    const overlay = this._overlay;
    overlay?.classList.remove('open');
    this._dialog?.classList.remove('open');
    document.removeEventListener('keydown', this._escapeHandler);
    const closing = new Promise<void>(resolve => setTimeout(resolve, 250));
    this._closing = closing;
    try {
      await closing;
      // Destroy may have removed this portal and released its lock already.
      if (overlay && overlay === this._overlay) {
        overlay.remove();
        this._overlay = null;
        this._dialog = null;
        releaseBodyScrollLock();
        this._options.onClose?.();
        if (restore?.isConnected) restore.focus();
      }
    } finally {
      if (this._closing === closing) this._closing = null;
      this._returnFocus = null;
    }
  }

  private _deepActiveElement(): HTMLElement | null {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active instanceof HTMLElement ? active : null;
  }

  private _trapTab(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this._active || !this._dialog) return;
    if (event.composedPath().some(node => node instanceof HTMLElement && node !== this._dialog
      && (node.getAttribute('role') === 'dialog' || node.tagName === 'HA-DIALOG'))) return;
    const focusable: HTMLElement[] = [];
    const visit = (root: HTMLElement | ShadowRoot) => {
      for (const el of Array.from(root.children)) {
        if (!(el instanceof HTMLElement)) continue;
        if (el.tabIndex >= 0 && !el.hasAttribute('disabled') && !el.hidden
          && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden') focusable.push(el);
        visit(el.shadowRoot || el);
      }
    };
    visit(this._dialog);
    const first = focusable[0], last = focusable[focusable.length - 1];
    const active = this._deepActiveElement();
    if (!first) {
      event.preventDefault(); this._dialog.focus();
    } else if (event.shiftKey && (active === first || !focusable.includes(active!))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (active === last || !focusable.includes(active!))) {
      event.preventDefault(); first.focus();
    }
  }

  override destroy(): void {
    document.removeEventListener('keydown', this._tabHandler);
    this._returnFocus = null;
    if (this._overlay && !this._active) {
      this._overlay.remove();
      releaseBodyScrollLock();
    }
    super.destroy();
  }

  static override getStyles(): string {
    return `
      .uc-drawer-overlay.uc-modal-overlay {
        --modal-overlay-padding: 0px;
        padding: 0; box-sizing: border-box;
        height: 100vh; height: 100dvh;
        align-items: stretch; justify-content: flex-end;
      }
      .uc-drawer-dialog.uc-modal-dialog {
        width: var(--drawer-size, 33.333333%) !important;
        height: 100%; min-width: 0; min-height: 0;
        max-width: none; max-height: none;
        border-radius: 0; flex-shrink: 0;
        transform: translateX(100%); opacity: 1;
      }
      .uc-drawer-overlay[data-side="left"] {justify-content: flex-start;}
      .uc-drawer-dialog[data-side="left"] {transform: translateX(-100%);}
      .uc-drawer-overlay[data-side="top"], .uc-drawer-overlay[data-side="bottom"] {flex-direction: column;}
      .uc-drawer-overlay[data-side="top"] {justify-content: flex-start;}
      .uc-drawer-dialog[data-side="top"], .uc-drawer-dialog[data-side="bottom"] {
        width: 100% !important; height: var(--drawer-size, 33.333333%);
      }
      .uc-drawer-dialog[data-side="top"] {transform: translateY(-100%);}
      .uc-drawer-dialog[data-side="bottom"] {transform: translateY(100%);}
      .uc-drawer-dialog.uc-modal-dialog.open {transform: translate(0, 0);}
      @media (prefers-reduced-motion: reduce) {
        .uc-drawer-overlay.uc-modal-overlay, .uc-drawer-dialog.uc-modal-dialog {transition: none;}
        .uc-drawer-overlay .card-wrapper {animation: none; opacity: 1;}
        .uc-drawer-overlay .skeleton-line {animation: none;}
      }
    `;
  }
}
