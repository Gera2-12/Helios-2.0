// ===== ui/toast.js =====
// Qué hace:  el aviso emergente que aparece abajo.
// Necesita:  $.
// Entrega:   toast(texto).

function toast(t){                                      // muestra un aviso emergente
 const e=$('toast');                                    // el div del aviso
 e.textContent=t;                                       // le pone el texto
 e.style.opacity=1;                                     // lo hace visible
 clearTimeout(toast.k);                                 // cancela el temporizador anterior
 toast.k=setTimeout(()=>e.style.opacity=0,2600);        // lo oculta a los 2.6 segundos (un poco más: en celular se lee más lento)
}
