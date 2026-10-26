'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useApp } from './AppProvider';
import { AR_SIZES, THEMES } from '@/lib/settings';
import { I, Raw } from './icons';
import Logo from './Logo';
import { clearPageCache, precacheAll } from './ServiceWorker';
import { InstallButton } from './InstallApp';

export const SITE = 'ArapcaOgren';

const NAV: [string, string, string][] = [
  ['/', 'Kategoriler', 'home'],
  ['/ilerleme', 'İlerlemem', 'progress'],
  ['/sozluk', 'Sözlük', 'dict'],
  ['/kelime-bul', 'Kelime bul', 'find'],
  ['/listelerim', 'Listelerim', 'lists'],
  ['/canli', 'Yarışma', 'live'],
  ['/alfabe', 'Alfabe', 'abc'],
  ['/hatalarim', 'Hatalarım', 'mistakes']
];

function activeKey(path: string) {
  if (path.startsWith('/ilerleme')) return 'progress';
  if (path.startsWith('/sozluk')) return 'dict';
  if (path.startsWith('/kelime-bul')) return 'find';
  if (path.startsWith('/listelerim')) return 'lists';
  if (path.startsWith('/canli')) return 'live';
  if (path.startsWith('/alfabe')) return 'abc';
  if (path.startsWith('/hatalarim')) return 'mistakes';
  if (path === '/' || path.startsWith('/konu')) return 'home';
  return '';
}

export default function Header() {
  const { streak, settings, setSetting, user, mistakes, toast, refreshSession, session, hint } = useApp();
  const [offline, setOffline] = useState<'idle' | 'busy' | 'done'>('idle');
  async function downloadAll() {
    setOffline('busy');
    const okStart = await precacheAll((n, total) => { setOffline('done'); toast(`${n} / ${total} sayfa çevrimdışı kullanım için kaydedildi.`); }).catch(() => false);
    if (!okStart) { setOffline('idle'); toast('Çevrimdışı kullanım için siteyi bir kez yayındaki adresinden (https) açman gerekir.'); }
  }
  const path = usePathname() || '/';
  const router = useRouter();
  const active = activeKey(path);
  const [open, setOpen] = useState<'settings' | 'account' | 'menu' | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // composedPath tıklama anındaki yolu verir: tıklanan simge yeniden çizilip sayfadan kalksa bile (menü / çarpı) doğru çalışır
    const h = (e: MouseEvent) => { if (wrap.current && !e.composedPath().includes(wrap.current)) setOpen(null); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('click', h);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('click', h); document.removeEventListener('keydown', k); };
  }, []);
  useEffect(() => setOpen(null), [path]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearPageCache();
    await refreshSession();
    setOpen(null);
    router.push('/');
    router.refresh();
  }

  const rows: ['harakat' | 'tl' | 'en', string, string][] = [
    ['harakat', 'Harekeleri göster', 'بَيْتٌ / بيت'],
    ['tl', 'Okunuşu göster', 'kitâbun'],
    ['en', 'İngilizce karşılıkları göster', 'a book']
  ];

  return (
    <header className="border-b border-line bg-head">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-[18px] flex flex-wrap gap-4 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-ink hover:text-ink">
          <Logo size={44} className="shrink-0" />
          <span className="font-bold text-lg tracking-tight">{SITE}</span>
        </Link>
        <nav className="nav hidden xl:flex flex-wrap gap-x-4 xl:gap-x-5 gap-y-2 text-[15px] font-medium" aria-label="Ana menü">
          {NAV.map(([h, l, k]) => (
            <Link key={k} href={h} className={`${k === active ? 'is-active' : ''} inline-flex items-center gap-1.5`} aria-current={k === active ? 'page' : undefined}>
              {l}
              {k === 'mistakes' && mistakes.length > 0 && <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-badbg border border-badln text-bad text-[11px] font-bold inline-flex items-center justify-center" aria-label={`${mistakes.length} hata`}>{mistakes.length > 99 ? '99+' : mistakes.length}</span>}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 relative" ref={wrap}>
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-pill border border-track text-sm text-acct font-semibold" title="Art arda çalıştığın gün sayısı">
            <Raw html={I.flame()} /> {streak}<span className="hidden 2xl:inline"> gün</span>
          </div>
          <button
            type="button"
            aria-label="Görünüm ayarları"
            aria-expanded={open === 'settings'}
            onClick={() => setOpen(open === 'settings' ? null : 'settings')}
            className="w-11 h-11 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh"
            dangerouslySetInnerHTML={{ __html: I.gear() }}
          />
          {/* Oturum gelene kadar son üyenin adı gösterilir (sayfalar önceden hazırlandığı için oturum tarayıcıda yüklenir) */}
          {(user ?? (session === 'loading' ? hint : null)) ? (
            <button
              type="button"
              aria-label="Hesap menüsü"
              aria-expanded={open === 'account'}
              onClick={() => setOpen(open === 'account' ? null : 'account')}
              className="w-11 h-11 rounded-full bg-chip border border-line3 text-ink font-semibold text-[15px] hover:border-lineh"
            >
              {((user ?? hint)!.name.trim()[0] || 'A').toLocaleUpperCase('tr')}
            </button>
          ) : (
            <Link href="/giris" aria-label="Giriş yap" className="h-11 w-11 sm:w-auto sm:px-4 justify-center rounded-full bg-chip border border-line3 text-ink text-sm font-semibold inline-flex items-center gap-2 hover:text-ink hover:border-lineh">
              <Raw html={I.user(17)} /> <span className="hidden sm:inline">Giriş yap</span>
            </Link>
          )}
          {/* Mobilde menü bağlantıları hamburger düğmesinin altında */}
          <button
            type="button"
            aria-label={open === 'menu' ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={open === 'menu'}
            aria-controls="mobil-menu"
            onClick={() => setOpen(open === 'menu' ? null : 'menu')}
            className="xl:hidden relative w-11 h-11 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh"
          >
            <Raw html={open === 'menu' ? I.x(18) : I.menu(20)} />
            {open !== 'menu' && mistakes.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-bad border-2 border-head" aria-hidden="true" />}
          </button>

          {open === 'menu' && (
            <div id="mobil-menu" className="xl:hidden absolute right-0 top-14 z-50 w-[calc(100vw-32px)] max-w-[360px] p-2 rounded-2xl bg-s4 border border-line3 shadow-2xl">
              <nav aria-label="Ana menü" className="flex flex-col">
                {NAV.map(([h, l, k]) => (
                  <Link key={k} href={h} aria-current={k === active ? 'page' : undefined}
                    className={`flex items-center justify-between gap-3 px-4 h-12 rounded-xl text-[16px] font-semibold ${k === active ? 'bg-s5 text-ink' : 'text-soft hover:text-ink hover:bg-s5'}`}>
                    {l}
                    {k === 'mistakes' && mistakes.length > 0 && <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-badbg border border-badln text-bad text-[11px] font-bold inline-flex items-center justify-center">{mistakes.length > 99 ? '99+' : mistakes.length}</span>}
                  </Link>
                ))}
              </nav>
              <div className="mt-1 px-4 h-12 border-t border-line flex items-center gap-2 text-sm text-acct font-semibold">
                <Raw html={I.flame()} /> {streak} gün seri
                {!user && <Link href="/giris" className="ml-auto text-soft hover:text-ink">Giriş yap</Link>}
              </div>
              <InstallButton className="w-full flex items-center gap-3 px-4 h-12 rounded-xl border-t border-line text-[16px] font-semibold text-soft hover:text-ink hover:bg-s5" />
            </div>
          )}

          {open === 'settings' && (
            <div className="absolute right-0 top-14 z-50 w-[290px] p-5 rounded-2xl bg-s4 border border-line3 shadow-2xl">
              <p className="text-xs font-bold tracking-[.1em] uppercase text-lab mb-3">Görünüm</p>
              <div className="pb-2">
                <span className="text-[15px] font-semibold text-ink">Tema</span>
                <div role="radiogroup" aria-label="Tema" className="mt-2 grid grid-cols-3 gap-1 p-1 rounded-xl bg-s2 border border-line3">
                  {THEMES.map(([t, l]) => (
                    <button key={t} type="button" role="radio" aria-checked={settings.theme === t} onClick={() => setSetting('theme', t)}
                      className={'h-9 rounded-lg text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 ' + (settings.theme === t ? 'bg-acc text-onacc' : 'text-soft hover:text-ink')}>
                      <Raw html={t === 'dark' ? I.moon(14) : t === 'light' ? I.sun(14) : I.monitor(14)} /> {l}
                    </button>
                  ))}
                </div>
              </div>
              {rows.map(([k, l, h]) => (
                <label key={k} className="flex items-center justify-between gap-3 py-2.5 cursor-pointer">
                  <span className="flex flex-col"><span className="text-[15px] font-semibold text-ink">{l}</span><span className="text-xs text-faint">{h}</span></span>
                  <input type="checkbox" checked={settings[k]} onChange={(e) => setSetting(k, e.target.checked)} className="w-5 h-5 accent-acc" />
                </label>
              ))}
              <div className="pt-3 pb-1">
                <span className="flex items-baseline justify-between gap-3"><span className="text-[15px] font-semibold text-ink">Arapça yazı boyutu</span><span lang="ar" dir="rtl" className="ar text-faint">عَرَبِيّ</span></span>
                <div role="radiogroup" aria-label="Arapça yazı boyutu" className="mt-2 grid grid-cols-3 gap-1 p-1 rounded-xl bg-s2 border border-line3">
                  {AR_SIZES.map((l, i) => (
                    <button key={l} type="button" role="radio" aria-checked={settings.arSize === i} onClick={() => setSetting('arSize', i)}
                      className={`h-9 rounded-lg text-[13px] font-semibold ${settings.arSize === i ? 'bg-acc text-onacc' : 'text-soft hover:text-ink'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-faint mt-3 leading-relaxed">
                {user ? 'İlerlemen hesabına kaydediliyor; her cihazdan devam edebilirsin.' : 'İlerlemen yalnızca bu tarayıcıda saklanır. Hesap açarsan her cihazdan devam edebilirsin.'}
              </p>
              <InstallButton className="mt-3 w-full h-10 rounded-xl bg-acc text-onacc text-sm font-bold inline-flex items-center justify-center gap-2" />
              <button type="button" onClick={downloadAll} disabled={offline === 'busy'} className="mt-3 w-full h-10 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:border-lineh disabled:opacity-60">
                {offline === 'busy' ? 'Dersler indiriliyor' : offline === 'done' ? 'Dersler çevrimdışı kullanılabilir' : 'Dersleri çevrimdışı için indir'}
              </button>
            </div>
          )}

          {open === 'account' && user && (
            <div className="absolute right-0 top-14 z-50 w-[270px] p-2 rounded-2xl bg-s4 border border-line3 shadow-2xl">
              <div className="px-3 py-3 border-b border-line mb-1">
                <p className="m-0 font-bold text-ink truncate">{user.name}</p>
                <p className="m-0 text-xs text-faint truncate">{user.email}</p>
              </div>
              <Link href="/hesap" className="flex items-center gap-3 px-3 h-11 rounded-xl text-soft hover:text-ink hover:bg-s5"><Raw html={I.user(17)} /> Hesabım</Link>
              <Link href="/ilerleme" className="flex items-center gap-3 px-3 h-11 rounded-xl text-soft hover:text-ink hover:bg-s5"><Raw html={I.check(17)} /> İlerlemem</Link>
              <Link href="/listelerim" className="flex items-center gap-3 px-3 h-11 rounded-xl text-soft hover:text-ink hover:bg-s5"><Raw html={I.list(17)} /> Listelerim</Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-3 px-3 h-11 rounded-xl text-soft hover:text-ink hover:bg-s5"><Raw html={I.shield(17)} /> Yönetim paneli</Link>
              )}
              <button type="button" onClick={logout} className="w-full flex items-center gap-3 px-3 h-11 rounded-xl text-bad hover:bg-badbg text-left"><Raw html={I.logout(17)} /> Çıkış yap</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-7 text-center text-sm text-faint">
      © {new Date().getFullYear()} {SITE} · <span lang="ar" className="font-ar text-[17px] text-mute">تَعَلَّمِ العَرَبِيَّةَ</span>
    </footer>
  );
}
