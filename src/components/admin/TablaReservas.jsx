import { useMemo } from "react"
import Boton from "../ui/Boton"
import SeccionTabla from "./SeccionTabla"

const TablaReservas = ({ reservas, filtros, onCambiarEstado }) => {
  const { reservasHoy, proximasReservas, reservasAnteriores } = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0]
    
    return {
      reservasHoy: reservas.filter(r => r.fecha === hoy),
      proximasReservas: reservas.filter(r => r.fecha > hoy),
      reservasAnteriores: reservas.filter(r => r.fecha < hoy)
    }
  }, [reservas])

  const aplicarFiltros = (lista) => {
    return lista.filter(reserva => {
      const cumpleFiltroEstado = filtros.estado === "todas" || reserva.estado === filtros.estado
      const cumpleFiltroFecha = !filtros.fecha || reserva.fecha === filtros.fecha
      const cumpleFiltroUsuario = !filtros.usuario || 
        reserva.usuario?.nombre?.toLowerCase().includes(filtros.usuario)
      
      return cumpleFiltroEstado && cumpleFiltroFecha && cumpleFiltroUsuario
    })
  }

  const renderAccionesEstado = (reserva) => {
    const { id, estado } = reserva
    const acciones = []

    switch (estado) {
      case "pendiente":
      case undefined:
      case null:
        acciones.push(
          <Boton
            key={`aceptar-${id}`}
            texto="Aceptar"
            onClickOverride={() => onCambiarEstado(id, "confirmada")}
            bgColor="bg-green-600"
            textColor="text-white"
          />,
          <Boton
            key={`cancelar-${id}`}
            texto="Cancelar"
            onClickOverride={() => onCambiarEstado(id, "cancelada")}
            bgColor="bg-red-600"
            textColor="text-white"
          />
        )
        break

      case "confirmada":
        acciones.push(
          <Boton
            key={`completar-${id}`}
            texto="Completar"
            onClickOverride={() => onCambiarEstado(id, "completada")}
            bgColor="bg-blue-600"
            textColor="text-white"
          />,
          <Boton
            key={`cancelar-confirmada-${id}`}
            texto="Cancelar"
            onClickOverride={() => onCambiarEstado(id, "cancelada")}
            bgColor="bg-red-600"
            textColor="text-white"
          />
        )
        break

      case "completada":
        acciones.push(
          <span
            key={`estado-completada-${id}`}
            className="text-green-600 font-semibold dark:text-green-400"
          >
            Completada
          </span>
        )
        break

      case "cancelada":
      case "cancelada por el cliente":
        acciones.push(
          <span
            key={`estado-cancelada-${id}`}
            className="text-red-600 font-semibold dark:text-red-400"
          >
            Cancelada
          </span>
        )
        break

      default:
        acciones.push(
          <span key={`estado-desconocido-${id}`} className="text-gray-500">
            Estado desconocido
          </span>
        )
    }

    return <div className="flex gap-2 flex-wrap">{acciones}</div>
  }

  return (
    <>
      <SeccionTabla
        titulo="Reservas de hoy"
        lista={aplicarFiltros(reservasHoy)}
        renderEstado={renderAccionesEstado}
      />
      <SeccionTabla
        titulo="Próximas reservas"
        lista={aplicarFiltros(proximasReservas)}
        renderEstado={renderAccionesEstado}
      />
      <SeccionTabla
        titulo="Reservas anteriores"
        lista={aplicarFiltros(reservasAnteriores)}
        renderEstado={renderAccionesEstado}
      />
    </>
  )
}

export default TablaReservas