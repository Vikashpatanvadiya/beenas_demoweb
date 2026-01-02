#!/bin/bash

# Image Size Analysis Script
# Shows current sizes and statistics of images in the Collection

COLLECTION_DIR="public/Collection"

echo "📊 Image Size Analysis for $COLLECTION_DIR"
echo "================================================"

total_size=0
file_count=0
largest_file=""
largest_size=0

echo "📁 Analyzing images..."

while IFS= read -r -d '' file; do
    if [[ -f "$file" ]]; then
        size=$(stat -f%z "$file" 2>/dev/null || echo "0")
        total_size=$((total_size + size))
        file_count=$((file_count + 1))
        
        if [ "$size" -gt "$largest_size" ]; then
            largest_size=$size
            largest_file=$file
        fi
        
        # Show files larger than 2MB
        if [ "$size" -gt 2097152 ]; then
            size_mb=$((size / 1024 / 1024))
            echo "🔴 Large file: $file (${size_mb}MB)"
        fi
    fi
done < <(find "$COLLECTION_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo ""
echo "📈 Summary:"
echo "   Total files: $file_count"
total_mb=$((total_size / 1024 / 1024))
echo "   Total size: ${total_mb}MB"
if [ $file_count -gt 0 ]; then
    avg_size=$((total_size / file_count))
    avg_mb=$((avg_size / 1024 / 1024))
    echo "   Average size: ${avg_mb}MB"
fi
if [ -n "$largest_file" ]; then
    largest_mb=$((largest_size / 1024 / 1024))
    echo "   Largest file: $largest_file (${largest_mb}MB)"
fi

echo ""
echo "💡 Recommendations:"
if [ $file_count -gt 0 ]; then
    avg_size=$((total_size / file_count))
    if [ $avg_size -gt 1048576 ]; then  # > 1MB
        echo "   • Images are quite large - optimization recommended"
        echo "   • Run ./scripts/optimize-images.sh to reduce sizes"
        echo "   • Consider ./scripts/create-webp.sh for WebP versions"
    elif [ $avg_size -gt 524288 ]; then  # > 512KB
        echo "   • Images are moderately sized - optimization could help"
        echo "   • Run ./scripts/optimize-images.sh for better performance"
    else
        echo "   • Images are reasonably sized"
    fi
fi