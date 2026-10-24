window.TOPICS = window.TOPICS || [];
TOPICS.push({
  id: 'gunler', n: 9, level: 'Başlangıç', glyph: 'ي',
  ar: 'الْأَيَّامُ وَالشُّهُورُ', name: 'Günler ve Aylar',
  desc: 'Haftanın günleri, miladi ve hicri aylar, dün–bugün–yarın ve tarih söyleme.',
  long: 'Haftanın günlerinin sayılardan nasıl türediğini, iki farklı miladi ay sistemini, hicri ayları ve “Bugün günlerden ne?” sorusunu öğren.',
  tags: 'günler aylar hafta pazartesi cuma ocak ramazan yevm şehr ahad ithnayn jumua bugün yarın dün tarih',
  readMins: 11,
  intro: 'Arapçada haftanın günlerinin çoğu <b>sayılardan</b> türemiştir: Pazar “birinci gün”, Pazartesi “ikinci gün”… Sayılar dersini bitirdiysen günleri neredeyse hiç ezberlemeden öğreneceksin. Ayrıca Türkçede yaşayan pek çok kelimeyle (Cuma, Ramazan, şevval…) tanışık olduğunu fark edeceksin.',
  lesson: [
    {
      h: 'Haftanın günleri',
      p: ['Günlerin önüne genellikle {{يَوْمُ}} (gün) getirilir: {{يَوْمُ الْأَحَدِ}} “pazar günü”. Haftanın ilk günü pazardır.'],
      table: {
        cols: ['Gün', 'Arapça', 'Okunuş', 'Kökü'],
        rows: [
          ['Pazar', 'الْأَحَدُ', 'el-ehad', 'أَحَد “bir” → 1. gün'],
          ['Pazartesi', 'الِاثْنَيْنِ', 'el-isneyn', 'اِثْنَان “iki” → 2. gün'],
          ['Salı', 'الثُّلَاثَاءُ', 'es-sulâsâ', 'ثَلَاثَة “üç” → 3. gün'],
          ['Çarşamba', 'الْأَرْبِعَاءُ', 'el-erbi‘â', 'أَرْبَعَة “dört” → 4. gün'],
          ['Perşembe', 'الْخَمِيسُ', 'el-hamîs', 'خَمْسَة “beş” → 5. gün'],
          ['Cuma', 'الْجُمُعَةُ', 'el-cum‘a', 'جَمَعَ “toplanmak” → toplanma günü'],
          ['Cumartesi', 'السَّبْتُ', 'es-sebt', 'سَبْت “dinlenme” (Sebt/Şabat)']
        ]
      },
      tips: [
        'Türkçe <b>Cuma</b> ({{الْجُمُعَةُ}}) Arapçadır: insanların cami için <b>toplandığı</b> gün. <b>Cumartesi</b> ise “Cuma ertesi”! Cemaat, cami, cem kelimeleri de aynı ج-م-ع kökünden.',
        'Türkçede de “çar-şamba” (4. gün) ve “per-şembe” (5. gün) Farsçada sayılardan türemiştir: Arapçayla aynı mantık.'
      ],
      cmp: { tr: 'Pazartesi, salı… günlerin adı Türkçede Farsçadan ve Arapçadan karışıktır.', en: 'İngilizce gün adları gezegen ve tanrılardan gelir (Sun-day, Moon-day). Arapçada ise çoğu sayıdır.' }
    },
    {
      h: 'Dün, bugün, yarın',
      table: {
        cols: ['Arapça', 'Okunuş', 'Türkçe', 'English'],
        rows: [
          ['أَمْسِ', 'emsi', 'dün', 'yesterday'],
          ['الْيَوْمَ', 'el-yevme', 'bugün', 'today'],
          ['غَدًا', 'ğaden', 'yarın', 'tomorrow'],
          ['بَعْدَ غَدٍ', 'ba‘de ğadin', 'öbür gün', 'the day after tomorrow'],
          ['أُسْبُوعٌ', 'usbû‘', 'hafta', 'week'],
          ['شَهْرٌ', 'şehr', 'ay', 'month'],
          ['سَنَةٌ', 'sene', 'yıl', 'year']
        ]
      },
      ex: [
        { ar: 'مَا الْيَوْمُ؟', tl: 'me’l-yevm?', tr: 'Bugün günlerden ne?', en: 'What day is it today?' },
        { ar: 'الْيَوْمُ الْجُمُعَةُ', tl: 'el-yevmu’l-cum‘a', tr: 'Bugün cuma.', en: 'Today is Friday.' },
        { ar: 'غَدًا السَّبْتُ', tl: 'ğaden es-sebt', tr: 'Yarın cumartesi.', en: 'Tomorrow is Saturday.' },
        { ar: 'كَانَ أَمْسِ الْخَمِيسَ', tl: 'kâne emsi’l-hamîs', tr: 'Dün perşembeydi.', en: 'Yesterday was Thursday.' }
      ],
      tips: ['{{الْيَوْمَ}} hem “gün” hem “bugün” demektir. “Gün” anlamında {{يَوْم}}, “bugün” zarfı olarak {{الْيَوْمَ}} (üstünlü) kullanılır. Türkçedeki <b>yevmiye</b> (günlük ücret) kelimesi buradan.']
    },
    {
      h: 'Günde bir şey yapmak: “pazartesi günü”',
      p: ['Bir olayın günü {{يَوْمَ}} (üstünlü) ya da {{فِي يَوْمِ}} ile söylenir: {{أَذْهَبُ إِلَى الْمَدْرَسَةِ يَوْمَ الْأَحَدِ}} “Pazar günü okula giderim.”'],
      ex: [
        { ar: 'أَدْرُسُ الْعَرَبِيَّةَ يَوْمَ الِاثْنَيْنِ', tl: 'edrusu’l-‘arabiyyete yevme’l-isneyn', tr: 'Pazartesi günü Arapça çalışırım.', en: 'I study Arabic on Monday.' },
        { ar: 'نُصَلِّي الْجُمُعَةَ فِي الْمَسْجِدِ', tl: 'nusallî’l-cum‘ate fi’l-mescid', tr: 'Cuma namazını camide kılarız.', en: 'We pray the Friday prayer at the mosque.' }
      ],
      cmp: { tr: '“Pazartesi <b>günü</b>” = {{يَوْمَ الِاثْنَيْنِ}}', en: '“<b>on</b> Monday” = {{يَوْمَ الِاثْنَيْنِ}}' }
    },
    {
      h: 'Miladi aylar: iki sistem',
      p: [
        'Arap dünyasında miladi aylar için <b>iki ayrı ad sistemi</b> kullanılır. Mısır ve Körfez ülkeleri Batı dillerinden alınan adları kullanır; Suriye, Lübnan, Ürdün ve Irak ise eski Süryanice kökenli adları kullanır.'
      ],
      table: {
        cols: ['Ay', 'Mısır / Körfez', 'Levant / Irak'],
        rows: [
          ['Ocak', 'يَنَايِرُ', 'كَانُونُ الثَّانِي'],
          ['Şubat', 'فِبْرَايِرُ', 'شُبَاطُ'],
          ['Mart', 'مَارِسُ', 'آذَارُ'],
          ['Nisan', 'أَبْرِيلُ', 'نَيْسَانُ'],
          ['Mayıs', 'مَايُو', 'أَيَّارُ'],
          ['Haziran', 'يُونْيُو', 'حَزِيرَانُ'],
          ['Temmuz', 'يُولْيُو', 'تَمُّوزُ'],
          ['Ağustos', 'أَغُسْطُسُ', 'آبُ'],
          ['Eylül', 'سِبْتَمْبِرُ', 'أَيْلُولُ'],
          ['Ekim', 'أُكْتُوبَرُ', 'تِشْرِينُ الْأَوَّلُ'],
          ['Kasım', 'نُوفَمْبِرُ', 'تِشْرِينُ الثَّانِي'],
          ['Aralık', 'دِيسَمْبِرُ', 'كَانُونُ الْأَوَّلُ']
        ]
      },
      tips: ['Sürpriz: Türkçedeki <b>Şubat, Nisan, Haziran, Temmuz, Eylül</b> ay adları ikinci sistemden gelir! {{شُبَاطُ}}، {{نَيْسَانُ}}، {{حَزِيرَانُ}}، {{تَمُّوزُ}}، {{أَيْلُولُ}}. Osmanlıcada Ekim “Teşrîn-i evvel”, Kasım “Teşrîn-i sânî”, Aralık “Kânûn-ı evvel”, Ocak “Kânûn-ı sânî” idi.']
    },
    {
      h: 'Hicri aylar',
      p: ['Ay takvimine dayalı hicri aylar dini günlerde ve bazı ülkelerde resmi tarihte kullanılır. Çoğunu Türkçeden tanıyorsun:'],
      table: {
        cols: ['Sıra', 'Arapça', 'Türkçede'],
        rows: [
          ['1', 'مُحَرَّمٌ', 'Muharrem'], ['2', 'صَفَرٌ', 'Safer'], ['3', 'رَبِيعٌ الْأَوَّلُ', 'Rebiülevvel'], ['4', 'رَبِيعٌ الْآخِرُ', 'Rebiülahir'],
          ['5', 'جُمَادَى الْأُولَى', 'Cemaziyelevvel'], ['6', 'جُمَادَى الْآخِرَةُ', 'Cemaziyelahir'], ['7', 'رَجَبٌ', 'Recep'], ['8', 'شَعْبَانُ', 'Şaban'],
          ['9', 'رَمَضَانُ', 'Ramazan'], ['10', 'شَوَّالٌ', 'Şevval'], ['11', 'ذُو الْقَعْدَةِ', 'Zilkade'], ['12', 'ذُو الْحِجَّةِ', 'Zilhicce']
        ]
      },
      tips: ['“Cemaziyelevvelini bilmek” deyimi buradan gelir: birinin geçmişini bilmek. {{رَبِيعٌ}} “bahar” demektir; <b>Rebiülevvel</b> “ilk bahar ayı”.']
    },
    {
      h: 'Tarih söylemek',
      p: [
        'Tarih: önce gün (sıra sayısıyla, genelde rakamla yazılır), sonra ay, sonra yıl. {{فِي}} ile “-de”: {{وُلِدْتُ فِي الْخَامِسِ مِنْ مَايُو}} “5 Mayıs’ta doğdum.”',
        '“Hangi ay?” = {{فِي أَيِّ شَهْرٍ؟}}, “Bugün ayın kaçı?” = {{مَا تَارِيخُ الْيَوْمِ؟}}'
      ],
      ex: [
        { ar: 'مَا تَارِيخُ الْيَوْمِ؟', tl: 'mâ târîhu’l-yevm?', tr: 'Bugün ayın kaçı? (Bugünün tarihi ne?)', en: 'What is the date today?' },
        { ar: 'صُمْنَا فِي رَمَضَانَ', tl: 'sumnâ fî Ramadân', tr: 'Ramazan’da oruç tuttuk.', en: 'We fasted in Ramadan.' },
        { ar: 'الشِّتَاءُ بَارِدٌ فِي يَنَايِرَ', tl: 'eş-şitâu bâridun fî Yenâyir', tr: 'Kış ocakta soğuktur.', en: 'Winter is cold in January.' }
      ],
      tips: ['Türkçedeki <b>tarih</b> kelimesi {{تَارِيخ}}’tir. “Şehr-i Ramazan” (Ramazan ayı) tamlamasındaki <b>şehr</b> de {{شَهْر}} “ay”dır; “şehir” ise Farsçadan gelen ayrı bir kelimedir.']
    }
  ],
  keys: [
    'Günler sayılardan: {{الْأَحَدُ}} (1) pazar, {{الِاثْنَيْنِ}} (2) pazartesi … {{الْخَمِيسُ}} (5) perşembe.',
    '{{الْجُمُعَةُ}} cuma = toplanma günü; {{السَّبْتُ}} cumartesi.',
    'Dün {{أَمْسِ}}, bugün {{الْيَوْمَ}}, yarın {{غَدًا}}.',
    '“Pazar günü” = {{يَوْمَ الْأَحَدِ}}. Soru: {{مَا الْيَوْمُ؟}}',
    'Miladi aylar iki sistemle söylenir: {{يَنَايِرُ}} / {{كَانُونُ الثَّانِي}} (ocak).'
  ],
  mistakes: [
    { bad: 'الْأَحَدُ = pazartesi', good: 'الْأَحَدُ = pazar', why: 'Haftanın birinci günü pazardır; {{أَحَد}} “bir” demektir.' },
    { bad: 'الْيَوْمُ يَوْمُ الْجُمُعَةُ', good: 'الْيَوْمُ يَوْمُ الْجُمُعَةِ', why: '{{يَوْمُ}} ile gün adı tamlama kurar; ikinci kelime esre alır.' }
  ],
  words: [
    { ar: 'يَوْم', tl: 'yevm', tr: 'gün', en: 'day' },
    { ar: 'الْأَحَد', tl: 'el-ehad', tr: 'pazar', en: 'Sunday' },
    { ar: 'الِاثْنَيْن', tl: 'el-isneyn', tr: 'pazartesi', en: 'Monday' },
    { ar: 'الثُّلَاثَاء', tl: 'es-sulâsâ', tr: 'salı', en: 'Tuesday' },
    { ar: 'الْأَرْبِعَاء', tl: 'el-erbi‘â', tr: 'çarşamba', en: 'Wednesday' },
    { ar: 'الْخَمِيس', tl: 'el-hamîs', tr: 'perşembe', en: 'Thursday' },
    { ar: 'الْجُمُعَة', tl: 'el-cum‘a', tr: 'cuma', en: 'Friday' },
    { ar: 'السَّبْت', tl: 'es-sebt', tr: 'cumartesi', en: 'Saturday' },
    { ar: 'أَمْسِ', tl: 'emsi', tr: 'dün', en: 'yesterday' },
    { ar: 'الْيَوْمَ', tl: 'el-yevme', tr: 'bugün', en: 'today' },
    { ar: 'غَدًا', tl: 'ğaden', tr: 'yarın', en: 'tomorrow' },
    { ar: 'أُسْبُوع', tl: 'usbû‘', tr: 'hafta', en: 'week' },
    { ar: 'شَهْر', tl: 'şehr', tr: 'ay (takvim)', en: 'month' },
    { ar: 'تَارِيخ', tl: 'târîh', tr: 'tarih', en: 'date' },
    { ar: 'رَمَضَان', tl: 'Ramadân', tr: 'Ramazan', en: 'Ramadan' }
  ],
  acts: [
    { type: 'flash', title: 'Gün ve zaman kelimeleri', desc: 'Haftanın günlerini ve zaman ifadelerini kartlarla öğren.', glyph: 'يَوْم' },
    {
      type: 'match', title: 'Günleri eşleştir', desc: 'Arapça gün adını Türkçesine bağla.', glyph: 'الْأَحَد', items: [
        ['الْأَحَدُ', 'pazar'], ['الِاثْنَيْنِ', 'pazartesi'], ['الثُّلَاثَاءُ', 'salı'], ['الْأَرْبِعَاءُ', 'çarşamba'], ['الْخَمِيسُ', 'perşembe'], ['الْجُمُعَةُ', 'cuma'], ['السَّبْتُ', 'cumartesi']
      ]
    },
    {
      type: 'mc', title: 'Sonraki gün', desc: 'Günlerin sırasını düşün.', glyph: '←', items: [
        { q: 'Bugün {{الْأَحَدُ}}. Yarın hangi gün?', options: ['الِاثْنَيْنِ', 'السَّبْتُ', 'الثُّلَاثَاءُ', 'الْجُمُعَةُ'], a: 'الِاثْنَيْنِ', why: 'Pazar → pazartesi (1 → 2).' },
        { q: 'Bugün {{الْخَمِيسُ}}. Yarın hangi gün?', options: ['الْجُمُعَةُ', 'الْأَرْبِعَاءُ', 'السَّبْتُ', 'الْأَحَدُ'], a: 'الْجُمُعَةُ', why: 'Perşembe → cuma.' },
        { q: 'Bugün {{الثُّلَاثَاءُ}}. Dün hangi gündü?', options: ['الِاثْنَيْنِ', 'الْأَرْبِعَاءُ', 'الْأَحَدُ', 'الْخَمِيسُ'], a: 'الِاثْنَيْنِ', why: 'Salı (3) → dün pazartesi (2).' },
        { q: 'Bugün {{السَّبْتُ}}. Yarın hangi gün?', options: ['الْأَحَدُ', 'الْجُمُعَةُ', 'الِاثْنَيْنِ', 'الْخَمِيسُ'], a: 'الْأَحَدُ', why: 'Cumartesi → pazar, yani haftanın “birinci” günü.' },
        { q: '“Yarın” hangisidir?', options: ['غَدًا', 'أَمْسِ', 'الْيَوْمَ', 'أُسْبُوعٌ'], a: 'غَدًا' },
        { q: 'Hangi gün adı “dört” sayısından gelir?', options: ['الْأَرْبِعَاءُ', 'الْخَمِيسُ', 'الثُّلَاثَاءُ', 'السَّبْتُ'], a: 'الْأَرْبِعَاءُ', why: '{{أَرْبَعَة}} → {{الْأَرْبِعَاءُ}} çarşamba.' },
        { q: 'Hicri takvimde oruç ayı?', options: ['رَمَضَانُ', 'شَوَّالٌ', 'رَجَبٌ', 'مُحَرَّمٌ'], a: 'رَمَضَانُ' },
        { q: 'Türkçedeki “Temmuz” ayının Arapça kaynağı?', options: ['تَمُّوزُ', 'يُولْيُو', 'آبُ', 'أَيْلُولُ'], a: 'تَمُّوزُ', why: 'Levant sistemindeki {{تَمُّوزُ}}.' }
      ]
    },
    {
      type: 'fill', title: 'Takvim cümleleri', desc: 'Zaman ifadelerini cümlelere yerleştir.', glyph: '___', items: [
        { s: '___ الْجُمُعَةُ', hint: 'Bugün cuma.', options: ['الْيَوْمُ', 'غَدًا', 'أَمْسِ'], a: 'الْيَوْمُ', tr: 'Bugün cuma.' },
        { s: '___ السَّبْتُ', hint: 'Yarın cumartesi.', options: ['غَدًا', 'الْيَوْمُ', 'أَمْسِ'], a: 'غَدًا', tr: 'Yarın cumartesi.' },
        { s: 'أَدْرُسُ يَوْمَ ___', hint: 'pazartesi', options: ['الِاثْنَيْنِ', 'الْأَحَدِ', 'الْخَمِيسِ'], a: 'الِاثْنَيْنِ', tr: 'Pazartesi günü ders çalışırım.' },
        { s: 'مَا ___ الْيَوْمِ؟', hint: 'Bugünün tarihi ne?', options: ['تَارِيخُ', 'التَّارِيخُ', 'يَوْمُ'], a: 'تَارِيخُ', tr: 'Bugünün tarihi ne?', why: 'Tamlamanın ilk kelimesi ال almaz.' },
        { s: 'فِي الْأُسْبُوعِ ___ أَيَّامٍ', hint: 'Haftada yedi gün var.', options: ['سَبْعَةُ', 'سَبْعُ', 'سَبْعُونَ'], a: 'سَبْعَةُ', tr: 'Haftada yedi gün var.', why: '{{يَوْم}} erkek → sayı ة’li (ters cinsiyet).' },
        { s: 'نَصُومُ فِي ___', hint: 'Ramazan’da oruç tutarız.', options: ['رَمَضَانَ', 'شَعْبَانَ', 'شَوَّالٍ'], a: 'رَمَضَانَ', tr: 'Ramazan’da oruç tutarız.' }
      ]
    },
    {
      type: 'test', title: 'Günler ve aylar testi', desc: 'Karma değerlendirme.', glyph: '؟', items: [
        { q: '{{الْخَمِيسُ}} hangi gündür?', options: ['perşembe', 'cuma', 'çarşamba', 'salı'], a: 'perşembe' },
        { q: '“Dün” hangisidir?', options: ['أَمْسِ', 'غَدًا', 'الْيَوْمَ', 'بَعْدَ غَدٍ'], a: 'أَمْسِ' },
        { t: 'tf', s: 'Arapçada haftanın ilk günü pazardır.', a: true, why: '{{الْأَحَدُ}} = “birinci”.' },
        { t: 'tf', s: 'Türkçedeki “Cumartesi” kelimesi “Cuma ertesi” demektir.', a: true },
        { t: 'order', tr: 'Bugün cuma.', w: ['الْيَوْمُ', 'الْجُمُعَةُ'] },
        { q: '“Ay (takvim)” hangisidir?', options: ['شَهْرٌ', 'قَمَرٌ', 'سَنَةٌ', 'أُسْبُوعٌ'], a: 'شَهْرٌ', why: '{{قَمَر}} gökteki aydır; takvim ayı {{شَهْر}}.' },
        { q: '{{الثُّلَاثَاءُ}} hangi gündür?', options: ['salı', 'pazartesi', 'çarşamba', 'cumartesi'], a: 'salı' },
        { q: '“Nisan” hangisidir?', options: ['أَبْرِيلُ', 'أُغُسْطُسُ', 'مَارِسُ', 'يُونْيُو'], a: 'أَبْرِيلُ', why: 'Diğer sistemde {{نَيْسَانُ}}.' }
      ]
    }
  ]
});
