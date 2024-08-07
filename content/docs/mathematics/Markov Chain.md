---
weight: 1
bookFlatSection: false
title: "Markov Chain"
bookToC: false
summary: "A Markov chain is a statistical model that undergoes transitions from one state to another within a finite or countable number of possible states, where the probability of transitioning to any particular state depends solely on the current state and not on the sequence of states that preceded it."
---

<!--markdownlint-disable MD025 -->

# Markov Chain

---

A **Markov chain**, also known as a Markov process, is a mathematical model that describes a sequence of possible events, where the probability of each event depends only on the state attained in the previous event. This property is often characterized as "memorylessness".

In simpler terms, it's a process for which predictions can be made regarding future outcomes based solely on its present state. Importantly, these predictions are just as good as the ones that could be made knowing the process's full history. In other words, conditional on the present state of the system, its future and past states are independent.

A Markov chain can have either a discrete state space or a discrete index set (often representing time), but the precise definition varies. It can be a discrete-time Markov chain (DTMC) where the chain moves state at discrete time steps, or a continuous-time process called a continuous-time Markov chain (CTMC).

The transition probabilities of a Markov chain can be represented by a matrix, where the entry in the $i^{th}$ row and $j^{th}$ column represents the probability of transitioning from state $i$ to state $j$. If we denote this matrix by $P$, then the entry $P_{ij}$ is given by:

$$ P_{ij} = P(X_{n+1} = j | X_n = i) $$

Markov chains have many applications as statistical models of real-world processes. They provide the basis for general stochastic simulation methods known as Markov chain Monte Carlo, which are used for simulating sampling from complex probability distributions, and have found application in areas including Bayesian statistics, biology, chemistry, economics, finance, information theory, physics, signal processing, and speech processing.

The adjectives Markovian and Markov are used to describe something that is related to a Markov process. Overall, a Markov chain is a powerful tool in probability theory and statistics that is used to model systems that follow a chain of linked events, where what happens next depends only on the current state of the system.

## Code Example

---

A simple weather simulation based on a Markov Chain. The weather of the current day is used to probabilistically determine the weather of the next day. The weather can be “rainy”, “cloudy”, or “sunny”, and the transitions between these states are determined by the Markov Chain. The simulation runs for 30 days, starting with a “rainy” day. The weather for each day is printed to the console.

```rust
use std::collections::HashMap;
use nanorand::{ WyRand, Rng };

struct MarkovChain {
    transitions: HashMap<String, Vec<String>>,
}

impl MarkovChain {
    fn new() -> Self {
        Self {
            transitions: HashMap::new(),
        }
    }

    fn add_transition(&mut self, state: String, next_state: String) {
        self.transitions.entry(state).or_insert_with(Vec::new).push(next_state);
    }

    fn next_state(&self, current_state: &str) -> Option<&String> {
        let mut rng = WyRand::new();
        self.transitions
            .get(current_state)
            .and_then(|next_states| { next_states.get(rng.generate_range(0..next_states.len())) })
    }
}

fn main() {
    let mut chain = MarkovChain::new();
    chain.add_transition("rainy".to_string(), "cloudy".to_string());
    chain.add_transition("rainy".to_string(), "sunny".to_string());
    chain.add_transition("cloudy".to_string(), "sunny".to_string());
    chain.add_transition("cloudy".to_string(), "rainy".to_string());
    chain.add_transition("sunny".to_string(), "rainy".to_string());
    chain.add_transition("sunny".to_string(), "cloudy".to_string());

    let mut current_state = "rainy".to_string();
    for _ in 0..30 {
        print!("Current state: {current_state} ");
        if let Some(next_state) = chain.next_state(&current_state) {
            println!("Next state: {next_state}");
            current_state = next_state.to_string();
        }
    }
}
```
