'use client';

/* Yönetim paneli: okuma metinleri listesi (sıra, yayın durumu, silme) ve yapay zekâ ile taslak oluşturma */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { I, Raw } from '../icons';
import { READING_LEVELS, type Reading } from '@/lib/readings';
import { Card } from './ui';

type Row = { slug: string; title: string; ar: string; level: string; lesson: string; sentences: number; questions: number; published: boolean; ai: boolean };
type Opt = { id: string; name: string };

export async function readingAction(body: Record<string, unknown>) {
  const r = await fetch('/api/admin/readings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);
  const j = (await r?.json().catch(() => ({}))) as Record<string, unknown> & { error?: string };
  return r?.ok ? { ok: true as const, data: j } : { ok: false as const, error: j?.error || 'Bağlantı kurulamadı.' };
}

export default function ReadingsAdmin({ readings, topics }: { readings: Row[]; topics: Opt[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [draft, setDraft] = useState({ theme: '', level: 'Başlangıç' as Reading['level'], topic: '', count: 7 });

  async function run(key: string, body: Record<string, unknown>, after?: (d: Record<string, unknown>) => void) {
    setBusy(key); setMsg('');
    const r = await readingAction(body);
    setBusy('');
    if (!r.ok) { setMsg(r.error); return; }
    after?.(r.data);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight">Okuma metinleri</h1>
          <p className="m-0 text-mute">{readings.length} metin · {readings.filter((r) => r.published).length} yayında. Sıra, sitedeki sıradır.</p>
        </div>
        <Link href="/admin/okuma/yeni" className="h-11 px-4 rounded-xl bg-acc text-onacc font-bold text-sm inline-flex items-center gap-2 hover:text-onacc"><Raw html={I.plus(16)} /> Yeni metin</Link>
      </div>
      {msg && <p role="alert" className="m-0 px-4 py-3 rounded-xl bg-badbg border border-badln text-bad text-sm">{msg}</p>}

      <Card title="Yapay zekâ ile taslak oluştur">
        <form onSubmit={(e) => { e.preventDefault(); void run('draft', { action: 'draft', theme: draft.theme, level: draft.level, topic: draft.topic || null, count: draft.count }, (d) => router.push(`/admin/okuma/${d.slug}`)); }} className="flex flex-col gap-3">
          <p className="m-0 text-sm text-mute">Konuyu yaz; yapay zekâ harekeli metni, kelime anlamlarını, çeviriyi ve soruları hazırlar. Taslak yayında olmaz; okuyup düzelttikten sonra yayınla. Bir taslak yaklaşık 0,001 $ tutar.</p>
          <div className="flex flex-wrap gap-3 items-end">
            <label className="flex-[2_1_260px] flex flex-col gap-1.5"><span className="text-sm text-mute">Konu</span>
              <input value={draft.theme} onChange={(e) => setDraft({ ...draft, theme: e.target.value })} maxLength={200} placeholder="Örneğin: hastanede doktora gitmek" className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink outline-none focus:border-acc" /></label>
            <label className="flex-[1_1_140px] flex flex-col gap-1.5"><span className="text-sm text-mute">Seviye</span>
              <select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value as Reading['level'] })} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink">
                {READING_LEVELS.map((l) => <option key={l} value={l} className="bg-s2">{l}</option>)}</select></label>
            <label className="flex-[1_1_200px] flex flex-col gap-1.5"><span className="text-sm text-mute">Kelimeleri bu dersten (isteğe bağlı)</span>
              <select value={draft.topic} onChange={(e) => setDraft({ ...draft, topic: e.target.value })} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink">
                <option value="" className="bg-s2">Ders seçme</option>{topics.map((t) => <option key={t.id} value={t.id} className="bg-s2">{t.name}</option>)}</select></label>
            <label className="w-[110px] flex flex-col gap-1.5"><span className="text-sm text-mute">Cümle</span>
              <input type="number" min={4} max={14} value={draft.count} onChange={(e) => setDraft({ ...draft, count: Math.max(4, Math.min(14, Number(e.target.value) || 7)) })} className="h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink" /></label>
            <button type="submit" disabled={draft.theme.trim().length < 3 || !!busy} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50 inline-flex items-center gap-2"><Raw html={I.bulb(16)} /> {busy === 'draft' ? 'Yazılıyor (yarım dakika sürebilir)' : 'Taslak oluştur'}</button>
          </div>
        </form>
      </Card>

      <Card title="Metinler">
        <ol className="m-0 p-0 list-none flex flex-col gap-2">
          {readings.map((r, i) => (
            <li key={r.slug} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-s2 border border-line2">
              <span className="flex flex-col">
                <button type="button" disabled={i === 0 || !!busy} onClick={() => run('m' + r.slug, { action: 'move', slug: r.slug, dir: -1 })} aria-label={`${r.title}: yukarı taşı`} className="w-7 h-6 rounded text-faint hover:text-ink disabled:opacity-30"><Raw html={I.up(14)} /></button>
                <button type="button" disabled={i === readings.length - 1 || !!busy} onClick={() => run('m' + r.slug, { action: 'move', slug: r.slug, dir: 1 })} aria-label={`${r.title}: aşağı taşı`} className="w-7 h-6 rounded text-faint hover:text-ink disabled:opacity-30"><Raw html={I.down(14)} /></button>
              </span>
              <Link href={`/admin/okuma/${r.slug}`} className="flex-1 min-w-[200px] flex flex-col text-ink hover:text-ink">
                <span className="font-bold">{r.title} <span className="ar text-acct font-normal" lang="ar" dir="rtl">{r.ar}</span></span>
                <span className="text-xs text-mute2">{r.level}{r.lesson ? ` · ${r.lesson}` : ''} · {r.sentences} cümle · {r.questions} soru · /okuma/{r.slug}</span>
              </Link>
              {r.ai && <span className="px-2 py-0.5 rounded-full bg-progbg border border-progln text-prog text-[11px] font-bold">Yapay zekâ taslağı</span>}
              <button type="button" disabled={!!busy} onClick={() => run('p' + r.slug, { action: 'publish', slug: r.slug, on: !r.published })}
                className={`h-9 px-3 rounded-lg border text-xs font-bold ${r.published ? 'bg-okbg border-okln text-okt' : 'bg-s0 border-edge text-dim'}`}>{r.published ? 'Yayında' : 'Taslak'}</button>
              <button type="button" disabled={!!busy} onClick={() => { if (confirm(`"${r.title}" silinsin mi? Okuyanların sonuçları ve bu metni veren sınıf ödevleri bağlantısız kalır.`)) void run('d' + r.slug, { action: 'delete', slug: r.slug }); }}
                aria-label={`${r.title}: sil`} className="w-9 h-9 rounded-lg text-faint hover:text-bad inline-flex items-center justify-center"><Raw html={I.trash(16)} /></button>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
