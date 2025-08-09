// ToggleTema.jsx
import { useTema } from "../hooks/useTema";

function ToggleTema() {
  const { modo, alternar } = useTema();

  return (
    <button
      onClick={alternar}
      className="
        fixed bottom-4 right-4
        bg-white dark:bg-black
        text-black dark:text-white
        px-4 py-2 rounded-full shadow-lg
        hover:scale-105 transition-transform duration-300
        z-50
      "
    >
      {modo === "oscuro" ? "🌞" : "🌙"}
    </button>
  );
}

export default ToggleTema;
