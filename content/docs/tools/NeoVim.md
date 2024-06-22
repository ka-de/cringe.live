---
weight: 20
bookFlatSection: false
title: "NeoVim"
---

<!--markdownlint-disable MD025 MD038 -->

# NeoVim

---

[Catppuccin](https://github.com/catppuccin/nvim)

## Commands

---

### `diw`

This stands for “delete inner word”. It deletes the word under the cursor, but leaves any surrounding spaces

### `diW`

This is similar to `diw`, but it operates on a “Word” instead of a “word”. In Vim, a “Word” is a sequence of non-blank characters, separated with white space, and it includes punctuation. So, `diW` would delete the “Word” under the cursor, including punctuation, but leave any surrounding spaces.

### `daw`

This stands for “delete a word”. It deletes the word under the cursor and any trailing space. If there’s no trailing space, it deletes the leading space.

### `ciw`

This stands for “change inner word”. It deletes the word under the cursor and puts you in insert mode, ready to type the replacement.

### `caw`

This stands for “change a word”. It deletes the word under the cursor and any trailing space, then puts you in insert mode.

### `yaw`

This stands for “yank a word”. It copies the word under the cursor and any trailing space.

### `yiw`

This stands for “yank inner word”. It copies the word under the cursor.

### `viw`

This stands for “visual select inner word”. It visually selects the word under the cursor.

### `vaw`

This stands for “visual select a word”. It visually selects the word under the cursor and any trailing space.
