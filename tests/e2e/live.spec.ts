import { expect, test, type Browser, type Page } from '@playwright/test';

// Canlı yarışma: öğretmen yarışmayı açar, iki öğrenci hesapsız katılır, sorular cevaplanır, sıralama ve bitiş görülür.
// Ayrı tarayıcı bağlamları: öğretmen ve öğrenciler birbirinin depolamasını görmez.

async function fresh(browser: Browser) {
  return (await browser.newContext({ storageState: { cookies: [], origins: [] } })).newPage();
}

test('canlı yarışma baştan sona oynanır', async ({ browser }) => {
  test.setTimeout(120_000);
  // Öğretmen: arayüzden yarışma açar (ilk ders, 3 soru için API ile ayar)
  const host = await fresh(browser);
  await host.goto('/canli');
  await expect(host.getByRole('heading', { name: 'Canlı yarışma' })).toBeVisible();
  const created = await host.evaluate(async () => {
    const r = await fetch('/api/live', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: { type: 'topic', id: 'renkler' }, count: 3, seconds: 10, dir: 'ar' }) });
    return r.json() as Promise<{ code: string; hostKey: string }>;
  });
  expect(created.code).toMatch(/^\d{6}$/);
  await host.evaluate(([c, k]) => localStorage.setItem(`arblearn:live-host:${c}`, JSON.stringify(k)), [created.code, created.hostKey]);
  await host.goto(`/canli/${created.code}/sunucu`);
  await expect(host.getByText(`${created.code.slice(0, 3)} ${created.code.slice(3)}`)).toBeVisible();

  // Öğrenciler: PIN ile katılır (biri ana sayfadaki PIN kutusundan)
  const a = await fresh(browser);
  await a.goto('/canli');
  await a.getByLabel("Yarışma PIN'i").fill(created.code);
  await a.getByRole('button', { name: 'Devam' }).click();
  await a.getByPlaceholder('Ekranda görünecek ad').fill('Ayşe');
  await a.getByRole('button', { name: 'Katıl' }).click();
  await expect(a.getByRole('heading', { name: 'Hazırsın!' })).toBeVisible();

  const b = await fresh(browser);
  await b.goto(`/canli/${created.code}`);
  await b.getByPlaceholder('Ekranda görünecek ad').fill('Ayşe');
  await b.getByRole('button', { name: 'Katıl' }).click();
  // Aynı ad: sonuna sayı eklenir
  await expect(b.getByText('Ayşe 2')).toBeVisible();

  await expect(host.getByRole('button', { name: 'Ayşe 2' })).toBeVisible();
  await host.getByRole('button', { name: 'Başlat' }).click();

  for (let q = 1; q <= 3; q++) {
    await expect(host.getByText(`Soru ${q} / 3`)).toBeVisible();
    const pick = async (p: Page, i: number) => {
      const opts = p.locator('button[style*="background"]');
      await expect(opts.first()).toBeVisible();
      await opts.nth(i).click();
      await expect(p.getByText('Cevabın alındı')).toBeVisible();
    };
    await pick(a, 0);
    await pick(b, 1);
    // Herkes cevaplayınca süre beklenmeden sonuç gelir
    await expect(a.getByText(/^(Doğru!|Yanlış)$/)).toBeVisible();
    await expect(host.getByText('2 / 2 cevap')).toBeVisible();
    await host.getByRole('button', { name: q < 3 ? 'Sıralama' : 'Sonuçlar' }).click();
    if (q < 3) {
      await expect(host.getByRole('heading', { name: 'Sıralama' })).toBeVisible();
      await expect(b.getByText('sıradasın')).toBeVisible();
      await host.getByRole('button', { name: 'Sonraki soru' }).click();
    }
  }
  await expect(host.getByRole('heading', { name: 'Kazananlar' })).toBeVisible();
  // Sonuç raporu: giriş yapmadan açıldığı için saklanmaz, Excel'e indirilebilir
  await expect(host.getByRole('heading', { name: 'Sonuç raporu' })).toBeVisible();
  await expect(host.getByText(/sonuçları saklanmaz/)).toBeVisible();
  await host.getByRole('tab', { name: 'Öğrencilere göre' }).click();
  await expect(host.getByRole('cell', { name: 'Ayşe 2' })).toBeVisible();
  const [file] = await Promise.all([host.waitForEvent('download'), host.getByRole('button', { name: "Excel'e indir" }).click()]);
  expect(file.suggestedFilename()).toMatch(/^yarisma-\d{4}-\d{2}-\d{2}-.+\.csv$/);
  await expect(a.getByText('Yarışma bitti')).toBeVisible();
  await expect(b.getByText('Yarışma bitti')).toBeVisible();

  // Puanlar tutarlı: öğretmen sıralamasının toplamı öğrencilerin puanlarıyla aynı
  const score = async (p: Page) => Number((await p.locator('b.tabular-nums').first().textContent()) || 0);
  const view = await host.evaluate(async ([c, k]) => (await fetch(`/api/live/${c}?k=${k}`)).json(), [created.code, created.hostKey]);
  expect(view.players.reduce((n: number, p: { score: number }) => n + p.score, 0)).toBe((await score(a)) + (await score(b)));

  for (const p of [host, a, b]) await p.context().close();
});

test('yanlış PIN açıklayıcı mesaj gösterir', async ({ page }) => {
  await page.goto('/canli/000000');
  await expect(page.getByRole('heading', { name: 'Yarışma bulunamadı' })).toBeVisible();
});
