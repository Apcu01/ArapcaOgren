import 'server-only';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Geliştirmede sıcak yeniden yüklemelerde bağlantı havuzunu tekrar kullan
const g = globalThis as unknown as { __arbPool?: mysql.Pool };

function pool() {
  if (!g.__arbPool) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL tanımlı değil (.env.local dosyasına ekleyin).');
    g.__arbPool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 8,
      timezone: 'Z',
      dateStrings: false,
      // Uzak sunucu boştaki bağlantıları kesebilir (ECONNRESET): TCP keep-alive aç,
      // boşta kalan bağlantıları sunucudan önce kapat
      enableKeepAlive: true,
      keepAliveInitialDelay: 10_000,
      maxIdle: 2,
      idleTimeout: 30_000
    });
  }
  return g.__arbPool;
}

export const db = drizzle(pool(), { schema, mode: 'default' });
export { schema };
