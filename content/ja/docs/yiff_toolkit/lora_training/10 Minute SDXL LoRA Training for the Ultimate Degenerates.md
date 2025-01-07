---
weight: 1
bookFlatSection: false
bookToC: false
title: "究極のデジェネレート向け10分LoRAトレーニング"
summary: "最小限の労力と計算時間で素晴らしいLoRAを生み出すための、攻撃的で非倫理的で偏った指南書。"
---

<!--markdownlint-disable MD025 MD033 MD034 -->

# 究極のデジェネレート向けSDXL LoRA 10分トレーニング

---

## トレーニングモンタージュ

---

<div class="video-container">
  <video autoplay loop muted playsinline>
    <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/sd-scripts/blaidd_training.mp4" type="video/mp4">
    お使いのブラウザはビデオタグをサポートしていません。
  </video>
</div>

## はじめに

---

この方法は、80ステップでSDXL LoRAをトレーニングする超実験的な方法を説明する、手取り足取りなしの「ガイド」です。Pony Diffusion V6 XLとCompassMix XL、おそらく他のいくつかのモデルでも動作します。タイトルの「10分」はただのクリックベイトで、トレーニング時間はデータセットとステップサイズ、そしてお父さんがいつGPUを買ってくれたかによって変わりますが、とにかく超高速です！80ステップは、40〜200枚の画像を含むキャラクターやスタイルのデータセットに適用され、スケーリングの問題もありません。トレーニング間で出力名を変更するだけでOKです！😸

## セットアップとトレーニング

---

まず、私のsd-scriptsのフォークを入手するか、あなたのフォークに最適化関連の変更を加える必要があります。その方法は[ここ](/docs/yiff_toolkit/lora_training_guide/Add-Custom-Optimizers/)で説明されていますが、そのページの最適化ではなく、[これ](https://raw.githubusercontent.com/ka-de/sd-scripts/lodew/library/optimizers/clybius.py)を使用します。

```bash
git clone https://github.com/ka-de/sd-scripts -b dev
```

私が使用しているトレーニング設定は以下の通りです：

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

人生で少なくとも一度は`--sample_every_n_steps`を`1`に設定することを強くお勧めします。LoRAがどれだけ速く、何を学習しているかを見ることができ、それは見る価値があります！

## 縮小

---

[resize_lora](https://github.com/elias-gaeros/resize_lora)で縮小します。

```bash
python resize_lora.py -r fro_ckpt=1,thr=-3.55 {model_path} {lora_path}
```

## チョッピング

---

`resize_lora`のGitリポジトリには、`chop_blocks.py`という可愛らしいPythonスクリプトがあります。これを使用して、トレーニングしたキャラクター/スタイル/コンセプトに関する情報を含まないレイヤーをLoRAから切り取ることができます。

トレーニングしたLoRA（縮小したものではない）に対して、以下の引数で実行すると：

```bash
python chop_blocks.py {lora_path} 
```

各ブロックに含まれるレイヤー数を示す、この暗号のような出力が表示されます：

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

例えば、OUT01または`output_blocks.1`以外のすべてを切り取るには、以下のように使用します：

```bash
python chop_blocks.py {⚠️縮小済み⚠️_lora_path} 1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0
```

ベクトル文字列の最初の数字は、次の段落で説明するComfyUIノードとの互換性のためだけのものなので無視できます。その次の数字が`input_blocks.1`です！

どのブロックにどのような情報が含まれているかを確認するために、[ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)をインストールして、`Lora Loader (Block Weight)`ノードを使用することを強くお勧めします！

<div style="text-align: center;">

{{< blurhash
    src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/sd-scripts/lora_loader.png"
    blurhash="L3O|b2xuWBWB~qof4nWB%MofIUWU"
    width="1045"
    height="805"
    alt="スクリーンショットは、ComfyUI-Inspire-Packのユーザーインターフェース要素、特に「Lora Loader (Block Weight)」という名前のノードを示しています。このノードはビジュアルプログラミング環境の一部で、様々な調整可能なパラメータを含んでいます。ノードに表示されている主要な設定には、「model」、「clip」、「category_filter」、「lora_name」、「strength_model」、「strength_clip」、「inverse」、「control_after_generate」、「preset」があります。各パラメータにはユーザーがカスタマイズできる入力フィールドまたはドロップダウンメニューがあります。プリセットフィールドには、特定の設定を表す詳細な英数字の文字列が含まれています。"
>}}

</div>

必ず`control_after_generate`を`fixed`に設定してください！

プリセットを使用してすべてのIN、OUT、またはMIDブロックを確認することもできますが、重要な情報のほとんどはOUT1にあります。<!-- ⚠️ TODO: もっとLoRAをトレーニングする必要があります -->

保持したいブロックを決定したら、先ほど縮小したLoRAをチョップして、Nitroを支払わずにDiscordで友達に小さなLoRAを送信しましょう！😹

---

---

{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/" >}}
