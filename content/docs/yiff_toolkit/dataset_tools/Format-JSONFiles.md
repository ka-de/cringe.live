---
weight: 1
bookFlatSection: false
bookToC: false
title: "Format-JSONFiles"
summary: "Formats JSON files from single-line to multi-line format using the jq command-line JSON processor."
---

<!--markdownlint-disable MD025 -->

# Format-JSONFiles

The `Format-JSONFiles` function formats JSON files found in a specified directory using the `jq` command-line JSON processor.
It loops through each JSON file in the directory, applies `jq` formatting, and overwrites the original file with the formatted JSON.

---

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
function Format-JSONFiles {
    param (
        [string]$DirectoryPath = "E:\yiff_toolkit\ponyxl_loras"
    )
    $jsonFiles = Get-ChildItem -Path $DirectoryPath -Filter "*.json"
    foreach ($file in $jsonFiles) {
        $command = "jq '.' '$($file.FullName)' > temp.json"
        Invoke-Expression -Command $command
        Move-Item -Path "temp.json" -Destination $file.FullName -Force
        Write-Host "Formatted $($file.Name) successfully."
    }
}
```
