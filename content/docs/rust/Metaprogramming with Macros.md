---
weight: 1
bookFlatSection: false
bookToC: true
title: "Metaprogramming with Macros"
summary: ""
---

<!--markdownlint-disable MD025 MD033 -->

# Metaprogramming with Macros

---

## Introduction

---

Macros in Rust are a powerful feature that allow for metaprogramming. Metaprogramming is the concept of writing code that writes other code during compile time. The syntax for defining a macro in Rust is `macro_rules!`. Macros look similar to functions, but they’re fundamentally different. While functions operate on values, macros operate on abstract syntax trees (AST).

Let's start with a simple example:

```rust
macro_rules! hello_macro {
    () => {
        println!("Hello, Macro!");
    };
}

fn main() {
    hello_macro!();
}
```

In this example, we define a macro named `hello_macro`. The empty parentheses `()` on the left side of `=>` indicate that this macro takes no arguments. On the right side, we have the code that will be generated when the macro is invoked. When we call `hello_macro!()` in the `main` function, it expands to `println!("Hello, Macro!");`.

## Code Reuse

---

One of the primary uses of macros is to avoid code duplication. For example, you can create a macro to generate functions with similar bodies.

```rust
macro_rules! create_function {
    ($func_name:ident) => (
        fn $func_name() {
            println!("You called {:?}()", stringify!($func_name))
        }
    )
}

create_function!(foo);
create_function!(bar);

fn main() {
    foo();
    bar();
}
```

In this macro, `$func_name:ident` is a macro matcher that captures an identifier. The `ident` specifier tells the macro to expect an identifier. The stringify! macro is used to convert the identifier into a string literal.

When we invoke `create_function!(foo)`, it generates a function named `foo` that prints "You called foo()". Similarly, `create_function!(bar)` generates a function named `bar`.

## Input

---

Macros can also take inputs, providing even more flexibility. Here’s an example of a macro that takes in an argument:

```rust
macro_rules! say_hello {
    ($name:expr) => {
        println!("Hello, {}!", $name);
    };
}

fn main() {
    say_hello!("world");
}
```

In this macro, `$name:expr` tells the macro to expect any expression. This allows us to pass both string literals and variables to the macro.

## Implementing Traits

---

Another powerful use case for macros is in trait implementation. You can create a macro to implement a trait for multiple types.

```rust
use std::fmt;

macro_rules! impl_display {
    ($($t:ty),*) => (
        $(
            impl fmt::Display for $t {
                fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
                    write!(f, "{}", stringify!($t))
                }
            }
        )*
    )
}

impl_display!(i32, u32, f64, String);

fn main() {
    println!("{}", 5_i32);
    println!("{}", 10_u32);
    println!("{}", 3.14_f64);
    println!("{}", String::from("hello"));
}
```

- `$($t:ty),*` allows us to pass multiple types to the macro.
- The outer `$( ... )*` repeats the implementation for each type.

## Recursive Macros

---

Macros in Rust can be recursive, allowing for more complex code generation. Here's an example of a recursive macro that generates a function to calculate the sum of its arguments:

```rust
macro_rules! sum {
    ($x:expr) => ($x);
    ($x:expr, $($y:expr),+) => (
        $x + sum!($($y),+)
    )
}

fn main() {
    println!("{}", sum!(1));
    println!("{}", sum!(1, 2));
    println!("{}", sum!(1, 2, 3));
    println!("{}", sum!(1, 2, 3, 4));
}
```

This macro has two rules:

1. If there's only one expression, it returns that expression.
2. If there are multiple expressions, it adds the first expression to the sum of the rest.

## Procedural Macros

---

For even more advanced use cases, Rust offers procedural macros. These are more powerful but also more complex. Here's a simple example of a derive procedural macro:

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Parse the input tokens into a syntax tree
    let ast = syn::parse(input).unwrap();

    // Build the trait implementation
    impl_hello_macro(&ast)
}

fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}", stringify!(#name));
            }
        }
    };
    gen.into()
}

// Usage
#[derive(HelloMacro)]
struct Pancakes;

fn main() {
    Pancakes::hello_macro();
}
```

This procedural macro automatically implements a `HelloMacro` trait for any struct it's applied to. The `quote!` macro is used to generate Rust code, and the `syn` crate is used to parse Rust code into a syntax tree that we can manipulate.

## Testing

---

Macros are also commonly used in testing. For example, the `assert_eq!` and `assert_ne!` macros are provided by the standard library for asserting that two expressions are equal or not equal.

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 2), 4);
        assert_ne!(add(2, 2), 5);
    }
}
```

These macros not only check for equality/inequality but also provide helpful debug output if the assertion fails.

## Game Development

---

Game development often involves repetitive code patterns and boilerplate. Rust's macro system can be leveraged to simplify common game development tasks, improve code readability, and reduce errors. Let's explore some advanced examples of using macros in Rust for game development.

### Component Registration

In entity-component systems (ECS), a common pattern in game engines, you often need to register components. Here's a macro that can simplify this process:

```rust
macro_rules! register_components {
    ($($component:ty),*) => {
        pub fn register_components(world: &mut World) {
            $(
                world.register::<$component>();
            )*
        }
    };
}

// Usage
register_components!(Position, Velocity, Sprite, Health);

// This expands to:
// pub fn register_components(world: &mut World) {
//     world.register::<Position>();
//     world.register::<Velocity>();
//     world.register::<Sprite>();
//     world.register::<Health>();
// }
```

Bevy automatically registers components when they're used, but we can create a macro to bundle related components:

```rust
use bevy::prelude::*;

macro_rules! bundle_components {
    ($bundle_name:ident, $($component:ident),+) => {
        #[derive(Bundle, Default)]
        pub struct $bundle_name {
            $(pub $component: $component),+
        }
    }
}

// Define components
#[derive(Component, Default)]
struct Position(Vec2);

#[derive(Component, Default)]
struct Velocity(Vec2);

#[derive(Component, Default)]
struct Health(i32);

// Use the macro to create a bundle
bundle_components!(MovingEntityBundle, Position, Velocity, Health);

fn main() {
    App::new()
        .add_systems(Startup, setup)
        .run();
}

fn setup(mut commands: Commands) {
    commands.spawn(MovingEntityBundle {
        position: Position(Vec2::new(0.0, 0.0)),
        velocity: Velocity(Vec2::new(1.0, 1.0)),
        health: Health(100),
    });
}
```

### Event System

Game engines often use event systems. Here's a macro to create a type-safe event system:

```rust
macro_rules! define_event_system {
    ($($event:ident($($arg:ident: $type:ty),*)),*) => {
        pub enum Event {
            $($event{$($arg: $type),*}),*
        }

        pub trait EventHandler {
            $(fn $event(&mut self, $($arg: $type),*) {})*
        }

        pub struct EventSystem {
            handlers: Vec<Box<dyn EventHandler>>
        }

        impl EventSystem {
            pub fn new() -> Self {
                EventSystem { handlers: Vec::new() }
            }

            pub fn add_handler(&mut self, handler: Box<dyn EventHandler>) {
                self.handlers.push(handler);
            }

            pub fn emit(&mut self, event: Event) {
                match event {
                    $(Event::$event{$($arg),*} => {
                        for handler in &mut self.handlers {
                            handler.$event($($arg),*);
                        }
                    }),*
                }
            }
        }
    };
}

// Usage
define_event_system!(
    Collision(entity1: Entity, entity2: Entity),
    KeyPress(key: KeyCode),
    GameOver(score: u32)
);
```

Bevy has a built-in event system, but we can create a macro to define related events more easily:

```rust
use bevy::prelude::*;

macro_rules! define_events {
    ($($event:ident { $($field:ident : $type:ty),* }),+) => {
        $(
            #[derive(Event)]
            pub struct $event {
                $(pub $field: $type),*
            }
        )+

        pub struct EventPlugin;

        impl Plugin for EventPlugin {
            fn build(&self, app: &mut App) {
                $(app.add_event::<$event>();)+
            }
        }
    }
}

// Define events using the macro
define_events! {
    CollisionEvent { entity1: Entity, entity2: Entity },
    KeyPressEvent { key: KeyCode },
    GameOverEvent { score: u32 }
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(EventPlugin)
        .add_systems(Update, (handle_collision, handle_key_press, handle_game_over))
        .run();
}

fn handle_collision(mut collision_events: EventReader<CollisionEvent>) {
    for event in collision_events.read() {
        println!("Collision between {:?} and {:?}", event.entity1, event.entity2);
    }
}

fn handle_key_press(mut key_events: EventReader<KeyPressEvent>) {
    for event in key_events.read() {
        println!("Key pressed: {:?}", event.key);
    }
}

fn handle_game_over(mut game_over_events: EventReader<GameOverEvent>) {
    for event in game_over_events.read() {
        println!("Game over! Score: {}", event.score);
    }
}
```

### Resource Loading

Game development often involves loading many resources. Here's a macro to generate resource loading code:

```rust
macro_rules! load_resources {
    ($($name:ident: $path:expr => $type:ty),*) => {
        pub struct Resources {
            $(pub $name: $type),*
        }

        impl Resources {
            pub fn load() -> Result<Self, Box<dyn std::error::Error>> {
                Ok(Resources {
                    $($name: <$type>::load($path)?),*
                })
            }
        }
    };
}

// Usage
load_resources! {
    player_sprite: "assets/player.png" => Texture,
    background_music: "assets/bg_music.ogg" => Music,
    level_data: "assets/level1.json" => LevelData
}
```

Bevy has a built-in asset system, but we can create a macro to simplify declaring multiple assets:

```rust
use bevy::prelude::*;

macro_rules! declare_assets {
    ($($name:ident: $path:expr => $type:ty),*) => {
        #[derive(Resource)]
        pub struct GameAssets {
            $(pub $name: Handle<$type>),*
        }

        pub fn load_assets(mut commands: Commands, asset_server: Res<AssetServer>) {
            commands.insert_resource(GameAssets {
                $($name: asset_server.load($path)),*
            });
        }
    };
}

// Usage
declare_assets! {
    player_texture: "textures/player.png" => Image,
    background_music: "audio/background.ogg" => AudioSource
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, load_assets)
        .add_systems(Update, use_assets)
        .run();
}

fn use_assets(assets: Res<GameAssets>) {
    // Here you would typically use the assets to set up your game
    println!("Player texture handle: {:?}", assets.player_texture);
    println!("Background music handle: {:?}", assets.background_music);
}
```

### State Machine

```rust
macro_rules! state_machine {
    ($($state:ident),*) => {
        #[derive(Debug, Clone, Copy, PartialEq, Eq)]
        pub enum State {
            $($state),*
        }

        pub struct StateMachine {
            current: State,
            transitions: Vec<(State, State, Box<dyn Fn() -> bool>)>
        }

        impl StateMachine {
            pub fn new(initial: State) -> Self {
                StateMachine {
                    current: initial,
                    transitions: Vec::new()
                }
            }

            pub fn add_transition(&mut self, from: State, to: State, condition: Box<dyn Fn() -> bool>) {
                self.transitions.push((from, to, condition));
            }

            pub fn update(&mut self) {
                for (from, to, condition) in &self.transitions {
                    if self.current == *from && condition() {
                        self.current = *to;
                        break;
                    }
                }
            }
        }
    };
}

// Usage
state_machine!(Idle, Walking, Running, Jumping);
```

Bevy has a built-in state system, but we can create a macro for defining more complex state machines:

```rust
use bevy::prelude::*;

macro_rules! state_machine {
    ($state_name:ident, $($state:ident),+) => {
        #[derive(States, Debug, Clone, Eq, PartialEq, Hash, Default)]
        pub enum $state_name {
            #[default]
            $($state),+
        }

        pub struct StateMachinePlugin;

        impl Plugin for StateMachinePlugin {
            fn build(&self, app: &mut App) {
                app.add_state::<$state_name>();
                $(
                    app.add_systems(OnEnter($state_name::$state), enter_state::<$state_name, { $state_name::$state }>)
                     .add_systems(OnExit($state_name::$state), exit_state::<$state_name, { $state_name::$state }>);
                )+
            }
        }
    };
}

fn enter_state<T: States, const S: T>() {
    println!("Entering state: {:?}", S);
}

fn exit_state<T: States, const S: T>() {
    println!("Exiting state: {:?}", S);
}

// Usage
state_machine!(GameState, MainMenu, Playing, Paused, GameOver);

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(StateMachinePlugin)
        .add_systems(Update, update_game_state)
        .run();
}

fn update_game_state(
    mut next_state: ResMut<NextState<GameState>>,
    keyboard_input: Res<Input<KeyCode>>,
    current_state: Res<State<GameState>>,
) {
    if keyboard_input.just_pressed(KeyCode::Space) {
        match current_state.get() {
            GameState::MainMenu => next_state.set(GameState::Playing),
            GameState::Playing => next_state.set(GameState::Paused),
            GameState::Paused => next_state.set(GameState::Playing),
            GameState::GameOver => next_state.set(GameState::MainMenu),
        }
    }
}
```

### Shader Definition

For games using custom shaders, you might want a macro to simplify shader definitions:

```rust
macro_rules! define_shader {
    ($name:ident, $vs_path:expr, $fs_path:expr) => {
        pub struct $name {
            program: gl::Program,
        }

        impl $name {
            pub fn new() -> Result<Self, ShaderError> {
                let vs = gl::Shader::from_file(gl::ShaderType::Vertex, $vs_path)?;
                let fs = gl::Shader::from_file(gl::ShaderType::Fragment, $fs_path)?;
                let program = gl::Program::new(&[vs, fs])?;

                Ok($name { program })
            }

            pub fn bind(&self) {
                self.program.bind();
            }

            pub fn unbind(&self) {
                self.program.unbind();
            }
        }
    };
}

// Usage
define_shader!(WaterShader, "shaders/water.vs", "shaders/water.fs");
```

Bevy uses its own shader language, but we can create a macro to simplify shader creation:

```rust
use bevy::prelude::*;
use bevy::render::render_resource::{ShaderRef, AsBindGroup};

macro_rules! define_material {
    ($name:ident, $vertex:expr, $fragment:expr) => {
        #[derive(AsBindGroup, Debug, Clone, TypePath)]
        pub struct $name;

        impl Material for $name {
            fn fragment_shader() -> ShaderRef {
                $fragment.into()
            }

            fn vertex_shader() -> ShaderRef {
                $vertex.into()
            }
        }
    };
}

// Usage
define_material!(
    CustomMaterial,
    "shaders/custom_vertex.wgsl",
    "shaders/custom_fragment.wgsl"
);

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(MaterialPlugin::<CustomMaterial>::default())
        .add_systems(Startup, setup)
        .run();
}

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<CustomMaterial>>,
) {
    commands.spawn(MaterialMeshBundle {
        mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
        material: materials.add(CustomMaterial),
        ..default()
    });

    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(0.0, 0.0, 5.0).looking_at(Vec3::ZERO, Vec3::Y),
        ..default()
    });
}
```
