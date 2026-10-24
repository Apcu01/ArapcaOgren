/* ArbLearn — ortak yardımcılar: depolama, ilerleme, ses, başlık/altbilgi */
(function () {
  const KEY = 'arblearn:v1';
  const SITE = 'ArbLearn';

  const fresh = () => ({ progress: {}, last: null, days: [], settings: { harakat: true, tl: true, en: true } });
  let S;
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = fresh(); }
  S.settings = Object.assign(fresh().settings, S.settings || {});
  if (!S.progress || typeof S.progress !== 'object') S.progress = {};
  if (!Array.isArray(S.days)) S.days = [];

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* gizli pencere vb. */ } }

  /* ---------- Metin yardımcıları ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const AR_RE = /[؀-ۿ]/;
  const isAr = (s) => AR_RE.test(String(s || ''));
  const strip = (s) => String(s || '').replace(/[ً-ٰٟـ]/g, '');
  const normAr = (s) => strip(s).replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  const normTr = (s) => String(s || '').toLocaleLowerCase('tr').replace(/[âà]/g, 'a').replace(/[îì]/g, 'i').replace(/[ûù]/g, 'u').replace(/['’ʿʾ-]/g, '');
  const showAr = (s) => (S.settings.harakat ? s : strip(s));

  // Arapça metni ayar duyarlı bir span içine sarar
  function ar(text, cls = '') {
    return `<span class="ar ${cls}" lang="ar" dir="rtl" data-v="${esc(text)}">${esc(showAr(text))}</span>`;
  }
  // Metin Arapça ise ar(), değilse düz kaçış
  const auto = (text, arCls = '') => (isAr(text) && !/[A-Za-zÇĞİÖŞÜçğıöşüâîû]/.test(text) ? ar(text, arCls) : text_(text, arCls));
  // {{...}} işaretli Arapçayı ar() ile sarar (içerik güvenilir ders verisidir, HTML içerebilir)
  // İşaretsiz Arapça parçalar da otomatik sarılır (ders verisinde HTML özniteliklerinde Arapça yoktur)
  const AR_RUN = /[؀-ۿ][؀-ۿ\s]*[؀-ۿ؟]|[؀-ۿ]/g;
  const rich = (html, arCls = '') => String(html || '').split(/(\{\{.+?\}\})/).map((part) => {
    const m = part.match(/^\{\{(.+)\}\}$/);
    return m ? ar(m[1], arCls) : part.replace(AR_RUN, (r) => ar(r, arCls));
  }).join('');
  // Karışık metin: {{}} varsa rich, yoksa Arapça parçaları otomatik sar
  function text_(s, arCls = '') {
    s = String(s ?? '');
    if (s.includes('{{')) return rich(s, arCls);
    if (!isAr(s)) return esc(s);
    return esc(s).replace(/[؀-ۿ][؀-ۿ\s]*[؀-ۿ؟]|[؀-ۿ]/g, (m) => ar(m, arCls));
  }

  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }

  /* ---------- İkonlar ---------- */
  const svg = (d, size = 18, sw = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    flame: (s) => svg('<path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4"/>', s || 16),
    search: (s) => svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', s || 20),
    arrow: (s) => svg('<path d="M5 12h14M13 6l6 6-6 6"/>', s || 18, 2.2),
    back: (s) => svg('<path d="M19 12H5M11 6l-6 6 6 6"/>', s || 16, 2.2),
    clock: (s) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', s || 15),
    speaker: (s) => svg('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>', s || 18),
    check: (s) => svg('<path d="m5 12 5 5L20 7"/>', s || 18, 2.4),
    x: (s) => svg('<path d="M6 6l12 12M18 6 6 18"/>', s || 18, 2.4),
    gear: (s) => svg('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>', s || 20),
    bulb: (s) => svg('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1.5 1.7 1.5 2.5h5c0-.8.7-1.7 1.5-2.5A6 6 0 0 0 12 3z"/>', s || 18),
    alert: (s) => svg('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>', s || 18),
    swap: (s) => svg('<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>', s || 18),
    book: (s) => svg('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>', s || 18),
    play: (s) => svg('<path d="M7 4v16l13-8z"/>', s || 22),
    refresh: (s) => svg('<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/>', s || 18),
    flipI: (s) => svg('<path d="M12 3v18M8 7H4v10h4M16 7h4v10h-4"/>', s || 18)
  };

  /* ---------- Ses (Web Speech API) ---------- */
  let arVoice = null;
  let warned = false;
  function pickVoice() {
    try {
      const vs = speechSynthesis.getVoices();
      arVoice = vs.find((v) => /^ar[-_]SA/i.test(v.lang)) || vs.find((v) => /^ar/i.test(v.lang)) || null;
    } catch (e) { arVoice = null; }
  }
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  const canSpeak = () => !!arVoice;
  function speak(text, rate = 0.8) {
    if (!('speechSynthesis' in window)) { toast('Tarayıcın sesli okumayı desteklemiyor.'); return false; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      if (arVoice) u.voice = arVoice;
      u.rate = rate;
      speechSynthesis.speak(u);
    } catch (e) { return false; }
    if (!arVoice && !warned) { warned = true; toast('Bu cihazda Arapça ses bulunamadı. Edge tarayıcısı ya da işletim sisteminin Arapça ses paketi en iyi sonucu verir.'); }
    return true;
  }
  const sayBtn = (text, cls = '', size = 18) =>
    `<button type="button" data-say="${esc(text)}" aria-label="Sesli dinle" title="Dinle" class="inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-full border border-line3 bg-chip text-acct hover:text-ink hover:border-lineh ${cls}">${I.speaker(size)}</button>`;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (b) { e.preventDefault(); e.stopPropagation(); speak(b.dataset.say); }
  });

  /* ---------- Bildirim ---------- */
  function toast(msg) {
    let box = document.getElementById('toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toast';
      box.setAttribute('role', 'status');
      box.className = 'fixed left-1/2 -translate-x-1/2 bottom-6 z-[90] max-w-[92vw] w-[440px] px-5 py-4 rounded-2xl bg-s5 border border-line3 text-sm text-ink shadow-2xl transition-opacity duration-200 opacity-0 pointer-events-none';
      document.body.appendChild(box);
    }
    box.textContent = msg;
    box.style.opacity = '1';
    clearTimeout(box._t);
    box._t = setTimeout(() => { box.style.opacity = '0'; }, 4200);
  }

  /* ---------- Konular & ilerleme ---------- */
  const topics = () => (window.TOPICS || []).slice().sort((a, b) => a.n - b.n);
  const topic = (id) => topics().find((t) => t.id === id) || null;

  const TYPE = {
    flash: { label: 'Kelime kartları', kind: 'Kelime' },
    match: { label: 'Eşleştirme', kind: 'Eşleştirme' },
    mc: { label: 'Çoktan seçmeli', kind: 'Alıştırma' },
    fill: { label: 'Boşluk doldurma', kind: 'Alıştırma' },
    order: { label: 'Cümle kurma', kind: 'Alıştırma' },
    tf: { label: 'Doğru / Yanlış', kind: 'Alıştırma' },
    listen: { label: 'Dinle ve seç', kind: 'Dinleme' },
    test: { label: 'Konu testi', kind: 'Test' },
    clock: { label: 'Sınırsız pratik', kind: 'Pratik' }
  };

  // Konunun etkinlik listesi (dinleme etkinliği kelimelerden otomatik üretilir)
  function acts(t) {
    if (t._acts) return t._acts;
    const list = (t.acts || []).map((a) => Object.assign({}, a));
    if ((t.words || []).length >= 4 && !list.some((a) => a.type === 'listen')) {
      const listen = { type: 'listen', title: 'Dinle ve anlamını seç', desc: 'Kelimeyi dinle, Türkçe anlamını bul. Kulağını Arapçaya alıştır.', glyph: 'اِسْمَعْ', auto: true };
      const ti = list.findIndex((a) => a.type === 'test');
      if (ti === -1) list.push(listen); else list.splice(ti, 0, listen);
    }
    list.forEach((a, i) => {
      a.id = a.id || a.type + i;
      a.count = a.type === 'flash' ? (a.items || t.words || []).length
        : a.type === 'match' ? (a.items || []).length
        : a.type === 'listen' && !a.items ? Math.min(10, (t.words || []).length)
        : (a.items || []).length;
      a.meta = a.type === 'flash' ? a.count + ' kart' : a.type === 'match' ? a.count + ' çift' : a.count + ' soru';
      a.mins = Math.max(3, Math.round(a.count * (a.type === 'flash' ? 0.35 : 0.55)));
      if (a.type === 'clock') { a.count = 0; a.meta = 'Sınırsız soru'; a.mins = 5; }
    });
    t._acts = list;
    return list;
  }

  const tp = (id) => (S.progress[id] = S.progress[id] || { lesson: false, acts: {} });
  function setLesson(id) { tp(id).lesson = true; studied(); save(); }
  function setAct(id, actId, score, done) {
    const p = tp(id);
    const prev = p.acts[actId] || { best: 0, done: false, tries: 0 };
    p.acts[actId] = { best: Math.max(prev.best, score), done: prev.done || done, tries: prev.tries + 1, last: score };
    studied();
    save();
  }
  function actState(id, actId) { const r = (S.progress[id] || { acts: {} }).acts[actId]; return r || null; }
  function topicStats(t) {
    const list = acts(t);
    const p = S.progress[t.id] || { lesson: false, acts: {} };
    const done = list.filter((a) => p.acts[a.id] && p.acts[a.id].done).length;
    const total = list.length + 1;
    const steps = done + (p.lesson ? 1 : 0);
    const pct = Math.round((steps / total) * 100);
    const started = steps > 0 || Object.keys(p.acts).length > 0;
    return { done, total: list.length, lesson: !!p.lesson, pct, started };
  }
  const pctLabel = (st) => (st.pct === 100 ? 'Tamamlandı' : !st.started ? 'Başlanmadı' : '%' + st.pct);
  function setLast(id) { S.last = id; save(); }

  /* ---------- Seri (gün) ---------- */
  const dayKey = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function studied() { const k = dayKey(new Date()); if (!S.days.includes(k)) { S.days.push(k); S.days = S.days.slice(-500); } }
  function streak() {
    const d = new Date();
    if (!S.days.includes(dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (S.days.includes(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ---------- Ayarlar ---------- */
  function applySettings() {
    document.body.classList.toggle('no-tl', !S.settings.tl);
    document.body.classList.toggle('no-en', !S.settings.en);
    document.querySelectorAll('.ar[data-v]').forEach((el) => { el.textContent = showAr(el.dataset.v); });
  }
  function setSetting(k, v) { S.settings[k] = v; save(); applySettings(); document.dispatchEvent(new CustomEvent('settings')); }

  /* ---------- Başlık & altbilgi ---------- */
  function header(active) {
    const el = document.getElementById('site-header');
    if (!el) return;
    const nav = [['./', 'Kategoriler', 'home'], ['ilerleme', 'İlerlemem', 'progress'], ['sozluk', 'Sözlük', 'dict'], ['alfabe', 'Alfabe', 'abc']];
    const st = streak();
    el.innerHTML = `
      <header class="border-b border-line bg-head">
        <div class="max-w-[1240px] mx-auto px-4 sm:px-6 py-[18px] flex flex-wrap gap-4 items-center justify-between">
          <a href="./" class="flex items-center gap-3 text-ink hover:text-ink">
            <span class="w-11 h-11 rounded-xl bg-chip border border-line3 flex items-center justify-center font-ar text-[26px] text-acct">ع</span>
            <span class="font-bold text-lg tracking-tight">${SITE}</span>
          </a>
          <nav class="nav order-3 sm:order-none w-full sm:w-auto flex flex-wrap gap-x-7 gap-y-2 text-[15px] font-medium" aria-label="Ana menü">
            ${nav.map(([h, l, k]) => `<a href="${h}" class="${k === active ? 'is-active' : ''}" ${k === active ? 'aria-current="page"' : ''}>${l}</a>`).join('')}
          </nav>
          <div class="flex items-center gap-3 relative">
            <div class="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1C1511] border border-[#2E231B] text-sm text-acct font-semibold" title="Art arda çalıştığın gün sayısı">
              ${I.flame()} ${st} gün seri
            </div>
            <button id="settings-btn" type="button" aria-label="Görünüm ayarları" aria-expanded="false" class="w-11 h-11 rounded-full bg-chip border border-line3 text-ink flex items-center justify-center hover:border-lineh">${I.gear()}</button>
            <div id="settings-pop" hidden class="absolute right-0 top-14 z-50 w-[290px] p-5 rounded-2xl bg-s4 border border-line3 shadow-2xl">
              <p class="text-xs font-bold tracking-[.1em] uppercase text-lab mb-3">Görünüm</p>
              ${[['harakat', 'Harekeleri göster', 'بَيْتٌ / بيت'], ['tl', 'Okunuşu göster', 'kitâbun'], ['en', 'İngilizce karşılıkları göster', 'a book']].map(([k, l, h]) => `
                <label class="flex items-center justify-between gap-3 py-2.5 cursor-pointer">
                  <span class="flex flex-col"><span class="text-[15px] font-semibold text-ink">${l}</span><span class="text-xs text-faint">${h}</span></span>
                  <input type="checkbox" data-set="${k}" ${S.settings[k] ? 'checked' : ''} class="w-5 h-5 accent-[#C8894A]">
                </label>`).join('')}
              <p class="text-xs text-faint mt-3 leading-relaxed">İlerlemen yalnızca bu tarayıcıda saklanır; hesap gerekmez.</p>
            </div>
          </div>
        </div>
      </header>`;
    const btn = document.getElementById('settings-btn');
    const pop = document.getElementById('settings-pop');
    btn.addEventListener('click', (e) => { e.stopPropagation(); pop.hidden = !pop.hidden; btn.setAttribute('aria-expanded', String(!pop.hidden)); });
    pop.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => { if (!pop.hidden) { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
    pop.querySelectorAll('[data-set]').forEach((c) => c.addEventListener('change', () => setSetting(c.dataset.set, c.checked)));
  }
  function footer() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    el.innerHTML = `<footer class="border-t border-line px-6 py-7 text-center text-sm text-faint">© ${new Date().getFullYear()} ${SITE} · <span lang="ar" class="font-ar text-[17px] text-mute">تَعَلَّمِ العَرَبِيَّةَ</span></footer>`;
  }
  function refreshStreak() { const a = document.getElementById('site-header'); if (a && a.firstElementChild) header(a.dataset.active); }

  function init(active) {
    const h = document.getElementById('site-header');
    if (h) h.dataset.active = active;
    header(active);
    footer();
    applySettings();
  }

  // İlerleme halkası
  function ring(pct, size = 112, stroke = 10) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const on = (c * pct) / 100;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="İlerleme yüzde ${pct}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#2E231B" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${pct === 100 ? '#8FAE6B' : '#C8894A'}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${on} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      <text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#F2E8DC" font-family="Manrope, sans-serif" font-size="${Math.round(size / 5)}" font-weight="700">%${pct}</text>
    </svg>`;
  }

  window.App = {
    S, save, esc, isAr, strip, normAr, normTr, showAr, ar, auto, rich, text: text_, shuffle, I,
    speak, canSpeak, sayBtn, toast, topics, topic, TYPE, acts, tp, setLesson, setAct, actState,
    topicStats, pctLabel, setLast, streak, init, refreshStreak, ring, applySettings,
    reset() { S.progress = {}; S.last = null; S.days = []; save(); }
  };
})();
