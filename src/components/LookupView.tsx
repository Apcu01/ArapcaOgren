'use client';

/* Kelime bul: okunuştan (ketebe, afvan) ya da Arapça yazımdan kelimenin anlamını bulur.
   Önce derslerdeki kelimelerde esnek okunuş araması yapılır; bulunamazsa yapay zekâya sorulur. */
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LookupResult } from '@/lib/types';
import { isAr, normAr, searchKey, strip } from '@/lib/text';
import { LOOKUP_RE, sameSound } from '@/lib/translit';
import { rootOf, spaced } from '@/lib/roots';
import { SayBtn, useApp } from './AppProvider';
import { I, Raw } from './icons';

export type DictWord = { ar: string; tr: string; tl: string; en: string; topics: { id: string; name: string }[] };
type Card = { ar: string; tl: string; tr: string; en?: string; type?: string; root?: string; note?: string; example?: { ar: string; tr: string }; topics?: DictWord['topics'] };
type Source = 'lexicon' | 'ai' | 'cache';
type Ai = { status: 'idle' } | { status: 'loading' } | { status: 'login' } | { status: 'done'; data: LookupResult; source: Source; near: boolean } | { status: 'error'; msg: string };

const RECENT_KEY = 'arblearn:lookup-recent';
const EXAMPLES = ['ketebe', 'afvan', 'müderris', 'şukran', 'kitâb', 'كتب'];
const arKey = (s: string) => normAr(strip(s)).replace(/^ال/, '').replace(/\s+/g, ' ').trim();

/** Derslerdeki kelimelerde arama: okunuş benzerliği, Arapça yazım ya da Türkçe anlam */
function searchLocal(words: DictWord[], q: string) {
  const s = q.trim();
  if (!s) return { sound: [] as DictWord[], meaning: [] as DictWord[] };
  if (isAr(s)) {
    const k = arKey(s);
    return { sound: words.filter((w) => arKey(w.ar) === k || arKey(w.ar).split(' ').includes(k)), meaning: [] };
  }
  const sound = words.filter((w) => w.tl && [w.tl, ...w.tl.split(/[\s/,]+/)].some((t) => sameSound(t, s)));
  const sk = searchKey(s);
  const meaning = sk.length < 2 ? [] : words.filter((w) => !sound.includes(w) && w.tr.split(/[,/;()]+|\s+/).some((t) => searchKey(t) === sk));
  return { sound, meaning };
}

export default function LookupView({ words, initialQ }: { words: DictWord[]; initialQ: string }) {
  return <Lookup words={words} initialQ={initialQ} />;
}

/** Yapay zekâya sormak hesap ister (maliyetli tek adım bu); sözlük aramaları herkese açık */
function AiLoginCard() {
  return (
    <div className="pop p-5 sm:p-6 rounded-[20px] bg-s3 border border-line3 flex flex-col sm:flex-row sm:items-center gap-4">
      <span className="w-12 h-12 shrink-0 rounded-xl bg-chip border border-chipln text-acct flex items-center justify-center"><Raw html={I.bulb(22)} /></span>
      <div className="flex-1 flex flex-col gap-1">
        <span className="font-bold text-ink">Yapay zekâya sormak için giriş yap</span>
        <span className="text-sm text-mute leading-relaxed">Ders kelimeleri ve sözlüğümüz herkese açık. Sözlükte olmayan kelimeleri yapay zekâ ile bulmak için ücretsiz bir hesap yeterli.</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/giris" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2 hover:text-onacc">Giriş yap</Link>
        <Link href="/kayit" className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Hesap aç</Link>
      </div>
    </div>
  );
}

function Lookup({ words, initialQ }: { words: DictWord[]; initialQ: string }) {
  const { metric } = useApp();
  const [input, setInput] = useState(initialQ);
  const [q, setQ] = useState('');
  const [ai, setAi] = useState<Ai>({ status: 'idle' });
  // Yerleşik sözlük sonucu ayrı tutulur: yapay zekâya da sorulunca ikisi birlikte görünür
  const [lex, setLex] = useState<{ data: LookupResult; near: boolean } | null>(null);
  const [err, setErr] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const reqId = useRef(0);

  const local = useMemo(() => searchLocal(words, q), [words, q]);
  const dictByAr = useMemo(() => {
    const m = new Map<string, DictWord>();
    for (const w of words) if (!m.has(arKey(w.ar))) m.set(arKey(w.ar), w);
    return m;
  }, [words]);

  useEffect(() => {
    try { const r = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); if (Array.isArray(r)) setRecent(r.slice(0, 8)); } catch { /* yok */ }
  }, []);

  const askAi = useCallback(async (text: string, forceAi = false) => {
    const id = ++reqId.current;
    setAi({ status: 'loading' });
    const r = await fetch('/api/lookup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: text, ai: forceAi || undefined }) }).catch(() => null);
    if (id !== reqId.current) return;
    const j = (await r?.json().catch(() => null)) as (LookupResult & { source?: Source; match?: string; error?: string; needLogin?: boolean }) | null;
    if (r?.status === 401 && j?.needLogin) { setAi({ status: 'login' }); return; }
    if (!r || !r.ok || !j) { setAi({ status: 'error', msg: j?.error || 'Bağlantı kurulamadı. İnternetini kontrol et.' }); return; }
    if (j.source === 'lexicon') { setLex({ data: { results: j.results || [], note: j.note }, near: j.match === 'near' }); setAi({ status: 'idle' }); return; }
    setAi({ status: 'done', data: { results: j.results || [], note: j.note }, source: j.source || 'ai', near: false });
  }, []);

  const run = useCallback((text: string) => {
    const s = text.trim().replace(/\s+/g, ' ');
    if (!s) return;
    if (!LOOKUP_RE.test(s)) { setErr('Yalnızca harf kullan (en fazla 40 karakter).'); return; }
    setErr('');
    setInput(s);
    setQ(s);
    try { history.replaceState(null, '', '?q=' + encodeURIComponent(s)); } catch { /* yok */ }
    metric('lookup');
    setRecent((prev) => {
      const next = [s, ...prev.filter((x) => x !== s)].slice(0, 8);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* yok */ }
      return next;
    });
    // Derslerde okunuşuyla bulunduysa yapay zekâya otomatik gidilmez (ücretsiz ve kesin sonuç)
    setLex(null);
    if (searchLocal(words, s).sound.length) { reqId.current++; setAi({ status: 'idle' }); }
    else void askAi(s);
  }, [words, askAi, metric]);

  // Adres çubuğundaki ?q= ile gelindiyse hemen ara
  // Geliştirme modunda etkiler iki kez çalışır: ilk arama yalnızca bir kez yapılsın (ve bir kez sayılsın)
  const started = useRef(false);
  useEffect(() => { if (initialQ && !started.current) { started.current = true; run(initialQ); } }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const aiCards: Card[] = ai.status === 'done'
    ? ai.data.results.map((r) => ({ ...r, topics: dictByAr.get(arKey(r.ar))?.topics }))
    : [];
  const hasLocal = local.sound.length + local.meaning.length > 0;
  const lexCards: Card[] = (lex?.data.results || []).map((r) => ({ ...r, topics: dictByAr.get(arKey(r.ar))?.topics }));

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Kelime bul</span>
        <h1 className="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Duyduğun kelimeyi yaz</h1>
        <p className="m-0 text-mute text-lg max-w-[680px] leading-relaxed">Arapça bir kelimeyi Latin harfleriyle, duyduğun gibi yaz: <i>ketebe</i>, <i>afvan</i>, <i>müderris</i>. Harekesi yanlış olsa da (<i>efvan</i>, <i>katabe</i>), şeddeyi yazmasan da bulur. Arapça harflerle de yazabilirsin.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); run(input); }} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <label className="flex-1 flex items-center gap-3 px-[18px] h-[58px] rounded-[14px] bg-s2 border border-line2 text-faint focus-within:border-lineh">
            <Raw html={I.search()} /><span className="sr-only">Kelime</span>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={40} autoComplete="off" autoCapitalize="none" spellCheck={false} enterKeyHint="search"
              placeholder="Örnek: ketebe, afvan, müderris" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink font-semibold text-lg placeholder:text-faint placeholder:font-medium" />
          </label>
          <button type="submit" disabled={ai.status === 'loading'} className="h-[58px] px-6 rounded-[14px] bg-acc text-onacc font-bold disabled:opacity-60">Bul</button>
        </div>
        {err && <p role="alert" className="m-0 text-sm text-bad">{err}</p>}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-faint">{recent.length ? 'Son aramaların:' : 'Dene:'}</span>
          {(recent.length ? recent : EXAMPLES).map((x) => (
            <button key={x} type="button" onClick={() => run(x)} className="px-3 h-8 rounded-full bg-s2 border border-line2 text-soft font-semibold hover:border-lineh hover:text-ink" dir="auto">{x}</button>
          ))}
        </div>
      </form>

      {q && (
        <div className="flex flex-col gap-6" aria-live="polite">
          {local.sound.length > 0 && (
            <Group title="Derslerde geçiyor" sub="Bu kelimeler derslerimizde var; anlamları kesin.">
              {local.sound.map((w) => <ResultCard key={w.ar + w.tr} c={{ ...w, root: '' }} />)}
            </Group>
          )}
          {local.meaning.length > 0 && (
            <Group title="Türkçe anlamı eşleşenler" sub={`"${q}" anlamına gelen ders kelimeleri.`}>
              {local.meaning.map((w) => <ResultCard key={w.ar + w.tr} c={{ ...w, root: '' }} />)}
            </Group>
          )}

          {lex && (
            <Group title={lex.near ? 'Bunu mu demek istedin?' : 'Sözlüğümüzden'} sub={lex.near ? 'Yazdığına tam uyan kelime yok; okunuşu en yakın olanlar.' : 'Kontrol edilmiş sözlüğümüzde bulundu.'}>
              {lexCards.map((c) => <ResultCard key={c.ar + c.tr} c={c} />)}
            </Group>
          )}
          {ai.status === 'idle' && (hasLocal || lex) && (
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border border-dashed border-line3">
              <span className="text-sm text-mute flex-1 min-w-[220px]">Aradığın bu değil mi? Yapay zekâ başka anlamları ve örnek cümleleri de bulabilir.</span>
              <button type="button" onClick={() => askAi(q, true)} className="h-10 px-4 rounded-xl bg-s2 border border-line3 text-soft font-semibold hover:border-lineh hover:text-ink inline-flex items-center gap-2"><Raw html={I.bulb(16)} /> Yapay zekâya sor</button>
            </div>
          )}

          {ai.status === 'loading' && (
            <div className="p-6 rounded-2xl bg-s1 border border-line flex items-center gap-3 text-mute" role="status">
              <span className="w-4 h-4 rounded-full border-2 border-acc border-t-transparent animate-spin" aria-hidden="true" /> Aranıyor, birkaç saniye sürebilir
            </div>
          )}
          {ai.status === 'login' && <AiLoginCard />}
          {ai.status === 'error' && <p role="alert" className="m-0 px-4 py-3 rounded-xl bg-badbg border border-badln text-bad">{ai.msg}</p>}
          {ai.status === 'done' && (
            <Group title="Yapay zekâ sonucu" sub={ai.source === 'cache' ? 'Bu kelime daha önce de arandı.' : undefined}>
              {aiCards.map((c) => <ResultCard key={c.ar + c.tr} c={c} />)}
              {!aiCards.length && <p className="m-0 p-6 rounded-2xl bg-s1 border border-line text-mute">Bu yazıma uyan bir kelime bulunamadı. Farklı bir yazımla dene (örneğin harekeleri değiştirerek).</p>}
              {ai.data.note && <p className="m-0 flex gap-2 text-[15px] text-prose leading-relaxed"><span className="text-acct shrink-0 mt-0.5"><Raw html={I.bulb(17)} /></span>{ai.data.note}</p>}
              <p className="m-0 text-xs text-faint">Yapay zekâ ile bulundu; nadiren hatalı olabilir. Derslerde geçen kelimeler işaretlidir.</p>
            </Group>
          )}
        </div>
      )}
    </div>
  );
}

function Group({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="m-0 text-lg font-bold">{title}</h2>
        {sub && <span className="text-sm text-mute2">{sub}</span>}
      </div>
      {children}
    </section>
  );
}

function ResultCard({ c }: { c: Card }) {
  const { tx } = useApp();
  const known = rootOf(c.ar);
  const rootLetters = known ? spaced(known.letters) : c.root || '';
  return (
    <article className="pop p-5 sm:p-6 rounded-[20px] bg-s3 border border-line flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-4 justify-between">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[22px] font-bold text-ink leading-snug">{c.tr}</span>
          <span className="text-sm text-mute2">
            <span className="tl">{c.tl}</span>{c.type && <>{c.tl ? ' · ' : ''}{c.type}</>}{c.en && <span className="en"> · EN: {c.en}</span>}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Raw html={tx.ar(c.ar, 'text-[40px] leading-tight text-ink')} />
          <SayBtn text={c.ar} cls="w-11 h-11" />
        </div>
      </div>
      {c.note && <p className="m-0 flex gap-2 text-[15px] text-prose leading-relaxed"><span className="text-acct shrink-0 mt-0.5"><Raw html={I.bulb(16)} /></span><Raw html={tx.text(c.note)} /></p>}
      {c.example?.ar && (
        <div className="flex items-center gap-3 flex-wrap p-3 rounded-xl bg-s1 border border-line">
          <SayBtn text={c.example.ar} cls="w-9 h-9" size={16} />
          <Raw html={tx.ar(c.example.ar, 'text-[22px] text-ink')} />
          <span className="text-[15px] text-soft">{c.example.tr}</span>
        </div>
      )}
      {(rootLetters || c.topics?.length) && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {rootLetters && (
            <span className="px-2.5 py-1 rounded-full bg-chip border border-chipln text-acct font-semibold inline-flex items-center gap-1.5">
              Kök <span lang="ar" dir="rtl" className="font-ar text-[14px]">{rootLetters}</span>{known && <span className="text-soft font-normal">· {known.meaning}</span>}
            </span>
          )}
          {known && known.tr.length > 0 && <span className="text-mute2">Türkçede: {known.tr.slice(0, 5).join(', ')}</span>}
          {c.topics?.map((t) => <Link key={t.id} href={`/konu?id=${t.id}`} className="px-2.5 py-1 rounded-full bg-okbg border border-okln text-okt text-xs font-semibold hover:text-ink">Derste: {t.name}</Link>)}
        </div>
      )}
    </article>
  );
}
