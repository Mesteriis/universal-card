import { CURRENT_CONFIG_VERSION } from './core/config.js';
import { BODY_MODES, THEMES } from './core/constants.js';
import {
  PLUGIN_PRIORITY,
  PUBLIC_PLUGIN_HOOKS,
  PUBLIC_PLUGIN_LIFECYCLE_VERSION
} from './extensibility/PluginSystem.js';

export const PUBLIC_API_POLICY_VERSION = 1;
export const PUBLIC_CAPABILITY_CATALOG_VERSION = 1;
export const PUBLIC_API_STAGE = 'development';

export const PUBLIC_NAMESPACE_VERSIONS = Object.freeze({
  elements: 1,
  config: 1,
  loaders: 1,
  devtools: 1,
  plugins: 2
});

export const PUBLIC_NAMESPACE_MEMBERS = Object.freeze({
  elements: Object.freeze(['card', 'editor']),
  config: Object.freeze([
    'getSchema',
    'getCurrentVersion',
    'migrate',
    'validate',
    'normalize',
    'hasChanged'
  ]),
  loaders: Object.freeze(['advanced', 'editor', 'cardEditor', 'devtools']),
  devtools: Object.freeze(['enable', 'disable']),
  plugins: Object.freeze([
    'register',
    'unregister',
    'enable',
    'disable',
    'list',
    'create',
    'getHooks',
    'getPriorities'
  ])
});

export const PUBLIC_FEATURE_FLAGS = Object.freeze({
  cardPool: true,
  sectionVisibility: true,
  themeTokens: true,
  customCss: true,
  lazyBundles: true,
  devtools: true,
  pluginLifecycle: true,
  pluginUiHooks: true
});

export type PublicNamespaceName = keyof typeof PUBLIC_NAMESPACE_VERSIONS;
export type PublicFeatureName = keyof typeof PUBLIC_FEATURE_FLAGS;

export const UC_PUBLIC_API_POLICY = Object.freeze({
  version: PUBLIC_API_POLICY_VERSION,
  stage: PUBLIC_API_STAGE,
  configVersion: CURRENT_CONFIG_VERSION,
  namespaceVersions: PUBLIC_NAMESPACE_VERSIONS,
  compatibility: Object.freeze({
    backwardCompatible: false,
    declaredNamespacesOnly: true,
    strictConfigValidationRequiresCurrentVersion: true,
    normalizeAutoMigratesLegacyConfig: true,
    pluginsRequireLocalRegistration: true
  })
});

export const UC_CAPABILITIES = Object.freeze({
  version: PUBLIC_CAPABILITY_CATALOG_VERSION,
  policyVersion: PUBLIC_API_POLICY_VERSION,
  schema: '2026-03-dev',
  configVersion: CURRENT_CONFIG_VERSION,
  bodyModes: Object.freeze([...Object.values(BODY_MODES)]),
  themes: Object.freeze([...Object.values(THEMES)]),
  namespaceVersions: PUBLIC_NAMESPACE_VERSIONS,
  publicNamespaces: PUBLIC_NAMESPACE_MEMBERS,
  pluginLifecycleVersion: PUBLIC_PLUGIN_LIFECYCLE_VERSION,
  pluginHooks: Object.freeze([...Object.values(PUBLIC_PLUGIN_HOOKS)]),
  pluginPriorities: PLUGIN_PRIORITY,
  features: PUBLIC_FEATURE_FLAGS
});

export function supportsNamespace(namespace: string, minVersion = 1): boolean {
  const version = PUBLIC_NAMESPACE_VERSIONS[namespace as PublicNamespaceName];
  return Number.isInteger(version) && version >= minVersion;
}

export function supportsNamespaceMember(namespace: string, member: string): boolean {
  const members = PUBLIC_NAMESPACE_MEMBERS[namespace as PublicNamespaceName];
  return Array.isArray(members) && members.includes(member);
}

export function hasCapabilityFeature(feature: string): boolean {
  return PUBLIC_FEATURE_FLAGS[feature as PublicFeatureName] === true;
}

type SchemaGetter = () => unknown;
type ConfigVersionGetter = () => number;
type ConfigMigrationFn = (config: unknown) => unknown;
type ConfigValidationFn = (config: unknown) => unknown;
type ConfigNormalizationFn = (config: unknown) => unknown;
type ConfigChangeFn = (prevConfig: unknown, nextConfig: unknown) => boolean;
type AsyncLoader = () => Promise<unknown>;
type SyncCallback = () => void;

type UniversalCardPlatformApiOptions = {
  version: string;
  elements: {
    card: string;
    editor: string;
  };
  config: {
    getSchema: SchemaGetter;
    getCurrentVersion: ConfigVersionGetter;
    migrate: ConfigMigrationFn;
    validate: ConfigValidationFn;
    normalize: ConfigNormalizationFn;
    hasChanged: ConfigChangeFn;
  };
  loaders: {
    advanced: AsyncLoader;
    editor: AsyncLoader;
    cardEditor: AsyncLoader;
    devtools: AsyncLoader;
  };
  devtools: {
    enable: SyncCallback;
    disable: SyncCallback;
  };
  plugins: {
    register: (plugin: unknown) => boolean;
    unregister: (pluginId: string) => boolean;
    enable: (pluginId: string) => void;
    disable: (pluginId: string) => void;
    list: () => unknown[];
    create: (options: Record<string, unknown>) => unknown;
    getHooks: () => string[];
    getPriorities: () => typeof PLUGIN_PRIORITY;
  };
};

export function createUniversalCardPlatformApi(options: UniversalCardPlatformApiOptions) {
  const policy = Object.freeze({
    ...UC_PUBLIC_API_POLICY,
    supportsNamespace,
    supportsMember: supportsNamespaceMember,
    hasFeature: hasCapabilityFeature
  });

  return Object.freeze({
    version: options.version,
    policy,
    elements: Object.freeze({
      card: options.elements.card,
      editor: options.elements.editor
    }),
    capabilities: UC_CAPABILITIES,
    config: Object.freeze({
      getSchema: options.config.getSchema,
      getCurrentVersion: options.config.getCurrentVersion,
      migrate: options.config.migrate,
      validate: options.config.validate,
      normalize: options.config.normalize,
      hasChanged: options.config.hasChanged
    }),
    loaders: Object.freeze({
      advanced: options.loaders.advanced,
      editor: options.loaders.editor,
      cardEditor: options.loaders.cardEditor,
      devtools: options.loaders.devtools
    }),
    devtools: Object.freeze({
      enable: options.devtools.enable,
      disable: options.devtools.disable
    }),
    plugins: Object.freeze({
      register: options.plugins.register,
      unregister: options.plugins.unregister,
      enable: options.plugins.enable,
      disable: options.plugins.disable,
      list: options.plugins.list,
      create: options.plugins.create,
      getHooks: options.plugins.getHooks,
      getPriorities: options.plugins.getPriorities
    })
  });
}
