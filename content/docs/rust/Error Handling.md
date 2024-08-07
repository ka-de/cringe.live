---
weight: 1
bookFlatSection: false
bookToC: true
title: "Error Handling"
summary: "An in-depth guide on error handling in Rust, covering basic techniques with `Result`, the `?` operator, custom error types, asynchronous error handling, and the use of the `anyhow` and `thiserror` crate for more flexible error management."
---

<!--markdownlint-disable MD025 MD033 -->
<!-- ⚠️ TODO: Check all this code again! ^^; -->

# Error Handling

---

Error handling is a crucial aspect of writing robust and reliable software, and Rust provides powerful tools to handle errors effectively. In this blog post, we'll explore different error handling techniques in Rust, from basic error handling to more advanced scenarios, including asynchronous error handling.

## Basic Error Handling with `Result`

---

Rust's `Result` enum is the foundation of error handling. It represents either a successful value (`Ok`) or an error (`Err`).

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

Let's start with a simple example:

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("Result: {result}"),
        Err(error) => println!("Error: {error}"),
    }

    match divide(10.0, 0.0) {
        Ok(result) => println!("Result: {result}"),
        Err(error) => println!("Error: {error}"),
    }
}
```

In this example, we use pattern matching to handle both success and error cases.

## Using the `?` Operator

---

The `?` operator in Rust provides a concise way to propagate errors up the call stack. It's a shorthand for a match expression that returns early if an error is encountered.

### Basic Usage

Let's start with a simple example:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file_contents(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn main() {
    match read_file_contents("example.txt") {
        Ok(contents) => println!("File contents: {contents}"),
        Err(error) => println!("Error reading file: {error}"),
    }
}
```

In this example, the `?` operator is used twice. If `File::open` returns an `Err`, the function will immediately return that error. The same applies to the `read_to_string` method. The `?` operator automatically unwraps the `Ok` value or returns the `Err` value from the function.

### Chaining Operations with `?`

The `?` operator really shines when you need to chain multiple fallible operations:

```rust
use std::fs::File;
use std::io::{self, Read, Write};

fn copy_file(source: &str, destination: &str) -> Result<(), io::Error> {
    let mut source_file = File::open(source)?;
    let mut destination_file = File::create(destination)?;
    
    let mut buffer = Vec::new();
    source_file.read_to_end(&mut buffer)?;
    destination_file.write_all(&buffer)?;
    
    Ok(())
}

fn main() {
    if let Err(e) = copy_file("source.txt", "destination.txt") {
        eprintln!("Failed to copy file: {e}");
    }
}
```

Here, we use `?` four times to handle potential errors from opening the source file, creating the destination file, reading from the source, and writing to the destination.

### Error Type Conversion with `?`

The `?` operator works seamlessly with the `From` trait to convert between error types. This is particularly useful when you have a custom error type:

```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)]
enum CustomError {
    IoError(std::io::Error),
    ParseError(std::num::ParseIntError),
    Other(String),
}

impl fmt::Display for CustomError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            CustomError::IoError(e) => write!(f, "I/O error: {}", e),
            CustomError::ParseError(e) => write!(f, "Parse error: {}", e),
            CustomError::Other(s) => write!(f, "Other error: {}", s),
        }
    }
}

impl Error for CustomError {}

impl From<std::io::Error> for CustomError {
    fn from(error: std::io::Error) -> Self {
        CustomError::IoError(error)
    }
}

impl From<std::num::ParseIntError> for CustomError {
    fn from(error: std::num::ParseIntError) -> Self {
        CustomError::ParseError(error)
    }
}

fn read_and_parse(path: &str) -> Result<i32, CustomError> {
    let contents = std::fs::read_to_string(path)?;
    let number = contents.trim().parse::<i32>()?;
    Ok(number)
}

fn main() {
    match read_and_parse("number.txt") {
        Ok(number) => println!("Number: {number}"),
        Err(error) => println!("Error: {error}"),
    }
}
```

This example demonstrates how to create a custom error type that can represent multiple error scenarios and implement the necessary traits.

```rust
use std::fs::File;
use std::io::{self, Read};
use std::num::ParseIntError;

#[derive(Debug)]
enum CustomError {
    IoError(io::Error),
    ParseError(ParseIntError),
}

impl From<io::Error> for CustomError {
    fn from(error: io::Error) -> Self {
        CustomError::IoError(error)
    }
}

impl From<ParseIntError> for CustomError {
    fn from(error: ParseIntError) -> Self {
        CustomError::ParseError(error)
    }
}

fn read_and_parse(path: &str) -> Result<i32, CustomError> {
    let mut file = File::open(path)?;  // This `?` converts io::Error to CustomError
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;  // This `?` also converts io::Error to CustomError
    let number = contents.trim().parse::<i32>()?;  // This `?` converts ParseIntError to CustomError
    Ok(number)
}

fn main() {
    match read_and_parse("number.txt") {
        Ok(n) => println!("The number is: {n}"),
        Err(e) => eprintln!("An error occurred: {e:?}"),
    }
}
```

In this example, the `?` operator automatically converts `io::Error` and `ParseIntError` to our `CustomError` type, thanks to the `From` implementations.

### Using `?` in `main()`

You can use `?` in `main()` if the return type is `Result<(), E>`:

```rust
use std::fs::File;
use std::io::{self, Read};

fn main() -> Result<(), io::Error> {
    let mut file = File::open("example.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    println!("File contents: {contents}");
    Ok(())
}
```

This approach can simplify error handling in small programs or scripts.

### Limitations of `?`

It's important to note that `?` can only be used in functions that return a `Result` or `Option`. It cannot be used in functions with other return types or in closures that don't return `Result` or `Option`.
By leveraging the `?` operator effectively, you can write more concise and readable error-handling code in Rust, especially when dealing with chains of fallible operations.

## Async Error Handling with `Box<dyn Error>`

---

When working with asynchronous code, you might encounter situations where you need to return errors from different sources. Here's an example using `Box<dyn Error>`:

```rust
use tokio;
use std::error::Error;
use std::fs::File;
use std::io::Read;

async fn fetch_url(url: &str) -> Result<String, Box<dyn Error>> {
    let response = reqwest::get(url).await?;
    let body = response.text().await?;
    Ok(body)
}

async fn read_file(path: &str) -> Result<String, Box<dyn Error>> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

async fn process_data(url: &str, file_path: &str) -> Result<(), Box<dyn Error>> {
    let (web_data, file_data) = tokio::join!(
        fetch_url(url),
        read_file(file_path)
    );

    let web_content = web_data?;
    let file_content = file_data?;

    println!("Web content length: {}", web_content.len());
    println!("File content length: {}", file_content.len());

    Ok(())
}

#[tokio::main]
async fn main() {
    match process_data("https://example.com", "example.txt").await {
        Ok(()) => println!("Processing completed successfully"),
        Err(error) => println!("Error: {error}"),
    }
}
```

In this async example, we use `Box<dyn Error>` to handle errors from different sources in a unified way. The `?` operator works seamlessly with `Box<dyn Error>`, allowing for easy error propagation in async contexts.

## Error Handling with the `anyhow` Crate

---

The `anyhow` crate offers Rust developers a convenient way to handle errors in their applications by providing the `anyhow::Error` trait object-based error type. This crate simplifies the process of error handling and propagation, allowing for more idiomatic and concise code.

- A `Result` type alias that uses `anyhow::Error` as its error type.
- The `Context` trait, which allows adding additional context to errors.
- Easy conversion of various error types into `anyhow::Error`.

### Using `anyhow::Result`

The recommended way to use `anyhow` is to employ `Result<T, anyhow::Error>`, or its equivalent `anyhow::Result<T>`, as the return type for any fallible function. Within the function, you can use the `?` operator to propagate any error that implements the `std::error::Error` trait.

### Usage Example

Example of serialization and deserialization using the `serde` crate, combined with error handling using the `anyhow` crate. The code defines a `ClusterMap` struct that represents a cluster configuration, with a single field `nodes` which is a vector of strings. The `get_cluster_info` function reads a configuration file named `cluster.json`, parses it into a `ClusterMap` instance, and returns it, handling any errors that may occur during file reading or parsing.

In the `main` function, a JSON string representing a cluster configuration is written to a file named `cluster.json`. Then, the `get_cluster_info` function is called to retrieve the cluster information, which is then printed to the console. The use of `anyhow` allows for a more flexible error handling, where any error encountered during the file writing or reading process is converted into an `anyhow::Error`, with a custom error message that includes the original error. This makes the code robust and user-friendly by providing clear error messages while maintaining simplicity and readability. The `main` function is designed to return a `Result`, which means it will either complete successfully or return an error if any step in the process fails.

```rust
use anyhow::{ anyhow, Result };
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct ClusterMap {
    nodes: Vec<String>,
}

fn get_cluster_info() -> Result<ClusterMap> {
    let config = std::fs::read_to_string("cluster.json")?;
    let map: ClusterMap = serde_json::from_str(&config)?;
    Ok(map)
}

fn main() -> Result<()> {
    let cluster_json = r#"
    {
        "nodes": ["node1", "node2", "node3"]
    }
    "#;

    std::fs
        ::write("cluster.json", cluster_json)
        .map_err(|e| anyhow!("Failed to write cluster.json: {}", e))?;

    let cluster_map = get_cluster_info()?;

    println!("Cluster nodes: {:?}", cluster_map.nodes);

    Ok(())
}
```

### Another Usage Example

```rust
use serde::Deserialize;
use std::fs;
use anyhow::{ Context, Result };
use std::time::Duration;

#[derive(Debug, Deserialize)]
struct Config {
    server: ServerConfig,
    database: DatabaseConfig,
    api: ApiConfig,
}

#[derive(Debug, Deserialize)]
struct ServerConfig {
    host: String,
    port: u16,
}

#[derive(Debug, Deserialize)]
struct DatabaseConfig {
    url: String,
    max_connections: u32,
}

#[derive(Debug, Deserialize)]
struct ApiConfig {
    key: String,
    timeout_seconds: u64,
}

fn read_config() -> Result<Config> {
    let config_path = "server.toml";
    let config_str = fs
        ::read_to_string(config_path)
        .with_context(|| format!("Failed to read config file: {}", config_path))?;

    let config: Config = toml::from_str(&config_str).context("Failed to parse config file")?;

    Ok(config)
}

struct Server {
    host: String,
    port: u16,
}

impl Server {
    fn new(config: &ServerConfig) -> Self {
        Server {
            host: config.host.clone(),
            port: config.port,
        }
    }

    fn start(&self) {
        println!("Starting server on {}:{}", self.host, self.port);
    }
}

struct Database {
    url: String,
    max_connections: u32,
}

impl Database {
    fn new(config: &DatabaseConfig) -> Self {
        Database {
            url: config.url.clone(),
            max_connections: config.max_connections,
        }
    }

    fn connect(&self) {
        println!("Connecting to database: {}", self.url);
        println!("Max connections: {}", self.max_connections);
    }
}

struct ApiClient {
    key: String,
    timeout: Duration,
}

impl ApiClient {
    fn new(config: &ApiConfig) -> Self {
        ApiClient {
            key: config.key.clone(),
            timeout: Duration::from_secs(config.timeout_seconds),
        }
    }

    fn make_request(&self) {
        println!("Making API request with key: {}", self.key);
        println!("Request timeout: {:?}", self.timeout);
    }
}

fn main() -> Result<()> {
    let config = read_config()?;

    let server = Server::new(&config.server);
    let database = Database::new(&config.database);
    let api_client = ApiClient::new(&config.api);

    server.start();
    database.connect();
    api_client.make_request();

    println!("Application successfully initialized and running");

    Ok(())
}
```

Now, let's break down the code example:

1. The code defines a configuration structure using `serde` for deserialization:

    ```rust
    #[derive(Debug, Deserialize)]
    struct Config {
        server: ServerConfig,
        database: DatabaseConfig,
        api: ApiConfig,
    }

    // ... (other config structs)
    ```

2. The `read_config` function demonstrates how to use `anyhow`:

    ```rust
    fn read_config() -> Result<Config> {
        let config_path = "server.toml";
        let config_str = fs
            ::read_to_string(config_path)
            .with_context(|| format!("Failed to read config file: {}", config_path))?;

        let config: Config = toml::from_str(&config_str).context("Failed to parse config file")?;

        Ok(config)
    }
    ```

    Here, `Result<Config>` is actually `anyhow::Result<Config>`. The `with_context` method adds additional context to the error if reading the file fails. The `context` method does the same for the parsing step.

3. The code defines `Server`, `Database`, and `ApiClient` structs with their respective methods.

4. The `main` function ties everything together:

    ```rust
    fn main() -> Result<()> {
        let config = read_config()?;

        let server = Server::new(&config.server);
        let database = Database::new(&config.database);
        let api_client = ApiClient::new(&config.api);

        server.start();
        database.connect();
        api_client.make_request();

        println!("Application successfully initialized and running");

        Ok(())
    }
    ```

    The `main` function `returns Result<()>`, which is `anyhow::Result<()>`. This allows it to use the `?` operator to propagate errors from `read_config` and potentially other functions that might fail.

The key benefits of using `anyhow` in this example are:

- Simplified error handling
    You don't need to define custom error types or implement Error traits.

- Easy error context
    The `context` and `with_context` methods allow adding meaningful error messages.

- Unified error type
    Different error types (IO errors, parsing errors, etc.) are all converted to `anyhow::Error`.

- Ergonomic propagation
    The `?` operator works seamlessly with `anyhow::Result`.

This approach is particularly useful in application code where you're more interested in reporting errors than handling them individually, and where you don't need to make decisions based on the specific error type.

## Error Handling with the `thiserror` Crate

---

The `thiserror` crate is a lightweight and convenient tool for defining custom error types in Rust. It's particularly useful when you need to create specific error types for your library or application, as it reduces boilerplate code and makes error definitions more readable.

### Key Features of `thiserror`

- Derive macro for implementing `std::error::Error`.
- Automatic `Display` implementation based on the error message in the attributes.
- Support for wrapping other errors and adding context.

### Example

Let's create an example that demonstrates how to use `thiserror` to define custom errors for a simple file processing application. This example will include errors for file operations, parsing, and a custom application error.

```rust
use std::fs;
use std::path::Path;
use std::num::ParseIntError;
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
    #[error("Failed to read file: {0}")]
    FileReadError(#[from] std::io::Error),

    #[error("Failed to parse integer: {0}")]
    ParseError(#[from] ParseIntError),

    #[error("Invalid data: {0}")]
    InvalidData(String),

    #[error("Processing error")]
    ProcessingError,
}

fn read_and_process_file(path: &Path) -> Result<i32, AppError> {
    let content = fs::read_to_string(path)?;
    let numbers: Vec<i32> = content
        .lines()
        .map(|line| line.parse().map_err(AppError::from))
        .collect::<Result<_, _>>()?;

    if numbers.is_empty() {
        return Err(AppError::InvalidData("File contains no numbers".to_string()));
    }

    let sum: i32 = numbers.iter().sum();
    if sum == 0 {
        return Err(AppError::ProcessingError);
    }

    Ok(sum)
}

fn main() -> Result<(), AppError> {
    let path = Path::new("numbers.txt");
    
    match read_and_process_file(path) {
        Ok(sum) => println!("The sum of numbers in the file is: {sum}"),
        Err(e) => eprintln!("An error occurred: {e}"),
    }

    Ok(())
}
```

In this example:

1. We define an `AppError` enum using the `#[derive(Error, Debug)]` attribute from `thiserror`.
2. Each variant of `AppError` is annotated with an `#[error("...")]` attribute, which automatically implements the `Display` trait.
3. We use `#[from]` attributes to automatically implement `From` traits for converting from standard library errors.
4. The `read_and_process_file` function demonstrates how to use our custom error type. It reads a file, parses each line as an integer, sums the numbers, and returns the result or an appropriate error.
5. In the `main` function, we use our custom error type to handle potential errors from `read_and_process_file`.

This code compiles without warnings and provides a clear, type-safe way to handle errors in our application. The `thiserror` crate simplifies the process of creating custom error types, making the code more maintainable and easier to reason about.
Using `thiserror` is particularly beneficial when you're creating a library or when you need fine-grained control over your error types. It allows you to create rich, domain-specific errors while minimizing boilerplate code.
