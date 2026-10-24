'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Activity, ActType, Example, Mistake, Pair, Question, QType, Section, Topic, Word } from '@/lib/types';
import { ACT_TYPES } from '@/lib/types';
import { actsOf, TYPE, type ActView } from '@/lib/text';
import { I, Raw } from '../icons';
import Player from '../Player';
import AudioControl, { type AudioMap } from './AudioControl';
import { questionKey } from '@/lib/qkey';

type QStats = Record<string, Record<string, { attempts: number; correct: number }>>;
// Düzenleyicinin her yerinden erişilen ses eşlemesi ve soru istatistikleri
type NarrIds = { sections: (number | null)[]; summary: number | null };
type NarrCtx = { ids: NarrIds; saved: Topic; topicId: string; isNew: boolean; setIds: (n: NarrIds) => void };
const EdCtx = createContext<{ audio: AudioMap; setAudio: (k: string, id: number | null) => void; qstats: QStats; narr?: NarrCtx }>({ audio: {}, setAudio: () => {}, qstats: {} });

/** Anlatım sesinin durumu ve "Sesi üret" düğmesi */
function NarrStatus({ part, text }: { part: number | 'summary'; text: string | null | undefined }) {
  const { narr } = useContext(EdCtx);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  if (!narr) return null;
  const savedText = part === 'summary' ? narr.saved.summaryNarr : narr.saved.lesson[part]?.narr;
  const id = part === 'summary' ? narr.ids.summary : narr.ids.sections[part] ?? null;
  const changed = (text || '').trim() !== (savedText || '').trim();
  const empty = !(text || '').trim();
  async function gen() {
    setBusy(true); setErr('');
    const r = await fetch('/api/admin/narration', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topicId: narr!.topicId, part }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(j.error || 'Ses üretilemedi.'); return; }
    narr!.setIds(j.ids);
  }
  const badge = 'px-2.5 py-1 rounded-full border text-xs font-bold';
  return (
    <span className="flex flex-wrap items-center gap-2">
      {empty ? <span className={badge + ' bg-[#1C1714] text-[#9C8B7E] border-[#2E2620]'}>Anlatım yok</span>
        : changed || narr.isNew ? <span className={badge + ' bg-progbg text-prog border-progln'}>Metin değişti: kaydedip sesi üret</span>
        : id ? <><span className={badge + ' bg-okbg text-okt border-okln'}>Ses hazır</span><button type="button" className="text-xs font-semibold text-acct" onClick={() => new Audio('/api/narration/' + id).play().catch(() => null)}>Dinle</button></>
        : <span className={badge + ' bg-badbg text-bad border-badln'}>Ses yok</span>}
      {!empty && !changed && !narr.isNew && (
        <button type="button" disabled={busy} onClick={gen} className="h-8 px-3 rounded-lg border border-line3 bg-s2 text-soft text-xs font-semibold hover:text-ink disabled:opacity-50">
          {busy ? 'Ses üretiliyor (yaklaşık 20 sn)' : id ? 'Sesi yeniden üret' : 'Sesi üret'}
        </button>
      )}
      {err && <span className="text-xs text-bad">{err}</span>}
    </span>
  );
}
function Snd({ text }: { text: string }) {
  const { audio, setAudio } = useContext(EdCtx);
  if (!/[؀-ۿ]/.test(text || '')) return null;
  return <AudioControl text={text} map={audio} onChange={setAudio} compact />;
}
function QStat({ actId, q, t }: { actId: string; q: Question; t: QType }) {
  const { qstats } = useContext(EdCtx);
  const st = actId ? qstats[actId]?.[questionKey(q, t)] : undefined;
  if (!st || !st.attempts) return <span className="text-xs text-faint">Henüz cevaplanmadı</span>;
  const r = st.correct / st.attempts;
  const cls = r >= 0.7 ? 'bg-okbg text-okt border-okln' : r >= 0.5 ? 'bg-progbg text-prog border-progln' : 'bg-badbg text-bad border-badln';
  return <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${cls}`} title="İlk denemede doğru cevaplanma oranı">%{Math.round(r * 100)} doğru · {st.attempts} deneme</span>;
}

/* ================= Yardımcılar ================= */
const clone = <T,>(x: T): T => structuredClone(x);
const move = <T,>(arr: T[], i: number, d: -1 | 1) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const r = arr.slice();
  [r[i], r[j]] = [r[j], r[i]];
  return r;
};
const paras = (s: string) => s.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const cells = (s: string) => s.split('|').map((x) => x.trim());
const LEVELS = ['Başlangıç', 'Orta', 'İleri'];
const Q_TYPES: [QType, string][] = [['mc', 'Çoktan seçmeli'], ['fill', 'Boşluk doldurma'], ['tf', 'Doğru / Yanlış'], ['order', 'Cümle kurma']];

const inCls = 'w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-s2 border border-line2 text-ink text-[15px] outline-none focus:border-lineh placeholder:text-faint';
const arCls = ' font-ar text-[22px] leading-[1.6]';

function F({ label, children, hint, className = '' }: { label: string; children: React.ReactNode; hint?: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 min-w-0 ${className}`}>
      <span className="text-xs font-bold tracking-[.06em] uppercase text-lab">{label}</span>
      {children}
      {hint && <span className="text-xs text-faint leading-relaxed">{hint}</span>}
    </label>
  );
}
function TI({ value, onChange, ar, placeholder, mono, type = 'text' }: { value: string | number | undefined | null; onChange: (v: string) => void; ar?: boolean; placeholder?: string; mono?: boolean; type?: string }) {
  return <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir={ar ? 'rtl' : undefined} className={inCls + (ar ? arCls : '') + (mono ? ' font-mono text-sm' : '')} />;
}
function TA({ value, onChange, rows = 3, ar, placeholder }: { value: string | undefined | null; onChange: (v: string) => void; rows?: number; ar?: boolean; placeholder?: string }) {
  return <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} dir={ar ? 'rtl' : undefined} className={inCls + ' leading-relaxed resize-y' + (ar ? arCls : '')} />;
}
/** Liste alanları: yazarken ham metin korunur, değer her değişiklikte ayrıştırılır */
// Ham metnin kanonik hali: dış değer yalnızca anlamı gerçekten değiştiyse metne yeniden yazılır
const canon = {
  lines: (s: string) => lines(s).join('\n'),
  paras: (s: string) => paras(s).join('\n\n'),
  rows: (s: string) => lines(s).map((r) => cells(r).join(' | ')).join('\n'),
  cells: (s: string) => cells(s).join(' | '),
  words: (s: string) => cells(s).filter(Boolean).join(' | ')
};
type Canon = keyof typeof canon;
function useRaw(joined: string, kind: Canon) {
  const [txt, setTxt] = useState(joined);
  useEffect(() => { setTxt((t) => (canon[kind](t) === joined ? t : joined)); }, [joined, kind]);
  return [txt, setTxt] as const;
}
function PTA({ joined, onText, kind, rows = 3, ar, placeholder }: { joined: string; onText: (v: string) => void; kind: Canon; rows?: number; ar?: boolean; placeholder?: string }) {
  const [txt, setTxt] = useRaw(joined, kind);
  return (
    <textarea value={txt} rows={rows} placeholder={placeholder} dir={ar ? 'rtl' : undefined}
      onChange={(e) => { setTxt(e.target.value); onText(e.target.value); }}
      className={inCls + ' leading-relaxed resize-y' + (ar ? arCls : '')} />
  );
}
function PTI({ joined, onText, kind, ar, placeholder }: { joined: string; onText: (v: string) => void; kind: Canon; ar?: boolean; placeholder?: string }) {
  const [txt, setTxt] = useRaw(joined, kind);
  return (
    <input value={txt} placeholder={placeholder} dir={ar ? 'rtl' : undefined}
      onChange={(e) => { setTxt(e.target.value); onText(e.target.value); }}
      className={inCls + (ar ? arCls : '')} />
  );
}
function IconBtn({ icon, label, onClick, danger, disabled }: { icon: keyof typeof I; label: string; onClick: () => void; danger?: boolean; disabled?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
      className={`w-9 h-9 shrink-0 rounded-lg border inline-flex items-center justify-center disabled:opacity-30 ${danger ? 'border-badln text-bad hover:bg-badbg' : 'border-line3 bg-s2 text-soft hover:text-ink hover:border-lineh'}`}
      dangerouslySetInnerHTML={{ __html: I[icon](16) }} />
  );
}
function AddBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="self-start h-10 px-4 rounded-xl border border-dashed border-line3 text-acct text-sm font-semibold inline-flex items-center gap-2 hover:border-lineh"><Raw html={I.plus(16)} /> {children}</button>;
}
/** Sırala / sil düğmeleri */
function RowTools({ i, n, onMove, onRemove, label }: { i: number; n: number; onMove: (d: -1 | 1) => void; onRemove: () => void; label: string }) {
  return (
    <span className="flex gap-1.5">
      <IconBtn icon="up" label={`${label} yukarı taşı`} onClick={() => onMove(-1)} disabled={i === 0} />
      <IconBtn icon="down" label={`${label} aşağı taşı`} onClick={() => onMove(1)} disabled={i === n - 1} />
      <IconBtn icon="trash" label={`${label} sil`} danger onClick={() => { if (confirm(`${label} silinsin mi?`)) onRemove(); }} />
    </span>
  );
}

/* ================= Doğrulama ================= */
function validate(d: Topic): string[] {
  const e: string[] = [];
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(d.id)) e.push('Kısa ad yalnızca küçük harf, rakam ve tire içerebilir.');
  if (!d.name.trim()) e.push('Dersin adı boş olamaz.');
  d.lesson.forEach((s, i) => { if (!s.h.trim()) e.push(`Anlatım bölümü ${i + 1}: başlık boş.`); });
  d.acts.forEach((a, ai) => {
    const at = `Etkinlik ${ai + 1} (${a.title || TYPE[a.type].label})`;
    if (!a.title.trim()) e.push(`${at}: başlık boş.`);
    if ((a.type === 'flash' || a.type === 'listen' || a.type === 'speak') && !(a.items && a.items.length) && d.words.length < (a.type === 'listen' ? 4 : 1))
      e.push(`${at}: bu etkinlik kelimeler bölümünü kullanır; ${a.type === 'listen' ? 'en az 4' : 'en az 1'} kelime ekle.`);
    if (a.type === 'match') {
      const items = (a.items || []) as Pair[];
      if (items.length < 2) e.push(`${at}: en az 2 çift gerekli.`);
      items.forEach((p, i) => { if (!p[0]?.trim() || !p[1]?.trim()) e.push(`${at}, çift ${i + 1}: iki taraf da dolu olmalı.`); });
    }
    if (['mc', 'fill', 'tf', 'order', 'test'].includes(a.type)) {
      const items = (a.items || []) as Question[];
      if (!items.length) e.push(`${at}: en az 1 soru ekle.`);
      items.forEach((q, i) => {
        const t = q.t || (a.type === 'test' ? 'mc' : a.type);
        const qt = `${at}, soru ${i + 1}`;
        if (t === 'mc' || t === 'fill') {
          if ((q.options || []).length < 2) e.push(`${qt}: en az 2 seçenek gerekli.`);
          if (!(q.options || []).includes(String(q.a ?? ''))) e.push(`${qt}: doğru cevap seçeneklerden biri olmalı.`);
          if (t === 'mc' && !q.q && !q.ar && !q.clock) e.push(`${qt}: soru metni, Arapça ifade ya da saat girilmeli.`);
          if (t === 'fill' && !(q.s || '').includes('___')) e.push(`${qt}: cümlede boşluk için ___ (üç alt çizgi) olmalı.`);
          if (q.clock && !/^\d{1,2}:\d{2}$/.test(q.clock)) e.push(`${qt}: saat "3:30" biçiminde olmalı.`);
        }
        if (t === 'tf') { if (!q.s && !q.q) e.push(`${qt}: önerme boş.`); if (typeof q.a !== 'boolean') e.push(`${qt}: doğru/yanlış seçilmeli.`); }
        if (t === 'order') { if ((q.w || []).length < 2) e.push(`${qt}: en az 2 kelime gerekli.`); if (!q.tr) e.push(`${qt}: Türkçe anlam boş.`); }
      });
    }
  });
  return e;
}

/* ================= Ana bileşen ================= */
type Tab = 'meta' | 'lesson' | 'words' | 'acts' | 'json';

export default function TopicEditor({ initial, isNew, audio: audio0, qstats, narr: narr0 }: { initial: Topic; isNew: boolean; audio: AudioMap; qstats: QStats; narr: NarrIds }) {
  const [audio, setAudioMap] = useState<AudioMap>(audio0);
  const [narrIds, setNarrIds] = useState<NarrIds>(narr0);
  useEffect(() => setNarrIds(narr0), [narr0]);
  const setAudio = (k: string, id: number | null) => setAudioMap((m) => { const n = { ...m }; if (id) n[k] = id; else delete n[k]; return n; });
  const router = useRouter();
  const [d, setD] = useState<Topic>(() => clone(initial));
  const [saved, setSaved] = useState<string>(() => JSON.stringify(initial));
  const [tab, setTab] = useState<Tab>('meta');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; list?: string[] } | null>(null);
  const [preview, setPreview] = useState<{ act: ActView; nonce: number } | null>(null);
  const dirty = JSON.stringify(d) !== saved;
  const up = (fn: (x: Topic) => void) => setD((prev) => { const n = clone(prev); fn(n); return n; });

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  async function save() {
    const errs = validate(d);
    if (errs.length) { setMsg({ ok: false, text: 'Kaydetmeden önce şunları düzelt:', list: errs }); return; }
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch(isNew ? '/api/admin/topics' : `/api/admin/topics/${initial.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d)
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setMsg({ ok: false, text: j.error || 'Kaydedilemedi.' }); return; }
      const t = j.topic as Topic;
      setD(clone(t));
      setSaved(JSON.stringify(t));
      setMsg({ ok: true, text: 'Kaydedildi.' });
      if (isNew) router.replace(`/admin/dersler/${t.id}`);
      router.refresh();
    } catch {
      setMsg({ ok: false, text: 'Sunucuya ulaşılamadı.' });
    } finally { setBusy(false); }
  }

  const tabs: [Tab, string][] = [['meta', 'Temel bilgiler'], ['lesson', `Konu anlatımı (${d.lesson.length})`], ['words', `Kelimeler (${d.words.length})`], ['acts', `Etkinlikler (${d.acts.length})`], ['json', 'JSON']];
  const previewList = useMemo(() => actsOf(d), [d]);

  return (
    <EdCtx.Provider value={{ audio, setAudio, qstats, narr: { ids: narrIds, saved: JSON.parse(saved) as Topic, topicId: initial.id, isNew, setIds: setNarrIds } }}>
    <div className="flex flex-col gap-6">
      <Link href="/admin/dersler" className="self-start text-sm text-mute hover:text-ink">← Dersler</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h1 className="m-0 text-[28px] sm:text-[36px] font-bold tracking-tight leading-tight">{isNew ? 'Yeni ders' : d.name || 'Ders'}</h1>
          <p className="m-0 text-sm text-faint">{isNew ? 'Kaydedince ders listesine eklenir.' : <>Kısa ad: <span className="font-mono">{d.id}</span> · {d.published ? 'Yayında' : 'Taslak'}{dirty ? ' · kaydedilmemiş değişiklikler var' : ''}</>}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isNew && <Link href={`/konu?id=${initial.id}`} target="_blank" className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold text-sm inline-flex items-center hover:text-ink hover:border-lineh">Sitede gör</Link>}
          <button type="button" onClick={save} disabled={busy || (!dirty && !isNew)} className="h-11 px-6 rounded-xl bg-acc text-onacc font-bold text-[15px] disabled:opacity-50">{busy ? 'Kaydediliyor' : 'Kaydet'}</button>
        </div>
      </div>
      {msg && (
        <div role="status" className={`px-4 py-3 rounded-xl text-sm border ${msg.ok ? 'bg-okbg border-okln text-okt' : 'bg-badbg border-badln text-bad'}`}>
          {msg.text}
          {msg.list && <ul className="m-0 mt-2 pl-5 list-disc">{msg.list.map((x, i) => <li key={i}>{x}</li>)}</ul>}
        </div>
      )}
      <div role="tablist" aria-label="Düzenleyici bölümleri" className="flex flex-wrap gap-1 p-1 rounded-2xl bg-s1 border border-line self-start">
        {tabs.map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`h-10 px-4 rounded-xl font-bold text-sm ${tab === k ? 'bg-chip text-ink border border-line3' : 'text-mute hover:text-ink border border-transparent'}`}>{l}</button>
        ))}
      </div>

      {tab === 'meta' && <MetaTab d={d} up={up} isNew={isNew} />}
      {tab === 'lesson' && <LessonTab d={d} up={up} />}
      {tab === 'words' && <WordsTab d={d} up={up} />}
      {tab === 'acts' && <ActsTab d={d} up={up} onPreview={(i) => setPreview({ act: previewList[i], nonce: Date.now() })} />}
      {tab === 'json' && <JsonTab d={d} onApply={(t) => { setD({ ...t, id: isNew ? t.id : d.id }); setMsg({ ok: true, text: 'JSON uygulandı. Kaydetmeyi unutma.' }); }} />}

      <div className="sticky bottom-4 z-20 flex justify-end">
        {dirty && <button type="button" onClick={save} disabled={busy} className="h-12 px-6 rounded-xl bg-acc text-onacc font-bold shadow-2xl">{busy ? 'Kaydediliyor' : 'Değişiklikleri kaydet'}</button>}
      </div>

      {preview && (
        <Player key={preview.nonce} preview topic={d} act={preview.act} list={previewList} onClose={() => setPreview(null)} onSwitch={(a) => setPreview({ act: a, nonce: Date.now() })} />
      )}
    </div>
    </EdCtx.Provider>
  );
}

type TabProps = { d: Topic; up: (fn: (x: Topic) => void) => void };
const box = 'p-5 sm:p-6 rounded-[20px] bg-s1 border border-line flex flex-col gap-4';

/* ================= Temel bilgiler ================= */
function MetaTab({ d, up, isNew }: TabProps & { isNew: boolean }) {
  return (
    <div className={box}>
      <div className="grid gap-4 md:grid-cols-2">
        <F label="Ders adı"><TI value={d.name} onChange={(v) => up((x) => { x.name = v; })} placeholder="Örn. Renkler" /></F>
        <F label="Kısa ad (adres)" hint={isNew ? 'Adres: /konu?id=kisa-ad. Yalnızca küçük harf, rakam ve tire. Sonradan değiştirilemez.' : 'Kısa ad değiştirilemez (kullanıcı ilerlemesi buna bağlı).'}>
          <input value={d.id} disabled={!isNew} onChange={(e) => up((x) => { x.id = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''); })} className={inCls + ' font-mono text-sm disabled:opacity-60'} placeholder="renkler" />
        </F>
        <F label="Arapça adı"><TI ar value={d.ar} onChange={(v) => up((x) => { x.ar = v; })} placeholder="الْأَلْوَانُ" /></F>
        <F label="Kart simgesi (1-3 Arapça harf)"><TI ar value={d.glyph} onChange={(v) => up((x) => { x.glyph = v; })} placeholder="ل" /></F>
        <F label="Ders numarası (sıra)"><TI type="number" value={d.n} onChange={(v) => up((x) => { x.n = Number(v) || 0; })} /></F>
        <F label="Seviye">
          <select value={d.level} onChange={(e) => up((x) => { x.level = e.target.value; })} className={inCls}>
            {[...new Set([...LEVELS, d.level])].map((l) => <option key={l} value={l} className="bg-s2">{l}</option>)}
          </select>
        </F>
        <F label="Okuma süresi (dk)"><TI type="number" value={d.readMins} onChange={(v) => up((x) => { x.readMins = Number(v) || 0; })} /></F>
        <F label="Yayın durumu">
          <span className="flex items-center gap-3 min-h-[44px]">
            <input type="checkbox" checked={!!d.published} onChange={(e) => up((x) => { x.published = e.target.checked; })} className="w-5 h-5 accent-[#C8894A]" />
            <span className="text-sm text-soft">{d.published ? 'Yayında: herkes görebilir' : 'Taslak: yalnızca yöneticiler görür'}</span>
          </span>
        </F>
      </div>
      <F label="Kısa açıklama (kartta)"><TA rows={2} value={d.desc} onChange={(v) => up((x) => { x.desc = v; })} /></F>
      <F label="Uzun açıklama (ders sayfasının başında)"><TA rows={3} value={d.long} onChange={(v) => up((x) => { x.long = v; })} /></F>
      <F label="Arama etiketleri" hint="Ana sayfadaki aramada eşleşmesi için ek kelimeler."><TI value={d.tags} onChange={(v) => up((x) => { x.tags = v; })} /></F>
      <F label="Giriş paragrafı (Bu derste)" hint={<>HTML kullanılabilir (&lt;b&gt;, &lt;em&gt;, &lt;br&gt;). Arapçayı {'{{...}}'} içine yazarsan Arapça yazı tipiyle gösterilir; işaretsiz Arapça da otomatik algılanır.</>}>
        <TA rows={4} value={d.intro} onChange={(v) => up((x) => { x.intro = v; })} />
      </F>
      <div className="flex flex-col gap-2 p-4 rounded-2xl bg-s3 border border-line">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-[.06em] uppercase text-lab">Özet anlatımı (dersin sonunda çalar)</span>
          <NarrStatus part="summary" text={d.summaryNarr} />
        </div>
        <TA rows={7} value={d.summaryNarr} onChange={(v) => up((x) => { x.summaryNarr = v || null; })} placeholder="Dersi toparlayan, sık hataları ve taktikleri hatırlatan kısa bir kapanış anlatımı." />
      </div>
      <F label="Özet: akılda kalacaklar" hint="Her satır bir madde.">
        <PTA kind="lines" rows={6} joined={d.keys.join('\n')} onText={(v) => up((x) => { x.keys = lines(v); })} />
      </F>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold tracking-[.06em] uppercase text-lab">Sık yapılan hatalar</span>
        {d.mistakes.map((m, i) => (
          <div key={i} className="p-4 rounded-2xl bg-s3 border border-line flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="grid gap-3 sm:grid-cols-2 flex-1">
                <F label="Yanlış"><TI value={m.bad} onChange={(v) => up((x) => { x.mistakes[i].bad = v; })} /></F>
                <F label="Doğru"><TI value={m.good} onChange={(v) => up((x) => { x.mistakes[i].good = v; })} /></F>
              </div>
              <RowTools i={i} n={d.mistakes.length} label="Hata" onMove={(dd) => up((x) => { x.mistakes = move(x.mistakes, i, dd); })} onRemove={() => up((x) => { x.mistakes.splice(i, 1); })} />
            </div>
            <F label="Açıklama"><TA rows={2} value={m.why} onChange={(v) => up((x) => { x.mistakes[i].why = v; })} /></F>
          </div>
        ))}
        <AddBtn onClick={() => up((x) => { x.mistakes.push({ bad: '', good: '', why: '' } as Mistake); })}>Hata ekle</AddBtn>
      </div>
    </div>
  );
}

/* ================= Konu anlatımı ================= */
function LessonTab({ d, up }: TabProps) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-sm text-mute">Her bölümde paragraflar, tablo, örnekler, Türkçe/İngilizce karşılaştırma ve püf noktaları olabilir. Boş bıraktığın alanlar gösterilmez.</p>
      {d.lesson.map((s, i) => (
        <div key={i} className="rounded-[20px] bg-s1 border border-line">
          <div className="flex items-center gap-3 p-4">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex-1 min-w-0 text-left flex items-center gap-3">
              <span className="text-acct font-bold">{i + 1}.</span>
              <span className="font-bold truncate">{s.h || 'Başlıksız bölüm'}</span>
              <span className="text-xs text-faint whitespace-nowrap">{(s.p || []).length} paragraf · {(s.ex || []).length} örnek{s.table ? ' · tablo' : ''}</span>
            </button>
            <RowTools i={i} n={d.lesson.length} label="Bölüm" onMove={(dd) => { up((x) => { x.lesson = move(x.lesson, i, dd); }); setOpen(null); }} onRemove={() => up((x) => { x.lesson.splice(i, 1); })} />
          </div>
          {open === i && <SectionEditor s={s} index={i} set={(fn) => up((x) => fn(x.lesson[i]))} />}
        </div>
      ))}
      <AddBtn onClick={() => { up((x) => { x.lesson.push({ h: 'Yeni bölüm', p: [] }); }); setOpen(d.lesson.length); }}>Bölüm ekle</AddBtn>
    </div>
  );
}

function SectionEditor({ s, set, index }: { s: Section; set: (fn: (s: Section) => void) => void; index: number }) {
  const [tableOn, setTableOn] = useState(!!s.table);
  return (
    <div className="px-4 pb-5 sm:px-5 flex flex-col gap-4 border-t border-line pt-4">
      <F label="Başlık"><TI value={s.h} onChange={(v) => set((x) => { x.h = v; })} /></F>
      <F label="Paragraflar" hint="Paragrafları boş bir satırla ayır. HTML ve {{Arapça}} kullanılabilir.">
        <PTA kind="paras" rows={6} joined={(s.p || []).join('\n\n')} onText={(v) => set((x) => { x.p = paras(v); })} />
      </F>
      <label className="flex items-center gap-3 text-sm text-soft">
        <input type="checkbox" checked={tableOn} onChange={(e) => { setTableOn(e.target.checked); set((x) => { x.table = e.target.checked ? x.table || { cols: ['Sütun 1', 'Sütun 2'], rows: [['', '']] } : undefined; }); }} className="w-5 h-5 accent-[#C8894A]" />
        Bu bölümde tablo var
      </label>
      {tableOn && s.table && (
        <div className="grid gap-3 p-4 rounded-2xl bg-s3 border border-line">
          <F label="Sütun başlıkları" hint="Sütunları | ile ayır."><PTI kind="cells" joined={s.table.cols.join(' | ')} onText={(v) => set((x) => { x.table!.cols = cells(v); })} /></F>
          <F label="Satırlar" hint="Her satır bir tablo satırı; hücreleri | ile ayır. Yalnızca Arapça olan hücrelere dinleme düğmesi eklenir.">
            <PTA kind="rows" rows={6} joined={s.table.rows.map((r) => r.join(' | ')).join('\n')} onText={(v) => set((x) => { x.table!.rows = lines(v).map(cells); })} />
          </F>
        </div>
      )}
      <F label="Tablodan sonraki paragraflar (isteğe bağlı)"><PTA kind="paras" rows={2} joined={(s.p2 || []).join('\n\n')} onText={(v) => set((x) => { x.p2 = paras(v); })} /></F>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold tracking-[.06em] uppercase text-lab">Örnekler</span>
        {(s.ex || []).map((e, i) => (
          <div key={i} className="p-4 rounded-2xl bg-s3 border border-line flex items-start gap-3">
            <div className="grid gap-3 sm:grid-cols-2 flex-1">
              <F label="Arapça" className="sm:col-span-2"><TI ar value={e.ar} onChange={(v) => set((x) => { x.ex![i].ar = v; })} /></F>
              <F label="Okunuş"><TI value={e.tl} onChange={(v) => set((x) => { x.ex![i].tl = v; })} /></F>
              <F label="Türkçe"><TI value={e.tr} onChange={(v) => set((x) => { x.ex![i].tr = v; })} /></F>
              <F label="İngilizce"><TI value={e.en} onChange={(v) => set((x) => { x.ex![i].en = v; })} /></F>
              <F label="Not (isteğe bağlı)"><TI value={e.note} onChange={(v) => set((x) => { x.ex![i].note = v; })} /></F>
              <span className="sm:col-span-2"><Snd text={e.ar} /></span>
            </div>
            <RowTools i={i} n={(s.ex || []).length} label="Örnek" onMove={(dd) => set((x) => { x.ex = move(x.ex!, i, dd); })} onRemove={() => set((x) => { x.ex!.splice(i, 1); })} />
          </div>
        ))}
        <AddBtn onClick={() => set((x) => { x.ex = [...(x.ex || []), { ar: '', tr: '' } as Example]; })}>Örnek ekle</AddBtn>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <F label="Türkçede (karşılaştırma)"><TA rows={3} value={s.cmp?.tr} onChange={(v) => set((x) => { x.cmp = { ...x.cmp, tr: v || undefined }; })} /></F>
        <F label="İngilizcede (karşılaştırma)"><TA rows={3} value={s.cmp?.en} onChange={(v) => set((x) => { x.cmp = { ...x.cmp, en: v || undefined }; })} /></F>
      </div>
      <F label="Püf noktaları" hint="Her püf noktasını boş bir satırla ayır."><PTA kind="paras" rows={3} joined={(s.tips || []).join('\n\n')} onText={(v) => set((x) => { x.tips = paras(v); })} /></F>
      <div className="flex flex-col gap-2 p-4 rounded-2xl bg-s3 border border-line">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-[.06em] uppercase text-lab">Sesli anlatım (öğretmen anlatımı)</span>
          <NarrStatus part={index} text={s.narr} />
        </div>
        <TA rows={9} value={s.narr} onChange={(v) => set((x) => { x.narr = v || undefined; })} placeholder="Bu bölümü bir öğretmen gibi anlatan metin. Arapça ifadeleri harekeli yaz; {{...}} içine alabilirsin." />
        <span className="text-xs text-faint">Ses, kaydedilmiş metinden üretilir. Metni değiştirirsen önce dersi kaydet, sonra sesi yeniden üret.</span>
      </div>
    </div>
  );
}

/* ================= Kelimeler ================= */
function WordsTab({ d, up }: TabProps) {
  return (
    <div className={box}>
      <p className="m-0 text-sm text-mute">Kelimeler; kelime önizleme panelinde, sözlükte, kelime kartlarında ve "Dinle ve seç" etkinliğinde kullanılır.</p>
      <div className="flex flex-col gap-2">
        {d.words.map((w, i) => (
          <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-s3 border border-line">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-4 flex-1">
              <TI ar value={w.ar} onChange={(v) => up((x) => { x.words[i].ar = v; })} placeholder="Arapça" />
              <TI value={w.tl} onChange={(v) => up((x) => { x.words[i].tl = v; })} placeholder="Okunuş" />
              <TI value={w.tr} onChange={(v) => up((x) => { x.words[i].tr = v; })} placeholder="Türkçe" />
              <TI value={w.en} onChange={(v) => up((x) => { x.words[i].en = v; })} placeholder="İngilizce" />
            </div>
            <span className="flex flex-col items-end gap-2">
              <RowTools i={i} n={d.words.length} label="Kelime" onMove={(dd) => up((x) => { x.words = move(x.words, i, dd); })} onRemove={() => up((x) => { x.words.splice(i, 1); })} />
              <Snd text={w.ar} />
            </span>
          </div>
        ))}
      </div>
      <AddBtn onClick={() => up((x) => { x.words.push({ ar: '', tr: '' } as Word); })}>Kelime ekle</AddBtn>
    </div>
  );
}

/* ================= Etkinlikler ================= */
const NEW_ACT: Record<ActType, () => Activity> = {
  flash: () => ({ id: '', type: 'flash', title: 'Kelime kartları', desc: 'Bu dersin kelimelerini kartlarla öğren.', glyph: '' }),
  match: () => ({ id: '', type: 'match', title: 'Eşleştirme', desc: 'Arapçayı Türkçe karşılığıyla eşleştir.', glyph: '', items: [['', ''], ['', '']] as Pair[] }),
  mc: () => ({ id: '', type: 'mc', title: 'Çoktan seçmeli', desc: '', glyph: '', items: [{ q: '', options: ['', ''], a: '' }] }),
  fill: () => ({ id: '', type: 'fill', title: 'Boşluk doldurma', desc: '', glyph: '', items: [{ s: '___', options: ['', ''], a: '' }] }),
  tf: () => ({ id: '', type: 'tf', title: 'Doğru / Yanlış', desc: '', glyph: '', items: [{ s: '', a: true }] }),
  order: () => ({ id: '', type: 'order', title: 'Cümle kurma', desc: '', glyph: '', items: [{ tr: '', w: ['', ''] }] }),
  listen: () => ({ id: '', type: 'listen', title: 'Dinle ve anlamını seç', desc: 'Kelimeyi dinle, Türkçe anlamını bul.', glyph: 'اِسْمَعْ' }),
  test: () => ({ id: '', type: 'test', title: 'Konu testi', desc: 'Dersin tamamını kapsayan karma değerlendirme.', glyph: '؟', items: [{ t: 'mc', q: '', options: ['', ''], a: '' }] }),
  speak: () => ({ id: '', type: 'speak', title: 'Telaffuz alıştırması', desc: 'Kelimeyi dinle, sonra sen söyle. Tarayıcı söylediğini kontrol eder.', glyph: 'تَكَلَّمْ' }),
  clock: () => ({ id: '', type: 'clock', mode: 'mix', title: 'Sınırsız saat pratiği', desc: 'Rastgele saatlerle bitmeyen pratik.', glyph: '∞' })
};

function ActsTab({ d, up, onPreview }: TabProps & { onPreview: (i: number) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [newType, setNewType] = useState<ActType>('mc');
  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-sm text-mute">Etkinlikler bu sırayla gösterilir. "Önizle", kaydetmeden etkinliği oynatır (skor kaydedilmez).</p>
      {d.acts.map((a, i) => (
        <div key={i} className="rounded-[20px] bg-s1 border border-line">
          <div className="flex items-center gap-3 p-4">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex-1 min-w-0 text-left flex items-center gap-3">
              <span className="w-10 h-10 shrink-0 rounded-xl bg-chip border border-[#3E2D20] flex items-center justify-center font-ar text-[16px] text-acct overflow-hidden">{a.glyph || d.glyph}</span>
              <span className="min-w-0 flex flex-col">
                <span className="font-bold truncate">{a.title || 'Başlıksız etkinlik'}</span>
                <span className="text-xs text-faint">{TYPE[a.type].label}{a.items ? ` · ${a.items.length} ${a.type === 'match' ? 'çift' : 'soru'}` : a.type === 'clock' ? ' · sınırsız' : ' · kelimelerden'}{!a.id ? ' · yeni' : ''}</span>
              </span>
            </button>
            <button type="button" onClick={() => onPreview(i)} className="h-9 px-3 rounded-lg border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink hover:border-lineh">Önizle</button>
            <RowTools i={i} n={d.acts.length} label="Etkinlik" onMove={(dd) => { up((x) => { x.acts = move(x.acts, i, dd); }); setOpen(null); }} onRemove={() => { up((x) => { x.acts.splice(i, 1); }); setOpen(null); }} />
          </div>
          {open === i && <ActEditor a={a} set={(fn) => up((x) => fn(x.acts[i]))} words={d.words.length} />}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <select value={newType} onChange={(e) => setNewType(e.target.value as ActType)} className={inCls + ' w-auto'} aria-label="Yeni etkinlik türü">
          {ACT_TYPES.map((t) => <option key={t} value={t} className="bg-s2">{TYPE[t].label}</option>)}
        </select>
        <AddBtn onClick={() => { up((x) => { x.acts.push(NEW_ACT[newType]()); }); setOpen(d.acts.length); }}>Etkinlik ekle</AddBtn>
      </div>
    </div>
  );
}

function ActEditor({ a, set, words }: { a: Activity; set: (fn: (a: Activity) => void) => void; words: number }) {
  const items = (a.items || []) as unknown[];
  return (
    <div className="px-4 pb-5 sm:px-5 flex flex-col gap-4 border-t border-line pt-4">
      <div className="grid gap-3 md:grid-cols-[1fr_200px_160px]">
        <F label="Başlık"><TI value={a.title} onChange={(v) => set((x) => { x.title = v; })} /></F>
        <F label="Tür">
          <select value={a.type} onChange={(e) => {
            const t = e.target.value as ActType;
            if (a.items && a.items.length && !confirm('Tür değişince bu etkinliğin soruları/çiftleri sıfırlanır. Devam edilsin mi?')) return;
            set((x) => { const n = NEW_ACT[t](); x.type = t; x.mode = n.mode ?? null; x.items = n.items ?? null; });
          }} className={inCls}>
            {ACT_TYPES.map((t) => <option key={t} value={t} className="bg-s2">{TYPE[t].label}</option>)}
          </select>
        </F>
        <F label="Kart simgesi"><TI ar value={a.glyph} onChange={(v) => set((x) => { x.glyph = v; })} /></F>
      </div>
      <F label="Açıklama"><TA rows={2} value={a.desc} onChange={(v) => set((x) => { x.desc = v; })} /></F>

      {a.type === 'clock' && (
        <F label="Mod">
          <select value={a.mode || 'mix'} onChange={(e) => set((x) => { x.mode = e.target.value as Activity['mode']; })} className={inCls}>
            <option value="c2t" className="bg-s2">Kadrandan yazıya</option>
            <option value="t2c" className="bg-s2">Yazıdan kadrana</option>
            <option value="mix" className="bg-s2">Karışık</option>
          </select>
        </F>
      )}
      {(a.type === 'flash' || a.type === 'listen' || a.type === 'speak') && (
        <p className="m-0 px-4 py-3 rounded-xl bg-s3 border border-line text-sm text-mute">Bu etkinlik dersin "Kelimeler" bölümündeki {words} kelimeyi kullanır{a.type === 'listen' ? ' (rastgele 10 tanesi sorulur)' : a.type === 'speak' ? ' (rastgele 8 tanesi söyletilir)' : ''}.</p>
      )}
      {['mc', 'fill', 'tf', 'order', 'test'].includes(a.type) && (
        <label className="flex items-center gap-3 text-sm text-soft">
          <input type="checkbox" checked={!!a.keepOrder} onChange={(e) => set((x) => { x.keepOrder = e.target.checked || undefined; })} className="w-5 h-5 accent-[#C8894A]" />
          Soruları karıştırma (bu sırayla sor)
        </label>
      )}

      {a.type === 'match' && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-[.06em] uppercase text-lab">Çiftler (en fazla 5'er 5'er turlar hâlinde gösterilir)</span>
          {(items as Pair[]).map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-2 flex-1">
                <TI ar={/[؀-ۿ]/.test(p[0])} value={p[0]} onChange={(v) => set((x) => { (x.items as Pair[])[i][0] = v; })} placeholder="Sol (genelde Arapça)" />
                <TI value={p[1]} onChange={(v) => set((x) => { (x.items as Pair[])[i][1] = v; })} placeholder="Sağ (karşılığı)" />
              </div>
              <RowTools i={i} n={items.length} label="Çift" onMove={(dd) => set((x) => { x.items = move(x.items as Pair[], i, dd); })} onRemove={() => set((x) => { (x.items as Pair[]).splice(i, 1); })} />
            </div>
          ))}
          <AddBtn onClick={() => set((x) => { x.items = [...((x.items as Pair[]) || []), ['', '']]; })}>Çift ekle</AddBtn>
        </div>
      )}

      {['mc', 'fill', 'tf', 'order', 'test'].includes(a.type) && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold tracking-[.06em] uppercase text-lab">Sorular</span>
          {(items as Question[]).map((q, i) => (
            <div key={i} className="p-4 rounded-2xl bg-s3 border border-line flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="flex flex-wrap items-center gap-2"><span className="font-bold text-sm">Soru {i + 1}</span><QStat actId={a.id} q={q} t={(q.t || (a.type === 'test' ? 'mc' : a.type)) as QType} /></span>
                <span className="flex items-center gap-2">
                  {a.type === 'test' && (
                    <select value={q.t || 'mc'} onChange={(e) => set((x) => { (x.items as Question[])[i].t = e.target.value as QType; })} className={inCls + ' w-auto min-h-[36px] py-1 text-sm'} aria-label="Soru türü">
                      {Q_TYPES.map(([t, l]) => <option key={t} value={t} className="bg-s2">{l}</option>)}
                    </select>
                  )}
                  <RowTools i={i} n={items.length} label="Soru" onMove={(dd) => set((x) => { x.items = move(x.items as Question[], i, dd); })} onRemove={() => set((x) => { (x.items as Question[]).splice(i, 1); })} />
                </span>
              </div>
              <QuestionEditor q={q} t={(q.t || (a.type === 'test' ? 'mc' : a.type)) as QType} set={(fn) => set((x) => fn((x.items as Question[])[i]))} />
            </div>
          ))}
          <AddBtn onClick={() => set((x) => {
            const t = a.type === 'test' ? 'mc' : (a.type as QType);
            const blank: Question = t === 'tf' ? { s: '', a: true } : t === 'order' ? { tr: '', w: ['', ''] } : t === 'fill' ? { s: '___', options: ['', ''], a: '' } : { q: '', options: ['', ''], a: '' };
            x.items = [...((x.items as Question[]) || []), a.type === 'test' ? { t: 'mc', ...blank } : blank];
          })}>Soru ekle</AddBtn>
        </div>
      )}
    </div>
  );
}

function QuestionEditor({ q, t, set }: { q: Question; t: QType; set: (fn: (q: Question) => void) => void }) {
  const opts = q.options || [];
  const why = <F label="Açıklama (cevaptan sonra gösterilir)" hint="Neden doğru olduğunu anlat. {{Arapça}} kullanılabilir."><TA rows={2} value={q.why} onChange={(v) => set((x) => { x.why = v || undefined; })} /></F>;
  const options = (
    <div className="grid gap-3 sm:grid-cols-2">
      <F label="Seçenekler" hint="Her satır bir seçenek.">
        <PTA kind="lines" rows={4} ar={opts.some((o) => /[؀-ۿ]/.test(o))} joined={opts.join('\n')} onText={(v) => set((x) => { x.options = lines(v); })} />
      </F>
      <div className="flex flex-col gap-3">
        <F label="Doğru cevap">
          <select value={String(q.a ?? '')} onChange={(e) => set((x) => { x.a = e.target.value; })} className={inCls}>
            <option value="" className="bg-s2">Seç</option>
            {opts.filter(Boolean).map((o, i) => <option key={i} value={o} className="bg-s2">{o}</option>)}
          </select>
        </F>
        <label className="flex items-center gap-3 text-sm text-soft">
          <input type="checkbox" checked={!!q.fixed} onChange={(e) => set((x) => { x.fixed = e.target.checked || undefined; })} className="w-5 h-5 accent-[#C8894A]" />
          Seçenekleri karıştırma
        </label>
      </div>
    </div>
  );

  if (t === 'mc') return (
    <div className="flex flex-col gap-3">
      <F label="Soru metni" hint="İsteğe bağlı {{Arapça}} içerebilir."><TI value={q.q} onChange={(v) => set((x) => { x.q = v || undefined; })} /></F>
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_140px]">
        <F label="Büyük Arapça ifade (isteğe bağlı)"><TI ar value={q.ar} onChange={(v) => set((x) => { x.ar = v || undefined; })} /></F>
        <F label="Okunuşu"><TI value={q.tl} onChange={(v) => set((x) => { x.tl = v || undefined; })} /></F>
        <F label="Saat kadranı" hint="Örn. 7:45"><TI value={q.clock} onChange={(v) => set((x) => { x.clock = v || undefined; })} placeholder="Yok" /></F>
      </div>
      {options}
      {why}
    </div>
  );
  if (t === 'fill') return (
    <div className="flex flex-col gap-3">
      <F label="Cümle" hint="Boşluğu ___ (üç alt çizgi) ile göster."><TI ar value={q.s} onChange={(v) => set((x) => { x.s = v; })} /></F>
      <div className="grid gap-3 sm:grid-cols-2">
        <F label="İpucu (isteğe bağlı)"><TI value={q.hint} onChange={(v) => set((x) => { x.hint = v || undefined; })} /></F>
        <F label="Türkçe anlamı"><TI value={q.tr} onChange={(v) => set((x) => { x.tr = v || undefined; })} /></F>
      </div>
      {options}
      {why}
    </div>
  );
  if (t === 'tf') return (
    <div className="flex flex-col gap-3">
      <F label="Önerme"><TA rows={2} value={q.s} onChange={(v) => set((x) => { x.s = v; })} /></F>
      <F label="Doğru mu?">
        <select value={q.a === false ? 'f' : 't'} onChange={(e) => set((x) => { x.a = e.target.value === 't'; })} className={inCls + ' sm:w-[220px]'}>
          <option value="t" className="bg-s2">Doğru</option>
          <option value="f" className="bg-s2">Yanlış</option>
        </select>
      </F>
      {why}
    </div>
  );
  if (t === 'order') return (
    <div className="flex flex-col gap-3">
      <F label="Türkçe cümle"><TI value={q.tr} onChange={(v) => set((x) => { x.tr = v; })} /></F>
      <F label="Doğru sıradaki Arapça kelimeler" hint="Kelimeleri doğru sırayla, | ile ayırarak yaz. Oyuncu bunları karışık görür.">
        <PTI kind="words" ar joined={(q.w || []).join(' | ')} onText={(v) => set((x) => { x.w = cells(v).filter(Boolean); })} />
      </F>
      {why}
    </div>
  );
  return null;
}

/* ================= JSON ================= */
function JsonTab({ d, onApply }: { d: Topic; onApply: (t: Topic) => void }) {
  const [txt, setTxt] = useState(() => JSON.stringify(d, null, 2));
  const [err, setErr] = useState('');
  useEffect(() => setTxt(JSON.stringify(d, null, 2)), [d]);
  return (
    <div className={box}>
      <p className="m-0 text-sm text-mute">Gelişmiş: dersin tüm içeriğini JSON olarak düzenleyebilir ya da başka bir dersten kopyalayabilirsin. "Uygula"dan sonra kaydetmeyi unutma.</p>
      <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={28} spellCheck={false} className={inCls + ' font-mono text-[13px] leading-relaxed'} />
      {err && <p role="alert" className="m-0 text-sm text-bad">{err}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => {
          try {
            const t = JSON.parse(txt) as Topic;
            if (!t || typeof t !== 'object' || !Array.isArray(t.lesson) || !Array.isArray(t.acts) || !Array.isArray(t.words)) throw new Error('lesson, words ve acts dizileri gerekli.');
            t.keys ??= []; t.mistakes ??= [];
            setErr(''); onApply(t);
          } catch (e) { setErr('Geçersiz JSON: ' + (e as Error).message); }
        }} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold text-sm">Uygula</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(txt)} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold text-sm hover:border-lineh">Kopyala</button>
      </div>
    </div>
  );
}
