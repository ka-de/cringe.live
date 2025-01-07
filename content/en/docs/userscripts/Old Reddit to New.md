---
weight: 1
bookFlatSection: false
bookCollapseSection: false
bookToC: false
title: "Old Reddit to New"
summary: "The opposite of New Reddit to Old."
aliases:
  - /docs/userscripts/Old Reddit to New/
  - /docs/userscripts/Old Reddit to New
  - /docs/userscripts/old-reddit-to-new/
  - /docs/userscripts/old-reddit-to-new
  - /docs/userscripts/Old_Reddit_to_New
  - /docs/userscripts/Old_Reddit_to_New/
---

<!--markdownlint-disable MD025 MD033 -->

# Old Reddit to New

---

This userscript is designed to automatically redirect users from the old Reddit design to the new one. When a user navigates to a URL with "old.reddit.com" in the address bar, the script kicks in and replaces the URL with the equivalent URL on the new Reddit platform. This ensures that users always see the modern design and features of Reddit, even if they have bookmarks or links that point to the old design. The script is simple and efficient, running at the `document-start` stage to minimize any potential disruption to the user's browsing experience.

```js
// ==UserScript==
// @name               Old Reddit to New
// @description        Always redirects to new-Reddit, avoiding Reddit's old design.
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
