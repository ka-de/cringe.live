---
weight: 1
bookFlatSection: false
title: "Replace Transparency with Black"
---

<!--markdownlint-disable MD025 -->

# Replace Transparency with Black

----

This Python script utilizes the PIL (Python Imaging Library) to recursively traverse a specified directory, identifying image files with extension `.png`, and adds a black layer behind the main layer of each image, effectively removing any existing transparency, before overwriting the original files with the modified versions.

```python
import os
from PIL import Image
import glob

def add_black_layer(image_path):
    """
    Adds a black layer to the image at the given path and overwrites it.

    Parameters:
    image_path (str): The file path to the image.
    """
    try:
        with Image.open(image_path) as img:
            # Ensure the image is in 'RGBA' mode to handle transparency
            img = img.convert('RGBA')
            black_layer = Image.new('RGBA', img.size, (0, 0, 0, 255))  # The fourth value is the alpha channel
            black_layer.paste(img, (0, 0), img)
            black_layer.save(image_path)
            print(f"Black layer added to and overwritten {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

def process_directory(directory):
    """
    Processes all .png images in the given directory and adds a black layer to them.

    Parameters:
    directory (str): The directory path where the images are located.
    """
    # Using glob to find all .png files in the directory recursively
    for image_path in glob.glob(os.path.join(directory, '**', '*.png'), recursive=True):
        add_black_layer(image_path)

if __name__ == "__main__":
    directory = r'E:\training_dir'
    process_directory(directory)
```
