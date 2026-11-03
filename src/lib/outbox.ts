/* Çevrimdışı kuyruk (tarayıcıda): üyenin ilerleme, hata ve liste çalışması kayıtları bağlantı yokken gönderilemezse
   tarayıcıda saklanır, bağlantı gelince sırayla gönderilir. Başka bir hesapla girilirse o hesabın kuyruğu gönderilmez. */

const KEY = 'arblearn:outbox';
const MAX = 500;
const MAX_AGE = 30 * 86400000;
type Entry = { url: string; body: string; user: number; at: number };

/** Kuyruğa alınan istekler: kayıp olunca ilerleme bozulanlar (istatistik ve oturum sinyalleri değil) */
export const queueable = (url: string) => url === '/api/progress' || url === '/api/mistakes' || /^\/api\/lists\/\d+\/study$/.test(url);

function read(): Entry[] {
  try { const a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch { return []; }
}
function write(list: Entry[]) {
  try { if (list.length) localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX))); else localStorage.removeItem(KEY); } catch { /* depolama kapalı */ }
}

export function enqueue(url: string, body: unknown, user: number) {
  write([...read(), { url, body: JSON.stringify(body), user, at: Date.now() }]);
  try { window.dispatchEvent(new Event('arb:outbox')); } catch { /* yok */ }
}
export const outboxSize = (user?: number | null) => read().filter((e) => user == null || e.user === user).length;

/** POST gönderir; ağ hatasında (sunucu hatasında değil) üyenin kaydını kuyruğa alır */
export async function send(url: string, body: unknown, user: number | null, keepalive = true) {
  try {
    return await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive });
  } catch {
    if (user && queueable(url)) enqueue(url, body, user);
    return null;
  }
}

let flushing = false;
/** Kuyruğu sırayla gönderir; bağlantı yine koparsa kalanlar bekler. Gönderilen kayıt sayısını döner. */
export async function flushOutbox(user: number) {
  if (flushing) return 0;
  flushing = true;
  let sent = 0;
  try {
    const now = Date.now();
    let list = read().filter((e) => now - e.at < MAX_AGE);
    const mine = list.filter((e) => e.user === user);
    for (const e of mine) {
      let r: Response | null = null;
      try { r = await fetch(e.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: e.body }); } catch { break; }
      // Oturum bitmişse (401) daha sonra yeniden denenir; diğer sunucu yanıtlarında kayıt atılır (tekrar denemek düzeltmez)
      if (r.status === 401) break;
      list = list.filter((x) => x !== e);
      write(list);
      if (r.ok) sent++;
    }
    write(list);
  } finally { flushing = false; }
  return sent;
}
