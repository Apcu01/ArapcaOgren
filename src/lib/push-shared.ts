/* Web bildirimleri: hatırlatma türleri (tarayıcı ve sunucu ortak) */

export const PUSH_KINDS = ['streak', 'due', 'league', 'posts'] as const;
export type PushKind = (typeof PUSH_KINDS)[number];
export const PUSH_LABEL: Record<PushKind, [title: string, hint: string]> = {
  streak: ['Seri hatırlatması', 'Akşam 20.00 civarı, o gün henüz çalışmadıysan'],
  due: ['Ödev hatırlatması', 'Bir ödevin son günü yarınsa ve bitirmediysen, 18.00 civarı'],
  league: ['Lig bitiyor', 'Pazar 18.00 civarı, o hafta puan aldıysan'],
  posts: ['Sınıf duyuruları', 'Öğretmenin sınıfa duyuru paylaşınca']
};
/** Saatler Türkiye saatine göre */
export const PUSH_HOURS = { streak: 20, due: 18, league: 18 } as const;

export type PushPayload = { title: string; body: string; url: string; tag?: string };

/* Bildirim adresi yalnızca tarayıcıların bildirim servislerinden biri olabilir (Chrome, Opera, Samsung: Google;
   Firefox: Mozilla; Edge: Microsoft; Safari: Apple). Sunucu bildirimi bu adrese gönderdiği için başka bir adres
   kabul edilirse site, iç ağdaki ya da başka sitelerdeki adreslere istek atmak için kullanılabilirdi. */
const PUSH_HOSTS = ['googleapis.com', 'mozilla.com', 'mozaws.net', 'windows.com', 'microsoft.com', 'apple.com'];
export function pushEndpointOk(endpoint: string) {
  let u: URL;
  try { u = new URL(endpoint); } catch { return false; }
  if (u.protocol !== 'https:' || (u.port && u.port !== '443') || u.username || u.password) return false;
  const host = u.hostname.toLowerCase();
  return PUSH_HOSTS.some((d) => host === d || host.endsWith('.' + d));
}

/** Hatırlatma metinleri */
export const streakText = (days: number): PushPayload => ({
  title: days > 1 ? `${days} günlük serin bozulmasın` : 'Bugün de biraz Arapça?',
  body: days > 1 ? 'Bugün henüz çalışmadın. Beş dakikalık bir etkinlik serini korur.' : 'Bugün henüz çalışmadın. Kısa bir etkinlikle güne Arapça kat.',
  url: '/', tag: 'streak'
});
export const dueText = (titles: string[]): PushPayload => ({
  title: titles.length > 1 ? `${titles.length} ödevin son günü yarın` : 'Ödevinin son günü yarın',
  body: titles.length > 1 ? `${titles[0]} ve ${titles.length - 1} ödev daha seni bekliyor.` : `${titles[0]} seni bekliyor.`,
  url: '/siniflar', tag: 'due'
});
export const leagueText = (xp: number, rank: number | null): PushPayload => ({
  title: 'Haftalık lig bu gece bitiyor',
  body: rank ? `Bu hafta ${xp} puanla ${rank}. sıradasın. Son bir etkinlikle yükselebilirsin.` : `Bu hafta ${xp} puan topladın. Son bir etkinlikle haftayı kapat.`,
  url: '/lig', tag: 'league'
});
export const postText = (className: string, body: string, classId: number): PushPayload => ({
  title: `${className}: yeni duyuru`,
  body: body.length > 140 ? body.slice(0, 137) + '...' : body,
  url: `/siniflar/${classId}`, tag: 'post-' + classId
});
