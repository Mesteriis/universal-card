#!/usr/bin/env node
/* eslint-disable no-console */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..');

let lastIntersectionObserver = null;
let storage = new Map();

if (typeof CustomEvent === 'undefined') {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(type, options = {}) {
      super(type, options);
      this.detail = options.detail;
    }
  };
}

class FakeClassList {
  constructor(element) {
    this._element = element;
    this._set = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => this._set.add(token));
    this._sync();
  }

  remove(...tokens) {
    tokens.forEach((token) => this._set.delete(token));
    this._sync();
  }

  contains(token) {
    return this._set.has(token);
  }

  toggle(token, force) {
    if (force === true) {
      this._set.add(token);
      this._sync();
      return true;
    }

    if (force === false) {
      this._set.delete(token);
      this._sync();
      return false;
    }

    if (this._set.has(token)) {
      this._set.delete(token);
      this._sync();
      return false;
    }

    this._set.add(token);
    this._sync();
    return true;
  }

  _sync() {
    this._element.className = Array.from(this._set).join(' ');
  }
}

function parseSimpleSelector(selector) {
  const trimmed = selector.trim();
  const tagMatch = trimmed.match(/^[a-zA-Z0-9-]+/);
  const classMatches = [...trimmed.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((match) => match[1]);
  const attributeMatches = [...trimmed.matchAll(/\[([^\]=]+)(?:=(['"]?)([^'"\]]+)\2)?\]/g)].map(
    (match) => ({
      name: match[1],
      value: match[3] ?? null
    })
  );

  return {
    tagName: tagMatch ? tagMatch[0].toUpperCase() : null,
    classes: classMatches,
    attributes: attributeMatches
  };
}

function getSelectorAttributeValue(element, name) {
  if (!(element instanceof FakeElement)) {
    return null;
  }

  const attributeValue = element.getAttribute(name);
  if (attributeValue != null) {
    return String(attributeValue);
  }

  if (name.startsWith('data-')) {
    const dataKey = name
      .slice(5)
      .split('-')
      .map((segment, index) => (index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1)))
      .join('');

    if (Object.prototype.hasOwnProperty.call(element.dataset, dataKey)) {
      return String(element.dataset[dataKey]);
    }
  }

  return null;
}

function matchesSimpleSelector(element, selector) {
  if (!(element instanceof FakeElement)) {
    return false;
  }

  const parsed = parseSimpleSelector(selector);
  const classTokens = String(element.className || '')
    .split(/\s+/)
    .filter(Boolean);

  if (parsed.tagName && element.tagName !== parsed.tagName) {
    return false;
  }

  if (!parsed.classes.every(
    (className) => element.classList.contains(className) || classTokens.includes(className)
  )) {
    return false;
  }

  return parsed.attributes.every(({ name, value }) => {
    const actualValue = getSelectorAttributeValue(element, name);
    if (actualValue == null) {
      return false;
    }

    if (value == null) {
      return true;
    }

    return actualValue === value;
  });
}

function matchesSelectorChain(element, selectors) {
  let current = element;

  for (let index = selectors.length - 1; index >= 0; index -= 1) {
    const selector = selectors[index];
    if (!current) {
      return false;
    }

    if (index === selectors.length - 1) {
      if (!matchesSimpleSelector(current, selector)) {
        return false;
      }
      current = current.parentElement;
      continue;
    }

    while (current && !matchesSimpleSelector(current, selector)) {
      current = current.parentElement;
    }

    if (!current) {
      return false;
    }

    current = current.parentElement;
  }

  return true;
}

class FakeStyle {
  setProperty(name, value) {
    this[name] = String(value);
  }

  removeProperty(name) {
    delete this[name];
  }
}

function updateConnection(node, isConnected) {
  if (!node || typeof node !== 'object') return;

  node.isConnected = isConnected;

  if (isConnected && typeof node.connectedCallback === 'function') {
    node.connectedCallback();
  }

  if (!isConnected && typeof node.disconnectedCallback === 'function') {
    node.disconnectedCallback();
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => updateConnection(child, isConnected));
  }

  if (node.shadowRoot) {
    updateConnection(node.shadowRoot, isConnected);
  }
}

class FakeElement extends EventTarget {
  constructor(tagName = 'div') {
    super();
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.parentElement = null;
    this.isConnected = false;
    this.style = new FakeStyle();
    this.dataset = {};
    this.attributes = {};
    this.className = '';
    this.classList = new FakeClassList(this);
    this.innerHTML = '';
    this.shadowRoot = null;
    this.textContent = '';
    this.tabIndex = 0;
  }

  appendChild(child) {
    if (!child) return child;

    if (child instanceof FakeDocumentFragment) {
      const fragmentChildren = child.children.slice();
      fragmentChildren.forEach((fragmentChild) => {
        this.appendChild(fragmentChild);
      });
      return child;
    }

    if (child.parentNode && typeof child.parentNode.removeChild === 'function') {
      child.parentNode.removeChild(child);
    }

    this.children.push(child);
    child.parentNode = this;
    child.parentElement = this instanceof FakeElement ? this : null;
    updateConnection(child, this.isConnected);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }

    if (child) {
      child.parentNode = null;
      child.parentElement = null;
      updateConnection(child, false);
    }

    return child;
  }

  remove() {
    if (this.parentNode && typeof this.parentNode.removeChild === 'function') {
      this.parentNode.removeChild(this);
    }
  }

  attachShadow() {
    this.shadowRoot = new FakeElement('shadow-root');
    this.shadowRoot.host = this;
    this.shadowRoot.isConnected = this.isConnected;
    return this.shadowRoot;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  querySelector() {
    return this.querySelectorAll(...arguments)[0] || null;
  }

  querySelectorAll() {
    const selector = arguments[0];
    const selectors = String(selector || '').trim().split(/\s+/).filter(Boolean);
    const results = [];

    const visit = (node) => {
      (node.children || []).forEach((child) => {
        if (matchesSelectorChain(child, selectors)) {
          results.push(child);
        }
        visit(child);
      });
    };

    visit(this);
    return results;
  }

  focus() {
    if (global.document) {
      global.document.activeElement = this;
    }
  }
}

class FakeHTMLElement extends FakeElement {}
class FakeDocumentFragment extends FakeElement {}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.body = new FakeHTMLElement('body');
    this.body.isConnected = true;
    this.activeElement = null;
  }

  createElement(tagName) {
    return new FakeHTMLElement(tagName);
  }

  createDocumentFragment() {
    return new FakeDocumentFragment('document-fragment');
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }
}

function installDom() {
  const document = new FakeDocument();
  const window = new EventTarget();

  window.document = document;
  window.location = {
    pathname: '/lovelace/0',
    search: '',
    hash: '',
    href: 'http://localhost/lovelace/0'
  };
  window.innerWidth = 1280;
  window.navigator = { userAgent: 'node' };
  window.history = {
    pushState() {},
    replaceState() {}
  };
  window.customElements = {
    define() {},
    get() {
      return undefined;
    }
  };
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {}
  });
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
  window.requestIdleCallback = (cb, options = {}) => setTimeout(
    () => cb({ didTimeout: false, timeRemaining: () => 50 }),
    Math.min(options.timeout || 1, 10)
  );
  window.cancelIdleCallback = (id) => clearTimeout(id);
  window.loadCardHelpers = async () => ({
    createCardElement: async (config) => {
      const card = document.createElement('div');
      card.dataset.type = config.type;
      card.hass = null;
      return card;
    }
  });

  const localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    },
    clear() {
      storage.clear();
    }
  };

  global.window = window;
  global.document = document;
  global.history = window.history;
  global.location = window.location;
  global.navigator = window.navigator;
  global.localStorage = localStorage;
  global.HTMLElement = FakeHTMLElement;
  global.Element = FakeElement;
  global.Node = FakeElement;
  global.Event = global.Event || Event;
  global.CustomEvent = global.CustomEvent || CustomEvent;
  global.DocumentFragment = FakeDocumentFragment;
  global.customElements = window.customElements;
  global.performance = { now: () => Date.now() };
  global.MutationObserver = class FakeMutationObserver {
    disconnect() {}
    observe() {}
  };
  global.getComputedStyle = () => ({});
  global.requestAnimationFrame = window.requestAnimationFrame;
  global.cancelAnimationFrame = window.cancelAnimationFrame;

  global.IntersectionObserver = class FakeIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      this.element = null;
      lastIntersectionObserver = this;
    }

    observe(element) {
      this.element = element;
    }

    disconnect() {
      this.disconnected = true;
    }
  };

  window.IntersectionObserver = global.IntersectionObserver;
}

function resetDomState(runtimeEventHub, cardPool) {
  document.body.children.slice().forEach((child) => document.body.removeChild(child));
  document.body.innerHTML = '';
  document.body.style = new FakeStyle();
  document.activeElement = null;
  delete window.__ucOverlayLockCount;
  delete window.__ucOverlayPrevOverflow;
  lastIntersectionObserver = null;
  storage.clear();

  if (cardPool && typeof cardPool.clear === 'function') {
    cardPool.clear();
  }

  if (runtimeEventHub) {
    runtimeEventHub._cards.clear();
    runtimeEventHub._cardsById.clear();
    runtimeEventHub._detachListeners();
  }
}

async function loadBundledModule(relPath) {
  const entryPath = resolveBundledModulePath(relPath);
  const result = await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    platform: 'browser',
    format: 'cjs',
    write: false,
    target: ['es2020']
  });

  const code = result.outputFiles[0].text;
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    console,
    process,
    global,
    globalThis: global,
    window,
    document,
    history,
    location,
    navigator,
    localStorage,
    HTMLElement,
    Element,
    Node,
    Event,
    CustomEvent,
    DocumentFragment,
    customElements,
    performance,
    MutationObserver,
    getComputedStyle,
    requestAnimationFrame,
    cancelAnimationFrame,
    IntersectionObserver,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    AbortController
  };

  vm.runInNewContext(code, sandbox, { filename: `${relPath}.bundle.cjs` });
  return module.exports;
}

function resolveBundledModulePath(relPath) {
  const direct = path.join(ROOT, relPath);
  if (fs.existsSync(direct)) {
    return direct;
  }

  const extension = path.extname(relPath);
  const basePath = extension ? relPath.slice(0, -extension.length) : relPath;
  const candidates = [
    `${basePath}.ts`,
    `${basePath}.js`
  ];

  for (const candidate of candidates) {
    const absolutePath = path.join(ROOT, candidate);
    if (fs.existsSync(absolutePath)) {
      return absolutePath;
    }
  }

  throw new Error(`Module source not found for ${relPath}`);
}

async function run(name, fn, helpers) {
  try {
    resetDomState(helpers.runtimeEventHub, helpers.cardPool);
    await fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

async function main() {
  installDom();

  const [
    { UniversalCard },
    constants,
    runtime,
    { VisibilityConditions },
    { StateStyles },
    haHelpers,
    { createProviderContext },
    { Alerts, ALERT_ACTIONS, ALERT_CONDITIONS },
    { QuickActions, ACTION_TYPES },
    { EntityPreview },
    { Timer, TIMER_MODES },
    { IconMapping },
    { RestApiWidget },
    { ImageEntity, SOURCE_TYPES },
    { MediaPlayerMini },
    { NotificationCenter },
    overlay,
    { CustomCSS },
    { Header },
    { Footer },
    { Badges },
    { TabsMode },
    { ModalMode },
    { FullscreenMode },
    { CarouselMode },
    { UniversalCardEditor },
    pluginSystemModule
  ] = await Promise.all([
    loadBundledModule('src/core/UniversalCard.ts'),
    loadBundledModule('src/core/constants.ts'),
    loadBundledModule('src/core/runtime.ts'),
    loadBundledModule('src/features/VisibilityConditions.ts'),
    loadBundledModule('src/features/StateStyles.ts'),
    loadBundledModule('src/utils/ha-helpers.ts'),
    loadBundledModule('src/providers/ProviderContext.ts'),
    loadBundledModule('src/advanced/Alerts.ts'),
    loadBundledModule('src/advanced/QuickActions.ts'),
    loadBundledModule('src/advanced/EntityPreview.ts'),
    loadBundledModule('src/advanced/Timer.ts'),
    loadBundledModule('src/advanced/IconMapping.ts'),
    loadBundledModule('src/widgets/RestApiWidget.ts'),
    loadBundledModule('src/widgets/ImageEntity.ts'),
    loadBundledModule('src/widgets/MediaPlayerMini.ts'),
    loadBundledModule('src/widgets/NotificationCenter.ts'),
    loadBundledModule('src/utils/overlay.ts'),
    loadBundledModule('src/extensibility/CustomCSS.ts'),
    loadBundledModule('src/ui/Header.ts'),
    loadBundledModule('src/ui/Footer.ts'),
    loadBundledModule('src/ui/Badges.ts'),
    loadBundledModule('src/modes/TabsMode.js'),
    loadBundledModule('src/modes/ModalMode.js'),
    loadBundledModule('src/modes/FullscreenMode.js'),
    loadBundledModule('src/modes/CarouselMode.js'),
    loadBundledModule('src/core/UniversalCardEditor.ts'),
    loadBundledModule('src/extensibility/PluginSystem.ts')
  ]);

  const helpers = {
    EVENTS: constants.EVENTS,
    runtimeEventHub: runtime.runtimeEventHub,
    cardPool: runtime.cardPool,
    VisibilityConditions,
    StateStyles,
    UniversalCard,
    haHelpers,
    createProviderContext,
    Alerts,
    ALERT_ACTIONS,
    ALERT_CONDITIONS,
    QuickActions,
    ACTION_TYPES,
    EntityPreview,
    Timer,
    TIMER_MODES,
    IconMapping,
    RestApiWidget,
    Header,
    TabsMode,
    CarouselMode,
    ImageEntity,
    SOURCE_TYPES,
    MediaPlayerMini,
    NotificationCenter,
    CustomCSS,
    Footer,
    Badges,
    ModalMode,
    FullscreenMode,
    UniversalCardEditor,
    pluginSystemModule,
    ...overlay
  };

  await run('mode onClose sync collapses parent state', async () => {
    const card = new helpers.UniversalCard();
    card._config = { card_id: 'mode-card', lazy_load: false };
    card._expanded = true;

    let collapsedCount = 0;
    card._updateExpandedUI = () => {};
    card.addEventListener(helpers.EVENTS.CARD_COLLAPSED, () => {
      collapsedCount += 1;
    });

    card._handleModeClosed();
    card._handleModeClosed();

    assert.equal(card._expanded, false);
    assert.equal(collapsedCount, 1);
  }, helpers);

  await run('connected callback re-observes initialized lazy cards', async () => {
    const card = new helpers.UniversalCard();
    card._config = { card_id: 'lazy-card', lazy_load: true };
    card._initialized = true;
    card._bodyCardsLoaded = false;

    let observeCount = 0;
    card._setupIntersectionObserver = function patchedObserverSetup() {
      this._intersectionObserver = {
        observe: () => {
          observeCount += 1;
        },
        disconnect() {}
      };
    };

    document.body.appendChild(card);
    card.remove();

    assert.equal(observeCount, 1);
  }, helpers);

  await run('expand rolls back when mode does not become active', async () => {
    const card = new helpers.UniversalCard();
    card._config = { card_id: 'overlay-card', body_mode: 'modal' };
    card._isCardVisible = () => true;
    card._isSectionVisible = () => true;
    card._updateExpandedUI = () => {};
    card._setupAutoCollapse = () => {};
    card._mode = {
      active: false,
      open: async () => {},
      close: async () => {}
    };

    let expandedEvents = 0;
    let collapsedEvents = 0;
    card.addEventListener(helpers.EVENTS.CARD_EXPANDED, () => {
      expandedEvents += 1;
    });
    card.addEventListener(helpers.EVENTS.CARD_COLLAPSED, () => {
      collapsedEvents += 1;
    });

    await card._expand();

    assert.equal(card._expanded, false);
    assert.equal(expandedEvents, 0);
    assert.equal(collapsedEvents, 1);
  }, helpers);

  await run('expand updates UI immediately while body cards are still loading', async () => {
    const card = new helpers.UniversalCard();
    const body = document.createElement('div');
    let resolveLoad;
    let loadStarted = false;

    card._config = {
      card_id: 'expand-inline-card',
      body_mode: 'expand',
      animation_duration: 0
    };
    card._isCardVisible = () => true;
    card._isSectionVisible = () => true;
    card.shadowRoot.querySelector = (selector) => (selector === '.body' ? body : null);
    card._loadBodyCards = () => {
      loadStarted = true;
      return new Promise((resolve) => {
        resolveLoad = resolve;
      });
    };

    const expandPromise = card._expand();

    assert.equal(loadStarted, true);
    assert.equal(card._expanded, true);
    assert.equal(body.dataset.state, 'expanded');

    resolveLoad();
    await expandPromise;
  }, helpers);

  await run('cancelPendingBodyLoad resolves an in-flight idle wait', async () => {
    const card = new helpers.UniversalCard();
    card._bodyLoadToken = 1;

    const waitPromise = card._yieldForLazyBatch(1, 1000);
    card._cancelPendingBodyLoad();

    await Promise.race([
      waitPromise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('idle wait did not resolve after cancellation')), 100);
      })
    ]);
  }, helpers);

  await run('stability mode disables incremental lazy batches', async () => {
    const card = new helpers.UniversalCard();
    card._config = {
      stability_mode: true,
      lazy_initial_batch: 2,
      lazy_batch_size: 2,
      lazy_idle_timeout: 1000
    };

    const result = card._resolveLazyBatchConfig(9);

    assert.equal(result.initialBatchSize, 9);
    assert.equal(result.batchSize, 9);
    assert.equal(result.idleTimeout, 50);
  }, helpers);

  await run('swipe gestures register directional actions against navigation hooks', async () => {
    const card = new helpers.UniversalCard();
    const container = document.createElement('div');
    let nextCalls = 0;
    let prevCalls = 0;

    card._config = {
      swipe: {
        enabled: true,
        direction: 'both',
        left: { action: 'next' },
        right: { action: 'prev' }
      }
    };
    card._carouselMode = {
      next() {
        nextCalls += 1;
      },
      prev() {
        prevCalls += 1;
      }
    };

    card._setupSwipeGestures(container);

    assert(card._swipeGestures);
    assert.equal(card._swipeGestures._listeners.left.length, 1);
    assert.equal(card._swipeGestures._listeners.right.length, 1);

    card._swipeGestures._listeners.left[0]();
    card._swipeGestures._listeners.right[0]();

    assert.equal(nextCalls, 1);
    assert.equal(prevCalls, 1);

    card._destroySwipeGestures();
    assert.equal(card._swipeGestures, null);
  }, helpers);

  await run('carousel mode reads root autoplay contract instead of legacy nested carousel object', async () => {
    const mode = new helpers.CarouselMode({
      body: { cards: [] },
      carousel_autoplay: true,
      carousel_interval: 7200
    });

    assert.equal(mode._autoplay, true);
    assert.equal(mode._interval, 7200);
    assert.equal(mode._showIndicators, true);
    assert.equal(mode._showArrows, true);
    assert.equal(mode._loop, true);
  }, helpers);

  await run('nested visibility dependencies include screen and time conditions', async () => {
    const visibility = new helpers.VisibilityConditions([
      {
        condition: 'or',
        conditions: [
          { condition: 'screen', min_width: 768 },
          { condition: 'time', after: '08:00' }
        ]
      }
    ]);

    visibility.hass = { states: {} };
    const cacheKey = visibility._generateCacheKey();

    assert.equal(visibility.hasScreenDependencies(), true);
    assert.equal(visibility.hasTimeDependencies(), true);
    assert.match(cacheKey, /screen:/);
    assert.match(cacheKey, /time:/);
  }, helpers);

  await run('visibility conditions evaluate provider-backed state and numeric attributes', async () => {
    const evaluator = new helpers.VisibilityConditions([
      {
        condition: 'state',
        entity: 'climate.office',
        attribute: 'hvac_action',
        state: 'heating'
      },
      {
        condition: 'numeric_state',
        entity: 'sensor.office_humidity',
        above: 40,
        below: 60
      }
    ]);

    evaluator.hass = helpers.createProviderContext({
      states: {
        'climate.office': {
          state: 'heat',
          attributes: {
            hvac_action: 'heating'
          }
        },
        'sensor.office_humidity': {
          state: '52',
          attributes: {}
        }
      }
    });

    assert.equal(evaluator.evaluate(), true);
  }, helpers);

  await run('state styles apply provider-backed style matches', async () => {
    const styles = new helpers.StateStyles({
      entity: 'climate.office',
      attribute: 'hvac_action',
      state_styles: {
        heating: {
          color: 'rgb(255, 0, 0)',
          class: 'is-heating'
        }
      }
    });

    const element = document.createElement('div');
    styles.hass = helpers.createProviderContext({
      states: {
        'climate.office': {
          state: 'heat',
          attributes: {
            hvac_action: 'heating'
          }
        }
      }
    });
    styles.element = element;

    assert.equal(element.style.color, 'rgb(255, 0, 0)');
    assert.equal(element.classList.contains('is-heating'), true);
  }, helpers);

  await run('shared overlay scroll lock is reference-counted', async () => {
    document.body.style.overflow = 'auto';

    helpers.acquireBodyScrollLock();
    helpers.acquireBodyScrollLock();
    assert.equal(document.body.style.overflow, 'hidden');

    helpers.releaseBodyScrollLock();
    assert.equal(document.body.style.overflow, 'hidden');

    helpers.releaseBodyScrollLock();
    assert.equal(document.body.style.overflow, 'auto');
  }, helpers);

  await run('custom css applies sanitized scoped styles', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const customCSS = new helpers.CustomCSS(shadowRoot, { allowAnimations: false });

    customCSS.applyFromConfig({
      card: '.headline { color: red; animation: pulse 1s ease; }'
    });

    const styles = customCSS.getStyles();
    assert.equal(styles.length, 1);
    assert.match(styles[0].css, /:host \.headline/);
    assert.doesNotMatch(styles[0].css, /animation:/);
  }, helpers);

  await run('header badge actions inherit badge entity and show friendly names', async () => {
    const serviceCalls = [];
    const header = new helpers.Header({
      badges: [
        {
          entity: 'light.kitchen',
          show_name: true,
          tap_action: { action: 'toggle' }
        }
      ]
    });

    header._hass = {
      states: {
        'light.kitchen': {
          state: 'on',
          attributes: {
            friendly_name: 'Kitchen Light'
          }
        }
      },
      async callService(...args) {
        serviceCalls.push(args);
      }
    };

    assert.equal(header._getBadgeLabel(header._config.badges[0]), 'Kitchen Light');

    const badgeElement = document.createElement('div');
    badgeElement.dataset.badgeIndex = '0';
    header._handleBadgeClick(badgeElement);
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.deepEqual(serviceCalls[0], ['light', 'toggle', { entity_id: 'light.kitchen' }, undefined]);
  }, helpers);

  await run('ha helpers execute provider-backed toggle actions', async () => {
    const serviceCalls = [];
    const providers = helpers.createProviderContext({
      async callService(...args) {
        serviceCalls.push(args);
      }
    });

    await helpers.haHelpers.executeAction(providers, document.body, {
      action: 'toggle',
      entity: 'light.office'
    });

    assert.deepEqual(serviceCalls[0], ['light', 'toggle', { entity_id: 'light.office' }, undefined]);
  }, helpers);

  await run('header accepts provider context for badge state and actions', async () => {
    const serviceCalls = [];
    const providers = helpers.createProviderContext({
      states: {
        'light.hallway': {
          state: 'on',
          entity_id: 'light.hallway',
          attributes: {
            friendly_name: 'Hallway'
          }
        }
      },
      async callService(...args) {
        serviceCalls.push(args);
      }
    });

    const header = new helpers.Header({
      badges: [
        {
          entity: 'light.hallway',
          show_name: true,
          tap_action: { action: 'toggle' }
        }
      ]
    });

    header.hass = providers;
    header._element = document.createElement('div');
    assert.equal(header._getBadgeLabel(header._config.badges[0]), 'Hallway');

    const badgeElement = document.createElement('div');
    badgeElement.dataset.badgeIndex = '0';
    await header._handleBadgeClick(badgeElement);
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.deepEqual(serviceCalls[0], ['light', 'toggle', { entity_id: 'light.hallway' }, undefined]);
  }, helpers);

  await run('header tap does not wait for double-tap when double-tap action is disabled', async () => {
    const header = new helpers.Header({
      expand_trigger: 'tap'
    });
    const actions = [];

    header._element = document.createElement('div');
    header._executeAction = (actionKey) => {
      actions.push(actionKey);
    };

    header._handleClick({
      target: header._element,
      preventDefault() {}
    });

    assert.deepEqual(actions, ['tap_action']);
  }, helpers);

  await run('editor icon fields use icon picker without implicit icon defaults', async () => {
    const editor = new helpers.UniversalCardEditor();
    editor._config = {};

    const iconField = editor._renderSchemaField('icon');
    const expandIconField = editor._renderSchemaField('expand_icon');

    assert.match(iconField, /ha-icon-picker/);
    assert.match(expandIconField, /ha-icon-picker/);
    assert.doesNotMatch(expandIconField, /data-value="mdi:chevron-down"/);
  }, helpers);

  await run('card executes public plugin lifecycle hooks', async () => {
    const { createPlugin, PLUGIN_HOOKS } = helpers.pluginSystemModule;
    const hookOrder = [];
    const pluginId = 'lifecycle-probe';
    const card = new helpers.UniversalCard();
    const pluginSystem = card._pluginSystem;

    pluginSystem.register(createPlugin({
      id: pluginId,
      hooks: {
        [PLUGIN_HOOKS.CONFIG_TRANSFORM]: (data) => {
          hookOrder.push('configTransform');
          return {
            config: {
              ...data.config,
              title: 'Plugin Title'
            }
          };
        },
        [PLUGIN_HOOKS.BEFORE_INIT]: () => {
          hookOrder.push('beforeInit');
        },
        [PLUGIN_HOOKS.BEFORE_RENDER]: () => {
          hookOrder.push('beforeRender');
        },
        [PLUGIN_HOOKS.AFTER_RENDER]: () => {
          hookOrder.push('afterRender');
        },
        [PLUGIN_HOOKS.AFTER_INIT]: () => {
          hookOrder.push('afterInit');
        },
        [PLUGIN_HOOKS.HASS_UPDATE]: () => {
          hookOrder.push('hassUpdate');
        },
        [PLUGIN_HOOKS.BEFORE_DESTROY]: () => {
          hookOrder.push('beforeDestroy');
        }
      }
    }));

    try {
      document.body.appendChild(card);
      card.setConfig({
        title: 'Raw Title',
        body_mode: 'none',
        body: { cards: [] }
      });

      await new Promise((resolve) => setTimeout(resolve, 25));
      assert.equal(card._config.title, 'Plugin Title');

      card.hass = { states: {} };
      await new Promise((resolve) => setTimeout(resolve, 0));
      card.remove();

      assert.ok(hookOrder.includes('configTransform'));
      assert.ok(hookOrder.includes('beforeInit'));
      assert.ok(hookOrder.includes('beforeRender'));
      assert.ok(hookOrder.includes('afterRender'));
      assert.ok(hookOrder.includes('afterInit'));
      assert.ok(hookOrder.includes('hassUpdate'));
      assert.ok(hookOrder.includes('beforeDestroy'));
      assert.ok(hookOrder.indexOf('configTransform') < hookOrder.indexOf('beforeInit'));
      assert.ok(hookOrder.indexOf('beforeRender') < hookOrder.indexOf('afterRender'));
    } finally {
      pluginSystem.unregister(pluginId);
    }
  }, helpers);

  await run('card executes public plugin render hooks for header, body, and footer', async () => {
    const { createPlugin, PLUGIN_HOOKS } = helpers.pluginSystemModule;
    const hookOrder = [];
    const pluginId = 'render-probe';
    const card = new helpers.UniversalCard();
    const pluginSystem = card._pluginSystem;

    pluginSystem.register(createPlugin({
      id: pluginId,
      hooks: {
        [PLUGIN_HOOKS.HEADER_RENDER]: (data) => {
          hookOrder.push(`header:${data.element?.className || 'missing'}`);
          return data;
        },
        [PLUGIN_HOOKS.BODY_RENDER]: (data) => {
          hookOrder.push(`body:${data.element?.className || 'missing'}`);
          return data;
        },
        [PLUGIN_HOOKS.FOOTER_RENDER]: (data) => {
          hookOrder.push(`footer:${data.element?.className || 'missing'}`);
          return data;
        }
      }
    }));

    try {
      document.body.appendChild(card);
      card.setConfig({
        title: 'Render Hooks',
        body_mode: 'expand',
        body: { cards: [] },
        footer: { text: 'Footer text' }
      });

      await new Promise((resolve) => setTimeout(resolve, 25));

      assert.ok(hookOrder.some((entry) => entry.startsWith('header:header')));
      assert.ok(hookOrder.some((entry) => entry.startsWith('body:body')));
      assert.ok(hookOrder.some((entry) => entry.startsWith('footer:footer')));
    } finally {
      pluginSystem.unregister(pluginId);
    }
  }, helpers);

  await run('window body modes remount loaded content after close and reopen', async () => {
    function findByClass(root, className) {
      if (!root) {
        return null;
      }

      if (typeof root.className === 'string' && root.className.split(/\s+/).includes(className)) {
        return root;
      }

      for (const child of root.children || []) {
        const match = findByClass(child, className);
        if (match) {
          return match;
        }
      }

      return null;
    }

    async function assertReopen(mode, overlaySelector, gridSelector) {
      let createCalls = 0;
      let populateCalls = 0;
      mode._getCardHelpers = async () => ({
        createCardElement: async () => {
          createCalls += 1;
          const card = document.createElement('div');
          card.className = 'mock-card';
          return card;
        }
      });
      const originalPopulateCards = mode._populateCards.bind(mode);
      mode._populateCards = (...args) => {
        populateCalls += 1;
        return originalPopulateCards(...args);
      };

      document.body.appendChild(mode.render());

      await mode.open();
      assert.ok(mode._overlay);
      assert.equal(mode._overlay.parentNode, document.body);
      assert.equal(mode._cards.length, 1);
      assert.equal(populateCalls, 1);
      const firstCard = mode._cards[0];

      await mode.close();
      assert.equal(mode._overlay, null);

      await mode.open();
      assert.ok(mode._overlay);
      assert.equal(mode._overlay.parentNode, document.body);
      assert.equal(mode._cards[0], firstCard);
      assert.equal(populateCalls, 2);
      assert.equal(createCalls, 1);
    }

    await assertReopen(
      new helpers.ModalMode({
        card_id: 'modal-reopen',
        body_mode: 'modal',
        title: 'Modal reopen',
        body: { cards: [{ type: 'markdown', content: 'modal body' }] }
      }),
      '.uc-modal-overlay',
      '.uc-modal-grid'
    );

    await assertReopen(
      new helpers.FullscreenMode({
        card_id: 'fullscreen-reopen',
        body_mode: 'fullscreen',
        title: 'Fullscreen reopen',
        body: { cards: [{ type: 'markdown', content: 'fullscreen body' }] }
      }),
      '.uc-fullscreen-overlay',
      '.uc-fullscreen-grid'
    );
  }, helpers);

  await run('tabs and carousel retain loaded content after close and reopen', async () => {
    function findByClass(root, className) {
      if (!root) {
        return null;
      }

      if (typeof root.className === 'string' && root.className.split(/\s+/).includes(className)) {
        return root;
      }

      for (const child of root.children || []) {
        const match = findByClass(child, className);
        if (match) {
          return match;
        }
      }

      return null;
    }

    function findAllByClass(root, className, results = []) {
      if (!root) {
        return results;
      }

      if (typeof root.className === 'string' && root.className.split(/\s+/).includes(className)) {
        results.push(root);
      }

      for (const child of root.children || []) {
        findAllByClass(child, className, results);
      }

      return results;
    }

    async function assertTabsReopen(mode) {
      let createCalls = 0;
      mode._getCardHelpers = async () => ({
        createCardElement: async () => {
          createCalls += 1;
          const card = document.createElement('div');
          card.className = 'mock-card';
          return card;
        }
      });

      document.body.appendChild(mode.render());
      await mode.open();

      const firstCard = mode._tabCards[0][0];
      assert.ok(firstCard);
      assert.equal(mode._loadedTabs[0], true);
      assert.equal(createCalls, 1);

      await mode.close();
      await mode.open();

      assert.equal(mode._tabCards[0][0], firstCard);
      assert.equal(mode._loadedTabs[0], true);
      assert.equal(createCalls, 1);
    }

    async function assertCarouselReopen(mode) {
      let createCalls = 0;
      mode._getCardHelpers = async () => ({
        createCardElement: async () => {
          createCalls += 1;
          const card = document.createElement('div');
          card.className = 'mock-card';
          return card;
        }
      });

      document.body.appendChild(mode.render());
      await mode.open();

      const firstCard = mode._cards[0];
      const firstSlide = firstCard.parentNode;
      assert.ok(firstSlide);
      assert.equal(mode._track.children.length, 2);
      assert.equal(createCalls, 2);

      await mode.close();
      await mode.open();

      assert.equal(mode._track.children.length, 2);
      assert.equal(firstCard.parentNode, firstSlide);
      assert.equal(createCalls, 2);
    }

    await assertTabsReopen(
      new helpers.TabsMode({
        card_id: 'tabs-reopen',
        body_mode: 'tabs',
        tabs: [
          {
            label: 'First',
            cards: [{ type: 'markdown', content: 'tab body' }]
          }
        ]
      })
    );

    await assertCarouselReopen(
      new helpers.CarouselMode({
        card_id: 'carousel-reopen',
        body_mode: 'carousel',
        body: {
          cards: [
            { type: 'markdown', content: 'slide one' },
            { type: 'markdown', content: 'slide two' }
          ]
        }
      })
    );
  }, helpers);

  await run('header click and action hooks can stop default execution', async () => {
    const { PluginSystem, createPlugin, PLUGIN_HOOKS } = helpers.pluginSystemModule;
    const pluginSystem = new PluginSystem();
    const hookOrder = [];
    const navigationCalls = [];
    const originalPushState = history.pushState;

    history.pushState = (...args) => {
      navigationCalls.push(args);
    };

    pluginSystem.register(createPlugin({
      id: 'header-interaction-probe',
      hooks: {
        [PLUGIN_HOOKS.CLICK]: (data) => {
          hookOrder.push(`click:${data.interaction}`);
          return data;
        },
        [PLUGIN_HOOKS.ACTION_EXECUTE]: (data) => {
          hookOrder.push(`action:${data.action.action}`);
          return { stop: true };
        }
      }
    }));

    try {
      const header = new helpers.Header({
        tap_action: {
          action: 'navigate',
          navigation_path: '/plugin-hook-test'
        }
      }, {
        executePluginHookSync: (hookName, data, context) => pluginSystem.executeHookSync(hookName, data, context)
      });

      header._element = document.createElement('div');
      header._handleClick({
        target: header._element,
        preventDefault() {}
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      assert.deepEqual(hookOrder, ['click:tap', 'action:navigate']);
      assert.equal(navigationCalls.length, 0);
    } finally {
      history.pushState = originalPushState;
    }
  }, helpers);

  await run('footer hold and action hooks execute through plugin bridge', async () => {
    const { PluginSystem, createPlugin, PLUGIN_HOOKS } = helpers.pluginSystemModule;
    const pluginSystem = new PluginSystem();
    const hookOrder = [];
    const navigationCalls = [];
    const originalPushState = history.pushState;

    history.pushState = (...args) => {
      navigationCalls.push(args);
    };

    pluginSystem.register(createPlugin({
      id: 'footer-interaction-probe',
      hooks: {
        [PLUGIN_HOOKS.HOLD]: (data) => {
          hookOrder.push(`hold:${data.interaction}`);
          return data;
        },
        [PLUGIN_HOOKS.ACTION_EXECUTE]: (data) => {
          hookOrder.push(`action:${data.action.action}`);
          return data;
        }
      }
    }));

    try {
      const footer = new helpers.Footer({
        hold_action: {
          action: 'navigate',
          navigation_path: '/footer-hook-test'
        }
      }, {
        executePluginHookSync: (hookName, data, context) => pluginSystem.executeHookSync(hookName, data, context)
      });

      footer._element = document.createElement('div');
      footer._holdDuration = 0;
      footer._handleMouseDown({
        button: 0,
        target: footer._element
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      assert.deepEqual(hookOrder, ['hold:hold', 'action:navigate']);
      assert.equal(navigationCalls.length, 1);
    } finally {
      history.pushState = originalPushState;
    }
  }, helpers);

  await run('footer executes action buttons through provider context', async () => {
    const serviceCalls = [];
    const footer = new helpers.Footer({
      actions: [
        {
          action: 'call-service',
          service: 'light.turn_on',
          service_data: { brightness: 120 },
          target: { entity_id: 'light.kitchen' }
        }
      ]
    });

    footer.hass = helpers.createProviderContext({
      async callService(...args) {
        serviceCalls.push(args);
      }
    });
    footer._element = document.createElement('div');

    footer._handleActionClick({
      currentTarget: {
        dataset: {
          actionIndex: '0'
        }
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.deepEqual(serviceCalls[0], ['light', 'turn_on', { brightness: 120 }, { entity_id: 'light.kitchen' }]);
  }, helpers);

  await run('badges compute counter values from provider context state registry', async () => {
    const badges = new helpers.Badges([
      {
        type: 'counter',
        domain: 'light',
        state: 'on'
      }
    ]);

    badges.hass = helpers.createProviderContext({
      states: {
        'light.kitchen': { state: 'on', attributes: {} },
        'light.office': { state: 'off', attributes: {} },
        'light.hallway': { state: 'on', attributes: {} }
      }
    });

    assert.equal(badges._getCounterValue(badges._configs[0]), 2);
  }, helpers);

  await run('image widget disconnects lazy observer for non-camera sources', async () => {
    const widget = new helpers.ImageEntity({}, {
      url: '/local/test.jpg',
      lazy_load: true
    });

    widget._element = document.createElement('div');
    widget._loadImage = () => {};
    widget._setupLazyLoad();

    assert(lastIntersectionObserver);
    lastIntersectionObserver.callback([{ isIntersecting: true }]);
    assert.equal(lastIntersectionObserver.disconnected, true);
  }, helpers);

  await run('image widget prefers entity_picture for cameras', async () => {
    const widget = new helpers.ImageEntity({
      states: {
        'camera.front': {
          attributes: {
            entity_picture: '/api/camera_proxy/camera.front?token=abc'
          }
        }
      }
    }, {
      entity_id: 'camera.front',
      lazy_load: false
    });

    assert.equal(
      widget._getImageUrl(),
      '/api/camera_proxy/camera.front?token=abc'
    );
    assert.equal(widget._getSourceType(), helpers.SOURCE_TYPES.CAMERA);
  }, helpers);

  await run('rest widget resolves templates and uses provider http transport', async () => {
    const requests = [];
    const providerContext = helpers.createProviderContext({
      states: {
        'sensor.office_temperature': {
          state: '23'
        }
      }
    }, {
      fetcher: async (url, init) => {
        requests.push({ url, init });
        return {
          ok: true,
          headers: {
            get(name) {
              return name === 'content-type' ? 'application/json' : null;
            }
          },
          async json() {
            return { value: 23 };
          }
        };
      }
    });

    const widget = new helpers.RestApiWidget(providerContext, {
      url: 'https://api.example.test/{{ sensor.office_temperature }}',
      value_path: 'value'
    });

    widget._element = document.createElement('div');
    await widget._fetchData();

    assert.equal(requests.length, 1);
    assert.equal(requests[0].url, 'https://api.example.test/23');
    assert.equal(widget._data.value, 23);
  }, helpers);

  await run('media widget routes actions through provider services', async () => {
    const serviceCalls = [];
    const widget = new helpers.MediaPlayerMini(helpers.createProviderContext({
      states: {
        'media_player.living_room': {
          state: 'playing',
          attributes: {
            media_title: 'Track',
            media_duration: 60,
            media_position: 10
          }
        }
      },
      async callService(...args) {
        serviceCalls.push(args);
      }
    }), {
      entity_id: 'media_player.living_room'
    });

    widget._handleAction('play_pause');
    widget._setVolume(0.25);

    assert.deepEqual(serviceCalls[0], ['media_player', 'media_play_pause', { entity_id: 'media_player.living_room' }, undefined]);
    assert.deepEqual(serviceCalls[1], ['media_player', 'volume_set', { entity_id: 'media_player.living_room', volume_level: 0.25 }, undefined]);
  }, helpers);

  await run('notification center reloads on persistent notification events', async () => {
    const subscribers = new Map();
    let loadCount = 0;
    const widget = new helpers.NotificationCenter(helpers.createProviderContext({
      async callWS() {
        loadCount += 1;
        return {};
      },
      async callService() {},
      connection: {
        async subscribeEvents(callback, eventType) {
          subscribers.set(eventType, callback);
          return () => subscribers.delete(eventType);
        }
      }
    }), {});

    widget._element = document.createElement('div');
    await widget._loadNotifications();
    widget._subscribeToUpdates();
    await new Promise((resolve) => setTimeout(resolve, 0));

    subscribers.get('call_service')({
      data: {
        domain: 'persistent_notification'
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(loadCount, 2);
    widget.destroy();
    assert.equal(subscribers.size, 0);
  }, helpers);

  await run('quick actions route service and event calls through providers', async () => {
    const serviceCalls = [];
    const apiCalls = [];
    const quickActions = new helpers.QuickActions(helpers.createProviderContext({
      states: {
        'light.kitchen': {
          state: 'on',
          attributes: {}
        }
      },
      async callService(...args) {
        serviceCalls.push(args);
      },
      async callApi(...args) {
        apiCalls.push(args);
      }
    }));

    quickActions.setActions([
      { id: 'toggle', type: helpers.ACTION_TYPES.TOGGLE, entity_id: 'light.kitchen' },
      { id: 'event', type: helpers.ACTION_TYPES.FIRE_EVENT, event: 'doorbell', event_data: { level: 1 } }
    ]);

    assert.equal(quickActions._isActionActive(quickActions._actions[0]), true);
    await quickActions._executeAction(quickActions._actions[0]);
    await quickActions._executeAction(quickActions._actions[1]);

    assert.deepEqual(serviceCalls[0], ['light', 'toggle', { entity_id: 'light.kitchen' }, undefined]);
    assert.deepEqual(apiCalls[0], ['POST', 'events/doorbell', { level: 1 }]);
  }, helpers);

  await run('entity preview fetches history through provider api and caches it', async () => {
    const apiCalls = [];
    const preview = new helpers.EntityPreview(helpers.createProviderContext({
      states: {
        'sensor.temperature': {
          state: '22',
          attributes: {
            friendly_name: 'Temperature',
            unit_of_measurement: 'C'
          }
        }
      },
      async callApi(method, path) {
        apiCalls.push([method, path]);
        return [[
          { last_changed: '2026-03-07T10:00:00.000Z', state: '20' },
          { last_changed: '2026-03-07T11:00:00.000Z', state: '22' }
        ]];
      }
    }));

    const first = await preview._fetchHistory('sensor.temperature');
    const second = await preview._fetchHistory('sensor.temperature');

    assert.equal(apiCalls.length, 1);
    assert.equal(first.length, 2);
    assert.deepEqual(first, second);
  }, helpers);

  await run('alerts trigger provider-backed service actions on state changes', async () => {
    const serviceCalls = [];
    const alerts = new helpers.Alerts({
      states: {
        'sensor.server_temp': {
          state: '60',
          entity_id: 'sensor.server_temp',
          attributes: {
            friendly_name: 'Server Temp'
          }
        }
      },
      async callService(...args) {
        serviceCalls.push(args);
      }
    });

    alerts.register('server-temp', {
      entity_id: 'sensor.server_temp',
      condition: helpers.ALERT_CONDITIONS.ABOVE,
      value: 70,
      actions: ['service'],
      service: 'script.turn_on',
      service_data: { entity_id: 'script.cooling_alert' }
    });

    alerts.hass = {
      states: {
        'sensor.server_temp': {
          state: '80',
          entity_id: 'sensor.server_temp',
          attributes: {
            friendly_name: 'Server Temp'
          }
        }
      },
      async callService(...args) {
        serviceCalls.push(args);
      }
    };

    assert.deepEqual(serviceCalls[0], ['script', 'turn_on', { entity_id: 'script.cooling_alert' }, undefined]);
    assert.equal(alerts.getActiveAlerts().length, 1);
  }, helpers);

  await run('timer uses provider-backed entity state and services', async () => {
    const serviceCalls = [];
    const finishTime = new Date(Date.now() + 90 * 1000).toISOString();
    const timer = new helpers.Timer(helpers.createProviderContext({
      states: {
        'timer.coffee': {
          state: 'active',
          attributes: {
            finishes_at: finishTime
          }
        }
      },
      async callService(...args) {
        serviceCalls.push(args);
      }
    }), {
      mode: helpers.TIMER_MODES.TIMER,
      entity_id: 'timer.coffee',
      end_action: {
        service: 'script.turn_on',
        service_data: { entity_id: 'script.timer_done' }
      }
    });

    assert(timer._getRemainingFromEntity() > 0);
    timer.start();
    timer._executeEndAction();

    assert.deepEqual(serviceCalls[0], ['timer', 'start', { entity_id: 'timer.coffee' }, undefined]);
    assert.deepEqual(serviceCalls[1], ['script', 'turn_on', { entity_id: 'script.timer_done' }, undefined]);
  }, helpers);

  await run('icon mapping resolves presets from provider-backed entity state', async () => {
    const iconMapping = new helpers.IconMapping({
      states: {
        'light.kitchen': {
          state: 'on',
          entity_id: 'light.kitchen',
          attributes: {}
        }
      }
    });

    const resolved = iconMapping.getIconAndColor('light.kitchen');

    assert.equal(resolved.icon, 'mdi:lightbulb');
    assert.equal(typeof resolved.color, 'string');
  }, helpers);

  console.log('[test:unit] OK');
}

main().catch((error) => {
  console.error('[test:unit] FAILED');
  console.error(error);
  process.exit(1);
});
