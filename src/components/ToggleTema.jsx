import { useTema } from "../hooks/useTema"; 

function ToggleTema({ onLogout }) {
  const { modo, alternar } = useTema();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition"
        >
          Cerrar Sesión
        </button>
      )}
      <button
        onClick={alternar}
        className="bg-white dark:bg-black text-black dark:text-white px-3 py-1 rounded shadow transition-colors duration-300"
      >
        {modo === "oscuro" ? "🌞 Claro" : "🌙 Oscuro"}
      </button>
    </div>
  );
}

export default ToggleTema;
