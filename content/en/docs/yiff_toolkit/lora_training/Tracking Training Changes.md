---
title: "Tracking Training Changes"
description: "Guide to keeping track of changes during LoRA training using automated scripts"
summary: "Learn how to use automated scripts to organize and track your LoRA training process, including managing model versions, backing up configurations, and maintaining clean training workspaces."
weight: 8
bookToC: false
bookFlatSection: false
aliases:
  - /en/docs/yiff_toolkit/lora_training/Tracking-Training-Changes/
  - /en/docs/yiff_toolkit/lora_training/Tracking-Training-Changes
  - /en/docs/yiff_toolkit/lora_training/Tracking_Training_Changes/
  - /en/docs/yiff_toolkit/lora_training/Tracking_Training_Changes
  - "/en/docs/yiff_toolkit/lora_training/Tracking Training Changes/"
  - "/en/docs/yiff_toolkit/lora_training/Tracking Training Changes"
  - /docs/yiff_toolkit/lora_training/Tracking-Training-Changes/
  - /docs/yiff_toolkit/lora_training/Tracking-Training-Changes
  - /docs/yiff_toolkit/lora_training/Tracking_Training_Changes/
  - /docs/yiff_toolkit/lora_training/Tracking_Training_Changes
  - "/docs/yiff_toolkit/lora_training/Tracking Training Changes/"
  - "/docs/yiff_toolkit/lora_training/Tracking Training Changes"
---

## Overview

When training LoRAs, it's crucial to keep track of your training configurations, model versions, and changes. This guide explains how to use automated scripts to track changes during training.

## The Training Script

The training script provided below handles several important aspects of tracking. It maintains a record of your Git repository state to track code changes and versions over time. The script also preserves your training configurations by creating backups of key files, ensuring you can reference and reproduce your training settings later. Additionally, it saves sample prompts that were used during training for future reference. To keep your workspace organized, the script automatically cleans up any failed training runs by removing their output directories.

Here's how to use it:

```zsh
#!/usr/bin/env zsh
NAME=your-model-name-v1s2400
TRAINING_DIR="/path/to/your/dataset"
# Optional: Override steps from name
# STEPS=2400
# Optional: Override output directory
# OUTPUT_DIR="/custom/output/path"

# Source the helper functions
source "$HOME/toolkit/zsh/train_functions.zsh"

# Your training arguments here...
args=(
    --pretrained_model_name_or_path="/path/to/base/model.safetensors"
    # ... other arguments ...
)

# Setup environment and variables
setup_training_vars "$NAME"
setup_conda_env "sdscripts"

# Store commit hashes and copy configs
store_commits_hashes "$SD_REPO" "$LYCORIS_REPO"

# Run the training
run_training_script "/path/to/train_network.py" "${args[@]}"
```

## What Gets Tracked

The script automatically tracks several key aspects of your training process. For Git repository states, it records the commit hashes of both the training script repository and the LyCORIS repository, allowing you to reference the exact code versions used.

The script also handles important training files by making copies of your configuration. It creates hashes of your training configuration file (`config.toml`), saves any sample prompts used during training in `sample-prompts.txt`, and preserves a copy of the training script itself for future reference.

To keep your workspace organized, the script includes automatic cleanup functionality. It monitors for any failed training runs and removes their output directories, ensuring your workspace stays clean and manageable over time.

## Helper Functions

The script relies on several helper functions:

### `setup_training_vars`

The `setup_training_vars` function handles the basic training variables needed for the process. It extracts both the dataset name and number of steps from the provided model name. Additionally, it creates and configures the necessary output directories while validating that the specified training directory exists.

### `setup_conda_env`

This function manages all aspects of the Conda environment setup. It handles activating the environment that was specified, validates that the environment actually exists, and performs the initialization of Conda for the current shell session.

### `store_commits_hashes`

The `store_commits_hashes` function is responsible for tracking the state of Git repositories. It records the commit hashes from the repositories, makes copies of all relevant configuration files, and generates SHA-1 hashes that can be used for tracking purposes.

### `cleanup_empty_output`

This cleanup function helps maintain a tidy workspace by removing output directories from failed training runs. It intelligently preserves any directories that contain samples or models while removing empty ones. For cases where this automatic cleanup is not desired, it can be disabled by setting `NO_CLEAN=1`.

## Best Practices

1. **Naming Convention**: Use a consistent naming format:

   ```bash
   {model}-{dataset}-v{version}s{steps}
   ```

   Example: `noob-surrounded_by_penis-v1s2400`

2. **Directory Structure**:

   ```bash
   datasets/
   ├── dataset_name/
   │   ├── config.toml
   │   └── sample-prompts.txt
   output_dir/
   └── model_name/
       ├── repos.git
       ├── config.toml
       ├── sample-prompts.txt
       └── training_script.sh
   ```

3. **Version Control**: Always work in Git repositories for:
   - Training scripts
   - Dataset configurations
   - Custom training code

4. **Documentation**: Keep notes of:
   - Training parameters that worked well
   - Failed experiments and why they failed
   - Model performance observations

You can enable debug output with:

```bash
DEBUG=1 ./your_training_script.sh
```

## Additional Tips

For effective version control, always work with training scripts, dataset configurations, and custom training code in a Git repository. Commit changes to your training scripts before starting new training runs to ensure reproducibility.

Keep detailed notes about your training process, including training parameters that worked well, failed experiments and their reasons, and model performance observations. This helps with future optimization and avoiding mistakes.

For long-term preservation, regularly backup your training configurations, sample prompts, and Git repositories. For efficient experiment tracking, consider using additional tools like TensorBoard for visualizing training metrics, Git LFS for large file storage, or external experiment tracking platforms for documenting the entire process.

---

{{< related-posts related="docs/yiff_toolkit/lora_training/ | docs/audio/Audiogen Medium/ | docs/yiff_toolkit/lora_training/10-Minute-SDXL-LoRA-Training-for-the-Ultimate-Degenerates/" >}}
