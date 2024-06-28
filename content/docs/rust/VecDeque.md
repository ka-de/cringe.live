---
weight: 2
bookFlatSection: false
bookToC: false
title: "VecDeque"
summary: "Explains how the `BufRead` trait in Rust was implemented for `VecDeque<u8>` in Rust 1.75, allowing efficient buffered reading from a **double-ended queue** with examples demonstrating its usage."
---

<!--markdownlint-disable MD025 -->

# VecDeque

---

The `BufRead` trait in Rust is an extension of the `Read` trait that adds functionality for working with buffered readers. A buffered reader is a type of reader that keeps an internal buffer of data and provides methods for reading from this buffer.

In Rust 1.75, the `BufRead` trait was implemented for `VecDeque<u8>`. This means that you can now use `VecDeque<u8>` as a buffered reader.

`VecDeque` is a double-ended queue implemented with a growable ring buffer. It's essentially a more flexible version of `Vec` that allows efficient push and pop operations at both ends. However, because `VecDeque` is a ring buffer, its elements are not necessarily contiguous in memory⁵.

By implementing `BufRead` for `VecDeque<u8>`, Rust 1.75 made it possible to efficiently read from a `VecDeque<u8>` in a buffered manner. This is particularly useful when you're working with I/O operations where the data may not be available all at once.

Here are two examples of how you can use this feature:

## Example 1

---

Reading from a `VecDeque<u8>`

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

## Example 2

---

Using `BufRead` methods with `VecDeque<u8>`**

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

## Example 3

---

Let’s consider a game where each game state is represented by a struct `GameState`. The `GameState` includes the player’s position, score, and other relevant information. We’ll use `serde`, a Rust library for serializing and deserializing data, to convert the `GameState` to bytes and vice versa.

Here’s how you might implement this:

```rust
use std::collections::VecDeque;
use std::io::{self, BufRead, Read, Write};
use serde::{Serialize, Deserialize};
use bincode;

#[derive(Serialize, Deserialize, Debug)]
struct GameState {
    player_x: f32,
    player_y: f32,
    score: u32,
}

struct GameStateReader {
    states: VecDeque<u8>,
}

impl Read for GameStateReader {
    fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
        let mut bytes_read = 0;
        while bytes_read < buf.len() {
            match self.states.pop_front() {
                Some(state) => {
                    buf[bytes_read] = state;
                    bytes_read += 1;
                }
                None => break,
            }
        }
        Ok(bytes_read)
    }
}

impl BufRead for GameStateReader {
    fn fill_buf(&mut self) -> io::Result<&[u8]> {
        Ok(self.states.make_contiguous())
    }

    fn consume(&mut self, amt: usize) {
        self.states.drain(..amt);
    }
}

fn main() {
    let game_state = GameState {
        player_x: 10.0,
        player_y: 20.0,
        score: 1000,
    };

    // Serialize the game state to bytes
    let bytes = bincode::serialize(&game_state).unwrap();

    // Push the bytes into the VecDeque
    let mut reader = GameStateReader {
        states: VecDeque::from(bytes),
    };

    // Create a buffer and read the game state into it
    let mut buffer = vec![0; bincode::serialized_size(&game_state).unwrap() as usize];
    reader.read_exact(&mut buffer).unwrap();

    // Deserialize the buffer back into a game state
    let game_state: GameState = bincode::deserialize(&buffer).unwrap();
    println!("{game_state:?}");
}
```

In this example, `GameStateReader` is a wrapper around `VecDeque<u8>` that implements the `BufRead` trait. The `read` method pops game states from the front of the queue and writes them into a buffer. The `fill_buf` and `consume` methods are used for buffered reading. In the `main` function, we serialize a `GameState` into bytes, push them into the `VecDeque`, read them back into a buffer, and then deserialize the buffer back into a `GameState`.
