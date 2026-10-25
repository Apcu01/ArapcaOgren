'use client';

import { useState } from 'react';
import { useApp } from '../AppProvider';
import { I, Raw } from '../icons';

/** Önceden hazırlanmış sayfaları yeniden hazırlatır (komut satırından yapılan değişikliklerden sonra) */
export default function RefreshSiteButton() {
  const { toast } = useApp();
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    const r = await fetch('/api/admin/refresh', { method: 'POST' }).catch(() => null);
    setBusy(false);
    toast(r?.ok ? 'Site yenilendi: sayfalar bir sonraki ziyarette güncel içerikle hazırlanacak.' : 'Yenilenemedi.');
  }
  return (
    <button type="button" onClick={run} disabled={busy} title="Sözlük yükleme, ses üretimi gibi komut satırı işlerinden sonra sayfaları hemen günceller"
      className="h-10 px-4 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold inline-flex items-center gap-2 hover:border-lineh hover:text-ink disabled:opacity-60">
      <Raw html={I.refresh(15)} /> {busy ? 'Yenileniyor' : 'Siteyi yenile'}
    </button>
  );
}
