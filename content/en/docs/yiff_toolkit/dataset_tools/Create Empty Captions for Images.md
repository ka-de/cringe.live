---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Create Empty Captions for Images"
summary: "This Python script creates an empty text file with the same name as each image file (.jpg, .png, or .jpeg) present in a specified directory. The script checks if the directory exists, and then iterates through all the image files in the directory."
aliases:
  - /docs/yiff_toolkit/dataset_tools/create-empty-captions-for-images
  - /docs/yiff_toolkit/dataset_tools/create-empty-captions-for-images/
  - /docs/yiff_toolkit/dataset_tools/Create Empty Captions for Images/
  - /docs/yiff_toolkit/dataset_tools/Create Empty Captions for Images
---

<!--markdownlint-disable MD025 -->

# Create Empty Captions for Images

---

This Python script creates an empty text file with the same name as each image file (.jpg, .png, or .jpeg) present in a specified directory. The script checks if the directory exists, and then iterates through all the image files in the directory.

For each image file, it creates a corresponding text file with the same name but with a .txt extension in the same directory, unless a text file with that name already exists.

```python
import os
import glob

def create_empty_txt_files(directory):
    """
    Create empty .txt files for each image in a specified directory.

    This function checks for the existence of a directory and then iterates over all .jpg, .png, and .jpeg files within it.
    For each image file, it creates an empty .txt file with the same name if it doesn't already exist.

    Parameters:
    - directory (str): The path to the directory where the image files are located and where the .txt files will be created.

    Returns:
    None: This function does not return any value.

    Prints:
    - A message indicating that a .txt file has been created or already exists for each image file.
    """
    # Check if the directory exists
    if not os.path.exists(directory):
        print("Directory does not exist.")
        return

    # Get a list of all image files in the directory
    image_files = glob.rglob(os.path.join(directory, "*.jpg")) + \
                  glob.rglob(os.path.join(directory, "*.png")) + \
                  glob.rglob(os.path.join(directory, "*.jpeg"))

    # Iterate over each image file
    for image_file in image_files:
        # Extract the filename without extension
        filename = os.path.splitext(os.path.basename(image_file))[0]

        # Create a corresponding txt file with the same name
        txt_filename = os.path.join(directory, filename + ".txt")

        # Check if the txt file already exists
        if not os.path.exists(txt_filename):
            # Create an empty txt file
            with open(txt_filename, 'w') as f:
                pass
            print(f"Created {txt_filename}")
        else:
            print(f"{txt_filename} already exists")

# Path to the directory containing the images
image_directory = r'C:\Users\kade\Desktop\training_dir_staging\1_by_spaceengine'

# Call the function to create empty txt files
create_empty_txt_files(image_directory)
```

---

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/furrytagger | docs/yiff_toolkit/dataset_tools/Check for Transparency/ | docs/yiff_toolkit/dataset_tools/Check for Large Images/" >}}
