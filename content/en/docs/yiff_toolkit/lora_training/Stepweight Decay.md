---
weight: 2
bookFlatSection: false
bookToC: false
title: "Stepweight Decay"
aliases:
  - /docs/yiff_toolkit/lora_training/Stepweight-Decay/
  - /docs/yiff_toolkit/lora_training/Stepweight-Decay
  - /docs/yiff_toolkit/lora_training/Stepweight Decay/
  - /docs/yiff_toolkit/lora_training/Stepweight Decay
  - /docs/yiff_toolkit/lora_training/stepweight-decay/
  - /docs/yiff_toolkit/lora_training/stepweight-decay
  - /docs/yiff_toolkit/lora_training/stepweight_decay
  - /docs/yiff_toolkit/lora_training/stepweight_decay
  - /docs/yiff_toolkit/lora_training/Stepweight_Decay
  - /docs/yiff_toolkit/lora_training/Stepweight_Decay/
---

<!--markdownlint-disable MD025 -->

# Stepweight Decay

Stepweight decay, also known as learning rate decay or weight decay, is a technique used for regularization in machine learning models and neural network optimization algorithms. Here's a simplified explanation of its purpose and how it's implemented in the Compass optimizer:

1. **Objective**:
   - It aids in avoiding overfitting by imposing a penalty for large weights in the model.
   - It enhances generalization by prompting the model to learn simpler patterns.

2. **Compass Optimizer Implementation**:
   Here's how stepweight decay is applied in the code:

   ```python
   if weight_decay != 0:
       # Apply stepweight decay
       p.data.mul_(1 - step_size * weight_decay)
   ```

3. **Functioning**:
   - `weight_decay` is a hyperparameter that determines the intensity of the decay.
   - `step_size` is the learning rate applicable for this update step.
   - The weights (`p.data`) are multiplied by a factor that is slightly less than 1.
   - This factor is `(1 - step_size * weight_decay)`.

4. **Impact**:
   - Each update marginally decreases the size of all weights.
   - Larger weights are reduced more in absolute terms.
   - This creates a tendency for the weights to remain small unless they significantly contribute to loss reduction.

5. **Comparison with L2 Regularization**:
   - Although it has a similar effect to L2 regularization, stepweight decay is applied directly in the parameter update step, which can result in slightly different behavior, especially with adaptive learning rate methods.

6. **Adaptive Feature**:
   - As it uses `step_size`, the decay adapts to the current effective learning rate, making it more stable across different training phases.

The term "stepweight" in this context highlights that the decay is applied at each optimization step, integrated into the weight update process, rather than being a separate regularization term in the loss function.
