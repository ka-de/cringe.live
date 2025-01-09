import torch
import torch.nn as nn
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

class SimpleUNet(nn.Module):
    """A simplified U-Net for demonstration purposes."""
    def __init__(self):
        super().__init__()
        # Encoder
        self.enc1 = nn.Sequential(
            nn.Conv2d(3, 64, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 64, 3, padding=1),
            nn.ReLU()
        )
        # Decoder
        self.dec1 = nn.Sequential(
            nn.Conv2d(64, 64, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 3, 3, padding=1)
        )
        
    def forward(self, x, t):
        # t is ignored in this simple implementation
        x1 = self.enc1(x)
        x = self.dec1(x1)
        return x

def reverse_diffusion_step(model, x_t, t, beta_t):
    """
    Perform one step of the reverse diffusion process.
    """
    alpha_t = 1 - beta_t
    alpha_bar_t = torch.prod(torch.tensor([1 - beta for beta in beta_t[:t+1]]))
    
    # Predict noise
    predicted_noise = model(x_t, t)
    
    # Calculate reverse process mean
    x_t_minus_1 = (1 / torch.sqrt(alpha_t)) * (
        x_t - (beta_t / torch.sqrt(1 - alpha_bar_t)) * predicted_noise
    )
    
    if t > 0:
        noise = torch.randn_like(x_t)
        sigma_t = torch.sqrt(beta_t)
        x_t_minus_1 = x_t_minus_1 + sigma_t * noise
        
    return x_t_minus_1

def visualize_reverse_process(image_size=(64, 64), num_steps=10):
    """
    Visualize the reverse diffusion process starting from pure noise.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = SimpleUNet().to(device)
    
    # Create noise schedule
    betas = torch.linspace(1e-4, 0.02, num_steps).to(device)
    
    # Start from pure noise
    x_T = torch.randn(1, 3, *image_size).to(device)
    images = [x_T.cpu()]
    
    # Reverse diffusion process
    x_t = x_T
    for t in reversed(range(num_steps)):
        x_t = reverse_diffusion_step(model, x_t, t, betas)
        images.append(x_t.cpu())
    
    # Plot results
    fig, axes = plt.subplots(2, (num_steps + 1) // 2, figsize=(20, 8))
    axes = axes.flatten()
    
    for i, img in enumerate(images):
        img_np = img.squeeze().permute(1, 2, 0).numpy()
        img_np = np.clip(img_np, -1, 1)
        img_np = (img_np + 1) / 2  # Scale from [-1, 1] to [0, 1]
        
        axes[i].imshow(img_np)
        axes[i].axis('off')
        axes[i].set_title(f't={num_steps-i}')
    
    plt.suptitle('Reverse Diffusion Process', fontsize=16)
    plt.tight_layout()
    
    # Save the visualization
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    plt.savefig(output_dir / 'reverse_diffusion.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == '__main__':
    visualize_reverse_process() 