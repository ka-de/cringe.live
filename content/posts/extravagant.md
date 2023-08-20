+++
title = "Extravagant"
date = "2023-08-20T11:27:05+02:00"
author = ""
authorTwitter = "" #do not include @
cover = ""
tags = ["", ""]
keywords = ["", ""]
description = ""
showFullContent = true
readingTime = true
hideComments = false
color = "" #color from the theme settings
+++

```powershell
# Change directory to my blog in the most extravagant way.
function blog {
    Set-Location -Path (Join-Path -Path $env:USERPROFILE -ChildPath "code\blog")
}
```

