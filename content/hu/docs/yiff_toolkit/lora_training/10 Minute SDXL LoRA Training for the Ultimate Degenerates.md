---
weight: 1
bookFlatSection: false
bookToC: false
title: "10 Perces LoRA Tréning a Legvégső Degeneráltak Számára"
summary: "Egy offenzív, etikátlan és elfogult útmutató arról, hogyan potyogtassunk ki király LoRÁ-kat minimális erőfeszítéssel és számítási idővel."
aliases:
  - /docs/yiff_toolkit/lora_training/10 Perces LoRA Tréning a Legvégső Degeneráltak Számára
  - /docs/yiff_toolkit/lora_training/10 Perces LoRA Tréning a Legvégső Degeneráltak Számára
  - /docs/yiff_toolkit/lora_training/10_Perces_LoRA_Tréning_a_Legvégső_Degeneráltak_Számára
  - /docs/yiff_toolkit/lora_training/10_Perces_LoRA_Tréning_a_Legvégső_Degeneráltak_Számára/
  - /docs/yiff_toolkit/lora_training/10-Perces-LoRA-Tréning-a-Legvégső-Degeneráltak-Számára
  - /docs/yiff_toolkit/lora_training/10-Perces-LoRA-Tréning-a-Legvégső-Degeneráltak-Számára/
  - /hu/docs/yiff_toolkit/lora_training/10 Perces LoRA Tréning a Legvégső Degeneráltak Számára
  - /hu/docs/yiff_toolkit/lora_training/10 Perces LoRA Tréning a Legvégső Degeneráltak Számára/
  - /hu/docs/yiff_toolkit/lora_training/10_Perces_LoRA_Tréning_a_Legvégső_Degeneráltak_Számára
  - /hu/docs/yiff_toolkit/lora_training/10_Perces_LoRA_Tréning_a_Legvégső_Degeneráltak_Számára/
  - /hu/docs/yiff_toolkit/lora_training/10-Perces-LoRA-Tréning-a-Legvégső-Degeneráltak-Számára
  - /hu/docs/yiff_toolkit/lora_training/10-Perces-LoRA-Tréning-a-Legvégső-Degeneráltak-Számára/
  - /hu/docs/yiff_toolkit/lora_training/10 Minute SDXL LoRA Training for the Ultimate Degenerates
  - /hu/docs/yiff_toolkit/lora_training/10 Minute SDXL LoRA Training for the Ultimate Degenerates/
  - /hu/docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates
  - /hu/docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/
  - /hu/docs/yiff_toolkit/lora_training/10_Minute_SDXL_LoRA_Training_for_the_Ultimate_Degenerates
  - /hu/docs/yiff_toolkit/lora_training/10_Minute_SDXL_LoRA_Training_for_the_Ultimate_Degenerates/
---

<!--markdownlint-disable MD025 MD033 MD034 -->

# 10 Perces LoRA Tréning a Legvégső Degeneráltak Számára

---

## Tréning Montázs

---

<div class="video-container">
  <video autoplay loop muted playsinline>
    <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/sd-scripts/blaidd_training.mp4" type="video/mp4">
    A böngésződ nem támogatja a videó lejátszását.
  </video>
</div>

## Bevezetés

---

Ez a módszer egy rövid, kézen nem fogó "útmutató", amely egy szuper-kísérleti módszert ír le egy SDXL LoRA 80 lépésben történő betanításához. Működik mind a Pony Diffusion V6 XL-el, mind a CompassMix XL-el és valószínűleg még néhány másikkal is. A címben szereplő "10 Perces" csak kattintásvadászat, a betanítási idő függ az adathalmazodtól, a lépésmérettől és attól, hogy apád mikor vette neked a GPU-dat, de ettől függetlenül rohadt gyors! A 80 lépés 40-200 képből álló karakterekre és stílusokra vonatkozik méretezési problémák nélkül, csak a kimeneti nevet kell módosítanod a tréningek között! 😸

## Beállítás és Tréning

---

Először is szükséged lesz az sd-scripts forkomra, vagy csak az optimalizáló-specifikus változtatásokra a saját forkodban. Ennek módját {{< i18n-link "/docs/yiff_toolkit/lora_training_guide/Add-Custom-Optimizers" "itt" >}} találod leírva, de az ottani optimalizáló helyett [ezt](https://raw.githubusercontent.com/ka-de/sd-scripts/lodew/library/optimizers/clybius.py) fogjuk használni.

```bash
git clone https://github.com/ka-de/sd-scripts -b dev
```

Az általam használt tréning beállítások a következők:

```bash
accelerate launch --num_cpu_threads_per_process=2  "./sdxl_train_network.py" \
    --pretrained_model_name_or_path=/models/ponyDiffusionV6XL_v6StartWithThisOne.safetensors \
    --train_data_dir=/training_dir \
    --resolution="1024,1024" \
    --output_dir="/output_dir" \
    --output_name="yifftoolkit-schnell" \
    --enable_bucket \
    --min_bucket_reso=256 \
    --max_bucket_reso=2048 \
    --network_alpha=4 \
    --save_model_as="safetensors" \
    --network_module="lycoris.kohya" \
    --network_args \
               "preset=full" \
               "conv_dim=256" \
               "conv_alpha=4" \
               "rank_dropout=0" \
               "module_dropout=0" \
               "use_tucker=False" \
               "use_scalar=False" \
               "rank_dropout_scale=False" \
               "algo=locon" \
               "dora_wd=False" \
               "train_norm=False" \
    --network_dropout=0 \
    --lr_scheduler="cosine" \
    --lr_scheduler_args="num_cycles=0.375" \
    --learning_rate=0.0003 \
    --unet_lr=0.0003 \
    --text_encoder_lr=0.0001 \
    --network_dim=8 \
    --no_half_vae \
    --flip_aug \
    --save_every_n_steps=1 \
    --mixed_precision="bf16" \
    --save_precision="fp16" \
    --cache_latents \
    --cache_latents_to_disk \
    --optimizer_type=ClybW \
    --max_grad_norm=1 \
    --max_data_loader_n_workers=8 \
    --bucket_reso_steps=32 \
    --multires_noise_iterations=12 \
    --multires_noise_discount=0.4 \
    --log_prefix=xl-locon \
    --log_with=tensorboard \
    --logging_dir=/output_dir/logs \
    --gradient_accumulation_steps=6 \
    --gradient_checkpointing \
    --train_batch_size=8 \
    --dataset_repeats=1 \
    --shuffle_caption \
    --max_train_steps=80 \
    --sdpa \
    --caption_extension=".txt" \
    --sample_prompts=/training_dir/sample-prompts.txt \
    --sample_sampler="euler_a" \
    --sample_every_n_steps=10
```

Nagyon ajánlom, hogy állítsd a `--sample_every_n_steps` értékét `1`-re legalább egyszer az életedben, hogy lásd, milyen gyorsan és mit tanul a LoRA, lélegzetelállító látvány!

## Zsugorítás

---

Átméretezés a [resize_lora](https://github.com/elias-gaeros/resize_lora) segítségével.

```bash
python resize_lora.py -r fro_ckpt=1,thr=-3.55 {model_path} {lora_path}
```

## Darabolás

---

A `resize_lora` git tárolójában találsz egy aranyos kis Python szkriptet `chop_blocks.py` néven, ezt használhatod arra, hogy kivágd azokat a rétegeket a LoRA-dból, amelyek nem tartalmaznak információt a betanított karakterről/stílusról/koncepcióról.

Amikor lefuttatod a következő argumentumokkal a betanított LoRA-n (nem az átméretezetten)

```bash
python chop_blocks.py {lora_path} 
```

Egy rejtélyes kimenetet kapsz, amely megmutatja, hogy mely blokkok hány réteget tartalmaznak:

```r
INFO: Blocks layout:
INFO:   [ 0]  input_blocks.1 layers=9
INFO:   [ 1]  input_blocks.2 layers=9
INFO:   [ 2]  input_blocks.3 layers=3
INFO:   [ 3]  input_blocks.4 layers=78
INFO:   [ 4]  input_blocks.5 layers=75
INFO:   [ 5]  input_blocks.6 layers=3
INFO:   [ 6]  input_blocks.7 layers=318
INFO:   [ 7]  input_blocks.8 layers=315
INFO:   [ 8]  middle_block.0 layers=9
INFO:   [ 9]  middle_block.1 layers=306
INFO:   [10]  middle_block.2 layers=9
INFO:   [11] output_blocks.0 layers=318
INFO:   [12] output_blocks.1 layers=318
INFO:   [13] output_blocks.2 layers=321
INFO:   [14] output_blocks.3 layers=78
INFO:   [15] output_blocks.4 layers=78
INFO:   [16] output_blocks.5 layers=81
INFO:   [17] output_blocks.6 layers=12
INFO:   [18] output_blocks.7 layers=12
INFO:   [19] output_blocks.8 layers=12
INFO: Vector string : "1,INP01,INP02,INP03,INP04,INP05,INP06,INP07,INP08,MID00,MID01,MID02,OUT00,OUT01,OUT02,OUT03,OUT04,OUT05,OUT06,OUT07,OUT08"
INFO: Pass through layers: 264
```

Például, ha csak az OUT01-et vagy `output_blocks.1`-et szeretnéd megtartani, a következőt kell használnod:

```bash
python chop_blocks.py {⚠️átméretezett⚠️_lora_path} 1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0
```

Mivel a vektor sztring első száma csak egy ComfyUI node-dal való kompatibilitás miatt van, amiről a következő bekezdésben lesz szó, elfelejtheted, a következő szám utána az `input_blocks.1`!

Ahhoz, hogy ellenőrizd, melyik blokk milyen információt tartalmaz, nagyon ajánlom, hogy telepítsd a [ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)-et és használd a `Lora Loader (Block Weight)` node-ot!

<div style="text-align: center;">

{{< blurhash
    src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/sd-scripts/lora_loader.png"
    blurhash="L3O|b2xuWBWB~qof4nWB%MofIUWU"
    width="1045"
    height="805"
    alt="A képernyőkép a ComfyUI-Inspire-Pack felhasználói felületének egy elemét mutatja, konkrétan egy 'Lora Loader (Block Weight)' nevű node-ot. Ez a node egy vizuális programozási környezet része, és különböző állítható paramétereket tartalmaz. A node-ban látható főbb beállítások a 'model', 'clip', 'category_filter', 'lora_name', 'strength_model', 'strength_clip', 'inverse', 'control_after_generate' és 'preset'. Minden paraméterhez tartoznak megfelelő beviteli mezők vagy legördülő menük a felhasználói testreszabáshoz. A preset mező egy részletes alfanumerikus karakterláncot tartalmaz, amely egy specifikus konfigurációt reprezentál."
>}}

</div>

Győződj meg róla, hogy a `control_after_generate` értéke `fixed` legyen!

Használhatod az itt található előbeállításokat is az összes IN, OUT vagy MID blokk ellenőrzéséhez, de a lényeges dolgok többnyire az OUT1-ben lesznek. <!-- ⚠️ TODO: Tényleg több LoRA-t kell tréningelnem -->

Miután kitaláltad, mely blokkokat szeretnéd megtartani, darabold fel az imént átméretezett LoRA-t, és küldd el a pici LoRA-dat a barátaidnak Discordon Nitro előfizetés nélkül! 😹

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
