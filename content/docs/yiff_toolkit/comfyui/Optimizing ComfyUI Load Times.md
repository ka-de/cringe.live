---
weight: 1
bookFlatSection: false
bookToC: false
title: "Optimizing ComfyUI Load Times"
summary: ""
---

<!--markdownlint-disable MD025 MD033 -->

# Optimizing ComfyUI Load Times

---

With the caveat that over the local network this might actually be slower, however, over an internet cable, or worse, the Wi-Fi, this will greatly improve your loading times every time you decide to fire up ComfyUI.

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

and then you just compress everything with:

```bash
cd ~/ComfyUI # Change to your ComfyUI directory to run these commands.
find web* custom_nodes/**/{js,web}  -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \) ! -name "*.gz" ! -name "*.br" ! -name "*.zst" -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.gz" ]] && gzip -k "{}"'
```

On Firefox, brotli is disabled by default over HTTP connections, however Chrome/Edge/Brave users can use it instead, or both:

```bash
find web* custom_nodes/**/{js,web} -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \)  -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.br" ]] && brotli --best "{}"'
```

<!--
One day [aiohttp](https://docs.aiohttp.org/en/stable/index.html) will support zstd and then maybe this will be relevant:

```bash
find web* custom_nodes/**/{js,web} -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \)  -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.zst" ]] && zstd -19 -q "{}"'
```
-->

You can also compress your `autocomplete` file for [ComfyUI-Custom-Scripts](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/)

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

and then compress it with:

```bash
gzip -k custom_nodes/ComfyUI-Custom-Scripts/user/autocomplete.txt
brotli --best custom_nodes/ComfyUI-Custom-Scripts/user/autocomplete.txt
```

Thanks to Gæros for his big 🧠!
