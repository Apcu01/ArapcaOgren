/* Kelime bul için yerleşik sözlük. Bu listede bulunan kelimeler yapay zekâya sorulmadan cevaplanır.
   Satır biçimi:  Arapça ; okunuş ; Türkçe anlam ; İngilizce ; tür ; ekler
   tür: i isim, f fiil, s sıfat, h harf (bağlaç, harf-i cer), z zamir, zf zarf, k kalıp ifade
   ekler (isteğe bağlı, | ile ayrılır):  mu=يَكْتُبُ/yektubu (fiilin şimdiki/geniş zamanı)  v=okunuş1,okunuş2 (ek okunuşlar)  n=not
   Hareke hataları ve farklı yazımlar (sahifetun = sehifatün, ketebe = katabe) arama sırasında otomatik tanınır. */

export const LEXICON = `
# Defterden: teknoloji ve iletişim
تِلْفَاز ; tilfâz ; televizyon ; television ; i ; v=telfaz,tilifiziyon
رِسَالَة ; risâle ; mektup, mesaj ; letter, message ; i
صَحِيفَة ; sahîfe ; gazete ; newspaper ; i
يَرِنُّ ; yerinnu ; çalıyor (telefon, zil) ; it rings ; f ; n=Kökü: رَنَّ (renne) çaldı, çınladı.
مَجَلَّة ; mecelle ; dergi ; magazine ; i
حَاسُوب مَحْمُول ; hâsûb mahmûl ; dizüstü bilgisayar, laptop ; laptop ; i
حَاسُوب لَوْحِيّ ; hâsûb levhî ; tablet ; tablet ; i ; v=el-hâsûbu'l-levhî
بَرِيد إِلِكْتُرُونِيّ ; berîd iliktrûnî ; e-posta ; e-mail ; i ; v=el-berîdu'l-iliktrûnî,berid elektroni
سَاعَة ذَكِيَّة ; sâ‘a zekiyye ; akıllı saat ; smartwatch ; i
مُبَرْمِج ; mubermic ; programcı ; programmer ; i ; v=mubermic hâsûb
مُقَاوِل ; mukâvil ; müteahhit ; contractor ; i
رَبَّة بَيْت ; rabbetu beyt ; ev hanımı ; housewife ; i ; v=rabbet beyt
هَاتِف ; hâtif ; telefon ; telephone ; i
هَاتِف مَحْمُول ; hâtif mahmûl ; cep telefonu ; mobile phone ; i
رَقْم ; rakm ; numara, sayı, rakam ; number ; i
أَتَّصِلُ ; ettasılu ; arıyorum (telefonla), iletişime geçiyorum ; I call ; f ; n=Mazisi: اِتَّصَلَ (ittasale) aradı.
أَسْتَخْدِمُ ; estahdimu ; kullanıyorum ; I use ; f ; n=Mazisi: اِسْتَخْدَمَ (istahdeme) kullandı.
حَاسُوب ; hâsûb ; bilgisayar ; computer ; i
شَاشَة ; şâşe ; ekran ; screen ; i
ذَاكِرَة ; zâkira ; hafıza, bellek ; memory ; i
شَاحِن ; şâhin ; şarj aleti ; charger ; i
سَرِيع ; serî‘ ; hızlı ; fast ; s
بَطِيء ; batî' ; yavaş ; slow ; s
سَمَّاعَة ; semmâ‘a ; kulaklık ; headphones ; i
تُرْسِلُ ; tursilu ; gönderiyorsun ; you send ; f ; n=Mazisi: أَرْسَلَ (ersele) gönderdi.
عَبْرَ ; ‘abra ; aracılığıyla, üzerinden ; via, through ; h
إِنْتَرْنِت ; internet ; internet ; internet ; i
تَطْبِيق ; tatbîk ; uygulama ; application ; i
كَلِمَة السِّرّ ; kelimetu's-sırr ; şifre, parola ; password ; i

# Defterden: meslekler
عُمَّال ; ‘ummâl ; işçiler ; workers ; i ; n=Tekili: عَامِل (‘âmil) işçi.
بَنَّاء ; bennâ' ; inşaatçı, duvarcı, mimar ; builder ; i
حَدَّاد ; haddâd ; demirci ; blacksmith ; i
نَجَّار ; neccâr ; marangoz ; carpenter ; i
كَهْرَبَائِيّ ; kahrabâî ; elektrikçi ; electrician ; i
سَبَّاك ; sebbâk ; su tesisatçısı ; plumber ; i
مُوَظَّف ; muvazzaf ; memur, çalışan ; employee ; i
مُمَرِّضَة ; mumarrida ; hemşire (kadın) ; nurse (female) ; i
مُمَرِّض ; mumarrid ; hemşire (erkek) ; nurse (male) ; i
فَلَّاح ; fellâh ; çiftçi ; farmer ; i
فَلَّاحُون ; fellâhûn ; çiftçiler ; farmers ; i
خَيَّاطَة ; hayyâta ; terzi (kadın) ; seamstress ; i
خَيَّاط ; hayyât ; terzi ; tailor ; i
بَائِع ; bâi‘ ; satıcı ; seller ; i
مُتَقَاعِد ; mutekâ‘id ; emekli ; retired ; s
شُرْطِيّ ; şurtî ; polis ; policeman ; i
خَادِم ; hâdim ; hizmetçi ; servant ; i
طَبِيب ; tabîb ; doktor ; doctor ; i
طَبَّاخ ; tabbâh ; aşçı ; cook ; i

# Meslekler
مُعَلِّم ; mu‘allim ; öğretmen ; teacher ; i
مُدَرِّس ; muderris ; öğretmen ; teacher ; i ; v=müderris
أُسْتَاذ ; ustâz ; hoca, profesör ; professor ; i
مُهَنْدِس ; muhendis ; mühendis ; engineer ; i
صَيْدَلِيّ ; saydelî ; eczacı ; pharmacist ; i
مُحَامٍ ; muhâmî ; avukat ; lawyer ; i ; v=muhami
قَاضٍ ; kâdî ; hâkim, kadı ; judge ; i ; v=kadi
جُنْدِيّ ; cundî ; asker ; soldier ; i
طَيَّار ; tayyâr ; pilot ; pilot ; i
سَائِق ; sâik ; şoför, sürücü ; driver ; i
خَبَّاز ; habbâz ; fırıncı ; baker ; i
جَزَّار ; cezzâr ; kasap ; butcher ; i
حَلَّاق ; hallâk ; berber ; barber ; i
تَاجِر ; tâcir ; tüccar ; merchant ; i
مُدِير ; mudîr ; müdür ; manager ; i
سِكْرِتِير ; sikritîr ; sekreter ; secretary ; i
صَحَفِيّ ; sahafî ; gazeteci ; journalist ; i
كَاتِب ; kâtib ; yazar, kâtip ; writer ; i
شَاعِر ; şâ‘ir ; şair ; poet ; i
رَسَّام ; ressâm ; ressam ; painter ; i
مُصَوِّر ; musavvir ; fotoğrafçı ; photographer ; i
مُحَاسِب ; muhâsib ; muhasebeci ; accountant ; i
عَامِل ; ‘âmil ; işçi ; worker ; i
طَالِب ; tâlib ; öğrenci ; student ; i
إِمَام ; imâm ; imam ; imam ; i
مُؤَذِّن ; muezzin ; müezzin ; muezzin ; i
صَيَّاد ; sayyâd ; avcı, balıkçı ; hunter, fisherman ; i
رَاعٍ ; râ‘î ; çoban ; shepherd ; i
بَوَّاب ; bevvâb ; kapıcı ; doorman ; i
مُتَرْجِم ; mutercim ; çevirmen, tercüman ; translator ; i
مُذِيع ; muzî‘ ; spiker ; announcer ; i
لَاعِب ; lâ‘ib ; oyuncu ; player ; i
مُمَثِّل ; mumessil ; oyuncu (tiyatro, film), temsilci ; actor ; i
عَالِم ; ‘âlim ; âlim, bilim insanı ; scholar, scientist ; i
طَبِيب أَسْنَان ; tabîbu esnân ; diş hekimi ; dentist ; i
بَيْطَرِيّ ; baytarî ; veteriner ; veterinarian ; i
مُوَظَّف بَنْك ; muvazzafu bank ; bankacı ; bank employee ; i
مُرْشِد سِيَاحِيّ ; murşid siyâhî ; turist rehberi ; tour guide ; i

# Defterden: ulaşım ve şehir
أَرْكَبُ ; erkebu ; biniyorum ; I ride ; f ; n=Mazisi: رَكِبَ (rekibe) bindi.
دَرَّاجَة ; derrâce ; bisiklet ; bicycle ; i
حَافِلَة ; hâfile ; otobüs ; bus ; i
مُوَاصَلَات ; muvâsalât ; ulaşım araçları, toplu taşıma ; transportation ; i
شَمَال ; şemâl ; kuzey ; north ; i
جَنُوب ; cenûb ; güney ; south ; i
شَرْق ; şark ; doğu ; east ; i
غَرْب ; garb ; batı ; west ; i
شَارِع ; şâri‘ ; cadde, sokak ; street ; i
زَاوِيَة ; zâviye ; köşe, açı ; corner ; i
أَحْيَانًا ; ahyânen ; bazen ; sometimes ; zf
سَيَّارَة أُجْرَة ; seyyâratu ucra ; taksi ; taxi ; i
مُسْتَشْفَى ; musteşfâ ; hastane ; hospital ; i
مُمْتِع ; mumti‘ ; eğlenceli, zevkli ; enjoyable ; s
حَدِيقَة ; hadîka ; park, bahçe ; park, garden ; i
مُسَاعَدَة ; musâ‘ade ; yardım ; help ; i
مَطَار ; matâr ; havaalanı ; airport ; i
مُرِيح ; murîh ; rahat ; comfortable ; s
جَوَاز سَفَر ; cevâzu sefer ; pasaport ; passport ; i ; v=cevazu's-sefer
لَوْ سَمَحْتَ ; lev semahte ; afedersiniz, rica etsem, lütfen ; excuse me, please ; k ; v=lev semaht
بِكُلِّ سُرُور ; bi-kulli surûr ; memnuniyetle, seve seve ; with pleasure ; k
مَحَطَّة الْقِطَار ; mahattatu'l-kıtâr ; tren istasyonu ; train station ; i
تَفَضَّلْ ; tefaddal ; buyrun, buyur ; please, go ahead ; k
أَعْطِ ; a‘tı ; ver ; give ; f ; n=Mazisi: أَعْطَى (a‘tâ) verdi.
حَسَنًا ; hasenen ; peki, tamam ; okay ; k
حَسَن ; hasen ; güzel, iyi ; good ; s
بَعْض ; ba‘d ; biraz, bazı ; some ; i
يُمْكِنُ ; yumkinu ; mümkün, -ebilir ; it is possible, can ; f
أَمْسِ ; emsi ; dün ; yesterday ; zf
مُسَافِر ; musâfir ; yolcu ; traveler ; i
مُغْلَق ; muğlak ; kapalı ; closed ; s ; v=muglaka
وَصَلَ ; vasale ; vardı, ulaştı ; he arrived ; f ; mu=يَصِلُ/yasılu
مَعْهَد ; ma‘hed ; enstitü, kurs ; institute ; i
قَلِيل ; kalîl ; az ; few, little ; s
جِنْسِيَّة ; cinsiyye ; uyruk, milliyet, vatandaşlık ; nationality ; i
عَاصِمَة ; ‘âsıme ; başkent ; capital ; i
صَفّ ; saff ; sınıf, sıra ; class, row ; i
قَدِيم ; kadîm ; eski ; old ; s
أَكَلْتُ ; ekeltu ; yedim ; I ate ; f
طَعَام ; ta‘âm ; yemek, yiyecek ; food ; i
قِطَار ; kıtâr ; tren ; train ; i
سِفَارَة ; sifâre ; elçilik ; embassy ; i
سَفِينَة ; sefîne ; gemi ; ship ; i
مُتْعَب ; mut‘ab ; yorgun ; tired ; s
تَذْكِرَة ; tezkira ; bilet ; ticket ; i
طَائِرَة ; tâira ; uçak ; airplane ; i
رِحْلَة ; rihle ; yolculuk, gezi ; trip ; i
اُنْظُرْ ; unzur ; bak ; look ; f ; n=Mazisi: نَظَرَ (nazara) baktı.
أَجِبْ ; ecib ; cevap ver ; answer ; f ; n=Mazisi: أَجَابَ (ecâbe) cevap verdi.
فَرْق ; fark ; fark ; difference ; i
أَرَى ; erâ ; görüyorum ; I see ; f ; n=Mazisi: رَأَى (raâ) gördü.
جَدِيد ; cedîd ; yeni ; new ; s ; v=cedide
رَجُل ; racul ; adam, erkek ; man ; i
اِمْرَأَة ; imraa ; kadın ; woman ; i ; v=imrae
حَقِيبَة ; hakîbe ; çanta ; bag ; i
حَقِيبَتِي ; hakîbetî ; çantam ; my bag ; i
فَقَط ; fakat ; sadece, yalnızca ; only ; zf
بَلَد ; beled ; ülke, memleket ; country ; i
اِشْتَرَيْتُ ; iştereytu ; satın aldım ; I bought ; f ; n=Mazisi: اِشْتَرَى (iştera) satın aldı.

# Selamlaşma ve kalıp ifadeler
السَّلَامُ عَلَيْكُمْ ; es-selâmu aleykum ; selamünaleyküm ; peace be upon you ; k ; v=selamun aleykum
وَعَلَيْكُمُ السَّلَامُ ; ve aleykumu's-selâm ; aleykümselam ; and upon you be peace ; k
مَرْحَبًا ; merhaben ; merhaba ; hello ; k
أَهْلًا وَسَهْلًا ; ehlen ve sehlen ; hoş geldin, hoş geldiniz ; welcome ; k
أَهْلًا ; ehlen ; merhaba, hoş geldin ; hi ; k
صَبَاحُ الْخَيْرِ ; sabâhu'l-hayr ; günaydın ; good morning ; k
صَبَاحُ النُّورِ ; sabâhu'n-nûr ; günaydın (cevap) ; good morning (reply) ; k
مَسَاءُ الْخَيْرِ ; mesâu'l-hayr ; iyi akşamlar ; good evening ; k
مَسَاءُ النُّورِ ; mesâu'n-nûr ; iyi akşamlar (cevap) ; good evening (reply) ; k
تُصْبِحُ عَلَى خَيْرٍ ; tusbihu ‘alâ hayr ; iyi geceler ; good night ; k
كَيْفَ حَالُكَ ; keyfe hâluke ; nasılsın ; how are you ; k
بِخَيْرٍ ; bi-hayr ; iyiyim ; fine ; k
الْحَمْدُ لِلّٰهِ ; el-hamdu lillâh ; elhamdülillah, Allah'a şükür ; praise be to God ; k
شُكْرًا ; şukran ; teşekkürler, sağ ol ; thank you ; k
شُكْرًا جَزِيلًا ; şukran cezîlen ; çok teşekkürler ; thank you very much ; k
عَفْوًا ; ‘afven ; rica ederim, bir şey değil, affedersiniz ; you're welcome, excuse me ; k ; v=afvan
مِنْ فَضْلِكَ ; min fadlike ; lütfen ; please ; k
آسِف ; âsif ; üzgünüm, özür dilerim ; sorry ; k
أَنَا آسِفٌ ; ene âsif ; özür dilerim ; I am sorry ; k
لَا بَأْسَ ; lâ be's ; sorun değil, zararı yok ; no problem ; k
مَعَ السَّلَامَةِ ; me‘a's-selâme ; güle güle, hoşça kal ; goodbye ; k
إِلَى اللِّقَاءِ ; ile'l-likâ ; görüşmek üzere ; see you ; k
فِي أَمَانِ اللّٰهِ ; fî emâni'llâh ; Allah'a emanet ol ; in God's care ; k
إِنْ شَاءَ اللّٰهُ ; in şâallâh ; inşallah ; God willing ; k
مَا شَاءَ اللّٰهُ ; mâşâallâh ; maşallah ; as God willed ; k
بِسْمِ اللّٰهِ ; bismillâh ; bismillah ; in the name of God ; k
سُبْحَانَ اللّٰهِ ; subhânallâh ; sübhanallah ; glory be to God ; k
جَزَاكَ اللّٰهُ خَيْرًا ; cezâkallâhu hayran ; Allah razı olsun ; may God reward you ; k
بَارَكَ اللّٰهُ فِيكَ ; bârekallâhu fîk ; Allah seni mübarek kılsın, sağ ol ; God bless you ; k
تَشَرَّفْنَا ; teşerrefnâ ; memnun oldum, şeref duydum ; nice to meet you ; k
فُرْصَة سَعِيدَة ; fursa se‘îde ; tanıştığıma memnun oldum ; nice to meet you ; k
مَبْرُوك ; mebrûk ; tebrikler, hayırlı olsun ; congratulations ; k
عِيد مُبَارَك ; ‘îd mubârek ; bayramınız mübarek olsun ; blessed holiday ; k
رَمَضَان كَرِيم ; ramadân kerîm ; hayırlı ramazanlar ; generous Ramadan ; k
بِالتَّوْفِيقِ ; bi't-tevfîk ; başarılar, kolay gelsin ; good luck ; k
نَعَمْ ; na‘am ; evet ; yes ; h
لَا ; lâ ; hayır, değil ; no ; h
طَيِّب ; tayyib ; iyi, peki, tamam ; good, okay ; s
مُمْكِن ; mumkin ; mümkün ; possible ; s
مَا اسْمُكَ ; me'smuke ; adın ne ; what is your name ; k
اسْمِي ; ismî ; adım, benim adım ; my name ; k
مِنْ أَيْنَ أَنْتَ ; min eyne ente ; nerelisin ; where are you from ; k
تَعَالَ ; te‘âle ; gel ; come ; f
هَيَّا ; heyyâ ; haydi ; come on ; k
يَا ; yâ ; ey, hey (seslenme) ; O (vocative) ; h

# Bağlaçlar
وَ ; ve ; ve ; and ; h
فَ ; fe ; ve hemen, böylece, o hâlde ; then, so ; h
ثُمَّ ; summe ; sonra ; then ; h
أَوْ ; ev ; veya, ya da ; or ; h
أَمْ ; em ; yoksa (soruda) ; or (in questions) ; h
لٰكِنْ ; lâkin ; ama, fakat ; but ; h
لٰكِنَّ ; lâkinne ; ama, fakat ; but ; h
بَلْ ; bel ; bilakis, aksine ; rather ; h
حَتَّى ; hattâ ; -e kadar, hatta ; until, even ; h
لِأَنَّ ; li-enne ; çünkü ; because ; h
إِذَا ; izâ ; eğer, -dığında ; if, when ; h
إِنْ ; in ; eğer ; if ; h
لَوْ ; lev ; eğer, -seydi ; if (unreal) ; h
عِنْدَمَا ; ‘indemâ ; -dığı zaman, -ınca ; when ; h
لِذٰلِكَ ; li-zâlike ; bu yüzden ; therefore ; h
كَيْ ; key ; -mek için ; so that ; h
أَنْ ; en ; -mek, -mesi ; to, that ; h
أَنَّ ; enne ; -dığı, ki ; that ; h
إِنَّ ; inne ; şüphesiz, muhakkak ; indeed ; h
إِمَّا ; immâ ; ya ... ya ; either ; h
أَيْضًا ; eyden ; de, da, ayrıca ; also ; zf
بَيْنَمَا ; beynemâ ; iken, -ırken ; while ; h
قَبْلَ أَنْ ; kable en ; -meden önce ; before ; h
بَعْدَ أَنْ ; ba‘de en ; -dikten sonra ; after ; h
لَمَّا ; lemmâ ; -ınca, -dığında ; when ; h
مَعَ أَنَّ ; me‘a enne ; -e rağmen ; although ; h
إِلَّا ; illâ ; -den başka, hariç ; except ; h
غَيْر ; ğayr ; başka, -sız, değil ; other, non- ; i

# Harf-i cerler ve yer bildiren kelimeler
فِي ; fî ; içinde, -de ; in ; h
مِنْ ; min ; -den ; from ; h
إِلَى ; ilâ ; -e, -e doğru ; to ; h
عَلَى ; ‘alâ ; üzerinde, üstünde ; on ; h
عَنْ ; ‘an ; hakkında, -den ; about, from ; h
بِ ; bi ; ile, -le ; with, by ; h
لِ ; li ; için, -e ait ; for ; h
كَ ; ke ; gibi ; like ; h
مَعَ ; me‘a ; ile, beraber ; with ; h
عِنْدَ ; ‘inde ; yanında, -de ; at, with ; h
لَدَى ; ledâ ; yanında, -de ; at, with ; h
مُنْذُ ; munzu ; -den beri ; since ; h
تَحْتَ ; tahte ; altında ; under ; zf
فَوْقَ ; fevka ; üstünde ; above ; zf
أَمَامَ ; emâme ; önünde ; in front of ; zf
خَلْفَ ; halfe ; arkasında ; behind ; zf
وَرَاءَ ; verâe ; arkasında, ötesinde ; behind ; zf
بَيْنَ ; beyne ; arasında ; between ; zf
حَوْلَ ; havle ; etrafında ; around ; zf
دَاخِلَ ; dâhile ; içinde ; inside ; zf
خَارِجَ ; hârice ; dışında ; outside ; zf
قُرْبَ ; kurbe ; yakınında ; near ; zf
بِجَانِبِ ; bi-cânibi ; yanında ; next to ; zf
قَبْلَ ; kable ; önce ; before ; zf
بَعْدَ ; ba‘de ; sonra ; after ; zf
دُونَ ; dûne ; -sız, olmadan ; without ; zf
بِدُونِ ; bi-dûni ; -sız, olmadan ; without ; zf
ضِدَّ ; dıdde ; karşı ; against ; zf
نَحْوَ ; nahve ; -e doğru ; towards ; zf
خِلَالَ ; hilâle ; esnasında, boyunca ; during ; zf
مِثْلَ ; misle ; gibi ; like ; zf
هُنَا ; hunâ ; burada ; here ; zf
هُنَاكَ ; hunâke ; orada ; there ; zf

# Zamirler ve soru kelimeleri
أَنَا ; ene ; ben ; I ; z
أَنْتَ ; ente ; sen (erkek) ; you (m.) ; z
أَنْتِ ; enti ; sen (kadın) ; you (f.) ; z
هُوَ ; huve ; o (erkek) ; he ; z
هِيَ ; hiye ; o (kadın) ; she ; z
نَحْنُ ; nahnu ; biz ; we ; z
أَنْتُمْ ; entum ; siz ; you (pl.) ; z
هُمْ ; hum ; onlar ; they ; z
هٰذَا ; hâzâ ; bu (erkek) ; this (m.) ; z
هٰذِهِ ; hâzihî ; bu (dişil) ; this (f.) ; z
ذٰلِكَ ; zâlike ; şu, o (erkek) ; that (m.) ; z
تِلْكَ ; tilke ; şu, o (dişil) ; that (f.) ; z
هٰؤُلَاءِ ; hâulâi ; bunlar ; these ; z
مَا ; mâ ; ne ; what ; h
مَاذَا ; mâzâ ; ne (fiille) ; what ; h
مَنْ ; men ; kim ; who ; h
أَيْنَ ; eyne ; nerede ; where ; h
مَتَى ; metâ ; ne zaman ; when ; h
كَيْفَ ; keyfe ; nasıl ; how ; h
كَمْ ; kem ; kaç, ne kadar ; how many ; h
لِمَاذَا ; limâzâ ; neden ; why ; h
هَلْ ; hel ; mi (soru) ; question particle ; h
أَيّ ; eyy ; hangi ; which ; h
بِكَمْ ; bikem ; kaça, kaç para ; how much ; h

# Ev ve ev eşyaları
بَيْت ; beyt ; ev ; house ; i
مَنْزِل ; menzil ; ev, konut ; home ; i
شَقَّة ; şakka ; daire (apartman) ; apartment ; i
غُرْفَة ; ğurfe ; oda ; room ; i
غُرْفَة النَّوْمِ ; ğurfetu'n-nevm ; yatak odası ; bedroom ; i
مَطْبَخ ; matbah ; mutfak ; kitchen ; i
حَمَّام ; hammâm ; banyo, tuvalet ; bathroom ; i
صَالَة ; sâle ; salon ; living room, hall ; i
بَاب ; bâb ; kapı ; door ; i
نَافِذَة ; nâfize ; pencere ; window ; i
شُبَّاك ; şubbâk ; pencere ; window ; i
جِدَار ; cidâr ; duvar ; wall ; i
سَقْف ; sakf ; tavan ; ceiling ; i
أَرْض ; ard ; yer, zemin, toprak ; floor, ground ; i
دَرَج ; derec ; merdiven ; stairs ; i
سَرِير ; serîr ; yatak, karyola ; bed ; i
وِسَادَة ; visâde ; yastık ; pillow ; i
بَطَّانِيَّة ; battâniyye ; battaniye ; blanket ; i
خِزَانَة ; hizâne ; dolap ; cupboard ; i
دُولَاب ; dûlâb ; elbise dolabı ; wardrobe ; i
كُرْسِيّ ; kursî ; sandalye ; chair ; i
طَاوِلَة ; tâvile ; masa ; table ; i
مَائِدَة ; mâide ; sofra, yemek masası ; dining table ; i
مَكْتَب ; mekteb ; masa (çalışma), büro, ofis ; desk, office ; i
أَرِيكَة ; erîke ; kanepe ; sofa ; i
سَجَّادَة ; seccâde ; halı, seccade ; carpet, prayer rug ; i
مِرْآة ; mir'ât ; ayna ; mirror ; i
سِتَارَة ; sitâre ; perde ; curtain ; i
مِصْبَاح ; misbâh ; lamba ; lamp ; i
ثَلَّاجَة ; sellâce ; buzdolabı ; refrigerator ; i
فُرْن ; furn ; fırın ; oven ; i
غَسَّالَة ; ğassâle ; çamaşır makinesi ; washing machine ; i
مِكْنَسَة ; miknese ; süpürge ; broom, vacuum cleaner ; i
صَحْن ; sahn ; tabak ; plate ; i
كُوب ; kûb ; bardak ; cup ; i
فِنْجَان ; fincân ; fincan ; cup ; i
مِلْعَقَة ; mil‘aka ; kaşık ; spoon ; i
شَوْكَة ; şevke ; çatal ; fork ; i
سِكِّين ; sikkîn ; bıçak ; knife ; i
قِدْر ; kıdr ; tencere ; pot ; i
إِبْرِيق ; ibrîk ; ibrik, demlik ; jug, teapot ; i
مِفْتَاح ; miftâh ; anahtar ; key ; i
مِنْشَفَة ; minşefe ; havlu ; towel ; i
صَابُون ; sâbûn ; sabun ; soap ; i
مُكَيِّف ; mukeyyif ; klima ; air conditioner ; i
مِرْوَحَة ; mirvaha ; vantilatör ; fan ; i
سَاعَة ; sâ‘a ; saat ; clock, hour ; i
رَفّ ; raff ; raf ; shelf ; i
سَطْح ; sath ; dam, çatı, yüzey ; roof ; i
مِظَلَّة ; mizalla ; şemsiye ; umbrella ; i
كِتَاب ; kitâb ; kitap ; book ; i
قَلَم ; kalem ; kalem ; pen ; i
دَفْتَر ; defter ; defter ; notebook ; i
وَرَقَة ; varaka ; kâğıt, yaprak ; paper, leaf ; i

# Yiyecek ve içecek
مَاء ; mâ' ; su ; water ; i
حَلِيب ; halîb ; süt ; milk ; i ; v=el-halîb
شَاي ; şây ; çay ; tea ; i
قَهْوَة ; kahve ; kahve ; coffee ; i
عَصِير ; ‘asîr ; meyve suyu ; juice ; i
خُبْز ; hubz ; ekmek ; bread ; i
أَرُزّ ; eruzz ; pirinç, pilav ; rice ; i
لَحْم ; lahm ; et ; meat ; i
دَجَاج ; decâc ; tavuk ; chicken ; i
سَمَك ; semek ; balık ; fish ; i
بَيْض ; beyd ; yumurta ; eggs ; i
جُبْن ; cubn ; peynir ; cheese ; i
فَاكِهَة ; fâkihe ; meyve ; fruit ; i
خُضَار ; hudâr ; sebze ; vegetables ; i
تُفَّاح ; tuffâh ; elma ; apple ; i
مَوْز ; mevz ; muz ; banana ; i
بُرْتُقَال ; burtukâl ; portakal ; orange ; i
عِنَب ; ‘ineb ; üzüm ; grapes ; i
بَطِّيخ ; battîh ; karpuz ; watermelon ; i
طَمَاطِم ; tamâtım ; domates ; tomato ; i
بَصَل ; basal ; soğan ; onion ; i
بَطَاطِس ; batâtıs ; patates ; potatoes ; i
سُكَّر ; sukker ; şeker ; sugar ; i
مِلْح ; milh ; tuz ; salt ; i
زَيْت ; zeyt ; yağ ; oil ; i
زَيْتُون ; zeytûn ; zeytin ; olives ; i
عَسَل ; ‘asel ; bal ; honey ; i
حَلْوَى ; halvâ ; tatlı ; sweets ; i
فُطُور ; futûr ; kahvaltı ; breakfast ; i
غَدَاء ; ğadâ' ; öğle yemeği ; lunch ; i
عَشَاء ; ‘aşâ' ; akşam yemeği ; dinner ; i

# Yerler
مَدْرَسَة ; medrese ; okul ; school ; i
جَامِعَة ; câmi‘a ; üniversite ; university ; i
مَسْجِد ; mescid ; mescit, cami ; mosque ; i
جَامِع ; câmi‘ ; cami ; mosque ; i
سُوق ; sûk ; çarşı, pazar ; market ; i
مَطْعَم ; mat‘am ; lokanta, restoran ; restaurant ; i
مَقْهًى ; makhâ ; kahvehane, kafe ; café ; i
فُنْدُق ; funduk ; otel ; hotel ; i
بَنْك ; bank ; banka ; bank ; i
صَيْدَلِيَّة ; saydeliyye ; eczane ; pharmacy ; i
مَكْتَبَة ; mektebe ; kütüphane, kitapçı ; library, bookstore ; i
مَتْجَر ; metcer ; mağaza, dükkân ; store ; i
دُكَّان ; dukkân ; dükkân ; shop ; i
مَحَطَّة ; mahatta ; istasyon, durak ; station ; i
طَرِيق ; tarîk ; yol ; road, way ; i
مَدِينَة ; medîne ; şehir ; city ; i
قَرْيَة ; karye ; köy ; village ; i
دَوْلَة ; devle ; devlet, ülke ; state, country ; i
وَطَن ; vatan ; vatan ; homeland ; i
بَحْر ; bahr ; deniz ; sea ; i
نَهْر ; nehr ; nehir ; river ; i
جَبَل ; cebel ; dağ ; mountain ; i
مَلْعَب ; mel‘ab ; oyun alanı, stadyum ; playground, stadium ; i
مَتْحَف ; methaf ; müze ; museum ; i
مَصْنَع ; masna‘ ; fabrika ; factory ; i
مَزْرَعَة ; mezra‘a ; çiftlik ; farm ; i
مَكَان ; mekân ; yer, mekân ; place ; i

# Vücut
رَأْس ; re's ; baş, kafa ; head ; i
وَجْه ; vech ; yüz ; face ; i
عَيْن ; ‘ayn ; göz ; eye ; i
أُذُن ; uzun ; kulak ; ear ; i
أَنْف ; enf ; burun ; nose ; i
فَم ; fem ; ağız ; mouth ; i
سِنّ ; sinn ; diş, yaş ; tooth, age ; i
يَد ; yed ; el ; hand ; i
رِجْل ; ricl ; ayak, bacak ; foot, leg ; i
قَلْب ; kalb ; kalp ; heart ; i
شَعْر ; şa‘r ; saç ; hair ; i
بَطْن ; batn ; karın ; belly ; i
ظَهْر ; zahr ; sırt ; back ; i
إِصْبَع ; isba‘ ; parmak ; finger ; i
لِسَان ; lisân ; dil (organ, lisan) ; tongue, language ; i

# İnsanlar ve genel isimler
إِنْسَان ; insân ; insan ; human ; i
نَاس ; nâs ; insanlar ; people ; i
وَلَد ; veled ; çocuk, oğlan ; boy, child ; i
بِنْت ; bint ; kız ; girl ; i
طِفْل ; tıfl ; çocuk, bebek ; child ; i
شَابّ ; şâbb ; genç ; young man ; i
صَدِيق ; sadîk ; arkadaş, dost ; friend ; i
جَار ; câr ; komşu ; neighbor ; i
ضَيْف ; dayf ; misafir ; guest ; i
لُغَة ; luğa ; dil, lisan ; language ; i
كَلِمَة ; kelime ; kelime ; word ; i
سُؤَال ; su'âl ; soru ; question ; i
جَوَاب ; cevâb ; cevap ; answer ; i
مُشْكِلَة ; muşkila ; sorun, problem ; problem ; i
فِكْرَة ; fikra ; fikir ; idea ; i
خَبَر ; haber ; haber ; news ; i
حَيَاة ; hayât ; hayat ; life ; i
عَالَم ; ‘âlem ; dünya, âlem ; world ; i
مَال ; mâl ; para, mal ; money, wealth ; i
فُلُوس ; fulûs ; para ; money ; i
نُقُود ; nukûd ; para ; money ; i
عَمَل ; ‘amel ; iş, çalışma ; work ; i
شُغْل ; şuğl ; iş, meşguliyet ; work ; i
عُنْوَان ; ‘unvân ; adres, başlık ; address, title ; i
اسْم ; ism ; isim, ad ; name ; i
وَقْت ; vakt ; vakit, zaman ; time ; i
يَوْم ; yevm ; gün ; day ; i
لَيْلَة ; leyle ; gece ; night ; i
أُسْبُوع ; usbû‘ ; hafta ; week ; i
شَهْر ; şehr ; ay ; month ; i
سَنَة ; sene ; yıl ; year ; i
دَقِيقَة ; dakîka ; dakika ; minute ; i
صَبَاح ; sabâh ; sabah ; morning ; i
مَسَاء ; mesâ' ; akşam ; evening ; i
الْآنَ ; el-âne ; şimdi ; now ; zf
الْيَوْمَ ; el-yevme ; bugün ; today ; zf
غَدًا ; ğaden ; yarın ; tomorrow ; zf
دَائِمًا ; dâimen ; her zaman ; always ; zf
أَبَدًا ; ebeden ; asla, hiç ; never ; zf
قَرِيبًا ; karîben ; yakında ; soon ; zf
جِدًّا ; ciddan ; çok ; very ; zf
كَثِيرًا ; kesîran ; çok, sık sık ; a lot ; zf
مَعًا ; me‘an ; birlikte ; together ; zf
كُلّ ; kull ; her, bütün ; every, all ; i
شَيْء ; şey' ; şey ; thing ; i
سَيَّارَة ; seyyâra ; araba ; car ; i
نُقْطَة ; nukta ; nokta ; point ; i
بَاص ; bâs ; otobüs ; bus ; i

# Sıfatlar
كَبِير ; kebîr ; büyük ; big ; s
صَغِير ; sağîr ; küçük ; small ; s
طَوِيل ; tavîl ; uzun ; long, tall ; s
قَصِير ; kasîr ; kısa ; short ; s
جَمِيل ; cemîl ; güzel ; beautiful ; s
قَبِيح ; kabîh ; çirkin ; ugly ; s
سَهْل ; sehl ; kolay ; easy ; s
صَعْب ; sa‘b ; zor ; difficult ; s
حَارّ ; hârr ; sıcak ; hot ; s
بَارِد ; bârid ; soğuk ; cold ; s
دَافِئ ; dâfi' ; ılık ; warm ; s
كَثِير ; kesîr ; çok ; many ; s
سَعِيد ; se‘îd ; mutlu ; happy ; s
حَزِين ; hazîn ; üzgün ; sad ; s
غَنِيّ ; ğanî ; zengin ; rich ; s
فَقِير ; fakîr ; fakir ; poor ; s
قَوِيّ ; kavî ; güçlü ; strong ; s
ضَعِيف ; da‘îf ; zayıf ; weak ; s
قَرِيب ; karîb ; yakın ; near ; s
بَعِيد ; ba‘îd ; uzak ; far ; s
نَظِيف ; nazîf ; temiz ; clean ; s
وَسِخ ; vesih ; kirli ; dirty ; s
ثَقِيل ; sekîl ; ağır ; heavy ; s
خَفِيف ; hafîf ; hafif ; light ; s
غَالٍ ; ğâlî ; pahalı ; expensive ; s ; v=gali
رَخِيص ; rahîs ; ucuz ; cheap ; s
مَفْتُوح ; meftûh ; açık ; open ; s
مَشْغُول ; meşğûl ; meşgul ; busy ; s
فَارِغ ; fâriğ ; boş ; empty ; s
مُمْتَلِئ ; mumteli' ; dolu ; full ; s
جَائِع ; câi‘ ; aç ; hungry ; s
عَطْشَان ; ‘atşân ; susamış ; thirsty ; s
شَبْعَان ; şeb‘ân ; tok ; full (not hungry) ; s
مَرِيض ; merîd ; hasta ; sick ; s
نَشِيط ; neşît ; çalışkan, hareketli ; active ; s
كَسْلَان ; keslân ; tembel ; lazy ; s
ذَكِيّ ; zekî ; zeki, akıllı ; smart ; s
مُجْتَهِد ; muctehid ; çalışkan ; hardworking ; s
لَطِيف ; latîf ; nazik, hoş ; kind, nice ; s
مُهِمّ ; muhimm ; önemli ; important ; s
صَحِيح ; sahîh ; doğru ; correct ; s
خَطَأ ; hata' ; hata, yanlış ; mistake, wrong ; i
جَاهِز ; câhiz ; hazır ; ready ; s
مَسْرُور ; mesrûr ; sevinçli, memnun ; glad ; s
غَاضِب ; ğâdib ; kızgın ; angry ; s
هَادِئ ; hâdi' ; sakin ; calm ; s
وَاسِع ; vâsi‘ ; geniş ; wide ; s
ضَيِّق ; dayyik ; dar ; narrow ; s
حُلْو ; hulv ; tatlı ; sweet ; s
مُرّ ; murr ; acı ; bitter ; s
مَالِح ; mâlih ; tuzlu ; salty ; s
لَذِيذ ; lezîz ; lezzetli ; delicious ; s
مَشْهُور ; meşhûr ; meşhur, ünlü ; famous ; s
أَوَّل ; evvel ; ilk, birinci ; first ; s
آخِر ; âhir ; son ; last ; s
صَادِق ; sâdık ; doğru sözlü ; truthful ; s
كَاذِب ; kâzib ; yalancı ; liar ; s
شُجَاع ; şucâ‘ ; cesur ; brave ; s
كَرِيم ; kerîm ; cömert ; generous ; s
بَخِيل ; bahîl ; cimri ; stingy ; s
مُسْتَعِدّ ; musta‘idd ; hazır, istekli ; ready, willing ; s
جَيِّد ; ceyyid ; iyi ; good ; s
سَيِّئ ; seyyi' ; kötü ; bad ; s
عَظِيم ; ‘azîm ; büyük, muhteşem ; great ; s
مُخْتَلِف ; muhtelif ; farklı ; different ; s
مُشَابِه ; muşâbih ; benzer ; similar ; s
وَحِيد ; vahîd ; yalnız, tek ; alone ; s

# Sık kullanılan fiiller (mazi, yani geçmiş zaman: "o yaptı")
كَتَبَ ; ketebe ; yazdı ; he wrote ; f ; mu=يَكْتُبُ/yektubu
قَرَأَ ; karae ; okudu ; he read ; f ; mu=يَقْرَأُ/yakrau
ذَهَبَ ; zehebe ; gitti ; he went ; f ; mu=يَذْهَبُ/yezhebu
جَاءَ ; câe ; geldi ; he came ; f ; mu=يَجِيءُ/yecîu
رَجَعَ ; race‘a ; döndü ; he returned ; f ; mu=يَرْجِعُ/yerci‘u
دَخَلَ ; dehale ; girdi ; he entered ; f ; mu=يَدْخُلُ/yedhulu
خَرَجَ ; harace ; çıktı ; he went out ; f ; mu=يَخْرُجُ/yahrucu
جَلَسَ ; celese ; oturdu ; he sat ; f ; mu=يَجْلِسُ/yeclisu
قَامَ ; kâme ; kalktı, ayağa kalktı ; he stood up ; f ; mu=يَقُومُ/yekûmu
نَامَ ; nâme ; uyudu ; he slept ; f ; mu=يَنَامُ/yenâmu
أَكَلَ ; ekele ; yedi ; he ate ; f ; mu=يَأْكُلُ/ye'kulu
شَرِبَ ; şeribe ; içti ; he drank ; f ; mu=يَشْرَبُ/yeşrabu
فَتَحَ ; fetaha ; açtı ; he opened ; f ; mu=يَفْتَحُ/yeftahu
أَغْلَقَ ; ağlaka ; kapattı ; he closed ; f ; mu=يُغْلِقُ/yuğliku
سَمِعَ ; semi‘a ; duydu ; he heard ; f ; mu=يَسْمَعُ/yesme‘u
رَأَى ; raâ ; gördü ; he saw ; f ; mu=يَرَى/yerâ
نَظَرَ ; nazara ; baktı ; he looked ; f ; mu=يَنْظُرُ/yenzuru
قَالَ ; kâle ; dedi, söyledi ; he said ; f ; mu=يَقُولُ/yekûlu
تَكَلَّمَ ; tekelleme ; konuştu ; he spoke ; f ; mu=يَتَكَلَّمُ/yetekellemu
سَأَلَ ; seele ; sordu ; he asked ; f ; mu=يَسْأَلُ/yes'elu
أَجَابَ ; ecâbe ; cevap verdi ; he answered ; f ; mu=يُجِيبُ/yucîbu
عَرَفَ ; ‘arafe ; bildi, tanıdı ; he knew ; f ; mu=يَعْرِفُ/ya‘rifu
عَلِمَ ; ‘alime ; bildi, öğrendi ; he knew ; f ; mu=يَعْلَمُ/ya‘lemu
فَهِمَ ; fehime ; anladı ; he understood ; f ; mu=يَفْهَمُ/yefhemu
دَرَسَ ; derese ; ders çalıştı, okudu ; he studied ; f ; mu=يَدْرُسُ/yedrusu
تَعَلَّمَ ; te‘alleme ; öğrendi ; he learned ; f ; mu=يَتَعَلَّمُ/yete‘allemu
عَلَّمَ ; ‘alleme ; öğretti ; he taught ; f ; mu=يُعَلِّمُ/yu‘allimu
عَمِلَ ; ‘amile ; çalıştı, yaptı ; he worked ; f ; mu=يَعْمَلُ/ya‘melu
فَعَلَ ; fe‘ale ; yaptı ; he did ; f ; mu=يَفْعَلُ/yef‘alu
لَعِبَ ; le‘ibe ; oynadı ; he played ; f ; mu=يَلْعَبُ/yel‘abu
مَشَى ; meşâ ; yürüdü ; he walked ; f ; mu=يَمْشِي/yemşî
رَكِبَ ; rekibe ; bindi ; he rode ; f ; mu=يَرْكَبُ/yerkebu
سَافَرَ ; sâfera ; yolculuk yaptı ; he traveled ; f ; mu=يُسَافِرُ/yusâfiru
أَخَذَ ; ehaze ; aldı ; he took ; f ; mu=يَأْخُذُ/ye'huzu
أَعْطَى ; a‘tâ ; verdi ; he gave ; f ; mu=يُعْطِي/yu‘tî
اِشْتَرَى ; iştera ; satın aldı ; he bought ; f ; mu=يَشْتَرِي/yeşterî
بَاعَ ; bâ‘a ; sattı ; he sold ; f ; mu=يَبِيعُ/yebî‘u
دَفَعَ ; defe‘a ; ödedi, itti ; he paid, pushed ; f ; mu=يَدْفَعُ/yedfe‘u
أَرَادَ ; erâde ; istedi ; he wanted ; f ; mu=يُرِيدُ/yurîdu
أَحَبَّ ; ehabbe ; sevdi ; he loved ; f ; mu=يُحِبُّ/yuhibbu
كَرِهَ ; kerihe ; nefret etti, sevmedi ; he hated ; f ; mu=يَكْرَهُ/yekrahu
اِسْتَطَاعَ ; istatâ‘a ; -ebildi, gücü yetti ; he was able ; f ; mu=يَسْتَطِيعُ/yestatî‘u
بَدَأَ ; bedee ; başladı ; he began ; f ; mu=يَبْدَأُ/yebdeu
اِنْتَهَى ; intehâ ; bitti, sona erdi ; it ended ; f ; mu=يَنْتَهِي/yentehî
سَكَنَ ; sekene ; oturdu (ikamet etti) ; he lived (resided) ; f ; mu=يَسْكُنُ/yeskunu
عَاشَ ; ‘âşe ; yaşadı ; he lived ; f ; mu=يَعِيشُ/ye‘îşu
مَاتَ ; mâte ; öldü ; he died ; f ; mu=يَمُوتُ/yemûtu
ضَحِكَ ; dahike ; güldü ; he laughed ; f ; mu=يَضْحَكُ/yadheku
بَكَى ; bekâ ; ağladı ; he cried ; f ; mu=يَبْكِي/yebkî
غَسَلَ ; ğasele ; yıkadı ; he washed ; f ; mu=يَغْسِلُ/yağsilu
لَبِسَ ; lebise ; giydi ; he wore ; f ; mu=يَلْبَسُ/yelbesu
طَبَخَ ; tabaha ; yemek pişirdi ; he cooked ; f ; mu=يَطْبُخُ/yatbuhu
سَاعَدَ ; sâ‘ade ; yardım etti ; he helped ; f ; mu=يُسَاعِدُ/yusâ‘idu
اِنْتَظَرَ ; intezara ; bekledi ; he waited ; f ; mu=يَنْتَظِرُ/yentaziru
بَحَثَ ; bahase ; aradı (bir şeyi) ; he searched ; f ; mu=يَبْحَثُ/yebhasu
وَجَدَ ; vecede ; buldu ; he found ; f ; mu=يَجِدُ/yecidu
نَسِيَ ; nesiye ; unuttu ; he forgot ; f ; mu=يَنْسَى/yensâ
تَذَكَّرَ ; tezekkera ; hatırladı ; he remembered ; f ; mu=يَتَذَكَّرُ/yetezekkeru
حَمَلَ ; hamele ; taşıdı ; he carried ; f ; mu=يَحْمِلُ/yahmilu
وَضَعَ ; veda‘a ; koydu ; he put ; f ; mu=يَضَعُ/yeda‘u
أَرْسَلَ ; ersele ; gönderdi ; he sent ; f ; mu=يُرْسِلُ/yursilu
اِتَّصَلَ ; ittasale ; aradı (telefonla), bağlandı ; he called ; f ; mu=يَتَّصِلُ/yettasılu
اِسْتَخْدَمَ ; istahdeme ; kullandı ; he used ; f ; mu=يَسْتَخْدِمُ/yestahdimu
جَرَى ; cerâ ; koştu, aktı ; he ran ; f ; mu=يَجْرِي/yecrî
سَبَحَ ; sebeha ; yüzdü ; he swam ; f ; mu=يَسْبَحُ/yesbehu
صَلَّى ; sallâ ; namaz kıldı ; he prayed ; f ; mu=يُصَلِّي/yusallî
صَامَ ; sâme ; oruç tuttu ; he fasted ; f ; mu=يَصُومُ/yesûmu
شَكَرَ ; şekera ; teşekkür etti ; he thanked ; f ; mu=يَشْكُرُ/yeşkuru
كَانَ ; kâne ; idi, oldu ; he was ; f ; mu=يَكُونُ/yekûnu
صَارَ ; sâra ; oldu, haline geldi ; he became ; f ; mu=يَصِيرُ/yesîru
أَصْبَحَ ; asbaha ; oldu, sabahladı ; he became ; f ; mu=يُصْبِحُ/yusbihu
ظَنَّ ; zanne ; sandı, zannetti ; he thought ; f ; mu=يَظُنُّ/yezunnu
حَاوَلَ ; hâvele ; denedi ; he tried ; f ; mu=يُحَاوِلُ/yuhâvilu
اِسْتَيْقَظَ ; isteykaza ; uyandı ; he woke up ; f ; mu=يَسْتَيْقِظُ/yesteykızu
نَزَلَ ; nezele ; indi ; he got down ; f ; mu=يَنْزِلُ/yenzilu
صَعِدَ ; sa‘ide ; çıktı (yukarı) ; he went up ; f ; mu=يَصْعَدُ/yas‘adu
قَطَعَ ; kata‘a ; kesti ; he cut ; f ; mu=يَقْطَعُ/yakta‘u
رَسَمَ ; reseme ; çizdi, resim yaptı ; he drew ; f ; mu=يَرْسُمُ/yersumu
غَنَّى ; ğannâ ; şarkı söyledi ; he sang ; f ; mu=يُغَنِّي/yuğannî
اِسْتَمَعَ ; istema‘a ; dinledi ; he listened ; f ; mu=يَسْتَمِعُ/yestemi‘u
شَاهَدَ ; şâhede ; izledi, seyretti ; he watched ; f ; mu=يُشَاهِدُ/yuşâhidu
زَارَ ; zâra ; ziyaret etti ; he visited ; f ; mu=يَزُورُ/yezûru
سَكَتَ ; sekete ; sustu ; he was silent ; f ; mu=يَسْكُتُ/yeskutu
فَكَّرَ ; fekkera ; düşündü ; he thought ; f ; mu=يُفَكِّرُ/yufekkiru
أَحْضَرَ ; ahdara ; getirdi ; he brought ; f ; mu=يُحْضِرُ/yuhdiru
بَنَى ; benâ ; inşa etti ; he built ; f ; mu=يَبْنِي/yebnî
سَاقَ ; sâka ; sürdü (araba) ; he drove ; f ; mu=يَسُوقُ/yesûku
حَفِظَ ; hafiza ; ezberledi, korudu ; he memorized ; f ; mu=يَحْفَظُ/yahfazu
تَرَكَ ; tereke ; bıraktı ; he left ; f ; mu=يَتْرُكُ/yetruku
وَقَفَ ; vekafe ; durdu ; he stopped ; f ; mu=يَقِفُ/yekıfu
أَمْكَنَ ; emkene ; mümkün oldu ; it was possible ; f ; mu=يُمْكِنُ/yumkinu
اِحْتَاجَ ; ihtâce ; ihtiyaç duydu ; he needed ; f ; mu=يَحْتَاجُ/yehtâcu

# Hayvanlar
حَيَوَان ; hayevân ; hayvan ; animal ; i
قِطّ ; kıtt ; kedi ; cat ; i
كَلْب ; kelb ; köpek ; dog ; i
حِصَان ; hısân ; at ; horse ; i
بَقَرَة ; bakara ; inek ; cow ; i
خَرُوف ; harûf ; koyun, kuzu ; sheep ; i
مَاعِز ; mâ‘iz ; keçi ; goat ; i
جَمَل ; cemel ; deve ; camel ; i
حِمَار ; himâr ; eşek ; donkey ; i
أَسَد ; esed ; aslan ; lion ; i
نَمِر ; nemir ; kaplan ; tiger ; i
ذِئْب ; zi'b ; kurt ; wolf ; i
ثَعْلَب ; sa‘leb ; tilki ; fox ; i
دُبّ ; dubb ; ayı ; bear ; i
فِيل ; fîl ; fil ; elephant ; i
قِرْد ; kırd ; maymun ; monkey ; i
أَرْنَب ; erneb ; tavşan ; rabbit ; i
فَأْر ; fe'r ; fare ; mouse ; i
طَائِر ; tâir ; kuş ; bird ; i
عُصْفُور ; ‘usfûr ; serçe, küçük kuş ; sparrow ; i
حَمَامَة ; hamâme ; güvercin ; pigeon ; i
دِيك ; dîk ; horoz ; rooster ; i
بَطَّة ; batta ; ördek ; duck ; i
نَحْلَة ; nahle ; arı ; bee ; i
نَمْلَة ; nemle ; karınca ; ant ; i
فَرَاشَة ; ferâşe ; kelebek ; butterfly ; i
ذُبَابَة ; zubâbe ; sinek ; fly ; i
ثُعْبَان ; su‘bân ; yılan ; snake ; i
سُلَحْفَاة ; sulahfât ; kaplumbağa ; turtle ; i
ضِفْدَع ; dıfda‘ ; kurbağa ; frog ; i

# Giyim
مَلَابِس ; melâbis ; giysiler, kıyafet ; clothes ; i
ثَوْب ; sevb ; elbise, uzun entari ; garment, robe ; i
فُسْتَان ; fustân ; kadın elbisesi ; dress ; i
بِنْطَال ; bintâl ; pantolon ; trousers ; i
تَنُّورَة ; tennûra ; etek ; skirt ; i
مِعْطَف ; mi‘taf ; palto, mont ; coat ; i
سُتْرَة ; sutra ; ceket ; jacket ; i
حِذَاء ; hızâ' ; ayakkabı ; shoe ; i
جَوْرَب ; cevreb ; çorap ; sock ; i
قُبَّعَة ; kubba‘a ; şapka ; hat ; i
حِجَاب ; hicâb ; başörtüsü ; headscarf ; i
نَظَّارَة ; nazzâra ; gözlük ; glasses ; i
خَاتَم ; hâtem ; yüzük ; ring ; i
حِزَام ; hızâm ; kemer ; belt ; i
جَيْب ; ceyb ; cep ; pocket ; i
مَحْفَظَة ; mahfaza ; cüzdan ; wallet ; i

# Hava ve doğa
طَقْس ; taks ; hava durumu ; weather ; i
جَوّ ; cevv ; hava ; weather, air ; i
هَوَاء ; hevâ' ; hava (soluduğumuz) ; air ; i
مَطَر ; matar ; yağmur ; rain ; i
ثَلْج ; selc ; kar, buz ; snow, ice ; i
رِيح ; rîh ; rüzgâr ; wind ; i
سَحَاب ; sehâb ; bulut ; clouds ; i
غَيْمَة ; ğayme ; bulut ; cloud ; i
نَجْم ; necm ; yıldız ; star ; i
نَار ; nâr ; ateş ; fire ; i
شَجَرَة ; şecera ; ağaç ; tree ; i
وَرْدَة ; verde ; gül, çiçek ; rose ; i
زَهْرَة ; zehra ; çiçek ; flower ; i
عُشْب ; ‘uşb ; çimen, ot ; grass ; i
حَجَر ; hacer ; taş ; stone ; i
رَمْل ; reml ; kum ; sand ; i
تُرَاب ; turâb ; toprak ; soil ; i
بُحَيْرَة ; buhayra ; göl ; lake ; i
غَابَة ; ğâbe ; orman ; forest ; i
صَحْرَاء ; sahrâ' ; çöl ; desert ; i
جَزِيرَة ; cezîra ; ada ; island ; i
شَاطِئ ; şâti' ; sahil, kıyı ; beach ; i
فَصْل ; fasl ; mevsim, sınıf, bölüm ; season, class, chapter ; i
صَيْف ; sayf ; yaz ; summer ; i
شِتَاء ; şitâ' ; kış ; winter ; i
رَبِيع ; rabî‘ ; ilkbahar ; spring ; i
خَرِيف ; harîf ; sonbahar ; autumn ; i
مُشْمِس ; muşmis ; güneşli ; sunny ; s
مُمْطِر ; mumtır ; yağmurlu ; rainy ; s
دَرَجَة الْحَرَارَةِ ; derecetu'l-harâra ; sıcaklık (derece) ; temperature ; i

# Okul ve sınıf
فَصْل دِرَاسِيّ ; fasl dirâsî ; sınıf, dönem ; classroom, semester ; i
سَبُّورَة ; sebbûra ; yazı tahtası ; blackboard ; i
طَبَاشِير ; tabâşîr ; tebeşir ; chalk ; i
مِمْسَحَة ; mimseha ; silgi ; eraser ; i
مِسْطَرَة ; mistara ; cetvel ; ruler ; i
قَلَم رَصَاص ; kalem rasâs ; kurşun kalem ; pencil ; i
مِقْلَمَة ; miklema ; kalemlik ; pencil case ; i
وَاجِب ; vâcib ; ödev ; homework ; i
اِمْتِحَان ; imtihân ; sınav ; exam ; i
دَرَجَة ; derece ; not, derece ; grade, degree ; i
دِرَاسَة ; dirâse ; okuma, öğrenim ; study ; i
عِلْم ; ‘ilm ; ilim, bilgi ; knowledge, science ; i
مُدِيرُ الْمَدْرَسَةِ ; mudîru'l-medrese ; okul müdürü ; principal ; i
زَمِيل ; zemîl ; arkadaş (sınıf, iş) ; classmate, colleague ; i
قَامُوس ; kâmûs ; sözlük ; dictionary ; i
قِصَّة ; kıssa ; hikâye ; story ; i
مَعْنَى ; ma‘nâ ; anlam ; meaning ; i
تَرْجَمَة ; tercema ; çeviri ; translation ; i
عَرَبِيّ ; ‘arabî ; Arap, Arapça ; Arab, Arabic ; s
اللُّغَة الْعَرَبِيَّة ; el-luğatu'l-‘arabiyye ; Arapça (dil) ; the Arabic language ; i
تُرْكِيّ ; turkî ; Türk ; Turkish ; s
تُرْكِيَا ; turkiyâ ; Türkiye ; Turkey ; i
إِنْجِلِيزِيّ ; incilîzî ; İngiliz, İngilizce ; English ; s

# Spor ve boş zaman
رِيَاضَة ; riyâda ; spor ; sport ; i
كُرَة ; kura ; top ; ball ; i
كُرَةُ الْقَدَمِ ; kuratu'l-kadem ; futbol ; football ; i
مُبَارَاة ; mubârât ; maç ; match ; i
فَرِيق ; ferîk ; takım ; team ; i
سِبَاحَة ; sibâha ; yüzme ; swimming ; i
هِوَايَة ; hivâye ; hobi ; hobby ; i
لُعْبَة ; lu‘be ; oyun, oyuncak ; game, toy ; i
فِيلْم ; film ; film ; film ; i
صُورَة ; sûra ; resim, fotoğraf ; picture ; i
مُوسِيقَى ; mûsîkâ ; müzik ; music ; i
أُغْنِيَة ; uğniye ; şarkı ; song ; i
عُطْلَة ; ‘utla ; tatil ; holiday ; i
نُزْهَة ; nuzha ; gezinti, piknik ; outing ; i
حَفْلَة ; hafle ; parti, tören ; party ; i
هَدِيَّة ; hediyye ; hediye ; gift ; i

# Duygular ve durumlar
حُبّ ; hubb ; sevgi, aşk ; love ; i
خَوْف ; havf ; korku ; fear ; i
فَرَح ; ferah ; sevinç ; joy ; i
حُزْن ; huzn ; hüzün ; sadness ; i
غَضَب ; ğadab ; öfke ; anger ; i
تَعَب ; ta‘ab ; yorgunluk ; tiredness ; i
صِحَّة ; sıhha ; sağlık ; health ; i
قَلِق ; kalik ; endişeli ; worried ; s
خَائِف ; hâif ; korkmuş ; afraid ; s
مُتَأَخِّر ; muteahhir ; geç kalmış, geç ; late ; s
مُبَكِّر ; mubekkir ; erken ; early ; s
مَشْغُولَة ; meşğûle ; meşgul (kadın) ; busy (f.) ; s
نَعْسَان ; na‘sân ; uykulu ; sleepy ; s
مُسْتَيْقِظ ; musteykız ; uyanık ; awake ; s
مُتَزَوِّج ; mutezevvic ; evli ; married ; s
أَعْزَب ; e‘zeb ; bekâr ; single ; s

# Alışveriş ve para
سِعْر ; si‘r ; fiyat ; price ; i
ثَمَن ; semen ; bedel, fiyat ; price ; i
دِينَار ; dînâr ; dinar ; dinar ; i
دِرْهَم ; dirhem ; dirhem ; dirham ; i
رِيَال ; riyâl ; riyal ; riyal ; i
لِيرَة ; lîra ; lira ; lira ; i
دُولَار ; dûlâr ; dolar ; dollar ; i
بِطَاقَة ; bitâka ; kart ; card ; i
فَاتُورَة ; fâtûra ; fatura ; bill ; i
تَخْفِيض ; tahfîd ; indirim ; discount ; i
كِيس ; kîs ; poşet, torba ; bag ; i
كِيلُو ; kîlû ; kilo ; kilo ; i
نِصْف ; nısf ; yarım ; half ; i
رُبْع ; rub‘ ; çeyrek ; quarter ; i
بِكَمْ هٰذَا ; bikem hâzâ ; bu kaça ; how much is this ; k
غَالٍ جِدًّا ; ğâlin ciddan ; çok pahalı ; very expensive ; k

# Sağlık
مَرَض ; merad ; hastalık ; illness ; i
دَوَاء ; devâ' ; ilaç ; medicine ; i
أَلَم ; elem ; ağrı, acı ; pain ; i
صُدَاع ; sudâ‘ ; baş ağrısı ; headache ; i
حُمَّى ; hummâ ; ateş (hastalık) ; fever ; i
زُكَام ; zukâm ; nezle ; cold (illness) ; i
سُعَال ; su‘âl ; öksürük ; cough ; i
جُرْح ; curh ; yara ; wound ; i
عِيَادَة ; ‘iyâde ; klinik, muayenehane ; clinic ; i
إِسْعَاف ; is‘âf ; ambulans, ilk yardım ; ambulance ; i
مَوْعِد ; mev‘id ; randevu ; appointment ; i
أَشْعُرُ بِأَلَمٍ ; eş‘uru bi-elem ; ağrım var ; I feel pain ; k

# Sayılar (derslerde olmayanlar)
أَحَدَ عَشَرَ ; ehade ‘aşere ; on bir ; eleven ; i
اِثْنَا عَشَرَ ; isnâ ‘aşere ; on iki ; twelve ; i
ثَلَاثُونَ ; selâsûn ; otuz ; thirty ; i
أَرْبَعُونَ ; erba‘ûn ; kırk ; forty ; i
سِتُّونَ ; sittûn ; altmış ; sixty ; i
سَبْعُونَ ; seb‘ûn ; yetmiş ; seventy ; i
ثَمَانُونَ ; semânûn ; seksen ; eighty ; i
تِسْعُونَ ; tis‘ûn ; doksan ; ninety ; i
مِلْيُون ; milyûn ; milyon ; million ; i
عَدَد ; ‘aded ; sayı, adet ; number ; i
مَرَّة ; merra ; kere, defa ; time (occurrence) ; i

# Günlük kalıplar
لَا أَفْهَمُ ; lâ efhemu ; anlamıyorum ; I don't understand ; k
لَا أَعْرِفُ ; lâ a‘rifu ; bilmiyorum ; I don't know ; k
أَعِدْ مِنْ فَضْلِكَ ; e‘id min fadlike ; lütfen tekrar et ; repeat please ; k
تَكَلَّمْ بِبُطْءٍ ; tekellem bi-but' ; yavaş konuş ; speak slowly ; k
أَيْنَ الْحَمَّامُ ; eyne'l-hammâm ; tuvalet nerede ; where is the bathroom ; k
كَمِ السَّاعَةُ ; kemi's-sâ‘a ; saat kaç ; what time is it ; k
أَنَا مِنْ تُرْكِيَا ; ene min turkiyâ ; Türkiye'denim ; I am from Turkey ; k
أَنَا طَالِبٌ ; ene tâlibun ; ben öğrenciyim ; I am a student ; k
أَتَكَلَّمُ الْعَرَبِيَّةَ قَلِيلًا ; etekellemu'l-‘arabiyye kalîlen ; biraz Arapça konuşuyorum ; I speak a little Arabic ; k
هَلْ تَتَكَلَّمُ الْعَرَبِيَّةَ ; hel tetekellemu'l-‘arabiyye ; Arapça konuşuyor musun ; do you speak Arabic ; k
مَاذَا تُرِيدُ ; mâzâ turîd ; ne istiyorsun ; what do you want ; k
أُرِيدُ ; urîdu ; istiyorum ; I want ; f ; n=Mazisi: أَرَادَ (erâde) istedi.
أُحِبُّ ; uhibbu ; seviyorum ; I love, I like ; f ; n=Mazisi: أَحَبَّ (ehabbe) sevdi.
عِنْدِي سُؤَالٌ ; ‘indî su'âl ; bir sorum var ; I have a question ; k
مَا الْمُشْكِلَةُ ; me'l-muşkila ; sorun ne ; what is the problem ; k
لَا مُشْكِلَةَ ; lâ muşkilete ; sorun yok ; no problem ; k
طَبْعًا ; tab‘an ; tabii, elbette ; of course ; zf
رُبَّمَا ; rubbemâ ; belki ; maybe ; zf
بِالضَّبْطِ ; bi'd-dabt ; tam olarak, aynen ; exactly ; zf
تَقْرِيبًا ; takrîben ; yaklaşık ; approximately ; zf
فَوْرًا ; fevran ; hemen ; immediately ; zf
بَعْدَ قَلِيلٍ ; ba‘de kalîl ; birazdan ; in a little while ; zf
أَخِيرًا ; ehîran ; sonunda ; finally ; zf
مَثَلًا ; mesela ; mesela, örneğin ; for example ; zf
لِلْأَسَفِ ; li'l-esef ; maalesef ; unfortunately ; zf
بِسُرْعَةٍ ; bi-sur‘a ; hızlıca ; quickly ; zf
بِبُطْءٍ ; bi-but' ; yavaşça ; slowly ; zf

# Daha fazla sık fiil
نَظَّفَ ; nazzafa ; temizledi ; he cleaned ; f ; mu=يُنَظِّفُ/yunazzıfu
رَتَّبَ ; retteba ; düzenledi, topladı ; he arranged ; f ; mu=يُرَتِّبُ/yurettibu
سَمَحَ ; semeha ; izin verdi ; he allowed ; f ; mu=يَسْمَحُ/yesmehu
قَبِلَ ; kabile ; kabul etti ; he accepted ; f ; mu=يَقْبَلُ/yakbelu
رَفَضَ ; rafada ; reddetti ; he refused ; f ; mu=يَرْفُضُ/yarfudu
طَارَ ; târa ; uçtu ; it flew ; f ; mu=يَطِيرُ/yetîru
ضَاعَ ; dâ‘a ; kayboldu ; it got lost ; f ; mu=يَضِيعُ/yedî‘u
خَافَ ; hâfe ; korktu ; he feared ; f ; mu=يَخَافُ/yehâfu
اِبْتَسَمَ ; ibtesame ; gülümsedi ; he smiled ; f ; mu=يَبْتَسِمُ/yebtesimu
عَادَ ; ‘âde ; döndü ; he returned ; f ; mu=يَعُودُ/ye‘ûdu
مَرَّ ; merra ; geçti, uğradı ; he passed ; f ; mu=يَمُرُّ/yemurru
نَجَحَ ; necaha ; başardı, kazandı (sınav) ; he succeeded ; f ; mu=يَنْجَحُ/yencehu
فَازَ ; fâze ; kazandı (yarış) ; he won ; f ; mu=يَفُوزُ/yefûzu
خَسِرَ ; hasira ; kaybetti ; he lost ; f ; mu=يَخْسَرُ/yahseru
اِخْتَارَ ; ihtâra ; seçti ; he chose ; f ; mu=يَخْتَارُ/yahtâru
سَقَطَ ; sekata ; düştü ; he fell ; f ; mu=يَسْقُطُ/yeskutu
لَمَسَ ; lemese ; dokundu ; he touched ; f ; mu=يَلْمِسُ/yelmisu
ذَاقَ ; zâka ; tattı ; he tasted ; f ; mu=يَذُوقُ/yezûku
شَعَرَ ; şe‘ara ; hissetti ; he felt ; f ; mu=يَشْعُرُ/yeş‘uru
تَعِبَ ; te‘ibe ; yoruldu ; he got tired ; f ; mu=يَتْعَبُ/yet‘abu
مَرِضَ ; meride ; hastalandı ; he got sick ; f ; mu=يَمْرَضُ/yemradu
اِسْتَرَاحَ ; isterâha ; dinlendi ; he rested ; f ; mu=يَسْتَرِيحُ/yesterîhu
اِحْتَفَلَ ; ihtefele ; kutladı ; he celebrated ; f ; mu=يَحْتَفِلُ/yehtefilu
رَكَضَ ; rakada ; koştu ; he ran ; f ; mu=يَرْكُضُ/yarkudu
قَفَزَ ; kafeze ; zıpladı ; he jumped ; f ; mu=يَقْفِزُ/yakfizu
جَمَعَ ; ceme‘a ; topladı ; he collected ; f ; mu=يَجْمَعُ/yecme‘u
فَرِحَ ; feriha ; sevindi ; he rejoiced ; f ; mu=يَفْرَحُ/yefrahu
غَضِبَ ; ğadibe ; kızdı ; he got angry ; f ; mu=يَغْضَبُ/yağdabu
صَدَّقَ ; saddaka ; inandı, doğruladı ; he believed ; f ; mu=يُصَدِّقُ/yusaddiku
كَذَبَ ; kezebe ; yalan söyledi ; he lied ; f ; mu=يَكْذِبُ/yekzibu
وَعَدَ ; ve‘ade ; söz verdi ; he promised ; f ; mu=يَعِدُ/ye‘idu
اِعْتَذَرَ ; i‘tezera ; özür diledi ; he apologized ; f ; mu=يَعْتَذِرُ/ya‘teziru
غَيَّرَ ; ğayyera ; değiştirdi ; he changed ; f ; mu=يُغَيِّرُ/yuğayyiru
أَصْلَحَ ; aslaha ; tamir etti, düzeltti ; he repaired ; f ; mu=يُصْلِحُ/yuslihu
كَسَرَ ; kesera ; kırdı ; he broke ; f ; mu=يَكْسِرُ/yeksiru
اِسْتَحَمَّ ; istehamme ; banyo yaptı, yıkandı ; he bathed ; f ; mu=يَسْتَحِمُّ/yestehımmu
تَوَضَّأَ ; tevadda'e ; abdest aldı ; he performed ablution ; f ; mu=يَتَوَضَّأُ/yetevadda'u
دَعَا ; de‘â ; dua etti, davet etti ; he prayed, invited ; f ; mu=يَدْعُو/yed‘û
اِتَّفَقَ ; ittefeka ; anlaştı ; he agreed ; f ; mu=يَتَّفِقُ/yettefiku
سَاعِدْنِي ; sâ‘idnî ; bana yardım et ; help me ; k
اِنْتَظِرْ ; intazır ; bekle ; wait ; f
اِجْلِسْ ; iclis ; otur ; sit ; f
قُمْ ; kum ; kalk ; stand up ; f
اِسْمَعْ ; isma‘ ; dinle ; listen ; f
اِقْرَأْ ; ikra' ; oku ; read ; f
اُكْتُبْ ; uktub ; yaz ; write ; f
اِذْهَبْ ; izheb ; git ; go ; f
`;
