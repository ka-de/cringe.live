---
title: "DoRAの重み分解方向"
description: "DoRAの重み分解実装における入力次元と出力次元の正規化の理解"
weight: 6
bookToC: false
bookFlatSection: false
aliases:
  - /ja/docs/yiff_toolkit/lora_training/Weight-Decomposition-Direction/
  - /ja/docs/yiff_toolkit/lora_training/Weight-Decomposition-Direction
  - /ja/docs/yiff_toolkit/lora_training/Weight_Decomposition_Direction/
  - /ja/docs/yiff_toolkit/lora_training/Weight_Decomposition_Direction
  - /ja/docs/yiff_toolkit/lora_training/Weight Decomposition Direction/
  - /ja/docs/yiff_toolkit/lora_training/Weight Decomposition Direction
---

DoRA（Weight-Decomposed Low-Rank Adaptation）手法は、パラメータ効率の良い微調整のために重み分解を導入しています。正規化の方向に関する重要な実装の詳細について、特にLyCORIS実装での作業時に注意が必要です。

## 実装の詳細

DoRAの原論文では、重み分解は式(2)で以下のように定義されています：

$$ W = m \cdot \frac{V}{||V||_c} $$

ここで、$||·||_c$ は行列の各列ベクトルに対するベクトル単位のノルムを表します。ニューラルネットワークの重み行列に対して、このノルムは2つの方法で計算できます：

1. **入力次元**：各出力ニューロンの重みを列ベクトルとして扱う
2. **出力次元**：各入力ニューロンの寄与を列ベクトルとして扱う

## LyCORIS実装

オリジナルのLyCORIS実装では、デフォルトで入力次元に沿ってベクトル単位のノルムを計算します。ただし、以下の設定により出力次元に沿ったノルム計算を有効にすることができます：

```python
wd_on_output=True
```

この設定は、論文の定式化のより「正確な」解釈であると考える人もいます。

## なぜ重要か

正規化の方向の選択は、モデルのいくつかの側面に影響を与えます：大きさと方向の成分の分解方法に影響を与え、微調整プロセス中の学習ダイナミクスに影響を与え、最終的にモデルの適応行動を決定します。

両方のアプローチが機能する可能性がありますが、出力次元正規化（`wd_on_output=True`）を使用することで、原論文で意図された数学的定式化とより良く一致する可能性があります。ただし、特定のタスクとアーキテクチャに対してどちらのアプローチがより良く機能するかを判断するには、実証的な評価が推奨されます。

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/lora_training/dora/ | docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/comfyui/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
