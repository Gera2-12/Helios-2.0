const $ = id => document.getElementById(id);           // atajo: $('list') en vez de document.getElementById('list')
const ESCRITORIO = matchMedia('(min-width:1025px)');   // true en pantallas grandes (PC); false en celular y tableta. Debe coincidir con el @media de los CSS
