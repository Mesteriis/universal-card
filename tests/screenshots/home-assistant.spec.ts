import { expect, test, type Page } from '@playwright/test';

declare const process: {
  env: Record<string, string | undefined>;
};

type Shot = {
  path: string;
  screenshot: string;
  readyText: string;
};

const FIXTURE_USERNAME = process.env.HA_FIXTURE_USERNAME || 'fixture';
const FIXTURE_PASSWORD = process.env.HA_FIXTURE_PASSWORD || 'fixture-pass-123';
const FIXTURE_DASHBOARD_PATH = '/fixture-dashboard';

const SHOTS: Shot[] = [
  { path: `${FIXTURE_DASHBOARD_PATH}/overview`, screenshot: 'overview.png', readyText: 'Living Room' },
  { path: `${FIXTURE_DASHBOARD_PATH}/modes`, screenshot: 'modes.png', readyText: 'Security Controls' },
  { path: `${FIXTURE_DASHBOARD_PATH}/header`, screenshot: 'header-badges.png', readyText: 'Climate Center' },
  { path: `${FIXTURE_DASHBOARD_PATH}/details`, screenshot: 'subview-details.png', readyText: 'Advanced Details' }
];

async function ensureLoggedIn(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });

  const loginField = page.getByRole('textbox', { name: /Username/i });
  const loginVisible = await loginField.waitFor({ state: 'visible', timeout: 15_000 })
    .then(() => true)
    .catch(() => false);

  if (!loginVisible) {
    return;
  }

  await loginField.fill(FIXTURE_USERNAME);
  await page.getByRole('textbox', { name: /Password/i }).fill(FIXTURE_PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForURL((url) => !url.pathname.startsWith('/auth'), { timeout: 30_000 });
}

async function openFixtureDashboard(page: Page) {
  const dashboardLink = page.locator(`a[href="${FIXTURE_DASHBOARD_PATH}"]`);
  await dashboardLink.click();
  await page.waitForURL(`${FIXTURE_DASHBOARD_PATH}/overview`, { timeout: 30_000 });
}

async function navigateFixtureView(page: Page, path: string) {
  await page.evaluate((nextPath) => {
    window.history.pushState(null, '', nextPath);
    window.dispatchEvent(new Event('location-changed'));
  }, path);

  await page.waitForFunction((expectedPath) => window.location.pathname === expectedPath, path);
}

test.describe('Home Assistant fixture screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
    await openFixtureDashboard(page);
  });

  for (const shot of SHOTS) {
    test(`captures ${shot.screenshot}`, async ({ page }) => {
      await navigateFixtureView(page, shot.path);
      await expect(page.getByText(shot.readyText).first()).toBeVisible({ timeout: 30_000 });
      await page.screenshot({
        path: `tests/screenshots/output/${shot.screenshot}`,
        fullPage: true
      });
    });
  }
});
