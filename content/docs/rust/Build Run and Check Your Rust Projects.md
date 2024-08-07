---
weight: 1
bookFlatSection: false
bookToC: false
title: "Build, Run, and Check Your Rust Projects"
summary: "This document explains how to build, run and check your Rust projects with `cargo`."
---

<!--markdownlint-disable MD025 MD033 -->

# Build, Run, and Check Your Rust Projects

---

Cargo, Rust's package manager and build system, is an essential tool for every Rust developer. In this post, we'll explore how to effectively use Cargo to build, run, and check your Rust projects.

## Basic Cargo Commands

---

Cargo offers several commands to interact with your Rust program. Here are some of the most commonly used ones:

1. `cargo check`: Quickly validate your project's structure
2. `cargo build`: Compile your project without running it
3. `cargo run`: Build and run your project
4. `cargo clean`: Remove the compiled artifacts

Let's dive deeper into each of these commands.

### Checking Your Project

```bash
cargo check
```

This command performs a quick check of your project and its dependencies for basic structural errors. It's significantly faster than a full build, making it ideal for frequent use during development.

### Building Your Project

```bash
cargo build
```

This command compiles your project but doesn't run it. It's useful when you want to build your project to distribute or to check for compilation errors.

### Running Your Project

```bash
cargo run
```

This command builds your project and then runs the resulting executable. It's the most common way to test your program during development.

### Cleaning Up

```bash
cargo clean
```

This command removes the entire `target` directory, where compiled code is placed. It's useful when you want to start fresh or reclaim disk space.

## Debug vs. Release Builds

By default, Cargo builds your project in debug mode. This mode:

- Contains minimal optimizations
- Includes debug information
- Results in slower runtime performance
- Produces larger executables

To build or run your project in release mode, use the `--release` flag or `-r` for short:

```bash
cargo run --release
```

or

```bash
cargo build --release
```

Release mode:

- Applies optimizations
- Omits debug information
- Produces faster and smaller executables
- Makes debugging more challenging

Use debug mode during development for easier debugging, and switch to release mode when you're ready to deploy your program.

## Getting Help

If you need more information about Cargo commands or their options, you can use:

```bash
cargo help
```

For detailed help about a specific command:

```bash
cargo [command] --help
```

## Conclusion

Cargo is a powerful tool that simplifies the process of building, running, and maintaining Rust projects. By mastering these basic commands and understanding the difference between debug and release builds, you'll be well-equipped to manage your Rust development workflow efficiently.

Remember to use `cargo check` frequently during development for quick feedback, and switch to `cargo run --release` or `cargo build --release` when you're ready to optimize your program for production use.
