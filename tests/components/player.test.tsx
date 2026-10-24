// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider } from '@/components/AppProvider';
import { DEFAULT_SETTINGS } from '@/lib/settings';
import Player from '@/components/Player';
import { actsOf } from '@/lib/text';
import type { Activity, Word } from '@/lib/types';

vi.mock('next/navigation', () => ({ usePathname: () => '/konu', useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }) }));

const words: Word[] = [
  { ar: 'كِتَاب', tr: 'kitap' }, { ar: 'بَيْت', tr: 'ev' }, { ar: 'قَلَم', tr: 'kalem' }, { ar: 'بَاب', tr: 'kapı' }
];
const topic = { id: 'deneme', name: 'Deneme', words };

function setup(a: Activity) {
  const [view] = actsOf({ acts: [a], words });
  const onClose = vi.fn();
  render(
    <AppProvider user={null} initial={null} initialSettings={DEFAULT_SETTINGS} initialMistakes={null} audios={{}}>
      <Player topic={topic} act={view} list={[view]} onClose={onClose} onSwitch={vi.fn()} />
    </AppProvider>
  );
  return { onClose, view };
}
const opt = (v: string) => document.querySelector<HTMLButtonElement>(`.opt[data-v="${v}"]`)!;
const next = () => fireEvent.click(document.querySelector('[data-next]')!);
const progress = () => JSON.parse(localStorage.getItem('arblearn:v1') || '{}').progress;
const mistakes = () => JSON.parse(localStorage.getItem('arblearn:mistakes') || '[]');

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn(() => Promise.resolve(new Response('{}'))) as unknown as typeof fetch;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('Çoktan seçmeli etkinlik', () => {
  const a: Activity = {
    id: '7', type: 'mc', title: 'Test', desc: '', keepOrder: true,
    items: [
      { q: 'Kitap?', options: ['كِتَابٌ', 'بَيْتٌ'], a: 'كِتَابٌ', fixed: true, why: 'Açıklama bir' },
      { q: 'Ev?', options: ['كِتَابٌ', 'بَيْتٌ'], a: 'بَيْتٌ', fixed: true, why: 'Açıklama iki' }
    ]
  };

  it('yanlış cevapta açıklamayı gösterir, soruyu sonda tekrar sorar ve ilk denemeye göre puanlar', async () => {
    setup(a);
    fireEvent.click(opt('كِتَابٌ'));
    expect(screen.getByText('Doğru!')).toBeTruthy();
    next();
    fireEvent.click(opt('كِتَابٌ'));
    expect(screen.getByText('Yanlış')).toBeTruthy();
    expect(screen.getByText('Açıklama iki')).toBeTruthy();
    expect(screen.getByText('Bu soruyu sonda tekrar soracağız.')).toBeTruthy();
    next();
    // Tekrar sorulan soru
    expect(screen.getByText('Tekrar soru')).toBeTruthy();
    fireEvent.click(opt('بَيْتٌ'));
    await act(async () => { next(); });
    // 2 sorudan 1'i ilk denemede doğru: %50, tamamlanmış sayılmaz
    expect(screen.getByText('Biraz daha pratik')).toBeTruthy();
    expect(progress().deneme.acts['7']).toMatchObject({ best: 0.5, done: false, tries: 1 });
  });

  it('yanlış yapılan soru Hatalarım listesine eklenir, doğru cevaplanınca çıkar', async () => {
    setup(a);
    fireEvent.click(opt('بَيْتٌ')); // ilk soru yanlış
    next();
    expect(mistakes()).toHaveLength(1);
    expect(mistakes()[0].question.a).toBe('كِتَابٌ');
    fireEvent.click(opt('بَيْتٌ')); // ikinci soru doğru
    next();
    fireEvent.click(opt('كِتَابٌ')); // tekrar sorulan ilk soru doğru
    await act(async () => { next(); });
    // Tekrar turundaki doğru cevap hatayı silmez; yalnızca ilk denemedeki doğru cevap siler
    expect(mistakes()).toHaveLength(1);
  });

  it('tümü doğruysa %100 ve tamamlandı olarak kaydeder', async () => {
    setup(a);
    fireEvent.click(opt('كِتَابٌ')); next();
    fireEvent.click(opt('بَيْتٌ'));
    await act(async () => { next(); });
    expect(screen.getByText('Harika!')).toBeTruthy();
    expect(progress().deneme.acts['7']).toMatchObject({ best: 1, done: true });
  });
});

describe('Doğru / yanlış ve cümle kurma', () => {
  it('doğru/yanlış sorusunu boolean cevaba göre değerlendirir', async () => {
    setup({ id: '8', type: 'tf', title: 'DY', desc: '', items: [{ s: 'Önerme', a: false }] });
    fireEvent.click(opt('Yanlış'));
    expect(screen.getByText('Doğru!')).toBeTruthy();
  });

  it('cümle kurmada kelimeler doğru sırayla dizilince doğru sayar', async () => {
    setup({ id: '9', type: 'order', title: 'Kur', desc: '', items: [{ tr: 'Ben öğrenciyim.', w: ['أَنَا', 'طَالِبٌ'] }] });
    const bank = () => [...document.querySelectorAll<HTMLButtonElement>('[dir="rtl"] button.opt')];
    const pick = (w: string) => fireEvent.click(bank().find((b) => b.textContent === w)!);
    pick('أَنَا'); pick('طَالِبٌ');
    fireEvent.click(screen.getByText('Kontrol et'));
    expect(screen.getByText('Doğru!')).toBeTruthy();
  });
});

describe('Eşleştirme', () => {
  it('hatalı eşleştirme puanı düşürür ve Hatalarım listesine eklenir', async () => {
    vi.useFakeTimers();
    setup({ id: '10', type: 'match', title: 'Eş', desc: '', items: [['كِتَاب', 'kitap'], ['بَيْت', 'ev']] });
    const btn = (side: 'l' | 'r', text: string) =>
      [...document.querySelectorAll<HTMLButtonElement>(`button.opt`)].find((b) => b.textContent === text)!;
    fireEvent.click(btn('l', 'كِتَاب')); fireEvent.click(btn('r', 'ev')); // yanlış
    act(() => { vi.advanceTimersByTime(600); });
    fireEvent.click(btn('l', 'كِتَاب')); fireEvent.click(btn('r', 'kitap'));
    fireEvent.click(btn('l', 'بَيْت')); fireEvent.click(btn('r', 'ev'));
    await act(async () => { vi.advanceTimersByTime(1000); });
    vi.useRealTimers();
    // 2 çift, 1 hata: 2 / 3
    expect(progress().deneme.acts['10'].best).toBeCloseTo(2 / 3, 5);
    expect(mistakes()).toHaveLength(1);
  });
});
