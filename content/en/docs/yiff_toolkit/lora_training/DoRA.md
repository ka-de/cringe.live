---
weight: 2
bookFlatSection: false
bookToC: false
title: "DoRA"
description: "A novel parameter-efficient fine-tuning method that decomposes pre-trained weights into magnitude and directional components for more effective adaptation"
image: "https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/phoenix.jpg"
image_alt: "The image depicts a vibrant and dynamic phoenix rising from a digital landscape. The phoenix, a mythical bird often associated with rebirth and renewal, is illustrated with fiery red and orange feathers that transition into a digital matrix of blue and white as they extend outward. The background features a complex array of digital codes, grids, and circuitry, blending the organic form of the phoenix with the structured, technological elements. This juxtaposition creates a striking visual metaphor for the fusion of nature and technology, symbolizing transformation and the emergence of new possibilities from the digital realm. The image is both visually captivating and conceptually intriguing, highlighting themes of innovation and regeneration in the context of modern technology."
blurhash: "LFA^F9M|00pJIoxZWAM|9FxW%MRQ"
aliases:
  - /docs/yiff_toolkit/lora_training/dora/
  - /docs/yiff_toolkit/lora_training/dora
  - /docs/yiff_toolkit/lora_training/DoRA/
  - /docs/yiff_toolkit/lora_training/DoRA
  - /en/docs/yiff_toolkit/lora_training/dora/
  - /en/docs/yiff_toolkit/lora_training/dora
  - /en/docs/yiff_toolkit/lora_training/DoRA/
  - /en/docs/yiff_toolkit/lora_training/DoRA
---

<!-- markdownlint-disable MD025 -->

# DoRA: Weight-Decomposed Low-Rank Adaptation

> Written by Gaeros and Claude et al.

["DoRA: Weight-Decomposed Low-Rank Adaptation"](https://arxiv.org/abs/2402.09353) by Liu et al. is an innovative approach to fine-tuning that improves upon LoRA by separately handling weight magnitudes and directions. By decomposing weights into these components, DoRA achieves better performance than traditional LoRA while maintaining similar parameter efficiency. It shows significant improvements across various tasks including commonsense reasoning (+1.0-4.4%), visual-language understanding (+0.9-1.9%), and instruction tuning (+0.7-1.1%).

## Motivation

### Key Insight

Drawing on Weight Normalization, which achieves faster convergence by improving gradient conditioning through weight reparameterization, the authors first conducted a novel analysis of how weights change during fine-tuning. By decomposing weights into magnitude and directional components, they discovered that LoRA and full fine-tuning (FT) exhibit markedly distinct patterns of updates.

Their analysis revealed a key empirical finding: when fine-tuning pre-trained models, the most effective adaptations (as seen in FT) often involve either:

Large magnitude changes with minimal directional adjustments, or significant directional changes while preserving magnitudes, but rarely both simultaneously. In contrast, LoRA showed a coupled behavior where magnitude and directional changes were proportional.

This discovery suggested that pre-trained weights already encode useful feature combinations, and effective adaptation primarily needs to adjust either their importance (magnitude) or their mixing (direction) independently. This insight led to DoRA's design: explicitly separating these components to enhance both learning capacity and training stability.

### Weight Decomposition and Activations

In neural networks, each weight matrix $W \in \mathbb{R}^{d \times k}$ transforms input vectors $x \in \mathbb{R}^k$ into output vectors $y \in \mathbb{R}^d$. This transformation can be understood through two complementary views:

- Column view (geometric): Each column $w_j$ is a vector in output space ($\mathbb{R}^d$) that gets scaled by the corresponding input component $x_j$
- Row view (algebraic): Each row $w^i$ computes one component of the output through inner product with the input

These views manifest in how the transformation works:

- Column view: $y = \sum_j x_j w_j$ (each input component $x_j$ scales its corresponding output-space direction $w_j$)
- Row view: $y_i = \langle w^i, x \rangle$ (each row computes one component of the output)

The paper defines $||\cdot||_c$ as the L2 norm of each column vector. When we decompose weights in DoRA, each column vector $w_j$ is decomposed as:

- Direction: $v_j = w_j/||w_j||_2$ (normalized vector in output space)
- Magnitude: $m_j = ||w_j||_2$ (scalar)

This column-wise decomposition has a clear geometric meaning:

- Each $v_j$ is a unit vector in $\mathbb{R}^d$ defining a direction in output space
- $m_j$ scales this direction's contribution when input component $x_j$ is active
- The full transformation becomes $y = \sum_j (m_j x_j) v_j$

The paper's empirical analysis reveals that effective fine-tuning (as seen in FT) often requires:

1. Adjusting the scaling factors ($m_j$) while preserving the output-space directions ($v_j$), or
2. Refining the output-space directions ($v_j$) while maintaining their relative scales ($m_j$)

## Pattern Analysis of LoRA and Full Fine-tuning

Drawing from Weight Normalization, the paper introduces a decomposition analysis to understand how input features' influence patterns change during fine-tuning. For a weight matrix $W \in \mathbb{R}^{d \times k}$, the decomposition is:

$$W = m\frac{V}{||V||_{c}} = ||W||_{c}\frac{W}{||W||_{c}}$$

where:

- $m \in \mathbb{R}^{1 \times k}$ contains the scaling factors for each input feature's influence
- $V \in \mathbb{R}^{d \times k}$ contains the unnormalized output-space directions  
- $||\cdot||_{c}$ computes the L2 norm of each column vector in output space

The analysis showed that LoRA exhibits coupled changes in both scaling factors and output-space directions, while full fine-tuning (FT) has the ability to independently adjust either scaling factors or directions. This key difference indicates that LoRA lacks the capability for such decoupled adjustments, which limits its flexibility compared to FT.

## Method

DoRA explicitly separates each column's magnitude from its direction in the weight matrix. Given a pre-trained weight $W_0$, DoRA:

1. Extracts the column norms as trainable parameters:
   - $m = ||W_0||_c \in \mathbb{R}^{1 \times k}$ (one scalar per input dimension)
   - Each $m_j$ represents the magnitude of input feature $j$'s influence

2. Applies LoRA-style updates to the directions:
   - Base directions: $V = \frac{W_0}{||W_0||_c}$ 
   - Low-rank update: $\Delta V = BA$ where $B \in \mathbb{R}^{d \times r}$, $A \in \mathbb{R}^{r \times k}$
   - $r \ll min(d,k)$ is the rank hyperparameter

The fine-tuned weight is then computed as:

$$W' = m\frac{V+\Delta V}{||V+\Delta V||_c} = m\frac{W_0+BA}{||W_0+BA||_c}$$

where:

- $\frac{V+\Delta V}{||V+\Delta V||_c}$ ensures each column is a unit vector in output space
- $m$ scales these unit vectors to control each input feature's influence
- The separation allows independent updates to magnitudes and directions

This decomposition enables DoRA to adjust feature importance through $m$ without changing directions, refine feature combinations through $B,A$ while maintaining unit-length directions, and achieve more efficient adaptation by targeting the specific type of update needed.

### Implementation Note: Column-wise Normalization

An important implementation detail, which was ambiguous in the original paper and later clarified in the LyCORIS library, concerns how to compute the column-wise norms. For a weight matrix $W \in \mathbb{R}^{d \times k}$ (where $d$ is output dimension and $k$ is input dimension), [there are now two implementations](https://github.com/KohakuBlueleaf/LyCORIS/commit/61b7ed5e):

- Column-wise view (new correct method, `wd_on_out=True`): 
  - Directly computes norms across input dimensions for each output dimension
  - Results in norms of shape $(d, 1)$, one per output feature
  - Each norm represents the magnitude of that output feature's response to all inputs

- Transposed view (default method, `wd_on_out=False`):
  - Computes norms across output dimensions for each input dimension
  - Results in norms of shape $(1, k)$, one per input feature
  - Each norm represents how much an input feature influences all outputs combined

The column-wise view is considered "correct" because:

1. It preserves the natural interpretation where each column $w_j$ is a vector in output space ($\mathbb{R}^d$)
2. Each normalized column represents a unit direction in output space, controlling how that input feature influences the output distribution
3. It matches Weight Normalization's original formulation for gradient conditioning

The key implementation in LyCORIS shows these two approaches:

```python
if self.wd_on_out:
    # Column-wise view (correct):
    # Norms of shape (output_features, 1)
    weight_norm = (
        weight.reshape(weight.shape[0], -1)      # [d, k] -> [d, -1]
        .norm(dim=1)                             # Norm along input dimensions
        .reshape(weight.shape[0], *[1] * self.dora_norm_dims)
    ) + torch.finfo(weight.dtype).eps
else:
    # Transposed view (not recommended):
    # Norms of shape (1, input_features)
    weight_norm = (
        weight.transpose(0, 1)                    # [d, k] -> [k, d]
        .reshape(weight.shape[1], -1)            # Reshape to [k, -1]
        .norm(dim=1, keepdim=True)               # Norm along output dimensions
        .reshape(weight.shape[1], *[1] * self.dora_norm_dims)
        .transpose(0, 1)
    ) + torch.finfo(weight.dtype).eps
```

### Gradient Analysis

The gradients with respect to $V' = V+\Delta V$ and $m$ are:

$$\nabla_{V'} \mathcal{L} = \frac{m}{||V'||_{c}}\left( I - \frac{V'V'^{\mathbf{T}}}{||V'||_{c}^2}  \right) \nabla_{W'} \mathcal{L}$$

$$\nabla_m \mathcal{L} =\frac{\nabla_{W'} \mathcal{L} \cdot V'}{||V'||_{c}}$$

To reduce memory overhead during training, $||V + \Delta V||_{c}$ is treated as a constant during backpropagation (detached from the gradient graph), leading to simplified gradients:

$$\nabla_{V'} \mathcal{L} = \frac{m}{C} \nabla_{W'} \mathcal{L} \text{ where } C = ||V'||_{c}$$

This modification preserves the gradient with respect to $m$ while reducing training memory by ~24.4% for LLaMA and ~12.4% for VL-BART. The impact on accuracy is negligible, with only a 0.2% difference on LLaMA and no measurable difference on VL-BART.

## Results

### Commonsense Reasoning

- Tested on LLaMA-7B/13B, LLaMA2-7B, and LLaMA3-8B
- DoRA outperforms LoRA by:
  - +3.7% on LLaMA-7B
  - +1.0% on LLaMA-13B
  - +2.9% on LLaMA2-7B
  - +4.4% on LLaMA3-8B
- Half-rank DoRA ($\text{DoRA}^{\dagger}$) still outperforms full-rank LoRA

### Image/Video-Text Understanding

- VL-BART backbone
- Image tasks: VQA, GQA, NLVR2, COCO Caption
  - DoRA: 77.4% vs LoRA: 76.5%
- Video tasks: TVQA, How2QA, TVC, YC2C
  - DoRA: 85.4% vs LoRA: 83.5%

### Visual Instruction Tuning

- LLaVA-1.5-7B model
- DoRA: 67.6% vs LoRA: 66.9% vs FT: 66.5%
