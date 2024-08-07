---
weight: 2
bookFlatSection: false
title: "Cross Product"
summary: "The article discusses the cross product of vectors in three-dimensional space, its geometric interpretation, important properties like anticommutativity and distributivity, its relation to other vector operations, examples of cross product calculations, and practice problems involving cross product applications."
---

<!--markdownlint-disable MD033 MD029 MD025 -->

# Cross Product

---

The cross product, also known as the vector product, is a binary operation on two vectors in three-dimensional space. It's denoted by the symbol $\times$ and results in a vector that is perpendicular (or orthogonal) to the plane containing the two original vectors.

If you have two vectors $\vec{a} = [a1, a2, a3]$ and $\vec{b} = [b1, b2, b3]$, their cross product, denoted as $\vec{a} \times \vec{b}$ is defined as:

$$\mathbf{\vec{a}} \times \mathbf{\vec{b}} = \begin{bmatrix} a2b3 - a3b2 \\ a3b1 - a1b3 \\ a1b2 - a2b1 \end{bmatrix}$$

The cross product is only defined in three dimensions. In higher dimensions, one typically uses the more general concept of the exterior product. The cross product is used in various fields such as physics (torque, angular momentum), computer graphics (finding normals to surfaces), and engineering (moment of forces).

## Geometric Interpretation

---

Geometrically, the magnitude (or length) of the cross product vector equals the area of the parallelogram formed by the two original vectors. The direction of the cross product vector is given by the right-hand rule: if you point your open right hand in the direction of $\vec{a}$ and then curl your fingers towards $\vec{b}$, your thumb points in the direction of $\vec{a} \times \vec{b}$.

## Properties

---

The cross product has several important properties, including:

### Anticommutativity

The property of anticommutativity means that the order in which the vectors are crossed matters. If you have two vectors $\vec{a}$ and $\vec{b}$, the cross product $\vec{a} \times \vec{b}$ is the negative of $\vec{b} \times \vec{a}$. In other words:

$$\mathbf{\vec{a}} \times \mathbf{\vec{b}} = -(\mathbf{\vec{b}} \times \mathbf{\vec{a}})$$

This is different from the dot product, which is commutative. (i.e., $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$)

### Distributivity over addition

The distributive property of the cross product states that the cross product distributes over vector addition. That is, if you have three vectors $\vec{a}$, $\vec{b}$ and $\vec{c}$, then the cross product of $\vec{a}$ with the sum of $\vec{b}$ and $\vec{c}$ is equal to the sum of the cross product of $\vec{a}$ and $\vec{b}$ and the cross product of $\vec{a}$ and $\vec{c}$. Mathematically this is expressed as:

$$\mathbf{\vec{a}} \times (\mathbf{\vec{b}} + \mathbf{\vec{c}}) = \mathbf{\vec{a}} \times \mathbf{\vec{b}} + \mathbf{\vec{a}} \times \mathbf{\vec{c}}$$

### Scalar multiplication

The property of scalar multiplication states that the cross product is compatible with scalar multiplication. If you multiply a vector $\vec{a}$ by a scalar $k$ and then take the cross product of this with a vector $\vec{b}$, it's the same as if you took the cross product of $\vec{a}$ and $\vec{b}$ first and then multiplied the result by $k$. Similarly, it's also the same as if you multiplied $\vec{b}$ by $k$ before taking the cross product. This can be written as:

$$(k\mathbf{\vec{a}}) \times \mathbf{\vec{b}} = k(\mathbf{\vec{a}} \times \mathbf{\vec{b}}) = \mathbf{\vec{a}} \times (k\mathbf{\vec{b}})$$

Where $k$ is a scalar.

## Relation to Other Vector Operations

---

While the cross product is a useful operation, it's important to understand when it's appropriate to use it and when other vector operations, such as the dot product or scalar triple product, might be more suitable. The dot product, for instance, is useful for determining the angle between two vectors or projecting one vector onto another, while the scalar triple product is used to find the scalar triple product of three vectors.

## Examples

---

Let's calculate the cross product of two simple vectors, $\mathbf{\vec{a}} = [1, 0, 0]$ and $\mathbf{\vec{b}} = [0, 1, 0]$:

$$
\mathbf{\vec{a}} \times \mathbf{\vec{b}} = \begin{bmatrix}
0 \times 0 - 0 \times 1 \\
0 \times 0 - 0 \times 0 \\
1 \times 1 - 0 \times 0
\end{bmatrix} = \begin{bmatrix}
0 \\
0 \\
1
\end{bmatrix}
$$

So, the cross product of $[1, 0, 0]$ and $[0, 1, 0]$ is $[0, 0, 1]$, which is a vector pointing in the positive z-direction with a magnitude of 1.

## Practice Problems

---

1. Calculate the cross product of $\mathbf{\vec{a}} = [2, 1, -3]$ and $\mathbf{\vec{b}} = [4, -2, 1]$.

<details>
  <summary>Click to reveal solution</summary>

The cross product of two vectors $\vec{a}$ and $\vec{b}$ can be calculated using the formula:

$$
\mathbf{\vec{a}} \times \mathbf{\vec{b}} = \begin{bmatrix} a_2b_3 - a_3b_2 \\ a_3b_1 - a_1b_3 \\ a_1b_2 - a_2b_1 \end{bmatrix}
$$

To calculate the cross product of $\mathbf{\vec{a}} = [2, 1, -3]$ and $\mathbf{\vec{b}} = [4, -2, 1]$:

The first component of the cross product is calculated as $a_2b_3 - a_3b_2 = 1*1 - (-3)*(-2) = 1 - 6 = -5$.

The second component is calculated as $a_3b_1 - a_1b_3 = -3*4 - 2*1 = -12 - 2 = -14$.

The third component is calculated as $a_1b_2 - a_2b_1 = 2*(-2) - 1*4 = -4 - 4 = -8$.

Solution with numpy:

```python
"""
This script calculates the cross product of two 3-dimensional vectors.
The vectors are defined as numpy arrays 'a' and 'b'.
The cross product is calculated using numpy's cross function.

Parameters:
a : numpy array
    The first vector, defined as a numpy array of three elements.
b : numpy array
    The second vector, defined as a numpy array of three elements.

Returns:
cross_product : numpy array
    The cross product of vectors 'a' and 'b'.
    This is a vector that is perpendicular to the plane containing 'a' and 'b'
"""
import numpy as np

# Define the vectors
a = np.array([2, 1, -3])
b = np.array([4, -2, 1])

# Calculate the cross product
cross_product = np.cross(a, b)

print("The cross product of a and b is: ", cross_product)
```

Solution with PyTorch:

```python
"""
This script calculates the cross product of two 3D vectors using PyTorch.

The cross product of two vectors a and b is a vector that is perpendicular
to both and therefore normal to the plane containing them.

Parameters:
a : torch.Tensor
    The first input vector. It should be a 1D tensor with 3 elements.
b : torch.Tensor
    The second input vector. It should be a 1D tensor with 3 elements.

Returns:
    cross_product : torch.Tensor
        The cross product of vectors a and b.
        It is a 1D tensor with 3 elements.
"""
import torch

# Define the vectors
a = torch.tensor([2, 1, -3])
b = torch.tensor([4, -2, 1])

# Calculate the cross product
cross_product = torch.linalg.cross(a, b)

print("The cross product of a and b is: ", cross_product)
```

</details>

2. Find the cross product of $\mathbf{\vec{u}} = [1, 2, 3]$ and $\mathbf{\vec{v}} = [4, 5, 6]$.

<details>
  <summary>Click to reveal solution</summary>

Solution with numpy:

```python
"""
This script calculates the cross product of two 3-dimensional vectors.
The vectors are defined as numpy arrays 'u' and 'v'.
The cross product is calculated using numpy's cross function.

Parameters:
u : numpy array
    The first vector, defined as a numpy array of three elements.
v : numpy array
    The second vector, defined as a numpy array of three elements.

Returns:
cross_product_numpy : numpy array
    The cross product of vectors 'u' and 'v'.
    This is a vector that is perpendicular to the plane containing 'u' and 'v'
"""
import numpy as np

# define the vectors
u = np.array([1, 2, 3])
v = np.array([4, 5, 6])

# compute the cross product
cross_product_numpy = np.cross(u, v)

print("Cross product: ", cross_product_numpy)
```

Solution with PyTorch:

```python
"""
This script computes the cross product of two 3-dimensional vectors using
PyTorch. The vectors are defined as 1-D PyTorch tensors. The `torch.cross()`
function is used to compute the cross product.

Parameters:
u_torch : torch.Tensor
    A 1-D tensor representing the first vector.
v_torch : torch.Tensor
    A 1-D tensor representing the second vector.

Returns:
    cross_product_pytorch : torch.Tensor
        A 1-D tensor representing the cross
        product of `u_torch` and `v_torch`.
"""
import torch

# define the vectors
u_torch = torch.tensor([1, 2, 3])
v_torch = torch.tensor([4, 5, 6])

# compute the cross product
cross_product_pytorch = torch.linalg.cross(u_torch, v_torch)

print("Cross product: ", cross_product_pytorch)
```

</details>

3. If the position vector of a force $\mathbf{\vec{F}} = [10, 20, 0]$ is $\mathbf{\vec{r}} = [2, 1, 3]$, calculate the torque about the origin using the cross product.

<details>
  <summary>Click to reveal solution</summary>

Solution with numpy:

```python
import numpy as np

def calculate_torque_np(F, r):
    """
    Calculate the torque about the origin using numpy.

    Parameters:
    F : np.array
        Force vector
    r : np.array
        Position vector

    Returns:
        np.array: Torque vector
    """
    return np.cross(r, F)

F = np.array([10, 20, 0])
r = np.array([2, 1, 3])
torque = calculate_torque_np(F, r)
print("Torque: ", torque)
```

Solution with PyTorch:

```python
import torch

def calculate_torque_torch(F, r):
    """
    Calculate the torque about the origin using PyTorch.

    Parameters:
    F : torch.Tensor
        Force vector
    r : torch.Tensor
        Position vector

    Returns:
        torch.Tensor
            The torque vector
    """
    return torch.linalg.cross(r, F)

F = torch.tensor([10, 20, 0])
r = torch.tensor([2, 1, 3])
torque = calculate_torque_torch(F, r)
print("Torque: ", torque)
```

</details>
