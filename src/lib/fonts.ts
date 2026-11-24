import { Manrope, Noto_Sans_Arabic } from 'next/font/google';

/* Yazı tipleri derlemede indirilir ve sitenin kendisinden sunulur: tarayıcı Google'a bağlanmaz,
   sayfa çizimi Google'ın stil dosyasını beklemez. İkisi de değişken yazı tipi: tek dosya bütün kalınlıkları kapsar.
   Manrope küçük (latin + latin-ext, Türkçe harfler latin-ext'te ~40 KB) ve her yazıda kullanılır: sayfayla önceden yüklenir. */
export const sans = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' });

/* Arapça yazı tipi ~160 KB. Sayfayla birlikte önceden yüklenince zayıf bağlantıda sayfa kodunu geciktiriyordu
   (ölçüm, yavaş 4G: düğmeler ~1,2 sn geç çalıştı). Bu yüzden önceden yüklenmez ve hemen etkin değildir:
   --font-ar-face tanımlıdır ama .ar yazıları onu html'de ar-font sınıfı varken kullanır. İlk ziyarette sınıfı
   AppProvider, sayfa kodu çalıştıktan ve yazı tipi indikten sonra ekler; sonraki ziyaretlerde (dosya önbellekte)
   kök düzendeki betik sayfa çizilmeden önce ekler. O zamana kadar cihazın Arapça yazı tipi görünür. */
export const arabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-ar-face', display: 'swap', preload: false });

/** Arapça yazı tipi bu tarayıcıda bir kez indirildi (önbellekte): sonraki açılışlarda hemen etkinleştirilir */
export const AR_FONT_FLAG = 'arblearn:arfont';
