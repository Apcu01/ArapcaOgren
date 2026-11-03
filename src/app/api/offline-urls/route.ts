import { desc, eq, inArray, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { getSessionUser } from '@/lib/auth';
import { getNarrationIds } from '@/lib/narration';
import { READINGS } from '@/lib/readings';
import { READY_LISTS } from '@/lib/ready-lists';
import { MODES } from '@/lib/study';
import { getTopics } from '@/lib/topics';

/** Çevrimdışı indirilecek kişisel liste sayısı (her liste: özet sayfası ve bütün modları) */
const OFFLINE_LISTS = 10;

/**
 * Çevrimdışı kullanım için indirilecekler: sayfalar her zaman; kelime sesleri, ders anlatımı sesleri
 * ve kişisel listeler isteğe bağlı (boyutlarıyla birlikte, kullanıcı seçsin diye).
 */
export async function GET() {
  const [topics, user] = await Promise.all([getTopics(), getSessionUser()]);
  const pages = [
    '/', '/sozluk', '/alfabe', '/ilerleme', '/hatalarim', '/cevrimdisi', '/kelime-bul', '/okuma', '/hazir-listeler',
    ...topics.map((t) => `/konu/${t.id}`),
    ...READINGS.map((r) => `/okuma/${r.slug}`),
    ...READY_LISTS.map((l) => `/hazir-listeler/${l.slug}`)
  ];

  const [audio, narrIds] = await Promise.all([
    db.select({ id: schema.audio.id, size: schema.audio.size }).from(schema.audio),
    Promise.all(topics.map((t) => getNarrationIds(t)))
  ]);
  const nIds = [...new Set(narrIds.flatMap((n) => [...n.sections, n.summary]).filter((x): x is number => !!x))];
  const narr = nIds.length ? await db.select({ id: schema.narrationAudio.id, size: schema.narrationAudio.size }).from(schema.narrationAudio).where(inArray(schema.narrationAudio.id, nIds)) : [];

  let lists: string[] = [];
  if (user) {
    const L = schema.wordLists;
    const rows = await db.select({ id: L.id }).from(L).where(eq(L.userId, user.id)).orderBy(desc(sql`COALESCE(${L.studiedAt}, ${L.updatedAt})`)).limit(OFFLINE_LISTS);
    lists = ['/listelerim', '/api/lists', ...rows.flatMap((r) => [`/listelerim/${r.id}`, `/api/lists/${r.id}`, ...MODES.map((m) => `/listelerim/${r.id}/${m.key}`)])];
  }

  const res = NextResponse.json({
    pages,
    audio: { urls: audio.map((a) => `/api/audio/${a.id}`), bytes: audio.reduce((n, a) => n + a.size, 0) },
    narration: { urls: narr.map((a) => `/api/narration/${a.id}`), bytes: narr.reduce((n, a) => n + a.size, 0) },
    lists: { urls: lists, count: Math.max(0, (lists.length - 2) / (MODES.length + 2)) }
  });
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}
