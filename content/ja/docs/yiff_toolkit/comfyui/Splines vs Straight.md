---
weight: 1
bookFlatSection: false
bookToC: true
title: "スプラインと直線の比較"
summary: "リンクのレンダリングモードに関する内部的な考察。"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# スプラインと直線の比較

---

ワークフローを構築している時は`Splines`（スプライン）に切り替える傾向がありますが、生成中は通常`Straight`（直線）に戻します。これは、ワークフローを移動するだけの時は直線の方が気が散らず、既に配置されたノード間の関係を追いやすいと感じるためです。一方、ワークフローを構築している時は`Splines`の方が追いやすいです。

![スプラインと直線の比較](/images/comfyui/splines_vs_straight.png)

---

---

{{< related-posts related="docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Prediction/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI_bitsandbytes_NF4/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI_IPAdapter_plus/" >}}
