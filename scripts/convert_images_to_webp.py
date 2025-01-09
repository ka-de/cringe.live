#!/usr/bin/env python3

"""
Image Conversion and Optimization Script

This script converts images from /static/huggingface_images to optimized WebP format,
saving them in /static/images/lora with the following optimizations:
- Resizes images to max 1440p while maintaining aspect ratio
- Converts to WebP format with quality settings optimized for size
- Generates MD5 hash of original image for filename
- Maintains metadata mapping between original filenames and MD5 hashes in info.json
- Handles various input formats (PNG, JPG, JPEG, etc.)
- Maintains image quality while reducing file size
- Processes all images recursively from source directory

Usage:
    python convert_images_to_webp.py
"""

import os
import json
import hashlib
from pathlib import Path
from PIL import Image
import concurrent.futures
from threading import Lock

# Global metadata dict and lock for thread-safe updates
metadata_lock = Lock()
metadata = {}

def calculate_md5(file_path: str) -> str:
    """
    Calculate MD5 hash of a file.
    
    Args:
        file_path: Path to the file to hash
        
    Returns:
        MD5 hash string of the file
    """
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def calculate_new_dimensions(width: int, height: int, max_height: int = 1440) -> tuple[int, int]:
    """
    Calculate new dimensions maintaining aspect ratio with max height of 1440p.
    
    Args:
        width: Original image width
        height: Original image height
        max_height: Maximum allowed height (default: 1440)
        
    Returns:
        Tuple of (new_width, new_height)
    """
    if height <= max_height:
        return width, height
        
    aspect_ratio = width / height
    new_height = max_height
    new_width = int(aspect_ratio * new_height)
    
    return new_width, new_height

def process_image(src_path: str, dest_dir: str) -> None:
    """
    Process a single image: resize, convert to WebP, and save with MD5 filename.
    Also updates the metadata dictionary with original filename mapping.
    
    Args:
        src_path: Source image path
        dest_dir: Destination directory for converted images
    """
    try:
        # Generate MD5 hash for filename
        file_hash = calculate_md5(src_path)
        dest_path = os.path.join(dest_dir, f"{file_hash}.webp")
        
        # Get original filename and relative path from source directory
        src_path_obj = Path(src_path)
        relative_path = str(src_path_obj.relative_to(Path("static/huggingface_images")))
        
        # Update metadata with thread safety
        with metadata_lock:
            metadata[file_hash] = {
                "original_path": relative_path,
                "original_filename": src_path_obj.name
            }
        
        # Skip if already processed
        if os.path.exists(dest_path):
            return
            
        with Image.open(src_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
                
            # Calculate new dimensions
            new_width, new_height = calculate_new_dimensions(img.width, img.height)
            
            # Resize if necessary
            if new_width != img.width or new_height != img.height:
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save as WebP with optimized settings
            img.save(dest_path, 'WEBP', quality=85, method=6)
            
    except Exception as e:
        print(f"Error processing {src_path}: {str(e)}")

def save_metadata(dest_dir: str) -> None:
    """
    Save the metadata dictionary to info.json in the destination directory.
    
    Args:
        dest_dir: Destination directory where info.json will be saved
    """
    metadata_path = os.path.join(dest_dir, "info.json")
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

def main():
    """
    Main function to process all images in the source directory.
    Creates destination directory if it doesn't exist and processes all images
    using a thread pool for better performance.
    """
    src_dir = Path("static/huggingface_images")
    dest_dir = Path("static/images/lora")
    
    # Create destination directory if it doesn't exist
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Load existing metadata if it exists
    metadata_path = dest_dir / "info.json"
    if metadata_path.exists():
        with open(metadata_path, 'r', encoding='utf-8') as f:
            metadata.update(json.load(f))
    
    # Collect all image files
    image_files = []
    for ext in ('*.png', '*.jpg', '*.jpeg', '*.PNG', '*.JPG', '*.JPEG'):
        image_files.extend(src_dir.rglob(ext))
    
    # Process images in parallel
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(process_image, str(img_path), str(dest_dir))
            for img_path in image_files
        ]
        concurrent.futures.wait(futures)
    
    # Save metadata after all processing is complete
    save_metadata(str(dest_dir))

if __name__ == "__main__":
    main() 