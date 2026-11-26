'use client';

/* Yönetim paneli: Yenilikler yazıları. Yeni yazı eklenince bütün sayfalar yenilenir ve
   ziyaretçilerin başlığındaki Yenilikler simgesinde nokta çıkar. */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { Card, dt } from './ui';
import { NEWS_LIMITS, newsHtml, type NewsItem } from '@/lib/news-shared';

type Draft = { title: string; body: string; link: string; published: boolean };
const EMPTY: Draft = { title: '', body: '', link: '', published: true };

async function call(method: 'POST' | 'PATCH' | 'DELETE', body: unknown): Promise<string | null> {
  const r = await fetch('/api/admin/news', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);
  if (r?.ok) return null;
  const j = await r?.json().catch(() => null) as { error?: string } | null;
  return j?.error || 'İşlem yapılamadı.';
}

function Form({ initial, submit, onCancel, label }: { initial: Draft; submit: (d: Draft) => Promise<string | null>; onCancel?: () => void; label: string }) {
  const [d, setD] = useState(initial);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const e2 = await submit(d);
    setBusy(false);
    if (e2) setErr(e2); else if (!onCancel) setD(EMPTY);
  }
  const field = 'w-full px-4 rounded-xl bg-s2 border border-line3 text-ink outline-none focus:border-acc';
  return (
    <form onSubmit={go} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-soft">Başlık</span>
        <input value={d.title} onChange={(e) => set('title', e.target.value)} maxLength={NEWS_LIMITS.title} required placeholder="Ör. Okuma metinlerine 5 yeni hikâye" className={field + ' h-12'} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-soft">Yazı <span className="font-normal text-faint">(Arapça kelimeyi {'{{...}}'} içine yazarsan Arapça yazı tipiyle görünür)</span></span>
        <textarea value={d.body} onChange={(e) => set('body', e.target.value)} maxLength={NEWS_LIMITS.body} rows={4} placeholder="Ne eklendi, nasıl kullanılır? İki üç cümle yeterli." className={field + ' py-3 leading-relaxed'} />
        <span className="text-xs text-faint self-end tabular-nums">{d.body.length} / {NEWS_LIMITS.body}</span>
      </label>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-soft">Bağlantı <span className="font-normal text-faint">(isteğe bağlı, site içi: /okuma, /konu/renkler)</span></span>
          <input value={d.link} onChange={(e) => set('link', e.target.value)} maxLength={NEWS_LIMITS.link} placeholder="/" className={field + ' h-12'} />
        </label>
        <label className="h-12 flex items-center gap-2 text-sm font-semibold text-soft cursor-pointer">
          <input type="checkbox" checked={d.published} onChange={(e) => set('published', e.target.checked)} className="w-5 h-5 accent-acc" /> Yayında
        </label>
      </div>
      {err && <p className="m-0 text-sm text-bad" role="alert">{err}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-60">{busy ? 'Kaydediliyor' : label}</button>
        {onCancel && <button type="button" onClick={onCancel} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Vazgeç</button>}
      </div>
    </form>
  );
}

export default function NewsAdmin({ list }: { list: NewsItem[] }) {
  const router = useRouter();
  const { tx, toast } = useApp();
  const [editing, setEditing] = useState<number | null>(null);

  const save = (body: Record<string, unknown>, method: 'POST' | 'PATCH') => async (d: Draft) => {
    const err = await call(method, { ...body, ...d });
    if (!err) { setEditing(null); toast(method === 'POST' ? 'Yazı eklendi.' : 'Yazı kaydedildi.'); router.refresh(); }
    return err;
  };
  async function toggle(n: NewsItem) {
    const err = await call('PATCH', { id: n.id, published: !n.published });
    if (err) toast(err); else router.refresh();
  }
  async function remove(n: NewsItem) {
    if (!confirm(`"${n.title}" yazısı kalıcı olarak silinsin mi?`)) return;
    const err = await call('DELETE', { id: n.id });
    if (err) toast(err); else router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-3xl font-bold tracking-tight">Yenilikler</h1>
          <p className="m-0 text-mute max-w-[720px]">Siteye eklenenleri ziyaretçilere duyur. Yayındaki her yeni yazı, ziyaretçinin başlığındaki Yenilikler simgesinde nokta olarak görünür; yazıyı okuyunca nokta kalkar.</p>
        </div>
        <Link href="/yenilikler" className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh">Sayfayı aç <Raw html={I.arrow()} /></Link>
      </div>
      <Card title="Yeni yazı">
        <Form initial={EMPTY} submit={save({}, 'POST')} label="Yazıyı ekle" />
      </Card>
      {list.length === 0 && <Card><p className="m-0 text-mute">Henüz yazı yok.</p></Card>}
      {list.map((n) => (
        <Card key={n.id} className={n.published ? '' : 'opacity-75'}
          title={<span className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${n.published ? 'bg-okbg border-okln text-okt' : 'bg-s2 border-line3 text-faint'}`}>{n.published ? 'Yayında' : 'Taslak'}</span>
            <span>{n.title}</span>
          </span>}
          right={<span className="text-xs text-faint">{dt(new Date(n.at), true)}</span>}>
          {editing === n.id ? (
            <Form initial={{ title: n.title, body: n.body, link: n.link || '', published: n.published }} submit={save({ id: n.id }, 'PATCH')} onCancel={() => setEditing(null)} label="Kaydet" />
          ) : (
            <>
              {n.body && <Raw as="p" className="m-0 text-soft leading-relaxed whitespace-pre-line" html={newsHtml(n.body, tx)} />}
              {n.link && <span className="text-sm text-mute">Bağlantı: <Link href={n.link}>{n.link}</Link></span>}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setEditing(n.id)} className="h-9 px-4 rounded-lg border border-line3 bg-s2 text-soft text-sm font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh"><Raw html={I.edit(15)} /> Düzenle</button>
                <button type="button" onClick={() => toggle(n)} className="h-9 px-4 rounded-lg border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink hover:border-lineh">{n.published ? 'Yayından kaldır' : 'Yayınla'}</button>
                <button type="button" onClick={() => remove(n)} className="h-9 px-4 rounded-lg border border-badln bg-badbg text-bad text-sm font-semibold inline-flex items-center gap-2"><Raw html={I.trash(15)} /> Sil</button>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
