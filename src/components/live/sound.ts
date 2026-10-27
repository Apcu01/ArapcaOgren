'use client';

/* Canlı yarışma sesleri: dosya kullanmadan Web Audio ile üretilir (öğretmen ekranında çalar).
   Tarayıcılar sesin ancak bir dokunuştan sonra başlamasına izin verir: unlock() ilk dokunuşta çağrılır. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ac() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function unlock() {
  const c = ac();
  if (c && c.state === 'suspended') c.resume().catch(() => null);
}

/** Tek nota: frekans, başlangıç (sn, şimdiden), süre, ses şekli, şiddet */
function note(freq: number, at = 0, dur = 0.2, type: OscillatorType = 'sine', vol = 0.3) {
  const c = ac();
  if (!c || !master || c.state !== 'running') return;
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

const N = (semi: number) => 440 * Math.pow(2, (semi - 9) / 12); // 0 = do (C4)

export const sfx = {
  /** Öğrenci katıldı */
  join: () => { note(N(12), 0, 0.12, 'triangle', 0.25); note(N(19), 0.07, 0.16, 'triangle', 0.2); },
  /** Soru başladı */
  start: () => [0, 4, 7, 12].forEach((s, i) => note(N(s + 12), i * 0.07, 0.25, 'triangle', 0.22)),
  /** Son saniyeler */
  tick: (last = false) => note(last ? N(24) : N(19), 0, 0.07, 'square', 0.09),
  /** Süre bitti, cevap gösteriliyor */
  reveal: () => { note(N(7), 0, 0.5, 'sine', 0.3); note(N(12), 0, 0.6, 'sine', 0.2); note(N(16), 0.12, 0.6, 'sine', 0.18); },
  /** Sıralama */
  board: () => [0, 2, 4, 5, 7].forEach((s, i) => note(N(s + 12), i * 0.06, 0.15, 'triangle', 0.18)),
  /** Kazananlar */
  fanfare: () => {
    [[0, 0], [4, 0.15], [7, 0.3], [12, 0.45], [7, 0.62], [12, 0.75]].forEach(([s, at]) => note(N(s + 12), at, 0.35, 'triangle', 0.25));
    [0, 4, 7].forEach((s) => note(N(s + 12), 1.0, 1.2, 'sine', 0.18));
  }
};

/* ---------- Müzik: sakin, tekrar eden bir ezgi (bekleme ve soru sırasında) ---------- */
let timer: ReturnType<typeof setInterval> | null = null;
let step = 0;
// Pentatonik: hangi notaya düşerse düşsün uyumlu
const MELODY = [0, 4, 7, 9, 7, 4, 2, 4, 0, 4, 7, 12, 9, 7, 4, 2];
const BASS = [-12, -12, -5, -5, -3, -3, -8, -8];

export function music(on: boolean) {
  if (!on) { if (timer) clearInterval(timer); timer = null; return; }
  if (timer) return;
  step = 0;
  const beat = () => {
    const len = 0.24;
    note(N(MELODY[step % MELODY.length] + 12), 0, len * 1.4, 'triangle', 0.07);
    if (step % 2 === 0) note(N(BASS[(step / 2) % BASS.length]), 0, len * 2.2, 'sine', 0.12);
    step++;
  };
  beat();
  timer = setInterval(beat, 260);
}
