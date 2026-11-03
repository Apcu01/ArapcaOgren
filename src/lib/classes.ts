import 'server-only';
import { randomInt } from 'node:crypto';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { CLASS_LIMITS, CODE_CHARS, type ClassDetail, type ClassSummary, type ClassTask, type TaskKind, type TaskStatus } from './class-shared';
import { leagueName } from './league';
import { setShare } from './lists';
import { READING_TOPIC, readingBySlug } from './readings';
import { actsOf } from './text';
import { getTopics } from './topics';

const C = schema.classes, M = schema.classMembers, T = schema.classTasks;

function newCode() {
  let s = '';
  for (let i = 0; i < 6; i++) s += CODE_CHARS[randomInt(CODE_CHARS.length)];
  return s;
}
/** Benzersiz kod (çakışırsa yeniden dener) */
async function freeCode() {
  for (let i = 0; i < 8; i++) {
    const c = newCode();
    const [hit] = await db.select({ id: C.id }).from(C).where(eq(C.code, c)).limit(1);
    if (!hit) return c;
  }
  throw new Error('Kod üretilemedi');
}

export async function myClasses(userId: number): Promise<ClassSummary[]> {
  const memberCount = sql<number>`(SELECT COUNT(*) FROM class_members cm WHERE cm.class_id = ${C.id})`;
  const taskCount = sql<number>`(SELECT COUNT(*) FROM class_tasks ct WHERE ct.class_id = ${C.id})`;
  const [owned, joined] = await Promise.all([
    db.select({ id: C.id, name: C.name, code: C.code, members: memberCount, tasks: taskCount }).from(C).where(eq(C.ownerId, userId)).orderBy(desc(C.createdAt)),
    db.select({ id: C.id, name: C.name, owner: schema.users.name, members: memberCount, tasks: taskCount })
      .from(M).innerJoin(C, eq(C.id, M.classId)).innerJoin(schema.users, eq(schema.users.id, C.ownerId))
      .where(eq(M.userId, userId)).orderBy(desc(M.joinedAt))
  ]);
  return [
    ...owned.map((c) => ({ id: c.id, name: c.name, owner: '', isOwner: true, members: Number(c.members), tasks: Number(c.tasks), code: c.code })),
    ...joined.map((c) => ({ id: c.id, name: c.name, owner: c.owner, isOwner: false, members: Number(c.members), tasks: Number(c.tasks) }))
  ];
}

export async function createClass(userId: number, name: string) {
  const [n] = await db.select({ n: sql<number>`COUNT(*)` }).from(C).where(eq(C.ownerId, userId));
  if (Number(n?.n || 0) >= CLASS_LIMITS.owned) return { error: `En fazla ${CLASS_LIMITS.owned} sınıf açabilirsin.` } as const;
  const [r] = await db.insert(C).values({ ownerId: userId, name, code: await freeCode() }).$returningId();
  return { id: r.id } as const;
}

export async function joinClass(userId: number, code: string) {
  const [c] = await db.select({ id: C.id, ownerId: C.ownerId, name: C.name }).from(C).where(eq(C.code, code)).limit(1);
  if (!c) return { error: 'Bu kodla bir sınıf bulunamadı. Kodu kontrol et.' } as const;
  if (c.ownerId === userId) return { error: 'Bu sınıfın öğretmeni sensin.', id: c.id } as const;
  const [[mem], [cnt], [mine]] = await Promise.all([
    db.select({ u: M.userId }).from(M).where(and(eq(M.classId, c.id), eq(M.userId, userId))).limit(1),
    db.select({ n: sql<number>`COUNT(*)` }).from(M).where(eq(M.classId, c.id)),
    db.select({ n: sql<number>`COUNT(*)` }).from(M).where(eq(M.userId, userId))
  ]);
  if (mem) return { id: c.id, name: c.name, already: true } as const;
  if (Number(cnt?.n || 0) >= CLASS_LIMITS.members) return { error: 'Bu sınıf dolu.' } as const;
  if (Number(mine?.n || 0) >= CLASS_LIMITS.joined) return { error: `En fazla ${CLASS_LIMITS.joined} sınıfa katılabilirsin.` } as const;
  await db.insert(M).values({ classId: c.id, userId });
  return { id: c.id, name: c.name } as const;
}

/** Sınıfa erişim: öğretmen mi, öğrenci mi (ikisi de değilse null) */
export async function classRole(userId: number, id: number) {
  const [c] = await db.select({ ownerId: C.ownerId }).from(C).where(eq(C.id, id)).limit(1);
  if (!c) return null;
  if (c.ownerId === userId) return 'owner' as const;
  const [m] = await db.select({ u: M.userId }).from(M).where(and(eq(M.classId, id), eq(M.userId, userId))).limit(1);
  return m ? ('member' as const) : null;
}

export async function memberIds(id: number) {
  return (await db.select({ u: M.userId }).from(M).where(eq(M.classId, id))).map((r) => r.u);
}

/* ---------- Ödev durumları ---------- */
async function statuses(tasks: (typeof T.$inferSelect)[], users: number[], ownerId: number) {
  const out = new Map<number, Record<number, TaskStatus>>(tasks.map((t) => [t.id, {}]));
  const hrefs = new Map<number, Record<number, string | null>>(tasks.map((t) => [t.id, {}]));
  if (!users.length) return { out, hrefs };
  const topicIds = [...new Set(tasks.filter((t) => t.kind === 'topic').map((t) => t.ref))];
  const slugs = [...new Set(tasks.filter((t) => t.kind === 'reading').map((t) => t.ref))];
  const listIds = [...new Set(tasks.filter((t) => t.kind === 'list').map((t) => Number(t.ref)).filter((n) => n > 0))];
  const AP = schema.activityProgress, TP = schema.topicProgress, L = schema.wordLists;
  const [topics, lessons, acts, reads, copies, sources] = await Promise.all([
    topicIds.length ? getTopics() : Promise.resolve([]),
    topicIds.length ? db.select().from(TP).where(and(inArray(TP.userId, users), inArray(TP.topicId, topicIds))) : Promise.resolve([]),
    topicIds.length ? db.select().from(AP).where(and(inArray(AP.userId, users), inArray(AP.topicId, topicIds))) : Promise.resolve([]),
    slugs.length ? db.select().from(AP).where(and(inArray(AP.userId, users), eq(AP.topicId, READING_TOPIC), inArray(AP.actKey, slugs))) : Promise.resolve([]),
    listIds.length ? db.select({
      id: L.id, userId: L.userId, source: L.sourceListId,
      total: sql<number>`(SELECT COUNT(*) FROM word_list_items i WHERE i.list_id = ${L.id})`,
      learned: sql<number>`(SELECT COUNT(*) FROM word_list_items i WHERE i.list_id = ${L.id} AND i.streak >= 2)`,
      tried: sql<number>`(SELECT COUNT(*) FROM word_list_items i WHERE i.list_id = ${L.id} AND i.correct + i.wrong > 0)`
    }).from(L).where(and(inArray(L.userId, users), inArray(L.sourceListId, listIds))) : Promise.resolve([]),
    listIds.length ? db.select({ id: L.id, token: L.shareToken }).from(L).where(and(eq(L.userId, ownerId), inArray(L.id, listIds))) : Promise.resolve([])
  ]);
  for (const t of tasks) {
    const st = out.get(t.id)!, hr = hrefs.get(t.id)!;
    for (const u of users) {
      if (t.kind === 'topic') {
        const topic = topics.find((x) => x.id === t.ref);
        const list = topic ? actsOf(topic) : [];
        const read = lessons.some((l) => l.userId === u && l.topicId === t.ref && l.lessonRead);
        const mine = acts.filter((a) => a.userId === u && a.topicId === t.ref);
        const done = list.filter((a) => mine.some((m) => m.actKey === a.id && m.done)).length;
        const pct = Math.round(((done + (read ? 1 : 0)) / (list.length + 1)) * 100);
        st[u] = { pct, done: pct === 100, started: read || mine.length > 0 };
        hr[u] = `/konu/${t.ref}`;
      } else if (t.kind === 'reading') {
        const r = reads.find((a) => a.userId === u && a.actKey === t.ref);
        st[u] = { pct: r ? Math.round(r.best * 100) : 0, done: !!r?.done, started: !!r };
        hr[u] = `/okuma/${t.ref}`;
      } else {
        const c = copies.filter((x) => x.userId === u && String(x.source) === t.ref).sort((a, b) => Number(b.learned) - Number(a.learned))[0];
        const total = Number(c?.total || 0), learned = Number(c?.learned || 0);
        st[u] = { pct: total ? Math.round((learned / total) * 100) : 0, done: total > 0 && learned === total, started: !!c && Number(c.tried) > 0 };
        const src = sources.find((x) => String(x.id) === t.ref);
        hr[u] = c ? `/listelerim/${c.id}` : src?.token ? `/liste/${src.token}` : null;
      }
    }
  }
  return { out, hrefs };
}

export async function getClass(userId: number, id: number): Promise<ClassDetail | null> {
  const role = await classRole(userId, id);
  if (!role) return null;
  const [c] = await db.select({ id: C.id, name: C.name, code: C.code, ownerId: C.ownerId, owner: schema.users.name })
    .from(C).innerJoin(schema.users, eq(schema.users.id, C.ownerId)).where(eq(C.id, id)).limit(1);
  const [members, tasks] = await Promise.all([
    db.select({ userId: M.userId, name: schema.users.name, joinedAt: M.joinedAt }).from(M).innerJoin(schema.users, eq(schema.users.id, M.userId))
      .where(eq(M.classId, id)).orderBy(schema.users.name),
    db.select().from(T).where(eq(T.classId, id)).orderBy(desc(T.createdAt))
  ]);
  const owner = role === 'owner';
  // Öğretmen herkesin durumunu, öğrenci yalnızca kendisininkini görür
  const { out, hrefs } = await statuses(tasks, owner ? members.map((m) => m.userId) : [userId], c.ownerId);
  const ownerHref = (t: (typeof tasks)[number]) => (t.kind === 'topic' ? `/konu/${t.ref}` : t.kind === 'reading' ? `/okuma/${t.ref}` : `/listelerim/${t.ref}`);
  const list: ClassTask[] = tasks.map((t) => ({
    id: t.id, kind: t.kind as TaskKind, ref: t.ref, title: t.title, due: t.due, createdAt: t.createdAt.toISOString(),
    href: owner ? ownerHref(t) : hrefs.get(t.id)![userId] ?? null,
    status: out.get(t.id)!
  }));
  return {
    id: c.id, name: c.name, owner: owner ? c.owner : leagueName(c.owner), isOwner: owner, code: owner ? c.code : null, me: userId,
    // Öğrenciler sınıf arkadaşlarının yalnızca adını ve soyadının baş harfini görür
    members: members.map((m) => ({ userId: m.userId, name: owner ? m.name : leagueName(m.name), joinedAt: m.joinedAt.toISOString() })),
    tasks: list
  };
}

/* ---------- Öğretmen işlemleri ---------- */
export async function renameClass(ownerId: number, id: number, name: string) {
  const r = await db.update(C).set({ name }).where(and(eq(C.id, id), eq(C.ownerId, ownerId)));
  return r[0].affectedRows > 0;
}
export async function renewCode(ownerId: number, id: number) {
  const code = await freeCode();
  const r = await db.update(C).set({ code }).where(and(eq(C.id, id), eq(C.ownerId, ownerId)));
  return r[0].affectedRows > 0 ? code : null;
}
export async function deleteClass(ownerId: number, id: number) {
  const r = await db.delete(C).where(and(eq(C.id, id), eq(C.ownerId, ownerId)));
  return r[0].affectedRows > 0;
}
export async function removeMember(id: number, userId: number) {
  await db.delete(M).where(and(eq(M.classId, id), eq(M.userId, userId)));
}

export async function addTask(ownerId: number, id: number, kind: TaskKind, ref: string, due: string | null) {
  const [[cnt], [dup]] = await Promise.all([
    db.select({ n: sql<number>`COUNT(*)` }).from(T).where(eq(T.classId, id)),
    db.select({ id: T.id }).from(T).where(and(eq(T.classId, id), eq(T.kind, kind), eq(T.ref, ref))).limit(1)
  ]);
  if (Number(cnt?.n || 0) >= CLASS_LIMITS.tasks) return { error: `Bir sınıfta en fazla ${CLASS_LIMITS.tasks} ödev olabilir.` };
  if (dup) return { error: 'Bu ödev zaten verilmiş.' };
  let title = '';
  if (kind === 'topic') {
    const t = (await getTopics()).find((x) => x.id === ref);
    if (!t) return { error: 'Ders bulunamadı.' };
    title = t.name;
  } else if (kind === 'reading') {
    const r = readingBySlug(ref);
    if (!r) return { error: 'Okuma metni bulunamadı.' };
    title = r.title;
  } else {
    const L = schema.wordLists;
    const [l] = await db.select({ title: L.title, source: L.sourceListId }).from(L).where(and(eq(L.id, Number(ref)), eq(L.userId, ownerId))).limit(1);
    if (!l) return { error: 'Liste bulunamadı.' };
    // Öğrenciler kopyalayabilsin diye listenin paylaşım bağlantısı açılır
    await setShare(ownerId, Number(ref), true);
    title = l.title;
  }
  const [r] = await db.insert(T).values({ classId: id, kind, ref, title: title.slice(0, 120), due }).$returningId();
  return { id: r.id };
}
export async function deleteTask(id: number, taskId: number) {
  await db.delete(T).where(and(eq(T.classId, id), eq(T.id, taskId)));
}
