---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 FurryTagger"
summary: "`eva02-vit-large-448-8046`をロードし、指定されたディレクトリ内の画像セットに適用して、各画像のモデル出力タグをテキストファイルに書き込みます。"
---

<!--markdownlint-disable MD025 -->

# FurryTagger

---

事前学習済みモデル（`eva02-vit-large-448-8046`）を指定されたディレクトリ内の画像セットに適用し、各画像に対するモデルの出力タグをテキストファイルに書き込みます。スクリプトはまずモデルをロードして評価モードに設定します。次に、リサイズ、テンソル変換、正規化を含む画像変換を定義します。また、WebP画像をPNGに変換し、アルファチャンネルを黒で置き換えるなど、特定の画像形式も処理します。その後、各画像にモデルを適用し、各タグの確率を計算し、一定のしきい値を超えるタグをテキストファイルに書き込みます。スクリプトは無視するタグの処理や、特定のタグを対応するものに置き換えることも行います。

```python
import os
import torch
from torchvision import transforms
from PIL import Image
import json
import re

# タグ選択のしきい値を設定
THRESHOLD = 0.3

# 画像を含むディレクトリとモデルのパスを定義
image_dir = r"./images"
model_path = r"./model.pth"

# 無視するタグのセットを定義
ignored_tags = {"grandfathered content"}

# CUDAが利用可能な場合はGPUを使用、そうでない場合はCPUを使用
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# モデルをロードして評価モードに設定
model = torch.load(model_path, map_location=device)
model = model.to(device)
model.eval()

# 画像変換を定義
transform = transforms.Compose(
    [
        # 画像を448x448にリサイズ
        transforms.Resize((448, 448)),
        # 画像をPyTorchテンソルに変換
        transforms.ToTensor(),
        # 指定された平均値と標準偏差で画像を正規化
        transforms.Normalize(
            mean=[0.48145466, 0.4578275, 0.40821073],
            std=[0.26862954, 0.26130258, 0.27577711],
        ),
    ]
)

# JSONファイルからタグを読み込み
with open("tags_8041.json", "r", encoding="utf8") as file:
    tags = json.load(file)
allowed_tags = sorted(tags)

# プレースホルダーと露出度タグを許可タグリストに追加
allowed_tags.insert(0, "placeholder0")
allowed_tags.append("placeholder1")
allowed_tags.append("explicit")
allowed_tags.append("questionable")
allowed_tags.append("safe")

# 許可する画像拡張子を定義
image_exts = [".jpg", ".jpeg", ".png"]

for filename in os.listdir(image_dir):
    # ファイルがWebP画像かどうかを確認
    if filename.endswith(".webp"):
        # 入力と出力のファイルパスを構築
        input_path = os.path.join(image_dir, filename)
        output_path = os.path.join(image_dir, os.path.splitext(filename)[0] + ".png")

        # WebP画像を開いてPNGとして保存
        image = Image.open(input_path)
        image.save(output_path, "PNG")
        print(f"{filename}を{os.path.basename(output_path)}に変換しました")

        # 元のWebP画像を削除
        os.remove(input_path)
        print(f"{filename}を削除しました")

# ディレクトリ内の画像ファイルのリストを取得
image_files = [
    file
    for file in os.listdir(image_dir)
    if os.path.splitext(file)[1].lower() in image_exts
]

for image_filename in image_files:
    image_path = os.path.join(image_dir, image_filename)

    # 画像を開く
    img = Image.open(image_path)

    # 画像にアルファチャンネルがある場合、黒で置き換え
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        alpha = Image.new(
            "L", img.size, 0
        )  # モード'L'（8ビットグレースケール）でアルファ画像を作成
        alpha = alpha.convert(img.mode)  # アルファ画像をimgと同じモードに変換
        img = Image.alpha_composite(alpha, img)

    # 画像をRGBに変換
    img = img.convert("RGB")

    # 変換を適用してテンソルをデバイスに移動
    tensor = transform(img).unsqueeze(0).to(device)

    # モデルを通して順伝播を行い、出力を取得
    with torch.no_grad():
        out = model(tensor)

    # シグモイド関数を出力に適用して確率を取得
    probabilities = torch.sigmoid(out[0])

    # しきい値を超える確率を持つタグのインデックスを取得
    indices = torch.where(probabilities > THRESHOLD)[0]
    values = probabilities[indices]

    # インデックスを対応する確率で降順にソート
    sorted_indices = torch.argsort(values, descending=True)

    # ソートされたインデックスに対応するタグを取得し、無視するタグを除外してアンダースコアをスペースに置換
    tags_to_write = [
        allowed_tags[indices[i]].replace("_", " ")
        for i in sorted_indices
        if allowed_tags[indices[i]] not in ignored_tags
        and allowed_tags[indices[i]] not in ("placeholder0", "placeholder1")
    ]

    # 'safe'、'explicit'、'questionable'をそれぞれ'rating_'付きの形式に置換
    tags_to_write = [
        tag.replace("safe", "rating_safe")
        .replace("explicit", "rating_explicit")
        .replace("questionable", "rating_questionable")
        for tag in tags_to_write
    ]

    # タグ内のエスケープされていない括弧をエスケープ
    tags_to_write_escaped = [
        re.sub(r"(?<!\\)(\(|\))", r"\\\1", tag) for tag in tags_to_write
    ]

    # フィルタリングとエスケープされたタグを含むテキストファイルを各画像に対して作成
    text_filename = os.path.splitext(image_filename)[0] + ".txt"
    text_path = os.path.join(image_dir, text_filename)
    with open(text_path, "w", encoding="utf8") as text_file:
        text_file.write(", ".join(tags_to_write_escaped))
```

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/create-empty-captions-for-images | docs/yiff_toolkit/dataset_tools/e621-json-to-caption | docs/yiff_toolkit/dataset_tools/Check for Large Images/" >}}
