#!/bin/bash

# Script to rename all audio files to lowercase with dashes instead of spaces
# This preserves git history by using git mv

set -e  # Exit on error

echo "Starting audio file renaming process..."
echo "This will preserve git history using 'git mv'"
echo ""

# Function to convert filename to lowercase with dashes
convert_filename() {
    local filename="$1"
    # Convert to lowercase and replace spaces with dashes
    # Also handle special characters
    echo "$filename" | tr '[:upper:]' '[:lower:]' | \
        sed 's/ /-/g' | \
        sed 's/_/-/g' | \
        sed "s/'//g" | \
        sed 's/!//g' | \
        sed 's/(//g' | \
        sed 's/)//g' | \
        sed 's/,//g' | \
        sed 's/\.\./-/g' | \
        sed 's/--/-/g' | \
        sed 's/---/-/g'
}

# Find all audio files and rename them
find public/audio -type f \( -name "*.mp3" -o -name "*.m4a" \) | while read -r filepath; do
    # Get directory and filename
    dir=$(dirname "$filepath")
    filename=$(basename "$filepath")
    extension="${filename##*.}"
    basename="${filename%.*}"
    
    # Convert basename to new format
    new_basename=$(convert_filename "$basename")
    new_filename="${new_basename}.${extension}"
    new_filepath="${dir}/${new_filename}"
    
    # Only rename if the filename actually changed
    if [ "$filepath" != "$new_filepath" ]; then
        echo "Renaming: $filepath"
        echo "      to: $new_filepath"
        git mv "$filepath" "$new_filepath"
        echo ""
    fi
done

echo "All audio files have been renamed!"
echo "Changes are staged in git. Review with 'git status' and commit when ready."

# Made with Bob
