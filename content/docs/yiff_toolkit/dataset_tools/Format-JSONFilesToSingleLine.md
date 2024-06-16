---
weight: 20
bookFlatSection: false
bookToC: false
bookHidden: true
title: "⚡ Format-JSONFilesToSingleLine"
summary: "Formats JSON files to a single-line format using the `jq` utility."
---

<!--markdownlint-disable MD025 -->

# Format-JSONFilesToSingleLine

---

Formats JSON files to a single-line format using the jq utility.

```pwsh
<#
.SYNOPSIS
    Formats JSON files to a single-line format using the jq utility.

.DESCRIPTION
    This script contains two functions: Format-JSONFilesToSingleLine and Format-JSONFileToSingleLine.
    The Format-JSONFilesToSingleLine function accepts a path as input and processes either a single file or all JSON files within a directory to convert them to a single-line format.
    The Format-JSONFileToSingleLine function formats a single JSON file to a single-line format.

.PARAMETER Path
    Specifies the path to either a JSON file or a directory containing JSON files to be formatted.

.EXAMPLE
    Format-JSONFilesToSingleLine -Path "C:\path\to\your\directory"
    Formats all JSON files in the specified directory to a single-line format.

.EXAMPLE
    Format-JSONFileToSingleLine -FilePath "C:\path\to\your\file.json"
    Formats the specified JSON file to a single-line format.

.NOTES
    - Requires the jq utility to be installed and added to the system PATH.
    - Overwrites the original JSON files with their single-line formatted versions.
    - If the jq utility is not installed, the script displays an error message and exits.
    - If the specified file or directory does not exist, the script displays an error message.

    Author: _ka_de
    Date: 2024-04-20
    Version: 1.0
#>

function Format-JSONFilesToSingleLine {
    param (
        [Parameter(Mandatory = $true, ValueFromPipeline = $true, ValueFromPipelineByPropertyName = $true)]
        [string]$Path
    )

    process {
        if (Test-Path $Path -PathType Container) {
            # If the path is a directory, format all JSON files in the directory
            Get-ChildItem -Path $Path -Filter "*.json" | ForEach-Object {
                Format-JSONFileToSingleLine -FilePath $_.FullName
            }
        }
        elseif (Test-Path $Path -PathType Leaf) {
            # If the path is a single file, format that file
            Format-JSONFileToSingleLine -FilePath $Path
        }
        else {
            Write-Host "Invalid path: $Path"
        }
    }
}

function Format-JSONFileToSingleLine {
    param (
        [Parameter(Mandatory = $true)]
        [string]$FilePath
    )

    # Check if jq is installed
    if (-not (Test-Path "jq")) {
        Write-Host "jq is not installed. Please install jq and ensure it's added to the system PATH."
        return
    }

    # Check if the file exists
    if (-not (Test-Path $FilePath -PathType Leaf)) {
        Write-Host "File not found: $FilePath"
        return
    }

    # Construct the command to format the JSON file to single line using jq
    $command = "jq -c . '$FilePath' > '$FilePath.tmp' && move /Y '$FilePath.tmp' '$FilePath'"

    # Execute the command
    Invoke-Expression -Command $command
    Write-Host "Formatted $($FilePath) to single-line successfully."
}

# Usage examples:
# Format a single JSON file to single-line format
# Format-JSONFileToSingleLine -FilePath "C:\path\to\your\file.json"

# Format all JSON files in a directory to single-line format
# Format-JSONFilesToSingleLine -Path "C:\path\to\your\directory"
```
