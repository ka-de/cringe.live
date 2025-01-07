---
weight: 2
bookFlatSection: false
bookToC: true
title: "ComfyUIバイブル"
summary: "ComfyUIの使用方法を包括的に解説するガイド。基本的なノードワークフローから高度なAI画像生成テクニックまでをカバー。"
aliases:
  - /ja/docs/yiff_toolkit/comfyui/
  - /ja/docs/yiff_toolkit/comfyui
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# ComfyUIバイブル

---

## はじめに

---

ComfyUIのインストール方法についてお探しの場合、ここは適切な場所ではありません。Windowsをお使いの場合は[プレビルド](https://docs.comfy.org/get_started/pre_package)パッケージを使用できます。それ以外の場合は[手動](https://docs.comfy.org/get_started/manual_install)でインストールすることができます。

## サブセクション

---

{{< section-noimg details >}}

## モデルとLoRAのインストール

---

ComfyUIを使い始める前に、まずモデルを入手し、目的に応じてLoRA、埋め込み、アップスケーラーなど、さまざまな種類のモデルを用意する必要があります。しかし、まずはシンプルに、モデルから始めましょう。

モデル（チェックポイント）は、テキストや画像の入力に基づいて画像を生成する大きなファイルです。これらはComfyUIインストールの`models\checkpoints`フォルダに保存されます。モデルを探すのに適した場所は[CivitAI](https://civitai.com/)ですが、ここにいらっしゃる方は、おそらく[CompassMix XL Lightning](https://civitai.com/models/498370/compassmix-xl-lightning)や[Pony Diffusion V6 XL](https://civitai.com/models/257749/pony-diffusion-v6-xl)をチェックしたいと思われるでしょう。これらはどちらもSDXLベースのモデルです。

LoRA（**Lo**w-**R**ank **A**daptation）は、LLMのファインチューニングのコストを削減するために登場した技術です。事前学習済みモデルの重みを凍結し、各層に訓練可能なランク分解行列を注入することで機能します。現時点で重要なのは、これらは異なる動作方法と目的を持つため、ComfyUIの`models\loras`フォルダに別々に保存され、このウェブサイトやCivitAI、その他多くの場所で見つけることができるということです！

`models\`フォルダには、他の種類のモデル用の他のフォルダもあります！自由に探索してみてください。必要になったときに詳しく説明します。

## ノードベースのワークフロー

---

ComfyUIのノードベースのワークフローの基本から始めましょう。最初は圧倒されるかもしれませんが、思っているよりも理解しやすいものです。

ComfyUIを初めて開くと、複雑に見えるユニークなインターフェースが表示されます。しかし心配いりません、実際にはとてもシンプルです。

![秘術の魔法](/images/comfyui/arcane_wizardry.png)

ノードベースのワークフローが初めての方は、少し戸惑うかもしれません。しかし、少し練習すれば、すぐにプロのように操作できるようになります。質問があるかもしれませんが、それは全く問題ありません。目標はComfyUIを学び、楽しむことです。

ワークフローとは、スクリーンショットに表示されているセットアップ全体のことで、作成したすべてのノード、グループ、接続が含まれます。誰かがワークフローの共有を求めた場合、それは意味のある名前を付けてワークフローを保存した後にダウンロードできるJSONファイルのことを指します。また、Custom-Scriptsカスタムノードの[Workflow Image](/docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/#workflow-image)機能を使用して、ワークフローを画像に埋め込むこともできます。

では、最初からワークフローを簡単にしてみましょう。新旧両方のUIでワークフローをクリアする方法は以下の通りです：

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/clear_workflow.mp4" type="video/mp4">
        お使いのブラウザはビデオタグをサポートしていません。
    </video>
</div>

これで白紙の状態になったので、ノードを追加してみましょう。ノードを追加するには2つの方法があります。1つはワークフローの空いている部分を右クリックする方法です。もう1つは、より直感的な方法で、ワークフローの空いている部分を左クリックで2回クリックする方法です。

![右クリックで追加する方法](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/right_click_add.png)

---

{{< related-posts related="docs/audio/ | docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/" >}}
