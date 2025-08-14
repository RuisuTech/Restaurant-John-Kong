import { useNavigate } from "react-router-dom";

// Componente reutilizable para crear un botón con navegación y estilos personalizados
function Boton({
  texto = "",              // Texto que se mostrará en el botón
  children,               // Alternativa para pasar contenido como children
  iconoInicio,            // Icono opcional que se muestra al inicio
  iconoFin,               // Icono opcional que se muestra al final
  ruta = "",              // Ruta opcional para redireccionar al hacer clic
  bgColor = "bg-green-600", // Color de fondo del botón (por defecto verde)
  textColor = "text-white", // Color del texto (por defecto blanco)
  onClickOverride,        // Función personalizada para manejar el clic
  className = "w-full",   // Clases CSS adicionales (ancho completo por defecto)
  type = "button",        // Tipo de botón (por defecto "button")
}) {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Maneja el clic: usa onClickOverride si se proporciona, si no navega a la ruta indicada
  const handleClick = () => {
    if (onClickOverride) {
      onClickOverride();
    } else if (ruta) {
      navigate(ruta);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`flex items-center justify-center gap-3 px-6 py-2 rounded font-medium transition 
        ${bgColor} ${textColor} hover:opacity-90 dark:hover:opacity-95 ${className}`}
    >
      {iconoInicio && <span>{iconoInicio}</span>} {/* Muestra el icono al inicio si existe */}
      {texto || children}                         {/* Muestra el texto o children */}
      {iconoFin && <span>{iconoFin}</span>}       {/* Muestra el icono al final si existe */}
    </button>
  );
}

export default Boton; // Exporta el componente para su uso en otras partes de la app
