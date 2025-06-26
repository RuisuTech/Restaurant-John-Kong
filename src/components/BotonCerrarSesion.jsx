// src/components/BotonCerrarSesion.jsx
import { useNavigate } from "react-router-dom";

// Botón que cierra la sesión del usuario y redirige al login
function BotonCerrarSesion() {
  const navigate = useNavigate(); // Hook para cambiar de ruta

  // Elimina los datos del usuario del almacenamiento local y redirige al login
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <button
      onClick={cerrarSesion} // Ejecuta la función de cierre de sesión al hacer clic
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Cerrar Sesión
    </button>
  );
}

export default BotonCerrarSesion; // Exporta el componente para ser usado en otros lugares
