# Linear Algebra for Furries

<!--markdownlint-disable MD033 -->

## Linear Algebra Basics

Linear Algebra is a branch of mathematics that deals with vectors, vector spaces and linear transformations. It has wide applications in fields like physics, computer graphics, data analysis and generating yiff.

### Vectors

---

Vectors are mathematical objects that have both magnitude (size) and direction. They can represent physical quantities like force, velocity or displacement. For example, if you're a furry running in a park, your velocity is a vector - it has a speed (magnitude) and a direction you're running in.

<img src="/furry-running.jpg?raw=true" alt="A furry running in a park."/>

*This furry has a velocity.*

Vectors are often represented as an array of numbers, where each number corresponds to a coordinate in space. In a 2D plane, a vector {{< katex >}}v{{< /katex >}} can be represented as an ordered pair: {{< katex >}}v = [v_1, v_2]{{< /katex >}}. Here {{< katex >}}v_1{{< /katex >}} and {{< katex >}}v_2{{< /katex >}} are the components of {{< katex >}}v{{< /katex >}} along the x and y axes respectively.

For example, the vector {{< katex >}}v = [2, 3]{{< /katex >}} can be visualized as an arrow starting at the origin {{< katex >}}(0, 0){{< /katex >}} and pointing 2 units in the positive x-direction and 3 units in the positive y-direction.

#### Vector Addition

If you have two vectors, you can add them together to get a new vector. This is done by adding the corresponding components of the vectors. For example if {{< katex >}}a = [2, 3]{{< /katex >}} and {{< katex >}}b = [1, 4]{{< /katex >}} then {{< katex >}}a + b = [2+1, 3+4] = [3, 7]{{< /katex >}}.

#### Scalar Multiplication

You can multiply a vector by a scalar (regular number) to get a new vector. This is done by multiplying each component of the vector by the scalar. For example if {{< katex >}}c = 2{{< /katex >}} and {{< katex >}}b = [1,4 ]{{< /katex >}} then {{< katex >}}c * d = [2*3, 2 *4]  = [6, 8]{{< /katex >}}.

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

{{< katex display=true >}}A + B = \begin{bmatrix} a1 & b1 \\ c1 & d1 \end{bmatrix} + \begin{bmatrix} a2 & b2 \\ c2 & d2 \end{bmatrix} = \begin{bmatrix} a1+a2 & b1+b2 \\ c1+c2 & d1+d2 \end{bmatrix}{{< /katex >}}

If we have two matrices A and B of the same size representing linear transformations, their sum A + B also represents a linear transformation. The sum transformation (A + B) applied to any vector v is equal to A(v) + B(v). This property is known as linear separability.

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

## Kolmogorov-Arnold Representation Theorem

The Kolmogorov-Arnold Representation Theorem, also known as the superposition theorem, is a significant result in real analysis and approximation theory.

It was first proved by Andrey Kolmogorov in 1956 and later extended by his student Vladimir Arnold in 1957.

The theorem states that every multivariate continuous function can be represented as a superposition of continuous functions of one variable. More specifically, if {{< katex >}}f{{< /katex >}} is a multivariate continuous function, then {{< katex >}}f{{< /katex >}} can be written as a finite composition of continuous functions of a single variable and the binary operation of addition.

The mathematical representation is as follows:

{{< katex display=true >}}f(x_1, \ldots, x_m) = \sum_{i=1}^{2m+1} \Phi_i \left( \sum_{j=1}^{m} \phi_{i,j}(x_j) \right){{< /katex >}}

Where {{< katex >}}\Phi_i{{< /katex >}} and {{< katex >}}\phi_{i,j}{{< /katex >}} are continuous monotonically increasing functions on the interval {{< katex >}}[0,1]{{< /katex >}}

This theorem solved a more constrained form of Hilbert’s thirteenth problem, so the original Hilbert’s thirteenth problem is a corollary. In a sense, they showed that the only true multivariate function is the sum, since every other function can be written using univariate functions and summing.

There is a longstanding debate whether the Kolmogorov-Arnold representation theorem can explain the use of more than one hidden layer in neural networks. The Kolmogorov-Arnold representation decomposes a multivariate function into an interior and an outer function and therefore has indeed a similar structure as a neural network with two hidden layers.

## Kolmogorov-Arnold Networks

---

Kolmogorov-Arnold Networks (KANs) are a type of neural network inspired by the Kolmogorov-Arnold representation theorem. They are proposed as promising alternatives to Multi-Layer Perceptrons (MLPs)