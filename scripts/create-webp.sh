#!/bin/bash

# WebP Conversion Script
# This script creates WebP versions of all JPG images for better compression
# WebP typically provides 25-35% better compression than JPEG

set -e

COLLECTION_DIR="public/Collection"
WEBP_QUALITY=80

echo "🌐 Creating WebP versions of images..."

# Function to convert image to WebP
convert_to_webp() {
    local jpg_file="$1"
    local webp_file="${jpg_file%.*}.webp"
    
    # Skip if WebP already exists and is newer
    if [[ -f "$webp_file" ]] && [[ "$webp_file" -nt "$jpg_file" ]]; then
        echo "   ⏭️  Skipping $webp_file (already exists and newer)"
        return
    fi
    
    echo "🔄 Converting: $jpg_file → $webp_file"
    
    # Convert to WebP
    cwebp -q $WEBP_QUALITY "$jpg_file" -o "$webp_file"
    
    # Compare sizes
    jpg_size=$(stat -f%z "$jpg_file" 2>/dev/null || echo "0")
    webp_size=$(stat -f%z "$webp_file" 2>/dev/null || echo "0")
    
    if [ "$webp_size" -gt 0 ] && [ "$jpg_size" -gt 0 ]; then
        reduction=$((100 - (webp_size * 100 / jpg_size)))
        jpg_mb=$((jpg_size / 1024 / 1024))
        webp_mb=$((webp_size / 1024 / 1024))
        echo "   ✅ WebP is ${reduction}% smaller (${jpg_mb}MB → ${webp_mb}MB)"
    fi
}

# Find and convert all JPG files
echo "🔍 Finding JPG images to convert..."
total_files=0
converted_files=0

while IFS= read -r -d '' file; do
    if [[ -f "$file" ]]; then
        total_files=$((total_files + 1))
        convert_to_webp "$file"
        converted_files=$((converted_files + 1))
    fi
done < <(find "$COLLECTION_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo ""
echo "🎉 WebP conversion complete!"
echo "📊 Processed $converted_files out of $total_files images"
echo ""
echo "💡 Tips for using WebP images:"
echo "   • Use <picture> element with fallback to JPG"
echo "   • WebP has ~95% browser support (all modern browsers)"
echo "   • Consider serving WebP to supported browsers, JPG as fallback"