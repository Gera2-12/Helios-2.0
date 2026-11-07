const CIUDADES = [                                      // ciudades que se consultan (n=ciudad, p=país, la/lo=coordenadas)
  { n: 'Barranquilla', p: 'Colombia',      la: 10.96,  lo: -74.78 },
  { n: 'Bogotá',       p: 'Colombia',      la: 4.71,   lo: -74.07 },
  { n: 'Quito',        p: 'Ecuador',       la: -0.18,  lo: -78.47 },
  { n: 'Lima',         p: 'Perú',          la: -12.05, lo: -77.04 },
  { n: 'Buenos Aires', p: 'Argentina',     la: -34.60, lo: -58.38 },
  { n: 'Ciudad de México', p: 'México',    la: 19.43,  lo: -99.13 },
  { n: 'Nueva York',   p: 'EE. UU.',       la: 40.71,  lo: -74.01 },
  { n: 'Madrid',       p: 'España',        la: 40.42,  lo: -3.70 },
  { n: 'El Cairo',     p: 'Egipto',        la: 30.04,  lo: 31.24 },
  { n: 'Lagos',        p: 'Nigeria',       la: 6.52,   lo: 3.38 },
  { n: 'Moscú',        p: 'Rusia',         la: 55.76,  lo: 37.62 },
  { n: 'Yakutsk',      p: 'Rusia',         la: 62.03,  lo: 129.73 },
  { n: 'Dubái',        p: 'Emiratos Árabes', la: 25.20, lo: 55.27 },
  { n: 'Delhi',        p: 'India',         la: 28.61,  lo: 77.21 },
  { n: 'Bangkok',      p: 'Tailandia',     la: 13.76,  lo: 100.50 },
  { n: 'Tokio',        p: 'Japón',         la: 35.68,  lo: 139.69 },
  { n: 'Sídney',       p: 'Australia',     la: -33.87, lo: 151.21 },
  { n: 'McMurdo',      p: 'Antártida',     la: -77.85, lo: 166.67 }
];

let cacheClima = { hora: 0, datos: null };              // guarda la última respuesta para no gastar datos móviles de más

async function cargarCiudades(forzar) {                 // devuelve la lista de ciudades con su clima, o null si falla
  if (!forzar && cacheClima.datos && Date.now() - cacheClima.hora < 600000) return cacheClima.datos; // si hay datos de hace menos de 10 min, los reutiliza
  try {
    const lats = CIUDADES.map(function (c) { return c.la; }).join(','); // "10.96,4.71,..."
    const lons = CIUDADES.map(function (c) { return c.lo; }).join(','); // "-74.78,-74.07,..."
    const arr = await pedir(API + '?latitude=' + lats + '&longitude=' + lons
      + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m'
      + '&timezone=auto');                              // UNA sola petición para todas las ciudades (con límite de 12 s)
    const datos = CIUDADES.map(function (c, i) {        // une cada ciudad con su clima (misma posición en la lista)
      const w = arr[i].current;
      return {
        nombre: c.n + ', ' + c.p, ciudad: c.n, pais: c.p,
        la: c.la, lo: c.lo,
        t: Math.round(w.temperature_2m),                // temperatura °C
        s: Math.round(w.apparent_temperature),          // sensación térmica °C
        h: w.relative_humidity_2m,                      // humedad %
        v: Math.round(w.wind_speed_10m),                // viento km/h
        c: WMO[w.weather_code] || 'Sin dato',           // texto del clima
        codigo: w.weather_code                          // código numérico (para detectar tormentas)
      };
    });
    cacheClima = { hora: Date.now(), datos: datos };    // guarda en memoria
    return datos;
  } catch (e) {
    console.error('Open-Meteo (ciudades) falló:', e);   // deja el error en la consola
    return null;
  }
}

function horaActual() {                                 // "4:59 p. m."
  return new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
}
