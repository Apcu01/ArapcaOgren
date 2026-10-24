window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'belirlilik', n: 1, level: 'Başlangıç', glyph: 'ال',
  ar: 'التَّعْرِيفُ وَالإِضَافَةُ', name: 'Belirlilik ve Tamlama',
  desc: 'ال takısı, tenvin, güneş–ay harfleri ve isim tamlaması.',
  long: 'Arapçada “bir kitap” ile “o kitap” arasındaki farkı, güneş ve ay harflerini ve “öğrencinin kitabı” gibi tamlamaları öğren. Diğer bütün konuların temeli.',
  tags: 'el takısı the a an tenvin idafe tamlama güneş ay harfleri',
  readMins: 12,
  intro: 'Arapçada bir ismin <b>belirsiz</b> (“bir kitap”) ya da <b>belirli</b> (“kitap / the book”) olması ismin üzerinde görünür: belirsiz isim sonunda <b>tenvin</b> taşır, belirli isim başına <b>ال</b> alır. Bu derste ikisini, ال’in okunuşunu değiştiren <b>güneş harflerini</b> ve iki ismin birleştiği <b>tamlamayı (idâfe)</b> öğreneceksin.',
  lesson: [
    {
      h: 'Belirsiz isim: tenvin',
      p: [
        'Arapçada “bir” anlamında ayrı bir belirsizlik kelimesi yoktur. Bunun yerine ismin son harfine <b>çift hareke</b> konur. Buna <b>tenvin</b> denir ve sonuna bir <em>“n”</em> sesi ekler: <b>-un, -in, -en</b>.',
        'Hangi tenvinin geleceğini cümledeki görev belirler (özne ise -un, harf-i cerden sonra -in, nesne ise -en). Başlangıçta en sık gördüğün <b>-un</b> (ـٌ) olacak.'
      ],
      table: {
        cols: ['Tenvin', 'İşaret', 'Örnek', 'Okunuş'],
        rows: [
          ['İki ötre', 'ـٌ', 'كِتَابٌ', 'kitâbun'],
          ['İki esre', 'ـٍ', 'كِتَابٍ', 'kitâbin'],
          ['İki üstün', 'ـًا', 'كِتَابًا', 'kitâben']
        ]
      },
      ex: [
        { ar: 'كِتَابٌ', tl: 'kitâbun', tr: 'bir kitap', en: 'a book' },
        { ar: 'بَيْتٌ', tl: 'beytun', tr: 'bir ev', en: 'a house' },
        { ar: 'قَلَمٌ', tl: 'kalemun', tr: 'bir kalem', en: 'a pen' },
        { ar: 'سَيَّارَةٌ', tl: 'seyyâratun', tr: 'bir araba', en: 'a car' }
      ],
      cmp: {
        tr: 'Türkçede belirsizliği <b>“bir”</b> kelimesiyle veririz: <em>bir kitap</em>. Çoğu zaman hiç kullanmayız da: “Kitap aldım.”',
        en: 'İngilizcede <b>a / an</b> kullanılır: <em>a book</em>. Arapçada bu görevi kelimenin sonundaki tenvin üstlenir.'
      },
      tips: ['Tenvinin “n”si yazılmaz, sadece çift hareke olarak görünür. Harekesiz metinde {{كتاب}} hem “kitâb” hem “kitâbun” olabilir; bağlamdan anlarsın.']
    },
    {
      h: 'Belirli isim: ال takısı',
      p: [
        'İsmi belirli yapmak için başına <b>ال</b> (el) eklenir. Bu, İngilizcedeki <b>the</b> gibidir. ال gelince tenvin <b>düşer</b>, yerine tek hareke kalır: {{كِتَابٌ}} → {{الْكِتَابُ}}.',
        'ال kelimeye bitişik yazılır ve ayrı bir kelime değildir. Cümlenin ortasında ال’in elifi okunmaz: {{وَالْكِتَابُ}} “ve’l-kitâbu”.'
      ],
      ex: [
        { ar: 'الْكِتَابُ', tl: 'el-kitâbu', tr: 'kitap (bilinen kitap)', en: 'the book' },
        { ar: 'الْبَيْتُ', tl: 'el-beytu', tr: 'ev (o ev)', en: 'the house' },
        { ar: 'الْقَلَمُ', tl: 'el-kalemu', tr: 'kalem (o kalem)', en: 'the pen' },
        { ar: 'الْمَدْرَسَةُ', tl: 'el-medresetu', tr: 'okul (o okul)', en: 'the school' }
      ],
      cmp: {
        tr: 'Türkçede “the” yoktur. Belirliliği bağlamla ya da ekle anlarız: “Kitabı aldım” (belirli), “Kitap aldım” (belirsiz).',
        en: '<b>a book → the book</b> geçişi Arapçada <b>كِتَابٌ → الْكِتَابُ</b> geçişinin birebir karşılığıdır.'
      },
      tips: ['ال ve tenvin <b>asla birlikte gelmez</b>. Bir isim ya {{ـٌ}} ile belirsizdir ya ال ile belirlidir; ikisi aynı anda olmaz.']
    },
    {
      h: 'Güneş ve ay harfleri',
      p: [
        'Arap alfabesindeki 28 harf, ال’den sonra gelince ikiye ayrılır. <b>Ay harflerinde</b> (الحروف القمرية) ال’in lamı okunur: {{الْقَمَرُ}} <em>el-kameru</em>. <b>Güneş harflerinde</b> (الحروف الشمسية) lam yazılır ama <b>okunmaz</b>; onun yerine sonraki harf şeddeli (iki kez) okunur: {{الشَّمْسُ}} <em>eş-şemsu</em>.',
        'Gruplar adını bu iki kelimeden alır: <b>ş</b>ems (güneş) güneş harfiyle, <b>k</b>amer (ay) ay harfiyle başlar.'
      ],
      table: {
        cols: ['Grup', 'Harfler', 'ال nasıl okunur?'],
        rows: [
          ['Güneş harfleri (14)', 'ت ث د ذ ر ز س ش ص ض ط ظ ل ن', 'Lam okunmaz, harf şeddelenir: <b>eş-şems, er-racul</b>'],
          ['Ay harfleri (14)', 'ا ب ج ح خ ع غ ف ق ك م ه و ي', 'Lam okunur: <b>el-kamer, el-beyt</b>']
        ]
      },
      ex: [
        { ar: 'الشَّمْسُ', tl: 'eş-şemsu', tr: 'güneş', en: 'the sun', note: 'ش güneş harfi: lam okunmaz.' },
        { ar: 'الرَّجُلُ', tl: 'er-raculu', tr: 'adam', en: 'the man', note: 'ر güneş harfi.' },
        { ar: 'الْقَمَرُ', tl: 'el-kameru', tr: 'ay', en: 'the moon', note: 'ق ay harfi: lam okunur.' },
        { ar: 'الْبَابُ', tl: 'el-bâbu', tr: 'kapı', en: 'the door', note: 'ب ay harfi.' }
      ],
      tips: [
        'Bu kuralı aslında zaten biliyorsun! <b>Abdurrahman</b> ({{عَبْدُ الرَّحْمٰنِ}}), <b>Nureddin</b> ({{نُورُ الدِّينِ}}), <b>Şemseddin</b>, <b>Abdüssamed</b> isimlerinde lam okunmaz çünkü ر، د، ص güneş harfidir. <b>Abdülkadir</b> ({{عَبْدُ الْقَادِرِ}}) ve <b>Abdülhamid</b>’de ise ق، ح ay harfi olduğu için lam okunur.',
        'Kısa test: ال’den sonraki harfi dilinin ucuyla (dişlerin yakınında) çıkarıyorsan genellikle güneş harfidir.'
      ]
    },
    {
      h: 'İsim tamlaması (idâfe)',
      p: [
        '“Öğrencinin kitabı” demek için iki isim yan yana konur: <b>sahip olunan önce</b>, <b>sahip sonra</b> gelir. {{كِتَابُ الطَّالِبِ}} <em>kitâbu’t-tâlibi</em> = “öğrencinin kitabı”.',
        'İki önemli kural vardır: <b>1)</b> Birinci isim (muzâf) <b>ال almaz ve tenvin almaz</b>. <b>2)</b> İkinci isim (muzâfun ileyh) <b>esre</b> ile biter (-i / -in).',
        'İkinci isim belirliyse bütün tamlama belirli olur (“öğrencinin kitabı”); belirsizse tamlama da belirsiz olur: {{كِتَابُ طَالِبٍ}} “bir öğrencinin kitabı”.'
      ],
      ex: [
        { ar: 'كِتَابُ الطَّالِبِ', tl: 'kitâbu’t-tâlibi', tr: 'öğrencinin kitabı', en: 'the student’s book' },
        { ar: 'بَابُ الْبَيْتِ', tl: 'bâbu’l-beyti', tr: 'evin kapısı', en: 'the door of the house' },
        { ar: 'سَيَّارَةُ الْمُعَلِّمِ', tl: 'seyyâratu’l-mu‘allimi', tr: 'öğretmenin arabası', en: 'the teacher’s car', note: 'ة tamlamada “t” olarak okunur: seyyâra<b>tu</b>.' },
        { ar: 'مَدِينَةُ إِسْطَنْبُولَ', tl: 'medînetu İstanbûl', tr: 'İstanbul şehri', en: 'the city of Istanbul' }
      ],
      cmp: {
        tr: 'Türkçede sıra terstir: <b>öğrenci-nin kitab-ı</b> (sahip önce). Arapçada <b>كِتَابُ الطَّالِبِ</b> (kitap önce). Osmanlıca tamlamalar Arapça sırayı korur: <em>Dâru’l-fünûn</em> “fenlerin evi”, <em>Beytü’l-mal</em> “malın evi = hazine”.',
        en: 'İngilizcedeki <b>“the door of the house”</b> yapısıyla aynı sıradadır: door → of → the house. Arapçada “of” kelimesi yoktur; ikinci ismin esresi bu görevi görür.'
      },
      tips: ['Tamlamada “the” sadece <b>sonda</b> görünür, ama bütün tamlamayı belirli yapar. “The book of the student” için {{الْكِتَابُ الطَّالِبِ}} yazılmaz; doğrusu {{كِتَابُ الطَّالِبِ}}.']
    },
    {
      h: 'İsim cümlesine ilk bakış',
      p: [
        'Arapçada şimdiki zamanda <b>“olmak” fiili kullanılmaz</b>. Belirli bir isimden sonra belirsiz bir isim/sıfat gelirse bu bir <b>cümledir</b>: {{الْبَيْتُ كَبِيرٌ}} “Ev büyüktür.”',
        'Yani belirliliği doğru kullanmak anlamı değiştirir: {{الْبَيْتُ الْكَبِيرُ}} (ikisi de belirli) sadece bir isim grubudur: “büyük ev”. Bunu Sıfatlar dersinde ayrıntılı göreceksin.'
      ],
      ex: [
        { ar: 'الْبَيْتُ كَبِيرٌ', tl: 'el-beytu kebîrun', tr: 'Ev büyüktür.', en: 'The house is big.' },
        { ar: 'الْكِتَابُ جَدِيدٌ', tl: 'el-kitâbu cedîdun', tr: 'Kitap yenidir.', en: 'The book is new.' }
      ]
    }
  ],
  keys: [
    'Tenvin (ـٌ ـٍ ـً) = “bir / a”. ال = “the”. İkisi aynı kelimede <b>birlikte olmaz</b>.',
    'Güneş harflerinde (ت ث د ذ ر ز س ش ص ض ط ظ ل ن) ال’in lamı okunmaz, sonraki harf şeddelenir: eş-şems, er-racul.',
    'Tamlamada sıra “kitap + öğrencinin”: {{كِتَابُ الطَّالِبِ}}. Birinci kelime ال ve tenvin almaz, ikinci kelime esre ile biter.',
    'Belirli isim + belirsiz sıfat = cümle: {{الْبَيْتُ كَبِيرٌ}} “Ev büyüktür.”'
  ],
  mistakes: [
    { bad: 'الْكِتَابٌ', good: 'الْكِتَابُ', why: 'ال geldiğinde tenvin düşer. Belirli isim tek hareke ile biter.' },
    { bad: 'الْكِتَابُ الطَّالِبِ', good: 'كِتَابُ الطَّالِبِ', why: 'Tamlamanın birinci kelimesi ال almaz. Belirliliği ikinci kelimedeki ال sağlar.' },
    { bad: 'el-şems', good: 'eş-şems', why: 'ش güneş harfidir; lam okunmaz, ş iki kez okunur.' }
  ],
  words: [
    { ar: 'كِتَاب', tl: 'kitâb', tr: 'kitap', en: 'book' },
    { ar: 'بَيْت', tl: 'beyt', tr: 'ev', en: 'house' },
    { ar: 'قَلَم', tl: 'kalem', tr: 'kalem', en: 'pen' },
    { ar: 'بَاب', tl: 'bâb', tr: 'kapı', en: 'door' },
    { ar: 'شَمْس', tl: 'şems', tr: 'güneş', en: 'sun' },
    { ar: 'قَمَر', tl: 'kamer', tr: 'ay (gökteki)', en: 'moon' },
    { ar: 'رَجُل', tl: 'racul', tr: 'adam', en: 'man' },
    { ar: 'طَالِب', tl: 'tâlib', tr: 'öğrenci', en: 'student' },
    { ar: 'مُعَلِّم', tl: 'mu‘allim', tr: 'öğretmen', en: 'teacher' },
    { ar: 'مَدِينَة', tl: 'medîne', tr: 'şehir', en: 'city' },
    { ar: 'سَيَّارَة', tl: 'seyyâra', tr: 'araba', en: 'car' },
    { ar: 'مَدْرَسَة', tl: 'medrese', tr: 'okul', en: 'school' },
    { ar: 'نُور', tl: 'nûr', tr: 'ışık', en: 'light' },
    { ar: 'دَرْس', tl: 'ders', tr: 'ders', en: 'lesson' }
  ],
  acts: [
    { type: 'flash', title: 'Temel isimler', desc: 'Bu derste kullanacağın isimleri kartlarla tanı.', glyph: 'كِتَاب' },
    {
      type: 'mc', title: 'Güneş mi, ay mı?', desc: 'ال’den sonraki harfin grubunu bul.', glyph: 'الشّ', items: [
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'الشَّمْس', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Güneş harfi', why: 'ش güneş harfidir: eş-şems. Lam okunmaz.' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'الْقَمَر', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Ay harfi', why: 'ق ay harfidir: el-kamer. Lam okunur.' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'الرَّجُل', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Güneş harfi', why: 'ر güneş harfidir: er-racul (Abdurrahman’daki gibi).' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'الْبَيْت', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Ay harfi', why: 'ب ay harfidir: el-beyt.' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'السَّيَّارَة', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Güneş harfi', why: 'س güneş harfidir: es-seyyâra.' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'الْكِتَاب', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Ay harfi', why: 'ك ay harfidir: el-kitâb.' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'النُّور', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Güneş harfi', why: 'ن güneş harfidir: en-nûr. Lam okunmaz, n şeddelenir.' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'الْمَدْرَسَة', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Ay harfi', why: 'م ay harfidir: el-medrese.' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'الدَّرْس', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Güneş harfi', why: 'د güneş harfidir: ed-ders.' },
        { q: 'Bu kelimedeki ال’den sonra gelen harf hangi grupta?', ar: 'الْيَوْم', options: ['Güneş harfi', 'Ay harfi'], fixed: true, a: 'Ay harfi', why: 'ي ay harfidir: el-yevm.' }
      ]
    },
    {
      type: 'mc', title: 'Doğru okunuş', desc: 'ال’li kelimelerin okunuşunu seç.', glyph: 'eş-', items: [
        { q: 'Nasıl okunur?', ar: 'الرَّجُلُ', options: ['er-raculu', 'el-raculu'], a: 'er-raculu', why: 'ر güneş harfi: lam düşer, r şeddelenir.' },
        { q: 'Nasıl okunur?', ar: 'الْقَمَرُ', options: ['el-kameru', 'ek-kameru'], a: 'el-kameru', why: 'ق ay harfi: lam okunur.' },
        { q: 'Nasıl okunur?', ar: 'السَّلَامُ', options: ['es-selâmu', 'el-selâmu'], a: 'es-selâmu', why: 'س güneş harfi. “Es-selâmu aleyküm” selamında da böyle söyleriz.' },
        { q: 'Nasıl okunur?', ar: 'الْبَابُ', options: ['el-bâbu', 'eb-bâbu'], a: 'el-bâbu', why: 'ب ay harfi: lam okunur.' },
        { q: 'Nasıl okunur?', ar: 'الطَّالِبُ', options: ['et-tâlibu', 'el-tâlibu'], a: 'et-tâlibu', why: 'ط güneş harfi: et-tâlibu.' },
        { q: 'Nasıl okunur?', ar: 'الْمُعَلِّمُ', options: ['el-mu‘allimu', 'em-mu‘allimu'], a: 'el-mu‘allimu', why: 'م ay harfi: lam okunur.' }
      ]
    },
    {
      type: 'match', title: 'Belirli, belirsiz, tamlama', desc: 'Arapça ifadeyi Türkçe anlamıyla eşleştir.', glyph: 'ـٌ / ال', items: [
        ['كِتَابٌ', 'bir kitap'],
        ['الْكِتَابُ', 'kitap (belirli)'],
        ['كِتَابُ الطَّالِبِ', 'öğrencinin kitabı'],
        ['بَابُ الْبَيْتِ', 'evin kapısı'],
        ['بَيْتٌ', 'bir ev'],
        ['سَيَّارَةُ الْمُعَلِّمِ', 'öğretmenin arabası'],
        ['الشَّمْسُ', 'güneş'],
        ['كِتَابُ طَالِبٍ', 'bir öğrencinin kitabı']
      ]
    },
    {
      type: 'fill', title: 'Doğru biçimi seç', desc: 'Boşluğa ال’li, tenvinli ya da tamlama biçimini yerleştir.', glyph: '___', items: [
        { s: '___ الطَّالِبِ', options: ['كِتَابُ', 'الْكِتَابُ', 'كِتَابٌ'], a: 'كِتَابُ', tr: 'öğrencinin kitabı', why: 'Tamlamanın birinci kelimesi ne ال ne tenvin alır.' },
        { s: 'بَابُ ___', options: ['الْبَيْتِ', 'الْبَيْتُ', 'بَيْتٌ'], a: 'الْبَيْتِ', tr: 'evin kapısı', why: 'Tamlamanın ikinci kelimesi esre ile biter: el-beyti.' },
        { s: 'هٰذَا ___', options: ['قَلَمٌ', 'الْقَلَمٌ', 'قَلَمُ'], a: 'قَلَمٌ', tr: 'Bu bir kalemdir.', why: '“Bir kalem” belirsizdir; tenvin alır. ال ile tenvin birlikte olmaz.' },
        { s: 'الْبَيْتُ ___', options: ['كَبِيرٌ', 'الْكَبِيرٌ', 'كَبِيرُ'], a: 'كَبِيرٌ', tr: 'Ev büyüktür.', why: 'Belirli isim + belirsiz sıfat = cümle. Sıfat tenvin alır.' },
        { s: 'سَيَّارَةُ ___', options: ['الْمُعَلِّمِ', 'مُعَلِّمٌ', 'الْمُعَلِّمُ'], a: 'الْمُعَلِّمِ', tr: 'öğretmenin arabası', why: 'İkinci kelime belirli ve esreli olmalı.' },
        { s: '___ كَبِيرٌ', options: ['الْبَيْتُ', 'بَيْتُ', 'الْبَيْتٌ'], a: 'الْبَيْتُ', tr: 'Ev büyüktür.', why: 'Cümlenin öznesi (mübteda) belirli olmalı: el-beytu.' }
      ]
    },
    {
      type: 'tf', title: 'Kural kontrolü', desc: 'Önermeler doğru mu, yanlış mı?', glyph: '✓ ✗', items: [
        { s: 'الْكِتَابٌ doğru bir yazımdır.', a: false, why: 'ال ve tenvin birlikte olmaz. Doğrusu الْكِتَابُ.' },
        { s: 'الشَّمْسُ kelimesinde lam okunmaz.', a: true, why: 'ش güneş harfidir: eş-şemsu.' },
        { s: '“Öğrencinin kitabı” Arapçada الطَّالِبِ كِتَابُ şeklinde, Türkçedeki sırayla söylenir.', a: false, why: 'Arapçada sahip olunan önce gelir: كِتَابُ الطَّالِبِ.' },
        { s: 'Arapçada “bir kitap” demek için kelimenin sonundaki tenvin yeterlidir.', a: true, why: 'Tenvin, İngilizcedeki “a/an” görevini görür.' },
        { s: 'الْقَمَرُ kelimesi “ek-kamer” okunur.', a: false, why: 'ق ay harfidir; lam okunur: el-kameru.' },
        { s: 'الْبَيْتُ كَبِيرٌ bir cümledir: “Ev büyüktür.”', a: true, why: 'Belirli isim + belirsiz haber = isim cümlesi. “Olmak” fiili gerekmez.' }
      ]
    },
    {
      type: 'test', title: 'Belirlilik testi', desc: 'Dersin tamamını kapsayan karma değerlendirme.', glyph: '؟', items: [
        { q: '“The house” Arapçada hangisidir?', options: ['الْبَيْتُ', 'بَيْتٌ', 'بَيْتُ', 'الْبَيْتٌ'], a: 'الْبَيْتُ', why: 'Belirli: ال + tek hareke.' },
        { q: '“A car” Arapçada hangisidir?', options: ['سَيَّارَةٌ', 'السَّيَّارَةُ', 'سَيَّارَةُ', 'السَّيَّارَةٌ'], a: 'سَيَّارَةٌ', why: 'Belirsiz: tenvin.' },
        { q: 'Hangisi güneş harfiyle başlar?', options: ['النَّجْمُ', 'الْقَلَمُ', 'الْبَابُ', 'الْوَلَدُ'], a: 'النَّجْمُ', why: 'ن güneş harfidir: en-necmu (yıldız).' },
        { t: 'fill', s: 'قَلَمُ ___', options: ['الْمُعَلِّمِ', 'الْمُعَلِّمُ', 'مُعَلِّمٌ'], a: 'الْمُعَلِّمِ', tr: 'öğretmenin kalemi', why: 'Tamlamada ikinci kelime esre alır.' },
        { t: 'order', tr: 'Öğrencinin kitabı yenidir.', w: ['كِتَابُ', 'الطَّالِبِ', 'جَدِيدٌ'], why: 'Önce tamlama (kitâbu’t-tâlibi), sonra haber (cedîdun).' },
        { t: 'tf', s: 'عَبْدُ الرَّحْمٰنِ isminde lam okunur.', a: false, why: 'ر güneş harfi: Abdurrahman.' },
        { q: '“Bâbu’l-medreseti” ne demektir?', ar: 'بَابُ الْمَدْرَسَةِ', options: ['okulun kapısı', 'kapının okulu', 'bir okul kapısı', 'okul kapıdır'], a: 'okulun kapısı', why: 'İlk kelime sahip olunan (kapı), ikincisi sahip (okulun).' },
        { q: 'Hangisi “ev büyüktür” cümlesidir?', options: ['الْبَيْتُ كَبِيرٌ', 'الْبَيْتُ الْكَبِيرُ', 'بَيْتٌ كَبِيرٌ', 'كَبِيرُ الْبَيْتِ'], a: 'الْبَيْتُ كَبِيرٌ', why: 'Belirli + belirsiz = cümle. Diğerleri isim grubudur.' }
      ]
    }
  ]
});
