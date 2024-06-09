---
weight: 1
bookFlatSection: false
bookToC: false
title: "vec Operations"
---

<!--markdownlint-disable MD025 MD033 -->

# vec Operations

---

## Introduction

Vectors (`Vec<T>`) are one of the most commonly used collection types in Rust. They provide a growable array that can hold elements of the same type. Let's explore various operations you can perform on vectors using a `Vec<i32>` as an example:

```rust
fn main() {
    let mut numbers = vec![4, 6, 3, 10, 51, 1, 152, 616, 25195, 259125];
}
```

## Sorting

We can sort this using `sort()`.

```rust
    numbers.sort();
    println!("Sorted numbers: {:?}", numbers);
```

## Binary Search

We can perform a binary search on this:

```rust
fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len() - 1;

    while left <= right {
        let mid = left + (right - left) / 2;

        if arr[mid] == target {
            return Some(mid);
        } else if arr[mid] < target {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    None
}

fn main() {
    let mut numbers = vec![4, 6, 3, 10, 51, 1, 152, 616, 25195, 259125];
    numbers.sort();

    println!("Sorted numbers: {:?}", numbers);

    let target = 152;
    match binary_search(&numbers, target) {
        Some(index) => println!("Found {} at index {}", target, index),
        None => println!("{} not found in the array", target),
    }
}
```

## Filtering

We can filter elements based on a predicate using `filter()`:

```rust
fn main() {
    let numbers = vec![4, 6, 3, 10, 51, 1, 152, 616, 25195, 259125];
    let even_numbers: Vec<_> = numbers
        .iter()
        .filter(|&&x| x % 2 == 0)
        .collect();
    println!("Even numbers: {:?}", even_numbers);
}
```

## Mapping

Transform elements using `map()`:

```rust
let squared_numbers: Vec<_> = numbers.iter().map(|&x| x * x).collect();
println!("Squared numbers: {:?}", squared_numbers);
```

## Custom Comparator

Sort by a custom comparator:

```rust
numbers.sort_by(|a, b| b.cmp(a)); // sort in descending order
println!("Sorted in descending order: {:?}", numbers);
```

## Sorting Structs

Sort a vector of structs:

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u32,
}

let mut people = vec![
    Person { name: "Alice".to_string(), age: 25 },
    Person { name: "Bob".to_string(), age: 30 },
    Person { name: "Charlie".to_string(), age: 22 },
];

people.sort_by_key(|p| p.age);
println!("Sorted by age: {:?}", people);
```

## Deduplication

Remove duplicates:

```rust
numbers.sort();
numbers.dedup();
println!("Deduplicated: {:?}", numbers);
```

## Finding Elements

```rust
let first_even = numbers.iter().find(|&&x| x % 2 == 0);
println!("First even number: {:?}", first_even);

let position = numbers.iter().position(|&x| x > 100);
println!("Index of first number > 100: {:?}", position);
```

## Folding (Reducing)

```rust
let sum: i32 = numbers.iter().fold(0, |acc, &x| acc + x);
println!("Sum: {}", sum);

let product: i32 = numbers.iter().fold(1, |acc, &x| acc * x);
println!("Product: {}", product);
```

## Capacity and Length

```rust
let mut v = Vec::with_capacity(10);
v.push(1);
v.push(2);

println!("Length: {}, Capacity: {}", v.len(), v.capacity());
```

## Shrinking to Fit

```rust
v.shrink_to_fit();
println!("After shrink_to_fit - Length: {}, Capacity: {}", v.len(), v.capacity());
```
