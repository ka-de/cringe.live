---
weight: 1
bookFlatSection: false
bookToC: false
title: "Mutex"
---

<!--markdownlint-disable MD025 MD033 -->

# Mutex

A Mutex in Rust stands for Mutual Exclusion. It is a concurrency primitive that ensures only one thread can access some data at any point in time. If a thread needs to read or write the data, it must first acquire the lock on the Mutex.

The Mutex in Rust is a powerful tool for synchronizing access to shared mutable state in concurrent applications. By using a Mutex, you can ensure thread safety and prevent data races.

In Rust, Mutex works a bit differently compared to some other languages. Instead of tracking the lock independently from the value, a Rust Mutex owns the data and prevents accessing it without first obtaining a lock, which is enforced at compile time.

```rust
// Import the Mutex struct from the sync module of the standard library
use std::sync::Mutex;

// The main function where the program starts
fn main() {
    // Create a new Mutex that guards an i32. The initial value is 5.
    let m = Mutex::new(5);

    // A new scope is created to limit the duration of the lock
    {
        // Lock the Mutex and unwrap the result to handle any potential errors.
        // This returns a MutexGuard which allows access to the data.
        let mut num = m.lock().unwrap();

        // Dereference the MutexGuard to access the i32 and change the value to 6.
        *num = 6;
    } // The MutexGuard is dropped here, releasing the lock.

    // Print the Mutex. Since we can't directly access the value inside,
    // this will print the type std::sync::Mutex<i32> but not the value 6.
    println!("m = {:?}", m);
}
```

In this example, the mutex `m` is guarding the data `5`. The lock method is called to acquire the lock before accessing the data. If another thread tries to lock the mutex while it’s still locked by the first thread, it will be blocked until the first thread releases the lock.

Rust’s Mutex also implements a strategy called “poisoning” where a mutex is considered poisoned whenever a thread panics while holding the mutex. Once a mutex is poisoned, all other threads are unable to access the data by default as it is likely tainted (some invariant is not being upheld). However, a poisoned mutex does not prevent all access to the underlying data. The `PoisonError` type has an `into_inner` method which will return the guard that would have otherwise been returned on a successful lock. This allows access to the data, despite the lock being poisoned.

## GameState

In a video game, you might have multiple threads running at the same time, each responsible for different aspects of the game, such as rendering graphics, handling user input, updating game state, etc.

Let’s consider a scenario where we have a global game state that multiple threads need to access and modify. We can use a Mutex to ensure that only one thread can access and modify the game state at a time, preventing race conditions and ensuring data consistency.

Here’s a simplified example in Rust:

```rust
use std::sync::Mutex;
use std::thread;

struct GameState {
    score: i32,
}

fn main() {
    let game_state = Mutex::new(GameState { score: 0 });

    let handle = thread::spawn(move || {
        let mut data = game_state.lock().unwrap();
        data.score += 1;
    });

    handle.join().unwrap();

    println!("Game score: {}", game_state.lock().unwrap().score);
}
```

In this example, we have a `GameState` struct that holds the current game score. We wrap this `GameState` in a `Mutex` to ensure that only one thread can access it at a time.

We then spawn a new thread that locks the Mutex, increments the score, and then automatically releases the lock when the `data` MutexGuard created by `.lock().unwrap()` operation goes out of scope.

Finally, we print out the game score. If another thread tried to lock the Mutex while it was already locked, it would have to wait until the Mutex was unlocked.

This is a very simplified example, but it gives you an idea of how Mutexes can be used in a multithreaded context like a video game to safely manage access to shared data. In a real game, the game state could be much more complex and there could be many more threads all needing to access and modify it.

## Multiple Threads

In the next example, we’ll use a Mutex to protect a global counter that’s being updated by two threads. This is a simplified model of how you might have multiple parts of a game engine updating the game state.

```rust
use std::sync::Mutex;
use std::thread;

// Global game state
struct GameState {
    counter: i32,
}

fn main() {
    // Create a Mutex to protect the GameState
    let game_state = Mutex::new(GameState { counter: 0 });

    // Spawn two threads that will update the game state
    let handle1 = thread::spawn(move || {
        for _ in 0..10000 {
            // Lock the Mutex before accessing the game state
            let mut data = game_state.lock().unwrap();

            // Update the game state
            data.counter += 1;

            // Mutex is automatically unlocked when the MutexGuard goes out of scope
        }
    });

    let handle2 = thread::spawn(move || {
        for _ in 0..10000 {
            let mut data = game_state.lock().unwrap();
            data.counter += 1;
        }
    });

    // Wait for both threads to finish
    handle1.join().unwrap();
    handle2.join().unwrap();

    // At this point, we know that no other threads are accessing the game state,
    // so it's safe to access it without locking the Mutex
    println!("Game state counter: {}", game_state.lock().unwrap().counter);
}
```

In this example, we have two threads that are both incrementing a counter in the game state 10,000 times. The Mutex ensures that only one thread can access the game state at a time, preventing race conditions. If we didn’t use a Mutex and allowed both threads to access the game state simultaneously, we could end up with inconsistent results.

## ResourceManager

```rust
use std::sync::{Arc, Mutex};
use std::thread;

struct ResourceManager {
    wood: u32,
    stone: u32,
    food: u32,
}

struct Player {
    id: u32,
    resource_manager: Arc<Mutex<ResourceManager>>,
}

impl Player {
    fn new(id: u32, resource_manager: Arc<Mutex<ResourceManager>>) -> Self {
        Player { id, resource_manager }
    }

    fn gather_resource(&self, resource: &str, amount: u32) {
        let mut resource_manager = self.resource_manager.lock().unwrap();
        match resource {
            "wood" => {
                if resource_manager.wood >= amount {
                    resource_manager.wood -= amount;
                    println!("Player {} gathered {} wood. Remaining wood: {}", self.id, amount, resource_manager.wood);
                } else {
                    println!("Player {} attempted to gather wood, but not enough available.", self.id);
                }
            }
            "stone" => {
                if resource_manager.stone >= amount {
                    resource_manager.stone -= amount;
                    println!("Player {} gathered {} stone. Remaining stone: {}", self.id, amount, resource_manager.stone);
                } else {
                    println!("Player {} attempted to gather stone, but not enough available.", self.id);
                }
            }
            "food" => {
                if resource_manager.food >= amount {
                    resource_manager.food -= amount;
                    println!("Player {} gathered {} food. Remaining food: {}", self.id, amount, resource_manager.food);
                } else {
                    println!("Player {} attempted to gather food, but not enough available.", self.id);
                }
            }
            _ => unreachable!(),
        }
    }
}

fn main() {
    let resource_manager = Arc::new(Mutex::new(ResourceManager {
        wood: 1000,
        stone: 500,
        food: 200,
    }));

    let mut player_handles = vec![];

    for i in 0..5 {
        let resource_manager = Arc::clone(&resource_manager);
        let player = Player::new(i, resource_manager);
        let handle = thread::spawn(move || {
            player.gather_resource("wood", 20);
            player.gather_resource("stone", 10);
            player.gather_resource("food", 5);
        });

        player_handles.push(handle);
    }

    for handle in player_handles {
        handle.join().unwrap();
    }
}
```

In this example, we have a `ResourceManager` that manages the global resource pool, and multiple `Player` threads that access the resource manager to gather resources. Each `Player` has a reference to the `ResourceManager` through an `Arc<Mutex<ResourceManager>>`, which allows multiple threads to share the same resource manager.

When a `Player` thread wants to gather a resource, it locks the ResourceManager using the `lock()` method, checks if the resource is available, and updates the resource amount if it is. If the resource is not available, it prints an error message.

The main() function creates a `ResourceManager` and spawns 5 `Player` threads, each of which gathers resources in a specific order (wood, stone, food). The join() method is used to wait for all player threads to finish before exiting the program.
