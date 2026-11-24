import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Yeni özelliklerin API testleri: liste klasör ve etiketleri, görünmez karakter temizliği, Hatalarım kural başlığı,
// Kelime bul harf eşleştirmesi ve canlı yarışmada aynı oyuncularla yeni tur.
// Çalışan sunucu (TEST_BASE_URL) ve .env.local veritabanı gerekir; oluşturulan kayıtlar sonunda silinir.

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const BASE = (process.env.TEST_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const RUN = Date.now().toString(36);
const EMAIL = `apitest-${RUN}-feat@example.com`;
const ANON = `apitest-${RUN}`;
const ZW = String.fromCharCode(0x200b);
let db: mysql.Connection;
let cookie = '';

type Res = { status: number; json: Record<string, unknown> & { [k: string]: unknown }; cookie: string | null };
async function call(path: string, init: { method?: string; body?: unknown; cookie?: string | null } = {}): Promise<Res> {
  const r = await fetch(BASE + path, {
    method: init.method || (init.body ? 'POST' : 'GET'),
    headers: { 'Content-Type': 'application/json', ...(init.cookie ? { Cookie: init.cookie } : {}) },
    body: init.body ? JSON.stringify(init.body) : undefined,
    redirect: 'manual'
  });
  const m = r.headers.get('set-cookie')?.match(/arb_session=([^;]+)/);
  return { status: r.status, json: await r.json().catch(() => ({})), cookie: m && m[1] ? `arb_session=${m[1]}` : null };
}

beforeAll(async () => {
  const ping = await fetch(BASE + '/robots.txt').catch(() => null);
  if (!ping || !ping.ok) throw new Error(`Sunucu çalışmıyor: ${BASE}. Önce "npm run dev" ya da "npm start" çalıştır.`);
  db = await mysql.createConnection({ uri: process.env.DATABASE_URL!, timezone: 'Z' });
  // Kayıt sınırı (IP başına saatte 5) diğer testlerle birlikte takılmasın
  await db.query("DELETE FROM auth_attempts WHERE ip IN ('127.0.0.1', '::1', '::ffff:127.0.0.1')");
  const r = await call('/api/auth/register', { body: { name: 'API Özellik', email: EMAIL, password: 'test-sifre-123' } });
  expect(r.status).toBe(200);
  cookie = r.cookie!;
});

afterAll(async () => {
  if (!db) return;
  await db.query('DELETE FROM users WHERE email = ?', [EMAIL]);
  await db.query('DELETE FROM lookup_log WHERE anon_id = ?', [ANON]);
  await db.end();
});

describe('liste klasörü, etiketleri ve görünmez karakterler', () => {
  let id = 0;
  it('klasör ve etiketlerle oluşturulur; görünmez karakterler kayıttan önce atılır', async () => {
    const r = await call('/api/lists', { cookie, body: {
      title: 'Ünite' + ZW + ' 1', folder: ' 1. dönem ', tags: ['sınav', 'Sınav', 'fiiller'],
      items: [{ ar: ZW + 'صَعْب', tl: "sa'b", tr: 'zor' + ZW }, { ar: 'سَهْل', tl: 'sehl', tr: 'kolay' }]
    } });
    expect(r.status).toBe(200);
    id = Number(r.json.id);
    const g = await call(`/api/lists/${id}`, { cookie });
    const list = g.json.list as { title: string; folder: string; tags: string[]; items: { ar: string; tr: string }[] };
    expect(list.title).toBe('Ünite 1');
    expect(list.folder).toBe('1. dönem');
    expect(list.tags).toEqual(['sınav', 'fiiller']);
    expect(list.items[0]).toMatchObject({ ar: 'صَعْب', tr: 'zor' });
  });
  it('Listelerim özetinde klasör ve etiketler gelir', async () => {
    const r = await call('/api/lists', { cookie });
    const mine = (r.json.lists as { id: number; folder: string; tags: string[] }[]).find((l) => l.id === id)!;
    expect(mine).toMatchObject({ folder: '1. dönem', tags: ['sınav', 'fiiller'] });
  });
  it('klasör ve etiket gönderilmeden kaydedilirse olduğu gibi kalır; boş gönderilirse temizlenir', async () => {
    const items = [{ ar: 'كِتَاب', tl: 'kitab', tr: 'kitap' }];
    expect((await call(`/api/lists/${id}`, { method: 'PUT', cookie, body: { title: 'Ünite 1', items } })).status).toBe(200);
    let list = (await call(`/api/lists/${id}`, { cookie })).json.list as { folder: string; tags: string[] };
    expect(list).toMatchObject({ folder: '1. dönem', tags: ['sınav', 'fiiller'] });
    await call(`/api/lists/${id}`, { method: 'PUT', cookie, body: { title: 'Ünite 1', folder: '', tags: [], items } });
    list = (await call(`/api/lists/${id}`, { cookie })).json.list as { folder: string; tags: string[] };
    expect(list).toMatchObject({ folder: '', tags: [] });
  });
  it('çok uzun klasör adı ve fazla etiket reddedilir', async () => {
    const items = [{ ar: 'كِتَاب', tr: 'kitap' }];
    expect((await call('/api/lists', { cookie, body: { title: 'x', folder: 'a'.repeat(41), items } })).status).toBe(400);
    expect((await call('/api/lists', { cookie, body: { title: 'x', tags: ['1', '2', '3', '4', '5', '6', '7'], items } })).status).toBe(400);
  });
});

describe('Hatalarım kural başlığı', () => {
  it('sorunun kural başlığı (g) saklanır', async () => {
    const q = { t: 'mc', q: 'Fiile uygun zamiri seç', ar: '___ يَكْتُبُونَ', options: ['هُمْ', 'هُوَ'], a: 'هُمْ', g: 'fiil' };
    expect((await call('/api/mistakes', { cookie, body: { action: 'add', mkey: `zamirler:${RUN}`, topicId: 'zamirler', question: q } })).status).toBe(200);
    const [[u]] = await db.query<mysql.RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [EMAIL]);
    const [[m]] = await db.query<mysql.RowDataPacket[]>('SELECT question FROM mistakes WHERE user_id = ?', [u.id]);
    const saved = typeof m.question === 'string' ? JSON.parse(m.question) : m.question;
    expect(saved.g).toBe('fiil');
  });
});

describe('Kelime bul: yazılan harfler birebir aranır', () => {
  const find = (q: string) => call('/api/lookup', { body: { q, anonId: ANON } });
  it('şita: سِتَّة değil شِتَاء bulunur', async () => {
    const r = await find('şita');
    expect(r.status).toBe(200);
    expect(r.json.source).toBe('lexicon');
    expect((r.json.results as { ar: string }[]).map((x) => x.ar)).toEqual(['شِتَاء']);
  });
  it('kış: sad ile yazılan قِصَّة önerilmez (misafire yapay zekâ için giriş istenir)', async () => {
    const r = await find('kış');
    expect(r.status).toBe(401);
    expect(r.json.needLogin).toBe(true);
  });
  it('harekeleri farklı yazımda aynı harflerle yazılan kelimeler "yakın" olarak gelir', async () => {
    const r = await find('uhavile');
    expect(r.json.source).toBe('lexicon');
    expect(r.json.match).toBe('near');
    expect((r.json.results as { ar: string }[]).map((x) => x.ar)).toContain('حَاوَلَ');
  });
  it('tam eşleşme azsa harekesi farklı kelime işaretli eklenir', async () => {
    const r = await find('hubz');
    const res = r.json.results as { ar: string; near?: boolean }[];
    expect(res[0]).toMatchObject({ ar: 'خُبْز' });
    expect(res[0].near).toBeUndefined();
    expect(res.find((x) => x.ar === 'خَبَّاز')?.near).toBe(true);
  });
});

describe('canlı yarışma: aynı oyuncularla yeniden oyna', () => {
  it('bitişten sonra yeni tur: puanlar sıfırlanır, öğrenci kod girmeden bekleme ekranına döner', async () => {
    const c = await call('/api/live', { body: { source: { type: 'topic', id: 'renkler' }, count: 3, seconds: 10, dir: 'ar' } });
    expect(c.status).toBe(200);
    const { code, hostKey } = c.json as unknown as { code: string; hostKey: string };
    const host = (action: string) => call(`/api/live/${code}`, { body: { action, k: hostKey } });
    const hostView = async () => (await call(`/api/live/${code}?k=${hostKey}`)).json as { round: number; phase: string; q: number; players: { name: string; score: number }[]; question: { options: string[] } | null };
    const j = await call(`/api/live/${code}`, { body: { action: 'join', name: 'Zeynep' } });
    const { pid, pkey } = j.json as { pid: string; pkey: string };
    const me = async () => (await call(`/api/live/${code}?p=${pid}&pk=${pkey}`)).json as { round: number; phase: string; q: number; score: number };

    // Yeni tur yalnızca bitişten sonra açılır
    expect((await host('again')).status).toBe(200);
    expect((await hostView()).round).toBe(1);

    await host('start');
    expect((await me()).phase).toBe('question');
    // Doğru seçeneği bulmak için öğretmen ekranında cevap yok; her seçeneği sırayla denemek yerine ilkini seç
    await call(`/api/live/${code}`, { body: { action: 'answer', pid, pkey, q: 0, choice: 0 } });
    await host('end');
    expect((await hostView()).phase).toBe('end');

    await me();
    expect((await host('again')).status).toBe(200);
    const h = await hostView();
    expect(h).toMatchObject({ round: 2, phase: 'lobby', q: -1 });
    expect(h.players).toEqual([expect.objectContaining({ name: 'Zeynep', score: 0 })]);
    const p = await me();
    expect(p).toMatchObject({ round: 2, phase: 'lobby', score: 0 });

    // Yeni turda sorular baştan cevaplanabilir
    await host('start');
    expect((await me()).phase).toBe('question');
    const a = await call(`/api/live/${code}`, { body: { action: 'answer', pid, pkey, q: 0, choice: 1 } });
    expect(a.status).toBe(200);
    await host('end');
  });
});
