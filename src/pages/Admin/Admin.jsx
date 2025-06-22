import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import CajaContenido from "../../components/CajaContenido";
import ToggleTema from "../../components/ToggleTema";
import fondoAdmin from "../../assets/fondo.webp";
import Boton from "../../components/Boton";

function Admin() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(data);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <Fondo imageUrl={fondoAdmin}>
      <ToggleTema onLogout={cerrarSesion} />
      <CajaContenido
        titulo={`¡Hola ${usuario?.nombre}! 👋`}
        subtitulo="Bienvenido a John Kong"
        descripcion="Gracias por ser parte de nuestra comunidad. Aquí puedes gestionar las reservas de los clientes. Tienes dos opciones para continuar:"
        tituloSize="text-4xl"
        subtituloSize="text-2xl"
        descripcionSize="text-sm"
        textAlign="text-center"
      >
        <div className="flex justify-center gap-4 mt-4">
          <Boton
            texto="Panel de Control"
            onClickOverride={() => navigate("/admin/panel")}
            bgColor="bg-blue-600 dark:bg-blue-300"
            textColor="text-white dark:text-black"
          />
          <Boton
            texto="Calendario"
            onClickOverride={() => navigate("/admin/calendario")}
            bgColor="bg-indigo-600 dark:bg-indigo-300"
            textColor="text-white dark:text-black"
          />
        </div>
      </CajaContenido>
    </Fondo>
  );
}

export default Admin;
