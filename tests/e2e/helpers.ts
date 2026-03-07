import { expect, type Page } from '@playwright/test';

export const HASS_FIXTURE = {
  states: {
    'sensor.demo': {
      entity_id: 'sensor.demo',
      state: '42',
      attributes: {
        friendly_name: 'Demo sensor'
      }
    },
    'light.kitchen': {
      entity_id: 'light.kitchen',
      state: 'on',
      attributes: {
        friendly_name: 'Kitchen light'
      }
    },
    'media_player.living_room': {
      entity_id: 'media_player.living_room',
      state: 'playing',
      attributes: {
        friendly_name: 'Living room player',
        volume_level: 0.25
      }
    }
  },
  user: {
    name: 'Playwright',
    is_admin: true,
    is_owner: true
  }
};

export async function bootstrapUniversalCardPage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const globalWindow = window as typeof window & {
      loadCardHelpers?: () => Promise<{ createCardElement: (config: Record<string, unknown>) => Promise<HTMLElement> }>;
      alertMessages?: string[];
    };

    const ensureElement = (tagName: string, factory: () => CustomElementConstructor) => {
      if (!customElements.get(tagName)) {
        customElements.define(tagName, factory());
      }
    };

    const makeCardElement = () => class extends HTMLElement {
      _config?: Record<string, unknown>;
      _hass?: unknown;

      setConfig(config: Record<string, unknown>) {
        this._config = config;
        this.textContent =
          typeof config.content === 'string' ? config.content
            : typeof config.title === 'string' ? config.title
              : typeof config.entity === 'string' ? config.entity
                : typeof config.type === 'string' ? config.type
                  : 'card';
      }

      set hass(value: unknown) {
        this._hass = value;
      }
    };

    ensureElement('ha-card', () => class extends HTMLElement {});
    ensureElement('ha-icon', () => class extends HTMLElement {});
    ensureElement('hui-markdown-card', makeCardElement);
    ensureElement('test-card', makeCardElement);
    ensureElement('hui-card-picker', () => class extends HTMLElement {
      hass?: unknown;
      lovelace?: unknown;
      path?: unknown[];
    });
    ensureElement('ha-icon-picker', () => class extends HTMLElement {
      value = '';
    });

    globalWindow.customCards = [{ type: 'custom:test-card' }];
    globalWindow.alertMessages = [];
    globalWindow.alert = (message?: string) => {
      globalWindow.alertMessages?.push(String(message ?? ''));
    };
    globalWindow.confirm = () => true;

    if (!globalWindow.matchMedia) {
      globalWindow.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return false;
        }
      });
    }

    if (!globalWindow.requestIdleCallback) {
      globalWindow.requestIdleCallback = ((callback: IdleRequestCallback) => {
        return globalWindow.setTimeout(() => {
          callback({
            didTimeout: false,
            timeRemaining: () => 50
          });
        }, 0);
      }) as typeof globalWindow.requestIdleCallback;
    }

    if (!globalWindow.cancelIdleCallback) {
      globalWindow.cancelIdleCallback = ((handle: number) => {
        globalWindow.clearTimeout(handle);
      }) as typeof globalWindow.cancelIdleCallback;
    }

    if (!globalWindow.ResizeObserver) {
      globalWindow.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      } as typeof ResizeObserver;
    }

    if (!globalWindow.IntersectionObserver) {
      globalWindow.IntersectionObserver = class {
        _callback: IntersectionObserverCallback;

        constructor(callback: IntersectionObserverCallback) {
          this._callback = callback;
        }

        observe(target: Element) {
          this._callback([
            {
              isIntersecting: true,
              target
            } as IntersectionObserverEntry
          ], this as unknown as IntersectionObserver);
        }

        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
        root = null;
        rootMargin = '';
        thresholds = [0];
      } as typeof IntersectionObserver;
    }

    if (!HTMLElement.prototype.scrollIntoView) {
      HTMLElement.prototype.scrollIntoView = function scrollIntoView() {};
    }

    globalWindow.loadCardHelpers = async () => ({
      createCardElement: async (config: Record<string, unknown>) => {
        const rawType = typeof config.type === 'string' ? config.type : '';
        const tagName = rawType.startsWith('custom:')
          ? rawType.slice(7)
          : `hui-${rawType}-card`;

        if (!customElements.get(tagName)) {
          customElements.define(tagName, makeCardElement());
        }

        const element = document.createElement(tagName) as HTMLElement & {
          setConfig?: (value: Record<string, unknown>) => void;
        };
        element.setConfig?.(config);
        return element;
      }
    });
  });

  await page.goto('/tests/e2e/fixture.html');
  await page.addScriptTag({ url: '/universal-card.js' });
  await page.waitForFunction(() => Boolean(window.UniversalCard));
}

export async function mountCard(page: Page, config: Record<string, unknown>, hass = HASS_FIXTURE): Promise<void> {
  await page.evaluate(({ cardConfig, hassState }) => {
    const host = document.getElementById('app');
    if (!host) {
      throw new Error('Host element not found');
    }

    host.innerHTML = '';
    const card = document.createElement('universal-card') as HTMLElement & {
      setConfig: (value: Record<string, unknown>) => void;
      hass: unknown;
    };
    card.setConfig(cardConfig);
    card.hass = hassState;
    host.appendChild(card);
  }, { cardConfig: config, hassState: hass });

  await page.waitForFunction(() => {
    const card = document.querySelector('universal-card') as HTMLElement & { shadowRoot?: ShadowRoot | null };
    return Boolean(card?.shadowRoot);
  });
}

export async function mountEditor(page: Page, config: Record<string, unknown>, hass = HASS_FIXTURE): Promise<void> {
  await page.evaluate(({ editorConfig, hassState }) => {
    const host = document.getElementById('app');
    if (!host) {
      throw new Error('Host element not found');
    }

    host.innerHTML = '';
    const editor = document.createElement('universal-card-editor') as HTMLElement & {
      setConfig: (value: Record<string, unknown>) => void;
      hass: unknown;
    };
    editor.hass = hassState;
    editor.setConfig(editorConfig);
    host.appendChild(editor);
  }, { editorConfig: config, hassState: hass });

  await page.waitForFunction(() => Boolean(document.querySelector('universal-card-editor-real')));
}

export async function expectCardConfigValue<T>(page: Page, reader: string | ((value: any) => T), expected: T): Promise<void> {
  await expect.poll(async () => {
    return page.locator('universal-card').evaluate((element, expression) => {
      const card = element as HTMLElement & Record<string, unknown>;
      if (typeof expression === 'string') {
        return card[expression];
      }
      return null;
    }, reader as string);
  }).toEqual(expected);
}

export async function getEditorConfig(page: Page): Promise<Record<string, any>> {
  return page.locator('universal-card-editor-real').evaluate((element) => {
    const editor = element as HTMLElement & { _config?: Record<string, any> };
    return JSON.parse(JSON.stringify(editor._config || {}));
  });
}
