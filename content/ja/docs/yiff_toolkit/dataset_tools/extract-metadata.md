---
weight: 1
bookFlatSection: false
bookToC: false
title: "🦀 extract-metadata"
summary: "`safetensors`ファイルを処理し、メタデータを抽出し、JSONオブジェクトに変換して、新しいファイルに書き込みます。個別のファイルまたはディレクトリ内のすべての`safetensors`ファイルを処理できます。"
---

<!--markdownlint-disable MD025 -->

# extract-metadata

---

このスクリプトは、`safetensors`形式のファイルを処理するRustで書かれたコマンドラインユーティリティです。スクリプトはファイル名またはディレクトリを引数として受け取ります。引数がディレクトリの場合、再帰的にディレクトリを走査し、`.safetensors`拡張子を持つすべてのファイルを処理します。各ファイルに対して、ファイルを開き、効率的なアクセスのためにメモリにマッピングし、`SafeTensors::read_metadata`関数を使用してファイルからメタデータを読み取ります。

メタデータはJSONオブジェクトに変換されます。メタデータにPythonのリテラル（「True」、「False」、「None」など）が含まれている場合、これらはJSONの同等の値に変換されます。その他のすべての値は文字列として扱われます。JSONオブジェクトはコンソールに整形出力され、また元のファイルと同じ名前で`.json`拡張子を持つ新しいファイルに書き込まれます。ファイルの処理中にエラーが発生した場合、標準エラーストリームに出力され、スクリプトは次のファイルの処理を続行します。スクリプトは未処理のエラーに遭遇せずに完了した場合、成功ステータスを返します。

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
        "メタデータを読み取れません"
    )?;
    let metadata = metadata.metadata().as_ref().context("メタデータが利用できません")?;

    let mut kv = Map::with_capacity(metadata.len());
    for (key, value) in metadata {
        let json_value = serde_json::from_str(value).unwrap_or_else(|_| {
            // いくつかのPythonリテラルを変換し、それ以外は文字列として解釈
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

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/e621-json-to-caption | docs/yiff_toolkit/dataset_tools/format-json-files | docs/yiff_toolkit/dataset_tools/format-json" >}}
