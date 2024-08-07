---
weight: 10
bookFlatSection: false
bookToC: false
title: "🐍 FurryTagger"
summary: "Loads `eva02-vit-large-448-8046`, applies it to a set of images in a specified directory, and write the model’s output tags to a text file for each image."
---

<!--markdownlint-disable MD025 -->

# FurryTagger

---

Applies a pre-trained model (`eva02-vit-large-448-8046`) to a set of images in a specified directory and writes the model’s output tags to a text file for each image. The script first loads the model and sets it to evaluation mode. It then defines image transformations, including resizing, tensor conversion, and normalization. The script also handles specific image formats, converting WebP images to PNG and replacing any alpha channels with black. It then applies the model to each image, calculates the probabilities of each tag, and writes the tags that exceed a certain threshold to a text file. The script also handles ignored tags and replaces certain tags with their counterparts.

```python
import os
import torch
from torchvision import transforms
from PIL import Image
import json
import re

# Set the threshold for tag selection
THRESHOLD = 0.3

# Define the directory containing the images and the path to the model
image_dir = r"./images"
model_path = r"./model.pth"

# Define the set of ignored tags
ignored_tags = {"grandfathered content"}

# Check if CUDA is available, else use CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the model and set it to evaluation mode
model = torch.load(model_path, map_location=device)
model = model.to(device)
model.eval()

# Define the image transformations
transform = transforms.Compose(
    [
        # Resize the images to 448x448
        transforms.Resize((448, 448)),
        # Convert the images to PyTorch tensors
        transforms.ToTensor(),
        # Normalize the images with the given mean and standard deviation
        transforms.Normalize(
            mean=[0.48145466, 0.4578275, 0.40821073],
            std=[0.26862954, 0.26130258, 0.27577711],
        ),
    ]
)

# Load the tags from the JSON file
with open("tags_8041.json", "r", encoding="utf8") as file:
    tags = json.load(file)
allowed_tags = sorted(tags)

# Add placeholders and explicitness tags to the list of allowed tags
allowed_tags.insert(0, "placeholder0")
allowed_tags.append("placeholder1")
allowed_tags.append("explicit")
allowed_tags.append("questionable")
allowed_tags.append("safe")

# Define the allowed image extensions
image_exts = [".jpg", ".jpeg", ".png"]

for filename in os.listdir(image_dir):
    # Check if the file is a WebP image
    if filename.endswith(".webp"):
        # Construct the input and output file paths
        input_path = os.path.join(image_dir, filename)
        output_path = os.path.join(image_dir, os.path.splitext(filename)[0] + ".png")

        # Open the WebP image and save it as a PNG
        image = Image.open(input_path)
        image.save(output_path, "PNG")
        print(f"Converted {filename} to {os.path.basename(output_path)}")

        # Delete the original WebP image
        os.remove(input_path)
        print(f"Deleted {filename}")

# Get the list of image files in the directory
image_files = [
    file
    for file in os.listdir(image_dir)
    if os.path.splitext(file)[1].lower() in image_exts
]

for image_filename in image_files:
    image_path = os.path.join(image_dir, image_filename)

    # Open the image
    img = Image.open(image_path)

    # If the image has an alpha channel, replace it with black
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        alpha = Image.new(
            "L", img.size, 0
        )  # Create alpha image with mode 'L' (8-bit grayscale)
        alpha = alpha.convert(img.mode)  # Convert alpha image to same mode as img
        img = Image.alpha_composite(alpha, img)

    # Convert the image to RGB
    img = img.convert("RGB")

    # Apply the transformations and move the tensor to the device
    tensor = transform(img).unsqueeze(0).to(device)

    # Make a forward pass through the model and get the output
    with torch.no_grad():
        out = model(tensor)

    # Apply the sigmoid function to the output to get probabilities
    probabilities = torch.sigmoid(out[0])

    # Get the indices of the tags with probabilities above the threshold
    indices = torch.where(probabilities > THRESHOLD)[0]
    values = probabilities[indices]

    # Sort the indices by the corresponding probabilities in descending order
    sorted_indices = torch.argsort(values, descending=True)

    # Get the tags corresponding to the sorted indices, excluding ignored tags and replacing underscores with spaces
    tags_to_write = [
        allowed_tags[indices[i]].replace("_", " ")
        for i in sorted_indices
        if allowed_tags[indices[i]] not in ignored_tags
        and allowed_tags[indices[i]] not in ("placeholder0", "placeholder1")
    ]

    # Replace 'safe', 'explicit', and 'questionable' with their 'rating_' counterparts
    tags_to_write = [
        tag.replace("safe", "rating_safe")
        .replace("explicit", "rating_explicit")
        .replace("questionable", "rating_questionable")
        for tag in tags_to_write
    ]

    # Escape unescaped parentheses in the tags
    tags_to_write_escaped = [
        re.sub(r"(?<!\\)(\(|\))", r"\\\1", tag) for tag in tags_to_write
    ]

    # Create a text file for each image with the filtered and escaped tags
    text_filename = os.path.splitext(image_filename)[0] + ".txt"
    text_path = os.path.join(image_dir, text_filename)
    with open(text_path, "w", encoding="utf8") as text_file:
        text_file.write(", ".join(tags_to_write_escaped))
```
