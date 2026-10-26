import 'server-only';
import { randomBytes } from 'node:crypto';
import { and, asc, desc, eq, inArray, isNotNull, sql, type SQL } from 'drizzle-orm';
import { db, schema } from '@/db';
import { LIST_MAX_ITEMS, LISTS_MAX, type GameKey, type ListItem, type ListSummary, type SharedList, type SyncDiff, type WordList } from './study';

const { wordLists: L, wordListItems: I } = schema;

// Kelimenin updated_at alanı yalnızca içeriği (Arapça, okunuş, anlam, not) değişince ilerler: kopyalara "düzeltildi"
// önerisi bu alana göre çıkar. Çalışma, yıldız ve sıra değişikliklerinde alan kendine eşitlenir (ON UPDATE çalışmaz).
const keepTime = { updatedAt: sql`${I.updatedAt}` };

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
  return { id: l.id, title: l.title, description: l.description, best: l.best || {}, shareToken: l.shareToken, copies: l.copies, linked: l.sourceListId != null, items: items.map(toItem) };
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
    const rows = await tx.select({ id: I.id, ar: I.ar, tl: I.tl, tr: I.tr, note: I.note }).from(I).where(eq(I.listId, id));
    const have = new Map(rows.map((r) => [r.id, r]));
    const keep = new Set<number>();
    for (const [i, it] of items.entries()) {
      if (it.id && have.has(it.id)) {
        keep.add(it.id);
        const old = have.get(it.id)!;
        const sameContent = old.ar === it.ar && old.tl === it.tl && old.tr === it.tr && old.note === it.note;
        await tx.update(I).set({ position: i, ar: it.ar, tl: it.tl, tr: it.tr, note: it.note, ...(sameContent ? keepTime : {}) }).where(eq(I.id, it.id));
      } else {
        await tx.insert(I).values({ listId: id, position: i, ar: it.ar, tl: it.tl, tr: it.tr, note: it.note });
      }
    }
    const drop = [...have.keys()].filter((x) => !keep.has(x));
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
      ? { correct: sql`${I.correct} + 1`, streak: sql`${I.streak} + 1`, seenAt: new Date(), ...keepTime }
      : { wrong: sql`${I.wrong} + 1`, streak: 0, seenAt: new Date(), ...keepTime }
    ).where(and(eq(I.id, r.id), eq(I.listId, id)));
  }
  await db.update(L).set({ studiedAt: new Date(), updatedAt: sql`${L.updatedAt}` }).where(eq(L.id, id));
  return true;
}

export async function setStar(userId: number, id: number, itemId: number, on: boolean) {
  if (!(await own(userId, id))) return false;
  await db.update(I).set({ starred: on, ...keepTime }).where(and(eq(I.id, itemId), eq(I.listId, id)));
  return true;
}

export async function resetProgress(userId: number, id: number) {
  if (!(await own(userId, id))) return false;
  await db.update(I).set({ correct: 0, wrong: 0, streak: 0, seenAt: null, ...keepTime }).where(eq(I.listId, id));
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

/* ---------- Paylaşım ---------- */

/** Paylaşımı açar (bağlantı yoksa ya da yenilenmek isteniyorsa yeni bağlantı üretir) ya da kapatır */
export async function setShare(userId: number, id: number, on: boolean, renew = false) {
  const [l] = await db.select({ token: L.shareToken }).from(L).where(and(eq(L.id, id), eq(L.userId, userId)));
  if (!l) return undefined;
  const token = on ? (l.token && !renew ? l.token : randomBytes(16).toString('base64url')) : null;
  if (token !== l.token) await db.update(L).set({ shareToken: token, updatedAt: sql`${L.updatedAt}` }).where(eq(L.id, id));
  return token;
}

// Paylaşanın yalnızca adı görünür (soyadı ve e-posta değil)
const firstName = (s: string) => s.trim().split(/\s+/)[0] || 'Bir kullanıcı';

/** Paylaşılan liste ve kelimeleri (kelime id ve zamanları dahil, yalnızca sunucuda) */
async function loadShared(where: SQL) {
  const [l] = await db.select({ id: L.id, title: L.title, description: L.description, owner: schema.users.name })
    .from(L).innerJoin(schema.users, eq(schema.users.id, L.userId)).where(and(where, isNotNull(L.shareToken)));
  if (!l) return null;
  const items = await db.select({ id: I.id, ar: I.ar, tl: I.tl, tr: I.tr, note: I.note, createdAt: I.createdAt, updatedAt: I.updatedAt })
    .from(I).where(eq(I.listId, l.id)).orderBy(asc(I.position), asc(I.id));
  return { ...l, owner: firstName(l.owner), items };
}

/** Bağlantıyla açılan liste; paylaşım kapatıldıysa null */
export async function getShared(token: string): Promise<SharedList | null> {
  if (!/^[A-Za-z0-9_-]{16,32}$/.test(token)) return null;
  const l = await loadShared(eq(L.shareToken, token));
  if (!l) return null;
  return { title: l.title, description: l.description, owner: l.owner, count: l.items.length, items: l.items.map(({ ar, tl, tr, note }) => ({ ar, tl, tr, note })) };
}

/** Veritabanı saati: değişiklikler kayıtlarla aynı saate göre bulunsun (uygulama sunucusunun saati farklı olabilir) */
async function dbNow(): Promise<Date> {
  const res = (await db.execute(sql`SELECT NOW(3) AS now`)) as unknown as [{ now: Date | string }[]];
  return new Date(res[0][0].now);
}

/** Paylaşılan listeyi kopyalar; kopya, kopyalayanın kendi listesidir (çalışma durumu sıfırdan başlar) */
export async function copyShared(userId: number, token: string) {
  if (!/^[A-Za-z0-9_-]{16,32}$/.test(token)) return { error: 'missing' as const };
  const src = await loadShared(eq(L.shareToken, token));
  if (!src) return { error: 'missing' as const };
  if ((await countLists(userId)) >= LISTS_MAX) return { error: 'full' as const };
  // Kopya asıl listeyi ve her kelimenin karşılığını hatırlar: sonradan yapılan değişiklikler önerilebilsin
  const now = await dbNow();
  const [r] = await db.insert(L).values({ userId, title: src.title.slice(0, 80), description: src.description, best: {}, sourceListId: src.id, syncedAt: now }).$returningId();
  if (src.items.length) {
    await db.insert(I).values(src.items.map((it, i) => ({ listId: r.id, position: i, ar: it.ar, tl: it.tl, tr: it.tr, note: it.note, sourceItemId: it.id })));
  }
  await db.update(L).set({ copies: sql`${L.copies} + 1`, updatedAt: sql`${L.updatedAt}` }).where(eq(L.id, src.id));
  return { id: r.id };
}

/* ---------- Kopyanın güncellenmesi ---------- */

type Fields = { ar: string; tl: string; tr: string; note: string };
const same = (a: Fields, b: Fields) => a.ar === b.ar && a.tl === b.tl && a.tr === b.tr && a.note === b.note;
const fields = (x: Fields): Fields => ({ ar: x.ar, tl: x.tl, tr: x.tr, note: x.note });

/**
 * Kopyanın asıl listesinde, kopya en son gözden geçirildiğinden beri olanlar:
 * eklenen kelimeler, içeriği değişen kelimeler (kopyadakinden farklıysa) ve asıl listeden silinenler.
 * Asıl liste silindiyse ya da paylaşımı kapatıldıysa null: güncelleme gelmez.
 */
async function diffOf(userId: number, id: number) {
  const [copy] = await db.select({ sourceListId: L.sourceListId, syncedAt: L.syncedAt }).from(L).where(and(eq(L.id, id), eq(L.userId, userId)));
  if (!copy?.sourceListId) return null;
  // Saat asıl liste okunmadan önce alınır: okuma sırasında eklenen kelime kaybolmaz, bir sonraki sefere kalır
  const now = await dbNow();
  const src = await loadShared(eq(L.id, copy.sourceListId));
  if (!src) return null;
  const mine = await db.select().from(I).where(eq(I.listId, id)).orderBy(asc(I.position), asc(I.id));
  const since = copy.syncedAt ?? new Date(0);
  const bySource = new Map(mine.filter((x) => x.sourceItemId != null).map((x) => [x.sourceItemId!, x]));
  const srcIds = new Set(src.items.map((x) => x.id));
  const diff: SyncDiff = {
    source: { title: src.title, owner: src.owner },
    // Daha önce önerilip eklenmeyen ya da kopyadan silinen kelime tekrar önerilmez (eklenme anı eski kalır)
    added: src.items.filter((s) => !bySource.has(s.id) && s.createdAt > since).map((s) => ({ sourceId: s.id, ...fields(s) })),
    changed: src.items.flatMap((s) => {
      const m = bySource.get(s.id);
      return m && s.updatedAt > since && !same(s, m) ? [{ id: m.id, from: fields(m), to: fields(s) }] : [];
    }),
    removed: mine.filter((m) => m.sourceItemId != null && !srcIds.has(m.sourceItemId)).map((m) => ({ id: m.id, ...fields(m) }))
  };
  return { diff, now, mine };
}

export async function getUpdates(userId: number, id: number): Promise<SyncDiff | null> {
  return (await diffOf(userId, id))?.diff ?? null;
}

/**
 * Seçilen değişiklikleri uygular; seçilmeyenler bir daha önerilmez.
 * add: asıl listedeki kelime numaraları, change ve remove: kopyadaki kelime numaraları
 */
export async function applyUpdates(userId: number, id: number, sel: { add: number[]; change: number[]; remove: number[] }) {
  const d = await diffOf(userId, id);
  if (!d) return null;
  const { diff, now, mine } = d;
  let pos = mine.reduce((m, x) => Math.max(m, x.position + 1), 0);
  let room = LIST_MAX_ITEMS - mine.length;
  const res = { added: 0, changed: 0, removed: 0 };
  await db.transaction(async (tx) => {
    for (const r of diff.removed) {
      if (sel.remove.includes(r.id)) { await tx.delete(I).where(and(eq(I.id, r.id), eq(I.listId, id))); res.removed++; room++; }
      // Kopyada kalsın: asıl listeyle bağı kalmadı
      else await tx.update(I).set({ sourceItemId: null, ...keepTime }).where(and(eq(I.id, r.id), eq(I.listId, id)));
    }
    for (const c of diff.changed) {
      if (!sel.change.includes(c.id)) continue;
      await tx.update(I).set(c.to).where(and(eq(I.id, c.id), eq(I.listId, id)));
      res.changed++;
    }
    for (const a of diff.added) {
      if (!sel.add.includes(a.sourceId) || room <= 0) continue;
      await tx.insert(I).values({ listId: id, position: pos++, ar: a.ar, tl: a.tl, tr: a.tr, note: a.note, sourceItemId: a.sourceId });
      res.added++; room--;
    }
    await tx.update(L).set({ syncedAt: now }).where(eq(L.id, id));
  });
  return res;
}
