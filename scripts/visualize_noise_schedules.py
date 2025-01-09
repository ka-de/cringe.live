import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

def linear_schedule(num_steps, beta_min=1e-4, beta_max=0.02):
    """Linear noise schedule."""
    return np.linspace(beta_min, beta_max, num_steps)

def cosine_schedule(num_steps, s=0.008):
    """Cosine noise schedule from improved DDPM paper."""
    steps = np.linspace(0, num_steps, num_steps)
    alpha_bar = np.cos(((steps / num_steps) + s) / (1 + s) * np.pi * 0.5) ** 2
    alpha_bar = alpha_bar / alpha_bar[0]
    betas = 1 - alpha_bar[1:] / alpha_bar[:-1]
    return np.clip(betas, 0, 0.999)

def quadratic_schedule(num_steps, beta_min=1e-4, beta_max=0.02):
    """Quadratic noise schedule."""
    steps = np.linspace(0, 1, num_steps)
    return beta_min + (beta_max - beta_min) * steps ** 2

def plot_schedules(num_steps=1000):
    """Plot different noise schedules for comparison."""
    # Generate schedules
    linear_betas = linear_schedule(num_steps)
    cosine_betas = cosine_schedule(num_steps-1)  # Cosine schedule returns n-1 betas
    quadratic_betas = quadratic_schedule(num_steps)
    
    # Calculate cumulative noise (alpha_bar)
    def calc_alpha_bar(betas):
        alphas = 1 - betas
        return np.cumprod(alphas)
    
    linear_alpha_bar = calc_alpha_bar(linear_betas)
    cosine_alpha_bar = calc_alpha_bar(cosine_betas)
    quadratic_alpha_bar = calc_alpha_bar(quadratic_betas)
    
    # Create figure with two subplots
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    
    # Plot beta schedules
    steps = np.arange(num_steps)
    ax1.plot(steps, linear_betas, label='Linear', linewidth=2)
    ax1.plot(steps[:-1], cosine_betas, label='Cosine', linewidth=2)
    ax1.plot(steps, quadratic_betas, label='Quadratic', linewidth=2)
    ax1.set_title('Noise Schedules (β_t)', fontsize=14)
    ax1.set_xlabel('Timestep (t)')
    ax1.set_ylabel('β_t')
    ax1.legend()
    ax1.grid(True)
    
    # Plot cumulative noise (alpha_bar)
    ax2.plot(steps, linear_alpha_bar, label='Linear', linewidth=2)
    ax2.plot(steps[:-1], cosine_alpha_bar, label='Cosine', linewidth=2)
    ax2.plot(steps, quadratic_alpha_bar, label='Quadratic', linewidth=2)
    ax2.set_title('Cumulative Signal Remaining (ᾱ_t)', fontsize=14)
    ax2.set_xlabel('Timestep (t)')
    ax2.set_ylabel('ᾱ_t')
    ax2.legend()
    ax2.grid(True)
    
    plt.tight_layout()
    
    # Save the visualization
    output_dir = Path('static/comfyui')
    output_dir.mkdir(parents=True, exist_ok=True)
    plt.savefig(output_dir / 'noise_schedules.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == '__main__':
    plot_schedules() 