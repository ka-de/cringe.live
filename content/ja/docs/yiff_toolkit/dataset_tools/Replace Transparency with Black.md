---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Replace Transparency with Black"
summary: "このPythonスクリプトは、指定されたディレクトリ内のすべての`.png`画像を処理し、各画像に黒い層を追加します。効率化のためにマルチプロセッシングを使用して画像を並列処理します。"
---

<!--markdownlint-disable MD025 -->

# Replace Transparency with Black

---

このPythonスクリプトは、指定されたディレクトリ内のすべての`.png`画像を処理し、各画像に黒い層を追加します。効率化のためにマルチプロセッシングを使用して画像を並列処理します。

```python
import os
from PIL import Image
import glob
from multiprocessing import Pool

def add_black_layer(image_path):
    """
    指定されたパスの画像に黒い層を追加し、修正された画像を保存します。

    この関数は画像を開き、'RGBA'モードに変換し、新しい黒い層を作成し、
    元の画像を黒い層の上に貼り付け、結果をディスクに保存します。

    パラメータ：
    image_path (str): 処理する画像のファイルパス。

    例外：
    Exception: 画像の開封または処理中にエラーが発生した場合。
    """
    try:
        with Image.open(image_path) as img:
            # 透明度を処理するために画像を'RGBA'モードにする
            img = img.convert('RGBA')
            black_layer = Image.new('RGBA', img.size, (0, 0, 0, 255))  # 4番目の値はアルファチャンネル
            black_layer.paste(img, (0, 0), img)
            black_layer.save(image_path)
            print(f"{image_path}に黒い層を追加して上書きしました")
    except Exception as e:
        print(f"{image_path}の処理中にエラーが発生: {e}")

def process_image(image_path):
    """
    黒い層を追加して1つの画像を処理します。

    この関数はマルチプロセッシングで使用するように設計されています。'add_black_layer'
    関数を呼び出し、発生する例外を処理します。

    パラメータ：
    image_path (str): 処理する画像のファイルパス。
    """
    try:
        add_black_layer(image_path)
        print(f"{image_path}に黒い層を追加して上書きしました")
    except Exception as e:
        print(f"{image_path}の処理中にエラーが発生: {e}")

def process_directory(directory):
    """
    ディレクトリ内のすべての.png画像を処理し、各画像に黒い層を追加します。

    この関数は指定されたディレクトリ（サブディレクトリを含む）内のすべての.png画像を見つけ、
    ワーカープロセスのプールを作成して各画像を並列処理します。

    パラメータ：
    directory (str): .png画像が配置されているディレクトリのパス。
    """
    # ディレクトリ内のすべての.png画像を再帰的に取得
    image_paths = glob.glob(os.path.join(directory, '**', '*.png'), recursive=True)

    # CPUコアの数に等しいワーカープールを作成
    with Pool() as pool:
        # process_image関数を画像パスのリストにマッピング
        pool.map(process_image, image_paths)

if __name__ == "__main__":
    directory = r'E:\training_dir'
    process_directory(directory)
```

---

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/Convert RGBA to RGB in PNGs/ | docs/yiff_toolkit/dataset_tools/Check for Transparency/ | docs/yiff_toolkit/dataset_tools/Check for Large Images/" >}}
