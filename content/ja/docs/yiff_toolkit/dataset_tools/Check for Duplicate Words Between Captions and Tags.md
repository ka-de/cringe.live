---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Check for Duplicate Words Between Captions and Tags"
summary: "このスクリプトは、ディレクトリを走査してテキストファイルを検索し、各ファイルを処理してタグとキャプションを抽出し、ランダムな色を使用してキャプション内のタグの出現を強調表示し、結果を視覚的に豊かな形式でターミナルに表示します。"
---

<!--markdownlint-disable MD025 -->

# Check for Duplicate Words Between Captions and Tags

---

このスクリプトは、ディレクトリを走査してテキストファイルを検索し、各ファイルを処理してタグとキャプションを抽出し、ランダムな色を使用してキャプション内のタグの出現を強調表示し、結果を視覚的に豊かな形式でターミナルに表示します。

**注意**: このスクリプトは、タグを`,`で、キャプションを`.,`で区切ることを前提としています。

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
    ディレクトリパス内で指定された拡張子を持つファイルを検索します。'sample-prompts.txt'と
    '-sample-prompts.txt'で終わるファイルは除外されます。

    パラメータ：
    - path (str): 検索を実行するディレクトリパス。
    - extension (str): 検索する拡張子。

    戻り値：
    - generator: 指定されたファイルを除外した、見つかった各ファイルのPathオブジェクトを生成するジェネレータ。
    """
    return (file for file in Path(path).rglob(f'**/*{extension}')
            if not file.name.endswith('-sample-prompts.txt') and file.name != 'sample-prompts.txt')


def process_file(file_path):
    """
    単一のファイルを処理して、キャプション内の重複タグを見つけて表示します。

    この関数はファイルを読み取り、重複タグを特定し、Richライブラリを使用して
    スタイル付きのテーブル形式で表示します。

    パラメータ：
    - file_path (Path): 処理するファイルのパス。

    副作用：
    - 重複タグとそれに関連するキャプションをテーブルとしてコンソールに出力します。
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
            table.add_column("重複タグ", style="cyan", no_wrap=False, width=30)
            table.add_column(f"{file_path}", style="black", no_wrap=False, width=120)
            file_path_printed = True

        for tag, style in duplicates.items():
            for caption in [caption for caption in captions if re.search(r'\b{}\b'.format(re.escape(tag)), caption)]:
                table.add_row(f"[{style}]{tag}[/]", caption.replace(tag, f"[{style}]{tag}[/]"))
                table.add_row(style="black")

        console.print(table)

def main():
    """
    指定されたディレクトリ内のすべての.txtファイルを処理して重複タグを検索するメイン関数。

    この関数は指定されたディレクトリ内の.txtファイルを検索し、各ファイルを処理して
    キャプション内の重複タグを見つけて表示します。
    """
    path = 'E:\\training_dir'
    for file_path in find_files(path, '.txt'):
        process_file(file_path)

if __name__ == "__main__":
    main()
```

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/e621-json-to-caption | docs/yiff_toolkit/dataset_tools/furrytagger | docs/yiff_toolkit/lora_training/NoobAI/" >}}
