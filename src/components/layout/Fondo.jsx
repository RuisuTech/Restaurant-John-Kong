// src/components/Fondo.jsx

// Componente que muestra una imagen de fondo con contenido superpuesto
function Fondo({ imageUrl, children, className = "" }) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Imagen de fondo que cubre toda la pantalla */}
      <div
        className={`absolute inset-0 bg-cover bg-center dark:brightness-50 ${className}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true" // Oculta del lector de pantalla por ser decorativa
      />

      {/* Contenido que se muestra por encima del fondo */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default Fondo; // Exporta el componente para uso externo
