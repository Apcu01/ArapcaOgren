import 'server-only';
import { and, asc, desc, eq, isNotNull, like, or, sql, type SQL } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { db, schema } from '@/db';

/* Yönetim paneli: üyelerin kelime listeleri (yalnızca görüntüleme ve denetim) */
const { wordLists: L, wordListItems: I, users: U } = schema;
const Src = alias(L, 'src');
const SrcOwner = alias(U, 'src_owner');

export type ListFilter = 'all' | 'shared' | 'copies';

// Tablo adı açıkça yazılır: tek tablolu sorguda Drizzle sütunu tablo adı olmadan yazar ve alt sorgudaki i.id ile karışır
const counts = {
  count: sql<number>`(SELECT COUNT(*) FROM word_list_items i WHERE i.list_id = word_lists.id)`,
  learned: sql<number>`(SELECT COALESCE(SUM(i.streak >= 2), 0) FROM word_list_items i WHERE i.list_id = word_lists.id)`,
  answers: sql<number>`(SELECT COALESCE(SUM(i.correct + i.wrong), 0) FROM word_list_items i WHERE i.list_id = word_lists.id)`
};

export async function adminLists(q: string, filter: ListFilter, page: number, per: number) {
  const conds: SQL[] = [];
  if (q) {
    const pat = `%${q.replace(/[%_\\]/g, (c) => '\\' + c)}%`;
    conds.push(or(like(L.title, pat), like(U.name, pat), like(U.email, pat))!);
  }
  if (filter === 'shared') conds.push(isNotNull(L.shareToken));
  if (filter === 'copies') conds.push(isNotNull(L.sourceListId));
  const where = conds.length ? and(...conds) : undefined;
  const [rows, [tot], [all]] = await Promise.all([
    db.select({
      id: L.id, title: L.title, shared: sql<number>`${L.shareToken} IS NOT NULL`, copies: L.copies, studiedAt: L.studiedAt, createdAt: L.createdAt,
      userId: U.id, userName: U.name, userEmail: U.email,
      sourceId: Src.id, sourceTitle: Src.title, sourceOwner: SrcOwner.name, ...counts
    }).from(L).innerJoin(U, eq(U.id, L.userId))
      .leftJoin(Src, eq(Src.id, L.sourceListId)).leftJoin(SrcOwner, eq(SrcOwner.id, Src.userId))
      .where(where).orderBy(desc(sql`COALESCE(${L.studiedAt}, ${L.createdAt})`)).limit(per).offset((page - 1) * per),
    db.select({ n: sql<number>`COUNT(*)` }).from(L).innerJoin(U, eq(U.id, L.userId)).where(where),
    // Genel özet (süzgeçten bağımsız)
    db.select({
      lists: sql<number>`COUNT(*)`,
      owners: sql<number>`COUNT(DISTINCT ${L.userId})`,
      shared: sql<number>`COALESCE(SUM(${L.shareToken} IS NOT NULL), 0)`,
      copies: sql<number>`COALESCE(SUM(${L.sourceListId} IS NOT NULL), 0)`,
      words: sql<number>`(SELECT COUNT(*) FROM word_list_items)`
    }).from(L)
  ]);
  return {
    rows: rows.map((r) => ({ ...r, shared: Boolean(Number(r.shared)), count: Number(r.count), learned: Number(r.learned), answers: Number(r.answers) })),
    total: Number(tot.n),
    summary: { lists: Number(all.lists), owners: Number(all.owners), shared: Number(all.shared), copies: Number(all.copies), words: Number(all.words) }
  };
}

export async function adminList(id: number) {
  const [l] = await db.select({
    id: L.id, title: L.title, description: L.description, shareToken: L.shareToken, copies: L.copies, best: L.best,
    studiedAt: L.studiedAt, createdAt: L.createdAt, updatedAt: L.updatedAt, syncedAt: L.syncedAt,
    userId: U.id, userName: U.name, userEmail: U.email,
    sourceId: Src.id, sourceTitle: Src.title, sourceOwner: SrcOwner.name, sourceOwnerId: SrcOwner.id
  }).from(L).innerJoin(U, eq(U.id, L.userId))
    .leftJoin(Src, eq(Src.id, L.sourceListId)).leftJoin(SrcOwner, eq(SrcOwner.id, Src.userId))
    .where(eq(L.id, id));
  if (!l) return null;
  const [items, copiesOf] = await Promise.all([
    db.select().from(I).where(eq(I.listId, id)).orderBy(asc(I.position), asc(I.id)),
    // Bu listeden alınan kopyalar ve sahipleri
    db.select({ id: L.id, title: L.title, createdAt: L.createdAt, userId: U.id, userName: U.name, userEmail: U.email, ...counts })
      .from(L).innerJoin(U, eq(U.id, L.userId)).where(eq(L.sourceListId, id)).orderBy(desc(L.createdAt)).limit(200)
  ]);
  return { ...l, items, copiesOf: copiesOf.map((c) => ({ ...c, count: Number(c.count), learned: Number(c.learned), answers: Number(c.answers) })) };
}

/** Kullanıcı sayfası için: o kişinin listeleri */
export async function userLists(userId: number) {
  const rows = await db.select({ id: L.id, title: L.title, shared: sql<number>`${L.shareToken} IS NOT NULL`, copies: L.copies, sourceId: L.sourceListId, studiedAt: L.studiedAt, createdAt: L.createdAt, ...counts })
    .from(L).where(eq(L.userId, userId)).orderBy(desc(sql`COALESCE(${L.studiedAt}, ${L.createdAt})`));
  return rows.map((r) => ({ ...r, shared: Boolean(Number(r.shared)), count: Number(r.count), learned: Number(r.learned), answers: Number(r.answers) }));
}
