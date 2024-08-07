---
title: "Early Steps"
date: 2023-08-18T12:08:30+02:00
author: "Balazs Horvath"
authorTwitter: "_ka_de"
cover: ""
tags:
 - technology
 - programming
 - powershell
 - vba script
 - excel
 - data manipulation
 - self-improvement
 - addiction recovery
 - health
 - ai assistance
 - powershell
 - chatgpt
 - excel
keywords:
 - PowerShell scripting
 - VBA Script for Excel
 - Data manipulation in Excel
 - Self-improvement journey
 - Addiction recovery process
 - Health and technology
 - AI assistance in programming
 - Excel automation techniques
 - Coding with AI
 - Random quote generation
 - CSV file manipulation
 - Data analysis with Python
 - Excel VBA scripting
 - Technology tutorials
 - Programming tips and tricks
 - Self-education with AI
 - Addiction recovery support
 - Health and wellness journey
 - Tech-savvy self-improvement
 - AI-powered programming
showFullContent: false
description: ""
readingTime: true
---

{{< figure src="/images/manvsmachine.png" alt="AI Generated caricature." caption="Men slowly starting to interface with the machines other men built for them. Glorious!" >}}

I accidentally dropped out of society for a few years, and upon my return, I discovered the presence of peculiar machines that we can converse with, and which possess extensive knowledge about various subjects. I have no trepidation concerning GPUs, so let's embark on a deep exploration of this novel 'disruptive' technology together. Below, you will find a graveyard of both useful and useless scripts, composed individually by machines or with minimal assistance from this hairy monkey. It's worth noting that these scripts should not be executed, but rather studied by the vigilant, perhaps even the overly cautious..

## PowerShell

I was too lazy to figure out this new scripting language people use now by the traditional learning methods, so I asked GPT to help me with these useful snippets.

```powershell
# Start my hugo blog locally.
function serve {
    param(
        [int]$Port = 1313
    )

    $hugoExecutable = "$env:LOCALAPPDATA\hugo-extended-0.117.0\hugo.exe"
    $workingDirectory = "$env:USERPROFILE\code\cringe.live\"

    if (Test-Path $hugoExecutable) {
        if (Test-Path $workingDirectory) {
            Set-Location -Path $workingDirectory
            & $hugoExecutable server -p $Port
        }
        else {
            Write-Host "Working directory not found at $workingDirectory"
        }
    }
    else {
        Write-Host "Hugo executable not found at $hugoExecutable"
    }
}
```

```powershell
# Get a random quote from a JSON file.
function fortune {
    param (
        [string]$JsonFilePath = "$env:USERPROFILE\code\motivation.json"
    )

    # Read the JSON file
    $jsonContent = Get-Content -Raw -Path $JsonFilePath
    $quotes = ConvertFrom-Json $jsonContent

    # Get a random index within the range of quotes
    $randomIndex = Get-Random -Minimum 0 -Maximum $quotes.Count

    # Retrieve the random quote and display it
    $randomQuote = $quotes[$randomIndex]
    Write-Output "`n  $($randomQuote.Quote)`n     -- $($randomQuote.Author)`n"
}

# Present a random quote for motivation
fortune
```

## Working with Data

### Color Excel tables by HEX

I found this neat VBA Script that colors cells automatically if you enter hex color codes in Excel:

{{< video width="550" height="108" src="hexcolors-excel.mp4" muted="true" autoplay="true" loop="true" >}}

```vb
Private Sub Worksheet_Change(ByVal Target As Range)
    On Error GoTo bm_Safe_Exit
    Application.EnableEvents = False
    Dim rng As Range, clr As String
    For Each rng In Target
        If Len(rng.Value2) = 6 Then
            clr = rng.Value2
            rng.Interior.Color = _
              RGB(Application.Hex2Dec(Left(clr, 2)), _
                  Application.Hex2Dec(Mid(clr, 3, 2)), _
                  Application.Hex2Dec(Right(clr, 2)))
        End If
    Next rng

bm_Safe_Exit:
    Application.EnableEvents = True
End Sub
```

I asked ChatGPT nicely to make it match with the `#000000` format instead.

```vb
Private Sub Worksheet_Change(ByVal Target As Range)
    On Error GoTo bm_Safe_Exit
    Application.EnableEvents = False
    Dim rng As Range, clr As String
    For Each rng In Target
        If Left(rng.Value2, 1) = "#" And Len(rng.Value2) = 7 Then
            clr = Mid(rng.Value2, 2)
            rng.Interior.Color = RGB(Application.Hex2Dec(Left(clr, 2)), _
                                     Application.Hex2Dec(Mid(clr, 3, 2)), _
                                     Application.Hex2Dec(Right(clr, 2)))
        End If
    Next rng

bm_Safe_Exit:
    Application.EnableEvents = True
End Sub
```

A bit safer in case I ever end up using an instrument with 6 numbers for a name..

But what I would never be able to figure out, because I never became a Visual Basic Instructor in a previous reincarnation, is how to run all this on column D only.

```vb
Private Sub Worksheet_Change(ByVal Target As Range)
    Application.EnableEvents = False
    If Not Intersect(Target, Me.Range("D:D")) Is Nothing Then
        Dim rng As Range
        For Each rng In Target
            If Left(rng.Value2, 1) = "#" And Len(rng.Value2) = 7 Then
                rng.Interior.Color = RGB(Application.Hex2Dec(Mid(rng.Value2, 2, 2)), _
                                         Application.Hex2Dec(Mid(rng.Value2, 4, 2)), _
                                         Application.Hex2Dec(Right(rng.Value2, 2)))
            End If
        Next rng
    End If
    Application.EnableEvents = True
End Sub
```

### Get random quote from .csv

In case you need to manipulate CSV files with Python or access the data randomly or predictably during your travels, ChatGPT can assist you.

`motivational-quotes.csv`

```csv
"""The only way to do great work is to love what you do."" - Steve Jobs"
"""Success is not final, failure is not fatal: It is the courage to continue that counts."" - Winston Churchill"
"""Believe you can and you're halfway there."" - Theodore Roosevelt"
"""The future depends on what you do today."" - Mahatma Gandhi"
"""Don't watch the clock; do what it does. Keep going."" - Sam Levenson"
"""Success is walking from failure to failure with no loss of enthusiasm."" - Winston S. Churchill"
"""The harder you work for something, the greater you'll feel when you achieve it."" - Unknown"
"""The only limit to our realization of tomorrow will be our doubts of today."" - Franklin D. Roosevelt"
"""Your time is limited, don't waste it living someone else's life."" - Steve Jobs"
"""You are never too old to set another goal or to dream a new dream."" - C.S. Lewis"
```

`random-quote-from-csv.py`

```python
import csv
import random

def get_random_quote(csv_file):
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        quotes = list(reader)
        
        if len(quotes) == 0:
            return "No quotes found in the CSV file."
        
        random_quote = random.choice(quotes)[0]
        return random_quote

csv_filename = "motivational-quotes.csv"
random_quote = get_random_quote(csv_filename)
print(random_quote)
```
