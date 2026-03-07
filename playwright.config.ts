import { defineConfig, devices } from '@playwright/test';

declare const process: {
  env: {
    CI?: string;
  };
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome']
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173/tests/e2e/fixture.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
