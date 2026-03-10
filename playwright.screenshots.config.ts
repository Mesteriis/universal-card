import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/screenshots',
  fullyParallel: false,
  reporter: [['list']],
  timeout: 90_000,
  use: {
    baseURL: 'http://127.0.0.1:8123',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 1400 },
    ...devices['Desktop Chrome']
  }
});
