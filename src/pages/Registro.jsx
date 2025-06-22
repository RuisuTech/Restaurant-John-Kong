import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import ModalExito from "../components/ModalExito";
import Boton from "../components/Boton";
import LinkSpan from "../components/LinkSpan";
import fondoRegistro from "../assets/fondo.webp";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const navigate = useNavigate();

  const registrar = (e) => {
    e.preventDefault();
    if (!nombre || !correo || !password || !confirmar) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find((u) => u.correo === correo);
    if (existe) {
      setError("Este correo ya está registrado.");
      return;
    }

    const nuevoUsuario = {
      nombre,
      correo,
      password,
      rol: "cliente",
    };

    localStorage.setItem(
      "usuarios",
      JSON.stringify([...usuarios, nuevoUsuario])
    );
    setRegistroExitoso(true);
    setError("");
  };

  return (
    <Fondo imageUrl={fondoRegistro}>
      <CajaContenido
        titulo="Registro de Cliente"
        subtitulo="Crear una cuenta nueva"
        descripcion="Crea tu cuenta para comenzar. Solo te tomará un momento."
        tituloSize="text-4xl"
        subtituloSize="text-lg"
        descripcionSize="text-sm"
        textAlign="text-center"
      >
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <form onSubmit={registrar}>
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-1 p-3 bg-transparent border border-gray-400 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs mb-4 text-gray-200">
            Debe tener al menos 8 caracteres y combinar letras, números o
            símbolos.
          </p>
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full mb-6 p-3 bg-transparent border border-gray-400 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
          <Boton
            texto="Registrarme"
            ruta=""
            bgColor="bg-green-600"
            textColor="text-white"
            onClickOverride={registrar}
          />
        </form>

        <p className="mt-6 text-sm text-center">
          ¿Ya tienes una cuenta?{" "}
          <LinkSpan onClick={() => navigate("/login")}>
            Inicia sesión aquí
          </LinkSpan>
        </p>
      </CajaContenido>
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
