// Componente que se comporta como un enlace interactivo (span clickeable)
function LinkSpan({ onClick, children }) {
  return (
    <span
      onClick={onClick} // Ejecuta la acción cuando se hace clic
      className="text-green-600 cursor-pointer hover:text-green-500 dark:text-green-500 dark:hover:text-green-600 font-medium transition-colors"
    >
      {children} {/* Texto o contenido dentro del "enlace" */}
    </span>
  );
}

export default LinkSpan; // Exporta el componente para su uso en formularios o mensajes interactivos
