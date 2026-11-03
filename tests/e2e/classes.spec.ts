import fs from 'node:fs';
import path from 'node:path';
import { expect, test, type Browser } from '@playwright/test';
import { readingBySlug } from '../../src/lib/readings';

// Sınıflar, okuma metni ve haftalık lig: öğretmen sınıf açar ve ödev verir, öğrenci bağlantıyla katılır,
// okuma metnini bitirir; ödev öğretmende "tamamlandı" görünür, öğrenci sınıf liginde ve genel ligde puan alır.
// Geçici hesaplar sonunda silinir (sınıf da silinir).

const stamp = Date.now().toString(36);
const password = 'e2e-Sifre-123';
const users = {
  teacher: { name: 'E2E Öğretmen', email: `e2e-teacher-${stamp}@example.test`, state: path.join('test-results', 'class-teacher.json') },
  student: { name: 'E2E Öğrenci', email: `e2e-student-${stamp}@example.test`, state: path.join('test-results', 'class-student.json') }
};
let code = '';
let classUrl = '';

async function register(browser: Browser, u: (typeof users)['teacher']) {
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

test.describe.serial('sınıflar, okuma ve lig', () => {
  test.beforeAll(async ({ browser }) => {
    await register(browser, users.teacher);
    await register(browser, users.student);
  });

  test.afterAll(async ({ browser }) => {
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

  test('misafir sınıflar için giriş uyarısı görür', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await page.goto('/sinif/katil?kod=ABC234');
    await expect(page.getByRole('heading', { name: 'Sınıflar için giriş yap' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Giriş yap' }).last()).toHaveAttribute('href', /next=%2Fsinif%2Fkatil%3Fkod%3DABC234/);
    await ctx.close();
  });

  test('öğretmen sınıf açar ve okuma ile ders ödevi verir', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: users.teacher.state });
    const page = await ctx.newPage();
    await page.goto('/siniflar');
    await page.getByPlaceholder('Örneğin: 9-A Arapça').fill('E2E Sınıf');
    await page.getByRole('button', { name: 'Sınıfı aç' }).click();
    await expect(page.getByRole('heading', { name: 'E2E Sınıf' })).toBeVisible();
    classUrl = new URL(page.url()).pathname;
    code = (await page.locator('section[aria-label="Sınıfa katılma"] .font-mono').textContent())!.trim();
    expect(code).toMatch(/^[A-Z2-9]{6}$/);

    await page.getByRole('radio', { name: 'Okuma metni' }).click();
    await page.locator('select').selectOption('ailem');
    await page.getByRole('button', { name: 'Ödev ver' }).click();
    await expect(page.locator('article', { hasText: 'Ailem' })).toBeVisible();
    await page.getByRole('radio', { name: 'Ders' }).click();
    await page.locator('select').selectOption('aile');
    await page.getByRole('button', { name: 'Ödev ver' }).click();
    await expect(page.locator('article', { hasText: 'Aile' }).filter({ hasText: 'Ders' })).toBeVisible();
    // Aynı ödev ikinci kez verilemez
    await page.getByRole('radio', { name: 'Ders' }).click();
    await page.locator('select').selectOption('aile');
    await page.getByRole('button', { name: 'Ödev ver' }).click();
    await expect(page.getByText('Bu ödev zaten verilmiş.')).toBeVisible();
    await ctx.close();
  });

  test('öğrenci bağlantıyla katılır, okuma metnini bitirir ve puan alır', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: users.student.state });
    const page = await ctx.newPage();
    await page.goto(`/sinif/katil?kod=${code}`);
    await expect(page).toHaveURL(new RegExp(classUrl + '$'));
    await expect(page.getByRole('heading', { name: 'E2E Sınıf' })).toBeVisible();
    const task = page.locator('article', { hasText: 'Ailem' });
    await expect(task.getByText('Başlanmadı')).toBeVisible();
    await task.getByRole('link', { name: /Başla/ }).click();
    await expect(page).toHaveURL(/\/okuma\/ailem$/);

    // Kelimeye dokununca anlamı çıkar
    await page.getByRole('button', { name: /: doktor$/ }).click();
    await expect(page.locator('[role="status"]').getByText('doktor', { exact: true })).toBeVisible();

    const r = readingBySlug('ailem')!;
    for (const q of r.questions) await page.getByRole('radiogroup', { name: q.q }).getByRole('radio', { name: q.a, exact: true }).click();
    await page.getByRole('button', { name: 'Cevapları kontrol et' }).click();
    await expect(page.getByText(`${r.questions.length} / ${r.questions.length} doğru`)).toBeVisible();

    await page.goto(classUrl);
    await expect(page.locator('article', { hasText: 'Ailem' }).getByText('Tamamlandı')).toBeVisible();
    const league = page.locator('section', { has: page.getByRole('heading', { name: /Sınıfın haftalık ligi/ }) });
    await expect(league.getByText('E2E Ö.')).toBeVisible();
    await expect(league.getByText(/\d+ puan/)).toBeVisible();

    // Genel lig: kendi sırası görünür
    await page.goto('/lig');
    await expect(page.locator('li', { hasText: 'Sen' }).getByText(/puan/)).toBeVisible();
    // Rozet: ilk okuma metni
    await page.goto('/ilerleme');
    await expect(page.locator('li', { hasText: 'Okur' }).getByText('Kazanıldı')).toBeVisible();
    await ctx.close();
  });

  test('öğretmen kimin bitirdiğini görür ve öğrenciyi çıkarabilir', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: users.teacher.state });
    const page = await ctx.newPage();
    page.on('dialog', (d) => d.accept());
    await page.goto(classUrl);
    const task = page.locator('article', { hasText: 'Ailem' });
    await expect(task.getByText(/Tamamlayan:\s*1\s*\/\s*1/)).toBeVisible();
    await task.getByRole('button', { name: 'Öğrenci öğrenci gör' }).click();
    await expect(task.locator('li', { hasText: 'E2E Öğrenci' }).getByText('Tamamlandı')).toBeVisible();
    await page.getByRole('button', { name: 'E2E Öğrenci: sınıftan çıkar' }).click();
    await expect(page.getByText('Henüz katılan yok.')).toBeVisible();
    await page.getByRole('button', { name: 'Sınıfı sil' }).click();
    await expect(page).toHaveURL(/\/siniflar$/);
    await ctx.close();
  });
});
