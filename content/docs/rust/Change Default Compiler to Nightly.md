---
weight: 1
bookFlatSection: false
bookToC: false
title: "Change Default Compiler to Nightly"
summary: "How to change to the nightly rust compiler for one build or setting it up as the default for your project."
---

<!--markdownlint-disable MD025 MD033 -->

# Change Default Compiler to Nightly

---

```bash
rustup default nightly
```

You can also change it per-project by adding this to `rust-toolchain.toml` in the root of your project:

```toml
[toolchain]
channel = "nightly"
```
