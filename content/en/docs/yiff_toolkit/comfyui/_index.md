---
weight: 2
bookFlatSection: false
bookToC: true
title: "The ComfyUI Bible"
summary: "A comprehensive guide to using ComfyUI, covering everything from basic node workflows to advanced techniques for AI image generation."
aliases:
  - /docs/yiff_toolkit/comfyui/
  - /docs/yiff_toolkit/comfyui
  - /en/docs/yiff_toolkit/comfyui/
  - /en/docs/yiff_toolkit/comfyui
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# The ComfyUI Bible

---

## Installing ComfyUI

---

If you need help installing ComfyUI, you didn't come to the right place. If you are using Windows, you can use the  [prebuilt](https://docs.comfy.org/get_started/pre_package) package, or you can install it [manually](https://docs.comfy.org/get_started/manual_install) otherwise.

## Understanding Diffusion Models

---

Before diving into ComfyUI's practical aspects, let's understand the mathematical foundations of diffusion models that power modern AI image generation. Unless you are allergic to math, in which case you should [skip](#introduction-to-comfyui) this section in it's entirety.

### The Diffusion Process

Diffusion models work by gradually adding Gaussian noise to images and then learning to reverse this process. The forward diffusion process can be described mathematically as:

$$q(x_t|x_{t-1}) = \mathcal{N}(x_t; \sqrt{1-\beta_t}x_{t-1}, \beta_tI)$$

where:

- $x_t$ is the image at timestep $t$
- $\beta_t$ is the noise schedule
- $\mathcal{N}$ represents a normal distribution</div>

The reverse process, which is what we use for generation, is learned through:

$$p_\theta(x_{t-1}|x_t) = \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t), \Sigma_\theta(x_t, t))$$

This process is guided by the U-Net architecture in stable diffusion models, which learns to predict the noise that was added at each step.

### V-Prediction and Angular Parameterization

While the standard formulation predicts noise $\epsilon$, an alternative approach called v-prediction parameterizes the diffusion process in terms of velocity. In this formulation, we define an angle $\phi_t = \text{arctan}(\sigma_t/\alpha_t)$ that represents the progression through the diffusion process. For a variance-preserving process, we have:

$$\alpha_\phi = \cos(\phi), \quad \sigma_\phi = \sin(\phi)$$

The noisy image at angle $\phi$ can then be expressed as:

$$\mathbf{z}_\phi = \cos(\phi)\mathbf{x} + \sin(\phi)\epsilon$$

The key insight is to define a velocity vector:

$$\mathbf{v}_\phi = \frac{d\mathbf{z}_\phi}{d\phi} = \cos(\phi)\epsilon - \sin(\phi)\mathbf{x}$$

This velocity represents the direction of change in the noisy image as we move through the diffusion process. The model predicts this velocity instead of the noise:

$$\hat{\mathbf{v}}_\theta(\mathbf{z}_\phi) = \cos(\phi)\hat{\epsilon}_\theta(\mathbf{z}_\phi) - \sin(\phi)\hat{\mathbf{x}}_\theta(\mathbf{z}_\phi)$$

The sampling process then becomes a rotation in the $(\mathbf{z}_\phi, \mathbf{v}_\phi)$ plane:

$$\mathbf{z}_{\phi_{t-\delta}} = \cos(\delta)\mathbf{z}_{\phi_t} - \sin(\delta)\hat{\mathbf{v}}_\theta(\mathbf{z}_{\phi_t})$$

This formulation offers several key advantages: it provides a more natural parameterization of the diffusion trajectory, simplifies the sampling process into a straightforward rotation operation, and can potentially lead to improved sample quality in certain scenarios.

### Conditioning and Control

Text-to-image generation involves conditioning the diffusion process on text embeddings. The mathematical formulation becomes:

$$p_\theta(x_{t-1}|x_t, \mathbf{c}) = \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t, \mathbf{c}), \Sigma_\theta(x_t, t, \mathbf{c}))$$

where $\mathbf{c}$ represents the conditioning information. In the context of text-to-image generation, this conditioning vector typically comes from CLIP (Contrastive Language-Image Pre-training), a neural network developed by OpenAI that creates a shared embedding space for both text and images.

#### Understanding CLIP and Conditioning

CLIP (Contrastive Language-Image Pre-training) is a neural network trained to learn the relationship between images and text through contrastive learning. It consists of two encoders: one for text and one for images. During training, CLIP learns to maximize the cosine similarity between matching image-text pairs while minimizing it for non-matching pairs. This is achieved through a contrastive loss function operating on batches of N image-text pairs, creating an N×N similarity matrix.

The text encoder first tokenizes the input text into a sequence of tokens, then processes these through a transformer to produce a sequence of token embeddings $\text{CLIP}_\text{text}(\text{text}) \rightarrow [\mathbf{z}_1, ..., \mathbf{z}_n] \in \mathbb{R}^{n \times d}$, where $n$ is the sequence length and $d$ is the embedding dimension. Unlike traditional transformer architectures that use pooling layers, CLIP simply takes the final token's embedding (corresponding to the [EOS] token) after layer normalization. The image encoder maps images to a similar high-dimensional representation $\text{CLIP}_\text{image}(\text{image}) \rightarrow \mathbf{z} \in \mathbb{R}^d$.

The sequence of token embeddings plays a crucial role in steering the diffusion process. Through cross-attention layers in the U-Net, the model can attend to different parts of the text representation as it generates the image. This mechanism enables the model to understand and incorporate multiple concepts and their relationships from the prompt.

Consider what happens when you input a prompt like "a red cat sitting on a blue chair". The text is first split into tokens, and each token (or subword) gets its own embedding. The model can then attend differently to "red", "cat", "blue", and "chair" during different stages of the generation process, allowing it to properly place and render each concept in the final image.

Beyond simple text conditioning, modern diffusion models support various forms of guidance. Image conditioning (img2img) allows existing images to influence the generation process. Control signals through ControlNet provide fine-grained control over structural elements. Style vectors extracted from reference images can guide aesthetic qualities, while structural guidance through depth maps or pose estimation can enforce specific spatial arrangements. Each of these conditioning methods can provide additional context to guide the generation process.

### Unconditional vs Conditional Generation and CFG

The diffusion model can actually generate images in two modes: unconditional, where no guidance is provided ($\mathbf{c} = \emptyset$), and conditional, where we use our CLIP embedding or other conditioning signals. Classifier-Free Guidance (CFG) leverages both of these modes to enhance the generation quality.

The CFG process works by predicting two denoising directions at each timestep:

1. An unconditional prediction: $\epsilon_\theta(x_t, t)$
2. A conditional prediction: $\epsilon_\theta(x_t, t, \mathbf{c})$

These predictions are then combined using a guidance scale $w$ (often called the CFG scale):

$$\epsilon_\text{CFG} = \epsilon_\theta(x_t, t) + w[\epsilon_\theta(x_t, t, \mathbf{c}) - \epsilon_\theta(x_t, t)]$$

The guidance scale $w$ controls how strongly the conditioning influences the generation. A higher value of $w$ (typically 7-12) results in images that more closely match the prompt but may be less realistic, while lower values (1-4) produce more natural images that follow the prompt more loosely. When $w = 0$, we get purely unconditional generation, and as $w \to \infty$, the model becomes increasingly deterministic in following the conditioning.

This is why in ComfyUI, you'll often see a "CFG Scale" parameter in sampling nodes. It directly controls this weighting between unconditional and conditional predictions, allowing you to balance prompt adherence against image quality.

## Introduction to ComfyUI

---

ComfyUI provides a visual interface to interact with these mathematical processes through a node-based workflow. If

## Core Components

---

### Models and Their Mathematical Foundations

Before starting with ComfyUI, you need to understand the different types of models:

1. **Base Models (Checkpoints)**
   - Stored in `models\checkpoints`
   - Implement the full diffusion process: $p_\theta(x_{0:T})$
   - Examples: CompassMix XL Lightning, Pony Diffusion V6 XL

2. **LoRAs (Low-Rank Adaptation)**
   - Stored in `models\loras`
   - Mathematically represented as: $W = W_0 + BA$ where:
     - $W_0$ is the original weight matrix
     - $B$ and $A$ are low-rank matrices
   - Reduces parameter count while maintaining model quality

## Node Based Workflow

---

The node-based interface in ComfyUI represents the mathematical operations as interconnected components. Each node performs specific operations in the diffusion process:

- Sampling nodes implement the reverse diffusion process
- Conditioning nodes handle text embeddings and other control signals
- VAE nodes handle encoding/decoding between image and latent space: $\mathcal{E}(x)$ and $\mathcal{D}(z)$

![Arcane Wizardry](/images/comfyui/arcane_wizardry.png)

When you're new to node-based workflows, think of each connection as passing tensors and parameters between mathematical operations. The entire workflow represents a computational graph that implements the full diffusion process.

### Getting Started

To begin experimenting with these concepts, you can clear your workflow:

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/clear_workflow.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

You can add nodes by either right-clicking or double-clicking on an empty area:

![Right Click Add Method](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/right_click_add.png)
