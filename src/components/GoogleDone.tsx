'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useApp } from './AppProvider';
import { mergeGuestProgress } from './AuthForm';

// Google ile girişten sonra: misafir ilerlemesini hesaba aktar ve kaldığı sayfaya dön
export default function GoogleDone({ next }: { next: string }) {
  const router = useRouter();
  const { refreshSession } = useApp();
  useEffect(() => {
    (async () => {
      await mergeGuestProgress();
      await refreshSession();
      const safe = next.startsWith('/') && !next.startsWith('//') ? next : '/';
      router.replace(safe);
      router.refresh();
    })();
  }, [next, router, refreshSession]);
  return (
    <div className="max-w-[720px] mx-auto px-6 py-24 text-center flex flex-col gap-3 items-center">
      <h1 className="m-0 text-2xl font-bold">Giriş yapılıyor</h1>
      <p className="m-0 text-mute">Bir saniye, ilerlemen hesabına aktarılıyor.</p>
    </div>
  );
}
