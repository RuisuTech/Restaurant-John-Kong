// src/components/ModalConfirmacion.jsx
function ModalConfirmacion({
  mensaje = "¿Estás seguro?",
  descripcion,
  textoAceptar = "Sí",
  textoCancelar = "Cancelar",
  onConfirmar,
  onCancelar
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black/80 rounded-xl shadow-2xl p-8 w-full max-w-sm text-center transition-colors">
        <div className="text-yellow-500 text-5xl mb-4">!</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{mensaje}</h2>
        {descripcion && <p className="text-gray-600 dark:text-gray-300 mb-6">{descripcion}</p>}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {textoCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-500"
          >
            {textoAceptar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacion;
