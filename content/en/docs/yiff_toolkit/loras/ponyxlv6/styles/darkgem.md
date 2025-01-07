---
weight: 1
bookFlatSection: false
bookToC: false
title: "darkgem"
summary: ""
aliases:
  - /docs/yiff_toolkit/loras/ponyxlv6/styles/darkgem/
  - /docs/yiff_toolkit/loras/ponyxlv6/styles/darkgem
---

<!--markdownlint-disable MD025 MD033 -->

# darkgem-v1e4

---

## Introduction

---

Digital painting style.

## Content

---

[⬇️ LoRA Download (58.4MB)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/ponyxl_loras/darkgem-v1e4.safetensors?download=true)

[⬇️ Shrunk LoRA Download (32.6MB)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/ponyxl_loras_shrunk_2/darkgem-v1e4_frockpt1_th-3.55.safetensors?download=true)

[🖼️ Sample Images with Metadata](https://huggingface.co/k4d3/yiff_toolkit/tree/main/static/{})

[📐 Dataset](https://huggingface.co/datasets/k4d3/furry/tree/main/by_darkgem)

[📊 Metadata](https://huggingface.co/k4d3/yiff_toolkit/raw/main/ponyxl_loras/darkgem-v1e4.json)

## Prompting Guide

---

Keyword:

- `darkgem` (Only use it if you want your character to end up `holding a dark red gem`)

I recommend first an `Euler a` with `40` steps, CFG set to `11` at 1024x1024 resolution and then a hi-res pass at 1536x1536 with `DPM++ 2M Karras` at 60 steps with denoise set between `0.40` and `0.69` for the highest levels of darkgem, but using `DPM++ 2M Karras` on both steps is also fine.

## Example Images

---

<div class="image-grid">
  <div class="image-grid-container">
    <a href="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/darkgem/00000859-04070924e.png">
      {{< blurhash
        src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/darkgem/00000859-04070924e-512.png"
        blurhash="LKF6tAMzELaL.ARPRiajy8IBIBxu"
        width="512"
        height="512"
        alt="Digital illustration featuring an anthropomorphic male werewolf with gray fur holding a large sword and sheathed dagger. He has muscular build prominent abs erect red uncircumcised ipenis and visible testicles. His expression shows confidence as he stands amidst lush green foliage in a forest setting. The character wears no clothing except for a blue cape draped over his shoulders. Background includes trees and sunlight filtering through leaves creating dappled light effects on the ground. This artwork is highly detailed showcasing realistic textures and shading typical of fantasy art styles. Artist unknown. Tags: furry anthro were-wolf warrior digital_art full_body muscular_male nudity nsfw weapon cape forest_background sunlight detailed_textures."
      >}}
    </a>
  </div>
</div>

---

---

{{< related-posts related="docs/yiff_toolkit/loras/ponyxlv6/styles/himari | docs/yiff_toolkit/loras/ponyxlv6/styles/clybius/ | docs/yiff_toolkit/loras/ponyxlv6/styles/realistic" >}}
