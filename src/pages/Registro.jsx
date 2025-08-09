import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import ModalExito from "../components/ModalExito";
import Boton from "../components/Boton";
import LinkSpan from "../components/LinkSpan";
import fondoRegistro from "../assets/fondo.webp";
import { crearUsuario, obtenerUsuarios } from "../utils/api";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const { login } = useAuth();

  const [error, setError] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const navigate = useNavigate();

  const registrar = async (e) => {
    e.preventDefault();
    setError("");

    // 📌 Validaciones regex
    const nombreRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // genérico
    // Si quieres solo Gmail: const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Validar campos vacíos
    if (!nombre || !correo || !password || !confirmar) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Validar nombre
    if (!nombreRegex.test(nombre.trim())) {
      setError("El nombre solo puede contener letras y espacios (mínimo 2 caracteres).");
      return;
    }

    // Validar email
    if (!emailRegex.test(correo.trim())) {
      setError("El correo electrónico no es válido.");
      return;
    }

    // Validar contraseña
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Confirmar contraseña
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const correoNormalizado = correo.trim().toLowerCase();

      const usuarios = await obtenerUsuarios();
      const yaExiste = usuarios.some(
        (u) => u.correo.toLowerCase() === correoNormalizado
      );

      if (yaExiste) {
        setError("Este correo ya está registrado.");
        return;
      }

      const nuevoUsuario = {
        nombre: nombre.trim(),
        correo: correoNormalizado,
        password,
        rol: "cliente",
      };

      const usuarioCreado = await crearUsuario(nuevoUsuario);

      login(usuarioCreado);
      setRegistroExitoso(true);
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("Hubo un error en el servidor. Intenta más tarde.");
    }
  };

  return (
    <Fondo imageUrl={fondoRegistro}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <CajaContenido
          titulo="Registro de Cliente"
          subtitulo="Crear una cuenta nueva"
          descripcion="Crea tu cuenta para comenzar. Solo te tomará un momento."
          tituloSize="text-3xl"
          subtituloSize="text-lg"
          descripcionSize="text-sm"
          textAlign="text-center"
          glass
        >
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

          <form onSubmit={registrar}>
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="text-xs my-4 text-black dark:text-gray-200">
              Debe tener al menos 8 caracteres y combinar letras, números o
              símbolos.
            </p>

            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full mb-6 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />

            <Boton
              texto="Registrarme"
              type="submit"
              bgColor="bg-green-600"
              textColor="text-white"
              className="h-[50px] w-full"
            />
          </form>

          <p className="mt-6 text-sm text-center">
            ¿Ya tienes una cuenta?{" "}
            <LinkSpan onClick={() => navigate("/login")}>
              Inicia sesión aquí
            </LinkSpan>
          </p>
        </CajaContenido>
      </div>

      {registroExitoso && (
        <ModalExito
          mensaje="¡Registro exitoso!"
          descripcion="Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión."
          textoBoton="Ir al Login"
          onClose={() => navigate("/login")}
        />
      )}
    </Fondo>
  );
}

export default Registro;
