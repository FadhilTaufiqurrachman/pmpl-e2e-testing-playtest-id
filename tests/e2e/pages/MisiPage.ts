import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model untuk Halaman Manajemen & Pembuatan Misi Developer (PlayTest-Id)
 * Mendukung antarmuka dwibahasa (ID & EN)
 */
export class MisiPage {
  readonly page: Page;
  readonly tombolBuatMisi: Locator;
  readonly headingMisi: Locator;
  readonly namaAplikasiInput: Locator;
  readonly wizardStepUpload: Locator;

  constructor(page: Page) {
    this.page = page;

    // Heading atau elemen penanda pada halaman daftar misi
    this.headingMisi = page.getByText(/kelola dan pantau aplikasi|manage and monitor the applications|aplikasi saya|my apps/i);

    // Tombol untuk membuka form pembuatan misi baru
    this.tombolBuatMisi = page.locator('main a[href*="/developer/misis/create"]')
      .or(page.getByRole('link', { name: /buat misi baru|create new mission|new test case/i }));

    // Elemen pada form wizard pembuatan misi (/developer/misis/create)
    this.wizardStepUpload = page.getByText(/unggah aplikasi|upload app/i);

    this.namaAplikasiInput = page.locator('input[name="nama_aplikasi"]')
      .or(page.getByLabel(/nama aplikasi|application name/i))
      .or(page.getByPlaceholder(/aplikasi kerenku|my awesome app|aplikasi/i));
  }

  /**
   * Menuju ke halaman daftar aplikasi / misi developer
   */
  async goto() {
    await this.page.goto('/developer/misis', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Memastikan halaman daftar misi termuat dengan benar
   */
  async verifikasiHalamanList() {
    await expect(this.tombolBuatMisi.first()).toBeVisible({ timeout: 15000 });
  }

  /**
   * Mengeklik tombol 'Buat Misi Baru' untuk membuka form wizard
   */
  async bukaFormBuatMisi() {
    // Klik tombol Buat Misi Baru di halaman list, atau langsung buka URL jika tombol belum ter-render
    if (await this.tombolBuatMisi.first().isVisible()) {
      await this.tombolBuatMisi.first().click();
    } else {
      await this.page.goto('/developer/misis/create', { waitUntil: 'domcontentloaded' });
    }
    await expect(this.page).toHaveURL(/\/developer\/misis\/create/, { timeout: 15000 });
  }

  /**
   * Memverifikasi elemen-elemen wizard form pembuatan misi
   */
  async verifikasiFormWizard() {
    // Memastikan Step 1 (Unggah Aplikasi / Upload App) terlihat
    await expect(this.wizardStepUpload.first()).toBeVisible({ timeout: 15000 });
    // Memastikan input nama aplikasi siap digunakan
    await expect(this.namaAplikasiInput.first()).toBeVisible({ timeout: 10000 });
  }
}
