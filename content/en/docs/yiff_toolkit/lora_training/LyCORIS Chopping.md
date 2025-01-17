---
weight: 2
bookFlatSection: false
bookToC: false
title: "LyCORIS Chopping"
aliases: [
    "/docs/yiff_toolkit/lora_training/LyCORIS-Chopping/",
    "/docs/yiff_toolkit/lora_training/LyCORIS-Chopping",
    "/docs/yiff_toolkit/lora_training/LyCORIS Chopping/",
    "/docs/yiff_toolkit/lora_training/LyCORIS Chopping"
]
---

<!--markdownlint-disable MD025 -->

# LyCORIS Chopping

LoRAs can sometimes include unwanted elements or behaviors during training. "Chopping" allows you to selectively enable or disable different parts of a LoRA model to fine-tune its effects. This can help control style transfer, character consistency, and other attributes.

## Quick Solution: Block Weighting

You can use block weighting tools during generation:

- [ComfyUI Inspire Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack) - Includes LoRA block weight functionality
- [A1111 LoRA Block Weight](https://github.com/hako-mikan/sd-webui-lora-block-weight)

## Permanent Solution: Chopping

For a permanent solution, you can use `chop_blocks.py` by Gaeros to modify the LoRA file itself:

```bash
git clone https://github.com/elias-gaeros/resize_lora
cd resize_lora
```

### How to Use

```bash
python chop_blocks.py --model input.safetensors --save_to output.safetensors --vector "1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1"
```

## Understanding Vector Strings

Vector strings control which layers are kept or removed using values from 0 to 1:

- 1.0 = Keep layer completely
- 0.0 = Remove layer completely
- Values between = Partial effect

### Layer Mapping

| Position | Layers | Description | Common Usage |
| -------- | ------ | ----------- | ------------ |
| 1        | Global | Overall LoRA strength | Usually keep at 1 |
| 2-7      | Down   | Initial feature extraction | Style, composition |
| 8-9      | Mid    | Core processing | Poses, layouts |
| 10-21    | Out    | Detail reconstruction | Character details |

## Common Presets

| Preset Name | Vector |
|------------|---------|
| Character Focus | `1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0` |
| hamgas | `1,0,0,0,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,0,0` |
| kenket | `1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1` |
| serpent_x | `1,0,0,0,0,1,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0` |
| BEEG LAYERS | `1,0,0,0,1,1,0,1,1,0,1,0,1,1,1,0,0,0,0,0,0` |
| All The Layers | `1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1` |
| All-In | `1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0` |
| All-Mid | `1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0` |
| All-Out (Wolf-Link) | `1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1` |
| Style Transfer | `1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0` |
| Ringdingding (Stoat) | `1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0` |
| Garfield (Character+Style) | `1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0` |
| Rutkowski | `1,1,1,1,1,1,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1` |

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/ | docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
