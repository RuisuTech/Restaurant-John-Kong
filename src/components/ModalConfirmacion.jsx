import ModalBase from "./ModalBase";
import Boton from "./Boton";

// Modal de confirmación reutilizable con botones para aceptar o cancelar
function ModalConfirmacion({
  mensaje = "¿Estás seguro?",     // Título principal del modal
  descripcion,                    // Texto opcional con más detalles
  textoAceptar = "Sí",            // Texto del botón de confirmación
  textoCancelar = "Cancelar",     // Texto del botón de cancelación
  onConfirmar,                    // Función a ejecutar al confirmar
  onCancelar,                     // Función a ejecutar al cancelar
}) {
  return (
    <ModalBase
      icono="!"                              // Icono de advertencia
      iconoColor="text-yellow-500"          // Color del icono
      titulo={mensaje}                      // Muestra el mensaje como título
      descripcion={descripcion}             // Muestra la descripción debajo
    >
      {/* Botones de acción */}
      <div className="flex justify-center gap-4">
        <Boton
          texto={textoCancelar}             // Botón para cancelar
          onClickOverride={onCancelar}
          bgColor="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
          textColor="text-black dark:text-white"
          className="px-4 py-2 w-auto"
        />
        <Boton
          texto={textoAceptar}              // Botón para confirmar
          onClickOverride={onConfirmar}
          bgColor="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500"
          textColor="text-white dark:text-black"
          className="px-4 py-2 w-auto"
        />
      </div>
    </ModalBase>
  );
}

export default ModalConfirmacion; // Exporta el modal para usarlo donde se necesiten confirmaciones
