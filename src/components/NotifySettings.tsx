'use client';

/* Bildirim ayarları (Hesabım): bu cihazda bildirimleri aç / kapat, hangi hatırlatmaların geleceğini seç, deneme bildirimi */
import { useCallback, useEffect, useState } from 'react';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';
import { PUSH_KINDS, PUSH_LABEL, type PushKind } from '@/lib/push-shared';

type State = 'loading' | 'off-site' | 'unsupported' | 'no-sw' | 'denied' | 'off' | 'on';

const b64ToBytes = (s: string) => {
  const raw = atob((s + '='.repeat((4 - (s.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

export default function NotifySettings() {
  const { toast } = useApp();
  const [st, setSt] = useState<State>('loading');
  const [key, setKey] = useState<string | null>(null);
  const [kinds, setKinds] = useState<PushKind[]>([...PUSH_KINDS]);
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const post = (body: Record<string, unknown>) => fetch('/api/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  const load = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) { setSt('unsupported'); return; }
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription().catch(() => null);
    const r = await fetch('/api/push' + (sub ? '?endpoint=' + encodeURIComponent(sub.endpoint) : ''), { cache: 'no-store' }).then((x) => x.json()).catch(() => null) as { enabled: boolean; publicKey: string | null; kinds: PushKind[] | null } | null;
    if (!r?.enabled || !r.publicKey) { setSt('off-site'); return; }
    setKey(r.publicKey);
    if (!reg) { setSt('no-sw'); return; }
    if (Notification.permission === 'denied') { setSt('denied'); return; }
    if (sub && r.kinds) { setEndpoint(sub.endpoint); setKinds(r.kinds); setSt('on'); } else setSt('off');
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function enable() {
    if (!key) return;
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { setSt(perm === 'denied' ? 'denied' : 'off'); return; }
      const reg = await navigator.serviceWorker.ready;
      const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(key) });
      const j = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      const r = await post({ action: 'subscribe', subscription: { endpoint: j.endpoint, keys: j.keys }, kinds });
      if (!r.ok) throw new Error();
      setEndpoint(j.endpoint); setSt('on');
      toast('Bildirimler bu cihazda açıldı.');
    } catch { toast('Bildirimler açılamadı. Tarayıcı izinlerini kontrol edip tekrar dene.'); } finally { setBusy(false); }
  }
  async function disable() {
    setBusy(true);
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription().catch(() => null);
    if (sub) { await post({ action: 'unsubscribe', endpoint: sub.endpoint }).catch(() => null); await sub.unsubscribe().catch(() => null); }
    setEndpoint(null); setSt('off'); setBusy(false);
    toast('Bildirimler bu cihazda kapatıldı.');
  }
  async function toggle(k: PushKind, on: boolean) {
    const next = on ? [...kinds, k] : kinds.filter((x) => x !== k);
    setKinds(next);
    if (endpoint) { const r = await post({ action: 'kinds', endpoint, kinds: next }).catch(() => null); if (!r?.ok) toast('Kaydedilemedi, tekrar dene.'); }
  }
  async function test() {
    if (!endpoint) return;
    const r = await post({ action: 'test', endpoint }).catch(() => null);
    toast(r?.ok ? 'Deneme bildirimi gönderildi.' : 'Deneme bildirimi gönderilemedi.');
  }

  const note: Partial<Record<State, string>> = {
    'off-site': 'Bildirimler bu sitede henüz açılmadı.',
    unsupported: 'Bu tarayıcı bildirimleri desteklemiyor. iPhone ve iPad\'de siteyi önce Ana Ekrana ekleyip oradan açman gerekir.',
    'no-sw': 'Bildirimler, site yayındaki adresinden (https) açıldığında çalışır. Sayfayı yenileyip tekrar dene.',
    denied: 'Bu sitenin bildirimleri tarayıcı ayarlarından engellenmiş. Adres çubuğundaki kilit simgesinden izin verebilirsin.'
  };
  return (
    <section id="bildirimler" className="flex flex-col gap-4 p-6 rounded-2xl bg-s3 border border-line scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-xl font-bold inline-flex items-center gap-2"><Raw html={I.alert(19)} /> Bildirimler</h2>
        {st === 'on' && <span className="px-2.5 py-1 rounded-full bg-okbg border border-okln text-okt text-xs font-bold">Bu cihazda açık</span>}
      </div>
      <p className="m-0 text-sm text-mute">Serini, ödevlerini ve haftalık ligi unutma diye bu cihaza hatırlatma gönderelim. Her cihazda ayrı açılır; istediğin zaman kapatabilirsin.</p>
      {st === 'loading' && <p className="m-0 text-sm text-faint">Yükleniyor</p>}
      {note[st] && <p className="m-0 p-3 rounded-xl bg-s2 border border-line2 text-sm text-soft">{note[st]}</p>}
      {(st === 'off' || st === 'on') && (
        <>
          <div className="flex flex-col gap-1">
            {PUSH_KINDS.map((k) => (
              <label key={k} className="flex items-center justify-between gap-3 py-2 cursor-pointer">
                <span className="flex flex-col"><span className="font-semibold text-ink">{PUSH_LABEL[k][0]}</span><span className="text-xs text-faint">{PUSH_LABEL[k][1]}</span></span>
                <input type="checkbox" checked={kinds.includes(k)} onChange={(e) => toggle(k, e.target.checked)} className="w-5 h-5 accent-acc" />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {st === 'off'
              ? <button type="button" onClick={enable} disabled={busy || !kinds.length} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50">{busy ? 'Açılıyor' : 'Bildirimleri aç'}</button>
              : <>
                <button type="button" onClick={test} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:text-ink">Deneme bildirimi gönder</button>
                <button type="button" onClick={disable} disabled={busy} className="h-11 px-4 rounded-xl text-soft font-semibold hover:text-bad">Bu cihazda kapat</button>
              </>}
          </div>
        </>
      )}
    </section>
  );
}
