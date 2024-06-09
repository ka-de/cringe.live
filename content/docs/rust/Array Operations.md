---
weight: 1
bookFlatSection: false
bookToC: true
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
fn main() {
    let mut numbers = vec![4, 6, 3, 10, 51, 1, 152, 616, 25195, 259125];

    let target = 152;
    match numbers.binary_search(&target) {
        Ok(index) => println!("Found {} at index {}", target, index),
        Err(_) => println!("{} not found in the array", target),
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
fn main() {
    let numbers = vec![4, 6, 3, 10, 51, 1, 152, 616, 25195, 259125];
    let squared_numbers: Vec<_> = numbers
        .iter()
        .map(|&x| (x as i64) * (x as i64))
        .collect();
    println!("Squared numbers: {:?}", squared_numbers);
}
```

## Custom Comparator

Sort by a custom comparator:

```rust
fn main() {
    let mut numbers = vec![4, 6, 3, 10, 51, 1, 152, 616, 25195, 259125];
    numbers.sort_by(|a, b| b.cmp(a)); // sort in descending order
    println!("Sorted in descending order: {:?}", numbers);
}
```

## Sorting Structs

You can sort a vector of structs, like this code, which creates a vector of `Person` structs and sorts them by age in ascending order. After sorting, it prints each person’s name and age.

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u32,
}

fn main() {
    let mut people = vec![
        Person { name: "Alice".to_string(), age: 25 },
        Person { name: "Bob".to_string(), age: 30 },
        Person { name: "Charlie".to_string(), age: 22 }
    ];

    people.sort_by_key(|p| p.age);
    for person in &people {
        println!("{} is {} years old", person.name, person.age);
    }
}
```

## Deduplication

Remove duplicates:

```rust
fn main() {
    let mut numbers = vec![4, 6, 4, 3, 10, 10, 51, 1, 152, 200, 616, 200, 25195, 259125];
    numbers.sort();
    numbers.dedup();
    println!("Deduplicated: {:?}", numbers);
}
```

## Finding Elements

1. **Find the first even number in a vector:** The `numbers.iter().find(|&&x| x % 2 == 0)` line iterates over the `numbers` vector and uses the `find` method to return the first number that satisfies the condition `x % 2 == 0`, which checks if a number is even. The result (which is an `Option`) is stored in `first_even`. The `match` statement then checks this `Option`. If an even number is found (`Some(&number)`), it prints "First even number: {number}". If no even number is found (`None`), it prints "No even number found".

2. **Find the index of the first number greater than 100 in the vector:** The `numbers.iter().position(|&x| x > 100)` line iterates over the `numbers` vector and uses the `position` method to return the index of the first number that satisfies the condition `x > 100`. The result (which is an `Option`) is stored in `position`. The `match` statement then checks this `Option`. If a number greater than 100 is found (`Some(index)`), it prints "Index of first number > 100: {index}". If no such number is found (`None`), it prints "No number > 100 found".

```rust
fn main() {
    let numbers = vec![4, 6, 4, 3, 10, 10, 51, 1, 152, 200, 616, 200, 25195, 259125];
    let first_even = numbers.iter().find(|&&x| x % 2 == 0);
    match first_even {
        Some(&number) => println!("First even number: {}", number),
        None => println!("No even number found"),
    }

    let position = numbers.iter().position(|&x| x > 100);
    match position {
        Some(index) => println!("Index of first number > 100: {}", index),
        None => println!("No number > 100 found"),
    }
}
```

## Folding (Reducing)

```rust
fn main() {
    let numbers = vec![4, 6, 4, 3, 10, 10, 51, 1, 152, 200, 616, 200, 25195, 259125];
    let sum: i32 = numbers.iter().fold(0, |acc, &x| acc + x);
    println!("Sum: {}", sum);
    let product: f64 = numbers
        .iter()
        .map(|&x| x as f64)
        .fold(1.0, |acc, x| acc * x);
    println!("Product: {}", product);
}
```

## Capacity and Length

```rust
fn main() {
    let mut v = Vec::with_capacity(10);
    v.push(1);
    v.push(2);

    println!("Length: {}, Capacity: {}", v.len(), v.capacity());
}
```

## Shrinking to Fit

```rust
    v.shrink_to_fit();
    println!("After shrink_to_fit - Length: {}, Capacity: {}", v.len(), v.capacity());
```
