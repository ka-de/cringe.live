---
weight: 2
bookFlatSection: false
bookToC: true
title: "Experimental Stuff"
summary: "This document contains information that might get outdated before you finish reading it! So make sure you have your glasses on!"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# Experimental Stuff

---

## New Frontend

---

Put this `--front-end-version Comfy-Org/ComfyUI_frontend@latest` after `main.py` in your command-line argument you use to start your ComfyUI!

### New Features

---

You can now drag and drop nodes from the Node Library sidebar to your workflow, which you can also search!

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/node_library_search_drag.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>


## For Loops

---

~~You can check out the branch with [gh](https://cli.github.com/) but make sure to remind yourself that you are behind `master` by a few commits!~~

<!--
```bash
gh pr checkout 2666
```

You can switch back to `master` with:

```bash
git checkout master
```

Or alternatively you can do this:

```bash
gh pr checkout 2666
git fetch origin
git merge origin/master
```
-->

The branch has been merged!

You should also make sure the [execution-inversion-demo-comfyui](https://github.com/BadCafeCode/execution-inversion-demo-comfyui) custom node you might have downloaded is updated!

So how do these for loops work? Uh, good question! Let's find out!
## Lazy Evaluation

---

## Node Expansion

---

Nodes can be expanded now to multiple other nodes during runtime. The `Advanced Prompt` node is an example of this. You can use `anthro male wolf, [full-length portrait:cute fangs:0.4]` to use the prompt `anthro male wolf, full-length portrait` during the first 40% of sampling and `anthro male wolf, cute fangs` during the last 60% of sampling. This node also allows use of LoRAs just by typing `<lora:blp-v1e400.safetensors:0.2>` to load a LoRA in with 20% strength.

This is a great step towards a bright future with subgraphs!
