---
weight: 1
bookFlatSection: false
bookToC: false
title: "ComfyUI Betöltési Idők Optimalizálása"
summary: "A dokumentum lépéseket tartalmaz a ComfyUI betöltési idejének optimalizálásához a szerver szkriptben történő tömörítés engedélyezésével és a fájlok gzip és brotli tömörítésével."
image: "https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/make_it_fast.png"
image_alt: "A kép egy hosszú szőke hajú, fennec fülű anime lányt ábrázol, aki egy havas tájon fut keresztül. A jelenet nappal játszódik, az ég sötétkékből fehérbe megy át. A karakter mozgás közben van megörökítve, egyik lába a földet érinti, a másik mögötte van felemelve, mozgást sugallva. Fehér csíkok jelzik a sebességet vagy az elsuhanó szelet. Az előtérben havas foltok láthatók az egyenetlen talajon, a háttérben tűlevelű fák sziluettjei rajzolódnak ki az égen."
blurhash: "LVJ[9VRkRkaeOFofoeay02oej?of"
aliases:
    - /hu/docs/yiff_toolkit/comfyui/Optimizing-ComfyUI-Load-Times/
    - /hu/docs/yiff_toolkit/comfyui/Optimizing-ComfyUI-Load-Times
    - /hu/docs/yiff_toolkit/comfyui/Optimizing ComfyUI Load Times/
    - /hu/docs/yiff_toolkit/comfyui/Optimizing ComfyUI Load Times
    - /hu/docs/yiff_toolkit/comfyui/ComfyUI Betöltési Idők Optimalizálása
    - /hu/docs/yiff_toolkit/comfyui/ComfyUI Betöltési Idők Optimalizálása/
    - /hu/docs/yiff_toolkit/comfyui/ComfyUI-Betöltési-Idők-Optimalizálása
    - /hu/docs/yiff_toolkit/comfyui/ComfyUI-Betöltési-Idők-Optimalizálása/
    - /hu/docs/yiff_toolkit/comfyui/ComfyUI_Betöltési_Idők_Optimalizálása
    - /hu/docs/yiff_toolkit/comfyui/ComfyUI_Betöltési_Idők_Optimalizálása/
    - /docs/yiff_toolkit/comfyui/ComfyUI_Betöltési_Idők_Optimalizálása
    - /docs/yiff_toolkit/comfyui/ComfyUI_Betöltési_Idők_Optimalizálása/
    - /docs/yiff_toolkit/comfyui/ComfyUI Betöltési Idők Optimalizálása
    - /docs/yiff_toolkit/comfyui/ComfyUI Betöltési Idők Optimalizálása/
    - /docs/yiff_toolkit/comfyui/ComfyUI-Betöltési-Idők-Optimalizálása
    - /docs/yiff_toolkit/comfyui/ComfyUI-Betöltési-Idők-Optimalizálása/
---

<!--markdownlint-disable MD025 MD033 -->

# ComfyUI Betöltési Idők Optimalizálása

---

Azzal a megjegyzéssel, hogy helyi hálózaton ez valójában lassabb lehet, azonban internetes kapcsolaton, vagy ami még rosszabb, Wi-Fi és mobil hálózatokon keresztül, ez jelentősen javítja a betöltési időket minden alkalommal, amikor úgy döntesz, hogy elindítod a ComfyUI-t.

A következő változtatást kell alkalmaznod a `server.py` fájlban, majd újraindítani a ComfyUI-t:

```diff
diff --git a/server.py b/server.py
index c7bf662..4780ce0 100644
--- a/server.py
+++ b/server.py
@@ -565,7 +565,9 @@ class PromptServer():
                     except Exception as e:
                         logging.error(f"[ERROR] An error occurred while retrieving information for the '{x}' node.")
                         logging.error(traceback.format_exc())
-                return web.json_response(out)
+                res = web.json_response(out)
+                res.enable_compression()
+                return res
 
         @routes.get("/object_info/{node_class}")
         async def get_object_info_node(request):
```

ezután pedig csak tömörítsd az összes fájlt ezzel:

```bash
cd ~/ComfyUI # Változtasd meg a ComfyUI könyvtáradra a parancsok futtatásához.
find web* custom_nodes/**/{js,web}  -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \) ! -name "*.gz" ! -name "*.br" ! -name "*.zst" -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.gz" ]] && gzip -k "{}"'
```

Firefox-ban a brotli alapértelmezetten le van tiltva HTTP kapcsolatokon keresztül, azonban Chrome/Edge/Brave felhasználók használhatják azt is, vagy mindkettőt:

```bash
find web* custom_nodes/**/{js,web} -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \)  -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.br" ]] && brotli --best "{}"'
```

<!--
Egy nap az [aiohttp](https://docs.aiohttp.org/en/stable/index.html) támogatni fogja a zstd-t, és akkor talán ez is releváns lesz:

```bash
find web* custom_nodes/**/{js,web} -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \)  -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.zst" ]] && zstd -19 -q "{}"'
```
-->

Újra kell tömörítened őket minden alkalommal, amikor a frontend frissül, mert a ComfyUI fejlesztői úgy döntöttek, hogy nem használnak verzió stringeket a frontend szkriptekhez, ehelyett csak `no-cache`-t használnak, mint a majmok! 🐺

A [ComfyUI-Custom-Scripts](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/) `autocomplete` fájlját is tömörítheted, de először javítanod kell az `autocomplete.py`-t:

```diff
diff --git a/py/autocomplete.py b/py/autocomplete.py
index 8ac6a05..7d68e8f 100644
--- a/py/autocomplete.py
+++ b/py/autocomplete.py
@@ -12,8 +12,11 @@ file = os.path.join(dir, "autocomplete.txt")
 @PromptServer.instance.routes.get("/pysssss/autocomplete")
 async def get_autocomplete(request):
     if os.path.isfile(file):
-        return web.FileResponse(file)
-    return web.Response(status=404)
+        res = web.FileResponse(file)
+    else:
+        res = web.Response(status=404)
+    res.enable_compression()
+    return res
```

és aztán tömörítsd a varázskönyvedet ezzel:

```bash
gzip -k custom_nodes/ComfyUI-Custom-Scripts/user/autocomplete.txt
brotli --best custom_nodes/ComfyUI-Custom-Scripts/user/autocomplete.txt
```

Köszönet Gærosnak a nagy 🧠-ért!

---

{{< related-posts related="docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Manager/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-AnimateDiff-Evolved/" >}}
