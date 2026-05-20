// src/sw.ts
// Service Worker for ConvertHub PWA
//
// Responsabilidades:
// - Caching de recursos (offline)
// - Actualización de tasas en background
// - Push notifications (futuro)
// - Sync en background (futuro)

const CACHE_NAME = 'converthub-v1.0.0';
const RUNTIME_CACHE = 'converthub-runtime-v1';
const API_CACHE = 'converthub-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.png',
];

/**
 * Install event - cachear assets estáticos
 */
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('✅ Service Worker installing...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return (self as any).skipWaiting();
      })
  );
});

/**
 * Activate event - limpiar caches viejos
 */
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('🔄 Service Worker activating...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches viejos
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('🗑️  Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return (self as any).clients.claim();
      })
  );
});

/**
 * Fetch event - interceptar requests
 * Estrategia: Stale-while-revalidate
 */
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar requests no-http(s)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - Network first, fallback to cache
  if (url.hostname === 'api.exchangerate-api.com') {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Static assets - Cache first, fallback to network
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image'
  ) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // HTML and other resources - Network first, fallback to cache
  event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
});

/**
 * Cache-first strategy
 * Usar cache si existe, si no descargar
 */
async function cacheFirstStrategy(
  request: Request,
  cacheName: string
): Promise<Response> {
  try {
    // Buscar en cache
    const cached = await caches.match(request);
    if (cached) {
      console.log('📦 Served from cache:', request.url);
      return cached;
    }

    // Descargar si no está en cache
    const response = await fetch(request);

    // Guardar en cache si es 200
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('❌ Fetch failed:', request.url, error);

    // Fallback offline
    const offlineResponse = new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
    });

    return offlineResponse;
  }
}

/**
 * Network-first strategy
 * Intentar descargar primero, fallback a cache
 */
async function networkFirstStrategy(
  request: Request,
  cacheName: string
): Promise<Response> {
  try {
    // Intentar descargar
    const response = await Promise.race([
      fetch(request),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), 5000)
      ),
    ]);

    // Guardar en cache si es 200
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('🔄 Network failed, using cache:', request.url);

    // Fallback a cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Sin cache disponible
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Background sync (futuro)
 * Sincronizar datos cuando vuelve conexión
 */
self.addEventListener('sync', (event: any) => {
  console.log('🔄 Background sync event:', event.tag);

  if (event.tag === 'update-rates') {
    event.waitUntil(updateExchangeRates());
  }
});

/**
 * Actualizar tasas de cambio en background
 */
async function updateExchangeRates(): Promise<void> {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD'
    );

    if (response.ok) {
      const data = await response.json();

      // Guardar en IndexedDB o localStorage
      const cache = await caches.open(API_CACHE);
      cache.put(
        'https://api.exchangerate-api.com/v4/latest/USD',
        new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      console.log('✅ Exchange rates updated');

      // Notificar a clientes
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'RATES_UPDATED',
            data: data,
          });
        });
      });
    }
  } catch (error) {
    console.error('❌ Failed to update rates:', error);
  }
}

/**
 * Push notifications (futuro)
 */
self.addEventListener('push', (event: PushEvent) => {
  console.log('📢 Push notification received');

  const data = event.data?.json() || {};
  const options: NotificationOptions = {
    body: data.body || 'ConvertHub',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'converthub',
  };

  event.waitUntil(self.registration.showNotification('ConvertHub', options));
});

/**
 * Notification click
 */
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  console.log('👆 Notification clicked');
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].url === '/' && 'focus' in clients[i]) {
          return (clients[i] as any).focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

console.log('🚀 Service Worker loaded');

export {}; // Make this a module
