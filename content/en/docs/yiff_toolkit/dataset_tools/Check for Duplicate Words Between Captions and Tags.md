---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Check for Duplicate Words Between Captions and Tags"
summary: "This script traverses through a directory, searches for text files, processes each file to extract tags and captions, and highlights occurrences of tags within captions using random colors, displaying the results in a visually rich format in the terminal."
aliases:
  - /docs/yiff_toolkit/dataset_tools/Check for Duplicate Words Between Captions and Tags/
  - /docs/yiff_toolkit/dataset_tools/Check for Duplicate Words Between Captions and Tags
  - /docs/yiff_toolkit/dataset_tools/check-for-duplicate-words-between-captions-and-tags
  - /docs/yiff_toolkit/dataset_tools/check-for-duplicate-words-between-captions-and-tags/
---

<!--markdownlint-disable MD025 -->

# Check for Duplicate Words Between Captions and Tags

---

This script traverses through a directory, searches for text files, processes each file to extract tags and captions, and highlights occurrences of tags within captions using random colors, displaying the results in a visually rich format in the terminal.

**NOTE**: This script assumes that you separate your tags with `,` and your captions with `.,`.

```python
import os
import random
import re
from rich import print
from rich.console import Console
from rich.table import Table
from rich.style import Style
from rich.color import Color
from rich.box import SIMPLE
from pathlib import Path

def find_files(path, extension):
    """
    Search for files with a given extension within a directory path, excluding 'sample-prompts.txt'
    and files ending with '-sample-prompts.txt'.

    Parameters:
    - path (str): The directory path where the search will be performed.
    - extension (str): The file extension to search for.

    Returns:
    - generator: A generator object that yields Path objects for each found file, excluding the specified files.
    """
    return (file for file in Path(path).rglob(f'**/*{extension}')
            if not file.name.endswith('-sample-prompts.txt') and file.name != 'sample-prompts.txt')


def process_file(file_path):
    """
    Process a single file to find and display duplicate tags in captions.

    This function reads the file, identifies duplicate tags, and uses the Rich library
    to display them in a styled table format.

    Parameters:
    - file_path (Path): The path to the file that will be processed.

    Side Effects:
    - Prints a table to the console with duplicate tags and their associated captions.
    """
    console = Console()
    file_path_printed = False
    duplicates = {}

    with open(file_path, 'r') as file:
        content = file.read()
        elements = content.split(',')
        captions = [element.strip() for element in elements if '.' in element]
        tags = [element.strip() for element in elements if '.' not in element and element.strip() != '']

    for tag in tags:
        pattern = r'\b{}\b'.format(re.escape(tag))

        for caption in captions:
            if re.search(pattern, caption):
                if tag not in duplicates:
                    r, g, b = random.randint(0, 200), random.randint(0, 200), random.randint(0, 200)
                    duplicates[tag] = Style(color=Color.from_rgb(r, g, b), bold=True)

    if duplicates:
        if not file_path_printed:
            table = Table(show_header=True, header_style="bold", expand=True, box=SIMPLE)
            table.add_column("Duplicate Tag", style="cyan", no_wrap=False, width=30)
            table.add_column(f"{file_path}", style="black", no_wrap=False, width=120)
            file_path_printed = True

        for tag, style in duplicates.items():
            for caption in [caption for caption in captions if re.search(r'\b{}\b'.format(re.escape(tag)), caption)]:
                table.add_row(f"[{style}]{tag}[/]", caption.replace(tag, f"[{style}]{tag}[/]"))
                table.add_row(style="black")

        console.print(table)

def main():
    """
    Main function to process all .txt files in a specified directory for duplicate tags.

    The function searches for .txt files in a given directory and processes each file
    to find and display duplicate tags in captions.
    """
    path = 'E:\\training_dir'
    for file_path in find_files(path, '.txt'):
        process_file(file_path)

if __name__ == "__main__":
    main()
```
