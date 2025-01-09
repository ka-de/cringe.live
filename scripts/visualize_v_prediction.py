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

def v_prediction_step(x_0, t, betas):
    """
    Implement v-prediction step as described in the theory section.
    x_0: Original image in image space (not latent space)
    t: Current timestep
    betas: Complete noise schedule
    """
    # Calculate alphas and sigma
    alphas = 1 - betas
    alphas_cumprod = torch.cumprod(alphas, dim=0)
    alpha_t = torch.sqrt(alphas_cumprod[t])
    sigma_t = torch.sqrt(1 - alphas_cumprod[t])
    
    # Calculate phi (angle) from alpha and sigma
    phi_t = torch.arctan2(sigma_t, alpha_t)
    
    # Generate noise with same dimensions as input image
    epsilon = torch.randn_like(x_0)
    
    # Calculate noisy image z_phi using angular parameterization
    z_phi = torch.cos(phi_t) * x_0 + torch.sin(phi_t) * epsilon
    
    # Calculate velocity v_phi (direction of change)
    # v_phi = d(z_phi)/d(phi) = cos(phi)ε - sin(phi)x
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
    
    # Initialize video writer
    temp_output = str(output_path).replace('.mp4', '_temp.avi')
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    video = cv2.VideoWriter(temp_output, fourcc, fps, 
                           (canvas_width, canvas_height), isColor=True)
    
    if not video.isOpened():
        raise RuntimeError("Failed to create video writer")
    
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
            
            # Convert to RGB image with same dimensions as input
            v_frame = (v_frame * 255).astype(np.uint8)
            
            # Resize if dimensions don't match (they should, but just in case)
            v_pil = Image.fromarray(v_frame)
            if v_pil.size != (width, height):
                v_pil = v_pil.resize((width, height), Image.Resampling.LANCZOS)
            
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
        
        # Convert to OpenCV format and write
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

def visualize_v_prediction(image_path, vae_model="stabilityai/sd-vae-ft-mse", num_steps=10, beta_min=1e-4, beta_max=0.02, fps=30):
    """
    Visualize the v-prediction process showing both z_phi and v_phi.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load VAE model
    vae = AutoencoderKL.from_pretrained(vae_model, torch_dtype=torch.float32).to(device)
    
    # Load and preprocess image
    x_0 = load_and_preprocess_image(image_path).to(device)
    
    # Create linear noise schedule
    betas = torch.linspace(beta_min, beta_max, num_steps)
    
    # Store images and velocities
    z_phis = [x_0.cpu()]  # Start with original image
    v_phis = []
    phis = []
    
    # Perform v-prediction steps in image space for better visualization
    for t in range(num_steps):
        z_phi, v_phi, phi_t = v_prediction_step(x_0, t, betas)
        z_phis.append(z_phi.cpu())
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