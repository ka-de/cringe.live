---
weight: 5
bookFlatSection: false
title: "Kolmogorov-Arnold Networks"
summary: "Kolmogorov-Arnold Networks (KANs) are a novel neural network architecture that, inspired by the Kolmogorov-Arnold representation theorem, replaces the fixed activation functions of Multi-Layer Perceptrons (MLPs) with learnable activation functions on edges, leading to improved accuracy and interpretability."
bookToC: false
---

<!-- markdownlint-disable MD025 -->

# Kolmogorov-Arnold Networks

---

Kolmogorov-Arnold Networks (KANs) are a type of neural network inspired by the Kolmogorov-Arnold representation theorem. They are proposed as promising alternatives to Multi-Layer Perceptrons (MLPs). This theorem states that any multivariate continuous function can be represented as a superposition of continuous functions of one variable. In the context of neural networks, this theorem provides a theoretical foundation for the universal approximation capability of neural networks.

The structure of a KAN is quite different from that of a traditional MLP. While an MLP consists of multiple layers of neurons, each connected to all neurons in the previous and next layers, a KAN has a more complex structure. It consists of a series of nested functions, each of which takes as input the output of the previous function and a single additional input. This structure mirrors the form of the functions described by the Kolmogorov-Arnold representation theorem.

One of the key advantages of KANs over MLPs is their efficiency. Because of their nested structure, KANs can represent complex functions with fewer neurons than an equivalent MLP. This makes KANs more computationally efficient and faster to train.

However, KANs also have their challenges. The nested structure that gives KANs their efficiency also makes them more difficult to train. Traditional backpropagation algorithms used to train MLPs do not work well with KANs, and new training algorithms need to be developed.

![An example KAN](/images/kan-1.png)
