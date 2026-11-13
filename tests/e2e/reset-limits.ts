import { config } from 'dotenv';
import mysql from 'mysql2/promise';

// Testler birkaç geçici hesap açar; IP başına saatte 5 kayıt sınırı takılmasın diye hesap açan her test dosyası
// başlamadan önce yerel adreslerin kayıt ve giriş denemesi sayaçlarını sıfırlar. Yalnızca yerel testte (E2E_URL yoksa).
export async function resetLimits() {
  if (process.env.E2E_URL) return;
  config({ path: '.env.local', quiet: true });
  if (!process.env.DATABASE_URL) return;
  const c = await mysql.createConnection(process.env.DATABASE_URL);
  await c.query("DELETE FROM auth_attempts WHERE ip IN ('127.0.0.1', '::1', '::ffff:127.0.0.1')");
  await c.end();
}
