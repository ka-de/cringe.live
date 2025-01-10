"""
Compare different noise schedulers for v-prediction using the SDXL VAE.

This script creates a visualization comparing different noise scheduling approaches
side by side, showing how they affect the v-prediction process. It includes:

1. Linear scheduler (t → σ)
2. Logarithmic scheduler (ComfyUI default)
3. Cosine scheduler (Stable Diffusion default)
4. Exponential scheduler

For each scheduler, it shows:
    - The noisy image (x_t)
    - The raw latent velocity field (v_φ)
    - The decoded velocity field
    - The noise schedule curve

The visualization helps understand how different noise schedules affect:
    - The rate of noise addition
    - The structure of the velocity field
    - The overall diffusion process

Output:
    The script saves its output to the 'static/comfyui' directory:
    - In animation mode: 'scheduler_comparison.mp4'
    - In single frame mode: 'scheduler_comparison_frame.png'
    - Noise schedule plot: 'noise_schedules.png'

Usage:
    python compare_sdxl_schedulers.py --image path/to/image.png [options]

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
import matplotlib.pyplot as plt

# Reuse core functions from v-prediction script
from visualize_sdxl_v_prediction_comfy import (
    load_and_preprocess_image, encode_to_latents, decode_from_latents,
    normalize_velocity_field, v_prediction_step_comfy
)

class NoiseScheduler:
    """Base class for noise schedulers."""
    def __init__(self, num_steps, device):
        self.num_steps = num_steps
        self.device = device
        self._generate_schedule()
    
    def _generate_schedule(self):
        """Generate the noise schedule. Override in subclasses."""
        raise NotImplementedError
    
    def get_sigmas(self):
        """Return the noise levels for all steps."""
        return self.sigmas
    
    def plot(self, ax, label=None, color=None):
        """Plot the noise schedule."""
        steps = np.arange(self.num_steps)
        sigmas = self.sigmas.cpu().numpy()
        if label is None:
            label = self.__class__.__name__
        ax.plot(steps, sigmas, label=label, color=color)

class LinearScheduler(NoiseScheduler):
    """Linear noise schedule from sigma_min to sigma_max."""
    def _generate_schedule(self, sigma_min=0.02, sigma_max=80.0):
        self.sigmas = torch.linspace(sigma_min, sigma_max, self.num_steps).to(self.device)

class LogScheduler(NoiseScheduler):
    """Logarithmic noise schedule (ComfyUI default)."""
    def _generate_schedule(self, sigma_min=0.02, sigma_max=80.0):
        self.sigmas = torch.logspace(
            np.log10(sigma_min), np.log10(sigma_max), self.num_steps
        ).to(self.device)

class CosineScheduler(NoiseScheduler):
    """Cosine noise schedule (Stable Diffusion default)."""
    def _generate_schedule(self, sigma_min=0.02, sigma_max=80.0):
        steps = torch.linspace(0, 1, self.num_steps)
        alphas = torch.cos(steps * torch.pi * 0.5)
        sigmas = sigma_max * (1 - alphas) / alphas
        self.sigmas = torch.clip(sigmas, sigma_min, sigma_max).to(self.device)

class ExponentialScheduler(NoiseScheduler):
    """Exponential noise schedule."""
    def _generate_schedule(self, sigma_min=0.02, sigma_max=80.0):
        self.sigmas = torch.exp(
            torch.linspace(np.log(sigma_min), np.log(sigma_max), self.num_steps)
        ).to(self.device)

def plot_noise_schedules(schedulers, output_path):
    """Create a plot comparing different noise schedules."""
    plt.figure(figsize=(12, 8))
    ax = plt.gca()
    
    colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']
    for scheduler, color in zip(schedulers, colors):
        scheduler.plot(ax, color=color)
    
    ax.set_xlabel('Step')
    ax.set_ylabel('Noise Level (σ)')
    ax.set_yscale('log')
    ax.grid(True, which='both', linestyle='--', alpha=0.7)
    ax.legend()
    ax.set_title('Comparison of Noise Schedules')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

def create_scheduler_comparison_frame(images_and_data, output_path):
    """Create a single frame comparing different schedulers."""
    n_schedulers = len(images_and_data)
    first_data = images_and_data[0]
    
    # Get dimensions from first image
    height, width = first_data['noisy'].shape[:2]
    latent_height = height // 8
    latent_width = width // 8
    
    # Calculate canvas size
    scheduler_width = width * 2 + latent_width + 40
    canvas_width = scheduler_width * n_schedulers + 40 * (n_schedulers - 1)
    canvas_height = height + 120  # Extra space for two lines of text
    
    # Create canvas
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    draw = ImageDraw.Draw(canvas)
    
    # Try to load a font
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
    
    # Add global title
    title = "Comparison of Noise Schedulers"
    text_bbox = draw.textbbox((0, 0), title, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (canvas_width - text_width) // 2
    draw.text((text_x, 10), title, fill='black', font=font)
    
    # Process each scheduler's data
    for i, data in enumerate(images_and_data):
        x_offset = i * (scheduler_width + 40)
        
        # Paste noisy image
        noisy_pil = Image.fromarray(data['noisy'])
        canvas.paste(noisy_pil, (x_offset, 80))
        
        # Paste raw latent velocity
        v_pil = Image.fromarray(data['velocity'])
        canvas.paste(v_pil, (x_offset + width + 20, 80))
        
        # Paste decoded velocity
        decoded_v_pil = Image.fromarray(data['decoded_velocity'])
        canvas.paste(decoded_v_pil, (x_offset + width + latent_width + 40, 80))
        
        # Add scheduler name and stats
        text = f"{data['name']}"
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = x_offset + (scheduler_width - text_width) // 2
        draw.text((text_x, 45), text, fill='black', font=font)
        
        stats = f"σ = {data['sigma']:.4f}    α = {data['alpha']:.4f}"
        text_bbox = draw.textbbox((0, 0), stats, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = x_offset + (scheduler_width - text_width) // 2
        draw.text((text_x, height + 85), stats, fill='black', font=font)
    
    # Save the comparison frame
    canvas.save(output_path, 'PNG')

def create_scheduler_comparison_animation(frames_data, output_path, fps=30):
    """Create an animation comparing different schedulers."""
    if not frames_data:
        return
    
    # Create temporary directory for frames
    temp_dir = Path('temp_frames')
    temp_dir.mkdir(exist_ok=True)
    
    # Save each frame
    for i, frame_data in enumerate(frames_data):
        frame_path = temp_dir / f'frame_{i:04d}.png'
        create_scheduler_comparison_frame(frame_data, frame_path)
    
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

def compare_schedulers(image_path, num_steps=10, fps=30, single_frame=False):
    """Compare different noise schedulers for v-prediction."""
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
    
    # Create schedulers
    schedulers = [
        ('Linear', LinearScheduler(num_steps, device)),
        ('Logarithmic', LogScheduler(num_steps, device)),
        ('Cosine', CosineScheduler(num_steps, device)),
        ('Exponential', ExponentialScheduler(num_steps, device))
    ]
    
    # Create output directory
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Plot noise schedules
    plot_noise_schedules([s[1] for s in schedulers], 
                        output_dir / 'noise_schedules.png')
    
    if single_frame:
        # Use middle timestep
        t = num_steps // 2
        frame_data = []
        
        for name, scheduler in schedulers:
            sigma = scheduler.get_sigmas()[t]
            
            # Get frame data
            z_t, v_t, alpha_t = v_prediction_step_comfy(z_0, sigma)
            x_t = decode_from_latents(vae, z_t, to_numpy=True)
            
            # Process velocity field
            v_t_norm = normalize_velocity_field(v_t)
            decoded_v_t = decode_from_latents(vae, v_t_norm, to_numpy=True)
            
            # Prepare velocity visualization
            v_frame = v_t.cpu().squeeze().permute(1, 2, 0).numpy()
            v_frame = (v_frame - v_frame.min()) / (v_frame.max() - v_frame.min())
            v_frame = (v_frame * 255).astype(np.uint8)
            
            frame_data.append({
                'name': name,
                'noisy': x_t,
                'velocity': v_frame,
                'decoded_velocity': decoded_v_t,
                'sigma': sigma.item(),
                'alpha': alpha_t.mean().item()
            })
        
        # Create comparison frame
        create_scheduler_comparison_frame(
            frame_data,
            output_dir / 'scheduler_comparison_frame.png'
        )
        return
    
    # Prepare animation frames
    frames_data = []
    
    # First frame is original image
    x_0_decoded = decode_from_latents(vae, z_0, to_numpy=True)
    first_frame = []
    for name, _ in schedulers:
        first_frame.append({
            'name': name,
            'noisy': x_0_decoded,
            'velocity': np.zeros_like(x_0_decoded),
            'decoded_velocity': np.zeros_like(x_0_decoded),
            'sigma': 0.0,
            'alpha': 1.0
        })
    frames_data.append(first_frame)
    
    # Generate frames for each step
    for step in range(num_steps):
        frame_data = []
        
        for name, scheduler in schedulers:
            sigma = scheduler.get_sigmas()[step]
            
            # Get frame data
            z_t, v_t, alpha_t = v_prediction_step_comfy(z_0, sigma)
            x_t = decode_from_latents(vae, z_t, to_numpy=True)
            
            # Process velocity field
            v_t_norm = normalize_velocity_field(v_t)
            decoded_v_t = decode_from_latents(vae, v_t_norm, to_numpy=True)
            
            # Prepare velocity visualization
            v_frame = v_t.cpu().squeeze().permute(1, 2, 0).numpy()
            v_frame = (v_frame - v_frame.min()) / (v_frame.max() - v_frame.min())
            v_frame = (v_frame * 255).astype(np.uint8)
            
            frame_data.append({
                'name': name,
                'noisy': x_t,
                'velocity': v_frame,
                'decoded_velocity': decoded_v_t,
                'sigma': sigma.item(),
                'alpha': alpha_t.mean().item()
            })
        
        frames_data.append(frame_data)
    
    # Create animation
    create_scheduler_comparison_animation(
        frames_data,
        output_dir / 'scheduler_comparison.mp4',
        fps=fps
    )

def main():
    parser = argparse.ArgumentParser(description='Compare noise schedulers for v-prediction')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--steps', type=int, default=10, help='Number of diffusion steps')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second for the animation')
    parser.add_argument('--1step', action='store_true', help='Render only one frame from the middle')
    args = parser.parse_args()
    
    compare_schedulers(
        args.image,
        num_steps=args.steps,
        fps=args.fps,
        single_frame=getattr(args, '1step', False)
    )

if __name__ == '__main__':
    main() 