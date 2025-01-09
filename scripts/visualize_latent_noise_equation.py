"""
Visualize the noise addition equation in latent space:
q(z_t|z_{t-1}) = N(z_t; √(1-β_t)z_{t-1}, β_tI)

This script creates a visualization showing four panels:
1. Original/Previous Latent decoded to Image (VAE(z_{t-1}))
2. Scaled Previous Latent decoded to Image (VAE(√(1-β_t)z_{t-1}))
3. Random Noise in Latent Space decoded to Image (VAE(N(0, β_tI)))
4. Resulting Noisy Latent decoded to Image (VAE(z_t))

The visualization includes overlays showing:
- Current timestep (t)
- Beta value (β_t)
- Scaling factor (√(1-β_t))
- Mathematical equation

Key differences from pixel-space version:
- All operations happen in VAE's latent space
- Images shown are decoded from latents
- Noise patterns are more structured due to VAE decoding
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import torch
import torchvision.transforms as transforms
from pathlib import Path
import argparse
import cv2
import os
import subprocess
from diffusers import AutoencoderKL

def load_and_preprocess_image(image_path):
    """Load and preprocess an image to tensor."""
    image = Image.open(image_path).convert('RGB')
    transform = transforms.Compose([
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0)  # Add batch dimension

def encode_to_latents(vae, image):
    """Encode image to latent space using VAE."""
    with torch.no_grad():
        # Scale image to [-1, 1] as expected by VAE
        image = 2 * image - 1
        
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
        
        # Decode to image space
        image = vae.decode(latents).sample
        
        # Scale from [-1, 1] to [0, 1] range
        image = (image + 1) * 0.5
        image = torch.clamp(image, 0, 1)
    
    return image

def create_beta_schedule(num_steps, beta_min=1e-4, beta_max=0.02):
    """Create a linear noise schedule."""
    return torch.linspace(beta_min, beta_max, num_steps)

def apply_noise_equation_latent(z_prev, beta_t):
    """
    Apply the noise equation in latent space: q(z_t|z_{t-1}) = N(z_t; √(1-β_t)z_{t-1}, β_tI)
    Returns intermediate components for visualization.
    """
    # Calculate scaling factor
    alpha_t = 1 - beta_t
    scaling_factor = torch.sqrt(alpha_t)
    
    # Scale previous latent
    scaled_prev = scaling_factor * z_prev
    
    # Generate random noise in latent space
    noise = torch.randn_like(z_prev)
    scaled_noise = torch.sqrt(beta_t) * noise
    
    # Combine to get final noisy latent
    z_t = scaled_prev + scaled_noise
    
    return z_t, scaled_prev, scaled_noise

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
    
    # Draw the equation and values with z instead of x to indicate latent space
    equation = f"q(z_t|z_{{t-1}}) = N(z_t; {scaling_factor:.4f}z_{{t-1}}, {beta_t:.4f}I)"
    
    # Get text size for centering
    text_bbox = draw.textbbox((0, 0), equation, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (width - text_width) // 2
    text_y = (height - (text_bbox[3] - text_bbox[1])) // 2
    
    # Draw text
    draw.text((text_x, text_y), equation, fill='black', font=font)
    
    return img

def create_visualization_frame(prev_decoded, scaled_decoded, noise_decoded, noisy_decoded, beta_t, t, num_steps):
    """Create a single frame showing all components of the noise equation in decoded image space."""
    # Convert tensors to images
    prev_img = tensor_to_image(prev_decoded)
    scaled_img = tensor_to_image(scaled_decoded)
    noise_img = tensor_to_image(noise_decoded)
    noisy_img = tensor_to_image(noisy_decoded)
    
    # Get dimensions
    height, width = prev_img.shape[:2]
    
    # Create equation image
    scaling_factor = torch.sqrt(1 - beta_t)
    equation_img = create_equation_image(beta_t, scaling_factor)
    eq_width, eq_height = equation_img.size
    
    # Add padding at top for labels
    padding_top = 40
    
    # Create canvas with extra space at top for labels
    canvas_width = width * 2 + 20
    canvas_height = height * 2 + eq_height + 40 + padding_top
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    
    # Paste images with offset for top padding
    # Original decoded latent (top left)
    canvas.paste(Image.fromarray(prev_img), (0, padding_top))
    # Scaled decoded latent (top right)
    canvas.paste(Image.fromarray(scaled_img), (width + 20, padding_top))
    # Decoded noise (bottom left)
    canvas.paste(Image.fromarray(noise_img), (0, height + padding_top + 20))
    # Decoded noisy latent (bottom right)
    canvas.paste(Image.fromarray(noisy_img), (width + 20, height + padding_top + 20))
    # Equation
    canvas.paste(equation_img, (0, height * 2 + padding_top + 40))
    
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
    
    # Draw labels with proper positioning
    labels = [
        (0, 10, f"Decoded Latent (VAE(z_{{{t-1}}}))"),
        (width + 20, 10, f"Decoded Scaled Latent (VAE(√(1-β_{t})z_{{{t-1}}}))"),
        (0, height + padding_top - 10, f"Decoded Noise (VAE(N(0, β_{t}I)))"),
        (width + 20, height + padding_top - 10, f"Decoded Noisy Latent (VAE(z_{t}))")
    ]
    
    for x, y, text in labels:
        draw.text((x, y), text, fill='black', font=font)
    
    # Add timestep info
    progress = f"Step {t}/{num_steps-1}"
    text_bbox = draw.textbbox((0, 0), progress, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    draw.text(
        ((canvas_width - text_width) // 2, height * 2 + padding_top + 20),
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
    
    # Convert to high-quality MP4 using subprocess for proper process handling
    ffmpeg_cmd = [
        'ffmpeg', '-y',
        '-i', str(temp_output),
        '-c:v', 'libx264',
        '-preset', 'veryslow',
        '-crf', '15',
        '-x264-params', 'aq-mode=3:aq-strength=0.8',
        '-b:v', '30M',
        '-maxrate', '40M',
        '-bufsize', '60M',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-color_range', '1',
        '-colorspace', '1',
        '-color_primaries', '1',
        '-color_trc', '1',
        str(output_path)
    ]
    
    try:
        # Run FFmpeg with proper process handling
        process = subprocess.Popen(
            ffmpeg_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        
        # Wait for the process to complete and capture output
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            print(f"FFmpeg stderr output:\n{stderr}")
            raise RuntimeError(f"FFmpeg failed with return code {process.returncode}")
            
    except Exception as e:
        print(f"Error running FFmpeg: {str(e)}")
        raise
    finally:
        # Clean up temporary file
        if os.path.exists(temp_output):
            os.remove(temp_output)

def visualize_latent_noise_equation(image_path, vae_model="stabilityai/sd-vae-ft-mse", num_steps=10, fps=30):
    """
    Create a visualization of the noise equation process in latent space.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load VAE model
    vae = AutoencoderKL.from_pretrained(vae_model, torch_dtype=torch.float32).to(device)
    
    # Load and preprocess image
    x_0 = load_and_preprocess_image(image_path).to(device)
    
    # Encode image to latent space
    z_0 = encode_to_latents(vae, x_0)
    
    # Create noise schedule
    betas = create_beta_schedule(num_steps).to(device)
    
    # Initialize list to store frames
    frames = []
    
    # Create frames for each step
    for t in range(1, num_steps):
        # Apply noise equation to original latent
        z_t, scaled_prev, scaled_noise = apply_noise_equation_latent(z_0, betas[t])
        
        # Decode all latents back to image space for visualization
        prev_decoded = decode_from_latents(vae, z_0)
        scaled_decoded = decode_from_latents(vae, scaled_prev)
        # For noise visualization, we need to normalize it to a reasonable range
        noise_decoded = decode_from_latents(vae, scaled_noise)
        noisy_decoded = decode_from_latents(vae, z_t)
        
        # Create visualization frame
        frame = create_visualization_frame(
            prev_decoded.cpu(),
            scaled_decoded.cpu(),
            noise_decoded.cpu(),
            noisy_decoded.cpu(),
            betas[t].cpu(), t, num_steps
        )
        frames.append(frame)
    
    # Create output directory
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create animation
    create_animation(frames, output_dir / 'latent_noise_equation.mp4', fps=fps)

def main():
    parser = argparse.ArgumentParser(description='Visualize the noise equation process in latent space')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--vae', type=str, default="stabilityai/sd-vae-ft-mse", help='VAE model to use')
    parser.add_argument('--steps', type=int, default=10, help='Number of diffusion steps')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second for the animation')
    args = parser.parse_args()
    
    visualize_latent_noise_equation(
        args.image,
        vae_model=args.vae,
        num_steps=args.steps,
        fps=args.fps
    )

if __name__ == '__main__':
    main() 