+++
title = "Early Steps"
date = "2023-08-18T12:08:30+02:00"
author = ""
authorTwitter = "" #do not include @
cover = ""
tags = ["", ""]
keywords = ["", ""]
description = ""
showFullContent = false
readingTime = false
hideComments = false
color = "" #color from the theme settings
+++

## Working with Data

### Get random quote from .csv

`motivational-quotes.csv`
```csv
`"""The only way to do great work is to love what you do."" - Steve Jobs"
"""Success is not final, failure is not fatal: It is the courage to continue that counts."" - Winston Churchill"
"""Believe you can and you're halfway there."" - Theodore Roosevelt"
"""The future depends on what you do today."" - Mahatma Gandhi"
"""Don't watch the clock; do what it does. Keep going."" - Sam Levenson"
"""Success is walking from failure to failure with no loss of enthusiasm."" - Winston S. Churchill"
"""The harder you work for something, the greater you'll feel when you achieve it."" - Unknown"
"""The only limit to our realization of tomorrow will be our doubts of today."" - Franklin D. Roosevelt"
"""Your time is limited, don't waste it living someone else's life."" - Steve Jobs"
"""You are never too old to set another goal or to dream a new dream."" - C.S. Lewis"
```


`random-quote-from-csv.py`

```python
import csv
import random

def get_random_quote(csv_file):
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        quotes = list(reader)
        
        if len(quotes) == 0:
            return "No quotes found in the CSV file."
        
        random_quote = random.choice(quotes)[0]
        return random_quote

csv_filename = "motivational-quotes.csv"
random_quote = get_random_quote(csv_filename)
print(random_quote)
```
