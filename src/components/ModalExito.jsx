import ModalBase from "./ModalBase";
import Boton from "./Boton";

// Modal que muestra un mensaje de éxito con un botón de confirmación
function ModalExito({
  mensaje = "¡Acción completada con éxito!", // Título del mensaje de éxito
  descripcion,                               // Descripción opcional
  textoBoton = "Aceptar",                    // Texto del botón
  onClose,                                   // Función que se ejecuta al cerrar
}) {
  return (
    <ModalBase
      icono="✓"                             // Icono de confirmación (check)
      iconoColor="text-green-500"          // Color verde para éxito
      titulo={mensaje}                     // Título principal
      descripcion={descripcion}            // Descripción opcional
    >
      {/* Botón que cierra el modal */}
      <Boton
        texto={textoBoton}
        onClickOverride={onClose}
        bgColor="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
        textColor="text-white dark:text-black"
        className="w-full"
      />
    </ModalBase>
  );
}

export default ModalExito; // Exporta el modal para mostrar confirmaciones exitosas
