#!/bin/bash

# Verification Script for Image Optimization
# Checks if optimized images are properly integrated

echo "🔍 Verifying Image Optimization Integration"
echo "=========================================="

COLLECTION_DIR="public/Collection"
BACKUP_DIR="public/Collection_backup"

# Check if directories exist
if [ ! -d "$COLLECTION_DIR" ]; then
    echo "❌ Collection directory not found: $COLLECTION_DIR"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "✅ Directories found"
echo ""

# Count files
jpg_count=$(find "$COLLECTION_DIR" -name "*.jpg" | wc -l | tr -d ' ')
webp_count=$(find "$COLLECTION_DIR" -name "*.webp" | wc -l | tr -d ' ')
backup_count=$(find "$BACKUP_DIR" -name "*.jpg" | wc -l | tr -d ' ')

echo "📊 File Counts:"
echo "   Optimized JPG files: $jpg_count"
echo "   WebP files: $webp_count"
echo "   Backup files: $backup_count"
echo ""

# Check if counts match
if [ "$jpg_count" -eq "$webp_count" ] && [ "$jpg_count" -eq "$backup_count" ]; then
    echo "✅ File counts match - all images have been optimized"
else
    echo "⚠️  File counts don't match:"
    echo "   JPG: $jpg_count, WebP: $webp_count, Backup: $backup_count"
fi

echo ""

# Sample size comparison
echo "📏 Sample Size Comparison:"
sample_files=(
    "C1/1/1.jpg"
    "C2/1/1.jpg"
    "C3/1/1.jpg"
)

for file in "${sample_files[@]}"; do
    original="$BACKUP_DIR/$file"
    optimized="$COLLECTION_DIR/$file"
    webp="$COLLECTION_DIR/${file%.*}.webp"
    
    if [ -f "$original" ] && [ -f "$optimized" ] && [ -f "$webp" ]; then
        orig_size=$(stat -f%z "$original" 2>/dev/null || echo "0")
        opt_size=$(stat -f%z "$optimized" 2>/dev/null || echo "0")
        webp_size=$(stat -f%z "$webp" 2>/dev/null || echo "0")
        
        orig_mb=$((orig_size / 1024 / 1024))
        opt_mb=$((opt_size / 1024))
        webp_mb=$((webp_size / 1024))
        
        if [ $orig_size -gt 0 ]; then
            reduction=$((100 - (opt_size * 100 / orig_size)))
            webp_reduction=$((100 - (webp_size * 100 / orig_size)))
            
            echo "   $file:"
            echo "     Original: ${orig_mb}MB"
            echo "     Optimized JPG: ${opt_mb}KB (${reduction}% smaller)"
            echo "     WebP: ${webp_mb}KB (${webp_reduction}% smaller)"
        fi
    fi
done

echo ""

# Check React components
echo "🔧 Checking React Components:"

# Check if AdvancedImage component exists
if [ -f "src/components/ui/AdvancedImage.tsx" ]; then
    echo "   ✅ AdvancedImage component found"
else
    echo "   ❌ AdvancedImage component missing"
fi

# Check if OptimizedImage component exists
if [ -f "src/components/ui/OptimizedImage.tsx" ]; then
    echo "   ✅ OptimizedImage component found"
else
    echo "   ❌ OptimizedImage component missing"
fi

# Check if demo page exists
if [ -f "src/pages/ImageOptimizationDemo.tsx" ]; then
    echo "   ✅ Optimization demo page found"
else
    echo "   ❌ Optimization demo page missing"
fi

echo ""

# Check if HeroSection uses optimized images
if grep -q "\.webp" src/components/home/HeroSection.tsx 2>/dev/null; then
    echo "   ✅ HeroSection updated for WebP support"
else
    echo "   ⚠️  HeroSection may not be using WebP format"
fi

echo ""
echo "🎉 Verification Complete!"
echo ""
echo "💡 Next Steps:"
echo "   1. Start your development server: npm run dev"
echo "   2. Visit /optimization-demo to see the results"
echo "   3. Check browser Network tab to verify WebP loading"
echo "   4. Test on different devices and browsers"