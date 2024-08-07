---
weight: 20
bookFlatSection: false
bookCollapseSection: false
bookToC: true
title: "Cheatsheet"
summary: "Cheatsheets for software are quick reference guides that provide an overview of the commands, features, or syntax of a software program. They are incredibly useful for beginners who are trying to familiarize themselves with a new software, or for experienced users who need a quick reminder of the software’s capabilities."
---

<!--markdownlint-disable MD025 -->

# Cheatsheet

---

## HTML Snippets

---

### Markdown: Display Small Image with Link to Large Image

```markdown
[![An AI generated image.](small.png)](large.png)
```

### Collapsible Section

```html
<details>
  <summary>Click to reveal images</summary>

</details>
```

## Python Snippets

---

### Use catppuccin Theme in Matplotlib

```python
import mplcatppuccin
import matplotlib as mpl
import matplotlib.pyplot as plt

mpl.style.use("latte")
```

### Update PyTorch

```python
# Uninstalls the specified Python packages (torch, torchaudio, torchvision,
# torchtext, torchdata) if they are already installed in your Python
# environment.
# The --yes option automatically confirms the uninstallation so that the process
# doesn’t pause to ask for user confirmation.
!pip3 uninstall --yes torch torchaudio torchvision torchtext torchdata

# This installs the specified Python packages (torch, torchaudio, torchvision,
# torchtext, torchdata). These packages are commonly used for machine learning
# and data processing tasks.
!pip3 install torch torchaudio torchvision torchtext torchdata
```

### Display Plots Inline

```python
# This line is a magic command in IPython.
# It sets the backend of matplotlib to the ‘inline’ backend, which means that
# the output of plotting commands is displayed inline within frontends like
# the Jupyter notebook, directly below the code cell that produced it.
%matplotlib inline
```

### Mount Google Drive

```python
# These lines are used when you’re working in Google Colab and you want to
# access files from your Google Drive.
# The drive.mount('/content/drive') command mounts your Google Drive at the
# specified path (/content/drive), allowing you to read from and write to files
# in your Google Drive directly. You’ll be asked to authorize access by signing
# in to your Google account.
from google.colab import drive
drive.mount('/content/drive')
```

## VSCode Snippets

---

### Keybindings

#### KaTeX for Hugo

```json
{
    "key": "ctrl+alt+k",
    "command": "editor.action.insertSnippet",
    "args": {
        "snippet": "$$\\n\\$TM_SELECTED_TEXT\\n$$"
    },
    "when": "editorTextFocus && !editorReadonly"
},
{
    "key": "ctrl+alt+l",
    "command": "editor.action.insertSnippet",
    "args": {
        "snippet": "$\\$TM_SELECTED_TEXT$"
    },
    "when": "editorTextFocus && !editorReadonly"
},
```

#### KaTeX Surround With `\vec`

```json
{
    "key": "ctrl+alt+v",
    "command": "editor.action.insertSnippet",
    "args": {
        "snippet": "\\vec{$TM_SELECTED_TEXT}"
    },
    "when": "editorTextFocus && !editorReadonly"
}
```
