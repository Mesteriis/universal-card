import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExpandMode } from '../src/modes/ExpandMode.js';
import { SubviewMode } from '../src/modes/SubviewMode.js';
import { installDomEnvironment } from './helpers/manual-dom.js';

function createExpandConfig(overrides = {}) {
  return {
    card_id: 'expand-card',
    body_mode: 'expand',
    animation_duration: 250,
    body: {
      cards: [{ type: 'markdown', content: 'expand body' }]
    },
    grid: {
      columns: 2,
      gap: '12px'
    },
    ...overrides
  };
}

describe('ExpandMode', () => {
  let teardownDom;

  beforeEach(() => {
    teardownDom = installDomEnvironment();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = null;
  });

  it('renders skeleton and configured grid state before load', () => {
    const mode = new ExpandMode(createExpandConfig());
    const container = mode.render();
    const grid = container.querySelector('.expand-grid');

    expect(container.dataset.expandAnimation).toBe('slide');
    expect(grid.classList.contains('has-grid')).toBe(true);
    expect(grid.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    expect(grid.innerHTML).toContain('skeleton-container');
  });

  it('opens, populates cards, and toggles collapsed state', async () => {
    const mode = new ExpandMode(createExpandConfig());
    mode._getCardHelpers = async () => ({
      createCardElement: async () => {
        const card = document.createElement('div');
        card.className = 'mock-card';
        return card;
      }
    });

    document.body.appendChild(mode.render());
    await mode.open();

    expect(mode.active).toBe(true);
    expect(mode.loaded).toBe(true);
    expect(mode._container.dataset.state).toBe('expanded');
    expect(mode._container.querySelectorAll('.card-wrapper')).toHaveLength(1);

    await mode.toggle();
    expect(mode.active).toBe(false);
    expect(mode._container.dataset.state).toBe('collapsed');
  });

  it('exposes expand mode styles', () => {
    expect(ExpandMode.getStyles()).toContain('.expand-mode');
  });
});

describe('SubviewMode', () => {
  let teardownDom;

  beforeEach(() => {
    teardownDom = installDomEnvironment();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = null;
  });

  it('navigates to subview path and returns to previous path on close', async () => {
    const pushState = vi.fn((_, __, nextPath) => {
      window.location.pathname = nextPath;
      window.location.search = '';
      window.location.hash = '';
    });
    const replaceState = vi.fn();
    const locationChanged = vi.fn();

    history.pushState = pushState;
    history.replaceState = replaceState;
    window.addEventListener('location-changed', locationChanged);

    const mode = new SubviewMode({
      body_mode: 'subview',
      subview: {
        path: '/lovelace/details',
        return_on_close: true
      }
    });

    await mode.open();
    expect(mode.active).toBe(true);
    expect(pushState).toHaveBeenCalledWith(null, '', '/lovelace/details');
    expect(locationChanged).toHaveBeenCalledTimes(1);

    await mode.close();
    expect(mode.active).toBe(false);
    expect(pushState).toHaveBeenCalledWith(null, '', '/lovelace/0');
    expect(locationChanged).toHaveBeenCalledTimes(2);

    window.removeEventListener('location-changed', locationChanged);
  });

  it('uses replaceState when configured', async () => {
    const replaceState = vi.fn((_, __, nextPath) => {
      window.location.pathname = nextPath;
    });
    history.replaceState = replaceState;

    const mode = new SubviewMode({
      body_mode: 'subview',
      subview: {
        path: '/lovelace/replace',
        replace_state: true
      }
    });

    await mode.open();

    expect(replaceState).toHaveBeenCalledWith(null, '', '/lovelace/replace');
  });

  it('warns and remains inactive when path is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mode = new SubviewMode({ body_mode: 'subview', subview: {} });

    await mode.open();

    expect(mode.active).toBe(false);
    expect(warn).toHaveBeenCalledWith('[UniversalCard] subview.path is required for subview mode');
  });

  it('exposes subview placeholder styles', () => {
    expect(SubviewMode.getStyles()).toContain('.subview-mode-placeholder');
  });
});
