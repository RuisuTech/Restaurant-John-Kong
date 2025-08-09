// ToggleTema.jsx
import { useTema } from "../hooks/useTema";

function ToggleTema({ onLogout }) {
  const { modo, alternar } = useTema();

  return (
    <>
      {/* Botón fijo para tema y cerrar sesión */}
      <div className="fixed left-4 bottom-4 z-50 flex items-center gap-2">
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
          className="bg-white dark:bg-black text-black dark:text-white px-6 py-2 rounded shadow transition-colors duration-300"
        >
          {modo === "oscuro" ? "🌞 Claro" : "🌙 Oscuro"}
        </button>
      </div>

      {/* Footer al final de la página */}
      <footer className="w-full bg-black/30 backdrop-blur-sm shadow mt-auto text-white py-3 text-center">
        <span className="text-sm opacity-80">
          © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
        </span>
      </footer>
    </>
  );
}

export default ToggleTema;
