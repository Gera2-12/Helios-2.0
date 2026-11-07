// ===== clima/api.js =====
// Qué hace:  habla con Open-Meteo: busca un lugar por nombre y trae su clima actual.
// Necesita:  WMO (codigos.js).
// Entrega:   GEO, API, pedir(url) (descarga con límite de 12 s) y buscarClima(texto).

const GEO = 'https://geocoding-api.open-meteo.com/v1/search'; // convierte un nombre (ciudad/país) en coordenadas
const API = 'https://api.open-meteo.com/v1/forecast';         // entrega el clima actual de unas coordenadas
async function pedir(url) {                             // descarga un JSON con límite de tiempo (las redes móviles pueden quedarse colgadas)
  const ctl = new AbortController();                    // permite cancelar la petición
  const reloj = setTimeout(function () { ctl.abort(); }, 12000); // si pasan 12 segundos sin respuesta, la cancela
  try {
    const res = await fetch(url, { signal: ctl.signal }); // pide los datos
    if (!res.ok) throw new Error('HTTP ' + res.status); // si el servidor responde con error, lo trata como fallo
    return await res.json();                            // devuelve el JSON ya convertido
  } finally {
    clearTimeout(reloj);                                // apaga el reloj pase lo que pase
  }
}

async function buscarClima(texto) {                     // devuelve los datos de un lugar, o null si falla
  try {                                                 // si no hay internet, no se rompe la página
    // 1) buscar el lugar por nombre
    const g = await pedir(GEO + '?name=' + encodeURIComponent(texto) + '&count=1&language=es&format=json'); // pide las coordenadas
    if (!g.results) return null;                        // no existe ese lugar
    const l = g.results[0];                             // toma el primer resultado

    // 2) pedir el clima actual de esas coordenadas
    const w = await pedir(API + '?latitude=' + l.latitude + '&longitude=' + l.longitude
      + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m'
      + '&timezone=auto');                              // arma la dirección con + y pide el clima
    const c = w.current;                                // bloque con los datos de ahora

    let nombre = l.name;                                // empieza con el nombre del lugar
    if (l.country && l.country !== l.name) nombre = nombre + ', ' + l.country; // agrega el país: "Barranquilla, Colombia"

    return {
      nombre: nombre,
      la: l.latitude,                                   // latitud (para girar el planeta)
      lo: l.longitude,                                  // longitud
      t: Math.round(c.temperature_2m),                  // temperatura en °C
      s: Math.round(c.apparent_temperature),            // sensación térmica en °C
      h: c.relative_humidity_2m,                        // humedad en %
      v: Math.round(c.wind_speed_10m),                  // viento en km/h
      c: WMO[c.weather_code] || 'Sin dato'              // texto del clima
    };
  } catch (e) {
    console.error('Open-Meteo falló:', e);              // deja el error en la consola para poder verlo
    return null;                                        // cualquier error de red -> null
  }
}
