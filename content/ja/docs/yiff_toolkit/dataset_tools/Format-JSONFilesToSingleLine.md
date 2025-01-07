---
weight: 20
bookFlatSection: false
bookToC: false
bookHidden: true
title: "⚡ Format-JSONFilesToSingleLine"
summary: "`jq`ユーティリティを使用してJSONファイルを単一行形式にフォーマットします。"
---

<!--markdownlint-disable MD025 -->

# Format-JSONFilesToSingleLine

---

jqユーティリティを使用してJSONファイルを単一行形式にフォーマットします。

```pwsh
<#
.SYNOPSIS
    jqユーティリティを使用してJSONファイルを単一行形式にフォーマットします。

.DESCRIPTION
    このスクリプトには2つの関数が含まれています：Format-JSONFilesToSingleLineとFormat-JSONFileToSingleLine。
    Format-JSONFilesToSingleLine関数はパスを入力として受け取り、単一のファイルまたはディレクトリ内のすべてのJSONファイルを処理して単一行形式に変換します。
    Format-JSONFileToSingleLine関数は単一のJSONファイルを単一行形式にフォーマットします。

.PARAMETER Path
    フォーマットするJSONファイルまたはJSONファイルを含むディレクトリへのパスを指定します。

.EXAMPLE
    Format-JSONFilesToSingleLine -Path "C:\path\to\your\directory"
    指定されたディレクトリ内のすべてのJSONファイルを単一行形式にフォーマットします。

.EXAMPLE
    Format-JSONFileToSingleLine -FilePath "C:\path\to\your\file.json"
    指定されたJSONファイルを単一行形式にフォーマットします。

.NOTES
    - jqユーティリティがインストールされ、システムPATHに追加されている必要があります。
    - 元のJSONファイルを単一行形式にフォーマットされたバージョンで上書きします。
    - jqユーティリティがインストールされていない場合、スクリプトはエラーメッセージを表示して終了します。
    - 指定されたファイルまたはディレクトリが存在しない場合、スクリプトはエラーメッセージを表示します。

    作成者: _ka_de
    作成日: 2024-04-20
    バージョン: 1.0
#>

function Format-JSONFilesToSingleLine {
    param (
        [Parameter(Mandatory = $true, ValueFromPipeline = $true, ValueFromPipelineByPropertyName = $true)]
        [string]$Path
    )

    process {
        if (Test-Path $Path -PathType Container) {
            # パスがディレクトリの場合、ディレクトリ内のすべてのJSONファイルをフォーマット
            Get-ChildItem -Path $Path -Filter "*.json" | ForEach-Object {
                Format-JSONFileToSingleLine -FilePath $_.FullName
            }
        }
        elseif (Test-Path $Path -PathType Leaf) {
            # パスが単一のファイルの場合、そのファイルをフォーマット
            Format-JSONFileToSingleLine -FilePath $Path
        }
        else {
            Write-Host "無効なパス: $Path"
        }
    }
}

function Format-JSONFileToSingleLine {
    param (
        [Parameter(Mandatory = $true)]
        [string]$FilePath
    )

    # jqがインストールされているか確認
    if (-not (Test-Path "jq")) {
        Write-Host "jqがインストールされていません。jqをインストールし、システムPATHに追加してください。"
        return
    }

    # ファイルが存在するか確認
    if (-not (Test-Path $FilePath -PathType Leaf)) {
        Write-Host "ファイルが見つかりません: $FilePath"
        return
    }

    # jqを使用してJSONファイルを単一行にフォーマットするコマンドを構築
    $command = "jq -c . '$FilePath' > '$FilePath.tmp' && move /Y '$FilePath.tmp' '$FilePath'"

    # コマンドを実行
    Invoke-Expression -Command $command
    Write-Host "$($FilePath)を単一行形式にフォーマットしました。"
}

# 使用例：
# 単一のJSONファイルを単一行形式にフォーマット
# Format-JSONFileToSingleLine -FilePath "C:\path\to\your\file.json"

# ディレクトリ内のすべてのJSONファイルを単一行形式にフォーマット
# Format-JSONFilesToSingleLine -Path "C:\path\to\your\directory"
```

---

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/format-json-files | docs/yiff_toolkit/dataset_tools/format-json | docs/yiff_toolkit/dataset_tools/e621-json-to-caption" >}}
