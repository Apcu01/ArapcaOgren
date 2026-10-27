import Link from 'next/link';
import { READY_GROUPS, READY_LISTS } from '@/lib/ready-lists';

export const metadata = {
  title: 'Hazır kelime listeleri',
  description: 'Konu konu hazırlanmış Arapça kelime listeleri: selamlaşma, sık fiiller, zıt sıfatlar, meslekler, ev eşyaları, yiyecekler ve daha fazlası. Sesli, okunuşlu ve anlamlı.',
  alternates: { canonical: '/hazir-listeler' }
};

export default function ReadyListsPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Kelime listeleri</span>
        <h1 className="m-0 text-[34px] sm:text-[44px] leading-tight font-bold tracking-tight">Hazır listeler</h1>
        <p className="m-0 text-mute max-w-[680px] leading-relaxed">Konu konu derlenmiş Arapça kelime listeleri. Her kelimenin okunuşu, anlamı ve sesi var. Bir listeyi kendi listelerine kopyalayıp kartlarla, testlerle ve oyunlarla çalışabilir ya da sınıfınla canlı yarışma açabilirsin.</p>
      </div>
      {READY_GROUPS.map((g) => (
        <section key={g} className="flex flex-col gap-3" aria-labelledby={`g-${g}`}>
          <h2 id={`g-${g}`} className="m-0 text-[22px] font-bold">{g}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {READY_LISTS.filter((l) => l.group === g).map((l) => (
              <Link key={l.slug} href={`/hazir-listeler/${l.slug}`} className="cat flex flex-col gap-1.5 p-5 rounded-2xl bg-s4 border border-line3 text-ink hover:text-ink">
                <span className="text-[17px] font-bold">{l.title}</span>
                <span className="text-sm text-mute2 leading-snug">{l.description}</span>
                <span className="mt-1 text-xs font-semibold text-acct">{l.words.length} kelime</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
