import { useTema } from "../hooks/useTema"; 

// Componente que permite alternar entre modo claro y oscuro, y opcionalmente cerrar sesión
function ToggleTema({ onLogout }) {
  const { modo, alternar } = useTema(); // Hook personalizado para manejar el tema

  return (
    <div className="fixed left-4 bottom-4 z-50 flex items-center gap-2">
      
      {/* Botón opcional para cerrar sesión */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition"
        >
          Cerrar Sesión
        </button>
      )}

      {/* Botón para cambiar entre modo claro y oscuro */}
      <button
        onClick={alternar}
        className="bg-white dark:bg-black text-black dark:text-white px-6 py-2 rounded shadow transition-colors duration-300"
      >
        {modo === "oscuro" ? "🌞 Claro" : "🌙 Oscuro"}
      </button>
    </div>
  );
}

export default ToggleTema; // Exporta el componente para mostrar el toggle en cualquier vista
