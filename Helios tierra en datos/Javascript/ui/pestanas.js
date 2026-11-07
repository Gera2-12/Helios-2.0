const DISPONIBLES=['Inicio','Clima global','Alertas','Acerca de']; // pestañas ya habilitadas
TABS.forEach((t,k)=>{                                   // crea las pestañas
 const b=document.createElement('button');
 b.type='button';                                       // botón normal
 b.textContent=t;                                       // texto de la pestaña
 b.className=k?'':'on';                                 // la primera (Inicio) empieza activa
 b.onclick=()=>{
  if(DISPONIBLES.indexOf(t)<0){ toast('Sección “'+t+'” en construcción'); return; } // las demás aún no existen: avisa y no cambia nada
  abrirVista(t);                                        // muestra la vista y marca la pestaña (está en vistas.js)
 };
 $('nav').appendChild(b);
});
