---
weight: 2
bookFlatSection: false
bookToC: false
title: "DoRA"
summary: "Egy új, paraméter-hatékony finomhangolási módszer, amely a betanított súlyokat nagyság és irány komponensekre bontja a hatékonyabb adaptáció érdekében"
image: "https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/phoenix.jpg"
image_alt: "A kép egy élénk és dinamikus főnixet ábrázol, amely egy digitális tájból emelkedik ki. A főnix, egy mitikus madár, amelyet gyakran az újjászületéssel és megújulással társítanak, tüzes vörös és narancssárga tollakkal van ábrázolva, amelyek kék és fehér digitális mátrixba olvadnak, ahogy kifelé terjednek. A háttérben egy összetett digitális kódok, rácsok és áramkörök sora látható, amely a főnix organikus formáját a strukturált, technológiai elemekkel ötvözi. Ez az ellentét egy lenyűgöző vizuális metaforát hoz létre a természet és a technológia fúziójára, szimbolizálva az átalakulást és az új lehetőségek megjelenését a digitális világban. A kép vizuálisan lenyűgöző és fogalmilag érdekes, kiemelve az innováció és a megújulás témáit a modern technológia kontextusában."
blurhash: "LFA^F9M|00pJIoxZWAM|9FxW%MRQ"
aliases:
  - /docs/yiff_toolkit/lora_training/dora/
  - /docs/yiff_toolkit/lora_training/dora
  - /docs/yiff_toolkit/lora_training/DoRA/
  - /docs/yiff_toolkit/lora_training/DoRA
  - /hu/docs/yiff_toolkit/lora_training/dora/
  - /hu/docs/yiff_toolkit/lora_training/dora
  - /hu/docs/yiff_toolkit/lora_training/DoRA/
  - /hu/docs/yiff_toolkit/lora_training/DoRA
---

<!-- markdownlint-disable MD025 -->

# DoRA: Súly-Dekompozíciós Alacsony Rangú Adaptáció

> Írta: Gaeros és Claude et al.

Liu és társai által készített ["DoRA: Weight-Decomposed Low-Rank Adaptation"](https://arxiv.org/abs/2402.09353) egy innovatív finomhangolási megközelítés, amely a LoRA-t fejleszti tovább a súlyok nagyságának és irányának külön kezelésével. A súlyok ezen komponensekre bontásával a DoRA jobb teljesítményt ér el, mint a hagyományos LoRA, miközben hasonló paraméter-hatékonyságot tart fenn. Jelentős javulást mutat különböző feladatokban, beleértve a józan észen alapuló következtetést (+1.0-4.4%), a vizuális-nyelvi megértést (+0.9-1.9%) és az utasítás-hangolást (+0.7-1.1%).

## Motiváció

### Kulcs Felismerés

A Súly Normalizációból kiindulva, amely a súlyok újraparaméterezésével javítja a gradiens kondicionálást és gyorsabb konvergenciát ér el, a szerzők először egy új elemzést végeztek arról, hogyan változnak a súlyok a finomhangolás során. A súlyokat nagyság és irány komponensekre bontva felfedezték, hogy a LoRA és a teljes finomhangolás (FT) jelentősen eltérő frissítési mintákat mutat.

Elemzésük egy kulcsfontosságú empirikus felfedezést tárt fel: az előre betanított modellek finomhangolásakor a leghatékonyabb adaptációk (ahogy az FT-ben látható) gyakran az alábbiak egyikét tartalmazzák:

Nagy nagyságú változások minimális irányváltoztatásokkal, vagy jelentős irányváltozások a nagyságok megőrzése mellett, de ritkán mindkettő egyszerre. Ezzel szemben a LoRA olyan csatolt viselkedést mutatott, ahol a nagyság és az irányváltozások arányosak voltak.

Ez a felfedezés arra utalt, hogy az előre betanított súlyok már hasznos jellemző-kombinációkat kódolnak, és a hatékony adaptációnak elsősorban vagy azok fontosságát (nagyságát) vagy keverését (irányát) kell függetlenül módosítania. Ez a felismerés vezetett a DoRA tervezéséhez: ezeket a komponenseket explicit módon szétválasztva javítja mind a tanulási képességet, mind a képzés stabilitását.

### Súly Dekompozíció és Aktivációk

A neurális hálózatokban minden súlymátrix $W \in \mathbb{R}^{d \times k}$ bemeneti vektorokat $x \in \mathbb{R}^k$ kimeneti vektorokká $y \in \mathbb{R}^d$ alakít. Ez az átalakítás két kiegészítő nézőpontból érthető meg:

- Oszlop nézet (geometriai): Minden oszlop $w_j$ egy vektor a kimeneti térben ($\mathbb{R}^d$), amelyet a megfelelő bemeneti komponens $x_j$ skáláz
- Sor nézet (algebrai): Minden sor $w^i$ a kimenet egy komponensét számítja ki a bemenettel való skaláris szorzat révén

Ezek a nézetek megmutatkoznak az átalakítás működésében:

- Oszlop nézet: $y = \sum_j x_j w_j$ (minden bemeneti komponens $x_j$ skálázza a megfelelő kimeneti tér irányát $w_j$)
- Sor nézet: $y_i = \langle w^i, x \rangle$ (minden sor a kimenet egy komponensét számítja ki)

A cikk definiálja a $||\cdot||_c$-t mint minden oszlopvektor L2 normáját. Amikor a súlyokat a DoRA-ban felbontjuk, minden $w_j$ oszlopvektor így bomlik fel:

- Irány: $v_j = w_j/||w_j||_2$ (normalizált vektor a kimeneti térben)
- Nagyság: $m_j = ||w_j||_2$ (skalár)

Ennek az oszloponkénti felbontásnak világos geometriai jelentése van:

- Minden $v_j$ egy egységvektor az $\mathbb{R}^d$-ben, amely egy irányt definiál a kimeneti térben
- $m_j$ skálázza ennek az iránynak a hozzájárulását, amikor az $x_j$ bemeneti komponens aktív
- A teljes transzformáció $y = \sum_j (m_j x_j) v_j$ lesz

A cikk empirikus elemzése feltárja, hogy a hatékony finomhangolás (ahogy az FT-ben látható) gyakran az alábbiakat igényli:

1. A skálázási tényezők ($m_j$) módosítását a kimeneti tér irányainak ($v_j$) megőrzése mellett, vagy
2. A kimeneti tér irányainak ($v_j$) finomítását relatív skáláik ($m_j$) megtartása mellett

---

{{< related-posts related="en/docs/yiff_toolkit/lora_training/Weight Decomposition Direction | docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/" >}}
