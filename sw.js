var CACHE = 'ejercicios-v5';
var ARCHIVOS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './musica.mp3',
  './imagenes/Sentadillas.gif',
  './imagenes/Sentadillas-sumo.gif',
  './imagenes/Zancadas.gif',
  './imagenes/Flexiones.gif',
  './imagenes/Plancha.gif',
  './imagenes/Crunch-Abdominal.gif',
  './imagenes/Superman.gif',
  './imagenes/Superman1.gif',
  './imagenes/Press-hombros.gif',
  './imagenes/Burpees.gif',
  './imagenes/Jumping-Jacks.gif',
  './imagenes/icon-192.png',
  './imagenes/icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(n => n !== CACHE).map(n => caches.delete(n))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(respuesta) {
      return respuesta || fetch(e.request);
    })
  );
});
