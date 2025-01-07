---
weight: 10
bookFlatSection: false
bookCollapseSection: true
bookToC: false
title: "📜 - ユーザースクリプト"
summary: "ユーザースクリプトは、クライアントサイドでWebページの外観と動作を変更できるJavaScriptで書かれた小さなプログラムです。"
---

<!--markdownlint-disable MD025  -->

# ユーザースクリプト

---

ユーザースクリプトは、クライアントサイドでWebページの外観と動作を変更できるJavaScriptで書かれた小さなプログラムです。新機能の追加、既存機能の変更、または繰り返しのタスクを自動化することで、ユーザーのWebブラウジング体験をカスタマイズすることができます。ユーザースクリプトは通常、FirefoxのGreasemonkey、ChromeのTampermonkey、各種ブラウザ用のViolentmonkeyなどのブラウザ拡張機能を通じて管理・実行されます。

## 私のユーザースクリプト

---

{{< section details >}}

## ユーザースクリプトの書き方

---

ユーザースクリプトは、スクリプトの実行場所と時期をユーザースクリプトマネージャーが判断するために使用されるメタデータブロックから始まります。メタデータブロックは、スクリプトの先頭にある`==UserScript==`と`==/UserScript==`タグを含むコメントです。これらのタグの間に、`name`、`namespace`、`version`、`match`などの様々な属性を定義できます。

以下は、シンプルなユーザースクリプトのメタデータブロックの例です：

```js
// ==UserScript==
// @name        私の最初のユーザースクリプト
// @namespace   https://cringe.live
// @version     1
// @match       http://*/*
// ==/UserScript==
```

このスクリプトは、`@match http://*/*`ディレクティブにより、すべてのHTTPウェブサイトで実行されます。

メタデータブロックの後に、マッチしたページで実行される実際のJavaScriptコードを書くことができます。例えば、以下のユーザースクリプトは、すべてのウェブページの背景色をピンクに変更します：

簡潔にするため、以降の例では`@namespace`、`@version`、`@match`を省略します。

```js
// ==UserScript==
// @name        ピンクの背景
...
// ==/UserScript==

document.body.style.backgroundColor = "pink";
```

## JavaScript API

---

ユーザースクリプトは、Webブラウザが提供するほとんどのJavaScript APIを使用することもできます。例えば、以下のユーザースクリプトは、クリックすると現在のURLをアラートで表示するボタンをすべてのWebページに追加します：

```js
// ==UserScript==
// @name        URL表示ボタン
// ...
// ==/UserScript==

var button = document.createElement("button");
button.textContent = "URLを表示";
button.onclick = function() {
    alert(window.location.href);
};
document.body.appendChild(button);
```

## 外部ライブラリ

---

ユーザースクリプトは、メタデータブロックに`@require`ディレクティブを追加することで、外部JavaScriptライブラリを使用することもできます。例えば、以下のユーザースクリプトは、jQueryを使用してWebページのすべての画像を非表示にします：

```js
// ==UserScript==
// @name        画像を非表示
// ...
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

$("img").hide();
```

## ページの自動更新

---

このスクリプトは5分ごとにページを自動的に更新します。これはライブデータを表示するページに便利です。

```js
// ==UserScript==
// @name        ページ自動更新
// ...
// ==/UserScript==

setTimeout(function() {
    location.reload();
}, 300000); // 5分（ミリ秒）
```

## 検索語のハイライト

---

このスクリプトは、クエリ文字列からの検索語をページのテキストでハイライトします。

```js
// ==UserScript==
// @name        検索語のハイライト
// ...
// ==/UserScript==

var params = new URLSearchParams(window.location.search);
var searchTerms = params.get('q');

if (searchTerms) {
    var bodyText = document.body.innerHTML;
    searchTerms.split(' ').forEach(function(term) {
        var regex = new RegExp(`(${term})`, 'gi');
        bodyText = bodyText.replace(regex, '<mark>$1</mark>');
    });
    document.body.innerHTML = bodyText;
}
```

## キーボードナビゲーション

---

このスクリプトは、Webページにキーボードナビゲーションを追加します。`n`キーを押すと次の見出しに、`p`キーを押すと前の見出しにスクロールします。

```js
// ==UserScript==
// @name        キーボードナビゲーション
// ...
// ==/UserScript==

var headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
var index = 0;

window.addEventListener('keydown', function(e) {
    if (e.key === 'n' && index < headings.length - 1) {
        index++;
        headings[index].scrollIntoView();
    } else if (e.key === 'p' && index > 0) {
        index--;
        headings[index].scrollIntoView();
    }
});
```

## フォームの自動入力

---

このスクリプトは、Webページのフォームを自動的に入力します。これはテストや、同じデータを頻繁に入力する必要がある場合に便利です。

```js
// ==UserScript==
// @name        フォーム自動入力
// ...
// ==/UserScript==

window.addEventListener('load', function() {
    var form = document.querySelector('form');
    if (form) {
        form.elements['username'].value = 'myusername';
        form.elements['password'].value = 'mypassword';
    }
}, false);
```

## セキュアサイトへのリダイレクト

---

```js
// ==UserScript==
// @name        HTTPSへリダイレクト
// ...
// ==/UserScript==

if (window.location.protocol != 'https:') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
```

## ボタンの自動クリック

---

このスクリプトは、ページ読み込み時に特定のIDを持つボタンを自動的にクリックします。

```js
// ==UserScript==
// @name        ボタン自動クリック
// ...
// ==/UserScript==

window.addEventListener('load', function() {
    var button = document.getElementById('myButton');
    if (button) {
        button.click();
    }
}, false);
```

## テキストの置換

---

このスクリプトは、Webページ上の特定のテキストのすべての出現を置き換えます。

```js
// ==UserScript==
// @name        テキスト置換
// ...
// ==/UserScript==

var bodyText = document.body.innerHTML;
bodyText = bodyText.replace(/古いテキスト/g, '新しいテキスト');
document.body.innerHTML = bodyText;
```

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/userscripts/e621.net JSON Button/ | docs/userscripts/Customize arXiv Header/ | docs/yiff_toolkit/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
