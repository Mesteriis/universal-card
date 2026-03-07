import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CarouselMode } from '../src/modes/CarouselMode.js';
import { installDomEnvironment } from './helpers/manual-dom.js';

function createCarouselConfig(overrides = {}) {
  return {
    card_id: 'carousel-card',
    body_mode: 'carousel',
    body: {
      cards: [
        { type: 'markdown', content: 'slide one' },
        { type: 'markdown', content: 'slide two' }
      ]
    },
    ...overrides
  };
}

function attachMockHelpers(mode) {
  let createCalls = 0;

  mode._getCardHelpers = async () => ({
    createCardElement: async () => {
      createCalls += 1;
      const card = document.createElement('div');
      card.className = 'mock-card';
      card.dataset.mockId = String(createCalls);
      card.hass = null;
      return card;
    }
  });

  return () => createCalls;
}

describe('CarouselMode', () => {
  let teardownDom;

  beforeEach(() => {
    teardownDom = installDomEnvironment();
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    teardownDom?.();
    teardownDom = null;
  });

  it('opens, loads slides, and reports the current index', async () => {
    const onSlideChange = vi.fn();
    const mode = new CarouselMode(createCarouselConfig(), { onSlideChange });
    attachMockHelpers(mode);

    document.body.appendChild(mode.render());
    await mode.open();

    expect(mode._track.querySelectorAll('.carousel-slide')).toHaveLength(2);
    expect(onSlideChange).toHaveBeenCalledWith(0);
  });

  it('retains loaded slides after close and reopen without duplicating content', async () => {
    const mode = new CarouselMode(createCarouselConfig());
    const getCreateCalls = attachMockHelpers(mode);

    document.body.appendChild(mode.render());

    await mode.open();

    const firstCard = mode._cards[0];
    expect(mode._track.querySelectorAll('.carousel-slide')).toHaveLength(2);
    expect(getCreateCalls()).toBe(2);

    await mode.close();
    expect(mode._container.dataset.state).toBe('collapsed');

    await mode.open();

    const slides = mode._track.querySelectorAll('.carousel-slide');
    expect(slides).toHaveLength(2);
    expect(slides[0].children[0]).toBe(firstCard);
    expect(getCreateCalls()).toBe(2);
  });

  it('stops autoplay on close and restarts it on reopen', async () => {
    const mode = new CarouselMode(createCarouselConfig({
      carousel_autoplay: true,
      carousel_interval: 2500
    }));
    attachMockHelpers(mode);

    document.body.appendChild(mode.render());

    await mode.open();
    const firstTimer = mode._autoplayTimer;
    expect(firstTimer).not.toBeNull();

    await mode.close();
    expect(mode._autoplayTimer).toBeNull();

    await mode.open();
    expect(mode._autoplayTimer).not.toBeNull();
  });
});
