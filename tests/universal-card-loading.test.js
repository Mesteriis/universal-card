import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { installDomEnvironment } from './helpers/manual-dom.js';

let teardownDom;
let UniversalCard;

async function createCard(config, mode) {
  if (!UniversalCard) {
    ({ UniversalCard } = await import('../src/core/UniversalCard.js'));
  }

  const card = new UniversalCard();
  card._config = config;
  card._mode = mode;
  return card;
}

describe('UniversalCard modal loading strategy', () => {
  beforeEach(() => {
    teardownDom = installDomEnvironment();
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = null;
    UniversalCard = null;
  });

  it.each(['modal', 'drawer'])('preloads %s content when configured', async (bodyMode) => {
    const mode = {
      loaded: false,
      loadCards: vi.fn().mockResolvedValue(undefined)
    };
    const cards = [{ type: 'markdown', content: 'Modal body' }];
    const card = await createCard({
      body_mode: bodyMode,
      body: { cards },
      [bodyMode]: { loading_strategy: 'preload' }
    }, mode);

    await card._preloadModalModeContent();

    expect(mode.loadCards).toHaveBeenCalledTimes(1);
    expect(mode.loadCards).toHaveBeenCalledWith(cards);
  });

  it.each(['modal', 'drawer'])('keeps %s content lazy by default', async (bodyMode) => {
    const mode = {
      loaded: false,
      loadCards: vi.fn().mockResolvedValue(undefined)
    };
    const card = await createCard({
      body_mode: bodyMode,
      body: { cards: [{ type: 'markdown', content: 'Modal body' }] },
      [bodyMode]: { loading_strategy: 'lazy' }
    }, mode);

    await card._preloadModalModeContent();

    expect(mode.loadCards).not.toHaveBeenCalled();
  });
});
