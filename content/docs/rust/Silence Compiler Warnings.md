---
weight: 1
bookFlatSection: false
bookToC: false
title: "Silence Compiler Warnings"
summary: "The command `cargo rustc -- -Awarnings` and the environment variable setting `RUSTFLAGS=\"-Awarnings\"` in Rust are used to silence all compiler warnings."
---

<!--markdownlint-disable MD025 MD033 -->

# Silence Compiler Warnings

---

```bash
cargo rustc -- -Awarnings
```

This command allows you to compile your Rust code while adjusting the compiler’s behavior towards warnings. The `rustc` part of the command tells Cargo to pass subsequent arguments directly to the Rust compiler. The `-- -Awarnings` part is an argument to `rustc` that sets the warning level to “allow”, effectively silencing all compiler warnings. This can be useful in a development setting where you’re aware of existing warnings and want to focus on writing new code.

You can also use `RUSTFLAGS="-Awarnings"` but it will recompile everything.

```pwsh
$env:RUSTFLAGS="-Awarnings"; cargo run
```
