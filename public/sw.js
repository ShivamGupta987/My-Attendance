const CACHE_NAME = 'myattendance-v1.0.0';
const STATIC_CACHE_NAME = 'myattendance-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'myattendance-dynamic-v1.0.0';

// Files to cache immediately (critical for offline functionality)
const STATIC_ASSETS = [
  '/',
  '/demo',
  '/auth',
  '/dashboard',
  '/timetable',
  '/attendance',
  '/analytics',
  '/about',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add more static assets as needed
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/api\/.*$/,
  /https:\/\/.*\.supabase\.co\/.*$/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle API requests with network-first strategy
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request));
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(request));
});

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline data or error response
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true,
        message: 'This data will sync when you\'re back online'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch:', request.url);
    
    // Return a fallback for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Image Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Navigation strategy for page requests
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Navigation failed, trying cache for:', request.url);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try to serve the main app shell
    const appShell = await caches.match('/');
    if (appShell) {
      return appShell;
    }
    
    // Fallback to offline page
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Last resort - return a basic offline response
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>MyAttendance - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0; 
              background: #0f0f23; 
              color: white; 
              text-align: center; 
            }
            .container { max-width: 400px; padding: 2rem; }
            h1 { color: #3b82f6; margin-bottom: 1rem; }
            p { line-height: 1.6; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📚 MyAttendance</h1>
            <h2>You're Offline</h2>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()" style="
              background: #3b82f6; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              cursor: pointer; 
              margin-top: 1rem;
            ">Try Again</button>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'attendance-sync') {
    event.waitUntil(syncAttendanceData());
  }
  
  if (event.tag === 'timetable-sync') {
    event.waitUntil(syncTimetableData());
  }
});

// Sync attendance data when back online
async function syncAttendanceData() {
  try {
    console.log('Service Worker: Syncing attendance data...');
    
    // Get pending attendance data from IndexedDB
    const pendingData = await getPendingAttendanceData();
    
    if (pendingData.length > 0) {
      // Send data to server
      for (const data of pendingData) {
        try {
          const response = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            await removePendingAttendanceData(data.id);
            console.log('Service Worker: Synced attendance record:', data.id);
          }
        } catch (error) {
          console.error('Service Worker: Failed to sync attendance record:', error);
        }
      }
      
      // Notify all clients about successful sync
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: { type: 'attendance', count: pendingData.length }
        });
      });
    }
  } catch (error) {
    console.error('Service Worker: Error syncing attendance data:', error);
  }
}

// Sync timetable data when back online
async function syncTimetableData() {
  try {
    console.log('Service Worker: Syncing timetable data...');
    // Similar implementation for timetable sync
  } catch (error) {
    console.error('Service Worker: Error syncing timetable data:', error);
  }
}

// IndexedDB helpers (placeholder - implement based on your data structure)
async function getPendingAttendanceData() {
  // Implementation depends on your IndexedDB structure
  return [];
}

async function removePendingAttendanceData(id) {
  // Implementation depends on your IndexedDB structure
  console.log('Removing synced data:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'MyAttendance notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MyAttendance', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Notification closed
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});