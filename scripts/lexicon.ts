/**
 * Kelime bul yerleşik sözlüğünü (scripts/lexicon-data.ts) veritabanına yazar.
 *   npm run db:lexicon   Tabloyu dosyadaki listeyle eşitler (eklenen, değişen ve silinen kelimeler)
 * Çalışan sunucu değişikliği en geç 5 dakika içinde görür.
 */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { LEXICON } from './lexicon-data';
import { parseLexicon } from '../src/lib/lexicon';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

async function main() {
  const list = parseLexicon(LEXICON);
  const conn = await mysql.createConnection(process.env.DATABASE_URL!);
  await conn.beginTransaction();
  await conn.query('DELETE FROM lexicon');
  for (let i = 0; i < list.length; i += 200) {
    const rows = list.slice(i, i + 200).map((e) => [e.ar, e.tl, e.tr, e.en, e.type, JSON.stringify(e.variants), e.muAr ?? null, e.muTl ?? null, e.note ?? null]);
    await conn.query('INSERT INTO lexicon (ar, tl, tr, en, type, variants, mu_ar, mu_tl, note) VALUES ?', [rows]);
  }
  await conn.commit();
  console.log(`${list.length} kelime yazıldı.`);
  await conn.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
