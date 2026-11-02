/* Kelime bul yerleşik sözlüğü: satır ayrıştırma ve okunuşa göre eşleştirme (sunucu ve testler ortak kullanır) */
import { normAr, searchKey, strip } from './text';
import { rankByContext } from './context';
import { phonKeys } from './translit';
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
const skel = (k: string) => k.replace(/[aiu]/g, '');

function lev(a: string, b: string) {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

type Indexed = { e: LexEntry; keys: string[]; muKeys: string[]; skels: string[]; ar: string[] };

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
    return { e, keys, muKeys, skels: [...new Set([...keys, ...muKeys].map(skel))], ar: [arKey(e.ar), ...(e.muAr ? [arKey(e.muAr)] : [])] };
  });
}

export type LexMatch = { kind: 'exact' | 'near'; items: { e: LexEntry; viaMu: boolean; fit?: boolean }[] };

/**
 * Okunuşa ya da Arapça yazıma göre arar.
 * exact: okunuş anahtarı aynı (hareke, şedde, uzatma, İngilizce yazım farkları yok sayılır)
 * near: ünsüz iskeleti aynı ve okunuş çok yakın (harekeler tamamen yanlış okunduğunda)
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
  const qk = phonKeys(s);
  if (!qk.length) return null;
  const exact = index
    .map((x) => ({ x, main: x.keys.some((k) => qk.includes(k)), mu: x.muKeys.some((k) => qk.includes(k)) }))
    .filter((r) => r.main || r.mu)
    // Tam anahtar eşleşmesi gevşek eşleşmeden önce gelsin
    .sort((a, b) => Number(!a.x.keys.includes(qk[0]) && !a.x.muKeys.includes(qk[0])) - Number(!b.x.keys.includes(qk[0]) && !b.x.muKeys.includes(qk[0])));
  if (exact.length) return { kind: 'exact', items: ranked(exact.map((r) => ({ e: r.x.e, viaMu: !r.main && r.mu })), 5) };

  const qs = qk.map(skel);
  if (qs[0].length < 2) return null;
  const near = index
    .filter((x) => x.skels.some((sk) => qs.includes(sk)))
    .map((x) => {
      const all = [...x.keys.map((k) => ({ k, mu: false })), ...x.muKeys.map((k) => ({ k, mu: true }))];
      let best = { d: 99, mu: false };
      for (const { k, mu } of all) for (const q2 of qk) { const d = lev(k, q2); if (d < best.d) best = { d, mu }; }
      return { x, ...best };
    })
    .filter((r) => r.d <= Math.max(2, Math.floor(qk[0].length * 0.35)))
    .sort((a, b) => a.d - b.d);
  return near.length ? { kind: 'near', items: ranked(near.map((r) => ({ e: r.x.e, viaMu: r.mu })), 3) } : null;
}

/** Eşleşmeyi sayfanın gösterdiği sonuç biçimine çevirir */
export function toLookupResult(m: LexMatch): LookupResult {
  return {
    results: m.items.map(({ e, viaMu, fit }) => {
      const notes = [] as string[];
      if (e.muAr) notes.push(viaMu ? `Aradığın, ${e.tl} fiilinin şimdiki/geniş zaman hâli: ${e.muAr} (${e.muTl}).` : `Şimdiki/geniş zaman: ${e.muAr} (${e.muTl}).`);
      if (e.note) notes.push(e.note);
      return { ar: viaMu && e.muAr ? e.muAr : e.ar, tl: viaMu && e.muTl ? e.muTl : e.tl, tr: viaMu && e.muAr ? `"${e.tr}" fiilinin şimdiki / geniş zamanı` : e.tr, en: e.en, type: TYPE_LABEL[e.type] || e.type, root: '', note: notes.join(' ') || undefined, ...(fit ? { fit: true } : {}) };
    }),
    note: m.kind === 'near' ? 'Bu yazıma tam uyan kelime yok; okunuşu en yakın olanlar:' : ''
  };
}
