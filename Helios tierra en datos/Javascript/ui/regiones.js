let cur=0;                                              // índice de la región seleccionada (0 = América del Sur)
function draw(f=''){                                    // dibuja la lista de regiones (f = texto de filtro)
 const lista=$('list');                                 // contenedor de los botones
 lista.innerHTML='';                                    // vacía la lista
 R.forEach((r,k)=>{                                     // por cada región...
  if(!r.n.toLowerCase().includes(f)) return;            // ...la salta si no coincide con el filtro
  const b=document.createElement('button');             // crea un botón
  b.type='button';                                      // botón normal (no envía formularios)
  b.className='rg'+(k==cur?' on':'');                   // le pone la clase "on" si es la seleccionada
  b.innerHTML='<span>'+r.i+'</span>'+r.n;               // icono + nombre
  b.onclick=()=>pick(k);                                // al tocar, selecciona esa región
  lista.appendChild(b);                                 // lo agrega a la lista
 });
 const on=lista.querySelector('.rg.on');                // el botón seleccionado
 if(on){                                                // en celular la lista se desliza de lado: centra el seleccionado
  const a=on.getBoundingClientRect(), c=lista.getBoundingClientRect();
  lista.scrollLeft+=(a.left+a.width/2)-(c.left+c.width/2);
 }
}

function info(r){                                       // llena el panel "Información de la región"
 $('iN').textContent='· '+r.n;                          // nombre de la región
 $('iT').textContent=r.t+' °C';                         // temperatura
 $('iS').textContent=r.s+' °C';                         // sensación térmica
 $('iC').textContent=r.c;                               // condición
 $('iR').textContent=r.r;                               // recomendación
 $('ph').style.background=                              // la "foto" cambia según la temperatura
  r.t>=30?'linear-gradient(#f0b070,#a8643a 60%,#5a3a24)'   // calor: tonos desierto
  :r.t<=0?'linear-gradient(#cfe4ff,#6a96d8 60%,#274a8c)'   // frío: tonos hielo
  :'linear-gradient(#bcd8a8,#4f8a56 60%,#2a4a34)';         // templado: tonos verdes
}

function pick(k){                                       // selecciona una región
 cur=k;                                                 // la recuerda
 const r=R[k];
 tgt={                                                  // le dice a Planeta.js hacia dónde girar
  y:-Math.PI/2-r.lo*Math.PI/180,                        // giro horizontal según la longitud
  x:Math.max(-1.1,Math.min(1.1,r.la*Math.PI/180))       // inclinación según la latitud (con límite)
 };
 draw($('sq').value.toLowerCase());                     // redibuja la lista para marcar la activa
 info(r);                                               // actualiza el panel inferior
}

$('sq').oninput=()=>draw($('sq').value.toLowerCase()); // al escribir en el buscador del panel, filtra la lista
