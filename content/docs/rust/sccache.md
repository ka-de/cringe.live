---
weight: 1
bookFlatSection: false
bookToC: false
title: "sccache"
summary: "Sccache is a ccache-like tool developed by Mozilla that acts as a compiler wrapper, avoiding compilation when possible by caching and reusing intermediate build artifacts across multiple builds, supporting various languages including C/C++, Rust, and NVIDIA's CUDA."
---

<!--markdownlint-disable MD025 MD033 -->

# sccache

---

[sccache](https://github.com/mozilla/sccache) is a compiler caching tool similar to ccache. It is used as a compiler wrapper and avoids compilation when possible, storing cached results either on local disk or in one of several cloud storage backends. Sccache supports caching the compilation of C/C++ code, Rust, as well as NVIDIA's CUDA using nvcc, and clang. It also provides distributed compilation and debugging features. This tool can significantly reduce the build time and improve the developer experience. It works by intercepting the calls to the compiler and checking if the input files have been cached before. If the input files have been cached, sccache returns the cached output instead of invoking the compiler. If the input files have not been cached, `sccache` invokes the compiler, builds the code, and stores the output so it can be reused later. This makes sccache a valuable tool for optimizing build speeds, especially in large and complex projects.

To install it all you need to do is type in

```bash
cargo install sccache
```

and then set the environment variable `RUSTC_WRAPPER`, but make sure you use the correct path to sccache!

![An image explaining how to set the environment variable.](/images/rust/sccache-1.png)
