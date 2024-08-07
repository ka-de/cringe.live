---
weight: 5
bookFlatSection: false
title: "Kolmogorov-Arnold Representation Theorem"
bookToC: false
summary: "The Kolmogorov-Arnold Representation Theorem states that every multivariate continuous function can be represented as a superposition of continuous functions of one variable and the binary operation of addition."
---

<!-- markdownlint-disable MD025 -->

# Kolmogorov-Arnold Representation Theorem

---

The Kolmogorov-Arnold Representation Theorem, also known as the superposition theorem, is a significant result in real analysis and approximation theory.

It was first proved by Andrey Kolmogorov in 1956 and later extended by his student Vladimir Arnold in 1957.

The theorem states that every multivariate continuous function can be represented as a superposition of continuous functions of one variable. More specifically, if $f$ is a multivariate continuous function, then $f$ can be written as a finite composition of continuous functions of a single variable and the binary operation of addition.

The mathematical representation is as follows:

$$f(x_1, \ldots, x_m) = \sum_{i=1}^{2m+1} \Phi_i \left( \sum_{j=1}^{m} \phi_{i,j}(x_j) \right)$$

Where $\Phi_i$ and $\phi_{i,j}$ are continuous monotonically increasing functions on the interval $[0,1]$

This theorem solved a more constrained form of Hilbert’s thirteenth problem, so the original Hilbert’s thirteenth problem is a corollary. In a sense, they showed that the only true multivariate function is the sum, since every other function can be written using univariate functions and summing.

There is a longstanding debate whether the Kolmogorov-Arnold representation theorem can explain the use of more than one hidden layer in neural networks. The Kolmogorov-Arnold representation decomposes a multivariate function into an interior and an outer function and therefore has indeed a similar structure as a neural network with two hidden layers.
