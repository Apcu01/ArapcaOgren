import type { Question, QType } from './types';

// Hızlı, kararlı 53 bit özet (cyrb53)
export function hash53(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** Etkinlik türüne göre sorunun gerçek türü (konu testinde varsayılan çoktan seçmeli) */
export const qTypeOf = (q: Question, actType: string): QType => (q.t || (actType === 'test' ? 'mc' : actType)) as QType;

/** Sorunun kimliği: içeriği değişmedikçe aynı kalır (seçenek sırası önemsizdir) */
export function questionKey(q: Question, t: QType) {
  const core = { t, q: q.q || '', ar: q.ar || '', s: q.s || '', clock: q.clock || '', tr: q.tr || '', w: q.w || [], a: q.a ?? '', o: [...(q.options || [])].sort() };
  return 'q' + hash53(JSON.stringify(core));
}

/** Yönetim paneli ve istatistikler için kısa, düz metin etiket */
export function questionLabel(q: Question) {
  const raw = q.q || q.s || q.tr || q.ar || '';
  const txt = raw.replace(/\{\{(.+?)\}\}/g, '$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const extra = q.clock ? ` (${q.clock})` : q.ar && q.q ? ` ${q.ar}` : '';
  return (txt + extra).slice(0, 250) || 'Soru';
}

/** Hatalarım kaydı */
export type MistakeItem = { mkey: string; topicId: string; question: Question; count: number; at: number };
export const mistakeKey = (topicId: string, q: Question) => `${topicId}:${questionKey(q, (q.t || 'mc') as QType)}`.slice(0, 64);

/** Soru başına cevap kaydı (istatistik için) */
export type AnswerRec = { qk: string; label: string; ok: boolean };
