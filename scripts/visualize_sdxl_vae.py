"""
Visualize images using the SDXL VAE (madebyollin/sdxl-vae-fp16-fix).

This script demonstrates encoding and decoding images using the SDXL VAE model.
It includes visualization of:
1. Original image
2. Latent representation (normalized for visualization)
3. Reconstructed image from latents

The script uses the fp16-fixed version of the SDXL VAE which provides better
numerical stability and memory efficiency.

Usage:
    python visualize_sdxl_vae.py --image path/to/image.png [options]

Options:
    --image: Path to input image (required)
    --save_latents: Save the latent representation (default: False)
    --output_dir: Directory to save outputs (default: static/comfyui)
"""

import argparse
import numpy as np
from pathlib import Path
import torch
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont
from diffusers import AutoencoderKL

def load_and_preprocess_image(image_path):
    """
    Load and preprocess an image for SDXL VAE processing.
    
    Args:
        image_path: Path to input image
        
    Returns:
        torch.Tensor: Preprocessed image tensor [1,3,H,W]
        where H,W are multiples of 8 (VAE requirement)
    """
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
    """
    Encode image to latent space using SDXL VAE.
    
    Args:
        vae: AutoencoderKL model instance
        image: Input image tensor [0,1] range
        
    Returns:
        torch.Tensor: Latent representation
    """
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
            latents = latents * 0.13025 # SDXL scaling factor
    
    return latents

def decode_from_latents(vae, latents):
    """
    Decode latents back to image space using SDXL VAE.
    
    Args:
        vae: AutoencoderKL model instance
        latents: Latent tensor to decode
        
    Returns:
        numpy.ndarray: RGB image array [H,W,3] in [0,255] range
    """
    with torch.no_grad():
        # Scale latents by SDXL factor
        latents = latents / 0.13025
        
        # Decode to image space
        image = vae.decode(latents).sample
        
        # Scale from [-1, 1] to [0, 1] range
        image = (image + 1) * 0.5
        image = torch.clamp(image, 0, 1)
        
        # Convert to numpy array
        image = image.cpu().squeeze().permute(1, 2, 0).numpy()
        image = (image * 255).astype(np.uint8)
    
    return image

def visualize_latents(latents):
    """
    Create visualization of latent space representation.
    
    Args:
        latents: Latent tensor [1,4,H/8,W/8]
        
    Returns:
        numpy.ndarray: Visualization array [H/8,W/8,3] in [0,255] range
    """
    # Take first 3 channels for RGB visualization
    vis = latents[:,:3].cpu().squeeze().permute(1, 2, 0).numpy()
    
    # Normalize to [0,1] range
    vis = (vis - vis.min()) / (vis.max() - vis.min())
    
    # Convert to uint8
    vis = (vis * 255).astype(np.uint8)
    return vis

def create_comparison_image(original, latents, reconstructed, output_path):
    """
    Create side-by-side comparison of original, latents, and reconstruction.
    
    Args:
        original: Original image array [H,W,3]
        latents: Latent visualization array [H/8,W/8,3]
        reconstructed: Reconstructed image array [H,W,3]
        output_path: Path to save comparison image
    """
    # Get dimensions
    height, width = original.shape[:2]
    latent_height, latent_width = latents.shape[:2]
    
    # Create canvas
    canvas_width = width * 2 + latent_width + 40
    canvas_height = max(height, latent_height) + 60
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    
    # Paste images
    canvas.paste(Image.fromarray(original), (0, 60))
    canvas.paste(Image.fromarray(latents), (width + 20, 60))
    canvas.paste(Image.fromarray(reconstructed), (width + latent_width + 40, 60))
    
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
    
    text = "Original | Latents (1/8) | Reconstructed"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (canvas_width - text_width) // 2
    draw.text((text_x, 20), text, fill='black', font=font)
    
    # Save image
    canvas.save(output_path, 'PNG')

def main():
    parser = argparse.ArgumentParser(description='Visualize SDXL VAE encoding/decoding')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--save_latents', action='store_true', help='Save latent tensors')
    parser.add_argument('--output_dir', type=str, default='static/comfyui', help='Output directory')
    args = parser.parse_args()
    
    # Setup device and output directory
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load VAE model
    vae = AutoencoderKL.from_pretrained(
        "madebyollin/sdxl-vae-fp16-fix",
        torch_dtype=torch.float32
    ).to(device)
    
    # Load and process image
    x_0 = load_and_preprocess_image(args.image).to(device)
    
    # Encode to latents
    z_0 = encode_to_latents(vae, x_0)
    
    # Create visualizations
    original = (x_0.cpu().squeeze().permute(1, 2, 0).numpy() * 255).astype(np.uint8)
    latent_vis = visualize_latents(z_0)
    reconstructed = decode_from_latents(vae, z_0)
    
    # Save comparison image
    create_comparison_image(
        original, latent_vis, reconstructed,
        output_dir / 'sdxl_vae_comparison.png'
    )
    
    # Optionally save latent tensors
    if args.save_latents:
        torch.save(z_0.cpu(), output_dir / 'sdxl_latents.pt')

if __name__ == '__main__':
    main() 