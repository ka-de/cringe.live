---
weight: 1
bookFlatSection: false
bookToC: true
title: "Option"
summary: "Illustrates the practical use of Rust's `Option` enum in a game-like scenario, demonstrating how to handle optional values for player attributes such as items, companions, and armor through custom structs, enums, and methods."
---

<!--markdownlint-disable MD025 MD033 -->

# Option

---

In Rust, `Option` is a powerful and flexible enum that represents the concept of an optional value. It has two variants: `Some(T)` and `None`. `Some(T)` means that the option contains a value of type `T`, and `None` means that it contains no value.

```rust
enum Item {
    Sword,
    Shield,
    Potion,
}

enum Armor {
    Helmet,
    Chestplate,
    Leggings,
    Boots,
}

struct Companion {
    name: String,
    health: u32,
}

struct Player {
    name: String,
    current_item: Option<Item>,
    companion: Option<Companion>,
    equipped_armor: Option<Armor>,
}

impl Player {
    fn new(name: String) -> Self {
        Player {
            name,
            current_item: None,
            companion: None,
            equipped_armor: None,
        }
    }

    fn describe(&self) {
        println!("Player: {}", self.name);

        match &self.current_item {
            Some(item) => println!("  - Is holding: {:?}", item),
            None => println!("  - Is not holding any item"),
        }

        match &self.companion {
            Some(companion) => println!("  - Has a companion named {} with {} health", companion.name, companion.health),
            None => println!("  - Does not have a companion"),
        }

        match &self.equipped_armor {
            Some(armor) => println!("  - Has equipped: {:?}", armor),
            None => println!("  - Has not equipped any armor"),
        }

        println!(); // Add a blank line for readability
    }
}

fn main() {
    let mut alice = Player::new(String::from("Alice"));
    alice.current_item = Some(Item::Sword);
    alice.companion = Some(Companion {
        name: String::from("Sparky"),
        health: 100,
    });
    alice.equipped_armor = Some(Armor::Helmet);

    let bob = Player::new(String::from("Bob"));

    alice.describe();
    bob.describe();
}
```

This Rust program demonstrates the use of the `Option` enum to handle optional values in a game-like scenario. It models a simple player system with optional equipment, companions, and armor.

Key components:

1. Enums:
   - `Item`: Represents different items a player can hold (Sword, Shield, Potion).
   - `Armor`: Represents different types of armor a player can equip (Helmet, Chestplate, Leggings, Boots).

2. Structs:
   - `Companion`: Represents a player's companion, with a name and health.
   - `Player`: The main struct representing a player, containing:
     - `name`: A String for the player's name.
     - `current_item`: An `Option<Item>` for what the player is holding.
     - `companion`: An `Option<Companion>` for the player's companion.
     - `equipped_armor`: An `Option<Armor>` for the player's equipped armor.

3. Player Implementation:
   - `new`: A constructor method to create a new Player with default values (all options set to None).
   - `describe`: A method that prints a detailed description of the player's state, using match expressions to handle the optional fields.

4. Main Function:
   - Creates two Player instances: Alice (with some options set) and Bob (with default values).
   - Calls the `describe` method on both players to demonstrate how it handles different cases.
