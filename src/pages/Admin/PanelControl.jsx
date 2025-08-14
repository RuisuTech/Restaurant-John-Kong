// PanelControl.jsx
import { useEffect, useState } from "react"
import Fondo from "../../components/layout/Fondo"
import ToggleTema from "../../components/ui/ToggleTema"
import BarraUsuario from "../../components/layout/BarraUsuario"
import { obtenerReservas, actualizarEstadoReserva } from "../../utils/api"
import ResumenStats from "../../components/admin/ResumenStats"
import FiltrosReservas from "../../components/admin/FiltrosReservas"
import TablaReservas from "../../components/admin/TablaReservas"

function PanelControl() {
  const [reservas, setReservas] = useState([])
  const [filtros, setFiltros] = useState({
    estado: "todas",
    fecha: "",
    usuario: ""
  })

  useEffect(() => {
    cargarReservas()
  }, [])

  const cargarReservas = async () => {
    try {
      const reservasData = await obtenerReservas()
      setReservas(reservasData)
    } catch (error) {
      console.error("Error al obtener reservas:", error)
    }
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const reservaActualizada = await actualizarEstadoReserva(id, nuevoEstado)
      console.log("Reserva actualizada:", reservaActualizada)
      
      setReservas(prev => 
        prev.map(reserva => 
          reserva.id === id ? reservaActualizada : reserva
        )
      )
    } catch (error) {
      console.error("Error al actualizar reserva:", error)
      alert("No se pudo actualizar la reserva.")
    }
  }

  const limpiarFiltros = () => {
    setFiltros({
      estado: "todas",
      fecha: "",
      usuario: ""
    })
  }

  return (
    <Fondo imageUrl="/fondo.webp">
      <BarraUsuario mostrarVolver />
      
      <div className="fixed top-4 right-4 z-50">
        <ToggleTema />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-24">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Panel de Control
        </h1>

        <ResumenStats reservas={reservas} />
        
        <FiltrosReservas 
          filtros={filtros}
          setFiltros={setFiltros}
          onLimpiar={limpiarFiltros}
        />
        
        <TablaReservas 
          reservas={reservas}
          filtros={filtros}
          onCambiarEstado={cambiarEstado}
        />
      </div>
    </Fondo>
  )
}

export default PanelControl