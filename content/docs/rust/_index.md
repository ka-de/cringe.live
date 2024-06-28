---
weight: 10
bookFlatSection: false
bookCollapseSection: true
bookToC: true
title: "🦀 - Rust"
summary: "Rust is a multi-paradigm, general-purpose programming language that emphasizes performance, type safety, and concurrency, enforcing memory safety without a garbage collector, and is widely adopted for systems programming, building kernels for operating systems, game engines, and browser engines."
---

<!--markdownlint-disable MD025 MD029 MD033 -->

# Rust

---

## Introduction

---

Rust is a high-level, multi-paradigm programming language that prioritizes performance, safety, and concurrency. It employs a unique ownership model with zero-cost abstractions, move semantics, and guaranteed memory safety to eliminate common programming errors like null pointer dereferencing and data races at compile-time. Rust’s static typing and type inference provide a robust type system, while its trait-based generics and pattern matching offer expressive high-level abstractions.

Rust’s performance is comparable to that of C and C++, but it provides better memory safety. It doesn’t use a garbage collector, making it suitable for performance-critical applications and the use in embedded systems. The language also supports a variety of programming paradigms, including procedural, concurrent actor, object-oriented, and pure functional styles.

Rust’s ecosystem includes Cargo, a build system and package manager that simplifies dependency management. The Rust compiler’s clear error messages and built-in test and benchmarking tools contribute to developer productivity. Rust also supports WebAssembly as a first-class citizen, enabling high-performance web applications.

The Rust community actively contributes to a growing collection of libraries, known as “crates”, which extend the language’s capabilities. The language’s adoption in significant projects like the Servo web engine, the Redox operating system, and the Tor project attest to its capabilities. Notably, Rust was chosen for the development of the Linux kernel, marking a significant milestone in its history.

In summary, Rust’s design balances performance, robustness, and expressiveness, making it a powerful tool for a wide range of software development tasks. Its innovative features and growing ecosystem position it as a compelling choice for modern system programming.

## Articles

---

{{< section details >}}

## Installing Rust on Linux

---

1. Open a terminal.
2. Download and install `rustup` by running the following command:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

3. The above command will download a script and start the installation. You will be prompted for installation options. You can proceed with the default options by hitting enter.
4. Close the terminal and reopen it.
5. Verify the installation by running the following command:

```bash
rustc --version
```

## Installing Rust on Windows

---

1. Go to [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install) to download `rustup-init.exe`.
2. Run `rustup-init.exe` and follow the onscreen instructions.
3. After the installation is complete, close the command prompt and reopen it.
4. Verify the installation by running the following command:

```cmd
rustc --version
```

## Creating Your First Rust Program

---

Rust has a build system and package manager called `cargo`. It comes with `rustup`, so you already have it if you've installed Rust.

1. Open a terminal or command prompt.
2. Navigate to the directory where you want to create your new Rust project.
3. Run the following command:

```bash
cargo new hello_world
```

This will create a new directory called `hello_world` with a basic Rust project.

4. Navigate into the `hello_world` directory:

```bash
cd hello_world
```

5. Open the `src/main.rs` file in a text editor. You'll see the following code:

```rust
fn main() {
    println!("Hello, World!");
}
```

6. To run the program, go back to your terminal and run the following command:

```bash
cargo run
```

You should see `Hello, World!` printed to the console. That's your first Rust program!

## `Cargo.toml`

---

When you create a new Rust project using `cargo new hello_world`, a `Cargo.toml` file is automatically generated in the `hello_world` directory. This file is used by Cargo, Rust's package manager and build system, to manage dependencies and build settings for your project.

Here's what a basic `Cargo.toml` file looks like:

```toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2018"

[dependencies]
```

Let's break down the sections of this file:

- `[package]`: This section contains information about the package (your project).
  - `name`: The name of the package. This is set to the name of your project, `hello_world`.
  - `version`: The version of the package. This follows the [Semantic Versioning](https://semver.org/) scheme.
  - `edition`: The edition of Rust to use. This is usually set to the latest stable edition.

- `[dependencies]`: This section is where you list your package's dependencies. Each dependency is listed as a key-value pair, with the key being the dependency's name and the value being the version requirement.

To add a dependency to your project, you would add a line to the `[dependencies]` section with the name of the dependency and the version number. For example, if you wanted to add the `rand` crate (a library for generating random numbers), you would add the following line:

```toml
rand = "0.8.3"
```

So your `Cargo.toml` file would now look like this:

```toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2018"

[dependencies]
rand = "0.8.3"
```

When you build your project with `cargo build`, Cargo will automatically download and compile your dependencies and link them to your project.

The `Cargo.toml` file can also contain other sections for more advanced use cases, such as `[dev-dependencies]` for dependencies that are only used during development, and `[build-dependencies]` for dependencies that are used in build scripts.

## Scopes

---

In Rust, a scope is a section of your program where a binding is valid. When the scope ends, the binding is not valid anymore. This is also known as variable shadowing. Let’s look at an example:

```rust
fn main() {
    let x = 5;

    {
        let x = x + 1;
        println!("Inside the inner scope, x is: {x}");
    }

    println!("Outside the inner scope, x is: {x}");
}
```

In this example, there are two scopes: the `main` function scope and the inner scope. The variable `x` is declared twice, once in each scope.

In the inner scope, `x` is redeclared and its value is set to the value of `x` from the outer scope plus one. The `println!` statement inside the inner scope will output `6`, because `x` in the inner scope is `6`.

The `println!` statement outside the inner scope will output `5`, because `x` in the outer scope is `5`. The `x` in the inner scope does not change the value of the `x` in the outer scope because they are in different scopes.

## Printing Text

---

In Rust, there are several ways to print text to the console. Here are a few examples:

### Printing text with `println!` macro

The `println!` macro is the most common way to print text in Rust. It prints the text and a newline to the console.

```rust
fn main() {
    println!("Hello, World!");
}
```

### Printing formatted text with `println!` macro

You can also use the `println!` macro to print formatted text. The `{name}` syntax is used to insert variables into the text.

```rust
fn main() {
    let name = "Alice";
    println!("Hello, {name}!");
}
```

### Printing with `print!` macro

The `print!` macro is similar to `println!`, but it does not add a newline at the end.

```rust
fn main() {
    print!("Hello, ");
    print!("World!");
}
```

### Printing with `format!` macro

The `format!` macro is similar to `println!`, but instead of printing the text, it returns a `String`. This can be useful when you want to format some text but use it later in the code.

```rust
fn main() {
    let name = "Alice";
    let greeting = format!("Hello, {name}!");
    println!("{}", greeting);
}
```

### Printing with `eprintln!` and `eprint!` macros

The `eprintln!` and `eprint!` macros are similar to `println!` and `print!`, but they print to the standard error (stderr) instead of the standard output (stdout).

```rust
fn main() {
    eprintln!("This is an error message!");
}
```

### Printing Debug Output with `dbg!` Macro

The `dbg!` macro is used for quick and dirty debugging. It prints the filename and line number of its location, as well as the expression and its value.

```rust
fn main() {
    let name = "Alice";
    dbg!(name);
}
```

### Printing with `write!` and `writeln!` Macros

The `write!` and `writeln!` macros are similar to `print!` and `println!`, but they write to a `Write` trait object, such as a file or a network stream. Here's an example of writing to a `String`:

```rust
use std::fmt::Write;

fn main() {
    let mut s = String::new();
    writeln!(&mut s, "Hello, {}!", "World").expect("Unable to write");
    println!("{s}");
}
```

### Printing Custom Types with `fmt::Display` and `fmt::Debug`

If you have a custom type and you want to be able to print it using `println!`, you can implement the `fmt::Display` or `fmt::Debug` trait for that type. Here's an example:

```rust
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 10, y: 20 };
    println!("{p}");
}
```

In this example, we define a `Point` struct and implement the `fmt::Display` trait for it. This allows us to print a `Point` using `println!`.

### Printing with `format_args!` Macro

The `format_args!` macro is a low-level macro for string formatting, which `println!`, `print!`, `format!`, `write!`, and `writeln!` are built upon. It takes a format string and a list of arguments to substitute into the format string:

```rust
fn main() {
    let s = format_args!("{} {}", "Hello", "World");
    println!("{s}");
}
```

### Printing with `panic!` and `assert!` Macros

While not typically used for printing text in the same way as `println!` or `print!`, the `panic!` and `assert!` macros do print text to the console when a certain condition isn't met, and then exit the program:

```rust
fn main() {
    panic!("This is a panic message!");

    let x = 5;
    assert!(x == 10, "x is not equal to 10!");
}
```

### Printing with `log` Crate

For more complex applications, you might want to use the `log` crate along with a logging backend crate like `env_logger`. This allows you to print text with different levels of severity (error, warning, info, debug, trace) and control the verbosity of the output:

```rust
use log::{info, trace, warn};

fn main() {
    env_logger::init();

    info!("This is an info message");
    warn!("This is a warning message");
    trace!("This is a trace message");
}
```

Remember to add `log` and `env_logger` to your `Cargo.toml`:

```toml
[dependencies]
log = "0.4"
env_logger = "0.11.3"
```

The logging level for the `log` crate in Rust can be set using the `RUST_LOG` environment variable when you run your program. This variable controls the output of the `log` crate and can be set to different levels of verbosity.

Here's how you can set it:

1. **In your terminal, before running your program:**

Bash:

```bash
export RUST_LOG=info
cargo run
```

PowerShell:

```pwsh
$env:RUST_LOG="info"
cargo run
```

In this example, `info` is the logging level. You can replace it with `error`, `warn`, `debug`, or `trace` depending on your needs.

2. **Directly in the command line when running your program:**

Bash:

```bash
RUST_LOG=info cargo run
```

PowerShell:

```pwsh
$env:RUST_LOG="info"; cargo run
```

3. **In your Rust code, using the `env_logger` crate:**

```rust
use log::LevelFilter;
use env_logger::Builder;

fn main() {
    Builder::new()
        .filter(None, LevelFilter::Info)
        .init();

    // The rest of your amazing app..
}
```

In this example, `LevelFilter::Info` sets the logging level to `info`. You can replace it with `LevelFilter::Error`, `LevelFilter::Warn`, `LevelFilter::Debug`, or `LevelFilter::Trace` depending on your needs.

{{< hint warning >}}
⚠️ Reminder!
<br><br>
The `log` crate itself does not implement any logging functionality. It is a facade that abstracts over the actual logging implementation. `env_logger` is one such implementation that reads its configuration from environment variables.
{{< /hint >}}
