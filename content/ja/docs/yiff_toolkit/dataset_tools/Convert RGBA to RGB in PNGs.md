---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Convert RGBA to RGB in PNGs"
summary: "このスクリプトは、指定されたディレクトリ内の`.png`画像をRGBAからRGB形式に変換するプロセスを自動化し、効率を高めるためにマルチプロセッシングを利用します。"
---

<!--markdownlint-disable MD025 -->

# Convert RGBA to RGB in PNGs

---

このスクリプトは、指定されたディレクトリ内の`.png`画像をRGBAからRGB形式に変換するプロセスを自動化し、効率を高めるためにマルチプロセッシングを利用します。

```python
import os
from PIL import Image
import glob
import multiprocessing

# DecompressionBombWarningを防ぐために、画像で許可される最大ピクセル数を設定
Image.MAX_IMAGE_PIXELS = 139211472

def convert_rgba_to_rgb(image_path):
    """
    RGBA画像をRGB形式に変換します。

    この関数は指定されたパスから画像を開き、RGBAモードかどうかをチェックします。
    RGBAモードの場合、画像をRGBモードに変換し、同じパスに保存し直します。
    処理中に発生したエラーはキャッチして出力されます。

    パラメータ：
    - image_path (str): 変換する画像のファイルパス。

    戻り値：
    なし
    """
    try:
        print(f"画像を開いています: {image_path}")
        with Image.open(image_path) as image:
            print(f"画像モード: {image.mode}")
            if image.mode == "RGBA":
                rgb_image = image.convert("RGB")
                rgb_image.save(image_path)
                print(f"{image_path}をRGBに変換しました。")
            else:
                print(f"{image_path}はRGBA画像ではありません。")
    except Exception as e:
        print(f"{image_path}の処理中にエラーが発生: {e}")

def main():
    """
    ディレクトリ内のすべてのRGBA画像をRGBに変換するメイン関数。

    この関数は指定されたディレクトリとそのサブディレクトリ内のすべての.pngファイルを検索します。
    その後、利用可能なCPUの数に等しいプロセスのプールを作成し、それらを使用して
    各RGBA画像を同時にRGB形式に変換します。

    戻り値：
    なし
    """
    directory = r"E:\training_dir"
    print(f"ディレクトリを設定: {directory}")

    # ディレクトリ内のすべての.pngファイルを再帰的に取得
    files = glob.glob(os.path.join(directory, "**", "*.png"), recursive=True)
    print(f"ディレクトリとサブディレクトリ内で{len(files)}個の.pngファイルが見つかりました。")

    # 利用可能なCPUに基づいてプロセス数を決定
    num_processes = multiprocessing.cpu_count()
    print(f"プロセス数を利用可能なCPUの数に設定: {num_processes}")

    # プロセスのプールを作成
    with multiprocessing.Pool(num_processes) as pool:
        print("プロセスのプールを作成しました。")
        # convert_rgba_to_rgb関数をファイルにマッピング
        pool.map(convert_rgba_to_rgb, files)

    print("変換が完了しました。")


if __name__ == "__main__":
    main()
```

---

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/replace-transparency-with-black | docs/yiff_toolkit/dataset_tools/Check for Large Images/ | docs/yiff_toolkit/dataset_tools/count-images-in-folder" >}}
