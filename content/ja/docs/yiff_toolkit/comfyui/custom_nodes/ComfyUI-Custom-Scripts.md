---
weight: 2
bookFlatSection: false
bookToC: true
title: "ComfyUI-Custom-Scripts"
summary: ""
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# ComfyUI-Custom-Scripts

---

pythongossssによる便利な（そうでもない）カスタムノードと機能の集まりです。

## テキスト自動補完

---

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/custom_scripts_completion.mp4" type="video/mp4">
        お使いのブラウザはビデオタグをサポートしていません。
    </video>
</div>

この機能により、入力時にテキストを自動補完することができます。設定で有効/無効を切り替えることができます。

<div style="text-align: center;">

![自動補完設定](/images/comfyui/autocomplete_settings.png)

</div>

"Manage Custom Words"のテキストボックスに`.csv`ファイルの内容を丸ごと貼り付けることができ、プロンプトに入力する際に追加した単語がドロップダウンメニューに表示されます！

もし`.csv`ファイルが必要な場合は、私のスペルブックを使用することもできます！

```bash
https://raw.githubusercontent.com/ka-de/sacred_words/refs/heads/main/spellbook.csv
```

## 常にグリッドにスナップ

---

`Shift`キーを実際に押さなくても、ノードやグループを移動する際に`Shift`キーを押しているかのように動作します。天才的！

<div style="text-align: center;">

![常にグリッドにスナップ](/images/comfyui/always_snap_to_grid.png)

</div>

## PlaySoundとSystemNotification

---

これら2つのノードは、処理が通過するたびに音を鳴らし、通知を表示します。GPUが遅い場合やアニメーションを作成していて処理に時間がかかる場合に非常に便利です！

<div style="text-align: center;">

![サウンドと通知](/images/comfyui/sound_and_notification.png)

</div>

## Image Feed

---

以前は私のお気に入りの機能でしたが、新しいUIになってからは、サイドバーパネルのQueue（`q`）の方が好みです。

<div style="text-align: center;">

![Image Feed設定](/images/comfyui/imagefeed_settings.png)

</div>

## Preset TextとShow Text

---

`Preset Text`ノードでは独自のプリセットテキストを作成して簡単に再利用でき、`Show Text`ノードではComfyUIでのテキスト関連の問題を簡単にデバッグできるように表示します。

<div style="text-align: center;">

![テキストノード](/images/comfyui/text_nodes.png)

</div>

## Workflow Image

---

ワークフローをSVGまたはPNGファイルとしてエクスポートできます。とても便利！

<div style="text-align: center;">

![ワークフローイメージ](/images/comfyui/workflow_image.png)

</div>

---

{{< related-posts related="docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Manager/" >}}
