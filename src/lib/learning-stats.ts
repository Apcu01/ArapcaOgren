import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { addDays, trDay, weekStart } from './league';
import { getReadings } from './reading-store';
import { READING_TOPIC } from './readings';
import { DICTATE_KEY, HARAKAT_KEY } from './text';

/* Yönetim paneli: okuma metinleri, dikte ve hareke, sınıflar, haftalık lig ve bildirim istatistikleri */
type Row = Record<string, unknown>;
const num = (v: unknown) => Number(v ?? 0);
async function q<T = Row>(query: ReturnType<typeof sql>): Promise<T[]> {
  const [rows] = (await db.execute(query)) as unknown as [T[]];
  return rows;
}

export async function learningStats() {
  const week = weekStart(trDay());
  const lastWeek = addDays(week, -7);
  const [readings, views, results, attempts, qstats, wordErr, practice, [cls], topClasses, [lg], [lgLast], topLeague, [push], pushKinds, pushSends] = await Promise.all([
    getReadings({ all: true }),
    q(sql`SELECT path, COUNT(*) n, COUNT(DISTINCT COALESCE(CONCAT('u', user_id), anon_id)) people FROM events WHERE type = 'view' AND path LIKE '/okuma/%' GROUP BY path`),
    // Üyelerin sonuçları (en iyi skor)
    q(sql`SELECT act_key k, COUNT(*) n, SUM(done) done, AVG(best) avg FROM activity_progress WHERE topic_id = ${READING_TOPIC} GROUP BY act_key`),
    // Bütün denemeler (misafirler dahil)
    q(sql`SELECT act_key k, COUNT(*) n, AVG(score) avg FROM events WHERE type = 'activity' AND topic_id = ${READING_TOPIC} GROUP BY act_key`),
    q(sql`SELECT act_key k, label, attempts, correct FROM question_stats WHERE topic_id = ${READING_TOPIC}`),
    // Dikte ve hareke koymada en çok yanlış yapılan kelimeler (en az 3 deneme)
    q(sql`SELECT act_key k, topic_id t, label, SUM(attempts) attempts, SUM(correct) correct FROM question_stats
          WHERE act_key IN (${DICTATE_KEY}, ${HARAKAT_KEY}) GROUP BY act_key, topic_id, label HAVING SUM(attempts) >= 3
          ORDER BY (SUM(attempts) - SUM(correct)) / SUM(attempts) DESC, SUM(attempts) DESC LIMIT 40`),
    q(sql`SELECT act_key k, COUNT(*) n, AVG(score) avg, COUNT(DISTINCT COALESCE(CONCAT('u', user_id), anon_id)) people FROM events
          WHERE type = 'activity' AND act_key IN (${DICTATE_KEY}, ${HARAKAT_KEY}) GROUP BY act_key`),
    q(sql`SELECT (SELECT COUNT(*) FROM classes) classes, (SELECT COUNT(DISTINCT owner_id) FROM classes) teachers,
            (SELECT COUNT(*) FROM class_members) members, (SELECT COUNT(DISTINCT user_id) FROM class_members) students,
            (SELECT COUNT(*) FROM class_tasks) tasks, (SELECT COUNT(*) FROM class_posts) posts,
            (SELECT COUNT(*) FROM classes WHERE created_at >= NOW() - INTERVAL 30 DAY) new30`),
    q(sql`SELECT c.id, c.name, u.name owner, c.created_at,
            (SELECT COUNT(*) FROM class_members m WHERE m.class_id = c.id) members,
            (SELECT COUNT(*) FROM class_tasks t WHERE t.class_id = c.id) tasks,
            (SELECT COALESCE(SUM(x.xp), 0) FROM xp_log x JOIN class_members m ON m.user_id = x.user_id AND m.class_id = c.id WHERE x.day >= ${week}) xp
          FROM classes c JOIN users u ON u.id = c.owner_id ORDER BY members DESC, c.created_at DESC LIMIT 20`),
    q(sql`SELECT COUNT(DISTINCT user_id) people, COALESCE(SUM(xp), 0) xp FROM xp_log WHERE day >= ${week}`),
    q(sql`SELECT COUNT(DISTINCT user_id) people, COALESCE(SUM(xp), 0) xp FROM xp_log WHERE day >= ${lastWeek} AND day < ${week}`),
    q(sql`SELECT u.id, u.name, u.league_hidden hidden, SUM(x.xp) xp FROM xp_log x JOIN users u ON u.id = x.user_id WHERE x.day >= ${week} GROUP BY u.id, u.name, u.league_hidden ORDER BY xp DESC LIMIT 10`),
    q(sql`SELECT COUNT(*) subs, COUNT(DISTINCT user_id) users FROM push_subscriptions`),
    q(sql`SELECT k.kind, COUNT(*) n FROM push_subscriptions s, JSON_TABLE(s.kinds, '$[*]' COLUMNS (kind VARCHAR(16) PATH '$')) k GROUP BY k.kind`),
    q(sql`SELECT kind, COUNT(*) n FROM push_sends WHERE created_at >= NOW() - INTERVAL 7 DAY GROUP BY kind`)
  ]);

  const v = new Map(views.map((r) => [String(r.path).replace('/okuma/', ''), r]));
  const res = new Map(results.map((r) => [String(r.k), r]));
  const att = new Map(attempts.map((r) => [String(r.k), r]));
  return {
    readings: readings.map((r) => {
      const qs = qstats.filter((x) => x.k === r.slug);
      return {
        slug: r.slug, title: r.title, published: !!r.published,
        views: num(v.get(r.slug)?.n), readers: num(v.get(r.slug)?.people),
        attempts: num(att.get(r.slug)?.n), avg: att.get(r.slug) ? num(att.get(r.slug)!.avg) : null,
        members: num(res.get(r.slug)?.n), done: num(res.get(r.slug)?.done),
        questions: r.questions.map((x) => {
          const s = qs.find((y) => y.label === x.q.slice(0, 255));
          return { q: x.q, attempts: num(s?.attempts), rate: s && num(s.attempts) ? num(s.correct) / num(s.attempts) : null };
        })
      };
    }),
    words: wordErr.map((r) => ({ kind: String(r.k), topic: String(r.t), label: String(r.label), attempts: num(r.attempts), wrong: num(r.attempts) - num(r.correct) })),
    practice: Object.fromEntries(practice.map((r) => [String(r.k), { n: num(r.n), avg: num(r.avg), people: num(r.people) }])) as Record<string, { n: number; avg: number; people: number }>,
    classes: { classes: num(cls.classes), teachers: num(cls.teachers), members: num(cls.members), students: num(cls.students), tasks: num(cls.tasks), posts: num(cls.posts), new30: num(cls.new30) },
    topClasses: topClasses.map((r) => ({ id: num(r.id), name: String(r.name), owner: String(r.owner), members: num(r.members), tasks: num(r.tasks), xp: num(r.xp) })),
    league: { week, people: num(lg.people), xp: num(lg.xp), lastPeople: num(lgLast.people), lastXp: num(lgLast.xp), top: topLeague.map((r) => ({ id: num(r.id), name: String(r.name), hidden: !!num(r.hidden), xp: num(r.xp) })) },
    push: { subs: num(push.subs), users: num(push.users), kinds: Object.fromEntries(pushKinds.map((r) => [String(r.kind), num(r.n)])), sends: Object.fromEntries(pushSends.map((r) => [String(r.kind), num(r.n)])) as Record<string, number> }
  };
}
