// src/firebase.js

// Importar funciones necesarias
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Configuración de Firebase (copiada desde tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyDLkSLJBSGxU3OyhV2q7-u2hFUwP6QiT6s",
  authDomain: "restaurant-jhohn-kong.firebaseapp.com",
  projectId: "restaurant-jhohn-kong",
  storageBucket: "restaurant-jhohn-kong.firebasestorage.app",
  messagingSenderId: "490765163295",
  appId: "1:490765163295:web:561c4860dfd3940bd16e2a",
  measurementId: "G-MJ9TMKEWS1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar autenticación y proveedor de Google
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
