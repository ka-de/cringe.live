---
weight: 1
bookFlatSection: false
bookToC: true
title: "LoRA Training Guide"
summary: "The LoRA Training Guide explains Low-Rank Adaptation (LoRA), a technique for fine-tuning large language and diffusion models efficiently by introducing small, trainable low-rank matrices instead of modifying all model parameters. This approach keeps the original model weights frozen and injects two additional matrices into each layer to learn necessary adjustments. LoRA is lightweight, making it feasible to train multiple adaptations without hefty storage requirements. The guide also compares LoRA with LyCORIS, an advanced extension that offers more control and flexibility, and introduces LoKr, which uses Kronecker products for matrix decomposition, enhancing memory efficiency and control over the adaptation process."
aliases:
  - /docs/yiff_toolkit/lora_training/
  - /docs/yiff_toolkit/lora_training
  - /docs/yiff_toolkit/Lora Training/
  - /docs/yiff_toolkit/Lora Training
  - /docs/yiff_toolkit/lora training
  - /docs/yiff_toolkit/lora training/
  - /docs/yiff_toolkit/lora_training_guide/
  - /docs/yiff_toolkit/lora_training_guide
  - /docs/yiff_toolkit/Lora Training Guide/
  - /docs/yiff_toolkit/Lora Training Guide
---

<!--markdownlint-disable MD025 MD033 MD034 -->

# LoRA Training Guide

---

## What are LoRAs?

---

LoRA (Low-Rank Adaptation) is a technique designed to facilitate the fine-tuning of large-scale language and diffusion models efficiently. Instead of overhauling the entire set of model parameters —which can number in the billions— LoRA introduces small, trainable "low-rank" matrices that adapt the model's behavior. This innovative approach was detailed in the paper ["LoRA: Low-Rank Adaptation of Large Language Models"](https://arxiv.org/abs/2106.09685) by researchers at Microsoft.

## Subsections

---

{{< section-noimg details >}}

## Installation Tips

---

Firstly, download kohya_ss' [sd-scripts](https://github.com/kohya-ss/sd-scripts), you need to set up your environment either like [this](https://github.com/kohya-ss/sd-scripts?tab=readme-ov-file#windows-installation) tells you for Windows, or if you are using Linux or Miniconda on Windows, you are probably smart enough to figure out the installation for it. I recommend always installing the latest [PyTorch](https://pytorch.org/get-started/locally/) in the virtual environment you are going to use, which at the time of writing is `2.2.2`. I hope future me has faster PyTorch!

Ok, just in case you aren't smart enough how to install the sd-scripts under Miniconda for Windows I actually "guided" someone recently, just so I can tell you about it:

```bash
# Installing sd-scripts
git clone https://github.com/kohya-ss/sd-scripts
cd sd-scripts

# Creating the conda environment and installing requirements
conda create -n sdscripts python=3.10.14
conda activate sdscripts
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
python -m pip install --use-pep517 --upgrade -r requirements.txt
python -m pip install --use-pep517 lycoris_lora
accelerate config
```

`accelerate config` will ask you a bunch of questions, you need to actually read each one and reply with the truth. In most cases the truth looks like this: `This machine, No distributed training, no, no, no, all, fp16`.

You might also want to install `xformers` or `bitsandbytes`.

```bash
# Installing xformers
# Use the same command just replace 'xformers' with any other package you may need.
python -m pip install --use-pep517 xformers

# Installing bitsandbytes for windows
python -m pip install --use-pep517 bitsandbytes --index-url=https://jllllll.github.io/bitsandbytes-windows-webui
```

---

### Pony Training

---

I'm not going to lie, it is a bit complicated to explain everything. But here is my best attempt going through some "basic" stuff and almost all lines in order.

#### Download Pony in Diffusers Format

I'm using the diffusers version for training I converted, you can download it using `git`.

```bash
git clone https://huggingface.co/k4d3/ponydiffusers
```

---

#### Sample Prompt File

A sample prompt file is used during training to sample images. A sample prompt for example might look like this for Pony:

```py
# anthro female kindred
score_9, score_8_up, score_7_up, score_6_up, rating_explicit, source_furry, solo, female anthro kindred, mask, presenting, white pillow, bedroom, looking at viewer, detailed background, amazing_background, scenery porn, realistic, photo --n low quality, worst quality, blurred background, blurry, simple background --w 1024 --h 1024 --d 1 --l 6.0 --s 40
# anthro female wolf
score_9, score_8_up, score_7_up, score_6_up, rating_explicit, source_furry, solo, anthro female wolf, sexy pose, standing, gray fur, brown fur, canine pussy, black nose, blue eyes, pink areola, pink nipples, detailed background, amazing_background, realistic, photo --n low quality, worst quality, blurred background, blurry, simple background --w 1024 --h 1024 --d 1 --l 6.0 --s 40
```

Please note that sample prompts should not exceed 77 tokens, you can use [Count Tokens in Sample Prompts](https://huggingface.co/k4d3/yiff_toolkit/blob/main/dataset_tools/Count%20Tokens%20in%20Sample%20Prompts.ipynb) from [/dataset_tools](https://huggingface.co/k4d3/yiff_toolkit/tree/main/dataset_tools) to analyze your prompts.

If you are training with multiple GPUs, ensure that the total number of prompts is divisible by the number of GPUs without any remainder or a card will idle.

---

#### Training Commands

---

##### `accelerate launch`

For two GPUs:

```python
accelerate launch --num_processes=2 --multi_gpu --num_machines=1 --gpu_ids=0,1 --num_cpu_threads_per_process=2  "./sdxl_train_network.py"
```

Single GPU:

```python
accelerate launch --num_cpu_threads_per_process=2 "./sdxl_train_network.py"
```

---

&nbsp;

And now lets break down a bunch of arguments we can pass to `sd-scripts`.

&nbsp;

##### `--lowram`

If you are running running out of system memory like I do with 2 GPUs and a really fat model that gets loaded into it per GPU, this option will help you save a bit of it and might get you out of OOM hell.

---

##### `--pretrained_model_name_or_path`

The directory containing the checkpoint you just downloaded. I recommend closing the path if you are using a local diffusers model with a `/`. You can also specify a `.safetensors` or `.ckpt` if that is what you have!

```python
    --pretrained_model_name_or_path="/ponydiffusers/"
```

---

##### `--output_dir`

This is where all the saved epochs or steps will be saved, including the last one. If y

```python
    --output_dir="/output_dir"
```

---

##### `--train_data_dir`

The directory containing the dataset. We prepared this earlier together.

```python
    --train_data_dir="/training_dir"
```

---

##### `--resolution`

Always set this to match the model's resolution, which in Pony's case it is 1024x1024. If you can't fit into the VRAM, you can decrease it to `512,512` as a last resort.

```python
    --resolution="1024,1024"
```

---

##### `--enable_bucket`

Creates different buckets by pre-categorizing images with different aspect ratios into different buckets. This technique helps to avoid issues like unnatural crops that are common when models are trained to produce square images. This allows the creation of batches where every item has the same size, but the image size of batches may differ.

---

##### `--bucket_no_upscale`

Affects the resolution of images processed by the network by disabling any upscaling of images. When this option is set, the network will only downscale images to fit within the maximum area specified by `self.max_area` if the image’s $width \times height$ exceeds this value.

1. The `select_bucket` function checks if downscaling is needed: If the product of `image_width` and `image_height` is greater than `self.max_area`, the image is too large and must be downscaled while maintaining its aspect ratio.
2. Then it calculates the width and height that the image should be resized to, such that the resized image’s area does not exceed `self.max_area` and the aspect ratio is preserved.
3. The `round_to_steps` function is used to round the resized dimensions to the nearest multiple of `self.reso_steps`, which is a parameter that defines the step size for resolution buckets.
4. The code compares the aspect ratio of the width and height after rounding to decide which dimension to prioritize in order to minimize the error in aspect ratio after resizing.
5. Based on the smaller aspect ratio error, it chooses the resized dimensions that best maintain the original aspect ratio of the image.

In summary, the `select_bucket` function is ensuring that when downscaling is necessary, the image is resized to dimensions that are multiples of the resolution step size (`self.reso_steps`) and as close as possible to the original aspect ratio, without exceeding the maximum allowed area (`self.max_area`). **Upscaling is not performed when** `--bucket_no_upscale` **is set.**

---

##### `--min_bucket_reso` and `--max_bucket_reso`

Specifies the minimum and maximum resolutions used by the buckets. These values are ignored if `--bucket_no_upscale` is set.

```python
    --min_bucket_reso=256 --max_bucket_reso=1024
```

---

##### `--network_alpha`

Specifies how many of the trained Network Ranks are allowed to alter the base model.

```python
    --network_alpha=4
```

---

##### `--save_model_as`

You can use this to specify either `ckpt` or `safetensors` for the file format.

```python
    --save_model_as="safetensors"
```

---

##### `--network_module`

Specifies which network module you are going to train.

```python
    --network_module="lycoris.kohya"
```

---

##### `--network_args`

The arguments passed down to the network.

```python
    --network_args \
               "use_reentrant=False" \
               "preset=full" \
               "conv_dim=256" \
               "conv_alpha=4" \
               "use_tucker=False" \
               "use_scalar=False" \
               "rank_dropout_scale=False" \
               "algo=locon" \
               "train_norm=False" \
               "block_dims=8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8" \
               "block_alphas=0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625" \
```

**Let's break it down!**

---

###### `preset`

The [Preset](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Preset.md)/config system added to LyCORIS for more fine-grained control.

- `full`
  - default preset, train all the layers in the UNet and CLIP.
- `full-lin`
  - `full` but skip convolutional layers.
- `attn-mlp`
  - "kohya preset", train all the transformer block.
- `attn-only`
  - only attention layer will be trained, lot of papers only do training on attn layer.
- `unet-transformer-only`
  - as same as kohya_ss/sd_scripts with disabled TE, or, attn-mlp preset with train_unet_only enabled.
- `unet-convblock-only`
  - only ResBlock, UpSample, DownSample will be trained.

---

###### `conv_dim` and `conv_alpha`

The convolution dimensions are related to the rank of the convolution in the model, adjusting this value can have a [significant impact](https://ashejunius.com/alpha-and-dimensions-two-wild-settings-of-training-lora-in-stable-diffusion-d7ad3e3a3b0a) and lowering it affected the aesthetic differences between different LoRA samples. and an alpha value of `128` was used for training a specific character's face while Kohaku recommended to set this to `1` for both LoCon and LoHa.

```python
conv_block_dims = [conv_dim] * num_total_blocks
conv_block_alphas = [conv_alpha] * num_total_blocks
```

---

###### `module_dropout` and `dropout` and `rank_dropout`

{{< responsive-svg src="/svg/dropout.svg" alt="Dropout in neural networks" >}}

`rank_dropout` is a form of dropout, which is a regularization technique used in neural networks to prevent overfitting and improve generalization. However, unlike traditional dropout which randomly sets a proportion of inputs to zero, `rank_dropout` operates on the rank of the input tensor `lx`. First a binary mask is created with the same rank as `lx` with each element set to `True` with probability `1 - rank_dropout` and `False` otherwise. Then the `mask` is applied to `lx` to randomly set some of its elements to zero. After applying the dropout, a scaling factor is applied to `lx` to compensate for the dropped out elements. This is done to ensure that the expected sum of `lx` remains the same before and after dropout. The scaling factor is `1.0 / (1.0 - self.rank_dropout)`.

It’s called “rank” dropout because it operates on the rank of the input tensor, rather than its individual elements. This can be particularly useful in tasks where the rank of the input is important.

If `rank_dropout` is set to `0`, it means that no dropout is applied to the rank of the input tensor `lx`. All elements of the mask would be set to `True` and when the mask gets applied to `lx` all of it's elements would be retained and when the scaling factor is applied after dropout it's value would just equal `self.scale` because `1.0 / (1.0 - 0)` is `1`. Basically, setting this to `0` effectively disables the dropout mechanism but it will still do some meaningless calculations, and you can't set it to None, so if you really want to disable dropouts simply don't specify them! 😇

```python
def forward(self, x):
    org_forwarded = self.org_forward(x)

    # module dropout
    if self.module_dropout is not None and self.training:
        if torch.rand(1) < self.module_dropout:
            return org_forwarded

    lx = self.lora_down(x)

    # normal dropout
    if self.dropout is not None and self.training:
        lx = torch.nn.functional.dropout(lx, p=self.dropout)

    # rank dropout
    if self.rank_dropout is not None and self.training:
        mask = torch.rand((lx.size(0), self.lora_dim), device=lx.device) > self.rank_dropout
        if len(lx.size()) == 3:
            mask = mask.unsqueeze(1)
        elif len(lx.size()) == 4:
            mask = mask.unsqueeze(-1).unsqueeze(-1)
        lx = lx * mask

        scale = self.scale * (1.0 / (1.0 - self.rank_dropout))
    else:
        scale = self.scale

    lx = self.lora_up(lx)

    return org_forwarded + lx * self.multiplier * scale
```

The network you are training needs to support it though! See [PR#545](https://github.com/kohya-ss/sd-scripts/pull/545) for more details.

---

###### `use_tucker`

Can be used for all but `(IA)^3` and native fine-tuning.

Tucker decomposition is a method in mathematics that decomposes a tensor into a set of matrices and one small core tensor reducing the computational complexity and memory requirements of the model. It is used in various LyCORIS modules on various blocks. In LoCon for example, if `use_tucker` is `True` and the kernel size `k_size` is not `(1, 1)`, then the convolution operation is decomposed into three separate operations.

1. A 1x1 convolution that reduces the number of channels from `in_dim` to `lora_dim`.
2. A convolution with the original kernel size `k_size`, stride `stride`, and padding `padding`, but with a reduced number of channels `lora_dim`.
3. A 1x1 convolution that increases the number of channels back from `lora_dim` to `out_dim`.

If `use_tucker` is `False` or not set, or if the kernel size k_size is `(1, 1)`, then a standard convolution operation is performed with the original kernel size, stride, and padding, and the number of channels is reduced from `in_dim` to `lora_dim`.

---

###### `use_scalar`

An additional learned parameter that scales the contribution of the low-rank weights before they are added to the original weights. This scalar can control the extent to which the low-rank adaptation modifies the original weights. By training this scalar, the model can learn the optimal balance between preserving the original pre-trained weights and allowing for low-rank adaptation.

```python
# Check if the 'use_scalar' flag is set to True
if use_scalar:
    # If True, initialize a learnable parameter 'scalar' with a starting value of 0.0.
    # This parameter will be optimized during the training process.
    self.scalar = nn.Parameter(torch.tensor(0.0))
else:
    # If the 'use_scalar' flag is False, set 'scalar' to a fixed value of 1.0.
    # This means the low-rank weights will be added to the original weights without scaling.
    self.scalar = torch.tensor(1.0)
```

The `use_scalar` flag allows the model to determine how much influence the low-rank weights should have on the final weights. If `use_scalar` is `True`, the model can learn the optimal value for `self.scalar` during training, which multiplies the low-rank weights before they are added to the original weights. This provides a way to balance between the original pre-trained weights and the new low-rank adaptations, potentially leading to better performance and more efficient training. The initial value of `0.0` for `self.scalar` suggests that the model starts with no contribution from the low-rank weights and learns the appropriate scale during training.

---

###### `rank_dropout_scale`

A boolean flag that determines whether to scale the dropout mask to have an average value of `1` or not. This is particularly useful when you want to maintain the original scale of the tensor values after applying dropout, which can be important for the stability of the training process.

```python
def forward(self, orig_weight, org_bias, new_weight, new_bias, *args, **kwargs):
    # Retrieve the device that the 'oft_blocks' tensor is on. This ensures that any new tensors created are on the same device.
    device = self.oft_blocks.device

    # Check if rank dropout is enabled and the model is in training mode.
    if self.rank_dropout and self.training:
        # Create a random tensor the same shape as 'oft_blocks', with values drawn from a uniform distribution.
        # Then create a dropout mask by checking if each value is less than 'self.rank_dropout' probability.
        drop = (torch.rand(self.oft_blocks, device=device) < self.rank_dropout).to(
            self.oft_blocks.dtype
        )

        # If 'rank_dropout_scale' is True, scale the dropout mask to have an average value of 1.
        # This helps maintain the scale of the tensor's values after dropout is applied.
        if self.rank_dropout_scale:
            drop /= drop.mean()
    else:
        # If rank dropout is not enabled or the model is not in training mode, set 'drop' to 1 (no dropout).
        drop = 1
```

---

###### `algo`

The LyCORIS algorithm used, you can find a [list](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Algo-List.md) of the implemented algorithms and an [explanation](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Algo-Details.md) of them, with a [demo](https://github.com/KohakuBlueleaf/LyCORIS/blob/HEAD/docs/Demo.md) you can also dig into the [research paper](https://arxiv.org/pdf/2309.14859.pdf).

---

###### `train_norm`

Controls whether to train normalization layers used by all algorithms except `(IA)^3` or not.

---

###### `block_dims`

Specify the rank of each block, it takes exactly 25 numbers, that is why this line is so long.

---

###### `block_alphas`

Specifies the alpha of each block, this too also takes 25 numbers if you don't specify it `network_alpha` will be used instead for the value.

---

That concludes the `network_args`.

---

##### `--network_dropout`

This float controls the drop of neurons out of training every step, `0` or `None` is default behavior (no dropout), 1 would drop all neurons. Using `weight_decompose=True` will ignore `network_dropout` and only rank and module dropout will be applied.

```python
    --network_dropout=0 \
```

---

##### `--lr_scheduler`

A learning rate scheduler in PyTorch is a tool that adjusts the learning rate during the training process. It’s used to modulate the learning rate in response to how the model is performing, which can lead to increased performance and reduced training time.

Possible values: `linear`, `cosine`, `cosine_with_restarts`, `polynomial`, `constant` (default), `constant_with_warmup`, `adafactor`

Note, `adafactor` scheduler can only be used with the `adafactor` optimizer!

```python
    --lr_scheduler="cosine" \
```

---

##### `--lr_scheduler_num_cycles`

Number of restarts for cosine scheduler with restarts. It isn't used by any other scheduler.

```py
    --lr_scheduler_num_cycles=1 \
```

---

##### `--learning_rate` and `--unet_lr` and `--text_encoder_lr`

The learning rate determines how much the weights of the network are updated in response to the estimated error each time the weights are updated. If the learning rate is too large, the weights may overshoot the optimal solution. If it’s too small, the weights may get stuck in a suboptimal solution.

For AdamW the optimal LR seems to be `0.0001` or `1e-4` if you want to impress your friends.

```py
    --learning_rate=0.0001 --unet_lr=0.0001 --text_encoder_lr=0.0001
```

---

##### `--network_dim`

The Network Rank (Dimension) is responsible for how many features your LoRA will be training. It is in a close relation with Network Alpha and the Unet + TE learning rates and of course the quality of your dataset. Personal experimentation with these values is strongly recommended.

```py
    --network_dim=8
```

---

##### `--output_name`

Specify the output name excluding the file extension.

**WARNING**: If for some reason this is ever left empty your last epoch won't be saved!

```py
    --output_name="last"
```

---

##### `--scale_weight_norms`

Max-norm regularization is a technique that constrains the norm of the incoming weight vector at each hidden unit to be upper bounded by a fixed constant. It prevents the weights from growing too large and helps improve the performance of stochastic gradient descent training of deep neural nets.

Dropout affects the network architecture without changing the weights, while Max-Norm Regularization directly modifies the weights of the network. Both techniques are used to prevent overfitting and improve the generalization of the model. You can learn more about both in this [research paper](https://www.cs.toronto.edu/~rsalakhu/papers/srivastava14a.pdf).

```py
    --scale_weight_norms=1.0
```

---

##### `--max_grad_norm`

Also known as Gradient Clipping, if you notice that gradients are exploding during training (loss becomes NaN or very large), consider adjusting the `--max_grad_norm` parameter, it operates on the gradients during the backpropagation process, while `--scale_weight_norms` operates on the weights of the neural network. This allows them to complement each other and provide a more robust approach to stabilizing the learning process and improving model performance.

```py
    --max_grad_norm=1.0
```

---

##### `--no_half_vae`

Disables mixed precision for the SDXL VAE and sets it to `float32`. Very useful if you don't like NaNs.

---

##### `--save_every_n_epochs` and `--save_last_n_epochs` or `--save_every_n_steps` and `--save_last_n_steps`

- `--save_every_n_steps` and `--save_every_n_epochs`: A LoRA file will be created at each n-th step or epoch specified here.
- `--save_last_n_steps` and `--save_last_n_epochs`: Discards every saved file except for the last `n` you specify here.

Learning will always end with what you specify in `--max_train_epochs` or `--max_train_steps`.

```py
    --save_every_n_epochs=50
```

---

##### `--mixed_precision`

This setting determines the numerical precision used during training computations. Opting for mixed precision can boost training speed and lower memory consumption, but it introduces potential numerical instability. Here's a breakdown of the options and their trade-offs:

- "no": Uses full 32-bit precision. It's slower but more stable.
- "fp16": Uses 16-bit precision where possible, falling back to 32-bit when necessary. This can speed up training and reduce memory usage, but may occasionally lead to numerical instability.
- "bf16": Uses bfloat16 precision. It offers a good balance between the range of 32-bit floats and the memory savings of 16-bit floats.

Choose wisely based on your hardware capabilities and stability requirements. If you encounter NaN losses or other numerical issues during training, consider switching to full precision or adjusting other hyperparameters.

```py
    --mixed_precision="bf16"
```

---

##### `--save_precision`

This parameter determines the precision of the saved model weights. It's a crucial choice that affects both the file size and the accuracy of your trained LoRA. Here's what you need to know:

- "fp32": Full 32-bit precision. It's the most accurate but takes up more storage space.
- "fp16": 16-bit precision. A good balance between accuracy and file size, suitable for most use cases.
- "bf16": bfloat16 precision. Offers a wider range than fp16 but with less precision, useful for certain hardware setups.

Choose based on your storage constraints and accuracy requirements. If you're not sure, "fp16" is a solid default that works well in most situations. It'll keep your LoRA file size reasonable without sacrificing too much precision.

```py
    --save_precision="fp16"
```

##### `--caption_extension`

The file extension for caption files. Default is `.caption`. These caption files contain text descriptions that are associated with the training images. When you run the training script, it will look for files with this specified extension in the training data folder. The script uses the content of these files as captions to provide context for the images during the training process.

For example, if your images are named `image1.jpg`, `image2.jpg`, and so on, and you use the default .caption extension, the script will expect the caption files to be named `image1.caption`, `image2.caption`, etc. If you want to use a different extension, like `.txt`, you would set the caption_extension parameter to `.txt`, and the script would then look for `image1.txt`, `image2.txt`, and so on.

```py
    --caption_extension=".txt"
```

##### `--cache_latents` and `--cache_latents_to_disk`

These two parameters work together to optimize memory usage and potentially speed up training:

- `--cache_latents`: This option caches the latent representations of your training images in memory. By doing this, the model doesn't need to re-encode the images into latents at every training step, which can significantly speed up training, especially for larger datasets.

- `--cache_latents_to_disk`: When used in conjunction with `--cache_latents`, this option allows the cached latents to be stored on disk instead of keeping them all in memory. This is particularly useful if you have a large dataset that exceeds your available RAM.

Using these options can provide several benefits:

1. Faster training: By pre-computing and caching latents, you reduce the computational overhead during each training step.
2. Reduced VRAM usage: Caching to disk can help manage memory more efficiently, especially for large datasets.
3. Consistency: Pre-computed latents ensure that the same latent representation is used for each image across epochs, which can lead to more stable training.

However, be aware that caching latents may use a significant amount of disk space, especially for large datasets. Make sure you have sufficient storage available when using `--cache_latents_to_disk`.

```py
    --cache_latents --cache_latents_to_disk
```

---

##### `--optimizer_type`

The default optimizer is `AdamW` and there are a bunch of them added every month or so, therefore I'm not listing them all, you can find the list if you really want, but `AdamW` is the best as of this writing so we use that!

```py
    --optimizer_type="AdamW"
```

---

##### `--dataset_repeats`

Repeats the dataset when training with captions, by default it is set to `1` so we'll set this to `0` with:

```py
    --dataset_repeats=0
```

---

##### `--max_train_steps`

Specify the number of steps or epochs to train. If both `--max_train_steps` and `--max_train_epochs` are specified, the number of epochs takes precedence.

```py
    --max_train_steps=400
```

---

##### `--shuffle_caption`

Shuffles the captions set by `--caption_separator`, it is a comma `,` by default which will work perfectly for our case since our captions look like this:

> rating_questionable, 5 fingers, anthro, bent over, big breasts, blue eyes, blue hair, breasts, butt, claws, curved horn, female, finger claws, fingers, fur, hair, huge breasts, looking at viewer, looking back, looking back at viewer, nipples, nude, pink body, pink hair, pink nipples, rear view, solo, tail, tail tuft, tuft, by lunarii, by x-leon-x, mythology, krystal \(darkmaster781\), dragon, scalie, wickerbeast, The image showcases a pink-scaled wickerbeast a furred dragon creature with blue eyes., She has large breasts and a thick tail., Her blue and pink horns are curved and pointy and she has a slight smiling expression on her face., Her scales are shiny and she has a blue and pink pattern on her body., Her hair is a mix of pink and blue., She is looking back at the viewer with a curious expression., She has a slight blush.,

As you can tell, I have separated the caption part not just the tags with a `,` to make sure everything gets shuffled.

NOTE: `--cache_text_encoder_outputs` and `--cache_text_encoder_outputs_to_disk` can't be used together with `--shuffle_caption`. Both of these aim to reduce VRAM usage, you will need to decide between these yourself!

---

##### `--sdpa` or `--xformers` or `--mem_eff_attn`

Each of these options modifies the attention mechanism used in the model, which can have a significant impact on the model's performance and memory usage. The choice between `--xformers` or `--mem_eff_attn` and `--spda` will depend on your GPU. You can benchmark it by repeating a training with them!

- `--xformers`: This flag enables the use of XFormers in the model. XFormers is a library developed by Facebook Research that provides a collection of transformer models optimized for different hardware and use-cases. These models are designed to be highly efficient, flexible, and customizable. They offer various types of attention mechanisms and other features that can be beneficial in scenarios where you have limited GPU memory or need to handle large-scale data.
- `--mem_eff_attn`: This flag enables the use of memory-efficient attention mechanisms in the model. The memory-efficient attention is designed to reduce the memory footprint during the training of transformer models, which can be particularly beneficial when working with large models or datasets.
- `--sdpa`: This option enables the use of Scaled Dot-Product Attention (SDPA) within the model. SDPA is a fundamental component of transformer models that calculates the attention scores between queries and keys. It scales the dot products by the dimensionality of the keys to stabilize gradients during training. This mechanism is particularly useful for handling long sequences and can potentially improve the model’s ability to capture long-range dependencies.

```python
    --sdpa
```

---

##### `--multires_noise_iterations` and `--multires_noise_discount`

Multi-resolution noise is a new approach that adds noise at multiple resolutions to an image or latent image during the training of diffusion models. A model trained with this technique can generate visually striking images with a distinct aesthetic compared to the usual outputs of diffusion models.

A model trained with multi-resolution noise can generate a more diverse range of images than regular stable diffusion, including extremely light or dark images. These have historically been challenging to achieve without resorting to using a large number of sampling steps.

This technique is particularly beneficial when working with small datasets but you I don't think you should ever not use it.

The `--multires_noise_discount` parameter controls the extent to which the noise amount at each resolution is weakened. A value of 0.1 is recommended. The `--multires_noise_iterations` parameter determines the number of iterations for adding multi-resolution noise, with a recommended range of 6 to 10.

Please note that `--multires_noise_discount` has no effect without `--multires_noise_iterations`.

###### Implementation Details

The `get_noise_noisy_latents_and_timesteps` function samples noise that will be added to the latents. If `args.noise_offset` is true, it applies a noise offset. If `args.multires_noise_iterations` is true, it applies multi-resolution noise to the sampled noise.

The function then samples a random timestep for each image and adds noise to the latents according to the noise magnitude at each timestep. This is the forward diffusion process.

The `pyramid_noise_like` function generates noise with a pyramid structure. It starts with the original noise and adds upscaled noise at decreasing resolutions. The noise at each level is scaled by a discount factor raised to the power of the level. The noise is then scaled back to roughly unit variance. This function is used to implement the multi-resolution noise.

```python
    --multires_noise_iterations=10 --multires_noise_discount=0.1
```

---

##### `--sample_prompts` and `--sample_sampler` and `--sample_every_n_steps`

You have the option of generating images during training so you can check the progress, the argument let's you pick between different samplers, by default it is on `ddim`, so you better change it!

You can also use `--sample_every_n_epochs` instead which will take precedence over steps. The `k_` prefix means karras and the `_a` suffix means ancestral.

```py
    --sample_prompts=/training_dir/sample-prompts.txt --sample_sampler="euler_a" --sample_every_n_steps=100
```

My recommendation for Pony is to use `euler_a` for toony and for realistic `k_dpm_2`.

Your sampler options include the following:

```bash
ddim, pndm, lms, euler, euler_a, heun, dpm_2, dpm_2_a, dpmsolver, dpmsolver++, dpmsingle, k_lms, k_euler, k_euler_a, k_dpm_2, k_dpm_2_a
```

---

So, the whole thing would look something like this:

```python
accelerate launch --num_cpu_threads_per_process=2  "./sdxl_train_network.py" \
    --lowram \
    --pretrained_model_name_or_path="/ponydiffusers/" \
    --train_data_dir="/training_dir" \
    --resolution="1024,1024" \
    --output_dir="/output_dir" \
    --enable_bucket \
    --min_bucket_reso=256 \
    --max_bucket_reso=1024 \
    --network_alpha=4 \
    --save_model_as="safetensors" \
    --network_module="lycoris.kohya" \
    --network_args \
               "preset=full" \
               "conv_dim=256" \
               "conv_alpha=4" \
               "use_tucker=False" \
               "use_scalar=False" \
               "rank_dropout_scale=False" \
               "algo=locon" \
               "train_norm=False" \
               "block_dims=8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8" \
               "block_alphas=0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625" \
    --network_dropout=0 \
    --lr_scheduler="cosine" \
    --learning_rate=0.0001 \
    --unet_lr=0.0001 \
    --text_encoder_lr=0.0001 \
    --network_dim=8 \
    --output_name="yifftoolkit" \
    --scale_weight_norms=1 \
    --no_half_vae \
    --save_every_n_epochs=50 \
    --mixed_precision="fp16" \
    --save_precision="fp16" \
    --caption_extension=".txt" \
    --cache_latents \
    --cache_latents_to_disk \
    --optimizer_type="AdamW" \
    --max_grad_norm=1 \
    --keep_tokens=1 \
    --max_data_loader_n_workers=8 \
    --bucket_reso_steps=32 \
    --multires_noise_iterations=10 \
    --multires_noise_discount=0.1 \
    --log_prefix=xl-locon \
    --gradient_accumulation_steps=6 \
    --gradient_checkpointing \
    --train_batch_size=8 \
    --dataset_repeats=0 \
    --max_train_steps=400 \
    --shuffle_caption \
    --sdpa \
    --sample_prompts=/training_dir/sample-prompts.txt \
    --sample_sampler="euler_a" \
    --sample_every_n_steps=100
```

## Shrinking

---

Now that your training is done and you have your first LoRA cooked, let's reduce it's size by a large<abbr title="LyCORIS shrinks down a lot by this process but this is less noticeable with regular LoRAs, you will still get less noise though!">\*</abbr> margin. Besides the reduced file size, this also helps your LoRA work better with other models and will greatly help in situations where there are quite a lot of them stacked together for an absolutely negligible difference in the output, which I would not define as _quality_, with the correct settings.

For this process we will be using [resize_lora](https://github.com/elias-gaeros/resize_lora).

```bash
git clone https://github.com/elias-gaeros/resize_lora
cd resize_lora
```

Make sure you have `torch`, `tqdm`, `safetensors` installed in your Python environment. Then run the following command:

```bash
python resize_lora.py -o {output_directory} -r fro_ckpt=1,thr=-3.55 model.safetensors lora.safetensors
```

Just replace `{output_directory}` with your desired output directory and `model.safetensors` with the checkpoint you used to train your LoRA, or the checkpoint you want to use your new LoRA with and `lora.safetensors` with your LoRA that you wish to shrink down.

Feel free to experiment with any of the SVD recipes, which you can read about in the project's README, my recommendation is obviously just a personal bias, but I did try to [test](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/shrunk/by_beksinski-shrink-plot/beksinski-shrunk-plot.png?download=true), a [lot](https://huggingface.co/k4d3/yiff_toolkit/tree/main/static/shrunk), so others won't feel the need to!

## Steps vs Epochs

---

When training a model, it's essential to understand the difference between steps and epochs. Both are crucial concepts in the training process, but they serve distinct purposes.

### Steps

A step refers to a single iteration of the training process, where the model processes a batch of data and updates its parameters based on the loss calculated from that batch. The number of steps is typically determined by the batch size and the total amount of training data. In other words, a step is a single update of the model's parameters.

### Epochs

An epoch, on the other hand, represents a complete pass through the entire training dataset. One epoch is equivalent to processing the entire dataset once, with each batch being processed in a sequence of steps. The number of epochs determines how many times the model sees the entire training dataset during training.

To illustrate the difference, consider a training dataset with 1000 images, a batch size of 10, and a total of 10 epochs. In this scenario:

- The model will process 100 steps per epoch (1000 images / 10 images per batch).
- The model will see the entire dataset 10 times, with each epoch consisting of 100 steps.

Understanding the distinction between steps and epochs is crucial for configuring training parameters, such as the learning rate schedule, and for monitoring the model's progress during training.

### Gradient Accumulation

Gradient accumulation is a technique used to reduce the memory requirements of training deep neural networks. It works by accumulating the gradients of the loss function with respect to the model's parameters over multiple iterations, rather than computing the gradients at each iteration. This allows for larger batch sizes and more efficient use of GPU memory.

In the context of LoRA training, gradient accumulation can be used to improve the stability and efficiency of the training process. By accumulating gradients over multiple iterations, the model can learn to recognize patterns in the data more effectively, leading to improved performance.

To use gradient accumulation in LoRA training, you can add the following argument to your training command:

```bash
--gradient_accumulation_steps=6
```

It's important to note that the number of steps in each epoch is determined by the batch size and the total amount of training data. Therefore, when using gradient accumulation, the number of steps in each epoch will be the number of iterations required to process the entire training dataset, rather than the number of batches. This distinction is important when configuring the learning rate schedule and monitoring the model's progress during training.

## Tensorboard

---

You can enable Tensorboard by adding the following to your configuration:

```bash
    --log_prefix=xl-locon \
    --log_with=tensorboard \
    --logging_dir=/output_dir/logs \
```

You will of course need to [install](https://www.tensorflow.org/install/pip) Tensorboard to actually view your training and after that you just need to use this in your output directory:

```bash
tensorboard --logdir=logs
```

After that you can open it up in your browser at [http://localhost:6006/](http://localhost:6006/) and try and read some tea leaves, uh, sorry! I meant loss curves!

---

---

{{< related-posts related="docs/yiff_toolkit/lora_training/Tracking-Training-Changes/ | docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/ | docs/yiff_toolkit/" >}}
