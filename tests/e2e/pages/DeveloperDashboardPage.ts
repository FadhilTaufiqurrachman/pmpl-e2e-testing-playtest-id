import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model untuk Dasbor dan Navigasi Panel Developer (PlayTest-Id)
 * Mendukung dwibahasa (ID & EN) dan penanganan otomatis sidebar group collapse
 */
export class DeveloperDashboardPage {
  readonly page: Page;
  readonly groupManajemenUtama: Locator;
  readonly navDasbor: Locator;
  readonly navAplikasiSaya: Locator;
  readonly navPantauProgress: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tombol grup sidebar (Manajemen Utama / Main Management)
    this.groupManajemenUtama = page.getByRole('button', { name: /manajemen utama|main management/i })
      .or(page.locator('aside button, nav button').filter({ hasText: /manajemen utama|main management/i }));

    // Item navigasi dwibahasa (ID / EN)
    this.navDasbor = page.locator('nav a, aside a').filter({ hasText: /dasbor|dashboard/i });
    this.navAplikasiSaya = page.locator('nav a, aside a').filter({ hasText: /aplikasi saya|my apps|misi/i });
    this.navPantauProgress = page.locator('nav a, aside a').filter({ hasText: /pantau progress|pantau progres|monitor progress/i });
  }

  /**
   * Membuka halaman utama dasbor developer
   */
  async goto() {
    await this.page.goto('/developer', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/developer(?!\/login)/, { timeout: 15000 });
  }

  /**
   * Membuka grup navigasi jika dalam kondisi tertutup (collapsed)
   */
  async bukaGrupSidebar() {
    if (await this.groupManajemenUtama.first().isVisible()) {
      // Periksa apakah item di dalamnya belum terlihat
      const itemTerlihat = await this.navAplikasiSaya.first().isVisible();
      if (!itemTerlihat) {
        await this.groupManajemenUtama.first().click();
        await this.page.waitForTimeout(300); // Tunggu animasi ekspansi sidebar
      }
    }
  }

  /**
   * Navigasi ke menu Aplikasi Saya (My Apps)
   */
  async bukaAplikasiSaya() {
    await this.bukaGrupSidebar();
    
    // Klik menu Aplikasi Saya di sidebar, atau tombol View All di dashboard jika tersedia
    if (await this.navAplikasiSaya.first().isVisible()) {
      await this.navAplikasiSaya.first().click();
    } else {
      await this.page.goto('/developer/misis', { waitUntil: 'domcontentloaded' });
    }

    await expect(this.page).toHaveURL(/\/developer\/misis/, { timeout: 15000 });
  }

  /**
   * Navigasi ke menu Pantau Progress (Monitor Progress)
   */
  async bukaPantauProgress() {
    await this.bukaGrupSidebar();

    if (await this.navPantauProgress.first().isVisible()) {
      await this.navPantauProgress.first().click();
    } else {
      await this.page.goto('/developer/pantau-progress', { waitUntil: 'domcontentloaded' });
    }

    await expect(this.page).toHaveURL(/\/developer\/pantau-progress/, { timeout: 15000 });
  }
}
