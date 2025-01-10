"""
This script demonstrates and compares two approaches for low-rank approximation of weight differences,
specifically in the context of neural network weight matrices.

Reference:
    This experiment is based on the DoRA (Decomposed Rank Adaptation) paper:
    "DoRA: Weight-Decomposed Low-Rank Adaptation" (Hu et al., 2023)
    https://arxiv.org/abs/2402.09353

Experiment Purpose:
    This experiment tests a key hypothesis from the DoRA paper: that normalizing weights
    before computing their differences leads to better low-rank approximations.
    
    Specifically, we test:
    1. Whether normalizing weights before SVD decomposition produces lower reconstruction error
       compared to direct SVD on weight differences
    2. How well a rank-1 approximation can capture the essential differences between two
       weight matrices when working in normalized vs non-normalized space
    
    The motivation comes from DoRA's insight that weight changes during fine-tuning often
    involve both magnitude and directional changes. By separating these (through normalization),
    we might better capture the important adaptations with fewer parameters.

Test Setup:
    - Create two random weight matrices (w1, w2) to simulate pre-trained and fine-tuned weights
    - Apply both methods to approximate w2 starting from w1
    - Compare reconstruction error (MSE) to determine which method better preserves the
      weight changes with the same parameter budget (rank-1)

Weight Matrices:
    w1: Represents the base model's weight matrix, typically from a pre-trained model
        Shape: (128, 144) - 128 output features, 144 input features
        
    w2: Represents the target/adapted model's weight matrix after fine-tuning
        Shape: (128, 144) - same shape as w1
        
    In the context of DoRA, these matrices represent:
    - w1: The original weights from which we want to adapt
    - w2: The desired weights after adaptation
    The goal is to find an efficient low-rank representation of their difference
    that can be used for parameter-efficient fine-tuning.

    Note: In this experiment, both matrices are randomly initialized using He initialization
    (also known as Kaiming initialization) to simulate the scenario. This initialization draws
    values from a normal distribution with mean 0 and variance 2/n_in, where n_in is the number
    of input features, helping maintain variance across layers and prevent vanishing/exploding
    gradients, particularly in networks using ReLU activations. In practice, w1 would be from
    a real pre-trained model and w2 would be from its fine-tuned version.

The script implements two methods:
1. Direct SVD decomposition of weight differences
2. SVD decomposition of normalized weight differences

Key Components:
- Creates two random weight matrices (w1, w2) initialized with He initialization
- Performs SVD decomposition with rank=1 to get low-rank approximations
- Compares reconstruction quality using MSE loss

The two approaches tested are:
1. Direct method: w2 ≈ w1 + U[:,:r]Σ[:r,:r]V[:r,:]
2. Normalized method: w2 ≈ (w1/||w1|| + U[:,:r]Σ[:r,:r]V[:r,:]) * ||w2||

This experiment is particularly relevant for DoRA (Decomposed Rank Adaptation) 
implementations where efficient low-rank approximations of weight differences 
are crucial for parameter-efficient fine-tuning.

Functions:
    input_norm(x): Computes the L2 norm along the input dimension (dim=1)
        Args:
            x (torch.Tensor): Input tensor
        Returns:
            torch.Tensor: Norm of the input tensor along dim=1

Global Variables:
    RANK (int): The target rank for SVD decomposition (set to 1)
"""

import math
import matplotlib.pyplot as plt
import torch
import torch.nn.functional as F
import numpy as np
from diffusers import StableDiffusionXLPipeline

def load_model_weights():
    """
    Loads weights from SDXL base and a fine-tuned version.
    Returns a pair of weight matrices from the same layer.
    """
    # Load base SDXL model
    base_model = StableDiffusionXLPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", 
        torch_dtype=torch.float32,
        use_safetensors=True
    ).unet
    
    # Load a fine-tuned SDXL model (using SDXL-Lightning as an example)
    tuned_model = StableDiffusionXLPipeline.from_pretrained(
        "ByteDance/SDXL-Lightning", 
        torch_dtype=torch.float32,
        use_safetensors=True
    ).unet
    
    # Extract weights from the same layer (using first cross-attention layer)
    w1 = base_model.down_blocks[0].attentions[0].transformer_blocks[0].attn1.to_q.weight.detach()
    w2 = tuned_model.down_blocks[0].attentions[0].transformer_blocks[0].attn1.to_q.weight.detach()
    
    print(f"Loaded weights shape: {w1.shape}")
    print(f"Layer: down_blocks[0].attentions[0].transformer_blocks[0].attn1.to_q")
    return w1, w2

def visualize_reconstructions(w1, w2, reconstruction1, reconstruction2):
    """
    Creates comprehensive visualizations comparing the two SVD methods.
    
    Generates two figures:
    1. SVD approximation analysis (showing structure and relative errors)
    2. Analysis plots (singular values, relative errors, error distributions)
    """
    # Convert tensors to numpy for matplotlib
    w1_np = w1.detach().numpy()
    w2_np = w2.detach().numpy()
    rec1_np = reconstruction1.detach().numpy()
    rec2_np = reconstruction2.detach().numpy()
    
    # Figure 1: SVD approximation analysis
    fig1, axes1 = plt.subplots(2, 3, figsize=(18, 12))
    fig1.suptitle('SVD Approximation Analysis', fontsize=16)
    
    # Original difference and its magnitude
    diff = w2_np - w1_np
    diff_magnitude = np.sqrt(np.sum(diff**2, axis=1, keepdims=True))
    normalized_diff = diff / (diff_magnitude + 1e-8)
    
    # Low rank approximations
    approx1 = rec1_np - w1_np  # Direct SVD approximation
    approx1_magnitude = np.sqrt(np.sum(approx1**2, axis=1, keepdims=True))
    normalized_approx1 = approx1 / (approx1_magnitude + 1e-8)
    
    approx2 = rec2_np - w1_np  # Normalized SVD approximation
    approx2_magnitude = np.sqrt(np.sum(approx2**2, axis=1, keepdims=True))
    normalized_approx2 = approx2 / (approx2_magnitude + 1e-8)
    
    # Plot normalized directions
    im1 = axes1[0,0].imshow(normalized_diff, cmap='RdBu', aspect='auto', vmin=-1, vmax=1)
    axes1[0,0].set_title('Original Update Direction\n(w2-w1)/||w2-w1||')
    plt.colorbar(im1, ax=axes1[0,0])
    
    im2 = axes1[0,1].imshow(normalized_approx1, cmap='RdBu', aspect='auto', vmin=-1, vmax=1)
    axes1[0,1].set_title('Direct SVD Update Direction')
    plt.colorbar(im2, ax=axes1[0,1])
    
    im3 = axes1[0,2].imshow(normalized_approx2, cmap='RdBu', aspect='auto', vmin=-1, vmax=1)
    axes1[0,2].set_title('Normalized SVD Update Direction')
    plt.colorbar(im3, ax=axes1[0,2])
    
    # Plot relative errors
    rel_error1 = np.abs(normalized_diff - normalized_approx1)
    rel_error2 = np.abs(normalized_diff - normalized_approx2)
    vmax = max(rel_error1.max(), rel_error2.max())
    
    # Magnitude preservation
    magnitude_error1 = np.abs(diff_magnitude - approx1_magnitude) / (diff_magnitude + 1e-8)
    magnitude_error2 = np.abs(diff_magnitude - approx2_magnitude) / (diff_magnitude + 1e-8)
    
    im4 = axes1[1,0].imshow(magnitude_error1, cmap='viridis', aspect='auto')
    axes1[1,0].set_title('Direct SVD Magnitude Error\n(relative)')
    plt.colorbar(im4, ax=axes1[1,0])
    
    im5 = axes1[1,1].imshow(magnitude_error2, cmap='viridis', aspect='auto')
    axes1[1,1].set_title('Normalized SVD Magnitude Error\n(relative)')
    plt.colorbar(im5, ax=axes1[1,1])
    
    # Direction error comparison
    im6 = axes1[1,2].imshow(rel_error2 - rel_error1, cmap='RdBu', aspect='auto')
    axes1[1,2].set_title('Direction Error Difference\n(Normalized - Direct)')
    plt.colorbar(im6, ax=axes1[1,2])
    
    plt.tight_layout()
    
    # Figure 2: Analysis plots
    fig2, axes2 = plt.subplots(2, 2, figsize=(15, 12))
    fig2.canvas.manager.set_window_title('Analysis Plots')
    
    # Singular value spectrum
    _, s1, _ = torch.linalg.svd(diff_w)
    _, s2, _ = torch.linalg.svd(normed_diff_w)
    
    s1_np = s1.detach().numpy()
    s2_np = s2.detach().numpy()
    
    axes2[0,0].plot(s1_np/s1_np[0], label='Direct SVD', alpha=0.7)
    axes2[0,0].plot(s2_np/s2_np[0], label='Normalized SVD', alpha=0.7)
    axes2[0,0].set_yscale('log')
    axes2[0,0].set_title('Normalized Singular Value Spectrum')
    axes2[0,0].set_xlabel('Index')
    axes2[0,0].set_ylabel('Singular Value / First Singular Value')
    axes2[0,0].legend()
    axes2[0,0].grid(True)
    
    # Cumulative explained variance
    var1 = np.cumsum(s1_np**2) / np.sum(s1_np**2)
    var2 = np.cumsum(s2_np**2) / np.sum(s2_np**2)
    
    axes2[0,1].plot(var1, label='Direct SVD', alpha=0.7)
    axes2[0,1].plot(var2, label='Normalized SVD', alpha=0.7)
    axes2[0,1].set_title('Cumulative Explained Variance')
    axes2[0,1].set_xlabel('Number of Components')
    axes2[0,1].set_ylabel('Cumulative Explained Variance')
    axes2[0,1].legend()
    axes2[0,1].grid(True)
    
    # Cosine similarity distribution
    cos_sim1 = np.sum(normalized_diff * normalized_approx1, axis=1)
    cos_sim2 = np.sum(normalized_diff * normalized_approx2, axis=1)
    
    axes2[1,0].hist(cos_sim1, bins=50, alpha=0.5, label='Direct SVD')
    axes2[1,0].hist(cos_sim2, bins=50, alpha=0.5, label='Normalized SVD')
    axes2[1,0].set_title('Cosine Similarity Distribution')
    axes2[1,0].set_xlabel('Cosine Similarity')
    axes2[1,0].set_ylabel('Count')
    axes2[1,0].legend()
    
    # Magnitude ratio distribution
    mag_ratio1 = (approx1_magnitude / (diff_magnitude + 1e-8)).flatten()
    mag_ratio2 = (approx2_magnitude / (diff_magnitude + 1e-8)).flatten()
    
    axes2[1,1].hist(mag_ratio1, bins=50, alpha=0.5, label='Direct SVD')
    axes2[1,1].hist(mag_ratio2, bins=50, alpha=0.5, label='Normalized SVD')
    axes2[1,1].set_title('Magnitude Ratio Distribution\n(approximation/original)')
    axes2[1,1].set_xlabel('Magnitude Ratio')
    axes2[1,1].set_ylabel('Count')
    axes2[1,1].legend()
    
    plt.tight_layout()
    plt.show()


def input_norm(x):
    """
    Computes the L2 (Euclidean) norm along the input dimension of a weight matrix.

    For a weight matrix W of shape (out_features, in_features), this function:
    1. Transposes W to shape (in_features, out_features)
    2. Computes the L2 norm for each input feature (row-wise after transpose)
    3. Transposes back to original shape

    Mathematical formulation:
        For each input feature i:
        norm[i] = sqrt(sum_j W[j,i]^2)
        where j iterates over output features

    Example:
        If x = tensor([[1, 2, 3],
                      [4, 5, 6]])  # shape (2, 3)

        After transpose:
        x_t = tensor([[1, 4],
                     [2, 5],
                     [3, 6]])  # shape (3, 2)

        Compute norms:
        norms = tensor([[sqrt(1^2 + 4^2)],
                       [sqrt(2^2 + 5^2)],
                       [sqrt(3^2 + 6^2)]])

        Final result after transpose:
        result = tensor([[sqrt(1^2 + 4^2), sqrt(2^2 + 5^2), sqrt(3^2 + 6^2)],
                        [sqrt(1^2 + 4^2), sqrt(2^2 + 5^2), sqrt(3^2 + 6^2)]])

    Args:
        x (torch.Tensor): Input tensor of shape (out_features, in_features)
            representing a weight matrix

    Returns:
        torch.Tensor: Tensor of same shape as input, where each column contains
            the L2 norm of the corresponding input feature
    """
    # Step 1: Transpose to make input features the first dimension
    # Shape changes from (out_features, in_features) to (in_features, out_features)
    x_transposed = x.transpose(0, 1)

    # Step 2: Compute L2 norm along dim=1 (along output features)
    # keepdim=True maintains the dimension, resulting in shape (in_features, 1)
    norms = x_transposed.norm(dim=1, keepdim=True)

    # Step 3: Transpose back to original shape
    # Final shape is (out_features, in_features)
    return norms.transpose(0, 1)


# Set random seed for reproducibility
torch.manual_seed(42)

# Set rank for low-rank approximation
RANK = 1

# Replace random initialization with real weights
w1, w2 = load_model_weights()

# Method 1: Direct SVD on weight differences
diff_w = w2 - w1  # Compute difference between weights
u, s, vh = torch.linalg.svd(diff_w)  # Perform SVD decomposition

# Reconstruct using only top-k singular values/vectors (k=RANK)
low_rank_diff = u[:, :RANK] @ torch.diag(s[:RANK]) @ vh[:RANK, :]
reconstruction1 = w1 + low_rank_diff  # Add low-rank difference back to w1

# Method 2: SVD on normalized weight differences
# First compute norms along input dimension
w1_norm = input_norm(w1)
w2_norm = input_norm(w2)

# Normalize weights by their input-wise L2 norms
normed_w2 = w2 / w2_norm
normed_w1 = w1 / w1_norm
normed_diff_w = normed_w2 - normed_w1  # Compute difference in normalized space

# Perform SVD on normalized difference
u, s, vh = torch.linalg.svd(normed_diff_w)
# Reconstruct using only top-k singular values/vectors
low_rank_normed_diff = u[:, :RANK] @ torch.diag(s[:RANK]) @ vh[:RANK, :]
normed_reconstruction = normed_w1 + low_rank_normed_diff
# Scale back to original magnitude using target norm (w2_norm)
reconstruction2 = normed_reconstruction / input_norm(normed_reconstruction) * w2_norm

# Print MSE losses
print("Direct SVD MSE:", F.mse_loss(reconstruction1, w2).item())
print("Normalized SVD MSE:", F.mse_loss(reconstruction2, w2).item())

# Visualize the results
visualize_reconstructions(w1, w2, reconstruction1, reconstruction2)
