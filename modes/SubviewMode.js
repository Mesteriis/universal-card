/**
 * Universal Card - Subview Mode
 *
 * Navigates to an internal Lovelace subview path when opened.
 *
 * @module modes/SubviewMode
 */

import { BaseMode } from './BaseMode.js';

/**
 * Subview mode - route navigation to another Lovelace view
 *
 * @class SubviewMode
 * @extends BaseMode
 */
export class SubviewMode extends BaseMode {
  /**
   * @param {Object} config - Mode configuration
   * @param {Object} options - Additional options
   */
  constructor(config, options = {}) {
    super(config, options);

    const subview = config.subview || {};

    /** @type {string} */
    this._path = subview.path || subview.navigation_path || '';

    /** @type {boolean} */
    this._replaceState = subview.replace_state === true;

    /** @type {boolean} */
    this._returnOnClose = subview.return_on_close === true;

    /** @type {string|null} */
    this._previousPath = null;
  }

  /**
   * @returns {HTMLElement}
   */
  render() {
    this._container = document.createElement('div');
    this._container.className = 'subview-mode-placeholder';
    this._container.style.display = 'none';
    return this._container;
  }

  /**
   * @returns {Promise<void>}
   */
  async open() {
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

    if (typeof this._options.onOpen === 'function') {
      this._options.onOpen();
    }
  }

  /**
   * @returns {Promise<void>}
   */
  async close() {
    if (!this._active) return;

    this._active = false;

    if (this._returnOnClose && this._previousPath) {
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      if (currentPath !== this._previousPath) {
        history.pushState(null, '', this._previousPath);
        window.dispatchEvent(new CustomEvent('location-changed'));
      }
    }

    if (typeof this._options.onClose === 'function') {
      this._options.onClose();
    }
  }

  /**
   * @returns {string}
   */
  static getStyles() {
    return `
      .subview-mode-placeholder {
        display: none;
      }
    `;
  }

  destroy() {
    this._previousPath = null;
    super.destroy();
  }
}

export default SubviewMode;
