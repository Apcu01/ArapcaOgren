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
// Değişmeyen dosyalar: derlenmiş betikler, simgeler, kelime sesleri ve ders anlatımı sesleri (numara değişince adres de değişir)
const isStatic = (p) => p.startsWith('/_next/static/') || p.startsWith('/icons/') || p.startsWith('/api/audio/') || p.startsWith('/api/narration/');
// Kişisel kelime listeleri: çevrimdışıyken son alınan hâli (çıkış yapınca silinir)
const isListApi = (p) => p === '/api/lists' || /^\/api\/lists\/\d+$/.test(p);

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

  // Değişmeyen dosyalar: önce önbellek
  if (isStatic(url.pathname)) {
    e.respondWith(caches.open(STATIC).then(async (c) => {
      const hit = await c.match(req, { ignoreVary: true });
      if (hit) return hit;
      const r = await fetch(req);
      // Ses dosyalarının parça (206) yanıtları saklanmaz; tamamı indirme sırasında saklanır
      if (r.ok && r.status === 200) c.put(req, r.clone());
      return r;
    }));
    return;
  }
  // Liste verisi: önce ağ, bağlantı yoksa son kaydedilen
  if (isListApi(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(PAGES);
      try {
        const r = await fetch(req);
        if (r.ok) c.put(url.pathname, r.clone());
        return r;
      } catch {
        return (await c.match(url.pathname)) || new Response(JSON.stringify({ error: 'Çevrimdışısın.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
      }
    })());
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
        return (await c.match(req, { ignoreSearch: true })) || (await c.match(OFFLINE)) || Response.error();
      }
    })());
  }
});

/** Sayfanın kullandığı derlenmiş dosyalar (betik ve stiller): sayfa çevrimdışı açılınca çalışsın diye */
const assetsOf = (html) => [...new Set((html.match(/\/_next\/static\/[^"'\s\\)]+/g) || []).map((u) => u.replace(/&amp;/g, '&')))];

async function precache(job, client) {
  const { id, urls, kind } = job;
  const pages = await caches.open(PAGES);
  const stat = await caches.open(STATIC);
  const seen = new Set();
  let done = 0, okN = 0, last = 0;
  const report = (final) => {
    if (!final && Date.now() - last < 250) return;
    last = Date.now();
    client?.postMessage({ type: final ? 'precached' : 'precache-progress', id, done, count: okN, total: urls.length });
  };
  const one = async (u) => {
    try {
      if (kind === 'static') {
        if (!(await stat.match(u))) { const r = await fetch(u, { credentials: 'same-origin' }); if (r.ok && r.status === 200) await stat.put(u, r); else throw 0; }
      } else {
        const r = await fetch(u, { credentials: 'same-origin' });
        if (!r.ok) throw 0;
        const path = new URL(u, self.location.origin).pathname;
        if ((r.headers.get('content-type') || '').includes('text/html')) {
          const html = await r.clone().text();
          for (const a of assetsOf(html)) {
            if (seen.has(a)) continue;
            seen.add(a);
            if (!(await stat.match(a))) { const ar = await fetch(a).catch(() => null); if (ar && ar.ok) await stat.put(a, ar); }
          }
        }
        await pages.put(isListApi(path) ? path : u, r);
      }
      okN++;
    } catch { /* atla */ }
    done++;
    report(false);
  };
  // Aynı anda 4 istek
  let i = 0;
  await Promise.all(Array.from({ length: 4 }, async () => { while (i < urls.length) await one(urls[i++]); }));
  report(true);
}

self.addEventListener('message', (e) => {
  const d = e.data || {};
  const client = e.source;
  // Çıkış yapınca kişiye özel sayfaları ve liste verisini temizle
  if (d.type === 'clear-pages') e.waitUntil(caches.delete(PAGES).then(() => caches.open(PAGES).then((c) => c.add(OFFLINE))));
  // Bütün çevrimdışı verileri sil (sayfalar, sesler, derlenmiş dosyalar)
  if (d.type === 'clear-all') {
    e.waitUntil(Promise.all([caches.delete(PAGES), caches.delete(STATIC)])
      .then(() => caches.open(PAGES).then((c) => c.add(OFFLINE)))
      .then(() => client?.postMessage({ type: 'cleared' })));
  }
  // Çevrimdışı kullanım için indir: kind 'pages' (sayfalar ve liste verisi) ya da 'static' (sesler)
  if (d.type === 'precache' && Array.isArray(d.urls)) e.waitUntil(precache({ id: d.id || 'x', urls: d.urls, kind: d.kind || 'pages' }, client));
});
