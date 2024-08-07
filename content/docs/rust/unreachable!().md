---
weight: 1
bookFlatSection: false
bookToC: false
title: "unreachable!()"
summary: "Explains the unreachable!() macro in Rust, which is used to mark code sections that should never be reached, causing the program to panic if executed."
---

<!--markdownlint-disable MD025 MD033 -->

# unreachable!()

---

The `unreachable!()` macro in Rust is used to indicate a section of the code that should never be reached under normal circumstances. It’s useful in places where the compiler can’t determine that some code is unreachable.

If the execution of the program ever does reach a point marked with `unreachable!()`, the program will immediately panic and terminate. This is because `unreachable!()` is essentially a shorthand for `panic!()` with a specific message indicating that unreachable code was reached.

Here’s an example:

```rust
fn foo(x: Option<i32>) {
    match x {
        Some(n) if n >= 0 => println!("Some(Non-negative)"),
        Some(n) if n < 0 => println!("Some(Negative)"),
        Some(_) => unreachable!(),  // This line should never be reached
        None => println!("None"),
    }
}
```

In this example, if `foo` is called with an `Option<i32>` that matches `Some(_)` but doesn’t match either of the conditions `n >= 0` or `n < 0`, the `unreachable!()` macro will cause the program to panic.

It’s important to note that if the `unreachable!()` macro is used incorrectly and the code does reach that point, it could lead to a program crash. Therefore, it should be used with caution and only when you’re certain that the code section cannot be reached.
