/* ---------- Sınırsız pratik: derse göre rastgele soru üreticileri ----------
   Zamirler ve İyelik Ekleri için dilbilgisi kalıplarından (zamir, basit fiil, sıfat, isim tabloları),
   diğer derslerde dersin kelimelerinden soru üretilir. Her soru farklı bir biçimde gelebilir
   (anlamını bul, Arapçasını bul, dinle, boşluğu doldur, doğru cümleyi bul, dönüştür, kelimeleri diz). */
import { shuffle } from './text';
import type { Word } from './types';
import { DRILLS, numberTexts, pairTexts, rakamQ, SOUND_GROUPS, soundTexts } from './drills';
import { loanTexts } from './loanwords';

export type EQ = {
  /** Aynı sorunun art arda gelmemesi için anahtar */
  key: string;
  /** İstatistik için soru türü ve etiketi */
  kind: string;
  label: string;
  /** Yönerge ({{...}} içi Arapça) */
  prompt: string;
  /** Büyük gösterilen Arapça ifade ya da Türkçe ifade; listen: Arapça gizli, yalnızca ses */
  ar?: string;
  tr?: string;
  listen?: boolean;
  options: string[];
  optAr: boolean;
  /** Kelime dizme sorusu: karışık kelimeler (biri fazla); alt: Hatalarım için yanlış cümleler */
  tiles?: string[];
  alt?: string[];
  a: string;
  /** Cevaptan sonra gösterilen tam Arapça ifade, Türkçesi ve açıklama ({{...}} içi Arapça) */
  full: string;
  fullTr: string;
  why: string;
  /** Hatalarım'daki kural başlığı (RULE_TR) */
  g?: string;
  /** Cevaptan sonra okunacak metin (varsayılan: full); null ise ses düğmesi yok */
  say?: string | null;
  /** Dinleme: art arda okunacak ifadeler (telefon numarası rakam rakam) */
  seq?: string[];
  /** Seçenek yerine yazarak cevap (rakamlarla); alt: Hatalarım için yanlış seçenekler */
  input?: 'digits';
};

/** Oturum özetindeki soru türü adları */
export const KIND_TR: Record<string, string> = {
  'zamir-anlam': 'Zamirin anlamı', 'zamir-ar': 'Zamirin Arapçası', 'zamir-dinle': 'Zamiri dinleme', 'zamir-ozne': 'Yükleme uygun zamir',
  'zamir-yuklem': 'Zamire uygun yüklem', 'zamir-isaret': 'İşaret zamirleri', 'zamir-sifat': 'Sıfat cümleleri', 'zamir-dizme': 'Cümle kurma',
  'zamir-fiil': 'Fiil çekimi', 'zamir-cumle': 'Cümlenin anlamı', 'zamir-dogru': 'Doğru cümleyi bulma', 'zamir-donustur': 'İkil ve çoğula dönüştürme',
  'iyelik-anlam': 'Ekli ismin anlamı', 'iyelik-ar': 'Ekli ismin Arapçası', 'iyelik-dinle': 'Ekli ismi dinleme', 'iyelik-ek': 'Doğru iyelik eki',
  'iyelik-donustur': 'Ek değiştirme', 'iyelik-cumle': 'İyelikli cümleler', 'iyelik-dizme': 'Cümle kurma', 'iyelik-inde': '"Bende var" kalıbı',
  'kelime-anlam': 'Kelimenin anlamı', 'kelime-ar': 'Kelimenin Arapçası', 'kelime-dinle': 'Kelimeyi dinleme',
  'rakam-oku': 'Rakam okuma', 'rakam-yaz': 'Rakamla yazma', 'rakam-dinle': 'Sayı dinleme', 'rakam-telefon': 'Telefon numarası', 'rakam-fiyat': 'Fiyat dinleme',
  'zit-ar': 'Zıt anlamlısını bulma', 'zit-tr': 'Zıt anlamlı (Türkçeden)', 'es-ar': 'Eş anlamlısını bulma', 'es-tr': 'Eş anlamlı (Türkçeden)',
  'tk-ayni': 'Anlamı aynı mı?', 'tk-anlam': 'Arapçadaki anlamı', 'tk-ar': 'Arapça aslı', 'tk-dinle': 'Dinleyip bulma'
};
/** Oturum özeti: benzer seslerde harf grubuna göre (ح ve ه), diğerlerinde soru türüne göre */
export const kindLabel = (q: Pick<EQ, 'kind' | 'label' | 'g'>) => (q.g?.startsWith('ses-') ? q.label.replace(/^Benzer sesler: /, '') : KIND_TR[q.kind] || q.label);

/** Hatalarım'da kural başlıkları */
export const RULE_TR: Record<string, string> = {
  zamir: 'Zamirler', yuklem: 'Zamir ve yüklem uyumu', isaret: 'İşaret zamiri ve cinsiyet', cinsiyet: 'Sıfat ve cinsiyet uyumu',
  dizme: 'Cümle kurma ve kelime sırası', fiil: 'Zamir ve fiil uyumu', cogul: 'Tekil, ikil ve çoğul', iyelik: 'İyelik ekleri',
  ta: 'ة ve ت değişimi', inde: 'Sahiplik: عِنْدَ + ek', kelime: 'Kelime anlamları', saat: 'Saatler',
  rakam: 'Arapça rakamlar', sayi: 'Sayıları dinleme', zit: 'Zıt anlamlılar', es: 'Eş anlamlılar', turkce: 'Türkçedeki Arapça kelimeler',
  ...Object.fromEntries(SOUND_GROUPS.map((gr) => ['ses-' + gr.id, 'Benzer sesler: ' + gr.title]))
};

/** Zamir sorularının kural başlığı (soru türünden; fiilli ve isimli cümleler ayrılır) */
function zamirRule(q: EQ): string {
  switch (q.kind) {
    case 'zamir-anlam': case 'zamir-ar': case 'zamir-dinle': return 'zamir';
    case 'zamir-ozne': case 'zamir-yuklem': return 'yuklem';
    case 'zamir-isaret': return 'isaret';
    case 'zamir-sifat': return 'cinsiyet';
    case 'zamir-dizme': return 'dizme';
    case 'zamir-fiil': return 'fiil';
    case 'zamir-cumle': return q.key.startsWith('z-fiil-anlam') ? 'fiil' : 'yuklem';
    case 'zamir-dogru': return q.key.startsWith('z-dogruf') ? 'fiil' : 'yuklem';
    case 'zamir-donustur': return q.key.startsWith('z-donf') ? 'fiil' : 'cogul';
    default: return 'zamir';
  }
}

const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const chance = (p: number) => Math.random() < p;
/** Doğru cevap + farklı çeldiriciler (tekrarsız, en fazla 4 seçenek) */
const opts = (a: string, cands: string[], n = 3) => shuffle([a, ...[...new Set(cands.filter((c) => c && c !== a))].slice(0, n)]);
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);
const low = (s: string) => s.toLocaleLowerCase('tr');

/* ---------- Arapça yardımcılar ---------- */
const isSun = (c: string) => 'تثدذرزسشصضطظلن'.includes(c);
/** Belirsiz (tenvinli) ve ال'li hal; s: harekeli yalın gövde (ة dahil) */
const ind = (s: string) => s + 'ٌ';
const def = (s: string) => (s.startsWith('اِ') ? 'الِا' + s.slice(2) : isSun(s[0]) ? 'ال' + s[0] + 'ّ' + s.slice(1) : 'الْ' + s) + 'ُ';

/* ---------- Türkçe yardımcı: isim/sıfata kişi eki (ben, sen, o, biz, siz, onlar) ---------- */
const VOW = 'aeıioöuü';
function kisi(w: string): string[] {
  // meşgul gibi ince l ile biten alıntılarda ek ince ünlü alır
  const lv = /şgul$/.test(w) ? 'ü' : [...w].reverse().find((c) => VOW.includes(c)) || 'e';
  const x = ({ a: 'ı', ı: 'ı', e: 'i', i: 'i', o: 'u', u: 'u', ö: 'ü', ü: 'ü' } as Record<string, string>)[lv];
  const two = 'aıou'.includes(lv) ? 'a' : 'e';
  const y = VOW.includes(w[w.length - 1]) ? 'y' : '';
  return [w + y + x + 'm', w + 's' + x + 'n', w, w + y + x + 'z', w + 's' + x + 'n' + x + 'z', w + 'l' + two + 'r'];
}

/* ================= Zamirler ================= */
// p: Türkçe kişi sırası (0 ben, 1 sen, 2 o, 3 biz, 4 siz, 5 onlar); forms: uyabileceği yüklem biçimleri; vp/ve: şimdiki zaman fiil ön eki ve sonu
type F = 'ms' | 'fs' | 'md' | 'fd' | 'mp' | 'fp';
type Pron = { ar: string; tr: string; p: number; forms: F[]; vp: string; ve: string; note: string };
const PRONS: Pron[] = [
  { ar: 'أَنَا', tr: 'Ben', p: 0, forms: ['ms', 'fs'], vp: 'أَ', ve: 'ُ', note: '{{أَنَا}} "ben" demektir; erkek de kadın da aynı zamiri kullanır.' },
  { ar: 'أَنْتَ', tr: 'Sen (erkek)', p: 1, forms: ['ms'], vp: 'تَ', ve: 'ُ', note: 'Erkeğe "sen": {{أَنْتَ}} (sonu üstün). Kadına {{أَنْتِ}} denir.' },
  { ar: 'أَنْتِ', tr: 'Sen (kadın)', p: 1, forms: ['fs'], vp: 'تَ', ve: 'ِينَ', note: 'Kadına "sen": {{أَنْتِ}} (sonu esre). Erkeğe {{أَنْتَ}} denir.' },
  { ar: 'هُوَ', tr: 'O (erkek)', p: 2, forms: ['ms'], vp: 'يَ', ve: 'ُ', note: 'Erkek için "o": {{هُوَ}}. Kadın için {{هِيَ}}.' },
  { ar: 'هِيَ', tr: 'O (kadın)', p: 2, forms: ['fs'], vp: 'تَ', ve: 'ُ', note: 'Kadın için "o": {{هِيَ}}. Erkek için {{هُوَ}}.' },
  { ar: 'نَحْنُ', tr: 'Biz', p: 3, forms: ['mp', 'fp'], vp: 'نَ', ve: 'ُ', note: '{{نَحْنُ}} "biz" demektir; erkek, kadın ve iki kişi için aynıdır.' },
  { ar: 'أَنْتُمَا', tr: 'Siz ikiniz', p: 4, forms: ['md', 'fd'], vp: 'تَ', ve: 'َانِ', note: 'İki kişiye "siz": {{أَنْتُمَا}} (ikil). Erkek de kadın da olsa aynıdır.' },
  { ar: 'أَنْتُمْ', tr: 'Siz (erkekler)', p: 4, forms: ['mp'], vp: 'تَ', ve: 'ُونَ', note: 'Üç ve daha fazla erkeğe (ya da karışık gruba) "siz": {{أَنْتُمْ}}.' },
  { ar: 'أَنْتُنَّ', tr: 'Siz (kadınlar)', p: 4, forms: ['fp'], vp: 'تَ', ve: 'ْنَ', note: 'Üç ve daha fazla kadına "siz": {{أَنْتُنَّ}}.' },
  { ar: 'هُمَا', tr: 'Onlar ikisi', p: 5, forms: ['md', 'fd'], vp: 'يَ', ve: 'َانِ', note: 'İki kişi için "onlar": {{هُمَا}} (ikil).' },
  { ar: 'هُمْ', tr: 'Onlar (erkekler)', p: 5, forms: ['mp'], vp: 'يَ', ve: 'ُونَ', note: 'Üç ve daha fazla erkek (ya da karışık grup) için "onlar": {{هُمْ}}.' },
  { ar: 'هُنَّ', tr: 'Onlar (kadınlar)', p: 5, forms: ['fp'], vp: 'يَ', ve: 'ْنَ', note: 'Üç ve daha fazla kadın için "onlar": {{هُنَّ}}.' }
];
const PR = (ar: string) => PRONS.find((x) => x.ar === ar)!;
// Anlam sorularında Türkçe karşılık (ders kelimeleriyle aynı)
const PRON_TR: Record<string, string> = Object.fromEntries(PRONS.map((p) => [p.ar, low(p.tr)]));

// Yüklem olarak kullanılan meslek ve sıfatlar: Arapça 6 biçim (düzenli çoğul dışındakiler elle)
type Pred = { tr: string; ar: Record<F, string> };
const snd = (tr: string, s: string, o: Partial<Record<F, string>> = {}): Pred => ({
  tr, ar: { ms: s + 'ٌ', fs: s + 'َةٌ', md: s + 'َانِ', fd: s + 'َتَانِ', mp: s + 'ُونَ', fp: s + 'َاتٌ', ...o }
});
const PREDS: Pred[] = [
  snd('öğrenci', 'طَالِب', { mp: 'طُلَّابٌ' }),
  snd('öğretmen', 'مُعَلِّم'),
  snd('mühendis', 'مُهَنْدِس'),
  snd('doktor', 'طَبِيب', { mp: 'أَطِبَّاءُ' }),
  snd('hemşire', 'مُمَرِّض'),
  snd('aşçı', 'طَبَّاخ'),
  snd('memur', 'مُوَظَّف'),
  snd('oyuncu', 'لَاعِب'),
  snd('müslüman', 'مُسْلِم'),
  snd('Türk', 'تُرْكِيّ', { mp: 'أَتْرَاكٌ' }),
  snd('meşgul', 'مَشْغُول'),
  snd('mutlu', 'سَعِيد', { mp: 'سُعَدَاءُ' }),
  snd('memnun', 'مَسْرُور'),
  snd('üzgün', 'حَزِين'),
  snd('yorgun', 'مُتْعَب'),
  snd('hasta', 'مَرِيض', { mp: 'مَرْضَى' }),
  snd('aç', 'جَائِع', { mp: 'جِيَاعٌ' }),
  snd('hazır', 'مُسْتَعِدّ'),
  snd('çalışkan', 'مُجْتَهِد'),
  snd('zeki', 'ذَكِيّ', { mp: 'أَذْكِيَاءُ' }),
  snd('zengin', 'غَنِيّ', { mp: 'أَغْنِيَاءُ' }),
  snd('fakir', 'فَقِير', { mp: 'فُقَرَاءُ' }),
  snd('uzun boylu', 'طَوِيل', { mp: 'طِوَالٌ' }),
  snd('kısa boylu', 'قَصِير', { mp: 'قِصَارٌ' }),
  snd('güzel', 'جَمِيل')
];
const FORM_TR: Record<F, string> = { ms: 'eril tekil', fs: 'dişil tekil', md: 'eril ikil', fd: 'dişil ikil', mp: 'eril çoğul', fp: 'dişil çoğul' };
const ALL_F: F[] = ['ms', 'fs', 'md', 'fd', 'mp', 'fp'];
// İkil zamirlerin Türkçesinde çoğul eki yerine yalın biçim daha doğal ("Onlar ikisi öğrenci")
const trSentence = (pr: Pron, pd: Pred) => `${pr.tr} ${pr.ar === 'هُمَا' ? pd.tr : kisi(pd.tr)[pr.p]}.`;
const nom = (pr: Pron, pd: Pred, f: F) => pr.ar + ' ' + pd.ar[f];

// Basit fiiller (şimdiki/geniş zaman). s: ön ek ve son arasındaki gövde; tr: Türkçe 3. tekil
type Verb = { s: string; inf: string; tr: string };
const VERBS: Verb[] = [
  { s: 'كْتُب', inf: 'yazmak', tr: 'yazıyor' },
  { s: 'دْرُس', inf: 'ders çalışmak', tr: 'ders çalışıyor' },
  { s: 'لْعَب', inf: 'oynamak', tr: 'oynuyor' },
  { s: 'ذْهَب', inf: 'gitmek', tr: 'gidiyor' },
  { s: 'جْلِس', inf: 'oturmak', tr: 'oturuyor' },
  { s: 'شْرَب', inf: 'içmek', tr: 'içiyor' },
  { s: 'سْمَع', inf: 'dinlemek', tr: 'dinliyor' },
  { s: 'فْهَم', inf: 'anlamak', tr: 'anlıyor' },
  { s: 'عْمَل', inf: 'çalışmak', tr: 'çalışıyor' },
  { s: 'رْسُم', inf: 'resim yapmak', tr: 'resim yapıyor' },
  { s: 'خْرُج', inf: 'çıkmak', tr: 'çıkıyor' },
  { s: 'دْخُل', inf: 'girmek', tr: 'giriyor' },
  { s: 'ضْحَك', inf: 'gülmek', tr: 'gülüyor' },
  { s: 'رْجِع', inf: 'dönmek', tr: 'dönüyor' },
  { s: 'حْفَظ', inf: 'ezberlemek', tr: 'ezberliyor' },
  { s: 'طْبُخ', inf: 'yemek pişirmek', tr: 'yemek pişiriyor' },
  { s: 'سْبَح', inf: 'yüzmek', tr: 'yüzüyor' },
  { s: 'نْظُر', inf: 'bakmak', tr: 'bakıyor' }
];
const VSUF = ['um', 'sun', '', 'uz', 'sunuz', 'lar'];
const vf = (pr: Pron, v: Verb) => pr.vp + v.s + pr.ve;
const vSent = (pr: Pron, v: Verb) => pr.ar + ' ' + vf(pr, v);
const vTr = (pr: Pron, v: Verb) => `${pr.tr} ${v.tr}${pr.ar === 'هُمَا' ? '' : VSUF[pr.p]}.`;
const END_TR: Record<string, string> = { 'ُ': 'sonu ötre (ـُ)', 'ِينَ': 'sonuna ـِينَ gelir', 'َانِ': 'sonuna ـَانِ gelir', 'ُونَ': 'sonuna ـُونَ gelir', 'ْنَ': 'sonuna ـْنَ gelir' };
const vWhy = (pr: Pron, v: Verb) => {
  const f = vf(pr, v);
  const same = PRONS.filter((x) => x !== pr && vf(x, v) === f).map((x) => `{{${x.ar}}}`);
  return `{{${pr.ar}}} ile fiil {{${pr.vp}ـ}} ön ekiyle başlar, ${END_TR[pr.ve]}: {{${f}}}.` + (same.length ? ` Aynı biçim ${same.join(', ')} için de kullanılır.` : '');
};

// İsimler (c: t eşya, p yer, l canlı, o diğer; x: ة almadığı hâlde dişil)
type Noun = { s: string; tr: string; f: boolean; c: 't' | 'p' | 'l' | 'o'; x?: boolean };
const N = (s: string, tr: string, c: Noun['c'], x = false): Noun => ({ s, tr, c, f: x || s.endsWith('ة'), x });
const NOUNS: Noun[] = [
  N('كِتَاب', 'kitap', 't'), N('قَلَم', 'kalem', 't'), N('بَيْت', 'ev', 'p'), N('بَاب', 'kapı', 't'), N('كُرْسِيّ', 'sandalye', 't'),
  N('مَكْتَب', 'çalışma masası', 't'), N('دَفْتَر', 'defter', 't'), N('هَاتِف', 'telefon', 't'), N('سَرِير', 'yatak', 't'),
  N('حَاسُوب', 'bilgisayar', 't'), N('قَمِيص', 'gömlek', 't'), N('مِفْتَاح', 'anahtar', 't'), N('مَسْجِد', 'cami', 'p'),
  N('شَارِع', 'sokak', 'p'), N('وَلَد', 'çocuk', 'l'), N('رَجُل', 'adam', 'l'), N('كَلْب', 'köpek', 'l'), N('قِطّ', 'kedi', 'l'),
  N('سَيَّارَة', 'araba', 't'), N('حَقِيبَة', 'çanta', 't'), N('نَافِذَة', 'pencere', 't'), N('طَاوِلَة', 'masa', 't'),
  N('سَاعَة', 'saat', 't'), N('مَجَلَّة', 'dergi', 't'), N('مِسْطَرَة', 'cetvel', 't'), N('مَدْرَسَة', 'okul', 'p'),
  N('غُرْفَة', 'oda', 'p'), N('مَدِينَة', 'şehir', 'p'), N('شَجَرَة', 'ağaç', 'o'), N('وَرْدَة', 'gül', 'o'),
  N('تُفَّاحَة', 'elma', 'o'), N('صُورَة', 'resim', 'o'), N('بَقَرَة', 'inek', 'l'), N('بِنْت', 'kız', 'l', true), N('أُمّ', 'anne', 'l', true)
];
const genderWhy = (n: { f: boolean; x?: boolean }) => (n.x ? 'dişil (ة almasa da)' : n.f ? 'dişil (ة ile biter)' : 'eril');

// Sıfatlar (k: uyduğu isim sınıfları)
type Adj = { s: string; tr: string; k: string };
const ADJ: Adj[] = [
  { s: 'كَبِير', tr: 'büyük', k: 'tplo' }, { s: 'صَغِير', tr: 'küçük', k: 'tplo' }, { s: 'جَمِيل', tr: 'güzel', k: 'tplo' },
  { s: 'جَدِيد', tr: 'yeni', k: 'tp' }, { s: 'قَدِيم', tr: 'eski', k: 'tp' }, { s: 'نَظِيف', tr: 'temiz', k: 'tp' },
  { s: 'وَاسِع', tr: 'geniş', k: 'p' }, { s: 'طَوِيل', tr: 'uzun', k: 't' }, { s: 'ثَقِيل', tr: 'ağır', k: 't' },
  { s: 'خَفِيف', tr: 'hafif', k: 't' }, { s: 'سَعِيد', tr: 'mutlu', k: 'l' }, { s: 'مُتْعَب', tr: 'yorgun', k: 'l' }, { s: 'مَرِيض', tr: 'hasta', k: 'l' }
];
const adjF = (a: Adj, fem: boolean) => a.s + (fem ? 'َةٌ' : 'ٌ');
const adjFor = (c: string) => pick(ADJ.filter((a) => a.k.includes(c)));
const DEM = { near: { m: 'هٰذَا', f: 'هٰذِهِ' }, far: { m: 'ذٰلِكَ', f: 'تِلْكَ' } } as const;

const TILE_PROMPT = 'Kelimelere sırayla dokunarak cümleyi kur (bir kelime fazla).';
/** Kelime dizme sorusu; words: doğru sırayla, extra: fazladan kelime, alt: Hatalarım için yanlış cümleler */
function tileQ(b: Omit<EQ, 'options' | 'optAr' | 'a' | 'tiles' | 'prompt'>, words: string[], extra: string, alt: string[]): EQ {
  return { ...b, prompt: TILE_PROMPT, options: [], optAr: true, a: words.join(' '), tiles: shuffle([...words, extra]), alt };
}

/** Sıfat cümlesi: "Bu kitap yeni." هٰذَا الْكِتَابُ جَدِيدٌ */
function sifatQ(tiles: boolean): EQ {
  const n = pick(NOUNS), adj = adjFor(n.c), far = chance(0.35);
  const g = n.f ? 'f' : 'm', og = n.f ? 'm' : 'f', d = far ? DEM.far : DEM.near;
  const words = [d[g], def(n.s), adjF(adj, n.f)];
  const a = words.join(' ');
  const wrongs = [`${d[og]} ${def(n.s)} ${adjF(adj, n.f)}`, `${d[g]} ${def(n.s)} ${adjF(adj, !n.f)}`, `${d[g]} ${ind(n.s)} ${adjF(adj, n.f)}`];
  const trS = `${far ? 'Şu' : 'Bu'} ${n.tr} ${adj.tr}.`;
  const b = {
    key: 'z-sifat' + a, kind: tiles ? 'zamir-dizme' : 'zamir-sifat', label: tiles ? 'Cümle kurma: işaret + isim + sıfat' : 'İşaret zamiri + sıfat',
    tr: trS, full: a, fullTr: trS,
    why: `"${cap(n.tr)}" ${genderWhy(n)} olduğu için hem işaret zamiri ({{${d[g]}}}) hem sıfat ({{${adjF(adj, n.f)}}}) ${n.f ? 'dişil' : 'eril'} olur. ` +
      `İsim ال alır, sıfat sona gelir ve yüklem olur. {{${wrongs[2]}}} deseydik "${far ? 'Şu' : 'Bu'} ${adj.tr} bir ${n.tr}." olurdu.`
  };
  if (tiles) return tileQ(b, words, chance(0.5) ? d[og] : adjF(adj, !n.f), wrongs);
  return { ...b, prompt: 'Bu cümlenin Arapçası hangisi?', options: shuffle([a, ...wrongs]), optAr: true, a };
}

function zamirQ(): EQ {
  const kind = pick(['anlam', 'ar', 'dinle', 'ozne', 'yuklem', 'isaret', 'sifat', 'dizme', 'fiil-ozne', 'fiil-cekim', 'fiil-cekim', 'fiil-anlam', 'fiil-anlam', 'cevir', 'dogru', 'dogru', 'donustur', 'donustur']);
  if (kind === 'anlam' || kind === 'ar' || kind === 'dinle') {
    const pr = pick(PRONS);
    const tr = PRON_TR[pr.ar];
    // Çeldiriciler önce aynı kişiden (cinsiyet/sayı karışıklığı), sonra rastgele
    const near = PRONS.filter((x) => x !== pr && x.p === pr.p).map((x) => x.ar);
    const rest = shuffle(PRONS.filter((x) => x !== pr && x.p !== pr.p).map((x) => x.ar));
    const others = [...near, ...rest].slice(0, 3);
    const base = { key: 'z-' + kind + pr.ar, kind: 'zamir-' + kind, label: 'Zamir: ' + tr, full: pr.ar, fullTr: tr, why: pr.note };
    if (kind === 'ar') return { ...base, prompt: 'Bu zamirin Arapçası hangisi?', tr: cap(tr), options: shuffle([pr.ar, ...others]), optAr: true, a: pr.ar };
    return { ...base, prompt: kind === 'dinle' ? 'Dinle: hangi zamiri duydun?' : 'Bu zamirin anlamı ne?', ar: pr.ar, listen: kind === 'dinle', options: shuffle([tr, ...others.map((o) => PRON_TR[o])]), optAr: false, a: tr };
  }
  if (kind === 'ozne') {
    const pr = pick(PRONS), pd = pick(PREDS), fm = pick(pr.forms);
    const s = pd.ar[fm];
    const near = PRONS.filter((x) => x !== pr && (x.p === pr.p || x.forms.includes(fm))).map((x) => x.ar);
    const o = opts(pr.ar, [...shuffle(near), ...shuffle(PRONS.map((x) => x.ar))]);
    return {
      key: 'z-ozne' + pr.ar + s, kind: 'zamir-ozne', label: 'Zamir + yüklem: ' + pr.tr,
      prompt: `Boşluğa uygun zamiri seç: "${trSentence(pr, pd)}"`, ar: '___ ' + s, options: o, optAr: true, a: pr.ar,
      full: nom(pr, pd, fm), fullTr: trSentence(pr, pd),
      why: `${pr.note} Arapçada şimdiki zamanda "olmak" fiili yoktur: zamir + yüklem yeterlidir ({{${s}}} ${FORM_TR[fm]}).`
    };
  }
  if (kind === 'yuklem') {
    // Yalnızca tek bir yüklem biçimine uyan zamirler (ben, biz ve ikiller iki biçime uyabilir)
    const pr = pick(PRONS.filter((x) => x.forms.length === 1));
    const pd = pick(PREDS), fm = pr.forms[0];
    const o = opts(pd.ar[fm], shuffle(ALL_F.filter((f) => f !== fm).map((f) => pd.ar[f])));
    return {
      key: 'z-yuklem' + pr.ar + pd.tr, kind: 'zamir-yuklem', label: 'Yüklem uyumu: ' + pr.tr,
      prompt: `Boşluğa uygun kelimeyi seç (${pd.tr}).`, ar: pr.ar + ' ___', options: o, optAr: true, a: pd.ar[fm],
      full: nom(pr, pd, fm), fullTr: trSentence(pr, pd),
      why: `{{${pr.ar}}} ${low(pr.tr)} olduğu için yüklem de ${FORM_TR[fm]} olmalı: {{${pd.ar[fm]}}}.${fm === 'fs' ? ' Dişil tekil çoğunlukla ة alır.' : fm === 'fp' ? ' Dişil çoğul ـَاتٌ ile yapılır.' : ''}`
    };
  }
  if (kind === 'isaret') {
    // İşaret zamiri: "Bu bir kitap." (cümle) ya da "bu kitap" (isim grubu)
    const n = pick(NOUNS), far = chance(0.4), sentence = chance(0.7);
    const g = n.f ? 'f' : 'm', og = n.f ? 'm' : 'f';
    const d = far ? DEM.far : DEM.near, od = far ? DEM.near : DEM.far;
    const word = sentence ? ind(n.s) : def(n.s), oword = sentence ? def(n.s) : ind(n.s);
    const a = d[g] + ' ' + word;
    const trText = sentence ? `${far ? 'Şu' : 'Bu'} bir ${n.tr}.` : `${far ? 'şu' : 'bu'} ${n.tr} (isim grubu)`;
    return {
      key: 'z-isaret' + a, kind: 'zamir-isaret', label: 'İşaret zamiri: ' + (far ? 'şu' : 'bu') + (sentence ? ' (cümle)' : ' (isim grubu)'),
      prompt: 'Bu ifadenin Arapçası hangisi?', tr: trText,
      options: shuffle([a, d[og] + ' ' + word, od[g] + ' ' + word, d[g] + ' ' + oword]), optAr: true, a,
      full: a, fullTr: trText,
      why: `"${cap(n.tr)}" ({{${ind(n.s)}}}) ${genderWhy(n)} olduğu için ${far ? 'şu' : 'bu'} = {{${d[g]}}}. ` +
        (sentence ? 'İşaret zamiri + belirsiz (tenvinli) isim bir cümle kurar: "Bu bir ..."' : `İşaret zamiri + ال'li isim bir isim grubudur: "${far ? 'şu' : 'bu'} ..." (cümle değil).`)
    };
  }
  if (kind === 'sifat' || kind === 'dizme') return sifatQ(kind === 'dizme');
  if (kind === 'fiil-ozne') {
    // Fiilin biçiminden zamiri bul (aynı biçimi paylaşan zamirler seçeneklere konmaz)
    const pr = pick(PRONS), v = pick(VERBS), f = vf(pr, v);
    const cands = PRONS.filter((x) => vf(x, v) !== f);
    const o = opts(pr.ar, [...shuffle(cands.filter((x) => x.p === pr.p || x.vp === pr.vp)), ...shuffle(cands)].map((x) => x.ar));
    return {
      key: 'z-fozne' + pr.ar + v.s, kind: 'zamir-fiil', label: 'Fiil + zamir: ' + pr.tr,
      prompt: `Fiile uygun zamiri seç (${v.inf}).`, ar: '___ ' + f, options: o, optAr: true, a: pr.ar,
      full: vSent(pr, v), fullTr: vTr(pr, v), why: vWhy(pr, v)
    };
  }
  if (kind === 'fiil-cekim') {
    const pr = pick(PRONS), v = pick(VERBS), f = vf(pr, v);
    const near = PRONS.filter((x) => x.p === pr.p || x.vp === pr.vp).map((x) => vf(x, v));
    const o = opts(f, [...shuffle(near), ...shuffle(PRONS.map((x) => vf(x, v)))]);
    return {
      key: 'z-fcekim' + pr.ar + v.s, kind: 'zamir-fiil', label: 'Fiil çekimi: ' + pr.tr,
      prompt: `Boşluğa fiilin doğru hâlini seç (${v.inf}).`, ar: pr.ar + ' ___', options: o, optAr: true, a: f,
      full: vSent(pr, v), fullTr: vTr(pr, v), why: vWhy(pr, v)
    };
  }
  if (kind === 'fiil-anlam' || kind === 'cevir') {
    // Arapça cümleden Türkçesine (bazen yalnızca dinleyerek)
    const listen = chance(0.35), pr = pick(PRONS);
    const others = [...shuffle(PRONS.filter((x) => x !== pr && x.p === pr.p)), ...shuffle(PRONS.filter((x) => x !== pr))];
    let ar: string, tr: string, o: string[], why: string;
    if (kind === 'fiil-anlam') {
      const v = pick(VERBS);
      ar = vSent(pr, v); tr = vTr(pr, v); o = opts(tr, others.map((x) => vTr(x, v))); why = vWhy(pr, v);
    } else {
      const pd = pick(PREDS), fm = pick(pr.forms);
      ar = nom(pr, pd, fm); tr = trSentence(pr, pd); o = opts(tr, others.map((x) => trSentence(x, pd)));
      why = `${pr.note} Yüklem {{${pd.ar[fm]}}} ${FORM_TR[fm]}.`;
    }
    return {
      key: 'z-' + kind + ar, kind: 'zamir-cumle', label: listen ? 'Cümle dinleme' : 'Cümlenin anlamı',
      prompt: listen ? 'Dinle: bu cümle ne demek?' : 'Bu cümle ne demek?', ar, listen, options: o, optAr: false, a: tr,
      full: ar, fullTr: tr, why
    };
  }
  if (kind === 'dogru') {
    // Türkçe cümle verilir, dört Arapça cümleden doğru olanı seçilir
    const pr = pick(PRONS);
    if (chance(0.5)) {
      const v = pick(VERBS), a = vSent(pr, v);
      const wrong = [
        ...shuffle(PRONS.filter((x) => vf(x, v) !== vf(pr, v))).slice(0, 2).map((x) => pr.ar + ' ' + vf(x, v)),
        ...shuffle(PRONS.filter((x) => x !== pr && vf(x, v) !== vf(pr, v))).slice(0, 2).map((x) => x.ar + ' ' + vf(pr, v))
      ];
      return {
        key: 'z-dogruf' + a, kind: 'zamir-dogru', label: 'Doğru cümle: fiil', prompt: 'Bu cümlenin doğru Arapçası hangisi?',
        tr: vTr(pr, v), options: opts(a, shuffle(wrong)), optAr: true, a, full: a, fullTr: vTr(pr, v), why: vWhy(pr, v)
      };
    }
    const pd = pick(PREDS), fm = pick(pr.forms), a = nom(pr, pd, fm);
    const wrong = [
      ...shuffle(ALL_F.filter((f) => !pr.forms.includes(f))).slice(0, 2).map((f) => nom(pr, pd, f)),
      ...shuffle(PRONS.filter((x) => x.tr !== pr.tr && !x.forms.includes(fm))).slice(0, 2).map((x) => nom(x, pd, fm))
    ];
    return {
      key: 'z-dogruy' + a, kind: 'zamir-dogru', label: 'Doğru cümle: zamir + yüklem', prompt: 'Bu cümlenin doğru Arapçası hangisi?',
      tr: trSentence(pr, pd), options: opts(a, shuffle(wrong)), optAr: true, a, full: a, fullTr: trSentence(pr, pd),
      why: `${pr.note} Yüklem zamire uyar: {{${pd.ar[fm]}}} ${FORM_TR[fm]}.`
    };
  }
  // Dönüştürme: tekil cümleyi ikil/çoğul yap
  const TR: [string, F, string, F][] = [
    ['هُوَ', 'ms', 'هُمَا', 'md'], ['هُوَ', 'ms', 'هُمْ', 'mp'], ['هِيَ', 'fs', 'هُمَا', 'fd'], ['هِيَ', 'fs', 'هُنَّ', 'fp'],
    ['أَنْتَ', 'ms', 'أَنْتُمَا', 'md'], ['أَنْتَ', 'ms', 'أَنْتُمْ', 'mp'], ['أَنْتِ', 'fs', 'أَنْتُمَا', 'fd'], ['أَنْتِ', 'fs', 'أَنْتُنَّ', 'fp'],
    ['أَنَا', 'ms', 'نَحْنُ', 'mp'], ['أَنَا', 'fs', 'نَحْنُ', 'fp']
  ];
  const [fa, ff, ta, tf] = pick(TR), from = PR(fa), to = PR(ta);
  const kindTr = tf.endsWith('d') ? 'ikil (iki kişi)' : 'çoğul';
  if (!tf.endsWith('d') && chance(0.5)) {
    const v = pick(VERBS), a = vf(to, v);
    const o = opts(a, shuffle([vf(from, v), ...PRONS.map((x) => vf(x, v))]));
    return {
      key: 'z-donf' + fa + ta + v.s, kind: 'zamir-donustur', label: 'Dönüştürme: fiil', prompt: `Cümleyi {{${ta}}} ile söyle. Fiil ne olur?`,
      ar: `${vSent(from, v)} ← ${ta} ___`, options: o, optAr: true, a, full: vSent(to, v), fullTr: vTr(to, v),
      why: `{{${vSent(from, v)}}} "${vTr(from, v)}" demek. ${vWhy(to, v)}`
    };
  }
  const pd = pick(PREDS), a = pd.ar[tf];
  // Aynı zamire uyan öbür biçim (ör. هُمَا için diğer ikil) karışmasın diye seçeneklere konmaz
  const o = opts(a, shuffle(ALL_F.filter((f) => f === ff || !to.forms.includes(f)).map((f) => pd.ar[f])));
  return {
    key: 'z-dony' + fa + ta + pd.tr, kind: 'zamir-donustur', label: 'Dönüştürme: ' + kindTr,
    prompt: `Cümleyi {{${ta}}} ile söyle. Yüklem ne olur?`, ar: `${nom(from, pd, ff)} ← ${ta} ___`, options: o, optAr: true, a,
    full: nom(to, pd, tf), fullTr: trSentence(to, pd),
    why: `{{${nom(from, pd, ff)}}} "${trSentence(from, pd)}" demek. {{${ta}}} ${kindTr} olduğu için yüklem ${FORM_TR[tf]} olur: {{${a}}}.`
  };
}

/* ================= İyelik ekleri ================= */
// Ekler (sıra: ben, sen-e, sen-k, o-e, o-k, biz, siz, onlar)
const SUF = ['ي', 'كَ', 'كِ', 'هُ', 'هَا', 'نَا', 'كُمْ', 'هُمْ'];
const SUF_SHOW = ['ـِي', 'ـكَ', 'ـكِ', 'ـهُ', 'ـهَا', 'ـنَا', 'ـكُمْ', 'ـهُمْ'];
const SUF_TR = ['benim', 'senin (erkek)', 'senin (kadın)', 'onun (erkek)', 'onun (kadın)', 'bizim', 'sizin', 'onların'];
const IND = ['عِنْدِي', 'عِنْدَكَ', 'عِنْدَكِ', 'عِنْدَهُ', 'عِنْدَهَا', 'عِنْدَنَا', 'عِنْدَكُمْ', 'عِنْدَهُمْ'];
const IND_TR = ['Bende', 'Sende (erkek)', 'Sende (kadın)', 'Onda (erkek)', 'Onda (kadın)', 'Bizde', 'Sizde', 'Onlarda'];
// s: yalın gövde (ة dahil); tb: Türkçe yalın; tr: [benim, senin, onun, bizim, sizin]; own: "bende bir ... var" ile kullanılabilir
type PNoun = { s: string; tb: string; tr: string[]; f: boolean; x?: boolean; c: Noun['c']; own?: boolean };
const P = (s: string, tb: string, tr: string, c: Noun['c'], o: { own?: boolean; x?: boolean } = {}): PNoun =>
  ({ s, tb, tr: tr.split(' '), c, f: !!o.x || s.endsWith('ة'), ...o });
const PNOUNS: PNoun[] = [
  P('كِتَاب', 'kitap', 'kitabım kitabın kitabı kitabımız kitabınız', 't', { own: true }),
  P('قَلَم', 'kalem', 'kalemim kalemin kalemi kalemimiz kaleminiz', 't', { own: true }),
  P('دَفْتَر', 'defter', 'defterim defterin defteri defterimiz defteriniz', 't', { own: true }),
  P('هَاتِف', 'telefon', 'telefonum telefonun telefonu telefonumuz telefonunuz', 't', { own: true }),
  P('حَاسُوب', 'bilgisayar', 'bilgisayarım bilgisayarın bilgisayarı bilgisayarımız bilgisayarınız', 't', { own: true }),
  P('قَمِيص', 'gömlek', 'gömleğim gömleğin gömleği gömleğimiz gömleğiniz', 't', { own: true }),
  P('مِفْتَاح', 'anahtar', 'anahtarım anahtarın anahtarı anahtarımız anahtarınız', 't', { own: true }),
  P('بَاب', 'kapı', 'kapım kapın kapısı kapımız kapınız', 't'),
  P('بَيْت', 'ev', 'evim evin evi evimiz eviniz', 'p', { own: true }),
  P('صَدِيق', 'arkadaş', 'arkadaşım arkadaşın arkadaşı arkadaşımız arkadaşınız', 'l'),
  P('وَلَد', 'çocuk', 'çocuğum çocuğun çocuğu çocuğumuz çocuğunuz', 'l'),
  P('كَلْب', 'köpek', 'köpeğim köpeğin köpeği köpeğimiz köpeğiniz', 'l', { own: true }),
  P('قِطّ', 'kedi', 'kedim kedin kedisi kedimiz kediniz', 'l', { own: true }),
  P('اِسْم', 'isim', 'ismim ismin ismi ismimiz isminiz', 'o'),
  P('بَلَد', 'ülke', 'ülkem ülken ülkesi ülkemiz ülkeniz', 'o'),
  P('دَرْس', 'ders', 'dersim dersin dersi dersimiz dersiniz', 'o'),
  P('سَيَّارَة', 'araba', 'arabam araban arabası arabamız arabanız', 't', { own: true }),
  P('حَقِيبَة', 'çanta', 'çantam çantan çantası çantamız çantanız', 't', { own: true }),
  P('سَاعَة', 'saat', 'saatim saatin saati saatimiz saatiniz', 't', { own: true }),
  P('طَاوِلَة', 'masa', 'masam masan masası masamız masanız', 't', { own: true }),
  P('صُورَة', 'fotoğraf', 'fotoğrafım fotoğrafın fotoğrafı fotoğrafımız fotoğrafınız', 'o', { own: true }),
  P('غُرْفَة', 'oda', 'odam odan odası odamız odanız', 'p'),
  P('مَدْرَسَة', 'okul', 'okulum okulun okulu okulumuz okulunuz', 'p'),
  P('مَدِينَة', 'şehir', 'şehrim şehrin şehri şehrimiz şehriniz', 'p'),
  P('جَامِعَة', 'üniversite', 'üniversitem üniversiten üniversitesi üniversitemiz üniversiteniz', 'p'),
  P('عَائِلَة', 'aile', 'ailem ailen ailesi ailemiz aileniz', 'o'),
  P('لُغَة', 'dil', 'dilim dilin dili dilimiz diliniz', 'o'),
  P('أُمّ', 'anne', 'annem annen annesi annemiz anneniz', 'l', { x: true }),
  P('بِنْت', 'kız', 'kızım kızın kızı kızımız kızınız', 'l', { x: true })
];
const ta = (n: PNoun) => n.s.endsWith('ة');
const stem = (n: PNoun) => (ta(n) ? n.s.slice(0, -1) + 'ت' : n.s);
const withSuf = (n: PNoun, i: number) => stem(n) + (i === 0 ? 'ِي' : 'ُ' + SUF[i]);
// Türkçe: [ifade, kişi notu]
const pParts = (n: PNoun, i: number): [string, string] => {
  const [b, s, o, bz, sz] = n.tr;
  return ([[b, ''], [s, ' (erkek)'], [s, ' (kadın)'], ['onun ' + o, ' (erkek)'], ['onun ' + o, ' (kadın)'], [bz, ''], [sz, ''], ['onların ' + o, '']] as [string, string][])[i];
};
const pTr = (n: PNoun, i: number) => pParts(n, i).join('');
const sufWhy = (n: PNoun, i: number) =>
  `{{${SUF_SHOW[i]}}} eki "${SUF_TR[i]}" anlamı verir: {{${withSuf(n, i)}}}.` +
  (ta(n) ? ' ة ile biten isim ek alınca ة, ت olur.' : '') + ' Ek alan isim ال almaz.';
// Çeldiriciler: önce karışan çiftler (sen e/k, o e/k, sen/siz...), sonra diğerleri
const PAIR: Record<number, number[]> = { 0: [5], 1: [2, 6], 2: [1, 6], 3: [4, 7], 4: [3, 7], 5: [0], 6: [1, 2], 7: [3, 4] };
const sibsOf = (i: number) => [...new Set([...shuffle(PAIR[i]), ...shuffle([0, 1, 2, 3, 4, 5, 6, 7].filter((j) => j !== i))])].slice(0, 3);

function iyelikQ(): EQ {
  const kind = pick(['anlam', 'anlam', 'ar', 'ar', 'dinle', 'ek', 'inde', 'inde', 'isaret', 'isaret', 'donustur', 'donustur', 'sifat', 'sifat', 'dizme', 'dizme']);
  const n = pick(PNOUNS), i = Math.floor(Math.random() * 8);
  const form = withSuf(n, i), tr = pTr(n, i), js = sibsOf(i);
  // ة ile biten isimlerde asıl zorluk ة'nin ت'ye dönmesi
  const rule = ta(n) ? 'ta' : 'iyelik';
  const base = { full: form, fullTr: tr, why: sufWhy(n, i), g: rule };
  if (kind === 'anlam' || kind === 'dinle') {
    return { ...base, key: 'i-' + kind + form, kind: 'iyelik-' + kind, label: 'İyelik: ' + SUF_TR[i],
      prompt: kind === 'dinle' ? 'Dinle: ne duydun?' : 'Bu kelimenin anlamı ne?', ar: form, listen: kind === 'dinle',
      options: shuffle([tr, ...js.map((j) => pTr(n, j))]), optAr: false, a: tr };
  }
  if (kind === 'ar') {
    // Bazen tipik hatalar da seçeneklerde: ال + ek, ة'nin ت'ye dönmemesi
    const traps: string[] = [];
    if (!isSun(n.s[0]) && n.s[0] !== 'ا' && chance(0.5)) traps.push('الْ' + form);
    if (ta(n) && chance(0.6)) traps.push(form.replace(stem(n), n.s));
    const o = [...traps, ...js.map((j) => withSuf(n, j))].slice(0, 3);
    return { ...base, key: 'i-ar' + form, kind: 'iyelik-ar', label: 'İyelik: ' + SUF_TR[i], prompt: 'Arapçası hangisi?', tr: cap(tr),
      options: shuffle([form, ...o]), optAr: true, a: form };
  }
  if (kind === 'ek') {
    return { ...base, key: 'i-ek' + form, kind: 'iyelik-ek', label: 'Doğru ek: ' + SUF_TR[i],
      prompt: `"${cap(tr)}" demek için {{${n.s}}} kelimesine hangi ek gelir?`, ar: n.s + ' + ___',
      options: shuffle([SUF_SHOW[i], ...js.map((j) => SUF_SHOW[j])]), optAr: true, a: SUF_SHOW[i] };
  }
  if (kind === 'donustur') {
    // Ekli kelimeyi başka bir kişiye çevir: كِتَابِي → كِتَابُهَا
    const j = pick([0, 1, 2, 3, 4, 5, 6, 7].filter((k) => k !== i)), a = withSuf(n, j);
    return { key: 'i-don' + form + j, kind: 'iyelik-donustur', label: 'Ek değiştirme: ' + SUF_TR[j], g: rule,
      prompt: `{{${form}}} "${tr}" demek. "${cap(pTr(n, j))}" nasıl denir?`, ar: form,
      options: opts(a, [form, ...sibsOf(j).map((k) => withSuf(n, k))]), optAr: true, a, full: a, fullTr: pTr(n, j), why: sufWhy(n, j) };
  }
  if (kind === 'isaret') {
    // "Bu kitabım." هٰذَا كِتَابِي
    const g = n.f ? 'f' : 'm', og = n.f ? 'm' : 'f', a = DEM.near[g] + ' ' + form;
    const trS = `Bu ${tr}.`;
    return { key: 'i-isaret' + a, kind: 'iyelik-cumle', label: 'İşaret + iyelik: ' + SUF_TR[i], g: rule, prompt: 'Bu cümlenin Arapçası hangisi?', tr: trS,
      options: shuffle([a, DEM.near[og] + ' ' + form, ...js.slice(0, 2).map((j) => DEM.near[g] + ' ' + withSuf(n, j))]), optAr: true, a, full: a, fullTr: trS,
      why: `"${cap(n.tb)}" ${genderWhy(n)} olduğu için "bu" = {{${DEM.near[g]}}}. ${sufWhy(n, i)}` };
  }
  if (kind === 'sifat') {
    // "Arabam yeni." سَيَّارَتِي جَدِيدَةٌ
    const adj = adjFor(n.c), a = form + ' ' + adjF(adj, n.f);
    const [ph, lb] = pParts(n, i), trS = `${cap(ph)} ${adj.tr}${lb}.`;
    return { key: 'i-sifat' + a, kind: 'iyelik-cumle', label: 'İyelik + sıfat: ' + SUF_TR[i], g: rule, prompt: 'Bu cümlenin Arapçası hangisi?', tr: trS,
      options: shuffle([a, form + ' ' + adjF(adj, !n.f), withSuf(n, js[0]) + ' ' + adjF(adj, n.f), def(n.s) + ' ' + adjF(adj, n.f)]), optAr: true, a,
      full: a, fullTr: trS,
      why: `${sufWhy(n, i)} "${cap(n.tb)}" ${genderWhy(n)} olduğu için sıfat da ${n.f ? 'dişil' : 'eril'}: {{${adjF(adj, n.f)}}}. {{${def(n.s)} ${adjF(adj, n.f)}}} "${cap(n.tb)} ${adj.tr}." demek olurdu.` };
  }
  // عِنْدَ + ek: sahiplik ("Bende bir kalem var."); dizme sorusunda sıfatla ("Bende yeni bir kitap var.")
  const hn = pick(PNOUNS.filter((x) => x.own));
  if (kind === 'dizme') {
    const adj = adjFor(hn.c), words = [IND[i], ind(hn.s), adjF(adj, hn.f)], a = words.join(' ');
    const trS = `${IND_TR[i]} ${adj.tr} bir ${hn.tb} var.`;
    const alt = [`${IND[js[0]]} ${ind(hn.s)} ${adjF(adj, hn.f)}`, `${IND[i]} ${ind(hn.s)} ${adjF(adj, !hn.f)}`, `${IND[i]} ${adjF(adj, hn.f)} ${ind(hn.s)}`];
    return tileQ({ key: 'i-dizme' + a, kind: 'iyelik-dizme', label: 'Cümle kurma: عِنْدَ + isim + sıfat', g: 'dizme', tr: trS, full: a, fullTr: trS,
      why: `"${IND_TR[i]} var" = {{${IND[i]}}}. Sıfat ismin arkasına gelir ve ona uyar: "${hn.tb}" ${genderWhy(hn)} olduğu için {{${adjF(adj, hn.f)}}}.` },
    words, chance(0.5) ? IND[js[0]] : adjF(adj, !hn.f), alt);
  }
  const a = IND[i] + ' ' + ind(hn.s);
  const trS = `${IND_TR[i]} bir ${hn.tb} var.`;
  return { key: 'i-inde' + a, kind: 'iyelik-inde', label: 'Sahiplik: ' + IND_TR[i], g: 'inde', prompt: 'Bu cümlenin Arapçası hangisi?', tr: trS,
    options: shuffle([a, ...js.map((j) => IND[j] + ' ' + ind(hn.s))]), optAr: true, a, full: a, fullTr: trS,
    why: `"Sahip olmak" Arapçada {{عِنْدَ}} + ek ile söylenir: {{عِنْدَ}} + {{${SUF_SHOW[i]}}} = {{${IND[i]}}} "${low(IND_TR[i])}".` };
}

/* ================= Kelimeler (diğer dersler) ================= */
function wordQ(words: Word[]): EQ {
  const w = pick(words);
  const kind = pick(['anlam', 'anlam', 'ar', 'ar', 'dinle']);
  const others = shuffle(words.filter((x) => x.ar !== w.ar && x.tr !== w.tr));
  const why = (w.tl ? `Okunuşu: ${w.tl}.` : '') + (w.note ? ' ' + w.note : '');
  const base = { full: w.ar, fullTr: w.tr, why, g: 'kelime' };
  if (kind === 'ar') return { ...base, key: 'k-ar' + w.ar, kind: 'kelime-ar', label: 'Kelime: Türkçeden Arapçaya', prompt: 'Arapçası hangisi?', tr: cap(w.tr), options: opts(w.ar, others.map((x) => x.ar)), optAr: true, a: w.ar };
  return { ...base, key: 'k-' + kind + w.ar, kind: 'kelime-' + kind, label: kind === 'dinle' ? 'Kelime: dinle' : 'Kelime: anlamı', prompt: kind === 'dinle' ? 'Dinle: hangi kelimeyi duydun?' : 'Bu kelimenin anlamı ne?', ar: w.ar, listen: kind === 'dinle', options: opts(w.tr, others.map((x) => x.tr)), optAr: false, a: w.tr };
}

/** Derse göre soru üretici; kelimesi az olan derslerde kullanılmaz */
export function endlessGen(topicId: string, words: Word[]): (() => EQ) | null {
  if (topicId === 'zamirler') return () => { const q = zamirQ(); return { ...q, g: q.g || zamirRule(q) }; };
  if (topicId === 'iyelik') return iyelikQ;
  // Alfabe ve sözlük sayfalarındaki ek alıştırmalar (benzer sesler, rakamlar, zıt ve eş anlamlılar)
  if (DRILLS[topicId]) return DRILLS[topicId].gen;
  // Sayılar dersinde kelimelerin yanında Arapça rakam okuma ve sayı dinleme
  if (topicId === 'sayilar' && words.length >= 4) return () => (Math.random() < 0.5 ? rakamQ() : wordQ(words));
  return words.length >= 4 ? () => wordQ(words) : null;
}
/** Art arda aynı soru gelmesin (son birkaç soru hatırlanır) */
export function nextQ(gen: () => EQ, recent: string[]): EQ {
  for (let k = 0; k < 20; k++) { const q = gen(); if (!recent.includes(q.key)) return q; }
  return gen();
}

/** Ses üretimi için soruların seslendirdiği Arapça ifadeler (dinleme soruları ve cevap sonrası tam cümle) */
export function endlessTexts(): string[] {
  const out = new Set<string>(PRONS.map((p) => p.ar));
  for (const pr of PRONS) {
    for (const pd of PREDS) for (const f of pr.forms) out.add(nom(pr, pd, f));
    for (const v of VERBS) out.add(vSent(pr, v));
  }
  for (const n of NOUNS) {
    const g = n.f ? 'f' : 'm';
    for (const d of [DEM.near, DEM.far]) {
      out.add(d[g] + ' ' + ind(n.s)); out.add(d[g] + ' ' + def(n.s));
      for (const a of ADJ.filter((x) => x.k.includes(n.c))) out.add(`${d[g]} ${def(n.s)} ${adjF(a, n.f)}`);
    }
  }
  for (const n of PNOUNS) {
    for (let i = 0; i < 8; i++) {
      const w = withSuf(n, i);
      out.add(w); out.add(DEM.near[n.f ? 'f' : 'm'] + ' ' + w);
      for (const a of ADJ.filter((x) => x.k.includes(n.c))) out.add(w + ' ' + adjF(a, n.f));
    }
  }
  for (const t of [...soundTexts(), ...numberTexts(), ...pairTexts(), ...loanTexts()]) out.add(t);
  for (const n of PNOUNS.filter((x) => x.own)) {
    for (const x of IND) {
      out.add(x + ' ' + ind(n.s));
      for (const a of ADJ.filter((y) => y.k.includes(n.c))) out.add(`${x} ${ind(n.s)} ${adjF(a, n.f)}`);
    }
  }
  return [...out];
}
