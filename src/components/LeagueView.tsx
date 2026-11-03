'use client';

/* Haftalık lig: bu haftanın puan tablosu, kendi sıran, geçen haftanın ilk üçü ve puan kuralları */
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { XP, type LeagueBoard, type LeagueRow } from '@/lib/league';
import { useApp } from './AppProvider';
import { I, Raw } from './icons';

const MEDAL = ['bg-[#E8B04A] text-[#2a1b05]', 'bg-[#C9CDD3] text-[#1e2227]', 'bg-[#C98A55] text-[#2a1405]'];
const fmtDay = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: 'UTC' });

export function LeagueTable({ rows, me, empty }: { rows: LeagueRow[]; me: LeagueRow | null; empty: string }) {
  const meIn = me && rows.some((r) => r.userId === me.userId);
  return (
    <ol className="m-0 p-0 list-none flex flex-col gap-1.5">
      {!rows.length && <li className="p-6 rounded-2xl bg-s1 border border-line text-center text-mute">{empty}</li>}
      {[...rows, ...(me && !meIn ? [me] : [])].map((r, i) => (
        <li key={r.userId + '-' + i} className={`flex items-center gap-3 px-4 h-14 rounded-xl border ${r.me ? 'bg-chip border-acc' : 'bg-s2 border-line2'} ${me && !meIn && i === rows.length ? 'mt-3' : ''}`}>
          <span className={`w-8 h-8 shrink-0 rounded-full inline-flex items-center justify-center text-sm font-bold ${r.rank <= 3 ? MEDAL[r.rank - 1] : 'bg-s4 text-soft'}`}>{r.rank}</span>
          <span className="flex-1 min-w-0 truncate font-semibold text-ink">{r.name}{r.me && <span className="ml-2 text-xs font-bold text-acct">Sen</span>}</span>
          <span className="font-bold text-ink tabular-nums">{r.xp.toLocaleString('tr-TR')} <span className="text-xs text-faint font-semibold">puan</span></span>
        </li>
      ))}
    </ol>
  );
}

export default function LeagueView() {
  const { user, session, toast } = useApp();
  const [b, setB] = useState<LeagueBoard | null>(null);
  const [err, setErr] = useState(false);
  const load = useCallback(() => {
    fetch('/api/league', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : Promise.reject())).then(setB).catch(() => setErr(true));
  }, []);
  useEffect(() => { if (session === 'ready') load(); }, [session, user, load]);

  async function setHidden(hidden: boolean) {
    const r = await fetch('/api/league', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hidden }) }).catch(() => null);
    if (!r?.ok) { toast('Kaydedilemedi, tekrar dene.'); return; }
    toast(hidden ? 'Adın artık genel ligde görünmeyecek.' : 'Adın genel ligde görünecek.');
    load();
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Haftalık lig</span>
        <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight inline-flex items-center gap-3"><Raw html={I.trophy(36)} /> Bu haftanın sıralaması</h1>
        <p className="m-0 text-mute text-lg max-w-[680px]">Ders okudukça, etkinlik bitirdikçe ve listelerini çalıştıkça puan kazanırsın. Lig her pazartesi sıfırlanır. Sınıfındaysan sınıf sayfasında yalnızca sınıf arkadaşlarınla olan sıralamayı da görürsün.</p>
      </div>

      {err && <p className="m-0 p-4 rounded-xl bg-badbg border border-badln text-bad">Lig yüklenemedi. Sayfayı yenileyip tekrar dene.</p>}
      {!b && !err && <p className="m-0 text-mute">Yükleniyor</p>}
      {b && (
        <>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
            <div className="p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-1"><span className="text-sm text-mute2">Hafta</span><span className="text-lg font-bold">{fmtDay(b.week)} - {fmtDay(b.end)}</span></div>
            <div className="p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-1"><span className="text-sm text-mute2">Bitmesine</span><span className="text-lg font-bold">{b.daysLeft === 0 ? 'Bugün bitiyor' : b.daysLeft + ' gün'}</span></div>
            <div className="p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-1 col-span-2 sm:col-span-1"><span className="text-sm text-mute2">Senin puanın</span><span className="text-lg font-bold">{user ? (b.me ? `${b.me.xp} · ${b.me.rank}. sıra` : '0 puan') : 'Giriş yapmadın'}</span></div>
          </div>

          {!user && (
            <div className="flex flex-wrap items-center gap-4 p-5 rounded-2xl border border-dashed border-line3">
              <span className="flex-1 min-w-[220px] text-mute">Lige katılmak için hesabın olmalı. Misafirken çalıştıkların sayılmaz.</span>
              <Link href="/kayit" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Hesap aç</Link>
              <Link href="/giris" className="h-11 px-5 rounded-xl border border-line3 text-soft font-semibold inline-flex items-center">Giriş yap</Link>
            </div>
          )}

          <section className="flex flex-col gap-3" aria-label="Sıralama">
            <LeagueTable rows={b.rows} me={b.me} empty="Bu hafta henüz kimse puan almadı. İlk sen ol!" />
          </section>

          {b.lastWeek.length > 0 && (
            <section className="flex flex-col gap-3" aria-labelledby="gecen-hafta">
              <h2 id="gecen-hafta" className="m-0 text-xl font-bold">Geçen haftanın ilk üçü</h2>
              <LeagueTable rows={b.lastWeek} me={null} empty="" />
            </section>
          )}

          <section className="flex flex-col gap-3 p-5 sm:p-6 rounded-2xl bg-s1 border border-line" aria-labelledby="kurallar">
            <h2 id="kurallar" className="m-0 text-lg font-bold">Puanlar nasıl kazanılır?</h2>
            <ul className="m-0 pl-5 flex flex-col gap-1.5 text-soft leading-relaxed">
              <li>Bir dersin konu anlatımını ilk kez okumak: <b>{XP.lesson} puan</b></li>
              <li>Etkinlik, dikte ya da okuma metni sorularını bitirmek: başarına göre <b>{XP.actBase} ile {XP.actBase + XP.actScore} puan</b>; ilk kez %70 ve üstü alırsan <b>+{XP.actDone}</b></li>
              <li>Kelime listelerinde her doğru cevap: <b>{XP.listAnswer} puan</b>; bir liste oyununu bitirmek: <b>{XP.game} puan</b></li>
              <li>Günde en fazla {XP.dailyCap.toLocaleString('tr-TR')} puan kazanılır. Gün ve hafta Türkiye saatine göredir.</li>
            </ul>
            <p className="m-0 text-xs text-faint">Ligde adının yalnızca ilk kısmı ve soyadının baş harfi görünür.</p>
            {user && (
              <label className="flex items-center justify-between gap-3 pt-2 border-t border-line cursor-pointer">
                <span className="flex flex-col"><span className="font-semibold text-ink">Adımı genel ligde gösterme</span><span className="text-xs text-faint">Puan kazanmaya devam edersin; sınıf ligleri bundan etkilenmez.</span></span>
                <input type="checkbox" checked={b.hidden} onChange={(e) => setHidden(e.target.checked)} className="w-5 h-5 accent-acc" />
              </label>
            )}
          </section>
        </>
      )}
    </div>
  );
}
