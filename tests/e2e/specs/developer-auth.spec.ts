import { test, expect } from '@playwright/test';
import { DeveloperLoginPage } from '../pages/DeveloperLoginPage';

// Pastikan pengujian autentikasi selalu menggunakan browser context yang bersih (tanpa cookie tersimpan)
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Alur 1: Autentikasi Pengembang (Developer Auth)', () => {
  let loginPage: DeveloperLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new DeveloperLoginPage(page);
    await loginPage.goto();
  });

  test('Skenario Negatif: Gagal login ke panel developer dengan password salah', async ({ page }) => {
    await loginPage.login('developer@gmail.com', 'PasswordSalah123!');
    await loginPage.verifyLoginFailed();
    // Memastikan tidak dialihkan ke dasbor
    expect(page.url()).toContain('/developer/login');
  });

  test('Skenario Positif: Berhasil login dengan kredensial developer valid', async ({ page }) => {
    await loginPage.login('developer@gmail.com', '123456');
    await loginPage.verifyLoginSuccess();
  });
});
