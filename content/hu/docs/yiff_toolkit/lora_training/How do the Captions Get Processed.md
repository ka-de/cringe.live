---
weight: 2
bookFlatSection: false
bookToC: false
title: "Hogyan Dolgozódnak Fel a Feliratok?"
summary: "Ez a cikk elmagyarázza az sd-scripts `process_caption` metódusát, részletezve, hogyan szabja testre a feliratokat különböző paraméterek alapján. Kitér az előtag és utótag hozzáadására, a kiejtési mechanizmusokra, a helyettesítő karakterek feldolgozására, a token manipulációra és a szöveges inverzió helyettesítésekre. A módszer biztosítja, hogy a feliratok dinamikusan módosuljanak a tanítási adatok minőségének és a modell robusztusságának javítása érdekében."
aliases:
  - /hu/docs/yiff_toolkit/lora_training/How-do-the-Captions-Get-Processed/
  - /hu/docs/yiff_toolkit/lora_training/How-do-the-Captions-Get-Processed
  - /hu/docs/yiff_toolkit/lora_training/How do the Captions Get Processed/
  - /hu/docs/yiff_toolkit/lora_training/How do the Captions Get Processed
  - /hu/docs/yiff_toolkit/lora_training/Hogyan-dolgozódnak-fel-a-feliratok
  - /hu/docs/yiff_toolkit/lora_training/Hogyan-dolgozódnak-fel-a-feliratok/
  - /hu/docs/yiff_toolkit/lora_training/Hogyan-dolgozódnak-fel-a-feliratok
  - /hu/docs/yiff_toolkit/lora_training/Hogyan-dolgozódnak-fel-a-feliratok/
  - /docs/yiff_toolkit/lora_training/Hogyan dolgozódnak fel a feliratok
  - /docs/yiff_toolkit/lora_training/Hogyan dolgozódnak fel a feliratok/
  - /docs/yiff_toolkit/lora_training/Hogyan_dolgozódnak_fel_a_feliratok
  - /docs/yiff_toolkit/lora_training/Hogyan_dolgozódnak_fel_a_feliratok/
  - /docs/yiff_toolkit/lora_training/Hogyan-dolgozódnak-fel-a-feliratok
  - /docs/yiff_toolkit/lora_training/Hogyan-dolgozódnak-fel-a-feliratok/
---

<!--markdownlint-disable MD025 -->

# Hogyan Dolgozódnak Fel a Feliratok?

---

A `process_caption` metódus egy átfogó függvény, amelyet arra terveztek, hogy a feliratokat nagy mértékű testreszabással dolgozza fel a BaseSubset objektumban meghatározott beállítások alapján. Nézzük meg ennek a módszernek a technikai részleteit és matematikai aspektusait.

## Felirat Előtag és Utótag

A módszer azzal kezdődik, hogy ellenőrzi, vannak-e előtagok vagy utótagok definiálva a subset objektumban. Ha vannak, ezek hozzáadódnak a felirat elejéhez és végéhez. Ez egyszerű szöveg összefűzés:

```python
if subset.caption_prefix:
    caption = subset.caption_prefix + " " + caption
if subset.caption_suffix:
    caption = caption + " " + subset.caption_suffix
```

## Kiejtési Mechanizmus

Ezután a módszer meghatározza, hogy a feliratot ki kell-e ejteni. Ezt a `caption_dropout_rate` és `caption_dropout_every_n_epochs` paraméterek kiértékelésével teszi. A kiejtési mechanizmus véletlenszerűséget visz a folyamatba, ami hasznos lehet az adatbővítéshez vagy a túltanulás megelőzéséhez a tréning során. A kiejtés valószínűségét egy véletlenszám generálás és a kiejtési rátával való összehasonlítás határozza meg:

```python
is_drop_out = subset.caption_dropout_rate > 0 and random.random() < subset.caption_dropout_rate
is_drop_out = (
    is_drop_out
    or (subset.caption_dropout_every_n_epochs > 0
        and self.current_epoch % subset.caption_dropout_every_n_epochs == 0)
)
```

## Helyettesítő Karakterek Feldolgozása

Ha az `enable_wildcard` paraméter `True`-ra van állítva, a függvény feldolgozza a feliratban található helyettesítő karaktereket.
A helyettesítő karakterek olyan helyőrzők `{opció1|opció2|...}` formában, ahol az opciók közül véletlenszerűen választódik ki egy és kerül beillesztésre a helyettesítő karakter helyére.

A helyettesítő karakterek feldolgozása a következő lépésekből áll:

Ha a felirat tartalmaz újsor karaktereket `\n`, a függvény véletlenszerűen kiválaszt egyet a sorok közül.
Az escapelt kapcsos zárójelek `{{` és `}}` ideiglenesen speciális Unicode karakterekre `⦅` és `⦆` cserélődnek, hogy elkerüljük a helyettesítő karakterekkel való keveredést.
Egy reguláris kifejezés `r"\{([^}]+)\}"` szolgál a helyettesítő karakter minták egyeztetésére, és a `replace_wildcard` függvény hívódik meg minden egyezésre:

```python
def replace_wildcard(match):
    return random.choice(match.group(1).split("|"))
```

Ez a függvény szétválasztja az egyező karakterláncot (a helyettesítő karakter opciókat) a `|` elválasztó mentén, kiválaszt egy véletlenszerű opciót a létrejövő listából a random.choice segítségével, és ezt az opciót adja vissza a helyettesítő karakter helyettesítéseként.
Az összes helyettesítő karakter cseréje után az escapelt kapcsos zárójelek visszaállnak eredeti formájukba.

Ha a helyettesítő karakterek nincsenek engedélyezve és a felirat tartalmaz újsorokat, csak az első sor marad meg: `caption = caption.split("\n")[0]`.

## Token Manipuláció

A függvény fejlett token manipulációs funkciókat kínál, beleértve a keverést, a bemelegítést és a kiejtést. A tokenek a felirat egyes szavai vagy szimbólumai. A tokenek keverése segíthet a modellnek robusztusabb reprezentációkat tanulni azáltal, hogy az adatokat különböző sorrendben mutatja be. A token bemelegítési mechanizmus egy olyan tananyag-tanulási forma, ahol az adatok komplexitása fokozatosan növekszik a tréning során. A bemelegítési lépés alapján megtartandó tokenek számának kiszámítására szolgáló matematikai képlet a következő:

$$
\text{tokens_len} = \left\lfloor \left( \text{self.current_step} \right) \times \left( \frac{\text{len(flex_tokens)} - \text{subset.token_warmup_min}}{\text{subset.token_warmup_step}} \right) \right\rfloor + \text{subset.token_warmup_min}
$$

vagy Pythonban:

```python
tokens_len = math.floor(self.current_step * ((len(flex_tokens) - subset.token_warmup_min) / subset.token_warmup_step)) + subset.token_warmup_min
```

- **Token Kiejtés**: Ha a `caption_tag_dropout_rate` nagyobb mint 0, a `dropout_tags` függvény használatos a tokenek véletlenszerű kiejtésére a megadott kiejtési ráta alapján.
- **Tokenek Keverése**: Ha a `shuffle_caption` `True`-ra van állítva a subset-ben, a függvény összekeveri a rugalmas tokenek sorrendjét. Ez a véletlenszerűsítés segíthet a modellnek elkerülni, hogy olyan mintákat tanuljon, amelyek a szavak sorrendjén alapulnak, ami esetleg nem releváns.
- **Token Kombinálás**: A végső felirat a `fixed_tokens`, `flex_tokens` és `fixed_suffix_tokens` kombinálásával jön létre, vesszővel elválasztva.
- **Másodlagos Elválasztó Cseréje**: Ha egy `secondary_separator` van definiálva, az lecserélődik az elsődleges `caption_separator`-ra a végső feliratban.

A kód ezen része biztosítja, hogy a felirat dinamikusan módosuljon a subset beállításai szerint, potenciálisan beleértve a véletlenszerűsítést és bizonyos tokenek szelektív megtartását.

## Szöveges Inverzió Helyettesítések

A függvény szöveges inverzió helyettesítéseket is alkalmaz, ami magában foglalja specifikus karakterláncok cseréjét előre definiált helyettesítésekre a feliratban. Ezek a helyettesítések a self.replacements szótárban tárolódnak, ahol a kulcsok a helyettesítendő karakterláncok és az értékek a megfelelő helyettesítések.

Ha a kulcs a `self.replacements` szótárban egy üres karakterlánc, a teljes felirat lecserélődik egy véletlenszerű választásra a helyettesítések listájából (ha az érték egy lista) vagy magára a helyettesítő karakterláncra. Egyébként a kulcs karakterlánc minden előfordulása a feliratban lecserélődik a megfelelő helyettesítési értékre.

Az összes ilyen transzformáció alkalmazása után a feldolgozott felirat visszaadódik a függvény által.

Alább található a függvény kommentezett verziója az sd-scripts-ből.

```python
def process_caption(self, subset: BaseSubset, caption: str) -> str:
    """
    Feldolgoz egy feliratot a subset-ben definiált különböző paraméterek alapján.

    A módszer előtagokat és utótagokat alkalmaz, kezeli a kiejtést a felirat törlésével vagy megtartásával,
    feldolgozza a helyettesítő karaktereket, keveri a tokeneket és alkalmazza a szöveges inverzió helyettesítéseket.
    Kezeli a többsoros feliratokat is, vagy egy véletlenszerű sor választásával (ha a helyettesítő karakterek engedélyezve vannak)
    vagy az első sor használatával.

    Paraméterek:
    - subset (BaseSubset): Egy objektum, amely különböző beállításokat tartalmaz a felirat feldolgozásához.
    - caption (str): A kezdeti felirat szöveg, amit fel kell dolgozni.

    Visszatérési érték:
    - str: A feldolgozott felirat az összes transzformáció alkalmazása után.
    """

    # Előtag és utótag hozzáadása a felirathoz, ha definiálva vannak.
    if subset.caption_prefix:
        caption = subset.caption_prefix + " " + caption
    if subset.caption_suffix:
        caption = caption + " " + subset.caption_suffix

    # Annak meghatározása, hogy a feliratot ki kell-e ejteni a kiejtési ráta és epoch beállítások alapján.
    is_drop_out = subset.caption_dropout_rate > 0 and random.random() < subset.caption_dropout_rate
    is_drop_out = (
        is_drop_out
        or (subset.caption_dropout_every_n_epochs > 0
            and self.current_epoch % subset.caption_dropout_every_n_epochs == 0)
    )

    # Ha a kiejtési feltétel teljesül, töröljük a feliratot.
    if is_drop_out:
        caption = ""
    else:
        # Helyettesítő karakterek feldolgozása, ha engedélyezve van.
        if subset.enable_wildcard:
            # Ha a feliratnak több sora van, véletlenszerűen választunk egyet.
            if "\n" in caption:
                caption = random.choice(caption.split("\n"))

            # Escapelt kapcsos zárójelek kezelése.
            replacer1 = "⦅"
            replacer2 = "⦆"
            while replacer1 in caption or replacer2 in caption:
                replacer1 += "⦅"
                replacer2 += "⦆"

            caption = caption.replace("{{", replacer1).replace("}}", replacer2)

            # Függvény a helyettesítő karakterek véletlenszerű választással való cseréjéhez.
            def replace_wildcard(match):
                return random.choice(match.group(1).split("|"))

            # Helyettesítő karakterek cseréje véletlenszerű választással az opciókból.
            caption = re.sub(r"\{([^}]+)\}", replace_wildcard, caption)

            # Kapcsos zárójelek visszaállítása.
            caption = caption.replace(replacer1, "{").replace(replacer2, "}")
        else:
            # Ha a helyettesítő karakterek nincsenek engedélyezve és a felirat többsoros, használjuk az első sort.
            caption = caption.split("\n")[0]

        # Tokenek keverése, token bemelegítés alkalmazása és címkék kiejtése, ha meg van adva.
        if subset.shuffle_caption or subset.token_warmup_step > 0 or subset.caption_tag_dropout_rate > 0:
            fixed_tokens = []
            flex_tokens = []
            fixed_suffix_tokens = []

            # A felirat felosztása fix és rugalmas részekre, ha van definiálva elválasztó.
            if (hasattr(subset, "keep_tokens_separator") and subset.keep_tokens_separator
                    and subset.keep_tokens_separator in caption):
                fixed_part, flex_part = caption.split(subset.keep_tokens_separator, 1)
                if subset.keep_tokens_separator in flex_part:
                    flex_part, fixed_suffix_part = flex_part.split(subset.keep_tokens_separator, 1)
                    fixed_suffix_tokens = [t.strip() for t in fixed_suffix_part.split(subset.caption_separator) if t.strip()]

                fixed_tokens = [t.strip() for t in fixed_part.split(subset.caption_separator) if t.strip()]
                flex_tokens = [t.strip() for t in flex_part.split(subset.caption_separator) if t.strip()]
            else:
                # Ha nincs definiálva elválasztó, minden tokent rugalmasnak tekintünk.
                tokens = [t.strip() for t in caption.strip().split(subset.caption_separator)]
                flex_tokens = tokens[:]
                if subset.keep_tokens > 0:
                    fixed_tokens = flex_tokens[: subset.keep_tokens]
                    flex_tokens = tokens[subset.keep_tokens:]

            # A megtartandó tokenek számának kiszámítása a bemelegítési lépés alapján.
            if subset.token_warmup_step < 1:
                subset.token_warmup_step = math.floor(subset.token_warmup_step * self.max_train_steps)
            if subset.token_warmup_step and self.current_step < subset.token_warmup_step:
                tokens_len = (
                    math.floor(
                        (self.current_step) * ((len(flex_tokens) - subset.token_warmup_min) / (subset.token_warmup_step))
                    )
                    + subset.token_warmup_min
                )
                flex_tokens = flex_tokens[:tokens_len]

            # Függvény a címkék kiejtésére a kiejtési ráta alapján.
            def dropout_tags(tokens):
                if subset.caption_tag_dropout_rate <= 0:
                    return tokens
                return [token for token in tokens if random.random() >= subset.caption_tag_dropout_rate]

            # Rugalmas tokenek keverése, ha meg van adva.
            if subset.shuffle_caption:
                random.shuffle(flex_tokens)

            # Címke kiejtés alkalmazása a rugalmas tokenekre.
            flex_tokens = dropout_tags(flex_tokens)

            # A fix, rugalmas és fix utótag tokenek kombinálása a végső feliratba.
            caption = ", ".join(fixed_tokens + flex_tokens + fixed_suffix_tokens)

        # A másodlagos elválasztó cseréje az elsődlegesre, ha definiálva van.
        if subset.secondary_separator:
            caption = caption.replace(subset.secondary_separator, subset.caption_separator)

        # Szöveges inverzió helyettesítések alkalmazása.
        for str_from, str_to in self.replacements.items():
            if str_from == "":
                # Ha a helyettesítő karakterlánc üres, cseréljük le az egész feliratot.
                caption = random.choice(str_to) if type(str_to) == list else str_to
            else:
                # Specifikus karakterláncok cseréje a megfelelő helyettesítésekre.
                caption = caption.replace(str_from, str_to)

    return caption
``` 