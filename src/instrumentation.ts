// Sunucu başlarken: önceden hazırlanmış sayfaları güncel veritabanıyla yeniden hazırlat.
// Docker derlemesinde veritabanı adresi yoksa sayfalar boş hazırlanır; bu adım onları açılıştan birkaç saniye sonra düzeltir.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const token = crypto.randomUUID();
  (globalThis as unknown as { __arbBootToken?: string }).__arbBootToken = token;
  const port = process.env.PORT || '3000';
  setTimeout(() => {
    fetch(`http://127.0.0.1:${port}/api/internal/refresh`, { method: 'POST', headers: { 'x-boot-token': token } }).catch(() => null);
  }, 3000);
}
