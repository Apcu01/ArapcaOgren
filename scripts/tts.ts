/**
 * Sitedeki Arapça metinler için OpenRouter üzerinden ses üretir ve veritabanına (audio tablosu) yükler.
 *
 *   npm run audio:generate -- --dry          Kaç ifade üretileceğini ve tahmini maliyeti gösterir
 *   npm run audio:generate -- --limit 5      Yalnızca ilk 5 eksik ifadeyi üretir (deneme)
 *   npm run audio:generate                   Sesi olmayan bütün ifadeleri üretir
 *   npm run audio:generate -- --force        Var olan sesleri de yeniden üretir
 *
 * Seçenekler: --model elevenlabs/eleven-v4-turbo  --voice george  --concurrency 4
 * Gerekli: .env.local içinde DATABASE_URL ve OPENROUTER_API_KEY
 */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { collectTexts, type AudioText } from './audio-texts';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const args = process.argv.slice(2);
const opt = (name: string, def: string) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const flag = (name: string) => args.includes('--' + name);

const MODEL = opt('model', 'elevenlabs/eleven-v4-turbo');
const VOICE = opt('voice', 'george');
const CONCURRENCY = Math.max(1, Math.min(8, Number(opt('concurrency', '4'))));
const LIMIT = Number(opt('limit', '0'));
const PRICE_PER_CHAR = MODEL.startsWith('elevenlabs/') ? 40e-6 : Number(opt('price', '0'));
const KEY = process.env.OPENROUTER_API_KEY;

async function balance() {
  const r = await fetch('https://openrouter.ai/api/v1/key', { headers: { Authorization: 'Bearer ' + KEY } });
  const j = (await r.json()) as { data?: { limit_remaining?: number | null; usage?: number } };
  return j.data?.limit_remaining ?? null;
}

async function speak(text: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    const r = await fetch('https://openrouter.ai/api/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, voice: VOICE, input: text, response_format: 'mp3' })
    });
    const type = r.headers.get('content-type') || '';
    if (r.ok && type.startsWith('audio')) return Buffer.from(await r.arrayBuffer());
    const body = (await r.text()).slice(0, 200);
    // Hız sınırı ve geçici sunucu hatalarında bekleyip tekrar dene
    if ((r.status === 429 || r.status >= 500) && attempt < 5) {
      await new Promise((res) => setTimeout(res, 1500 * attempt));
      continue;
    }
    throw new Error(`HTTP ${r.status}: ${body}`);
  }
}

async function main() {
  if (!KEY) { console.log('.env.local içinde OPENROUTER_API_KEY yok.'); process.exit(1); }
  const conn = await mysql.createConnection(process.env.DATABASE_URL!);
  const all = await collectTexts(conn);
  const [have] = await conn.query<mysql.RowDataPacket[]>('SELECT text_key FROM audio');
  const existing = new Set(have.map((r) => r.text_key as string));
  let todo: AudioText[] = flag('force') ? all : all.filter((t) => !existing.has(t.key));
  if (LIMIT > 0) todo = todo.slice(0, LIMIT);
  const chars = todo.reduce((n, t) => n + [...t.text].length, 0);

  console.log(`Model: ${MODEL} · ses: ${VOICE}`);
  console.log(`Toplam ifade: ${all.length} · sesi olan: ${existing.size} · üretilecek: ${todo.length} (${chars} karakter)`);
  if (PRICE_PER_CHAR) console.log(`Tahmini maliyet: ${(chars * PRICE_PER_CHAR).toFixed(3)} $`);
  const before = await balance();
  if (before != null) console.log(`OpenRouter bakiyesi: ${before.toFixed(3)} $`);
  if (flag('dry') || !todo.length) { await conn.end(); return; }

  let done = 0, failed = 0, bytes = 0;
  const errors: string[] = [];
  const queue = todo.slice();
  async function worker() {
    for (let t = queue.shift(); t; t = queue.shift()) {
      try {
        const data = await speak(t.text);
        await conn.query('DELETE FROM audio WHERE text_key = ?', [t.key]);
        await conn.query('INSERT INTO audio (text_key, text, mime, size, data) VALUES (?, ?, ?, ?, ?)', [t.key, t.text.slice(0, 500), 'audio/mpeg', data.length, data]);
        done++; bytes += data.length;
      } catch (e) {
        failed++;
        errors.push(`${t.text}: ${(e as Error).message}`);
      }
      const n = done + failed;
      if (n % 25 === 0 || n === todo.length) console.log(`  ${n} / ${todo.length} (hata: ${failed})`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await conn.end();

  const after = await balance();
  console.log(`\nÜretilen: ${done} · hata: ${failed} · toplam boyut: ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  if (before != null && after != null) console.log(`Harcanan: ${(before - after).toFixed(3)} $ · kalan bakiye: ${after.toFixed(3)} $`);
  if (errors.length) { console.log('\nHatalar:'); errors.slice(0, 20).forEach((e) => console.log('  ' + e)); }
}

main().catch((e) => { console.error(e); process.exit(1); });
