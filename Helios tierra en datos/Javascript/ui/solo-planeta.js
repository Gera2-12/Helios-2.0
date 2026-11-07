(function () {
  const btn = $('btn-solo');                            // el botón flotante de index.html
  const raiz = document.documentElement;                // la etiqueta <html> (ahí se pone la clase)
  let activo = false;                                   // ¿está activo el modo "solo planeta"?

  function poner(valor) {                               // activa o desactiva el modo
    activo = valor;
    if (valor && typeof abrirVista === 'function') abrirVista('Inicio'); // asegura que el planeta esté a la vista (por si estabas en otra pestaña)
    raiz.classList.toggle('solo-planeta', valor);       // el CSS oculta o muestra todo según esta clase
    btn.setAttribute('aria-pressed', valor ? 'true' : 'false'); // informa a los lectores de pantalla
    btn.setAttribute('aria-label', valor ? 'Mostrar la información' : 'Ocultar la información y ver solo el planeta');
    btn.innerHTML = valor ? '👁️ <span>Mostrar información</span>' : '🪐 <span>Solo planeta</span>'; // texto del botón
    if (typeof size === 'function') setTimeout(size, 60); // reajusta el planeta al nuevo tamaño (a pantalla completa o normal)
  }

  btn.addEventListener('click', function () { poner(!activo); }); // toque o clic: alterna
  addEventListener('keydown', function (e) {            // con teclado, Escape también vuelve a mostrar todo
    if (e.key === 'Escape' && activo) poner(false);
  });
})();