#!/usr/bin/env python3

"""
Generate and update related posts for Hugo markdown content files.

This script analyzes markdown content files in a Hugo website structure and automatically
generates "related posts" recommendations based on content similarity. It uses TF-IDF
vectorization and cosine similarity to find semantically related content.

Algorithm Details:
The text processing phase begins by extracting content and metadata from markdown frontmatter,
including titles and summaries. Pages with titles starting with "(redirect)" are automatically
excluded. The text is then cleaned by removing code blocks, URLs, special characters, and digits.
To ensure comprehensive similarity analysis, the metadata is combined with the main content.
NLTK provides tokenization and stopword removal capabilities for enhanced text processing.

The vectorization process implements TF-IDF (Term Frequency-Inverse Document Frequency) using
scikit-learn's TfidfVectorizer. The vectorizer is configured to use both unigrams and bigrams
with an n-gram range of (1, 2), while removing English stopwords. To control dimensionality,
a maximum of 5000 features is enforced. This creates a sparse matrix representation of
document-term frequencies that efficiently captures the semantic relationships between documents.

Similarity computation starts by grouping documents by model category to ensure relevant
comparisons. The script then calculates pairwise cosine similarity between document vectors
to identify the top three most similar documents for each file. To provide transparency,
the system generates similarity explanations based on shared important terms, which are
selected by analyzing the highest TF-IDF scores.

Content organization maintains language-specific hierarchies for English, Japanese, and
Hungarian content. The system implements special case handling by excluding news.md files
and skipping root _index.md files. LoRA-related content receives special treatment by
being grouped by model type. All file paths are converted to Hugo-compatible references
to ensure proper integration with the website structure.

The output generation phase creates Hugo shortcodes containing related post references.
When updating existing files, the system preserves the original content while adding or
updating the related posts section. Path formatting follows Hugo's content organization
conventions, and the system handles multilingual content synchronization to maintain
consistency across different language versions.

The script provides several key capabilities: processing content in multiple languages
(English, Japanese, Hungarian), grouping content by model category for more relevant
recommendations, analyzing comprehensive document metadata including title, description,
and summary, explaining relationships between posts through shared important terms,
automatically updating Hugo shortcodes, and handling special cases like news pages
and root index files.

Usage:
    python generate_related_posts.py

Requirements:
    - nltk: For text processing and tokenization
    - scikit-learn: For TF-IDF vectorization and similarity calculations
    - python-frontmatter: For markdown metadata parsing
    - numpy: For numerical operations

The script expects a Hugo website structure with content organized in language-specific
directories (en, ja, hu) and properly formatted frontmatter in markdown files.
"""

import os
import glob
import nltk
import frontmatter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import numpy as np

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

def clean_text(text):
    """Clean and normalize text for better comparison."""
    # Remove code blocks
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
    # Remove URLs
    text = re.sub(r'http\S+|www.\S+', '', text)
    # Remove special characters and digits
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    return text.lower()

def get_content_files(base_path):
    """Get all markdown content files, excluding news and root index pages."""
    files = glob.glob(os.path.join(base_path, 'content/en/**/*.md'), recursive=True)
    
    # Filter out excluded files
    filtered_files = []
    for file_path in files:
        filename = os.path.basename(file_path)
        parent_dir = os.path.basename(os.path.dirname(file_path))
        
        # Skip news.md files
        if filename.lower() == 'news.md':
            continue
            
        # Skip only root _index.md (where parent directory is 'en')
        if filename == '_index.md' and parent_dir == 'en':
            continue
            
        filtered_files.append(file_path)
    
    return filtered_files

def process_content(file_path):
    """Extract and process content from markdown files."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            post = frontmatter.parse(content)
            
        # Combine title, description, summary and content for better matching
        metadata = post[0] if isinstance(post[0], dict) else {}
        title = metadata.get('title', '')
        
        # Skip redirect pages
        if title.startswith('(redirect)'):
            return None
            
        summary = metadata.get('summary', '')
        text = f"{title} {summary} {post[1]}"
        return {
            'title': title,
            'summary': summary,
            'content': post[1],
            'cleaned_text': clean_text(text)
        }
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return None

def get_important_terms(text, vectorizer, feature_names, n=5):
    """Get the most important terms in a text based on TF-IDF scores."""
    # Transform the text to get TF-IDF scores
    tfidf = vectorizer.transform([text])
    
    # Get indices of highest scoring terms
    importance = np.asarray(tfidf.sum(axis=0)).ravel()
    top_indices = importance.argsort()[-n:][::-1]
    
    # Return the terms and their scores
    return [(feature_names[i], importance[i]) for i in top_indices]

def explain_similarity(source_text, target_text, vectorizer, feature_names, similarity_score):
    """Generate an explanation of why two texts are similar."""
    # Get important terms for both texts
    source_terms = get_important_terms(source_text, vectorizer, feature_names)
    target_terms = get_important_terms(target_text, vectorizer, feature_names)
    
    # Find common important terms
    source_terms_dict = dict(source_terms)
    target_terms_dict = dict(target_terms)
    common_terms = set(source_terms_dict.keys()) & set(target_terms_dict.keys())
    
    explanation = f"Similarity score: {similarity_score:.2f}\n"
    if common_terms:
        explanation += "Common important terms:\n"
        for term in common_terms:
            explanation += f"- '{term}' (source score: {source_terms_dict[term]:.3f}, target score: {target_terms_dict[term]:.3f})\n"
    else:
        explanation += "No direct term overlap in top terms, but similar context detected.\n"
    
    return explanation

def get_model_category(file_path):
    """Determine which model category a lora belongs to."""
    parts = file_path.split(os.sep)
    if 'loras' not in parts:
        return None
        
    # Find the index after 'loras' in the path
    loras_idx = parts.index('loras')
    if len(parts) <= loras_idx + 1:
        return None
        
    model = parts[loras_idx + 1]
    
    # Map specific model directories to their categories
    model_categories = {
        'flux': 'flux',
        'noobai': 'noobai',
        'ponyxlv6': 'ponyxl',
        '3.5-large': 'sd3.5',
        'compassmix': 'compassmix'
    }
    
    return model_categories.get(model)

def find_related_posts(content_files, vectorizer):
    """Find related posts for each content file and explain relationships."""
    related_posts = {}
    
    # Group files by model category
    model_groups = {}
    for file_path in content_files:
        model = get_model_category(file_path)
        if model:
            if model not in model_groups:
                model_groups[model] = []
            model_groups[model].append(file_path)
    
    # Process each model group separately
    for model, model_files in model_groups.items():
        print(f"\nProcessing {model} model files...")
        
        # Process content for this model group
        contents = [process_content(f) for f in model_files]
        valid_data = [(f, c) for f, c in zip(model_files, contents) if c]
        
        if not valid_data:
            print(f"No valid content files found for {model}!")
            continue
        
        model_files, contents = zip(*valid_data)
        print(f"Successfully processed {len(contents)} files for {model}")
        
        # Get cleaned texts for vectorization
        cleaned_texts = [c['cleaned_text'] for c in contents]
        
        # Calculate TF-IDF matrix for this group
        tfidf_matrix = vectorizer.fit_transform(cleaned_texts)
        feature_names = vectorizer.get_feature_names_out()
        
        # Calculate similarity between documents in this group
        cosine_sim = cosine_similarity(tfidf_matrix)
        
        for idx, (file_path, content) in enumerate(zip(model_files, contents)):
            # Get top 3 similar documents (excluding self)
            similar_indices = cosine_sim[idx].argsort()[-4:-1][::-1]
            related = []
            
            print(f"\nAnalyzing related posts for: {os.path.basename(file_path)}")
            print(f"Title: {content['title']}")
            print(f"Model: {model}")
            
            for similar_idx in similar_indices:
                similar_file = model_files[similar_idx]
                similar_content = contents[similar_idx]
                similarity_score = cosine_sim[idx][similar_idx]
                
                explanation = explain_similarity(
                    content['cleaned_text'],
                    similar_content['cleaned_text'],
                    vectorizer,
                    feature_names,
                    similarity_score
                )
                
                print(f"\nRelated article: {os.path.basename(similar_file)}")
                print(f"Title: {similar_content['title']}")
                print(explanation)
                
                # Convert to relative path
                related.append(os.path.relpath(similar_file, 'content'))
            
            # Store the related posts
            file_path = os.path.relpath(file_path, 'content')
            related_posts[file_path] = related
            print("-" * 80)
    
    # Process non-lora files separately
    other_files = [f for f in content_files if not get_model_category(f)]
    if other_files:
        print("\nProcessing non-lora files...")
        contents = [process_content(f) for f in other_files]
        valid_data = [(f, c) for f, c in zip(other_files, contents) if c]
        
        if valid_data:
            other_files, contents = zip(*valid_data)
            print(f"Successfully processed {len(contents)} non-lora files")
            
            cleaned_texts = [c['cleaned_text'] for c in contents]
            tfidf_matrix = vectorizer.fit_transform(cleaned_texts)
            feature_names = vectorizer.get_feature_names_out()
            cosine_sim = cosine_similarity(tfidf_matrix)
            
            for idx, (file_path, content) in enumerate(zip(other_files, contents)):
                similar_indices = cosine_sim[idx].argsort()[-4:-1][::-1]
                related = []
                
                print(f"\nAnalyzing related posts for: {os.path.basename(file_path)}")
                print(f"Title: {content['title']}")
                
                for similar_idx in similar_indices:
                    similar_file = other_files[similar_idx]
                    similar_content = contents[similar_idx]
                    similarity_score = cosine_sim[idx][similar_idx]
                    
                    explanation = explain_similarity(
                        content['cleaned_text'],
                        similar_content['cleaned_text'],
                        vectorizer,
                        feature_names,
                        similarity_score
                    )
                    
                    print(f"\nRelated article: {os.path.basename(similar_file)}")
                    print(f"Title: {similar_content['title']}")
                    print(explanation)
                    
                    related.append(os.path.relpath(similar_file, 'content'))
                
                file_path = os.path.relpath(file_path, 'content')
                related_posts[file_path] = related
                print("-" * 80)
    
    return related_posts

def format_hugo_path(path):
    """Format a path for use in Hugo shortcodes."""
    # Convert Windows backslashes to forward slashes
    path = path.replace('\\', '/')
    # Remove content/ prefix if present
    path = path.replace('content/', '')
    # Remove .md extension
    path = path.replace('.md', '')
    # Get the first alias path from the frontmatter
    try:
        with open(os.path.join('content', path + '.md'), 'r', encoding='utf-8') as f:
            post = frontmatter.parse(f.read())
            metadata = post[0] if isinstance(post[0], dict) else {}
            aliases = metadata.get('aliases', [])
            if aliases:
                # Get the first alias that starts with /docs/
                for alias in aliases:
                    if alias.startswith('/docs/'):
                        return alias.lstrip('/')
                # If no /docs/ alias found, use the first one
                return aliases[0].lstrip('/')
    except Exception:
        pass
    
    # Fallback to the original path if no aliases found
    return path

def add_related_posts_shortcode(file_path, related_paths):
    """Add or update related posts shortcode in the file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert paths to Hugo references and join with pipe
        related_refs = [format_hugo_path(p) for p in related_paths]
        # Print debug info
        print(f"\nFormatted paths for {file_path}:")
        for ref in related_refs:
            print(f"  {ref}")
        shortcode = '{{< related-posts related="' + ' | '.join(related_refs) + '" >}}'
        
        # Remove any existing related-posts shortcode
        content = re.sub(r'\n*{{< related-posts.*?>}}\n*', '\n', content)
        
        # Add new shortcode at the end of the content
        content = content.rstrip() + '\n\n---\n\n' + shortcode + '\n'
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully updated related posts in {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {str(e)}")

def main():
    # Initialize TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        stop_words='english',
        max_features=5000,
        ngram_range=(1, 2)
    )
    
    print("Scanning for content files...")
    content_files = get_content_files('.')
    print(f"Found {len(content_files)} content files")
    
    print("\nFinding and analyzing related posts...")
    related_posts = find_related_posts(content_files, vectorizer)
    
    if not related_posts:
        print("No related posts found!")
        return
    
    print("\nAdding related posts shortcodes...")
    # Add related posts shortcode to files
    for file_path, related in related_posts.items():
        # Process English version
        en_path = os.path.join('content', file_path)
        if os.path.exists(en_path):
            add_related_posts_shortcode(en_path, related)
        
        # Process Japanese version
        ja_path = os.path.join('content/ja', file_path[3:])  # Remove 'en/' prefix
        if os.path.exists(ja_path):
            add_related_posts_shortcode(ja_path, related)
        
        # Process Hungarian version
        hu_path = os.path.join('content/hu', file_path[3:])  # Remove 'en/' prefix
        if os.path.exists(hu_path):
            add_related_posts_shortcode(hu_path, related)
    
    print("\nDone!")

if __name__ == '__main__':
    main() 