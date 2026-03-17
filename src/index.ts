/**
 * Universal Card - Entry Point
 */
import { debug, setDebugMode } from './utils/helpers.js';
debug('[UC] 1. Start loading');

declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

// =============================================================================
// CORE
// =============================================================================
import { 
  CARD_VERSION, 
  CARD_NAME, 
  CARD_DESCRIPTION, 
  DEFAULTS,
  EVENTS,
  ACTION_TYPES,
  CONDITION_TYPES,
  CSS_VARS,
  LIMITS,
  PERF_BUDGETS
} from './core/constants.js';
debug('[UC] 2. Constants loaded');

import { UniversalCard } from './core/UniversalCard.js';
debug('[UC] 3. UniversalCard loaded');

import { ConfigManager, ConfigValidationError } from './core/config.js';
debug('[UC] 4. Config loaded');

import {
  runtimeEventHub,
  sharedStateStore,
  cardPool,
  performanceBudgetTracker
} from './core/runtime.js';
debug('[UC] 4.1 Runtime services loaded');

// =============================================================================
// UTILS
// =============================================================================
import { 
  debounce, 
  throttle, 
  raf,
  rafDouble,
  batchUpdates,
  createBatchUpdater,
  whenIdle,
  measureTime
} from './utils/performance.js';
debug('[UC] 6. Performance utils loaded');

import { 
  deepMerge, 
  deepClone,
  generateId, 
  isObject,
  isNonEmptyString,
  fireEvent,
  nextFrame,
  getNestedValue,
  ensureArray,
  formatNumber,
  formatDateTime,
  isValidEntityId
} from './utils/helpers.js';
debug('[UC] 7. Helpers loaded');

import { 
  type CardConfigLike,
  getCardHelpers,
  createCardElement,
  createCardElements,
  createErrorCard,
  getEntityState,
  getStateValue,
  getAttributeValue,
  isState,
  executeAction,
  hapticFeedback,
  getThemeVariables,
  getCurrentUser,
  isUserAdmin
} from './utils/ha-helpers.js';
import type { HomeAssistantLike } from './providers/ProviderContext.js';
debug('[UC] 8. HA helpers loaded');

// =============================================================================
// MODES
// =============================================================================
import { BaseMode } from './modes/BaseMode.js';
import { ExpandMode } from './modes/ExpandMode.js';
import { ModalMode } from './modes/ModalMode.js';
import { FullscreenMode } from './modes/FullscreenMode.js';
import { TabsMode } from './modes/TabsMode.js';
import { CarouselMode } from './modes/CarouselMode.js';
import { SubviewMode } from './modes/SubviewMode.js';
import { createMode, getAllModeStyles } from './modes/index.js';
debug('[UC] 9. Modes loaded');

// =============================================================================
// FEATURES
// =============================================================================
import { VisibilityConditions } from './features/VisibilityConditions.js';
import { StateStyles } from './features/StateStyles.js';
import { SwipeGestures } from './features/SwipeGestures.js';
import { ResponsiveBreakpoints } from './features/ResponsiveBreakpoints.js';
debug('[UC] 10. Features loaded');

// =============================================================================
// UI COMPONENTS
// =============================================================================
import { Header } from './ui/Header.js';
import { Footer } from './ui/Footer.js';
import { Badges } from './ui/Badges.js';
import { ContextMenu } from './ui/ContextMenu.js';
import { RadialMenu } from './ui/RadialMenu.js';
debug('[UC] 11. UI loaded');

debug('[UC] 12. Optional bundles are lazy-loaded');

// =============================================================================
// EXTENSIBILITY
// =============================================================================
import {
  createPlugin,
  getPluginSystem,
  type PluginDefinition,
  type PluginOptions,
  PLUGIN_PRIORITY,
  PUBLIC_PLUGIN_HOOKS
} from './extensibility/PluginSystem.js';
import { CustomCSS } from './extensibility/CustomCSS.js';
debug('[UC] 18. Extensibility loaded');

import { createUniversalCardPlatformApi } from './public-api-policy.js';
debug('[UC] 18.1 Public API policy loaded');

import {
  getLazyBundleImportUrls,
  type LazyBundleName
} from './lazy/paths.js';
debug('[UC] 18.2 Lazy bundle paths loaded');

type UniversalCardPlatformApi = ReturnType<typeof createUniversalCardPlatformApi>;
type CustomCardRegistration = {
  type?: string;
  [key: string]: unknown;
};

type DevtoolsLogger = {
  showPanel: () => void;
};

type DevtoolsProfiler = {
  showPanel: () => void;
};

type DevtoolsBundle = {
  EventLogger: new (options: { enabled: boolean }) => DevtoolsLogger;
  PerformanceProfiler: new (options: { enabled: boolean }) => DevtoolsProfiler;
};

type LazyCardEditorElement = HTMLElement & {
  hass?: HomeAssistantLike;
  setConfig?: (config: CardConfigLike) => void;
};

type UniversalCardDebugElement = UniversalCard;
type RuntimePoolStats = ReturnType<typeof cardPool.getStats>;
type RuntimePerformanceStats = ReturnType<typeof performanceBudgetTracker.snapshot>;

type UniversalCardDevtoolsApi = {
  _ensureLogger: () => Promise<DevtoolsLogger>;
  _ensureProfiler: () => Promise<DevtoolsProfiler>;
  findCards: () => UniversalCardDebugElement[];
  showLogger: () => string;
  showProfiler: () => string;
  showInspector: () => string;
  listCards: () => string;
  runtimeStats: () => { pool: RuntimePoolStats; perf: RuntimePerformanceStats };
  toggleCard: (index: number) => string;
  getCard: (index: number) => UniversalCardDebugElement | null;
};

declare global {
  interface Window {
    customCards?: CustomCardRegistration[];
    UniversalCard: UniversalCardPlatformApi;
    enableUniversalCardDebug: () => string;
    disableUniversalCardDebug: () => string;
    __UC_DEVTOOLS__: UniversalCardDevtoolsApi;
  }
}

// =============================================================================
// STYLES
// =============================================================================
import { HEADER_FOOTER_STYLES } from './styles/header-footer.js';
debug('[UC] 19. Styles loaded');

// =============================================================================
// REGISTRATION
// =============================================================================
debug('[UC] 20. Starting registration...');

// Регистрируем custom elements
if (!customElements.get('universal-card')) {
  debug('[UC] 21. Defining universal-card...');
  customElements.define('universal-card', UniversalCard);
  debug('[UC] 22. universal-card defined');
}

// Регистрируем в Home Assistant card picker
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'universal-card')) {
  window.customCards.push({
    type: 'universal-card',
    name: CARD_NAME,
    description: CARD_DESCRIPTION,
    preview: true,
    documentationURL: 'https://github.com/Mesteriis/universal-card'
  });
}

// =============================================================================
// LAZY OPTIONAL BUNDLES
// =============================================================================

const _lazyBundleCache = new Map<LazyBundleName, Promise<unknown>>();

function scheduleMicrotask(task: () => void) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(task);
    return;
  }

  Promise.resolve().then(task);
}

function detectBundleBaseUrl() {
  const scripts = Array.from(document.scripts || []);
  const current = document.currentScript as HTMLScriptElement | null;
  const candidates = current ? [current, ...scripts] : scripts;

  for (const script of candidates) {
    const src = script?.src || '';
    if (!src) continue;

    if (src.includes('universal-card.js')) {
      return src.slice(0, src.lastIndexOf('/') + 1);
    }
  }

  return '/local/';
}

async function loadOptionalBundle(bundleName: LazyBundleName) {
  if (_lazyBundleCache.has(bundleName)) {
    return _lazyBundleCache.get(bundleName)!;
  }

  const baseUrl = detectBundleBaseUrl();
  const importUrls = getLazyBundleImportUrls(bundleName, baseUrl);
  const promise = (async () => {
    let lastError: unknown = null;

    for (const importUrl of importUrls) {
      try {
        return await import(importUrl);
      } catch (error) {
        lastError = error;
      }
    }

    _lazyBundleCache.delete(bundleName);
    throw lastError;
  })();

  _lazyBundleCache.set(bundleName, promise);
  return promise;
}

async function loadAdvancedModules() {
  return loadOptionalBundle('advanced');
}

async function loadEditorModules() {
  return loadOptionalBundle('editor');
}

async function loadDevtoolsModules() {
  return loadOptionalBundle('devtools');
}

async function loadCardEditorBundle() {
  return loadOptionalBundle('cardEditor');
}

const UC_EDITOR_PROXY_TAG = 'universal-card-editor';
const UC_EDITOR_REAL_TAG = 'universal-card-editor-real';

let _cardEditorClassPromise: Promise<CustomElementConstructor> | null = null;

async function loadCardEditorClass() {
  if (_cardEditorClassPromise) {
    return _cardEditorClassPromise;
  }

  _cardEditorClassPromise = loadCardEditorBundle()
    .then((mod) => {
      const editorModule = mod as {
        UniversalCardEditor?: CustomElementConstructor;
        default?: CustomElementConstructor;
      };
      const editorClass = editorModule.UniversalCardEditor || editorModule.default;
      if (!editorClass) {
        throw new Error('Lazy card editor bundle does not export UniversalCardEditor');
      }

      if (!customElements.get(UC_EDITOR_REAL_TAG)) {
        customElements.define(UC_EDITOR_REAL_TAG, editorClass);
      }

      return editorClass;
    })
    .catch((error) => {
      _cardEditorClassPromise = null;
      throw error;
    });

  return _cardEditorClassPromise;
}

class UniversalCardEditorProxy extends HTMLElement {
  _editorEl: LazyCardEditorElement | null;
  _mountPromise: Promise<LazyCardEditorElement | null> | null;
  _hasPendingHass: boolean;
  _pendingHass: HomeAssistantLike;
  _hasPendingConfig: boolean;
  _pendingConfig: CardConfigLike | null;

  constructor() {
    super();
    this._editorEl = null;
    this._mountPromise = null;
    this._hasPendingHass = false;
    this._pendingHass = null;
    this._hasPendingConfig = false;
    this._pendingConfig = null;
  }

  connectedCallback() {
    scheduleMicrotask(() => {
      void this._ensureMountedEditor();
    });
  }

  disconnectedCallback() {
    if (this._editorEl && this._editorEl.parentNode === this) {
      this.removeChild(this._editorEl);
    }
    this._editorEl = null;
  }

  set hass(hass: HomeAssistantLike) {
    this._pendingHass = hass;
    this._hasPendingHass = true;

    if (this._editorEl) {
      this._editorEl.hass = hass;
      return;
    }

    scheduleMicrotask(() => {
      void this._ensureMountedEditor();
    });
  }

  setConfig(config: CardConfigLike) {
    this._pendingConfig = config;
    this._hasPendingConfig = true;

    if (this._editorEl && typeof this._editorEl.setConfig === 'function') {
      this._editorEl.setConfig(config);
      return;
    }

    scheduleMicrotask(() => {
      void this._ensureMountedEditor();
    });
  }

  async _ensureMountedEditor() {
    if (this._editorEl) {
      return this._editorEl;
    }

    if (!this.isConnected) {
      return null;
    }

    if (this._mountPromise) {
      return this._mountPromise;
    }

    this._mountPromise = this._mountEditor()
      .catch((error) => {
        console.error('[UC] Failed to lazy-load editor class:', error);
        throw error;
      })
      .finally(() => {
        this._mountPromise = null;
      });

    return this._mountPromise;
  }

  async _mountEditor() {
    await loadCardEditorClass();

    if (!this.isConnected) {
      return null;
    }

    if (this._editorEl) {
      return this._editorEl;
    }

    const editorEl = document.createElement(UC_EDITOR_REAL_TAG) as LazyCardEditorElement;
    this._editorEl = editorEl;

    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(editorEl);

    if (this._hasPendingHass) {
      editorEl.hass = this._pendingHass;
    }

    if (this._hasPendingConfig && typeof editorEl.setConfig === 'function') {
      editorEl.setConfig(this._pendingConfig);
    }

    return editorEl;
  }
}

if (!customElements.get(UC_EDITOR_PROXY_TAG)) {
  debug('[UC] 23. Defining universal-card-editor (lazy proxy)...');
  customElements.define(UC_EDITOR_PROXY_TAG, UniversalCardEditorProxy);
  debug('[UC] 24. universal-card-editor defined');
}

// =============================================================================
// GLOBAL API
// =============================================================================

const pluginSystem = getPluginSystem();

window.UniversalCard = createUniversalCardPlatformApi({
  version: CARD_VERSION,
  elements: {
    card: 'universal-card',
    editor: UC_EDITOR_PROXY_TAG
  },
  config: {
    getSchema: () => ConfigManager.getSchema(),
    getCurrentVersion: () => ConfigManager.getCurrentConfigVersion(),
    migrate: (config) => ConfigManager.migrate(config),
    validate: (config) => ConfigManager.validate(config),
    normalize: (config) => ConfigManager.normalize(config),
    hasChanged: (prevConfig, nextConfig) => ConfigManager.hasChanged(prevConfig, nextConfig)
  },
  loaders: {
    advanced: loadAdvancedModules,
    editor: loadEditorModules,
    cardEditor: loadCardEditorClass,
    devtools: loadDevtoolsModules
  },
  devtools: {
    enable: () => window.enableUniversalCardDebug(),
    disable: () => window.disableUniversalCardDebug()
  },
  plugins: {
    register: (plugin: PluginDefinition | PluginOptions) => pluginSystem.register(plugin),
    unregister: (pluginId) => pluginSystem.unregister(pluginId),
    enable: (pluginId) => pluginSystem.enable(pluginId),
    disable: (pluginId) => pluginSystem.disable(pluginId),
    list: () => pluginSystem.getPlugins(),
    create: (options: PluginOptions) => createPlugin(options),
    getHooks: () => [...Object.values(PUBLIC_PLUGIN_HOOKS)],
    getPriorities: () => PLUGIN_PRIORITY
  }
});

// =============================================================================
// CONSOLE LOG
// =============================================================================

console.info(
  '%c 🎴 UNIVERSAL-CARD %c v' + CARD_VERSION + ' %c',
  'color: white; background: #3498db; font-weight: bold; padding: 2px 8px; border-radius: 4px 0 0 4px;',
  'color: #3498db; background: #ecf0f1; font-weight: bold; padding: 2px 8px; border-radius: 0 4px 4px 0;',
  ''
);

// Dev mode log
if (process.env.NODE_ENV === 'development') {
  console.info(
    '%c 🔧 DEV MODE %c Core loaded, optional bundles are lazy',
    'color: white; background: #e74c3c; font-weight: bold; padding: 2px 8px;',
    'color: #e74c3c; padding: 2px 8px;'
  );
  console.log('window.UniversalCard platform API:', window.UniversalCard);
}

// =============================================================================
// GLOBAL DEBUG FUNCTIONS
// =============================================================================

// Глобальный объект devtools
let __ucLogger: DevtoolsLogger | null = null;
let __ucProfiler: DevtoolsProfiler | null = null;
let __ucDevtoolsBundle: Promise<DevtoolsBundle> | null = null;

async function ensureDevtoolsBundle(): Promise<DevtoolsBundle> {
  if (!__ucDevtoolsBundle) {
    __ucDevtoolsBundle = loadDevtoolsModules().then((mod) => {
      const devtoolsModule = mod as DevtoolsBundle & { devtools?: DevtoolsBundle };
      return devtoolsModule.devtools || devtoolsModule;
    });
  }
  return __ucDevtoolsBundle;
}

// Функция поиска элементов во всех Shadow DOM
function findAllInShadowDOM<T extends Element = Element>(
  selector: string,
  root: Document | ShadowRoot | Element = document
) {
  const results: T[] = [];
  
  // Поиск в текущем корне
  const found = root.querySelectorAll(selector);
  for (let i = 0; i < found.length; i += 1) {
    results.push(found[i] as T);
  }
  
  // Поиск во всех shadow roots
  const allElements = root.querySelectorAll('*');
  for (let j = 0; j < allElements.length; j += 1) {
    const el = allElements[j];
    if (el.shadowRoot) {
      const shadowResults = findAllInShadowDOM<T>(selector, el.shadowRoot);
      for (let k = 0; k < shadowResults.length; k += 1) {
        results.push(shadowResults[k]);
      }
    }
  }
  
  return results;
}

window.__UC_DEVTOOLS__ = {
  _ensureLogger: async function() {
    if (!__ucLogger) {
      const devtools = await ensureDevtoolsBundle();
      __ucLogger = new devtools.EventLogger({ enabled: true });
    }
    return __ucLogger;
  },

  _ensureProfiler: async function() {
    if (!__ucProfiler) {
      const devtools = await ensureDevtoolsBundle();
      __ucProfiler = new devtools.PerformanceProfiler({ enabled: true });
    }
    return __ucProfiler;
  },
  
  // Поиск всех карточек (включая Shadow DOM)
  findCards: function() {
    return findAllInShadowDOM<UniversalCardDebugElement>('universal-card');
  },
  
  showLogger: function() {
    this._ensureLogger()
      .then(function(logger) { logger.showPanel(); })
      .catch(function(error) { console.error('[UC] Failed to load logger:', error); });
    return 'Logger panel requested';
  },
  showProfiler: function() {
    this._ensureProfiler()
      .then(function(profiler) { profiler.showPanel(); })
      .catch(function(error) { console.error('[UC] Failed to load profiler:', error); });
    return 'Profiler panel requested';
  },
  showInspector: function() {
    console.log('%c📊 State Inspector', 'color: #9b59b6; font-weight: bold;');
    console.log('All universal-card elements (including Shadow DOM):');
    const cards = this.findCards();
    cards.forEach(function(card: UniversalCardDebugElement, i: number) {
      console.log('Card ' + i + ':', {
        title: card._config ? card._config.title : 'unknown',
        config: card._config,
        expanded: card._expanded,
        hass: card._hass ? 'connected' : 'not connected',
        bodyCards: card._bodyCards ? card._bodyCards.length : 0
      });
    });
    return 'Found ' + cards.length + ' cards';
  },
  
  listCards: function() {
    const cards = this.findCards();
    console.table(Array.from(cards).map(function(c: UniversalCardDebugElement, i: number) {
      return {
        index: i,
        title: c._config ? c._config.title : 'unknown',
        mode: c._config ? c._config.body_mode : 'unknown',
        expanded: c._expanded
      };
    }));
    return cards.length + ' cards found';
  },

  runtimeStats: function() {
    const stats = {
      pool: cardPool.getStats(),
      perf: performanceBudgetTracker.snapshot()
    };
    console.log('%c⚡ Universal Card Runtime Stats', 'color: #26a69a; font-weight: bold;');
    console.log(stats);
    return stats;
  },
  
  toggleCard: function(index) {
    const cards = this.findCards();
    if (cards[index]) {
      cards[index]._toggle();
      return 'Toggled card ' + index;
    }
    return 'Card not found';
  },
  
  getCard: function(index) {
    const cards = this.findCards();
    return cards[index] || null;
  }
} satisfies UniversalCardDevtoolsApi;

// Функция включения debug режима
window.enableUniversalCardDebug = function() {
  setDebugMode(true);
  void ensureDevtoolsBundle();
  console.log('%c🔧 Universal Card Debug Mode Enabled', 'color: #03a9f4; font-weight: bold; font-size: 14px;');
  console.log('');
  console.log('%cAvailable commands:', 'font-weight: bold;');
  console.log('  • __UC_DEVTOOLS__.listCards()       - List all cards');
  console.log('  • __UC_DEVTOOLS__.showInspector()   - Show card states');
  console.log('  • __UC_DEVTOOLS__.toggleCard(0)     - Toggle card by index');
  console.log('  • __UC_DEVTOOLS__.getCard(0)        - Get card element');
  console.log('  • __UC_DEVTOOLS__.runtimeStats()    - Pool + perf stats');
  console.log('  • __UC_DEVTOOLS__.showLogger()      - Show event logger');
  console.log('  • __UC_DEVTOOLS__.showProfiler()    - Show profiler');
  console.log('  • disableUniversalCardDebug()       - Disable debug mode');
  console.log('');
  console.log('%cQuick access:', 'font-weight: bold;');
  console.log('  • window.UniversalCard - Platform API');
  console.log('  • window.UniversalCard.policy - Public API contract');
  console.log('  • window.UniversalCard.plugins - Plugin lifecycle API');
  return 'Debug mode enabled! Logs will now appear. Try __UC_DEVTOOLS__.listCards()';
};

// Функция выключения debug режима
window.disableUniversalCardDebug = function() {
  setDebugMode(false);
  console.log('%c🔧 Universal Card Debug Mode Disabled', 'color: #888; font-weight: bold;');
  return 'Debug mode disabled. Logs will be suppressed.';
};

debug('[UC] Debug functions registered: enableUniversalCardDebug(), __UC_DEVTOOLS__');
