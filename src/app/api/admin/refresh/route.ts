import { adminOrFail } from '@/lib/admin';
import { ok } from '@/lib/api';
import { refreshSite } from '@/lib/cache';

// "Siteyi yenile": komut satırı betiklerinden (db:seed, db:lexicon, audio:narrate) sonra sayfaları hemen güncellemek için
export async function POST() {
  const a = await adminOrFail();
  if ('res' in a) return a.res;
  refreshSite();
  return ok();
}
