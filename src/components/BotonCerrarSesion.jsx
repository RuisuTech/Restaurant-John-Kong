// src/components/BotonCerrarSesion.jsx
import { useNavigate } from "react-router-dom";

function BotonCerrarSesion() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <button
      onClick={cerrarSesion}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Cerrar Sesión
    </button>
  );
}

export default BotonCerrarSesion;
