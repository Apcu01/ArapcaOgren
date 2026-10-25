import { fail, ok } from '@/lib/api';
import { refreshSite } from '@/lib/cache';

// Yalnızca sunucunun kendisi, açılışta bir kez çağırır (instrumentation.ts); dışarıdan çağrılamaz
export async function POST(req: Request) {
  const g = globalThis as unknown as { __arbBootToken?: string };
  const token = req.headers.get('x-boot-token');
  if (!g.__arbBootToken || token !== g.__arbBootToken) return fail('Yetkisiz.', 403);
  g.__arbBootToken = undefined;
  refreshSite();
  return ok();
}
