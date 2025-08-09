// ToggleTema.jsx
import { useTema } from "../hooks/useTema";

function ToggleTema({ onLogout }) {
  const { modo, alternar } = useTema();

  return (
    <footer
      className="
        bg-black/30 backdrop-blur-sm shadow text-white py-3 px-4
        flex justify-between items-center
        fixed bottom-0 left-0 w-full
        lg:static
      "
      style={{
        position: "sticky",
        bottom: 0,
        marginTop: "auto",
      }}
    >
      {/* Texto del footer */}
      <span className="text-sm opacity-80">
        © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
      </span>

      {/* Botones */}
      <div className="flex items-center gap-2">
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
    </footer>
  );
}

export default ToggleTema;
