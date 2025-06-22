// src/components/ModalError.jsx
function ModalError({ mensaje = "¡Ocurrió un error!", descripcion, textoBoton = "Cerrar", onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black/80 rounded-xl shadow-2xl p-8 w-full max-w-sm text-center transition-colors">
        <div className="text-red-500 text-5xl mb-4">✕</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{mensaje}</h2>
        {descripcion && <p className="text-gray-600 dark:text-gray-300 mb-6">{descripcion}</p>}
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition dark:bg-red-400 dark:text-black dark:hover:bg-red-500"
        >
          {textoBoton}
        </button>
      </div>
    </div>
  );
}

export default ModalError;
