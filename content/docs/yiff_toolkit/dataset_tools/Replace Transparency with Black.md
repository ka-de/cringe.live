---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Replace Transparency with Black"
summary: "This Python script processes all `.png` images in a specified directory by adding a black layer to each, utilizing multiprocessing to handle the images in parallel for efficiency."
---

<!--markdownlint-disable MD025 -->

# Replace Transparency with Black

---

This Python script processes all `.png` images in a specified directory by adding a black layer to each, utilizing multiprocessing to handle the images in parallel for efficiency.

```python
import os
from PIL import Image
import glob
from multiprocessing import Pool

def add_black_layer(image_path):
    """
    Adds a black layer to the image at the given path and saves the modified image.

    This function opens an image, converts it to 'RGBA' mode, creates a new black layer,
    pastes the original image onto the black layer, and saves the result back to the disk.

    Parameters:
    image_path (str): The file path to the image to be processed.

    Raises:
    Exception: If there is an error opening or processing the image.
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

def process_image(image_path):
    """
    Processes a single image by adding a black layer.

    This function is designed to be used with multiprocessing. It calls the 'add_black_layer'
    function and handles any exceptions that occur.

    Parameters:
    image_path (str): The file path to the image to be processed.
    """
    try:
        add_black_layer(image_path)
        print(f"Black layer added to and overwritten {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

def process_directory(directory):
    """
    Processes all .png images in a directory by adding a black layer to each.

    This function finds all .png images within the specified directory (including subdirectories),
    then creates a pool of worker processes to process each image in parallel.

    Parameters:
    directory (str): The directory path where the .png images are located.
    """
    # Get a list of all .png images in the directory recursively
    image_paths = glob.glob(os.path.join(directory, '**', '*.png'), recursive=True)

    # Create a pool of workers equal to the number of CPU cores
    with Pool() as pool:
        # Map the process_image function to the list of image paths
        pool.map(process_image, image_paths)

if __name__ == "__main__":
    directory = r'E:\training_dir'
    process_directory(directory)
```
