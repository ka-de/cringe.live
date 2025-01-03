---
weight: 2
bookFlatSection: false
bookToC: false
title: "NoobAI Jegyzetek"
aliases:
    - /hu/docs/yiff_toolkit/lora_training/NoobAI/
    - /hu/docs/yiff_toolkit/lora_training/NoobAI
    - /hu/docs/yiff_toolkit/lora_training/NoobAI-Notes/
    - /hu/docs/yiff_toolkit/lora_training/NoobAI-Notes
    - /hu/docs/yiff_toolkit/lora_training/NoobAI Notes/
    - /hu/docs/yiff_toolkit/lora_training/NoobAI_Notes
    - /hu/docs/yiff_toolkit/lora_training/NoobAI_Notes/
---

<!--markdownlint-disable MD025 -->

# NoobAI Jegyzetek

---

## Bevezetés

A NoobAI az SDXL architektúrán alapul, kifejezetten anime és furry képek generálására optimalizálva. Jelenleg a modell v-prediction `0.65S` verzióját használom. Ez az útmutató főként erre a konkrét verzióra összpontosít. A Danbooru és e621 oldalakon található képekkel lett betanítva.

## Letöltés

[CivitAI](https://civitai.com/models/833294?modelVersionId=1093948)

## Tréning Tippek

---

Jelenleg az `sd3` ágon vagyok, így nincs semmi különleges a következők átadásában:

```bash
--v_parameterization
--zero_terminal_snr
```

### Beillesztés 24Gb VRAM-ba

A következő beállításokat használtam, hogy tökéletesen beférjen egy 4090-be.

{{% details "Kattints a tartalom kibontásához."  %}}

```bash
args=(
    --debiased_estimation_loss
    --max_token_length=225
    --keep_tokens=1
    --keep_tokens_separator="|||"
    --pretrained_model_name_or_path=/home/kade/ComfyUI/models/checkpoints/noobaiXLVpredv06.safetensors
    --v_parameterization
    --zero_terminal_snr
    --log_with=tensorboard
    --seed=1728871242
    --dataset_repeats=1
    --resolution="1024,1024"
    --enable_bucket
    --bucket_reso_steps=64
    --min_bucket_reso=256
    --max_bucket_reso=2048
    --flip_aug
    --shuffle_caption
    --cache_latents
    --cache_latents_to_disk
    --max_data_loader_n_workers=8
    --persistent_data_loader_workers
    --network_dim=100000
    --network_alpha=64
    --network_module="lycoris.kohya"
    --network_args
            "preset=full"
            "conv_dim=100000"
            "decompose_both=False"
            "conv_alpha=64"
            "rank_dropout=0"
            "module_dropout=0"
            "use_tucker=True"
            "use_scalar=False"
            "rank_dropout_scale=False"
            "algo=lokr"
            "bypass_mode=False"
            "factor=16"
            "dora_wd=True"
            "train_norm=False"
    --network_dropout=0
    --optimizer_type=ClybW
    --train_batch_size=14
    --max_grad_norm=1
    --gradient_checkpointing
    --lr_warmup_steps=0
    --learning_rate=0.0003
    --unet_lr=0.0003
    --text_encoder_lr=0.00015
    --lr_scheduler="cosine"
    --lr_scheduler_args="num_cycles=0.375"
    --multires_noise_iterations=12
    --multires_noise_discount=0.4
    --no_half_vae
    --sdpa
    --mixed_precision="bf16"
    --save_model_as="safetensors"
    --save_precision="fp16"
    --save_every_n_steps=100
    --sample_every_n_steps=100
    --sample_sampler="euler_a"
    --sample_at_first
    --caption_extension=".txt"
)
```

A batch méret és/vagy a felbontás 768x-ra vagy 512x-re csökkentésével bármilyen GPU-ba beilleszthető. Ha még mindig gondod van, használj 8-bites optimalizálót. [Itt](https://github.com/ka-de/sd-scripts/blob/dev/library/optimizers/clybius.py) található az az optimalizáló, amit jelenleg előnyben részesítek, és [itt](/docs/yiff_toolkit/lora_training/Add-Custom-Optimizers/) található egy útmutató arról, hogyan lehet egyéni optimalizálókat integrálni az sd-scripts-be.

{{% /details %}}

<!--

### Apróságok

{{% details "Kattints a tartalom kibontásához." %}}

Ennek a figyelmeztetésnek csak egy információs üzenetnek kellene lennie:

```diff
diff --git a/library/sd3_train_utils.py b/library/sd3_train_utils.py
index 38f3c25..c9951a1 100644
--- a/library/sd3_train_utils.py
+++ b/library/sd3_train_utils.py
@@ -290,7 +290,7 @@ def add_sd3_training_arguments(parser: argparse.ArgumentParser):
 def verify_sdxl_training_args(args: argparse.Namespace, supportTextEncoderCaching: bool = True):
     assert not args.v2, "v2 cannot be enabled in SDXL training / SDXL学習ではv2を有効にすることはできません"
     if args.v_parameterization:
-        logger.warning("v_parameterization will be unexpected / SDXL学習ではv_parameterizationは想定外の動作になります")
+        logger.info("v_parameterization is enabled / v_parameterizationが有効になりました")

     if args.clip_skip is not None:
         logger.warning("clip_skip will be unexpected / SDXL学習ではclip_skipは動作しません")
diff --git a/library/sdxl_train_util.py b/library/sdxl_train_util.py
index dc3887c..dc883aa 100644
--- a/library/sdxl_train_util.py
+++ b/library/sdxl_train_util.py
@@ -345,7 +345,7 @@ def add_sdxl_training_arguments(parser: argparse.ArgumentParser, support_text_en
 def verify_sdxl_training_args(args: argparse.Namespace, supportTextEncoderCaching: bool = True):
     assert not args.v2, "v2 cannot be enabled in SDXL training / SDXL学習ではv2を有効にすることはできません"
     if args.v_parameterization:
-        logger.warning("v_parameterization will be unexpected / SDXL学習ではv_parameterizationは想定外の動作になります")
+        logger.info("v_parameterization is enabled / v_parameterizationが有効になりました")

     if args.clip_skip is not None:
         logger.warning("clip_skip will be unexpected / SDXL学習ではclip_skipは動作しません")
```

A kutatási cikkre mutató link helyett, amit már mindannyian olvastunk, ezt az információt is kinyomtathatod:

```diff
diff --git a/library/custom_train_functions.py b/library/custom_train_functions.py
index faf4430..818056c 100644
--- a/library/custom_train_functions.py
+++ b/library/custom_train_functions.py
@@ -27,7 +27,7 @@ def prepare_scheduler_for_custom_training(noise_scheduler, device):

 def fix_noise_scheduler_betas_for_zero_terminal_snr(noise_scheduler):
     # fix beta: zero terminal SNR
-    logger.info(f"fix noise scheduler betas: https://arxiv.org/abs/2305.08891")
+    logger.info(f"zero terminal SNR enabled. / ゼロ終端SNR有効化")

     def enforce_zero_terminal_snr(betas):
```

Végül, fogalmam sincs, miért van itt egy új sor:

```diff
diff --git a/library/train_util.py b/library/train_util.py
index 1aca021..4afcfc3 100644
--- a/library/train_util.py
+++ b/library/train_util.py
@@ -6078,7 +6078,6 @@ def sample_images_common(
             if steps % args.sample_every_n_steps != 0 or epoch is not None:  # steps is not divisible or end of epoch
                 return

-    logger.info("")
     logger.info(f"generating sample images at step / サンプル画像生成 ステップ: {steps}")
     if not os.path.isfile(args.sample_prompts):
         logger.error(f"No prompt file / プロンプトファイルがありません: {args.sample_prompts}")
```

{{% /details %}}
-->

## Promptolási Tippek

---

### Dátum Címkék

Kétféle dátum címke létezik: év címkék és időszak címkék.

#### Év Címkék

Használd az xxxx év formátumot. Példa: `2021`.

#### Időszak Címkék

Az időszak címkékhez lásd a következő táblázatot:

| **Év Tartomány** | **Időszak Címke** |
|:------------|:-------------|
| 2005-2010  | old         |
| 2011-2014  | early       |
| 2014-2017  | mid         |
| 2018-2020  | recent      |
| 2021-2024  | newest      |
</code_block_to_apply_changes_from> 