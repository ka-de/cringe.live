---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Newlines to Commas"
summary: "指定されたディレクトリとそのサブディレクトリ内の`.txt`ファイルの内容を再帰的に処理し、改行をカンマとスペースに置き換えます。"
---

<!--markdownlint-disable MD025 -->

# Newlines to Commas

---

指定されたディレクトリとそのサブディレクトリ内の`.txt`ファイルの内容を再帰的に処理し、改行をカンマとスペースに置き換えます。

```python
from pathlib import Path

def process_directory(directory):
    """
    このスクリプトは、指定されたディレクトリとそのサブディレクトリ内のすべての
    テキストファイルを処理するように設計されています。各テキストファイルの内容を
    改行をカンマとスペースに置き換えることで修正します。

    関数：
        process_directory(directory): 指定されたディレクトリ内のすべての'.txt'ファイルを再帰的に処理します。

    引数：
        directory (str): 処理するテキストファイルを含むディレクトリのパス。

    使用方法：
        'directory_path'変数を対象ディレクトリのパスに設定してスクリプトを実行します。
        スクリプトはこのディレクトリとそのサブディレクトリ内のすべての'.txt'ファイルを修正します。

    パラメータ：
    - directory (str): 処理するディレクトリのパス。
    """
    # ディレクトリのPathオブジェクトを作成
    path = Path(directory)

    # globパターンを使用して.txtファイルを再帰的にマッチング
    for file_path in path.rglob('*.txt'):
        # ファイルの内容を読み取り
        with open(file_path, 'r') as file:
            content = file.read()

        # 改行をカンマとスペースに置換
        modified_content = content.replace('\n', ', ')

        # 修正された内容をファイルに書き戻し
        with open(file_path, 'w') as file:
            file.write(modified_content)

# ディレクトリパス
directory_path = r'C:\Users\kade\Desktop\training_dir_staging'

# ディレクトリとそのサブディレクトリを再帰的に処理
process_directory(directory_path)
```

---

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/search-for-tag | docs/yiff_toolkit/dataset_tools/Check for Transparency/ | docs/yiff_toolkit/dataset_tools/remove-extra-file-extensions" >}}
