---
weight: 2
bookFlatSection: false
bookToC: true
title: "The Unethical ComfyUI Guide"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# The Unethical ComfyUI Guide

---

## Introduction

---

If you need help installing ComfyUI, you didn't come to the right place. If you are using Windows, you can use the [prebuilt](https://docs.comfy.org/get_started/pre_package) package, or you can install it [manually](https://docs.comfy.org/get_started/manual_install) otherwise (more fun).

## Subsections

---

{{< section details >}}

## Installing Models and LoRAs

---

Before you can start using ComfyUI, first you need to get a model and depending on what you want to accomplish, you might need to stock up on some LoRAs.

Models, or checkpoints are the huge files responsible for generating images based on text and/or image input. They are stored in the `models\checkpoints` folder of your ComfyUI installation. A good place to browse for one is [CivitAI](https://civitai.com/), but, since you are here, you are probably going to want to check out [CompassMix XL Lightning](https://civitai.com/models/498370/compassmix-xl-lightning) or [Pony Diffusion V6 XL](https://civitai.com/models/257749/pony-diffusion-v6-xl). Both of which are SDXL based, which are a lot more heftier than SD1.5 models. This guide will mostly be focused on using XL models, but eventually I will add a section for working with 1.5! <!-- ⚠️ TODO: Add a section for 1.5 x) -->

LoRAs, or **Lo**w-**R**ank **A**daptation is a technique that came along to reduce the costs of fine-tuning LLMs. It works by freezing the pretrained model's weights and injects trainable rank decomposition matrices into each layer. For now, the important thing is that these have a different method of operation and a different purpose, therefore these are stored separately in the `models\loras` folder in ComfyUI and you can find a lot of them on this website or on CivitAI and many other places!

You'll find other folders for other types of models in the `models\` folder! Feel free to explore around here, but we'll worry about them when (if) we get to them.

## Node Based Workflow

---

Let's get through the basic stuff quick, so we can get to the fun stuff quicker!

 When you open up ComfyUI for the first time you are greeted with the following arcane wizardry:

![Arcane Wizardry](/images/comfyui/arcane_wizardry.png)

It could be a bit daunting at first to wrap your head around all these new concepts, especially when this is the first time you encounter a node based workflow, so much so, that you might feel the need to hop onto Discord, and publicly let 30k people know that you are too dumb to learn ComfyUI and that ComfyUI sucks and that everybody who is trying to help your dumb ass is just a troll! But fuck that! You are stronger than that! Besides, you have 🐺🪄 (me) here to help you get through this shit, quick and easy!

The workflow is the whole thing in the previous screenshot, every node, group and connections you have made, together form this esoteric JSON beast, when people tell you to share your workflow, what they mean really mean, is for you to hit `Ctrl + S` and send them the JSON file you downloaded after naming your workflow something meaningful. You can also use [Workflow Image](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/#workflow-image) from the Custom-Scripts custom node, to embed the workflow in an image of your workflow.

Now, let's start from the beginning and get rid of all this daunting node soup!

Here is how you can clear your workflow, both with the new and old UIs:

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit3/resolve/main/static/comfyui/clear_workflow.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

Now that we don't have anything to work with, let's add a node! There are two ways to do this, first is to right click on an empty part of your workflow (which right now could be, literally anywhere). But this method, even though is well-structured, somehow just sucks! So we are going to left-click twice on an empty part of the workflow instead!

![Right Click Add Method](https://huggingface.co/k4d3/yiff_toolkit3/resolve/main/static/comfyui/right_click_add.png)
