// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UniversalCard } from '../src/core/UniversalCard.js';
import { ConfigManager } from '../src/core/config.js';
import { BaseMode } from '../src/modes/BaseMode.js';

customElements.define('uc-initial-test', UniversalCard);

afterEach(() => vi.restoreAllMocks());

describe('Initially expanded inline modes', () => {
  it.each(['tabs', 'carousel'] as const)('mounts %s content on the initial body load', async (mode) => {
    const create = vi.fn(async (config: { content?: string }) => {
      const child = document.createElement('div');
      child.className = 'initial-child';
      child.textContent = config.content || '';
      return child;
    });
    vi.spyOn(BaseMode.prototype, '_getCardHelpers').mockResolvedValue({ createCardElement: create });
    const card = new UniversalCard();
    card._config = ConfigManager.normalize({
      type: 'custom:universal-card', body_mode: mode, expanded: true,
      enable_card_pool: false, remember_expanded_state: false,
      tabs: [{ label: 'First', cards: [{ type: 'markdown', content: 'Initial tab' }] }],
      body: { cards: [{ type: 'markdown', content: 'Initial slide' }] }
    }) as typeof card._config;
    card._restoreState();
    await card._render();
    await card._loadBodyCards();

    expect(card.shadowRoot?.querySelector(`.${mode}-mode`)?.getAttribute('data-state')).toBe('expanded');
    expect(card.shadowRoot?.querySelector('.initial-child')?.textContent)
      .toBe(mode === 'tabs' ? 'Initial tab' : 'Initial slide');
    expect(card._bodyCardsLoaded).toBe(true);
    await card._loadBodyCards();
    expect(create).toHaveBeenCalledTimes(1);
    card._resetRuntimeState();
  });

  it('does not open a navigation subview during background body loading', async () => {
    const card = new UniversalCard();
    const open = vi.fn();
    card._config = { body_mode: 'subview', body: { cards: [] } } as typeof card._config;
    card._mode = { open } as unknown as typeof card._mode;
    await card._loadBodyCards();
    expect(open).not.toHaveBeenCalled();
    expect(card._bodyCardsLoaded).toBe(true);
  });
});
