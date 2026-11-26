/* Yenilikler: tarayıcıda ve sunucuda ortak tip, kurallar ve ilk yazılar */
import type { TextFns } from './text';

/** Yazı metni HTML'e: {{...}} içi Arapça yazı tipiyle; geri kalan kaçışlanır (ders metinlerinin aksine HTML'e izin yok) */
export const newsHtml = (body: string, tx: Pick<TextFns, 'ar' | 'text'>) =>
  body.split(/(\{\{.+?\}\})/).map((p) => {
    const m = p.match(/^\{\{(.+)\}\}$/);
    // Kapanmamış "{{" kalırsa text() onu ders metni sanıp kaçışlamadan geçirir: araya boşluk girer
    return m ? tx.ar(m[1]) : tx.text(p.replace(/\{\{/g, '{ {'));
  }).join('');

export type NewsItem = { id: number; title: string; body: string; link: string | null; published: boolean; at: number };

/** Başlıktaki nokta: bu tarayıcıda en son görülen yazının numarası; değişince başlık bu olayla yeniden okur */
export const NEWS_SEEN_KEY = 'arblearn:news-seen';
export const NEWS_SEEN_EVENT = 'arb:news-seen';

/** Yalnızca site içi bağlantı: "/" ile başlar, "//" ya da "/\" ile başlamaz (başka siteye yönlendirme olmasın) */
export const isNewsLink = (s: string) => /^\/(?![/\\])[^\s<>"'\\]*$/.test(s);

export const NEWS_LIMITS = { title: 120, body: 2000, link: 200 };

// Yenilikler tablosu ilk oluşturulduğunda eklenen yazılar (eskiden yeniye; panelden düzenlenip silinebilir)
export const DEFAULT_NEWS: { title: string; body: string; link: string | null }[] = [
  {
    title: 'Yenilikler sayfası açıldı',
    body: 'Siteye eklenen her şeyi artık burada bulabilirsin. Başlıktaki simgenin üstünde nokta görünüyorsa son ziyaretinden sonra yeni bir şey eklenmiş demektir. Siteyi yeni tanıyorsan bu sayfanın başındaki "Siteyi tanı" düğmesiyle kısa tanıtımı izleyebilirsin.',
    link: null
  },
  {
    title: 'Canlı yarışmadan sonra yanlışlarını çalış',
    body: "Yarışma bitince telefonunda yanlış yaptığın ve boş bıraktığın sorular listelenir. Tek dokunuşla Hatalarım'a ekleyebilir ya da hemen yeniden çözebilirsin. Bir dersten açılan yarışmanın yanlışları Hatalarım'da o dersin altında toplanır.",
    link: '/canli'
  },
  {
    title: 'Türkçedeki Arapça kelimeler',
    body: 'Kitap, saat, hayat, dünya: Türkçede her gün kullandığın kelimelerin Arapça aslını sesleriyle bir araya topladık. Anlamı değişenleri ayrıca işaretledik; örneğin Arapçada {{صَدِيق}} arkadaş, {{مَكْتَب}} büro demektir. "Anlamı aynı mı, farklı mı?" oyunuyla kendini dene.',
    link: '/turkcedeki-arapca'
  }
];
