import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

import Fondo from "../../components/layout/Fondo"
import CajaContenido from "../../components/ui/CajaContenido"
import Boton from "../../components/ui/Boton"
import ModalExito from "../../components/ui/ModalExito"
import ModalAlerta from "../../components/ui/ModalAlerta"
import BarraUsuario from "../../components/layout/BarraUsuario"

import fondo from "../../assets/fondo.webp"
import { obtenerReservas, crearReserva } from "../../utils/api"

function ConfirmarReserva() {
  const navigate = useNavigate()
  const { usuario } = useAuth()  || {}

  const [reserva, setReserva] = useState(null)
  const [reservaConfirmada, setReservaConfirmada] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [modal, setModal] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "error",
  })

  useEffect(() => {
    const reservaPendiente = JSON.parse(sessionStorage.getItem("reservaPendiente"))
    if (reservaPendiente && usuario) {
      setReserva(reservaPendiente)
    } else if (!reservaPendiente) {
      navigate("/reservar")
    }
  }, [usuario, navigate])

  const mostrarAlerta = (mensaje, tipo = "error") => {
    setModal({ mostrar: true, mensaje, tipo })
  }

  const cerrarAlerta = () => {
    setModal({ mostrar: false, mensaje: "", tipo: "error" })
  }

  // 🔹 FUNCIÓN PRINCIPAL: Aquí sí se guarda en la API
  const confirmarReserva = async () => {
    if (!reserva || !usuario || reservaConfirmada || cargando) return

    try {
      setCargando(true)
      
      // 🔹 Verificar disponibilidad en tiempo real antes de confirmar
      const reservasActuales = await obtenerReservas()

      const yaOcupada = reservasActuales.some(
        (r) =>
          r.fecha === reserva.fecha &&
          r.hora === reserva.hora &&
          r.mesa === reserva.mesa &&
          (r.estado === "confirmada" || r.estado === "pendiente")
      )

      if (yaOcupada) {
        mostrarAlerta(
          "Lo sentimos, esta mesa ya fue reservada por otro usuario. Por favor, elige otra mesa u horario.",
          "error"
        )
        return
      }

      // 🔹 Verificar si el usuario ya tiene una reserva para el mismo día y hora
      const usuarioYaTieneReserva = reservasActuales.some(
        (r) =>
          r.fecha === reserva.fecha &&
          r.hora === reserva.hora &&
          r.usuario?.correo === usuario.correo &&
          (r.estado === "confirmada" || r.estado === "pendiente")
      )

      if (usuarioYaTieneReserva) {
        mostrarAlerta(
          "Ya tienes una reserva para esta fecha y hora. No puedes hacer reservas duplicadas.",
          "warning"
        )
        return
      }

      const reservaFinal = {
        ...reserva,
        estado: "pendiente",
        usuario: {
          nombre: usuario.nombre,
          correo: usuario.correo,
        },
        fechaCreacion: new Date().toISOString(),
      }
      await crearReserva(reservaFinal)
      sessionStorage.removeItem("reservaPendiente")
      setReservaConfirmada(true)

    } catch (error) {      
      let mensajeError = "Hubo un problema al confirmar la reserva. Intenta nuevamente."
      if (error.message?.includes("conflicto")) {
        mensajeError = "Esta mesa ya fue reservada. Por favor, elige otra."
      } else if (error.message?.includes("red") || error.message?.includes("network")) {
        mensajeError = "Problemas de conexión. Verifica tu internet e intenta nuevamente."
      }
      
      mostrarAlerta(mensajeError, "error")
      
    } finally {
      setCargando(false)
    }
  }
 
  const editarReserva = () => {
    navigate("/reservar")
  }

  // Si no hay reserva o usuario, mostrar mensaje
  if (!reserva || !usuario) {
    return (
      <Fondo imageUrl={fondo}>
        <BarraUsuario />
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
          <CajaContenido
            titulo="Reserva no encontrada"
            descripcion="No se encontró una reserva pendiente. Por favor, realiza una nueva."
            textAlign="text-center"
            glass
          >
            <div className="flex justify-center mt-4">
              <Boton
                texto="Volver a reservar"
                onClickOverride={() => navigate("/reservar")}
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                className="px-6 py-2 mt-4"
              />
            </div>
          </CajaContenido>
        </div>
      </Fondo>
    )
  }

  const { tipo, personas, fecha, hora, comentario, mesa } = reserva
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Fondo imageUrl={fondo}>
      <BarraUsuario />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <CajaContenido
          titulo="Confirmar tu Reserva"
          descripcion="Revisa los detalles antes de confirmar tu reserva."
          tituloSize="text-2xl sm:text-3xl"
          descripcionSize="text-sm sm:text-base"
          textAlign="text-center"
          glass
        >
          {/* Detalles de la reserva */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 my-4">
            <div className="text-left space-y-3 text-base">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Servicio:</p>
                  <p className="font-semibold capitalize">{tipo}</p>
                </div>
                <div>
                  <p className="text-sm">Personas:</p>
                  <p className="font-semibold">{personas}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Fecha:</p>
                  <p className="font-semibold">{fechaFormateada}</p>
                </div>
                <div>
                  <p className="text-sm">Hora:</p>
                  <p className="font-semibold">{hora}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Mesa:</p>
                  <p className="font-semibold">{mesa}</p>
                </div>
                <div>
                  <p className="text-sm">Usuario:</p>
                  <p className="font-semibold text-sm">{usuario.nombre}</p>
                </div>
              </div>
              
              {comentario && (
                <div>
                  <p className="text-sm">Comentario:</p>
                  <p className="font-semibold text-sm bg-white/10 rounded p-2 mt-1">
                    {comentario}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Boton
              texto="Editar"
              onClickOverride={editarReserva}
              bgColor="bg-gray-500 hover:bg-gray-600"
              textColor="text-white"
              className="w-full sm:w-40 h-12"
            />
            <Boton
              texto={cargando ? "Procesando..." : "Reservar ahora"}
              onClickOverride={confirmarReserva}
              bgColor={cargando ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
              textColor="text-white"
              className="w-full sm:w-40 h-12"
              disabled={cargando}
            />
          </div>

          {/* Nota informativa */}
          <p className="text-xs mt-4 text-center">
            Al confirmar, tu reserva quedará registrada y recibirás confirmación.
          </p>
        </CajaContenido>
      </div>

      {/* Modal de éxito */}
      {reservaConfirmada && (
        <ModalExito
          mensaje="¡Reserva confirmada!"
          descripcion="Tu reserva ha sido registrada exitosamente. Te esperamos!"
          textoBoton="Volver al inicio"
          onClose={() => navigate("/cliente")}
        />
      )}

      {/* Modal de error */}
      <ModalAlerta
        visible={modal.mostrar}
        mensaje={modal.mensaje}
        tipo={modal.tipo}
        onClose={cerrarAlerta}
      />
    </Fondo>
  )
}

export default ConfirmarReserva