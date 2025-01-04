---
weight: 2
bookFlatSection: false
bookToC: false
title: "select_bucket"
aliases:
  - /docs/yiff_toolkit/lora_training/select-bucket/
  - /docs/yiff_toolkit/lora_training/select-bucket
  - /docs/yiff_toolkit/lora_training/select_bucket/
  - /docs/yiff_toolkit/lora_training/select_bucket
  - /en/docs/yiff_toolkit/lora_training/select_bucket/
  - /en/docs/yiff_toolkit/lora_training/select_bucket
  - /en/docs/yiff_toolkit/lora_training/select-bucket/
  - /en/docs/yiff_toolkit/lora_training/select-bucket
  - /en/docs/yiff_toolkit/lora_training/select bucket
  - /en/docs/yiff_toolkit/lora_training/select bucket
---

<!--markdownlint-disable MD025 -->

# `select_bucket`

---

The `select_bucket` function is responsible for determining the appropriate resolution (size) for an input image, based on predefined resolutions and aspect ratios, as well as the maximum area allowed for the image. The function takes two arguments: `image_width` and `image_height`, which represent the dimensions of the input image.

Here's a breakdown of the function's logic:

1. It calculates the aspect ratio of the input image by dividing `image_width` by `image_height`.

2. If `no_upscale` is False, the function attempts to find a predefined resolution that matches or closely approximates the aspect ratio of the input image. Here's how it works:

   a. If the input image's resolution is already in the set of predefined resolutions (`self.predefined_resos_set`), it leaves the resolution unchanged.

   b. If not, it calculates the difference between the input aspect ratio and each of the predefined aspect ratios (`self.predefined_aspect_ratios`). It then selects the predefined resolution with the smallest aspect ratio difference (`predefined_bucket_id`).

   c. Based on the selected predefined resolution (`reso`), it determines the scale factor to resize the input image. If the input aspect ratio is greater than the predefined aspect ratio, it scales to match the height of the predefined resolution. Otherwise, it scales to match the width.

   d. The resized dimensions (`resized_size`) are calculated by multiplying the input dimensions by the scale factor and rounding them to the nearest integer.

3. If `no_upscale` is True, the function performs only reduction (downscaling) of the image:

   a. If the input image's area (`image_width * image_height`) exceeds the maximum allowed area (`self.max_area`), it calculates the resized dimensions (`resized_width` and `resized_height`) by preserving the aspect ratio while ensuring the area does not exceed `self.max_area`.

   b. It then rounds the resized dimensions to the nearest multiple of `self.reso_steps` (a predefined resolution step size). This is done by choosing the rounding that results in the aspect ratio closest to the original aspect ratio.

   c. The final resized dimensions (`resized_size`) are set to the rounded values.

   d. If the input image's area does not exceed `self.max_area`, the function sets `resized_size` to the original input dimensions, as no resizing is needed.

   e. The function then calculates the bucket resolution (`reso`) by finding the largest dimensions that are multiples of `self.reso_steps` and smaller than or equal to the resized dimensions.

4. The function adds the selected resolution (`reso`) to a set of unique resolutions (`self.add_if_new_reso(reso)`).

5. Finally, it calculates the error between the aspect ratio of the selected resolution and the original aspect ratio (`ar_error`), and returns the tuple `(reso, resized_size, ar_error)`.

The `get_crop_ltrb` function, which is a static method, calculates the left, top, right, and bottom coordinates for cropping an image to fit a given bucket resolution. It takes two arguments: `bucket_reso` (the target resolution) and `image_size` (the original image size). The function determines whether to match the height or width of the bucket resolution based on the aspect ratios, calculates the resized dimensions, and then computes the crop coordinates based on the difference between the bucket resolution and the resized dimensions.

## Translation

---

```python
def select_bucket(self, image_width, image_height):
    aspect_ratio = image_width / image_height
    if not self.no_upscale:
        # Perform enlargement and reduction
        # Prioritize the same resolution because there might be the same aspect ratio
        # (in case of preprocessing with no_upscale=True in fine tuning)
        reso = (image_width, image_height)
        if reso in self.predefined_resos_set:
            pass
        else:
            ar_errors = self.predefined_aspect_ratios - aspect_ratio
            predefined_bucket_id = np.abs(ar_errors).argmin()  # The one with the least aspect ratio error other than the resolution
            reso = self.predefined_resos[predefined_bucket_id]

        ar_reso = reso[0] / reso[1]
        if aspect_ratio > ar_reso:  # If the width is longer, match the height
            scale = reso[1] / image_height
        else:
            scale = reso[0] / image_width

        resized_size = (int(image_width * scale + 0.5), int(image_height * scale + 0.5))
        # logger.info(f"use predef, {image_width}, {image_height}, {reso}, {resized_size}")
    else:
        # Only perform reduction
        if image_width * image_height > self.max_area:
            # If the image is too large, decide the bucket on the premise of reducing it while keeping the aspect ratio
            resized_width = math.sqrt(self.max_area * aspect_ratio)
            resized_height = self.max_area / resized_width
            assert abs(resized_width / resized_height - aspect_ratio) < 1e-2, "aspect is illegal"

            # Make the short side or long side after resizing a multiple of reso_steps: choose the one with less aspect ratio difference
            # Same logic as the original bucketing
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
            resized_size = (image_width, image_height)  # No need to resize

        # Make the size of the image less than the size of the bucket (crop without padding)
        bucket_width = resized_size[0] - resized_size[0] % self.reso_steps
        bucket_height = resized_size[1] - resized_size[1] % self.reso_steps
        # logger.info(f"use arbitrary {image_width}, {image_height}, {resized_size}, {bucket_width}, {bucket_height}")

        reso = (bucket_width, bucket_height)

    self.add_if_new_reso(reso)

    ar_error = (reso[0] / reso[1]) - aspect_ratio
    return reso, resized_size, ar_error

@staticmethod
def get_crop_ltrb(bucket_reso: Tuple[int, int], image_size: Tuple[int, int]):
    # Calculate crop left/top according to the preprocessing of Stability AI. Crop right is calculated for flip augmentation.

    bucket_ar = bucket_reso[0] / bucket_reso[1]
    image_ar = image_size[0] / image_size[1]
    if bucket_ar > image_ar:
        # If the bucket is wider, match the height
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
