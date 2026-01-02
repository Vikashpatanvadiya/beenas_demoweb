#!/bin/bash

# Image Optimization Script
# This script will optimize all images in the Collection folder
# It creates optimized versions while keeping originals as backup

set -e

COLLECTION_DIR="public/Collection"
BACKUP_DIR="public/Collection_backup"
QUALITY=85
MAX_WIDTH=1920
MAX_HEIGHT=1080

echo "🖼️  Starting image optimization..."

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo "📁 Creating backup directory..."
    cp -r "$COLLECTION_DIR" "$BACKUP_DIR"
    echo "✅ Backup created at $BACKUP_DIR"
fi

# Function to optimize a single image
optimize_image() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    echo "🔧 Optimizing: $file"
    
    # Get original size
    original_size=$(stat -f%z "$file" 2>/dev/null || echo "0")
    
    # Optimize with ImageMagick
    convert "$file" \
        -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
        -quality $QUALITY \
        -strip \
        -interlace Plane \
        "$temp_file"
    
    # Get new size
    new_size=$(stat -f%z "$temp_file" 2>/dev/null || echo "0")
    
    # Only replace if the new file is smaller
    if [ "$new_size" -lt "$original_size" ] && [ "$new_size" -gt 0 ]; then
        mv "$temp_file" "$file"
        reduction=$((100 - (new_size * 100 / original_size)))
        orig_mb=$((original_size / 1024 / 1024))
        new_mb=$((new_size / 1024 / 1024))
        echo "   ✅ Reduced by ${reduction}% (${orig_mb}MB → ${new_mb}MB)"
    else
        rm -f "$temp_file"
        echo "   ⚠️  No improvement, keeping original"
    fi
}

# Find and optimize all JPG files
echo "🔍 Finding images to optimize..."
total_files=0
optimized_files=0

while IFS= read -r -d '' file; do
    if [[ -f "$file" ]]; then
        total_files=$((total_files + 1))
        optimize_image "$file"
        optimized_files=$((optimized_files + 1))
    fi
done < <(find "$COLLECTION_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo ""
echo "🎉 Optimization complete!"
echo "📊 Processed $optimized_files out of $total_files images"
echo "💾 Original images backed up to $BACKUP_DIR"

# Calculate total space saved
if [ -d "$BACKUP_DIR" ]; then
    original_total=$(du -sk "$BACKUP_DIR" | cut -f1)
    new_total=$(du -sk "$COLLECTION_DIR" | cut -f1)
    saved=$((original_total - new_total))
    if [ $saved -gt 0 ]; then
        saved_mb=$((saved / 1024))
        echo "💰 Total space saved: ${saved_mb}MB"
    fi
fi

echo ""
echo "🔧 To create WebP versions for even better compression, run:"
echo "   ./scripts/create-webp.sh"