---
weight: 2
bookFlatSection: false
bookToC: false
title: "select_bucket"
aliases:
  - /hu/docs/yiff_toolkit/lora_training/select-bucket/
  - /hu/docs/yiff_toolkit/lora_training/select-bucket
  - /hu/docs/yiff_toolkit/lora_training/select_bucket/
  - /hu/docs/yiff_toolkit/lora_training/select_bucket
---

<!--markdownlint-disable MD025 -->

# `select_bucket`

---

A `select_bucket` függvény felelős egy bemeneti kép megfelelő felbontásának (méretének) meghatározásáért, előre definiált felbontások és képarányok, valamint a kép számára megengedett maximális terület alapján. A függvény két argumentumot vesz át: `image_width` és `image_height`, amelyek a bemeneti kép méreteit reprezentálják.

Íme a függvény logikájának részletes magyarázata:

1. Kiszámítja a bemeneti kép képarányát az `image_width` és `image_height` hányadosaként.

2. Ha a `no_upscale` értéke False, a függvény megpróbál találni egy olyan előre definiált felbontást, amely megegyezik vagy közel áll a bemeneti kép képarányához. Így működik:

   a. Ha a bemeneti kép felbontása már szerepel az előre definiált felbontások halmazában (`self.predefined_resos_set`), változatlanul hagyja a felbontást.

   b. Ha nem, kiszámítja a különbséget a bemeneti képarány és az összes előre definiált képarány (`self.predefined_aspect_ratios`) között. Ezután kiválasztja azt az előre definiált felbontást, amelynek a legkisebb a képarány különbsége (`predefined_bucket_id`).

   c. A kiválasztott előre definiált felbontás (`reso`) alapján meghatározza a méretezési tényezőt a bemeneti kép átméretezéséhez. Ha a bemeneti képarány nagyobb, mint az előre definiált képarány, az előre definiált felbontás magasságához igazítja. Ellenkező esetben a szélességhez igazítja.

   d. Az átméretezett méretek (`resized_size`) kiszámítása a bemeneti méretek és a méretezési tényező szorzatának legközelebbi egészre kerekítésével történik.

3. Ha a `no_upscale` értéke True, a függvény csak a kép csökkentését (lekicsinyítését) végzi:

   a. Ha a bemeneti kép területe (`image_width * image_height`) meghaladja a megengedett maximális területet (`self.max_area`), kiszámítja az átméretezett méreteket (`resized_width` és `resized_height`) úgy, hogy megőrzi a képarányt, miközben biztosítja, hogy a terület nem haladja meg a `self.max_area` értéket.

   b. Ezután kerekíti az átméretezett méreteket a `self.reso_steps` (előre definiált felbontási lépésköz) legközelebbi többszörösére. Ez úgy történik, hogy azt a kerekítést választja, amely a legközelebb áll az eredeti képarányhoz.

   c. A végső átméretezett méretek (`resized_size`) a kerekített értékekre állítódnak be.

   d. Ha a bemeneti kép területe nem haladja meg a `self.max_area` értéket, a függvény a `resized_size` értékét az eredeti bemeneti méretekre állítja, mivel nincs szükség átméretezésre.

   e. A függvény ezután kiszámítja a bucket felbontást (`reso`) úgy, hogy megkeresi a legnagyobb olyan méreteket, amelyek a `self.reso_steps` többszörösei és kisebbek vagy egyenlőek az átméretezett méretekkel.

4. A függvény hozzáadja a kiválasztott felbontást (`reso`) az egyedi felbontások halmazához (`self.add_if_new_reso(reso)`).

5. Végül kiszámítja a kiválasztott felbontás és az eredeti képarány közötti hibát (`ar_error`), és visszaadja a `(reso, resized_size, ar_error)` tuple-t.

A `get_crop_ltrb` függvény, amely egy statikus metódus, kiszámítja a bal, felső, jobb és alsó koordinátákat egy kép kivágásához, hogy illeszkedjen egy adott bucket felbontáshoz. Két argumentumot vesz át: `bucket_reso` (a célzott felbontás) és `image_size` (az eredeti képméret). A függvény meghatározza, hogy a bucket felbontás magasságához vagy szélességéhez igazodjon-e a képarányok alapján, kiszámítja az átméretezett méreteket, majd kiszámítja a kivágási koordinátákat a bucket felbontás és az átméretezett méretek közötti különbség alapján.

## Forráskód

---

```python
def select_bucket(self, image_width, image_height):
    aspect_ratio = image_width / image_height
    if not self.no_upscale:
        # Nagyítás és kicsinyítés végrehajtása
        # Prioritást ad az azonos felbontásnak, mert lehet ugyanaz a képarány
        # (finomhangolás esetén no_upscale=True előfeldolgozással)
        reso = (image_width, image_height)
        if reso in self.predefined_resos_set:
            pass
        else:
            ar_errors = self.predefined_aspect_ratios - aspect_ratio
            predefined_bucket_id = np.abs(ar_errors).argmin()  # A felbontáson kívül a legkisebb képarány hibával rendelkező
            reso = self.predefined_resos[predefined_bucket_id]

        ar_reso = reso[0] / reso[1]
        if aspect_ratio > ar_reso:  # Ha a szélesség hosszabb, a magassághoz igazítjuk
            scale = reso[1] / image_height
        else:
            scale = reso[0] / image_width

        resized_size = (int(image_width * scale + 0.5), int(image_height * scale + 0.5))
        # logger.info(f"use predef, {image_width}, {image_height}, {reso}, {resized_size}")
    else:
        # Csak kicsinyítés végrehajtása
        if image_width * image_height > self.max_area:
            # Ha a kép túl nagy, a bucket-et úgy határozzuk meg, hogy csökkentjük a képarányt megtartva
            resized_width = math.sqrt(self.max_area * aspect_ratio)
            resized_height = self.max_area / resized_width
            assert abs(resized_width / resized_height - aspect_ratio) < 1e-2, "a képarány illegális"

            # Az átméretezés után a rövid vagy hosszú oldalt a reso_steps többszörösévé tesszük: azt választjuk, amelyiknek kisebb a képarány különbsége
            # Ugyanaz a logika, mint az eredeti bucketingnél
            b_width_rounded = self.round_to_steps(resized_width)
            b_height_in_wr = self.round_to_steps(b_width_rounded / aspect_ratio)
            ar_width_rounded = b_width_rounded / b_height_in_wr

            b_height_rounded = self.round_to_steps(resized_height)
            b_width_in_hr = self.round_to_steps(b_height_rounded * aspect_ratio)
            ar_height_rounded = b_width_in_hr / b_height_rounded

            # logger.info(b_width_rounded, b_height_in_wr, ar_width_rounded)
            # logger.info(b_width_in_hr, b_height_rounded, ar_height_rounded)

            if abs(ar_width_rounded - aspect_ratio) < abs(ar_height_rounded - aspect_ratio):
                resized_size = (b_width_rounded, int(b_width_rounded / aspect_ratio + 0.5))
            else:
                resized_size = (int(b_height_rounded * aspect_ratio + 0.5), b_height_rounded)
            # logger.info(resized_size)
        else:
            resized_size = (image_width, image_height)  # Nincs szükség átméretezésre

        # A kép méretét a bucket méreténél kisebbé tesszük (kivágás kitöltés nélkül)
        bucket_width = resized_size[0] - resized_size[0] % self.reso_steps
        bucket_height = resized_size[1] - resized_size[1] % self.reso_steps
        # logger.info(f"use arbitrary {image_width}, {image_height}, {resized_size}, {bucket_width}, {bucket_height}")

        reso = (bucket_width, bucket_height)

    self.add_if_new_reso(reso)

    ar_error = (reso[0] / reso[1]) - aspect_ratio
    return reso, resized_size, ar_error

@staticmethod
def get_crop_ltrb(bucket_reso: Tuple[int, int], image_size: Tuple[int, int]):
    # A bal/felső kivágás kiszámítása a Stability AI előfeldolgozása szerint. A jobb oldali kivágás a tükrözési augmentációhoz számítódik.

    bucket_ar = bucket_reso[0] / bucket_reso[1]
    image_ar = image_size[0] / image_size[1]
    if bucket_ar > image_ar:
        # Ha a bucket szélesebb, a magassághoz igazítjuk
        resized_width = bucket_reso[1] * image_ar
        resized_height = bucket_reso[1]
    else:
        resized_width = bucket_reso[0]
        resized_height = bucket_reso[0] / image_ar
    crop_left = (bucket_reso[0] - resized_width) // 2
    crop_top = (bucket_reso[1] - resized_height) // 2
    crop_right = crop_left + resized_width
    crop_bottom = crop_top + resized_height
    return crop_left, crop_top, crop_right, crop_bottom


class BucketBatchIndex(NamedTuple):
    bucket_index: int
    bucket_batch_size: int
    batch_index: int
```

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/dataset_tools/Check for Large Images/ | docs/yiff_toolkit/dataset_tools/furrytagger" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
