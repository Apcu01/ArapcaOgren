/**
 * Yönetici hesabı oluşturur ya da var olan bir hesabı yönetici yapar.
 *   npm run admin:create -- e-posta@ornek.com "Şifre123" "Ad Soyad"
 *   npm run admin:create -- e-posta@ornek.com            (var olan hesabı yönetici yapar)
 */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

config({ path: '.env.local' });
config();

async function main() {
  const [email, password, name] = process.argv.slice(2);
  if (!email) { console.log('Kullanım: npm run admin:create -- e-posta [şifre] [ad]'); process.exit(1); }
  const conn = await mysql.createConnection(process.env.DATABASE_URL!);
  const mail = email.trim().toLowerCase();
  const [rows] = await conn.query<mysql.RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [mail]);
  if (rows.length) {
    await conn.query("UPDATE users SET role = 'admin' WHERE id = ?", [rows[0].id]);
    if (password) await conn.query('UPDATE users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(password, 12), rows[0].id]);
    console.log(`✓ ${mail} artık yönetici.${password ? ' Şifresi güncellendi.' : ''}`);
  } else {
    if (!password || password.length < 8) { console.log('Yeni hesap için en az 8 karakterlik bir şifre gerekli.'); process.exit(1); }
    await conn.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')", [name || 'Yönetici', mail, await bcrypt.hash(password, 12)]);
    console.log(`✓ Yönetici hesabı oluşturuldu: ${mail}`);
  }
  await conn.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
