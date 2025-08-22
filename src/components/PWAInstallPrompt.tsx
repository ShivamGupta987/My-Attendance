import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const PWAInstallPrompt: React.FC = () => {
  const { showInstallPrompt, installApp, dismissInstallPrompt, isInstallable } = usePWA();

  if (!showInstallPrompt || !isInstallable) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 p-4 bg-gradient-primary border-primary/20 text-white shadow-float">
      <div className="flex items-start gap-3">
        <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">
            Install MyAttendance
          </h3>
          <p className="text-white/90 text-xs mb-3 leading-relaxed">
            Get quick access to your attendance tracker. Works offline and syncs when you're back online.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={installApp}
              size="sm"
              className="bg-white text-primary hover:bg-white/90 font-medium flex-1"
            >
              <Download className="w-4 h-4 mr-1" />
              Install
            </Button>
            <Button
              onClick={dismissInstallPrompt}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 px-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};