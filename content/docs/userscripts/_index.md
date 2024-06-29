---
weight: 10
bookFlatSection: false
bookCollapseSection: true
bookToC: false
title: "📜 - Userscripts"
summary: "Userscripts are small programs written in JavaScript that can alter the appearance and behavior of web pages on the client side."
---

<!--markdownlint-disable MD025  -->

# Userscripts

---

Userscripts are small programs written in JavaScript that can alter the appearance and behavior of web pages on the client side. They allow users to customize their web browsing experience by adding new features, modifying existing ones, or automating repetitive tasks. Userscripts are typically managed and executed through browser extensions such as Greasemonkey for Firefox, Tampermonkey for Chrome, and Violentmonkey for various browsers.

## My Userscripts

---

{{< section details >}}

## How to Write a Userscript

---

A userscript starts with a metadata block that is used by the userscript manager to determine where and when the script should run. The metadata block is a comment at the top of the script that contains `==UserScript==` and `==/UserScript==` tags. Between these tags, you can define various attributes like `name`, `namespace`, `version`, `match`, etc.

Here’s an example of a simple userscript metadata block:

```js
// ==UserScript==
// @name        My First Userscript
// @namespace   https://cringe.live
// @version     1
// @match       http://*/*
// ==/UserScript==
```

This script will run on all HTTP websites due to the `@match http://*/*` directive.

After the metadata block, you can write the actual JavaScript code that will be executed on the matched pages. For example, the following userscript will change the background color of all webpages to pink:

For brevity I will omit the `@namespace`, `@version` and `@match` from further examples.

```js
// ==UserScript==
// @name        Pink Background
...
// ==/UserScript==

document.body.style.backgroundColor = "pink";
```

## JavaScript APIs

---

Userscripts can also use most of the JavaScript APIs provided by the web browser. For example, the following userscript adds a button to every webpage that alerts the current URL when clicked:

```js
// ==UserScript==
// @name        Alert URL Button
// ...
// ==/UserScript==

var button = document.createElement("button");
button.textContent = "Alert URL";
button.onclick = function() {
    alert(window.location.href);
};
document.body.appendChild(button);
```

## External Libraries

---

Userscripts can also use external JavaScript libraries by adding a `@require` directive to the metadata block. For example, the following userscript uses jQuery to hide all images on a webpage:

```js
// ==UserScript==
// @name        Hide Images
// ...
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

$("img").hide();
```

## Refreshing the Page

---

This script automatically refreshes the page every 5 minutes. This can be useful for pages displaying live data.

```js
// ==UserScript==
// @name        Auto-Refresh Page
// ...
// ==/UserScript==

setTimeout(function() {
    location.reload();
}, 300000); // 5 minutes in milliseconds
```

## Highlight Search Term

---

This script highlights the search terms from the query string in the page text.

```js
// ==UserScript==
// @name        Highlight Search Terms
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

## Keyboard Navigation

---

This script adds keyboard navigation to a webpage. Pressing `n` will scroll to the next heading, and pressing `p` will scroll to the previous heading.

```js
// ==UserScript==
// @name        Keyboard Navigation
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

## Auto-Fill Form

---

This script automatically fills a form on a webpage. This can be useful for testing or if you frequently need to enter the same data.

```js
// ==UserScript==
// @name        Auto-Fill Form
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

## Redirect to Secure Site

---

```js
// ==UserScript==
// @name        Redirect to HTTPS
// ...
// ==/UserScript==

if (window.location.protocol != 'https:') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
```

## Auto-Click Button

---

This script automatically clicks a button with a specific id when the page loads.

```js
// ==UserScript==
// @name        Auto-Click Button
// ...
// ==/UserScript==

window.addEventListener('load', function() {
    var button = document.getElementById('myButton');
    if (button) {
        button.click();
    }
}, false);
```

## Replace Text

---

This script replaces all occurrences of a specific text on a webpage.

```js
// ==UserScript==
// @name        Replace Text
// ...
// ==/UserScript==

var bodyText = document.body.innerHTML;
bodyText = bodyText.replace(/Old Text/g, 'New Text');
document.body.innerHTML = bodyText;
```
