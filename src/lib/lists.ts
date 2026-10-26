import 'server-only';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { GameKey, ListItem, ListSummary, WordList } from './study';

const { wordLists: L, wordListItems: I } = schema;

export type ItemInput = { id?: number; ar: string; tl: string; tr: string; note: string };

const toItem = (r: typeof I.$inferSelect): ListItem => ({
  id: r.id, ar: r.ar, tl: r.tl, tr: r.tr, note: r.note, starred: r.starred, correct: r.correct, wrong: r.wrong, streak: r.streak
});

export async function listLists(userId: number): Promise<ListSummary[]> {
  const rows = await db.select({
    id: L.id, title: L.title, description: L.description, studiedAt: L.studiedAt, updatedAt: L.updatedAt,
    count: sql<number>`count(${I.id})`,
    learned: sql<number>`coalesce(sum(${I.streak} >= 2), 0)`,
    learning: sql<number>`coalesce(sum(${I.streak} < 2 and (${I.correct} + ${I.wrong}) > 0), 0)`
  }).from(L).leftJoin(I, eq(I.listId, L.id)).where(eq(L.userId, userId)).groupBy(L.id)
    .orderBy(desc(sql`coalesce(${L.studiedAt}, ${L.updatedAt})`));
  return rows.map((r) => ({
    ...r, count: Number(r.count), learned: Number(r.learned), learning: Number(r.learning),
    studiedAt: r.studiedAt?.toISOString() ?? null, updatedAt: r.updatedAt.toISOString()
  }));
}

export async function countLists(userId: number) {
  const [r] = await db.select({ n: sql<number>`count(*)` }).from(L).where(eq(L.userId, userId));
  return Number(r?.n || 0);
}

/** Yalnızca sahibine döner; başkasının listesi yokmuş gibi davranılır */
export async function getList(userId: number, id: number): Promise<WordList | null> {
  const [l] = await db.select().from(L).where(and(eq(L.id, id), eq(L.userId, userId)));
  if (!l) return null;
  const items = await db.select().from(I).where(eq(I.listId, id)).orderBy(asc(I.position), asc(I.id));
  return { id: l.id, title: l.title, description: l.description, best: l.best || {}, items: items.map(toItem) };
}

export async function createList(userId: number, title: string, description: string, items: ItemInput[]) {
  const [r] = await db.insert(L).values({ userId, title, description, best: {} }).$returningId();
  if (items.length) await db.insert(I).values(items.map((it, i) => ({ listId: r.id, position: i, ar: it.ar, tl: it.tl, tr: it.tr, note: it.note })));
  return r.id;
}

/** Listeyi kaydeder: id'si olan kelimelerin çalışma durumu korunur, listeden çıkanlar silinir */
export async function saveList(userId: number, id: number, title: string, description: string, items: ItemInput[]) {
  const [l] = await db.select({ id: L.id }).from(L).where(and(eq(L.id, id), eq(L.userId, userId)));
  if (!l) return false;
  await db.transaction(async (tx) => {
    await tx.update(L).set({ title, description, updatedAt: new Date() }).where(eq(L.id, id));
    const have = new Set((await tx.select({ id: I.id }).from(I).where(eq(I.listId, id))).map((r) => r.id));
    const keep = new Set<number>();
    for (const [i, it] of items.entries()) {
      if (it.id && have.has(it.id)) {
        keep.add(it.id);
        await tx.update(I).set({ position: i, ar: it.ar, tl: it.tl, tr: it.tr, note: it.note }).where(eq(I.id, it.id));
      } else {
        await tx.insert(I).values({ listId: id, position: i, ar: it.ar, tl: it.tl, tr: it.tr, note: it.note });
      }
    }
    const drop = [...have].filter((x) => !keep.has(x));
    if (drop.length) await tx.delete(I).where(and(eq(I.listId, id), inArray(I.id, drop)));
  });
  return true;
}

export async function deleteList(userId: number, id: number) {
  const r = await db.delete(L).where(and(eq(L.id, id), eq(L.userId, userId)));
  return r[0].affectedRows > 0;
}

/** Kelimeyi listenin sonuna ekler (Kelime bul, sözlük ve kelime sayfalarındaki "Listeye ekle") */
export async function appendItem(userId: number, id: number, it: ItemInput) {
  const [l] = await db.select({ id: L.id }).from(L).where(and(eq(L.id, id), eq(L.userId, userId)));
  if (!l) return 'missing' as const;
  const rows = await db.select({ ar: I.ar, position: I.position }).from(I).where(eq(I.listId, id));
  if (rows.some((r) => r.ar === it.ar)) return 'exists' as const;
  if (rows.length >= 300) return 'full' as const;
  await db.insert(I).values({ listId: id, position: rows.reduce((m, r) => Math.max(m, r.position + 1), 0), ar: it.ar, tl: it.tl, tr: it.tr, note: it.note });
  await db.update(L).set({ updatedAt: new Date() }).where(eq(L.id, id));
  return 'ok' as const;
}

async function own(userId: number, id: number) {
  const [l] = await db.select({ id: L.id, best: L.best }).from(L).where(and(eq(L.id, id), eq(L.userId, userId)));
  return l ?? null;
}

/** Çalışma cevapları: doğruysa art arda sayısı artar, yanlışsa sıfırlanır */
export async function recordAnswers(userId: number, id: number, results: { id: number; ok: boolean }[]) {
  if (!(await own(userId, id))) return false;
  for (const r of results) {
    await db.update(I).set(r.ok
      ? { correct: sql`${I.correct} + 1`, streak: sql`${I.streak} + 1`, seenAt: new Date() }
      : { wrong: sql`${I.wrong} + 1`, streak: 0, seenAt: new Date() }
    ).where(and(eq(I.id, r.id), eq(I.listId, id)));
  }
  await db.update(L).set({ studiedAt: new Date(), updatedAt: sql`${L.updatedAt}` }).where(eq(L.id, id));
  return true;
}

export async function setStar(userId: number, id: number, itemId: number, on: boolean) {
  if (!(await own(userId, id))) return false;
  await db.update(I).set({ starred: on }).where(and(eq(I.id, itemId), eq(I.listId, id)));
  return true;
}

export async function resetProgress(userId: number, id: number) {
  if (!(await own(userId, id))) return false;
  await db.update(I).set({ correct: 0, wrong: 0, streak: 0, seenAt: null }).where(eq(I.listId, id));
  return true;
}

/** Oyun sonucu: eşleştirmede düşük süre, diğerlerinde yüksek puan en iyisidir. Yeni rekorsa true */
export async function saveBest(userId: number, id: number, game: GameKey, value: number) {
  const l = await own(userId, id);
  if (!l) return null;
  const best = { ...(l.best || {}) };
  const prev = best[game];
  const better = prev == null || (game === 'match' ? value < prev : value > prev);
  if (better) {
    best[game] = value;
    await db.update(L).set({ best, studiedAt: new Date(), updatedAt: sql`${L.updatedAt}` }).where(eq(L.id, id));
  }
  return { record: better, best: best[game]! };
}
