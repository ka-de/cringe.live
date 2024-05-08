---
weight: 1
bookFlatSection: false
title: "Singular Value Decomposition"
---

<!-- markdownlint-disable MD025 -->

# Singular Value Decomposition

Singular Value Decomposition (SVD) is a powerful matrix factorization technique that plays a crucial role in various fields, including machine learning, signal processing, and data analysis.

At its core, SVD decomposes a real or complex matrix into three matrices: two orthogonal matrices and one diagonal matrix containing the singular values.

The beauty of SVD lies in its ability to capture the essential information within a matrix while filtering out noise or less significant components. This property makes SVD an invaluable tool for applications such as data compression, dimensionality reduction, and low-rank approximations.
One notable application of SVD is in the field of natural language processing, where it is used in techniques like Latent Semantic Analysis (LSA) to uncover the underlying semantic relationships between words and documents. Similarly, in computer vision and image processing, SVD is employed for tasks like image compression (e.g., JPEG) and watermarking.
Beyond its practical applications, SVD also plays a fundamental role in linear algebra, providing insights into the structure and properties of matrices. It can be used to compute matrix inverses, solve least-squares problems, and analyze the rank and range of matrices.

The SVD of a matrix {{< katex >}}A{{< /katex >}} (m × n) is given by:

{{< katex display=true >}}
A = U \Sigma V^T
{{< /katex >}}

Where:

- {{< katex >}}A{{< /katex >}} is an m × n matrix
- {{< katex >}}U{{< /katex >}} is an m × m orthogonal matrix ({{< katex >}}U^T U = I{{< /katex >}})
- {{< katex >}}\Sigma{{< /katex >}} (Sigma) is an m × n diagonal matrix with non-negative real numbers on the diagonal
- {{< katex >}}V^T{{< /katex >}} is the transpose of an n × n orthogonal matrix {{< katex >}}V{{< /katex >}} ({{< katex >}}V^T V = I{{< /katex >}})

The diagonal entries of {{< katex >}}\Sigma{{< /katex >}} are called the singular values of {{< katex >}}A{{< /katex >}}, denoted by {{< katex >}}\sigma_i{{< /katex >}}:

The singular values in {{< katex >}}\Sigma{{< /katex >}} are arranged in descending order, and they represent the importance or "energy" of each corresponding pair of singular vectors in {{< katex >}}U{{< /katex >}} and {{< katex >}}V{{< /katex >}}. The larger singular values capture more important information about the original matrix A, while smaller singular values capture less important or "noisy" information.

## How the SVD is computed

- Calculate the matrix product {{< katex >}}A^T A{{< /katex >}}, which is an n × n matrix.
- Find the eigenvalues and eigenvectors of {{< katex >}}A^T A{{< /katex >}}.
- The eigenvectors of {{< katex >}}A^T A{{< /katex >}} are the columns of {{< katex >}}V{{< /katex >}}.
- The singular values {{< katex >}}σ_i{{< /katex >}} are the square roots of the eigenvalues of {{< katex >}}A^T A{{< /katex >}}.
- The columns of {{< katex >}}U{{< /katex >}} are obtained by multiplying {{< katex >}}A{{< /katex >}} with the corresponding columns of {{< katex >}}V{{< /katex >}}, and then dividing by the corresponding singular values.

Mathematically, it can be expressed as:

{{< katex display=true >}}
A^T A = V \Lambda V^T
{{< /katex >}}

Where {{< katex >}}\Lambda{{< /katex >}} is a diagonal matrix containing the eigenvalues of {{< katex >}}A^T A{{< /katex >}}.
The singular values {{< katex >}}σ_i{{< /katex >}} are the square roots of the diagonal elements of {{< katex >}}\Lambda{{< /katex >}}:

{{< katex display=true >}}
\Sigma = \sqrt{\Lambda}
{{< /katex >}}

And the columns of U are given by:

{{< katex display=true >}}
U = A V \Sigma^{-1}
{{< /katex >}}

## Visualizing SVD and Low-Rank Matrix Approximation

This script extends the visualization by comparing different ranks of matrix approximations. It quantifies the approximation quality using the Frobenius norm, providing a clear metric to evaluate how well each low-rank approximation represents the original matrix.

<!--{{< expand "Show Code" >}}-->
```python
import numpy as np
import matplotlib.pyplot as plt

# Generate a random matrix A of size 5x3
A = np.random.randn(10, 10)

# Compute the SVD
U, s, Vh = np.linalg.svd(A, full_matrices=False)

# Rank for low-rank approximation
k = 2  # Choose a smaller value for k to see the effect

# Low-rank approximation
sigma_k = np.diag(s[:k])
U_k = U[:, :k]
Vh_k = Vh[:k, :]

A_approx = U_k @ sigma_k @ Vh_k

# Plot the original matrix
plt.figure(figsize=(8, 4), dpi=200)
plt.subplot(1, 2, 1)
plt.imshow(A, cmap='viridis')
plt.title('Original Matrix')
plt.colorbar()

# Plot the low-rank approximation
plt.subplot(1, 2, 2)
plt.imshow(A_approx, cmap='viridis')
plt.title(f'Rank {k} Approximation')
plt.colorbar()
plt.tight_layout()
plt.show()

print("Original matrix:\n", A)
print(f"\nLow-rank approximation (rank {k}):\n", A_approx)
```

<!--{{< /expand >}}-->

### Example Output

![The plot of SVD](/images/svd-rank-approximation-3.png)

<div style="font-size:0.7rem">(and a bunch of numbers)</div>

### Assessing Approximation Quality with Frobenius Norm

Calculates the error between the original matrix and its approximations for different ranks. This error is the Frobenius norm of the difference between the original and approximated matrices, normalized by the Frobenius norm of the original matrix.

```python
import numpy as np
import matplotlib.pyplot as plt

# Generate a random matrix
A = np.random.randn(10, 10)

# Compute the SVD
U, s, Vh = np.linalg.svd(A, full_matrices=False)

# Low-rank approximations
ranks = [1, 3, 6, 9]
errors = []

fig, axes = plt.subplots(2, 2, figsize=(8, 6), dpi=200)
axes = axes.flatten()  # Flatten the axes into a 1D array

for rank, ax in zip(ranks, axes):
    sigma = np.diag(s[:rank])
    A_approx = U[:, :rank] @ sigma @ Vh[:rank, :]

    im = ax.imshow(A_approx, cmap='viridis')
    ax.set_title(f'Rank {rank} Approximation')
    fig.colorbar(im, ax=ax)  # Add colorbar to the current axis

    error = np.linalg.norm(A - A_approx) / np.linalg.norm(A)
    errors.append(error)

plt.tight_layout()
plt.show()

print("Errors for different ranks:")
for rank, error in zip(ranks, errors):
    print(f"Rank {rank}: {error:.4f}")
```

### Example output

![The plot of SVD](/images/svd-rank-approximation-4.png)

```text
Errors for different ranks:
Rank 1: 0.8228
Rank 3: 0.5732
Rank 6: 0.2730
Rank 9: 0.0550
```

## Important properties and applications

Low-rank approximation: By keeping only the k largest singular values and their corresponding singular vectors, we can approximate the original matrix A as A ≈ U_k Σ_k V_k^T, where U_k, Σ_k, and V_k^T are the truncated matrices containing the top k singular values and vectors. This is known as the low-rank approximation of A, and it is useful for data compression, noise reduction, and dimensionality reduction.
Matrix inversion and pseudoinverse: The SVD can be used to compute the inverse or pseudoinverse of a matrix, which is useful in linear algebra and least-squares problems.
Data analysis and dimensionality reduction: The SVD is used in techniques like Principal Component Analysis (PCA) and Latent Semantic Analysis (LSA) for dimensionality reduction and data analysis.
Image compression and processing: The SVD is used in image compression algorithms like JPEG and in various image processing tasks, such as watermarking and noise removal.
Signal processing: The SVD is used in signal processing applications like signal denoising, feature extraction, and subspace tracking.

SVD is used to perform a low-rank approximation of the merged LoRA weights. By keeping only the top k singular values and vectors, the script extracts a low-rank representation of the merged weights, which can be more efficient and compact than the original merged weights. This low-rank representation is then used as the new LoRA weights for the merged model.
The truncation of singular values and vectors is controlled by the --new_rank and --new_conv_rank arguments, which specify the desired rank (or dimension) of the output LoRA model. 

The script also applies clamping to the singular vectors to prevent them from becoming too large or too small, which can help improve numerical stability and convergence during training or fine-tuning.

{{< katex display=true >}}
\Sigma = \begin{bmatrix}
\sigma_1 & 0 & \cdots & 0 \\
0 & \sigma_2 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & \sigma_r
\end{bmatrix}
{{< /katex >}}

Where {{< katex >}}r{{< /katex >}} is the rank of {{< katex >}}A{{< /katex >}}, and the singular values are arranged in descending order:

{{< katex display=true >}}
\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_r \geq 0
{{< /katex >}}

The columns of {{< katex >}}U{{< /katex >}} and {{< katex >}}V{{< /katex >}} are called the left and right singular vectors of {{< katex >}}A{{< /katex >}}, respectively:

{{< katex display=true >}}
U = \begin{bmatrix}
| & | & & | \\
u_1 & u_2 & \cdots & u_m \\
| & | & & |
\end{bmatrix}
{{< /katex >}}

{{< katex display=true >}}
V = \begin{bmatrix}
| & | & & | \\
v_1 & v_2 & \cdots & v_n \\
| & | & & |
\end{bmatrix}
{{< /katex >}}

The SVD can be expressed in terms of the sum of rank-1 matrices:

{{< katex display=true >}}
A = \sum_{i=1}^r \sigma_i u_i v_i^T
{{< /katex >}}

Where {{< katex >}}u_i{{< /katex >}} and {{< katex >}}v_i{{< /katex >}} are the i-th columns of {{< katex >}}U{{< /katex >}} and {{< katex >}}V{{< /katex >}}, respectively.
The low-rank approximation of {{< katex >}}A{{< /katex >}}, using the top k singular values and vectors, is given by:

{{< katex display=true >}}
A_k = \sum_{i=1}^k \sigma_i u_i v_i^T
{{< /katex >}}

Where {{< katex >}}A_k{{< /katex >}} is the best rank-k approximation of {{< katex >}}A{{< /katex >}} in the least-squares sense.

## Afterthoughts

While SVD is an incredibly powerful and versatile matrix factorization technique, it is important to recognize its limitations and potential drawbacks. Understanding these limitations can help practitioners use SVD more effectively and choose appropriate alternatives when necessary. One major limitation of SVD is its computational complexity. Computing the SVD of a large matrix can be computationally expensive, especially for dense matrices. The computational cost grows significantly with the size of the matrix, making it challenging to apply SVD to very large-scale problems. This limitation has led to the development of various approximation techniques and algorithms to reduce the computational burden.

SVD is known to be sensitive to noise and perturbations in the input data. Small changes in the matrix elements can potentially lead to significant changes in the singular values and singular vectors, which can propagate and amplify errors in subsequent computations or applications. This sensitivity can be problematic in scenarios where the input data is noisy or subject to measurement errors. While the singular values provide a clear measure of the importance or energy associated with each singular vector pair, interpreting the singular vectors themselves can be challenging, especially in high-dimensional spaces. The singular vectors may not always have an intuitive interpretation, making it difficult to extract meaningful insights or perform further analysis based on them.

The SVD decomposition is not unique for matrices with repeated singular values. In such cases, there can be multiple valid sets of singular vectors corresponding to the repeated singular values. This lack of uniqueness can introduce ambiguity and complications in certain applications, such as low-rank approximations or signal processing tasks.
The singular values and singular vectors of a matrix can be affected by the scaling and normalization of the input data. Different scaling or normalization techniques can lead to different SVD results, which may impact the interpretation and performance of subsequent analyses or applications. Careful consideration of scaling and normalization is essential when working with SVD.

Despite these limitations, SVD remains a powerful and widely used technique in various domains. Researchers and practitioners continue to develop strategies and techniques to mitigate these limitations, such as incorporating regularization, using approximation algorithms, or combining SVD with other techniques to address specific challenges.

## Alternatives

- **Eigenvalue Decomposition (EVD)**: Eigenvalue Decomposition is a matrix factorization technique that decomposes a square matrix into a set of eigenvectors and eigenvalues. EVD is closely related to SVD and is often used for dimensionality reduction techniques like Principal Component Analysis (PCA). However, EVD is only applicable to square matrices, while SVD can handle rectangular matrices.
- **Non-negative Matrix Factorization (NMF)**: NMF is a matrix factorization technique that decomposes a non-negative matrix into two non-negative matrices. NMF is particularly useful for data that naturally has non-negative values, such as images, text documents, and audio signals. Unlike SVD, NMF enforces non-negativity constraints, which can lead to more interpretable factors.
- **Tensor Decompositions**: For higher-order data (tensors), CANDECOMP/PARAFAC (CP) and Tucker decomposition can be used as alternatives to SVD. These techniques can capture multi-way interactions and provide dimensionality reduction for tensors.
- **Randomized Algorithms**: Such as the Randomized SVD and Randomized Tensor Decompositions, can provide efficient approximations of SVD and tensor decompositions, respectively. These algorithms are particularly useful for large-scale matrices or tensors, where exact decompositions may be computationally expensive.
- **Sparse Matrix Factorizations**: For sparse matrices, techniques like Sparse PCA, Sparse SVD, and Sparse Coding can be used to obtain sparse factor representations, which can be beneficial for interpretation and compression.
**Deep Learning-based Methods**: With the rise of deep learning, several techniques have emerged for dimensionality reduction and matrix factorization using neural networks. Examples include Autoencoders, Variational Autoencoders (VAEs), and Generative Adversarial Networks (GANs).

