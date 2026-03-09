import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { cardPool } from '../src/core/runtime.js';
import { FullscreenMode } from '../src/modes/FullscreenMode.js';
import { ModalMode } from '../src/modes/ModalMode.js';
import { installDomEnvironment } from './helpers/manual-dom.js';

function createModeConfig(bodyMode) {
  return {
    card_id: `${bodyMode}-card`,
    body_mode: bodyMode,
    title: `${bodyMode} title`,
    body: {
      cards: [
        { type: 'markdown', content: `${bodyMode} body` }
      ]
    }
  };
}

function attachMockHelpers(mode) {
  let createCalls = 0;

  mode._getCardHelpers = async () => ({
    createCardElement: async () => {
      createCalls += 1;
      const card = document.createElement('div');
      card.className = 'mock-card';
      return card;
    }
  });

  return () => createCalls;
}

async function flushAsyncModeTransition() {
  await vi.runAllTimersAsync();
  await Promise.resolve();
}

async function expectWindowModeReopensWithContent(mode, overlaySelector, gridSelector) {
  document.body.appendChild(mode.render());

  const getCreateCalls = attachMockHelpers(mode);

  const firstOpen = mode.open();
  await flushAsyncModeTransition();
  await firstOpen;

  expect(document.querySelector(overlaySelector)).not.toBeNull();
  expect(document.querySelectorAll(`${gridSelector} .card-wrapper`)).toHaveLength(1);
  const firstCard = mode._cards[0];

  const close = mode.close();
  await flushAsyncModeTransition();
  await close;

  expect(document.querySelector(overlaySelector)).toBeNull();

  const secondOpen = mode.open();
  await flushAsyncModeTransition();
  await secondOpen;

  const wrappers = document.querySelectorAll(`${gridSelector} .card-wrapper`);
  expect(wrappers).toHaveLength(1);
  expect(wrappers[0].children[0]).toBe(firstCard);
  expect(getCreateCalls()).toBe(1);
}

describe('window body modes', () => {
  let teardownDom;

  beforeEach(() => {
    teardownDom = installDomEnvironment();
    cardPool.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    teardownDom?.();
    teardownDom = null;
  });

  it('modal mode remounts loaded cards after close and reopen', async () => {
    const mode = new ModalMode(createModeConfig('modal'));
    await expectWindowModeReopensWithContent(mode, '.uc-modal-overlay', '.uc-modal-grid');
  });

  it('modal mode preserves grid layout config and sizing modes', () => {
    const mode = new ModalMode({
      ...createModeConfig('modal'),
      title: '',
      modal: {
        width: 'auto',
        height: '32rem',
        max_width: '72rem',
        max_height: '90vh',
        show_close: false
      },
      grid: {
        columns: 2,
        gap: '12px',
        column_gap: '20px',
        row_gap: '10px'
      }
    });

    const overlay = mode._renderModal();
    const dialog = overlay.querySelector('.uc-modal-dialog');
    const grid = overlay.querySelector('.uc-modal-grid');

    expect(dialog.dataset.widthMode).toBe('auto');
    expect(dialog.dataset.heightMode).toBe('manual');
    expect(mode._height).toBe('32rem');
    expect(mode._maxWidth).toBe('72rem');
    expect(mode._maxHeight).toBe('90vh');
    expect(overlay.querySelector('.uc-modal-header')).toBeNull();

    expect(grid.style.display).toBe('grid');
    expect(grid.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    expect(grid.style.gap).toBe('12px');
    expect(grid.style.columnGap).toBe('20px');
    expect(grid.style.rowGap).toBe('10px');
  });

  it('fullscreen mode remounts loaded cards after close and reopen', async () => {
    const mode = new FullscreenMode(createModeConfig('fullscreen'));
    await expectWindowModeReopensWithContent(mode, '.uc-fullscreen-overlay', '.uc-fullscreen-grid');
  });
});
