---
title: "When It Keeps Failing"
date: 2024-07-07T08:22:31+02:00
author: "Balazs Horvath"
authorTwitter: "_ka_de"
cover: ""
tags:
 - rust
 - gamedev
 - bevy
 - 3d
 - programming
keywords:
 - "Rust game development"
 - "Bevy engine"
 - "3D Game Programming"
 - "Entity Component System"
 - "Game editor development"
categories:
 - "Game Development"
 - "Rust Programming"
 - "3D Graphics"
showFullContent: true
description: "Explore the ups and downs of game development with Rust and the Bevy engine. This post discusses overcoming challenges, from compile times to API changes, while showcasing the ease of creating 3D scenes and basic editors. Featuring code snippets for entity creation, component definition, and rotation systems, it offers insights into the evolving world of Rust game development."
readingTime: true
---

<!-- markdownlint-disable MD033 -->

Don't give up! Just `Invoke-UntilSuccess`! 😹

```pwsh
<#
.SYNOPSIS
    This function executes a command until it succeeds.

.DESCRIPTION
    The Invoke-UntilSuccess function takes a command as an argument and executes it.
    If the command fails, it retries the command until it succeeds.
    The function outputs the result of the command and whether the command was executed successfully or not.

.PARAMETER commandStr
    The command to be executed.

.EXAMPLE
    Invoke-UntilSuccess git clone https://github.com/ka-de/polars
#>
function Invoke-UntilSuccess {
        try {
                do {
                        $commandStr = $args -join ' '
                        Write-Host "Executing command: $commandStr"
                        $output = Invoke-Expression $commandStr
                        Write-Host $output
                        $exitCode = $LASTEXITCODE
                        if ($exitCode -eq 0) {
                                Write-Host "Command executed successfully."
                                return $output
                        }
                        else {
                                Write-Host "Command failed with exit code $exitCode. Retrying..."
                        }
                } while ($exitCode -ne 0)
        }
        catch {
                Write-Host "An error occurred: $_"
        }
}
```

Sorry! I just thought it was funny!

Very silly of me, well, silly now truly defines me. It has penetrated every section of my life.

On a more serious note, I think, the Rust compile times I get, especially when I keep adding `bevy` first as a dependency just really ruin my eclectic experimentation cravings.
It is also directly affecting how much I'm working on the game I'm actually planning on releasing first. But I'm not procrastinating for much longer.

3D has been always a fascinating thing for me. So while I'm technically supposed to be drawing pixel art I also fuck around with this:

<blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">The Rotate component is my favorite component! <a href="https://t.co/iFYArzhcSi">pic.twitter.com/iFYArzhcSi</a></p>&mdash; _ka_de (@_ka_de) <a href="https://twitter.com/_ka_de/status/1804096426948907434?ref_src=twsrc%5Etfw">June 21, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

and this:

<blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">It took me a while to figure out how to make the egui inspector and a camera controller play together nicely. <a href="https://t.co/bNvx3y2nP2">pic.twitter.com/bNvx3y2nP2</a></p>&mdash; _ka_de (@_ka_de) <a href="https://twitter.com/_ka_de/status/1803776705472897297?ref_src=twsrc%5Etfw">June 20, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The amount of effort it takes to get from zero to a basic editor in a 3D space with basic camera controls with `bevy` is minimal, and the code for it looks really neat too!

## Entity

---

```rust
fn spawn_entity(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    mut materials: ResMut<Assets<StandardMaterial>>
) {
    let model_path = "models/entity.glb";
    let mut entity_transform = Transform::from_xyz(0.0, 0.0, 0.0);

    commands.spawn((
        SceneBundle {
            scene: asset_server.load(GltfAssetLabel::Scene(0).from_asset(model_path)),
            transform: entity_transform,
            ..default()
        },
        Rotate::default(),
    ));
}
```

## Component

---

```rust
#[derive(Component, Debug, Reflect, InspectorOptions)]
#[reflect(InspectorOptions)]
struct Rotate {
    speed_x: f32,
    speed_y: f32,
    speed_z: f32,
}

impl Default for Rotate {
    fn default() -> Self {
        Self {
            speed_x: 0.0,
            speed_y: 1.0,
            speed_z: 0.0,
        }
    }
}
```

## System

---

```rust
fn rotate_meshes(mut query: Query<(&mut Transform, &Rotate)>, time: Res<Time>) {
    for (mut transform, rotate) in query.iter_mut() {
        let rotation = Quat::from_euler(
            EulerRot::XYZ,
            rotate.speed_x * time.delta_seconds(),
            rotate.speed_y * time.delta_seconds(),
            rotate.speed_z * time.delta_seconds()
        );
        transform.rotate(rotation);
    }
}
```

Well, something like that anyway, because `bevy` is still young, the syntax keeps changing basically every 3 months or something and me and my friend kinda arrived a bit late for having fun with version 0.13.. because 0.14 just dropped and now I started to have mess around getting everything migrated to the new version.

It is a painful and grueling process and I'm not really a fan of it, but, if I get over it, I'll have more than 2 months where I'll be able to concentrate on writing the actual game! 🐺

I've been learning a lot of Rust in the meantime, and one of the consequences of it is that I'm really getting into the low-level workings of everything. I hope my small 🧠 will able to tolerate it!
