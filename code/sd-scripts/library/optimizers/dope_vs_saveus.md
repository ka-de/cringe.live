# DOPE vs SAVEUS

---

## Overview of SAVEUS and DOPE

---

In the realm of deep learning, optimization algorithms play a crucial role in training models efficiently and effectively. This document provides a detailed comparison between two advanced optimizers: **SAVEUS** and **DOPE**. Both optimizers are built upon foundational concepts from popular algorithms like Adam but introduce unique mechanisms to enhance performance. Below, we delve into their architectures, functionalities, and mathematical underpinnings.

SAVEUS (Stochastic Adaptive Variance Estimation with Unified Scaling) focuses on incorporating gradient centralization, adaptive gradient normalization, momentum with amplification, and adaptive step sizes. It also offers optional features like gradient clipping and decoupled weight decay.

DOPE (Dynamic Optimized Parameter Estimation) combines elements from ExMachina's Fisher-accelerated MARS and SAVEUS's gradient processing techniques. It introduces mechanisms for Fisher Information Matrix (FIM) estimation, gradient difference scaling, MARS correction, and cautious updates.

## Key Differences

---

- Learning Rate (`lr`): SAVEUS uses a default `lr` of `1e-3`, whereas DOPE employs a slightly lower default of `1.5e-4`.
- Betas: Both optimizers use tuple parameters for `betas`, but DOPE uses (0.999, 0.9999) by default compared to SAVEUS's `(0.9, 0.999)`.
- Additional Parameters in DOPE: DOPE introduces several additional hyperparameters like `momentum_beta`, `eps2`, `eps_floor`, `diff_mult`, `momentum_lambda`, `gamma`, `clip`, and `cautious`, which are not present in SAVEUS.

## Gradient Processing

---

Both optimizers incorporate mechanisms to process gradients before updating the model parameters, enhancing stability and convergence.

### Gradient Centralization

Gradient centralization aims to normalize gradients by removing their mean, which can lead to improved optimization stability.

- SAVEUS:

```py
  def step(self, closure: Optional[Callable] = None):
      # ...
      if centralization != 0:
          grad.sub_(
              grad.mean(dim=tuple(range(1, grad.dim())), keepdim=True).mul_(centralization)
          )
      # ...
```

- DOPE:

```py
  def step(self, closure: Optional[Callable] = None):
      # ...
      if group['centralization'] > 0:
          grad.sub_(
              grad.mean(dim=tuple(range(1, grad.dim())), keepdim=True)
              .mul_(group['centralization'])
          )
      # ...
```

Both implementations subtract the mean of the gradients scaled by the centralization parameter. This process centers the gradients, potentially leading to faster convergence.

### Gradient Normalization

Normalizing gradients ensures that they have a consistent scale, which can prevent issues like exploding or vanishing gradients.

- SAVEUS

```py
  def normalize_gradient(
      self,
      x: torch.Tensor,
      use_channels: bool = False,
      alpha: float = 1.0,
      epsilon: float = 1e-8,
  ) -> None:
      size: int = x.dim()
      if size > 1 and use_channels:
          s = x.std(dim=tuple(range(1, size)), keepdim=True).add_(epsilon)
          x.lerp_(x.div_(s), weight=alpha)
      elif torch.numel(x) > 2:
          s = x.std().add_(epsilon)
          x.lerp_(x.div_(s), weight=alpha)
```

- DOPE:

```py
  def normalize_gradient(
      self,
      x: torch.Tensor,
      use_channels: bool = True,
      alpha: float = 1.0,
      epsilon: float = 1e-8,
  ) -> None:
      size = x.dim()
      if size > 1 and use_channels:
          s = x.std(dim=tuple(range(1, size)), keepdim=True).add_(epsilon)
          x.lerp_(x.div_(s), weight=alpha)
      elif torch.numel(x) > 2:
          s = x.std().add_(epsilon)
          x.lerp_(x.div_(s), weight=alpha)
```

### Key Similarities

- Both optimizers calculate the standard deviation of the gradients.
- They use the `lerp_` function to interpolate between the original and normalized gradients based on the alpha parameter.
- `use_channels` determines whether normalization is applied per channel or globally.

## Momentum Handling

---

Momentum helps accelerate gradients vectors in the right directions, leading to faster converging.

### SAVEUS Momentum with Amplification

SAVEUS incorporates an Exponential Moving Average (EMA) of gradients and amplifies the current gradient using this history.

$$
\begin{aligned}
m_t &= \beta_1 m_{t-1} + (1 - \beta_1) g_t \\
g_t &= g_t + \text{amp\_fac} \cdot m_t \\
v_t &= \beta_2 v_{t-1} + (1 - \beta_2) g_t^2 \\
\hat{m}_t &= \frac{m_t}{1 - \beta_1^t} \\
\hat{v}_t &= \frac{v_t}{1 - \beta_2^t} \\
\eta_t &= \frac{\text{lr}}{\sqrt{\hat{v}_t} + \epsilon} \\
\theta_t &= \theta_{t-1} - \eta_t \cdot \frac{g_t}{\sqrt{\hat{v}_t}}
\end{aligned}
$$

Implmentation:

```py
def step(self, closure: Optional[Callable] = None):
    # ...
    # Update EMA of gradient
    ema.mul_(beta1).add_(grad, alpha=1 - beta1)
    # Amplify gradient with EMA
    grad.add_(ema, alpha=amp_fac)
    # Update EMA of squared gradient
    ema_squared.mul_(beta2).addcmul_(grad, grad, value=1 - beta2)
    # ...
```
