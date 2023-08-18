+++
title = "Early Steps"
date = "2023-08-18T12:08:30+02:00"
author = ""
authorTwitter = "" #do not include @
cover = ""
tags = ["", ""]
keywords = ["", ""]
description = ""
categories = ["ML"]
color = "" #color from the theme settings
showFullContent = true
readingTime = true
hideComments = false
+++

{{< figure src="/images/manvsmachine.png" alt="Alt Text" caption="Men slowly starting to interface with the machines other men built for them. Glorious!" >}}

I accidentally dropped out of society for a few years, and upon my return, I discovered the presence of peculiar machines that we can converse with, and which possess extensive knowledge about various subjects. I have no trepidation concerning GPUs, so let's embark on a deep exploration of this novel 'disruptive' technology together. Below, you will find a graveyard of both useful and useless scripts, composed individually by machines or with minimal assistance from this hairy monkey. It's worth noting that these scripts should not be executed, but rather studied by the vigilant, perhaps even the overly cautious..

## Working with Data

### Get random quote from .csv

In case you need to manipulate CSV files with Python or access the data randomly or predictably during your travels, ChatGPT can assist you.

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
