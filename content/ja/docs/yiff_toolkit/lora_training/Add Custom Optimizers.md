---
weight: 2
bookFlatSection: false
bookToC: false
title: "カスタムオプティマイザーの追加"
summary: "この記事では、`sd-scripts`ライブラリにカスタムオプティマイザーを組み込む包括的なガイドを提供します。新しいオプティマイザーフォルダの設定とPythonを使用したカスタムオプティマイザークラスの作成プロセスについて説明します。"
---

<!--markdownlint-disable MD025 -->

# カスタムオプティマイザーの追加

---

まずは`sd-scripts`の`dev`ブランチでカスタムオプティマイザーの実験を始めましょう！このステップはスキップすることもできますが、そうすると実験の達人として友達に自慢できなくなりますよ！

```bash
git checkout dev
```

次に、`library`に新しい`optimizers`フォルダと空の`__init__.py`ファイルを作成しましょう！

Linux/Mac:

```bash
mkdir library/optimizers
touch library/optimizers/__init__.py
```

Windows PowerShell:

```pwsh
```

このフォルダには好きなオプティマイザーを入れることができます。例えば、`compass.py`を入れてみましょう：

```py
import torch
from torch.optim import Optimizer


class Compass(Optimizer):
    r"""
    引数：
        params (iterable):
            最適化するパラメータまたはパラメータグループを定義する
            辞書のイテラブル。
        lr (float):
            学習率パラメータ（デフォルト：0.0025）
        betas (Tuple[float, float], optional):
            勾配とその二乗の実行平均を計算するために使用される
            係数（デフォルト：(0.9, 0.999)）。
        amp_fac (float):
            第一モーメントフィルタの増幅係数（デフォルト：2）。
        eps (float):
            数値の安定性を改善するために根の演算の外側の
            分母に追加される項（デフォルト：1e-8）。
        weight_decay (float):
            重み減衰、つまりL2ペナルティ（デフォルト：0）。
        centralization (float):
            モデルの勾配を中心化（デフォルト：0）。
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
                    raise RuntimeError("Compassはスパース勾配をサポートしていません")

                state = self.state[p]

                # 状態の初期化
                if len(state) == 0:
                    state["step"] = 0
                    # 勾配値の指数移動平均
                    state["ema"] = torch.zeros_like(p.data)
                    # 勾配値の二乗の指数移動平均
                    state["ema_squared"] = torch.zeros_like(p.data)

                ema, ema_squared = state["ema"], state["ema_squared"]
                beta1, beta2 = group["betas"]
                amplification_factor = group["amp_fac"]
                lr = group["lr"]
                weight_decay = group["weight_decay"]
                centralization = group["centralization"]
                state["step"] += 1

                # 勾配ベクトルを中心化
                if centralization != 0:
                    grad.sub_(
                        grad.mean(dim=tuple(range(1, grad.dim())), keepdim=True).mul_(
                            centralization
                        )
                    )

                # バイアス補正ステップサイズ
                # ソフトウォームアップ
                bias_correction = 1 - beta1 ** state["step"]
                bias_correction_sqrt = (1 - beta2 ** state["step"]) ** (1 / 2)
                step_size = lr / bias_correction

                # 第一および第二モーメントの実行平均係数の減衰
                # ema = ema + (1 - beta1) * grad
                ema.mul_(beta1).add_(grad, alpha=1 - beta1)
                # grad = grad + ema * amplification_factor
                grad.add_(ema, alpha=amplification_factor)
                # ema_squared = ema + (1 - beta2) * grad ** 2
                ema_squared.mul_(beta2).addcmul_(grad, grad, value=1 - beta2)

                # ゼロ除算を防ぐためのlrスケーラー + eps
                # denom = exp_avg_sq.sqrt() + group['eps']
                denom = (ema_squared.sqrt() / bias_correction_sqrt).add_(group["eps"])

                if weight_decay != 0:
                    # ステップウェイト減衰を実行
                    p.data.mul_(1 - step_size * weight_decay)

                # p = p - lr * grad / denom
                p.data.addcdiv_(grad, denom, value=-step_size)

        return loss
```

あとは`train_util.py`の中に追加するだけです：

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
                "Importing Compass failed / インポート Compass が失敗しました。"
            )
        optimizer = optimizer_class(trainable_params, lr=lr, **optimizer_kwargs)

    if optimizer is None:
        # 任意のoptimizerを使う
```

これで、トレーニング時に新しい`LodeW`オプティマイザーを使用できます：

```bash
--optimizer_type=LodeW
```
