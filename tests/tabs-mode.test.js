import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { cardPool } from '../src/core/runtime.js';
import { TabsMode } from '../src/modes/TabsMode.js';
import { installDomEnvironment } from './helpers/manual-dom.js';

function createTabsConfig(overrides = {}) {
  return {
    card_id: 'tabs-card',
    body_mode: 'tabs',
    enable_card_pool: true,
    pool_scope: 'card',
    pool_ttl_ms: 120000,
    pool_max_entries: 32,
    skeleton_count: 1,
    tabs: [
      {
        label: 'First',
        icon: 'mdi:numeric-1',
        cards: [{ type: 'markdown', content: 'one' }]
      },
      {
        label: 'Second',
        icon: 'mdi:numeric-2',
        cards: [{ type: 'markdown', content: 'two' }]
      }
    ],
    ...overrides
  };
}

function attachMockHelpers(mode) {
  let index = 0;
  mode._getCardHelpers = async () => ({
    createCardElement: async () => {
      const card = document.createElement('div');
      card.className = 'mock-card';
      card.dataset.mockId = String(index++);
      card.hass = null;
      return card;
    }
  });

  return () => index;
}

describe('TabsMode', () => {
  let teardownDom;

  beforeEach(() => {
    teardownDom = installDomEnvironment();
    cardPool.clear();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = null;
  });

  it('renders tabs, panels, and initial skeleton', () => {
    const mode = new TabsMode(createTabsConfig());
    const container = mode.render();

    expect(container.querySelectorAll('.tab-button')).toHaveLength(2);
    expect(container.querySelectorAll('.tab-panel')).toHaveLength(2);
    expect(container.querySelector('.tab-panel.active')).not.toBeNull();
    expect(container.querySelector('.skeleton-container')).not.toBeNull();
  });

  it('opens and lazily loads active tab cards', async () => {
    const onTabChange = vi.fn();
    const mode = new TabsMode(createTabsConfig(), { onTabChange });
    attachMockHelpers(mode);

    document.body.appendChild(mode.render());
    await mode.open();

    const firstGrid = document.querySelector('.tab-panel[data-index="0"] .tab-grid');
    expect(mode._loadedTabs[0]).toBe(true);
    expect(firstGrid.querySelectorAll('.card-wrapper')).toHaveLength(1);
    expect(onTabChange).toHaveBeenCalledWith(0);
  });

  it('switches tabs, fires callback, and loads target tab cards', async () => {
    const onTabChange = vi.fn();
    const mode = new TabsMode(createTabsConfig(), { onTabChange });
    attachMockHelpers(mode);

    document.body.appendChild(mode.render());
    await mode.open();
    await mode._selectTab(1);

    const secondGrid = document.querySelector('.tab-panel[data-index="1"] .tab-grid');
    expect(mode._loadedTabs[1]).toBe(true);
    expect(secondGrid.querySelectorAll('.card-wrapper')).toHaveLength(1);
    expect(onTabChange).toHaveBeenCalledWith(1);
  });

  it('ignores invalid or same-index tab selection', async () => {
    const onTabChange = vi.fn();
    const mode = new TabsMode(createTabsConfig(), { onTabChange });
    attachMockHelpers(mode);

    document.body.appendChild(mode.render());
    await mode.open();

    await mode._selectTab(0);
    await mode._selectTab(-1);
    await mode._selectTab(999);

    // Called only once from open() with initial tab.
    expect(onTabChange).toHaveBeenCalledTimes(1);
    expect(onTabChange).toHaveBeenCalledWith(0);
  });

  it('reuses pooled tab cards on next instance', async () => {
    const config = createTabsConfig({ pool_scope: 'global' });

    const first = new TabsMode(config);
    attachMockHelpers(first);
    document.body.appendChild(first.render());
    await first.open();
    first.destroy();

    const second = new TabsMode(config);
    second._getCardHelpers = async () => {
      throw new Error('helpers should not be called on pool hit');
    };
    document.body.appendChild(second.render());

    await expect(second.open()).resolves.toBeUndefined();
    expect(second._tabCards[0]).toHaveLength(1);
  });

  it('returns null pool key when card_id is missing', () => {
    const mode = new TabsMode(createTabsConfig({ card_id: '' }));
    const key = mode._getTabPoolKey(0, [{ type: 'markdown', content: 'x' }]);
    expect(key).toBeNull();
  });

  it('returns null pool key when cards cannot be serialized', () => {
    const mode = new TabsMode(createTabsConfig());
    const circular = {};
    circular.self = circular;
    const key = mode._getTabPoolKey(0, [circular]);
    expect(key).toBeNull();
  });

  it('applies colspan and rowspan styles when mounting tab cards', () => {
    const mode = new TabsMode(createTabsConfig());
    const container = mode.render();
    document.body.appendChild(container);

    const card = document.createElement('div');
    mode._tabCards[0] = [card];
    mode._mountTabCards(0, [{ type: 'markdown', card_options: { colspan: 2, rowspan: 3 } }]);

    const wrapper = container.querySelector('.tab-panel[data-index="0"] .card-wrapper');
    expect(wrapper).not.toBeNull();
    expect(wrapper.style.gridColumn).toBe('span 2');
    expect(wrapper.style.gridRow).toBe('span 3');
  });

  it('returns tabs mode styles string', () => {
    const css = TabsMode.getStyles();
    expect(css).toContain('.tabs-mode');
    expect(css).toContain('.tabs-bar');
  });

  it('updates hass for all loaded tab cards', async () => {
    const mode = new TabsMode(createTabsConfig());
    attachMockHelpers(mode);

    document.body.appendChild(mode.render());
    await mode.open();
    await mode._selectTab(1);

    const hass = { states: { 'sensor.a': { state: '1' } } };
    mode.hass = hass;

    expect(mode._tabCards[0][0].hass).toBe(hass);
    expect(mode._tabCards[1][0].hass).toBe(hass);
  });

  it('releases loaded tab cards into shared pool on destroy', async () => {
    const mode = new TabsMode(createTabsConfig({ pool_scope: 'dashboard' }));
    attachMockHelpers(mode);

    document.body.appendChild(mode.render());
    await mode.open();
    await mode._selectTab(1);

    const before = cardPool.getStats().size;
    mode.destroy();
    const afterStats = cardPool.getStats();

    expect(afterStats.size).toBeGreaterThanOrEqual(before + 2);
    expect(afterStats.byScope.dashboard).toBeGreaterThanOrEqual(1);
  });

  it('close() handles inactive and active states', async () => {
    const mode = new TabsMode(createTabsConfig());
    attachMockHelpers(mode);

    const container = mode.render();
    document.body.appendChild(container);

    await mode.close();
    expect(container.dataset.state).toBe('collapsed');

    await mode.open();
    expect(container.dataset.state).toBe('expanded');

    await mode.close();
    expect(container.dataset.state).toBe('collapsed');
  });

  it('retains loaded tab content after close and reopen without recreating cards', async () => {
    const mode = new TabsMode(createTabsConfig());
    const getCreateCalls = attachMockHelpers(mode);

    document.body.appendChild(mode.render());

    await mode.open();

    const firstGrid = document.querySelector('.tab-panel[data-index="0"] .tab-grid');
    const firstCard = mode._tabCards[0][0];

    expect(firstGrid.querySelectorAll('.card-wrapper')).toHaveLength(1);
    expect(getCreateCalls()).toBe(1);

    await mode.close();
    await mode.open();

    const reopenedGrid = document.querySelector('.tab-panel[data-index="0"] .tab-grid');
    const reopenedWrappers = reopenedGrid.querySelectorAll('.card-wrapper');

    expect(reopenedWrappers).toHaveLength(1);
    expect(reopenedWrappers[0].children[0]).toBe(firstCard);
    expect(getCreateCalls()).toBe(1);
  });
});
