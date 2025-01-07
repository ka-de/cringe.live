---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Count Images in Folder"
summary: "このスクリプトは、指定されたディレクトリ内のJPEGとPNG画像の総数をカウントします。"
---

<!--markdownlint-disable MD025 -->

# Count Images in Folder

---

このスクリプトは、指定されたディレクトリ内のJPEGとPNG画像の総数をカウントします。

このスクリプトは、`glob`モジュールを使用して、指定されたディレクトリとそのサブディレクトリ内の.jpg、.jpeg、.png拡張子を持つすべてのファイルを検索します。その後、これらの画像ファイルの総数を計算し、結果を出力します。

このスクリプトを使用するには、`directory_path`変数を処理したいディレクトリのパスに設定するだけです。その後、スクリプトを実行すると、見つかった画像の総数が出力されます。

**注意**: エスケープシーケンスのエラーを避けるため、ディレクトリパスには二重バックスラッシュ（\\）またはraw文字列リテラルを使用してください。

```python
from pathlib import Path
import glob

def count_images(directory):
    # ディレクトリのPathオブジェクトを作成
    path = Path(directory)

    # globを使用してすべてのjpg、jpeg、pngファイルを検索
    jpg_files = glob.glob(str(path / '**/*.jpg'), recursive=True)
    jpeg_files = glob.glob(str(path / '**/*.jpeg'), recursive=True)
    png_files = glob.glob(str(path / '**/*.png'), recursive=True)

    # 画像ファイルの総数をカウント
    total_images = len(jpg_files) + len(jpeg_files) + len(png_files)

    return total_images

# ディレクトリパスを指定
directory_path = 'E:\\training_dir'

# 関数を呼び出して結果を出力
print(f'画像の総数: {count_images(directory_path)}')
```

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/dataset_tools/Check for Large Images/ | docs/yiff_toolkit/dataset_tools/Check for Transparency/ | docs/yiff_toolkit/dataset_tools/create-empty-captions-for-images" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
