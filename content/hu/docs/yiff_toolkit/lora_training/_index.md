---
weight: 1
bookFlatSection: false
bookToC: true
title: "LoRA Betanítási Útmutató"
summary: "A LoRA Betanítási Útmutató bemutatja az Alacsony Rangú Adaptációt (LoRA), egy technikát a nagy nyelvi és diffúziós modellek hatékony finomhangolására kis, betanítható alacsony rangú mátrixok bevezetésével az összes modellparaméter módosítása helyett. Ez a megközelítés az eredeti modell súlyait változatlanul hagyja, és két további mátrixot illeszt be minden rétegbe a szükséges módosítások megtanulásához. A LoRA könnyűsúlyú, így több adaptáció betanítása is megvalósítható nagy tárolási követelmények nélkül. Az útmutató összehasonlítja a LoRA-t a LyCORIS-szal, egy fejlett kiterjesztéssel, amely több irányítást és rugalmasságot kínál, és bemutatja a LoKr-t, amely Kronecker-szorzatokat használ a mátrix felbontásához, javítva a memóriahatékonyságot és az adaptációs folyamat irányítását."
aliases:
  - /hu/docs/yiff_toolkit/lora_training/
  - /hu/docs/yiff_toolkit/lora_training
  - /hu/docs/yiff_toolkit/Lora Training/
  - /hu/docs/yiff_toolkit/Lora Training
  - /hu/docs/yiff_toolkit/lora training
  - /hu/docs/yiff_toolkit/lora training/
  - /hu/docs/yiff_toolkit/lora_training_guide/
  - /hu/docs/yiff_toolkit/lora_training_guide
  - /hu/docs/yiff_toolkit/Lora Training Guide/
  - /hu/docs/yiff_toolkit/Lora Training Guide
---

<!--markdownlint-disable MD025 MD033 MD034 -->

# LoRA Betanítási Útmutató

---

## Mik azok a LoRA-k?

---

A LoRA (Low-Rank Adaptation - Alacsony Rangú Adaptáció) egy olyan technika, amelyet nagy méretű nyelvi és diffúziós modellek hatékony finomhangolására terveztek. Ahelyett, hogy a teljes modellparaméter-készletet átdolgoznák - ami milliárdos nagyságrendű lehet - a LoRA kis méretű, betanítható "alacsony rangú" mátrixokat vezet be a modell viselkedésének adaptálására. Ezt az innovatív megközelítést a Microsoft kutatói részletezték a ["LoRA: Low-Rank Adaptation of Large Language Models"](https://arxiv.org/abs/2106.09685) című tanulmányukban.

## Alszekciók

---

{{< section details >}}

## Telepítési Tippek

---

Először töltsd le kohya_ss [sd-scripts](https://github.com/kohya-ss/sd-scripts) csomagját. A környezetet vagy úgy kell beállítanod, ahogy [itt](https://github.com/kohya-ss/sd-scripts?tab=readme-ov-file#windows-installation) le van írva Windows esetén, vagy ha Linuxot vagy Minicondát használsz Windowson, valószínűleg elég okos vagy, hogy magadtól is rájöjj a telepítésre. Mindig ajánlott a legújabb [PyTorch](https://pytorch.org/get-started/locally/) verziót telepíteni abba a virtuális környezetbe, amit használni fogsz - ami jelenleg a `2.2.2`. Remélem a jövőbeli énemnek gyorsabb PyTorch-a lesz!

Na jó, arra az esetre, ha mégsem lennél elég okos az sd-scripts Miniconda alatti telepítéséhez Windowson, nemrég "segítettem" valakinek, így el tudom mondani:

```bash
# sd-scripts telepítése
git clone https://github.com/kohya-ss/sd-scripts
cd sd-scripts

# Conda környezet létrehozása és követelmények telepítése
conda create -n sdscripts python=3.10.14
conda activate sdscripts
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
python -m pip install --use-pep517 --upgrade -r requirements.txt
python -m pip install --use-pep517 lycoris_lora
accelerate config
```

Az `accelerate config` több kérdést fog feltenni, mindegyiket el kell olvasnod és az igazat kell válaszolnod. A legtöbb esetben az igazság így néz ki: `This machine, No distributed training, no, no, no, all, fp16`.

Lehet, hogy telepíteni szeretnéd az `xformers`-t vagy a `bitsandbytes`-t is.

```bash
# xformers telepítése
# Használd ugyanezt a parancsot, csak cseréld ki az 'xformers'-t bármilyen más csomagra, amire szükséged van
python -m pip install --use-pep517 xformers

# bitsandbytes telepítése windowsra
python -m pip install --use-pep517 bitsandbytes --index-url=https://jllllll.github.io/bitsandbytes-windows-webui
```

---

### Pony Betanítás

---

Nem hazudok, kicsit bonyolult mindent elmagyarázni. De itt van a legjobb próbálkozásom, hogy végigmenjek néhány "alapvető" dolgon és szinte minden soron sorrendben.

#### Pony Letöltése Diffusers Formátumban

A betanításhoz a diffusers verziót használom, amit én konvertáltam, letöltheted `git` segítségével.

```bash
git clone https://huggingface.co/k4d3/ponydiffusers
```

---

#### Minta Prompt Fájl

A betanítás során egy minta prompt fájlt használunk képek mintavételezéséhez. Egy minta prompt például így nézhet ki Pony esetében:

```py
# anthro female kindred
score_9, score_8_up, score_7_up, score_6_up, rating_explicit, source_furry, solo, female anthro kindred, mask, presenting, white pillow, bedroom, looking at viewer, detailed background, amazing_background, scenery porn, realistic, photo --n low quality, worst quality, blurred background, blurry, simple background --w 1024 --h 1024 --d 1 --l 6.0 --s 40
# anthro female wolf
score_9, score_8_up, score_7_up, score_6_up, rating_explicit, source_furry, solo, anthro female wolf, sexy pose, standing, gray fur, brown fur, canine pussy, black nose, blue eyes, pink areola, pink nipples, detailed background, amazing_background, realistic, photo --n low quality, worst quality, blurred background, blurry, simple background --w 1024 --h 1024 --d 1 --l 6.0 --s 40
```

Kérlek vedd figyelembe, hogy a minta promptok nem haladhatják meg a 77 tokent, használhatod a [Count Tokens in Sample Prompts](https://huggingface.co/k4d3/yiff_toolkit/blob/main/dataset_tools/Count%20Tokens%20in%20Sample%20Prompts.ipynb) eszközt a [/dataset_tools](https://huggingface.co/k4d3/yiff_toolkit/tree/main/dataset_tools) mappából a promptjaid elemzéséhez.

Ha több GPU-val tanítasz, győződj meg róla, hogy a promptok teljes száma maradék nélkül osztható a GPU-k számával, különben egy kártya tétlen marad.

---

#### Betanítási Parancsok

---

##### `accelerate launch`

Két GPU esetén:

```python
accelerate launch --num_processes=2 --multi_gpu --num_machines=1 --gpu_ids=0,1 --num_cpu_threads_per_process=2  "./sdxl_train_network.py"
```

Egy GPU esetén:

```python
accelerate launch --num_cpu_threads_per_process=2 "./sdxl_train_network.py"
```

---

&nbsp;

És most nézzük át az `sd-scripts`-nek átadható paramétereket.

&nbsp;

##### `--lowram`

Ha kifutsz a rendszermemóriából, mint ahogy én is 2 GPU-val és egy nagyon nagy modellel, ami GPU-nként betöltődik, ez az opció segít spórolni egy kicsit és kimenthet az OOM pokolból.

---

##### `--pretrained_model_name_or_path`

A letöltött checkpoint könyvtára. Javaslom, hogy zárd le az elérési utat egy `/`-rel, ha helyi diffusers modellt használsz. Megadhatsz `.safetensors` vagy `.ckpt` fájlt is, ha olyan van!

```python
    --pretrained_model_name_or_path="/ponydiffusers/"
```

---

##### `--output_dir`

Itt kerülnek mentésre az összes mentett epoch vagy lépés, beleértve az utolsót is.

```python
    --output_dir="/output_dir"
```

---

##### `--train_data_dir`

Az adatkészletet tartalmazó könyvtár. Ezt korábban együtt készítettük elő.

```python
    --train_data_dir="/training_dir"
```

---

##### `--resolution`

Mindig állítsd be a modell felbontásának megfelelően, ami Pony esetében 1024x1024. Ha nem fér bele a VRAM-ba, végső megoldásként csökkentheted `512,512`-re.

```python
    --resolution="1024,1024"
```

---

##### `--enable_bucket`

Különböző tárolókat hoz létre a különböző képarányú képek előzetes kategorizálásával. Ez a technika segít elkerülni az olyan problémákat, mint a természetellenes vágások, amelyek gyakran előfordulnak, amikor a modelleket négyzet alakú képek előállítására tanítják. Ez lehetővé teszi olyan kötegek létrehozását, ahol minden elem azonos méretű, de a kötegek képmérete különbözhet.

---

##### `--bucket_no_upscale`

A hálózat által feldolgozott képek felbontását befolyásolja a képek felskálázásának letiltásával. Ha ez az opció be van állítva, a hálózat csak akkor fogja lekicsinyíteni a képeket, hogy beleférjenek a `self.max_area` által meghatározott maximális területbe, ha a kép $szélesség \times magasság$ értéke meghaladja ezt az értéket.

1. A `select_bucket` függvény ellenőrzi, hogy szükséges-e a lekicsinyítés: Ha a `image_width` és `image_height` szorzata nagyobb, mint a `self.max_area`, akkor a kép túl nagy, és le kell kicsinyíteni a képarány megtartása mellett.
2. Ezután kiszámítja azt a szélességet és magasságot, amelyre a képet át kell méretezni úgy, hogy az átméretezett kép területe ne haladja meg a `self.max_area` értéket, és a képarány megmaradjon.
3. A `round_to_steps` függvény a kerekítéshez használatos, amely az átméretezett dimenziókat a `self.reso_steps` legközelebbi többszörösére kerekíti, ami egy paraméter, amely meghatározza a felbontási tárolók lépésközét.
4. A kód összehasonlítja a szélesség és magasság képarányát a kerekítés után, hogy eldöntse, melyik dimenziót részesítse előnyben az átméretezés utáni képarány-hiba minimalizálása érdekében.
5. A kisebb képarány-hiba alapján kiválasztja azokat az átméretezett dimenziókat, amelyek a legjobban megőrzik a kép eredeti képarányát.

Összefoglalva, a `select_bucket` függvény biztosítja, hogy amikor lekicsinyítésre van szükség, a kép olyan dimenziókra legyen átméretezve, amelyek a felbontási lépésköz (`self.reso_steps`) többszörösei, és a lehető legközelebb állnak az eredeti képarányhoz, anélkül, hogy meghaladnák a megengedett maximális területet (`self.max_area`). **A felskálázás nem történik meg, ha a** `--bucket_no_upscale` **be van állítva.**

---

##### `--min_bucket_reso` és `--max_bucket_reso`

Meghatározza a tárolók által használt minimális és maximális felbontásokat. Ezek az értékek figyelmen kívül maradnak, ha a `--bucket_no_upscale` be van állítva.

```python
    --min_bucket_reso=256 --max_bucket_reso=1024
```

---

##### `--network_alpha`

Meghatározza, hogy a betanított Hálózati Rangok közül hány módosíthatja az alapmodellt.

```python
    --network_alpha=4
```

---

##### `--save_model_as`

Használhatod ezt a `ckpt` vagy `safetensors` fájlformátum megadásához.

```python
    --save_model_as="safetensors"
```

---

##### `--network_module`

Meghatározza, hogy melyik hálózati modult fogod betanítani.

```python
    --network_module="lycoris.kohya"
```

---

##### `--network_args`

A hálózatnak átadott argumentumok.

```python
    --network_args \
               "use_reentrant=False" \
               "preset=full" \
               "conv_dim=256" \
               "conv_alpha=4" \
               "use_tucker=False" \
               "use_scalar=False" \
               "rank_dropout_scale=False" \
               "algo=locon" \
               "train_norm=False" \
               "block_dims=8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8" \
               "block_alphas=0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625" \
```

**Nézzük meg részletesen!**

---

###### `preset`

A LyCORIS-hoz hozzáadott [Preset](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Preset.md)/konfiguráció rendszer a finomabb irányítás érdekében.

- `full`
  - alapértelmezett preset, az UNet és CLIP összes rétegét betanítja.
- `full-lin`
  - `full`, de kihagyja a konvolúciós rétegeket.
- `attn-mlp`
  - "kohya preset", az összes transformer blokkot betanítja.
- `attn-only`
  - csak a figyelmi réteg lesz betanítva, sok tanulmány csak a figyelmi réteget tanítja.
- `unet-transformer-only`
  - ugyanaz, mint a kohya_ss/sd_scripts kikapcsolt TE-vel, vagy az attn-mlp preset engedélyezett train_unet_only-val.
- `unet-convblock-only`
  - csak a ResBlock, UpSample, DownSample lesz betanítva.

---

###### `conv_dim` és `conv_alpha`

A konvolúciós dimenziók a modell konvolúciójának rangjához kapcsolódnak. Ennek az értéknek a módosítása [jelentős hatással](https://ashejunius.com/alpha-and-dimensions-two-wild-settings-of-training-lora-in-stable-diffusion-d7ad3e3a3b0a) lehet, és csökkentése befolyásolta a különböző LoRA minták közötti esztétikai különbségeket. Egy karakter arcának betanításához `128`-as alfa értéket használtak, míg Kohaku azt javasolta, hogy ezt állítsuk `1`-re mind a LoCon, mind a LoHa esetében.

```python
conv_block_dims = [conv_dim] * num_total_blocks
conv_block_alphas = [conv_alpha] * num_total_blocks
```

---

###### `module_dropout` és `dropout` és `rank_dropout`

{{< responsive-svg src="/svg/dropout.svg" alt="Dropout a neurális hálózatokban" >}}

A `rank_dropout` a dropout egy formája, amely egy szabályozási technika a neurális hálózatokban a túltanulás megakadályozására és az általánosítás javítására. Azonban a hagyományos dropouttal ellentétben, amely véletlenszerűen nullára állítja a bemenetek egy részét, a `rank_dropout` az `lx` bemeneti tenzor rangján működik. Először egy bináris maszk jön létre ugyanazzal a ranggal, mint az `lx`, ahol minden elem `True` értékű `1 - rank_dropout` valószínűséggel és `False` egyébként. Ezután a `mask` alkalmazásra kerül az `lx`-re, hogy véletlenszerűen nullára állítson néhány elemet. A dropout alkalmazása után egy skálázási tényező kerül alkalmazásra az `lx`-re, hogy kompenzálja a kiejtett elemeket. Ez azért történik, hogy biztosítsa, hogy az `lx` várható összege ugyanaz maradjon a dropout előtt és után. A skálázási tényező `1.0 / (1.0 - self.rank_dropout)`.

Azért hívják "rang" dropoutnak, mert a bemeneti tenzor rangján működik, nem pedig az egyes elemein. Ez különösen hasznos lehet olyan feladatoknál, ahol a bemenet rangja fontos.

Ha a `rank_dropout` értéke `0`, az azt jelenti, hogy nem kerül alkalmazásra dropout az `lx` bemeneti tenzor rangján. A maszk minden eleme `True` értékű lenne, és amikor a maszk alkalmazásra kerül az `lx`-re, minden eleme megmaradna, és amikor a skálázási tényező alkalmazásra kerül a dropout után, az értéke egyenlő lenne a `self.scale`-lel, mert `1.0 / (1.0 - 0)` az `1`. Alapvetően, ha ezt `0`-ra állítjuk, az hatékonyan kikapcsolja a dropout mechanizmust, de még mindig végez néhány értelmetlen számítást, és nem állíthatod None-ra, szóval ha tényleg ki akarod kapcsolni a dropoutokat, egyszerűen ne add meg őket! 😇

```python
def forward(self, x):
    org_forwarded = self.org_forward(x)

    # modul dropout
    if self.module_dropout is not None and self.training:
        if torch.rand(1) < self.module_dropout:
            return org_forwarded

    lx = self.lora_down(x)

    # normál dropout
    if self.dropout is not None and self.training:
        lx = torch.nn.functional.dropout(lx, p=self.dropout)

    # rang dropout
    if self.rank_dropout is not None and self.training:
        mask = torch.rand((lx.size(0), self.lora_dim), device=lx.device) > self.rank_dropout
        if len(lx.size()) == 3:
            mask = mask.unsqueeze(1)
        elif len(lx.size()) == 4:
            mask = mask.unsqueeze(-1).unsqueeze(-1)
        lx = lx * mask

        scale = self.scale * (1.0 / (1.0 - self.rank_dropout))
    else:
        scale = self.scale

    lx = self.lora_up(lx)

    return org_forwarded + lx * self.multiplier * scale
```

A betanítandó hálózatnak támogatnia kell ezt! További részletekért lásd a [PR#545](https://github.com/kohya-ss/sd-scripts/pull/545) pull requestet.

---

###### `use_tucker`

Minden algoritmushoz használható, kivéve az `(IA)^3`-at és a natív finomhangolást.

A Tucker-dekompozíció egy matematikai módszer, amely egy tenzort mátrixok halmazára és egy kis mag tenzorra bont, csökkentve a modell számítási komplexitását és memóriaigényét. Különböző LyCORIS modulokban használják különböző blokkokon. A LoCon esetében például, ha a `use_tucker` `True` és a kernel méret `k_size` nem `(1, 1)`, akkor a konvolúciós művelet három külön műveletre bomlik:

1. Egy 1x1-es konvolúció, amely csökkenti a csatornák számát `in_dim`-ről `lora_dim`-re.
2. Egy konvolúció az eredeti kernel mérettel `k_size`, lépésközzel `stride`, és paddingel `padding`, de csökkentett számú csatornával `lora_dim`.
3. Egy 1x1-es konvolúció, amely visszanöveli a csatornák számát `lora_dim`-ről `out_dim`-re.

Ha a `use_tucker` `False` vagy nincs beállítva, vagy ha a kernel méret `k_size` `(1, 1)`, akkor egy standard konvolúciós művelet kerül végrehajtásra az eredeti kernel mérettel, lépésközzel és paddingel, és a csatornák száma `in_dim`-ről `lora_dim`-re csökken.

---

###### `use_scalar`

Egy további tanulható paraméter, amely skálázza az alacsony rangú súlyok hozzájárulását, mielőtt azok hozzáadódnának az eredeti súlyokhoz. Ez a skalár szabályozhatja, hogy az alacsony rangú adaptáció mennyire módosítja az eredeti súlyokat. A skalár tanításával a modell megtanulhatja az optimális egyensúlyt az eredeti előtanított súlyok megőrzése és az alacsony rangú adaptáció engedélyezése között.

```python
# Ellenőrizzük, hogy a 'use_scalar' flag be van-e állítva True-ra
if use_scalar:
    # Ha igen, inicializálunk egy tanulható 'scalar' paramétert 0.0 kezdőértékkel.
    # Ez a paraméter optimalizálódik a tanítási folyamat során.
    self.scalar = nn.Parameter(torch.tensor(0.0))
else:
    # Ha a 'use_scalar' flag False, a 'scalar' értéke fix 1.0 lesz.
    # Ez azt jelenti, hogy az alacsony rangú súlyok skálázás nélkül adódnak hozzá az eredeti súlyokhoz.
    self.scalar = torch.tensor(1.0)
```

A `use_scalar` flag lehetővé teszi a modell számára, hogy meghatározza, mennyi befolyása legyen az alacsony rangú súlyoknak a végső súlyokra. Ha a `use_scalar` `True`, a modell megtanulhatja a `self.scalar` optimális értékét a tanítás során, amely megszorozza az alacsony rangú súlyokat, mielőtt azok hozzáadódnának az eredeti súlyokhoz. Ez lehetőséget biztosít az eredeti előtanított súlyok és az új alacsony rangú adaptációk közötti egyensúly megteremtésére, potenciálisan jobb teljesítményhez és hatékonyabb tanításhoz vezetve. A `self.scalar` `0.0` kezdőértéke azt sugallja, hogy a modell az alacsony rangú súlyok nélkül kezd, és a tanítás során tanulja meg a megfelelő skálát.

---

###### `rank_dropout_scale`

Egy logikai flag, amely meghatározza, hogy a dropout maszkot úgy skálázzuk-e, hogy átlagértéke `1` legyen vagy sem. Ez különösen hasznos, amikor meg szeretnénk őrizni a tenzor értékeinek eredeti skáláját a dropout alkalmazása után, ami fontos lehet a tanítási folyamat stabilitása szempontjából.

```python
def forward(self, orig_weight, org_bias, new_weight, new_bias, *args, **kwargs):
    # Lekérjük az 'oft_blocks' tenzor eszközét. Ez biztosítja, hogy minden új tenzor ugyanazon az eszközön jöjjön létre.
    device = self.oft_blocks.device

    # Ellenőrizzük, hogy a rang dropout engedélyezve van-e és a modell tanítási módban van-e.
    if self.rank_dropout and self.training:
        # Létrehozunk egy véletlenszerű tenzort ugyanolyan alakkal, mint az 'oft_blocks', egyenletes eloszlásból vett értékekkel.
        # Ezután létrehozunk egy dropout maszkot annak ellenőrzésével, hogy minden érték kisebb-e, mint a 'self.rank_dropout' valószínűség.
        drop = (torch.rand(self.oft_blocks, device=device) < self.rank_dropout).to(
            self.oft_blocks.dtype
        )

        # Ha a 'rank_dropout_scale' True, a dropout maszkot úgy skálázzuk, hogy átlagértéke 1 legyen.
        # Ez segít megőrizni a tenzor értékeinek skáláját a dropout alkalmazása után.
        if self.rank_dropout_scale:
            drop /= drop.mean()
    else:
        # Ha a rang dropout nincs engedélyezve vagy a modell nincs tanítási módban, a 'drop' értéke 1 (nincs dropout).
        drop = 1
```

---

###### `algo`

A használt LyCORIS algoritmus. Megtalálhatod a megvalósított algoritmusok [listáját](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Algo-List.md) és [magyarázatát](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Algo-Details.md), egy [demóval](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Demo.md) együtt, valamint beleáshatsz a [kutatási tanulmányba](https://arxiv.org/pdf/2309.14859.pdf) is.

---

###### `train_norm`

Szabályozza, hogy betanítsuk-e a normalizációs rétegeket, amelyeket minden algoritmus használ, kivéve az `(IA)^3`-at.

---

###### `block_dims`

Meghatározza minden blokk rangját, pontosan 25 számot vesz fel, ezért olyan hosszú ez a sor.

---

###### `block_alphas`

Meghatározza minden blokk alfáját, ez is pontosan 25 számot vesz fel, ha nem adod meg, akkor helyette a `network_alpha` értéke lesz használva.

---

Ezzel befejeztük a `network_args` ismertetését.

---

##### `--network_dropout`

Ez a lebegőpontos szám szabályozza a neuronok kiesését a tanításból minden lépésben, `0` vagy `None` az alapértelmezett viselkedés (nincs dropout), 1 az összes neuront kiejtené. A `weight_decompose=True` használata figyelmen kívül hagyja a `network_dropout`-ot, és csak a rang és modul dropout lesz alkalmazva.

```python
    --network_dropout=0 \
```

---

##### `--lr_scheduler`

A PyTorch-ban a tanulási ráta ütemező egy olyan eszköz, amely a tanulási rátát a tanítási folyamat során állítja. A modell teljesítményének függvényében modulálja a tanulási rátát, ami jobb teljesítményhez és rövidebb tanítási időhöz vezethet.

Lehetséges értékek: `linear`, `cosine`, `cosine_with_restarts`, `polynomial`, `constant` (alapértelmezett), `constant_with_warmup`, `adafactor`

Megjegyzés: az `adafactor` ütemező csak az `adafactor` optimalizálóval használható!

```python
    --lr_scheduler="cosine" \
```

---

##### `--lr_scheduler_num_cycles`

Az újraindítások száma a cosine ütemezőnél újraindításokkal. Más ütemező nem használja.

```py
    --lr_scheduler_num_cycles=1 \
```

---

##### `--learning_rate` és `--unet_lr` és `--text_encoder_lr`

A tanulási ráta határozza meg, hogy a hálózat súlyai mennyire módosulnak a becsült hiba alapján minden alkalommal, amikor a súlyok frissülnek. Ha a tanulási ráta túl nagy, a súlyok túlléphetik az optimális megoldást. Ha túl kicsi, a súlyok elakadhatnak egy szuboptimális megoldásban.

Az AdamW esetében az optimális LR `0.0001` vagy `1e-4` szokott lenni, ha le akarod nyűgözni a barátaidat.

```py
    --learning_rate=0.0001 --unet_lr=0.0001 --text_encoder_lr=0.0001
```

---

##### `--network_dim`

A Hálózati Rang (Dimenzió) felelős azért, hogy hány jellemzőt fog a LoRA betanítani. Szoros kapcsolatban áll a Hálózati Alfával és az Unet + TE tanulási rátákkal, valamint természetesen az adatkészlet minőségével. Erősen ajánlott személyes kísérletezés ezekkel az értékekkel.

```py
    --network_dim=8
```

---

##### `--output_name`

Add meg a kimeneti nevet a fájlkiterjesztés nélkül.

**FIGYELMEZTETÉS**: Ha valamilyen okból ez valaha üresen marad, az utolsó epoch nem lesz elmentve!

```py
    --output_name="last"
```

---

##### `--scale_weight_norms`

A max-norm regularizáció egy olyan technika, amely korlátozza a bejövő súlyvektorok normáját minden rejtett egységnél egy rögzített konstans felső határral. Megakadályozza, hogy a súlyok túl nagyra nőjenek, és segít javítani a sztochasztikus gradiens ereszkedés teljesítményét a mély neurális hálók tanítása során.

A Dropout a hálózat architektúráját érinti a súlyok megváltoztatása nélkül, míg a Max-Norm Regularizáció közvetlenül módosítja a hálózat súlyait. Mindkét technikát a túltanulás megakadályozására és a modell általánosításának javítására használják. Mindkettőről többet tanulhatsz ebben a [kutatási tanulmányban](https://www.cs.toronto.edu/~rsalakhu/papers/srivastava14a.pdf).

```py
    --scale_weight_norms=1.0
```

---

##### `--max_grad_norm`

Más néven Gradiens Vágás, ha azt veszed észre, hogy a gradiensek felrobbannak a tanítás során (a veszteség NaN lesz vagy nagyon nagy), fontold meg a `--max_grad_norm` paraméter beállítását. Ez a gradienseken működik a visszaterjesztési folyamat során, míg a `--scale_weight_norms` a neurális hálózat súlyain működik. Ez lehetővé teszi, hogy kiegészítsék egymást és robusztusabb megközelítést nyújtsanak a tanulási folyamat stabilizálásához és a modell teljesítményének javításához.

```py
    --max_grad_norm=1.0
```

---

##### `--no_half_vae`

Kikapcsolja a kevert pontosságot az SDXL VAE esetében és `float32`-re állítja. Nagyon hasznos, ha nem szereted a NaN-okat.

---

##### `--save_every_n_epochs` és `--save_last_n_epochs` vagy `--save_every_n_steps` és `--save_last_n_steps`

- `--save_every_n_steps` és `--save_every_n_epochs`: Egy LoRA fájl jön létre minden n-edik lépésnél vagy epochnál, amit itt megadsz.
- `--save_last_n_steps` és `--save_last_n_epochs`: Eldobja az összes mentett fájlt, kivéve az utolsó `n` darabot, amit itt megadsz.

A tanulás mindig azzal fog véget érni, amit a `--max_train_epochs` vagy `--max_train_steps` paraméterben megadsz.

```py
    --save_every_n_epochs=50
```

---

##### `--mixed_precision`

Ez a beállítás határozza meg a számítási pontosságot a tanítás során. A kevert pontosság választása felgyorsíthatja a tanítást és csökkentheti a memóriahasználatot, de potenciális numerikus instabilitást okozhat. Íme a lehetőségek és azok előnyei-hátrányai:

- "no": Teljes 32-bites pontosságot használ. Lassabb, de stabilabb.
- "fp16": 16-bites pontosságot használ ahol lehetséges, visszaesik 32-bitre amikor szükséges. Ez felgyorsíthatja a tanítást és csökkentheti a memóriahasználatot, de időnként numerikus instabilitáshoz vezethet.
- "bf16": bfloat16 pontosságot használ. Jó egyensúlyt kínál a 32-bites lebegőpontosok tartománya és a 16-bites lebegőpontosok memóriamegtakarítása között.

Válassz bölcsen a hardvered képességei és a stabilitási követelmények alapján. Ha NaN veszteségeket vagy más numerikus problémákat tapasztalsz a tanítás során, fontold meg a teljes pontosságra váltást vagy más hiperparaméterek módosítását.

```py
    --mixed_precision="bf16"
```

---

##### `--save_precision`

Ez a paraméter határozza meg a mentett modellsúlyok pontosságát. Ez egy kulcsfontosságú választás, amely mind a fájlméretet, mind a betanított LoRA pontosságát befolyásolja. Íme, amit tudnod kell:

- "fp32": Teljes 32-bites pontosság. Ez a legpontosabb, de több tárolóhelyet foglal.
- "fp16": 16-bites pontosság. Jó egyensúly a pontosság és a fájlméret között, a legtöbb esetben megfelelő.
- "bf16": bfloat16 pontosság. Szélesebb tartományt kínál, mint az fp16, de kevesebb pontossággal, bizonyos hardverkonfigurációknál hasznos.

Válassz a tárolási korlátaid és pontossági követelményeid alapján. Ha nem vagy biztos benne, az "fp16" egy megbízható alapértelmezett érték, amely a legtöbb helyzetben jól működik. Ésszerű méretű LoRA fájlt eredményez túl sok pontosság feláldozása nélkül.

```py
    --save_precision="fp16"
```

##### `--caption_extension`

A feliratfájlok kiterjesztése. Az alapértelmezett `.caption`. Ezek a feliratfájlok olyan szöveges leírásokat tartalmaznak, amelyek a tanítási képekhez kapcsolódnak. Amikor futtatod a tanítási szkriptet, az a megadott kiterjesztésű fájlokat fogja keresni a tanítási adatok mappájában. A szkript ezeknek a fájloknak a tartalmát használja feliratként, hogy kontextust biztosítson a képekhez a tanítási folyamat során.

Például, ha a képeid neve `image1.jpg`, `image2.jpg`, és így tovább, és az alapértelmezett .caption kiterjesztést használod, a szkript azt várja, hogy a feliratfájlok neve `image1.caption`, `image2.caption`, stb. legyen. Ha más kiterjesztést szeretnél használni, például `.txt`-t, akkor a caption_extension paramétert `.txt`-re állítanád, és a szkript ekkor `image1.txt`, `image2.txt`, és így tovább fájlokat keresne.

```py
    --caption_extension=".txt"
```

##### `--cache_latents` és `--cache_latents_to_disk`

Ez a két paraméter együttműködik a memóriahasználat optimalizálásában és potenciálisan felgyorsíthatja a tanítást:

- `--cache_latents`: Ez az opció a memóriában tárolja a tanítási képek látens reprezentációit. Ezáltal a modellnek nem kell minden tanítási lépésnél újra kódolnia a képeket látens térbe, ami jelentősen felgyorsíthatja a tanítást, különösen nagyobb adatkészletek esetén.

- `--cache_latents_to_disk`: A `--cache_latents`-szel együtt használva ez az opció lehetővé teszi, hogy a gyorsítótárazott látens reprezentációk a lemezen tárolódjanak ahelyett, hogy mind a memóriában maradnának. Ez különösen hasznos, ha olyan nagy adatkészleted van, amely meghaladja a rendelkezésre álló RAM-ot.

Ezeknek az opcióknak a használata több előnnyel járhat:

1. Gyorsabb tanítás: A látens reprezentációk előzetes kiszámításával és gyorsítótárazásával csökkented a számítási terhelést minden tanítási lépésnél.
2. Csökkentett VRAM használat: A lemezre történő gyorsítótárazás segíthet hatékonyabban kezelni a memóriát, különösen nagy adatkészletek esetén.
3. Konzisztencia: Az előre kiszámított látens reprezentációk biztosítják, hogy ugyanaz a látens reprezentáció legyen használva minden képhez az epochok során, ami stabilabb tanításhoz vezethet.

Azonban vedd figyelembe, hogy a látens reprezentációk gyorsítótárazása jelentős lemezterületet használhat, különösen nagy adatkészletek esetén. Győződj meg róla, hogy elegendő tárhely áll rendelkezésre, amikor a `--cache_latents_to_disk` opciót használod.

```py
    --cache_latents --cache_latents_to_disk
```

---

##### `--optimizer_type`

Az alapértelmezett optimalizáló az `AdamW`, és havonta vagy úgy körülbelül egy csomó új kerül hozzáadásra, ezért nem sorolom fel mindet, megtalálhatod a listát, ha tényleg akarod, de az `AdamW` a legjobb e sorok írásakor, így ezt használjuk!

```py
    --optimizer_type="AdamW"
```

---

##### `--dataset_repeats`

Megismétli az adatkészletet feliratokkal történő tanításkor, alapértelmezetten `1`-re van állítva, így mi ezt `0`-ra állítjuk:

```py
    --dataset_repeats=0
```

---

##### `--max_train_steps`

Add meg a tanítási lépések vagy epochok számát. Ha mind a `--max_train_steps`, mind a `--max_train_epochs` meg van adva, az epochok száma élvez elsőbbséget.

```py
    --max_train_steps=400
```

---

##### `--shuffle_caption`

Összekeveri a `--caption_separator` által meghatározott feliratokat, alapértelmezetten ez egy vessző `,`, ami tökéletesen működik a mi esetünkben, mivel a felirataink így néznek ki:

> rating_questionable, 5 fingers, anthro, bent over, big breasts, blue eyes, blue hair, breasts, butt, claws, curved horn, female, finger claws, fingers, fur, hair, huge breasts, looking at viewer, looking back, looking back at viewer, nipples, nude, pink body, pink hair, pink nipples, rear view, solo, tail, tail tuft, tuft, by lunarii, by x-leon-x, mythology, krystal \(darkmaster781\), dragon, scalie, wickerbeast, The image showcases a pink-scaled wickerbeast a furred dragon creature with blue eyes., She has large breasts and a thick tail., Her blue and pink horns are curved and pointy and she has a slight smiling expression on her face., Her scales are shiny and she has a blue and pink pattern on her body., Her hair is a mix of pink and blue., She is looking back at the viewer with a curious expression., She has a slight blush.,

Mint láthatod, nemcsak a címkéket, hanem a felirat részt is vesszővel választottam el, hogy minden összekeveredjen.

MEGJEGYZÉS: A `--cache_text_encoder_outputs` és a `--cache_text_encoder_outputs_to_disk` nem használható együtt a `--shuffle_caption`-nel. Mindkettő a VRAM használat csökkentését célozza, neked kell eldöntened, melyiket választod!

---

##### `--sdpa` vagy `--xformers` vagy `--mem_eff_attn`

Mindegyik opció módosítja a modellben használt figyelmi mechanizmust, ami jelentős hatással lehet a modell teljesítményére és memóriahasználatára. A választás az `--xformers` vagy `--mem_eff_attn` és az `--spda` között a GPU-dtól függ. Tesztelheted őket egy tanítás megismétlésével!

- `--xformers`: Ez a flag engedélyezi az XFormers használatát a modellben. Az XFormers egy Facebook Research által fejlesztett könyvtár, amely különböző hardverekre és felhasználási esetekre optimalizált transformer modellek gyűjteményét biztosítja. Ezek a modellek úgy vannak tervezve, hogy nagyon hatékonyak, rugalmasak és testreszabhatóak legyenek. Különféle figyelmi mechanizmusokat és egyéb funkciókat kínálnak, amelyek hasznosak lehetnek olyan helyzetekben, ahol korlátozott GPU memóriával rendelkezel vagy nagy méretű adatokat kell kezelned.
- `--mem_eff_attn`: Ez a flag engedélyezi a memória-hatékony figyelmi mechanizmusok használatát a modellben. A memória-hatékony figyelem úgy van tervezve, hogy csökkentse a memóriahasználatot a transformer modellek tanítása során, ami különösen hasznos lehet nagy modellek vagy adatkészletek esetén.
- `--sdpa`: Ez az opció engedélyezi a Skálázott Skaláris Szorzat Figyelem (SDPA) használatát a modellben. Az SDPA a transformer modellek alapvető komponense, amely kiszámítja a figyelmi pontszámokat a lekérdezések és kulcsok között. A skaláris szorzatokat a kulcsok dimenziójával skálázza a gradiensek stabilizálása érdekében a tanítás során. Ez a mechanizmus különösen hasznos hosszú sorozatok kezelésére és potenciálisan javíthatja a modell képességét a hosszú távú függőségek megragadására.

```python
    --sdpa
```

---

##### `--multires_noise_iterations` és `--multires_noise_discount`

A többfelbontású zaj egy új megközelítés, amely több felbontásban ad zajt egy képhez vagy látens képhez a diffúziós modellek tanítása során. Az ezzel a technikával tanított modell vizuálisan lenyűgöző képeket generálhat, amelyek esztétikailag különböznek a diffúziós modellek szokásos kimeneteitől.

A többfelbontású zajjal tanított modell változatosabb képeket tud generálni, mint a hagyományos stabil diffúzió, beleértve a rendkívül világos vagy sötét képeket is. Ezek történelmileg nehezen voltak elérhetők anélkül, hogy nagy számú mintavételi lépést használtunk volna.

Ez a technika különösen előnyös kis adatkészletekkel való munka során, de szerintem soha nem kellene nem használni.

A `--multires_noise_discount` paraméter szabályozza, hogy mennyire gyengül a zaj mennyisége minden felbontásnál. A 0.1 érték ajánlott. A `--multires_noise_iterations` paraméter határozza meg a többfelbontású zaj hozzáadásának iterációszámát, 6-10 közötti ajánlott tartománnyal.

Kérlek vedd figyelembe, hogy a `--multires_noise_discount`-nak nincs hatása a `--multires_noise_iterations` nélkül.

###### Implementációs Részletek

A `get_noise_noisy_latents_and_timesteps` függvény mintavételezi a zajt, amely hozzáadódik a látens reprezentációkhoz. Ha az `args.noise_offset` igaz, zajeltolást alkalmaz. Ha az `args.multires_noise_iterations` igaz, többfelbontású zajt alkalmaz a mintavételezett zajra.

A függvény ezután minden képhez véletlenszerű időlépést mintavételez, és zajt ad a látens reprezentációkhoz az egyes időlépéseknél lévő zajmagnitude szerint. Ez az előre irányuló diffúziós folyamat.

A `pyramid_noise_like` függvény piramis szerkezetű zajt generál. Az eredeti zajjal kezdi, és felskálázott zajt ad hozzá csökkenő felbontásokban. A zaj minden szinten egy diszkontfaktorral skálázódik, amely a szint hatványára van emelve. A zaj ezután visszaskálázódik körülbelül egységnyi varianciára. Ezt a függvényt használják a többfelbontású zaj megvalósításához.

```python
    --multires_noise_iterations=10 --multires_noise_discount=0.1
```

---

##### `--sample_prompts` és `--sample_sampler` és `--sample_every_n_steps`

Lehetőséged van képeket generálni a tanítás során, hogy ellenőrizhesd a haladást. Az argumentum lehetővé teszi, hogy különböző mintavételezők között válassz, alapértelmezetten `ddim`-en van, úgyhogy jobb, ha megváltoztatod!

A `--sample_every_n_epochs` használhatod helyette, ami elsőbbséget élvez a lépésekkel szemben. A `k_` előtag karras-t jelent, és az `_a` utótag ancestral-t.

```py
    --sample_prompts=/training_dir/sample-prompts.txt --sample_sampler="euler_a" --sample_every_n_steps=100
```

A Pony esetében az ajánlásom a rajzfilmszerű képekhez az `euler_a`, a realisztikushoz pedig a `k_dpm_2`.

A mintavételezési lehetőségeid a következők:

```bash
ddim, pndm, lms, euler, euler_a, heun, dpm_2, dpm_2_a, dpmsolver, dpmsolver++, dpmsingle, k_lms, k_euler, k_euler_a, k_dpm_2, k_dpm_2_a
```

---

Tehát az egész így nézne ki:

```python
accelerate launch --num_cpu_threads_per_process=2  "./sdxl_train_network.py" \
    --lowram \
    --pretrained_model_name_or_path="/ponydiffusers/" \
    --train_data_dir="/training_dir" \
    --resolution="1024,1024" \
    --output_dir="/output_dir" \
    --enable_bucket \
    --min_bucket_reso=256 \
    --max_bucket_reso=1024 \
    --network_alpha=4 \
    --save_model_as="safetensors" \
    --network_module="lycoris.kohya" \
    --network_args \
               "preset=full" \
               "conv_dim=256" \
               "conv_alpha=4" \
               "use_tucker=False" \
               "use_scalar=False" \
               "rank_dropout_scale=False" \
               "algo=locon" \
               "train_norm=False" \
               "block_dims=8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8" \
               "block_alphas=0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625" \
    --network_dropout=0 \
    --lr_scheduler="cosine" \
    --learning_rate=0.0001 \
    --unet_lr=0.0001 \
    --text_encoder_lr=0.0001 \
    --network_dim=8 \
    --output_name="yifftoolkit" \
    --scale_weight_norms=1 \
    --no_half_vae \
    --save_every_n_epochs=50 \
    --mixed_precision="fp16" \
    --save_precision="fp16" \
    --caption_extension=".txt" \
    --cache_latents \
    --cache_latents_to_disk \
    --optimizer_type="AdamW" \
    --max_grad_norm=1 \
    --keep_tokens=1 \
    --max_data_loader_n_workers=8 \
    --bucket_reso_steps=32 \
    --multires_noise_iterations=10 \
    --multires_noise_discount=0.1 \
    --log_prefix=xl-locon \
    --gradient_accumulation_steps=6 \
    --gradient_checkpointing \
    --train_batch_size=8 \
    --dataset_repeats=0 \
    --max_train_steps=400 \
    --shuffle_caption \
    --sdpa \
    --sample_prompts=/training_dir/sample-prompts.txt \
    --sample_sampler="euler_a" \
    --sample_every_n_steps=100
```

## Zsugorítás

---

Most, hogy a tanításod befejeződött és elkészült az első LoRA-d, csökkentsük a méretét egy jelentős<abbr title="A LyCORIS sokat zsugorodik ezzel a folyamattal, de ez kevésbé észrevehető a hagyományos LoRA-knál, de így is kevesebb zajt fogsz kapni!">\*</abbr> mértékben. A csökkentett fájlméret mellett ez segít a LoRA-dnak jobban működni más modellekkel, és nagyban segít olyan helyzetekben, ahol elég sok van belőlük egymásra halmozva, a kimenetben tapasztalható teljesen elhanyagolható különbségért cserébe, amit én nem neveznék _minőségnek_, a megfelelő beállításokkal.

Ehhez a folyamathoz a [resize_lora](https://github.com/elias-gaeros/resize_lora)-t fogjuk használni.

```bash
git clone https://github.com/elias-gaeros/resize_lora
cd resize_lora
```

Győződj meg róla, hogy a `torch`, `tqdm`, `safetensors` telepítve van a Python környezetedben. Ezután futtasd a következő parancsot:

```bash
python resize_lora.py -o {output_directory} -r fro_ckpt=1,thr=-3.55 model.safetensors lora.safetensors
```

Csak cseréld ki az `{output_directory}`-t a kívánt kimeneti könyvtáraddal és a `model.safetensors`-t azzal a checkpointtal, amit a LoRA betanításához használtál, vagy amivel az új LoRA-dat használni szeretnéd, és a `lora.safetensors`-t azzal a LoRA-val, amit le szeretnél zsugorítani.

Nyugodtan kísérletezz bármelyik SVD recepttel, amelyekről a projekt README-jében olvashatsz, az én ajánlásom nyilvánvalóan csak személyes elfogultság, de próbáltam [tesztelni](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/shrunk/by_beksinski-shrink-plot/beksinski-shrunk-plot.png?download=true), [sokat](https://huggingface.co/k4d3/yiff_toolkit/tree/main/static/shrunk), hogy másoknak ne kelljen!

## Lépések vs Epochák

---

Egy modell tanításakor fontos megérteni a különbséget a lépések és az epochák között. Mindkettő kulcsfontosságú koncepció a tanítási folyamatban, de különböző célokat szolgálnak.

### Lépések

Egy lépés a tanítási folyamat egyetlen iterációját jelenti, ahol a modell feldolgoz egy adagot az adatokból, és frissíti a paramétereit az abból az adagból számított veszteség alapján. A lépések számát általában az adagméret és a teljes tanítási adatmennyiség határozza meg. Más szóval, egy lépés a modell paramétereinek egyetlen frissítése.

### Epochák

Egy epocha ezzel szemben a teljes tanítási adatkészleten való egy teljes áthaladást jelent. Egy epocha egyenértékű az egész adatkészlet egyszeri feldolgozásával, ahol minden adag egy lépések sorozatában kerül feldolgozásra. Az epochák száma határozza meg, hogy hányszor látja a modell a teljes tanítási adatkészletet a tanítás során.

Az illusztráláshoz vegyünk egy példát, ahol a tanítási adatkészlet 1000 képből áll, az adagméret 10, és összesen 10 epocha van. Ebben az esetben:

- A modell 100 lépést fog feldolgozni epochonként (1000 kép / 10 kép adagonként).
- A modell 10-szer fogja látni az egész adatkészletet, ahol minden epocha 100 lépésből áll.

A lépések és epochák közötti különbség megértése kulcsfontosságú a tanítási paraméterek, például a tanulási ráta ütemezés beállításához, és a modell haladásának nyomon követéséhez a tanítás során.

### Gradiens Akkumuláció

A gradiens akkumuláció egy olyan technika, amely csökkenti a mély neurális hálózatok tanításának memóriaigényét. Úgy működik, hogy több iteráción keresztül gyűjti a veszteségfüggvény gradienseit a modell paramétereire vonatkozóan, ahelyett, hogy minden iterációnál kiszámítaná a gradienseket. Ez nagyobb adagméretet és hatékonyabb GPU memóriahasználatot tesz lehetővé.

A LoRA tanítás kontextusában a gradiens akkumuláció használható a tanítási folyamat stabilitásának és hatékonyságának javítására. A gradiensek több iteráción keresztüli akkumulálásával a modell hatékonyabban tanulhatja meg felismerni a mintákat az adatokban, ami jobb teljesítményhez vezethet.

A gradiens akkumuláció használatához a LoRA tanításban a következő argumentumot adhatod a tanítási parancsodhoz:

```bash
--gradient_accumulation_steps=6
```

Fontos megjegyezni, hogy az epochonkénti lépések számát az adagméret és a teljes tanítási adatmennyiség határozza meg. Ezért gradiens akkumuláció használatakor az epochonkénti lépések száma a teljes tanítási adatkészlet feldolgozásához szükséges iterációk száma lesz, nem pedig az adagok száma. Ez a különbség fontos a tanulási ráta ütemezés beállításakor és a modell haladásának nyomon követésekor a tanítás során.

## Változások Nyomon Követése

---

Szeretem az `--output_name`-nek egy releváns nevet adni, hogy biztosan tudjam, pontosan mit változtattam anélkül, hogy át kellene néznem a metaadatokat.

{{< blurhash
src="/images/sd-scripts/keep_track_of_changes.png"
blurhash="L8SigQ00?b~qxtofs;j]tMoesroN"
width="522"
height="261"
alt="A kép egy számítógépes kódfelület képernyőképét mutatja különböző paraméterekkel és beállításokkal kiemelve. A háttér fehér, a szöveg zöld és lila színű. A kulcsfontosságú paraméterek között szerepel a 'network_dropout' és az 'lr', amelyek egy gépi tanulási modell tanítási folyamatának beállításait jelzik. A középső részek azt sugallják, hogy a kimeneti név felülvizsgálat alatt áll. Ez a kép releváns azok számára, akik neurális hálózatok tanítását konfigurálják."
>}}

## Tensorboard

---

A Tensorboard-ot engedélyezheted a következők konfigurációdhoz adásával:

```bash
    --log_prefix=xl-locon \
    --log_with=tensorboard \
    --logging_dir=/output_dir/logs \
```

You will of course need to [install](https://www.tensorflow.org/install/pip) Tensorboard to actually view your training and after that you just need to use this in your output directory:

```bash
tensorboard --logdir=logs
```

Ezután megnyithatod a böngésződben a [http://localhost:6006/](http://localhost:6006/) címen, és próbálhatsz teafüvet olvasni, ööö, bocsánat! Úgy értettem, veszteségi görbéket!
