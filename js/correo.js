// correo.js

import { auth, sendEmailVerification, sendPasswordResetEmail } from './firebase.js';

/**
 * Enviar correo de verificación después del registro.
 * @param {object} user - El usuario autenticado (cred.user).
 */
export function enviarVerificacionEmail(user) {
  if (!user) {
    console.error("Usuario no definido para verificación de email");
    return Promise.reject("Usuario no definido");
  }

  return sendEmailVerification(user)
    .then(() => {
      console.log("Correo de verificación enviado.");
      alert("Se ha enviado un correo de verificación. Revisa tu bandeja de entrada.");
    })
    .catch((error) => {
      console.error("Error al enviar verificación:", error.message);
      alert("Error al enviar correo de verificación: " + error.message);
    });
}

/**
 * Enviar correo para restablecer contraseña.
 * @param {string} email - El correo del usuario.
 */
export function enviarRecuperacionPassword(email) {
  if (!email) {
    alert("Por favor, ingresa tu correo electrónico.");
    return;
  }

  return sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Se ha enviado un correo para restablecer tu contraseña.");
    })
    .catch((error) => {
      console.error("Error al enviar recuperación:", error.message);
      alert("No se pudo enviar el correo de recuperación: " + error.message);
    });
}
