---
weight: 2
bookFlatSection: false
bookToC: false
title: "Lépésenkénti Súlycsökkentés"
aliases:
  - /hu/docs/yiff_toolkit/lora_training/Stepweight-Decay/
  - /hu/docs/yiff_toolkit/lora_training/Stepweight-Decay
  - /hu/docs/yiff_toolkit/lora_training/Stepweight Decay/
  - /hu/docs/yiff_toolkit/lora_training/Stepweight Decay
  - /hu/docs/yiff_toolkit/lora_training/stepweight-decay/
  - /hu/docs/yiff_toolkit/lora_training/stepweight-decay
  - /hu/docs/yiff_toolkit/lora_training/stepweight_decay
  - /hu/docs/yiff_toolkit/lora_training/stepweight_decay
  - /hu/docs/yiff_toolkit/lora_training/Stepweight_Decay
  - /hu/docs/yiff_toolkit/lora_training/Stepweight_Decay/
---

<!--markdownlint-disable MD025 -->

# Lépésenkénti Súlycsökkentés

A lépésenkénti súlycsökkentés, más néven tanulási ráta csökkentés vagy súlycsökkentés, egy olyan technika, amelyet a gépi tanulási modellek és neurális hálózat optimalizációs algoritmusok regularizációjára használnak. Itt egy egyszerűsített magyarázat a céljáról és arról, hogyan van implementálva a Compass optimalizálóban:

1. **Cél**:
   - Segít elkerülni a túltanulást azáltal, hogy büntetést szab ki a modell nagy súlyaira.
   - Javítja az általánosítást azzal, hogy a modellt egyszerűbb minták tanulására ösztönzi.

2. **Compass Optimalizáló Implementáció**:
   Íme, hogyan alkalmazzák a lépésenkénti súlycsökkentést a kódban:

   ```python
   if weight_decay != 0:
       # Lépésenkénti súlycsökkentés alkalmazása
       p.data.mul_(1 - step_size * weight_decay)
   ```

3. **Működés**:
   - A `weight_decay` egy hiperparaméter, amely meghatározza a csökkentés intenzitását.
   - A `step_size` az ehhez a frissítési lépéshez alkalmazandó tanulási ráta.
   - A súlyokat (`p.data`) megszorozzák egy 1-nél kicsit kisebb tényezővel.
   - Ez a tényező az `(1 - step_size * weight_decay)`.

4. **Hatás**:
   - Minden frissítés kismértékben csökkenti az összes súly méretét.
   - A nagyobb súlyok abszolút értékben jobban csökkennek.
   - Ez arra készteti a súlyokat, hogy kicsik maradjanak, hacsak nem járulnak hozzá jelentősen a veszteség csökkentéséhez.

5. **Összehasonlítás az L2 Regularizációval**:
   - Bár hasonló hatása van, mint az L2 regularizációnak, a lépésenkénti súlycsökkentést közvetlenül a paraméter frissítési lépésben alkalmazzák, ami kissé eltérő viselkedést eredményezhet, különösen az adaptív tanulási ráta módszereknél.

6. **Adaptív Jellemző**:
   - Mivel a `step_size`-t használja, a csökkentés alkalmazkodik az aktuális effektív tanulási rátához, így stabilabb a különböző tanulási fázisokban.

A "lépésenkénti súly" kifejezés ebben a kontextusban azt hangsúlyozza, hogy a csökkentést minden optimalizációs lépésben alkalmazzák, beépítve a súlyfrissítési folyamatba, ahelyett, hogy egy külön regularizációs tag lenne a veszteségfüggvényben.
