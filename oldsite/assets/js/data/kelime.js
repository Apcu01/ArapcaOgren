window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'kelime', n: 2, level: 'Başlangıç', glyph: 'ك',
  ar: 'الْكَلِمَةُ وَالْجُمْلَةُ', name: 'Kelime ve Cümle Türleri',
  desc: 'Kelimenin üç türü (isim, fiil, harf) ve iki cümle türü: isim cümlesi ile fiil cümlesi.',
  long: "Bir kelimenin isim mi, fiil mi, harf mi olduğunu işaretlerinden tanımayı; mübteda ve haberle kurulan isim cümlesini, fiil, fâil ve mef'ulle kurulan fiil cümlesini öğren.",
  tags: 'kelime cümle cumle isim fiil harf ism fil mübteda mubteda haber fail fâil meful mef\'ul isim cümlesi fiil cümlesi ismiyye fiiliyye nahiv dilbilgisi gramer grammar noun verb particle',
  readMins: 11,
  intro: 'Arap dilbilgisinin temelinde iki soru vardır: <b>Bu kelime ne?</b> ve <b>Bu cümle neyle başlıyor?</b> Kelimeler üç gruba ayrılır: {{اِسْمٌ}} isim, {{فِعْلٌ}} fiil ve {{حَرْفٌ}} harf. Cümleler de ilk kelimeye göre ikiye ayrılır: isimle başlayan <b>isim cümlesi</b> ve fiille başlayan <b>fiil cümlesi</b>.',
  lesson: [
    {
      h: 'Kelime üç türlüdür: isim, fiil, harf',
      p: ['Arap dilbilgisinde her kelime üç gruptan birine girer: {{اِسْمٌ}} (isim), {{فِعْلٌ}} (fiil) ve {{حَرْفٌ}} (harf). Bir cümleyi çözmenin ilk adımı, kelimelerin hangi gruba ait olduğunu görmektir.'],
      table: {
        cols: ['Tür', 'Arapça', 'Ne anlatır?', 'Örnekler'],
        rows: [
          ['İsim', 'اِسْمٌ', 'Kendi başına anlamı olan, zaman bildirmeyen kelime: kişi, eşya, yer, sıfat, zamir, sayı', 'كِتَابٌ، أَحْمَدُ، كَبِيرٌ، هُوَ'],
          ['Fiil', 'فِعْلٌ', 'Bir zamana bağlı iş, oluş ya da hareket', 'كَتَبَ، يَكْتُبُ، اُكْتُبْ'],
          ['Harf', 'حَرْفٌ', 'Tek başına tam anlam vermeyen, başka bir kelimeyle anlam kazanan bağlayıcı', 'فِي، مِنْ، وَ، هَلْ']
        ]
      },
      cmp: {
        tr: 'Türkçe dilbilgisinde isim, sıfat, zamir, zarf, fiil, edat, bağlaç ve ünlem gibi sekiz tür sayılır. Arapça bunları üç gruba toplar: sıfat, zamir ve sayı da birer isimdir.',
        en: 'İngilizcede de sekiz "part of speech" vardır (noun, verb, adjective, pronoun...). Arapçada adjective ve pronoun da isim grubundadır; preposition ve conjunction ise harf grubundadır.'
      },
      tips: [
        'Kısa bir test: kelimenin anlamında bir zaman var mı? "Yazdı", "yazıyor" zaman bildirir, demek ki fiildir. "Kitap", "büyük", "o" zaman bildirmez, demek ki isimdir.',
        'Buradaki "harf", alfabedeki harf (ب، ت) demek değildir; anlam taşıyan küçük kelimeler ({{فِي}}، {{مِنْ}}) kastedilir. Alfabedeki harflere {{حُرُوفُ الْهِجَاءِ}} denir.'
      ]
    },
    {
      h: 'İsmin işaretleri',
      p: ['Bir kelimenin isim olduğunu şu işaretlerden anlarsın. Birini taşıması yeter:'],
      table: {
        cols: ['İşaret', 'Örnek', 'Açıklama'],
        rows: [
          ['Başına ال gelir', 'الْكِتَابُ، الْبَيْتُ', 'Belirlilik takısını yalnızca isimler alır.'],
          ['Tenvin alır', 'كِتَابٌ، قَلَمًا، بَيْتٍ', '-un, -en, -in sesleri isme özgüdür.'],
          ['Harf-i cerden sonra gelir', 'فِي الْبَيْتِ، مِنَ الْمَدْرَسَةِ', 'Harf-i cerden sonraki kelime isimdir ve esre alır.'],
          ['Ona seslenilir', 'يَا أَحْمَدُ', 'Yalnızca bir isme "ey" diye seslenilir.']
        ]
      },
      ex: [
        { ar: 'الطَّالِبُ مُجْتَهِدٌ', tl: 'et-tâlibu muctehidun', tr: 'Öğrenci çalışkandır.', en: 'The student is hardworking.', note: 'İki kelime de isimdir: biri ال, diğeri tenvin taşıyor.' },
        { ar: 'ذَهَبْتُ إِلَى السُّوقِ', tl: "zehebtu ile's-sûki", tr: 'Çarşıya gittim.', en: 'I went to the market.', note: '{{السُّوقِ}} hem ال alıyor hem harf-i cerden sonra geliyor: isim.' }
      ],
      tips: ['Zamirler ({{أَنَا}}، {{هُوَ}}) ve işaret isimleri ({{هٰذَا}}) ال ya da tenvin almaz ama yine de isimdir. İşaretler tanımayı kolaylaştırır, her ismin hepsini taşıması gerekmez.']
    },
    {
      h: 'Fiilin işaretleri ve üç hâli',
      p: ['Fiil bir iş ya da oluşu bir zamanla birlikte anlatır. Arapçada fiilin üç hâli vardır:'],
      table: {
        cols: ['Hâl', 'Örnek', 'Anlam'],
        rows: [
          ['Mazi (geçmiş)', 'كَتَبَ', 'yazdı'],
          ['Muzari (şimdiki ve geniş)', 'يَكْتُبُ', 'yazıyor, yazar'],
          ['Emir', 'اُكْتُبْ', 'yaz!']
        ]
      },
      p2: ['Fiili şu işaretlerden de tanırsın: başına {{قَدْ}} (gerçekten, -mış), {{سَـ}} ya da {{سَوْفَ}} (gelecek), {{لَمْ}} (olumsuz geçmiş) gelir; ya da sonuna şahıs ekleri eklenir: {{كَتَبْتُ}} "yazdım".'],
      ex: [
        { ar: 'قَدْ وَصَلَ الْقِطَارُ', tl: "kad vasale'l-kitâru", tr: 'Tren geldi (gerçekten geldi).', en: 'The train has arrived.' },
        { ar: 'سَأَكْتُبُ رِسَالَةً', tl: 'se-ektubu risâleten', tr: 'Bir mektup yazacağım.', en: 'I will write a letter.' },
        { ar: 'لَمْ يَذْهَبْ', tl: 'lem yezheb', tr: 'Gitmedi.', en: 'He did not go.' }
      ],
      cmp: {
        tr: 'Türkçede zaman fiilin sonundaki eklerle gösterilir: yaz-dı, yaz-ıyor, yaz-acak. Arapçada mazide ekler sona, muzaride başa gelir.',
        en: 'İngilizcede zaman çoğunlukla yardımcı fiillerle yapılır (did, will). Arapçada fiilin kendisi değişir ya da başına سَـ gibi küçük bir ek gelir.'
      },
      tips: ['Fiillerin çekimini Fiiller dersinde ayrıntılı göreceksin. Şimdilik bir kelimenin fiil olduğunu tanıman yeterli.']
    },
    {
      h: 'Harf: anlamı başka kelimeyle tamamlanan kelimeler',
      p: ['Harfler tek başına söylendiğinde tam bir anlam vermez; bir isim ya da fiille birlikte anlam kazanır. Ne ال ne tenvin alırlar, zaman da bildirmezler.'],
      table: {
        cols: ['Grup', 'Örnekler', 'Anlam'],
        rows: [
          ['Harf-i cer', 'فِي، مِنْ، إِلَى، عَلَى', '-de, -den, -e, üzerinde'],
          ['Bağlaç', 'وَ، ثُمَّ، أَوْ', 've, sonra, veya'],
          ['Soru', 'هَلْ، أَ', 'mi?'],
          ['Olumsuzluk', 'لَا، لَمْ، لَنْ', 'değil, -medi, -meyecek'],
          ['Seslenme', 'يَا', 'ey']
        ]
      },
      ex: [
        { ar: 'الْكِتَابُ عَلَى الطَّاوِلَةِ', tl: "el-kitâbu ale't-tâvileti", tr: 'Kitap masanın üzerinde.', en: 'The book is on the table.', note: '{{عَلَى}} "üzerinde" der ama neyin üzerinde olduğunu ancak sonraki isim söyler.' },
        { ar: 'أَحْمَدُ وَعَلِيٌّ صَدِيقَانِ', tl: 'Ahmedu ve Aliyyun sadîkâni', tr: 'Ahmet ile Ali iki arkadaştır.', en: 'Ahmed and Ali are friends.' }
      ],
      tips: ['{{وَ}}، {{بِـ}}، {{لِـ}} gibi tek harfli harfler sonraki kelimeye bitişik yazılır: {{وَعَلِيٌّ}}، {{بِالْقَلَمِ}}. Okurken bunları kelimeden ayırmayı alışkanlık hâline getir.']
    },
    {
      h: 'İsim cümlesi: mübteda ve haber',
      p: [
        'İsimle başlayan cümleye {{جُمْلَةٌ اسْمِيَّةٌ}} (isim cümlesi) denir. İki parçası vardır: hakkında konuşulan {{مُبْتَدَأٌ}} (mübteda) ve onun hakkında verilen bilgi {{خَبَرٌ}} (haber).',
        'Mübteda genellikle belirlidir, haber genellikle belirsizdir ve ikisi de ötre (-u) ile biter. Şimdiki zamanda "olmak" fiili kullanılmaz: {{الْبَيْتُ كَبِيرٌ}} "Ev büyüktür."'
      ],
      table: {
        cols: ['Mübteda', 'Haber', 'Anlam'],
        rows: [
          ['الْبَيْتُ', 'كَبِيرٌ', 'Ev büyüktür.'],
          ['أَنَا', 'طَالِبٌ', 'Ben öğrenciyim.'],
          ['السَّيَّارَةُ', 'جَدِيدَةٌ', 'Araba yenidir.'],
          ['الطُّلَّابُ', 'مُجْتَهِدُونَ', 'Öğrenciler çalışkandır.'],
          ['الْكِتَابُ', 'عَلَى الطَّاوِلَةِ', 'Kitap masanın üzerindedir.']
        ]
      },
      p2: ['Haber, mübtedaya cinsiyette ve sayıda uyar: {{السَّيَّارَةُ جَدِيدَةٌ}} (dişil), {{الطُّلَّابُ مُجْتَهِدُونَ}} (çoğul). Haber bir harf-i cer grubu da olabilir: {{الْكِتَابُ عَلَى الطَّاوِلَةِ}}.'],
      cmp: {
        tr: 'Türkçede yüklem sondadır ve "-dır" ekiyle gelir: Ev büyük-tür. Arapçada sıra aynıdır ama "-dır" ekinin karşılığı yoktur.',
        en: 'İngilizcede "is / are" şarttır: The house is big. Arapçaya çevirirken is / are kelimesini at: الْبَيْتُ كَبِيرٌ.'
      },
      tips: ["{{الْبَيْتُ الْكَبِيرُ}} (iki kelime de ال'lı) bir cümle değil, \"büyük ev\" demektir. Cümle kurmak için haberi ال'sız bırak: {{الْبَيْتُ كَبِيرٌ}}."]
    },
    {
      h: "Fiil cümlesi: fiil, fâil ve mef'ul",
      p: ["Fiille başlayan cümleye {{جُمْلَةٌ فِعْلِيَّةٌ}} (fiil cümlesi) denir. Sıra çoğunlukla şöyledir: önce fiil, sonra işi yapan {{فَاعِلٌ}} (fâil, ötre alır), sonra işten etkilenen {{مَفْعُولٌ بِهِ}} (mef'ul, üstün alır)."],
      ex: [
        { ar: 'كَتَبَ الطَّالِبُ الدَّرْسَ', tl: "ketebe't-tâlibu'd-derse", tr: 'Öğrenci dersi yazdı.', en: 'The student wrote the lesson.', note: "Fiil {{كَتَبَ}}, fâil {{الطَّالِبُ}} (-u), mef'ul {{الدَّرْسَ}} (-e)." },
        { ar: 'شَرِبَ أَحْمَدُ الْمَاءَ', tl: "şeribe Ahmedu'l-mâe", tr: 'Ahmet suyu içti.', en: 'Ahmed drank the water.' },
        { ar: 'يَقْرَأُ الْوَلَدُ كِتَابًا', tl: "yakra'u'l-veledu kitâben", tr: 'Çocuk bir kitap okuyor.', en: 'The boy is reading a book.' },
        { ar: 'ذَهَبَتْ فَاطِمَةُ إِلَى الْمَدْرَسَةِ', tl: "zehebet Fâtimetu ile'l-medreseti", tr: 'Fatma okula gitti.', en: 'Fatima went to school.', note: 'Fâil dişil olduğu için fiil de dişil: {{ذَهَبَتْ}}.' }
      ],
      cmp: {
        tr: 'Türkçede fiil sondadır: Öğrenci dersi yazdı. Arapçada çoğunlukla en baştadır: Yazdı öğrenci dersi.',
        en: 'İngilizcede sıra özne, fiil, nesnedir (The student wrote the lesson). Arapçada fiil öne geçer.'
      },
      tips: [
        'Cümlenin türünü anlamak için yalnızca ilk kelimeye bak: isimse isim cümlesi, fiilse fiil cümlesi. {{الطَّالِبُ كَتَبَ الدَّرْسَ}} isim cümlesidir, çünkü isimle başlıyor.',
        "\"Kim yaptı?\" sorusunun cevabı fâildir (-u), \"neyi yaptı?\" sorusunun cevabı mef'uldür (-e). Türkçedeki belirtme hâli ekini düşün: dersi = {{الدَّرْسَ}}."
      ]
    }
  ],
  keys: [
    'Kelime üç türlüdür: {{اِسْمٌ}} isim, {{فِعْلٌ}} fiil, {{حَرْفٌ}} harf.',
    'İsim ال ya da tenvin alır, harf-i cerden sonra gelebilir; sıfat, zamir ve sayı da isimdir.',
    'Fiil zaman bildirir: mazi {{كَتَبَ}}, muzari {{يَكْتُبُ}}, emir {{اُكْتُبْ}}.',
    'Harf tek başına tam anlam vermez: {{فِي}}، {{وَ}}، {{هَلْ}}، {{لَا}}.',
    'İsim cümlesi = mübteda + haber: {{الْبَيْتُ كَبِيرٌ}}.',
    "Fiil cümlesi = fiil + fâil (-u) + mef'ul (-e): {{كَتَبَ الطَّالِبُ الدَّرْسَ}}."
  ],
  mistakes: [
    { bad: 'الْبَيْتُ الْكَبِيرُ', good: 'الْبَيْتُ كَبِيرٌ', why: "\"Ev büyüktür\" demek için haber ال almaz; iki kelime de ال'lı olursa \"büyük ev\" olur, cümle olmaz." },
    { bad: 'السَّيَّارَةُ جَدِيدٌ', good: 'السَّيَّارَةُ جَدِيدَةٌ', why: 'Haber, dişil mübtedaya uyar.' },
    { bad: 'كَتَبَ الطَّالِبَ الدَّرْسُ', good: 'كَتَبَ الطَّالِبُ الدَّرْسَ', why: "Fâil ötre (-u), mef'ul üstün (-e) alır." },
    { bad: 'الْأَنَا طَالِبٌ', good: 'أَنَا طَالِبٌ', why: 'Zamirler ال almaz; yine de isimdir.' }
  ],
  words: [
    { ar: 'اِسْم', tl: 'ism', tr: 'isim', en: 'noun' },
    { ar: 'فِعْل', tl: "fi'l", tr: 'fiil', en: 'verb' },
    { ar: 'حَرْف', tl: 'harf', tr: 'harf', en: 'particle' },
    { ar: 'كَلِمَة', tl: 'kelime', tr: 'kelime', en: 'word' },
    { ar: 'جُمْلَة', tl: 'cumle', tr: 'cümle', en: 'sentence' },
    { ar: 'مُبْتَدَأ', tl: "mubteda'", tr: 'mübteda', en: 'subject of a nominal sentence' },
    { ar: 'خَبَر', tl: 'haber', tr: 'haber (yüklem)', en: 'predicate' },
    { ar: 'فَاعِل', tl: "fâ'il", tr: 'fâil (işi yapan)', en: 'doer, subject' },
    { ar: 'مَفْعُول', tl: "mef'ûl", tr: "mef'ul (nesne)", en: 'object' },
    { ar: 'طَالِب', tl: 'tâlib', tr: 'öğrenci', en: 'student' },
    { ar: 'دَرْس', tl: 'ders', tr: 'ders', en: 'lesson' },
    { ar: 'كَتَبَ', tl: 'ketebe', tr: 'yazdı', en: 'he wrote' },
    { ar: 'ذَهَبَ', tl: 'zehebe', tr: 'gitti', en: 'he went' },
    { ar: 'شَرِبَ', tl: 'şeribe', tr: 'içti', en: 'he drank' },
    { ar: 'مَاء', tl: 'mâ', tr: 'su', en: 'water' }
  ],
  acts: [
    { type: 'flash', title: 'Terim kartları', desc: 'Dilbilgisi terimlerini ve örnek kelimeleri kartlarla öğren.', glyph: 'كَلِمَة' },
    {
      type: 'match', title: 'Terimleri eşleştir', desc: 'Arapça terimi Türkçe karşılığıyla eşleştir.', glyph: 'اِسْم', items: [
        ['اِسْمٌ', 'isim'], ['فِعْلٌ', 'fiil'], ['حَرْفٌ', 'harf'], ['جُمْلَةٌ', 'cümle'],
        ['مُبْتَدَأٌ', 'mübteda'], ['خَبَرٌ', 'haber'], ['فَاعِلٌ', 'fâil'], ['مَفْعُولٌ بِهِ', "mef'ul"]
      ]
    },
    {
      type: 'mc', title: 'İsim mi, fiil mi, harf mi?', desc: 'Kelimenin hangi türden olduğunu işaretlerinden bul.', glyph: 'ف', items: [
        { q: 'Bu kelime hangi türdendir?', ar: 'كِتَابٌ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'İsim', why: 'Tenvin alıyor ve zaman bildirmiyor.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'كَتَبَ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'Fiil', why: '"Yazdı": geçmiş zaman bildiriyor.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'فِي', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'Harf', why: 'Harf-i cer: anlamı sonraki isimle tamamlanır.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'الْمَدْرَسَةُ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'İsim', why: 'ال alıyor.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'يَذْهَبُ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'Fiil', why: '"Gidiyor": muzari fiil.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'هُوَ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'İsim', why: 'Zamirler Arapçada isim sayılır.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'مِنْ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'Harf', why: 'Harf-i cer: "-den".' },
        { q: 'Bu kelime hangi türdendir?', ar: 'كَبِيرٌ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'İsim', why: 'Sıfatlar da isimdir; tenvin alıyor.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'سَيَكْتُبُ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'Fiil', why: 'Başındaki {{سَـ}} gelecek zaman işaretidir.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'هَلْ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'Harf', why: 'Soru harfi: "mi?"' },
        { q: 'Bu kelime hangi türdendir?', ar: 'أَحْمَدُ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'İsim', why: 'Özel isim.' },
        { q: 'Bu kelime hangi türdendir?', ar: 'اِشْرَبْ', options: ['İsim', 'Fiil', 'Harf'], fixed: true, a: 'Fiil', why: '"İç!": emir fiil.' }
      ]
    },
    {
      type: 'mc', title: 'İsim cümlesi mi, fiil cümlesi mi?', desc: 'Cümlenin ilk kelimesine bakarak türünü bul.', glyph: 'جُمْلَة', items: [
        { q: 'Bu hangi cümle türüdür?', ar: 'الْبَيْتُ كَبِيرٌ', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'İsim cümlesi', tr: 'Ev büyüktür.', why: 'İsimle ({{الْبَيْتُ}}) başlıyor.' },
        { q: 'Bu hangi cümle türüdür?', ar: 'ذَهَبَ أَحْمَدُ إِلَى السُّوقِ', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'Fiil cümlesi', tr: 'Ahmet çarşıya gitti.', why: 'Fiille ({{ذَهَبَ}}) başlıyor.' },
        { q: 'Bu hangi cümle türüdür?', ar: 'أَنَا طَالِبٌ', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'İsim cümlesi', tr: 'Ben öğrenciyim.', why: 'Zamir de isimdir.' },
        { q: 'Bu hangi cümle türüdür?', ar: 'يَشْرَبُ الْوَلَدُ الْحَلِيبَ', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'Fiil cümlesi', tr: 'Çocuk sütü içiyor.', why: 'Muzari fiille başlıyor.' },
        { q: 'Bu hangi cümle türüdür?', ar: 'الطَّالِبُ كَتَبَ الدَّرْسَ', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'İsim cümlesi', tr: 'Öğrenci dersi yazdı.', why: 'İçinde fiil olsa da ilk kelime isim: isim cümlesi.' },
        { q: 'Bu hangi cümle türüdür?', ar: 'الْكِتَابُ عَلَى الطَّاوِلَةِ', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'İsim cümlesi', tr: 'Kitap masanın üzerinde.', why: 'Haber bir harf-i cer grubu.' },
        { q: 'Bu hangi cümle türüdür?', ar: 'قَرَأَتْ فَاطِمَةُ الْقِصَّةَ', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'Fiil cümlesi', tr: 'Fatma hikâyeyi okudu.', why: 'Fiille ({{قَرَأَتْ}}) başlıyor.' },
        { q: 'Bu hangi cümle türüdür?', ar: 'هٰذَا قَلَمٌ', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'İsim cümlesi', tr: 'Bu bir kalemdir.', why: 'İşaret ismiyle başlıyor.' }
      ]
    },
    {
      type: 'fill', title: 'Cümleyi tamamla', desc: "Haberi, fâili ve mef'ulü doğru biçimde seç.", glyph: '___', items: [
        { s: 'السَّيَّارَةُ ___', hint: 'yeni', options: ['جَدِيدَةٌ', 'جَدِيدٌ', 'الْجَدِيدَةُ'], a: 'جَدِيدَةٌ', tr: 'Araba yenidir.', why: 'Haber dişil mübtedaya uyar ve ال almaz.' },
        { s: 'الْبَيْتُ ___', hint: 'büyüktür', options: ['كَبِيرٌ', 'الْكَبِيرُ', 'كَبِيرَةٌ'], a: 'كَبِيرٌ', tr: 'Ev büyüktür.', why: 'Haber ال almaz; alırsa "büyük ev" olur.' },
        { s: 'كَتَبَ ___ الدَّرْسَ', hint: 'öğrenci (fâil)', options: ['الطَّالِبُ', 'الطَّالِبَ', 'الطَّالِبِ'], a: 'الطَّالِبُ', tr: 'Öğrenci dersi yazdı.', why: 'Fâil ötre (-u) alır.' },
        { s: 'شَرِبَ أَحْمَدُ ___', hint: "suyu (mef'ul)", options: ['الْمَاءَ', 'الْمَاءُ', 'الْمَاءِ'], a: 'الْمَاءَ', tr: 'Ahmet suyu içti.', why: "Mef'ul üstün (-e) alır." },
        { s: 'ذَهَبْتُ ___ الْمَدْرَسَةِ', hint: '-e (harf)', options: ['إِلَى', 'فِي', 'هَلْ'], a: 'إِلَى', tr: 'Okula gittim.', why: 'Yön bildiren harf-i cer {{إِلَى}}.' },
        { s: 'الطُّلَّابُ ___', hint: 'çalışkandır', options: ['مُجْتَهِدُونَ', 'مُجْتَهِدٌ', 'الْمُجْتَهِدُونَ'], a: 'مُجْتَهِدُونَ', tr: 'Öğrenciler çalışkandır.', why: 'İnsanlardan oluşan çoğul mübtedaya çoğul haber gelir.' }
      ]
    },
    {
      type: 'order', title: 'Cümle kur', desc: 'Kelimeleri doğru sıraya dizerek isim ve fiil cümleleri kur.', glyph: 'كَتَبَ', items: [
        { tr: 'Ev büyüktür.', w: ['الْبَيْتُ', 'كَبِيرٌ'] },
        { tr: 'Ben öğrenciyim.', w: ['أَنَا', 'طَالِبٌ'] },
        { tr: 'Kitap masanın üzerinde.', w: ['الْكِتَابُ', 'عَلَى', 'الطَّاوِلَةِ'] },
        { tr: 'Öğrenci dersi yazdı.', w: ['كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ'], alt: [['الطَّالِبُ', 'كَتَبَ', 'الدَّرْسَ']] },
        { tr: 'Ahmet suyu içti.', w: ['شَرِبَ', 'أَحْمَدُ', 'الْمَاءَ'], alt: [['أَحْمَدُ', 'شَرِبَ', 'الْمَاءَ']] },
        { tr: 'Fatma okula gitti.', w: ['ذَهَبَتْ', 'فَاطِمَةُ', 'إِلَى', 'الْمَدْرَسَةِ'], alt: [['فَاطِمَةُ', 'ذَهَبَتْ', 'إِلَى', 'الْمَدْرَسَةِ']] }
      ]
    },
    {
      type: 'test', title: 'Kelime ve cümle testi', desc: 'Dersin tamamını kapsayan karma değerlendirme.', glyph: '؟', items: [
        { q: 'Arapçada kelime kaç türe ayrılır?', options: ['3', '8', '10', '2'], a: '3', why: 'İsim, fiil ve harf.' },
        { q: 'Hangisi isimdir?', options: ['الْقَلَمُ', 'كَتَبَ', 'فِي', 'لَمْ'], a: 'الْقَلَمُ', why: 'ال alıyor.' },
        { q: 'Hangisi fiildir?', options: ['يَدْرُسُ', 'مَدْرَسَةٌ', 'دَرْسٌ', 'عَلَى'], a: 'يَدْرُسُ', why: '"Ders çalışıyor": muzari fiil.' },
        { t: 'tf', s: 'Sıfatlar ve zamirler Arapçada isim sayılır.', a: true },
        { t: 'tf', s: '{{الْبَيْتُ الْكَبِيرُ}} "Ev büyüktür." demektir.', a: false, why: "İki kelime de ال'lı olduğu için \"büyük ev\" demektir." },
        { q: '{{كَتَبَ الطَّالِبُ الدَّرْسَ}} cümlesinde fâil hangisidir?', options: ['الطَّالِبُ', 'كَتَبَ', 'الدَّرْسَ'], a: 'الطَّالِبُ', why: 'İşi yapan ve ötre alan kelime.' },
        { q: '{{الطَّالِبُ مُجْتَهِدٌ}} hangi cümle türüdür?', options: ['İsim cümlesi', 'Fiil cümlesi'], fixed: true, a: 'İsim cümlesi' },
        { t: 'order', tr: 'Çocuk bir kitap okuyor.', w: ['يَقْرَأُ', 'الْوَلَدُ', 'كِتَابًا'] },
        { t: 'fill', s: 'الْبِنْتُ ___', hint: 'mutludur', options: ['سَعِيدَةٌ', 'سَعِيدٌ', 'السَّعِيدَةُ'], a: 'سَعِيدَةٌ', tr: 'Kız mutludur.', why: 'Dişil mübteda, dişil ve ال\'sız haber.' }
      ]
    }
  ]
});
