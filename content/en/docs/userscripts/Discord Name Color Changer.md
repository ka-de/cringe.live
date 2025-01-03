---
weight: 1
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "Discord Name Color Changer"
summary: "Replaces specific username colors with new ones on a Discord channel by observing and modifying the DOM."
aliases:
  - /docs/userscripts/Discord Name Color Changer/
  - /docs/userscripts/Discord Name Color Changer
---

<!--markdownlint-disable MD025 MD033 -->

# Discord Name Color Changer

---

This userscript, designed for a specific Discord channel, automatically replaces undesirable username colors with preferred alternatives. It defines a set of original colors and their corresponding replacements, such as changing cyan to raspberry and mustard to sky blue. By targeting elements with inline color styles, the script identifies and modifies the specified colors. It uses a `MutationObserver` to continuously monitor the DOM for changes, ensuring that any new elements with the original colors are promptly updated. This ensures a consistent and visually pleasing user experience by maintaining the desired color scheme throughout the Discord channel.

```js
// ==UserScript==
// @name         Discord Color Fix
// @namespace    https://cringe.live
// @version      1.0
// @description  Replace bad username colors on a very specific Discord channel.
// @author       _ka_de
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Define the original and replacement colors
  const originalColors = [
    { original: "0, 255, 255", replacement: "255, 0, 128" }, // Cyan -> Raspberry
    { original: "233, 204, 88", replacement: "51, 153, 255" }, // Mustard -> Sky Blue
    { original: "241, 196, 15", replacement: "255, 153, 51" }, // Sunflower -> Orange
    { original: "250, 247, 220", replacement: "0, 128, 128" }, // Platinum -> Teal
  ];

  // Function to replace color styles
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

  // Observe changes in the DOM and apply the replacement
  const observer = new MutationObserver(replaceColorStyles);
  observer.observe(document.body, { subtree: true, childList: true });

  // Run the replacement initially
  replaceColorStyles();
})();
```
