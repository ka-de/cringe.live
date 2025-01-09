import torch
from torch.optim import Optimizer


class AdaptiveCompass(Optimizer):
    def __init__(
        self,
        params,
        lr=1e-3,
        betas=(0.9, 0.999),
        amp_fac=1.5,
        eps=1e-8,
        weight_decay=0.01,
        centralization=0.1,
        normalization=0.1,
        normalize_channels=False,
    ):
        defaults = dict(
            lr=lr,
            betas=betas,
            amp_fac=amp_fac,
            eps=eps,
            weight_decay=weight_decay,
            centralization=centralization,
            normalization=normalization,
            normalize_channels=normalize_channels,
        )
        super(AdaptiveCompass, self).__init__(params, defaults)

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

    def step(self, closure=None):
        loss = None
        if closure is not None:
            loss = closure()

        for group in self.param_groups:
            for p in group["params"]:
                if p.grad is None:
                    continue
                grad = p.grad.data
                if grad.is_sparse:
                    raise RuntimeError(
                        "AdaptiveCompass does not support sparse gradients"
                    )

                state = self.state[p]

                # State initialization
                if len(state) == 0:
                    state["step"] = 0
                    state["ema"] = torch.zeros_like(p.data)
                    state["ema_abs"] = torch.zeros_like(p.data)

                ema, ema_abs = state["ema"], state["ema_abs"]
                beta1, beta2 = group["betas"]
                amp_fac = group["amp_fac"]
                lr = group["lr"]
                weight_decay = group["weight_decay"]
                centralization = group["centralization"]
                normalization = group["normalization"]
                normalize_channels = group["normalize_channels"]
                state["step"] += 1

                # Center the gradient vector
                if centralization != 0:
                    grad.sub_(
                        grad.mean(dim=tuple(range(1, grad.dim())), keepdim=True).mul_(
                            centralization
                        )
                    )

                # Normalize the gradient
                if normalization != 0:
                    self.normalize_gradient(
                        grad, use_channels=normalize_channels, alpha=normalization
                    )

                # Bias correction
                bias_correction1 = 1 - beta1 ** state["step"]
                bias_correction2 = 1 - beta2 ** state["step"]
                step_size = lr / bias_correction1

                # Update moving averages
                ema.mul_(beta1).add_(grad, alpha=1 - beta1)
                ema_abs.mul_(beta2).add_(grad.abs(), alpha=1 - beta2)

                # Amplify the gradient
                grad.add_(ema, alpha=amp_fac)

                # Compute denominator
                denom = (ema_abs / bias_correction2).add_(group["eps"])

                if weight_decay != 0:
                    p.data.mul_(1 - step_size * weight_decay)

                # Update parameters
                p.data.addcdiv_(grad, denom, value=-step_size)

        return loss
