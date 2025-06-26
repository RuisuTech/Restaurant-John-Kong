// Importación de componentes reutilizables y recursos
import Fondo from "../components/Fondo"; // Componente que aplica una imagen de fondo a la página
import Boton from "../components/Boton"; // Botón personalizado reutilizable
import fondoInicio from "../assets/fondo.webp"; // Imagen de fondo de la página de inicio
import CajaContenido from "../components/CajaContenido"; // Contenedor visual con título y descripción

function Inicio() {
  return (
    // Aplicación del fondo general de la pantalla
    <Fondo imageUrl={fondoInicio}>
      <div className="flex justify-center items-center min-h-screen px-4">
        {/* Contenedor central con título, descripción y botón */}
        <CajaContenido
          titulo="¡Bienvenido a John Kong!" // Título principal de bienvenida
          descripcion="Reserva tu mesa de forma rápida y sencilla. Queremos ofrecerte una experiencia gastronómica inolvidable ✨"
          tituloSize="text-5xl" // Tamaño grande para el título
          descripcionSize="text-lg" // Tamaño medio para la descripción
          textAlign="text-left" // Alineación del texto
          className="max-w-xl" // Ancho máximo del contenedor
        >
          {/* Botón que redirige al usuario a la página de login o registro */}
          <Boton
            ruta="/login"
            bgColor="bg-green-600" // Color de fondo verde
            textColor="text-white" // Texto blanco
            className="h-[50px] mt-6" // Altura fija y margen superior
          >
            {/* Contenido interno del botón: texto e ícono */}
            <section className="flex items-center gap-4 justify-between">
              <span>Inicia Sesión o Regístrate</span>
              <span>
                <i className="fa-solid fa-user"></i> {/* Ícono de usuario */}
              </span>
            </section>
          </Boton>
        </CajaContenido>
      </div>
    </Fondo>
  );
}

export default Inicio;
