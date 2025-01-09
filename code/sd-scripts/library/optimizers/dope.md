# DOPE Core Update Rules

DOPE (Dynamic Optimized Parameter Estimation) combines the strengths of ExMachina's Fisher-accelerated MARS with SAVEUS's advanced gradient processing techniques.

## 1. Gradient Pre-Processing
Applies a series of transformations to improve gradient quality:

$$
\tilde{g}_t = \text{Normalize}(\text{Centralize}(g_t)) \\[1em]
$$

Where:
- Centralization removes mean across layers
- Normalization standardizes gradient magnitudes

## 2. Fisher Information Matrix (FIM)
Tracks second-order information using two FIM estimates:

$$
\begin{align*}
F_t &= \beta_2 F_{t-1} + (1-\beta_2)\tilde{g}_t^2 \\
F^d_t &= \beta_1 F^d_{t-1} + (1-\beta_1)(g_t - g_{t-1})^2
\end{align*}
$$

## 3. Natural Gradient Computation
Computes natural gradient using both FIM estimates:

$$
\hat{g}_t = \frac{\tilde{g}_t}{\sqrt{F_t + \epsilon}} \cdot \frac{1}{\sqrt{F^d_t + \epsilon}} \\[1em]
$$

## 4. Momentum with Adaptive Amplification
Combines MARS correction with step-dependent momentum amplification:

$$
\begin{align*}
m_t &= \beta_m m_{t-1} + (1-\beta_m)\hat{g}_t \\
m'_t &= m_t - \text{mean}(m_t) \quad \text{(centered momentum)} \\
\alpha_t &= t^\lambda \quad \text{(step-dependent scaling)} \\
c_t &= \hat{g}_t + \gamma \cdot \frac{\beta_1}{1-\beta_1} \cdot g_{t-1} \quad \text{(MARS correction)} \\
g'_t &= c_t + \alpha_t \cdot m'_t \quad \text{(amplified gradient)}
\end{align*}
$$

Where:
- $\beta_m$ is the momentum decay rate (typically 0.9999)
- $\lambda$ is the momentum amplification exponent (typically 0.25)
- $\gamma$ is the MARS correction factor
- $t$ is the current step number

The step-dependent amplification $\alpha_t = t^\lambda$ gradually increases the influence of the momentum term as training progresses. This allows:
- Early steps to focus more on immediate gradients
- Later steps to benefit from accumulated momentum
- Smooth transition between the two regimes

## 5. Cautious Update with Weight Decay
Final parameter update with adaptive masking and decoupled weight decay:

$$
\begin{align*}
M_t &= \mathbb{1}(g'_t \cdot c_t > 0) \cdot \frac{N}{\sum \mathbb{1}(g'_t \cdot c_t > 0)} \\
w_t &= \frac{\theta_{t-1}}{\sqrt{F_t + \epsilon}\sqrt{F^d_t + \epsilon}} \\
\theta_t &= \theta_{t-1} - \eta \cdot M_t \cdot g'_t - \eta \cdot w \cdot w_t
\end{align*}
$$

Where:
- $M_t$ is the cautious mask that:
  - Only allows updates where the amplified gradient ($g'_t$) agrees with the corrected gradient ($c_t$)
  - Rescales the effective learning rate to maintain update magnitude
  - $N$ is the total number of parameters
- $w_t$ is the preconditioned weight decay term that:
  - Uses the same FIM preconditioning as gradients
  - Helps maintain consistent regularization strength
- $w$ is the weight decay coefficient

The cautious update mechanism helps:
- Prevent momentum from causing harmful updates
- Maintain effective learning rate despite masked updates
- Improve training stability

The decoupled weight decay:
- Applies L2 regularization directly to weights
- Uses the same preconditioning as gradients
- Provides more consistent regularization than traditional weight decay

## Parameters

$$
\text{where:}
\begin{align*}
& \beta_1, \beta_2: \text{ FIM decay rates} \\
& \beta_m: \text{ momentum decay rate} \\
& \gamma: \text{ MARS correction factor} \\
& \epsilon: \text{ numerical stability term} \\
& \eta: \text{ learning rate} \\
& w: \text{ weight decay coefficient}
\end{align*}
$$

## Key Features
- Adaptive epsilon scaling based on gradient magnitude
- Stochastic rounding for mixed precision
- Gradient difference tracking for better natural gradients
- Combined momentum amplification strategies
- Cautious update masking option
