import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { cardPool } from '../src/core/runtime.js';
import { BaseMode } from '../src/modes/BaseMode.js';
import { installDomEnvironment } from './helpers/manual-dom.js';

class TestMode extends BaseMode {
  render() {
    this._container = document.createElement('div');
    return this._container;
  }

  async open() {
    this._active = true;
  }

  async close() {
    this._active = false;
  }

  static getStyles() {
    return '';
  }
}

function createConfig(overrides = {}) {
  return {
    card_id: 'test-card-id',
    body_mode: 'expand',
    enable_card_pool: true,
    pool_scope: 'card',
    pool_ttl_ms: 120000,
    pool_max_entries: 32,
    ...overrides
  };
}

describe('BaseMode pooling and loading', () => {
  let teardownDom;

  beforeEach(() => {
    teardownDom = installDomEnvironment();
    cardPool.clear();
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = null;
  });

  it('loads cards via helpers and applies hass', async () => {
    const mode = new TestMode(createConfig());
    mode.hass = { states: {} };
    mode._getCardHelpers = async () => ({
      createCardElement: async (cfg) => {
        const card = document.createElement('div');
        card.dataset.type = cfg.type;
        return card;
      }
    });

    await mode.loadCards([{ type: 'a' }, { type: 'b' }]);

    expect(mode.loaded).toBe(true);
    expect(mode._cards).toHaveLength(2);
    expect(mode._cards[0].dataset.type).toBe('a');
    expect(mode._cards[0].hass).toEqual({ states: {} });
  });

  it('reuses pooled cards on next mode instance', async () => {
    const configs = [{ type: 'markdown', content: 'x' }];

    const first = new TestMode(createConfig());
    first._getCardHelpers = async () => ({
      createCardElement: async () => document.createElement('div')
    });
    await first.loadCards(configs);
    first.destroy();

    const second = new TestMode(createConfig());
    second._getCardHelpers = async () => {
      throw new Error('helpers should not be called when pool hit');
    };

    await second.loadCards(configs);

    expect(second.loaded).toBe(true);
    expect(second._cards).toHaveLength(1);
  });

  it('deduplicates concurrent loadCards calls', async () => {
    const mode = new TestMode(createConfig());
    const createCardElement = vi.fn(async () => {
      await Promise.resolve();
      return document.createElement('div');
    });

    mode._getCardHelpers = async () => ({ createCardElement });

    await Promise.all([
      mode.loadCards([{ type: 'markdown', content: 'x' }]),
      mode.loadCards([{ type: 'markdown', content: 'x' }])
    ]);

    expect(createCardElement).toHaveBeenCalledTimes(1);
    expect(mode._cards).toHaveLength(1);
  });

  it('builds scope-aware pool keys', () => {
    const configs = [{ type: 'markdown', content: 'x' }];

    const cardScope = new TestMode(createConfig({ pool_scope: 'card' }));
    const dashboardScope = new TestMode(createConfig({ pool_scope: 'dashboard' }));
    const globalScope = new TestMode(createConfig({ pool_scope: 'global' }));

    expect(cardScope._buildCardsPoolKey(configs)).toMatch(/^uc-mode-pool:card:/);
    expect(dashboardScope._buildCardsPoolKey(configs)).toMatch(/^uc-mode-pool:dashboard:/);
    expect(globalScope._buildCardsPoolKey(configs)).toMatch(/^uc-mode-pool:global:/);
  });

  it('returns null pool key when pooling disabled', () => {
    const mode = new TestMode(createConfig({ enable_card_pool: false }));
    const key = mode._buildCardsPoolKey([{ type: 'markdown' }]);
    expect(key).toBeNull();
  });

  it('destroy releases loaded cards back to pool and resets state', async () => {
    const mode = new TestMode(createConfig({ pool_scope: 'global' }));
    mode._getCardHelpers = async () => ({
      createCardElement: async () => document.createElement('div')
    });

    await mode.loadCards([{ type: 'entities', entities: [] }]);
    mode.render();

    const before = cardPool.getStats().size;
    mode.destroy();
    const after = cardPool.getStats().size;

    expect(after).toBeGreaterThanOrEqual(before + 1);
    expect(mode._cards).toEqual([]);
    expect(mode._container).toBeNull();
    expect(mode.loaded).toBe(false);
    expect(mode.active).toBe(false);
  });
});
