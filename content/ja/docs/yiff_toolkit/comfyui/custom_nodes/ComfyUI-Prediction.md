---
weight: 2
bookFlatSection: false
bookToC: true
title: "ComfyUI-Prediction"
summary: ""
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# ComfyUI-Prediction

---

もう一つの素晴らしいカスタムノードです。AvoidとEraseを使用するには、以下のように設定する必要があります：

<!--
正直に言うと、いつか時間を取ってもう一度じっくり見直す必要があります。これは私の🐺🧠には少し複雑すぎます！
-->

![Prediction AvoidとErase](/images/comfyui/prediction_avoid_and_erase.png)

しかし、このカスタムノードが実際に何をしているのかを理解するために、まずはCFG predictionを再現してみましょう：

![CFG Predictionの再現](/images/comfyui/recreating_cfg_prediction.png)

ただし、これを構築した後は、`Ctrl`キーを押しながら全体を選択して削除してください。これは主に教育目的のためのものだったからです。

CFG Predictionを使用したい場合は、モデルパッチなどの恩恵を受けられるように、デフォルトのKSamplerを使用したデフォルトの設定を使用する方が良いでしょう。

また、Perp-NegとそのComfyUIでの様々な実装方法も見てみると良いでしょう。これを使えば、自分で設定することもできます。

以下のような感じになります：

![自作Perp-Neg](/images/comfyui/bootleg_perp-neg.png)

<!--
こんな邪悪なこともできます：

![邪悪な設定](/images/comfyui/evil_thing.png)

これが良いアイデアかどうかはわかりません。これが良いアイデアである理由を少なくとも1つは思いつきますが、私はただの🐺です！
-->

このように構築することもできます：

![別のPrediction](/images/comfyui/another_prediction.png)

そして、これは素晴らしい画像を生成する、もう一つの変わった予測モデルの構築例です：

![もう一つの変わったPrediction](/images/comfyui/another_weird_prediction.png)

---

{{< related-posts related="docs/yiff_toolkit/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI_bitsandbytes_NF4/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Manager/" >}}
