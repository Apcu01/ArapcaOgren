import { expect, test, type Page } from '@playwright/test';

// Misafir kullanıcı: hesap açmadan ders okuma, etkinlik çözme ve ilerlemenin tarayıcıda saklanması

/** Açık olan soru tabanlı etkinliği sonuna kadar çözer (her soruda ilk seçenek) */
async function finishQuiz(page: Page) {
  const player = page.locator('#player');
  for (let i = 0; i < 40; i++) {
    // Sıradaki soru ya da sonuç ekranı çizilene kadar bekle
    const done = player.getByRole('button', { name: 'Etkinliklere dön' });
    const opt = player.locator('.opt[data-v]').first();
    await expect(done.or(opt)).toBeVisible();
    if (await done.isVisible()) return;
    await opt.click();
    await player.locator('[data-next]').click();
  }
  throw new Error('Etkinlik bitmedi');
}

test('ana sayfada konu araması Türkçe karakter olmadan da çalışır', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Konu ara: saatler, zamirler, sıfatlar').fill('sifat');
  await expect(page.getByText(/\d+ konu bulundu/)).toBeVisible();
  await expect(page.locator('#konular a[href="/konu/sifatlar"]')).toBeVisible();
  await expect(page.locator('#konular a[href="/konu/saatler"]')).toHaveCount(0);
});

test('ders okunur, etkinlik çözülür ve ilerleme sayfasına yansır', async ({ page }) => {
  await page.goto('/konu/renkler');
  // Sayfa etkileşime hazır olana kadar (React yüklenene kadar) dokunuşu tekrarla
  await expect(async () => {
    await page.getByRole('button', { name: /Okudum, etkinliklere geç|^Etkinliklere geç/ }).first().click();
    await page.getByRole('button', { name: /Hangi renk\?/ }).first().click();
    await expect(page.locator('#player')).toBeVisible({ timeout: 1000 });
  }).toPass();
  await finishQuiz(page);
  await page.getByRole('button', { name: 'Etkinliklere dön' }).click();

  await page.goto('/ilerleme');
  const card = page.locator('a[href="/konu/renkler"]').locator('xpath=ancestor::div[contains(@class,"rounded-[18px]")][1]');
  await expect(card.getByText('Konu okundu')).toBeVisible();
  await expect(card.getByText(/Çoktan seçmeli · %\d+/)).toBeVisible();
  // Çalışma takvimi: bugün iki çalışma (ders + etkinlik)
  const cal = page.locator('section', { has: page.getByRole('heading', { name: 'Çalışma takvimi' }) });
  await expect(cal.getByText('Çalışılan gün').locator('xpath=following-sibling::span')).toHaveText('1');
  await expect(cal.getByText('Toplam çalışma').locator('xpath=following-sibling::span')).toHaveText('2');
});

test('açık tema seçilir ve sayfa yenilenince korunur', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Görünüm ayarları' }).click();
  await page.getByRole('radio', { name: /Açık/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(246, 240, 231)');
});

test('sözlükte kök ailesi açılır', async ({ page }) => {
  await page.goto('/sozluk');
  await page.getByPlaceholder('Ara: kitap, book, كتاب').fill('kitap');
  const row = page.locator('div.border-b', { hasText: 'kitâb' }).first();
  await row.getByRole('button', { name: /Kök/ }).click();
  await expect(row.getByText('Türkçede bu kökten')).toBeVisible();
  await expect(row.getByText('mektup', { exact: true })).toBeVisible();
  await expect(row.getByText('Kök anlamı').locator('xpath=following-sibling::span')).toHaveText('yazmak');
});

test('harf çizme alıştırması çizimi değerlendirir', async ({ page }) => {
  await page.goto('/alfabe');
  const sec = page.locator('section', { has: page.getByRole('heading', { name: 'Harf yazma alıştırması' }) });
  const pad = sec.getByLabel('Be harfini çizme alanı');
  await pad.scrollIntoViewIfNeeded();
  const box = (await pad.boundingBox())!;
  // Harfin dışına taşan bir karalama
  await page.mouse.move(box.x + 10, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 10, box.y + 20, { steps: 10 });
  await page.mouse.move(box.x + 20, box.y + box.height - 10, { steps: 10 });
  await page.mouse.up();
  await sec.getByRole('button', { name: 'Kontrol et' }).click();
  await expect(sec.getByText(/harfin dışına taştı/)).toBeVisible();
  await sec.getByRole('button', { name: 'Temizle' }).click();
  await expect(sec.getByRole('button', { name: 'Kontrol et' })).toBeDisabled();
});

test.describe('mobil', () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

  test('hamburger menüden sayfa açılır ve sayfa yana taşmaz', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
    // Sayfa etkileşime hazır olana kadar (React yüklenene kadar) dokunuşu tekrarla
    await expect(async () => {
      await page.getByRole('button', { name: /Menüyü (aç|kapat)/ }).click();
      await expect(page.locator('#mobil-menu')).toBeVisible({ timeout: 1000 });
    }).toPass();
    await page.locator('#mobil-menu').getByRole('link', { name: 'Sözlük' }).click();
    await expect(page).toHaveURL(/\/sozluk$/);
    await expect(page.locator('#mobil-menu')).toHaveCount(0);
  });
});
