(function () {
  const { esc, ar, I, acts, actState, TYPE } = App;
  App.init('abc');
  const app = document.getElementById('app');
  const Z = '‍'; // birleşik biçimleri göstermek için sıfır genişlikli birleştirici

  // [harf, Türkçe adı, Arapça adı, okunuş, Türk okura ses ipucu, sonraki harfe bitişir mi]
  const L = [
    ['ا', 'Elif', 'أَلِف', 'a / e', 'Kendi sesi yoktur; hemze taşır ya da üstün harfini uzatır (bâ).', false],
    ['ب', 'Be', 'بَاء', 'b', 'Türkçedeki b.', true],
    ['ت', 'Te', 'تَاء', 't', 'İnce t.', true],
    ['ث', 'Se', 'ثَاء', 's (peltek)', 'Dil ucu dişler arasında: İngilizce “think”teki th.', true],
    ['ج', 'Cim', 'جِيم', 'c', 'Türkçedeki c (cami).', true],
    ['ح', 'Ha', 'حَاء', 'ḥ', 'Boğazın ortasından, nefesli ve sert bir h. Hırıltı yok.', true],
    ['خ', 'Hı', 'خَاء', 'h (hırıltılı)', 'Gırtlağın üstünden hırıltılı h: Almanca “Bach”.', true],
    ['د', 'Dal', 'دَال', 'd', 'Türkçedeki d.', false],
    ['ذ', 'Zel', 'ذَال', 'z (peltek)', 'Dil ucu dişler arasında: İngilizce “this”teki th.', false],
    ['ر', 'Ra', 'رَاء', 'r', 'Hafif titrek r.', false],
    ['ز', 'Ze', 'زَاي', 'z', 'Türkçedeki z.', false],
    ['س', 'Sin', 'سِين', 's', 'İnce s.', true],
    ['ش', 'Şın', 'شِين', 'ş', 'Türkçedeki ş.', true],
    ['ص', 'Sad', 'صَاد', 's (kalın)', 'Ağzı doldurarak kalın s. Yanındaki üstün “a” okunur: صَبْر sabr.', true],
    ['ض', 'Dad', 'ضَاد', 'd (kalın)', 'Kalın d. Arapçaya “dâd dili” denmesi bu harften gelir.', true],
    ['ط', 'Tı', 'طَاء', 't (kalın)', 'Kalın t: طَالِب tâlib.', true],
    ['ظ', 'Zı', 'ظَاء', 'z (kalın, peltek)', 'Kalın, dişler arası z.', true],
    ['ع', 'Ayn', 'عَيْن', '‘ (ayn)', 'Gırtlağı sıkarak çıkan, Türkçede olmayan ses. Okunuşta ‘ ile gösterilir.', true],
    ['غ', 'Gayn', 'غَيْن', 'ğ', 'Gırtlaktan, gargara yapar gibi: Fransızca r’ye yakın.', true],
    ['ف', 'Fe', 'فَاء', 'f', 'Türkçedeki f.', true],
    ['ق', 'Kaf', 'قَاف', 'k (kalın)', 'Dilin en arkasıyla, kalın k: قَلَم kalem.', true],
    ['ك', 'Kef', 'كَاف', 'k (ince)', 'İnce k: كِتَاب kitâb.', true],
    ['ل', 'Lam', 'لَام', 'l', 'Türkçedeki l.', true],
    ['م', 'Mim', 'مِيم', 'm', 'Türkçedeki m.', true],
    ['ن', 'Nun', 'نُون', 'n', 'Türkçedeki n.', true],
    ['ه', 'He', 'هَاء', 'h', 'Hafif, nefes gibi h (Türkçedeki h).', true],
    ['و', 'Vav', 'وَاو', 'v / û', 'Ünsüz olarak v (İngilizce w’ye yakın), ötre ile uzatma olarak û.', false],
    ['ي', 'Ye', 'يَاء', 'y / î', 'Ünsüz olarak y, esre ile uzatma olarak î.', true]
  ];
  const forms = (c, j) => j ? [c, c + Z, Z + c + Z, Z + c] : [c, c, Z + c, Z + c];

  const HAR = [
    ['بَ', 'Üstün (fetha)', 'be / ba', 'Harfin üstündeki kısa çizgi: kısa “e” ya da kalın harflerde “a”.'],
    ['بِ', 'Esre (kesra)', 'bi', 'Harfin altındaki kısa çizgi: kısa “i”.'],
    ['بُ', 'Ötre (damme)', 'bu', 'Harfin üstündeki küçük vav: kısa “u”.'],
    ['بْ', 'Cezm (sükûn)', 'b', 'Harfin sesli harfi yok: اِبْن ibn.'],
    ['بّ', 'Şedde', 'bb', 'Harf iki kez okunur: رَبّ rabb.'],
    ['بًا', 'İki üstün (tenvin)', 'ben', 'Belirsiz ismin sonunda: كِتَابًا kitâben.'],
    ['بٍ', 'İki esre', 'bin', 'Belirsiz ismin sonunda: كِتَابٍ kitâbin.'],
    ['بٌ', 'İki ötre', 'bun', 'Belirsiz ismin sonunda: كِتَابٌ kitâbun.'],
    ['بَا', 'Uzatma: elif', 'bâ', 'Üstünden sonra gelen elif sesi uzatır.'],
    ['بِي', 'Uzatma: ye', 'bî', 'Esreden sonra gelen ye sesi uzatır.'],
    ['بُو', 'Uzatma: vav', 'bû', 'Ötreden sonra gelen vav sesi uzatır.']
  ];

  // Alıştırmalar için sözde-ders
  const T = {
    id: 'alfabe', n: 0, name: 'Alfabe', glyph: 'أ',
    words: L.map((l) => ({ ar: l[2], tr: l[1] + ' (' + l[0] + ')', tl: l[3] })),
    acts: [
      { type: 'match', title: 'Harf ↔ ad', desc: 'Harfleri adlarıyla eşleştir.', glyph: 'أ ب', items: L.map((l) => [l[0], l[1]]) },
      {
        type: 'mc', title: 'Hangi harf?', desc: 'Kelimenin içindeki biçiminden harfi tanı.', glyph: 'ـبـ', items: [
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'بَيْت', options: ['Be', 'Te', 'Nun', 'Ye'], a: 'Be', why: 'Altında tek nokta: ب (be). Başta ـبـ biçimini alır.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'تُفَّاح', options: ['Te', 'Se', 'Be', 'Nun'], a: 'Te', why: 'Üstünde iki nokta: ت (te). Üç nokta olsaydı ث (se) olurdu.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'نُور', options: ['Nun', 'Be', 'Te', 'Ye'], a: 'Nun', why: 'Üstünde tek nokta: ن (nun). Başta “be”ye benzer ama nokta üsttedir.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'جَمِيل', options: ['Cim', 'Ha', 'Hı', 'Ayn'], a: 'Cim', why: 'Altında nokta: ج (cim). Noktasızı ح, üstte noktalısı خ.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'خُبْز', options: ['Hı', 'Cim', 'Ha', 'Gayn'], a: 'Hı', why: 'Üstünde nokta: خ (hı).' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'شَمْس', options: ['Şın', 'Sin', 'Sad', 'Se'], a: 'Şın', why: 'Üç dişli ve üstünde üç nokta: ش (şın). Noktasızı س (sin).' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'عَيْن', options: ['Ayn', 'Gayn', 'He', 'Fe'], a: 'Ayn', why: 'Noktasız: ع (ayn). Üstünde nokta olsaydı غ (gayn).' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'قَلَم', options: ['Kaf', 'Fe', 'Kef', 'Vav'], a: 'Kaf', why: 'Üstünde iki nokta: ق (kaf). Tek nokta olsaydı ف (fe).' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'كِتَاب', options: ['Kef', 'Kaf', 'Lam', 'Dal'], a: 'Kef', why: 'ك (kef): başta ـكـ gibi yatık yazılır.' },
          { q: 'Kelimenin ilk harfi hangisi?', ar: 'هِلَال', options: ['He', 'Ha', 'Ayn', 'Mim'], a: 'He', why: 'Başta هـ biçimiyle yazılan harf: ه (he).' },
          { q: 'Hangisi kendinden sonraki harfe bitişmez?', options: ['د', 'ب', 'س', 'م'], a: 'د', why: 'ا د ذ ر ز و — bu altı harf kendinden sonrakine bağlanmaz.' },
          { q: 'Hangisi kendinden sonraki harfe bitişmez?', options: ['و', 'ل', 'ي', 'ك'], a: 'و', why: 'Vav (و) bitişmeyen altı harften biridir: ا د ذ ر ز و.' }
        ]
      },
      {
        type: 'mc', title: 'Hareke oku', desc: 'Harekeli heceyi doğru oku.', glyph: 'بَ بِ بُ', items: [
          { q: 'Nasıl okunur?', ar: 'بِ', options: ['bi', 'be', 'bu', 'b'], a: 'bi', why: 'Altındaki çizgi esredir: “i”.' },
          { q: 'Nasıl okunur?', ar: 'كُ', options: ['ku', 'ke', 'ki', 'kü'], a: 'ku', why: 'Üstteki küçük vav ötredir: “u”.' },
          { q: 'Nasıl okunur?', ar: 'مَا', options: ['mâ', 'me', 'mi', 'mû'], a: 'mâ', why: 'Üstün + elif = uzun â.' },
          { q: 'Nasıl okunur?', ar: 'نُو', options: ['nû', 'nu', 'nî', 'ne'], a: 'nû', why: 'Ötre + vav = uzun û.' },
          { q: 'Nasıl okunur?', ar: 'فِي', options: ['fî', 'fi', 'fe', 'fû'], a: 'fî', why: 'Esre + ye = uzun î.' },
          { q: 'Nasıl okunur?', ar: 'رَبّ', options: ['rabb', 'rab', 'rebe', 'rubb'], a: 'rabb', why: 'Şedde harfi iki kez okutur: b-b.' },
          { q: 'Nasıl okunur?', ar: 'كِتَابٌ', options: ['kitâbun', 'kitâb', 'kitâbin', 'kutub'], a: 'kitâbun', why: 'Sondaki iki ötre (tenvin) “-un” okunur.' },
          { q: 'Nasıl okunur?', ar: 'صَبْر', options: ['sabr', 'sebr', 'sibr', 'subr'], a: 'sabr', why: 'ص kalın harftir; üstünü “a” gibi kalın okunur. Cezmli ب sessiz kalır.' }
        ]
      }
    ]
  };

  function render() {
    app.innerHTML = `
      <div class="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col gap-10">
        <div class="flex flex-wrap gap-8 items-end justify-between">
          <div class="flex flex-col gap-3 max-w-[700px]">
            <span class="text-[13px] font-semibold tracking-[.12em] uppercase text-lab">Alfabe</span>
            <h1 class="m-0 text-[36px] sm:text-[44px] font-bold tracking-tight leading-tight">28 harf, 4 biçim</h1>
            <p class="m-0 text-mute text-lg leading-relaxed">Arapça sağdan sola yazılır ve harfler kelimedeki yerine göre (tek başına, başta, ortada, sonda) biçim değiştirir. Harfe dokun, adını dinle. Sesli harfler çoğunlukla harf olarak değil, <b class="text-ink">hareke</b> denen işaretlerle gösterilir.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            ${acts(T).map((a) => { const s = actState(T.id, a.id); return `<button type="button" data-act="${a.id}" class="h-11 px-4 rounded-full border text-sm font-semibold ${s && s.done ? 'bg-okbg text-okt border-okln' : 'bg-s2 text-soft border-line2 hover:border-lineh'}">${esc(a.title)}${s ? ' · %' + Math.round(s.best * 100) : ''}</button>`; }).join('')}
          </div>
        </div>

        <div class="flex gap-3 p-4 sm:p-5 rounded-2xl bg-progbg/60 border border-progln max-w-[900px]">
          <span class="text-prog shrink-0 mt-0.5">${I.bulb(20)}</span>
          <p class="m-0 text-[15.5px] leading-relaxed text-[#D8C9BA]"><b class="text-prog">Püf noktası:</b> Birçok harf aynı gövdeyi paylaşır, farkı noktalar yaratır: ب ت ث ن ي (başta hepsi ـبـ gibi görünür). Önce gövdeyi, sonra noktanın yerini ve sayısını öğren. Bitişmeyen altı harf: ${ar('ا د ذ ر ز و')} — bunlardan sonra kelime içinde boşluk varmış gibi görünür.</p>
        </div>

        <section class="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          ${L.map((l) => {
            const f = forms(l[0], l[5]);
            return `<button type="button" data-say="${esc(l[2])}" aria-label="${l[1]} harfini dinle" class="cat text-left p-5 rounded-[18px] bg-s3 border border-line flex flex-col gap-3 text-ink">
              <span class="flex items-start justify-between gap-3 w-full">
                <span class="flex flex-col"><span class="text-xl font-bold">${l[1]}</span><span class="text-sm text-acct font-semibold">${esc(l[3])}</span></span>
                <span class="font-ar text-[56px] leading-none text-ink" lang="ar">${l[0]}</span>
              </span>
              <span class="grid grid-cols-4 gap-1 w-full rounded-xl bg-s1 border border-line p-2 text-center" dir="ltr">
                ${['Tek', 'Başta', 'Ortada', 'Sonda'].map((h, i) => `<span class="flex flex-col"><span class="font-ar text-[26px] leading-[1.5] text-accs" lang="ar">${f[i]}</span><span class="text-[10px] uppercase tracking-wider text-faint">${h}</span></span>`).join('')}
              </span>
              <span class="text-[13px] leading-relaxed text-mute2">${App.text(l[4])}</span>
              ${l[5] ? '' : '<span class="self-start px-2 py-0.5 rounded-full bg-s5 border border-line2 text-[11px] font-bold text-soft">Sonraki harfe bitişmez</span>'}
            </button>`;
          }).join('')}
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="m-0 text-2xl font-bold">Ek harfler ve işaretler</h2>
          <div class="grid gap-3 md:grid-cols-3">
            ${[['ة', 'Tâ merbûta', 'Kelime sonunda, çoğunlukla dişil isimlerde. Durakta “e/a”, devam ederken “t” okunur: مَدْرَسَة medrese(t).'], ['ء', 'Hemze', 'Kısa bir kesilme sesi: سَأَلَ se-e-le. Elif, vav ya da ye üstünde ya da tek başına yazılır: أ إ ؤ ئ ء.'], ['ى', 'Elif maksûra', 'Noktasız ye biçiminde yazılan uzun â: عَلَى alâ, إِلَى ilâ.']].map(([c, n, d]) => `
              <div class="p-5 rounded-2xl bg-s1 border border-line flex gap-4 items-start"><span class="font-ar text-[44px] leading-none text-acct">${c}</span><span class="flex flex-col gap-1"><span class="font-bold">${n}</span><span class="text-sm text-mute2 leading-relaxed">${App.text(d)}</span></span></div>`).join('')}
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="m-0 text-2xl font-bold">Harekeler (sesli harf işaretleri)</h2>
          <p class="m-0 text-mute max-w-[780px] leading-relaxed">Gazete ve kitaplarda harekeler çoğunlukla yazılmaz; okuyucu kelimeyi tanıdığı için okur. Öğrenirken ise harekeli metin çok önemlidir. Sağ üstteki ayarlardan harekeleri gizleyip kendini deneyebilirsin.</p>
          <div class="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
            ${HAR.map(([c, n, tl, d]) => `<button type="button" data-say="${esc(c)}" class="cat text-left p-5 rounded-2xl bg-s3 border border-line flex gap-4 items-center text-ink">
              <span class="font-ar text-[44px] leading-none text-ink w-16 text-center" lang="ar" dir="rtl">${c}</span>
              <span class="flex flex-col gap-0.5"><span class="font-bold">${n}</span><span class="text-sm text-acct font-semibold">${tl}</span><span class="text-[13px] text-mute2 leading-relaxed">${App.text(d)}</span></span>
            </button>`).join('')}
          </div>
        </section>
      </div>`;
    app.querySelectorAll('[data-act]').forEach((b) => b.onclick = () => Player.open(T, acts(T).find((a) => a.id === b.dataset.act), render));
    App.applySettings();
  }
  render();
})();
