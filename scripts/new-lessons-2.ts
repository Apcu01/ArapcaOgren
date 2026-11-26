/* Yeni dersler (18-21): Vücut ve Sağlık, Kıyafetler ve Giyinmek, Hava Durumu ve Mevsimler, Meslekler ve İş.
   Yükleme: npx tsx scripts/add-lessons.ts (kullanım betiğin başında). Biçim yönetim panelindeki ders şemasıyla aynıdır. */
import { LISTEN, SPEAK, type LessonDraft } from './new-lessons';

const ENDLESS = { type: 'endless' as const, title: 'Sınırsız kelime pratiği', desc: 'Bu dersin kelimeleri farklı biçimlerde sorulur: anlamını bul, Arapçasını bul, dinleyip bul. Bitene kadar devam eder.', glyph: '∞', items: null };

export const NEW_LESSONS_2: LessonDraft[] = [
  /* ---------------------------------------------------------------- 18. Vücut ve Sağlık */
  {
    id: 'vucut', n: 18, level: 'Başlangıç', glyph: 'ج', ar: 'الْجِسْمُ وَالصِّحَّةُ', name: 'Vücut ve Sağlık',
    desc: 'Vücudun bölümleri, çift organlar ve doktorda konuşmak: {{رَأْسِي يُؤْلِمُنِي}} "Başım ağrıyor."',
    long: 'Baş, yüz ve vücudun bölümleri; göz, kulak, el ve ayak gibi çift organların dişil oluşu ve ikil hâli; bir yerinin ağrıdığını söylemek, doktorla konuşmak ve "geçmiş olsun" demek.',
    tags: 'vücut beden baş yüz göz kulak burun ağız saç diş el ayak bacak karın sırt kalp sağlık hasta doktor ağrı ateş öksürük nezle ilaç eczane hastane geçmiş olsun ras ayn yad ricl marid tabib dawa suda',
    readMins: 12,
    intro: 'Bu derste vücudunu Arapça anlatmayı ve doktorda derdini söylemeyi öğreneceksin. Önce baş ve yüz, sonra vücudun diğer bölümleri. Çift olan organların ilginç bir özelliği var: çoğu dişildir ve ikisini birden söylemek için {{عَيْنَانِ}} "iki göz" gibi ikil kullanılır. Son bölümlerde {{رَأْسِي يُؤْلِمُنِي}} "Başım ağrıyor." demeyi ve doktorla konuşmayı öğreneceksin.',
    lesson: [
      {
        h: 'Baş ve yüz',
        p: ['Yüzdeki bazı kelimeler Türkçeden tanıdık gelecek: {{وَجْهٌ}} (veçhe), {{عَيْنٌ}} (Türkçedeki "aynı" kelimesinin aslı). Baş demek olan {{رَأْسٌ}} ise Türkçedeki <b>reis</b> kelimesinin akrabasıdır: bir topluluğun başında olan kişi.'],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam'],
          rows: [
            ['رَأْسٌ', "re'sun", 'baş'],
            ['وَجْهٌ', 'vechun', 'yüz'],
            ['عَيْنٌ', '‘aynun', 'göz'],
            ['أُذُنٌ', 'uzunun', 'kulak'],
            ['أَنْفٌ', 'enfun', 'burun'],
            ['فَمٌ', 'femun', 'ağız'],
            ['سِنٌّ', 'sinnun', 'diş'],
            ['شَعْرٌ', 'şa‘run', 'saç']
          ]
        },
        ex: [
          { ar: 'وَجْهُكَ جَمِيلٌ', tl: 'vechuke cemîlun', tr: 'Yüzün güzel.', en: 'Your face is beautiful.' },
          { ar: 'شَعْرُهَا طَوِيلٌ', tl: 'şa‘ruhâ tavîlun', tr: 'Onun (kızın) saçı uzun.', en: 'Her hair is long.' },
          { ar: 'أَغْسِلُ وَجْهِي كُلَّ صَبَاحٍ', tl: 'agsilu vechî kulle sabâhin', tr: 'Her sabah yüzümü yıkarım.', en: 'I wash my face every morning.' },
          { ar: 'فَمُ الطِّفْلِ صَغِيرٌ', tl: "femu't-tıfli sagîrun", tr: 'Çocuğun ağzı küçük.', en: "The child's mouth is small." }
        ],
        tips: [
          'Türkçedeki <b>aynı</b> kelimesi {{عَيْنٌ}} kelimesinden gelir: Arapçada bu kelime hem "göz" hem de "bir şeyin kendisi" demektir.',
          'Dikkat: {{شَعْرٌ}} (şa\'r) saç, {{شِعْرٌ}} (şi\'r) şiir demektir. Harfler aynı, yalnızca ilk harfin harekesi farklı.'
        ],
        narr: "Merhaba! Bugün vücudumuzu Arapça anlatacağız. Önce baş ve yüzle başlayalım.\n\nBaş: {{رَأْسٌ}}, re's. Türkçedeki reis kelimesi aynı kökten gelir; reis bir topluluğun başında olan kişidir. Yüz: {{وَجْهٌ}}, vech. Göz: {{عَيْنٌ}}, ayn. Kulak: {{أُذُنٌ}}, uzun. Burun: {{أَنْفٌ}}, enf. Ağız: {{فَمٌ}}, fem. Diş: {{سِنٌّ}}, sinn. Saç: {{شَعْرٌ}}, şa'r.\n\nGöz kelimesiyle ilgili güzel bir bilgi: Türkçedeki aynı kelimesi buradan gelir. Arapçada ayn hem göz demektir hem de bir şeyin kendisi.\n\nŞimdi iyelik ekleriyle kullanalım: {{وَجْهِي}}, yüzüm. {{وَجْهُكَ}}, yüzün. {{أَغْسِلُ وَجْهِي كُلَّ صَبَاحٍ}}, her sabah yüzümü yıkarım. Son olarak bir uyarı: saç şa'r, şiir ise şi'r. Yazılışları aynı, yalnızca ilk harfin harekesi farklı."
      },
      {
        h: 'Vücut ve çift organlar',
        p: [
          'Vücudun diğer bölümleri: {{يَدٌ}} el, {{رِجْلٌ}} ayak ve bacak, {{بَطْنٌ}} karın, {{ظَهْرٌ}} sırt, {{صَدْرٌ}} göğüs. {{قَلْبٌ}} ise Türkçedeki kalp kelimesinin ta kendisi.',
          'Vücuttaki <b>çift organların çoğu dişildir</b>: {{عَيْنٌ}}, {{أُذُنٌ}}, {{يَدٌ}}, {{رِجْلٌ}}. Sonlarında yuvarlak te ({{ة}}) olmadığı hâlde sıfatları dişil gelir: {{يَدٌ كَبِيرَةٌ}} "büyük bir el". Tek organlar ise erkektir: {{قَلْبٌ قَوِيٌّ}} "güçlü bir kalp".'
        ],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam', 'Cinsiyet'],
          rows: [
            ['يَدٌ', 'yedun', 'el', 'dişil'],
            ['رِجْلٌ', 'riclun', 'ayak, bacak', 'dişil'],
            ['بَطْنٌ', 'batnun', 'karın', 'erkek'],
            ['ظَهْرٌ', 'zahrun', 'sırt', 'erkek'],
            ['صَدْرٌ', 'sadrun', 'göğüs', 'erkek'],
            ['قَلْبٌ', 'kalbun', 'kalp', 'erkek']
          ]
        },
        p2: ['İkisini birden söylemek için sona {{ـَانِ}} eklenir (Sayılar dersindeki ikil): {{عَيْنَانِ}} iki göz, {{أُذُنَانِ}} iki kulak, {{يَدَانِ}} iki el, {{رِجْلَانِ}} iki ayak.'],
        ex: [
          { ar: 'لِي عَيْنَانِ وَأُذُنَانِ', tl: 'lî ‘aynâni ve uzunâni', tr: 'İki gözüm ve iki kulağım var.', en: 'I have two eyes and two ears.' },
          { ar: 'لَهَا عَيْنَانِ جَمِيلَتَانِ', tl: 'lehâ ‘aynâni cemîletâni', tr: 'Onun (kızın) güzel gözleri var.', en: 'She has beautiful eyes.' },
          { ar: 'أَكْتُبُ بِيَدِي الْيُسْرَى', tl: "ektubu bi-yedi'l-yusrâ", tr: 'Sol elimle yazarım.', en: 'I write with my left hand.' },
          { ar: 'قَلْبُ جَدِّي قَوِيٌّ', tl: 'kalbu ceddî kaviyyun', tr: 'Dedemin kalbi güçlü.', en: "My grandfather's heart is strong." }
        ],
        cmp: { tr: 'Türkçede "iki göz" deriz; ikil diye ayrı bir biçim yoktur.', en: 'İngilizcede de "two eyes" denir. Arapçada tek kelime yeter: {{عَيْنَانِ}}.' },
        tips: [
          'Sol el {{الْيَدُ الْيُسْرَى}}, sağ el {{الْيَدُ الْيُمْنَى}}: el dişil olduğu için "sol" ve "sağ" da dişil biçimdedir.',
          'İkil ismin sıfatı da ikil olur: {{عَيْنَانِ جَمِيلَتَانِ}} "iki güzel göz".'
        ],
        narr: "Şimdi vücudun diğer bölümlerine geçelim. El: {{يَدٌ}}, yed. Ayak ve bacak: {{رِجْلٌ}}, ricl. Karın: {{بَطْنٌ}}, batn. Sırt: {{ظَهْرٌ}}, zahr. Göğüs: {{صَدْرٌ}}, sadr. Kalp: {{قَلْبٌ}}, kalb. Türkçedeki kalp kelimesinin ta kendisi.\n\nŞimdi ilginç bir kural: vücutta çift olan organların çoğu dişildir. Göz, kulak, el ve ayak. Sonlarında yuvarlak te olmadığı hâlde dişildirler. Bu yüzden büyük bir el derken sıfat dişil olur: {{يَدٌ كَبِيرَةٌ}}. Kalp gibi tek organlar ise erkektir: {{قَلْبٌ قَوِيٌّ}}, güçlü bir kalp.\n\nİki tane demek için kelimenin sonuna âni eklenir. İki göz: {{عَيْنَانِ}}, aynâni. İki kulak: {{أُذُنَانِ}}, uzunâni. İki el: {{يَدَانِ}}, yedâni. Türkçede iki göz deriz; Arapçada tek kelime yeter.\n\nÖrnek: {{لِي عَيْنَانِ وَأُذُنَانِ}}, iki gözüm ve iki kulağım var. {{أَكْتُبُ بِيَدِي الْيُسْرَى}}, sol elimle yazarım. El dişil olduğu için sol kelimesi de dişil: yusrâ."
      },
      {
        h: '"Başım ağrıyor": derdini söylemek',
        p: [
          'Bir yerin ağrıyorsa iki kalıp kullanabilirsin. Birincisi: organ + {{يُؤْلِمُنِي}} "beni acıtıyor". {{رَأْسِي يُؤْلِمُنِي}} "Başım ağrıyor." Organ dişilse fiil {{تُـ}} ile başlar: {{عَيْنِي تُؤْلِمُنِي}} "Gözüm ağrıyor."',
          'İkincisi İyelik Ekleri dersindeki {{عِنْدِي}} "bende var" kalıbı: {{عِنْدِي صُدَاعٌ}} "Başım ağrıyor (baş ağrım var).", {{عِنْدِي حُمَّى}} "Ateşim var."'
        ],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam'],
          rows: [
            ['أَلَمٌ', 'elemun', 'ağrı, acı'],
            ['صُدَاعٌ', 'sudâ‘un', 'baş ağrısı'],
            ['حُمَّى', 'hummâ', 'ateş (hastalıkta)'],
            ['زُكَامٌ', 'zukâmun', 'nezle'],
            ['سُعَالٌ', 'su‘âlun', 'öksürük'],
            ['مَرِيضٌ', 'marîdun', 'hasta']
          ]
        },
        ex: [
          { ar: 'رَأْسِي يُؤْلِمُنِي', tl: "re'sî yu'limunî", tr: 'Başım ağrıyor.', en: 'My head hurts.' },
          { ar: 'بَطْنِي يُؤْلِمُنِي', tl: "batnî yu'limunî", tr: 'Karnım ağrıyor.', en: 'My stomach hurts.' },
          { ar: 'أُذُنِي تُؤْلِمُنِي', tl: "uzunî tu'limunî", tr: 'Kulağım ağrıyor.', en: 'My ear hurts.' },
          { ar: 'عِنْدِي حُمَّى وَسُعَالٌ', tl: '‘indî hummâ ve su‘âlun', tr: 'Ateşim ve öksürüğüm var.', en: 'I have a fever and a cough.' },
          { ar: 'أَنَا مَرِيضٌ الْيَوْمَ', tl: "ene marîduni'l-yevme", tr: 'Bugün hastayım.', en: 'I am sick today.' }
        ],
        cmp: { tr: 'Türkçede "Başım ağrıyor." deriz; ağrıyan organ öznedir. Arapçada da öyle: {{رَأْسِي يُؤْلِمُنِي}}.', en: 'İngilizcede "I have a headache" denir; Arapçada bunun karşılığı {{عِنْدِي صُدَاعٌ}}.' },
        tips: [
          '{{يُؤْلِمُنِي}} ile {{أَلَمٌ}} "ağrı" aynı köktendir. Türkçedeki <b>elem</b> (acı, keder) kelimesi de buradan gelir.',
          '{{سُعَالٌ}} öksürük, {{سُؤَالٌ}} soru demektir: biri ayn ({{ع}}), öteki hemze ({{ء}}) ile. Benzer sesler alıştırmasında bu iki sesi ayırt etmeyi çalışabilirsin.',
          'Kız ya da kadın "Hastayım." derken {{أَنَا مَرِيضَةٌ}} der.'
        ],
        narr: "Şimdi en önemli konuya geldik: bir yerimiz ağrıyınca bunu nasıl söyleriz?\n\nBirinci yol: önce ağrıyan organ, sonra {{يُؤْلِمُنِي}}, yu'limunî, yani beni acıtıyor. Başım ağrıyor: {{رَأْسِي يُؤْلِمُنِي}}. Karnım ağrıyor: {{بَطْنِي يُؤْلِمُنِي}}. Türkçedeki sıraya çok benziyor, değil mi?\n\nAma dikkat: organ dişilse fiil de dişil olur ve tu ile başlar. Göz dişildir: {{عَيْنِي تُؤْلِمُنِي}}, gözüm ağrıyor. Kulak da dişil: {{أُذُنِي تُؤْلِمُنِي}}, kulağım ağrıyor.\n\nİkinci yol, iyelik dersinden hatırladığınız bende var kalıbı: {{عِنْدِي صُدَاعٌ}}, baş ağrım var. {{عِنْدِي حُمَّى}}, ateşim var. Öksürük {{سُعَالٌ}}, su'âl; nezle {{زُكَامٌ}}, zukâm. Hasta {{مَرِيضٌ}}, marîd.\n\nBir de şu: yu'limunî fiili elem kelimesiyle aynı kökten. Türkçedeki elem, yani acı ve keder, buradan gelir."
      },
      {
        h: 'Doktorda ve eczanede',
        p: [
          'Doktor {{طَبِيبٌ}} (tabip), hastane {{مُسْتَشْفًى}}, eczane {{صَيْدَلِيَّةٌ}}, ilaç {{دَوَاءٌ}} (deva). Doktor önce {{مَا بِكَ؟}} "Neyin var?" diye sorar; kadına {{مَا بِكِ؟}} denir.',
          'Hasta birine "Geçmiş olsun." demek için {{سَلَامَتُكَ}} denir; kelimesi kelimesine "senin esenliğin". Kadına {{سَلَامَتُكِ}}.'
        ],
        ex: [
          { ar: 'مَا بِكَ؟', tl: 'mâ bike?', tr: 'Neyin var?', en: "What's wrong with you?" },
          { ar: 'أَذْهَبُ إِلَى الطَّبِيبِ', tl: "ezhebu ile't-tabîbi", tr: 'Doktora gidiyorum.', en: "I'm going to the doctor." },
          { ar: 'خُذْ هٰذَا الدَّوَاءَ بَعْدَ الْأَكْلِ', tl: "huz hâze'd-devâ'e ba‘de'l-ekli", tr: 'Bu ilacı yemekten sonra al.', en: 'Take this medicine after eating.' },
          { ar: 'أَيْنَ الصَّيْدَلِيَّةُ؟', tl: "eyne's-saydeliyyetu?", tr: 'Eczane nerede?', en: 'Where is the pharmacy?' },
          { ar: 'سَلَامَتُكَ!', tl: 'selâmetuke!', tr: 'Geçmiş olsun!', en: 'Get well soon!' }
        ],
        tips: [
          '{{مُسْتَشْفًى}} kelimesinin içinde {{شِفَاءٌ}} "şifa" var: şifa aranan yer.',
          'Sağlık {{صِحَّةٌ}}, Türkçedeki <b>sıhhat</b> kelimesidir. Tabip, deva ve şifa da Arapçadan gelir.'
        ],
        narr: "Son bölümde doktora gidiyoruz. Doktor: {{طَبِيبٌ}}, tabîb. Türkçedeki tabip kelimesi. Hastane: {{مُسْتَشْفًى}}, musteşfâ. İçinde şifa kelimesi var; yani şifa aranan yer. Eczane: {{صَيْدَلِيَّةٌ}}, saydeliyye. İlaç: {{دَوَاءٌ}}, devâ. Türkçedeki deva kelimesi.\n\nDoktor size önce şunu sorar: {{مَا بِكَ؟}}, mâ bike? Yani neyin var? Bir kadına sorarken {{مَا بِكِ؟}}, mâ biki der. Siz de önceki bölümdeki kalıplarla cevap verirsiniz: {{عِنْدِي صُدَاعٌ}}.\n\nDoktor ilacı verirken şöyle diyebilir: {{خُذْ هٰذَا الدَّوَاءَ بَعْدَ الْأَكْلِ}}, bu ilacı yemekten sonra al.\n\nVe son olarak, hasta bir arkadaşınıza geçmiş olsun demek için: {{سَلَامَتُكَ}}, selâmetuke. Kelimesi kelimesine senin esenliğin. Kadına {{سَلَامَتُكِ}}, selâmetuki."
      }
    ],
    keys: [
      'Baş ve yüz: {{رَأْسٌ}} baş, {{وَجْهٌ}} yüz, {{عَيْنٌ}} göz, {{أُذُنٌ}} kulak, {{فَمٌ}} ağız.',
      'Çift organlar dişildir: {{يَدٌ كَبِيرَةٌ}}; iki tane için {{ـَانِ}}: {{عَيْنَانِ}}, {{يَدَانِ}}.',
      'Ağrı: {{رَأْسِي يُؤْلِمُنِي}}; dişil organda {{عَيْنِي تُؤْلِمُنِي}}. Ya da {{عِنْدِي صُدَاعٌ}}.',
      'Doktorda: {{مَا بِكَ؟}} "Neyin var?"; hastaya {{سَلَامَتُكَ}} "Geçmiş olsun".'
    ],
    mistakes: [
      { bad: 'يَدٌ كَبِيرٌ', good: 'يَدٌ كَبِيرَةٌ', why: '{{يَد}} dişildir; sıfat da dişil olur.' },
      { bad: 'عَيْنِي يُؤْلِمُنِي', good: 'عَيْنِي تُؤْلِمُنِي', why: '{{عَيْن}} dişil olduğu için fiil {{تُـ}} ile başlar.' },
      { bad: 'اِثْنَانِ عَيْنٌ', good: 'عَيْنَانِ', why: 'İki tane için sayı gerekmez; ikil eki {{ـَانِ}} yeter.' }
    ],
    words: [
      { ar: 'رَأْس', tl: "re's", tr: 'baş', en: 'head' },
      { ar: 'وَجْه', tl: 'vech', tr: 'yüz', en: 'face' },
      { ar: 'عَيْن', tl: '‘ayn', tr: 'göz', en: 'eye' },
      { ar: 'أُذُن', tl: 'uzun', tr: 'kulak', en: 'ear' },
      { ar: 'أَنْف', tl: 'enf', tr: 'burun', en: 'nose' },
      { ar: 'فَم', tl: 'fem', tr: 'ağız', en: 'mouth' },
      { ar: 'شَعْر', tl: 'şa‘r', tr: 'saç', en: 'hair' },
      { ar: 'يَد', tl: 'yed', tr: 'el', en: 'hand' },
      { ar: 'رِجْل', tl: 'ricl', tr: 'ayak, bacak', en: 'foot, leg' },
      { ar: 'بَطْن', tl: 'batn', tr: 'karın', en: 'belly' },
      { ar: 'ظَهْر', tl: 'zahr', tr: 'sırt', en: 'back' },
      { ar: 'قَلْب', tl: 'kalb', tr: 'kalp', en: 'heart' },
      { ar: 'مَرِيض', tl: 'marîd', tr: 'hasta', en: 'sick' },
      { ar: 'طَبِيب', tl: 'tabîb', tr: 'doktor', en: 'doctor' },
      { ar: 'دَوَاء', tl: "devâ'", tr: 'ilaç', en: 'medicine' },
      { ar: 'صُدَاع', tl: 'sudâ‘', tr: 'baş ağrısı', en: 'headache' }
    ],
    summaryNarr: "Vücut ve Sağlık dersini bitirdiniz, tebrikler! Kısa bir tekrar yapalım.\n\nBaş {{رَأْسٌ}}, yüz {{وَجْهٌ}}, göz {{عَيْنٌ}}, kulak {{أُذُنٌ}}, el {{يَدٌ}}, ayak {{رِجْلٌ}}. Çift organlar dişildir ve iki tane için sona âni gelir: {{عَيْنَانِ}}, iki göz.\n\nBir yeriniz ağrıyınca önce organ, sonra yu'limunî: {{رَأْسِي يُؤْلِمُنِي}}, başım ağrıyor. Organ dişilse tu'limunî. Ya da bende var kalıbı: {{عِنْدِي صُدَاعٌ}}. Doktor mâ bike diye sorar; hastaya selâmetuke denir.\n\nEtkinliklerde önce kartlarla kelimeleri tekrar edin, sonra 'Cümleyi tamamla' alıştırmasında ağrı cümlelerini kurun.",
    acts: [
      { type: 'flash', title: 'Vücut kartları', desc: 'Vücudun bölümlerini ve sağlık kelimelerini kartlarla öğren.', glyph: 'يَد', items: null },
      {
        type: 'match', title: 'Organ ve anlamı', desc: 'Arapça kelimeyi anlamıyla eşleştir.', glyph: 'عَيْن',
        items: [['رَأْسٌ', 'baş'], ['عَيْنٌ', 'göz'], ['أُذُنٌ', 'kulak'], ['أَنْفٌ', 'burun'], ['يَدٌ', 'el'], ['بَطْنٌ', 'karın']]
      },
      {
        type: 'mc', title: 'Neren ağrıyor?', desc: 'Vücut ve sağlık cümlelerini anla.', glyph: 'أَلَم',
        items: [
          { q: '{{عَيْنٌ}} ne demektir?', options: ['göz', 'kulak', 'burun', 'ağız'], a: 'göz' },
          { q: '"Başım ağrıyor." hangisidir?', options: ['رَأْسِي يُؤْلِمُنِي', 'رَأْسِي تُؤْلِمُنِي', 'عِنْدِي رَأْسٌ', 'رَأْسٌ يُؤْلِمُنِي'], a: 'رَأْسِي يُؤْلِمُنِي', why: '{{رَأْس}} erkektir: {{يُؤْلِمُنِي}}. "Başım" için iyelik eki {{ـِي}} gerekir.' },
          { q: 'Hangisi dişildir?', options: ['يَدٌ', 'قَلْبٌ', 'رَأْسٌ', 'بَطْنٌ'], a: 'يَدٌ', why: 'Çift organlar (el, göz, kulak, ayak) dişildir.' },
          { q: '"İki göz" hangisidir?', options: ['عَيْنَانِ', 'عُيُونٌ', 'عَيْنٌ', 'عَيْنَتَانِ'], a: 'عَيْنَانِ', why: 'İkil için sona {{ـَانِ}} eklenir; {{عُيُونٌ}} çoğuldur (gözler).' },
          { q: 'Doktor {{مَا بِكَ؟}} diye sordu. Ne demek?', options: ['Neyin var?', 'Adın ne?', 'Nerelisin?', 'Kaç yaşındasın?'], a: 'Neyin var?' },
          { q: 'İlaç almak için nereye gidersin?', options: ['صَيْدَلِيَّةٌ', 'مَطْعَمٌ', 'مَدْرَسَةٌ', 'مَكْتَبٌ'], a: 'صَيْدَلِيَّةٌ' }
        ]
      },
      {
        type: 'fill', title: 'Cümleyi tamamla', desc: 'Organın cinsiyetine ve kalıba göre doğru kelimeyi seç.', glyph: '___',
        items: [
          { s: 'عَيْنِي ___', tr: 'Gözüm ağrıyor.', hint: 'Gözüm ağrıyor.', options: ['تُؤْلِمُنِي', 'يُؤْلِمُنِي', 'أَلَمٌ'], a: 'تُؤْلِمُنِي', why: '{{عَيْن}} dişil: fiil {{تُـ}} ile başlar.' },
          { s: 'بَطْنِي ___', tr: 'Karnım ağrıyor.', hint: 'Karnım ağrıyor.', options: ['يُؤْلِمُنِي', 'تُؤْلِمُنِي', 'مَرِيضٌ'], a: 'يُؤْلِمُنِي', why: '{{بَطْن}} erkektir.' },
          { s: '___ صُدَاعٌ', tr: 'Baş ağrım var.', hint: 'Baş ağrım var.', options: ['عِنْدِي', 'أَنَا', 'رَأْسِي'], a: 'عِنْدِي', why: '"Bende var" kalıbı: {{عِنْدِي}}.' },
          { s: 'لَهُ يَدَانِ ___', tr: 'Onun iki güçlü eli var.', hint: 'Onun iki güçlü eli var.', options: ['قَوِيَّتَانِ', 'قَوِيَّانِ', 'قَوِيٌّ'], a: 'قَوِيَّتَانِ', why: '{{يَد}} dişil ve ikil: sıfat da dişil ikil olur.' },
          { s: 'أَذْهَبُ إِلَى ___', tr: 'Doktora gidiyorum.', hint: 'Doktora gidiyorum.', options: ['الطَّبِيبِ', 'الطَّبِيبُ', 'طَبِيبٌ'], a: 'الطَّبِيبِ', why: '{{إِلَى}} kelimesinden sonra isim esreli olur.' }
        ]
      },
      LISTEN,
      SPEAK,
      ENDLESS,
      {
        type: 'test', title: 'Vücut ve sağlık testi', desc: 'Karma değerlendirme.', glyph: '؟',
        items: [
          { q: '"Kulak" hangisidir?', options: ['أُذُنٌ', 'أَنْفٌ', 'فَمٌ', 'عَيْنٌ'], a: 'أُذُنٌ' },
          { t: 'tf', s: 'يَدٌ (el) erkek bir kelimedir.', a: false, why: 'Çift organlar dişildir: {{يَدٌ كَبِيرَةٌ}}.' },
          { t: 'tf', s: 'عِنْدِي حُمَّى "Ateşim var." demektir.', a: true },
          { t: 'order', w: ['رَأْسِي', 'يُؤْلِمُنِي'], tr: 'Başım ağrıyor.' },
          { t: 'order', w: ['أَذْهَبُ', 'إِلَى', 'الطَّبِيبِ'], tr: 'Doktora gidiyorum.' },
          { q: '{{سَلَامَتُكَ}} ne zaman söylenir?', options: ['Hasta birine "geçmiş olsun" derken', 'Yemekten önce', 'Sabah selamlaşırken', 'Teşekkür ederken'], a: 'Hasta birine "geçmiş olsun" derken' },
          { t: 'fill', s: 'لِي ___ وَأُذُنَانِ', tr: 'İki gözüm ve iki kulağım var.', hint: 'İki gözüm ve iki kulağım var.', options: ['عَيْنَانِ', 'عَيْنٌ', 'عُيُونٌ'], a: 'عَيْنَانِ' },
          { q: '{{دَوَاءٌ}} ne demektir?', options: ['ilaç', 'doktor', 'hastane', 'ağrı'], a: 'ilaç' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- 19. Kıyafetler ve Giyinmek */
  {
    id: 'giyim', n: 19, level: 'Başlangıç', glyph: 'ث', ar: 'الْمَلَابِسُ', name: 'Kıyafetler ve Giyinmek',
    desc: 'Kıyafet adları, "giymek" fiili ve renklerle kıyafet anlatmak: {{أَلْبَسُ قَمِيصًا أَبْيَضَ}} "Beyaz bir gömlek giyiyorum."',
    long: 'Kıyafet adları; {{لَبِسَ}} "giydi" fiilinin şimdiki zaman çekimi; kıyafeti renk ve sıfatla anlatırken cinsiyet uyumu; insan olmayan çoğulların dişil tekil sıfat alması ve mağazada beden sormak.',
    tags: 'kıyafet giysi elbise gömlek pantolon etek ceket mont palto ayakkabı çorap şapka giymek çıkarmak renk beden mağaza dar bol libas malabis qamis bantalun fustan hidha labisa yalbasu maqas',
    readMins: 12,
    intro: 'Bu derste ne giydiğini Arapça anlatacaksın. Önce kıyafetlerin adları, sonra {{يَلْبَسُ}} "giyer" fiili. Renkler dersindeki kuralı burada kullanacaksın: {{قَمِيصٌ أَبْيَضُ}} ama {{تَنُّورَةٌ بَيْضَاءُ}}. Türkçedeki <b>elbise</b> kelimesinin de Arapça {{أَلْبِسَةٌ}} "giysiler" kelimesinden geldiğini göreceksin.',
    lesson: [
      {
        h: 'Kıyafetler',
        p: ['Kıyafet {{مَلَابِسُ}} ya da {{ثِيَابٌ}} diye söylenir; ikisi de çoğuldur. Türkçedeki <b>elbise</b>, aynı kökten gelen {{أَلْبِسَةٌ}} "giysiler" kelimesinden geçmiştir.'],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam', 'Cinsiyet'],
          rows: [
            ['قَمِيصٌ', 'kamîsun', 'gömlek', 'erkek'],
            ['بَنْطَلُونٌ', 'bantalûnun', 'pantolon', 'erkek'],
            ['فُسْتَانٌ', 'fustânun', 'elbise (kadın)', 'erkek'],
            ['تَنُّورَةٌ', 'tennûretun', 'etek', 'dişil'],
            ['سُتْرَةٌ', 'sutretun', 'ceket', 'dişil'],
            ['مِعْطَفٌ', 'mi‘tafun', 'palto, mont', 'erkek'],
            ['حِذَاءٌ', "hızâ'un", 'ayakkabı', 'erkek'],
            ['جَوْرَبٌ', 'cevrabun', 'çorap', 'erkek'],
            ['قُبَّعَةٌ', 'kubba‘atun', 'şapka', 'dişil']
          ]
        },
        ex: [
          { ar: 'هٰذَا قَمِيصٌ جَدِيدٌ', tl: 'hâzâ kamîsun cedîdun', tr: 'Bu yeni bir gömlek.', en: 'This is a new shirt.' },
          { ar: 'هٰذِهِ تَنُّورَةٌ طَوِيلَةٌ', tl: 'hâzihî tennûretun tavîletun', tr: 'Bu uzun bir etek.', en: 'This is a long skirt.' },
          { ar: 'الْمِعْطَفُ فِي الْخِزَانَةِ', tl: "el-mi‘tafu fi'l-hizâneti", tr: 'Palto dolapta.', en: 'The coat is in the wardrobe.' },
          { ar: 'أَيْنَ حِذَائِي؟', tl: "eyne hızâ'î?", tr: 'Ayakkabım nerede?', en: 'Where are my shoes?' }
        ],
        tips: [
          'Türkçeye aynen geçen giyim kelimeleri: {{جَيْبٌ}} cep, {{قُمَاشٌ}} kumaş, {{مِنْدِيلٌ}} mendil.',
          'Kıyafetin cinsiyetine dikkat: {{سُتْرَةٌ}} ve {{تَنُّورَةٌ}} dişildir (sonlarında {{ة}} var); {{فُسْتَانٌ}} ise kadın elbisesi olduğu hâlde erkektir.'
        ],
        narr: "Bugün kıyafetlerden söz edeceğiz. Önce genel kelime: kıyafetler {{مَلَابِسُ}}, melâbis. Türkçedeki elbise kelimesi de aynı kökten gelen {{أَلْبِسَةٌ}}, elbise kelimesinden geçmiş; Arapçada giysiler demek.\n\nGömlek: {{قَمِيصٌ}}, kamîs. Pantolon: {{بَنْطَلُونٌ}}, bantalûn. Kadın elbisesi: {{فُسْتَانٌ}}, fustân. Etek: {{تَنُّورَةٌ}}, tennûre. Ceket: {{سُتْرَةٌ}}, sutre. Palto ya da mont: {{مِعْطَفٌ}}, mi'taf. Ayakkabı: {{حِذَاءٌ}}, hızâ. Çorap: {{جَوْرَبٌ}}, cevrab. Şapka: {{قُبَّعَةٌ}}, kubba'a.\n\nKıyafetlerin cinsiyetine dikkat edin. Etek, ceket ve şapka dişildir; sonlarında yuvarlak te var. Fustân ise kadın elbisesi olduğu hâlde erkek bir kelimedir. Bu yüzden: {{هٰذَا قَمِيصٌ جَدِيدٌ}}, bu yeni bir gömlek; ama {{هٰذِهِ تَنُّورَةٌ طَوِيلَةٌ}}, bu uzun bir etek."
      },
      {
        h: '"Giymek" fiili: لَبِسَ يَلْبَسُ',
        p: [
          'Giymek fiili {{لَبِسَ}} "giydi", şimdiki zamanı {{يَلْبَسُ}} "giyer, giyiyor". Fiiller dersindeki gibi kişi başa gelir: {{أَلْبَسُ}} giyiyorum, {{تَلْبَسُ}} giyiyorsun, {{يَلْبَسُ}} giyiyor.',
          'Giyilen şey fiilin nesnesidir ve üstünlü olur: {{أَلْبَسُ قَمِيصًا}} "bir gömlek giyiyorum", {{يَلْبَسُ الْمِعْطَفَ}} "paltoyu giyiyor". Çıkarmak için {{خَلَعَ}} "çıkardı", {{يَخْلَعُ}} "çıkarıyor".'
        ],
        table: {
          cols: ['Kişi', 'Arapça', 'Anlam'],
          rows: [
            ['ben', 'أَلْبَسُ', 'giyiyorum'],
            ['sen (erkek)', 'تَلْبَسُ', 'giyiyorsun'],
            ['sen (kadın)', 'تَلْبَسِينَ', 'giyiyorsun'],
            ['o (erkek)', 'يَلْبَسُ', 'giyiyor'],
            ['o (kadın)', 'تَلْبَسُ', 'giyiyor'],
            ['biz', 'نَلْبَسُ', 'giyiyoruz']
          ]
        },
        ex: [
          { ar: 'مَاذَا تَلْبَسُ الْيَوْمَ؟', tl: "mâzâ telbesu'l-yevme?", tr: 'Bugün ne giyiyorsun?', en: 'What are you wearing today?' },
          { ar: 'أَلْبَسُ قَمِيصًا وَبَنْطَلُونًا', tl: 'elbesu kamîsen ve bantalûnen', tr: 'Bir gömlek ve bir pantolon giyiyorum.', en: "I'm wearing a shirt and trousers." },
          { ar: 'تَلْبَسُ أُخْتِي فُسْتَانًا جَمِيلًا', tl: 'telbesu uhtî fustânen cemîlen', tr: 'Kız kardeşim güzel bir elbise giyiyor.', en: 'My sister is wearing a beautiful dress.' },
          { ar: 'أَخْلَعُ حِذَائِي فِي الْبَيْتِ', tl: "ahle‘u hızâ'î fi'l-beyti", tr: 'Evde ayakkabımı çıkarırım.', en: 'I take off my shoes at home.' }
        ],
        tips: [
          '{{مَاذَا}} fiille sorulan "ne?" demektir (Soru Kelimeleri dersi): {{مَاذَا تَلْبَسُ؟}} "Ne giyiyorsun?"',
          'Aynı kökten: {{لِبَاسٌ}} giysi, {{مَلَابِسُ}} kıyafetler, {{أَلْبِسَةٌ}} giysiler (Türkçedeki elbise).'
        ],
        narr: "Şimdi giymek fiilini öğrenelim. Giydi: {{لَبِسَ}}, lebise. Giyer ya da giyiyor: {{يَلْبَسُ}}, yelbesu.\n\nFiiller dersinden hatırlarsınız, şimdiki zamanda kişi başa gelir. Giyiyorum: {{أَلْبَسُ}}, elbesu. Giyiyorsun: {{تَلْبَسُ}}, telbesu. Bir kıza giyiyorsun derken: {{تَلْبَسِينَ}}, telbesîne. O giyiyor: {{يَلْبَسُ}}. Biz giyiyoruz: {{نَلْبَسُ}}, nelbesu.\n\nGiyilen şey fiilin nesnesidir, bu yüzden üstünlü olur: {{أَلْبَسُ قَمِيصًا}}, elbesu kamîsen, bir gömlek giyiyorum. Soru için mâzâ kullanılır: {{مَاذَا تَلْبَسُ الْيَوْمَ؟}}, bugün ne giyiyorsun?\n\nÇıkarmak fiili de lazım: {{خَلَعَ}}, hale'a, çıkardı. {{أَخْلَعُ حِذَائِي فِي الْبَيْتِ}}, evde ayakkabımı çıkarırım."
      },
      {
        h: 'Renk ve sıfatla kıyafet anlatmak',
        p: [
          'Renkler dersindeki kural burada çok işine yarar: temel renkler erkek kelimeyle {{أَفْعَلُ}}, dişil kelimeyle {{فَعْلَاءُ}} kalıbındadır. {{قَمِيصٌ أَبْيَضُ}} "beyaz bir gömlek", ama {{تَنُّورَةٌ بَيْضَاءُ}} "beyaz bir etek".',
          'Sıfatlar dersindeki ikinci kural: insan olmayan çoğullar dişil tekil gibi davranır. {{الْمَلَابِسُ جَمِيلَةٌ}} "Kıyafetler güzel."; {{هٰذِهِ الْأَحْذِيَةُ غَالِيَةٌ}} "Bu ayakkabılar pahalı."'
        ],
        table: {
          cols: ['Erkek kelimeyle', 'Dişil kelimeyle', 'Anlam'],
          rows: [
            ['قَمِيصٌ أَبْيَضُ', 'تَنُّورَةٌ بَيْضَاءُ', 'beyaz'],
            ['مِعْطَفٌ أَسْوَدُ', 'سُتْرَةٌ سَوْدَاءُ', 'siyah'],
            ['حِذَاءٌ أَحْمَرُ', 'قُبَّعَةٌ حَمْرَاءُ', 'kırmızı'],
            ['بَنْطَلُونٌ أَزْرَقُ', 'تَنُّورَةٌ زَرْقَاءُ', 'mavi'],
            ['جَوْرَبٌ أَخْضَرُ', 'قُبَّعَةٌ خَضْرَاءُ', 'yeşil']
          ]
        },
        ex: [
          { ar: 'أَلْبَسُ قَمِيصًا أَبْيَضَ', tl: 'elbesu kamîsen ebyada', tr: 'Beyaz bir gömlek giyiyorum.', en: "I'm wearing a white shirt." },
          { ar: 'سُتْرَتِي سَوْدَاءُ', tl: "sutretî sevdâ'u", tr: 'Ceketim siyah.', en: 'My jacket is black.' },
          { ar: 'الْمَلَابِسُ الْجَدِيدَةُ جَمِيلَةٌ', tl: "el-melâbisu'l-cedîdetu cemîletun", tr: 'Yeni kıyafetler güzel.', en: 'The new clothes are beautiful.' },
          { ar: 'هٰذِهِ الْأَحْذِيَةُ غَالِيَةٌ', tl: "hâzihi'l-ahziyetu gâliyetun", tr: 'Bu ayakkabılar pahalı.', en: 'These shoes are expensive.' }
        ],
        cmp: { tr: 'Türkçede sıfat isimden önce gelir: beyaz gömlek.', en: 'İngilizcede de öyle: a white shirt. Arapçada sıfat sonra gelir ve ismin cinsiyetine uyar: {{قَمِيصٌ أَبْيَضُ}}.' },
        tips: ['Temel renkler tenvin almaz: {{أَبْيَضُ}} (ebyadu), "ebyadun" değil. Nesne olunca yalnızca üstün alır: {{قَمِيصًا أَبْيَضَ}}.'],
        narr: "Kıyafetleri renkleriyle anlatalım. Renkler dersindeki kuralı hatırlayın: temel renkler erkek kelimeyle bir kalıpta, dişil kelimeyle başka bir kalıpta gelir.\n\nGömlek erkektir: {{قَمِيصٌ أَبْيَضُ}}, beyaz bir gömlek. Etek dişildir: {{تَنُّورَةٌ بَيْضَاءُ}}, beyaz bir etek. Ebyad beyazın erkek hâli, beydâ dişil hâli. Aynı şekilde siyah: {{مِعْطَفٌ أَسْوَدُ}} ama {{سُتْرَةٌ سَوْدَاءُ}}. Kırmızı: {{حِذَاءٌ أَحْمَرُ}} ama {{قُبَّعَةٌ حَمْرَاءُ}}.\n\nBir de Sıfatlar dersindeki ikinci kural: insan olmayan çoğullar dişil tekil gibi davranır. Kıyafetler güzel: {{الْمَلَابِسُ جَمِيلَةٌ}}. Cemîle, yani dişil ve tekil. Bu ayakkabılar pahalı: {{هٰذِهِ الْأَحْذِيَةُ غَالِيَةٌ}}. Ayakkabılar çoğul ama işaret de sıfat da dişil tekil.\n\nGiyerken de aynı uyum: {{أَلْبَسُ قَمِيصًا أَبْيَضَ}}, beyaz bir gömlek giyiyorum."
      },
      {
        h: 'Mağazada: beden ve fiyat',
        p: [
          'Kıyafet alırken bedenini sorarsın: {{مَقَاسٌ}} beden, kelimesi kelimesine "ölçü". Kıyafet olmuyorsa {{ضَيِّقٌ}} dar, {{وَاسِعٌ}} bol, {{كَبِيرٌ}} büyük, {{صَغِيرٌ}} küçük dersin.',
          'Fiyatı Yemek ve Alışveriş dersindeki gibi sorarsın: {{بِكَمْ هٰذَا الْقَمِيصُ؟}} "Bu gömlek kaça?" Başka bir beden istemek için Sıfatlar dersindeki "daha" kalıbı: {{هَلْ عِنْدَكُمْ مَقَاسٌ أَكْبَرُ؟}} "Daha büyük beden var mı?"'
        ],
        ex: [
          { ar: 'هٰذَا الْقَمِيصُ ضَيِّقٌ', tl: "hâze'l-kamîsu dayyikun", tr: 'Bu gömlek dar.', en: 'This shirt is tight.' },
          { ar: 'هَلْ عِنْدَكُمْ مَقَاسٌ أَكْبَرُ؟', tl: 'hel ‘indekum makâsun ekberu?', tr: 'Daha büyük beden var mı?', en: 'Do you have a bigger size?' },
          { ar: 'بِكَمْ هٰذَا الْفُسْتَانُ؟', tl: "bikem hâze'l-fustânu?", tr: 'Bu elbise kaça?', en: 'How much is this dress?' },
          { ar: 'أُرِيدُ حِذَاءً أَسْوَدَ', tl: "urîdu hızâ'en esvede", tr: 'Siyah bir ayakkabı istiyorum.', en: 'I want black shoes.' },
          { ar: 'الْمِعْطَفُ وَاسِعٌ قَلِيلًا', tl: 'el-mi‘tafu vâsi‘un kalîlen', tr: 'Palto biraz bol.', en: 'The coat is a little loose.' }
        ],
        tips: [
          '{{ضَيِّقٌ}} ve {{وَاسِعٌ}} birbirinin zıttıdır; Zıt ve eş anlamlılar sayfasında da var.',
          'Türkçedeki <b>beden</b> kelimesi Arapçada {{بَدَنٌ}} "vücut" demektir; giysi bedeni Arapçada {{مَقَاسٌ}}.'
        ],
        narr: "Son olarak mağazaya gidelim. Beden: {{مَقَاسٌ}}, makâs, yani ölçü. Dikkat: Türkçedeki beden kelimesi Arapçada vücut demektir; giysi bedeni için makâs kullanılır.\n\nKıyafet olmuyorsa: dar {{ضَيِّقٌ}}, dayyik. Bol {{وَاسِعٌ}}, vâsi'. {{هٰذَا الْقَمِيصُ ضَيِّقٌ}}, bu gömlek dar. {{الْمِعْطَفُ وَاسِعٌ قَلِيلًا}}, palto biraz bol.\n\nBaşka beden istemek için Sıfatlar dersindeki daha kalıbını kullanırız: {{هَلْ عِنْدَكُمْ مَقَاسٌ أَكْبَرُ؟}}, daha büyük beden var mı? Ekber, daha büyük demek.\n\nFiyatı Yemek ve Alışveriş dersindeki gibi sorarız: {{بِكَمْ هٰذَا الْفُسْتَانُ؟}}, bu elbise kaça? Ve istediğimizi söyleriz: {{أُرِيدُ حِذَاءً أَسْوَدَ}}, siyah bir ayakkabı istiyorum."
      }
    ],
    keys: [
      'Kıyafetler: {{قَمِيصٌ}} gömlek, {{بَنْطَلُونٌ}} pantolon, {{فُسْتَانٌ}} elbise, {{حِذَاءٌ}} ayakkabı.',
      'Giymek: {{أَلْبَسُ}} giyiyorum, {{تَلْبَسُ}} giyiyorsun; giyilen şey üstünlü: {{أَلْبَسُ قَمِيصًا}}.',
      'Renk uyumu: {{قَمِيصٌ أَبْيَضُ}} ama {{تَنُّورَةٌ بَيْضَاءُ}}.',
      'İnsan olmayan çoğula dişil tekil sıfat: {{الْمَلَابِسُ جَمِيلَةٌ}}. Beden {{مَقَاسٌ}}, dar {{ضَيِّقٌ}}, bol {{وَاسِعٌ}}.'
    ],
    mistakes: [
      { bad: 'تَنُّورَةٌ أَبْيَضُ', good: 'تَنُّورَةٌ بَيْضَاءُ', why: '{{تَنُّورَة}} dişil: renk de dişil kalıpta ({{فَعْلَاءُ}}) olur.' },
      { bad: 'أَلْبَسُ قَمِيصٌ', good: 'أَلْبَسُ قَمِيصًا', why: 'Giyilen şey fiilin nesnesidir, üstünlü olur.' },
      { bad: 'الْمَلَابِسُ جَمِيلُونَ', good: 'الْمَلَابِسُ جَمِيلَةٌ', why: 'İnsan olmayan çoğullar dişil tekil sıfat alır.' }
    ],
    words: [
      { ar: 'قَمِيص', tl: 'kamîs', tr: 'gömlek', en: 'shirt' },
      { ar: 'بَنْطَلُون', tl: 'bantalûn', tr: 'pantolon', en: 'trousers' },
      { ar: 'فُسْتَان', tl: 'fustân', tr: 'elbise (kadın)', en: 'dress' },
      { ar: 'تَنُّورَة', tl: 'tennûre', tr: 'etek', en: 'skirt' },
      { ar: 'سُتْرَة', tl: 'sutre', tr: 'ceket', en: 'jacket' },
      { ar: 'مِعْطَف', tl: 'mi‘taf', tr: 'palto, mont', en: 'coat' },
      { ar: 'حِذَاء', tl: "hızâ'", tr: 'ayakkabı', en: 'shoe' },
      { ar: 'جَوْرَب', tl: 'cevrab', tr: 'çorap', en: 'sock' },
      { ar: 'قُبَّعَة', tl: 'kubba‘a', tr: 'şapka', en: 'hat' },
      { ar: 'مَلَابِس', tl: 'melâbis', tr: 'kıyafetler', en: 'clothes' },
      { ar: 'لَبِسَ', tl: 'lebise', tr: 'giydi', en: 'wore' },
      { ar: 'خَلَعَ', tl: 'hale‘a', tr: 'çıkardı (giysiyi)', en: 'took off' },
      { ar: 'مَقَاس', tl: 'makâs', tr: 'beden, ölçü', en: 'size' },
      { ar: 'ضَيِّق', tl: 'dayyik', tr: 'dar', en: 'tight' },
      { ar: 'وَاسِع', tl: 'vâsi‘', tr: 'bol, geniş', en: 'loose, wide' },
      { ar: 'جَيْب', tl: 'ceyb', tr: 'cep', en: 'pocket' }
    ],
    summaryNarr: "Kıyafetler ve Giyinmek dersini bitirdiniz, tebrikler! Kısa bir tekrar yapalım.\n\nGömlek {{قَمِيصٌ}}, pantolon {{بَنْطَلُونٌ}}, elbise {{فُسْتَانٌ}}, ayakkabı {{حِذَاءٌ}}. Giyiyorum elbesu, giyiyorsun telbesu; giyilen şey üstünlü olur: {{أَلْبَسُ قَمِيصًا}}.\n\nRenk kelimenin cinsiyetine uyar: {{قَمِيصٌ أَبْيَضُ}} ama {{تَنُّورَةٌ بَيْضَاءُ}}. İnsan olmayan çoğullar dişil tekil sıfat alır: {{الْمَلَابِسُ جَمِيلَةٌ}}. Mağazada beden makâs, dar dayyik, bol vâsi'.\n\nEtkinliklerde önce kartlarla kıyafetleri tekrar edin, sonra 'Cümleyi tamamla' alıştırmasında renk uyumunu çalışın.",
    acts: [
      { type: 'flash', title: 'Kıyafet kartları', desc: 'Kıyafetleri ve giyinme kelimelerini kartlarla öğren.', glyph: 'قَمِيص', items: null },
      {
        type: 'match', title: 'Kıyafet ve anlamı', desc: 'Arapça kelimeyi anlamıyla eşleştir.', glyph: 'مَلَابِس',
        items: [['قَمِيصٌ', 'gömlek'], ['بَنْطَلُونٌ', 'pantolon'], ['فُسْتَانٌ', 'elbise'], ['تَنُّورَةٌ', 'etek'], ['حِذَاءٌ', 'ayakkabı'], ['قُبَّعَةٌ', 'şapka']]
      },
      {
        type: 'mc', title: 'Ne giyiyorsun?', desc: 'Kıyafet, renk ve giyinme cümlelerini anla.', glyph: 'أَلْبَسُ',
        items: [
          { q: '{{مِعْطَفٌ}} ne demektir?', options: ['palto, mont', 'gömlek', 'çorap', 'şapka'], a: 'palto, mont' },
          { q: '"Beyaz bir etek" hangisidir?', options: ['تَنُّورَةٌ بَيْضَاءُ', 'تَنُّورَةٌ أَبْيَضُ', 'بَيْضَاءُ تَنُّورَةٌ', 'التَّنُّورَةُ بَيْضَاءُ'], a: 'تَنُّورَةٌ بَيْضَاءُ', why: '{{تَنُّورَة}} dişil; dişil renk kalıbı {{فَعْلَاءُ}}. {{التَّنُّورَةُ بَيْضَاءُ}} "Etek beyaz." cümlesidir.' },
          { q: '"Ne giyiyorsun?" hangisidir?', options: ['مَاذَا تَلْبَسُ؟', 'كَيْفَ تَلْبَسُ؟', 'أَيْنَ تَلْبَسُ؟', 'مَنْ يَلْبَسُ؟'], a: 'مَاذَا تَلْبَسُ؟', why: 'Fiille sorulan "ne?" {{مَاذَا}}.' },
          { q: '{{ضَيِّقٌ}} ne demektir?', options: ['dar', 'bol', 'uzun', 'pahalı'], a: 'dar' },
          { q: 'Ayağına ne giyersin?', options: ['حِذَاءٌ', 'قُبَّعَةٌ', 'قَمِيصٌ', 'سُتْرَةٌ'], a: 'حِذَاءٌ' },
          { q: '"Kıyafetler güzel." hangisidir?', options: ['الْمَلَابِسُ جَمِيلَةٌ', 'الْمَلَابِسُ جَمِيلٌ', 'الْمَلَابِسُ جَمِيلُونَ', 'مَلَابِسُ الْجَمِيلَةُ'], a: 'الْمَلَابِسُ جَمِيلَةٌ', why: 'İnsan olmayan çoğul: dişil tekil sıfat.' }
        ]
      },
      {
        type: 'fill', title: 'Cümleyi tamamla', desc: 'Kıyafetin cinsiyetine ve cümledeki yerine göre doğru biçimi seç.', glyph: '___',
        items: [
          { s: 'أَلْبَسُ ___ أَبْيَضَ', tr: 'Beyaz bir gömlek giyiyorum.', hint: 'Beyaz bir gömlek giyiyorum.', options: ['قَمِيصًا', 'قَمِيصٌ', 'الْقَمِيصُ'], a: 'قَمِيصًا', why: 'Giyilen şey nesnedir: üstünlü ve tenvinli.' },
          { s: 'سُتْرَتِي ___', tr: 'Ceketim siyah.', hint: 'Ceketim siyah.', options: ['سَوْدَاءُ', 'أَسْوَدُ', 'سُودٌ'], a: 'سَوْدَاءُ', why: '{{سُتْرَة}} dişil: {{سَوْدَاءُ}}.' },
          { s: '___ تَلْبَسِينَ الْيَوْمَ؟', tr: 'Bugün ne giyiyorsun? (kıza)', hint: 'Bugün ne giyiyorsun?', options: ['مَاذَا', 'مَنْ', 'أَيْنَ'], a: 'مَاذَا' },
          { s: 'هٰذِهِ الْأَحْذِيَةُ ___', tr: 'Bu ayakkabılar pahalı.', hint: 'Bu ayakkabılar pahalı.', options: ['غَالِيَةٌ', 'غَالُونَ', 'غَالٍ'], a: 'غَالِيَةٌ', why: 'İnsan olmayan çoğul: dişil tekil sıfat.' },
          { s: 'هَلْ عِنْدَكُمْ مَقَاسٌ ___؟', tr: 'Daha büyük beden var mı?', hint: 'Daha büyük beden var mı?', options: ['أَكْبَرُ', 'كَبِيرٌ', 'الْأَكْبَرُ'], a: 'أَكْبَرُ', why: '"Daha büyük": {{أَكْبَرُ}}.' }
        ]
      },
      LISTEN,
      SPEAK,
      ENDLESS,
      {
        type: 'test', title: 'Kıyafetler testi', desc: 'Karma değerlendirme.', glyph: '؟',
        items: [
          { q: '"Çorap" hangisidir?', options: ['جَوْرَبٌ', 'حِذَاءٌ', 'قُبَّعَةٌ', 'جَيْبٌ'], a: 'جَوْرَبٌ' },
          { t: 'tf', s: 'فُسْتَانٌ kadın elbisesi olduğu hâlde erkek bir kelimedir.', a: true },
          { t: 'tf', s: 'قَمِيصٌ أَبْيَضُ yanlıştır, doğrusu قَمِيصٌ بَيْضَاءُ olur.', a: false, why: '{{قَمِيص}} erkektir: {{قَمِيصٌ أَبْيَضُ}} doğrudur.' },
          { t: 'order', w: ['أَلْبَسُ', 'قَمِيصًا', 'جَدِيدًا'], tr: 'Yeni bir gömlek giyiyorum.' },
          { t: 'order', w: ['هٰذَا', 'الْقَمِيصُ', 'ضَيِّقٌ'], tr: 'Bu gömlek dar.' },
          { q: '{{يَخْلَعُ}} ne demektir?', options: ['çıkarıyor', 'giyiyor', 'yıkıyor', 'satın alıyor'], a: 'çıkarıyor' },
          { t: 'fill', s: 'تَلْبَسُ أُخْتِي ___ جَمِيلًا', tr: 'Kız kardeşim güzel bir elbise giyiyor.', hint: 'Kız kardeşim güzel bir elbise giyiyor.', options: ['فُسْتَانًا', 'فُسْتَانٌ', 'الْفُسْتَانُ'], a: 'فُسْتَانًا' },
          { q: '"Bu elbise kaça?" hangisidir?', options: ['بِكَمْ هٰذَا الْفُسْتَانُ؟', 'كَمْ فُسْتَانًا؟', 'أَيْنَ الْفُسْتَانُ؟', 'مَا هٰذَا الْفُسْتَانُ؟'], a: 'بِكَمْ هٰذَا الْفُسْتَانُ؟' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- 20. Hava Durumu ve Mevsimler */
  {
    id: 'hava', n: 20, level: 'Başlangıç', glyph: 'ش', ar: 'الطَّقْسُ وَالْفُصُولُ', name: 'Hava Durumu ve Mevsimler',
    desc: 'Mevsimler, "Hava nasıl?", güneş, yağmur ve kar: {{الْجَوُّ بَارِدٌ الْيَوْمَ}} "Bugün hava soğuk."',
    long: 'Dört mevsim; "Hava nasıl?" diye sormak ve cevap vermek; güneş, yağmur, kar ve rüzgâr; dişil {{شَمْسٌ}}; sıcaklık derecesi, "çok" demek ve yarının havası için gelecek zaman.',
    tags: 'hava durumu mevsim ilkbahar yaz sonbahar kış güneş yağmur kar rüzgâr bulut sıcak soğuk ılık derece şemsiye taqs jaww shams matar thalj rih sayf shita rabi kharif',
    readMins: 11,
    intro: 'Bu derste havadan söz etmeyi öğreneceksin; Arapçada da sohbet çoğu zaman havayla başlar. Önce dört mevsim, sonra {{كَيْفَ الْجَوُّ؟}} "Hava nasıl?" sorusu ve cevapları. Güneş, yağmur, kar ve rüzgâr kelimelerinden sonra Fiiller dersindeki gelecek zamanla yarının havasını söyleyeceksin: {{غَدًا سَتُمْطِرُ}} "Yarın yağmur yağacak."',
    lesson: [
      {
        h: 'Dört mevsim',
        p: ['Mevsim {{فَصْلٌ}}, çoğulu {{فُصُولٌ}}. Okulda dersindeki "sınıf" kelimesiyle aynı: {{فَصْلٌ}} hem sınıf hem mevsim demektir. Türkçedeki <b>fasıl</b> (bölüm) da bu kelimeden gelir.'],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam'],
          rows: [
            ['الرَّبِيعُ', 'er-rabî‘u', 'ilkbahar'],
            ['الصَّيْفُ', 'es-sayfu', 'yaz'],
            ['الْخَرِيفُ', 'el-harîfu', 'sonbahar'],
            ['الشِّتَاءُ', "eş-şitâ'u", 'kış']
          ]
        },
        ex: [
          { ar: 'أُحِبُّ فَصْلَ الرَّبِيعِ', tl: "uhıbbu fasle'r-rabî‘i", tr: 'İlkbahar mevsimini severim.', en: 'I love the spring season.' },
          { ar: 'الصَّيْفُ حَارٌّ وَالشِّتَاءُ بَارِدٌ', tl: "es-sayfu hârrun ve'ş-şitâ'u bâridun", tr: 'Yaz sıcak, kış soğuktur.', en: 'Summer is hot and winter is cold.' },
          { ar: 'نُسَافِرُ فِي الصَّيْفِ', tl: "nusâfiru fi's-sayfi", tr: 'Yazın yolculuğa çıkarız.', en: 'We travel in summer.' },
          { ar: 'أَيَّ فَصْلٍ تُحِبُّ؟', tl: 'eyye faslin tuhıbbu?', tr: 'Hangi mevsimi seversin?', en: 'Which season do you like?' }
        ],
        tips: [
          '"Yazın, kışın" demek için {{فِي}} kullanılır: {{فِي الصَّيْفِ}} yazın, {{فِي الشِّتَاءِ}} kışın.',
          'Mevsim adları {{ال}} ile kullanılır. {{الرَّبِيعُ}}, {{الصَّيْفُ}} ve {{الشِّتَاءُ}} güneş harfiyle başlar, lam okunmaz; {{الْخَرِيفُ}}\'te okunur.',
          '{{نُسَافِرُ}} "yolculuk ederiz" kelimesi Türkçedeki <b>misafir</b> ile aynı köktendir: Arapçada {{مُسَافِرٌ}} yolcu demektir.'
        ],
        narr: "Merhaba! Bugün havadan konuşacağız. Arapçada da sohbet çoğu zaman havayla başlar. Önce dört mevsim.\n\nMevsim: {{فَصْلٌ}}, fasl. Okulda dersinden hatırlıyor musunuz? Fasl sınıf demekti. Evet, aynı kelime hem sınıf hem mevsim demek. Türkçedeki fasıl, yani bölüm, de buradan gelir.\n\nİlkbahar: {{الرَّبِيعُ}}, er-rabî'. Yaz: {{الصَّيْفُ}}, es-sayf. Sonbahar: {{الْخَرِيفُ}}, el-harîf. Kış: {{الشِّتَاءُ}}, eş-şitâ.\n\nYazın, kışın demek için fî kullanılır: {{فِي الصَّيْفِ}}, yazın. {{فِي الشِّتَاءِ}}, kışın. {{الصَّيْفُ حَارٌّ وَالشِّتَاءُ بَارِدٌ}}, yaz sıcak, kış soğuktur.\n\nArkadaşınıza sorun: {{أَيَّ فَصْلٍ تُحِبُّ؟}}, hangi mevsimi seversin? Cevap: {{أُحِبُّ فَصْلَ الرَّبِيعِ}}, ilkbahar mevsimini severim."
      },
      {
        h: 'Hava nasıl?',
        p: [
          'Hava için iki kelime kullanılır: {{الطَّقْسُ}} "hava durumu" ve {{الْجَوُّ}} "hava". Soru: {{كَيْفَ الْجَوُّ الْيَوْمَ؟}} "Bugün hava nasıl?"',
          'Cevap bir isim cümlesidir: {{الْجَوُّ}} + sıfat. {{الْجَوُّ حَارٌّ}} "Hava sıcak." {{جَوّ}} erkek olduğu için sıfat da erkektir. "Çok" için sıfattan sonra {{جِدًّا}} gelir: {{الْجَوُّ بَارِدٌ جِدًّا}} "Hava çok soğuk."'
        ],
        table: {
          cols: ['Arapça', 'Okunuş', 'Anlam'],
          rows: [
            ['حَارٌّ', 'hârrun', 'sıcak'],
            ['بَارِدٌ', 'bâridun', 'soğuk'],
            ['دَافِئٌ', "dâfi'un", 'ılık'],
            ['مُعْتَدِلٌ', 'mu‘tedilun', 'ılıman, ne sıcak ne soğuk'],
            ['جَمِيلٌ', 'cemîlun', 'güzel'],
            ['سَيِّئٌ', "seyyi'un", 'kötü']
          ]
        },
        ex: [
          { ar: 'كَيْفَ الْجَوُّ الْيَوْمَ؟', tl: "keyfe'l-cevvu'l-yevme?", tr: 'Bugün hava nasıl?', en: "How's the weather today?" },
          { ar: 'الْجَوُّ جَمِيلٌ', tl: 'el-cevvu cemîlun', tr: 'Hava güzel.', en: 'The weather is nice.' },
          { ar: 'الْجَوُّ بَارِدٌ جِدًّا', tl: 'el-cevvu bâridun ciddan', tr: 'Hava çok soğuk.', en: 'The weather is very cold.' },
          { ar: 'الطَّقْسُ مُعْتَدِلٌ فِي الرَّبِيعِ', tl: "et-taksu mu‘tedilun fi'r-rabî‘i", tr: 'İlkbaharda hava ılımandır.', en: 'The weather is mild in spring.' }
        ],
        cmp: { tr: 'Türkçede "Hava soğuk." deriz; Arapçada da "olmak" fiili gerekmez: {{الْجَوُّ بَارِدٌ}}.', en: 'İngilizcede "It is cold." denir; Arapçada "it" gibi boş bir özne yoktur, hava kelimesi söylenir.' },
        tips: [
          'Türkçedeki <b>itidal</b> ve <b>mutedil</b> (ölçülü) kelimeleri {{مُعْتَدِلٌ}} ile aynı kökten.',
          '{{جِدًّا}} "çok", Türkçedeki <b>ciddi</b> kelimesiyle aynı köktendir.'
        ],
        narr: "Şimdi havanın nasıl olduğunu soralım. Hava için iki kelime var: {{الطَّقْسُ}}, et-taks, yani hava durumu, ve {{الْجَوُّ}}, el-cevv, yani hava. Soru: {{كَيْفَ الْجَوُّ الْيَوْمَ؟}}, bugün hava nasıl?\n\nCevap çok kolay, bir isim cümlesi: el-cevv ve bir sıfat. Hava sıcak: {{الْجَوُّ حَارٌّ}}. Hava soğuk: {{الْجَوُّ بَارِدٌ}}. Ilık: {{دَافِئٌ}}, dâfi. Ne sıcak ne soğuk: {{مُعْتَدِلٌ}}, mu'tedil. Türkçedeki mutedil ve itidal kelimeleri buradan gelir.\n\nİngilizcedeki it gibi boş bir özneye Arapçada gerek yok; Türkçedeki gibi doğrudan hava deriz.\n\nÇok demek için sıfattan sonra {{جِدًّا}}, ciddan, gelir: {{الْجَوُّ بَارِدٌ جِدًّا}}, hava çok soğuk. Ciddan, Türkçedeki ciddi kelimesiyle aynı kökten."
      },
      {
        h: 'Güneş, yağmur, kar ve rüzgâr',
        p: [
          'Gökyüzünde neler var: {{شَمْسٌ}} güneş, {{غُيُومٌ}} bulutlar, {{مَطَرٌ}} yağmur, {{ثَلْجٌ}} kar, {{رِيحٌ}} rüzgâr. {{شَمْسٌ}} ve {{رِيحٌ}} sonlarında {{ة}} olmadığı hâlde dişildir: {{الشَّمْسُ حَارَّةٌ}} "Güneş sıcak."',
          'Havayı tek kelimeyle anlatmak için bu kelimelerden sıfat yapılır: {{مُشْمِسٌ}} güneşli, {{غَائِمٌ}} bulutlu, {{مُمْطِرٌ}} yağmurlu. "Yağmur yağıyor" demek için {{تُمْطِرُ}}, "kar yağıyor" için {{يَنْزِلُ الثَّلْجُ}} "kar iniyor" denir.'
        ],
        table: {
          cols: ['İsim', 'Anlam', 'Sıfat', 'Anlam'],
          rows: [
            ['شَمْسٌ', 'güneş', 'مُشْمِسٌ', 'güneşli'],
            ['غُيُومٌ', 'bulutlar', 'غَائِمٌ', 'bulutlu'],
            ['مَطَرٌ', 'yağmur', 'مُمْطِرٌ', 'yağmurlu'],
            ['رِيحٌ', 'rüzgâr', 'عَاصِفٌ', 'fırtınalı']
          ]
        },
        ex: [
          { ar: 'الْجَوُّ مُشْمِسٌ الْيَوْمَ', tl: "el-cevvu muşmisuni'l-yevme", tr: 'Bugün hava güneşli.', en: "It's sunny today." },
          { ar: 'السَّمَاءُ غَائِمَةٌ', tl: "es-semâ'u gâ'imetun", tr: 'Gökyüzü bulutlu.', en: 'The sky is cloudy.' },
          { ar: 'تُمْطِرُ الْآنَ', tl: "tumtıru'l-âne", tr: 'Şu an yağmur yağıyor.', en: "It's raining now." },
          { ar: 'يَنْزِلُ الثَّلْجُ فِي الشِّتَاءِ', tl: "yenzilu's-selcu fi'ş-şitâ'i", tr: 'Kışın kar yağar.', en: 'It snows in winter.' }
        ],
        tips: [
          '{{السَّمَاءُ}} "gökyüzü" de dişildir: {{السَّمَاءُ صَافِيَةٌ}} "Gökyüzü açık."',
          'Türkçedeki <b>şemsiye</b>, {{شَمْسٌ}} kelimesinden gelir: kelimesi kelimesine "güneşlik".'
        ],
        narr: "Gökyüzüne bakalım. Güneş: {{شَمْسٌ}}, şems. Bulutlar: {{غُيُومٌ}}, guyûm. Yağmur: {{مَطَرٌ}}, matar. Kar: {{ثَلْجٌ}}, selc. Rüzgâr: {{رِيحٌ}}, rîh.\n\nDikkat: şems ve rîh dişildir, sonlarında yuvarlak te olmadığı hâlde. Bu yüzden güneş sıcak derken: {{الشَّمْسُ حَارَّةٌ}}. Gökyüzü kelimesi {{السَّمَاءُ}} de dişildir.\n\nHavayı tek kelimeyle anlatmak için sıfatlar: güneşli {{مُشْمِسٌ}}, muşmis. Bulutlu {{غَائِمٌ}}, gâim. Yağmurlu {{مُمْطِرٌ}}, mumtır. {{الْجَوُّ مُشْمِسٌ الْيَوْمَ}}, bugün hava güneşli.\n\nYağmur yağıyor demek için tek bir fiil yeter: {{تُمْطِرُ}}, tumtır. Kar yağıyor derken ise kar iniyor deriz: {{يَنْزِلُ الثَّلْجُ}}. Bir de Türkçeden bir bilgi: şemsiye kelimesi şems, yani güneşten gelir. Kelimesi kelimesine güneşlik."
      },
      {
        h: 'Sıcaklık ve yarının havası',
        p: [
          'Sıcaklık {{دَرَجَةُ الْحَرَارَةِ}}, kelimesi kelimesine "ısı derecesi". Türkçedeki <b>derece</b> ve <b>hararet</b> buradan gelir: {{دَرَجَةُ الْحَرَارَةِ ثَلَاثُونَ}} "Sıcaklık otuz derece."',
          'Yarını söylemek için Fiiller dersindeki gelecek zaman eki {{سَـ}} kullanılır: {{غَدًا سَتُمْطِرُ}} "Yarın yağmur yağacak.", {{سَيَنْزِلُ الثَّلْجُ}} "Kar yağacak."'
        ],
        ex: [
          { ar: 'كَمْ دَرَجَةُ الْحَرَارَةِ الْيَوْمَ؟', tl: "kem deracetu'l-harârati'l-yevme?", tr: 'Bugün hava kaç derece?', en: "What's the temperature today?" },
          { ar: 'دَرَجَةُ الْحَرَارَةِ عِشْرُونَ', tl: "deracetu'l-harârati ‘işrûne", tr: 'Sıcaklık yirmi derece.', en: 'The temperature is twenty degrees.' },
          { ar: 'غَدًا سَتُمْطِرُ', tl: 'gaden setumtıru', tr: 'Yarın yağmur yağacak.', en: 'It will rain tomorrow.' },
          { ar: 'غَدًا سَيَنْزِلُ الثَّلْجُ', tl: "gaden seyenzilu's-selcu", tr: 'Yarın kar yağacak.', en: 'It will snow tomorrow.' },
          { ar: 'خُذْ مِظَلَّتَكَ، سَتُمْطِرُ', tl: 'huz mizalleteke, setumtıru', tr: 'Şemsiyeni al, yağmur yağacak.', en: 'Take your umbrella, it will rain.' }
        ],
        tips: [
          'Yağmur şemsiyesi Arapçada {{مِظَلَّةٌ}} (gölgelik) diye de söylenir; {{شَمْسِيَّةٌ}} daha çok güneş şemsiyesidir.',
          'Sayılar için Sayılar dersine bakabilirsin: {{عِشْرُونَ}} yirmi, {{ثَلَاثُونَ}} otuz.'
        ],
        narr: "Son bölümde sıcaklığı ve yarının havasını öğreneceğiz. Sıcaklık: {{دَرَجَةُ الْحَرَارَةِ}}, deracetu'l-harâra. Kelimesi kelimesine ısı derecesi. Türkçedeki derece ve hararet kelimeleri buradan gelir.\n\nSoru: {{كَمْ دَرَجَةُ الْحَرَارَةِ الْيَوْمَ؟}}, bugün hava kaç derece? Cevap: {{دَرَجَةُ الْحَرَارَةِ عِشْرُونَ}}, sıcaklık yirmi derece.\n\nYarının havasını söylemek için Fiiller dersindeki gelecek zaman ekini kullanırız: fiilin başına se gelir. Yağmur yağıyor tumtır idi; yağmur yağacak: {{سَتُمْطِرُ}}, setumtır. {{غَدًا سَتُمْطِرُ}}, yarın yağmur yağacak. {{غَدًا سَيَنْزِلُ الثَّلْجُ}}, yarın kar yağacak.\n\nVe hava durumunu dinledikten sonra arkadaşınıza: {{خُذْ مِظَلَّتَكَ، سَتُمْطِرُ}}, şemsiyeni al, yağmur yağacak."
      }
    ],
    keys: [
      'Mevsimler: {{الرَّبِيعُ}} ilkbahar, {{الصَّيْفُ}} yaz, {{الْخَرِيفُ}} sonbahar, {{الشِّتَاءُ}} kış; "yazın" {{فِي الصَّيْفِ}}.',
      'Soru: {{كَيْفَ الْجَوُّ؟}} Cevap: {{الْجَوُّ}} + sıfat: {{الْجَوُّ حَارٌّ}}; "çok" {{جِدًّا}}.',
      '{{شَمْسٌ}}, {{رِيحٌ}} ve {{سَمَاءٌ}} dişildir: {{الشَّمْسُ حَارَّةٌ}}. Yağmur yağıyor: {{تُمْطِرُ}}.',
      'Sıcaklık {{دَرَجَةُ الْحَرَارَةِ}}; yarın için {{سَـ}}: {{غَدًا سَتُمْطِرُ}}.'
    ],
    mistakes: [
      { bad: 'الشَّمْسُ حَارٌّ', good: 'الشَّمْسُ حَارَّةٌ', why: '{{شَمْس}} dişildir; sıfat da dişil olur.' },
      { bad: 'هُوَ بَارِدٌ', good: 'الْجَوُّ بَارِدٌ', why: 'İngilizcedeki "it" gibi boş bir özne yoktur; havadan söz ederken {{الْجَوُّ}} denir.' },
      { bad: 'فِي صَيْفٍ', good: 'فِي الصَّيْفِ', why: 'Mevsim adları {{ال}} ile kullanılır.' }
    ],
    words: [
      { ar: 'فَصْل', tl: 'fasl', tr: 'mevsim; sınıf', en: 'season; class' },
      { ar: 'رَبِيع', tl: 'rabî‘', tr: 'ilkbahar', en: 'spring' },
      { ar: 'صَيْف', tl: 'sayf', tr: 'yaz', en: 'summer' },
      { ar: 'خَرِيف', tl: 'harîf', tr: 'sonbahar', en: 'autumn' },
      { ar: 'شِتَاء', tl: "şitâ'", tr: 'kış', en: 'winter' },
      { ar: 'طَقْس', tl: 'taks', tr: 'hava durumu', en: 'weather' },
      { ar: 'جَوّ', tl: 'cevv', tr: 'hava', en: 'weather, air' },
      { ar: 'شَمْس', tl: 'şems', tr: 'güneş', en: 'sun' },
      { ar: 'مَطَر', tl: 'matar', tr: 'yağmur', en: 'rain' },
      { ar: 'ثَلْج', tl: 'selc', tr: 'kar', en: 'snow' },
      { ar: 'رِيح', tl: 'rîh', tr: 'rüzgâr', en: 'wind' },
      { ar: 'غَيْم', tl: 'gaym', tr: 'bulut', en: 'cloud' },
      { ar: 'حَارّ', tl: 'hârr', tr: 'sıcak', en: 'hot' },
      { ar: 'بَارِد', tl: 'bârid', tr: 'soğuk', en: 'cold' },
      { ar: 'دَافِئ', tl: "dâfi'", tr: 'ılık', en: 'warm' },
      { ar: 'جِدًّا', tl: 'ciddan', tr: 'çok', en: 'very' }
    ],
    summaryNarr: "Hava Durumu ve Mevsimler dersini bitirdiniz, tebrikler! Kısa bir tekrar yapalım.\n\nMevsimler: {{الرَّبِيعُ}} ilkbahar, {{الصَّيْفُ}} yaz, {{الْخَرِيفُ}} sonbahar, {{الشِّتَاءُ}} kış. Yazın demek için {{فِي الصَّيْفِ}}.\n\nHava nasıl diye sormak için {{كَيْفَ الْجَوُّ؟}} Cevap el-cevv ve bir sıfat: {{الْجَوُّ حَارٌّ}}, hava sıcak; çok için ciddan. Güneş, rüzgâr ve gökyüzü dişildir: {{الشَّمْسُ حَارَّةٌ}}. Yağmur yağıyor tumtır, yarın yağacak setumtır.\n\nEtkinliklerde önce kartlarla kelimeleri tekrar edin, sonra 'Cümleyi tamamla' alıştırmasında dişil güneşe ve gelecek zamana dikkat edin.",
    acts: [
      { type: 'flash', title: 'Hava kartları', desc: 'Mevsimleri ve hava durumu kelimelerini kartlarla öğren.', glyph: 'شَمْس', items: null },
      {
        type: 'match', title: 'Mevsim ve hava', desc: 'Arapça kelimeyi anlamıyla eşleştir.', glyph: 'فَصْل',
        items: [['الصَّيْفُ', 'yaz'], ['الشِّتَاءُ', 'kış'], ['الرَّبِيعُ', 'ilkbahar'], ['الْخَرِيفُ', 'sonbahar'], ['مَطَرٌ', 'yağmur'], ['ثَلْجٌ', 'kar']]
      },
      {
        type: 'mc', title: 'Hava nasıl?', desc: 'Mevsim ve hava cümlelerini anla.', glyph: 'كَيْفَ',
        items: [
          { q: '{{الشِّتَاءُ}} hangi mevsimdir?', options: ['kış', 'yaz', 'ilkbahar', 'sonbahar'], a: 'kış' },
          { q: '"Bugün hava nasıl?" hangisidir?', options: ['كَيْفَ الْجَوُّ الْيَوْمَ؟', 'أَيْنَ الْجَوُّ الْيَوْمَ؟', 'مَتَى الْجَوُّ الْيَوْمَ؟', 'مَنِ الْجَوُّ الْيَوْمَ؟'], a: 'كَيْفَ الْجَوُّ الْيَوْمَ؟', why: '"Nasıl?" {{كَيْفَ}}.' },
          { q: '{{مُشْمِسٌ}} ne demektir?', options: ['güneşli', 'bulutlu', 'yağmurlu', 'karlı'], a: 'güneşli' },
          { q: '"Güneş sıcak." hangisidir?', options: ['الشَّمْسُ حَارَّةٌ', 'الشَّمْسُ حَارٌّ', 'شَمْسٌ حَارٌّ', 'الشَّمْسُ الْحَارُّ'], a: 'الشَّمْسُ حَارَّةٌ', why: '{{شَمْس}} dişildir.' },
          { q: '{{تُمْطِرُ}} ne demektir?', options: ['yağmur yağıyor', 'kar yağıyor', 'güneş açıyor', 'rüzgâr esiyor'], a: 'yağmur yağıyor' },
          { q: '"Hava çok soğuk." hangisidir?', options: ['الْجَوُّ بَارِدٌ جِدًّا', 'الْجَوُّ جِدًّا بَارِدٌ', 'جِدًّا الْجَوُّ بَارِدٌ', 'الْجَوُّ بَارِدَةٌ جِدًّا'], a: 'الْجَوُّ بَارِدٌ جِدًّا', why: '{{جِدًّا}} sıfattan sonra gelir; {{جَوّ}} erkektir.' }
        ]
      },
      {
        type: 'fill', title: 'Cümleyi tamamla', desc: 'Dişil kelimelere ve gelecek zamana dikkat ederek doğru kelimeyi seç.', glyph: '___',
        items: [
          { s: 'الشَّمْسُ ___', tr: 'Güneş sıcak.', hint: 'Güneş sıcak.', options: ['حَارَّةٌ', 'حَارٌّ', 'حَرَارَةٌ'], a: 'حَارَّةٌ', why: '{{شَمْس}} dişil.' },
          { s: 'نُسَافِرُ فِي ___', tr: 'Yazın yolculuğa çıkarız.', hint: 'Yazın yolculuğa çıkarız.', options: ['الصَّيْفِ', 'الصَّيْفُ', 'صَيْفٌ'], a: 'الصَّيْفِ', why: '{{فِي}} kelimesinden sonra isim esreli olur.' },
          { s: '___ الْجَوُّ الْيَوْمَ؟', tr: 'Bugün hava nasıl?', hint: 'Bugün hava nasıl?', options: ['كَيْفَ', 'كَمْ', 'مَاذَا'], a: 'كَيْفَ' },
          { s: 'غَدًا ___', tr: 'Yarın yağmur yağacak.', hint: 'Yarın yağmur yağacak.', options: ['سَتُمْطِرُ', 'تُمْطِرُ', 'مَطَرٌ'], a: 'سَتُمْطِرُ', why: 'Gelecek zaman: {{سَـ}} + şimdiki zaman.' },
          { s: 'السَّمَاءُ ___', tr: 'Gökyüzü bulutlu.', hint: 'Gökyüzü bulutlu.', options: ['غَائِمَةٌ', 'غَائِمٌ', 'غُيُومٌ'], a: 'غَائِمَةٌ', why: '{{سَمَاء}} dişil.' }
        ]
      },
      LISTEN,
      SPEAK,
      ENDLESS,
      {
        type: 'test', title: 'Hava durumu testi', desc: 'Karma değerlendirme.', glyph: '؟',
        items: [
          { q: '"Kar" hangisidir?', options: ['ثَلْجٌ', 'مَطَرٌ', 'رِيحٌ', 'غَيْمٌ'], a: 'ثَلْجٌ' },
          { t: 'tf', s: 'الْخَرِيفُ "sonbahar" demektir.', a: true },
          { t: 'tf', s: 'شَمْسٌ erkek bir kelimedir.', a: false, why: '{{شَمْس}} dişildir: {{الشَّمْسُ حَارَّةٌ}}.' },
          { t: 'order', w: ['الْجَوُّ', 'بَارِدٌ', 'جِدًّا'], tr: 'Hava çok soğuk.' },
          { t: 'order', w: ['يَنْزِلُ', 'الثَّلْجُ', 'فِي', 'الشِّتَاءِ'], tr: 'Kışın kar yağar.' },
          { q: '{{دَرَجَةُ الْحَرَارَةِ}} ne demektir?', options: ['sıcaklık', 'mevsim', 'hava durumu', 'rüzgâr'], a: 'sıcaklık' },
          { t: 'fill', s: 'أُحِبُّ فَصْلَ ___', tr: 'İlkbahar mevsimini severim.', hint: 'İlkbahar mevsimini severim.', options: ['الرَّبِيعِ', 'الرَّبِيعُ', 'رَبِيعٌ'], a: 'الرَّبِيعِ', why: 'Tamlamada ikinci kelime esreli olur.' },
          { q: '"Yarın kar yağacak." hangisidir?', options: ['غَدًا سَيَنْزِلُ الثَّلْجُ', 'أَمْسِ نَزَلَ الثَّلْجُ', 'الْيَوْمَ يَنْزِلُ الثَّلْجُ', 'غَدًا الثَّلْجُ'], a: 'غَدًا سَيَنْزِلُ الثَّلْجُ' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- 21. Meslekler ve İş */
  {
    id: 'meslekler', n: 21, level: 'Başlangıç', glyph: 'ه', ar: 'الْمِهَنُ', name: 'Meslekler ve İş',
    desc: 'Meslek adları, usta kalıbı {{فَعَّال}} ve "Ne iş yapıyorsun?": {{مَا عَمَلُكَ؟}}',
    long: 'Meslek adları ve kadınlar için {{ة}} eki; {{خَبَّاز}}, {{نَجَّار}} gibi usta kalıbı; mesleğini ve iş yerini sormak, anlatmak; kim ne yapar ve "büyüyünce ne olmak istiyorsun?"',
    tags: 'meslek iş çalışmak doktor öğretmen mühendis hemşire polis avukat şoför pilot aşçı fırıncı marangoz terzi berber çiftçi memur ofis fabrika şirket amal mihna muhandis tabib saiq khabbaz najjar',
    readMins: 12,
    intro: 'Bu derste meslekleri ve iş hayatını Arapça anlatacaksın. Meslek adlarının çoğu iki kalıpta: {{مُعَلِّم}} gibi {{مُـ}} ile başlayanlar ve {{خَبَّاز}} "fırıncı" gibi ortası şeddeli usta kalıbı. Türkçedeki <b>bakkal</b>, <b>hamal</b> ve <b>kasap</b> da bu ikinci kalıptandır. Sonunda {{مَا عَمَلُكَ؟}} "Ne iş yapıyorsun?" sorusunu cevaplayacaksın.',
    lesson: [
      {
        h: 'Meslekler',
        p: ['Meslek {{مِهْنَةٌ}}, iş {{عَمَلٌ}}. Kadınlar için meslek adının sonuna {{ة}} eklenir: {{طَبِيبٌ}} doktor, {{طَبِيبَةٌ}} kadın doktor; {{مُعَلِّمٌ}} öğretmen, {{مُعَلِّمَةٌ}} kadın öğretmen.'],
        table: {
          cols: ['Erkek', 'Kadın', 'Anlam'],
          rows: [
            ['طَبِيبٌ', 'طَبِيبَةٌ', 'doktor'],
            ['مُعَلِّمٌ', 'مُعَلِّمَةٌ', 'öğretmen'],
            ['مُهَنْدِسٌ', 'مُهَنْدِسَةٌ', 'mühendis'],
            ['مُمَرِّضٌ', 'مُمَرِّضَةٌ', 'hemşire'],
            ['مُوَظَّفٌ', 'مُوَظَّفَةٌ', 'memur, çalışan'],
            ['شُرْطِيٌّ', 'شُرْطِيَّةٌ', 'polis'],
            ['سَائِقٌ', 'سَائِقَةٌ', 'şoför'],
            ['مُحَامٍ', 'مُحَامِيَةٌ', 'avukat']
          ]
        },
        ex: [
          { ar: 'أَبِي طَبِيبٌ', tl: 'ebî tabîbun', tr: 'Babam doktor.', en: 'My father is a doctor.' },
          { ar: 'أُمِّي مُعَلِّمَةٌ', tl: 'ummî mu‘allimetun', tr: 'Annem öğretmen.', en: 'My mother is a teacher.' },
          { ar: 'أَخِي مُهَنْدِسٌ فِي شَرِكَةٍ كَبِيرَةٍ', tl: 'ahî muhendisun fî şeriketin kebîretin', tr: 'Erkek kardeşim büyük bir şirkette mühendis.', en: 'My brother is an engineer at a big company.' },
          { ar: 'هِيَ مُمَرِّضَةٌ فِي الْمُسْتَشْفَى', tl: "hiye mumerridatun fi'l-musteşfâ", tr: 'O (kadın) hastanede hemşire.', en: 'She is a nurse at the hospital.' }
        ],
        tips: [
          'Türkçeye geçen meslekler: {{طَبِيبٌ}} tabip, {{مُهَنْدِسٌ}} mühendis, {{مُعَلِّمٌ}} muallim, {{تَاجِرٌ}} tacir, {{مُدِيرٌ}} müdür.',
          'Zamirler dersinden hatırla: Arapçada şimdiki zamanda "olmak" fiili yoktur. {{أَنَا طَبِيبٌ}} "Ben doktorum."'
        ],
        narr: "Merhaba! Bugün meslekleri öğreneceğiz. Meslek: {{مِهْنَةٌ}}, mihne. İş: {{عَمَلٌ}}, amel.\n\nDoktor: {{طَبِيبٌ}}, tabîb. Öğretmen: {{مُعَلِّمٌ}}, mu'allim. Mühendis: {{مُهَنْدِسٌ}}, muhendis. Gördüğünüz gibi Türkçede de tabip, muallim ve mühendis deriz. Hemşire: {{مُمَرِّضٌ}}, mumerrid. Memur ya da çalışan: {{مُوَظَّفٌ}}, muvazzaf. Polis: {{شُرْطِيٌّ}}, şurtiyy. Şoför: {{سَائِقٌ}}, sâik.\n\nKadınlar için meslek adının sonuna yuvarlak te eklenir. Kadın doktor: {{طَبِيبَةٌ}}, tabîbe. Kadın öğretmen: {{مُعَلِّمَةٌ}}, mu'allime. Hemşire hanım: {{مُمَرِّضَةٌ}}, mumerrida.\n\nZamirler dersinden hatırlayın, Arapçada şimdiki zamanda olmak fiili yoktur: {{أَبِي طَبِيبٌ}}, babam doktor. {{أُمِّي مُعَلِّمَةٌ}}, annem öğretmen."
      },
      {
        h: 'Usta kalıbı: فَعَّال',
        p: [
          'Bir işi sürekli yapan kişinin adı çoğu zaman {{فَعَّال}} kalıbındadır: ortadaki harf şeddeli, ardından uzun â. Kökü bilirsen anlamı tahmin edebilirsin: {{خُبْزٌ}} ekmek, {{خَبَّازٌ}} fırıncı (ekmek yapan); {{طَبْخٌ}} pişirme, {{طَبَّاخٌ}} aşçı.',
          'Türkçedeki <b>bakkal</b> ({{بَقَّالٌ}}), <b>hamal</b> ({{حَمَّالٌ}}) ve <b>kasap</b> ({{قَصَّابٌ}}) da bu kalıptan gelir.'
        ],
        table: {
          cols: ['Kök kelime', 'Anlam', 'Usta', 'Anlam'],
          rows: [
            ['خُبْزٌ', 'ekmek', 'خَبَّازٌ', 'fırıncı'],
            ['طَبْخٌ', 'pişirme', 'طَبَّاخٌ', 'aşçı'],
            ['نِجَارَةٌ', 'marangozluk', 'نَجَّارٌ', 'marangoz'],
            ['خِيَاطَةٌ', 'dikiş', 'خَيَّاطٌ', 'terzi'],
            ['حِلَاقَةٌ', 'tıraş', 'حَلَّاقٌ', 'berber'],
            ['طَيَرَانٌ', 'uçuş', 'طَيَّارٌ', 'pilot'],
            ['فِلَاحَةٌ', 'tarım', 'فَلَّاحٌ', 'çiftçi']
          ]
        },
        ex: [
          { ar: 'الْخَبَّازُ يَخْبِزُ الْخُبْزَ', tl: "el-habbâzu yahbizu'l-hubze", tr: 'Fırıncı ekmek pişirir.', en: 'The baker bakes bread.' },
          { ar: 'جَدِّي نَجَّارٌ مَاهِرٌ', tl: 'ceddî neccârun mâhirun', tr: 'Dedem usta bir marangoz.', en: 'My grandfather is a skilled carpenter.' },
          { ar: 'الطَّيَّارُ فِي الطَّائِرَةِ', tl: "et-tayyâru fi't-tâ'ireti", tr: 'Pilot uçakta.', en: 'The pilot is on the plane.' },
          { ar: 'أَذْهَبُ إِلَى الْحَلَّاقِ كُلَّ شَهْرٍ', tl: "ezhebu ile'l-hallâki kulle şehrin", tr: 'Her ay berbere giderim.', en: 'I go to the barber every month.' }
        ],
        tips: [
          'Bu kalıbın dişili {{فَعَّالَةٌ}}: {{خَيَّاطَةٌ}} kadın terzi. Ama dikkat: {{ثَلَّاجَةٌ}} (buzdolabı) ve {{سَيَّارَةٌ}} (araba) gibi alet ve araçlar da aynı kalıptadır.',
          'Türkçedeki <b>mahir</b> (becerikli) kelimesi {{مَاهِرٌ}} kelimesinin kendisidir.'
        ],
        narr: "Şimdi çok kullanışlı bir kalıp öğreneceğiz: usta kalıbı. Bir işi sürekli yapan kişinin adı genellikle şöyledir: ortadaki harf şeddeli, ardından uzun â.\n\nEkmek: {{خُبْزٌ}}, hubz. Ekmek yapan, yani fırıncı: {{خَبَّازٌ}}, habbâz. Pişirme: {{طَبْخٌ}}, tabh. Aşçı: {{طَبَّاخٌ}}, tabbâh. Marangoz: {{نَجَّارٌ}}, neccâr. Terzi: {{خَيَّاطٌ}}, hayyât. Berber: {{حَلَّاقٌ}}, hallâk. Pilot: {{طَيَّارٌ}}, tayyâr. Tayyare kelimesini hatırlayın! Çiftçi: {{فَلَّاحٌ}}, fellâh.\n\nTürkçede de bu kalıptan kelimeler var: bakkal, hamal ve kasap. Arapçada {{بَقَّالٌ}}, {{حَمَّالٌ}} ve {{قَصَّابٌ}}.\n\nÖrnek: {{الْخَبَّازُ يَخْبِزُ الْخُبْزَ}}, fırıncı ekmek pişirir. {{جَدِّي نَجَّارٌ مَاهِرٌ}}, dedem usta bir marangoz. Mâhir kelimesi de Türkçede aynen kullanılıyor."
      },
      {
        h: '"Ne iş yapıyorsun?"',
        p: [
          'Birinin mesleğini sormanın iki yolu var: {{مَا عَمَلُكَ؟}} "İşin ne?" ve {{مَاذَا تَعْمَلُ؟}} "Ne iş yapıyorsun?" Kadına {{مَا عَمَلُكِ؟}}, {{مَاذَا تَعْمَلِينَ؟}} denir.',
          'Çalışmak fiili {{عَمِلَ}} "çalıştı", şimdiki zamanı {{يَعْمَلُ}}. Nerede çalıştığını {{فِي}} ile söylersin: {{أَعْمَلُ فِي مَكْتَبٍ}} "Bir ofiste çalışıyorum."'
        ],
        table: {
          cols: ['İş yeri', 'Anlam'],
          rows: [
            ['مَكْتَبٌ', 'ofis, büro'],
            ['مَصْنَعٌ', 'fabrika'],
            ['شَرِكَةٌ', 'şirket'],
            ['مُسْتَشْفًى', 'hastane'],
            ['مَطْعَمٌ', 'lokanta'],
            ['مَدْرَسَةٌ', 'okul']
          ]
        },
        ex: [
          { ar: 'مَا عَمَلُكَ؟', tl: 'mâ ‘ameluke?', tr: 'İşin ne?', en: 'What is your job?' },
          { ar: 'أَنَا مُوَظَّفٌ فِي بَنْكٍ', tl: 'ene muvazzafun fî benkin', tr: 'Bir bankada memurum.', en: 'I am an employee at a bank.' },
          { ar: 'أَيْنَ تَعْمَلِينَ؟', tl: 'eyne ta‘melîne?', tr: 'Nerede çalışıyorsun? (kadına)', en: 'Where do you work?' },
          { ar: 'أَعْمَلُ فِي مَصْنَعٍ قَرِيبٍ مِنْ بَيْتِي', tl: 'a‘melu fî masna‘in karîbin min beytî', tr: 'Evime yakın bir fabrikada çalışıyorum.', en: 'I work in a factory near my home.' }
        ],
        cmp: { tr: 'Türkçede "Doktorum." deriz; mesleği söylemek için ayrı bir fiil gerekmez.', en: 'İngilizcede "I am a doctor." denir. Arapçada {{أَنَا طَبِيبٌ}}: "am" de "a" da yoktur, belirsizliği tenvin gösterir.' },
        tips: [
          'İş yerlerinin çoğu Şehirde dersindeki yer kalıbında: {{مَكْتَبٌ}} yazı yazılan yer, {{مَصْنَعٌ}} bir şeyin yapıldığı yer, {{مَطْعَمٌ}} yemek yenen yer.',
          'Türkçedeki <b>amel</b> (iş, eylem) ve <b>amele</b> (işçi) kelimeleri {{عَمَلٌ}} ile aynı kökten.'
        ],
        narr: "Birinin mesleğini nasıl sorarız? İki yol var. Birincisi: {{مَا عَمَلُكَ؟}}, mâ ameluke? İşin ne? İkincisi fiille: {{مَاذَا تَعْمَلُ؟}}, mâzâ ta'melu? Ne iş yapıyorsun? Bir kadına sorarken {{مَاذَا تَعْمَلِينَ؟}}, mâzâ ta'melîne.\n\nCevap: {{أَنَا مُهَنْدِسٌ}}, ben mühendisim. Ya da nerede çalıştığınızı söylersiniz. Çalışıyorum: {{أَعْمَلُ}}, a'melu. Nerede? fî ile: {{أَعْمَلُ فِي مَكْتَبٍ}}, bir ofiste çalışıyorum.\n\nİş yerlerinin çoğu Şehirde dersindeki me ile başlayan yer kalıbındadır. Ofis: {{مَكْتَبٌ}}, yazı yazılan yer. Fabrika: {{مَصْنَعٌ}}, masna', bir şeyin yapıldığı yer. Lokanta: {{مَطْعَمٌ}}, yemek yenen yer.\n\nBir şey daha: Türkçedeki amel ve amele kelimeleri, amel yani iş kelimesinden gelir."
      },
      {
        h: 'Kim ne yapar?',
        p: [
          'Mesleği anlatırken fiil kullanılır: {{الطَّبِيبُ يُعَالِجُ الْمَرْضَى}} "Doktor hastaları tedavi eder." Fiil başa da gelebilir: {{يُعَالِجُ الطَّبِيبُ الْمَرْضَى}}.',
          'Geleceği hayal etmek için kalıp: {{أُرِيدُ أَنْ أَكُونَ}} "olmak istiyorum" + meslek. Meslek burada üstünlü olur: {{أُرِيدُ أَنْ أَكُونَ طَبِيبًا}} "Doktor olmak istiyorum."'
        ],
        ex: [
          { ar: 'الْمُعَلِّمُ يُعَلِّمُ الطُّلَّابَ', tl: "el-mu‘allimu yu‘allimu't-tullâbe", tr: 'Öğretmen öğrencilere öğretir.', en: 'The teacher teaches the students.' },
          { ar: 'السَّائِقُ يَقُودُ الْحَافِلَةَ', tl: "es-sâ'iku yekûdu'l-hâfilete", tr: 'Şoför otobüsü sürer.', en: 'The driver drives the bus.' },
          { ar: 'الطَّبَّاخُ يَطْبُخُ الطَّعَامَ', tl: "et-tabbâhu yatbuhu't-ta‘âme", tr: 'Aşçı yemeği pişirir.', en: 'The cook cooks the food.' },
          { ar: 'أُرِيدُ أَنْ أَكُونَ مُهَنْدِسًا', tl: 'urîdu en ekûne muhendisen', tr: 'Mühendis olmak istiyorum.', en: 'I want to be an engineer.' },
          { ar: 'مَاذَا تُرِيدُ أَنْ تَكُونَ؟', tl: 'mâzâ turîdu en tekûne?', tr: 'Ne olmak istiyorsun?', en: 'What do you want to be?' }
        ],
        tips: [
          'Kız "... olmak istiyorum" derken meslek dişil olur: {{أُرِيدُ أَنْ أَكُونَ طَبِيبَةً}}.',
          'Türkçedeki <b>talim</b> ve <b>muallim</b> kelimeleri {{يُعَلِّمُ}} "öğretir" ile aynı kökten: {{عِلْم}} bilgi.'
        ],
        narr: "Son bölümde kim ne yapar, onu söyleyelim. Fiille anlatırız: {{الْمُعَلِّمُ يُعَلِّمُ الطُّلَّابَ}}, öğretmen öğrencilere öğretir. {{السَّائِقُ يَقُودُ الْحَافِلَةَ}}, şoför otobüsü sürer. {{الطَّبَّاخُ يَطْبُخُ الطَّعَامَ}}, aşçı yemeği pişirir.\n\nYu'allimu, yani öğretir, muallim ile aynı kökten. Türkçedeki talim kelimesi de öyle.\n\nŞimdi hayallerinizi anlatalım. Kalıp şu: {{أُرِيدُ أَنْ أَكُونَ}}, urîdu en ekûne, olmak istiyorum. Ardından meslek gelir ve üstünlü olur: {{أُرِيدُ أَنْ أَكُونَ طَبِيبًا}}, doktor olmak istiyorum. Tabîben, sonunda en sesi var. Bir kız şöyle der: {{أُرِيدُ أَنْ أَكُونَ طَبِيبَةً}}.\n\nArkadaşınıza sorun: {{مَاذَا تُرِيدُ أَنْ تَكُونَ؟}}, ne olmak istiyorsun?"
      }
    ],
    keys: [
      'Kadın için {{ة}}: {{طَبِيبٌ}} → {{طَبِيبَةٌ}}, {{مُعَلِّمٌ}} → {{مُعَلِّمَةٌ}}.',
      'Usta kalıbı {{فَعَّال}}: {{خَبَّازٌ}} fırıncı, {{نَجَّارٌ}} marangoz, {{خَيَّاطٌ}} terzi.',
      'Soru: {{مَا عَمَلُكَ؟}} ya da {{مَاذَا تَعْمَلُ؟}} Cevap: {{أَنَا مُهَنْدِسٌ}}, {{أَعْمَلُ فِي مَكْتَبٍ}}.',
      'Hayal: {{أُرِيدُ أَنْ أَكُونَ طَبِيبًا}} (meslek üstünlü).'
    ],
    mistakes: [
      { bad: 'أُمِّي مُعَلِّمٌ', good: 'أُمِّي مُعَلِّمَةٌ', why: 'Kadından söz ederken meslek adı da dişil olur.' },
      { bad: 'أَنَا الطَّبِيبُ', good: 'أَنَا طَبِيبٌ', why: '"Ben doktorum." derken meslek belirsizdir (tenvinli). {{أَنَا الطَّبِيبُ}} "Doktor benim." demektir.' },
      { bad: 'أُرِيدُ أَنْ أَكُونَ طَبِيبٌ', good: 'أُرِيدُ أَنْ أَكُونَ طَبِيبًا', why: '{{أَكُونَ}} kelimesinden sonra meslek üstünlü olur.' }
    ],
    words: [
      { ar: 'مِهْنَة', tl: 'mihne', tr: 'meslek', en: 'profession' },
      { ar: 'عَمَل', tl: '‘amel', tr: 'iş', en: 'work, job' },
      { ar: 'طَبِيب', tl: 'tabîb', tr: 'doktor', en: 'doctor' },
      { ar: 'مُهَنْدِس', tl: 'muhendis', tr: 'mühendis', en: 'engineer' },
      { ar: 'مُمَرِّض', tl: 'mumerrid', tr: 'hemşire', en: 'nurse' },
      { ar: 'شُرْطِيّ', tl: 'şurtiyy', tr: 'polis', en: 'police officer' },
      { ar: 'سَائِق', tl: "sâ'ik", tr: 'şoför', en: 'driver' },
      { ar: 'مُوَظَّف', tl: 'muvazzaf', tr: 'memur, çalışan', en: 'employee' },
      { ar: 'خَبَّاز', tl: 'habbâz', tr: 'fırıncı', en: 'baker' },
      { ar: 'طَبَّاخ', tl: 'tabbâh', tr: 'aşçı', en: 'cook' },
      { ar: 'نَجَّار', tl: 'neccâr', tr: 'marangoz', en: 'carpenter' },
      { ar: 'خَيَّاط', tl: 'hayyât', tr: 'terzi', en: 'tailor' },
      { ar: 'حَلَّاق', tl: 'hallâk', tr: 'berber', en: 'barber' },
      { ar: 'طَيَّار', tl: 'tayyâr', tr: 'pilot', en: 'pilot' },
      { ar: 'فَلَّاح', tl: 'fellâh', tr: 'çiftçi', en: 'farmer' },
      { ar: 'مَصْنَع', tl: 'masna‘', tr: 'fabrika', en: 'factory' }
    ],
    summaryNarr: "Meslekler ve İş dersini bitirdiniz, tebrikler! Kısa bir tekrar yapalım.\n\nDoktor {{طَبِيبٌ}}, öğretmen {{مُعَلِّمٌ}}, mühendis {{مُهَنْدِسٌ}}; kadınlar için sona yuvarlak te gelir: {{طَبِيبَةٌ}}. Usta kalıbında orta harf şeddelidir: fırıncı {{خَبَّازٌ}}, marangoz {{نَجَّارٌ}}, terzi {{خَيَّاطٌ}}.\n\nMeslek sormak için mâ ameluke ya da mâzâ ta'melu. Cevap: {{أَنَا مُهَنْدِسٌ}}, ya da {{أَعْمَلُ فِي مَكْتَبٍ}}. Hayaliniz için urîdu en ekûne ve üstünlü meslek: {{أُرِيدُ أَنْ أَكُونَ طَبِيبًا}}.\n\nEtkinliklerde önce kartlarla meslekleri tekrar edin, sonra 'Cümleyi tamamla' alıştırmasında kadın ve erkek meslek adlarına dikkat edin.",
    acts: [
      { type: 'flash', title: 'Meslek kartları', desc: 'Meslekleri ve iş yerlerini kartlarla öğren.', glyph: 'مِهْنَة', items: null },
      {
        type: 'match', title: 'Meslek ve anlamı', desc: 'Arapça meslek adını anlamıyla eşleştir.', glyph: 'عَمَل',
        items: [['طَبِيبٌ', 'doktor'], ['مُهَنْدِسٌ', 'mühendis'], ['خَبَّازٌ', 'fırıncı'], ['نَجَّارٌ', 'marangoz'], ['طَيَّارٌ', 'pilot'], ['سَائِقٌ', 'şoför']]
      },
      {
        type: 'mc', title: 'Kim ne iş yapar?', desc: 'Meslek ve iş cümlelerini anla.', glyph: 'مَنْ',
        items: [
          { q: '{{مُمَرِّضَةٌ}} ne demektir?', options: ['hemşire', 'kadın doktor', 'öğretmen', 'memur'], a: 'hemşire' },
          { q: '"İşin ne?" hangisidir?', options: ['مَا عَمَلُكَ؟', 'أَيْنَ عَمَلُكَ؟', 'كَمْ عَمَلُكَ؟', 'مَنْ عَمَلُكَ؟'], a: 'مَا عَمَلُكَ؟' },
          { q: 'Ekmeği kim yapar?', options: ['الْخَبَّازُ', 'النَّجَّارُ', 'الْحَلَّاقُ', 'الطَّيَّارُ'], a: 'الْخَبَّازُ', why: '{{خُبْز}} ekmek: ekmek yapan {{خَبَّاز}}.' },
          { q: '"Annem öğretmen." hangisidir?', options: ['أُمِّي مُعَلِّمَةٌ', 'أُمِّي مُعَلِّمٌ', 'أُمِّي الْمُعَلِّمَةُ', 'مُعَلِّمَةٌ أُمِّي'], a: 'أُمِّي مُعَلِّمَةٌ', why: 'Kadından söz ediliyor: {{مُعَلِّمَةٌ}}.' },
          { q: '{{مَصْنَعٌ}} ne demektir?', options: ['fabrika', 'ofis', 'mutfak', 'çarşı'], a: 'fabrika' },
          { q: '"Doktor olmak istiyorum." hangisidir?', options: ['أُرِيدُ أَنْ أَكُونَ طَبِيبًا', 'أُرِيدُ أَنْ أَكُونَ طَبِيبٌ', 'أَنَا طَبِيبٌ', 'أُرِيدُ طَبِيبًا'], a: 'أُرِيدُ أَنْ أَكُونَ طَبِيبًا', why: '{{أَكُونَ}} kelimesinden sonra meslek üstünlü olur.' }
        ]
      },
      {
        type: 'fill', title: 'Cümleyi tamamla', desc: 'Kadın ve erkek meslek adlarına ve cümledeki yerine dikkat ederek seç.', glyph: '___',
        items: [
          { s: 'أُمِّي ___', tr: 'Annem doktor.', hint: 'Annem doktor.', options: ['طَبِيبَةٌ', 'طَبِيبٌ', 'الطَّبِيبَةُ'], a: 'طَبِيبَةٌ', why: 'Kadından söz ediliyor ve meslek belirsiz: {{طَبِيبَةٌ}}.' },
          { s: '___ تَعْمَلُ؟', tr: 'Ne iş yapıyorsun?', hint: 'Ne iş yapıyorsun?', options: ['مَاذَا', 'مَا', 'مَنْ'], a: 'مَاذَا', why: 'Fiille sorulan "ne?" {{مَاذَا}}.' },
          { s: 'أَعْمَلُ فِي ___', tr: 'Bir ofiste çalışıyorum.', hint: 'Bir ofiste çalışıyorum.', options: ['مَكْتَبٍ', 'مَكْتَبٌ', 'مَكْتَبًا'], a: 'مَكْتَبٍ', why: '{{فِي}} kelimesinden sonra isim esreli olur.' },
          { s: 'الْخَبَّازُ يَخْبِزُ ___', tr: 'Fırıncı ekmek pişirir.', hint: 'Fırıncı ekmek pişirir.', options: ['الْخُبْزَ', 'الْخُبْزُ', 'الْخُبْزِ'], a: 'الْخُبْزَ', why: 'Nesne üstünlü olur.' },
          { s: 'أُرِيدُ أَنْ أَكُونَ ___', tr: 'Mühendis olmak istiyorum.', hint: 'Mühendis olmak istiyorum.', options: ['مُهَنْدِسًا', 'مُهَنْدِسٌ', 'مُهَنْدِسٍ'], a: 'مُهَنْدِسًا' }
        ]
      },
      LISTEN,
      SPEAK,
      ENDLESS,
      {
        type: 'test', title: 'Meslekler testi', desc: 'Karma değerlendirme.', glyph: '؟',
        items: [
          { q: '"Terzi" hangisidir?', options: ['خَيَّاطٌ', 'خَبَّازٌ', 'حَلَّاقٌ', 'فَلَّاحٌ'], a: 'خَيَّاطٌ' },
          { t: 'tf', s: 'طَبِيبَةٌ "kadın doktor" demektir.', a: true },
          { t: 'tf', s: 'أَنَا الطَّبِيبُ "Ben doktorum." demenin en doğal yoludur.', a: false, why: '"Ben doktorum." {{أَنَا طَبِيبٌ}}; {{أَنَا الطَّبِيبُ}} "Doktor benim." demektir.' },
          { t: 'order', w: ['أَعْمَلُ', 'فِي', 'مَصْنَعٍ'], tr: 'Bir fabrikada çalışıyorum.' },
          { t: 'order', w: ['أُرِيدُ', 'أَنْ', 'أَكُونَ', 'طَيَّارًا'], tr: 'Pilot olmak istiyorum.' },
          { q: '{{السَّائِقُ يَقُودُ الْحَافِلَةَ}} ne demektir?', options: ['Şoför otobüsü sürer.', 'Şoför otobüsü bekler.', 'Pilot uçağı uçurur.', 'Şoför otobüste oturur.'], a: 'Şoför otobüsü sürer.' },
          { t: 'fill', s: 'هِيَ ___ فِي الْمُسْتَشْفَى', tr: 'O (kadın) hastanede hemşire.', hint: 'O hastanede hemşire.', options: ['مُمَرِّضَةٌ', 'مُمَرِّضٌ', 'مُمَرِّضًا'], a: 'مُمَرِّضَةٌ' },
          { q: 'Türkçedeki "bakkal" kelimesi hangi kalıptadır?', options: ['فَعَّال', 'مَفْعَل', 'مِفْعَال', 'فَاعِل'], a: 'فَعَّال', why: '{{بَقَّال}}: ortası şeddeli, sonra uzun â.' }
        ]
      }
    ]
  }
];
