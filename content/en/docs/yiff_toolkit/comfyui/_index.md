---
weight: 2
bookFlatSection: false
bookToC: true
title: "The ComfyUI Bible"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# The ComfyUI Bible

---

## Introduction

---

If you need help installing ComfyUI, you didn't come to the right place. If you are using Windows, you can use the [prebuilt](https://docs.comfy.org/get_started/pre_package) package, or you can install it [manually](https://docs.comfy.org/get_started/manual_install) otherwise.

## Subsections

---

{{< section details >}}

## Installing Models and LoRAs

---

Before you can start using ComfyUI, first you need to get a model and depending on what you want to accomplish, you might need to stock up on some LoRAs, embeddings, upscalers and many other different types of models. But we will start simple, with just a model.

Models, or checkpoints are the huge files responsible for generating images based on text and/or image input. They are stored in the `models\checkpoints` folder of your ComfyUI installation. A good place to browse for one is [CivitAI](https://civitai.com/), but, since you are here, you are probably going to want to check out [CompassMix XL Lightning](https://civitai.com/models/498370/compassmix-xl-lightning) or [Pony Diffusion V6 XL](https://civitai.com/models/257749/pony-diffusion-v6-xl). Both of which are SDXL based.

LoRAs, or **Lo**w-**R**ank **A**daptation is a technique that came along to reduce the costs of fine-tuning LLMs. It works by freezing the pretrained model's weights and injects trainable rank decomposition matrices into each layer. For now, the important thing is that these have a different method of operation and a different purpose, therefore these are stored separately in the `models\loras` folder in ComfyUI and you can find a lot of them on this website or on CivitAI and many other places!

You'll find other folders for other types of models in the `models\` folder! Feel free to explore around here, but we'll worry about them when we get to them.

## Node Based Workflow

---

Let's get started with the basics of ComfyUI's node-based workflow. It might look overwhelming at first, but it's easier to understand than you think.

When you first open ComfyUI, you'll see a unique interface that might seem complex. But don't worry, it's actually pretty straightforward.

![Arcane Wizardry](/images/comfyui/arcane_wizardry.png)

If you're new to node-based workflows, it's normal to feel a bit lost. But with a little practice, you'll be navigating it like a pro. You might have questions, and that's okay. The goal is to learn and have fun with ComfyUI.

The workflow is the entire setup you see in the screenshot, including all the nodes, groups, and connections you make. When someone asks you to share your workflow, they're referring to the JSON file you can download after saving your workflow with a meaningful name. You can also use the [Workflow Image](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/#workflow-image) feature from the Custom-Scripts custom node to embed your workflow in an image.

Now, let's start from scratch and simplify your workflow. Here's how you can clear your workflow in both the new and old UIs:

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/clear_workflow.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

Now that you have a clean slate, let's add a node. There are two ways to do this. One way is to right-click on an empty part of your workflow. The other way, which is a bit more intuitive, is to left-click twice on an empty part of the workflow.

![Right Click Add Method](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/right_click_add.png)
