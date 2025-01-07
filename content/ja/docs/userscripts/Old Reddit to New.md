---
weight: 1
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "旧Redditから新Redditへ"
summary: "新Redditから旧Redditへの逆バージョンです。"
---

<!--markdownlint-disable MD025 MD033 -->

# 旧Redditから新Redditへ

---

このユーザースクリプトは、旧Redditデザインから新しいデザインに自動的にリダイレクトするように設計されています。ユーザーがアドレスバーに「old.reddit.com」を含むURLにアクセスすると、スクリプトが起動し、新しいRedditプラットフォームの同等のURLに置き換えます。これにより、ユーザーが旧デザインを指すブックマークやリンクを持っていても、常にRedditのモダンなデザインと機能を見ることができます。スクリプトはシンプルで効率的で、ユーザーのブラウジング体験への影響を最小限に抑えるために`document-start`段階で実行されます。

```js
// ==UserScript==
// @name               旧Redditから新Redditへ
// @description        常に新Redditにリダイレクトし、Redditの旧デザインを回避します。
// @include            *://old.reddit.com/*
// @version            1.0
// @run-at             document-start
// @author             _ka_de
// @grant              none
// @icon               https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// ==/UserScript==

window.location.replace(
  "https://reddit.com" + window.location.pathname + window.location.search,
);
```

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/userscripts/e621.net JSON Button/ | docs/userscripts/Discord Name Color Changer/ | docs/userscripts" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
