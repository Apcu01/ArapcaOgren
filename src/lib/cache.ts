import 'server-only';
import { revalidatePath } from 'next/cache';

/* Sık okunan ve seyrek değişen veriler (dersler, ses eşlemesi, anlatım sesleri) için süreç içi önbellek.
   Uzak veritabanına her istekte gidilmez. Yönetim panelindeki değişiklikler invalidate ile anında yansır;
   komut satırı betiklerinin (seed, ses üretimi) yaptığı değişiklikler en geç TTL süresi sonunda görünür. */
type Entry = { at: number; v: Promise<unknown> };
const g = globalThis as unknown as { __arbCache?: Map<string, Entry> };
const store = (g.__arbCache ??= new Map());

export const CACHE_TTL = 5 * 60_000;

export function cached<T>(key: string, fn: () => Promise<T>, ttl = CACHE_TTL): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.v as Promise<T>;
  const v = fn();
  store.set(key, { at: Date.now(), v });
  // Hatalı sonuç önbellekte kalmasın
  v.catch(() => { if (store.get(key)?.v === v) store.delete(key); });
  return v;
}

/** Verilen öneklerle başlayan kayıtları siler; önek verilmezse hepsini */
export function invalidate(...prefixes: string[]) {
  for (const k of [...store.keys()]) if (!prefixes.length || prefixes.some((p) => k.startsWith(p))) store.delete(k);
}

/**
 * Bellek önbelleğini temizler ve önceden hazırlanmış bütün sayfaların yeniden hazırlanmasını ister.
 * Yönetim panelindeki değişikliklerden sonra çağrılır; ziyaretçiler bir sonraki istekte güncel sayfayı görür.
 */
export function refreshSite(...prefixes: string[]) {
  // Kelime sayfaları dersleri de kullanır: her yenilemede onlar da tazelenir
  invalidate(...prefixes, ...(prefixes.length ? ['words:'] : []));
  try { revalidatePath('/', 'layout'); } catch { /* istek dışında çağrıldıysa (betik) yok say */ }
}

/**
 * Derleme sırasında veritabanına ulaşılamazsa (ör. Docker derlemesinde adres verilmediyse) derlemeyi düşürmez, boş değer döner.
 * Sayfalar ilk istekte veritabanından yeniden hazırlanır. Çalışma sırasındaki hatalar olduğu gibi iletilir.
 */
export async function buildSafe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (process.env.NEXT_PHASE !== 'phase-production-build') return fn();
  try { return await fn(); } catch (e) {
    console.warn('Derleme sırasında veritabanına ulaşılamadı, sayfa ilk istekte hazırlanacak:', (e as Error).message);
    return fallback;
  }
}
