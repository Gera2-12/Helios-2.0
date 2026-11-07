
const MOSTRAR_BIENVENIDA = true;       

(function () {
  const pantalla = document.getElementById('bienvenida'); // el bloque de bienvenida de index.html
  if (!pantalla) return;                                // si no existe, no hace nada
  const raiz = document.documentElement;                // la etiqueta <html>
  const entrar = document.getElementById('bv-entrar');  // el botón Entrar
  const video = pantalla.querySelector('video');        // el video de fondo (puede no existir si usas GIF)
  const resto = Array.prototype.filter.call(document.body.children, function (e) { // todo lo demás de la página
    return e !== pantalla && e.id !== 'login-modal' && e.tagName !== 'SCRIPT' && e.tagName !== 'NOSCRIPT';
  });
  let cerrada = false;                                  // evita cerrarla dos veces

  resto.forEach(function (e) { e.inert = true; });      // mientras está la bienvenida, lo de atrás no se puede tocar ni enfocar con teclado

  function cerrar(rapido) {                             // entra a la página
    if (cerrada) return;
    cerrada = true;
    resto.forEach(function (e) { e.inert = false; });   // vuelve a activar la página
    raiz.classList.remove('bv-abierta');                // devuelve el scroll
    pantalla.classList.add('bv-saliendo');              // inicia el desvanecido
    setTimeout(function () {
      pantalla.hidden = true;                           // la oculta del todo
      if (video) video.pause();                         // detiene el video para ahorrar batería y datos
    }, rapido ? 0 : 650);                               // espera a que termine el desvanecido (0.6 s)
    const primera = document.querySelector('nav button'); // pasa el foco a la primera pestaña (teclado y lectores de pantalla)
    if (primera) primera.focus({ preventScroll: true });
  }

  if (!MOSTRAR_BIENVENIDA) { cerrar(true); return; }    // modo programador: entra directo

  const ahorrar = matchMedia('(prefers-reduced-motion: reduce)').matches   // la persona pidió menos animaciones...
    || (navigator.connection && navigator.connection.saveData);            // ...o activó el ahorro de datos
  if (video) {
    if (ahorrar) {                                      // en esos casos no reproduce el video: se ve la imagen "poster"
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      const p = video.play();                           // intenta reproducir (iPhone en ahorro de batería puede bloquearlo)
      if (p && p.catch) p.catch(function () {});        // si lo bloquea, se queda la imagen "poster" sin mostrar error
    }
  }

  function listo() {                                    // activa el botón cuando la página terminó de cargar
    entrar.disabled = false;
    entrar.textContent = 'Entrar';
  }
  if (document.readyState === 'complete') listo(); else addEventListener('load', listo); // si ya cargó, de una; si no, espera
  setTimeout(listo, 5000);                              // por si algo tarda demasiado: a los 5 s deja entrar igual

  entrar.addEventListener('click', function () {
    const login = document.getElementById('login-modal');
    const usuario = document.getElementById('login-user');
    if (login) { login.hidden = false; if (usuario) usuario.focus(); }
  }); // Entrar abre el formulario de cuenta
  addEventListener('keydown', function (e) {            // tecla Escape también entra
    if (e.key === 'Escape' && !entrar.disabled) {
      const login = document.getElementById('login-modal');
      if (login && !login.hidden) login.hidden = true; else cerrar(false);
    }
  });
})();
