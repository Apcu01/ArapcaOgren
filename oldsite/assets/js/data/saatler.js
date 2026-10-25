window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'saatler', n: 9, level: 'Başlangıç', glyph: 'س',
  ar: 'السَّاعَةُ', name: 'Saatler',
  desc: 'Saati sormak ve söylemek: tam saat, buçuk, çeyrek, dakika ve günün vakitleri.',
  long: 'Arapçada saati sormayı ve söylemeyi öğren: tam saatler, buçuk, çeyrek geçe ve çeyrek kala, dakikalar, sabah–akşam ve “saat kaçta?” sorusu.',
  tags: 'saat kaç buçuk çeyrek dakika sabah akşam saa sāʿa nisf rub illa',
  readMins: 14,
  intro: 'Arapçada saat söylemenin sırrı şudur: saatler <b>sıra sayılarıyla</b> söylenir. “Saat üç” demek için Arapça <em>“üçüncü saat”</em> der: {{السَّاعَةُ الثَّالِثَةُ}}. {{سَاعَة}} dişil olduğu için sıra sayıları da dişil biçimdedir. Bunun üstüne buçuk, çeyrek ve dakikaları eklemek çok kolay.',
  lesson: [
    {
      h: 'Saat kaç?',
      p: [
        'Saati sormak için: {{كَمِ السَّاعَةُ؟}} <em>kemi’s-sâ‘atu?</em> — kelime kelime “saat kaç?”.',
        'Cevap {{السَّاعَةُ}} ile başlar ve ardından sıra sayısı gelir: {{السَّاعَةُ الثَّالِثَةُ}} “Saat üç.”'
      ],
      ex: [
        { ar: 'كَمِ السَّاعَةُ؟', tl: 'kemi’s-sâ‘atu?', tr: 'Saat kaç?', en: 'What time is it?' },
        { ar: 'السَّاعَةُ الثَّالِثَةُ', tl: 'es-sâ‘atu’s-sâliseh', tr: 'Saat üç.', en: 'It’s three o’clock.' }
      ],
      tips: ['{{كَمْ}} kelimesinin sonundaki cezm, {{السَّاعَةُ}}’ya bağlanırken <b>esreye</b> döner: <em>kem</em> → <em>kemi’s-sâ‘a</em>. İki sakin harf yan yana gelemediği için araya “i” sesi girer.']
    },
    {
      h: 'Tam saatler: dişil sıra sayıları',
      p: ['Saat {{سَاعَة}} dişil bir isimdir, bu yüzden sıra sayıları {{ـَةُ}} ile biter. Dikkat: saat birde “birinci” ({{الْأُولَى}}) değil <b>{{الْوَاحِدَةُ}}</b> denir.'],
      table: {
        cols: ['Saat', 'Arapça', 'Okunuş'],
        rows: [
          ['1:00', 'الْوَاحِدَةُ', 'el-vâhide'],
          ['2:00', 'الثَّانِيَةُ', 'es-sâniye'],
          ['3:00', 'الثَّالِثَةُ', 'es-sâlise'],
          ['4:00', 'الرَّابِعَةُ', 'er-râbi‘a'],
          ['5:00', 'الْخَامِسَةُ', 'el-hâmise'],
          ['6:00', 'السَّادِسَةُ', 'es-sâdise'],
          ['7:00', 'السَّابِعَةُ', 'es-sâbi‘a'],
          ['8:00', 'الثَّامِنَةُ', 'es-sâmine'],
          ['9:00', 'التَّاسِعَةُ', 'et-tâsi‘a'],
          ['10:00', 'الْعَاشِرَةُ', 'el-‘âşire'],
          ['11:00', 'الْحَادِيَةَ عَشْرَةَ', 'el-hâdiyete ‘aşrete'],
          ['12:00', 'الثَّانِيَةَ عَشْرَةَ', 'es-sâniyete ‘aşrete']
        ]
      },
      cmp: {
        tr: 'Türkçede <b>asıl sayı</b> kullanırız: saat <b>üç</b>. Arapça “saat <b>üçüncü</b>” der.',
        en: 'İngilizce de asıl sayı kullanır: <b>three</b> o’clock. Arapçaya çevirirken sayıyı sıra sayısına çevir.'
      },
      tips: ['Kalıp: sıra sayıları {{فَاعِلَة}} vezninde: ث-ل-ث → {{ثَالِثَة}}، ر-ب-ع → {{رَابِعَة}}، خ-م-س → {{خَامِسَة}}. Sayılar dersindeki kökleri tanıyorsan hepsi kendiliğinden çıkar. Not: “saniye” kelimesi {{ثَانِيَة}}’dir; Arapçada hem “ikinci” hem “saniye” demektir!']
    },
    {
      h: 'Buçuk, çeyrek ve yirmi: kesirler',
      p: [
        'Saatin üstüne {{وَ}} (ve) ile kesir eklenir: “üç <b>ve</b> yarım” = üç buçuk. Saatten çıkarmak için {{إِلَّا}} (hariç, eksik) kullanılır: “dört <b>eksi</b> çeyrek” = dörde çeyrek var.'
      ],
      table: {
        cols: ['İfade', 'Anlam', 'Örnek (saat 3)'],
        rows: [
          ['وَالرُّبْعُ', 'çeyrek geçe (:15)', 'الثَّالِثَةُ وَالرُّبْعُ'],
          ['وَالثُّلْثُ', 'yirmi geçe (:20)', 'الثَّالِثَةُ وَالثُّلْثُ'],
          ['وَالنِّصْفُ', 'buçuk (:30)', 'الثَّالِثَةُ وَالنِّصْفُ'],
          ['إِلَّا ثُلْثًا', 'yirmi kala (:40)', 'الرَّابِعَةُ إِلَّا ثُلْثًا'],
          ['إِلَّا رُبْعًا', 'çeyrek kala (:45)', 'الرَّابِعَةُ إِلَّا رُبْعًا']
        ]
      },
      ex: [
        { ar: 'السَّاعَةُ الثَّانِيَةُ وَالنِّصْفُ', tl: 'es-sâ‘atu’s-sâniyetu ve’n-nısf', tr: 'Saat iki buçuk. (2:30)', en: 'It’s half past two.' },
        { ar: 'السَّاعَةُ الْخَامِسَةُ وَالرُّبْعُ', tl: 'es-sâ‘atu’l-hâmisetu ve’r-rub‘', tr: 'Saat beşi çeyrek geçiyor. (5:15)', en: 'It’s quarter past five.' },
        { ar: 'السَّاعَةُ الثَّامِنَةُ إِلَّا رُبْعًا', tl: 'es-sâ‘atu’s-sâminetu illâ rub‘an', tr: 'Saat sekize çeyrek var. (7:45)', en: 'It’s quarter to eight.' },
        { ar: 'السَّاعَةُ الْعَاشِرَةُ وَالثُّلْثُ', tl: 'es-sâ‘atu’l-‘âşiratu ve’s-suls', tr: 'Saat onu yirmi geçiyor. (10:20)', en: 'It’s twenty past ten.' }
      ],
      cmp: {
        tr: '<b>“Sekize çeyrek var”</b> mantığı Arapçayla birebir aynı: bir sonraki saati söyle, çeyreği çıkar → {{الثَّامِنَةُ إِلَّا رُبْعًا}}.',
        en: '<b>“Quarter to eight”</b> da aynı mantık: “to” = {{إِلَّا}}, “past” = {{وَ}}.'
      },
      tips: [
        '“Çeyrek kala” derken <b>bir sonraki saati</b> söylediğini unutma: 7:45 = “sekize çeyrek var” = {{الثَّامِنَةُ إِلَّا رُبْعًا}}, yedi değil!',
        'Türkçedeki <b>nısıf</b> (yarım), <b>rubu</b> (dörtte bir), <b>sülüs</b> (üçte bir; “sülüs yazı”) kelimeleri bunlardır.'
      ]
    },
    {
      h: 'Dakikalar',
      p: [
        'Dakika {{دَقِيقَة}} (çoğulu {{دَقَائِق}}) dişildir. 5 ve 10 dakika için Sayılar dersindeki kural geçerli: sayı ة’siz, isim çoğul: {{خَمْسُ دَقَائِقَ}}، {{عَشْرُ دَقَائِقَ}}.',
        'Geçe: {{وَ}} + dakika. Kala: {{إِلَّا}} + dakika (üstünlü: {{إِلَّا خَمْسَ دَقَائِقَ}}).',
        '25 geçe ve 25 kala için genelde buçuğa göre söylenir: 3:25 = {{الثَّالِثَةُ وَالنِّصْفُ إِلَّا خَمْسَ دَقَائِقَ}} “üç buçuğa beş var”.'
      ],
      ex: [
        { ar: 'الثَّانِيَةُ وَخَمْسُ دَقَائِقَ', tl: 'es-sâniyetu ve hamsu dekâik', tr: 'İkiyi beş geçiyor. (2:05)', en: 'Five past two.' },
        { ar: 'السَّادِسَةُ وَعَشْرُ دَقَائِقَ', tl: 'es-sâdisetu ve ‘aşru dekâik', tr: 'Altıyı on geçiyor. (6:10)', en: 'Ten past six.' },
        { ar: 'التَّاسِعَةُ إِلَّا عَشْرَ دَقَائِقَ', tl: 'et-tâsi‘atu illâ ‘aşra dekâik', tr: 'Dokuza on var. (8:50)', en: 'Ten to nine.' },
        { ar: 'الْوَاحِدَةُ إِلَّا خَمْسَ دَقَائِقَ', tl: 'el-vâhidetu illâ hamse dekâik', tr: 'Bire beş var. (12:55)', en: 'Five to one.' }
      ],
      tips: ['Günlük konuşmada {{دَقَائِقَ}} kelimesi sık sık atılır: {{الثَّانِيَةُ وَخَمْسٌ}} “ikiyi beş geçiyor” denir. Türkçede de “ikiyi beş geçiyor” deriz, “beş dakika” demeyiz.']
    },
    {
      h: 'Günün vakitleri',
      p: ['Saatin sabah mı akşam mı olduğunu belirtmek için sona bir zaman zarfı eklenir:'],
      table: {
        cols: ['Arapça', 'Okunuş', 'Anlam', 'English'],
        rows: [
          ['صَبَاحًا', 'sabâhan', 'sabah', 'in the morning (a.m.)'],
          ['ظُهْرًا', 'zuhran', 'öğle', 'at noon'],
          ['بَعْدَ الظُّهْرِ', 'ba‘de’z-zuhr', 'öğleden sonra', 'in the afternoon'],
          ['مَسَاءً', 'mesâen', 'akşam', 'in the evening (p.m.)'],
          ['لَيْلًا', 'leylen', 'gece', 'at night']
        ]
      },
      ex: [
        { ar: 'السَّاعَةُ السَّابِعَةُ صَبَاحًا', tl: 'es-sâ‘atu’s-sâbi‘atu sabâhan', tr: 'Sabah saat yedi.', en: 'It’s 7 a.m.' },
        { ar: 'السَّاعَةُ التَّاسِعَةُ مَسَاءً', tl: 'es-sâ‘atu’t-tâsi‘atu mesâen', tr: 'Akşam saat dokuz.', en: 'It’s 9 p.m.' }
      ],
      tips: ['Selamlaşmaları da öğrenmiş oldun: {{صَبَاحُ الْخَيْرِ}} “Günaydın” (sabahın hayrı), {{مَسَاءُ الْخَيْرِ}} “İyi akşamlar”. Türkçedeki <b>sabah</b>, <b>öğle</b>nin “<b>zuhr</b>” namazı, <b>leyl</b> (gece) hep buradan.']
    },
    {
      h: '“Saat kaçta?”: bir olayın saati',
      p: [
        'Bir şeyin hangi saatte olduğunu sormak için: {{فِي أَيِّ سَاعَةٍ؟}} ya da {{مَتَى؟}}. Cevapta {{فِي}} (-de) kullanılır ve ondan sonra sözcükler <b>esre</b> alır: {{فِي السَّاعَةِ الثَّامِنَةِ}} “saat sekizde”.'
      ],
      ex: [
        { ar: 'مَتَى تَسْتَيْقِظُ؟', tl: 'metâ testeykizu?', tr: 'Ne zaman uyanırsın?', en: 'When do you wake up?' },
        { ar: 'أَسْتَيْقِظُ فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا', tl: 'esteykizu fi’s-sâ‘ati’s-sâbi‘ati sabâhan', tr: 'Sabah saat yedide uyanırım.', en: 'I wake up at seven in the morning.' },
        { ar: 'فِي أَيِّ سَاعَةٍ يَبْدَأُ الدَّرْسُ؟', tl: 'fî eyyi sâ‘atin yebde’u’d-ders?', tr: 'Ders saat kaçta başlıyor?', en: 'What time does the lesson start?' },
        { ar: 'يَبْدَأُ فِي التَّاسِعَةِ وَالنِّصْفِ', tl: 'yebde’u fi’t-tâsi‘ati ve’n-nısf', tr: 'Dokuz buçukta başlıyor.', en: 'It starts at half past nine.' }
      ],
      cmp: { tr: '“Saat yedi<b>de</b>” → {{فِي}} = “-de” ekinin karşılığıdır.', en: '“<b>at</b> seven” → {{فِي}}.' }
    }
  ],
  keys: [
    'Soru: {{كَمِ السَّاعَةُ؟}} — Cevap: {{السَّاعَةُ}} + dişil sıra sayısı.',
    'Saat bir: {{الْوَاحِدَةُ}} (birinci değil!). Diğerleri: {{الثَّانِيَةُ}}، {{الثَّالِثَةُ}}…',
    'Geçe {{وَ}}: {{وَالرُّبْعُ}} çeyrek, {{وَالثُّلْثُ}} yirmi, {{وَالنِّصْفُ}} buçuk.',
    'Kala {{إِلَّا}} + bir sonraki saat: {{الثَّامِنَةُ إِلَّا رُبْعًا}} = 7:45.',
    'Dakika: {{خَمْسُ دَقَائِقَ}}، {{عَشْرُ دَقَائِقَ}}. Vakit: {{صَبَاحًا}}، {{مَسَاءً}}.',
    '“Saat sekizde” = {{فِي السَّاعَةِ الثَّامِنَةِ}}.'
  ],
  mistakes: [
    { bad: 'السَّاعَةُ ثَلَاثَةٌ', good: 'السَّاعَةُ الثَّالِثَةُ', why: 'Saat söylerken asıl sayı değil, dişil sıra sayısı kullanılır.' },
    { bad: 'السَّاعَةُ الْأُولَى', good: 'السَّاعَةُ الْوَاحِدَةُ', why: 'Saat bir istisnadır: {{الْوَاحِدَةُ}}.' },
    { bad: 'السَّابِعَةُ إِلَّا رُبْعًا (= 7:45?)', good: 'الثَّامِنَةُ إِلَّا رُبْعًا', why: '{{إِلَّا}} ile bir sonraki saat söylenir: 7:45 = “sekize çeyrek var”.' },
    { bad: 'السَّاعَةُ الثَّالِثُ', good: 'السَّاعَةُ الثَّالِثَةُ', why: '{{سَاعَة}} dişildir; sıra sayısı da dişil olmalı.' }
  ],
  words: [
    { ar: 'سَاعَة', tl: 'sâ‘a', tr: 'saat', en: 'hour / clock' },
    { ar: 'دَقِيقَة', tl: 'dakîka', tr: 'dakika', en: 'minute' },
    { ar: 'ثَانِيَة', tl: 'sâniye', tr: 'saniye', en: 'second' },
    { ar: 'كَمِ السَّاعَةُ؟', tl: 'kemi’s-sâ‘atu?', tr: 'Saat kaç?', en: 'What time is it?' },
    { ar: 'السَّاعَةُ الْوَاحِدَةُ', tl: 'es-sâ‘atu’l-vâhide', tr: 'saat bir', en: 'one o’clock' },
    { ar: 'وَالنِّصْفُ', tl: 've’n-nısf', tr: 'buçuk', en: 'half past' },
    { ar: 'وَالرُّبْعُ', tl: 've’r-rub‘', tr: 'çeyrek geçe', en: 'quarter past' },
    { ar: 'إِلَّا رُبْعًا', tl: 'illâ rub‘an', tr: 'çeyrek kala', en: 'quarter to' },
    { ar: 'وَالثُّلْثُ', tl: 've’s-suls', tr: 'yirmi geçe', en: 'twenty past' },
    { ar: 'إِلَّا ثُلْثًا', tl: 'illâ sulsen', tr: 'yirmi kala', en: 'twenty to' },
    { ar: 'صَبَاحًا', tl: 'sabâhan', tr: 'sabah', en: 'in the morning' },
    { ar: 'ظُهْرًا', tl: 'zuhran', tr: 'öğle', en: 'at noon' },
    { ar: 'مَسَاءً', tl: 'mesâen', tr: 'akşam', en: 'in the evening' },
    { ar: 'لَيْلًا', tl: 'leylen', tr: 'gece', en: 'at night' },
    { ar: 'صَبَاحُ الْخَيْرِ', tl: 'sabâhu’l-hayr', tr: 'Günaydın', en: 'Good morning' },
    { ar: 'مَسَاءُ الْخَيْرِ', tl: 'mesâu’l-hayr', tr: 'İyi akşamlar', en: 'Good evening' }
  ],
  acts: [
    { type: 'flash', title: 'Saat kelimeleri', desc: 'Saat, dakika, buçuk, çeyrek: kartları çevir, telaffuzu dinle.', glyph: 'سَاعَة' },
    {
      type: 'match', title: 'Sıra sayılarıyla eşleştir', desc: '{{الْوَاحِدَةُ}}, {{الثَّانِيَةُ}}… kelimelerini doğru saate bağla.', glyph: '١٢', items: [
        ['الْوَاحِدَةُ', '1:00'], ['الثَّانِيَةُ', '2:00'], ['الثَّالِثَةُ', '3:00'], ['الرَّابِعَةُ', '4:00'], ['الْخَامِسَةُ', '5:00'],
        ['السَّادِسَةُ', '6:00'], ['السَّابِعَةُ', '7:00'], ['الثَّامِنَةُ', '8:00'], ['التَّاسِعَةُ', '9:00'], ['الْعَاشِرَةُ', '10:00'],
        ['الْحَادِيَةَ عَشْرَةَ', '11:00'], ['الثَّانِيَةَ عَشْرَةَ', '12:00']
      ]
    },
    {
      type: 'mc', title: 'Kadrandan saat söyle', desc: 'Gösterilen saatin Arapçasını seç.', glyph: '٣:٣٠', items: [
        { q: 'Saat kaç?', clock: '3:00', options: ['الثَّالِثَةُ', 'الثَّانِيَةُ', 'الرَّابِعَةُ', 'ثَلَاثَةٌ'], a: 'الثَّالِثَةُ', why: 'Tam saat: dişil sıra sayısı.' },
        { q: 'Saat kaç?', clock: '1:00', options: ['الْوَاحِدَةُ', 'الْأُولَى', 'الْحَادِيَةَ عَشْرَةَ', 'وَاحِدٌ'], a: 'الْوَاحِدَةُ', why: 'Saat bir istisnadır: {{الْوَاحِدَةُ}}.' },
        { q: 'Saat kaç?', clock: '3:30', options: ['الثَّالِثَةُ وَالنِّصْفُ', 'الثَّالِثَةُ وَالرُّبْعُ', 'الرَّابِعَةُ إِلَّا رُبْعًا', 'الثَّانِيَةُ وَالنِّصْفُ'], a: 'الثَّالِثَةُ وَالنِّصْفُ', why: ':30 = {{وَالنِّصْفُ}}.' },
        { q: 'Saat kaç?', clock: '5:15', options: ['الْخَامِسَةُ وَالرُّبْعُ', 'الْخَامِسَةُ إِلَّا رُبْعًا', 'الرَّابِعَةُ وَالرُّبْعُ', 'الْخَامِسَةُ وَالنِّصْفُ'], a: 'الْخَامِسَةُ وَالرُّبْعُ', why: ':15 = {{وَالرُّبْعُ}}.' },
        { q: 'Saat kaç?', clock: '7:45', options: ['الثَّامِنَةُ إِلَّا رُبْعًا', 'السَّابِعَةُ إِلَّا رُبْعًا', 'السَّابِعَةُ وَالرُّبْعُ', 'الثَّامِنَةُ وَالرُّبْعُ'], a: 'الثَّامِنَةُ إِلَّا رُبْعًا', why: '7:45 = sekize çeyrek var → bir sonraki saat + {{إِلَّا رُبْعًا}}.' },
        { q: 'Saat kaç?', clock: '10:20', options: ['الْعَاشِرَةُ وَالثُّلْثُ', 'الْعَاشِرَةُ إِلَّا ثُلْثًا', 'الْعَاشِرَةُ وَالرُّبْعُ', 'التَّاسِعَةُ وَالثُّلْثُ'], a: 'الْعَاشِرَةُ وَالثُّلْثُ', why: ':20 = saatin üçte biri: {{وَالثُّلْثُ}}.' },
        { q: 'Saat kaç?', clock: '8:40', options: ['التَّاسِعَةُ إِلَّا ثُلْثًا', 'الثَّامِنَةُ وَالثُّلْثُ', 'الثَّامِنَةُ إِلَّا ثُلْثًا', 'التَّاسِعَةُ إِلَّا رُبْعًا'], a: 'التَّاسِعَةُ إِلَّا ثُلْثًا', why: '8:40 = dokuza yirmi var.' },
        { q: 'Saat kaç?', clock: '6:10', options: ['السَّادِسَةُ وَعَشْرُ دَقَائِقَ', 'السَّادِسَةُ إِلَّا عَشْرَ دَقَائِقَ', 'السَّابِعَةُ وَعَشْرُ دَقَائِقَ', 'السَّادِسَةُ وَالرُّبْعُ'], a: 'السَّادِسَةُ وَعَشْرُ دَقَائِقَ', why: 'Geçe = {{وَ}} + {{عَشْرُ دَقَائِقَ}}.' },
        { q: 'Saat kaç?', clock: '11:55', options: ['الثَّانِيَةَ عَشْرَةَ إِلَّا خَمْسَ دَقَائِقَ', 'الْحَادِيَةَ عَشْرَةَ وَخَمْسُ دَقَائِقَ', 'الْحَادِيَةَ عَشْرَةَ إِلَّا خَمْسَ دَقَائِقَ', 'الْعَاشِرَةُ وَالنِّصْفُ'], a: 'الثَّانِيَةَ عَشْرَةَ إِلَّا خَمْسَ دَقَائِقَ', why: '11:55 = on ikiye beş var.' },
        { q: 'Saat kaç?', clock: '2:30', options: ['الثَّانِيَةُ وَالنِّصْفُ', 'الثَّالِثَةُ وَالنِّصْفُ', 'الثَّانِيَةُ وَالرُّبْعُ', 'الثَّالِثَةُ إِلَّا رُبْعًا'], a: 'الثَّانِيَةُ وَالنِّصْفُ' }
      ]
    },
    {
      type: 'fill', title: 'Çeyrek geçe, çeyrek kala', desc: '{{وَالرُّبْعُ}} ve {{إِلَّا رُبْعًا}} kalıplarıyla cümleleri tamamla.', glyph: 'إِلَّا', items: [
        { s: 'السَّاعَةُ الثَّالِثَةُ ___', hint: '3:30', options: ['وَالنِّصْفُ', 'وَالرُّبْعُ', 'إِلَّا رُبْعًا'], a: 'وَالنِّصْفُ', tr: 'Saat üç buçuk.', why: 'Buçuk = {{وَالنِّصْفُ}}.' },
        { s: 'السَّاعَةُ الرَّابِعَةُ ___', hint: '3:45', options: ['إِلَّا رُبْعًا', 'وَالرُّبْعُ', 'وَالنِّصْفُ'], a: 'إِلَّا رُبْعًا', tr: 'Saat dörde çeyrek var.', why: '3:45 = dörde çeyrek var.' },
        { s: 'السَّاعَةُ ___ وَالرُّبْعُ', hint: '9:15', options: ['التَّاسِعَةُ', 'الْعَاشِرَةُ', 'تِسْعَةٌ'], a: 'التَّاسِعَةُ', tr: 'Saat dokuzu çeyrek geçiyor.', why: 'Geçe derken o anki saat söylenir.' },
        { s: 'السَّاعَةُ ___ إِلَّا رُبْعًا', hint: '9:45', options: ['الْعَاشِرَةُ', 'التَّاسِعَةُ', 'الْحَادِيَةَ عَشْرَةَ'], a: 'الْعَاشِرَةُ', tr: 'Saat ona çeyrek var.', why: 'Kala derken bir sonraki saat söylenir.' },
        { s: 'السَّاعَةُ الْخَامِسَةُ ___', hint: '5:20', options: ['وَالثُّلْثُ', 'إِلَّا ثُلْثًا', 'وَالرُّبْعُ'], a: 'وَالثُّلْثُ', tr: 'Saat beşi yirmi geçiyor.', why: '20 dakika = saatin üçte biri.' },
        { s: 'السَّاعَةُ السَّابِعَةُ ___', hint: 'sabah 7', options: ['صَبَاحًا', 'مَسَاءً', 'لَيْلًا'], a: 'صَبَاحًا', tr: 'Sabah saat yedi.', why: 'Sabah = {{صَبَاحًا}}.' },
        { s: 'أَنَامُ فِي السَّاعَةِ ___', hint: 'Saat on birde uyurum.', options: ['الْحَادِيَةَ عَشْرَةَ', 'الْوَاحِدَةَ عَشْرَةَ', 'أَحَدَ عَشَرَ'], a: 'الْحَادِيَةَ عَشْرَةَ', tr: 'Saat on birde uyurum.', why: '11 = {{الْحَادِيَةَ عَشْرَةَ}}.' },
        { s: '___ السَّاعَةُ؟', options: ['كَمِ', 'مَا', 'مَنِ'], a: 'كَمِ', tr: 'Saat kaç?', why: 'Saat sorusu {{كَمْ}} ile; ال’den önce esreli: {{كَمِ}}.' }
      ]
    },
    {
      type: 'order', title: 'Saat cümlesi kur', desc: 'Kelimeleri dizerek saati söyle.', glyph: 'وَ…', items: [
        { tr: 'Saat iki buçuk.', w: ['السَّاعَةُ', 'الثَّانِيَةُ', 'وَالنِّصْفُ'] },
        { tr: 'Saat sekize çeyrek var.', w: ['السَّاعَةُ', 'الثَّامِنَةُ', 'إِلَّا', 'رُبْعًا'] },
        { tr: 'Saat kaç?', w: ['كَمِ', 'السَّاعَةُ؟'] },
        { tr: 'Sabah saat yedide uyanırım.', w: ['أَسْتَيْقِظُ', 'فِي', 'السَّاعَةِ', 'السَّابِعَةِ', 'صَبَاحًا'] },
        { tr: 'Akşam saat dokuz.', w: ['السَّاعَةُ', 'التَّاسِعَةُ', 'مَسَاءً'] }
      ]
    },
    { type: 'clock', mode: 'c2t', title: 'Sınırsız: kadrandan yazıya', desc: 'Rastgele bir saat kadranı gör, doğru Arapça ifadeyi seç. Bitene kadar devam eder.', glyph: '∞' },
    { type: 'clock', mode: 't2c', title: 'Sınırsız: yazıdan kadrana', desc: 'Arapça saati oku ve dinle, onu gösteren kadranı bul. Bitene kadar devam eder.', glyph: '∞' },
    { type: 'clock', mode: 'mix', title: 'Sınırsız: karışık', desc: 'İki yön rastgele karışık gelir: kadrandan yazıya ve yazıdan kadrana.', glyph: '∞' },
    {
      type: 'test', title: 'Saatler testi', desc: 'Kategorinin tamamını kapsayan kısa değerlendirme.', glyph: '؟', items: [
        { q: 'Saat kaç?', clock: '4:00', options: ['الرَّابِعَةُ', 'أَرْبَعَةٌ', 'الْخَامِسَةُ', 'الرَّابِعُ'], a: 'الرَّابِعَةُ' },
        { q: 'Saat kaç?', clock: '12:30', options: ['الثَّانِيَةَ عَشْرَةَ وَالنِّصْفُ', 'الْوَاحِدَةُ وَالنِّصْفُ', 'الثَّانِيَةَ عَشْرَةَ وَالرُّبْعُ', 'الْوَاحِدَةُ إِلَّا رُبْعًا'], a: 'الثَّانِيَةَ عَشْرَةَ وَالنِّصْفُ' },
        { q: '{{السَّادِسَةُ إِلَّا رُبْعًا}} kaçtır?', options: ['5:45', '6:15', '6:45', '5:15'], a: '5:45', why: 'Altıya çeyrek var.' },
        { q: '{{السَّاعَةُ الْعَاشِرَةُ مَسَاءً}} ne demektir?', options: ['Akşam saat on.', 'Sabah saat on.', 'Saat on buçuk.', 'Saat onda.'], a: 'Akşam saat on.' },
        { t: 'tf', s: 'Saat bir için السَّاعَةُ الْأُولَى denir.', a: false, why: 'Doğrusu {{السَّاعَةُ الْوَاحِدَةُ}}.' },
        { t: 'tf', s: 'وَالثُّلْثُ “yirmi geçe” anlamına gelir.', a: true, why: 'Saatin üçte biri = 20 dakika.' },
        { t: 'fill', s: 'يَبْدَأُ الدَّرْسُ فِي السَّاعَةِ ___', hint: 'saat dokuzda', options: ['التَّاسِعَةِ', 'التَّاسِعَةُ', 'تِسْعَةٍ'], a: 'التَّاسِعَةِ', tr: 'Ders saat dokuzda başlıyor.', why: '{{فِي}}’den sonra esre: et-tâsi‘ati.' },
        { q: '“Good morning” Arapçada?', options: ['صَبَاحُ الْخَيْرِ', 'مَسَاءُ الْخَيْرِ', 'صَبَاحًا', 'لَيْلًا'], a: 'صَبَاحُ الْخَيْرِ' },
        { t: 'order', tr: 'Saat dokuza on var.', w: ['السَّاعَةُ', 'التَّاسِعَةُ', 'إِلَّا', 'عَشْرَ', 'دَقَائِقَ'] },
        { q: 'Saat kaç?', clock: '1:15', options: ['الْوَاحِدَةُ وَالرُّبْعُ', 'الثَّانِيَةُ إِلَّا رُبْعًا', 'الْوَاحِدَةُ وَالنِّصْفُ', 'الْوَاحِدَةُ إِلَّا رُبْعًا'], a: 'الْوَاحِدَةُ وَالرُّبْعُ' }
      ]
    }
  ]
});
