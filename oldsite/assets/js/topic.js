(function () {
  const { esc, ar, auto, I, sayBtn, topicStats, acts, actState, TYPE } = App;
  App.init('home');
  const app = document.getElementById('app');
  const params = new URLSearchParams(location.search);
  const t = App.topic(params.get('id'));

  if (!t) {
    app.innerHTML = `<div class="max-w-[720px] mx-auto px-6 py-24 text-center flex flex-col gap-4 items-center">
      <h1 class="m-0 text-3xl font-bold">Konu bulunamadı</h1>
      <p class="m-0 text-mute">Aradığın konu mevcut değil ya da adresi değişmiş olabilir.</p>
      <a href="./" class="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold">Kategorilere dön ${I.arrow()}</a></div>`;
    return;
  }
  document.title = t.name + ' — ArbLearn';
  App.setLast(t.id);
  const list = acts(t);
  const all = App.topics();
  const idx = all.findIndex((x) => x.id === t.id);
  const prevT = all[idx - 1], nextT = all[idx + 1];
  const state = { tab: location.hash === '#etkinlikler' ? 'acts' : 'lesson', kind: 'Tümü' };

  /* ---------- Anlatım parçaları ---------- */
  function example(e) {
    return `<div class="flex flex-col gap-2 p-4 sm:p-5 rounded-2xl bg-s1 border border-line">
      <div class="flex items-center justify-between gap-3">
        ${sayBtn(e.ar)}
        ${ar(e.ar, 'text-[28px] sm:text-[30px] text-ink text-right flex-1')}
      </div>
      ${e.tl ? `<div class="tl text-sm text-faint text-right">${esc(e.tl)}</div>` : ''}
      <div class="flex flex-col gap-1 pt-2 border-t border-[#241B15]">
        <div class="flex gap-2 text-[15px]"><span class="shrink-0 w-7 text-xs font-bold text-lab pt-0.5">TR</span><span class="text-ink">${esc(e.tr)}</span></div>
        ${e.en ? `<div class="en flex gap-2 text-[15px]"><span class="shrink-0 w-7 text-xs font-bold text-lab pt-0.5">EN</span><span class="text-mute">${esc(e.en)}</span></div>` : ''}
        ${e.note ? `<div class="text-sm text-mute2 leading-relaxed mt-1">${rich(e.note)}</div>` : ''}
      </div>
    </div>`;
  }
  function table(tb) {
    return `<div class="overflow-x-auto rounded-2xl border border-line2 bg-s1">
      <table class="lt"><thead><tr>${tb.cols.map((c) => `<th>${App.text(c)}</th>`).join('')}</tr></thead>
      <tbody>${tb.rows.map((r) => `<tr>${r.map((c) => `<td>${String(c).includes('{{') || /[A-Za-zÇĞİÖŞÜçğıöşü0-9]/.test(c) ? rich(c) : App.isAr(c) ? `<span class="inline-flex items-center gap-2">${ar(c)}<button type="button" data-say="${esc(c)}" aria-label="Dinle" class="text-faint hover:text-acct">${I.speaker(15)}</button></span>` : c}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </div>`;
  }
  function tip(text) {
    return `<div class="flex gap-3 p-4 sm:p-5 rounded-2xl bg-progbg/60 border border-progln">
      <span class="text-prog shrink-0 mt-0.5">${I.bulb(20)}</span>
      <div class="prose-l"><p class="!text-[15.5px]"><b class="text-prog">Püf noktası: </b>${text}</p></div>
    </div>`;
  }
  function compare(c) {
    return `<div class="grid sm:grid-cols-2 gap-3">
      ${c.tr ? `<div class="p-4 sm:p-5 rounded-2xl bg-s1 border border-line flex flex-col gap-2"><span class="text-xs font-bold tracking-[.1em] uppercase text-lab">Türkçede</span><div class="prose-l"><p class="!text-[15px]">${rich(c.tr)}</p></div></div>` : ''}
      ${c.en ? `<div class="en p-4 sm:p-5 rounded-2xl bg-s1 border border-line flex flex-col gap-2"><span class="text-xs font-bold tracking-[.1em] uppercase text-lab">İngilizcede</span><div class="prose-l"><p class="!text-[15px]">${rich(c.en)}</p></div></div>` : ''}
    </div>`;
  }
  // Paragraf içindeki {{...}} işaretli Arapçayı ar() ile sar
  const rich = (html) => App.rich(html);

  function lesson() {
    const st = topicStats(t);
    const secs = t.lesson.map((s, i) => `
      <section id="b${i + 1}" class="scroll-mt-24 flex flex-col gap-4 pt-2">
        <h2 class="m-0 flex items-baseline gap-3 text-[22px] sm:text-2xl font-bold tracking-tight"><span class="text-acct text-base font-bold">${i + 1}.</span>${esc(s.h)}</h2>
        ${s.p ? `<div class="prose-l">${s.p.map((p) => `<p>${rich(p)}</p>`).join('')}</div>` : ''}
        ${s.table ? table(s.table) : ''}
        ${s.p2 ? `<div class="prose-l">${s.p2.map((p) => `<p>${rich(p)}</p>`).join('')}</div>` : ''}
        ${s.ex ? `<div class="grid gap-3 md:grid-cols-2">${s.ex.map(example).join('')}</div>` : ''}
        ${s.cmp ? compare(s.cmp) : ''}
        ${(s.tips || []).map((x) => tip(rich(x))).join('')}
      </section>`).join('<hr class="border-0 h-px bg-line my-2">');
    return `
      <div class="flex flex-col gap-8">
        <div class="p-5 sm:p-6 rounded-2xl bg-s3 border border-line2 flex flex-col gap-3">
          <span class="text-xs font-bold tracking-[.12em] uppercase text-lab">Bu derste</span>
          <div class="prose-l"><p>${rich(t.intro)}</p></div>
          <nav aria-label="Bölümler" class="flex flex-wrap gap-2 mt-1">
            ${t.lesson.map((s, i) => `<a href="#b${i + 1}" class="px-3 py-1.5 rounded-full bg-s5 border border-line2 text-[13px] font-semibold text-soft hover:text-ink hover:border-lineh">${i + 1}. ${esc(s.h)}</a>`).join('')}
            <a href="#puf" class="px-3 py-1.5 rounded-full bg-s5 border border-line2 text-[13px] font-semibold text-soft hover:text-ink hover:border-lineh">Özet & hatalar</a>
          </nav>
        </div>
        ${secs}
        <section id="puf" class="scroll-mt-24 flex flex-col gap-4">
          <h2 class="m-0 text-2xl font-bold tracking-tight">Özet: akılda kalacaklar</h2>
          <ul class="m-0 p-0 list-none grid gap-2.5">
            ${t.keys.map((k) => `<li class="flex gap-3 p-4 rounded-xl bg-s1 border border-line"><span class="text-ok shrink-0 mt-0.5">${I.check(18)}</span><span class="prose-l"><span class="text-[15.5px] leading-relaxed text-[#D8C9BA]">${rich(k)}</span></span></li>`).join('')}
          </ul>
          ${t.mistakes && t.mistakes.length ? `
            <h3 class="m-0 mt-4 text-xl font-bold flex items-center gap-2"><span class="text-bad">${I.alert(20)}</span> Sık yapılan hatalar</h3>
            <div class="grid gap-3">
              ${t.mistakes.map((m) => `<div class="rounded-2xl bg-s1 border border-line p-4 sm:p-5 flex flex-col gap-3">
                <div class="grid sm:grid-cols-2 gap-3">
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-badbg border border-badln"><span class="text-bad shrink-0">${I.x(18)}</span>${auto(m.bad, 'text-2xl text-[#F2C0B6]')}</div>
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-okbg border border-okln"><span class="text-okt shrink-0">${I.check(18)}</span>${auto(m.good, 'text-2xl text-[#CFE6B8]')}</div>
                </div>
                <p class="m-0 text-[15px] text-mute leading-relaxed">${rich(m.why)}</p>
              </div>`).join('')}
            </div>` : ''}
        </section>
        <div class="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-s4 border border-line3">
          <div class="flex flex-col gap-1">
            <span class="font-bold text-lg">${st.lesson ? 'Konuyu okudun' : 'Konuyu okudun mu?'}</span>
            <span class="text-sm text-mute">Şimdi öğrendiklerini etkinliklerle pekiştirme zamanı.</span>
          </div>
          <button type="button" id="read-done" class="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold">${st.lesson ? 'Etkinliklere geç' : 'Okudum, etkinliklere geç'} ${I.arrow()}</button>
        </div>
      </div>`;
  }

  /* ---------- Etkinlikler ---------- */
  function badge(a) {
    const s = actState(t.id, a.id);
    if (s && s.done) return ['Tamamlandı · %' + Math.round(s.best * 100), 'bg-okbg text-okt border-okln', 'done'];
    if (s) return ['Denendi · %' + Math.round(s.best * 100), 'bg-progbg text-prog border-progln', 'progress'];
    return ['Başlanmadı', 'bg-[#1C1714] text-[#9C8B7E] border-[#2E2620]', 'none'];
  }
  function nextAct() { return list.find((a) => !(actState(t.id, a.id) || {}).done) || null; }
  function activities() {
    const kinds = ['Tümü', ...new Set(list.map((a) => TYPE[a.type].kind))];
    const nx = nextAct();
    const shown = list.filter((a) => state.kind === 'Tümü' || TYPE[a.type].kind === state.kind);
    return `
      <div class="flex flex-col gap-5">
        <div class="flex flex-wrap gap-3.5 items-center justify-between">
          <p class="m-0 text-mute text-[15px]">Etkinlikler önerilen sırada. %70 ve üstü başarı tamamlanmış sayılır.</p>
          <div role="group" aria-label="Etkinlik türü" class="flex flex-wrap gap-2">
            ${kinds.map((k) => `<button type="button" data-kind="${k}" aria-pressed="${state.kind === k}" class="h-11 px-4 rounded-full font-semibold text-sm border ${state.kind === k ? 'bg-acc text-onacc border-acc' : 'bg-s2 text-soft border-line2 hover:border-lineh'}">${k}</button>`).join('')}
          </div>
        </div>
        <div class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          ${shown.map((a) => {
            const [bl, bc] = badge(a);
            const cur = nx && nx.id === a.id;
            return `<button type="button" data-act="${a.id}" class="act-card text-left flex flex-col gap-[18px] p-[22px] rounded-[18px] text-ink ${cur ? 'bg-s4 border border-lineh' : 'bg-s3 border border-line'}">
              <span class="flex justify-between items-center gap-3 w-full">
                <span class="text-xs font-bold tracking-[.08em] uppercase text-lab">${TYPE[a.type].label}</span>
                <span class="px-2.5 py-[5px] rounded-full text-xs font-bold border ${bc}">${bl}</span>
              </span>
              <span class="flex items-center gap-4">
                <span class="flex-none w-[60px] h-[60px] rounded-[14px] bg-chip border border-[#3E2D20] flex items-center justify-center font-ar text-[20px] text-acct overflow-hidden" aria-hidden="true">${esc(App.showAr(a.glyph || t.glyph))}</span>
                <span class="flex flex-col gap-1 min-w-0">
                  <span class="text-lg font-bold">${esc(a.title)}</span>
                  <span class="text-sm leading-relaxed text-mute2">${App.text(a.desc)}</span>
                </span>
              </span>
              <span class="flex justify-between items-center w-full pt-3.5 border-t border-line text-[13px] text-mute2 mt-auto">
                <span class="inline-flex items-center gap-1.5">${I.clock()} ${a.mins} dk</span>
                <span>${cur ? '<b class="text-acct">Sıradaki</b> · ' : ''}${a.meta}</span>
              </span>
            </button>`;
          }).join('')}
        </div>
      </div>`;
  }

  /* ---------- Kelime paneli ---------- */
  function words() {
    return `
      <aside class="flex-[1_1_320px] min-w-0 flex flex-col gap-4 p-6 rounded-[20px] bg-s1 border border-line lg:sticky lg:top-6">
        <div class="flex justify-between items-center">
          <h2 class="m-0 text-lg font-bold">Kelime önizleme</h2>
          <span class="text-[13px] text-faint">${t.words.length} kelime</span>
        </div>
        <div class="flex flex-col max-h-[560px] overflow-y-auto pr-1">
          ${t.words.map((w) => `
            <div class="flex justify-between items-center gap-3 py-3 border-b border-[#241B15]">
              <span class="flex flex-col min-w-0"><span class="text-[15px] text-soft">${esc(w.tr)}</span>${w.tl ? `<span class="tl text-xs text-faint">${esc(w.tl)}</span>` : ''}</span>
              <span class="flex items-center gap-2">${ar(w.ar, 'text-[22px] text-ink')}<button type="button" data-say="${esc(w.ar)}" aria-label="${esc(w.tr)} — dinle" class="w-8 h-8 inline-flex items-center justify-center rounded-full text-faint hover:text-acct">${I.speaker(15)}</button></span>
            </div>`).join('')}
        </div>
        <a href="sozluk?konu=${t.id}" class="h-[46px] rounded-xl border border-line3 text-acct font-semibold text-[15px] inline-flex items-center justify-center hover:border-lineh">Sözlükte gör</a>
      </aside>`;
  }

  /* ---------- Sayfa ---------- */
  function hero() {
    const st = topicStats(t);
    const mins = list.reduce((n, a) => n + a.mins, 0) + (t.readMins || 10);
    return `
      <section class="flex flex-wrap gap-8 items-center justify-between p-6 sm:p-9 rounded-3xl bg-s3 border border-[#2E231B]">
        <div class="flex-[999_1_480px] min-w-0 flex flex-col gap-3.5">
          <div class="flex flex-wrap items-baseline gap-x-[18px] gap-y-1">
            <h1 class="m-0 text-[36px] sm:text-[46px] leading-[1.1] tracking-[-0.025em] font-bold">${esc(t.name)}</h1>
            ${ar(t.ar, 'text-[36px] sm:text-[46px] leading-[1.1] text-acct')}
          </div>
          <p class="m-0 max-w-[560px] text-[17px] leading-relaxed text-mute">${App.text(t.long || t.desc)}</p>
          <div class="flex flex-wrap gap-2.5 mt-1">
            ${[t.level, 'Ders ' + t.n, list.length + ' etkinlik', '~' + mins + ' dk'].map((c) => `<span class="px-3 py-1.5 rounded-full bg-s5 border border-line2 text-[13px] font-semibold text-soft">${esc(c)}</span>`).join('')}
          </div>
        </div>
        <div class="flex-[1_1_300px] min-w-0 flex items-center gap-[22px]">
          ${App.ring(st.pct)}
          <div class="flex flex-col gap-2.5">
            <span class="text-[15px] text-mute">${st.done} / ${st.total} etkinlik${st.lesson ? ' · konu okundu' : ''}</span>
            <button type="button" id="go-next" class="inline-flex items-center justify-center gap-2 px-5 h-[46px] rounded-xl bg-acc text-onacc font-bold text-[15px]">${!st.lesson ? 'Konuyu oku' : nextAct() ? 'Sıradakine geç' : 'Tekrar et'} ${I.arrow()}</button>
          </div>
        </div>
      </section>`;
  }

  function render() {
    app.innerHTML = `
      <div class="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 pb-20 flex flex-col gap-8">
        <nav aria-label="Sayfa yolu" class="flex items-center gap-2.5 text-sm text-faint">
          <a href="./" class="inline-flex items-center gap-1.5 text-mute hover:text-ink">${I.back()} Kategoriler</a>
          <span aria-hidden="true">/</span><span class="text-ink">${esc(t.name)}</span>
        </nav>
        ${hero()}
        <div class="flex flex-wrap gap-7 items-start">
          <section class="flex-[999_1_600px] min-w-0 flex flex-col gap-6">
            <div role="tablist" aria-label="Bölüm" class="flex gap-1 p-1 rounded-2xl bg-s1 border border-line self-start">
              <button type="button" role="tab" data-tab="lesson" aria-selected="${state.tab === 'lesson'}" class="h-11 px-5 rounded-xl font-bold text-[15px] inline-flex items-center gap-2 ${state.tab === 'lesson' ? 'bg-chip text-ink border border-line3' : 'text-mute hover:text-ink border border-transparent'}">${I.book(17)} Konu anlatımı</button>
              <button type="button" role="tab" data-tab="acts" aria-selected="${state.tab === 'acts'}" class="h-11 px-5 rounded-xl font-bold text-[15px] inline-flex items-center gap-2 ${state.tab === 'acts' ? 'bg-chip text-ink border border-line3' : 'text-mute hover:text-ink border border-transparent'}">Etkinlikler <span class="text-xs px-2 py-0.5 rounded-full bg-s5 border border-line2 text-soft">${list.length}</span></button>
            </div>
            <div id="pane">${state.tab === 'lesson' ? lesson() : activities()}</div>
            <div class="flex flex-wrap justify-between gap-3 pt-4 border-t border-line">
              ${prevT ? `<a href="konu?id=${prevT.id}" class="inline-flex items-center gap-2 text-mute hover:text-ink">${I.back()} ${esc(prevT.name)}</a>` : '<span></span>'}
              ${nextT ? `<a href="konu?id=${nextT.id}" class="inline-flex items-center gap-2 text-acct">Sonraki ders: ${esc(nextT.name)} ${I.arrow(16)}</a>` : ''}
            </div>
          </section>
          ${words()}
        </div>
      </div>`;
    bind();
    App.applySettings();
  }

  function openAct(a) { Player.open(t, a, () => { state.tab = 'acts'; render(); App.refreshStreak(); }); }

  function bind() {
    app.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { state.tab = b.dataset.tab; history.replaceState(null, '', state.tab === 'acts' ? '#etkinlikler' : location.pathname + location.search); render(); });
    app.querySelectorAll('[data-kind]').forEach((b) => b.onclick = () => { state.kind = b.dataset.kind; render(); });
    app.querySelectorAll('[data-act]').forEach((b) => b.onclick = () => openAct(list.find((a) => a.id === b.dataset.act)));
    const rd = document.getElementById('read-done');
    if (rd) rd.onclick = () => { App.setLesson(t.id); App.refreshStreak(); state.tab = 'acts'; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.getElementById('go-next').onclick = () => {
      const st = topicStats(t);
      if (!st.lesson) { state.tab = 'lesson'; render(); document.getElementById('pane').scrollIntoView({ behavior: 'smooth' }); return; }
      openAct(nextAct() || list[list.length - 1]);
    };
  }

  document.addEventListener('settings', render);
  render();
})();
