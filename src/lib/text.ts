import type { Activity, ActType, Topic } from './types';

/* ---------- Metin yardımcıları (eski common.js ile aynı davranış) ---------- */
export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const AR_RE = /[؀-ۿ]/;
export const isAr = (s: unknown) => AR_RE.test(String(s || ''));
export const strip = (s: unknown) => String(s || '').replace(/[ً-ٰٟـ]/g, '');
export const normAr = (s: unknown) => strip(s).replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
/** Ses kaydı eşleştirme anahtarı: harekesiz, noktalamasız, tek boşluklu Arapça */
export const audioKey = (s: unknown) => normAr(s).replace(/[؟،؛.!?,:;"'()]/g, '').replace(/\s+/g, ' ').trim().slice(0, 191);
export const normTr = (s: unknown) =>
  String(s || '').toLocaleLowerCase('tr').replace(/[âà]/g, 'a').replace(/[îì]/g, 'i').replace(/[ûù]/g, 'u').replace(/[''ʿʾ-]/g, '');
const LATIN = /[A-Za-zÇĞİÖŞÜçğıöşüâîû]/;
const AR_RUN = /[؀-ۿ][؀-ۿ\s]*[؀-ۿ؟]|[؀-ۿ]/g;

export function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** HTML üreten yardımcılar; harekeli/harekesiz gösterim ayara bağlı */
export function makeText(harakat: boolean) {
  const showAr = (s: string) => (harakat ? s : strip(s));
  const ar = (text: string, cls = '') =>
    `<span class="ar ${cls}" lang="ar" dir="rtl" data-v="${esc(text)}">${esc(showAr(text))}</span>`;
  // {{...}} işaretli ve işaretsiz Arapçayı sarar (içerik güvenilir ders verisidir, HTML içerebilir)
  const rich = (html: string | undefined | null, cls = '') =>
    String(html || '')
      .split(/(\{\{.+?\}\})/)
      .map((part) => {
        const m = part.match(/^\{\{(.+)\}\}$/);
        return m ? ar(m[1], cls) : part.replace(AR_RUN, (r) => ar(r, cls));
      })
      .join('');
  const text = (s: unknown, cls = '') => {
    const v = String(s ?? '');
    if (v.includes('{{')) return rich(v, cls);
    if (!isAr(v)) return esc(v);
    return esc(v).replace(AR_RUN, (m) => ar(m, cls));
  };
  const auto = (s: unknown, cls = '') => {
    const v = String(s ?? '');
    return isAr(v) && !LATIN.test(v) ? ar(v, cls) : text(v, cls);
  };
  return { showAr, ar, rich, text, auto };
}
export type TextFns = ReturnType<typeof makeText>;

/* ---------- Etkinlik türleri ---------- */
export const TYPE: Record<ActType, { label: string; kind: string }> = {
  flash: { label: 'Kelime kartları', kind: 'Kelime' },
  match: { label: 'Eşleştirme', kind: 'Eşleştirme' },
  mc: { label: 'Çoktan seçmeli', kind: 'Alıştırma' },
  fill: { label: 'Boşluk doldurma', kind: 'Alıştırma' },
  order: { label: 'Cümle kurma', kind: 'Alıştırma' },
  tf: { label: 'Doğru / Yanlış', kind: 'Alıştırma' },
  listen: { label: 'Dinle ve seç', kind: 'Dinleme' },
  test: { label: 'Konu testi', kind: 'Test' },
  clock: { label: 'Sınırsız pratik', kind: 'Pratik' },
  speak: { label: 'Telaffuz', kind: 'Konuşma' }
};

/** Telaffuz etkinliğinde sorulan en fazla kelime */
export const SPEAK_MAX = 8;

export type ActView = Activity & { count: number; meta: string; mins: number };

/** Etkinlik listesi + kart bilgileri (dinleme etkinliği item'sızsa kelimelerden üretilir) */
export function actsOf(t: Pick<Topic, 'acts' | 'words'> & { autoListen?: boolean }): ActView[] {
  const list: Activity[] = t.acts.map((a) => ({ ...a }));
  if (t.autoListen && (t.words || []).length >= 4 && !list.some((a) => a.type === 'listen')) {
    const listen: Activity = { id: '', type: 'listen', title: 'Dinle ve anlamını seç', desc: 'Kelimeyi dinle, Türkçe anlamını bul. Kulağını Arapçaya alıştır.', glyph: 'اِسْمَعْ', auto: true };
    const ti = list.findIndex((a) => a.type === 'test');
    if (ti === -1) list.push(listen); else list.splice(ti, 0, listen);
  }
  return list.map((a, i) => {
    const id = a.id || a.type + i;
    const items = a.items || [];
    let count = a.type === 'flash' ? (a.items || t.words || []).length
      : a.type === 'listen' && !a.items?.length ? Math.min(10, (t.words || []).length)
      : a.type === 'speak' ? Math.min(SPEAK_MAX, (a.items?.length ? a.items : t.words || []).length)
      : items.length;
    let meta = a.type === 'flash' ? count + ' kart' : a.type === 'speak' ? count + ' kelime' : a.type === 'match' ? count + ' çift' : count + ' soru';
    let mins = Math.max(3, Math.round(count * (a.type === 'flash' ? 0.35 : 0.55)));
    if (a.type === 'clock') { count = 0; meta = 'Sınırsız soru'; mins = 5; }
    return { ...a, id, count, meta, mins };
  });
}

export const dayKey = (d: Date) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export function streakOf(days: string[]) {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
