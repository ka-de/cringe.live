import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
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

def forward_diffusion_step(x_t, t, beta_t):
    """
    Perform one step of the forward diffusion process.
    x_t: Current image state
    t: Current timestep
    beta_t: Noise schedule parameter
    """
    # Calculate alpha_t = 1 - beta_t
    alpha_t = 1 - beta_t
    
    # Generate random noise
    noise = torch.randn_like(x_t)
    
    # Apply the forward diffusion equation
    x_t_plus_1 = torch.sqrt(alpha_t) * x_t + torch.sqrt(beta_t) * noise
    
    return x_t_plus_1, noise

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
    
    # Process each frame
    for i, img in enumerate(images):
        # Convert tensor to numpy array
        frame = img.squeeze().permute(1, 2, 0).numpy()
        frame = np.clip(frame, 0, 1)
        frame = (frame * 255).astype(np.uint8)
        
        # Create PIL Image for text rendering
        canvas = Image.new('RGB', (width, canvas_height), 'white')
        # Convert frame to PIL Image and paste it onto canvas
        frame_pil = Image.fromarray(frame)  # No color space conversion needed here
        canvas.paste(frame_pil, (0, 60))
        
        # Add text using PIL
        draw = ImageDraw.Draw(canvas)
        try:
            # Try to use a system font that supports Unicode
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
            text = f't = {i}    β = {betas[i-1]:.6f}'
        
        # Get text size for centering
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = (width - text_width) // 2
        
        # Draw text
        draw.text((text_x, 20), text, fill='black', font=font)
        
        # Convert to numpy array without color space conversion
        canvas_np = np.array(canvas)
        # Convert RGB to BGR for OpenCV
        canvas_cv = cv2.cvtColor(canvas_np, cv2.COLOR_RGB2BGR)
        video.write(canvas_cv)
    
    # Release video writer
    video.release()
    
    # Ensure the temp file exists before trying to convert it
    if not os.path.exists(temp_output):
        raise RuntimeError(f"Failed to create temporary video file: {temp_output}")
    
    # Convert to high-quality web-compatible format using ffmpeg with much better quality settings
    ffmpeg_cmd = (
        f'ffmpeg -y -i "{temp_output}" '  # Add quotes around file paths
        f'-c:v libx264 -preset veryslow '  # Use very slow preset for best quality
        f'-crf 15 '  # Lower CRF for higher quality (15-18 is visually lossless)
        f'-x264-params "aq-mode=3:aq-strength=0.8" '  # Better quality distribution
        f'-b:v 30M -maxrate 40M -bufsize 60M '  # Much higher bitrate
        f'-pix_fmt yuv420p '  # Required for compatibility
        f'-movflags +faststart '  # Enable streaming
        f'-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 '  # Proper color handling
        f'"{output_path}"'  # Add quotes around file paths
    )
    
    # Run ffmpeg and check for errors
    ret = os.system(ffmpeg_cmd)
    if ret != 0:
        raise RuntimeError(f"FFmpeg conversion failed with return code {ret}")
    
    # Only try to remove the temp file if it exists
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
    
    # Initialize lists to store images and noise
    images = [x_0.cpu()]
    x_t = x_0
    
    # Perform forward diffusion
    for t in range(num_steps):
        x_t, noise = forward_diffusion_step(x_t, t, betas[t])
        images.append(x_t.cpu())
    
    # Create output directory
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create animation
    create_animation(images, betas, output_dir / 'forward_diffusion.mp4', fps=fps)
    
    # Calculate number of rows and columns needed for grid
    #total_images = len(images)  # num_steps + 1 for original image
    #num_cols = 4  # We'll use 4 columns
    #num_rows = (total_images + num_cols - 1) // num_cols  # Ceiling division
    
    # Create figure for grid visualization
    #fig = plt.figure(figsize=(20, 5 * num_rows))
    
    # Plot results in grid
    #for i, img in enumerate(images):
    #    ax = fig.add_subplot(num_rows, num_cols, i + 1)
    #    img_np = img.squeeze().permute(1, 2, 0).numpy()
    #    img_np = np.clip(img_np, 0, 1)
    #    
    #    ax.imshow(img_np)
    #    ax.axis('off')
    #    ax.set_title(f't={i}\nβ={betas[i-1].item():.6f}' if i > 0 else 'Original')
    
    # Save the grid visualization
    #plt.savefig(output_dir / 'forward_diffusion_grid.png', dpi=300, bbox_inches='tight')
    #plt.close()

def main():
    parser = argparse.ArgumentParser(description='Visualize the forward diffusion process')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--steps', type=int, default=10, help='Number of diffusion steps')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second for the animation')
    args = parser.parse_args()
    
    visualize_diffusion_process(args.image, num_steps=args.steps, fps=args.fps)

if __name__ == '__main__':
    main()
