import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning text-warning-foreground px-4 py-2 text-center text-sm font-medium shadow-soft">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>You're offline. Changes will sync when connection is restored.</span>
      </div>
    </div>
  );
};