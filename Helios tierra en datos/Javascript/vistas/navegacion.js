function abrirVista(nombre) {                           // muestra una vista y oculta las demás
  const inicio = (nombre === 'Inicio');
  document.documentElement.setAttribute('data-vista', nombre); // el CSS usa esto (por ejemplo, el botón "Solo planeta" solo aparece en Inicio)
  document.querySelector('.stage').hidden = !inicio;    // planeta + paneles flotantes
  document.querySelector('.bottom').hidden = !inicio;   // paneles de abajo
  $('v-clima').hidden = (nombre !== 'Clima global');
  $('v-alertas').hidden = (nombre !== 'Alertas');
  $('v-acerca').hidden = (nombre !== 'Acerca de'); // la nueva vista Acerca de
  const nav = $('nav');
  Array.prototype.forEach.call(nav.children, function (b) {
    const activa = (b.textContent === nombre);
    b.classList.toggle('on', activa);                   // marca la pestaña activa
    if (activa) nav.scrollTo({ left: b.offsetLeft - (nav.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' }); // en celular, centra la pestaña activa dentro de la barra que se desliza
  });
  window.scrollTo({ top: 0 });                          // al cambiar de vista, vuelve al comienzo de la página
  if (inicio && typeof size === 'function') size();     // al volver, reajusta el tamaño del planeta
  if (nombre === 'Clima global') vistaClima(false);
  if (nombre === 'Alertas') vistaAlertas(false);
}

$('act-clima').addEventListener('click', function () { vistaClima(true); });     // botón Actualizar (clima)
$('act-alertas').addEventListener('click', function () { vistaAlertas(true); }); // botón Actualizar (alertas)