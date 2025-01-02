---
weight: 20
bookFlatSection: false
bookToC: false
bookHidden: true
title: "⚡ Get-Seed"
summary: "`.safetensors`ファイルのメタデータから`ss_seed`値を取得します。"
---

<!--markdownlint-disable MD025 -->

# Get-Seed

---

`.safetensors`ファイルのメタデータから`ss_seed`値を取得します。

```pwsh
<#
  .safetensorsファイルのメタデータから'ss_seed'値を取得します。

  Get-Seed関数はファイルパスを入力として受け取り、Pythonを使用して.safetensorsファイルのメタデータから'ss_seed'値を抽出します。
  'ss_seed'値が見つかった場合はその値を返し、見つからなかった場合は'Not found'を返します。

.EXAMPLE
  $seedValue = Get-Seed .\path\to\your\file.safetensors
#>
function Get-Seed {
  param (
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$filePath
  )

  $filePath = $filePath -replace '\\', '\\\\'
  $pythonCommand = "import safetensors, json; print(json.loads(safetensors.safe_open('" + $filePath + "', 'np').metadata().get('ss_seed', 'Not found')))"
  $ssSeed = python -c $pythonCommand
  return $ssSeed
}
```
