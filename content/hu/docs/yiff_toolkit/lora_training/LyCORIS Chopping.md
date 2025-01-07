---
weight: 2
bookFlatSection: false
bookToC: false
title: "LyCORIS Darabolás"
aliases:
  - /hu/docs/yiff_toolkit/lora_training/LyCORIS Darabolás
  - /hu/docs/yiff_toolkit/lora_training/LyCORIS Darabolás/
  - /docs/yiff_toolkit/lora_training/LyCORIS Darabolás
  - /docs/yiff_toolkit/lora_training/LyCORIS Darabolás/
  - /hu/docs/yiff_toolkit/lora_training/LyCORIS_Chopping
  - /hu/docs/yiff_toolkit/lora_training/LyCORIS_Chopping/
  - /hu/docs/yiff_toolkit/lora_training/LyCORIS-Chopping
  - /hu/docs/yiff_toolkit/lora_training/LyCORIS-Chopping/
---

<!--markdownlint-disable MD025 -->

# LyCORIS Darabolás

A LoRA-k néha nemkívánatos elemeket vagy viselkedéseket tartalmazhatnak a tanítás során. A "darabolás" lehetővé teszi a LoRA modell különböző részeinek szelektív engedélyezését vagy letiltását a hatások finomhangolásához. Ez segíthet a stílus átvitel, a karakter konzisztencia és egyéb tulajdonságok szabályozásában.

## Gyors Megoldás: Blokk Súlyozás

Használhatsz blokk súlyozási eszközöket generálás közben:

- [ComfyUI Inspire Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack) - Tartalmaz LoRA blokk súlyozási funkciókat
- [A1111 LoRA Block Weight](https://github.com/hako-mikan/sd-webui-lora-block-weight)

## Végleges Megoldás: Darabolás

Végleges megoldásként használhatod Gaeros `chop_blocks.py` szkriptjét a LoRA fájl módosításához:

```bash
git clone https://github.com/elias-gaeros/resize_lora
cd resize_lora
```

### Használat

```bash
python chop_blocks.py --model input.safetensors --save_to output.safetensors --vector "1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1"
```

## Vektor Karakterláncok Megértése

A vektor karakterláncok 0-tól 1-ig terjedő értékekkel szabályozzák, hogy mely rétegeket kell megtartani vagy eltávolítani:

- 1.0 = Réteg teljes megtartása
- 0.0 = Réteg teljes eltávolítása
- Köztes értékek = Részleges hatás

### Réteg Leképezés

| Pozíció | Rétegek | Leírás | Általános Használat |
| -------- | ------ | ----------- | ------------ |
| 1        | Globális | Teljes LoRA erősség | Általában 1-en tartva |
| 2-7      | Le   | Kezdeti jellemző kinyerés | Stílus, kompozíció |
| 8-9      | Közép    | Központi feldolgozás | Pózok, elrendezések |
| 10-21    | Ki    | Részletek rekonstrukciója | Karakter részletek |

## Gyakori Beállítások

| Beállítás Neve | Vektor |
|------------|---------|
| Karakter Fókusz | `1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0` |
| hamgas | `1,0,0,0,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,0,0` |
| kenket | `1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1` |
| serpent_x | `1,0,0,0,0,1,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0` |
| BEEG LAYERS | `1,0,0,0,1,1,0,1,1,0,1,0,1,1,1,0,0,0,0,0,0` |
| Minden Réteg | `1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1` |
| Mind Be | `1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0` |
| Mind Közép | `1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0` |
| Mind Ki (Wolf-Link) | `1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1` |
| Stílus Átvitel | `1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0` |
| Ringdingding (Stoat) | `1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0` |
| Garfield (Karakter+Stílus) | `1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0` |
| Rutkowski | `1,1,1,1,1,1,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1` |

---

---

{{< related-posts related="docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/ | docs/yiff_toolkit/lora_training_guide/ | docs/yiff_toolkit/lora_training/" >}}
