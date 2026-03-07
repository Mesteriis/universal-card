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

  it('fullscreen mode remounts loaded cards after close and reopen', async () => {
    const mode = new FullscreenMode(createModeConfig('fullscreen'));
    await expectWindowModeReopensWithContent(mode, '.uc-fullscreen-overlay', '.uc-fullscreen-grid');
  });
});
