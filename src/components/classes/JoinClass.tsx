'use client';

/* Katılma bağlantısı (/sinif/katil?kod=ABC234): giriş yapmışsa hemen katılır, yapmamışsa girişten sonra buraya döner */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppProvider';
import { jsonFetch } from '../lists/useList';
import { Loading } from '../lists/parts';
import { ClassLogin } from './ClassesView';
import { isCode, normCode } from '@/lib/class-shared';

export default function JoinClass() {
  const { user, session, toast } = useApp();
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const tried = useRef(false);
  useEffect(() => setCode(normCode(new URLSearchParams(location.search).get('kod') || '')), []);
  useEffect(() => {
    if (session !== 'ready' || !user || code == null || tried.current) return;
    tried.current = true;
    if (!isCode(code)) { setErr('Bağlantıdaki katılma kodu geçersiz.'); return; }
    jsonFetch<{ id: number; already?: boolean; name?: string }>('/api/classes', { method: 'POST', body: JSON.stringify({ action: 'join', code }) }).then((r) => {
      if (!r.ok) {
        // Öğretmen kendi bağlantısını açtıysa sınıfına götür
        const own = r.status === 409;
        if (own) { router.replace('/siniflar'); return; }
        setErr(r.error); return;
      }
      toast(r.data.already ? 'Zaten bu sınıftasın.' : `${r.data.name || 'Sınıfa'} katıldın!`);
      router.replace('/siniflar/' + r.data.id);
    });
  }, [session, user, code, router, toast]);

  if (session === 'loading' || code == null) return <Loading />;
  if (!user) return <ClassLogin next={`/sinif/katil?kod=${code}`} />;
  if (err) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <h1 className="m-0 text-[28px] font-bold">Sınıfa katılınamadı</h1>
        <p className="m-0 text-mute">{err}</p>
        <Link href="/siniflar" className="h-11 px-5 rounded-xl bg-acc text-onacc font-bold inline-flex items-center hover:text-onacc">Kodu elle yaz</Link>
      </div>
    );
  }
  return <Loading />;
}
