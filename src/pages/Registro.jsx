// Importación de hooks de React y navegación
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importación de componentes personalizados y recursos
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import ModalExito from "../components/ModalExito";
import Boton from "../components/Boton";
import LinkSpan from "../components/LinkSpan";
import fondoRegistro from "../assets/fondo.webp";

function Registro() {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // Estado para mostrar mensajes de error
  const [error, setError] = useState("");

  // Estado para mostrar el modal de éxito
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // Hook para redireccionar entre rutas
  const navigate = useNavigate();

  // Función que maneja el proceso de registro
  const registrar = (e) => {
    e.preventDefault();

    // Validación: todos los campos son obligatorios
    if (!nombre || !correo || !password || !confirmar) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Validación: longitud mínima de la contraseña
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Validación: coincidencia de contraseñas
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Verificar si ya hay un usuario registrado con ese correo
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find((u) => u.correo === correo);
    if (existe) {
      setError("Este correo ya está registrado.");
      return;
    }

    // Crear nuevo usuario con rol 'cliente'
    const nuevoUsuario = {
      nombre,
      correo,
      password,
      rol: "cliente",
    };

    // Guardar en localStorage
    localStorage.setItem(
      "usuarios",
      JSON.stringify([...usuarios, nuevoUsuario])
    );

    // Mostrar modal de éxito
    setRegistroExitoso(true);

    // Limpiar errores anteriores
    setError("");
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
          glass // Aplica efecto de fondo difuminado (glassmorphism)
        >
          {/* Mostrar mensaje de error si existe */}
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

          {/* Formulario de registro */}
          <form onSubmit={registrar}>
            {/* Campo: Nombre completo */}
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            {/* Campo: Correo electrónico */}
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            {/* Campo: Contraseña */}
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Recomendación de contraseña */}
            <p className="text-xs my-4 text-black dark:text-gray-200">
              Debe tener al menos 8 caracteres y combinar letras, números o símbolos.
            </p>

            {/* Campo: Confirmar contraseña */}
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full mb-6 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />

            {/* Botón de registro */}
            <Boton
              texto="Registrarme"
              type="submit"
              bgColor="bg-green-600"
              textColor="text-white"
              className="h-[50px] w-full"
            />
          </form>

          {/* Enlace para usuarios que ya tienen una cuenta */}
          <p className="mt-6 text-sm text-center">
            ¿Ya tienes una cuenta?{" "}
            <LinkSpan onClick={() => navigate("/login")}>
              Inicia sesión aquí
            </LinkSpan>
          </p>
        </CajaContenido>
      </div>

      {/* Modal de éxito al registrarse */}
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
