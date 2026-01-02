import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const demoImages = [
  {
    name: 'C1 Collection - Image 1',
    original: '/Collection_backup/C1/1/1.jpg',
    optimized: '/Collection/C1/1/1.jpg',
    webp: '/Collection/C1/1/1.webp'
  },
  {
    name: 'C2 Collection - Image 1',
    original: '/Collection_backup/C2/1/1.jpg',
    optimized: '/Collection/C2/1/1.jpg',
    webp: '/Collection/C2/1/1.webp'
  },
  {
    name: 'C3 Collection - Image 1',
    original: '/Collection_backup/C3/1/1.jpg',
    optimized: '/Collection/C3/1/1.jpg',
    webp: '/Collection/C3/1/1.webp'
  }
];

export const ImageOptimizationDemo = () => {
  const [selectedFormat, setSelectedFormat] = useState<'original' | 'optimized' | 'webp'>('optimized');

  const getImageSrc = (image: typeof demoImages[0]) => {
    switch (selectedFormat) {
      case 'original':
        return image.original;
      case 'webp':
        return image.webp;
      default:
        return image.optimized;
    }
  };

  const getFormatInfo = () => {
    switch (selectedFormat) {
      case 'original':
        return { label: 'Original JPG', color: 'destructive', size: '~3-4MB each' };
      case 'webp':
        return { label: 'WebP Format', color: 'default', size: '~80-150KB each' };
      default:
        return { label: 'Optimized JPG', color: 'secondary', size: '~150-300KB each' };
    }
  };

  const formatInfo = getFormatInfo();

  return (
    <div className="container mx-auto container-padding py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-display-medium mb-4">Image Optimization Demo</h1>
          <p className="text-body-large text-muted-foreground mb-6">
            See the dramatic difference in file sizes while maintaining visual quality
          </p>
          
          {/* Format Selection */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Button
              variant={selectedFormat === 'original' ? 'default' : 'outline'}
              onClick={() => setSelectedFormat('original')}
              className="min-w-[120px]"
            >
              Original JPG
              <Badge variant="destructive" className="ml-2">3-4MB</Badge>
            </Button>
            <Button
              variant={selectedFormat === 'optimized' ? 'default' : 'outline'}
              onClick={() => setSelectedFormat('optimized')}
              className="min-w-[120px]"
            >
              Optimized JPG
              <Badge variant="secondary" className="ml-2">150-300KB</Badge>
            </Button>
            <Button
              variant={selectedFormat === 'webp' ? 'default' : 'outline'}
              onClick={() => setSelectedFormat('webp')}
              className="min-w-[120px]"
            >
              WebP Format
              <Badge variant="default" className="ml-2">80-150KB</Badge>
            </Button>
          </div>

          <div className="text-center mb-8">
            <Badge variant={formatInfo.color as any} className="text-sm px-4 py-2">
              Currently viewing: {formatInfo.label} ({formatInfo.size})
            </Badge>
          </div>
        </div>

        {/* Optimization Results Summary */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <h2 className="font-serif text-heading-medium mb-4 text-center">Optimization Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">447MB → 33MB</div>
              <div className="text-sm text-muted-foreground">Total Size Reduction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">93% Smaller</div>
              <div className="text-sm text-muted-foreground">Space Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">113 Images</div>
              <div className="text-sm text-muted-foreground">Optimized</div>
            </div>
          </div>
        </Card>

        {/* Image Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoImages.map((image, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <OptimizedImage
                  src={getImageSrc(image)}
                  alt={image.name}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  priority={index === 0 ? 'high' : 'low'}
                  showPerformance={true}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{image.name}</h3>
                <div className="text-sm text-muted-foreground">
                  Format: <Badge variant="outline" className="ml-1">{formatInfo.label}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Performance Benefits */}
        <Card className="p-6 mt-8">
          <h2 className="font-serif text-heading-medium mb-4">Performance Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-green-600">✅ What We Achieved</h3>
              <ul className="space-y-2 text-sm">
                <li>• Reduced image sizes by 93% on average</li>
                <li>• Maintained visual quality with 85% compression</li>
                <li>• Created WebP versions for modern browsers</li>
                <li>• Resized to optimal web dimensions (max 1920x1080)</li>
                <li>• Stripped unnecessary metadata</li>
                <li>• Preserved originals in backup folder</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-blue-600">🚀 Performance Impact</h3>
              <ul className="space-y-2 text-sm">
                <li>• Dramatically faster page load times</li>
                <li>• Reduced bandwidth usage by 93%</li>
                <li>• Better mobile experience</li>
                <li>• Improved SEO scores</li>
                <li>• Enhanced user experience</li>
                <li>• Lower hosting costs</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Technical Implementation */}
        <Card className="p-6 mt-8">
          <h2 className="font-serif text-heading-medium mb-4">Technical Implementation</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Automatic Format Selection</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our AdvancedImage component automatically serves the best format for each browser:
            </p>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`<picture>
  <source srcSet="/Collection/C1/1/1.webp" type="image/webp" />
  <img src="/Collection/C1/1/1.jpg" alt="Product" loading="lazy" />
</picture>`}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};