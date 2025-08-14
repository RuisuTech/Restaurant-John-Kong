import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Fondo from "../../components/layout/Fondo"
import BarraUsuario from "../../components/layout/BarraUsuario"
import TablaReserva from "../../components/reservas/TablaReserva"
import { useAuth } from "../../context/AuthContext"
import { obtenerReservas, actualizarEstadoReserva } from "../../utils/api"

function HistorialReservas() {
  const [reservasUsuario, setReservasUsuario] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroMesa, setFiltroMesa] = useState("todas")
  const [orden, setOrden] = useState("desc")
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const obtener = useCallback(async () => {
    try {
      const todas = await obtenerReservas()
      const delUsuario = todas.filter(
        (r) => r.usuario?.correo === usuario.correo
      )
      setReservasUsuario(delUsuario)
    } catch (error) {
      console.error("Error al obtener reservas:", error)
    } finally {
      setCargando(false)
    }
  }, [usuario])

  useEffect(() => {
    if (!usuario) {
      navigate("/login")
      return
    }
    obtener()
  }, [usuario, navigate, obtener])

  const getEstadoTexto = (reserva) => {
    const { estado, fecha, hora } = reserva
    const fechaReserva = new Date(`${fecha}T${hora}`)
    const ahora = new Date()

    if (estado === "cancelada" || estado === "cancelada por el cliente") {
      return "Cancelada"
    }

    if (estado === "completada") {
      return "Reserva terminada"
    }

    if (estado === "confirmada") {
      return fechaReserva < ahora ? "Reserva terminada" : "Reserva lista"
    }

    return "Aún no lista"
  }

  const handleCancelarReserva = async (id) => {
    await actualizarEstadoReserva(id, "cancelada por el cliente")
    await obtener()
  }

  const reservasFiltradas = [...reservasUsuario]
    .sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`)
      const fechaB = new Date(`${b.fecha}T${b.hora}`)
      return orden === "desc" ? fechaB - fechaA : fechaA - fechaB
    })
    .filter((reserva) => {
      const estadoTexto = getEstadoTexto(reserva)
      const cumpleEstado =
        filtroEstado === "todos" || estadoTexto === filtroEstado
      const cumpleTipo = filtroTipo === "todos" || reserva.tipo === filtroTipo
      const cumpleMesa = filtroMesa === "todas" || reserva.mesa === filtroMesa
      return cumpleEstado && cumpleTipo && cumpleMesa
    })

  const mesasUnicas = [
    ...new Set(reservasUsuario.map((r) => r.mesa).filter(Boolean)),
  ]

  if (cargando) {
    return (
      <Fondo imageUrl="/fondo.webp">
        <BarraUsuario mostrarVolver />
        <div className="min-h-screen pt-20 flex justify-center items-center">
          <p className="text-white text-lg">Cargando historial...</p>
        </div>
      </Fondo>
    )
  }

  return (
    <Fondo imageUrl="/fondo.webp" className="px-0">
      <BarraUsuario mostrarVolver />
      <div className="w-full min-h-screen pt-20 pb-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">
          Historial de Reservas
        </h2>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="Reserva lista">Reserva lista</option>
            <option value="Reserva terminada">Reserva terminada</option>
            <option value="Aún no lista">Aún no lista</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todos">Todos los servicios</option>
            <option value="almuerzo">Almuerzo</option>
            <option value="cena">Cena</option>
          </select>

          <select
            value={filtroMesa}
            onChange={(e) => setFiltroMesa(e.target.value)}
            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todas">Todas las mesas</option>
            {mesasUnicas.map((mesa) => (
              <option key={mesa} value={mesa}>
                {mesa}
              </option>
            ))}
          </select>

          {/* Botón de orden con mismo estilo */}
          <button
            onClick={() =>
              setOrden((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm text-black dark:text-white"
          >
            Orden:{" "}
            {orden === "desc"
              ? "Más recientes primero"
              : "Más antiguas primero"}
          </button>
        </div>
        <TablaReserva 
          reservasFiltradas={reservasFiltradas}
          onCancelarReserva={handleCancelarReserva}
        ></TablaReserva>
      </div>
    </Fondo>
  )
}

export default HistorialReservas
