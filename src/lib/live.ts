import 'server-only';
import { randomBytes, randomInt } from 'node:crypto';
import { saveLiveResult } from './live-history';
import type { LiveReport } from './live-report';
import { mcQ, pickDir, type Dir, type ListItem } from './study';
import { shuffle } from './text';

/* Canlı yarışma: öğretmen bir ders ya da listeden yarışma açar, öğrenciler PIN ile (hesapsız) katılır.
   Oyunlar sunucu belleğinde tutulur (tek sunucu); sunucu yeniden başlarsa süren yarışmalar biter.
   Tarayıcılar durumu saniyede bir sorar; her değişiklikte sürüm (v) artar. */

export type Side = 'ar' | 'tr';
export type LiveQuestion = { prompt: string; promptTl: string; side: Side; options: string[]; correct: number; say: string };
type Answer = { choice: number; ms: number; points: number; ok: boolean };
// shown: her sorunun bu öğrencinin telefonuna ilk ulaştığı an (puan süresi buradan sayılır)
type Player = { id: string; key: string; name: string; score: number; streak: number; answers: Map<number, Answer>; shown: Map<number, number>; seenAt: number };
export type Phase = 'lobby' | 'question' | 'reveal' | 'board' | 'end';
type Game = {
  code: string; hostKey: string; title: string; seconds: number;
  questions: LiveQuestion[]; phase: Phase; q: number; startedAt: number; endsAt: number;
  players: Map<string, Player>; kicked: Set<string>; v: number; createdAt: number; touchedAt: number;
  /** Giriş yapmış öğretmen: yarışma bitince sonuçları geçmişine yazılır */
  hostUserId: number | null; firstAt: number; endedAt: number; saved: boolean;
};

export const LIVE = { maxPlayers: 80, maxGames: 500, idleMs: 3 * 3600_000, nameMax: 20 };

const g = globalThis as unknown as { __arbLive?: Map<string, Game> };
const games = (g.__arbLive ??= new Map<string, Game>());

function sweep() {
  const now = Date.now();
  for (const [code, x] of games) if (now - x.touchedAt > LIVE.idleMs) games.delete(code);
}
const token = () => randomBytes(12).toString('base64url');
const bump = (x: Game) => { x.v++; x.touchedAt = Date.now(); };

/** Soru üretimi: her soruda dört seçenek, yanlışlar aynı kelime havuzundan */
export function buildQuestions(words: { ar: string; tl: string; tr: string }[], count: number, dir: Dir): LiveQuestion[] {
  const items: ListItem[] = words.map((w, i) => ({ id: i + 1, ar: w.ar, tl: w.tl, tr: w.tr, note: '', starred: false, correct: 0, wrong: 0, streak: 0 }));
  return shuffle(items).slice(0, count).map((it) => {
    const q = mcQ(it, items, dir === 'mix' ? pickDir('mix') : dir, 4);
    const ansSide: Side = q.dir === 'ar' ? 'tr' : 'ar';
    return {
      prompt: q.dir === 'ar' ? it.ar : it.tr, promptTl: q.dir === 'ar' ? it.tl : '', side: q.dir,
      options: q.options.map((o) => (ansSide === 'ar' ? o.ar : o.tr)), correct: q.options.findIndex((o) => o.id === it.id), say: it.ar
    };
  });
}

export function createGame(title: string, questions: LiveQuestion[], seconds: number, hostUserId: number | null = null) {
  sweep();
  if (games.size >= LIVE.maxGames) return null;
  let code = '';
  do code = String(randomInt(100000, 1000000)); while (games.has(code));
  const now = Date.now();
  const game: Game = { code, hostKey: token(), title, seconds, questions, phase: 'lobby', q: -1, startedAt: 0, endsAt: 0, players: new Map(), kicked: new Set(), v: 1, createdAt: now, touchedAt: now, hostUserId, firstAt: 0, endedAt: 0, saved: false };
  games.set(code, game);
  return { code, hostKey: game.hostKey };
}

const get = (code: string) => {
  const x = games.get(code);
  if (!x) return null;
  advance(x);
  return x;
};

/** Süre dolduysa ya da herkes cevapladıysa soruyu kapatır (her okumada tembel olarak) */
function advance(x: Game) {
  if (x.phase !== 'question') return;
  const all = x.players.size > 0 && [...x.players.values()].every((p) => p.answers.has(x.q));
  if (Date.now() >= x.endsAt || all) { x.phase = 'reveal'; bump(x); }
}

function ranking(x: Game) {
  return [...x.players.values()].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'tr'));
}

/* ---------- Katılım ve cevap ---------- */

export function join(code: string, rawName: string) {
  const x = get(code);
  if (!x) return { error: 'Bu PIN ile süren bir yarışma yok.' };
  if (x.phase === 'end') return { error: 'Bu yarışma bitti.' };
  if (x.players.size >= LIVE.maxPlayers) return { error: 'Yarışma dolu.' };
  let name = rawName.replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, LIVE.nameMax);
  if (!name) return { error: 'Bir ad yaz.' };
  // Aynı ad varsa sonuna sayı eklenir
  const taken = new Set([...x.players.values()].map((p) => p.name.toLocaleLowerCase('tr')));
  if (taken.has(name.toLocaleLowerCase('tr'))) { let i = 2; while (taken.has(`${name} ${i}`.toLocaleLowerCase('tr'))) i++; name = `${name} ${i}`; }
  const p: Player = { id: token(), key: token(), name, score: 0, streak: 0, answers: new Map(), shown: new Map(), seenAt: Date.now() };
  x.players.set(p.id, p);
  bump(x);
  return { pid: p.id, pkey: p.key, name };
}

function player(x: Game, pid: string, pkey: string) {
  const p = x.players.get(pid);
  return p && p.key === pkey ? p : null;
}

export function answer(code: string, pid: string, pkey: string, q: number, choice: number) {
  const x = get(code);
  if (!x) return { error: 'Yarışma bulunamadı.' };
  const p = player(x, pid, pkey);
  if (!p) return { error: 'Yarışmadan çıkarıldın.' };
  if (x.phase !== 'question' || x.q !== q) return { error: 'Bu sorunun süresi doldu.' };
  if (p.answers.has(q)) return { ok: true };
  const qq = x.questions[q];
  // Süre, soru öğrencinin telefonunda göründüğü andan sayılır: durum saniyede bir sorulduğu ve bağlantı hızı
  // farklı olduğu için soru telefonlara farklı anlarda ulaşır; aynı hızda cevaplayan iki öğrenci aynı puanı alsın
  const from = p.shown.get(q) ?? x.startedAt;
  const ms = Math.min(x.seconds * 1000, Math.max(0, Date.now() - from));
  const ok = choice === qq.correct;
  // Doğru cevap: hıza göre 500 ile 1000 arası, art arda doğrularda 100 puan ek (en fazla 500)
  p.streak = ok ? p.streak + 1 : 0;
  const points = ok ? Math.round(1000 - 500 * Math.min(1, ms / (x.seconds * 1000))) + Math.min(5, p.streak - 1) * 100 : 0;
  p.score += points;
  p.answers.set(q, { choice, ms, points, ok });
  bump(x);
  advance(x);
  return { ok: true };
}

/* ---------- Öğretmen ---------- */

export type HostAction = 'start' | 'next' | 'skip' | 'kick' | 'end';
export function host(code: string, key: string, action: HostAction, pid?: string) {
  const x = get(code);
  if (!x || x.hostKey !== key) return { error: 'Yarışma bulunamadı.' };
  const now = Date.now();
  const ask = (i: number) => { x.phase = 'question'; x.q = i; x.startedAt = now; x.endsAt = now + x.seconds * 1000; if (!x.firstAt) x.firstAt = now; };
  switch (action) {
    case 'start':
      if (x.phase !== 'lobby') break;
      if (!x.players.size) return { error: 'Önce en az bir öğrenci katılmalı.' };
      ask(0);
      break;
    case 'skip':
      if (x.phase === 'question') x.phase = 'reveal';
      break;
    case 'next':
      // Cevaptan sonra sıralama (son soruda bitiş); sıralamadan sonra sıradaki soru
      if (x.phase === 'reveal') {
        x.phase = x.q + 1 >= x.questions.length ? 'end' : 'board';
        if (x.phase === 'end') finish(x);
      } else if (x.phase === 'board') ask(x.q + 1);
      break;
    case 'kick':
      if (pid && x.players.delete(pid)) x.kicked.add(pid);
      break;
    case 'end':
      x.phase = 'end';
      finish(x);
      break;
  }
  bump(x);
  advance(x);
  return { ok: true };
}

/* ---------- Görünümler ---------- */

const remaining = (x: Game) => (x.phase === 'question' ? Math.max(0, x.endsAt - Date.now()) : 0);

export function hostView(code: string, key: string) {
  const x = get(code);
  if (!x || x.hostKey !== key) return null;
  const qq = x.questions[x.q];
  const showAnswer = x.phase === 'reveal';
  const rank = ranking(x);
  return {
    v: x.v, code: x.code, title: x.title, phase: x.phase, q: x.q, total: x.questions.length, seconds: x.seconds, remaining: remaining(x),
    question: qq && x.phase !== 'board' ? { prompt: qq.prompt, promptTl: qq.promptTl, side: qq.side, options: qq.options, say: qq.say, correct: showAnswer || x.phase === 'end' ? qq.correct : null } : null,
    answered: qq ? [...x.players.values()].filter((p) => p.answers.has(x.q)).length : 0,
    counts: showAnswer && qq ? qq.options.map((_, i) => [...x.players.values()].filter((p) => p.answers.get(x.q)?.choice === i).length) : null,
    players: rank.map((p) => ({ id: p.id, name: p.name, score: p.score, streak: p.streak, last: p.answers.get(x.q)?.points ?? null })),
    report: x.phase === 'end' ? buildReport(x) : null,
    saved: x.saved
  };
}

export function playerView(code: string, pid: string, pkey: string) {
  const x = get(code);
  if (!x) return { gone: true as const };
  const p = player(x, pid, pkey);
  if (!p) return { kicked: x.kicked.has(pid), gone: !x.kicked.has(pid) } as const;
  p.seenAt = Date.now();
  if (x.phase === 'question' && !p.shown.has(x.q)) p.shown.set(x.q, p.seenAt);
  const qq = x.questions[x.q];
  const mine = p.answers.get(x.q) ?? null;
  const rank = ranking(x);
  const place = rank.findIndex((r) => r.id === p.id) + 1;
  const showQ = x.phase === 'question' || x.phase === 'reveal';
  return {
    v: x.v, title: x.title, phase: x.phase, q: x.q, total: x.questions.length, seconds: x.seconds, remaining: remaining(x),
    name: p.name, score: p.score, streak: p.streak, place, players: x.players.size,
    question: showQ && qq ? { prompt: qq.prompt, promptTl: qq.promptTl, side: qq.side, options: qq.options, correct: x.phase === 'reveal' ? qq.correct : null } : null,
    answer: mine && showQ ? { choice: mine.choice, ok: x.phase === 'reveal' ? mine.ok : null, points: x.phase === 'reveal' ? mine.points : null } : null,
    podium: x.phase === 'end' ? rank.slice(0, 3).map((r) => ({ name: r.name, score: r.score })) : null
  };
}

/** PIN sayfası için: yarışma var mı, katılınabilir mi */
export function peek(code: string) {
  const x = get(code);
  return x ? { title: x.title, phase: x.phase, players: x.players.size, joinable: x.phase !== 'end' && x.players.size < LIVE.maxPlayers } : null;
}

/** Yönetim paneli için özet */
export function liveSummary() {
  sweep();
  return [...games.values()].map((x) => ({ code: x.code, title: x.title, phase: x.phase, q: x.q, total: x.questions.length, players: x.players.size, createdAt: x.createdAt }));
}

/* ---------- Sonuç raporu ---------- */

/** Sorulan sorular (yarışma erken bitirildiyse yalnızca gelenler) ve her öğrencinin cevapları */
export function buildReport(x: Game): LiveReport {
  const asked = x.phase === 'end' ? x.questions.slice(0, Math.max(0, x.q + 1)) : x.questions.slice(0, x.q);
  const players = ranking(x);
  const avg = (ms: number[]) => (ms.length ? Math.round(ms.reduce((a, b) => a + b, 0) / ms.length) : null);
  return {
    title: x.title, code: x.code, seconds: x.seconds, startedAt: x.firstAt || x.createdAt, endedAt: x.endedAt || Date.now(),
    questions: asked.map((q, i) => {
      const ans = players.map((p) => p.answers.get(i)).filter((a): a is Answer => !!a);
      return {
        prompt: q.prompt, side: q.side, options: q.options, correct: q.correct,
        counts: q.options.map((_, j) => ans.filter((a) => a.choice === j).length),
        right: ans.filter((a) => a.ok).length, answered: ans.length, avgMs: avg(ans.map((a) => a.ms))
      };
    }),
    players: players.map((p) => {
      const answers = asked.map((_, i) => p.answers.get(i) ?? null);
      const given = answers.filter((a): a is Answer => !!a);
      return {
        name: p.name, score: p.score, right: given.filter((a) => a.ok).length, wrong: given.filter((a) => !a.ok).length,
        blank: answers.length - given.length, avgMs: avg(given.map((a) => a.ms)), answers
      };
    })
  };
}

/** Yarışma bitti: giriş yapmış öğretmen varsa sonuçlar bir kez kaydedilir */
function finish(x: Game) {
  if (!x.endedAt) x.endedAt = Date.now();
  if (!x.hostUserId || x.saved || !x.players.size || x.q < 0) return;
  x.saved = true;
  saveLiveResult(x.hostUserId, buildReport(x)).catch((e) => {
    x.saved = false;
    console.error('Yarışma sonucu kaydedilemedi:', (e as Error).message);
  });
}
