import { z } from 'zod';
import { fail, ok, parse } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { getSubscription, pushReady, removeSubscription, saveSubscription, sendPush, setKinds } from '@/lib/push';
import { PUSH_KINDS, pushEndpointOk } from '@/lib/push-shared';

// Bildirim ayarı: açık mı ve açık anahtar; endpoint verilirse bu cihazın seçtiği türler
export async function GET(req: Request) {
  const user = await getSessionUser();
  const endpoint = new URL(req.url).searchParams.get('endpoint');
  const sub = user && endpoint ? await getSubscription(user.id, endpoint.slice(0, 512)) : null;
  const res = ok({ enabled: pushReady(), publicKey: process.env.VAPID_PUBLIC_KEY || null, kinds: sub?.kinds ?? null });
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}

const endpoint = z.string().url().max(512).refine(pushEndpointOk, 'Bu tarayıcının bildirim servisi desteklenmiyor.');
const kinds = z.array(z.enum(PUSH_KINDS)).max(PUSH_KINDS.length);
const Body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('subscribe'), subscription: z.object({ endpoint, keys: z.object({ p256dh: z.string().min(10).max(200), auth: z.string().min(4).max(100) }) }), kinds }),
  z.object({ action: z.literal('kinds'), endpoint, kinds }),
  z.object({ action: z.literal('unsubscribe'), endpoint }),
  z.object({ action: z.literal('test'), endpoint })
]);

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail('Bildirimler için giriş yapmalısın.', 401);
  if (!pushReady()) return fail('Bildirimler bu sitede kapalı.', 503);
  const p = await parse(req, Body);
  if ('res' in p) return p.res;
  const b = p.data;
  switch (b.action) {
    case 'subscribe':
      await saveSubscription(user.id, { endpoint: b.subscription.endpoint, ...b.subscription.keys }, b.kinds);
      return ok();
    case 'kinds':
      return (await setKinds(user.id, b.endpoint, b.kinds)) ? ok() : fail('Bu cihazda bildirim açık değil.', 404);
    case 'unsubscribe':
      await removeSubscription(user.id, b.endpoint);
      return ok();
    case 'test': {
      const r = await sendPush([user.id], { title: 'Bildirimler açık', body: 'Hatırlatmalar bu cihaza böyle gelecek.', url: '/hesap', tag: 'test' }, undefined, b.endpoint);
      return r.sent ? ok() : fail('Deneme bildirimi gönderilemedi.', 502);
    }
  }
}
