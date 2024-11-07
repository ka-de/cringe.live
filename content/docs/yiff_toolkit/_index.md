---
weight: 1
bookFlatSection: false
bookToC: true
title: "イッフ＿ツールキット"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# イッフ＿ツールキット

---

## Introduction

---

The `yiff_toolkit` is a comprehensive set of tools designed to enhance your creative process in the realm of furry art. From refining artist styles to generating unique characters, the Yiff Toolkit provides a range of tools to help you cum.

> NOTE: You can click on any image in this README to be instantly teleported next to the original resolution version of it! If you want the metadata for a picture and it isn't there, you need to delete the letter e before the .png in the link! If a metadata containing original image is missing, please let me know!

## Subsections

---

{{< section details >}}

## Dataset Tools

---

I have uploaded all of the little handy Python and Rust scripts I use to [/dataset_tools](/docs/yiff_toolkit/dataset_tools/). They are pretty self explanatory by just the file name but almost all of them contain an AI generated descriptions. If you want to use them you will need to edit the path to your `training_dir` folder, the variable will be called `path` or `directory` and look something like this:

```py
def main():
    path = 'C:\\Users\\kade\\Desktop\\training_dir_staging'
```

Don't be afraid of editing Python scripts, unlike the real snake, these won't bite! In the worst case they'll just delete your files!

I also have this [thing](https://github.com/ka-de/dataset-tools)

## Dataset Preparation

---

Before you begin collecting your dataset you will need to decide what you want to teach the model, it can be a character, a style or a new concept.

For now let's imagine you want to teach your model _wickerbeasts_ so you can generate your VRChat avatar every night.

### Create the `training_dir` Directory

Before starting we need a directory where we'll organize our datasets. Open up a terminal by pressing `Win + R` and typing in `pwsh`. We will also be using [git](https://git-scm.com/download/win) and [huggingface](https://huggingface.co/) to version control our smut. For brevity I'll refrain from giving you a tutorial on both, but thankfully 🤗 wrote [one](https://huggingface.co/docs/hub/repositories-getting-started). Once you have your newly created dataset on HF ready lets clone it. Make sure you change `user` in the first line to your HF username!

```bat
git clone git@hf.co:/datasets/user/training_dir C:\training_dir
cd C:\training_dir
git branch wickerbeast
git checkout wickerbeast
```

Let's continue with downloading some _wickerbeast_ data but don't close the terminal window just yet, for this we'll make good use of the furry <abbr title="image board">booru</abbr> [e621.net](https://e621.net/). There are two nice ways to download data from this site with the metadata intact, I'll start with the fastest and then I will explain how you can selectively browse around the site and get the images you like one by one.

### Grabber

[Grabber](https://github.com/Bionus/imgbrd-grabber) makes your life easier when trying to compile datasets quickly from imageboards.

[![A screenshot of Grabber.](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/tutorial/grabber1.png)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/tutorial/grabber1.png)

Clicking on the `Add` button on the Download tab lets you add a `group` which will get downloaded, `Tags` will be the where you can type in the search parameters like you would on e621.net, so for example the string `wickerbeast solo -comic -meme -animated order:score` will search for solo wickerbeast pictures without including comics, memes, and animated posts in descending order of their scores. For training SDXL LoRAs you usually won't need more than 50 images, but you should set the solo group to `40` and add a new group with `-solo` instead of `solo` and set the `Image Limit` to `10` for it to include some images with other characters in it. This will help the model learn a lot better!

You should also enable `Separate log files` for e621, this will download the metadata automatically alongside the pictures.

[![Another screenshot of Grabber.](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/tutorial/grabber2.png)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/tutorial/grabber2.png)

For Pony I've set up the Text file content like so: `rating_%rating%, %all:separator=^, %` for other models you might want to replace `rating_%rating%` with just `%rating%`. For SeaArt/CompassMix I use `%all:separator=^, %, %rating%` for example.

You should also set the `Folder` into which the images will get downloaded. Let's use `C:\training_dir\1_wickerbeast` for both groups.

Now you are ready to right-click on each group and download the images.

#### Adding e6ai.net to Grabber

---

<details>
  <summary>Click to reveal steps</summary>
<!-- ⚠️ TODO: Write words lmao -->

[![A screenshot of Grabber.](/images/yt-grabber-adding-e6ai/1.png)](/images/yt-grabber-adding-e6ai/1.png)

[![A screenshot of Grabber.](/images/yt-grabber-adding-e6ai/2.png)](/images/yt-grabber-adding-e6ai/2.png)

[![A screenshot of Grabber.](/images/yt-grabber-adding-e6ai/3.png)](/images/yt-grabber-adding-e6ai/3.png)

[![A screenshot of Grabber.](/images/yt-grabber-adding-e6ai/4.png)](/images/yt-grabber-adding-e6ai/4.png)

</details>

### Manual Method

---

This method requires a browser extension like [ViolentMonkey](https://violentmonkey.github.io/) and [this](/docs/userscripts/e621.net-JSON-Button/) UserScript.

This will put a link to the JSON next to the download button on e621.net and e6ai.net and you can use [this](/docs/yiff_toolkit/dataset_tools/e621-JSON-to-Caption/) Python script to convert them to caption files, it uses the `rating_` prefix before `safe/questionable/explicit` because.. you've guessed it, Pony! It also lets you ignore the tags you add into `ignored_tags` using the `r"\btag\b",` syntax, just replace `tag` with the tag you want it to skip.

## Auto Taggers

---

### JTP2

---

[Link](https://huggingface.co/RedRocket/JointTaggerProject)

You can use my tagger script, just put it into the 2nd version's folder and call it on a directory full of images to get it all tagged.

You will also want `torch`, `safetensors`, Pillow and `timm` installed for this thing to work!

<details>
  <summary>Click to reveal source code.</summary>

```python
import os
import json
from PIL import Image
import safetensors.torch
import timm
from timm.models import VisionTransformer
import torch
from torchvision.transforms import transforms
from torchvision.transforms import InterpolationMode
import torchvision.transforms.functional as TF
import argparse

torch.set_grad_enabled(False)

class Fit(torch.nn.Module):
    def __init__(self, bounds: tuple[int, int] | int, interpolation=InterpolationMode.LANCZOS, grow: bool = True, pad: float | None = None):
        super().__init__()
        self.bounds = (bounds, bounds) if isinstance(bounds, int) else bounds
        self.interpolation = interpolation
        self.grow = grow
        self.pad = pad

    def forward(self, img: Image) -> Image:
        wimg, himg = img.size
        hbound, wbound = self.bounds
        hscale = hbound / himg
        wscale = wbound / wimg
        if not self.grow:
            hscale = min(hscale, 1.0)
            wscale = min(wscale, 1.0)
        scale = min(hscale, wscale)
        if scale == 1.0:
            return img
        hnew = min(round(himg * scale), hbound)
        wnew = min(round(wimg * scale), wbound)
        img = TF.resize(img, (hnew, wnew), self.interpolation)
        if self.pad is None:
            return img
        hpad = hbound - hnew
        wpad = wbound - wnew
        tpad = hpad // 2
        bpad = hpad - tpad
        lpad = wpad // 2
        rpad = wpad - lpad
        return TF.pad(img, (lpad, tpad, rpad, bpad), self.pad)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(bounds={self.bounds}, interpolation={self.interpolation.value}, grow={self.grow}, pad={self.pad})"

class CompositeAlpha(torch.nn.Module):
    def __init__(self, background: tuple[float, float, float] | float):
        super().__init__()
        self.background = (background, background, background) if isinstance(background, float) else background
        self.background = torch.tensor(self.background).unsqueeze(1).unsqueeze(2)

    def forward(self, img: torch.Tensor) -> torch.Tensor:
        if img.shape[-3] == 3:
            return img
        alpha = img[..., 3, None, :, :]
        img[..., :3, :, :] *= alpha
        background = self.background.expand(-1, img.shape[-2], img.shape[-1])
        if background.ndim == 1:
            background = background[:, None, None]
        elif background.ndim == 2:
            background = background[None, :, :]
        img[..., :3, :, :] += (1.0 - alpha) * background
        return img[..., :3, :, :]

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(background={self.background})"

transform = transforms.Compose([
    Fit((384, 384)),
    transforms.ToTensor(),
    CompositeAlpha(0.5),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5], inplace=True),
    transforms.CenterCrop((384, 384)),
])

model = timm.create_model("vit_so400m_patch14_siglip_384.webli", pretrained=False, num_classes=9083)  # type: VisionTransformer

class GatedHead(torch.nn.Module):
    def __init__(self, num_features: int, num_classes: int):
        super().__init__()
        self.num_classes = num_classes
        self.linear = torch.nn.Linear(num_features, num_classes * 2)
        self.act = torch.nn.Sigmoid()
        self.gate = torch.nn.Sigmoid()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.linear(x)
        x = self.act(x[:, :self.num_classes]) * self.gate(x[:, self.num_classes:])
        return x

model.head = GatedHead(min(model.head.weight.shape), 9083)
safetensors.torch.load_model(model, "JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors")

if torch.cuda.is_available():
    model.cuda()
    if torch.cuda.get_device_capability()[0] >= 7:  # tensor cores
        model.to(dtype=torch.float16, memory_format=torch.channels_last)

model.eval()

with open("tags.json", "r") as file:
    tags = json.load(file)  # type: dict
allowed_tags = list(tags.keys())

for idx, tag in enumerate(allowed_tags):
    allowed_tags[idx] = tag.replace("_", " ")

sorted_tag_score = {}

def run_classifier(image, threshold):
    global sorted_tag_score
    img = image.convert('RGBA')
    tensor = transform(img).unsqueeze(0)
    if torch.cuda.is_available():
        tensor = tensor.cuda()
        if torch.cuda.get_device_capability()[0] >= 7:  # tensor cores
            tensor = tensor.to(dtype=torch.float16, memory_format=torch.channels_last)
    with torch.no_grad():
        probits = model(tensor)[0].cpu()
        values, indices = probits.topk(250)
    tag_score = dict()
    for i in range(indices.size(0)):
        tag_score[allowed_tags[indices[i]]] = values[i].item()
    sorted_tag_score = dict(sorted(tag_score.items(), key=lambda item: item[1], reverse=True))
    return create_tags(threshold)

def create_tags(threshold):
    global sorted_tag_score
    filtered_tag_score = {key: value for key, value in sorted_tag_score.items() if value > threshold}
    text_no_impl = ", ".join(filtered_tag_score.keys())
    return text_no_impl, filtered_tag_score

def process_directory(directory, threshold):
    results = {}
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                image_path = os.path.join(root, file)
                image = Image.open(image_path)
                tags, _ = run_classifier(image, threshold)
                results[image_path] = tags
                # Save tags to a text file with the same name as the image
                text_file_path = os.path.splitext(image_path)[0] + ".txt"
                with open(text_file_path, "w") as text_file:
                    text_file.write(tags)
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run inference on a directory of images.")
    parser.add_argument("directory", type=str, help="Target directory containing images.")
    parser.add_argument("--threshold", type=float, default=0.2, help="Threshold for tag filtering.")
    args = parser.parse_args()

    results = process_directory(args.directory, args.threshold)
    for image_path, tags in results.items():
        print(f"{image_path}: {tags}")
```

</details>

### eva02-vit-large-448-8046

---

[Link](https://huggingface.co/Thouph/eva02-vit-large-448-8046)

You want to install the only dependency, besides torch, I mean..

```bash
pip install timm
```

The inference script for the tagger needs a folder as input, be warned that it also converts WebP images to PNG and you can specify tags to be ignored and some other stuff! I recommend reading through it and changing whatever you need.

[Link to the Script](/docs/yiff_toolkit/dataset_tools/FurryTagger/)

[Colab Notebook](https://colab.research.google.com/drive/1gIB2fGjLAuh6s_hrNlIPCkw_3jodoFP0?usp=sharing)

## AutoCaptioners

---

It is still a bit early to blindly trust these things, but the new generation of them are already pretty impressive! Still, please take extra attention around colors, directions and the species of each character when you use these tools!

### Joy-Caption

---

[Link](https://huggingface.co/spaces/fancyfeast/joy-caption-alpha-two)

[Download Script](https://huggingface.co/k4d3/toolkit/blob/main/joy)

```bash
git clone https://huggingface.co/spaces/fancyfeast
```

You will need to get access to [meta-llama/Meta-Llama-3.1-8B](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B) to use this.

## Tag Normalization with e6db

---

You can use [this](https://huggingface.co/datasets/Gaeros/e6db) tool to filter out implicated tags in your caption files. I highly recommend trying it out, if you do this process manually.

```bash
git clone https://huggingface.co/datasets/Gaeros/e6db
```

And then you can just let it loose on your dataset like this:

```bash
python ./normalize_tags.py /training_dir
```

I highly recommend you use git or any other type of version control you enjoy while working with automated tools like this! If you want to compare the changes made by it you can use the following command to do so:

```bash
git diff --word-diff-regex='[^,]+' --patience
```

To compare changes between the current and previous commit you can use:

```bash
git diff HEAD^ HEAD --word-diff-regex='[^,]+' --patience
```

## Embeddings for 1.5 and SDXL

---

Embeddings in Stable Diffusion are high-dimensional representations of input data, such as images or text, that capture their essential features and relationships. These embeddings are used to guide the diffusion process, enabling the model to generate outputs that closely match the desired characteristics specified in the input.

You can find in the [`/embeddings`](https://huggingface.co/k4d3/yiff_toolkit/tree/main/embeddings) folder a whole bunch of them I collected for SD 1.5 that I later converted with [this](https://huggingface.co/spaces/FoodDesert/Embedding_Converter) tool for SDXL.

---

## SDXL Furry Bible

---

### ResAdapter

---

[ResAdapter](https://huggingface.co/jiaxiangc/res-adapter) [[Paper](https://arxiv.org/pdf/2403.02084)] enhances a model's ability to generate images outside their trained resolution domains. What does this mean? It means you can generate images that are higher resolution than 1024x1024. Which sounds great on paper, but your milage might vary, it will also help a bit with the consistency of your generations a bit, which is an even bigger boon!

Just don't forget to turn it off every now and then so you can compare the results! Sometimes, you might get a better picture without it, especially with a fierce model like Pony, with that particular model I have so far only used v1 and it has been working out pretty good. It also works with ControlNet + IPAdapter which is just great!

<!-- ⚠️ TODO: PAG + HiDiffusion -->

### CompassMix

---

The new kid on the block, based on SeaArt Furry with some GAN magic by Lodestone, this mix tried to improve upon the original model and succeeded! My recommendation for training a LoRA for usage with it is to not treat it as a regular mix. My experiments ([[#1](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/compassmix_training/plot1.png)] [[Dataset Reference](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/compassmix_training/obra_dataset_reference.png)], [[#2](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/compassmix_training/plot2.png)] [[Example Output](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/compassmix_training/ComfyUI_00606_.png)]) show that LoRAs trained directly on Compass produces much better result, add the new [compass_optimizer](https://github.com/lodestone-rock/compass_optimizer) to your training script instead of AdamW while you are there, which will help with generalization and overall training, if you set it up [correctly](https://github.com/ka-de/sd-scripts/tree/lodew/library/optimizers), (I can highly recommend the one with normalization using the default parameters I left in it's `__init__`) and don't forget to [shrink](/docs/yiff_toolkit/lora_training_guide/#shrinking) it down a notch.

### SeaArt Furry

---

<!-- ⚠️ TODO: Prompting tips. -->

### Pony Diffusion V6

---

#### Requirements

Download the [model](https://civitai.com/models/257749/pony-diffusion-v6-xl) and load it in to whatever you use to generate images.

#### Positive Prompt Stuff

```python
score_9, score_8_up, score_7_up, score_6_up, rating_explicit, source_furry,
```

I just assumed you wanted _explicit_ and _furry_, you can also set the rating to `rating_safe` or `rating_questionable` and the source to `source_anime`, `source_cartoon`, `source_pony`, `source_rule34` and optionally mix them however you'd like. Its your life! `score_9` is an interesting tag, the model seems to have put all it's "_artsy_" knowledge in there. You might want to check if it is for your taste, it just makes your gens _painterly_. The other interesting tag is `score_5_up` which seems to have learned a little bit of everything regarding quality and I honestly couldn't figure out if the best place for it is in the negative or positive prompt, so I just don't put it anywhere, while `score_4_up` seems to be at the bottom of the autism spectrum regarding art, I do not recommend using it, but you can do whatever you want!

You can talk to Pony in three ways, use tags only, tags are neat, but you can also just type in
`The background is of full white marble towers in greek architecture style and a castle.` and use natural language to the fullest extent, but the best way is to mix it both, its actually recommended since the score tags by definition are tags, and you need to use them! There are also artist styles that seeped into some random tokens during training, there is a community effort by some weebs to sort them [here](https://lite.framacalc.org/4ttgzvd0rx-a6jf).

Other nice words to have in the box depending on your mood:

```python
detailed background, amazing_background, scenery porn
```

Other types of backgrounds include:

```python
simple background, abstract background, spiral background, geometric background, heart background, gradient background, monotone background, pattern background, dotted background, stripped background, textured background, blurred background
```

After `simple background` you can also define a color for the background like `white background` to get a simple white background.

For the character portrayal you can set many different types:

```python
three-quarter view, full-length portrait, headshot portrait, bust portrait, half-length portrait, torso shot
```

Its a good thing to describe your subject or subjects start with `solo` or `duo` or maybe `trio, group` , and then finally start describing your character in an interesting situation.

<!--
#### Negative Prompt Stuff

⚠️
```
3d, source_filmmaker, worst quality, low quality, text, censored, deformed, bad hand, blurry, (watermark), mutated hands, monochrome, artist name, signature, patreon logo,
```

-->

#### How to Prompt Female Anthro Lions with PonyXL

---

Positive prompt:

```md
anthro female african lion
```

Negative prompt:

```md
mane
```

Yep, that's all it takes.

![[An AI generated image.](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/tutorial/predicted_normal_18_00024_.png)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/tutorial/predicted_normal_18_00024_.png)

> Thanks to OCPik4chu on Discord for the tip!
