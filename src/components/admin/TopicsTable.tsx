'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { I, Raw } from '../icons';
import { Card, pct, scoreColor } from './ui';

type Row = { id: string; n: number; name: string; ar: string; glyph: string; level: string; published: boolean; acts: number; words: number; sections: number };

export default function TopicsTable({ topics, usage }: { topics: Row[]; usage: Record<string, { n: number; avg: number }> }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState('');

  async function call(id: string, method: 'PATCH' | 'DELETE', body?: unknown) {
    setBusy(id);
    setErr('');
    const r = await fetch(`/api/admin/topics/${id}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    setBusy(null);
    if (!r.ok) { setErr(j.error || 'İşlem başarısız.'); return; }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight">Dersler ve etkinlikler</h1>
          <p className="m-0 text-mute">{topics.length} ders · {topics.reduce((n, t) => n + t.acts, 0)} etkinlik. Sıra, ders numarasına göredir.</p>
        </div>
        <Link href="/admin/dersler/yeni" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold text-[15px] inline-flex items-center gap-2 hover:text-onacc"><Raw html={I.plus(18)} /> Yeni ders</Link>
      </div>
      {err && <p role="alert" className="m-0 px-4 py-3 rounded-xl bg-badbg border border-badln text-bad text-sm">{err}</p>}
      <Card>
        <div className="overflow-x-auto -mx-1">
          <table className="lt min-w-[820px]">
            <thead><tr><th>Ders</th><th>Seviye</th><th>İçerik</th><th>Bitirilen</th><th>Durum</th><th className="text-right">İşlemler</th></tr></thead>
            <tbody>
              {topics.map((t) => {
                const u = usage[t.id];
                return (
                  <tr key={t.id}>
                    <td>
                      <Link href={`/admin/dersler/${t.id}`} className="flex items-center gap-3 text-ink hover:text-ink">
                        <span className="w-11 h-11 shrink-0 rounded-xl bg-chip border border-chipln flex items-center justify-center font-ar text-[22px] text-acct">{t.glyph}</span>
                        <span className="flex flex-col"><span className="font-semibold">{t.n}. {t.name}</span><span className="text-xs text-faint font-mono">{t.id}</span></span>
                      </Link>
                    </td>
                    <td className="text-sm">{t.level}</td>
                    <td className="text-sm whitespace-nowrap">{t.sections} bölüm · {t.acts} etkinlik · {t.words} kelime</td>
                    <td className="text-sm whitespace-nowrap">{u ? <>{u.n} · <b className={scoreColor(u.avg)}>{pct(u.avg)}</b></> : <span className="text-faint">-</span>}</td>
                    <td>
                      <button type="button" disabled={busy === t.id} onClick={() => call(t.id, 'PATCH', { published: !t.published })}
                        className={`px-2.5 py-1 rounded-full border text-xs font-bold ${t.published ? 'bg-okbg text-okt border-okln' : 'bg-s0 text-dim border-edge'}`}
                        title="Yayın durumunu değiştir">
                        {t.published ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>
                    <td>
                      <span className="flex justify-end gap-2">
                        <Link href={t.published ? `/konu/${t.id}` : `/admin/dersler/${t.id}/onizleme`} target="_blank" className="h-9 px-3 rounded-lg border border-line3 bg-s2 text-soft text-sm font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Gör</Link>
                        <Link href={`/admin/dersler/${t.id}`} className="h-9 px-3 rounded-lg border border-line3 bg-s2 text-soft text-sm font-semibold inline-flex items-center gap-1.5 hover:text-ink hover:border-lineh"><Raw html={I.edit(15)} /> Düzenle</Link>
                        <button type="button" disabled={busy === t.id} aria-label={`${t.name} dersini sil`}
                          onClick={() => { if (confirm(`"${t.name}" dersi, etkinlikleri ve kullanıcıların bu dersteki ilerlemesi kalıcı olarak silinecek. Emin misin?`)) call(t.id, 'DELETE'); }}
                          className="h-9 w-9 rounded-lg border border-badln text-bad inline-flex items-center justify-center hover:bg-badbg" dangerouslySetInnerHTML={{ __html: I.trash(16) }} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
