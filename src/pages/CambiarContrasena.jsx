import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Componentes personalizados
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import fondo from "../assets/fondo.webp";
import ModalExito from "../components/ModalExito"; // (no usado directamente en este archivo)
import { usuarios as usuariosBase } from "../utils/usuarios"; // usuarios base predefinidos

function CambiarContrasena() {
  // Estado para mostrar el modal (no se usa en el render actual)
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estados para los campos del formulario
  const [nueva, setNueva] = useState("");        // Nueva contraseña
  const [confirmar, setConfirmar] = useState(""); // Confirmación de contraseña
  const [error, setError] = useState("");        // Mensaje de error
  const navigate = useNavigate();                // Hook para redireccionar

  // Obtener el correo almacenado temporalmente durante el flujo de recuperación
  const correo = localStorage.getItem("recuperacionEmail");

  // Si no hay correo en localStorage, se redirige al usuario al paso anterior
  if (!correo) {
    navigate("/recuperar");
    return null;
  }

  // Función que se ejecuta al hacer clic en "Guardar contraseña"
  const guardar = () => {
    // Validaciones de campos vacíos
    if (!nueva || !confirmar) {
      setError("Completa todos los campos.");
      return;
    }

    // Validación de longitud mínima
    if (nueva.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Verifica si ambas contraseñas coinciden
    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Obtener usuarios locales del localStorage (usuarios registrados por el cliente)
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Mezclar usuarios base con los locales (evitar duplicados)
    const todos = [
      ...usuariosBase,
      ...usuariosLocales.filter(
        (u) => !usuariosBase.some((base) => base.correo === u.correo)
      ),
    ];

    // Actualizar la contraseña del usuario con el correo correspondiente
    const actualizados = todos.map((u) =>
      u.correo === correo ? { ...u, password: nueva } : u
    );

    // Filtrar nuevamente para dejar solo los usuarios que no son de la base
    const nuevosLocales = actualizados.filter(
      (u) => !usuariosBase.some((base) => base.correo === u.correo) || true
    );

    // Guardar cambios en localStorage
    localStorage.setItem("usuarios", JSON.stringify(nuevosLocales));
    localStorage.removeItem("recuperacionEmail"); // Limpia la sesión temporal
    setMostrarModal(true); // (no usado en vista) podría mostrar confirmación
    navigate("/login"); // Redirige a la página de inicio de sesión
  };

  return (
    <Fondo imageUrl={fondo}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white dark:bg-black/40 p-8 rounded-2xl shadow-xl">
          
          {/* Contenedor general con título e icono */}
          <CajaContenido
            titulo="Crea una nueva contraseña"
            descripcion="Introduce una nueva contraseña para tu cuenta. Asegúrate de que sea segura y fácil de recordar."
            tituloSize="text-3xl"
            descripcionSize="text-sm"
            textAlign="text-center"
            className="!bg-transparent !p-0 !shadow-none"
          >
            {/* Icono de candado */}
            <div className="flex justify-center mb-6 text-black dark:text-white">
              <i className="fa-solid fa-lock text-4xl"></i>
            </div>

            {/* Mensaje de error si lo hay */}
            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

            {/* Campo: nueva contraseña */}
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />
            <p className="text-xs my-4 text-gray-600 dark:text-gray-300">
              Debe tener al menos 8 caracteres y combinar letras, números o
              símbolos.
            </p>

            {/* Campo: confirmar contraseña */}
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full mb-6 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />

            {/* Botón: guardar */}
            <Boton
              texto="Guardar contraseña"
              onClickOverride={guardar}
              bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
              textColor="text-white dark:text-black"
              className="h-[50px] w-full"
            />

            {/* Botón: volver al paso anterior */}
            <Boton
              texto="Volver"
              onClickOverride={() => navigate("/verificar-codigo")}
              bgColor="bg-gray-400 hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-500"
              textColor="text-white dark:text-b"
              className="h-[50px] w-full mt-4"
            />
          </CajaContenido>
        </div>
      </div>
    </Fondo>
  );
}

export default CambiarContrasena;
