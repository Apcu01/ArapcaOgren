(function () {
  const { esc, ar, I, topics, normAr, normTr } = App;
  App.init('dict');
  const app = document.getElementById('app');
  const params = new URLSearchParams(location.search);
  const state = { q: '', konu: params.get('konu') || '' };

  // Tüm derslerin kelimelerini tek listede topla
  const seen = new Map();
  topics().forEach((t) => (t.words || []).forEach((w) => {
    const k = normAr(w.ar) + '|' + w.tr;
    if (seen.has(k)) seen.get(k).topics.push(t);
    else seen.set(k, Object.assign({ topics: [t] }, w));
  }));
  const words = [...seen.values()];

  function rows() {
    const q = state.q.trim();
    const qt = normTr(q), qa = normAr(q);
    const list = words.filter((w) => (!state.konu || w.topics.some((t) => t.id === state.konu)) &&
      (!q || normTr(w.tr + ' ' + (w.en || '') + ' ' + (w.tl || '')).includes(qt) || (App.isAr(q) && normAr(w.ar).includes(qa))));
    document.getElementById('count').textContent = list.length + ' kelime';
    if (!list.length) return `<div class="p-10 text-center text-mute rounded-2xl border border-dashed border-line3">Eşleşen kelime yok.</div>`;
    return list.map((w) => `
      <div class="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 border-b border-[#241B15] last:border-b-0">
        <div class="flex items-center gap-3 min-w-[180px] flex-1 sm:flex-none sm:w-[260px] justify-between sm:justify-start">
          <button type="button" data-say="${esc(w.ar)}" aria-label="Dinle" class="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full bg-chip border border-line3 text-acct hover:text-ink">${I.speaker(16)}</button>
          ${ar(w.ar, 'text-[26px] text-ink')}
        </div>
        <div class="flex flex-col min-w-0 flex-1">
          <span class="text-[16px] font-semibold text-ink">${esc(w.tr)}</span>
          <span class="text-sm text-faint"><span class="tl">${esc(w.tl || '')}</span>${w.en ? `<span class="en">${w.tl ? ' · ' : ''}EN: ${esc(w.en)}</span>` : ''}</span>
        </div>
        <div class="flex flex-wrap gap-1.5">${w.topics.map((t) => `<a href="konu?id=${t.id}" class="px-2.5 py-1 rounded-full bg-s5 border border-line2 text-xs font-semibold text-soft hover:text-ink">${esc(t.name)}</a>`).join('')}</div>
      </div>`).join('');
  }

  app.innerHTML = `
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-7">
      <div class="flex flex-col gap-3">
        <span class="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Sözlük</span>
        <h1 class="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Tüm kelimeler</h1>
        <p class="m-0 text-mute text-lg max-w-[620px]">Derslerde geçen bütün kelimeler. Türkçe, İngilizce, okunuş ya da Arapça yazarak arayabilirsin; harekesiz yazman yeterli.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <label class="flex-[1_1_320px] flex items-center gap-3 px-[18px] h-[54px] rounded-[14px] bg-s2 border border-line2 text-faint focus-within:border-lineh">
          ${I.search()}<span class="sr-only">Kelime ara</span>
          <input id="q" type="search" autocomplete="off" placeholder="Ara: kitap, book, كتاب…" class="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink font-medium text-base placeholder:text-faint">
        </label>
        <label class="flex-[0_1_260px] flex items-center gap-2 px-4 h-[54px] rounded-[14px] bg-s2 border border-line2 text-mute">
          <span class="sr-only">Derse göre filtrele</span>
          <select id="konu" class="flex-1 bg-transparent border-0 outline-none text-ink font-semibold text-[15px]">
            <option value="" class="bg-s2">Tüm dersler</option>
            ${topics().map((t) => `<option value="${t.id}" class="bg-s2" ${state.konu === t.id ? 'selected' : ''}>${t.n}. ${esc(t.name)}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="flex justify-between text-sm text-faint"><span id="count"></span><span>Kelimeye dokunarak sesli dinleyebilirsin</span></div>
      <div id="list" class="rounded-[20px] bg-s1 border border-line overflow-hidden"></div>
    </div>`;
  const draw = () => { document.getElementById('list').innerHTML = rows(); App.applySettings(); };
  document.getElementById('q').addEventListener('input', (e) => { state.q = e.target.value; draw(); });
  document.getElementById('konu').addEventListener('change', (e) => { state.konu = e.target.value; draw(); });
  draw();
})();
