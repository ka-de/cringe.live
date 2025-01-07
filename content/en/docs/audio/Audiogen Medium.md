---
weight: 1
bookFlatSection: false
bookCollapseSection: true
bookToC: false
title: "AudioGen Medium"
summary: "A comprehensive guide to using Facebook's AudioGen model for text-to-audio generation and training."
aliases:
  - /docs/audio/Audiogen Medium/
  - /docs/audio/Audiogen Medium
  - /en/docs/audio/Audiogen Medium/
  - /en/docs/audio/Audiogen Medium
---

<!--markdownlint-disable MD025 -->

# AudioGen Medium

---

## What is AudioGen?

AudioGen is a powerful text-to-audio generation model developed by Facebook/Meta. It's an autoregressive transformer language model that can synthesize general audio based on text descriptions. The model operates over discrete representations learned from raw waveforms using an EnCodec tokenizer.

The medium variant (1.5B parameters) follows the MusicGen architecture and is trained with:

- 16kHz EnCodec tokenizer
- 4 codebooks sampled at 50 Hz
- Delay pattern between codebooks
- 50 auto-regressive steps per second of audio

## Installation

1. First, ensure you have Python installed on your system
2. Install the required dependencies:

```bash
# Install AudioCraft library
pip install git+https://github.com/facebookresearch/audiocraft.git

# Install ffmpeg
# Use package manager or download from https://ffmpeg.org/download.html
```

## Using the Script

This [script](https://huggingface.co/k4d3/toolkit/blob/main/audio/audiogen_medium.py) allows batch generation of audio samples from text prompts. Here's how to use it:

1. Save the script as `audiogen_medium.py`
2. Run it from the command line:

```bash
python audiogen_medium.py "dog barking" "sirens of an emergency vehicle" --batch_size 5
```

### Script Features

- Generates multiple variations per prompt using different random seeds
- Normalizes audio output to -14 db LUFS
- Saves outputs as WAV files
- Supports multiple prompts in one run
- Configurable batch size for variations

### Parameters

- `prompts`: One or more text descriptions to generate audio from
- `--batch_size`: Number of variations to generate per prompt (default: 25)

### Output

The script will create WAV files named with the seed number used for generation. Files are saved in a directory structure organized by prompt and timestamp.

## Best Practices

1. Keep prompts clear and descriptive
2. Use specific sound descriptions for better results
3. Experiment with different random seeds
4. Consider post-processing for professional use

## Limitations

- Fixed 5-second duration per generation
- Quality varies based on prompt complexity
- Generation time depends on hardware capabilities
- May require significant RAM/VRAM for batch processing

## System Requirements

- Python 3.7+
- CUDA-capable GPU recommended
- Minimum 8GB RAM

## Training AudioGen

### Dataset Preparation

To train AudioGen on your own dataset, you'll need to prepare your data in the correct format. AudioCraft uses a specific manifest format for training:

1. Create a dataset directory structure:

    ```bash
    dataset/
    ├── audio/
    │   ├── file1.wav
    │   ├── file2.wav
    │   └── ...
    └── metadata/
        ├── file1.json
        └── file2.json
    ```

2. Audio requirements:
   - WAV format
   - 16kHz sample rate
   - Mono channel
   - Duration between 1-30 seconds

3. Metadata format (JSON):

    ```json
    {
        "text": "Description of the audio",
        "duration": 5.0,
        "sample_rate": 16000
    }
    ```

4. Generate manifest file:

    ```bash
    python -m audiocraft.data.audio_dataset /path/to/dataset egs/my_dataset/data.jsonl.gz
    ```

### Training Setup

1. Create a configuration file `config.yaml`:

    ```yaml
    dora:
    dir: "./outputs"
    exclude: ["num_workers", "logs.*"]

    slurm:
    partition: default
    mem_per_gpu: 32
    cpus_per_gpu: 4

    model:
    name: audiogen
    encoder_dims: 1024
    decoder_dims: 1024
    num_heads: 16
    num_layers: 24

    dataset:
    train:
        path: "egs/my_dataset"
        batch_size: 8
    valid:
        path: "egs/my_dataset"
        batch_size: 4

    optim:
    lr: 1e-4
    weight_decay: 0.01
    epochs: 100
    ```

2. Create a training script `train.py`:

    ```python
    from audiocraft.models import AudioGen
    from audiocraft.data.audio_dataset import AudioDataset
    from audiocraft.modules.conditioners import TextConditioner
    import torch

    # Initialize model and dataset
    model = AudioGen.get_pretrained('facebook/audiogen-medium')
    dataset = AudioDataset(manifest_path="egs/my_dataset/data.jsonl.gz")

    # Training loop
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
    model.train()

    for epoch in range(100):
        for batch in dataset:
            optimizer.zero_grad()
            loss = model(batch)
            loss.backward()
            optimizer.step()
            
            print(f"Epoch {epoch}, Loss: {loss.item():.4f}")
    ```

3. Start training:

    ```bash
    # For single GPU training
    python train.py

    # Using Dora for experiment management
    dora run solver=audiogen/train
    ```

### Training Tips

1. **GPU Memory Management**:
   - Start with small batch sizes (4-8)
   - Use gradient accumulation for larger effective batch sizes
   - Enable mixed precision training

2. **Checkpointing**:
   - Save checkpoints every epoch
   - Keep best models based on validation loss
   - Enable model EMA (Exponential Moving Average)

3. **Monitoring**:
   - Use TensorBoard for loss tracking
   - Monitor generated samples periodically
   - Track GPU memory usage

4. **Hyperparameter Optimization**:
   - Learning rate: 1e-4 to 1e-5
   - Batch size: Adjust based on GPU memory
   - Gradient clipping: 0.5 to 1.0

### Evaluation

During training, evaluate your model using:

- Audio quality metrics (PESQ, STOI)
- Text-audio alignment scores
- Human evaluation of generated samples

Save generated samples periodically to track progress:

```python
def evaluate_model(model, prompts):
    model.eval()
    with torch.no_grad():
        wavs = model.generate(prompts)
        for i, wav in enumerate(wavs):
            audio_write(f"sample_{i}", wav.cpu(), model.sample_rate)
```

---

{{< related-posts related="docs/audio/ | docs/yiff_toolkit/lora_training/ | docs/yiff_toolkit/lora_training/Tracking-Training-Changes/" >}}
