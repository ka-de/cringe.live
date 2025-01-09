import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import torch
import torchvision.transforms as transforms
from pathlib import Path
import argparse

def load_and_preprocess_image(image_path, size=(256, 256)):
    """Load and preprocess an image to tensor."""
    image = Image.open(image_path).convert('RGB')
    transform = transforms.Compose([
        transforms.Resize(size),
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0)

def apply_noise_step(x_0, beta):
    """Apply one noise step with a specific beta value."""
    alpha = 1 - beta
    noise = torch.randn_like(x_0)
    return torch.sqrt(alpha) * x_0 + torch.sqrt(beta) * noise

def visualize_beta_effects(image_path):
    """
    Visualize how different beta values affect the noise addition process.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    x_0 = load_and_preprocess_image(image_path).to(device)
    
    # Different beta values to test
    betas = [0.0001, 0.001, 0.01, 0.1, 0.5, 0.9]
    
    # Create figure
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    axes = axes.flatten()
    
    # Apply different amounts of noise
    for i, beta in enumerate(betas):
        x_noisy = apply_noise_step(x_0, beta)
        
        # Convert to numpy and display
        img_np = x_noisy.cpu().squeeze().permute(1, 2, 0).numpy()
        img_np = np.clip(img_np, 0, 1)
        
        axes[i].imshow(img_np)
        axes[i].axis('off')
        axes[i].set_title(f'β = {beta:.4f}\nα = {1-beta:.4f}')
    
    plt.suptitle('Effect of Different β Values on Noise Addition', fontsize=16)
    plt.tight_layout()
    
    # Save the visualization
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    plt.savefig(output_dir / 'beta_effects.png', dpi=300, bbox_inches='tight')
    plt.close()

def main():
    parser = argparse.ArgumentParser(description='Visualize effects of different beta values')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    args = parser.parse_args()
    
    visualize_beta_effects(args.image)

if __name__ == '__main__':
    main() 