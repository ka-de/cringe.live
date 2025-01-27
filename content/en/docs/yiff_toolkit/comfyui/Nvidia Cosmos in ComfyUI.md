---
weight: 1
bookFlatSection: false
bookToC: true
title: "Nvidia Cosmos in ComfyUI"
description: "ComfyUI supports Nvidia's amazing 'World Models' with text and image to video capabilities"
---

# Nvidia Cosmos in ComfyUI

ComfyUI has just dropped support for Nvidia's groundbreaking "Cosmos" family of models, bringing state-of-the-art (SOTA) video generation capabilities to your workflow. These models, referred to as "World Models", represent a significant leap forward in AI image and video generation.

---

## Text to Video

Nvidia's Cosmos models excel in text-to-video (T2V) diffusion, offering highly detailed and coherent video outputs. ComfyUI currently supports the 7B and 14B variants, with the 7B models being more accessible—fitting on a 24GB GPU at full precision without offloading.

The text-to-video capabilities of Nvidia's Cosmos models are particularly impressive due to their advanced algorithmic design. Unlike traditional models, these tools don't require extensive fine-tuning or the use of negative prompts to achieve high-quality results. Instead, they can directly utilize provided text prompts to generate videos that are both visually stunning and thematically consistent.

Moreover, the models' variational autoencoder (VAE) architecture allows for highly flexible creativity. You can input both text and image prompts, enabling a wide range of artistic expression. Whether you're creating a sci-fi movie trailer or a whimsical animated short, the flexibility of these tools makes it easy to bring your vision to life.

---

## Image to Video

In addition to their text-to-video capabilities, Nvidia's Cosmos models also excel at generating videos from image prompts. This feature allows creators to craft unique animations by interpolating between multiple images or by combining motion and still frames in creative ways. One of the most notable features of this capability is that it defaults to generating movement whenever enough frames are specified—typically around 121 frames.

This behavior contrasts with traditional models, which often produce perfectly static outputs when given a single frame. With Nvidia's Cosmos models, users can expect natural and dynamic animations, even when creating short videos or individual frames. This flexibility makes the models particularly useful for projects that require a blend of motion and still imagery.

The image-to-video (IV2V) capability of Cosmos models behaves like an inpainting model. This means you can:

- Generate videos by interpolating between multiple images.
- Start a video from the last frame instead of the first for more natural results.
- Combine motion and still frames in creative ways.


### Unique Behaviors:
1. **Movement as Default**: Unlike traditional models, Cosmos always generates movement when you specify enough frames (e.g., 121).
2. **No Static Videos**: You won't get perfectly static outputs—even if you request a single frame.
3. **Guided Motion**: The model can follow motion prompts for more dynamic and lifelike animations.

---

## Known Limitations

While Nvidia's Cosmos is a powerhouse, there are some trade-offs:
1. **Frame Requirement**: **The model expects exactly 121 frames.**
2. **Low Resolution Limit**: The smallest supported resolution is 704p (1280x704).
3. **Longer Prompts Needed**: Negative prompts need to be detailed for optimal results.
4. **Processing Time**: Generating a 1280p video takes over 10 minutes on a high-end GPU like the 4090.

---

## Getting Started

### Download Models

You can find pre-trained models on Hugging Face:

- Text encoder:
    - [oldt5_xxl_f8_em3fn_scaled.safetensors](https://huggingface.co/comfyanonymous/cosmos_1.0_text_encoder_and_VAE_ComfyUI/resolve/main/text_encoders/oldt5_xxl_fp8_e4m3fn_scaled.safetensors)   (goes in `ComfyUI/models/text_encoders/`)
- VAE:
    - [cosmos_cv8x8x8_1.0.safetensors](https://huggingface.co/comfyanonymous/cosmos_1.0_text_encoder_and_VAE_ComfyUI/resolve/main/vae/cosmos_cv8x8x8_1.0.safetensors) (goes in `ComfyUI/models/vae/`)
- Diffusion Models:
    - [Cosmos-1_0-Diffusion-7B-Text2World.safetensors](https://huggingface.co/mcmonkey/cosmos-1.0/resolve/main/Cosmos-1_0-Diffusion-7B-Text2World.safetensors)
    - [Cosmos-1_0-Diffusion-7B-Video2World.safetensors](https://huggingface.co/mcmonkey/cosmos-1.0/resolve/main/Cosmos-1_0-Diffusion-7B-Video2World.safetensors)

    Both of them should go in `ComfyUI/models/diffusion_models/`.
