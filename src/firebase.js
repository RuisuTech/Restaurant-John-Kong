// src/firebase.js

// ✅ Importamos las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Configuración de Firebase obtenida desde el panel del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDLkSLJBSGxU3OyhV2q7-u2hFUwP6QiT6s",                // Clave de API pública para conexión
  authDomain: "restaurant-jhohn-kong.firebaseapp.com",             // Dominio autorizado para autenticación
  projectId: "restaurant-jhohn-kong",                              // ID del proyecto en Firebase
  storageBucket: "restaurant-jhohn-kong.firebasestorage.app",     // Bucket para almacenamiento
  messagingSenderId: "490765163295",                               // ID del remitente para notificaciones
  appId: "1:490765163295:web:561c4860dfd3940bd16e2a",              // ID de la aplicación web
  measurementId: "G-MJ9TMKEWS1"                                    // ID para medición (opcional)
};

// ✅ Inicializamos Firebase con la configuración anterior
const app = initializeApp(firebaseConfig);

// ✅ Obtenemos el objeto de autenticación de Firebase
const auth = getAuth(app);

// ✅ Creamos un proveedor de autenticación con Google
const googleProvider = new GoogleAuthProvider();

// ✅ Exportamos los objetos para usarlos en otras partes de la app
export { auth, googleProvider };
