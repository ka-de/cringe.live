---
weight: 1
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "Customize arXiv Header"
summary: "This userscript customizes the arXiv website by hiding specific header elements, resizing the header, and removing 'Report Issue' buttons."
aliases:
  - /docs/userscripts/Customize arXiv Header/
  - /docs/userscripts/Customize arXiv Header
  - /docs/userscripts/customize-arxiv-header/
  - /docs/userscripts/customize-arxiv-header
  - /docs/userscripts/customize-arxiv-header-script/
  - /docs/userscripts/customize-arxiv-header-script
  - /docs/userscripts/customize_arxiv_header
  - /docs/userscripts/customize_arxiv_header/
  - /docs/userscripts/Customize_arXiv_Header
  - /docs/userscripts/Customize_arXiv_Header/
---

<!--markdownlint-disable MD025 MD033 -->

# Customize arXiv Header

---

This userscript is designed to customize the arXiv website's appearance by selectively hiding and modifying various header elements. It removes the visibility of the `.html-header-message` and `.html-header-logo` classes, while adjusting the font size of `.html-header-nav` and resizing the `.desktop_header` to a height of 10px, centering its contents using flexbox properties. Additionally, the script targets and hides any buttons containing the text "Report Issue" and removes the `body::after` pseudo-element by appending a custom style to the document head. This results in a cleaner and more streamlined interface for users accessing arXiv's HTML pages.

```js
// ==UserScript==
// @name         Customize arXiv Header
// @namespace    https://cringe.live
// @version      1.0
// @description  Customize the header on arXiv website
// @author       _ka_de
// @match        https://arxiv.org/html*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Hide .html-header-message
  var htmlHeaderMessage = document.querySelector(".html-header-message");
  if (htmlHeaderMessage) {
    htmlHeaderMessage.style.display = "none";
  }

  // Hide .html-header-logo
  var htmlHeaderLogo = document.querySelector(".html-header-logo");
  if (htmlHeaderLogo) {
    htmlHeaderLogo.style.display = "none";
  }

  var htmlHeaderNav = document.querySelector(".html-header-nav");
  if (htmlHeaderNav) {
    htmlHeaderLogo.style.fontSize = "small";
  }

  // Modify the .desktop_header
  var desktopHeader = document.querySelector(".desktop_header");
  if (desktopHeader) {
    desktopHeader.style.height = "10px";
    desktopHeader.style.display = "flex";
    desktopHeader.style.alignItems = "center";
    desktopHeader.style.justifyContent = "center";
  }

  // Hide buttons with text containing "Report Issue"
  var buttons = document.querySelectorAll("button");
  buttons.forEach(function (button) {
    if (button.textContent.includes("Report Issue")) {
      button.style.display = "none";
    }
  });

  // Hide body::after by setting display to none
  var styleElement = document.createElement("style");
  styleElement.innerHTML = "body::after { display: none; }";
  document.head.appendChild(styleElement);
})();
```

---

---

{{< related-posts related="docs/userscripts/CivitAI Fix/ | docs/yiff_toolkit/ponyxlv6_loras | docs/userscripts" >}}
