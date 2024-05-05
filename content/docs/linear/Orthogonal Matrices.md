---
weight: 1
bookFlatSection: false
title: "Orthogonal Matrices"
---

<!-- markdownlint-disable MD025 -->

# Orthogonal Matrices

An orthogonal matrix is a square matrix whose rows and columns are orthogonal unit vectors. In other words, it is a matrix whose columns (and rows) form an orthonormal basis for the vector space they span.
More precisely, a matrix {{< katex >}}Q{{< /katex >}} is orthogonal if it satisfies the following condition:

{{< katex display=true >}}
Q^T Q = Q Q^T = I
{{< katex >}}

Where {{< katex >}}Q^T{{< /katex >}} is the transpose of {{< katex >}}Q{{< /katex >}}, and {{< katex >}}I{{< /katex >}} is the identity matrix of the same dimensions.

Some key properties of orthogonal matrices:

- The columns (and rows) are orthonormal, meaning they are mutually perpendicular unit vectors.
- The inverse of an orthogonal matrix is equal to its transpose: {{< katex >}}Q^-1 = Q^T{{< /katex >}}
- Multiplying a vector by an orthogonal matrix preserves its length (norm).
- The determinant of an orthogonal matrix is either +1 or -1.
