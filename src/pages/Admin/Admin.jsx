import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import Boton from "../../components/Boton";
import ToggleTema from "../../components/ToggleTema";
import fondoAdmin from "../../assets/fondo.webp";
import { FiLogOut } from "react-icons/fi";

// Vista principal del administrador con accesos al panel de control y calendario
function Admin() {
  const [usuario, setUsuario] = useState(null); // Estado que almacena los datos del usuario autenticado
  const navigate = useNavigate();

  // Obtiene el usuario desde localStorage al cargar el componente
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(data);
  }, []);

  // Elimina la sesión actual y redirige al login
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <Fondo imageUrl={fondoAdmin}> {/* Componente de fondo con imagen desenfocada */}

      {/* Botón fijo para cerrar sesión (esquina superior izquierda) */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow transition-colors duration-300 flex items-center gap-2"
        >
          <FiLogOut />
          Cerrar sesión
        </button>
      </div>

      {/* Botón fijo para alternar entre tema claro/oscuro (esquina superior derecha) */}
      <ToggleTema />

      {/* Contenedor principal centrado vertical y horizontalmente */}
      <section className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-xl text-left text-white">

          {/* Saludo personalizado para el administrador */}
          <h1
            className="text-4xl sm:text-6xl font-black leading-tight mb-6"
            style={{ fontFamily: "Mulish" }}
          >
            ¡Hola {usuario?.nombre || "admin"}! 👋
          </h1>

          {/* Breve descripción de funciones disponibles */}
          <p className="text-lg sm:text-xl font-semibold mb-6 space-y-3">
            <span className="block">Bienvenido al panel administrativo.</span>
            <span className="block">
              Aquí puedes gestionar las reservas de los clientes y acceder al calendario general.
            </span>
          </p>

          {/* Botones de navegación a otras secciones administrativas */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Boton
              texto="📋 Panel de Control"
              onClickOverride={() => navigate("/admin/panel")}
              bgColor="bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
              textColor="text-white dark:text-black"
              className="h-[50px] w-full"
            />
            <Boton
              texto="🗓️ Calendario"
              onClickOverride={() => navigate("/admin/calendario")}
              bgColor="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-500"
              textColor="text-white dark:text-black"
              className="h-[50px] w-full"
            />
          </div>
        </div>
      </section>
    </Fondo>
  );
}

export default Admin;
