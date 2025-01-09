import torch
from torch.optim import Optimizer
from typing import Callable, Optional, Tuple

class SAVEUS(Optimizer):
    r"""
    Implements the SAVEUS optimization algorithm, incorporating techniques from ADOPT.
    
    The optimizer combines several advanced optimization techniques:
    1. Gradient Centralization: Removes the mean of gradients for each layer:
       g_t = g_t - mean(g_t)
    
    2. Adaptive Gradient Normalization: Normalizes gradients using their standard deviation:
       g_t = (1 - α) * g_t + α * (g_t / std(g_t))
       where α is the normalization parameter
    
    3. Momentum with Amplification: 
       - First moment: m_t = β₁ * m_{t-1} + (1 - β₁) * g_t
       - Amplified gradient: g_t = g_t + amp_fac * m_t
       where β₁ is the first moment decay rate
    
    4. Adaptive Step Sizes:
       - Second moment: v_t = β₂ * v_{t-1} + (1 - β₂) * g_t²
       - Bias correction: m̂_t = m_t / (1 - β₁ᵗ)
                         v̂_t = v_t / (1 - β₂ᵗ)
       - Step size: η_t = lr / (1 - β₁ᵗ)
       where β₂ is the second moment decay rate
    
    Complete Update Rule:
    1. If decouple_weight_decay:
       θ_t = θ_{t-1} * (1 - η_t * λ) - η_t * g_t / √(v̂_t + ε)
    2. Otherwise:
       θ_t = θ_{t-1} - η_t * (g_t + λ * θ_{t-1}) / √(v̂_t + ε)

    Where:
    - θ_t: Parameters at step t
    - η_t: Learning rate with bias correction
    - g_t: Gradient (after centralization, normalization, and amplification)
    - v̂_t: Bias-corrected second moment estimate
    - λ: Weight decay coefficient
    - ε: Small constant for numerical stability
    
    Arguments:
        params (iterable):
            Iterable of parameters to optimize or dicts defining parameter groups.
        lr (float, optional):
            Learning rate (default: 1e-3).
        betas (Tuple[float, float], optional):
            Coefficients for computing running averages of gradient (β₁) and its square (β₂) (default: (0.9, 0.999)).
        eps (float, optional):
            Term added to the denominator to improve numerical stability (default: 1e-8).
        weight_decay (float, optional):
            Weight decay (L2 penalty) (default: 0).
        centralization (float, optional):
            Strength of gradient centralization (default: 0.5).
        normalization (float, optional):
            Interpolation factor for normalized gradients (default: 0.5).
        normalize_channels (bool, optional):
            Whether to normalize gradients channel-wise (default: True).
        amp_fac (float, optional):
            Amplification factor for the momentum term (default: 2.0).
        clip_lambda (Optional[Callable[[int], float]], optional):
            Function computing gradient clipping threshold from step number (default: step**0.25).
        decouple_weight_decay (bool, optional):
            Whether to apply weight decay directly to weights (default: False).
        clip_gradients (bool, optional):
            Whether to enable gradient clipping (default: False).
    """

    def __init__(
        self,
        params,
        lr: float = 1e-3,
        betas: Tuple[float, float] = (0.9, 0.999),
        eps: float = 1e-8,
        weight_decay: float = 0.0,
        centralization: float = 0.5,
        normalization: float = 0.5,
        normalize_channels: bool = True,
        amp_fac: float = 2.0,
        clip_lambda: Optional[Callable[[int], float]] = lambda step: step**0.25,
        decouple_weight_decay: bool = False,
        clip_gradients: bool = False,
    ):
        defaults = dict(
            lr=lr,
            betas=betas,
            eps=eps,
            weight_decay=weight_decay,
            centralization=centralization,
            normalization=normalization,
            normalize_channels=normalize_channels,
            amp_fac=amp_fac,
            clip_lambda=clip_lambda,
            decouple_weight_decay=decouple_weight_decay,
            clip_gradients=clip_gradients,
        )
        super(SAVEUS, self).__init__(params, defaults)

    def normalize_gradient(
        self,
        x: torch.Tensor,
        use_channels: bool = False,
        alpha: float = 1.0,
        epsilon: float = 1e-8,
    ) -> None:
        r"""Normalize gradient with standard deviation.
        :param x: torch.Tensor. Gradient.
        :param use_channels: bool. Channel-wise normalization.
        :param alpha: float. Interpolation weight between original and normalized gradient.
        :param epsilon: float. Small value to prevent division by zero.
        """
        size: int = x.dim()
        if size > 1 and use_channels:
            s = x.std(dim=tuple(range(1, size)), keepdim=True).add_(epsilon)
            x.lerp_(x.div_(s), weight=alpha)
        elif torch.numel(x) > 2:
            s = x.std().add_(epsilon)
            x.lerp_(x.div_(s), weight=alpha)

    def step(self, closure: Optional[Callable] = None):
        """Perform a single optimization step.
        
        Args:
            closure (Callable, optional):
                A closure that reevaluates the model and returns the loss.
        """
        loss = None
        if closure is not None:
            loss = closure()

        for group in self.param_groups:
            lr = group["lr"]
            betas = group["betas"]
            eps = group["eps"]
            weight_decay = group["weight_decay"]
            centralization = group["centralization"]
            normalization = group["normalization"]
            normalize_channels = group["normalize_channels"]
            amp_fac = group["amp_fac"]
            clip_lambda = group["clip_lambda"]
            decouple_weight_decay = group["decouple_weight_decay"]
            clip_gradients = group["clip_gradients"]

            for p in group["params"]:
                if p.grad is None:
                    continue
                grad = p.grad.data
                if grad.is_sparse:
                    raise RuntimeError("SAVEUS does not support sparse gradients")

                state = self.state[p]

                # State initialization
                if len(state) == 0:
                    state["step"] = 0
                    state["ema"] = torch.zeros_like(p.data)
                    state["ema_squared"] = torch.zeros_like(p.data)

                ema, ema_squared = state["ema"], state["ema_squared"]
                beta1, beta2 = betas
                state["step"] += 1

                # Center the gradient
                if centralization != 0:
                    grad.sub_(
                        grad.mean(dim=tuple(range(1, grad.dim())), keepdim=True).mul_(centralization)
                    )

                # Normalize the gradient
                if normalization != 0:
                    self.normalize_gradient(
                        grad, use_channels=normalize_channels, alpha=normalization
                    )

                # Bias correction
                bias_correction = 1 - beta1 ** state["step"]
                bias_correction_sqrt = (1 - beta2 ** state["step"]) ** 0.5
                step_size = lr / bias_correction

                # Update EMA of gradient
                ema.mul_(beta1).add_(grad, alpha=1 - beta1)
                # Amplify gradient with EMA
                grad.add_(ema, alpha=amp_fac)
                # Update EMA of squared gradient
                ema_squared.mul_(beta2).addcmul_(grad, grad, value=1 - beta2)

                # Compute denominator
                denom = ema_squared.sqrt().div_(bias_correction_sqrt).add_(eps)

                if decouple_weight_decay and weight_decay != 0:
                    p.data.mul_(1 - step_size * weight_decay)
                elif weight_decay != 0:
                    grad.add_(p.data, alpha=weight_decay)

                # Apply gradient clipping if enabled
                if clip_gradients and clip_lambda is not None:
                    clip = clip_lambda(state["step"])
                    grad.clamp_(-clip, clip)

                # Update parameters
                p.data.addcdiv_(grad, denom, value=-step_size)

        return loss
