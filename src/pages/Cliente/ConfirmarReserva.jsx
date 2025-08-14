import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Fondo from "../../components/layout/Fondo";
import CajaContenido from "../../components/ui/CajaContenido";
import Boton from "../../components/ui/Boton";
import ModalExito from "../../components/ui/ModalExito";
import BarraUsuario from "../../components/layout/BarraUsuario";

import fondo from "../../assets/fondo.webp";
import { obtenerReservas, crearReserva } from "../../utils/api";

function ConfirmarReserva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { usuario } = useAuth();

  const [reserva, setReserva] = useState(null);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const r = JSON.parse(sessionStorage.getItem("reservaPendiente"));
    if (r && usuario) {
      setReserva(r);
    }
  }, [usuario]);

  const confirmar = async () => {
    if (!reserva || !usuario || reservaConfirmada || cargando) return;

    try {
      setCargando(true);
      const reservasExistentes = await obtenerReservas();

      // ✅ Verificar si ya existe una reserva confirmada para la misma mesa, fecha y hora
      const yaConfirmada = reservasExistentes.some(
        (r) =>
          r.fecha === reserva.fecha &&
          r.hora === reserva.hora &&
          r.mesa === reserva.mesa &&
          r.estado === "confirmada"
      );

      if (yaConfirmada) {
        alert("Ya hay una reserva confirmada para esta mesa en ese horario.");
        return;
      }

      // ✅ Verificar si ya existe una reserva pendiente del mismo usuario para ese horario
      const yaPendiente = reservasExistentes.some(
        (r) =>
          r.fecha === reserva.fecha &&
          r.hora === reserva.hora &&
          r.mesa === reserva.mesa &&
          r.estado === "pendiente" &&
          r.usuario?.correo === usuario.correo
      );

      if (yaPendiente) {
        // ✅ Mostrar modal de éxito como si ya se hubiera confirmado
        setReservaConfirmada(true);
        sessionStorage.removeItem("reservaPendiente");
        return;
      }

      // ✅ Preparar y crear la nueva reserva como pendiente
      const { id, ...reservaSinId } = reserva;

      const reservaConUsuario = {
        ...reservaSinId,
        estado: "pendiente",
        usuario: {
          nombre: usuario.nombre,
          correo: usuario.correo,
        },
      };

      await crearReserva(reservaConUsuario);

      setReservaConfirmada(true);
      sessionStorage.removeItem("reservaPendiente");
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
      alert(
        error.message ||
          "Hubo un problema al confirmar la reserva. Intenta nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  if (!reserva || !usuario) {
    return (
      <Fondo imageUrl={fondo}>
        <BarraUsuario />
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
          <CajaContenido
            titulo="Reserva no encontrada"
            descripcion="No se encontró una reserva pendiente. Por favor, realiza una nueva."
          >
            <div className="flex justify-center mt-4">
              <Boton
                texto="Volver a reservar"
                onClickOverride={() => navigate("/reservar")}
                bgColor="bg-blue-600"
                textColor="text-white"
                className="px-6 py-2"
              />
            </div>
          </CajaContenido>
        </div>
      </Fondo>
    );
  }

  const { tipo, personas, fecha, hora, comentario, mesa } = reserva;
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Fondo imageUrl={fondo}>
      <BarraUsuario />
      <div className="min-h-screen flex items-center justify-center px-4">
        <CajaContenido
          titulo="Confirmar tu Reserva"
          descripcion="Revisa los detalles antes de confirmar tu reserva."
          tituloSize="text-2xl"
          descripcionSize="text-sm"
          textAlign="text-center"
          glass
        >
          <div className="text-left space-y-2 text-base">
            <p>
              <strong>Servicio:</strong> {tipo}
            </p>
            <p>
              <strong>Personas:</strong> {personas}
            </p>
            <p>
              <strong>Fecha:</strong> {fechaFormateada}
            </p>
            <p>
              <strong>Hora:</strong> {hora}
            </p>
            <p>
              <strong>Mesa:</strong> {mesa}
            </p>
            {comentario && (
              <p>
                <strong>Comentario:</strong> {comentario}
              </p>
            )}
            <p>
              <strong>Usuario:</strong> {usuario.nombre} ({usuario.correo})
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Boton
              texto="Atrás"
              onClickOverride={() => {
                sessionStorage.removeItem("reservaPendiente");
                navigate("/reservar");
              }}
              bgColor="bg-gray-500"
              textColor="text-white"
              className="w-40 h-10"
            />
            <Boton
              texto={cargando ? "Procesando..." : "Reservar ahora"}
              onClickOverride={confirmar}
              bgColor="bg-green-600"
              textColor="text-white"
              className="w-40 h-10"
              disabled={cargando}
            />
          </div>
        </CajaContenido>
      </div>

      {reservaConfirmada && (
        <ModalExito
          mensaje="¡Reserva completada!"
          descripcion="Tu reserva ha sido registrada exitosamente."
          textoBoton="Volver al inicio"
          onClose={() => navigate("/cliente")}
        />
      )}
    </Fondo>
  );
}

export default ConfirmarReserva;
