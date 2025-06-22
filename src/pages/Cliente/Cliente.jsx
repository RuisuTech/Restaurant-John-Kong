import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import Boton from "../../components/Boton";
import CajaContenido from "../../components/CajaContenido";
import ToggleTema from "../../components/ToggleTema";
import fondoCliente from "../../assets/fondo.webp";

function Cliente() {
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
    <Fondo imageUrl={fondoCliente}>
      <ToggleTema onLogout={cerrarSesion} />
      <CajaContenido
        titulo={`¡Hola ${usuario?.nombre}! 👋`}
        subtitulo="Bienvenido a John Kong"
        descripcion="Gracias por ser parte de nuestra comunidad. Aquí puedes gestionar fácilmente tus reservas y mantener el control de tus visitas. Tienes dos opciones para continuar:"
        tituloSize="text-4xl"
        subtituloSize="text-2xl"
        descripcionSize="text-sm"
        textAlign="text-center"
      >
        <div className="flex justify-center gap-4 mt-4">
          <Boton
            texto="Reservar"
            onClickOverride={() => navigate("/cliente/reservar")}
            bgColor="bg-green-600 dark:bg-green-400"
            textColor="text-white dark:text-black"
          />
          <Boton
            texto="Historial de Reservas"
            onClickOverride={() => navigate("/cliente/historial")}
            bgColor="bg-emerald-600 dark:bg-emerald-400"
            textColor="text-white dark:text-black"
          />
        </div>
      </CajaContenido>
    </Fondo>
  );
}

export default Cliente;
