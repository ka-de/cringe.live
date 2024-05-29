---
weight: 1
bookFlatSection: false
bookToC: true
title: "🐺 - yiff_toolkit"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# Yiff Toolkit

---

## Introduction

The `yiff_toolkit` is a comprehensive set of tools designed to enhance your creative process in the realm of furry art. From refining artist styles to generating unique characters, the Yiff Toolkit provides a range of tools to help you cum.

> NOTE: You can click on any image in this README to be instantly teleported next to the original resolution version of it! If you want the metadata for a picture and it isn't there, you need to delete the letter e before the .png in the link! If a metadata containing original image is missing, please let me know!

## Subsections

{{< section details >}}

## Dataset Tools

I have uploaded all of the little handy Python scripts I use to [/dataset_tools](/docs/yiff_toolkit/dataset_tools/). They are pretty self explanatory by just the file name but almost all of them contain an AI generated descriptions. If you want to use them you will need to edit the path to your `training_dir` folder, the variable will be called `path` or `directory` and look something like this:

```py
def main():
    path = 'C:\\Users\\kade\\Desktop\\training_dir_staging'
```

Don't be afraid of editing Python scripts, unlike the real snake, these won't bite!

## Dataset Preparation

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

For Pony I've set up the Text file content like so: `rating_%rating%, %all:separator=^, %` for other models you might want to replace `rating_%rating%` with just `%rating%`.

You should also set the `Folder` into which the images will get downloaded. Let's use `C:\training_dir\1_wickerbeast` for both groups.

Now you are ready to right-click on each group and download the images.

---

### Manual Method

This method requires a browser extension like [ViolentMonkey](https://violentmonkey.github.io/) and [this](/docs/userscripts/e621.net-JSON-Button/) UserScript.

This will put a link to the JSON next to the download button on e621.net and e6ai.net and you can use [this](/docs/yiff_toolkit/dataset_tools/e621-JSON-to-Caption/) Python script to convert them to caption files, it uses the `rating_` prefix before `safe/questionable/explicit` because.. you've guessed it, Pony! It also lets you ignore the tags you add into `ignored_tags` using the `r"\btag\b",` syntax, just replace `tag` with the tag you want it to skip.

---

## Auto Taggers

### [eva02-vit-large-448-8046](https://huggingface.co/Thouph/eva02-vit-large-448-8046)

You want to install the only dependency, besides torch, I mean..

```bash
pip install timm
```

The inference script for the tagger needs a folder as input, be warned that it also converts WebP images to PNG and you can specify tags to be ignored and some other stuff! I recommend reading through it and changing whatever you need.

[Link to the Script](/docs/yiff_toolkit/dataset_tools/FurryTagger/)

[Colab Notebook](https://colab.research.google.com/drive/1gIB2fGjLAuh6s_hrNlIPCkw_3jodoFP0?usp=sharing)

## Embeddings for 1.5 and SDXL

Embeddings in Stable Diffusion are high-dimensional representations of input data, such as images or text, that capture their essential features and relationships. These embeddings are used to guide the diffusion process, enabling the model to generate outputs that closely match the desired characteristics specified in the input.

You can find in the [`/embeddings`](https://huggingface.co/k4d3/yiff_toolkit/tree/main/embeddings) folder a whole bunch of them I collected for SD 1.5 that I later converted with [this](https://huggingface.co/spaces/FoodDesert/Embedding_Converter) tool for SDXL.

## ComfyUI Walkthrough any%

⚠️ Coming next year! ⚠️

---

## AnimateDiff for Masochists

⚠️ Coming in 2026! ⚠️

---

## Stable Cascade Furry Bible

### Resonance Cascade

🍆

---

## SDXL Furry Bible

### Some Common Knowledge Stuff

[Resolution Lora](https://huggingface.co/jiaxiangc/res-adapter/resolve/main/sdxl-i/resolution_lora.safetensors?download=true) is a nice thing to have, it will help with consistency. For SDXL it is just a LoRA you can load in and it will do its magic. No need for a custom node or extension in this case.

### SeaArt Furry

---

SeaArt's furry model sadly has its cons not just pros, yes it might come with artist knowledge bundled, but it seems to have trouble doing more than one character or everyone is bad at prompting, oh and it uses raw e621 tags, which just means you have to use underscores `_` instead of spaces&nbsp;` `&nbsp; inside the tags.

⚠️ TODO: Prompting tips.

### Pony Diffusion V6

---

#### Requirements

Download the [model](https://civitai.com/models/257749/pony-diffusion-v6-xl) and load it in to whatever you use to generate images.

#### Positive Prompt Stuff

```python
score_9, score_8_up, score_7_up, score_6_up, rating_explicit, source_furry,
```

I just assumed you wanted _explicit_ and _furry_, you can also set the rating to `rating_safe` or `rating_questionable` and the source to `source_anime`, `source_cartoon`, `source_pony`, `source_rule34` and optionally mix them however you'd like. Its your life! `score_9` is an interesting tag, the model seems to have put all it's "_artsy_" knowledge. You might want to check if it is for your taste. The other interesting tag is `score_5_up` which seems to have learned a little bit of everything regarding quality while `score_4_up` seems to be at the bottom of the autism spectrum regarding art, I do not recommend using it, but you can do whatever you want!

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

#### Negative Prompt Stuff

⚠️

#### How to Prompt Female Anthro Lions

```python
anthro ⚠️?
```

---
