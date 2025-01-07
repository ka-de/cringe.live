---
weight: 1
bookFlatSection: false
bookToC: false
title: "ControlNet"
summary: "`union`について学びます。いいえ、玉ねぎ（onion）ではなく、`union`です！"
---

<!--markdownlint-disable MD025 MD033 -->

# ControlNet

---

## はじめに

---

このガイドを以前に書いていたら、これは非常に複雑な章になっていたでしょう。しかし幸いなことに、[xinsir/controlnet-union-sdxl-1.0](https://huggingface.co/xinsir/controlnet-union-sdxl-1.0)のおかげで、一日中説明する必要はなく、すべてを一度に説明できます。必要なのは、[これ](https://huggingface.co/xinsir/controlnet-union-sdxl-1.0/resolve/main/diffusion_pytorch_model_promax.safetensors)をダウンロードし、`xinsir-union-sdxl-1.0_promax.safetensors`のような意味のある名前に変更して、`models/controlnet`の中に置くだけです。

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-AnimateDiff-Evolved/ | docs/yiff_toolkit/comfyui/custom_nodes/Overly Complicated Sampling/ | docs/yiff_toolkit/comfyui/flux/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
