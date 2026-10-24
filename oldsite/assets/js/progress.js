(function () {
  const { esc, ar, I, topics, topicStats, acts, actState, TYPE } = App;
  App.init('progress');
  const app = document.getElementById('app');

  function render() {
    const all = topics();
    let doneActs = 0, totalActs = 0, sum = 0, tried = 0, doneTopics = 0;
    all.forEach((t) => {
      const st = topicStats(t);
      if (st.pct === 100) doneTopics++;
      acts(t).forEach((a) => {
        totalActs++;
        const s = actState(t.id, a.id);
        if (s) { tried++; sum += s.best; if (s.done) doneActs++; }
      });
    });
    const avg = tried ? Math.round((sum / tried) * 100) : 0;
    const cards = [
      ['Tamamlanan ders', `${doneTopics} / ${all.length}`],
      ['Tamamlanan etkinlik', `${doneActs} / ${totalActs}`],
      ['Ortalama başarı', tried ? '%' + avg : '—'],
      ['Seri', App.streak() + ' gün']
    ];
    app.innerHTML = `
      <div class="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-8">
        <div class="flex flex-col gap-3">
          <span class="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">İlerlemem</span>
          <h1 class="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">Ne kadar yol aldın?</h1>
          <p class="m-0 text-mute text-lg max-w-[640px]">İlerlemen bu tarayıcıda saklanır. Bir etkinlik %70 ve üstü başarıyla tamamlanmış sayılır; en iyi skorun görünür.</p>
        </div>
        <div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
          ${cards.map(([l, v]) => `<div class="p-5 rounded-2xl bg-s3 border border-line2 flex flex-col gap-1"><span class="text-sm text-mute2">${l}</span><span class="text-[28px] font-bold">${v}</span></div>`).join('')}
        </div>
        <div class="flex flex-col gap-3">
          ${all.map((t) => {
            const st = topicStats(t);
            return `<div class="p-5 sm:p-6 rounded-[18px] bg-s3 border border-line flex flex-col gap-4">
              <div class="flex flex-wrap items-center gap-4 justify-between">
                <a href="konu?id=${t.id}" class="flex items-center gap-4 text-ink hover:text-ink min-w-0">
                  <span class="w-12 h-12 shrink-0 rounded-xl bg-chip border border-[#3E2D20] flex items-center justify-center font-ar text-[26px] text-acct" aria-hidden="true">${esc(t.glyph)}</span>
                  <span class="flex flex-col min-w-0"><span class="font-bold text-lg">${t.n}. ${esc(t.name)}</span><span class="text-sm text-mute2">${st.lesson ? 'Konu okundu' : 'Konu okunmadı'} · ${st.done}/${st.total} etkinlik</span></span>
                </a>
                <div class="flex items-center gap-3 flex-[0_1_280px] min-w-[200px]">
                  <div class="flex-1 h-2 rounded-full bg-line overflow-hidden"><div class="h-full rounded-full" style="width:${st.pct}%;background:${st.pct === 100 ? '#8FAE6B' : '#C8894A'}"></div></div>
                  <span class="text-sm font-semibold w-12 text-right">%${st.pct}</span>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                ${acts(t).map((a) => {
                  const s = actState(t.id, a.id);
                  const cls = s && s.done ? 'bg-okbg text-okt border-okln' : s ? 'bg-progbg text-prog border-progln' : 'bg-[#1C1714] text-[#9C8B7E] border-[#2E2620]';
                  return `<span class="px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}" title="${esc(a.title)}">${esc(TYPE[a.type].label)}${s ? ' · %' + Math.round(s.best * 100) : ''}</span>`;
                }).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-badln bg-badbg/50">
          <div class="flex flex-col gap-1"><span class="font-bold">İlerlemeyi sıfırla</span><span class="text-sm text-mute">Tüm skorlar, okunan konular ve seri silinir. Geri alınamaz.</span></div>
          <button type="button" id="reset" class="h-11 px-5 rounded-xl border border-badln text-bad font-semibold hover:bg-badbg">Sıfırla</button>
        </div>
      </div>`;
    document.getElementById('reset').onclick = () => {
      if (confirm('Tüm ilerlemen silinecek. Emin misin?')) { App.reset(); App.refreshStreak(); render(); App.toast('İlerleme sıfırlandı.'); }
    };
    App.applySettings();
  }
  render();
})();
