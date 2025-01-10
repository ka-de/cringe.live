"""
Visualize ComfyUI's v-prediction parameterization using the SDXL VAE.

This script creates a visualization showing three views of the diffusion process
using the SDXL VAE (madebyollin/sdxl-vae-fp16-fix) and ComfyUI's sigma-based
v-prediction parameterization:

1. LEFT: The noisy image (x_t)
    - Shows how the original image is corrupted with noise over time
    - Starts as the original image at t=0
    - Progressively becomes noisier as t increases
    - Generated using ComfyUI's sigma-based noise scaling

2. MIDDLE: The raw latent velocity field (v_φ)
    - Shows the rate of change in latent space
    - Displayed at 1/8 resolution (VAE latent space)
    - Normalized to [0,1] range for visualization
    - Brighter areas indicate stronger rates of change

3. RIGHT: The decoded velocity field
    - The velocity field decoded back to image space
    - Shows what the latent velocities "look like" visually
    - Same resolution as the original image
    - Helps interpret the meaning of the velocity predictions

The visualization includes an overlay showing:
    t: Current timestep (when in animation mode)
    σ: Noise level (sigma)
    α: Signal scaling factor

Mathematical details:
    x_t = α_t * x_0 + σ_t * ε      (noisy image)
    v_t = -σ_t * x_0 + α_t * ε      (velocity field)
    where:
        x_0 is the original image/latent
        ε is random Gaussian noise
        α_t is the signal scaling at time t
        σ_t is the noise level at time t

Output:
    The script saves its output to the 'static/comfyui' directory:
    - In animation mode: 'sdxl_v_prediction_comfy.mp4'
    - In single frame mode: 'sdxl_v_prediction_comfy_frame.png'

Usage:
    python visualize_sdxl_v_prediction_comfy.py --image path/to/image.png [options]

Options:
    --image: Path to input image (required)
    --steps: Number of diffusion steps (default: 10)
    --fps: Frames per second in output video (default: 30)
    --1step: Generate only a single frame from the middle timestep
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import torch
import torchvision.transforms as transforms
from pathlib import Path
import argparse
import os
from diffusers import AutoencoderKL

def load_and_preprocess_image(image_path):
    """Load and preprocess an image for SDXL VAE processing."""
    image = Image.open(image_path).convert('RGB')
    
    # Ensure dimensions are multiples of 8
    width, height = image.size
    new_width = (width // 8) * 8
    new_height = (height // 8) * 8
    if new_width != width or new_height != height:
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    transform = transforms.Compose([
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0)

def encode_to_latents(vae, image):
    """Encode image to latent space using SDXL VAE."""
    with torch.no_grad():
        # Scale to [-1, 1] as expected by VAE
        image = 2 * image - 1
        
        # Encode and sample from latent distribution
        latent_dist = vae.encode(image)
        if hasattr(latent_dist, 'latent_dist'):
            latents = latent_dist.latent_dist.sample()
            latents = latents * vae.config.scaling_factor
        else:
            latents = latent_dist.sample()
            latents = latents * 0.13025  # SDXL scaling factor
    return latents

def decode_from_latents(vae, latents, to_numpy=True):
    """Decode latents back to image space using SDXL VAE."""
    with torch.no_grad():
        # Scale latents by SDXL factor
        latents = latents / 0.13025
        
        # Decode to image space
        image = vae.decode(latents).sample
        
        # Scale from [-1, 1] to [0, 1] range
        image = (image + 1) * 0.5
        image = torch.clamp(image, 0, 1)
        
        if to_numpy:
            # Convert to numpy array
            image = image.cpu().squeeze().permute(1, 2, 0).numpy()
            image = (image * 255).astype(np.uint8)
    
    return image

def normalize_velocity_field(v_phi, print_stats=False, timestep=None):
    """Normalize velocity field to prepare it for VAE decoding."""
    if print_stats:
        prefix = f"(t={timestep}) " if timestep is not None else ""
        print(f"\n{prefix}Raw velocity field stats:")
        print(f"Mean: {v_phi.mean().item():.4f}")
        print(f"Std: {v_phi.std().item():.4f}")
        print(f"Min: {v_phi.min().item():.4f}")
        print(f"Max: {v_phi.max().item():.4f}")
    
    # Center the data
    v_phi_centered = v_phi - v_phi.mean()
    
    # Scale to unit standard deviation
    v_phi_norm = 0.1 * v_phi_centered / v_phi.std()
    
    # Clip to reasonable range (±3 standard deviations)
    v_phi_norm = torch.clamp(v_phi_norm, -3, 3)
    
    if print_stats:
        print(f"\n{prefix}Normalized velocity field stats (before decoding):")
        print(f"Mean: {v_phi_norm.mean().item():.4f}")
        print(f"Std: {v_phi_norm.std().item():.4f}")
        print(f"Min: {v_phi_norm.min().item():.4f}")
        print(f"Max: {v_phi_norm.max().item():.4f}")
    
    return v_phi_norm

def v_prediction_step_comfy(z_0, sigma, sigma_data=1.0):
    """
    Compute one step of ComfyUI's v-prediction process.
    
    Args:
        z_0: Original latent tensor
        sigma: Current noise level
        sigma_data: Data scaling factor (default: 1.0)
    
    Returns:
        z_t: Noisy version of the latent
        v_t: Velocity field
        alpha_t: Signal scaling factor
    """
    # Reshape sigma for broadcasting
    sigma = sigma.view(sigma.shape[:1] + (1,) * (z_0.ndim - 1))
    
    # Calculate signal scaling factor (alpha)
    alpha_t = sigma_data ** 2 / (sigma ** 2 + sigma_data ** 2)
    
    # Generate noise
    epsilon = torch.randn_like(z_0)
    
    # Calculate noisy latent
    z_t = torch.sqrt(alpha_t) * z_0 + sigma * epsilon
    
    # Calculate velocity field (matches ComfyUI's v-prediction formula)
    v_t = -sigma * z_0 + torch.sqrt(alpha_t) * epsilon
    
    return z_t, v_t, alpha_t

def create_v_prediction_animation(z_phis, v_phis, decoded_v_phis, sigmas, alphas, output_path, fps=30):
    """Create an MP4 animation showing the three views of the v-prediction process."""
    # Convert first array to get dimensions
    first_frame = z_phis[0]
    height, width = first_frame.shape[:2]
    
    # Calculate latent dimensions (1/8 of original)
    latent_height = height // 8
    latent_width = width // 8
    
    # Create a larger canvas
    canvas_width = width * 2 + latent_width + 40
    canvas_height = max(height, latent_height) + 60
    
    # Create temporary directory for frames
    temp_dir = Path('temp_frames')
    temp_dir.mkdir(exist_ok=True)
    
    # Process each frame
    for i in range(len(z_phis)):
        # Create canvas
        canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
        
        # Process z_phi (full resolution image)
        if i < len(z_phis):
            z_pil = Image.fromarray(z_phis[i])
            canvas.paste(z_pil, (0, 60))
        
        # Process v_phi (latent resolution)
        if i > 0 and i <= len(v_phis):
            # Raw latent velocity field
            v_frame = v_phis[i-1].cpu().squeeze().permute(1, 2, 0).numpy()
            v_frame = (v_frame - v_frame.min()) / (v_frame.max() - v_frame.min())
            v_frame = (v_frame * 255).astype(np.uint8)
            v_pil = Image.fromarray(v_frame)
            canvas.paste(v_pil, (width + 20, 60))
            
            # Decoded velocity field
            decoded_v_pil = Image.fromarray(decoded_v_phis[i-1])
            canvas.paste(decoded_v_pil, (width + latent_width + 40, 60))
        
        # Add text
        draw = ImageDraw.Draw(canvas)
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
        
        if i == 0:
            text = "Noisy Image | Latent Velocity (1/8) | Decoded Velocity"
        else:
            text = f't = {i-1}    σ = {sigmas[i-1]:.4f}    α = {alphas[i-1]:.4f}'
        
        # Center text
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = (canvas_width - text_width) // 2
        
        # Draw text
        draw.text((text_x, 20), text, fill='black', font=font)
        
        # Save frame
        frame_path = temp_dir / f'frame_{i:04d}.png'
        canvas.save(frame_path, 'PNG')
    
    # Convert frames to video using ffmpeg
    ffmpeg_cmd = (
        f'ffmpeg -y -framerate {fps} -i "{temp_dir}/frame_%04d.png" '
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
    
    # Clean up temporary files
    for frame in temp_dir.glob('*.png'):
        frame.unlink()
    temp_dir.rmdir()

def save_single_frame(z_phi, v_phi, decoded_v_phi, sigma, alpha, output_path):
    """Save a single frame showing all three views of the v-prediction process."""
    # Get dimensions from noisy image
    height, width = z_phi.shape[:2]
    
    # Calculate latent dimensions
    latent_height = height // 8
    latent_width = width // 8
    
    # Create canvas
    canvas_width = width * 2 + latent_width + 40
    canvas_height = max(height, latent_height) + 60
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    
    # Paste noisy image
    z_pil = Image.fromarray(z_phi)
    canvas.paste(z_pil, (0, 60))
    
    # Process raw latent velocity field
    v_frame = v_phi.squeeze().permute(1, 2, 0).numpy()
    v_frame = (v_frame - v_frame.min()) / (v_frame.max() - v_frame.min())
    v_frame = (v_frame * 255).astype(np.uint8)
    v_pil = Image.fromarray(v_frame)
    canvas.paste(v_pil, (width + 20, 60))
    
    # Paste decoded velocity field
    decoded_v_pil = Image.fromarray(decoded_v_phi)
    canvas.paste(decoded_v_pil, (width + latent_width + 40, 60))
    
    # Add text
    draw = ImageDraw.Draw(canvas)
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
    
    text = f'σ = {sigma:.4f}    α = {alpha:.4f}'
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (canvas_width - text_width) // 2
    draw.text((text_x, 20), text, fill='black', font=font)
    
    # Save frame
    canvas.save(output_path, 'PNG')

def visualize_v_prediction(image_path, num_steps=10, sigma_min=0.02, sigma_max=80.0, fps=30, single_frame=False):
    """
    Create a visualization of ComfyUI's v-prediction process using SDXL VAE.
    
    Args:
        image_path: Path to input image
        num_steps: Number of diffusion steps
        sigma_min: Minimum noise level
        sigma_max: Maximum noise level
        fps: Frames per second for video
        single_frame: If True, only generate middle frame
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load SDXL VAE model
    vae = AutoencoderKL.from_pretrained(
        "madebyollin/sdxl-vae-fp16-fix",
        torch_dtype=torch.float32
    ).to(device)
    
    # Load and preprocess image
    x_0 = load_and_preprocess_image(image_path).to(device)
    
    # Encode image to latent space
    z_0 = encode_to_latents(vae, x_0)
    
    if single_frame:
        # Use middle timestep for single frame
        t = num_steps // 2
        sigmas = torch.logspace(np.log10(sigma_min), np.log10(sigma_max), num_steps).to(device)
        sigma = sigmas[t]
        
        # Get single frame
        z_t, v_t, alpha_t = v_prediction_step_comfy(z_0, sigma)
        x_t = decode_from_latents(vae, z_t, to_numpy=True)
        
        # Normalize and decode velocity field
        v_t_norm = normalize_velocity_field(v_t, print_stats=True)
        decoded_v_t = decode_from_latents(vae, v_t_norm, to_numpy=True)
        
        # Create output directory
        output_dir = Path('static/comfyui')
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Save single frame
        save_single_frame(x_t, v_t.cpu(), decoded_v_t, 
                         sigma.item(), alpha_t.mean().item(),
                         output_dir / 'sdxl_v_prediction_comfy_frame.png')
        return
    
    # Create log-spaced sigma schedule (matching ComfyUI's approach)
    sigmas = torch.logspace(np.log10(sigma_min), np.log10(sigma_max), num_steps).to(device)
    
    # Store decoded images and velocities
    # First frame is the original image decoded back from latent space
    x_0_decoded = decode_from_latents(vae, z_0, to_numpy=True)
    z_phis = [x_0_decoded]
    v_phis = []
    decoded_v_phis = []
    alphas = []
    
    # Perform v-prediction steps in latent space
    for i in range(num_steps):
        z_t, v_t, alpha_t = v_prediction_step_comfy(z_0, sigmas[i])
        x_t = decode_from_latents(vae, z_t, to_numpy=True)
        z_phis.append(x_t)
        v_phis.append(v_t.cpu())
        
        # Normalize and decode velocity field
        print_stats = (i == num_steps // 2)
        v_t_norm = normalize_velocity_field(v_t, print_stats=print_stats, timestep=i)
        decoded_v_t = decode_from_latents(vae, v_t_norm, to_numpy=True)
        decoded_v_phis.append(decoded_v_t)
        alphas.append(alpha_t.mean().item())
    
    # Create output directory
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create animation
    create_v_prediction_animation(z_phis, v_phis, decoded_v_phis, sigmas.cpu().numpy(), 
                                alphas, output_dir / 'sdxl_v_prediction_comfy.mp4', fps=fps)

def main():
    parser = argparse.ArgumentParser(description='Visualize ComfyUI v-prediction process')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--steps', type=int, default=10, help='Number of diffusion steps')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second for the animation')
    parser.add_argument('--1step', action='store_true', help='Render only one frame from the middle')
    args = parser.parse_args()
    
    visualize_v_prediction(
        args.image,
        num_steps=args.steps,
        fps=args.fps,
        single_frame=getattr(args, '1step', False)
    )

if __name__ == '__main__':
    main() 