---
weight: 1
bookFlatSection: false
title: "Singular Value Decomposition"
---

<!-- markdownlint-disable MD025 -->

# Singular Value Decomposition

SVD is a matrix factorization technique that decomposes a real or complex matrix into three matrices: two orthogonal matrices and one diagonal matrix. The SVD of a matrix {{< katex >}}A{{< /katex >}} (m × n) is given by:

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

Here's how the SVD is computed:

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

The SVD has several important properties and applications:

Low-rank approximation: By keeping only the k largest singular values and their corresponding singular vectors, we can approximate the original matrix A as A ≈ U_k Σ_k V_k^T, where U_k, Σ_k, and V_k^T are the truncated matrices containing the top k singular values and vectors. This is known as the low-rank approximation of A, and it is useful for data compression, noise reduction, and dimensionality reduction.
Matrix inversion and pseudoinverse: The SVD can be used to compute the inverse or pseudoinverse of a matrix, which is useful in linear algebra and least-squares problems.
Data analysis and dimensionality reduction: The SVD is used in techniques like Principal Component Analysis (PCA) and Latent Semantic Analysis (LSA) for dimensionality reduction and data analysis.
Image compression and processing: The SVD is used in image compression algorithms like JPEG and in various image processing tasks, such as watermarking and noise removal.
Signal processing: The SVD is used in signal processing applications like signal denoising, feature extraction, and subspace tracking.

In the context of the provided script, the SVD is used to perform a low-rank approximation of the merged LoRA weights. By keeping only the top k singular values and vectors, the script extracts a low-rank representation of the merged weights, which can be more efficient and compact than the original merged weights. This low-rank representation is then used as the new LoRA weights for the merged model.
The truncation of singular values and vectors is controlled by the --new_rank and --new_conv_rank arguments, which specify the desired rank (or dimension) of the output LoRA model. The script also applies clamping to the singular vectors to prevent them from becoming too large or too small, which can help improve numerical stability and convergence during training or fine-tuning.

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
