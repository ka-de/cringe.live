---
weight: 20
bookFlatSection: false
bookToC: false
bookHidden: true
title: "⚡ Format-JSONFiles"
summary: "`jq`コマンドラインJSONプロセッサを使用して、単一行のJSONファイルを複数行形式にフォーマットします。"
---

<!--markdownlint-disable MD025 -->

# Format-JSONFiles

---

`Format-JSONFiles`関数は、`jq`コマンドラインJSONプロセッサを使用して、指定されたディレクトリ内のJSONファイルをフォーマットします。
ディレクトリ内の各JSONファイルに対して、`jq`フォーマットを適用し、フォーマットされたJSONで元のファイルを上書きします。

```pwsh
<#
.SYNOPSIS
    jqコマンドラインJSONプロセッサを使用して、単一行のJSONファイルを複数行形式にフォーマットします。

.DESCRIPTION
    Format-JSONFiles関数は、jqコマンドラインJSONプロセッサを使用して、指定されたディレクトリ内のJSONファイルをフォーマットします。
    ディレクトリ内の各JSONファイルに対して、jqフォーマットを適用し、フォーマットされたJSONで元のファイルを上書きします。

.PARAMETER DirectoryPath
    JSONファイルが配置されているディレクトリパスを指定します。既定値は"E:\yiff_toolkit\ponyxl_loras"です。

.EXAMPLE
    Format-JSONFiles -DirectoryPath "C:\path\to\json_files"
    "C:\path\to\json_files"ディレクトリ内のすべてのJSONファイルをフォーマットします。

.NOTES
    作成者: _ka_de
    作成日: 2024-04-20
    バージョン: 1.0
#>

function Format-JSONFiles {
    param (
        [string]$DirectoryPath = "E:\yiff_toolkit\ponyxl_loras"
    )

    # 指定されたディレクトリ内のすべてのJSONファイルのリストを取得
    $jsonFiles = Get-ChildItem -Path $DirectoryPath -Filter "*.json"

    # 各JSONファイルに対してjqを使用してフォーマット
    foreach ($file in $jsonFiles) {
        # 単一行から複数行にJSONファイルをフォーマットするコマンドを構築
        $command = "jq '.' '$($file.FullName)' > temp.json"

        # コマンドを実行
        Invoke-Expression -Command $command

        # フォーマットされた内容で元のファイルを上書き
        Move-Item -Path "temp.json" -Destination $file.FullName -Force

        Write-Host "$($file.Name)のフォーマットが完了しました。"
    }
}
```

---

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/format-json-files-to-single-line | docs/yiff_toolkit/dataset_tools/format-json | docs/yiff_toolkit/dataset_tools/e621-json-to-caption" >}}
