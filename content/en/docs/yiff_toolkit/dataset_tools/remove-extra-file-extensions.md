---
weight: 1
bookFlatSection: false
bookToC: false
title: "🦀 remove-extra-file-extensions"
summary: "This Rust script renames text files in a specified directory by removing any extra image extensions (`.jpeg`, `.png`, or `.jpg`) from their names."
aliases:
  - /docs/yiff_toolkit/dataset_tools/remove-extra-file-extensions
  - /docs/yiff_toolkit/dataset_tools/remove-extra-file-extensions/
  - /docs/yiff_toolkit/dataset_tools/Remove Extra File Extensions/
  - /docs/yiff_toolkit/dataset_tools/Remove Extra File Extensions
---

<!--markdownlint-disable MD025 -->

# remove-extra-file-extensions

---

This Rust script renames text files in a specified directory by removing any extra image extensions (`.jpeg`, `.png`, or `.jpg`) from their names.

```rust
use std::env;
use std::fs;
use walkdir::WalkDir;

fn main() {
    // Get the directory from the command line argument, or use the default one
    let args: Vec<String> = env::args().collect();
    let dir = if args.len() > 1 { &args[1] } else { "E:/training_dir_staging" };

    // Walk through the directory recursively
    for entry in WalkDir::new(dir) {
        let entry = entry.unwrap();
        let path = entry.path();

        // If the file is a .txt file
        if path.extension().unwrap_or_default() == "txt" {
            let old_name = path.to_str().unwrap();

            // If the file name contains an extra image extension
            if old_name.contains(".jpeg") || old_name.contains(".png") || old_name.contains(".jpg") {
                let new_name = old_name
                    .replace(".jpeg", "")
                    .replace(".png", "")
                    .replace(".jpg", "");

                // Rename the file
                fs::rename(old_name, &new_name).unwrap();
                println!("Renamed {old_name} to {new_name}");
            }
        }
    }
}
```

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/count-images-in-folder | docs/yiff_toolkit/dataset_tools/create-empty-captions-for-images | docs/yiff_toolkit/dataset_tools/Check for Transparency/" >}}
