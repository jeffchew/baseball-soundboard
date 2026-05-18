#!/usr/bin/env python3
"""
Script to update config.js with new lowercase-dash filenames
"""

import re

def convert_filename(filename):
    """Convert filename to lowercase with dashes"""
    # Remove extension
    name = filename.rsplit('.', 1)[0] if '.' in filename else filename
    
    # Convert to lowercase
    name = name.lower()
    
    # Replace spaces and underscores with dashes
    name = name.replace(' ', '-').replace('_', '-')
    
    # Remove special characters
    name = name.replace("'", '').replace('!', '').replace('(', '').replace(')', '').replace(',', '')
    
    # Fix multiple dashes
    while '--' in name:
        name = name.replace('--', '-')
    while '---' in name:
        name = name.replace('---', '-')
    
    # Add extension back
    ext = filename.rsplit('.', 1)[1] if '.' in filename else 'mp3'
    return f"{name}.{ext}"

def update_config():
    """Update config.js with new filenames"""
    
    # Read the config file
    with open('src/config.js', 'r') as f:
        content = f.read()
    
    # Create backup
    with open('src/config.js.backup', 'w') as f:
        f.write(content)
    
    # Find all audio file references
    pattern = r"audioUrl\('(/audio/[^']+)'\)"
    
    def replace_path(match):
        old_path = match.group(1)
        # Split path into directory and filename
        parts = old_path.rsplit('/', 1)
        if len(parts) == 2:
            directory, filename = parts
            new_filename = convert_filename(filename)
            new_path = f"{directory}/{new_filename}"
            return f"audioUrl('{new_path}')"
        return match.group(0)
    
    # Replace all paths
    new_content = re.sub(pattern, replace_path, content)
    
    # Write updated content
    with open('src/config.js', 'w') as f:
        f.write(new_content)
    
    print("✓ Config file updated successfully!")
    print("✓ Backup saved as src/config.js.backup")

if __name__ == '__main__':
    update_config()


