# SAVEUS Core Update Rules

SAVEUS is an advanced optimization algorithm that combines several optimization techniques for improved training stability and performance. Below is a detailed breakdown of each component.

## 1. Gradient Centralization
Removes the mean of gradients for each layer to reduce internal covariate shift and improve training stability.

$$
\tilde{g}_t = g_t - \alpha_c \cdot \text{mean}(g_t) \\[1em]
$$

**Benefits**:
- Reduces internal covariate shift
- Improves training stability
- Helps with generalization

## 2. Gradient Normalization
Standardizes gradient magnitudes with interpolation between normalized and original values.

$$
\hat{g}_t = \alpha_n \cdot \frac{g_t}{\text{std}(g_t) + \epsilon} + (1-\alpha_n) \cdot g_t \\[1em]
$$

**Options**:
- Channel-wise or global normalization
- Controlled by normalization factor αₙ
- Epsilon term for numerical stability

## 3. Momentum with Amplification
Accelerates training in relevant directions using a two-step process:

First, compute momentum:
$$
m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t \\[1em]
$$

Then, amplify the gradient:
$$
g'_t = g_t + \gamma \cdot m_t \\[1em]
$$

**Key Features**:
- Maintains exponential moving average of gradients
- Amplifies current gradient using momentum history
- Controlled by amp_fac (γ) parameter

## 4. Adaptive Moments
Adapts learning rates per parameter using moment estimation:

$$
v_t = \beta_2 v_{t-1} + (1-\beta_2)g_t^2 \\[1em]
$$

With bias correction:
$$
\hat{m}_t = \frac{m_t}{1-\beta_1^t} \\[1em]
$$

$$
\hat{v}_t = \frac{v_t}{1-\beta_2^t} \\[1em]
$$

**Components**:
- Second moment estimation tracks squared gradients
- Bias correction improves early training steps
- Decay rates controlled by β₁ and β₂

## 5. Parameter Update
Final weight update combining all components:

$$
\theta_t = \theta_{t-1} - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \cdot g'_t
$$

## Optional Features

### Gradient Clipping
- Clips gradients based on step-dependent threshold
- Prevents explosive gradients
- Threshold computed using customizable lambda function

### Decoupled Weight Decay
- Applies L2 regularization directly to weights
- More stable than traditional weight decay
- Controlled by weight_decay parameter

## Parameters

$$
\text{where:}
\begin{align*}
& g_t: \text{ raw gradient} \\
& \alpha_c: \text{ centralization strength} \\
& \alpha_n: \text{ normalization interpolation factor} \\
& \gamma: \text{ momentum amplification factor} \\
& \beta_1, \beta_2: \text{ decay rates for moment estimates} \\
& \eta: \text{ learning rate} \\
& \epsilon: \text{ small constant for numerical stability}
\end{align*}
$$

