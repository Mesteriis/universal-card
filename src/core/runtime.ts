// @ts-check
/**
 * Universal Card - Shared Runtime Services
 *
 * Shared services used by all card instances:
 * - RuntimeEventHub: one set of global listeners for all cards
 * - SharedStateStore: in-memory cache + batched localStorage writes
 *
 * @module core/runtime
 */

import { EVENTS, LIMITS, PERF_BUDGETS } from './constants.js';
import { throttle } from '../utils/performance.js';

type RuntimeCard = {
  _config?: { card_id?: string };
  isConnected?: boolean;
  _handleExternalControl?: (event: any) => void;
  _resizeHandler?: (((...args: any[]) => void) & { cancel?: () => void }) | undefined;
};

type CancellableHandler = ((...args: any[]) => void) & { cancel?: () => void };

type PoolEntry = {
  cards: HTMLElement[];
  timestamp: number;
  scope: string;
  maxAgeMs: number;
  maxEntries: number;
};

type PoolReleaseOptions = {
  scope?: string;
  maxAgeMs?: number;
  maxEntries?: number;
};

class RuntimeEventHub {
  _cards: Set<RuntimeCard>;
  _cardsById: Map<string, Set<RuntimeCard>>;
  _listening: boolean;
  _boundControlHandler: (event: any) => void;
  _boundResizeHandler: CancellableHandler;

  constructor() {
    this._cards = new Set();
    this._cardsById = new Map();
    this._listening = false;

    this._boundControlHandler = this._handleControl.bind(this);
    this._boundResizeHandler = throttle(
      () => this._handleResize(),
      LIMITS.RESIZE_DEBOUNCE_MS
    ) as CancellableHandler;
  }

  register(card: RuntimeCard) {
    if (!card || this._cards.has(card)) return;

    this._cards.add(card);
    this._indexCard(card, card._config?.card_id);

    if (!this._listening) {
      this._attachListeners();
    }
  }

  unregister(card: RuntimeCard | null) {
    if (!card || !this._cards.has(card)) return;

    this._cards.delete(card);
    this._deindexCard(card, card._config?.card_id);

    if (this._cards.size === 0) {
      this._detachListeners();
    }
  }

  updateCardId(card: RuntimeCard | null, prevCardId?: string, nextCardId?: string) {
    if (!card || !this._cards.has(card) || prevCardId === nextCardId) return;

    this._deindexCard(card, prevCardId);
    this._indexCard(card, nextCardId);
  }

  _attachListeners() {
    window.addEventListener(EVENTS.CARD_CONTROL, this._boundControlHandler);
    window.addEventListener('resize', this._boundResizeHandler);
    this._listening = true;
  }

  _detachListeners() {
    if (!this._listening) return;

    window.removeEventListener(EVENTS.CARD_CONTROL, this._boundControlHandler);
    window.removeEventListener('resize', this._boundResizeHandler);

    if (typeof this._boundResizeHandler.cancel === 'function') {
      this._boundResizeHandler.cancel();
    }

    this._listening = false;
  }

  _handleControl(event: any) {
    const targetCardId = event?.detail?.card_id;

    if (targetCardId) {
      const bucket = this._cardsById.get(targetCardId);
      if (!bucket) return;

      bucket.forEach((card) => {
        if (card?.isConnected) {
          card._handleExternalControl(event);
        }
      });
      return;
    }

    this._cards.forEach((card) => {
      if (card?.isConnected) {
        card._handleExternalControl(event);
      }
    });
  }

  _handleResize() {
    this._cards.forEach((card) => {
      if (!card?.isConnected) return;
      if (typeof card._resizeHandler === 'function') {
        card._resizeHandler();
      }
    });
  }

  _indexCard(card: RuntimeCard, cardId?: string) {
    if (!cardId) return;

    let bucket = this._cardsById.get(cardId);
    if (!bucket) {
      bucket = new Set();
      this._cardsById.set(cardId, bucket);
    }

    bucket.add(card);
  }

  _deindexCard(card: RuntimeCard, cardId?: string) {
    if (!cardId) return;

    const bucket = this._cardsById.get(cardId);
    if (!bucket) return;

    bucket.delete(card);
    if (bucket.size === 0) {
      this._cardsById.delete(cardId);
    }
  }
}

class SharedStateStore {
  _cache: Map<string, any>;
  _dirty: Map<string, any>;
  _flushTimer: ReturnType<typeof setTimeout> | null;
  _flushDelayMs: number;

  constructor() {
    this._cache = new Map();
    this._dirty = new Map();
    this._flushTimer = null;
    this._flushDelayMs = 200;
  }

  get(key: string, fallbackValue: any = null) {
    if (!key) return fallbackValue;

    if (this._cache.has(key)) {
      return this._cache.get(key);
    }

    let value = fallbackValue;

    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        value = JSON.parse(raw);
      }
    } catch {
      value = fallbackValue;
    }

    this._cache.set(key, value);
    return value;
  }

  set(key: string, value: any) {
    if (!key) return;

    this._cache.set(key, value);
    this._dirty.set(key, value);
    this._scheduleFlush();
  }

  _scheduleFlush() {
    if (this._flushTimer !== null) return;

    this._flushTimer = setTimeout(() => {
      this._flush();
    }, this._flushDelayMs);
  }

  _flush() {
    this._flushTimer = null;

    if (this._dirty.size === 0) return;

    this._dirty.forEach((value, key) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Ignore storage errors per key.
      }
    });

    this._dirty.clear();
  }
}

class CardPool {
  _entries: Map<string, PoolEntry>;
  _defaultMaxEntries: number;
  _defaultMaxAgeMs: number;
  _hardMaxEntries: number;
  _hits: number;
  _misses: number;

  constructor() {
    this._entries = new Map();
    this._defaultMaxEntries = LIMITS.CARD_POOL_MAX_ENTRIES;
    this._defaultMaxAgeMs = LIMITS.CARD_POOL_MAX_AGE_MS;
    this._hardMaxEntries = Math.max(
      this._defaultMaxEntries,
      LIMITS.CARD_POOL_HARD_MAX_ENTRIES || this._defaultMaxEntries
    );
    this._hits = 0;
    this._misses = 0;
  }

  acquire(key: string) {
    if (!key) return null;

    this._pruneExpired();

    const entry = this._entries.get(key);
    if (!entry) {
      this._misses += 1;
      return null;
    }

    this._entries.delete(key);
    const cards = entry.cards.filter((card) => card instanceof HTMLElement);
    if (cards.length === 0) {
      this._misses += 1;
      return null;
    }

    this._hits += 1;
    return cards;
  }

  release(key: string, cards: HTMLElement[], options: PoolReleaseOptions = {}) {
    if (!key || !Array.isArray(cards) || cards.length === 0) return;

    this._pruneExpired();

    const detachedCards = cards.filter((card) => card instanceof HTMLElement);
    if (detachedCards.length === 0) return;

    detachedCards.forEach((card) => {
      if (card.parentElement) {
        card.parentElement.removeChild(card);
      }
    });

    const scope = this._normalizeScope(options.scope);
    const maxAgeMs = this._normalizeNumber(
      options.maxAgeMs,
      this._defaultMaxAgeMs,
      LIMITS.POOL_MIN_TTL_MS,
      LIMITS.POOL_MAX_TTL_MS
    );
    const maxEntries = this._normalizeNumber(
      options.maxEntries,
      this._defaultMaxEntries,
      LIMITS.POOL_MIN_MAX_ENTRIES,
      LIMITS.POOL_MAX_MAX_ENTRIES
    );

    this._entries.delete(key);
    this._entries.set(key, {
      cards: detachedCards,
      timestamp: Date.now(),
      scope,
      maxAgeMs,
      maxEntries
    });

    this._pruneToScopeLimit(scope, maxEntries);
    this._pruneToHardLimit();
  }

  invalidate(key) {
    if (!key) return;
    this._entries.delete(key);
  }

  clear() {
    this._entries.clear();
  }

  getStats() {
    const byScope = {};
    this._entries.forEach((entry) => {
      const scope = entry?.scope || 'card';
      byScope[scope] = (byScope[scope] || 0) + 1;
    });

    return {
      size: this._entries.size,
      hits: this._hits,
      misses: this._misses,
      byScope
    };
  }

  _pruneExpired() {
    const now = Date.now();
    this._entries.forEach((entry, key) => {
      const maxAgeMs = this._normalizeNumber(
        entry?.maxAgeMs,
        this._defaultMaxAgeMs,
        LIMITS.POOL_MIN_TTL_MS,
        LIMITS.POOL_MAX_TTL_MS
      );
      if (!entry || now - entry.timestamp > maxAgeMs) {
        this._entries.delete(key);
      }
    });
  }

  _pruneToHardLimit() {
    while (this._entries.size > this._hardMaxEntries) {
      const oldestKey = this._entries.keys().next().value;
      if (!oldestKey) break;
      this._entries.delete(oldestKey);
    }
  }

  _pruneToScopeLimit(scope, maxEntries) {
    if (!scope || !Number.isFinite(maxEntries)) return;

    let scopeCount = 0;
    this._entries.forEach((entry) => {
      if ((entry?.scope || 'card') === scope) {
        scopeCount += 1;
      }
    });

    while (scopeCount > maxEntries) {
      const oldestScopeKey = this._findOldestKeyByScope(scope);
      if (!oldestScopeKey) break;
      this._entries.delete(oldestScopeKey);
      scopeCount -= 1;
    }
  }

  _findOldestKeyByScope(scope) {
    for (const [key, entry] of this._entries.entries()) {
      if ((entry?.scope || 'card') === scope) {
        return key;
      }
    }
    return null;
  }

  _normalizeScope(scope) {
    if (scope === 'dashboard' || scope === 'global') {
      return scope;
    }
    return 'card';
  }

  _normalizeNumber(value, fallback, min, max) {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    const normalized = Math.floor(num);
    return Math.min(max, Math.max(min, normalized));
  }
}

class PerformanceBudgetTracker {
  _metrics: Map<string, Array<Record<string, any>>>;
  _budgets: Record<string, number>;
  _historyLimit: number;

  constructor() {
    this._metrics = new Map();
    this._budgets = {
      tti: PERF_BUDGETS.TTI_MS,
      render: PERF_BUDGETS.RENDER_MS,
      update: PERF_BUDGETS.UPDATE_MS,
      body_load: PERF_BUDGETS.BODY_LOAD_MS
    };
    this._historyLimit = LIMITS.METRICS_HISTORY_SIZE;
  }

  record(type, durationMs, meta = {}) {
    if (!type || !Number.isFinite(durationMs)) return;

    const bucket = this._ensureBucket(type);
    const sample = {
      type,
      durationMs,
      timestamp: Date.now(),
      ...meta
    };

    bucket.push(sample);
    if (bucket.length > this._historyLimit) {
      bucket.shift();
    }

    const budget = this._budgets[type];
    if (Number.isFinite(budget) && durationMs > budget) {
      console.warn(
        `[UniversalCard][perf] ${type} ${durationMs.toFixed(1)}ms > ${budget}ms`,
        meta
      );
    }

    try {
      window.dispatchEvent(
        new CustomEvent('universal-card-performance', { detail: sample })
      );
    } catch {
      // Ignore event dispatch errors.
    }
  }

  getStats(type) {
    const samples = this._metrics.get(type) || [];
    if (samples.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0, samples: [] };
    }

    let min = Infinity;
    let max = 0;
    let total = 0;

    samples.forEach((sample) => {
      const value = sample.durationMs;
      min = Math.min(min, value);
      max = Math.max(max, value);
      total += value;
    });

    return {
      count: samples.length,
      min,
      max,
      avg: total / samples.length,
      samples: [...samples]
    };
  }

  snapshot() {
    const result = {};
    this._metrics.forEach((_, type) => {
      result[type] = this.getStats(type);
    });
    return result;
  }

  _ensureBucket(type) {
    let bucket = this._metrics.get(type);
    if (!bucket) {
      bucket = [];
      this._metrics.set(type, bucket);
    }
    return bucket;
  }
}

export const runtimeEventHub = new RuntimeEventHub();
export const sharedStateStore = new SharedStateStore();
export const cardPool = new CardPool();
export const performanceBudgetTracker = new PerformanceBudgetTracker();
