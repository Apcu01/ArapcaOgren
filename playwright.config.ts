import { defineConfig, devices } from '@playwright/test';

// Uçtan uca testler: gerçek tarayıcıda sitenin ana akışları.
// Varsayılan olarak yerel geliştirme sunucusu kullanılır (açık değilse başlatılır); E2E_URL ile başka bir adres verilebilir.
const baseURL = process.env.E2E_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: { baseURL, locale: 'tr-TR', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_URL ? undefined : { command: 'npm run dev', url: baseURL, reuseExistingServer: true, timeout: 120_000 }
});
