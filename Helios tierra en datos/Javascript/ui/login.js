import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"; // trae la función que arranca Firebase
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";                        // trae las funciones de entrar y crear cuenta

const auth = getAuth(initializeApp({
    apiKey: "AIzaSyDYUBwMXppWzt8U2d0aCgo-T9nQ3twC6sM",
  authDomain: "helios-51451.firebaseapp.com",
  projectId: "helios-51451",
  storageBucket: "helios-51451.firebasestorage.app",
  messagingSenderId: "744300382916",
  appId: "1:744300382916:web:3cf0e194cf6df6b09dd791"
}));

const form = document.getElementById('login-form');        // el formulario
const user = document.getElementById('login-user');        // campo del correo
const pass = document.getElementById('login-pass');        // campo de la contraseña
const msg = document.getElementById('login-message');      // lugar donde salen los avisos
const modal = document.getElementById('login-modal');      // la ventana del formulario
const bienvenida = document.getElementById('bienvenida');  // la pantalla de bienvenida

function entrar() {                                        // abre la página (es tu código de antes)
  modal.hidden = true;                                     // oculta el formulario
  bienvenida.classList.add('bv-saliendo');                 // desvanece la bienvenida
  document.querySelectorAll('body > *').forEach(function (el) {
    if (el !== bienvenida && el !== modal && el.tagName !== 'SCRIPT' && el.tagName !== 'NOSCRIPT') el.inert = false; // reactiva la página de atrás
  });
  document.documentElement.classList.remove('bv-abierta'); // devuelve el scroll
  setTimeout(function () { bienvenida.hidden = true; }, 650); // oculta la bienvenida cuando termina el desvanecido
  pass.value = ''; msg.textContent = '';                   // limpia la contraseña y los avisos
}

async function acceder(crear) {                            // crear = true registra, false inicia sesión
  if (!form.reportValidity()) return;                      // revisa que los campos estén completos
  msg.textContent = 'Un momento…';                         // aviso mientras responde Firebase
  try {
    const accion = crear ? createUserWithEmailAndPassword : signInWithEmailAndPassword; // elige según el botón
    await accion(auth, user.value.trim(), pass.value);     // le pide a Firebase crear o verificar la cuenta
    entrar();                                              // si salió bien, entra a la página
  } catch (e) {                                            // si Firebase rechaza, explica por qué
    msg.textContent = e.code === 'auth/email-already-in-use' ? 'Ese correo ya tiene cuenta.'
      : e.code === 'auth/weak-password' ? 'La contraseña debe tener mínimo 6 caracteres.'
      : 'Correo o contraseña incorrectos.';
  }
}

form.addEventListener('submit', function (e) { e.preventDefault(); acceder(false); }); // "Continuar" = entrar
document.getElementById('login-registro').addEventListener('click', function () { acceder(true); }); // "Crear cuenta" = registrar