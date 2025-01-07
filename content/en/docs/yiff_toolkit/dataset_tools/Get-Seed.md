---
weight: 20
bookFlatSection: false
bookToC: false
bookHidden: true
title: "⚡ Get-Seed"
summary: "Retrieves the `ss_seed` value from the metadata of a `.safetensors` file."
aliases:
  - /docs/yiff_toolkit/dataset_tools/get-seed
  - /docs/yiff_toolkit/dataset_tools/get-seed/
  - /docs/yiff_toolkit/dataset_tools/Get Seed/
  - /docs/yiff_toolkit/dataset_tools/Get Seed
---

<!--markdownlint-disable MD025 -->

# Get-Seed

---

Retrieves the `ss_seed` value from the metadata of a `.safetensors` file.

```pwsh
<#
  Retrieves the 'ss_seed' value from the metadata of a .safetensors file.

  The Get-Seed function takes a file path as input and uses Python to extract the 'ss_seed' value from the metadata of a .safetensors file.
  It returns the 'ss_seed' value if found, otherwise it returns 'Not found'.

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

---

{{< related-posts related="docs/yiff_toolkit/dataset_tools/inspect-lora | docs/yiff_toolkit/dataset_tools/extract-metadata | docs/yiff_toolkit/dataset_tools/create-empty-captions-for-images" >}}
