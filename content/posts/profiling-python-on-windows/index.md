+++
title = "Profiling Python on Windows"
date = "2023-08-30T15:02:05+02:00"
author = "Balazs Horvath"
authorTwitter = "_ka_de"
cover = ""
tags = ["powershell", "python", "windows", "PowerShell functions", "Windows scripting", "Python profiling", "python scripting", "windows environment", "code profiling", "powershell automation", "snakeviz tool", "code performance analysis"]
keywords = ["Python profiling on Windows", "PowerShell functions", "SnakeViz", "code optimization", "Python script optimization", "Windows scripting utilities", "Profiling Python code", "PowerShell automation functions", "SnakeViz profiling tool", "Code performance analysis on Windows"]
categories = ["Python", "Windows", "Profiling", "Python Development", "Windows Scripting", "Performance Optimization"]
description = "Explore the world of Python development on Windows with these handy PowerShell functions. Learn how to effortlessly run Python scripts and delve into the art of code profiling, all while navigating the Windows environment. Discover how to pinpoint what your Python script is doing with simple commands and even visualize its performance using SnakeViz. Enhance your scripting skills and optimize your code for better results in the Windows ecosystem."
showFullContent = true
readingTime = true
hideComments = false
+++

At some point in your life, you might wonder what your amazing script is spending it's time on, if for some reason you can't afford to buy a pendrive so you can install Linux on your laptop and you are stuck running Windows, please enjoy these PowerShell functions I'm letting loose on the world that lets me run python scripts and/or profile them the laziest way possible.

```powershell
$PythonPath = "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe"
$CodeFolder = Join-Path -Path $env:USERPROFILE -ChildPath "code"
$ScriptsFolder = Join-Path -Path $CodeFolder -ChildPath "scripts"

# Python
function p {
    param (
        [string]$ScriptName
    )

    if (Test-Path $PythonPath) {
        $ScriptPath = Join-Path -Path $ScriptsFolder -ChildPath "$ScriptName.py"
        if (Test-Path $ScriptPath) {
            & $PythonPath $ScriptPath @args
        } else {
            Write-Host "Error: The script file $ScriptPath does not exist."
        }
    } else {
        Write-Host "Error: Python executable not found at $PythonPath."
    }
}

# Profile Python
function pp {
    param (
        [string]$ScriptName
    )

    if (Test-Path $PythonPath) {
        $ScriptPath = Join-Path -Path $ScriptsFolder -ChildPath "$ScriptName.py"
        if (Test-Path $ScriptPath) {
            # Get the current date and time in the "yyyy-MM-dd_HH-mm" format
            $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"

            # Construct the output filename
            $outputFileName = "$ScriptName" + "_" + "$timestamp" + "_d.prof"

            # Build the full profiling command
            $profileCommand = "python -m cProfile -o $outputFileName $ScriptPath @args"

            # Execute the profiling command
            Invoke-Expression $profileCommand

            $runSnakeViz = Read-Host "Do you want to run SnakeViz on the generated profile file? (y/n)"
            if ($runSnakeViz -eq "Y" -or $runSnakeViz -eq "y") {
                # Run SnakeViz
                $snakeVizCommand = "snakeviz $outputFileName"
                Invoke-Expression $snakeVizCommand
            }
        } else {
            Write-Host "Error: The script file $ScriptPath does not exist."
        }
    } else {
        Write-Host "Error: Python executable not found at $PythonPath."
    }
}
```
The function `p` is just a wrapper around Python, if I type `p mime .\winget.txt` it will run the Python executable you specify in `$PythonPath` use the script from the `$ScriptsFolder` you specify (without the file extension) with the arguments you typed.

When you run `pp` it will do the same thing but also call `-m cProfile -o $outputFileName` to create a file called $ScriptName_$timestamp_d.prof, which it can open for you, or if you forgot you have your keyboard layout on German and accidentally pressed `z`, you can open up with snakeviz for a deep dive into insanity:

```powershell
pip install snakeviz
snakeviz .\mime_2023-08-30_14-46_d.prof
```

{{< figure src="/images/snakeviz.png" alt="An screenshot of snakewiz in action." caption="" >}}
