// auth.js

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import {
  getDatabase,
  ref,
  get,
  child,
  update
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

import { enviarVerificacionEmail } from './correo.js';
import { auth, database } from './firebase.js';

// Elementos DOM
const mensajeRegistro = document.getElementById('mensajeRegistro');
const registerContainer = document.getElementById('registerContainer');
const loginContainer = document.getElementById('loginContainer');
const gameContainer = document.getElementById('gameContainer');
const feedback = document.getElementById('feedback');

function setMessage(element, text, type = '') {
  if (!element) return;
  element.textContent = text;
  element.className = `message ${type}`.trim();
}

// Mostrar formulario de login
export function mostrarLogin() {
  if (registerContainer) registerContainer.style.display = 'none';
  if (loginContainer) loginContainer.style.display = 'block';
  setMessage(mensajeRegistro, '');
}

// Mostrar formulario de registro
export function mostrarRegistro() {
  if (loginContainer) loginContainer.style.display = 'none';
  if (registerContainer) registerContainer.style.display = 'block';
}

// Registro con correo y código de kit
export async function registrarUsuario() {
  const nombre = document.getElementById('nombre')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const codigoKit = document.getElementById('codigoKit')?.value.trim();

  if (!nombre || !email || !password || !codigoKit) {
    setMessage(mensajeRegistro, "Todos los campos son obligatorios.", 'error-message');
    return;
  }

  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `kits/${codigoKit}`));
    const kit = snapshot.val();

    if (!kit || kit.usado) {
      setMessage(mensajeRegistro, "Código de kit inválido o ya usado.", 'error-message');
      return;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const userData = {
      nombre,
      email,
      puntosTotales: 0,
      animalesDescubiertos: {},
      ultimaSesion: new Date().toISOString(),
      codigoKit
    };

    const updates = {};
    updates[`usuarios/${uid}`] = userData;
    updates[`kits/${codigoKit}/usado`] = true;
    updates[`kits/${codigoKit}/usuarioAsignado`] = uid;

    await update(ref(database), updates);

    setMessage(mensajeRegistro, "¡Registro exitoso! Puedes iniciar sesión.", 'success-message');
    await enviarVerificacionEmail(cred.user);
    window.location.href = 'index.html';

  } catch (error) {
    setMessage(mensajeRegistro, "Error al registrar: " + error.message, 'error-message');
    console.error(error);
  }
}

// Inicio de sesión (correo o anónimo)
export async function iniciarSesion() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const nombreJugadorInput = document.getElementById('nombreJugador');
  const mensajeLogin = document.getElementById('mensajeLogin');

  const email = emailInput?.value.trim() || "";
  const password = passwordInput?.value.trim() || "";
  const nombreJugador = nombreJugadorInput?.value.trim() || "";

  // Login con correo y contraseña
  if (email && password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'menu-jugador.html';
    } catch (error) {
      setMessage(mensajeLogin, "Error al iniciar sesión: " + error.message, 'error-message');
      console.error(error);
    }
    return;
  }

  // Login anónimo (si hay nombre)
  if (nombreJugador) {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      const usuarioRef = ref(database, `usuarios/${user.uid}`);
      const snapshot = await get(usuarioRef);

      const updateData = {
        nombre: nombreJugador,
        ultimaSesion: new Date().toISOString()
      };

      if (!snapshot.exists()) {
        updateData.puntosTotales = 0;
        updateData.animalesDescubiertos = {};
      }

      await update(usuarioRef, updateData);
      window.location.href = 'menu-jugador.html';

    } catch (error) {
      console.error("Login anónimo falló:", error);
      alert("No se pudo iniciar sesión. Intenta de nuevo.");
    }
    return;
  }

  alert("Por favor, completa los datos para iniciar sesión.");
}

export async function recuperarPassword() {
  const emailInput = document.getElementById('email');
  const mensajeRecuperacion = document.getElementById('mensajeRecuperacion');
  const email = emailInput?.value.trim() || "";

  if (!email) {
    setMessage(mensajeRecuperacion, "Ingresa tu correo electrónico.", 'error-message');
    return false;
  }

  try {
    auth.languageCode = 'es';
    await sendPasswordResetEmail(auth, email);
    setMessage(
      mensajeRecuperacion,
      `Solicitud aceptada para ${email}. Firebase enviará el enlace solo si este correo pertenece a una cuenta. Revisa también Spam y Promociones.`,
      'success-message'
    );
    return true;
  } catch (error) {
    const mensajes = {
      'auth/invalid-email': 'El correo electrónico no tiene un formato válido.',
      'auth/missing-email': 'Ingresa tu correo electrónico.',
      'auth/too-many-requests': 'Se hicieron demasiados intentos. Espera unos minutos y vuelve a probar.',
      'auth/network-request-failed': 'No se pudo conectar con Firebase. Revisa tu conexión a internet.'
    };
    setMessage(
      mensajeRecuperacion,
      mensajes[error.code] || 'Firebase no pudo procesar la solicitud. Intenta nuevamente en unos minutos.',
      'error-message'
    );
    console.error(error);
    return false;
  }
}

// Escucha de cambios de sesión
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const snapshot = await get(child(ref(database), `usuarios/${user.uid}`));
    const data = snapshot.val();
    if (data) {
      if (feedback) feedback.textContent = `¡Hola ${data.nombre}! Escanea un código QR para comenzar.`;
      if (loginContainer) loginContainer.style.display = 'none';
      if (registerContainer) registerContainer.style.display = 'none';
      if (gameContainer) gameContainer.style.display = 'flex';
    }
  } else {
    if (gameContainer) gameContainer.style.display = 'none';
    if (registerContainer) registerContainer.style.display = 'block';
    if (loginContainer) loginContainer.style.display = 'block';
    if (feedback) feedback.textContent = 'Bienvenido al Zoológico Mágico';
  }
});
