---
weight: 1
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "CivitAI Fix"
summary: "Modifies the CSS of civitai.com to change the `flex-wrap` properties of a specific class."
aliases:
  - /docs/userscripts/CivitAI Fix/
  - /docs/userscripts/CivitAI Fix
  - /docs/userscripts/civitai-fix/
  - /docs/userscripts/civitai-fix
  - /docs/userscripts/CivitAI_Fix
  - /docs/userscripts/CivitAI_Fix/
---

<!--markdownlint-disable MD025 MD033 -->

# CivitAI Fix

---

Designed to fix a layout issue on civitai.com by adding custom CSS to the page. Specifically, it targets elements with the class `.mantine-Group-root` that are descendants of elements with the class `.mantine-ScrollArea-root`, and sets their `flex-wrap` property to `wrap` with high priority (`!important`). This change allows the affected elements to wrap their contents properly, fixing a layout issue where elements were not wrapping as intended.

---

```js
// ==UserScript==
// @name         CivitAI Fix
// @namespace    https://cringe.live
// @version      1.0
// @description  Changes the flex-wrap properties of .mantine-Group-root class on civitai.com
// @author       _ka_de
// @match        https://civitai.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Function to add custom CSS
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

  // Custom CSS to change .mantine-Group-root properties under .mantine-ScrollArea-root
  var customCSS = `
        .mantine-ScrollArea-root .mantine-Group-root {
            flex-wrap: wrap !important;
            -ms-flex-wrap: wrap !important;
            -webkit-flex-wrap: wrap !important;
            -webkit-box-flex-wrap: wrap !important;
        }
    `;

  // Add the custom CSS
  addGlobalStyle(customCSS);
})();
```

---

{{< related-posts related="docs/userscripts/Customize arXiv Header/ | docs/userscripts/Discord Name Color Changer/ | docs/yiff_toolkit/lora_training/Add-Custom-Optimizers/" >}}
