const MISSING = Symbol('missing');

function toDataAttributeKey(key) {
  return `data-${String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

function toDatasetKey(attributeName) {
  return attributeName
    .slice(5)
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function parseSimpleSelector(selector) {
  const trimmed = selector.trim();
  const tagMatch = trimmed.match(/^[a-zA-Z0-9-]+/);
  const idMatch = trimmed.match(/#([a-zA-Z0-9_-]+)/);
  const classMatches = [...trimmed.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((match) => match[1]);
  const attrMatches = [];

  trimmed.replace(/\[([^\]=]+)(?:=["']?([^"'\]]+)["']?)?\]/g, (_, name, value) => {
    attrMatches.push({ name, value, hasValue: value !== undefined });
    return '';
  });

  return {
    tagName: tagMatch ? tagMatch[0].toUpperCase() : null,
    id: idMatch ? idMatch[1] : null,
    classes: classMatches,
    attributes: attrMatches
  };
}

function matchesSimpleSelector(element, selector) {
  if (!(element instanceof FakeElement)) {
    return false;
  }

  const parsed = parseSimpleSelector(selector);

  if (parsed.tagName && element.tagName !== parsed.tagName) {
    return false;
  }

  if (parsed.id && element.getAttribute('id') !== parsed.id) {
    return false;
  }

  if (parsed.classes.some((className) => !element.classList.contains(className))) {
    return false;
  }

  return parsed.attributes.every(({ name, value, hasValue }) => {
    const attributeValue = element.getAttribute(name);
    if (!hasValue) {
      return attributeValue !== undefined;
    }

    return attributeValue === value;
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

class FakeClassList {
  constructor(element) {
    this._element = element;
    this._tokens = new Set();
  }

  add(...tokens) {
    tokens.filter(Boolean).forEach((token) => this._tokens.add(token));
    this._sync();
  }

  remove(...tokens) {
    tokens.forEach((token) => this._tokens.delete(token));
    this._sync();
  }

  contains(token) {
    return this._tokens.has(token);
  }

  toggle(token, force) {
    if (force === true) {
      this._tokens.add(token);
      this._sync();
      return true;
    }

    if (force === false) {
      this._tokens.delete(token);
      this._sync();
      return false;
    }

    if (this._tokens.has(token)) {
      this._tokens.delete(token);
      this._sync();
      return false;
    }

    this._tokens.add(token);
    this._sync();
    return true;
  }

  _replaceFromString(value) {
    this._tokens = new Set(String(value).split(/\s+/).filter(Boolean));
  }

  _sync() {
    this._element._className = Array.from(this._tokens).join(' ');
  }
}

class FakeElement extends EventTarget {
  constructor(tagName = 'div') {
    super();
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.parentElement = null;
    this.attributes = {};
    this.style = new FakeStyle();
    this.textContent = '';
    this.offsetLeft = 0;
    this.offsetWidth = 0;
    this.isConnected = false;
    this.shadowRoot = null;
    this.host = null;
    this._className = '';
    this._innerHTML = '';
    this.classList = new FakeClassList(this);
    this.dataset = new Proxy({}, {
      get: (_, key) => this.attributes[toDataAttributeKey(key)] ?? undefined,
      set: (_, key, value) => {
        this.attributes[toDataAttributeKey(key)] = String(value);
        return true;
      },
      ownKeys: () => Object.keys(this.attributes)
        .filter((key) => key.startsWith('data-'))
        .map((key) => toDatasetKey(key)),
      getOwnPropertyDescriptor: () => ({
        enumerable: true,
        configurable: true
      })
    });

    Object.defineProperty(this, 'className', {
      configurable: true,
      get: () => this._className,
      set: (value) => {
        this._className = String(value);
        this.classList._replaceFromString(this._className);
      }
    });

    Object.defineProperty(this, 'innerHTML', {
      configurable: true,
      get: () => this._innerHTML,
      set: (value) => {
        this._innerHTML = String(value);
        this.children.slice().forEach((child) => this.removeChild(child));
      }
    });
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
    child._setConnected(this.isConnected);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }

    if (child) {
      child.parentNode = null;
      child.parentElement = null;
      child._setConnected(false);
    }

    return child;
  }

  remove() {
    this.parentNode?.removeChild?.(this);
  }

  contains(node) {
    if (node === this) return true;
    return this.children.some((child) => child.contains?.(node));
  }

  attachShadow() {
    this.shadowRoot = new FakeElement('shadow-root');
    this.shadowRoot.host = this;
    this.shadowRoot._setConnected(this.isConnected);
    return this.shadowRoot;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'class') {
      this.className = value;
    }
    if (name.startsWith('data-')) {
      this.dataset[toDatasetKey(name)] = String(value);
    }
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const selectorGroups = selector
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.split(/\s+/));
    const results = [];
    const seen = new Set();

    const visit = (node) => {
      node.children.forEach((child) => {
        if (selectorGroups.some((selectors) => matchesSelectorChain(child, selectors)) && !seen.has(child)) {
          results.push(child);
          seen.add(child);
        }
        visit(child);
      });

      if (node.shadowRoot) {
        visit(node.shadowRoot);
      }
    };

    visit(this);
    return results;
  }

  matches(selector) {
    return matchesSimpleSelector(this, selector);
  }

  closest(selector) {
    let current = this;

    while (current) {
      if (current instanceof FakeElement && current.matches(selector)) {
        return current;
      }
      current = current.parentElement;
    }

    return null;
  }

  focus() {
    if (globalThis.document) {
      globalThis.document.activeElement = this;
    }
  }

  _setConnected(isConnected) {
    this.isConnected = isConnected;
    this.children.forEach((child) => child._setConnected(isConnected));
    if (this.shadowRoot) {
      this.shadowRoot._setConnected(isConnected);
    }
  }
}

class FakeHTMLElement extends FakeElement {}
class FakeDocumentFragment extends FakeElement {}

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.body = new FakeHTMLElement('body');
    this.body._setConnected(true);
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

class FakeStorage {
  constructor() {
    this._store = new Map();
  }

  getItem(key) {
    return this._store.has(key) ? this._store.get(key) : null;
  }

  setItem(key, value) {
    this._store.set(String(key), String(value));
  }

  removeItem(key) {
    this._store.delete(String(key));
  }

  clear() {
    this._store.clear();
  }
}

class FakeCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type, options);
    this.detail = options.detail;
  }
}

class FakeWindow extends EventTarget {
  constructor(document) {
    super();
    this.document = document;
    this.location = {
      pathname: '/lovelace/0',
      search: '',
      hash: '',
      href: 'http://localhost/lovelace/0'
    };
    this.history = {
      pushState() {},
      replaceState() {}
    };
    this.navigator = {
      userAgent: 'vitest-node'
    };
    this.localStorage = new FakeStorage();
    const customElementRegistry = new Map();
    this.customElements = {
      define(name, constructor) {
        customElementRegistry.set(String(name), constructor);
      },
      get(name) {
        return customElementRegistry.get(String(name));
      }
    };
    this.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0);
    this.cancelAnimationFrame = (id) => clearTimeout(id);
    this.requestIdleCallback = (callback, options = {}) => setTimeout(
      () => callback({ didTimeout: false, timeRemaining: () => 50 }),
      Math.min(options.timeout || 1, 10)
    );
    this.cancelIdleCallback = (id) => clearTimeout(id);
    this.matchMedia = (query) => ({
      matches: false,
      media: query,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() {
        return false;
      }
    });
    this.getComputedStyle = () => ({});
    this.ResizeObserver = class ResizeObserver {
      disconnect() {}
      observe() {}
      unobserve() {}
    };
    this.IntersectionObserver = class IntersectionObserver {
      disconnect() {}
      observe() {}
      unobserve() {}
    };
  }
}

const GLOBAL_BINDINGS = [
  'window',
  'document',
  'customElements',
  'HTMLElement',
  'HTMLInputElement',
  'HTMLSelectElement',
  'HTMLTextAreaElement',
  'HTMLButtonElement',
  'Element',
  'Node',
  'DocumentFragment',
  'Event',
  'CustomEvent',
  'MutationObserver',
  'navigator',
  'localStorage',
  'history',
  'location',
  'getComputedStyle',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'requestIdleCallback',
  'cancelIdleCallback',
  'ResizeObserver',
  'IntersectionObserver'
];

function defineGlobalProperty(key, value) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value
  });
}

export function installDomEnvironment() {
  const document = new FakeDocument();
  const window = new FakeWindow(document);

  const previousValues = new Map();
  GLOBAL_BINDINGS.forEach((key) => {
    previousValues.set(key, key in globalThis ? globalThis[key] : MISSING);
  });

  defineGlobalProperty('window', window);
  defineGlobalProperty('document', document);
  defineGlobalProperty('customElements', window.customElements);
  defineGlobalProperty('HTMLElement', FakeHTMLElement);
  defineGlobalProperty('HTMLInputElement', FakeHTMLElement);
  defineGlobalProperty('HTMLSelectElement', FakeHTMLElement);
  defineGlobalProperty('HTMLTextAreaElement', FakeHTMLElement);
  defineGlobalProperty('HTMLButtonElement', FakeHTMLElement);
  defineGlobalProperty('Element', FakeElement);
  defineGlobalProperty('Node', FakeElement);
  defineGlobalProperty('DocumentFragment', FakeDocumentFragment);
  defineGlobalProperty('Event', globalThis.Event || Event);
  defineGlobalProperty('CustomEvent', globalThis.CustomEvent || FakeCustomEvent);
  defineGlobalProperty('MutationObserver', class MutationObserver {
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
  });
  defineGlobalProperty('navigator', window.navigator);
  defineGlobalProperty('localStorage', window.localStorage);
  defineGlobalProperty('history', window.history);
  defineGlobalProperty('location', window.location);
  defineGlobalProperty('getComputedStyle', window.getComputedStyle.bind(window));
  defineGlobalProperty('requestAnimationFrame', window.requestAnimationFrame.bind(window));
  defineGlobalProperty('cancelAnimationFrame', window.cancelAnimationFrame.bind(window));
  defineGlobalProperty('requestIdleCallback', window.requestIdleCallback.bind(window));
  defineGlobalProperty('cancelIdleCallback', window.cancelIdleCallback.bind(window));
  defineGlobalProperty('ResizeObserver', window.ResizeObserver);
  defineGlobalProperty('IntersectionObserver', window.IntersectionObserver);

  return () => {
    GLOBAL_BINDINGS.forEach((key) => {
      const previousValue = previousValues.get(key);
      if (previousValue === MISSING) {
        delete globalThis[key];
        return;
      }

      defineGlobalProperty(key, previousValue);
    });
  };
}
