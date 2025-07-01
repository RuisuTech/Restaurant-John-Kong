// BarraUsuario.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import Boton from "./Boton"; // Asegúrate de importar tu componente Boton

function BarraUsuario({ mostrarVolver = false }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(data);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-black/30 backdrop-blur-sm shadow">
      {/* Nombre del usuario a la izquierda */}
      <div className="flex items-center gap-2 text-white font-semibold">
        <FaUser />
        <span
          className={`truncate max-w-[200px] ${
            mostrarVolver ? "hidden sm:inline" : "inline"
          }`}
        >
          {usuario?.nombre || "Usuario"}
        </span>
      </div>

      <div className="flex gap-3 items-center">
        {/* Mostrar botón Volver si la prop está activa */}
        {mostrarVolver && (
          <button
            onClick={() => navigate(-1)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm sm:text-base"
          >
            <FiArrowLeft />
            Volver
          </button>
        )}

        {/* Botón cerrar sesión */}
        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm sm:text-base"
        >
          Cerrar sesión
          <FiLogOut />
        </button>
      </div>
    </div>
  );
}

export default BarraUsuario;
