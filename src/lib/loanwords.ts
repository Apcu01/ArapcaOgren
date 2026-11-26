/* ---------- Türkçedeki Arapça kelimeler ----------
   Türkçede her gün kullanılan kelimelerin Arapça aslı. same: Arapçada da aynı anlama gelir; değilse "anlamı farklı"
   (yalancı eş). sg: Türkçeye Arapça çoğul biçimiyle geçenlerde tekili. Sesleri scripts/audio-texts.ts toplar. */
import { shuffle } from './text';
import type { EQ } from './endless';

export type LoanGroup = 'okul' | 'ev' | 'zaman' | 'insan' | 'sehir' | 'gunluk' | 'cogul';
export type Loan = {
  /** Arapçası (harekeli, sözlük biçimi) */
  ar: string;
  tl: string;
  /** Türkçedeki kelime */
  tr: string;
  /** Arapçadaki anlamı */
  mean: string;
  same: boolean;
  note?: string;
  /** Çoğuldan gelenlerde tekili */
  sg?: string;
  g: LoanGroup;
};

export const LOAN_GROUPS: { id: LoanGroup; title: string; sub: string }[] = [
  { id: 'okul', title: 'Okulda ve kitapta', sub: 'Ders, kalem, kitap: okul kelimelerinin çoğu Arapçadan.' },
  { id: 'ev', title: 'Evde ve sofrada', sub: 'Sabahtan akşama evde kullandıklarımız.' },
  { id: 'zaman', title: 'Zaman ve doğa', sub: 'Saat, dakika, dünya, tabiat.' },
  { id: 'insan', title: 'İnsanlar ve duygular', sub: 'Sabır, aşk, hüzün: duyguların dili.' },
  { id: 'sehir', title: 'Şehirde, işte ve devlette', sub: 'Dükkândan mahkemeye.' },
  { id: 'gunluk', title: 'Günlük konuşmada', sub: 'Merhaba, tamam, lazım: her gün ağzımızda.' },
  { id: 'cogul', title: 'Arapça çoğuldan gelenler', sub: 'Türkçede tek bir şey için kullanılır ama Arapçada çoğuldur: eşya "şeyler", evlat "çocuklar".' }
];

const L = (g: LoanGroup, ar: string, tl: string, tr: string, mean: string, same: boolean, note?: string, sg?: string): Loan =>
  ({ g, ar, tl, tr, mean, same, ...(note ? { note } : {}), ...(sg ? { sg } : {}) });

export const LOANWORDS: Loan[] = [
  /* Okulda ve kitapta */
  L('okul', 'كِتَاب', 'kitâb', 'kitap', 'kitap', true),
  L('okul', 'قَلَم', 'kalem', 'kalem', 'kalem', true),
  L('okul', 'دَفْتَر', 'defter', 'defter', 'defter', true),
  L('okul', 'دَرْس', 'ders', 'ders', 'ders', true),
  L('okul', 'عِلْم', '‘ilm', 'ilim', 'bilgi, bilim', true),
  L('okul', 'كَلِمَة', 'kelime', 'kelime', 'kelime, söz', true),
  L('okul', 'حَرْف', 'harf', 'harf', 'harf', true),
  L('okul', 'سُؤَال', "su'âl", 'sual', 'soru', true),
  L('okul', 'جَوَاب', 'cevâb', 'cevap', 'cevap', true),
  L('okul', 'اِمْتِحَان', 'imtihân', 'imtihan', 'sınav', true),
  L('okul', 'مُعَلِّم', 'mu‘allim', 'muallim', 'öğretmen', true),
  L('okul', 'فِكْر', 'fikr', 'fikir', 'düşünce', true),
  L('okul', 'عَقْل', '‘akl', 'akıl', 'akıl', true),
  L('okul', 'مَقَالَة', 'makâle', 'makale', 'makale, yazı', true),
  L('okul', 'مَدْرَسَة', 'medrese', 'medrese', 'okul', false, 'Türkçede medrese eski zamanın din ve bilim okuludur. Arapçada ilkokul, ortaokul, lise: hepsi {{مَدْرَسَة}}.'),
  L('okul', 'مَكْتَب', 'mekteb', 'mektep', 'büro, çalışma masası', false, 'Türkçede mektep okul demektir. Arapçada okul {{مَدْرَسَة}}; {{مَكْتَب}} ise yazı yazılan yer, yani büro ya da masa.'),
  L('okul', 'جَامِعَة', 'câmi‘a', 'camia', 'üniversite', false, 'Türkçede camia topluluk demektir (spor camiası). Arapçada "bir araya toplayan" anlamından üniversite olmuş. Aynı kökten {{جَامِع}} cami demektir.'),
  L('okul', 'طَالِب', 'tâlib', 'talip', 'öğrenci', false, 'Türkçede talip isteyen, aday demektir. Arapçada {{طَالِب}} "bilgi isteyen", yani öğrenci. Çoğulu {{طَلَبَة}} Türkçeye talebe olarak geçmiş.'),
  L('okul', 'كُرْسِيّ', 'kursiyy', 'kürsü', 'sandalye', false, 'Türkçede kürsü konuşmacının durduğu yüksek yerdir. Arapçada her sandalye {{كُرْسِيّ}}.'),
  L('okul', 'صَفْحَة', 'safha', 'safha', 'sayfa', false, 'Türkçede safha aşama, evre demektir (son safha). Arapçada kitabın sayfası.'),
  L('okul', 'صَحِيفَة', 'sahîfe', 'sayfa (sahife)', 'gazete', false, 'Türkçedeki sayfa, eski adıyla sahife, bu kelimeden gelir. Arapçada {{صَحِيفَة}} bugün gazete demektir; kitabın sayfası {{صَفْحَة}}.'),
  L('okul', 'لُغَة', 'luga', 'lügat', 'dil (lisan)', false, 'Türkçede lügat sözlük demektir. Arapçada {{لُغَة}} bir dil: {{اللُّغَةُ الْعَرَبِيَّةُ}} Arapça.'),
  L('okul', 'رِسَالَة', 'risâle', 'risale', 'mektup, mesaj', false, 'Türkçede risale küçük kitap demektir. Arapçada gönderilen her mektup ve mesaj {{رِسَالَة}}.'),
  L('okul', 'مَكْتُوب', 'mektûb', 'mektup', 'yazılmış, yazılı', false, 'Türkçedeki mektup bu kelimeden gelir ama Arapçada {{مَكْتُوب}} "yazılmış" demektir. Mektup Arapçada {{رِسَالَة}}.'),
  L('okul', 'كَاتِب', 'kâtib', 'kâtip', 'yazar', false, 'Türkçede kâtip yazı işlerine bakan memurdur. Arapçada {{كَاتِب}} önce kitap yazan kişi, yani yazar.'),
  L('okul', 'فَنّ', 'fenn', 'fen', 'sanat', false, 'Türkçede fen bilim demektir (fen bilgisi). Arapçada {{فَنّ}} sanattır: resim, müzik, tiyatro.'),
  L('okul', 'صَنْعَة', 'san‘a', 'sanat', 'zanaat, el işi', false, 'Türkçedeki sanat bu kelimeden gelir ama Arapçada {{صَنْعَة}} el ile yapılan iş, zanaat demektir. Sanat Arapçada {{فَنّ}}.'),

  /* Evde ve sofrada */
  L('ev', 'سَاعَة', 'sâ‘a', 'saat', 'saat', true),
  L('ev', 'مَطْبَخ', 'matbah', 'matbah', 'mutfak', true, 'Eskiden saraylarda mutfağa matbah denirdi.'),
  L('ev', 'صَابُون', 'sâbûn', 'sabun', 'sabun', true),
  L('ev', 'فِنْجَان', 'fincân', 'fincan', 'fincan', true),
  L('ev', 'قَهْوَة', 'kahve', 'kahve', 'kahve', true),
  L('ev', 'سُكَّر', 'sukker', 'şeker', 'şeker', true),
  L('ev', 'طَبَق', 'tabak', 'tabak', 'tabak', true),
  L('ev', 'لَذِيذ', 'lezîz', 'leziz', 'lezzetli', true),
  L('ev', 'مِنْدِيل', 'mendîl', 'mendil', 'mendil', true),
  L('ev', 'جَيْب', 'ceyb', 'cep', 'cep', true),
  L('ev', 'قُمَاش', 'kumâş', 'kumaş', 'kumaş', true),
  L('ev', 'بَدَن', 'beden', 'beden', 'vücut', true, 'Türkçede giysi bedeni anlamı da var; Arapçada yalnızca vücut.'),
  L('ev', 'رَاحَة', 'râha', 'rahat', 'dinlenme, rahatlık', true),
  L('ev', 'هَدِيَّة', 'hediyye', 'hediye', 'hediye', true),
  L('ev', 'كِرَاء', "kirâ'", 'kira', 'kira', true),
  L('ev', 'حَمَّام', 'hammâm', 'hamam', 'banyo, tuvalet', false, 'Türkçede hamam yıkanılan büyük yerdir. Arapçada evdeki banyo da tuvalet de {{حَمَّام}}.'),
  L('ev', 'شَرَاب', 'şerâb', 'şarap', 'içecek, şurup', false, 'Türkçede şarap alkollü bir içkidir. Arapçada {{شَرَاب}} içilen her şey: meyve suyu, şurup. Aynı kökten {{شَرِبَ}} "içti"; şerbet ve meşrubat da buradan.'),
  L('ev', 'حَلْوَى', 'halvâ', 'helva', 'tatlı, şekerleme', false, 'Türkçede helva belli bir tatlının adıdır. Arapçada her türlü tatlı {{حَلْوَى}}; {{حُلْو}} "tatlı" sıfatıyla aynı kökten.'),
  L('ev', 'خِرْقَة', 'hırka', 'hırka', 'bez parçası, paçavra', false, 'Türkçede hırka örgü bir giysidir. Arapçada {{خِرْقَة}} bez parçası; eskiden dervişlerin yamalı giysisine hırka denirdi.'),

  /* Zaman ve doğa */
  L('zaman', 'دُنْيَا', 'dunyâ', 'dünya', 'dünya', true),
  L('zaman', 'حَيَاة', 'hayât', 'hayat', 'hayat', true),
  L('zaman', 'وَقْت', 'vakt', 'vakit', 'vakit, zaman', true),
  L('zaman', 'زَمَان', 'zemân', 'zaman', 'zaman', true),
  L('zaman', 'دَقِيقَة', 'dakîka', 'dakika', 'dakika', true),
  L('zaman', 'ثَانِيَة', 'sâniye', 'saniye', 'saniye', true),
  L('zaman', 'صَبَاح', 'sabâh', 'sabah', 'sabah', true),
  L('zaman', 'سَنَة', 'sene', 'sene', 'yıl', true),
  L('zaman', 'تَارِيخ', 'târîh', 'tarih', 'tarih', true, 'Arapçada da hem geçmişin tarihi hem de günün tarihi.'),
  L('zaman', 'نَهْر', 'nehr', 'nehir', 'nehir', true),
  L('zaman', 'قَمَر', 'kamer', 'kamer', 'ay (gökteki)', true),
  L('zaman', 'هِلَال', 'hilâl', 'hilal', 'hilal, yeni ay', true),
  L('zaman', 'سَمَاء', "semâ'", 'semâ', 'gökyüzü', true),
  L('zaman', 'طَبِيعَة', 'tabî‘a', 'tabiat', 'doğa', true),
  L('zaman', 'شَمْسِيَّة', 'şemsiyye', 'şemsiye', 'şemsiye', true, 'Kelimesi kelimesine "güneşlik": {{شَمْس}} güneş demektir.'),
  L('zaman', 'رُطُوبَة', 'rutûbe', 'rutubet', 'nem', true),
  L('zaman', 'حَرَارَة', 'harâra', 'hararet', 'sıcaklık, ısı', true, 'Hava durumunda {{دَرَجَةُ الْحَرَارَةِ}} "sıcaklık derecesi" demektir.'),
  L('zaman', 'عَصْر', '‘asr', 'asır', 'çağ; ikindi vakti', false, 'Türkçede asır yüz yıl demektir. Arapçada {{عَصْر}} bir çağ ya da ikindi vakti; yüz yıl {{قَرْن}}.'),
  L('zaman', 'فَصْل', 'fasl', 'fasıl', 'mevsim; sınıf', false, 'Türkçede fasıl bölüm demektir. Arapçada da bölüm anlamı var ama günlük dilde önce mevsim: {{فَصْلُ الشِّتَاءِ}} kış mevsimi. Okulda sınıf da {{فَصْل}}.'),

  /* İnsanlar ve duygular */
  L('insan', 'إِنْسَان', 'insân', 'insan', 'insan', true),
  L('insan', 'عَائِلَة', "‘â'ile", 'aile', 'aile', true),
  L('insan', 'قَلْب', 'kalb', 'kalp', 'kalp', true),
  L('insan', 'نَفَس', 'nefes', 'nefes', 'nefes', true),
  L('insan', 'صَبْر', 'sabr', 'sabır', 'sabır', true),
  L('insan', 'عِشْق', '‘ışk', 'aşk', 'aşk', true),
  L('insan', 'حُزْن', 'huzn', 'hüzün', 'üzüntü', true),
  L('insan', 'سَعَادَة', 'se‘âde', 'saadet', 'mutluluk', true),
  L('insan', 'حَسَد', 'hased', 'haset', 'kıskançlık', true),
  L('insan', 'جَاهِل', 'câhil', 'cahil', 'bilgisiz', true),
  L('insan', 'عَادِل', '‘âdil', 'adil', 'adaletli', true),
  L('insan', 'ظَالِم', 'zâlim', 'zalim', 'zulmeden', true),
  L('insan', 'حَال', 'hâl', 'hal', 'durum', true),
  L('insan', 'مَحَبَّة', 'mahabbe', 'muhabbet', 'sevgi', false, 'Türkçede muhabbet çoğunlukla sohbet demektir (muhabbet etmek). Arapçada {{مَحَبَّة}} sevgi; aynı kökten {{حُبّ}} "sevgi, aşk".'),
  L('insan', 'مِسْكِين', 'miskîn', 'miskin', 'zavallı, yoksul', false, 'Türkçede miskin tembel, uyuşuk demektir. Arapçada acınacak durumdaki kişi.'),
  L('insan', 'صَادِق', 'sâdık', 'sadık', 'doğru sözlü, dürüst', false, 'Türkçede sadık vefalı demektir. Arapçada {{صَادِق}} doğruyu söyleyen kişi; aynı kökten {{صَدِيق}} "arkadaş".'),
  L('insan', 'غَنِيّ', 'ganiyy', 'gani', 'zengin', false, 'Türkçede gani bol demektir (gani gani). Arapçada zengin; zıttı {{فَقِير}} "fakir".'),
  L('insan', 'مُسَافِر', 'musâfir', 'misafir', 'yolcu', false, 'Türkçede misafir konuk demektir. Arapçada yolculuk eden kişi, {{سَفَر}} "yolculuk" kökünden. Konuk Arapçada {{ضَيْف}}.'),
  L('insan', 'حَاكِم', 'hâkim', 'hâkim (yargıç)', 'yönetici, vali', false, 'Türkçede hâkim mahkemedeki yargıçtır. Arapçada {{حَاكِم}} ülkeyi ya da şehri yöneten kişi; yargıç {{قَاضٍ}}.'),
  L('insan', 'وَجْه', 'vech', 'veçhe', 'yüz (surat)', false, 'Türkçede veçhe yön, görünüş demektir (olay yeni bir veçhe kazandı). Arapçada {{وَجْه}} insanın yüzü.'),
  L('insan', 'جِسْم', 'cism', 'cisim', 'vücut', false, 'Türkçede cisim nesne demektir (yabancı cisim). Arapçada önce insan vücudu.'),
  L('insan', 'عَيْن', '‘ayn', 'aynı', 'göz; pınar', false, 'Türkçedeki aynı kelimesi buradan gelir. Arapçada {{عَيْن}} göz ve pınar demektir; "bir şeyin kendisi" anlamı da vardır.'),

  /* Şehirde, işte ve devlette */
  L('sehir', 'دُكَّان', 'dukkân', 'dükkân', 'dükkân', true),
  L('sehir', 'تَاجِر', 'tâcir', 'tacir', 'tüccar', true),
  L('sehir', 'حِسَاب', 'hisâb', 'hesap', 'hesap', true),
  L('sehir', 'شَرِكَة', 'şerike', 'şirket', 'şirket', true),
  L('sehir', 'طَبِيب', 'tabîb', 'tabip', 'doktor', true),
  L('sehir', 'دَوَاء', "devâ'", 'deva', 'ilaç', true),
  L('sehir', 'مَيْدَان', 'meydân', 'meydan', 'meydan, alan', true),
  L('sehir', 'مَحْكَمَة', 'mahkeme', 'mahkeme', 'mahkeme', true),
  L('sehir', 'مُدِير', 'mudîr', 'müdür', 'müdür', true),
  L('sehir', 'وَطَن', 'vatan', 'vatan', 'vatan', true),
  L('sehir', 'دَوْلَة', 'devle', 'devlet', 'devlet', true),
  L('sehir', 'حَرْب', 'harb', 'harp', 'savaş', true),
  L('sehir', 'سِلَاح', 'silâh', 'silah', 'silah', true),
  L('sehir', 'مَمْلَكَة', 'memleke', 'memleket', 'krallık', false, 'Türkçede memleket ülke ya da doğulan yer demektir. Arapçada krallık: {{الْمَمْلَكَةُ الْمُتَّحِدَةُ}} Birleşik Krallık.'),
  L('sehir', 'مِلَّة', 'mille', 'millet', 'din, inanç topluluğu', false, 'Türkçede millet ulus demektir. Arapçada {{مِلَّة}} aynı inancı paylaşan topluluk; ulus Arapçada {{أُمَّة}} ya da {{شَعْب}}.'),
  L('sehir', 'سَائِق', "sâ'ik", 'saik', 'şoför, sürücü', false, 'Türkçede saik sebep, güdü demektir (hangi saikle). Arapçada {{سَائِق}} arabayı süren kişi.'),
  L('sehir', 'مَعَاش', 'me‘âş', 'maaş', 'emekli aylığı; geçim', false, 'Türkçede maaş her ay alınan ücrettir. Arapçada {{مَعَاش}} daha çok emekli aylığı; çalışanın maaşı {{رَاتِب}}.'),
  L('sehir', 'مُسَاعِد', 'musâ‘id', 'müsait', 'yardımcı', false, 'Türkçede müsait uygun demektir (müsait misin?). Arapçada {{مُسَاعِد}} yardım eden kişi, asistan.'),
  L('sehir', 'مُسَاعَدَة', 'musâ‘ade', 'müsaade', 'yardım', false, 'Türkçede müsaade izin demektir. Arapçada {{مُسَاعَدَة}} yardım: {{شُكْرًا عَلَى الْمُسَاعَدَةِ}} "Yardımın için teşekkürler."'),
  L('sehir', 'تَعْطِيل', 'ta‘tîl', 'tatil', 'durdurma, bozma', false, 'Türkçedeki tatil buradan gelir. Arapçada {{تَعْطِيل}} bir işi durdurmak, işlemez hâle getirmek; tatil {{عُطْلَة}} (aynı kökten).'),

  /* Günlük konuşmada */
  L('gunluk', 'مَرْحَبًا', 'merhaben', 'merhaba', 'merhaba', true),
  L('gunluk', 'تَمَام', 'temâm', 'tamam', 'tam, eksiksiz', true),
  L('gunluk', 'لَازِم', 'lâzim', 'lazım', 'gerekli', true),
  L('gunluk', 'مَجْبُور', 'mecbûr', 'mecbur', 'zorunda kalmış', true),
  L('gunluk', 'مَوْجُود', 'mevcûd', 'mevcut', 'var olan, bulunan', true),
  L('gunluk', 'مَعْنًى', 'ma‘nâ', 'mana', 'anlam', true),
  L('gunluk', 'خَبَر', 'haber', 'haber', 'haber', true),
  L('gunluk', 'غَرِيب', 'garîb', 'garip', 'tuhaf; yabancı', true, 'Arapçada yabancı, gurbetteki kişi anlamı da var; gurbet aynı kökten.'),
  L('gunluk', 'كَيْفَ', 'keyfe', 'keyif', 'nasıl', false, 'Türkçedeki keyif bu kelimeden gelir ama Arapçada {{كَيْفَ}} soru kelimesidir: {{كَيْفَ حَالُكَ؟}} "Nasılsın?"'),
  L('gunluk', 'حَاضِر', 'hâdır', 'hazır', 'orada bulunan, mevcut', false, 'Türkçede hazır bir işe hazır olmak demektir. Arapçada {{حَاضِر}} orada bulunan kişi (derste hazır bulunanlar); hazır anlamında {{جَاهِز}} kullanılır.'),

  /* Arapça çoğuldan gelenler */
  L('cogul', 'أَشْيَاء', "eşyâ'", 'eşya', 'şeyler', true, undefined, 'شَيْء'),
  L('cogul', 'أَوْرَاق', 'evrâk', 'evrak', 'yapraklar, kâğıtlar', true, undefined, 'وَرَقَة'),
  L('cogul', 'أَخْلَاق', 'ahlâk', 'ahlak', 'huylar, ahlak', true, undefined, 'خُلُق'),
  L('cogul', 'أَقْرِبَاء', "akribâ'", 'akraba', 'yakınlar, akrabalar', true, undefined, 'قَرِيب'),
  L('cogul', 'أَحْبَاب', 'ahbâb', 'ahbap', 'sevilenler, dostlar', true, undefined, 'حَبِيب'),
  L('cogul', 'أَوْلَاد', 'evlâd', 'evlat', 'çocuklar', true, undefined, 'وَلَد'),
  L('cogul', 'طَلَبَة', 'talebe', 'talebe', 'öğrenciler', true, undefined, 'طَالِب'),
  L('cogul', 'أَعْضَاء', "a‘dâ'", 'aza', 'üyeler; organlar', true, undefined, 'عُضْو'),
  L('cogul', 'أَهَالِي', 'ehâlî', 'ahali', 'halk, sakinler', true, undefined, 'أَهْل'),
  L('cogul', 'فُقَرَاء', "fukarâ'", 'fukara', 'yoksullar', true, undefined, 'فَقِير'),
  L('cogul', 'أَلْبِسَة', 'elbise', 'elbise', 'giysiler', true, undefined, 'لِبَاس'),
  L('cogul', 'أَجْدَاد', 'ecdâd', 'ecdat', 'dedeler, atalar', true, undefined, 'جَدّ'),
  L('cogul', 'أَحْوَال', 'ahvâl', 'ahval', 'durumlar', true, undefined, 'حَال'),
  L('cogul', 'أَرْزَاق', 'erzâk', 'erzak', 'rızıklar, yiyecekler', true, undefined, 'رِزْق'),
  L('cogul', 'أَسْرَار', 'esrâr', 'esrar', 'sırlar', true, undefined, 'سِرّ'),
  L('cogul', 'كِبَار', 'kibâr', 'kibar', 'büyükler', false, 'Türkçede kibar nazik demektir. Arapçada {{كِبَار}} büyükler: yaşça büyükler ya da ileri gelenler.', 'كَبِير'),
  L('cogul', 'أَجْزَاء', "eczâ'", 'ecza', 'parçalar', false, 'Türkçede ecza ilaç demektir (eczane). Arapçada parçalar; ilacı oluşturan parçalardan bu anlama geçmiş. Eczane Arapçada {{صَيْدَلِيَّة}}.', 'جُزْء'),
  L('cogul', 'أَصْنَاف', 'esnâf', 'esnaf', 'çeşitler, türler', false, 'Türkçede esnaf dükkân sahipleridir. Arapçada çeşitler, türler; aynı türden işi yapanlar anlamından esnafa dönüşmüş.', 'صِنْف'),
  L('cogul', 'أَفْكَار', 'efkâr', 'efkâr', 'düşünceler', false, 'Türkçede efkâr hüzün, dert demektir (efkârlanmak). Arapçada yalnızca düşünceler.', 'فِكْر'),
  L('cogul', 'حَوَادِث', 'havâdis', 'havadis', 'olaylar, kazalar', false, 'Türkçede havadis haberler demektir. Arapçada olaylar; tek bir kaza {{حَادِث}}.', 'حَادِث'),
  L('cogul', 'عَجَائِب', "‘acâ'ib", 'acayip', 'harikalar', false, 'Türkçede acayip tuhaf demektir. Arapçada {{عَجَائِب}} harikalar: {{عَجَائِبُ الدُّنْيَا السَّبْعُ}} dünyanın yedi harikası.', 'عَجِيبَة')
];

/* ---------- Sınırsız pratik: anlamı aynı mı, Arapçada ne demek, Arapça aslı hangisi, dinleyip bul ---------- */
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);
const SAME = 'Aynı anlamda', DIFF = 'Anlamı farklı';
/** Çoğuldan gelenlerin "aynı mı" sorusu belirsiz (evlat: çocuklar): bu soruda yalnızca anlamı açıkça değişenler sorulur */
const askable = LOANWORDS.filter((w) => !w.sg || !w.same);
const whyOf = (w: Loan) => (w.same ? `{{${w.ar}}} Arapçada da "${w.mean}" demektir.` : `{{${w.ar}}} Arapçada "${w.mean}" demektir.`) +
  (w.sg ? ` Arapçada çoğuldur, tekili {{${w.sg}}}.` : '') + (w.note ? ' ' + w.note : '');
const others = (w: Loan, key: 'mean' | 'ar' | 'tr', n = 3) =>
  [...new Set(shuffle(LOANWORDS.filter((x) => x.ar !== w.ar && x.mean !== w.mean && x.tr !== w.tr)).map((x) => x[key]))].slice(0, n);

export function loanQ(): EQ {
  const r = Math.random();
  const base = { g: 'turkce' };
  if (r < 0.4) {
    // Yalancı eşler daha sık sorulur: oyunun asıl öğrettiği onlar
    const w = Math.random() < 0.55 ? pick(askable.filter((x) => !x.same)) : pick(askable.filter((x) => x.same));
    return { ...base, key: 'tk-ayni' + w.ar, kind: 'tk-ayni', label: 'Anlamı aynı mı?', prompt: `Türkçedeki "${w.tr}" kelimesi Arapçada da aynı anlama mı gelir?`,
      ar: w.ar, options: [SAME, DIFF], optAr: false, a: w.same ? SAME : DIFF, full: w.ar, fullTr: cap(w.mean), why: whyOf(w), say: w.ar };
  }
  const w = pick(LOANWORDS);
  if (r < 0.65) {
    return { ...base, key: 'tk-anlam' + w.ar, kind: 'tk-anlam', label: 'Arapçadaki anlamı', prompt: `Türkçedeki "${w.tr}" kelimesinin aslı. Arapçada ne demek?`,
      ar: w.ar, options: shuffle([w.mean, ...others(w, 'mean')]), optAr: false, a: w.mean, full: w.ar, fullTr: cap(w.mean), why: whyOf(w), say: w.ar };
  }
  if (r < 0.85) {
    return { ...base, key: 'tk-ar' + w.ar, kind: 'tk-ar', label: 'Arapça aslı', prompt: `Türkçedeki "${w.tr}" kelimesinin Arapça aslı hangisi?`,
      tr: cap(w.tr), options: shuffle([w.ar, ...others(w, 'ar')]), optAr: true, a: w.ar, full: w.ar, fullTr: cap(w.mean), why: whyOf(w), say: w.ar };
  }
  return { ...base, key: 'tk-dinle' + w.ar, kind: 'tk-dinle', label: 'Dinleyip bulma', prompt: 'Dinle: Türkçedeki hangi kelimenin aslı?',
    ar: w.ar, listen: true, options: shuffle([w.tr, ...others(w, 'tr')]), optAr: false, a: w.tr, full: w.ar, fullTr: cap(w.mean), why: whyOf(w), say: w.ar };
}

/** Eşleştirme oyunu: Arapça aslı ile Türkçedeki kelime */
export const loanPairs = (n = 10): [string, string][] => shuffle(LOANWORDS).slice(0, n).map((w) => [w.ar, w.tr]);

/** Ses üretimi: kelimeler ve tekilleri */
export function loanTexts(): string[] {
  return [...new Set(LOANWORDS.flatMap((w) => [w.ar, ...(w.sg ? [w.sg] : [])]))];
}
