---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Check for Large Images"
summary: "このスクリプトは、指定されたディレクトリとそのサブディレクトリ内のすべての画像の解像度をチェックします。画像の解像度が特定の制限を超える場合、その画像のパスが出力ファイルに書き込まれます。スクリプトはマルチプロセシングを使用してプロセスを高速化します。"
---

<!--markdownlint-disable MD025 -->

# Check for Large Images

---

このスクリプトは、指定されたディレクトリとそのサブディレクトリ内のすべての画像の解像度をチェックします。画像の解像度が特定の制限を超える場合、その画像のパスが出力ファイルに書き込まれます。スクリプトはマルチプロセシングを使用してプロセスを高速化します。

```python
from pathlib import Path
import multiprocessing
import os
from PIL import Image


def check_image_resolution(filepath, output_file):
    """
    画像の解像度をチェックし、解像度が特定の制限を超える場合、その画像のパスをファイルに書き込みます。

    パラメータ：
    filepath (Path): 画像ファイルのパス。
    output_file (str): サイズの大きい画像のパスが書き込まれる出力ファイルのパス。

    戻り値：
    None
    """
    if filepath.suffix in [".jpg", ".jpeg", ".png"]:
        img = Image.open(filepath)
        width, height = img.size
        resolution = width * height
        if resolution > 16777216:
            normalized_path = os.path.normpath(str(filepath))
            print(
                f"画像 {normalized_path} の解像度は {resolution} ピクセルで、16777216 ピクセルを超えています。"
            )
            with open(output_file, "a", encoding="utf-8") as f:
                f.write(f"{normalized_path}\n")


def process_directory(directory, output_file):
    """
    ディレクトリとそのサブディレクトリ内のすべてのファイルを処理します。

    パラメータ：
    directory (str): 処理するディレクトリのパス。
    output_file (str): サイズの大きい画像のパスが書き込まれる出力ファイルのパス。

    戻り値：
    None
    """
    for filepath in Path(directory).rglob("*"):
        check_image_resolution(filepath, output_file)


def main(output_file):
    """
    ワーカープロセスのプールを作成し、process_directory関数を非同期で適用するメイン関数。

    パラメータ：
    output_file (str): サイズの大きい画像のパスが書き込まれる出力ファイルのパス。

    戻り値：
    None
    """
    # 利用可能なCPUコアの数を取得
    num_cores = multiprocessing.cpu_count()

    # ワーカープロセスのプールを作成
    pool = multiprocessing.Pool(num_cores)

    # ディレクトリのパスを指定して関数を呼び出し
    pool.apply_async(process_directory, args=(r"E:\training_dir", output_file))

    # プールを閉じてすべてのタスクの完了を待機
    pool.close()
    pool.join()


if __name__ == "__main__":
    OUTPUT_FILE = "oversized.txt"
    main(OUTPUT_FILE)
```

---

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/Check for Transparency/ | docs/yiff_toolkit/dataset_tools/count-images-in-folder | docs/yiff_toolkit/dataset_tools/furrytagger" >}}
