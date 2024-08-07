---
weight: 5
bookFlatSection: false
bookToC: true
title: "bytemuck"
summary: "The `bytemuck` crate offers Rust developers a safe, zero-cost way to perform type transmutations, crucial for low-level systems programming and interfacing with foreign data structures."
---

<!--markdownlint-disable MD025 MD033 -->

# bytemuck

---

The `bytemuck` crate is a Rust library that provides a safe and zero-cost way to transmute data between different types, which can be useful when working with low-level systems programming or interacting with libraries that expect data in a specific layout.

> NOTE: Some of these examples require the `derive` cargo feature!

## Casting Basics

---

The crate offers five basic casting functions:

- `cast`: For casting values of type `T`.
- `cast_ref`: For casting references `&T`.
- `cast_mut`: For casting mutable references `&mut T`.
- `cast_slice`: For casting slices `&[T]`.
- `cast_slice_mut`: For casting mutable slices `&mut [T]`.

### Using `cast` to transmute a `u32` to an `f32`

```rust
fn casting_example() {
    use bytemuck::cast;

    let x: u32 = 0x3f800000;
    let y: f32 = cast(x); // y == 1.0

    assert_eq!(y, 1.0);
    println!("x: {x} y: {y}");
}
```

### Casting a reference to a different type

```rust
fn cast_ref_example() {
    use bytemuck::{ cast_ref, Pod, Zeroable };

    #[derive(Copy, Clone, Pod, Zeroable)]
    #[repr(C)]
    struct Point {
        x: f32,
        y: f32,
    }

    let point = Point { x: 1.0, y: 2.0 };
    let point_ref: &Point = &point;
    let raw_bytes: &[u8; std::mem::size_of::<Point>()] = cast_ref(point_ref);
    assert_eq!(raw_bytes, &[0, 0, 128, 63, 0, 0, 0, 64]);
    println!("Raw bytes: {raw_bytes:?}");
}
```

### Casting a mutable slice

```rust
fn cast_slice_mut_example() {
    use bytemuck::{ cast_slice_mut, Pod, Zeroable };

    #[derive(Copy, Clone, Pod, Zeroable, Debug, PartialEq)]
    #[repr(C)]
    struct Color {
        r: u8,
        g: u8,
        b: u8,
        a: u8,
    }

    let mut colors = [
        Color { r: 255, g: 0, b: 0, a: 255 },
        Color { r: 0, g: 255, b: 0, a: 255 },
    ];
    println!("Original colors: {colors:?}");

    let color_slice: &mut [Color] = &mut colors;
    let bytes_slice: &mut [u8] = cast_slice_mut(color_slice);
    // Modify the color values through the byte slice
    bytes_slice[0] = 128; // Change the red component of the first color

    assert_eq!(colors, [
        Color { r: 128, g: 0, b: 0, a: 255 },
        Color { r: 0, g: 255, b: 0, a: 255 },
    ]);
    println!("Modified colors: {colors:?}");
}
```

### Using `try_cast` for fallible casting

```rust
fn try_cast_example() {
    use bytemuck::{ try_cast, Pod, Zeroable };

    #[derive(Copy, Clone, Pod, Zeroable, Debug)]
    #[repr(C)]
    struct Vertex {
        position: [f32; 3],
        tex_coords: [f32; 2],
    }

    let vertex_data = [0.0f32; 5]; // Some vertex data
    match try_cast::<[f32; 5], Vertex>(vertex_data) {
        Ok(vertex) => println!("Vertex: {vertex:?}"),
        Err(e) => eprintln!("Failed to cast: {e:?}"),
    }
}
```

<!-- ⚠️ TODO: Extend!
## Traits

---

The functions use traits like `NoUninit` and `AnyBitPattern` to maintain memory safety. Types that implement `Pod` also support these traits.

## Failures

---

Some casts will never fail, such as `cast::<u32, f32>`, while others might fail due to alignment issues, like `cast_ref::<[u8; 4], u32>`.

## Error Handling

---

There are `try_` versions of each function that return a `Result` instead of panicking on invalid input.

## Using Your Own Types

---

You can derive the necessary traits on your own types using the crate's `derive` feature. If the derive macros don't cover your case, you can implement the traits manually, but they are `unsafe` and should be used with caution.

## Cargo Features

---

The crate supports various cargo features like `derive`, `extern_crate_alloc`, and `min_const_generics` among others.
-->