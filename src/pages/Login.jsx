import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginConGoogle } from "../utils/api";

import logo from "../assets/logo.png";
import logoWhite from "../assets/logo-white.png";
import fondoLogin from "../assets/fondo.webp";
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import LinkSpan from "../components/LinkSpan";
import ToggleTema from "../components/ToggleTema";
import { useTema } from "../hooks/useTema";

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { modo } = useTema();
  const { login } = useAuth();

  // 🔒 Sanitiza entradas para prevenir inyecciones básicas
  const sanitize = (text) => text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const accederConGoogle = async () => {
    try {
      const usuario = await loginConGoogle(); // ✅ Todo centralizado
      login(usuario);
      navigate("/cliente");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert("Ocurrió un error al iniciar sesión con Google.");
    }
  };

  const handleLogin = async () => {
    if (cargando) return;

    setError("");
    if (!correo || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setCargando(true);
    try {
      const correoNormalizado = sanitize(correo.trim().toLowerCase());
      const res = await fetch("/api/usuarios");
      const listaUsuarios = await res.json();

      const user = listaUsuarios.find(
        (u) =>
          u.correo.toLowerCase() === correoNormalizado &&
          u.password === password
      );

      if (user) {
        login(user); // ✅ login desde el contexto
        navigate(user.rol === "admin" ? "/admin" : "/cliente");
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Hubo un problema con el servidor. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Fondo imageUrl={fondoLogin}>
      <ToggleTema />

      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-md bg-white dark:bg-black/40 text-black dark:text-white border border-white/20">
          <CajaContenido
            titulo="Iniciar Sesión"
            tituloSize="text-3xl"
            textAlign="text-center"
            className="!bg-transparent !p-0 !shadow-none"
          >
            <div className="flex justify-center my-6">
              <img
                src={modo === "oscuro" ? logoWhite : logo}
                alt="Logo"
                className="h-24"
              />
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400 mb-4 text-center">
                {error}
              </p>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <input
                className="w-full mb-4 p-3 bg-transparent rounded-xl border border-black/50 dark:border-white text-black dark:text-white placeholder-black/50 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <input
                className="w-full mb-2 p-3 bg-transparent border border-black/50 dark:border-white rounded-xl text-black dark:text-white placeholder-black/50 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="text-right text-sm mb-4">
                <LinkSpan onClick={() => navigate("/recuperar")}>
                  ¿Olvidaste tu contraseña?
                </LinkSpan>
              </div>

              <Boton
                texto={cargando ? "Cargando..." : "Iniciar Sesión"}
                onClickOverride={handleLogin}
                bgColor="bg-green-500 dark:bg-green-600"
                textColor="text-white dark:text-black"
                className="h-[50px] w-full"
                disabled={cargando}
              />
            </form>

            <div className="mt-4">
              <Boton
                texto="Acceder con Google"
                onClickOverride={accederConGoogle}
                bgColor="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                textColor="text-white dark:text-black"
                className="h-[50px] w-full"
              />
            </div>

            <p className="mt-6 text-sm text-center">
              ¿No tienes una cuenta?{" "}
              <LinkSpan onClick={() => navigate("/registro")}>
                Regístrate aquí
              </LinkSpan>
            </p>
          </CajaContenido>
        </div>
      </div>
    </Fondo>
  );
}

export default Login;
