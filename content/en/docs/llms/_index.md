# Roleplaying with Language Models

---

## Why Use Language Models for Roleplaying?

---

Language models have opened up a new world for interactive storytelling. They can act as dungeon masters, NPCs, or even your roleplaying companions. With the right setup, you can create immersive adventures, generate unique characters, and explore dynamic narratives, all guided by AI.

## Subsections

---

{{< section-noimg details >}}

## Getting Started

---

First, you need to choose where and how to run your model. Here are the main options:

### Running on Your GPU

Running a model on your GPU is the fastest option, but it requires enough VRAM. You’ll want at least 8 GB, though 12 GB or more is ideal. Use a loader like Exllamav2_HF with models in the EXL2 format for the best performance. GPTQ models can also work but may be less efficient.

### Running on Your CPU

If you don’t have a powerful GPU, you can run models on your CPU. It’s slower but gets the job done. For this, GGUF models are the way to go, loaded using llama.cpp, kobold.cpp, or LM Studio. To speed things up a bit, you can offload part of the model to your GPU memory if you have one.

## Popular Model Formats

---

### GGUF

This format is ideal for CPUs and works with llama.cpp or koboldcpp. The “Q-number” in model names (e.g., Q4_k_m) gives a rough idea of bits per weight (bpw), though actual bpw is slightly higher.

### EXL2

Designed for GPUs with Exllamav2_HF, EXL2 supports quantization from ~2.3 to 8 bpw. At the high end, it’s nearly lossless.

### GPTQ

An older GPU-only format. While Exllamav2 can handle GPTQ models, it’s limited to 4 bpw variants. Other variants require AutoGPTQ for loading.

## Quantization Explained

---

Quantization reduces model size by approximating weights, allowing large models to fit into smaller VRAM or RAM spaces. Here’s a quick breakdown:

8 bpw: Needs as many GB of VRAM as the model’s parameter count in billions.

4 bpw: Halves the memory requirement but may introduce tiny quality losses.

3 bpw and below: Noticeable quality loss, but useful for fitting massive models.

## Context Length and Memory

---

What’s Context Length?

Context length is the maximum number of tokens a model can process in one go. Older models max out at 2k-4k tokens, but newer ones support up to 200k tokens! Keep in mind:

Longer contexts need more VRAM or RAM.

RoPE scaling can extend context lengths but may reduce quality.

Use features like cache_8bit in Exllamav2_HF to reduce memory usage.

Memory Requirements

To estimate memory needs, use the formula:

Memory per token = (2 bytes) × 2 × num_hidden_layers × num_key_value_heads × hidden_size ÷ num_attention_heads

Example for a model:

hidden_size = 4096

num_hidden_layers = 32

num_key_value_heads = 8

num_attention_heads = 32

Calculation:
(2 bytes) × 2 × 32 × 8 × 4096 ÷ 32 = 128 kB per token.

## Enhancing Your Roleplaying Experience

---

### Dynamic Character Interactions

Use models with fine-tuned instruction-following abilities for better character dialogues. Models like Alpaca or custom LoRA-tuned variants can help create more nuanced responses.

### Long-Term Memory with RAG

Retrieval-Augmented Generation (RAG) systems can mimic memory by fetching relevant information from a database and appending it to the query. This keeps interactions consistent over long conversations without needing massive context lengths.

## Suggested Models for Roleplaying

---

### High-End GPUs (24+ GB VRAM)

#### Meta-Llama-3.1-405B-Instruct

Comparable to GPT-4o with exceptional instruction-following capabilities.

#### Mistral Large Instruct v2407 (123B)

Great for uncensored and nuanced dialogues, though slow unless you have significant VRAM.

### Mid-Range GPUs (12-16 GB VRAM)

#### gemma-2-27b-it

Balanced for SFW and intelligent roleplaying.

#### Llama 3.1 70B Instruct

Fully offloadable and functional even with lower bpw.

### Lower-End GPUs (6-10 GB VRAM)

#### Mistral-Nemo-Instruct-2407 (12B)

Ideal for uncensored dialogues.

#### Gemma-2-9B-It-SPPO-Iter3

Versatile and efficient.

### CPUs

#### dolphin-2.6-mistral-7b-dpo-laser.Q5_K_M.gguf

Requires $\sim 10$ GB RAM at Q5_K_M.

#### openchat-3.5-0106.Q5_K_M.gguf (7B)

Fast and reliable for low-resource setups.

---

Explore, experiment, and enjoy crafting immersive roleplaying adventures with language models!
