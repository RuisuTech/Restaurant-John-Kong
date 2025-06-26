import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo"; // Componente para fondo decorativo con imagen y blur
import Boton from "../../components/Boton"; // Componente reutilizable para botones
import ToggleTema from "../../components/ToggleTema"; // Switch para modo claro/oscuro
import fondoCliente from "../../assets/fondo.webp"; // Imagen de fondo
import { FiLogOut } from "react-icons/fi"; // Ícono para cerrar sesión

// Vista principal del cliente al iniciar sesión
function Cliente() {
  const [usuario, setUsuario] = useState(null); // Almacena datos del usuario actual
  const navigate = useNavigate(); // Hook para navegación entre rutas

  // Al cargar el componente, obtiene los datos del usuario desde localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(data);
  }, []);

  // Función para cerrar sesión: borra el usuario y redirige al login
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <Fondo imageUrl={fondoCliente}>
      {/* Botón fijo de cerrar sesión en la esquina superior izquierda */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow transition-colors duration-300 flex items-center gap-2"
        >
          <FiLogOut />
          Cerrar sesión
        </button>
      </div>

      {/* Botón fijo para alternar tema (claro/oscuro) en la esquina superior derecha */}
      <ToggleTema />

      {/* Contenido principal: saludo y botones de acción */}
      <section className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-xl text-left text-white">
          
          {/* Título personalizado con nombre del usuario */}
          <h1
            className="text-4xl sm:text-6xl font-black leading-tight mb-6"
            style={{ fontFamily: "Mulish" }}
          >
            ¡Hola {usuario?.nombre || "cliente"}! 👋
          </h1>

          {/* Descripción introductoria con instrucciones */}
          <p className="text-lg sm:text-xl font-semibold mb-6 space-y-3">
            <span className="block">Gracias por ser parte de nuestra comunidad.</span>
            <span className="block">
              Aquí puedes gestionar fácilmente tus reservas y mantener el control
              de tus visitas. Tienes dos opciones para continuar:
            </span>
          </p>

          {/* Botones de acción: reservar y ver historial */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Boton
              texto="📅 Reservar"
              onClickOverride={() => navigate("/reservar")}
              bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
              textColor="text-white dark:text-black"
              className="h-[50px] w-full"
            />
            <Boton
              texto="🕓 Historial de Reservas"
              onClickOverride={() => navigate("/historial")}
              // ✅ bgColor estaba mal escrito como "gColor" en una versión anterior
              bgColor="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              textColor="text-white dark:text-black"
              className="h-[50px] w-full"
            />
          </div>
        </div>
      </section>
    </Fondo>
  );
}

export default Cliente; // Exporta la vista del cliente
