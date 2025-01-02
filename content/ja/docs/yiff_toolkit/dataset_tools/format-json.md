---
weight: 1
bookFlatSection: false
bookToC: false
title: "🦀 format-json"
summary: "`serde_json`を使用して、単一行のJSONファイルを複数行形式にフォーマットします。"
---

<!--markdownlint-disable MD025 -->

# format-json

---

このコードは、ディレクトリとそのサブディレクトリ内のJSONファイルをフォーマットするために使用されます。
コマンドライン引数としてディレクトリのパスを指定することができます（オプション）。
引数が指定されない場合、デフォルトのディレクトリパスが使用されます。
JSONファイルの解析とフォーマットには`serde_json`クレートを、ディレクトリの再帰的な走査には`walkdir`クレートを使用します。

```rust
use serde_json::Value;
use std::fs;
use std::path::Path;
use std::io::Write;
use walkdir::WalkDir;
use std::env;

// メイン関数はスクリプトを開始します。
// コマンドライン引数を読み取り、ディレクトリパスを設定します。
// その後、WalkDirを使用してディレクトリとそのサブディレクトリを走査します。
// 見つかった各JSONファイルに対して、`format_json_file`を呼び出してフォーマットします。
fn main() {
    // コマンドライン引数を読み取り
    let args: Vec<String> = env::args().collect();
    // ディレクトリパスを設定
    let directory_path = if args.len() > 1 {
        &args[1]
    } else {
        "E:/projects/yiff_toolkit/ponyxl_loras"
    };

    // ディレクトリとそのサブディレクトリを走査
    for entry in WalkDir::new(directory_path) {
        let entry = entry.unwrap();
        let path = entry.path();
        // ファイルがJSONファイルの場合、フォーマットする
        if path.extension().unwrap_or_default() == "json" {
            if let Err(e) = format_json_file(&path) {
                println!("フォーマットに失敗: {}: {e}", path.display());
            }
        }
    }
}

// `format_json_file`関数はJSONファイルをフォーマットします。
// ファイルを読み取り、JSONを解析し、フォーマットして、ファイルに書き戻します。
// これらのステップのいずれかが失敗した場合、エラーを返します。
fn format_json_file(path: &Path) -> Result<(), Box<dyn std::error::Error>> {
    println!("ファイルを処理中: {}", path.display());

    // ファイルを読み取り
    let file_content = fs::read_to_string(&path)?;
    // JSONを解析
    let json: Value = serde_json::from_str(&file_content)?;
    // JSONをフォーマット
    let pretty_json = serde_json::to_string_pretty(&json)?;
    // フォーマットされたJSONをファイルに書き戻し
    let mut file = fs::File::create(&path)?;
    file.write_all(pretty_json.as_bytes())?;

    println!("{}のフォーマットが完了しました。", path.display());
    Ok(())
}
```
