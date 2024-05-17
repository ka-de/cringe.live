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

---

In a video game, you might have multiple threads running at the same time, each responsible for different aspects of the game, such as rendering graphics, handling user input, updating game state, etc.

Let’s consider a scenario where we have a global game state that multiple threads need to access and modify. We can use a Mutex to ensure that only one thread can access and modify the game state at a time, preventing race conditions and ensuring data consistency.

Here’s a simplified example in Rust:

```rust
// Import the Mutex type from the std::sync module, which provides a way to protect shared data from concurrent access.
use std::sync::Mutex;
// Import the thread module, which provides a way to create and manage threads.
use std::thread;

// Define a struct to represent the game state, which has a single field: score.
struct GameState {
    score: i32,
}

fn main() {
    // Create a new Mutex instance, which will protect the game state from concurrent access.
    // Initialize the game state with a score of 0.
    let game_state = Mutex::new(GameState { score: 0 });

    // Spawn a new thread, which will execute the closure passed to thread::spawn.
    // The closure takes ownership of the game_state Mutex, which means the main thread will no longer have access to it.
    let handle = thread::spawn(move || {
        // Lock the Mutex to access the game state. This will block until the lock is acquired.
        let mut data = game_state.lock().unwrap();
        // Increment the score by 1.
        data.score += 1;
    });

    // Wait for the thread to finish executing. This will block until the thread completes.
    handle.join().unwrap();

    // Lock the Mutex again to access the game state.
    // This will block until the lock is acquired, which should be immediate since the thread has finished executing.
    println!("Game score: {}", game_state.lock().unwrap().score);
}
```

In this example, we have a `GameState` struct that holds the current game score. We wrap this `GameState` in a `Mutex` to ensure that only one thread can access it at a time.

We then spawn a new thread that locks the Mutex, increments the score, and then automatically releases the lock when the `data` MutexGuard created by `.lock().unwrap()` operation goes out of scope.

Finally, we print out the game score. If another thread tried to lock the Mutex while it was already locked, it would have to wait until the Mutex was unlocked.

This is a very simplified example, but it gives you an idea of how Mutexes can be used in a multithreaded context like a video game to safely manage access to shared data. In a real game, the game state could be much more complex and there could be many more threads all needing to access and modify it.

## Multiple Threads

---

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

---

This code simulates a resource gathering game with multiple players. The game has three types of resources: wood, stone, and food. Each player tries to gather as many resources as possible until all resources are depleted.

The `Player` struct represents a player in the game. Each player has an ID, a shared resource manager, and a counter for the resources they've gathered. The `gather_resource` method allows a player to gather a random amount of a randomly selected resource, if available. The `ResourceManager` struct represents the shared resource manager, which keeps track of the amount of each resource available. The `Resource` enum represents the different types of resources a player can gather.

In the `main` function, a shared resource manager is created with initial amounts of each resource. Then, a number of players are created, each with their own thread. In each thread, the player continuously gathers resources until all resources are depleted. The game concludes by determining the player who has gathered the most resources. The ID of the winning player and the amount of resources they've gathered are then printed to the console. This code demonstrates the use of threads, mutexes, and shared state in Rust. It's a good example of a multi-threaded simulation where multiple entities are competing for a shared resource.

```rust
use rand::Rng;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

// Define a struct to represent a resource manager
#[derive(PartialEq)] // Implement the PartialEq trait for comparison
struct ResourceManager {
    wood: u32,
    stone: u32,
    food: u32,
}

// Define an enum to represent different types of resources
enum Resource {
    Wood,
    Stone,
    Food,
}

// Implementation block for the ResourceManager struct
impl ResourceManager {
    // Method to gather a resource
    fn gather(&mut self, resource: Resource) -> u32 {
        // Match the resource type to get a mutable reference to the amount of the resource and its name
        let (resource_amount, resource_name) = match resource {
            Resource::Wood => (&mut self.wood, "wood"),
            Resource::Stone => (&mut self.stone, "stone"),
            Resource::Food => (&mut self.food, "food"),
        };

        // Check if there is any of the resource available
        if *resource_amount > 0 {
            // Generate a random amount of the resource to gather
            let amount = rand::thread_rng().gen_range(1..=*resource_amount);
            // Subtract the gathered amount from the total amount of the resource
            *resource_amount -= amount;
            // Print a message indicating the amount gathered and the remaining amount
            println!(
                "Gathered {} {}. Remaining {}: {}",
                amount, resource_name, resource_name, resource_amount
            );
            // Return the amount gathered
            amount
        } else {
            // Print a message indicating that there was not enough of the resource available to gather
            println!(
                "Attempted to gather {}, but not enough available.",
                resource_name
            );
            // Return 0 since no resources were gathered
            0
        }
    }
}

// Define a struct to represent a player
struct Player {
    id: u32,                                       // Unique identifier for the player
    resource_manager: Arc<Mutex<ResourceManager>>, // Shared resource manager protected by a mutex
    gathered_resources: Mutex<u32>,                // Mutex-protected counter for gathered resources
}

// Implement methods for the Player struct
impl Player {
    // Create a new player with a given ID and resource manager
    fn new(id: u32, resource_manager: Arc<Mutex<ResourceManager>>) -> Self {
        Player {
            id,
            resource_manager,
            gathered_resources: Mutex::new(0), // Initialize gathered resources to 0
        }
    }

    // Gather a resource and update the player's gathered resources
    fn gather_resource(&self, resource: Resource) {
        if let Ok(mut resource_manager) = self.resource_manager.lock() {
            if let Ok(mut gathered_resources) = self.gathered_resources.lock() {
                let amount = resource_manager.gather(resource);
                *gathered_resources += amount;
            }
        }
    }
}

fn main() {
    // Create a shared resource manager with initial resources
    let resource_manager = Arc::new(Mutex::new(ResourceManager {
        wood: 10,
        stone: 50,
        food: 20,
    }));

    // Create a vector of players using the shared resource manager
    let players: Vec<_> = (0..5)
        .map(|i| Arc::new(Player::new(i, Arc::clone(&resource_manager))))
        .collect();

    // Use a thread scope to spawn threads for each player
    thread::scope(|s| {
        for player in &players {
            s.spawn({
                let player = Arc::clone(player);
                move || {
                    // Define empty resources for comparison
                    let empty_resources = ResourceManager {
                        wood: 0,
                        stone: 0,
                        food: 0,
                    };
                    // Continue gathering resources until all are depleted
                    while *player.resource_manager.lock().unwrap() != empty_resources {
                        // Randomly select a resource to gather
                        let resource = match rand::thread_rng().gen_range(0..3) {
                            0 => Resource::Wood,
                            1 => Resource::Stone,
                            2 => Resource::Food,
                            _ => unreachable!(),
                        };
                        // Perform the gathering action
                        player.gather_resource(resource);
                        // Sleep for a random duration between actions
                        thread::sleep(Duration::from_secs(rand::thread_rng().gen_range(1..5)));
                    }
                }
            });
        }
    });

    // Determine the winner based on the most gathered resources
    let (winner_id, max_resources) = players
        .iter()
        .map(|player| (player.id, *player.gathered_resources.lock().unwrap()))
        .max_by_key(|&(_, resources)| resources)
        .unwrap();

    // Print the winner and their gathered resources
    println!(
        "Player {} wins with {} resources!",
        winner_id, max_resources
    );
}
```

Well, this mutex example got out of hand! I'll see you next lesson! 😇
