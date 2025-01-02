---
weight: 20
bookHidden: true
bookFlatSection: false
bookToC: false
title: "⚡ Inspect-Lora"
summary: "ファイルパスを入力として受け取り、Pythonを使用して`.safetensors`ファイルからメタデータを読み取ります。その後、メタデータの内容をコンソールに整形出力し、LoRAの隣に保存します。"
---

<!--markdownlint-disable MD025 -->

# Inspect-Lora

---

ファイルパスを入力として受け取り、Pythonを使用して`.safetensors`ファイルからメタデータを読み取ります。その後、メタデータの内容をコンソールに整形出力し、LoRAの隣に保存します。

```pwsh
<#
  Inspect-Lora関数はファイルパスを入力として受け取り、Pythonを使用して.safetensorsファイルから
  メタデータを読み取ります。その後、メタデータの内容をコンソールに整形出力し、LoRAの隣に保存します。
  ファイルパスは有効な.safetensorsファイルへのパスである必要があります。

  使用例：
  Inspect-Lora .\path\to\your\file.safetensors

  再帰的に：
  Get-ChildItem -Path "E:\projects\yiff_toolkit" -Filter "*.safetensors" -Recurse | ForEach-Object {Inspect-Lora -filePath $_.FullName}
#>
function Inspect-Lora {
  param (
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$filePath,
    [Parameter(Mandatory = $false, Position = 1)]
    [switch]$saveJson = $true
  )
  $escapedFilePath = $filePath -replace '\\', '\\\\'
  $pythonCommand = "import safetensors, json, pprint; metadata = safetensors.safe_open('" + $escapedFilePath + "', 'np').metadata(); pprint.pprint({k: json.loads(v) if v and v[0] in '[{' else v for k, v in metadata.items()}) if metadata is not None else {}"
  Start-Process python -ArgumentList "-c", "`"$pythonCommand`"" -NoNewWindow
  if ($saveJson) {
    $output = Invoke-Expression "python -c `"$pythonCommand`""
    $outputJsonPath = [IO.Path]::ChangeExtension($filePath, 'json')
    $output | Out-File $outputJsonPath -Force
  }
}
```
