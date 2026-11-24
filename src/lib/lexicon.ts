/* Kelime bul yerleşik sözlüğü: satır ayrıştırma ve okunuşa göre eşleştirme (sunucu ve testler ortak kullanır) */
import { normAr, searchKey, strip } from './text';
import { rankByContext } from './context';
import { phonKeys } from './translit';
import { arabicSeq, hasConsonant, latinSeq, soundMatch, type LatSeq, type Seq, type SoundMatch } from './soundmatch';
import type { LookupResult } from './types';

export type LexEntry = {
  ar: string; tl: string; tr: string; en: string; type: string;
  variants: string[]; muAr?: string; muTl?: string; note?: string;
  /** Sözlük dosyasındaki bölüm başlığı (Teknoloji ve iletişim, Sağlık...): "Bu kelime nerede geçiyor?" eşleştirmesi için */
  topic?: string;
};

/** Konu başlıklarının bağlam ipuçları: kullanıcı "hastanede" yazınca Sağlık konusundaki kelimeler öne gelsin */
const TOPIC_HINTS: Record<string, string> = {
  teknolojiveiletisim: 'teknoloji bilgisayar telefon internet iletişim medya televizyon',
  meslekler: 'meslek iş işçi çalışma görev',
  ulasimvesehir: 'ulaşım şehir yol seyahat yolculuk trafik araç havaalanı istasyon',
  selamlasmavekalipifadeler: 'selam selamlaşma tanışma nezaket karşılama vedalaşma',
  baglaclar: 'bağlaç dilbilgisi gramer',
  harficerlerveyerbildirenkelimeler: 'harf cer edat yer yön',
  zamirlervesorukelimeleri: 'zamir soru',
  evveevesyalari: 'ev oda eşya mobilya mutfak aile',
  yiyecekveicecek: 'yemek yiyecek içecek mutfak sofra lokanta restoran kahvaltı meyve sebze',
  yerler: 'yer şehir mekân bina',
  vucut: 'vücut beden organ sağlık',
  insanlarvegenelisimler: 'insan kişi zaman günlük',
  sifatlar: 'sıfat',
  sikkullanilanfiiller: 'fiil eylem',
  hayvanlar: 'hayvan doğa çiftlik orman',
  giyim: 'giyim kıyafet elbise moda alışveriş',
  havavedoga: 'hava doğa mevsim iklim',
  okulvesinif: 'okul sınıf ders öğretmen öğrenci eğitim',
  sporveboszaman: 'spor oyun hobi tatil eğlence',
  duygularvedurumlar: 'duygu his',
  alisverisvepara: 'alışveriş para çarşı pazar market fiyat',
  saglik: 'sağlık hastane doktor hasta ilaç',
  sayilar: 'sayı rakam matematik',
  gunlukkaliplar: 'günlük konuşma kalıp',
  dahafazlasikfiil: 'fiil eylem'
};
export const topicHints = (topic?: string) => (topic ? TOPIC_HINTS[searchKey(topic)] || '' : '');

/** "# Defterden: teknoloji ve iletişim" ya da "# Sayılar (derslerde olmayanlar)" -> "Teknoloji ve iletişim", "Sayılar" */
function sectionName(line: string) {
  const s = line.replace(/^#\s*/, '').replace(/^Defterden:\s*/i, '').replace(/\(.*?\)/g, '').trim();
  return s ? s[0].toLocaleUpperCase('tr') + s.slice(1) : undefined;
}

export const TYPE_LABEL: Record<string, string> = { i: 'isim', f: 'fiil', s: 'sıfat', h: 'harf', z: 'zamir', zf: 'zarf', k: 'kalıp ifade' };

/** "Arapça ; okunuş ; Türkçe ; İngilizce ; tür ; ekler" satırlarını ayrıştırır */
export function parseLexicon(text: string): LexEntry[] {
  const out: LexEntry[] = [];
  let topic: string | undefined;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('#')) { topic = sectionName(line); continue; }
    if (!line) continue;
    const [ar, tl, tr, en, type, extra = ''] = line.split(' ; ').map((x) => x.trim());
    const e: LexEntry = { ar, tl, tr, en, type, variants: [], topic };
    for (const part of extra.split('|').map((x) => x.trim()).filter(Boolean)) {
      const [k, ...rest] = part.split('=');
      const v = rest.join('=').trim();
      if (k === 'v') e.variants.push(...v.split(',').map((x) => x.trim()).filter(Boolean));
      else if (k === 'mu') { const [a, t] = v.split('/'); e.muAr = a.trim(); e.muTl = t?.trim(); }
      else if (k === 'n') e.note = v;
    }
    out.push(e);
  }
  return out;
}

const arKey = (s: string) => normAr(strip(s)).replace(/[؟?!.،,]/g, '').replace(/^ال/, '').replace(/\s+/g, ' ').trim();
type Indexed = { e: LexEntry; keys: string[]; muKeys: string[]; vkeys: string[]; seq: Seq; muSeq?: Seq; ar: string[] };

/** Bir kaydın aranabilir okunuşları: kendisi, ek okunuşlar, tâ merbûtalı ve tenvinli hâller */
export function entryKeys(e: LexEntry) {
  const forms = [e.tl, ...e.variants];
  if (/ة$/.test(strip(e.ar).trim())) for (const t of [e.tl, ...e.variants]) forms.push(t + 't', t + 'tun', t + 'tin', t + 'ten');
  const keys = [...new Set(forms.flatMap(phonKeys))];
  const muKeys = e.muTl ? phonKeys(e.muTl) : [];
  return { keys, muKeys };
}

export function indexLexicon(list: LexEntry[]): Indexed[] {
  return list.map((e) => {
    const { keys, muKeys } = entryKeys(e);
    const vkeys = [...new Set(e.variants.flatMap(phonKeys))];
    return { e, keys, muKeys, vkeys, seq: arabicSeq(e.ar), muSeq: e.muAr ? arabicSeq(e.muAr) : undefined, ar: [arKey(e.ar), ...(e.muAr ? [arKey(e.muAr)] : [])] };
  });
}

/** Türkçeye özgü ünsüzler (ş, ç, ğ): ek okunuşla eşleşmede bunlar da aynı olmalı (kış, kıssa değildir) */
const trCons = (s: string) => s.toLocaleLowerCase('tr').replace(/[^şçğ]/g, '');
const score = (m: SoundMatch) => m.miss * 100 + m.pen;

/** Kayıt aramaya uyuyor mu: Arapça yazımla harf harf, geçmiş zaman ya da şimdiki zaman hâliyle; yoksa elle eklenmiş ek okunuşlarla */
function entryMatch(x: Indexed, L: LatSeq, q: string, qk: string[]): { m: SoundMatch; mu: boolean } | null {
  let best: { m: SoundMatch; mu: boolean } | null = null;
  const a = soundMatch(L, x.seq);
  if (a) best = { m: a, mu: false };
  if (x.muSeq) {
    const b = soundMatch(L, x.muSeq);
    if (b && (!best || score(b) < score(best.m))) best = { m: b, mu: true };
  }
  // Elle eklenmiş ek okunuşlar (telfaz, tilifiziyon) birebir yazıldıysa tam eşleşme sayılır
  if ((!best || best.m.miss) && x.vkeys.some((k) => qk.includes(k)) && (!L.tr || x.e.variants.some((v) => trCons(v) === trCons(q)))) best = { m: { miss: 0, pen: 0.2 }, mu: false };
  // Okunuşu sözlükteki yazımla aynıysa öne (tamamen aynıysa daha çok)
  if (best && !best.m.miss) {
    const keys = best.mu ? x.muKeys : x.keys;
    const bonus = keys.includes(qk[0]) ? 0.1 : keys.some((k) => qk.includes(k)) ? 0.05 : 0;
    if (bonus) best = { ...best, m: { ...best.m, pen: best.m.pen - bonus } };
  }
  return best;
}

export type LexMatch = { kind: 'exact' | 'near'; items: { e: LexEntry; viaMu: boolean; fit?: boolean; near?: boolean }[] };

/**
 * Okunuşa ya da Arapça yazıma göre arar.
 * exact: ünsüzler birebir aynı, harekeler uyumlu (e/a, i/ı, u/ü, cezm, şedde ve uzatma farkları yok sayılır)
 * near: ünsüzler birebir aynı ama harekeler farklı (harekeler tamamen yanlış okunduğunda)
 * Yazılmayan ya da kelimede olmayan bir ünsüz varsa kayıt hiç önerilmez (soundmatch.ts)
 * fit: "Bu kelime nerede geçiyor?" bağlamına uygunluk; verilirse uyanlar, sonuç sınırından önce öne alınır
 */
export function matchLexicon(index: Indexed[], q: string, fit?: (e: LexEntry) => number): LexMatch | null {
  const ranked = <T extends { e: LexEntry }>(list: T[], n: number) =>
    (fit ? rankByContext(list, (r) => fit(r.e)) : list).slice(0, n).map((r) => (fit && fit(r.e) > 0 ? { ...r, fit: true } : r));
  const s = q.trim();
  if (!s) return null;
  if (/[؀-ۿ]/.test(s)) {
    const k = arKey(s);
    const items = index.filter((x) => x.ar.includes(k)).map((x) => ({ e: x.e, viaMu: x.ar.indexOf(k) === 1 }));
    return items.length ? { kind: 'exact', items: ranked(items, 5) } : null;
  }
  const L = latinSeq(s);
  if (!hasConsonant(L)) return null;
  const qk = phonKeys(s);
  const hits: { e: LexEntry; viaMu: boolean; m: SoundMatch }[] = [];
  for (const x of index) {
    const r = entryMatch(x, L, s, qk);
    if (r) hits.push({ e: x.e, viaMu: r.mu, m: r.m });
  }
  hits.sort((a, b) => score(a.m) - score(b.m));
  // Tam eşleşmeler: en temiz eşleşmeye yakın olanlar (cezm ya da şedde payı çok artmışsa ayıklanır)
  const top = hits.find((h) => !h.m.miss);
  const exact = top ? hits.filter((h) => !h.m.miss && h.m.pen <= top.m.pen + 0.12) : [];
  // Harfleri aynı, harekeleri farklı kelimeler: tam eşleşme yoksa ya da azsa ardına eklenir
  const near = hits.filter((h) => h.m.miss > 0 && h.m.miss <= (exact.length ? 1 : 3));
  if (exact.length) {
    const items = ranked(exact.map(({ e, viaMu }) => ({ e, viaMu })), 5);
    return { kind: 'exact', items: items.length < 3 ? [...items, ...near.slice(0, 3 - items.length).map(({ e, viaMu }) => ({ e, viaMu, near: true }))] : items };
  }
  return near.length ? { kind: 'near', items: ranked(near.map(({ e, viaMu }) => ({ e, viaMu })), 3) } : null;
}

/** Eşleşmeyi sayfanın gösterdiği sonuç biçimine çevirir */
export function toLookupResult(m: LexMatch): LookupResult {
  return {
    results: m.items.map(({ e, viaMu, fit, near }) => {
      const notes = [] as string[];
      if (e.muAr) notes.push(viaMu ? `Aradığın, ${e.tl} fiilinin şimdiki/geniş zaman hâli: ${e.muAr} (${e.muTl}).` : `Şimdiki/geniş zaman: ${e.muAr} (${e.muTl}).`);
      if (e.note) notes.push(e.note);
      return { ar: viaMu && e.muAr ? e.muAr : e.ar, tl: viaMu && e.muTl ? e.muTl : e.tl, tr: viaMu && e.muAr ? `"${e.tr}" fiilinin şimdiki / geniş zamanı` : e.tr, en: e.en, type: TYPE_LABEL[e.type] || e.type, root: '', note: notes.join(' ') || undefined, ...(fit ? { fit: true } : {}), ...(near ? { near: true } : {}) };
    }),
    note: m.kind === 'near' ? 'Bu yazıma tam uyan kelime yok; aynı harflerle yazılan, harekeleri farklı kelimeler:' : ''
  };
}
