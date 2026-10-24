// Eski sitedeki alphabet.js verisi (otomatik aktarıldı)
import type { Activity, Word } from './types';

  export const LETTERS: [string, string, string, string, string, boolean][] = [
    ['ا', 'Elif', 'أَلِف', 'a / e', 'Kendi sesi yoktur; hemze taşır ya da üstün harfini uzatır (bâ).', false],
    ['ب', 'Be', 'بَاء', 'b', 'Türkçedeki b.', true],
    ['ت', 'Te', 'تَاء', 't', 'İnce t.', true],
    ['ث', 'Se', 'ثَاء', 's (peltek)', 'Dil ucu dişler arasında: İngilizce "think"teki th.', true],
    ['ج', 'Cim', 'جِيم', 'c', 'Türkçedeki c (cami).', true],
    ['ح', 'Ha', 'حَاء', 'ḥ', 'Boğazın ortasından, nefesli ve sert bir h. Hırıltı yok.', true],
    ['خ', 'Hı', 'خَاء', 'h (hırıltılı)', 'Gırtlağın üstünden hırıltılı h: Almanca "Bach".', true],
    ['د', 'Dal', 'دَال', 'd', 'Türkçedeki d.', false],
    ['ذ', 'Zel', 'ذَال', 'z (peltek)', 'Dil ucu dişler arasında: İngilizce "this"teki th.', false],
    ['ر', 'Ra', 'رَاء', 'r', 'Hafif titrek r.', false],
    ['ز', 'Ze', 'زَاي', 'z', 'Türkçedeki z.', false],
    ['س', 'Sin', 'سِين', 's', 'İnce s.', true],
    ['ش', 'Şın', 'شِين', 'ş', 'Türkçedeki ş.', true],
    ['ص', 'Sad', 'صَاد', 's (kalın)', 'Ağzı doldurarak kalın s. Yanındaki üstün "a" okunur: صَبْر sabr.', true],
    ['ض', 'Dad', 'ضَاد', 'd (kalın)', 'Kalın d. Arapçaya "dâd dili" denmesi bu harften gelir.', true],
    ['ط', 'Tı', 'طَاء', 't (kalın)', 'Kalın t: طَالِب tâlib.', true],
    ['ظ', 'Zı', 'ظَاء', 'z (kalın, peltek)', 'Kalın, dişler arası z.', true],
    ['ع', 'Ayn', 'عَيْن', '‘ (ayn)', 'Gırtlağı sıkarak çıkan, Türkçede olmayan ses. Okunuşta ‘ ile gösterilir.', true],
    ['غ', 'Gayn', 'غَيْن', 'ğ', 'Gırtlaktan, gargara yapar gibi: Fransızca r harfine yakın.', true],
    ['ف', 'Fe', 'فَاء', 'f', 'Türkçedeki f.', true],
    ['ق', 'Kaf', 'قَاف', 'k (kalın)', 'Dilin en arkasıyla, kalın k: قَلَم kalem.', true],
    ['ك', 'Kef', 'كَاف', 'k (ince)', 'İnce k: كِتَاب kitâb.', true],
    ['ل', 'Lam', 'لَام', 'l', 'Türkçedeki l.', true],
    ['م', 'Mim', 'مِيم', 'm', 'Türkçedeki m.', true],
    ['ن', 'Nun', 'نُون', 'n', 'Türkçedeki n.', true],
    ['ه', 'He', 'هَاء', 'h', 'Hafif, nefes gibi h (Türkçedeki h).', true],
    ['و', 'Vav', 'وَاو', 'v / û', 'Ünsüz olarak v (İngilizce w harfine yakın), ötre ile uzatma olarak û.', false],
    ['ي', 'Ye', 'يَاء', 'y / î', 'Ünsüz olarak y, esre ile uzatma olarak î.', true]
  ];

  export const HARAKAT: [string, string, string, string][] = [
    ['بَ', 'Üstün (fetha)', 'be / ba', 'Harfin üstündeki kısa çizgi: kısa "e" ya da kalın harflerde "a".'],
    ['بِ', 'Esre (kesra)', 'bi', 'Harfin altındaki kısa çizgi: kısa "i".'],
    ['بُ', 'Ötre (damme)', 'bu', 'Harfin üstündeki küçük vav: kısa "u".'],
    ['بْ', 'Cezm (sükûn)', 'b', 'Harfin sesli harfi yok: اِبْن ibn.'],
    ['بّ', 'Şedde', 'bb', 'Harf iki kez okunur: رَبّ rabb.'],
    ['بًا', 'İki üstün (tenvin)', 'ben', 'Belirsiz ismin sonunda: كِتَابًا kitâben.'],
    ['بٍ', 'İki esre', 'bin', 'Belirsiz ismin sonunda: كِتَابٍ kitâbin.'],
    ['بٌ', 'İki ötre', 'bun', 'Belirsiz ismin sonunda: كِتَابٌ kitâbun.'],
    ['بَا', 'Uzatma: elif', 'bâ', 'Üstünden sonra gelen elif sesi uzatır.'],
    ['بِي', 'Uzatma: ye', 'bî', 'Esreden sonra gelen ye sesi uzatır.'],
    ['بُو', 'Uzatma: vav', 'bû', 'Ötreden sonra gelen vav sesi uzatır.']
  ];

export const ALPHABET_TOPIC = {
    id: 'alfabe', n: 0, name: 'Alfabe', glyph: 'أ',
    words: LETTERS.map((l) => ({ ar: l[2], tr: l[1] + ' (' + l[0] + ')', tl: l[3] })),
    acts: [
      { type: 'match', title: 'Harf ↔ ad', desc: 'Harfleri adlarıyla eşleştir.', glyph: 'أ ب', items: LETTERS.map((l) => [l[0], l[1]]) },
      {
        type: 'mc', title: 'Hangi harf?', desc: 'Kelimenin içindeki biçiminden harfi tanı.', glyph: 'ـبـ', items: [
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'بَيْت', options: ['Be', 'Te', 'Nun', 'Ye'], a: 'Be', why: 'Altında tek nokta: ب (be). Başta ـبـ biçimini alır.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'تُفَّاح', options: ['Te', 'Se', 'Be', 'Nun'], a: 'Te', why: 'Üstünde iki nokta: ت (te). Üç nokta olsaydı ث (se) olurdu.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'نُور', options: ['Nun', 'Be', 'Te', 'Ye'], a: 'Nun', why: 'Üstünde tek nokta: ن (nun). Başta "be"ye benzer ama nokta üsttedir.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'جَمِيل', options: ['Cim', 'Ha', 'Hı', 'Ayn'], a: 'Cim', why: 'Altında nokta: ج (cim). Noktasızı ح, üstte noktalısı خ.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'خُبْز', options: ['Hı', 'Cim', 'Ha', 'Gayn'], a: 'Hı', why: 'Üstünde nokta: خ (hı).' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'شَمْس', options: ['Şın', 'Sin', 'Sad', 'Se'], a: 'Şın', why: 'Üç dişli ve üstünde üç nokta: ش (şın). Noktasızı س (sin).' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'عَيْن', options: ['Ayn', 'Gayn', 'He', 'Fe'], a: 'Ayn', why: 'Noktasız: ع (ayn). Üstünde nokta olsaydı غ (gayn).' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'قَلَم', options: ['Kaf', 'Fe', 'Kef', 'Vav'], a: 'Kaf', why: 'Üstünde iki nokta: ق (kaf). Tek nokta olsaydı ف (fe).' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'كِتَاب', options: ['Kef', 'Kaf', 'Lam', 'Dal'], a: 'Kef', why: 'ك (kef): başta ـكـ gibi yatık yazılır.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'هِلَال', options: ['He', 'Ha', 'Ayn', 'Mim'], a: 'He', why: 'Başta هـ biçimiyle yazılan harf: ه (he).' },
          { q: 'Hangisi kendinden sonraki harfe bitişmez?', options: ['د', 'ب', 'س', 'م'], a: 'د', why: 'ا د ذ ر ز و: bu altı harf kendinden sonrakine bağlanmaz.' },
          { q: 'Hangisi kendinden sonraki harfe bitişmez?', options: ['و', 'ل', 'ي', 'ك'], a: 'و', why: 'Vav (و) bitişmeyen altı harften biridir: ا د ذ ر ز و.' }
        ]
      },
      {
        type: 'mc', title: 'Hareke oku', desc: 'Harekeli heceyi doğru oku.', glyph: 'بَ بِ بُ', items: [
          { q: 'Nasıl okunur?', ar: 'بِ', options: ['bi', 'be', 'bu', 'b'], a: 'bi', why: 'Altındaki çizgi esredir: "i".' },
          { q: 'Nasıl okunur?', ar: 'كُ', options: ['ku', 'ke', 'ki', 'kü'], a: 'ku', why: 'Üstteki küçük vav ötredir: "u".' },
          { q: 'Nasıl okunur?', ar: 'مَا', options: ['mâ', 'me', 'mi', 'mû'], a: 'mâ', why: 'Üstün + elif = uzun â.' },
          { q: 'Nasıl okunur?', ar: 'نُو', options: ['nû', 'nu', 'nî', 'ne'], a: 'nû', why: 'Ötre + vav = uzun û.' },
          { q: 'Nasıl okunur?', ar: 'فِي', options: ['fî', 'fi', 'fe', 'fû'], a: 'fî', why: 'Esre + ye = uzun î.' },
          { q: 'Nasıl okunur?', ar: 'رَبّ', options: ['rabb', 'rab', 'rebe', 'rubb'], a: 'rabb', why: 'Şedde harfi iki kez okutur: b-b.' },
          { q: 'Nasıl okunur?', ar: 'كِتَابٌ', options: ['kitâbun', 'kitâb', 'kitâbin', 'kutub'], a: 'kitâbun', why: 'Sondaki iki ötre (tenvin) "-un" okunur.' },
          { q: 'Nasıl okunur?', ar: 'صَبْر', options: ['sabr', 'sebr', 'sibr', 'subr'], a: 'sabr', why: 'ص kalın harftir; üstünü "a" gibi kalın okunur. Cezmli ب sessiz kalır.' }
        ]
      }
    ]
} as unknown as { id: string; n: number; name: string; glyph: string; words: Word[]; acts: Activity[] };
