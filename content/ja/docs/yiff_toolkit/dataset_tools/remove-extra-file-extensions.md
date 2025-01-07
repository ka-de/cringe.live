---
weight: 1
bookFlatSection: false
bookToC: false
title: "🦀 remove-extra-file-extensions"
summary: "このRustスクリプトは、指定されたディレクトリ内のテキストファイルから余分な画像拡張子（`.jpeg`、`.png`、または`.jpg`）を削除してリネームします。"
---

<!--markdownlint-disable MD025 -->

# remove-extra-file-extensions

---

このRustスクリプトは、指定されたディレクトリ内のテキストファイルから余分な画像拡張子（`.jpeg`、`.png`、または`.jpg`）を削除してリネームします。

```rust
use std::env;
use std::fs;
use walkdir::WalkDir;

fn main() {
    // コマンドライン引数からディレクトリを取得、または既定のものを使用
    let args: Vec<String> = env::args().collect();
    let dir = if args.len() > 1 { &args[1] } else { "E:/training_dir_staging" };

    // ディレクトリを再帰的に走査
    for entry in WalkDir::new(dir) {
        let entry = entry.unwrap();
        let path = entry.path();

        // ファイルが.txtファイルの場合
        if path.extension().unwrap_or_default() == "txt" {
            let old_name = path.to_str().unwrap();

            // ファイル名に余分な画像拡張子が含まれている場合
            if old_name.contains(".jpeg") || old_name.contains(".png") || old_name.contains(".jpg") {
                let new_name = old_name
                    .replace(".jpeg", "")
                    .replace(".png", "")
                    .replace(".jpg", "");

                // ファイルをリネーム
                fs::rename(old_name, &new_name).unwrap();
                println!("{old_name}を{new_name}にリネームしました");
            }
        }
    }
}
```

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/dataset_tools/count-images-in-folder | docs/yiff_toolkit/dataset_tools/create-empty-captions-for-images | docs/yiff_toolkit/dataset_tools/Check for Transparency/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
