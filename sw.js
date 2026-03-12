var CACHE = 'ejercicios-v4';
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
var CACHE_NAME = 'fitapp-v2'; // ← súbele el número cada vez que cambies algo

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ARCHIVOS);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(respuesta) {
      return respuesta || fetch(e.request);
    })
  );
});
