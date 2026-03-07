import { expect, test } from '@playwright/test';

import { bootstrapUniversalCardPage, mountCard } from './helpers';

test.describe('Universal Card browser mode flows', () => {
  test.beforeEach(async ({ page }) => {
    await bootstrapUniversalCardPage(page);
  });

  test('modal and fullscreen modes keep content after close and reopen', async ({ page }) => {
    const scenarios = [
      {
        body_mode: 'modal',
        overlaySelector: '.uc-modal-overlay',
        closeSelector: '.uc-modal-close',
        gridSelector: '.uc-modal-grid'
      },
      {
        body_mode: 'fullscreen',
        overlaySelector: '.uc-fullscreen-overlay',
        closeSelector: '.uc-fullscreen-back',
        gridSelector: '.uc-fullscreen-grid'
      }
    ] as const;

    for (const scenario of scenarios) {
      await mountCard(page, {
        type: 'custom:universal-card',
        title: `${scenario.body_mode} title`,
        body_mode: scenario.body_mode,
        body: {
          cards: [
            {
              type: 'custom:test-card',
              content: `${scenario.body_mode} content`
            }
          ]
        }
      });

      const card = page.locator('universal-card');
      await card.evaluate(async (element: any) => {
        await element._expand();
      });

      await expect(page.locator(scenario.overlaySelector)).toBeVisible();
      await expect(page.locator(`${scenario.gridSelector} test-card`)).toContainText(`${scenario.body_mode} content`);

      await page.locator(scenario.closeSelector).click();
      await expect(page.locator(scenario.overlaySelector)).toHaveCount(0);

      await card.evaluate(async (element: any) => {
        await element._expand();
      });

      await expect(page.locator(`${scenario.gridSelector} .card-wrapper`)).toHaveCount(1);
      await expect(page.locator(`${scenario.gridSelector} test-card`)).toContainText(`${scenario.body_mode} content`);
    }
  });

  test('subview mode changes location on open and returns on close', async ({ page }) => {
    await mountCard(page, {
      type: 'custom:universal-card',
      title: 'Subview title',
      body_mode: 'subview',
      subview: {
        path: '/tests/e2e/subview-target',
        return_on_close: true
      }
    });

    const initialPath = await page.evaluate(() => window.location.pathname);
    const card = page.locator('universal-card');

    await card.evaluate(async (element: any) => {
      await element._expand();
    });

    await expect.poll(() => page.evaluate(() => window.location.pathname)).toBe('/tests/e2e/subview-target');

    await card.evaluate((element: any) => {
      element._collapse();
    });

    await expect.poll(() => page.evaluate(() => window.location.pathname)).toBe(initialPath);
  });

  test('tabs and carousel keep active item across collapse and reopen', async ({ page }) => {
    await mountCard(page, {
      type: 'custom:universal-card',
      title: 'Tabs card',
      body_mode: 'tabs',
      card_id: 'tabs-e2e',
      remember_mode_state: true,
      tabs: [
        {
          label: 'One',
          cards: [{ type: 'custom:test-card', content: 'tab one' }]
        },
        {
          label: 'Two',
          cards: [{ type: 'custom:test-card', content: 'tab two' }]
        }
      ]
    });

    const tabsCard = page.locator('universal-card');
    await tabsCard.evaluate(async (element: any) => {
      await element._expand();
    });
    await tabsCard.evaluate((element: any) => {
      const button = element.shadowRoot.querySelector('.tab-button[data-index="1"]');
      button?.click();
    });

    await expect.poll(() => tabsCard.evaluate((element: any) => element._tabsMode?._activeTab ?? null)).toBe(1);
    await expect.poll(() => tabsCard.evaluate((element: any) => {
      return element.shadowRoot.querySelector('.tab-button.active')?.dataset.index || null;
    })).toBe('1');

    await tabsCard.evaluate((element: any) => {
      element._collapse();
    });
    await tabsCard.evaluate(async (element: any) => {
      await element._expand();
    });

    await expect.poll(() => tabsCard.evaluate((element: any) => element._tabsMode?._activeTab ?? null)).toBe(1);
    await expect.poll(() => tabsCard.evaluate((element: any) => {
      return element.shadowRoot.querySelector('.tab-button.active')?.dataset.index || null;
    })).toBe('1');

    await mountCard(page, {
      type: 'custom:universal-card',
      title: 'Carousel card',
      body_mode: 'carousel',
      card_id: 'carousel-e2e',
      remember_mode_state: true,
      body: {
        cards: [
          { type: 'custom:test-card', content: 'slide one' },
          { type: 'custom:test-card', content: 'slide two' }
        ]
      }
    });

    const carouselCard = page.locator('universal-card');
    await carouselCard.evaluate(async (element: any) => {
      await element._expand();
    });
    await carouselCard.evaluate((element: any) => {
      const button = element.shadowRoot.querySelector('.carousel-arrow-next');
      button?.click();
    });

    await expect.poll(() => carouselCard.evaluate((element: any) => element._carouselMode?._currentIndex ?? null)).toBe(1);
    await expect.poll(() => carouselCard.evaluate((element: any) => {
      return element.shadowRoot.querySelectorAll('.carousel-slide').length;
    })).toBe(2);

    await carouselCard.evaluate((element: any) => {
      element._collapse();
    });
    await carouselCard.evaluate(async (element: any) => {
      await element._expand();
    });

    await expect.poll(() => carouselCard.evaluate((element: any) => element._carouselMode?._currentIndex ?? null)).toBe(1);
    await expect.poll(() => carouselCard.evaluate((element: any) => {
      return element.shadowRoot.querySelectorAll('.carousel-slide').length;
    })).toBe(2);
  });
});
