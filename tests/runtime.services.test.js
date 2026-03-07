import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EVENTS } from '../src/core/constants.js';
import {
  cardPool,
  performanceBudgetTracker,
  runtimeEventHub,
  sharedStateStore
} from '../src/core/runtime.js';
import { installDomEnvironment } from './helpers/manual-dom.js';

function installLocalStorageMock() {
  const store = new Map();
  const mock = {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(String(key));
    },
    clear() {
      store.clear();
    }
  };

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: mock
  });
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: mock
  });
}

describe('runtime services', () => {
  let teardownDom;

  beforeEach(() => {
    teardownDom = installDomEnvironment();
    installLocalStorageMock();
    cardPool.clear();
    localStorage.clear();
    runtimeEventHub._cards.clear();
    runtimeEventHub._cardsById.clear();
    runtimeEventHub._detachListeners();
  });

  afterEach(() => {
    runtimeEventHub._detachListeners();
    vi.useRealTimers();
    teardownDom?.();
    teardownDom = null;
  });

  it('runtimeEventHub routes control events to targeted card_id', () => {
    const cardA = {
      _config: { card_id: 'a' },
      isConnected: true,
      _handleExternalControl: vi.fn(),
      _resizeHandler: vi.fn()
    };
    const cardB = {
      _config: { card_id: 'b' },
      isConnected: true,
      _handleExternalControl: vi.fn(),
      _resizeHandler: vi.fn()
    };

    runtimeEventHub.register(cardA);
    runtimeEventHub.register(cardB);

    window.dispatchEvent(new CustomEvent(EVENTS.CARD_CONTROL, {
      detail: { card_id: 'a', action: 'expand' }
    }));

    expect(cardA._handleExternalControl).toHaveBeenCalledTimes(1);
    expect(cardB._handleExternalControl).not.toHaveBeenCalled();
  });

  it('runtimeEventHub broadcasts controls and resize to connected cards', () => {
    const connectedCard = {
      _config: { card_id: 'c' },
      isConnected: true,
      _handleExternalControl: vi.fn(),
      _resizeHandler: vi.fn()
    };
    const disconnectedCard = {
      _config: { card_id: 'd' },
      isConnected: false,
      _handleExternalControl: vi.fn(),
      _resizeHandler: vi.fn()
    };

    runtimeEventHub.register(connectedCard);
    runtimeEventHub.register(disconnectedCard);

    window.dispatchEvent(new CustomEvent(EVENTS.CARD_CONTROL, { detail: { action: 'toggle' } }));
    window.dispatchEvent(new Event('resize'));

    expect(connectedCard._handleExternalControl).toHaveBeenCalledTimes(1);
    expect(disconnectedCard._handleExternalControl).not.toHaveBeenCalled();
    expect(connectedCard._resizeHandler).toHaveBeenCalledTimes(1);
    expect(disconnectedCard._resizeHandler).not.toHaveBeenCalled();
  });

  it('runtimeEventHub supports card_id reindex and unregister cleanup', () => {
    const card = {
      _config: { card_id: 'old-id' },
      isConnected: true,
      _handleExternalControl: vi.fn(),
      _resizeHandler: vi.fn()
    };

    runtimeEventHub.register(card);
    runtimeEventHub.updateCardId(card, 'old-id', 'new-id');

    window.dispatchEvent(new CustomEvent(EVENTS.CARD_CONTROL, {
      detail: { card_id: 'old-id', action: 'collapse' }
    }));
    expect(card._handleExternalControl).not.toHaveBeenCalled();

    window.dispatchEvent(new CustomEvent(EVENTS.CARD_CONTROL, {
      detail: { card_id: 'new-id', action: 'collapse' }
    }));
    expect(card._handleExternalControl).toHaveBeenCalledTimes(1);

    runtimeEventHub.unregister(card);
    expect(runtimeEventHub._listening).toBe(false);
  });

  it('runtimeEventHub handles guard branches and missing targets', () => {
    expect(() => runtimeEventHub.unregister(null)).not.toThrow();
    expect(() => runtimeEventHub.updateCardId(null, 'a', 'b')).not.toThrow();
    expect(() => runtimeEventHub._detachListeners()).not.toThrow();

    const card = {
      _config: { card_id: 'guard-id' },
      isConnected: true,
      _handleExternalControl: vi.fn()
    };

    runtimeEventHub.register(card);
    runtimeEventHub.register(card);
    runtimeEventHub.updateCardId(card, 'guard-id', 'guard-id');

    window.dispatchEvent(new CustomEvent(EVENTS.CARD_CONTROL, {
      detail: { card_id: 'missing-id', action: 'toggle' }
    }));

    runtimeEventHub._handleResize();
    runtimeEventHub.unregister(card);
    runtimeEventHub.unregister(card);

    expect(card._handleExternalControl).not.toHaveBeenCalled();
    expect(runtimeEventHub._listening).toBe(false);
  });

  it('cardPool releases and acquires cards, detaching from DOM', () => {
    const parent = document.createElement('div');
    const card = document.createElement('div');
    parent.appendChild(card);
    document.body.appendChild(parent);

    cardPool.release('k1', [card], { scope: 'card' });

    expect(card.parentElement).toBeNull();

    const acquired = cardPool.acquire('k1');
    expect(acquired).toHaveLength(1);
    expect(acquired[0]).toBe(card);
  });

  it('cardPool tracks misses on absent keys', () => {
    const before = cardPool.getStats();
    const result = cardPool.acquire('unknown-key');
    const after = cardPool.getStats();

    expect(result).toBeNull();
    expect(after.misses).toBe(before.misses + 1);
  });

  it('cardPool counts miss when stored entry has no HTMLElements', () => {
    cardPool._entries.set('broken-entry', {
      cards: [{}],
      timestamp: Date.now(),
      scope: 'card',
      maxAgeMs: 60000,
      maxEntries: 10
    });

    expect(cardPool.acquire('broken-entry')).toBeNull();
  });

  it('cardPool ignores invalid release arguments', () => {
    expect(() => cardPool.release('', [document.createElement('div')])).not.toThrow();
    expect(() => cardPool.release('invalid-cards', [{}])).not.toThrow();
    expect(cardPool.getStats().size).toBe(0);
  });

  it('cardPool invalidate and clear remove stored entries', () => {
    const card = document.createElement('div');
    cardPool.release('inv-key', [card], { scope: 'card' });
    expect(cardPool.getStats().size).toBe(1);

    cardPool.invalidate('inv-key');
    expect(cardPool.getStats().size).toBe(0);

    cardPool.release('k1', [document.createElement('div')], { scope: 'global' });
    cardPool.release('k2', [document.createElement('div')], { scope: 'global' });
    expect(cardPool.getStats().size).toBe(2);
    cardPool.clear();
    expect(cardPool.getStats().size).toBe(0);
  });

  it('cardPool enforces hard max and handles missing scope lookup', () => {
    const prevHard = cardPool._hardMaxEntries;
    cardPool._hardMaxEntries = 1;

    cardPool.release('hard-a', [document.createElement('div')], { scope: 'global' });
    cardPool.release('hard-b', [document.createElement('div')], { scope: 'global' });

    expect(cardPool.getStats().size).toBe(1);
    expect(cardPool._findOldestKeyByScope('missing-scope')).toBeNull();

    cardPool._hardMaxEntries = prevHard;
  });

  it('cardPool applies scope-specific max entries', () => {
    const makeCard = (id) => {
      const el = document.createElement('div');
      el.dataset.id = id;
      return el;
    };

    cardPool.release('scope-a', [makeCard('a')], { scope: 'dashboard', maxEntries: 2 });
    cardPool.release('scope-b', [makeCard('b')], { scope: 'dashboard', maxEntries: 2 });
    cardPool.release('scope-c', [makeCard('c')], { scope: 'dashboard', maxEntries: 2 });

    const stats = cardPool.getStats();
    expect(stats.byScope.dashboard).toBe(2);
    expect(stats.size).toBe(2);
  });

  it('cardPool expires entries by ttl', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

    const card = document.createElement('div');
    cardPool.release('ttl-key', [card], { scope: 'global', maxAgeMs: 1000 });

    vi.setSystemTime(new Date('2026-01-01T00:00:02.000Z'));
    const acquired = cardPool.acquire('ttl-key');

    expect(acquired).toBeNull();

    vi.useRealTimers();
  });

  it('sharedStateStore flushes dirty values to localStorage', () => {
    vi.useFakeTimers();

    sharedStateStore.set('uc:test:key', { ok: true });
    expect(localStorage.getItem('uc:test:key')).toBeNull();

    vi.advanceTimersByTime(250);

    expect(JSON.parse(localStorage.getItem('uc:test:key'))).toEqual({ ok: true });
    expect(sharedStateStore.get('uc:test:key')).toEqual({ ok: true });

    vi.useRealTimers();
  });

  it('sharedStateStore handles cache hit and malformed JSON fallback', () => {
    localStorage.setItem('uc:bad-json', '{');

    const fallback = { safe: true };
    const first = sharedStateStore.get('uc:bad-json', fallback);
    const second = sharedStateStore.get('uc:bad-json', null);
    const emptyKey = sharedStateStore.get('', 'x');

    expect(first).toEqual(fallback);
    expect(second).toEqual(fallback);
    expect(emptyKey).toBe('x');

    expect(() => sharedStateStore.set('', { ignored: true })).not.toThrow();
  });

  it('sharedStateStore survives localStorage write errors', () => {
    vi.useFakeTimers();

    const failingStorage = {
      ...localStorage,
      setItem() {
        throw new Error('quota');
      }
    };

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: failingStorage
    });
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: failingStorage
    });

    expect(() => sharedStateStore.set('uc:quota:key', { ok: true })).not.toThrow();
    expect(() => vi.advanceTimersByTime(300)).not.toThrow();

    installLocalStorageMock();
    vi.useRealTimers();
  });

  it('performanceBudgetTracker records samples and emits events', () => {
    const startCount = performanceBudgetTracker.getStats('render').count;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onPerf = vi.fn();

    window.addEventListener('universal-card-performance', onPerf);
    performanceBudgetTracker.record('render', 50, { source: 'test' });
    window.removeEventListener('universal-card-performance', onPerf);

    const stats = performanceBudgetTracker.getStats('render');
    expect(stats.count).toBe(startCount + 1);
    expect(stats.max).toBeGreaterThanOrEqual(50);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(onPerf).toHaveBeenCalledTimes(1);
    expect(onPerf.mock.calls[0][0].detail).toMatchObject({
      type: 'render',
      durationMs: 50,
      source: 'test'
    });

    warnSpy.mockRestore();
  });

  it('performanceBudgetTracker returns empty stats and keeps custom type without budget warnings', () => {
    const empty = performanceBudgetTracker.getStats('never-recorded-type');
    expect(empty).toEqual({
      count: 0,
      min: 0,
      max: 0,
      avg: 0,
      samples: []
    });

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    performanceBudgetTracker.record('custom_metric', 5, { source: 'custom' });
    const snapshot = performanceBudgetTracker.snapshot();

    expect(snapshot.custom_metric.count).toBeGreaterThanOrEqual(1);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('performanceBudgetTracker trims history over configured limit', () => {
    const previousLimit = performanceBudgetTracker._historyLimit;
    performanceBudgetTracker._historyLimit = 2;

    performanceBudgetTracker.record('trim_metric', 1);
    performanceBudgetTracker.record('trim_metric', 2);
    performanceBudgetTracker.record('trim_metric', 3);

    const stats = performanceBudgetTracker.getStats('trim_metric');
    expect(stats.count).toBe(2);
    expect(stats.min).toBe(2);
    expect(stats.max).toBe(3);

    performanceBudgetTracker._historyLimit = previousLimit;
  });

  it('performanceBudgetTracker handles invalid samples and dispatch errors', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => {
      throw new Error('dispatch fail');
    });

    expect(() => performanceBudgetTracker.record('', 10)).not.toThrow();
    expect(() => performanceBudgetTracker.record('render', Number.NaN)).not.toThrow();
    expect(() => performanceBudgetTracker.record('render', 20)).not.toThrow();

    dispatchSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
