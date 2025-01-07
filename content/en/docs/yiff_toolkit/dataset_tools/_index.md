---
weight: 3
bookFlatSection: false
bookCollapseSection: true
bookToC: false
title: "Dataset Tools"
summary: 'A "small" collection of Python and PowerShell scripts that dataset curators might find handy.'
aliases:
  - /docs/yiff_toolkit/dataset_tools/
---

<!--markdownlint-disable MD025 -->

# Dataset Tools

---

These scripts are pretty self explanatory by just the file name but almost all of them contain an AI generated description about what exactly they do. If you want to use them you will need to edit the path to your `training_dir` folder, the variable will be called `path` or `directory` and look something like this:

```py
def main():
    path = 'C:\\Users\\kade\\Desktop\\training_dir_staging'
```

The ⚡ in the title means it is a PowerShell script and 🐍 means Python and a 🦀 means Rust of course!

Don't be afraid of editing Python scripts, unlike the real snake, these won't bite! In the worst case they'll just delete your files!

{{< section details >}}

## The Eventual Rust Rewrite

---

I also have [dataset-tools](https://github.com/ka-de/dataset-tools) which is a horrible amalgamation of various tools I use.

My [gists](https://gist.github.com/ka-de) are also a graveyard of useful snippets and Jupyter notebooks I have at some point used.

But to make it even more complicated, I also stashed my most often used scripts and training scripts in [k4d3/toolkit](https://huggingface.co/k4d3/toolkit) on huggingface.

---

---

{{< related-posts related="docs/yiff_toolkit/ | docs/yiff_toolkit/lora_training/Tracking-Training-Changes/ | docs/yiff_toolkit/lora_training/" >}}
