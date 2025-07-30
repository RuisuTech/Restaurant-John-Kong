// Importación de componentes reutilizables y recursos
import Fondo from "../components/Fondo"; // Componente que aplica una imagen de fondo a la página
import Boton from "../components/Boton"; // Botón personalizado reutilizable
import fondoInicio from "../assets/fondo.webp"; // Imagen de fondo de la página de inicio
import CajaContenido from "../components/CajaContenido"; // Contenedor visual con título y descripción
import { useAuth } from "../context/AuthContext"; // 👈 Importar hook de autenticación

function Inicio() {
  const { usuario } = useAuth(); // 👈 Obtener usuario actual

  const destino = usuario
    ? usuario.rol === "admin"
      ? "/admin"
      : "/cliente"
    : "/login";

  const textoBoton = usuario ? "Ir al Panel" : "Inicia Sesión o Regístrate";

  return (
    <Fondo imageUrl={fondoInicio}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <CajaContenido
          titulo="¡Bienvenido a John Kong!"
          descripcion="Reserva tu mesa de forma rápida y sencilla. Queremos ofrecerte una experiencia gastronómica inolvidable ✨"
          tituloSize="text-5xl"
          descripcionSize="text-lg"
          textAlign="text-left"
          className="max-w-xl text-white"
        >
          <Boton
            ruta={destino}
            bgColor="bg-green-600"
            textColor="text-white"
            className="h-[50px] mt-6"
          >
            <section className="flex items-center gap-4 justify-between">
              <span>{textoBoton}</span>
              <span>
                <i className="fa-solid fa-user"></i>
              </span>
            </section>
          </Boton>
        </CajaContenido>
      </div>
    </Fondo>
  );
}

export default Inicio;
