// src/firebase.js

// ✅ Importamos las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

// ✅ Configuración de Firebase obtenida desde el panel del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDLkSLJBSGxU3OyhV2q7-u2hFUwP6QiT6s",
  authDomain: "restaurant-jhohn-kong.firebaseapp.com",
  projectId: "restaurant-jhohn-kong",
  storageBucket: "restaurant-jhohn-kong.firebasestorage.app",
  messagingSenderId: "490765163295",
  appId: "1:490765163295:web:561c4860dfd3940bd16e2a",
  measurementId: "G-MJ9TMKEWS1"
};

// ✅ Inicializamos Firebase con la configuración anterior
const app = initializeApp(firebaseConfig);

// ✅ Obtenemos el objeto de autenticación de Firebase
const auth = getAuth(app);

// ✅ Creamos un proveedor de autenticación con Google
const googleProvider = new GoogleAuthProvider();

// ✅ Exportamos para usarlos en otras partes de la app
export { auth, googleProvider, signInWithPopup };
