window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'renkler', n: 6, level: 'Başlangıç', glyph: 'ل',
  ar: 'الْأَلْوَانُ', name: 'Renkler',
  desc: 'Temel renkler, أَفْعَلُ / فَعْلَاءُ kalıbı ve renk sıfatlarının çekimi.',
  long: 'Kırmızı, mavi, yeşil… Temel renklerin erkek, dişil ve çoğul biçimleri; -î ekiyle yapılan renkler ve “Bu ne renk?” sorusu.',
  tags: 'renk kırmızı mavi yeşil sarı beyaz siyah ahmar azraq akhdar asfar abyad aswad lawn',
  readMins: 9,
  intro: 'Renkler Arapçada sıfattır; bu yüzden Sıfatlar dersindeki uyum kuralları burada da geçerlidir. Ama temel renklerin <b>özel bir kalıbı</b> vardır: erkek için {{أَفْعَلُ}}, dişil için {{فَعْلَاءُ}}. Örneğin kırmızı: {{أَحْمَرُ}} (erkek) / {{حَمْرَاءُ}} (dişil).',
  lesson: [
    {
      h: 'Temel renkler ve kalıpları',
      p: ['Altı temel renk bu kalıpla çekimlenir. Her rengin erkek, dişil ve çoğul biçimi vardır:'],
      table: {
        cols: ['Renk', 'Erkek (أَفْعَلُ)', 'Dişil (فَعْلَاءُ)', 'Çoğul (فُعْلٌ)'],
        rows: [
          ['kırmızı', 'أَحْمَرُ', 'حَمْرَاءُ', 'حُمْرٌ'],
          ['mavi', 'أَزْرَقُ', 'زَرْقَاءُ', 'زُرْقٌ'],
          ['yeşil', 'أَخْضَرُ', 'خَضْرَاءُ', 'خُضْرٌ'],
          ['sarı', 'أَصْفَرُ', 'صَفْرَاءُ', 'صُفْرٌ'],
          ['beyaz', 'أَبْيَضُ', 'بَيْضَاءُ', 'بِيضٌ'],
          ['siyah', 'أَسْوَدُ', 'سَوْدَاءُ', 'سُودٌ']
        ]
      },
      tips: [
        'Kalıbı bir kez görürsen hepsini çözersin: <b>a-KıK-aK</b> erkek, <b>KaK-Kâ’</b> dişil. Kök harfleri: ح-م-ر (kırmızı), ز-ر-ق (mavi), خ-ض-ر (yeşil).',
        'Deniz ve yer adlarında hep karşına çıkar: <b>Beyaz Saray</b> = {{الْبَيْتُ الْأَبْيَضُ}}; <b>Akdeniz</b> = {{الْبَحْرُ الْأَبْيَضُ الْمُتَوَسِّطُ}} “ortadaki beyaz deniz”; <b>Karadeniz</b> = {{الْبَحْرُ الْأَسْوَدُ}}; <b>Kızıldeniz</b> = {{الْبَحْرُ الْأَحْمَرُ}}.'
      ]
    },
    {
      h: 'Renk + isim uyumu',
      p: [
        'Renk sıfatı da isimden sonra gelir ve cinsiyetine uyar: {{قَلَمٌ أَحْمَرُ}} “kırmızı bir kalem” ama {{سَيَّارَةٌ حَمْرَاءُ}} “kırmızı bir araba”.',
        'Dikkat: bu kalıptaki renkler <b>tenvin almaz</b> (gayr-i munsarif). Bu yüzden {{أَحْمَرٌ}} değil {{أَحْمَرُ}} yazılır; {{حَمْرَاءُ}} da tenvinsizdir.'
      ],
      ex: [
        { ar: 'قَلَمٌ أَحْمَرُ', tl: 'kalemun ahmeru', tr: 'kırmızı bir kalem', en: 'a red pen' },
        { ar: 'سَيَّارَةٌ حَمْرَاءُ', tl: 'seyyâratun hamrâu', tr: 'kırmızı bir araba', en: 'a red car' },
        { ar: 'السَّمَاءُ زَرْقَاءُ', tl: 'es-semâu zerkâu', tr: 'Gökyüzü mavidir.', en: 'The sky is blue.', note: '{{سَمَاء}} dişildir.' },
        { ar: 'الْقَمِيصُ الْأَبْيَضُ', tl: 'el-kamîsu’l-ebyadu', tr: 'beyaz gömlek', en: 'the white shirt' },
        { ar: 'شَجَرَةٌ خَضْرَاءُ', tl: 'şeceratun hadrâu', tr: 'yeşil bir ağaç', en: 'a green tree' },
        { ar: 'قِطَّةٌ سَوْدَاءُ', tl: 'kittatun sevdâu', tr: 'siyah bir kedi', en: 'a black cat' }
      ],
      cmp: {
        tr: 'Türkçede renk hiç değişmez: kırmızı kalem, kırmızı araba.',
        en: 'İngilizcede de değişmez: red pen, red car. Arapçada ismin cinsiyetine bakıp doğru biçimi seçmelisin.'
      }
    },
    {
      h: 'Diğer renkler: -î eki',
      p: [
        'Diğer renkler bir isme <b>{{ـِيٌّ}} (-î)</b> nispet eki getirilerek yapılır: {{بُرْتُقَال}} “portakal” → {{بُرْتُقَالِيٌّ}} “turuncu”. Bunlar normal sıfat gibi çekimlenir: dişili {{ـِيَّةٌ}}.',
        'Türkçede “kül rengi, gül rengi” deriz; Arapça bunu tek kelimeyle, -î ekiyle yapar. Türkçedeki <b>fıstıkî</b> yeşil, <b>gümüşî</b>, <b>lâciverdî</b> renk adları da aynı -î ekini taşır.'
      ],
      table: {
        cols: ['Erkek', 'Dişil', 'Anlam', 'Kökeni'],
        rows: [
          ['بُرْتُقَالِيٌّ', 'بُرْتُقَالِيَّةٌ', 'turuncu', 'portakal'],
          ['بُنِّيٌّ', 'بُنِّيَّةٌ', 'kahverengi', 'kahve çekirdeği (بُنّ)'],
          ['رَمَادِيٌّ', 'رَمَادِيَّةٌ', 'gri', 'kül (رَمَاد)'],
          ['وَرْدِيٌّ', 'وَرْدِيَّةٌ', 'pembe', 'gül (وَرْد)'],
          ['بَنَفْسَجِيٌّ', 'بَنَفْسَجِيَّةٌ', 'mor', 'menekşe (بَنَفْسَج)'],
          ['ذَهَبِيٌّ', 'ذَهَبِيَّةٌ', 'altın rengi', 'altın (ذَهَب)']
        ]
      },
      ex: [
        { ar: 'حَقِيبَةٌ بُنِّيَّةٌ', tl: 'hakîbetun bunniyyetun', tr: 'kahverengi bir çanta', en: 'a brown bag' },
        { ar: 'وَرْدَةٌ وَرْدِيَّةٌ', tl: 'verdetun verdiyyetun', tr: 'pembe bir gül', en: 'a pink rose' }
      ]
    },
    {
      h: '“Ne renk?” diye sormak',
      p: ['Soru: {{مَا لَوْنُ …؟}} “…’in rengi ne?”. Cevapta renk dişil isimle dişil olur.'],
      ex: [
        { ar: 'مَا لَوْنُ سَيَّارَتِكَ؟', tl: 'mâ levnu seyyâratike?', tr: 'Arabanın rengi ne?', en: 'What colour is your car?' },
        { ar: 'سَيَّارَتِي بَيْضَاءُ', tl: 'seyyâratî beydâu', tr: 'Arabam beyaz.', en: 'My car is white.' },
        { ar: 'مَا لَوْنُ الْقَلَمِ؟', tl: 'mâ levnu’l-kalemi?', tr: 'Kalemin rengi ne?', en: 'What colour is the pen?' },
        { ar: 'الْقَلَمُ أَزْرَقُ', tl: 'el-kalemu ezraku', tr: 'Kalem mavidir.', en: 'The pen is blue.' }
      ],
      tips: ['Türkçedeki <b>levn</b> (renk) kelimesi {{لَوْن}}’dur; çoğulu {{أَلْوَان}} “elvan”: “elvan elvan çiçekler”.']
    }
  ],
  keys: [
    'Temel renkler: erkek {{أَفْعَلُ}}, dişil {{فَعْلَاءُ}}: {{أَحْمَرُ}} / {{حَمْرَاءُ}}.',
    'Bu renkler tenvin almaz: {{قَلَمٌ أَحْمَرُ}} (ahmeru, “ahmerun” değil).',
    'Diğer renkler {{ـِيٌّ}} / {{ـِيَّةٌ}} ekiyle: {{بُنِّيٌّ}}، {{رَمَادِيٌّ}}، {{وَرْدِيٌّ}}.',
    'Soru: {{مَا لَوْنُ …؟}} “… ne renk?”'
  ],
  mistakes: [
    { bad: 'سَيَّارَةٌ أَحْمَرُ', good: 'سَيَّارَةٌ حَمْرَاءُ', why: 'Araba dişildir; renk de dişil kalıba ({{فَعْلَاءُ}}) girer.' },
    { bad: 'سَيَّارَةٌ أَحْمَرَةٌ', good: 'سَيَّارَةٌ حَمْرَاءُ', why: 'Temel renkler ة ile dişil yapılmaz; kendi kalıbı vardır.' },
    { bad: 'قَلَمٌ أَحْمَرٌ', good: 'قَلَمٌ أَحْمَرُ', why: '{{أَفْعَلُ}} kalıbı tenvin almaz.' }
  ],
  words: [
    { ar: 'أَحْمَر', tl: 'ahmer', tr: 'kırmızı', en: 'red' },
    { ar: 'أَزْرَق', tl: 'ezrak', tr: 'mavi', en: 'blue' },
    { ar: 'أَخْضَر', tl: 'ahdar', tr: 'yeşil', en: 'green' },
    { ar: 'أَصْفَر', tl: 'asfar', tr: 'sarı', en: 'yellow' },
    { ar: 'أَبْيَض', tl: 'ebyad', tr: 'beyaz', en: 'white' },
    { ar: 'أَسْوَد', tl: 'esved', tr: 'siyah', en: 'black' },
    { ar: 'بُرْتُقَالِيّ', tl: 'burtukâlî', tr: 'turuncu', en: 'orange' },
    { ar: 'بُنِّيّ', tl: 'bunnî', tr: 'kahverengi', en: 'brown' },
    { ar: 'رَمَادِيّ', tl: 'ramâdî', tr: 'gri', en: 'grey' },
    { ar: 'وَرْدِيّ', tl: 'verdî', tr: 'pembe', en: 'pink' },
    { ar: 'بَنَفْسَجِيّ', tl: 'benefsecî', tr: 'mor', en: 'purple' },
    { ar: 'لَوْن', tl: 'levn', tr: 'renk', en: 'colour' },
    { ar: 'سَمَاء', tl: 'semâ', tr: 'gökyüzü', en: 'sky' },
    { ar: 'قَمِيص', tl: 'kamîs', tr: 'gömlek', en: 'shirt' }
  ],
  acts: [
    { type: 'flash', title: 'Renk kartları', desc: 'Renkleri kartlarla öğren.', glyph: 'أَحْمَر' },
    {
      type: 'match', title: 'Erkek ↔ dişil', desc: 'Rengin erkek biçimini dişil biçimiyle eşleştir.', glyph: 'أَفْعَل', items: [
        ['أَحْمَرُ', 'حَمْرَاءُ'], ['أَزْرَقُ', 'زَرْقَاءُ'], ['أَخْضَرُ', 'خَضْرَاءُ'], ['أَصْفَرُ', 'صَفْرَاءُ'], ['أَبْيَضُ', 'بَيْضَاءُ'], ['أَسْوَدُ', 'سَوْدَاءُ']
      ]
    },
    {
      type: 'mc', title: 'Hangi renk?', desc: 'Nesnenin rengini Arapça bul.', glyph: 'لَوْن', items: [
        { q: 'Gökyüzü hangi renktir? {{السَّمَاءُ ___}}', options: ['زَرْقَاءُ', 'أَزْرَقُ', 'خَضْرَاءُ', 'سَوْدَاءُ'], a: 'زَرْقَاءُ', why: '{{سَمَاء}} dişildir → {{زَرْقَاءُ}}.' },
        { q: 'Kar hangi renktir? {{الثَّلْجُ ___}}', options: ['أَبْيَضُ', 'بَيْضَاءُ', 'أَسْوَدُ', 'أَصْفَرُ'], a: 'أَبْيَضُ', why: '{{ثَلْج}} (kar) erkektir → {{أَبْيَضُ}}.' },
        { q: 'Çimen hangi renktir? {{الْعُشْبُ ___}}', options: ['أَخْضَرُ', 'خَضْرَاءُ', 'أَحْمَرُ', 'أَزْرَقُ'], a: 'أَخْضَرُ', why: '{{عُشْب}} erkektir → {{أَخْضَرُ}}.' },
        { q: 'Muz hangi renktir? {{الْمَوْزَةُ ___}}', options: ['صَفْرَاءُ', 'أَصْفَرُ', 'حَمْرَاءُ', 'بَيْضَاءُ'], a: 'صَفْرَاءُ', why: '{{مَوْزَة}} (bir muz) dişildir → {{صَفْرَاءُ}}.' },
        { q: '“Gri” hangisidir?', options: ['رَمَادِيٌّ', 'بُنِّيٌّ', 'وَرْدِيٌّ', 'ذَهَبِيٌّ'], a: 'رَمَادِيٌّ', why: '{{رَمَاد}} kül → kül rengi.' },
        { q: '“Kahverengi bir çanta” hangisidir?', options: ['حَقِيبَةٌ بُنِّيَّةٌ', 'حَقِيبَةٌ بُنِّيٌّ', 'بُنِّيَّةٌ حَقِيبَةٌ', 'حَقِيبَةٌ أَبْنُ'], a: 'حَقِيبَةٌ بُنِّيَّةٌ', why: 'Dişil isim → -iyye eki; sıfat sonra.' },
        { q: 'Karadeniz Arapçada nedir?', options: ['الْبَحْرُ الْأَسْوَدُ', 'الْبَحْرُ الْأَحْمَرُ', 'الْبَحْرُ الْأَبْيَضُ', 'الْبَحْرُ سَوْدَاءُ'], a: 'الْبَحْرُ الْأَسْوَدُ', why: '{{بَحْر}} erkek; belirli isim + belirli sıfat.' }
      ]
    },
    {
      type: 'fill', title: 'Rengi uydur', desc: 'İsmin cinsiyetine göre doğru renk biçimini seç.', glyph: '___', items: [
        { s: 'سَيَّارَةٌ ___', hint: 'kırmızı', options: ['حَمْرَاءُ', 'أَحْمَرُ', 'أَحْمَرَةٌ'], a: 'حَمْرَاءُ', tr: 'kırmızı bir araba', why: 'Dişil isim → {{فَعْلَاءُ}}.' },
        { s: 'قَلَمٌ ___', hint: 'mavi', options: ['أَزْرَقُ', 'زَرْقَاءُ', 'أَزْرَقٌ'], a: 'أَزْرَقُ', tr: 'mavi bir kalem', why: 'Erkek isim → {{أَفْعَلُ}}; tenvin yok.' },
        { s: 'الْقَمِيصُ ___', hint: 'beyaz gömlek', options: ['الْأَبْيَضُ', 'أَبْيَضُ', 'الْبَيْضَاءُ'], a: 'الْأَبْيَضُ', tr: 'beyaz gömlek', why: 'Belirli isim → belirli renk.' },
        { s: 'قِطَّةٌ ___', hint: 'siyah', options: ['سَوْدَاءُ', 'أَسْوَدُ', 'سُودٌ'], a: 'سَوْدَاءُ', tr: 'siyah bir kedi', why: '{{قِطَّة}} dişil.' },
        { s: 'وَرْدَةٌ ___', hint: 'pembe', options: ['وَرْدِيَّةٌ', 'وَرْدِيٌّ', 'وَرْدَاءُ'], a: 'وَرْدِيَّةٌ', tr: 'pembe bir gül', why: '-î renkleri ة ile dişil olur: {{ـِيَّةٌ}}.' },
        { s: 'مَا ___ سَيَّارَتِكَ؟', options: ['لَوْنُ', 'أَلْوَانُ', 'اللَّوْنُ'], a: 'لَوْنُ', tr: 'Arabanın rengi ne?', why: 'Tamlamanın ilk kelimesi ال almaz.' }
      ]
    },
    {
      type: 'test', title: 'Renkler testi', desc: 'Karma değerlendirme.', glyph: '؟', items: [
        { q: '“Yeşil” (dişil) hangisidir?', options: ['خَضْرَاءُ', 'أَخْضَرُ', 'خُضْرٌ', 'خَضِرَةٌ'], a: 'خَضْرَاءُ' },
        { q: '{{أَصْفَرُ}} ne demektir?', options: ['sarı', 'kırmızı', 'yeşil', 'turuncu'], a: 'sarı' },
        { t: 'tf', s: 'سَيَّارَةٌ بَيْضَاءُ “beyaz bir araba” demektir.', a: true },
        { t: 'tf', s: 'أَحْمَرُ kalıbındaki renkler tenvin alır.', a: false, why: 'Tenvin almazlar: {{أَحْمَرُ}}.' },
        { t: 'order', tr: 'Gökyüzü mavidir.', w: ['السَّمَاءُ', 'زَرْقَاءُ'] },
        { t: 'order', tr: 'Arabam beyaz.', w: ['سَيَّارَتِي', 'بَيْضَاءُ'] },
        { q: '“Renk” kelimesi?', options: ['لَوْنٌ', 'لَيْلٌ', 'وَرْدٌ', 'رَمَادٌ'], a: 'لَوْنٌ' },
        { t: 'fill', s: 'الْبَحْرُ ___', hint: 'Kızıldeniz', options: ['الْأَحْمَرُ', 'حَمْرَاءُ', 'الْحَمْرَاءُ'], a: 'الْأَحْمَرُ', tr: 'Kızıldeniz' }
      ]
    }
  ]
});
