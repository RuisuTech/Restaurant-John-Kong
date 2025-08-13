import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import Boton from "../../components/Boton";
import ToggleTema from "../../components/ToggleTema";
import BarraUsuario from "../../components/BarraUsuario";
import { useAuth } from "../../context/AuthContext";
import fondoAdmin from "../../assets/fondo.webp";

function Admin() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  return (
    <Fondo imageUrl={fondoAdmin}>
      <BarraUsuario />
      <ToggleTema />

      <section className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-xl md:max-w-3xl lg:max-w-5xl text-left text-white dark:text-white">
          <h1 className="text-4xl sm:text-6xl font-black leading-tight mb-6 font-mulish">
            ¡Hola {usuario?.nombre || "admin"}! 👋
          </h1>

          <p className="text-lg sm:text-xl font-semibold mb-6 space-y-3">
            <span className="block">Bienvenido al panel administrativo.</span>
            <span className="block">
              Aquí puedes gestionar las reservas de los clientes y acceder al calendario general.
            </span>
          </p>

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
