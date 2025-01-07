---
weight: 20
bookFlatSection: false
bookToC: false
bookHidden: true
title: "⚡ Format-JSONFiles"
summary: "Formats JSON files from single-line to multi-line format using the `jq` command-line JSON processor."
aliases:
  - /docs/yiff_toolkit/dataset_tools/format-json-files
  - /docs/yiff_toolkit/dataset_tools/format-json-files/
  - /docs/yiff_toolkit/dataset_tools/Format JSON Files/
  - /docs/yiff_toolkit/dataset_tools/Format JSON Files
---

<!--markdownlint-disable MD025 -->

# Format-JSONFiles

---

The `Format-JSONFiles` function formats JSON files found in a specified directory using the `jq` command-line JSON processor.
It loops through each JSON file in the directory, applies `jq` formatting, and overwrites the original file with the formatted JSON.

```pwsh
<#
.SYNOPSIS
    Formats JSON files from single-line to multi-line format using the jq command-line JSON processor.

.DESCRIPTION
    The Format-JSONFiles function formats JSON files found in a specified directory using the jq command-line JSON processor.
    It loops through each JSON file in the directory, applies jq formatting, and overwrites the original file with the formatted JSON.

.PARAMETER DirectoryPath
    Specifies the directory path where the JSON files are located. Default value is "E:\yiff_toolkit\ponyxl_loras".

.EXAMPLE
    Format-JSONFiles -DirectoryPath "C:\path\to\json_files"
    Formats all JSON files in the "C:\path\to\json_files" directory.

.NOTES
    Author: _ka_de
    Date: 2024-04-20
    Version: 1.0
#>

function Format-JSONFiles {
    param (
        [string]$DirectoryPath = "E:\yiff_toolkit\ponyxl_loras"
    )

    # Get a list of all JSON files in the specified directory
    $jsonFiles = Get-ChildItem -Path $DirectoryPath -Filter "*.json"

    # Loop through each JSON file and format it using jq
    foreach ($file in $jsonFiles) {
        # Construct the command to format the JSON file from single-line to multi-line
        $command = "jq '.' '$($file.FullName)' > temp.json"

        # Execute the command
        Invoke-Expression -Command $command

        # Overwrite the original file with the formatted content
        Move-Item -Path "temp.json" -Destination $file.FullName -Force

        Write-Host "Formatted $($file.Name) successfully."
    }
}
```

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/dataset_tools/format-json-files-to-single-line | docs/yiff_toolkit/dataset_tools/format-json | docs/yiff_toolkit/dataset_tools/e621-json-to-caption" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
