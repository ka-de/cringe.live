---
weight: 2
bookFlatSection: false
bookToC: true
title: "The Shrunk LoRA Guide"
---

<!--markdownlint-disable MD025 -->

# The Shrunk LoRA Guide

---

## What the Heck is a Subspace Factor

---

The subspace factor is a measure of how well the subspace spanned by the LoRA layer's rank-update matrices (`U` and `Vh`) aligns with the subspace spanned by the weight matrix of the corresponding layer in the base model.

Specifically, the `base_subspace_factors` attribute computed in the `DLoRA` class represents the dot products between the columns of `Vh` and the rows of the base model weight matrix `W_base`, multiplied by the columns of `U`. These dot products measure the correlations between the subspaces spanned by the LoRA update and the base model weights.

A high subspace factor indicates that the LoRA layer is updating a subspace that is already present and important in the base model weights. Conversely, a low subspace factor suggests that the LoRA layer is introducing new directions that were not strongly represented in the base model.

The `subspace_ratios` attribute computes the ratio of the LoRA singular values to the absolute values of the subspace factors. This gives a sense of how much the LoRA layer is scaling the existing subspaces versus introducing new subspaces relative to the base model.

In summary, the subspace factor quantifies the alignment between the LoRA update and the base model weight subspaces, providing insight into how the LoRA layer is adapting the base model.

## What is the Spectral Norm

---

The spectral norm (also known as the operator norm or matrix norm) is a measure of the maximum singular value of a matrix. It is calculated as:

```python
spectral_norm(W) = σ_max(W)
```

Where `σ_max(W)` is the largest singular value of the matrix `W`.

The `base_spectral_norm` attribute of the `DLoRA` class is computed as:

```python
self.base_spectral_norm = pt.svd_lowrank(W_base, q=1, niter=niter)[1][0].item()
```

Here, `W_base` is the weight matrix of the corresponding layer in the base model, flattened into a 2D matrix. `pt.svd_lowrank` computes an approximation of the singular value decomposition, returning the largest singular value `σ_max(W_base)` with `q=1`.

The spectral norm provides a scale for the singular values of a matrix. In the case of LoRA, the `sval_ratios` attribute computes the ratio of the LoRA singular values to the base model's spectral norm:

```python
self.sval_ratios = self.S / self.base_spectral_norm
```

This ratio gives an indication of how much the LoRA layer is scaling the singular values of the base model weight matrix.

In summary, the spectral norm is the maximum singular value of a matrix, and it is used in the LoRA context to normalize and interpret the scale of the LoRA singular values relative to the base model weights.
