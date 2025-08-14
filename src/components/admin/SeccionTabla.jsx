const SeccionTabla = ({ titulo, lista, renderEstado }) => {
  if (!lista?.length) return null

  const columnas = [
    "Fecha",
    "Cliente", 
    "Hora",
    "Personas",
    "Comentario",
    "Acciones",
    "Mesa",
    "Tipo",
    "Estado",
    "Fecha Confirmación"
  ]

  const formatearFechaConfirmacion = (fecha) => {
    if (!fecha) return "-"
    return new Date(fecha).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    })
  }

  const obtenerValoresColumna = (reserva) => [
    reserva.fecha,
    reserva.usuario?.nombre || "Desconocido",
    reserva.hora,
    reserva.personas,
    reserva.comentario || "-",
    renderEstado(reserva),
    reserva.mesa,
    reserva.tipo || "-",
    reserva.estado,
    formatearFechaConfirmacion(reserva.fechaConfirmacion)
  ]

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-white">{titulo}</h2>
      
      {/* Vista escritorio - Tabla */}
      <div className="hidden md:block overflow-x-auto mb-10">
        <table className="w-full min-w-[800px] text-sm text-left">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              {columnas.map((columna) => (
                <th key={columna} className="px-4 py-2 whitespace-nowrap">
                  {columna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black/60 divide-y divide-gray-300 dark:divide-gray-600">
            {lista.map((reserva, index) => {
              const key = reserva.id || `${reserva.fecha}-${reserva.hora}-${index}`
              const valores = obtenerValoresColumna(reserva)
              
              return (
                <tr key={key}>
                  {valores.map((valor, i) => (
                    <td key={i} className="px-4 py-2">
                      {valor}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Vista móvil - Tarjetas */}
      <div className="md:hidden space-y-4 mb-10">
        {lista.map((reserva, index) => {
          const key = reserva.id || `${reserva.fecha}-${reserva.hora}-${index}`
          const valores = obtenerValoresColumna(reserva)
          
          return (
            <div
              key={key}
              className="bg-white dark:bg-black/60 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              {columnas.map((columna, i) => (
                <div key={columna} className="flex justify-between py-1">
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    {columna}:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 text-right max-w-[60%]">
                    {valores[i]}
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default SeccionTabla