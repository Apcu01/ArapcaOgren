window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'aile', n: 11, level: 'Başlangıç', glyph: 'أ',
  ar: 'الْأُسْرَةُ', name: 'Aile',
  desc: 'Aile bireyleri, amca–dayı–hala–teyze ayrımı ve iyelik ekleriyle aileni anlatma.',
  long: 'Anne, baba, kardeşler, amca, dayı, hala, teyze… Aile kelimelerini iyelik ekleriyle birlikte kullan: “babam, annesi, kardeşlerim”. أَبٌ ve أَخٌ kelimelerinin özel çekimini öğren.',
  tags: 'aile anne baba kardeş amca dayı hala teyze oğul kız ebeveyn umm ab akh ukht usra',
  readMins: 11,
  intro: 'Aile konusu, İyelik Ekleri dersinde öğrendiklerini kullanmak için en doğal alandır: “babam, annen, kardeşimiz”. Türkçe konuşanlar için güzel bir haber: Arapça da Türkçe gibi <b>amca–dayı</b> ve <b>hala–teyze</b> arasında ayrım yapar; İngilizcede ise hepsi “uncle / aunt”tır.',
  lesson: [
    {
      h: 'Çekirdek aile',
      table: {
        cols: ['Arapça', 'Okunuş', 'Türkçe', 'English'],
        rows: [
          ['أُسْرَةٌ / عَائِلَةٌ', 'usra / ‘âile', 'aile', 'family'],
          ['أَبٌ', 'eb', 'baba', 'father'],
          ['أُمٌّ', 'umm', 'anne', 'mother'],
          ['وَالِدَانِ', 'vâlidân', 'anne-baba (ebeveyn)', 'parents'],
          ['أَخٌ', 'eh', 'erkek kardeş', 'brother'],
          ['أُخْتٌ', 'uht', 'kız kardeş', 'sister'],
          ['اِبْنٌ', 'ibn', 'oğul', 'son'],
          ['بِنْتٌ', 'bint', 'kız (evlat)', 'daughter'],
          ['زَوْجٌ', 'zevc', 'koca, eş', 'husband'],
          ['زَوْجَةٌ', 'zevce', 'karı, eş', 'wife']
        ]
      },
      tips: ['Türkçedeki <b>aile</b> ({{عَائِلَة}}), <b>valide</b> ({{وَالِدَة}} anne), <b>zevce</b> ({{زَوْجَة}}), <b>ümmet</b> ({{أُمَّة}} — {{أُمّ}} ile aynı kök!) kelimeleri buradan. Soyadı olarak kullanılan <b>İbn Sina</b> “Sina’nın oğlu” demektir.']
    },
    {
      h: 'Geniş aile: amca, dayı, hala, teyze',
      p: ['Arapça, baba tarafı ve anne tarafı akrabaları ayırır: {{عَمٌّ}} baba tarafı (amca), {{خَالٌ}} anne tarafı (dayı).'],
      table: {
        cols: ['Arapça', 'Okunuş', 'Türkçe', 'English'],
        rows: [
          ['جَدٌّ', 'cedd', 'dede', 'grandfather'],
          ['جَدَّةٌ', 'cedde', 'nine, büyükanne', 'grandmother'],
          ['عَمٌّ', '‘amm', 'amca', 'uncle (father’s side)'],
          ['عَمَّةٌ', '‘amme', 'hala', 'aunt (father’s side)'],
          ['خَالٌ', 'hâl', 'dayı', 'uncle (mother’s side)'],
          ['خَالَةٌ', 'hâle', 'teyze', 'aunt (mother’s side)'],
          ['اِبْنُ الْعَمِّ', 'ibnu’l-‘amm', 'amcaoğlu (kuzen)', 'cousin'],
          ['حَفِيدٌ', 'hafîd', 'torun', 'grandchild']
        ]
      },
      cmp: {
        tr: 'Türkçe de ayırır: <b>amca / dayı</b>, <b>hala / teyze</b>. Hatta <b>amca</b> kelimesi {{عَمّ}}’dan, <b>hala</b> {{خَالَة}}’dan gelir — ama dikkat: Arapçada {{خَالَة}} anne tarafı, yani <b>teyze</b>dir!',
        en: 'İngilizce ayırmaz: hepsi <b>uncle</b> ya da <b>aunt</b>. Arapça (ve Türkçe) daha kesindir.'
      },
      tips: ['Tuzağa düşme: Türkçe <b>hala</b> kelimesi Arapça {{خَالَة}}’dan gelir ama Arapçada {{خَالَة}} <b>teyze</b> demektir. Türkçedeki halanın Arapçası {{عَمَّة}}’dir. “Kuzen” derken de Arapça hangi taraftan olduğunu söyler: {{اِبْنُ الْخَالِ}} dayıoğlu.']
    },
    {
      h: 'İyelik ekleriyle aile',
      p: ['Aile kelimeleri neredeyse her zaman bir iyelik ekiyle kullanılır. Kurallar aynı: ال düşer, ة → ت.'],
      ex: [
        { ar: 'أُمِّي', tl: 'ummî', tr: 'annem', en: 'my mother' },
        { ar: 'أَبِي', tl: 'ebî', tr: 'babam', en: 'my father' },
        { ar: 'أُخْتُهَا', tl: 'uhtuhâ', tr: 'onun (kadının) kız kardeşi', en: 'her sister' },
        { ar: 'جَدَّتُنَا', tl: 'ceddetunâ', tr: 'büyükannemiz', en: 'our grandmother' },
        { ar: 'خَالَتِي طَبِيبَةٌ', tl: 'hâletî tabîbetun', tr: 'Teyzem doktordur.', en: 'My aunt is a doctor.' },
        { ar: 'عِنْدِي أَخٌ وَأُخْتَانِ', tl: '‘indî ehun ve uhtâni', tr: 'Bir erkek, iki kız kardeşim var.', en: 'I have a brother and two sisters.' }
      ]
    },
    {
      h: 'Özel çekim: أَبٌ ve أَخٌ',
      p: [
        '{{أَبٌ}} (baba) ve {{أَخٌ}} (kardeş) kelimeleri “beş isim” denen özel bir gruptandır. “Benim” ({{ـِي}}) dışındaki eklerle ve tamlamada araya <b>uzun bir ünlü</b> girer: özne olunca {{و}}, nesne olunca {{ا}}, harf-i cerden sonra {{ي}}.',
        'Başlangıçta en sık kullanılan biçimleri ezberlemen yeterli:'
      ],
      table: {
        cols: ['Ek', 'Baba', 'Kardeş'],
        rows: [
          ['benim', 'أَبِي', 'أَخِي'],
          ['senin (özne)', 'أَبُوكَ', 'أَخُوكَ'],
          ['onun (özne)', 'أَبُوهُ', 'أَخُوهُ'],
          ['bizim (özne)', 'أَبُونَا', 'أَخُونَا'],
          ['“…’nın babası”', 'أَبُو بَكْرٍ', 'أَخُو عَلِيٍّ']
        ]
      },
      ex: [
        { ar: 'أَبُوكَ مُعَلِّمٌ', tl: 'ebûke mu‘allimun', tr: 'Baban öğretmendir.', en: 'Your father is a teacher.' },
        { ar: 'رَأَيْتُ أَخَاكَ', tl: 'raeytu ehâke', tr: 'Kardeşini gördüm.', en: 'I saw your brother.', note: 'Nesne olduğu için {{ا}}: {{أَخَاكَ}}.' },
        { ar: 'ذَهَبْتُ مَعَ أَخِيكَ', tl: 'zehebtu me‘a ehîke', tr: 'Kardeşinle gittim.', en: 'I went with your brother.', note: '{{مَعَ}}’den sonra {{ي}}: {{أَخِيكَ}}.' }
      ],
      tips: ['<b>Ebubekir</b> ({{أَبُو بَكْرٍ}}) “Bekir’in babası” demektir. Arap dünyasında insanlara en büyük çocuklarının adıyla “Ebu …” / “Ümmü …” diye hitap etmek (künye) çok yaygındır: {{أَبُو أَحْمَدَ}}، {{أُمُّ عَلِيٍّ}}.']
    },
    {
      h: 'Çoğullar',
      p: ['Aile kelimelerinin çoğulu çoğunlukla düzensizdir (kırık çoğul). En sık kullanılanlar:'],
      table: {
        cols: ['Tekil', 'Çoğul', 'Anlam'],
        rows: [
          ['أَخٌ', 'إِخْوَةٌ', 'erkek kardeşler'],
          ['أُخْتٌ', 'أَخَوَاتٌ', 'kız kardeşler'],
          ['اِبْنٌ', 'أَبْنَاءٌ', 'oğullar, çocuklar'],
          ['بِنْتٌ', 'بَنَاتٌ', 'kızlar'],
          ['أُمٌّ', 'أُمَّهَاتٌ', 'anneler'],
          ['أَبٌ', 'آبَاءٌ', 'babalar']
        ]
      },
      ex: [
        { ar: 'كَمْ أَخًا لَكَ؟', tl: 'kem ehan leke?', tr: 'Kaç erkek kardeşin var?', en: 'How many brothers do you have?' },
        { ar: 'لِي ثَلَاثَةُ إِخْوَةٍ', tl: 'lî selâsetu ihvetin', tr: 'Üç erkek kardeşim var.', en: 'I have three brothers.', note: '{{أَخ}} erkek → ة’li sayı.' }
      ],
      tips: ['Türkçedeki <b>ihvan</b> (kardeşler) ve <b>evlat</b> ({{أَوْلَاد}}, {{وَلَد}} “çocuk”un çoğulu) kelimeleri de kırık çoğuldur. Türkçede “evlatlar” deriz, yani Arapça çoğula bir de Türkçe çoğul eki ekleriz!']
    }
  ],
  keys: [
    'Baba {{أَبٌ}}, anne {{أُمٌّ}}, erkek kardeş {{أَخٌ}}, kız kardeş {{أُخْتٌ}}, oğul {{اِبْنٌ}}, kız {{بِنْتٌ}}.',
    'Baba tarafı {{عَمٌّ}} amca / {{عَمَّةٌ}} hala; anne tarafı {{خَالٌ}} dayı / {{خَالَةٌ}} teyze.',
    'Dikkat: Arapça {{خَالَة}} = teyze (Türkçe “hala” değil!).',
    '{{أَبٌ}} ve {{أَخٌ}} ek alınca uzar: {{أَبُوكَ}}، {{أَخُوهُ}} — ama {{أَبِي}}، {{أَخِي}}.',
    '“Kardeşim var” = {{لِي أَخٌ}} ya da {{عِنْدِي أَخٌ}}.'
  ],
  mistakes: [
    { bad: 'خَالَتِي = halam', good: 'عَمَّتِي = halam', why: 'Babanın kız kardeşi {{عَمَّة}}’dir. {{خَالَة}} annenin kız kardeşi, yani teyzedir.' },
    { bad: 'أَبُكَ', good: 'أَبُوكَ', why: '{{أَب}} “beş isim”dendir; ek alınca araya uzun ünlü girer.' },
    { bad: 'الْأُمِّي', good: 'أُمِّي', why: 'İyelik eki alan isim ال almaz.' }
  ],
  words: [
    { ar: 'أُسْرَة', tl: 'usra', tr: 'aile', en: 'family' },
    { ar: 'أَب', tl: 'eb', tr: 'baba', en: 'father' },
    { ar: 'أُمّ', tl: 'umm', tr: 'anne', en: 'mother' },
    { ar: 'أَخ', tl: 'eh', tr: 'erkek kardeş', en: 'brother' },
    { ar: 'أُخْت', tl: 'uht', tr: 'kız kardeş', en: 'sister' },
    { ar: 'اِبْن', tl: 'ibn', tr: 'oğul', en: 'son' },
    { ar: 'بِنْت', tl: 'bint', tr: 'kız (evlat)', en: 'daughter / girl' },
    { ar: 'جَدّ', tl: 'cedd', tr: 'dede', en: 'grandfather' },
    { ar: 'جَدَّة', tl: 'cedde', tr: 'büyükanne', en: 'grandmother' },
    { ar: 'عَمّ', tl: '‘amm', tr: 'amca', en: 'paternal uncle' },
    { ar: 'عَمَّة', tl: '‘amme', tr: 'hala', en: 'paternal aunt' },
    { ar: 'خَال', tl: 'hâl', tr: 'dayı', en: 'maternal uncle' },
    { ar: 'خَالَة', tl: 'hâle', tr: 'teyze', en: 'maternal aunt' },
    { ar: 'زَوْج', tl: 'zevc', tr: 'koca', en: 'husband' },
    { ar: 'زَوْجَة', tl: 'zevce', tr: 'karı (eş)', en: 'wife' },
    { ar: 'حَفِيد', tl: 'hafîd', tr: 'torun', en: 'grandchild' }
  ],
  acts: [
    { type: 'flash', title: 'Aile kartları', desc: 'Aile bireylerini kartlarla öğren.', glyph: 'أُمّ' },
    {
      type: 'match', title: 'Akrabaları eşleştir', desc: 'Arapça akraba adını Türkçesine bağla.', glyph: 'عَمّ', items: [
        ['أَبٌ', 'baba'], ['أُمٌّ', 'anne'], ['أَخٌ', 'erkek kardeş'], ['أُخْتٌ', 'kız kardeş'], ['جَدٌّ', 'dede'],
        ['عَمٌّ', 'amca'], ['عَمَّةٌ', 'hala'], ['خَالٌ', 'dayı'], ['خَالَةٌ', 'teyze'], ['اِبْنٌ', 'oğul']
      ]
    },
    {
      type: 'mc', title: 'Akrabalık bilmecesi', desc: 'Tanımdan akrabayı bul.', glyph: '؟', items: [
        { q: 'Babamın erkek kardeşi benim…', options: ['عَمِّي', 'خَالِي', 'جَدِّي', 'أَخِي'], a: 'عَمِّي', why: 'Baba tarafı erkek: {{عَمّ}} amca.' },
        { q: 'Annemin kız kardeşi benim…', options: ['خَالَتِي', 'عَمَّتِي', 'أُخْتِي', 'جَدَّتِي'], a: 'خَالَتِي', why: 'Anne tarafı kadın: {{خَالَة}} teyze.' },
        { q: 'Babamın kız kardeşi benim…', options: ['عَمَّتِي', 'خَالَتِي', 'أُمِّي', 'بِنْتِي'], a: 'عَمَّتِي', why: 'Baba tarafı kadın: {{عَمَّة}} hala.' },
        { q: 'Annemin erkek kardeşi benim…', options: ['خَالِي', 'عَمِّي', 'أَبِي', 'جَدِّي'], a: 'خَالِي', why: 'Anne tarafı erkek: {{خَال}} dayı.' },
        { q: 'Babamın babası benim…', options: ['جَدِّي', 'عَمِّي', 'أَبِي', 'خَالِي'], a: 'جَدِّي' },
        { q: 'Oğlumun oğlu benim…', options: ['حَفِيدِي', 'اِبْنِي', 'أَخِي', 'جَدِّي'], a: 'حَفِيدِي' },
        { q: '“Your father is a teacher.”', options: ['أَبُوكَ مُعَلِّمٌ', 'أَبُكَ مُعَلِّمٌ', 'أَبِي مُعَلِّمٌ', 'الْأَبُكَ مُعَلِّمٌ'], a: 'أَبُوكَ مُعَلِّمٌ', why: '{{أَب}} + {{ـكَ}} özne → {{أَبُوكَ}}.' }
      ]
    },
    {
      type: 'fill', title: 'Aileni anlat', desc: 'Doğru iyelik ekli biçimi yerleştir.', glyph: '___', items: [
        { s: '___ طَبِيبَةٌ', hint: 'Annem doktordur.', options: ['أُمِّي', 'الْأُمُّ', 'أُمُّكَ'], a: 'أُمِّي', tr: 'Annem doktordur.' },
        { s: '___ مُهَنْدِسٌ', hint: 'Babası (erkeğin) mühendistir.', options: ['أَبُوهُ', 'أَبُهُ', 'أَبُوهَا'], a: 'أَبُوهُ', tr: 'Babası mühendistir.', why: '{{أَب}} + {{ـهُ}} → {{أَبُوهُ}}.' },
        { s: 'عِنْدِي ___', hint: 'İki kız kardeşim var.', options: ['أُخْتَانِ', 'أَخَوَاتٌ', 'أُخْتٌ'], a: 'أُخْتَانِ', tr: 'İki kız kardeşim var.', why: 'İki = ikil eki: {{أُخْتَانِ}}.' },
        { s: 'لِي ثَلَاثَةُ ___', hint: 'Üç erkek kardeşim var.', options: ['إِخْوَةٍ', 'أَخٍ', 'إِخْوَةٌ'], a: 'إِخْوَةٍ', tr: 'Üç erkek kardeşim var.', why: '3–10: çoğul ve esreli.' },
        { s: '___ فِي الْبَيْتِ', hint: 'Büyükannemiz evde.', options: ['جَدَّتُنَا', 'جَدَّةُنَا', 'الْجَدَّتُنَا'], a: 'جَدَّتُنَا', tr: 'Büyükannemiz evde.', why: 'ة → ت.' },
        { s: 'هٰذَا ___', hint: 'Bu benim dayım.', options: ['خَالِي', 'عَمِّي', 'خَالَتِي'], a: 'خَالِي', tr: 'Bu benim dayım.' }
      ]
    },
    {
      type: 'order', title: 'Aile cümleleri', desc: 'Kelimeleri dizerek aileni anlat.', glyph: 'لِي…', items: [
        { tr: 'Teyzem doktordur.', w: ['خَالَتِي', 'طَبِيبَةٌ'] },
        { tr: 'Bir erkek kardeşim var.', w: ['لِي', 'أَخٌ'] },
        { tr: 'Bu benim babam.', w: ['هٰذَا', 'أَبِي'] },
        { tr: 'Annem ve babam evde.', w: ['أُمِّي', 'وَأَبِي', 'فِي', 'الْبَيْتِ'] },
        { tr: 'Kaç kardeşin var?', w: ['كَمْ', 'أَخًا', 'لَكَ؟'] }
      ]
    },
    {
      type: 'test', title: 'Aile testi', desc: 'Karma değerlendirme.', glyph: '؟', items: [
        { q: '{{خَالَةٌ}} kimdir?', options: ['teyze', 'hala', 'nine', 'kız kardeş'], a: 'teyze' },
        { q: '“Grandfather” hangisidir?', options: ['جَدٌّ', 'عَمٌّ', 'أَبٌ', 'حَفِيدٌ'], a: 'جَدٌّ' },
        { t: 'tf', s: 'Arapçada amca ve dayı için aynı kelime kullanılır.', a: false, why: 'Amca {{عَمّ}}, dayı {{خَال}}.' },
        { t: 'tf', s: 'أَبُو بَكْرٍ “Bekir’in babası” demektir.', a: true },
        { t: 'fill', s: '___ صَغِيرَةٌ', hint: 'Kız kardeşim küçüktür.', options: ['أُخْتِي', 'أَخِي', 'الْأُخْتِي'], a: 'أُخْتِي', tr: 'Kız kardeşim küçüktür.' },
        { q: '{{بَنَاتٌ}} kelimesinin tekili?', options: ['بِنْتٌ', 'اِبْنٌ', 'بَيْتٌ', 'أُخْتٌ'], a: 'بِنْتٌ' },
        { t: 'order', tr: 'Amcam öğretmendir.', w: ['عَمِّي', 'مُعَلِّمٌ'] },
        { q: '“Our grandmother” hangisidir?', options: ['جَدَّتُنَا', 'جَدُّنَا', 'جَدَّتُكُمْ', 'جَدَّتِي'], a: 'جَدَّتُنَا' }
      ]
    }
  ]
});
