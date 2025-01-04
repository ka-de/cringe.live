---
title: "トレーニングの変更を追跡する"
description: "自動化スクリプトを使用してLoRAトレーニング中の変更を追跡するガイド"
weight: 8
bookToC: false
bookFlatSection: false
aliases:
  - /ja/docs/yiff_toolkit/lora_training/Tracking-Training-Changes/
  - /ja/docs/yiff_toolkit/lora_training/Tracking-Training-Changes
  - /ja/docs/yiff_toolkit/lora_training/Tracking_Training_Changes/
  - /ja/docs/yiff_toolkit/lora_training/Tracking_Training_Changes
  - /ja/docs/yiff_toolkit/lora_training/Tracking Training Changes/
  - /ja/docs/yiff_toolkit/lora_training/Tracking Training Changes
---

## 概要

LoRAのトレーニング時には、トレーニング設定、モデルバージョン、変更点を追跡することが重要です。このガイドでは、自動化スクリプトを使用してトレーニング中の変更を追跡する方法について説明します。

## トレーニングスクリプト

以下のトレーニングスクリプトは、追跡の重要な側面を処理します。時間の経過とともにコードの変更とバージョンを追跡するために、Gitリポジトリの状態を記録します。また、主要なファイルのバックアップを作成してトレーニング設定を保存し、後で参照して再現できるようにします。さらに、将来の参照のためにトレーニング中に使用されたサンプルプロンプトも保存します。ワークスペースを整理するために、失敗したトレーニング実行の出力ディレクトリを自動的にクリーンアップします。

使用方法は以下の通りです：

```zsh
#!/usr/bin/env zsh
NAME=your-model-name-v1s2400
TRAINING_DIR="/path/to/your/dataset"
# オプション：名前からステップ数を上書き
# STEPS=2400
# オプション：出力ディレクトリを上書き
# OUTPUT_DIR="/custom/output/path"

# ヘルパー関数を読み込む
source "$HOME/toolkit/zsh/train_functions.zsh"

# トレーニング引数をここに設定
args=(
    --pretrained_model_name_or_path="/path/to/base/model.safetensors"
    # ... その他の引数 ...
)

# 環境と変数のセットアップ
setup_training_vars "$NAME"
setup_conda_env "sdscripts"

# コミットハッシュを保存し、設定をコピー
store_commits_hashes "$SD_REPO" "$LYCORIS_REPO"

# トレーニングを実行
run_training_script "/path/to/train_network.py" "${args[@]}"
```

## 追跡される項目

スクリプトは、トレーニングプロセスの重要な側面を自動的に追跡します。Gitリポジトリの状態については、トレーニングスクリプトリポジトリとLyCORISリポジトリの両方のコミットハッシュを記録し、使用された正確なコードバージョンを参照できるようにします。

また、設定のコピーを作成することで重要なトレーニングファイルを管理します。トレーニング設定ファイル（`config.toml`）のハッシュを作成し、トレーニング中に使用されたサンプルプロンプトを`sample-prompts.txt`に保存し、将来の参照のためにトレーニングスクリプト自体のコピーも保存します。

ワークスペースを整理するために、スクリプトには自動クリーンアップ機能が含まれています。失敗したトレーニング実行を監視し、その出力ディレクトリを削除して、時間の経過とともにワークスペースをクリーンで管理しやすい状態に保ちます。

## ヘルパー関数

スクリプトは以下のヘルパー関数に依存しています：

### `setup_training_vars`

`setup_training_vars`関数は、プロセスに必要な基本的なトレーニング変数を処理します。提供されたモデル名からデータセット名とステップ数の両方を抽出します。また、必要な出力ディレクトリを作成および設定し、指定されたトレーニングディレクトリが存在することを確認します。

### `setup_conda_env`

この関数はConda環境のセットアップのすべての側面を管理します。指定された環境をアクティブ化し、環境が実際に存在することを確認し、現在のシェルセッションのCondaの初期化を実行します。

### `store_commits_hashes`

`store_commits_hashes`関数は、Gitリポジトリの状態を追跡する責任があります。リポジトリからコミットハッシュを記録し、関連するすべての設定ファイルのコピーを作成し、追跡に使用できるSHA-1ハッシュを生成します。

### `cleanup_empty_output`

このクリーンアップ関数は、失敗したトレーニング実行の出力ディレクトリを削除することで、整理されたワークスペースの維持を支援します。サンプルやモデルを含むディレクトリを賢く保持しながら、空のディレクトリを削除します。この自動クリーンアップが不要な場合は、`NO_CLEAN=1`を設定することで無効にできます。

## ベストプラクティス

1. **命名規則**: 一貫した命名形式を使用：

   ```bash
   {dataset}-{variant}-v{version}s{steps}
   ```

   例：`noob-surrounded_by_penis-v1s2400`

2. **ディレクトリ構造**：

   ```bash
   datasets/
   ├── dataset_name/
   │   ├── config.toml
   │   └── sample-prompts.txt
   output_dir/
   └── model_name/
       ├── repos.git
       ├── config.toml
       ├── sample-prompts.txt
       └── training_script.sh
   ```

3. **バージョン管理**: 以下の項目は常にGitリポジトリで管理：
   - トレーニングスクリプト
   - データセット設定
   - カスタムトレーニングコード

4. **ドキュメント**: 以下の項目を記録：
   - うまく機能したトレーニングパラメータ
   - 失敗した実験とその理由
   - モデルのパフォーマンス観察

デバッグ出力を有効にするには：

```bash
DEBUG=1 ./your_training_script.sh
```

## その他のヒント

効果的なバージョン管理のために、トレーニングスクリプト、データセット設定、カスタムトレーニングコードは常にGitリポジトリで作業してください。再現性を確保するために、新しいトレーニング実行を開始する前にトレーニングスクリプトの変更をコミットしてください。

トレーニングプロセスについて、うまく機能したトレーニングパラメータ、失敗した実験とその理由、モデルのパフォーマンス観察を含む詳細なメモを取ってください。これは将来の最適化とエラーの回避に役立ちます。

長期保存のために、トレーニング設定、サンプルプロンプト、Gitリポジトリを定期的にバックアップしてください。効率的な実験追跡のために、トレーニングメトリクスの視覚化にはTensorBoard、大きなファイルの保存にはGit LFS、プロセス全体の文書化には外部の実験追跡プラットフォームなどの追加ツールの使用を検討してください。
