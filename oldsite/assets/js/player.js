/* Etkinlik oynatıcısı: kelime kartları, eşleştirme, çoktan seçmeli, boşluk doldurma,
   doğru/yanlış, cümle kurma, dinleme ve karma konu testi */
(function () {
  const { esc, ar, auto, isAr, shuffle, I, sayBtn, speak, canSpeak } = App;
  const T = (s) => App.text(s);
  let root = null;
  let ctx = null; // { topic, act, onClose, ... }

  /* ---------- Saat kadranı ---------- */
  function clockSVG(hm, size = 180) {
    const [h, m] = hm.split(':').map(Number);
    const c = size / 2;
    const ha = (((h % 12) + m / 60) * 30 - 90) * (Math.PI / 180);
    const ma = (m * 6 - 90) * (Math.PI / 180);
    let ticks = '';
    for (let i = 0; i < 60; i++) {
      const a = (i * 6 - 90) * (Math.PI / 180);
      const big = i % 5 === 0;
      const r1 = c - 10, r2 = c - (big ? 22 : 15);
      ticks += `<line x1="${c + r1 * Math.cos(a)}" y1="${c + r1 * Math.sin(a)}" x2="${c + r2 * Math.cos(a)}" y2="${c + r2 * Math.sin(a)}" stroke="${big ? '#D9A066' : '#4A3424'}" stroke-width="${big ? 3 : 1.5}" stroke-linecap="round"/>`;
    }
    let nums = '';
    for (let i = 1; i <= 12; i++) {
      const a = (i * 30 - 90) * (Math.PI / 180);
      const r = c - 38;
      nums += `<text x="${c + r * Math.cos(a)}" y="${c + r * Math.sin(a)}" dy=".35em" text-anchor="middle" fill="#B8A595" font-size="${size / 13}" font-family="Manrope, sans-serif" font-weight="600">${i}</text>`;
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Saat ${hm}">
      <circle cx="${c}" cy="${c}" r="${c - 3}" fill="#18120E" stroke="#4A3424" stroke-width="3"/>
      ${ticks}${nums}
      <line x1="${c}" y1="${c}" x2="${c + (c * 0.45) * Math.cos(ha)}" y2="${c + (c * 0.45) * Math.sin(ha)}" stroke="#F2E8DC" stroke-width="6" stroke-linecap="round"/>
      <line x1="${c}" y1="${c}" x2="${c + (c * 0.7) * Math.cos(ma)}" y2="${c + (c * 0.7) * Math.sin(ma)}" stroke="#C8894A" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${c}" cy="${c}" r="6" fill="#C8894A"/>
    </svg>`;
  }

  /* ---------- Kabuk ---------- */
  function shell() {
    if (!root) {
      root = document.createElement('div');
      root.id = 'player';
      root.className = 'fixed inset-0 z-[80] bg-bg overflow-y-auto';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      document.body.appendChild(root);
      root.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
        // 1–4 tuşlarıyla seçenek seçme
        if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const opts = [...root.querySelectorAll('.opt[data-v]:not(:disabled)')];
          const o = opts[+e.key - 1];
          if (o) { e.preventDefault(); o.click(); }
        }
        if (e.key === 'Enter') {
          const n = root.querySelector('[data-next]');
          if (n && document.activeElement && !document.activeElement.matches('button,a,input')) { e.preventDefault(); n.click(); }
        }
      });
    }
    root.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    if (!root) return;
    try { speechSynthesis.cancel(); } catch (e) {}
    if (ctx && ctx.endless) {
      clearTimeout(ctx.timer);
      // Sınırsız pratikte sonuç ekranına geçmeden çıkılırsa da skoru kaydet
      if (!ctx.saved && ctx.answered > 0) App.setAct(ctx.topic.id, ctx.act.id, ctx.firstCorrect / ctx.answered, endlessDone());
    }
    root.hidden = true;
    root.innerHTML = '';
    document.body.style.overflow = '';
    const cb = ctx && ctx.onClose;
    ctx = null;
    if (cb) cb();
  }
  function frame(body, progress, label) {
    const t = ctx.topic, a = ctx.act;
    root.innerHTML = `
      <div class="min-h-full flex flex-col">
        <div class="sticky top-0 z-10 bg-head/95 backdrop-blur border-b border-line">
          <div class="max-w-[860px] mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
            <button type="button" id="pl-close" aria-label="Etkinliği kapat" class="w-11 h-11 shrink-0 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh">${I.x()}</button>
            <div class="flex-1 min-w-0 flex flex-col gap-1.5">
              <div class="flex justify-between gap-3 text-[13px]">
                <span class="truncate text-mute"><span class="text-lab font-bold uppercase tracking-[.08em] text-xs">${esc(App.TYPE[a.type].label)}</span> · ${esc(t.name)} — ${esc(a.title)}</span>
                <span class="shrink-0 text-faint">${label || ''}</span>
              </div>
              <div class="h-2 rounded-full bg-[#2E231B] overflow-hidden"><div class="h-full rounded-full bg-acc transition-all duration-300" style="width:${Math.round(progress * 100)}%"></div></div>
            </div>
          </div>
        </div>
        <div class="flex-1 max-w-[860px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12" id="pl-body">${body}</div>
      </div>`;
    root.querySelector('#pl-close').onclick = close;
    App.applySettings();
  }

  /* ---------- Giriş noktası ---------- */
  function open(topic, act, onClose) {
    shell();
    ctx = { topic, act, onClose, wrong: [], firstCorrect: 0, total: 0 };
    if (act.type === 'flash') return flashStart();
    if (act.type === 'match') return matchStart();
    if (act.type === 'clock') return clockStart();
    return quizStart();
  }

  /* ================= Sınırsız saat pratiği ================= */
  const HOURS = ['', 'الْوَاحِدَةُ', 'الثَّانِيَةُ', 'الثَّالِثَةُ', 'الرَّابِعَةُ', 'الْخَامِسَةُ', 'السَّادِسَةُ', 'السَّابِعَةُ', 'الثَّامِنَةُ', 'التَّاسِعَةُ', 'الْعَاشِرَةُ', 'الْحَادِيَةَ عَشْرَةَ', 'الثَّانِيَةَ عَشْرَةَ'];
  const TR_NOM = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on', 'on bir', 'on iki'];
  const TR_ACC = ['', 'biri', 'ikiyi', 'üçü', 'dördü', 'beşi', 'altıyı', 'yediyi', 'sekizi', 'dokuzu', 'onu', 'on biri', 'on ikiyi'];
  const TR_DAT = ['', 'bire', 'ikiye', 'üçe', 'dörde', 'beşe', 'altıya', 'yediye', 'sekize', 'dokuza', 'ona', 'on bire', 'on ikiye'];
  const MIN_TR = { 5: 'beş', 10: 'on', 15: 'çeyrek', 20: 'yirmi', 25: 'yirmi beş', 35: 'yirmi beş', 40: 'yirmi', 45: 'çeyrek', 50: 'on', 55: 'beş' };
  const nextH = (h) => (h % 12) + 1;
  const fmt = (h, m) => h + ':' + String(m).padStart(2, '0');
  const key = (t) => t.h + ':' + t.m;

  function timeAr(h, m) {
    const H = HOURS[h], N = HOURS[nextH(h)];
    switch (m) {
      case 0: return H;
      case 5: return H + ' وَخَمْسُ دَقَائِقَ';
      case 10: return H + ' وَعَشْرُ دَقَائِقَ';
      case 15: return H + ' وَالرُّبْعُ';
      case 20: return H + ' وَالثُّلْثُ';
      case 25: return H + ' وَالنِّصْفُ إِلَّا خَمْسَ دَقَائِقَ';
      case 30: return H + ' وَالنِّصْفُ';
      case 35: return H + ' وَالنِّصْفُ وَخَمْسُ دَقَائِقَ';
      case 40: return N + ' إِلَّا ثُلْثًا';
      case 45: return N + ' إِلَّا رُبْعًا';
      case 50: return N + ' إِلَّا عَشْرَ دَقَائِقَ';
      default: return N + ' إِلَّا خَمْسَ دَقَائِقَ';
    }
  }
  function timeTr(h, m) {
    if (m === 0) return 'Saat ' + TR_NOM[h] + '.';
    if (m === 30) return 'Saat ' + TR_NOM[h] + ' buçuk.';
    if (m < 30) return 'Saat ' + TR_ACC[h] + ' ' + MIN_TR[m] + ' geçiyor.';
    return 'Saat ' + TR_DAT[nextH(h)] + ' ' + MIN_TR[m] + ' var.';
  }
  function timeWhy(h, m) {
    const nx = nextH(h);
    const W = {
      0: 'Tam saat: yalnızca dişil sıra sayısı söylenir.' + (h === 1 ? ' Saat bir istisnadır: {{الْوَاحِدَةُ}} (“birinci” değil).' : ''),
      5: '5 dakika geçe: {{وَ}} + {{خَمْسُ دَقَائِقَ}}. {{دَقِيقَة}} dişil olduğu için sayı ة’siz.',
      10: '10 dakika geçe: {{وَ}} + {{عَشْرُ دَقَائِقَ}}. {{دَقِيقَة}} dişil olduğu için sayı ة’siz.',
      15: '15 dakika = saatin dörtte biri: {{وَالرُّبْعُ}} (çeyrek geçe).',
      20: '20 dakika = saatin üçte biri: {{وَالثُّلْثُ}}.',
      25: '25 geçe Arapçada genelde “buçuğa beş var” diye söylenir: {{وَالنِّصْفُ إِلَّا خَمْسَ دَقَائِقَ}}.',
      30: 'Buçuk: {{وَالنِّصْفُ}} (yarım).',
      35: '35 geçe “buçuğu beş geçiyor” diye söylenir: {{وَالنِّصْفُ وَخَمْسُ دَقَائِقَ}}.',
      40: '40 dakika: bir sonraki saate (' + nx + ') yirmi var → {{إِلَّا ثُلْثًا}}.',
      45: 'Çeyrek kala: bir sonraki saat (' + nx + ') + {{إِلَّا رُبْعًا}}. Saati ' + h + ' değil ' + nx + ' söylemelisin.',
      50: '50 dakika: bir sonraki saate (' + nx + ') on var → {{إِلَّا عَشْرَ دَقَائِقَ}} ({{إِلَّا}}’dan sonra üstün).',
      55: '55 dakika: bir sonraki saate (' + nx + ') beş var → {{إِلَّا خَمْسَ دَقَائِقَ}}.'
    };
    return W[m];
  }
  function randTime(avoid) {
    let t;
    do { t = { h: 1 + Math.floor(Math.random() * 12), m: 5 * Math.floor(Math.random() * 12) }; } while (avoid && key(t) === avoid);
    return t;
  }
  // Öğretici çeldiriciler: komşu saat (kala/geçe karışıklığı), ayna dakika (15↔45), yakın dakikalar
  function distractors(t) {
    const mir = { 0: 0, 5: 55, 10: 50, 15: 45, 20: 40, 25: 35, 30: 30, 35: 25, 40: 20, 45: 15, 50: 10, 55: 5 };
    const nx = nextH(t.h), pv = ((t.h + 10) % 12) + 1;
    const cand = shuffle([[nx, t.m], [pv, t.m], [t.h, mir[t.m]], [nx, mir[t.m]], [pv, mir[t.m]], [t.h, (t.m + 15) % 60], [t.h, (t.m + 5) % 60], [t.h, (t.m + 55) % 60], [t.h, (t.m + 30) % 60]])
      .map(([h, m]) => ({ h, m }));
    const seen = new Set([key(t)]);
    const out = [];
    for (const c of cand) { if (!seen.has(key(c))) { seen.add(key(c)); out.push(c); } if (out.length === 3) break; }
    while (out.length < 3) { const r = randTime(); if (!seen.has(key(r))) { seen.add(key(r)); out.push(r); } }
    return out;
  }
  const endlessDone = () => ctx.answered >= 10 && ctx.firstCorrect / ctx.answered >= 0.7;

  function clockStart() {
    Object.assign(ctx, { endless: true, answered: 0, firstCorrect: 0, streak: 0, best: 0, last: null, saved: false });
    clockNext();
  }
  function clockNext() {
    clearTimeout(ctx.timer);
    const t = randTime(ctx.last);
    ctx.last = key(t);
    const mode = ctx.act.mode === 'mix' ? (Math.random() < 0.5 ? 'c2t' : 't2c') : ctx.act.mode;
    const opts = shuffle([t, ...distractors(t)]);
    const full = 'السَّاعَةُ ' + timeAr(t.h, t.m);
    let prompt, answer;
    if (mode === 'c2t') {
      prompt = `<p class="m-0 text-lg sm:text-xl font-semibold text-center">Saat kaç? Kadrandaki saatin Arapçasını seç.</p>
        <div class="flex justify-center">${clockSVG(fmt(t.h, t.m), 210)}</div>`;
      answer = `<div class="grid sm:grid-cols-2 gap-3">${opts.map((o, i) => `<button type="button" class="opt relative min-h-[64px] px-5 py-3 rounded-2xl bg-s3 border border-line2 text-ink text-center" data-v="${key(o)}"><span class="absolute left-3 top-2 text-[11px] font-bold text-faint">${i + 1}</span>${ar(timeAr(o.h, o.m), 'text-[26px]')}</button>`).join('')}</div>`;
    } else {
      prompt = `<p class="m-0 text-lg sm:text-xl font-semibold text-center">Bu saati gösteren kadranı seç.</p>
        <div class="flex items-center justify-center gap-4 flex-wrap px-2 py-5 rounded-2xl bg-s3 border border-line2">${ar(full, 'text-[32px] sm:text-[38px] text-ink text-center')}${sayBtn(full)}</div>`;
      answer = `<div class="grid grid-cols-2 gap-3">${opts.map((o, i) => `<button type="button" class="opt relative p-3 rounded-2xl bg-s3 border border-line2 flex items-center justify-center" data-v="${key(o)}" aria-label="Seçenek ${i + 1}"><span class="absolute left-3 top-2 text-[11px] font-bold text-faint">${i + 1}</span>${clockSVG(fmt(o.h, o.m), 150).replace(/role="img" aria-label="[^"]*"/, 'aria-hidden="true"')}</button>`).join('')}</div>`;
    }
    const acc = ctx.answered ? Math.round((ctx.firstCorrect / ctx.answered) * 100) : 0;
    const body = `
      <div class="flex flex-col gap-6 pop">
        <div class="flex flex-wrap justify-center gap-2 text-sm">
          ${[['Doğru', ctx.firstCorrect, 'text-okt'], ['Yanlış', ctx.answered - ctx.firstCorrect, 'text-bad'], ['Seri', ctx.streak, 'text-acct'], ['En iyi seri', ctx.best, 'text-soft'], ['Başarı', ctx.answered ? '%' + acc : '—', 'text-ink']]
            .map(([l, v, c]) => `<span class="px-3 py-1.5 rounded-full bg-s1 border border-line"><span class="text-faint">${l}</span> <b class="${c}">${v}</b></span>`).join('')}
        </div>
        ${prompt}
        ${answer}
        <div id="q-fb" aria-live="polite"></div>
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line">
          <span class="text-xs text-faint">İpucu: 1–4 tuşlarıyla seç, Enter ile devam et.</span>
          <button type="button" id="c-end" class="h-11 px-5 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Bitir ve sonucu gör</button>
        </div>
      </div>`;
    frame(body, ctx.answered ? ctx.firstCorrect / ctx.answered : 0, `Soru ${ctx.answered + 1} · sınırsız`);
    root.querySelector('#c-end').onclick = () => {
      if (!ctx.answered) return close();
      finish(ctx.firstCorrect / ctx.answered, endlessDone());
    };
    if (mode === 't2c') setTimeout(() => speak(full), 250);

    root.querySelectorAll('.opt').forEach((b) => {
      b.onclick = () => {
        const ok = b.dataset.v === key(t);
        root.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x.dataset.v === key(t)) x.classList.add('is-right'); });
        ctx.answered++;
        if (ok) { ctx.firstCorrect++; ctx.streak++; ctx.best = Math.max(ctx.best, ctx.streak); }
        else {
          b.classList.add('is-wrong', 'shake');
          ctx.streak = 0;
          const [gh, gm] = b.dataset.v.split(':').map(Number);
          ctx.wrong.push({ prompt: `<span class="text-faint">${fmt(t.h, t.m)}</span> — ${esc(timeTr(t.h, t.m))}`, given: ar(timeAr(gh, gm), 'text-2xl') + ` <span class="text-faint">(${fmt(gh, gm)})</span>`, right: ar(timeAr(t.h, t.m), 'text-2xl'), why: App.text(timeWhy(t.h, t.m)) });
          if (ctx.wrong.length > 12) ctx.wrong.shift();
        }
        const box = root.querySelector('#q-fb');
        box.innerHTML = `
          <div class="pop rounded-2xl p-5 sm:p-6 flex flex-col gap-3 border ${ok ? 'bg-okbg border-okln' : 'bg-badbg border-badln'}">
            <div class="flex items-center gap-2 font-bold text-lg ${ok ? 'text-okt' : 'text-bad'}">${ok ? I.check(20) + ' Doğru!' + (ctx.streak >= 3 ? ` <span class="text-acct text-base">${ctx.streak} doğru üst üste</span>` : '') : I.x(20) + ' Yanlış'}</div>
            <div class="flex items-center gap-3 flex-wrap">${ar(full, 'text-[26px] text-ink')}${sayBtn(full, 'w-9 h-9', 16)}</div>
            <p class="m-0 text-soft"><b class="text-ink">${fmt(t.h, t.m)}</b> — ${esc(timeTr(t.h, t.m))}</p>
            <p class="m-0 text-[15px] leading-relaxed text-[#D8C9BA]"><span class="inline-flex align-[-3px] text-acct mr-1">${I.bulb(17)}</span>${App.text(timeWhy(t.h, t.m))}</p>
            <div class="flex justify-end"><button type="button" data-next class="h-12 px-7 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Sonraki saat ${I.arrow()}</button></div>
          </div>`;
        App.applySettings();
        const nb = box.querySelector('[data-next]');
        nb.onclick = clockNext;
        nb.focus({ preventScroll: true });
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Doğruysa kısa bir süre sonra kendiliğinden sıradakine geç
        if (ok) ctx.timer = setTimeout(() => { if (ctx && ctx.endless && root.contains(nb)) clockNext(); }, 1600);
      };
    });
  }

  /* ================= Kelime kartları ================= */
  function flashStart() {
    const items = (ctx.act.items || ctx.topic.words || []).map((w, i) => Object.assign({ _i: i }, w));
    ctx.queue = shuffle(items);
    ctx.total = items.length;
    ctx.known = new Set();
    ctx.missed = new Set();
    flashRender();
  }
  function flashRender() {
    if (!ctx.queue.length) {
      const score = (ctx.total - ctx.missed.size) / ctx.total;
      ctx.wrong = [...ctx.missed].map((i) => { const w = (ctx.act.items || ctx.topic.words)[i]; return { prompt: ar(w.ar, 'text-2xl'), right: esc(w.tr), why: w.tl ? 'Okunuşu: ' + esc(w.tl) : '' }; });
      return finish(score, true);
    }
    const w = ctx.queue[0];
    const body = `
      <div class="flex flex-col items-center gap-8 pop">
        <p class="text-mute text-center">Kartın Arapça yüzünü oku, sesli dinle, anlamını tahmin et; sonra kartı çevir.</p>
        <div class="flip w-full max-w-[520px]" id="card">
          <div class="flip-inner">
            <button type="button" id="card-front" class="flip-face w-full min-h-[300px] rounded-3xl bg-s4 border border-line3 p-8 flex flex-col items-center justify-center gap-4 text-ink">
              <span class="text-xs font-bold tracking-[.12em] uppercase text-lab">Arapça</span>
              ${ar(w.ar, 'text-[56px] leading-tight text-ink text-center')}
              ${w.tl ? `<span class="tl text-mute text-lg">${esc(w.tl)}</span>` : ''}
              <span class="mt-2 inline-flex items-center gap-2 text-sm text-faint">${I.flipI(16)} Çevirmek için dokun</span>
            </button>
            <div class="flip-face flip-back w-full rounded-3xl bg-s5 border border-lineh p-8 flex flex-col items-center justify-center gap-3 text-center">
              <span class="text-xs font-bold tracking-[.12em] uppercase text-lab">Anlamı</span>
              <span class="text-[34px] font-bold leading-tight">${esc(w.tr)}</span>
              ${w.en ? `<span class="en text-mute text-lg">EN: ${esc(w.en)}</span>` : ''}
              ${ar(w.ar, 'text-3xl text-accs')}
              ${w.note ? `<span class="text-sm text-mute2 max-w-[380px] leading-relaxed">${esc(w.note)}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">${sayBtn(w.ar, 'w-12 h-12')}<span class="text-sm text-faint">Telaffuzu dinle</span></div>
        <div id="flash-actions" class="flex flex-wrap justify-center gap-3" hidden>
          <button type="button" id="f-again" class="h-12 px-6 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh inline-flex items-center gap-2">${I.refresh(17)} Tekrar göster</button>
          <button type="button" id="f-know" data-next class="h-12 px-6 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">${I.check(17)} Biliyorum</button>
        </div>
      </div>`;
    frame(body, ctx.known.size / ctx.total, `${ctx.known.size} / ${ctx.total} kart`);
    const card = root.querySelector('#card');
    const reveal = () => { card.classList.add('is-flipped'); root.querySelector('#flash-actions').hidden = false; root.querySelector('#f-know').focus(); };
    root.querySelector('#card-front').onclick = reveal;
    card.addEventListener('click', (e) => { if (card.classList.contains('is-flipped') && !e.target.closest('[data-say]')) card.classList.remove('is-flipped'); });
    root.querySelector('#f-know').onclick = () => { ctx.known.add(w._i); ctx.queue.shift(); flashRender(); };
    root.querySelector('#f-again').onclick = () => { ctx.missed.add(w._i); ctx.queue.push(ctx.queue.shift()); flashRender(); };
    root.querySelector('#card-front').focus();
  }

  /* ================= Eşleştirme ================= */
  function matchStart() {
    const pairs = shuffle(ctx.act.items.map((p, i) => ({ l: p[0], r: p[1], i })));
    ctx.rounds = [];
    for (let i = 0; i < pairs.length; i += 5) ctx.rounds.push(pairs.slice(i, i + 5));
    // tek kalan çifti önceki tura kat
    if (ctx.rounds.length > 1 && ctx.rounds[ctx.rounds.length - 1].length < 3) {
      const last = ctx.rounds.pop();
      ctx.rounds[ctx.rounds.length - 1].push(...last);
    }
    ctx.round = 0;
    ctx.total = pairs.length;
    ctx.matched = 0;
    ctx.mistakes = 0;
    ctx.missPairs = new Map();
    matchRender();
  }
  function matchRender() {
    const pairs = ctx.rounds[ctx.round];
    const L = shuffle(pairs), R = shuffle(pairs);
    const col = (arr, side) => arr.map((p) => {
      const txt = side === 'l' ? p.l : p.r;
      return `<button type="button" class="opt w-full min-h-[64px] px-4 py-3 rounded-2xl bg-s3 border border-line2 text-ink text-[16px] font-semibold text-center" data-side="${side}" data-i="${p.i}">${auto(txt, 'text-[26px]')}</button>`;
    }).join('');
    const body = `
      <div class="flex flex-col gap-6 pop">
        <div class="text-center flex flex-col gap-2">
          <h2 class="m-0 text-2xl font-bold">Eşleri bul</h2>
          <p class="m-0 text-mute">Soldan bir öğe seç, sonra sağdaki karşılığına dokun.${ctx.rounds.length > 1 ? ` Tur ${ctx.round + 1} / ${ctx.rounds.length}.` : ''}</p>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:gap-5">
          <div class="flex flex-col gap-3">${col(L, 'l')}</div>
          <div class="flex flex-col gap-3">${col(R, 'r')}</div>
        </div>
        <p id="m-msg" class="text-center text-sm text-faint min-h-[20px]" aria-live="polite"></p>
      </div>`;
    frame(body, ctx.matched / ctx.total, `${ctx.matched} / ${ctx.total} çift`);
    let sel = null;
    let left = pairs.length;
    root.querySelectorAll('[data-side]').forEach((b) => {
      b.onclick = () => {
        if (b.disabled) return;
        if (!sel || sel.dataset.side === b.dataset.side) {
          if (sel) sel.classList.remove('is-sel');
          sel = b; b.classList.add('is-sel');
          const p = pairs.find((x) => String(x.i) === b.dataset.i);
          if (b.dataset.side === 'l' && isAr(p.l)) speak(p.l);
          return;
        }
        const a = sel; sel = null; a.classList.remove('is-sel');
        if (a.dataset.i === b.dataset.i) {
          [a, b].forEach((x) => { x.classList.add('is-right'); x.disabled = true; setTimeout(() => x.classList.add('is-gone'), 450); });
          ctx.matched++; left--;
          root.querySelector('#m-msg').textContent = 'Doğru eşleşme!';
          root.querySelector('.bg-acc.transition-all').style.width = Math.round((ctx.matched / ctx.total) * 100) + '%';
          if (!left) setTimeout(() => {
            ctx.round++;
            if (ctx.round < ctx.rounds.length) matchRender();
            else {
              ctx.wrong = [...ctx.missPairs.values()].map((p) => ({ prompt: auto(p.l, 'text-2xl'), right: auto(p.r, 'text-2xl') }));
              finish(ctx.total / (ctx.total + ctx.mistakes), ctx.total / (ctx.total + ctx.mistakes) >= 0.7);
            }
          }, 650);
        } else {
          ctx.mistakes++;
          const pa = pairs.find((x) => String(x.i) === (a.dataset.side === 'l' ? a.dataset.i : b.dataset.i));
          ctx.missPairs.set(pa.i, pa);
          [a, b].forEach((x) => { x.classList.add('is-wrong', 'shake'); setTimeout(() => x.classList.remove('is-wrong', 'shake'), 500); });
          root.querySelector('#m-msg').textContent = 'Bu ikisi eş değil, tekrar dene.';
        }
      };
    });
  }

  /* ================= Soru tabanlı etkinlikler ================= */
  function buildListen() {
    const words = ctx.topic.words;
    return shuffle(words).slice(0, 10).map((w) => {
      const others = shuffle(words.filter((x) => x.tr !== w.tr)).slice(0, 3).map((x) => x.tr);
      return { t: 'listen', ar: w.ar, tl: w.tl, options: [w.tr, ...others], a: w.tr };
    });
  }
  function quizStart() {
    let items = ctx.act.type === 'listen' && !ctx.act.items ? buildListen() : ctx.act.items.map((x) => Object.assign({}, x));
    items = items.map((x) => Object.assign({ t: x.t || (ctx.act.type === 'test' ? 'mc' : ctx.act.type) }, x));
    if (!ctx.act.keepOrder) items = shuffle(items);
    ctx.queue = items;
    ctx.total = items.length;
    ctx.answered = 0;
    ctx.firstCorrect = 0;
    ctx.wrong = [];
    qRender();
  }

  function qPrompt(q) {
    let h = '';
    if (q.t === 'listen') {
      const voice = canSpeak();
      h += `<div class="flex flex-col items-center gap-4">
        <button type="button" data-say="${esc(q.ar)}" id="q-play" aria-label="Kelimeyi dinle" class="w-24 h-24 rounded-full bg-acc text-onacc flex items-center justify-center hover:brightness-110">${I.speaker(40)}</button>
        <span class="text-sm text-faint">Tekrar dinlemek için dokun</span>
        <div id="q-reveal" ${voice ? 'hidden' : ''} class="flex flex-col items-center gap-1">${ar(q.ar, 'text-[44px] text-ink')}${q.tl ? `<span class="tl text-mute">${esc(q.tl)}</span>` : ''}</div>
        ${voice ? '' : '<span class="text-xs text-faint max-w-[360px] text-center">Arapça ses bulunamadığı için kelime yazılı gösteriliyor.</span>'}
      </div>`;
      return h;
    }
    if (q.q) h += `<p class="m-0 text-lg sm:text-xl font-semibold text-center leading-relaxed">${T(q.q)}</p>`;
    if (q.clock) h += `<div class="flex justify-center">${clockSVG(q.clock)}</div>`;
    if (q.t === 'fill') {
      const s = q.s;
      const parts = s.split('___');
      const inner = isAr(s)
        ? `<span class="ar text-[34px] sm:text-[40px] text-ink" lang="ar" dir="rtl">${parts.map((p) => esc(App.showAr(p))).join('<span class="blank" id="q-blank">؟</span>')}</span>`
        : `<span class="text-2xl font-semibold">${parts.map(esc).join('<span class="blank" id="q-blank">?</span>')}</span>`;
      h += `<div class="text-center px-2 py-6 rounded-2xl bg-s3 border border-line2">${inner}</div>`;
      if (q.hint) h += `<p class="m-0 text-center text-mute">${T(q.hint)}</p>`;
    } else if (q.ar) {
      h += `<div class="flex items-center justify-center gap-4 flex-wrap">${ar(q.ar, 'text-[42px] sm:text-[48px] text-ink text-center')}${sayBtn(q.ar)}</div>`;
      if (q.tl) h += `<p class="tl m-0 text-center text-mute">${esc(q.tl)}</p>`;
    }
    if (q.t === 'tf' && q.s) h += `<div class="text-center px-4 py-5 rounded-2xl bg-s3 border border-line2 text-xl font-semibold leading-relaxed">${auto(q.s, 'text-[30px]')}</div>`;
    if (q.t === 'order') h += `<p class="m-0 text-center text-mute">Kelimeleri doğru sıraya diz: <b class="text-ink">${esc(q.tr)}</b></p>`;
    return h;
  }

  function qRender() {
    if (!ctx.queue.length) return finish(ctx.firstCorrect / ctx.total, ctx.firstCorrect / ctx.total >= 0.7);
    const q = ctx.queue[0];
    const retryTag = q._retry ? '<span class="self-center px-3 py-1 rounded-full bg-progbg border border-progln text-prog text-xs font-bold">Tekrar soru</span>' : '';
    let answer = '';
    if (q.t === 'order') {
      answer = `
        <div id="o-ans" dir="rtl" class="min-h-[76px] p-3 rounded-2xl border-2 border-dashed border-line3 flex flex-wrap gap-2 justify-start items-center"></div>
        <div id="o-bank" dir="rtl" class="flex flex-wrap gap-2 justify-center">${shuffle(q.w.map((w, i) => ({ w, i }))).map((o) => `<button type="button" class="opt px-4 py-2 rounded-xl bg-s3 border border-line2 text-ink" data-o="${o.i}">${ar(o.w, 'text-[26px]')}</button>`).join('')}</div>
        <div class="flex justify-center"><button type="button" id="o-check" disabled class="h-12 px-8 rounded-xl bg-acc text-onacc font-bold disabled:opacity-40">Kontrol et</button></div>`;
    } else {
      const opts = q.t === 'tf' ? ['Doğru', 'Yanlış'] : (q.fixed ? q.options : shuffle(q.options));
      const arOpts = opts.some(isAr);
      answer = `<div class="grid ${opts.length > 2 || arOpts ? 'sm:grid-cols-2' : 'grid-cols-2'} gap-3">${opts.map((o) => `<button type="button" class="opt min-h-[60px] px-5 py-3 rounded-2xl bg-s3 border border-line2 text-ink font-semibold text-[16px] ${isAr(o) ? 'text-center' : 'text-left'}" data-v="${esc(o)}">${auto(o, 'text-[28px]')}</button>`).join('')}</div>`;
    }
    const body = `
      <div class="flex flex-col gap-7 pop">
        ${retryTag}
        ${qPrompt(q)}
        ${answer}
        <div id="q-fb" aria-live="polite"></div>
      </div>`;
    frame(body, ctx.answered / ctx.total, `${Math.min(ctx.answered + 1, ctx.total)} / ${ctx.total}`);
    if (q.t === 'listen') setTimeout(() => speak(q.ar), 250);

    if (q.t === 'order') return orderBind(q);
    root.querySelectorAll('.opt').forEach((b) => {
      b.onclick = () => {
        const v = b.dataset.v;
        const right = q.t === 'tf' ? (q.a ? 'Doğru' : 'Yanlış') : q.a;
        const ok = v === right;
        root.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x.dataset.v === right) x.classList.add('is-right'); });
        if (!ok) b.classList.add('is-wrong', 'shake');
        if (q.t === 'fill') { const bl = root.querySelector('#q-blank'); if (bl) { bl.textContent = App.showAr(right); bl.classList.add(ok ? 'text-okt' : 'text-bad'); } }
        if (q.t === 'listen') { const r = root.querySelector('#q-reveal'); if (r) r.hidden = false; }
        feedback(q, ok, right, v);
      };
    });
  }

  function orderBind(q) {
    const ans = root.querySelector('#o-ans'), bank = root.querySelector('#o-bank'), chk = root.querySelector('#o-check');
    const update = () => { chk.disabled = bank.querySelectorAll('[data-o]').length !== 0; };
    bank.addEventListener('click', (e) => { const b = e.target.closest('[data-o]'); if (!b || b.disabled) return; ans.appendChild(b); update(); });
    ans.addEventListener('click', (e) => { const b = e.target.closest('[data-o]'); if (!b || b.disabled) return; bank.appendChild(b); update(); });
    chk.onclick = () => {
      const got = [...ans.querySelectorAll('[data-o]')].map((b) => q.w[+b.dataset.o]);
      const alts = [q.w].concat(q.alt || []);
      const ok = alts.some((w) => w.join(' ') === got.join(' '));
      ans.querySelectorAll('[data-o]').forEach((b) => { b.disabled = true; b.classList.add(ok ? 'is-right' : 'is-wrong'); });
      chk.remove();
      if (!ok) ans.classList.add('shake');
      feedback(q, ok, q.w.join(' '), got.join(' '));
    };
  }

  function feedback(q, ok, right, given) {
    const first = !q._retry;
    ctx.answered += first ? 1 : 0;
    if (ok && first) ctx.firstCorrect++;
    if (!ok) {
      if (first) {
        ctx.wrong.push({ prompt: promptText(q), right: auto(right, 'text-2xl'), given: auto(given, 'text-2xl'), why: q.why ? T(q.why) : '' });
        ctx.queue.push(Object.assign({}, q, { _retry: true }));
      } else {
        // ikinci denemede de yanlışsa bir kez daha sona ekleme; açıklamayı göster ve geç
      }
    }
    const extra = [];
    const full = q.t === 'fill' ? q.s.replace('___', right) : right;
    if ((q.t === 'order' || q.t === 'fill') && isAr(full)) {
      extra.push(`<div class="flex items-center gap-3 flex-wrap">${ar(full, 'text-[26px] text-ink')}${sayBtn(full, 'w-9 h-9', 16)}</div>`);
    }
    if (q.tr && q.t !== 'order') extra.push(`<p class="m-0 text-soft">“${esc(q.tr)}”${q.en ? ` <span class="en text-faint">· EN: ${esc(q.en)}</span>` : ''}</p>`);
    if (q.t === 'listen' && !ok) extra.push(`<p class="m-0 text-soft">${ar(q.ar, 'text-2xl')} = <b>${esc(right)}</b></p>`);
    const box = root.querySelector('#q-fb');
    box.innerHTML = `
      <div class="pop rounded-2xl p-5 sm:p-6 flex flex-col gap-3 border ${ok ? 'bg-okbg border-okln' : 'bg-badbg border-badln'}">
        <div class="flex items-center gap-2 font-bold text-lg ${ok ? 'text-okt' : 'text-bad'}">${ok ? I.check(20) + ' Doğru!' : I.x(20) + ' Yanlış'}${!ok && q.t !== 'order' && q.t !== 'listen' ? `<span class="font-semibold text-soft text-base">— doğru cevap: ${auto(right, 'text-2xl')}</span>` : ''}</div>
        ${extra.join('')}
        ${q.why ? `<p class="m-0 text-[15px] leading-relaxed text-[#D8C9BA]"><span class="inline-flex align-[-3px] text-acct mr-1">${I.bulb(17)}</span>${T(q.why)}</p>` : ''}
        ${!ok && first ? '<p class="m-0 text-xs text-faint">Bu soruyu sonda tekrar soracağız.</p>' : ''}
        <div class="flex justify-end"><button type="button" data-next class="h-12 px-7 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Devam ${I.arrow()}</button></div>
      </div>`;
    App.applySettings();
    const nb = box.querySelector('[data-next]');
    nb.onclick = () => { ctx.queue.shift(); qRender(); };
    nb.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function promptText(q) {
    if (q.t === 'listen') return ar(q.ar, 'text-2xl');
    if (q.t === 'fill') return isAr(q.s) ? ar(q.s.replace('___', '…'), 'text-2xl') : esc(q.s.replace('___', '…'));
    if (q.t === 'order') return esc(q.tr);
    if (q.t === 'tf') return auto(q.s || q.q, 'text-2xl');
    return T(q.q || '') + (q.ar ? ' ' + ar(q.ar, 'text-2xl') : '') + (q.clock ? ` <span class="text-faint">(${q.clock})</span>` : '');
  }

  /* ================= Sonuç ================= */
  function finish(score, done) {
    const pct = Math.round(score * 100);
    App.setAct(ctx.topic.id, ctx.act.id, score, done);
    if (ctx.endless) { ctx.saved = true; clearTimeout(ctx.timer); }
    const list = App.acts(ctx.topic);
    const idx = list.findIndex((a) => a.id === ctx.act.id);
    const next = list[idx + 1];
    const msg = pct >= 90 ? ['Harika!', 'Bu etkinliği çok iyi kavradın.'] : pct >= 70 ? ['Tamamlandı', 'İyi iş. Yanlışlarını aşağıda gözden geçir.'] : ['Biraz daha pratik', 'Konu anlatımına göz atıp tekrar dene; %70 ve üstü tamamlanmış sayılır.'];
    const review = ctx.wrong.length ? `
      <section class="w-full flex flex-col gap-3">
        <h3 class="m-0 text-lg font-bold">Gözden geçir (${ctx.wrong.length})</h3>
        ${ctx.wrong.map((w) => `
          <div class="rounded-2xl bg-s3 border border-line2 p-5 flex flex-col gap-2">
            <div class="text-ink font-semibold leading-relaxed">${w.prompt}</div>
            ${w.given ? `<div class="text-sm text-bad">Senin cevabın: ${w.given}</div>` : ''}
            <div class="text-sm text-okt">Doğru: ${w.right}</div>
            ${w.why ? `<div class="text-sm text-mute leading-relaxed">${w.why}</div>` : ''}
          </div>`).join('')}
      </section>` : '';
    const body = `
      <div class="flex flex-col items-center gap-7 text-center pop">
        ${App.ring(pct, 150, 12)}
        <div class="flex flex-col gap-2">
          <h2 class="m-0 text-3xl font-bold">${ctx.endless && !done && pct >= 70 ? 'İyi gidiyorsun' : msg[0]}</h2>
          <p class="m-0 text-mute max-w-[460px]">${ctx.endless ? `${ctx.answered} saat cevapladın · ${ctx.firstCorrect} doğru · en uzun seri ${ctx.best}.${done ? '' : ' Tamamlanmış sayılması için en az 10 soru ve %70 başarı gerekir.'}` : msg[1]}</p>
        </div>
        <div class="flex flex-wrap justify-center gap-3">
          <button type="button" id="r-again" class="h-12 px-6 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh inline-flex items-center gap-2">${I.refresh(17)} Tekrar dene</button>
          <button type="button" id="r-back" class="h-12 px-6 rounded-xl border border-line3 bg-s2 text-soft font-semibold hover:border-lineh">Etkinliklere dön</button>
          ${next ? `<button type="button" id="r-next" data-next class="h-12 px-6 rounded-xl bg-acc text-onacc font-bold inline-flex items-center gap-2">Sıradaki: ${esc(next.title)} ${I.arrow()}</button>` : ''}
        </div>
        ${review}
      </div>`;
    frame(body, 1, 'Bitti');
    const c = ctx;
    root.querySelector('#r-again').onclick = () => open(c.topic, c.act, c.onClose);
    root.querySelector('#r-back').onclick = close;
    if (next) root.querySelector('#r-next').onclick = () => open(c.topic, next, c.onClose);
    App.refreshStreak();
  }

  window.Player = { open, close, clockSVG };
})();
