import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';
import { useOfflineDetection } from '@/hooks/useOfflineDetection';

export const OfflineIndicator = () => {
  const isOnline = useOfflineDetection();

  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're currently offline. Some features may not work properly.
      </AlertDescription>
    </Alert>
  );
};