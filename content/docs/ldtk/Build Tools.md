---
weight: 1
bookFlatSection: false
bookCollapseSection: true
title: "Build Tools"
---

<!--markdownlint-disable MD025 -->

# Build Tools

---

## Recompile LDTK

```bat
@echo off
cd C:\Users\kade\code\ldtk
haxe main.hxml
haxe renderer.hxml
cd C:\Users\kade\code\ldtk\app
npm i
```

## Remove haxelibs

```bat
@echo off
for /f "tokens=1 delims=:" %%i in ('haxelib list') do (
    for /f "tokens=1" %%j in ("%%i") do (
        haxelib remove %%j
    )
)
```

## Start LDTK

```bat
@echo off
cd C:\Users\kade\code\ldtk\app
npm run start
```
