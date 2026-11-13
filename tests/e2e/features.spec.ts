import { expect, test } from '@playwright/test';

// Misafir: dikte (ders sayfasından), görünüm ayarları (ses hızı, yazı boyutu, canlandırmalar), klavye kısayolları
test.use({ storageState: { cookies: [], origins: [] } });

test('ders sayfasından dikte: yanlış kelime sonda tekrar sorulur, doğru yazılınca biter', async ({ page }) => {
  await page.goto('/konu/aile');
  await page.getByRole('button', { name: 'Dikte: dinle ve yaz' }).click();
  const player = page.locator('#player');
  await expect(player.getByText('Kelimeyi dinle, duyduğunu Arapça harflerle ya da okunuşuyla yaz.')).toBeVisible();
  const seen: { ar: string; tl: string }[] = [];
  const input = player.getByLabel('Duyduğun kelime');
  const next = async () => { await player.getByRole('button', { name: /Devam/ }).click(); };
  // İlk tur: 10 kelimenin hepsi "Bilmiyorum" (doğrusu gösterilir)
  for (let i = 0; i < 10; i++) {
    await player.getByRole('button', { name: 'Bilmiyorum' }).click();
    const fb = player.locator('[aria-live="polite"]');
    seen.push({ ar: (await fb.locator('.ar').first().textContent())!, tl: (await fb.locator('.tl').first().textContent())! });
    await next();
  }
  // İkinci tur: aynı kelimeler tekrar sorulur; Arapça harekesiz ya da okunuşla yazılabilir
  for (let i = 0; i < 10; i++) {
    await expect(player.getByText('Tekrar soru')).toBeVisible();
    const w = seen[i];
    await input.fill(i % 2 ? w.ar.replace(/[ً-ْ]/g, '') : w.tl);
    await player.getByRole('button', { name: 'Kontrol et' }).click();
    await expect(player.getByText('Doğru!')).toBeVisible();
    await next();
  }
  await expect(player.getByText('Bitti')).toBeVisible();
  await expect(player.getByText('%0')).toBeVisible();
});

test('görünüm ayarları çerezde saklanır ve sayfaya uygulanır', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Görünüm ayarları' }).click();
  await page.getByRole('radiogroup', { name: 'Ses hızı' }).getByRole('radio', { name: 'Yavaş', exact: true }).click();
  await page.getByRole('radiogroup', { name: 'Sayfa yazı boyutu' }).getByRole('radio', { name: 'Büyük', exact: true }).click();
  await page.getByLabel('Canlandırmaları azalt').check();
  await expect(page.locator('body')).toHaveClass(/txt-1/);
  await expect(page.locator('body')).toHaveClass(/no-motion/);
  await page.reload();
  // Sayfa çizilmeden önce çerezden uygulanır
  await expect(page.locator('body')).toHaveClass(/txt-1/);
  const cookie = (await page.context().cookies()).find((c) => c.name === 'arb_settings')!;
  expect(JSON.parse(decodeURIComponent(cookie.value))).toMatchObject({ rate: 0.6, txtSize: 1, motion: false });
});

test('klavye kısayolları: ? yardım açar, g ardından s sözlüğe gider', async ({ page }) => {
  await page.goto('/');
  await page.locator('body').click({ position: { x: 5, y: 300 } });
  await page.keyboard.press('Shift+Slash');
  await expect(page.getByRole('dialog', { name: 'Klavye kısayolları' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Klavye kısayolları' })).toBeHidden();
  await page.keyboard.press('g');
  await page.keyboard.press('s');
  await expect(page).toHaveURL(/\/sozluk$/);
  await page.keyboard.press('/');
  await expect(page.locator('input[type="search"]')).toBeFocused();
});

test('okuma metinleri listesi ve çevrimdışı penceresi', async ({ page }) => {
  await page.goto('/okuma');
  await expect(page.getByRole('link', { name: /Lokantada/ })).toBeVisible();
  await page.getByRole('button', { name: 'Görünüm ayarları' }).click();
  await page.getByRole('button', { name: 'Çevrimdışı kullanım' }).click();
  const dlg = page.getByRole('dialog', { name: 'Çevrimdışı kullanım' });
  await expect(dlg.getByText('Dersler ve sayfalar')).toBeVisible();
  await expect(dlg.getByText(/Kelime sesleri/)).toBeVisible();
  await expect(dlg.getByText(/kayıt, yaklaşık [\d.,]+ MB/).first()).toBeVisible();
});

test('hareke koy: yanlış kelime sonda tekrar sorulur, doğru harekelerle biter', async ({ page }) => {
  const { slots, SHADDA, VOWELS } = await import('../../src/lib/harakat');
  await page.goto('/konu/evim');
  await page.getByRole('button', { name: 'Hareke koy', exact: true }).first().click();
  const player = page.locator('#player');
  const fb = player.locator('[aria-live="polite"]');
  const total = Number((await player.getByText(/^1 \/ \d+$/).textContent())!.split('/')[1]);
  const seen: string[] = [];
  // İlk tur: her harfe üstün (çoğu yanlış); doğrusu gösterilir
  for (let i = 0; i < total; i++) {
    const tiles = player.getByRole('group', { name: 'Harfler' }).locator('button:not([disabled])');
    for (let k = 0; k < await tiles.count(); k++) {
      await tiles.nth(k).click();
      await player.getByRole('group', { name: 'Harekeler' }).getByRole('button', { name: /üstün$/ }).first().click();
    }
    await player.getByRole('button', { name: 'Kontrol et' }).click();
    seen.push((await fb.locator('.ar').first().textContent())!);
    await player.getByRole('button', { name: /Devam/ }).click();
  }
  // Tekrar sorulanlar: doğru harekelerle
  const names = Object.fromEntries(VOWELS.map(([m, l]) => [m, l]));
  while (await player.getByText('Tekrar soru').isVisible()) {
    const word = seen.find(Boolean)!;
    // Hangi kelimenin sorulduğu: harekesiz hâli ekrandaki harflerle aynı olan
    const letters = (await player.getByRole('group', { name: 'Harfler' }).locator('button').allTextContents()).map((t) => t.replace(/[ً-ٰٕ]/g, '')).join('');
    const target = seen.find((w) => slots(w).map((s) => s.letter).join('') === letters) || word;
    seen.splice(seen.indexOf(target), 1);
    const ss = slots(target);
    const tiles = player.getByRole('group', { name: 'Harfler' }).locator('button');
    for (const [k, s] of ss.entries()) {
      if (!s.asked) continue;
      await tiles.nth(k).click();
      if (s.marks.includes(SHADDA)) await player.getByRole('button', { name: /şedde$/ }).click();
      const v = s.marks.replace(SHADDA, '');
      if (v) await player.getByRole('group', { name: 'Harekeler' }).getByRole('button', { name: new RegExp(names[v] + '$') }).first().click();
    }
    await player.getByRole('button', { name: 'Kontrol et' }).click();
    await expect(fb.getByText('Doğru!')).toBeVisible();
    await player.getByRole('button', { name: /Devam/ }).click();
  }
  await expect(player.getByText('Bitti')).toBeVisible();
});
