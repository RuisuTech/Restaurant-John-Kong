function CajaContenido({
  titulo,
  subtitulo,
  descripcion,
  children,
  tituloSize = "text-3xl",
  subtituloSize = "text-xl",
  descripcionSize = "text-sm",
  textAlign = "text-center",
}) {
  return (
    <div
      className={`max-w-xl w-full px-6 py-10 rounded-lg shadow-lg ${textAlign}
    bg-white/85 text-gray-900
    dark:bg-black/60 dark:text-white transition-colors duration-300`}
    >
      {titulo && (
        <h2 className={`${tituloSize} font-extrabold mb-2`}>{titulo}</h2>
      )}
      {subtitulo && (
        <h3 className={`${subtituloSize} font-semibold mb-2`}>{subtitulo}</h3>
      )}
      {descripcion && (
        <p className={`${descripcionSize} mb-6`}>{descripcion}</p>
      )}
      {children}
    </div>
  );
}

export default CajaContenido;
