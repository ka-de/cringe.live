---
weight: 1
bookFlatSection: false
title: "Convert Date to UNIX Timestamp"
summary: "Provides a Python script that converts a given date and time into a Unix timestamp, which represents the number of seconds that have elapsed since January 1, 1970."
---

<!--markdownlint-disable MD025  -->

# Convert Date to UNIX Timestamp

---

```py
"""
This script converts a given date and time in the format of year, month, day, hour, and minute
to a Unix timestamp. The Unix timestamp represents the number of seconds that have elapsed since
January 1, 1970 (midnight UTC/GMT), not counting leap seconds.

The script takes input from the command line, where the date and time components are expected to be
provided in the following order: year, month, day, hour, minute.
"""

from datetime import datetime
import time
import sys

def convert_to_unix_date(year, month, day, hour, minute):
    """
    Convert the given date and time components to a Unix timestamp.

    Parameters:
    year (int): The year component of the date.
    month (int): The month component of the date.
    day (int): The day component of the date.
    hour (int): The hour component of the time (24-hour format).
    minute (int): The minute component of the time.

    Returns:
    int: The Unix timestamp corresponding to the given date and time.
    """
    # Create a datetime object from the input components
    dt = datetime(year, month, day, hour, minute)
    # Convert the datetime object to a Unix timestamp
    unix_timestamp = int(time.mktime(dt.timetuple()))
    return unix_timestamp

if __name__ == "__main__":
    # Check if the correct number of arguments are provided
    if len(sys.argv) != 6:
        print("Usage: python script.py year month day hour minute")
        sys.exit(1)

    # Parse the date components from the command line arguments
    year = int(sys.argv[1])
    month = int(sys.argv[2])
    day = int(sys.argv[3])
    hour = int(sys.argv[4])
    minute = int(sys.argv[5])

    # Convert to Unix timestamp and print
    unix_date = convert_to_unix_date(year, month, day, hour, minute)
    print(f"The Unix timestamp for {year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d} is: {unix_date}")
```
