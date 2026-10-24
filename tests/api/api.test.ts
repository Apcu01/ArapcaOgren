import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const BASE = (process.env.TEST_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const RUN = Date.now().toString(36);
const mail = (n: string) => `apitest-${RUN}-${n}@example.com`;
const TOPIC = `test-api-${RUN}`;
const started = new Date(Date.now() - 2000);
let db: mysql.Connection;

type Res = { status: number; json: Record<string, unknown>; cookie: string | null };
async function call(path: string, init: { method?: string; body?: unknown; cookie?: string | null } = {}): Promise<Res> {
  const r = await fetch(BASE + path, {
    method: init.method || (init.body ? 'POST' : 'GET'),
    headers: { 'Content-Type': 'application/json', ...(init.cookie ? { Cookie: init.cookie } : {}) },
    body: init.body ? JSON.stringify(init.body) : undefined,
    redirect: 'manual'
  });
  const set = r.headers.get('set-cookie');
  const m = set?.match(/arb_session=([^;]+)/);
  return { status: r.status, json: await r.json().catch(() => ({})), cookie: m && m[1] ? `arb_session=${m[1]}` : null };
}
async function register(n: string) {
  const r = await call('/api/auth/register', { body: { name: 'API Testi', email: mail(n), password: 'test-sifre-123' } });
  expect(r.status).toBe(200);
  expect(r.cookie).toBeTruthy();
  return r.cookie!;
}
const day = new Date().toISOString().slice(0, 10);
// Kayıt sınırına (IP başına saatte 5) takılmamak için testler tek hesabı paylaşır
let main = '';

beforeAll(async () => {
  const ping = await fetch(BASE + '/robots.txt').catch(() => null);
  if (!ping || !ping.ok) throw new Error(`Sunucu çalışmıyor: ${BASE}. Önce "npm run dev" ya da "npm start" çalıştır.`);
  db = await mysql.createConnection({ uri: process.env.DATABASE_URL!, timezone: 'Z' });
});

afterAll(async () => {
  if (!db) return;
  await db.query("DELETE FROM users WHERE email LIKE ?", [`apitest-${RUN}-%`]);
  await db.query('DELETE FROM auth_attempts WHERE (email LIKE ? OR email IS NULL) AND created_at >= ?', [`apitest-${RUN}-%`, started]);
  await db.query('DELETE FROM events WHERE topic_id = ? OR (created_at >= ? AND path LIKE ?)', [TOPIC, started, '/api-test%']);
  await db.query('DELETE FROM question_stats WHERE topic_id = ?', [TOPIC]);
  await db.end();
});

describe('kimlik doğrulama', () => {
  it('kayıt olur, aynı e-postayla ikinci kez kayıt olamaz', async () => {
    main = await register('a');
    const again = await call('/api/auth/register', { body: { name: 'API Testi', email: mail('a'), password: 'test-sifre-123' } });
    expect(again.status).toBe(409);
  });

  it('kısa şifreyi ve geçersiz e-postayı reddeder', async () => {
    expect((await call('/api/auth/register', { body: { name: 'Ad', email: mail('kisa'), password: '123' } })).status).toBe(400);
    expect((await call('/api/auth/register', { body: { name: 'Ad', email: 'eposta-degil', password: 'test-sifre-123' } })).status).toBe(400);
  });

  it('doğru şifreyle giriş yapar, yanlış şifrede hesabın varlığını belli etmez', async () => {
    const ok = await call('/api/auth/login', { body: { email: mail('a'), password: 'test-sifre-123' } });
    expect(ok.status).toBe(200);
    const bad = await call('/api/auth/login', { body: { email: mail('a'), password: 'yanlis' } });
    const none = await call('/api/auth/login', { body: { email: mail('olmayan'), password: 'yanlis' } });
    expect(bad.status).toBe(401);
    expect(bad.json.error).toBe(none.json.error);
  });

  it('5 hatalı denemeden sonra 429 döner', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await call('/api/auth/login', { body: { email: mail('kaba'), password: 'yanlis' + i } })).status);
    expect(statuses.slice(0, 5).every((s) => s === 401)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});

describe('ilerleme', () => {
  it('en iyi skoru korur, tamamlanmış etkinlik tamamlanmış kalır', async () => {
    const c = main;
    const act = (score: number, done: boolean) => call('/api/progress', { cookie: c, body: { action: 'act', topicId: TOPIC, actKey: '1', score, done, day } });
    expect((await act(0.5, false)).status).toBe(200);
    await act(0.9, true);
    await act(0.3, false);
    await call('/api/progress', { cookie: c, body: { action: 'lesson', topicId: TOPIC, day } });
    const [[u]] = await db.query<mysql.RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [mail('a')]);
    const [[a]] = await db.query<mysql.RowDataPacket[]>('SELECT best, last, done, tries FROM activity_progress WHERE user_id = ? AND topic_id = ?', [u.id, TOPIC]);
    expect(a).toMatchObject({ best: 0.9, last: 0.3, done: 1, tries: 3 });
    const [[l]] = await db.query<mysql.RowDataPacket[]>('SELECT lesson_read FROM topic_progress WHERE user_id = ? AND topic_id = ?', [u.id, TOPIC]);
    expect(l.lesson_read).toBe(1);
    const [days] = await db.query<mysql.RowDataPacket[]>('SELECT day FROM study_days WHERE user_id = ?', [u.id]);
    expect(days.map((d) => d.day)).toContain(day);
  });

  it('misafir ilerlemesini hesaba aktarır', async () => {
    const c = main;
    const r = await call('/api/progress', {
      cookie: c,
      body: { action: 'merge', state: { progress: { [TOPIC]: { lesson: true, acts: { '5': { best: 0.8, done: true, tries: 2 } } } }, last: TOPIC, days: [day] } }
    });
    expect(r.status).toBe(200);
    const [[u]] = await db.query<mysql.RowDataPacket[]>('SELECT id, last_topic FROM users WHERE email = ?', [mail('a')]);
    expect(u.last_topic).toBe(TOPIC);
    const [[a]] = await db.query<mysql.RowDataPacket[]>('SELECT best, done FROM activity_progress WHERE user_id = ? AND act_key = ?', [u.id, '5']);
    expect(a).toMatchObject({ best: 0.8, done: 1 });
  });

  it('oturum yoksa ilerleme kaydetmez', async () => {
    expect((await call('/api/progress', { body: { action: 'reset' } })).status).toBe(401);
  });
});

describe('Hatalarım', () => {
  it('ekler, tekrar eklenince sayacı artırır, çözülünce siler', async () => {
    const c = main;
    const q = { t: 'mc', q: 'Kitap?', options: ['كِتَابٌ', 'بَيْتٌ'], a: 'كِتَابٌ' };
    const add = () => call('/api/mistakes', { cookie: c, body: { action: 'add', mkey: `${TOPIC}:q1`, topicId: TOPIC, question: q } });
    expect((await add()).status).toBe(200);
    await add();
    const [[u]] = await db.query<mysql.RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [mail('a')]);
    const [[m]] = await db.query<mysql.RowDataPacket[]>('SELECT count FROM mistakes WHERE user_id = ?', [u.id]);
    expect(m.count).toBe(2);
    await call('/api/mistakes', { cookie: c, body: { action: 'resolve', mkey: `${TOPIC}:q1` } });
    const [rows] = await db.query<mysql.RowDataPacket[]>('SELECT * FROM mistakes WHERE user_id = ?', [u.id]);
    expect(rows).toHaveLength(0);
  });
});

describe('istatistik', () => {
  it('etkinlik olayı soru bazında istatistiği artırır (misafir dahil)', async () => {
    const ev = (ok: boolean) => call('/api/events', { body: { type: 'activity', anonId: 'api-test', topicId: TOPIC, actKey: '1', score: ok ? 1 : 0, answers: [{ qk: 'qX', label: 'Deneme sorusu', ok }] } });
    await ev(true);
    await ev(false);
    const [[s]] = await db.query<mysql.RowDataPacket[]>('SELECT attempts, correct FROM question_stats WHERE topic_id = ? AND qkey = ?', [TOPIC, 'qX']);
    expect(s).toMatchObject({ attempts: 2, correct: 1 });
  });
});

describe('yetkiler', () => {
  it('normal kullanıcı yönetici API uçlarına erişemez ve panel 404 döner', async () => {
    const c = main;
    expect((await call('/api/admin/topics/saatler', { method: 'DELETE', cookie: c })).status).toBe(403);
    expect((await call('/api/admin/users/1', { method: 'DELETE', cookie: c })).status).toBe(403);
    const panel = await fetch(BASE + '/admin', { headers: { Cookie: c } });
    expect(panel.status).toBe(404);
  });

  it('misafir yönetici API uçlarında 401 alır', async () => {
    expect((await call('/api/admin/topics/saatler', { method: 'DELETE' })).status).toBe(401);
  });

  it('hesap silinince oturum ve veriler gider', async () => {
    const c = await register('g');
    const del = await call('/api/account', { method: 'DELETE', cookie: c, body: { password: 'test-sifre-123' } });
    expect(del.status).toBe(200);
    const [rows] = await db.query<mysql.RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [mail('g')]);
    expect(rows).toHaveLength(0);
    expect((await call('/api/progress', { cookie: c, body: { action: 'reset' } })).status).toBe(401);
  });
});
