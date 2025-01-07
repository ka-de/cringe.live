---
weight: 2
bookFlatSection: false
bookToC: true
title: "実験的な機能"
summary: "このドキュメントには、読み終わる前に古くなってしまう可能性のある情報が含まれています！メガネをかけて読むことをお忘れなく！"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# 実験的な機能

---

## 新しいフロントエンド

---

ComfyUIを起動するコマンドライン引数の`main.py`の後に`--front-end-version Comfy-Org/ComfyUI_frontend@latest`を追加してください！

### 新機能

---

新しいサイドバーセクションのノードライブラリから、ワークフローにノードをドラッグ＆ドロップできるようになりました。また、あいまい検索を使用して検索することもできます！

あいまい検索を使用すると、ノードの正確な名前を覚えていなくても、ノードライブラリ内のノードを見つけることができます。入力した文字とノード名の文字を、順序が同じでなくてもマッチングすることで機能します。これにより、正確な名前を覚えていなくてもノードを見つけやすくなります。

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/node_library_search_drag.mp4" type="video/mp4">
        お使いのブラウザはビデオタグをサポートしていません。
    </video>
</div>

リンクを解放するときにShiftキーを押したままにすると、ノード検索ボックスが表示されるようになりました。

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/link_release_node.mp4" type="video/mp4">
        お使いのブラウザはビデオタグをサポートしていません。
    </video>
</div>

## Forループ

---

~~[gh](https://cli.github.com/)でブランチをチェックアウトできますが、`master`から数コミット遅れていることを忘れないようにしてください！~~

<!--
```bash
gh pr checkout 2666
```

以下のコマンドで`master`に戻ることができます：

```bash
git checkout master
```

または、以下のようにすることもできます：

```bash
gh pr checkout 2666
git fetch origin
git merge origin/master
```
-->

ブランチはマージされました！

また、ダウンロードした可能性のある[execution-inversion-demo-comfyui](https://github.com/BadCafeCode/execution-inversion-demo-comfyui)カスタムノードが更新されていることを確認してください！

では、これらのforループはどのように機能するのでしょうか？うーん、良い質問ですね！一緒に見ていきましょう！

## 遅延評価

---

## ノードの展開

---

ノードは実行時に複数の他のノードに展開できるようになりました。`Advanced Prompt`ノードはその一例です。`anthro male wolf, [full-length portrait:cute fangs:0.4]`を使用すると、サンプリングの最初の40%で`anthro male wolf, full-length portrait`というプロンプトを使用し、最後の60%で`anthro male wolf, cute fangs`を使用します。このノードでは、`<lora:blp-v1e400.safetensors:0.2>`と入力するだけで、20%の強度でLoRAを読み込むこともできます。

これは、サブグラフを使用する明るい未来への大きな一歩です！

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/ | docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
