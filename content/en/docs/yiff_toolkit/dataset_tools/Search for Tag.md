---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Search for Tag"
summary: 'This script is used to search for the word "anthrofied" in all .txt files within a specified directory and its subdirectories. It uses multiprocessing to speed up the search by checking multiple files simultaneously.'
---

<!--markdownlint-disable MD025 -->

# Search for Tag

---

This script is used to search for the word "anthrofied" in all .txt files within a specified directory and its subdirectories. It uses multiprocessing
to speed up the search by checking multiple files simultaneously.

```python
import glob
import os
import multiprocessing


def check_file(filename):
    """
    Checks if a .txt file contains the word "anthrofied".

    Args:
        filename (str): The path of the file to check.

    Returns:
        str: The filename if it contains "anthrofied", otherwise None.
    """
    # Skip 'sample-prompts.txt' and '*-sample-prompts.txt' files
    if os.path.basename(filename) == "sample-prompts.txt" or os.path.basename(
        filename
    ).endswith("-sample-prompts.txt"):
        return None
    # Open each text file and check if it contains the word "anthrofied"
    with open(filename, "r", encoding="utf-8") as file:
        content = file.read()
        if "anthrofied" in content:
            return filename
    return None


def check_files(path):
    """
    Searches for the word "anthrofied" in all .txt files within a specified
    directory and its subdirectories.

    Args:
        path (str): The path of the directory to search.
    """
    # Use glob to recursively find all .txt files
    filenames = glob.glob(path + "**/*.txt", recursive=True)

    # Create a pool of processes
    with multiprocessing.Pool() as pool:
        # Use the pool to check each file
        results = pool.map(check_file, filenames)

    # Print the filenames that contain "anthrofied"
    for result in results:
        if result is not None:
            print(result)


if __name__ == "__main__":
    # Call the function with the directory path
    check_files("E:\\training_dir\\")
```
