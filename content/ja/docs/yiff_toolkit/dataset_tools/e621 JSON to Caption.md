---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 e621 JSON to Caption"
summary: "このPythonスクリプトは、指定されたディレクトリとそのサブディレクトリ内のJSONファイルを処理するように設計されています。各JSONファイルには、e621.netまたはe6ai.netから取得した画像投稿に関連するデータが含まれていることを想定しています。スクリプトはこれらのJSONファイルを解析し、画像URL、レーティング、タグなどの関連情報を抽出し、このデータに基づいてキャプションファイル（`.txt`）を生成します。"
---

<!--markdownlint-disable MD025 -->

# e621 JSON to Caption

---

このPythonスクリプトは、指定されたディレクトリとそのサブディレクトリ内のJSONファイルを処理するように設計されています。各JSONファイルには、e621.netまたはe6ai.netから取得した画像投稿に関連するデータが含まれていることを想定しています。スクリプトはこれらのJSONファイルを解析し、画像URL、レーティング、タグなどの関連情報を抽出し、このデータに基づいてキャプションファイル（`.txt`）を生成します。

以下がスクリプトの機能の内訳です：

1. **タグの無視**: スクリプトは処理中に無視するタグのリストを定義します（例：「hi res」、「shaded」など）。

2. **ファイルの処理**: `process_file`関数は各JSONファイルの処理を担当します。JSONデータを読み取り、画像ファイルのURLを抽出し、そのレーティングを判断し、画像に関連付けられたタグを抽出します。

3. **キャプションファイルの生成**: 各画像に対して、画像ファイルと同じ名前で.txt拡張子を持つキャプションファイルが生成されます。まず画像のレーティングが書き込まれ、その後に処理されたタグが続きます。

4. **タグの処理**: タグはアンダースコアをスペースに置き換え、アーティストタグなどの特殊なケースを処理します。無視するタグはフィルタリングされます。

```python
import os
import glob
import re
import json
from rich.console import Console
from rich.table import Table

console = Console()

# 正規表現を使用して無視するタグを定義（完全一致）
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
    事前定義されたパターンに基づいてタグを無視すべきかどうかを判断します。

    パラメータ：
    - tag (str): チェックするタグ。
    - all_tags (list): 無視パターンに対してチェックするすべてのタグのリスト。

    戻り値：
    - bool: タグが無視パターンのいずれかに一致する場合はTrue、それ以外はFalse。
    """
    for ignored_tag_pattern in ignored_tags:
        pattern = re.compile(ignored_tag_pattern, re.VERBOSE | re.IGNORECASE)
        if any(re.search(pattern, t) for t in all_tags):
            return True
    return False


def process_tags(tags_dict):
    """
    辞書からタグを処理し、アンダースコアをスペースに置き換え、無視するタグを
    フィルタリングします。

    パラメータ：
    - tags_dict (dict): カテゴリをキーとし、タグのリストを値とする辞書。

    戻り値：
    - list: 処理されたタグのリスト。
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
    JSONファイルを処理し、画像URL、レーティング、タグを抽出して
    キャプションファイルを生成します。

    パラメータ：
    - file_path (str): 処理するJSONファイルのパス。
    """
    try:
        console.print(f"ファイルを処理中: [bold]{file_path}[/bold]")
        with open(file_path, "r") as f:
            data = json.load(f)
        # URLを解析してファイル名を生成
        post_data = data.get("post", {})
        file_data = post_data.get("file", {})
        url = file_data.get("url")
        if url:
            filename, ext = os.path.splitext(os.path.basename(url))
            # キャプションファイルを作成
            caption_file = f"{filename}.txt"
            caption_path = os.path.join(os.path.dirname(file_path), caption_file)
            with open(caption_path, "w", encoding="utf-8") as f:
                # レーティングを書き込み
                rating = post_data.get("rating", "q")
                if rating == "s":
                    f.write("rating_safe, ")
                elif rating == "e":
                    f.write("rating_explicit, ")
                else:
                    f.write("rating_questionable, ")
                # タグを処理
                tags_data = post_data.get("tags", {})
                processed_tags = process_tags(tags_data)
                # 有効なタグがあるか確認してから書き込み
                if processed_tags:
                    # タグをカンマで結合してファイルに書き込み
                    tags_line = ", ".join(processed_tags)
                    f.write(tags_line.strip())

                    # テーブルを作成
                    table = Table(show_header=True, header_style="bold magenta")
                    table.add_column(caption_path, justify="center")

                    table.add_row(tags_line.strip())

                    # テーブルを表示
                    console.print(table)
    except Exception as e:
        console.print(f"ファイルの処理中にエラーが発生: [bold]{file_path}[/bold]")
        console.print(e)


def recursive_process(directory):
    """
    ディレクトリとそのサブディレクトリ内のすべてのJSONファイルを再帰的に処理します。

    パラメータ：
    - directory (str): 処理を開始するルートディレクトリ。
    """
    for file_path in glob.glob(directory + "/**/*.json", recursive=True):
        process_file(file_path)


if __name__ == "__main__":
    #root_directory = r"E:\training_dir"
    root_directory = r"C:\Users\kade\Desktop\training_dir_staging"
    recursive_process(root_directory)
```

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/format-json-files | docs/yiff_toolkit/dataset_tools/extract-metadata | docs/yiff_toolkit/dataset_tools/furrytagger" >}}
