// Componente de caja de contenido reutilizable con título, subtítulo, descripción y contenido adicional
function CajaContenido({
  titulo,                 // Título principal del bloque
  subtitulo,              // Subtítulo opcional
  descripcion,            // Texto descriptivo opcional
  children,               // Contenido que se inserta dentro de la caja
  tituloSize = "text-3xl",       // Tamaño del título (por defecto grande)
  subtituloSize = "text-xl",     // Tamaño del subtítulo
  descripcionSize = "text-sm",   // Tamaño de la descripción
  textAlign = "text-center",     // Alineación del texto
  className = "w-full md:w-[450px]", // Clases extra para tamaño o diseño
  glass = false,           // Si está activado, aplica efecto tipo "glass" (transparencia difuminada)
}) {
  return (
    <div
      className={`
        ${className} px-6 py-10 rounded-lg shadow-none ${textAlign}
        ${glass
          ? "bg-white dark:bg-black/40 backdrop-blur-md border dark:border-white/20"
          : ""}
        text-gray-900 dark:text-white transition-all duration-300
      `}
    >
      {titulo && (
        <h2 className={`${tituloSize} font-[Mulish] font-extrabold mb-2`}>
          {titulo}
        </h2>
      )}
      {subtitulo && (
        <h3 className={`${subtituloSize} font-semibold mb-2`}>
          {subtitulo}
        </h3>
      )}
      {descripcion && (
        <p className={`${descripcionSize} mb-6`}>{descripcion}</p>
      )}
      {children} {/* Contenido adicional pasado dentro del componente */}
    </div>
  );
}

export default CajaContenido; // Exporta el componente para ser utilizado en otras vistas
