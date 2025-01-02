---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 Create Empty Captions for Images"
summary: "このPythonスクリプトは、指定されたディレクトリ内の各画像ファイル（.jpg、.png、または.jpeg）と同じ名前の空のテキストファイルを作成します。スクリプトはディレクトリの存在を確認し、ディレクトリ内のすべての画像ファイルを反復処理します。"
---

<!--markdownlint-disable MD025 -->

# Create Empty Captions for Images

---

このPythonスクリプトは、指定されたディレクトリ内の各画像ファイル（.jpg、.png、または.jpeg）と同じ名前の空のテキストファイルを作成します。スクリプトはディレクトリの存在を確認し、ディレクトリ内のすべての画像ファイルを反復処理します。

各画像ファイルに対して、同じ名前で.txt拡張子を持つ対応するテキストファイルを同じディレクトリに作成します（その名前のテキストファイルがまだ存在しない場合）。

```python
import os
import glob

def create_empty_txt_files(directory):
    """
    指定されたディレクトリ内の各画像に対して空の.txtファイルを作成します。

    この関数はディレクトリの存在を確認し、その中のすべての.jpg、.png、.jpegファイルを反復処理します。
    各画像ファイルに対して、まだ存在しない場合は同じ名前の空の.txtファイルを作成します。

    パラメータ：
    - directory (str): 画像ファイルが配置され、.txtファイルが作成されるディレクトリのパス。

    戻り値：
    なし: この関数は値を返しません。

    出力：
    - 各画像ファイルに対して、.txtファイルが作成されたか、すでに存在することを示すメッセージを表示します。
    """
    # ディレクトリが存在するか確認
    if not os.path.exists(directory):
        print("ディレクトリが存在しません。")
        return

    # ディレクトリ内のすべての画像ファイルのリストを取得
    image_files = glob.rglob(os.path.join(directory, "*.jpg")) + \
                  glob.rglob(os.path.join(directory, "*.png")) + \
                  glob.rglob(os.path.join(directory, "*.jpeg"))

    # 各画像ファイルを反復処理
    for image_file in image_files:
        # 拡張子なしのファイル名を抽出
        filename = os.path.splitext(os.path.basename(image_file))[0]

        # 同じ名前の対応するtxtファイルを作成
        txt_filename = os.path.join(directory, filename + ".txt")

        # txtファイルがすでに存在するか確認
        if not os.path.exists(txt_filename):
            # 空のtxtファイルを作成
            with open(txt_filename, 'w') as f:
                pass
            print(f"{txt_filename}を作成しました")
        else:
            print(f"{txt_filename}はすでに存在します")

# 画像を含むディレクトリへのパス
image_directory = r'C:\Users\kade\Desktop\training_dir_staging\1_by_spaceengine'

# 空のtxtファイルを作成する関数を呼び出し
create_empty_txt_files(image_directory)
```
