---
weight: 1
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "Discord名前色変更ツール"
summary: "DOMを監視・変更することで、Discordチャンネル上の特定のユーザー名の色を新しい色に置き換えます。"
---

<!--markdownlint-disable MD025 MD033 -->

# Discord名前色変更ツール

---

このユーザースクリプトは、特定のDiscordチャンネル向けに設計されており、望ましくないユーザー名の色を好ましい代替色に自動的に置き換えます。シアンをラズベリーに、マスタードをスカイブルーに変更するなど、元の色とその置換色のセットを定義します。インラインカラースタイルを持つ要素をターゲットにして、スクリプトは指定された色を識別し、変更します。`MutationObserver`を使用してDOMの変更を継続的に監視し、元の色を持つ新しい要素が即座に更新されるようにします。これにより、Discordチャンネル全体で望ましい配色を維持し、一貫性のある視覚的に快適なユーザー体験を確保します。

```js
// ==UserScript==
// @name         Discord色修正
// @namespace    https://cringe.live
// @version      1.0
// @description  特定のDiscordチャンネルで好ましくないユーザー名の色を置き換えます。
// @author       _ka_de
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // 元の色と置換色を定義
  const originalColors = [
    { original: "0, 255, 255", replacement: "255, 0, 128" }, // シアン -> ラズベリー
    { original: "233, 204, 88", replacement: "51, 153, 255" }, // マスタード -> スカイブルー
    { original: "241, 196, 15", replacement: "255, 153, 51" }, // サンフラワー -> オレンジ
    { original: "250, 247, 220", replacement: "0, 128, 128" }, // プラチナ -> ティール
  ];

  // 色のスタイルを置換する関数
  function replaceColorStyles() {
    const elements = document.querySelectorAll('[style*="color: rgb"]');
    elements.forEach((element) => {
      originalColors.forEach((color) => {
        const originalRGB = color.original;
        const replacementRGB = color.replacement;
        const style = element.getAttribute("style");
        if (style.includes(originalRGB)) {
          const newStyle = style.replace(
            `color: rgb(${originalRGB})`,
            `color: rgb(${replacementRGB})`,
          );
          element.setAttribute("style", newStyle);
        }
      });
    });
  }

  // DOMの変更を監視し、置換を適用
  const observer = new MutationObserver(replaceColorStyles);
  observer.observe(document.body, { subtree: true, childList: true });

  // 初期の置換を実行
  replaceColorStyles();
})();
```

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/userscripts/Old Reddit to New/ | docs/userscripts/CivitAI Fix/ | docs/userscripts/Customize arXiv Header/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
