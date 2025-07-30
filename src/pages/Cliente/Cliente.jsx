import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import Boton from "../../components/Boton";
import ToggleTema from "../../components/ToggleTema";
import fondoCliente from "../../assets/fondo.webp";
import BarraUsuario from "../../components/BarraUsuario";
import { useAuth } from "../../context/AuthContext";

function Cliente() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Redirige si no hay usuario autenticado
  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
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
      <ToggleTema />

      <section className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-xl text-left text-white">
          <h1
            className="text-4xl sm:text-6xl font-black leading-tight mb-6"
            style={{ fontFamily: "Mulish" }}
          >
            {getSaludo()} {usuario?.nombre || "cliente"}! 👋
          </h1>

          <p className="text-lg sm:text-xl font-semibold mb-6 space-y-3">
            <span className="block">
              Gracias por ser parte de nuestra comunidad.
            </span>
            <span className="block">
              Aquí puedes gestionar fácilmente tus reservas y mantener el
              control de tus visitas. Tienes dos opciones para continuar:
            </span>
          </p>

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

export default Cliente;
