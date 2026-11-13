import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { expect, test, type Browser } from '@playwright/test';
import { resetLimits } from './reset-limits';

// Yönetim paneli: okuma metni oluşturma, düzenleme, önizleme, yayınlama ve silme; öğrenme istatistikleri.
// Sınıf: duyuru (öğrenci görür) ve ödev raporunu Excel'e indirme. Bildirim API'si.
// Geçici hesaplar açılır (öğretmen hesabı veritabanından yönetici yapılır) ve sonunda silinir.

config({ path: '.env.local', quiet: true });
const stamp = Date.now().toString(36);
const password = 'e2e-Sifre-123';
const slug = `e2e-metin-${stamp}`;
const users = {
  admin: { name: 'E2E Yönetici', email: `e2e-admin-${stamp}@example.test`, state: path.join('test-results', 'learn-admin.json') },
  student: { name: 'E2E Öğrenci', email: `e2e-lstudent-${stamp}@example.test`, state: path.join('test-results', 'learn-student.json') }
};
let classUrl = '';

async function register(browser: Browser, u: (typeof users)['admin']) {
  const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await ctx.newPage();
  await page.goto('/kayit');
  await page.locator('input[name="name"]').fill(u.name);
  await page.locator('input[name="email"]').fill(u.email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Hesabı oluştur' }).click();
  await expect(page.getByRole('button', { name: 'Hesap menüsü' })).toBeVisible();
  fs.mkdirSync(path.dirname(u.state), { recursive: true });
  await ctx.storageState({ path: u.state });
  await ctx.close();
}

test.describe.serial('yönetim: okuma metinleri, istatistik, sınıf duyurusu', () => {
  test.beforeAll(async ({ browser }) => {
    await resetLimits();
    await register(browser, users.admin);
    await register(browser, users.student);
    const c = await mysql.createConnection(process.env.DATABASE_URL!);
    await c.query("UPDATE users SET role = 'admin' WHERE email = ?", [users.admin.email]);
    await c.end();
    // Rol oturum önbelleğinde: yeni oturumla giriş yap
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await page.goto('/giris');
    await page.locator('input[name="email"]').fill(users.admin.email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Giriş yap' }).last().click();
    await expect(page.getByRole('button', { name: 'Hesap menüsü' })).toBeVisible();
    await ctx.storageState({ path: users.admin.state });
    await ctx.close();
  });

  test.afterAll(async ({ browser }) => {
    const c = await mysql.createConnection(process.env.DATABASE_URL!);
    await c.query('DELETE FROM readings WHERE slug = ?', [slug]);
    await c.end();
    for (const u of Object.values(users)) {
      if (!fs.existsSync(u.state)) continue;
      const ctx = await browser.newContext({ storageState: u.state });
      const page = await ctx.newPage();
      await page.goto('/');
      await page.evaluate(async (pw) => { await fetch('/api/account', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) }); }, password);
      await ctx.close();
      fs.rmSync(u.state, { force: true });
    }
  });

  test('yönetici okuma metni oluşturur, önizler, yayınlar ve siler', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: users.admin.state });
    const page = await ctx.newPage();
    page.on('dialog', (d) => d.accept());
    await page.goto('/admin/okuma');
    await expect(page.getByRole('heading', { name: 'Okuma metinleri' })).toBeVisible();
    await expect(page.getByText('/okuma/ailem')).toBeVisible();
    await page.getByRole('link', { name: 'Yeni metin' }).click();

    await page.getByLabel('Türkçe başlık').fill('E2E Kitabım');
    await page.getByLabel('Arapça başlık (harekeli)').fill('كِتَابِي');
    await page.getByLabel('Adres').fill(slug);
    await page.getByLabel('Kısa açıklama (listede görünür)').fill('Deneme metni.');
    await page.getByLabel('1. cümle Arapça').fill('هَذَا كِتَابِي.');
    await page.getByPlaceholder('anlamı').nth(0).fill('bu');
    await page.getByPlaceholder('anlamı').nth(1).fill('kitabım');
    await page.getByLabel('1. cümle çevirisi').fill('Bu benim kitabım.');
    await page.getByRole('button', { name: 'Soru ekle' }).click();
    await page.getByLabel('1. soru', { exact: true }).fill('Bu ne?');
    for (const [i, o] of ['Kitap', 'Kalem', 'Ev', 'Kapı'].entries()) await page.getByPlaceholder(`${i + 1}. seçenek`).fill(o);
    await page.getByLabel('1. seçenek doğru').check();
    await page.getByRole('button', { name: 'Kaydet' }).first().click();
    await expect(page).toHaveURL(new RegExp(`/admin/okuma/${slug}$`));
    await expect(page.getByText(/ses kaydı yok|ses kaydı var/)).toBeVisible();

    // Yayında değilken sitede görünmez, önizlemede görünür
    expect((await page.request.get(`/okuma/${slug}`)).status()).toBe(404);
    await page.getByRole('link', { name: 'Önizle' }).click();
    await expect(page.getByText('Önizleme', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /: kitabım$/ })).toBeVisible();
    await page.getByRole('link', { name: /Düzenleyiciye dön/ }).click();

    // Eksik anlam kaydedilmez
    await page.getByPlaceholder('anlamı').nth(1).fill('');
    await page.getByRole('button', { name: 'Kaydet' }).first().click();
    await expect(page.getByText(/Her kelimenin anlamını yaz/)).toBeVisible();
    await page.getByPlaceholder('anlamı').nth(1).fill('kitabım');
    await page.getByRole('button', { name: 'Kaydet' }).first().click();
    await expect(page.getByText('Kaydedildi.')).toBeVisible();

    await page.getByRole('button', { name: 'Yayınla' }).click();
    await expect(page.getByText(`Metin yayında: /okuma/${slug}`)).toBeVisible();
    await page.goto(`/okuma/${slug}`);
    await expect(page.getByRole('heading', { name: /E2E Kitabım/ })).toBeVisible();
    await page.goto('/okuma');
    await expect(page.getByRole('link', { name: /E2E Kitabım/ })).toBeVisible();

    // İstatistik sayfası
    await page.goto('/admin/ogrenme');
    await expect(page.getByRole('heading', { name: 'Okuma, dikte, sınıf, lig' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'E2E Kitabım' })).toBeVisible();
    await expect(page.getByText('Haftalık lig').first()).toBeVisible();

    await page.goto('/admin/okuma');
    await page.getByRole('button', { name: 'E2E Kitabım: sil' }).click();
    await expect(page.getByText(`/okuma/${slug}`)).toBeHidden();
    await ctx.close();
  });

  test('öğretmen duyuru paylaşır, öğrenci görür; ödev raporu Excel olarak iner', async ({ browser }) => {
    const t = await browser.newContext({ storageState: users.admin.state });
    const page = await t.newPage();
    await page.goto('/siniflar');
    await page.getByPlaceholder('Örneğin: 9-A Arapça').fill('E2E Duyuru Sınıfı');
    await page.getByRole('button', { name: 'Sınıfı aç' }).click();
    await expect(page.getByRole('heading', { name: 'E2E Duyuru Sınıfı' })).toBeVisible();
    classUrl = new URL(page.url()).pathname;
    const code = (await page.locator('section[aria-label="Sınıfa katılma"] .font-mono').textContent())!.trim();
    await page.getByLabel('Duyuru', { exact: true }).fill('Cumaya kadar Ailem metnini okuyun.');
    await page.getByRole('button', { name: 'Paylaş' }).click();
    await expect(page.locator('li', { hasText: 'Cumaya kadar Ailem metnini okuyun.' })).toBeVisible();
    await page.getByRole('radio', { name: 'Okuma metni' }).click();
    await page.locator('select').selectOption('ailem');
    await page.getByRole('button', { name: 'Ödev ver' }).click();
    await expect(page.locator('article', { hasText: 'Ailem' })).toBeVisible();

    const s = await browser.newContext({ storageState: users.student.state });
    const sp = await s.newPage();
    await sp.goto(`/sinif/katil?kod=${code}`);
    await expect(sp.getByRole('heading', { name: 'E2E Duyuru Sınıfı' })).toBeVisible();
    await expect(sp.getByText('Cumaya kadar Ailem metnini okuyun.')).toBeVisible();
    await expect(sp.getByLabel('Duyuru', { exact: true })).toHaveCount(0);
    await s.close();

    await page.reload();
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: "Ödev raporunu Excel'e indir" }).click()]);
    const csv = fs.readFileSync((await dl.path())!, 'utf8');
    expect(dl.suggestedFilename()).toMatch(/^sinif-e2e-duyuru-sinifi-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv).toContain('Okuma metni: Ailem');
    expect(csv).toMatch(/E2E Öğrenci;Başlanmadı;0/);
    await t.close();
  });

  test('bildirim ayarları ve zamanlayıcı korumalı', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: users.student.state });
    const page = await ctx.newPage();
    const info = await (await page.request.get('/api/push')).json();
    expect(info.enabled).toBe(true);
    expect(info.publicKey).toMatch(/^[A-Za-z0-9_-]{80,}$/);
    expect((await page.request.post('/api/internal/push')).status()).toBe(403);
    await page.goto('/hesap');
    await expect(page.getByRole('heading', { name: 'Bildirimler' })).toBeVisible();
    await ctx.close();
  });
});
