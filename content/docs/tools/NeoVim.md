---
weight: 20
bookFlatSection: false
bookCollapseSection: false
bookToC: true
title: "NeoVim"
summary: "Neovim is a refactor of the Vim text editor, which aims to improve extensibility and usability."
---

<!--markdownlint-disable MD025 MD038 -->

# NeoVim

---

[Catppuccin](https://github.com/catppuccin/nvim)

## Configuration

---

```lua
```

## Configuration Specific Shortcuts

---

### `<leader>ch`, `:NvCheatsheet`

Shows the cheatsheet for NvChad.

### `:Ha`

Short command for `:HopAnywhere`

### `:Hac`

Short command for `:HopAnywhereAC`

### `:Hbc`

Short command for `:HopAnywhereBC`

### `:Hl`

Short command for `:HopAnywhereCurrentLine`

### `:Hlac`

Short command for `:HopAnywhereCurrentLineAC`

### `:Hlbc`

Short command for `:HopAnywhereCurrentLineBC`

### `Hmw`

Short command for `:HopAnywhereMW`

## Ex Commands

---

These are commands that start with a colon `:`. They are called Ex commands because they come from the Ex editor, which is a line editor that was the original base for Vim.

### `:w`

This command saves the current file. It’s equivalent to ‘Save’ in other text editors.

### `:%s/old/new/g`

This is a substitute command that replaces all occurrences of ‘old’ with ‘new’ in the entire document. The g at the end stands for ‘global’, which means it operates on the whole document. If you leave it out, the command will only replace the first occurrence on each line.

### `:q`

This command quits NeoVim. If there are unsaved changes, NeoVim will warn you before closing.

### `:wq`

This command saves the current file and then quits NeoVim. It’s a combination of `:w` and `:q`.

### `:q!`

Exit without writing your changes to the file.

### `:e {file}`

This command opens a file. You need to replace `{file}` with the path to the file you want to open.

## Leader Commands

---

The `<leader>` key is a special key, used to perform custom commands, it's often used as a prefix to create custom shortcuts. The default `<leader>` key is a `\`. However, you can change it to the spacebar with the `mapleader` option in your `init.lua`.

```lua
let mapleader = "\<Space>"
```

## Normal Mode Commands

---

### `gg`

This command moves the cursor to the first line of the document. It’s a quick way to navigate to the start of your file.

### `G`

This command moves the cursor to the last line of the document. It’s the counterpart to `gg`, and it allows you to quickly navigate to the end of your file.

### `u`

This command undoes the last operation. If you made a mistake, you can use `u` to revert your changes.

### `Ctrl + j`

Move the cursor down one line.

### `Ctrl + p`

Move the cursor up one line.

### `Ctrl + e`

Move the screen down one line without moving the cursor.

### `Ctrl + y`

Move the screen up one line without moving the cursor.

### `Ctrl + b`

### `Ctrl + r`

This command is the counterpart to `u`, it redoes the last operation that was undone.

### `diw`

This stands for “delete inner word”. It deletes the word under the cursor, but leaves any surrounding spaces

### `diW`

This is similar to `diw`, but it operates on a “Word” instead of a “word”. In NeoVim, a “Word” is a sequence of non-blank characters, separated with white space, and it includes punctuation. So, `diW` would delete the “Word” under the cursor, including punctuation, but leave any surrounding spaces.

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

### Incrementing and Decrementing a Number Under the Cursor

You can increment or decrement a number under the cursor using the following shortcuts:

- To increment a number, press `Ctrl + a`.
- To decrement a number, press `Ctrl + x`.

These commands will increase or decrease the whole number under the cursor. If you want to increment a specific digit in a number, you can replace it manually. For example, if the cursor is over the "6" in "65", you can press `r7` to replace the "6" with a "7", turning "65" into "75".

Please note that these commands work on the whole number under the cursor, not on individual digits.

### `Ctrl+C`

Pressing `Ctrl+C` can be used to exit from insert mode. However, it's important to note that `Ctrl+C` and `Esc` are not exactly the same.

Here are the differences:

- `Ctrl+C` does not check for abbreviations, while `Esc` does.
- `Ctrl+C` does not trigger the `InsertLeave` autocommand event, while `Esc` does. This event is often used by plugins to perform actions when you leave insert mode.
- If you are in block insert mode (entered with `Ctrl+V`, `Shift+I`) and exit using `Ctrl+C`, it cancels the block edit and only edits the first row.

So, while `Ctrl+C` can be used to quickly exit insert mode, it might not behave as expected in certain situations or with certain configurations. It's generally safer to use `Esc` to ensure all expected events and checks are performed. If you prefer using `Ctrl+C`, you could consider remapping it to `Esc`. However, be aware that this might not be compatible with all configurations or plugins.
