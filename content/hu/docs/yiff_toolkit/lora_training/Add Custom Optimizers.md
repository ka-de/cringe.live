---
weight: 2
bookFlatSection: false
bookToC: false
title: "Egyéni Optimalizálók Hozzáadása"
summary: "Ez a cikk átfogó útmutatót nyújt az egyéni optimalizálók beépítéséhez az `sd-scripts` könyvtárba. Bemutatja egy új optimalizálók mappa létrehozásának folyamatát és egy egyéni optimalizáló osztály létrehozását Python segítségével."
aliases:
  - /hu/docs/yiff_toolkit/lora_training/Add-Custom-Optimizers/
  - /hu/docs/yiff_toolkit/lora_training/Add-Custom-Optimizers
  - /hu/docs/yiff_toolkit/lora_training/Add Custom Optimizers/
  - /hu/docs/yiff_toolkit/lora_training/Add Custom Optimizers
  - /hu/docs/yiff_toolkit/lora_training/Egyéni Optimalizálók Hozzáadása
  - /hu/docs/yiff_toolkit/lora_training/Egyéni Optimalizálók Hozzáadása/
  - /hu/docs/yiff_toolkit/lora_training/Egyéni_Optimalizálók_Hozzáadása
  - /hu/docs/yiff_toolkit/lora_training/Egyéni_Optimalizálók_Hozzáadása/
  - /hu/docs/yiff_toolkit/lora_training/Egyéni-Optimalizálók-Hozzáadása
  - /hu/docs/yiff_toolkit/lora_training/Egyéni-Optimalizálók-Hozzáadása/
  - /hu/docs/yiff_toolkit/lora_training/egyeni_optimalizalok
---

<!--markdownlint-disable MD025 -->

# Egyéni Optimalizálók Hozzáadása

---

Győződjünk meg róla, hogy az egyéni optimalizálókkal való kis kísérleteidet az `sd-scripts` `dev` ágán kezded! Kihagyhatod ezt a lépést, de akkor nem dicsekedhetsz a barátaidnak, hogy kísérletező zseni vagy!

```bash
git checkout dev
```

Most hozzunk létre egy új `optimizers` mappát a `library`-ben és egy üres `__init__.py` fájlt is!

Linux/Mac:

```bash
mkdir library/optimizers
touch library/optimizers/__init__.py
```

Windows PowerShell:

```pwsh
```

Bármilyen optimalizálót beletehetsz ebbe a mappába, például tegyük bele a `compass.py`-t:

```py
import torch
from torch.optim import Optimizer


class Compass(Optimizer):
    r"""
    Argumentumok:
        params (iterable):
            Optimalizálandó paraméterek iterálható objektuma vagy
            paramétercsoportokat definiáló szótárak.
        lr (float):
            Tanulási ráta paraméter (alapértelmezett: 0.0025)
        betas (Tuple[float, float], optional):
            A gradiens és négyzetének futó átlagainak számításához
            használt együtthatók (alapértelmezett: (0.9, 0.999)).
        amp_fac (float):
            Erősítési tényező az első momentum szűrőhöz (alapértelmezett: 2).
        eps (float):
            A gyökművelet nevezőjéhez hozzáadott tag a numerikus
            stabilitás javítása érdekében. (alapértelmezett: 1e-8).
        weight_decay (float):
            Súlycsökkenés, azaz L2 büntetés (alapértelmezett: 0).
        centralization (float):
            Modell gradiens középpontosítása (alapértelmezett: 0).
    """

    def __init__(
        self,
        params,
        lr=1e-3,
        betas=(0.9, 0.999),
        amp_fac=2,
        eps=1e-8,
        weight_decay=0,
        centralization=0,
    ):
        defaults = dict(
            lr=lr,
            betas=betas,
            amp_fac=amp_fac,
            eps=eps,
            weight_decay=weight_decay,
            centralization=centralization,
        )
        super(Compass, self).__init__(params, defaults)

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
                    raise RuntimeError("A Compass nem támogatja a ritka gradienseket")

                state = self.state[p]

                # Állapot inicializálása
                if len(state) == 0:
                    state["step"] = 0
                    # Gradiens értékek exponenciális mozgó átlaga
                    state["ema"] = torch.zeros_like(p.data)
                    # Gradiens értékek négyzetének exponenciális mozgó átlaga
                    state["ema_squared"] = torch.zeros_like(p.data)

                ema, ema_squared = state["ema"], state["ema_squared"]
                beta1, beta2 = group["betas"]
                amplification_factor = group["amp_fac"]
                lr = group["lr"]
                weight_decay = group["weight_decay"]
                centralization = group["centralization"]
                state["step"] += 1

                # Gradiens vektor középpontosítása
                if centralization != 0:
                    grad.sub_(
                        grad.mean(dim=tuple(range(1, grad.dim())), keepdim=True).mul_(
                            centralization
                        )
                    )

                # Torzítás korrekciós lépésméret
                # Lágy bemelegítés
                bias_correction = 1 - beta1 ** state["step"]
                bias_correction_sqrt = (1 - beta2 ** state["step"]) ** (1 / 2)
                step_size = lr / bias_correction

                # Az első és második momentum futó átlag együtthatójának csökkentése
                # ema = ema + (1 - beta1) * grad
                ema.mul_(beta1).add_(grad, alpha=1 - beta1)
                # grad = grad + ema * amplification_factor
                grad.add_(ema, alpha=amplification_factor)
                # ema_squared = ema + (1 - beta2) * grad ** 2
                ema_squared.mul_(beta2).addcmul_(grad, grad, value=1 - beta2)

                # lr skálázó + eps a nullával való osztás elkerülésére
                # denom = exp_avg_sq.sqrt() + group['eps']
                denom = (ema_squared.sqrt() / bias_correction_sqrt).add_(group["eps"])

                if weight_decay != 0:
                    # Lépésenkénti súlycsökkentés végrehajtása
                    p.data.mul_(1 - step_size * weight_decay)

                # p = p - lr * grad / denom
                p.data.addcdiv_(grad, denom, value=-step_size)

        return loss
```

Most már csak be kell illesztened a `train_util.py`-ba:

```py
    elif optimizer_type == "AdamW".lower():
        logger.info(f"use AdamW optimizer | {optimizer_kwargs}")
        optimizer_class = torch.optim.AdamW
        optimizer = optimizer_class(trainable_params, lr=lr, **optimizer_kwargs)

    elif optimizer_type == "LodeW".lower():
        logger.info(f"use LodeW optimizer | {optimizer_kwargs}")
        try:
            from library.optimizers.compass import Compass

            optimizer_class = Compass
        except ImportError:
            raise ImportError(
                "A Compass importálása sikertelen / インポート Compass が失敗しました。"
            )
        optimizer = optimizer_class(trainable_params, lr=lr, **optimizer_kwargs)

    if optimizer is None:
        # Tetszőleges optimalizáló használata
```

És most már használhatod az új `LodeW` optimalizálót a tréning során:

```bash
--optimizer_type=LodeW
```

---

{{< related-posts related="docs/yiff_toolkit/comfyui/custom_nodes/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Manager/ | docs/yiff_toolkit/lora_training/NoobAI/" >}}
