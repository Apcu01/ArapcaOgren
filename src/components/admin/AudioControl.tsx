'use client';

import { useRef, useState } from 'react';
import { audioKey } from '@/lib/text';
import { I } from '../icons';

export type AudioMap = Record<string, number>;

/** Bir Arapça metin için ses yükleme / mikrofondan kaydetme / dinleme / silme */
export default function AudioControl({ text, map, onChange, compact = false }: {
  text: string;
  map: AudioMap;
  onChange: (key: string, id: number | null) => void;
  compact?: boolean;
}) {
  const key = audioKey(text);
  const id = key ? map[key] : undefined;
  const [busy, setBusy] = useState(false);
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(blob: Blob, name: string) {
    setBusy(true); setErr('');
    const fd = new FormData();
    fd.set('text', text);
    fd.set('file', new File([blob], name, { type: blob.type }));
    const r = await fetch('/api/admin/audio', { method: 'POST', body: fd });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(j.error || 'Yüklenemedi.'); return; }
    onChange(j.textKey, j.id);
  }
  async function startRec() {
    setErr('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', 'audio/mp4'].find((m) => MediaRecorder.isTypeSupported(m)) || '';
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRec(null);
        const blob = new Blob(chunks, { type: (mr.mimeType || 'audio/webm').split(';')[0] });
        upload(blob, 'kayit.' + (blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm'));
      };
      mr.start();
      setRec(mr);
    } catch { setErr('Mikrofona erişilemedi.'); }
  }
  async function remove() {
    if (!id || !confirm('Bu ses kaydı silinsin mi?')) return;
    setBusy(true);
    const r = await fetch(`/api/admin/audio/${id}`, { method: 'DELETE' });
    setBusy(false);
    if (r.ok) onChange(key, null);
  }

  if (!key) return null;
  const btn = 'h-9 px-3 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50';
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {id ? (
        <>
          <button type="button" className={`${btn} border-okln bg-okbg text-okt`} onClick={() => new Audio(`/api/audio/${id}`).play().catch(() => null)} title="Kayıtlı sesi dinle">
            <span dangerouslySetInnerHTML={{ __html: I.speaker(14) }} />{!compact && 'Ses var'}
          </button>
          <button type="button" className={`${btn} border-badln text-bad`} disabled={busy} onClick={remove} aria-label="Sesi sil" title="Sesi sil" dangerouslySetInnerHTML={{ __html: I.trash(14) }} />
        </>
      ) : null}
      {rec ? (
        <button type="button" className={`${btn} border-badln bg-badbg text-bad animate-pulse`} onClick={() => rec.stop()}>Kaydı bitir</button>
      ) : (
        <button type="button" className={`${btn} border-line3 bg-s2 text-soft hover:text-ink`} disabled={busy} onClick={startRec} title="Mikrofondan kaydet">
          {busy ? 'Yükleniyor' : id ? 'Yeniden kaydet' : 'Kaydet'}
        </button>
      )}
      <button type="button" className={`${btn} border-line3 bg-s2 text-soft hover:text-ink`} disabled={busy || !!rec} onClick={() => fileRef.current?.click()} title="Ses dosyası yükle">
        {id ? 'Değiştir' : 'Dosya yükle'}
      </button>
      <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, f.name); e.target.value = ''; }} />
      {err && <span className="text-xs text-bad">{err}</span>}
    </span>
  );
}
