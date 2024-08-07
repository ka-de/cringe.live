---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 e621 JSON to Caption"
summary: "This Python script is designed to process JSON files found within a specified directory and its subdirectories. Each JSON file is expected to contain data related to image posts sourced from e621.net or e6ai.net. The script parses these JSON files, extracts relevant information such as image URL, ratings, and tags, and generates caption files (`.txt`) based on this data."
---

<!--markdownlint-disable MD025 -->

# e621 JSON to Caption

---

This Python script is designed to process JSON files found within a specified directory and its subdirectories. Each JSON file is expected to contain data related to image posts sourced from e621.net or e6ai.net. The script parses these JSON files, extracts relevant information such as image URL, ratings, and tags, and generates caption files (`.txt`) based on this data.

Here's a breakdown of what the script does:

1. **Ignoring Tags**: The script defines a list of tags to be ignored during processing, such as "hi res", "shaded", etc.

2. **Processing Files**: The `process_file` function is responsible for processing each JSON file. It reads the JSON data, extracts the URL of the image file, determines its rating, and extracts tags associated with the image.

3. **Generating Caption File**: For each image, a caption file is generated with the same name as the image file but with a .txt extension. The rating of the image is written first, followed by processed tags.

4. **Processing Tags**: Tags are processed to replace underscores with spaces and to handle special cases such as artist tags. Ignored tags are filtered out.

```python
import os
import glob
import re
import json
from rich.console import Console
from rich.table import Table

console = Console()

# Define tags to be ignored using regular expressions for exact matching
ignored_tags = [r"\bblizzard entertainment\b", r"\bwarcraft\b",
    r"(?:\d{4})|(?:\d+:\d+)",
    r"\bdetailed\b", r"\bwidescreen\b", r"\b4k\b",
    r"\babsurd res\b", r"\bhi res\b", r"\bshaded\b",  r"\bdetailed\b",
    r"\btagme\b",
    r"\bdota\b",
    r"\bcreative commons\b", r"\bcc-by-nc-nd\b",
    r"\bsquare enix\b", r"\bfinal fantasy xiv\b", r"\bfinal fantasy\b",
    r"\bmythological canine\b", r"\basian mythology\b", r"\bmythological scalie\b",
    r"\bancient pokemon\b", r"\bmythological creature\b", r"\blegendary pokemon\b",
    r"\bfelis\b", r"\bfelid\b",
    r"\bsega\b",
    r"\bhasbro\b",
    r"\bzootopia\b",
    r"\bfive nights at freddy's\b",
    r"\beeveelution\b",
    r"\bdisney\b",
    r"\bmammal\b", r"\bcanis\b", r"\bcanine\b", r"\bcanid\b",
    r"\bdigimon\b", r"\bbandai namco\b",
    r"\bpokemon (species)\b",
    r"\bpal (species)\b",
    r"\bpokemon\b", r"\bnintendo\b",
    r"\\bby conditional dnp\\b",
    r"\\bconditional dnp\\b",
    r"\\bconditional_dnp\\b",
    r"\\bby\\s+conditional\\s+dnp\\b",
    r"\bgeneration\s+\d+\s+pokemon\b",
]

def should_ignore_tag(tag, all_tags):
    """
    Determine if a tag should be ignored based on predefined patterns.

    Parameters:
    - tag (str): The tag to be checked.
    - all_tags (list): A list of all tags to check against the ignored patterns.

    Returns:
    - bool: True if the tag matches any ignored pattern, False otherwise.
    """
    for ignored_tag_pattern in ignored_tags:
        pattern = re.compile(ignored_tag_pattern, re.VERBOSE | re.IGNORECASE)
        if any(re.search(pattern, t) for t in all_tags):
            return True
    return False


def process_tags(tags_dict):
    """
    Process tags from a dictionary, replacing underscores with spaces and filtering
    out ignored tags.

    Parameters:
    - tags_dict (dict): A dictionary with categories as keys and lists of tags as values.

    Returns:
    - list: A list of processed tags.
    """
    processed_tags = []
    for category, tags_list in tags_dict.items():
        category_tags = []
        if category == "artist":
            category_tags = [
                f"by {tag.replace('_', ' ').replace(' (artist)', '')}"
                for tag in tags_list
                if tag
            ]
        else:
            for tag in tags_list:
                tag = tag.replace("_", " ")
                tag = re.sub(r"(?<!\\)\(", r"\(", tag)
                tag = re.sub(r"(?<!\\)\)", r"\)", tag)
                if tag.lower() == "artist":
                    continue
                if not should_ignore_tag(tag, ignored_tags):
                    category_tags.append(tag)
        processed_tags.extend(category_tags)
    return processed_tags


def process_file(file_path):
    """
    Process a JSON file, extracting the image URL, rating, and tags to generate
    a caption file.

    Parameters:
    - file_path (str): The path to the JSON file to be processed.
    """
    try:
        console.print(f"Processing file: [bold]{file_path}[/bold]")
        with open(file_path, "r") as f:
            data = json.load(f)
        # Parse the URL and generate filename
        post_data = data.get("post", {})
        file_data = post_data.get("file", {})
        url = file_data.get("url")
        if url:
            filename, ext = os.path.splitext(os.path.basename(url))
            # Create caption file
            caption_file = f"{filename}.txt"
            caption_path = os.path.join(os.path.dirname(file_path), caption_file)
            with open(caption_path, "w", encoding="utf-8") as f:
                # Write rating
                rating = post_data.get("rating", "q")
                if rating == "s":
                    f.write("rating_safe, ")
                elif rating == "e":
                    f.write("rating_explicit, ")
                else:
                    f.write("rating_questionable, ")
                # Process tags
                tags_data = post_data.get("tags", {})
                processed_tags = process_tags(tags_data)
                # Check if there are any valid tags before writing
                if processed_tags:
                    # Join tags with commas and write to file
                    tags_line = ", ".join(processed_tags)
                    f.write(tags_line.strip())

                    # Create a table
                    table = Table(show_header=True, header_style="bold magenta")
                    table.add_column(caption_path, justify="center")

                    table.add_row(tags_line.strip())

                    # Print the table
                    console.print(table)
    except Exception as e:
        console.print(f"Error processing file: [bold]{file_path}[/bold]")
        console.print(e)


def recursive_process(directory):
    """
    Recursively process all JSON files in a directory and its subdirectories.

    Parameters:
    - directory (str): The root directory to start processing from.
    """
    for file_path in glob.glob(directory + "/**/*.json", recursive=True):
        process_file(file_path)


if __name__ == "__main__":
    #root_directory = r"E:\training_dir"
    root_directory = r"C:\Users\kade\Desktop\training_dir_staging"
    recursive_process(root_directory)
```
