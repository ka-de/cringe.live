#!/usr/bin/env python3

import os
from jsmin import jsmin

def minify_blurhash():
    # Get the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Get the project root directory (parent of script directory)
    root_dir = os.path.dirname(script_dir)
    
    # Input and output file paths
    input_path = os.path.join(root_dir, 'themes', 'cringe-theme', 'static', 'blurhash.js')
    output_path = os.path.join(root_dir, 'themes', 'cringe-theme', 'static', 'blurhash.min.js')
    
    try:
        # Read the input file
        with open(input_path, 'r', encoding='utf-8') as input_file:
            js_content = input_file.read()
        
        # Minify the JavaScript
        minified = jsmin(js_content)
        
        # Write the minified content to the output file
        with open(output_path, 'w', encoding='utf-8') as output_file:
            output_file.write(minified)
        
        print(f"Successfully minified {input_path} to {output_path}")
        
        # Calculate size reduction
        original_size = len(js_content)
        minified_size = len(minified)
        reduction = (1 - minified_size / original_size) * 100
        
        print(f"Original size: {original_size:,} bytes")
        print(f"Minified size: {minified_size:,} bytes")
        print(f"Size reduction: {reduction:.1f}%")
        
    except Exception as e:
        print(f"Error during minification: {str(e)}")

if __name__ == "__main__":
    minify_blurhash() 