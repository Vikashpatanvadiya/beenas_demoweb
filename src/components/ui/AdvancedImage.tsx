import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdvancedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: 'high' | 'low';
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  placeholder?: boolean;
  blurDataURL?: string;
}

/**
 * Advanced Image Component with:
 * - AVIF/WebP/JPEG format selection
 * - Responsive sizes
 * - Blur-up placeholder
 * - Progressive loading
 * - Performance monitoring
 */
export const AdvancedImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  priority = 'low',
  sizes = '(max-width: 640px) 400px, (max-width: 1024px) 600px, (max-width: 1280px) 800px, 1200px',
  onLoad,
  onError,
  style,
  placeholder = true,
  blurDataURL,
  ...props
}: AdvancedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image sources
  const generateSources = (baseSrc: string) => {
    if (!baseSrc.startsWith('/Collection/')) {
      return { webp: baseSrc, jpeg: baseSrc };
    }

    const basePath = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    
    return {
      webp: `${basePath}.webp`,
      jpeg: baseSrc // Keep original JPG path
    };
  };

  const sources = generateSources(src);

  const handleLoad = () => {
    const loadTime = performance.now() - loadStartTime;
    setIsLoaded(true);
    onLoad?.();
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🖼️ Advanced image loaded in ${loadTime.toFixed(2)}ms:`, src);
    }
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
    console.warn('❌ Advanced image failed to load:', src);
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
      link.href = sources.webp;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [src, loading, priority, sources]);

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
      {/* Blur placeholder */}
      {placeholder && !isLoaded && (
        <>
          {blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className={cn(
                "absolute inset-0 w-full h-full object-cover blur-sm scale-110 transition-opacity duration-300",
                isLoaded && "opacity-0",
                className
              )}
            />
          ) : (
            <div 
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 animate-pulse",
                className
              )}
            />
          )}
        </>
      )}
      
      <picture>
        {/* WebP format - better compression */}
        <source 
          srcSet={sources.webp}
          type="image/webp"
        />
        
        {/* JPEG fallback */}
        <img
          ref={imgRef}
          src={sources.jpeg}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={priority}
          className={cn(
            "transition-opacity duration-500 ease-out",
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>
    </div>
  );
};