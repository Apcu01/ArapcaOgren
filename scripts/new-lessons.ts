/* Yeni dersler (14-17): Evim, Okulda, Yemek ve Alışveriş, Şehirde.
   Yükleme: npx tsx scripts/add-lessons.ts (var olan dersi günceller, etkinlikleri yeniden yazar).
   Biçim yönetim panelindeki ders şemasıyla aynıdır (src/lib/topic-schema.ts). */
import type { TopicInputT } from '../src/lib/topic-schema';

type T = Omit<TopicInputT, 'published' | 'acts'> & { acts: Omit<TopicInputT['acts'][number], 'id'>[] };

const LISTEN = { type: 'listen' as const, title: 'Dinle ve anlamını seç', desc: 'Kelimeyi dinle, Türkçe anlamını bul. Kulağını Arapçaya alıştır.', glyph: 'اِسْمَعْ', items: null };
const SPEAK = { type: 'speak' as const, title: 'Telaffuz alıştırması', desc: 'Kelimeyi dinle, sonra sen söyle. Tarayıcı söylediğini kontrol eder.', glyph: 'تَكَلَّمْ', items: null };

export const NEW_LESSONS: T[] = [
  /* ---------------------------------------------------------------- 14. Evim */
  {
    id: 'evim', n: 14, level: 'Başlangıç', glyph: 'ب', ar: 'بَيْتِي', name: 'Evim ve Odalar',
    desc: 'Ev ve odaların adları, eşyalar ve "var / yok" demek: {{فِي الْبَيْتِ ...}}.',
    long: 'Evdeki odalar ve eşyalar; Arapçada "var" kelimesi olmadan "evde bir mutfak var" demek, "yok" demek için {{لَيْسَ}} ve "Evinde kaç oda var?" sorusu.',
    tags: 'ev oda mutfak banyo salon yatak masa sandalye pencere kapı dolap var yok bayt beyt ghurfa gurfe matbakh matbah laysa leyse',
    readMins: 10,
    intro: 'Bu derste evini Arapça anlatmayı öğreneceksin. Önce odalar ve eşyalar, sonra Türkçedeki <b>"var"</b> ve <b>"yok"</b> kelimelerinin Arapçada nasıl söylendiği. İyi haber: Arapçada "var" diye ayrı bir kelime yok; {{فِي الْبَيْتِ مَطْبَخٌ}} "Evde bir mutfak var." demek yeterli.',
    lesson: [
      {
        h: 'Ev ve odalar',
        p: ['Evin bölümlerinin çoğu Türkçeye de geçmiş kelimelerdir: {{مَطْبَخٌ}} (matbah, mutfak), {{حَمَّامٌ}} (hamam, banyo), {{صَالَةٌ}} (salon). Odalar erkek ya da dişil olabilir; sıfat getirirken buna dikkat et.'],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam', 'Cinsiyet'],
          rows: [
            ['بَيْتٌ', 'beytun', 'ev', 'erkek'],
            ['غُرْفَةٌ', 'gurfetun', 'oda', 'dişil'],
            ['مَطْبَخٌ', 'matbahun', 'mutfak', 'erkek'],
            ['حَمَّامٌ', 'hammâmun', 'banyo, tuvalet', 'erkek'],
            ['صَالَةٌ', 'sâletun', 'salon', 'dişil'],
            ['غُرْفَةُ النَّوْمِ', "gurfetu'n-nevm", 'yatak odası', 'dişil'],
            ['حَدِيقَةٌ', 'hadîkatun', 'bahçe', 'dişil']
          ]
        },
        tips: [
          '{{غُرْفَةُ النَّوْمِ}} bir tamlamadır, kelimesi kelimesine "uyku odası". Aynı şekilde {{غُرْفَةُ الْجُلُوسِ}} "oturma odası" demektir.',
          'Türkçedeki <b>matbah</b> (eski mutfak), <b>hamam</b> ve <b>hadîka</b> (bahçe) kelimeleri buradan gelir.'
        ],
        narr: "Merhaba! Bugün evimizi Arapça anlatacağız. Önce odalarla başlayalım.\n\nEv: {{بَيْتٌ}}, beyt. Oda: {{غُرْفَةٌ}}, gurfe. Mutfak: {{مَطْبَخٌ}}, matbah. Eskiden saraylarda mutfağa matbah denirdi, işte o kelime. Banyo: {{حَمَّامٌ}}, hammâm. Türkçedeki hamam kelimesinin ta kendisi. Salon: {{صَالَةٌ}}, sâle. Bahçe: {{حَدِيقَةٌ}}, hadîka.\n\nYatak odası için bir tamlama kullanılır: {{غُرْفَةُ النَّوْمِ}}, gurfetu'n-nevm. Kelimesi kelimesine uyku odası. Nevm uyku demek.\n\nBir şeye dikkat edin: oda kelimesi gurfe dişildir, sonundaki yuvarlak te bunu gösterir. Bu yüzden büyük bir oda derken sıfat da dişil olur: {{غُرْفَةٌ كَبِيرَةٌ}}. Ama mutfak erkektir: {{مَطْبَخٌ كَبِيرٌ}}."
      },
      {
        h: 'Evdeki eşyalar',
        p: ['Eşya adlarının çoğu alet kalıbındadır: {{مِفْعَال}}. Örneğin {{مِفْتَاحٌ}} "anahtar", {{فَتَحَ}} "açtı" fiilinden gelir: açan alet. {{مِصْبَاحٌ}} "lamba", {{صَبَاح}} "sabah, aydınlık" kelimesiyle aynı köktendir. Kalıbı tanırsan anlamı tahmin edebilirsin.'],
        table: {
          cols: ['Arapça', 'Anlam', 'Arapça', 'Anlam'],
          rows: [
            ['بَابٌ', 'kapı', 'نَافِذَةٌ', 'pencere'],
            ['سَرِيرٌ', 'yatak', 'كُرْسِيٌّ', 'sandalye'],
            ['طَاوِلَةٌ', 'masa', 'خِزَانَةٌ', 'dolap'],
            ['مِصْبَاحٌ', 'lamba', 'مِفْتَاحٌ', 'anahtar'],
            ['ثَلَّاجَةٌ', 'buzdolabı', 'مِرْآةٌ', 'ayna']
          ]
        },
        ex: [
          { ar: 'هٰذَا سَرِيرٌ', tl: 'hâzâ serîrun', tr: 'Bu bir yatak.', en: 'This is a bed.' },
          { ar: 'هٰذِهِ نَافِذَةٌ كَبِيرَةٌ', tl: 'hâzihî nâfizetun kebîretun', tr: 'Bu büyük bir pencere.', en: 'This is a big window.' },
          { ar: 'الْكُرْسِيُّ قَرِيبٌ مِنَ الطَّاوِلَةِ', tl: "el-kursiyyu karîbun mine't-tâvileti", tr: 'Sandalye masaya yakın.', en: 'The chair is near the table.' },
          { ar: 'الْمِفْتَاحُ عَلَى الْبَابِ', tl: "el-miftâhu ‘ale'l-bâbi", tr: 'Anahtar kapının üzerinde.', en: 'The key is in the door.' }
        ],
        cmp: { tr: 'Türkçede eşyanın cinsiyeti yoktur: büyük kapı, büyük pencere.', en: 'İngilizcede de yoktur: a big door, a big window. Arapçada ise {{بَابٌ كَبِيرٌ}} ama {{نَافِذَةٌ كَبِيرَةٌ}} denir.' },
        narr: "Şimdi evdeki eşyalara geçelim.\n\nKapı: {{بَابٌ}}, bâb. Babıâli'deki bâb, yani kapı. Pencere: {{نَافِذَةٌ}}, nâfize. Yatak: {{سَرِيرٌ}}, serîr. Sandalye: {{كُرْسِيٌّ}}, kursiyy. Türkçedeki kürsü kelimesi buradan gelir. Masa: {{طَاوِلَةٌ}}, tâvile. Dolap: {{خِزَانَةٌ}}, hizâne. Hazine kelimesini hatırlayın, içine bir şeyler konan yer.\n\nŞimdi küçük bir sır: bazı eşya adları aynı kalıptadır, başta mi, ortada uzun â. {{مِفْتَاحٌ}}, miftâh, anahtar. Kökü fetaha, açtı. Yani açan alet. {{مِصْبَاحٌ}}, misbâh, lamba. Kökü sabah, aydınlık. Yani aydınlatan alet. Bu kalıbı gördüğünüzde bir alet adı olduğunu tahmin edebilirsiniz.\n\nÖrnek: {{هٰذَا سَرِيرٌ}}, bu bir yatak. {{هٰذِهِ نَافِذَةٌ كَبِيرَةٌ}}, bu büyük bir pencere. Pencere dişil olduğu için hem işaret zamiri hem de sıfat dişil."
      },
      {
        h: '"Var" demek: yer önce gelir',
        p: [
          'Arapçada "var" anlamında ayrı bir kelime kullanılmaz. Önce <b>yer</b> söylenir, sonra <b>belirsiz</b> (tenvinli) isim gelir: {{فِي الْبَيْتِ مَطْبَخٌ}} "Evde bir mutfak var."',
          'İsim belirsiz olduğu için cümle yerle başlar. Bu sıra, Türkçedeki "Evde bir mutfak var." cümlesine çok benzer.'
        ],
        ex: [
          { ar: 'فِي الْبَيْتِ ثَلَاثُ غُرَفٍ', tl: "fi'l-beyti selâsu gurafin", tr: 'Evde üç oda var.', en: 'There are three rooms in the house.' },
          { ar: 'فِي الْغُرْفَةِ سَرِيرٌ وَخِزَانَةٌ', tl: "fi'l-gurfeti serîrun ve hizânetun", tr: 'Odada bir yatak ve bir dolap var.', en: 'There is a bed and a wardrobe in the room.' },
          { ar: 'فِي الْمَطْبَخِ ثَلَّاجَةٌ', tl: "fi'l-matbahi sellâcetun", tr: 'Mutfakta bir buzdolabı var.', en: 'There is a fridge in the kitchen.' },
          { ar: 'عَلَى الطَّاوِلَةِ كِتَابٌ', tl: "‘ale't-tâvileti kitâbun", tr: 'Masanın üstünde bir kitap var.', en: 'There is a book on the table.' }
        ],
        cmp: { tr: 'Türkçede de yer önce gelir: "Evde bir mutfak var." Arapça aynı sırayı kullanır, yalnızca "var" kelimesi düşer.', en: 'İngilizcede "there is" kalıbı gerekir: There is a kitchen in the house.' },
        tips: ['Sorusu da kolay: {{هَلْ فِي الْبَيْتِ حَدِيقَةٌ؟}} "Evde bahçe var mı?" Cevap: {{نَعَمْ، فِيهِ حَدِيقَةٌ}} "Evet, onda bir bahçe var."'],
        narr: "Bu dersin en güzel kısmına geldik: var demek.\n\nTürkçede evde bir mutfak var deriz. İngilizcede there is kalıbı gerekir. Arapçada ise var kelimesine hiç gerek yok! Önce yeri söylersiniz, sonra var olan şeyi: {{فِي الْبَيْتِ مَطْبَخٌ}}, fi'l-beyti matbahun. Kelimesi kelimesine: evde, mutfak. Hepsi bu.\n\nDikkat edilecek tek nokta: var olan şey belirsizdir, yani sonunda tenvin vardır. Matbahun, serîrun, kitâbun.\n\nBirkaç örnek: {{فِي الْغُرْفَةِ سَرِيرٌ وَخِزَانَةٌ}}, odada bir yatak ve bir dolap var. {{عَلَى الطَّاوِلَةِ كِتَابٌ}}, masanın üstünde bir kitap var.\n\nSoru sormak için başa hel getirin: {{هَلْ فِي الْبَيْتِ حَدِيقَةٌ؟}}, evde bahçe var mı? Gördüğünüz gibi Türkçeyle neredeyse aynı sıra. Bu yüzden bu kalıp size çok kolay gelecek."
      },
      {
        h: '"Yok" demek ve kaç oda?',
        p: [
          'Olumsuz için cümlenin başına {{لَيْسَ}} gelir: {{لَيْسَ فِي الْبَيْتِ حَدِيقَةٌ}} "Evde bahçe yok." İsim yine ötreli kalır.',
          'Kaç tane olduğunu sormak için {{كَمْ}} kullanılır. {{كَمْ}}\'den sonra isim <b>tekil ve üstünlü</b> gelir: {{كَمْ غُرْفَةً فِي بَيْتِكَ؟}} "Evinde kaç oda var?"'
        ],
        ex: [
          { ar: 'لَيْسَ فِي الْغُرْفَةِ تِلْفَازٌ', tl: "leyse fi'l-gurfeti tilfâzun", tr: 'Odada televizyon yok.', en: 'There is no TV in the room.' },
          { ar: 'كَمْ غُرْفَةً فِي بَيْتِكَ؟', tl: 'kem gurfeten fî beytike?', tr: 'Evinde kaç oda var?', en: 'How many rooms are there in your house?' },
          { ar: 'فِي بَيْتِي أَرْبَعُ غُرَفٍ', tl: "fî beytî erbe‘u gurafin", tr: 'Evimde dört oda var.', en: 'There are four rooms in my house.' },
          { ar: 'بَيْتِي صَغِيرٌ وَجَمِيلٌ', tl: 'beytî sagîrun ve cemîlun', tr: 'Evim küçük ve güzel.', en: 'My house is small and beautiful.' }
        ],
        tips: ['3 ile 10 arası sayılardan sonra isim çoğul ve esreli gelir: {{ثَلَاثُ غُرَفٍ}}, {{أَرْبَعُ غُرَفٍ}}. Sayılar dersindeki kural burada da geçerli.'],
        narr: "Peki yok nasıl denir? Çok kolay: cümlenin başına {{لَيْسَ}}, leyse getirirsiniz. {{لَيْسَ فِي الْبَيْتِ حَدِيقَةٌ}}, evde bahçe yok. {{لَيْسَ فِي الْغُرْفَةِ تِلْفَازٌ}}, odada televizyon yok.\n\nŞimdi kaç tane diye soralım. Kaç kelimesi {{كَمْ}}, kem. Burada bir püf noktası var: kem'den sonra isim tekil olur ve sonu üstünlü, yani -en ile biter. {{كَمْ غُرْفَةً فِي بَيْتِكَ؟}}, kem gurfeten fî beytike, evinde kaç oda var? Türkçede de kaç odalar demeyiz, kaç oda deriz. Arapça da tekil kullanır.\n\nCevapta sayı gelir: {{فِي بَيْتِي أَرْبَعُ غُرَفٍ}}, evimde dört oda var. Üçten ona kadar sayılardan sonra isim çoğul olur: gurfe, çoğulu guraf.\n\nArtık evinizi Arapça anlatabilirsiniz: {{بَيْتِي صَغِيرٌ وَجَمِيلٌ}}, evim küçük ve güzel."
      }
    ],
    keys: [
      'Odalar: {{غُرْفَةٌ}} oda, {{مَطْبَخٌ}} mutfak, {{حَمَّامٌ}} banyo, {{صَالَةٌ}} salon.',
      '"Var": önce yer, sonra belirsiz isim: {{فِي الْبَيْتِ مَطْبَخٌ}}.',
      '"Yok": {{لَيْسَ}} ile: {{لَيْسَ فِي الْبَيْتِ حَدِيقَةٌ}}.',
      'Kaç tane: {{كَمْ غُرْفَةً ...؟}} ({{كَمْ}}\'den sonra tekil ve tenvinli üstün).'
    ],
    mistakes: [
      { bad: 'فِي الْبَيْتِ الْمَطْبَخُ', good: 'فِي الْبَيْتِ مَطْبَخٌ', why: '"Var" cümlesinde isim belirsizdir (tenvinli).' },
      { bad: 'كَمْ غُرَفٍ فِي بَيْتِكَ؟', good: 'كَمْ غُرْفَةً فِي بَيْتِكَ؟', why: '{{كَمْ}}\'den sonra isim tekil ve üstünlüdür.' },
      { bad: 'لَا فِي الْبَيْتِ حَدِيقَةٌ', good: 'لَيْسَ فِي الْبَيْتِ حَدِيقَةٌ', why: 'İsim cümlesini {{لَيْسَ}} olumsuz yapar.' }
    ],
    words: [
      { ar: 'بَيْت', tl: 'beyt', tr: 'ev', en: 'house' },
      { ar: 'غُرْفَة', tl: 'gurfe', tr: 'oda', en: 'room' },
      { ar: 'مَطْبَخ', tl: 'matbah', tr: 'mutfak', en: 'kitchen' },
      { ar: 'حَمَّام', tl: 'hammâm', tr: 'banyo, tuvalet', en: 'bathroom' },
      { ar: 'صَالَة', tl: 'sâle', tr: 'salon', en: 'living room' },
      { ar: 'حَدِيقَة', tl: 'hadîka', tr: 'bahçe, park', en: 'garden' },
      { ar: 'بَاب', tl: 'bâb', tr: 'kapı', en: 'door' },
      { ar: 'نَافِذَة', tl: 'nâfize', tr: 'pencere', en: 'window' },
      { ar: 'سَرِير', tl: 'serîr', tr: 'yatak', en: 'bed' },
      { ar: 'كُرْسِيّ', tl: 'kursiyy', tr: 'sandalye', en: 'chair' },
      { ar: 'طَاوِلَة', tl: 'tâvile', tr: 'masa', en: 'table' },
      { ar: 'خِزَانَة', tl: 'hizâne', tr: 'dolap', en: 'wardrobe, cupboard' },
      { ar: 'مِصْبَاح', tl: 'misbâh', tr: 'lamba', en: 'lamp' },
      { ar: 'مِفْتَاح', tl: 'miftâh', tr: 'anahtar', en: 'key' },
      { ar: 'ثَلَّاجَة', tl: 'sellâce', tr: 'buzdolabı', en: 'fridge' }
    ],
    summaryNarr: "Evim ve Odalar dersini bitirdiniz, tebrikler! Kısa bir tekrar yapalım.\n\nOdalar: {{غُرْفَةٌ}} oda, {{مَطْبَخٌ}} mutfak, {{حَمَّامٌ}} banyo, {{صَالَةٌ}} salon. Eşyalar: {{بَابٌ}} kapı, {{نَافِذَةٌ}} pencere, {{سَرِيرٌ}} yatak, {{كُرْسِيٌّ}} sandalye.\n\nVar demek için ayrı bir kelime yok: önce yer, sonra belirsiz isim. {{فِي الْبَيْتِ مَطْبَخٌ}}, evde bir mutfak var. Yok demek için başa leyse gelir. Kaç oda diye sorarken kem'den sonra isim tekil ve üstünlü: kem gurfeten.\n\nEtkinliklerde önce kartlarla kelimeleri tekrar edin, sonra 'Cümleyi tamamla' alıştırmasında var ve yok cümlelerini kurun.",
    acts: [
      { type: 'flash', title: 'Ev kartları', desc: 'Oda ve eşya adlarını kartlarla öğren.', glyph: 'بَيْت', items: null },
      {
        type: 'match', title: 'Oda ve eşya', desc: 'Arapça kelimeyi anlamıyla eşleştir.', glyph: 'غُرْفَة',
        items: [['غُرْفَةٌ', 'oda'], ['مَطْبَخٌ', 'mutfak'], ['حَمَّامٌ', 'banyo'], ['نَافِذَةٌ', 'pencere'], ['سَرِيرٌ', 'yatak'], ['خِزَانَةٌ', 'dolap']]
      },
      {
        type: 'mc', title: 'Nerede ne var?', desc: 'Doğru kelimeyi ya da cümleyi seç.', glyph: 'فِي',
        items: [
          { q: 'Buzdolabı genellikle nerededir? {{الثَّلَّاجَةُ فِي ___}}', options: ['الْمَطْبَخِ', 'الْحَمَّامِ', 'الْحَدِيقَةِ', 'غُرْفَةِ النَّوْمِ'], a: 'الْمَطْبَخِ', why: '{{ثَلَّاجَة}} buzdolabı, {{مَطْبَخ}} mutfak.' },
          { q: '{{سَرِيرٌ}} ne demektir?', options: ['yatak', 'sandalye', 'dolap', 'masa'], a: 'yatak' },
          { q: '"Anahtar" hangisidir?', options: ['مِفْتَاحٌ', 'مِصْبَاحٌ', 'مِرْآةٌ', 'مِكْنَسَةٌ'], a: 'مِفْتَاحٌ', why: '{{فَتَحَ}} açtı: açan alet, {{مِفْتَاحٌ}}.' },
          { q: '"Evde bir bahçe var." hangisidir?', options: ['فِي الْبَيْتِ حَدِيقَةٌ', 'الْبَيْتُ حَدِيقَةٌ', 'فِي الْبَيْتِ الْحَدِيقَةُ', 'حَدِيقَةُ الْبَيْتِ'], a: 'فِي الْبَيْتِ حَدِيقَةٌ', why: 'Önce yer, sonra belirsiz isim.' },
          { q: '{{صَالَةٌ}} hangi odadır?', options: ['salon', 'mutfak', 'banyo', 'yatak odası'], a: 'salon' },
          { q: '"Odada televizyon yok." hangisidir?', options: ['لَيْسَ فِي الْغُرْفَةِ تِلْفَازٌ', 'لَا فِي الْغُرْفَةِ تِلْفَازٌ', 'فِي الْغُرْفَةِ تِلْفَازٌ', 'الْغُرْفَةُ تِلْفَازٌ'], a: 'لَيْسَ فِي الْغُرْفَةِ تِلْفَازٌ', why: '"Yok" için {{لَيْسَ}}.' }
        ]
      },
      {
        type: 'fill', title: 'Cümleyi tamamla', desc: 'Var ve yok cümlelerini doğru biçimle tamamla.', glyph: '___',
        items: [
          { s: 'فِي الْمَطْبَخِ ___', tr: 'Mutfakta bir buzdolabı var.', hint: 'Mutfakta bir buzdolabı var.', options: ['ثَلَّاجَةٌ', 'الثَّلَّاجَةُ', 'ثَلَّاجَةً'], a: 'ثَلَّاجَةٌ', why: '"Var" cümlesinde isim belirsiz ve ötrelidir.' },
          { s: '___ فِي الْبَيْتِ حَدِيقَةٌ', tr: 'Evde bahçe yok.', hint: 'Evde bahçe yok.', options: ['لَيْسَ', 'لَا', 'مَا'], a: 'لَيْسَ' },
          { s: 'كَمْ ___ فِي بَيْتِكَ؟', tr: 'Evinde kaç oda var?', hint: 'Evinde kaç oda var?', options: ['غُرْفَةً', 'غُرَفٍ', 'غُرْفَةٌ'], a: 'غُرْفَةً', why: '{{كَمْ}}\'den sonra tekil ve üstünlü.' },
          { s: 'هٰذِهِ نَافِذَةٌ ___', tr: 'Bu büyük bir pencere.', hint: 'Bu büyük bir pencere.', options: ['كَبِيرَةٌ', 'كَبِيرٌ', 'الْكَبِيرَةُ'], a: 'كَبِيرَةٌ', why: '{{نَافِذَة}} dişil, sıfat da dişil.' },
          { s: 'فِي بَيْتِي أَرْبَعُ ___', tr: 'Evimde dört oda var.', hint: 'Evimde dört oda var.', options: ['غُرَفٍ', 'غُرْفَةٍ', 'غُرْفَةٌ'], a: 'غُرَفٍ', why: '3-10 arası sayılardan sonra çoğul ve esreli.' }
        ]
      },
      LISTEN,
      SPEAK,
      {
        type: 'test', title: 'Evim testi', desc: 'Karma değerlendirme.', glyph: '؟',
        items: [
          { q: '"Mutfak" hangisidir?', options: ['مَطْبَخٌ', 'مَكْتَبٌ', 'مَسْجِدٌ', 'مَطْعَمٌ'], a: 'مَطْبَخٌ' },
          { t: 'tf', s: 'فِي الْبَيْتِ مَطْبَخٌ "Evde bir mutfak var." demektir.', a: true },
          { t: 'tf', s: 'Arapçada "var" demek için ayrı bir kelime gerekir.', a: false, why: 'Önce yer söylenir, ayrı bir kelime yoktur: {{فِي الْبَيْتِ مَطْبَخٌ}}.' },
          { t: 'order', w: ['فِي', 'الْغُرْفَةِ', 'سَرِيرٌ'], tr: 'Odada bir yatak var.' },
          { t: 'order', w: ['لَيْسَ', 'فِي', 'الْبَيْتِ', 'حَدِيقَةٌ'], tr: 'Evde bahçe yok.' },
          { q: '{{مِصْبَاحٌ}} ne demektir?', options: ['lamba', 'anahtar', 'ayna', 'pencere'], a: 'lamba' },
          { t: 'fill', s: 'كَمْ ___ فِي الْبَيْتِ؟', tr: 'Evde kaç oda var?', hint: 'Evde kaç oda var?', options: ['غُرْفَةً', 'غُرَفٌ', 'الْغُرْفَةُ'], a: 'غُرْفَةً' },
          { q: '"Bu bir yatak." hangisidir?', options: ['هٰذَا سَرِيرٌ', 'هٰذِهِ سَرِيرٌ', 'هٰذَا السَّرِيرُ', 'سَرِيرٌ هٰذَا'], a: 'هٰذَا سَرِيرٌ', why: '{{سَرِير}} erkek: {{هٰذَا}}. {{هٰذَا السَّرِيرُ}} "bu yatak" demektir, cümle değildir.' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- 15. Okulda */
  {
    id: 'okulda', n: 15, level: 'Başlangıç', glyph: 'د', ar: 'فِي الْمَدْرَسَةِ', name: 'Okulda ve Sınıfta',
    desc: 'Sınıf eşyaları, okul kelimeleri ve emir kipi: {{اُكْتُبْ}} "yaz", {{لَا تَكْتُبْ}} "yazma".',
    long: 'Sınıftaki eşyalar ve okul hayatı; öğretmenin derste kullandığı emirler; emir kipinin nasıl yapıldığı, kıza ve gruba söylenen emir ve olumsuz emir.',
    tags: 'okul sınıf öğretmen öğrenci kitap defter kalem tahta silgi ödev emir yaz oku dinle otur kalk uktub iqra isma la taktub madrasa medrese',
    readMins: 12,
    intro: 'Bu derste sınıfta duyduğun Arapçayı anlayacaksın. Öğretmenin {{اُكْتُبْ}} "yaz", {{اِقْرَأْ}} "oku", {{اِسْمَعْ}} "dinle" diye verdiği emirler, şimdiki zaman fiilinden üç kolay adımla türetilir.',
    lesson: [
      {
        h: 'Sınıftaki eşyalar',
        p: ['Okul ve sınıf kelimelerinin çoğu tanıdık gelecek: {{كِتَابٌ}} kitap, {{قَلَمٌ}} kalem, {{دَفْتَرٌ}} defter, {{مَدْرَسَةٌ}} medrese, yani okul.'],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam'],
          rows: [
            ['مَدْرَسَةٌ', 'medresetun', 'okul'],
            ['فَصْلٌ', 'faslun', 'sınıf'],
            ['مُعَلِّمٌ', "mu‘allimun", 'öğretmen'],
            ['طَالِبٌ', 'tâlibun', 'öğrenci'],
            ['كِتَابٌ', 'kitâbun', 'kitap'],
            ['دَفْتَرٌ', 'defterun', 'defter'],
            ['قَلَمٌ', 'kalemun', 'kalem'],
            ['سَبُّورَةٌ', 'sebbûretun', 'yazı tahtası'],
            ['مِمْسَحَةٌ', 'mimsehatun', 'silgi'],
            ['وَاجِبٌ', 'vâcibun', 'ödev']
          ]
        },
        tips: [
          '{{مُعَلِّمٌ}} (muallim) ve {{طَالِبٌ}} (talebe) Türkçede de kullanılır. Kız öğrenci {{طَالِبَةٌ}}, kadın öğretmen {{مُعَلِّمَةٌ}}.',
          '{{مَدْرَسَةٌ}} "ders yapılan yer" demektir: {{دَرَسَ}} "ders çalıştı" kökünden, başına {{مَـ}} gelerek yer adı olmuştur.'
        ],
        narr: "Merhaba! Bugün okula gidiyoruz. Bu derste hem sınıftaki eşyaları hem de öğretmenin derste söylediği emirleri öğreneceğiz.\n\nOkul: {{مَدْرَسَةٌ}}, medrese. Türkçedeki medrese kelimesinin ta kendisi. Kökü deresa, ders çalıştı. Yani medrese, ders çalışılan yer. Sınıf: {{فَصْلٌ}}, fasl. Öğretmen: {{مُعَلِّمٌ}}, muallim. Öğrenci: {{طَالِبٌ}}, tâlib. Talebe kelimesini hatırlayın.\n\nSınıftaki eşyalar: kitap {{كِتَابٌ}}, defter {{دَفْتَرٌ}}, kalem {{قَلَمٌ}}. Bu üçü Türkçeyle aynı! Yazı tahtası: {{سَبُّورَةٌ}}, sebbûre. Silgi: {{مِمْسَحَةٌ}}, mimseha. Ödev: {{وَاجِبٌ}}, vâcib. Vacip kelimesi gibi, yapılması gereken şey.\n\nKız öğrenci için sona yuvarlak te gelir: {{طَالِبَةٌ}}, tâlibe. Kadın öğretmen: {{مُعَلِّمَةٌ}}, muallime."
      },
      {
        h: 'Öğretmenin emirleri',
        p: ['Derste en çok duyacağın emirler bunlardır. Hepsi tek bir erkeğe söylenen biçimdir:'],
        table: {
          cols: ['Emir', 'Okunuş', 'Anlam', 'Geldiği fiil'],
          rows: [
            ['اُكْتُبْ', 'uktub', 'yaz', 'كَتَبَ / يَكْتُبُ'],
            ['اِقْرَأْ', "ikra'", 'oku', 'قَرَأَ / يَقْرَأُ'],
            ['اِسْمَعْ', "isma‘", 'dinle', 'سَمِعَ / يَسْمَعُ'],
            ['اُنْظُرْ', 'unzur', 'bak', 'نَظَرَ / يَنْظُرُ'],
            ['اِجْلِسْ', 'iclis', 'otur', 'جَلَسَ / يَجْلِسُ'],
            ['قُمْ', 'kum', 'kalk', 'قَامَ / يَقُومُ'],
            ['تَعَالَ', "te‘âle", 'gel', 'düzensiz'],
            ['أَجِبْ', 'ecib', 'cevap ver', 'أَجَابَ / يُجِيبُ']
          ]
        },
        ex: [
          { ar: 'اُكْتُبِ الدَّرْسَ فِي الدَّفْتَرِ', tl: "uktubi'd-darse fi'd-defteri", tr: 'Dersi deftere yaz.', en: 'Write the lesson in the notebook.' },
          { ar: 'اِقْرَأِ الْكِتَابَ', tl: "ikrai'l-kitâbe", tr: 'Kitabı oku.', en: 'Read the book.' },
          { ar: 'اِسْمَعْ جَيِّدًا', tl: "isma‘ ceyyiden", tr: 'İyi dinle.', en: 'Listen well.' },
          { ar: 'اُنْظُرْ إِلَى السَّبُّورَةِ', tl: "unzur ile's-sebbûreti", tr: 'Tahtaya bak.', en: 'Look at the board.' }
        ],
        tips: ['İki sessiz harf yan yana gelmesin diye emirdeki cezm, "el" takısından önce esreye döner: {{اُكْتُبْ}} ama {{اُكْتُبِ الدَّرْسَ}}.'],
        narr: "Şimdi sınıfta en çok duyacağınız kelimelere geçelim: öğretmenin emirleri.\n\nYaz: {{اُكْتُبْ}}, uktub. Oku: {{اِقْرَأْ}}, ikra'. Bu kelimeyi belki duymuşsunuzdur, Kur'an'da inen ilk ayetin ilk kelimesi. Dinle: {{اِسْمَعْ}}, isma'. Bak: {{اُنْظُرْ}}, unzur. Otur: {{اِجْلِسْ}}, iclis. Kalk: {{قُمْ}}, kum. Gel: {{تَعَالَ}}, teâle. Cevap ver: {{أَجِبْ}}, ecib.\n\nBu emirleri cümlede kullanalım: {{اُكْتُبِ الدَّرْسَ فِي الدَّفْتَرِ}}, dersi deftere yaz. Burada bir şey fark ettiniz mi? Uktub değil uktubi dedik. Çünkü arkasından el takısı geliyor ve iki sessiz harf yan yana gelmesin diye araya bir i sesi giriyor. {{اِقْرَأِ الْكِتَابَ}}, ikrai'l-kitâbe, kitabı oku.\n\n{{اُنْظُرْ إِلَى السَّبُّورَةِ}}, tahtaya bak. Bu cümleyi derste çok duyacaksınız!"
      },
      {
        h: 'Emir nasıl yapılır?',
        p: [
          'Emir, şimdiki zaman fiilinden üç adımda yapılır. 1) {{تَكْتُبُ}} "yazıyorsun" fiilinin baştaki {{تَـ}} harfi atılır. 2) Sondaki ötre cezme döner. 3) Sessiz harfle başlanamadığı için başa elif gelir: {{اُكْتُبْ}}.',
          'Baştaki elifin harekesi fiilin ortasına bakar: ortası ötreli ise (yektubu, yenzuru) {{اُ}}, değilse (yeclisu, yesme‘u) {{اِ}}: {{اُكْتُبْ}} ama {{اِجْلِسْ}}, {{اِسْمَعْ}}.'
        ],
        table: {
          cols: ['Kime', 'Ek', 'Örnek', 'Anlam'],
          rows: [
            ['sen (erkek)', '-', 'اُكْتُبْ', 'yaz'],
            ['sen (kadın)', 'ـِي', 'اُكْتُبِي', 'yaz'],
            ['siz (grup)', 'ـُوا', 'اُكْتُبُوا', 'yazın']
          ]
        },
        cmp: { tr: 'Türkçede emir fiilin köküdür: yaz, oku, dinle. Arapçada kime söylendiğine göre değişir: erkeğe {{اُكْتُبْ}}, kıza {{اُكْتُبِي}}, sınıfa {{اُكْتُبُوا}}.', en: 'İngilizcede tek biçim vardır: write. Arapçada üç farklı biçim kullanılır.' },
        narr: "Şimdi emrin nasıl yapıldığını görelim. Bunu bir kez anlarsanız, bildiğiniz her fiilin emrini kendiniz yapabilirsiniz.\n\nŞimdiki zamandan başlıyoruz: {{تَكْتُبُ}}, tektubu, yazıyorsun. Birinci adım: baştaki te harfini atın. Kalır ktubu. İkinci adım: sondaki u sesini kaldırın. Kalır ktub. Üçüncü adım: Arapçada kelime iki sessizle başlayamaz, başa bir elif ekleyin: uktub. İşte emir!\n\nBaştaki elif u mu i mi olacak? Fiilin ortasına bakın. Yektubu, ortası u, o zaman uktub. Yeclisu, ortası i, o zaman iclis. Yesmeu, ortası e, o zaman yine i: isma'.\n\nKıza söylerken sona -î eklenir: {{اُكْتُبِي}}, uktubî. Bütün sınıfa söylerken sona -û: {{اُكْتُبُوا}}, uktubû, yazın. Türkçede de tekil yaz, çoğul yazın deriz; Arapçada buna bir de kız için biçim ekleniyor."
      },
      {
        h: 'Olumsuz emir: yapma!',
        p: [
          '"Yazma, konuşma" demek için şimdiki zaman fiilinin başına {{لَا}} getirilir ve sonu cezmlenir: {{تَكْتُبُ}} → {{لَا تَكْتُبْ}} "yazma". Burada baştaki {{تَـ}} atılmaz.',
          'Kıza: {{لَا تَكْتُبِي}}; sınıfa: {{لَا تَكْتُبُوا}}.'
        ],
        ex: [
          { ar: 'لَا تَتَكَلَّمْ فِي الْفَصْلِ', tl: "lâ tetekellem fi'l-fasli", tr: 'Sınıfta konuşma.', en: "Don't talk in class." },
          { ar: 'لَا تَنْسَ الْوَاجِبَ', tl: "lâ tense'l-vâcibe", tr: 'Ödevi unutma.', en: "Don't forget the homework." },
          { ar: 'اِفْتَحُوا الْكُتُبَ', tl: "iftehu'l-kutube", tr: 'Kitapları açın.', en: 'Open the books.' },
          { ar: 'لَا تَخَافِي', tl: 'lâ tehâfî', tr: 'Korkma (kıza).', en: "Don't be afraid." }
        ],
        tips: ['Günlük hayatta çok duyulan iki kalıp: {{لَا تَقْلَقْ}} "merak etme", {{لَا بَأْسَ}} "sorun değil".'],
        narr: "Son olarak yapma demeyi öğrenelim. Bu daha da kolay.\n\nOlumsuz emir emirden değil, yine şimdiki zamandan yapılır. Başa lâ getirirsiniz ve sondaki u sesini kaldırırsınız. Te harfi bu sefer kalır! {{تَكْتُبُ}}, tektubu, yazıyorsun. {{لَا تَكْتُبْ}}, lâ tektub, yazma.\n\nÖrnekler: {{لَا تَتَكَلَّمْ فِي الْفَصْلِ}}, lâ tetekellem fi'l-fasl, sınıfta konuşma. {{لَا تَنْسَ الْوَاجِبَ}}, lâ tense'l-vâcib, ödevi unutma. Burada küçük bir ayrıntı var: unutuyorsun tensâ idi, sondaki uzun â düştü ve tense oldu.\n\nKıza söylerken: {{لَا تَخَافِي}}, lâ tehâfî, korkma. Ve hayatınızda çok duyacağınız bir kalıp: {{لَا تَقْلَقْ}}, lâ taklak, merak etme!"
      }
    ],
    keys: [
      'Sınıf: {{مُعَلِّمٌ}} öğretmen, {{طَالِبٌ}} öğrenci, {{سَبُّورَةٌ}} tahta, {{دَفْتَرٌ}} defter.',
      'Emir: şimdiki zamandan {{تَـ}} atılır, son cezmlenir, başa elif gelir: {{تَكْتُبُ}} → {{اُكْتُبْ}}.',
      'Kıza {{اُكْتُبِي}}, gruba {{اُكْتُبُوا}}.',
      'Olumsuz emir: {{لَا}} + cezmli fiil: {{لَا تَكْتُبْ}} "yazma".'
    ],
    mistakes: [
      { bad: 'لَا اُكْتُبْ', good: 'لَا تَكْتُبْ', why: 'Olumsuz emir, emirden değil {{تَـ}} ile başlayan fiilden yapılır.' },
      { bad: 'اِكْتُبْ', good: 'اُكْتُبْ', why: 'Fiilin ortası ötreli (yektubu) olduğu için baştaki elif de ötrelidir.' },
      { bad: 'يَا فَاطِمَةُ، اُكْتُبْ', good: 'يَا فَاطِمَةُ، اُكْتُبِي', why: 'Kıza söylenen emir {{ـِي}} ile biter.' }
    ],
    words: [
      { ar: 'مَدْرَسَة', tl: 'medrese', tr: 'okul', en: 'school' },
      { ar: 'فَصْل', tl: 'fasl', tr: 'sınıf', en: 'classroom' },
      { ar: 'مُعَلِّم', tl: "mu‘allim", tr: 'öğretmen', en: 'teacher' },
      { ar: 'طَالِب', tl: 'tâlib', tr: 'öğrenci', en: 'student' },
      { ar: 'كِتَاب', tl: 'kitâb', tr: 'kitap', en: 'book' },
      { ar: 'دَفْتَر', tl: 'defter', tr: 'defter', en: 'notebook' },
      { ar: 'قَلَم', tl: 'kalem', tr: 'kalem', en: 'pen' },
      { ar: 'سَبُّورَة', tl: 'sebbûre', tr: 'yazı tahtası', en: 'board' },
      { ar: 'مِمْسَحَة', tl: 'mimseha', tr: 'silgi', en: 'eraser' },
      { ar: 'وَاجِب', tl: 'vâcib', tr: 'ödev', en: 'homework' },
      { ar: 'اُكْتُبْ', tl: 'uktub', tr: 'yaz', en: 'write' },
      { ar: 'اِقْرَأْ', tl: "ikra'", tr: 'oku', en: 'read' },
      { ar: 'اِسْمَعْ', tl: "isma‘", tr: 'dinle', en: 'listen' },
      { ar: 'اِجْلِسْ', tl: 'iclis', tr: 'otur', en: 'sit down' },
      { ar: 'قُمْ', tl: 'kum', tr: 'kalk', en: 'stand up' }
    ],
    summaryNarr: "Okulda ve Sınıfta dersini bitirdiniz, tebrikler! Kısa bir tekrar yapalım.\n\nSınıfta: {{مُعَلِّمٌ}} öğretmen, {{طَالِبٌ}} öğrenci, {{كِتَابٌ}} kitap, {{دَفْتَرٌ}} defter, {{سَبُّورَةٌ}} tahta.\n\nEmir üç adımda yapılır: tektubu fiilinden te atılır, son u sesi kalkar, başa elif gelir: uktub. Kıza uktubî, sınıfa uktubû. Yapma demek için başa lâ gelir ve te kalır: lâ tektub, yazma.\n\nEtkinliklerde önce 'Emir ve anlamı' eşleştirmesini yapın, sonra 'Emri tamamla' alıştırmasında kıza ve sınıfa söylenen emirleri deneyin.",
    acts: [
      { type: 'flash', title: 'Okul kartları', desc: 'Sınıf eşyalarını ve emirleri kartlarla öğren.', glyph: 'قَلَم', items: null },
      {
        type: 'match', title: 'Emir ve anlamı', desc: 'Öğretmenin emrini anlamıyla eşleştir.', glyph: 'اُكْتُبْ',
        items: [['اُكْتُبْ', 'yaz'], ['اِقْرَأْ', 'oku'], ['اِسْمَعْ', 'dinle'], ['اُنْظُرْ', 'bak'], ['اِجْلِسْ', 'otur'], ['قُمْ', 'kalk']]
      },
      {
        type: 'mc', title: 'Öğretmen ne dedi?', desc: 'Emirleri ve sınıf kelimelerini anla.', glyph: 'مُعَلِّم',
        items: [
          { q: 'Öğretmen {{اِجْلِسْ}} dedi. Ne yapmalısın?', options: ['oturmalıyım', 'kalkmalıyım', 'yazmalıyım', 'okumalıyım'], a: 'oturmalıyım' },
          { q: '"Tahtaya bak." hangisidir?', options: ['اُنْظُرْ إِلَى السَّبُّورَةِ', 'اُكْتُبْ عَلَى السَّبُّورَةِ', 'اِسْمَعِ السَّبُّورَةَ', 'اِقْرَأِ السَّبُّورَةَ'], a: 'اُنْظُرْ إِلَى السَّبُّورَةِ' },
          { q: '{{تَكْتُبُ}} fiilinin emri hangisidir?', options: ['اُكْتُبْ', 'اِكْتُبْ', 'تَكْتُبْ', 'كْتُبْ'], a: 'اُكْتُبْ', why: 'Ortası ötreli: başa ötreli elif.' },
          { q: 'Kıza "yaz" nasıl denir?', options: ['اُكْتُبِي', 'اُكْتُبْ', 'اُكْتُبُوا', 'تَكْتُبِينَ'], a: 'اُكْتُبِي' },
          { q: '"Sınıfta konuşma." hangisidir?', options: ['لَا تَتَكَلَّمْ فِي الْفَصْلِ', 'لَا تَتَكَلَّمُ فِي الْفَصْلِ', 'تَكَلَّمْ فِي الْفَصْلِ', 'لَا تَكَلَّمَ فِي الْفَصْلِ'], a: 'لَا تَتَكَلَّمْ فِي الْفَصْلِ', why: 'Olumsuz emirde fiil cezmlidir.' },
          { q: '{{سَبُّورَةٌ}} ne demektir?', options: ['yazı tahtası', 'silgi', 'çanta', 'sınıf'], a: 'yazı tahtası' }
        ]
      },
      {
        type: 'fill', title: 'Emri tamamla', desc: 'Kime söylendiğine bakarak doğru emri seç.', glyph: '___',
        items: [
          { s: '___ الْكِتَابَ', tr: 'Kitabı oku.', hint: 'Kitabı oku.', options: ['اِقْرَأِ', 'اُقْرَأْ', 'تَقْرَأُ'], a: 'اِقْرَأِ', why: 'Ortası üstünlü (yakra\'u): başa esreli elif; "el" öncesi cezm esreye döner.' },
          { s: 'لَا ___ الْوَاجِبَ', tr: 'Ödevi unutma.', hint: 'Ödevi unutma.', options: ['تَنْسَ', 'تَنْسَى', 'اِنْسَ'], a: 'تَنْسَ', why: 'Olumsuz emirde fiil cezmlenir; sondaki elif düşer.' },
          { s: 'يَا أَحْمَدُ، ___ فِي الدَّفْتَرِ', tr: 'Ahmet, deftere yaz.', hint: 'Ahmet, deftere yaz.', options: ['اُكْتُبْ', 'اُكْتُبِي', 'اُكْتُبُوا'], a: 'اُكْتُبْ' },
          { s: 'يَا طُلَّابُ، ___ الْكُتُبَ', tr: 'Öğrenciler, kitapları açın.', hint: 'Öğrenciler, kitapları açın.', options: ['اِفْتَحُوا', 'اِفْتَحْ', 'اِفْتَحِي'], a: 'اِفْتَحُوا' },
          { s: 'يَا مَرْيَمُ، ___ جَيِّدًا', tr: 'Meryem, iyi dinle.', hint: 'Meryem, iyi dinle.', options: ['اِسْمَعِي', 'اِسْمَعْ', 'اِسْمَعُوا'], a: 'اِسْمَعِي' }
        ]
      },
      LISTEN,
      SPEAK,
      {
        type: 'test', title: 'Okulda testi', desc: 'Karma değerlendirme.', glyph: '؟',
        items: [
          { q: '"Öğretmen" hangisidir?', options: ['مُعَلِّمٌ', 'طَالِبٌ', 'مُدِيرٌ', 'كَاتِبٌ'], a: 'مُعَلِّمٌ' },
          { t: 'tf', s: 'اُكْتُبُوا birden fazla kişiye söylenen emirdir.', a: true },
          { t: 'tf', s: 'Olumsuz emir, emir kipinin başına لَا getirilerek yapılır.', a: false, why: '{{لَا}} + {{تَـ}} ile başlayan cezmli fiil: {{لَا تَكْتُبْ}}.' },
          { t: 'order', w: ['اُنْظُرْ', 'إِلَى', 'السَّبُّورَةِ'], tr: 'Tahtaya bak.' },
          { t: 'order', w: ['لَا', 'تَتَكَلَّمْ', 'فِي', 'الْفَصْلِ'], tr: 'Sınıfta konuşma.' },
          { q: '{{قُمْ}} ne demektir?', options: ['kalk', 'otur', 'gel', 'git'], a: 'kalk' },
          { t: 'fill', s: '___ إِلَى السَّبُّورَةِ', tr: 'Tahtaya gel (erkeğe).', hint: 'Tahtaya gel.', options: ['تَعَالَ', 'تَعَالِي', 'قُمْ'], a: 'تَعَالَ' },
          { q: '{{مِمْسَحَةٌ}} ne demektir?', options: ['silgi', 'cetvel', 'kalemlik', 'defter'], a: 'silgi' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- 16. Yemek ve Alışveriş */
  {
    id: 'yemek', n: 16, level: 'Başlangıç', glyph: 'ط', ar: 'الطَّعَامُ وَالتَّسَوُّقُ', name: 'Yemek ve Alışveriş',
    desc: 'Yiyecek ve içecekler, {{أُرِيدُ}} "istiyorum", {{أُحِبُّ}} "seviyorum" ve fiyat sormak: {{بِكَمْ؟}}',
    long: 'Temel yiyecek ve içecekler; istek ve beğeni bildirmek; lokantada sipariş vermek ve çarşıda fiyat sormak.',
    tags: 'yemek içecek su ekmek çay kahve et tavuk balık meyve süt istiyorum seviyorum kaça fiyat pahalı ucuz urid uhibb bikam taam lokanta çarşı',
    readMins: 11,
    intro: 'Bu derste sofraya ve çarşıya çıkıyoruz. Yiyecek adlarını öğrenip {{أُرِيدُ}} "istiyorum" ve {{أُحِبُّ}} "seviyorum" fiilleriyle cümle kuracak, sonunda {{بِكَمْ هٰذَا؟}} "Bu kaça?" diye sormayı öğreneceksin.',
    lesson: [
      {
        h: 'Yiyecek ve içecekler',
        p: ['Bu kelimelerin bir kısmı Türkçede de var: {{شَايٌ}} çay, {{قَهْوَةٌ}} kahve, {{عَسَلٌ}} bal (asel), {{لَحْمٌ}} et (lahm).'],
        table: {
          cols: ['Yiyecek', 'Anlam', 'İçecek', 'Anlam'],
          rows: [
            ['خُبْزٌ', 'ekmek', 'مَاءٌ', 'su'],
            ['لَحْمٌ', 'et', 'حَلِيبٌ', 'süt'],
            ['دَجَاجٌ', 'tavuk', 'شَايٌ', 'çay'],
            ['سَمَكٌ', 'balık', 'قَهْوَةٌ', 'kahve'],
            ['أَرُزٌّ', 'pirinç, pilav', 'عَصِيرٌ', 'meyve suyu'],
            ['بَيْضٌ', 'yumurta', 'فَاكِهَةٌ', 'meyve']
          ]
        },
        tips: [
          '<b>Lahmacun</b>, Arapça {{لَحْمٌ بِعَجِينٍ}} "hamurlu et" ifadesinden gelir.',
          'Öğünler: {{فُطُورٌ}} kahvaltı ("iftar" ile aynı kökten), {{غَدَاءٌ}} öğle yemeği, {{عَشَاءٌ}} akşam yemeği.'
        ],
        narr: "Merhaba! Bugün acıktık, sofraya oturuyoruz. Önce yiyecekleri öğrenelim.\n\nEkmek: {{خُبْزٌ}}, hubz. Et: {{لَحْمٌ}}, lahm. Lahmacun kelimesindeki lahm işte bu: lahm bi aceen, hamurlu et. Tavuk: {{دَجَاجٌ}}, decâc. Balık: {{سَمَكٌ}}, semek. Pirinç ya da pilav: {{أَرُزٌّ}}, eruzz. Yumurta: {{بَيْضٌ}}, beyd.\n\nİçecekler: su {{مَاءٌ}}, mâ. Süt {{حَلِيبٌ}}, halîb. Çay {{شَايٌ}}, şây. Kahve {{قَهْوَةٌ}}, kahve. Meyve suyu {{عَصِيرٌ}}, asîr.\n\nÖğünler de güzel: kahvaltı {{فُطُورٌ}}, futûr. Ramazanda iftar kelimesini kullanırız, ikisi aynı kökten: orucu açmak. Öğle yemeği {{غَدَاءٌ}}, gadâ. Akşam yemeği {{عَشَاءٌ}}, aşâ. Yatsı namazına neden işâ dendiğini şimdi tahmin edebilirsiniz: akşamın karanlığı."
      },
      {
        h: 'İstemek ve sevmek: أُرِيدُ، أُحِبُّ',
        p: [
          '{{أُرِيدُ}} "istiyorum" ve {{أُحِبُّ}} "seviyorum" fiillerinden sonra istenen şey nesne olur, sonu üstünlü okunur: {{أُرِيدُ مَاءً}} "Su istiyorum."',
          'Olumsuz için başa {{لَا}} gelir: {{لَا أُحِبُّ السَّمَكَ}} "Balığı sevmem." Bir şeyi genel olarak sevdiğini söylerken isim "el" takısı alır: {{أُحِبُّ الشَّايَ}} "Çayı severim."'
        ],
        ex: [
          { ar: 'أُرِيدُ مَاءً', tl: 'urîdu mâen', tr: 'Su istiyorum.', en: 'I want water.' },
          { ar: 'أُرِيدُ كُوبَ شَايٍ مِنْ فَضْلِكَ', tl: 'urîdu kûbe şâyin min fadlike', tr: 'Bir bardak çay istiyorum, lütfen.', en: 'I would like a cup of tea, please.' },
          { ar: 'أُحِبُّ الْقَهْوَةَ', tl: "uhibbu'l-kahvete", tr: 'Kahveyi severim.', en: 'I like coffee.' },
          { ar: 'لَا أُحِبُّ السَّمَكَ', tl: "lâ uhibbu's-semeke", tr: 'Balığı sevmem.', en: "I don't like fish." },
          { ar: 'مَاذَا تُرِيدُ؟', tl: 'mâzâ turîdu?', tr: 'Ne istiyorsun?', en: 'What do you want?' }
        ],
        table: {
          cols: ['Kim', 'İstemek', 'Sevmek'],
          rows: [
            ['ben', 'أُرِيدُ', 'أُحِبُّ'],
            ['sen (erkek)', 'تُرِيدُ', 'تُحِبُّ'],
            ['sen (kadın)', 'تُرِيدِينَ', 'تُحِبِّينَ'],
            ['o (erkek)', 'يُرِيدُ', 'يُحِبُّ'],
            ['o (kadın)', 'تُرِيدُ', 'تُحِبُّ'],
            ['biz', 'نُرِيدُ', 'نُحِبُّ']
          ]
        },
        cmp: { tr: 'Türkçede "Su istiyorum." derken su yalın hâldedir. Arapçada istenen şey nesne olduğu için üstünlü okunur: {{مَاءً}}.', en: 'İngilizcedeki "I want water." gibi Arapçada da sıra aynıdır: önce fiil, sonra nesne.' },
        narr: "Şimdi bir şey isteyelim. İstiyorum: {{أُرِيدُ}}, urîdu. Seviyorum: {{أُحِبُّ}}, uhibbu. Muhabbet ve habip kelimeleri aynı kökten.\n\nNe istediğinizi fiilden sonra söylersiniz: {{أُرِيدُ مَاءً}}, urîdu mâen, su istiyorum. Mâ değil mâen dedik, çünkü istenen şey nesnedir ve sonu -en ile biter. Bir bardak çay istiyorum: {{أُرِيدُ كُوبَ شَايٍ}}, urîdu kûbe şâyin. Kibar olmak için sonuna min fadlike, lütfen ekleyin.\n\nSevdiğinizi söylerken isim genelde el takısı alır: {{أُحِبُّ الْقَهْوَةَ}}, uhibbu'l-kahvete, kahveyi severim. Sevmediğinizi söylemek için başa lâ getirin: {{لَا أُحِبُّ السَّمَكَ}}, balığı sevmem.\n\nKarşınızdakine sormak için: {{مَاذَا تُرِيدُ؟}}, mâzâ turîdu, ne istiyorsun? Dikkat edin, baştaki u sesi te oldu: ben urîdu, sen turîdu."
      },
      {
        h: 'Lokantada',
        p: ['Sipariş verirken nazik kalıplar kullanılır: {{مِنْ فَضْلِكَ}} "lütfen", {{شُكْرًا}} "teşekkürler". Garson yemeği getirirken {{تَفَضَّلْ}} "buyurun" der.'],
        ex: [
          { ar: 'مَاذَا تُرِيدُ أَنْ تَأْكُلَ؟', tl: "mâzâ turîdu en te'kule?", tr: 'Ne yemek istersin?', en: 'What would you like to eat?' },
          { ar: 'أُرِيدُ دَجَاجًا وَأَرُزًّا', tl: 'urîdu decâcen ve eruzzen', tr: 'Tavuk ve pilav istiyorum.', en: 'I want chicken and rice.' },
          { ar: 'وَمَاذَا تَشْرَبُ؟', tl: 've mâzâ teşrabu?', tr: 'Ne içersin?', en: 'And what will you drink?' },
          { ar: 'عَصِيرَ بُرْتُقَالٍ مِنْ فَضْلِكَ', tl: "‘asîre burtukâlin min fadlike", tr: 'Portakal suyu, lütfen.', en: 'Orange juice, please.' },
          { ar: 'الطَّعَامُ لَذِيذٌ', tl: "et-ta‘âmu lezîzun", tr: 'Yemek lezzetli.', en: 'The food is delicious.' }
        ],
        tips: ['{{أُرِيدُ أَنْ ...}} "...mek istiyorum" demektir: {{أُرِيدُ أَنْ آكُلَ}} "yemek istiyorum", {{أُرِيدُ أَنْ أَشْرَبَ}} "içmek istiyorum". {{أَنْ}}\'den sonra fiil üstünlü okunur.'],
        narr: "Şimdi bir lokantaya girdiğimizi düşünelim. Garson soruyor: {{مَاذَا تُرِيدُ أَنْ تَأْكُلَ؟}}, mâzâ turîdu en te'kule, ne yemek istersin?\n\nBurada yeni bir kalıp var: urîdu en, yani ... -mek istiyorum. Yemek istiyorum: {{أُرِيدُ أَنْ آكُلَ}}. İçmek istiyorum: {{أُرِيدُ أَنْ أَشْرَبَ}}.\n\nSiz cevap veriyorsunuz: {{أُرِيدُ دَجَاجًا وَأَرُزًّا}}, tavuk ve pilav istiyorum. Garson tekrar soruyor: {{وَمَاذَا تَشْرَبُ؟}}, ne içersin? Siz: portakal suyu, lütfen.\n\nYemek gelince garson {{تَفَضَّلْ}}, tefaddal der, yani buyurun. Siz de şükran, teşekkürler dersiniz. Yemekten sonra şunu söylemeyi unutmayın: {{الطَّعَامُ لَذِيذٌ}}, et-taâmu lezîz, yemek lezzetli. Lezzet kelimesi de buradan."
      },
      {
        h: 'Çarşıda: Kaça?',
        p: [
          'Fiyat sormak için {{بِكَمْ}} "kaça" kullanılır: {{بِكَمْ هٰذَا؟}} "Bu kaça?" Kilo ile alırken: {{بِكَمْ كِيلُو التُّفَّاحِ؟}} "Elmanın kilosu kaça?"',
          'Pahalı bulursan {{هٰذَا غَالٍ}} "Bu pahalı", uygun bulursan {{هٰذَا رَخِيصٌ}} "Bu ucuz" dersin.'
        ],
        ex: [
          { ar: 'بِكَمْ هٰذَا؟', tl: 'bikem hâzâ?', tr: 'Bu kaça?', en: 'How much is this?' },
          { ar: 'بِعَشَرَةِ رِيَالَاتٍ', tl: "bi‘aşerati riyâlâtin", tr: 'On riyale.', en: 'For ten riyals.' },
          { ar: 'هٰذَا غَالٍ جِدًّا', tl: 'hâzâ gâlin ciddan', tr: 'Bu çok pahalı.', en: 'This is very expensive.' },
          { ar: 'أُرِيدُ كِيلُو مِنَ الْمَوْزِ', tl: "urîdu kîlû mine'l-mevzi", tr: 'Bir kilo muz istiyorum.', en: 'I want a kilo of bananas.' }
        ],
        tips: ['Pazarlık ederken: {{هَلْ هُنَاكَ تَخْفِيضٌ؟}} "İndirim var mı?"'],
        narr: "Son durağımız çarşı. Alışverişte en çok kullanacağınız soru: {{بِكَمْ هٰذَا؟}}, bikem hâzâ, bu kaça? Kem kaç demekti, başına bi gelince kaça oluyor.\n\nSatıcı cevap verir: {{بِعَشَرَةِ رِيَالَاتٍ}}, on riyale. Fiyat çok yüksekse: {{هٰذَا غَالٍ جِدًّا}}, hâzâ gâlin ciddan, bu çok pahalı. Ucuzsa: {{هٰذَا رَخِيصٌ}}, bu ucuz. Ruhsat kelimesi aynı kökten, kolaylık ve izin anlamında.\n\nMeyve alırken kilo ile istersiniz: {{أُرِيدُ كِيلُو مِنَ الْمَوْزِ}}, bir kilo muz istiyorum. Pazarlık etmek isterseniz: {{هَلْ هُنَاكَ تَخْفِيضٌ؟}}, indirim var mı?\n\nArtık bir Arap ülkesinde hem lokantada sipariş verebilir hem de çarşıda alışveriş yapabilirsiniz!"
      }
    ],
    keys: [
      'Temel yiyecekler: {{خُبْزٌ}} ekmek, {{لَحْمٌ}} et, {{دَجَاجٌ}} tavuk; içecekler: {{مَاءٌ}} su, {{شَايٌ}} çay.',
      'İstek: {{أُرِيدُ}} + üstünlü isim: {{أُرِيدُ مَاءً}}.',
      'Beğeni: {{أُحِبُّ}} / {{لَا أُحِبُّ}} + belirli isim: {{أُحِبُّ الشَّايَ}}.',
      'Fiyat: {{بِكَمْ هٰذَا؟}} "Bu kaça?"; pahalı {{غَالٍ}}, ucuz {{رَخِيصٌ}}.'
    ],
    mistakes: [
      { bad: 'أُرِيدُ مَاءٌ', good: 'أُرِيدُ مَاءً', why: 'İstenen şey nesnedir, üstünlü okunur.' },
      { bad: 'أُحِبُّ سَمَكٌ', good: 'أُحِبُّ السَّمَكَ', why: 'Genel beğenide isim belirli ve üstünlüdür.' },
      { bad: 'كَمْ هٰذَا؟', good: 'بِكَمْ هٰذَا؟', why: 'Fiyat sorarken {{بِـ}} gerekir: "kaça".' }
    ],
    words: [
      { ar: 'خُبْز', tl: 'hubz', tr: 'ekmek', en: 'bread' },
      { ar: 'مَاء', tl: "mâ'", tr: 'su', en: 'water' },
      { ar: 'لَحْم', tl: 'lahm', tr: 'et', en: 'meat' },
      { ar: 'دَجَاج', tl: 'decâc', tr: 'tavuk', en: 'chicken' },
      { ar: 'سَمَك', tl: 'semek', tr: 'balık', en: 'fish' },
      { ar: 'أَرُزّ', tl: 'eruzz', tr: 'pirinç, pilav', en: 'rice' },
      { ar: 'شَاي', tl: 'şây', tr: 'çay', en: 'tea' },
      { ar: 'قَهْوَة', tl: 'kahve', tr: 'kahve', en: 'coffee' },
      { ar: 'حَلِيب', tl: 'halîb', tr: 'süt', en: 'milk' },
      { ar: 'عَصِير', tl: "‘asîr", tr: 'meyve suyu', en: 'juice' },
      { ar: 'فَاكِهَة', tl: 'fâkihe', tr: 'meyve', en: 'fruit' },
      { ar: 'أُرِيدُ', tl: 'urîdu', tr: 'istiyorum', en: 'I want' },
      { ar: 'أُحِبُّ', tl: 'uhibbu', tr: 'seviyorum', en: 'I like, I love' },
      { ar: 'بِكَمْ', tl: 'bikem', tr: 'kaça, kaç para', en: 'how much' },
      { ar: 'غَالٍ', tl: 'gâlin', tr: 'pahalı', en: 'expensive' },
      { ar: 'رَخِيص', tl: 'rahîs', tr: 'ucuz', en: 'cheap' }
    ],
    summaryNarr: "Yemek ve Alışveriş dersini bitirdiniz, tebrikler! Kısa bir tekrar yapalım.\n\nYiyecekler: {{خُبْزٌ}} ekmek, {{لَحْمٌ}} et, {{دَجَاجٌ}} tavuk, {{سَمَكٌ}} balık. İçecekler: {{مَاءٌ}} su, {{شَايٌ}} çay, {{قَهْوَةٌ}} kahve.\n\nİstemek için urîdu, sevmek için uhibbu. Urîdu'dan sonra istenen şey üstünlü okunur: urîdu mâen. Sevmediğinizi söylerken başa lâ gelir. Fiyat sormak için bikem hâzâ, bu kaça?\n\nEtkinliklerde 'Ne istiyorsun?' sorularıyla başlayın, sonra testteki kelime sıralama sorularında kendi siparişinizi kurun.",
    acts: [
      { type: 'flash', title: 'Sofra kartları', desc: 'Yiyecek ve içecekleri kartlarla öğren.', glyph: 'خُبْز', items: null },
      {
        type: 'match', title: 'Yiyecek ve anlamı', desc: 'Arapça kelimeyi anlamıyla eşleştir.', glyph: 'طَعَام',
        items: [['خُبْزٌ', 'ekmek'], ['لَحْمٌ', 'et'], ['دَجَاجٌ', 'tavuk'], ['سَمَكٌ', 'balık'], ['حَلِيبٌ', 'süt'], ['عَصِيرٌ', 'meyve suyu']]
      },
      {
        type: 'mc', title: 'Ne istiyorsun?', desc: 'İstek, beğeni ve alışveriş cümlelerini anla.', glyph: 'أُرِيدُ',
        items: [
          { q: '"Su istiyorum." hangisidir?', options: ['أُرِيدُ مَاءً', 'أُرِيدُ مَاءٌ', 'أُحِبُّ مَاءٌ', 'مَاءٌ أُرِيدُ'], a: 'أُرِيدُ مَاءً', why: 'İstenen şey üstünlü: {{مَاءً}}.' },
          { q: '{{أُحِبُّ الشَّايَ}} ne demektir?', options: ['Çayı severim.', 'Çay istiyorum.', 'Çay içiyorum.', 'Çayı sevmem.'], a: 'Çayı severim.' },
          { q: 'Fiyat sormak için hangisi kullanılır?', options: ['بِكَمْ هٰذَا؟', 'كَيْفَ هٰذَا؟', 'أَيْنَ هٰذَا؟', 'مَنْ هٰذَا؟'], a: 'بِكَمْ هٰذَا؟' },
          { q: '"Kahvaltı" hangisidir?', options: ['فُطُورٌ', 'غَدَاءٌ', 'عَشَاءٌ', 'طَعَامٌ'], a: 'فُطُورٌ' },
          { q: '{{هٰذَا غَالٍ}} ne demektir?', options: ['Bu pahalı.', 'Bu ucuz.', 'Bu lezzetli.', 'Bu güzel.'], a: 'Bu pahalı.' },
          { q: 'Garson {{تَفَضَّلْ}} dedi. Ne demek?', options: ['Buyurun.', 'Teşekkürler.', 'Lütfen.', 'Güle güle.'], a: 'Buyurun.' }
        ]
      },
      {
        type: 'fill', title: 'Cümleyi tamamla', desc: 'Sofrada ve çarşıda doğru kelimeyi seç.', glyph: '___',
        items: [
          { s: 'أُرِيدُ ___ مِنْ فَضْلِكَ', tr: 'Ekmek istiyorum, lütfen.', hint: 'Ekmek istiyorum, lütfen.', options: ['خُبْزًا', 'خُبْزٌ', 'الْخُبْزُ'], a: 'خُبْزًا', why: 'İstenen şey nesne: üstünlü.' },
          { s: '___ أُحِبُّ السَّمَكَ', tr: 'Balığı sevmem.', hint: 'Balığı sevmem.', options: ['لَا', 'لَيْسَ', 'لَمْ'], a: 'لَا' },
          { s: '___ كِيلُو التُّفَّاحِ؟', tr: 'Elmanın kilosu kaça?', hint: 'Elmanın kilosu kaça?', options: ['بِكَمْ', 'كَمْ', 'مَا'], a: 'بِكَمْ' },
          { s: 'مَاذَا ___ أَنْ تَشْرَبَ؟', tr: 'Ne içmek istiyorsun?', hint: 'Ne içmek istiyorsun?', options: ['تُرِيدُ', 'أُرِيدُ', 'يُرِيدُ'], a: 'تُرِيدُ', why: '"Sen" için {{تُـ}}: {{تُرِيدُ}}.' },
          { s: 'الطَّعَامُ ___', tr: 'Yemek lezzetli.', hint: 'Yemek lezzetli.', options: ['لَذِيذٌ', 'لَذِيذَةٌ', 'لَذِيذًا'], a: 'لَذِيذٌ', why: '{{طَعَام}} erkek; haber ötreli.' }
        ]
      },
      LISTEN,
      SPEAK,
      {
        type: 'test', title: 'Yemek ve alışveriş testi', desc: 'Karma değerlendirme.', glyph: '؟',
        items: [
          { q: '"Süt" hangisidir?', options: ['حَلِيبٌ', 'عَسَلٌ', 'عَصِيرٌ', 'خُبْزٌ'], a: 'حَلِيبٌ' },
          { t: 'tf', s: 'أُرِيدُ قَهْوَةً "Kahve istiyorum." demektir.', a: true },
          { t: 'tf', s: 'أُرِيدُ fiilinden sonra istenen şey ötreli okunur.', a: false, why: 'Üstünlü okunur: {{أُرِيدُ مَاءً}}.' },
          { t: 'order', w: ['أُرِيدُ', 'كُوبَ', 'شَايٍ'], tr: 'Bir bardak çay istiyorum.' },
          { t: 'order', w: ['بِكَمْ', 'هٰذَا'], tr: 'Bu kaça?' },
          { q: '{{رَخِيصٌ}} ne demektir?', options: ['ucuz', 'pahalı', 'yeni', 'eski'], a: 'ucuz' },
          { t: 'fill', s: 'لَا ___ اللَّحْمَ', tr: 'Eti sevmem.', hint: 'Eti sevmem.', options: ['أُحِبُّ', 'تُحِبُّ', 'حُبٌّ'], a: 'أُحِبُّ' },
          { q: '"Akşam yemeği" hangisidir?', options: ['عَشَاءٌ', 'غَدَاءٌ', 'فُطُورٌ', 'حَلْوَى'], a: 'عَشَاءٌ' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- 17. Şehirde */
  {
    id: 'sehirde', n: 17, level: 'Başlangıç', glyph: 'م', ar: 'فِي الْمَدِينَةِ', name: 'Şehirde ve Yol Tarifi',
    desc: 'Şehirdeki yerler, {{أَيْنَ ...؟}} "... nerede?", sağ, sol ve yol tarif etmek.',
    long: 'Şehirdeki yerlerin adları; bir yerin nerede olduğunu sormak ve söylemek; sağa, sola, düz git diye yol tarif etmek; ulaşım araçları.',
    tags: 'şehir yer nerede sağ sol düz yol tarif cami okul hastane eczane banka otel otobüs taksi araba ayna eyne yamin yasar madina medine',
    readMins: 11,
    intro: 'Yabancı bir şehirde en çok ihtiyaç duyulan cümle: {{أَيْنَ الْمَسْجِدُ؟}} "Cami nerede?" Bu derste şehirdeki yerleri, "sağda, solda" demeyi ve birine yol tarif etmeyi öğreneceksin.',
    lesson: [
      {
        h: 'Şehirdeki yerler',
        p: ['Yer adlarının çoğu {{مَفْعَل}} kalıbındadır, yani "bir işin yapıldığı yer": {{مَسْجِدٌ}} secde edilen yer, {{مَطْعَمٌ}} yemek ({{طَعَام}}) yenen yer, {{مَكْتَبٌ}} yazı yazılan yer (büro), {{مَلْعَبٌ}} oyun oynanan yer (stadyum).'],
        table: {
          cols: ['Yer', 'Okunuş', 'Anlam'],
          rows: [
            ['مَدِينَةٌ', 'medînetun', 'şehir'],
            ['مَسْجِدٌ', 'mescidun', 'cami, mescit'],
            ['مُسْتَشْفًى', 'musteşfen', 'hastane'],
            ['صَيْدَلِيَّةٌ', 'saydeliyyetun', 'eczane'],
            ['مَطْعَمٌ', "mat‘amun", 'lokanta'],
            ['سُوقٌ', 'sûkun', 'çarşı, pazar'],
            ['بَنْكٌ', 'benkun', 'banka'],
            ['فُنْدُقٌ', 'fundukun', 'otel'],
            ['مَحَطَّةٌ', 'mehattatun', 'durak, istasyon'],
            ['شَارِعٌ', "şâri‘un", 'cadde, sokak']
          ]
        },
        tips: ['Kalıbı tanırsan bilmediğin kelimeyi tahmin edebilirsin: {{مَكْتَبَةٌ}}, kitapların bulunduğu yer, yani kütüphane ya da kitapçı. Türkçedeki <b>mektep</b> de aynı kökten.'],
        narr: "Merhaba! Bugün şehirde dolaşıyoruz. Önce şehirdeki yerleri öğrenelim.\n\nŞehir: {{مَدِينَةٌ}}, medîne. Medine şehrinin adı buradan, şehir demek. Cami: {{مَسْجِدٌ}}, mescid. Hastane: {{مُسْتَشْفًى}}, musteşfâ. Şifa kelimesini hatırlayın, şifa bulunan yer. Eczane: {{صَيْدَلِيَّةٌ}}, saydeliyye. Lokanta: {{مَطْعَمٌ}}, mat'am. Çarşı: {{سُوقٌ}}, sûk. Banka: {{بَنْكٌ}}, benk. Otel: {{فُنْدُقٌ}}, funduk. Durak: {{مَحَطَّةٌ}}, mahatta. Cadde ya da sokak: {{شَارِعٌ}}, şâri.\n\nŞimdi bir kalıp sırrı: mescid, mat'am, mektep, mel'ab. Hepsi me ile başlıyor ve bir yer anlatıyor. Secde edilen yer mescid, yemek yenen yer mat'am, oyun oynanan yer mel'ab. Bu kalıbı görünce bir yer adı olduğunu hemen anlarsınız."
      },
      {
        h: 'Nerede?',
        p: ['Bir yerin nerede olduğunu sormak için {{أَيْنَ}} kullanılır ve sorulan yer belirli olur: {{أَيْنَ الْمَسْجِدُ؟}} "Cami nerede?" Cevapta yer bildiren kelimeler gelir: {{هُنَا}} burada, {{هُنَاكَ}} orada, {{قَرِيبٌ}} yakın, {{بَعِيدٌ}} uzak, {{بِجَانِبِ}} yanında, {{أَمَامَ}} önünde.'],
        ex: [
          { ar: 'أَيْنَ الْمَسْجِدُ؟', tl: "eyne'l-mescidu?", tr: 'Cami nerede?', en: 'Where is the mosque?' },
          { ar: 'الْمَسْجِدُ قَرِيبٌ مِنْ هُنَا', tl: 'el-mescidu karîbun min hunâ', tr: 'Cami buraya yakın.', en: 'The mosque is near here.' },
          { ar: 'هَلِ الْمُسْتَشْفَى بَعِيدٌ؟', tl: "heli'l-musteşfâ ba‘îdun?", tr: 'Hastane uzak mı?', en: 'Is the hospital far?' },
          { ar: 'الصَّيْدَلِيَّةُ بِجَانِبِ الْبَنْكِ', tl: "es-saydeliyyetu bicânibi'l-benki", tr: 'Eczane bankanın yanında.', en: 'The pharmacy is next to the bank.' },
          { ar: 'الْفُنْدُقُ أَمَامَ الْمَحَطَّةِ', tl: "el-funduku emâme'l-mehatteti", tr: 'Otel istasyonun önünde.', en: 'The hotel is in front of the station.' }
        ],
        cmp: { tr: 'Türkçede soru kelimesi sonda gelir: "Cami nerede?" Arapçada {{أَيْنَ}} her zaman başta gelir.', en: 'İngilizcedeki gibi soru kelimesi başta: Where is the mosque? = {{أَيْنَ الْمَسْجِدُ؟}}' },
        narr: "Şimdi en önemli soruyu öğrenelim: nerede? Arapçası {{أَيْنَ}}, eyne. Türkçede nerede sonda gelir, Arapçada hep başta: {{أَيْنَ الْمَسْجِدُ؟}}, eyne'l-mescid, cami nerede?\n\nBelli bir yeri sorduğumuz için isim el takısı alır: el-mescid, el-benk, el-funduk.\n\nCevaplar: {{الْمَسْجِدُ قَرِيبٌ مِنْ هُنَا}}, cami buraya yakın. Karîb yakın, akraba kelimesi de aynı kökten, yakınlar demek. Uzak: {{بَعِيدٌ}}, baîd. Uzak mı diye sormak için başa hel: {{هَلِ الْمُسْتَشْفَى بَعِيدٌ؟}}\n\nYer bildiren kelimelerle cevap verebilirsiniz: {{الصَّيْدَلِيَّةُ بِجَانِبِ الْبَنْكِ}}, eczane bankanın yanında. {{الْفُنْدُقُ أَمَامَ الْمَحَطَّةِ}}, otel istasyonun önünde. Bu kelimeleri Harf-i Cerler dersinde de görmüştük."
      },
      {
        h: 'Sağ, sol, düz: yol tarifi',
        p: [
          'Yön kelimeleri: {{يَمِينٌ}} sağ, {{يَسَارٌ}} sol. "Sağda" ya da "sağa" demek için {{عَلَى الْيَمِينِ}}, "solda" için {{عَلَى الْيَسَارِ}} denir. Düz: {{مُبَاشَرَةً}}.',
          'Yol tarifinde emir kullanılır (Okulda dersindeki gibi): {{اِذْهَبْ}} git, {{خُذْ}} al, {{اِرْجِعْ}} geri dön, {{قِفْ}} dur.'
        ],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam'],
          rows: [
            ['اِذْهَبْ مُبَاشَرَةً', 'izheb mubâşeraten', 'dümdüz git'],
            ['خُذِ الشَّارِعَ الْأَوَّلَ', "huzi'ş-şâri‘a'l-evvele", 'ilk sokağa sap'],
            ['عَلَى الْيَمِينِ', "‘ale'l-yemîni", 'sağda, sağa'],
            ['عَلَى الْيَسَارِ', "‘ale'l-yesâri", 'solda, sola'],
            ['اِرْجِعْ', "irci‘", 'geri dön'],
            ['قِفْ هُنَا', 'kıf hunâ', 'burada dur']
          ]
        },
        ex: [
          { ar: 'اِذْهَبْ مُبَاشَرَةً ثُمَّ خُذِ الشَّارِعَ الثَّانِيَ عَلَى الْيَمِينِ', tl: "izheb mubâşeraten summe huzi'ş-şâri‘a's-sâniye ‘ale'l-yemîni", tr: 'Dümdüz git, sonra sağdaki ikinci sokağa sap.', en: 'Go straight, then take the second street on the right.' },
          { ar: 'الْمَسْجِدُ عَلَى الْيَسَارِ', tl: "el-mescidu ‘ale'l-yesâri", tr: 'Cami solda.', en: 'The mosque is on the left.' }
        ],
        tips: [
          '{{يَمِينٌ}} Türkçedeki <b>yemin</b> kelimesiyle aynıdır: Arapçada hem "sağ el" hem de "ant" demektir.',
          'Kibar başlamak için: {{لَوْ سَمَحْتَ، أَيْنَ ...؟}} "Affedersiniz, ... nerede?"'
        ],
        narr: "Şimdi birine yol tarif edelim ya da yol soralım.\n\nSağ: {{يَمِينٌ}}, yemîn. Türkçedeki yemin kelimesiyle aynı! Arapçada hem sağ el hem de ant demek. Sol: {{يَسَارٌ}}, yesâr. Sağda demek için alâ kullanılır: {{عَلَى الْيَمِينِ}}, ale'l-yemîn. Solda: {{عَلَى الْيَسَارِ}}, ale'l-yesâr.\n\nYol tarifinde Okulda dersindeki emirleri kullanırız. Git: {{اِذْهَبْ}}, izheb. Düz git: {{اِذْهَبْ مُبَاشَرَةً}}, izheb mubâşeraten. Mübaşir kelimesini biliyorsunuz, doğrudan iş gören kişi. Al: {{خُذْ}}, huz. İlk sokağa sap: kelimesi kelimesine ilk sokağı al: {{خُذِ الشَّارِعَ الْأَوَّلَ}}. Geri dön: {{اِرْجِعْ}}, irci. Dur: {{قِفْ}}, kıf.\n\nKibarca sormak için: {{لَوْ سَمَحْتَ، أَيْنَ الْبَنْكُ؟}}, lev semahte, eyne'l-benk? Affedersiniz, banka nerede?"
      },
      {
        h: 'Ulaşım',
        p: ['Bir yere nasıl gittiğini söylemek için {{بِـ}} "ile" kullanılır: {{بِالسَّيَّارَةِ}} arabayla, {{بِالْحَافِلَةِ}} otobüsle. Yürüyerek gidiyorsan: {{مَشْيًا}}.'],
        ex: [
          { ar: 'أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالْحَافِلَةِ', tl: "ezhebu ile'l-medreseti bi'l-hâfileti", tr: 'Okula otobüsle giderim.', en: 'I go to school by bus.' },
          { ar: 'كَيْفَ تَذْهَبُ إِلَى الْعَمَلِ؟', tl: "keyfe tezhebu ile'l-‘ameli?", tr: 'İşe nasıl gidiyorsun?', en: 'How do you go to work?' },
          { ar: 'أَذْهَبُ مَشْيًا', tl: 'ezhebu meşyen', tr: 'Yürüyerek giderim.', en: 'I go on foot.' },
          { ar: 'أَيْنَ مَوْقِفُ الْحَافِلَاتِ؟', tl: "eyne mevkıfu'l-hâfilâti?", tr: 'Otobüs durağı nerede?', en: 'Where is the bus stop?' }
        ],
        table: {
          cols: ['Araç', 'Anlam'],
          rows: [
            ['سَيَّارَةٌ', 'araba'],
            ['حَافِلَةٌ', 'otobüs'],
            ['سَيَّارَةُ أُجْرَةٍ', 'taksi'],
            ['قِطَارٌ', 'tren'],
            ['طَائِرَةٌ', 'uçak'],
            ['دَرَّاجَةٌ', 'bisiklet']
          ]
        },
        narr: "Son olarak ulaşım. Araba: {{سَيَّارَةٌ}}, seyyâre. Seyyar ve seyir kelimeleri aynı kökten, hareket eden demek. Otobüs: {{حَافِلَةٌ}}, hâfile. Taksi: {{سَيَّارَةُ أُجْرَةٍ}}, ücretli araba. Ücret ve ecir kelimeleri de buradan. Tren: {{قِطَارٌ}}, kıtâr. Türkçede tren katarı deriz, işte o katar! Uçak: {{طَائِرَةٌ}}, tâire. Tayyare kelimesini hatırlayın.\n\nNasıl gittiğinizi söylemek için bi, yani ile kullanılır: {{أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالْحَافِلَةِ}}, okula otobüsle giderim. Arabayla: {{بِالسَّيَّارَةِ}}. Yürüyerek: {{مَشْيًا}}, meşyen. Meşy yürümek demek.\n\nKarşınızdakine sormak için: {{كَيْفَ تَذْهَبُ إِلَى الْعَمَلِ؟}}, işe nasıl gidiyorsun? Artık şehirde kaybolmazsınız!"
      }
    ],
    keys: [
      'Yerler {{مَفْعَل}} kalıbında: {{مَسْجِدٌ}}, {{مَطْعَمٌ}}, {{مَكْتَبٌ}}.',
      'Soru: {{أَيْنَ ...؟}} "... nerede?" (sorulan yer belirli: {{أَيْنَ الْبَنْكُ؟}}).',
      'Sağda {{عَلَى الْيَمِينِ}}, solda {{عَلَى الْيَسَارِ}}, düz {{مُبَاشَرَةً}}.',
      'Araçla gitmek: {{بِالْحَافِلَةِ}} otobüsle, {{مَشْيًا}} yürüyerek.'
    ],
    mistakes: [
      { bad: 'أَيْنَ مَسْجِدٌ؟', good: 'أَيْنَ الْمَسْجِدُ؟', why: 'Belli bir yeri soruyorsun; isim belirlidir.' },
      { bad: 'فِي الْيَمِينِ', good: 'عَلَى الْيَمِينِ', why: '"Sağda" için {{عَلَى}} kullanılır.' },
      { bad: 'أَذْهَبُ بِحَافِلَةٌ', good: 'أَذْهَبُ بِالْحَافِلَةِ', why: '{{بِـ}}\'den sonra isim esrelidir; araç adları genelde belirli kullanılır.' }
    ],
    words: [
      { ar: 'مَدِينَة', tl: 'medîne', tr: 'şehir', en: 'city' },
      { ar: 'مَسْجِد', tl: 'mescid', tr: 'cami, mescit', en: 'mosque' },
      { ar: 'مُسْتَشْفَى', tl: 'musteşfâ', tr: 'hastane', en: 'hospital' },
      { ar: 'صَيْدَلِيَّة', tl: 'saydeliyye', tr: 'eczane', en: 'pharmacy' },
      { ar: 'مَطْعَم', tl: "mat‘am", tr: 'lokanta, restoran', en: 'restaurant' },
      { ar: 'سُوق', tl: 'sûk', tr: 'çarşı, pazar', en: 'market' },
      { ar: 'بَنْك', tl: 'benk', tr: 'banka', en: 'bank' },
      { ar: 'فُنْدُق', tl: 'funduk', tr: 'otel', en: 'hotel' },
      { ar: 'شَارِع', tl: "şâri‘", tr: 'cadde, sokak', en: 'street' },
      { ar: 'يَمِين', tl: 'yemîn', tr: 'sağ', en: 'right' },
      { ar: 'يَسَار', tl: 'yesâr', tr: 'sol', en: 'left' },
      { ar: 'أَيْنَ', tl: 'eyne', tr: 'nerede', en: 'where' },
      { ar: 'قَرِيب', tl: 'karîb', tr: 'yakın', en: 'near' },
      { ar: 'بَعِيد', tl: "ba‘îd", tr: 'uzak', en: 'far' },
      { ar: 'حَافِلَة', tl: 'hâfile', tr: 'otobüs', en: 'bus' },
      { ar: 'سَيَّارَة', tl: 'seyyâre', tr: 'araba', en: 'car' }
    ],
    summaryNarr: "Şehirde ve Yol Tarifi dersini bitirdiniz, tebrikler! Kısa bir tekrar yapalım.\n\nŞehirdeki yerler çoğunlukla me ile başlayan yer kalıbındadır: {{مَسْجِدٌ}} cami, {{مَطْعَمٌ}} lokanta. Bir yeri sormak için eyne: {{أَيْنَ الْمَسْجِدُ؟}}, cami nerede? Sağda ale'l-yemîn, solda ale'l-yesâr, düz mubâşeraten.\n\nNasıl gittiğinizi bi ile söylersiniz: bi'l-hâfile otobüsle, bi's-seyyâre arabayla, yürüyerek meşyen.\n\nEtkinliklerde önce 'Yer ve anlamı' eşleştirmesini yapın, sonra 'Nerede?' sorularıyla yol tarifini çalışın.",
    acts: [
      { type: 'flash', title: 'Şehir kartları', desc: 'Şehirdeki yerleri ve yön kelimelerini kartlarla öğren.', glyph: 'مَسْجِد', items: null },
      {
        type: 'match', title: 'Yer ve anlamı', desc: 'Şehirdeki yerleri anlamlarıyla eşleştir.', glyph: 'مَدِينَة',
        items: [['مَسْجِدٌ', 'cami'], ['مُسْتَشْفًى', 'hastane'], ['صَيْدَلِيَّةٌ', 'eczane'], ['مَطْعَمٌ', 'lokanta'], ['فُنْدُقٌ', 'otel'], ['سُوقٌ', 'çarşı']]
      },
      {
        type: 'mc', title: 'Nerede?', desc: 'Yer sormayı ve yol tarifini anla.', glyph: 'أَيْنَ',
        items: [
          { q: '"Cami nerede?" hangisidir?', options: ['أَيْنَ الْمَسْجِدُ؟', 'مَتَى الْمَسْجِدُ؟', 'كَيْفَ الْمَسْجِدُ؟', 'أَيْنَ مَسْجِدٌ؟'], a: 'أَيْنَ الْمَسْجِدُ؟', why: 'Soru {{أَيْنَ}}; belli bir yer sorulduğu için isim belirli.' },
          { q: '{{عَلَى الْيَسَارِ}} ne demektir?', options: ['solda', 'sağda', 'düz', 'arkada'], a: 'solda' },
          { q: 'İlaç almak için nereye gidersin?', options: ['صَيْدَلِيَّةٌ', 'مَطْعَمٌ', 'فُنْدُقٌ', 'مَلْعَبٌ'], a: 'صَيْدَلِيَّةٌ' },
          { q: '"Dümdüz git." hangisidir?', options: ['اِذْهَبْ مُبَاشَرَةً', 'اِرْجِعْ', 'قِفْ هُنَا', 'خُذِ الشَّارِعَ الْأَوَّلَ'], a: 'اِذْهَبْ مُبَاشَرَةً' },
          { q: '{{بِالْحَافِلَةِ}} ne demektir?', options: ['otobüsle', 'arabayla', 'yürüyerek', 'trenle'], a: 'otobüsle' },
          { q: '{{مَطْعَمٌ}} ne demektir?', options: ['lokanta', 'mutfak', 'çarşı', 'okul'], a: 'lokanta', why: '{{طَعَام}} yemek: yemek yenen yer.' }
        ]
      },
      {
        type: 'fill', title: 'Yol tarifini tamamla', desc: 'Doğru kelimeyle cümleyi tamamla.', glyph: '___',
        items: [
          { s: '___ الْبَنْكُ؟', tr: 'Banka nerede?', hint: 'Banka nerede?', options: ['أَيْنَ', 'مَتَى', 'مَنْ'], a: 'أَيْنَ' },
          { s: 'الْمَسْجِدُ عَلَى ___', tr: 'Cami sağda.', hint: 'Cami sağda.', options: ['الْيَمِينِ', 'الْيَسَارِ', 'يَمِينٌ'], a: 'الْيَمِينِ', why: '{{عَلَى}}\'dan sonra isim esreli: {{الْيَمِينِ}}.' },
          { s: 'أَذْهَبُ إِلَى الْعَمَلِ ___', tr: 'İşe arabayla giderim.', hint: 'İşe arabayla giderim.', options: ['بِالسَّيَّارَةِ', 'السَّيَّارَةُ', 'فِي السَّيَّارَةِ'], a: 'بِالسَّيَّارَةِ' },
          { s: 'الْفُنْدُقُ ___ مِنْ هُنَا', tr: 'Otel buraya yakın.', hint: 'Otel buraya yakın.', options: ['قَرِيبٌ', 'بَعِيدٌ', 'قَرِيبَةٌ'], a: 'قَرِيبٌ', why: '{{فُنْدُق}} erkek.' },
          { s: 'اِذْهَبْ مُبَاشَرَةً ___ خُذِ الشَّارِعَ الْأَوَّلَ', tr: 'Dümdüz git, sonra ilk sokağa sap.', hint: 'Dümdüz git, sonra ilk sokağa sap.', options: ['ثُمَّ', 'أَوْ', 'لٰكِنْ'], a: 'ثُمَّ' }
        ]
      },
      LISTEN,
      SPEAK,
      {
        type: 'test', title: 'Şehirde testi', desc: 'Karma değerlendirme.', glyph: '؟',
        items: [
          { q: '"Hastane" hangisidir?', options: ['مُسْتَشْفًى', 'مَسْجِدٌ', 'مَدْرَسَةٌ', 'مَكْتَبٌ'], a: 'مُسْتَشْفًى' },
          { t: 'tf', s: 'عَلَى الْيَمِينِ "solda" demektir.', a: false, why: '"Sağda" demektir; solda {{عَلَى الْيَسَارِ}}.' },
          { t: 'tf', s: 'أَيْنَ soru kelimesi cümlenin başında gelir.', a: true },
          { t: 'order', w: ['أَيْنَ', 'الْفُنْدُقُ'], tr: 'Otel nerede?' },
          { t: 'order', w: ['الصَّيْدَلِيَّةُ', 'بِجَانِبِ', 'الْبَنْكِ'], tr: 'Eczane bankanın yanında.' },
          { q: '{{مَشْيًا}} ne demektir?', options: ['yürüyerek', 'koşarak', 'arabayla', 'hızlıca'], a: 'yürüyerek' },
          { t: 'fill', s: 'أَذْهَبُ إِلَى الْمَدْرَسَةِ ___', tr: 'Okula otobüsle giderim.', hint: 'Okula otobüsle giderim.', options: ['بِالْحَافِلَةِ', 'الْحَافِلَةُ', 'حَافِلَةٌ'], a: 'بِالْحَافِلَةِ' },
          { q: '{{سُوقٌ}} ne demektir?', options: ['çarşı, pazar', 'sokak', 'durak', 'park'], a: 'çarşı, pazar' }
        ]
      }
    ]
  }
];
