(function () {
  const { esc, ar, I, topics, topicStats, pctLabel, acts } = App;
  App.init('home');
  const state = { level: 'Tümü', q: '' };
  const all = topics();
  const app = document.getElementById('app');

  function continueCard() {
    const t = App.topic(App.S.last) || all.find((x) => topicStats(x).pct < 100) || all[0];
    const st = topicStats(t);
    const label = App.S.last ? 'Kaldığın yer' : 'Buradan başla';
    return `
      <a href="konu?id=${t.id}" class="flex-[1_1_360px] min-w-0 flex flex-col gap-[18px] p-7 rounded-[22px] bg-s4 border border-line3 text-ink hover:text-ink hover:border-lineh">
        <div class="flex justify-between items-start gap-3">
          <div class="flex flex-col gap-1.5">
            <span class="text-[13px] font-semibold text-lab tracking-[.08em] uppercase">${label}</span>
            <span class="text-2xl font-bold">${esc(t.name)}</span>
            <span class="text-sm text-mute2">Ders ${t.n} · ${esc(t.level)}</span>
          </div>
          ${ar(t.ar, 'text-[40px] leading-none text-acct')}
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between text-sm text-mute"><span>${st.done} / ${st.total} etkinlik${st.lesson ? ' · konu okundu' : ''}</span><span>%${st.pct}</span></div>
          <div class="h-2 rounded-full bg-[#2E231B] overflow-hidden"><div class="h-full rounded-full bg-acc" style="width:${st.pct}%"></div></div>
        </div>
        <span class="self-start inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold text-[15px]">${st.started ? 'Devam et' : 'Başla'} ${I.arrow()}</span>
      </a>`;
  }

  function steps() {
    const s = [
      ['1', 'Konuyu oku', 'Kurallar, tablolar ve püf noktalarıyla konuyu adım adım öğren.'],
      ['2', 'Örnekleri dinle', 'Her örneği Türkçe ve İngilizce karşılığıyla oku, sesli dinle.'],
      ['3', 'Etkinlikleri çöz', 'Kartlar, eşleştirme, boşluk doldurma ve cümle kurma ile pekiştir.'],
      ['4', 'Testi geç', 'Konu testinde %70 ve üstünü al; yanlışlarının açıklamasını oku.']
    ];
    return `<section aria-label="Nasıl çalışılır" class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      ${s.map(([n, h, p]) => `<div class="flex gap-4 p-5 rounded-2xl bg-s1 border border-line">
        <span class="w-9 h-9 shrink-0 rounded-full bg-chip border border-line3 text-acct font-bold flex items-center justify-center">${n}</span>
        <div class="flex flex-col gap-1"><span class="font-bold">${h}</span><span class="text-sm text-mute2 leading-relaxed">${p}</span></div>
      </div>`).join('')}
    </section>`;
  }

  function grid() {
    const q = App.normTr(state.q.trim());
    const qa = App.normAr(state.q.trim());
    const list = all.filter((t) => (state.level === 'Tümü' || t.level === state.level) &&
      (!q || App.normTr(t.name + ' ' + t.desc + ' ' + (t.tags || '')).includes(q) || (qa && App.normAr(t.ar).includes(qa))));
    if (!list.length) return `<div class="col-span-full p-10 rounded-2xl border border-dashed border-line3 text-center text-mute">“${esc(state.q)}” için konu bulunamadı. Başka bir kelime dene.</div>`;
    return list.map((t) => {
      const st = topicStats(t);
      return `
        <a class="cat flex flex-col gap-5 p-6 rounded-[18px] bg-s3 border border-line text-ink hover:text-ink" href="konu?id=${t.id}">
          <div class="flex justify-between items-start gap-3">
            <span class="w-14 h-14 rounded-[14px] bg-chip border border-[#3E2D20] flex items-center justify-center font-ar text-[30px] text-acct" aria-hidden="true">${esc(t.glyph)}</span>
            <div class="flex flex-col items-end gap-1.5">
              <span class="px-2.5 py-[5px] rounded-full bg-s5 border border-line2 text-xs font-semibold text-mute">${esc(t.level)}</span>
              <span class="text-xs text-faint">Ders ${t.n}</span>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            ${ar(t.ar, 'text-[26px] leading-snug text-accs text-left')}
            <span class="text-xl font-bold">${esc(t.name)}</span>
            <span class="text-sm leading-relaxed text-mute2">${App.text(t.desc)}</span>
          </div>
          <div class="flex flex-col gap-2 mt-auto">
            <div class="flex justify-between text-[13px] text-mute2"><span>${acts(t).length} etkinlik</span><span>${pctLabel(st)}</span></div>
            <div class="h-1.5 rounded-full bg-line overflow-hidden"><div class="h-full rounded-full" style="width:${st.pct}%;background:${st.pct === 100 ? '#8FAE6B' : '#C8894A'}"></div></div>
          </div>
        </a>`;
    }).join('');
  }

  function levels() {
    return ['Tümü', 'Başlangıç', 'Orta', 'İleri'].map((l) => `<button type="button" data-lv="${l}" aria-pressed="${state.level === l}" class="h-11 px-[18px] rounded-full font-semibold text-sm border ${state.level === l ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line2 hover:border-lineh'}">${l}</button>`).join('');
  }

  const totalActs = all.reduce((n, t) => n + acts(t).length, 0);
  app.innerHTML = `
    <div class="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 flex flex-col gap-12">
      <section class="flex flex-wrap gap-8 items-stretch">
        <div class="flex-[999_1_520px] min-w-0 flex flex-col gap-[18px] justify-center">
          <span class="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Arapça öğrenmeye devam</span>
          <h1 class="m-0 text-[38px] sm:text-[52px] leading-[1.08] tracking-[-0.025em] font-bold">Bugün ne öğrenmek<br>istersin?</h1>
          <p class="m-0 max-w-[540px] text-lg leading-relaxed text-mute">Bir konu seç: önce detaylı anlatımı oku, Türkçe ve İngilizce karşılaştırmalı örneklerle kavra, sonra etkinliklerle adım adım pekiştir.</p>
          <label class="mt-2 max-w-[520px] flex items-center gap-3 px-[18px] h-[54px] rounded-[14px] bg-s2 border border-line2 text-faint focus-within:border-lineh">
            ${I.search()}
            <span class="sr-only">Konu ara</span>
            <input id="q" type="search" autocomplete="off" placeholder="Konu ara: saatler, zamirler, sıfatlar…" class="flex-1 min-w-0 bg-transparent border-0 outline-none text-ink font-medium text-base placeholder:text-faint">
          </label>
        </div>
        ${continueCard()}
      </section>

      ${steps()}

      <section class="flex flex-col gap-[22px]">
        <div class="flex flex-wrap gap-4 items-end justify-between">
          <div class="flex flex-col gap-1.5">
            <h2 class="m-0 text-[28px] font-bold tracking-tight">Kategoriler</h2>
            <span class="text-[15px] text-mute2">${all.length} konu · ${totalActs} etkinlik · önerilen sıra: ders numarası</span>
          </div>
          <div role="group" aria-label="Seviye filtresi" class="flex flex-wrap gap-2" id="levels">${levels()}</div>
        </div>
        <div id="grid" class="grid gap-[18px] [grid-template-columns:repeat(auto-fill,minmax(270px,1fr))]">${grid()}</div>
      </section>
    </div>`;

  const redraw = () => { document.getElementById('grid').innerHTML = grid(); document.getElementById('levels').innerHTML = levels(); App.applySettings(); };
  document.getElementById('levels').addEventListener('click', (e) => { const b = e.target.closest('[data-lv]'); if (b) { state.level = b.dataset.lv; redraw(); } });
  document.getElementById('q').addEventListener('input', (e) => { state.q = e.target.value; redraw(); });
  App.applySettings();
})();
