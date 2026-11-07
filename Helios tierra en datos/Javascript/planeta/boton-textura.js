const CDN = 'https://unpkg.com/three-globe/example/img/'; // carpeta con imágenes reales de la Tierra (para usarlas sin internet: guárdalas en Recursos/texturas/ y cambia esta línea por 'Recursos/texturas/')
const TEXTURAS = [                                      // lista de texturas, EN EL ORDEN en que rota el botón
  { nombre: 'Satélite',    url: CDN + 'earth-blue-marble.jpg' }, // PRIMERA: la que se ve al abrir la página (foto realista)
  { nombre: 'Noche',       url: CDN + 'earth-night.jpg' },       // luces de las ciudades
  { nombre: 'Día',         url: CDN + 'earth-day.jpg' },         // mapa de día
  { nombre: 'Temperatura', tex: globe.material.map }            // la que pintamos con tex() (ya está lista; también es el respaldo si no hay internet)
];
const TEXTURA_INICIAL = 0;                              // posición de la lista que se muestra al abrir (0 = Satélite)
let iTex = TEXTURA_INICIAL;                             // textura actual
const btnTex = $('btn-textura');                        // el botón de index.html
const cargador = new THREE.TextureLoader();             // descarga imágenes para usarlas en 3D
cargador.setCrossOrigin('anonymous');                   // permite imágenes de otro sitio

function etiqueta(i) {                                  // escribe en el botón el nombre de la textura i
  btnTex.innerHTML = '🌍 <span class="pl">Planeta: </span>' + TEXTURAS[i].nombre; // "Planeta: " se oculta en celular
}

function aplicar(i) {                                   // pone la textura número i en el planeta
  globe.material.map = TEXTURAS[i].tex;                 // cambia SOLO la imagen del planeta
  globe.material.color.set(0xffffff);                   // color neutro: la imagen se ve con sus colores reales
  globe.material.needsUpdate = true;                    // avisa a three.js que redibuje el material
  iTex = i;                                             // recuerda cuál quedó puesta
  btnTex.disabled = false;                              // reactiva el botón
  etiqueta(i);                                          // muestra el nombre en el botón
}

function cargar(i, alFallar) {                          // descarga la textura i y, al terminar, la aplica
  const t = TEXTURAS[i];
  cargador.load(
    t.url,                                              // dirección de la imagen
    function (img) { t.tex = img; aplicar(i); },        // al terminar: la guarda y la aplica
    undefined,                                          // (no usamos barra de progreso)
    alFallar                                            // si falla la descarga: hace lo que le pidan
  );
}

function cambiarTextura() {                             // se ejecuta al tocar el botón
  const i = (iTex + 1) % TEXTURAS.length;               // siguiente textura (vuelve a 0 al final)
  const t = TEXTURAS[i];
  if (t.tex) { aplicar(i); return; }                    // si ya estaba descargada, la pone de una vez
  btnTex.disabled = true;                               // bloquea el botón mientras descarga (importante con datos móviles)
  btnTex.textContent = 'Cargando…';
  cargar(i, function () {                               // si falla la descarga:
    btnTex.disabled = false;                            // reactiva el botón
    etiqueta(iTex);                                     // deja el texto de la que sigue puesta
    if (typeof toast === 'function') toast('No se pudo cargar “' + t.nombre + '” (revisa internet)'); // avisa
  });
}

btnTex.addEventListener('click', cambiarTextura);       // conecta el toque/clic

globe.material.map = null;                              // mientras descarga, no muestra la textura de temperatura...
globe.material.color.set(0x0a1f44);                     // ...sino un azul oscuro (con la atmósfera se ve bien)
globe.material.needsUpdate = true;
btnTex.disabled = true;                                 // el botón espera a que termine la primera descarga
btnTex.textContent = 'Cargando…';
cargar(TEXTURA_INICIAL, function () {                   // si no hay internet y no baja la imagen:
  aplicar(TEXTURAS.length - 1);                         // usa "Temperatura" (no necesita internet) para no quedarse sin planeta
  if (typeof toast === 'function') toast('No se pudo cargar el planeta satelital: se muestra “Temperatura”');
});