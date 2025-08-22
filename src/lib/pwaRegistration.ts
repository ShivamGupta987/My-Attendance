// Service Worker Registration for PWA functionality
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('ServiceWorker registration successful with scope: ', registration.scope);

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 30000); // Check every 30 seconds

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available, prompt user to reload
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETE') {
          console.log('Background sync completed:', event.data.data);
          // You can show a toast notification here
        }
      });

    } catch (error) {
      console.log('ServiceWorker registration failed: ', error);
    }
  }
};

// Utility function to check if app is running as PWA
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

// Utility function to check online status
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Background sync functions
export const scheduleBackgroundSync = (tag: string): void => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return (registration as any).sync.register(tag);
    }).catch((error) => {
      console.error('Background sync registration failed:', error);
    });
  }
};

// Store data for offline sync
export const storeOfflineData = (key: string, data: any): void => {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify({
      data,
      timestamp: Date.now(),
      synced: false
    }));
  } catch (error) {
    console.error('Failed to store offline data:', error);
  }
};

// Get offline data
export const getOfflineData = (key: string): any | null => {
  try {
    const stored = localStorage.getItem(`offline_${key}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get offline data:', error);
    return null;
  }
};

// Clear synced offline data
export const clearSyncedOfflineData = (key: string): void => {
  try {
    localStorage.removeItem(`offline_${key}`);
  } catch (error) {
    console.error('Failed to clear offline data:', error);
  }
};