---
weight: 1
bookFlatSection: false
bookToC: false
title: "Limit Number of Cargo Build Jobs"
summary: "How to limit the jobs `cargo` spawns."
---

<!--markdownlint-disable MD025 MD033 -->

# Limit Number of Cargo Build Jobs

---

You can limit the number of jobs that `cargo` spawns by setting the `-j` or `--jobs` option in the command line, or by setting the `jobs` key in the `.cargo/config` file.

**Option 1: Command Line**
You can specify the number of jobs directly in the command line when you run `cargo`. For example, if you want to limit it to 4 jobs, you can do:

```bash
cargo build -j 4
```

**Option 2: Configuration File**
You can also set the number of jobs in the `.cargo/config` file. If this file doesn't exist, you can create it in your project directory or in your home directory for a global setting. Here's how you can set it to 4 jobs:

```toml
[build]
jobs = 4
```

Remember to replace `4` with the number of jobs you want `cargo` to use. This setting will then be used for all future `cargo` commands in your project.

Please note that limiting the number of jobs might slow down the compilation process, but it can also reduce the system load and make your computer more responsive during the compilation. It's all about finding the right balance for your specific needs and system capabilities.
