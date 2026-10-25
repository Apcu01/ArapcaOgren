import 'server-only';
import { desc, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { ALPHABET_TOPIC } from './alphabet';
import { actsOf, TYPE } from './text';
import type { ActType } from './types';

type Row = Record<string, unknown>;
const num = (v: unknown) => Number(v ?? 0);
async function q<T = Row>(query: ReturnType<typeof sql>): Promise<T[]> {
  const [rows] = (await db.execute(query)) as unknown as [T[]];
  return rows;
}

export type DayStat = {
  d: string; views: number; visitors: number; lessons: number; activities: number;
  lessonListens: number; wordListens: number; lookups: number; correct: number; wrong: number;
};

export async function getStats() {
  const [[totals], [ev], daily, topTopics, hardest, typeDist, topPages, recent, metricRows, [today]] = await Promise.all([
    q(sql`SELECT
        (SELECT COUNT(*) FROM users) users,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') admins,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL 7 DAY) new7,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL 30 DAY) new30,
        (SELECT COUNT(DISTINCT user_id) FROM study_days WHERE day >= DATE_FORMAT(NOW() - INTERVAL 6 DAY, '%Y-%m-%d')) active7,
        (SELECT COUNT(*) FROM topics) topics,
        (SELECT COUNT(*) FROM topics WHERE published = 1) published,
        (SELECT COUNT(*) FROM activities) acts,
        (SELECT COUNT(*) FROM topic_progress WHERE lesson_read = 1) lessonsRead,
        (SELECT COUNT(*) FROM activity_progress WHERE done = 1) actsDone`),
    q(sql`SELECT
        SUM(type = 'view' AND created_at >= CURDATE()) viewsToday,
        SUM(type = 'view' AND created_at >= NOW() - INTERVAL 7 DAY) views7,
        SUM(type = 'view' AND created_at >= NOW() - INTERVAL 30 DAY) views30,
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL 7 DAY THEN COALESCE(CONCAT('u', user_id), anon_id) END) visitors7,
        COUNT(DISTINCT CASE WHEN created_at >= CURDATE() THEN COALESCE(CONCAT('u', user_id), anon_id) END) visitorsToday,
        SUM(type = 'activity') activities,
        SUM(type = 'activity' AND created_at >= NOW() - INTERVAL 7 DAY) activities7,
        SUM(type = 'activity' AND user_id IS NULL) guestActivities,
        AVG(CASE WHEN type = 'activity' THEN score END) avgScore,
        SUM(type = 'lesson') lessons
      FROM events`),
    q(sql`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') d,
        SUM(type = 'view') views,
        SUM(type = 'activity') activities,
        SUM(type = 'lesson') lessons,
        COUNT(DISTINCT COALESCE(CONCAT('u', user_id), anon_id)) visitors
      FROM events WHERE created_at >= CURDATE() - INTERVAL 13 DAY
      GROUP BY d ORDER BY d`),
    q(sql`SELECT e.topic_id topicId, t.name, COUNT(*) n, AVG(e.score) avg, COUNT(DISTINCT COALESCE(CONCAT('u', e.user_id), e.anon_id)) people
      FROM events e LEFT JOIN topics t ON t.id = e.topic_id
      WHERE e.type = 'activity' AND e.created_at >= NOW() - INTERVAL 30 DAY
      GROUP BY e.topic_id, t.name ORDER BY n DESC LIMIT 8`),
    q(sql`SELECT e.topic_id topicId, e.act_key actKey, t.name topicName, a.title, a.type, COUNT(*) n, AVG(e.score) avg
      FROM events e
      LEFT JOIN topics t ON t.id = e.topic_id
      LEFT JOIN activities a ON a.id = (CASE WHEN e.act_key REGEXP '^[0-9]+$' THEN CAST(e.act_key AS UNSIGNED) END)
      WHERE e.type = 'activity'
      GROUP BY e.topic_id, e.act_key, t.name, a.title, a.type
      HAVING n >= 3 ORDER BY avg ASC LIMIT 8`),
    q(sql`SELECT COALESCE(a.type, 'alfabe') type, COUNT(*) n
      FROM events e LEFT JOIN activities a ON a.id = (CASE WHEN e.act_key REGEXP '^[0-9]+$' THEN CAST(e.act_key AS UNSIGNED) END)
      WHERE e.type = 'activity' GROUP BY COALESCE(a.type, 'alfabe') ORDER BY n DESC`),
    q(sql`SELECT path, COUNT(*) n FROM events WHERE type = 'view' AND created_at >= NOW() - INTERVAL 30 DAY
      GROUP BY path ORDER BY n DESC LIMIT 8`),
    db.select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, createdAt: schema.users.createdAt })
      .from(schema.users).orderBy(desc(schema.users.createdAt)).limit(6),
    q(sql`SELECT day d, metric, n FROM daily_metrics WHERE day >= DATE_FORMAT(CURDATE() - INTERVAL 13 DAY, '%Y-%m-%d')`),
    q(sql`SELECT DATE_FORMAT(CURDATE(), '%Y-%m-%d') d`)
  ]);

  // Son 14 günü boş günlerle doldur (gün, olaylarla aynı olsun diye veritabanının tarihinden sayılır)
  const m = (d: string, k: string) => num(metricRows.find((x) => x.d === d && x.metric === k)?.n);
  const end = new Date(String(today?.d) + 'T12:00:00Z');
  const days: DayStat[] = [];
  for (let i = 13; i >= 0; i--) {
    const k = new Date(end.getTime() - i * 864e5).toISOString().slice(0, 10);
    const r = daily.find((x) => x.d === k);
    days.push({
      d: k, views: num(r?.views), visitors: num(r?.visitors), lessons: num(r?.lessons), activities: num(r?.activities),
      lessonListens: m(k, 'lesson_listen'), wordListens: m(k, 'word_listen'), lookups: m(k, 'lookup'), correct: m(k, 'correct'), wrong: m(k, 'wrong')
    });
  }
  const alphaActs = actsOf({ ...ALPHABET_TOPIC, autoListen: true });
  const actTitle = (topicId: unknown, key: unknown, title: unknown) =>
    (title as string) || (topicId === 'alfabe' ? alphaActs.find((a) => a.id === key)?.title : null) || String(key);

  return {
    totals: Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, num(v)])) as Record<string, number>,
    ev: Object.fromEntries(Object.entries(ev).map(([k, v]) => [k, num(v)])) as Record<string, number>,
    days,
    topTopics: topTopics.map((r) => ({ topicId: String(r.topicId), name: (r.name as string) || (r.topicId === 'alfabe' ? 'Alfabe' : String(r.topicId)), n: num(r.n), avg: num(r.avg), people: num(r.people) })),
    hardest: hardest.map((r) => ({
      topicName: (r.topicName as string) || (r.topicId === 'alfabe' ? 'Alfabe' : String(r.topicId)),
      title: actTitle(r.topicId, r.actKey, r.title),
      type: r.type ? TYPE[r.type as ActType]?.label ?? String(r.type) : '',
      n: num(r.n), avg: num(r.avg)
    })),
    typeDist: typeDist.map((r) => ({ label: TYPE[r.type as ActType]?.label ?? 'Alfabe alıştırması', n: num(r.n) })),
    topPages: topPages.map((r) => ({ path: String(r.path || '/'), n: num(r.n) })),
    recent
  };
}

export type UserRow = {
  id: number; name: string; email: string; role: 'user' | 'admin'; createdAt: Date; lastSeenAt: Date | null;
  lessons: number; actsDone: number; tried: number; avg: number | null; days: number;
};

export async function getUsers(search: string, page: number, perPage = 30) {
  const like = `%${search.replace(/[%_\\]/g, (c) => '\\' + c)}%`;
  const where = search ? sql`WHERE u.name LIKE ${like} OR u.email LIKE ${like}` : sql``;
  const [rows, [cnt]] = await Promise.all([
    q(sql`SELECT u.id, u.name, u.email, u.role, u.created_at createdAt, u.last_seen_at lastSeenAt,
        (SELECT COUNT(*) FROM topic_progress tp WHERE tp.user_id = u.id AND tp.lesson_read = 1) lessons,
        (SELECT COUNT(*) FROM activity_progress ap WHERE ap.user_id = u.id AND ap.done = 1) actsDone,
        (SELECT COUNT(*) FROM activity_progress ap WHERE ap.user_id = u.id) tried,
        (SELECT AVG(best) FROM activity_progress ap WHERE ap.user_id = u.id) avg,
        (SELECT COUNT(*) FROM study_days sd WHERE sd.user_id = u.id) days
      FROM users u ${where} ORDER BY u.created_at DESC LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`),
    q(sql`SELECT COUNT(*) n FROM users u ${where}`)
  ]);
  return {
    total: num(cnt.n),
    rows: rows.map((r) => ({
      id: num(r.id), name: String(r.name), email: String(r.email), role: r.role as 'user' | 'admin',
      createdAt: new Date(r.createdAt as string), lastSeenAt: r.lastSeenAt ? new Date(r.lastSeenAt as string) : null,
      lessons: num(r.lessons), actsDone: num(r.actsDone), tried: num(r.tried), avg: r.avg == null ? null : num(r.avg), days: num(r.days)
    })) as UserRow[]
  };
}

export async function getUserEvents(userId: number, limit = 25) {
  return db.select().from(schema.events).where(sql`${schema.events.userId} = ${userId} AND ${schema.events.type} <> 'view'`)
    .orderBy(desc(schema.events.createdAt)).limit(limit);
}

export type QStat = { attempts: number; correct: number };

/** Bir dersin soru bazında istatistikleri: etkinlik anahtarı -> soru anahtarı -> sayılar */
export async function getQuestionStats(topicId: string) {
  const rows = await db.select().from(schema.questionStats).where(sql`${schema.questionStats.topicId} = ${topicId}`);
  const out: Record<string, Record<string, QStat>> = {};
  for (const r of rows) (out[r.actKey] ||= {})[r.qkey] = { attempts: r.attempts, correct: r.correct };
  return out;
}

/** En çok yanlış yapılan sorular (en az 5 deneme) */
export async function getHardestQuestions(limit = 10) {
  const rows = await q(sql`SELECT s.topic_id topicId, s.act_key actKey, s.label, s.attempts, s.correct, t.name topicName, a.title
    FROM question_stats s
    LEFT JOIN topics t ON t.id = s.topic_id
    LEFT JOIN activities a ON a.id = (CASE WHEN s.act_key REGEXP '^[0-9]+$' THEN CAST(s.act_key AS UNSIGNED) END)
    WHERE s.attempts >= 5
    ORDER BY s.correct / s.attempts ASC, s.attempts DESC LIMIT ${limit}`);
  return rows.map((r) => ({
    topicId: String(r.topicId), actKey: String(r.actKey), label: String(r.label),
    topicName: (r.topicName as string) || String(r.topicId), title: (r.title as string) || '',
    attempts: num(r.attempts), rate: num(r.attempts) ? num(r.correct) / num(r.attempts) : 0
  }));
}
