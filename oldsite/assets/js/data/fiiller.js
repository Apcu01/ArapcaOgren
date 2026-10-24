window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'fiiller', n: 11, level: 'Orta', glyph: 'ف',
  ar: 'الْأَفْعَالُ', name: 'Fiiller',
  desc: 'Kök sistemi, mazi (geçmiş) ve muzari (şimdiki/geniş) çekimi, olumsuzluk ve gelecek zaman.',
  long: 'Arapçanın kalbi olan üç harfli kök sistemini, كَتَبَ fiili üzerinden mazi ve muzari çekimlerini, olumsuz yapmayı ve gelecek zamanı öğren.',
  tags: 'fiil çekim mazi muzari geçmiş zaman şimdiki zaman gelecek kök kataba yaktubu olumsuz lam la sa sawfa',
  readMins: 18,
  intro: 'Arapça kelimelerin büyük çoğunluğu <b>üç harfli bir kökten</b> türer. Kök anlamı taşır, kalıplar (vezinler) ise ona görev verir. Fiillerde iki temel zaman vardır: <b>mazi</b> (geçmiş: “yazdı”) ve <b>muzari</b> (şimdiki/geniş: “yazıyor, yazar”). Mazide kişi <b>sona</b> eklenir, muzaride <b>başa</b>. Bu iki kuralı kavrayınca binlerce fiili çekimleyebilirsin.',
  lesson: [
    {
      h: 'Kök sistemi: üç harf, yüzlerce kelime',
      p: [
        'ك-ت-ب kökü “yazmak” anlamını taşır. Aynı köke farklı kalıplar giydirilince yeni kelimeler doğar. Bunların çoğunu Türkçeden zaten tanıyorsun:'
      ],
      table: {
        cols: ['Kelime', 'Kalıp', 'Anlam', 'Türkçede'],
        rows: [
          ['كَتَبَ', 'فَعَلَ', 'yazdı', '—'],
          ['كِتَابٌ', 'فِعَالٌ', 'kitap (yazılan şey)', 'kitap'],
          ['كَاتِبٌ', 'فَاعِلٌ', 'yazan, yazar', 'kâtip'],
          ['مَكْتُوبٌ', 'مَفْعُولٌ', 'yazılmış', 'mektup'],
          ['مَكْتَبٌ', 'مَفْعَلٌ', 'yazı yeri: büro, masa', 'mektep (okul)'],
          ['مَكْتَبَةٌ', 'مَفْعَلَةٌ', 'kütüphane, kırtasiye', '—']
        ]
      },
      tips: [
        'Kalıplar her kökte aynı işi görür: {{فَاعِل}} = “yapan” (kâtip, <b>hâkim</b>, <b>âlim</b>, <b>tâlib</b>), {{مَفْعُول}} = “yapılmış” (mektup, <b>mahkûm</b>, <b>malum</b>, <b>meçhul</b>). Türkçeden bildiğin Arapça kelimelerde kökü ve kalıbı aramaya başla!',
        'Sözlükler kelimeleri kökün harflerine göre sıralar; {{مَكْتَبَةٌ}} kelimesini ك maddesinde ararsın.'
      ]
    },
    {
      h: 'Mazi (geçmiş zaman): ekler sonda',
      p: [
        'Fiilin en yalın hali mazinin “o (erkek)” biçimidir: {{كَتَبَ}} “(o) yazdı”. Sözlükler fiilleri bu biçimle verir. Diğer kişiler için sona ekler gelir:'
      ],
      table: {
        cols: ['Zamir', 'Fiil', 'Okunuş', 'Türkçe'],
        rows: [
          ['أَنَا', 'كَتَبْتُ', 'ketebtu', 'yazdım'],
          ['أَنْتَ', 'كَتَبْتَ', 'ketebte', 'yazdın (erkek)'],
          ['أَنْتِ', 'كَتَبْتِ', 'ketebti', 'yazdın (kadın)'],
          ['هُوَ', 'كَتَبَ', 'ketebe', 'yazdı'],
          ['هِيَ', 'كَتَبَتْ', 'ketebet', 'yazdı (kadın)'],
          ['نَحْنُ', 'كَتَبْنَا', 'ketebnâ', 'yazdık'],
          ['أَنْتُمْ', 'كَتَبْتُمْ', 'ketebtum', 'yazdınız'],
          ['أَنْتُنَّ', 'كَتَبْتُنَّ', 'ketebtunne', 'yazdınız (kadınlar)'],
          ['هُمْ', 'كَتَبُوا', 'ketebû', 'yazdılar'],
          ['هُنَّ', 'كَتَبْنَ', 'ketebne', 'yazdılar (kadınlar)'],
          ['أَنْتُمَا', 'كَتَبْتُمَا', 'ketebtumâ', 'ikiniz yazdınız'],
          ['هُمَا', 'كَتَبَا', 'ketebâ', 'ikisi yazdı']
        ]
      },
      cmp: {
        tr: 'Türkçe de kişiyi <b>sona</b> ekler: yaz-dı-<b>m</b>, yaz-dı-<b>n</b>, yaz-dı-<b>k</b>. Arapça mazi buna çok benzer: ketebt-<b>u</b>, ketebt-<b>e</b>, keteb-<b>nâ</b>.',
        en: 'İngilizce özne zamirini ayrıca söyler: <b>I</b> wrote, <b>you</b> wrote. Arapçada ek kişiyi gösterdiği için zamir genelde söylenmez: {{كَتَبْتُ}} tek başına “yazdım”dır.'
      },
      tips: ['Eklerdeki zamir izlerine bak: <b>-tu</b> ben, <b>-te/-ti</b> sen, <b>-nâ</b> biz (iyelik eki de {{ـنَا}}!), <b>-tum</b> siz ({{أَنْتُمْ}}), <b>-û</b> onlar. {{كَتَبُوا}}’daki son elif okunmaz; sadece yazımda bulunur.']
    },
    {
      h: 'Muzari (şimdiki / geniş zaman): ekler başta',
      p: [
        'Muzari hem “yazıyor” hem “yazar” anlamına gelir. Kişi, fiilin <b>başına</b> gelen harfle gösterilir: {{أَ}} ben, {{تَ}} sen/o (kadın), {{يَ}} o (erkek), {{نَ}} biz. Çoğullarda sona da ek gelir.'
      ],
      table: {
        cols: ['Zamir', 'Fiil', 'Okunuş', 'Türkçe'],
        rows: [
          ['أَنَا', 'أَكْتُبُ', 'ektubu', 'yazıyorum / yazarım'],
          ['أَنْتَ', 'تَكْتُبُ', 'tektubu', 'yazıyorsun (erkek)'],
          ['أَنْتِ', 'تَكْتُبِينَ', 'tektubîne', 'yazıyorsun (kadın)'],
          ['هُوَ', 'يَكْتُبُ', 'yektubu', 'yazıyor'],
          ['هِيَ', 'تَكْتُبُ', 'tektubu', 'yazıyor (kadın)'],
          ['نَحْنُ', 'نَكْتُبُ', 'nektubu', 'yazıyoruz'],
          ['أَنْتُمْ', 'تَكْتُبُونَ', 'tektubûne', 'yazıyorsunuz'],
          ['أَنْتُنَّ', 'تَكْتُبْنَ', 'tektubne', 'yazıyorsunuz (kadınlar)'],
          ['هُمْ', 'يَكْتُبُونَ', 'yektubûne', 'yazıyorlar'],
          ['هُنَّ', 'يَكْتُبْنَ', 'yektubne', 'yazıyorlar (kadınlar)'],
          ['أَنْتُمَا', 'تَكْتُبَانِ', 'tektubâni', 'ikiniz yazıyorsunuz'],
          ['هُمَا', 'يَكْتُبَانِ', 'yektubâni', 'ikisi yazıyor']
        ]
      },
      tips: [
        'Ön ekleri <b>“e-ne-y-t”</b> diye ezberle: {{أَ}} ben, {{نَ}} biz, {{يَ}} o (erkek) ve onlar, {{تَ}} sen ve o (kadın). Klasik gramerde bu harfler {{أَنَيْتُ}} kelimesiyle ezberletilir.',
        '“Sen (erkek)” ve “o (kadın)” muzaride <b>aynıdır</b>: {{تَكْتُبُ}}. Hangisi olduğunu bağlamdan anlarsın.'
      ]
    },
    {
      h: 'Muzarinin ünlüsü değişir',
      p: [
        'Muzaride kökün orta harfinin harekesi fiilden fiile değişir: <b>u</b>, <b>i</b> ya da <b>a</b>. Bu yüzden fiiller hep iki biçimiyle öğrenilir: mazi + muzari. Sözlüklerde de böyle verilir.'
      ],
      table: {
        cols: ['Mazi', 'Muzari', 'Anlam', 'Ünlü'],
        rows: [
          ['كَتَبَ', 'يَكْتُبُ', 'yazmak', 'u'],
          ['دَرَسَ', 'يَدْرُسُ', 'ders çalışmak', 'u'],
          ['دَخَلَ', 'يَدْخُلُ', 'girmek', 'u'],
          ['خَرَجَ', 'يَخْرُجُ', 'çıkmak', 'u'],
          ['جَلَسَ', 'يَجْلِسُ', 'oturmak', 'i'],
          ['ذَهَبَ', 'يَذْهَبُ', 'gitmek', 'a'],
          ['فَتَحَ', 'يَفْتَحُ', 'açmak', 'a'],
          ['شَرِبَ', 'يَشْرَبُ', 'içmek', 'a'],
          ['فَهِمَ', 'يَفْهَمُ', 'anlamak', 'a'],
          ['سَمِعَ', 'يَسْمَعُ', 'duymak, dinlemek', 'a'],
          ['عَمِلَ', 'يَعْمَلُ', 'çalışmak (iş)', 'a'],
          ['قَرَأَ', 'يَقْرَأُ', 'okumak', 'a']
        ]
      },
      ex: [
        { ar: 'أَذْهَبُ إِلَى الْمَدْرَسَةِ', tl: 'ezhebu ile’l-medrese', tr: 'Okula gidiyorum.', en: 'I go to school.' },
        { ar: 'ذَهَبْنَا إِلَى السُّوقِ', tl: 'zehebnâ ile’s-sûk', tr: 'Çarşıya gittik.', en: 'We went to the market.' },
        { ar: 'تَشْرَبُ الشَّايَ', tl: 'teşrabu’ş-şây', tr: 'Çay içiyorsun. / O (kadın) çay içiyor.', en: 'You drink tea. / She drinks tea.' },
        { ar: 'هَلْ فَهِمْتَ الدَّرْسَ؟', tl: 'hel fehimte’d-ders?', tr: 'Dersi anladın mı?', en: 'Did you understand the lesson?' }
      ]
    },
    {
      h: 'Olumsuz: مَا، لَا، لَمْ',
      p: [
        '<b>Muzari</b> olumsuzu: {{لَا}} + muzari: {{لَا أَفْهَمُ}} “Anlamıyorum.”',
        '<b>Geçmiş</b> olumsuzu iki yolla yapılır: {{مَا}} + mazi ({{مَا كَتَبْتُ}} “yazmadım”) ya da daha yaygın ve resmî olan {{لَمْ}} + muzarinin cezmli hali ({{لَمْ أَكْتُبْ}} “yazmadım”). {{لَمْ}} sonrasında son hareke cezme döner.'
      ],
      ex: [
        { ar: 'لَا أَفْهَمُ', tl: 'lâ efhemu', tr: 'Anlamıyorum.', en: 'I don’t understand.' },
        { ar: 'لَا يَشْرَبُ الْقَهْوَةَ', tl: 'lâ yeşrabu’l-kahve', tr: 'Kahve içmez.', en: 'He doesn’t drink coffee.' },
        { ar: 'مَا ذَهَبْتُ', tl: 'mâ zehebtu', tr: 'Gitmedim.', en: 'I didn’t go.' },
        { ar: 'لَمْ أَذْهَبْ', tl: 'lem ezheb', tr: 'Gitmedim.', en: 'I didn’t go.' }
      ],
      tips: ['{{لَمْ}} + <b>muzari</b> = <b>geçmiş</b> anlam! Biçim muzari ama anlam mazidir. Bu, öğrencilerin en çok şaşırdığı noktalardan biridir: {{لَمْ يَكْتُبْ}} “yazmadı”.']
    },
    {
      h: 'Gelecek zaman: سَـ ve سَوْفَ',
      p: [
        'Muzarinin başına {{سَـ}} (yakın gelecek) ya da {{سَوْفَ}} (gelecek) getirilir: {{سَأَكْتُبُ}} “yazacağım”. Olumsuzu {{لَنْ}} + muzari (son hareke üstün): {{لَنْ أَكْتُبَ}} “yazmayacağım”.'
      ],
      ex: [
        { ar: 'سَأَذْهَبُ غَدًا', tl: 'se-ezhebu ğaden', tr: 'Yarın gideceğim.', en: 'I will go tomorrow.' },
        { ar: 'سَوْفَ نَدْرُسُ الْعَرَبِيَّةَ', tl: 'sevfe nedrusu’l-‘arabiyye', tr: 'Arapça çalışacağız.', en: 'We will study Arabic.' },
        { ar: 'لَنْ أَنْسَاكَ', tl: 'len ensâke', tr: 'Seni unutmayacağım.', en: 'I will not forget you.' }
      ],
      cmp: { tr: 'Türkçe geleceği ek ile yapar: yaz-<b>acağ</b>-ım.', en: 'İngilizce <b>will</b> kullanır: I <b>will</b> write. {{سَـ}}, “will”in Arapça karşılığı gibidir.' }
    },
    {
      h: 'Cümlede fiil: fiil önce gelir',
      p: [
        'Arapçada en doğal sıra <b>fiil – özne – nesne</b>’dir: {{كَتَبَ الطَّالِبُ الدَّرْسَ}} “Öğrenci dersi yazdı.”',
        'Önemli kural: fiil, özneden <b>önce</b> gelince özne çoğul olsa bile fiil <b>tekil</b> kalır (sadece cinsiyete uyar): {{ذَهَبَ الطُّلَّابُ}} “Öğrenciler gitti.”, {{ذَهَبَتِ الطَّالِبَاتُ}} “Kız öğrenciler gitti.”'
      ],
      ex: [
        { ar: 'كَتَبَ الطَّالِبُ الدَّرْسَ', tl: 'ketebe’t-tâlibu’d-ders', tr: 'Öğrenci dersi yazdı.', en: 'The student wrote the lesson.' },
        { ar: 'ذَهَبَ الطُّلَّابُ إِلَى الْمَدْرَسَةِ', tl: 'zehebe’t-tullâbu ile’l-medrese', tr: 'Öğrenciler okula gitti.', en: 'The students went to school.' },
        { ar: 'تَقْرَأُ فَاطِمَةُ كِتَابًا', tl: 'takra’u Fâtımetu kitâben', tr: 'Fatma bir kitap okuyor.', en: 'Fatima is reading a book.' }
      ],
      cmp: { tr: 'Türkçede fiil <b>sonda</b>dır: Öğrenci dersi <b>yazdı</b>.', en: 'İngilizcede ortadadır: The student <b>wrote</b> the lesson. Arapçada başta.' }
    }
  ],
  keys: [
    'Kelimeler üç harfli kökten türer: ك-ت-ب → {{كِتَاب}}، {{كَاتِب}}، {{مَكْتُوب}}، {{مَكْتَب}}.',
    'Mazide kişi sonda: {{كَتَبْتُ}} yazdım, {{كَتَبْنَا}} yazdık, {{كَتَبُوا}} yazdılar.',
    'Muzaride kişi başta: {{أَكْتُبُ}}، {{تَكْتُبُ}}، {{يَكْتُبُ}}، {{نَكْتُبُ}} (e-ne-y-t).',
    'Olumsuz: {{لَا}} + muzari; geçmiş için {{مَا}} + mazi ya da {{لَمْ}} + muzari.',
    'Gelecek: {{سَـ}} / {{سَوْفَ}} + muzari; olumsuzu {{لَنْ}}.',
    'Fiil başta gelince çoğul özneye rağmen tekil kalır: {{ذَهَبَ الطُّلَّابُ}}.'
  ],
  mistakes: [
    { bad: 'أَنَا كَتَبَ', good: 'أَنَا كَتَبْتُ', why: 'Fiil kişiye göre çekimlenir; “ben” için {{كَتَبْتُ}}.' },
    { bad: 'ذَهَبُوا الطُّلَّابُ', good: 'ذَهَبَ الطُّلَّابُ', why: 'Fiil özneden önceyse tekil kalır.' },
    { bad: 'لَا ذَهَبْتُ (gitmedim)', good: 'لَمْ أَذْهَبْ', why: 'Geçmiş olumsuzu {{لَمْ}} + muzari ya da {{مَا}} + mazi ile yapılır.' },
    { bad: 'يَكْتُبُ (o kadın yazıyor)', good: 'تَكْتُبُ', why: '“O (kadın)” muzaride {{تَ}} ile başlar.' }
  ],
  words: [
    { ar: 'كَتَبَ يَكْتُبُ', tl: 'ketebe yektubu', tr: 'yazmak', en: 'to write' },
    { ar: 'ذَهَبَ يَذْهَبُ', tl: 'zehebe yezhebu', tr: 'gitmek', en: 'to go' },
    { ar: 'جَلَسَ يَجْلِسُ', tl: 'celese yeclisu', tr: 'oturmak', en: 'to sit' },
    { ar: 'دَرَسَ يَدْرُسُ', tl: 'derese yedrusu', tr: 'ders çalışmak', en: 'to study' },
    { ar: 'قَرَأَ يَقْرَأُ', tl: 'karae yakra’u', tr: 'okumak', en: 'to read' },
    { ar: 'شَرِبَ يَشْرَبُ', tl: 'şeribe yeşrabu', tr: 'içmek', en: 'to drink' },
    { ar: 'أَكَلَ يَأْكُلُ', tl: 'ekele ye’kulu', tr: 'yemek', en: 'to eat' },
    { ar: 'فَتَحَ يَفْتَحُ', tl: 'fetaha yeftehu', tr: 'açmak', en: 'to open' },
    { ar: 'دَخَلَ يَدْخُلُ', tl: 'dehale yedhulu', tr: 'girmek', en: 'to enter' },
    { ar: 'خَرَجَ يَخْرُجُ', tl: 'harace yahrucu', tr: 'çıkmak', en: 'to go out' },
    { ar: 'سَمِعَ يَسْمَعُ', tl: 'semi‘a yesme‘u', tr: 'duymak', en: 'to hear' },
    { ar: 'فَهِمَ يَفْهَمُ', tl: 'fehime yefhemu', tr: 'anlamak', en: 'to understand' },
    { ar: 'عَمِلَ يَعْمَلُ', tl: '‘amile ya‘melu', tr: 'çalışmak (iş)', en: 'to work' },
    { ar: 'كَاتِب', tl: 'kâtib', tr: 'yazar, kâtip', en: 'writer' },
    { ar: 'مَكْتَبَة', tl: 'mektebe', tr: 'kütüphane', en: 'library' }
  ],
  acts: [
    { type: 'flash', title: 'Sık fiiller', desc: 'Mazi ve muzari biçimleriyle birlikte sık kullanılan fiiller.', glyph: 'كَتَبَ' },
    {
      type: 'match', title: 'Mazi çekimi', desc: 'Çekimli fiili Türkçe anlamıyla eşleştir.', glyph: 'ـتُ', items: [
        ['كَتَبْتُ', 'yazdım'], ['كَتَبْتَ', 'yazdın'], ['كَتَبَ', 'yazdı (erkek)'], ['كَتَبَتْ', 'yazdı (kadın)'], ['كَتَبْنَا', 'yazdık'],
        ['كَتَبْتُمْ', 'yazdınız'], ['كَتَبُوا', 'yazdılar'], ['ذَهَبْتُ', 'gittim'], ['ذَهَبْنَا', 'gittik'], ['ذَهَبُوا', 'gittiler']
      ]
    },
    {
      type: 'match', title: 'Muzari çekimi', desc: 'Şimdiki zaman çekimlerini eşleştir.', glyph: 'يَـ', items: [
        ['أَكْتُبُ', 'yazıyorum'], ['نَكْتُبُ', 'yazıyoruz'], ['يَكْتُبُ', 'yazıyor (erkek)'], ['تَكْتُبِينَ', 'yazıyorsun (kadın)'], ['يَكْتُبُونَ', 'yazıyorlar'],
        ['أَشْرَبُ', 'içiyorum'], ['نَذْهَبُ', 'gidiyoruz'], ['يَفْهَمُ', 'anlıyor'], ['تَدْرُسُونَ', 'ders çalışıyorsunuz'], ['أَقْرَأُ', 'okuyorum']
      ]
    },
    {
      type: 'fill', title: 'Doğru çekimi seç', desc: 'Zamire ve zamana uygun fiil biçimini yerleştir.', glyph: '___', items: [
        { s: 'أَنَا ___ الدَّرْسَ', hint: 'Dersi yazdım.', options: ['كَتَبْتُ', 'كَتَبَ', 'أَكْتُبُ'], a: 'كَتَبْتُ', tr: 'Ben dersi yazdım.', why: 'Mazi + ben = {{ـْتُ}}.' },
        { s: 'نَحْنُ ___ إِلَى الْمَدْرَسَةِ', hint: 'Okula gidiyoruz.', options: ['نَذْهَبُ', 'ذَهَبْنَا', 'يَذْهَبُ'], a: 'نَذْهَبُ', tr: 'Okula gidiyoruz.', why: 'Muzari + biz = {{نَـ}}.' },
        { s: 'هِيَ ___ الشَّايَ', hint: 'Çay içiyor.', options: ['تَشْرَبُ', 'يَشْرَبُ', 'أَشْرَبُ'], a: 'تَشْرَبُ', tr: 'O (kadın) çay içiyor.', why: 'O (kadın) muzari = {{تَـ}}.' },
        { s: 'هُمْ ___ كِتَابًا', hint: 'Bir kitap okudular.', options: ['قَرَؤُوا', 'قَرَأَ', 'يَقْرَأُ'], a: 'قَرَؤُوا', tr: 'Onlar bir kitap okudular.', why: 'Mazi + onlar = {{ـُوا}}. (Hemze vav üstünde yazılır.)' },
        { s: '___ أَفْهَمُ', hint: 'Anlamıyorum.', options: ['لَا', 'لَمْ', 'لَنْ'], a: 'لَا', tr: 'Anlamıyorum.', why: 'Şimdiki zaman olumsuzu: {{لَا}}.' },
        { s: '___ أَذْهَبْ أَمْسِ', hint: 'Dün gitmedim.', options: ['لَمْ', 'لَا', 'لَنْ'], a: 'لَمْ', tr: 'Dün gitmedim.', why: '{{لَمْ}} + cezmli muzari = geçmiş olumsuz.' },
        { s: '___ أَدْرُسُ غَدًا', hint: 'Yarın ders çalışacağım.', options: ['سَوْفَ', 'لَمْ', 'مَا'], a: 'سَوْفَ', tr: 'Yarın ders çalışacağım.', why: 'Gelecek: {{سَوْفَ}} + muzari.' },
        { s: '___ الطُّلَّابُ', hint: 'Öğrenciler gitti.', options: ['ذَهَبَ', 'ذَهَبُوا', 'ذَهَبَتْ'], a: 'ذَهَبَ', tr: 'Öğrenciler gitti.', why: 'Fiil özneden önce → tekil.' }
      ]
    },
    {
      type: 'mc', title: 'Kök avı', desc: 'Kelimenin kökünü ve anlamını bul.', glyph: 'ك ت ب', items: [
        { q: '{{مَكْتَبَةٌ}} kelimesinin kökü hangisidir?', options: ['ك-ت-ب', 'م-ك-ت', 'ت-ب-ة', 'ك-ب-ر'], a: 'ك-ت-ب', why: '{{مَـ}} ve {{ـَةٌ}} kalıbın parçasıdır; kök ك-ت-ب.' },
        { q: '{{دَرَسَ}} “ders çalıştı” ise {{مَدْرَسَةٌ}} ne demektir?', options: ['okul (ders yeri)', 'öğretmen', 'ders kitabı', 'çalışkan'], a: 'okul (ders yeri)', why: '{{مَفْعَلَة}} kalıbı yer bildirir: ders yeri = okul (medrese).' },
        { q: '{{دَرَسَ}} kökünden “ders veren, öğretmen” anlamında {{مُدَرِّسٌ}} vardır. {{دَارِسٌ}} ne olabilir?', options: ['ders çalışan', 'okul', 'ders', 'çalışılmış'], a: 'ders çalışan', why: '{{فَاعِل}} kalıbı = yapan.' },
        { q: '{{عَلِمَ}} “bildi” ise {{عَالِمٌ}} ne demektir?', options: ['bilen, âlim', 'bilinen', 'bilgi', 'okul'], a: 'bilen, âlim', why: '{{فَاعِل}} = yapan: âlim.' },
        { q: '{{عَلِمَ}} “bildi” ise {{مَعْلُومٌ}} ne demektir?', options: ['bilinen, malum', 'bilen', 'öğretmen', 'bilim'], a: 'bilinen, malum', why: '{{مَفْعُول}} = yapılmış: malum.' },
        { q: '{{دَخَلَ}} “girdi”, {{خَرَجَ}} “çıktı”. Türkçedeki “mahreç” (çıkış yeri) hangi köktendir?', options: ['خ-ر-ج', 'د-خ-ل', 'م-ح-ر', 'ح-ر-ج'], a: 'خ-ر-ج', why: '{{مَخْرَج}} = çıkış yeri.' }
      ]
    },
    {
      type: 'order', title: 'Fiil cümlesi kur', desc: 'Fiil başta olacak şekilde cümleleri diz.', glyph: 'فَعَلَ…', items: [
        { tr: 'Öğrenci dersi yazdı.', w: ['كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { tr: 'Okula gidiyorum.', w: ['أَذْهَبُ', 'إِلَى', 'الْمَدْرَسَةِ'] },
        { tr: 'Anlamıyorum.', w: ['لَا', 'أَفْهَمُ'] },
        { tr: 'Yarın gideceğim.', w: ['سَأَذْهَبُ', 'غَدًا'] },
        { tr: 'Dersi anladın mı?', w: ['هَلْ', 'فَهِمْتَ', 'الدَّرْسَ؟'] },
        { tr: 'Fatma bir kitap okuyor.', w: ['تَقْرَأُ', 'فَاطِمَةُ', 'كِتَابًا'] }
      ]
    },
    {
      type: 'test', title: 'Fiiller testi', desc: 'Kök, mazi, muzari ve olumsuzluk için karma test.', glyph: '؟', items: [
        { q: '{{شَرِبْنَا}} ne demektir?', options: ['içtik', 'içiyoruz', 'içtiler', 'içeceğiz'], a: 'içtik', why: 'Mazi + {{ـنَا}} = biz.' },
        { q: '{{يَدْرُسُونَ}} ne demektir?', options: ['ders çalışıyorlar', 'ders çalıştılar', 'ders çalışıyoruz', 'ders çalışacak'], a: 'ders çalışıyorlar' },
        { q: '“Yazacağım” hangisidir?', options: ['سَأَكْتُبُ', 'كَتَبْتُ', 'لَمْ أَكْتُبْ', 'أَكْتُبُ'], a: 'سَأَكْتُبُ' },
        { t: 'tf', s: 'لَمْ يَذْهَبْ “gitmedi” anlamına gelir.', a: true, why: '{{لَمْ}} + muzari = geçmiş olumsuz.' },
        { t: 'tf', s: 'Muzari zamanda kişi eki fiilin sonuna gelir.', a: false, why: 'Başa gelir: {{أَ}}، {{تَ}}، {{يَ}}، {{نَ}}.' },
        { t: 'fill', s: 'أَنْتِ ___ جَيِّدًا', hint: 'İyi yazıyorsun. (kadına)', options: ['تَكْتُبِينَ', 'تَكْتُبُ', 'كَتَبْتَ'], a: 'تَكْتُبِينَ', tr: 'İyi yazıyorsun.', why: 'Kadına “sen” muzari: {{تَـ...ـِينَ}}.' },
        { t: 'order', tr: 'Öğrenciler sınıfa girdi.', w: ['دَخَلَ', 'الطُّلَّابُ', 'الْفَصْلَ'] },
        { q: '{{كَاتِبٌ}} kelimesi hangi kalıptadır?', options: ['فَاعِلٌ (yapan)', 'مَفْعُولٌ (yapılmış)', 'مَفْعَلٌ (yer)', 'فِعَالٌ'], a: 'فَاعِلٌ (yapan)' }
      ]
    }
  ]
});
