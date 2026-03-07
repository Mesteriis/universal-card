import { describe, expect, it, vi } from 'vitest';

import { CURRENT_CONFIG_VERSION } from '../src/core/config.js';
import {
  UC_CAPABILITIES,
  UC_PUBLIC_API_POLICY,
  createUniversalCardPlatformApi
} from '../src/public-api-policy.js';

describe('Public API policy', () => {
  it('declares a versioned public surface with explicit namespace inventory', () => {
    expect(UC_PUBLIC_API_POLICY.version).toBe(1);
    expect(UC_PUBLIC_API_POLICY.stage).toBe('development');
    expect(UC_PUBLIC_API_POLICY.configVersion).toBe(CURRENT_CONFIG_VERSION);
    expect(UC_PUBLIC_API_POLICY.namespaceVersions).toMatchObject({
      elements: 1,
      config: 1,
      loaders: 1,
      devtools: 1,
      plugins: 2
    });
    expect(UC_PUBLIC_API_POLICY.compatibility).toMatchObject({
      backwardCompatible: false,
      declaredNamespacesOnly: true,
      strictConfigValidationRequiresCurrentVersion: true,
      normalizeAutoMigratesLegacyConfig: true,
      pluginsRequireLocalRegistration: true
    });

    expect(UC_CAPABILITIES.version).toBe(1);
    expect(UC_CAPABILITIES.policyVersion).toBe(UC_PUBLIC_API_POLICY.version);
    expect(UC_CAPABILITIES.configVersion).toBe(CURRENT_CONFIG_VERSION);
    expect(UC_CAPABILITIES.publicNamespaces.config).toContain('migrate');
    expect(UC_CAPABILITIES.publicNamespaces.loaders).toContain('cardEditor');
    expect(UC_CAPABILITIES.publicNamespaces.plugins).toContain('register');
    expect(UC_CAPABILITIES.pluginLifecycleVersion).toBe(2);
    expect(UC_CAPABILITIES.pluginHooks).toEqual(
      expect.arrayContaining([
        'beforeInit',
        'afterRender',
        'configTransform',
        'hassUpdate',
        'headerRender',
        'bodyRender',
        'footerRender',
        'actionExecute',
        'click',
        'hold'
      ])
    );
    expect(UC_CAPABILITIES.features.devtools).toBe(true);
    expect(UC_CAPABILITIES.features.pluginLifecycle).toBe(true);
    expect(UC_CAPABILITIES.features.pluginUiHooks).toBe(true);
  });

  it('builds a frozen platform API with policy helpers and config migration support', () => {
    const delegates = {
      getSchema: vi.fn(() => ({ type: 'object' })),
      getCurrentVersion: vi.fn(() => CURRENT_CONFIG_VERSION),
      migrate: vi.fn((config: unknown) => ({ config, migrated: true })),
      validate: vi.fn((config: unknown) => config),
      normalize: vi.fn((config: unknown) => config),
      hasChanged: vi.fn(() => false)
    };
    const loaders = {
      advanced: vi.fn(async () => ({ advanced: true })),
      editor: vi.fn(async () => ({ editor: true })),
      cardEditor: vi.fn(async () => ({ cardEditor: true })),
      devtools: vi.fn(async () => ({ devtools: true }))
    };
    const devtools = {
      enable: vi.fn(),
      disable: vi.fn()
    };
    const plugins = {
      register: vi.fn(() => true),
      unregister: vi.fn(() => true),
      enable: vi.fn(),
      disable: vi.fn(),
      list: vi.fn(() => []),
      create: vi.fn((options: unknown) => options),
      getHooks: vi.fn(() => ['beforeInit']),
      getPriorities: vi.fn(() => ({
        HIGHEST: 0,
        HIGH: 25,
        NORMAL: 50,
        LOW: 75,
        LOWEST: 100
      } as const))
    };

    const api = createUniversalCardPlatformApi({
      version: '1.2.3-test',
      elements: {
        card: 'universal-card',
        editor: 'universal-card-editor'
      },
      config: delegates,
      loaders,
      devtools,
      plugins
    });

    expect(Object.isFrozen(api)).toBe(true);
    expect(Object.isFrozen(api.policy)).toBe(true);
    expect(api.policy.supportsNamespace('config', 1)).toBe(true);
    expect(api.policy.supportsNamespace('config', 2)).toBe(false);
    expect(api.policy.supportsMember('config', 'migrate')).toBe(true);
    expect(api.policy.supportsMember('config', 'legacyNormalize')).toBe(false);
    expect(api.policy.supportsNamespace('plugins', 2)).toBe(true);
    expect(api.policy.hasFeature('lazyBundles')).toBe(true);
    expect(api.policy.hasFeature('remotePlugins')).toBe(false);
    expect(api.policy.hasFeature('pluginLifecycle')).toBe(true);
    expect(api.policy.hasFeature('pluginUiHooks')).toBe(true);
    expect(api.config.getCurrentVersion()).toBe(CURRENT_CONFIG_VERSION);
    expect(api.config.migrate({ body: { cards: [] } })).toMatchObject({
      migrated: true
    });
    expect(api.loaders.cardEditor).toBe(loaders.cardEditor);
    expect(api.devtools.enable).toBe(devtools.enable);
    expect(api.plugins.register).toBe(plugins.register);
    expect(api.plugins.getHooks()).toEqual(['beforeInit']);
  });
});
