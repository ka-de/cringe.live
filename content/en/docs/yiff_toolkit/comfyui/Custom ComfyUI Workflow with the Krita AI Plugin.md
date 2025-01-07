---
weight: 1
bookFlatSection: false
bookToC: false
title: "Custom ComfyUI Workflow with the Krita AI Plugin"
summary: ""
aliases:
  - /docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/
  - /docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin
  - /docs/yiff_toolkit/comfyui/Custom ComfyUI Workflow with the Krita AI Plugin/
  - /docs/yiff_toolkit/comfyui/Custom ComfyUI Workflow with the Krita AI Plugin
---

<!--markdownlint-disable MD025 MD033 -->

# Custom ComfyUI Workflow with the Krita AI Plugin

---

## Installation

---

First visit the project's releases page on [GitHub](https://github.com/Acly/krita-ai-diffusion/releases), then download the latest zip file and make sure you click the first zip for it instead any of the _Source code_ archives!

![An image showcasing how to download krita-ai-diffusion.](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_download.png)

## ???

Click on the workspace selection button on the top left side of the Docker.

![An image showcasing how to connect to a custom ComfyUI workflow with krita-ai-diffusion.](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_select_graph.png)

## Essential Nodes For Working with Krita Plugins in ComfyUI

---

You will need [comfyui-tooling-nodes](https://github.com/Acly/comfyui-tooling-nodes) installed in your `custom_nodes` folder.

```bash
cd ~/ComfyUI/custom_nodes
git clone https://github.com/Acly/comfyui-tooling-nodes
```

If you are going to use the __Translate Text__ node you will also need to install `argostranslate`

```bash
pip install argostranslate
```

There are two of these nodes, the __Krita Output__ node which you just need to connect to the __VAE Decode__'s _image_ output.

![A screenshot of ComfyUI demonstrating the Krita Output node.](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_output_node.png)

Plus the __Krita Canvas__ node, with it's _width_ and _height_ output connected to anything that requires the total width and height of the images you are trying to generate, like the __Empty Latent Image__ node or the __CLIPTextEncodeSDXL__ and the _seed_ input should be hooked to _KSampler_'s _seed_.

![A screenshot of ComfyUI with the Krita Canvas node connected to the Empty Latent Image and other nodes.](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_canvas_node.png)

A quick reminder that in order to convert a widget to an input all you need to do, is right click on the node and find the widget under __Convert Widget to Input__ like this:

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_convert_to_input.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

If you are using the new frontend you can also just drag the seed noodle directly over the widget. 🐺

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_new_frontend_shill.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

---

{{< related-posts related="docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/ | docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/" >}}
