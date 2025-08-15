// Componente base para mostrar un modal centrado con fondo difuminado
function ModalBase({ icono, iconoColor, titulo, descripcion, children }) {
  return (
    // Capa de fondo semitransparente y desenfocada
    <div id="formulario-reserva" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-white/20 backdrop-blur-sm px-4">
      
      {/* Contenedor del modal */}
      <div className="bg-white dark:bg-black/80 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center transition-colors duration-300 border dark:border-white/20">
        
        {/* Icono opcional en la parte superior */}
        {icono && (
          <div className={`text-5xl mb-4 ${iconoColor || "text-gray-700"}`}>
            {icono}
          </div>
        )}

        {/* Título principal del modal */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          {titulo}
        </h2>

        {/* Descripción opcional */}
        {descripcion && (
          <p className="text-gray-600 dark:text-gray-300 mb-6">{descripcion}</p>
        )}

        {/* Contenido adicional (botones, inputs, etc.) */}
        {children}
      </div>
    </div>
  );
}

export default ModalBase; // Exporta el modal para ser reutilizado en otros contextos
