// ===== vistas/clima-global.js =====
// Qué hace:  la pestaña Clima global: KPIs y tabla de ciudades en vivo.
// Necesita:  $, tcol, cargarCiudades, horaActual, mostrar, abrirVista.
// Entrega:   datosTabla y vistaClima(forzar).

let datosTabla = [];                                    // la lista tal como se muestra en la tabla (ordenada)

async function vistaClima(forzar) {
  $('clima-estado').textContent = 'Cargando datos en vivo…';
  const d = await cargarCiudades(forzar);
  if (!d) { $('clima-estado').textContent = 'No se pudieron cargar los datos (revisa internet y toca Actualizar).'; return; }

  let suma = 0, max = d[0], min = d[0];                 // para promedio, más cálida y más fría
  d.forEach(function (x) {
    suma += x.t;                                        // suma de temperaturas
    if (x.t > max.t) max = x;                           // la más cálida
    if (x.t < min.t) min = x;                           // la más fría
  });
  const prom = (suma / d.length).toFixed(1);            // promedio con 1 decimal

  $('clima-kpis').innerHTML =
    '<div class="kpi"><span>Temperatura promedio (' + d.length + ' ciudades)</span><p>🌐 ' + prom + ' °C</p></div>'
    + '<div class="kpi"><span>Más cálida: ' + max.ciudad + '</span><p style="color:#ff5a3d">🌡️ ' + max.t + ' °C</p></div>'
    + '<div class="kpi"><span>Más fría: ' + min.ciudad + '</span><p style="color:#6ea8ff">❄️ ' + min.t + ' °C</p></div>';

  datosTabla = d.slice().sort(function (a, b) { return b.t - a.t; }); // copia ordenada de más cálida a más fría
  $('clima-cuerpo').innerHTML = datosTabla.map(function (x, i) {
    return '<tr data-i="' + i + '"><td>' + x.ciudad + ' <small>' + x.pais + '</small></td>'
      + '<td style="color:' + tcol(x.t) + ';font-weight:600">' + x.t + '°C</td>'
      + '<td data-l="Sensación">' + x.s + '°C</td>'
      + '<td data-l="Viento">💨 ' + x.v + ' km/h</td>'
      + '<td data-l="Clima">' + x.c + '</td></tr>';     // data-l = etiqueta que el CSS muestra cuando la tabla se vuelve tarjetas en celular
  }).join('');
  $('clima-estado').textContent = 'Datos en vivo de Open-Meteo · actualizado ' + horaActual() + ' · toca una ciudad para verla en el planeta';
}

$('clima-cuerpo').addEventListener('click', function (e) { // toque en una fila
  const tr = e.target.closest('tr');                    // la fila tocada
  if (!tr) return;
  const x = datosTabla[Number(tr.getAttribute('data-i'))]; // sus datos
  abrirVista('Inicio');                                 // vuelve al planeta
  mostrar(x);                                           // pone la ciudad en la tarjeta de frío y gira el planeta
});
