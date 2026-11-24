import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { addDays, trDay, weekStart } from '../../src/lib/league';

// Güvenlik ve performans düzeltmelerinin API testleri: yönetim paneli sayfalarının verisi, başka siteden istek (CSRF),
// şifre değişince diğer oturumların kapanması ve toplu yazılan kayıtlar (hatalar, ilerleme, liste, cevaplar, lig rozeti).
// Kullanıcılar ve oturumlar kayıt sınırına takılmamak için doğrudan veritabanında açılır; hepsi sonunda silinir.

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const BASE = (process.env.TEST_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const RUN = Date.now().toString(36);
const mail = (n: string) => `apitest-${RUN}-sec-${n}@example.com`;
const PASS = 'test-sifre-123';
const sha = (t: string) => crypto.createHash('sha256').update(t).digest('hex');
let db: mysql.Connection;

type Res = { status: number; json: Record<string, any>; cookie: string | null };
async function call(path: string, init: { method?: string; body?: unknown; cookie?: string | null; headers?: Record<string, string> } = {}): Promise<Res> {
  const r = await fetch(BASE + path, {
    method: init.method || (init.body ? 'POST' : 'GET'),
    headers: { 'Content-Type': 'application/json', ...(init.cookie ? { Cookie: init.cookie } : {}), ...init.headers },
    body: init.body ? JSON.stringify(init.body) : undefined,
    redirect: 'manual'
  });
  const m = r.headers.get('set-cookie')?.match(/arb_session=([^;]+)/);
  return { status: r.status, json: await r.json().catch(() => ({})), cookie: m && m[1] ? `arb_session=${m[1]}` : null };
}

/** Kullanıcı ve oturum doğrudan veritabanında (kayıt sınırına takılmadan) */
async function makeUser(n: string, opts: { hidden?: boolean } = {}) {
  const [r] = await db.query<mysql.ResultSetHeader>(
    'INSERT INTO users (name, email, password_hash, role, league_hidden) VALUES (?, ?, ?, ?, ?)',
    [`Güvenlik ${n}`, mail(n), bcrypt.hashSync(PASS, 4), 'user', opts.hidden ? 1 : 0]
  );
  const token = crypto.randomBytes(32).toString('base64url');
  await db.query('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', [sha(token), r.insertId, new Date(Date.now() + 864e5)]);
  return { id: r.insertId, cookie: `arb_session=${token}` };
}

beforeAll(async () => {
  const ping = await fetch(BASE + '/robots.txt').catch(() => null);
  if (!ping || !ping.ok) throw new Error(`Sunucu çalışmıyor: ${BASE}. Önce "npm run dev" ya da "npm start" çalıştır.`);
  db = await mysql.createConnection({ uri: process.env.DATABASE_URL!, timezone: 'Z' });
});

afterAll(async () => {
  if (!db) return;
  await db.query('DELETE FROM users WHERE email LIKE ?', [`apitest-${RUN}-sec-%`]);
  await db.query('DELETE FROM auth_attempts WHERE email LIKE ?', [`apitest-${RUN}-sec-%`]);
  await db.end();
});

describe('yönetim paneli sayfaları', () => {
  // Yerleşim dosyasındaki yetki kontrolü sayfanın çalışmasını durdurmaz: her sayfa kendisi denetlemeli
  it('giriş yapmamış biri ya da normal kullanıcı panel sayfalarının verisini alamaz (sayfa ve RSC isteği)', async () => {
    const u = await makeUser('panel');
    // Arama yalnızca adresin başıyla yapılır: adres sayfanın URL'sinde geçmesin, yalnızca tablo görünürse yanıtta çıksın
    const paths = [`/admin/kullanicilar?q=apitest-${RUN}-sec-panel`, `/admin/kullanicilar/${u.id}`];
    for (const path of paths) {
      for (const cookie of [null, u.cookie]) {
        for (const rsc of [false, true]) {
          const r = await fetch(BASE + path, { headers: { ...(rsc ? { RSC: '1' } : {}), ...(cookie ? { Cookie: cookie } : {}) } });
          const text = await r.text();
          expect(text, `${path} ${cookie ? 'kullanıcı' : 'misafir'} ${rsc ? 'RSC' : 'sayfa'}`).not.toContain(mail('panel'));
        }
      }
    }
  });
});

describe('başka siteden istek (CSRF)', () => {
  it('aynı ana alan adındaki başka bir siteden gelen istek reddedilir, sitenin kendi isteği geçer', async () => {
    const u = await makeUser('csrf');
    const day = trDay();
    expect((await call('/api/progress', { cookie: u.cookie, body: { action: 'lesson', topicId: 'renkler', day } })).status).toBe(200);
    const evil = { Origin: 'https://baska.minefox.net' };
    expect((await call('/api/progress', { cookie: u.cookie, body: { action: 'reset' }, headers: { ...evil, 'Sec-Fetch-Site': 'same-site' } })).status).toBe(403);
    // Sec-Fetch-Site göndermeyen eski tarayıcı
    expect((await call('/api/progress', { cookie: u.cookie, body: { action: 'reset' }, headers: evil })).status).toBe(403);
    expect((await call('/api/me', { cookie: u.cookie })).json.progress.progress.renkler.lesson).toBe(true);
    const own = await call('/api/progress', { cookie: u.cookie, body: { action: 'reset' }, headers: { Origin: BASE, 'Sec-Fetch-Site': 'same-origin' } });
    expect(own.status).toBe(200);
    expect((await call('/api/me', { cookie: u.cookie })).json.progress.progress.renkler).toBeUndefined();
  });
});

describe('şifre değişince diğer oturumlar kapanır', () => {
  it('başka cihazdaki oturum düşer, şifreyi değiştiren cihaz açık kalır', async () => {
    const other = await makeUser('pw');
    // Diğer cihaz önce kullanılır (sunucu oturumu bellekte tutar; o da temizlenmeli)
    expect((await call('/api/me', { cookie: other.cookie })).json.user).toMatchObject({ id: other.id });
    const login = await call('/api/auth/login', { body: { email: mail('pw'), password: PASS } });
    expect(login.status).toBe(200);
    const here = login.cookie!;
    // Yalnızca ad değişince oturumlar kapanmaz
    expect((await call('/api/account', { method: 'PATCH', cookie: here, body: { name: 'Güvenlik Yeni' } })).status).toBe(200);
    expect((await call('/api/me', { cookie: other.cookie })).json.user).toMatchObject({ id: other.id });
    const r = await call('/api/account', { method: 'PATCH', cookie: here, body: { currentPassword: PASS, newPassword: 'yeni-sifre-456' } });
    expect(r.status).toBe(200);
    expect((await call('/api/me', { cookie: other.cookie })).json.user).toBeNull();
    expect((await call('/api/me', { cookie: here })).json.user).toMatchObject({ id: other.id, name: 'Güvenlik Yeni' });
    expect((await call('/api/auth/login', { body: { email: mail('pw'), password: 'yeni-sifre-456' } })).status).toBe(200);
  });
});

describe('toplu kayıtlar', () => {
  const question = (i: number) => ({ t: 'mc', q: 'Soru ' + i, options: ['a', 'b'], a: 'a' });

  it('misafir hataları tek seferde aktarılır; aynı soru tekrar gelince sayısı artar; 500 sınırı korunur', async () => {
    const u = await makeUser('mistakes');
    const items = Array.from({ length: 120 }, (_, i) => ({ mkey: `renkler:${RUN}:${i}`, topicId: 'renkler', question: question(i), count: 1 }));
    expect((await call('/api/mistakes', { cookie: u.cookie, body: { action: 'merge', items } })).status).toBe(200);
    const again = items.slice(0, 2).map((x) => ({ ...x, count: 3 }));
    expect((await call('/api/mistakes', { cookie: u.cookie, body: { action: 'merge', items: again } })).status).toBe(200);
    let list = (await call('/api/me', { cookie: u.cookie })).json.mistakes as { mkey: string; count: number }[];
    expect(list.length).toBe(120);
    expect(list.find((x) => x.mkey === items[0].mkey)?.count).toBe(4);
    expect(list.find((x) => x.mkey === items[5].mkey)?.count).toBe(1);
    const more = Array.from({ length: 450 }, (_, i) => ({ mkey: `sayilar:${RUN}:${i}`, topicId: 'sayilar', question: question(i), count: 1 }));
    expect((await call('/api/mistakes', { cookie: u.cookie, body: { action: 'merge', items: more } })).status).toBe(200);
    list = (await call('/api/me', { cookie: u.cookie })).json.mistakes;
    expect(list.length).toBe(500);
    // Tek hata ekleme de aynı yoldan geçer
    expect((await call('/api/mistakes', { cookie: u.cookie, body: { action: 'add', mkey: `renkler:${RUN}:yeni`, topicId: 'renkler', question: question(999) } })).status).toBe(200);
    list = (await call('/api/me', { cookie: u.cookie })).json.mistakes;
    expect(list.length).toBe(500);
    expect(list.some((x) => x.mkey === `renkler:${RUN}:yeni`)).toBe(true);
  });

  it('misafir ilerlemesi tek seferde aktarılır: en iyi skor korunur, denemeler ve gün sayıları toplanır', async () => {
    const u = await makeUser('progress');
    const first = {
      progress: {
        renkler: { lesson: true, acts: { '1': { best: 0.5, done: false, tries: 2 }, '2': { best: 0.9, done: true, tries: 1 } } },
        sayilar: { lesson: false, acts: { '3': { best: 0.7, done: true, tries: 1 } } }
      },
      last: 'sayilar', days: ['2026-01-01', '2026-01-02'], counts: { '2026-01-01': 3 }
    };
    expect((await call('/api/progress', { cookie: u.cookie, body: { action: 'merge', state: first } })).status).toBe(200);
    const second = { progress: { renkler: { lesson: false, acts: { '1': { best: 0.8, done: true, tries: 1 }, '2': { best: 0.1, done: false, tries: 1 } } } }, days: ['2026-01-01'] };
    expect((await call('/api/progress', { cookie: u.cookie, body: { action: 'merge', state: second } })).status).toBe(200);
    const p = (await call('/api/me', { cookie: u.cookie })).json.progress;
    expect(p.progress.renkler.lesson).toBe(true);
    expect(p.progress.renkler.acts['1']).toMatchObject({ best: 0.8, done: true, tries: 3 });
    expect(p.progress.renkler.acts['2']).toMatchObject({ best: 0.9, done: true, tries: 2 });
    expect(p.progress.sayilar.lesson).toBe(false);
    expect(p.progress.sayilar.acts['3']).toMatchObject({ best: 0.7, done: true, tries: 1 });
    expect(p.last).toBe('sayilar');
    expect(p.days).toEqual(['2026-01-01', '2026-01-02']);
    expect(p.counts).toMatchObject({ '2026-01-01': 4, '2026-01-02': 1 });
  });

  it('liste cevapları tek sorguda yazılır ve sırayla uygulanmış gibi sonuç verir', async () => {
    const u = await makeUser('answers');
    const items = ['كِتَاب', 'قَلَم', 'بَيْت'].map((ar, i) => ({ ar, tl: 't' + i, tr: 'anlam ' + i }));
    const id = (await call('/api/lists', { cookie: u.cookie, body: { title: 'Cevaplar', items } })).json.id;
    const [a, b, c] = (await call(`/api/lists/${id}`, { cookie: u.cookie })).json.list.items as { id: number }[];
    // a: doğru, doğru, yanlış, doğru  b: doğru, doğru  c: yanlış
    const results = [[a, true], [b, true], [a, true], [c, false], [a, false], [b, true], [a, true]].map(([x, ok]) => ({ id: (x as { id: number }).id, ok }));
    expect((await call(`/api/lists/${id}/study`, { cookie: u.cookie, body: { action: 'answers', results } })).status).toBe(200);
    // Başka listenin kelimesi etkilenmez
    const otherId = (await call('/api/lists', { cookie: u.cookie, body: { title: 'Başka', items: [{ ar: 'بَاب', tl: 'bab', tr: 'kapı' }] } })).json.id;
    const otherItem = (await call(`/api/lists/${otherId}`, { cookie: u.cookie })).json.list.items[0];
    expect((await call(`/api/lists/${id}/study`, { cookie: u.cookie, body: { action: 'answers', results: [{ id: otherItem.id, ok: true }, { id: b.id, ok: false }] } })).status).toBe(200);
    const got = (await call(`/api/lists/${id}`, { cookie: u.cookie })).json.list.items as { id: number; correct: number; wrong: number; streak: number }[];
    const of = (x: { id: number }) => got.find((g) => g.id === x.id);
    expect(of(a)).toMatchObject({ correct: 3, wrong: 1, streak: 1 });
    expect(of(b)).toMatchObject({ correct: 2, wrong: 1, streak: 0 });
    expect(of(c)).toMatchObject({ correct: 0, wrong: 1, streak: 0 });
    expect((await call(`/api/lists/${otherId}`, { cookie: u.cookie })).json.list.items[0]).toMatchObject({ correct: 0, wrong: 0, streak: 0 });
  });

  it('liste kaydı: yeri değişen kelimenin çalışma durumu ve düzeltme zamanı korunur; değişen, eklenen ve silinen doğru yazılır', async () => {
    const u = await makeUser('save');
    const items = ['كِتَاب', 'قَلَم', 'بَيْت', 'بَاب', 'مَاء'].map((ar, i) => ({ ar, tl: 't' + i, tr: 'anlam ' + i, note: '' }));
    const id = (await call('/api/lists', { cookie: u.cookie, body: { title: 'Toplu kayıt', items } })).json.id;
    const list = (await call(`/api/lists/${id}`, { cookie: u.cookie })).json.list.items as { id: number; ar: string; tl: string; tr: string; note: string }[];
    const [a, b, c, d, e] = list;
    await call(`/api/lists/${id}/study`, { cookie: u.cookie, body: { action: 'answers', results: [{ id: a.id, ok: true }, { id: a.id, ok: true }] } });
    const times = async () => new Map((await db.query<mysql.RowDataPacket[]>('SELECT id, updated_at FROM word_list_items WHERE list_id = ?', [id]))[0].map((r) => [r.id as number, new Date(r.updated_at).getTime()]));
    const before = await times();
    await new Promise((r) => setTimeout(r, 30));
    const pick = (x: typeof a) => ({ id: x.id, ar: x.ar, tl: x.tl, tr: x.tr, note: x.note });
    // e başa geçer, b silinir, d'nin anlamı değişir, sona yeni kelime eklenir
    const save = [pick(e), pick(a), pick(c), { ...pick(d), tr: 'yeni anlam' }, { ar: 'شَمْس', tl: 'şems', tr: 'güneş', note: '' }];
    expect((await call(`/api/lists/${id}`, { method: 'PUT', cookie: u.cookie, body: { title: 'Toplu kayıt', items: save } })).status).toBe(200);
    const got = (await call(`/api/lists/${id}`, { cookie: u.cookie })).json.list.items as { id: number; ar: string; tr: string; correct: number; streak: number }[];
    expect(got.map((x) => x.ar)).toEqual([e.ar, a.ar, c.ar, d.ar, 'شَمْس']);
    expect(got[1]).toMatchObject({ id: a.id, correct: 2, streak: 2 });
    expect(got[3]).toMatchObject({ id: d.id, tr: 'yeni anlam' });
    expect(got.some((x) => x.id === b.id)).toBe(false);
    const after = await times();
    // Yalnızca yeri değişenlerin düzeltme zamanı aynı kalır (kopyalara "düzeltildi" önerisi bu zamana göre çıkar)
    expect(after.get(a.id)).toBe(before.get(a.id));
    expect(after.get(e.id)).toBe(before.get(e.id));
    expect(after.get(d.id)!).toBeGreaterThan(before.get(d.id)!);
  });
});

describe('rozet: lig ilk üçü', () => {
  it('biten haftalarda ilk üçe girme sayısı veritabanında doğru hesaplanır (eşit puan, gizli ad, bu hafta ve eski haftalar)', async () => {
    const [p1, p2, p3, p4, p5] = await Promise.all(['l1', 'l2', 'l3', 'l4', 'l5'].map((n) => makeUser(n, { hidden: n === 'l5' })));
    const thisWeek = weekStart(trDay());
    const w1 = addDays(thisWeek, -7), w2 = addDays(thisWeek, -14);
    // Gerçek kullanıcılar günde en fazla 1000 puan alabildiği için test puanları onları geçer
    const rows: [number, string, number][] = [
      // Geçen hafta: p1 birinci, p2 ve p3 eşit ikinci, p4 dördüncü; p5 en yüksek ama adını gizlemiş (sayılmaz)
      [p1.id, addDays(w1, 2), 100000], [p2.id, addDays(w1, 1), 90000], [p3.id, addDays(w1, 3), 90000], [p4.id, addDays(w1, 4), 80000], [p5.id, addDays(w1, 2), 200000],
      // İki hafta önce: p4 iki günde toplam 100000 ile birinci, p1 ikinci
      [p4.id, addDays(w2, 0), 50000], [p4.id, addDays(w2, 6), 50000], [p1.id, addDays(w2, 3), 60000],
      // Bu hafta (henüz bitmedi) ve 27 hafta önce (pencere dışında) sayılmaz
      [p4.id, thisWeek, 500000], [p4.id, addDays(thisWeek, -7 * 27), 100000]
    ];
    await db.query('INSERT INTO xp_log (user_id, day, xp) VALUES ?', [rows]);
    const stats = async (u: { cookie: string }) => (await call('/api/stats', { cookie: u.cookie })).json as { podiums: number; xp: number };
    expect((await stats(p1)).podiums).toBe(2);
    expect((await stats(p2)).podiums).toBe(1);
    expect((await stats(p3)).podiums).toBe(1);
    expect(await stats(p4)).toMatchObject({ podiums: 1, xp: 780000 });
    expect((await stats(p5)).podiums).toBe(0);
  });
});
