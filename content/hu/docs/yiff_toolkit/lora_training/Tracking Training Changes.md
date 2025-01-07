---
title: "Tanítási Változások Követése"
description: "Útmutató a LoRA tanítás során történő változások követéséhez automatizált szkriptek segítségével"
summary: "Ismerje meg, hogyan használhat automatizált szkripteket a LoRA tanítási folyamat rendszerezéséhez és követéséhez, beleértve a modellverziók kezelését, a konfigurációk biztonsági mentését és a tiszta tanítási munkakörnyezet fenntartását."
weight: 8
bookToC: false
bookFlatSection: false
aliases:
  - /hu/docs/yiff_toolkit/lora_training/Tracking-Training-Changes/
  - /hu/docs/yiff_toolkit/lora_training/Tracking-Training-Changes
  - /hu/docs/yiff_toolkit/lora_training/Tracking_Training_Changes/
  - /hu/docs/yiff_toolkit/lora_training/Tracking_Training_Changes
  - "/hu/docs/yiff_toolkit/lora_training/Tracking Training Changes/"
  - "/hu/docs/yiff_toolkit/lora_training/Tracking Training Changes"
---

## Áttekintés

A LoRA tanítása során kulcsfontosságú a tanítási konfigurációk, modellverziók és változások nyomon követése. Ez az útmutató elmagyarázza, hogyan használhatók az automatizált szkriptek a tanítás során történő változások követésére.

## A Tanítási Szkript

Az alább bemutatott tanítási szkript több fontos követési szempontot kezel. Nyilvántartja a Git repository állapotát a kódváltozások és verziók időbeli követéséhez. A szkript emellett megőrzi a tanítási konfigurációkat a kulcsfontosságú fájlok biztonsági mentésével, biztosítva, hogy később hivatkozhass és reprodukálhasd a tanítási beállításokat. Továbbá menti a tanítás során használt minta promptokat későbbi referencia céljából. A munkaterület rendezettségének érdekében a szkript automatikusan eltávolítja a sikertelen tanítási futtatások kimeneti könyvtárait.

Íme, hogyan kell használni:

```zsh
#!/usr/bin/env zsh
NAME=your-model-name-v1s2400
TRAINING_DIR="/path/to/your/dataset"
# Opcionális: Lépések felülírása a névből
# STEPS=2400
# Opcionális: Kimeneti könyvtár felülírása
# OUTPUT_DIR="/custom/output/path"

# Segédfüggvények betöltése
source "$HOME/toolkit/zsh/train_functions.zsh"

# Tanítási argumentumok itt...
args=(
    --pretrained_model_name_or_path="/path/to/base/model.safetensors"
    # ... egyéb argumentumok ...
)

# Környezet és változók beállítása
setup_training_vars "$NAME"
setup_conda_env "sdscripts"

# Commit hash-ek tárolása és konfigurációk másolása
store_commits_hashes "$SD_REPO" "$LYCORIS_REPO"

# Tanítás futtatása
run_training_script "/path/to/train_network.py" "${args[@]}"
```

## Mit Követ a Rendszer

A szkript automatikusan követi a tanítási folyamat több kulcsfontosságú aspektusát. A Git repository állapotok esetében rögzíti mind a tanítási szkript repository, mind a LyCORIS repository commit hash-eit, lehetővé téve a pontos kódverziók későbbi hivatkozását.

A szkript kezeli a fontos tanítási fájlokat is a konfigurációk másolásával. Hash-eket készít a tanítási konfigurációs fájlról (`config.toml`), menti a tanítás során használt minta promptokat a `sample-prompts.txt` fájlba, és megőrzi magának a tanítási szkriptnek a másolatát is későbbi referencia céljából.

A munkaterület rendezettségének érdekében a szkript automatikus tisztítási funkcióval rendelkezik. Figyeli a sikertelen tanítási futtatásokat és eltávolítja azok kimeneti könyvtárait, biztosítva, hogy a munkaterület tiszta és kezelhető maradjon az idő múlásával.

## Segédfüggvények

A szkript több segédfüggvényre támaszkodik:

### `setup_training_vars`

A `setup_training_vars` függvény kezeli a folyamathoz szükséges alapvető tanítási változókat. Kinyeri mind az adatkészlet nevét, mind a lépések számát a megadott modellnévből. Emellett létrehozza és konfigurálja a szükséges kimeneti könyvtárakat, miközben ellenőrzi, hogy a megadott tanítási könyvtár létezik-e.

### `setup_conda_env`

Ez a függvény kezeli a Conda környezet beállításának minden aspektusát. Kezeli a megadott környezet aktiválását, ellenőrzi, hogy a környezet valóban létezik-e, és elvégzi a Conda inicializálását az aktuális shell munkamenethez.

### `store_commits_hashes`

A `store_commits_hashes` függvény felelős a Git repository-k állapotának követéséért. Rögzíti a repository-k commit hash-eit, másolatokat készít minden releváns konfigurációs fájlról, és SHA-1 hash-eket generál a követéshez.

### `cleanup_empty_output`

Ez a tisztító függvény segít a munkaterület rendezettségének fenntartásában a sikertelen tanítási futtatások kimeneti könyvtárainak eltávolításával. Intelligensen megőrzi a mintákat vagy modelleket tartalmazó könyvtárakat, miközben eltávolítja az üreseket. Azokban az esetekben, amikor ez az automatikus tisztítás nem kívánatos, kikapcsolható a `NO_CLEAN=1` beállításával.

## Legjobb Gyakorlatok

1. **Elnevezési Konvenció**: Használj következetes névformátumot:

   ```bash
   {model}-{dataset}-v{version}s{steps}
   ```

   Példa: `noob-surrounded_by_penis-v1s2400`

2. **Könyvtárszerkezet**:

   ```bash
   datasets/
   ├── dataset_name/
   │   ├── config.toml
   │   └── sample-prompts.txt
   output_dir/
   └── model_name/
       ├── repos.git
       ├── config.toml
       ├── sample-prompts.txt
       └── training_script.sh
   ```

3. **Verziókezelés**: Mindig Git repository-ban dolgozz:
   - Tanítási szkriptek
   - Adatkészlet konfigurációk
   - Egyedi tanítási kód

4. **Dokumentáció**: Tartsd nyilván:
   - A jól működő tanítási paramétereket
   - A sikertelen kísérleteket és azok okait
   - A modell teljesítményével kapcsolatos megfigyeléseket

A hibakeresési kimenet engedélyezhető:

```bash
DEBUG=1 ./your_training_script.sh
```

## További Tippek

A hatékony verziókezelés érdekében mindig Git repository-ban dolgozz a tanítási szkriptekkel, adatkészlet konfigurációkkal és az egyedi tanítási kóddal. Az új tanítási futtatások megkezdése előtt commitold a változtatásokat a tanítási szkriptekben, hogy biztosítsd a reprodukálhatóságot.

Vezess részletes jegyzeteket a tanítási folyamatról, beleértve a jól működő paramétereket, a sikertelen kísérleteket és azok okait, valamint a modell teljesítményével kapcsolatos megfigyeléseket. Ez segít a későbbi optimalizálásban és a hibák elkerülésében.

A hosszú távú megőrzés érdekében rendszeresen készíts biztonsági mentést a tanítási konfigurációkról, minta promptokról és Git repository-król. A kísérletek hatékony követéséhez érdemes további eszközöket is használni, mint például a TensorBoard a tanítási metrikák vizualizálásához, a Git LFS a nagy fájlok kezeléséhez, vagy külső kísérlet követő platformokat a teljes folyamat dokumentálásához.

---

---

{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/ | docs/yiff_toolkit/lora_training_guide/" >}}
