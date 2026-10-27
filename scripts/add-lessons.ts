/**
 * Yeni dersleri (scripts/new-lessons.ts) veritabanına yazar: npx tsx scripts/add-lessons.ts [--dry]
 * Ders varsa içeriği güncellenir ve etkinlikleri yeniden yazılır; yoksa eklenir.
 * Sonra sesler: npm run audio:generate (kelime, örnek, etkinlik) ve npm run audio:narrate -- --no-apply (anlatım).
 */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { NEW_LESSONS } from './new-lessons';
import { TopicInput } from '../src/lib/topic-schema';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const dry = process.argv.includes('--dry');

async function main() {
  const topics = NEW_LESSONS.map((t) => {
    const r = TopicInput.safeParse({ ...t, published: true });
    if (!r.success) throw new Error(`${t.id}: ${JSON.stringify(r.error.issues.slice(0, 3))}`);
    return r.data;
  });
  if (dry) { console.log(`Geçerli: ${topics.map((t) => t.id).join(', ')}`); return; }
  const c = await mysql.createConnection(process.env.DATABASE_URL!);
  try {
    for (const t of topics) {
      await c.beginTransaction();
      const row = {
        n: t.n, level: t.level, glyph: t.glyph, ar: t.ar, name: t.name, description: t.desc, long: t.long || null, tags: t.tags || null,
        read_mins: t.readMins, intro: t.intro, lesson: JSON.stringify(t.lesson), key_points: JSON.stringify(t.keys),
        mistakes: JSON.stringify(t.mistakes), words: JSON.stringify(t.words), published: t.published ? 1 : 0, summary_narr: t.summaryNarr || null
      };
      const [ex] = await c.query<mysql.RowDataPacket[]>('SELECT id FROM topics WHERE id = ?', [t.id]);
      if (ex.length) await c.query('UPDATE topics SET ? WHERE id = ?', [row, t.id]);
      else await c.query('INSERT INTO topics SET ?', [{ id: t.id, ...row }]);
      await c.query('DELETE FROM activities WHERE topic_id = ?', [t.id]);
      for (const [i, a] of t.acts.entries()) {
        const empty = ['flash', 'listen', 'clock', 'speak'].includes(a.type) && !(a.items && a.items.length);
        await c.query('INSERT INTO activities SET ?', [{
          topic_id: t.id, position: i, type: a.type, mode: a.type === 'clock' ? a.mode || 'mix' : null, title: a.title,
          description: a.desc, glyph: a.glyph || '', keep_order: a.keepOrder ? 1 : 0, items: empty ? null : JSON.stringify(a.items || [])
        }]);
      }
      await c.commit();
      console.log(`${ex.length ? 'Güncellendi' : 'Eklendi'}: ${t.n}. ${t.name} (${t.acts.length} etkinlik, ${t.words.length} kelime)`);
    }
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    await c.end();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
