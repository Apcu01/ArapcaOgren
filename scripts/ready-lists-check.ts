/** Hazır listelerdeki her kelime yerleşik sözlükte ya da derslerde birebir var mı (ve sesi var mı): npx tsx scripts/ready-lists-check.ts */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { READY_LISTS } from '../src/lib/ready-lists';
import { audioKey } from '../src/lib/text';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

async function main() {
  const c = await mysql.createConnection(process.env.DATABASE_URL!);
  const [lex] = await c.query<mysql.RowDataPacket[]>('SELECT ar FROM lexicon');
  const [topics] = await c.query<mysql.RowDataPacket[]>('SELECT words FROM topics');
  const [audio] = await c.query<mysql.RowDataPacket[]>('SELECT text_key FROM audio');
  await c.end();
  const known = new Set<string>([...lex.map((r) => r.ar as string), ...topics.flatMap((t) => (t.words as { ar: string }[]).map((w) => w.ar))]);
  const sounds = new Set(audio.map((r) => r.text_key as string));
  let bad = 0;
  for (const l of READY_LISTS) {
    const missing = l.words.filter((w) => !known.has(w));
    const silent = l.words.filter((w) => known.has(w) && !sounds.has(audioKey(w)));
    const dup = l.words.filter((w, i) => l.words.indexOf(w) !== i);
    if (missing.length || dup.length) bad++;
    console.log(`${l.slug.padEnd(20)} ${String(l.words.length).padStart(3)} kelime${missing.length ? ' · BULUNAMAYAN: ' + missing.join(', ') : ''}${dup.length ? ' · TEKRAR: ' + dup.join(', ') : ''}${silent.length ? ' · sesi yok: ' + silent.join(', ') : ''}`);
  }
  const slugs = READY_LISTS.map((l) => l.slug);
  if (new Set(slugs).size !== slugs.length) { console.log('Aynı adres iki kez kullanılmış.'); bad++; }
  console.log(bad ? `\n${bad} listede sorun var.` : `\nHepsi tamam: ${READY_LISTS.length} liste.`);
  process.exit(bad ? 1 : 0);
}
main();
