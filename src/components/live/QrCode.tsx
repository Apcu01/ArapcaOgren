'use client';

/* Karekod: yarışmaya katılma bağlantısı. Okunabilmesi için temadan bağımsız beyaz zemin ve kenar boşluğu */
import qrcode from 'qrcode-generator';
import { useMemo } from 'react';

export default function QrCode({ text, size = 240, label }: { text: string; size?: number; label: string }) {
  const { path, n } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return { path: d, n: count };
  }, [text]);
  const pad = 4;
  return (
    <svg viewBox={`${-pad} ${-pad} ${n + pad * 2} ${n + pad * 2}`} width={size} height={size} role="img" aria-label={label}
      shapeRendering="crispEdges" className="rounded-2xl shrink-0">
      <rect x={-pad} y={-pad} width={n + pad * 2} height={n + pad * 2} fill="#fff" />
      <path d={path} fill="#111" />
    </svg>
  );
}
