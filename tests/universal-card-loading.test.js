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

  it('preloads modal content when configured', async () => {
    const mode = {
      loaded: false,
      loadCards: vi.fn().mockResolvedValue(undefined)
    };
    const cards = [{ type: 'markdown', content: 'Modal body' }];
    const card = await createCard({
      body_mode: 'modal',
      body: { cards },
      modal: { loading_strategy: 'preload' }
    }, mode);

    await card._preloadModalModeContent();

    expect(mode.loadCards).toHaveBeenCalledTimes(1);
    expect(mode.loadCards).toHaveBeenCalledWith(cards);
  });

  it('keeps modal content lazy by default', async () => {
    const mode = {
      loaded: false,
      loadCards: vi.fn().mockResolvedValue(undefined)
    };
    const card = await createCard({
      body_mode: 'modal',
      body: { cards: [{ type: 'markdown', content: 'Modal body' }] },
      modal: { loading_strategy: 'lazy' }
    }, mode);

    await card._preloadModalModeContent();

    expect(mode.loadCards).not.toHaveBeenCalled();
  });
});
