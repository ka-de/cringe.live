---
weight: 1
bookFlatSection: false
bookCollapseSection: true
title: "Linear Algebra for Furries"
---

<!--markdownlint-disable MD033 MD025 -->

# Linear Algebra for Furries

## Linear Algebra Basics

Linear Algebra is a branch of mathematics that deals with vectors, vector spaces and linear transformations. It has wide applications in fields like physics, computer graphics, data analysis and generating yiff.

### Vectors

---

Vectors are mathematical objects that have both magnitude (size) and direction. They can represent physical quantities like force, velocity or displacement. For example, if you're a furry running in a park, your velocity is a vector - it has a speed (magnitude) and a direction you're running in.

![A furry running in a park](/images/furry-running.jpg)

*This furry has a velocity.*

Even this [DVD logo](/dvd.html) has a vector, not just furries, just press the `v` key and an arrow will display the vector of the logo. Vectors are everywhere, even in your pants! Points are usually denoted with capital letters, like {{< katex >}}A{{< /katex >}}. {{< katex >}}\overrightarrow{AB}{{< /katex >}}

{{< katex display=true >}}
\vec{v} = \overrightarrow{AB} = \overrightarrow{CD}
{{< /katex >}}

Vectors are often represented as an array of numbers, where each number corresponds to a coordinate in space. In a 2D plane, a vector {{< katex >}}v{{< /katex >}} can be represented as an ordered pair: {{< katex >}}v = [v_1, v_2]{{< /katex >}}. Here {{< katex >}}v_1{{< /katex >}} and {{< katex >}}v_2{{< /katex >}} are the components of {{< katex >}}v{{< /katex >}} along the x and y axes respectively.

For example, the vector {{< katex >}}v = [2, 3]{{< /katex >}} can be visualized as an arrow starting at the origin {{< katex >}}(0, 0){{< /katex >}} and pointing 2 units in the positive x-direction and 3 units in the positive y-direction.

#### Vector Addition

If you have two vectors, you can add them together to get a new vector. This is done by adding the corresponding components of the vectors. For example if {{< katex >}}a = [2, 3]{{< /katex >}} and {{< katex >}}b = [1, 4]{{< /katex >}} then {{< katex >}}a + b = [2+1, 3+4] = [3, 7]{{< /katex >}}.

#### Scalar Multiplication

You can multiply a vector by a scalar (regular number) to get a new vector. This is done by multiplying each component of the vector by the scalar. For example if {{< katex >}}c = 2{{< /katex >}} and {{< katex >}}b = [1,4 ]{{< /katex >}} then {{< katex >}}c * b = [2*3, 2 *4]  = [6, 8]{{< /katex >}}.

#### Dot Product

The dot product of two vectors is a scalar quantity that is the sum of the products of the corresponding components of the vectors. For example if {{< katex >}}e = [2, 3]{{< /katex >}} and {{< katex >}}f = [4, 5]{{< /katex >}}, then {{< katex >}}e \cdot f = 2*4 + 3*5 = 23{{< /katex >}}

#### Magnitude (or Length)

The magnitude of a vector {{< katex >}}g = [a, b]{{< /katex >}} is given by the square root of the sum of the squares of its components. This is denoted as {{< katex >}}||g||{{< /katex >}} and calculated as {{< katex >}}||g|| = \sqrt{a^2 + b^2}{{< /katex >}}

### Matrices

---

A matrix is a rectangular array of numbers arranged in rows and columns. Matrices are used to represent and manipulate linear transformations, which are functions that map vectors to vectors while preserving vector addition and scalar multiplication. Each number in the matrix is called an element or entry. The position of an element is defined by its row number and column number.

A `2x2` matrix can be represented as follows:

{{< katex display=true >}}A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}{{< /katex >}}

#### Matrix Addition and Subtraction

Matrices can be added or subtracted element by element if they are of the same size. For example if we have two `2x2` matrices {{< katex >}}A{{< /katex >}} and {{< katex >}}B{{< /katex >}} then the sum {{< katex >}}A+B{{< /katex >}} is a new `2x2` matrix where each element is the sum of the corresponding elements in {{< katex >}}A{{< /katex >}} and {{< katex >}}B{{< /katex >}}.

It can be represented as:

{{< katex display=true >}}
A + B = \begin{bmatrix} a1 & b1 \\ c1 & d1 \end{bmatrix} + \begin{bmatrix} a2 & b2 \\ c2 & d2 \end{bmatrix} = \begin{bmatrix} a1+a2 & b1+b2 \\ c1+c2 & d1+d2 \end{bmatrix}
{{< /katex >}}

If we have two matrices {{< katex >}}A{{< /katex >}} and {{< katex >}}B{{< /katex >}} of the same size representing linear transformations, their sum {{< katex >}}A + B{{< /katex >}} also represents a linear transformation. The sum transformation {{< katex >}}(A + B){{< /katex >}} applied to any vector {{< katex >}}v{{< /katex >}} is equal to {{< katex >}}A(v) + B(v){{< /katex >}}. This property is known as linear separability.

{{< katex display=true >}}
(A + B)(v) = A(v) + B(v)
{{< /katex >}}

#### Scalar Multiplication of a Matrix

A matrix can be multiplied by a scalar. This is done by multiplying each element of the matrix by the scalar.

{{< katex display=true >}}kA = k \cdot \begin{bmatrix} a & b \\ c & d \end{bmatrix} = \begin{bmatrix} ka & kb \\ kc & kd \end{bmatrix}{{< /katex >}}

#### Matrix Multiplication

The multiplication of two matrices is more complex than their addition. For two matrices to be multiplied, the number of columns in the first matrix must be equal to the number of rows in the second matrix.

{{< katex display=true >}}AB = \begin{bmatrix} a1 & b1 \\ c1 & d1 \end{bmatrix} \cdot \begin{bmatrix} a2 & b2 \\ c2 & d2 \end{bmatrix} = \begin{bmatrix} a1*a2 + b1*c2 & a1*b2 + b1*d2 \\ c1*a2 + d1*c2 & c1*b2 + d1*d2 \end{bmatrix}{{< /katex >}}

Matrix multiplication corresponds to function composition of linear transformations. If {{< katex >}}A{{< /katex >}} and {{< katex >}}B{{< /katex >}} are matrices representing linear transformations, then {{< katex >}}AB{{< /katex >}} represents the transformation that first applies {{< katex >}}B{{< /katex >}} and then applies {{< katex >}}A{{< /katex >}}.

For two matrices to be multiplied, the number of columns in the first matrix must equal the number of rows in the second matrix.

#### Identity Matrix

This is a special type of square matrix where all the elements of the principal diagonal are ones and all other elements are zeros. The identity matrix play a similar role in matrix algebra as the number 1 in regular algebra.

{{< katex display=true >}}I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}{{< /katex >}}

#### Determinant

The determinant is a special number that can be calculated from a square matrix. It has many important properties and uses, such as providing the solution of a system of linear equations.

{{< katex display=true >}}det(A) = det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc{{< /katex >}}

#### Inverse

The inverse of a matrix {{< katex >}}A{{< /katex >}} is another matrix, denoted as {{< katex >}}A^{-1}{{< /katex >}}, such that when {{< katex >}}A{{< /katex >}} is multiplied by {{< katex >}}A^{-1}{{< /katex >}}, the result is the identity matrix. Not all matrices have an inverse.

{{< katex display=true >}}A^{-1} = \frac{1}{det(A)} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}{{< /katex >}}

#### Transpose

The transpose of a matrix is a new matrix whose rows are the columns of the original matrix and whose columns are the rows.

{{< katex display=true >}}A^T = \begin{bmatrix} a & c \\ b & d \end{bmatrix}{{< /katex >}}

- **Linear equations** are equations of the first order, representing straight lines in geometry. They are characterized by constants and variables without exponents or products of variables.
- **Eigenvalues** and **Eigenvectors** are special sets of scalars and vectors associated with a matrix. They are fundamental in the study of linear transformations.
- **Orthogonal Matrices** are square matrices whose columns and rows are orthogonal unit vectors (orthonormal vectors)

---

## The Cross Product

The cross product, also known as the vector product, is a binary operation on two vectors in three-dimensional space. It's denoted by the symbol {{< katex >}}\times{{< /katex >}} and results in a vector that is perpendicular (or orthogonal) to the plane containing the two original vectors.

If you have two vectors {{< katex >}}a = [a1, a2, a3]{{< /katex >}} and {{< katex >}}b = [b1, b2, b3]{{< /katex >}}, their cross product, denoted as {{< katex >}}a \times b{{< /katex >}} is defined as:

{{< katex display=true >}}\mathbf{a} \times \mathbf{b} = \begin{bmatrix} a2b3 - a3b2 \\ a3b1 - a1b3 \\ a1b2 - a2b1 \end{bmatrix}{{< /katex >}}

The cross product is only defined in three dimensions. In higher dimensions, one typically uses the more general concept of the exterior product. The cross product is used in various fields such as physics (torque, angular momentum), computer graphics (finding normals to surfaces), and engineering (moment of forces).

### Geometric Interpretation

Geometrically, the magnitude (or length) of the cross product vector equals the area of the parallelogram formed by the two original vectors. The direction of the cross product vector is given by the right-hand rule: if you point your open right hand in the direction of {{< katex >}}a{{< /katex >}} and then curl your fingers towards {{< katex >}}b{{< /katex >}}, your thumb points in the direction of {{< katex >}}a \times b{{< /katex >}}.

### Properties

The cross product has several important properties, including:

#### Anticommutativity

The property of anticommutativity means that the order in which the vectors are crossed matters. If you have two vectors {{< katex >}}a{{< /katex >}} and {{< katex >}}b{{< /katex >}}, the cross product {{< katex >}}a \times b{{< /katex >}} is the negative of {{< katex >}}b \times a{{< /katex >}}. In other words:

{{< katex display=true >}}\mathbf{a} \times \mathbf{b} = -(\mathbf{b} \times \mathbf{a}){{< /katex >}}

This is different from the dot product, which is commutative. (i.e., {{< katex >}}a \cdot b = b \cdot a{{< /katex >}})

#### Distributivity over addition

The distributive property of the cross product states that the cross product distributes over vector addition. That is, if you have three vectors {{< katex >}}a{{< /katex >}}, {{< katex >}}b{{< /katex >}} and {{< katex >}}c{{< /katex >}}, then the cross product of {{< katex >}}a{{< /katex >}} with the sum of {{< katex >}}b{{< /katex >}} and {{< katex >}}c{{< /katex >}} is equal to the sum of the cross product of {{< katex >}}a{{< /katex >}} and {{< katex >}}b{{< /katex >}} and the cross product of {{< katex >}}a{{< /katex >}} and {{< katex >}}c{{< /katex >}}. Mathematically this is expressed as:

{{< katex display=true >}}\mathbf{a} \times (\mathbf{b} + \mathbf{c}) = \mathbf{a} \times \mathbf{b} + \mathbf{a} \times \mathbf{c}{{< /katex >}}

#### Scalar multiplication

The property of scalar multiplication states that the cross product is compatible with scalar multiplication. If you multiply a vector {{< katex >}}a{{< /katex >}} by a scalar {{< katex >}}k{{< /katex >}} and then take the cross product of this with a vector {{< katex >}}b{{< /katex >}}, it's the same as if you took the cross product of {{< katex >}}a{{< /katex >}} and {{< katex >}}b{{< /katex >}} first and then multiplied the result by {{< katex >}}k{{< /katex >}}. Similarly, it's also the same as if you multiplied {{< katex >}}b{{< /katex >}} by {{< katex >}}k{{< /katex >}} before taking the cross product. This can be written as:

{{< katex display=true >}}(k\mathbf{a}) \times \mathbf{b} = k(\mathbf{a} \times \mathbf{b}) = \mathbf{a} \times (k\mathbf{b}){{< /katex >}}

Where {{< katex >}}k{{< /katex >}} is a scalar.

### Relation to Other Vector Operations

While the cross product is a useful operation, it's important to understand when it's appropriate to use it and when other vector operations, such as the dot product or scalar triple product, might be more suitable. The dot product, for instance, is useful for determining the angle between two vectors or projecting one vector onto another, while the scalar triple product is used to find the scalar triple product of three vectors.

### Examples

Let's calculate the cross product of two simple vectors, {{< katex >}}\mathbf{a} = [1, 0, 0]{{< /katex >}} and {{< katex >}}\mathbf{b} = [0, 1, 0]{{< /katex >}}:

{{< katex display=true >}}
\mathbf{a} \times \mathbf{b} = \begin{bmatrix}
0 \times 0 - 0 \times 1 \\
0 \times 0 - 0 \times 0 \\
1 \times 1 - 0 \times 0
\end{bmatrix} = \begin{bmatrix}
0 \\
0 \\
1
\end{bmatrix}
{{< /katex >}}

So, the cross product of {{< katex >}}[1, 0, 0]{{< /katex >}} and {{< katex >}}[0, 1, 0]{{< /katex >}} is {{< katex >}}[0, 0, 1]{{< /katex >}}, which is a vector pointing in the positive z-direction with a magnitude of 1.

### Practice Problems

1. Calculate the cross product of {{< katex >}}\mathbf{a} = [2, 1, -3]{{< /katex >}} and {{< katex >}}\mathbf{b} = [4, -2, 1]{{< /katex >}}.

2. Find the cross product of {{< katex >}}\mathbf{u} = [1, 2, 3]{{< /katex >}} and {{< katex >}}\mathbf{v} = [4, 5, 6]{{< /katex >}}.

3. If the position vector of a force {{< katex >}}\mathbf{F} = [10, 20, 0]{{< /katex >}} is {{< katex >}}\mathbf{r} = [2, 1, 3]{{< /katex >}}, calculate the torque about the origin using the cross product.

---

## Kolmogorov-Arnold Networks

---

Kolmogorov-Arnold Networks (KANs) are a type of neural network inspired by the Kolmogorov-Arnold representation theorem. They are proposed as promising alternatives to Multi-Layer Perceptrons (MLPs)
