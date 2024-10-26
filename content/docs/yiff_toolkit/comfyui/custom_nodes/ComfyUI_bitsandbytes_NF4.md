---
weight: 5
bookFlatSection: false
bookToC: false
title: "ComfyUI_bitsandbytes_NF4"
summary: "A custom node just for a flux model."
---

<!--markdownlint-disable MD025 MD033 -->

# ComfyUI_bitsandbytes_NF4

---

[Github Link](https://github.com/comfyanonymous/ComfyUI_bitsandbytes_NF4)

This lets you load in the [flux1-dev-bnb-nf4-v2](https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4/resolve/main/flux1-dev-bnb-nf4-v2.safetensors) and the [flux1-schnell-bnb-nf4](https://huggingface.co/silveroxides/flux1-nf4-weights/resolve/main/flux1-schnell-bnb-nf4.safetensors) models. For more information look at the [Model Page](https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4) Illyasviel made or silveroxide's [flux-nf4-weights](https://huggingface.co/silveroxides/flux1-nf4-weights) repository.

```bash
cd custom_nodes
git clone https://github.com/comfyanonymous/ComfyUI_bitsandbytes_NF4
```

You will want to use the `CheckpointLoaderNF4` node to load in the models.

![CheckpointLoaderNF4 Node](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/CheckpointLoaderNF4.png)

Here is an example workflow:

![Example NF4 Workflow](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/nf4_workflow.png)
