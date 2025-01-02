---
weight: 1
bookFlatSection: false
bookToC: false
title: "ComfyUIの読み込み時間の最適化"
summary: "このドキュメントでは、サーバースクリプトで圧縮を有効にし、gzipとbrotliを使用してファイルを圧縮することで、ComfyUIの読み込み時間を最適化する手順を説明します。"
---

<!--markdownlint-disable MD025 MD033 -->

# ComfyUIの読み込み時間の最適化

---

<div style="display: flex; justify-content: center;">

[![この画像は、雪景色の中を走る長い金髪とフェネックの耳を持つアニメの少女を示しています。昼間の設定で、空は濃い青から白へと変化しています。人物は走っている最中で、片足が地面に触れ、もう片方の足が後ろに上がっており、動きの感覚を伝えています。白いストリークが速度や風が吹き抜ける印象を与えています。前景には起伏のある地形に雪のパッチと露出した土が見られ、背景には空を背景に針葉樹のシルエットが見えます。](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/make_it_fast_small.png)](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/make_it_fast.png)

</div>

ローカルネットワーク上では実際にはより遅くなる可能性がありますが、インターネットケーブル、さらには悪条件のWi-Fiやモバイルネットワーク上では、ComfyUIを起動するたびに読み込み時間が大幅に改善されます。

`server.py`に以下の変更を適用し、ComfyUIを再起動する必要があります：

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

そして、以下のコマンドですべてを圧縮します：

```bash
cd ~/ComfyUI # これらのコマンドを実行するために、ComfyUIディレクトリに移動します。
find web* custom_nodes/**/{js,web}  -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \) ! -name "*.gz" ! -name "*.br" ! -name "*.zst" -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.gz" ]] && gzip -k "{}"'
```

Firefoxでは、HTTP接続上でbrotliがデフォルトで無効になっていますが、Chrome/Edge/Braveユーザーは代わりにbrotliを使用するか、両方を使用することができます：

```bash
find web* custom_nodes/**/{js,web} -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \)  -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.br" ]] && brotli --best "{}"'
```

<!--
いつか[aiohttp](https://docs.aiohttp.org/en/stable/index.html)がzstdをサポートするようになれば、これが関連するかもしれません：

```bash
find web* custom_nodes/**/{js,web} -type f \( -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.json" \)  -print0 | xargs -0 -P $(nproc) -I {} bash -c '[[ ! -f "{}.zst" ]] && zstd -19 -q "{}"'
```
-->

ComfyUIの開発者がフロントエンドスクリプトのバージョン文字列を含めることを決めず、代わりにサルのように`no-cache`を使用しているため、フロントエンドが更新されるたびに再圧縮する必要があります！🐺

[ComfyUI-Custom-Scripts](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/)の`autocomplete`ファイルも圧縮できますが、まず`autocomplete.py`にパッチを適用する必要があります：

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

そして、以下のコマンドでスペルブックを圧縮します：

```bash
gzip -k custom_nodes/ComfyUI-Custom-Scripts/user/autocomplete.txt
brotli --best custom_nodes/ComfyUI-Custom-Scripts/user/autocomplete.txt
```

大きな🧠を持つGærosに感謝します！
