
const WMO = {
  0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla', 48: 'Niebla con escarcha',
  51: 'Llovizna ligera', 53: 'Llovizna', 55: 'Llovizna intensa', 56: 'Llovizna helada', 57: 'Llovizna helada',
  61: 'Lluvia ligera', 63: 'Lluvia', 65: 'Lluvia fuerte', 66: 'Lluvia helada', 67: 'Lluvia helada',
  71: 'Nevada ligera', 73: 'Nevada', 75: 'Nevada fuerte', 77: 'Granizo fino',
  80: 'Chubascos ligeros', 81: 'Chubascos', 82: 'Chubascos violentos', 85: 'Chubascos de nieve', 86: 'Chubascos de nieve',
  95: 'Tormenta', 96: 'Tormenta con granizo', 99: 'Tormenta con granizo fuerte'
};

function tcol(t) {                                      
  if (t >= 30) return '#ff5a3d';                     
  if (t <= 5) return '#6ea8ff';                        
  return '#7fe0a8';                                    
}
