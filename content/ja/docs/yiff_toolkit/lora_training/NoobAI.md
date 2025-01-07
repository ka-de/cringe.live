---
weight: 2
bookFlatSection: false
bookToC: false
title: "NoobAIノート"
summary: "NoobAI SDXLモデルのトレーニングに関する包括的なガイド。最適なVRAM設定、トレーニングパラメータ、および時期特定のタグを使用したプロンプト技術を含みます。"
aliases:
    - /ja/docs/yiff_toolkit/lora_training/NoobAI/
    - /ja/docs/yiff_toolkit/lora_training/NoobAI
    - /ja/docs/yiff_toolkit/lora_training/NoobAI-Notes/
    - /ja/docs/yiff_toolkit/lora_training/NoobAI-Notes
    - /ja/docs/yiff_toolkit/lora_training/NoobAI Notes/
    - /ja/docs/yiff_toolkit/lora_training/NoobAI Notes
---

<!--markdownlint-disable MD025 -->

# NoobAIノート

---

## はじめに

NoobAIは、アニメとファーリーの画像生成に特化したSDXLアーキテクチャをベースにしています。現在、モデルのv-prediction `0.65S`バージョンを使用しています。このガイドは主にそのバージョンに焦点を当てています。DanbooruとE621でトレーニングされました。

## ダウンロード

[CivitAI](https://civitai.com/models/833294?modelVersionId=1093948)

## トレーニングのヒント

---

現在`sd3`ブランチを使用しているため、以下のパラメータを渡すだけで特に問題ありません：

```bash
--v_parameterization
--zero_terminal_snr
```

### 24Gb VRAMに収める方法

4090に完全に収まるように、以下の設定を使用しました。

{{% details "クリックして内容を展開"  %}}

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

バッチサイズを減らすか、解像度を768xまたは512xに下げることで、任意のGPUに収めることができます。それでも問題がある場合は、8ビットオプティマイザを使用してください。現在私が好んで使用している[オプティマイザ](https://github.com/ka-de/sd-scripts/blob/dev/library/optimizers/clybius.py)はこちらです。sd-scriptsにカスタムオプティマイザを統合する方法については[こちら](/docs/yiff_toolkit/lora_training/Add-Custom-Optimizers/)のガイドを参照してください。

{{% /details %}}

<!--

### 細かい点

{{% details "クリックして内容を展開" %}}

この警告は単なる情報メッセージにすべきです：

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

この時点で誰もが読んだ研究論文へのリンクの代わりに、この情報を表示するだけでもよいでしょう：

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
         # Convert betas to alphas_bar_sqrt
```

最後に、ここに改行がある理由がわかりません：

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

## プロンプトのヒント

---

### 日付タグ

日付タグには、年タグと期間タグの2種類があります。

#### 年タグ

xxxx年の形式を使用します。例：`2021`。

#### 期間タグ

期間タグについては、以下の表を参照してください：

| **年の範囲** | **期間タグ** |
|:------------|:-------------|
| 2005-2010  | old         |
| 2011-2014  | early       |
| 2014-2017  | mid         |
| 2018-2020  | recent      |
| 2021-2024  | newest      |

---

---

{{< related-posts related="docs/yiff_toolkit/ | docs/yiff_toolkit/dataset_tools/furrytagger | docs/yiff_toolkit/lora_training/" >}}
