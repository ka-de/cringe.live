---
weight: 2
bookFlatSection: false
bookToC: true
title: "ComfyUI-Custom-Scripts"
summary: ""
aliases:
  - /hu/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/
  - /hu/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts
  - /hu/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI Custom Scripts/
  - /hu/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI Custom Scripts
  - /hu/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI_Custom_Scripts/
  - /hu/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI_Custom_Scripts
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# ComfyUI-Custom-Scripts

---

Egy csomó hasznos (és kevésbé hasznos) egyedi node és funkció pythongosssss-tól.

## Text Autocomplete

---

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/custom_scripts_completion.mp4" type="video/mp4">
        A böngésződ nem támogatja a videó lejátszását.
    </video>
</div>

Ez a funkció lehetővé teszi hogy gépelés közben automatikusan kiegészítse a szöveget. A beállításokban be- és kikapcsolhatod.

<div style="text-align: center;">

![Automatikus Kiegészítés Beállításai](/images/comfyui/autocomplete_settings.png)

</div>

Simán beilleszthetsz egy teljes `.csv` fájlt a "Manage Custom Words" szövegdobozba, és a hozzáadott szavak meg fognak jelenni a legördülő menüben amikor gépelsz!

Ha szükséged van egy `.csv` fájlra tele szavakkal, nyugodtan használhatod az én varázskönyvemet:

```bash
https://raw.githubusercontent.com/ka-de/sacred_words/refs/heads/main/spellbook.csv
```

## Always Snap to Grid

---

Olyan, mintha folyamatosan nyomva tartanád a `Shift` billentyűt a node-ok és csoportok mozgatása közben, anélkül hogy tényleg nyomva kéne tartanod. Zseniális!

<div style="text-align: center;">

![Mindig Rácshoz Igazítás](/images/comfyui/always_snap_to_grid.png)

</div>

## PlaySound és SystemNotification

---

Ez a két node hangjelzést ad és értesítést jelenít meg, valahányszor valami átfut rajtuk. Szuper hasznos, ha lassú a GPU-d, vagy ha animációkon dolgozol és sokáig tart a renderelés!

<div style="text-align: center;">

![Hang és Értesítés](/images/comfyui/sound_and_notification.png)

</div>

## Image Feed

---

Ez volt régebben a kedvenc funkcióm, de az új felület óta inkább a Queue-t (`q`) használom az oldalsávban.

<div style="text-align: center;">

![Kép Feed Beállítások](/images/comfyui/imagefeed_settings.png)

</div>

## Preset Text és Show Text

---

A `Preset Text` node-dal saját előre beállított szövegeket hozhatsz létre, amiket aztán könnyen újra felhasználhatsz, a `Show Text` node pedig segít könnyen debuggolni a szöveges dolgaidat a ComfyUI-ban azáltal, hogy megjeleníti őket.

<div style="text-align: center;">

![Szöveg Node-ok](/images/comfyui/text_nodes.png)

</div>

## Workflow Kép

---

Ezzel exportálhatod a workflow-dat SVG vagy PNG formátumban. Nagyon praktikus!

<div style="text-align: center;">

![Workflow Kép](/images/comfyui/workflow_image.png)

</div>

---

---

{{< related-posts related="docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Manager/" >}}
