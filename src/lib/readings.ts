/* Okuma metinleri: derslerdeki kelimelerle yazılmış kısa hikâyeler.
   Her cümle kelime kelime yazılır ([Arapça, Türkçe karşılık]); sayfada kelimeye dokununca anlamı ve sesi çıkar.
   Cümlenin Arapçası kelimelerin boşlukla birleşimidir, yani kelime ile cümle hiçbir zaman kaymaz.
   Okuma ilerlemesi derslerdeki etkinlikler gibi saklanır: konu READING_TOPIC, etkinlik anahtarı hikâyenin slug'ı. */

export type Token = [ar: string, tr: string];
export type Sentence = { w: Token[]; tr: string };
export type ReadingQ = { q: string; options: string[]; a: string };
export type Reading = {
  slug: string;
  title: string;
  ar: string;
  level: 'Başlangıç' | 'Orta';
  /** İlgili ders (kelimeleri bu derste) */
  topic: string;
  desc: string;
  sentences: Sentence[];
  questions: ReadingQ[];
};

export const READING_TOPIC = 'okuma';

const s = (tr: string, ...w: Token[]): Sentence => ({ w, tr });

export const READINGS: Reading[] = [
  {
    slug: 'ailem', title: 'Ailem', ar: 'أُسْرَتِي', level: 'Başlangıç', topic: 'aile',
    desc: 'Ahmed küçük ailesini anlatıyor: anne, baba, kardeşler, dede ve nine.',
    sentences: [
      s('Ben Ahmed\'im.', ['أَنَا', 'ben'], ['أَحْمَدُ.', 'Ahmed']),
      s('Küçük bir ailem var.', ['عِنْدِي', 'benim var'], ['أُسْرَةٌ', 'aile'], ['صَغِيرَةٌ.', 'küçük']),
      s('Babam doktor, annem öğretmen.', ['أَبِي', 'babam'], ['طَبِيبٌ،', 'doktor'], ['وَأُمِّي', 've annem'], ['مُعَلِّمَةٌ.', 'öğretmen (kadın)']),
      s('Bir erkek kardeşim ve bir kız kardeşim var.', ['لِي', 'benim var'], ['أَخٌ', 'erkek kardeş'], ['وَاحِدٌ', 'bir'], ['وَأُخْتٌ', 've kız kardeş'], ['وَاحِدَةٌ.', 'bir']),
      s('Kardeşimin adı Yusuf, o okulda öğrenci.', ['اِسْمُ', 'adı'], ['أَخِي', 'kardeşimin'], ['يُوسُفُ،', 'Yusuf'], ['وَهُوَ', 've o'], ['طَالِبٌ', 'öğrenci'], ['فِي', '-de'], ['الْمَدْرَسَةِ.', 'okul']),
      s('Kız kardeşimin adı Fatıma, o küçük.', ['اِسْمُ', 'adı'], ['أُخْتِي', 'kız kardeşimin'], ['فَاطِمَةُ،', 'Fatıma'], ['وَهِيَ', 've o (kadın)'], ['صَغِيرَةٌ.', 'küçük']),
      s('Dedem ve ninem bizimle evde oturuyor.', ['جَدِّي', 'dedem'], ['وَجَدَّتِي', 've ninem'], ['يَسْكُنَانِ', '(ikisi) oturuyor'], ['مَعَنَا', 'bizimle'], ['فِي', '-de'], ['الْبَيْتِ.', 'ev']),
      s('Ailemi çok seviyorum.', ['أُحِبُّ', 'seviyorum'], ['أُسْرَتِي', 'ailemi'], ['كَثِيرًا.', 'çok'])
    ],
    questions: [
      { q: 'Ahmed\'in babasının mesleği ne?', options: ['Doktor', 'Öğretmen', 'Öğrenci', 'Mühendis'], a: 'Doktor' },
      { q: 'Yusuf kim?', options: ['Ahmed\'in erkek kardeşi', 'Ahmed\'in babası', 'Ahmed\'in dedesi', 'Ahmed\'in arkadaşı'], a: 'Ahmed\'in erkek kardeşi' },
      { q: 'Kimler onlarla birlikte oturuyor?', options: ['Dede ve nine', 'Amca ve hala', 'Dayı ve teyze', 'Kimse'], a: 'Dede ve nine' },
      { q: '"مُعَلِّمَةٌ" ne demek?', options: ['Öğretmen (kadın)', 'Doktor', 'Öğrenci', 'Kız kardeş'], a: 'Öğretmen (kadın)' }
    ]
  },
  {
    slug: 'evimiz', title: 'Evimiz', ar: 'بَيْتُنَا', level: 'Başlangıç', topic: 'evim',
    desc: 'Odalar, mutfak, bahçe: bir çocuk evini ve evdekileri anlatıyor.',
    sentences: [
      s('Bu bizim evimiz.', ['هَذَا', 'bu'], ['بَيْتُنَا.', 'evimiz']),
      s('Evimiz büyük ve güzel.', ['بَيْتُنَا', 'evimiz'], ['كَبِيرٌ', 'büyük'], ['وَجَمِيلٌ.', 've güzel']),
      s('Evde üç oda, bir mutfak ve bir banyo var.', ['فِي', '-de'], ['الْبَيْتِ', 'ev'], ['ثَلَاثُ', 'üç'], ['غُرَفٍ', 'oda'], ['وَمَطْبَخٌ', 've mutfak'], ['وَحَمَّامٌ.', 've banyo']),
      s('Odam küçük; içinde bir yatak ve bir çalışma masası var.', ['غُرْفَتِي', 'odam'], ['صَغِيرَةٌ،', 'küçük'], ['وَفِيهَا', 've içinde'], ['سَرِيرٌ', 'yatak'], ['وَمَكْتَبٌ.', 've çalışma masası']),
      s('Annem şimdi mutfakta.', ['أُمِّي', 'annem'], ['فِي', '-de'], ['الْمَطْبَخِ', 'mutfak'], ['الْآنَ.', 'şimdi']),
      s('Babam da oturma odasında oturuyor.', ['وَأَبِي', 've babam'], ['يَجْلِسُ', 'oturuyor'], ['فِي', '-de'], ['غُرْفَةِ', 'odası'], ['الْجُلُوسِ.', 'oturma']),
      s('Evin önünde küçük bir bahçe var.', ['أَمَامَ', 'önünde'], ['الْبَيْتِ', 'evin'], ['حَدِيقَةٌ', 'bahçe'], ['صَغِيرَةٌ.', 'küçük'])
    ],
    questions: [
      { q: 'Evde kaç oda var?', options: ['Üç', 'İki', 'Dört', 'Bir'], a: 'Üç' },
      { q: 'Anne şimdi nerede?', options: ['Mutfakta', 'Bahçede', 'Oturma odasında', 'Okulda'], a: 'Mutfakta' },
      { q: 'Evin önünde ne var?', options: ['Küçük bir bahçe', 'Büyük bir araba', 'Bir okul', 'Bir dükkân'], a: 'Küçük bir bahçe' },
      { q: 'Çocuğun odasında neler var?', options: ['Yatak ve çalışma masası', 'Dolap ve sandalye', 'Televizyon ve kanepe', 'Hiçbir şey'], a: 'Yatak ve çalışma masası' }
    ]
  },
  {
    slug: 'okulda-bir-gun', title: 'Okulda bir gün', ar: 'يَوْمٌ فِي الْمَدْرَسَةِ', level: 'Başlangıç', topic: 'okulda',
    desc: 'Otobüs, sınıf, tahta ve defter: bir öğrencinin okul günü.',
    sentences: [
      s('Her gün okula giderim.', ['أَذْهَبُ', 'giderim'], ['إِلَى', '-e'], ['الْمَدْرَسَةِ', 'okul'], ['كُلَّ', 'her'], ['يَوْمٍ.', 'gün']),
      s('Arkadaşım Ali ile otobüsle giderim.', ['أَذْهَبُ', 'giderim'], ['بِالْحَافِلَةِ', 'otobüsle'], ['مَعَ', 'ile'], ['صَدِيقِي', 'arkadaşım'], ['عَلِيٍّ.', 'Ali']),
      s('Sınıfımız büyük, içinde yirmi öğrenci var.', ['فَصْلُنَا', 'sınıfımız'], ['كَبِيرٌ،', 'büyük'], ['وَفِيهِ', 've içinde'], ['عِشْرُونَ', 'yirmi'], ['طَالِبًا.', 'öğrenci']),
      s('Öğretmen tahtaya yazıyor.', ['الْمُعَلِّمُ', 'öğretmen'], ['يَكْتُبُ', 'yazıyor'], ['عَلَى', 'üzerine'], ['السَّبُّورَةِ.', 'tahta']),
      s('Biz okuyoruz ve deftere yazıyoruz.', ['نَحْنُ', 'biz'], ['نَقْرَأُ', 'okuyoruz'], ['وَنَكْتُبُ', 've yazıyoruz'], ['فِي', '-e (içine)'], ['الدَّفْتَرِ.', 'defter']),
      s('Arapça dersini çok severim.', ['أُحِبُّ', 'severim'], ['دَرْسَ', 'dersini'], ['اللُّغَةِ', 'dil'], ['الْعَرَبِيَّةِ', 'Arapça'], ['كَثِيرًا.', 'çok']),
      s('Saat ikide eve dönerim.', ['فِي', '-de'], ['السَّاعَةِ', 'saat'], ['الثَّانِيَةِ', 'iki'], ['أَرْجِعُ', 'dönerim'], ['إِلَى', '-e'], ['الْبَيْتِ.', 'ev'])
    ],
    questions: [
      { q: 'Okula nasıl gidiyor?', options: ['Otobüsle', 'Yürüyerek', 'Arabayla', 'Trenle'], a: 'Otobüsle' },
      { q: 'Sınıfta kaç öğrenci var?', options: ['Yirmi', 'On', 'Otuz', 'On beş'], a: 'Yirmi' },
      { q: 'Hangi dersi çok seviyor?', options: ['Arapça', 'Matematik', 'Tarih', 'Fen'], a: 'Arapça' },
      { q: 'Eve saat kaçta dönüyor?', options: ['İkide', 'Üçte', 'Birde', 'Dörtte'], a: 'İkide' }
    ]
  },
  {
    slug: 'lokantada', title: 'Lokantada', ar: 'فِي الْمَطْعَمِ', level: 'Başlangıç', topic: 'yemek',
    desc: 'Baba ile oğul lokantada sipariş veriyor: tavuk, pilav, balık ve salata.',
    sentences: [
      s('Babamla lokantaya gittim.', ['ذَهَبْتُ', 'gittim'], ['مَعَ', 'ile'], ['أَبِي', 'babam'], ['إِلَى', '-e'], ['الْمَطْعَمِ.', 'lokanta']),
      s('Pencereye yakın bir masaya oturduk.', ['جَلَسْنَا', 'oturduk'], ['عَلَى', '-e (üzerine)'], ['طَاوِلَةٍ', 'masa'], ['قَرِيبَةٍ', 'yakın'], ['مِنَ', '-e'], ['النَّافِذَةِ.', 'pencere']),
      s('Garson geldi ve "Ne istersiniz?" dedi.', ['جَاءَ', 'geldi'], ['النَّادِلُ', 'garson'], ['وَقَالَ:', 've dedi'], ['مَاذَا', 'ne'], ['تُرِيدَانِ؟', 'istersiniz (ikiniz)']),
      s('Babam "Tavuk ve pilav istiyorum." dedi.', ['قَالَ', 'dedi'], ['أَبِي:', 'babam'], ['أُرِيدُ', 'istiyorum'], ['دَجَاجًا', 'tavuk'], ['وَأَرُزًّا.', 've pirinç (pilav)']),
      s('Ben de "Balık ve salata istiyorum." dedim.', ['وَقُلْتُ', 've dedim'], ['أَنَا:', 'ben'], ['أُرِيدُ', 'istiyorum'], ['سَمَكًا', 'balık'], ['وَسَلَطَةً.', 've salata']),
      s('Soğuk portakal suyu içtik.', ['شَرِبْنَا', 'içtik'], ['عَصِيرَ', 'suyu'], ['بُرْتُقَالٍ', 'portakal'], ['بَارِدًا.', 'soğuk']),
      s('Yemek çok lezzetliydi.', ['كَانَ', 'idi'], ['الطَّعَامُ', 'yemek'], ['لَذِيذًا', 'lezzetli'], ['جِدًّا.', 'çok']),
      s('Sonunda babam hesabı ödedi.', ['فِي', '-de'], ['النِّهَايَةِ', 'sonunda'], ['دَفَعَ', 'ödedi'], ['أَبِي', 'babam'], ['الْحِسَابَ.', 'hesap'])
    ],
    questions: [
      { q: 'Baba ne istedi?', options: ['Tavuk ve pilav', 'Balık ve salata', 'Et ve ekmek', 'Çorba'], a: 'Tavuk ve pilav' },
      { q: 'Ne içtiler?', options: ['Portakal suyu', 'Çay', 'Kahve', 'Su'], a: 'Portakal suyu' },
      { q: 'Hesabı kim ödedi?', options: ['Baba', 'Anlatan çocuk', 'Garson', 'Anne'], a: 'Baba' },
      { q: 'Masaları nerede?', options: ['Pencereye yakın', 'Kapının yanında', 'Bahçede', 'Mutfakta'], a: 'Pencereye yakın' }
    ]
  },
  {
    slug: 'pazarda', title: 'Pazarda', ar: 'فِي السُّوقِ', level: 'Başlangıç', topic: 'yemek',
    desc: 'Fatıma cuma günü pazara gidiyor, fiyat soruyor ve pazarlık ediyor.',
    sentences: [
      s('Fatıma cuma günü pazara gitti.', ['ذَهَبَتْ', 'gitti (kadın)'], ['فَاطِمَةُ', 'Fatıma'], ['إِلَى', '-e'], ['السُّوقِ', 'pazar'], ['يَوْمَ', 'günü'], ['الْجُمُعَةِ.', 'cuma']),
      s('Ekmek, süt ve yumurta aldı.', ['اِشْتَرَتْ', 'satın aldı (kadın)'], ['خُبْزًا', 'ekmek'], ['وَحَلِيبًا', 've süt'], ['وَبَيْضًا.', 've yumurta']),
      s('Sonra meyve satıcısına gitti.', ['ثُمَّ', 'sonra'], ['ذَهَبَتْ', 'gitti (kadın)'], ['إِلَى', '-e'], ['بَائِعِ', 'satıcısı'], ['الْفَوَاكِهِ.', 'meyveler']),
      s('"Elmanın kilosu kaça?" diye sordu.', ['سَأَلَتْ:', 'sordu (kadın)'], ['بِكَمْ', 'kaça'], ['كِيلُو', 'kilosu'], ['التُّفَّاحِ؟', 'elma']),
      s('Satıcı "On cüneyh." dedi.', ['قَالَ', 'dedi'], ['الْبَائِعُ:', 'satıcı'], ['بِعَشَرَةِ', 'on (...-a)'], ['جُنَيْهَاتٍ.', 'cüneyh (para birimi)']),
      s('Fatıma "Bu pahalı!" dedi.', ['قَالَتْ', 'dedi (kadın)'], ['فَاطِمَةُ:', 'Fatıma'], ['هَذَا', 'bu'], ['غَالٍ!', 'pahalı']),
      s('Sonunda bir kilo elmayı sekiz cüneyhe aldı.', ['فِي', '-de'], ['النِّهَايَةِ', 'sonunda'], ['اِشْتَرَتْ', 'satın aldı (kadın)'], ['كِيلُو', 'kilo'], ['تُفَّاحٍ', 'elma'], ['بِثَمَانِيَةِ', 'sekiz (...-e)'], ['جُنَيْهَاتٍ.', 'cüneyh'])
    ],
    questions: [
      { q: 'Fatıma pazara hangi gün gitti?', options: ['Cuma', 'Pazartesi', 'Pazar', 'Cumartesi'], a: 'Cuma' },
      { q: 'Fatıma ilk olarak neler aldı?', options: ['Ekmek, süt ve yumurta', 'Elma ve muz', 'Et ve balık', 'Çay ve şeker'], a: 'Ekmek, süt ve yumurta' },
      { q: 'Satıcı elmanın kilosuna ilk önce kaç cüneyh dedi?', options: ['On', 'Sekiz', 'Beş', 'Yirmi'], a: 'On' },
      { q: 'Fatıma elmayı sonunda kaça aldı?', options: ['Sekiz cüneyhe', 'On cüneyhe', 'Altı cüneyhe', 'Dokuz cüneyhe'], a: 'Sekiz cüneyhe' }
    ]
  },
  {
    slug: 'yol-sormak', title: 'Yol sormak', ar: 'السُّؤَالُ عَنِ الطَّرِيقِ', level: 'Başlangıç', topic: 'sehirde',
    desc: 'Kahire\'de bir turist müzeyi arıyor ve yoldan geçen birine soruyor.',
    sentences: [
      s('Kahire şehrinde bir turistim.', ['أَنَا', 'ben'], ['سَائِحٌ', 'turist'], ['فِي', '-de'], ['مَدِينَةِ', 'şehri'], ['الْقَاهِرَةِ.', 'Kahire']),
      s('Sokakta bir adama "Müze nerede?" diye sordum.', ['سَأَلْتُ', 'sordum'], ['رَجُلًا', 'bir adama'], ['فِي', '-de'], ['الشَّارِعِ:', 'sokak'], ['أَيْنَ', 'nerede'], ['الْمَتْحَفُ؟', 'müze']),
      s('Adam "Düz git, sonra sağdaki ilk sokağa sap." dedi.', ['قَالَ', 'dedi'], ['الرَّجُلُ:', 'adam'], ['اِذْهَبْ', 'git'], ['مُسْتَقِيمًا،', 'dümdüz'], ['ثُمَّ', 'sonra'], ['خُذْ', 'al (sap)'], ['أَوَّلَ', 'ilk'], ['شَارِعٍ', 'sokak'], ['عَلَى', '-de'], ['الْيَمِينِ.', 'sağ']),
      s('Müze büyük caminin yanında.', ['الْمَتْحَفُ', 'müze'], ['بِجَانِبِ', 'yanında'], ['الْمَسْجِدِ', 'caminin'], ['الْكَبِيرِ.', 'büyük']),
      s('Uzak mı?', ['هَلْ', 'mi (soru)'], ['هُوَ', 'o'], ['بَعِيدٌ؟', 'uzak']),
      s('Hayır, yakın. Sadece beş dakika yürürsün.', ['لَا،', 'hayır'], ['هُوَ', 'o'], ['قَرِيبٌ.', 'yakın'], ['تَمْشِي', 'yürürsün'], ['خَمْسَ', 'beş'], ['دَقَائِقَ', 'dakika'], ['فَقَطْ.', 'sadece']),
      s('Adama teşekkür ettim ve müzeye yürüdüm.', ['شَكَرْتُ', 'teşekkür ettim'], ['الرَّجُلَ', 'adama'], ['وَمَشَيْتُ', 've yürüdüm'], ['إِلَى', '-e'], ['الْمَتْحَفِ.', 'müze'])
    ],
    questions: [
      { q: 'Turist neresini arıyor?', options: ['Müzeyi', 'Camiyi', 'Oteli', 'Hastaneyi'], a: 'Müzeyi' },
      { q: 'Müze nerede?', options: ['Büyük caminin yanında', 'Okulun karşısında', 'Parkın içinde', 'Hastanenin arkasında'], a: 'Büyük caminin yanında' },
      { q: 'Müze yürüyerek ne kadar uzakta?', options: ['Beş dakika', 'Yarım saat', 'Bir saat', 'On dakika'], a: 'Beş dakika' },
      { q: 'Turist hangi sokağa sapmalı?', options: ['Sağdaki ilk sokağa', 'Soldaki ilk sokağa', 'Sağdaki ikinci sokağa', 'Hiç sapmamalı'], a: 'Sağdaki ilk sokağa' }
    ]
  },
  {
    slug: 'benim-gunum', title: 'Benim günüm', ar: 'يَوْمِي', level: 'Orta', topic: 'saatler',
    desc: 'Sabah uyanmaktan gece uyumaya kadar saatlerle bir gün.',
    sentences: [
      s('Sabah saat altıda uyanırım.', ['أَسْتَيْقِظُ', 'uyanırım'], ['فِي', '-de'], ['السَّاعَةِ', 'saat'], ['السَّادِسَةِ', 'altı'], ['صَبَاحًا.', 'sabah']),
      s('Yüzümü yıkarım ve namaz kılarım.', ['أَغْسِلُ', 'yıkarım'], ['وَجْهِي', 'yüzümü'], ['وَأُصَلِّي.', 've namaz kılarım']),
      s('Sonra ailemle kahvaltı ederim.', ['ثُمَّ', 'sonra'], ['أَتَنَاوَلُ', 'yerim (yaparım)'], ['الْفُطُورَ', 'kahvaltı'], ['مَعَ', 'ile'], ['أُسْرَتِي.', 'ailem']),
      s('Saat sekizden dörde kadar bir ofiste çalışırım.', ['أَعْمَلُ', 'çalışırım'], ['فِي', '-de'], ['مَكْتَبٍ', 'ofis'], ['مِنَ', '-den'], ['السَّاعَةِ', 'saat'], ['الثَّامِنَةِ', 'sekiz'], ['إِلَى', '-e kadar'], ['السَّاعَةِ', 'saat'], ['الرَّابِعَةِ.', 'dört']),
      s('Akşam kitap okurum ya da televizyon izlerim.', ['فِي', '-de'], ['الْمَسَاءِ', 'akşam'], ['أَقْرَأُ', 'okurum'], ['كِتَابًا', 'kitap'], ['أَوْ', 'ya da'], ['أُشَاهِدُ', 'izlerim'], ['التِّلْفَازَ.', 'televizyon']),
      s('Gece saat onda uyurum.', ['أَنَامُ', 'uyurum'], ['فِي', '-de'], ['السَّاعَةِ', 'saat'], ['الْعَاشِرَةِ', 'on'], ['لَيْلًا.', 'gece'])
    ],
    questions: [
      { q: 'Saat kaçta uyanıyor?', options: ['Altıda', 'Yedide', 'Sekizde', 'Beşte'], a: 'Altıda' },
      { q: 'Nerede çalışıyor?', options: ['Bir ofiste', 'Okulda', 'Hastanede', 'Dükkânda'], a: 'Bir ofiste' },
      { q: 'Akşam ne yapıyor?', options: ['Kitap okur ya da televizyon izler', 'Spor yapar', 'Yemek pişirir', 'Çalışmaya devam eder'], a: 'Kitap okur ya da televizyon izler' },
      { q: 'Saat kaçta uyuyor?', options: ['Onda', 'On birde', 'Dokuzda', 'On ikide'], a: 'Onda' }
    ]
  },
  {
    slug: 'yaz-tatili', title: 'Yaz tatili', ar: 'الْعُطْلَةُ الصَّيْفِيَّةُ', level: 'Orta', topic: 'renkler',
    desc: 'Deniz, kum, mavi gökyüzü ve kırmızı şemsiye: renklerle bir tatil.',
    sentences: [
      s('Yazın denize gideriz.', ['فِي', '-de'], ['الصَّيْفِ', 'yaz'], ['نُسَافِرُ', 'yolculuk ederiz'], ['إِلَى', '-e'], ['الْبَحْرِ.', 'deniz']),
      s('Hava sıcak, gökyüzü mavi.', ['الْجَوُّ', 'hava'], ['حَارٌّ', 'sıcak'], ['وَالسَّمَاءُ', 've gökyüzü'], ['زَرْقَاءُ.', 'mavi']),
      s('Sahile yakın küçük bir otelde kalırız.', ['نَسْكُنُ', 'kalırız'], ['فِي', '-de'], ['فُنْدُقٍ', 'otel'], ['صَغِيرٍ', 'küçük'], ['قَرِيبٍ', 'yakın'], ['مِنَ', '-e'], ['الشَّاطِئِ.', 'sahil']),
      s('Küçük kardeşim sarı kumla oynar.', ['أَخِي', 'kardeşim'], ['الصَّغِيرُ', 'küçük'], ['يَلْعَبُ', 'oynar'], ['بِالرَّمْلِ', 'kumla'], ['الْأَصْفَرِ.', 'sarı']),
      s('Ben de babamla denizde yüzerim.', ['وَأَنَا', 've ben'], ['أَسْبَحُ', 'yüzerim'], ['فِي', '-de'], ['الْبَحْرِ', 'deniz'], ['مَعَ', 'ile'], ['أَبِي.', 'babam']),
      s('Annem kırmızı bir şemsiyenin altında oturur ve okur.', ['أُمِّي', 'annem'], ['تَجْلِسُ', 'oturur'], ['تَحْتَ', 'altında'], ['شَمْسِيَّةٍ', 'şemsiye'], ['حَمْرَاءَ', 'kırmızı'], ['وَتَقْرَأُ.', 've okur']),
      s('Yaz tatili çok güzel.', ['الْعُطْلَةُ', 'tatil'], ['الصَّيْفِيَّةُ', 'yaz (yazlık)'], ['جَمِيلَةٌ', 'güzel'], ['جِدًّا.', 'çok'])
    ],
    questions: [
      { q: 'Yazın nereye gidiyorlar?', options: ['Denize', 'Dağa', 'Köye', 'Başka bir şehre'], a: 'Denize' },
      { q: 'Gökyüzü ne renk?', options: ['Mavi', 'Gri', 'Beyaz', 'Sarı'], a: 'Mavi' },
      { q: 'Küçük kardeş ne yapıyor?', options: ['Kumla oynuyor', 'Yüzüyor', 'Kitap okuyor', 'Uyuyor'], a: 'Kumla oynuyor' },
      { q: 'Annenin şemsiyesi ne renk?', options: ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı'], a: 'Kırmızı' }
    ]
  }
];

/** Cümlenin Arapçası (kelimelerin birleşimi) */
export const sentenceAr = (x: Sentence) => x.w.map((t) => t[0]).join(' ');
/** Seslendirme ve sözlük için noktalamasız kelime */
export const bareWord = (ar: string) => ar.replace(/[؟،؛.!?,:;"'()]/g, '').trim();
export const readingBySlug = (slug: string) => READINGS.find((r) => r.slug === slug) || null;
export const wordCount = (r: Reading) => r.sentences.reduce((n, x) => n + x.w.length, 0);
/** Tahmini okuma süresi (dakika): soruları da sayar */
export const readMins = (r: Reading) => Math.max(3, Math.round(wordCount(r) / 12 + r.questions.length * 0.5));
