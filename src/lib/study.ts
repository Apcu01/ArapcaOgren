/* Kelime listeleri: çalışma modlarının ortak mantığı (tarayıcıda ve sunucuda çalışır) */
import { normAr, normTr, shuffle } from './text';
import { sameSound } from './translit';

export type ListItem = {
  id: number; ar: string; tl: string; tr: string; note: string;
  starred: boolean; correct: number; wrong: number; streak: number;
};
export type ListSummary = { id: number; title: string; description: string; count: number; learned: number; learning: number; studiedAt: string | null; updatedAt: string };
export type WordList = { id: number; title: string; description: string; best: Partial<Record<GameKey, number>>; shareToken: string | null; copies: number; items: ListItem[] };
/** Paylaşılan liste: yalnızca kelimeler, sahibinin çalışma durumu yok */
export type SharedList = { title: string; description: string; owner: string; count: number; items: Pick<ListItem, 'ar' | 'tl' | 'tr' | 'note'>[] };
export type GameKey = 'match' | 'blast' | 'blocks' | 'charms';

export const LIST_MAX_ITEMS = 300;
export const LISTS_MAX = 100;

/* ---------- Kelime durumu (Quizlet'teki gibi son iki cevaba göre) ---------- */
export type Status = 'new' | 'learning' | 'learned';
export function statusOf(it: Pick<ListItem, 'correct' | 'wrong' | 'streak'>): Status {
  if (it.streak >= 2) return 'learned';
  return it.correct + it.wrong > 0 ? 'learning' : 'new';
}
export const STATUS_LABEL: Record<Status, string> = { new: 'Çalışılmamış', learning: 'Öğrenmeye devam edilenler', learned: 'Öğrenilenler' };

/* ---------- Modlar ---------- */
export const MODES = [
  { key: 'kartlar', name: 'Kartlar', desc: 'Kartı çevir, anlamını hatırla', icon: 'cards' },
  { key: 'ogren', name: 'Öğren', desc: 'Adım adım, bilmediklerin daha sık sorulur', icon: 'learn' },
  { key: 'test', name: 'Test', desc: 'Karışık sorularla kendini sına', icon: 'test' },
  { key: 'eslestir', name: 'Eşleştir', desc: 'Çiftleri en kısa sürede bul', icon: 'pairs' },
  { key: 'blast', name: 'Blast', desc: 'Doğru cevabı taşıyan göktaşını vur', icon: 'rocket' },
  { key: 'bloklar', name: 'Bloklar', desc: 'Doğru cevapla blok kazan, satırları doldur', icon: 'blocks' },
  { key: 'tilsim', name: 'Tılsım', desc: 'Tılsımları diz, sorularla hamle kazan', icon: 'gem' }
] as const;
export type ModeKey = (typeof MODES)[number]['key'];

/* ---------- Yön ---------- */
/** ar: Arapça sorulur, Türkçe cevaplanır; tr: tersi; mix: karışık */
export type Dir = 'ar' | 'tr' | 'mix';
export const DIR_LABEL: Record<Dir, string> = { ar: 'Arapça → Türkçe', tr: 'Türkçe → Arapça', mix: 'Karışık' };
export const pickDir = (d: Dir): 'ar' | 'tr' => (d === 'mix' ? (Math.random() < 0.5 ? 'ar' : 'tr') : d);

/* ---------- Cevap kontrolü ---------- */
/** "kitap, defter (çoğul)" -> ["kitap", "defter"] */
export function meanings(tr: string) {
  return tr.replace(/\([^)]*\)/g, ' ').split(/[,;/]| veya /).map((s) => s.trim()).filter(Boolean);
}
const trKey = (s: string) => normTr(s).replace(/[.!?'"]/g, '').replace(/\s+/g, ' ').trim();
const arKey = (s: string) => normAr(s).replace(/[؟،؛.!?,:;"'()]/g, '').replace(/\s+/g, '').trim();

function lev(a: string, b: string) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

export type Grade = 'right' | 'almost' | 'wrong';
/** Türkçe anlam yazıldıysa: anlamlardan biri; küçük yazım hatası (5+ harfte 1 harf) "neredeyse" sayılır */
export function gradeTr(input: string, tr: string): Grade {
  const a = trKey(input);
  if (!a) return 'wrong';
  const opts = [trKey(tr), ...meanings(tr).map(trKey)];
  if (opts.includes(a)) return 'right';
  if (opts.some((o) => o.length >= 5 && lev(o, a) <= 1)) return 'almost';
  return 'wrong';
}
/** Arapça cevap: harekesiz yazım ya da Latin harfli okunuş kabul edilir */
export function gradeAr(input: string, it: Pick<ListItem, 'ar' | 'tl'>): Grade {
  const s = input.trim();
  if (!s) return 'wrong';
  if (/[؀-ۿ]/.test(s)) return arKey(s) === arKey(it.ar) ? 'right' : 'wrong';
  if (it.tl && sameSound(s, it.tl)) return 'right';
  if (it.tl && trKey(it.tl).length >= 5 && lev(trKey(s), trKey(it.tl)) <= 1) return 'almost';
  return 'wrong';
}

/* ---------- Soru üretimi ---------- */
export type Side = 'ar' | 'tr';
export type McQ = { kind: 'mc'; item: ListItem; dir: Side; options: ListItem[] };
export type WriteQ = { kind: 'write'; item: ListItem; dir: Side };
export type TfQ = { kind: 'tf'; item: ListItem; dir: Side; shown: ListItem; truth: boolean };
export type MatchQ = { kind: 'match'; dir: Side; items: ListItem[]; answers: ListItem[] };
export type Q = McQ | WriteQ | TfQ | MatchQ;

/** Yanlış seçenekler: aynı listeden, aynı anlamı taşımayanlar */
export function distractors(item: ListItem, pool: ListItem[], n: number) {
  const seen = new Set([trKey(item.tr), arKey(item.ar)]);
  const out: ListItem[] = [];
  for (const x of shuffle(pool)) {
    if (out.length >= n) break;
    if (x.id === item.id || seen.has(trKey(x.tr)) || seen.has(arKey(x.ar))) continue;
    seen.add(trKey(x.tr)); seen.add(arKey(x.ar));
    out.push(x);
  }
  return out;
}
export function mcQ(item: ListItem, pool: ListItem[], dir: Dir, n = 4): McQ {
  return { kind: 'mc', item, dir: pickDir(dir), options: shuffle([item, ...distractors(item, pool, n - 1)]) };
}
export function tfQ(item: ListItem, pool: ListItem[], dir: Dir): TfQ {
  const other = distractors(item, pool, 1)[0];
  const truth = !other || Math.random() < 0.5;
  return { kind: 'tf', item, dir: pickDir(dir), shown: truth ? item : other, truth };
}

/** Sorulan yüz (prompt) ve cevap yüzü */
export const promptOf = (it: ListItem, dir: Side) => (dir === 'ar' ? it.ar : it.tr);
export const answerOf = (it: ListItem, dir: Side) => (dir === 'ar' ? it.tr : it.ar);
export const grade = (input: string, it: ListItem, dir: Side): Grade => (dir === 'ar' ? gradeTr(input, it.tr) : gradeAr(input, it));

/** Test: istenen türlere dağıtılmış sorular */
export type TestTypes = { tf: boolean; mc: boolean; match: boolean; write: boolean };
export function buildTest(items: ListItem[], count: number, types: TestTypes, dir: Dir): Q[] {
  const picked = shuffle(items).slice(0, Math.min(count, items.length));
  let kinds = (Object.keys(types) as (keyof TestTypes)[]).filter((k) => types[k]);
  // Eşleştirme bölümü en az 3 kelimeyle anlamlı
  if (kinds.length > 1 && Math.ceil(picked.length / kinds.length) < 3) kinds = kinds.filter((k) => k !== 'match');
  if (!kinds.length || !picked.length) return [];
  const per = Math.ceil(picked.length / kinds.length);
  const out: Q[] = [];
  kinds.forEach((k, n) => {
    const take = picked.slice(n * per, (n + 1) * per);
    if (k !== 'match') {
      for (const it of take) out.push(k === 'tf' ? tfQ(it, items, dir) : k === 'mc' ? mcQ(it, items, dir) : { kind: 'write', item: it, dir: pickDir(dir) });
      return;
    }
    // 5'erli gruplar; tek kalan kelime çoktan seçmeli sorulur
    for (let j = 0; j < take.length; j += 5) {
      const g = take.slice(j, j + 5);
      if (g.length < 2) out.push(mcQ(g[0], items, dir));
      else out.push({ kind: 'match', dir: pickDir(dir), items: g, answers: shuffle(g) });
    }
  });
  return out;
}

/* ---------- Öğren modu ---------- */
/** Her kelimenin aşaması: 0 yeni, 1 tanıdık (seçmeli doğru), 2 öğrenildi (yazarak ya da ikinci kez doğru) */
export type LearnState = Record<number, 0 | 1 | 2>;
export const ROUND_SIZE = 7;
export function nextRound(items: ListItem[], st: LearnState) {
  const left = items.filter((it) => (st[it.id] ?? 0) < 2);
  // Önce tanıdık olanlar (bitirmeye yakın), sonra yeniler; kendi içinde karışık
  const fam = shuffle(left.filter((it) => st[it.id] === 1));
  const neu = shuffle(left.filter((it) => !st[it.id]));
  return [...fam, ...neu].slice(0, ROUND_SIZE);
}

/** Süre biçimi: 12,3 sn ya da 1:05,2 */
export function fmtTime(ms: number) {
  const s = ms / 1000;
  if (s < 60) return s.toFixed(1).replace('.', ',') + ' sn';
  const m = Math.floor(s / 60);
  return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0').replace('.', ',')}`;
}
