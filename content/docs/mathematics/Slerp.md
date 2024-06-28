---
weight: 1
bookFlatSection: false
bookToC: false
title: "Spherical Linear Interpolation"
summary: "A method used in computer graphics to interpolate between two points on a sphere. It’s particularly useful for smooth transitions."
---

<!--markdownlint-disable MD025 -->

# Spherical Linear Interpolation

---

Slerp is a method used in computer graphics to interpolate between two points on a sphere. It’s particularly useful for smooth transitions, such as in animations or camera movements.

The Math Behind Slerp The formula for Slerp is based on quaternion rotation, ensuring constant speed and a smooth path between the points. It’s given by:

$$
Slerp(q_0, q_1, t) = \frac{\sin((1-t)\theta)}{\sin(\theta)}q_0 + \frac{\sin(t\theta)}{\sin(\theta)}q_1
$$

Where:

- $q_0$ and $q_1$ are the start and end quaternions.
- $t$ is the interpolation parameter.
- $\theta$ is the angle between the quaternions.

## Example Code

---

```rust
use nalgebra::UnitQuaternion;

fn slerp(q0: UnitQuaternion<f32>, q1: UnitQuaternion<f32>, t: f32) -> UnitQuaternion<f32> {
    let dot = q0.quaternion().dot(&q1.quaternion());
    let theta = dot.acos();

    let scale0 = (1.0 - t) * theta.sin() / theta.sin();
    let scale1 = t * theta.sin() / theta.sin();

    let q = q0.quaternion() * scale0 + q1.quaternion() * scale1;
    UnitQuaternion::from_quaternion(q)
}

fn main() {
    let q0 = UnitQuaternion::from_euler_angles(0.0, 0.0, 0.0);
    let q1 = UnitQuaternion::from_euler_angles(1.0, 1.0, 1.0);
    let t = 0.5; // halfway interpolation

    let interpolated = slerp(q0, q1, t);
    println!("Interpolated Quaternion: {interpolated:?}");
}
```

The same thing but in a `loop` over 10 seconds.

```rust
use nalgebra::UnitQuaternion;
use std::time::{ Duration, Instant };
use std::thread::sleep;
fn slerp(q0: UnitQuaternion<f32>, q1: UnitQuaternion<f32>, t: f32) -> UnitQuaternion<f32> {
    let dot = q0.quaternion().dot(&q1.quaternion());
    let theta = dot.acos();
    let scale0 = ((1.0 - t) * theta.sin()) / theta.sin();
    let scale1 = (t * theta.sin()) / theta.sin();
    let q = q0.quaternion() * scale0 + q1.quaternion() * scale1;
    UnitQuaternion::from_quaternion(q)
}
fn main() {
    let q0 = UnitQuaternion::from_euler_angles(0.0, 0.0, 0.0);
    let q1 = UnitQuaternion::from_euler_angles(1.0, 1.0, 1.0);
    let start_time = Instant::now();
    let total_duration = Duration::from_secs(10); // total duration of interpolation
    loop {
        let elapsed_time = start_time.elapsed();
        if elapsed_time > total_duration {
            break;
        }
        let t = elapsed_time.as_secs_f32() / total_duration.as_secs_f32(); // calculate interpolation factor
        let interpolated = slerp(q0, q1, t);
        println!("Interpolated Quaternion at t={t} => {interpolated:?}");
    }
}
```
