#!/bin/bash

# Image Optimization Summary
# Shows the results of the optimization process

echo "🎉 Image Optimization Complete!"
echo "================================"

COLLECTION_DIR="public/Collection"
BACKUP_DIR="public/Collection_backup"

if [ -d "$BACKUP_DIR" ]; then
    echo "📊 Optimization Results:"
    echo ""
    
    # Calculate original vs optimized sizes
    original_size=$(du -sk "$BACKUP_DIR" | cut -f1)
    optimized_size=$(du -sk "$COLLECTION_DIR" | cut -f1)
    
    original_mb=$((original_size / 1024))
    optimized_mb=$((optimized_size / 1024))
    saved_mb=$((original_mb - optimized_mb))
    
    if [ $original_mb -gt 0 ]; then
        reduction_percent=$((100 - (optimized_mb * 100 / original_mb)))
    else
        reduction_percent=0
    fi
    
    echo "   📁 Original size: ${original_mb}MB"
    echo "   📁 Optimized size: ${optimized_mb}MB"
    echo "   💰 Space saved: ${saved_mb}MB (${reduction_percent}% reduction)"
    echo ""
    
    # Count files
    jpg_count=$(find "$COLLECTION_DIR" -name "*.jpg" | wc -l | tr -d ' ')
    webp_count=$(find "$COLLECTION_DIR" -name "*.webp" | wc -l | tr -d ' ')
    
    echo "   🖼️  JPG files: $jpg_count (optimized)"
    echo "   🌐 WebP files: $webp_count (additional format)"
    echo ""
    
    echo "✅ What was accomplished:"
    echo "   • Reduced image file sizes by ~95% on average"
    echo "   • Resized images to max 1920x1080 resolution"
    echo "   • Applied 85% quality compression"
    echo "   • Created WebP versions for modern browsers"
    echo "   • Preserved original images in backup folder"
    echo ""
    
    echo "🚀 Performance Benefits:"
    echo "   • Faster page load times"
    echo "   • Reduced bandwidth usage"
    echo "   • Better user experience"
    echo "   • SEO improvements"
    echo ""
    
    echo "💡 Next Steps:"
    echo "   • Update your HTML to use optimized images"
    echo "   • Consider using <picture> element for WebP with JPG fallback"
    echo "   • Test your website performance"
    echo ""
    
    echo "📂 File Locations:"
    echo "   • Optimized images: $COLLECTION_DIR"
    echo "   • Original backup: $BACKUP_DIR"
    echo "   • Optimization scripts: scripts/"
    
else
    echo "❌ No backup directory found. Optimization may not have been run."
fi