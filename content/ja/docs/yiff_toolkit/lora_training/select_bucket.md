---
weight: 2
bookFlatSection: false
bookToC: false
title: "select_bucket"
---

<!--markdownlint-disable MD025 -->

# `select_bucket`

---

`select_bucket`関数は、事前定義された解像度とアスペクト比、および画像に許可された最大面積に基づいて、入力画像の適切な解像度（サイズ）を決定する役割を担っています。この関数は、入力画像の寸法を表す`image_width`と`image_height`の2つの引数を取ります。

以下は関数のロジックの詳細です：

1. 入力画像のアスペクト比を`image_width`を`image_height`で割って計算します。

2. `no_upscale`がFalseの場合、関数は入力画像のアスペクト比に一致または近似する事前定義された解像度を見つけようとします。以下がその仕組みです：

   a. 入力画像の解像度が既に事前定義された解像度のセット（`self.predefined_resos_set`）に含まれている場合、解像度は変更されません。

   b. そうでない場合、入力アスペクト比と各事前定義アスペクト比（`self.predefined_aspect_ratios`）との差を計算します。そして、アスペクト比の差が最小の事前定義解像度（`predefined_bucket_id`）を選択します。

   c. 選択された事前定義解像度（`reso`）に基づいて、入力画像のリサイズに使用するスケール係数を決定します。入力アスペクト比が事前定義アスペクト比より大きい場合、事前定義解像度の高さに合わせてスケーリングします。それ以外の場合は、幅に合わせてスケーリングします。

   d. リサイズされた寸法（`resized_size`）は、入力寸法にスケール係数を掛けて最も近い整数に丸めることで計算されます。

3. `no_upscale`がTrueの場合、関数は画像の縮小（ダウンスケーリング）のみを実行します：

   a. 入力画像の面積（`image_width * image_height`）が許可された最大面積（`self.max_area`）を超える場合、アスペクト比を保持しながら面積が`self.max_area`を超えないようにリサイズされた寸法（`resized_width`と`resized_height`）を計算します。

   b. その後、リサイズされた寸法を`self.reso_steps`（事前定義された解像度のステップサイズ）の最も近い倍数に丸めます。これは、元のアスペクト比に最も近いアスペクト比となる丸め方を選択することで行われます。

   c. 最終的なリサイズされた寸法（`resized_size`）は丸められた値に設定されます。

   d. 入力画像の面積が`self.max_area`を超えない場合、リサイズは必要ないため、関数は`resized_size`を元の入力寸法に設定します。

   e. その後、関数はバケット解像度（`reso`）を、リサイズされた寸法以下で`self.reso_steps`の倍数である最大の寸法を見つけることで計算します。

4. 関数は選択された解像度（`reso`）をユニークな解像度のセットに追加します（`self.add_if_new_reso(reso)`）。

5. 最後に、選択された解像度のアスペクト比と元のアスペクト比との誤差（`ar_error`）を計算し、タプル`(reso, resized_size, ar_error)`を返します。

`get_crop_ltrb`関数は静的メソッドで、画像を指定されたバケット解像度に合わせてクロップするための左、上、右、下の座標を計算します。この関数は、`bucket_reso`（目標解像度）と`image_size`（元の画像サイズ）の2つの引数を取ります。関数はアスペクト比に基づいてバケット解像度の高さまたは幅に合わせるかを決定し、リサイズされた寸法を計算し、その後バケット解像度とリサイズされた寸法の差に基づいてクロップ座標を計算します。

## 翻訳

---

```python
def select_bucket(self, image_width, image_height):
    aspect_ratio = image_width / image_height
    if not self.no_upscale:
        # 拡大と縮小を実行
        # 同じアスペクト比の可能性があるため、同じ解像度を優先
        #（ファインチューニングでno_upscale=Trueの前処理の場合）
        reso = (image_width, image_height)
        if reso in self.predefined_resos_set:
            pass
        else:
            ar_errors = self.predefined_aspect_ratios - aspect_ratio
            predefined_bucket_id = np.abs(ar_errors).argmin()  # 解像度以外でアスペクト比の誤差が最小のもの
            reso = self.predefined_resos[predefined_bucket_id]

        ar_reso = reso[0] / reso[1]
        if aspect_ratio > ar_reso:  # 幅が長い場合は高さを合わせる
            scale = reso[1] / image_height
        else:
            scale = reso[0] / image_width

        resized_size = (int(image_width * scale + 0.5), int(image_height * scale + 0.5))
        # logger.info(f"use predef, {image_width}, {image_height}, {reso}, {resized_size}")
    else:
        # 縮小のみ実行
        if image_width * image_height > self.max_area:
            # 画像が大きすぎる場合、アスペクト比を保持しながら縮小することを前提にバケットを決定
            resized_width = math.sqrt(self.max_area * aspect_ratio)
            resized_height = self.max_area / resized_width
            assert abs(resized_width / resized_height - aspect_ratio) < 1e-2, "アスペクト比が不正です"

            # リサイズ後の短辺または長辺をreso_stepsの倍数にする：アスペクト比の差が小さい方を選択
            # 元のバケッティングと同じロジック
            b_width_rounded = self.round_to_steps(resized_width)
            b_height_in_wr = self.round_to_steps(b_width_rounded / aspect_ratio)
            ar_width_rounded = b_width_rounded / b_height_in_wr

            b_height_rounded = self.round_to_steps(resized_height)
            b_width_in_hr = self.round_to_steps(b_height_rounded * aspect_ratio)
            ar_height_rounded = b_width_in_hr / b_height_rounded

            # logger.info(b_width_rounded, b_height_in_wr, ar_width_rounded)
            # logger.info(b_width_in_hr, b_height_rounded, ar_height_rounded)

            if abs(ar_width_rounded - aspect_ratio) < abs(ar_height_rounded - aspect_ratio):
                resized_size = (b_width_rounded, int(b_width_rounded / aspect_ratio + 0.5))
            else:
                resized_size = (int(b_height_rounded * aspect_ratio + 0.5), b_height_rounded)
            # logger.info(resized_size)
        else:
            resized_size = (image_width, image_height)  # リサイズ不要

        # 画像のサイズをバケットのサイズ以下にする（パディングなしでクロップ）
        bucket_width = resized_size[0] - resized_size[0] % self.reso_steps
        bucket_height = resized_size[1] - resized_size[1] % self.reso_steps
        # logger.info(f"use arbitrary {image_width}, {image_height}, {resized_size}, {bucket_width}, {bucket_height}")

        reso = (bucket_width, bucket_height)

    self.add_if_new_reso(reso)

    ar_error = (reso[0] / reso[1]) - aspect_ratio
    return reso, resized_size, ar_error

@staticmethod
def get_crop_ltrb(bucket_reso: Tuple[int, int], image_size: Tuple[int, int]):
    # Stability AIの前処理に従ってクロップの左/上を計算。クロップの右はフリップ拡張のために計算。

    bucket_ar = bucket_reso[0] / bucket_reso[1]
    image_ar = image_size[0] / image_size[1]
    if bucket_ar > image_ar:
        # バケットが広い場合は高さを合わせる
        resized_width = bucket_reso[1] * image_ar
        resized_height = bucket_reso[1]
    else:
        resized_width = bucket_reso[0]
        resized_height = bucket_reso[0] / image_ar
    crop_left = (bucket_reso[0] - resized_width) // 2
    crop_top = (bucket_reso[1] - resized_height) // 2
    crop_right = crop_left + resized_width
    crop_bottom = crop_top + resized_height
    return crop_left, crop_top, crop_right, crop_bottom


class BucketBatchIndex(NamedTuple):
    bucket_index: int
    bucket_batch_size: int
    batch_index: int
```

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/dataset_tools/Check for Large Images/ | docs/yiff_toolkit/dataset_tools/furrytagger" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
