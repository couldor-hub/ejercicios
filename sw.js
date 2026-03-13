var CACHE = 'ejercicios-v6';
var ARCHIVOS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './musica.mp3',
  './imagenes/icon-192.png',
  './imagenes/icon-512.png',
  './imagenes/Burpees.gif',
  './imagenes/Butt-Kicks.jpg',
  './imagenes/Jumping-Jacks.gif',
  './imagenes/Mountain-Climbers.gif',
  './imagenes/Rodillas-Altas.gif',
  './imagenes/Saltos-Ninja.gif',
  './imagenes/Sentadilla-con-Salto.gif',
  './imagenes/Skater-Jumps.gif',
  './imagenes/Tijeras-Saltando.gif',
  './imagenes/Escaladores-Rapidos.gif',
  './imagenes/Bicicleta-Abdominal.gif',
  './imagenes/Tijeras-Abdominales.gif',
  './imagenes/Elevacion-Piernas.gif',
  './imagenes/Crunch-Giro.gif',
  './imagenes/Plancha-Dinamica.gif',
  './imagenes/Plancha-Lateral.gif',
  './imagenes/Dead-Bug.gif',
  './imagenes/Hollow-Hold.gif',
  './imagenes/Rodillas-Pecho.gif',
  './imagenes/Gato-Vaca.gif',
  './imagenes/Postura-Nino.jpg',
  './imagenes/Cobra.jpg',
  './imagenes/Rotacion-Columna.jpg',
  './imagenes/Puente-Gluteos.gif',
  './imagenes/Superman.gif',
  './imagenes/Estiramiento-Lumbar.jpg',
  './imagenes/Crunch-Abdominal.gif',
  './imagenes/Abdominales-Piernas.gif',
  './imagenes/Abdominales-Rodilla.gif',
  './imagenes/Abdominales-Tobillo.gif'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.all(
        ARCHIVOS.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.error('❌ Falla:', url);
          });
        })
      );
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
