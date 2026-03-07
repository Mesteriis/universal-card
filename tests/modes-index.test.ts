import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createMode, getAllModeStyles } from '../src/modes/index.js';
import { installDomEnvironment } from './helpers/manual-dom.js';

describe('mode factory', () => {
  let teardownDom: (() => void) | undefined;

  beforeEach(() => {
    teardownDom = installDomEnvironment();
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = undefined;
  });

  it('creates known mode instances', () => {
    const expand = createMode('expand', { body_mode: 'expand' });
    const subview = createMode('subview', { body_mode: 'subview', subview: { path: '/lovelace/test' } });

    expect(expand?.constructor.name).toBe('ExpandMode');
    expect(subview?.constructor.name).toBe('SubviewMode');
  });

  it('returns null for unknown mode types', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const mode = createMode('missing-mode', { body_mode: 'missing-mode' });

    expect(mode).toBeNull();
    expect(warn).toHaveBeenCalledWith('[UniversalCard] Unknown mode type: missing-mode');
  });

  it('concatenates styles from all registered modes', () => {
    const css = getAllModeStyles();

    expect(css).toContain('.expand-mode');
    expect(css).toContain('.uc-modal-overlay');
    expect(css).toContain('.uc-fullscreen-overlay');
    expect(css).toContain('.tabs-mode');
    expect(css).toContain('.carousel-mode');
    expect(css).toContain('.subview-mode-placeholder');
  });
});
