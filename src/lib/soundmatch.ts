/* Kelime bul: Latin harfli yazımı harekeli Arapça yazımla harf harf karşılaştırır (sunucu, tarayıcı ve testler ortak kullanır).

   Kural: ünsüzler kesindir. Yazılan her ünsüz kelimede bulunmalı, kelimedeki her ünsüz de yazılmış olmalı.
   Esnek olanlar: harekeler (e/a, i/ı, u/ü aynı sayılır), cezm (ünlü yazılmamış ya da fazladan yazılmış), şedde
   (harf tek ya da çift yazılmış), uzatmalar ve kolayca duyulmayan sesler (ayn, hemze, tâ merbûta, belirlilik takısı,
   tenvin). Yazımda ş, ç, ğ, ö ya da ü geçmiyorsa kullanıcının klavyesinde Türkçe harf olmayabilir; o zaman s harfi
   ş (ش), g harfi ğ (غ) yerine de geçer. */

/* ---------- Arapça tarafı ---------- */
const FATHA = 'َ', DAMMA = 'ُ', KASRA = 'ِ', SUKUN = 'ْ', SHADDA = 'ّ';
const FATHATAN = 'ً', DAMMATAN = 'ٌ', KASRATAN = 'ٍ', DAGGER = 'ٰ';
const MARK_RE = /[ً-ٰٟۖ-ۜ۟-۪ۨ-ۭ]/;

/** Harf sınıfları: Latin harflerin karşılayabileceği Arapça harfler bu kısa adlarla tutulur */
const LETTER: Record<string, string> = {
  'ب': 'b', 'پ': 'b', 'ت': 't', 'ث': 'θ', 'ج': 'j', 'چ': 'j', 'ح': 'ḥ', 'خ': 'x', 'د': 'd', 'ذ': 'ð', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'š', 'ص': 'ṣ', 'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ', 'ع': 'ʿ', 'غ': 'ġ', 'ف': 'f', 'ڤ': 'f', 'ق': 'q',
  'ك': 'k', 'ک': 'k', 'گ': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'ة': 'T', 'و': 'w', 'ي': 'y', 'ی': 'y',
  'ء': 'ʾ', 'أ': 'ʾ', 'إ': 'ʾ', 'آ': 'ʾ', 'ؤ': 'ʾ', 'ئ': 'ʾ', 'ا': 'A', 'ٱ': 'A', 'ى': 'Y'
};
const SUN = new Set(['t', 'θ', 'd', 'ð', 'r', 'z', 's', 'š', 'ṣ', 'ḍ', 'ṭ', 'ẓ', 'l', 'n']);

/** Ünsüz: k harf sınıfı; opt kelimede olup yazılmayabilir; lv atlanırsa yerine kalan uzun ünlü */
type Tok = { k: string; opt: boolean; lv: string };
/** Ünsüzler ve aralarındaki ünlüler: gaps[0] ilk ünsüzden önce, gaps[i + 1] i. ünsüzden sonra */
/** lead: kelime elifle (vasl) başlıyor; ilk ünlü yazılmamış olsa da okunur (ism, ibn) */
export type Seq = { toks: Tok[]; gaps: string[]; lead: boolean };

type Letter = { b: string; marks: string; start: boolean; end: boolean };

function letters(word: string): Letter[] {
  const out: Letter[] = [];
  for (const ch of word) {
    if (MARK_RE.test(ch)) { if (out.length) out[out.length - 1].marks += ch; continue; }
    if (ch === '\u0640') continue;
    if (!LETTER[ch]) continue;
    out.push({ b: ch, marks: '', start: out.length === 0, end: false });
  }
  if (out.length) out[out.length - 1].end = true;
  return out;
}

const vowelOf = (m: string) => (m.includes(FATHA) || m.includes(FATHATAN) ? 'a' : m.includes(KASRA) || m.includes(KASRATAN) ? 'i' : m.includes(DAMMA) || m.includes(DAMMATAN) ? 'u' : '');
const tanwin = (m: string) => m.includes(FATHATAN) || m.includes(DAMMATAN) || m.includes(KASRATAN);

/** Harekeli Arapça yazımı ünsüz ve ünlü dizisine çevirir */
export function arabicSeq(text: string): Seq {
  const toks: Tok[] = [];
  const gaps: string[] = [''];
  const push = (k: string, opt: boolean, lv = '') => { toks.push({ k, opt, lv }); gaps.push(''); };
  const vow = (v: string) => { if (v) gaps[gaps.length - 1] += v; };
  for (const word of String(text || '').normalize('NFC').split(/[\s\u200B-\u200F\u2060\uFEFF،,.;:!?؟؛()«»"'/-]+/)) {
    const ls = letters(word);
    // Kelime sonundaki kısa harekeler (i‘râb) okunuşta çoğunlukla yazılmaz: karşılaştırmaya katılmaz
    const firstTok = toks.length;
    let prevV = '';
    for (let i = 0; i < ls.length; i++) {
      const L = ls[i], m = L.marks, k = LETTER[L.b];
      // Tenvinin ünlüsü çekim ekidir, karşılaştırılmaz; uzun ünlüler büyük harfle (A I U) tutulur
      const v = (tanwin(m) ? '' : vowelOf(m)) + (m.includes(DAGGER) ? 'A' : '');
      const next = ls[i + 1];
      if (k === 'A') {
        // Kelime başındaki elif (vasl ya da belirlilik takısı) okunmayabilir; ortadaki elif uzun â
        const article = next && LETTER[next.b] === 'l' && (next.marks.includes(SUKUN) || !vowelOf(next.marks)) && ls[i + 2] && (SUN.has(LETTER[ls[i + 2].b]) || next.marks.includes(SUKUN));
        if (L.start || article) push('ʾ', true);
        else if (!(i > 0 && ls[i - 1].marks.includes(FATHATAN))) vow('A');
        vow(vowelOf(m));
        prevV = 'a';
        continue;
      }
      if (k === 'Y') { vow('A'); prevV = 'a'; continue; }
      if (k === 'ʾ') { push('ʾ', true); if (L.b === 'آ') vow('A'); vow(v); prevV = v; continue; }
      if (k === 'T') { push('T', true); vow(v); if (tanwin(m)) push('n', true); prevV = v || vowelOf(m); continue; }
      if (k === 'w' || k === 'y') {
        const shadda = m.includes(SHADDA);
        const own = tanwin(m) ? '' : vowelOf(m);
        const long = (k === 'y' && prevV === 'i') || (k === 'w' && prevV === 'u');
        if (L.start) push(k, false);
        else if (shadda) push(k, L.end && long, L.end && long ? (k === 'y' ? 'I' : 'U') : '');
        else if (own && !m.includes(SUKUN)) push(k, false);
        else if (long) push(k, true, k === 'y' ? 'I' : 'U');
        // Cezmli vav/ye (beyt, yevm) okunur; hiç işaret yoksa (harekesiz yazım) belirsizdir
        else push(k, !m.includes(SUKUN));
        vow(own);
        if (tanwin(m)) push('n', true);
        prevV = own || (tanwin(m) ? vowelOf(m) : long ? prevV : '');
        continue;
      }
      // Belirlilik takısının lâm harfi: güneş harflerinden önce okunmaz, yazımda da atlanabilir
      const isArticle = k === 'l' && i > 0 && LETTER[ls[i - 1].b] === 'A' && (ls[i - 1].start || toks[toks.length - 1]?.k === 'ʾ') && !!next;
      // Ayn çoğu zaman yazılmaz ya da ünlü gibi yazılır (‘amel = amel)
      push(k, isArticle || k === 'ʿ');
      vow(v);
      if (tanwin(m)) push('n', true);
      prevV = v || vowelOf(m);
    }
    // Son ünsüzden sonraki kısa ünlüler atılır, uzun ünlüler (ا ى و ي) kalır
    if (toks.length > firstTok) {
      const g = gaps.length - 1;
      const tail = ls.length ? ls[ls.length - 1] : null;
      const longEnd = tail && (LETTER[tail.b] === 'A' || LETTER[tail.b] === 'Y' || tail.marks.includes(DAGGER));
      if (!longEnd) gaps[g] = '';
    }
  }
  const lead = /^\s*[اٱ]/.test(String(text || '').normalize('NFC'));
  return { toks, gaps: gaps.map(squash), lead };
}

const squash = (s: string) => s.replace(/(.)\1+/g, '$1');

/* ---------- Latin tarafı ---------- */
/** sets[0]: karşıladığı harfler; ikili yazımda (sh) sets[1] + sets[2] iki ayrı harf; soft: küçük cezayla karşıladıkları */
type LTok = { sets: string[][]; opt: boolean; key: string; soft?: string[] };
/** lead: baştaki ünlü belirlilik takısının olabilir (el-kitab, eşşems) */
export type LatSeq = { toks: LTok[]; gaps: string[]; tr: boolean; lead: boolean };

const VOWELS: Record<string, string> = { a: 'a', e: 'a', â: 'a', ê: 'a', ä: 'a', á: 'a', à: 'a', i: 'i', ı: 'i', î: 'i', ï: 'i', í: 'i', u: 'u', ü: 'u', û: 'u', o: 'u', ö: 'u', ô: 'u', ó: 'u', ú: 'u' };
const APOS = /['’‘`´ʿʾʻ]/;

/** Türkçe harfsiz yazımda (klavyede ş, ğ yok) s harfi ş, g harfi ayn yerine de geçebilir: küçük cezayla */
function softSet(c: string, tr: boolean): string[] | undefined {
  if (tr) return undefined;
  if (c === 's') return ['š'];
  if (c === 'g') return ['ʿ'];
  return undefined;
}

function letterSets(c: string, tr: boolean, wordEnd: boolean): string[] | null {
  switch (c) {
    case 'b': case 'p': return ['b'];
    case 't': return ['t', 'ṭ', 'T'];
    case 'd': return ['d', 'ḍ'];
    case 's': return ['s', 'ṣ', 'θ'];
    case 'ş': return ['š'];
    case 'c': case 'ç': case 'j': return ['j'];
    case 'h': return wordEnd ? ['ḥ', 'h', 'x', 'T'] : ['ḥ', 'h', 'x'];
    case 'x': return ['x'];
    case 'z': return ['z', 'ð', 'ẓ', 'ḍ'];
    case 'r': return ['r'];
    case 'f': return ['f'];
    case 'k': return ['k', 'q'];
    case 'q': return ['q'];
    case 'g': return ['q', 'ġ'];
    case 'ğ': return ['ġ', 'ʿ'];
    case 'l': return ['l'];
    case 'm': return ['m'];
    case 'n': return ['n'];
    case 'v': case 'w': return ['w'];
    case 'y': return ['y'];
    default: return null;
  }
}
const H = ['ḥ', 'h', 'x'];
// İki harfle yazılan sesler: tek ses (sh = ş) ya da iki ayrı harf (Türkçe ashâb = s + h) olabilir
const DIGRAPH: Record<string, [string[], string[], string[]]> = {
  sh: [['š'], ['s', 'ṣ', 'θ'], H],
  kh: [['x'], ['k', 'q'], H],
  gh: [['ġ'], ['q', 'ġ'], H],
  th: [['θ'], ['t', 'ṭ'], H],
  dh: [['ð', 'ẓ'], ['d', 'ḍ'], H],
  ch: [['j'], ['j'], H]
};

/** Latin harfli yazımı ünsüz ve ünlü dizisine çevirir */
export function latinSeq(input: string): LatSeq {
  const s = String(input || '').toLocaleLowerCase('tr').normalize('NFC');
  const tr = /[şçğöü]/.test(s);
  const toks: LTok[] = [];
  const gaps: string[] = [''];
  const words = s.split(/[\s\-_.,;:!?()]+/).filter(Boolean);
  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    const first = toks.length;
    const chars = [...word];
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (VOWELS[c]) { gaps[gaps.length - 1] += VOWELS[c]; continue; }
      if (APOS.test(c)) { toks.push({ sets: [['ʿ', 'ʾ']], opt: false, key: "'" }); gaps.push(''); continue; }
      const di = DIGRAPH[c + (chars[i + 1] || '')];
      if (di) {
        toks.push({ sets: di, opt: false, key: c + chars[i + 1], soft: c === 's' && !tr ? ['s', 'ṣ', 'θ'] : undefined });
        gaps.push('');
        i++;
        continue;
      }
      const end = !chars.slice(i + 1).some((x) => !VOWELS[x]);
      const set = letterSets(c, tr, end && w === words.length - 1);
      if (!set) continue;
      // Şedde: aynı harf iki kez yazılmış (müderris, eşşems)
      const prev = toks[toks.length - 1];
      if (prev && prev.key === c && gaps[gaps.length - 1] === '' && toks.length > first) continue;
      toks.push({ sets: [set], opt: false, key: c, soft: softSet(c, tr) });
      gaps.push('');
    }
    const mine = toks.slice(first);
    const cons = mine.filter((t) => t.key !== "'").length;
    // Belirlilik takısı: el-kitab, elkitab, el kitab (kelimenin geri kalanında en az iki ünsüz varsa)
    if (mine.length && mine[0].key === 'l' && /^[aeiıuü]?l/.test(word) && (cons >= 3 || (word.length <= 3 && w < words.length - 1))) {
      const after = word.replace(/^[aeiıuü]?l/, '');
      if (!after || !VOWELS[[...after][0]]) mine[0].opt = true;
    }
    // Tenvin: sondaki -un, -in, -an yazılmış olabilir (kitâbun)
    const last = mine[mine.length - 1];
    if (last && last.key === 'n' && cons >= 3 && /[aeiıuüoöâîû]n$/.test(word)) last.opt = true;
  }
  const w0 = words[0] || '';
  const lead = /^[aeiıuü]l/.test(w0) || /^[aeiıuü]([^aeiıuüoöâîû])\1/.test(w0);
  return { toks, gaps: gaps.map(squash), tr, lead };
}

/* ---------- Karşılaştırma ---------- */
/**
 * Ünlü aralığı farkı (lat: yazılan, ar: kelimedeki). Uyuşmazlık başına 100, sıralama için küçük cezalar.
 * start: kelime başı; Arapça ünlüyle başlıyorsa (‘ilm, esed) ilk ünlü yazılmış olmalı
 * mid: iki ünsüz arası; bir taraf boşsa cezm sayılır, yazılan fazladan ünlüler (eau) atlanmış bir harfe işarettir
 * end: son ünsüzden sonrası; çekim ve durak ekleri (kitâbu, kitâbi) serbest
 */
function gapCost(lat: string, ar: string, where: 'start' | 'mid' | 'end' = 'mid', lead = false): number {
  const a = squash(lat), b = squash(ar.toLowerCase());
  if (a === b) return 0;
  // Sondaki uzun ünlü (kitâbî, ismî) hiç yazılmadıysa kelime farklıdır; kısa ünlü (çekim eki) yazılmayabilir
  if (!a) return where === 'start' ? 100 : where === 'end' ? (/[AIU]/.test(ar) ? 100 : 0) : 0.05;
  // Yazılan ünlünün kelimede karşılığı yok: başta yalnızca belirlilik takısı ya da vasl elifiyse, sonda çekim ekiyse olur
  if (!b) return where === 'end' ? 0.03 : where === 'start' ? (lead ? 0.02 : 100) : new Set(a).size > 1 ? 100 : 0.05;
  if (where === 'end' && a.length > b.length) return a.startsWith(b) ? 0 : alignCost(b, a);
  const extra = where !== 'end' && a.length > b.length ? (a.length - b.length) * 100 : 0;
  return extra + alignCost(a.length <= b.length ? a : b, a.length <= b.length ? b : a) - (extra ? (a.length - b.length) * 0.02 : 0);
}

/** Kısa diziyi uzun dizinin içine sırayla yerleştirip en az uyuşmazlığı bulur */
function alignCost(s: string, l: string): number {
  // Kısa diziyi uzun dizinin içine sırayla yerleştir, en az uyuşmazlığı bul
  if (s === l) return 0;
  let prev = new Array(l.length + 1).fill(0);
  for (let i = 1; i <= s.length; i++) {
    const cur = new Array(l.length + 1).fill(Infinity);
    for (let j = i; j <= l.length; j++) cur[j] = Math.min(cur[j - 1], prev[j - 1] + (s[i - 1] === l[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[l.length] * 100 + 0.02 * (l.length - s.length);
}

export type SoundMatch = { miss: number; pen: number };

const MAX_LSKIP = 2, MAX_ASKIP = 4;
/** Atlanan Arapça harfin sıralama cezası: ayn çoğu zaman duyulur, diğerleri (hemze, tâ merbûta, uzatma, takı) kolayca yazılmaz */
const skipPen = (A: Seq, from: number, to: number) => { let p = 0; for (let j = from; j < to; j++) p += A.toks[j].k === 'ʿ' ? 0.03 : 0.01; return p; };

/**
 * Latin yazım Arapça kelimeye uyuyor mu? Uymuyorsa null.
 * miss: ünlü sınıfı farklı olan yer sayısı (0 ise tam eşleşme); pen: sıralama için küçük cezalar
 */
export function soundMatch(L: LatSeq, A: Seq): SoundMatch | null {
  const n = L.toks.length, m = A.toks.length;
  if (!n || !m) return null;
  const req = A.toks.filter((t) => !t.opt).length;
  if (req > n * 2 || n - L.toks.filter((t) => t.opt).length > m) return null;
  // dp[a][j]: Latin a. ünsüzü Arapça j. ünsüzle eşleşmiş (önceki her şey uygun) en düşük maliyet
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: n }, () => new Array(m).fill(INF));
  const lgap = (from: number, to: number) => { let s = ''; for (let i = from; i <= to; i++) s += L.gaps[i]; return s; };
  const agap = (from: number, to: number) => {
    // from: ilk atlanan ya da eşleşen ünsüzün dizini; to: aralığın bittiği ünsüz (dahil değil)
    let s = A.gaps[from];
    for (let j = from; j < to; j++) s += A.toks[j].lv + A.gaps[j + 1];
    return s;
  };
  const lSkipOk = (from: number, to: number) => { for (let i = from; i < to; i++) if (!L.toks[i].opt) return false; return to - from <= MAX_LSKIP; };
  const aSkipOk = (from: number, to: number) => { for (let j = from; j < to; j++) if (!A.toks[j].opt) return false; return to - from <= MAX_ASKIP; };
  /** Harf uyuyorsa ceza (0 ya da yumuşak eşleşmede 0.3), uymuyorsa -1 */
  const fits = (t: LTok, j: number, span: number) => {
    if (span === 1) return t.sets[0].includes(A.toks[j].k) ? 0 : t.soft?.includes(A.toks[j].k) ? 0.3 : -1;
    return t.sets.length === 3 && j > 0 && t.sets[1].includes(A.toks[j - 1].k) && t.sets[2].includes(A.toks[j].k) ? 0 : -1;
  };

  for (let a = 0; a < n; a++) {
    for (let j = 0; j < m; j++) {
      for (const span of [1, 2]) {
        const fit = fits(L.toks[a], j, span);
        if (fit < 0) continue;
        const start = j - span + 1;
        let best = INF;
        // Başlangıçtan
        if (lSkipOk(0, a) && aSkipOk(0, start)) best = gapCost(lgap(0, a), agap(0, start), 'start', L.lead || A.lead) + 0.3 * a + skipPen(A, 0, start);
        for (let pa = Math.max(0, a - 1 - MAX_LSKIP); pa < a; pa++) {
          if (!lSkipOk(pa + 1, a)) continue;
          for (let pj = Math.max(0, start - 1 - MAX_ASKIP); pj < start; pj++) {
            const prev = dp[pa][pj];
            if (prev === INF || !aSkipOk(pj + 1, start)) continue;
            const c = prev + gapCost(lgap(pa + 1, a), agap(pj + 1, start)) + 0.3 * (a - pa - 1) + skipPen(A, pj + 1, start);
            if (c < best) best = c;
          }
        }
        if (best + fit < dp[a][j]) dp[a][j] = best + fit;
      }
    }
  }
  let best = INF;
  for (let a = n - 1; a >= Math.max(0, n - 1 - MAX_LSKIP); a--) {
    if (!lSkipOk(a + 1, n)) continue;
    for (let j = m - 1; j >= Math.max(0, m - 1 - MAX_ASKIP); j--) {
      if (dp[a][j] === INF || !aSkipOk(j + 1, m)) continue;
      // Son ünsüzden sonrası: yalnızca Arapçada uzun ünlü varsa karşılaştırılır
      const tailA = agap(j + 1, m), tailL = lgap(a + 1, n);
      const tail = gapCost(tailL, tailA, 'end');
      const c = dp[a][j] + tail + 0.3 * (n - 1 - a) + skipPen(A, j + 1, m);
      if (c < best) best = c;
    }
  }
  if (best === INF) return null;
  const miss = Math.floor(best / 100 + 1e-9);
  return { miss, pen: Math.round((best - miss * 100) * 1000) / 1000 };
}

/** Kısa yol: tek seferlik karşılaştırma (testler ve tek kelimelik kontroller için) */
export const sounds = (latin: string, arabic: string) => soundMatch(latinSeq(latin), arabicSeq(arabic));

/** Latin yazımda en az bir ünsüz var mı (yalnızca ünlüden oluşan aramalar eşleştirilmez) */
export const hasConsonant = (L: LatSeq) => L.toks.some((t) => t.key !== "'");
