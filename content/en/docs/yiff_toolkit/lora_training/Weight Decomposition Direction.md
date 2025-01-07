---
title: "Weight Decomposition Direction in DoRA"
summary: "Understanding input vs output dimension normalization in DoRA's weight decomposition implementation"
weight: 6
---

The DoRA (Weight-Decomposed Low-Rank Adaptation) method introduces weight decomposition for parameter-efficient fine-tuning. An important implementation detail regarding the normalization direction deserves attention, particularly when working with the LyCORIS implementation.

## The Implementation Detail

In the original DoRA paper, the weight decomposition is defined in Equation (2) as:

$$ W = m \cdot \frac{V}{||V||_c} $$

where $||·||_c$ denotes the vector-wise norm of a matrix across each column vector. For weight matrices in neural networks, this norm can be computed in two ways:

1. **Input dimension**: Treating each output neuron's weights as a column vector
2. **Output dimension**: Treating each input neuron's contribution as a column vector

## LyCORIS Implementation

The original LyCORIS implementation computes the vector-wise norm along the input dimension by default. However, you can enable norm computation along the output dimension by setting:

```python
wd_on_output=True
```

This setting is considered by some to be the more "correct" interpretation of the paper's formulation.

## Why It Matters

The choice of normalization direction impacts several aspects of the model: it affects how the magnitude and direction components are decomposed, influences the learning dynamics during the fine-tuning process, and ultimately determines the final adaptation behavior of the model.

While both approaches can work, using output dimension normalization (`wd_on_output=True`) may better align with the mathematical formulation intended in the original paper. However, empirical evaluation on your specific task and architecture is recommended to determine which approach works better in practice.

---

{{< related-posts related="docs/yiff_toolkit/lora_training/dora/ | docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/comfyui/" >}}
