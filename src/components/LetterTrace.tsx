'use client';

/* Harf çizme: harfin silik biçiminin üzerinden parmakla ya da fareyle geçilir; çizim harfin şekliyle karşılaştırılır */
import { useCallback, useEffect, useRef, useState } from 'react';
import { LETTERS } from '@/lib/alphabet';
import { I, Raw } from './icons';
import { useApp } from './AppProvider';

const Z = '‍'; // birleşik biçimler için sıfır genişlikli birleştirici
const FORMS = ['Tek', 'Başta', 'Ortada', 'Sonda'] as const;
const formOf = (c: string, joins: boolean, f: number) => (f === 0 ? c : f === 1 ? (joins ? c + Z : c) : f === 2 ? (joins ? Z + c + Z : Z + c) : Z + c);
const SIZE = 320; // CSS pikseli
const PEN = 18; // kalem kalınlığı
const DONE_KEY = 'arblearn:trace';

type Result = { cover: number; inside: number; verdict: 'ok' | 'more' | 'out' | 'empty' };

const cssColor = (name: string) => `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--c-' + name).trim()})`;

/** Harfi verilen tuvale ortalayarak yazar; kalınlık verilirse kenarlarını da o kadar genişletir */
function drawGlyph(ctx: CanvasRenderingContext2D, text: string, color: string, widen = 0) {
  ctx.save();
  ctx.font = `${SIZE * 0.62}px "Noto Sans Arabic"`;
  ctx.direction = 'rtl';
  ctx.textBaseline = 'alphabetic';
  const m = ctx.measureText(text);
  const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const x = (SIZE - w) / 2 + m.actualBoundingBoxLeft;
  const y = (SIZE - h) / 2 + m.actualBoundingBoxAscent;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  if (widen) {
    ctx.strokeStyle = color;
    ctx.lineWidth = widen;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
  }
  ctx.restore();
}

/** Harfin ne kadarının çizildiği ve çizimin ne kadarının harfin üstünde kaldığı */
function score(strokes: HTMLCanvasElement, text: string): Result {
  const make = () => { const c = document.createElement('canvas'); c.width = SIZE; c.height = SIZE; return c; };
  const read = (c: HTMLCanvasElement) => c.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, SIZE, SIZE).data;
  // Kullanıcının çizimi (tek ölçekte)
  const user = make();
  user.getContext('2d')!.drawImage(strokes, 0, 0, SIZE, SIZE);
  // Harfin kendisi ve kalem kalınlığı kadar genişletilmiş hâli
  const glyph = make(); drawGlyph(glyph.getContext('2d')!, text, '#000');
  const wide = make(); drawGlyph(wide.getContext('2d')!, text, '#000', PEN * 1.6);
  // Kullanıcı çizimini kalem kalınlığı kadar genişlet (her yöne kaydırarak üst üste çiz): harfin içini doldurmak gerekmesin
  const reach = make();
  const rc = reach.getContext('2d')!;
  for (const d of [PEN / 3, (PEN * 2) / 3]) for (let k = 0; k < 8; k++) rc.drawImage(user, Math.cos((k * Math.PI) / 4) * d, Math.sin((k * Math.PI) / 4) * d);
  rc.drawImage(user, 0, 0);
  const [u, g, wd, r] = [read(user), read(glyph), read(wide), read(reach)];
  let gN = 0, gHit = 0, uN = 0, uIn = 0;
  for (let i = 3; i < u.length; i += 16) { // her 4 pikselden biri yeterli
    if (g[i] > 128) { gN++; if (r[i] > 20) gHit++; }
    if (u[i] > 128) { uN++; if (wd[i] > 128) uIn++; }
  }
  if (uN < 30) return { cover: 0, inside: 0, verdict: 'empty' };
  const cover = gN ? gHit / gN : 0;
  const inside = uIn / uN;
  return { cover, inside, verdict: inside < 0.75 ? 'out' : cover < 0.7 ? 'more' : 'ok' };
}

export default function LetterTrace() {
  const { speak } = useApp();
  const [li, setLi] = useState(1);
  const [form, setForm] = useState(0);
  const [guide, setGuide] = useState(true);
  const [res, setRes] = useState<Result | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [drawn, setDrawn] = useState(false);
  const bg = useRef<HTMLCanvasElement>(null);
  const pad = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);

  const L = LETTERS[li];
  const joins = L[5];
  const text = formOf(L[0], joins, form);
  const id = L[0] + form;

  useEffect(() => {
    try { setDone(new Set(JSON.parse(localStorage.getItem(DONE_KEY) || '[]'))); } catch { /* yok */ }
  }, []);

  const setup = (c: HTMLCanvasElement | null) => {
    if (!c) return null;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== SIZE * dpr) { c.width = SIZE * dpr; c.height = SIZE * dpr; }
    const ctx = c.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  };

  const paintGuide = useCallback(async () => {
    try { await document.fonts.load(`${SIZE * 0.62}px "Noto Sans Arabic"`, text); } catch { /* yazı tipi yüklenemezse varsayılanla çiz */ }
    const ctx = setup(bg.current);
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    // Ortadaki taban çizgisi yön bulmayı kolaylaştırır
    ctx.strokeStyle = cssColor('line2');
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(16, SIZE / 2); ctx.lineTo(SIZE - 16, SIZE / 2); ctx.stroke();
    ctx.setLineDash([]);
    if (guide) drawGlyph(ctx, text, cssColor('line3'));
  }, [text, guide]);

  const clear = useCallback(() => {
    const ctx = setup(pad.current);
    ctx?.clearRect(0, 0, SIZE, SIZE);
    setRes(null);
    setDrawn(false);
  }, []);

  useEffect(() => { void paintGuide(); }, [paintGuide]);
  useEffect(() => { clear(); }, [li, form, clear]);
  // Tema değişince kılavuz rengi güncellensin
  useEffect(() => {
    const o = new MutationObserver(() => void paintGuide());
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => o.disconnect();
  }, [paintGuide]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  }
  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = pos(e);
    line(last.current, last.current);
    setRes(null);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!last.current) return;
    const p = pos(e);
    line(last.current, p);
    last.current = p;
  }
  function up() { last.current = null; }
  function line(a: { x: number; y: number }, b: { x: number; y: number }) {
    const ctx = setup(pad.current);
    if (!ctx) return;
    ctx.strokeStyle = cssColor('acc');
    ctx.lineWidth = PEN;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    setDrawn(true);
  }

  async function check() {
    if (!pad.current) return;
    try { await document.fonts.load(`${SIZE * 0.62}px "Noto Sans Arabic"`, text); } catch { /* yok */ }
    const r = score(pad.current, text);
    setRes(r);
    if (r.verdict === 'ok') {
      const next = new Set(done).add(id);
      setDone(next);
      try { localStorage.setItem(DONE_KEY, JSON.stringify([...next])); } catch { /* yok */ }
    }
  }

  function nextLetter() {
    const forms = joins ? [0, 1, 2, 3] : [0, 3];
    const n = forms.find((f) => f > form);
    if (n !== undefined) setForm(n);
    else { setForm(0); setLi((li + 1) % LETTERS.length); }
  }

  const doneCount = LETTERS.filter((l) => [0, 1, 2, 3].some((f) => done.has(l[0] + f))).length;
  const msg: Record<Result['verdict'], [string, string]> = {
    ok: ['Harika, harfi doğru çizdin!', 'bg-okbg border-okln text-okt'],
    more: ['Güzel başlangıç ama harfin bir kısmı eksik kaldı. Noktaları da unutma.', 'bg-progbg border-progln text-prog'],
    out: ['Çizginin bir kısmı harfin dışına taştı. Silik harfin üzerinden gitmeyi dene.', 'bg-badbg border-badln text-bad'],
    empty: ['Önce harfi çiz, sonra kontrol et.', 'bg-s2 border-line2 text-soft']
  };

  return (
    <section className="flex flex-col gap-5" aria-labelledby="ciz-h">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1 max-w-[720px]">
          <h2 id="ciz-h" className="m-0 text-2xl font-bold">Harf yazma alıştırması</h2>
          <p className="m-0 text-mute leading-relaxed">Silik harfin üzerinden parmağınla ya da fareyle geç. Arapça <b className="text-ink">sağdan sola</b> yazılır: önce harfin gövdesini, en son noktalarını çiz. Alıştıkça kılavuzu gizleyip ezberden dene.</p>
        </div>
        <span className="text-sm text-faint">{doneCount} / {LETTERS.length} harf çizildi</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4 min-w-0 order-2 lg:order-1">
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Harf seç" dir="rtl">
            {LETTERS.map((l, i) => {
              const ok = [0, 1, 2, 3].some((f) => done.has(l[0] + f));
              return (
                <button key={l[0]} type="button" role="radio" aria-checked={li === i} aria-label={l[1]} onClick={() => { setLi(i); setForm(0); }}
                  className={`relative w-11 h-11 rounded-xl border font-ar text-[22px] leading-none ${li === i ? 'bg-acc text-onacc border-acc' : ok ? 'bg-okbg text-okt border-okln' : 'bg-s2 text-ink border-line2 hover:border-lineh'}`}>
                  {l[0]}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Biçim">
            {FORMS.map((f, i) => {
              // Bitişmeyen harflerin baştaki ve ortadaki biçimi, tek ve sondaki biçimle aynıdır
              const off = !joins && (i === 1 || i === 2);
              return (
                <button key={f} type="button" role="radio" aria-checked={form === i} disabled={off} onClick={() => setForm(i)}
                  className={`h-10 px-4 rounded-full text-sm font-semibold border inline-flex items-center gap-2 disabled:opacity-40 ${form === i ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line2 hover:border-lineh'}`}>
                  {f} <span className="font-ar text-[18px]" lang="ar">{formOf(L[0], joins, i)}</span>
                  {done.has(L[0] + i) && <Raw html={I.check(14)} />}
                </button>
              );
            })}
          </div>
          <div className="p-4 rounded-2xl bg-s1 border border-line flex flex-col gap-2">
            <span className="flex items-baseline gap-3"><span className="text-xl font-bold">{L[1]}</span><span className="text-acct font-semibold">{L[3]}</span>
              <button type="button" onClick={() => speak(L[2])} className="ml-auto inline-flex items-center gap-1.5 text-sm text-soft hover:text-ink"><Raw html={I.speaker(16)} /> Adını dinle</button></span>
            <span className="text-sm text-mute2 leading-relaxed">{form === 0 ? 'Tek başına yazılış.' : form === 1 ? 'Kelimenin başında: soldaki harfe bağlanır.' : form === 2 ? 'Kelimenin ortasında: iki yanındaki harfe bağlanır.' : 'Kelimenin sonunda: yalnızca sağdaki harfe bağlanır.'}{!joins && form > 0 ? ' Bu harf soldaki harfe bitişmez.' : ''}</span>
          </div>
          {res && <p className={`pop m-0 px-4 py-3 rounded-xl border font-semibold ${msg[res.verdict][1]}`} aria-live="polite">{msg[res.verdict][0]}</p>}
        </div>

        <div className="flex flex-col items-center gap-3 order-1 lg:order-2">
          <div className="relative rounded-3xl bg-s4 border border-line3 overflow-hidden touch-none select-none" style={{ width: 'min(320px, calc(100vw - 32px))', aspectRatio: '1' }}>
            <canvas ref={bg} className="absolute inset-0 w-full h-full" aria-hidden="true" />
            <canvas ref={pad} className="absolute inset-0 w-full h-full cursor-crosshair touch-none" aria-label={`${L[1]} harfini çizme alanı`}
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={clear} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh inline-flex items-center gap-2"><Raw html={I.refresh(16)} /> Temizle</button>
            <button type="button" onClick={() => setGuide(!guide)} aria-pressed={!guide} className="h-11 px-4 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">{guide ? 'Kılavuzu gizle' : 'Kılavuzu göster'}</button>
            {res?.verdict === 'ok'
              ? <button type="button" onClick={nextLetter} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Sıradaki <Raw html={I.arrow()} /></button>
              : <button type="button" onClick={check} disabled={!drawn} className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold disabled:opacity-50">Kontrol et</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
