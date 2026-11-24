export const SITE_NAME = 'ArapcaOgren';
export const SITE_DESC = 'Saatler, zamirler, sıfatlar, iyelik ekleri ve daha fazlası: detaylı konu anlatımı, Türkçe ve İngilizce karşılaştırmalı örnekler ve etkinliklerle ücretsiz Arapça öğren.';

/** Sitenin yayındaki kök adresi (SITE_URL), yoksa yerel adres */
export const siteOrigin = () => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

/**
 * Girişten sonra dönülecek adres: yalnızca sitenin kendi sayfaları (tarayıcıda ve sunucuda ortak).
 * Adres tarayıcının okuyacağı gibi çözülür: "//site", "/\site" ya da araya sekme konmuş yazımlar başka siteye gittiği için reddedilir.
 */
export function safeNext(n: string | null | undefined) {
  if (!n || !n.startsWith('/')) return '/';
  try {
    const base = 'https://site.invalid';
    const u = new URL(n, base);
    return u.origin === base ? u.pathname + u.search + u.hash : '/';
  } catch {
    return '/';
  }
}
