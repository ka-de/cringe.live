---
weight: 1
bookFlatSection: false
bookToC: true
title: "LoRA トレーニングガイド"
summary: "LoRAトレーニングガイドでは、大規模な言語モデルや拡散モデルを効率的に微調整するための手法であるLow-Rank Adaptation（LoRA）について説明します。この手法は、すべてのモデルパラメータを変更する代わりに、小さな訓練可能な低ランク行列を導入します。このアプローチでは、元のモデルの重みを固定したまま、各層に2つの追加行列を挿入して必要な調整を学習します。LoRAは軽量で、大容量のストレージを必要とせずに複数の適応を訓練することが可能です。このガイドでは、より多くの制御と柔軟性を提供する高度な拡張であるLyCORISとの比較も行い、行列分解にクロネッカー積を使用して、メモリ効率と適応プロセスの制御を向上させるLoKrについても紹介します。"
---

<!--markdownlint-disable MD025 MD033 MD034 -->

# LoRA トレーニングガイド

---

## LoRAとは？

---

LoRA（Low-Rank Adaptation）は、大規模な言語モデルや拡散モデルを効率的に微調整するために設計された手法です。数十億に及ぶモデルパラメータ全体を変更する代わりに、LoRAはモデルの動作を適応させるための小さな訓練可能な「低ランク」行列を導入します。この革新的なアプローチは、Microsoftの研究者による論文["LoRA: Low-Rank Adaptation of Large Language Models"](https://arxiv.org/abs/2106.09685)で詳しく説明されています。

## サブセクション

---

{{< section-noimg details >}}

## インストール手順

---

まず、kohya_ssの[sd-scripts](https://github.com/kohya-ss/sd-scripts)をダウンロードします。Windowsの場合は[こちら](https://github.com/kohya-ss/sd-scripts?tab=readme-ov-file#windows-installation)の手順に従ってセットアップを行います。LinuxまたはWindows上のMinicondaを使用している場合は、インストール方法を自分で理解できるはずです。仮想環境には常に最新の[PyTorch](https://pytorch.org/get-started/locally/)をインストールすることをお勧めします。執筆時点では`2.2.2`が最新です。将来のPyTorchがより高速になることを期待しています！

念のため、Windowsでsd-scriptsをMinicondaにインストールする方法を最近「ガイド」したので、その手順を共有します：

```bash
# sd-scriptsのインストール
git clone https://github.com/kohya-ss/sd-scripts
cd sd-scripts

# conda環境の作成とrequirementsのインストール
conda create -n sdscripts python=3.10.14
conda activate sdscripts
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
python -m pip install --use-pep517 --upgrade -r requirements.txt
python -m pip install --use-pep517 lycoris_lora
accelerate config
```

`accelerate config`では多くの質問が表示されますが、各質問をよく読んで正直に回答する必要があります。ほとんどの場合、正しい回答は次のようになります：`This machine, No distributed training, no, no, no, all, fp16`

また、`xformers`や`bitsandbytes`のインストールも検討するとよいでしょう。

```bash
# xformersのインストール
# 他のパッケージをインストールする場合も、'xformers'を置き換えるだけです
python -m pip install --use-pep517 xformers

# Windows用bitsandbytesのインストール
python -m pip install --use-pep517 bitsandbytes --index-url=https://jllllll.github.io/bitsandbytes-windows-webui
```

---

### Pony トレーニング

---

正直に言うと、すべてを説明するのは少し複雑です。しかし、ここでは「基本的な」内容とほぼすべての行について、最善の説明を試みます。

#### Diffusers形式でPonyをダウンロード

トレーニングには私が変換したdiffusersバージョンを使用しています。`git`を使用してダウンロードできます。

```bash
git clone https://huggingface.co/k4d3/ponydiffusers
```

---

#### サンプルプロンプトファイル

サンプルプロンプトファイルは、トレーニング中に画像をサンプリングするために使用されます。Ponyの場合、サンプルプロンプトは以下のようになります：

```py
# anthro female kindred
score_9, score_8_up, score_7_up, score_6_up, rating_explicit, source_furry, solo, female anthro kindred, mask, presenting, white pillow, bedroom, looking at viewer, detailed background, amazing_background, scenery porn, realistic, photo --n low quality, worst quality, blurred background, blurry, simple background --w 1024 --h 1024 --d 1 --l 6.0 --s 40
# anthro female wolf
score_9, score_8_up, score_7_up, score_6_up, rating_explicit, source_furry, solo, anthro female wolf, sexy pose, standing, gray fur, brown fur, canine pussy, black nose, blue eyes, pink areola, pink nipples, detailed background, amazing_background, realistic, photo --n low quality, worst quality, blurred background, blurry, simple background --w 1024 --h 1024 --d 1 --l 6.0 --s 40
```

サンプルプロンプトは77トークンを超えないようにしてください。[/dataset_tools](https://huggingface.co/k4d3/yiff_toolkit/tree/main/dataset_tools)にある[Count Tokens in Sample Prompts](https://huggingface.co/k4d3/yiff_toolkit/blob/main/dataset_tools/Count%20Tokens%20in%20Sample%20Prompts.ipynb)を使用してプロンプトを分析できます。

複数のGPUでトレーニングを行う場合は、プロンプトの総数がGPUの数で余りなく割り切れるようにしてください。そうしないと、カードがアイドル状態になってしまいます。

---

#### トレーニングコマンド

---

##### `accelerate launch`

2台のGPUの場合：

```python
accelerate launch --num_processes=2 --multi_gpu --num_machines=1 --gpu_ids=0,1 --num_cpu_threads_per_process=2  "./sdxl_train_network.py"
```

シングルGPUの場合：

```python
accelerate launch --num_cpu_threads_per_process=2 "./sdxl_train_network.py"
```

---

&nbsp;

それでは、`sd-scripts`に渡すことができる多くの引数について詳しく見ていきましょう。

&nbsp;

##### `--lowram`

2台のGPUと非常に大きなモデルを使用している場合にシステムメモリが不足する場合、このオプションを使用することで少しメモリを節約でき、OOMエラーから回避できる可能性があります。

---

##### `--pretrained_model_name_or_path`

先ほどダウンロードしたチェックポイントを含むディレクトリです。ローカルのdiffusersモデルを使用している場合は、パスを`/`で閉じることをお勧めします。`.safetensors`や`.ckpt`を指定することもできます！

```python
    --pretrained_model_name_or_path="/ponydiffusers/"
```

---

##### `--output_dir`

すべての保存されたエポックまたはステップが保存される場所です。最後のものも含まれます。

```python
    --output_dir="/output_dir"
```

---

##### `--train_data_dir`

データセットを含むディレクトリです。これは先ほど一緒に準備したものです。

```python
    --train_data_dir="/training_dir"
```

---

##### `--resolution`

常にモデルの解像度に合わせて設定してください。Ponyの場合は1024x1024です。VRAMに収まらない場合は、最後の手段として`512,512`に減らすことができます。

```python
    --resolution="1024,1024"
```

---

##### `--enable_bucket`

異なるアスペクト比の画像を異なるバケットに事前分類することでバケットを作成します。この技術により、モデルが正方形の画像を生成するように訓練される際によく発生する不自然なクロップの問題を回避できます。これにより、各アイテムが同じサイズのバッチを作成できますが、バッチの画像サイズは異なる場合があります。

---

##### `--bucket_no_upscale`

ネットワークによって処理される画像の解像度に影響を与え、画像のアップスケーリングを無効にします。このオプションが設定されている場合、画像の$width \times height$が`self.max_area`を超える場合にのみ、ネットワークは指定された最大面積に収まるように画像をダウンスケールします。

1. `select_bucket`関数はダウンスケーリングが必要かどうかをチェックします：`image_width`と`image_height`の積が`self.max_area`より大きい場合、画像が大きすぎるためダウンスケールする必要があります。
2. その後、画像のリサイズ後の面積が`self.max_area`を超えず、アスペクト比が保持されるように、リサイズ後の幅と高さを計算します。
3. `round_to_steps`関数を使用して、リサイズされた寸法を`self.reso_steps`（解像度バケットのステップサイズを定義するパラメータ）の倍数に丸めます。
4. コードは、丸め後の幅と高さのアスペクト比を比較して、リサイズ後のアスペクト比の誤差を最小限に抑えるために優先する寸法を決定します。
5. より小さいアスペクト比の誤差に基づいて、画像の元のアスペクト比を最もよく維持するリサイズ寸法を選択します。

まとめると、`select_bucket`関数は、ダウンスケーリングが必要な場合、画像を解像度ステップサイズ（`self.reso_steps`）の倍数の寸法にリサイズし、元のアスペクト比にできるだけ近く、最大許容面積（`self.max_area`）を超えないようにします。**`--bucket_no_upscale`が設定されている場合、アップスケーリングは実行されません。**

---

##### `--min_bucket_reso` と `--max_bucket_reso`

バケットで使用される最小および最大解像度を指定します。これらの値は`--bucket_no_upscale`が設定されている場合は無視されます。

```python
    --min_bucket_reso=256 --max_bucket_reso=1024
```

---

##### `--network_alpha`

トレーニングされたNetwork Ranksのうち、どれだけがベースモデルを変更できるかを指定します。

```python
    --network_alpha=4
```

---

##### `--save_model_as`

ファイル形式として`ckpt`または`safetensors`を指定できます。

```python
    --save_model_as="safetensors"
```

---

##### `--network_module`

トレーニングに使用するネットワークモジュールを指定します。

```python
    --network_module="lycoris.kohya"
```

---

##### `--network_args`

ネットワークに渡される引数です。

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

**詳しく見ていきましょう！**

---

###### `preset`

LyCORISに追加された[プリセット](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Preset.md)/設定システムで、より細かい制御が可能になります。

- `full`
  - デフォルトのプリセットで、UNetとCLIPのすべての層をトレーニングします。
- `full-lin`
  - `full`と同じですが、畳み込み層をスキップします。
- `attn-mlp`
  - "kohyaプリセット"で、すべてのトランスフォーマーブロックをトレーニングします。
- `attn-only`
  - 注意層のみがトレーニングされます。多くの論文では注意層のみのトレーニングを行っています。
- `unet-transformer-only`
  - TEを無効にしたkohya_ss/sd_scriptsと同じ、または、train_unet_onlyを有効にしたattn-mlpプリセットと同じです。
- `unet-convblock-only`
  - ResBlock、UpSample、DownSampleのみがトレーニングされます。

---

###### `conv_dim` と `conv_alpha`

畳み込みの次元はモデルの畳み込みのランクに関連しており、この値を調整すると[大きな影響](https://ashejunius.com/alpha-and-dimensions-two-wild-settings-of-training-lora-in-stable-diffusion-d7ad3e3a3b0a)を与える可能性があり、値を下げることで異なるLoRAサンプル間の美的な違いに影響を与えました。特定のキャラクターの顔のトレーニングには`128`のアルファ値が使用され、KohakuはLoConとLoHaの両方でこれを`1`に設定することを推奨しています。

```python
conv_block_dims = [conv_dim] * num_total_blocks
conv_block_alphas = [conv_alpha] * num_total_blocks
```

---

###### `module_dropout` と `dropout` と `rank_dropout`

{{< responsive-svg src="/svg/dropout.svg" alt="ニューラルネットワークにおけるドロップアウト" >}}

`rank_dropout`はドロップアウトの一形態で、オーバーフィッティングを防ぎ、汎化を改善するためにニューラルネットワークで使用される正則化技術です。ただし、入力の一部をランダムにゼロに設定する従来のドロップアウトとは異なり、`rank_dropout`は入力テンソル`lx`のランクに対して動作します。まず、`lx`と同じランクを持つバイナリマスクが作成され、各要素が確率`1 - rank_dropout`で`True`、それ以外で`False`に設定されます。その後、`mask`が`lx`に適用され、一部の要素がランダムにゼロに設定されます。ドロップアウトを適用した後、ドロップアウトされた要素を補償するために`lx`にスケーリング係数が適用されます。これは、ドロップアウト前後で`lx`の期待値の合計が同じになるようにするためです。スケーリング係数は`1.0 / (1.0 - self.rank_dropout)`です。

入力テンソルの個々の要素ではなく、そのランクに対して動作するため、「ランク」ドロップアウトと呼ばれます。これは、入力のランクが重要なタスクで特に有用です。

`rank_dropout`が`0`に設定されている場合、入力テンソル`lx`のランクにドロップアウトは適用されません。マスクのすべての要素が`True`に設定され、マスクが`lx`に適用されるとすべての要素が保持され、ドロップアウト後にスケーリング係数が適用されると、その値は単に`self.scale`と等しくなります（`1.0 / (1.0 - 0)`は`1`であるため）。基本的に、これを`0`に設定するとドロップアウトメカニズムは効果的に無効になりますが、意味のない計算は行われ続けます。Noneには設定できないので、本当にドロップアウトを無効にしたい場合は、単に指定しないでください！ 😇

```python
def forward(self, x):
    org_forwarded = self.org_forward(x)

    # module dropout
    if self.module_dropout is not None and self.training:
        if torch.rand(1) < self.module_dropout:
            return org_forwarded

    lx = self.lora_down(x)

    # normal dropout
    if self.dropout is not None and self.training:
        lx = torch.nn.functional.dropout(lx, p=self.dropout)

    # rank dropout
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

トレーニングするネットワークがこれをサポートしている必要があります！詳細については[PR#545](https://github.com/kohya-ss/sd-scripts/pull/545)を参照してください。

---

###### `use_tucker`

`(IA)^3`とネイティブな微調整を除くすべてに使用できます。

タッカー分解は、テンソルを一連の行列と1つの小さなコアテンソルに分解する数学的手法で、モデルの計算複雑性とメモリ要件を削減します。これは様々なLyCORISモジュールで様々なブロックに使用されます。例えばLoConでは、`use_tucker`が`True`でカーネルサイズ`k_size`が`(1, 1)`でない場合、畳み込み演算は3つの別々の演算に分解されます。

1. チャンネル数を`in_dim`から`lora_dim`に減らす1x1畳み込み。
2. 元のカーネルサイズ`k_size`、ストライド`stride`、パディング`padding`を持つが、チャンネル数が`lora_dim`に減少した畳み込み。
3. チャンネル数を`lora_dim`から`out_dim`に戻す1x1畳み込み。

`use_tucker`が`False`または設定されていない場合、またはカーネルサイズk_sizeが`(1, 1)`の場合、元のカーネルサイズ、ストライド、パディングを使用した標準的な畳み込み演算が実行され、チャンネル数は`in_dim`から`lora_dim`に減少します。

---

###### `use_scalar`

低ランクの重みを元の重みに加える前にスケーリングする追加の学習パラメータです。このスカラーは、低ランク適応が元の重みをどの程度修正するかを制御できます。このスカラーを訓練することで、モデルは元の事前訓練された重みを保持することと低ランク適応を許可することのバランスを最適に学習できます。

```python
# 'use_scalar'フラグがTrueに設定されているかチェック
if use_scalar:
    # Trueの場合、開始値0.0で学習可能なパラメータ'scalar'を初期化します。
    # このパラメータはトレーニングプロセス中に最適化されます。
    self.scalar = nn.Parameter(torch.tensor(0.0))
else:
    # 'use_scalar'フラグがFalseの場合、'scalar'を固定値1.0に設定します。
    # これは低ランクの重みがスケーリングなしで元の重みに加算されることを意味します。
    self.scalar = torch.tensor(1.0)
```

`use_scalar`フラグにより、モデルは低ランクの重みが最終的な重みにどの程度影響を与えるべきかを決定できます。`use_scalar`が`True`の場合、モデルはトレーニング中に`self.scalar`の最適値を学習でき、これは低ランクの重みを元の重みに加える前に乗算されます。これにより、元の事前訓練された重みと新しい低ランク適応のバランスを取る方法が提供され、潜在的により良いパフォーマンスとより効率的なトレーニングにつながります。`self.scalar`の初期値が`0.0`であることは、モデルが低ランクの重みからの寄与なしで開始し、トレーニング中に適切なスケールを学習することを示唆しています。

---

###### `rank_dropout_scale`

ドロップアウトマスクを平均値1にスケーリングするかどうかを決定するブールフラグです。これは、ドロップアウト適用後にテンソル値の元のスケールを維持したい場合に特に有用で、トレーニングプロセスの安定性にとって重要な場合があります。

```python
def forward(self, orig_weight, org_bias, new_weight, new_bias, *args, **kwargs):
    # 'oft_blocks'テンソルが存在するデバイスを取得します。これにより、新しく作成されるテンソルが同じデバイス上に確実に配置されます。
    device = self.oft_blocks.device

    # ランクドロップアウトが有効で、モデルがトレーニングモードであるかチェックします。
    if self.rank_dropout and self.training:
        # 'oft_blocks'と同じ形状のランダムテンソルを作成し、一様分布から値を抽出します。
        # その後、各値が'self.rank_dropout'確率より小さいかどうかをチェックしてドロップアウトマスクを作成します。
        drop = (torch.rand(self.oft_blocks, device=device) < self.rank_dropout).to(
            self.oft_blocks.dtype
        )

        # 'rank_dropout_scale'がTrueの場合、ドロップアウトマスクを平均値1にスケーリングします。
        # これはドロップアウト適用後もテンソル値のスケールを維持するのに役立ちます。
        if self.rank_dropout_scale:
            drop /= drop.mean()
    else:
        # ランクドロップアウトが有効でないか、モデルがトレーニングモードでない場合、'drop'を1に設定します（ドロップアウトなし）。
        drop = 1
```

---

###### `algo`

使用するLyCORISアルゴリズムです。実装されているアルゴリズムの[リスト](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Algo-List.md)と[説明](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Algo-Details.md)、[デモ](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Demo.md)を確認できます。また、[研究論文](https://arxiv.org/pdf/2309.14859.pdf)も参照できます。

---

###### `train_norm`

`(IA)^3`を除くすべてのアルゴリズムで使用される正規化層をトレーニングするかどうかを制御します。

---

###### `block_dims`

各ブロックのランクを指定します。正確に25個の数値が必要なため、この行が非常に長くなっています。

---

###### `block_alphas`

各ブロックのアルファを指定します。これも25個の数値が必要で、指定しない場合は代わりに`network_alpha`が値として使用されます。

---

以上で`network_args`の説明は終わりです。

---

##### `--network_dropout`

このfloatは、トレーニング中にトレーニングするニューロンのドロップアウトを制御します。`0`または`None`はデフォルトの動作（ドロップアウトなし）で、`1`はすべてのニューロンをドロップします。`weight_decompose=True`を使用すると`network_dropout`を無視し、ランクとモジュールのドロップアウトのみが適用されます。

```python
    --network_dropout=0 \
```

---

##### `--lr_scheduler`

PyTorchの学習率スケジューラは、トレーニング中に学習率を調整するツールです。これは、モデルのパフォーマンスに応じて学習率を調整することで、トレーニング速度を向上させ、トレーニング時間を短縮するために使用されます。

可能な値：`linear`, `cosine`, `cosine_with_restarts`, `polynomial`, `constant` (default), `constant_with_warmup`, `adafactor`

注意：`adafactor`スケジューラは`adafactor`オプティマイザーでのみ使用できます！

```python
    --lr_scheduler="cosine" \
```

---

##### `--lr_scheduler_num_cycles`

コサインスケジューラの再スタート回数。他のスケジューラでは使用されません。

```py
    --lr_scheduler_num_cycles=1 \
```

---

##### `--learning_rate` と `--unet_lr` と `--text_encoder_lr`

学習率は、ネットワークの重みを推定誤差に応じて更新する度合いを決定します。学習率が大きすぎる場合、重みは最適解をオーバーシュートする可能性があります。小さすぎる場合、重みはサブオプティマル解にとどまる可能性があります。

AdamWの場合、最適なLRは`0.0001`または`1e-4`のようになります。

```py
    --learning_rate=0.0001 --unet_lr=0.0001 --text_encoder_lr=0.0001
```

---

##### `--network_dim`

ネットワークランク（次元）は、LoRAがトレーニングするフィーチャーの数を決定します。ネットワークアルファとUnet + TE学習率、そしてもちろんデータセットの品質と密接に関連しています。これらの値を個人的に実験することを強くお勧めします。

```py
    --network_dim=8
```

---

##### `--output_name`

出力名を指定します（ファイル拡張子を除く）。

**警告**：これが空のままになる場合、最後のエポックが保存されません！

```py
    --output_name="last"
```

---

##### `--scale_weight_norms`

Max-norm正規化は、各隠れユニットに入力ベクトルのノルムを固定された定数に上限する手法です。これにより、ニューラルネットワークの深層学習の安定性を向上させ、モデルのパフォーマンスを向上させます。

Dropoutはネットワークアーキテクチャを変更せずに重みに影響を与えますが、Max-Norm正規化はネットワークの重みを直接変更します。両者ともに、オーバーフィットを防ぎ、モデルの一般化を向上させるために使用されます。これについては[この研究論文](https://www.cs.toronto.edu/~rsalakhu/papers/srivastava14a.pdf)で詳しく説明されています。

```py
    --scale_weight_norms=1.0
```

---

##### `--max_grad_norm`

もう知られているように、勾配クリッピングです。トレーニング中に勾配が爆発することに気づいた場合、`--max_grad_norm`パラメータを調整することを検討してください。これはバックプロパゲーション中に勾配に適用されますが、`--scale_weight_norms`はニューラルネットワークの重みに適用されます。これにより、両者が互いに補完し、学習プロセスの安定化とモデルのパフォーマンスの向上に役立ちます。

```py
    --max_grad_norm=1.0
```

---

##### `--no_half_vae`

SDXL VAEの混合精度を無効にし、`float32`に設定します。非常に有用です。

---

##### `--save_every_n_epochs` と `--save_last_n_epochs` または `--save_every_n_steps` と `--save_last_n_steps`

- `--save_every_n_steps` と `--save_every_n_epochs`：ここで指定されたn-thステップまたはエポックでLoRAファイルが作成されます。
- `--save_last_n_steps` と `--save_last_n_epochs`：ここで指定された最後のn個の保存されたファイルを除くすべての保存されたファイルを破棄します。

学習は、`--max_train_epochs`または`--max_train_steps`で指定されたもので終了します。

```py
    --save_every_n_epochs=50
```

---

##### `--mixed_precision`

この設定は、トレーニング計算中に使用される数値精度を決定します。混合精度を選択すると、トレーニング速度を向上させ、メモリ使用量を削減できますが、潜在的な数値的不安定性を導入します。ここではオプションとそのトレードオフを分解します：

- "no"：完全な32ビット精度を使用します。より遅くなりますが、より安定します。
- "fp16"：可能な場合は16ビット精度を使用しますが、必要な場合は32ビットにフォールバックします。これにより、トレーニング速度を向上させ、メモリ使用量を削減できますが、時には数値的不安定性につながる可能性があります。
- "bf16"：bfloat16精度を使用します。fp16とのバランスがとれていますが、fp16よりもメモリ保存の利点があります。

ハードウェアの機能と安定性の要件に基づいて慎重に選択してください。トレーニング中にNaN損失やその他の数値の問題が発生した場合は、完全な精度に切り替えるか、他のハイパーパラメータを調整することを検討してください。

```py
    --mixed_precision="bf16"
```

---

##### `--save_precision`

このパラメータは保存されたモデルの重みの精度を決定します。これは、LoRAのファイルサイズとトレーニングされたLoRAの精度に影響を与える重要な選択です。ここでは何が必要かを知る必要があります：

- "fp32"：完全な32ビット精度。最も正確ですが、ストレージスペースを多く使用します。
- "fp16"：16ビット精度。精度とファイルサイズのバランスがとれていますが、ほとんどの使用例に適しています。
- "bf16"：bfloat16精度。fp16よりも広い範囲を提供しますが、精度が少なくなりますが、特定のハードウェアセットアップに役立ちます。

ストレージの制約と精度の要件に基づいて選択してください。もしわからない場合は、"fp16"が堅牢なデフォルトであり、ほとんどの状況で機能します。LoRAファイルサイズを過度に増加させることなく、精度を犠牲にすることはありません。

```py
    --save_precision="fp16"
```

##### `--caption_extension`

キャプションファイルのファイル拡張子。デフォルトは`.caption`です。これらのキャプションファイルには、トレーニング画像に関連するテキスト説明が含まれています。トレーニングスクリプトを実行するとき、この指定された拡張子を持つファイルをトレーニングデータフォルダに探します。スクリプトはこれらのファイルの内容を使用して、トレーニング中に画像にキャプションを提供するコンテキストを提供します。

例えば、画像が`image1.jpg`, `image2.jpg`, などと命名されている場合、デフォルトの.caption拡張子を使用すると、スクリプトはキャプションファイルを`image1.caption`, `image2.caption`, などと期待します。異なる拡張子を使用したい場合は、例えば`.txt`を使用して、スクリプトは`image1.txt`, `image2.txt`, などを期待します。

```py
    --caption_extension=".txt"
```

##### `--cache_latents` と `--cache_latents_to_disk`

これら2つのパラメータは、メモリ使用量を最適化し、トレーニングを加速するために連携して機能します：

- `--cache_latents`：このオプションは、トレーニング画像の潜在表現をメモリにキャッシュします。これにより、モデルは各トレーニングステップで画像を再エンコードする必要がなくなり、大規模なデータセットの場合に特にトレーニングを高速化するのに役立ちます。

- `--cache_latents_to_disk`：このオプションは、`--cache_latents`と組み合わせて使用され、キャッシュされた潜在をディスクに保存する代わりにメモリに保持します。これは、大規模なデータセットが利用可能なRAMを超える場合に特に有用です。

これらのオプションは、いくつかの利点を提供します：

1. トレーニングを高速化する：潜在を事前に計算してキャッシュすることで、各トレーニングステップの計算オーバーヘッドを削減します。
2. メモリ使用量を削減する：ディスクへのキャッシュは、大規模なデータセットの場合にメモリの管理を容易にします。
3. 一貫性を確保する：事前に計算された潜在は、各エポックで同じ潜在表現を使用することで、トレーニングの一貫性を確保します。

ただし、潜在をキャッシュすることは、大規模なデータセットの場合にディスクスペースを大量に使用する可能性があることに注意してください。`--cache_latents_to_disk`を使用する場合は、十分なストレージが利用可能であることを確認してください。

```py
    --cache_latents --cache_latents_to_disk
```

---

##### `--optimizer_type`

デフォルトのオプティマイザは`AdamW`であり、毎月追加される多くのものがあるため、すべてをリストすることはしません。本当に必要な場合は、リストを確認できますが、`AdamW`はこの時点で最適であるため、それを使用します！

```py
    --optimizer_type="AdamW"
```

---

##### `--dataset_repeats`

キャプションでデータセットを繰り返し、デフォルトでは`1`に設定されているため、`0`に設定します。

```py
    --dataset_repeats=0
```

---

##### `--max_train_steps`

トレーニングステップまたはエポックの数を指定します。`--max_train_steps`と`--max_train_epochs`が指定されている場合、エポックの数が優先されます。

```py
    --max_train_steps=400
```

---

##### `--shuffle_caption`

`--caption_separator`で設定されたキャプションをシャッフルします。デフォルトでは`,`であり、これは私たちのキャプションがこのようになることを確認します：

> rating_questionable, 5 fingers, anthro, bent over, big breasts, blue eyes, blue hair, breasts, butt, claws, curved horn, female, finger claws, fingers, fur, hair, huge breasts, looking at viewer, looking back, looking back at viewer, nipples, nude, pink body, pink hair, pink nipples, rear view, solo, tail, tail tuft, tuft, by lunarii, by x-leon-x, mythology, krystal (darkmaster781), dragon, scalie, wickerbeast, The image showcases a pink-scaled wickerbeast a furred dragon creature with blue eyes., She has large breasts and a thick tail., Her blue and pink horns are curved and pointy and she has a slight smiling expression on her face., Her scales are shiny and she has a blue and pink pattern on her body., Her hair is a mix of pink and blue., She is looking back at the viewer with a curious expression., She has a slight blush.,

As you can tell, I have separated the caption part not just the tags with a `,` to make sure everything gets shuffled.

NOTE: `--cache_text_encoder_outputs` and `--cache_text_encoder_outputs_to_disk` can't be used together with `--shuffle_caption`. Both of these aim to reduce VRAM usage, you will need to decide between these yourself!

---

##### `--sdpa` または `--xformers` または `--mem_eff_attn`

各オプションはモデルで使用される注意機構に影響を与え、モデルのパフォーマンスとメモリ使用量に大きな影響を与えます。`--xformers`または`--mem_eff_attn`と`--spda`の選択は、GPUに依存します。これをベンチマークするために、繰り返しトレーニングすることをお勧めします！

- `--xformers`：このフラグはモデルでXFormersを使用することを可能にします。XFormersはFacebook Researchによって開発されたライブラリで、異なるハードウェアとユースケースに最適化されたトランスフォーマーモデルのコレクションを提供します。これらのモデルは、高い効率性、柔軟性、およびカスタマイズ可能な機能を提供します。これらは、限られたGPUメモリや大規模なデータを扱う必要があるシナリオで特に有益です。
- `--mem_eff_attn`：このフラグはモデルでメモリ効率の高い注意機構を使用することを可能にします。メモリ効率の高い注意は、トランスフォーマーモデルのトレーニング中にメモリフットプリントを削減することを目的として設計されており、大規模なモデルやデータを扱う際に特に有益です。
- `--sdpa`：このオプションはモデルでScaled Dot-Product Attention (SDPA)を使用することを可能にします。SDPAはトランスフォーマーモデルの基本コンポーネントであり、クエリとキーの間の注意スコアを計算します。これは、ドット積をキーの次元にスケーリングすることで、トレーニング中に勾配の安定化を支援します。この機構は長いシーケンスを処理するのに特に有用であり、潜在的にモデルの長距離依存関係をキャプチャする能力を向上させることができます。

```python
    --sdpa
```

---

##### `--multires_noise_iterations` と `--multires_noise_discount`

マルチレゾリューションノイズは、マルチレゾリューションで画像または潜在画像にノイズを追加する新しいアプローチです。この手法を使用してトレーニングされたモデルは、通常の拡散モデルの出力とは異なる視覚的に印象的な画像を生成できます。

この手法を使用してトレーニングされたモデルは、通常の拡散モデルの出力とは異なる視覚的に印象的な画像を生成できます。

この手法は、小規模なデータセットでは特に有益ですが、I don't think you should ever not use it.

`--multires_noise_discount`パラメータは、各レゾリューションでノイズ量を弱める度合いを制御します。0.1の値が推奨されます。`--multires_noise_iterations`パラメータは、マルチレゾリューションノイズを追加するイテレーションの数を決定し、推奨範囲は6から10です。

注意：`--multires_noise_discount`は`--multires_noise_iterations`なしでは機能しません。

###### 実装の詳細

`get_noise_noisy_latents_and_timesteps`関数は、ノイズを追加するためにサンプルされます。`args.noise_offset`がTrueの場合、ノイズオフセットを適用します。`args.multires_noise_iterations`がTrueの場合、サンプルされたノイズにマルチレゾリューションノイズを適用します。

関数は、各画像のランダムなタイムステップをサンプルし、各タイムステップのノイズの量に基づいてノイズを追加します。これは前方拡散プロセスです。

`pyramid_noise_like`関数は、ピラミッド構造のノイズを生成します。元のノイズから始め、解像度が低下するにつれてスケーリングされたノイズを追加します。各レベルのノイズは、ディスカウント係数をレベルの指数にしたものでスケーリングされます。ノイズは、概ね単位分散にスケーリングされます。この関数はマルチレゾリューションノイズを実装するために使用されます。

```python
    --multires_noise_iterations=10 --multires_noise_discount=0.1
```

---

##### `--sample_prompts` と `--sample_sampler` と `--sample_every_n_steps`

トレーニング中に画像を生成して進捗を確認するオプションを使用できます。引数を使用して異なるサンプラーを選択できますが、デフォルトでは`ddim`であるため、変更することをお勧めします！

`k_`プレフィックスはkarrasを意味し、`_a`サフィックスはancestralを意味します。

```py
    --sample_prompts=/training_dir/sample-prompts.txt --sample_sampler="euler_a" --sample_every_n_steps=100
```

私の推奨は、Ponyには`euler_a`を使用してトーンニールに使用し、リアルなものには`k_dpm_2`を使用することです。

サンプラーオプションには以下が含まれます：

```bash
ddim, pndm, lms, euler, euler_a, heun, dpm_2, dpm_2_a, dpmsolver, dpmsolver++, dpmsingle, k_lms, k_euler, k_euler_a, k_dpm_2, k_dpm_2_a
```

---

So, the whole thing would look something like this:

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
               "block_alphas=0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625" \
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

## 縮小化

---

トレーニングが完了し、最初のLoRAが作成されたので、サイズを大幅に<abbr title="LyCORISはこのプロセスで大幅に縮小されますが、通常のLoRAではこれはあまり目立ちません。ただし、ノイズは少なくなります！">\*</abbr>縮小しましょう。ファイルサイズの削減に加えて、これによりLoRAが他のモデルとより良く連携し、多くのLoRAが積み重ねられている状況で大きく役立ちます。適切な設定を使用すれば、出力の違いは無視できるほどわずかです。

このプロセスには[resize_lora](https://github.com/elias-gaeros/resize_lora)を使用します。

```bash
git clone https://github.com/elias-gaeros/resize_lora
cd resize_lora
```

Pythonの環境に`torch`、`tqdm`、`safetensors`がインストールされていることを確認してください。その後、以下のコマンドを実行します：

```bash
python resize_lora.py -o {output_directory} -r fro_ckpt=1,thr=-3.55 model.safetensors lora.safetensors
```

`{output_directory}`を希望の出力ディレクトリに、`model.safetensors`をLoRAのトレーニングに使用したチェックポイントまたは新しいLoRAを使用したいチェックポイントに、`lora.safetensors`を縮小したいLoRAに置き換えてください。

Feel free to experiment with any of the SVD recipes, which you can read about in the project's README, my recommendation is obviously just a personal bias, but I did try to [test](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/shrunk/by_beksinski-shrink-plot/beksinski-shrunk-plot.png?download=true), a [lot](https://huggingface.co/k4d3/yiff_toolkit/tree/main/static/shrunk), so others won't feel the need to!

## ステップとエポック

---

モデルをトレーニングする際、ステップとエポックの違いを理解することが重要です。両者はトレーニングプロセスにおいて重要な概念ですが、異なる目的を持っています。

### ステップ

ステップは、モデルがデータのバッチを処理し、そのバッチから計算された損失に基づいてパラメータを更新する、トレーニングプロセスの単一の反復を指します。ステップの数は通常、バッチサイズとトレーニングデータの総量によって決定されます。つまり、ステップはモデルのパラメータの単一の更新を意味します。

### エポック

一方、エポックは、トレーニングデータセット全体を1回通過することを表します。1エポックは、各バッチが一連のステップで処理される形で、データセット全体を1回処理することに相当します。エポックの数は、トレーニング中にモデルがデータセット全体を何回見るかを決定します。

例として、1000枚の画像を含むトレーニングデータセット、バッチサイズ10、合計10エポックを考えてみましょう：

- モデルは1エポックあたり100ステップを処理します（1000画像 / 10画像）。
- モデルはデータセット全体を10回見ることになり、各エポックは100ステップで構成されます。

ステップとエポックの区別を理解することは、学習率スケジュールなどのトレーニングパラメータの設定や、トレーニング中のモデルの進捗モニタリングにとって重要です。

### 勾配累積

勾配累積は、深層ニューラルネットワークのトレーニングにおけるメモリ要件を削減するための技術です。各反復で勾配を計算する代わりに、複数の反復にわたってモデルのパラメータに関する損失関数の勾配を累積します。これにより、より大きなバッチサイズとGPUメモリのより効率的な使用が可能になります。

LoRAトレーニングのコンテキストでは、勾配累積を使用してトレーニングプロセスの安定性と効率性を向上させることができます。複数の反復にわたって勾配を累積することで、モデルはデータのパターンをより効果的に認識できるようになり、パフォーマンスが向上します。

LoRAトレーニングで勾配累積を使用するには、トレーニングコマンドに以下の引数を追加します：

```bash
--gradient_accumulation_steps=6
```

各エポックのステップ数は、バッチサイズとトレーニングデータの総量によって決定されることに注意することが重要です。したがって、勾配累積を使用する場合、各エポックのステップ数は、バッチの数ではなく、トレーニングデータセット全体を処理するために必要な反復回数となります。この区別は、学習率スケジュールの設定やトレーニング中のモデルの進捗モニタリングにおいて重要です。

## Tensorboard

---

以下の設定を追加することでTensorboardを有効にできます：

```bash
    --log_prefix=xl-locon \
    --log_with=tensorboard \
    --logging_dir=/output_dir/logs \
```

もちろん、実際にトレーニングを表示するにはTensorboardを[インストール](https://www.tensorflow.org/install/pip)する必要があり、その後、出力ディレクトリで以下を使用するだけです：

```bash
tensorboard --logdir=logs
```

その後、ブラウザで[http://localhost:6006/](http://localhost:6006/)を開いて、お茶の葉を読むように...申し訳ありません！損失曲線を読むように試みることができます！
