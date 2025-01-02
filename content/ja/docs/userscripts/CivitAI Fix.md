---
weight: 1
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "CivitAI修正"
summary: "civitai.comの特定のクラスの`flex-wrap`プロパティを変更するためにCSSを修正します。"
---

<!--markdownlint-disable MD025 MD033 -->

# CivitAI修正

---

civitai.comのレイアウトの問題を修正するために、ページにカスタムCSSを追加するように設計されています。具体的には、`.mantine-ScrollArea-root`クラスを持つ要素の子孫である`.mantine-Group-root`クラスを持つ要素をターゲットにし、それらの`flex-wrap`プロパティを高優先度（`!important`）で`wrap`に設定します。この変更により、影響を受ける要素が内容を適切に折り返すことができ、要素が意図したように折り返されないレイアウトの問題が修正されます。

---

```js
// ==UserScript==
// @name         CivitAI修正
// @namespace    https://cringe.live
// @version      1.0
// @description  civitai.comの.mantine-Group-rootクラスのflex-wrapプロパティを変更します
// @author       _ka_de
// @match        https://civitai.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // カスタムCSSを追加する関数
  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName("head")[0];
    if (!head) {
      return;
    }
    style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    head.appendChild(style);
  }

  // .mantine-ScrollArea-root配下の.mantine-Group-rootプロパティを変更するカスタムCSS
  var customCSS = `
        .mantine-ScrollArea-root .mantine-Group-root {
            flex-wrap: wrap !important;
            -ms-flex-wrap: wrap !important;
            -webkit-flex-wrap: wrap !important;
            -webkit-box-flex-wrap: wrap !important;
        }
    `;

  // カスタムCSSを追加
  addGlobalStyle(customCSS);
})();
```
