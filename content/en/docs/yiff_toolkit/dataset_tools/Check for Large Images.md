---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Check for Large Images"
summary: "This script scans a directory for images and checks their dimensions. If an image's dimensions exceed specified thresholds, the script logs the image's path and dimensions to a file."
aliases:
  - /docs/yiff_toolkit/dataset_tools/Check for Large Images/
  - /docs/yiff_toolkit/dataset_tools/Check for Large Images
  - /docs/yiff_toolkit/dataset_tools/check-for-large-images
  - /docs/yiff_toolkit/dataset_tools/check-for-large-images/
---

<!--markdownlint-disable MD025 -->

# Check for Large Images

---

This script checks the resolution of all images in a specified directory and its subdirectories. If the resolution of an image exceeds a certain limit, the path of the image is written to an output file. The script uses multiprocessing to speed up the process.

```python
from pathlib import Path
import multiprocessing
import os
from PIL import Image


def check_image_resolution(filepath, output_file):
    """
    Checks the resolution of an image and writes the path of the image to a file if its resolution exceeds a certain limit.

    Parameters:
    filepath (Path): The path of the image file.
    output_file (str): The path of the output file where the paths of oversized images will be written.

    Returns:
    None
    """
    if filepath.suffix in [".jpg", ".jpeg", ".png"]:
        img = Image.open(filepath)
        width, height = img.size
        resolution = width * height
        if resolution > 16777216:
            normalized_path = os.path.normpath(str(filepath))
            print(
                f"The image {normalized_path} has a resolution of {resolution} pixels which is more than 16777216 pixels."
            )
            with open(output_file, "a", encoding="utf-8") as f:
                f.write(f"{normalized_path}\n")


def process_directory(directory, output_file):
    """
    Processes all files in a directory and its subdirectories.

    Parameters:
    directory (str): The path of the directory to be processed.
    output_file (str): The path of the output file where the paths of oversized images will be written.

    Returns:
    None
    """
    for filepath in Path(directory).rglob("*"):
        check_image_resolution(filepath, output_file)


def main(output_file):
    """
    Main function that creates a pool of worker processes and applies the process_directory function asynchronously.

    Parameters:
    output_file (str): The path of the output file where the paths of oversized images will be written.

    Returns:
    None
    """
    # Get the number of available CPU cores
    num_cores = multiprocessing.cpu_count()

    # Create a pool of worker processes
    pool = multiprocessing.Pool(num_cores)

    # Call the function with the path to your directory
    pool.apply_async(process_directory, args=(r"E:\training_dir", output_file))

    # Close the pool and wait for all tasks to complete
    pool.close()
    pool.join()


if __name__ == "__main__":
    OUTPUT_FILE = "oversized.txt"
    main(OUTPUT_FILE)
```
