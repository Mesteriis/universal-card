/**
 * Universal Card - Subview Mode
 *
 * Navigates to an internal Lovelace subview path when opened.
 *
 * @module modes/SubviewMode
 */

import { BaseMode, type ModeConfig, type ModeOptions } from './BaseMode.js';

interface SubviewSettings {
  path?: string;
  navigation_path?: string;
  replace_state?: boolean;
  return_on_close?: boolean;
}

interface SubviewModeConfig extends ModeConfig {
  subview?: SubviewSettings;
}

export class SubviewMode extends BaseMode {
  declare _config: SubviewModeConfig;

  _path: string;
  _replaceState: boolean;
  _returnOnClose: boolean;
  _previousPath: string | null;

  constructor(config: SubviewModeConfig, options: ModeOptions = {}) {
    super(config, options);

    const subview = config.subview || {};
    this._path = subview.path || subview.navigation_path || '';
    this._replaceState = subview.replace_state === true;
    this._returnOnClose = subview.return_on_close === true;
    this._previousPath = null;
  }

  override render(): HTMLElement {
    this._container = document.createElement('div');
    this._container.className = 'subview-mode-placeholder';
    this._container.style.display = 'none';
    this._container.dataset.ucRole = 'mode-placeholder';
    this._container.dataset.ucMode = 'subview';
    return this._container;
  }

  override async open(): Promise<void> {
    if (this._active) return;

    if (!this._path) {
      console.warn('[UniversalCard] subview.path is required for subview mode');
      return;
    }

    this._active = true;
    this._previousPath = window.location.pathname + window.location.search + window.location.hash;

    if (this._replaceState) {
      history.replaceState(null, '', this._path);
    } else {
      history.pushState(null, '', this._path);
    }

    window.dispatchEvent(new CustomEvent('location-changed'));
    this._options.onOpen?.();
  }

  override async close(): Promise<void> {
    if (!this._active) return;

    this._active = false;

    if (this._returnOnClose && this._previousPath) {
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      if (currentPath !== this._previousPath) {
        history.pushState(null, '', this._previousPath);
        window.dispatchEvent(new CustomEvent('location-changed'));
      }
    }

    this._options.onClose?.();
  }

  static override getStyles(): string {
    return `
      .subview-mode-placeholder {
        display: none;
      }
    `;
  }

  override destroy(): void {
    this._previousPath = null;
    super.destroy();
  }
}

export default SubviewMode;
