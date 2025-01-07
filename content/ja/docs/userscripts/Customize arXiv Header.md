---
weight: 1
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "arXivヘッダーのカスタマイズ"
summary: "このユーザースクリプトは、特定のヘッダー要素を非表示にし、ヘッダーのサイズを変更し、「問題を報告」ボタンを削除することでarXivウェブサイトをカスタマイズします。"
---

<!--markdownlint-disable MD025 MD033 -->

# arXivヘッダーのカスタマイズ

---

このユーザースクリプトは、様々なヘッダー要素を選択的に非表示にし、修正することでarXivウェブサイトの外観をカスタマイズするように設計されています。`.html-header-message`と`.html-header-logo`クラスの表示を削除し、`.html-header-nav`のフォントサイズを調整し、`.desktop_header`の高さを10pxに変更してflexboxプロパティを使用してコンテンツを中央揃えにします。さらに、スクリプトは「Report Issue」というテキストを含むボタンをターゲットにして非表示にし、カスタムスタイルをドキュメントのheadに追加することで`body::after`疑似要素を削除します。これにより、arXivのHTMLページにアクセスするユーザーにとって、よりクリーンで合理的なインターフェースが実現されます。

```js
// ==UserScript==
// @name         arXivヘッダーのカスタマイズ
// @namespace    https://cringe.live
// @version      1.0
// @description  arXivウェブサイトのヘッダーをカスタマイズします
// @author       _ka_de
// @match        https://arxiv.org/html*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // .html-header-messageを非表示
  var htmlHeaderMessage = document.querySelector(".html-header-message");
  if (htmlHeaderMessage) {
    htmlHeaderMessage.style.display = "none";
  }

  // .html-header-logoを非表示
  var htmlHeaderLogo = document.querySelector(".html-header-logo");
  if (htmlHeaderLogo) {
    htmlHeaderLogo.style.display = "none";
  }

  var htmlHeaderNav = document.querySelector(".html-header-nav");
  if (htmlHeaderNav) {
    htmlHeaderLogo.style.fontSize = "small";
  }

  // .desktop_headerを修正
  var desktopHeader = document.querySelector(".desktop_header");
  if (desktopHeader) {
    desktopHeader.style.height = "10px";
    desktopHeader.style.display = "flex";
    desktopHeader.style.alignItems = "center";
    desktopHeader.style.justifyContent = "center";
  }

  // "Report Issue"というテキストを含むボタンを非表示
  var buttons = document.querySelectorAll("button");
  buttons.forEach(function (button) {
    if (button.textContent.includes("Report Issue")) {
      button.style.display = "none";
    }
  });

  // body::afterをdisplay: noneに設定して非表示
  var styleElement = document.createElement("style");
  styleElement.innerHTML = "body::after { display: none; }";
  document.head.appendChild(styleElement);
})();
```

---

---

{{< related-posts related="docs/userscripts/CivitAI Fix/ | docs/yiff_toolkit/ponyxlv6_loras | docs/userscripts" >}}
