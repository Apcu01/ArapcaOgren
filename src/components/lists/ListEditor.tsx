'use client';

/* Kelime listesi oluşturma ve düzenleme */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Ar, useApp } from '../AppProvider';
import { I, Raw } from '../icons';
import { jsonFetch, useList } from './useList';
import { Loading, LoginNeeded, Missing } from './parts';
import { LIST_MAX_ITEMS, type WordList } from '@/lib/study';

export type TopicWords = { id: string; name: string; words: { ar: string; tl: string; tr: string }[] };
type Row = { key: number; id?: number; ar: string; tl: string; tr: string; note: string };
type Sug = { ar: string; tl: string; tr: string };

let seq = 0;
const blank = (): Row => ({ key: ++seq, ar: '', tl: '', tr: '', note: '' });
const filled = (r: Row) => r.ar.trim() || r.tl.trim() || r.tr.trim();

/** Toplu ekleme: her satır "Arapça ; okunuş ; anlam" (sekme, noktalı virgül ya da tire ile ayrılabilir) */
export function parseBulk(text: string): Omit<Row, 'key'>[] {
  const out: Omit<Row, 'key'>[] = [];
  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(/\t|;| [-–] |=/).map((s) => s.trim()).filter(Boolean);
    if (!parts.length) continue;
    const ar = parts.find((p) => /[؀-ۿ]/.test(p)) || '';
    const lat = parts.filter((p) => p !== ar);
    const [tl, tr] = lat.length >= 2 ? [lat[0], lat.slice(1).join(', ')] : ['', lat[0] || ''];
    out.push({ ar, tl, tr, note: '' });
  }
  return out;
}

export default function ListEditor({ id, topics }: { id?: number; topics: TopicWords[] }) {
  const { user, session } = useApp();
  if (session === 'loading') return <Loading />;
  if (!user) return <LoginNeeded />;
  return id ? <EditExisting id={id} topics={topics} /> : <Editor topics={topics} />;
}

function EditExisting({ id, topics }: { id: number; topics: TopicWords[] }) {
  const { state } = useList(id);
  if (state.status === 'loading') return <Loading />;
  if (state.status === 'login') return <LoginNeeded />;
  if (state.status !== 'ready') return <Missing />;
  return <Editor list={state.list} topics={topics} />;
}

function Editor({ list, topics }: { list?: WordList; topics: TopicWords[] }) {
  const router = useRouter();
  const { toast } = useApp();
  const [title, setTitle] = useState(list?.title ?? '');
  const [desc, setDesc] = useState(list?.description ?? '');
  const [rows, setRows] = useState<Row[]>(() => list?.items.length
    ? list.items.map((it) => ({ key: ++seq, id: it.id, ar: it.ar, tl: it.tl, tr: it.tr, note: it.note }))
    : [blank(), blank(), blank()]);
  const [panel, setPanel] = useState<'bulk' | 'topic' | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const dirty = useRef(false);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty.current) e.preventDefault(); };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, []);

  const set = (key: number, patch: Partial<Row>) => { dirty.current = true; setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r))); };
  const remove = (key: number) => { dirty.current = true; setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== key) : [blank()])); };
  const move = (key: number, d: -1 | 1) => setRows((rs) => {
    const i = rs.findIndex((r) => r.key === key), j = i + d;
    if (j < 0 || j >= rs.length) return rs;
    const n = rs.slice();
    [n[i], n[j]] = [n[j], n[i]];
    dirty.current = true;
    return n;
  });
  /** Yeni kelimeleri boş satırlara yerleştirir, aynı Arapça yazım ikinci kez eklenmez */
  const addMany = (items: Omit<Row, 'key'>[]) => {
    dirty.current = true;
    const have = new Set(rows.map((r) => r.ar.trim()).filter(Boolean));
    const fresh = items.filter((it) => !it.ar || !have.has(it.ar.trim()));
    const kept = rows.filter(filled);
    const next = [...kept, ...fresh.map((it) => ({ ...it, key: ++seq }))].slice(0, LIST_MAX_ITEMS);
    const skipped = items.length - fresh.length;
    setRows(next.length ? next : [blank()]);
    toast(`${Math.min(fresh.length, LIST_MAX_ITEMS - kept.length)} kelime eklendi${skipped ? `, ${skipped} kelime zaten listede` : ''}.`);
    setPanel(null);
  };

  async function save() {
    const items = rows.filter(filled).map(({ id, ar, tl, tr, note }) => ({ id, ar, tl, tr, note }));
    if (!title.trim()) { setErr('Listeye bir ad ver.'); return; }
    if (!items.length) { setErr('En az bir kelime ekle.'); return; }
    const bad = items.findIndex((it) => !it.ar.trim() || !it.tr.trim());
    if (bad >= 0) { setErr(`${bad + 1}. kelimede Arapça yazım ya da Türkçe anlam eksik.`); return; }
    setBusy(true); setErr('');
    const body = JSON.stringify({ title, description: desc, items });
    const r = list
      ? await jsonFetch(`/api/lists/${list.id}`, { method: 'PUT', body })
      : await jsonFetch<{ id: number }>('/api/lists', { method: 'POST', body });
    setBusy(false);
    if (!r.ok) { setErr(r.error); return; }
    dirty.current = false;
    const id = list ? list.id : (r.data as { id: number }).id;
    router.push(`/listelerim/${id}`);
    router.refresh();
  }

  async function del() {
    if (!list || !confirm(`"${list.title}" listesi ve çalışma geçmişi silinsin mi? Bu geri alınamaz.`)) return;
    const r = await jsonFetch(`/api/lists/${list.id}`, { method: 'DELETE' });
    if (!r.ok) { toast(r.error); return; }
    dirty.current = false;
    toast('Liste silindi.');
    router.push('/listelerim');
  }

  const count = rows.filter(filled).length;
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-28 flex flex-col gap-6">
      <Link href={list ? `/listelerim/${list.id}` : '/listelerim'} className="self-start inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><Raw html={I.back()} /> {list ? list.title : 'Listelerim'}</Link>
      <h1 className="m-0 text-[30px] sm:text-[36px] font-bold tracking-tight">{list ? 'Listeyi düzenle' : 'Yeni liste'}</h1>

      <div className="grid gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-soft">Liste adı</span>
          <input value={title} onChange={(e) => { dirty.current = true; setTitle(e.target.value); }} maxLength={80} placeholder="Örneğin: 3. ünite kelimeleri"
            className="h-12 px-4 rounded-xl bg-s2 border border-line3 text-ink text-[16px] outline-none focus:border-acc" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-soft">Açıklama <span className="font-normal text-faint">(isteğe bağlı)</span></span>
          <input value={desc} onChange={(e) => { dirty.current = true; setDesc(e.target.value); }} maxLength={300} placeholder="Kısa bir not"
            className="h-12 px-4 rounded-xl bg-s2 border border-line3 text-ink text-[16px] outline-none focus:border-acc" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setPanel(panel === 'bulk' ? null : 'bulk')} aria-expanded={panel === 'bulk'}
          className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink hover:border-lineh">Toplu ekle</button>
        <button type="button" onClick={() => setPanel(panel === 'topic' ? null : 'topic')} aria-expanded={panel === 'topic'}
          className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:text-ink hover:border-lineh">Dersten ekle</button>
      </div>
      {panel === 'bulk' && <BulkPanel onAdd={addMany} />}
      {panel === 'topic' && <TopicPanel topics={topics} onAdd={addMany} />}

      <div className="flex flex-col gap-3">
        <div className="hidden sm:grid grid-cols-[32px_1fr_1fr_1.3fr_76px] gap-3 px-1 text-xs font-bold tracking-[.08em] uppercase text-lab">
          <span /> <span className="text-right">Arapça</span><span>Okunuş</span><span>Türkçe anlamı</span><span />
        </div>
        {rows.map((r, i) => <RowEdit key={r.key} r={r} n={i + 1} set={set} remove={remove} move={move} last={i === rows.length - 1} />)}
        <button type="button" onClick={() => { dirty.current = true; setRows((rs) => [...rs, blank()]); }} disabled={rows.length >= LIST_MAX_ITEMS}
          className="h-14 rounded-2xl border-2 border-dashed border-line3 text-soft font-semibold hover:text-ink hover:border-lineh inline-flex items-center justify-center gap-2 disabled:opacity-50">
          <Raw html={I.plus(18)} /> Kelime ekle
        </button>
      </div>

      <div className="fixed left-0 right-0 bottom-0 z-40 border-t border-line bg-head/95 backdrop-blur">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-mute">{count} kelime</span>
          {err && <span className="text-sm text-bad" role="alert">{err}</span>}
          <span className="flex-1" />
          {list && <button type="button" onClick={del} className="h-11 px-4 rounded-xl text-bad text-sm font-semibold hover:bg-badbg">Listeyi sil</button>}
          <button type="button" onClick={save} disabled={busy} className="h-11 px-6 rounded-xl bg-acc text-onacc font-bold disabled:opacity-60">{busy ? 'Kaydediliyor' : list ? 'Kaydet' : 'Oluştur'}</button>
        </div>
      </div>
    </div>
  );
}

function RowEdit({ r, n, set, remove, move, last }: { r: Row; n: number; set: (k: number, p: Partial<Row>) => void; remove: (k: number) => void; move: (k: number, d: -1 | 1) => void; last: boolean }) {
  const [sugs, setSugs] = useState<Sug[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const box = useRef<HTMLDivElement>(null);
  // Diğer alanlar boşken yazılan kelime için öneri (dersler ve yerleşik sözlük)
  const ask = (field: 'ar' | 'tl' | 'tr', v: string) => {
    clearTimeout(timer.current);
    const others = (['ar', 'tl', 'tr'] as const).filter((f) => f !== field);
    if (v.trim().length < 2 || others.some((f) => r[f].trim())) { setSugs([]); return; }
    timer.current = setTimeout(async () => {
      const res = await fetch('/api/lists/suggest?q=' + encodeURIComponent(v.trim())).then((x) => x.json()).catch(() => null) as { items?: Sug[] } | null;
      setSugs(res?.items || []);
      setOpen(true);
    }, 280);
  };
  useEffect(() => {
    const h = (e: MouseEvent) => { if (box.current && !e.composedPath().includes(box.current)) setOpen(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);
  const field = (f: 'ar' | 'tl' | 'tr', ph: string, extra = '') => (
    <input value={r[f]} placeholder={ph} aria-label={`${n}. kelime ${f === 'ar' ? 'Arapça' : f === 'tl' ? 'okunuş' : 'Türkçe anlam'}`}
      maxLength={f === 'tr' ? 300 : 120} autoComplete="off" spellCheck={false} dir={f === 'ar' ? 'rtl' : 'ltr'} lang={f === 'ar' ? 'ar' : undefined}
      onChange={(e) => { set(r.key, { [f]: e.target.value }); ask(f, e.target.value); }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
      className={`h-12 w-full min-w-0 px-3.5 rounded-xl bg-s2 border border-line3 text-ink outline-none focus:border-acc ${extra}`} />
  );
  return (
    <div ref={box} className="relative p-3 sm:p-2 rounded-2xl bg-s1 border border-line sm:border-0 sm:bg-transparent">
      <div className="grid grid-cols-[28px_1fr_auto] sm:grid-cols-[32px_1fr_1fr_1.3fr_76px] gap-2 sm:gap-3 items-center">
        <span className="text-sm text-faint font-semibold text-center">{n}</span>
        <div className="sm:contents grid gap-2 col-span-1">
          {field('ar', 'كِتَابٌ', 'ar text-[20px] text-right')}
          {field('tl', 'kitâbun')}
          {field('tr', 'kitap')}
        </div>
        <div className="flex sm:flex-row flex-col gap-1 self-center">
          <span className="hidden sm:flex flex-col">
            <button type="button" onClick={() => move(r.key, -1)} disabled={n === 1} aria-label={`${n}. kelimeyi yukarı taşı`} className="w-8 h-6 text-faint hover:text-ink disabled:opacity-30 flex items-center justify-center"><Raw html={I.up(15)} /></button>
            <button type="button" onClick={() => move(r.key, 1)} disabled={last} aria-label={`${n}. kelimeyi aşağı taşı`} className="w-8 h-6 text-faint hover:text-ink disabled:opacity-30 flex items-center justify-center"><Raw html={I.down(15)} /></button>
          </span>
          <button type="button" onClick={() => remove(r.key)} aria-label={`${n}. kelimeyi sil`} className="w-10 h-10 rounded-full text-faint hover:text-bad hover:bg-badbg flex items-center justify-center"><Raw html={I.trash(17)} /></button>
        </div>
      </div>
      {open && sugs.length > 0 && (
        <div className="absolute z-30 left-10 right-2 sm:left-[44px] sm:right-[88px] top-full -mt-1 p-1.5 rounded-xl bg-s4 border border-line3 shadow-2xl" role="listbox" aria-label="Öneriler">
          <span className="block px-3 pt-1 pb-1.5 text-xs text-faint">Derslerden ve sözlükten öneriler</span>
          {sugs.map((s) => (
            <button key={s.ar} type="button" role="option" aria-selected={false} onClick={() => { set(r.key, { ar: s.ar, tl: s.tl, tr: s.tr }); setOpen(false); setSugs([]); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-s5">
              <Ar t={s.ar} className="text-[20px] text-ink min-w-[70px] text-right" />
              <span className="flex flex-col min-w-0"><span className="text-sm text-ink font-semibold truncate">{s.tr}</span><span className="text-xs text-mute">{s.tl}</span></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BulkPanel({ onAdd }: { onAdd: (items: Omit<Row, 'key'>[]) => void }) {
  const [text, setText] = useState('');
  const parsed = parseBulk(text);
  return (
    <div className="pop flex flex-col gap-3 p-5 rounded-2xl bg-s4 border border-line3">
      <p className="m-0 text-sm text-mute leading-relaxed">Her satıra bir kelime yaz: <b className="text-soft">Arapça ; okunuş ; anlam</b>. Okunuş yazmak zorunlu değil (<span className="text-soft">كتاب ; kitap</span>). Sekme, noktalı virgül ya da tire ile ayırabilirsin; Excel ve Word tablolarından kopyalayıp yapıştırabilirsin.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder={'كَتَبَ ; ketebe ; yazdı\nقَلَمٌ ; kalemun ; kalem'}
        className="w-full px-4 py-3 rounded-xl bg-s2 border border-line3 text-ink text-[15px] leading-relaxed outline-none focus:border-acc resize-y" />
      <div className="flex items-center gap-3 justify-end">
        <span className="text-sm text-mute">{parsed.length} kelime</span>
        <button type="button" disabled={!parsed.length} onClick={() => onAdd(parsed)} className="h-10 px-5 rounded-xl bg-acc text-onacc text-sm font-bold disabled:opacity-50">Ekle</button>
      </div>
    </div>
  );
}

function TopicPanel({ topics, onAdd }: { topics: TopicWords[]; onAdd: (items: Omit<Row, 'key'>[]) => void }) {
  return (
    <div className="pop flex flex-col gap-3 p-5 rounded-2xl bg-s4 border border-line3">
      <p className="m-0 text-sm text-mute">Bir dersin bütün kelimelerini listene ekle:</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {topics.filter((t) => t.words.length).map((t) => (
          <button key={t.id} type="button" onClick={() => onAdd(t.words.map((w) => ({ ...w, note: '' })))}
            className="flex items-center justify-between gap-3 px-4 h-12 rounded-xl bg-s2 border border-line3 text-left text-soft hover:text-ink hover:border-lineh">
            <span className="font-semibold truncate">{t.name}</span><span className="text-xs text-faint shrink-0">{t.words.length} kelime</span>
          </button>
        ))}
      </div>
    </div>
  );
}
