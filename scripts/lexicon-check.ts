/** Yerleşik sözlükte çift kayıtları ve ders kelimeleriyle çakışanları listeler: npx tsx scripts/lexicon-check.ts */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { LEXICON } from './lexicon-data';
import { parseLexicon } from '../src/lib/lexicon';
import { normAr, strip } from '../src/lib/text';

config({ path: '.env.local', quiet: true });
const key = (s: string) => normAr(strip(s)).replace(/^ال/, '').replace(/\s+/g, ' ').trim();

async function main() {
  const list = parseLexicon(LEXICON);
  const c = await mysql.createConnection(process.env.DATABASE_URL!);
  const [t] = await c.query<mysql.RowDataPacket[]>('SELECT name, words FROM topics');
  const lesson = new Map<string, string>();
  for (const r of t) for (const w of (typeof r.words === 'string' ? JSON.parse(r.words) : r.words)) lesson.set(key(w.ar), r.name + ': ' + w.tr);
  const seen = new Map<string, number>();
  const exact = new Set<string>();
  const dupSelf: string[] = [], dupLesson: string[] = [];
  list.forEach((e, i) => {
    const k = key(e.ar);
    if (exact.has(e.ar)) dupSelf.push(`AYNI YAZIM: ${e.ar} (${e.tr})`);
    exact.add(e.ar);
    if (seen.has(k) && list[seen.get(k)!].ar !== e.ar) dupSelf.push(`${e.ar} (${e.tr})  ~  ${list[seen.get(k)!].ar} (${list[seen.get(k)!].tr})`);
    else if (!seen.has(k)) seen.set(k, i);
    if (lesson.has(k)) dupLesson.push(`${e.ar} (${e.tr})  ~  ${lesson.get(k)}`);
  });
  console.log('toplam', list.length);
  console.log('Sözlük içinde harekesiz aynı ya da tekrar:', dupSelf.length);
  dupSelf.forEach((x) => console.log('  ' + x));
  console.log('Ders kelimeleriyle aynı:', dupLesson.length);
  await c.end();
}
main();
