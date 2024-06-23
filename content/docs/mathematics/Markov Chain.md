---
weight: 1
bookFlatSection: false
title: "Markov Chain"
bookToC: false
---

<!--markdownlint-disable MD025 -->

# Markov Chain

A **Markov chain**, also known as a Markov process, is a mathematical model that describes a sequence of possible events, where the probability of each event depends only on the state attained in the previous event. This property is often characterized as "memorylessness".

In simpler terms, it's a process for which predictions can be made regarding future outcomes based solely on its present state. Importantly, these predictions are just as good as the ones that could be made knowing the process's full history. In other words, conditional on the present state of the system, its future and past states are independent.

A Markov chain can have either a discrete state space or a discrete index set (often representing time), but the precise definition varies. It can be a discrete-time Markov chain (DTMC) where the chain moves state at discrete time steps, or a continuous-time process called a continuous-time Markov chain (CTMC).

Markov chains have many applications as statistical models of real-world processes. They provide the basis for general stochastic simulation methods known as Markov chain Monte Carlo, which are used for simulating sampling from complex probability distributions, and have found application in areas including Bayesian statistics, biology, chemistry, economics, finance, information theory, physics, signal processing, and speech processing.

The adjectives Markovian and Markov are used to describe something that is related to a Markov process. Overall, a Markov chain is a powerful tool in probability theory and statistics that is used to model systems that follow a chain of linked events, where what happens next depends only on the current state of the system.
