---
weight: 2
title: WTF is Machine Learning?
bookToC: false
type: docs
summary: "An introduction to machine learning and walkthrough of building a simple neural network using PyTorch to classify handwritten digits from the MNIST dataset, covering data loading, defining the network architecture, training, evaluation, and making predictions."
---

<!-- markdownlint-disable MD025 -->

# WTF is Machine Learning?

---

Machine Learning is a subset of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.

PyTorch is a popular machine learning library for Python, based on Torch, another machine learning library which is implemented in C with a wrapper in Lua. It has gained favor for its ease of use and syntactic simplicity, facilitating fast development. It’s also extremely versatile, with support for a wide variety of neural network architectures.

Here is a simple example of how to create a tensor (a multi-dimensional array) with PyTorch:

```python
import torch

# Create a 2x3 matrix filled with random floats
x = torch.rand(2, 3)
print(x)
```

## Your First Neural Net

---

### Loading the Data

PyTorch provides easy access to many datasets through torchvision.datasets. Here is how you can load the MNIST dataset:

```python
from torchvision import datasets, transforms

# Define a transform to normalize the data
transform = transforms.Compose([transforms.ToTensor(),
                                transforms.Normalize((0.5,), (0.5,))])

# Download and load the training data
trainset = datasets.MNIST('~/.pytorch/MNIST_data/', download=True, train=True, transform=transform)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=64, shuffle=True)
```

### Defining the Network Architecture

Next, we define our neural network architecture. For this example, we will use a simple feed-forward network with one hidden layer.

```python
from torch import nn

# Define the network architecture
model = nn.Sequential(nn.Linear(784, 128),
                      nn.ReLU(),
                      nn.Linear(128, 64),
                      nn.ReLU(),
                      nn.Linear(64, 10),
                      nn.LogSoftmax(dim=1))
```

### Training the Network

Now, we will train our network. We will use the negative log-likelihood loss and the SGD optimizer.

```python
from torch import optim

# Define the loss
criterion = nn.NLLLoss()

# Define the optimizer
optimizer = optim.SGD(model.parameters(), lr=0.003)

# Train the network
epochs = 5
for e in range(epochs):
    running_loss = 0
    for images, labels in trainloader:
        # Flatten images into a 784 long vector
        images = images.view(images.shape[0], -1)

        # Training pass
        optimizer.zero_grad()

        output = model(images)
        loss = criterion(output, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
    print(f"Training loss: {running_loss/len(trainloader)}")
```

### Evaluating the Network and Making Predictions

After training our neural network, it’s important to evaluate its performance and use it to make predictions. In this section, I will show you how to do that.
We can evaluate our network by testing it on the test data. We didn’t use this data when training the network, so it gives us a measure of how well our network generalizes to new data.

```python
# Download and load the test data
testset = datasets.MNIST('~/.pytorch/MNIST_data/', download=True, train=False, transform=transform)
testloader = torch.utils.data.DataLoader(testset, batch_size=64, shuffle=True)

correct = 0
total = 0
with torch.no_grad():
    for images, labels in testloader:
        images = images.view(images.shape[0], -1)
        outputs = model(images)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

print('Accuracy of the network on test images: %d %%' % (100 * correct / total))
```

### Making Predictions

Now that we have a trained network, we can use it to make predictions. Here is how you can predict the class of a single image:

```python
import matplotlib.pyplot as plt
import numpy as np

def imshow(image, ax=None, title=None, normalize=True):
    """Imshow for Tensor."""
    if ax is None:
        fig, ax = plt.subplots()
    image = image.numpy().transpose((1, 2, 0))

    if normalize:
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        image = std * image + mean
        image = np.clip(image, 0, 1)

    ax.imshow(image)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    ax.tick_params(axis='both', length=0)
    ax.set_xticklabels('')
    ax.set_yticklabels('')

    return ax

# Test out your network!
model.eval()

dataiter = iter(testloader)
images, labels = next(dataiter)
img = images[0]
# Convert 2D image to 1D vector
img = img.view(1, 784)

# Calculate the class probabilities (softmax) for img
with torch.no_grad():
    output = model.forward(img)

ps = torch.exp(output)

# Plot the image and probabilities
imshow(images[0], normalize=False)
print("Predicted Class: ", ps.max(dim=1)[1].item())
```

### The Whole Thing

```python
"""
This script is designed to train and evaluate a simple neural network on the MNIST dataset using PyTorch.
The MNIST dataset comprises 28x28 grayscale images of handwritten digits.
The script includes data preprocessing, model definition, training, and evaluation phases.
It also contains a function to display an image and the model's prediction for it.
"""

import matplotlib.pyplot as plt
import numpy as np
import torch
from torch import nn
from torch import optim
from torchvision import datasets, transforms

# Define a transform to normalize the data
transform = transforms.Compose(
    [transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))]
)

# Download and load the training data
trainset = datasets.MNIST(
    "~/.pytorch/MNIST_data/", download=True, train=True, transform=transform
)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=64, shuffle=True)

# Define the network architecture
model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Linear(64, 10),
    nn.LogSoftmax(dim=1),
)

# Define the loss
criterion = nn.NLLLoss()

# Define the optimizer
optimizer = optim.SGD(model.parameters(), lr=0.003)

# Train the network
epochs = 5
for e in range(epochs):
    running_loss = 0
    for images, labels in trainloader:
        # Flatten images into a 784 long vector
        images = images.view(images.shape[0], -1)

        # Training pass
        optimizer.zero_grad()

        output = model(images)
        loss = criterion(output, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
    print(f"Training loss: {running_loss/len(trainloader)}")

# Download and load the test data
testset = datasets.MNIST(
    "~/.pytorch/MNIST_data/", download=True, train=False, transform=transform
)
testloader = torch.utils.data.DataLoader(testset, batch_size=64, shuffle=True)

correct = 0
total = 0
with torch.no_grad():
    for images, labels in testloader:
        images = images.view(images.shape[0], -1)
        outputs = model(images)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

print("Accuracy of the network on test images: %d %%" % (100 * correct / total))

def imshow(image, ax=None, title=None, normalize=True):
    """
    Display a PyTorch Tensor as an image.

    Parameters:
    - image (Tensor): The image Tensor to be displayed.
    - ax (matplotlib.axes.Axes, optional): The axes on which to plot the image. If None, a new figure and axes are created.
    - title (str, optional): The title of the plot.
    - normalize (bool, optional): Whether to normalize the image for display.

    Returns:
    - ax (matplotlib.axes.Axes): The axes with the image plotted.
    """
    if ax is None:
        fig, ax = plt.subplots()
    image = image.numpy().transpose((1, 2, 0))

    if normalize:
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        image = std * image + mean
        image = np.clip(image, 0, 1)

    ax.imshow(image)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_visible(False)
    ax.spines["bottom"].set_visible(False)
    ax.tick_params(axis="both", length=0)
    ax.set_xticklabels("")
    ax.set_yticklabels("")

    return ax

# Test out your network!
model.eval()

dataiter = iter(testloader)
images, labels = next(dataiter)
img = images[0]
# Convert 2D image to 1D vector
img = img.view(1, 784)

# Calculate the class probabilities (softmax) for img
with torch.no_grad():
    output = model.forward(img)

ps = torch.exp(output)

# Plot the image and probabilities
imshow(images[0], normalize=False)
print("Predicted Class: ", ps.max(dim=1)[1].item())
```
