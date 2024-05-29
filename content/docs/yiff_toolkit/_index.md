---
weight: 1
bookFlatSection: false
bookToC: true
title: "🐺 - yiff_toolkit"
---

<!--markdownlint-disable MD025 MD033 -->

# Yiff Toolkit

---

## Introduction

The `yiff_toolkit` is a comprehensive set of tools designed to enhance your creative process in the realm of furry art. From refining artist styles to generating unique characters, the Yiff Toolkit provides a range of tools to help you cum.

> NOTE: You can click on any image in this README to be instantly teleported next to the original resolution version of it! If you want the metadata for a picture and it isn't there, you need to delete the letter e before the .png in the link! If a metadata containing original image is missing, please let me know!

## Subsections

{{< section details >}}

## Dataset Tools

I have uploaded all of the little handy Python scripts I use to [/dataset_tools](/docs/yiff_toolkit/dataset_tools/). They are pretty self explanatory by just the file name but almost all of them contain an AI generated descriptions. If you want to use them you will need to edit the path to your `training_dir` folder, the variable will be called `path` or `directory` and look something like this:

```py
def main():
    path = 'C:\\Users\\kade\\Desktop\\training_dir_staging'
```

Don't be afraid of editing Python scripts, unlike the real snake, these won't bite!

## Dataset Preparation

Before you begin collecting your dataset you will need to decide what you want to teach the model, it can be a character, a style or a new concept.

For now let's imagine you want to teach your model _wickerbeasts_ so you can generate your VRChat avatar every night.

### Create the `training_dir` Directory

Before starting we need a directory where we'll organize our datasets. Open up a terminal by pressing `Win + R` and typing in `pwsh`. We will also be using [git](https://git-scm.com/download/win) and [huggingface](https://huggingface.co/) to version control our smut. For brevity I'll refrain from giving you a tutorial on both. Once you have your newly created dataset on HF ready lets clone it. Make sure you change `user` in the first line to your HF username!

```bat
git clone git@hf.co:/datasets/user/training_dir C:\training_dir
cd C:\training_dir
git branch wickerbeast
git checkout wickerbeast
```

Let's continue with downloading some _wickerbeast_ data but don't close the terminal window just yet, for this we'll make good use of the furry <abbr title="image board">booru</abbr> [e621.net](https://e621.net/). There are two nice ways to download data from this site with the metadata intact, I'll start with the fastest and then I will explain how you can selectively browse around the site and get the images you like one by one.
