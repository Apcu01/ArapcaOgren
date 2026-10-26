// Sunucu başlarken: önceden hazırlanmış sayfaları güncel veritabanıyla yeniden hazırlat.
// Docker derlemesinde veritabanı adresi yoksa sayfalar boş hazırlanır; bu adım onları açılıştan birkaç saniye sonra düzeltir.
// Geliştirmede gerekmez (sayfalar her istekte hazırlanır); orada sayfa yenileme ayrıca açık tarayıcıları sürekli yeniletir.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NODE_ENV !== 'production') return;
  const token = crypto.randomUUID();
  (globalThis as unknown as { __arbBootToken?: string }).__arbBootToken = token;
  const port = process.env.PORT || '3000';
  setTimeout(() => {
    fetch(`http://127.0.0.1:${port}/api/internal/refresh`, { method: 'POST', headers: { 'x-boot-token': token } }).catch(() => null);
  }, 3000);
}
