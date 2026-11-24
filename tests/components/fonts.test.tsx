// @vitest-environment jsdom
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider } from '@/components/AppProvider';
import { AR_FONT_FLAG } from '@/lib/fonts';

vi.mock('next/navigation', () => ({ usePathname: () => '/', useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }) }));

// Arapça yazı tipi (~160 KB) sayfayla önceden yüklenmez: zayıf bağlantıda sayfa kodunu geciktiriyordu.
// Sayfa kodu çalışınca indirilir, inince html'e ar-font eklenir ve sonraki açılışlar için işaretlenir.
let finish: { ok: (faces: unknown[]) => void; fail: (e: Error) => void };
const root = () => document.documentElement;

beforeEach(() => {
  localStorage.clear();
  root().classList.remove('ar-font');
  global.fetch = vi.fn(() => Promise.resolve(new Response('{}'))) as unknown as typeof fetch;
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { load: vi.fn(() => new Promise((ok, fail) => { finish = { ok, fail }; })) }
  });
});
afterEach(() => root().classList.remove('ar-font'));

describe('Arapça yazı tipi sonradan etkinleşir', () => {
  it('indirme bitene kadar etkin değil; bitince etkinleşir ve işaretlenir', async () => {
    render(<AppProvider audioV="t"><span /></AppProvider>);
    expect(document.fonts.load).toHaveBeenCalledWith(expect.stringContaining('Noto Sans Arabic'), expect.any(String));
    expect(root().classList.contains('ar-font')).toBe(false);
    await act(async () => finish.ok([{}]));
    expect(root().classList.contains('ar-font')).toBe(true);
    expect(localStorage.getItem(AR_FONT_FLAG)).toBe('1');
  });

  it('indirilemezse yine etkinleşir ama sonraki açılış için işaretlenmez', async () => {
    render(<AppProvider audioV="t"><span /></AppProvider>);
    await act(async () => finish.fail(new Error('ağ yok')));
    expect(root().classList.contains('ar-font')).toBe(true);
    expect(localStorage.getItem(AR_FONT_FLAG)).toBeNull();
  });

  it('kök düzendeki betik önceden etkinleştirdiyse yeniden indirmez', () => {
    root().classList.add('ar-font');
    render(<AppProvider audioV="t"><span /></AppProvider>);
    expect(document.fonts.load).not.toHaveBeenCalled();
  });
});
