---
weight: 1
bookFlatSection: false
title: "Non-Euclidean Wolf"
draft: true
---

<!-- markdownlint-disable MD025 -->

# Non-Euclidean Wolf

## Introduction

In a non-Euclidean space, the Pythagorean theorem does not hold in its traditional form. Instead, the distance {{< katex >}}d{{< /katex >}} between two points {{< katex >}}(x_1, y_1){{< /katex >}} and {{< katex >}}(x_2, y_2){{< /katex >}} is given by:

{{< katex display=true >}}
d = \sqrt{|x_2 - x_1|^p + |y_2 - y_1|^p}
{{< /katex >}}

where {{< katex >}}p{{< /katex >}} is a parameter that determines the "curvature" of the space.

## Linear Algebra in Non-Euclidean Spaces

In non-Euclidean spaces, traditional linear algebra operations need to be adapted. For instance, the dot product between two vectors {{< katex >}}v{{< /katex >}} and {{< katex >}}w{{< /katex >}} becomes:

{{< katex display=true >}}
v \cdot w = \sum_{i=1}^{n} v_i^p w_i^p
{{< /katex >}}

Where {{< katex >}}v_i{{< /katex >}} and {{< katex >}}w_i{{< /katex >}} are the components of the vectors {{< katex >}}v{{< /katex >}} and {{< katex >}}w{{< /katex >}}, respectively.

## Low-Rank Adaptation

Low-rank adaptation is key to understanding this abstract world. A matrix {{< katex >}}A{{< /katex >}} of rank {{< katex >}}r{{< /katex >}} can be approximated by a matrix {{< katex >}}\tilde{A}{{< /katex >}} of lower rank {{< katex >}}k < r{{< /katex >}}. This can be achieved through a process called singular value decomposition (SVD):

{{< katex display=true >}}
A = U \Sigma V^T
{{< /katex >}}

Where {{< katex >}}U{{< /katex >}} and {{< katex >}}V{{< /katex >}} are orthogonal matrices and {{< katex >}}\Sigma{{< /katex >}} is a diagonal matrix containing the singular values of {{< katex >}}A{{< /katex >}}.
