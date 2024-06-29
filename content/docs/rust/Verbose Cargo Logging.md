---
weight: 5
bookFlatSection: false
bookToC: false
title: "Verbose Cargo Logging"
summary: "Environment variable used to set the logging level of the Cargo’s compiler fingerprinting to `info`."
---

<!--markdownlint-disable MD025 MD033 -->

# Verbose Cargo Logging

---

In Rust, Cargo is the package manager that also serves as a build system. The `CARGO_LOG` environment variable is used to control the logging of Cargo’s internal operations. When you set `CARGO_LOG="cargo::core::compiler::fingerprint=info"`, you’re specifically instructing Cargo to log information related to the compiler’s fingerprinting process. Fingerprinting in this context refers to how Cargo decides whether a particular component of your project needs to be recompiled. By setting the log level to `info`, you’re asking Cargo to provide more detailed logs about this process, which can be useful for debugging and understanding the build process better.

This will let you know why stuff keeps recompiling. 🐱

```bash
CARGO_LOG="cargo::core::compiler::fingerprint=info"
```
