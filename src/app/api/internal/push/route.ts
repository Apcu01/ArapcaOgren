import { fail, ok } from '@/lib/api';
import { runReminders } from '@/lib/push';

// Zamanı gelen hatırlatmaları gönderir. Çağıran: sunucunun kendi zamanlayıcısı (instrumentation.ts, x-cron-token)
// ya da dış zamanlayıcı (cron, x-cron-key = CRON_SECRET). Aynı gün aynı hatırlatma ikinci kez gitmez.
export async function POST(req: Request) {
  const g = globalThis as unknown as { __arbCronToken?: string };
  const own = g.__arbCronToken && req.headers.get('x-cron-token') === g.__arbCronToken;
  const ext = process.env.CRON_SECRET && req.headers.get('x-cron-key') === process.env.CRON_SECRET;
  if (!own && !ext) return fail('Yetkisiz.', 403);
  return ok(await runReminders());
}
