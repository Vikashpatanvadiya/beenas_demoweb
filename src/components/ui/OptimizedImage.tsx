import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: 'high' | 'low';
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  showPerformance?: boolean;
}

/**
 * Optimized Image Component specifically for Collection images
 * Automatically serves WebP with JPG fallback for optimized images
 */
export const OptimizedImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  priority = 'low',
  onLoad,
  onError,
  style,
  showPerformance = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState(0);
  const [loadTime, setLoadTime] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP and JPG paths for Collection images
  const generateOptimizedPaths = (baseSrc: string) => {
    if (!baseSrc.startsWith('/Collection/')) {
      return { webp: baseSrc, jpg: baseSrc };
    }

    const basePath = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    
    return {
      webp: `${basePath}.webp`,
      jpg: baseSrc // Keep original JPG path as fallback
    };
  };

  const { webp, jpg } = generateOptimizedPaths(src);

  const handleLoad = () => {
    const endTime = performance.now();
    const duration = endTime - loadStartTime;
    setLoadTime(duration);
    setIsLoaded(true);
    onLoad?.();
    
    if (showPerformance && process.env.NODE_ENV === 'development') {
      console.log(`🚀 Optimized image loaded in ${duration.toFixed(2)}ms:`, src);
    }
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
    console.warn('❌ Optimized image failed to load:', src);
  };

  // Start timing when component mounts
  useEffect(() => {
    setLoadStartTime(performance.now());
  }, [src]);

  // Preload critical images
  useEffect(() => {
    if (loading === 'eager' && priority === 'high') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = webp;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [webp, loading, priority]);

  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-sm",
          className
        )}
        style={style}
      >
        Failed to load
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={style}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 animate-pulse",
            className
          )}
        />
      )}
      
      <picture>
        {/* WebP format - optimized version */}
        <source 
          srcSet={webp}
          type="image/webp"
        />
        
        {/* JPEG fallback - optimized version */}
        <img
          ref={imgRef}
          src={jpg}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={priority}
          className={cn(
            "transition-opacity duration-500 ease-out w-full h-full object-cover",
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>

      {/* Performance indicator (development only) */}
      {showPerformance && isLoaded && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          {loadTime.toFixed(0)}ms
        </div>
      )}
    </div>
  );
};