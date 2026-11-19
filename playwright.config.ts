import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Baca konfigurasi dari .env Laravel jika ada
dotenv.config();

/**
 * Konfigurasi Playwright E2E Testing untuk PlayTest-Id (Laravel + Filament v5)
 * Menerapkan Arsitektur StorageState (Slide 13 PMPL):
 * - Project 'setup' mengeksekusi login sekali dan menyimpan session cookies ke JSON
 * - Project 'Google Chrome' & 'chromium' menggunakan storageState agar tes berjalan instan tanpa rate-limiting
 */
export default defineConfig({
  testDir: './tests/e2e/specs',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.APP_URL || 'http://localhost:8000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    // 1. Setup project: login sekali dan simpan sesi
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    // 2. Google Chrome (Lokal)
    {
      name: 'Google Chrome',
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        storageState: 'playwright/.auth/developer.json',
      },
    },
    // 3. Chromium (CI / GitHub Actions)
    {
      name: 'chromium',
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/developer.json',
      },
    },
  ],

  /* Menjalankan server Laravel secara otomatis jika belum berjalan */
  webServer: {
    command: 'php artisan serve --port=8000',
    url: 'http://localhost:8000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
