---
weight: 1
bookFlatSection: false
bookToC: false
title: "10 Minute LoRA Training for the Ultimate Degenerates"
summary: "An offensive, unethical and biased guide on how to poop out awesome LoRAs with the bare minimal of effort and compute time."
aliases:
  - /docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/
  - /docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates
  - /docs/yiff_toolkit/lora_training/10 Minute SDXL LoRA Training for the Ultimate Degenerates/
  - /docs/yiff_toolkit/lora_training/10 Minute SDXL LoRA Training for the Ultimate Degenerates
---

<!--markdownlint-disable MD025 MD033 MD034 -->

# 10 Minute SDXL LoRA Training for the Ultimate Degenerates

---

## Training Montage

---

<div class="video-container">
  <video autoplay loop muted playsinline>
    <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/sd-scripts/blaidd_training.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

## Introduction

---

This method is a short, no hand-holding "guide" that describes a super-experimental method of training an SDXL LoRA in 80 steps, it works with both Pony Diffusion V6 XL and CompassMix XL and probably a few more others. The "10 Minute" in the title is just click bait, the training time will depend on your dataset and step size and how long ago your dad bought you your GPU, but it is pretty frigging fast! The 80 steps apply to characters and styles with 40 to 200 images in the dataset without any scaling issues, you will only need to adjust the output name between trainings! 😸

## Setup and Training

---

First, you'll need to get my sd-scripts fork or just the optimizer-specific changes into your fork. The way you can do that is described {{< i18n-link "/docs/yiff_toolkit/lora_training_guide/Add-Custom-Optimizers" "here" >}}, but instead of the optimizer on that page, we'll use [this](https://raw.githubusercontent.com/ka-de/sd-scripts/lodew/library/optimizers/clybius.py) one.

```bash
git clone https://github.com/ka-de/sd-scripts -b dev
```

The training settings I use are the following:

```bash
accelerate launch --num_cpu_threads_per_process=2  "./sdxl_train_network.py" \
    --pretrained_model_name_or_path=/models/ponyDiffusionV6XL_v6StartWithThisOne.safetensors \
    --train_data_dir=/training_dir \
    --resolution="1024,1024" \
    --output_dir="/output_dir" \
    --output_name="yifftoolkit-schnell" \
    --enable_bucket \
    --min_bucket_reso=256 \
    --max_bucket_reso=2048 \
    --network_alpha=4 \
    --save_model_as="safetensors" \
    --network_module="lycoris.kohya" \
    --network_args \
               "preset=full" \
               "conv_dim=256" \
               "conv_alpha=4" \
               "rank_dropout=0" \
               "module_dropout=0" \
               "use_tucker=False" \
               "use_scalar=False" \
               "rank_dropout_scale=False" \
               "algo=locon" \
               "dora_wd=False" \
               "train_norm=False" \
    --network_dropout=0 \
    --lr_scheduler="cosine" \
    --lr_scheduler_args="num_cycles=0.375" \
    --learning_rate=0.0003 \
    --unet_lr=0.0003 \
    --text_encoder_lr=0.0001 \
    --network_dim=8 \
    --no_half_vae \
    --flip_aug \
    --save_every_n_steps=1 \
    --mixed_precision="bf16" \
    --save_precision="fp16" \
    --cache_latents \
    --cache_latents_to_disk \
    --optimizer_type=ClybW \
    --max_grad_norm=1 \
    --max_data_loader_n_workers=8 \
    --bucket_reso_steps=32 \
    --multires_noise_iterations=12 \
    --multires_noise_discount=0.4 \
    --log_prefix=xl-locon \
    --log_with=tensorboard \
    --logging_dir=/output_dir/logs \
    --gradient_accumulation_steps=6 \
    --gradient_checkpointing \
    --train_batch_size=8 \
    --dataset_repeats=1 \
    --shuffle_caption \
    --max_train_steps=80 \
    --sdpa \
    --caption_extension=".txt" \
    --sample_prompts=/training_dir/sample-prompts.txt \
    --sample_sampler="euler_a" \
    --sample_every_n_steps=10
```

I highly recommend setting the `--sample_every_n_steps` to `1` at least once in your life so you can see how fast and what the LoRA learns, it is a sight to behold!

## Shrinking

---

Resize with [resize_lora](https://github.com/elias-gaeros/resize_lora).

```bash
python resize_lora.py -r fro_ckpt=1,thr=-3.55 {model_path} {lora_path}
```

## Chopping

---

In the git repository of `resize_lora` you'll find a cute little Python script called `chop_blocks.py`, you can use this to cut the layers out of your LoRA that do not contain any information about the character/style/concept you have trained.

When you run it, with the following arguments on the LoRA you trained (not the resized one)

```bash
python chop_blocks.py {lora_path} 
```

You'll be treated to this cryptic output that tells you which blocks contain how many layers:

```r
INFO: Blocks layout:
INFO:   [ 0]  input_blocks.1 layers=9
INFO:   [ 1]  input_blocks.2 layers=9
INFO:   [ 2]  input_blocks.3 layers=3
INFO:   [ 3]  input_blocks.4 layers=78
INFO:   [ 4]  input_blocks.5 layers=75
INFO:   [ 5]  input_blocks.6 layers=3
INFO:   [ 6]  input_blocks.7 layers=318
INFO:   [ 7]  input_blocks.8 layers=315
INFO:   [ 8]  middle_block.0 layers=9
INFO:   [ 9]  middle_block.1 layers=306
INFO:   [10]  middle_block.2 layers=9
INFO:   [11] output_blocks.0 layers=318
INFO:   [12] output_blocks.1 layers=318
INFO:   [13] output_blocks.2 layers=321
INFO:   [14] output_blocks.3 layers=78
INFO:   [15] output_blocks.4 layers=78
INFO:   [16] output_blocks.5 layers=81
INFO:   [17] output_blocks.6 layers=12
INFO:   [18] output_blocks.7 layers=12
INFO:   [19] output_blocks.8 layers=12
INFO: Vector string : "1,INP01,INP02,INP03,INP04,INP05,INP06,INP07,INP08,MID00,MID01,MID02,OUT00,OUT01,OUT02,OUT03,OUT04,OUT05,OUT06,OUT07,OUT08"
INFO: Pass through layers: 264
```

For example, to cut out everything but OUT01 or `output_blocks.1` you would have to use:

```bash
python chop_blocks.py {⚠️resized⚠️_lora_path} 1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0
```

Because the first number in the vector string is just for compatibility with a ComfyUI node I will mention in the next paragraph, you can forget about it, the next number after it is `input_blocks.1`!

In order for you to check which block contains what information I greatly recommend you install [ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack) and use the `Lora Loader (Block Weight)` node!

<div style="text-align: center;">

{{< blurhash
    src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/sd-scripts/lora_loader.png"
    blurhash="L3O|b2xuWBWB~qof4nWB%MofIUWU"
    width="1045"
    height="805"
    alt="The screenshot shows a user interface element from the ComfyUI-Inspire-Pack, specifically a node named “Lora Loader (Block Weight).” This node is part of a visual programming environment and includes various adjustable parameters. Key settings visible in the node are “model”, “clip”, “category_filter”, “lora_name”, “strength_model”, “strength_clip”, “inverse”, “control_after_generate”, and “preset” Each parameter has corresponding input fields or dropdown menus for user customization. The preset field contains a detailed alphanumeric string, representing a specific configuration."
>}}

</div>

Make sure you set `control_after_generate` to `fixed`!

You can also use the presets in there to check all IN, OUT or MID blocks, but the juicy stuff is mostly going to be in OUT1. <!-- ⚠️ TODO: I really need to train more LoRAs -->

Once you have figured out which blocks you want to keep, chop up the LoRA you just resized, and send your teeny-tiny LoRA to your friends on Discord without paying for Nitro! 😹

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
