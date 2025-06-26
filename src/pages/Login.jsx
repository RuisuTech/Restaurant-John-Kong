// Importación de funciones y hooks necesarios
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // Configuración de Firebase
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Recursos y componentes personalizados
import { usuarios } from "../utils/usuarios"; // Lista base de usuarios por defecto
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
  const navigate = useNavigate(); // Para navegación programática
  const [correo, setCorreo] = useState(""); // Estado para el correo ingresado
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [error, setError] = useState(""); // Estado para errores de validación o autenticación
  const { modo } = useTema(); // Hook para detectar si el modo es claro u oscuro

  // Función para iniciar sesión con Google
  const accederConGoogle = async () => {
    try {
      const resultado = await signInWithPopup(auth, googleProvider);
      const usuario = resultado.user;

      // Estructura de usuario para almacenar en localStorage
      const userData = {
        nombre: usuario.displayName,
        correo: usuario.email,
        rol: "cliente", // Por defecto, usuarios Google son "cliente"
      };

      // Validación: si el usuario no está en localStorage, lo guarda
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const yaExiste = usuarios.some((u) => u.correo === userData.correo);
      if (!yaExiste) {
        localStorage.setItem(
          "usuarios",
          JSON.stringify([...usuarios, userData])
        );
      }

      // Guardar sesión y redirigir al panel cliente
      localStorage.setItem("usuario", JSON.stringify(userData));
      navigate("/cliente");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert("Ocurrió un error al iniciar sesión con Google.");
    }
  };

  // Función para iniciar sesión con correo y contraseña
  const handleLogin = () => {
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Combina usuarios base con locales sin duplicados
    const listaUsuarios = [
      ...usuarios,
      ...usuariosLocales.filter(
        (u) => !usuarios.some((base) => base.correo === u.correo)
      ),
    ];

    // Busca coincidencia exacta de correo y contraseña
    const user = listaUsuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
      navigate(user.rol === "admin" ? "/admin" : "/cliente");
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <Fondo imageUrl={fondoLogin}>
      <ToggleTema /> {/* Botón para cambiar modo claro/oscuro */}

      <div className="flex justify-center items-center min-h-screen px-4">
        {/* Contenedor del formulario de login */}
        <div className="w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-md bg-white dark:bg-black/40 text-black dark:text-white border border-white/20">
          <CajaContenido
            titulo="Iniciar Sesión"
            tituloSize="text-3xl"
            textAlign="text-center"
            className="!bg-transparent !p-0 !shadow-none"
          >
            {/* Logo dinámico según modo claro/oscuro */}
            <div className="flex justify-center my-6">
              <img
                src={modo === "oscuro" ? logoWhite : logo}
                alt="Logo"
                className="h-24"
              />
            </div>

            {/* Mensaje de error si hay fallo de autenticación */}
            {error && (
              <p className="text-red-600 dark:text-red-400 mb-4 text-center">
                {error}
              </p>
            )}

            {/* Formulario de login con inputs controlados */}
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

              {/* Enlace a recuperación de contraseña */}
              <div className="text-right text-sm mb-4">
                <LinkSpan onClick={() => navigate("/recuperar")}>
                  ¿Olvidaste tu contraseña?
                </LinkSpan>
              </div>

              {/* Botón de envío del formulario */}
              <Boton
                children="Iniciar Sesión"
                bgColor="bg-green-500 dark:bg-green-600"
                textColor="text-white dark:text-black"
                className="h-[50px] w-full"
                onClickOverride={handleLogin}
              />
            </form>

            {/* Botón de inicio con Google */}
            <div className="mt-4">
              <Boton
                children="Acceder con Google"
                onClickOverride={accederConGoogle}
                bgColor="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                textColor="text-white dark:text-black"
                className="h-[50px] w-full"
              />
            </div>

            {/* Enlace para registrarse */}
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
