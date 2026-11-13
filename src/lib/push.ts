import 'server-only';
import { and, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import webpush from 'web-push';
import { db, schema } from '@/db';
import { addDays, rankRows, trDay, weekEnd, weekStart } from './league';
import { dueText, leagueText, postText, PUSH_HOURS, streakText, type PushKind, type PushPayload } from './push-shared';
import { taskDone } from './classes';

const S = schema.pushSubscriptions;

export const pushReady = () => !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
let configured = false;
function setup() {
  if (configured || !pushReady()) return pushReady();
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:admin@example.com', process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
  configured = true;
  return true;
}

export async function saveSubscription(userId: number, sub: { endpoint: string; p256dh: string; auth: string }, kinds: PushKind[]) {
  // Aynı cihaz başka hesapla açıldıysa abonelik yeni hesaba geçer
  await db.insert(S).values({ userId, endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth, kinds })
    .onDuplicateKeyUpdate({ set: { userId, p256dh: sub.p256dh, auth: sub.auth, kinds } });
}
export async function getSubscription(userId: number, endpoint: string) {
  const [r] = await db.select({ kinds: S.kinds }).from(S).where(and(eq(S.userId, userId), eq(S.endpoint, endpoint))).limit(1);
  return r || null;
}
export async function setKinds(userId: number, endpoint: string, kinds: PushKind[]) {
  const r = await db.update(S).set({ kinds }).where(and(eq(S.userId, userId), eq(S.endpoint, endpoint)));
  return r[0].affectedRows > 0;
}
export async function removeSubscription(userId: number, endpoint: string) {
  await db.delete(S).where(and(eq(S.userId, userId), eq(S.endpoint, endpoint)));
}

/** Bildirim gönderir; süresi dolmuş (404/410) abonelikler silinir. kind verilirse yalnızca o türü isteyen cihazlara. */
export async function sendPush(userIds: number[], payload: PushPayload, kind?: PushKind, endpoint?: string) {
  if (!userIds.length || !setup()) return { sent: 0, failed: 0 };
  const subs = await db.select().from(S).where(and(
    inArray(S.userId, userIds),
    kind ? sql`JSON_CONTAINS(${S.kinds}, ${JSON.stringify(kind)})` : undefined,
    endpoint ? eq(S.endpoint, endpoint) : undefined
  ));
  let sent = 0, failed = 0;
  const gone: number[] = [];
  await Promise.all(subs.map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 6 * 3600, urgency: 'normal' });
      sent++;
    } catch (e) {
      failed++;
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) gone.push(s.id);
      else console.error('Bildirim gönderilemedi:', code, (e as Error).message);
    }
  }));
  if (gone.length) await db.delete(S).where(inArray(S.id, gone));
  return { sent, failed };
}

/** Aynı gün aynı hatırlatma bir kez: kayıt eklenebildiyse gönderilecek kullanıcılar */
async function claim(userIds: number[], kind: string, day: string) {
  const out: number[] = [];
  for (const u of userIds) {
    const r = await db.execute(sql`INSERT IGNORE INTO push_sends (user_id, kind, day) VALUES (${u}, ${kind}, ${day})`);
    if ((r[0] as unknown as { affectedRows: number }).affectedRows === 1) out.push(u);
  }
  return out;
}

/** Bildirim isteyen üyeler (türe göre) */
async function subscribers(kind: PushKind) {
  const rows = await db.selectDistinct({ u: S.userId }).from(S).where(sql`JSON_CONTAINS(${S.kinds}, ${JSON.stringify(kind)})`);
  return rows.map((r) => r.u);
}

/** Türkiye saatiyle saat (0-23) ve haftanın günü (0 pazartesi) */
function trClock(now: Date) {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', hourCycle: 'h23' }).format(now));
  const day = trDay(now);
  const wd = (new Date(day + 'T12:00:00Z').getUTCDay() + 6) % 7;
  return { h, day, wd };
}

/** Zamanı gelen hatırlatmaları gönderir (zamanlayıcı birkaç dakikada bir çağırır; aynı gün tekrar göndermez) */
export async function runReminders(now = new Date()) {
  if (!pushReady()) return { skipped: 'VAPID anahtarları yok' };
  const { h, day, wd } = trClock(now);
  const out: Record<string, number> = {};

  // Seri: dün çalışmış, bugün çalışmamış
  if (h >= PUSH_HOURS.streak && h < 23) {
    const subs = await subscribers('streak');
    if (subs.length) {
      const days = await db.select({ u: schema.studyDays.userId, d: schema.studyDays.day }).from(schema.studyDays)
        .where(and(inArray(schema.studyDays.userId, subs), gte(schema.studyDays.day, addDays(day, -400))));
      const by = new Map<number, Set<string>>();
      for (const r of days) { const s = by.get(r.u) || new Set<string>(); s.add(r.d); by.set(r.u, s); }
      const want = subs.filter((u) => by.get(u)?.has(addDays(day, -1)) && !by.get(u)?.has(day));
      for (const u of await claim(want, 'streak', day)) {
        let n = 0, d = addDays(day, -1);
        while (by.get(u)!.has(d)) { n++; d = addDays(d, -1); }
        out.streak = (out.streak || 0) + (await sendPush([u], streakText(n), 'streak')).sent;
      }
    }
  }

  // Ödev: son günü yarın olan ve bitirilmemiş ödevler
  if (h >= PUSH_HOURS.due && h < 23) {
    const subs = await subscribers('due');
    const tomorrow = addDays(day, 1);
    if (subs.length) {
      const tasks = await db.select({ t: schema.classTasks, ownerId: schema.classes.ownerId })
        .from(schema.classTasks).innerJoin(schema.classes, eq(schema.classes.id, schema.classTasks.classId))
        .where(eq(schema.classTasks.due, tomorrow));
      const pending = new Map<number, string[]>();
      for (const { t, ownerId } of tasks) {
        const members = (await db.select({ u: schema.classMembers.userId }).from(schema.classMembers).where(eq(schema.classMembers.classId, t.classId))).map((r) => r.u).filter((u) => subs.includes(u));
        if (!members.length) continue;
        const done = await taskDone(t, members, ownerId);
        for (const u of members) if (!done[u]) pending.set(u, [...(pending.get(u) || []), t.title]);
      }
      for (const u of await claim([...pending.keys()], 'due', day)) out.due = (out.due || 0) + (await sendPush([u], dueText(pending.get(u)!), 'due')).sent;
    }
  }

  // Lig: pazar akşamı, o hafta puan almış olanlar
  if (wd === 6 && h >= PUSH_HOURS.league && h < 23) {
    const subs = await subscribers('league');
    if (subs.length) {
      const start = weekStart(day);
      const rows = await db.select({ u: schema.xpLog.userId, hidden: schema.users.leagueHidden, xp: sql<number>`SUM(${schema.xpLog.xp})` })
        .from(schema.xpLog).innerJoin(schema.users, eq(schema.users.id, schema.xpLog.userId))
        .where(and(gte(schema.xpLog.day, start), lte(schema.xpLog.day, weekEnd(start)))).groupBy(schema.xpLog.userId, schema.users.leagueHidden);
      const ranked = rankRows(rows.filter((r) => !r.hidden).map((r) => ({ u: r.u, xp: Number(r.xp) })));
      const mine = rows.filter((r) => subs.includes(r.u) && Number(r.xp) > 0);
      for (const u of await claim(mine.map((r) => r.u), 'league', day)) {
        const r = mine.find((x) => x.u === u)!;
        out.league = (out.league || 0) + (await sendPush([u], leagueText(Number(r.xp), ranked.find((x) => x.u === u)?.rank ?? null), 'league')).sent;
      }
    }
  }
  return out;
}

/** Sınıf duyurusu: sınıftaki öğrencilere hemen */
export async function notifyPost(classId: number, className: string, body: string) {
  if (!pushReady()) return;
  const members = (await db.select({ u: schema.classMembers.userId }).from(schema.classMembers).where(eq(schema.classMembers.classId, classId))).map((r) => r.u);
  await sendPush(members, postText(className, body, classId), 'posts').catch((e) => console.error('Duyuru bildirimi:', (e as Error).message));
}
