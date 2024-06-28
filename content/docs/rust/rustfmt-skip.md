---
weight: 1
bookFlatSection: false
bookToC: false
title: "#[rustfmt::skip]"
summary: "An attribute you can place above code to tell `rustfmt` not to format it."
---

<!--markdownlint-disable MD025 MD033 -->

# #[rustfmt::skip]

---

The `#[rustfmt::skip]` attribute is a directive you can place above a piece of code to tell `rustfmt` to ignore it during formatting. This is useful when you have a specific formatting style that you want to preserve, which might otherwise be altered by `rustfmt`.

```rust
#[rustfmt::skip]
let data = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];
```

In the above example, the `#[rustfmt::skip]` attribute ensures that the manually formatted array stays in its table-like format.

While `rustfmt` is great for keeping your codebase consistent, there are times when manual formatting makes the code more readable. For instance, when aligning match arms, or when organizing numerical data in a table-like format.
