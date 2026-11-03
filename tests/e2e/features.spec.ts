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
