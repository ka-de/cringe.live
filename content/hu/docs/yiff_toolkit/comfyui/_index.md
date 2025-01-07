---
weight: 2
bookFlatSection: false
bookToC: true
title: "A ComfyUI Biblia"
summary: "Átfogó útmutató a ComfyUI használatához, az alapvető node-alapú munkafolyamatoktól a fejlett AI képgenerálási technikákig."
aliases:
  - /hu/docs/yiff_toolkit/comfyui/
  - /hu/docs/yiff_toolkit/comfyui
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# A ComfyUI Biblia

---

## Bevezetés

---

Ha segítségre van szükséged a ComfyUI telepítéséhez, nem jó helyen jársz. Ha Windowst használsz, használhatod az [előre összeállított](https://docs.comfy.org/get_started/pre_package) csomagot, vagy [manuálisan](https://docs.comfy.org/get_started/manual_install) is telepítheted.

## Alszekciók

---

{{< section-noimg details >}}

## Modellek és LoRA-k Telepítése

---

Mielőtt elkezdhetnéd használni a ComfyUI-t, először szükséged van egy modellre, és attól függően, hogy mit szeretnél elérni, lehet, hogy fel kell töltened néhány LoRA-t, beágyazást, felskálázót és sok más különböző típusú modellt. De kezdjük egyszerűen, csak egy modellel.

A modellek, vagy ellenőrzőpontok azok a hatalmas fájlok, amelyek felelősek a képek generálásáért szöveg és/vagy kép bemenet alapján. Ezek a ComfyUI telepítésed `models\checkpoints` mappájában találhatók. Egy jó hely a böngészésre a [CivitAI](https://civitai.com/), de mivel itt vagy, valószínűleg érdekel a [CompassMix XL Lightning](https://civitai.com/models/498370/compassmix-xl-lightning) vagy a [Pony Diffusion V6 XL](https://civitai.com/models/257749/pony-diffusion-v6-xl). Mindkettő SDXL alapú.

A LoRA-k, vagy **Lo**w-**R**ank **A**daptation (Alacsony Rangú Adaptáció) egy olyan technika, amely az LLM-ek finomhangolási költségeinek csökkentésére jött létre. Úgy működik, hogy befagyasztja az előre betanított modell súlyait és betanítható rang-dekompozíciós mátrixokat injektál minden rétegbe. Egyelőre a fontos az, hogy ezeknek más a működési módja és más a célja, ezért ezeket külön tárolják a ComfyUI `models\loras` mappájában, és sokat találhatsz belőlük ezen a weboldalon vagy a CivitAI-n és sok más helyen!

Más típusú modellekhez más mappákat találsz a `models\` mappában! Nyugodtan fedezd fel ezt a területet, de majd akkor foglalkozunk velük, amikor odaérünk.

## Node Alapú Munkafolyamat

---

Kezdjük a ComfyUI node-alapú munkafolyamatának alapjaival. Először talán túl összetettnek tűnhet, de könnyebb megérteni, mint gondolnád.

Amikor először megnyitod a ComfyUI-t, egy egyedi felületet fogsz látni, ami bonyolultnak tűnhet. De ne aggódj, valójában elég egyszerű.

![Mágikus Varázslat](/images/comfyui/arcane_wizardry.png)

Ha új vagy a node-alapú munkafolyamatokban, normális, ha kicsit elveszettnek érzed magad. De egy kis gyakorlással profi módon fogod navigálni. Lehetnek kérdéseid, és ez rendben van. A cél az, hogy tanulj és szórakozz a ComfyUI-val.

A munkafolyamat a teljes beállítás, amit a képernyőképen látsz, beleértve az összes node-ot, csoportot és kapcsolatot, amit létrehozol. Amikor valaki arra kér, hogy oszd meg a munkafolyamatodat, a JSON fájlra gondolnak, amit letölthetsz, miután elmentetted a munkafolyamatot egy értelmes névvel. Használhatod a [Workflow Image](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/#workflow-image) funkciót is a Custom-Scripts egyéni node-ból, hogy beágyazd a munkafolyamatodat egy képbe.

Most kezdjük az alapoktól és egyszerűsítsük le a munkafolyamatot. Íme, hogyan törölheted a munkafolyamatot mind az új, mind a régi felületeken:

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/clear_workflow.mp4" type="video/mp4">
        A böngésződ nem támogatja a videó címkét.
    </video>
</div>

Most, hogy tiszta lappal indulsz, adjunk hozzá egy node-ot. Ezt kétféleképpen teheted meg. Az egyik mód, hogy jobb klikkel kattintasz a munkafolyamat egy üres részére. A másik mód, ami kicsit intuitívabb, hogy bal klikkel duplán kattintasz egy üres részre.

![Jobb Klikk Hozzáadási Módszer](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/right_click_add.png)

---

---

{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/" >}}
