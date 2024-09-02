---
weight: 2
bookFlatSection: false
bookToC: false
title: "LyCORIS Chopping"
---

<!--markdownlint-disable MD025 -->

# LyCORIS Chopping

LoRAs are super nice, but they can also be rambunctious at times! It is difficult to control during training what is going to be soaked into it.

You can always try to use block weight tools during image generation every time, but what do you do if you find the perfect vector string for one?

Let me quickly introduce `chop_blocks.py` by the absolute cutie Gaeros, who hid it in his [resize_lora](https://github.com/elias-gaeros/resize_lora) repository! >:3 This script is designed to analyze and filter LoRA layers. You can get it by cloning the previously mentioned repo:

```bash
git clone https://github.com/elias-gaeros/resize_lora
```

For character LoRAs you usually want `1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1` AKA Out-All, for Styles and Poses IDK!Needs testing: MID01 for poses / compositions

## Heavy Lifter

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
