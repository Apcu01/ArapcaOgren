import { NextResponse, type NextRequest } from 'next/server';

/* Başka bir siteden kullanıcı adına işlem yapılmasını (CSRF) önler.
   Oturum çerezi SameSite=Lax olduğu için başka alan adlarından gelen POST isteklerinde zaten gönderilmez; ancak aynı ana
   alan adının alt alan adları (ör. başka bir *.minefox.net sitesi) tarayıcıya göre "aynı site" sayılır ve çerez gider.
   Bu yüzden veri değiştiren API isteklerinde isteğin bu sitenin kendi sayfalarından geldiği ayrıca denetlenir.
   Tarayıcı dışı istemciler (sunucunun kendi zamanlayıcısı, dış cron, testler) bu başlıkları göndermez ve etkilenmez. */
const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);

const deny = () => NextResponse.json({ error: 'Bu istek yalnızca sitenin kendi sayfalarından gönderilebilir.' }, { status: 403 });

export function proxy(req: NextRequest) {
  if (SAFE.has(req.method)) return NextResponse.next();
  // Güncel tarayıcılar isteğin nereden geldiğini bu başlıkla bildirir; sayfadaki betik değiştiremez
  const site = req.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin' || site === 'none' ? NextResponse.next() : deny();
  // Bu başlığı göndermeyen eski tarayıcılar: Origin başka bir adresi gösteriyorsa reddet
  const origin = req.headers.get('origin');
  if (origin) {
    let host = '';
    try { host = new URL(origin).host; } catch { /* "null" ya da bozuk değer */ }
    const own = [req.headers.get('host'), req.headers.get('x-forwarded-host')].filter(Boolean);
    if (!host || !own.includes(host)) return deny();
  }
  return NextResponse.next();
}

export const config = { matcher: '/api/:path*' };
