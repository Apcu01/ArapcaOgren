import { normAr, strip } from './text';

/* Kök ailesi: sözlükteki kelimelerin üç harfli kökleri, kökün temel anlamı ve Türkçede aynı kökten gelen kelimeler.
   Zamirler, harfler ve kökü olmayan kelimeler listede yoktur. */
export type Root = { letters: string; meaning: string; tr: string[]; note?: string };

const R: Record<string, Omit<Root, 'letters'>> = {
  'كتب': { meaning: 'yazmak', tr: ['kitap', 'kâtip', 'mektep', 'mektup', 'kitabe', 'mükâtebe'] },
  'بيت': { meaning: 'ev, gecelemek', tr: ['beyit', 'beytülmal'] },
  'قلم': { meaning: 'kalem, kesip yontmak', tr: ['kalem', 'kalemiye'] },
  'بوب': { meaning: 'kapı', tr: ['bab (kitap bölümü)', 'bevvap (kapıcı)'] },
  'شمس': { meaning: 'güneş', tr: ['şems', 'şemsiye', 'şemsî (güneş takvimi)'] },
  'قمر': { meaning: 'ay', tr: ['kamer', 'kamerî (ay takvimi)'] },
  'رجل': { meaning: 'erkek, ayak', tr: ['ricâl (devlet ricali)', 'recül'] },
  'طلب': { meaning: 'istemek, aramak', tr: ['talep', 'talebe', 'talip', 'matlup'] },
  'علم': { meaning: 'bilmek', tr: ['ilim', 'âlim', 'muallim', 'malum', 'talim', 'ulema', 'alamet'] },
  'مدن': { meaning: 'şehir, yerleşmek', tr: ['medeni', 'medeniyet', 'temeddün'] },
  'سير': { meaning: 'yürümek, gitmek', tr: ['seyir', 'seyyar', 'seyran'] },
  'درس': { meaning: 'okumak, ders çalışmak', tr: ['ders', 'medrese', 'müderris', 'tedris'] },
  'نور': { meaning: 'ışık', tr: ['nur', 'münevver', 'tenvir', 'nurani'] },
  'سمو': { meaning: 'yüksek olmak; ad', tr: ['isim', 'semâ', 'semavi', 'esma', 'müsemma'], note: 'İsim ile gökyüzü aynı kökten: yüksekte duran, öne çıkan.' },
  'فعل': { meaning: 'yapmak', tr: ['fiil', 'fâil', 'faal', 'faaliyet', 'mef\'ul', 'infial'] },
  'حرف': { meaning: 'kenar, uç', tr: ['harf', 'harfiyen', 'tahrif'] },
  'كلم': { meaning: 'söz söylemek', tr: ['kelime', 'kelam', 'tekellüm', 'mükâleme'] },
  'جمل': { meaning: 'toplamak; güzel olmak', tr: ['cümle', 'mücmel', 'cemal', 'Cemile', 'mücamele'], note: 'Cümle (bir araya toplanmış söz) ile cemal (güzellik) aynı harflerden.' },
  'بدأ': { meaning: 'başlamak', tr: ['ibtida', 'iptidai', 'mübtedi', 'bidayet'] },
  'خبر': { meaning: 'haber vermek, bilmek', tr: ['haber', 'muhabir', 'muhabere', 'ihbar'] },
  'ذهب': { meaning: 'gitmek', tr: ['mezhep (gidilen yol)'] },
  'شرب': { meaning: 'içmek', tr: ['şarap', 'şerbet', 'şurup', 'meşrubat'] },
  'وقت': { meaning: 'vakit', tr: ['vakit', 'evkat', 'muvakkat'] },
  'كبر': { meaning: 'büyük olmak', tr: ['kebir', 'ekber', 'kibir', 'tekbir', 'kübra'] },
  'صغر': { meaning: 'küçük olmak', tr: ['sağir', 'suğra', 'tasgir'] },
  'جدد': { meaning: 'yeni olmak; ata', tr: ['cedit', 'tecdit', 'teceddüt', 'ecdat'], note: 'Yeni (جَدِيد) ile dede (جَدّ) aynı kökten.' },
  'قدم': { meaning: 'önde olmak, eski olmak', tr: ['kadim', 'kıdem', 'takdim', 'mukaddime', 'ikdam'] },
  'طول': { meaning: 'uzun olmak', tr: ['tul', 'tavil', 'mutavvel', 'tatvil'] },
  'قصر': { meaning: 'kısa olmak, eksik kalmak', tr: ['kusur', 'taksir', 'taksirat'] },
  'سهل': { meaning: 'kolay olmak', tr: ['teshil', 'müsahele (hoşgörü)'] },
  'صعب': { meaning: 'zor olmak', tr: ['suubet (zorluk)'] },
  'حرر': { meaning: 'sıcak olmak; özgür olmak', tr: ['hararet', 'hür', 'hürriyet', 'tahrir'] },
  'برد': { meaning: 'soğuk olmak', tr: ['bürudet (soğukluk)'] },
  'كثر': { meaning: 'çok olmak', tr: ['kesir', 'kesret', 'ekseriyet', 'teksir'] },
  'قلل': { meaning: 'az olmak', tr: ['kalil', 'kıllet', 'ekalliyet'] },
  'سعد': { meaning: 'mutlu olmak', tr: ['saadet', 'mesut', 'said', 'Esad'] },
  'حزن': { meaning: 'üzülmek', tr: ['hüzün', 'hazin', 'mahzun'] },
  'قرب': { meaning: 'yakın olmak', tr: ['akraba', 'takriben', 'kurban', 'mukarrep'], note: 'Kurban da bu kökten: yaklaşmaya vesile olan şey.' },
  'بعد': { meaning: 'uzak olmak; sonra', tr: ['baid', 'ebat', 'buut', 'müstebat'], note: 'Uzak (بَعِيد) ile sonra (بَعْدَ) aynı kökten.' },
  'جهد': { meaning: 'çabalamak', tr: ['ictihat', 'müçtehit', 'cihat', 'cehd'] },
  'حمر': { meaning: 'kırmızı olmak', tr: ['Elhamra'] },
  'خضر': { meaning: 'yeşil olmak', tr: ['Hızır', 'Hıdrellez'] },
  'صفر': { meaning: 'sarı olmak; boş olmak', tr: ['safra', 'sıfır'], note: 'Sarı (أَصْفَر) ile sıfır (صِفْر) aynı harflerden.' },
  'بيض': { meaning: 'beyaz olmak', tr: ['beyaz', 'beyzi (yumurta biçimli)'] },
  'سود': { meaning: 'siyah olmak', tr: ['sevda', 'müsvedde', 'Hacerülesved'] },
  'لون': { meaning: 'renk', tr: ['levn', 'elvan', 'mülevven'] },
  'وحد': { meaning: 'bir olmak', tr: ['vahdet', 'tevhit', 'vahit', 'ittihat'] },
  'ثني': { meaning: 'iki, ikilemek', tr: ['sani', 'saniye', 'istisna', 'müsenna'], note: 'Saniye, dakikanın ikinci bölümüdür.' },
  'ثلث': { meaning: 'üç', tr: ['sülüs', 'müselles (üçgen)', 'teslis'] },
  'ربع': { meaning: 'dört', tr: ['rubu', 'murabba (kare)', 'erbain'] },
  'خمس': { meaning: 'beş', tr: ['hamse', 'muhammes (beşgen)'] },
  'سدس': { meaning: 'altı', tr: ['südüs', 'müseddes (altıgen)'] },
  'سبع': { meaning: 'yedi', tr: ['müsebba (yedili)'], note: 'Hafta (أُسْبُوع) da bu kökten: yedi gün.' },
  'ثمن': { meaning: 'sekiz; değer', tr: ['müsemmen (sekizgen)', 'semen (bedel)'] },
  'عشر': { meaning: 'on; bir arada yaşamak', tr: ['aşure', 'öşür', 'aşiret'] },
  'ألف': { meaning: 'bin; alışmak', tr: ['ülfet', 'telif', 'müellif'] },
  'أول': { meaning: 'ilk, baş', tr: ['evvel', 'evvela', 'evail'] },
  'عمر': { meaning: 'yaşamak, bayındır etmek', tr: ['ömür', 'imar', 'mimar', 'mamur'] },
  'سنو': { meaning: 'yıl', tr: ['sene', 'senevi'] },
  'سوع': { meaning: 'saat, an', tr: ['saat'] },
  'دقق': { meaning: 'ince olmak', tr: ['dakika', 'dikkat', 'tetkik', 'dakik'] },
  'نصف': { meaning: 'yarı; hakkaniyet', tr: ['nısıf', 'insaf', 'munsif'] },
  'صبح': { meaning: 'sabah olmak', tr: ['sabah', 'Sabiha', 'sabahat'] },
  'ظهر': { meaning: 'görünmek; öğle', tr: ['zuhur', 'zahir', 'mazhar', 'tezahür', 'izhar'] },
  'مسو': { meaning: 'akşam olmak', tr: ['mesai'] },
  'ليل': { meaning: 'gece', tr: ['leyl', 'Leyla'] },
  'يوم': { meaning: 'gün', tr: ['yevmiye', 'eyyam'] },
  'أحد': { meaning: 'bir, tek', tr: ['ehad', 'ehadiyet'] },
  'جمع': { meaning: 'toplamak', tr: ['cuma', 'cami', 'cemaat', 'mecmua', 'içtima', 'cemiyet'] },
  'شهر': { meaning: 'ay; tanınmak', tr: ['şöhret', 'meşhur', 'teşhir'] },
  'أرخ': { meaning: 'tarih atmak', tr: ['tarih', 'müverrih'] },
  'رمض': { meaning: 'yakıcı sıcak', tr: ['Ramazan'] },
  'أسر': { meaning: 'bağlamak', tr: ['esir', 'esaret'], note: 'Aile (أُسْرَة) ile esir aynı kökten: birbirine bağlı olanlar.' },
  'أبو': { meaning: 'baba', tr: ['ebeveyn', 'Ebubekir', 'eba'] },
  'أمم': { meaning: 'anne; önde olmak', tr: ['ümmet', 'ümmi', 'imam'], note: 'Anne (أُمّ), önünde (أَمَامَ) ve imam aynı kökten.' },
  'أخو': { meaning: 'kardeş', tr: ['uhuvvet', 'ihvan'] },
  'بني': { meaning: 'kurmak; evlat', tr: ['bina', 'bünye', 'ebniye', 'mebni'] },
  'عمم': { meaning: 'amca; genel olmak', tr: ['amca', 'umum', 'amme'] },
  'خول': { meaning: 'dayı, teyze', tr: ['hala'], note: 'Türkçedeki hala kelimesi Arapçadaki teyze (خَالَة) kelimesinden gelir.' },
  'زوج': { meaning: 'eş, çift', tr: ['zevç', 'zevce', 'izdivaç'] },
  'حفد': { meaning: 'torun', tr: ['hafit'] },
  'جلس': { meaning: 'oturmak', tr: ['meclis', 'celse', 'cülus'] },
  'قرأ': { meaning: 'okumak', tr: ['Kur\'an', 'kıraat', 'kari'] },
  'أكل': { meaning: 'yemek', tr: ['me\'kûlat (yiyecekler)'] },
  'فتح': { meaning: 'açmak', tr: ['fetih', 'fatih', 'Fatiha', 'miftah', 'iftitah'] },
  'دخل': { meaning: 'girmek', tr: ['dahil', 'müdahale', 'duhul', 'dahili'] },
  'خرج': { meaning: 'çıkmak', tr: ['hariç', 'harç', 'mahreç', 'ihracat'] },
  'سمع': { meaning: 'duymak', tr: ['sema', 'istima', 'sami', 'semi'] },
  'فهم': { meaning: 'anlamak', tr: ['fehim', 'mefhum', 'tefhim'] },
  'عمل': { meaning: 'iş yapmak', tr: ['amel', 'amele', 'muamele', 'imalat', 'ameliyat'] },
  'علو': { meaning: 'yüksek olmak', tr: ['âli', 'ulvi', 'âlâ', 'Ali'] },
  'فوق': { meaning: 'üst', tr: ['fevkalade', 'fâik', 'tefevvuk'] },
  'تحت': { meaning: 'alt', tr: ['tahtelbahir'] },
  'خلف': { meaning: 'arka; yerine geçmek', tr: ['halef', 'halife', 'muhalif', 'ihtilaf'] },
  'بين': { meaning: 'ara; açık olmak', tr: ['beyan', 'beynelmilel', 'tebyin'] },
  'قبل': { meaning: 'önce; karşılamak', tr: ['kabul', 'istikbal', 'mukabil', 'kıble', 'kabile'] },
  'عند': { meaning: 'yanında; direnmek', tr: ['inat', 'muannit'] }
};

// Sözlük kelimesi (harekesiz) -> kök
export const WORD_ROOTS: Record<string, string> = {
  'كتاب': 'كتب', 'كتب': 'كتب', 'كاتب': 'كتب', 'مكتبة': 'كتب', 'كتابي': 'كتب', 'كتابك': 'كتب', 'كتابه': 'كتب', 'كتابها': 'كتب', 'كتابنا': 'كتب', 'كتابكم': 'كتب', 'كتابهم': 'كتب',
  'بيت': 'بيت', 'قلم': 'قلم', 'باب': 'بوب', 'شمس': 'شمس', 'قمر': 'قمر', 'رجل': 'رجل', 'طالب': 'طلب', 'معلم': 'علم',
  'مدينة': 'مدن', 'سيارة': 'سير', 'سيارتي': 'سير', 'مدرسة': 'درس', 'درس': 'درس', 'نور': 'نور', 'اسم': 'سمو', 'سماء': 'سمو',
  'فعل': 'فعل', 'فاعل': 'فعل', 'مفعول': 'فعل', 'حرف': 'حرف', 'كلمة': 'كلم', 'جملة': 'جمل', 'جميل': 'جمل', 'مبتدأ': 'بدأ', 'خبر': 'خبر',
  'ذهب': 'ذهب', 'شرب': 'شرب', 'وقت': 'وقت', 'كبير': 'كبر', 'أكبر': 'كبر', 'صغير': 'صغر', 'جديد': 'جدد', 'جد': 'جدد', 'جدة': 'جدد',
  'قديم': 'قدم', 'طويل': 'طول', 'قصير': 'قصر', 'سهل': 'سهل', 'صعب': 'صعب', 'حار': 'حرر', 'بارد': 'برد', 'كثير': 'كثر', 'قليل': 'قلل',
  'سعيد': 'سعد', 'حزين': 'حزن', 'قريب': 'قرب', 'بعيد': 'بعد', 'بعد': 'بعد', 'مجتهد': 'جهد',
  'أحمر': 'حمر', 'أخضر': 'خضر', 'أصفر': 'صفر', 'صفر': 'صفر', 'أبيض': 'بيض', 'أسود': 'سود', 'لون': 'لون',
  'واحد': 'وحد', 'الساعة الواحدة': 'وحد', 'اثنان': 'ثني', 'الاثنين': 'ثني', 'ثانية': 'ثني', 'ثلاثة': 'ثلث', 'الثلاثاء': 'ثلث', 'والثلث': 'ثلث', 'إلا ثلثا': 'ثلث',
  'أربعة': 'ربع', 'الأربعاء': 'ربع', 'والربع': 'ربع', 'إلا ربعا': 'ربع', 'خمسة': 'خمس', 'خمسون': 'خمس', 'الخميس': 'خمس', 'ستة': 'سدس',
  'سبعة': 'سبع', 'أسبوع': 'سبع', 'ثمانية': 'ثمن', 'عشرة': 'عشر', 'عشرون': 'عشر', 'ألف': 'ألف', 'الأول': 'أول',
  'عمر': 'عمر', 'سنة': 'سنو', 'ساعة': 'سوع', 'كم الساعة؟': 'سوع', 'دقيقة': 'دقق', 'والنصف': 'نصف',
  'صباحا': 'صبح', 'صباح الخير': 'صبح', 'ظهرا': 'ظهر', 'مساء': 'مسو', 'مساء الخير': 'مسو', 'ليلا': 'ليل', 'يوم': 'يوم', 'اليوم': 'يوم',
  'الأحد': 'أحد', 'الجمعة': 'جمع', 'شهر': 'شهر', 'تاريخ': 'أرخ', 'رمضان': 'رمض',
  'أسرة': 'أسر', 'أب': 'أبو', 'أم': 'أمم', 'أمام': 'أمم', 'أخ': 'أخو', 'أخت': 'أخو', 'ابن': 'بني', 'بنت': 'بني',
  'عم': 'عمم', 'عمة': 'عمم', 'خال': 'خول', 'خالة': 'خول', 'زوج': 'زوج', 'زوجة': 'زوج', 'حفيد': 'حفد',
  'كتب يكتب': 'كتب', 'ذهب يذهب': 'ذهب', 'جلس يجلس': 'جلس', 'درس يدرس': 'درس', 'قرأ يقرأ': 'قرأ', 'شرب يشرب': 'شرب', 'أكل يأكل': 'أكل',
  'فتح يفتح': 'فتح', 'دخل يدخل': 'دخل', 'خرج يخرج': 'خرج', 'سمع يسمع': 'سمع', 'فهم يفهم': 'فهم', 'عمل يعمل': 'عمل',
  'على': 'علو', 'فوق': 'فوق', 'تحت': 'تحت', 'خلف': 'خلف', 'بين': 'بين', 'قبل': 'قبل', 'عند': 'عند', 'عندي': 'عند'
};

const key = (s: string) => normAr(strip(s)).replace(/\s+/g, ' ').trim();
const BY_WORD = new Map(Object.entries(WORD_ROOTS).map(([w, r]) => [key(w), r]));

/** Kelimenin kökü (sözlükte kayıtlıysa) */
export function rootOf(ar: string): Root | null {
  const r = BY_WORD.get(key(ar));
  return r && R[r] ? { letters: r, ...R[r] } : null;
}

/** Kök harflerini aralıklı gösterir: كتب -> ك ت ب */
export const spaced = (letters: string) => [...letters].join(' ');

export const ROOT_COUNT = Object.keys(R).length;
