window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'iyelik', n: 4, level: 'Başlangıç', glyph: 'ـي',
  ar: 'الضَّمَائِرُ الْمُتَّصِلَةُ', name: 'İyelik Ekleri',
  desc: 'Kitabım, kitabın, kitabı: bitişik zamirler ve “bende var”.',
  long: 'Türkçedeki -ım, -ın, -ı eklerinin Arapça karşılıkları olan bitişik zamirler. İsimde iyelik, harf-i cerde “bende / sende” ve fiilde “beni / seni” anlamları.',
  tags: 'iyelik ekleri benim senin onun kitabım bitişik zamir muttasıl indi li sahiplik',
  readMins: 14,
  intro: 'Arapçada “benim kitabım” demek için Türkçedeki gibi ismin sonuna <b>ek</b> getirilir: {{كِتَاب}} + {{ـِي}} = {{كِتَابِي}} “kitabım”. Bu eklere <b>bitişik zamirler</b> (ed-damâiru’l-muttasıla) denir. Aynı ekler harf-i cerlere eklenince “bende, sana”, fiillere eklenince “beni, seni” anlamı verir. Türkçe konuşan biri için bu konu çok tanıdık gelecek!',
  lesson: [
    {
      h: 'Tekil iyelik ekleri',
      p: [
        'Ekler ismin sonuna bitişik yazılır. Ekten önceki harfin harekesi cümledeki göreve göre değişebilir (kitâbu-ke, kitâbi-ke); başlangıçta en sık duyacağın <b>ötreli</b> biçimi öğren.'
      ],
      table: {
        cols: ['Ek', 'Örnek', 'Okunuş', 'Türkçe', 'English'],
        rows: [
          ['ـِي', 'كِتَابِي', 'kitâbî', 'kitabım', 'my book'],
          ['ـكَ', 'كِتَابُكَ', 'kitâbuke', 'kitabın (erkeğe)', 'your book (m.)'],
          ['ـكِ', 'كِتَابُكِ', 'kitâbuki', 'kitabın (kadına)', 'your book (f.)'],
          ['ـهُ', 'كِتَابُهُ', 'kitâbuhû', 'onun kitabı (erkek)', 'his book'],
          ['ـهَا', 'كِتَابُهَا', 'kitâbuhâ', 'onun kitabı (kadın)', 'her book']
        ]
      },
      cmp: {
        tr: 'Türkçede de iyelik bir <b>ek</b>tir: kitab<b>-ım</b>, kitab<b>-ın</b>, kitab<b>-ı</b>. Mantık birebir aynı! Tek fark: Arapçada “senin” ve “onun” için erkek/kadın ayrımı vardır.',
        en: 'İngilizce ayrı kelime kullanır: <b>my</b> book, <b>your</b> book, <b>his / her</b> book. Arapçada bu kelimeler isme yapışır.'
      },
      tips: ['“Onun” ekinde ayrım: {{كِتَابُهُ}} (kitâbu<b>hû</b>) bir erkeğin, {{كِتَابُهَا}} (kitâbu<b>hâ</b>) bir kadının kitabı. İngilizce “his / her” ile aynı.']
    },
    {
      h: 'Çoğul ve ikil ekler',
      p: [
        'Zamirler dersindeki kalıp burada da geçerli: <b>-kum</b> (sizin), <b>-hum</b> (onların), <b>-kumâ / -humâ</b> (ikiniz / ikisinin), <b>-kunne / -hunne</b> (kadınlar).'
      ],
      table: {
        cols: ['Ek', 'Örnek', 'Okunuş', 'Türkçe'],
        rows: [
          ['ـنَا', 'كِتَابُنَا', 'kitâbunâ', 'kitabımız'],
          ['ـكُمْ', 'كِتَابُكُمْ', 'kitâbukum', 'kitabınız'],
          ['ـكُمَا', 'كِتَابُكُمَا', 'kitâbukumâ', 'ikinizin kitabı'],
          ['ـكُنَّ', 'كِتَابُكُنَّ', 'kitâbukunne', 'kitabınız (kadınlar)'],
          ['ـهُمْ', 'كِتَابُهُمْ', 'kitâbuhum', 'onların kitabı'],
          ['ـهُمَا', 'كِتَابُهُمَا', 'kitâbuhumâ', 'ikisinin kitabı'],
          ['ـهُنَّ', 'كِتَابُهُنَّ', 'kitâbuhunne', 'onların kitabı (kadınlar)']
        ]
      },
      tips: ['Ayrık zamirle karşılaştır: {{هُمْ}} → {{ـهُمْ}}, {{نَحْنُ}} → {{ـنَا}}, {{أَنْتُمْ}} → {{ـكُمْ}}. “Siz”deki <b>t</b> ekte <b>k</b> olur: ent<b>um</b> → -k<b>um</b>.']
    },
    {
      h: 'Kural 1: ال düşer',
      p: [
        'İyelik eki alan isim zaten belirlidir (“benim kitabım” belli bir kitaptır). Bu yüzden <b>ال ve tenvin düşer</b>: {{الْكِتَابُ}} → {{كِتَابِي}}. Asla {{الْكِتَابِي}} denmez.'
      ],
      ex: [
        { ar: 'كِتَابِي جَدِيدٌ', tl: 'kitâbî cedîdun', tr: 'Kitabım yenidir.', en: 'My book is new.' },
        { ar: 'بَيْتُهُ كَبِيرٌ', tl: 'beytuhû kebîrun', tr: 'Onun evi büyüktür.', en: 'His house is big.' },
        { ar: 'قَلَمُكَ هُنَا', tl: 'kalemuke hunâ', tr: 'Kalemin burada.', en: 'Your pen is here.' },
        { ar: 'مُعَلِّمُنَا لَطِيفٌ', tl: 'mu‘allimunâ latîfun', tr: 'Öğretmenimiz naziktir.', en: 'Our teacher is kind.' }
      ]
    },
    {
      h: 'Kural 2: ة → ت',
      p: [
        'Tâ merbûta ({{ة}}) ile biten bir isme ek gelince ة, açık <b>ت</b>’ye dönüşür ve “t” olarak okunur: {{سَيَّارَة}} → {{سَيَّارَتِي}} <em>seyyâratî</em> “arabam”.'
      ],
      ex: [
        { ar: 'سَيَّارَتِي', tl: 'seyyâratî', tr: 'arabam', en: 'my car' },
        { ar: 'مَدْرَسَتُهَا', tl: 'medresetuhâ', tr: 'onun (kadın) okulu', en: 'her school' },
        { ar: 'غُرْفَتُكَ', tl: 'ğurfetuke', tr: 'odan', en: 'your room' },
        { ar: 'مَدِينَتُنَا', tl: 'medînetunâ', tr: 'şehrimiz', en: 'our city' }
      ],
      tips: ['Türkçede de benzer bir ses değişimi var: kitap → kita<b>b</b>ım, ağaç → ağa<b>c</b>ım. Arapçada da ek gelince yazım değişir: ة → ت.']
    },
    {
      h: 'Kural 3: ـهُ → ـهِ',
      p: [
        '“Onun” ekleri ({{ـهُ}}، {{ـهُمْ}}، {{ـهُمَا}}، {{ـهُنَّ}}) kendinden önce <b>esre</b> ya da <b>ye</b> gelirse ötresini esreye çevirir: {{فِي}} + {{ـهُ}} = {{فِيهِ}} <em>fîhi</em> “onda / içinde”, {{بِكِتَابِهِ}} <em>bi-kitâbihî</em> “onun kitabıyla”.',
        'Bu tamamen ses uyumudur, anlam değişmez. Türkçedeki ünlü uyumunu (ev-<b>i</b>, okul-<b>u</b>) düşünebilirsin.'
      ],
      ex: [
        { ar: 'فِيهِ', tl: 'fîhi', tr: 'onun içinde / onda', en: 'in it' },
        { ar: 'عَلَيْهِمْ', tl: 'aleyhim', tr: 'onların üzerine', en: 'upon them', note: '“Aleyhim selâm” ifadesini hatırla.' }
      ]
    },
    {
      h: 'Harf-i cerle: “bende var”',
      p: [
        'Arapçada “sahip olmak” fiili yerine <b>{{عِنْدَ}} (yanında)</b> ya da <b>{{لِـ}} (için / -e ait)</b> + ek kullanılır. Türkçedeki “<b>bende</b> kalem <b>var</b>” yapısının aynısıdır!',
        '{{عِنْدِي}} = bende (yanımda), {{عِنْدَكَ}} = sende, {{عِنْدَهُ}} = onda. {{لِي}} = benim (için), {{لَكَ}} = senin.'
      ],
      ex: [
        { ar: 'عِنْدِي قَلَمٌ', tl: '‘indî kalemun', tr: 'Bende bir kalem var. / Kalemim var.', en: 'I have a pen.' },
        { ar: 'عِنْدَكَ سَيَّارَةٌ', tl: '‘indeke seyyâratun', tr: 'Senin bir araban var.', en: 'You have a car.' },
        { ar: 'لَيْسَ عِنْدِي وَقْتٌ', tl: 'leyse ‘indî vaktun', tr: 'Vaktim yok.', en: 'I don’t have time.' },
        { ar: 'لِي أَخٌ', tl: 'lî ehun', tr: 'Bir erkek kardeşim var.', en: 'I have a brother.' },
        { ar: 'مَعِي', tl: 'me‘î', tr: 'benimle', en: 'with me' },
        { ar: 'مِنْكَ', tl: 'minke', tr: 'senden', en: 'from you' }
      ],
      cmp: {
        tr: '<b>Bende</b> kitap <b>var</b> = {{عِنْدِي كِتَابٌ}}. Türkçe “var/yok” mantığı Arapçaya çok iyi oturur.',
        en: 'İngilizce <b>have</b> fiilini kullanır: “I have a book”. Arapçada “have” fiili yoktur; “yanımda bir kitap” denir.'
      }
    },
    {
      h: 'Fiille: “beni, seni”',
      p: [
        'Aynı ekler fiile gelince <b>nesne</b> (beni, seni, onu) olur. Tek fark “beni”dedir: fiilde {{ـِي}} değil <b>{{ـنِي}}</b> kullanılır (araya bir “n” girer).'
      ],
      ex: [
        { ar: 'رَأَيْتُكَ', tl: 'raeytuke', tr: 'Seni gördüm.', en: 'I saw you.' },
        { ar: 'يُحِبُّهَا', tl: 'yuhibbuhâ', tr: 'Onu (kadını) seviyor.', en: 'He loves her.' },
        { ar: 'سَاعِدْنِي', tl: 'sâ‘idnî', tr: 'Bana yardım et.', en: 'Help me.' },
        { ar: 'يَعْرِفُنِي', tl: 'ya‘rifunî', tr: 'Beni tanıyor.', en: 'He knows me.' }
      ],
      tips: ['İsimde “-im” = {{ـِي}} ({{كِتَابِي}}), fiilde “beni” = {{ـنِي}} ({{سَاعِدْنِي}}). Bu küçük “n” (nûnu’l-vikâye) fiili korumak için eklenir.']
    }
  ],
  keys: [
    'Ekler: {{ـِي}} -ım, {{ـكَ}}/{{ـكِ}} -ın, {{ـهُ}}/{{ـهَا}} -ı, {{ـنَا}} -ımız, {{ـكُمْ}} -ınız, {{ـهُمْ}} onların.',
    'Ek alan isim ال almaz: {{كِتَابِي}}, asla {{الْكِتَابِي}}.',
    'ة ek alınca ت olur: {{سَيَّارَة}} → {{سَيَّارَتِي}}.',
    '“Sahip olmak” için {{عِنْدَ}} / {{لِـ}} + ek: {{عِنْدِي قَلَمٌ}} “Bende kalem var.”',
    'Fiilde “beni” = {{ـنِي}}: {{سَاعِدْنِي}} “Bana yardım et.”'
  ],
  mistakes: [
    { bad: 'الْكِتَابِي', good: 'كِتَابِي', why: 'İyelik eki alan isim zaten belirlidir; ال eklenmez.' },
    { bad: 'سَيَّارَةِي', good: 'سَيَّارَتِي', why: 'Ek gelince ة, ت olarak yazılır.' },
    { bad: 'سَاعِدِي', good: 'سَاعِدْنِي', why: 'Fiilde “beni” {{ـنِي}} ile yapılır. {{سَاعِدِي}} “(kadına) yardım et” anlamına gelir!' },
    { bad: 'أَنَا عِنْدِي', good: 'عِنْدِي', why: '“Benim var” için {{عِنْدِي}} tek başına yeterlidir; {{أَنَا}} eklemek gereksizdir (vurgu dışında).' }
  ],
  words: [
    { ar: 'كِتَابِي', tl: 'kitâbî', tr: 'kitabım', en: 'my book' },
    { ar: 'كِتَابُكَ', tl: 'kitâbuke', tr: 'kitabın (erkek)', en: 'your book (m.)' },
    { ar: 'كِتَابُكِ', tl: 'kitâbuki', tr: 'kitabın (kadın)', en: 'your book (f.)' },
    { ar: 'كِتَابُهُ', tl: 'kitâbuhû', tr: 'onun kitabı (erkek)', en: 'his book' },
    { ar: 'كِتَابُهَا', tl: 'kitâbuhâ', tr: 'onun kitabı (kadın)', en: 'her book' },
    { ar: 'كِتَابُنَا', tl: 'kitâbunâ', tr: 'kitabımız', en: 'our book' },
    { ar: 'كِتَابُكُمْ', tl: 'kitâbukum', tr: 'kitabınız', en: 'your book (pl.)' },
    { ar: 'كِتَابُهُمْ', tl: 'kitâbuhum', tr: 'onların kitabı', en: 'their book' },
    { ar: 'سَيَّارَتِي', tl: 'seyyâratî', tr: 'arabam', en: 'my car' },
    { ar: 'عِنْدِي', tl: '‘indî', tr: 'bende (var)', en: 'I have' },
    { ar: 'لِي', tl: 'lî', tr: 'benim (için)', en: 'for me / mine' },
    { ar: 'مَعِي', tl: 'me‘î', tr: 'benimle', en: 'with me' },
    { ar: 'غُرْفَة', tl: 'ğurfe', tr: 'oda', en: 'room' },
    { ar: 'وَقْت', tl: 'vakt', tr: 'vakit, zaman', en: 'time' }
  ],
  acts: [
    { type: 'flash', title: 'Ekli kelimeler', desc: '“Kitabım, kitabın…” biçimlerini kartlarla gör ve dinle.', glyph: 'كِتَابِي' },
    {
      type: 'match', title: 'Eki anlamıyla eşleştir', desc: 'Arapça ekli kelimeyi Türkçe karşılığıyla buluştur.', glyph: 'ـكَ', items: [
        ['كِتَابِي', 'kitabım'], ['كِتَابُكَ', 'kitabın'], ['كِتَابُهُ', 'onun (erkek) kitabı'], ['كِتَابُهَا', 'onun (kadın) kitabı'],
        ['كِتَابُنَا', 'kitabımız'], ['كِتَابُكُمْ', 'kitabınız'], ['كِتَابُهُمْ', 'onların kitabı'], ['سَيَّارَتِي', 'arabam'],
        ['عِنْدِي', 'bende var'], ['مَعَكَ', 'seninle']
      ]
    },
    {
      type: 'fill', title: 'Doğru eki seç', desc: 'Cümlenin anlamına uygun iyelik ekli biçimi yerleştir.', glyph: '___', items: [
        { s: '___ جَدِيدٌ', hint: 'Kitabım yenidir.', options: ['كِتَابِي', 'الْكِتَابِي', 'كِتَابُكَ'], a: 'كِتَابِي', tr: 'Kitabım yenidir.', why: '“-ım” = {{ـِي}}; ال eklenmez.' },
        { s: '___ كَبِيرٌ', hint: 'Onun (erkek) evi büyüktür.', options: ['بَيْتُهُ', 'بَيْتُهَا', 'بَيْتِي'], a: 'بَيْتُهُ', tr: 'Onun evi büyüktür.', why: 'Erkek “onun” = {{ـهُ}}.' },
        { s: '___ جَمِيلَةٌ', hint: 'Arabam güzeldir.', options: ['سَيَّارَتِي', 'سَيَّارَةِي', 'السَّيَّارَتِي'], a: 'سَيَّارَتِي', tr: 'Arabam güzeldir.', why: 'ة → ت: seyyâratî.' },
        { s: '___ كِتَابٌ', hint: 'Bende bir kitap var.', options: ['عِنْدِي', 'كِتَابِي', 'أَنَا'], a: 'عِنْدِي', tr: 'Bende bir kitap var.', why: '“Var” anlamı {{عِنْدِي}} ile kurulur.' },
        { s: '___ فِي الْبَيْتِ', hint: 'Onların (erkek) öğretmeni evde.', options: ['مُعَلِّمُهُمْ', 'مُعَلِّمُهُنَّ', 'مُعَلِّمُنَا'], a: 'مُعَلِّمُهُمْ', tr: 'Onların öğretmeni evde.', why: '“Onların” (erkek/karışık) = {{ـهُمْ}}.' },
        { s: 'سَاعِدْ___', hint: 'Bana yardım et.', options: ['نِي', 'ي', 'كَ'], a: 'نِي', tr: 'Bana yardım et.', why: 'Fiilde “beni/bana” = {{ـنِي}}.' },
        { s: '___ صَغِيرَةٌ', hint: 'Senin (kadına) odan küçüktür.', options: ['غُرْفَتُكِ', 'غُرْفَتُكَ', 'غُرْفَةُكِ'], a: 'غُرْفَتُكِ', tr: 'Odan küçüktür. (kadına)', why: 'Kadına “senin” = {{ـكِ}}; ة → ت.' }
      ]
    },
    {
      type: 'mc', title: 'Türkçeden Arapçaya', desc: 'Türkçe ifadenin Arapça karşılığını bul.', glyph: 'TR→ع', items: [
        { q: '“Şehrimiz”', options: ['مَدِينَتُنَا', 'مَدِينَتِي', 'مَدِينَتُهُمْ', 'الْمَدِينَةُنَا'], a: 'مَدِينَتُنَا', why: '-ımız = {{ـنَا}}; ة → ت.' },
        { q: '“Onun (kadın) okulu”', options: ['مَدْرَسَتُهَا', 'مَدْرَسَتُهُ', 'مَدْرَسَتُكِ', 'مَدْرَسَتِي'], a: 'مَدْرَسَتُهَا', why: 'Kadın “onun” = {{ـهَا}}.' },
        { q: '“Vaktim yok.”', options: ['لَيْسَ عِنْدِي وَقْتٌ', 'وَقْتِي لَيْسَ', 'عِنْدِي وَقْتٌ', 'لِي لَيْسَ'], a: 'لَيْسَ عِنْدِي وَقْتٌ', why: '{{لَيْسَ}} olumsuz yapar: “bende vakit yok”.' },
        { q: '“Seni gördüm.”', options: ['رَأَيْتُكَ', 'رَأَيْتُنِي', 'رَأَيْتُهُ', 'رَأَيْتُ أَنْتَ'], a: 'رَأَيْتُكَ', why: 'Nesne eki fiile bitişir: {{رَأَيْتُ}} + {{ـكَ}}.' },
        { q: '“Benimle gel.”', options: ['تَعَالَ مَعِي', 'تَعَالَ مَعَكَ', 'تَعَالَ لِي', 'تَعَالَ عِنْدِي'], a: 'تَعَالَ مَعِي', why: '{{مَعَ}} (ile) + {{ـِي}} = benimle.' },
        { q: '“Kalemleriniz”', options: ['أَقْلَامُكُمْ', 'أَقْلَامُهُمْ', 'أَقْلَامُنَا', 'قَلَمُكَ'], a: 'أَقْلَامُكُمْ', why: '-ınız = {{ـكُمْ}}; {{أَقْلَام}} kalemler.' }
      ]
    },
    {
      type: 'tf', title: 'Kural kontrolü', desc: 'İyelik eki kuralları hakkında doğru mu, yanlış mı?', glyph: '✓ ✗', items: [
        { s: 'الْبَيْتِي “evim” demektir.', a: false, why: 'Ek alan isme ال gelmez: {{بَيْتِي}}.' },
        { s: 'مَدْرَسَتُهُ kelimesinde ة, ت’ye dönüşmüştür.', a: true, why: 'medrese + hû → medresetuhû.' },
        { s: '“I have a car” Arapçada عِنْدِي سَيَّارَةٌ olabilir.', a: true, why: '“Bende bir araba var.”' },
        { s: 'كِتَابُهَا “onun (erkek) kitabı” demektir.', a: false, why: '{{ـهَا}} dişildir: “her book”.' },
        { s: 'Fiile “beni” anlamı vermek için ـنِي eklenir.', a: true, why: 'Örn. {{يَعْرِفُنِي}} “beni tanıyor”.' },
        { s: 'فِيهُ yazımı doğrudur.', a: false, why: 'Ye’den sonra ötre esreye döner: {{فِيهِ}}.' }
      ]
    },
    {
      type: 'test', title: 'İyelik ekleri testi', desc: 'Dersin tamamı için karma değerlendirme.', glyph: '؟', items: [
        { q: '“Her car” hangisidir?', options: ['سَيَّارَتُهَا', 'سَيَّارَتُهُ', 'سَيَّارَتِي', 'سَيَّارَةُهَا'], a: 'سَيَّارَتُهَا', why: 'Dişil “onun” + ة → ت.' },
        { t: 'order', tr: 'Kitabım yenidir.', w: ['كِتَابِي', 'جَدِيدٌ'] },
        { t: 'order', tr: 'Bende bir kalem var.', w: ['عِنْدِي', 'قَلَمٌ'] },
        { t: 'fill', s: 'هٰذَا ___', hint: 'Bu bizim evimizdir.', options: ['بَيْتُنَا', 'بَيْتُكُمْ', 'الْبَيْتُنَا'], a: 'بَيْتُنَا', tr: 'Bu bizim evimiz.', why: '-ımız = {{ـنَا}}.' },
        { q: '{{عِنْدَهُمْ}} ne demektir?', options: ['onlarda var', 'sende var', 'onların kitabı', 'bizde var'], a: 'onlarda var', why: '{{عِنْدَ}} + {{ـهُمْ}}.' },
        { t: 'tf', s: 'كِتَابُكِ bir kadına söylenir.', a: true, why: '{{ـكِ}} (-ki) dişil “senin”.' },
        { q: '“Our teacher is kind.”', options: ['مُعَلِّمُنَا لَطِيفٌ', 'الْمُعَلِّمُنَا لَطِيفٌ', 'مُعَلِّمُهُ لَطِيفٌ', 'نَحْنُ مُعَلِّمٌ لَطِيفٌ'], a: 'مُعَلِّمُنَا لَطِيفٌ', why: 'Ek + ال yok + haber.' },
        { q: '{{سَاعِدْنِي}} ne demektir?', options: ['Bana yardım et.', 'Ona yardım et.', 'Yardım ettim.', 'Yardımım.'], a: 'Bana yardım et.', why: 'Emir fiili + {{ـنِي}}.' }
      ]
    }
  ]
});
