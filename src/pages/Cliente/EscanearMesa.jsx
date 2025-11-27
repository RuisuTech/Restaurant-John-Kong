import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Fondo from "../../components/layout/Fondo";
import BarraUsuario from "../../components/layout/BarraUsuario";
import fondoCliente from "../../assets/fondo.webp";
import ScanQR from "../../components/menu/ScanQR";
import { useAuth } from "../../context/AuthContext";

export default function EscanearMesa() {
  const navigate = useNavigate();
  const { usuario } = useAuth() || {};

  useEffect(() => {
    if (!usuario) navigate("/login");
  }, [usuario, navigate]);

  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "¡Buenos días";
    if (hora < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  return (
    <Fondo imageUrl={fondoCliente}>
      <BarraUsuario />

      <section className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-xl text-center text-white bg-black/50 p-6 rounded-lg shadow-lg">
          <h1
            className="text-4xl font-black mb-4"
            style={{ fontFamily: "Mulish" }}
          >
            {getSaludo()} {usuario?.nombre || "cliente"}! 👋
          </h1>

          <p className="text-lg mb-6">
            Escanea el código QR de tu mesa para comenzar tu pedido.
          </p>

          <div className="w-full mb-6">
            <ScanQR />
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded text-white font-semibold transition"
          >
            🔙 Volver
          </button>
        </div>
      </section>
    </Fondo>
  );
}
