import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

// Kelime bul: ders kelimeleri, yerleşik sözlük ve önbellek herkese açık; yapay zekâya sormak giriş ister.
// Derslerdeki kelimeler sayfada bulunur; diğerleri API'den (yerleşik sözlük ya da yapay zekâ) gelir.
// API cevapları taklit edilir: testler ücret oluşturmaz. Testler için geçici bir hesap açılır ve sonunda silinir.

const email = `e2e-lookup-${Date.now().toString(36)}@example.test`;
const password = 'e2e-Sifre-123';
const state = path.join('test-results', 'lookup-user.json');

test.describe.serial('kelime bul', () => {
  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/kayit');
    await page.locator('input[name="name"]').fill('E2E Kelime');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Hesabı oluştur' }).click();
    await expect(page.getByRole('button', { name: 'Hesap menüsü' })).toBeVisible();
    fs.mkdirSync(path.dirname(state), { recursive: true });
    await ctx.storageState({ path: state });
    await ctx.close();
  });

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: state });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.evaluate(async (pw) => { await fetch('/api/account', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) }); }, password);
    await ctx.close();
    fs.rmSync(state, { force: true });
  });

  test('misafir sözlükte arayabilir, yapay zekâ için giriş istenir', async ({ page }) => {
    // Gerçek API: yerleşik sözlükte olan kelime herkese açık; olmayan kelimede yapay zekâya gidilmeden giriş istenir (ücret oluşmaz)
    await page.goto('/kelime-bul?q=sahifetun');
    const lex = page.locator('section', { has: page.getByRole('heading', { name: 'Sözlüğümüzden' }) });
    await expect(lex.getByText('gazete', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Yapay zekâya sor' }).click();
    await expect(page.getByText('Yapay zekâya sormak için giriş yap')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Hesap aç' })).toBeVisible();
    const status = await page.evaluate(async () => (await fetch('/api/lookup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: 'zqxwvt' }) })).status);
    expect(status).toBe(401);
  });

  test('derslerde geçen kelime hatalı harekeyle de bulunur ve API çağrılmaz', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: state });
    const page = await ctx.newPage();
    let calls = 0;
    await page.route('**/api/lookup', (r) => { calls++; return r.fulfill({ json: { source: 'ai', results: [] } }); });
    await page.goto('/kelime-bul');
    await page.getByPlaceholder('Örnek: ketebe, afvan, müderris').fill('katabe');
    await page.getByRole('button', { name: 'Bul', exact: true }).click();
    const group = page.locator('section', { has: page.getByRole('heading', { name: 'Derslerde geçiyor' }) });
    await expect(group.getByText('yazdı', { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\?q=katabe$/);
    expect(calls).toBe(0);
    await ctx.close();
  });

  test('yerleşik sözlükten ve yapay zekâdan gelen sonuçlar ayrı gösterilir', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: state });
    const page = await ctx.newPage();
    await page.route('**/api/lookup', async (r) => {
      const body = r.request().postDataJSON() as { q: string; ai?: boolean };
      if (!body.ai) return r.fulfill({ json: { source: 'lexicon', match: 'exact', results: [{ ar: 'صَحِيفَة', tl: 'sahîfe', tr: 'gazete', en: 'newspaper', type: 'isim' }], note: '' } });
      return r.fulfill({ json: { source: 'ai', results: [{ ar: 'صَحِيفَة', tl: 'sahîfe', tr: 'gazete, sayfa', en: 'newspaper', type: 'isim', example: { ar: 'قَرَأْتُ الصَّحِيفَةَ.', tr: 'Gazeteyi okudum.' } }], note: '' } });
    });
    await page.goto('/kelime-bul?q=sehifat%C3%BCn');
    const lex = page.locator('section', { has: page.getByRole('heading', { name: 'Sözlüğümüzden' }) });
    await expect(lex.getByText('gazete', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Yapay zekâya sor' }).click();
    const ai = page.locator('section', { has: page.getByRole('heading', { name: 'Yapay zekâ sonucu' }) });
    await expect(ai.getByText('Gazeteyi okudum.')).toBeVisible();
    await expect(lex).toBeVisible(); // sözlük sonucu kaybolmaz
    await ctx.close();
  });

  test('hata durumunda açıklayıcı mesaj gösterilir', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: state });
    const page = await ctx.newPage();
    await page.route('**/api/lookup', (r) => r.fulfill({ status: 429, json: { error: 'Çok fazla deneme yapıldı.' } }));
    await page.goto('/kelime-bul?q=xyzq');
    await expect(page.locator('main').getByRole('alert')).toContainText('Çok fazla deneme');
    await ctx.close();
  });
});
