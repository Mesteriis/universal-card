// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { CustomCSS, CSS_SCOPES } from '../src/extensibility/CustomCSS.js';
import { ConfigManager } from '../src/core/config.js';
import { UniversalCard } from '../src/core/UniversalCard.js';
import { ModalMode } from '../src/modes/ModalMode.js';

describe('Dashboard layout CSS and context', () => {
  it('accepts overscroll-behavior without dropping the whole style block', () => {
    const root = document.createElement('div').attachShadow({ mode: 'open' });
    const css = new CustomCSS(root);
    expect(css.add('scroll', '.tabs-content { overflow: auto; overscroll-behavior: contain; }',
                   { scope: CSS_SCOPES.GLOBAL })).toBe(true);
    expect(root.querySelector('style')?.textContent).toContain('overscroll-behavior: contain');
  });

  it.each(['behavior', 'expression', '-moz-binding'])('still rejects the actual %s property', (property) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const root = document.createElement('div').attachShadow({ mode: 'open' });
    const css = new CustomCSS(root);
    expect(css.add('blocked', `.card { ${property}: url(test); }`)).toBe(false);
    expect(root.querySelector('style')?.textContent).toBe('');
  });

  it.each([1, 3])('applies explicit spacing with %i columns', (columns) => {
    const styles = UniversalCard.prototype._getGridStyles.call({ _config: { grid: { columns, gap: 12 } } });
    expect(styles).toContain('display: grid');
    expect(styles).toContain('gap: 12px;');
    expect(styles).toContain('minmax(0, 1fr)');
  });

  it('preserves an explicit zero gap during normalization', () => {
    expect(ConfigManager._normalizeGrid({ columns: 1, gap: 0 }).gap).toBe('0px');
  });

  it('keeps the modal inside the nearest dashboard shadow root', () => {
    const dashboard = document.createElement('hui-root');
    const dashboardRoot = dashboard.attachShadow({ mode: 'open' });
    const layout = document.createElement('div');
    dashboardRoot.appendChild(layout);
    const layoutRoot = layout.attachShadow({ mode: 'open' });
    const card = document.createElement('div');
    layoutRoot.appendChild(card);
    const mode = new ModalMode({ body_mode: 'modal' }, { card });
    expect(mode._resolvePortalTarget()).toBe(dashboardRoot);
    expect(new ModalMode({ body_mode: 'modal' })._resolvePortalTarget()).toBe(document.body);
  });
});
