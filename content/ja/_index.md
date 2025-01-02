---
title: サイトについて
type: docs
bookToC: false
---

<!-- markdownlint-disable MD009 MD025 MD033 -->

<div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 20px;">
  <div style="flex: 1 1 300px; min-width: 0;">

{{< blurhash
    src="/images/kade-point-up-not-a-furry.png"
    blurhash="LIK-Xz010LkoM|t6_2IV%gM{xu-;"
    width="512"
    height="512"
    alt="白いオオカミの擬人化キャラクターで、緑の目をしており、紫の魔法使いの帽子と金の縁取りと赤い宝石のついたマントを着ています。キャラクターは上を指さしながら防御的な表情をしており、「私はファーリーじゃない！」というセリフの吹き出しが添えられています。"
>}}

  </div>
  <div style="flex: 1 1 300px; min-width: 0;">

```json
{
    "name": "Balazs Horvath",
    "birthDay": "1990-05-17",
    "❤️": [
      "🧠 機械学習",
      "🎮 ゲーム開発",
      "🎶 音楽",
      "🎨 アート",
      "🐺 オオカミ",
      "📖 読書",
      "🧘‍♀️ 瞑想",
      "🚴‍♂️ サイクリング",
      "🧁 料理"
    ],
    "languages": [
      "英語",
      "ハンガリー語",
      "ドイツ語"
    ]
}
```

  </div>
</div>

> (気まずい沈黙)
>
> ちょうど良いタイミングで生まれた不良のねぐらへようこそ。
>
> ここでは、画像生成に関する[Low-Rank Adaptations](/docs/yiff_toolkit/lora_training/)（LoRA）についての様々なメモを見つけることができます。主にPony Diffusion V6 XLに関するものですが、若干の修正で他のSDXLモデルにも簡単に適用できます。また、[Pony Diffusion](/docs/yiff_toolkit/loras/ponyxlv6/)、[Stable Diffusion 3.5 Large](/docs/yiff_toolkit/loras/3.5-large/)、[CompassMix](/docs/yiff_toolkit/loras/compassmix)用に自分で訓練したLoRAも提供しています。ファーリーではありませんが...😹...オオカミと擬人化キャラクターが好きで、`.safetensors`を共有するのが好きなんです。
> 
> これらの浮動小数点の副産物は自由に使ってください。ただし、販売したり画像生成サービスにアップロードしたりしないでください！🐺
> 
> ビジネスに関するお問い合わせは[メール](mailto:acsipont@gmail.com)でお願いします。
> 
> より多くのコンテンツについては、**[Yiff Toolkit](/docs/yiff_toolkit)** と[ComfyUI](/docs/comfyui)もチェックしてください！

<div style="display: flex; justify-content: center;">
  <a href="/docs/yiff_toolkit">
    {{< blurhash
      src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/realistic/fur_and_loathing_small.png"
      blurhash="LOE.qnE2bbkX_4t6kC-pOtxZWBxu"
      width="1400"
      height="595"
      alt="乾燥した砂漠の風景を走る2つの擬人化キャラクターを描いたCGIデジタルアートワーク。左側の暗褐色の毛皮のキャラクターはサングラスをかけ、ベージュのオープンカーの助手席で赤い缶を飲んでいます。運転席側の白い毛皮の犬型キャラクターは黒のアビエーターゴーグルとサファリハットを着用し、グレーのシャツとカーキのショートパンツを着ています。"
      grid="false"
    >}}
  </a>
</div>

<div id="quote-container"></div>

<script src="js/quotes.js"></script>

## サイトニュース

---

### 2024年12月27日

**サイトニュース:**

- ComfyUIフロントエンドにプログレスバーを追加する方法について[新しいセクション](/docs/yiff_toolkit/comfyui/ComfyUI_frontend-ProgressBars)を追加しました。

### 2024年12月25日

**新しいLoRA:**

- NoobAI用の[fart_fetish](/docs/yiff_toolkit/loras/noobai/concepts/fart_fetish)を追加。

### 2024年12月21日

**サイトニュース:**

- [chunie](/docs/yiff_toolkit/loras/ponyxlv6/styles/chunie) LoRAページの切れていたダウンロードリンクを修正しました。😳

### 2024年12月5日

**新しいLoRA:**

- Pony Diffusion V6 XL用の[hld](/docs/yiff_toolkit/loras/ponyxlv6/styles/hld)：ビデオゲーム「Hyper Light Drifter」のスタイルを再現。
- Pony Diffusion V6 XL用の[surrounded_by_penis](/docs/yiff_toolkit/loras/ponyxlv6/concepts/surrounded_by_penis)：複数の方向からペニスに囲まれたキャラクターの画像生成を支援。
- Pony Diffusion V6 XL用の[halloween_cattiva](/docs/yiff_toolkit/loras/ponyxlv6/characters/halloween_cattiva)：パンプキンヘッドのハロウィンテーマのPalworldのCattiva。
- Pony Diffusion V6 XL用の[blackorbit](/docs/yiff_toolkit/loras/ponyxlv6/styles/blackorbit)：VRChatに強く影響された3Dスタイル。
- Pony Diffusion V6 XL用の[gren_art](/docs/yiff_toolkit/loras/ponyxlv6/styles/gren_art)：リアルなスタイル。
- Stable Diffusion 3.5 Large用の[less_details](/docs/yiff_toolkit/loras/3.5-large/styles/less_details)：生成時のパレット、詳細、非ピクセル化部分の削減に有用。

### 2024年11月16日

**サイトニュース:**

- [LoRA Training](/docs/yiff_toolkit/lora_training/)ページにLoKrについての[新しいセクション](/docs/yiff_toolkit/lora_training/#lokr)を追加し、LoRAとは何か、どのように機能するかについての詳しい説明を追加しました。

### 2024年11月11日

**サイトニュース:**

- [LoRA Training](/docs/yiff_toolkit/lora_training/)ページにステップとエポックの違い、勾配累積の仕組みについての[新しいセクション](/docs/yiff_toolkit/lora_training/#steps-vs-epochs)を追加しました。
- [ComfyUI Custom Scripts](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/)ページの[Text Autocomplete](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/#text-autocomplete)セクションを書き直しました。

### 2024年11月3日

**新しいLoRA:**

- Stable Diffusion 3.5 Large用の[Night in the Woods](/docs/yiff_toolkit/loras/3.5-large/styles/nitw)スタイル。

**サイトニュース:**

- すべてのLoRAへのリンクを修正しました！これでより良くなりました、申し訳ありません！🐺

### 2024年11月2日

**新しいLoRA:**

- Pony Diffusion V6 XL用の[Amicus](/docs/yiff_toolkit/loras/ponyxlv6/characters/amicus)が待望のアップデートを受けました！
- Pony用の[wickerbeast](/docs/yiff_toolkit/loras/ponyxlv6/characters/wickerbeast) LoRAがリストに追加されました！

**サイトニュース:**

- ComfyUI用の[`UNetSelfAttentionMultiply`](/docs/yiff_toolkit/comfyui/UNetSelfAttentionMultiply)についての小さな記事で頭をクリアにしましょう。

### 2024年10月31日

**新しいLoRA:**

- ハッピーハロウィン！🎃 Pony Diffusion V6 XL用の[skunk](/docs/yiff_toolkit/loras/ponyxlv6/characters/skunk) LoRAをプレゼントとしてお受け取りください！🦨

### 2024年10月28日

**新しいLoRA:**

- Pony Diffusion V6 XL用の[Maliketh](/docs/yiff_toolkit/loras/ponyxlv6/characters/maliketh)が素晴らしいアップデートを受けました。

### 2024年10月24日

**サイトニュース:**

- サイトにBlurHashとして知られるプレースホルダー読み込み画像を実装しました。画像のエンコードに使用されたコードは[こちら](https://github.com/ka-de/blurhash)で見ることができます。これは[fpapado/blurhash-rust-wasm](https://github.com/fpapado/blurhash-rust-wasm)のde-WASM化および非同期バージョンで、フロントエンド部分には[mad-gooze/fast-blurhash](https://github.com/mad-gooze/fast-blurhash)を使用しています。

### 2024年10月11日

**新しいLoRA:**

- Pony Diffusion V6 XL用の[chunie](/docs/yiff_toolkit/loras/ponyxlv6/styles/by_chunie)がアップデートされました。

**サイトニュース:**

- [ComfyUIの読み込み時間の最適化](/docs/yiff_toolkit/comfyui/Optimizing-ComfyUI-Load-Times)についても書きました。 