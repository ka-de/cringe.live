---
weight: 2
bookFlatSection: false
bookToC: true
title: "ComfyUI-Custom-Scripts"
summary: ""
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# ComfyUI-Custom-Scripts

---

A bunch of useful and less useful custom nodes and features by pythongosssss.

## Text Autocomplete

---


<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/custom_scripts_completion.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

This functionality allows you to autocomplete your text as you type, which you can enable or disable in the settings.

<div style="text-align: center;">

![Autocomplete Settings](/images/comfyui/autocomplete_settings.png)

</div>

You can paste in an entire `.csv` file into the text box in the "Manage Custom Words" and you should see the words you added appear in the dropdown menu when you type into a prompt!

If you need a `.csv` file with words, you can use my spellbook if you really want!

```bash
https://raw.githubusercontent.com/ka-de/sacred_words/refs/heads/main/spellbook.csv
```

## Always Snap to Grid

---

It will be like holding `Shift` while moving nodes and groups, without actually having to hold down `Shift`. Genius!

<div style="text-align: center;">

![Always Snap to Grid](/images/comfyui/always_snap_to_grid.png)

</div>

## PlaySound and SystemNotification

---

These two nodes play a sound and display a notification every time something ran through them. It's super useful if you have a slow GPU or if you are working on animations and things just take a while to cook!

<div style="text-align: center;">

![Sound and Notification](/images/comfyui/sound_and_notification.png)

</div>

## Image Feed

---

This used to be my favorite feature, but since the new UI, I prefer the Queue (`q`) in the sidebar panel.

<div style="text-align: center;">

![Image Feed Settings](/images/comfyui/imagefeed_settings.png)

</div>

## Preset Text and Show Text

---

The `Preset Text` node lets you create your own preset text, which you can then reuse easily and the `Show Text` node let's you easily debug your text related shenanigans with ComfyUI by displaying them.

<div style="text-align: center;">

![Text Nodes](/images/comfyui/text_nodes.png)

</div>

## Workflow Image

---

This lets you export your workflow as an SVG or PNG file. Very handy!

<div style="text-align: center;">

![Workflow Image](/images/comfyui/workflow_image.png)

</div>
