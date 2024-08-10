---
weight: 2
bookFlatSection: false
bookToC: true
title: "ComfyUI-Prediction"
summary: ""
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# ComfyUI-Prediction

---

Another cool custom node. You need to set it up like this for Avoid and Erase:

<!--
I'll be honest, I have to sit down one day and go through it one more time. This is just too much for my 🐺🧠!
-->

![Prediction Avoid and Erase](/images/comfyui/prediction_avoid_and_erase.png)

But in order for you to really start understanding what this custom node does, let's recreate first the CFG prediction:

![Recreating CFG Prediction](/images/comfyui/recreating_cfg_prediction.png)

But now that you have built it out, lets select all of it while holding `Ctrl`, and deleting the whole thing, because this was just mostly meant for education purposes.

If you want to use CFG Prediction, you might be better off with using the default setup with the default KSampler and all so you can benefit from model patches and whatever.

You might also want to take a look at Perp-Neg and the multiple ways it is implemented in ComfyUI, hell, with this, you can even set it up yourself.

It would look something like this:

![Bootleg Perp-Neg](/images/comfyui/bootleg_perp-neg.png)

<!--
You can even do this evil thing:

![Evil Thing](/images/comfyui/evil_thing.png)

I'm not sure if its a good idea, I can think of at least one reason why this is a good idea, but I'm just a 🐺!
-->

You can also build it out like this:

![Another Prediction](/images/comfyui/another_prediction.png)

And here is yet another weird prediction model you can build out, which results in pretty awesome images:

![Another Weird Prediction](/images/comfyui/another_weird_prediction.png)
