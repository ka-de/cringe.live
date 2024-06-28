---
weight: 1
bookFlatSection: false
title: "Norm"
bookToC: false
summary: "A norm is a mathematical function that assigns a positive length or size to vectors and matrices, commonly used in machine learning to measure model error."
---

<!--markdownlint-disable MD025 -->

# Norm

---

In mathematics, a **norm** is a function that assigns a strictly positive length or size to each vector in a vector space. It is a total size or length of all vectors in a vector space or matrices. For simplicity, let us consider it in a two-dimensional space. The norm of a vector $x = (x_1, x_2)$ is given by:

$$ ||x|| = \sqrt{x_1^2 + x_2^2} $$

The **norm** takes vectors as input and returns non-negative values. The norm of the zero vector is zero. For vectors, the norm can be thought of as the length of the vector. For matrices, the norm can be thought of as a measure of the magnitude of the matrix. For example, the norm of a matrix $A$ is given by:

$$ ||A|| = \sqrt{\sum_{i=1}^{m}\sum_{j=1}^{n} a_{ij}^2} $$

In machine learning, we use norms to understand and measure the error of a model. The most commonly used norms in machine learning are the $L1$ and $L2$ norms. The $L1$ norm is calculated as the sum of the absolute vector values, where the magnitude of the values do not impact the norm. The $L2$ norm calculates the distance of the vector coordinates from the origin of the vector space. As such, it is also known as the Euclidean norm as it is calculated as the Euclidean distance from the origin. It is called the `2-norm` because it is a member of a norm family that is identified by the positive integer $p$, as in $L_p$.

## Properties of Norms

---

Norms have several important properties:

1. Non-negativity: $||x|| \geq 0$ for all $x$
2. Definiteness: $||x|| = 0$ if and only if $x = 0$
3. Homogeneity: $||\alpha x|| = |\alpha| ||x||$ for all scalars $\alpha$
4. Triangle inequality: $||x + y|| \leq ||x|| + ||y||$

## Types of Norms

---

There are various types of norms, each with specific applications:

1. p-norm (Lp norm): $||x||_p = (\sum |x_i|^p)^{1/p}$, where $p \geq 1$
2. L∞ norm (Maximum norm): $||x||_\infty = \max(|x_i|)$
3. Frobenius norm (for matrices): $||A||_F = \sqrt{\sum |a_{ij}|^2}$

## Induced Matrix Norms

---

Norms can be defined for matrices based on their effect on vector norms. For a matrix $A$ and vector $x$:

$||A|| = \sup\{||Ax|| : ||x|| = 1\}$

## Applications in Mathematics and Machine Learning

---

1. Normalized vectors: A vector with a norm of 1 is called a unit vector or normalized vector.
2. Functional analysis: Norms are crucial in defining metric spaces and studying convergence in infinite-dimensional spaces.
3. Optimization: Norms play a significant role in optimization problems, particularly in regularization techniques like Lasso (L1) and Ridge (L2) regression.
4. Equivalence of norms: In finite-dimensional spaces, all norms are equivalent, meaning they induce the same topology.
5. Inner products: In inner product spaces, norms can be derived from inner products: $||x|| = \sqrt{\langle x, x \rangle}$

## Advanced Concepts

---

1. Dual norms: For every norm, there exists a dual norm defined on the dual space.
2. Normed algebras: Norms can be defined on algebras, leading to the study of Banach algebras and C*-algebras in functional analysis.
