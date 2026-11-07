const pos=(la,lo)=>{                                    // convierte latitud/longitud en un punto sobre la esfera
 const a=la*Math.PI/180, b=lo*Math.PI/180;              // a radianes
 return new THREE.Vector3(Math.cos(a)*Math.cos(b),Math.sin(a),-Math.cos(a)*Math.sin(b)).multiplyScalar(1.005); // fórmula esférica, un pelín por encima de la superficie
};
const M=[
    {la:-6,lo:-79, card:$('hot'), path:$('l1'),dot:$('d1'),side:'r'},
    {la:60,lo:105, card:$('cold'),path:$('l2'),dot:$('d2'),side:'l'}
];
M.forEach(m=>{                                          // por cada marcador...
 m.o=new THREE.Object3D();                              // crea un objeto invisible
 m.o.position.copy(pos(m.la,m.lo));                     // lo coloca en su lugar de la esfera
 globe.add(m.o);                                        // lo pega al planeta para que gire con él
});
const st=document.querySelector('.stage');              // el escenario (para medir posiciones)
const V=new THREE.Vector3();                            // vector reutilizable
function marks(){                                       // se llama en cada cuadro: mueve las líneas
 const s=st.getBoundingClientRect();                    // posición del escenario en pantalla
 const b=box.getBoundingClientRect();                   // posición del planeta en pantalla
    M.forEach(m=>{
  m.o.getWorldPosition(V);                              // posición 3D actual del marcador
  const vis=V.z>.2;                                     // visible solo si el marcador mira hacia la cámara
  m.dot.style.display=vis?'':'none';                    // muestra u oculta el punto (también en celular)
  m.path.style.display=(vis&&ESCRITORIO.matches)?'':'none'; // la línea solo en pantallas grandes; en celular las tarjetas no flotan
  if(!vis) return;                                      // si no se ve, termina
  const p=V.clone().project(cam);                       // convierte 3D a coordenadas de pantalla (-1..1)
  const x=(p.x*.5+.5)*b.width+b.left-s.left;            // píxel X dentro del escenario
  const y=(-p.y*.5+.5)*b.height+b.top-s.top;            // píxel Y dentro del escenario
  const c=m.card.getBoundingClientRect();               // posición de la tarjeta
  const ax=(m.side=='r'?c.right:c.left)-s.left;         // X donde empieza la línea (borde de la tarjeta)
  const ay=c.top+34-s.top;                              // Y donde empieza la línea
  m.dot.setAttribute('cx',x); m.dot.setAttribute('cy',y); // coloca el punto
  m.path.setAttribute('d','M'+ax+' '+ay+'H'+((ax+x)/2)+'L'+x+' '+y); // línea: horizontal y luego diagonal hasta el punto
});
}
