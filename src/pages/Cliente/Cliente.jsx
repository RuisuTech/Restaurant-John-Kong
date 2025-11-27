import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Fondo from "../../components/layout/Fondo";
import Boton from "../../components/ui/Boton";
import fondoCliente from "../../assets/fondo.webp";
import BarraUsuario from "../../components/layout/BarraUsuario";
import { useAuth } from "../../context/AuthContext";

function Cliente() {
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

      <section className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-xl text-left text-white">
          <h1
            className="text-4xl font-black mb-6"
            style={{ fontFamily: "Mulish" }}
          >
            {getSaludo()} {usuario?.nombre || "cliente"}! 👋
          </h1>

          <p className="text-lg mb-6">
            Gestiona tus reservas o realiza tu pedido en mesa.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <Boton
              texto="📷 Escanear Mesa"
              onClickOverride={() => navigate("/mesa")}
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              className="h-[50px] w-full"
            />

            <Boton
              texto="📅 Reservar"
              onClickOverride={() => navigate("/reservar")}
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              className="h-[50px] w-full"
            />

            <Boton
              texto="🕓 Historial de Reservas"
              onClickOverride={() => navigate("/historial")}
              bgColor="bg-emerald-500 hover:bg-emerald-600"
              textColor="text-white"
              className="h-[50px] w-full"
            />
            <Boton
              texto="📦 Ver estado de mi pedido"
              onClickOverride={() => navigate("/pedido")} // ruta donde mostrarás los pedidos
              bgColor="bg-yellow-600 hover:bg-yellow-700"
              textColor="text-white"
              className="h-[50px] w-full"
            />
          </div>
        </div>
      </section>
    </Fondo>
  );
}

export default Cliente;
