/**
 * Yeni dersleri (scripts/new-lessons.ts ve new-lessons-2.ts) veritabanına yazar.
 *
 *   npx tsx scripts/add-lessons.ts --dry             Doğrular ve ne yapılacağını gösterir, yazmaz
 *   npx tsx scripts/add-lessons.ts                   Veritabanında olmayan dersleri ekler (var olanlara dokunmaz)
 *   npx tsx scripts/add-lessons.ts vucut giyim       Yalnızca bu dersler; var olan ders güncellenir
 *   npx tsx scripts/add-lessons.ts --draft           Yayında olmayan taslak olarak yazar (önizleme: yönetim paneli)
 *   npx tsx scripts/add-lessons.ts hava --publish    Dersi yayına alır
 *
 * Var olan bir ders güncellenirken etkinlikleri yeniden yazılır: etkinlik kimlikleri değiştiği için o dersteki
 * etkinlik ilerlemeleri sıfırlanır. Bu yüzden kısa ad verilmeden var olan derslere dokunulmaz.
 * Yayın durumu: --draft ya da --publish verilmezse yeni ders yayında, var olan ders olduğu gibi kalır.
 * Sonra sesler: npm run audio:generate (kelime, örnek, etkinlik) ve npm run audio:narrate -- --no-apply (anlatım).
 */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { NEW_LESSONS } from './new-lessons';
import { NEW_LESSONS_2 } from './new-lessons-2';
import { TopicInput } from '../src/lib/topic-schema';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const draft = args.includes('--draft');
const publish = args.includes('--publish');
const only = args.filter((a) => !a.startsWith('--'));

async function main() {
  if (draft && publish) throw new Error('--draft ile --publish birlikte verilemez.');
  const all = [...NEW_LESSONS, ...NEW_LESSONS_2];
  const unknown = only.filter((id) => !all.some((t) => t.id === id));
  if (unknown.length) throw new Error(`Bilinmeyen ders: ${unknown.join(', ')}`);
  const topics = all.filter((t) => !only.length || only.includes(t.id)).map((t) => {
    const r = TopicInput.safeParse({ ...t, published: true });
    if (!r.success) throw new Error(`${t.id}: ${JSON.stringify(r.error.issues.slice(0, 3))}`);
    return r.data;
  });
  const c = await mysql.createConnection(process.env.DATABASE_URL!);
  try {
    const [have] = await c.query<mysql.RowDataPacket[]>('SELECT id, published FROM topics WHERE id IN (?)', [topics.map((t) => t.id)]);
    const existing = new Map(have.map((r) => [r.id as string, !!r.published]));
    for (const t of topics) {
      const ex = existing.has(t.id);
      if (ex && !only.length) { console.log(`Atlandı (zaten var): ${t.n}. ${t.name}`); continue; }
      const published = draft ? false : publish ? true : ex ? existing.get(t.id)! : true;
      if (dry) { console.log(`${ex ? 'Güncellenecek' : 'Eklenecek'}: ${t.n}. ${t.name} (${t.acts.length} etkinlik, ${t.words.length} kelime, ${published ? 'yayında' : 'taslak'})`); continue; }
      await c.beginTransaction();
      const row = {
        n: t.n, level: t.level, glyph: t.glyph, ar: t.ar, name: t.name, description: t.desc, long: t.long || null, tags: t.tags || null,
        read_mins: t.readMins, intro: t.intro, lesson: JSON.stringify(t.lesson), key_points: JSON.stringify(t.keys),
        mistakes: JSON.stringify(t.mistakes), words: JSON.stringify(t.words), published: published ? 1 : 0, summary_narr: t.summaryNarr || null
      };
      if (ex) await c.query('UPDATE topics SET ? WHERE id = ?', [row, t.id]);
      else await c.query('INSERT INTO topics SET ?', [{ id: t.id, ...row }]);
      await c.query('DELETE FROM activities WHERE topic_id = ?', [t.id]);
      for (const [i, a] of t.acts.entries()) {
        const empty = ['flash', 'listen', 'clock', 'speak', 'endless'].includes(a.type) && !(a.items && a.items.length);
        await c.query('INSERT INTO activities SET ?', [{
          topic_id: t.id, position: i, type: a.type, mode: a.type === 'clock' ? a.mode || 'mix' : null, title: a.title,
          description: a.desc, glyph: a.glyph || '', keep_order: a.keepOrder ? 1 : 0, items: empty ? null : JSON.stringify(a.items || [])
        }]);
      }
      await c.commit();
      console.log(`${ex ? 'Güncellendi' : 'Eklendi'}: ${t.n}. ${t.name} (${t.acts.length} etkinlik, ${t.words.length} kelime, ${published ? 'yayında' : 'taslak'})`);
    }
  } catch (e) {
    await c.rollback().catch(() => null);
    throw e;
  } finally {
    await c.end();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
