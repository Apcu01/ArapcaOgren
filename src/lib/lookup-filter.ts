import { arabicSeq, hasConsonant, latinSeq, soundMatch } from './soundmatch';
import { isAr } from './text';
import type { LookupResult } from './types';

export const NO_FIT_NOTE = 'Yazdığın harflerle yazılan bir kelime bulunamadı. Harfleri kontrol edip tekrar dene; harekeleri yanlış yazman sorun değil.';

/**
 * Latin harfli aramada yazılan harflerle uyuşmayan yapay zekâ sonuçları gösterilmez:
 * kelimede olmayan bir harf yazıldıysa ya da kelimedeki bir harf hiç yazılmadıysa (harekeler, cezm ve şedde serbest).
 * Arapça harflerle yapılan aramalarda yapay zekâ yazım hatasını düzeltebilir; orada süzülmez.
 */
export function keepFitting(q: string, r: LookupResult): LookupResult {
  if (isAr(q)) return r;
  const L = latinSeq(q);
  if (!hasConsonant(L)) return r;
  const results = r.results.filter((x) => soundMatch(L, arabicSeq(x.ar)));
  if (results.length === r.results.length) return r;
  return { results, note: results.length ? r.note : NO_FIT_NOTE };
}
