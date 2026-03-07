/**
 * Universal Card - Base Mode Class
 *
 * Abstract base class for all body modes.
 * Provides common functionality and interface.
 *
 * @author Mesteriis
 * @version 1.0.0
 * @module modes/BaseMode
 */

import { DEFAULTS, LIMITS } from '../core/constants.js';
import { cardPool } from '../core/runtime.js';

export type UnknownRecord = Record<string, any>;
export type HomeAssistantLike = UnknownRecord;
export type PoolScope = 'card' | 'dashboard' | 'global';

export interface CardLayoutOptions extends UnknownRecord {
  colspan?: number;
  rowspan?: number;
}

export interface ModeCardConfig extends UnknownRecord {
  colspan?: number;
  rowspan?: number;
  card_options?: CardLayoutOptions;
}

export interface ModeSectionConfig extends UnknownRecord {
  cards?: ModeCardConfig[];
}

export interface GridConfig extends UnknownRecord {
  columns?: number | string;
  gap?: string;
  rows?: number | string;
  display?: string;
  auto_rows?: string;
  auto_columns?: string;
  row_gap?: string;
  column_gap?: string;
  align_items?: string;
  justify_items?: string;
  place_items?: string;
  align_content?: string;
  justify_content?: string;
  place_content?: string;
  direction?: string;
  auto_flow?: string;
  dense?: boolean;
}

export interface ModeConfig extends UnknownRecord {
  card_id?: string;
  body_mode?: string;
  title?: string;
  body?: ModeSectionConfig;
  grid?: GridConfig;
  skeleton_count?: number;
  enable_card_pool?: boolean;
  pool_scope?: PoolScope | string;
  pool_ttl_ms?: number;
  pool_max_entries?: number;
}

export interface ModeOptions extends UnknownRecord {
  card?: HTMLElement | { shadowRoot?: ShadowRoot | null } | null;
  poolNamespace?: string;
  onClose?: (() => void) | null;
  onOpen?: (() => void) | null;
}

export interface ModeCardHelpers {
  createCardElement(config: ModeCardConfig): Promise<ModeCardElement>;
}

export type ModeCardElement = HTMLElement & {
  hass?: HomeAssistantLike | null;
  _errorData?: unknown;
};

interface ErrorDetails {
  error?: Error | null;
  config?: unknown;
  stack?: string | null;
}

export class BaseMode {
  _config: ModeConfig;
  _options: ModeOptions;
  _container: HTMLElement | null;
  _cards: ModeCardElement[];
  _hass: HomeAssistantLike | null;
  _loaded: boolean;
  _active: boolean;
  _poolEnabled: boolean;
  _poolNamespace: string;
  _cardsPoolKey: string | null;

  constructor(config: ModeConfig, options: ModeOptions = {}) {
    if (new.target === BaseMode) {
      throw new Error('BaseMode is an abstract class and cannot be instantiated directly');
    }

    this._config = config;
    this._options = options;
    this._container = null;
    this._cards = [];
    this._hass = null;
    this._loaded = false;
    this._active = false;
    this._poolEnabled = config?.enable_card_pool !== false;
    this._poolNamespace = typeof options.poolNamespace === 'string' && options.poolNamespace
      ? options.poolNamespace
      : (typeof config?.body_mode === 'string' && config.body_mode ? config.body_mode : 'mode');
    this._cardsPoolKey = null;
  }

  render(): HTMLElement {
    throw new Error('render() must be implemented by subclass');
  }

  async open(): Promise<void> {
    throw new Error('open() must be implemented by subclass');
  }

  async close(): Promise<void> {
    throw new Error('close() must be implemented by subclass');
  }

  static getStyles(): string {
    throw new Error('getStyles() must be implemented by subclass');
  }

  set hass(hass: HomeAssistantLike | null) {
    this._hass = hass;
    this._updateCardsHass(hass);
  }

  get hass(): HomeAssistantLike | null {
    return this._hass;
  }

  get active(): boolean {
    return this._active;
  }

  get loaded(): boolean {
    return this._loaded;
  }

  async loadCards(configs: ModeCardConfig[]): Promise<void> {
    if (this._loaded || !Array.isArray(configs) || configs.length === 0) {
      this._loaded = true;
      return;
    }

    const poolKey = this._buildCardsPoolKey(configs);
    this._cardsPoolKey = poolKey;

    if (poolKey) {
      const pooledCards = cardPool.acquire(poolKey) as ModeCardElement[] | null;
      if (pooledCards && pooledCards.length === configs.length) {
        this._cards = pooledCards;
        this._updateCardsHass(this._hass);
        this._loaded = true;
        return;
      }
    }

    try {
      const helpers = await this._getCardHelpers();
      this._cards = await Promise.all(
        configs.map((config) => this._createCard(config, helpers))
      );
      this._loaded = true;
    } catch (error) {
      console.error('[UniversalCard] Failed to load cards:', error);
      this._loaded = true;
    }
  }

  async _createCard(config: ModeCardConfig, helpers: ModeCardHelpers | null): Promise<ModeCardElement> {
    try {
      if (!helpers || typeof helpers.createCardElement !== 'function') {
        throw new Error('Card helpers are not available');
      }

      const card = await helpers.createCardElement(config);

      if (this._hass) {
        card.hass = this._hass;
      }

      return card;
    } catch (error) {
      console.error('[UniversalCard] Card creation error:', error);
      return this._createErrorCard(error as Error, config);
    }
  }

  _createErrorCard(error: Error, config: ModeCardConfig): ModeCardElement {
    const card = document.createElement('div') as ModeCardElement;
    card.className = 'uc-error-card';
    card.innerHTML = `
      <div class="error-icon">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </div>
      <div class="error-message">${error.message || 'Error loading card'}</div>
      <button class="error-details-btn" title="View details">?</button>
    `;

    const errorData: ErrorDetails = { error, config, stack: error.stack || null };
    card._errorData = errorData;

    const button = card.querySelector('.error-details-btn');
    button?.addEventListener('click', (event) => {
      event.stopPropagation();
      this._showErrorDetails(errorData);
    });

    return card;
  }

  _showErrorDetails(errorData: ErrorDetails): void {
    const popup = document.createElement('div');
    popup.className = 'uc-error-popup-overlay';
    popup.innerHTML = `
      <div class="uc-error-popup">
        <div class="popup-header">
          <span>Error Details</span>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-content">
          <div class="error-section">
            <strong>Message:</strong>
            <pre>${errorData.error?.message || 'Unknown error'}</pre>
          </div>
          <div class="error-section">
            <strong>Card Config:</strong>
            <pre>${JSON.stringify(errorData.config, null, 2)}</pre>
          </div>
          <div class="error-section">
            <strong>Stack Trace:</strong>
            <pre>${errorData.stack || 'No stack trace available'}</pre>
          </div>
        </div>
      </div>
    `;

    const close = () => popup.remove();
    popup.querySelector('.popup-close')?.addEventListener('click', close);
    popup.addEventListener('click', (event) => {
      if (event.target === popup) {
        close();
      }
    });

    document.body.appendChild(popup);
  }

  async _getCardHelpers(): Promise<ModeCardHelpers | null> {
    const loadCardHelpers = (window as Window & {
      loadCardHelpers?: () => Promise<ModeCardHelpers>;
    }).loadCardHelpers;

    if (typeof loadCardHelpers === 'function') {
      return await loadCardHelpers();
    }

    return new Promise((resolve) => {
      const check = setInterval(() => {
        const retry = (window as Window & {
          loadCardHelpers?: () => Promise<ModeCardHelpers>;
        }).loadCardHelpers;

        if (typeof retry === 'function') {
          clearInterval(check);
          retry().then(resolve);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(check);
        resolve(null);
      }, 10000);
    });
  }

  _updateCardsHass(hass: HomeAssistantLike | null): void {
    this._cards.forEach((card) => {
      if (!card || !('hass' in card)) {
        return;
      }

      try {
        card.hass = hass;
      } catch {
        // Ignore hass update failures from nested cards.
      }
    });
  }

  _appendCards(container: HTMLElement, configs: ModeCardConfig[] = []): void {
    const fragment = document.createDocumentFragment();

    this._cards.forEach((card, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';

      const config = configs[index];
      if (config) {
        const colspan = config.colspan || (config.card_options && config.card_options.colspan);
        const rowspan = config.rowspan || (config.card_options && config.card_options.rowspan);

        if (colspan) {
          wrapper.style.gridColumn = 'span ' + colspan;
        }
        if (rowspan) {
          wrapper.style.gridRow = 'span ' + rowspan;
        }
      }

      wrapper.appendChild(card);
      fragment.appendChild(wrapper);
    });

    container.appendChild(fragment);
  }

  _animate(element: HTMLElement, animation: string, duration = 300): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add(animation);

      setTimeout(() => {
        element.classList.remove(animation);
        resolve();
      }, duration);
    });
  }

  _waitForTransition(element: HTMLElement, timeout = 500): Promise<void> {
    return new Promise((resolve) => {
      const handler = () => {
        element.removeEventListener('transitionend', handler);
        resolve();
      };

      element.addEventListener('transitionend', handler);
      setTimeout(resolve, timeout);
    });
  }

  destroy(): void {
    if (this._poolEnabled && this._cardsPoolKey && this._cards.length > 0) {
      cardPool.release(this._cardsPoolKey, this._cards, this._getPoolReleaseOptions());
    }

    this._cards = [];
    this._container = null;
    this._loaded = false;
    this._active = false;
    this._cardsPoolKey = null;
  }

  _buildCardsPoolKey(configs: ModeCardConfig[]): string | null {
    if (!this._poolEnabled || !Array.isArray(configs) || configs.length === 0) {
      return null;
    }

    const scope = this._resolvePoolScope();
    const scopeToken = this._getPoolScopeToken(scope);
    if (!scopeToken) {
      return null;
    }

    let serialized: string;
    try {
      serialized = JSON.stringify(configs);
    } catch {
      return null;
    }

    const rawKey = `${scopeToken}:${this._poolNamespace}:${serialized}`;
    return `uc-mode-pool:${scope}:${this._poolNamespace}:${this._hashString(rawKey)}`;
  }

  _hashString(input: string): string {
    let hash = 0;
    for (let index = 0; index < input.length; index += 1) {
      hash = ((hash << 5) - hash) + input.charCodeAt(index);
      hash |= 0;
    }
    return String(Math.abs(hash));
  }

  _resolvePoolScope(): PoolScope {
    const scope = this._config?.pool_scope;
    if (scope === 'dashboard' || scope === 'global' || scope === 'card') {
      return scope;
    }
    return DEFAULTS.pool_scope || 'card';
  }

  _getPoolScopeToken(scope: PoolScope): string | null {
    if (scope === 'global') {
      return 'global';
    }

    if (scope === 'dashboard') {
      const pathname = typeof window !== 'undefined' ? (window.location?.pathname || '') : '';
      const search = typeof window !== 'undefined' ? (window.location?.search || '') : '';
      const token = `${pathname}${search || ''}` || 'default';
      return `dashboard:${token}`;
    }

    const cardId = this._config?.card_id;
    if (!cardId) {
      return null;
    }
    return `card:${cardId}`;
  }

  _normalizePoolNumber(value: number | undefined, fallback: number, min: number, max: number): number {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, Math.floor(numericValue)));
  }

  _getPoolReleaseOptions(): { scope: PoolScope; maxAgeMs: number; maxEntries: number } {
    return {
      scope: this._resolvePoolScope(),
      maxAgeMs: this._normalizePoolNumber(
        this._config?.pool_ttl_ms,
        DEFAULTS.pool_ttl_ms,
        LIMITS.POOL_MIN_TTL_MS,
        LIMITS.POOL_MAX_TTL_MS
      ),
      maxEntries: this._normalizePoolNumber(
        this._config?.pool_max_entries,
        DEFAULTS.pool_max_entries,
        LIMITS.POOL_MIN_MAX_ENTRIES,
        LIMITS.POOL_MAX_MAX_ENTRIES
      )
    };
  }

  _getThemeVarSourceElement(): HTMLElement | null {
    const card = this._options?.card;
    const cardRoot = (card as { shadowRoot?: ShadowRoot | null } | null | undefined)?.shadowRoot?.querySelector('.universal-card');
    if (cardRoot instanceof HTMLElement) {
      return cardRoot;
    }
    if (card instanceof HTMLElement) {
      return card;
    }
    return null;
  }

  _applyThemeVariables(target: HTMLElement): void {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const source = this._getThemeVarSourceElement();
    if (!(source instanceof HTMLElement)) {
      return;
    }

    const computed = getComputedStyle(source);
    const vars = [
      '--ha-card-background',
      '--card-background-color',
      '--ha-card-box-shadow',
      '--ha-card-border-radius',
      '--primary-color',
      '--primary-text-color',
      '--secondary-text-color',
      '--divider-color',
      '--secondary-background-color'
    ];

    vars.forEach((name) => {
      const value = computed.getPropertyValue(name);
      if (value && value.trim()) {
        target.style.setProperty(name, value.trim());
      }
    });
  }
}

export default BaseMode;
