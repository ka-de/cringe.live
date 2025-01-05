const quotesJson = [
  {
    author: "Alan Watts",
    quote:
      "A zen nem keveri össze a spiritualitást azzal, hogy Istenre gondolunk krumplihámozás közben. A zen spiritualitás egyszerűen csak a krumpli hámozása.",
  },
  {
    author: "Alan Watts",
    quote: "Önmagad meghatározása olyan, mintha a saját fogaidat próbálnád megharapni.",
  },
  {
    author: "Alan Watts",
    quote:
      "Azt sugalltam, hogy szinte minden mítosz mögött ott van a bújócska játék egyszerű cselekménye.",
  },
  {
    author: "Alan Watts",
    quote:
      "A hit azt jelenti, hogy rábízod magad a vízre. Amikor úszol, nem markolod meg a vizet, mert ha így teszel, elsüllyedsz és megfulladsz. Ehelyett ellazulsz és lebegsz.",
  },
  {
    author: "Alan Watts",
    quote:
      "Ez az élet igazi titka - hogy teljesen belemerülj abba, amit éppen most csinálsz. És ahelyett, hogy munkának hívnád, ismerd fel, hogy ez játék.",
  },
  {
    author: "Alan Watts",
    quote: "A vallás mindig széthullik.",
  },
  {
    author: "Alan Watts",
    quote:
      "Az orvosok próbálnak megszabadulni a betegeiktől - a papok próbálják rászoktatni őket az orvosságra, hogy a templom függőivé váljanak.",
  },
  {
    author: "Alan Watts",
    quote:
      "Minél jobban küzdünk az életért (mint élvezetért), annál inkább megöljük azt, amit szeretünk.",
  },
  {
    author: "Alan Watts",
    quote:
      "Az emberi tevékenység nagy része arra irányul, hogy állandóvá tegye azokat az élményeket és örömöket, amelyek csak azért szerethetők, mert változnak.",
  },
  {
    author: "Alan Watts",
    quote:
      "Nyilvánvalónak kell lennie... hogy ellentmondás rejlik abban, hogy tökéletes biztonságra vágyunk egy olyan univerzumban, amelynek lényege a pillanatnyiság és a folyékonyság.",
  },
  {
    author: "Alan Watts",
    quote:
      "A félelemtől való menekülés maga a félelem; a fájdalom elleni küzdelem maga a fájdalom; a bátorság erőltetése maga a félelem. Ha az elme fájdalomban van, az elme maga a fájdalom. A gondolkodónak nincs más formája, mint a gondolata.",
  },
  {
    author: "Alan Watts",
    quote:
      "A konvencióktól való szabadság nem azt jelenti, hogy megvetjük azokat, hanem hogy nem csapnak be minket. Azt jelenti, hogy képesek vagyunk eszközként használni őket, ahelyett, hogy ők használnának minket.",
  },
  {
    author: "Alan Watts",
    quote:
      "Ha a kereszténység bor és az iszlám kávé, akkor a buddhizmus minden bizonnyal tea.",
  },
  {
    author: "Alan Watts",
    quote:
      "A buddhizmus... nem kultúra, hanem a kultúra kritikája, egy tartós erőszakmentes forradalom vagy 'lojális ellenzék' abban a kultúrában, amelyben részt vesz.",
  },
  {
    author: "Alan Watts",
    quote:
      "A szex már nem komoly tabu. A tizenévesek néha többet tudnak róla, mint a felnőttek.",
  },
  {
    author: "Alan Watts",
    quote:
      "A világ rendkívül veszélyes helyzetben van, és a súlyos betegségek gyakran veszélyes gyógymódot igényelnek - mint a Pasteur-szérum a veszettségre.",
  },
  {
    author: "Alan Watts",
    quote:
      "A legerősebben érvényesített tabuk közül a legerősebb az a tabu, amely megtiltja, hogy tudd, ki vagy mi vagy valójában a látszólag különálló, független és elszigetelt egód maszkja mögött.",
  },
  {
    author: "Alan Watts",
    quote:
      "Emberként egyszerűen a természetemhez tartozik, hogy élvezzem és megosszam a filozófiát. Ezt ugyanúgy teszem, ahogy egyes madarak sasok és mások galambok, egyes virágok liliomok és mások rózsák.",
  },
  {
    author: "Alan Watts",
    quote:
      "Mindenkinek van vallása, akár bevallja, akár nem, mert lehetetlen embernek lenni anélkül, hogy ne lennének alapvető feltételezései (vagy intuíciói) a létezésről és a jó életről.",
  },
  {
    author: "Alan Watts",
    quote:
      "Aki folyton gondolkodik, annak nincs más gondolkodnivalója, csak gondolatok. Így elveszíti a kapcsolatot a valósággal, és az illúziók világában él.",
  },
  {
    author: "Alan Watts",
    quote:
      "Ha tudod, hogy az 'én', a személy, a homlokzat, az ego értelmében valójában nem létezik, akkor... nem száll túlságosan a fejedbe, ha felébredsz és rájössz, hogy te vagy az Isten.",
  },
  {
    author: "Alan Watts",
    quote:
      "A kétezer év kereszténység eredményeként a szex az agyunkra ment. Ami nem mindig a legjobb hely neki.",
  },
  {
    author: "Alan Watts",
    quote:
      "A vallás egész története a prédikálás kudarcának története. A prédikálás morális erőszak.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Amit képzeletnek hívunk, az valójában a valóság egyetemes könyvtára. Nem tudnád elképzelni, ha nem lenne valahol, valamikor valóságos.",
  },
  {
    author: "Terence McKenna",
    quote: "Az örökkévalóság teste magába szív minket.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Az élet, amelyet a pszichedelikus élmény hiányában élünk, amelyen az ősi sámanizmus alapul, egy elbagatellizált, megtagadott, az egónak alárendelt élet.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Sokan átmennek azon a gondolaton, hogy guru vagyok, és elég utat tesznek meg ahhoz, hogy megértsék: nem, csak egy tanú voltam. Csak egy tanú voltam.",
  },
  {
    author: "Terence McKenna",
    quote:
      "A mágia igazi titka az, hogy a világ szavakból áll, és ha ismered a szavakat, amelyekből a világ áll, azt csinálhatsz belőle, amit csak akarsz.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Ha az igazságot úgy lehet elmondani, hogy megértsék, akkor el fogják hinni.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Kulturális programozásunk ketrecbe zár minket. A kultúra egy tömeges hallucináció, és amikor kilépsz a tömeges hallucinációból, látod, hogy mennyit ér.",
  },
  {
    author: "Terence McKenna",
    quote: "A gondolkodók nem szívesen látott vendégek a legtöbb társasági helyzetben.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Hol van kőbe vésve, hogy 'A majmok csapatának meg kell értenie a kozmosz építészetét'?",
  },
  {
    author: "Terence McKenna",
    quote:
      "A történelem beáramlás afelé, amit a buddhisták a sűrűn pakolt birodalmának neveznek, egy átalakulási birodalom, ahol az ellentétek egyesülnek.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Igényt kell tartanunk az anarchiára és fel kell ismernünk, hogy a rendszereknek van egy saját, emberellenes életük. Határozottan van egy emberellenes tendencia minden rendszerben.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Valahol 1945 körül elkezdtük kifosztani a jövőt mint túlélési stratégiát. Valamilyen etikai norma összetört.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Ha mind Isten gyermekei vagyunk, akkor miért szereltük fel a földet dinamittal, és miért dobálunk fel érméket, hogy lássuk, ki gyújthatja meg?",
  },
  {
    author: "Terence McKenna",
    quote:
      "Az eredendő bűn gondolata megfertőzött minket, ez tart minket gyermeki állapotban... a felelősség nélküli politika fasizmus.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Szükséged van egy egóra. Ha nem lenne egód, nem tudnád, kinek a szájába kell tenni az ételt, amikor étteremben eszel.",
  },
  {
    author: "Terence McKenna",
    quote:
      "...igen, úgy értem, ezek az utazások a magasabb helyekre, bárhol is legyenek, úgy tűnik, matematikai metaforákat követelnek.",
  },
  {
    author: "Terence McKenna",
    quote:
      "...az intuíció az intuíció, és a zaj az zaj, szóval amit teszel, az az, hogy megfőzöd az elmédben és azzal mész, ami helyesnek érződik.",
  },
  {
    author: "Terence McKenna",
    quote:
      "A fő dolog, amit meg kell érteni, hogy valamiféle műalkotásba vagyunk bezárva.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Összhangban van az élet tempójával - szétszórt, mégis egésszé forrasztott - törött, mégis összeszőtt.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "A költő feladata, hogy hatékonyan használja a nyelvet, a saját nyelvét, az egyetlen nyelvet, amely számára hiteles.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "A költészet más anyagot követel, mint a próza. Ugyanannak a ténynek egy másik oldalát használja... a nyelv spontán alakulását, ahogy azt halljuk.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Az első versem villámcsapás volt az égből... megtört egy kiábrándultsági és öngyilkos kétségbeesési varázslatot... lelket kielégítő örömmel töltött el.",
  },
  {
    author: "William Carlos Williams",
    quote: "Sok gazember van odakint!",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Ezt azért szerettem, mert kiküszöbölte a lényegest a kompozícióból. Lecsökkentettem és lecsökkentettem, és lecsökkentettem. Ez összenyomódott, hogy élénkké váljon.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Művészi formaként a vers nem lehet 'szabad' abban az értelemben, hogy nincsenek korlátai vagy vezérelve.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Oly különböző, ez a férfi<br>És ez a nő:<br>Egy patak folyik<br>Egy mezőn.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "A föld megreped és<br>összezsugorodik;<br>a szél szánalmasan nyög;<br>az ég kialszik<br>ha te kudarcot vallasz.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "arcotok<br>beállított darabjai megmozgatnak —<br>vezető polgárok —<br>de nem<br>ugyanúgy.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Itt fekszem és rád gondolok:—<br>a szerelem foltja<br>ott van a világon!",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Különös bátorságot<br>adsz nekem ősi csillag:<br>Ragyogj magányosan a napfelkeltében<br>amelyhez nem adsz hozzá semmit!",
  },
  {
    author: "William Carlos Williams",
    quote: "Ki mondhatná, hogy nem<br>vagyok háztartásom boldog géniusza?",
  },
  {
    author: "Alan Watts",
    quote:
      "Ritkán vesszük észre például, hogy legbelsőbb gondolataink és érzelmeink valójában nem is a sajátjaink. Mert olyan nyelveken és képeken gondolkodunk, amelyeket nem mi találtunk fel, hanem a társadalomtól kaptunk.",
  },
  {
    author: "Alan Watts",
    quote:
      "Azért akarunk tovább és tovább menni, mert egy múlékony világban élünk.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Az épelméjűség ára ebben a társadalomban az elidegenedés egy bizonyos szintje.",
  },
  {
    author: "Terence McKenna",
    quote:
      "A természet nem ellenségünk, akit meg kell erőszakolni és le kell győzni. A természet mi magunk vagyunk, akit óvni és felfedezni kell.",
  },
  {
    author: "Terence McKenna",
    quote:
      "A szintaxis, amelyen beszélünk, az a szoftver, amelyet az emberi operációs rendszerbe töltünk le.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Az ég ránk hajol, tökéletlenül, lélegzete<br>felénk fújva<br>gúnyosan. De bár<br>a levelek fáikhoz tapadnak<br>nem csak értünk van.",
  },
  {
    author: "William Carlos Williams",
    quote: "Amerika tiszta termékei<br>megőrülnek—",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Az eső<br>és fények között<br>láttam az 5-ös számot<br>aranyban<br>egy piros<br>tűzoltóautón<br>mozogva<br>feszülten<br>észrevétlenül",
  },
  {
    author: "Aldous Huxley",
    quote:
      "A tapasztalat nem az, ami történik az emberrel; az a tapasztalat, amit az ember kezd azzal, ami történik vele.",
  },
  {
    author: "Hunter S. Thompson",
    quote:
      "Az életnek nem egy utazásnak kellene lennie a sírhoz azzal a szándékkal, hogy szépen és jól megőrzött testben érkezzünk meg, hanem inkább oldalcsúszásban, füstfelhőben, teljesen elhasználva, tökéletesen elnyűve, és hangosan kiáltva 'Hűha! Micsoda utazás!'",
  },
  {
    author: "Albert Hofmann",
    quote:
      "Hiszem, hogy ha az emberek megtanulnák bölcsebben használni az LSD látomáskeltő képességét, megfelelő körülmények között, orvosi gyakorlatban és meditációval összekapcsolva, akkor a jövőben ez a problémás gyermek csodagyermekké válhatna.",
  },
  {
    author: "Carlos Castaneda",
    quote:
      "Vagy nyomorulttá tesszük magunkat, vagy erőssé. A munka mennyisége ugyanannyi.",
  },
  {
    author: "Graham Hancock",
    quote:
      "Hiszem, hogy az ősi és őslakos népek sokkal többet tudtak a tudat és a valóság természetéről, mint mi.",
  },
  {
    author: "C.G. Jung",
    quote:
      "Látomásaid csak akkor válnak tisztává, amikor képes vagy a saját szívedbe nézni. Aki kifelé néz, álmodik; aki befelé néz, felébred.",
  },
  {
    author: "Timothy Leary",
    quote: "Isten vagy, viselkedj úgy, gondolkodj úgy, vállald a felelősséget.",
  },
];
