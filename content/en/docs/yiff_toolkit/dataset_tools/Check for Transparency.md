---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Check for Transparency"
summary: "This script checks for transparency in PNG images within a specified directory and its subdirectories."
aliases:
  - /docs/yiff_toolkit/dataset_tools/Check for Transparency/
  - /docs/yiff_toolkit/dataset_tools/Check for Transparency
  - /docs/yiff_toolkit/dataset_tools/check-for-transparency
  - /docs/yiff_toolkit/dataset_tools/check-for-transparency/
---

<!--markdownlint-disable MD025 -->

# Check for Transparency

---

This script recursively traverses a specified directory, identifying image files with extension `.png`. For each identified image, it checks if it contains transparency by examining its mode with PIL.

```python
import os
from PIL import Image
import glob

# Increase the maximum allowed pixels, or set to None to disable the check
Image.MAX_IMAGE_PIXELS = 139211472

def check_transparency(image_path):
    """
    Check if the given image has transparency.

    Parameters:
    image_path (str): The file path to the image.

    Returns:
    bool: True if the image has transparency (mode 'RGBA'), False otherwise.
    """
    try:
        image = Image.open(image_path)
        if image.mode == 'RGBA':
            return True
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
    return False

def main():
    """
    Main function that finds and prints out all images with transparency in a given directory.
    """
    directory = r'E:\training_dir'
    transparent_images = []

    # Using glob to find all .png files in the directory recursively
    for file_path in glob.glob(os.path.join(directory, '**', '*.png'), recursive=True):
        if check_transparency(file_path):
            transparent_images.append(file_path)

    # Printing the results
    if transparent_images:
        print("Images with transparency:")
        for img in transparent_images:
            print(img)
    else:
        print("No transparent images in your dataset!")

if __name__ == "__main__":
    main()
```
