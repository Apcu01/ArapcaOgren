'use client';

/* Rozetler: İlerlemem sayfasındaki ızgara ve yeni kazanılan rozet bildirimi */
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BADGES, evaluate, progressStats, type BadgeStats } from '@/lib/badges';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

type MemberStats = Pick<BadgeStats, 'words' | 'lists' | 'live' | 'podiums' | 'xp'>;

/** Üyenin hesaba bağlı sayıları (listeler, canlı yarışma, puan) */
export function useMemberStats() {
  const { user } = useApp();
  const [m, setM] = useState<MemberStats | null>(null);
  useEffect(() => {
    if (!user) { setM(null); return; }
    let live = true;
    fetch('/api/stats', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (live && j) setM(j); }).catch(() => null);
    return () => { live = false; };
  }, [user]);
  return m;
}

export default function BadgeGrid() {
  const { state, user } = useApp();
  const member = useMemberStats();
  const list = useMemo(() => evaluate({ ...progressStats(state), ...(member || {}) }, !!user), [state, member, user]);
  const earned = list.filter((b) => b.earned).length;
  return (
    <section className="flex flex-col gap-4" aria-labelledby="rozetler">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="rozetler" className="m-0 text-[24px] font-bold inline-flex items-center gap-2"><Raw html={I.medal(22)} /> Rozetler</h2>
        <span className="text-sm text-mute">{earned} / {list.length} rozet kazandın</span>
      </div>
      <ul className="m-0 p-0 list-none grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((b) => (
          <li key={b.id} className={`min-w-0 p-4 rounded-2xl border flex flex-col gap-2.5 ${b.earned ? 'bg-s4 border-lineh' : 'bg-s1 border-line'}`} title={b.desc}>
            <span className="flex flex-col items-start gap-2 min-[440px]:flex-row min-[440px]:items-center min-[440px]:gap-3">
              <span aria-hidden="true" className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-ar text-[17px] font-bold border-2 ${b.earned ? 'bg-acc text-onacc border-accs' : 'bg-s2 text-dim border-line3'}`}>{b.glyph}</span>
              <span className="flex flex-col min-w-0 break-words">
                <span className={`font-bold leading-tight ${b.earned ? 'text-ink' : 'text-soft'}`}>{b.title}</span>
                <span className="text-xs text-mute2 leading-snug">{b.desc}</span>
              </span>
            </span>
            {b.earned
              ? <span className="self-start px-2 py-0.5 rounded-full bg-okbg border border-okln text-okt text-[11px] font-bold">Kazanıldı</span>
              : b.locked
                ? <span className="text-xs text-faint"><Link href="/giris">Giriş yap</Link>, hesapla kazanılır</span>
                : (
                  <span className="flex items-center gap-2">
                    <span className="flex-1 h-1.5 rounded-full bg-track overflow-hidden"><span className="block h-full rounded-full bg-acc" style={{ width: Math.round((b.cur / b.target) * 100) + '%' }} /></span>
                    <span className="text-[11px] text-faint font-semibold">{b.cur}/{b.target}</span>
                  </span>
                )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Yeni rozet bildirimi: ilerlemeden hesaplanan rozetler değişince "Yeni rozet" bildirimi gösterir.
 * İlk açılışta mevcut rozetler sessizce kaydedilir (eski rozetler için bildirim yağmuru olmaz).
 */
export function BadgeWatcher() {
  const { state, ready, user, session, toast } = useApp();
  const owner = useRef<string | null>(null);
  useEffect(() => {
    if (!ready || session !== 'ready') return;
    const who = user ? 'u' + user.id : 'misafir';
    const key = 'arblearn:badges:' + who;
    const now = evaluate(progressStats(state) as BadgeStats, false).filter((b) => b.earned && !b.member).map((b) => b.id);
    let seen: string[] | null = null;
    try { seen = JSON.parse(localStorage.getItem(key) || 'null'); } catch { /* yok */ }
    // Oturum değiştiyse (giriş / çıkış) yalnızca kaydet
    const fresh = owner.current !== who;
    owner.current = who;
    if (seen && !fresh) {
      const added = now.filter((id) => !seen!.includes(id));
      if (added.length) {
        const b = BADGES.find((x) => x.id === added[added.length - 1])!;
        toast(added.length > 1 ? `${added.length} yeni rozet kazandın! Son kazandığın: ${b.title}` : `Yeni rozet: ${b.title}. ${b.desc}.`);
      }
    }
    try { localStorage.setItem(key, JSON.stringify([...new Set([...(seen || []), ...now])])); } catch { /* yok */ }
  }, [state, ready, user, session, toast]);
  return null;
}
