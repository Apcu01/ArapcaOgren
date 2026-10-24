import Link from 'next/link';

export const metadata = { title: 'Çevrimdışı', robots: { index: false } };

export default function OfflinePage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-24 text-center flex flex-col gap-4 items-center">
      <h1 className="m-0 text-3xl font-bold">İnternet bağlantısı yok</h1>
      <p className="m-0 text-mute leading-relaxed">Bu sayfa henüz cihazına kaydedilmemiş. Daha önce açtığın dersler çevrimdışı da açılır. Ayarlar menüsündeki "Dersleri çevrimdışı için indir" düğmesiyle tüm dersleri önceden kaydedebilirsin.</p>
      <Link href="/" className="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold hover:text-onacc">Ana sayfaya dön</Link>
    </div>
  );
}
