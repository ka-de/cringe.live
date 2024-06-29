---
weight: 20
bookFlatSection: false
bookCollapseSection: false
bookToC: true
title: "PowerShell"
summary: "Powershell is a cross-platform task automation solution made up of a command-line shell, a scripting language, and a configuration management framework. It’s used for managing and automating the administration of Windows systems."
---

<!--markdownlint-disable MD025 -->

# PowerShell

---

## Set ExecutionPolicy to RemoteSigned

---

Needs administrative permissions!

```pwsh
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Confirm
```

## Trust the PSGallery Repository

---

```pwsh
Set-PSRepository -Name PSGallery -InstallationPolicy Trusted 
```

## PSReadline

---

```pwsh
Install-Module -Name PSReadLine -RequiredVersion 2.3.5
```

## Fasdr

---

```pwsh
Install-Module -Name Fasdr
```

## PSFzf

---

### Installation

```pwsh
Install-Module -Name PSFzf
```

```pwsh
Set-Location (Get-ChildItem . -Recurse | ? { $_.PSIsContainer } | Invoke-Fzf)
```

### Interactively Select a File from the Current Directory or its Subdirectories

```pwsh
Get-ChildItem . -Recurse -Attributes !Directory | Invoke-Fzf | % { nvim $_ }
```

### Enable All Aliases

```pwsh
Set-PsFzfOption -EnableAliasFuzzyEdit -EnableAliasFuzzyKillProcess -EnableAliasFuzzySetLocation -EnableAliasFuzzyScoop -EnableAliasFuzzySetEverything -EnableAliasFuzzyZLocation -EnableAliasFuzzyGitStatus
```

### Enable Tab Expansion

```pwsh
Set-PsFzfOption -TabExpansion
```
