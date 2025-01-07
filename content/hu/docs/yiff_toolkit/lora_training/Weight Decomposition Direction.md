---
title: "Súlyfelbontás Iránya a DoRA-ban"
description: "A bemeneti és kimeneti dimenzió normalizálásának megértése a DoRA súlyfelbontási implementációjában"
weight: 6
bookToC: false
bookFlatSection: false
aliases:
  - /hu/docs/yiff_toolkit/lora_training/Weight-Decomposition-Direction/
  - /hu/docs/yiff_toolkit/lora_training/Weight-Decomposition-Direction
  - /hu/docs/yiff_toolkit/lora_training/Weight_Decomposition_Direction/
  - /hu/docs/yiff_toolkit/lora_training/Weight_Decomposition_Direction
  - "/hu/docs/yiff_toolkit/lora_training/Weight Decomposition Direction/"
  - "/hu/docs/yiff_toolkit/lora_training/Weight Decomposition Direction"
  - /docs/yiff_toolkit/lora_training/Weight-Decomposition-Direction/
  - /docs/yiff_toolkit/lora_training/Weight-Decomposition-Direction
  - /docs/yiff_toolkit/lora_training/Weight_Decomposition_Direction/
  - /docs/yiff_toolkit/lora_training/Weight_Decomposition_Direction
  - "/docs/yiff_toolkit/lora_training/Weight Decomposition Direction/"
  - "/docs/yiff_toolkit/lora_training/Weight Decomposition Direction"
---

A DoRA (Weight-Decomposed Low-Rank Adaptation) módszer súlyfelbontást vezet be a paraméter-hatékony finomhangoláshoz. Egy fontos implementációs részlet a normalizálás irányával kapcsolatban különös figyelmet érdemel, különösen a LyCORIS implementációval való munka során.

## Az Implementációs Részlet

Az eredeti DoRA tanulmányban a súlyfelbontást a (2)-es egyenlet definiálja:

$$ W = m \cdot \frac{V}{||V||_c} $$

ahol $||·||_c$ a mátrix oszlopvektoronkénti vektor-normáját jelöli. A neurális hálózatok súlymátrixainál ezt a normát két módon lehet kiszámítani:

1. **Bemeneti dimenzió**: Minden kimeneti neuron súlyait oszlopvektorként kezelve
2. **Kimeneti dimenzió**: Minden bemeneti neuron hozzájárulását oszlopvektorként kezelve

## LyCORIS Implementáció

Az eredeti LyCORIS implementáció alapértelmezetten a bemeneti dimenzió mentén számítja a vektor-normát. Azonban a norma számítását a kimeneti dimenzió mentén is engedélyezhetjük a következő beállítással:

```python
wd_on_output=True
```

Ezt a beállítást néhányan a tanulmány megfogalmazásának "helyesebb" értelmezésének tartják.

## Miért Fontos Ez

A normalizálási irány választása több szempontból is befolyásolja a modellt: hatással van a nagyság és irány komponensek felbontására, befolyásolja a tanulási dinamikát a finomhangolási folyamat során, és végül meghatározza a modell végső adaptációs viselkedését.

Bár mindkét megközelítés működhet, a kimeneti dimenzió normalizálása (`wd_on_output=True`) jobban illeszkedhet az eredeti tanulmányban szándékolt matematikai megfogalmazáshoz. Azonban az ajánlott az empirikus értékelés az adott feladaton és architektúrán annak meghatározására, hogy melyik megközelítés működik jobban a gyakorlatban.

---

---

{{< related-posts related="docs/yiff_toolkit/lora_training/dora/ | docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/comfyui/" >}}
