---
weight: 1
bookFlatSection: false
bookToC: false
title: "Monomorphization"
summary: "Monomorphization in Rust is a compile-time process where the compiler replaces polymorphic functions with specific versions for each unique type instantiation, optimizing for speed at the cost of binary size."
---

<!--markdownlint-disable MD025 MD033 -->

# Monomorphization

---

Monomorphization is a process in Rust that turns generic code into specific code by filling in the concrete types that are used when compiled. This is how Rust achieves zero-cost abstractions with generics.

In Rust, you can use generics to create definitions for items like function signatures or structs, which can then be used with many different concrete data types. When you define a function that uses generics, you place the generics in the signature of the function where you would usually specify the data types of the parameters and return value.

Here’s an example of a generic function in Rust:

```rust
fn main() {
    let numbers = vec![34, 50, 25, 100, 65];

    let result = largest(&numbers);
    println!("The largest number is {result}");

    let chars = vec!['y', 'm', 'a', 'q'];
    let result = largest(&chars);
    println!("The largest char is {result}");
}

fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];

    for item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}
```

In this code, the `largest` function is generic over some type `T`. This function has a parameter named `list`, which is a slice of values of type `T`. The `largest` function returns a reference to a `T` value.

The `main` function demonstrates how the largest function can be used with both `Vec<i32>` and `Vec<char>`. When you run this program, the Rust compiler will perform monomorphization. During this process, the compiler reads the values that have been used in place of `T` and generates two versions of the largest function: one for `i32` and another for `char`.

a real-world use case in game development where we might use generics and monomorphization in Rust: a game with different types of items that a player can collect.

In many games, players can collect different types of items like coins, power-ups, weapons, etc. These items might have some common behaviors (like being collectible) but also have unique properties and behaviors. We can use generics to create a `Collectible` trait that we can implement for each item type.

```rust
pub trait Collectible {
    fn collect(&self);
}

pub struct Coin {
    pub value: u32,
}

impl Collectible for Coin {
    fn collect(&self) {
        println!("Collected a coin worth {} points", self.value);
    }
}

pub struct PowerUp {
    pub kind: String,
}

impl Collectible for PowerUp {
    fn collect(&self) {
        println!("Collected a power-up of type: {}", self.kind);
    }
}

fn collect_item<T: Collectible>(item: T) {
    item.collect();
}

fn main() {
    let coin = Coin { value: 10 };
    let power_up = PowerUp { kind: String::from("Invincibility") };

    collect_item(coin); // Monomorphized to collect_item::<Coin>
    collect_item(power_up); // Monomorphized to collect_item::<PowerUp>
}
```

In this code, `Collectible` is a trait that defines a behavior common to all collectible items in the game. `Coin` and `PowerUp` are structs that represent different types of collectible items, and they each implement the `Collectible` trait to define their unique behavior when collected.

The `collect_item` function is generic over any type `T` that implements `Collectible`. When this function is called with a specific type, the Rust compiler performs monomorphization to generate a specific version of `collect_item` for that type.

We can use generics to create an `InventoryItem` trait that we can implement for each item type.

```rust
pub struct Player {
    pub coins: u32,
    pub inventory: Vec<Box<dyn InventoryItem>>,
}

impl Player {
    pub fn new() -> Self {
        Player { coins: 0, inventory: Vec::new() }
    }

    pub fn collect_item<T: 'static + InventoryItem>(&mut self, item: T) {
        if let Some(coin) = item.as_any().downcast_ref::<Coin>() {
            self.coins += coin.value;
            println!("Collected a coin worth {} points. Total coins: {}", coin.value, self.coins);
        } else {
            self.inventory.push(Box::new(item));
            item.collect();
        }
    }
}

pub trait InventoryItem: Any {
    fn collect(&self);
    fn as_any(&self) -> &dyn Any;
}

impl<T: 'static + InventoryItem> InventoryItem for T {
    fn as_any(&self) -> &dyn Any {
        self
    }
}

pub struct Coin {
    pub value: u32,
}

impl InventoryItem for Coin {
    fn collect(&self) {
        println!("Collected a coin worth {} points", self.value);
    }
}

pub struct PowerUp {
    pub kind: String,
}

impl InventoryItem for PowerUp {
    fn collect(&self) {
        println!("Collected a power-up of type: {}", self.kind);
    }
}

fn main() {
    let mut player = Player::new();

    let coin = Coin { value: 10 };
    let power_up = PowerUp { kind: String::from("Invincibility") };

    player.collect_item(coin);
    player.collect_item(power_up);
}
```

In this code, the `Player` struct now has a `coins` field to keep track of the total coin value. The `collect_item` method checks if the item is a `Coin`, and if so, adds its value to the player’s total coin value. Otherwise, it adds the item to the inventory as before.

The `InventoryItem` trait now includes an `as_any` method, which allows us to downcast the `InventoryItem` to its concrete type. This is necessary because Rust doesn’t support downcasting directly from a trait object to a concrete type.
