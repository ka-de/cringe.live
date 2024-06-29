---
weight: 3
bookFlatSection: false
bookToC: false
title: "Visibility"
summary: "Explains how to control the visibility of functions and other items in Rust using the pub keyword, including examples of public, crate-level, and private visibility."
---

<!--markdownlint-disable MD025 MD033 -->

# Visibility

---

In Rust, the visibility of functions, structs, and other items is controlled by the `pub` keyword. However, `pub` can be further refined using the `crate` keyword to limit the visibility to the current crate only. Let’s look at some examples:

```rust
// lib.rs in crate 'my_crate'

// This function is public for the entire project, including other crates
pub fn public_function() {
    println!("This function can be accessed from anywhere");
}

// This function is only public within the current crate
pub(crate) fn crate_function() {
    println!("This function can only be accessed within 'my_crate'");
}

// This function is private, and can only be accessed within this module
fn private_function() {
    println!("This function can only be accessed within this module");
}
```

Now, let’s say we have another crate in our project:

```rust
// main.rs in crate 'my_project'

// Import 'my_crate'
extern crate my_crate;

fn main() {
    // This will work, because 'public_function' is public
    my_crate::public_function();

    // This will not compile, because 'crate_function' is not visible here
    my_crate::crate_function();

    // This will not compile, because 'private_function' is not visible here
    my_crate::private_function();
}
```

In the `main.rs` file, we can only access public_function from `my_crate`. We can’t access `crate_function` or `private_function` because they are not visible in this scope. `crate_function` is only visible within `my_crate`, and `private_function` is only visible within its module.

This is a powerful feature of Rust’s module system, allowing you to control the visibility of your code in a granular way. It helps in encapsulating the implementation details and exposing only the necessary API to the outside world.
