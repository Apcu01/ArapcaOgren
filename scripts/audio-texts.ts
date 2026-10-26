// Sitede sesli okunabilen bütün Arapça metinleri toplar (her metin harekesiz anahtarına göre bir kez)
import type mysql from 'mysql2/promise';
import { ALPHABET_TOPIC, HARAKAT, LETTERS } from '../src/lib/alphabet';
import { timeAr } from '../src/lib/clock';
import { audioKey, isAr } from '../src/lib/text';
import type { Item, Section, Word } from '../src/lib/types';

export type AudioText = { key: string; text: string; group: string };

const pureAr = (s: string) => isAr(s) && !/[A-Za-zÇĞİÖŞÜçğıöşüâîû0-9]/.test(s);

export async function collectTexts(conn: mysql.Connection): Promise<AudioText[]> {
  const out = new Map<string, AudioText>();
  const add = (group: string, s?: string | null) => {
    if (!s || !pureAr(s)) return;
    const key = audioKey(s);
    if (!key || out.has(key)) return;
    out.set(key, { key, text: s.trim(), group });
  };
  const [topics] = await conn.query<mysql.RowDataPacket[]>('SELECT words, lesson FROM topics ORDER BY n');
  const [acts] = await conn.query<mysql.RowDataPacket[]>('SELECT items FROM activities ORDER BY topic_id, position');
  for (const t of topics) {
    for (const w of t.words as Word[]) add('Kelimeler', w.ar);
    for (const s of t.lesson as Section[]) {
      for (const e of s.ex || []) add('Örnek cümleler', e.ar);
      for (const r of s.table?.rows || []) for (const c of r) add('Tablo hücreleri', c);
    }
  }
  for (const a of acts) {
    for (const q of (a.items || []) as Item[]) {
      if (Array.isArray(q)) { add('Etkinlik ifadeleri', q[0]); continue; }
      if (!('a' in q) && !('w' in q) && !('s' in q)) { add('Etkinlik ifadeleri', q.ar); continue; }
      const x = q as { ar?: string; s?: string; a?: unknown; w?: string[] };
      add('Etkinlik ifadeleri', x.ar);
      if (x.s && x.s.includes('___') && typeof x.a === 'string') add('Etkinlik ifadeleri', x.s.replace('___', x.a));
      if (x.w) add('Etkinlik ifadeleri', x.w.join(' '));
    }
  }
  for (let h = 1; h <= 12; h++) for (let m = 0; m < 60; m += 5) add('Saat pratiği', 'السَّاعَةُ ' + timeAr(h, m));
  for (const l of LETTERS) add('Alfabe', l[2]);
  for (const h of HARAKAT) add('Alfabe', h[0]);
  for (const w of ALPHABET_TOPIC.words) add('Alfabe', w.ar);
  // Yerleşik sözlük: kelime sayfaları, Kelime bul ve kelime listelerinde okunur (fiillerin şimdiki zaman hâli dahil)
  const [lex] = await conn.query<mysql.RowDataPacket[]>('SELECT ar, mu_ar FROM lexicon ORDER BY id');
  for (const r of lex) { add('Sözlük', r.ar); add('Sözlük', r.mu_ar); }
  return [...out.values()];
}
