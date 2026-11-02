/* Kelime bul: "Bu kelime nerede geçiyor?" bağlamı. Tarayıcıda ve sunucuda ortak.
   Bağlam bir yer ya da konu olabilir (teknoloji ünitesi, hastanede, lokantada) ya da kelimenin geçtiği cümle (Arapça da olabilir).
   Sonuçlar, konusu ya da anlamı bağlama uyanlar öne gelecek şekilde sıralanır. */
import { isAr, normAr, searchKey, strip } from './text';

export const CONTEXT_MAX = 120;

/** Konuyu belirtmeyen dolgu sözcükler (ünite, ders, geçiyor...): ekli hâlleri de (ünitesinde) başlangıcına göre atılır */
const STOP_PREFIX = ['unite', 'ders', 'konu', 'bolum', 'kitap', 'kitab', 'kelime', 'geciyor', 'gecen', 'gecti', 'gectig', 'icind', 'ilgili', 'hakkin', 'sayfa', 'cumle', 'metin', 'soyled', 'yaziyor'];
const STOP = new Set(['ile', 'bir', 'icin', 'olan', 'gibi', 'diye', 'dedi', 'yazan', 'the', 'and']);
const isStop = (w: string) => STOP.has(w) || STOP_PREFIX.some((p) => w.startsWith(p));

/** Arapça yazım karşılaştırma anahtarı: harekesiz, "el" takısız */
const arKey = (s: string) => normAr(strip(s)).replace(/[؟?!.،,:;"'()]/g, ' ').replace(/(^|\s)ال/g, '$1').replace(/\s+/g, ' ').trim();

export type ContextTerms = { stems: string[]; ar: string[]; raw: string };

/** Bağlamı köklere ayırır: Türkçe ekleri yok saymak için her sözcüğün ilk 5 harfi (teknolojide = teknoloji) */
export function contextTerms(ctx: string | null | undefined): ContextTerms | null {
  const raw = (ctx || '').replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, CONTEXT_MAX);
  if (!raw) return null;
  const stems = [...new Set(raw.split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w && !isAr(w))
    .map(searchKey)
    .filter((w) => w.length >= 3 && !isStop(w))
    .map((w) => w.slice(0, 5)))];
  const ar = [...new Set(arKey(raw.replace(/[A-Za-zÇĞİÖŞÜçğıöşüâîû0-9]+/g, ' ')).split(' ').filter((w) => w.length >= 2))];
  return stems.length || ar.length ? { stems, ar, raw } : null;
}

/** Arama anahtarı: önbellek ve günlük için (aynı bağlamın farklı yazımları bir sayılır) */
export const contextKey = (t: ContextTerms | null) => (t ? [...t.stems, ...t.ar].sort().join(' ').slice(0, 60) : '');

/**
 * Bir sonucun bağlama uygunluğu (0: uymuyor). fields: konu adı, konu ipuçları, anlam gibi metinler; ar: sonucun Arapça yazımı.
 * Arapça bağlam cümlesinde kelimenin kendisi geçiyorsa güçlü eşleşme sayılır.
 */
export function contextFit(t: ContextTerms | null, fields: (string | undefined | null)[], ar?: string): number {
  if (!t) return 0;
  let score = 0;
  if (t.stems.length) {
    const tokens = fields.filter(Boolean).join(' ').split(/[^\p{L}\p{N}]+/u).map(searchKey).filter((w) => w.length >= 3);
    for (const s of t.stems) if (tokens.some((w) => w.startsWith(s) || (w.length >= 4 && s.startsWith(w)))) score++;
  }
  if (ar && t.ar.length) {
    const k = arKey(ar);
    const kNoTa = k.replace(/[هة]$/, '');
    if (t.ar.some((w) => w === k || (kNoTa.length >= 2 && w.startsWith(kNoTa)))) score += 2;
  }
  return score;
}

/** Bağlama uyanları öne alır (kendi aralarında ve geri kalanlar kendi aralarında eski sırasını korur) */
export function rankByContext<T>(items: T[], fit: (x: T) => number): T[] {
  return items.map((x, i) => ({ x, i, f: fit(x) })).sort((a, b) => b.f - a.f || a.i - b.i).map((r) => r.x);
}
