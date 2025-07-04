import { LoadingSpinner } from './LoadingSpinner';

interface LoadingFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingFallback = ({ message = "Loading...", fullScreen = false }: LoadingFallbackProps) => {
  const containerClass = fullScreen 
    ? "min-h-screen bg-background flex items-center justify-center"
    : "flex items-center justify-center py-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
};