/**
 * Öğretmen anlatımlarını (scripts/narrations/*.json) derslere yazar ve seslerini üretir.
 *
 *   npm run audio:narrate -- --dry             Yapılacakları ve tahmini maliyeti gösterir
 *   npm run audio:narrate -- --topic saatler   Yalnızca bir ders
 *   npm run audio:narrate                      Bütün dersler: metinleri yazar, eksik sesleri üretir
 *   npm run audio:narrate -- --force           Var olan sesleri de yeniden üretir
 *   npm run audio:narrate -- --no-apply        Metinlere dokunmaz, veritabanındaki anlatımların sesini üretir
 *
 * Ses: src/lib/tts.ts içindeki NARR_MODEL ve NARR_VOICE. Gerekli: DATABASE_URL ve OPENROUTER_API_KEY
 */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { applyNarration, loadNarration, narrationIds } from './narration-files';
import { NARR_MODEL, NARR_VOICE, narrKey, speakable, synthesize } from '../src/lib/tts';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const flag = (name: string) => args.includes('--' + name);
const PRICE_PER_CHAR = 40e-6;

type Section = { narr?: string } & Record<string, unknown>;
type Job = { topicId: string; label: string; text: string; nkey: string };

// Kullanılabilir bakiye: hesap kredisi ile anahtarın harcama limitinden küçük olanı
async function balance() {
  const headers = { Authorization: 'Bearer ' + process.env.OPENROUTER_API_KEY };
  const [c, k] = await Promise.all([
    fetch('https://openrouter.ai/api/v1/credits', { headers }).then((r) => r.json()) as Promise<{ data?: { total_credits: number; total_usage: number } }>,
    fetch('https://openrouter.ai/api/v1/key', { headers }).then((r) => r.json()) as Promise<{ data?: { limit_remaining?: number | null } }>
  ]);
  const vals = [c.data ? c.data.total_credits - c.data.total_usage : null, k.data?.limit_remaining ?? null].filter((v): v is number => v != null);
  return vals.length ? Math.min(...vals) : null;
}

async function main() {
  const dry = flag('dry');
  const conn = await mysql.createConnection(process.env.DATABASE_URL!);
  const only = opt('topic');
  const [rows] = await conn.query<mysql.RowDataPacket[]>('SELECT id, lesson, summary_narr FROM topics' + (only ? ' WHERE id = ?' : ''), only ? [only] : []);
  const files = new Set(narrationIds());
  const jobs: Job[] = [];
  const keep = new Map<string, string[]>();

  for (const r of rows) {
    const id = r.id as string;
    let lesson = (typeof r.lesson === 'string' ? JSON.parse(r.lesson) : r.lesson) as Section[];
    let summary = (r.summary_narr as string | null) ?? null;

    if (!flag('no-apply') && files.has(id)) {
      const n = loadNarration(id)!;
      const next = applyNarration(id, lesson, n);
      if (JSON.stringify(next) !== JSON.stringify(lesson) || summary !== n.summary) {
        console.log(`${id}: anlatım metinleri ${dry ? 'yazılacak' : 'yazıldı'}`);
        if (!dry) await conn.query('UPDATE topics SET lesson = ?, summary_narr = ? WHERE id = ?', [JSON.stringify(next), n.summary, id]);
      }
      lesson = next;
      summary = n.summary;
    }

    const texts = lesson.map((s, i) => ({ label: `bölüm ${i + 1}`, text: s.narr?.trim() || '' }));
    texts.push({ label: 'özet', text: summary?.trim() || '' });
    const valid = texts.filter((t) => t.text);
    keep.set(id, valid.map((t) => narrKey(t.text)));
    for (const t of valid) jobs.push({ topicId: id, label: t.label, text: t.text, nkey: narrKey(t.text) });
  }

  const [have] = await conn.query<mysql.RowDataPacket[]>('SELECT nkey FROM narration_audio');
  const existing = new Set(have.map((r) => r.nkey as string));
  const todo = flag('force') ? jobs : jobs.filter((j) => !existing.has(j.nkey));
  const chars = todo.reduce((n, j) => n + [...speakable(j.text)].length, 0);

  console.log(`Model: ${NARR_MODEL} · ses: ${NARR_VOICE}`);
  console.log(`Anlatım: ${jobs.length} · sesi olan: ${jobs.length - jobs.filter((j) => !existing.has(j.nkey)).length} · üretilecek: ${todo.length} (${chars} karakter)`);
  console.log(`Tahmini maliyet: ${(chars * PRICE_PER_CHAR).toFixed(3)} $`);
  const before = await balance();
  if (before != null) console.log(`OpenRouter bakiyesi: ${before.toFixed(3)} $`);
  if (dry) { await conn.end(); return; }
  if (before != null && before < chars * PRICE_PER_CHAR) {
    console.log('Bakiye tahmini maliyetten az; işlem durduruldu.');
    await conn.end();
    process.exit(1);
  }

  let done = 0, failed = 0;
  const queue = todo.slice();
  async function worker() {
    for (let j = queue.shift(); j; j = queue.shift()) {
      try {
        const data = await synthesize(j.text);
        await conn.query('DELETE FROM narration_audio WHERE nkey = ?', [j.nkey]);
        await conn.query('INSERT INTO narration_audio (nkey, topic_id, mime, size, data) VALUES (?, ?, ?, ?, ?)', [j.nkey, j.topicId, 'audio/mpeg', data.length, data]);
        done++;
        console.log(`[${done + failed}/${todo.length}] ${j.topicId} ${j.label} · ${(data.length / 1024).toFixed(0)} KB`);
      } catch (e) {
        failed++;
        console.log(`[${done + failed}/${todo.length}] ${j.topicId} ${j.label} HATA: ${(e as Error).message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, todo.length) }, worker));

  // Metni değişmiş bölümlerden kalan eski sesleri sil
  let pruned = 0;
  for (const [id, keys] of keep) {
    const [res] = keys.length
      ? await conn.query<mysql.ResultSetHeader>('DELETE FROM narration_audio WHERE topic_id = ? AND nkey NOT IN (?)', [id, keys])
      : await conn.query<mysql.ResultSetHeader>('DELETE FROM narration_audio WHERE topic_id = ?', [id]);
    pruned += res.affectedRows;
  }

  const after = await balance();
  console.log(`Bitti: ${done} üretildi, ${failed} hata, ${pruned} eski ses silindi.`);
  if (before != null && after != null) console.log(`Harcanan: ${(before - after).toFixed(3)} $ · kalan bakiye: ${after.toFixed(3)} $`);
  await conn.end();
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
