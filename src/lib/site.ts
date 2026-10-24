export const SITE_NAME = 'ArapcaOgren';
export const SITE_DESC = 'Saatler, zamirler, sıfatlar, iyelik ekleri ve daha fazlası: detaylı konu anlatımı, Türkçe ve İngilizce karşılaştırmalı örnekler ve etkinliklerle ücretsiz Arapça öğren.';

/** Sitenin yayındaki kök adresi (SITE_URL), yoksa yerel adres */
export const siteOrigin = () => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
