window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'sayilar', n: 8, level: 'Orta', glyph: 'ع',
  ar: 'الْأَعْدَادُ', name: 'Sayılar',
  desc: '0–1000 arası sayılar, Arap rakamları, sayı–sayılan uyumu ve sıra sayıları.',
  long: 'Sayıları say, Arap rakamlarını oku, “üç kitap” ve “yirmi öğrenci” gibi ifadeleri doğru kur. Saatler dersine hazırlık için sıra sayıları da burada.',
  tags: 'sayılar rakam bir iki üç wahid ithnan thalatha ashara ishrun sayı sayılan sıra sayısı',
  readMins: 15,
  intro: 'Arapça sayılar ilk bakışta zor görünür, çünkü sayı ile sayılan nesne arasında ilginç bir <b>ters cinsiyet</b> kuralı vardır. Ama kural birkaç adımda öğrenilir. Önce sayıları ve rakamları ezberle, sonra “kaç tane” derken ismin nasıl değiştiğini gör.',
  lesson: [
    {
      h: 'Arap rakamları',
      p: [
        'Arap dünyasının çoğunda (özellikle doğuda) şu rakamlar kullanılır. Kuzey Afrika’da ise bizim kullandığımız “0-9” rakamları yaygındır — zaten onların adı da “Arap rakamları”dır!'
      ],
      table: {
        cols: ['Rakam', 'Değer', 'Okunuş'],
        rows: [
          ['٠', '0', 'sıfr (صِفْر)'], ['١', '1', 'vâhid'], ['٢', '2', 'isnân'], ['٣', '3', 'selâse'], ['٤', '4', 'erba‘a'],
          ['٥', '5', 'hamse'], ['٦', '6', 'sitte'], ['٧', '7', 'seb‘a'], ['٨', '8', 'semâniye'], ['٩', '9', 'tis‘a']
        ]
      },
      tips: [
        '<b>Rakamlar soldan sağa yazılır!</b> Yazı sağdan sola akarken sayılar bizim gibi okunur: {{٢٠٢٦}} = 2026, {{١٥}} = 15.',
        'Türkçedeki <b>sıfır</b> kelimesi {{صِفْر}}’dan gelir; İngilizce <b>zero</b> ve <b>cipher</b> da aynı kökten!'
      ]
    },
    {
      h: '1’den 10’a',
      table: {
        cols: ['Sayı', 'Arapça', 'Okunuş', 'Türkçede iz'],
        rows: [
          ['1', 'وَاحِدٌ', 'vâhid', '“vahdet” (birlik)'],
          ['2', 'اِثْنَانِ', 'isnân', '“isneyn” (pazartesi)'],
          ['3', 'ثَلَاثَةٌ', 'selâse', '“teslis” (üçleme), “müselles” (üçgen)'],
          ['4', 'أَرْبَعَةٌ', 'erba‘a', '“murabba” (kare), “rubu”'],
          ['5', 'خَمْسَةٌ', 'hamse', '“hamse” (beşli eser), “muhammes”'],
          ['6', 'سِتَّةٌ', 'sitte', '“müseddes” (altıgen)'],
          ['7', 'سَبْعَةٌ', 'seb‘a', '“müsebba” (yedigen)'],
          ['8', 'ثَمَانِيَةٌ', 'semâniye', '“müsemmen” (sekizgen)'],
          ['9', 'تِسْعَةٌ', 'tis‘a', '—'],
          ['10', 'عَشَرَةٌ', 'aşere', '“aşure” (10. gün), “öşür”']
        ]
      },
      tips: ['Türkçede geometri terimleri bu sayılardan türemiştir: <b>müselles</b> üçgen, <b>murabba</b> kare, <b>muhammes</b> beşgen, <b>müseddes</b> altıgen, <b>müsemmen</b> sekizgen. <b>Aşure</b> de Muharrem’in 10. günüdür ({{عَاشُورَاء}}).']
    },
    {
      h: '11–19, onlar, yüz ve bin',
      table: {
        cols: ['Sayı', 'Arapça', 'Okunuş'],
        rows: [
          ['11', 'أَحَدَ عَشَرَ', 'ehade aşer'], ['12', 'اِثْنَا عَشَرَ', 'isnâ aşer'], ['13', 'ثَلَاثَةَ عَشَرَ', 'selâsete aşer'],
          ['15', 'خَمْسَةَ عَشَرَ', 'hamsete aşer'], ['20', 'عِشْرُونَ', 'işrûn'], ['30', 'ثَلَاثُونَ', 'selâsûn'],
          ['40', 'أَرْبَعُونَ', 'erba‘ûn'], ['50', 'خَمْسُونَ', 'hamsûn'], ['60', 'سِتُّونَ', 'sittûn'], ['70', 'سَبْعُونَ', 'seb‘ûn'],
          ['80', 'ثَمَانُونَ', 'semânûn'], ['90', 'تِسْعُونَ', 'tis‘ûn'], ['100', 'مِئَةٌ', 'mie'], ['1000', 'أَلْفٌ', 'elf']
        ]
      },
      p2: [
        'Onluklar, birlik sayıya <b>{{ـُونَ}}</b> eklenerek yapılır: {{ثَلَاثَة}} → {{ثَلَاثُونَ}}. (20 istisna: {{عِشْرُونَ}}.)',
        '<b>Birleşik sayılarda birler önce gelir</b> ve {{وَ}} (ve) ile bağlanır: 25 = {{خَمْسَةٌ وَعِشْرُونَ}} “beş ve yirmi”.'
      ],
      cmp: {
        tr: 'Türkçede onlar önce: <b>yirmi beş</b>. Arapçada tersi: “beş ve yirmi”.',
        en: 'İngilizcede de onlar önce: <b>twenty-five</b>. Almanca bilenler için: Arapça Almanca gibi söyler (fünfundzwanzig).'
      },
      tips: ['{{مِئَة}} kelimesi eski imlada {{مائة}} diye yazılır ama yine “mie” okunur; aradaki elif okunmaz.']
    },
    {
      h: 'Sayı–sayılan 1: bir ve iki',
      p: [
        '“Bir” ve “iki” sıfat gibi davranır: isimden <b>sonra</b> gelir ve cinsiyetine uyar. Aslında “iki” için çoğu zaman sadece <b>ikil (dual)</b> ek yeter: {{كِتَابَانِ}} “iki kitap”.'
      ],
      ex: [
        { ar: 'كِتَابٌ وَاحِدٌ', tl: 'kitâbun vâhidun', tr: 'bir (tek) kitap', en: 'one book' },
        { ar: 'سَيَّارَةٌ وَاحِدَةٌ', tl: 'seyyâratun vâhidetun', tr: 'bir (tek) araba', en: 'one car' },
        { ar: 'كِتَابَانِ', tl: 'kitâbâni', tr: 'iki kitap', en: 'two books', note: '-âni eki ikili (dual) yapar.' },
        { ar: 'سَيَّارَتَانِ', tl: 'seyyâratâni', tr: 'iki araba', en: 'two cars' }
      ]
    },
    {
      h: 'Sayı–sayılan 2: 3’ten 10’a (ters cinsiyet)',
      p: [
        '3–10 arası sayılar isimden <b>önce</b> gelir, isim <b>çoğul</b> ve <b>esreli</b> olur. Asıl ilginç kısım: <b>sayı, ismin tekilinin cinsiyetinin tersini alır.</b>',
        '• İsim erkekse (kitap) sayı <b>ة ile</b>: {{ثَلَاثَةُ كُتُبٍ}} “üç kitap”<br>• İsim dişilse (araba) sayı <b>ة’siz</b>: {{ثَلَاثُ سَيَّارَاتٍ}} “üç araba”'
      ],
      table: {
        cols: ['', 'Erkek isim (كِتَاب)', 'Dişil isim (سَيَّارَة)'],
        rows: [
          ['3', 'ثَلَاثَةُ كُتُبٍ', 'ثَلَاثُ سَيَّارَاتٍ'],
          ['5', 'خَمْسَةُ أَقْلَامٍ', 'خَمْسُ طَالِبَاتٍ'],
          ['7', 'سَبْعَةُ أَيَّامٍ', 'سَبْعُ سَاعَاتٍ'],
          ['10', 'عَشَرَةُ رِجَالٍ', 'عَشْرُ دَقَائِقَ']
        ]
      },
      tips: ['Hafıza ipucu: <b>“Erkeğe kurdele (ة) tak.”</b> Erkek isimle sayıya ة gelir, dişil isimle ة düşer. Sayarken (bir, iki, üç…) kullandığın ة’li biçimler zaten erkek isimler içindir.']
    },
    {
      h: 'Sayı–sayılan 3: 11 ve üstü',
      p: [
        '11–99 arası sayılardan sonra isim <b>tekil</b> ve <b>üstün tenvinli</b> (-en) olur: {{عِشْرُونَ طَالِبًا}} “yirmi öğrenci”. Türkçede de “yirmi öğrenci<s>ler</s>” demeyiz!',
        '100 ve 1000’den sonra isim <b>tekil</b> ve <b>esreli</b> olur: {{مِئَةُ كِتَابٍ}} “yüz kitap”, {{أَلْفُ لَيْرَةٍ}} “bin lira”.'
      ],
      ex: [
        { ar: 'عِشْرُونَ طَالِبًا', tl: 'işrûne tâliben', tr: 'yirmi öğrenci', en: 'twenty students' },
        { ar: 'خَمْسَةَ عَشَرَ كِتَابًا', tl: 'hamsete aşera kitâben', tr: 'on beş kitap', en: 'fifteen books' },
        { ar: 'ثَلَاثُونَ يَوْمًا', tl: 'selâsûne yevmen', tr: 'otuz gün', en: 'thirty days' },
        { ar: 'مِئَةُ كِتَابٍ', tl: 'mietu kitâbin', tr: 'yüz kitap', en: 'a hundred books' },
        { ar: 'أَلْفُ لَيْلَةٍ وَلَيْلَةٌ', tl: 'elfu leyletin ve leyle', tr: 'Binbir Gece', en: 'One Thousand and One Nights' }
      ],
      cmp: {
        tr: 'Türkçe her sayıdan sonra <b>tekil</b> kullanır: üç kitap, yirmi kitap. Arapçada 3–10 arası <b>çoğul</b>, 11 ve sonrası <b>tekil</b>dir.',
        en: 'İngilizce 2’den itibaren hep <b>çoğul</b> kullanır: three books, twenty books.'
      }
    },
    {
      h: 'Sıra sayıları ve yaş',
      p: [
        'Sıra sayıları {{فَاعِل}} kalıbındadır ve sıfat gibi isimden sonra gelir: {{الدَّرْسُ الثَّالِثُ}} “üçüncü ders”. “Birinci” düzensizdir: {{الْأَوَّلُ}} (dişil {{الْأُولَى}}). Bu biçimler <b>Saatler</b> dersinde çok önemli olacak.',
        'Yaş sormak: {{كَمْ عُمْرُكَ؟}} “Kaç yaşındasın?” — {{عُمْرِي عِشْرُونَ سَنَةً}} “Yirmi yaşındayım.”'
      ],
      table: {
        cols: ['Sıra', 'Erkek', 'Dişil'],
        rows: [
          ['1.', 'الْأَوَّلُ', 'الْأُولَى'], ['2.', 'الثَّانِي', 'الثَّانِيَةُ'], ['3.', 'الثَّالِثُ', 'الثَّالِثَةُ'], ['4.', 'الرَّابِعُ', 'الرَّابِعَةُ'],
          ['5.', 'الْخَامِسُ', 'الْخَامِسَةُ'], ['10.', 'الْعَاشِرُ', 'الْعَاشِرَةُ']
        ]
      },
      ex: [
        { ar: 'كَمْ عُمْرُكَ؟', tl: 'kem ‘umruke?', tr: 'Kaç yaşındasın?', en: 'How old are you?' },
        { ar: 'عُمْرِي خَمْسٌ وَعِشْرُونَ سَنَةً', tl: '‘umrî hamsun ve işrûne seneten', tr: 'Yirmi beş yaşındayım.', en: 'I am twenty-five years old.', note: '{{سَنَة}} dişil olduğu için “beş” ة’siz: {{خَمْسٌ}}.' }
      ],
      tips: ['Türkçedeki <b>ömür</b> {{عُمْر}}, <b>sene</b> {{سَنَة}}’dir. “Evvel” ({{أَوَّل}}) ve “sani” (saniye: dakikanın ikinci bölümü!) da sıra sayılarından gelir.']
    }
  ],
  keys: [
    'Rakamlar soldan sağa: {{٢٠٢٦}} = 2026.',
    'Birleşik sayılarda birler önce: 25 = {{خَمْسَةٌ وَعِشْرُونَ}}.',
    '1 ve 2 sıfat gibi sonra gelir; “iki” için dual yeter: {{كِتَابَانِ}}.',
    '3–10: ters cinsiyet + çoğul esreli isim: {{ثَلَاثَةُ كُتُبٍ}} / {{ثَلَاثُ سَيَّارَاتٍ}}.',
    '11–99: tekil, -en tenvinli: {{عِشْرُونَ طَالِبًا}}. 100/1000: tekil esreli: {{مِئَةُ كِتَابٍ}}.'
  ],
  mistakes: [
    { bad: 'ثَلَاثُ كُتُبٍ', good: 'ثَلَاثَةُ كُتُبٍ', why: '{{كِتَاب}} erkektir; sayı tersini alır → ة’li {{ثَلَاثَةُ}}.' },
    { bad: 'عِشْرُونَ طُلَّابٌ', good: 'عِشْرُونَ طَالِبًا', why: '11–99 arasında isim tekil ve -en tenvinli olur.' },
    { bad: 'وَاحِدٌ كِتَابٌ', good: 'كِتَابٌ وَاحِدٌ', why: '“Bir” sıfat gibi isimden sonra gelir.' },
    { bad: 'عِشْرُونَ وَخَمْسَةٌ', good: 'خَمْسَةٌ وَعِشْرُونَ', why: 'Birleşik sayılarda birler önce söylenir.' }
  ],
  words: [
    { ar: 'صِفْر', tl: 'sıfr', tr: 'sıfır', en: 'zero' },
    { ar: 'وَاحِد', tl: 'vâhid', tr: 'bir', en: 'one' },
    { ar: 'اِثْنَان', tl: 'isnân', tr: 'iki', en: 'two' },
    { ar: 'ثَلَاثَة', tl: 'selâse', tr: 'üç', en: 'three' },
    { ar: 'أَرْبَعَة', tl: 'erba‘a', tr: 'dört', en: 'four' },
    { ar: 'خَمْسَة', tl: 'hamse', tr: 'beş', en: 'five' },
    { ar: 'سِتَّة', tl: 'sitte', tr: 'altı', en: 'six' },
    { ar: 'سَبْعَة', tl: 'seb‘a', tr: 'yedi', en: 'seven' },
    { ar: 'ثَمَانِيَة', tl: 'semâniye', tr: 'sekiz', en: 'eight' },
    { ar: 'تِسْعَة', tl: 'tis‘a', tr: 'dokuz', en: 'nine' },
    { ar: 'عَشَرَة', tl: 'aşere', tr: 'on', en: 'ten' },
    { ar: 'عِشْرُونَ', tl: 'işrûn', tr: 'yirmi', en: 'twenty' },
    { ar: 'خَمْسُونَ', tl: 'hamsûn', tr: 'elli', en: 'fifty' },
    { ar: 'مِئَة', tl: 'mie', tr: 'yüz', en: 'hundred' },
    { ar: 'أَلْف', tl: 'elf', tr: 'bin', en: 'thousand' },
    { ar: 'الْأَوَّل', tl: 'el-evvel', tr: 'birinci', en: 'first' },
    { ar: 'عُمْر', tl: '‘umr', tr: 'yaş, ömür', en: 'age' },
    { ar: 'سَنَة', tl: 'sene', tr: 'yıl', en: 'year' }
  ],
  acts: [
    { type: 'flash', title: 'Sayı kartları', desc: 'Sayıları kartlarla ezberle ve dinle.', glyph: '١٢٣' },
    {
      type: 'match', title: 'Rakam ↔ sayı', desc: 'Arap rakamını Arapça okunuşuyla eşleştir.', glyph: '٣', items: [
        ['٣', 'ثَلَاثَةٌ'], ['٧', 'سَبْعَةٌ'], ['٤', 'أَرْبَعَةٌ'], ['٩', 'تِسْعَةٌ'], ['٦', 'سِتَّةٌ'], ['٨', 'ثَمَانِيَةٌ'], ['٢٠', 'عِشْرُونَ'], ['١٠٠', 'مِئَةٌ'], ['٥', 'خَمْسَةٌ'], ['٢', 'اِثْنَانِ']
      ]
    },
    {
      type: 'mc', title: 'Rakam oku', desc: 'Arap rakamlarıyla yazılmış sayının değerini bul.', glyph: '٤٧', items: [
        { q: 'Bu sayı kaçtır?', ar: '٤٧', options: ['47', '74', '38', '46'], a: '47', why: 'Soldan sağa: ٤ = 4, ٧ = 7.' },
        { q: 'Bu sayı kaçtır?', ar: '١٩٢٣', options: ['1923', '3291', '1932', '1823'], a: '1923', why: '١ ٩ ٢ ٣ — soldan sağa okunur.' },
        { q: 'Bu sayı kaçtır?', ar: '٦٥', options: ['65', '56', '75', '45'], a: '65' },
        { q: 'Bu sayı kaçtır?', ar: '٣٠٨', options: ['308', '803', '380', '208'], a: '308' },
        { q: 'Bu sayı kaçtır?', ar: '٥٩', options: ['59', '95', '69', '58'], a: '59' },
        { q: '“Kırk iki” Arapçada nasıl söylenir?', options: ['اِثْنَانِ وَأَرْبَعُونَ', 'أَرْبَعُونَ وَاثْنَانِ', 'أَرْبَعَةٌ وَعِشْرُونَ', 'اِثْنَا عَشَرَ'], a: 'اِثْنَانِ وَأَرْبَعُونَ', why: 'Birler önce: “iki ve kırk”.' },
        { q: '{{سَبْعَةٌ وَثَلَاثُونَ}} kaçtır?', options: ['37', '73', '17', '307'], a: '37', why: '“Yedi ve otuz” = 37.' }
      ]
    },
    {
      type: 'fill', title: 'Sayıyı uydur', desc: 'Sayı–sayılan kurallarına göre doğru biçimi seç.', glyph: '___', items: [
        { s: '___ كُتُبٍ', hint: 'üç kitap', options: ['ثَلَاثَةُ', 'ثَلَاثُ', 'ثَلَاثُونَ'], a: 'ثَلَاثَةُ', tr: 'üç kitap', why: '{{كِتَاب}} erkek → sayı ة’li.' },
        { s: '___ سَيَّارَاتٍ', hint: 'üç araba', options: ['ثَلَاثُ', 'ثَلَاثَةُ', 'ثَالِثُ'], a: 'ثَلَاثُ', tr: 'üç araba', why: '{{سَيَّارَة}} dişil → sayı ة’siz.' },
        { s: 'خَمْسَةُ ___', hint: 'beş kalem', options: ['أَقْلَامٍ', 'قَلَمًا', 'قَلَمٌ'], a: 'أَقْلَامٍ', tr: 'beş kalem', why: '3–10: çoğul ve esreli isim.' },
        { s: 'عِشْرُونَ ___', hint: 'yirmi öğrenci', options: ['طَالِبًا', 'طُلَّابٍ', 'طَالِبٌ'], a: 'طَالِبًا', tr: 'yirmi öğrenci', why: '11–99: tekil, -en tenvinli.' },
        { s: 'مِئَةُ ___', hint: 'yüz kitap', options: ['كِتَابٍ', 'كُتُبٍ', 'كِتَابًا'], a: 'كِتَابٍ', tr: 'yüz kitap', why: '100’den sonra tekil esreli isim.' },
        { s: '___ دَقَائِقَ', hint: 'on dakika', options: ['عَشْرُ', 'عَشَرَةُ', 'عَاشِرُ'], a: 'عَشْرُ', tr: 'on dakika', why: '{{دَقِيقَة}} dişil → sayı ة’siz: {{عَشْرُ}}.' },
        { s: 'كِتَابٌ ___', hint: 'bir (tek) kitap', options: ['وَاحِدٌ', 'وَاحِدَةٌ', 'أَحَدٌ'], a: 'وَاحِدٌ', tr: 'bir kitap', why: '“Bir” sıfat gibi sonra gelir ve cinsiyete uyar.' },
        { s: 'الدَّرْسُ ___', hint: 'üçüncü ders', options: ['الثَّالِثُ', 'ثَلَاثَةٌ', 'الثَّالِثَةُ'], a: 'الثَّالِثُ', tr: 'üçüncü ders', why: 'Sıra sayısı sıfat gibi uyar: erkek, belirli.' }
      ]
    },
    {
      type: 'tf', title: 'Sayı kuralları', desc: 'Doğru mu, yanlış mı?', glyph: '✓ ✗', items: [
        { s: 'Arap rakamları sağdan sola okunur.', a: false, why: 'Yazı sağdan sola, rakamlar soldan sağa.' },
        { s: '25 Arapçada خَمْسَةٌ وَعِشْرُونَ şeklinde söylenir.', a: true },
        { s: 'ثَلَاثُ كُتُبٍ doğrudur.', a: false, why: 'Erkek isimle ة’li sayı: {{ثَلَاثَةُ كُتُبٍ}}.' },
        { s: 'كِتَابَانِ “iki kitap” demektir.', a: true, why: '-âni ikil ekidir.' },
        { s: '“Otuz gün” ثَلَاثُونَ يَوْمًا şeklindedir.', a: true, why: 'Tekil, -en tenvinli.' },
        { s: 'Türkçedeki “sıfır” kelimesi Arapçadan gelir.', a: true, why: '{{صِفْر}}.' }
      ]
    },
    {
      type: 'test', title: 'Sayılar testi', desc: 'Karma değerlendirme.', glyph: '؟', items: [
        { q: '{{ثَمَانِيَةٌ}} kaçtır?', options: ['8', '3', '6', '80'], a: '8' },
        { q: '“Yüz” hangisidir?', options: ['مِئَةٌ', 'أَلْفٌ', 'عَشَرَةٌ', 'مِلْيُونٌ'], a: 'مِئَةٌ' },
        { q: 'Bu sayı kaçtır?', ar: '٧١', options: ['71', '17', '61', '77'], a: '71' },
        { t: 'fill', s: '___ طَالِبَاتٍ', hint: 'beş kız öğrenci', options: ['خَمْسُ', 'خَمْسَةُ', 'خَمْسُونَ'], a: 'خَمْسُ', tr: 'beş kız öğrenci', why: 'Dişil isim → ة’siz sayı.' },
        { t: 'order', tr: 'Yirmi yaşındayım.', w: ['عُمْرِي', 'عِشْرُونَ', 'سَنَةً'] },
        { q: '“Birinci” (erkek) hangisidir?', options: ['الْأَوَّلُ', 'الْوَاحِدُ', 'الْأُولَى', 'الثَّانِي'], a: 'الْأَوَّلُ' },
        { t: 'tf', s: '11 ve üstü sayılardan sonra isim çoğul gelir.', a: false, why: 'Tekil ve -en tenvinli: {{أَحَدَ عَشَرَ كِتَابًا}}.' },
        { q: '{{سِتُّونَ}} kaçtır?', options: ['60', '6', '16', '70'], a: '60' }
      ]
    }
  ]
});
