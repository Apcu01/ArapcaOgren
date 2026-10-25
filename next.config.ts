import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Ziyaret edilen sayfalar tarayıcıda 30 sn tutulur: geri dönüşler ve gidip gelmeler sunucuyu beklemez.
  // Yönetim panelindeki değişiklikler router.refresh() ile hemen yenilenir.
  experimental: { staleTimes: { dynamic: 30 } },
  // Eski sitedeki .html'li adresler yeni temiz adreslere yönlenir
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:page(konu|sozluk|ilerleme|alfabe).html', destination: '/:page', permanent: true }
    ];
  }
};

export default nextConfig;
