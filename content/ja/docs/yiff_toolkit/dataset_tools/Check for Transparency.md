---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Check for Transparency"
summary: "このスクリプトは指定されたディレクトリを再帰的に走査し、拡張子が`.png`の画像ファイルを特定します。特定された各画像に対して、PILを使用してそのモードを調べることで透明度があるかどうかをチェックします。"
---

<!--markdownlint-disable MD025 -->

# Check for Transparency

---

このスクリプトは指定されたディレクトリを再帰的に走査し、拡張子が`.png`の画像ファイルを特定します。特定された各画像に対して、PILを使用してそのモードを調べることで透明度があるかどうかをチェックします。

```python
import os
from PIL import Image
import glob

# 許可される最大ピクセル数を増やすか、Noneに設定してチェックを無効化
Image.MAX_IMAGE_PIXELS = 139211472

def check_transparency(image_path):
    """
    指定された画像に透明度があるかどうかをチェックします。

    パラメータ：
    image_path (str): 画像のファイルパス。

    戻り値：
    bool: 画像に透明度がある場合（モードが'RGBA'）はTrue、それ以外はFalse。
    """
    try:
        image = Image.open(image_path)
        if image.mode == 'RGBA':
            return True
    except Exception as e:
        print(f"{image_path}の処理中にエラーが発生: {e}")
    return False

def main():
    """
    指定されたディレクトリ内の透明度を持つすべての画像を見つけて出力するメイン関数。
    """
    directory = r'E:\training_dir'
    transparent_images = []

    # globを使用してディレクトリ内のすべての.pngファイルを再帰的に検索
    for file_path in glob.glob(os.path.join(directory, '**', '*.png'), recursive=True):
        if check_transparency(file_path):
            transparent_images.append(file_path)

    # 結果を出力
    if transparent_images:
        print("透明度を持つ画像：")
        for img in transparent_images:
            print(img)
    else:
        print("データセットに透明度を持つ画像はありません！")

if __name__ == "__main__":
    main()
```
