---
weight: 5
bookFlatSection: false
bookToC: false
title: "Aho–Corasick Algorithm"
summary: "The Aho-Corasick algorithm efficiently locates all occurrences of multiple keywords in a text by constructing a finite state machine, combining trie and failure transitions, and can be used for tasks like pattern highlighting and simultaneous replacements."
---

<!--markdownlint-disable MD025 MD033 -->

# Aho–Corasick Algorithm

---

This is a classic string searching algorithm that was invented by Alfred V. Aho and Margaret J. Corasick in 1975. It’s used for locating all occurrences of any of a finite set of strings within some input text.

It constructs a finite state machine from a list of keywords, then uses the machine to locate all occurrences of the keywords in a body of text. The construction of the machine runs in $O(n)$ time where $n$ is the total length of all keywords. The search operation also runs in $O(n)$ time where $n$ is the length of the searched text.

The finite state machine is essentially a trie with additional “failure” transitions. Each node in the trie corresponds to a prefix of at least one keyword, and each edge corresponds to a character in a keyword.

**Trie Construction**: The first step is to build a trie from the keywords. Each keyword corresponds to a path from the root to a node. Each node stores the character of the edge that leads to it from its parent.

**Failure Function Construction**: The next step is to add failure transitions to each node. The failure transition of a node is the longest proper suffix of the current string (the string formed by concatenating the characters along the path from the root to the current node) that is also a proper prefix of another string in the trie.

Once the finite state machine is constructed, it can be used to search the text. Starting from the first character of the text and the root of the trie, follow the transition corresponding to the current character in the text. If the transition does not exist, follow the failure transition of the current node. If a node is reached that corresponds to a keyword, record a match.

## Code Example

---

This program highlights the occurrences of specific patterns in a given text using the Aho-Corasick algorithm.
It assigns a unique color to each pattern and prints the text to the console with the patterns highlighted in their respective colors.

```rust
use aho_corasick::AhoCorasick;
use crossterm::style::{ Color, Print, ResetColor, SetForegroundColor };
use crossterm::ExecutableCommand;
use rand::Rng;
use std::collections::HashMap;
use std::io::stdout;

fn main() {
    // The patterns to search for
    let patterns = &["apple", "maple", "Snapple"];
    // The text to search in
    let haystack = "Nobody likes maple in their apple flavored Snapple.";
    // Creating a new AhoCorasick automaton with the given patterns
    let ac = AhoCorasick::new(patterns).unwrap();

    // Finding all occurrences of the patterns in the text and storing their ids and positions
    let mut matches = vec![];
    for mat in ac.find_iter(haystack) {
        matches.push((mat.pattern().as_usize(), mat.start(), mat.end()));
    }

    // Creating a HashMap to store the color assigned to each pattern
    let mut color_map: HashMap<usize, Color> = HashMap::new();

    // Defining an array of colors to choose from
    #[rustfmt::skip]
    let colors = [ Color::Red, Color::Green, Color::Yellow, Color::Blue,
                   Color::Magenta, Color::Cyan, Color::DarkBlue, Color::DarkCyan,
                   Color::DarkGreen, Color::DarkMagenta, Color::DarkRed,
                   Color::DarkYellow,
    ];

    // Creating a random number generator
    let mut rng = rand::thread_rng();
    // Getting a handle to stdout
    let mut stdout = stdout();
    // The end position of the last match
    let mut last_end = 0;

    // Iterating over the matches
    for (id, start, end) in matches.iter() {
        // Getting the color for the current pattern, or assigning a random one
        // if it doesn't have one yet
        let color = color_map.entry(*id).or_insert(colors[rng.gen_range(0..colors.len())]);

        // Printing the text between the last match and the current one in the default color
        stdout.execute(Print(&haystack[last_end..*start])).unwrap();

        // Setting the foreground color to the color of the current pattern
        stdout.execute(SetForegroundColor(*color)).unwrap();

        // Printing the current match in its color
        stdout.execute(Print(&haystack[*start..*end])).unwrap();

        // Resetting the color to the default
        stdout.execute(ResetColor).unwrap();

        last_end = *end; // Updating the end position of the last match
    }

    // Printing the rest of the text in the default color
    stdout.execute(Print(&haystack[last_end..])).unwrap();
}
```

## Stream replace all

---

This example shows how to replace all occurrences of multiple patterns simultaneously.

```rust
    let patterns = &["fox", "brown", "quick"];
    let replace_with = &["sloth", "grey", "slow"];

    // The text to search in
    let haystack = "The quick brown fox.";
    // Creating a new AhoCorasick automaton with the given patterns
    let ac = AhoCorasick::new(patterns).unwrap();

    // Replacing all occurrences of the patterns in the text and storing the result
    let mut result = vec![];
    ac.try_stream_replace_all(haystack.as_bytes(), &mut result, replace_with).expect(
        "try_stream_replace_all failed"
    );

    // Converting the result to a string
    let result_str = String::from_utf8(result).unwrap();

    // Finding all occurrences of the replacement patterns in the result and storing their ids and positions
    let mut matches = vec![];
    for mat in ac.find_iter(&result_str) {
        matches.push((mat.pattern().as_usize(), mat.start(), mat.end()));
    }

    let mut last_end = 0;
    for (id, start, end) in matches.iter() {
        let color = color_map.entry(*id).or_insert(colors[rng.gen_range(0..colors.len())]);
        stdout.execute(Print(&result_str[last_end..*start])).unwrap();
        stdout.execute(SetForegroundColor(*color)).unwrap();
        stdout.execute(Print(&result_str[*start..*end])).unwrap();
        stdout.execute(ResetColor).unwrap();
        last_end = *end;
    }
    stdout.execute(Print(&result_str[last_end..])).unwrap();
```
