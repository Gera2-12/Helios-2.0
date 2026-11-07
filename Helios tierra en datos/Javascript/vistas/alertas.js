// ===== vistas/alertas.js =====
// Qué hace:  la pestaña Alertas: genera avisos de calor, frío, viento y tormentas con el clima real.
// Necesita:  $, cargarCiudades, horaActual.
// Entrega:   generarAlertas(d) y vistaAlertas(forzar).

function generarAlertas(d) {                            // convierte el clima real en alertas
  const a = [];
  d.forEach(function (x) {
    if (x.s >= 40) a.push({ o: 1, c: '#ff4d3a', g: 'Alta', t: 'Calor extremo en ' + x.nombre + ' (sensación ' + x.s + ' °C)' });
    else if (x.s >= 35) a.push({ o: 2, c: '#ff9a2e', g: 'Media', t: 'Calor intenso en ' + x.nombre + ' (sensación ' + x.s + ' °C)' });
    if (x.s <= -30) a.push({ o: 1, c: '#4d8dff', g: 'Alta', t: 'Frío extremo en ' + x.nombre + ' (sensación ' + x.s + ' °C)' });
    else if (x.s <= -15) a.push({ o: 2, c: '#4d8dff', g: 'Media', t: 'Mucho frío en ' + x.nombre + ' (sensación ' + x.s + ' °C)' });
    if (x.v >= 60) a.push({ o: 1, c: '#35d6c0', g: 'Alta', t: 'Viento muy fuerte en ' + x.nombre + ' (' + x.v + ' km/h)' });
    else if (x.v >= 40) a.push({ o: 2, c: '#35d6c0', g: 'Media', t: 'Viento fuerte en ' + x.nombre + ' (' + x.v + ' km/h)' });
    if (x.codigo >= 95) a.push({ o: 1, c: '#b072ff', g: 'Alta', t: x.c + ' en ' + x.nombre });
    else if ([65, 66, 67, 75, 82, 86].indexOf(x.codigo) >= 0) a.push({ o: 2, c: '#b072ff', g: 'Media', t: x.c + ' en ' + x.nombre });
  });
  a.sort(function (p, q) { return p.o - q.o; });        // las altas primero
  return a;
}

async function vistaAlertas(forzar) {
  $('alertas-estado').textContent = 'Cargando datos en vivo…';
  const d = await cargarCiudades(forzar);
  if (!d) { $('alertas-estado').textContent = 'No se pudieron cargar los datos (revisa internet y toca Actualizar).'; return; }
  const a = generarAlertas(d);
  $('alertas-lista').innerHTML = a.length
    ? a.map(function (x) { return '<li><i style="background:' + x.c + '"></i><span>' + x.t + '</span><em>' + x.g + '</em></li>'; }).join('')
    : '<li><i style="background:#35d6c0"></i><span>Sin alertas activas en las ciudades monitoreadas</span><em>✅</em></li>';
  $('alertas-estado').textContent = a.length + ' alerta(s) en ' + d.length + ' ciudades · actualizado ' + horaActual();
}
