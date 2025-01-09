"""
Visualize the noise addition equation from the diffusion process:
q(x_t|x_{t-1}) = N(x_t; √(1-β_t)x_{t-1}, β_tI)

This script creates a visualization showing four panels:
1. Original/Previous Image (x_{t-1})
2. Scaled Previous Image (√(1-β_t)x_{t-1})
3. Random Noise (sampled from N(0, β_tI))
4. Resulting Noisy Image (x_t)

The visualization includes overlays showing:
- Current timestep (t)
- Beta value (β_t)
- Scaling factor (√(1-β_t))
- Mathematical equation
"""

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

def create_beta_schedule(num_steps, beta_min=1e-4, beta_max=0.02):
    """Create a linear noise schedule."""
    return torch.linspace(beta_min, beta_max, num_steps)

def apply_noise_equation(x_prev, beta_t):
    """
    Apply the noise equation: q(x_t|x_{t-1}) = N(x_t; √(1-β_t)x_{t-1}, β_tI)
    Returns intermediate components for visualization.
    """
    # Calculate scaling factor
    alpha_t = 1 - beta_t
    scaling_factor = torch.sqrt(alpha_t)
    
    # Scale previous image
    scaled_prev = scaling_factor * x_prev
    
    # Generate random noise
    noise = torch.randn_like(x_prev)
    scaled_noise = torch.sqrt(beta_t) * noise
    
    # Combine to get final noisy image
    x_t = scaled_prev + scaled_noise
    
    return x_t, scaled_prev, scaled_noise

def tensor_to_image(tensor):
    """Convert a tensor to a numpy image array."""
    img = tensor.squeeze().permute(1, 2, 0).numpy()
    img = np.clip(img, 0, 1)
    return (img * 255).astype(np.uint8)

def create_equation_image(beta_t, scaling_factor, height=100):
    """Create an image with the equation and current values."""
    # Create a white image
    width = 800
    img = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(img)
    
    # Try to load a nice font, fall back to default if necessary
    try:
        font = ImageFont.truetype("segoeui.ttf", 32)
    except:
        try:
            font = ImageFont.truetype("DejaVuSans.ttf", 32)
        except:
            try:
                font = ImageFont.truetype("Arial Unicode.ttf", 32)
            except:
                font = ImageFont.load_default()
    
    # Draw the equation and values
    equation = f"q(x_t|x_{{t-1}}) = N(x_t; {scaling_factor:.4f}x_{{t-1}}, {beta_t:.4f}I)"
    
    # Get text size for centering
    text_bbox = draw.textbbox((0, 0), equation, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (width - text_width) // 2
    text_y = (height - (text_bbox[3] - text_bbox[1])) // 2
    
    # Draw text
    draw.text((text_x, text_y), equation, fill='black', font=font)
    
    return img

def create_visualization_frame(x_prev, scaled_prev, noise, x_t, beta_t, t, num_steps):
    """Create a single frame showing all components of the noise equation."""
    # Convert tensors to images
    prev_img = tensor_to_image(x_prev)
    scaled_img = tensor_to_image(scaled_prev)
    noise_img = tensor_to_image(noise + 0.5)  # Shift noise to [0,1] range for visualization
    noisy_img = tensor_to_image(x_t)
    
    # Get dimensions
    height, width = prev_img.shape[:2]
    
    # Create equation image
    scaling_factor = torch.sqrt(1 - beta_t)
    equation_img = create_equation_image(beta_t, scaling_factor)
    eq_width, eq_height = equation_img.size
    
    # Create canvas
    canvas_width = width * 2 + 20
    canvas_height = height * 2 + eq_height + 40
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    
    # Paste images
    # Original image (top left)
    canvas.paste(Image.fromarray(prev_img), (0, 0))
    # Scaled image (top right)
    canvas.paste(Image.fromarray(scaled_img), (width + 20, 0))
    # Noise (bottom left)
    canvas.paste(Image.fromarray(noise_img), (0, height + 20))
    # Noisy image (bottom right)
    canvas.paste(Image.fromarray(noisy_img), (width + 20, height + 20))
    # Equation
    canvas.paste(equation_img, (0, height * 2 + 40))
    
    # Add labels
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("segoeui.ttf", 24)
    except:
        try:
            font = ImageFont.truetype("DejaVuSans.ttf", 24)
        except:
            try:
                font = ImageFont.truetype("Arial Unicode.ttf", 24)
            except:
                font = ImageFont.load_default()
    
    # Draw labels
    labels = [
        (0, -30, f"Original Image (x_{{{t-1}}})"),
        (width + 20, -30, f"Scaled Image (√(1-β_{t})x_{{{t-1}}})"),
        (0, height - 10, f"Noise (N(0, β_{t}I))"),
        (width + 20, height - 10, f"Noisy Image (x_{t})")
    ]
    
    for x, y, text in labels:
        draw.text((x, y), text, fill='black', font=font)
    
    # Add timestep info
    progress = f"Step {t}/{num_steps-1}"
    text_bbox = draw.textbbox((0, 0), progress, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    draw.text(
        ((canvas_width - text_width) // 2, height * 2 + 20),
        progress,
        fill='black',
        font=font
    )
    
    return np.array(canvas)

def create_animation(frames, output_path, fps=30):
    """Create an MP4 animation from a list of frames."""
    # Get dimensions from first frame
    height, width = frames[0].shape[:2]
    
    # Initialize video writer
    temp_output = str(output_path).replace('.mp4', '_temp.avi')
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    video = cv2.VideoWriter(temp_output, fourcc, fps, (width, height), isColor=True)
    
    if not video.isOpened():
        raise RuntimeError("Failed to create video writer")
    
    # Write frames
    for frame in frames:
        video.write(cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
    
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
    
    # Clean up temporary file
    if os.path.exists(temp_output):
        os.remove(temp_output)

def visualize_noise_equation(image_path, num_steps=10, fps=30):
    """
    Create a visualization of the noise equation process.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load image
    x_0 = load_and_preprocess_image(image_path).to(device)
    
    # Create noise schedule
    betas = create_beta_schedule(num_steps).to(device)
    
    # Initialize list to store frames
    frames = []
    
    # Current image starts as x_0
    x_prev = x_0
    
    # Create frames for each step
    for t in range(1, num_steps):
        # Apply noise equation
        x_t, scaled_prev, scaled_noise = apply_noise_equation(x_prev, betas[t])
        
        # Create visualization frame
        frame = create_visualization_frame(
            x_prev.cpu(), scaled_prev.cpu(), scaled_noise.cpu(),
            x_t.cpu(), betas[t].cpu(), t, num_steps
        )
        frames.append(frame)
        
        # Update previous image for next step
        x_prev = x_t
    
    # Create output directory
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create animation
    create_animation(frames, output_dir / 'noise_equation.mp4', fps=fps)

def main():
    parser = argparse.ArgumentParser(description='Visualize the noise equation process')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--steps', type=int, default=10, help='Number of diffusion steps')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second for the animation')
    args = parser.parse_args()
    
    visualize_noise_equation(args.image, num_steps=args.steps, fps=args.fps)

if __name__ == '__main__':
    main() 