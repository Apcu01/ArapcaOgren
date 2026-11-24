// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider, useApp } from '@/components/AppProvider';
import Player from '@/components/Player';
import { actsOf } from '@/lib/text';
import type { Activity, Word } from '@/lib/types';

vi.mock('next/navigation', () => ({ usePathname: () => '/konu', useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }) }));

// Ses eşlemesi artık sayfaya gömülmüyor: AppProvider /api/audio/map?v= adresinden bir kez indiriyor.
// Anahtarlar harekesiz yazılış (audioKey); numaralar ses kaydının adresi (/api/audio/<numara>).
const MAP = { 'كتاب': 5, 'باب': 9 };

let played: string[];
let spoken: string[];
let mapRequests: string[];
/** Eşleme isteğini elle bitirmek için: resolveMap() çağrılana kadar yanıt gelmez */
let resolveMap: () => void;

function mockFetch(delayed: boolean) {
  global.fetch = vi.fn((input: RequestInfo | URL) => {
    const url = String(input);
    if (url.startsWith('/api/audio/map')) {
      mapRequests.push(url);
      const res = () => new Response(JSON.stringify(MAP), { headers: { 'Content-Type': 'application/json' } });
      if (!delayed) return Promise.resolve(res());
      return new Promise<Response>((ok) => { resolveMap = () => ok(res()); });
    }
    return Promise.resolve(new Response('{}'));
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  localStorage.clear();
  played = []; spoken = []; mapRequests = [];
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    played.push(new URL(this.src).pathname);
    return Promise.resolve();
  });
  vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: { speak: (u: { text: string }) => spoken.push(u.text), cancel: () => {}, getVoices: () => [], onvoiceschanged: null }
  });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(public text: string) {} } });
});
afterEach(() => vi.restoreAllMocks());

let app: ReturnType<typeof useApp>;
function Probe() {
  app = useApp();
  return <span data-testid="ready">{app.audioReady ? 'hazır' : 'bekliyor'}</span>;
}

describe('ses eşlemesi ayrı indirilir', () => {
  it('sürümlü adresten bir kez istenir; gelince gerçek kayıt çalar, eşlemede olmayan metin tarayıcı sesine düşer', async () => {
    mockFetch(false);
    render(<AppProvider audioV="abc123"><Probe /></AppProvider>);
    await screen.findByText('hazır');
    expect(mapRequests).toEqual(['/api/audio/map?v=abc123']);
    expect(app.hasAudio('كِتَابٌ')).toBe(true);
    expect(app.hasAudio('قلم')).toBe(false);

    act(() => { app.speak('كِتَابٌ'); });
    expect(played).toEqual(['/api/audio/5']);

    act(() => { app.speak('قَلَم'); });
    expect(spoken).toEqual(['قَلَم']);
  });

  it('eşleme gelmeden basılan düğme bekler: tarayıcı sesine düşmez, eşleme gelince kaydı çalar', async () => {
    mockFetch(true);
    render(<AppProvider audioV="v1"><Probe /></AppProvider>);
    expect(screen.getByTestId('ready').textContent).toBe('bekliyor');

    act(() => { app.speak('بَابٌ'); });
    expect(played).toEqual([]);
    expect(spoken).toEqual([]);

    await act(async () => { resolveMap(); });
    await screen.findByText('hazır');
    expect(played).toEqual(['/api/audio/9']);
    expect(spoken).toEqual([]);
  });

  it('beklerken başka ses başlatılırsa ya da durdurulursa eski istek çalmaz', async () => {
    mockFetch(true);
    render(<AppProvider audioV="v2"><Probe /></AppProvider>);
    act(() => { app.speak('بَاب'); });
    act(() => { app.stopSay(); });
    await act(async () => { resolveMap(); });
    await screen.findByText('hazır');
    expect(played).toEqual([]);
    expect(spoken).toEqual([]);
  });

  it('dikte, eşleme gelene kadar soru seçmez; gelince sesi olan kelimeleri öne alır', async () => {
    mockFetch(true);
    const words: Word[] = [{ ar: 'قَلَم', tr: 'kalem' }, { ar: 'بَيْت', tr: 'ev' }, { ar: 'كِتَاب', tr: 'kitap' }, { ar: 'شَمْس', tr: 'güneş' }];
    const a: Activity = { id: '3', type: 'dictate', title: 'Dikte', desc: '', items: null };
    const [view] = actsOf({ acts: [a], words });
    render(
      <AppProvider audioV="v3">
        <Probe />
        <Player topic={{ id: 'deneme', name: 'Deneme', words }} act={view} list={[view]} onClose={vi.fn()} onSwitch={vi.fn()} />
      </AppProvider>
    );
    expect(document.querySelector('input')).toBeNull();
    await act(async () => { resolveMap(); });
    await screen.findByText('hazır');
    // İlk kelime 300 ms sonra okunur: sesi olan tek kelime (kitap) en başta
    await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
    expect(document.querySelector('input')).not.toBeNull();
    expect(played[0]).toBe('/api/audio/5');
  });
});
