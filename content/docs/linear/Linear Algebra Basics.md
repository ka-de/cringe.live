---
weight: 1
bookFlatSection: false
title: "Linear Algebra Basics"
summary: "Linear Algebra Basics covers the fundamentals of vectors, vector operations, matrices, and matrix operations"
---

<!--markdownlint-disable MD033 MD029 MD025 -->

# Linear Algebra Basics

---

Linear Algebra is a branch of mathematics that deals with vectors, vector spaces and linear transformations. It has wide applications in fields like physics, computer graphics, data analysis and generating yiff.

## Vectors

---

Vectors are mathematical objects that have both magnitude (size) and direction. They can represent physical quantities like force, velocity or displacement. For example, if you're a furry running in a park, your velocity is a vector - it has a speed (magnitude) and a direction you're running in.

![A furry running in a park](/images/linear/furry-running.jpg)

_This furry has a velocity._

Even this [DVD logo](/dvd.html) has a vector, not just furries, just press the `v` key and an arrow will display the vector of the logo. Vectors are everywhere, even in your pants! Points are usually denoted with capital letters, like {{< katex >}}A{{< /katex >}}. A directed line segment from {{< katex >}}A{{< /katex >}} to {{< katex >}}B{{< /katex >}} is denoted by {{< katex >}}\overrightarrow{AB}{{< /katex >}}.

{{< katex display=true >}}
\vec{v} = \overrightarrow{AB}
{{< /katex >}}

Vectors are often represented as an array of numbers, where each number corresponds to a coordinate in space. In a 2D plane, a vector {{< katex >}}\vec{v}{{< /katex >}} can be represented as an ordered pair: {{< katex >}}\vec{v} = [v_1, v_2]{{< /katex >}}. Here {{< katex >}}v_1{{< /katex >}} and {{< katex >}}v_2{{< /katex >}} are the components of {{< katex >}}\vec{v}{{< /katex >}} along the x and y axes respectively. You can also represent it like:

{{< katex display=true >}}
\vec{v} = \begin{bmatrix} v_1 \\ v_2 \end{bmatrix}
{{< /katex >}}

For example, the vector {{< katex >}}\vec{v} = [2, 3]{{< /katex >}} can be visualized as an arrow starting at the origin {{< katex >}}(0, 0){{< /katex >}} and pointing 2 units in the positive x-direction and 3 units in the positive y-direction.

![My First Vector](/images/linear/hello-vectors.png)

<details>
  <summary>Click to reveal script</summary>

```python
"""
This script creates a 2D vector plot using matplotlib.
It defines a vector 'v' with coordinates (2,3) and plots it on a 2D grid.
The origin of the vector is at (0,0).
"""
import matplotlib.pyplot as plt

# Define the origin
origin = [0], [0]

# Define the vector v
v = [2, 3]

# Create a new figure
plt.figure()

# Plot the vector v
plt.quiver(*origin, *v, color='r', angles='xy', scale_units='xy', scale=1)

# Set the x-limits and y-limits of the plot
plt.xlim(-1, 3)
plt.ylim(-1, 4)

# Add a grid
plt.grid()

# Show the plot
plt.show()
```

</details>

Because we don't care about the origin of a vector to compare them, only their magnitudes, two parallel vectors that have the same length makes them equal.

{{< katex display=true >}}
\vec{v} = \overrightarrow{AB}, \quad \vec{w} = \overrightarrow{CD} \\
\vec{v} = \vec{w}
{{< /katex >}}

![Parallel vectors](/images/linear/parallel-vectors.png)

<details>
  <summary>Click to reveal script</summary>

```python
"""
This script plots two vectors, v and w, using matplotlib. The vector v originates
from the origin (0,0), while the vector w starts from a specified point (1,0).
Both vectors are defined as [2, 3], making them parallel to each other.
"""
import matplotlib.pyplot as plt

# Define the origin for v and starting point for w
origin_v = [0], [0]
origin_w = [1], [0]  # Change this to the desired starting point for w

# Define the vectors v and w
v = [2, 3]
w = [2, 3]  # w is parallel to v

# Create a new figure
plt.figure(dpi=200)

# Plot the vector v
plt.quiver(*origin_v, *v, color='r', angles='xy', scale_units='xy', scale=1)

# Plot the vector w
plt.quiver(*origin_w, *w, color='b', angles='xy', scale_units='xy', scale=1)

# Set the x-limits and y-limits of the plot
plt.xlim(-1, 4)
plt.ylim(-1, 5)

# Add a grid
plt.grid()

# Show the plot
plt.show()
```

</details>

### Vector Addition

If you have two vectors, you can add them together to get a new vector. This is done by adding the corresponding components of the vectors. For example if {{< katex >}}\vec{a} = [2, 3]{{< /katex >}} and {{< katex >}}\vec{b} = [1, 4]{{< /katex >}} then {{< katex >}}\vec{a} + \vec{b} = [2+1, 3+4] = [3, 7]{{< /katex >}}.

![A plot of vector addition](/images/linear/vector-sum.png)

<details>
  <summary>Click to reveal script</summary>

```python
"""
This script visualizes the addition of two vectors using matplotlib.

It first defines two 2D vectors 'a' and 'b', then calculates their sum 'c'.
The vectors are then plotted on a 2D grid using matplotlib's quiver function.
"""
import matplotlib.pyplot as plt
import numpy as np

# Define the vectors
a = np.array([2, 3])
b = np.array([1, 4])

# Calculate the sum of the vectors
c = a + b

# Create a new figure
plt.figure(dpi=200)

# Plot the vectors a, b, and c
plt.quiver(0, 0, a[0], a[1], angles='xy', scale_units='xy', scale=1, color='r', label='a')
plt.quiver(0, 0, b[0], b[1], angles='xy', scale_units='xy', scale=1, color='b', label='b')
plt.quiver(0, 0, c[0], c[1], angles='xy', scale_units='xy', scale=1, color='g', label='a + b')

# Set the x-limits and y-limits of the plot
plt.xlim(-1, 4)
plt.ylim(-1, 8)

# Add a grid
plt.grid()

# Add a legend
plt.legend(loc="lower right")

# Show the plot
plt.show()
```

</details>

### Scalar Multiplication

You can multiply a vector by a scalar (regular number) to get a new vector. This is done by multiplying each component of the vector by the scalar. For example if {{< katex >}}c = 2{{< /katex >}} and {{< katex >}}\vec{b} = [1,4]{{< /katex >}} then {{< katex >}}c * \vec{b} = [2*3, 2 \*4] = [6, 8]{{< /katex >}}.

![Plot of a scalar multiplication](/images/linear/scalar-multiplication.png)

<details>
  <summary>Click to reveal script</summary>

```python
"""
This script demonstrates the scalar multiplication of a vector.
It defines a vector 'b' and a scalar 'c', calculates the scalar multiplication
of the vector, and then plots the original vector and the result of the scalar
multiplication on a 2D grid. The vectors are represented as arrows originating
from the origin (0,0).
"""
import matplotlib.pyplot as plt
import numpy as np

# Define the vector and scalar
b = np.array([1, 4])
c = 2

# Calculate the scalar multiplication of the vector
d = c * b

# Create a new figure
plt.figure(dpi=200)

# Plot the vectors b and d
plt.quiver(0, 0, b[0], b[1], angles='xy', scale_units='xy', scale=1, color='b', label='b')
plt.quiver(0, 0, d[0], d[1], angles='xy', scale_units='xy', scale=1, color='g', label='c * b')

# Set the x-limits and y-limits of the plot
plt.xlim(-1, 10)
plt.ylim(-1, 10)

# Add a grid
plt.grid()

# Add a legend
plt.legend()

# Show the plot
plt.show()
```

</details>

### Dot Product

The dot product of two vectors is a scalar quantity that is the sum of the products of the corresponding components of the vectors. For example if {{< katex >}}\vec{e} = [2, 3]{{< /katex >}} and {{< katex >}}\vec{f} = [4, 5]{{< /katex >}}, then {{< katex >}}\vec{e} \cdot \vec{f} = 2*4 + 3*5 = 23{{< /katex >}}

![A geometric interpretation of the dot product](/images/linear/dot-product-plot.png)

This is a geometric interpretation of the dot product, and it’s particularly useful when thinking about the dot product as a measure of the similarity between two vectors: if {{< katex >}}\vec{f}{{< /katex >}} is very similar to {{< katex >}}\vec{e}{{< /katex >}} (i.e., it points in the same direction), then its projection onto {{< katex >}}\vec{e}{{< /katex >}} will be long, and so the dot product will be large. Conversely, if {{< katex >}}\vec{f}{{< /katex >}} is dissimilar to {{< katex >}}\vec{e}{{< /katex >}} (i.e., it points in a very different direction), then its projection onto {{< katex >}}\vec{e}{{< /katex >}} will be short, and so the dot product will be small.

The magnitude of the cross product vector equals the area of the parallelogram formed by the two original vectors.

<details>
  <summary>Click to reveal script</summary>

```python
"""
This script calculates and visualizes the dot product and projection of two vectors.

The script first defines two vectors, e and f. It then calculates the dot product of
these vectors and the projection of vector f onto vector e. The vectors, their dot
product, and the projection are then plotted on a 2D grid using matplotlib.
Finally, the script prints the calculated dot product.
"""
import matplotlib.pyplot as plt
import numpy as np

# Define the vectors
e = np.array([2, 3])
f = np.array([4, 5])

# Calculate the dot product of the vectors
g = np.dot(e, f)

# Calculate the projection of f onto e
proj = (np.dot(e, f) / np.linalg.norm(e)**2) * e

# Create a new figure
plt.figure(dpi=200)

# Plot the vectors e and f
plt.quiver(0, 0, e[0], e[1], angles='xy', scale_units='xy', scale=1, color='r', label='e')
plt.quiver(0, 0, f[0], f[1], angles='xy', scale_units='xy', scale=1, color='b', label='f')

# Plot the projection of f onto e
plt.quiver(0, 0, proj[0], proj[1], angles='xy', scale_units='xy', scale=1, color='g', label='Projection of f onto e')

# Set the x-limits and y-limits of the plot
plt.xlim(-1, 5)
plt.ylim(-1, 6)

# Add a grid
plt.grid()

# Add a legend
plt.legend(loc="lower right")

# Show the plot
plt.show()

# Print the dot product
print("The dot product of vectors e and f is: ", g)
```

</details>

### Magnitude (or Length)

The magnitude of a vector {{< katex >}}\vec{g} = [a, b]{{< /katex >}} is given by the square root of the sum of the squares of its components. This is denoted as {{< katex >}}||\vec{g}||{{< /katex >}} and calculated as {{< katex >}}||\vec{g}|| = \sqrt{a^2 + b^2}{{< /katex >}}

<details>
  <summary>Click to reveal script</summary>

```python
import numpy as np

def calculate_magnitude(vector):
    """
    Calculate the magnitude of a vector.

    The magnitude of a vector is the length of the vector in n-dimensional space,
    computed as the square root of the sum of the absolute squares of its components.

    Parameters:
    vector : numpy.ndarray
        A numpy array representing the vector.

    Returns:
    float: The magnitude of the vector.
    """
    magnitude = np.linalg.norm(vector)
    return magnitude

# Example usage:
g = np.array([3, 4])
print("The magnitude of the vector g is:", calculate_magnitude(g))
```

</details>

## Matrices

---

A matrix is a rectangular array of numbers arranged in rows and columns. Matrices are used to represent and manipulate linear transformations, which are functions that map vectors to vectors while preserving vector addition and scalar multiplication. Each number in the matrix is called an element or entry. The position of an element is defined by its row number and column number.

A {{< katex >}}2 \times 2{{< /katex >}} matrix can be represented as follows:

{{< katex display=true >}}A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}{{< /katex >}}

### Matrix Addition and Subtraction

Matrices can be added or subtracted element by element if they are of the same size. For example if we have two {{< katex >}}2 \times 2{{< /katex >}} matrices {{< katex >}}A{{< /katex >}} and {{< katex >}}B{{< /katex >}} then the sum {{< katex >}}A+B{{< /katex >}} is a new {{< katex >}}2 \times 2{{< /katex >}} matrix where each element is the sum of the corresponding elements in {{< katex >}}A{{< /katex >}} and {{< katex >}}B{{< /katex >}}.

It can be represented as:

{{< katex display=true >}}
A + B = \begin{bmatrix} a1 & b1 \\ c1 & d1 \end{bmatrix} + \begin{bmatrix} a2 & b2 \\ c2 & d2 \end{bmatrix} = \begin{bmatrix} a1+a2 & b1+b2 \\ c1+c2 & d1+d2 \end{bmatrix}
{{< /katex >}}

This is how you can create a {{< katex >}}2 \times 2{{< /katex >}} matrix with numpy:

```python
import numpy as np

# Create a 2x2 matrix
A = np.array([[1, 2], [3, 4]])
```

If we have two matrices {{< katex >}}A{{< /katex >}} and {{< katex >}}B{{< /katex >}} of the same size representing linear transformations, their sum {{< katex >}}A + B{{< /katex >}} also represents a linear transformation. The sum transformation {{< katex >}}(A + B){{< /katex >}} applied to any vector {{< katex >}}\vec{v}{{< /katex >}} is equal to {{< katex >}}A(\vec{v}) + B(\vec{v}){{< /katex >}}. This property is known as linear separability.

{{< katex display=true >}}
(A + B)(\vec{v}) = A(\vec{v}) + B(\vec{v})
{{< /katex >}}

### Scalar Multiplication of a Matrix

A matrix can be multiplied by a scalar. This is done by multiplying each element of the matrix by the scalar.

{{< katex display=true >}}kA = k \cdot \begin{bmatrix} a & b \\ c & d \end{bmatrix} = \begin{bmatrix} ka & kb \\ kc & kd \end{bmatrix}{{< /katex >}}

### Matrix Multiplication

The multiplication of two matrices is more complex than their addition. For two matrices to be multiplied, the number of columns in the first matrix must be equal to the number of rows in the second matrix.

{{< katex display=true >}}AB = \begin{bmatrix} a1 & b1 \\ c1 & d1 \end{bmatrix} \cdot \begin{bmatrix} a2 & b2 \\ c2 & d2 \end{bmatrix} = \begin{bmatrix} a1*a2 + b1*c2 & a1*b2 + b1*d2 \\ c1*a2 + d1*c2 & c1*b2 + d1*d2 \end{bmatrix}{{< /katex >}}

Matrix multiplication corresponds to function composition of linear transformations. If {{< katex >}}A{{< /katex >}} and {{< katex >}}B{{< /katex >}} are matrices representing linear transformations, then {{< katex >}}AB{{< /katex >}} represents the transformation that first applies {{< katex >}}B{{< /katex >}} and then applies {{< katex >}}A{{< /katex >}}.

For two matrices to be multiplied, the number of columns in the first matrix must equal the number of rows in the second matrix.

### Identity Matrix

This is a special type of square matrix where all the elements of the principal diagonal (from the upper left to the bottom right) are ones and all other elements are zeros. The identity matrix play a similar role in matrix algebra as the number 1 in regular algebra. Here are some example ones:

{{< katex display=true >}}
I_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}
\quad
I_3 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}
\quad
I_4 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
{{< /katex >}}

The identity matrix plays a similar role in matrix operations as the number 1 does in real number operations. When you multiply any square matrix by the identity matrix of the same order, you get the original matrix back, regardless of the order of multiplication. This is expressed as:

{{< katex display=true >}}
A \cdot I = I \cdot A = A
{{< /katex >}}

- Where {{< katex >}}A{{< /katex >}} is any square matrix,
- {{< katex >}}I{{< /katex >}} is the identity matrix of the same order as {{< katex >}}A{{< /katex >}}.

### Determinant

The determinant is a special number that can be calculated from a square matrix. It has many important properties and uses, such as providing the solution of a system of linear equations.

{{< katex display=true >}}det(A) = det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc{{< /katex >}}

### Inverse

The inverse of a matrix {{< katex >}}A{{< /katex >}} is another matrix, denoted as {{< katex >}}A^{-1}{{< /katex >}}, such that when {{< katex >}}A{{< /katex >}} is multiplied by {{< katex >}}A^{-1}{{< /katex >}}, the result is the identity matrix. Not all matrices have an inverse.

{{< katex display=true >}}A^{-1} = \frac{1}{det(A)} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}{{< /katex >}}

### Transpose

The transpose of a matrix is a new matrix whose rows are the columns of the original matrix and whose columns are the rows.

{{< katex display=true >}}A^T = \begin{bmatrix} a & c \\ b & d \end{bmatrix}{{< /katex >}}

- **Linear equations** are equations of the first order, representing straight lines in geometry. They are characterized by constants and variables without exponents or products of variables.
- **Eigenvalues** and **Eigenvectors** are special sets of scalars and vectors associated with a matrix. They are fundamental in the study of linear transformations.
- **Orthogonal Matrices** are square matrices whose columns and rows are orthogonal unit vectors (orthonormal vectors)
