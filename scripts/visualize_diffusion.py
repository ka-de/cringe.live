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
