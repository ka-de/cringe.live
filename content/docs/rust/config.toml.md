---
weight: 1
bookFlatSection: false
bookToC: true
title: "config.toml"
summary: "Configuring `cargo`, the Rust package manager."
---

<!--markdownlint-disable MD025 MD033 -->

# config.toml

---

[Official Documentation](https://doc.rust-lang.org/cargo/reference/config.html)

## Introduction

---

The `.cargo/config.toml` file is a powerful configuration tool used by Cargo, the Rust package manager, to customize and control various aspects of the build process, dependency management, and overall project behavior. This file plays a crucial role in tailoring the Rust development environment to suit specific project needs and developer preferences.

## Purpose and Functionality

---

The primary purpose of the `.cargo/config.toml` file is to define project-specific settings as well as global defaults for various Cargo commands. It allows users to customize the behavior of Cargo commands across different projects and user environments, providing a flexible and extensible configuration system.

## File Location and Hierarchy

---

Cargo employs a hierarchical approach to configuration, checking for `.cargo/config.toml` files in multiple locations:

1. The current directory
2. All parent directories up to the user's home directory

This structure enables fine-grained control over Cargo's behavior, allowing for both shared configurations and project-specific overrides. The hierarchical nature of the configuration system means that settings can be applied globally, per-user, or per-project, with more specific settings taking precedence over more general ones.

## File Format and Structure

---

The `.cargo/config.toml` file uses the TOML (Tom's Obvious, Minimal Language) format, which is also used for Rust's `Cargo.toml` manifest files. This format is known for its simplicity and readability, making it easy for developers to understand and modify configurations.

The settings in the file are organized into different sections, each corresponding to a particular aspect of Cargo's functionality. Some common sections include:

## A Sample `config.toml` File

---

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

## `[cargo-new]`

---

This section allows you to customize the default values when creating a new package with `cargo new` or `cargo init`

```toml
[cargo-new]
name = "Your Name"
email = "your.email@example.com"
vcs = "git"  # or "hg" for Mercurial, or "none"
```

## `[alias]`

---

Define custom shortcuts for Cargo commands.

```toml
[alias]
b = "build"
c = "check"
t = "test"
r = "run"
rr = "run --release"
```

## `[registries]`

---

Configure alternative crate registries.

```toml
[registries]
my-registry = { index = "https://my-intranet:8080/git/index" }
```

## `[http]`

---

Configure HTTP-related settings for cargo.

```toml
[http]
proxy = "http://user:pass@host:port"
timeout = 30  # in seconds
cainfo = "/path/to/cert.pem"
check-revoke = false
low-speed-limit = 5  # in bytes per second
multiplexing = true
```

## `[net]`

---

Configure network-related settings.

```toml
[net]
retry = 2  # number of retries for network-related operations
git-fetch-with-cli = true  # use the `git` executable for fetching
offline = false
```

## `[term]`

---

Configure terminal output behavior.

```toml
[term]
verbose = false  # whether to use verbose output
color = 'auto'  # can be 'always', 'never', or 'auto'
progress.when = 'auto'  # can be 'always', 'never', or 'auto'
progress.width = 80  # width of the progress bar
```

## `[build]`

---

```toml
[build]
jobs = 6  # number of parallel jobs
rustc = "rustc"  # the rust compiler to use
rustdoc = "rustdoc"  # the rust doc generator to use
target = "x86_64-unknown-linux-gnu"  # the default target platform
target-dir = "/path/to/target"  # directory for all generated artifacts
rustflags = ["-C", "link-arg=-fuse-ld=lld"]  # additional flags for rustc
incremental = true  # whether to use incremental compilation
```

## `[profile.*]`

---

Customize compiler settings for different profiles.

```toml
[profile.dev]
opt-level = 0
debug = true

[profile.release]
opt-level = 3
debug = false
lto = true
panic = 'abort'
```

## `[future-incompat-report]`

---

Configure how Cargo reports future incompatibilities.

```toml
[future-incompat-report]
frequency = 'always'  # can be 'always', 'never', or a number of days
```

## `[env]`

---

Set environment variables for all processes Cargo spawns.

```toml
[env]
RUST_BACKTRACE = "1"
```

## `[toolchain]`

---

This ensures that all developers working on the project use the same Rust toolchain version and components.

```toml
[toolchain]
channel = "nightly-2023-05-15"
components = ["rustfmt", "clippy"]
targets = ["wasm32-unknown-unknown"]
```

## Conditional Compilation

---

You can use the `cfg` attribute in your Rust code along with `rustflags` in your `.cargo/config.toml` to enable conditional compilation:

```toml
[target.'cfg(target_os = "linux")']
rustflags = ["--cfg=linux_specific"]
```

## Best Practices

---

- Include your `.cargo/config.toml` in version control to ensure consistent builds across different environments.
- Comment your configuration file to explain non-obvious settings or project-specific customizations.
- Use environment variables or the `--config` flag for settings that may vary between development, testing, and production environments.
- Periodically review and update your configuration to take advantage of new Cargo features and optimizations.
- Keep sensitive information out of the main config file and use `credentials.toml` instead.
