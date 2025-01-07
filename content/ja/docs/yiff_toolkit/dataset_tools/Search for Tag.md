---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Search for Tag"
summary: 'このスクリプトは、指定されたディレクトリとそのサブディレクトリ内のすべての.txtファイルから"anthrofied"という単語を検索するために使用されます。複数のファイルを同時にチェックすることで、マルチプロセッシングを使用して検索を高速化します。'
---

<!--markdownlint-disable MD025 -->

# Search for Tag

---

このスクリプトは、指定されたディレクトリとそのサブディレクトリ内のすべての.txtファイルから"anthrofied"という単語を検索するために使用されます。複数のファイルを同時にチェックすることで、マルチプロセッシングを使用して検索を高速化します。

```python
import glob
import os
import multiprocessing


def check_file(filename):
    """
    .txtファイルに"anthrofied"という単語が含まれているかチェックします。

    引数：
        filename (str): チェックするファイルのパス。

    戻り値：
        str: "anthrofied"が含まれている場合はファイル名、それ以外はNone。
    """
    # 'sample-prompts.txt'と'*-sample-prompts.txt'ファイルをスキップ
    if os.path.basename(filename) == "sample-prompts.txt" or os.path.basename(
        filename
    ).endswith("-sample-prompts.txt"):
        return None
    # 各テキストファイルを開いて"anthrofied"という単語が含まれているかチェック
    with open(filename, "r", encoding="utf-8") as file:
        content = file.read()
        if "anthrofied" in content:
            return filename
    return None


def check_files(path):
    """
    指定されたディレクトリとそのサブディレクトリ内のすべての.txtファイルから
    "anthrofied"という単語を検索します。

    引数：
        path (str): 検索するディレクトリのパス。
    """
    # globを使用して.txtファイルを再帰的に検索
    filenames = glob.glob(path + "**/*.txt", recursive=True)

    # プロセスのプールを作成
    with multiprocessing.Pool() as pool:
        # プールを使用して各ファイルをチェック
        results = pool.map(check_file, filenames)

    # "anthrofied"を含むファイル名を表示
    for result in results:
        if result is not None:
            print(result)


if __name__ == "__main__":
    # ディレクトリパスを指定して関数を呼び出し
    check_files("E:\\training_dir\\")
```

---

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/Check for Large Images/ | docs/yiff_toolkit/dataset_tools/newlines-to-commas | docs/yiff_toolkit/dataset_tools/Check for Transparency/" >}}
