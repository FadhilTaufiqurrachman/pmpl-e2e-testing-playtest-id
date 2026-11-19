import { test, expect } from '@playwright/test';
import { DeveloperDashboardPage } from '../pages/DeveloperDashboardPage';
import { MisiPage } from '../pages/MisiPage';

test.describe('Alur 2: Manajemen Aplikasi & Misi Pengembang (Developer Journey)', () => {
  let dashboardPage: DeveloperDashboardPage;
  let misiPage: MisiPage;

  test.beforeEach(async ({ page }) => {
    // Sesi autentikasi telah disuntikkan secara otomatis via storageState Playwright
    dashboardPage = new DeveloperDashboardPage(page);
    misiPage = new MisiPage(page);
    await dashboardPage.goto();
  });

  test('Pengembang dapat mengakses menu Aplikasi Saya dan melihat daftar misi', async () => {
    // Navigasi ke menu Aplikasi Saya melalui sidebar
    await dashboardPage.bukaAplikasiSaya();
    // Verifikasi halaman daftar misi termuat
    await misiPage.verifikasiHalamanList();
  });

  test('Pengembang dapat membuka form Buat Misi Baru dan memverifikasi komponen wizard', async () => {
    // Buka halaman aplikasi saya lalu klik tombol Buat Misi Baru
    await misiPage.goto();
    await misiPage.bukaFormBuatMisi();
    // Verifikasi tampilan wizard Step 1 (Unggah Aplikasi)
    await misiPage.verifikasiFormWizard();
  });

  test('Pengembang dapat mengakses modul Pantau Progress tester', async ({ page }) => {
    // Buka halaman Pantau Progress dari sidebar
    await dashboardPage.bukaPantauProgress();
    // Verifikasi URL dan bahwa komponen utama pelacak progres tampil
    await expect(page).toHaveURL(/\/developer\/pantau-progress/, { timeout: 15000 });
    const mainContent = page.locator('main').filter({ hasText: /kampanye|campaign|progres|progress|tester/i });
    await expect(mainContent.first()).toBeVisible({ timeout: 15000 });
  });
});
