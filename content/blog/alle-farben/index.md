+++
title = "Alle Farben"
date = "2023-08-20T11:27:05+02:00"
author = "Balazs Horvath"
authorTwitter = "_ka_de"
cover = ""
tags = ["powershell script", "excel data extraction", "python programming", "color conversion", "data manipulation", "json", "excel spreadsheets", "data analysis"]
keywords = ["PowerShell script", "Excel data extraction", "Python programming", "Color conversion", "Data manipulation", "JSON format", "Excel spreadsheets", "Data analysis", "RGB values", "HSL values", "Hexadecimal colors", "Excel macros", "Unicode characters", "Data conversion techniques", "Data extraction methods", "Excel automation", "Color analysis", "Spreadsheet manipulation", "Data transformation", "Excel workbook", "ChatGPT", "Python Programming", "AI and Machine Learning"]
categories = ["Data Manipulation", "Excel", "PowerShell", "Python", "Data Extraction", "Data Conversion", "Color Analysis", "Technology", "Programming", "AI and Machine Learning"]
description = "Dive into the world of data manipulation, color conversion, and automation with Balazs Horvath's blog post, 'Alle Farben.' Explore the power of PowerShell scripting and Python programming as Balazs extracts color values from Excel spreadsheets, converts them to various formats, and saves the data as JSON. Discover the magic of Unicode characters in sheet names and the art of transforming data from multiple sheets into a unified JSON file. Join the journey of making manual data entry feel irrelevant while exploring the intricacies of color analysis and data conversion techniques. Explore the intersection of technology, programming, and AI in this insightful blog post."
showFullContent = true
readingTime = true
hideComments = false
+++

```powershell
# Change directory to my blog in the most extravagant way.
function blog {
    Set-Location -Path (Join-Path -Path $env:USERPROFILE -ChildPath "code\blog")
}
```

Okay, he got a bit out of hand with this one, but.. I did torture ChatGPT today with some more Python and Excel.

{{< figure src="/images/rose-colorscheme.png" alt="Screenshot of an Excel spreadsheet." caption="This took me a really long time to make, okay?" >}}

Let's make him extract color values from column A without the header and put them in a JSON file.

```python
import openpyxl
import json

# Load the Excel workbook with macros
workbook_path = "Rose Pine Colorscheme.xlsm"
workbook = openpyxl.load_workbook(workbook_path, read_only=True, data_only=True)

# Specify the sheet name where your data is located
sheet_name = "Rosé Pine"

# Get the active worksheet
worksheet = workbook[sheet_name]

# Extract data from the first column (column A) starting from the second row (row 2)
data = []
for row in worksheet.iter_rows(min_row=2, max_col=1, values_only=True):
    cell_value = row[0]
    if cell_value is not None:
        data.append(cell_value)

# Create a dictionary to store the data
data_dict = {"colors": data}

# Save the data as JSON
output_json_path = "output.json"  # Replace with the desired output path
with open(output_json_path, "w") as json_file:
    json.dump(data_dict, json_file, indent=4)

print("Data extracted and saved as JSON successfully.")
```

Great, now do it for every sheet, but watch out, I put unicode in the sheet name!

```python
# Create a dictionary to store data from all sheets
all_data = {}

# Loop through all sheets in the workbook
for sheet in workbook:
    # Extract data from the first column (column A) starting from the second row
    data = []
    for row in sheet.iter_rows(min_row=2, max_col=1, values_only=True):
        cell_value = row[0]
        if cell_value is not None:
            data.append(cell_value)

    # Store the data in the dictionary using the sheet name as the key
    # Use sheet.title.encode('utf-8') to encode the sheet name to UTF-8
    all_data[sheet.title.encode('utf-8').decode('utf-8')] = data

# Save all data as JSON with ensure_ascii=False to preserve Unicode characters
output_json_path = "output.json"  # Replace with the desired output path
with open(output_json_path, "w", encoding="utf-8") as json_file:
    json.dump(all_data, json_file, indent=4, ensure_ascii=False)

print("Data from all sheets extracted and saved as JSON successfully.")
```

Amazing job so far, lets use the color names in column B as keys for the color values.

```python
# Loop through all sheets in the workbook
for sheet in workbook:
    # Extract data from columns A and B starting from the second row (row 2)
    data = {}
    for row in sheet.iter_rows(min_row=2, max_col=2, values_only=True):
        color_name, color_value = row[0], row[1]
        if color_name is not None and color_value is not None:
            data[color_value] = color_name  # Reversed order
```

Now be a good machine an take those hexadecimal color values from column A and convert them to RGB and HSL values, making whoever entered them manually feel irrelevant at his work:

```python
import openpyxl
import colorsys

# Load the Excel workbook with macros
workbook_path = "Rose Pine Colorscheme.xlsm"  # Replace with the actual path
workbook = openpyxl.load_workbook(workbook_path, read_only=True, data_only=True)

# Specify the sheet name where your data is located
sheet_name = "Rosé Pine"  # Change to your sheet name

# Get the active worksheet
worksheet = workbook[sheet_name]

# Iterate through the rows starting from the second row (row 2)
for row in worksheet.iter_rows(min_row=2, max_col=1, values_only=True):
    cell_value = row[0]
    if cell_value is not None:
        # Convert hex color value to RGB
        hex_color = cell_value.lstrip('#')
        rgb_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

        # Convert RGB to HSL
        r, g, b = [x / 255.0 for x in rgb_color]
        h, l, s = colorsys.rgb_to_hls(r, g, b)

        # Format HSL values as integers in the range 0-360 (hue) and 0-100 (saturation and lightness)
        h = int(h * 360)
        s = int(s * 100)
        l = int(l * 100)

        # Print Hex, RGB, and HSL values
        print(f"Hex: {cell_value}, RGB: {rgb_color}, HSL: {h}, {s}, {l}")

print("Conversion from hex to RGB and HSL completed.")
```

You can find the full scripts and the example spreadsheet on my [Github](https://github.com/ka-de/_life_is_a_mess_/tree/main/excel-to-json).

{{< spotify 0H5MVQwMcpm4KkPZz13KZr >}}
