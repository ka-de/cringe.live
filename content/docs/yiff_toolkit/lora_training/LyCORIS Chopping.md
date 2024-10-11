---
weight: 2
bookFlatSection: false
bookToC: false
title: "LyCORIS Chopping"
---

<!--markdownlint-disable MD025 -->

# LyCORIS Chopping

LoRAs are super nice, but they can also be rambunctious at times! It is difficult to control during training what is going to be soaked into it.

You can always try to use block weight tools during image generation every time, there is one for [ComfyUI](https://github.com/ltdrdata/ComfyUI-Inspire-Pack?tab=readme-ov-file#lora-block-weight---this-is-a-node-that-provides-functionality-related-to-lora-block-weight) and one for [A1111](https://github.com/hako-mikan/sd-webui-lora-block-weight).

Let me quickly introduce `chop_blocks.py` by the absolute cutie Gaeros, who hid it in his [resize_lora](https://github.com/elias-gaeros/resize_lora) repository! >:3 This script is designed to analyze and filter LoRA layers. You can get it by cloning the previously mentioned repo:

```bash
git clone https://github.com/elias-gaeros/resize_lora
cd resize_lora
```

The vector strings used in chopping represent different layers of the neural network.

- 1: Keep this layer/block
- 0: Remove this layer/block

You can also use float values between 0 and 1 to control how much of the layer is kept.

The 21 positions in the vector string typically correspond to:

| Layers | Description            |
| ------ | ---------------------- |
| 1      | Global UNet weight     |
| 2-7    | Down blocks (6 layers) |
| 8-9    | Mid blocks (2 layers)  |
| 10-21  | Out blocks (12 layers) |

The global UNet weight is the first number and it actually isn't a layer, it controls the overall strength of the LoRA. We usually want to keep this at 1.

The down blocks are the next 6 layers, these are the layers that receive the image latents as input and produce the downsampled features.

The mid blocks are the next 2 layers, these are the layers that receive the downsampled features as input and produce the final low resolution features.

The out blocks are the final 12 layers, these are the layers that receive the low resolution features as input and progressively upsample them to produce the final output. They are responsible for reconstructing the details and refining the image at various scales.

Now, let's analyze each vector string preset I have collected:

<!--
For character LoRAs you usually want `1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1` AKA Out-All, for Styles and Poses IDK!Needs testing: MID01 for poses / compositions
-->

## Heavy Lifter

This enables only one out block, which seems to be the most important block for the final output.

```r
1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0
```

## Style

```r
1,0,0,0,1,1,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0
```

## Might be better

> NOTE: It chops pikachu's arms off

```r
1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0
```

## by_hamgas

```r
1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,0,0
```

## by_kenket

```r
1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
```

## by_serpent_x

```r
1,0,0,0,0,1,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0
```

## BEEG LAYERS

```r
1,0,0,0,1,1,0,1,1,0,1,0,1,1,1,0,0,0,0,0,0
```

## All The Layers

```r
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
```

## All-In

```r
1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0
```

## All-Mid

```r
1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0
```

## All-Out (Wolf-Link)

```r
1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1
```

## Squeak

```r
1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0 
```

## Ringdingding (Stoat)

```r
1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0
```

## Garfield (Character+Style)

```r
1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0
```

## Rutkowski

```r
1,1,1,1,1,1,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1
```
