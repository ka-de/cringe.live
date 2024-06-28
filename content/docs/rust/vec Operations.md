---
weight: 1
bookFlatSection: false
bookToC: true
title: "vec Operations"
summary: "Provides an overview of various operations you can perform on vectors in Rust, including sorting, searching, filtering, mapping, custom comparators, deduplication, finding elements, folding, and managing capacity and length."
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
    println!("Sorted numbers: {numbers:?}");
```

## Binary Search

We can perform a binary search on this:

```rust
fn main() {
    let mut numbers = vec![4, 6, 3, 10, 51, 1, 152, 616, 25195, 259125];

    // In order to use binary search properly you need to sort the vector first!
    numbers.sort();

    let target = 152;
    match numbers.binary_search(&target) {
        Ok(index) => println!("Found {target} at index {index}"),
        Err(_) => println!("{target} not found in the array"),
    }
}
```

An alternative for unsorted arrays is to use linear search ($O(n)$ time).

```rust
    match numbers.iter().position(|&x| x == target) {
        Some(index) => println!("Found {target} at index {index}"),
        None => println!("{target} not found in the array"),
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
    println!("Even numbers: {even_numbers:?}");
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
    println!("Squared numbers: {squared_numbers:?}");
}
```

## Custom Comparator

You can pass a custom comparator function to the `sort_by` method to sort a vector in a specific way. The comparator function takes two arguments and returns an `Ordering` (`Less`, `Equal`, or `Greater`). Here’s an example of sorting in descending order:

```rust
fn main() {
    let mut numbers = vec![4, 6, 3, 10, 51, 1, 152, 616, 25195, 259125];
    numbers.sort_by(|a, b| b.cmp(a)); // sort in descending order
    println!("Sorted in descending order: {numbers:?}");
}
```

In this code `numbers.sort_by(|a, b| b.cmp(a));` sorts the `numbers` vector in descending order. The comparator function `|a, b| b.cmp(a)` compares `b` with `a`. If `b` is less than `a`, `Less` is returned. If `b` is equal to `a`, `Equal` is returned. If `b` is greater than `a`, `Greater` is returned. Since `sort_by` sorts in ascending order by default, returning `Greater` when `b` is greater than `a` results in a descending sort. The sorted vector is then printed.

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

You can manually implement the `Ord` trait on your `Person` struct to define a custom sorting order. Here’s how:

```rust
use std::cmp::Ordering;

#[derive(Debug, Eq, PartialEq)]
struct Person {
    name: String,
    age: u32,
}

impl Ord for Person {
    fn cmp(&self, other: &Self) -> Ordering {
        self.age.cmp(&other.age)
    }
}

impl PartialOrd for Person {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn main() {
    let mut people = vec![
        Person { name: "Alice".to_string(), age: 25 },
        Person { name: "Bob".to_string(), age: 30 },
        Person { name: "Charlie".to_string(), age: 22 }
    ];

    people.sort();

    for person in &people {
        println!("{person:?}");
    }
}
```

In this example, the `Person` struct is sorted by `age`. The `cmp` method in the `Ord` trait implementation is used to compare `Person` instances based on their `age`. The `partial_cmp` method in the `PartialOrd` trait implementation calls the `cmp` method to get the `Ordering`. The sort method is then used to sort the people vector. The `Eq` and `PartialEq` traits are also derived so that `Person` instances can be compared for equality. This is required by the `Ord` and `PartialOrd` traits.

Please note that this will sort the `Person` instances in ascending order of their `age`. If you want to sort them in descending order, you can use `people.sort_by(|a, b| b.age.cmp(&a.age));` instead of `people.sort()`;.

## Deduplication

Remove duplicates:

```rust
fn main() {
    let mut numbers = vec![4, 6, 4, 3, 10, 10, 51, 1, 152, 200, 616, 200, 25195, 259125];
    numbers.sort();
    numbers.dedup();
    println!("Deduplicated: {numbers:?}");
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
        Some(&number) => println!("First even number: {number}"),
        None => println!("No even number found"),
    }

    let position = numbers.iter().position(|&x| x > 100);
    match position {
        Some(index) => println!("Index of first number > 100: {index}"),
        None => println!("No number > 100 found"),
    }
}
```

## Folding (Reducing)

```rust
fn main() {
    let numbers = vec![4, 6, 4, 3, 10, 10, 51, 1, 152, 200, 616, 200, 25195, 259125];
    let sum: i32 = numbers.iter().fold(0, |acc, &x| acc + x);
    println!("Sum: {sum}");
    let product: f64 = numbers
        .iter()
        .map(|&x| x as f64)
        .fold(1.0, |acc, x| acc * x);
    println!("Product: {product}");
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
