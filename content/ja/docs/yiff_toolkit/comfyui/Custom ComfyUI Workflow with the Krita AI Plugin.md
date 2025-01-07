---
weight: 1
bookFlatSection: false
bookToC: false
title: "Krita AIプラグインを使用したカスタムComfyUIワークフロー"
summary: ""
---

<!--markdownlint-disable MD025 MD033 -->

# Krita AIプラグインを使用したカスタムComfyUIワークフロー

---

## インストール

---

まず、プロジェクトの[GitHub](https://github.com/Acly/krita-ai-diffusion/releases)リリースページにアクセスし、最新のzipファイルをダウンロードします。_Source code_アーカイブではなく、最初のzipファイルをクリックするようにしてください！

![krita-ai-diffusionのダウンロード方法を示す画像。](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_download.png)

## ???

Dockerの左上にあるワークスペース選択ボタンをクリックします。

![krita-ai-diffusionでカスタムComfyUIワークフローに接続する方法を示す画像。](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_select_graph.png)

## ComfyUIでKritaプラグインを使用するために必要な基本ノード

---

`custom_nodes`フォルダに[comfyui-tooling-nodes](https://github.com/Acly/comfyui-tooling-nodes)をインストールする必要があります。

```bash
cd ~/ComfyUI/custom_nodes
git clone https://github.com/Acly/comfyui-tooling-nodes
```

__Translate Text__ノードを使用する場合は、`argostranslate`もインストールする必要があります。

```bash
pip install argostranslate
```

2つのノードがあります。1つ目は__Krita Output__ノードで、これは単に__VAE Decode__の_image_出力に接続するだけです。

![Krita Outputノードを示すComfyUIのスクリーンショット。](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_output_node.png)

もう1つは__Krita Canvas__ノードで、その_width_と_height_出力を、__Empty Latent Image__ノードや__CLIPTextEncodeSDXL__など、生成しようとしている画像の全体の幅と高さを必要とするものに接続し、_seed_入力は_KSampler_の_seed_に接続する必要があります。

![Empty Latent Imageなどのノードに接続されたKrita Canvasノードを示すComfyUIのスクリーンショット。](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_canvas_node.png)

ウィジェットを入力に変換するには、ノードを右クリックして__Convert Widget to Input__の下にあるウィジェットを見つけるだけで良いことを覚えておいてください：

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_convert_to_input.mp4" type="video/mp4">
        お使いのブラウザはビデオタグをサポートしていません。
    </video>
</div>

新しいフロントエンドを使用している場合は、シードのヌードルを直接ウィジェットの上にドラッグすることもできます。🐺

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/krita_ai_new_frontend_shill.mp4" type="video/mp4">
        お使いのブラウザはビデオタグをサポートしていません。
    </video>
</div>

---

{{< related-posts related="docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/ | docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/" >}}
