---
weight: 1
bookFlatSection: false
title: "Convert RGBA to RGB in PNGs"
---

<!--markdownlint-disable MD025 -->

# Convert RGBA to RGB in PNGs

---

A Python script that automates the conversion of RGBA images to RGB. The script utilizes the Python Imaging Library (PIL) to handle the image processing and is designed to work through a directory of PNG files, converting each one as needed. Whether you’re preparing images for a website or cleaning up a dataset for machine learning.

```python
import os
from PIL import Image
import glob

# Increase the maximum allowed pixels, or set to None to disable the check
Image.MAX_IMAGE_PIXELS = 139211472

def convert_rgba_to_rgb(image_path):
    """
    Convert an RGBA image to an RGB image.

    Parameters:
    image_path (str): The file path to the RGBA image.
    """
    try:
        with Image.open(image_path) as image:
            # Check if the image has transparency
            if image.mode == 'RGBA':
                # Convert the image to RGB
                rgb_image = image.convert('RGB')
                # Save the new image over the original one
                rgb_image.save(image_path)
                print(f"Converted {image_path} to RGB.")
            else:
                print(f"{image_path} is not an RGBA image.")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

def main():
    """
    Main function that converts all RGBA images to RGB in a given directory.
    """
    directory = r'E:\training_dir'

    # Using glob to find all .png files in the directory recursively
    for file_path in glob.glob(os.path.join(directory, '**', '*.png'), recursive=True):
        # Convert the image
        convert_rgba_to_rgb(file_path)

    print("Conversion complete.")

if __name__ == "__main__":
    main()
```
