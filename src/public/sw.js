// 🏥 Service Worker - Sistema de Inventario Médico
// Clínica Juan Carlos Ojeda Gallardo
// Version: 1.0.0

const CACHE_VERSION = 'clinica-inventario-v1.0.0';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_INMUTABLE = `${CACHE_VERSION}-inmutable`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/assets/index.css',
  '/assets/index.js'
];

const INMUTABLE_URLS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'https://fonts.gstatic.com'
];

const MAX_DYNAMIC_CACHE_SIZE = 50;

// ============================================================
// 1️⃣ EVENTO INSTALL - Instalación del Service Worker
// ============================================================
self.addEventListener('install', (event) => {
  console.log('🔧 [SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then((cache) => {
        console.log('📦 [SW] Precacheando archivos estáticos...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ [SW] Archivos estáticos cacheados correctamente');
        // Forzar activación inmediata
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ [SW] Error durante instalación:', error);
      })
  );
});

// ============================================================
// EVENTO ACTIVATE - Activación y Limpieza de Cache
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('🔄 [SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('🧹 [SW] Limpiando cachés antiguos...');
        
        // Eliminar cachés que no coinciden con la versión actual
        const cachesToDelete = cacheNames.filter((cacheName) => {
          return cacheName.startsWith('clinica-inventario-') && 
                 cacheName !== CACHE_STATIC && 
                 cacheName !== CACHE_DYNAMIC && 
                 cacheName !== CACHE_INMUTABLE;
        });
        
        console.log(`🗑️ [SW] Cachés a eliminar:`, cachesToDelete);
        
        return Promise.all(
          cachesToDelete.map((cacheName) => {
            console.log(`🗑️ [SW] Eliminando caché: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('✅ [SW] Limpieza de caché completada');
        // Tomar control de todas las páginas inmediatamente
        return self.clients.claim();
      })
      .then(() => {
        console.log('✅ [SW] Service Worker activado y en control');
      })
      .catch((error) => {
        console.error('❌ [SW] Error durante activación:', error);
      })
  );
});

// ============================================================
// EVENTO FETCH - Interceptar peticiones
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estrategia según el tipo de recurso
  
  // 🔵 Cache First para recursos inmutables (fuentes, etc)
  if (isInmutableResource(url)) {
    event.respondWith(cacheFirst(request, CACHE_INMUTABLE));
    return;
  }
  
  // 🔵 Cache First para archivos estáticos
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, CACHE_STATIC));
    return;
  }
  
  // 🔵 Network First para HTML y API calls
  if (request.mode === 'navigate' || isAPICall(url)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // 🔵 Cache with Network Fallback para otros recursos
  event.respondWith(cacheWithNetworkFallback(request));
});

// ============================================================
// ESTRATEGIAS DE CACHÉ
// ============================================================

/**
 * Cache First: Busca primero en caché, si no está, va a la red
 * Ideal para: Fuentes, imágenes, CSS, JS
 */
async function cacheFirst(request, cacheName) {
  try {
    // Buscar en caché
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 [SW] Sirviendo desde caché:', request.url);
      return cachedResponse;
    }
    
    // Si no está en caché, ir a la red
    console.log('🌐 [SW] No en caché, obteniendo de red:', request.url);
    const networkResponse = await fetch(request);
    
    // Cachear la respuesta
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ [SW] Error en cacheFirst:', error);
    // Retornar fallback si existe
    return getFallbackResponse(request);
  }
}

/**
 * Network First: Intenta primero la red, si falla usa caché
 * Ideal para: HTML, datos dinámicos, API calls
 */
async function networkFirst(request) {
  try {
    console.log('🌐 [SW] Intentando red primero:', request.url);
    
    // Timeout para evitar esperas largas
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), 5000);
    });
    
    const networkResponse = await Promise.race([
      fetch(request),
      timeoutPromise
    ]);
    
    // Cachear respuesta exitosa
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_DYNAMIC);
      cache.put(request, networkResponse.clone());
      
      // Limpiar caché dinámica si excede el límite
      await cleanDynamicCache();
    }
    
    return networkResponse;
  } catch (error) {
    console.log('⚠️ [SW] Red falló, buscando en caché:', request.url);
    
    // Si falla la red, buscar en caché
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si tampoco está en caché, retornar fallback
    return getFallbackResponse(request);
  }
}

/**
 * Cache with Network Fallback: Caché primero, red como respaldo
 * Ideal para: Imágenes, iconos, recursos opcionales
 */
async function cacheWithNetworkFallback(request) {
  try {
    // Buscar en caché
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 [SW] Sirviendo desde caché:', request.url);
      
      // Actualizar en segundo plano (stale-while-revalidate)
      fetch(request).then((response) => {
        if (response && response.status === 200) {
          caches.open(CACHE_DYNAMIC).then((cache) => {
            cache.put(request, response);
          });
        }
      });
      
      return cachedResponse;
    }
    
    // Si no está en caché, ir a la red
    console.log('🌐 [SW] Obteniendo de red:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_DYNAMIC);
      cache.put(request, networkResponse.clone());
      await cleanDynamicCache();
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ [SW] Error en cacheWithNetworkFallback:', error);
    return getFallbackResponse(request);
  }
}

// ============================================================
// 🛠️ FUNCIONES AUXILIARES
// ============================================================

/**
 * Determina si una URL es un recurso inmutable
 */
function isInmutableResource(url) {
  return INMUTABLE_URLS.some(inmutableUrl => url.href.includes(inmutableUrl));
}

/**
 * Determina si una URL es un archivo estático
 */
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2', '.ico'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Determina si es una llamada a API
 */
function isAPICall(url) {
  return url.pathname.includes('/api/') || 
         url.pathname.includes('/graphql') ||
         url.search.includes('api');
}

/**
 * Limpia la caché dinámica si excede el límite
 */
async function cleanDynamicCache() {
  try {
    const cache = await caches.open(CACHE_DYNAMIC);
    const keys = await cache.keys();
    
    if (keys.length > MAX_DYNAMIC_CACHE_SIZE) {
      console.log(`🧹 [SW] Limpiando caché dinámica (${keys.length}/${MAX_DYNAMIC_CACHE_SIZE})`);
      
      // Eliminar los más antiguos (FIFO)
      const keysToDelete = keys.slice(0, keys.length - MAX_DYNAMIC_CACHE_SIZE);
      await Promise.all(
        keysToDelete.map(key => cache.delete(key))
      );
      
      console.log(`✅ [SW] Eliminados ${keysToDelete.length} elementos de caché dinámica`);
    }
  } catch (error) {
    console.error('❌ [SW] Error limpiando caché dinámica:', error);
  }
}

/**
 * Retorna una respuesta de fallback según el tipo de recurso
 */
function getFallbackResponse(request) {
  // Para navegación, retornar página offline
  if (request.mode === 'navigate') {
    return caches.match('/index.html')
      .then(response => response || new Response('Offline', { 
        status: 503, 
        statusText: 'Service Unavailable' 
      }));
  }
  
  // Para imágenes, retornar imagen por defecto
  if (request.destination === 'image') {
    return caches.match('/pwa-192x192.png')
      .then(response => response || new Response('', { status: 404 }));
  }
  
  // Para otros recursos
  return new Response('', { status: 404, statusText: 'Not Found' });
}

// ============================================================
// 4️⃣ MENSAJE - Comunicación con la aplicación
// ============================================================
self.addEventListener('message', (event) => {
  console.log('📨 [SW] Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ [SW] Saltando espera...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    console.log('📦 [SW] Cacheando URLs adicionales...');
    const urls = event.data.urls;
    
    caches.open(CACHE_DYNAMIC)
      .then(cache => cache.addAll(urls))
      .then(() => console.log('✅ [SW] URLs adicionales cacheadas'))
      .catch(error => console.error('❌ [SW] Error cacheando URLs:', error));
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('🧹 [SW] Limpiando todas las cachés...');
    
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      ))
      .then(() => {
        console.log('✅ [SW] Todas las cachés eliminadas');
        event.ports[0].postMessage({ success: true });
      })
      .catch(error => {
        console.error('❌ [SW] Error limpiando cachés:', error);
        event.ports[0].postMessage({ success: false, error });
      });
  }
});

// ============================================================
// 📊 LOGGING Y DEBUGGING
// ============================================================
console.log(`
🏥 Service Worker Iniciado
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Versión: ${CACHE_VERSION}
📁 Caché Estática: ${CACHE_STATIC}
📁 Caché Dinámica: ${CACHE_DYNAMIC}
📁 Caché Inmutable: ${CACHE_INMUTABLE}
🔧 Max caché dinámica: ${MAX_DYNAMIC_CACHE_SIZE} elementos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);