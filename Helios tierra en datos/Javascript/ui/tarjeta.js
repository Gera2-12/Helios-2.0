function mostrar(d) {                                   // pinta los datos en la tarjeta (la de Antártida)
  const col = tcol(d.t);                                // color según temperatura
  $('cName').textContent = d.nombre;                    // título de la tarjeta
  $('cT').textContent = d.t + '°C';                     // temperatura
  $('cS').textContent = d.s + '°C';                     // sensación térmica
  $('cT').style.color = col;                            // color del número grande
  $('cS').style.color = col;                            // color del número pequeño
  $('cC').textContent = d.c + ' · 💧 ' + d.h + '%';     // condición y humedad
  $('cW').textContent = '💨 ' + d.v + ' km/h';          // velocidad del viento
  M[1].la = d.la;                                       // el marcador de esta tarjeta ahora apunta al lugar buscado
  M[1].lo = d.lo;
  M[1].o.position.copy(pos(d.la, d.lo));                // lo coloca sobre la esfera
  tgt = {                                               // hace girar el planeta hacia el lugar
    y: -Math.PI / 2 - d.lo * Math.PI / 180,
    x: Math.max(-1.1, Math.min(1.1, d.la * Math.PI / 180))
  };
  if (!ESCRITORIO.matches) {                            // en celular la tarjeta queda más abajo del planeta
    $('cold').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // baja lo justo para que se vea completa
  }
}
