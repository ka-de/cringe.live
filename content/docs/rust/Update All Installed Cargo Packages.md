---
weight: 1
bookFlatSection: false
bookToC: false
title: "Update All Installed Cargo Packages"
summary: "Explains how to update every package installed with `cargo`."
---

<!--markdownlint-disable MD025 MD033 -->

# Update All Installed Cargo Packages

---

To update all your globally installed Cargo packages, you can use the `cargo install-update` command, which is part of the `cargo-update` crate. Here are the steps:

1. If you haven't installed `cargo-update` yet, install it first by running:

    ```bash
    cargo install cargo-update
    ```

2. Then, you can update all your globally installed Cargo packages by running:

    ```bash
    cargo install-update -a
    ```

    This command will check for newer versions of all installed packages and, if found, install the updates. Please note that you might need to add the Cargo bin directory to your PATH if it's not already there. You can do this by adding `export PATH="$HOME/.cargo/bin:$PATH"` to your shell profile (`.bashrc`, `.bash_profile`, `.zshrc`, etc.). Remember to source the profile or restart your terminal session to apply the changes.
