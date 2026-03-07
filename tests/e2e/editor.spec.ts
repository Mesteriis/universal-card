import { expect, test } from '@playwright/test';

import { bootstrapUniversalCardPage, getEditorConfig, mountEditor } from './helpers';

test.describe('Universal Card editor browser flows', () => {
  test.beforeEach(async ({ page }) => {
    await bootstrapUniversalCardPage(page);
  });

  test('icon picker updates and clears root icon', async ({ page }) => {
    await mountEditor(page, {
      type: 'custom:universal-card',
      title: 'Editor card'
    });

    const editor = page.locator('universal-card-editor-real');

    await editor.evaluate((element: any) => {
      const picker = element.shadowRoot.querySelector('ha-icon-picker[data-name="icon"]');
      picker?.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: 'mdi:alarm' },
        bubbles: true,
        composed: true
      }));
    });

    await expect.poll(async () => (await getEditorConfig(page)).icon).toBe('mdi:alarm');

    await editor.evaluate((element: any) => {
      const picker = element.shadowRoot.querySelector('ha-icon-picker[data-name="icon"]');
      picker?.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: '   ' },
        bubbles: true,
        composed: true
      }));
    });

    await expect.poll(async () => Object.prototype.hasOwnProperty.call(await getEditorConfig(page), 'icon')).toBe(false);
  });

  test('native hui-card-picker adds a body card through the real browser flow', async ({ page }) => {
    await mountEditor(page, {
      type: 'custom:universal-card',
      title: 'Picker card'
    });

    const editor = page.locator('universal-card-editor-real');

    await editor.evaluate((element: any) => {
      element.shadowRoot.querySelector('[data-section="body"]')?.click();
    });
    await editor.evaluate((element: any) => {
      element.shadowRoot.querySelector('[data-action="add-body-card"]')?.click();
    });

    await expect.poll(() => editor.evaluate((element: any) => {
      return Boolean(element.shadowRoot.querySelector('hui-card-picker'));
    })).toBe(true);

    await editor.evaluate((element: any) => {
      const picker = element.shadowRoot.querySelector('hui-card-picker');
      picker?.dispatchEvent(new CustomEvent('config-changed', {
        detail: {
          config: {
            type: 'markdown',
            content: 'picked from native picker'
          }
        },
        bubbles: true,
        composed: true
      }));
    });

    await expect.poll(async () => (await getEditorConfig(page)).body?.cards?.[0]?.content).toBe('picked from native picker');
  });

  test('inline YAML fallback editor saves updated card config', async ({ page }) => {
    await mountEditor(page, {
      type: 'custom:universal-card',
      title: 'Inline editor card',
      body: {
        cards: [
          {
            type: 'markdown',
            content: 'before update'
          }
        ]
      }
    });

    const editor = page.locator('universal-card-editor-real');

    await editor.evaluate((element: any) => {
      element.shadowRoot.querySelector('[data-section="body"]')?.click();
    });
    await editor.evaluate((element: any) => {
      element.shadowRoot.querySelector('[data-action="edit-card-inline"][data-section="body"][data-index="0"]')?.click();
    });

    const textareaSelector = 'universal-card-editor-real textarea.yaml-fallback-editor';
    await expect(page.locator(textareaSelector)).toBeVisible();
    await page.locator(textareaSelector).fill('type: markdown\ncontent: after yaml save');

    await editor.evaluate((element: any) => {
      element.shadowRoot.querySelector('[data-action="save-inline"]')?.click();
    });

    await expect.poll(async () => (await getEditorConfig(page)).body?.cards?.[0]?.content).toBe('after yaml save');
  });
});
