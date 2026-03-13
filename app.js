var perfil = JSON.parse(localStorage.getItem('perfil')) || null;
var semanaActual = parseInt(localStorage.getItem('semana')) || 1;
var diasEntrenados = parseInt(localStorage.getItem('diasEntrenados')) || 0;
var diasEntrenadosSemana = parseInt(localStorage.getItem('diasEntrenadosSemana')) || 0;
var rachaActual = parseInt(localStorage.getItem('racha')) || 0;
var ultimoEntrenamiento = localStorage.getItem('ultimoEntrenamiento') || null;
var historialPeso = JSON.parse(localStorage.getItem('historialPeso')) || [];
var entrenamientoActivo = false;

var todosEjercicios = [
  { nombre: "Burpees",              musculo: "Cardio",   gif: "imagenes/Burpees.gif",              reps: 8,  segundosBase: 35, calorias: 8 },
  { nombre: "Butt Kicks",           musculo: "Cardio",   gif: "imagenes/Butt-Kicks.jpg",           reps: 0,  segundosBase: 30, calorias: 5 },
  { nombre: "Jumping Jacks",        musculo: "Cardio",   gif: "imagenes/Jumping-Jacks.gif",        reps: 0,  segundosBase: 30, calorias: 6 },
  { nombre: "Mountain Climbers",    musculo: "Core",     gif: "imagenes/Mountain-Climbers.gif",    reps: 20, segundosBase: 40, calorias: 7 },
  { nombre: "Rodillas Altas",       musculo: "Cardio",   gif: "imagenes/Rodillas-Altas.gif",       reps: 0,  segundosBase: 30, calorias: 6 },
  { nombre: "Saltos Ninja",         musculo: "Piernas",  gif: "imagenes/Saltos-Ninja.gif",         reps: 10, segundosBase: 35, calorias: 7 },
  { nombre: "Sentadilla con Salto", musculo: "Piernas",  gif: "imagenes/Sentadilla-con-Salto.gif", reps: 12, segundosBase: 40, calorias: 7 },
  { nombre: "Skater Jumps",         musculo: "Piernas",  gif: "imagenes/Skater-Jumps.gif",         reps: 12, segundosBase: 35, calorias: 6 },
  { nombre: "Tijeras Saltando",     musculo: "Piernas",  gif: "imagenes/Tijeras-Saltando.gif",     reps: 12, segundosBase: 40, calorias: 7 },
];

var ejerciciosAbdomen = [
  { nombre: "Escaladores Rápidos",  musculo: "Core", gif: "imagenes/Escaladores-Rapidos.gif",  reps: 20, segundosBase: 40, calorias: 8 },
  { nombre: "Bicicleta Abdominal",  musculo: "Core", gif: "imagenes/Bicicleta-Abdominal.gif",  reps: 20, segundosBase: 40, calorias: 6 },
  { nombre: "Tijeras Abdominales",  musculo: "Core", gif: "imagenes/Tijeras-Abdominales.gif",  reps: 16, segundosBase: 35, calorias: 5 },
  { nombre: "Elevación de Piernas", musculo: "Core", gif: "imagenes/Elevacion-Piernas.gif",    reps: 15, segundosBase: 35, calorias: 5 },
  { nombre: "Crunch con Giro",      musculo: "Core", gif: "imagenes/Crunch-Giro.gif",          reps: 16, segundosBase: 35, calorias: 5 },
  { nombre: "Plancha Dinámica",     musculo: "Core", gif: "imagenes/Plancha-Dinamica.gif",     reps: 0,  segundosBase: 40, calorias: 6 },
  { nombre: "Plancha Lateral",      musculo: "Core", gif: "imagenes/Plancha-Lateral.gif",      reps: 0,  segundosBase: 30, calorias: 4 },
  { nombre: "Dead Bug",             musculo: "Core", gif: "imagenes/Dead-Bug.gif",             reps: 12, segundosBase: 40, calorias: 5 },
  { nombre: "Hollow Hold",          musculo: "Core", gif: "imagenes/Hollow-Hold.gif",          reps: 0,  segundosBase: 30, calorias: 4 },
  { nombre: "Rodillas al Pecho",    musculo: "Core", gif: "imagenes/Rodillas-Pecho.gif",       reps: 15, segundosBase: 35, calorias: 5 },
];

var ejerciciosEstiramientos = [
  { nombre: "Gato-Vaca",             musculo: "Espalda", gif: "imagenes/Gato-Vaca.gif",             reps: 10, segundosBase: 40, calorias: 2 },
  { nombre: "Postura del Nino",      musculo: "Espalda", gif: "imagenes/Postura-Nino.jpg",          reps: 0,  segundosBase: 40, calorias: 1 },
  { nombre: "Cobra",                 musculo: "Espalda", gif: "imagenes/Cobra.jpg",                 reps: 8,  segundosBase: 35, calorias: 2 },
  { nombre: "Rotacion de Columna",   musculo: "Espalda", gif: "imagenes/Rotacion-Columna.jpg",      reps: 10, segundosBase: 35, calorias: 2 },
  { nombre: "Puente de Gluteos",     musculo: "Espalda", gif: "imagenes/Puente-Gluteos.gif",        reps: 12, segundosBase: 35, calorias: 3 },
  { nombre: "Superman",              musculo: "Espalda", gif: "imagenes/Superman.gif",              reps: 12, segundosBase: 35, calorias: 3 },
  { nombre: "Estiramiento Lumbar",   musculo: "Espalda", gif: "imagenes/Estiramiento-Lumbar.jpg",   reps: 0,  segundosBase: 40, calorias: 1 }
];

var circuitoAbdomen = [
  { nombre: "Crunch Abdominal",    musculo: "Core", gif: "imagenes/Crunch-Abdominal.gif",    reps: 0, segundosBase: 40, calorias: 5 },
  { nombre: "Abdominales Piernas", musculo: "Core", gif: "imagenes/Abdominales-Piernas.gif", reps: 0, segundosBase: 30, calorias: 5 },
  { nombre: "Abdominales Rodilla", musculo: "Core", gif: "imagenes/Abdominales-Rodilla.gif", reps: 0, segundosBase: 20, calorias: 4 },
  { nombre: "Abdominales Tobillo", musculo: "Core", gif: "imagenes/Abdominales-Tobillo.gif", reps: 0, segundosBase: 10, calorias: 3 },
];

var serieCircuito = 0;
var totalSeriesCircuito = 3;

function iniciarCircuitoAbdomen() {
  if (!perfil) { irA('datos'); return; }
  serieCircuito = 1;
  ejerciciosHoy = circuitoAbdomen.slice();
  ejercicioActual = 0;
  document.getElementById('estado-contador').textContent = 'Serie ' + serieCircuito + ' de ' + totalSeriesCircuito;
  iniciarEjercicio(0);
}


var ejerciciosHoy = [];
var ejercicioActual = 0;
var intervalo = null;
var tiempoRestante = 0;
var enPausa = false;

var audioCtx = null;

function beep(frecuencia, duracion, volumen) {
  if (!audioCtx) audioCtx = new AudioContext();
  var promise = audioCtx.state === 'suspended' ? audioCtx.resume() : Promise.resolve();
  promise.then(function() {
    var o = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = frecuencia;
    g.gain.setValueAtTime(1.0, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracion);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + duracion);
  });
}

function sonidoInicio() {
  beep(523, 0.15, 1.0);
  setTimeout(function() { beep(659, 0.15, 1.0); }, 180);
  setTimeout(function() { beep(784, 0.3,  1.0); }, 360);
}
function sonidoCuenta() { beep(880, 0.12, 1.0); }
function sonidoFin() {
  beep(784, 0.15, 1.0);
  setTimeout(function() { beep(659, 0.15, 1.0); }, 180);
  setTimeout(function() { beep(523, 0.4,  1.0); }, 360);
}

function irA(id) {
  document.querySelectorAll('.pantalla').forEach(function(p) { p.classList.add('oculto'); });
  document.getElementById(id).classList.remove('oculto');
  if (id === 'seleccionar-ejercicios') { cargarSeleccion(); }
  if (id === 'menu')     { cargarMenu(); }
  if (id === 'progreso') { cargarProgreso(); }
}

function guardarDatos() {
  localStorage.setItem('semana',               String(semanaActual));
  localStorage.setItem('diasEntrenados',       String(diasEntrenados));
  localStorage.setItem('diasEntrenadosSemana', String(diasEntrenadosSemana));
  localStorage.setItem('racha',                String(rachaActual));
  localStorage.setItem('ultimoEntrenamiento',  ultimoEntrenamiento || '');
  localStorage.setItem('historialPeso',        JSON.stringify(historialPeso));
  localStorage.setItem('perfil',               JSON.stringify(perfil));
}

function calcularRutina() {
  var peso   = parseFloat(document.getElementById('peso').value);
  var altura = parseFloat(document.getElementById('altura').value);
  var edad   = parseFloat(document.getElementById('edad').value);
  var sexo   = document.getElementById('sexo').value;
  if (!peso || !altura || !edad) { alert('Por favor rellena todos los campos'); return; }
  var imc = Math.round((peso / Math.pow(altura / 100, 2)) * 10) / 10;
  var numEjercicios = imc < 25 ? 3 : imc < 30 ? 4 : imc < 35 ? 5 : 6;
  perfil = { peso, altura, edad, sexo, imc, numEjercicios };
  semanaActual = 1;
  diasEntrenadosSemana = 0;
  historialPeso.push({ semana: 1, peso, fecha: new Date().toLocaleDateString('es-ES') });
  guardarDatos();
  irA('menu');
}

function cargarMenu() {
  if (!perfil) { irA('datos'); return; }
  var imc = perfil.imc;
  var estado = imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Peso normal' : imc < 30 ? 'Sobrepeso' : 'Obesidad';
  document.getElementById('saludo').textContent = 'IMC: ' + imc + ' — ' + estado;
  document.getElementById('resumen-imc').textContent = 'Semana ' + semanaActual;
  document.getElementById('racha-numero').textContent = rachaActual;
  document.getElementById('resumen-rutina').textContent =
    'Esta semana: ' + diasEntrenadosSemana + '/5 días · ' + calcularNumEjercicios() + ' ejercicios hoy';
}

function calcularNumEjercicios() {
  return Math.min(perfil.numEjercicios + Math.floor((semanaActual - 1) / 2), todosEjercicios.length);
}

function calcularReps(repsBase) {
  return repsBase + Math.floor((semanaActual - 1) / 2) * 2;
}

function calcularSegundos(segundosBase) {
  return Math.min(segundosBase + Math.floor((semanaActual - 1) / 2) * 5, 90);
}

function iniciarEntrenamiento() {
  if (!perfil) { irA('datos'); return; }
  var musica = document.getElementById('musica');
  musica.load();
  musica.play().then(function() { musica.pause(); musica.currentTime = 0; }).catch(function() {});
  ejerciciosHoy = mezclar(todosEjercicios).slice(0, calcularNumEjercicios());
  ejercicioActual = 0;
  iniciarEjercicio(0);
}

function iniciarEntrenamientoAbdomen() {
  if (!perfil) { irA('datos'); return; }
  ejerciciosHoy = mezclar(ejerciciosAbdomen).slice(0, calcularNumEjercicios());
  ejercicioActual = 0;
  iniciarEjercicio(0);
}

function iniciarEstiramientos() {
  if (!perfil) { irA('datos'); return; }
  ejerciciosHoy = mezclar(ejerciciosEstiramientos).slice(0, calcularNumEjercicios());
  ejercicioActual = 0;
  iniciarEjercicio(0);
}

function cargarSeleccion() {
  var todos = todosEjercicios.concat(ejerciciosAbdomen).concat(ejerciciosEstiramientos);
  var lista = document.getElementById('lista-seleccion');
  lista.innerHTML = '';
  todos.forEach(function(e, i) {
    var card = document.createElement('div');
    card.className = 'ejercicio-card';
    card.dataset.index = i;
    card.innerHTML =
      '<img src="' + e.gif + '" alt="' + e.nombre + '">' +
      '<div class="ejercicio-card-info">' +
        '<div class="ejercicio-card-nombre">' + e.nombre + '</div>' +
        '<div class="ejercicio-card-musculo">' + e.musculo + '</div>' +
      '</div>' +
      '<span class="ejercicio-card-check">◯</span>';
    card.addEventListener('click', function() {
      card.classList.toggle('seleccionado');
      card.querySelector('.ejercicio-card-check').textContent =
        card.classList.contains('seleccionado') ? '✅' : '◯';
    });
    lista.appendChild(card);
  });
}

function iniciarSeleccionados() {
  var seleccionados = document.querySelectorAll('.ejercicio-card.seleccionado');
  if (seleccionados.length === 0) { alert('Selecciona al menos un ejercicio'); return; }
  var todos = todosEjercicios.concat(ejerciciosAbdomen).concat(ejerciciosEstiramientos);
  ejerciciosHoy = [];
  seleccionados.forEach(function(card) {
    ejerciciosHoy.push(todos[parseInt(card.dataset.index)]);
  });
  ejercicioActual = 0;
  iniciarEjercicio(0);
}

function mezclar(array) {
  var arr = array.slice();
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
  }
  return arr;
}

function iniciarEjercicio(index) {
  entrenamientoActivo = true;
  ejercicioActual = index;
  enPausa = false;
  var e = ejerciciosHoy[index];
  var reps = calcularReps(e.reps);
  var segundos = calcularSegundos(e.segundosBase);
  document.getElementById('nombre-ejercicio').textContent = e.nombre;
  document.getElementById('musculo-ejercicio').textContent = e.musculo;
  document.getElementById('gif-ejercicio').src = e.gif;
  document.getElementById('contador').style.color = '#e94560';
  document.getElementById('reps-ejercicio').textContent = e.reps > 0
    ? reps + ' repeticiones — ' + segundos + 's'
    : 'Aguanta ' + segundos + ' segundos';
  document.getElementById('estado-contador').textContent =
    'Ejercicio ' + (index + 1) + ' de ' + ejerciciosHoy.length;
  irA('ejercicio-activo');
  cuentaAtrasPrevia(3, function() { empezarTemporizador(segundos); });
}

function cuentaAtrasPrevia(n, callback) {
  if (!entrenamientoActivo) return;
  document.getElementById('estado-contador').textContent = 'Prepárate...';
  document.getElementById('contador').style.color = '#ff9900';
  document.getElementById('contador').textContent = n;
  sonidoCuenta();
  if (n > 1) {
    setTimeout(function() { cuentaAtrasPrevia(n - 1, callback); }, 1000);
  } else {
    setTimeout(function() {
      if (!entrenamientoActivo) return;
      sonidoInicio();
      document.getElementById('estado-contador').textContent =
        'Ejercicio ' + (ejercicioActual + 1) + ' de ' + ejerciciosHoy.length;
      callback();
    }, 1000);
  }
}

function empezarTemporizador(segundos) {
  if (!entrenamientoActivo) return;
  tiempoRestante = segundos;
  document.getElementById('contador').style.color = '#e94560';
  document.getElementById('contador').textContent = tiempoRestante;
  document.getElementById('musica').play().catch(function() {});
  clearInterval(intervalo);
  intervalo = setInterval(function() {
    if (!entrenamientoActivo) { clearInterval(intervalo); return; }
    tiempoRestante--;
    document.getElementById('contador').textContent = tiempoRestante;
    if (tiempoRestante <= 3 && tiempoRestante > 0) {
      beep(880, 0.15, 0.09);
      document.getElementById('contador').style.color = '#ff9900';
    }
    if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      sonidoFin();
      document.getElementById('musica').pause();
      iniciarPausa();
    }
  }, 1000);
}

function iniciarPausa() {
  if (!entrenamientoActivo) return;
  enPausa = true;
  tiempoRestante = 30;
  document.getElementById('nombre-ejercicio').textContent = '';
  document.getElementById('musculo-ejercicio').textContent = '';
  document.getElementById('gif-ejercicio').src = '';
  document.getElementById('reps-ejercicio').textContent = '';
  document.getElementById('estado-contador').textContent = 'Descansa';
  document.getElementById('contador').style.color = '#44cc88';
  document.getElementById('contador').textContent = tiempoRestante;
  clearInterval(intervalo);
  intervalo = setInterval(function() {
    if (!entrenamientoActivo) { clearInterval(intervalo); return; }
    tiempoRestante--;
    document.getElementById('contador').textContent = tiempoRestante;
    if (tiempoRestante <= 3 && tiempoRestante > 0) {
      sonidoCuenta();
      document.getElementById('contador').style.color = '#ff9900';
    }
    if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      if (ejercicioActual + 1 < ejerciciosHoy.length) {
        iniciarEjercicio(ejercicioActual + 1);
      } else {
        finalizarEntrenamiento();
      }
    }
  }, 1000);
}

function finalizarEntrenamiento() {
  // Si es circuito y quedan series
  if (serieCircuito > 0 && serieCircuito < totalSeriesCircuito) {
    serieCircuito++;
    ejerciciosHoy = circuitoAbdomen.slice();
    ejercicioActual = 0;
    // Descanso entre series de 30s
    enPausa = true;
    tiempoRestante = 30;
    document.getElementById('nombre-ejercicio').textContent = '';
    document.getElementById('musculo-ejercicio').textContent = '';
    document.getElementById('gif-ejercicio').src = '';
    document.getElementById('reps-ejercicio').textContent = '';
    document.getElementById('estado-contador').textContent = '💪 Serie ' + serieCircuito + ' en breve...';
    document.getElementById('contador').style.color = '#44cc88';
    document.getElementById('contador').textContent = tiempoRestante;
    irA('ejercicio-activo');
    clearInterval(intervalo);
    intervalo = setInterval(function() {
      tiempoRestante--;
      document.getElementById('contador').textContent = tiempoRestante;
      if (tiempoRestante <= 3 && tiempoRestante > 0) {
        sonidoCuenta();
        document.getElementById('contador').style.color = '#ff9900';
      }
      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        iniciarEjercicio(0);
      }
    }, 1000);
    return;
  }

  // Entrenamiento normal o última serie del circuito
  serieCircuito = 0;
  diasEntrenados++;
  diasEntrenadosSemana++;
  rachaActual++;
  ultimoEntrenamiento = new Date().toDateString();
  if (diasEntrenadosSemana >= 5) {
    semanaActual++;
    diasEntrenadosSemana = 0;
    alert('🎉 ¡Semana ' + (semanaActual - 1) + ' completada! Empiezas la semana ' + semanaActual);
  }
  guardarDatos();
  irA('menu');
}


function guardarPeso() {
  var nuevoPeso = parseFloat(document.getElementById('nuevo-peso').value);
  if (!nuevoPeso) { alert('Introduce tu peso'); return; }
  historialPeso.push({
    semana: semanaActual,
    peso: nuevoPeso,
    fecha: new Date().toLocaleDateString('es-ES')
  });
  perfil.peso = nuevoPeso;
  perfil.imc = Math.round((nuevoPeso / Math.pow(perfil.altura / 100, 2)) * 10) / 10;
  guardarDatos();
  alert('Peso guardado: ' + nuevoPeso + ' kg — Nuevo IMC: ' + perfil.imc);
  irA('menu');
}

function cargarProgreso() {
  if (!perfil) { irA('datos'); return; }
  document.getElementById('progreso-semana').textContent = semanaActual;
  document.getElementById('progreso-imc').textContent = perfil.imc;
  document.getElementById('progreso-dias').textContent = diasEntrenados;
  document.getElementById('progreso-racha').textContent = rachaActual + ' 🔥';
  var lista = document.getElementById('historial-peso');
  lista.innerHTML = '';
  if (historialPeso.length === 0) {
    var li = document.createElement('li');
    li.textContent = 'Aún no hay registros de peso';
    lista.appendChild(li);
  } else {
    historialPeso.forEach(function(entry) {
      var li = document.createElement('li');
      li.innerHTML = '<span style="color:#e94560">Semana ' + entry.semana + '</span> — ' +
        entry.peso + ' kg <span style="color:#aaa; font-size:0.85rem">(' + entry.fecha + ')</span>';
      lista.appendChild(li);
    });
  }
}

function pararEjercicio() {
  entrenamientoActivo = false;
  clearInterval(intervalo);
  intervalo = null;
  var musica = document.getElementById('musica');
  musica.pause();
  musica.currentTime = 0;
  irA('menu');
}

function siguienteEjercicio() {
  clearInterval(intervalo);
  intervalo = null;
  var musica = document.getElementById('musica');
  musica.pause();
  musica.currentTime = 0;
  if (ejercicioActual + 1 < ejerciciosHoy.length) {
    iniciarEjercicio(ejercicioActual + 1);
  } else {
    finalizarEntrenamiento();
  }
}

function resetearApp() {
  if (confirm('¿Seguro? Se borrarán todos los datos')) {
    localStorage.clear();
    perfil = null;
    semanaActual = 1;
    diasEntrenados = 0;
    diasEntrenadosSemana = 0;
    rachaActual = 0;
    ultimoEntrenamiento = null;
    historialPeso = [];
    irA('inicio');
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js');
  });
}

window.onload = function() {
  if (perfil) { irA('menu'); }
};
