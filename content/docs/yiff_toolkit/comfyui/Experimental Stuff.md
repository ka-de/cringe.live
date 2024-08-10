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

Put this `--front-end-version Comfy-Org/ComfyUI_frontend@latest` after `main.py`.

I think those node previews are really stupid lmao!

## For Loops

---

You can check out the branch with [gh](https://cli.github.com/) but make sure to remind yourself that you are behind `master` by a few commits!

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

You should also get the [execution-inversion-demo-comfyui](https://github.com/BadCafeCode/execution-inversion-demo-comfyui) custom node so you can try out some of the new features you just enabled!

So how do these for loops work? Uh, good question! Let's find out!
