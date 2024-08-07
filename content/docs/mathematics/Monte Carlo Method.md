---
weight: 1
bookFlatSection: false
title: "Monte Carlo Method"
bookToC: false
summary: "The Monte Carlo method, a statistical technique using randomness, is used to estimate mathematical constants like Pi and Euler’s number by generating random numbers and applying specific mathematical operations. For example, Pi is estimated by generating random points within a unit square and checking how many fall inside a unit circle, while Euler’s number is estimated by generating random numbers, summing them until they exceed 1, and averaging the counts of numbers needed. The accuracy of these estimates increases with the number of iterations. This method is implemented in the Rust programming language using the nanorand crate for random number generation."
---

<!--markdownlint-disable MD025 -->

# Monte Carlo Method

---

The Monte Carlo method is a statistical technique that allows you to make numerical predictions or decisions under uncertainty. It’s named after the Monte Carlo Casino in Monaco, where the primary developer of the method, physicist Stanislaw Ulam, was inspired by his uncle’s gambling habits.

The method involves using randomness to solve problems that might be deterministic in principle. It relies on repeated random sampling to obtain numerical results. The underlying concept is to use randomness to solve problems that might be deterministic in principle. They are mainly used in three distinct problem classes: optimization, numerical integration, and generating draws from a probability distribution.

## Estimating Pi with Monte Carlo Simulation

---

Here’s a simple example of a Monte Carlo simulation in Rust, estimating the value of Pi:

```rust
use nanorand::{WyRand, Rng};

fn main() {
    let mut rng = WyRand::new();
    let mut inside_circle = 0;
    let total = 1_000_000; // Number of iterations

    for _ in 0..total {
        let x: f64 = rng.generate::<f64>(); // Generate a random number between 0 and 1
        let y: f64 = rng.generate::<f64>(); // Generate another random number between 0 and 1
        if x.powi(2) + y.powi(2) <= 1.0 {
            inside_circle += 1;
        }
    }

    let pi_estimate = 4.0 * (inside_circle as f64 / total as f64);
    println!("Estimate of Pi = {pi_estimate}");
}
```

### Explanation of the Rust Code

1. **Importing Libraries**: The `nanorand` crate is used for generating random numbers. The `WyRand` struct is a fast, non-cryptographic random number generator.
2. **Initialization**: We initialize the random number generator and set up a counter `inside_circle` to count the number of points that fall inside the unit circle.
3. **Generating Random Points**: We generate `total` random points within the unit square \([0, 1] \times [0, 1]\).
4. **Checking Points**: For each point \((x, y)\), we check if it lies inside the unit circle by verifying if \(x^2 + y^2 \leq 1\).
5. **Estimating Pi**: The ratio of points inside the circle to the total number of points, multiplied by 4, gives an estimate of Pi.

### Mathematical Explanation

The Monte Carlo method for estimating Pi is based on the area of a circle. The area of a circle with radius \(r\) is \(\pi r^2\). For a unit circle (radius = 1), the area is \(\pi\). The area of the square enclosing this circle is \(4\) (since each side of the square is \(2\)). The ratio of the area of the circle to the area of the square is \(\pi / 4\). By generating random points and checking how many fall inside the circle, we can estimate this ratio and thus estimate Pi.

$$
\pi \approx 4 \times \frac{\text{Number of points inside the circle}}{\text{Total number of points}}
$$

This method becomes more accurate as the number of points increases.

## Estimating Euler's Number Using the Monte Carlo Method

---

This time, let’s estimate the mathematical constant $e$ (Euler’s number) using a Monte Carlo method. The idea is to estimate $e$ using the formula for the expected value of a certain random variable.

```rust
use nanorand::{WyRand, Rng};

fn main() {
    let mut rng = WyRand::new();
    let trials = 1_000_000; // Number of iterations
    let mut sum = 0.0;

    for _ in 0..trials {
        let mut n = 0;
        let mut total = 0.0;
        while total < 1.0 {
            total += rng.generate::<f64>();
            n += 1;
        }
        sum += n as f64;
    }

    let e_estimate = sum / trials as f64;
    println!("Estimate of e = {e_estimate}");
}
```

In this code, we’re generating random numbers between 0 and 1 and summing them until the sum is greater than or equal to 1. We then count how many numbers we needed to exceed 1. We repeat this process many times and take the average of these counts. As the number of trials goes to infinity, this average will converge to $e$.
