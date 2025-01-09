"""
Visualize the v-prediction parameterization of the diffusion process.

This script creates a side-by-side visualization showing how an image is gradually
corrupted with noise using the v-prediction formulation, which represents the diffusion
process as a rotation in a 2D space.

The visualization shows:
LEFT: The noisy image (z_φ)
    - Starts with the original image at φ = 0
    - Gradually becomes noisier as φ increases
    - Ends with pure noise at φ ≈ π/2
    - Shows how the image content smoothly transitions to noise

RIGHT: The velocity field (v_φ)
    - Shows the instantaneous rate of change at each point
    - Computed as the derivative of z_φ with respect to φ:
      v_φ = d(z_φ)/d(φ) = cos(φ)ε - sin(φ)x
    - Brighter areas indicate stronger change
    - Interpretation:
        * At φ = 0: v_φ ≈ ε (pure noise)
        * At φ = π/4: Equal mix of noise and negative image
        * At φ = π/2: v_φ ≈ -x (negative of original image)
    - The pattern reveals:
        * Which parts of the image are changing fastest
        * The direction of change at each point
        * How the noise interacts with image features

The text overlay shows:
    t: Current timestep
    φ: Angle in radians (0 → π/2)
    ᾱ: Cumulative scaling factor (1 → 0)

Mathematical formulation:
    z_φ = cos(φ)x + sin(φ)ε      (noisy image)
    v_φ = cos(φ)ε - sin(φ)x      (velocity field)
    where:
        x is the original image
        ε is random Gaussian noise
        φ is the angle representing diffusion progress

The velocity field is key to v-prediction because:
1. It represents the direction of optimal denoising
2. The model learns to predict v_φ instead of ε
3. It provides a more natural parameterization of the diffusion process
4. The magnitude of v_φ indicates where the image is changing most rapidly

Usage:
    python visualize_v_prediction.py --image path/to/image.png [options]

Options:
    --steps: Number of diffusion steps (default: 10)
    --fps: Frames per second in output video (default: 30)
    --vae: VAE model to use (default: stabilityai/sd-vae-ft-mse)

Requirements:
    - torch
    - torchvision
    - PIL
    - numpy
    - diffusers
    - ffmpeg (system command)
"""

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
    """Load and preprocess an image to tensor, maintaining original resolution."""
    image = Image.open(image_path).convert('RGB')
    # Ensure dimensions are multiples of 8 (VAE requirement) while keeping aspect ratio
    width, height = image.size
    new_width = (width // 8) * 8
    new_height = (height // 8) * 8
    if new_width != width or new_height != height:
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    transform = transforms.Compose([
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

def v_prediction_step(x_0, t, betas):
    """
    Implement v-prediction step as described in the theory section.
    
    The function computes both the noisy image z_φ and its velocity field v_φ.
    The velocity field represents the instantaneous rate of change of z_φ with
    respect to the angle φ.
    
    Args:
        x_0: Original image in image space (not latent space)
        t: Current timestep
        betas: Complete noise schedule
    
    The process:
    1. Calculate α_t (signal scaling) and σ_t (noise scaling) from the noise schedule
    2. Compute angle φ = arctan(σ_t/α_t) representing progress through diffusion
    3. Generate random noise ε
    4. Compute noisy image z_φ = cos(φ)x + sin(φ)ε
    5. Compute velocity field v_φ = d(z_φ)/d(φ) = cos(φ)ε - sin(φ)x
    
    The velocity field v_φ shows:
    - At φ = 0: Mostly noise (cos(0)ε ≈ ε)
    - At φ = π/4: Equal mix of noise and negative image
    - At φ = π/2: Mostly negative image (-sin(π/2)x ≈ -x)
    
    Returns:
        z_phi: Noisy version of the image at angle φ
        v_phi: Velocity field showing direction of change
        phi_t: Current angle in radians
    """
    # Calculate alphas (signal scaling) and sigma (noise level)
    alphas = 1 - betas
    alphas_cumprod = torch.cumprod(alphas, dim=0)
    alpha_t = torch.sqrt(alphas_cumprod[t])  # Signal scaling factor
    sigma_t = torch.sqrt(1 - alphas_cumprod[t])  # Noise scaling factor
    
    # Calculate phi (angle) from alpha and sigma
    # φ = arctan(σ_t/α_t) represents progress through diffusion
    phi_t = torch.arctan2(sigma_t, alpha_t)
    
    # Generate noise with same dimensions as input image
    epsilon = torch.randn_like(x_0)
    
    # Calculate noisy image z_phi using angular parameterization
    # z_φ = cos(φ)x + sin(φ)ε
    # - At φ = 0: z_φ ≈ x (original image)
    # - At φ = π/4: z_φ = equal mix of image and noise
    # - At φ = π/2: z_φ ≈ ε (pure noise)
    z_phi = torch.cos(phi_t) * x_0 + torch.sin(phi_t) * epsilon
    
    # Calculate velocity field v_phi (direction of change)
    # v_φ = d(z_φ)/d(φ) = cos(φ)ε - sin(φ)x
    # This shows the instantaneous rate of change at each point
    v_phi = torch.cos(phi_t) * epsilon - torch.sin(phi_t) * x_0
    
    return z_phi, v_phi, phi_t

def create_v_prediction_animation(z_phis, v_phis, phis, betas, output_path, fps=30):
    """Create an MP4 animation showing both z_phi and v_phi side by side."""
    # Convert first tensor to numpy to get dimensions
    first_frame = z_phis[0].squeeze().permute(1, 2, 0).numpy()
    first_frame = np.clip(first_frame, 0, 1)
    first_frame = (first_frame * 255).astype(np.uint8)
    height, width = first_frame.shape[:2]
    
    # Create a larger canvas to accommodate both visualizations and text
    canvas_width = width * 2 + 20  # Add 20px padding between images
    canvas_height = height + 60  # Add 60px for text
    
    # Create temporary directory for frames
    temp_dir = Path('temp_frames')
    temp_dir.mkdir(exist_ok=True)
    
    # Calculate alphas for overlay text
    alphas = 1 - betas
    alphas_cumprod = torch.cumprod(alphas, dim=0)
    
    # Process each frame
    for i in range(len(z_phis)):
        # Create canvas
        canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
        
        # Process z_phi
        if i < len(z_phis):
            z_frame = z_phis[i].squeeze().permute(1, 2, 0).numpy()
            z_frame = np.clip(z_frame, 0, 1)
            z_frame = (z_frame * 255).astype(np.uint8)
            z_pil = Image.fromarray(z_frame)
            canvas.paste(z_pil, (0, 60))
        
        # Process v_phi
        if i > 0 and i <= len(v_phis):
            v_frame = v_phis[i-1].squeeze().permute(1, 2, 0).numpy()
            # Normalize v_phi for visualization while preserving spatial dimensions
            v_frame = (v_frame - v_frame.min()) / (v_frame.max() - v_frame.min())
            v_frame = (v_frame * 255).astype(np.uint8)
            v_pil = Image.fromarray(v_frame)
            canvas.paste(v_pil, (width + 20, 60))
        
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
            text = "Original Image | Velocity Field"
        else:
            text = f't = {i-1}    φ = {phis[i-1]:.4f}    ᾱ = {alphas_cumprod[i-1]:.4f}'
        
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

def visualize_v_prediction(image_path, vae_model="stabilityai/sd-vae-ft-mse", num_steps=10, beta_min=1e-4, beta_max=0.02, fps=30):
    """
    Visualize the v-prediction process showing both z_phi and v_phi.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load VAE model
    vae = AutoencoderKL.from_pretrained(vae_model, torch_dtype=torch.float32).to(device)
    
    # Load and preprocess image at original resolution (adjusted to multiple of 8)
    x_0 = load_and_preprocess_image(image_path).to(device)
    
    # Encode image to latent space
    z_0 = encode_to_latents(vae, x_0)
    
    # Create linear noise schedule
    betas = torch.linspace(beta_min, beta_max, num_steps)
    
    # Store images and velocities
    z_phis = [x_0.cpu()]  # Start with original image
    v_phis = []
    phis = []
    
    # Perform v-prediction steps in latent space
    for t in range(num_steps):
        z_phi, v_phi, phi_t = v_prediction_step(z_0, t, betas)
        # Decode latents back to image space for visualization
        x_t = decode_from_latents(vae, z_phi)
        z_phis.append(x_t.cpu())
        v_phis.append(v_phi.cpu())
        phis.append(phi_t.item())
    
    # Create output directory
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create animation showing both z_phi and v_phi side by side
    create_v_prediction_animation(z_phis, v_phis, phis, betas, 
                                output_dir / 'v_prediction.mp4', fps=fps)

def main():
    parser = argparse.ArgumentParser(description='Visualize the v-prediction process')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--vae', type=str, default="stabilityai/sd-vae-ft-mse", help='VAE model to use')
    parser.add_argument('--steps', type=int, default=10, help='Number of diffusion steps')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second for the animation')
    args = parser.parse_args()
    
    visualize_v_prediction(
        args.image,
        vae_model=args.vae,
        num_steps=args.steps,
        fps=args.fps
    )

if __name__ == '__main__':
    main() 