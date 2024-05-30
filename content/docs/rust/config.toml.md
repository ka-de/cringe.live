---
weight: 1
bookFlatSection: false
bookToC: false
title: "config.toml"
---

<!--markdownlint-disable MD025 MD033 -->

# config.toml

[Official Documentation](https://doc.rust-lang.org/cargo/reference/config.html)

The `.cargo/config.toml` file is a configuration file used by Cargo, the Rust package manager, to define project-specific settings as well as global defaults for various Cargo commands. It allows users to customize the behavior of Cargo commands across different projects and user environments. The configuration file can be placed in multiple locations, with Cargo checking the current directory and all parent directories up to the user's home directory. This hierarchical structure enables fine-grained control over Cargo's behavior, allowing for both shared configurations and project-specific overrides.

In the `.cargo/config.toml` file, users can specify a wide range of settings, such as the number of parallel jobs Cargo should run, the compiler and linker to be used, network settings, and directory paths for various Cargo operations. The file uses the TOML format, which is also used for Rust's `Cargo.toml` manifest files. The settings are organized into different sections, each corresponding to a particular aspect of Cargo's functionality, like `[build]`, `[doc]`, `[http]`, and `[profile]`.

One of the key features of the `.cargo/config.toml` file is its ability to merge settings from multiple configuration files. If the same key is specified in different files, the values are combined, with deeper directory settings taking precedence over those in ancestor directories. This merging behavior also applies to arrays, where higher precedence items are placed later in the merged array. This allows users to set global defaults in their home directory and override them on a per-project basis.

Additionally, the `.cargo/config.toml` file supports environment variable overrides, command-line option overrides through the `--config` flag, and sensitive information management through a separate `credentials.toml` file. Users can also define custom aliases for Cargo commands, making it easier to execute complex or frequently used commands. Overall, the `.cargo/config.toml` file provides a powerful and flexible way to customize Cargo's behavior to suit the needs of individual projects and developers.

## The `.cargo/config` used for `pattern`

```toml
[build]
jobs = 6

[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-Clink-arg=-fuse-ld=lld", "-Zshare-generics=y", "-Zthreads=0"]

[target.x86_64-apple-darwin]
rustflags = [
"-Clink-arg=-fuse-ld=/usr/local/opt/llvm/bin/ld64.lld",
"-Zshare-generics=y",
"-Zthreads=0",
]

[target.aarch64-apple-darwin]
rustflags = [
"-Clink-arg=-fuse-ld=/opt/homebrew/opt/llvm/bin/ld64.lld",
"-Zshare-generics=y",
"-Zthreads=0",
]

[target.x86_64-pc-windows-msvc]
linker = "rust-lld.exe"
rustflags = ["-Clinker=rust-lld.exe", "-Zshare-generics=n", "-Zthreads=0"]

[target.wasm32-unknown-unknown]
runner = "wasm-server-runner"
#rustflags = ["--cfg=web_sys_unstable_apis"]
```
