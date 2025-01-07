---
weight: 1
bookFlatSection: false
bookToC: false
title: "himari"
summary: "[@147Penguinmw](https://twitter.com/147Penguinmw)による4枚の画像で学習した小規模なLoRA。"
---

<!--markdownlint-disable MD025 MD033 -->

# himari-v1e400

---

## はじめに

---

[@147Penguinmw](https://twitter.com/147Penguinmw)による4枚の画像で学習した小規模なLoRAです。

ひまりのアートスタイルは、日本の衣装や背景など、文化的な要素を豊富に取り入れたアニメの影響を受けた魅力的なブレンドです。優れたシェーディング技法、クリーンな線、鮮やかな色使いが特徴です。

## コンテンツ

---

[⬇️ LoRAダウンロード (229MB)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/ponyxl_loras/by_himari-v1e400.safetensors?download=true)

[⬇️ 圧縮版LoRAダウンロード (48.2MB)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/ponyxl_loras_shrunk_2/by_himari-v1e400_frockpt1_th-3.55.safetensors?download=true)

[🖼️ メタデータ付きサンプル画像](https://huggingface.co/k4d3/yiff_toolkit/tree/main/static/{})

[📐 データセット](https://huggingface.co/datasets/k4d3/furry/tree/main/by_himari)

[📊 メタデータ](https://huggingface.co/k4d3/yiff_toolkit/raw/main/ponyxl_loras/by_himari-v1e400.json)

## プロンプトガイド

---

キーワード：

- `by himari`

推奨設定として、まず`1024x1024`でCFG `11.0`、`Euler a`で生成し、その後`1536x1536`でCFG `6.0`、デノイズを`0.60`から`0.69`の間で設定し、`Euler a`または`DPM++ 2M Karras`を使用して二度目の生成を行うことをお勧めします。

### プロンプト例

> `score_9, score_8_up, score_7_up, score_6_up, source_furry, rating_explicit, on back, sexy pose, full-length portrait, pussy, solo, reptile, scalie, anthro female lizard, scales, blush, blue eyes, white body, blue body, plant, blue scales, white scales, detailed background, looking at viewer, furniture, digital media \(artwork\), This digital artwork image presents a solo anthropomorphic female reptile specifically a lizard with a white body adorned with detailed blue scales.,`

### 推奨ネガティブプロンプト

このLoRAは`blurry background`（ぼやけた背景）と`two tone body`（二色の体）に強いバイアスがかかっています。

## サンプル画像

---

<div class="image-grid">
  <div class="image-grid-container">
    <a href="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00000418-04190818.png">
      {{< blurhash
        src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00000418-04190818.png"
        blurhash="LIJ%Xu$QSz5QF?M|S}tQ~oM{E2-o"
        width="1024"
        height="1024"
        alt="ソファーでくつろぐピンクの鱗を持つ人型ドラゴンの女性。大きな角があり、肩から緩く垂れ下がった青いチェックシャツと黒いニーハイソックスを着用。両手で小さな本を持っている。背景には明るい壁に緑の観葉植物。キャラクターは外陰部と中程度の大きさの胸が見え、頬を赤らめて視聴者を直接見つめている。詳細なシェーディングとテクスチャーを持つデジタルアート。"
        grid="true"
      >}}
    </a>
    <a href="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00001078-04190837.png">
      {{< blurhash
        src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00001078-04190837.png"
        blurhash="LGD,fY_2m,S}~A%L%#NG$i%1IVH?"
        width="1536"
        height="1536"
        alt="白いクッションが置かれた赤いソファーで誘惑的にくつろぐターコイズ色の鱗を持つドラゴンの女性。ツインテールの薄緑色の髪で、カジュアルなベージュのシャツと暗色のパンツを着用。パンツを少し下げて性器を露出している。尾は体の周りに巻きつき、片手は露出した外陰部の上に置かれている。背景には大きな窓があり、外には豊かな緑が見える。滑らかなシェーディングとハイライトが特徴的な詳細なアートスタイル。"
        grid="true"
      >}}
    </a>
  </div>
</div>
<div class="image-grid">
  <div class="image-grid-container">
    <a href="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00000005-06011347.png">
      {{< blurhash
        src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00000005-06011347-small.png"
        blurhash="LMJ7q9^jD$~o$d-Pr;-p9GM{%2My"
        width="1400"
        height="1400"
        alt="金色の星の紋章が付いた紫の魔法使いの帽子と茶色の縁取りのある同色のマントを着た白毛のサモエド。鮮やかな緑の目をしており、首にはアミュレットを着用。カラフルな本が並ぶ木製の本棚を背景に、遊び心のあるポーズをとっている。鮮やかな色使いと詳細なシェーディングが特徴的なデジタルアートワーク。"
        grid="true"
      >}}
    </a>
    <a href="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00000007-06011350.png">
      {{< blurhash
        src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00000007-06011350.png"
        blurhash="LSH_MIsk%KxZ_MM}I=Rl~ARkM|Rj"
        width="1536"
        height="1536"
        alt="豊かな緑の葉と垂れ下がるつるに囲まれて座る人型カワウソのキャラクター。薄茶色の毛皮と短い尖った髪、明るい青い目をしており、白いTシャツの上に黒いパーカー、青いジーンズとスニーカーを着用。あぐらをかいて座り、片手で眼鏡を調整しながら視聴者を直接見つめている。表情はフレンドリーでリラックスしている。上からの柔らかな日差しが葉を通して差し込む屋外のシーン。現代のファーリーアートスタイルの特徴である詳細なテクスチャーとシェーディングが見られる。"
        grid="true"
      >}}
    </a>
  </div>
</div>
<div class="image-grid">
  <div class="image-grid-container">
    <a href="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00000033-06011636.png">
      {{< blurhash
        src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/by_himari/00000033-06011636-small.png"
        blurhash="LPJ%RA}=0gD*$~JAOYt6Y5s.#RoI"
        width="1400"
        height="1400"
        alt="ベッドで誘惑的に横たわるオレンジと白の毛皮を持つ人型オスのキツネを描いたデジタルイラスト。筋肉質な腕を持ち、足を組んで勃起したペニスと睾丸を見せている。視聴者を直接見つめる誘うような表情。部屋にはベージュの壁に棚があり、緑の鉢植えが置かれている。ベッドリネンには青緑のストライプが入っている。このアートワークは、キツネの解剖学的特徴とポーズに焦点を当てたエロティシズムと詳細なキャラクターデザインを組み合わせている。"
        grid="true"
      >}}
    </a>
  </div>
</div>

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/loras/ponyxlv6/styles/chunie/ | docs/yiff_toolkit/loras/ponyxlv6/styles/hld | docs/yiff_toolkit/loras/ponyxlv6/styles/realistic" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
