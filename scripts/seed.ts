/**
 * Eski sitedeki ders verilerini (oldsite/assets/js/data/*.js) veritabanına aktarır.
 *   npm run db:seed            → yalnızca veritabanında olmayan dersleri ekler
 *   npm run db:seed -- --force → mevcut dersleri de eski siteden gelen içerikle değiştirir
 */
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import { deepClean } from './typography';
import { applyNarration, loadNarration } from './narration-files';

config({ path: '.env.local' });
config();

type OldAct = { type: string; mode?: string; title: string; desc: string; glyph?: string; keepOrder?: boolean; items?: unknown[] };
type OldTopic = Record<string, unknown> & { id: string; acts: OldAct[]; words: unknown[] };

function loadOldTopics(): OldTopic[] {
  const dir = path.join(process.cwd(), 'oldsite', 'assets', 'js', 'data');
  const ctx: Record<string, unknown> = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) {
    vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
  }
  return ctx.TOPICS as OldTopic[];
}

// Eski sitede dinleme etkinliği kelimelerden otomatik ekleniyordu; burada gerçek bir etkinlik olarak kaydedilir.
// Telaffuz etkinliği de kelimeleri kullanır ve testten önce eklenir
function withListen(t: OldTopic): OldAct[] {
  const list = t.acts.slice();
  if ((t.words || []).length >= 4 && !list.some((a) => a.type === 'listen')) {
    const listen = { type: 'listen', title: 'Dinle ve anlamını seç', desc: 'Kelimeyi dinle, Türkçe anlamını bul. Kulağını Arapçaya alıştır.', glyph: 'اِسْمَعْ' };
    const ti = list.findIndex((a) => a.type === 'test');
    if (ti === -1) list.push(listen); else list.splice(ti, 0, listen);
  }
  if ((t.words || []).length >= 1 && !list.some((a) => a.type === 'speak')) {
    const speak = { type: 'speak', title: 'Telaffuz alıştırması', desc: 'Kelimeyi dinle, sonra sen söyle. Tarayıcı söylediğini kontrol eder.', glyph: 'تَكَلَّمْ' };
    const ti = list.findIndex((a) => a.type === 'test');
    if (ti === -1) list.push(speak); else list.splice(ti, 0, speak);
  }
  return list;
}

async function main() {
  const force = process.argv.includes('--force');
  const pool = mysql.createPool({ uri: process.env.DATABASE_URL!, connectionLimit: 2 });
  const db = drizzle(pool, { schema, mode: 'default' });
  const old = loadOldTopics().map((t) => deepClean(t));
  let added = 0, replaced = 0, skipped = 0;

  for (const t of old) {
    const exists = await db.select({ id: schema.topics.id }).from(schema.topics).where(eq(schema.topics.id, t.id));
    if (exists.length && !force) { skipped++; continue; }
    const row = {
      id: t.id,
      n: Number(t.n) || 0,
      level: String(t.level),
      glyph: String(t.glyph),
      ar: String(t.ar),
      name: String(t.name),
      description: String(t.desc),
      long: (t.long as string) ?? null,
      tags: (t.tags as string) ?? null,
      readMins: Number(t.readMins) || 10,
      intro: String(t.intro),
      lesson: t.lesson as schema_.Section[],
      keyPoints: t.keys as string[],
      mistakes: (t.mistakes as schema_.Mistake[]) || [],
      words: t.words as schema_.Word[],
      published: true,
      summaryNarr: null as string | null
    };
    // Öğretmen anlatımı dosyası varsa bölümlere ekle
    const narr = loadNarration(t.id);
    if (narr) {
      row.lesson = applyNarration(t.id, row.lesson, narr);
      row.summaryNarr = narr.summary;
    }
    await db.transaction(async (tx) => {
      if (exists.length) {
        await tx.delete(schema.activities).where(eq(schema.activities.topicId, t.id));
        await tx.update(schema.topics).set(row).where(eq(schema.topics.id, t.id));
      } else {
        await tx.insert(schema.topics).values(row);
      }
      const acts = withListen(t);
      if (acts.length) {
        await tx.insert(schema.activities).values(acts.map((a, i) => ({
          topicId: t.id,
          position: i,
          type: a.type,
          mode: a.mode ?? null,
          title: a.title,
          description: a.desc,
          glyph: a.glyph ?? '',
          keepOrder: !!a.keepOrder,
          items: (a.items as schema_.Item[]) ?? null
        })));
      }
    });
    if (exists.length) replaced++; else added++;
    console.log(`✓ ${t.n}. ${t.name} (${withListen(t).length} etkinlik)`);
  }
  console.log(`\nEklendi: ${added} · Güncellendi: ${replaced} · Atlandı (zaten var): ${skipped}`);
  await pool.end();
}

// Yalnızca tipler için
import type * as schema_ from '../src/lib/types';

main().catch((e) => { console.error(e); process.exit(1); });
