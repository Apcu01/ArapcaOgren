window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'sifatlar', n: 6, level: 'Orta', glyph: 'ص',
  ar: 'الصِّفَاتُ', name: 'Sıfatlar',
  desc: 'Sıfat–isim uyumu: cinsiyet, sayı, belirlilik; “daha” ve “en”.',
  long: 'Arapçada sıfat isimden sonra gelir ve ona dört açıdan uyar. “Büyük ev” ile “Ev büyüktür” farkını, dişil sıfatları, cansız çoğul kuralını ve karşılaştırma (daha / en) yapısını öğren.',
  tags: 'sıfat büyük küçük güzel yeni eski uyum müzekker müennes daha en akbar tafdil',
  readMins: 15,
  intro: 'Türkçede ve İngilizcede sıfat isimden <b>önce</b> gelir: <em>büyük ev, big house</em>. Arapçada ise <b>sonra</b> gelir: {{بَيْتٌ كَبِيرٌ}} “ev büyük”. Daha da önemlisi sıfat, nitelediği isme <b>dört açıdan</b> uyar: cinsiyet, sayı, belirlilik ve hal (son hareke). Bu dört uyumu kavrarsan Arapça cümlelerin yarısını çözmüş olursun.',
  lesson: [
    {
      h: 'Sıfat isimden sonra gelir',
      p: ['Arapçada önce nesne söylenir, sonra nasıl olduğu: {{قَلَمٌ جَدِيدٌ}} “yeni bir kalem” (kelime kelime: kalem yeni).'],
      ex: [
        { ar: 'بَيْتٌ كَبِيرٌ', tl: 'beytun kebîrun', tr: 'büyük bir ev', en: 'a big house' },
        { ar: 'قَلَمٌ جَدِيدٌ', tl: 'kalemun cedîdun', tr: 'yeni bir kalem', en: 'a new pen' },
        { ar: 'رَجُلٌ طَوِيلٌ', tl: 'raculun tavîlun', tr: 'uzun boylu bir adam', en: 'a tall man' },
        { ar: 'وَلَدٌ صَغِيرٌ', tl: 'veledun sağîrun', tr: 'küçük bir çocuk', en: 'a small boy' }
      ],
      cmp: { tr: 'Türkçe: <b>büyük</b> ev (sıfat önce).', en: 'English: <b>big</b> house (adjective first). Arapçada sırayı ters çevir.' }
    },
    {
      h: 'Uyum 1: cinsiyet',
      p: [
        'İsim dişilse sıfat da dişil olur. Dişil sıfat çoğunlukla erkek biçimin sonuna {{ـَةٌ}} eklenerek yapılır: {{كَبِيرٌ}} → {{كَبِيرَةٌ}}.',
        'İsimlerin cinsiyeti: ة ile bitenler çoğunlukla dişildir ({{سَيَّارَةٌ}}، {{مَدْرَسَةٌ}}). Bazı isimler ة olmadan da dişildir: {{شَمْسٌ}} güneş, {{أُمٌّ}} anne, {{بِنْتٌ}} kız, {{أَرْضٌ}} yer, {{يَدٌ}} el, çoğu şehir ve ülke adı.'
      ],
      ex: [
        { ar: 'سَيَّارَةٌ جَدِيدَةٌ', tl: 'seyyâratun cedîdetun', tr: 'yeni bir araba', en: 'a new car' },
        { ar: 'بِنْتٌ صَغِيرَةٌ', tl: 'bintun sağîretun', tr: 'küçük bir kız', en: 'a little girl' },
        { ar: 'مَدِينَةٌ جَمِيلَةٌ', tl: 'medînetun cemîletun', tr: 'güzel bir şehir', en: 'a beautiful city' },
        { ar: 'شَمْسٌ حَارَّةٌ', tl: 'şemsun hârratun', tr: 'sıcak bir güneş', en: 'a hot sun', note: '{{شَمْس}}’de ة yok ama dişildir.' }
      ]
    },
    {
      h: 'Uyum 2: belirlilik — en önemli kural',
      p: [
        'İsim belirliyse ({{ال}}) sıfat da {{ال}} alır; belirsizse sıfat da tenvin alır. <b>Bu uyum bozulursa anlam değişir!</b>',
        '• İkisi de belirsiz: {{بَيْتٌ كَبِيرٌ}} = “büyük <b>bir</b> ev” (isim grubu)<br>• İkisi de belirli: {{الْبَيْتُ الْكَبِيرُ}} = “büyük ev / the big house” (isim grubu)<br>• İsim belirli, sıfat belirsiz: {{الْبَيْتُ كَبِيرٌ}} = “Ev <b>büyüktür</b>.” (tam bir <b>cümle</b>)'
      ],
      table: {
        cols: ['Yapı', 'Arapça', 'Türkçe', 'English'],
        rows: [
          ['belirsiz + belirsiz', 'بَيْتٌ كَبِيرٌ', 'büyük bir ev', 'a big house'],
          ['belirli + belirli', 'الْبَيْتُ الْكَبِيرُ', 'büyük ev', 'the big house'],
          ['belirli + belirsiz', 'الْبَيْتُ كَبِيرٌ', 'Ev büyüktür.', 'The house is big.']
        ]
      },
      p2: ['Üçünü birleştirerek: {{الْبَيْتُ الْكَبِيرُ جَمِيلٌ}} “Büyük ev güzeldir.”'],
      tips: ['Bir cümlede “-dır / is” anlamını kuran şey, sıfattan {{ال}}’in <b>kaldırılmasıdır</b>. Arapça metin okurken önce ال’lere bak: isim ال’li, sıfat ال’siz ise karşında bir cümle var.']
    },
    {
      h: 'Uyum 3: sayı ve cansız çoğul kuralı',
      p: [
        '<b>İnsan</b> çoğulları için sıfat da çoğul olur: {{طُلَّابٌ مُجْتَهِدُونَ}} “çalışkan öğrenciler”. Erkek çoğul sıfat çoğunlukla {{ـُونَ}} ile, dişil çoğul {{ـَاتٌ}} ile yapılır.',
        '<b>İnsan olmayan</b> çoğullar (eşya, hayvan, kavram) için sıfat <b>dişil tekil</b> olur: {{كُتُبٌ جَدِيدَةٌ}} “yeni kitaplar”, {{سَيَّارَاتٌ سَرِيعَةٌ}} “hızlı arabalar”. Bu kural Arapçanın en karakteristik özelliklerinden biridir.'
      ],
      ex: [
        { ar: 'مُعَلِّمُونَ جُدُدٌ', tl: 'mu‘allimûne cududun', tr: 'yeni öğretmenler', en: 'new teachers', note: 'Bazı sıfatların düzensiz (kırık) çoğulu vardır: {{جَدِيد}} → {{جُدُد}}.' },
        { ar: 'طَالِبَاتٌ مُجْتَهِدَاتٌ', tl: 'tâlibâtun muctehidâtun', tr: 'çalışkan kız öğrenciler', en: 'hardworking (female) students' },
        { ar: 'كُتُبٌ جَدِيدَةٌ', tl: 'kutubun cedîdetun', tr: 'yeni kitaplar', en: 'new books', note: 'Kitaplar insan değil → dişil tekil sıfat.' },
        { ar: 'الْبُيُوتُ كَبِيرَةٌ', tl: 'el-buyûtu kebîretun', tr: 'Evler büyüktür.', en: 'The houses are big.' }
      ],
      cmp: { tr: 'Türkçede sıfat hiç çekimlenmez: büyük ev, büyük evler.', en: 'İngilizcede de sıfat değişmez: big house, big houses. Arapçada sıfat ismin aynası gibidir.' }
    },
    {
      h: 'Uyum 4: hal (son hareke)',
      p: [
        'Sıfat, ismin son harekesini de kopyalar: {{فِي بَيْتٍ كَبِيرٍ}} “büyük bir evde” (harf-i cerden sonra ikisi de esre), {{رَأَيْتُ رَجُلًا طَوِيلًا}} “uzun bir adam gördüm” (nesne olarak ikisi de üstün).',
        'Başlangıçta bu uyumu duyarak öğrenmen yeterli; harekesiz metinlerde zaten görünmez.'
      ],
      ex: [
        { ar: 'فِي بَيْتٍ كَبِيرٍ', tl: 'fî beytin kebîrin', tr: 'büyük bir evde', en: 'in a big house' },
        { ar: 'فِي الْمَدِينَةِ الْجَمِيلَةِ', tl: 'fi’l-medîneti’l-cemîleti', tr: 'güzel şehirde', en: 'in the beautiful city' }
      ]
    },
    {
      h: 'Sık kullanılan zıt sıfatlar',
      table: {
        cols: ['Sıfat', 'Anlam', 'Zıttı', 'Anlam'],
        rows: [
          ['كَبِيرٌ', 'büyük', 'صَغِيرٌ', 'küçük'],
          ['جَدِيدٌ', 'yeni', 'قَدِيمٌ', 'eski'],
          ['طَوِيلٌ', 'uzun', 'قَصِيرٌ', 'kısa'],
          ['سَهْلٌ', 'kolay', 'صَعْبٌ', 'zor'],
          ['حَارٌّ', 'sıcak', 'بَارِدٌ', 'soğuk'],
          ['كَثِيرٌ', 'çok', 'قَلِيلٌ', 'az'],
          ['سَعِيدٌ', 'mutlu', 'حَزِينٌ', 'üzgün'],
          ['غَنِيٌّ', 'zengin', 'فَقِيرٌ', 'fakir'],
          ['قَرِيبٌ', 'yakın', 'بَعِيدٌ', 'uzak'],
          ['جَمِيلٌ', 'güzel', 'قَبِيحٌ', 'çirkin']
        ]
      },
      tips: ['Türkçede yaşayan Arapça sıfatlar ezberi kolaylaştırır: <b>kadim</b> ({{قَدِيم}} eski), <b>cedit</b> ({{جَدِيد}} yeni), <b>kebir</b>, <b>sağir</b>, <b>kesir</b> ({{كَثِير}} — “kesret”), <b>kalil</b>, <b>fakir</b>, <b>garip</b>, <b>cemil</b>, <b>said</b>, <b>hazin</b>, <b>karib</b>, <b>baid</b>.']
    },
    {
      h: 'Karşılaştırma: daha ve en',
      p: [
        '“Daha büyük” için sıfat {{أَفْعَلُ}} kalıbına girer: {{كَبِير}} → {{أَكْبَرُ}} (ekber). Ardından {{مِنْ}} (-den) gelir: {{أَحْمَدُ أَطْوَلُ مِنْ عَلِيٍّ}} “Ahmet Ali’den daha uzundur.”',
        'Bu kalıp cinsiyete göre değişmez: {{فَاطِمَةُ أَطْوَلُ مِنْ زَيْنَبَ}}.',
        '“En” için {{ال}} eklenir ya da kalıp bir isme tamlama ile bağlanır: {{الْأَكْبَرُ}} “en büyük”, {{أَكْبَرُ مَدِينَةٍ}} “en büyük şehir”.'
      ],
      ex: [
        { ar: 'إِسْطَنْبُولُ أَكْبَرُ مِنْ أَنْقَرَةَ', tl: 'İstanbûlu ekberu min Ankara', tr: 'İstanbul Ankara’dan daha büyüktür.', en: 'Istanbul is bigger than Ankara.' },
        { ar: 'هٰذَا الدَّرْسُ أَسْهَلُ', tl: 'hâze’d-dersu eshelu', tr: 'Bu ders daha kolay.', en: 'This lesson is easier.' },
        { ar: 'إِسْطَنْبُولُ أَكْبَرُ مَدِينَةٍ فِي تُرْكِيَا', tl: 'İstanbûlu ekberu medînetin fî Turkiyâ', tr: 'İstanbul Türkiye’nin en büyük şehridir.', en: 'Istanbul is the biggest city in Turkey.' }
      ],
      tips: ['Türkçedeki <b>“Allahu ekber”</b> ifadesi tam bu kalıptır: {{أَكْبَرُ}} “daha büyük / en büyük”. <b>Ekseriyet</b> (çoğunluk) {{أَكْثَر}}, <b>ahsen</b> {{أَحْسَن}} (daha güzel) de aynı kalıptandır.']
    }
  ],
  keys: [
    'Sıfat isimden <b>sonra</b> gelir: {{بَيْتٌ كَبِيرٌ}}.',
    'Dişil isme dişil sıfat ({{ـَةٌ}}): {{سَيَّارَةٌ جَدِيدَةٌ}}.',
    'İsim ال’li ise sıfat da ال’li: {{الْبَيْتُ الْكَبِيرُ}} “büyük ev”. Sıfatta ال yoksa cümle olur: {{الْبَيْتُ كَبِيرٌ}} “Ev büyüktür.”',
    'İnsan olmayan çoğullara dişil tekil sıfat: {{كُتُبٌ جَدِيدَةٌ}}.',
    '“Daha …” = {{أَفْعَلُ مِنْ}}: {{أَكْبَرُ مِنْ}}; “en …” = {{الْأَكْبَرُ}} ya da {{أَكْبَرُ مَدِينَةٍ}}.'
  ],
  mistakes: [
    { bad: 'كَبِيرٌ بَيْتٌ', good: 'بَيْتٌ كَبِيرٌ', why: 'Türkçe sırayı kopyalama: Arapçada sıfat sonra gelir.' },
    { bad: 'الْبَيْتُ كَبِيرٌ (= büyük ev?)', good: 'الْبَيْتُ الْكَبِيرُ', why: '“Büyük ev” isim grubu için sıfat da ال almalı. ال’siz sıfat “ev büyüktür” cümlesi yapar.' },
    { bad: 'سَيَّارَةٌ جَدِيدٌ', good: 'سَيَّارَةٌ جَدِيدَةٌ', why: 'Dişil isimle sıfat da dişil olmalı.' },
    { bad: 'كُتُبٌ جُدُدٌ', good: 'كُتُبٌ جَدِيدَةٌ', why: 'İnsan olmayan çoğullar dişil tekil sıfat alır.' }
  ],
  words: [
    { ar: 'كَبِير', tl: 'kebîr', tr: 'büyük', en: 'big' },
    { ar: 'صَغِير', tl: 'sağîr', tr: 'küçük', en: 'small' },
    { ar: 'جَدِيد', tl: 'cedîd', tr: 'yeni', en: 'new' },
    { ar: 'قَدِيم', tl: 'kadîm', tr: 'eski', en: 'old' },
    { ar: 'طَوِيل', tl: 'tavîl', tr: 'uzun', en: 'long / tall' },
    { ar: 'قَصِير', tl: 'kasîr', tr: 'kısa', en: 'short' },
    { ar: 'جَمِيل', tl: 'cemîl', tr: 'güzel', en: 'beautiful' },
    { ar: 'سَهْل', tl: 'sehl', tr: 'kolay', en: 'easy' },
    { ar: 'صَعْب', tl: 'sa‘b', tr: 'zor', en: 'difficult' },
    { ar: 'حَارّ', tl: 'hârr', tr: 'sıcak', en: 'hot' },
    { ar: 'بَارِد', tl: 'bârid', tr: 'soğuk', en: 'cold' },
    { ar: 'كَثِير', tl: 'kesîr', tr: 'çok', en: 'many / much' },
    { ar: 'قَلِيل', tl: 'kalîl', tr: 'az', en: 'few / little' },
    { ar: 'سَعِيد', tl: 'se‘îd', tr: 'mutlu', en: 'happy' },
    { ar: 'حَزِين', tl: 'hazîn', tr: 'üzgün', en: 'sad' },
    { ar: 'قَرِيب', tl: 'karîb', tr: 'yakın', en: 'near' },
    { ar: 'بَعِيد', tl: 'ba‘îd', tr: 'uzak', en: 'far' },
    { ar: 'مُجْتَهِد', tl: 'muctehid', tr: 'çalışkan', en: 'hardworking' },
    { ar: 'أَكْبَر', tl: 'ekber', tr: 'daha büyük', en: 'bigger' }
  ],
  acts: [
    { type: 'flash', title: 'Sıfat kartları', desc: 'Sık kullanılan sıfatları ve zıtlarını öğren.', glyph: 'كَبِير' },
    {
      type: 'match', title: 'Zıt anlamlılar', desc: 'Her sıfatı zıt anlamlısıyla eşleştir.', glyph: '↔', items: [
        ['كَبِيرٌ', 'صَغِيرٌ'], ['جَدِيدٌ', 'قَدِيمٌ'], ['طَوِيلٌ', 'قَصِيرٌ'], ['سَهْلٌ', 'صَعْبٌ'], ['حَارٌّ', 'بَارِدٌ'],
        ['كَثِيرٌ', 'قَلِيلٌ'], ['سَعِيدٌ', 'حَزِينٌ'], ['قَرِيبٌ', 'بَعِيدٌ']
      ]
    },
    {
      type: 'fill', title: 'Uyumlu sıfatı seç', desc: 'Cinsiyet, sayı ve belirliliğe uygun sıfatı yerleştir.', glyph: '___', items: [
        { s: 'سَيَّارَةٌ ___', options: ['جَدِيدَةٌ', 'جَدِيدٌ', 'الْجَدِيدَةُ'], a: 'جَدِيدَةٌ', tr: 'yeni bir araba', why: 'Dişil + belirsiz isim → dişil + belirsiz sıfat.' },
        { s: 'الْبَيْتُ ___', hint: '“büyük ev” (isim grubu)', options: ['الْكَبِيرُ', 'كَبِيرٌ', 'كَبِيرَةٌ'], a: 'الْكَبِيرُ', tr: 'büyük ev', why: 'Belirli isim → belirli sıfat.' },
        { s: 'الْبَيْتُ ___', hint: '“Ev büyüktür.” (cümle)', options: ['كَبِيرٌ', 'الْكَبِيرُ', 'كَبِيرَةٌ'], a: 'كَبِيرٌ', tr: 'Ev büyüktür.', why: 'Belirli isim + belirsiz sıfat = cümle.' },
        { s: 'كُتُبٌ ___', options: ['جَدِيدَةٌ', 'جُدُدٌ', 'جَدِيدٌ'], a: 'جَدِيدَةٌ', tr: 'yeni kitaplar', why: 'İnsan olmayan çoğul → dişil tekil sıfat.' },
        { s: 'طُلَّابٌ ___', options: ['مُجْتَهِدُونَ', 'مُجْتَهِدَةٌ', 'مُجْتَهِدٌ'], a: 'مُجْتَهِدُونَ', tr: 'çalışkan öğrenciler', why: 'İnsan çoğulu → çoğul sıfat.' },
        { s: 'بِنْتٌ ___', options: ['صَغِيرَةٌ', 'صَغِيرٌ', 'الصَّغِيرَةُ'], a: 'صَغِيرَةٌ', tr: 'küçük bir kız', why: '{{بِنْت}} dişil ve belirsiz.' },
        { s: 'الشَّمْسُ ___', hint: '“Güneş sıcaktır.”', options: ['حَارَّةٌ', 'حَارٌّ', 'الْحَارَّةُ'], a: 'حَارَّةٌ', tr: 'Güneş sıcaktır.', why: '{{شَمْس}} ة olmadan dişildir; cümle için sıfat ال’siz.' },
        { s: 'أَحْمَدُ ___ مِنْ عَلِيٍّ', options: ['أَطْوَلُ', 'طَوِيلٌ', 'الطَّوِيلُ'], a: 'أَطْوَلُ', tr: 'Ahmet Ali’den daha uzundur.', why: '“Daha” = {{أَفْعَلُ}} + {{مِنْ}}.' }
      ]
    },
    {
      type: 'mc', title: 'Grup mu, cümle mi?', desc: 'Arapça yapının doğru çevirisini seç.', glyph: 'ال؟', items: [
        { ar: 'الْكِتَابُ الْجَدِيدُ', q: 'Ne demektir?', options: ['yeni kitap', 'Kitap yenidir.', 'yeni bir kitap'], a: 'yeni kitap', why: 'İkisi de belirli → isim grubu.' },
        { ar: 'الْكِتَابُ جَدِيدٌ', q: 'Ne demektir?', options: ['Kitap yenidir.', 'yeni kitap', 'yeni bir kitap'], a: 'Kitap yenidir.', why: 'Belirli + belirsiz → cümle.' },
        { ar: 'كِتَابٌ جَدِيدٌ', q: 'Ne demektir?', options: ['yeni bir kitap', 'Kitap yenidir.', 'yeni kitap'], a: 'yeni bir kitap', why: 'İkisi de belirsiz → “bir … ” isim grubu.' },
        { ar: 'الْمَدِينَةُ الْجَمِيلَةُ بَعِيدَةٌ', q: 'Ne demektir?', options: ['Güzel şehir uzaktır.', 'Uzak şehir güzeldir.', 'güzel ve uzak bir şehir'], a: 'Güzel şehir uzaktır.', why: '{{الْمَدِينَةُ الْجَمِيلَةُ}} grup = özne; {{بَعِيدَةٌ}} ال’siz = haber.' },
        { ar: 'السَّيَّارَاتُ سَرِيعَةٌ', q: 'Ne demektir?', options: ['Arabalar hızlıdır.', 'hızlı arabalar', 'Araba hızlıdır.'], a: 'Arabalar hızlıdır.', why: 'Cansız çoğul + dişil tekil haber.' },
        { ar: 'أَكْبَرُ مَدِينَةٍ', q: 'Ne demektir?', options: ['en büyük şehir', 'daha büyük bir şehir', 'büyük şehir'], a: 'en büyük şehir', why: '{{أَفْعَلُ}} + belirsiz tamlama = “en …”.' }
      ]
    },
    {
      type: 'order', title: 'Sıfatlı cümle kur', desc: 'Doğru sırayla cümleler oluştur.', glyph: 'ـٌ ـٌ', items: [
        { tr: 'Yeni araba güzeldir.', w: ['السَّيَّارَةُ', 'الْجَدِيدَةُ', 'جَمِيلَةٌ'] },
        { tr: 'Bu büyük bir evdir.', w: ['هٰذَا', 'بَيْتٌ', 'كَبِيرٌ'] },
        { tr: 'Ders kolaydır.', w: ['الدَّرْسُ', 'سَهْلٌ'] },
        { tr: 'İstanbul Ankara’dan daha büyüktür.', w: ['إِسْطَنْبُولُ', 'أَكْبَرُ', 'مِنْ', 'أَنْقَرَةَ'] },
        { tr: 'Küçük kız mutludur.', w: ['الْبِنْتُ', 'الصَّغِيرَةُ', 'سَعِيدَةٌ'] }
      ]
    },
    {
      type: 'test', title: 'Sıfatlar testi', desc: 'Dört uyum kuralı ve karşılaştırma için karma test.', glyph: '؟', items: [
        { q: '“The new teacher” (erkek) hangisidir?', options: ['الْمُعَلِّمُ الْجَدِيدُ', 'الْمُعَلِّمُ جَدِيدٌ', 'مُعَلِّمٌ الْجَدِيدُ', 'الْجَدِيدُ الْمُعَلِّمُ'], a: 'الْمُعَلِّمُ الْجَدِيدُ', why: 'İsim + sıfat, ikisi de ال’li.' },
        { q: '“The teacher is new.” hangisidir?', options: ['الْمُعَلِّمُ جَدِيدٌ', 'الْمُعَلِّمُ الْجَدِيدُ', 'مُعَلِّمٌ جَدِيدٌ', 'جَدِيدٌ مُعَلِّمٌ'], a: 'الْمُعَلِّمُ جَدِيدٌ', why: 'Haber ال’siz.' },
        { t: 'tf', s: 'سَيَّارَاتٌ جَدِيدَةٌ doğru bir ifadedir.', a: true, why: 'Cansız çoğul → dişil tekil sıfat.' },
        { t: 'tf', s: 'Arapçada sıfat isimden önce gelir.', a: false, why: 'Sonra gelir: {{بَيْتٌ كَبِيرٌ}}.' },
        { t: 'fill', s: 'مَدِينَةٌ ___', options: ['جَمِيلَةٌ', 'جَمِيلٌ', 'الْجَمِيلَةُ'], a: 'جَمِيلَةٌ', tr: 'güzel bir şehir' },
        { q: '{{صَغِير}} kelimesinin “daha …” biçimi?', options: ['أَصْغَرُ', 'صُغْرَى', 'صَغِيرَةٌ', 'الصَّغِيرُ'], a: 'أَصْغَرُ', why: '{{أَفْعَلُ}} kalıbı: ص-غ-ر → {{أَصْغَرُ}}.' },
        { t: 'order', tr: 'Eski ev uzaktır.', w: ['الْبَيْتُ', 'الْقَدِيمُ', 'بَعِيدٌ'] },
        { q: '{{سَهْل}} kelimesinin zıttı?', options: ['صَعْبٌ', 'قَلِيلٌ', 'بَعِيدٌ', 'قَدِيمٌ'], a: 'صَعْبٌ' }
      ]
    }
  ]
});
