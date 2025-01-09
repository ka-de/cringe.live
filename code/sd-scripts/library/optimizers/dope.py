import torch
from torch.optim import Optimizer
from typing import Optional, Tuple, Callable
import math

class DOPE(Optimizer):
    """
    DOPE (Dynamic Optimized Parameter Estimation) optimizer.
    
    Combines ExMachina's Fisher-accelerated MARS with SAVEUS's advanced gradient processing techniques
    for improved training stability and convergence.
    
    Args:
        params: Iterable of parameters to optimize or dicts defining parameter groups
        lr (float): Learning rate (default: 1.5e-4)
        betas (Tuple[float, float]): FIM decay rates (default: (0.999, 0.9999))
        momentum_beta (float): Momentum decay rate (default: 0.9999)
        eps (float): Primary epsilon for numerical stability (default: 1e-6)
        eps2 (float): Secondary epsilon for FIM scaling (default: 1e-2)
        eps_floor (float, optional): Minimum epsilon value (default: None)
        weight_decay (float): Weight decay coefficient (default: 0.01)
        centralization (float): Gradient centralization strength (default: 0.5)
        normalization (float): Gradient normalization strength (default: 0.5)
        diff_mult (float): Gradient difference multiplier (default: 1.0)
        momentum_lambda (float): Momentum scaling factor NOTE: This serves both as the exponent and the scaling factor. (default: 0.25) 
        gamma (float): MARS correction factor (default: 0.0005)
        clip (float): Gradient clipping threshold (default: 1.0)
        cautious (bool): Whether to use cautious updates (default: True)
        normalize_channels (bool): Whether to normalize gradients channel-wise (default: True)
    """
    
    def __init__(
        self,
        params,
        lr: float = 1.5e-4,
        betas: Tuple[float, float] = (0.999, 0.9999),
        momentum_beta: float = 0.9999,
        eps: float = 1e-6,
        eps2: float = 1e-2,
        eps_floor: Optional[float] = None,
        weight_decay: float = 0.01,
        centralization: float = 0.5,
        normalization: float = 0.5,
        diff_mult: float = 1.0,
        momentum_lambda: float = 0.25,
        gamma: float = 0.0005,
        clip: float = 1.0,
        cautious: bool = True,
        normalize_channels: bool = True,
    ):
        if not 0.0 <= lr:
            raise ValueError(f"Invalid learning rate: {lr}")
        if not 0.0 <= eps:
            raise ValueError(f"Invalid epsilon value: {eps}")
        if not 0.0 <= eps2:
            raise ValueError(f"Invalid epsilon2 value: {eps2}")
        if not 0.0 <= betas[0] < 1.0:
            raise ValueError(f"Invalid beta1 parameter: {betas[0]}")
        if not 0.0 <= betas[1] < 1.0:
            raise ValueError(f"Invalid beta2 parameter: {betas[1]}")
        if not 0.0 <= momentum_beta < 1.0:
            raise ValueError(f"Invalid momentum_beta parameter: {momentum_beta}")
            
        defaults = dict(
            lr=lr,
            betas=betas,
            momentum_beta=momentum_beta,
            eps=eps,
            eps2=eps2,
            eps_floor=eps_floor,
            weight_decay=weight_decay,
            centralization=centralization,
            normalization=normalization,
            diff_mult=diff_mult,
            momentum_lambda=momentum_lambda,
            gamma=gamma,
            clip=clip,
            cautious=cautious,
            normalize_channels=normalize_channels,
        )
        super(DOPE, self).__init__(params, defaults)

    def normalize_gradient(
        self,
        x: torch.Tensor,
        use_channels: bool = True,
        alpha: float = 1.0,
        epsilon: float = 1e-8,
    ) -> None:
        """Normalize gradient with standard deviation.
        
        Args:
            x: Gradient tensor
            use_channels: Whether to normalize channel-wise
            alpha: Interpolation weight between original and normalized gradient
            epsilon: Small value for numerical stability
        """
        size = x.dim()
        if size > 1 and use_channels:
            s = x.std(dim=tuple(range(1, size)), keepdim=True).add_(epsilon)
            x.lerp_(x.div_(s), weight=alpha)
        elif torch.numel(x) > 2:
            s = x.std().add_(epsilon)
            x.lerp_(x.div_(s), weight=alpha)

    @torch.no_grad()
    def step(self, closure: Optional[Callable] = None):
        """Performs a single optimization step.
        
        Args:
            closure (callable, optional): A closure that reevaluates the model and returns the loss
        """
        loss = None
        if closure is not None:
            with torch.enable_grad():
                loss = closure()

        for group in self.param_groups:
            for p in group['params']:
                if p.grad is None:
                    continue
                
                grad = p.grad
                if grad.is_sparse:
                    raise RuntimeError('DOPE does not support sparse gradients')

                state = self.state[p]

                # State initialization
                if len(state) == 0:
                    state['step'] = 0
                    state['exp_avg'] = torch.zeros_like(p, memory_format=torch.preserve_format)
                    state['fim'] = torch.zeros_like(p, memory_format=torch.preserve_format)
                    state['fim_diff'] = torch.zeros_like(p, memory_format=torch.preserve_format)
                    state['prev_grad'] = torch.zeros_like(p, memory_format=torch.preserve_format)
                    if group['cautious']:
                        state['mask'] = torch.ones_like(p, memory_format=torch.preserve_format)

                # Get parameters
                exp_avg = state['exp_avg']
                fim = state['fim']
                fim_diff = state['fim_diff']
                prev_grad = state['prev_grad']
                
                beta1, beta2 = group['betas']
                momentum_beta = group['momentum_beta']
                state['step'] += 1
                step = state['step']

                # Pre-process gradients
                if group['centralization'] > 0:
                    grad.sub_(
                        grad.mean(dim=tuple(range(1, grad.dim())), keepdim=True)
                        .mul_(group['centralization'])
                    )

                if group['normalization'] > 0:
                    self.normalize_gradient(
                        grad,
                        use_channels=group['normalize_channels'],
                        alpha=group['normalization']
                    )

                # Clip gradients
                if group['clip'] > 0:
                    torch.nn.utils.clip_grad_norm_(p, group['clip'])

                # Compute FIM estimates
                fim.mul_(beta2).addcmul_(grad, grad, value=1 - beta2)
                grad_diff = grad - prev_grad
                fim_diff.mul_(beta1).addcmul_(grad_diff, grad_diff, value=1 - beta1)
                prev_grad.copy_(grad)

                # Compute bias corrections
                bias_correction1 = 1 - beta1 ** step
                bias_correction2 = 1 - beta2 ** step
                
                # Compute effective epsilon
                eps_hat = group['eps']
                if group['eps_floor'] is not None:
                    eps_hat = max(group['eps_floor'], eps_hat * math.sqrt(step))

                # Natural gradient computation
                denom = (fim.sqrt().div(math.sqrt(bias_correction2)).add_(eps_hat))
                denom_diff = (fim_diff.sqrt().div(math.sqrt(bias_correction1))
                            .mul_(group['diff_mult']).add_(group['eps2']))
                grad.div_(denom).div_(denom_diff)

                # MARS correction
                mars_term = group['gamma'] * (beta1 / (1 - beta1)) * prev_grad
                grad.add_(mars_term)
                
                # Momentum with centering and step-dependent amplification
                exp_avg.mul_(momentum_beta).add_(grad, alpha=1 - momentum_beta)
                # Center momentum
                exp_avg.sub_(exp_avg.mean(dim=tuple(range(1, exp_avg.dim())), keepdim=True))
                # Use step^lambda for momentum amplification
                momentum_term = exp_avg.mul(
                    group['momentum_lambda'] * torch.pow(
                        torch.tensor(step, dtype=torch.float32, device=exp_avg.device),
                        group['momentum_lambda']
                    )
                )
                grad.add_(momentum_term)

                # Improved cautious update with normalization
                if group['cautious']:
                    mask = state['mask']
                    positive_updates = grad * prev_grad > 0
                    torch.where(
                        positive_updates,
                        torch.ones_like(mask),
                        torch.zeros_like(mask),
                        out=mask
                    )
                    # Normalize mask by count of positive elements
                    mask.mul_(torch.numel(mask) / (positive_updates.sum() + 1e-8))
                    grad.mul_(mask)

                # Preconditioned weight decay
                if group['weight_decay'] > 0:
                    w_t = p.data.div(denom).div(denom_diff)
                    p.data.add_(w_t, alpha=-group['lr'] * group['weight_decay'])

                # Update parameters
                p.data.add_(grad, alpha=-group['lr'])

        return loss
