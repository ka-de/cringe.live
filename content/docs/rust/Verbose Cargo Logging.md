---
weight: 5
bookFlatSection: false
bookToC: false
title: "Verbose Cargo Logging"
---

<!--markdownlint-disable MD025 MD033 -->

# Verbose Cargo Logging

---

This will let you know why stuff keeps recompiling. 🐱

```bash
CARGO_LOG="cargo::core::compiler::fingerprint=info"
```
