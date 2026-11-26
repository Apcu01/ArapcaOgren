'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useApp } from './AppProvider';
import { AR_SIZES, RATES, THEMES, TXT_SIZES } from '@/lib/settings';
import { OPEN_SHORTCUTS } from './Shortcuts';
import { I, Raw } from './icons';
import Logo from './Logo';
import { clearPageCache } from './ServiceWorker';
import { OPEN_OFFLINE } from './Offline';
import { InstallButton } from './InstallApp';
import { NEWS_SEEN_EVENT, NEWS_SEEN_KEY } from '@/lib/news-shared';

export const SITE = 'ArapcaOgren';

/**
 * Yenilikler noktası: en yeni yazı bu tarayıcıda görülmediyse true.
 * Siteye ilk kez gelen (ilerlemesi olmayan) ziyaretçi için o ana kadarki yazılar "görüldü" sayılır: nokta yalnızca sonradan eklenenlerde çıkar.
 * Kaydı olmayan ama siteyi zaten kullanan ziyaretçi (Yenilikler sayfası açılmadan önce gelmiş olanlar) noktayı görür.
 */
function useNewsDot(latest: number) {
  const { ready, session, state } = useApp();
  // null: henüz okunmadı, -1: bu tarayıcıda hiç kayıt yok
  const [seen, setSeen] = useState<number | null>(null);
  useEffect(() => {
    const read = () => { try { const v = localStorage.getItem(NEWS_SEEN_KEY); setSeen(v == null ? -1 : Number(v) || 0); } catch { setSeen(latest); } };
    read();
    window.addEventListener(NEWS_SEEN_EVENT, read);
    window.addEventListener('storage', read);
    return () => { window.removeEventListener(NEWS_SEEN_EVENT, read); window.removeEventListener('storage', read); };
  }, [latest]);
  const loaded = ready && session !== 'loading';
  const fresh = !state.days.length && !Object.keys(state.progress).length;
  useEffect(() => {
    if (seen !== -1 || !loaded || !latest || !fresh) return;
    try { localStorage.setItem(NEWS_SEEN_KEY, String(latest)); } catch { /* depolama kapalı */ }
    setSeen(latest);
  }, [seen, loaded, latest, fresh]);
  if (!latest || seen === null) return false;
  return seen === -1 ? loaded && !fresh : latest > seen;
}

const NAV: [string, string, string][] = [
  ['/', 'Kategoriler', 'home'],
  ['/ilerleme', 'İlerlemem', 'progress'],
  ['/sozluk', 'Sözlük', 'dict'],
  ['/kelime-bul', 'Kelime bul', 'find'],
  ['/okuma', 'Okuma', 'read'],
  ['/listelerim', 'Listelerim', 'lists'],
  ['/canli', 'Yarışma', 'live'],
  ['/alfabe', 'Alfabe', 'abc'],
  ['/hatalarim', 'Hatalarım', 'mistakes']
];

function activeKey(path: string) {
  if (path.startsWith('/ilerleme')) return 'progress';
  if (path.startsWith('/sozluk') || path.startsWith('/zit-es-anlamlilar') || path.startsWith('/turkcedeki-arapca')) return 'dict';
  if (path.startsWith('/kelime-bul')) return 'find';
  if (path.startsWith('/okuma')) return 'read';
  if (path.startsWith('/listelerim')) return 'lists';
  if (path.startsWith('/canli')) return 'live';
  if (path.startsWith('/alfabe')) return 'abc';
  if (path.startsWith('/hatalarim')) return 'mistakes';
  if (path === '/' || path.startsWith('/konu')) return 'home';
  return '';
}

export default function Header({ news = 0 }: { news?: number }) {
  const { streak, settings, setSetting, user, mistakes, refreshSession, session, hint } = useApp();
  const path = usePathname() || '/';
  const router = useRouter();
  const active = activeKey(path);
  const newsDot = useNewsDot(news) && !path.startsWith('/yenilikler');
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
          {/* Telefonda yer dar: Yenilikler menünün içinde */}
          <Link href="/yenilikler" aria-label={newsDot ? 'Yenilikler: yeni duyuru var' : 'Yenilikler'} title="Yenilikler" aria-current={path.startsWith('/yenilikler') ? 'page' : undefined}
            className="hidden sm:flex relative w-11 h-11 rounded-full bg-chip border border-line3 text-ink items-center justify-center hover:text-ink hover:border-lineh">
            <Raw html={I.sparkle(19)} />
            {newsDot && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-acc border-2 border-head" aria-hidden="true" />}
          </Link>
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
            {open !== 'menu' && (mistakes.length > 0 || newsDot) && <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-head ${mistakes.length > 0 ? 'bg-bad' : 'bg-acc sm:hidden'}`} aria-hidden="true" />}
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
              <div className="mt-1 pt-1 border-t border-line grid grid-cols-2 gap-1">
                <Link href="/siniflar" className="flex items-center gap-2 px-4 h-11 rounded-xl text-[15px] font-semibold text-soft hover:text-ink hover:bg-s5"><Raw html={I.users(16)} /> Sınıflar</Link>
                <Link href="/lig" className="flex items-center gap-2 px-4 h-11 rounded-xl text-[15px] font-semibold text-soft hover:text-ink hover:bg-s5"><Raw html={I.trophy(16)} /> Haftalık lig</Link>
                <Link href="/yenilikler" className="col-span-2 flex items-center gap-2 px-4 h-11 rounded-xl text-[15px] font-semibold text-soft hover:text-ink hover:bg-s5">
                  <Raw html={I.sparkle(16)} /> Yenilikler
                  {newsDot && <span className="ml-auto px-2 h-[22px] rounded-full bg-chip border border-chipln text-acct text-[11px] font-bold inline-flex items-center">Yeni</span>}
                </Link>
              </div>
              <div className="mt-1 px-4 h-12 border-t border-line flex items-center gap-2 text-sm text-acct font-semibold">
                <Raw html={I.flame()} /> {streak} gün seri
                {!user && <Link href="/giris" className="ml-auto text-soft hover:text-ink">Giriş yap</Link>}
              </div>
              <InstallButton className="w-full flex items-center gap-3 px-4 h-12 rounded-xl border-t border-line text-[16px] font-semibold text-soft hover:text-ink hover:bg-s5" />
            </div>
          )}

          {open === 'settings' && (
            <div className="absolute right-0 top-14 z-50 w-[300px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-96px)] overflow-y-auto p-5 rounded-2xl bg-s4 border border-line3 shadow-2xl">
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
              <div className="pt-3 pb-1">
                <span className="text-[15px] font-semibold text-ink">Sayfa yazı boyutu</span>
                <div role="radiogroup" aria-label="Sayfa yazı boyutu" className="mt-2 grid grid-cols-3 gap-1 p-1 rounded-xl bg-s2 border border-line3">
                  {TXT_SIZES.map((l, i) => (
                    <button key={l} type="button" role="radio" aria-checked={settings.txtSize === i} onClick={() => setSetting('txtSize', i)}
                      className={`h-9 rounded-lg text-[13px] font-semibold ${settings.txtSize === i ? 'bg-acc text-onacc' : 'text-soft hover:text-ink'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="pt-3 pb-1">
                <span className="flex flex-col"><span className="text-[15px] font-semibold text-ink">Ses hızı</span><span className="text-xs text-faint">Kelime sesleri ve sesli okuma</span></span>
                <div role="radiogroup" aria-label="Ses hızı" className="mt-2 grid grid-cols-3 gap-1 p-1 rounded-xl bg-s2 border border-line3">
                  {RATES.map(([r, l]) => (
                    <button key={r} type="button" role="radio" aria-checked={settings.rate === r} onClick={() => setSetting('rate', r)} title={r + 'x'}
                      className={`h-9 rounded-lg text-[13px] font-semibold ${settings.rate === r ? 'bg-acc text-onacc' : 'text-soft hover:text-ink'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center justify-between gap-3 pt-4 pb-1 cursor-pointer">
                <span className="flex flex-col"><span className="text-[15px] font-semibold text-ink">Canlandırmaları azalt</span><span className="text-xs text-faint">Geçiş ve hareket efektleri kapanır</span></span>
                <input type="checkbox" checked={!settings.motion} onChange={(e) => setSetting('motion', !e.target.checked)} className="w-5 h-5 accent-acc" />
              </label>
              <button type="button" onClick={() => { setOpen(null); window.dispatchEvent(new Event(OPEN_SHORTCUTS)); }}
                className="mt-2 w-full h-10 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:border-lineh hover:text-ink inline-flex items-center justify-center gap-2">
                <Raw html={I.keyboard(16)} /> Klavye kısayolları <kbd className="px-1.5 rounded bg-s4 border border-line3 text-xs">?</kbd>
              </button>
              <p className="text-xs text-faint mt-3 leading-relaxed">
                {user ? 'İlerlemen hesabına kaydediliyor; her cihazdan devam edebilirsin.' : 'İlerlemen yalnızca bu tarayıcıda saklanır. Hesap açarsan her cihazdan devam edebilirsin.'}
              </p>
              <InstallButton className="mt-3 w-full h-10 rounded-xl bg-acc text-onacc text-sm font-bold inline-flex items-center justify-center gap-2" />
              <button type="button" onClick={() => { setOpen(null); window.dispatchEvent(new Event(OPEN_OFFLINE)); }} className="mt-3 w-full h-10 rounded-xl border border-line3 bg-s2 text-soft text-sm font-semibold hover:border-lineh hover:text-ink inline-flex items-center justify-center gap-2">
                <Raw html={I.download(16)} /> Çevrimdışı kullanım
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
              <Link href="/siniflar" className="flex items-center gap-3 px-3 h-11 rounded-xl text-soft hover:text-ink hover:bg-s5"><Raw html={I.users(17)} /> Sınıflarım</Link>
              <Link href="/lig" className="flex items-center gap-3 px-3 h-11 rounded-xl text-soft hover:text-ink hover:bg-s5"><Raw html={I.trophy(17)} /> Haftalık lig</Link>
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
