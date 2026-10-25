'use client';

/* "Hata bildir" düğmesi ve penceresi: soru, kelime ya da ders bölümündeki bir hatayı yöneticiye iletir */
import { useEffect, useRef, useState } from 'react';
import type { ReportContext } from '@/lib/types';
import { KIND_LABEL, REASONS_FOR, REPORT_REASONS, type ReportKind, type ReportReason } from '@/lib/report';
import { anonId, useApp } from './AppProvider';
import { I, Raw } from './icons';

export default function ReportButton({ topicId, kind, context, label = 'Hata bildir', className = '' }: {
  topicId: string;
  kind: ReportKind;
  context: ReportContext;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} title="Bu içerikte bir hata mı var?"
        className={`inline-flex items-center gap-1.5 text-[13px] text-faint hover:text-soft ${className}`}>
        <Raw html={I.flag(14)} /> {label}
      </button>
      {open && <ReportDialog topicId={topicId} kind={kind} context={context} onClose={() => setOpen(false)} />}
    </>
  );
}

function ReportDialog({ topicId, kind, context, onClose }: { topicId: string; kind: ReportKind; context: ReportContext; onClose: () => void }) {
  const { toast } = useApp();
  const reasons = REASONS_FOR[kind];
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>('input,button')?.focus();
    return () => prev?.focus();
  }, []);

  async function send() {
    if (!reason) { setErr('Bir neden seç.'); return; }
    if (reason === 'other' && !message.trim()) { setErr('Sorunu kısaca yaz.'); return; }
    setBusy(true);
    setErr('');
    const r = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId, kind, reason, message: message.trim() || undefined, anonId: anonId(), context })
    }).catch(() => null);
    setBusy(false);
    if (!r?.ok) {
      const j = await r?.json().catch(() => null) as { error?: string } | null;
      setErr(j?.error || 'Bildirim gönderilemedi. İnternet bağlantını kontrol et.');
      return;
    }
    toast('Teşekkürler! Bildirimin yöneticiye iletildi.');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[95] bg-black/60 flex items-end sm:items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Escape') onClose(); }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="rep-h" className="pop w-full max-w-[480px] rounded-3xl bg-s4 border border-line3 shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="rep-h" className="m-0 text-xl font-bold">Hata bildir</h2>
            <p className="m-0 text-sm text-mute">{KIND_LABEL[kind]}: <span className="text-soft">{context.label}</span></p>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className="w-10 h-10 shrink-0 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh" dangerouslySetInnerHTML={{ __html: I.x(16) }} />
        </div>
        <fieldset className="m-0 p-0 border-0 flex flex-col gap-2">
          <legend className="text-sm font-semibold text-soft mb-2">Sorun ne?</legend>
          {reasons.map((r) => (
            <label key={r} className={`flex items-center gap-3 px-4 h-12 rounded-xl border cursor-pointer ${reason === r ? 'bg-s5 border-acc text-ink' : 'bg-s2 border-line2 text-soft hover:border-lineh'}`}>
              <input type="radio" name="reason" checked={reason === r} onChange={() => { setReason(r); setErr(''); }} className="w-4 h-4 accent-acc" />
              <span className="text-[15px] font-semibold">{REPORT_REASONS[r]}</span>
            </label>
          ))}
        </fieldset>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-soft">Açıklama {reason === 'other' ? '' : <span className="text-faint font-normal">(isteğe bağlı)</span>}</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={3}
            placeholder="Örneğin: doğru cevap كَبِيرَةٌ olmalı."
            className="w-full px-4 py-3 rounded-xl bg-s2 border border-line3 text-ink text-[15px] leading-relaxed outline-none focus:border-acc resize-y" />
        </label>
        {err && <p className="m-0 text-sm text-bad" role="alert">{err}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Vazgeç</button>
          <button type="button" onClick={send} disabled={busy} className="h-11 px-6 rounded-xl bg-acc text-onacc font-bold disabled:opacity-60">{busy ? 'Gönderiliyor' : 'Gönder'}</button>
        </div>
      </div>
    </div>
  );
}
