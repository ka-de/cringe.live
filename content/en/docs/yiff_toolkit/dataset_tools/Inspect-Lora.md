---
weight: 20
bookHidden: true
bookFlatSection: false
bookToC: false
title: "⚡ Inspect-Lora"
summary: "Takes a file path as input and uses Python to read the metadata from a `.safetensors` file. It then pretty-prints the metadata contents to the console and saves it next to the LoRA."
aliases:
  - /docs/yiff_toolkit/dataset_tools/inspect-lora
  - /docs/yiff_toolkit/dataset_tools/inspect-lora/
  - /docs/yiff_toolkit/dataset_tools/Inspect Lora/
  - /docs/yiff_toolkit/dataset_tools/Inspect Lora
---

<!--markdownlint-disable MD025 -->

# Inspect-Lora

---

Takes a file path as input and uses Python to read the metadata from a `.safetensors` file. It then pretty-prints the metadata contents to the console and saves it next to the LoRA.

```pwsh
<#
  The Inspect-Lora function takes a file path as input and uses Python to read the metadata from
  a .safetensors file. It then pretty-prints the metadata contents to the console and saves it
  next to the LoRA. The file path must be a valid path to a .safetensors file.

  Usage Examples:
  Inspect-Lora .\path\to\your\file.safetensors

  Recursively:
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

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/dataset_tools/get-seed | docs/yiff_toolkit/dataset_tools/extract-metadata | docs/yiff_toolkit/dataset_tools/format-json" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
