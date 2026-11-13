'use client';

/* Okuma metni düzenleyicisi: başlıklar, cümleler (Arapça cümle yazılınca kelimeler ayrılır, her kelimeye anlam yazılır),
   çeviri, anlama soruları; kaydet, yayınla, önizle ve eksik sesleri üret */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { I, Raw } from '../icons';
import { readingAction } from './ReadingsAdmin';
import { Card } from './ui';
import { READING_LEVELS, type Reading, type ReadingQ } from '@/lib/readings';
import { wordSlug } from '@/lib/slug';

type Opt = { id: string; name: string };
type Sent = { text: string; meanings: string[]; tr: string };
const toks = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const toSent = (x: Reading['sentences'][number]): Sent => ({ text: x.w.map((t) => t[0]).join(' '), meanings: x.w.map((t) => t[1]), tr: x.tr });
const input = 'h-11 px-3 rounded-xl bg-s2 border border-line3 text-ink outline-none focus:border-acc';

/** Arapça cümle değişince anlamlar korunur: önce aynı kelimenin anlamı, yoksa aynı sıradaki */
function remap(prev: Sent, text: string): Sent {
  const old = toks(prev.text);
  const used = new Set<number>();
  const now = toks(text);
  const meanings = now.map((w, k) => {
    const same = old.findIndex((o, i) => o === w && !used.has(i));
    if (same >= 0) { used.add(same); return prev.meanings[same] || ''; }
    return now.length === old.length && !used.has(k) ? prev.meanings[k] || '' : '';
  });
  return { ...prev, text, meanings };
}

export default function ReadingEditor({ initial, isNew, topics }: { initial: Reading; isNew: boolean; topics: Opt[] }) {
  const router = useRouter();
  const [head, setHead] = useState({ slug: initial.slug, title: initial.title, ar: initial.ar, level: initial.level, topic: initial.topic || '', desc: initial.desc });
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [sents, setSents] = useState<Sent[]>(() => initial.sentences.map(toSent));
  const [qs, setQs] = useState<ReadingQ[]>(initial.questions);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [audio, setAudio] = useState<{ missing: number; cost: number } | null>(null);
  const [published, setPublished] = useState(!!initial.published);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (!slugTouched) setHead((h) => ({ ...h, slug: wordSlug(h.title).slice(0, 64) })); }, [head.title, slugTouched]);
  useEffect(() => { if (!isNew) void readingAction({ action: 'audio', slug: initial.slug, dry: true }).then((r) => { if (r.ok) setAudio(r.data as { missing: number; cost: number }); }); }, [isNew, initial.slug]);
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const reading = useMemo(() => ({
    slug: head.slug.trim(), title: head.title, ar: head.ar, level: head.level, topic: head.topic || null, desc: head.desc,
    sentences: sents.map((s) => ({ w: toks(s.text).map((w, k) => [w, s.meanings[k] || ''] as [string, string]), tr: s.tr })),
    questions: qs
  }), [head, sents, qs]);
  const words = reading.sentences.reduce((n, s) => n + s.w.length, 0);

  const upSent = (i: number, fn: (s: Sent) => Sent) => { setDirty(true); setSents((all) => all.map((s, k) => (k === i ? fn(s) : s))); };
  const moveSent = (i: number, d: number) => { setDirty(true); setSents((all) => { const a = [...all]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; }); };
  const upQ = (i: number, fn: (q: ReadingQ) => ReadingQ) => { setDirty(true); setQs((all) => all.map((q, k) => (k === i ? fn(q) : q))); };

  async function save() {
    setBusy('save'); setMsg(null);
    const r = await readingAction({ action: 'save', isNew, reading });
    setBusy('');
    if (!r.ok) { setMsg({ ok: false, text: r.error }); return; }
    setDirty(false);
    const d = r.data as { slug: string; missing: number; cost: number };
    setAudio({ missing: d.missing, cost: d.cost });
    setMsg({ ok: true, text: 'Kaydedildi.' });
    if (isNew) router.replace(`/admin/okuma/${d.slug}`); else router.refresh();
  }
  async function togglePublish() {
    setBusy('pub');
    const r = await readingAction({ action: 'publish', slug: initial.slug, on: !published });
    setBusy('');
    if (!r.ok) { setMsg({ ok: false, text: r.error }); return; }
    setPublished(!published);
    setMsg({ ok: true, text: published ? 'Metin yayından kaldırıldı.' : 'Metin yayında: /okuma/' + initial.slug });
  }
  async function makeAudio() {
    if (!audio?.missing || !confirm(`${audio.missing} ifade seslendirilecek, tahmini maliyet ${audio.cost.toFixed(3)} $. Devam edilsin mi?`)) return;
    setBusy('audio');
    const r = await readingAction({ action: 'audio', slug: initial.slug });
    setBusy('');
    if (!r.ok) { setMsg({ ok: false, text: r.error }); return; }
    const d = r.data as { made: number; failed: number };
    setMsg({ ok: !d.failed, text: `${d.made} ses üretildi${d.failed ? `, ${d.failed} tanesi üretilemedi (tekrar dene)` : ''}.` });
    const again = await readingAction({ action: 'audio', slug: initial.slug, dry: true });
    if (again.ok) setAudio(again.data as { missing: number; cost: number });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Link href="/admin/okuma" className="self-start inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><Raw html={I.back()} /> Okuma metinleri</Link>
          <h1 className="m-0 text-[30px] sm:text-[36px] font-bold tracking-tight leading-tight">{isNew ? 'Yeni okuma metni' : head.title || 'Okuma metni'}</h1>
          <p className="m-0 text-mute text-sm">{sents.length} cümle · {words} kelime · {qs.length} soru{initial.ai ? ' · yapay zekâ taslağı: Arapçayı ve harekeleri dikkatle kontrol et' : ''}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isNew && <Link href={`/admin/okuma/${initial.slug}/onizleme`} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold text-sm inline-flex items-center hover:text-ink">Önizle</Link>}
          {!isNew && <button type="button" onClick={togglePublish} disabled={!!busy || dirty} title={dirty ? 'Önce kaydet' : undefined} className={`h-11 px-4 rounded-xl border font-bold text-sm disabled:opacity-50 ${published ? 'bg-okbg border-okln text-okt' : 'bg-s2 border-line3 text-soft'}`}>{published ? 'Yayında (kaldır)' : 'Yayınla'}</button>}
          <button type="button" onClick={save} disabled={!!busy} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold text-sm disabled:opacity-50">{busy === 'save' ? 'Kaydediliyor' : 'Kaydet'}</button>
        </div>
      </div>
      {msg && <p role="status" className={`m-0 px-4 py-3 rounded-xl border text-sm ${msg.ok ? 'bg-okbg border-okln text-okt' : 'bg-badbg border-badln text-bad'}`}>{msg.text}</p>}
      {!isNew && audio && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border border-line2 bg-s1 text-sm">
          <Raw html={I.speaker(17)} />
          <span className="flex-1 min-w-[200px] text-soft">{audio.missing ? `${audio.missing} ifadenin (cümle, kelime, başlık) ses kaydı yok; tarayıcı sesi okur. Tahmini maliyet ${audio.cost.toFixed(3)} $.` : 'Bütün cümlelerin ve kelimelerin ses kaydı var.'}</span>
          {audio.missing > 0 && <button type="button" onClick={makeAudio} disabled={!!busy || dirty} className="h-10 px-4 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50">{busy === 'audio' ? 'Seslendiriliyor' : 'Sesleri üret'}</button>}
        </div>
      )}

      <Card title="Genel">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Türkçe başlık</span><input value={head.title} onChange={(e) => { setDirty(true); setHead({ ...head, title: e.target.value }); }} maxLength={120} className={input} /></label>
          <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Arapça başlık (harekeli)</span><input value={head.ar} onChange={(e) => { setDirty(true); setHead({ ...head, ar: e.target.value }); }} maxLength={191} dir="rtl" lang="ar" className={input + ' ar text-[20px]'} /></label>
          <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Adres {!isNew && '(değiştirilemez)'}</span>
            <span className="flex items-center gap-1 text-sm text-faint">/okuma/<input value={head.slug} readOnly={!isNew} onChange={(e) => { setSlugTouched(true); setHead({ ...head, slug: e.target.value.toLowerCase() }); }} maxLength={64} className={input + ' flex-1 min-w-0'} /></span></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Seviye</span>
              <select value={head.level} onChange={(e) => { setDirty(true); setHead({ ...head, level: e.target.value as Reading['level'] }); }} className={input}>{READING_LEVELS.map((l) => <option key={l} className="bg-s2">{l}</option>)}</select></label>
            <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">İlgili ders</span>
              <select value={head.topic} onChange={(e) => { setDirty(true); setHead({ ...head, topic: e.target.value }); }} className={input}><option value="" className="bg-s2">Yok</option>{topics.map((t) => <option key={t.id} value={t.id} className="bg-s2">{t.name}</option>)}</select></label>
          </div>
          <label className="sm:col-span-2 flex flex-col gap-1.5"><span className="text-sm text-mute">Kısa açıklama (listede görünür)</span><input value={head.desc} onChange={(e) => { setDirty(true); setHead({ ...head, desc: e.target.value }); }} maxLength={400} className={input} /></label>
        </div>
      </Card>

      <Card title={`Cümleler (${sents.length})`}>
        <p className="m-0 mb-3 text-sm text-mute">Arapça cümleyi harekeli yaz; kelimeler boşluklara göre ayrılır. Bitişik edat ve noktalama kelimeyle birlikte kalır (وَأُمِّي، الْبَيْتِ.). Her kelimenin o cümledeki anlamını yaz.</p>
        <ol className="m-0 p-0 list-none flex flex-col gap-4">
          {sents.map((s, i) => {
            const w = toks(s.text);
            return (
              <li key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-s2 border border-line2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-lab">{i + 1}. cümle</span><span className="flex-1" />
                  <button type="button" onClick={() => moveSent(i, -1)} disabled={i === 0} aria-label="Yukarı" className="w-8 h-8 rounded-lg text-faint hover:text-ink disabled:opacity-30"><Raw html={I.up(14)} /></button>
                  <button type="button" onClick={() => moveSent(i, 1)} disabled={i === sents.length - 1} aria-label="Aşağı" className="w-8 h-8 rounded-lg text-faint hover:text-ink disabled:opacity-30"><Raw html={I.down(14)} /></button>
                  <button type="button" onClick={() => { setDirty(true); setSents((a) => a.filter((_, k) => k !== i)); }} disabled={sents.length === 1} aria-label={`${i + 1}. cümleyi sil`} className="w-8 h-8 rounded-lg text-faint hover:text-bad disabled:opacity-30"><Raw html={I.trash(15)} /></button>
                </div>
                <textarea value={s.text} onChange={(e) => upSent(i, (x) => remap(x, e.target.value))} rows={2} dir="rtl" lang="ar" aria-label={`${i + 1}. cümle Arapça`} placeholder="أَنَا طَالِبٌ فِي الْمَدْرَسَةِ."
                  className="px-3 py-2 rounded-xl bg-s1 border border-line3 text-ink outline-none focus:border-acc ar text-[24px] leading-relaxed" />
                {w.length > 0 && (
                  <div dir="rtl" className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
                    {w.map((t, k) => (
                      <label key={k} className="flex flex-col gap-1 p-2 rounded-lg bg-s1 border border-line">
                        <span className="ar text-[19px] text-ink" lang="ar">{t}</span>
                        <input dir="ltr" value={s.meanings[k] || ''} onChange={(e) => upSent(i, (x) => { const m = [...x.meanings]; m[k] = e.target.value; return { ...x, meanings: m }; })} maxLength={80} placeholder="anlamı"
                          className={`h-9 px-2 rounded-md bg-s2 border text-sm text-ink outline-none focus:border-acc ${s.meanings[k]?.trim() ? 'border-line3' : 'border-badln'}`} />
                      </label>
                    ))}
                  </div>
                )}
                <input value={s.tr} onChange={(e) => upSent(i, (x) => ({ ...x, tr: e.target.value }))} maxLength={300} placeholder="Türkçe çevirisi" aria-label={`${i + 1}. cümle çevirisi`} className={input} />
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={() => { setDirty(true); setSents((a) => [...a, { text: '', meanings: [], tr: '' }]); }} disabled={sents.length >= 40} className="mt-3 h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold text-sm inline-flex items-center gap-2 hover:text-ink"><Raw html={I.plus(15)} /> Cümle ekle</button>
      </Card>

      <Card title={`Anlama soruları (${qs.length})`}>
        <ol className="m-0 p-0 list-none flex flex-col gap-4">
          {qs.map((q, i) => (
            <li key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-s2 border border-line2">
              <div className="flex items-center gap-2">
                <input value={q.q} onChange={(e) => upQ(i, (x) => ({ ...x, q: e.target.value }))} maxLength={200} placeholder={`${i + 1}. soru`} aria-label={`${i + 1}. soru`} className={input + ' flex-1'} />
                <button type="button" onClick={() => { setDirty(true); setQs((a) => a.filter((_, k) => k !== i)); }} aria-label={`${i + 1}. soruyu sil`} className="w-9 h-9 rounded-lg text-faint hover:text-bad"><Raw html={I.trash(15)} /></button>
              </div>
              <div role="radiogroup" aria-label="Doğru cevap" className="grid gap-2 sm:grid-cols-2">
                {q.options.map((o, k) => (
                  <label key={k} className="flex items-center gap-2">
                    <input type="radio" name={`q${i}`} checked={q.a === o && !!o} onChange={() => upQ(i, (x) => ({ ...x, a: o }))} className="w-4 h-4 accent-acc" aria-label={`${k + 1}. seçenek doğru`} />
                    <input value={o} onChange={(e) => upQ(i, (x) => { const opts = [...x.options]; opts[k] = e.target.value; return { ...x, options: opts, a: x.a === o ? e.target.value : x.a }; })} maxLength={120} placeholder={`${k + 1}. seçenek`} className={input + ' flex-1 min-w-0'} />
                  </label>
                ))}
              </div>
              <span className="text-xs text-faint">Doğru cevabın yanındaki daireyi işaretle. Seçenekler sitede karışık sırayla gösterilir.</span>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => { setDirty(true); setQs((a) => [...a, { q: '', options: ['', '', '', ''], a: '' }]); }} disabled={qs.length >= 10} className="mt-3 h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold text-sm inline-flex items-center gap-2 hover:text-ink"><Raw html={I.plus(15)} /> Soru ekle</button>
      </Card>

      <div className="flex justify-end"><button type="button" onClick={save} disabled={!!busy} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50">{busy === 'save' ? 'Kaydediliyor' : 'Kaydet'}</button></div>
    </div>
  );
}
