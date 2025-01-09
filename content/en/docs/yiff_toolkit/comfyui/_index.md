---
weight: 2
bookFlatSection: false
bookToC: true
title: "The ComfyUI Bible"
summary: "A comprehensive guide to using ComfyUI, covering everything from basic node workflows to advanced techniques for AI image generation."
aliases:
  - /docs/yiff_toolkit/comfyui/
  - /docs/yiff_toolkit/comfyui
  - /en/docs/yiff_toolkit/comfyui/
  - /en/docs/yiff_toolkit/comfyui
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# The ComfyUI Bible

---

## Installing ComfyUI

---

If you need help installing ComfyUI, you didn't come to the right place. If you are using Windows, you can use the [prebuilt](https://docs.comfy.org/get_started/pre_package) package, or you can install it [manually](https://docs.comfy.org/get_started/manual_install) otherwise.

{{% details "Requirements for running the code examples on this page." %}}

To run the supplied visualization codes in this document, you'll need the following Python packages:

```bash
torchvision
numpy
Pillow
opencv-python
diffusers
```

Additionally, you'll need FFmpeg installed on your system for the video conversion. The code assumes FFmpeg is available in your system PATH.

{{% /details %}}

## Understanding Diffusion Models

---

Before diving into ComfyUI's practical aspects, let's understand the mathematical foundations of diffusion models that power modern AI image generation. You can [skip](#latents) most, but not all of the intimidating equations, and jump to the practical part, but your brain *will* thank you for it!

### The Diffusion Process

Diffusion models work through a process that's similar to gradually adding static noise to a TV signal, and then learning to remove that noise to recover the original picture.

#### Forward Diffusion

The forward diffusion process systematically transforms a clear image into pure random noise through a series of precise mathematical steps. Here's how it works:

1. We start with an original image $x_0$ containing clear, detailed information
2. At each timestep $t$, we apply a carefully controlled amount of Gaussian noise
3. The noise intensity follows a schedule $\beta_t$ that gradually increases over time
4. Each step slightly {{<zalgo strength=15 >}}corrupts{{</zalgo>}} the previous image state according to our diffusion equation
5. After $T$ timesteps, we reach $x_T$ which is effectively pure Gaussian noise

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/forward_diffusion.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

{{% details "Click to show code used to generate the video."  %}}

```python
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import torch
import torchvision.transforms as transforms
from pathlib import Path
import argparse
import cv2
import os

def load_and_preprocess_image(image_path):
    """Load and preprocess an image to tensor."""
    image = Image.open(image_path).convert('RGB')
    transform = transforms.Compose([
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0)  # Add batch dimension

def forward_diffusion_step(x_0, t, betas):
    """
    Perform forward diffusion to get noisy image at timestep t.
    x_0: Original image
    t: Current timestep
    betas: Complete noise schedule
    """
    # Calculate alphas and cumulative products
    alphas = 1 - betas
    alphas_cumprod = torch.cumprod(alphas, dim=0)
    alpha_t = alphas_cumprod[t]
    
    # Generate random noise
    noise = torch.randn_like(x_0)
    
    # Apply the forward diffusion equation
    # x_t = √(ᾱt)x_0 + √(1-ᾱt)ε
    x_t = torch.sqrt(alpha_t) * x_0 + torch.sqrt(1 - alpha_t) * noise
    
    return x_t, noise

def create_animation(images, betas, output_path, fps=30):
    """Create an MP4 animation from a list of images with timestep and beta overlay."""
    # Convert first tensor to numpy to get dimensions
    first_frame = images[0].squeeze().permute(1, 2, 0).numpy()
    first_frame = np.clip(first_frame, 0, 1)
    first_frame = (first_frame * 255).astype(np.uint8)
    height, width = first_frame.shape[:2]
    
    # Create a larger canvas to accommodate text above the image
    canvas_height = height + 60  # Add 60 pixels for text
    
    # Initialize video writer with higher quality settings
    temp_output = str(output_path).replace('.mp4', '_temp.avi')  # Use AVI for temp file
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')  # Use MJPG codec
    video = cv2.VideoWriter(temp_output, fourcc, fps, (width, canvas_height), isColor=True)
    
    if not video.isOpened():
        raise RuntimeError("Failed to create video writer")
    
    # Calculate alphas and cumulative products for overlay text
    alphas = 1 - betas
    alphas_cumprod = torch.cumprod(alphas, dim=0)
    
    # Process each frame
    for i, img in enumerate(images):
        # Convert tensor to numpy array
        frame = img.squeeze().permute(1, 2, 0).numpy()
        frame = np.clip(frame, 0, 1)
        frame = (frame * 255).astype(np.uint8)
        
        # Create PIL Image for text rendering
        canvas = Image.new('RGB', (width, canvas_height), 'white')
        # Convert frame to PIL Image and paste it onto canvas
        frame_pil = Image.fromarray(frame)
        canvas.paste(frame_pil, (0, 60))
        
        # Add text using PIL
        draw = ImageDraw.Draw(canvas)
        try:
            font = ImageFont.truetype("segoeui.ttf", 32)  # Try Segoe UI first (Windows)
        except:
            try:
                font = ImageFont.truetype("DejaVuSans.ttf", 32)  # Try DejaVu Sans (Linux)
            except:
                try:
                    font = ImageFont.truetype("Arial Unicode.ttf", 32)  # Try Arial Unicode
                except:
                    font = ImageFont.load_default()
            
        if i == 0:
            text = "Original Image"
        else:
            # Show both beta and cumulative alpha
            text = f't = {i}    β = {betas[i-1]:.4f}    ᾱ = {alphas_cumprod[i-1]:.4f}'
        
        # Get text size for centering
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = (width - text_width) // 2
        
        # Draw text
        draw.text((text_x, 20), text, fill='black', font=font)
        
        # Convert to numpy array and BGR for OpenCV
        canvas_np = np.array(canvas)
        canvas_cv = cv2.cvtColor(canvas_np, cv2.COLOR_RGB2BGR)
        video.write(canvas_cv)
    
    # Release video writer
    video.release()
    
    # Convert to high-quality MP4
    ffmpeg_cmd = (
        f'ffmpeg -y -i "{temp_output}" '
        f'-c:v libx264 -preset veryslow '
        f'-crf 15 '
        f'-x264-params "aq-mode=3:aq-strength=0.8" '
        f'-b:v 30M -maxrate 40M -bufsize 60M '
        f'-pix_fmt yuv420p '
        f'-movflags +faststart '
        f'-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 '
        f'"{output_path}"'
    )
    
    ret = os.system(ffmpeg_cmd)
    if ret != 0:
        raise RuntimeError(f"FFmpeg conversion failed with return code {ret}")
    
    if os.path.exists(temp_output):
        os.remove(temp_output)

def visualize_diffusion_process(image_path, num_steps=10, beta_min=1e-4, beta_max=0.02, fps=30):
    """
    Visualize the forward diffusion process on an image.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load and preprocess image
    x_0 = load_and_preprocess_image(image_path).to(device)
    
    # Create linear noise schedule
    betas = torch.linspace(beta_min, beta_max, num_steps)
    
    # Initialize lists to store images
    images = [x_0.cpu()]
    
    # Perform forward diffusion for each timestep
    for t in range(num_steps):
        x_t, noise = forward_diffusion_step(x_0, t, betas)
        images.append(x_t.cpu())
    
    # Create output directory
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create animation
    create_animation(images, betas, output_dir / 'forward_diffusion.mp4', fps=fps)

def main():
    parser = argparse.ArgumentParser(description='Visualize the forward diffusion process')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--steps', type=int, default=10, help='Number of diffusion steps')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second for the animation')
    args = parser.parse_args()
    
    visualize_diffusion_process(args.image, num_steps=args.steps, fps=args.fps)

if __name__ == '__main__':
    main()
```

{{% /details %}}

This demonstrates pixel-space diffusion, just to give you an idea of what's happening.

To actually see the diffusion process in latent space, first we have to learn about latent space..

##### Latent Space

it's important to understand that AI models don't work directly with regular images. Instead, they work with something called "latents" - a compressed representation of images that's more efficient for the AI to process.

Think of them like a blueprint of an image:

- A regular image stores exact colors for each pixel (like a detailed painting)
- A latent stores abstract patterns and features (like an architect's blueprint)

Here is a video showing the forward diffusion process in latent space:

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/latent_forward_diffusion.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

{{% details "Click to show code used to generate the video."  %}}

```python
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import torch
import torchvision.transforms as transforms
from pathlib import Path
import argparse
import cv2
import os
from diffusers import AutoencoderKL

def load_and_preprocess_image(image_path):
    """Load and preprocess an image to tensor."""
    image = Image.open(image_path).convert('RGB')
    transform = transforms.Compose([
        transforms.Resize((512, 512)),  # VAE typically expects 512x512
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0)  # Add batch dimension

def encode_to_latents(vae, image):
    """Encode image to latent space using VAE."""
    with torch.no_grad():
        # Updated to handle newer VAE API
        latent_dist = vae.encode(image)
        if hasattr(latent_dist, 'latent_dist'):
            latents = latent_dist.latent_dist.sample()
            latents = latents * vae.config.scaling_factor
        else:
            # For newer versions that return the distribution directly
            latents = latent_dist.sample()
            latents = latents * 0.18215  # Standard SD scaling factor
    return latents

def decode_from_latents(vae, latents):
    """Decode latents back to image space using VAE."""
    with torch.no_grad():
        # Handle both older and newer VAE versions
        if hasattr(vae.config, 'scaling_factor'):
            latents = latents / vae.config.scaling_factor
        else:
            latents = latents / 0.18215
        image = vae.decode(latents).sample
    return image

def forward_diffusion_step(z_0, t, betas):
    """
    Perform forward diffusion in latent space.
    z_0: Original latent representation
    t: Current timestep
    betas: Complete noise schedule
    """
    # Calculate alphas and cumulative products
    alphas = 1 - betas
    alphas_cumprod = torch.cumprod(alphas, dim=0)
    alpha_t = alphas_cumprod[t]
    
    # Generate random noise in latent space
    noise = torch.randn_like(z_0)
    
    # Apply the forward diffusion equation in latent space
    # z_t = √(ᾱt)z_0 + √(1-ᾱt)ε
    z_t = torch.sqrt(alpha_t) * z_0 + torch.sqrt(1 - alpha_t) * noise
    
    return z_t, noise

def create_animation(images, betas, output_path, fps=30):
    """Create an MP4 animation from a list of images with timestep and beta overlay."""
    # Convert first tensor to numpy to get dimensions
    first_frame = images[0].squeeze().permute(1, 2, 0).numpy()
    first_frame = np.clip(first_frame, 0, 1)
    first_frame = (first_frame * 255).astype(np.uint8)
    height, width = first_frame.shape[:2]
    
    # Create a larger canvas to accommodate text above the image
    canvas_height = height + 60  # Add 60 pixels for text
    
    # Initialize video writer with higher quality settings
    temp_output = str(output_path).replace('.mp4', '_temp.avi')
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    video = cv2.VideoWriter(temp_output, fourcc, fps, (width, canvas_height), isColor=True)
    
    if not video.isOpened():
        raise RuntimeError("Failed to create video writer")
    
    # Calculate alphas and cumulative products for overlay text
    alphas = 1 - betas
    alphas_cumprod = torch.cumprod(alphas, dim=0)
    
    # Process each frame
    for i, img in enumerate(images):
        # Convert tensor to numpy array
        frame = img.squeeze().permute(1, 2, 0).numpy()
        frame = np.clip(frame, 0, 1)
        frame = (frame * 255).astype(np.uint8)
        
        # Create PIL Image for text rendering
        canvas = Image.new('RGB', (width, canvas_height), 'white')
        frame_pil = Image.fromarray(frame)
        canvas.paste(frame_pil, (0, 60))
        
        # Add text using PIL
        draw = ImageDraw.Draw(canvas)
        try:
            font = ImageFont.truetype("segoeui.ttf", 32)  # Try Segoe UI first (Windows)
        except:
            try:
                font = ImageFont.truetype("DejaVuSans.ttf", 32)  # Try DejaVu Sans (Linux)
            except:
                try:
                    font = ImageFont.truetype("Arial Unicode.ttf", 32)  # Try Arial Unicode
                except:
                    font = ImageFont.load_default()
        
        if i == 0:
            text = "Original Image"
        else:
            # Show both beta and cumulative alpha
            text = f't = {i}    β = {betas[i-1]:.4f}    ᾱ = {alphas_cumprod[i-1]:.4f}'
        
        # Get text size for centering
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = (width - text_width) // 2
        
        # Draw text
        draw.text((text_x, 20), text, fill='black', font=font)
        
        # Convert to numpy array and BGR for OpenCV
        canvas_np = np.array(canvas)
        canvas_cv = cv2.cvtColor(canvas_np, cv2.COLOR_RGB2BGR)
        video.write(canvas_cv)
    
    # Release video writer
    video.release()
    
    # Convert to high-quality MP4
    ffmpeg_cmd = (
        f'ffmpeg -y -i "{temp_output}" '
        f'-c:v libx264 -preset veryslow '
        f'-crf 15 '
        f'-x264-params "aq-mode=3:aq-strength=0.8" '
        f'-b:v 30M -maxrate 40M -bufsize 60M '
        f'-pix_fmt yuv420p '
        f'-movflags +faststart '
        f'-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 '
        f'"{output_path}"'
    )
    
    ret = os.system(ffmpeg_cmd)
    if ret != 0:
        raise RuntimeError(f"FFmpeg conversion failed with return code {ret}")
    
    if os.path.exists(temp_output):
        os.remove(temp_output)

def visualize_latent_diffusion_process(image_path, vae_model="stabilityai/sd-vae-ft-mse", num_steps=10, beta_min=1e-4, beta_max=0.02, fps=30):
    """
    Visualize the forward diffusion process in latent space.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load VAE model
    vae = AutoencoderKL.from_pretrained(vae_model, torch_dtype=torch.float32).to(device)
    
    # Load and preprocess image
    x_0 = load_and_preprocess_image(image_path).to(device)
    
    # Encode image to latent space
    z_0 = encode_to_latents(vae, x_0)
    
    # Create linear noise schedule
    betas = torch.linspace(beta_min, beta_max, num_steps)
    
    # Initialize lists to store images
    images = [x_0.cpu()]  # Start with original image
    
    # Perform forward diffusion in latent space for each timestep
    for t in range(num_steps):
        z_t, noise = forward_diffusion_step(z_0, t, betas)
        # Decode latents back to image space for visualization
        x_t = decode_from_latents(vae, z_t)
        images.append(x_t.cpu())
    
    # Create output directory
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create animation
    create_animation(images, betas, output_dir / 'latent_forward_diffusion.mp4', fps=fps)

def main():
    parser = argparse.ArgumentParser(description='Visualize the forward diffusion process in latent space')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--vae', type=str, default="stabilityai/sd-vae-ft-mse", help='VAE model to use')
    parser.add_argument('--steps', type=int, default=10, help='Number of diffusion steps')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second for the animation')
    args = parser.parse_args()
    
    visualize_latent_diffusion_process(
        args.image,
        vae_model=args.vae,
        num_steps=args.steps,
        fps=args.fps
    )

if __name__ == '__main__':
    main() 
```

{{% /details %}}

The main differences you'll notice to pixel-space diffusion are:

- The noise patterns will look more structured due to the VAE's learned latent space.
- The degradation process might preserve more semantic information.

##### The Mathematics

The process of adding noise can be described mathematically with the following equation:

$$q(x_t|x_{t-1}) = \mathcal{N}(x_t; \sqrt{1-\beta_t}x_{t-1}, \beta_tI)$$

Let's break down each component of this equation:

1. **Core Variables**
   - $x_t$ - The image state at the current timestep
   - $x_{t-1}$ - The image state at the previous timestep
   - $\beta_t$ - The noise schedule parameter that controls noise intensity
   - $I$ - The identity matrix (ensures noise is applied uniformly)

2. **Distribution Components**
   - $q(x_t|x_{t-1})$ - The probability distribution of the current state given the previous state
   - $\mathcal{N}$ - Denotes a normal (Gaussian) distribution
   - $\sqrt{1-\beta_t}x_{t-1}$ - The mean of the distribution
   - $\beta_tI$ - The variance of the distribution

The equation describes a carefully controlled process of gradually corrupting an image with noise. At each timestep:

- The previous image is scaled down by $\sqrt{1-\beta_t}$, which decreases as more noise is added
- Random Gaussian noise with variance $\beta_tI$ is added to this scaled image
- The process creates a smooth transition from the original image to pure noise
- The noise schedule $\beta_t$ ensures this happens in a controlled, predictable way

This mathematical foundation is crucial because it allows the model to learn the reverse process - taking a noisy image and progressively removing noise to generate the final output.

##### Alpha Bar

Alpha bar ($\bar{\alpha}$) is a crucial concept in diffusion models that represents the cumulative product of the signal scaling factors. Here's how it works:

1. At each timestep $t$, we have:
   - $\beta_t$ (beta): the noise schedule parameter
   - $\alpha_t$ (alpha): $1 - \beta_t$, the signal scaling factor

2. Alpha bar is then defined as:
   $$\bar{\alpha}_t = \prod_{i=1}^t \alpha_i$$

This means:

- $\bar{\alpha}$ starts at 1 (no noise) and decreases over time
- It represents how much of the original signal remains at time $t$
- At the end of diffusion, $\bar{\alpha}$ approaches 0 (pure noise)

The complete forward process can be written in terms of $\bar{\alpha}$:
$$x_t = \sqrt{\bar{\alpha}_t}x_0 + \sqrt{1-\bar{\alpha}_t}\epsilon$$

where:

- $x_t$ is the noisy image at time t
- $x_0$ is the original image
- $\epsilon$ is random Gaussian noise
- $\sqrt{\bar{\alpha}_t}$ controls how much original signal remains
- $\sqrt{1-\bar{\alpha}_t}$ controls how much noise is added

This formulation proves to be particularly powerful for several key reasons. First, it enables us to directly sample any timestep from the original image $x_0$ without having to calculate all intermediate steps. Additionally, it provides precise visibility into the ratio between signal and noise at each point in the process. Finally, this formulation makes the reverse process mathematically tractable, which is essential for training the model to denoise images effectively.

The process serves as the foundation for training our AI models. By understanding exactly how images are corrupted, we can teach the model to reverse this corruption during the generation process.

#### Reverse Diffusion

Something cool happens when the AI learns to reverse this process. It learns to:

1. Start with pure noise
2. Gradually remove the noise
3. Eventually recover a clear image

This is what happens every time you generate an image with Stable Diffusion or similar AI models. The model has learned to take random noise and progressively "denoise" it into a clear image that matches your prompt.

#### Latents

In ComfyUI, you'll encounter latents in three main ways:

##### Empty Latent Image

When you want to generate an image from scratch, referred to as text-to-image (t2i).

- Creates a blank canvas of random noise in latent space
- Size: 8x smaller than your target image (e.g., 512x512 image = 64x64 latents)
- This is your starting point for pure text-to-image generation

##### Load Image → VAE Encode

When you want to modify an existing image, referred to as image-to-image (i2i).

- Load Image: Brings your regular image into ComfyUI
- VAE Encode: Converts it into latents.
- This is your starting point for image-to-image generation

1. **VAE Decode**: The final step in any workflow
   - Converts latents back into a regular image
   - Like turning the blueprint back into a detailed painting
   - This is how you get your final output image

The beauty of working with latents is that they're much more efficient:

- Takes less memory (8x smaller than regular images)
- Easier for the AI to manipulate
- Contains the essential "structure" of images without unnecessary details

**The KSampler Node**
The `KSampler` node in ComfyUI implements the reverse diffusion process. It takes the noisy latent $x_T$ and progressively denoises it using the model's predictions. The node's parameters directly control this process:

1. **Steps**: Controls the number of $t$ steps in the reverse process
   - More steps = finer granularity but slower
   - Mathematically: divides $[0,T]$ into this many intervals

2. **CFG Scale**: Implements Classifier-Free Guidance
   $$\epsilon_\text{CFG} = \epsilon_\theta(x_t, t) + w[\epsilon_\theta(x_t, t, c) - \epsilon_\theta(x_t, t)]$$
   - Higher values follow the prompt more strictly
   - Lower values (1-4) allow more creative freedom

3. **Scheduler**: Controls $\beta_t$ schedule
   - `Karras`: $\beta_t$ follows the schedule from [Karras et al.](https://arxiv.org/abs/2206.00364)
   $$\sigma_i = \sigma_\text{min}^{1-f(i)} \sigma_\text{max}^{f(i)}$$
   - `Normal`: Linear schedule
   $$\beta_t = \beta_\text{min} + t(\beta_\text{max} - \beta_\text{min})$$

4. **Sampler**: Determines how to use model predictions
   - `Euler`: Simple first-order method
   $$x_{t-1} = x_t - \eta \nabla \log p(x_t)$$
   - `DPM++ 2M`: Second-order method with momentum
   $$v_t = \mu v_{t-1} + \epsilon_t$$
   $$x_{t-1} = x_t + \eta v_t$$

5. **Seed**: Controls the initial noise
   - Same seed + same parameters = reproducible results
   - Mathematically: initializes the random state for $x_T$

**The Noise Node**
The optional `Noise` node lets you directly manipulate the initial noise $x_T$. It implements:

$$x_T = \mathcal{N}(0, I)$$

You can:

- Set a specific seed for reproducibility
- Control noise dimensions (width, height)
- Mix different noise patterns

### V-Prediction and Angular Parameterization

The core of v-prediction is representing the diffusion process as a rotation in a 2D space.

```python
# Calculate phi (angle) from alpha and sigma
phi_t = torch.arctan2(sigma_t, alpha_t)
```

This calculates the angle $\phi_t$ that represents how far along we are in the diffusion process.

- At $phi_t = 0$, we have the original image
- At $phi_t = \pi/2$, we have pure noise
- The angle smoothly interpolates between these states

While the standard formulation predicts noise $\epsilon$, an alternative approach called v-prediction parameterizes the diffusion process in terms of velocity. In this formulation, we define an angle $\phi_t = \text{arctan}(\sigma_t/\alpha_t)$ that represents the progression through the diffusion process. For a variance-preserving process, we have:

$$\alpha_\phi = \cos(\phi), \quad \sigma_\phi = \sin(\phi)$$

The noisy image at angle $\phi$ can then be expressed as:

$$\mathbf{z}_\phi = \cos(\phi)\mathbf{x} + \sin(\phi)\epsilon$$

The key insight is to define a velocity vector:

$$\mathbf{v}_\phi = \frac{d\mathbf{z}_\phi}{d\phi} = \cos(\phi)\epsilon - \sin(\phi)\mathbf{x}$$

This velocity represents the direction of change in the noisy image as we move through the diffusion process. The model predicts this velocity instead of the noise:

$$\hat{\mathbf{v}}_\theta(\mathbf{z}_\phi) = \cos(\phi)\hat{\epsilon}_\theta(\mathbf{z}_\phi) - \sin(\phi)\hat{\mathbf{x}}_\theta(\mathbf{z}_\phi)$$

The sampling process then becomes a rotation in the $(\mathbf{z}_\phi, \mathbf{v}_\phi)$ plane:

$$\mathbf{z}_{\phi_{t-\delta}} = \cos(\delta)\mathbf{z}_{\phi_t} - \sin(\delta)\hat{\mathbf{v}}_\theta(\mathbf{z}_{\phi_t})$$

This formulation offers several key advantages: it provides a more natural parameterization of the diffusion trajectory, simplifies the sampling process into a straightforward rotation operation, and can potentially lead to improved sample quality in certain scenarios.

**Implementation in ComfyUI: V-Prediction Samplers**
ComfyUI implements v-prediction through several specialized samplers in the `KSampler` node:

1. **DPM++ 2M Karras**
   - Most advanced v-prediction implementation
   - Uses momentum-based updates
   - Best for detailed, high-quality images
   - Recommended settings:
     - Steps: 25-30
     - CFG: 7-8
     - Scheduler: Karras

2. **DPM++ SDE Karras**
   - Stochastic differential equation variant
   - Good balance of speed and quality
   - Recommended settings:
     - Steps: 20-25
     - CFG: 7-8
     - Scheduler: Karras

3. **UniPC**
   - Unified predictor-corrector method
   - Fastest v-prediction sampler
   - Great for quick iterations
   - Recommended settings:
     - Steps: 20-23
     - CFG: 7-8
     - Scheduler: Karras

**Advanced V-Prediction Control**
For more control over the v-prediction process, you can use:

1. **Advanced KSampler**
   - Exposes additional v-prediction parameters
   - Allows fine-tuning of the angle calculations
   - Parameters:

     ```json
     start_at_step: 0.0
     end_at_step: 1.0
     add_noise: true
     return_with_leftover_noise: false
     ```

2. **Sampling Refinement**
   The velocity prediction can be refined using:
   - `VAEEncode` → `KSampler` → `VAEDecode` chain
   - Multiple sampling passes with decreasing step counts
   - Example workflow:

     ```json
     First Pass: 30 steps, CFG 8
     Refine: 15 steps, CFG 4
     Final: 10 steps, CFG 2
     ```

### Conditioning and Control

Text-to-image generation involves conditioning the diffusion process on text embeddings. The mathematical formulation becomes:

$$p_\theta(x_{t-1}|x_t, \mathbf{c}) = \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t, \mathbf{c}), \Sigma_\theta(x_t, t, \mathbf{c}))$$

where $\mathbf{c}$ represents the conditioning information. In the context of text-to-image generation, this conditioning vector typically comes from CLIP (Contrastive Language-Image Pre-training), a neural network developed by OpenAI that creates a shared embedding space for both text and images.

#### Understanding CLIP and Conditioning

CLIP (Contrastive Language-Image Pre-training) is a neural network trained to learn the relationship between images and text through contrastive learning. It consists of two encoders: one for text and one for images. During training, CLIP learns to maximize the cosine similarity between matching image-text pairs while minimizing it for non-matching pairs. This is achieved through a contrastive loss function operating on batches of N image-text pairs, creating an N×N similarity matrix.

The text encoder first tokenizes the input text into a sequence of tokens, then processes these through a transformer to produce a sequence of token embeddings $\text{CLIP}_\text{text}(\text{text}) \rightarrow [\mathbf{z}_1, ..., \mathbf{z}_n] \in \mathbb{R}^{n \times d}$, where $n$ is the sequence length and $d$ is the embedding dimension. Unlike traditional transformer architectures that use pooling layers, CLIP simply takes the final token's embedding (corresponding to the [EOS] token) after layer normalization. The image encoder maps images to a similar high-dimensional representation $\text{CLIP}_\text{image}(\text{image}) \rightarrow \mathbf{z} \in \mathbb{R}^d$.

**Implementation in ComfyUI: The CLIPTextEncode Node**
ComfyUI exposes this CLIP architecture through the `CLIPTextEncode` node. When you input a prompt, the node:

1. Tokenizes your text into subwords using CLIP's tokenizer
2. Processes tokens through the transformer layers
3. Produces the conditioning vectors that guide the diffusion process

The node comes in two variants that expose different levels of control over the embedding process:

1. **Basic CLIPTextEncode**
   - Implements the standard CLIP text encoding: $\text{CLIP}_\text{text}(\text{text})$
   - Single text input field for the entire prompt
   - Handles the full sequence of tokens as one unit
   - Example usage:

     ```json
     prompt: "a beautiful sunset over mountains, high quality"
     negative prompt: "blurry, low quality, distorted"
     ```

2. **CLIPTextEncode (Advanced)**
   - Extends the basic encoding with token-level control
   - Supports weight adjustment per token: (word:1.2)
   - Mathematical operation on token embeddings:
     $$z_\text{weighted} = \sum_i w_i \cdot z_i$$
     where $w_i$ are the per-token weights

The sequence of token embeddings plays a crucial role in steering the diffusion process. Through cross-attention layers in the U-Net, the model can attend to different parts of the text representation as it generates the image. This mechanism enables the model to understand and incorporate multiple concepts and their relationships from the prompt.

Consider what happens when you input a prompt like "a red cat sitting on a blue chair". The text is first split into tokens, and each token (or subword) gets its own embedding. The model can then attend differently to "red", "cat", "blue", and "chair" during different stages of the generation process, allowing it to properly place and render each concept in the final image.

**Advanced CLIP Operations: The ConditioningCombine Node**
To support complex prompting scenarios, ComfyUI provides the `ConditioningCombine` node that implements mathematical operations on conditioning vectors:

1. **Concatenation Mode**
   $$c_\text{combined} = [c_1; c_2]$$
   - Preserves both conditions fully
   - Useful for regional prompting

2. **Average Mode**
   $$c_\text{combined} = \alpha c_1 + (1-\alpha) c_2$$
   - Blends multiple conditions
   - $\alpha$ controls the mixing ratio

**Image-Based Conditioning: The CLIPVisionEncode Node**
This node implements the image encoder part of CLIP:

$$\text{CLIP}_\text{image}(\text{image}) \rightarrow \mathbf{z} \in \mathbb{R}^d$$

The complete pipeline for image-guided generation becomes:

$$z_\text{image} = \text{CLIP}_\text{image}(\text{image})$$
$$z_\text{text} = \text{CLIP}_\text{text}(\text{prompt})$$
$$c_\text{combined} = \text{Combine}(z_\text{text}, z_\text{image})$$

Beyond simple text conditioning, modern diffusion models support various forms of guidance. Image conditioning (img2img) allows existing images to influence the generation process. Control signals through ControlNet provide fine-grained control over structural elements. Style vectors extracted from reference images can guide aesthetic qualities, while structural guidance through depth maps or pose estimation can enforce specific spatial arrangements. Each of these conditioning methods can provide additional context to guide the generation process.

### Unconditional vs Conditional Generation and CFG

The diffusion model can actually generate images in two modes: unconditional, where no guidance is provided ($\mathbf{c} = \emptyset$), and conditional, where we use our CLIP embedding or other conditioning signals. Classifier-Free Guidance (CFG) leverages both of these modes to enhance the generation quality.

The CFG process works by predicting two denoising directions at each timestep:

1. An unconditional prediction: $\epsilon_\theta(x_t, t)$
2. A conditional prediction: $\epsilon_\theta(x_t, t, \mathbf{c})$

These predictions are then combined using a guidance scale $w$ (often called the CFG scale):

$$\epsilon_\text{CFG} = \epsilon_\theta(x_t, t) + w[\epsilon_\theta(x_t, t, \mathbf{c}) - \epsilon_\theta(x_t, t)]$$

The guidance scale $w$ controls how strongly the conditioning influences the generation. A higher value of $w$ (typically 7-12) results in images that more closely match the prompt but may be less realistic, while lower values (1-4) produce more natural images that follow the prompt more loosely. When $w = 0$, we get purely unconditional generation, and as $w \to \infty$, the model becomes increasingly deterministic in following the conditioning.

This is why in ComfyUI, you'll often see a "CFG Scale" parameter in sampling nodes. It directly controls this  weighting between unconditional and conditional predictions, allowing you to balance prompt adherence against image quality.

#### Implementation in ComfyUI: CFG Control

1. **Basic CFG Control**
   The `KSampler` node provides direct control over CFG through its parameters:
   - CFG Scale: The $w$ parameter in the equation
   - Recommended ranges:

     ```json
     Photorealistic: 4-7
     Artistic: 7-12
     Strong stylization: 12-15
     ```

2. **Advanced CFG Techniques**
   ComfyUI offers several nodes for fine-tuning CFG behavior:

   a) **CFGScheduler Node**
   - Dynamically adjusts CFG during sampling
   - Mathematical operation:
     $$w_t = w_\text{start} + t(w_\text{end} - w_\text{start})$$
   - Example schedule:

     ```json
     Start CFG: 12 (for initial structure)
     End CFG: 7 (for natural details)
     ```

   b) **CFGDenoiser Node**
   - Provides manual control over the denoising process
   - Allows separate CFG for different regions
   - Useful for:
     - Regional prompt strength
     - Selective detail enhancement
     - Balancing multiple conditions

3. **Practical CFG Workflows**

   a) **Basic Text-to-Image**

   ```json
   CLIPTextEncode [positive] → KSampler (CFG: 7)
   CLIPTextEncode [negative] → KSampler
   ```

   b) **Dynamic CFG**

   ```json
   CLIPTextEncode → CFGScheduler → KSampler
   Parameters:
   - Start: 12 (0-25% steps)
   - Middle: 8 (25-75% steps)
   - End: 6 (75-100% steps)
   ```

   c) **Regional CFG**

   ```json
   CLIPTextEncode → ConditioningSetArea → CFGDenoiser
   Multiple regions with different CFG values:
   - Focus area: CFG 12
   - Background: CFG 7
   ```

4. **CFG Troubleshooting**
   Common issues and solutions:
   - Over-saturation: Reduce CFG or use scheduling
   - Loss of details: Increase CFG in final steps
   - Unrealistic results: Lower CFG, especially in early steps
   - Inconsistent style: Use CFG scheduling to balance

## Introduction to ComfyUI

---

ComfyUI provides a visual interface to interact with these mathematical processes through a node-based workflow. If

## Core Components

---

### Models and Their Mathematical Foundations

Before starting with ComfyUI, you need to understand the different types of models:

1. **Base Models (Checkpoints)**
   - Stored in `models\checkpoints`
   - Implement the full diffusion process: $p_\theta(x_{0:T})$
   - Examples: CompassMix XL Lightning, Pony Diffusion V6 XL

   **The Load Checkpoint Node**
   The `Load Checkpoint` node in ComfyUI is your interface to the base diffusion model. It loads the model weights ($\theta$) and initializes the U-Net architecture that performs the reverse diffusion process. When you connect this node, you're essentially preparing the neural network that will implement:

   $$p_\theta(x_{t-1}|x_t) = \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t), \Sigma_\theta(x_t, t))$$

   The node outputs three crucial components:
   - `MODEL`: The U-Net that predicts noise or velocity
   - `CLIP`: The text encoder for conditioning
   - `VAE`: The encoder/decoder for image latents

   These outputs correspond to the three main mathematical operations in the diffusion process:
   1. MODEL: Implements $p_\theta(x_{t-1}|x_t)$
   2. CLIP: Provides conditioning $c$ for $p_\theta(x_{t-1}|x_t, c)$
   3. VAE: Handles the mapping between image space $x$ and latent space $z$

2. **LoRAs (Low-Rank Adaptation)**
   - Stored in `models\loras`
   - Mathematically represented as: $W = W_0 + BA$ where:
     - $W_0$ is the original weight matrix
     - $B$ and $A$ are low-rank matrices
   - Reduces parameter count while maintaining model quality

   **The LoRA Loader Node**
   The `LoRA Loader` node implements the low-rank adaptation by modifying the base model's weights according to the equation:

   $$W_{\text{final}} = W_0 + \alpha \cdot (BA)$$

   where $\alpha$ is the weight parameter in the node (typically 0.5-1.0). The node:
   - Takes a MODEL input from Load Checkpoint
   - Applies the LoRA weights ($BA$) with scaling $\alpha$
   - Outputs the modified model

   When you adjust the weight parameter, you're directly controlling the influence of the low-rank matrices on the original weights.

3. **VAE (Variational Autoencoder)**
   - Stored in `models\vae`
   - Implements the encoding $q_\phi(z|x)$ and decoding $p_\psi(x|z)$
   - Works in a lower-dimensional latent space for efficiency

   **The VAE Encode/Decode Nodes**
   These nodes implement the probabilistic encoding and decoding:

   $$z \sim q_\phi(z|x)$$
   $$x \sim p_\psi(x|z)$$

   - `VAE Encode`: Converts images to latents (mean + variance)
   - `VAE Decode`: Converts latents back to images

   The latent space operations are crucial because:
   1. They reduce memory usage (latents are 4x smaller)
   2. They provide a more stable space for diffusion
   3. They help maintain semantic consistency

## Node Based Workflow

---

The node-based interface in ComfyUI represents the mathematical operations as interconnected components. Each node performs specific operations in the diffusion process:

- Sampling nodes implement the reverse diffusion process
- Conditioning nodes handle text embeddings and other control signals
- VAE nodes handle encoding/decoding between image and latent space: $\mathcal{E}(x)$ and $\mathcal{D}(z)$

![Arcane Wizardry](/images/comfyui/arcane_wizardry.png)

When you're new to node-based workflows, think of each connection as passing tensors and parameters between mathematical operations. The entire workflow represents a computational graph that implements the full diffusion process.

### Getting Started

To begin experimenting with these concepts, you can clear your workflow:

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/clear_workflow.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

You can add nodes by either right-clicking or double-clicking on an empty area:

![Right Click Add Method](https://huggingface.co/k4d3/yiff_toolkit/resolve/main/static/comfyui/right_click_add.png)

---

<!--
HUGO_SEARCH_EXCLUDE_START
-->
{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/ | docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/" >}}
<!--
HUGO_SEARCH_EXCLUDE_END
-->
