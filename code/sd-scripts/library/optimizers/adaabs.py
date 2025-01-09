class AdaAbs(Optimizer):
    def __init__(self, params, lr=1e-3, beta=0.99, eps=1e-8, weight_decay=0):
        defaults = dict(lr=lr, beta=beta, eps=eps, weight_decay=weight_decay)
        super(AdaAbs, self).__init__(params, defaults)

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
                    raise RuntimeError("AdaAbs does not support sparse gradients")

                state = self.state[p]

                # State initialization
                if len(state) == 0:
                    state["step"] = 0
                    # Exponential moving average of abs gradient values
                    state["ema_abs"] = torch.zeros_like(p.data)

                ema_abs = state["ema_abs"]
                beta = group["beta"]
                lr = group["lr"]
                weight_decay = group["weight_decay"]
                state["step"] += 1

                # soft warmup
                bias_correction = 1 - beta ** state["step"]
                step_size = lr

                # ema_abs = ema_abs * beta + (1 - beta) * torch.abs(grad)
                ema_abs.lerp_(torch.abs(grad), 1 - beta)

                # denom = ema_abs + group['eps']
                denom = (ema_abs / bias_correction).add_(group["eps"])

                if weight_decay != 0:
                    # Perform stepweight decay
                    p.data.mul_(1 - step_size * weight_decay)

                # p = p - lr * grad / denom
                p.data.addcdiv_(grad, denom, value=-step_size)

        return loss
