function size(){                                        // ajusta el 3D al tamaño del div
 const w=box.clientWidth, h=box.clientHeight;           // tamaño actual del div
 if(!w||!h) return;                                     // si está oculto (otra pestaña) no hace nada
 ren.setSize(w,h);                                      // tamaño del lienzo
 cam.aspect=w/h; cam.updateProjectionMatrix();          // proporción de la cámara
 cam.position.z=Math.max(3,3.2/cam.aspect);             // en pantallas altas y angostas (celular en modo "solo planeta") aleja la cámara para que el planeta no se corte por los lados
}
if('ResizeObserver' in window) new ResizeObserver(size).observe(box); // reajusta cuando el div cambia (girar el celular, barra del navegador, volver de otra pestaña)
else addEventListener('resize',size);                   // navegadores viejos: usa el evento resize
addEventListener('orientationchange',function(){setTimeout(size,250)}); // al girar el celular, reajusta cuando termine el giro
size();                                                 // ajuste inicial

let drag=null;                                          // guarda el último evento mientras arrastras
let tgt=null;                                           // destino {x,y} cuando el planeta gira hacia una región
box.addEventListener('pointerdown',e=>{                // al tocar o presionar el planeta
 if(!e.isPrimary) return;                               // ignora el segundo dedo (solo cuenta el primero)
 drag=e; tgt=null;                                      // empieza a arrastrar y cancela el giro hacia una región
 try{box.setPointerCapture(e.pointerId)}catch(_){}      // sigue el dedo aunque salga del planeta
});
box.addEventListener('pointermove',e=>{                 // al mover el dedo/mouse
 if(!drag) return;                                      // solo si se está arrastrando
 globe.rotation.y+=(e.clientX-drag.clientX)*.006;       // movimiento horizontal = gira el planeta
 pivot.rotation.x=Math.max(-1.1,Math.min(1.1,pivot.rotation.x+(e.clientY-drag.clientY)*.004)); // vertical = inclina, con límite
 drag=e;                                                // recuerda esta posición
});
['pointerup','pointercancel','lostpointercapture'].forEach(t=>box.addEventListener(t,()=>drag=null)); // al soltar o si el navegador toma el control (scroll): deja de arrastrar

const REDUCIR=matchMedia('(prefers-reduced-motion: reduce)'); // true si la persona pidió menos animaciones en su celular
(function loop(){                                       // bucle de animación
 requestAnimationFrame(loop);                           // se vuelve a llamar en el siguiente cuadro
 if(!box.clientWidth) return;                           // si el planeta está oculto (otra pestaña) no gasta batería dibujando
 if(tgt){                                               // si hay una región destino...
  let d=tgt.y-globe.rotation.y;                         // diferencia de ángulo
  d=Math.atan2(Math.sin(d),Math.cos(d));                // la lleva al camino más corto (-180°..180°)
  globe.rotation.y+=d*.08;                              // avanza 8% del camino (movimiento suave)
  pivot.rotation.x+=(tgt.x-pivot.rotation.x)*.08;       // lo mismo con la inclinación
  if(Math.abs(d)<.002) tgt=null;                        // al llegar, termina
 } else if(!drag && !REDUCIR.matches) globe.rotation.y+=.0012; // si nadie lo toca, gira lentamente (salvo si pidió menos animación)
 ren.render(sc,cam);                                    // dibuja la escena
 marks();                                               // actualiza líneas y puntos
})();