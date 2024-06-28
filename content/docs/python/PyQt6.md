---
weight: 1
bookFlatSection: false
bookToC: false
title: "PyQt6"
summary: "Provides a detailed guide on how to create a PyQt6 application with a resizable `QLabel`, a `QPushButton`, and a `QSlider`, and how to change the font size and text of the `QLabel` dynamically."
---

<!--markdownlint-disable MD025 MD033 -->

# PyQt6

---

```python
from PyQt6.QtWidgets import QApplication, QLabel, QWidget
from PyQt6.QtCore import Qt

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Hello World')
        self.setGeometry(100, 100, 640, 480)  # x, y, width, height

        # Create a QLabel to display the text
        self.label = QLabel('Hello World!', self)
        # Center the text
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)

# Create an instance of QApplication
app = QApplication([])

# Create an instance of MainWindow
window = MainWindow()

# Show the window
window.show()

# Run the application's event loop
app.exec()
```

To keep the text centered when the application window is resized, you can use the `resizeEvent` method of the `QWidget` class to adjust the size of the `QLabel` whenever the window is resized.

```python
    def resizeEvent(self, event):
        # Resize the label to take the full size of the window
        self.label.resize(self.size())
```

 Inside this method, we resize the `QLabel` to match the size of the window. This ensures that the `QLabel` always takes up the full size of the window, keeping the text centered even when the window is resized. Please note that this will keep the text centered both horizontally and vertically. If you want to keep the text centered only horizontally, you can use `Qt.AlignmentFlag.AlignHCenter` instead of `Qt.AlignmentFlag.AlignCenter`. This will center the text only horizontally.

```python
        # Change the font to monospace and increase the size
        self.label.setFont(QFont('Cascadia Code', 24))  # Font name, size
```

This changes the font of the `QLabel` to Cascadia Code and increases the size to 24. You can adjust the size to your liking. Please note that the available fonts depend on your system.

The `QFont` class is used to specify the font. The first argument is the font family, and the second argument is the point size. The point size is a measure of the height of the characters, with 1 point being approximately 1/72 inch. The actual rendered size may vary slightly depending on the font. The `QFont` class also has other options for setting the weight (**boldness**) and style (*italic*, <ins>underline</ins>, etc.) of the font. For example, you can use `QFont('Cascadia Code', 24, QFont.Weight.Bold)` to make the font bold.

## Font by Operating System

You can also define multiple fonts. Just make sure to import the platform module at the beginning of your script!

---

```python
import platform
from PyQt6.QtWidgets import QApplication, QLabel, QWidget, QVBoxLayout, QPushButton, QSlider
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont, QFontDatabase

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Hello World')
        self.setGeometry(100, 100, 640, 480)  # x, y, width, height

        # Create a QVBoxLayout to manage the layout of the widgets
        layout = QVBoxLayout()

        # Create a QLabel to display the text
        self.label = QLabel('Hello World!', self)
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)  # Center the text

        # Set the font at the start of the application
        self.change_font_size(24)

        # Create a QPushButton
        self.button = QPushButton('Change Text', self)
        # Connect the button's clicked signal to the change_text slot
        self.button.clicked.connect(self.change_text)

        # Create a QSlider
        self.slider = QSlider(Qt.Orientation.Horizontal, self)
        self.slider.setRange(10, 72)  # Set the range of the slider
        self.slider.setValue(24)  # Set the initial value of the slider
        # Connect the slider's valueChanged signal to the change_font_size slot
        self.slider.valueChanged.connect(self.change_font_size)

        # Add the widgets to the layout
        layout.addWidget(self.label)
        layout.addWidget(self.button)
        layout.addWidget(self.slider)

        # Set the layout of the window
        self.setLayout(layout)

    def resizeEvent(self, event):
        # Resize the label to take the full size of the window
        self.label.resize(self.size())
        # Change the font when the window is resized
        self.change_font_size(self.slider.value())

    def change_text(self):
        # Change the text of the label when the button is clicked
        self.label.setText('You clicked the button!')

    def change_font_size(self, value):
        # Get a list of all font families available in the database
        font_families = QFontDatabase.families()

        # Set different fonts for different operating systems
        if 'Windows' in platform.system():
            font_name = 'Cascadia Code' if 'Cascadia Code' in font_families else 'Arial'
        elif 'Darwin' in platform.system():  # macOS
            font_name = 'Menlo' if 'Menlo' in font_families else 'Arial'
        elif 'Linux' in platform.system():
            font_name = 'Ubuntu Mono' if 'Ubuntu Mono' in font_families else 'Arial'
        else:
            font_name = 'Arial'  # Default font

        # Change the font size of the label when the slider value changes
        self.label.setFont(QFont(font_name, value))

app = QApplication([])
window = MainWindow()
window.show()
app.exec()
```

## Vertical Layout

With Sliders and Buttons!

---

```python
from PyQt6.QtWidgets import QApplication, QLabel, QWidget, QVBoxLayout, QPushButton, QSlider
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Hello World')
        self.setGeometry(100, 100, 640, 480)  # x, y, width, height

        # Create a QVBoxLayout to manage the layout of the widgets
        layout = QVBoxLayout()

        # Create a QLabel to display the text
        self.label = QLabel('Hello World!', self)
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)  # Center the text
        self.label.setFont(QFont('Cascadia Code', 24))  # Set the font and size

        # Create a QPushButton
        self.button = QPushButton('Change Text', self)
        # Connect the button's clicked signal to the change_text slot
        self.button.clicked.connect(self.change_text)

        # Create a QSlider
        self.slider = QSlider(Qt.Orientation.Horizontal, self)
        self.slider.setRange(10, 72)  # Set the range of the slider
        self.slider.setValue(24)  # Set the initial value of the slider
        # Connect the slider's valueChanged signal to the change_font_size slot
        self.slider.valueChanged.connect(self.change_font_size)

        # Add the widgets to the layout
        layout.addWidget(self.label)
        layout.addWidget(self.button)
        layout.addWidget(self.slider)

        # Set the layout of the window
        self.setLayout(layout)

    def resizeEvent(self, event):
        # Resize the label to take the full size of the window
        self.label.resize(self.size())

    def change_text(self):
        # Change the text of the label when the button is clicked
        self.label.setText('You clicked the button!')

    def change_font_size(self, value):
        # Change the font size of the label when the slider value changes
        self.label.setFont(QFont('Cascadia Code', value))

app = QApplication([])
window = MainWindow()
window.show()
app.exec()
```

In this code, we’ve added a `QPushButton` and a `QSlider` to the window.

The `QPushButton` changes the text of the `QLabel` when clicked, and the `QSlider` changes the font size of the `QLabel` when its value changes. We’ve connected the clicked signal of the `QPushButton` and the `valueChanged` signal of the `QSlider` to the `change_text` and `change_font_size` slots, respectively, using the connect method. The `change_text` slot changes the text of the `QLabel`, and the `change_font_size` slot changes the font size of the `QLabel`.

We’ve also added a `QVBoxLayout` to manage the layout of the widgets. The `QVBoxLayout` arranges the widgets vertically in the order they are added. We’ve added the `QLabel`, `QPushButton`, and `QSlider` to the `QVBoxLayout` using the `addWidget` method, and set the layout of the window to the `QVBoxLayout` using the setLayout method. This ensures that the widgets are arranged vertically in the window, and that they are resized and repositioned automatically when the window is resized.

Please note that the `QVBoxLayout` takes ownership of the widgets, so you don’t need to worry about deleting them. They will be deleted automatically when the `QVBoxLayout` is deleted.

## Horizontal Layout

---

If you want to arrange the widgets horizontally instead of vertically, you can use a `QHBoxLayout` instead of a `QVBoxLayout`.

```python
from PyQt6.QtWidgets import QApplication, QLabel, QWidget, QHBoxLayout 
from PyQt6.QtWidgets import QPushButton, QSlider
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Hello World')
        self.setGeometry(100, 100, 640, 480)  # x, y, width, height

        # Create a QHBoxLayout to manage the layout of the widgets
        layout = QHBoxLayout()

        # Create a QLabel to display the text
        self.label = QLabel('Hello World!', self)
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        # Set the font and size
        self.label.setFont(QFont('Cascadia Code', 24))

        # Create a QPushButton
        self.button = QPushButton('Change Text', self)
        # Connect the button's clicked signal to the change_text slot
        self.button.clicked.connect(self.change_text)
        # Set a fixed size for the button
        self.button.setFixedSize(100, 50)

        # Add the widgets to the layout
        layout.addWidget(self.label)
        layout.addWidget(self.button)
        # Set the layout of the window
        self.setLayout(layout)

    def change_text(self):
        # Change the text of the label when the button is clicked
        self.label.setText('You clicked the button!')

    def change_font_size(self, value):
        # Change the font size of the label when the slider value changes
        self.label.setFont(QFont('Cascadia Code', value))

app = QApplication([])
window = MainWindow()
window.show()
app.exec()
```

If you want to arrange the widgets in a grid, you can use a `QGridLayout`. If you want to arrange the widgets in a form (i.e., a two-column layout with labels on the left and fields on the right), you can use a `QFormLayout`.

If you want to create a custom layout, you can subclass `QLayout` and override its methods. If you want to add spacing between the widgets, you can use the `addSpacing` method of the `QVBoxLayout`.

For example, `layout.addSpacing(10)` adds a 10-pixel spacing. You can replace 10 with the number of pixels you want. Please note that the spacing is measured in pixels, so a spacing of 10 corresponds to a 10-pixel spacing. This is roughly equivalent to a 0.1-inch spacing on a display with a pixel density of 96 DPI (dots per inch), which is a common pixel density for desktop displays. However, the actual size might vary depending on the pixel density of your display.

## QML

QML, which stands for Qt Modeling Language, is a user interface markup language that is part of the Qt framework. It’s a declarative language, similar to CSS and JSON, designed for creating user interface-centric applications. QML allows designers and developers to describe their user interfaces in a JSON-like format with support for dynamic layouts, animations, and signal handling.

---

First create an `omg.qml` file.

```python
import QtQuick
import QtQuick.Controls

ApplicationWindow {
    visible: true
    width: 640
    height: 480
    title: "Hello World"

    Text {
        id: helloText
        text: "Hello, World!"
        anchors.centerIn: parent
        font.pixelSize: 24
    }
}
```

Next, create `qml.py` file.

```python
from PyQt6.QtCore import Qt, QUrl
from PyQt6.QtGui import QGuiApplication
from PyQt6.QtQml import QQmlApplicationEngine

if __name__ == "__main__":
    import sys

    # Create an instance of the application
    app = QGuiApplication(sys.argv)

    # Create a QML engine
    engine = QQmlApplicationEngine()

    # Define the QML file path
    qml_file_path = "./omg.qml"

    # Load the QML file
    engine.load(QUrl.fromLocalFile(qml_file_path))

    # Check if the engine loaded the QML file successfully
    if not engine.rootObjects():
        sys.exit(-1)

    # Execute the application
    sys.exit(app.exec())
```

When you run this script, a basic Hello World application should load.
