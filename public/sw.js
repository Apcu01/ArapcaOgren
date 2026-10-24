/* ArapcaOgren service worker: çevrimdışı kullanım */
const VERSION = 'v1';
const PAGES = 'pages-' + VERSION;
const STATIC = 'static-' + VERSION;
const OFFLINE = '/cevrimdisi';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(PAGES).then((c) => c.addAll([OFFLINE, '/', '/logo.svg', '/icons/icon-192.png'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![PAGES, STATIC].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isFont = (u) => u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;

  // Fontlar: önbellekten ver, arkada yenile
  if (isFont(url)) {
    e.respondWith(caches.open(STATIC).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((r) => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (!same) return;

  // Ses kayıtları ve derlenmiş statik dosyalar: önce önbellek
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/api/audio/')) {
    e.respondWith(caches.open(STATIC).then(async (c) => {
      const hit = await c.match(req);
      if (hit) return hit;
      const r = await fetch(req);
      if (r.ok) c.put(req, r.clone());
      return r;
    }));
    return;
  }
  // Diğer API'ler ve yönetim paneli asla önbelleğe alınmaz
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  // Sayfalar: önce ağ, olmazsa önbellek, o da yoksa çevrimdışı sayfası
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        if (r.ok) (await caches.open(PAGES)).put(req, r.clone());
        return r;
      } catch {
        const c = await caches.open(PAGES);
        return (await c.match(req)) || (await c.match(OFFLINE)) || Response.error();
      }
    })());
  }
});

self.addEventListener('message', (e) => {
  const d = e.data || {};
  // Çıkış yapınca kişiye özel sayfaları temizle
  if (d.type === 'clear-pages') e.waitUntil(caches.delete(PAGES).then(() => caches.open(PAGES).then((c) => c.add(OFFLINE))));
  // Tüm dersleri çevrimdışı kullanım için indir
  if (d.type === 'precache' && Array.isArray(d.urls)) {
    e.waitUntil((async () => {
      const c = await caches.open(PAGES);
      let n = 0;
      for (const u of d.urls) {
        try { const r = await fetch(u, { credentials: 'same-origin' }); if (r.ok) { await c.put(u, r); n++; } } catch { /* atla */ }
      }
      const all = await self.clients.matchAll();
      all.forEach((cl) => cl.postMessage({ type: 'precached', count: n, total: d.urls.length }));
    })());
  }
});
