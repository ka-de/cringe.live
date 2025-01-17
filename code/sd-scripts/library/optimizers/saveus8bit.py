import torch
from bitsandbytes.optim.optimizer import Optimizer2State


class SAVEUS8bit(Optimizer2State):
    def __init__(
        self,
        params,
        lr=1e-3,
        betas=(0.9, 0.999),
        eps=1e-8,
        weight_decay=0.0,
        centralization=0.5,
        normalization=0.5,
        normalize_channels=True,
        amp_fac=2.0,
        clip_lambda=lambda step: step**0.25,
        decouple_weight_decay=False,
        clip_gradients=False,
        optim_bits=32,
        args=None,
        min_8bit_size=4096,
        percentile_clipping=100,
        block_wise=True,
        is_paged=False,
    ):
        """
        8-bit SAVEUS optimizer.

        The optimizer combines several advanced optimization techniques with 8-bit state quantization:
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

        Arguments:
            params (torch.tensor):
                The input parameters to optimize.
            lr (float, defaults to 1e-3):
                The learning rate.
            betas (tuple(float, float), defaults to (0.9, 0.999)):
                The beta values are the decay rates of the first and second-order moment of the optimizer.
            eps (float, defaults to 1e-8):
                The epsilon value prevents division by zero in the optimizer.
            weight_decay (float, defaults to 0.0):
                The weight decay value for the optimizer.
            centralization (float, defaults to 0.5):
                Strength of gradient centralization.
            normalization (float, defaults to 0.5):
                Interpolation factor for normalized gradients.
            normalize_channels (bool, defaults to True):
                Whether to normalize gradients channel-wise.
            amp_fac (float, defaults to 2.0):
                Amplification factor for the momentum term.
            clip_lambda (Callable[[int], float], defaults to lambda step: step**0.25):
                Function computing gradient clipping threshold from step number.
            decouple_weight_decay (bool, defaults to False):
                Whether to apply weight decay directly to weights.
            clip_gradients (bool, defaults to False):
                Whether to enable gradient clipping.
            optim_bits (int, defaults to 32):
                The number of bits of the optimizer state.
            args (object, defaults to None):
                An object with additional arguments.
            min_8bit_size (int, defaults to 4096):
                The minimum number of elements of the parameter tensors for 8-bit optimization.
            percentile_clipping (int, defaults to 100):
                Adapts clipping threshold automatically by tracking the last 100 gradient norms.
            block_wise (bool, defaults to True):
                Whether to independently quantize each block of tensors.
            is_paged (bool, defaults to False):
                Whether the optimizer is a paged optimizer or not.
        """
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
        super().__init__(
            "saveus",
            params,
            lr,
            betas,
            eps,
            weight_decay,
            8,  # Force 8-bit optimization
            args,
            min_8bit_size,
            percentile_clipping,
            block_wise,
            is_paged=is_paged,
        )

    def normalize_gradient(
        self,
        x: torch.Tensor,
        use_channels: bool = False,
        alpha: float = 1.0,
        epsilon: float = 1e-8,
    ) -> None:
        """Normalize gradient with standard deviation.
        
        Args:
            x (torch.Tensor):
                Gradient tensor to normalize.
            use_channels (bool, defaults to False):
                Whether to normalize channel-wise.
            alpha (float, defaults to 1.0):
                Interpolation weight between original and normalized gradient.
            epsilon (float, defaults to 1e-8):
                Small value to prevent division by zero.
        """
        size: int = x.dim()
        if size > 1 and use_channels:
            s = x.std(dim=tuple(range(1, size)), keepdim=True).add_(epsilon)
            x.lerp_(x.div_(s), weight=alpha)
        elif torch.numel(x) > 2:
            s = x.std().add_(epsilon)
            x.lerp_(x.div_(s), weight=alpha)
