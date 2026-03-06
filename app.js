var perfil = JSON.parse(localStorage.getItem('perfil')) || null;
var semanaActual = parseInt(localStorage.getItem('semana')) || 1;
var diasEntrenados = parseInt(localStorage.getItem('diasEntrenados')) || 0;
var rachaActual = parseInt(localStorage.getItem('racha')) || 0;
var ultimoEntrenamiento = localStorage.getItem('ultimoEntrenamiento') || null;
var historialPeso = JSON.parse(localStorage.getItem('historialPeso')) || [];
var entrenamientoActivo = false;

var todosEjercicios = [
  { nombre: "Sentadillas",      musculo: "Piernas",  gif: "imagenes/Sentadillas.gif",      reps: 15, segundosBase: 50, calorias: 6 },
  { nombre: "Sentadillas sumo", musculo: "Piernas",  gif: "imagenes/Sentadillas-Sumo.gif", reps: 12, segundosBase: 50, calorias: 6 },
  { nombre: "Zancadas",         musculo: "Piernas",  gif: "imagenes/Zancadas.gif",         reps: 10, segundosBase: 45, calorias: 5 },
  { nombre: "Flexiones",        musculo: "Pecho",    gif: "imagenes/Flexiones.gif",        reps: 8,  segundosBase: 40, calorias: 5 },
  { nombre: "Plancha",          musculo: "Abdomen",  gif: "imagenes/Plancha.gif",          reps: 0,  segundosBase: 20, calorias: 4 },
  { nombre: "Crunch Abdominal", musculo: "Abdomen",  gif: "imagenes/Crunch-Abdominal.gif", reps: 12, segundosBase: 40, calorias: 4 },
  { nombre: "Superman",         musculo: "Espalda",  gif: "imagenes/Superman.gif",         reps: 10, segundosBase: 40, calorias: 4 },
  { nombre: "Superman1",        musculo: "Espalda",  gif: "imagenes/Superman1.gif",        reps: 10, segundosBase: 45, calorias: 5 },
  { nombre: "Press hombros",    musculo: "Hombros",  gif: "imagenes/Press-hombros.gif",    reps: 8,  segundosBase: 40, calorias: 5 },
  { nombre: "Burpees",          musculo: "Cardio",   gif: "imagenes/Burpees.gif",          reps: 6,  segundosBase: 35, calorias: 8 },
  { nombre: "Jumping Jacks",    musculo: "Cardio",   gif: "imagenes/Jumping-Jacks.gif",    reps: 0,  segundosBase: 30, calorias: 6 }
];

var ejerciciosHoy = [];
var ejercicioActual = 0;
var intervalo = null;
var tiempoRestante = 0;
var enPausa = false;


function beep(frecuencia, duracion, volumen) {
  var ctx = new AudioContext();
  var o = ctx.createOscillator();
  var g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);
  o.frequency.value = frecuencia;
  g.gain.value = volumen || 0.08;
  o.start();
  o.stop(ctx.currentTime + duracion);
}

function sonidoInicio() {
  beep(400, 0.1, 0.06);
  setTimeout(function() { beep(550, 0.1, 0.06); }, 150);
  setTimeout(function() { beep(700, 0.2, 0.06); }, 300);
}

function sonidoCuenta() {
  beep(660, 0.08, 0.05);
}

function sonidoFin() {
  beep(350, 0.4, 0.07);
}

function irA(id) {
  var pantallas = document.querySelectorAll('.pantalla');
  pantallas.forEach(function(p) { p.classList.add('oculto'); });
  document.getElementById(id).classList.remove('oculto');
  if (id === 'menu') { cargarMenu(); }
  if (id === 'progreso') { cargarProgreso(); }
}

function calcularRutina() {
  var peso   = parseFloat(document.getElementById('peso').value);
  var altura = parseFloat(document.getElementById('altura').value);
  var edad   = parseFloat(document.getElementById('edad').value);
  var sexo   = document.getElementById('sexo').value;

  if (!peso || !altura || !edad) {
    alert('Por favor rellena todos los campos');
    return;
  }

  var imc = peso / ((altura / 100) * (altura / 100));
  imc = Math.round(imc * 10) / 10;

  var numEjercicios;
  if (imc < 25)      { numEjercicios = 3; }
  else if (imc < 30) { numEjercicios = 4; }
  else if (imc < 35) { numEjercicios = 5; }
  else               { numEjercicios = 6; }

  perfil = { peso: peso, altura: altura, edad: edad, sexo: sexo, imc: imc, numEjercicios: numEjercicios };
  localStorage.setItem('perfil', JSON.stringify(perfil));
  localStorage.setItem('semana', '1');
  semanaActual = 1;

  historialPeso.push({ semana: 1, peso: peso, fecha: new Date().toLocaleDateString('es-ES') });
  localStorage.setItem('historialPeso', JSON.stringify(historialPeso));

  irA('menu');
}

function cargarMenu() {
  if (!perfil) { irA('datos'); return; }
  var imc = perfil.imc;
  var estado = imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Peso normal' : imc < 30 ? 'Sobrepeso' : 'Obesidad';
  document.getElementById('saludo').textContent = 'IMC: ' + imc + ' — ' + estado;
  document.getElementById('resumen-imc').textContent = 'Semana ' + semanaActual;
  document.getElementById('resumen-rutina').textContent = calcularNumEjercicios() + ' ejercicios hoy';
  document.getElementById('racha-numero').textContent = rachaActual;
}

function calcularNumEjercicios() {
  var base = perfil.numEjercicios;
  var extra = Math.floor((semanaActual - 1) / 2);
  return Math.min(base + extra, todosEjercicios.length);
}

function calcularReps(repsBase) {
  var extra = Math.floor((semanaActual - 1) / 2);
  return repsBase + (extra * 2);
}

function calcularSegundos(segundosBase) {
  var extra = Math.floor((semanaActual - 1) / 2);
  return Math.min(segundosBase + (extra * 5), 90);
}

function iniciarEntrenamiento() {
  if (!perfil) { irA('datos'); return; }
  // Desbloquear audio en Safari con gesto del usuario
  var musica = document.getElementById('musica');
  musica.play().then(function() { musica.pause(); musica.currentTime = 0; }).catch(function() {});
  var num = calcularNumEjercicios();
  ejerciciosHoy = todosEjercicios.slice(0, num);
  ejercicioActual = 0;
  iniciarEjercicio(0);
}


function iniciarEjercicio(index) {
  entrenamientoActivo = true;   // ← CLAVE
  ejercicioActual = index;
  enPausa = false;
  var e = ejerciciosHoy[index];
  var reps = calcularReps(e.reps);
  var segundos = calcularSegundos(e.segundosBase);

  document.getElementById('nombre-ejercicio').textContent = e.nombre;
  document.getElementById('musculo-ejercicio').textContent = e.musculo;
  document.getElementById('gif-ejercicio').src = e.gif;
  document.getElementById('contador').style.color = '#e94560';

  if (e.reps > 0) {
    document.getElementById('reps-ejercicio').textContent = reps + ' repeticiones — ' + segundos + 's';
  } else {
    document.getElementById('reps-ejercicio').textContent = 'Aguanta ' + segundos + ' segundos';
  }

  document.getElementById('estado-contador').textContent =
    'Ejercicio ' + (index + 1) + ' de ' + ejerciciosHoy.length;

  irA('ejercicio-activo');
  cuentaAtrasPrevia(3, function() {
    empezarTemporizador(segundos);
  });
}

function cuentaAtrasPrevia(n, callback) {
  if (!entrenamientoActivo) return;   // ← CLAVE
  document.getElementById('estado-contador').textContent = 'Preparate...';
  document.getElementById('contador').style.color = '#ff9900';
  document.getElementById('contador').textContent = n;
  sonidoCuenta();

  if (n > 1) {
    setTimeout(function() { cuentaAtrasPrevia(n - 1, callback); }, 1000);
  } else {
    setTimeout(function() {
      if (!entrenamientoActivo) return;   // ← CLAVE
      sonidoInicio();
      document.getElementById('estado-contador').textContent =
        'Ejercicio ' + (ejercicioActual + 1) + ' de ' + ejerciciosHoy.length;
      callback();
    }, 1000);
  }
}

function empezarTemporizador(segundos) {
  if (!entrenamientoActivo) return;   // ← CLAVE
  tiempoRestante = segundos;
  document.getElementById('contador').style.color = '#e94560';
  document.getElementById('contador').textContent = tiempoRestante;
  var musica = document.getElementById('musica');
  musica.play().catch(function() {});

  clearInterval(intervalo);
  intervalo = setInterval(function() {
    if (!entrenamientoActivo) { clearInterval(intervalo); return; }   // ← CLAVE
    tiempoRestante--;
    document.getElementById('contador').textContent = tiempoRestante;

    if (tiempoRestante <= 3 && tiempoRestante > 0) {
      beep(880, 0.15, 0.09);
      beep(660, 0.15, 0.09);
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
  if (!entrenamientoActivo) return;   // ← CLAVE
  enPausa = true;
  tiempoRestante = 40;

  document.getElementById('nombre-ejercicio').textContent = '';
  document.getElementById('musculo-ejercicio').textContent = '';
  document.getElementById('gif-ejercicio').src = '';
  document.getElementById('reps-ejercicio').textContent = '';
  document.getElementById('estado-contador').textContent = 'Descansa';
  document.getElementById('contador').style.color = '#44cc88';
  document.getElementById('contador').textContent = tiempoRestante;

  clearInterval(intervalo);
  intervalo = setInterval(function() {
    if (!entrenamientoActivo) { clearInterval(intervalo); return; }   // ← CLAVE
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
  entrenamientoActivo = false;
  var hoy = new Date().toLocaleDateString('es-ES');
  if (ultimoEntrenamiento !== hoy) {
    diasEntrenados++;
    var ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    var ayerStr = ayer.toLocaleDateString('es-ES');
    if (ultimoEntrenamiento === ayerStr) {
      rachaActual++;
    } else {
      rachaActual = 1;
    }
    ultimoEntrenamiento = hoy;
    localStorage.setItem('diasEntrenados', diasEntrenados.toString());
    localStorage.setItem('racha', rachaActual.toString());
    localStorage.setItem('ultimoEntrenamiento', hoy);
  }

  semanaActual++;
  localStorage.setItem('semana', semanaActual.toString());
  sonidoInicio();
  alert('Entrenamiento completado! Semana ' + semanaActual + ' desbloqueada! Racha: ' + rachaActual + ' dias');
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
  localStorage.setItem('historialPeso', JSON.stringify(historialPeso));

  perfil.peso = nuevoPeso;
  perfil.imc = Math.round((nuevoPeso / ((perfil.altura / 100) * (perfil.altura / 100))) * 10) / 10;
  localStorage.setItem('perfil', JSON.stringify(perfil));

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
  historialPeso.forEach(function(entry) {
    var li = document.createElement('li');
    li.innerHTML = '<span style="color:#e94560">Semana ' + entry.semana + '</span> — ' +
      entry.peso + ' kg <span style="color:#aaa; font-size:0.85rem">(' + entry.fecha + ')</span>';
    lista.appendChild(li);
  });

  if (historialPeso.length === 0) {
    var li = document.createElement('li');
    li.textContent = 'Aun no hay registros de peso';
    lista.appendChild(li);
  }
}

function pararEjercicio() {
  entrenamientoActivo = false;   // ← CLAVE
  clearInterval(intervalo);
  intervalo = null;
  var musica = document.getElementById('musica');
  musica.pause();
  musica.currentTime = 0;
  irA('menu');
}

function siguienteEjercicio() {
  entrenamientoActivo = false;   // ← CLAVE — mata todos los setTimeout pendientes
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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js');
  });
}

window.onload = function() {
  if (perfil) { irA('menu'); }
};

