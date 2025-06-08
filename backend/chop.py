import os
from bs4 import BeautifulSoup
from pathlib import Path
import logging
import shutil
import re
from typing import Union

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clean_html(html_content: str) -> str:
    """
    Clean HTML content by removing non-essential elements while preserving <p> and <span> tags.
    Also handles JSON blocks and improves text cleaning.
    Returns plain text content.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove script and style elements
    for element in soup(['script', 'style', 'meta', 'link', 'button', 'nav', 'header', 'footer']):
        element.decompose()
    
    # Remove JSON blocks
    for element in soup.find_all(text=lambda text: isinstance(text, str) and text.strip().startswith('{')):
        element.replace_with('')
    
    # Keep only p and span tags, remove others but keep their content
    for tag in soup.find_all():
        if tag.name not in ['p', 'span']:
            tag.unwrap()
    
    # Get text content and clean it up
    text = soup.get_text(separator='\n', strip=True)
    
    # Clean up the text
    lines = []
    for line in text.splitlines():
        line = line.strip()
        # Skip empty lines and lines that are just JSON
        if not line or line.startswith('{'):
            continue
        # Skip lines that are just status messages
        if line.lower().startswith(('status is', 'request:', 'method:', 'headers:')):
            continue
        lines.append(line)
    
    # Join lines and remove multiple consecutive newlines
    text = '\n'.join(lines)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

def process_html_files(input_dir: Union[str, Path], output_dir: Union[str, Path], should_clean: bool = True) -> None:
    """
    Process all HTML files from input directory and save cleaned text versions to output directory.
    
    Args:
        input_dir: Path to directory containing HTML files to process
        output_dir: Path to directory where cleaned text files will be saved
    
    Example:
        from chop import process_html_files
        process_html_files('data', 'chopped/data')
    """
    input_dir = Path(input_dir)
    output_dir = Path(output_dir)
    
    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)
    if should_clean:
        clean_root_directory("data/chopped/data")
    
    # Process all HTML files in the input directory
    for input_path in input_dir.rglob('*.html'):
        try:
            # Calculate relative path from input directory
            rel_path = input_path.relative_to(input_dir)
            # Change extension from .html to .txt
            output_path = output_dir / rel_path.with_suffix('.txt')
            
            # Ensure output subdirectory exists
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Read and process file
            with open(input_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            cleaned_content = clean_html(content)
            
            # Write cleaned content as text
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(cleaned_content)
                
            logger.info(f"Successfully processed {input_path} -> {output_path}")
        except Exception as e:
            logger.error(f"Error processing {input_path}: {str(e)}")

def clean_root_directory(directory: Union[str, Path]) -> None:
    """
    Delete all files in the root of the specified directory while preserving subdirectories.
    
    Args:
        directory: Path to directory whose root files should be deleted
    """
    directory = Path(directory)
    if not directory.exists():
        return
        
    # Delete only files in the root directory
    for item in directory.iterdir():
        if item.is_file():
            try:
                item.unlink()
                logger.info(f"Deleted file: {item}")
            except Exception as e:
                logger.error(f"Error deleting file {item}: {str(e)}")
