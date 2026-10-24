import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Eski sitedeki .html'li adresler yeni temiz adreslere yönlenir
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:page(konu|sozluk|ilerleme|alfabe).html', destination: '/:page', permanent: true }
    ];
  }
};

export default nextConfig;
