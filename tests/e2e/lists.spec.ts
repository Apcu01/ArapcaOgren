import fs from 'node:fs';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

// Kelime listeleri: misafir giriş uyarısı görür; üye liste oluşturur, kartlarla ve öğren moduyla çalışır,
// eşleştirme oyununu bitirir ve kelimelerin durumu liste sayfasına yansır. Geçici hesap sonunda silinir (listeler de silinir).

const email = `e2e-lists-${Date.now().toString(36)}@example.test`;
const password = 'e2e-Sifre-123';
const state = path.join('test-results', 'lists-user.json');
const WORDS = [['كَتَبَ', 'ketebe', 'yazdı'], ['قَلَمٌ', 'kalemun', 'kalem'], ['بَيْتٌ', 'beytun', 'ev'], ['بَابٌ', 'bâbun', 'kapı']];
const strip = (s: string) => s.replace(/[ً-ْٰ]/g, '').trim();
const meaningOf = (t: string) => WORDS.find((w) => strip(w[0]) === strip(t) || w[2] === t.trim());

test.describe.serial('kelime listeleri', () => {
  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/kayit');
    await page.locator('input[name="name"]').fill('E2E Liste');
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

  test('misafir giriş yapması gerektiğini görür', async ({ page }) => {
    await page.goto('/listelerim');
    await expect(page.getByRole('heading', { name: 'Kelime listeleri için giriş yap' })).toBeVisible();
    // Hazır listeler hesapsız görülebilir, kopyalamak için giriş istenir
    await page.getByRole('link', { name: /hazır kelime listeleri/ }).click();
    await page.getByRole('link', { name: /Hayvanlar/ }).click();
    await expect(page.getByRole('link', { name: 'Giriş yap ve kopyala' })).toHaveAttribute('href', /next=%2Fhazir-listeler%2Fhayvanlar/);
  });

  test.describe('üye', () => {
    test.use({ storageState: state });
    let listUrl = '';

    test('toplu ekleme ile liste oluşturur', async ({ page }) => {
      await page.goto('/listelerim');
      await page.getByRole('link', { name: 'Yeni liste' }).click();
      await page.getByPlaceholder('Örneğin: 3. ünite kelimeleri').fill('E2E listesi');
      await page.getByRole('button', { name: 'Toplu ekle' }).click();
      await page.locator('textarea').fill(WORDS.map((w) => w.join(' ; ')).join('\n'));
      await expect(page.getByText('4 kelime', { exact: true }).first()).toBeVisible();
      await page.getByRole('button', { name: 'Ekle', exact: true }).click();
      await page.getByRole('button', { name: 'Oluştur' }).click();
      await page.waitForURL(/\/listelerim\/\d+$/);
      listUrl = new URL(page.url()).pathname;
      await expect(page.getByRole('heading', { name: 'E2E listesi' })).toBeVisible();
      await expect(page.getByText('4 kelime').first()).toBeVisible();
      await expect(page.getByRole('link', { name: /Kartlar/ })).toBeVisible();
    });

    test('kartlarda biliyorum dediği kelime durumuna yansır', async ({ page }) => {
      await page.goto(listUrl + '/kartlar');
      // Her dokunuştan sonra sıradaki kartın gelmesi beklenir
      for (const [n, name] of [[1, 'Biliyorum'], [2, 'Biliyorum'], [3, 'Öğreniyorum'], [4, 'Biliyorum']] as const) {
        await expect(page.getByText(`${n} / 4`)).toBeVisible();
        await page.getByRole('button', { name }).click();
      }
      await expect(page.getByText('Biliyorum: 3')).toBeVisible();
      // Liste sayfasına dönünce cevaplar gönderilmiş olur
      await page.getByRole('link', { name: 'E2E listesi' }).click();
      await expect(page.getByRole('button', { name: /Öğrenmeye devam edilenler/ })).toContainText('4');
    });

    test('öğren modunda doğru cevaplar kelimeyi tanıdık yapar', async ({ page }) => {
      await page.goto(listUrl + '/ogren');
      await expect(page.getByText(/1\. tur/)).toBeVisible();
      for (let i = 0; i < 4; i++) {
        const prompt = await page.locator('.rounded-\\[22px\\] .ar').first().textContent();
        const w = meaningOf(prompt || '');
        await page.locator('[data-opt]', { hasText: w ? w[2] : '' }).first().click();
        await page.waitForTimeout(900);
      }
      await expect(page.getByRole('heading', { name: '1. tur bitti' })).toBeVisible();
      await expect(page.getByText(/4\s*tanıdık/)).toBeVisible();
    });

    test('liste bağlantıyla paylaşılır, misafir görür ve üye kopyalar', async ({ page, browser }) => {
      await page.goto(listUrl);
      await page.getByRole('button', { name: 'Paylaş' }).click();
      // Kutu sunucu cevabından sonra işaretlenir
      await page.getByRole('checkbox').click();
      await expect(page.getByLabel('Paylaşım bağlantısı')).toBeVisible();
      const link = await page.getByLabel('Paylaşım bağlantısı').inputValue();
      expect(link).toMatch(/\/liste\/[\w-]{16,}$/);
      // Misafir: kelimeleri görür, kopyalamak için giriş ister
      // Testin oturumu devralınmasın
      const guest = await (await browser.newContext({ storageState: { cookies: [], origins: [] } })).newPage();
      await guest.goto(link);
      await expect(guest.getByRole('heading', { name: 'E2E listesi' })).toBeVisible();
      await expect(guest.getByText('E2E paylaştı · 4 kelime')).toBeVisible();
      await expect(guest.getByRole('link', { name: 'Giriş yap ve kopyala' })).toHaveAttribute('href', /next=%2Fliste%2F/);
      // Üye kopyalar: yeni liste açılır
      await page.goto(link);
      await page.getByRole('button', { name: 'Listelerime kopyala' }).click();
      await page.waitForURL((u) => /\/listelerim\/\d+$/.test(u.pathname) && u.pathname !== listUrl);
      await expect(page.getByText('4 kelime').first()).toBeVisible();
      // Paylaşım kapatılınca bağlantı çalışmaz
      await page.goto(listUrl);
      await page.getByRole('button', { name: 'Paylaş' }).click();
      await page.getByRole('checkbox').click();
      await expect(page.getByLabel('Paylaşım bağlantısı')).toHaveCount(0);
      await guest.goto(link);
      await expect(guest.getByRole('heading', { name: 'Bu liste artık paylaşılmıyor' })).toBeVisible();
      await guest.context().close();
    });

    test('hazır liste kopyalanır', async ({ page }) => {
      await page.goto('/hazir-listeler');
      await page.getByRole('link', { name: /Selamlaşma ve nezaket/ }).click();
      await expect(page.getByRole('heading', { name: 'Selamlaşma ve nezaket' })).toBeVisible();
      await expect(page.getByText('مَرْحَبًا')).toBeVisible();
      await page.getByRole('button', { name: 'Listelerime kopyala' }).click();
      await page.waitForURL(/\/listelerim\/\d+$/);
      await expect(page.getByRole('heading', { name: 'Selamlaşma ve nezaket' })).toBeVisible();
      await expect(page.getByText('25 kelime').first()).toBeVisible();
    });

    test('eşleştirme oyunu biter ve en iyi süre kaydedilir', async ({ page }) => {
      await page.goto(listUrl + '/eslestir');
      await page.getByRole('button', { name: 'Oyunu başlat' }).click();
      for (let k = 0; k < 4; k++) {
        const tiles = page.locator('.grid button:not([disabled])');
        const first = (await tiles.first().textContent())!.trim();
        const w = meaningOf(first)!;
        await tiles.first().click();
        const n = await tiles.count();
        for (let j = 1; j < n; j++) {
          const t = (await tiles.nth(j).textContent())!.trim();
          if (t !== first && meaningOf(t) === w) { await tiles.nth(j).click(); break; }
        }
      }
      await expect(page.getByText('Süren')).toBeVisible();
      await page.goto(listUrl);
      await expect(page.getByText(/En iyi süre: \d/)).toBeVisible();
    });

    test('kopya, asıl listedeki yeni, düzeltilen ve silinen kelimeleri önerir', async ({ page }) => {
      const srcId = Number(listUrl.split('/').pop());
      await page.goto(listUrl);
      // API ile: paylaşımı aç, kopyala
      const copyId = await page.evaluate(async (id) => {
        const post = (u: string, b?: unknown) => fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }).then((r) => r.json());
        const { token } = await post(`/api/lists/${id}/study`, { action: 'share', on: true });
        return (await post(`/api/shared/${token}/copy`)).id as number;
      }, srcId);
      const api = (fn: string, ...args: unknown[]) => page.evaluate(async ([f, a]) => {
        const get = async (id: number) => (await (await fetch(`/api/lists/${id}`)).json()).list;
        if (f === 'get') return get(a[0] as number);
        const [id, body] = a as [number, unknown];
        return (await fetch(`/api/lists/${id}${f}`, { method: f ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).status;
      }, [fn, args] as const);

      // Asıl listenin sahibi çalışınca (içerik değişmeden) öneri çıkmaz
      const src = await api('get', srcId);
      await api('/study', srcId, { action: 'answers', results: [{ id: src.items[0].id, ok: true }] });
      await page.goto(`/listelerim/${copyId}`);
      await expect(page.getByText(/listesinden kopyalandı/)).toBeVisible();
      await expect(page.getByText('Asıl listede değişiklik var', { exact: false })).toHaveCount(0);

      // Asıl liste: "kapı" silinir, "ev" anlamı düzeltilir, yeni kelime eklenir
      const items = src.items.filter((x: { tr: string }) => x.tr !== 'kapı').map((x: { id: number; ar: string; tl: string; tr: string; note: string }) => ({ ...x, tr: x.tr === 'ev' ? 'ev, konut' : x.tr }));
      expect(await api('', srcId, { title: 'E2E listesi', description: '', items: [...items, { ar: 'مَسْجِدٌ', tl: 'mescidun', tr: 'cami', note: '' }] })).toBe(200);

      await page.reload();
      await expect(page.getByText('Asıl listede değişiklik var: 1 yeni, 1 düzeltilmiş, 1 silinmiş kelime')).toBeVisible();
      await page.getByRole('button', { name: 'Gözden geçir' }).click();
      const dlg = page.getByRole('dialog', { name: 'Asıl listedeki değişiklikler' });
      await expect(dlg.getByText('ev, konut')).toBeVisible();
      // Silineni kendi listesinde tutmak istiyor
      await dlg.locator('label', { hasText: 'kapı' }).getByRole('checkbox').uncheck();
      await dlg.getByRole('button', { name: 'Seçilenleri uygula (2)' }).click();
      await expect(page.getByText('1 kelime eklendi, 1 kelime düzeltildi.')).toBeVisible();

      const copy = await api('get', copyId);
      const trs = copy.items.map((x: { tr: string }) => x.tr);
      expect(trs).toContain('cami');
      expect(trs).toContain('ev, konut');
      expect(trs).toContain('kapı');
      // Uygulanan ya da reddedilen değişiklikler bir daha önerilmez
      await page.reload();
      await expect(page.getByText(/listesinden kopyalandı/)).toBeVisible();
      await expect(page.getByText('Asıl listede değişiklik var', { exact: false })).toHaveCount(0);
    });
  });
});
