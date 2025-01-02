---
weight: 2
bookFlatSection: false
bookToC: false
title: "キャプションはどのように処理されるのか？"
summary: "この記事では、sd-scriptsの`process_caption`メソッドについて説明し、様々なパラメータに基づいてキャプションをカスタマイズする方法を詳しく解説します。プレフィックスとサフィックスの追加、ドロップアウトメカニズム、ワイルドカード処理、トークン操作、テキスト反転置換などをカバーしています。このメソッドは、トレーニングデータの品質とモデルの堅牢性を向上させるために、キャプションを動的に修正します。"
---

<!--markdownlint-disable MD025 -->

# キャプションはどのように処理されるのか？

---

`process_caption`メソッドは、BaseSubsetオブジェクトで定義された設定に基づいて、高度なカスタマイズでキャプションを処理するように設計された包括的な関数です。このメソッドの技術的な詳細と数学的な側面を見ていきましょう。

## キャプションのプレフィックスとサフィックス

このメソッドは、まずサブセットオブジェクトに定義されたプレフィックスやサフィックスがあるかどうかを確認します。存在する場合、それぞれキャプションの先頭と末尾に追加されます。これは単純な文字列の連結です：

```python
if subset.caption_prefix:
    caption = subset.caption_prefix + " " + caption
if subset.caption_suffix:
    caption = caption + " " + subset.caption_suffix
```

## ドロップアウトメカニズム

次に、キャプションをドロップアウトすべきかどうかを判断します。これは`caption_dropout_rate`と`caption_dropout_every_n_epochs`パラメータを評価することで行われます。ドロップアウトメカニズムは、データ拡張やトレーニング中の過学習を防ぐために使用できるランダム性を導入します。ドロップアウトの確率は、乱数生成とドロップアウト率との比較によって決定されます：

```python
is_drop_out = subset.caption_dropout_rate > 0 and random.random() < subset.caption_dropout_rate
is_drop_out = (
    is_drop_out
    or (subset.caption_dropout_every_n_epochs > 0
        and self.current_epoch % subset.caption_dropout_every_n_epochs == 0)
)
```

## ワイルドカード処理

`enable_wildcard`パラメータが`True`に設定されている場合、関数はキャプション内のワイルドカードを処理します。
ワイルドカードは`{option1|option2|...}`の形式のプレースホルダーで、オプションの中からランダムに1つが選択されてワイルドカードの位置に挿入されます。

ワイルドカード処理には以下のステップが含まれます：

キャプションに改行文字`\n`が含まれている場合、関数はランダムに1行を選択します。
エスケープされた中括弧`{{`と`}}`は、ワイルドカードとの混同を避けるために一時的に特殊なUnicode文字`⦅`と`⦆`に置き換えられます。
正規表現`r"\{([^}]+)\}"`を使用してワイルドカードパターンをマッチさせ、各マッチに対して`replace_wildcard`関数が呼び出されます：

```python
def replace_wildcard(match):
    return random.choice(match.group(1).split("|"))
```

この関数は、マッチした文字列（ワイルドカードオプション）を`|`セパレータで分割し、結果のリストからrandom.choiceを使用してランダムなオプションを選択し、そのオプションをワイルドカードの置き換えとして返します。
すべてのワイルドカードを置き換えた後、エスケープされた中括弧は元の形式に戻されます。

ワイルドカードが有効でなく、キャプションに改行が含まれている場合は、最初の行のみが保持されます：`caption = caption.split("\n")[0]`。

## トークン操作

この関数は、シャッフル、ウォームアップ、ドロップアウトを含む高度なトークン操作機能を提供します。トークンはキャプション内の個々の単語や記号です。トークンのシャッフルは、データを異なる順序で提示することで、モデルがより堅牢な表現を学習するのに役立ちます。トークンウォームアップメカニズムは、トレーニング中にデータの複雑さを徐々に増やしていくカリキュラム学習の一形態です。ウォームアップステップに基づいて保持するトークン数を計算する数式は以下の通りです：

$$
\text{tokens_len} = \left\lfloor \left( \text{self.current_step} \right) \times \left( \frac{\text{len(flex_tokens)} - \text{subset.token_warmup_min}}{\text{subset.token_warmup_step}} \right) \right\rfloor + \text{subset.token_warmup_min}
$$

またはPythonでは：

```python
tokens_len = math.floor(self.current_step * ((len(flex_tokens) - subset.token_warmup_min) / subset.token_warmup_step)) + subset.token_warmup_min
```

- **トークンドロップアウト**：`caption_tag_dropout_rate`が0より大きい場合、`dropout_tags`関数を使用して指定されたドロップアウト率に基づいてランダムにトークンをドロップします。
- **トークンのシャッフル**：サブセットで`shuffle_caption`が`True`に設定されている場合、関数は柔軟なトークンの順序をシャッフルします。この無作為化は、モデルが関係のない可能性のある単語の順序に基づいたパターンを学習するのを防ぐのに役立ちます。
- **トークンの結合**：最終的なキャプションは、`fixed_tokens`、`flex_tokens`、`fixed_suffix_tokens`をカンマで区切って結合することで構築されます。
- **セカンダリセパレータの置換**：`secondary_separator`が定義されている場合、最終的なキャプションでプライマリの`caption_separator`に置き換えられます。

このコードセクションは、サブセットの設定に従ってキャプションを動的に修正し、特定のトークンのランダム化と選択的な保持を含む可能性があります。

## テキスト反転置換

この関数は、キャプション内の特定の文字列を事前定義された置換で置き換えるテキスト反転置換も適用します。これらの置換は`self.replacements`辞書に保存され、キーは置換される文字列、値は対応する置換です。

`self.replacements`辞書のキーが空文字列の場合、キャプション全体が（値がリストの場合は）リストからランダムに選択された置換または置換文字列自体に置き換えられます。それ以外の場合、キャプション内のキー文字列の各出現が対応する置換値に置き換えられます。

これらすべての変換を適用した後、処理されたキャプションが関数によって返されます。

以下はsd-scriptsからの関数のコメント付きバージョンです。

```python
def process_caption(self, subset: BaseSubset, caption: str) -> str:
    """
    サブセットで定義された様々なパラメータに基づいてキャプションを処理します。

    このメソッドは、プレフィックスとサフィックスを適用し、キャプションをクリアするかキープするかのドロップアウトを
    処理し、ワイルドカードを処理し、トークンをシャッフルし、テキスト反転置換を適用します。また、複数行の
    キャプションを、（ワイルドカードが有効な場合は）ランダムな行を選択するか、最初の行を使用して処理します。

    パラメータ：
    - subset (BaseSubset): キャプション処理のための様々な設定を含むオブジェクト。
    - caption (str): 処理される初期キャプションテキスト。

    戻り値：
    - str: すべての変換を適用した後の処理されたキャプション。
    """

    # プレフィックスとサフィックスが定義されている場合、キャプションに追加。
    if subset.caption_prefix:
        caption = subset.caption_prefix + " " + caption
    if subset.caption_suffix:
        caption = caption + " " + subset.caption_suffix

    # ドロップアウト率とエポック設定に基づいて、キャプションをドロップすべきかどうかを判断。
    is_drop_out = subset.caption_dropout_rate > 0 and random.random() < subset.caption_dropout_rate
    is_drop_out = (
        is_drop_out
        or (subset.caption_dropout_every_n_epochs > 0
            and self.current_epoch % subset.caption_dropout_every_n_epochs == 0)
    )

    # ドロップアウト条件が満たされた場合、キャプションをクリア。
    if is_drop_out:
        caption = ""
    else:
        # ワイルドカードが有効な場合、処理を行う。
        if subset.enable_wildcard:
            # キャプションに複数行がある場合、ランダムに1行を選択。
            if "\n" in caption:
                caption = random.choice(caption.split("\n"))

            # エスケープされた中括弧を処理。
            replacer1 = "⦅"
            replacer2 = "⦆"
            while replacer1 in caption or replacer2 in caption:
                replacer1 += "⦅"
                replacer2 += "⦆"

            caption = caption.replace("{{", replacer1).replace("}}", replacer2)

            # ワイルドカードをランダムな選択で置き換える関数。
            def replace_wildcard(match):
                return random.choice(match.group(1).split("|"))

            # ワイルドカードをオプションからランダムな選択で置き換え。
            caption = re.sub(r"\{([^}]+)\}", replace_wildcard, caption)

            # 中括弧のエスケープを元に戻す。
            caption = caption.replace(replacer1, "{").replace(replacer2, "}")
        else:
            # ワイルドカードが有効でなく、キャプションが複数行の場合、最初の行を使用。
            caption = caption.split("\n")[0]

        # 指定された場合、トークンのシャッフル、トークンウォームアップ、タグのドロップアウトを適用。
        if subset.shuffle_caption or subset.token_warmup_step > 0 or subset.caption_tag_dropout_rate > 0:
            fixed_tokens = []
            flex_tokens = []
            fixed_suffix_tokens = []

            # セパレータが定義されている場合、キャプションを固定部分と柔軟部分に分割。
            if (hasattr(subset, "keep_tokens_separator") and subset.keep_tokens_separator
                    and subset.keep_tokens_separator in caption):
                fixed_part, flex_part = caption.split(subset.keep_tokens_separator, 1)
                if subset.keep_tokens_separator in flex_part:
                    flex_part, fixed_suffix_part = flex_part.split(subset.keep_tokens_separator, 1)
                    fixed_suffix_tokens = [t.strip() for t in fixed_suffix_part.split(subset.caption_separator) if t.strip()]

                fixed_tokens = [t.strip() for t in fixed_part.split(subset.caption_separator) if t.strip()]
                flex_tokens = [t.strip() for t in flex_part.split(subset.caption_separator) if t.strip()]
            else:
                # セパレータが定義されていない場合、すべてのトークンを柔軟とみなす。
                tokens = [t.strip() for t in caption.strip().split(subset.caption_separator)]
                flex_tokens = tokens[:]
                if subset.keep_tokens > 0:
                    fixed_tokens = flex_tokens[: subset.keep_tokens]
                    flex_tokens = tokens[subset.keep_tokens:]

            # ウォームアップステップに基づいて保持するトークン数を計算。
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

            # ドロップアウト率に基づいてタグをドロップアウトする関数。
            def dropout_tags(tokens):
                if subset.caption_tag_dropout_rate <= 0:
                    return tokens
                return [token for token in tokens if random.random() >= subset.caption_tag_dropout_rate]

            # 指定された場合、柔軟なトークンをシャッフル。
            if subset.shuffle_caption:
                random.shuffle(flex_tokens)

            # 柔軟なトークンにタグドロップアウトを適用。
            flex_tokens = dropout_tags(flex_tokens)

            # 固定トークン、柔軟トークン、固定サフィックストークンを最終的なキャプションに結合。
            caption = ", ".join(fixed_tokens + flex_tokens + fixed_suffix_tokens)

        # セカンダリセパレータが定義されている場合、プライマリセパレータに置き換え。
        if subset.secondary_separator:
            caption = caption.replace(subset.secondary_separator, subset.caption_separator)

        # テキスト反転置換を適用。
        for str_from, str_to in self.replacements.items():
            if str_from == "":
                # 置換文字列が空の場合、キャプション全体を置き換え。
                caption = random.choice(str_to) if type(str_to) == list else str_to
            else:
                # 特定の文字列を対応する置換で置き換え。
                caption = caption.replace(str_from, str_to)

    return caption
```
