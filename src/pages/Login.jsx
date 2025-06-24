import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuarios } from "../utils/usuarios";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logo-white.png";
import fondoLogin from "../assets/fondo.webp";
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import LinkSpan from "../components/LinkSpan";
import { useTema } from "../hooks/useTema"; 

function Login() {
  const navigate = useNavigate();
  const accederConGoogle = async () => {
    try {
      const resultado = await signInWithPopup(auth, googleProvider);
      const usuario = resultado.user;

      const userData = {
        nombre: usuario.displayName,
        correo: usuario.email,
        rol: "cliente",
      };

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const yaExiste = usuarios.some((u) => u.correo === userData.correo);
      if (!yaExiste) {
        localStorage.setItem(
          "usuarios",
          JSON.stringify([...usuarios, userData])
        );
      }

      localStorage.setItem("usuario", JSON.stringify(userData));
      navigate("/cliente");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert("Ocurrió un error al iniciar sesión con Google.");
    }
  };

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { modo } = useTema();

  const handleLogin = () => {
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];

    const listaUsuarios = [
      ...usuarios,
      ...usuariosLocales.filter(
        (u) => !usuarios.some((base) => base.correo === u.correo)
      ),
    ];

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
      <CajaContenido
        titulo="Iniciar Sesión"
        tituloSize="text-3xl"
        textAlign="text-center"
      >
        <div className="flex justify-center my-10 mb-14">
          <img src={modo === "oscuro" ? logoWhite : logo } alt="Logo" className="h-24" />
        </div>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin}> 
          <input
            className="w-full mb-4 p-3 bg-transparent rounded-xl border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            className="w-full mb-2 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-right text-sm text-white mb-4">
            <LinkSpan onClick={() => navigate("/recuperar")}>
              ¿Olvidaste tu contraseña?
            </LinkSpan>
          </div>
          <Boton
            children="Iniciar Sesión"
            bgColor="bg-green-500 dark:bg-green-600"
            textColor="text-white dark:text-black"
            className="h-[50px] w-full"
            onClickOverride={handleLogin}
          />
        </form>

        <div className="mt-4">
          <Boton
            children="Acceder con Google"
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
    </Fondo>
  );
}

export default Login;
