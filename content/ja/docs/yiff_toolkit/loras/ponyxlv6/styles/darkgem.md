---
weight: 1
bookFlatSection: false
bookToC: false
title: "darkgem"
summary: ""
---

<!--markdownlint-disable MD025 MD033 -->

# darkgem-v1e4

---

## はじめに

---

デジタルペインティングスタイル。

## コンテンツ

---

[⬇️ LoRAダウンロード (58.4MB)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/ponyxl_loras/darkgem-v1e4.safetensors?download=true)

[⬇️ 圧縮版LoRAダウンロード (32.6MB)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/ponyxl_loras_shrunk_2/darkgem-v1e4_frockpt1_th-3.55.safetensors?download=true)

[🖼️ メタデータ付きサンプル画像](https://huggingface.co/k4d3/yiff_toolkit/tree/main/static/{})

[📐 データセット](https://huggingface.co/datasets/k4d3/furry/tree/main/by_darkgem)

[📊 メタデータ](https://huggingface.co/k4d3/yiff_toolkit/raw/main/ponyxl_loras/darkgem-v1e4.json)

## プロンプトガイド

---

キーワード：

- `darkgem`（キャラクターに`暗赤色の宝石を持たせたい`場合のみ使用）

推奨設定：まず1024x1024の解像度で`Euler a`を使用し、ステップ数`40`、CFG値`11`に設定します。その後、1536x1536での高解像度パスを`DPM++ 2M Karras`で60ステップ、ノイズ除去を`0.40`から`0.69`の間に設定することで、最高レベルのdarkgem効果が得られます。両方のステップで`DPM++ 2M Karras`を使用しても問題ありません。

## サンプル画像

---

<div class="image-grid">
  <div class="image-grid-container">
    <a href="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/darkgem/00000859-04070924e.png">
      {{< blurhash
        src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/darkgem/00000859-04070924e-512.png"
        blurhash="LKF6tAMzELaL.ARPRiajy8IBIBxu"
        width="512"
        height="512"
        alt="灰色の毛皮を持つ人型オオカミのデジタルイラスト。大きな剣と鞘に収められた短剣を持っている。筋肉質な体格で目立つ腹筋、赤い勃起した包茎ではないペニスと睾丸が見える。森の中の生い茂った緑の葉の間に自信に満ちた表情で立っている。青いマントを肩にかけている以外は裸体。背景には木々があり、木漏れ日が地面に斑模様の光を作り出している。このアートワークは非常に詳細で、ファンタジーアートスタイルに典型的なリアルな質感とシェーディングを特徴としている。アーティスト不明。タグ：ファーリー アンスロ 狼男 戦士 デジタルアート 全身 筋肉質な男性 ヌード NSFW 武器 マント 森の背景 日光 詳細な質感。"
      >}}
    </a>
  </div>
</div>

---

---

{{< related-posts related="docs/yiff_toolkit/loras/ponyxlv6/styles/himari | docs/yiff_toolkit/loras/ponyxlv6/styles/clybius/ | docs/yiff_toolkit/loras/ponyxlv6/styles/realistic" >}}
