import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model untuk Halaman Login Panel Developer (PlayTest-Id)
 * Menangani form autentikasi kustom Filament v5 dengan sinkronisasi Livewire yang andal
 */
export class DeveloperLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Resilient User-Facing Locators
    this.emailInput = page.locator('input[type="email"], input[name="email"]')
      .or(page.getByLabel(/email/i));

    this.passwordInput = page.locator('input[type="password"], input[name="password"]')
      .or(page.getByLabel(/password|kata sandi/i));

    this.submitButton = page.locator('button[type="submit"]')
      .or(page.getByRole('button', { name: /masuk|login|sign in/i }));

    // Toast error atau pesan validasi form Filament
    this.errorMessage = page.locator('.toast-error, .fi-fo-field-wrp-error-message, .fi-notif-title')
      .or(page.getByText(/kredensial|tidak sesuai|salah|error/i));
  }

  /**
   * Menuju ke halaman login Developer
   */
  async goto() {
    await this.page.goto('/developer/login', { waitUntil: 'domcontentloaded' });
    await expect(this.submitButton.first()).toBeVisible({ timeout: 15000 });
  }

  /**
   * Mengisi kredensial dan melakukan submit login
   * Menggunakan kombinasi submit button dan press('Enter') agar sinkron dengan Livewire v3
   */
  async login(email: string, pass: string) {
    await this.emailInput.first().fill(email);
    await this.passwordInput.first().fill(pass);

    // Kirim form via Enter key atau klik tombol submit
    await this.passwordInput.first().press('Enter');

    try {
      await expect(this.page).toHaveURL(/\/developer(?!\/login)/, { timeout: 4000 });
    } catch {
      // Fallback klik tombol submit jika enter belum memicu pengalihan
      if (await this.submitButton.first().isVisible()) {
        await this.submitButton.first().click();
      }
    }
  }

  /**
   * Verifikasi skenario login gagal
   */
  async verifyLoginFailed() {
    await expect(this.submitButton.first()).toBeVisible({ timeout: 10000 });
    expect(this.page.url()).toContain('/developer/login');
  }

  /**
   * Verifikasi skenario login sukses
   */
  async verifyLoginSuccess() {
    await expect(this.page).toHaveURL(/\/developer(?!\/login)/, { timeout: 20000 });
  }
}
