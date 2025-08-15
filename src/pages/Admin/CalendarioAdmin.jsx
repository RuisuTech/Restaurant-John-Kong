import { useEffect, useState, useCallback, useRef } from "react"
import Fondo from "../../components/layout/Fondo"
import Boton from "../../components/ui/Boton"
import BarraUsuario from "../../components/layout/BarraUsuario"
import { obtenerReservas } from "../../utils/api"

function CalendarioReservas() {
  const [reservas, setReservas] = useState([])
  const [mesActual, setMesActual] = useState(new Date())
  const [cargando, setCargando] = useState(true)
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)
  const isActiveTab = useRef(true)

  // Detectar si la pestaña está activa para pausar las actualizaciones
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveTab.current = !document.hidden
      if (isActiveTab.current && intervalRef.current === null) {
        // Reiniciar actualizaciones cuando la pestaña vuelve a estar activa
        iniciarActualizaciones()
      } else if (!isActiveTab.current && intervalRef.current) {
        // Pausar actualizaciones cuando la pestaña no está activa
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const cargarReservas = useCallback(async () => {
    try {
      setError(null)
      const data = await obtenerReservas()
      setReservas(data)
      setUltimaActualizacion(new Date())
    } catch (error) {
      console.error("Error cargando reservas:", error)
      setError("Error al cargar las reservas")
    } finally {
      setCargando(false)
    }
  }, [])

  const iniciarActualizaciones = useCallback(() => {
    // Solo iniciar si no hay un intervalo activo y la pestaña está activa
    if (!intervalRef.current && isActiveTab.current) {
      intervalRef.current = setInterval(() => {
        if (isActiveTab.current) {
          cargarReservas()
        }
      }, 30000) // Reducido a 30 segundos en lugar de 3
    }
  }, [cargarReservas])

  const detenerActualizaciones = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    cargarReservas()
    iniciarActualizaciones()

    return () => {
      detenerActualizaciones()
    }
  }, [cargarReservas, iniciarActualizaciones, detenerActualizaciones])

  const cambiarMes = (delta) => {
    const nuevoMes = new Date(mesActual)
    nuevoMes.setMonth(nuevoMes.getMonth() + delta)
    setMesActual(nuevoMes)
  }

  const actualizarManualmente = () => {
    setCargando(true)
    cargarReservas()
  }

  const obtenerDiasDelMes = () => {
    const anio = mesActual.getFullYear()
    const mes = mesActual.getMonth()
    const primerDia = new Date(anio, mes, 1)
    const ultimoDia = new Date(anio, mes + 1, 0)
    const dias = []

    const inicio = primerDia.getDay()
    for (let i = 0; i < inicio; i++) dias.push(null)
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      dias.push(new Date(anio, mes, d))
    }

    return dias
  }

  const obtenerReservasDelDia = (fecha) => {
    if (!fecha) return []
    const fechaStr = fecha.toISOString().split("T")[0]
    return reservas.filter((r) => r.fecha === fechaStr)
  }

  const estadoColor = {
    pendiente: "bg-yellow-400",
    confirmada: "bg-green-500",
    completada: "bg-blue-500",
    cancelada: "bg-red-500",
    "cancelada por el cliente": "bg-red-500",
  }

  const dias = obtenerDiasDelMes()
  const hoy = new Date().toDateString()

  if (cargando && reservas.length === 0) {
    return (
      <Fondo imageUrl="/fondo.webp">
        <BarraUsuario mostrarVolver />
        <div className="min-h-screen pt-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Cargando calendario...</p>
          </div>
        </div>
      </Fondo>
    )
  }
  return (
    <Fondo imageUrl="/fondo.webp">
      <BarraUsuario mostrarVolver />

      <div className="max-w-5xl mx-auto p-4 sm:px-6 md:px-10 py-24">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Calendario de Reservas
          </h1>
          <h2 className="text-xl font-semibold mb-4 text-white">
            {mesActual.toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          
          {/* Información de última actualización */}
          <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
            {ultimaActualizacion && (
              <p className="text-sm text-gray-200">
                Última actualización: {ultimaActualizacion.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={actualizarManualmente}
              disabled={cargando}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded text-sm transition-colors"
            >
              {cargando ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Actualizando...
                </span>
              ) : (
                '🔄 Actualizar'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Leyenda de colores */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap text-white">
          {["Pendiente", "Confirmada", "Completada", "Cancelada"].map(
            (estado, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded ${
                    estadoColor[estado.toLowerCase()] || "bg-gray-400"
                  }`}
                />
                <span className="text-sm">{estado}</span>
              </div>
            )
          )}
        </div>

        {/* Navegación de meses */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <Boton texto="← Anterior" onClickOverride={() => cambiarMes(-1)} />
          <div className="flex gap-2">
            <Boton 
              texto="Hoy" 
              onClickOverride={() => setMesActual(new Date())}
              className="px-4"
            />
          </div>
          <Boton texto="Siguiente →" onClickOverride={() => cambiarMes(1)} />
        </div>

        {/* Calendario */}
        <div className="bg-white dark:bg-black/40 rounded-lg shadow-lg overflow-hidden">
          {/* Cabeceras de días */}
          <div className="grid grid-cols-7 gap-0 bg-gray-100 dark:bg-gray-700">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
              <div
                key={d}
                className="text-sm font-semibold text-center py-3 text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-600 last:border-r-0"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          <div className="grid grid-cols-7 gap-0">
            {dias.map((dia, i) => {
              if (!dia) return <div key={i} className="h-32 border-r border-b border-gray-200 dark:border-gray-600" />

              const reservasDelDia = obtenerReservasDelDia(dia)
              const esHoy = dia.toDateString() === hoy

              return (
                <div
                  key={i}
                  className={`h-32 border-r border-b border-gray-200 dark:border-gray-600 p-2 flex flex-col text-xs overflow-hidden ${
                    esHoy 
                      ? 'bg-blue-50 dark:bg-blue-900/30' 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  <div className={`font-semibold text-right mb-1 ${
                    esHoy 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {dia.getDate()}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1">
                    {reservasDelDia.slice(0, 3).map((r, idx) => (
                      <div
                        key={idx}
                        className={`w-full text-white rounded px-2 py-1 text-xs truncate ${
                          estadoColor[r.estado] || "bg-gray-300"
                        } hover:shadow-sm transition-shadow cursor-pointer`}
                        title={`${r.tipo} - ${r.hora} - ${r.estado}`}
                      >
                        <div className="font-medium">{r.tipo}</div>
                        <div className="text-xs opacity-90">{r.hora}</div>
                      </div>
                    ))}
                    {reservasDelDia.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                        +{reservasDelDia.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Fondo>
  )
}

export default CalendarioReservas