import Link from 'next/link';
import Header, { Footer } from '@/components/Header';
import { I, Raw } from '@/components/icons';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="app" className="flex-1">
        <div className="max-w-[720px] mx-auto px-6 py-24 text-center flex flex-col gap-4 items-center">
          <span className="font-ar text-[64px] leading-none text-acct">؟</span>
          <h1 className="m-0 text-3xl font-bold">Sayfa bulunamadı</h1>
          <p className="m-0 text-mute">Aradığın sayfa mevcut değil ya da adresi değişmiş olabilir.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold hover:text-onacc">Kategorilere dön <Raw html={I.arrow()} /></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
