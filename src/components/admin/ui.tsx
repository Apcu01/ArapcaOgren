// Yönetim paneli için küçük ortak parçalar (sitenin temasıyla aynı)
export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-1 min-w-0">
      <span className="text-sm text-mute2">{label}</span>
      <span className="text-[28px] font-bold leading-tight">{value}</span>
      {sub && <span className="text-xs text-faint">{sub}</span>}
    </div>
  );
}

export function Card({ title, children, right, className = '' }: { title?: React.ReactNode; children: React.ReactNode; right?: React.ReactNode; className?: string }) {
  return (
    <section className={`p-5 sm:p-6 rounded-[20px] bg-s1 border border-line flex flex-col gap-4 min-w-0 ${className}`}>
      {(title || right) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="m-0 text-lg font-bold">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Bar({ value, max, color = 'rgb(var(--c-acc))' }: { value: number; max: number; color?: string }) {
  const pct = max ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return <div className="h-2 rounded-full bg-line overflow-hidden flex-1"><div className="h-full rounded-full" style={{ width: pct + '%', background: color }} /></div>;
}

export const pct = (v: number | null | undefined) => (v == null ? '-' : '%' + Math.round(v * 100));
export const dt = (d: Date | string | null | undefined, withTime = false) =>
  d ? new Date(d).toLocaleString('tr-TR', withTime ? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
export const ago = (d: Date | string | null | undefined) => {
  if (!d) return 'hiç';
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 90) return 'az önce';
  if (s < 3600) return Math.round(s / 60) + ' dk önce';
  if (s < 86400) return Math.round(s / 3600) + ' sa önce';
  if (s < 86400 * 30) return Math.round(s / 86400) + ' gün önce';
  return dt(d);
};
export const scoreColor = (v: number) => (v >= 0.7 ? 'text-okt' : v >= 0.5 ? 'text-prog' : 'text-bad');
