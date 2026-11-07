
function tex(){
 const W=1024, H=512;                                   // tamaño de la imagen (el doble de ancho que de alto)
 const c=document.createElement('canvas');              // crea un canvas invisible
 c.width=W; c.height=H;                                 // le da tamaño
 const g=c.getContext('2d');                            // "pincel" para dibujar
 const X=o=>(o+180)/360*W;                              // longitud (-180..180) -> píxel horizontal
 const Y=a=>(90-a)/180*H;                               // latitud (90..-90) -> píxel vertical
 const path=()=>{                                       // traza el contorno de todos los continentes
  g.beginPath();                                        // empieza un trazo nuevo
  P.forEach(p=>{                                        // por cada continente...
   p.forEach(([lo,la],k)=>k?g.lineTo(X(lo),Y(la)):g.moveTo(X(lo),Y(la))); // ...mueve al primer punto y une los demás
   g.closePath();                                       // cierra el contorno
  });
 };
 g.fillStyle='#071b45'; g.fillRect(0,0,W,H);            // pinta todo de azul oscuro: el océano
 g.save(); path(); g.clip();                            // desde aquí solo se pinta dentro de los continentes
 const t=g.createLinearGradient(0,0,0,H);               // degradado vertical = por latitud
 [[0,'#f1f8ff'],[.12,'#7db4ff'],[.25,'#2c6bd8'],[.33,'#2e9d5b'],[.4,'#c9b43a'],[.46,'#ff8a1f'],[.5,'#ff3d1a'],[.54,'#ff8a1f'],[.6,'#c9b43a'],[.67,'#2e9d5b'],[.78,'#2c6bd8'],[.9,'#9ccbff'],[1,'#fff']]
  .forEach(([s,k])=>t.addColorStop(s,k));               // polos fríos (blanco/azul), ecuador caliente (rojo)
 g.fillStyle=t; g.fillRect(0,0,W,H);                    // aplica el degradado
 [[-65,-8,130,'#d81a10'],[20,22,150,'#ff6a10'],[134,-25,90,'#ff5a1a'],[100,62,140,'#1f4fd8'],[-45,72,90,'#9ccbff'],[50,25,90,'#ff7a18']] // manchas: [lon, lat, radio, color]
  .forEach(([lo,la,r,k])=>{
   const d=g.createRadialGradient(X(lo),Y(la),0,X(lo),Y(la),r); // degradado circular
   d.addColorStop(0,k); d.addColorStop(1,k+'00');       // del color a transparente
   g.fillStyle=d; g.fillRect(0,0,W,H);                  // pinta la mancha
  });
 for(let i=0;i<9000;i++){               
  g.fillStyle=Math.random()<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.1)'; // oscuro o claro
  g.fillRect(Math.random()*W,Math.random()*H,3,2);      // puntito en posición aleatoria
 }
 g.restore();                                           // quita el recorte
 path(); g.strokeStyle='rgba(255,255,255,.35)'; g.lineWidth=1.2; g.stroke(); // dibuja el borde de las costas
 return c;                                              // devuelve la imagen terminada
}
