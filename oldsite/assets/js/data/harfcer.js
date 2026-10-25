window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'harfcer', n: 13, level: 'İleri', glyph: 'ح',
  ar: 'حُرُوفُ الْجَرِّ', name: 'Harf-i Cerler',
  desc: 'فِي، عَلَى، مِنْ، إِلَى، عَنْ، بِـ، لِـ ve cümlede kullanımları.',
  long: 'Türkçedeki -de, -den, -e hal eklerinin Arapça karşılıkları olan harf-i cerler (edatlar), sonrasındaki ismin esre alması, zamirlerle birleşmeleri ve fiillerle kalıplaşmış kullanımları.',
  tags: 'harf-i cer edat preposition fi ala min ila an bi li de den e üstünde içinde mecrur',
  readMins: 15,
  intro: 'Türkçe “ev<b>de</b>, ev<b>den</b>, ev<b>e</b>” derken hal eklerini kelimenin <b>sonuna</b> ekler. Arapça aynı işi kelimenin <b>önüne</b> gelen küçük kelimelerle yapar: {{فِي الْبَيْتِ}} evde, {{مِنَ الْبَيْتِ}} evden, {{إِلَى الْبَيْتِ}} eve. Bunlara <b>harf-i cer</b> denir; İngilizcedeki <em>in, from, to</em> gibidir. Ve hepsinin ortak bir kuralı vardır: sonrasındaki isim <b>esre</b> alır.',
  lesson: [
    {
      h: 'Temel harf-i cerler',
      table: {
        cols: ['Harf-i cer', 'Okunuş', 'Türkçe', 'English', 'Örnek'],
        rows: [
          ['فِي', 'fî', '-de, içinde', 'in', 'فِي الْبَيْتِ'],
          ['عَلَى', 'alâ', 'üstünde, -e (karşı)', 'on', 'عَلَى الطَّاوِلَةِ'],
          ['مِنْ', 'min', '-den', 'from', 'مِنْ تُرْكِيَا'],
          ['إِلَى', 'ilâ', '-e (doğru)', 'to', 'إِلَى الْمَدْرَسَةِ'],
          ['عَنْ', '‘an', 'hakkında; -den (uzak)', 'about; away from', 'عَنِ الدَّرْسِ'],
          ['بِـ', 'bi', 'ile (araç); -de', 'with, by', 'بِالْقَلَمِ'],
          ['لِـ', 'li', 'için; -e ait', 'for; belongs to', 'لِلطَّالِبِ'],
          ['كَـ', 'ke', 'gibi', 'like', 'كَالْأَسَدِ']
        ]
      },
      tips: ['{{بِـ}}، {{لِـ}}، {{كَـ}} tek harfli oldukları için sonraki kelimeye <b>bitişik</b> yazılır. {{لِـ}} + {{ال}} birleşince elif düşer: {{لِ}} + {{الطَّالِبِ}} = {{لِلطَّالِبِ}}.']
    },
    {
      h: 'Kural: sonraki isim esre alır',
      p: [
        'Harf-i cerden sonra gelen isme <b>mecrûr</b> denir ve son harekesi <b>esre</b> olur: {{الْبَيْتُ}} → {{فِي الْبَيْتِ}}. Belirsizse iki esre (-in): {{فِي بَيْتٍ}} “bir evde”.',
        'Sıfat varsa o da esre alır (uyum!): {{فِي الْبَيْتِ الْكَبِيرِ}} “büyük evde”.'
      ],
      ex: [
        { ar: 'الْكِتَابُ عَلَى الطَّاوِلَةِ', tl: 'el-kitâbu ‘ale’t-tâvile', tr: 'Kitap masanın üstünde.', en: 'The book is on the table.' },
        { ar: 'أَنَا مِنْ إِسْطَنْبُولَ', tl: 'ene min İstanbûl', tr: 'Ben İstanbul’danım.', en: 'I am from Istanbul.' },
        { ar: 'ذَهَبْتُ إِلَى السُّوقِ', tl: 'zehebtu ile’s-sûk', tr: 'Çarşıya gittim.', en: 'I went to the market.' },
        { ar: 'كَتَبْتُ بِالْقَلَمِ', tl: 'ketebtu bi’l-kalem', tr: 'Kalemle yazdım.', en: 'I wrote with the pen.' },
        { ar: 'هٰذِهِ الْهَدِيَّةُ لَكَ', tl: 'hâzihi’l-hediyyetu leke', tr: 'Bu hediye senin için.', en: 'This gift is for you.' },
        { ar: 'تَكَلَّمْنَا عَنِ الْفِيلْمِ', tl: 'tekellemnâ ‘ani’l-film', tr: 'Film hakkında konuştuk.', en: 'We talked about the film.' }
      ],
      cmp: {
        tr: 'Türkçede hal eki sonda: ev<b>-de</b>, okul<b>-a</b>, İstanbul<b>-dan</b>. Arapçada öne gelir ve isim de esre ile işaretlenir.',
        en: 'İngilizceye benzer şekilde önce gelir: <b>in</b> the house, <b>to</b> school. Ama İngilizcede isim değişmez.'
      },
      tips: ['{{مِنْ}} ve {{عَنْ}} cezmle biter; arkasından ال gelirse bağlanmak için ünlü alır: {{مِنَ الْبَيْتِ}} (mine’l-beyt), {{عَنِ الدَّرْسِ}} (‘ani’d-ders).']
    },
    {
      h: 'Zamirlerle birleşme',
      p: [
        'Harf-i cerlere bitişik zamirler eklenir (İyelik Ekleri dersini hatırla): {{مِنْكَ}} senden, {{إِلَيْهِ}} ona, {{عَلَيْهَا}} onun üstüne.',
        'Dikkat: {{عَلَى}} ve {{إِلَى}} zamir alınca sondaki elif {{ي}}’ye döner: {{عَلَيْكَ}}، {{إِلَيْكَ}}. {{لِـ}} ise zamirle {{لَـ}} olur: {{لَكَ}}، {{لَهُ}}، {{لَنَا}} (ama {{لِي}}).'
      ],
      table: {
        cols: ['', 'فِي', 'عَلَى', 'مِنْ', 'إِلَى', 'لِـ'],
        rows: [
          ['ben', 'فِيَّ', 'عَلَيَّ', 'مِنِّي', 'إِلَيَّ', 'لِي'],
          ['sen (e.)', 'فِيكَ', 'عَلَيْكَ', 'مِنْكَ', 'إِلَيْكَ', 'لَكَ'],
          ['o (e.)', 'فِيهِ', 'عَلَيْهِ', 'مِنْهُ', 'إِلَيْهِ', 'لَهُ'],
          ['o (k.)', 'فِيهَا', 'عَلَيْهَا', 'مِنْهَا', 'إِلَيْهَا', 'لَهَا'],
          ['biz', 'فِينَا', 'عَلَيْنَا', 'مِنَّا', 'إِلَيْنَا', 'لَنَا'],
          ['onlar', 'فِيهِمْ', 'عَلَيْهِمْ', 'مِنْهُمْ', 'إِلَيْهِمْ', 'لَهُمْ']
        ]
      },
      tips: ['Selamlaşma bu yapıdır: {{السَّلَامُ عَلَيْكُمْ}} “Selam <b>üzerinize</b> olsun” — {{عَلَى}} + {{ـكُمْ}}. Cevabı: {{وَعَلَيْكُمُ السَّلَامُ}}. <b>Aleyhine</b> ({{عَلَيْهِ}} “onun üzerine/karşı”) ve <b>lehine</b> ({{لَهُ}} “onun için”) kelimeleri de buradan!']
    },
    {
      h: 'عِنْدَ ve mekân zarfları',
      p: [
        'Bazı yer bildiren kelimeler de harf-i cer gibi davranır (zarf): {{عِنْدَ}} yanında, {{مَعَ}} ile, {{تَحْتَ}} altında, {{فَوْقَ}} üstünde, {{أَمَامَ}} önünde, {{خَلْفَ}} arkasında, {{بَيْنَ}} arasında, {{قَبْلَ}} önce, {{بَعْدَ}} sonra. Bunlardan sonraki isim de esre alır.'
      ],
      ex: [
        { ar: 'الْقِطَّةُ تَحْتَ السَّرِيرِ', tl: 'el-kittatu tahte’s-serîr', tr: 'Kedi yatağın altında.', en: 'The cat is under the bed.' },
        { ar: 'الْمَسْجِدُ أَمَامَ الْمَدْرَسَةِ', tl: 'el-mescidu emâme’l-medrese', tr: 'Cami okulun önünde.', en: 'The mosque is in front of the school.' },
        { ar: 'جَلَسْتُ بَيْنَ أَحْمَدَ وَعَلِيٍّ', tl: 'celestu beyne Ahmede ve ‘Aliyy', tr: 'Ahmet ile Ali’nin arasında oturdum.', en: 'I sat between Ahmed and Ali.' },
        { ar: 'بَعْدَ الدَّرْسِ', tl: 'ba‘de’d-ders', tr: 'dersten sonra', en: 'after the lesson' }
      ],
      tips: ['<b>Kable</b>/<b>ba‘de</b>: Türkçedeki “badema” (bundan sonra = {{بَعْدَ مَا}}) ve “kablettarih” (tarih öncesi) ifadeleri buradan gelir.']
    },
    {
      h: 'Fiil + harf-i cer kalıpları',
      p: [
        'Bazı fiiller belirli bir harf-i cerle kullanılır ve bunlar Türkçeyle her zaman örtüşmez. Bu kalıpları fiille birlikte ezberle:'
      ],
      table: {
        cols: ['Kalıp', 'Anlam', 'Türkçeyle karşılaştır'],
        rows: [
          ['بَحَثَ عَنْ', '…-i aramak', '“-den araştırmak” değil, “-i aramak”'],
          ['سَأَلَ عَنْ', '…-i sormak (hakkında)', 'aynı mantık: “hakkında sormak”'],
          ['ذَهَبَ إِلَى', '…-e gitmek', 'birebir'],
          ['رَجَعَ مِنْ', '…-den dönmek', 'birebir'],
          ['دَخَلَ فِي', '…-e girmek (içine)', '“-de girmek” değil, “-e girmek”'],
          ['اِعْتَمَدَ عَلَى', '…-e güvenmek, dayanmak', '“üstüne dayanmak”'],
          ['اِنْتَظَرَ', '…-i beklemek', 'harf-i cer almaz'],
          ['شَكَرَ عَلَى', '…için teşekkür etmek', '“-e teşekkür” değil, “üzerine”']
        ]
      },
      ex: [
        { ar: 'أَبْحَثُ عَنْ مِفْتَاحِي', tl: 'ebhasu ‘an miftâhî', tr: 'Anahtarımı arıyorum.', en: 'I’m looking for my key.' },
        { ar: 'شُكْرًا عَلَى الْمُسَاعَدَةِ', tl: 'şukran ‘ale’l-musâ‘ade', tr: 'Yardım için teşekkürler.', en: 'Thanks for the help.' },
        { ar: 'أَنْتَظِرُكَ', tl: 'entazıruke', tr: 'Seni bekliyorum.', en: 'I’m waiting for you.', note: 'İngilizcede “wait <b>for</b>”, Arapçada harf-i cer yok!' }
      ]
    }
  ],
  keys: [
    '{{فِي}} -de, {{عَلَى}} üstünde, {{مِنْ}} -den, {{إِلَى}} -e, {{عَنْ}} hakkında, {{بِـ}} ile, {{لِـ}} için.',
    'Harf-i cerden sonra isim <b>esre</b> alır: {{فِي الْبَيْتِ}}.',
    'Zamirle: {{عَلَيْكَ}}، {{إِلَيْهِ}}، {{لَكَ}}، {{مِنْهُ}}، {{فِيهِ}}.',
    '{{لِـ}} + {{ال}} = {{لِلْـ}}: {{لِلطَّالِبِ}}.',
    'Fiil kalıplarını harf-i ceriyle ezberle: {{بَحَثَ عَنْ}} aramak, {{شَكَرَ عَلَى}} teşekkür etmek.'
  ],
  mistakes: [
    { bad: 'فِي الْبَيْتُ', good: 'فِي الْبَيْتِ', why: 'Harf-i cerden sonra isim esre alır.' },
    { bad: 'عَلَاكَ', good: 'عَلَيْكَ', why: '{{عَلَى}} zamir alınca elif ye’ye döner.' },
    { bad: 'لِالطَّالِبِ', good: 'لِلطَّالِبِ', why: '{{لِـ}} ile {{ال}} birleşince elif yazılmaz.' },
    { bad: 'أَبْحَثُ مِفْتَاحِي', good: 'أَبْحَثُ عَنْ مِفْتَاحِي', why: '{{بَحَثَ}} “aramak” anlamında {{عَنْ}} ile kullanılır.' }
  ],
  words: [
    { ar: 'فِي', tl: 'fî', tr: '-de, içinde', en: 'in' },
    { ar: 'عَلَى', tl: '‘alâ', tr: 'üstünde', en: 'on' },
    { ar: 'مِنْ', tl: 'min', tr: '-den', en: 'from' },
    { ar: 'إِلَى', tl: 'ilâ', tr: '-e (doğru)', en: 'to' },
    { ar: 'عَنْ', tl: '‘an', tr: 'hakkında', en: 'about' },
    { ar: 'بِـ', tl: 'bi', tr: 'ile (araç)', en: 'with, by' },
    { ar: 'لِـ', tl: 'li', tr: 'için', en: 'for' },
    { ar: 'مَعَ', tl: 'me‘a', tr: 'ile (birlikte)', en: 'with (together)' },
    { ar: 'عِنْدَ', tl: '‘inde', tr: 'yanında', en: 'at, by' },
    { ar: 'تَحْتَ', tl: 'tahte', tr: 'altında', en: 'under' },
    { ar: 'فَوْقَ', tl: 'fevka', tr: 'üstünde (yukarıda)', en: 'above' },
    { ar: 'أَمَامَ', tl: 'emâme', tr: 'önünde', en: 'in front of' },
    { ar: 'خَلْفَ', tl: 'halfe', tr: 'arkasında', en: 'behind' },
    { ar: 'بَيْنَ', tl: 'beyne', tr: 'arasında', en: 'between' },
    { ar: 'قَبْلَ', tl: 'kable', tr: 'önce', en: 'before' },
    { ar: 'بَعْدَ', tl: 'ba‘de', tr: 'sonra', en: 'after' }
  ],
  acts: [
    { type: 'flash', title: 'Harf-i cer kartları', desc: 'Harf-i cerleri ve yer zarflarını kartlarla öğren.', glyph: 'فِي' },
    {
      type: 'match', title: 'Anlamıyla eşleştir', desc: 'Harf-i ceri Türkçe karşılığına bağla.', glyph: 'مِنْ', items: [
        ['فِي', '-de, içinde'], ['عَلَى', 'üstünde'], ['مِنْ', '-den'], ['إِلَى', '-e doğru'], ['عَنْ', 'hakkında'],
        ['تَحْتَ', 'altında'], ['أَمَامَ', 'önünde'], ['خَلْفَ', 'arkasında'], ['بَيْنَ', 'arasında'], ['مَعَ', 'ile, birlikte']
      ]
    },
    {
      type: 'fill', title: 'Boşluğa harf-i cer', desc: 'Cümlenin anlamına uygun harf-i ceri seç.', glyph: '___', items: [
        { s: 'الطَّالِبُ ___ الْفَصْلِ', hint: 'Öğrenci sınıfta.', options: ['فِي', 'إِلَى', 'عَنْ'], a: 'فِي', tr: 'Öğrenci sınıfta.' },
        { s: 'الْكِتَابُ ___ الطَّاوِلَةِ', hint: 'Kitap masanın üstünde.', options: ['عَلَى', 'مِنْ', 'إِلَى'], a: 'عَلَى', tr: 'Kitap masanın üstünde.' },
        { s: 'ذَهَبْتُ ___ الْمَسْجِدِ', hint: 'Camiye gittim.', options: ['إِلَى', 'مِنْ', 'فِي'], a: 'إِلَى', tr: 'Camiye gittim.' },
        { s: 'رَجَعْتُ ___ الْمَدْرَسَةِ', hint: 'Okuldan döndüm.', options: ['مِنَ', 'إِلَى', 'عَلَى'], a: 'مِنَ', tr: 'Okuldan döndüm.', why: '{{مِنْ}} + ال = {{مِنَ الْـ}}.' },
        { s: 'أَبْحَثُ ___ قَلَمِي', hint: 'Kalemimi arıyorum.', options: ['عَنْ', 'فِي', 'إِلَى'], a: 'عَنْ', tr: 'Kalemimi arıyorum.', why: '{{بَحَثَ عَنْ}} kalıbı.' },
        { s: 'السَّلَامُ ___', hint: 'Selamün aleyküm.', options: ['عَلَيْكُمْ', 'إِلَيْكُمْ', 'لَكُمْ'], a: 'عَلَيْكُمْ', tr: 'Selam üzerinize olsun.' },
        { s: 'أَكْتُبُ ___', hint: 'Kalemle yazıyorum.', options: ['بِالْقَلَمِ', 'فِي الْقَلَمِ', 'لِلْقَلَمِ'], a: 'بِالْقَلَمِ', tr: 'Kalemle yazıyorum.', why: 'Araç bildiren “ile” = {{بِـ}}.' },
        { s: 'هٰذَا الْكِتَابُ ___', hint: 'Bu kitap öğrenci için.', options: ['لِلطَّالِبِ', 'لِالطَّالِبِ', 'لِلطَّالِبُ'], a: 'لِلطَّالِبِ', tr: 'Bu kitap öğrencinin.', why: '{{لِـ}} + ال = {{لِلْـ}}; isim esreli.' }
      ]
    },
    {
      type: 'mc', title: 'Esreyi yakala', desc: 'Harf-i cerden sonraki doğru biçimi seç.', glyph: 'ـِ', items: [
        { q: '“Evde” hangisidir?', options: ['فِي الْبَيْتِ', 'فِي الْبَيْتُ', 'فِي الْبَيْتَ', 'فِي بَيْتٌ'], a: 'فِي الْبَيْتِ', why: 'Harf-i cer → esre.' },
        { q: '“Büyük şehirde” hangisidir?', options: ['فِي الْمَدِينَةِ الْكَبِيرَةِ', 'فِي الْمَدِينَةِ الْكَبِيرَةُ', 'فِي الْمَدِينَةُ الْكَبِيرَةِ', 'فِي مَدِينَةِ الْكَبِيرَةِ'], a: 'فِي الْمَدِينَةِ الْكَبِيرَةِ', why: 'Sıfat da uyar: ikisi de esreli.' },
        { q: '“Ondan (erkek)” hangisidir?', options: ['مِنْهُ', 'مِنْهَا', 'مِنِّي', 'مِنْكَ'], a: 'مِنْهُ' },
        { q: '“Sana (erkeğe)” (yönelme) hangisidir?', options: ['إِلَيْكَ', 'إِلَاكَ', 'إِلَيْهِ', 'لِي'], a: 'إِلَيْكَ', why: '{{إِلَى}} + zamir → {{إِلَيْـ}}.' },
        { q: '{{عَلَيْهِمْ}} ne demektir?', options: ['onların üzerine', 'onlardan', 'onlar için', 'onlarla'], a: 'onların üzerine' },
        { q: '“Dersten sonra” hangisidir?', options: ['بَعْدَ الدَّرْسِ', 'قَبْلَ الدَّرْسِ', 'بَعْدَ الدَّرْسُ', 'بَعْدُ الدَّرْسِ'], a: 'بَعْدَ الدَّرْسِ' }
      ]
    },
    {
      type: 'order', title: 'Konumlu cümleler', desc: 'Kelimeleri dizerek nerede olduğunu söyle.', glyph: 'فِي…', items: [
        { tr: 'Kedi yatağın altında.', w: ['الْقِطَّةُ', 'تَحْتَ', 'السَّرِيرِ'] },
        { tr: 'Ben Türkiye’denim.', w: ['أَنَا', 'مِنْ', 'تُرْكِيَا'] },
        { tr: 'Okula gittim.', w: ['ذَهَبْتُ', 'إِلَى', 'الْمَدْرَسَةِ'] },
        { tr: 'Cami okulun önünde.', w: ['الْمَسْجِدُ', 'أَمَامَ', 'الْمَدْرَسَةِ'] },
        { tr: 'Yardım için teşekkürler.', w: ['شُكْرًا', 'عَلَى', 'الْمُسَاعَدَةِ'] }
      ]
    },
    {
      type: 'test', title: 'Harf-i cer testi', desc: 'Karma değerlendirme.', glyph: '؟', items: [
        { q: '“From” hangisidir?', options: ['مِنْ', 'إِلَى', 'فِي', 'عَلَى'], a: 'مِنْ' },
        { q: '{{عَنْ}} en çok hangi anlamda kullanılır?', options: ['hakkında', 'içinde', 'için', 'gibi'], a: 'hakkında' },
        { t: 'tf', s: 'Harf-i cerden sonra gelen isim ötre alır.', a: false, why: 'Esre alır (mecrûr).' },
        { t: 'tf', s: 'السَّلَامُ عَلَيْكُمْ ifadesinde عَلَى harf-i ceri vardır.', a: true },
        { t: 'fill', s: 'جَلَسْتُ ___ الْبَابِ', hint: 'Kapının arkasında oturdum.', options: ['خَلْفَ', 'أَمَامَ', 'فَوْقَ'], a: 'خَلْفَ', tr: 'Kapının arkasında oturdum.' },
        { t: 'order', tr: 'Kitap masanın üstünde.', w: ['الْكِتَابُ', 'عَلَى', 'الطَّاوِلَةِ'] },
        { q: '“Benim için” hangisidir?', options: ['لِي', 'مِنِّي', 'لَكَ', 'إِلَيَّ'], a: 'لِي' },
        { q: '“Seni bekliyorum” hangisidir?', options: ['أَنْتَظِرُكَ', 'أَنْتَظِرُ لَكَ', 'أَنْتَظِرُ عَلَيْكَ', 'أَنْتَظِرُ إِلَيْكَ'], a: 'أَنْتَظِرُكَ', why: '{{اِنْتَظَرَ}} harf-i cer almaz.' }
      ]
    }
  ]
});
