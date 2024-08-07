---
weight: 1
bookFlatSection: false
title: "Continuous-time Markov Chain"
bookToC: false
summary: "A Continuous-time Markov Chain (CTMC) is a stochastic model used to represent systems that transition between states continuously over time, where the probability of transitioning to any particular state depends solely on the current state and the amount of time spent in that state, not on the sequence of past states."
---

<!--markdownlint-disable MD025 -->

# Continuous-time Markov Chain

---

A Continuous Time Markov Chain (CTMC) is a type of Markov process, which is a mathematical model for systems that jump between different states ("state" here refers to a condition or status the system can be in), with the property that the next state depends only on the current state and not on how the system arrived in its current state.

In a CTMC, the system spends an exponentially distributed amount of time in each state before making a transition to another state. This is in contrast to a Discrete Time Markov Chain (DTMC), where transitions occur at fixed time steps.

The transition probabilities in a CTMC are governed by the **transition rate matrix**, often denoted by $Q$. If $i$ and $j$ are states in the system, the element `q_ij` of the matrix $Q$ gives the rate of transition from state $i$ to state $j$.

The probability of being in a particular state at time $t$ is given by the solution to the **Kolmogorov Forward Equations**, which are a system of differential equations derived from the transition rate matrix.

Here's how you might represent the transition rate matrix $Q$:

$$
Q = \begin{bmatrix}
q_{11} & q_{12} & \cdots & q_{1n} \\
q_{21} & q_{22} & \cdots & q_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
q_{n1} & q_{n2} & \cdots & q_{nn}
\end{bmatrix}
$$

And here's the general form of the Kolmogorov Forward Equations:

$$
\frac{d}{dt} P(t) = Q P(t)
$$

Where $P(t)$ is a vector that gives the probability of being in each state at time $t$.

## Code Example

---

```rust
extern crate rand;
extern crate rand_distr;

use rand::prelude::*;
use rand_distr::Exp;

// Define the states
#[derive(Debug, Copy, Clone)]
enum State {
    State1,
    State2,
}

// Function to simulate the Ctmc
fn simulate_ctmc(initial_state: State, rate_matrix: [[f64; 2]; 2], num_steps: usize) -> Vec<State> {
    let mut rng = thread_rng();
    let mut state = initial_state;
    let mut states = Vec::with_capacity(num_steps);

    for _ in 0..num_steps {
        states.push(state); // Push the state directly (it's now Copy)

        // Determine the rate of leaving the current state
        let rate = match state {
            State::State1 => rate_matrix[0][1],
            State::State2 => rate_matrix[1][0],
        };

        // Sample the time spent in the current state
        let exp = Exp::new(rate).unwrap();
        let _time_spent = exp.sample(&mut rng);

        // Transition to the other state
        state = match state {
            State::State1 => State::State2,
            State::State2 => State::State1,
        };
    }

    states
}

fn main() {
    // Define the rate matrix
    let rate_matrix = [
        [0.0, 1.0],
        [1.0, 0.0],
    ];

    // Simulate the Ctmc
    let states = simulate_ctmc(State::State1, rate_matrix, 1000);

    // Print the states
    for state in states {
        println!("{state:?}");
    }
}
```
