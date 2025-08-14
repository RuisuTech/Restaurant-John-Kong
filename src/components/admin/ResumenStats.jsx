import { useMemo } from "react"

const ResumenStats = ({ reservas }) => {
  const resumen = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0]
    
    return {
      hoy: reservas.filter(r => r.fecha === hoy).length,
      completadas: reservas.filter(r => r.estado === "completada").length,
      pendientes: reservas.filter(r => r.estado === "pendiente").length,
      canceladas: reservas.filter(r => 
        r.estado === "cancelada" || r.estado === "cancelada por el cliente"
      ).length,
    }
  }, [reservas])

  const estadosConfig = {
    hoy: { color: "bg-indigo-600", label: "Hoy" },
    completadas: { color: "bg-green-600", label: "Completadas" },
    pendientes: { color: "bg-yellow-500", label: "Pendientes" },
    canceladas: { color: "bg-red-500", label: "Canceladas" },
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {Object.entries(resumen).map(([estado, cantidad]) => {
        const config = estadosConfig[estado]
        return (
          <div
            key={estado}
            className={`rounded-xl p-2 md:p-4 text-center text-white ${config.color}`}
          >
            <h2 className="md:text-lg font-semibold">{config.label}</h2>
            <p className="md:text-2xl font-bold">{cantidad}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ResumenStats