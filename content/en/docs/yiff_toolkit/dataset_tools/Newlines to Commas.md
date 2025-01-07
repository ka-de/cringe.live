---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Newlines to Commas"
summary: "Recursively modify the content of `.txt` files in the specified directory and its subdirectories by replacing newlines with commas and spaces."
aliases:
  - /docs/yiff_toolkit/dataset_tools/newlines-to-commas
  - /docs/yiff_toolkit/dataset_tools/newlines-to-commas/
  - /docs/yiff_toolkit/dataset_tools/Newlines to Commas/
  - /docs/yiff_toolkit/dataset_tools/Newlines to Commas
---

<!--markdownlint-disable MD025 -->

# Newlines to Commas

---

Recursively modify the content of `.txt` files in the specified directory and its subdirectories by replacing newlines with commas and spaces.

```python
from pathlib import Path

def process_directory(directory):
    """
    This script is designed to process all text files within a specified directory
    and its subdirectories. It modifies the content of each text file by replacing
    newlines with a comma followed by a space.

    Functions:
        process_directory(directory): Recursively processes all '.txt' files in the given directory.

    Args:
        directory (str): The path to the directory containing the text files to be processed.

    Usage:
        Set the 'directory_path' variable to the path of the target directory and run the script.
        The script will modify all '.txt' files within this directory and its subdirectories.

    Parameters:
    - directory (str): The path to the directory to process.
    """
    # Create a Path object for the directory
    path = Path(directory)

    # Use glob pattern to match all .txt files recursively
    for file_path in path.rglob('*.txt'):
        # Read the content of the file
        with open(file_path, 'r') as file:
            content = file.read()

        # Replace newline with a comma and space
        modified_content = content.replace('\n', ', ')

        # Write the modified content back to the file
        with open(file_path, 'w') as file:
            file.write(modified_content)

# Directory path
directory_path = r'C:\Users\kade\Desktop\training_dir_staging'

# Recursively process the directory and its subdirectories
process_directory(directory_path)
```

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/search-for-tag | docs/yiff_toolkit/dataset_tools/Check for Transparency/ | docs/yiff_toolkit/dataset_tools/e621-json-to-caption" >}}
