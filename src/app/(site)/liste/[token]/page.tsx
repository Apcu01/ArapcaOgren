import Link from 'next/link';
import { Ar, SayBtn } from '@/components/AppProvider';
import CopyShared from '@/components/lists/CopyShared';
import { getShared } from '@/lib/lists';

type Params = { params: Promise<{ token: string }> };

// Paylaşılan listeler gizli bağlantıyla açılır: arama motorlarına kapalı
export async function generateMetadata({ params }: Params) {
  const l = await getShared((await params).token);
  return {
    title: l ? `${l.title} (kelime listesi)` : 'Liste bulunamadı',
    description: l ? `${l.owner} tarafından paylaşılan ${l.count} kelimelik Arapça kelime listesi.` : undefined,
    robots: { index: false, follow: false }
  };
}

export default async function SharedListPage({ params }: Params) {
  const { token } = await params;
  const l = await getShared(token);
  if (!l) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <h1 className="m-0 text-[28px] font-bold">Bu liste artık paylaşılmıyor</h1>
        <p className="m-0 text-mute">Listenin sahibi paylaşımı kapatmış ya da bağlantıyı yenilemiş olabilir. Güncel bağlantıyı listenin sahibinden iste.</p>
        <Link href="/listelerim" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Listelerime git</Link>
      </div>
    );
  }
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
      <section className="flex flex-col gap-4 p-6 sm:p-8 rounded-[24px] bg-s3 border border-line">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Paylaşılan kelime listesi</span>
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[30px] sm:text-[38px] leading-tight font-bold tracking-tight break-words">{l.title}</h1>
          <span className="text-mute">{l.owner} paylaştı · {l.count} kelime{l.description ? ' · ' + l.description : ''}</span>
        </div>
        <p className="m-0 text-soft leading-relaxed max-w-[640px]">Listeyi kendi listelerine kopyala; kartlarla, adım adım öğrenerek, testlerle ve oyunlarla çalış. Kopya senin olur: istediğin gibi düzenleyebilirsin, ilerlemen yalnızca sende saklanır.</p>
        <div className="flex flex-wrap items-center gap-3">
          <CopyShared token={token} />
          {l.count >= 4 && <Link href={`/canli?paylasim=${token}`} className="h-12 px-5 rounded-xl border border-line3 bg-s2 text-ink font-semibold inline-flex items-center hover:text-ink hover:border-lineh">Bu listeyle canlı yarışma aç</Link>}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[22px] font-bold">Kelimeler ({l.count})</h2>
        <div className="flex flex-col gap-2">
          {l.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-5 px-4 sm:px-5 py-3 rounded-2xl bg-s4 border border-line3">
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-[16px] font-semibold text-ink break-words">{it.tr}</span>
                {it.note && <span className="text-xs text-faint">{it.note}</span>}
              </div>
              <div className="flex flex-col items-end">
                <Ar t={it.ar} className="text-[24px] text-ink leading-[1.5]" />
                {it.tl && <span className="tl text-xs text-mute">{it.tl}</span>}
              </div>
              <SayBtn text={it.ar} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
