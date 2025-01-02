---
weight: 1
bookFlatSection: false
bookToC: false
title: "UNetSelfAttentionMultiply"
summary: "`UNetSelfAttentionMultiply`関数は、ネットワークの重要な画像特徴への注目を強化し、より正確で詳細な画像生成を実現します。"
---

<!--markdownlint-disable MD025 MD033 MD034 -->

# UNetSelfAttentionMultiply

<div style="display: flex; justify-content: center;">

![ComfyUIにおけるUNetSelfAttentionMultiplyノードの画像。](https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/UNetSelfAttentionMultiply.png)

</div>

U-Netなどの画像拡散ネットワークにおける`UNetSelfAttentionMultiply`関数は、スケーリングされたドット積計算においてクエリ（$q$）とキー（$k$）のベクトル値をスケールアップすることで、セルフアテンション機構を強化します。この調整により、画像内の関連する特徴への注目が強化され、ネットワークは画像の異なる部分間の複雑な詳細と関係をより良く捉えることができます。セルフアテンションを増幅することで、ネットワークは重要な特徴とそうでない特徴をより効果的に区別でき、より正確で詳細な画像生成プロセスが実現されます。

簡単に言えば、この関数は言語モデルの温度を調整するのと同様に、ネットワークのアテンション機構の微調整ノブとして機能します。セルフアテンションを増加させることで、ネットワークは画像の重要な側面をより正確に識別し強調することができ、より高品質で洗練された出力が得られます。この強化は、リアルな画像の生成や複雑なシーンの明瞭さを向上させるなど、高レベルの詳細さと正確さが必要なタスクで特に有用です。

![UNetSelfAttentionMultiplyの異なる値間のプロット](https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/plot3.png)

![UNetSelfAttentionMultiplyの異なる値間のプロット](https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/plot2.png)

![UNetSelfAttentionMultiplyの異なる値間のプロット](https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/plot.png)
