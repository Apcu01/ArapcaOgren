import { expect, test } from '@playwright/test';

// Hesap: misafir ilerlemesi kayıtta hesaba aktarılır, başka bir tarayıcıdan girişte de görünür.
// Test sonunda oluşturulan hesap silinir. Kayıt sınırı aynı IP'den saatte 5 hesaptır.
const email = `e2e-${Date.now().toString(36)}@example.test`;
const password = 'e2e-Sifre-123';

test('kayıt, ilerlemenin aktarılması, başka cihazdan giriş ve hesabın silinmesi', async ({ page, browser }) => {
  // Misafirken bir ders oku
  await page.goto('/konu/belirlilik');
  await page.getByRole('button', { name: 'Okudum, etkinliklere geç' }).click();

  // Hesap aç
  await page.goto('/kayit');
  await page.locator('input[name="name"]').fill('E2E Test');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Hesabı oluştur' }).click();
  await expect(page.getByRole('button', { name: 'Hesap menüsü' })).toBeVisible();

  // Yeni ve boş bir tarayıcıda giriş yap: ilerleme veritabanından gelmeli
  const other = await browser.newContext();
  const p2 = await other.newPage();
  await p2.goto('/giris');
  await p2.locator('input[name="email"]').fill(email);
  await p2.locator('input[name="password"]').fill(password);
  await p2.getByRole('button', { name: 'Giriş yap' }).last().click();
  await expect(p2.getByRole('button', { name: 'Hesap menüsü' })).toBeVisible();
  await p2.goto('/ilerleme');
  const card = p2.locator('a[href="/konu/belirlilik"]');
  await expect(card.getByText(/Konu okundu/)).toBeVisible();
  await other.close();

  // Temizlik: hesabı sil
  const status = await page.evaluate(async (pw) => (await fetch('/api/account', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).status, password);
  expect(status).toBe(200);
});
