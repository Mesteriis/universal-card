import { describe, expect, it } from 'vitest';

import {
  detectPreferredBundleBaseUrl,
  getLazyBundleFileName,
  getLazyBundleImportUrls,
  getLazyBundleRelativePaths
} from '../src/lazy/paths.js';

describe('lazy bundle path resolution', () => {
  it('prefers root-level lazy bundles for HACS installs', () => {
    expect(getLazyBundleRelativePaths('advanced', '/hacsfiles/universal-card/')).toEqual([
      'uc-lazy-advanced.js',
      'lazy/uc-lazy-advanced.js'
    ]);

    expect(getLazyBundleImportUrls('cardEditor', '/hacsfiles/universal-card/')).toEqual([
      '/hacsfiles/universal-card/uc-lazy-card-editor.js',
      '/hacsfiles/universal-card/lazy/uc-lazy-card-editor.js'
    ]);
  });

  it('prefers legacy lazy/ layout for manual installs', () => {
    expect(getLazyBundleRelativePaths('editor', '/local/universal-card/')).toEqual([
      'lazy/uc-lazy-editor.js',
      'uc-lazy-editor.js'
    ]);

    expect(getLazyBundleImportUrls('devtools', '/local/')).toEqual([
      '/local/lazy/uc-lazy-devtools.js',
      '/local/uc-lazy-devtools.js'
    ]);
  });

  it('normalizes base URLs and validates bundle names', () => {
    expect(getLazyBundleImportUrls('advanced', '/local/universal-card')).toEqual([
      '/local/universal-card/lazy/uc-lazy-advanced.js',
      '/local/universal-card/uc-lazy-advanced.js'
    ]);

    expect(getLazyBundleFileName('cardEditor')).toBe('uc-lazy-card-editor.js');
  });

  it('prefers HACS base URL over stale legacy static resources', () => {
    expect(
      detectPreferredBundleBaseUrl([
        'http://192.168.1.4:8123/universal_card_static/universal-card.js?v=1.0.3',
        'http://192.168.1.4:8123/hacsfiles/universal-card/universal-card.js?hacstag=1132232658107'
      ])
    ).toBe('http://192.168.1.4:8123/hacsfiles/universal-card/');

    expect(
      detectPreferredBundleBaseUrl([
        'http://192.168.1.4:8123/universal_card_static/universal-card.js?v=1.0.3'
      ])
    ).toBe('http://192.168.1.4:8123/universal_card_static/');
  });
});
