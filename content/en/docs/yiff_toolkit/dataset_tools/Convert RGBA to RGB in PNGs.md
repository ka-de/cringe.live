---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Convert RGBA to RGB in PNGs"
summary: "This script automates the process of converting `.png` images from RGBA to RGB format in a specified directory, utilizing multiprocessing to enhance efficiency."
---

<!--markdownlint-disable MD025 -->

# Convert RGBA to RGB in PNGs

---

This script automates the process of converting `.png` images from RGBA to RGB format in a specified directory, utilizing multiprocessing to enhance efficiency.

```python
import os
from PIL import Image
import glob
import multiprocessing

# Set the maximum number of pixels allowed in an image to prevent DecompressionBombWarning.
Image.MAX_IMAGE_PIXELS = 139211472

def convert_rgba_to_rgb(image_path):
    """
    Convert an RGBA image to RGB format.

    This function opens an image from a given path and checks if it's in RGBA mode.
    If it is, the image is converted to RGB mode and saved back to the same path.
    Any errors encountered during processing are caught and printed.

    Parameters:
    - image_path (str): The file path of the image to be converted.

    Returns:
    None
    """
    try:
        print(f"Opening image: {image_path}")
        with Image.open(image_path) as image:
            print(f"Image mode: {image.mode}")
            if image.mode == "RGBA":
                rgb_image = image.convert("RGB")
                rgb_image.save(image_path)
                print(f"Converted {image_path} to RGB.")
            else:
                print(f"{image_path} is not an RGBA image.")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

def main():
    """
    Main function to convert all RGBA images to RGB in a directory.

    This function searches for all .png files in a specified directory and its subdirectories.
    It then creates a pool of processes equal to the number of available CPUs and uses them
    to convert each RGBA image to RGB format concurrently.

    Returns:
    None
    """
    directory = r"E:\training_dir"
    print(f"Directory set to: {directory}")

    # Get all .png files in the directory recursively
    files = glob.glob(os.path.join(directory, "**", "*.png"), recursive=True)
    print(f"Found {len(files)} .png files in directory and subdirectories.")

    # Determine the number of processes based on the available CPUs
    num_processes = multiprocessing.cpu_count()
    print(f"Number of processes set to the number of available CPUs: {num_processes}")

    # Create a pool of processes
    with multiprocessing.Pool(num_processes) as pool:
        print("Pool of processes created.")
        # Map the convert_rgba_to_rgb function to the files
        pool.map(convert_rgba_to_rgb, files)

    print("Conversion complete.")


if __name__ == "__main__":
    main()
```
