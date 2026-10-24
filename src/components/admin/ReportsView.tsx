'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '../AppProvider';
import { Raw } from '../icons';
import { Card, ago, dt } from './ui';
import { KIND_LABEL, REPORT_REASONS, type ReportKind, type ReportReason } from '@/lib/report';
import type { ReportContext } from '@/lib/types';

export type ReportRow = {
  id: number;
  topicId: string;
  topicName: string | null;
  kind: ReportKind;
  reason: ReportReason;
  message: string | null;
  context: ReportContext;
  status: 'open' | 'done';
  userId: number | null;
  userName: string | null;
  createdAt: string;
  resolvedAt: string | null;
};

const FILTERS = [['open', 'Açık'], ['done', 'Çözüldü'], ['all', 'Tümü']] as const;

export default function ReportsView({ rows }: { rows: ReportRow[] }) {
  const router = useRouter();
  const { toast } = useApp();
  const [filter, setFilter] = useState<'open' | 'done' | 'all'>('open');
  const [busy, setBusy] = useState<number | null>(null);
  const counts = { open: rows.filter((r) => r.status === 'open').length, done: rows.filter((r) => r.status === 'done').length, all: rows.length };
  const shown = rows.filter((r) => filter === 'all' || r.status === filter);

  async function call(id: number, method: 'PATCH' | 'DELETE', status?: 'open' | 'done') {
    if (method === 'DELETE' && !confirm('Bu bildirim kalıcı olarak silinsin mi?')) return;
    setBusy(id);
    const r = await fetch('/api/admin/reports', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) }).catch(() => null);
    setBusy(null);
    if (!r?.ok) { toast('İşlem yapılamadı.'); return; }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-3xl font-bold tracking-tight">Hata bildirimleri</h1>
          <p className="m-0 text-mute">Kullanıcıların sorular, kelimeler ve ders bölümleri için bildirdiği hatalar. Bildirilen içerik, bildirildiği andaki hâliyle saklanır.</p>
        </div>
        <div className="flex gap-2" role="tablist">
          {FILTERS.map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
              className={`h-10 px-4 rounded-full text-sm font-semibold border ${filter === k ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line2 hover:border-lineh'}`}>
              {l} <span className="opacity-70">{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>
      {shown.length === 0 ? (
        <Card><p className="m-0 text-mute">{filter === 'open' ? 'Açık bildirim yok.' : 'Gösterilecek bildirim yok.'}</p></Card>
      ) : shown.map((r) => (
        <Card key={r.id} className={r.status === 'done' ? 'opacity-70' : ''}
          title={<span className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${r.status === 'open' ? 'bg-badbg border-badln text-bad' : 'bg-okbg border-okln text-okt'}`}>{r.status === 'open' ? 'Açık' : 'Çözüldü'}</span>
            <span>{REPORT_REASONS[r.reason] ?? r.reason}</span>
          </span>}
          right={<span className="text-xs text-faint" title={dt(r.createdAt, true)}>{ago(r.createdAt)}</span>}>
          <div className="flex flex-col gap-4">
            <p className="m-0 text-sm text-mute">
              <b className="text-soft">{r.topicName || r.topicId}</b> · {KIND_LABEL[r.kind] ?? r.kind}{r.context.act ? ` · ${r.context.act}` : ''} · {r.userId ? <Link href={`/admin/kullanicilar/${r.userId}`}>{r.userName || 'Kullanıcı #' + r.userId}</Link> : 'Misafir'}
            </p>
            <Context ctx={r.context} kind={r.kind} />
            {r.message && <p className="m-0 px-4 py-3 rounded-xl bg-s2 border border-line2 text-[15px] text-ink whitespace-pre-wrap">&quot;{r.message}&quot;</p>}
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/dersler/${r.topicId}`} className="h-10 px-4 rounded-xl bg-s2 border border-line3 text-soft text-sm font-semibold inline-flex items-center hover:border-lineh hover:text-ink">Dersi düzenle</Link>
              {r.status === 'open'
                ? <button type="button" disabled={busy === r.id} onClick={() => call(r.id, 'PATCH', 'done')} className="h-10 px-4 rounded-xl bg-acc text-onacc text-sm font-bold disabled:opacity-60">Çözüldü olarak işaretle</button>
                : <button type="button" disabled={busy === r.id} onClick={() => call(r.id, 'PATCH', 'open')} className="h-10 px-4 rounded-xl bg-s2 border border-line3 text-soft text-sm font-semibold hover:border-lineh disabled:opacity-60">Yeniden aç</button>}
              <button type="button" disabled={busy === r.id} onClick={() => call(r.id, 'DELETE')} className="h-10 px-4 rounded-xl border border-badln text-bad text-sm font-semibold hover:bg-badbg disabled:opacity-60">Sil</button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Context({ ctx, kind }: { ctx: ReportContext; kind: ReportKind }) {
  const { tx } = useApp();
  const row = (k: string, v: unknown) => v == null || v === '' ? null : (
    <div key={k} className="grid grid-cols-[110px_1fr] gap-3 items-baseline">
      <span className="text-xs font-bold tracking-[.06em] uppercase text-lab">{k}</span>
      <Raw className="text-[15px] text-ink" html={tx.auto(String(v), 'text-xl')} />
    </div>
  );
  let body: React.ReactNode;
  if (kind === 'question' && ctx.question) {
    const q = ctx.question;
    const answer = typeof q.a === 'boolean' ? (q.a ? 'Doğru' : 'Yanlış') : q.a;
    body = [
      row('Soru', q.q), row('Arapça', q.ar), row('Cümle', q.s), row('Saat', q.clock), row('Türkçe', q.tr),
      row('Kelimeler', q.w?.join(' ')), row('Seçenekler', q.options?.join(' · ')), row('Doğru cevap', answer), row('Açıklama', q.why)
    ];
  } else if (kind === 'word' && ctx.word) {
    const w = ctx.word;
    body = [row('Arapça', w.ar), row('Okunuş', w.tl), row('Türkçe', w.tr), row('İngilizce', w.en), row('Not', w.note)];
  } else {
    body = row('Bölüm', ctx.label);
  }
  return <div className="flex flex-col gap-2 p-4 rounded-xl bg-s1 border border-line">{body}</div>;
}
