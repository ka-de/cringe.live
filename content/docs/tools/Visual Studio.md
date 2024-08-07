---
weight: 20
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "Visual Studio"
summary: "Visual Studio refers to the Microsoft Visual Studio, a powerful Integrated Development Environment (IDE) that supports the development of applications in multiple languages, including C. It provides a range of tools for editing, debugging, and compiling code."
---

<!--markdownlint-disable MD025 -->

# Visual Studio

---

## Compiler Options

---

In Microsoft Visual Studio compiler, `/MD`, `/MDd`, `/MT`, and `/MTd` are options that determine which version of the C++ runtime library to use. Here's what each of them means:

- **`/MD`**: This option causes the application to use the multithread-specific and DLL-specific version of the run-time library. It defines `_MT` and `_DLL` and causes the compiler to place the library name `MSVCRT.lib` into the `.obj` file. Applications compiled with this option are statically linked to `MSVCRT.lib`. The actual working code is contained in `MSVCR versionnumber .DLL`, which must be available at run time to applications linked with `MSVCRT.lib`.

- **`/MDd`**: This option defines `_DEBUG`, `_MT`, and `_DLL` and causes the application to use the debug multithread-specific and DLL-specific version of the run-time library. It also causes the compiler to place the library name `MSVCRTD.lib` into the `.obj` file.

- **`/MT`**: This option causes the application to use the multithread, static version of the run-time library. It defines `_MT` and causes the compiler to place the library name `LIBCMT.lib` into the `.obj` file so that the linker will use `LIBCMT.lib` to resolve external symbols.

- **`/MTd`**: This option defines `_DEBUG` and `_MT`. It also causes the compiler to place the library name `LIBCMTD.lib` into the `.obj` file so that the linker will use `LIBCMTD.lib` to resolve external symbols.

In general, if you are using DLLs, you should go for the dynamically linked CRT (`/MD`). Either `/MT` or `/MD` (or their debug equivalents `/MTd` or `/MDd`) is required to create multithreaded programs.
