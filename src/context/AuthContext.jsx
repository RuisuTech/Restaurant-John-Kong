// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { crearUsuario } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true); // ⏳ Nuevo estado de carga

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false); // ✅ Solo después de chequear localStorage
  }, []);

  const login = (data) => {
    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  const loginConGoogle = async () => {
    try {
      const resultado = await signInWithPopup(auth, googleProvider);
      const usuarioGoogle = resultado.user;

      const nuevoUsuario = {
        nombre: usuarioGoogle.displayName,
        correo: usuarioGoogle.email,
        foto: usuarioGoogle.photoURL,
        rol: "cliente", // 👈 Puedes cambiar según tus reglas de negocio
      };

      // Enviar al backend (si no existe, se creará)
      const usuarioEnDB = await crearUsuario(nuevoUsuario);

      // Guardar en localStorage y contexto
      login(usuarioEnDB);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error; // para que puedas manejarlo en la UI si quieres
    }
  };

  return (
    <AuthContext.Provider
      value={{ usuario, login, logout, cargando, loginConGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  return useContext(AuthContext);
}
