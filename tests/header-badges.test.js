import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { installDomEnvironment } from './helpers/manual-dom.js';

let teardownDom;
let Header;

async function createHeader(config) {
  if (!Header) {
    ({ Header } = await import('../src/ui/Header.js'));
  }

  return new Header(config);
}

describe('Header badges', () => {
  beforeEach(() => {
    teardownDom = installDomEnvironment();
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = null;
    Header = null;
  });

  it('renders only visible badges, applies color rules, and routes icon actions separately', async () => {
    const header = await createHeader({
      title: 'Kitchen',
      badges: [
        {
          type: 'custom',
          value: 'off',
          label: 'Hidden',
          visibility: [{ operator: '==', value: 'on' }]
        },
        {
          type: 'custom',
          value: 'on',
          icon: 'mdi:lightbulb',
          icon_only: true,
          color_rules: [{ operator: '==', value: 'on', color: 'yellow' }],
          tap_action: { action: 'toggle' },
          icon_tap_action: { action: 'more-info' }
        }
      ]
    });

    const element = header.render();
    document.body.appendChild(element);
    const badgesHtml = header._renderVisibleBadgesHtml();

    expect(badgesHtml).toContain('badge clickable icon-only');
    expect(badgesHtml).toContain('--badge-color: yellow');
    expect(badgesHtml).toContain('badge-icon-action clickable');
    expect(badgesHtml).toContain('aria-label="Action for badge"');
    expect(badgesHtml).not.toContain('Hidden');
    expect(badgesHtml).not.toContain('badge-label');
    expect(badgesHtml).not.toContain('badge-value');

    const badge = document.createElement('div');
    badge.className = 'badge clickable icon-only';
    badge.dataset.badgeIndex = '1';
    const iconActionButton = document.createElement('button');
    iconActionButton.className = 'badge-icon-action clickable';
    iconActionButton.dataset.badgeIndex = '1';
    badge.appendChild(iconActionButton);
    element.appendChild(badge);

    header._handleBadgeClick = vi.fn();
    header._handleBadgeIconClick = vi.fn();

    header._handleClick({
      target: iconActionButton,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    });

    expect(header._handleBadgeIconClick).toHaveBeenCalledTimes(1);
    expect(header._handleBadgeClick).not.toHaveBeenCalled();
  });

  it('applies header layout presets and can move badges below content', async () => {
    const header = await createHeader({
      title: 'Kitchen',
      subtitle: 'Lights',
      badges: [
        {
          type: 'custom',
          value: 'on',
          label: 'Active'
        }
      ],
      header: {},
      layout: {
        variant: 'stacked',
        gap: '18px',
        content_gap: '6px',
        align: 'center',
        badges_position: 'below_content'
      }
    });

    const element = header.render();
    document.body.appendChild(element);

    expect(element.dataset.layoutVariant).toBe('stacked');
    expect(element.dataset.contentAlign).toBe('center');
    expect(element.dataset.badgesPosition).toBe('below_content');
    expect(element.dataset.ucRole).toBe('header');
    expect(element.style['--uc-header-gap']).toBe('18px');
    expect(element.style['--uc-header-content-gap']).toBe('6px');
    expect(element.innerHTML).toContain('header-content-badges');
    expect(element.innerHTML).toContain('data-uc-position="below-content"');
    expect(element.innerHTML).toContain('class="header-left" data-uc-region="left"');
    expect(element.innerHTML).toContain('class="header-content" data-uc-region="content"');
    expect(element.innerHTML).toContain('class="header-right" data-uc-region="right"');
    expect(element.innerHTML).toContain('class="header-title" data-uc-role="title"');
    expect(element.innerHTML).toContain('class="header-subtitle" data-uc-role="subtitle"');
    expect(element.innerHTML).not.toContain('header-right">\n        <div class="header-badges">');
  });
});
