---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Count Images in Folder"
summary: "This script counts the total number of JPEG and PNG images in a specified directory."
aliases:
  - /docs/yiff_toolkit/dataset_tools/count-images-in-folder
  - /docs/yiff_toolkit/dataset_tools/Count Images in Folder
  - /docs/yiff_toolkit/dataset_tools/count-images-in-folder/
  - /docs/yiff_toolkit/dataset_tools/Count Images in Folder/
---

<!--markdownlint-disable MD025 -->

# Count Images in Folder

---

This script counts the total number of JPEG and PNG images in a specified directory.

The script uses the `glob` module to find all files with .jpg, .jpeg, and .png extensions within the given directory and its subdirectories. It then calculates the total count of these image files and prints the result.

To use this script, simply set the `directory_path` variable to the path of the directory you want to process. Then run the script, and it will output the total number of images found.

**NOTE**: Ensure that the directory path uses double backslashes (\\) or raw string literals to avoid escape sequence errors.

```python
from pathlib import Path
import glob

def count_images(directory):
    # Create a Path object for the directory
    path = Path(directory)

    # Use glob to find all jpg, jpeg, and png files
    jpg_files = glob.glob(str(path / '**/*.jpg'), recursive=True)
    jpeg_files = glob.glob(str(path / '**/*.jpeg'), recursive=True)
    png_files = glob.glob(str(path / '**/*.png'), recursive=True)

    # Count the total number of image files
    total_images = len(jpg_files) + len(jpeg_files) + len(png_files)

    return total_images

# Specify the directory path
directory_path = 'E:\\training_dir'

# Call the function and print the result
print(f'Total number of images: {count_images(directory_path)}')
```
