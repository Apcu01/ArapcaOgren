'use client';

/* Geçmiş yarışmalarım: giriş yapmış öğretmenin biten yarışmaları ve raporları */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch } from '../lists/useList';
import { Loading, LoginNeeded, Missing } from '../lists/parts';
import ReportView from './ReportView';
import type { LiveReport } from '@/lib/live-report';

type Row = { id: number; title: string; questions: number; players: number; accuracy: number; startedAt: string };

export function LiveHistoryList() {
  const { user, session } = useApp();
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    if (session === 'loading' || !user) return;
    jsonFetch<{ results: Row[] }>('/api/live/history').then((r) => r.ok && setRows(r.data.results));
  }, [session, user]);
  if (session === 'loading') return <Loading />;
  if (!user) return <LoginNeeded what="Geçmiş yarışmalar" />;
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-6">
      <Link href="/canli" className="self-start inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><Raw html={I.back()} /> Canlı yarışma</Link>
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[34px] font-bold tracking-tight">Geçmiş yarışmalarım</h1>
        <p className="m-0 text-mute">Giriş yapmışken açtığın yarışmalar bitince burada saklanır: kimin neyi bildiği, en çok zorlanılan kelimeler ve Excel'e indirme.</p>
      </div>
      {!rows ? <Loading /> : !rows.length ? (
        <div className="p-8 rounded-2xl bg-s1 border border-line text-center flex flex-col items-center gap-3">
          <p className="m-0 text-mute">Henüz biten bir yarışman yok.</p>
          <Link href="/canli" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Yarışma aç</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <Link key={r.id} href={`/canli/gecmis/${r.id}`} className="cat flex flex-wrap items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-s4 border border-line3 text-ink hover:text-ink">
              <span className="flex flex-col min-w-0">
                <span className="font-bold truncate">{r.title}</span>
                <span className="text-sm text-mute">{new Date(r.startedAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </span>
              <span className="flex items-center gap-4 text-sm text-soft">
                <span>{r.players} öğrenci</span><span>{r.questions} soru</span>
                <b className={r.accuracy >= 0.7 ? 'text-okt' : r.accuracy >= 0.4 ? 'text-prog' : 'text-bad'}>%{Math.round(r.accuracy * 100)} doğru</b>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function LiveHistoryItem({ id }: { id: number }) {
  const { user, session, toast } = useApp();
  const router = useRouter();
  const [report, setReport] = useState<LiveReport | null | 'missing'>(null);
  useEffect(() => {
    if (session === 'loading' || !user) return;
    jsonFetch<{ report: LiveReport }>(`/api/live/history/${id}`).then((r) => setReport(r.ok ? r.data.report : 'missing'));
  }, [session, user, id]);
  if (session === 'loading') return <Loading />;
  if (!user) return <LoginNeeded what="Geçmiş yarışmalar" />;
  if (report === 'missing') return <Missing />;
  if (!report) return <Loading />;
  async function remove() {
    if (!confirm('Bu yarışmanın sonuçları silinsin mi?')) return;
    const r = await jsonFetch(`/api/live/history/${id}`, { method: 'DELETE' });
    if (!r.ok) { toast(r.error); return; }
    router.push('/canli/gecmis');
  }
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-6">
      <Link href="/canli/gecmis" className="self-start inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><Raw html={I.back()} /> Geçmiş yarışmalarım</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="m-0 text-[32px] font-bold tracking-tight">{report.title}</h1>
        <button type="button" onClick={remove} className="h-10 px-4 rounded-xl text-bad text-sm font-semibold hover:bg-badbg">Sonuçları sil</button>
      </div>
      <ReportView report={report} />
    </div>
  );
}
