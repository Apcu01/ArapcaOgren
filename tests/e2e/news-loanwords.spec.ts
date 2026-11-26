import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { expect, test, type Browser } from '@playwright/test';
import { resetLimits } from './reset-limits';

// Yenilikler (panelden yazı, başlıktaki nokta, tanıtım turu), taslak ders önizlemesi,
// Türkçedeki Arapça kelimeler ve canlı yarışma sonrası tekrar.
// Geçici yönetici hesabı açılır (veritabanından yönetici yapılır) ve sonunda silinir; test duyurusu da silinir.

config({ path: '.env.local', quiet: true });
const stamp = Date.now().toString(36);
const password = 'e2e-Sifre-123';
const title = `E2E duyuru ${stamp}`;
const admin = { name: 'E2E Yönetici', email: `e2e-news-${stamp}@example.test`, state: path.join('test-results', 'news-admin.json') };

async function fresh(browser: Browser) {
  return (await browser.newContext({ storageState: { cookies: [], origins: [] } })).newPage();
}

test.describe.serial('yenilikler, Türkçedeki Arapça kelimeler, yarışma tekrarı', () => {
  test.beforeAll(async ({ browser }) => {
    await resetLimits();
    const page = await fresh(browser);
    await page.goto('/kayit');
    await page.locator('input[name="name"]').fill(admin.name);
    await page.locator('input[name="email"]').fill(admin.email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Hesabı oluştur' }).click();
    await expect(page.getByRole('button', { name: 'Hesap menüsü' })).toBeVisible();
    await page.context().close();
    const c = await mysql.createConnection(process.env.DATABASE_URL!);
    await c.query("UPDATE users SET role = 'admin' WHERE email = ?", [admin.email]);
    await c.end();
    // Rol oturum önbelleğinde: yeni oturumla giriş yap
    const p2 = await fresh(browser);
    await p2.goto('/giris');
    await p2.locator('input[name="email"]').fill(admin.email);
    await p2.locator('input[name="password"]').fill(password);
    await p2.getByRole('button', { name: 'Giriş yap' }).last().click();
    await expect(p2.getByRole('button', { name: 'Hesap menüsü' })).toBeVisible();
    fs.mkdirSync(path.dirname(admin.state), { recursive: true });
    await p2.context().storageState({ path: admin.state });
    await p2.context().close();
  });

  test.afterAll(async ({ browser }) => {
    const c = await mysql.createConnection(process.env.DATABASE_URL!);
    await c.query('DELETE FROM news WHERE title LIKE ?', ['E2E duyuru %']);
    await c.end();
    if (!fs.existsSync(admin.state)) return;
    const ctx = await browser.newContext({ storageState: admin.state });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.evaluate(async (pw) => { await fetch('/api/account', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) }); }, password);
    await ctx.close();
    fs.rmSync(admin.state, { force: true });
  });

  test('yönetici duyuru yazar; ziyaretçinin başlığında nokta çıkar, sayfayı okuyunca kalkar', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: admin.state });
    const page = await ctx.newPage();
    page.on('dialog', (d) => d.accept());
    await page.goto('/admin/yenilikler');
    await expect(page.getByRole('heading', { name: 'Yenilikler', exact: true })).toBeVisible();
    await page.getByLabel('Başlık').fill(title);
    await page.getByLabel(/^Yazı/).fill('Deneme yazısı: {{كِتَاب}} kitap.');
    await page.getByLabel(/^Bağlantı/).fill('https://kotu.example');
    await page.getByRole('button', { name: 'Yazıyı ekle' }).click();
    await expect(page.getByText(/Bağlantı site içinden olmalı/)).toBeVisible();
    await page.getByLabel(/^Bağlantı/).fill('/turkcedeki-arapca');
    await page.getByRole('button', { name: 'Yazıyı ekle' }).click();
    await expect(page.getByRole('heading', { name: new RegExp(title) })).toBeVisible();

    // Önceki yazıları görmüş bir ziyaretçi: yeni yazıda nokta ve "Yeni" etiketi
    const visitor = await fresh(browser);
    await visitor.goto('/yenilikler');
    await expect(visitor.getByRole('heading', { name: title })).toBeVisible();
    const c = await mysql.createConnection(process.env.DATABASE_URL!);
    const [[row]] = await c.query<mysql.RowDataPacket[]>('SELECT id FROM news WHERE title = ?', [title]);
    await c.end();
    await visitor.evaluate((id) => localStorage.setItem('arblearn:news-seen', String(id - 1)), Number(row.id));
    await visitor.goto('/');
    await expect(visitor.getByRole('link', { name: 'Yenilikler: yeni duyuru var' })).toBeVisible();
    await visitor.getByRole('link', { name: 'Yenilikler: yeni duyuru var' }).click();
    const card = visitor.locator('article', { has: visitor.getByRole('heading', { name: title }) });
    await expect(card.getByText('Yeni', { exact: true })).toBeVisible();
    await expect(card.locator('.ar')).toBeVisible();
    await expect(visitor.getByRole('link', { name: 'Yenilikler', exact: true })).toBeVisible();
    // Tanıtım turu Yenilikler sayfasından açılır
    await visitor.getByRole('button', { name: 'Siteyi tanı' }).click();
    await expect(visitor.getByRole('dialog', { name: 'Hoş geldin!' })).toBeVisible();
    for (let i = 0; i < 3; i++) await visitor.getByRole('button', { name: 'İleri' }).click();
    await visitor.getByRole('button', { name: 'Başla' }).click();
    await expect(visitor.getByRole('dialog')).toHaveCount(0);
    await visitor.context().close();

    // Yayından kaldırılır ve silinir
    await page.getByRole('button', { name: 'Yayından kaldır' }).first().click();
    await expect(page.getByText('Taslak').first()).toBeVisible();
    await page.getByRole('button', { name: 'Sil' }).first().click();
    await expect(page.getByRole('heading', { name: new RegExp(title) })).toHaveCount(0);
    await ctx.close();
  });

  test('yönetici taslak yeni dersi önizler', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: admin.state });
    const page = await ctx.newPage();
    await page.goto('/admin/dersler/vucut/onizleme');
    await expect(page.getByRole('heading', { name: /Vücut ve Sağlık/ }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vücut ve çift organlar' })).toBeVisible();
    await ctx.close();
  });

  test('Türkçedeki Arapça kelimeler: süzme, arama ve "anlamı aynı mı" oyunu', async ({ page }) => {
    await page.goto('/turkcedeki-arapca');
    await expect(page.getByRole('heading', { name: 'Türkçedeki Arapça kelimeler' })).toBeVisible();
    await page.getByRole('radio', { name: /Anlamı farklı/ }).click();
    await expect(page.getByText('Anlamı farklı', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Aynı anlamda', { exact: true })).toHaveCount(0);
    await page.getByPlaceholder(/Ara:/).fill('misafir');
    await expect(page.getByText('Arapçada:', { exact: false })).toHaveCount(1);
    await expect(page.getByText('yolcu', { exact: true })).toBeVisible();
    await page.getByPlaceholder(/Ara:/).fill('');
    await page.getByRole('button', { name: /Anlamı aynı mı, farklı mı\?/ }).click();
    const opt = page.locator('.opt[data-v]').first();
    await expect(opt).toBeVisible();
    await opt.click();
    await expect(page.getByRole('button', { name: /Sonraki soru/ })).toBeVisible();
  });

  test('canlı yarışma bitince öğrenci yanlışlarını görür, Hatalarım\'a ekler ve yeniden çözer', async ({ browser }) => {
    const student = await fresh(browser);
    await student.goto('/canli');
    const code = await student.evaluate(async () => {
      const post = (u: string, b: unknown) => fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json());
      const g = await post('/api/live', { source: { type: 'topic', id: 'renkler' }, count: 3, seconds: 10, dir: 'ar' });
      const p = await post(`/api/live/${g.code}`, { action: 'join', name: 'Tekrar' });
      localStorage.setItem(`arblearn:live-player:${g.code}`, JSON.stringify(p));
      const host = (action: string) => post(`/api/live/${g.code}`, { action, k: g.hostKey });
      // Öğrenci hiç cevaplamaz: her soruda öğretmen süreyi bitirir (atla), sıralamadan sonraki soruya geçer; son sorudan sonra bitiş
      await host('start');
      for (let i = 0; i < 3; i++) { await host('skip'); await host('next'); if (i < 2) await host('next'); }
      return g.code as string;
    });
    await student.goto(`/canli/${code}`);
    await expect(student.getByText('Yarışma bitti')).toBeVisible();
    await expect(student.getByRole('heading', { name: /Yanlışların/ })).toBeVisible();
    await expect(student.getByText('Bu soruyu boş bıraktın.')).toHaveCount(3);
    await student.getByRole('button', { name: "Hatalarım'a ekle" }).click();
    await expect(student.getByRole('link', { name: /Eklendi/ })).toBeVisible();
    const added = await student.evaluate(() => JSON.parse(localStorage.getItem('arblearn:mistakes') || '[]').filter((m: { topicId: string }) => m.topicId === 'renkler').length);
    expect(added).toBe(3);
    await student.getByRole('button', { name: 'Tekrar çöz' }).click();
    await expect(student.getByText('Yanlışlarını tekrar çöz')).toBeVisible();
    await student.keyboard.press('Escape');
    await student.goto('/hatalarim');
    await expect(student.getByRole('heading', { name: /Renkler/ })).toBeVisible();
    await student.context().close();
  });
});
