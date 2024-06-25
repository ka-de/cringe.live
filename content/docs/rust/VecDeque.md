---
weight: 2
bookFlatSection: false
bookToC: false
title: "VecDeque"
summary: ""
---

<!--markdownlint-disable MD025 -->

# VecDeque

The `BufRead` trait in Rust is an extension of the `Read` trait that adds functionality for working with buffered readers. A buffered reader is a type of reader that keeps an internal buffer of data and provides methods for reading from this buffer.

In Rust 1.75, the `BufRead` trait was implemented for `VecDeque<u8>`. This means that you can now use `VecDeque<u8>` as a buffered reader.

`VecDeque` is a double-ended queue implemented with a growable ring buffer. It's essentially a more flexible version of `Vec` that allows efficient push and pop operations at both ends. However, because `VecDeque` is a ring buffer, its elements are not necessarily contiguous in memory⁵.

By implementing `BufRead` for `VecDeque<u8>`, Rust 1.75 made it possible to efficiently read from a `VecDeque<u8>` in a buffered manner. This is particularly useful when you're working with I/O operations where the data may not be available all at once.

Here are two examples of how you can use this feature:

**Example 1: Reading from a `VecDeque<u8>`**

```rust
use std::collections::VecDeque;
use std::io::BufRead;

let mut buf = VecDeque::from(vec![1, 2, 3, 4, 5]);
let mut target = Vec::new();

// Read all bytes from `buf` into `target`.
buf.read_to_end(&mut target).unwrap();

assert_eq!(target, vec![1, 2, 3, 4, 5]);
```

In this example, we create a `VecDeque<u8>` from a `Vec<u8>`, and then read all bytes from the `VecDeque<u8>` into another `Vec<u8>` using the `read_to_end` method from the `BufRead` trait.

**Example 2: Using `BufRead` methods with `VecDeque<u8>`**

```rust
use std::collections::VecDeque;
use std::io::BufRead;

let mut buf = VecDeque::from(vec![1, 2, 3, 4, 5]);

// Get a reference to the internal buffer.
let data = buf.fill_buf().unwrap();
assert_eq!(data, &[1, 2, 3, 4, 5]);

// Consume some bytes.
buf.consume(3);

// Now the internal buffer starts from the next unconsumed byte.
let data = buf.fill_buf().unwrap();
assert_eq!(data, &[4, 5]);
```

In this example, we use the `fill_buf` and `consume` methods from the `BufRead` trait to interact with the internal buffer of a `VecDeque<u8>`.
