// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import {
  getDatabase,
  ref,
  get,
  child,
  update
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Configuración
const firebaseConfig = {
  apiKey: "AIzaSyBTMXFziXEvWyh17t4wEoAenUqwCKdjGGE",
  authDomain: "chatmiguel-dab9b.firebaseapp.com",
  databaseURL: "https://chatmiguel-dab9b-default-rtdb.firebaseio.com",
  projectId: "chatmiguel-dab9b",
  storageBucket: "chatmiguel-dab9b.appspot.com",
  messagingSenderId: "419114138497",
  appId: "1:419114138497:web:f563f02300c7904cd8c680",
  measurementId: "G-2E0ZP0EC1X"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Exportar todo lo necesario
export {
  auth,
  database,
  ref,
  get,
  child,
  update,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
};
