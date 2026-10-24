window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'soru', n: 4, level: 'Başlangıç', glyph: '؟',
  ar: 'أَدَوَاتُ الِاسْتِفْهَامِ', name: 'Soru Kelimeleri',
  desc: 'Ne, kim, nerede, ne zaman, nasıl, kaç, neden ve evet/hayır soruları.',
  long: 'مَا، مَنْ، أَيْنَ، مَتَى، كَيْفَ، كَمْ، لِمَاذَا ve هَلْ ile soru sormayı, cevap vermeyi öğren. Günlük konuşmanın kapısı.',
  tags: 'soru ne kim nerede ne zaman nasıl kaç neden hal ma man ayna mata kayfa kam limaza',
  readMins: 10,
  intro: 'Bir dilde ilk sorulacak sorular: “Bu ne?”, “Sen kimsin?”, “Nerelisin?”. Arapçada soru kelimeleri <b>cümlenin başına</b> gelir ve cümlenin geri kalanı değişmez. Soru işareti de ters yöndedir: <b>؟</b>',
  lesson: [
    {
      h: 'Temel soru kelimeleri',
      table: {
        cols: ['Soru', 'Okunuş', 'Türkçe', 'English'],
        rows: [
          ['مَا', 'mâ', 'ne? (isimle)', 'what?'],
          ['مَاذَا', 'mâzâ', 'ne? (fiille)', 'what?'],
          ['مَنْ', 'men', 'kim?', 'who?'],
          ['أَيْنَ', 'eyne', 'nerede?', 'where?'],
          ['مِنْ أَيْنَ', 'min eyne', 'nereden?', 'where from?'],
          ['مَتَى', 'metâ', 'ne zaman?', 'when?'],
          ['كَيْفَ', 'keyfe', 'nasıl?', 'how?'],
          ['كَمْ', 'kem', 'kaç? ne kadar?', 'how many?'],
          ['لِمَاذَا', 'limâzâ', 'neden?', 'why?'],
          ['أَيّ', 'eyy', 'hangi?', 'which?'],
          ['هَلْ', 'hel', 'mi? (evet/hayır)', 'do / is…?']
        ]
      },
      tips: ['“Keyif” kelimesi {{كَيْفَ}} (nasıl) ile aynı kökten gelir: “Keyfin nasıl?” = {{كَيْفَ حَالُكَ؟}} “Halin nasıl?”. Türkçedeki “hal” de Arapça {{حَال}}’dir.']
    },
    {
      h: 'مَا ve مَاذَا: “ne?”',
      p: [
        '{{مَا}} genellikle <b>isim cümlesinde</b> kullanılır: {{مَا هٰذَا؟}} “Bu ne?”, {{مَا اسْمُكَ؟}} “Adın ne?”. {{مَاذَا}} ise <b>fiilden önce</b> gelir: {{مَاذَا تَفْعَلُ؟}} “Ne yapıyorsun?”'
      ],
      ex: [
        { ar: 'مَا اسْمُكَ؟', tl: 'mâ’smuke?', tr: 'Adın ne?', en: 'What is your name?' },
        { ar: 'اسْمِي أَحْمَدُ', tl: 'ismî Ahmedu', tr: 'Adım Ahmet.', en: 'My name is Ahmed.' },
        { ar: 'مَاذَا تَشْرَبُ؟', tl: 'mâzâ teşrabu?', tr: 'Ne içiyorsun? / Ne içersin?', en: 'What are you drinking?' },
        { ar: 'مَا هٰذِهِ؟', tl: 'mâ hâzihî?', tr: 'Bu ne? (dişil bir şey için)', en: 'What is this?' }
      ]
    },
    {
      h: 'مَنْ, أَيْنَ, مَتَى, كَيْفَ',
      ex: [
        { ar: 'مَنْ هٰذَا؟', tl: 'men hâzâ?', tr: 'Bu kim?', en: 'Who is this?' },
        { ar: 'أَيْنَ الْمَسْجِدُ؟', tl: 'eyne’l-mescidu?', tr: 'Cami nerede?', en: 'Where is the mosque?' },
        { ar: 'مِنْ أَيْنَ أَنْتَ؟', tl: 'min eyne ente?', tr: 'Nerelisin?', en: 'Where are you from?' },
        { ar: 'أَنَا مِنْ تُرْكِيَا', tl: 'ene min Turkiyâ', tr: 'Türkiye’denim.', en: 'I am from Turkey.' },
        { ar: 'مَتَى الدَّرْسُ؟', tl: 'metâ’d-dersu?', tr: 'Ders ne zaman?', en: 'When is the lesson?' },
        { ar: 'كَيْفَ حَالُكَ؟', tl: 'keyfe hâluke?', tr: 'Nasılsın?', en: 'How are you?' },
        { ar: 'بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ', tl: 'bi-hayrin, ve’l-hamdu lillâh', tr: 'İyiyim, elhamdülillah.', en: 'Fine, praise be to God.' }
      ],
      tips: ['Cevaplarken soru kelimesini atıp cevabı koyman yeterli: {{أَيْنَ الْكِتَابُ؟}} → {{الْكِتَابُ هُنَا}} “Kitap burada.” Yer zarfları: {{هُنَا}} burada, {{هُنَاكَ}} orada.']
    },
    {
      h: 'كَمْ: kaç? + tekil, üstünlü isim',
      p: [
        '{{كَمْ}} “kaç” anlamındadır ve kendisinden sonra gelen isim <b>tekil</b> ve <b>tenvinli üstün</b> (-en) olur: {{كَمْ كِتَابًا؟}} “Kaç kitap?” Türkçede de “kaç kitap<s>lar</s>” demeyiz; tekil kullanırız!',
        'Fiyat sorarken: {{بِكَمْ هٰذَا؟}} “Bu kaça?”'
      ],
      ex: [
        { ar: 'كَمْ أَخًا لَكَ؟', tl: 'kem ehan leke?', tr: 'Kaç erkek kardeşin var?', en: 'How many brothers do you have?' },
        { ar: 'كَمْ طَالِبًا فِي الْفَصْلِ؟', tl: 'kem tâliben fi’l-fasl?', tr: 'Sınıfta kaç öğrenci var?', en: 'How many students are in the class?' },
        { ar: 'بِكَمْ هٰذَا؟', tl: 'bi-kem hâzâ?', tr: 'Bu kaça? / Bunun fiyatı ne?', en: 'How much is this?' }
      ],
      cmp: { tr: '“Kaç <b>kitap</b>?” — tekil. Arapça da tekil ister: {{كَمْ كِتَابًا}}.', en: 'İngilizcede “how many <b>books</b>” çoğuldur; Arapçaya çevirirken çoğulu tekile çevir.' }
    },
    {
      h: 'هَلْ ve أَ: evet / hayır soruları',
      p: [
        'Bir cümleyi evet/hayır sorusuna çevirmek için başına {{هَلْ}} (ya da kısaca {{أَ}}) eklenir. Türkçedeki <b>“mi”</b> ekinin işini görür, ama cümlenin başında durur.',
        'Cevap: {{نَعَمْ}} (evet) ya da {{لَا}} (hayır).'
      ],
      ex: [
        { ar: 'هَلْ أَنْتَ طَالِبٌ؟', tl: 'hel ente tâlibun?', tr: 'Sen öğrenci misin?', en: 'Are you a student?' },
        { ar: 'نَعَمْ، أَنَا طَالِبٌ', tl: 'na‘am, ene tâlibun', tr: 'Evet, öğrenciyim.', en: 'Yes, I am a student.' },
        { ar: 'هَلْ عِنْدَكَ سَيَّارَةٌ؟', tl: 'hel ‘indeke seyyâratun?', tr: 'Araban var mı?', en: 'Do you have a car?' },
        { ar: 'لَا، لَيْسَ عِنْدِي سَيَّارَةٌ', tl: 'lâ, leyse ‘indî seyyâratun', tr: 'Hayır, arabam yok.', en: 'No, I don’t have a car.' },
        { ar: 'أَهٰذَا بَيْتُكَ؟', tl: 'e-hâzâ beytuke?', tr: 'Bu senin evin mi?', en: 'Is this your house?' }
      ],
      cmp: {
        tr: 'Türkçe soruyu <b>sona</b> eklenen “mi” ile yapar: öğrenci <b>misin</b>?',
        en: 'İngilizce yardımcı fiili başa alır: <b>Are</b> you…? <b>Do</b> you…? Arapçada yalnızca {{هَلْ}} eklenir, kelime sırası değişmez.'
      }
    },
    {
      h: 'لِمَاذَا ve لِأَنَّ: neden? çünkü',
      p: ['{{لِمَاذَا}} “neden” sorusuna {{لِأَنَّ}} “çünkü” ile cevap verilir. {{لِأَنَّ}}’den sonra isim ya da bitişik zamir gelir: {{لِأَنَّنِي}} “çünkü ben…”'],
      ex: [
        { ar: 'لِمَاذَا تَدْرُسُ الْعَرَبِيَّةَ؟', tl: 'limâzâ tedrusu’l-‘arabiyye?', tr: 'Neden Arapça öğreniyorsun?', en: 'Why do you study Arabic?' },
        { ar: 'لِأَنَّهَا لُغَةٌ جَمِيلَةٌ', tl: 'li-ennehâ luğatun cemîletun', tr: 'Çünkü güzel bir dil.', en: 'Because it is a beautiful language.' }
      ]
    }
  ],
  keys: [
    'Soru kelimesi cümlenin başına gelir; soru işareti ters: <b>؟</b>',
    '{{مَا}} isimle (“Bu ne?”), {{مَاذَا}} fiille (“Ne yapıyorsun?”) kullanılır.',
    '{{كَمْ}} + tekil ve -en tenvinli isim: {{كَمْ كِتَابًا؟}}',
    '{{هَلْ}} = Türkçedeki “mi?” Cevap {{نَعَمْ}} / {{لَا}}.',
    '{{مِنْ أَيْنَ أَنْتَ؟}} “Nerelisin?” — {{أَنَا مِنْ تُرْكِيَا}}.'
  ],
  mistakes: [
    { bad: 'كَمْ كُتُبٌ؟', good: 'كَمْ كِتَابًا؟', why: '{{كَمْ}}’den sonra isim tekil ve üstün tenvinli olur.' },
    { bad: 'أَنْتَ طَالِبٌ هَلْ؟', good: 'هَلْ أَنْتَ طَالِبٌ؟', why: 'Türkçedeki “mi” sonda olsa da {{هَلْ}} her zaman başa gelir.' },
    { bad: 'مَاذَا هٰذَا؟', good: 'مَا هٰذَا؟', why: 'İsim cümlesinde (fiil yokken) genelde {{مَا}} tercih edilir.' }
  ],
  words: [
    { ar: 'مَا', tl: 'mâ', tr: 'ne?', en: 'what?' },
    { ar: 'مَاذَا', tl: 'mâzâ', tr: 'ne? (fiille)', en: 'what? (with verbs)' },
    { ar: 'مَنْ', tl: 'men', tr: 'kim?', en: 'who?' },
    { ar: 'أَيْنَ', tl: 'eyne', tr: 'nerede?', en: 'where?' },
    { ar: 'مَتَى', tl: 'metâ', tr: 'ne zaman?', en: 'when?' },
    { ar: 'كَيْفَ', tl: 'keyfe', tr: 'nasıl?', en: 'how?' },
    { ar: 'كَمْ', tl: 'kem', tr: 'kaç?', en: 'how many?' },
    { ar: 'لِمَاذَا', tl: 'limâzâ', tr: 'neden?', en: 'why?' },
    { ar: 'هَلْ', tl: 'hel', tr: '…mi? (soru)', en: 'is / do…? (yes-no)' },
    { ar: 'أَيّ', tl: 'eyy', tr: 'hangi?', en: 'which?' },
    { ar: 'نَعَمْ', tl: 'na‘am', tr: 'evet', en: 'yes' },
    { ar: 'لَا', tl: 'lâ', tr: 'hayır', en: 'no' },
    { ar: 'لِأَنَّ', tl: 'li-enne', tr: 'çünkü', en: 'because' },
    { ar: 'هُنَا', tl: 'hunâ', tr: 'burada', en: 'here' },
    { ar: 'هُنَاكَ', tl: 'hunâke', tr: 'orada', en: 'there' },
    { ar: 'اسْم', tl: 'ism', tr: 'isim, ad', en: 'name' }
  ],
  acts: [
    { type: 'flash', title: 'Soru kelimeleri', desc: 'Soru kelimelerini kartlarla tanı ve telaffuzunu dinle.', glyph: 'مَنْ' },
    {
      type: 'match', title: 'Soruyu eşleştir', desc: 'Soru kelimesini Türkçe karşılığına bağla.', glyph: 'أَيْنَ', items: [
        ['مَنْ', 'kim?'], ['أَيْنَ', 'nerede?'], ['مَتَى', 'ne zaman?'], ['كَيْفَ', 'nasıl?'], ['كَمْ', 'kaç?'],
        ['لِمَاذَا', 'neden?'], ['مَا', 'ne?'], ['هَلْ', '…mi?'], ['أَيّ', 'hangi?'], ['مِنْ أَيْنَ', 'nereden?']
      ]
    },
    {
      type: 'mc', title: 'Soru-cevap', desc: 'Cevaba bakıp hangi sorunun sorulduğunu bul.', glyph: '؟ ←', items: [
        { q: 'Cevap: {{الْكِتَابُ عَلَى الْمَكْتَبِ}} “Kitap masanın üstünde.” Soru neydi?', options: ['أَيْنَ الْكِتَابُ؟', 'مَتَى الْكِتَابُ؟', 'مَنِ الْكِتَابُ؟', 'كَمْ كِتَابًا؟'], a: 'أَيْنَ الْكِتَابُ؟', why: 'Yer bildiren cevap → {{أَيْنَ}}.' },
        { q: 'Cevap: {{أَنَا مِنْ تُرْكِيَا}} Soru neydi?', options: ['مِنْ أَيْنَ أَنْتَ؟', 'مَنْ أَنْتَ؟', 'كَيْفَ حَالُكَ؟', 'مَا اسْمُكَ؟'], a: 'مِنْ أَيْنَ أَنْتَ؟', why: '“Nerelisin?” → {{مِنْ أَيْنَ}}.' },
        { q: 'Cevap: {{بِخَيْرٍ}} “İyiyim.” Soru neydi?', options: ['كَيْفَ حَالُكَ؟', 'أَيْنَ أَنْتَ؟', 'مَتَى الدَّرْسُ؟', 'لِمَاذَا؟'], a: 'كَيْفَ حَالُكَ؟', why: 'Hal hatır sorusu → {{كَيْفَ}}.' },
        { q: 'Cevap: {{هٰذَا أَبِي}} “Bu babam.” Soru neydi?', options: ['مَنْ هٰذَا؟', 'مَا هٰذَا؟', 'أَيْنَ هٰذَا؟', 'كَمْ هٰذَا؟'], a: 'مَنْ هٰذَا؟', why: 'İnsan için “kim” → {{مَنْ}}.' },
        { q: 'Cevap: {{ثَلَاثَةُ إِخْوَةٍ}} “Üç kardeş.” Soru neydi?', options: ['كَمْ أَخًا لَكَ؟', 'مَنْ أَخُوكَ؟', 'أَيْنَ أَخُوكَ؟', 'هَلْ لَكَ أَخٌ؟'], a: 'كَمْ أَخًا لَكَ؟', why: 'Sayı → {{كَمْ}}.' },
        { q: 'Cevap: {{نَعَمْ، أَنَا طَالِبٌ}} Soru neydi?', options: ['هَلْ أَنْتَ طَالِبٌ؟', 'مَنْ أَنْتَ؟', 'مَا أَنْتَ؟', 'أَيْنَ الطَّالِبُ؟'], a: 'هَلْ أَنْتَ طَالِبٌ؟', why: 'Evet/hayır cevabı → {{هَلْ}}.' },
        { q: 'Cevap: {{لِأَنَّنِي مَرِيضٌ}} “Çünkü hastayım.” Soru neydi?', options: ['لِمَاذَا لَا تَذْهَبُ؟', 'أَيْنَ تَذْهَبُ؟', 'مَتَى تَذْهَبُ؟', 'كَيْفَ تَذْهَبُ؟'], a: 'لِمَاذَا لَا تَذْهَبُ؟', why: '“Çünkü” cevabı → {{لِمَاذَا}}.' },
        { q: 'Cevap: {{غَدًا}} “Yarın.” Soru neydi?', options: ['مَتَى تُسَافِرُ؟', 'أَيْنَ تُسَافِرُ؟', 'كَمْ تُسَافِرُ؟', 'مَنْ يُسَافِرُ؟'], a: 'مَتَى تُسَافِرُ؟', why: 'Zaman → {{مَتَى}}.' }
      ]
    },
    {
      type: 'fill', title: 'Soruyu tamamla', desc: 'Boşluğa doğru soru kelimesini yerleştir.', glyph: '___؟', items: [
        { s: '___ اسْمُكَ؟', options: ['مَا', 'مَنْ', 'كَمْ'], a: 'مَا', tr: 'Adın ne?', why: 'Ad bir şeydir → {{مَا}}.' },
        { s: '___ أَنْتَ؟', options: ['مَنْ', 'مَا', 'مَتَى'], a: 'مَنْ', tr: 'Sen kimsin?', why: 'Kişi → {{مَنْ}}.' },
        { s: '___ تَفْعَلُ؟', options: ['مَاذَا', 'مَنْ', 'أَيْنَ'], a: 'مَاذَا', tr: 'Ne yapıyorsun?', why: 'Fiilden önce “ne” → {{مَاذَا}}.' },
        { s: '___ الْمَطْعَمُ؟', options: ['أَيْنَ', 'كَمْ', 'مَنْ'], a: 'أَيْنَ', tr: 'Restoran nerede?', why: 'Yer → {{أَيْنَ}}.' },
        { s: '___ عِنْدَكَ أَخٌ؟', options: ['هَلْ', 'مَا', 'كَيْفَ'], a: 'هَلْ', tr: 'Erkek kardeşin var mı?', why: 'Evet/hayır sorusu → {{هَلْ}}.' },
        { s: 'كَمْ ___ فِي الْفَصْلِ؟', options: ['طَالِبًا', 'طُلَّابٌ', 'الطَّالِبُ'], a: 'طَالِبًا', tr: 'Sınıfta kaç öğrenci var?', why: '{{كَمْ}} + tekil ve -en tenvinli isim.' },
        { s: '___ هٰذَا؟', hint: 'Fiyat soruyorsun', options: ['بِكَمْ', 'لِمَاذَا', 'مَتَى'], a: 'بِكَمْ', tr: 'Bu kaça?', why: 'Fiyat: {{بِكَمْ}} “kaça”.' }
      ]
    },
    {
      type: 'order', title: 'Soru cümlesi kur', desc: 'Kelimeleri dizerek soru oluştur.', glyph: 'هَلْ…؟', items: [
        { tr: 'Nerelisin?', w: ['مِنْ', 'أَيْنَ', 'أَنْتَ؟'] },
        { tr: 'Sen öğrenci misin?', w: ['هَلْ', 'أَنْتَ', 'طَالِبٌ؟'] },
        { tr: 'Kitap nerede?', w: ['أَيْنَ', 'الْكِتَابُ؟'] },
        { tr: 'Nasılsın? (Halin nasıl?)', w: ['كَيْفَ', 'حَالُكَ؟'] },
        { tr: 'Araban var mı?', w: ['هَلْ', 'عِنْدَكَ', 'سَيَّارَةٌ؟'] }
      ]
    },
    {
      type: 'test', title: 'Soru kelimeleri testi', desc: 'Karma değerlendirme.', glyph: '؟', items: [
        { q: '“When?” hangisidir?', options: ['مَتَى', 'أَيْنَ', 'كَيْفَ', 'كَمْ'], a: 'مَتَى' },
        { q: '{{كَيْفَ حَالُكَ؟}} ne demektir?', options: ['Nasılsın?', 'Nerelisin?', 'Adın ne?', 'Kaç yaşındasın?'], a: 'Nasılsın?' },
        { t: 'tf', s: 'هَلْ Türkçedeki “mi” gibi cümlenin sonuna gelir.', a: false, why: '{{هَلْ}} her zaman başa gelir.' },
        { t: 'fill', s: '___ تَدْرُسُ الْعَرَبِيَّةَ؟', hint: 'Neden?', options: ['لِمَاذَا', 'مَاذَا', 'مَنْ'], a: 'لِمَاذَا', tr: 'Neden Arapça öğreniyorsun?' },
        { q: '“Kaç kitap?” doğru biçim hangisi?', options: ['كَمْ كِتَابًا؟', 'كَمْ كُتُبٌ؟', 'كَمِ الْكُتُبُ؟', 'كَمْ كِتَابٌ؟'], a: 'كَمْ كِتَابًا؟', why: 'Tekil + -en tenvin.' },
        { t: 'order', tr: 'Adın ne?', w: ['مَا', 'اسْمُكَ؟'] },
        { q: '“Hayır” hangisidir?', options: ['لَا', 'نَعَمْ', 'هَلْ', 'مَا'], a: 'لَا' },
        { q: '{{مِنْ أَيْنَ}} ne demektir?', options: ['nereden', 'nerede', 'ne zaman', 'kimden'], a: 'nereden' }
      ]
    }
  ]
});
