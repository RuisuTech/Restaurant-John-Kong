// Importación de componentes reutilizables y recursos
import Fondo from "../components/layout/Fondo";
import Boton from "../components/ui/Boton";
import fondoInicio from "../assets/fondo.webp";
import CajaContenido from "../components/ui/CajaContenido";

function Pagina404() {
  return (
    <Fondo imageUrl={fondoInicio}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <CajaContenido
          glass
          titulo="¡Oops! Página no encontrada"
          descripcion="La ruta que estás buscando no existe o fue movida. Pero no te preocupes, puedes regresar al inicio o iniciar sesión."
          tituloSize="text-4xl md:text-5xl"
          descripcionSize="text-lg"
          textAlign="text-center"
          className="max-w-xl"
        >
          <div className="flex flex-col justify-center sm:flex-row gap-4 mt-6">
            <Boton
              ruta="/"
              bgColor="bg-gray-700"
              textColor="text-white"
              className="h-[50px] w-full sm:w-auto"
            >
              <section className="flex items-center gap-3 justify-center">
                <i className="fa-solid fa-house"></i>
                <span>Ir al inicio</span>
              </section>
            </Boton>

            <Boton
              ruta="/login"
              bgColor="bg-green-600"
              textColor="text-white"
              className="h-[50px] w-full sm:w-auto"
            >
              <section className="flex items-center gap-3 justify-center">
                <i className="fa-solid fa-user"></i>
                <span>Iniciar sesión</span>
              </section>
            </Boton>
          </div>
        </CajaContenido>
      </div>
    </Fondo>
  );
}

export default Pagina404;
