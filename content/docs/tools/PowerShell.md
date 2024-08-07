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

## Unsetting Variables

---

In PowerShell (pwsh), you can unset (or clear) an environment variable that has already been set using the `Remove-Item` cmdlet. Here's how you can do it:

```powershell
Remove-Item Env:VARIABLE_NAME
```

Replace `VARIABLE_NAME` with the name of the environment variable you want to unset. This will remove the environment variable from the current session. If the variable is not set or already unset, this operation will not have any effect. Please note that this will not affect the system-wide environment variable or the variable in other sessions. It only affects the current session. If you want to permanently remove a system-wide environment variable, you may need to use system settings or a tool specifically designed for that purpose. Always be careful when modifying environment variables, as they can affect the operation of your system and applications.

For example, to remove the `RUST_LOG` environment variable type in:

```powershell
Remove-Item Env:RUST_LOG
```

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
