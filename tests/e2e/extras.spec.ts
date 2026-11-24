import fs from 'node:fs';
import path from 'node:path';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { resetLimits } from './reset-limits';

// Yeni özellikler: Kelime bul harf eşleştirmesi, benzer sesler ve rakam alıştırmaları, 60 saniye meydan okuma,
// Hatalarım'da konuya göre gruplama, klavye öğretici, zıt ve eş anlamlılar, liste klasör ve etiketleri,
// canlı yarışmada aynı oyuncularla yeni tur.

const fresh = async (browser: Browser) => (await browser.newContext({ storageState: { cookies: [], origins: [] } })).newPage();
/** Ek alıştırmayı Alfabe sayfasından açar */
async function openDrill(page: Page, label: string) {
  await page.goto('/alfabe');
  await page.getByRole('button', { name: new RegExp(label) }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

test('Kelime bul: yazılan harfler birebir aranır', async ({ page }) => {
  await page.goto('/kelime-bul?q=' + encodeURIComponent('şita'));
  await expect(page.getByRole('heading', { name: 'Sözlüğümüzden' })).toBeVisible();
  await expect(page.locator('article').filter({ hasText: 'kış' })).toBeVisible();
  // سِتَّة (altı) sin ile yazılır; ş yazıldığı için önerilmez
  await expect(page.locator('article').filter({ hasText: 'altı' })).toHaveCount(0);

  await page.getByPlaceholder('Örnek: ketebe, afvan, müderris').fill('uhavile');
  await page.getByRole('button', { name: 'Bul', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Bunu mu demek istedin?' })).toBeVisible();
  await expect(page.getByText(/harekeleri farklı kelimeler/)).toBeVisible();
});

test('benzer sesler: dinleyip doğru kelimeyi seçer, yanlışlar Hatalarım\'da konusuna göre toplanır', async ({ page }) => {
  await openDrill(page, 'Benzer sesler pratiği');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Dinle: hangi', { exact: false })).toBeVisible();
  // Bir yanlış yapılana kadar ilk seçeneği seç (iki seçenekten biri doğru)
  let wrong = false;
  for (let i = 0; i < 12 && !wrong; i++) {
    await dialog.locator('.opt:not([disabled])').first().click();
    // Cevaptan sonraki geri bildirim kutusu (üstteki "Doğru / Yanlış" sayaçları değil)
    const fb = dialog.locator('[aria-live="polite"] .pop').first();
    await expect(fb).toBeVisible();
    wrong = (await fb.textContent())?.includes('Yanlış') ?? false;
    if (!wrong) await dialog.getByRole('button', { name: 'Sonraki soru' }).click();
  }
  expect(wrong).toBe(true);
  await dialog.getByRole('button', { name: 'Bitir ve sonucu gör' }).click();
  await page.getByRole('button', { name: 'Etkinliği kapat' }).click();

  await page.goto('/hatalarim');
  await expect(page.getByRole('heading', { name: /Benzer sesler/ })).toBeVisible();
  await page.getByRole('radio', { name: 'Konuya göre' }).click();
  await expect(page.getByRole('heading', { name: /^Benzer sesler: / })).toBeVisible();
});

test('rakam pratiği: rakamla yazılan cevap Arapça rakamla da kabul edilir', async ({ page }) => {
  await openDrill(page, 'Rakam ve sayı pratiği');
  const dialog = page.getByRole('dialog');
  const input = dialog.getByLabel('Cevabın (rakamlarla)');
  // Yazarak cevaplanan bir soru gelene kadar seçenekli soruları geç
  for (let i = 0; i < 30 && !(await input.isVisible()); i++) {
    await dialog.locator('.opt:not([disabled])').first().click();
    await dialog.getByRole('button', { name: 'Sonraki soru' }).click();
  }
  await expect(input).toBeVisible();
  await input.fill('٤٤٤٤٤٤٤٤');
  await input.press('Enter');
  // Arapça rakamlar Latin rakama çevrilip değerlendirilir; yanlışta doğrusu gösterilir
  await expect(input).toHaveValue('44444444');
  await expect(dialog.getByText('Doğrusu:')).toBeVisible();
});

test('60 saniye meydan okuma: süre işler, sonuçta rekor gösterilir', async ({ page }) => {
  await openDrill(page, 'Benzer sesler pratiği');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: '60 saniye' }).click();
  await expect(dialog.getByRole('heading', { name: '60 saniye meydan okuma' })).toBeVisible();
  await dialog.getByRole('button', { name: /^Başla/ }).click();
  await expect(dialog.getByText('Süre')).toBeVisible();
  await dialog.locator('.opt:not([disabled])').first().click();
  await dialog.getByRole('button', { name: 'Şimdi bitir' }).click();
  await expect(dialog.getByRole('heading', { name: /^60 saniyede \d+ doğru$/ })).toBeVisible();
  await expect(dialog.getByText(/Yeni rekor!|Rekorun: \d+ doğru/)).toBeVisible();
  // Sonuçtan yeniden meydan okumaya geçilebilir
  await dialog.getByRole('button', { name: '60 saniye meydan okuma' }).click();
  await expect(dialog.getByRole('heading', { name: '60 saniye meydan okuma' })).toBeVisible();
});

test('klavye öğretici: fiziksel tuşla yazılır, sitenin kısayolları tetiklenmez', async ({ page }) => {
  await page.goto('/alfabe/klavye');
  await page.getByRole('button', { name: /^Orta sıra/ }).click();
  const area = page.getByRole('region', { name: 'Yazma alanı' });
  await expect(area.getByText('İlerleme 0 / 25')).toBeVisible();
  const KEYS: Record<string, string> = { A: 'KeyA', S: 'KeyS', D: 'KeyD', F: 'KeyF', G: 'KeyG', H: 'KeyH', J: 'KeyJ', K: 'KeyK', L: 'KeyL', 'Ş': 'Semicolon', 'İ': 'Quote' };
  for (let i = 1; i <= 3; i++) {
    const hint = (await area.getByText(/^Tuş:/).textContent())!.replace('Tuş:', '').trim();
    await page.keyboard.press(KEYS[hint]);
    await expect(area.getByText(`İlerleme ${i} / 25`)).toBeVisible();
  }
  // Yanlış tuş sayılır
  const hint = (await area.getByText(/^Tuş:/).textContent())!.replace('Tuş:', '').trim();
  await page.keyboard.press(hint === 'A' ? 'KeyS' : 'KeyA');
  await expect(area.getByText('Yanlış 1')).toBeVisible();
  // h ve t tuşları harekeleri ya da okunuşu gizleyen kısayollar; yazarken çalışmamalı
  const settings = decodeURIComponent((await page.context().cookies()).find((c) => c.name === 'arb_settings')?.value || '{}');
  expect(settings).not.toContain('"harakat":false');
});

test('zıt ve eş anlamlılar: tablolar dinlenebilir, eşleştirme oyunu açılır', async ({ page }) => {
  await page.goto('/sozluk');
  await page.getByRole('link', { name: /Zıt ve eş anlamlılar/ }).click();
  await expect(page.getByRole('heading', { name: 'Zıt ve eş anlamlılar', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Zıt anlamlılar/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Eş anlamlılar/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'büyük: dinle' }).first()).toBeVisible();
  await page.getByRole('button', { name: /^Zıtları eşleştir/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Eşleri bul' })).toBeVisible();
  await expect(page.getByRole('dialog').getByText('0 / 10 çift')).toBeVisible();
});

test.describe.serial('liste klasörleri ve etiketleri', () => {
  const email = `e2e-folders-${Date.now().toString(36)}@example.test`;
  const password = 'e2e-Sifre-123';
  const state = path.join('test-results', 'folders-user.json');

  test.beforeAll(async ({ browser }) => {
    await resetLimits();
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/kayit');
    await page.locator('input[name="name"]').fill('E2E Klasör');
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

  test('listeye klasör ve etiket verilir, Listelerim klasöre göre gruplar ve etikete göre süzer', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: state });
    const page = await ctx.newPage();
    // Klasörsüz bir liste (API ile)
    await page.goto('/listelerim');
    await page.evaluate(async () => {
      await fetch('/api/lists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Serbest liste', items: [{ ar: 'بَيْت', tr: 'ev' }] }) });
    });
    // Klasörlü ve etiketli liste (arayüzden)
    await page.goto('/listelerim/yeni');
    await page.getByPlaceholder('Örneğin: 3. ünite kelimeleri').fill('Fiiller listesi');
    await page.getByPlaceholder('Örneğin: 1. dönem').fill('1. dönem');
    const tag = page.getByPlaceholder('Örneğin: sınav, fiiller');
    await tag.fill('sınav');
    await tag.press('Enter');
    await expect(page.getByRole('button', { name: 'sınav etiketini çıkar' })).toBeVisible();
    await page.getByRole('button', { name: 'Toplu ekle' }).click();
    await page.locator('textarea').fill('كَتَبَ ; ketebe ; yazdı\nذَهَبَ ; zehebe ; gitti');
    await page.getByRole('button', { name: 'Ekle', exact: true }).click();
    await page.getByRole('button', { name: 'Oluştur' }).click();
    await expect(page).toHaveURL(/\/listelerim\/\d+$/);

    await page.goto('/listelerim');
    await expect(page.getByRole('heading', { name: /^1\. dönem/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Klasörsüz/ })).toBeVisible();
    await page.getByRole('group', { name: 'Etikete göre süz' }).getByRole('button', { name: '#sınav' }).click();
    await expect(page.getByRole('link', { name: /Fiiller listesi/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Serbest liste/ })).toHaveCount(0);
    await ctx.close();
  });
});

test('canlı yarışma: bitince aynı oyuncularla yeni tur açılır', async ({ browser }) => {
  test.setTimeout(90_000);
  const host = await fresh(browser);
  await host.goto('/canli');
  const created = await host.evaluate(async () => {
    const r = await fetch('/api/live', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: { type: 'topic', id: 'renkler' }, count: 3, seconds: 10, dir: 'ar' }) });
    return r.json() as Promise<{ code: string; hostKey: string }>;
  });
  await host.evaluate(([c, k]) => localStorage.setItem(`arblearn:live-host:${c}`, JSON.stringify(k)), [created.code, created.hostKey]);
  await host.goto(`/canli/${created.code}/sunucu`);

  const pl = await fresh(browser);
  await pl.goto(`/canli/${created.code}`);
  await pl.getByPlaceholder('Ekranda görünecek ad').fill('Elif');
  await pl.getByRole('button', { name: 'Katıl' }).click();
  await expect(pl.getByRole('heading', { name: 'Hazırsın!' })).toBeVisible();

  await host.getByRole('button', { name: 'Başlat' }).click();
  await expect(pl.getByText('Soru 1 / 3', { exact: false })).toBeVisible();
  await pl.locator('button[style*="background"]').first().click();
  host.once('dialog', (d) => d.accept());
  await host.getByRole('button', { name: 'Yarışmayı bitir' }).click();
  await expect(host.getByRole('heading', { name: 'Kazananlar' })).toBeVisible();
  await expect(pl.getByText('Öğretmen yeni bir tur açarsa')).toBeVisible();

  await host.getByRole('button', { name: 'Aynı oyuncularla yeniden oyna' }).click();
  await expect(pl.getByRole('heading', { name: '2. tur başlıyor' })).toBeVisible();
  await expect(host.getByRole('button', { name: 'Elif' })).toBeVisible();
  await host.getByRole('button', { name: 'Başlat' }).click();
  await expect(pl.getByText('Soru 1 / 3', { exact: false })).toBeVisible();
  await pl.locator('button[style*="background"]').first().click();
  await expect(pl.getByText('Cevabın alındı')).toBeVisible();

  for (const p of [host, pl]) await p.context().close();
});
