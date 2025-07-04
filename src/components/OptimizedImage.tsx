import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  fallback = '/placeholder.svg',
  loading = 'lazy',
  width,
  height 
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={hasError ? fallback : src}
        alt={alt}
        loading={loading}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};