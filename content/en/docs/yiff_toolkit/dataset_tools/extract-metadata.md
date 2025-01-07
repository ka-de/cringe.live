---
weight: 1
bookFlatSection: false
bookToC: false
title: "🦀 extract-metadata"
summary: "Processes `safetensors` files, extracts their metadata, converts it into a JSON object, and writes the JSON to a new file. It can process individual files or all `safetensors` files in a directory."
aliases:
  - /docs/yiff_toolkit/dataset_tools/extract-metadata
  - /docs/yiff_toolkit/dataset_tools/extract-metadata/
  - /docs/yiff_toolkit/dataset_tools/Extract Metadata/
  - /docs/yiff_toolkit/dataset_tools/Extract Metadata
---

<!--markdownlint-disable MD025 -->

# extract-metadata

---

This script is a command-line utility written in Rust that processes files in the `safetensors` format. The script takes a filename or a directory as an argument. If the argument is a directory, it recursively walks through the directory and processes all files with the `.safetensors` extension. For each file, it opens the file, maps it into memory for efficient access, and then reads the metadata from the file using the `SafeTensors::read_metadata` function.

The metadata is then converted into a JSON object. If the metadata contains Python literals such as "True", "False", or "None", these are converted into their JSON equivalents. All other values are treated as strings. The JSON object is then pretty-printed to the console and also written to a new file with the same name as the original but with a `.json` extension. If any errors occur during the processing of a file, they are printed to the standard error stream, and the script continues with the next file. The script returns a success status if it completes without encountering any unhandled errors.

```rust
use std::env;
use std::fs::File;
use std::fs::write;
use std::path::Path;
use safetensors::tensor::SafeTensors;
use memmap2::Mmap;
use serde_json::{ Value, Map };
use anyhow::{ Context, Result };
use walkdir::WalkDir;

fn main() -> Result<()> {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        println!("Usage: {} <filename or directory>", args[0]);
        return Ok(());
    }
    let path = &args[1];
    if Path::new(path).is_dir() {
        for entry in WalkDir::new(path) {
            let entry = entry?;
            if
                entry
                    .path()
                    .extension()
                    .and_then(|s| s.to_str()) == Some("safetensors")
            {
                if let Err(err) = process_file(entry.path()) {
                    eprint!("Error processing {:#?}: {}", entry.path(), err);
                }
            }
        }
    } else {
        process_file(Path::new(path))?;
    }
    Ok(())
}

fn process_file(path: &Path) -> Result<()> {
    let file = File::open(path)?;
    let mmap = unsafe { Mmap::map(&file)? };

    let json = get_json_metadata(&mmap)?;
    let pretty_json = serde_json::to_string_pretty(&json)?;

    println!("{pretty_json}");
    write(path.with_extension("json"), pretty_json)?;
    Ok(())
}

fn get_json_metadata(buffer: &[u8]) -> Result<Value> {
    let (_header_size, metadata) = SafeTensors::read_metadata(&buffer).context(
        "Cannot read metadata"
    )?;
    let metadata = metadata.metadata().as_ref().context("No metadata available")?;

    let mut kv = Map::with_capacity(metadata.len());
    for (key, value) in metadata {
        let json_value = serde_json::from_str(value).unwrap_or_else(|_| {
            // Converts few python literals, then bail out by interpreting the value as a string
            match value.as_str() {
                "True" => Value::Bool(true),
                "False" => Value::Bool(false),
                "None" => Value::Null,
                s => Value::String(s.into()),
            }
        });
        kv.insert(key.clone(), json_value);
    }
    Ok(Value::Object(kv))
}
```

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/e621-json-to-caption | docs/yiff_toolkit/dataset_tools/format-json-files | docs/yiff_toolkit/dataset_tools/format-json" >}}
