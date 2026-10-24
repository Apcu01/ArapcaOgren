window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'zamirler', n: 2, level: 'Başlangıç', glyph: 'ض',
  ar: 'الضَّمَائِرُ', name: 'Zamirler',
  desc: 'Şahıs zamirleri (ben, sen, o…) ve işaret zamirleri (bu, şu).',
  long: 'Arapçada “sen” ve “o”nun erkek ve kadın için ayrı biçimleri, ikili (dual) zamirler ve “bu / şu” işaret zamirleri. “Ben öğrenciyim” gibi ilk cümlelerini kur.',
  tags: 'ben sen o biz siz onlar ana anta huwa hiya bu şu haza hazihi işaret',
  readMins: 14,
  intro: 'Zamirler Arapça cümlenin iskeletidir. Türkçede tek bir “o” varken Arapçada <b>erkek için</b> {{هُوَ}}, <b>kadın için</b> {{هِيَ}} vardır. “Sen” için de durum aynıdır. Ayrıca Arapçada iki kişiyi anlatan <b>ikil (dual)</b> zamirler bulunur. Bu derste ayrı yazılan şahıs zamirlerini ve “bu, şu” işaret zamirlerini öğreneceksin.',
  lesson: [
    {
      h: 'Tekil şahıs zamirleri',
      p: [
        'Önce en sık kullanılan beş zamir: <b>ben, sen (erkek), sen (kadın), o (erkek), o (kadın)</b>. Arapçada konuştuğun kişinin cinsiyeti zamiri değiştirir: bir erkeğe {{أَنْتَ}} (ente), bir kadına {{أَنْتِ}} (enti) dersin. Fark sadece son harekededir!'
      ],
      table: {
        cols: ['Zamir', 'Okunuş', 'Türkçe', 'English'],
        rows: [
          ['أَنَا', 'ene', 'ben', 'I'],
          ['أَنْتَ', 'ente', 'sen (erkek)', 'you (m.)'],
          ['أَنْتِ', 'enti', 'sen (kadın)', 'you (f.)'],
          ['هُوَ', 'huve', 'o (erkek)', 'he / it'],
          ['هِيَ', 'hiye', 'o (kadın)', 'she / it']
        ]
      },
      cmp: {
        tr: 'Türkçede “o” cinsiyetsizdir: <em>O doktor</em> hem erkek hem kadın için. Arapçada {{هُوَ طَبِيبٌ}} (erkek) / {{هِيَ طَبِيبَةٌ}} (kadın) dersin.',
        en: 'İngilizce <b>he / she</b> ayrımı Arapçadaki {{هُوَ}} / {{هِيَ}} ile aynıdır. Ama İngilizcedeki tek <b>you</b>, Arapçada cinsiyete ve sayıya göre beş farklı biçime ayrılır.'
      },
      tips: ['Cansız varlıklar da erkek ya da dişildir: kitap ({{كِتَابٌ}}) erkek olduğu için “o” = {{هُوَ}}, araba ({{سَيَّارَةٌ}}) dişil olduğu için “o” = {{هِيَ}}. İngilizce “it” Arapçada yoktur.']
    },
    {
      h: 'Çoğul ve ikil zamirler',
      p: [
        'Arapçada <b>iki kişi</b> için ayrı zamirler vardır (ikil / dual). “Siz ikiniz” {{أَنْتُمَا}}, “onlar ikisi” {{هُمَا}}. Çoğulda da erkek ve kadın ayrılır.',
        'Karışık bir grup (erkekler ve kadınlar) için <b>erkek çoğul</b> kullanılır. Kadın çoğul biçimleri sadece grubun tamamı kadınsa kullanılır.'
      ],
      table: {
        cols: ['Zamir', 'Okunuş', 'Türkçe', 'English'],
        rows: [
          ['نَحْنُ', 'nahnu', 'biz', 'we'],
          ['أَنْتُمَا', 'entumâ', 'siz ikiniz', 'you two'],
          ['أَنْتُمْ', 'entum', 'siz (erkek / karışık)', 'you (pl. m.)'],
          ['أَنْتُنَّ', 'entunne', 'siz (kadınlar)', 'you (pl. f.)'],
          ['هُمَا', 'humâ', 'onlar ikisi', 'they two'],
          ['هُمْ', 'hum', 'onlar (erkek / karışık)', 'they (m.)'],
          ['هُنَّ', 'hunne', 'onlar (kadınlar)', 'they (f.)']
        ]
      },
      ex: [
        { ar: 'نَحْنُ طُلَّابٌ', tl: 'nahnu tullâbun', tr: 'Biz öğrenciyiz.', en: 'We are students.' },
        { ar: 'هُمْ مُعَلِّمُونَ', tl: 'hum mu‘allimûne', tr: 'Onlar öğretmendir.', en: 'They are teachers.' },
        { ar: 'هُمَا أَخَوَانِ', tl: 'humâ ehavâni', tr: 'Onlar (ikisi) kardeştir.', en: 'They (two) are brothers.' },
        { ar: 'أَنْتُنَّ طَالِبَاتٌ', tl: 'entunne tâlibâtun', tr: 'Siz (kadınlar) öğrencisiniz.', en: 'You (women) are students.' }
      ],
      tips: ['Kalıbı gör: “siz” zamirlerinin hepsi {{أَنْتُـ}} ile, “onlar” zamirlerinin hepsi {{هُـ}} ile başlar. Sonek: <b>-mâ</b> = ikil, <b>-m</b> = erkek çoğul, <b>-nne</b> = kadın çoğul. Aynı mantık iyelik eklerinde de karşına çıkacak.']
    },
    {
      h: '“Ben öğrenciyim”: olmak fiili yok',
      p: [
        'Arapçada şimdiki zamanda <b>“-dır / -im / am, is, are” karşılığı bir kelime yoktur</b>. Zamiri ve ismi yan yana koymak yeterlidir: {{أَنَا طَالِبٌ}} = “Ben öğrenciyim.”',
        'İsim/sıfat, zamirin cinsiyetine uyar: erkek konuşur {{أَنَا طَالِبٌ}}, kadın konuşur {{أَنَا طَالِبَةٌ}} der. Dişillik çoğunlukla sona eklenen {{ـَةٌ}} ile yapılır.'
      ],
      ex: [
        { ar: 'أَنَا طَالِبٌ', tl: 'ene tâlibun', tr: 'Ben öğrenciyim. (erkek)', en: 'I am a student.' },
        { ar: 'أَنَا طَالِبَةٌ', tl: 'ene tâlibetun', tr: 'Ben öğrenciyim. (kadın)', en: 'I am a student. (f.)' },
        { ar: 'هُوَ مُهَنْدِسٌ', tl: 'huve muhendisun', tr: 'O mühendistir.', en: 'He is an engineer.' },
        { ar: 'هِيَ طَبِيبَةٌ', tl: 'hiye tabîbetun', tr: 'O doktordur.', en: 'She is a doctor.' },
        { ar: 'أَنْتَ مُعَلِّمٌ', tl: 'ente mu‘allimun', tr: 'Sen öğretmensin. (erkeğe)', en: 'You are a teacher.' },
        { ar: 'أَنْتِ سَعِيدَةٌ', tl: 'enti se‘îdetun', tr: 'Sen mutlusun. (kadına)', en: 'You are happy. (f.)' }
      ],
      cmp: {
        tr: 'Türkçe bunu <b>ek</b> ile yapar: öğrenci<b>-yim</b>, öğretmen<b>-sin</b>. Arapçada ek yoktur; zamir öznedir ve kişiyi gösterir.',
        en: 'İngilizce <b>am / is / are</b> fiilini kullanır. Arapçaya çevirirken bu fiili tamamen at: “He <s>is</s> an engineer” → {{هُوَ مُهَنْدِسٌ}}.'
      }
    },
    {
      h: 'İşaret zamirleri: bu, şu',
      p: [
        '<b>Yakın</b> için “bu”: erkek {{هٰذَا}} (hâzâ), dişil {{هٰذِهِ}} (hâzihî). <b>Uzak</b> için “şu / o”: erkek {{ذٰلِكَ}} (zâlike), dişil {{تِلْكَ}} (tilke). İnsan çoğulu için “bunlar” {{هٰؤُلَاءِ}} (hâulâi), “şunlar” {{أُولٰئِكَ}} (ulâike).'
      ],
      table: {
        cols: ['', 'Yakın (bu)', 'Uzak (şu / o)'],
        rows: [
          ['Erkek tekil', 'هٰذَا', 'ذٰلِكَ'],
          ['Dişil tekil', 'هٰذِهِ', 'تِلْكَ'],
          ['Çoğul (insan)', 'هٰؤُلَاءِ', 'أُولٰئِكَ']
        ]
      },
      ex: [
        { ar: 'هٰذَا كِتَابٌ', tl: 'hâzâ kitâbun', tr: 'Bu bir kitaptır.', en: 'This is a book.' },
        { ar: 'هٰذِهِ سَيَّارَةٌ', tl: 'hâzihî seyyâratun', tr: 'Bu bir arabadır.', en: 'This is a car.' },
        { ar: 'ذٰلِكَ بَيْتٌ', tl: 'zâlike beytun', tr: 'Şu bir evdir.', en: 'That is a house.' },
        { ar: 'تِلْكَ مَدْرَسَةٌ', tl: 'tilke medresetun', tr: 'Şu bir okuldur.', en: 'That is a school.' },
        { ar: 'هٰؤُلَاءِ طُلَّابٌ', tl: 'hâulâi tullâbun', tr: 'Bunlar öğrencidir.', en: 'These are students.' }
      ],
      tips: [
        '{{هٰذَا}} yazılırken ilk elif çoğu zaman <b>gizlidir</b> (harekesiz metinde {{هذا}}), ama “hâzâ” diye uzun okunur. Aynısı {{ذٰلِكَ}} ve {{لٰكِنْ}} için de geçerli.',
        '<b>İnsan olmayan çoğullar dişil tekil sayılır!</b> “Bunlar kitaplardır” {{هٰذِهِ كُتُبٌ}} denir, {{هٰؤُلَاءِ}} değil. Bu kural sıfatlarda ve fiillerde de karşına çıkar.'
      ]
    },
    {
      h: '“Bu kitap” mı, “Bu bir kitaptır” mı?',
      p: [
        'Çok önemli bir ayrım: işaret zamirinden sonra <b>belirsiz</b> isim gelirse <b>cümle</b> olur: {{هٰذَا كِتَابٌ}} “Bu bir kitaptır.” <b>Belirli</b> (ال’li) isim gelirse sadece isim grubu olur: {{هٰذَا الْكِتَابُ}} “bu kitap”.',
        'Böylece “bu kitap yenidir” demek için ikisini birleştirirsin: {{هٰذَا الْكِتَابُ جَدِيدٌ}}.'
      ],
      ex: [
        { ar: 'هٰذَا كِتَابٌ', tl: 'hâzâ kitâbun', tr: 'Bu bir kitaptır. (cümle)', en: 'This is a book.' },
        { ar: 'هٰذَا الْكِتَابُ', tl: 'hâze’l-kitâbu', tr: 'bu kitap (isim grubu)', en: 'this book' },
        { ar: 'هٰذَا الْكِتَابُ جَدِيدٌ', tl: 'hâze’l-kitâbu cedîdun', tr: 'Bu kitap yenidir.', en: 'This book is new.' },
        { ar: 'تِلْكَ السَّيَّارَةُ جَمِيلَةٌ', tl: 'tilke’s-seyyâratu cemîletun', tr: 'Şu araba güzeldir.', en: 'That car is beautiful.' }
      ],
      cmp: {
        tr: 'Türkçede “Bu kitap” ve “Bu kitaptır” arasındaki fark <b>-dır</b> ekidir. Arapçada fark <b>ال</b> takısıdır.',
        en: '“This is a book” ↔ “this book” farkı İngilizcede <b>is a</b> ile; Arapçada tenvin ↔ ال ile kurulur.'
      }
    },
    {
      h: 'Zamirle soru sormak',
      p: [
        'Zamirleri soru kelimeleriyle birleştirerek ilk diyaloglarını kurabilirsin: {{مَنْ أَنْتَ؟}} “Sen kimsin?”, {{مَا هٰذَا؟}} “Bu ne?”, {{مَنْ هِيَ؟}} “O kim?”'
      ],
      ex: [
        { ar: 'مَنْ أَنْتَ؟', tl: 'men ente?', tr: 'Sen kimsin?', en: 'Who are you?' },
        { ar: 'أَنَا أَحْمَدُ', tl: 'ene Ahmedu', tr: 'Ben Ahmet’im.', en: 'I am Ahmed.' },
        { ar: 'مَا هٰذَا؟', tl: 'mâ hâzâ?', tr: 'Bu ne?', en: 'What is this?' },
        { ar: 'هٰذَا قَلَمٌ', tl: 'hâzâ kalemun', tr: 'Bu bir kalemdir.', en: 'This is a pen.' }
      ]
    }
  ],
  keys: [
    'Ben {{أَنَا}}, biz {{نَحْنُ}}; sen {{أَنْتَ}} (erkek) / {{أَنْتِ}} (kadın); o {{هُوَ}} (erkek) / {{هِيَ}} (kadın).',
    'İkil (iki kişi) zamirler: {{أَنْتُمَا}} siz ikiniz, {{هُمَا}} onlar ikisi. Karışık gruplar için erkek çoğul kullanılır.',
    'Şimdiki zamanda “olmak” yok: {{أَنَا طَالِبٌ}} “Ben öğrenciyim.”',
    'Bu: {{هٰذَا}} / {{هٰذِهِ}}; şu: {{ذٰلِكَ}} / {{تِلْكَ}}. İnsan olmayan çoğullar için {{هٰذِهِ}}.',
    'İşaret + belirsiz isim = cümle ({{هٰذَا كِتَابٌ}}); işaret + ال’li isim = isim grubu ({{هٰذَا الْكِتَابُ}}).'
  ],
  mistakes: [
    { bad: 'هٰذَا سَيَّارَةٌ', good: 'هٰذِهِ سَيَّارَةٌ', why: 'سَيَّارَة dişildir (ة ile biter), bu yüzden dişil işaret zamiri {{هٰذِهِ}} gelir.' },
    { bad: 'أَنَا هُوَ طَالِبٌ', good: 'أَنَا طَالِبٌ', why: '“I am” derken araya bir şey koyma. Zamir + isim yeterlidir.' },
    { bad: 'هٰؤُلَاءِ كُتُبٌ', good: 'هٰذِهِ كُتُبٌ', why: 'Kitaplar insan değildir; insan olmayan çoğullar dişil tekil gibi davranır.' },
    { bad: 'أَنْتَ طَالِبَةٌ', good: 'أَنْتِ طَالِبَةٌ', why: 'Kadına hitap ederken {{أَنْتِ}} (enti) kullanılır; isim de dişil olmalı.' }
  ],
  words: [
    { ar: 'أَنَا', tl: 'ene', tr: 'ben', en: 'I' },
    { ar: 'أَنْتَ', tl: 'ente', tr: 'sen (erkek)', en: 'you (m.)' },
    { ar: 'أَنْتِ', tl: 'enti', tr: 'sen (kadın)', en: 'you (f.)' },
    { ar: 'هُوَ', tl: 'huve', tr: 'o (erkek)', en: 'he' },
    { ar: 'هِيَ', tl: 'hiye', tr: 'o (kadın)', en: 'she' },
    { ar: 'نَحْنُ', tl: 'nahnu', tr: 'biz', en: 'we' },
    { ar: 'أَنْتُمْ', tl: 'entum', tr: 'siz (çoğul)', en: 'you (pl.)' },
    { ar: 'أَنْتُمَا', tl: 'entumâ', tr: 'siz ikiniz', en: 'you two' },
    { ar: 'هُمْ', tl: 'hum', tr: 'onlar', en: 'they' },
    { ar: 'هُمَا', tl: 'humâ', tr: 'onlar ikisi', en: 'they two' },
    { ar: 'هُنَّ', tl: 'hunne', tr: 'onlar (kadınlar)', en: 'they (f.)' },
    { ar: 'أَنْتُنَّ', tl: 'entunne', tr: 'siz (kadınlar)', en: 'you (pl. f.)' },
    { ar: 'هٰذَا', tl: 'hâzâ', tr: 'bu (erkek)', en: 'this (m.)' },
    { ar: 'هٰذِهِ', tl: 'hâzihî', tr: 'bu (dişil)', en: 'this (f.)' },
    { ar: 'ذٰلِكَ', tl: 'zâlike', tr: 'şu / o (erkek)', en: 'that (m.)' },
    { ar: 'تِلْكَ', tl: 'tilke', tr: 'şu / o (dişil)', en: 'that (f.)' },
    { ar: 'هٰؤُلَاءِ', tl: 'hâulâi', tr: 'bunlar', en: 'these' },
    { ar: 'أُولٰئِكَ', tl: 'ulâike', tr: 'şunlar', en: 'those' }
  ],
  acts: [
    { type: 'flash', title: 'Zamir kartları', desc: 'Şahıs ve işaret zamirlerini kartlarla ezberle.', glyph: 'أَنَا' },
    {
      type: 'match', title: 'Zamirleri eşleştir', desc: 'Arapça zamiri Türkçe karşılığıyla buluştur.', glyph: 'هُوَ', items: [
        ['أَنَا', 'ben'], ['نَحْنُ', 'biz'], ['أَنْتَ', 'sen (erkek)'], ['أَنْتِ', 'sen (kadın)'], ['هُوَ', 'o (erkek)'],
        ['هِيَ', 'o (kadın)'], ['هُمْ', 'onlar'], ['أَنْتُمْ', 'siz'], ['هُمَا', 'onlar ikisi'], ['أَنْتُمَا', 'siz ikiniz']
      ]
    },
    {
      type: 'mc', title: 'Doğru zamiri seç', desc: 'Durumu oku, uygun zamiri bul.', glyph: 'مَنْ؟', items: [
        { q: 'Ayşe’ye “Sen öğrencisin” diyeceksin. Hangi zamir?', options: ['أَنْتِ', 'أَنْتَ', 'هِيَ', 'أَنَا'], a: 'أَنْتِ', why: 'Bir kadına hitap: {{أَنْتِ}} (enti).' },
        { q: 'Mehmet’ten bahsediyorsun: “O mühendistir.”', options: ['هُوَ', 'هِيَ', 'أَنْتَ', 'هُمْ'], a: 'هُوَ', why: 'Erkek üçüncü şahıs: {{هُوَ}}.' },
        { q: 'Sen ve arkadaşın: “Biz…”', options: ['نَحْنُ', 'هُمْ', 'أَنْتُمْ', 'أَنَا'], a: 'نَحْنُ', why: 'Biz = {{نَحْنُ}}. Arapçada “biz” için ikil biçim yoktur.' },
        { q: 'İki kişiye hitap ediyorsun: “Siz ikiniz…”', options: ['أَنْتُمَا', 'أَنْتُمْ', 'هُمَا', 'أَنْتُنَّ'], a: 'أَنْتُمَا', why: '-mâ eki ikili gösterir: {{أَنْتُمَا}}.' },
        { q: 'Bir grup kadın öğrenciden bahsediyorsun: “Onlar…”', options: ['هُنَّ', 'هُمْ', 'هِيَ', 'أَنْتُنَّ'], a: 'هُنَّ', why: 'Kadınlardan oluşan çoğul: {{هُنَّ}}.' },
        { q: 'Erkek ve kadınlardan oluşan bir sınıftan bahsediyorsun: “Onlar…”', options: ['هُمْ', 'هُنَّ', 'هُمَا', 'هِيَ'], a: 'هُمْ', why: 'Karışık gruplarda erkek çoğul kullanılır.' },
        { q: '“Kitap nerede? — O masanın üstünde.” Kitap için hangi zamir?', options: ['هُوَ', 'هِيَ', 'هٰذِهِ', 'أَنْتَ'], a: 'هُوَ', why: '{{كِتَاب}} erkek bir isimdir; “it” yerine {{هُوَ}}.' },
        { q: '“Araba nerede? — O evin önünde.” Araba için hangi zamir?', options: ['هِيَ', 'هُوَ', 'هُمْ', 'ذٰلِكَ'], a: 'هِيَ', why: '{{سَيَّارَة}} ة ile biten dişil bir isimdir: {{هِيَ}}.' }
      ]
    },
    {
      type: 'fill', title: 'Bu mu, şu mu?', desc: 'İşaret zamirlerini cinsiyete ve uzaklığa göre yerleştir.', glyph: 'هٰذَا', items: [
        { s: '___ كِتَابٌ', options: ['هٰذَا', 'هٰذِهِ', 'هٰؤُلَاءِ'], a: 'هٰذَا', tr: 'Bu bir kitaptır.', why: '{{كِتَاب}} erkektir → {{هٰذَا}}.' },
        { s: '___ مَدْرَسَةٌ', options: ['هٰذِهِ', 'هٰذَا', 'ذٰلِكَ'], a: 'هٰذِهِ', tr: 'Bu bir okuldur.', why: '{{مَدْرَسَة}} dişildir → {{هٰذِهِ}}.' },
        { s: '___ بَيْتٌ', hint: 'Uzaktaki bir ev', options: ['ذٰلِكَ', 'تِلْكَ', 'هٰذِهِ'], a: 'ذٰلِكَ', tr: 'Şu bir evdir.', why: 'Uzak + erkek → {{ذٰلِكَ}}.' },
        { s: '___ سَيَّارَةٌ', hint: 'Uzaktaki bir araba', options: ['تِلْكَ', 'ذٰلِكَ', 'هٰذَا'], a: 'تِلْكَ', tr: 'Şu bir arabadır.', why: 'Uzak + dişil → {{تِلْكَ}}.' },
        { s: '___ طُلَّابٌ', options: ['هٰؤُلَاءِ', 'هٰذَا', 'تِلْكَ'], a: 'هٰؤُلَاءِ', tr: 'Bunlar öğrencidir.', why: 'İnsan çoğulu → {{هٰؤُلَاءِ}}.' },
        { s: '___ كُتُبٌ', options: ['هٰذِهِ', 'هٰؤُلَاءِ', 'هٰذَا'], a: 'هٰذِهِ', tr: 'Bunlar kitaplardır.', why: 'İnsan olmayan çoğul dişil tekil sayılır → {{هٰذِهِ}}.' },
        { s: 'أَنَا ___', hint: 'Konuşan bir kadın', options: ['طَالِبَةٌ', 'طَالِبٌ', 'الطَّالِبُ'], a: 'طَالِبَةٌ', tr: 'Ben öğrenciyim. (kadın)', why: 'Kadın konuşuyorsa isim de dişil olur: {{طَالِبَةٌ}}.' },
        { s: '___ طَبِيبَةٌ', options: ['هِيَ', 'هُوَ', 'أَنْتَ'], a: 'هِيَ', tr: 'O doktordur. (kadın)', why: 'Dişil isimle dişil zamir: {{هِيَ}}.' }
      ]
    },
    {
      type: 'order', title: 'Cümle kur', desc: 'Kelimeleri sıraya dizerek zamirli cümleler oluştur.', glyph: 'أَنَا…', items: [
        { tr: 'Ben öğrenciyim.', w: ['أَنَا', 'طَالِبٌ'] },
        { tr: 'Bu kitap yenidir.', w: ['هٰذَا', 'الْكِتَابُ', 'جَدِيدٌ'], why: 'İşaret + ال’li isim = “bu kitap”, ardından haber.' },
        { tr: 'Şu araba güzeldir.', w: ['تِلْكَ', 'السَّيَّارَةُ', 'جَمِيلَةٌ'] },
        { tr: 'Biz öğretmeniz.', w: ['نَحْنُ', 'مُعَلِّمُونَ'] },
        { tr: 'Sen kimsin?', w: ['مَنْ', 'أَنْتَ؟'], why: 'Soru kelimesi başa gelir.' },
        { tr: 'O (kadın) mutludur.', w: ['هِيَ', 'سَعِيدَةٌ'] }
      ]
    },
    {
      type: 'test', title: 'Zamirler testi', desc: 'Şahıs ve işaret zamirlerinin karma değerlendirmesi.', glyph: '؟', items: [
        { q: '“She is a teacher” Arapçada hangisidir?', options: ['هِيَ مُعَلِّمَةٌ', 'هُوَ مُعَلِّمٌ', 'هِيَ مُعَلِّمٌ', 'أَنْتِ مُعَلِّمَةٌ'], a: 'هِيَ مُعَلِّمَةٌ', why: 'Dişil zamir + dişil isim.' },
        { q: '{{هٰذَا الْبَيْتُ}} ne demektir?', options: ['bu ev', 'Bu bir evdir.', 'şu ev', 'evler'], a: 'bu ev', why: 'İşaret + ال’li isim = isim grubu.' },
        { q: '{{هٰذَا بَيْتٌ}} ne demektir?', options: ['Bu bir evdir.', 'bu ev', 'Şu bir evdir.', 'bu evler'], a: 'Bu bir evdir.', why: 'İşaret + belirsiz isim = cümle.' },
        { t: 'tf', s: 'Arapçada “I am” karşılığı ayrı bir fiil kullanılır.', a: false, why: 'Şimdiki zamanda “olmak” fiili kullanılmaz: {{أَنَا طَالِبٌ}}.' },
        { t: 'fill', s: '___ طَالِبَةٌ', hint: 'Bir kadına konuşuyorsun', options: ['أَنْتِ', 'أَنْتَ', 'هُوَ'], a: 'أَنْتِ', tr: 'Sen öğrencisin. (kadına)', why: 'Kadına hitap: {{أَنْتِ}}.' },
        { q: '“Onlar ikisi” hangisidir?', options: ['هُمَا', 'هُمْ', 'هُنَّ', 'أَنْتُمَا'], a: 'هُمَا', why: '-mâ = ikil.' },
        { t: 'order', tr: 'Bu kalem güzeldir.', w: ['هٰذَا', 'الْقَلَمُ', 'جَمِيلٌ'] },
        { q: '“Bunlar arabalardır.” hangisidir?', options: ['هٰذِهِ سَيَّارَاتٌ', 'هٰؤُلَاءِ سَيَّارَاتٌ', 'هٰذَا سَيَّارَاتٌ', 'تِلْكَ سَيَّارَةٌ'], a: 'هٰذِهِ سَيَّارَاتٌ', why: 'İnsan olmayan çoğul → {{هٰذِهِ}}.' }
      ]
    }
  ]
});
