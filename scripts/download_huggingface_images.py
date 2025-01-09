import os
import re
import requests
from pathlib import Path
from urllib.parse import urlparse, unquote
import concurrent.futures
import argparse

def extract_huggingface_urls(content):
    # Pattern to match Hugging Face URLs in markdown/HTML
    pattern = r'https://huggingface\.co/[^"\'\s>)]+(?:png|jpg|jpeg|gif|webp)'
    return re.findall(pattern, content)

def download_image(url, output_dir):
    try:
        # Parse URL and create directory structure
        parsed_url = urlparse(url)
        path_parts = unquote(parsed_url.path).split('/')
        
        # Skip the first empty part and 'resolve/main' if present
        clean_parts = [p for p in path_parts if p and p not in ('resolve', 'main')]
        
        # Create the output directory path
        output_path = output_dir.joinpath(*clean_parts[:-1])
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Full path for the image
        image_path = output_path / path_parts[-1]
        
        # Skip if already downloaded
        if image_path.exists():
            print(f"Skipping existing file: {image_path}")
            return
        
        # Download the image
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(image_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"Downloaded: {image_path}")
        
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description='Download Hugging Face images from markdown files')
    parser.add_argument('--content-dir', default='content', help='Content directory path')
    parser.add_argument('--output-dir', default='static/huggingface_images', help='Output directory for downloaded images')
    parser.add_argument('--max-workers', type=int, default=5, help='Maximum number of concurrent downloads')
    args = parser.parse_args()

    content_dir = Path(args.content_dir)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Find all markdown files
    markdown_files = list(content_dir.rglob('*.md'))
    all_urls = set()

    # Extract URLs from all markdown files
    for md_file in markdown_files:
        try:
            content = md_file.read_text(encoding='utf-8')
            urls = extract_huggingface_urls(content)
            all_urls.update(urls)
        except Exception as e:
            print(f"Error reading {md_file}: {str(e)}")

    print(f"Found {len(all_urls)} unique Hugging Face image URLs")

    # Download images in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.max_workers) as executor:
        futures = [
            executor.submit(download_image, url, output_dir)
            for url in all_urls
        ]
        concurrent.futures.wait(futures)

    print("Download complete!")

if __name__ == '__main__':
    main() 