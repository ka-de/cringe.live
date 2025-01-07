---
weight: 1
bookFlatSection: false
bookToC: true
title: "ComfyUI-Manager"
summary: "最初にインストールすべきカスタムノード！"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# ComfyUI-Manager

---

ComfyUIのインストールは完了しましたか？動作は確認できましたか？素晴らしい！では、一旦閉じてください！他のものをインストールする時間です！

[ComfyUI-Manager](https://github.com/ltdrdata/ComfyUI-Manager)は、カスタムノードやモデルのインストールを可能にするなど、ComfyUIに多くの機能を追加する拡張機能です。とても便利なので、なぜまだComfyUIに実装されていないのか不思議ですが...まあ、インストールして使えばいいですよね！

```bash
cd custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager
```

ComfyUIを再起動すると、すぐに気になる共有ボタンが目に入るはずです。幸いなことに、共有ボタンの上にあるManagerボタンをクリックして開くManagerメニューで簡単に無効にできます。

<div style="display: flex;">

![気になる共有ボタン。](/images/comfyui/ugly_share_button.png)

![マネージャーメニュー](/images/comfyui/manager_menu_share.png)

</div>

ついでに、各ノードの右上隅にIDとどのカスタムノードに属しているかを示す小さなラベルを表示する`Badges`を有効にし、`Preview Method`を`TAESD`に設定して、KSamplerで現在生成されているものを確認できるようにしましょう。

では、一緒にCustom Nodes Managerを確認してみましょう。これはComfyUIのカスタムノードを検索してインストールするための非常に便利な方法です。

<div style="text-align: center;">

![カスタムノードマネージャー](/images/comfyui/custom_nodes_manager.png)

</div>

検索バーに`Custom Scripts`と入力して、`pythongosssss`が作成したものを見つけ、黒い`Install`ボタンをクリックしてインストールします。インストールが完了すると、ComfyUIを`Restart`するように促されます。再起動後、ブラウザで`Ctrl + R`または`F5`を押して更新することをお勧めします。新しいカスタムスクリプトをインストールするたびに、この操作を行ってください！

![カスタムスクリプトの作者](/images/comfyui/custom_scripts_author.png)

インストールしたものについての詳細はこちらで確認できます：[Custom Scripts](/docs/yiff_toolkit/comfyui/ComfyUI-Custom-Scripts/)

---

{{< related-posts related="docs/yiff_toolkit/comfyui/custom_nodes/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/" >}}
