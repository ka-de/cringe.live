---
weight: 5
bookFlatSection: false
bookToC: false
title: "ComfyUI_bitsandbytes_NF4"
summary: "fluxモデル専用のカスタムノード。"
---

<!--markdownlint-disable MD025 MD033 -->

# ComfyUI_bitsandbytes_NF4

---

[Githubリンク](https://github.com/comfyanonymous/ComfyUI_bitsandbytes_NF4)

このノードを使用すると、[flux1-dev-bnb-nf4-v2](https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4/resolve/main/flux1-dev-bnb-nf4-v2.safetensors)と[flux1-schnell-bnb-nf4](https://huggingface.co/silveroxides/flux1-nf4-weights/resolve/main/flux1-schnell-bnb-nf4.safetensors)モデルを読み込むことができます。詳細については、Illyasvielが作成した[モデルページ](https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4)やsilveroxideの[flux-nf4-weights](https://huggingface.co/silveroxides/flux1-nf4-weights)リポジトリをご覧ください。

```bash
cd custom_nodes
git clone https://github.com/comfyanonymous/ComfyUI_bitsandbytes_NF4
```

モデルを読み込むには`CheckpointLoaderNF4`ノードを使用します。

![CheckpointLoaderNF4ノード](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/CheckpointLoaderNF4.png)

以下はワークフローの例です：

![NF4ワークフローの例](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/nf4_workflow.png)

---

---

{{< related-posts related="docs/yiff_toolkit/comfyui/flux/ | docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Prediction/" >}}
