import ModalBase from "./ModalBase";
import Boton from "./Boton";

// Modal para mostrar mensajes de error con un botón de cierre
function ModalError({
  mensaje = "¡Ocurrió un error!", // Título principal del modal
  descripcion,                    // Descripción opcional del error
  textoBoton = "Cerrar",          // Texto del botón para cerrar el modal
  onClose,                        // Función que se ejecuta al cerrar
}) {
  return (
    <ModalBase
      icono="✕"                            // Icono de error (equis)
      iconoColor="text-red-500"           // Color del icono
      titulo={mensaje}                    // Título del error
      descripcion={descripcion}           // Descripción opcional
    >
      {/* Botón para cerrar el modal */}
      <Boton
        texto={textoBoton}
        onClickOverride={onClose}
        bgColor="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        textColor="text-white dark:text-black"
        className="w-full"
      />
    </ModalBase>
  );
}

export default ModalError; // Exporta el componente para mostrar errores desde cualquier parte
