---
weight: 2
bookFlatSection: false
bookToC: false
title: "How do the Captions Get Processed?"
---

<!--markdownlint-disable MD025 -->

# How do the Captions Get Processed?

---

The `process_caption` method is a comprehensive function designed to process captions with a high degree of customization based on the settings defined in a BaseSubset object. Let’s break down the technical details and mathematical aspects of this method.

## Caption Prefix and Suffix

The method begins by checking if there are any prefixes or suffixes defined in the subset object. If present, these are added to the beginning and end of the caption, respectively. This is straightforward string concatenation:

```python
if subset.caption_prefix:
    caption = subset.caption_prefix + " " + caption
if subset.caption_suffix:
    caption = caption + " " + subset.caption_suffix
```

## Dropout Mechanism

Next, the method determines whether the caption should be dropped. This is done by evaluating the `caption_dropout_rate` and `caption_dropout_every_n_epochs` parameters. The dropout mechanism introduces randomness into the process, which can be useful for data augmentation or preventing overfitting during training. The probability of dropout is determined by a random number generation and comparison with the dropout rate:

```python
is_drop_out = subset.caption_dropout_rate > 0 and random.random() < subset.caption_dropout_rate
is_drop_out = (
    is_drop_out
    or (subset.caption_dropout_every_n_epochs > 0
        and self.current_epoch % subset.caption_dropout_every_n_epochs == 0)
)
```

## Wildcard Processing

If the `enable_wildcard` parameter is set to `True`, the function processes any wildcards present in the caption.
Wildcards are placeholders in the form of `{option1|option2|...}`, where one of the options is randomly chosen and inserted in place of the wildcard.

The wildcard processing involves the following steps:

If the caption contains newline characters `\n`, the function randomly selects one of the lines.
Escaped curly braces `{{` and `}}` are temporarily replaced with special Unicode characters `⦅` and `⦆` to avoid confusion with wildcards.
A regular expression `r"\{([^}]+)\}"` is used to match wildcard patterns, and the `replace_wildcard` function is called for each match:

```python
def replace_wildcard(match):
    return random.choice(match.group(1).split("|"))
```

This function splits the matched string (the wildcard options) by the `|` separator, selects a random option from the resulting list using random.choice, and returns that option as the replacement for the wildcard.
After replacing all wildcards, the escaped curly braces are restored to their original form.

If wildcards are not enabled and the caption contains newlines, only the first line is kept: `caption = caption.split("\n")[0]`.

## Token Manipulation

The function offers advanced token manipulation features, including shuffling, warmup, and dropout. Tokens are the individual words or symbols in the caption. Shuffling tokens can help the model learn more robust representations by presenting the data in different orders. The token warmup mechanism is a form of curriculum learning where the complexity of the data is gradually increased during training. The mathematical formula for calculating the number of tokens to keep based on the warmup step is as follows:

$$
\text{tokens_len} = \left\lfloor \left( \text{self.current_step} \right) \times \left( \frac{\text{len(flex_tokens)} - \text{subset.token_warmup_min}}{\text{subset.token_warmup_step}} \right) \right\rfloor + \text{subset.token_warmup_min}
$$

or in Python:

```python
tokens_len = math.floor(self.current_step * ((len(flex_tokens) - subset.token_warmup_min) / subset.token_warmup_step)) + subset.token_warmup_min
```

- **Token Dropout**: If the `caption_tag_dropout_rate` is greater than 0, the function `dropout_tags` is used to randomly drop tokens based on the specified dropout rate.
- **Shuffling Tokens**: If `shuffle_caption` is set to `True` in the subset, the function shuffles the order of the flexible tokens. This randomization can help the model avoid learning patterns based on the order of words, which might not be relevant.
- **Token Combination**: The final caption is constructed by combining `fixed_tokens`, `flex_tokens`, and `fixed_suffix_tokens`, separated by a comma.
- **Secondary Separator Replacement**: If a `secondary_separator` is defined, it is replaced with the primary `caption_separator` in the final caption.

This section of the code ensures that the caption is dynamically modified according to the subset’s settings, potentially including randomization and selective retention of certain tokens.

## Textual Inversion Replacements

The function also applies textual inversion replacements, which involve replacing specific strings in the caption with predefined replacements. These replacements are stored in the self.replacements dictionary, where the keys are the strings to be replaced and the values are the corresponding replacements.

If the key in the `self.replacements` dictionary is an empty string, the entire caption is replaced with a random choice from the list of replacements (if the value is a list) or with the replacement string itself. Otherwise, each occurrence of the key string in the caption is replaced with the corresponding replacement value.

After applying all these transformations, the processed caption is returned by the function.

Below is a commented version of the function from sd-scripts.

```python
def process_caption(self, subset: BaseSubset, caption: str) -> str:
    """
    Processes a caption based on various parameters defined in the subset.

    The method applies prefixes and suffixes, handles dropout by either clearing the caption or keeping it,
    processes wildcards, shuffles tokens, and applies textual inversion replacements. It also handles multi-line
    captions by either choosing a random line (if wildcards are enabled) or using the first line.

    Parameters:
    - subset (BaseSubset): An object containing various settings for caption processing.
    - caption (str): The initial caption text to be processed.

    Returns:
    - str: The processed caption after applying all transformations.
    """

    # Add prefix and suffix to the caption if they are defined.
    if subset.caption_prefix:
        caption = subset.caption_prefix + " " + caption
    if subset.caption_suffix:
        caption = caption + " " + subset.caption_suffix

    # Determine if the caption should be dropped based on the dropout rate and epoch settings.
    is_drop_out = subset.caption_dropout_rate > 0 and random.random() < subset.caption_dropout_rate
    is_drop_out = (
        is_drop_out
        or (subset.caption_dropout_every_n_epochs > 0
            and self.current_epoch % subset.caption_dropout_every_n_epochs == 0)
    )

    # If dropout condition is met, clear the caption.
    if is_drop_out:
        caption = ""
    else:
        # Process wildcards if enabled.
        if subset.enable_wildcard:
            # If the caption has multiple lines, choose one at random.
            if "\n" in caption:
                caption = random.choice(caption.split("\n"))

            # Handle escaped curly braces.
            replacer1 = "⦅"
            replacer2 = "⦆"
            while replacer1 in caption or replacer2 in caption:
                replacer1 += "⦅"
                replacer2 += "⦆"

            caption = caption.replace("{{", replacer1).replace("}}", replacer2)

            # Function to replace wildcards with a random choice.
            def replace_wildcard(match):
                return random.choice(match.group(1).split("|"))

            # Replace wildcards with a random choice from the options.
            caption = re.sub(r"\{([^}]+)\}", replace_wildcard, caption)

            # Unescape the curly braces.
            caption = caption.replace(replacer1, "{").replace(replacer2, "}")
        else:
            # If wildcards are not enabled and the caption is multi-line, use the first line.
            caption = caption.split("\n")[0]

        # Shuffle tokens, apply token warmup, and dropout tags if specified.
        if subset.shuffle_caption or subset.token_warmup_step > 0 or subset.caption_tag_dropout_rate > 0:
            fixed_tokens = []
            flex_tokens = []
            fixed_suffix_tokens = []

            # Split the caption into fixed and flexible parts if a separator is defined.
            if (hasattr(subset, "keep_tokens_separator") and subset.keep_tokens_separator
                    and subset.keep_tokens_separator in caption):
                fixed_part, flex_part = caption.split(subset.keep_tokens_separator, 1)
                if subset.keep_tokens_separator in flex_part:
                    flex_part, fixed_suffix_part = flex_part.split(subset.keep_tokens_separator, 1)
                    fixed_suffix_tokens = [t.strip() for t in fixed_suffix_part.split(subset.caption_separator) if t.strip()]

                fixed_tokens = [t.strip() for t in fixed_part.split(subset.caption_separator) if t.strip()]
                flex_tokens = [t.strip() for t in flex_part.split(subset.caption_separator) if t.strip()]
            else:
                # If no separator is defined, consider all tokens as flexible.
                tokens = [t.strip() for t in caption.strip().split(subset.caption_separator)]
                flex_tokens = tokens[:]
                if subset.keep_tokens > 0:
                    fixed_tokens = flex_tokens[: subset.keep_tokens]
                    flex_tokens = tokens[subset.keep_tokens:]

            # Calculate the number of tokens to keep based on the warmup step.
            if subset.token_warmup_step < 1:
                subset.token_warmup_step = math.floor(subset.token_warmup_step * self.max_train_steps)
            if subset.token_warmup_step and self.current_step < subset.token_warmup_step:
                tokens_len = (
                    math.floor(
                        (self.current_step) * ((len(flex_tokens) - subset.token_warmup_min) / (subset.token_warmup_step))
                    )
                    + subset.token_warmup_min
                )
                flex_tokens = flex_tokens[:tokens_len]

            # Function to dropout tags based on the dropout rate.
            def dropout_tags(tokens):
                if subset.caption_tag_dropout_rate <= 0:
                    return tokens
                return [token for token in tokens if random.random() >= subset.caption_tag_dropout_rate]

            # Shuffle the flexible tokens if specified.
            if subset.shuffle_caption:
                random.shuffle(flex_tokens)

            # Apply tag dropout to the flexible tokens.
            flex_tokens = dropout_tags(flex_tokens)

            # Combine the fixed, flexible, and fixed suffix tokens into the final caption.
            caption = ", ".join(fixed_tokens + flex_tokens + fixed_suffix_tokens)

        # Replace the secondary separator with the primary one if defined.
        if subset.secondary_separator:
            caption = caption.replace(subset.secondary_separator, subset.caption_separator)

        # Apply textual inversion replacements.
        for str_from, str_to in self.replacements.items():
            if str_from == "":
                # If the replacement string is empty, replace the entire caption.
                caption = random.choice(str_to) if type(str_to) == list else str_to
            else:
                # Replace specific strings with their corresponding replacements.
                caption = caption.replace(str_from, str_to)

    return caption
```
