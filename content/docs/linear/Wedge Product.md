---
weight: 2
bookFlatSection: false
title: "Wedge Product"
summary: "The article discusses the wedge product of vectors in linear algebra, its geometric interpretation, important properties like anticommutativity and distributivity, its relation to other vector operations, examples of wedge product calculations, and practice problems involving wedge product applications."
bookToC: true
---

<!--markdownlint-disable MD033 MD029 MD025 -->

# Wedge Product

---

The wedge product, also known as the exterior product, is a binary operation on vectors in a vector space. It's denoted by the symbol ∧ and results in a new vector that represents the oriented area or volume of the parallelogram or parallelepiped formed by the original vectors.

If you have two vectors $\vec{a} = a_1 \vec{e}_1 + a_2 \vec{e}_2 +... + a_n \vec{e}_n$ and $\vec{b} = b_1 \vec{e}_1 + b_2 \vec{e}_2 +... + b_n \vec{e}_n$, their wedge product, denoted as $\vec{a} \wedge \vec{b}$, is defined as:

$$\mathbf{\vec{a}} \wedge \mathbf{\vec{b}} = (a_1b_2 - a_2b_1) \vec{e}_1 \wedge \vec{e}_2 + (a_1b_3 - a_3b_1) \vec{e}_1 \wedge \vec{e}_3 +... + (a_{n-1}b_n - a_nb_{n-1}) \vec{e}_{n-1} \wedge \vec{e}_n$$

The wedge product is used in various fields such as physics (electromagnetism, relativity), computer science (computer graphics, geometric algorithms), and engineering (mechanics, electrical engineering).

## Geometric Interpretation

Geometrically, the wedge product of two vectors represents the oriented area of the parallelogram formed by the two vectors. The direction of the resulting vector is given by the right-hand rule: if you point your open right hand in the direction of $\vec{a}$ and then curl your fingers towards $\vec{b}$, your thumb points in the direction of $\vec{a} \wedge \vec{b}$.

## Properties

The wedge product has several important properties, including:

### Anticommutativity

The property of anticommutativity means that the order in which the vectors are wedged matters. If you have two vectors $\vec{a}$ and $\vec{b}$, the wedge product $\vec{a} \wedge \vec{b}$ is the negative of $\vec{b} \wedge \vec{a}$. In other words:

$$\mathbf{\vec{a}} \wedge \mathbf{\vec{b}} = -(\mathbf{\vec{b}} \wedge \mathbf{\vec{a}})$$

This is different from the dot product, which is commutative. (i.e., $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$)

### Distributivity over addition

The distributive property of the wedge product states that the wedge product distributes over vector addition. That is, if you have three vectors $\vec{a}$, $\vec{b}$ and $\vec{c}$, then the wedge product of $\vec{a}$ with the sum of $\vec{b}$ and $\vec{c}$ is equal to the sum of the wedge product of $\vec{a}$ and $\vec{b}$ and the wedge product of $\vec{a}$ and $\vec{c}$. Mathematically this is expressed as:

$$\mathbf{\vec{a}} \wedge (\mathbf{\vec{b}} + \mathbf{\vec{c}}) = \mathbf{\vec{a}} \wedge \mathbf{\vec{b}} + \mathbf{\vec{a}} \wedge \mathbf{\vec{c}}$$

### Scalar multiplication

The property of scalar multiplication states that the wedge product is compatible with scalar multiplication. If you multiply a vector $\vec{a}$ by a scalar $k$ and then take the wedge product of this with a vector $\vec{b}$, it's the same as if you took the wedge product of $\vec{a}$ and $\vec{b}$ first and then multiplied the result by $k$. Similarly, it's also the same as if you multiplied $\vec{b}$ by $k$ before taking the wedge product. This can be written as:

$$(k\mathbf{\vec{a}}) \wedge \mathbf{\vec{b}} = k(\mathbf{\vec{a}} \wedge \mathbf{\vec{b}}) = \mathbf{\vec{a}} \wedge (k\mathbf{\vec{b}})$$

Where $k$ is a scalar.

## Relation to Other Vector Operations

While the wedge product is a useful operation, it's important to understand when it's appropriate to use it and when other vector operations, such as the dot product or cross product, might be more suitable. The dot product, for instance, is useful for determining the angle between two vectors or projecting one vector onto another, while the cross product is used to find the vector perpendicular to two vectors.

## Examples

Let's calculate the wedge product of two simple vectors, $\mathbf{\vec{a}} = [1, 0, 0]$ and $\mathbf{\vec{b}} = [0, 1, 0]$:

$$
\mathbf{\vec{a}} \wedge \mathbf{\vec{b}} = (1*0 - 0*1) \vec{e}_1 \wedge \vec{e}_2 + (1*0 - 0*0) \vec{e}_1 \wedge \vec{e}_3 + (0*0 - 0*1) \vec{e}_2 \wedge \vec{e}_3 = \vec{e}_1 \wedge \vec{e}_2
$$

So, the wedge product of $[1, 0, 0]$ and $[0, 1, 0]$ is $\vec{e}_1 \wedge \vec{e}_2$, which represents the oriented area of the parallelogram formed by the two vectors.

## Practice Problems

1. Calculate the wedge product of $\mathbf{\vec{a}} = [2, 1, -3]$ and $\mathbf{\vec{b}} = [4, -2, 1]$.

<details>
  <summary>Click to reveal solution</summary>

Solution:

$$
\mathbf{\vec{a}} \wedge \mathbf{\vec{b}} = (2*-2 - 1*4) \vec{e}_1 \wedge \vec{e}_2 + (2*1 - -3*-2) \vec{e}_1 \wedge \vec{e}_3 + (1*1 - -3*-2) \vec{e}_2 \wedge \vec{e}_3 = -8 \vec{e}_1 \wedge \vec{e}_2 + 10 \vec{e}_1 \wedge \vec{e}_3 + 7 \vec{e}_2 \wedge \vec{e}_3
$$

</details>

2. Find the wedge product of $\mathbf{\vec{u}} = [1, 2, 3]$ and $\mathbf{\vec{v}} = [4, 5, 6]$.

<details>
  <summary>Click to reveal solution</summary>

Solution:

$$
\mathbf{\vec{u}} \wedge \mathbf{\vec{v}} = (1*5 - 2*4) \vec{e}_1 \wedge \vec{e}_2 + (1*6 - 3*4) \vec{e}_1 \wedge \vec{e}_3 + (2*6 - 3*5) \vec{e}_2 \wedge \vec{e}_3 = -3 \vec{e}_1 \wedge \vec{e}_2 - 6 \vec{e}_1 \wedge \vec{e}_3 + 3 \vec{e}_2 \wedge \vec{e}_3
$$

</details>

## NumPy Example

```python
import numpy as np

# Define two vectors
a = np.array([2, 1, -3])
b = np.array([4, -2, 1])

# Define a function to calculate the wedge product
def wedge_product(a, b):
    n = len(a)
    result = np.zeros((n, n))
    for i in range(n):
        for j in range(i+1, n):
            result[i, j] = a[i]*b[j] - a[j]*b[i]
    return result

# Calculate the wedge product
wedge = wedge_product(a, b)
print("Wedge product:\n", wedge)
```

## Pytorch Example

```python
import torch

# Define two vectors
a = torch.tensor([2, 1, -3], dtype=torch.float32)
b = torch.tensor([4, -2, 1], dtype=torch.float32)

# Define a function to calculate the wedge product
def wedge_product(a, b):
    n = a.size(0)
    result = torch.zeros((n, n))
    for i in range(n):
        for j in range(i+1, n):
            result[i, j] = a[i]*b[j] - a[j]*b[i]
    return result

# Calculate the wedge product
wedge = wedge_product(a, b)
print("Wedge product:\n", wedge)
```
