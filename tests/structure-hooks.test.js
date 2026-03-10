import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { installDomEnvironment } from './helpers/manual-dom.js';

let teardownDom;
let Footer;
let UniversalCard;

async function createFooter(config) {
  if (!Footer) {
    ({ Footer } = await import('../src/ui/Footer.js'));
  }

  return new Footer(config);
}

async function createCard(config = {}) {
  if (!UniversalCard) {
    ({ UniversalCard } = await import('../src/core/UniversalCard.js'));
  }

  const card = new UniversalCard();
  card._config = {
    card_id: 'structure-hooks',
    body_mode: 'expand',
    body: { cards: [] },
    ...config
  };
  card._expanded = true;
  return card;
}

describe('Stable structure hooks', () => {
  beforeEach(() => {
    teardownDom = installDomEnvironment();
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = null;
    Footer = null;
    UniversalCard = null;
  });

  it('renders footer regions and actions with explicit hooks', async () => {
    const footer = await createFooter({
      text: 'Updated 5m ago',
      icon: 'mdi:clock-outline',
      actions: [
        { icon: 'mdi:refresh', label: 'Refresh', action: 'call-service' }
      ]
    });

    const element = footer.render();
    document.body.appendChild(element);

    expect(element.dataset.ucRole).toBe('footer');
    expect(element.innerHTML).toContain('class="footer-left" data-uc-region="left"');
    expect(element.innerHTML).toContain('class="footer-content" data-uc-region="content"');
    expect(element.innerHTML).toContain('class="footer-right" data-uc-region="right"');
    expect(element.innerHTML).toContain('class="footer-left-slot" data-uc-slot="left"');
    expect(element.innerHTML).toContain('class="footer-cards-slot" data-uc-slot="content"');
    expect(element.innerHTML).toContain('class="footer-text" data-uc-role="text"');
    expect(element.innerHTML).toContain('class="footer-action-btn" data-action-index="0" data-uc-role="action" data-uc-action-index="0"');
  });

  it('renders card shell and expand body with explicit hooks', async () => {
    const card = await createCard({
      title: 'Hooks',
      body: {
        cards: [{ type: 'markdown', content: 'Hello' }]
      }
    });

    await card._render();

    const shell = card.shadowRoot.querySelector('.universal-card');
    const body = card.shadowRoot.querySelector('.body');
    const bodyContent = card.shadowRoot.querySelector('.body-content');

    expect(shell.dataset.ucRole).toBe('card');
    expect(shell.dataset.ucBodyMode).toBe('expand');
    expect(body.dataset.ucRole).toBe('body');
    expect(body.dataset.ucMode).toBe('expand');
    expect(bodyContent.dataset.ucRole).toBe('body-content');
  });
});
