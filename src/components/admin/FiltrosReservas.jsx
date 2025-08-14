const FiltrosReservas = ({ filtros, setFiltros, onLimpiar }) => {
  const actualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const opcionesEstado = [
    { value: "todas", label: "Todos" },
    { value: "pendiente", label: "Pendiente" },
    { value: "confirmada", label: "Confirmada" },
    { value: "completada", label: "Completada" },
    { value: "cancelada", label: "Cancelada" },
    { value: "cancelada por el cliente", label: "Cancelada por el cliente" }
  ]

  return (
    <div className="bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-xl p-4 mb-8 shadow-md w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-wrap sm:flex-row items-stretch sm:items-end justify-center gap-4">
        
        {/* Filtro por fecha */}
        <div className="flex flex-col w-full sm:w-auto">
          <label
            htmlFor="filtro-fecha"
            className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200"
          >
            Filtrar por fecha:
          </label>
          <input
            id="filtro-fecha"
            type="date"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtros.fecha}
            onChange={(e) => actualizarFiltro('fecha', e.target.value)}
          />
        </div>

        {/* Filtro por usuario */}
        <div className="flex flex-col w-full sm:w-auto">
          <label
            htmlFor="filtro-usuario"
            className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200"
          >
            Buscar por cliente:
          </label>
          <input
            type="text"
            id="filtro-usuario"
            placeholder="Nombre o correo"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtros.usuario}
            onChange={(e) => actualizarFiltro('usuario', e.target.value.toLowerCase())}
          />
        </div>

        {/* Filtro por estado */}
        <div className="flex flex-col w-full sm:w-auto">
          <label
            htmlFor="filtro-estado"
            className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200"
          >
            Filtrar por estado:
          </label>
          <select
            id="filtro-estado"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtros.estado}
            onChange={(e) => actualizarFiltro('estado', e.target.value)}
          >
            {opcionesEstado.map(opcion => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón limpiar filtros */}
        <div className="flex flex-col w-full sm:w-auto sm:self-end">
          <button
            onClick={onLimpiar}
            className="w-full px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium text-black dark:text-white transition"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  )
}

export default FiltrosReservas