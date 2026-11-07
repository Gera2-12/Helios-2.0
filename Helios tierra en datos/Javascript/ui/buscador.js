// ===== ui/buscador.js =====
// Qué hace:  los dos buscadores: primero busca entre las regiones; si no hay, consulta Open-Meteo.
// Necesita:  $, R, pick, buscarClima, mostrar, toast.
// Entrega:   buscar(texto).

async function buscar(texto){                           // async: puede esperar a internet
 texto=texto.trim();                                    // quita espacios sobrantes
 if(!texto) return;                                     // si está vacío no hace nada
 if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); // cierra el teclado del celular para ver el resultado
 const k=R.findIndex(r=>r.n.toLowerCase().includes(texto.toLowerCase())); // ¿es una de las regiones?
 if(k>=0){ pick(k); return; }                           // sí: gira hacia ella, como antes
 toast('Buscando “'+texto+'”…');                        // no: avisa que busca en Open-Meteo
 const d=await buscarClima(texto);                      // pide los datos y espera la respuesta
 if(d){ mostrar(d); toast('Datos de '+d.nombre); }      // los muestra en la tarjeta
 else toast('No encontré “'+texto+'” (revisa internet)'); // o avisa si falló
}
[['q','qb'],['sq','sb']].forEach(([inp,btn])=>{         // conecta los dos buscadores
 $(inp).addEventListener('keydown',e=>{ if(e.key==='Enter') buscar($(inp).value); }); // tecla Enter / "Buscar" del teclado del celular
 $(btn).addEventListener('click',()=>buscar($(inp).value)); // toque en la lupa
});
