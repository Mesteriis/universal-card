import { chromium } from '@playwright/test';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const docsImgDir = resolve(root, 'docs/img');
const tempDir = resolve(root, 'tests/screenshots/output/docs-assets');
const editorPort = Number(process.env.DOCS_EDITOR_PORT || 4173);
const fixtureBaseUrl = process.env.HA_FIXTURE_URL || 'http://127.0.0.1:8123';
const editorBaseUrl = `http://127.0.0.1:${editorPort}`;
const fixtureUsername = process.env.HA_FIXTURE_USERNAME || 'fixture';
const fixturePassword = process.env.HA_FIXTURE_PASSWORD || 'fixture-pass-123';
const fixtureDashboardPath = '/fixture-dashboard';
const viewport = { width: 1600, height: 1400 };

const EDITOR_FIXTURE = {
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
    name: 'Docs Capture',
    is_admin: true,
    is_owner: true
  }
};

function runStep(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if ((result.status ?? 1) !== 0) {
    throw new Error(`[docs-assets] command failed: ${command} ${args.join(' ')}`);
  }
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function resetDir(path) {
  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

function copyFile(source, target) {
  cpSync(source, target, { force: true });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clipFromBox(box, padding = { top: 40, right: 48, bottom: 48, left: 48 }) {
  const x = clamp(Math.floor(box.x - padding.left), 0, viewport.width);
  const y = clamp(Math.floor(box.y - padding.top), 0, viewport.height);
  const width = clamp(Math.ceil(box.width + padding.left + padding.right), 1, viewport.width - x);
  const height = clamp(Math.ceil(box.height + padding.top + padding.bottom), 1, viewport.height - y);
  return { x, y, width, height };
}

async function sleep(ms) {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function waitForHttp(url, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 401) {
        return;
      }
    } catch (error) {
      // keep waiting
    }
    await sleep(500);
  }
  throw new Error(`[docs-assets] timed out waiting for ${url}`);
}

async function ensureLoggedIn(page) {
  await page.goto('/', { waitUntil: 'networkidle' });

  const loginField = page.getByRole('textbox', { name: /Username/i });
  const loginVisible = await loginField.waitFor({ state: 'visible', timeout: 15000 })
    .then(() => true)
    .catch(() => false);

  if (!loginVisible) {
    return;
  }

  await loginField.fill(fixtureUsername);
  await page.getByRole('textbox', { name: /Password/i }).fill(fixturePassword);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL((url) => !url.pathname.startsWith('/auth'), { timeout: 30000 });
}

async function openFixtureDashboard(page) {
  await page.locator(`a[href="${fixtureDashboardPath}"]`).click();
  await page.waitForURL(`${fixtureDashboardPath}/overview`, { timeout: 30000 });
}

async function navigateFixtureView(page, path) {
  await page.evaluate((nextPath) => {
    window.history.pushState(null, '', nextPath);
    window.dispatchEvent(new Event('location-changed'));
  }, path);
  await page.waitForFunction((expectedPath) => window.location.pathname === expectedPath, path);
  await sleep(600);
}

async function getCard(page, viewPath, index) {
  await navigateFixtureView(page, `${fixtureDashboardPath}/${viewPath}`);
  const card = page.locator('universal-card').nth(index);
  await card.waitFor({ state: 'attached', timeout: 30000 });
  await card.scrollIntoViewIfNeeded();
  await card.waitFor({ state: 'visible', timeout: 30000 });
  await sleep(500);
  return card;
}

async function expandCard(card) {
  await card.evaluate(async (element) => {
    if (element && typeof element._expand === 'function' && !element._expanded) {
      await element._expand();
    }
  });
}

async function screenshotCard(page, viewPath, index, outputName, options = {}) {
  const card = await getCard(page, viewPath, index);
  if (options.expand) {
    await expandCard(card);
    await sleep(options.openDelayMs ?? 1400);
  } else {
    await sleep(options.openDelayMs ?? 500);
  }
  await card.screenshot({ path: resolve(docsImgDir, outputName) });
}

async function captureModalGif(page) {
  const card = await getCard(page, 'modes', 0);
  await card.click();

  const dialog = page.locator('.uc-modal-dialog');
  await dialog.waitFor({ state: 'visible', timeout: 30000 });
  await sleep(400);
  const dialogBox = await dialog.boundingBox();
  if (!dialogBox) {
    throw new Error('[docs-assets] modal dialog bounding box is not available');
  }

  const clip = clipFromBox(dialogBox);
  await page.locator('.uc-modal-close').click();
  await dialog.waitFor({ state: 'hidden', timeout: 30000 });
  await sleep(300);

  const framesDir = resolve(tempDir, 'modal-frames');
  resetDir(framesDir);

  for (let i = 0; i < 2; i += 1) {
    await page.screenshot({ path: resolve(framesDir, `frame-${String(i).padStart(2, '0')}.png`), clip });
    await sleep(40);
  }

  await card.click();
  for (let i = 2; i < 14; i += 1) {
    await sleep(60);
    await page.screenshot({ path: resolve(framesDir, `frame-${String(i).padStart(2, '0')}.png`), clip });
  }

  await dialog.waitFor({ state: 'visible', timeout: 30000 });
  await sleep(400);
  await page.screenshot({ path: resolve(framesDir, 'frame-14.png'), clip });
  await page.screenshot({ path: resolve(framesDir, 'frame-15.png'), clip });

  const gifPath = resolve(docsImgDir, 'modal-open-dark.gif');
  const palettePath = resolve(framesDir, 'palette.png');

  runStep('ffmpeg', [
    '-y',
    '-framerate',
    '12',
    '-i',
    join(framesDir, 'frame-%02d.png'),
    '-update',
    '1',
    '-frames:v',
    '1',
    '-vf',
    'palettegen',
    palettePath
  ]);

  runStep('ffmpeg', [
    '-y',
    '-framerate',
    '12',
    '-i',
    join(framesDir, 'frame-%02d.png'),
    '-i',
    palettePath,
    '-lavfi',
    'paletteuse=dither=bayer:bayer_scale=5',
    gifPath
  ]);

  copyFile(gifPath, resolve(docsImgDir, 'body-modes-demo.gif'));
  copyFile(gifPath, resolve(docsImgDir, 'hero-demo.gif'));
  await page.locator('.uc-modal-close').click();
  await dialog.waitFor({ state: 'hidden', timeout: 30000 });
}

async function captureFullscreen(page) {
  const card = await getCard(page, 'modes', 3);
  await card.click();
  const overlay = page.locator('.uc-fullscreen-inner');
  await overlay.waitFor({ state: 'visible', timeout: 30000 });
  await sleep(400);
  const header = page.locator('.uc-fullscreen-header');
  const contentItems = page.locator('.uc-fullscreen-content > *');
  const lastContentItem = contentItems.last();
  const [headerBox, contentBox] = await Promise.all([
    header.boundingBox(),
    lastContentItem.boundingBox()
  ]);

  if (!headerBox || !contentBox) {
    throw new Error('[docs-assets] fullscreen content bounding box is not available');
  }

  const unionBox = {
    x: Math.min(headerBox.x, contentBox.x),
    y: Math.min(headerBox.y, contentBox.y),
    width: Math.max(headerBox.x + headerBox.width, contentBox.x + contentBox.width) - Math.min(headerBox.x, contentBox.x),
    height: Math.max(headerBox.y + headerBox.height, contentBox.y + contentBox.height) - Math.min(headerBox.y, contentBox.y)
  };
  const clip = clipFromBox(unionBox, { top: 16, right: 24, bottom: 24, left: 24 });

  await page.screenshot({ path: resolve(docsImgDir, 'fullscreen-mode-dark.png'), clip });
  await page.locator('.uc-fullscreen-back').click();
  await overlay.waitFor({ state: 'hidden', timeout: 30000 });
}

async function captureSubview(page) {
  await navigateFixtureView(page, `${fixtureDashboardPath}/details`);
  await screenshotCard(page, 'details', 0, 'subview-details-dark.png');
}

function contentTypeFor(path) {
  const extension = extname(path).toLowerCase();
  if (extension === '.html') return 'text/html; charset=utf-8';
  if (extension === '.js') return 'application/javascript; charset=utf-8';
  if (extension === '.css') return 'text/css; charset=utf-8';
  if (extension === '.json') return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

function startStaticServer() {
  const server = createServer(async (request, response) => {
    const requestPath = request.url?.split('?')[0] || '/';
    const safePath = requestPath === '/' ? '/tests/e2e/fixture.html' : requestPath;
    const filePath = resolve(root, `.${normalize(safePath)}`);

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    try {
      const body = await readFile(filePath);
      response.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
      response.end(body);
    } catch (error) {
      response.writeHead(404);
      response.end('Not Found');
    }
  });

  return new Promise((resolvePromise, rejectPromise) => {
    server.once('error', rejectPromise);
    server.listen(editorPort, '127.0.0.1', () => resolvePromise(server));
  });
}

async function bootstrapEditorPage(page) {
  await page.addInitScript(() => {
    const globalWindow = window;

    const ensureElement = (tagName, factory) => {
      if (!customElements.get(tagName)) {
        customElements.define(tagName, factory());
      }
    };

    const makeCardElement = () => class extends HTMLElement {
      setConfig(config) {
        this.textContent =
          typeof config?.content === 'string' ? config.content
            : typeof config?.title === 'string' ? config.title
              : typeof config?.entity === 'string' ? config.entity
                : typeof config?.type === 'string' ? config.type
                  : 'card';
      }
    };

    ensureElement('ha-card', () => class extends HTMLElement {});
    ensureElement('ha-icon', () => class extends HTMLElement {});
    ensureElement('hui-markdown-card', makeCardElement);
    ensureElement('test-card', makeCardElement);
    ensureElement('hui-card-picker', () => class extends HTMLElement {
      hass;
      lovelace;
      path;
    });
    ensureElement('ha-icon-picker', () => class extends HTMLElement {
      value = '';
    });

    globalWindow.customCards = [{ type: 'custom:test-card' }];
    globalWindow.alert = () => {};
    globalWindow.confirm = () => true;

    if (!globalWindow.matchMedia) {
      globalWindow.matchMedia = (query) => ({
        matches: query.includes('dark'),
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
      globalWindow.requestIdleCallback = (callback) => globalWindow.setTimeout(() => callback({
        didTimeout: false,
        timeRemaining: () => 50
      }), 0);
    }

    if (!globalWindow.cancelIdleCallback) {
      globalWindow.cancelIdleCallback = (handle) => globalWindow.clearTimeout(handle);
    }

    if (!globalWindow.ResizeObserver) {
      globalWindow.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }

    if (!globalWindow.IntersectionObserver) {
      globalWindow.IntersectionObserver = class {
        constructor(callback) {
          this._callback = callback;
        }

        observe(target) {
          this._callback([{ isIntersecting: true, target }], this);
        }

        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      };
    }

    globalWindow.loadCardHelpers = async () => ({
      createCardElement: async (config) => {
        const rawType = typeof config?.type === 'string' ? config.type : '';
        const tagName = rawType.startsWith('custom:') ? rawType.slice(7) : `hui-${rawType}-card`;
        if (!customElements.get(tagName)) {
          customElements.define(tagName, makeCardElement());
        }
        const element = document.createElement(tagName);
        element.setConfig?.(config);
        return element;
      }
    });
  });

  await page.goto(`${editorBaseUrl}/tests/e2e/fixture.html`, { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: `${editorBaseUrl}/universal-card.js` });
  await page.waitForFunction(() => Boolean(window.UniversalCard));
  await page.addStyleTag({
    content: `
      body {
        --primary-background-color: #0b111a;
        --card-background-color: #101826;
        --ha-card-background: #101826;
        --divider-color: rgba(126, 148, 176, 0.24);
        --primary-text-color: #f4f7fb;
        --secondary-text-color: #93a1b3;
        --primary-color: #22a7f0;
        --error-color: #ff6b6b;
        --warning-color: #f4b400;
        color-scheme: dark;
        margin: 0;
        padding: 32px;
        min-height: 100vh;
        background: linear-gradient(180deg, #0b0f14 0%, #111821 100%);
        color: var(--primary-text-color);
      }
      #app {
        max-width: 1280px;
        margin: 0 auto;
      }
      universal-card-editor,
      universal-card-editor-real {
        display: block;
        color-scheme: dark;
      }
      universal-card-editor-real,
      universal-card-editor-real * {
        color-scheme: dark;
      }
    `
  });
}

async function mountEditor(page, config, hass) {
  await page.evaluate(({ editorConfig, hassState }) => {
    const host = document.getElementById('app');
    host.innerHTML = '';
    const editor = document.createElement('universal-card-editor');
    editor.hass = hassState;
    editor.setConfig(editorConfig);
    host.appendChild(editor);
  }, { editorConfig: config, hassState: hass });

  await page.waitForFunction(() => Boolean(document.querySelector('universal-card-editor-real')));
}

async function captureEditor(browser) {
  const server = await startStaticServer();
  try {
    await waitForHttp(`${editorBaseUrl}/tests/e2e/fixture.html`);
    const page = await browser.newPage({
      viewport: { width: 1600, height: 2600 },
      colorScheme: 'dark'
    });

    await bootstrapEditorPage(page);
    await mountEditor(page, {
      title: 'Editor Coverage',
      subtitle: 'Layout, modes, badges, and actions',
      icon: 'mdi:tune',
      entity: 'light.kitchen',
      theme: 'tokyo-night',
      icon_color: '#f4b400',
      body_mode: 'modal',
      modal: {
        width: '72rem',
        max_width: '96rem',
        loading_strategy: 'preload'
      },
      header: {
        layout: {
          variant: 'centered',
          badges_position: 'below_content'
        }
      },
      badges: [
        {
          type: 'state',
          entity: 'light.kitchen',
          icon: 'mdi:lightbulb',
          icon_only: true,
          color_rules: [
            { operator: '==', value: 'on', color: 'gold' }
          ],
          visibility: [
            { operator: '==', value: 'on' }
          ]
        }
      ],
      body: {
        cards: [
          {
            type: 'markdown',
            content: 'Editor preview body'
          }
        ]
      }
    }, EDITOR_FIXTURE);

    await sleep(1200);
    const editor = page.locator('universal-card-editor-real');
    await editor.waitFor({ state: 'visible', timeout: 30000 });
    await editor.screenshot({ path: resolve(docsImgDir, 'editor-overview-dark.png') });
    await page.close();
  } finally {
    await new Promise((resolvePromise) => server.close(resolvePromise));
  }
}

async function exportHaAssets(browser) {
  const page = await browser.newPage({
    baseURL: fixtureBaseUrl,
    viewport,
    colorScheme: 'dark'
  });

  await ensureLoggedIn(page);
  await openFixtureDashboard(page);

  await screenshotCard(page, 'overview', 0, 'basic-card-dark.png', { expand: true });
  await screenshotCard(page, 'overview', 1, 'grid-layout-1.png', { expand: true });
  await screenshotCard(page, 'overview', 1, 'grid-layout-basic-dark.png', { expand: true });
  await screenshotCard(page, 'overview', 2, 'grid-layout-2.png', { expand: true, openDelayMs: 1800 });
  await screenshotCard(page, 'overview', 2, 'grid-layout-advanced-dark.png', { expand: true, openDelayMs: 1800 });
  await screenshotCard(page, 'modes', 1, 'tabs-mode-dark.png', { expand: true, openDelayMs: 1800 });
  await screenshotCard(page, 'modes', 2, 'carousel-mode-dark.png', { expand: true, openDelayMs: 1800 });
  await captureFullscreen(page);
  await captureSubview(page);
  await screenshotCard(page, 'header', 0, 'header-options.png');
  await screenshotCard(page, 'header', 1, 'footer.png');
  await screenshotCard(page, 'header', 1, 'footer-guide-dark.png');
  await screenshotCard(page, 'header', 2, 'visibility.png', { expand: true });
  await screenshotCard(page, 'header', 2, 'visibility-guide-dark.png', { expand: true });
  await screenshotCard(page, 'header', 3, 'nested-cards.png', { expand: true });
  await screenshotCard(page, 'styling', 0, 'themes.png', { expand: true });
  await screenshotCard(page, 'styling', 1, 'actions.png', { expand: true });
  await screenshotCard(page, 'styling', 1, 'interactions-dark.png', { expand: true });
  await captureModalGif(page);

  await page.close();
}

async function main() {
  ensureDir(docsImgDir);
  ensureDir(tempDir);

  runStep('node', ['scripts/ha-fixture-bootstrap.mjs']);

  const browser = await chromium.launch({ headless: true });
  try {
    await exportHaAssets(browser);
    await captureEditor(browser);
  } finally {
    await browser.close();
    runStep('node', ['scripts/ha-fixture-down.mjs']);
  }

  console.log('[docs-assets] refreshed production docs assets in docs/img');
}

await main();
